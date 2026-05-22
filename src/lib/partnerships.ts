const STORAGE_PREFIX = "connect-hub:confirmed-partners:";
const REQUESTS_STORAGE_KEY = "connect-hub:partnership-requests";

const getStorageKey = (enterpriseSlug: string) => `${STORAGE_PREFIX}${enterpriseSlug}`;

const sanitizeSlugs = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const loadConfirmedPartners = (enterpriseSlug: string): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey(enterpriseSlug));
    if (!raw) return [];
    return sanitizeSlugs(JSON.parse(raw));
  } catch {
    return [];
  }
};

export const saveConfirmedPartners = (enterpriseSlug: string, partners: string[]) => {
  if (typeof window === "undefined") return;

  try {
    const unique = Array.from(new Set(partners));
    window.localStorage.setItem(getStorageKey(enterpriseSlug), JSON.stringify(unique));
  } catch {
    // Ignore write errors to avoid breaking UI flow.
  }
};

export const addConfirmedPartner = (enterpriseSlug: string, partnerSlug: string) => {
  if (!enterpriseSlug || !partnerSlug || enterpriseSlug === partnerSlug) return;

  const current = loadConfirmedPartners(enterpriseSlug);
  if (current.includes(partnerSlug)) return;

  saveConfirmedPartners(enterpriseSlug, [...current, partnerSlug]);
};

type PartnershipRequest = {
  fromEnterpriseSlug: string;
  toEnterpriseSlug: string;
  createdAt: string;
};

const sanitizeRequests = (value: unknown): PartnershipRequest[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is PartnershipRequest => {
      if (!item || typeof item !== "object") return false;
      const request = item as Partial<PartnershipRequest>;
      return (
        typeof request.fromEnterpriseSlug === "string" &&
        request.fromEnterpriseSlug.trim().length > 0 &&
        typeof request.toEnterpriseSlug === "string" &&
        request.toEnterpriseSlug.trim().length > 0 &&
        request.fromEnterpriseSlug !== request.toEnterpriseSlug
      );
    })
    .map((item) => ({
      fromEnterpriseSlug: item.fromEnterpriseSlug.trim(),
      toEnterpriseSlug: item.toEnterpriseSlug.trim(),
      createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    }));
};

const loadPartnershipRequests = (): PartnershipRequest[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) return [];
    return sanitizeRequests(JSON.parse(raw));
  } catch {
    return [];
  }
};

const savePartnershipRequests = (requests: PartnershipRequest[]) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Ignore write errors to avoid blocking UI flow.
  }
};

export const hasOutgoingPartnershipRequest = (fromEnterpriseSlug: string, toEnterpriseSlug: string) =>
  loadPartnershipRequests().some(
    (request) => request.fromEnterpriseSlug === fromEnterpriseSlug && request.toEnterpriseSlug === toEnterpriseSlug,
  );

export const loadIncomingPartnershipRequests = (toEnterpriseSlug: string) =>
  loadPartnershipRequests()
    .filter((request) => request.toEnterpriseSlug === toEnterpriseSlug)
    .map((request) => request.fromEnterpriseSlug);

export const addPartnershipRequest = (fromEnterpriseSlug: string, toEnterpriseSlug: string) => {
  if (!fromEnterpriseSlug || !toEnterpriseSlug || fromEnterpriseSlug === toEnterpriseSlug) return;

  if (loadConfirmedPartners(fromEnterpriseSlug).includes(toEnterpriseSlug)) return;

  const requests = loadPartnershipRequests();
  const exists = requests.some(
    (request) => request.fromEnterpriseSlug === fromEnterpriseSlug && request.toEnterpriseSlug === toEnterpriseSlug,
  );

  if (exists) return;

  savePartnershipRequests([
    ...requests,
    {
      fromEnterpriseSlug,
      toEnterpriseSlug,
      createdAt: new Date().toISOString(),
    },
  ]);
};

export const confirmPartnershipRequest = (toEnterpriseSlug: string, fromEnterpriseSlug: string) => {
  if (!toEnterpriseSlug || !fromEnterpriseSlug || toEnterpriseSlug === fromEnterpriseSlug) return;

  const requests = loadPartnershipRequests();
  const next = requests.filter(
    (request) => !(request.fromEnterpriseSlug === fromEnterpriseSlug && request.toEnterpriseSlug === toEnterpriseSlug),
  );
  savePartnershipRequests(next);

  addConfirmedPartner(toEnterpriseSlug, fromEnterpriseSlug);
  addConfirmedPartner(fromEnterpriseSlug, toEnterpriseSlug);
};
