import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import EnterpriseCard from "@/components/cards/EnterpriseCard";
import { categoryOptions, enterprises, serviceModeOptions } from "@/data/marketplace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EnterprisesCatalog = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [mode, setMode] = useState("Все");

  const filteredEnterprises = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return enterprises.filter((enterprise) => {
      const matchesQuery =
        !normalized ||
        [enterprise.name, enterprise.summary, enterprise.activity, enterprise.address, ...enterprise.categories]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      const matchesCategory = category === "Все" || enterprise.categories.includes(category);
      const matchesMode = mode === "Все" || enterprise.mode === mode;

      return matchesQuery && matchesCategory && matchesMode;
    });
  }, [category, mode, query]);

  return (
    <PlatformShell
      title="Каталог предприятий"
      subtitle="Ищите предприятия по направлениям деятельности, категориям и типу работы — услуги, производство или полный цикл сотрудничества."
    >
      <section className="section-band pt-2">
        <div className="site-container grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="surface-panel h-fit p-5">
            <p className="eyebrow">Поиск и фильтры</p>
            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Поиск предприятий</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Название, отрасль, адрес" />
                </div>
              </label>

              <div>
                <span className="mb-3 block text-sm font-medium">Категория</span>
                <div className="flex flex-wrap gap-2">
                  {["Все", ...categoryOptions].map((option) => (
                    <Button key={option} type="button" variant={category === option ? "default" : "outline"} size="sm" onClick={() => setCategory(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-3 block text-sm font-medium">Тип предприятия</span>
                <div className="flex flex-wrap gap-2">
                  {serviceModeOptions.map((option) => (
                    <Button key={option} type="button" variant={mode === option ? "default" : "outline"} size="sm" onClick={() => setMode(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Найдено предприятий: <span className="font-semibold text-foreground">{filteredEnterprises.length}</span></p>
            </div>
            <div className="catalog-grid">
              {filteredEnterprises.map((enterprise) => (
                <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default EnterprisesCatalog;
