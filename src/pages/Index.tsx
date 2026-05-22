import { ArrowRight, BarChart3, Building2, CalendarRange, MessagesSquare, Newspaper, Orbit, PackageSearch, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import EnterpriseCard from "@/components/cards/EnterpriseCard";
import { Button } from "@/components/ui/button";
import { enterprises, newsItems } from "@/data/marketplace";

const Index = () => {
  const capabilityCards = [
    {
      icon: Orbit,
      title: "Знаходьте партнерів поруч",
      copy: "Об'єднуйте підприємства, логістику та сервісних підрядників в єдиний діловий ланцюг.",
    },
    {
      icon: BarChart3,
      title: "Аналітика попиту",
      copy: "Відстежуйте інтерес до профілів, динаміку заявок і точки зростання за сегментами ринку.",
    },
    {
      icon: MessagesSquare,
      title: "Комунікація без шуму",
      copy: "Запускайте ділові діалоги прямо з каталогу та скорочуйте шлях від інтересу до угоди.",
    },
  ];

  return (
    <PlatformShell>
      {/* Hero / Slider */}
      <section
        className="section-band pt-8 md:pt-12"
      >
        <div className="site-container">
          <div
            className="relative overflow-hidden rounded-[2rem] min-h-[420px] md:min-h-[520px] flex items-end"
            style={{
              backgroundImage: "url('/slaider.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative z-10 w-full px-6 py-10 md:px-10 md:py-12 max-w-3xl">
              <span className="status-pill">Sumy Business Ecosystem</span>
              <h1 className="display-heading mt-5 text-balance text-4xl font-semibold tracking-normal text-white md:text-6xl">
                Знаходь. Співпрацюй. Зростай.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg leading-7">
                Каталог підприємств, вітрина товарів і послуг, партнерські пропозиції, новини, аналітика та ділове листування в одному продуктовому контурі.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link to="/enterprises">
                    Переглянути підприємства
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/70 bg-white/20 text-white px-7 backdrop-blur-md hover:bg-white/30">
                  <Link to="/marketplace">Товари та послуги</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="section-band pt-1">
        <div className="site-container">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h2 className="section-heading mt-0">Новини та заходи</h2>
            </div>
            <div className="flex items-center gap-3">
              <Newspaper className="hidden h-5 w-5 text-primary md:block" />
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/news">Всі новини</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((news) => (
              <Link key={news.title} to={`/news/${news.slug}`} className="surface-panel flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
                <div className="overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full object-cover h-44 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    <CalendarRange className="h-4 w-4" />
                    <span>{news.type}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{news.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground flex-1 line-clamp-3">{news.summary}</p>
                  <p className="mt-4 text-sm font-medium text-foreground">{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="site-container grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="spotlight-card">
            <h2 className="section-heading mt-3 max-w-xl">Бізнес поруч, рішення швидко, результат відчутно</h2>
            <div className="mt-6 grid gap-3">
              {capabilityCards.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="glass-strip flex items-start gap-4">
                  <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Link to="/enterprises" className="surface-panel-hover flex items-center justify-between gap-4 p-6">
              <div>
                <div className="eyebrow">Каталог</div>
                <h2 className="mt-3 text-2xl font-semibold">Підприємства</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Профілі компаній, філії, контакти, спеціалізація та готові сценарії співпраці.</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </Link>
            <Link to="/marketplace" className="surface-panel-hover flex items-center justify-between gap-4 p-6">
              <div>
                <div className="eyebrow">Вітрина</div>
                <h2 className="mt-3 text-2xl font-semibold">Товари та послуги</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Фільтруйте пропозиції, порівнюйте ціни та переходьте до власника товару без зайвих кроків.</p>
              </div>
              <PackageSearch className="h-8 w-8 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="site-container">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Вибрані підприємства</p>
              <h2 className="section-heading mt-2">Компанії з високим потенціалом кооперації</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/enterprises">
                Всі підприємства
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="catalog-grid mt-6">
            {enterprises.slice(0, 6).map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} showContacts={false} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="site-container">
          <div className="section-frame">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Можливості для співпраці</p>
                <h2 className="mt-2 text-2xl font-semibold">Партнерські сценарії для міста та бізнесу</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link to="/opportunities" className="surface-panel-hover p-5">
                <h3 className="text-lg font-semibold">Спільні закупівлі та тендерні консорціуми</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Об'єднуйте замовлення для кращих умов і швидшого запуску проєктів.</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Відкрити напрям</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>

              <Link to="/enterprises" className="surface-panel-hover p-5">
                <h3 className="text-lg font-semibold">Кооперація виробників і логістичних операторів</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Знаходьте локальних партнерів у Сумській області та масштабуйте поставки.</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Переглянути підприємства</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>

              <Link to="/marketplace" className="surface-panel-hover p-5">
                <h3 className="text-lg font-semibold">Пілотні smart city проєкти з міською адміністрацією</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Тестуйте продукти та послуги в реальних сценаріях міста разом з громадою.</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Перейти до вітрини</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default Index;
