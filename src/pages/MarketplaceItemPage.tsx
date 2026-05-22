import { Phone, MessageSquareMore } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlatformShell from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { getEnterpriseBySlug, getMarketplaceItemBySlug } from "@/data/marketplace";

const MarketplaceItemPage = () => {
  const { enterpriseSlug, type, itemSlug } = useParams();
  const item = getMarketplaceItemBySlug(enterpriseSlug, type, itemSlug);
  const enterprise = getEnterpriseBySlug(enterpriseSlug);
  const [activeImage, setActiveImage] = useState(item?.images[0] ?? enterprise.cover);

  if (!item) {
    return (
      <PlatformShell>
        <div className="site-container section-band text-center">
          <h1 className="section-heading">Продукт не знайдено</h1>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/marketplace">Повернутися до каталогу</Link>
          </Button>
        </div>
      </PlatformShell>
    );
  }

  return (
    <PlatformShell>
      <section className="section-band pt-2">
        <div className="site-container">
          <section className="surface-panel p-6">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="overflow-hidden rounded-2xl border border-line/70">
                  <img src={activeImage} alt={item.title} className="h-[360px] w-full object-cover" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {item.images.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`overflow-hidden rounded-xl border ${activeImage === image ? "border-primary" : "border-line/70"}`}
                    >
                      <img src={image} alt={item.title} className="h-24 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{item.type}</p>
                <h1 className="mt-3 text-3xl font-semibold">{item.title}</h1>
                <p className="mt-3 text-lg font-medium text-foreground">{item.price}</p>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">{item.summary}</p>

                <div className="mt-6 space-y-3 border-t border-line/70 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Підприємство</span>
                    <Link to={`/enterprise/${enterprise.slug}`} className="font-medium text-primary hover:underline">
                      {enterprise.name}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Категорія</span>
                    <span className="font-medium text-foreground">{item.category}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/chat">
                      <MessageSquareMore className="h-4 w-4" />
                      Зв'язатися
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`tel:${enterprise.phone}`}>
                      <Phone className="h-4 w-4" />
                      Подзвонити
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </PlatformShell>
  );
};

export default MarketplaceItemPage;
