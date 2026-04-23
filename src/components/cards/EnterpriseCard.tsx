import { ArrowRight, Factory, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Enterprise } from "@/data/marketplace";

const EnterpriseCard = ({ enterprise }: { enterprise: Enterprise }) => {
  return (
    <article className="surface-panel-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-secondary text-base font-semibold text-foreground">
            {enterprise.logo}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{enterprise.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{enterprise.summary}</p>
          </div>
        </div>
        <span className="filter-chip">{enterprise.mode}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {enterprise.categories.map((category) => (
          <span key={category} className="filter-chip">
            {category}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="mini-metric flex items-center gap-3">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{enterprise.address}</span>
        </div>
        <div className="mini-metric flex items-center gap-3">
          <Phone className="h-4 w-4 text-primary" />
          <span>{enterprise.phone}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Factory className="h-4 w-4 text-primary" />
          <span>{enterprise.products.length} товаров · {enterprise.services.length} услуг</span>
        </div>
        <Button asChild>
          <Link to={`/enterprise/${enterprise.slug}`}>
            Открыть профиль
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
};

export default EnterpriseCard;
