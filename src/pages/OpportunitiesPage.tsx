import { ArrowRight, BarChart3, MessagesSquare, Orbit } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";

const items = [
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

const OpportunitiesPage = () => {
  return (
    <PlatformShell title="Можливості для бізнесу" subtitle="Платформа для пошуку партнерів, керування попитом і запуску нових кооперацій." plainHeader>
      <section className="section-band pt-2">
        <div className="site-container">
          <div className="grid gap-4 md:grid-cols-3">
            {items.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="glass-strip flex h-full flex-col">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Дізнатися більше</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PlatformShell>
  );
};

export default OpportunitiesPage;
