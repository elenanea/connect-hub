import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import MarketplaceCard from "@/components/cards/MarketplaceCard";
import { enterprises, getEnterpriseBySlug, marketplaceCategories, marketplaceItems, slugify } from "@/data/marketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadCabinetProducts } from "@/lib/cabinet-products";

const MarketplaceCatalog = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "Усі");
  const [category, setCategory] = useState(searchParams.get("category") ?? "Усі");
  const [enterprise, setEnterprise] = useState(searchParams.get("enterprise") ?? "Усі");
  const recommendedForSlug = searchParams.get("recommendedFor") ?? undefined;
  const recommendedForEnterprise = recommendedForSlug ? getEnterpriseBySlug(recommendedForSlug) : undefined;

  const recommendedCategories = useMemo(() => {
    if (!recommendedForEnterprise) return new Set<string>();

    const productCategories = recommendedForEnterprise.products.map((item) => item.category);
    const serviceCategories = recommendedForEnterprise.services.map((item) => item.category);
    return new Set([...productCategories, ...serviceCategories]);
  }, [recommendedForEnterprise]);

  const enterpriseOptions = useMemo(
    () => Array.from(new Set(marketplaceItems.map((item) => item.enterpriseSlug))),
    [],
  );

  const catalogItemsSource = useMemo(() => {
    if (enterprise === "Усі") return marketplaceItems;

    const selectedEnterpriseData = enterprises.find((item) => item.slug === enterprise);
    if (!selectedEnterpriseData) return marketplaceItems;

    const cabinetItems = loadCabinetProducts(selectedEnterpriseData);

    return cabinetItems.map((item) => {
      const existing = marketplaceItems.find(
        (marketplaceItem) =>
          marketplaceItem.enterpriseSlug === selectedEnterpriseData.slug &&
          marketplaceItem.type === item.type &&
          marketplaceItem.title === item.title,
      );

      if (existing) {
        const fallbackImages = existing.images.length > 0 ? existing.images : [selectedEnterpriseData.cover];
        return {
          ...existing,
          summary: item.summary,
          category: item.category,
          price: item.price,
          images: item.imageUrl ? [item.imageUrl, ...fallbackImages.filter((image) => image !== item.imageUrl)] : fallbackImages,
        };
      }

      return {
        enterpriseName: selectedEnterpriseData.name,
        enterpriseSlug: selectedEnterpriseData.slug,
        type: item.type,
        title: item.title,
        summary: item.summary,
        category: item.category,
        price: item.price,
        itemSlug: slugify(item.title),
        images: [item.imageUrl ?? selectedEnterpriseData.cover],
      };
    });
  }, [enterprise]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return catalogItemsSource.filter((item) => {
      const matchesRecommendationContext =
        !recommendedForEnterprise ||
        (item.type === "Товар" &&
          item.enterpriseSlug !== recommendedForEnterprise.slug &&
          recommendedCategories.has(item.category));

      const matchesQuery =
        !normalized ||
        [item.title, item.summary, item.enterpriseName, item.category].join(" ").toLowerCase().includes(normalized);
      const matchesType = type === "Усі" || item.type === type;
      const matchesCategory = category === "Усі" || item.category === category;
      const matchesEnterprise = enterprise === "Усі" || item.enterpriseSlug === enterprise;
      return matchesRecommendationContext && matchesQuery && matchesType && matchesCategory && matchesEnterprise;
    });
  }, [catalogItemsSource, category, enterprise, query, recommendedCategories, recommendedForEnterprise, type]);

  return (
    <PlatformShell
      title={recommendedForEnterprise ? `Рекомендовані товари для ${recommendedForEnterprise.name}` : "Каталог товарів і послуг"}
      subtitle={
        recommendedForEnterprise
          ? "Усі товари, рекомендовані для вашого підприємства на основі ваших категорій."
          : "Єдиний маркетплейс пропозицій підприємств: швидкий пошук, фільтрація та перехід до контактів власника профілю."
      }
      plainHeader
    >
      <section className="section-band pt-2">
        <div className="site-container space-y-6">
          <div className="surface-panel p-5 md:p-6">
            <div className="w-full">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-left">Пошук товарів і послуг</span>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9" placeholder="Товар, послуга, компанія" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 whitespace-nowrap"
                    onClick={() => {
                      setQuery("");
                      setType("Усі");
                      setCategory("Усі");
                      setEnterprise("Усі");
                    }}
                  >
                    Скинути фільтри
                  </Button>
                </div>
              </label>

              <div className="mt-5">
                <span className="mb-2 block text-sm font-medium text-left">Тип</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {["Усі", "Товар", "Послуга"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${type === option ? "font-semibold text-primary" : "font-normal text-muted-foreground"}`}
                      onClick={() => setType(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <span className="mb-2 block text-sm font-medium text-left">Категорія</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {["Усі", ...marketplaceCategories].map((option) => (
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
                <span className="mb-2 block text-sm font-medium text-left">Підприємство</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {["Усі", ...enterpriseOptions].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${enterprise === option ? "font-semibold text-primary" : "font-normal text-muted-foreground"}`}
                      onClick={() => setEnterprise(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Знайдено позицій: <span className="font-semibold text-foreground">{filteredItems.length}</span></p>
            </div>
            <div className="catalog-grid">
              {filteredItems.map((item) => (
                <MarketplaceCard key={`${item.enterpriseSlug}-${item.type}-${item.title}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default MarketplaceCatalog;
