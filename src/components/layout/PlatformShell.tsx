import { ReactNode } from "react";
import { Building2, LineChart, MessageSquareMore, PackageSearch, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Главная", icon: Sparkles, end: true },
  { to: "/enterprises", label: "Предприятия", icon: Building2 },
  { to: "/marketplace", label: "Товары и услуги", icon: PackageSearch },
  { to: "/analytics", label: "Аналитика", icon: LineChart },
  { to: "/chat", label: "Чат", icon: MessageSquareMore },
];

type PlatformShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

const PlatformShell = ({ children, title, subtitle }: PlatformShellProps) => {
  return (
    <div className="page-shell">
      <div className="mesh-glow" />
      <header className="topbar-blur sticky top-0 z-40">
        <div className="site-container flex min-h-20 items-center justify-between gap-4">
          <NavLink to="/" end className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-card shadow-soft">
              <span className="text-sm font-semibold text-foreground">BC</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Business Connect</p>
              <p className="text-xs text-muted-foreground">Городская платформа кооперации</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="nav-link inline-flex items-center gap-2"
                activeClassName="nav-link-active"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline">Войти</Button>
            <Button>Регистрация</Button>
          </div>
        </div>
      </header>

      {(title || subtitle) && (
        <div className="site-container section-band pb-4 pt-8">
          {title && <h1 className="section-heading text-balance">{title}</h1>}
          {subtitle && <p className="section-copy mt-3">{subtitle}</p>}
        </div>
      )}

      <main>{children}</main>
    </div>
  );
};

export default PlatformShell;
