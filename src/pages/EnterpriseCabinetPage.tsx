import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BarChart3, Building2, CircleDollarSign, GraduationCap, Handshake, Mail, MapPin, MapPinned, PackageSearch, Phone, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { getEnterpriseByLinkSlug, getEnterpriseBySlug, enterprises, getMarketplaceItemPath, marketplaceItems } from "@/data/marketplace";
import { type CabinetCatalogItem, type CatalogItemType, loadCabinetProducts, saveCabinetProducts } from "@/lib/cabinet-products";
import { confirmPartnershipRequest, loadConfirmedPartners, loadIncomingPartnershipRequests } from "@/lib/partnerships";
import { listMockUsers } from "@/lib/mock-auth";

type EditableProfile = {
  name: string;
  logoUrl: string;
  description: string;
  services: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  telegram: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  categories: string;
  companyName: string;
  edrpou: string;
  businessCategory: string;
  city: string;
  login: string;
  password: string;
};

type ProductDraft = {
  type: CatalogItemType;
  title: string;
  summary: string;
  category: string;
  price: string;
  imageUrl: string;
};

const getCabinetItemKey = (item: Pick<CabinetCatalogItem, "type" | "title">) => `${item.type}:${item.title}`;

type CabinetTab =
  | "profile"
  | "products"
  | "cooperation-offers"
  | "my-partners"
  | "recommended-partners"
  | "recommended-products"
  | "opportunities"
  | "analytics"
  | "contact";

const cabinetTabs: Array<{ id: CabinetTab; label: string }> = [
  { id: "profile", label: "Профіль" },
  { id: "products", label: "Мої товари" },
  { id: "my-partners", label: "Мої партнери" },
  { id: "cooperation-offers", label: "Пропозиції до співпраці" },
  { id: "recommended-partners", label: "Рекомендовані партнери" },
  { id: "recommended-products", label: "Рекомендовані товари" },
  { id: "opportunities", label: "Можливості" },
  { id: "analytics", label: "Аналітика" },
  { id: "contact", label: "Форма зв'язку" },
];

const EnterpriseCabinetPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const enterprise = getEnterpriseBySlug(slug);
  const [partnershipRevision, setPartnershipRevision] = useState(0);
  const confirmedPartnerSlugs = useMemo(() => loadConfirmedPartners(enterprise.slug), [enterprise.slug, partnershipRevision]);
  const incomingPartnershipRequests = useMemo(
    () =>
      loadIncomingPartnershipRequests(enterprise.slug)
        .map((requesterSlug) => getEnterpriseByLinkSlug(requesterSlug))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [enterprise.slug, partnershipRevision],
  );

  const myPartners = useMemo(
    () => {
      const fromOffers = enterprise.partnershipOffers
        .map((offer) => ({
          offer,
          partner: getEnterpriseByLinkSlug(offer.enterpriseSlug),
        }))
        .filter((item): item is NonNullable<typeof item> & { partner: NonNullable<typeof item.partner> } => Boolean(item.partner));

      const mergedBySlug = new Map(fromOffers.map((item) => [item.partner.slug, item]));

      confirmedPartnerSlugs.forEach((partnerSlug) => {
        const partner = getEnterpriseByLinkSlug(partnerSlug);
        if (!partner || mergedBySlug.has(partner.slug)) return;

        mergedBySlug.set(partner.slug, {
          offer: {
            enterpriseSlug: partner.slug,
            title: "Підтверджене партнерство",
            summary: "Партнерство підтверджено через запит на співпрацю.",
            type: "Співпраця",
          },
          partner,
        });
      });

      return Array.from(mergedBySlug.values());
    },
    [confirmedPartnerSlugs, enterprise.partnershipOffers, partnershipRevision],
  );

  const catalogCategories = useMemo(() => {
    const productCategories = enterprise.products.map((item) => item.category);
    const serviceCategories = enterprise.services.map((item) => item.category);
    return Array.from(new Set([...productCategories, ...serviceCategories]));
  }, [enterprise.products, enterprise.services]);

  const recommendedPartners = useMemo(() => {
    const currentPartners = new Set(myPartners.map((item) => item.partner.slug));
    return enterprises
      .filter((item) => item.slug !== enterprise.slug && !currentPartners.has(item.slug));
  }, [enterprise.slug, myPartners]);

  const recommendedProducts = useMemo(() => {
    return enterprises
      .filter((item) => item.slug !== enterprise.slug)
      .flatMap((partner) =>
        partner.products.map((product) => {
          const marketplaceItem = marketplaceItems.find(
            (item) => item.enterpriseSlug === partner.slug && item.type === "Товар" && item.title === product.title,
          );

          return {
            ...product,
            enterpriseName: partner.name,
            enterpriseSlug: partner.slug,
            image: marketplaceItem?.images[0] ?? partner.cover,
          };
        })
      )
      .filter((product) => catalogCategories.includes(product.category))
      .slice(0, 6);
  }, [enterprise.slug, catalogCategories]);

  const enterpriseOpportunities = useMemo(() => {
    const focus = enterprise.categories.slice(0, 2).join(", ") || "виробничого розвитку";

    return [
      {
        icon: CircleDollarSign,
        title: "Грант на модернізацію виробництва",
        summary: `Для ${enterprise.name} доступний конкурс грантів до 500 000 грн на оновлення обладнання в напрямі ${focus}.`,
        terms: "Співфінансування: від 30%",
      },
      {
        icon: ShieldCheck,
        title: "Програма енергоефективності",
        summary: `Підприємства міста ${enterprise.address.split(",")[0]} можуть подати заявку на компенсацію до 40% витрат на енергомодернізацію.`,
        terms: "Ліміт: до 300 000 грн",
      },
      {
        icon: GraduationCap,
        title: "Навчання та консалтинг для експорту",
        summary: `Серія практичних сесій для команд ${enterprise.name}: вихід на нові ринки, переговори, підготовка грантових заявок.`,
        terms: "Участь: безкоштовно",
      },
    ];
  }, [enterprise.address, enterprise.categories, enterprise.name]);

  const entrepreneurAccount = useMemo(
    () =>
      listMockUsers().find(
        (user) =>
          user.role === "entrepreneur" &&
          (user.profile.enterpriseSlug === enterprise.slug || user.profile.companyName === enterprise.name),
      ),
    [enterprise.slug, enterprise.name],
  );

  const socialItems = useMemo(
    () =>
      Object.entries(enterprise.socials)
        .filter(([, value]) => Boolean(value))
        .map(([network, value]) => ({
          network,
          value: value as string,
        })),
    [enterprise.socials],
  );

  const initialProfile = useMemo<EditableProfile>(
    () => ({
      name: enterprise.name,
      logoUrl: enterprise.cover,
      description: enterprise.activity,
      services: enterprise.services.map((service) => service.title).join("\n"),
      address: enterprise.address,
      phone: enterprise.phone,
      website: enterprise.website,
      email: enterprise.email,
      telegram: enterprise.socials.telegram ?? "",
      instagram: enterprise.socials.instagram ?? "",
      facebook: enterprise.socials.facebook ?? "",
      linkedin: enterprise.socials.linkedin ?? "",
      categories: catalogCategories.join(", "),
      companyName: entrepreneurAccount?.profile.companyName ?? enterprise.name,
      edrpou: entrepreneurAccount?.profile.edrpou ?? "",
      businessCategory: entrepreneurAccount?.profile.businessCategory ?? "",
      city: entrepreneurAccount?.profile.city ?? "",
      login: entrepreneurAccount?.email ?? "",
      password: entrepreneurAccount?.password ?? "",
    }),
    [catalogCategories, enterprise, entrepreneurAccount, socialItems],
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState<EditableProfile>(initialProfile);
  const [profileDraft, setProfileDraft] = useState<EditableProfile>(initialProfile);
  const [products, setProducts] = useState<CabinetCatalogItem[]>(() => loadCabinetProducts(enterprise));
  const [productsOwnerSlug, setProductsOwnerSlug] = useState(enterprise.slug);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft>({
    type: "Товар",
    title: "",
    summary: "",
    category: "",
    price: "",
    imageUrl: "",
  });
  const [editingProductKey, setEditingProductKey] = useState<string | null>(null);
  const [editingProductDraft, setEditingProductDraft] = useState<ProductDraft>({
    type: "Товар",
    title: "",
    summary: "",
    category: "",
    price: "",
    imageUrl: "",
  });
  const [activeTab, setActiveTab] = useState<CabinetTab>("profile");
  const [visibleRecommendedPartnersCount, setVisibleRecommendedPartnersCount] = useState(3);
  const [visibleRecommendedProductsCount, setVisibleRecommendedProductsCount] = useState(6);

  useEffect(() => {
    setSavedProfile(initialProfile);
    setProfileDraft(initialProfile);
    setIsEditingProfile(false);
    setProducts(loadCabinetProducts(enterprise));
    setProductsOwnerSlug(enterprise.slug);
    setIsAddingProduct(false);
    setProductError(null);
    setProductDraft({
      type: "Товар",
      title: "",
      summary: "",
      category: "",
      price: "",
      imageUrl: "",
    });
    setEditingProductKey(null);
    setEditingProductDraft({
      type: "Товар",
      title: "",
      summary: "",
      category: "",
      price: "",
      imageUrl: "",
    });
    setVisibleRecommendedPartnersCount(3);
    setVisibleRecommendedProductsCount(6);
  }, [enterprise, initialProfile]);

  useEffect(() => {
    if (productsOwnerSlug !== enterprise.slug) return;
    saveCabinetProducts(enterprise.slug, products);
  }, [enterprise.slug, products, productsOwnerSlug]);

  const draftServices = useMemo(
    () => profileDraft.services.split("\n").map((item) => item.trim()).filter(Boolean),
    [profileDraft.services],
  );

  const draftCategories = useMemo(
    () => profileDraft.categories.split(",").map((item) => item.trim()).filter(Boolean),
    [profileDraft.categories],
  );

  const draftSocialItems = useMemo(
    () => [
      { label: "telegram", value: profileDraft.telegram },
      { label: "instagram", value: profileDraft.instagram },
      { label: "facebook", value: profileDraft.facebook },
      { label: "linkedin", value: profileDraft.linkedin },
    ].filter((item) => item.value.trim().length > 0),
    [profileDraft.facebook, profileDraft.instagram, profileDraft.linkedin, profileDraft.telegram],
  );

  const updateDraft = (field: keyof EditableProfile, value: string) => {
    setProfileDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditProfile = () => {
    setProfileDraft(savedProfile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setSavedProfile(profileDraft);
    setIsEditingProfile(false);
  };

  const handleCancelProfile = () => {
    setProfileDraft(savedProfile);
    setIsEditingProfile(false);
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setProductError(null);
  };

  const handleCancelAddProduct = () => {
    setIsAddingProduct(false);
    setProductError(null);
    setProductDraft({
      type: "Товар",
      title: "",
      summary: "",
      category: "",
      price: "",
      imageUrl: "",
    });
  };

  const handleConfirmIncomingPartnership = (requesterSlug: string) => {
    confirmPartnershipRequest(enterprise.slug, requesterSlug);
    setPartnershipRevision((prev) => prev + 1);
  };

  const handleProductDraftTypeChange = (type: CatalogItemType) => {
    setProductDraft((prev) => ({
      ...prev,
      type,
      price: type === "Послуга" && !prev.price.trim() ? "від 1 000 грн" : prev.price,
    }));
  };

  const handleEditingProductTypeChange = (type: CatalogItemType) => {
    setEditingProductDraft((prev) => ({
      ...prev,
      type,
      price: type === "Послуга" && !prev.price.trim() ? "від 1 000 грн" : prev.price,
    }));
  };

  const handleSaveProduct = () => {
    if (!productDraft.title.trim() || !productDraft.price.trim()) {
      setProductError("Заповніть назву та ціну позиції.");
      return;
    }

    setProducts((prev) => [
      {
        type: productDraft.type,
        title: productDraft.title.trim(),
        summary: productDraft.summary.trim() || "Опис не вказано.",
        category: productDraft.category.trim() || "Без категорії",
        price: productDraft.price.trim(),
        imageUrl: productDraft.imageUrl.trim() || undefined,
      },
      ...prev,
    ]);

    handleCancelAddProduct();
  };

  const handleDraftPhotoUpload = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProductDraft((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditingPhotoUpload = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setEditingProductDraft((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditProduct = (title: string) => {
    const product = products.find((item) => getCabinetItemKey(item) === title);
    if (!product) return;

    setEditingProductKey(title);
    const fallbackImage = marketplaceItems.find(
      (item) => item.enterpriseSlug === enterprise.slug && item.type === product.type && item.title === product.title,
    )?.images[0] ?? enterprise.cover;

    setEditingProductDraft({
      type: product.type,
      title: product.title,
      summary: product.summary,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl ?? fallbackImage,
    });
    setProductError(null);
  };

  const handleCancelEditProduct = () => {
    setEditingProductKey(null);
    setEditingProductDraft({
      type: "Товар",
      title: "",
      summary: "",
      category: "",
      price: "",
      imageUrl: "",
    });
    setProductError(null);
  };

  const handleSaveEditedProduct = () => {
    if (!editingProductKey) return;
    if (!editingProductDraft.title.trim() || !editingProductDraft.price.trim()) {
      setProductError("Для редагування заповніть назву та ціну позиції.");
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        getCabinetItemKey(item) === editingProductKey
          ? {
              type: editingProductDraft.type,
              title: editingProductDraft.title.trim(),
              summary: editingProductDraft.summary.trim() || "Опис не вказано.",
              category: editingProductDraft.category.trim() || "Без категорії",
              price: editingProductDraft.price.trim(),
              imageUrl: editingProductDraft.imageUrl.trim() || undefined,
            }
          : item,
      ),
    );

    setProductError(null);
    handleCancelEditProduct();
  };

  const handleDeleteProduct = (itemKey: string) => {
    setProducts((prev) => prev.filter((item) => getCabinetItemKey(item) !== itemKey));
    if (editingProductKey === itemKey) {
      handleCancelEditProduct();
    }
  };

  return (
    <PlatformShell
      title={`Кабінет: ${enterprise.name}`}
      plainHeader
    >
      <section className="section-band pt-2">
        <div className="site-container space-y-6">
          <section className="surface-panel p-3 md:p-4">
            <div className="flex flex-wrap gap-2">
              {cabinetTabs.map((tab) => (
                <Button
                  key={tab.id}
                  type="button"
                  size="sm"
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className="whitespace-nowrap"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </section>

          <section className={activeTab === "profile" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-semibold">Профіль підприємства</h2>
                <div className="ml-auto flex items-center justify-end gap-2 whitespace-nowrap">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/enterprise/${enterprise.slug}`}>Перейти до публічного профілю</Link>
                  </Button>
                  {!isEditingProfile && (
                    <Button type="button" variant="outline" size="sm" onClick={handleEditProfile}>Редагувати профіль</Button>
                  )}
                  {isEditingProfile && (
                    <>
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelProfile}>Скасувати</Button>
                      <Button type="button" size="sm" onClick={handleSaveProfile}>Зберегти</Button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-xs text-muted-foreground">
                  Перегляди: <span className="font-semibold text-foreground">{enterprise.metrics.views}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Взаємодії: <span className="font-semibold text-foreground">{enterprise.metrics.interactions}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Партнерства: <span className="font-semibold text-foreground">{enterprise.metrics.partnerships}</span>
                </p>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{enterprise.summary}</p>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-4">
                <div className="mini-metric !bg-transparent !p-4 !shadow-none flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10">
                    <img
                      src={profileDraft.logoUrl}
                      alt={`Лого ${profileDraft.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Назва</p>
                    {!isEditingProfile && <p className="mt-1 text-lg font-semibold text-foreground">{profileDraft.name}</p>}
                    {isEditingProfile && (
                      <input
                        className="mt-2 w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                        value={profileDraft.name}
                        onChange={(event) => updateDraft("name", event.target.value)}
                      />
                    )}
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Лого (URL картинки)</p>
                    <input
                      className="mt-2 w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                      value={profileDraft.logoUrl}
                      onChange={(event) => updateDraft("logoUrl", event.target.value)}
                      placeholder="https://example.com/logo.jpg"
                    />
                  </div>
                )}

                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Опис</p>
                  {!isEditingProfile && <p className="mt-2 text-sm leading-7 text-muted-foreground">{profileDraft.description}</p>}
                  {isEditingProfile && (
                    <textarea
                      className="mt-2 min-h-28 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none"
                      value={profileDraft.description}
                      onChange={(event) => updateDraft("description", event.target.value)}
                    />
                  )}
                </div>

                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Послуги</p>
                  {!isEditingProfile && (
                    <div className="mt-2 space-y-2">
                      {draftServices.map((service) => (
                        <p key={service} className="text-sm text-muted-foreground">{service}</p>
                      ))}
                    </div>
                  )}
                  {isEditingProfile && (
                    <textarea
                      className="mt-2 min-h-28 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none"
                      value={profileDraft.services}
                      onChange={(event) => updateDraft("services", event.target.value)}
                      placeholder="По одній послузі з нового рядка"
                    />
                  )}
                </div>

                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Контакти</p>
                  {!isEditingProfile && (
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="flex items-start gap-3 text-muted-foreground"><MapPinned className="mt-0.5 h-4 w-4 text-primary" />{profileDraft.address}</p>
                      <p className="flex items-start gap-3 text-muted-foreground"><Phone className="mt-0.5 h-4 w-4 text-primary" />{profileDraft.phone}</p>
                      <p className="flex items-start gap-3 text-muted-foreground"><Building2 className="mt-0.5 h-4 w-4 text-primary" />{profileDraft.website}</p>
                      <p className="flex items-start gap-3 text-muted-foreground"><Mail className="mt-0.5 h-4 w-4 text-primary" />{profileDraft.email}</p>
                    </div>
                  )}
                  {isEditingProfile && (
                    <div className="mt-3 grid gap-2">
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.address} onChange={(event) => updateDraft("address", event.target.value)} placeholder="Адреса" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.phone} onChange={(event) => updateDraft("phone", event.target.value)} placeholder="Телефон" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.website} onChange={(event) => updateDraft("website", event.target.value)} placeholder="Сайт" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.email} onChange={(event) => updateDraft("email", event.target.value)} placeholder="Email" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Соціальні мережі</p>
                  {!isEditingProfile && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draftSocialItems.map((item) => (
                        <span key={item.label} className="filter-chip">{item.label}: {item.value}</span>
                      ))}
                    </div>
                  )}
                  {isEditingProfile && (
                    <div className="mt-3 grid gap-2">
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.telegram} onChange={(event) => updateDraft("telegram", event.target.value)} placeholder="Telegram" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.instagram} onChange={(event) => updateDraft("instagram", event.target.value)} placeholder="Instagram" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.facebook} onChange={(event) => updateDraft("facebook", event.target.value)} placeholder="Facebook" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.linkedin} onChange={(event) => updateDraft("linkedin", event.target.value)} placeholder="LinkedIn" />
                    </div>
                  )}
                </div>

                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Категорії товарів і послуг</p>
                  {!isEditingProfile && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draftCategories.map((category) => (
                        <span key={category} className="filter-chip">{category}</span>
                      ))}
                    </div>
                  )}
                  {isEditingProfile && (
                    <input
                      className="mt-2 w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                      value={profileDraft.categories}
                      onChange={(event) => updateDraft("categories", event.target.value)}
                      placeholder="Категорії через кому"
                    />
                  )}
                </div>

                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Дані компанії (юридичні)</p>
                  {!isEditingProfile && (
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                      <p><span className="font-medium text-foreground">Компанія:</span> {profileDraft.companyName || "Не вказано"}</p>
                      <p><span className="font-medium text-foreground">ЄДРПОУ:</span> {profileDraft.edrpou || "Не вказано"}</p>
                      <p><span className="font-medium text-foreground">Категорія бізнесу:</span> {profileDraft.businessCategory || "Не вказано"}</p>
                      <p><span className="font-medium text-foreground">Місто:</span> {profileDraft.city || "Не вказано"}</p>
                    </div>
                  )}
                  {isEditingProfile && (
                    <div className="mt-3 grid gap-2">
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.companyName} onChange={(event) => updateDraft("companyName", event.target.value)} placeholder="Компанія" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.edrpou} onChange={(event) => updateDraft("edrpou", event.target.value)} placeholder="ЄДРПОУ" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.businessCategory} onChange={(event) => updateDraft("businessCategory", event.target.value)} placeholder="Категорія бізнесу" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.city} onChange={(event) => updateDraft("city", event.target.value)} placeholder="Місто" />
                    </div>
                  )}
                </div>

                <div className="mini-metric !bg-transparent !p-4 !shadow-none">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Дані входу</p>
                  {!isEditingProfile && (
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                      <p><span className="font-medium text-foreground">Логін:</span> {profileDraft.login || "Не вказано"}</p>
                      <p><span className="font-medium text-foreground">Пароль:</span> {profileDraft.password || "Не вказано"}</p>
                    </div>
                  )}
                  {isEditingProfile && (
                    <div className="mt-3 grid gap-2">
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.login} onChange={(event) => updateDraft("login", event.target.value)} placeholder="Логін" />
                      <input className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none" value={profileDraft.password} onChange={(event) => updateDraft("password", event.target.value)} placeholder="Пароль" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={activeTab === "products" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Мої товари</h2>
              <div className="flex items-center gap-2">
                {!isAddingProduct && <Button type="button" size="sm" onClick={handleAddProduct}>Додати продукцію</Button>}
                {isAddingProduct && (
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={handleCancelAddProduct}>Скасувати</Button>
                    <Button type="button" size="sm" onClick={handleSaveProduct}>Зберегти товар</Button>
                  </>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link to={`/marketplace?enterprise=${enterprise.slug}&type=Товар`}>Всі товари</Link>
                </Button>
              </div>
            </div>

            {isAddingProduct && (
              <div className="mini-metric !bg-transparent mt-4 grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-medium">
                  Назва {productDraft.type === "Послуга" ? "послуги" : "товару"}
                  <input
                    className="mt-2 w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                    value={productDraft.title}
                    onChange={(event) => setProductDraft((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder={productDraft.type === "Послуга" ? "Наприклад: Базова виробнича консультація" : "Наприклад: Модульний привід BF-300"}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Тип позиції
                  <select
                    className="mt-2 w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                    value={productDraft.type}
                    onChange={(event) => handleProductDraftTypeChange(event.target.value as CatalogItemType)}
                  >
                    <option value="Товар">Товар</option>
                    <option value="Послуга">Послуга</option>
                  </select>
                </label>
                <label className="block text-sm font-medium md:col-span-2">
                  Опис
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none"
                    value={productDraft.summary}
                    onChange={(event) => setProductDraft((prev) => ({ ...prev, summary: event.target.value }))}
                    placeholder={productDraft.type === "Послуга" ? "Коротко про послугу" : "Коротко про товар"}
                  />
                </label>
                <label className="block text-sm font-medium md:col-span-2">
                  Ціна
                  <input
                    className="mt-2 w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none"
                    value={productDraft.price}
                    onChange={(event) => setProductDraft((prev) => ({ ...prev, price: event.target.value }))}
                    placeholder={productDraft.type === "Послуга" ? "Наприклад: за запитом або від 1 000 грн" : "Наприклад: ціна або за запитом"}
                  />
                </label>
                <label className="block text-sm font-medium md:col-span-2">
                  Додати фото
                  <div className="mt-2 flex flex-wrap items-start gap-3">
                    <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                      Обрати файл
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(event) => handleDraftPhotoUpload(event.target.files?.[0])}
                      />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {productDraft.imageUrl ? "Файл обрано" : "Файл не обрано"}
                    </span>
                    {productDraft.imageUrl && (
                      <div className="relative h-28 w-40 overflow-hidden rounded-xl border border-line/60">
                        <img src={productDraft.imageUrl} alt="Попередній перегляд товару" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="Видалити фото"
                          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line/60 bg-background/90 text-foreground transition-colors hover:bg-background"
                          onClick={() => setProductDraft((prev) => ({ ...prev, imageUrl: "" }))}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </label>
                {productError && <p className="text-sm text-destructive md:col-span-2">{productError}</p>}
              </div>
            )}

            <div className="mt-5 space-y-3">
              {products.map((product) => {
                const productImage = marketplaceItems.find(
                  (item) => item.enterpriseSlug === enterprise.slug && item.type === product.type && item.title === product.title,
                )?.images[0] ?? enterprise.cover;
                const productPreview = product.imageUrl ?? productImage;
                const itemKey = getCabinetItemKey(product);
                const isEditing = editingProductKey === itemKey;

                return (
                  <article key={itemKey} className="mini-metric !bg-transparent flex items-center gap-4">
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-line/60">
                      <img src={productPreview} alt={product.title} className="h-full w-full object-cover" />
                    </div>

                    {isEditing ? (
                      <div className="grid flex-1 gap-3">
                        <div className="grid gap-2 md:grid-cols-2">
                          <label className="block text-sm font-medium">
                            Назва
                            <input
                              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none"
                              value={editingProductDraft.title}
                              onChange={(event) => setEditingProductDraft((prev) => ({ ...prev, title: event.target.value }))}
                              placeholder="Назва"
                            />
                          </label>
                          <label className="block text-sm font-medium">
                            Тип
                            <select
                              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none"
                              value={editingProductDraft.type}
                              onChange={(event) => handleEditingProductTypeChange(event.target.value as CatalogItemType)}
                            >
                              <option value="Товар">Товар</option>
                              <option value="Послуга">Послуга</option>
                            </select>
                          </label>
                          <label className="block text-sm font-medium md:col-span-2">
                            Опис
                            <textarea
                              className="mt-1 min-h-20 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none"
                              value={editingProductDraft.summary}
                              onChange={(event) => setEditingProductDraft((prev) => ({ ...prev, summary: event.target.value }))}
                              placeholder={editingProductDraft.type === "Послуга" ? "Опис послуги" : "Опис товару"}
                            />
                          </label>
                          <label className="block text-sm font-medium md:col-span-2">
                            Ціна
                            <input
                              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none"
                              value={editingProductDraft.price}
                              onChange={(event) => setEditingProductDraft((prev) => ({ ...prev, price: event.target.value }))}
                              placeholder={editingProductDraft.type === "Послуга" ? "Наприклад: за запитом або від 1 000 грн" : "Наприклад: ціна або за запитом"}
                            />
                          </label>
                        </div>

                        <div className="flex flex-wrap items-start gap-3">
                          <label className="block text-sm font-medium">
                            Додати фото
                            <div className="mt-1 flex items-center gap-3">
                              <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                                Обрати файл
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 cursor-pointer opacity-0"
                                  onChange={(event) => handleEditingPhotoUpload(event.target.files?.[0])}
                                />
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                {editingProductDraft.imageUrl ? "Файл обрано" : "Файл не обрано"}
                              </span>
                            </div>
                          </label>
                          {editingProductDraft.imageUrl && (
                            <div className="relative h-28 w-40 overflow-hidden rounded-xl border border-line/60">
                              <img
                                src={editingProductDraft.imageUrl}
                                alt={editingProductDraft.title || "Фото товару"}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                aria-label="Видалити фото"
                                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line/60 bg-background/90 text-foreground transition-colors hover:bg-background"
                                onClick={() => setEditingProductDraft((prev) => ({ ...prev, imageUrl: "" }))}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={handleCancelEditProduct}>Скасувати</Button>
                          <Button type="button" size="sm" onClick={handleSaveEditedProduct}>Зберегти</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{product.type}</p>
                          <h3 className="truncate font-semibold text-foreground">{product.title}</h3>
                          <p className="mt-1 text-sm font-medium text-foreground">{product.price}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button asChild type="button" variant="outline" size="sm">
                            <Link to={getMarketplaceItemPath(enterprise.slug, product.type, product.title)}>Перейти на сторінку {product.type === "Послуга" ? "послуги" : "товару"}</Link>
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => handleEditProduct(itemKey)}>Редагувати</Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteProduct(itemKey)}>Видалити</Button>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
              {productError && (
                <p className="text-sm text-destructive">{productError}</p>
              )}
              {products.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/50 bg-surface-secondary p-6 text-center">
                  <p className="text-sm text-muted-foreground">Список товарів порожній</p>
                </div>
              )}
            </div>
          </section>

          <section className={activeTab === "my-partners" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <Handshake className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Мої партнери</h2>
            </div>
            {incomingPartnershipRequests.length > 0 && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {incomingPartnershipRequests.map((requester) => (
                  <article key={requester.slug} className="mini-metric flex flex-col gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-primary">Новий запит на співпрацю</p>
                      <h3 className="mt-1 text-base font-semibold text-foreground">{requester.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{requester.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" onClick={() => handleConfirmIncomingPartnership(requester.slug)}>
                        Підтвердити запит
                      </Button>
                      <Button asChild type="button" variant="outline" size="sm">
                        <Link to={`/enterprise/${requester.slug}`}>Перейти в профіль</Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {myPartners.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {myPartners.map(({ partner }) => (
                  <article key={partner.slug} className="surface-panel-hover bg-noise flex h-full flex-col justify-between p-5 transition-shadow hover:shadow-lg">
                    <div>
                      <div className="mb-5 overflow-hidden rounded-2xl border border-line/60">
                        <img src={partner.cover} alt={partner.name} className="h-40 w-full object-cover" />
                      </div>

                      <h3 className="text-lg font-semibold">{partner.name}</h3>
                      <p className="mt-2 text-sm text-justify text-muted-foreground">{partner.summary}</p>
                    </div>

                    <div className="mt-5 border-t border-line/80 pt-5">
                      <Button asChild className="w-full rounded-full">
                        <Link to={`/enterprise/${partner.slug}`}>
                          Профіль
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">Ви ще не маєте активних партнерів</p>
            )}
          </section>

          <section className={activeTab === "cooperation-offers" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <Handshake className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Пропозиції до співпраці</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Актуальні формати взаємодії з вашими партнерами: спільні проєкти, логістика, події та інтеграції.</p>
            {myPartners.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {myPartners.map(({ offer, partner }) => (
                  <article key={`${partner.slug}-${offer.title}`} className="surface-panel-hover bg-noise flex h-full flex-col justify-between p-5 transition-shadow hover:shadow-lg">
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="filter-chip">{offer.type}</span>
                        <span className="filter-chip">{partner.name}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{offer.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.summary}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-line/80 pt-5">
                      <Button asChild className="rounded-full">
                        <Link to="/chat">
                          Обговорити
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link to={`/enterprise/${partner.slug}`}>Профіль партнера</Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-border/50 bg-surface-secondary p-8 text-center">
                <p className="text-sm text-muted-foreground">Поки немає активних пропозицій до співпраці</p>
              </div>
            )}
          </section>

          <section className={activeTab === "recommended-partners" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Рекомендовані партнери</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Топ підприємств, які можуть стати вашими партнерами або постачальниками</p>
            {recommendedPartners.length > 0 ? (
              <>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendedPartners.slice(0, visibleRecommendedPartnersCount).map((partner) => (
                  <article
                    key={partner.slug}
                    className="surface-panel-hover bg-noise flex cursor-pointer flex-col justify-between p-5 transition-shadow hover:shadow-lg"
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/enterprise/${partner.slug}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/enterprise/${partner.slug}`);
                      }
                    }}
                  >
                    <div>
                      <div className="mb-5 overflow-hidden rounded-2xl border border-line/60">
                        <img src={partner.cover} alt={partner.name} className="h-40 w-full object-cover" />
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{partner.name}</h3>
                          <p className="mt-1 text-sm font-medium text-primary">{partner.mode}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-justify leading-6 text-muted-foreground">{partner.summary}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {partner.categories.map((category) => (
                          <span key={category} className="filter-chip">{category}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 pt-5 border-t border-line/80">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/enterprise/${partner.slug}`);
                        }}
                      >
                        Відкрити профіль
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
              {visibleRecommendedPartnersCount < recommendedPartners.length && (
                <div className="mt-5 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVisibleRecommendedPartnersCount((prev) => prev + 3)}
                  >
                    Показати більше
                  </Button>
                </div>
              )}
              </>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-border/50 bg-surface-secondary p-8 text-center">
                <p className="text-sm text-muted-foreground">Нема доступних рекомендацій партнерів</p>
              </div>
            )}
          </section>

          <section className={activeTab === "recommended-products" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <PackageSearch className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Рекомендовані товари</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Популярні товари в вашій категорії від інших підприємств</p>
            {recommendedProducts.length > 0 ? (
              <>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendedProducts.slice(0, visibleRecommendedProductsCount).map((product) => (
                  <Link key={`${product.enterpriseSlug}-${product.title}`} to={getMarketplaceItemPath(product.enterpriseSlug, "Товар", product.title)} className="no-underline">
                      <article className="surface-panel-hover bg-noise p-5 flex flex-col justify-between h-full cursor-pointer hover:shadow-lg transition-shadow">
                    <div>
                      <div className="mb-4 overflow-hidden rounded-2xl border border-line/60">
                        <img src={product.image} alt={product.title} className="h-40 w-full object-cover" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
                      <p className="mt-1 text-sm font-medium text-primary">{product.enterpriseName}</p>
                      <p className="mt-2 text-sm text-justify leading-6 text-muted-foreground">{product.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="filter-chip text-xs">{product.category}</span>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/80 pt-5">
                      <span className="text-lg font-semibold text-foreground">{product.price}</span>
                          <div className="flex items-center gap-1 text-primary">
                            Переглянути
                            <ArrowRight className="h-4 w-4" />
                          </div>
                    </div>
                      </article>
                    </Link>
                ))}
              </div>
              {visibleRecommendedProductsCount < recommendedProducts.length && (
                <div className="mt-5 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setVisibleRecommendedProductsCount((prev) => prev + 3)}
                  >
                    Показати більше
                  </Button>
                </div>
              )}
              </>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-border/50 bg-surface-secondary p-8 text-center">
                <p className="text-sm text-muted-foreground">Нема рекомендованих товарів у вашій категорії</p>
              </div>
            )}
          </section>

          <section className={activeTab === "opportunities" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Можливості для {enterprise.name}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Добірка грантів та програм підтримки, релевантних для вашого підприємства.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {enterpriseOpportunities.map(({ icon: Icon, title, summary, terms }) => (
                <article key={title} className="surface-panel-hover bg-noise p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{summary}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-4">
                    <span className="text-sm font-medium text-primary">{terms}</span>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/opportunities">Детальніше</Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={activeTab === "analytics" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Аналітика</h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="mini-metric !border-0 !bg-transparent !shadow-none">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Конверсія звернень</p>
                <p className="mt-2 text-xl font-semibold">18.4%</p>
              </div>
              <div className="mini-metric !border-0 !bg-transparent !shadow-none">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Середній чек</p>
                <p className="mt-2 text-xl font-semibold">72 000 ₴</p>
              </div>
              <div className="mini-metric !border-0 !bg-transparent !shadow-none">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Активні ліди</p>
                <p className="mt-2 text-xl font-semibold">34</p>
              </div>
            </div>
          </section>

          <section className={activeTab === "contact" ? "surface-panel p-6" : "hidden surface-panel p-6"}>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Форма зв'язку з адміністрацією</h2>
            </div>
            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                Ім'я
                <input className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="Ваше ім'я" />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="name@company.ua" />
              </label>
              <label className="block text-sm font-medium md:col-span-2">
                Тема звернення
                <input className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="Коротко вкажіть тему" />
              </label>
              <label className="block text-sm font-medium md:col-span-2">
                Повідомлення
                <textarea className="mt-2 min-h-32 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="Опишіть запит або проблему" />
              </label>
              <div className="md:col-span-2">
                <Button type="button" className="w-full md:w-auto">Надіслати</Button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </PlatformShell>
  );
};

export default EnterpriseCabinetPage;
