import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import MarketplaceCard from "@/components/cards/MarketplaceCard";
import { marketplaceCategories, marketplaceItems } from "@/data/marketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MarketplaceCatalog = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Все");
  const [category, setCategory] = useState("Все");

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return marketplaceItems.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.title, item.summary, item.enterpriseName, item.category].join(" ").toLowerCase().includes(normalized);
      const matchesType = type === "Все" || item.type === type;
      const matchesCategory = category === "Все" || item.category === category;
      return matchesQuery && matchesType && matchesCategory;
    });
  }, [category, query, type]);

  return (
    <PlatformShell
      title="Каталог товаров и услуг"
      subtitle="Один маркетплейс для предложений предприятий: быстрый поиск, фильтрация и переход к контактам владельца профиля."
    >
      <section className="section-band pt-2">
        <div className="site-container grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="surface-panel h-fit p-5">
            <p className="eyebrow">Фильтры предложений</p>
            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Поиск</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Товар, услуга, компания" />
                </div>
              </label>

              <div>
                <span className="mb-3 block text-sm font-medium">Тип</span>
                <div className="flex flex-wrap gap-2">
                  {["Все", "Товар", "Услуга"].map((option) => (
                    <Button key={option} type="button" variant={type === option ? "default" : "outline"} size="sm" onClick={() => setType(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-3 block text-sm font-medium">Категория</span>
                <div className="flex flex-wrap gap-2">
                  {["Все", ...marketplaceCategories].map((option) => (
                    <Button key={option} type="button" variant={category === option ? "default" : "outline"} size="sm" onClick={() => setCategory(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Найдено позиций: <span className="font-semibold text-foreground">{filteredItems.length}</span></p>
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
