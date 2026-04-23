import { Facebook, Globe, Instagram, MapPinned, MessageSquareMore, Phone, Send, Store, Telegram } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { getEnterpriseByLinkSlug, getEnterpriseBySlug } from "@/data/marketplace";

const EnterpriseProfile = () => {
  const { slug } = useParams();
  const enterprise = getEnterpriseBySlug(slug);

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

  return (
    <PlatformShell title={enterprise.name} subtitle={enterprise.summary}>
      <section className="section-band pt-2">
        <div className="site-container grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="surface-panel overflow-hidden">
              <div className="h-64 w-full bg-secondary">
                <img src={enterprise.cover} alt={enterprise.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-secondary text-lg font-semibold">
                      {enterprise.logo}
                    </div>
                    <div>
                      <h1 className="text-3xl font-semibold">{enterprise.name}</h1>
                      <p className="mt-2 text-sm text-muted-foreground">{enterprise.mode}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {enterprise.categories.map((category) => (
                          <span key={category} className="filter-chip">{category}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                    <div className="mini-metric">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Просмотры</p>
                      <p className="mt-2 text-2xl font-semibold">{enterprise.metrics.views}</p>
                    </div>
                    <div className="mini-metric">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Взаимодействия</p>
                      <p className="mt-2 text-2xl font-semibold">{enterprise.metrics.interactions}</p>
                    </div>
                    <div className="mini-metric">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Партнёрства</p>
                      <p className="mt-2 text-2xl font-semibold">{enterprise.metrics.partnerships}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-muted-foreground">{enterprise.activity}</p>
              </div>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-2xl font-semibold">Контакты и описание деятельности</h2>
              <div className="info-list mt-6">
                <div className="info-row"><span>Адрес</span><span className="font-medium text-foreground">{enterprise.address}</span></div>
                <div className="info-row"><span>Телефон</span><span className="font-medium text-foreground">{enterprise.phone}</span></div>
                <div className="info-row"><span>Сайт</span><span className="font-medium text-foreground">{enterprise.website}</span></div>
                <div className="info-row"><span>Email</span><span className="font-medium text-foreground">{enterprise.email}</span></div>
                <div className="info-row"><span>Google карта</span><span className="font-medium text-foreground">{enterprise.mapLabel}</span></div>
                <div className="info-row"><span>Тип деятельности</span><span className="font-medium text-foreground">{enterprise.mode}</span></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {enterprise.socials.telegram && <span className="filter-chip"><Telegram className="mr-2 h-4 w-4" />{enterprise.socials.telegram}</span>}
                {enterprise.socials.instagram && <span className="filter-chip"><Instagram className="mr-2 h-4 w-4" />{enterprise.socials.instagram}</span>}
                {enterprise.socials.facebook && <span className="filter-chip"><Facebook className="mr-2 h-4 w-4" />{enterprise.socials.facebook}</span>}
                {enterprise.socials.linkedin && <span className="filter-chip"><Globe className="mr-2 h-4 w-4" />{enterprise.socials.linkedin}</span>}
              </div>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-2xl font-semibold">Филиалы и магазины</h2>
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
              <h2 className="text-2xl font-semibold">Список услуг предприятия</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {enterprise.services.map((service) => (
                  <article key={service.title} className="surface-panel p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.summary}</p>
                      </div>
                      <span className="filter-chip">{service.category}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-foreground">{service.priceFrom}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="surface-panel p-6">
              <h2 className="text-2xl font-semibold">Релевантные предложения партнёрства</h2>
              <div className="mt-6 space-y-4">
                {relatedOffers.map(({ offer, partner }) => (
                  <article key={offer.title} className="surface-panel p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-secondary font-semibold">{partner.logo}</div>
                      <div>
                        <h3 className="text-lg font-semibold">{partner.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{partner.summary}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="filter-chip">{offer.type}</span>
                      <span className="filter-chip">{offer.title}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{offer.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button asChild><Link to="/chat">Сотрудничать</Link></Button>
                      <Button variant="outline"><Phone className="h-4 w-4" />Позвонить</Button>
                      <Button variant="outline"><MessageSquareMore className="h-4 w-4" />Написать в чат</Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-2xl font-semibold">Программа лояльности для партнёров</h2>
              <div className="mt-6 space-y-4">
                {enterprise.loyalty.map((item) => (
                  <article key={item.title} className="surface-panel p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="filter-chip">{item.tier}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.benefit}</p>
                    <p className="mt-3 text-sm text-foreground">{item.terms}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-2xl font-semibold">Связь с администрацией города</h2>
              <form className="mt-6 space-y-4">
                <label className="block text-sm font-medium">
                  Имя
                  <input className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="Ваше имя" />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="name@company.ua" />
                </label>
                <label className="block text-sm font-medium">
                  Телефон
                  <input className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="+380 ..." />
                </label>
                <label className="block text-sm font-medium">
                  Сообщение
                  <textarea className="mt-2 min-h-32 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none ring-0" placeholder="Опишите цель обращения" />
                </label>
                <Button type="button" className="w-full"><Send className="h-4 w-4" />Отправить запрос</Button>
              </form>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-2xl font-semibold">Товары предприятия</h2>
              <div className="mt-6 space-y-4">
                {enterprise.products.map((product) => (
                  <article key={product.title} className="mini-metric">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{product.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.summary}</p>
                      </div>
                      <span className="filter-chip">{product.category}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-foreground">{product.price}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default EnterpriseProfile;
