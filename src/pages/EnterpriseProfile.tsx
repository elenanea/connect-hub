import { Award, Facebook, Globe, Instagram, Mail, MapPinned, MessageSquareMore, Phone, SendHorizontal, Store, TicketPercent, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import MarketplaceCard from "@/components/cards/MarketplaceCard";
import { Button } from "@/components/ui/button";
import { getEnterpriseByLinkSlug, getEnterpriseBySlug, marketplaceItems, slugify } from "@/data/marketplace";
import { loadCabinetProducts } from "@/lib/cabinet-products";
import { addPartnershipRequest, hasOutgoingPartnershipRequest, loadConfirmedPartners } from "@/lib/partnerships";
import { getMockSession } from "@/lib/mock-auth";

const EnterpriseProfile = () => {
  const { slug } = useParams();
  const enterprise = getEnterpriseBySlug(slug);
  const [isCooperationConfirmed, setIsCooperationConfirmed] = useState(false);
  const [isCooperationRequestSent, setIsCooperationRequestSent] = useState(false);

  const session = useMemo(() => getMockSession(), []);
  const ownerEnterpriseSlug = session?.enterpriseSlug;
  const ownerEnterprise = ownerEnterpriseSlug ? getEnterpriseBySlug(ownerEnterpriseSlug) : undefined;
  const isOwnEnterpriseProfile = ownerEnterprise?.slug === enterprise.slug;
  const hasStaticPartnership = Boolean(ownerEnterprise && ownerEnterprise.partnershipOffers.some((offer) => offer.enterpriseSlug === enterprise.slug));

  useEffect(() => {
    if (!ownerEnterpriseSlug || isOwnEnterpriseProfile) {
      setIsCooperationConfirmed(false);
      setIsCooperationRequestSent(false);
      return;
    }

    const confirmed = loadConfirmedPartners(ownerEnterpriseSlug).includes(enterprise.slug);
    const pending = hasOutgoingPartnershipRequest(ownerEnterpriseSlug, enterprise.slug);
    setIsCooperationConfirmed(confirmed || hasStaticPartnership);
    setIsCooperationRequestSent(!confirmed && pending);
  }, [enterprise.slug, hasStaticPartnership, isOwnEnterpriseProfile, ownerEnterpriseSlug]);

  const handleSendCooperationRequest = () => {
    if (!ownerEnterpriseSlug || isOwnEnterpriseProfile || isCooperationConfirmed || isCooperationRequestSent) {
      return;
    }

    addPartnershipRequest(ownerEnterpriseSlug, enterprise.slug);
    setIsCooperationRequestSent(true);
  };

  const servicesPreview = useMemo(
    () => [
      ...enterprise.services,
      ...Array.from({ length: Math.max(0, 6 - enterprise.services.length) }, (_, index) => ({
        title: `Нова послуга ${index + 1}`,
        summary: "Позиція скоро з'явиться у каталозі підприємства.",
        category: "Скоро",
        priceFrom: "Скоро",
        isPlaceholder: true,
      })),
    ].slice(0, 6),
    [enterprise.services],
  );

  const goodsAndServicesPreview = useMemo(() => {
    const cabinetItems = loadCabinetProducts(enterprise);

    return cabinetItems.map((item) => {
      const existing = marketplaceItems.find(
        (marketplaceItem) =>
          marketplaceItem.enterpriseSlug === enterprise.slug &&
          marketplaceItem.type === item.type &&
          marketplaceItem.title === item.title,
      );

      if (existing) {
        const fallbackImages = existing.images.length > 0 ? existing.images : [enterprise.cover];
        return {
          ...existing,
          summary: item.summary,
          category: item.category,
          price: item.price,
          images: item.imageUrl ? [item.imageUrl, ...fallbackImages.filter((image) => image !== item.imageUrl)] : fallbackImages,
        };
      }

      return {
        enterpriseName: enterprise.name,
        enterpriseSlug: enterprise.slug,
        type: item.type,
        title: item.title,
        summary: item.summary,
        category: item.category,
        price: item.price,
        itemSlug: slugify(item.title),
        images: [item.imageUrl ?? enterprise.cover],
      };
    });
  }, [enterprise.cover, enterprise.name, enterprise.products, enterprise.services, enterprise.slug]);

  const relatedOffers = useMemo(
    () =>
      enterprise.partnershipOffers
        .map((offer) => ({
          offer,
          partner: getEnterpriseByLinkSlug(offer.enterpriseSlug),
        }))
        .filter((item): item is NonNullable<typeof item> & { partner: NonNullable<typeof item.partner> } => Boolean(item.partner)),
    [enterprise.partnershipOffers],
  );

  const loyaltyPromotions = useMemo(
    () => [
      {
        title: enterprise.loyalty[0]?.title ?? "Partner Priority",
        summary: enterprise.loyalty[0]?.benefit ?? "Стань партнером і отримай вигідні умови на товари та послуги.",
        icon: Award,
      },
      {
        title: "Швидкий старт",
        summary: "Підключіться до програми цього місяця та отримайте безкоштовну консультацію з підбору рішень для вашого бізнесу.",
        icon: Zap,
      },
      {
        title: "Бонус за рекомендацію",
        summary: "Запросіть нове підприємство на платформу та відкрийте додаткову знижку 5% на наступне замовлення.",
        icon: TicketPercent,
      },
    ],
    [enterprise.loyalty],
  );

  return (
    <PlatformShell>
      <section className="section-band pt-2">
        <div className="site-container space-y-6">
          <section className="surface-panel overflow-hidden">
            <div className="h-64 w-full bg-secondary">
              <img src={enterprise.cover} alt={enterprise.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-5 md:p-6">
              <div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line/70 bg-background text-sm font-semibold text-foreground">
                      {enterprise.logo}
                    </div>
                    <h1 className="text-2xl font-semibold md:text-3xl">{enterprise.name}</h1>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isOwnEnterpriseProfile || isCooperationConfirmed || isCooperationRequestSent}
                      onClick={handleSendCooperationRequest}
                    >
                      {isCooperationConfirmed ? "Партнерство активне" : isCooperationRequestSent ? "Запит відправлено" : "Співпрацювати"}
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`tel:${enterprise.phone}`}>
                        <Phone className="h-4 w-4" />
                        Зателефонувати
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/chat">
                        <MessageSquareMore className="h-4 w-4" />
                        Написати в чат
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{enterprise.mode}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {enterprise.categories.map((category) => (
                    <span key={category} className="filter-chip">{category}</span>
                  ))}
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr_1fr]">
                  <div>
                    <p className="text-sm leading-6 text-muted-foreground">{enterprise.activity}</p>

                    <div className="mt-5">
                      <h3 className="text-lg font-semibold">Послуги</h3>
                      <ul className="mt-3 space-y-2 pl-5 text-sm leading-6 text-foreground marker:text-primary list-disc">
                        {servicesPreview.map((service) => (
                          <li key={service.title} className={service.isPlaceholder ? "text-muted-foreground" : ""}>
                            {service.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="font-medium text-foreground">{enterprise.address}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="font-medium text-foreground">{enterprise.phone}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="font-medium text-foreground">{enterprise.website}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="font-medium text-foreground">{enterprise.email}</p>
                    </div>

                    {enterprise.socials.telegram && (
                      <div className="flex items-start gap-2">
                        <SendHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="font-medium text-foreground">{enterprise.socials.telegram}</p>
                      </div>
                    )}
                    {enterprise.socials.instagram && (
                      <div className="flex items-start gap-2">
                        <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="font-medium text-foreground">{enterprise.socials.instagram}</p>
                      </div>
                    )}
                    {enterprise.socials.facebook && (
                      <div className="flex items-start gap-2">
                        <Facebook className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="font-medium text-foreground">{enterprise.socials.facebook}</p>
                      </div>
                    )}
                    {enterprise.socials.linkedin && (
                      <div className="flex items-start gap-2">
                        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="font-medium text-foreground">{enterprise.socials.linkedin}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="overflow-hidden rounded-xl border border-line/70">
                      <iframe
                        title={`Google map ${enterprise.name}`}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(enterprise.address)}&output=embed`}
                        className="h-56 w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-line/70 pt-4 text-xs sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Перегляди</p>
                    <p className="mt-1 text-lg font-semibold">{enterprise.metrics.views}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Взаємодії</p>
                    <p className="mt-1 text-lg font-semibold">{enterprise.metrics.interactions}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Партнерства</p>
                    <p className="mt-1 text-lg font-semibold">{enterprise.metrics.partnerships}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="surface-panel p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold">Товари та послуги</h2>
            </div>

            <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">Товари та послуги</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/marketplace?enterprise=${enterprise.slug}`}>Всі позиції</Link>
                  </Button>
                </div>
                <div className="catalog-grid">
                  {goodsAndServicesPreview.map((item) => (
                    <MarketplaceCard key={`${item.type}-${item.title}`} item={item} />
                  ))}
                </div>
            </div>
          </section>
          <section className="surface-panel p-6">
            <h2 className="text-2xl font-semibold">Філії та магазини</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {enterprise.branches.map((branch) => (
                <article key={branch.name} className="surface-panel p-5">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{branch.name}</h3>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>{branch.address}</p>
                    <p>{branch.hours}</p>
                    <p>{branch.phone}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="surface-panel p-6">
            <h2 className="text-2xl font-semibold">Партнери підприємства</h2>
            {relatedOffers.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {relatedOffers.map(({ partner }) => (
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
                        </Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">Партнери поки не додані</p>
            )}
          </section>

          <section className="surface-panel p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Програма лояльності для партнерів</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loyaltyPromotions.map(({ title, summary, icon: Icon }) => (
                <article key={title} className="surface-panel-hover bg-noise flex h-full flex-col justify-between p-5 transition-shadow hover:shadow-lg">
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-50 text-amber-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{summary}</p>
                  </div>

                  <div className="mt-5 border-t border-line/80 pt-5">
                    <Button
                      type="button"
                      className="w-full rounded-full"
                      disabled={isOwnEnterpriseProfile || isCooperationConfirmed || isCooperationRequestSent}
                      onClick={handleSendCooperationRequest}
                    >
                      {isCooperationConfirmed ? "Партнерство активне" : isCooperationRequestSent ? "Запит відправлено" : "Співпрацювати"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </section>
    </PlatformShell>
  );
};

export default EnterpriseProfile;
