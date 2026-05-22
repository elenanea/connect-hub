import { Link, useNavigate } from "react-router-dom";
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
    itemSlug: string;
    images: string[];
  };
};

const MarketplaceCard = ({ item }: MarketplaceCardProps) => {
  const navigate = useNavigate();
  const detailPath = `/marketplace/${item.enterpriseSlug}/${item.type}/${item.itemSlug}`;
  const previewImage = item.images[0];

  return (
    <article
      className="surface-panel-hover bg-noise flex h-full cursor-pointer flex-col p-5 transition-shadow hover:shadow-lg"
      role="link"
      tabIndex={0}
      onClick={() => navigate(detailPath)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(detailPath);
        }
      }}
    >
        {previewImage && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-line/60">
            <img src={previewImage} alt={item.title} className="h-40 w-full object-cover" />
          </div>
        )}

        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>

        <div className="mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
          <BriefcaseBusiness className="h-4 w-4" />
          <span>{item.type}</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="filter-chip">{item.category}</span>
          <span className="text-sm font-semibold text-foreground">{item.price}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/80 pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{item.enterpriseName}</span>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/70 bg-white/70 px-5 backdrop-blur-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <Link to={detailPath}>
              Детальніше
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
  );
};

export default MarketplaceCard;
