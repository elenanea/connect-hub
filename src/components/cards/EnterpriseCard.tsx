import { ArrowRight, Factory, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Enterprise } from "@/data/marketplace";

type EnterpriseCardProps = {
  enterprise: Enterprise;
  showContacts?: boolean;
};

const EnterpriseCard = ({ enterprise, showContacts = true }: EnterpriseCardProps) => {
  return (
    <Link to={`/enterprise/${enterprise.slug}`} className="block h-full no-underline">
      <article className="surface-panel-hover bg-noise flex h-full cursor-pointer flex-col p-5 transition-shadow hover:shadow-lg">
        <div className="mb-5 overflow-hidden rounded-2xl border border-line/60">
          <img src={enterprise.cover} alt={enterprise.name} className="h-40 w-full object-cover" />
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{enterprise.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{enterprise.mode}</p>
              <p className="mt-2 text-sm text-justify text-muted-foreground">{enterprise.summary}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {enterprise.categories.map((category) => (
            <span key={category} className="filter-chip">
              {category}
            </span>
          ))}
        </div>

        {showContacts && (
          <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
            <div className="mini-metric flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs leading-5 sm:text-sm">{enterprise.address}</span>
            </div>
            <div className="mini-metric flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <span className="whitespace-nowrap text-xs leading-5 sm:text-sm">{enterprise.phone}</span>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/80 pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Factory className="h-4 w-4 text-primary" />
            <span>{enterprise.products.length} товарів · {enterprise.services.length} послуг</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
            Відкрити профіль
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default EnterpriseCard;
