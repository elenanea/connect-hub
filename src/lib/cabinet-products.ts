import type { Enterprise } from "@/data/marketplace";

export type CatalogItemType = "Товар" | "Послуга";

export type CabinetCatalogItem = {
  type: CatalogItemType;
  title: string;
  summary: string;
  category: string;
  price: string;
  imageUrl?: string;
};

const STORAGE_PREFIX = "connect-hub:cabinet-products:";

const getStorageKey = (enterpriseSlug: string) => `${STORAGE_PREFIX}${enterpriseSlug}`;

const isCatalogItemType = (value: unknown): value is CatalogItemType => value === "Товар" || value === "Послуга";

const sanitizeItem = (value: unknown): CabinetCatalogItem | null => {
  if (!value || typeof value !== "object") return null;

  const raw = value as Partial<CabinetCatalogItem>;

  if (!isCatalogItemType(raw.type) || typeof raw.title !== "string") {
    return null;
  }

  return {
    type: raw.type,
    title: raw.title,
    summary: typeof raw.summary === "string" && raw.summary.trim().length > 0 ? raw.summary : "Опис не вказано.",
    category: typeof raw.category === "string" && raw.category.trim().length > 0 ? raw.category : "Без категорії",
    price: typeof raw.price === "string" && raw.price.trim().length > 0 ? raw.price : "за запитом",
    imageUrl: typeof raw.imageUrl === "string" && raw.imageUrl.trim().length > 0 ? raw.imageUrl : undefined,
  };
};

export const buildDefaultCabinetProducts = (enterprise: Enterprise): CabinetCatalogItem[] => {
  const featuredService = enterprise.services.find((service) => service.priceFrom === "від 1 000 грн") ?? enterprise.services[0];

  return [
    ...enterprise.products.map((item) => ({
      type: "Товар" as const,
      title: item.title,
      summary: item.summary,
      category: item.category,
      price: item.price,
    })),
    ...(featuredService
      ? [{
          type: "Послуга" as const,
          title: featuredService.title,
          summary: featuredService.summary,
          category: featuredService.category,
          price: featuredService.priceFrom,
        }]
      : []),
  ];
};

export const loadCabinetProducts = (enterprise: Enterprise): CabinetCatalogItem[] => {
  const fallback = buildDefaultCabinetProducts(enterprise);

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(enterprise.slug));
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;

    const sanitized = parsed.map(sanitizeItem).filter((item): item is CabinetCatalogItem => Boolean(item));

    return sanitized;
  } catch {
    return fallback;
  }
};

export const saveCabinetProducts = (enterpriseSlug: string, items: CabinetCatalogItem[]) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getStorageKey(enterpriseSlug), JSON.stringify(items));
  } catch {
    // ignore storage write errors to avoid blocking UI actions
  }
};
