import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, MapPinned, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import EnterpriseCard from "@/components/cards/EnterpriseCard";
import { categoryOptions, enterprises, getEnterpriseBySlug, serviceModeOptions } from "@/data/marketplace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cityPositions: Record<string, { x: number; y: number }> = {
  "Суми": { x: 51, y: 45 },
  "Конотоп": { x: 24, y: 24 },
  "Шостка": { x: 20, y: 14 },
  "Ромни": { x: 35, y: 74 },
  "Глухів": { x: 26, y: 18 },
  "Охтирка": { x: 28, y: 86 },
};

const getCityFromAddress = (address: string) => address.split(",")[0]?.trim() ?? "";

const EnterprisesCatalog = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Усі");
  const [mode, setMode] = useState("Усі");
  const [ratingSort, setRatingSort] = useState<"none" | "desc" | "asc">("none");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedEnterpriseSlug, setSelectedEnterpriseSlug] = useState<string | null>(null);

  const recommendedForSlug = searchParams.get("recommendedFor") ?? undefined;
  const recommendedForEnterprise = recommendedForSlug ? getEnterpriseBySlug(recommendedForSlug) : undefined;

  const getEnterpriseRating = (partnerships: number) => {
    if (partnerships >= 24) return 4.9;
    if (partnerships >= 16) return 4.6;
    if (partnerships >= 12) return 4.3;
    return 4.0;
  };

  const filteredEnterprises = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const currentPartners = recommendedForEnterprise
      ? new Set(recommendedForEnterprise.partnershipOffers.map((offer) => offer.enterpriseSlug))
      : new Set<string>();

    const filtered = enterprises.filter((enterprise) => {
      const matchesRecommendationContext =
        !recommendedForEnterprise ||
        (enterprise.slug !== recommendedForEnterprise.slug && !currentPartners.has(enterprise.slug));

      const matchesQuery =
        !normalized ||
        [enterprise.name, enterprise.summary, enterprise.activity, enterprise.address, ...enterprise.categories]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      const matchesCategory = category === "Усі" || enterprise.categories.includes(category);
      const matchesMode = mode === "Усі" || enterprise.mode === mode;

      return matchesRecommendationContext && matchesQuery && matchesCategory && matchesMode;
    });

    if (ratingSort === "none") return filtered;

    return [...filtered].sort((a, b) => {
      const aRating = getEnterpriseRating(a.metrics.partnerships);
      const bRating = getEnterpriseRating(b.metrics.partnerships);
      return ratingSort === "desc" ? bRating - aRating : aRating - bRating;
    });
  }, [category, mode, query, ratingSort, recommendedForEnterprise]);

  const selectedEnterprise = filteredEnterprises.find((enterprise) => enterprise.slug === selectedEnterpriseSlug);
  const googleMapSrc = "https://maps.google.com/maps?q=50.9077,34.7981&z=13&output=embed";
  const mapMarkers = useMemo(() => {
    const offsetsByCity = new Map<string, number>();

    return filteredEnterprises.flatMap((enterprise) => {
      const city = getCityFromAddress(enterprise.address);
      const position = cityPositions[city];

      if (!position) return [];

      const offsetIndex = offsetsByCity.get(city) ?? 0;
      offsetsByCity.set(city, offsetIndex + 1);

      const offsetX = ((offsetIndex % 3) - 1) * 4.5;
      const offsetY = Math.floor(offsetIndex / 3) * 5;

      return [{
        enterprise,
        x: position.x + offsetX,
        y: position.y + offsetY,
      }];
    });
  }, [filteredEnterprises]);

  const title = recommendedForEnterprise ? `Рекомендації для ${recommendedForEnterprise.name}` : "Каталог підприємств";
  const subtitle = recommendedForEnterprise
    ? "Добірка підприємств, які можуть стати партнерами або постачальниками для вашої компанії."
    : undefined;

  return (
    <PlatformShell
      title={title}
      subtitle={subtitle}
      plainHeader
    >
      <section className="section-band pt-0">
        <div className="site-container space-y-6">
          <div className="surface-panel p-5 md:p-6">
            <div className="w-full">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-left">Пошук підприємств</span>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Назва, галузь, адреса" />
                  </div>
                  <Button
                    type="button"
                    className="h-11 whitespace-nowrap"
                    onClick={() => setQuery((prev) => prev.trim())}
                  >
                    Пошук
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 whitespace-nowrap"
                    onClick={() => {
                      setQuery("");
                      setCategory("Усі");
                      setMode("Усі");
                      setRatingSort("none");
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              </label>

              <div className="mt-5">
                <span className="mb-2 block text-sm font-medium text-left">Категорія</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {["Усі", ...categoryOptions].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${category === option ? "font-semibold text-primary" : "font-normal text-muted-foreground"}`}
                      onClick={() => setCategory(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <span className="mb-2 block text-sm font-medium text-left">Тип підприємства</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {serviceModeOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${mode === option ? "font-semibold text-primary" : "font-normal text-muted-foreground"}`}
                      onClick={() => setMode(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <Button
                  type="button"
                  variant={isMapVisible ? "default" : "outline"}
                  className="h-11 whitespace-nowrap"
                  onClick={() => setIsMapVisible((prev) => !prev)}
                >
                  <MapPinned className="mr-2 h-4 w-4" />
                  Показати підприємства на карті
                </Button>
              </div>

              {isMapVisible && (
                <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                  <div className="surface-panel overflow-hidden border border-line/70 bg-[radial-gradient(circle_at_top,_hsl(var(--hero-glow)/0.18),_transparent_34%),linear-gradient(180deg,_hsl(var(--secondary)/0.75),_hsl(var(--background)))] p-4 md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">Карта підприємств Сумської громади</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Мітки одразу показані на Google Maps. Натисніть на потрібну мітку, щоб відкрити картку підприємства праворуч.</p>
                      </div>
                      <span className="filter-chip">{mapMarkers.length} міток</span>
                    </div>

                    <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-line/70 bg-background/70">
                      <iframe
                        title="Google map підприємств Сумської області"
                        src={googleMapSrc}
                        className="h-[420px] w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div className="pointer-events-none absolute inset-0 z-10">
                        {mapMarkers.map(({ enterprise, x, y }) => {
                          const isSelected = selectedEnterprise?.slug === enterprise.slug;

                          return (
                            <button
                              key={enterprise.slug}
                              type="button"
                              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full"
                              style={{ left: `${x}%`, top: `${y}%` }}
                              aria-label={`Показати підприємство ${enterprise.name}`}
                              onClick={() => setSelectedEnterpriseSlug(enterprise.slug)}
                            >
                              <span className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-lg ${isSelected ? "bg-destructive" : "bg-primary"}`}>
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                <span className={`absolute top-[20px] h-3 w-3 rotate-45 ${isSelected ? "bg-destructive" : "bg-primary"}`} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="surface-panel p-5">
                    <div className="flex items-center gap-2">
                      <MapPinned className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Обране підприємство</h3>
                    </div>

                    {selectedEnterprise ? (
                      <div className="mt-4 space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-line/60">
                          <img src={selectedEnterprise.cover} alt={selectedEnterprise.name} className="h-44 w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary">{getCityFromAddress(selectedEnterprise.address)}</p>
                          <h4 className="mt-1 text-xl font-semibold">{selectedEnterprise.name}</h4>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedEnterprise.summary}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedEnterprise.categories.map((item) => (
                            <span key={item} className="filter-chip">{item}</span>
                          ))}
                        </div>
                        <div className="mini-metric space-y-2 text-sm text-muted-foreground">
                          <p>{selectedEnterprise.address}</p>
                          <p>{selectedEnterprise.phone}</p>
                        </div>
                        <Button asChild className="w-full rounded-full">
                          <Link to={`/enterprise/${selectedEnterprise.slug}`}>Перейти до профілю підприємства</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-dashed border-line/70 bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
                        {mapMarkers.length === 0 ? "За поточними фільтрами на карті немає підприємств." : "Натисніть на будь-яку мітку на карті, щоб відкрити картку підприємства."}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-sm font-medium">Сортування за рейтингом:</span>
            <Button type="button" variant={ratingSort === "desc" ? "default" : "outline"} size="sm" onClick={() => setRatingSort("desc")}>
              <ArrowDown className="mr-1 h-4 w-4" />
              Від високого до низького
            </Button>
            <Button type="button" variant={ratingSort === "asc" ? "default" : "outline"} size="sm" onClick={() => setRatingSort("asc")}>
              <ArrowUp className="mr-1 h-4 w-4" />
              Від низького до високого
            </Button>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Знайдено підприємств: <span className="font-semibold text-foreground">{filteredEnterprises.length}</span></p>
            </div>
            <div className="catalog-grid">
              {filteredEnterprises.map((enterprise) => (
                <EnterpriseCard key={enterprise.id} enterprise={enterprise} showContacts={false} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default EnterprisesCatalog;
