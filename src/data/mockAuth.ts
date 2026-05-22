export type UserRole = "consumer" | "entrepreneur" | "city_admin" | "site_admin";

export type RoleTemplate = {
  role: UserRole;
  title: string;
  description: string;
  capabilities: string[];
};

export type MockUserProfile = {
  fullName: string;
  city?: string;
  companyName?: string;
  edrpou?: string;
  businessCategory?: string;
  department?: string;
  position?: string;
  officialId?: string;
  interests?: string;
  wantsDiscountMatching?: boolean;
  provideCatalog?: boolean;
  adminNotes?: string;
  enterpriseSlug?: string;
};

export type MockUser = {
  id: string;
  role: UserRole;
  email: string;
  password: string;
  profile: MockUserProfile;
};

export const roleTemplates: RoleTemplate[] = [
  {
    role: "consumer",
    title: "Споживач",
    description: "Замовлення товарів та послуг, чат з підприємствами, отримання знижок через матч з підприємствами.",
    capabilities: [
      "Замовлення товарів і послуг з каталогу",
      "Чат з підприємствами у реальному часі",
      "Рекомендовані знижки при релевантному match",
    ],
  },
  {
    role: "entrepreneur",
    title: "Підприємець",
    description: "Підтвердження через системи ЄДРПОУ, розміщення товарів і послуг, анкета підприємства + функції споживача.",
    capabilities: [
      "Верифікація підприємства за кодом ЄДРПОУ",
      "Розміщення товарів і послуг у вітрині",
      "Заповнення розширеної анкети підприємства",
      "Доступ до функцій споживача",
    ],
  },
  {
    role: "city_admin",
    title: "Адміністрація міста",
    description: "Функціонал підприємства та доступ до аналітики платформи.",
    capabilities: [
      "Керування пропозиціями як у ролі підприємства",
      "Перегляд аналітичних зрізів і трендів",
      "Моніторинг міських партнерських ініціатив",
    ],
  },
  {
    role: "site_admin",
    title: "Адміністратор сайта",
    description: "Повний доступ до всіх модулів і налаштувань системи.",
    capabilities: [
      "Повний доступ до всіх ролей і маршрутів",
      "Керування довідниками, користувачами та сесіями",
      "Аудит дій і системна конфігурація",
    ],
  },
];

export const demoUsers: MockUser[] = [
  {
    id: "u-consumer-1",
    role: "consumer",
    email: "consumer@connecthub.local",
    password: "demo12345",
    profile: {
      fullName: "Олена Споживач",
      city: "Київ",
      interests: "Логістика, IT-послуги",
      wantsDiscountMatching: true,
    },
  },
  {
    id: "u-entrepreneur-1",
    role: "entrepreneur",
    email: "biz@connecthub.local",
    password: "demo12345",
    profile: {
      fullName: "Андрій Підприємець",
      companyName: "BlueForge Industries",
      edrpou: "41239876",
      businessCategory: "Виробництво",
      city: "Суми",
      provideCatalog: true,
      enterpriseSlug: "blueforge-industries",
    },
  },
  {
    id: "u-city-1",
    role: "city_admin",
    email: "city@connecthub.local",
    password: "demo12345",
    profile: {
      fullName: "Ірина Міська Адміністрація",
      department: "Департамент економіки",
      position: "Керівник напрямку",
      city: "Львів",
      officialId: "CITY-2026-114",
    },
  },
  {
    id: "u-site-1",
    role: "site_admin",
    email: "admin@connecthub.local",
    password: "demo12345",
    profile: {
      fullName: "Системний Адміністратор",
      adminNotes: "Головний адміністратор тестового середовища",
    },
  },
];

export type RoleWorkspaceTemplate = {
  role: UserRole;
  quickActions: string[];
  sampleItems: { title: string; value: string }[];
};

export const roleWorkspaceTemplates: RoleWorkspaceTemplate[] = [
  {
    role: "consumer",
    quickActions: ["Створити замовлення", "Відкрити чат з підприємством", "Активувати знижковий матч"],
    sampleItems: [
      { title: "Активні замовлення", value: "3" },
      { title: "Доступні персональні знижки", value: "5" },
      { title: "Нові повідомлення", value: "2" },
    ],
  },
  {
    role: "entrepreneur",
    quickActions: ["Додати товар", "Створити послугу", "Оновити анкету підприємства", "Перевірити заявки"],
    sampleItems: [
      { title: "Товари у вітрині", value: "14" },
      { title: "Послуги у вітрині", value: "7" },
      { title: "Непрочитані чати", value: "4" },
    ],
  },
  {
    role: "city_admin",
    quickActions: ["Відкрити міську аналітику", "Сформувати звіт", "Запустити партнерський відбір"],
    sampleItems: [
      { title: "Підприємства у реєстрі", value: "57" },
      { title: "Активні партнерства", value: "26" },
      { title: "Тижневий приріст взаємодій", value: "+12%" },
    ],
  },
  {
    role: "site_admin",
    quickActions: ["Керувати ролями", "Аудит логів", "Системні налаштування", "Резервні сесії"],
    sampleItems: [
      { title: "Зареєстровані користувачі", value: "128" },
      { title: "Активні сесії", value: "34" },
      { title: "Системний стан", value: "Stable" },
    ],
  },
];

export const siteAdminAccessCode = "ADMIN-2026";
