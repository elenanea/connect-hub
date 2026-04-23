import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarketplaceCardProps = {
  item: {
    enterpriseName: string;
    enterpriseSlug: string;
    type: string;
    title: string;
    summary: string;
    category: string;
    price: string;
  };
};

const MarketplaceCard = ({ item }: MarketplaceCardProps) => {
  return (
    <article className="surface-panel-hover flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            <BriefcaseBusiness className="h-4 w-4" />
            <span>{item.type}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
        </div>
        <span className="filter-chip">{item.category}</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        <div className="mini-metric flex items-center justify-between gap-3">
          <span>Предприятие</span>
          <span className="font-medium text-foreground">{item.enterpriseName}</span>
        </div>
        <div className="mini-metric flex items-center justify-between gap-3">
          <span>Стоимость</span>
          <span className="font-medium text-foreground">{item.price}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary" />
          <span>Связаться с владельцем</span>
        </div>
        <Button asChild variant="outline">
          <Link to={`/enterprise/${item.enterpriseSlug}`}>
            Профиль
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
};

export default MarketplaceCard;
