import { ArrowRight, Building2, CalendarRange, Handshake, Newspaper, PackageSearch, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import EnterpriseCard from "@/components/cards/EnterpriseCard";
import { Button } from "@/components/ui/button";
import { enterprises, interactionsFeed, newsItems } from "@/data/marketplace";

const Index = () => {
  return (
    <PlatformShell>
      <section className="section-band pt-8 md:pt-12">
        <div className="site-container">
          <div className="surface-panel relative overflow-hidden px-6 py-8 md:px-8 md:py-10">
            <div className="hero-grid absolute inset-0 opacity-70" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">Business Connect Platform</p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-normal md:text-6xl">
                  Единая площадка для коммуникации предприятий, товаров, услуг и партнёрств.
                </h1>
                <p className="section-copy mt-5 max-w-2xl text-base md:text-lg">
                  Каталог предприятий, витрина товаров и услуг, партнёрские предложения, новости, аналитика и деловая переписка — в одном аккуратном интерфейсе.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link to="/enterprises">
                      Смотреть предприятия
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/marketplace">Товары и услуги</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <div className="surface-panel animate-float p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border bg-brand-soft p-3 text-primary">
                      <Handshake className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Возможности для сотрудничества</p>
                      <p className="text-xl font-semibold">26 активных связок</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Подбирайте релевантные предприятия, начинайте диалог и запускайте совместные проекты быстрее.
                  </p>
                </div>

                <div className="surface-panel p-5">
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {interactionsFeed.map((item) => (
                      <div key={item.label} className="mini-metric">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <p className="text-2xl font-semibold">{item.value}</p>
                          <span className="text-sm font-medium text-primary">{item.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="site-container grid gap-4 md:grid-cols-2">
          <Link to="/enterprises" className="surface-panel-hover flex items-center justify-between gap-4 p-6">
            <div>
              <div className="eyebrow">Баннер</div>
              <h2 className="mt-3 text-2xl font-semibold">Предприятия</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Каталог компаний с профилями, контактами, филиалами и предложениями кооперации.</p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </Link>
          <Link to="/marketplace" className="surface-panel-hover flex items-center justify-between gap-4 p-6">
            <div>
              <div className="eyebrow">Баннер</div>
              <h2 className="mt-3 text-2xl font-semibold">Товары и услуги</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Поиск по предложениям предприятий с фильтрами, категориями и быстрым переходом в профиль.</p>
            </div>
            <PackageSearch className="h-8 w-8 text-primary" />
          </Link>
        </div>
      </section>

      <section className="section-band">
        <div className="site-container">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Выбранные предприятия</p>
              <h2 className="section-heading mt-2">Компании с высоким потенциалом кооперации</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/analytics">
                Перейти к аналитике
                <TrendingUp className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="catalog-grid mt-6">
            {enterprises.map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="site-container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="surface-panel p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border bg-brand-soft p-3 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow">Возможности для сотрудничества</p>
                <h2 className="mt-2 text-2xl font-semibold">Партнёрские сценарии для города и бизнеса</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Совместные закупки и тендерные консорциумы",
                "Кооперация производителей и логистических операторов",
                "Пилотные smart city проекты с городской администрацией",
              ].map((item) => (
                <div key={item} className="mini-metric flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{item}</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>
          </article>

          <article className="surface-panel p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Новости и мероприятия</p>
                <h2 className="mt-2 text-2xl font-semibold">Актуальные обновления экосистемы</h2>
              </div>
              <Newspaper className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {newsItems.map((news) => (
                <article key={news.title} className="surface-panel p-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    <CalendarRange className="h-4 w-4" />
                    <span>{news.type}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{news.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{news.summary}</p>
                  <p className="mt-4 text-sm font-medium text-foreground">{news.date}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>
    </PlatformShell>
  );
};

export default Index;
