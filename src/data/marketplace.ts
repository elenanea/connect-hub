export type Enterprise = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  cover: string;
  categories: string[];
  summary: string;
  activity: string;
  mode: "Надавач послуг" | "Виробник товарів" | "Повний цикл";
  address: string;
  phone: string;
  website: string;
  email: string;
  mapLabel: string;
  socials: { telegram?: string; instagram?: string; facebook?: string; linkedin?: string };
  branches: { name: string; address: string; hours: string; phone: string }[];
  services: { title: string; summary: string; category: string; priceFrom: string }[];
  products: { title: string; summary: string; category: string; price: string }[];
  loyalty: { title: string; tier: string; benefit: string; terms: string }[];
  partnershipOffers: { enterpriseSlug: string; title: string; summary: string; type: string }[];
  metrics: { views: number; interactions: number; partnerships: number };
};

export const enterprises: Enterprise[] = [
  {
    id: "1",
    slug: "blueforge-industries",
    name: "BlueForge Industries",
    logo: "BF",
    cover: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    categories: ["Машиностроение", "B2B услуги", "Экспорт"],
    summary: "Производство промышленных узлов, сервисное сопровождение и запуск корпоративных коопераций.",
    activity: "BlueForge Industries сопровождает городские и частные производственные проекты: от подбора компонентов до сервисного обслуживания, аудита цепочки поставок и запуска совместных B2B-программ.",
    mode: "Повний цикл",
    address: "Днепр, просп. Науки, 48",
    phone: "+380 67 220 18 40",
    website: "blueforge.ua",
    email: "hello@blueforge.ua",
    mapLabel: "Google Map: BlueForge Industries",
    socials: {
      telegram: "@blueforge_b2b",
      facebook: "facebook.com/blueforge.ua",
      linkedin: "linkedin.com/company/blueforge",
    },
    branches: [
      { name: "Производственная площадка", address: "Днепр, ул. Промышленная, 12", hours: "Пн–Пт 08:00–18:00", phone: "+380 67 220 18 41" },
      { name: "Шоурум и офис партнёрств", address: "Днепр, просп. Яворницкого, 72", hours: "Пн–Сб 09:00–19:00", phone: "+380 67 220 18 42" },
    ],
    services: [
      { title: "Инжиниринг производственных линий", summary: "Проектирование и модернизация линий для средних и крупных предприятий.", category: "Инжиниринг", priceFrom: "от 85 000 ₴" },
      { title: "Сервис контрактного производства", summary: "Контроль подрядчиков, качество, логистика и сопровождение серийного выпуска.", category: "Операционный менеджмент", priceFrom: "от 42 000 ₴" },
      { title: "Экспортная подготовка", summary: "Сертификация, упаковка, документация и подготовка к тендерам.", category: "Экспорт", priceFrom: "от 28 000 ₴" },
    ],
    products: [
      { title: "Модульный привод BF-200", summary: "Узел для автоматизированных линий и складских комплексов.", category: "Комплектующие", price: "128 000 ₴" },
      { title: "Станция мониторинга LineView", summary: "Контроль KPI производства и предиктивная диагностика.", category: "Промышленный софт", price: "74 000 ₴" },
    ],
    loyalty: [
      { title: "Partner Priority", tier: "Gold", benefit: "До 12% скидки на сервис и приоритет в пилотных проектах", terms: "Для партнёров с оборотом от 1 млн ₴ в квартал." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "civic-urban-labs", title: "Совместные пилоты для smart city", summary: "Ищем партнёров для внедрения сервисных модулей в городские объекты и инфраструктуру.", type: "Городские пилоты" },
      { enterpriseSlug: "northline-logistics", title: "Складская кооперация", summary: "Открыты к интеграции складского и транспортного плеча для экспортных поставок.", type: "Логистика" },
    ],
    metrics: { views: 4820, interactions: 312, partnerships: 26 },
  },
  {
    id: "2",
    slug: "civic-urban-labs",
    name: "Civic Urban Labs",
    logo: "CU",
    cover: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    categories: ["Городские сервисы", "Консалтинг", "Digital"],
    summary: "Команда по запуску городских программ, цифровых сервисов и проектного офисного сопровождения бизнеса.",
    activity: "Civic Urban Labs объединяет бизнес и муниципальные команды вокруг программ сотрудничества, акселерации сервисов, обучения и digital-коммуникаций с жителями и партнёрами.",
    mode: "Надавач послуг",
    address: "Киев, ул. Владимирская, 39",
    phone: "+380 44 280 11 07",
    website: "civiclabs.city",
    email: "team@civiclabs.city",
    mapLabel: "Google Map: Civic Urban Labs",
    socials: {
      instagram: "instagram.com/civiclabs.city",
      facebook: "facebook.com/civiclabs.city",
      linkedin: "linkedin.com/company/civiclabs",
    },
    branches: [
      { name: "Проектный офис", address: "Киев, ул. Саксаганского, 18", hours: "Пн–Пт 09:00–18:30", phone: "+380 44 280 11 08" },
    ],
    services: [
      { title: "B2G фасилитация проектов", summary: "Сопровождение совместных инициатив бизнеса и города.", category: "Консалтинг", priceFrom: "от 36 000 ₴" },
      { title: "Коммуникационные кампании", summary: "Контент, медиа-планирование, публичные события и репутационная поддержка.", category: "Маркетинг", priceFrom: "от 24 000 ₴" },
    ],
    products: [
      { title: "Пакет аналитики городской среды", summary: "Метрики, дашборды и рекомендации для пилотных программ.", category: "Аналитика", price: "18 500 ₴" },
    ],
    loyalty: [
      { title: "Alliance Circle", tier: "Base", benefit: "Приоритетное приглашение на мероприятия и совместные заявки", terms: "Для верифицированных партнёров платформы." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "blueforge-industries", title: "Серия отраслевых событий", summary: "Предлагаем провести совместные B2B-сессии для производителей и подрядчиков города.", type: "Мероприятия" },
    ],
    metrics: { views: 3260, interactions: 228, partnerships: 17 },
  },
  {
    id: "3",
    slug: "northline-logistics",
    name: "Northline Logistics",
    logo: "NL",
    cover: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=80",
    categories: ["Логистика", "Складские решения", "E-commerce"],
    summary: "Фулфилмент, складские мощности и транспортная кооперация для производителей и сервисных компаний.",
    activity: "Northline Logistics помогает локальным предприятиям масштабировать поставки, запускать омниканальные продажи и объединять складскую инфраструктуру с партнёрами по платформе.",
    mode: "Виробник товарів",
    address: "Львов, ул. Городоцкая, 120",
    phone: "+380 32 240 55 77",
    website: "northline.ua",
    email: "partners@northline.ua",
    mapLabel: "Google Map: Northline Logistics",
    socials: {
      telegram: "@northline_partners",
      linkedin: "linkedin.com/company/northline-logistics",
    },
    branches: [
      { name: "Хаб Запад", address: "Львов, ул. Авиационная, 7", hours: "Круглосуточно", phone: "+380 32 240 55 80" },
      { name: "Cross-dock центр", address: "Львов, ул. Шевченко, 311", hours: "Пн–Вс 07:00–23:00", phone: "+380 32 240 55 81" },
    ],
    services: [
      { title: "Фулфилмент B2B/B2C", summary: "Комплектация, упаковка, контроль возвратов и SLA для интернет-каналов.", category: "Логистика", priceFrom: "от 19 ₴/заказ" },
      { title: "Экспортный маршрут под ключ", summary: "Сборные рейсы, таможенное оформление и страхование.", category: "Экспорт", priceFrom: "от 32 000 ₴" },
    ],
    products: [
      { title: "Складской слот 200 м²", summary: "Аренда с WMS и доступом к оператору платформы.", category: "Инфраструктура", price: "58 000 ₴/мес" },
      { title: "Холодная доставка Pharma", summary: "Выделенные маршруты для температурных грузов.", category: "Доставка", price: "по запросу" },
    ],
    loyalty: [
      { title: "Scale Route", tier: "Silver", benefit: "Снижение тарифов на 8% и бесплатный аудит маршрутов", terms: "После 3 месяцев активного сотрудничества." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "blueforge-industries", title: "Контрактный экспортный коридор", summary: "Готовы объединить поставки индустриального оборудования в Польшу и Словакию.", type: "Экспорт" },
    ],
    metrics: { views: 2910, interactions: 184, partnerships: 14 },
  },
];

export const newsItems = [
  {
    title: "Индустриальный форум города",
    date: "24 мая",
    summary: "Обсуждение кооперации предприятий, закупок и совместных экспортных лотов.",
    type: "Событие",
  },
  {
    title: "Грантовая программа для производителей",
    date: "До 30 мая",
    summary: "Поддержка модернизации оборудования и цифровизации производственных процессов.",
    type: "Новости",
  },
  {
    title: "B2B matchmaking week",
    date: "1–7 июня",
    summary: "Серия онлайн-встреч предприятий, сервисных компаний и городской команды развития.",
    type: "Мероприятие",
  },
];

export const interactionsFeed = [
  { label: "Новые партнёрские касания", value: 128, delta: "+18%" },
  { label: "Просмотры карточек предприятий", value: 10990, delta: "+12%" },
  { label: "Запросы в чат", value: 342, delta: "+9%" },
];

export const chatThreads = [
  {
    id: "chat-1",
    title: "BlueForge × Northline",
    partner: "Northline Logistics",
    excerpt: "Отправили обновлённый расчёт по экспортному маршруту.",
    unread: 2,
    messages: [
      { from: "Northline Logistics", role: "partner", text: "Подготовили 2 сценария доставки для июньского лота.", time: "10:14" },
      { from: "Вы", role: "me", text: "Отлично, пришлите детали по страховке и срокам customs clearance.", time: "10:18" },
      { from: "Northline Logistics", role: "partner", text: "Отправили обновлённый расчёт по экспортному маршруту.", time: "10:24" },
    ],
  },
  {
    id: "chat-2",
    title: "Civic Urban Labs",
    partner: "Civic Urban Labs",
    excerpt: "Согласуем сценарий отраслевой встречи с городской администрацией.",
    unread: 0,
    messages: [
      { from: "Civic Urban Labs", role: "partner", text: "Готовы вынести тему городской витрины поставщиков на июньскую сессию.", time: "Вчера" },
      { from: "Вы", role: "me", text: "Поддерживаем. Давайте закрепим список приглашённых компаний.", time: "Вчера" },
    ],
  },
];

export const analyticsSeries = [
  { label: "Пн", enterprises: 42, interactions: 68, views: 210 },
  { label: "Вт", enterprises: 44, interactions: 74, views: 248 },
  { label: "Ср", enterprises: 47, interactions: 88, views: 296 },
  { label: "Чт", enterprises: 49, interactions: 96, views: 338 },
  { label: "Пт", enterprises: 53, interactions: 112, views: 384 },
  { label: "Сб", enterprises: 55, interactions: 105, views: 366 },
  { label: "Вс", enterprises: 57, interactions: 118, views: 402 },
];

export const marketplaceItems = enterprises.flatMap((enterprise) => [
  ...enterprise.products.map((product) => ({
    enterpriseName: enterprise.name,
    enterpriseSlug: enterprise.slug,
    type: "Товар",
    title: product.title,
    summary: product.summary,
    category: product.category,
    price: product.price,
  })),
  ...enterprise.services.map((service) => ({
    enterpriseName: enterprise.name,
    enterpriseSlug: enterprise.slug,
    type: "Услуга",
    title: service.title,
    summary: service.summary,
    category: service.category,
    price: service.priceFrom,
  })),
]);

export const categoryOptions = Array.from(new Set(enterprises.flatMap((enterprise) => enterprise.categories)));
export const serviceModeOptions = ["Все", "Надавач послуг", "Виробник товарів", "Повний цикл"];
export const marketplaceCategories = Array.from(new Set(marketplaceItems.map((item) => item.category)));

export const getEnterpriseBySlug = (slug?: string) => enterprises.find((enterprise) => enterprise.slug === slug) ?? enterprises[0];
export const getEnterpriseByLinkSlug = (slug: string) => enterprises.find((enterprise) => enterprise.slug === slug);
