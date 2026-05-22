import { CalendarRange } from "lucide-react";
import { Link } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import { newsItems } from "@/data/marketplace";

const NewsListPage = () => {
  return (
    <PlatformShell title="Всі новини" subtitle="Оновлення, події та можливості для бізнесу Сумської області." plainHeader>
      <section className="section-band pt-2">
        <div className="site-container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((news) => (
              <Link key={news.slug} to={`/news/${news.slug}`} className="surface-panel flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
                <div className="overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    <CalendarRange className="h-4 w-4" />
                    <span>{news.type}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{news.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground flex-1">{news.summary}</p>
                  <p className="mt-4 text-sm font-medium text-foreground">{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default NewsListPage;
