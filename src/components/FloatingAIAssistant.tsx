import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enterprises, marketplaceItems, newsItems } from "@/data/marketplace";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  results?: SearchResult[];
};

type SearchResult = {
  title: string;
  description: string;
  href: string;
};

type SearchEntry = {
  title: string;
  description: string;
  href: string;
  keywords: string;
  kind: "section" | "enterprise" | "item" | "news" | "opportunity" | "offer";
  date?: string;
};

type RankedResult = {
  score: number;
  entry: SearchEntry;
  result: SearchResult;
};

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultListLike = {
  length: number;
  [index: number]: SpeechRecognitionResultItem;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultListLike;
  };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type VoiceLocale = "auto" | "uk-UA" | "ru-RU" | "en-US";

const VOICE_LOCALE_OPTIONS: { value: VoiceLocale; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "uk-UA", label: "Українська" },
  { value: "ru-RU", label: "Русский" },
  { value: "en-US", label: "English" },
];

const VOICE_LOCALE_STORAGE_KEY = "floating-ai-assistant-voice-locale";
const CONVERSATION_SCORE_THRESHOLD = 4;

const OPPORTUNITY_ENTRIES: SearchEntry[] = [
  {
    title: "Знаходьте партнерів поруч",
    description: "Об'єднуйте підприємства, логістику та сервісних підрядників в єдиний діловий ланцюг.",
    href: "/opportunities",
    keywords: "можливості партнери кооперація логістика підрядники",
    kind: "opportunity",
  },
  {
    title: "Аналітика попиту",
    description: "Відстежуйте інтерес до профілів, динаміку заявок і точки зростання за сегментами ринку.",
    href: "/opportunities",
    keywords: "аналітика попит заявки ринок динаміка",
    kind: "opportunity",
  },
  {
    title: "Комунікація без шуму",
    description: "Запускайте ділові діалоги прямо з каталогу та скорочуйте шлях від інтересу до угоди.",
    href: "/chat",
    keywords: "комунікація чат переговори угода діалог",
    kind: "opportunity",
  },
];

const detectTextLanguage = (text: string): Exclude<VoiceLocale, "auto"> => {
  const lower = text.toLowerCase();

  if (/[a-z]/.test(lower) && !/[а-яіїєґ]/i.test(lower)) {
    return "en-US";
  }

  if (/[ыэъ]/i.test(lower)) {
    return "ru-RU";
  }

  if (/[іїєґ]/i.test(lower)) {
    return "uk-UA";
  }

  if (/[а-я]/i.test(lower)) {
    return "ru-RU";
  }

  return "uk-UA";
};

const resolveRecognitionLanguage = (voiceLocale: VoiceLocale): Exclude<VoiceLocale, "auto"> => {
  if (voiceLocale !== "auto") {
    return voiceLocale;
  }

  if (typeof navigator === "undefined") {
    return "uk-UA";
  }

  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean).map((lang) => lang.toLowerCase());
  if (candidates.some((lang) => lang.startsWith("uk"))) {
    return "uk-UA";
  }
  if (candidates.some((lang) => lang.startsWith("ru"))) {
    return "ru-RU";
  }
  if (candidates.some((lang) => lang.startsWith("en"))) {
    return "en-US";
  }

  return "uk-UA";
};

const pickMostNaturalVoice = (voices: SpeechSynthesisVoice[], locale: Exclude<VoiceLocale, "auto">): SpeechSynthesisVoice | null => {
  if (!voices.length) {
    return null;
  }

  const localePrefix = locale.slice(0, 2).toLowerCase();
  const matchingVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(localePrefix));
  const candidates = matchingVoices.length > 0 ? matchingVoices : voices;

  const scored = candidates
    .map((voice) => {
      const name = voice.name.toLowerCase();
      let score = 0;

      if (name.includes("neural") || name.includes("natural")) score += 7;
      if (name.includes("google") || name.includes("microsoft")) score += 5;
      if (name.includes("premium") || name.includes("enhanced")) score += 3;
      if (!voice.localService) score += 2;
      if (voice.default) score += 2;

      return { voice, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.voice ?? null;
};

const normalizeTextForSpeech = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .replace(/\"/g, "")
    .replace(/\//g, " або ")
    .replace(/\bAI\b/g, "ей ай")
    .trim();
};

const buildSpeechScript = (text: string, results?: SearchResult[]): string => {
  const normalizedText = normalizeTextForSpeech(text);
  const hasEndPunctuation = /[.!?]$/.test(normalizedText);
  const base = hasEndPunctuation ? normalizedText : `${normalizedText}.`;

  if (!results || results.length === 0) {
    return base;
  }

  const topTitles = results
    .slice(0, 3)
    .map((item) => item.title)
    .join(", ");

  return `${base} Знайдено ${results.length} варіантів. Серед них: ${topTitles}.`;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Привiт! Я AI-асистент платформи. Можу шукати по сайту: напишiть, наприклад, 'знайди логiстику' або 'пошук аналітика'.",
  },
];

const SECTION_ENTRIES: SearchEntry[] = [
  {
    title: "Головна сторінка",
    description: "Огляд платформи та основні розділи.",
    href: "/",
    keywords: "головна старт home",
    kind: "section",
  },
  {
    title: "Каталог підприємств",
    description: "Пошук компаній, фільтри за категоріями та типом.",
    href: "/enterprises",
    keywords: "підприємства компанії каталог бізнес",
    kind: "section",
  },
  {
    title: "Маркетплейс",
    description: "Товари та послуги підприємств з фільтрами.",
    href: "/marketplace",
    keywords: "маркетплейс товари послуги купити",
    kind: "section",
  },
  {
    title: "Новини",
    description: "Актуальні новини, події та анонси.",
    href: "/news",
    keywords: "новини події анонси",
    kind: "section",
  },
  {
    title: "Можливості",
    description: "Партнерські напрями та програми співпраці.",
    href: "/opportunities",
    keywords: "можливості партнерство гранти співпраця",
    kind: "section",
  },
  {
    title: "Аналітика",
    description: "Дані, метрики та аналітичні інсайти.",
    href: "/analytics",
    keywords: "аналітика метрики статистика",
    kind: "section",
  },
  {
    title: "Чат",
    description: "Ділове листування між учасниками платформи.",
    href: "/chat",
    keywords: "чат повідомлення комунікація",
    kind: "section",
  },
];

const SEARCH_INTENT_PATTERN = /(знайд|найд|пошук|поиск|search|шукай|пошукай|де знайти|где найти)/i;
const TOP_PARTNERS_INTENT_PATTERN = /(більше\s+вс(іх|ех).*партнер|больше\s+вс(ех|его).*партнер|найбільше\s+партнер|больше\s+партнер|топ.*партнер|лідер.*партнер|лидер.*партнер|most.*partner)/i;
const TOP_VIEWS_INTENT_PATTERN = /(більше\s+вс(іх|ех).*перегляд|больше\s+вс(ех|его).*просмотр|найбільше\s+перегляд|топ.*перегляд|лидер.*просмотр|лідер.*перегляд)/i;
const TOP_INTERACTIONS_INTENT_PATTERN = /(більше\s+вс(іх|ех).*взаємод|больше\s+вс(ех|его).*взаимодейств|найбільше\s+взаємод|топ.*взаємод|лидер.*взаимодейств)/i;
const WHEN_INTENT_PATTERN = /(коли|когда|when|дата)/i;
const CONTACT_INTENT_PATTERN = /(контакт|телефон|почта|email|e-mail|сайт|website|зв'яж|связ|contact)/i;

const extractSearchQuery = (prompt: string): string => {
  return prompt
    .toLowerCase()
    .replace(/^(будь ласка|пожалуйста|please)\s+/i, "")
    .replace(/(знайди|найди|пошук|поиск|search|шукай|пошукай|де знайти|где найти)/gi, "")
    .replace(/[?!.,:;]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const extractConversationalQuery = (prompt: string): string => {
  return prompt
    .toLowerCase()
    .replace(/[?!.,:;]+/g, " ")
    .replace(/\b(скажи|подскажи|розкажи|расскажи|покажи|please|будь ласка|пожалуйста)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const buildSearchIndex = (): SearchEntry[] => {
  const enterpriseEntries: SearchEntry[] = enterprises.map((enterprise) => ({
    title: enterprise.name,
    description: `${enterprise.summary} · ${enterprise.categories.join(", ")} · ${enterprise.phone}`,
    href: `/enterprise/${enterprise.slug}`,
    kind: "enterprise",
    keywords: [
      enterprise.name,
      enterprise.summary,
      enterprise.activity,
      enterprise.address,
      enterprise.phone,
      enterprise.email,
      enterprise.website,
      ...enterprise.categories,
      ...enterprise.services.map((service) => `${service.title} ${service.category}`),
      ...enterprise.products.map((product) => `${product.title} ${product.category}`),
    ]
      .join(" ")
      .toLowerCase(),
  }));

  const itemEntries: SearchEntry[] = marketplaceItems.map((item) => ({
    title: `${item.type}: ${item.title}`,
    description: `${item.enterpriseName} · ${item.category} · ${item.price}`,
    href: `/marketplace/${item.enterpriseSlug}/${item.type}/${item.itemSlug}`,
    kind: "item",
    keywords: [item.title, item.summary, item.enterpriseName, item.category, item.type].join(" ").toLowerCase(),
  }));

  const newsEntries: SearchEntry[] = newsItems.map((news) => ({
    title: news.title,
    description: `${news.type} · ${news.date} · ${news.summary}`,
    href: `/news/${news.slug}`,
    kind: "news",
    date: news.date,
    keywords: [news.title, news.summary, news.type, news.date, news.content].join(" ").toLowerCase(),
  }));

  const offerEntries: SearchEntry[] = enterprises.flatMap((enterprise) =>
    enterprise.partnershipOffers.map((offer) => ({
      title: `${offer.title}`,
      description: `${enterprise.name} · ${offer.type} · ${offer.summary}`,
      href: `/enterprise/${enterprise.slug}`,
      kind: "offer" as const,
      keywords: [enterprise.name, offer.title, offer.summary, offer.type, "партнерство", "кооперація"].join(" ").toLowerCase(),
    })),
  );

  return [...SECTION_ENTRIES, ...OPPORTUNITY_ENTRIES, ...enterpriseEntries, ...itemEntries, ...newsEntries, ...offerEntries];
};

const rankAndSearch = (query: string, index: SearchEntry[]): SearchResult[] => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return SECTION_ENTRIES.slice(0, 5).map(({ title, description, href }) => ({ title, description, href }));
  }

  const terms = normalized.split(" ").filter(Boolean);

  return index
    .map((entry) => {
      const titleMatch = entry.title.toLowerCase().includes(normalized) ? 6 : 0;
      const descriptionMatch = entry.description.toLowerCase().includes(normalized) ? 3 : 0;
      const termScore = terms.reduce((score, term) => {
        if (entry.title.toLowerCase().includes(term)) return score + 3;
        if (entry.keywords.includes(term)) return score + 1;
        return score;
      }, 0);

      return {
        score: titleMatch + descriptionMatch + termScore,
        result: {
          title: entry.title,
          description: entry.description,
          href: entry.href,
        },
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.result);
};

const rankContent = (query: string, index: SearchEntry[]): RankedResult[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const terms = normalized.split(" ").filter((term) => term.length > 1);

  return index
    .map((entry) => {
      const titleLower = entry.title.toLowerCase();
      const descriptionLower = entry.description.toLowerCase();
      const exactMatch = titleLower.includes(normalized) || descriptionLower.includes(normalized) ? 5 : 0;
      const termScore = terms.reduce((score, term) => {
        if (titleLower.includes(term)) return score + 3;
        if (descriptionLower.includes(term)) return score + 2;
        if (entry.keywords.includes(term)) return score + 1;
        return score;
      }, 0);

      const score = exactMatch + termScore;
      return {
        score,
        entry,
        result: {
          title: entry.title,
          description: entry.description,
          href: entry.href,
        },
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

const assistantReply = (prompt: string): Omit<Message, "id" | "role"> => {
  const normalized = prompt.toLowerCase();
  const knowledgeIndex = buildSearchIndex();

  const topByPartnerships = [...enterprises]
    .sort((a, b) => b.metrics.partnerships - a.metrics.partnerships)
    .slice(0, 3);

  const topByViews = [...enterprises]
    .sort((a, b) => b.metrics.views - a.metrics.views)
    .slice(0, 3);

  const topByInteractions = [...enterprises]
    .sort((a, b) => b.metrics.interactions - a.metrics.interactions)
    .slice(0, 3);

  if (TOP_PARTNERS_INTENT_PATTERN.test(normalized)) {
    const leader = topByPartnerships[0];
    return {
      text: `Лідер за кількістю партнерств: ${leader.name} (${leader.metrics.partnerships}). Також у топі: ${topByPartnerships[1].name} (${topByPartnerships[1].metrics.partnerships}) та ${topByPartnerships[2].name} (${topByPartnerships[2].metrics.partnerships}).`,
      results: topByPartnerships.map((enterprise) => ({
        title: `${enterprise.name} · партнерств: ${enterprise.metrics.partnerships}`,
        description: enterprise.summary,
        href: `/enterprise/${enterprise.slug}`,
      })),
    };
  }

  if (TOP_VIEWS_INTENT_PATTERN.test(normalized)) {
    const leader = topByViews[0];
    return {
      text: `Лідер за переглядами: ${leader.name} (${leader.metrics.views}). Хочете, покажу повний рейтинг?`,
      results: topByViews.map((enterprise) => ({
        title: `${enterprise.name} · переглядів: ${enterprise.metrics.views}`,
        description: enterprise.summary,
        href: `/enterprise/${enterprise.slug}`,
      })),
    };
  }

  if (TOP_INTERACTIONS_INTENT_PATTERN.test(normalized)) {
    const leader = topByInteractions[0];
    return {
      text: `Лідер за взаємодіями: ${leader.name} (${leader.metrics.interactions}). Також можу порівняти конкретні підприємства між собою.`,
      results: topByInteractions.map((enterprise) => ({
        title: `${enterprise.name} · взаємодій: ${enterprise.metrics.interactions}`,
        description: enterprise.summary,
        href: `/enterprise/${enterprise.slug}`,
      })),
    };
  }

  const conversationalQuery = extractConversationalQuery(prompt);
  const rankedConversational = rankContent(conversationalQuery, knowledgeIndex);
  const bestMatch = rankedConversational[0];

  if (bestMatch && bestMatch.score >= CONVERSATION_SCORE_THRESHOLD) {
    if (WHEN_INTENT_PATTERN.test(normalized) && bestMatch.entry.kind === "news" && bestMatch.entry.date) {
      return {
        text: `Подія \"${bestMatch.entry.title}\" запланована на ${bestMatch.entry.date}. Якщо хочете, покажу ще схожі новини.`,
        results: rankedConversational.slice(0, 3).map((item) => item.result),
      };
    }

    if (CONTACT_INTENT_PATTERN.test(normalized) && bestMatch.entry.kind === "enterprise") {
      return {
        text: `Знайшов контакти для ${bestMatch.entry.title}. Відкрийте картку підприємства, там є телефон, email, сайт та адреса.`,
        results: rankedConversational.slice(0, 3).map((item) => item.result),
      };
    }

    return {
      text: `Знайшов релевантну відповідь по вашому запиту. Ось найкращі варіанти:`,
      results: rankedConversational.slice(0, 4).map((item) => item.result),
    };
  }

  if (SEARCH_INTENT_PATTERN.test(normalized)) {
    const query = extractSearchQuery(prompt);
    const results = rankAndSearch(query, knowledgeIndex);

    if (results.length === 0) {
      return {
        text: `За запитом \"${query || "..."}\" нічого не знайдено. Спробуйте інші ключові слова: логістика, аналітика, пакування, новини.`,
      };
    }

    return {
      text: query
        ? `Знайшов результати за запитом \"${query}\". Відкрийте потрібний розділ:`
        : "Ось основні розділи сайту, де можна почати пошук:",
      results,
    };
  }

  if (normalized.includes("товар") || normalized.includes("послуг")) {
    return {
      text: "Вiдкрийте роздiл \"Товари та послуги\" у головному меню. Там можна фiльтрувати пропозицiї та перейти до профiлю постачальника.",
      results: [
        {
          title: "Каталог товарів і послуг",
          description: "Переглянути всі пропозиції маркетплейсу.",
          href: "/marketplace",
        },
      ],
    };
  }

  if (normalized.includes("пiдприєм") || normalized.includes("компан")) {
    return {
      text: "Каталог пiдприємств доступний у роздiлi \"Пiдприємства\". Там є профiлi, контакти та сценарiї спiвпрацi.",
      results: [
        {
          title: "Каталог підприємств",
          description: "Знайти компанію за назвою, категорією або адресою.",
          href: "/enterprises",
        },
      ],
    };
  }

  if (normalized.includes("новин") || normalized.includes("подi")) {
    return {
      text: "Новини та подiї зiбранi на сторiнцi \"Новини\". Там ви знайдете актуальнi анонси та публiкацiї.",
      results: [
        {
          title: "Усі новини",
          description: "Останні новини та події платформи.",
          href: "/news",
        },
      ],
    };
  }

  return {
    text: "Розумію ваш запит частково, але не знайшов точну відповідь. Спробуйте перефразувати коротше: тема + дія, наприклад \"коли ярмарок 2026\", \"контакти BlueForge\", \"хто лідер за партнерствами\".",
  };
};

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [voiceLocale, setVoiceLocale] = useState<VoiceLocale>("auto");
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedLocale = window.localStorage.getItem(VOICE_LOCALE_STORAGE_KEY);
    if (!savedLocale) {
      return;
    }

    const isKnownLocale = VOICE_LOCALE_OPTIONS.some((option) => option.value === savedLocale);
    if (isKnownLocale) {
      setVoiceLocale(savedLocale as VoiceLocale);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(VOICE_LOCALE_STORAGE_KEY, voiceLocale);
  }, [voiceLocale]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setSpeechVoices(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const appendAssistantMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text,
      },
    ]);
  };

  const speakText = (text: string, results?: SearchResult[]) => {
    if (!voiceOutputEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const effectiveLocale = voiceLocale === "auto" ? detectTextLanguage(text) : voiceLocale;
    const selectedVoice = pickMostNaturalVoice(speechVoices, effectiveLocale);
    const script = buildSpeechScript(text, results);
    const chunks = script.match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) ?? [script];

    window.speechSynthesis.cancel();

    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = effectiveLocale;
      utterance.rate = Math.min(1.04, 0.95 + index * 0.02);
      utterance.pitch = 1.03;
      utterance.volume = 1;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    });
  };

  const sendPrompt = (prompt: string) => {
    const trimmed = prompt.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const reply = assistantReply(trimmed);
    const botMessage: Message = {
      id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: "assistant",
      text: reply.text,
      results: reply.results,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
    speakText(reply.text, reply.results);
  };

  const getSpeechRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const startListening = () => {
    const RecognitionCtor = getSpeechRecognitionConstructor();

    if (!RecognitionCtor) {
      appendAssistantMessage("Голосовий ввід не підтримується у цьому браузері. Спробуйте Google Chrome або Edge.");
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.lang = resolveRecognitionLanguage(voiceLocale);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) {
        return;
      }
      setInput(transcript);
      sendPrompt(transcript);
    };

    recognition.onerror = () => {
      appendAssistantMessage("Не вдалося розпізнати голос. Спробуйте ще раз або введіть запит текстом.");
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(input);
  };

  const messageCount = useMemo(() => messages.length, [messages.length]);

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {isOpen && (
        <section className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">AI-асистент</p>
                <p className="mt-1 text-xs text-muted-foreground">Онлайн · {messageCount} повiдомлень</p>
                {isListening && <p className="mt-1 text-xs text-primary">Слухаю вас...</p>}
              </div>
            </div>
            <Button type="button" size="icon" variant="ghost" onClick={toggleOpen} aria-label="Закрити чат">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "assistant"
                    ? "max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm leading-6"
                    : "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm leading-6 text-primary-foreground"
                }
              >
                <p>{message.text}</p>
                {message.role === "assistant" && message.results && message.results.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.results.map((result) => (
                      <Link
                        key={`${message.id}-${result.href}-${result.title}`}
                        to={result.href}
                        className="block rounded-xl border border-border/70 bg-background/90 px-3 py-2 transition-colors hover:border-primary/40 hover:bg-background"
                      >
                        <p className="text-sm font-medium text-foreground">{result.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{result.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <form className="border-t border-border/70 p-3" onSubmit={onSubmit}>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "default" : "outline"}
                aria-label={isListening ? "Зупинити голосовий ввід" : "Увімкнути голосовий ввід"}
                onClick={handleMicClick}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Напишiть повiдомлення..."
                aria-label="Повiдомлення для AI-асистента"
              />
              <Button
                type="button"
                size="icon"
                variant={voiceOutputEnabled ? "default" : "outline"}
                aria-label={voiceOutputEnabled ? "Вимкнути озвучення" : "Увімкнути озвучення"}
                onClick={() => setVoiceOutputEnabled((prev) => !prev)}
              >
                {voiceOutputEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button type="submit" size="icon" aria-label="Надiслати повiдомлення" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Мова голосу</span>
              <select
                value={voiceLocale}
                onChange={(event) => setVoiceLocale(event.target.value as VoiceLocale)}
                disabled={isListening}
                aria-label="Вибір мови голосового режиму"
                className="h-8 rounded-md border border-border/70 bg-background px-2 text-xs outline-none"
              >
                {VOICE_LOCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </section>
      )}

      <Button
        type="button"
        className="h-14 w-14 rounded-full shadow-xl"
        onClick={toggleOpen}
        aria-label={isOpen ? "Закрити AI-асистента" : "Вiдкрити AI-асистента"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {!isOpen && (
        <div className="pointer-events-none absolute -left-2 -top-2 inline-flex items-center gap-1 rounded-full border border-primary/25 bg-background/90 px-2 py-1 text-[11px] font-medium text-primary shadow-sm backdrop-blur">
          <Bot className="h-3.5 w-3.5" />
          AI
        </div>
      )}
    </div>
  );
};

export default FloatingAIAssistant;