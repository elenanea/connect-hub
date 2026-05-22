import { useParams, Link } from "react-router-dom";
import { CalendarRange, ArrowLeft } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { newsItems } from "@/data/marketplace";

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const news = newsItems.find((n) => n.slug === slug);

  if (!news) {
    return (
      <PlatformShell>
        <div className="site-container section-band text-center">
          <p className="section-heading">Новину не знайдено</p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/">← На головну</Link>
          </Button>
        </div>
      </PlatformShell>
    );
  }

  // Render content: lines starting with ** are bold headings, bullet "- " are list items
  const renderContent = (text: string) => {
    const lines = text.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key} className="mt-2 mb-4 space-y-1 list-disc list-inside text-muted-foreground text-base leading-7">
            {listItems.map((li, i) => <li key={i}>{li}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList(`flush-${idx}`);
        return;
      }
      if (trimmed.startsWith("- ")) {
        listItems.push(trimmed.slice(2));
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList(`flush-${idx}`);
        elements.push(
          <h3 key={idx} className="mt-6 mb-2 text-lg font-semibold text-foreground">
            {trimmed.slice(2, -2)}
          </h3>
        );
      } else {
        flushList(`flush-${idx}`);
        elements.push(
          <p key={idx} className="mt-3 text-base leading-7 text-muted-foreground">
            {trimmed}
          </p>
        );
      }
    });
    flushList("flush-end");

    return elements;
  };

  return (
    <PlatformShell>
      <div className="site-container section-band">
        <Button asChild variant="ghost" className="mb-6 rounded-full gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Назад до головної
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl">
          {/* Image */}
          <div className="overflow-hidden rounded-[1.5rem] border border-line/60">
            <img
              src={news.image}
              alt={news.title}
              className="w-full object-cover"
              style={{ maxHeight: 420 }}
            />
          </div>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-primary">
            <CalendarRange className="h-4 w-4" />
            <span>{news.type}</span>
            <span className="text-muted-foreground font-normal normal-case tracking-normal">·</span>
            <span className="text-muted-foreground font-normal normal-case tracking-normal">{news.date}</span>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-semibold leading-snug md:text-4xl text-foreground">
            {news.title}
          </h1>

          {/* Lead */}
          <p className="mt-4 text-lg leading-8 text-muted-foreground border-l-4 border-primary/40 pl-5">
            {news.summary}
          </p>

          {/* Body */}
          <div className="mt-8 pb-12">
            {renderContent(news.content)}
          </div>
        </article>
      </div>
    </PlatformShell>
  );
};

export default NewsArticle;
