import { analyticsSeries, enterprises, interactionsFeed } from "@/data/marketplace";
import PlatformShell from "@/components/layout/PlatformShell";

const maxViews = Math.max(...analyticsSeries.map((item) => item.views));

const AnalyticsPage = () => {
  return (
    <PlatformShell
      title="Аналітика платформи"
      subtitle="Огляд кількості підприємств, взаємодій і переглядів у зручному дашборді для команди розвитку та партнерів платформи."
    >
      <section className="section-band pt-2">
        <div className="site-container space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="stat-card">
              <p className="eyebrow">Кількість підприємств</p>
              <p className="mt-4 text-4xl font-semibold">{enterprises.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Активні профілі підприємств на платформі.</p>
            </article>
            <article className="stat-card">
              <p className="eyebrow">Взаємодії підприємств</p>
              <p className="mt-4 text-4xl font-semibold">724</p>
              <p className="mt-2 text-sm text-muted-foreground">Переходи в чати, дзвінки та заявки на співпрацю.</p>
            </article>
            <article className="stat-card">
              <p className="eyebrow">Перегляди карток</p>
              <p className="mt-4 text-4xl font-semibold">18 240</p>
              <p className="mt-2 text-sm text-muted-foreground">Сукупний інтерес до профілів, товарів і послуг.</p>
            </article>
          </div>

          <section className="surface-panel p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Динаміка тижня</p>
                <h2 className="mt-2 text-2xl font-semibold">Перегляди та ділові взаємодії</h2>
              </div>
              <p className="text-sm text-muted-foreground">Понеділок — неділя</p>
            </div>
            <div className="mt-8 space-y-5">
              {analyticsSeries.map((item) => (
                <div key={item.label} className="grid gap-3 md:grid-cols-[40px_1fr_auto] md:items-center">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <div className="chart-bar h-3">
                    <span style={{ width: `${(item.views / maxViews) * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground">
                    <span>Підприємств {item.enterprises}</span>
                    <span>Взаємодій {item.interactions}</span>
                    <span className="font-medium text-foreground">Переглядів {item.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="surface-panel p-6">
              <p className="eyebrow">Ключові сигнали</p>
              <div className="mt-6 space-y-4">
                {interactionsFeed.map((item) => (
                  <div key={item.label} className="mini-metric flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Останні 30 днів</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold">{item.value}</p>
                      <p className="text-sm text-primary">{item.delta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel p-6">
              <p className="eyebrow">Топ підприємств</p>
              <div className="mt-6 space-y-4">
                {enterprises
                  .slice()
                  .sort((a, b) => b.metrics.interactions - a.metrics.interactions)
                  .map((enterprise) => (
                    <div key={enterprise.id} className="mini-metric flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{enterprise.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{enterprise.summary}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-foreground">{enterprise.metrics.interactions}</p>
                        <p className="text-muted-foreground">взаємодій</p>
                      </div>
                    </div>
                  ))}
              </div>
            </article>
          </section>
        </div>
      </section>
    </PlatformShell>
  );
};

export default AnalyticsPage;
