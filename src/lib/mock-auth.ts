import { demoUsers, type MockUser, type MockUserProfile, roleTemplates, siteAdminAccessCode, type UserRole } from "@/data/mockAuth";

const USERS_KEY = "connect_hub_mock_users";
const SESSION_KEY = "connect_hub_mock_session";

export type SessionUser = {
  id: string;
  role: UserRole;
  email: string;
  fullName: string;
  enterpriseSlug?: string;
};

export type RegisterPayload = {
  role: UserRole;
  email: string;
  password: string;
  fullName: string;
  profile: MockUserProfile;
  adminCode?: string;
};

function getStoredUsers(): MockUser[] {
  if (typeof window === "undefined") {
    return demoUsers;
  }

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    return demoUsers;
  }

  try {
    const parsed = JSON.parse(raw) as MockUser[];
    if (!Array.isArray(parsed)) {
      return demoUsers;
    }
    return parsed;
  } catch {
    return demoUsers;
  }
}

function saveUsers(users: MockUser[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function initializeMockAuthData() {
  if (typeof window === "undefined") {
    return;
  }

  // Always initialize with fresh demo users to ensure current data structure
  saveUsers(demoUsers);
}

export function listMockUsers(): MockUser[] {
  return getStoredUsers();
}

export function registerMockUser(payload: RegisterPayload): { ok: true; user: MockUser } | { ok: false; message: string } {
  const users = getStoredUsers();

  const roleTemplate = roleTemplates.find((item) => item.role === payload.role);
  if (!roleTemplate) {
    return { ok: false, message: "Невідома роль користувача." };
  }

  const email = payload.email.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Вкажіть коректний email." };
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { ok: false, message: "Користувач з таким email вже існує." };
  }

  if (payload.password.length < 8) {
    return { ok: false, message: "Пароль має містити щонайменше 8 символів." };
  }

  if (payload.role === "entrepreneur") {
    const edrpou = payload.profile.edrpou?.trim() ?? "";
    if (!/^\d{8}$/.test(edrpou)) {
      return { ok: false, message: "Для ролі підприємця код ЄДРПОУ має містити 8 цифр." };
    }
  }

  if (payload.role === "site_admin" && payload.adminCode !== siteAdminAccessCode) {
    return { ok: false, message: "Невірний код доступу адміністратора сайта." };
  }

  const user: MockUser = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `user-${Date.now()}`,
    role: payload.role,
    email,
    password: payload.password,
    profile: {
      ...payload.profile,
      fullName: payload.fullName.trim(),
    },
  };

  users.push(user);
  saveUsers(users);

  return { ok: true, user };
}

export function loginMockUser(email: string, password: string): { ok: true; session: SessionUser } | { ok: false; message: string } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
  if (!user) {
    return { ok: false, message: "Неправильний email або пароль." };
  }

  const session: SessionUser = {
    id: user.id,
    role: user.role,
    email: user.email,
    fullName: user.profile.fullName,
    enterpriseSlug: user.profile.enterpriseSlug,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { ok: true, session };
}

export function getMockSession(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function logoutMockUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
