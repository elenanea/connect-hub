import blueforgeCover from "@/assets/enterprise-blueforge.jpg";
import civicCover from "@/assets/enterprise-civic.jpg";
import northlineCover from "@/assets/enterprise-northline.jpg";

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
    cover: blueforgeCover,
    categories: ["Машинобудування", "B2B послуги", "Експорт"],
    summary: "Виробництво промислових вузлів, сервісний супровід і запуск корпоративних кооперацій.",
    activity: "BlueForge Industries супроводжує міські та приватні виробничі проєкти: від підбору компонентів до сервісного обслуговування, аудиту ланцюга постачання та запуску спільних B2B-програм.",
    mode: "Повний цикл",
    address: "Суми, вул. Харківська, 46",
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
      { name: "Виробничий майданчик", address: "Суми, вул. Лінійна, 15", hours: "Пн–Пт 08:00–18:00", phone: "+380 67 220 18 41" },
      { name: "Шоурум і офіс партнерств", address: "Суми, вул. Петропавлівська, 78", hours: "Пн–Сб 09:00–19:00", phone: "+380 67 220 18 42" },
    ],
    services: [
      { title: "Базова виробнича консультація", summary: "Швидкий аудит запиту, підбір формату співпраці та первинні рекомендації для запуску проєкту.", category: "Консалтинг", priceFrom: "від 1 000 грн" },
      { title: "Інжиніринг виробничих ліній", summary: "Проєктування та модернізація ліній для середніх і великих підприємств.", category: "Інжиніринг", priceFrom: "від 85 000 ₴" },
      { title: "Сервіс контрактного виробництва", summary: "Контроль підрядників, якість, логістика та супровід серійного випуску.", category: "Операційний менеджмент", priceFrom: "від 42 000 ₴" },
      { title: "Експортна підготовка", summary: "Сертифікація, пакування, документація та підготовка до тендерів.", category: "Експорт", priceFrom: "від 28 000 ₴" },
    ],
    products: [
      { title: "Модульний привід BF-200", summary: "Вузол для автоматизованих ліній і складських комплексів.", category: "Комплектуючі", price: "128 000 ₴" },
      { title: "Станція моніторингу LineView", summary: "Контроль KPI виробництва та предиктивна діагностика.", category: "Промисловий софт", price: "74 000 ₴" },
      { title: "Сітка рабиця", summary: "Оцинкована зварна сітка для огорож, будівництва та промислових об'єктів. Виготовляється у різних розмірах вічка та товщині дроту.", category: "Металовироби", price: "від 180 ₴/м²" },
    ],
    loyalty: [
      { title: "Partner Priority", tier: "Gold", benefit: "Стань партнером і отримай 10% знижки на товари та послуги.", terms: "" },
    ],
    partnershipOffers: [
      { enterpriseSlug: "civic-urban-labs", title: "Спільні пілоти для smart city", summary: "Шукаємо партнерів для впровадження сервісних модулів у міські об'єкти та інфраструктуру.", type: "Міські пілоти" },
      { enterpriseSlug: "northline-logistics", title: "Складська кооперація", summary: "Відкриті до інтеграції складського і транспортного плеча для експортних поставок.", type: "Логістика" },
    ],
    metrics: { views: 4820, interactions: 312, partnerships: 26 },
  },
  {
    id: "2",
    slug: "civic-urban-labs",
    name: "Civic Urban Labs",
    logo: "CU",
    cover: civicCover,
    categories: ["Міські сервіси", "Консалтинг", "Digital"],
    summary: "Команда для запуску міських програм, цифрових сервісів і проєктного супроводу бізнесу.",
    activity: "Civic Urban Labs об'єднує бізнес і муніципальні команди навколо програм співпраці, акселерації сервісів, навчання та digital-комунікацій із мешканцями й партнерами.",
    mode: "Надавач послуг",
    address: "Конотоп, просп. Миру, 21",
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
      { name: "Проєктний офіс", address: "Конотоп, вул. Соборна, 12", hours: "Пн–Пт 09:00–18:30", phone: "+380 44 280 11 08" },
    ],
    services: [
      { title: "B2G фасилітація проєктів", summary: "Супровід спільних ініціатив бізнесу та міста.", category: "Консалтинг", priceFrom: "від 36 000 ₴" },
      { title: "Комунікаційні кампанії", summary: "Контент, медіапланування, публічні події та репутаційна підтримка.", category: "Маркетинг", priceFrom: "від 24 000 ₴" },
    ],
    products: [
      { title: "Пакет аналітики міського середовища", summary: "Метрики, дашборди та рекомендації для пілотних програм.", category: "Аналітика", price: "18 500 ₴" },
    ],
    loyalty: [
      { title: "Alliance Circle", tier: "Base", benefit: "Пріоритетні запрошення на події та спільні заявки", terms: "Для верифікованих партнерів платформи." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "blueforge-industries", title: "Серія галузевих подій", summary: "Пропонуємо провести спільні B2B-сесії для виробників і підрядників міста.", type: "Події" },
    ],
    metrics: { views: 3260, interactions: 228, partnerships: 17 },
  },
  {
    id: "3",
    slug: "northline-logistics",
    name: "Northline Logistics",
    logo: "NL",
    cover: northlineCover,
    categories: ["Логістика", "Складські рішення", "E-commerce"],
    summary: "Фулфілмент, складські потужності та транспортна кооперація для виробників і сервісних компаній.",
    activity: "Northline Logistics допомагає локальним підприємствам масштабувати постачання, запускати омніканальні продажі та об'єднувати складську інфраструктуру з партнерами платформи.",
    mode: "Виробник товарів",
    address: "Шостка, вул. Свободи, 33",
    phone: "+380 32 240 55 77",
    website: "northline.ua",
    email: "partners@northline.ua",
    mapLabel: "Google Map: Northline Logistics",
    socials: {
      telegram: "@northline_partners",
      linkedin: "linkedin.com/company/northline-logistics",
    },
    branches: [
      { name: "Хаб Північ", address: "Шостка, вул. Знаменська, 5", hours: "Цілодобово", phone: "+380 32 240 55 80" },
      { name: "Cross-dock центр", address: "Охтирка, вул. Київська, 44", hours: "Пн–Нд 07:00–23:00", phone: "+380 32 240 55 81" },
    ],
    services: [
      { title: "Фулфілмент B2B/B2C", summary: "Комплектація, пакування, контроль повернень і SLA для онлайн-каналів.", category: "Логістика", priceFrom: "від 19 ₴/замовлення" },
      { title: "Експортний маршрут під ключ", summary: "Збірні рейси, митне оформлення та страхування.", category: "Експорт", priceFrom: "від 32 000 ₴" },
    ],
    products: [
      { title: "Складський слот 200 м²", summary: "Оренда з WMS і доступом до оператора платформи.", category: "Інфраструктура", price: "58 000 ₴/міс" },
      { title: "Холодна доставка Pharma", summary: "Виділені маршрути для температурних вантажів.", category: "Доставка", price: "за запитом" },
    ],
    loyalty: [
      { title: "Scale Route", tier: "Silver", benefit: "Зниження тарифів на 8% і безкоштовний аудит маршрутів", terms: "Після 3 місяців активної співпраці." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "blueforge-industries", title: "Контрактний експортний коридор", summary: "Готові об'єднати постачання індустріального обладнання до Польщі та Словаччини.", type: "Експорт" },
    ],
    metrics: { views: 2910, interactions: 184, partnerships: 14 },
  },
  {
    id: "4",
    slug: "solargrid-systems",
    name: "SolarGrid Systems",
    logo: "SG",
    cover: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1600",
    categories: ["Енергетика", "B2B інфраструктура", "Енергоефективність"],
    summary: "Промислові сонячні рішення, енергоаудит та впровадження автономних енергосистем для бізнесу.",
    activity: "SolarGrid Systems проєктує та встановлює гібридні енергетичні системи для виробництва, логістичних хабів і комерційних об'єктів, допомагаючи підприємствам зменшувати витрати та залежність від зовнішніх джерел енергії.",
    mode: "Надавач послуг",
    address: "Суми, вул. Героїв Крут, 19",
    phone: "+380 50 411 27 60",
    website: "solargrid.ua",
    email: "partners@solargrid.ua",
    mapLabel: "Google Map: SolarGrid Systems",
    socials: {
      telegram: "@solargrid_biz",
      facebook: "facebook.com/solargrid.ua",
      linkedin: "linkedin.com/company/solargrid-systems",
    },
    branches: [
      { name: "Інженерний офіс", address: "Суми, вул. Іллінська, 7", hours: "Пн–Пт 09:00–18:00", phone: "+380 50 411 27 61" },
    ],
    services: [
      { title: "Енергоаудит підприємства", summary: "Аналіз споживання, сценарії зниження витрат і підготовка інвестплану.", category: "Енергоефективність", priceFrom: "від 22 000 ₴" },
      { title: "Проєктування solar roof", summary: "Рішення для дахових і наземних сонячних станцій під виробничі об'єкти.", category: "Енергетика", priceFrom: "від 64 000 ₴" },
    ],
    products: [
      { title: "Інверторний модуль SG-50", summary: "Керування промисловими сонячними масивами та накопиченням енергії.", category: "Обладнання", price: "96 000 ₴" },
    ],
    loyalty: [
      { title: "Energy Partner", tier: "Silver", benefit: "Знижка 7% на повторні проєкти та сервісний моніторинг", terms: "Для клієнтів з двома і більше об'єктами." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "northline-logistics", title: "Енергонезалежні логістичні хаби", summary: "Шукаємо пілотні об'єкти для встановлення гібридних систем живлення складів.", type: "Інфраструктура" },
    ],
    metrics: { views: 2540, interactions: 149, partnerships: 9 },
  },
  {
    id: "5",
    slug: "packform-studio",
    name: "PackForm Studio",
    logo: "PF",
    cover: "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1600",
    categories: ["Пакування", "Дизайн", "Виробництво"],
    summary: "Розробка брендової упаковки, POS-матеріалів і малих виробничих серій для локальних брендів.",
    activity: "PackForm Studio створює упаковку для B2B і retail-клієнтів: від концепції та дизайну до друку, прототипування й тиражування малих серій для виробників харчових, технічних і FMCG-товарів.",
    mode: "Повний цикл",
    address: "Ромни, вул. Декабристів, 14",
    phone: "+380 67 302 55 10",
    website: "packform.design",
    email: "hello@packform.design",
    mapLabel: "Google Map: PackForm Studio",
    socials: {
      instagram: "instagram.com/packform.design",
      facebook: "facebook.com/packform.design",
    },
    branches: [
      { name: "Студія та production lab", address: "Ромни, вул. Коржівська, 44", hours: "Пн–Сб 10:00–19:00", phone: "+380 67 302 55 11" },
    ],
    services: [
      { title: "Дизайн упаковки", summary: "Айдентика, макети, підготовка до друку та серійного запуску.", category: "Дизайн", priceFrom: "від 18 000 ₴" },
      { title: "Прототипування серій", summary: "Швидкий запуск тестових серій упаковки для нових лінійок продуктів.", category: "Пакування", priceFrom: "від 11 500 ₴" },
    ],
    products: [
      { title: "Eco Box Retail S", summary: "Екологічна упаковка для невеликих партій товару з кастомним друком.", category: "Пакування", price: "34 ₴/шт" },
      { title: "POS-kit Brand Stand", summary: "Комплект вітринних матеріалів для локальних продажів і виставок.", category: "Маркетинг", price: "12 800 ₴" },
    ],
    loyalty: [
      { title: "Launch Support", tier: "Base", benefit: "Безкоштовне оновлення макетів у межах однієї серії", terms: "Для клієнтів з повторним замовленням протягом 60 днів." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "blueforge-industries", title: "Промислова упаковка для експорту", summary: "Працюємо з технічною документацією та багатомовним маркуванням для експортних партій.", type: "Пакування" },
    ],
    metrics: { views: 2180, interactions: 137, partnerships: 11 },
  },
  {
    id: "6",
    slug: "dataharbor-analytics",
    name: "DataHarbor Analytics",
    logo: "DH",
    cover: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1600",
    categories: ["Аналітика", "BI", "Digital"],
    summary: "BI-рішення, дашборди та інтеграція даних для підприємств, що масштабують продажі та операції.",
    activity: "DataHarbor Analytics допомагає підприємствам об'єднувати дані з ERP, CRM, маркетплейсів і складських систем у єдину BI-модель для прийняття оперативних і стратегічних рішень.",
    mode: "Надавач послуг",
    address: "Суми, вул. Воскресенська, 11",
    phone: "+380 93 540 14 80",
    website: "dataharbor.ai",
    email: "contact@dataharbor.ai",
    mapLabel: "Google Map: DataHarbor Analytics",
    socials: {
      linkedin: "linkedin.com/company/dataharbor-analytics",
      telegram: "@dataharbor_team",
    },
    branches: [
      { name: "BI Hub", address: "Суми, вул. Троїцька, 2", hours: "Пн–Пт 09:30–18:30", phone: "+380 93 540 14 81" },
    ],
    services: [
      { title: "BI-dashboard під ключ", summary: "Моделювання показників, візуалізація та доступ для команд продажу й операцій.", category: "Аналітика", priceFrom: "від 46 000 ₴" },
      { title: "Data audit для e-commerce", summary: "Ревізія даних, інтеграцій і якості показників перед масштабуванням.", category: "Digital", priceFrom: "від 21 000 ₴" },
    ],
    products: [
      { title: "Sales Pulse Dashboard", summary: "Шаблон дашборду для відстеження продажів, маржі та конверсій за каналами.", category: "BI", price: "29 000 ₴" },
    ],
    loyalty: [
      { title: "Insight Club", tier: "Gold", benefit: "Щомісячні стратегічні сесії та пріоритет у support backlog", terms: "Для компаній із річним контрактом." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "civic-urban-labs", title: "Спільні міські дашборди", summary: "Готові підсилити міські та бізнесові програми єдиною BI-аналітикою.", type: "BI" },
    ],
    metrics: { views: 1985, interactions: 126, partnerships: 8 },
  },
  {
    id: "7",
    slug: "agronova-processing",
    name: "AgroNova Processing",
    logo: "AN",
    cover: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1600",
    categories: ["Агропереробка", "Експорт", "Харчове виробництво"],
    summary: "Переробка агросировини, private label і контрактні партії для локального та експортного ринку.",
    activity: "AgroNova Processing працює з локальними виробниками сировини й ритейл-брендами, запускаючи контрактні партії переробленої продукції, експортне пакування та сертифікацію для нових ринків.",
    mode: "Виробник товарів",
    address: "Глухів, вул. Індустріальна, 8",
    phone: "+380 68 770 02 14",
    website: "agronova.ua",
    email: "export@agronova.ua",
    mapLabel: "Google Map: AgroNova Processing",
    socials: {
      facebook: "facebook.com/agronova.ua",
      linkedin: "linkedin.com/company/agronova-processing",
    },
    branches: [
      { name: "Виробнича лінія", address: "Глухів, вул. Заводська, 2", hours: "Пн–Пт 08:00–17:00", phone: "+380 68 770 02 15" },
    ],
    services: [
      { title: "Контрактна фасовка", summary: "Фасування сипучих і пастоподібних продуктів під private label.", category: "Агропереробка", priceFrom: "від 14 000 ₴" },
      { title: "Підготовка до експорту", summary: "Маркування, сертифікація та партійні документи для ринків ЄС.", category: "Експорт", priceFrom: "від 27 000 ₴" },
    ],
    products: [
      { title: "Protein Mix Base", summary: "Базова суміш для функціонального харчування та private label-проєктів.", category: "Харчове виробництво", price: "86 ₴/кг" },
      { title: "Freeze-dry Berry Pack", summary: "Ліофілізована ягода для HoReCa та e-commerce каналів.", category: "Експорт", price: "за запитом" },
    ],
    loyalty: [
      { title: "Scale Batch", tier: "Silver", benefit: "Пріоритетне бронювання виробничих слотів", terms: "Для партнерів із квартальним обсягом від 5 тонн." },
    ],
    partnershipOffers: [
      { enterpriseSlug: "northline-logistics", title: "Експортні харчові партії", summary: "Шукаємо логістичних партнерів для регулярних відправок до Польщі та Румунії.", type: "Експорт" },
    ],
    metrics: { views: 2670, interactions: 163, partnerships: 12 },
  },
];

export const newsItems = [
  {
    slug: "yarmarka-2026",
    title: "Ярмарок підприємців Сумщини — 2026",
    date: "15 травня 2026",
    summary: "Сумська обласна рада запрошує підприємців і виробників до участі у регіональній ярмарці. Захід об'єднає понад 200 учасників з різних галузей: харчова промисловість, легка промисловість, агросектор і послуги.",
    type: "Подія",
    image: "/news/yarmarka.jpg",
    content: `Сумська обласна рада спільно з регіональними торгово-промисловими асоціаціями проводить щорічний ярмарок підприємців Сумщини — 2026.

Захід відбудеться 15 травня 2026 року на центральній площі Сум та об'єднає понад 200 учасників з різних галузей: харчова та легка промисловість, агросектор, будівельні матеріали, ремісничі вироби та сфера послуг.

**Для кого ця подія:**
- Виробники та постачальники, які хочуть вийти на нові ринки збуту
- Малий та середній бізнес, що шукає партнерів і дистрибуторів
- Стартапи та ремісники, які бажають представити свою продукцію широкій аудиторії

**Що передбачено програмою:**
- Виставкові павільйони для демонстрації продукції
- Тематичні майстер-класи та воркшопи
- B2B-зустрічі з потенційними партнерами та інвесторами
- Нагородження кращих підприємців регіону

Реєстрація учасників відкрита до 5 травня 2026 року. Участь безкоштовна для підприємств, зареєстрованих на території Сумської області.

Для отримання додаткової інформації звертайтесь до Управління економічного розвитку Сумської обласної ради.`,
  },
  {
    slug: "vystavka-promyslova-2026",
    title: "Бізнес-виставка «Сумщина промислова»",
    date: "3–5 червня 2026",
    summary: "Сумська обласна рада організовує трьохденну виставку промислових підприємств регіону. Учасники матимуть змогу представити свою продукцію, налагодити контакти з партнерами та потенційними інвесторами.",
    type: "Виставка",
    image: "/news/vystavka.jpg",
    content: `З 3 по 5 червня 2026 року у Сумах відбудеться масштабна бізнес-виставка «Сумщина промислова» — головна промислова подія регіону цього року.

Захід організовано Сумською обласною радою за підтримки Мінекономіки України та регіональних бізнес-асоціацій. Виставка пройде у Сумському виставковому центрі площею 8 000 кв. м.

**Тематичні секції виставки:**
- Машинобудування та металообробка
- Хімічна та переробна промисловість
- Агропромисловий комплекс та харчова галузь
- IT та цифрові технології для бізнесу
- Зелена енергетика та енергоефективність

**Ключові заходи:**
- Відкриття виставки та пленарна сесія (3 червня, 10:00)
- Галузеві панельні дискусії та круглі столи
- Інвестиційний форум «Сумщина — інвестуй зараз» (4 червня)
- Церемонія нагородження лідерів регіональної промисловості (5 червня)

Очікується понад 150 компаній-експонентів та 3 000 відвідувачів. Участь у виставці — це можливість укласти нові контракти, знайти постачальників та вийти на міжнародні ринки.

Заявки на участь приймаються до 20 травня 2026 року.`,
  },
  {
    slug: "biznes-pidtrymka-2026",
    title: "Підтримка бізнесу від Сумської обласної ради",
    date: "До 1 червня 2026",
    summary: "Оголошено новий пакет можливостей для підприємців Сумщини: пільгові кредити, грантова підтримка на модернізацію виробництва та безкоштовне консультування з питань виходу на нові ринки.",
    type: "Новини",
    image: "/news/biznes-pidtrymka.jpg",
    content: `Сумська обласна рада оголосила новий пакет заходів підтримки малого та середнього бізнесу регіону на 2026 рік.

**Пільгове кредитування:**
Підприємства Сумщини можуть отримати кредити на розвиток бізнесу за зниженою ставкою 5% річних. Максимальна сума — 5 млн грн на термін до 5 років. Пріоритет — виробничі підприємства, що створюють нові робочі місця.

**Грантова програма «Модернізація»:**
Гранти до 500 000 грн на оновлення обладнання та впровадження цифрових технологій. Умова участі — не менше 3 років діяльності підприємства на Сумщині та власне фінансування у розмірі 30% від вартості проєкту.

**Безкоштовне консультування:**
Центр підтримки підприємництва при Сумській ОР надає безкоштовні консультації з питань:
- Виходу на нові ринки збуту (в т.ч. міжнародні)
- Сертифікації продукції за стандартами ЄС
- Оформлення документів для участі в тендерах
- Залучення інвестицій та грантів

**Як подати заявку:**
Заявки приймаються до 1 червня 2026 року через платформу Connect Hub або особисто у Відділі підтримки підприємництва Сумської обласної ради (вул. Соборна, 335).

Детальна інформація та форми заявок — на офіційному сайті Сумської ОР.`,
  },
  {
    slug: "industrialnyi-forum",
    title: "Індустріальний форум міста",
    date: "24 травня",
    summary: "Обговорення кооперації підприємств, закупівель і спільних експортних лотів.",
    type: "Подія",
    image: "/news/forum.jpg",
    content: `Індустріальний форум міста збере представників ключових підприємств регіону для обговорення питань кооперації, організації спільних закупівель та формування експортних лотів.`,
  },
  {
    slug: "hrantova-prohrama",
    title: "Грантова програма для виробників",
    date: "До 30 травня",
    summary: "Підтримка модернізації обладнання та цифровізації виробничих процесів.",
    type: "Новини",
    image: "/news/granty.jpg",
    content: `Оголошено грантову програму підтримки виробничих підприємств. Кошти спрямовані на модернізацію обладнання та впровадження цифрових рішень.`,
  },
  {
    slug: "b2b-matchmaking",
    title: "B2B matchmaking week",
    date: "1–7 червня",
    summary: "Серія онлайн-зустрічей підприємств, сервісних компаній і міської команди розвитку.",
    type: "Подія",
    image: "/news/matchmaking.jpg",
    content: `Тиждень B2B matchmaking — серія структурованих онлайн-зустрічей між підприємствами, сервісними компаніями та представниками міської команди розвитку. Реєструйтесь та знаходьте партнерів для спільних проєктів.`,
  },
];

export const interactionsFeed = [
  { label: "Нові партнерські взаємодії", value: 128, delta: "+18%" },
  { label: "Перегляди карток підприємств", value: 10990, delta: "+12%" },
  { label: "Запити в чат", value: 342, delta: "+9%" },
];

export const chatThreads = [
  {
    id: "chat-1",
    title: "BlueForge × Northline",
    partner: "Northline Logistics",
    excerpt: "Надіслали оновлений розрахунок за експортним маршрутом.",
    unread: 2,
    messages: [
      { from: "Northline Logistics", role: "partner", text: "Підготували 2 сценарії доставки для червневого лота.", time: "10:14" },
      { from: "Ви", role: "me", text: "Чудово, надішліть деталі щодо страхування та строків customs clearance.", time: "10:18" },
      { from: "Northline Logistics", role: "partner", text: "Надіслали оновлений розрахунок за експортним маршрутом.", time: "10:24" },
    ],
  },
  {
    id: "chat-2",
    title: "Civic Urban Labs",
    partner: "Civic Urban Labs",
    excerpt: "Узгодимо сценарій галузевої зустрічі з міською адміністрацією.",
    unread: 0,
    messages: [
      { from: "Civic Urban Labs", role: "partner", text: "Готові винести тему міської вітрини постачальників на червневу сесію.", time: "Вчора" },
      { from: "Ви", role: "me", text: "Підтримуємо. Давайте зафіксуємо список запрошених компаній.", time: "Вчора" },
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

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

export const getMarketplaceItemPath = (enterpriseSlug: string, type: string, title: string) =>
  `/marketplace/${enterpriseSlug}/${type}/${slugify(title)}`;

const titleKeywordGalleries: Array<{ keywords: string[]; images: string[] }> = [
  {
    keywords: ["привід", "інвертор", "модуль"],
    images: [
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
  {
    keywords: ["моніторинг", "dashboard", "аналітики", "bi"],
    images: [
      "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
  {
    keywords: ["склад", "доставка", "фулфілмент", "маршрут"],
    images: [
      "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/7363110/pexels-photo-7363110.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
  {
    keywords: ["упаков", "box", "pos-kit", "дизайн"],
    images: [
      "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6169032/pexels-photo-6169032.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
  {
    keywords: ["protein", "berry", "фасовка", "агро"],
    images: [
      "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
  {
    keywords: ["енерго", "solar", "інвертор"],
    images: [
      "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/4320473/pexels-photo-4320473.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
  {
    keywords: ["сітка", "рабиця", "огорожа"],
    images: [
      "/products/sitka-rabytsia.jpg",
      "/products/sitka-rabytsia.jpg",
      "/products/sitka-rabytsia.jpg",
    ],
  },
  {
    keywords: ["консульта", "аудит", "проєкт", "інжиніринг", "кампан"],
    images: [
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  },
];

const resolveTitleGallery = (title: string) => {
  const normalizedTitle = title.toLowerCase();
  const matched = titleKeywordGalleries.find(({ keywords }) => keywords.some((keyword) => normalizedTitle.includes(keyword)));
  return matched?.images;
};

const getMarketplaceGallery = (enterpriseSlug: string, type: string, title: string) => {
  const enterpriseTypeGalleries: Record<string, string[]> = {
    "blueforge-industries:Товар": [
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
    "blueforge-industries:Послуга": [
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
    "civic-urban-labs:Товар": [
      "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
    "civic-urban-labs:Послуга": [
      "https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
    "northline-logistics:Товар": [
      "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/7363110/pexels-photo-7363110.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
    "northline-logistics:Послуга": [
      "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/7363110/pexels-photo-7363110.jpeg?auto=compress&cs=tinysrgb&w=1400",
      "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1400",
    ],
  };

  const enterpriseFallback = enterpriseTypeGalleries[`${enterpriseSlug}:${type}`] ?? [
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ];

  const titleGallery = resolveTitleGallery(title);
  if (!titleGallery) return enterpriseFallback;

  return titleGallery;
};

const rotateGallery = (images: string[], shift: number) => {
  if (images.length === 0) return images;
  const offset = ((shift % images.length) + images.length) % images.length;
  return [...images.slice(offset), ...images.slice(0, offset)];
};

export type MarketplaceItem = {
  enterpriseName: string;
  enterpriseSlug: string;
  type: string;
  title: string;
  summary: string;
  category: string;
  price: string;
  itemSlug: string;
  images: string[];
};

export const marketplaceItems: MarketplaceItem[] = enterprises.flatMap((enterprise) => [
  ...enterprise.products.map((product, index) => ({
    enterpriseName: enterprise.name,
    enterpriseSlug: enterprise.slug,
    type: "Товар",
    title: product.title,
    summary: product.summary,
    category: product.category,
    price: product.price,
    itemSlug: slugify(product.title),
    images: rotateGallery(getMarketplaceGallery(enterprise.slug, "Товар", product.title), index),
  })),
  ...enterprise.services.map((service, index) => ({
    enterpriseName: enterprise.name,
    enterpriseSlug: enterprise.slug,
    type: "Послуга",
    title: service.title,
    summary: service.summary,
    category: service.category,
    price: service.priceFrom,
    itemSlug: slugify(service.title),
    images: rotateGallery(getMarketplaceGallery(enterprise.slug, "Послуга", service.title), index),
  })),
]);

export const categoryOptions = Array.from(new Set(enterprises.flatMap((enterprise) => enterprise.categories)));
export const serviceModeOptions = ["Усі", "Надавач послуг", "Виробник товарів", "Повний цикл"];
export const marketplaceCategories = Array.from(new Set(marketplaceItems.map((item) => item.category)));

export const getEnterpriseBySlug = (slug?: string) => enterprises.find((enterprise) => enterprise.slug === slug) ?? enterprises[0];
export const getEnterpriseByLinkSlug = (slug: string) => enterprises.find((enterprise) => enterprise.slug === slug);
export const getMarketplaceItemBySlug = (enterpriseSlug?: string, type?: string, itemSlug?: string) =>
  marketplaceItems.find((item) => item.enterpriseSlug === enterpriseSlug && item.type === type && item.itemSlug === itemSlug);
