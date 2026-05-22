import { ReactNode, useEffect, useMemo, useState } from "react";
import { Building2, Briefcase, Home, LogOut, PackageSearch } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import siteLogo from "@/assets/logo.svg";
import { getEnterpriseBySlug } from "@/data/marketplace";
import { getMockSession, logoutMockUser, type SessionUser } from "@/lib/mock-auth";

const navItems = [
  { to: "/", label: "Головна", icon: Home, end: true },
  { to: "/enterprises", label: "Підприємства", icon: Building2 },
  { to: "/marketplace", label: "Товари та послуги", icon: PackageSearch },
  { to: "/opportunities", label: "Можливості для бізнесу", icon: Briefcase },
];

type PlatformShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  plainHeader?: boolean;
};

const PlatformShell = ({ children, title, subtitle, plainHeader = false }: PlatformShellProps) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    setSession(getMockSession());
  }, []);

  const enterpriseName = useMemo(() => {
    if (!session) return "";
    if (session.enterpriseSlug) {
      return getEnterpriseBySlug(session.enterpriseSlug).name;
    }
    return session.fullName;
  }, [session]);

  const shortEnterpriseName = useMemo(() => {
    if (!enterpriseName) return "";
    return enterpriseName.length > 18 ? `${enterpriseName.slice(0, 18)}...` : enterpriseName;
  }, [enterpriseName]);

  const enterpriseLink = session?.enterpriseSlug ? `/enterprise/${session.enterpriseSlug}/cabinet` : "/";

  const handleLogout = () => {
    logoutMockUser();
    setSession(null);
    navigate("/");
  };

  return (
    <div className="page-shell">
      <div className="mesh-glow" />
      <header className="topbar-blur sticky top-0 z-40">
        <div className="site-container py-4">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/" end className="flex items-center gap-3">
              <img src={siteLogo} alt="Свій.Space" className="h-11 w-11 object-contain" />
              <div className="flex h-11 flex-col justify-between">
                <p className="text-lg font-semibold leading-none md:text-xl">Свій.Space</p>
                <p className="text-[11px] leading-none text-muted-foreground">Сумська громада</p>
              </div>
            </NavLink>

            <nav className="hidden items-center gap-2 lg:ml-6 lg:flex">
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

            <div className="hidden items-center gap-3 md:flex">
              {!session ? (
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-full border-white/70 bg-white/70 px-5 backdrop-blur-md">
                    <Link to="/login">Вхід</Link>
                  </Button>
                  <Button asChild className="rounded-full px-5">
                    <Link to="/register">Реєстрація</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-full border-white/70 bg-white/70 px-4 backdrop-blur-md">
                    <Link to={enterpriseLink} className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{shortEnterpriseName}</span>
                    </Link>
                  </Button>
                  <Button type="button" variant="outline" className="rounded-full border-white/70 bg-white/70 px-5 backdrop-blur-md" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Вихід</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              {!session ? (
                <Button asChild className="rounded-full px-5" size="sm">
                  <Link to="/login">Вхід</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full border-white/70 bg-white/70 px-3 backdrop-blur-md">
                    <Link to={enterpriseLink} className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="max-w-[90px] truncate">{shortEnterpriseName}</span>
                    </Link>
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="rounded-full border-white/70 bg-white/70 px-3 backdrop-blur-md" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Вихід</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="nav-link inline-flex shrink-0 items-center gap-2"
                activeClassName="nav-link-active"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {(title || subtitle) && (
        <div className="site-container section-band pb-4 pt-8">
          <div className={plainHeader ? "" : "section-frame bg-noise"}>
            {title && <h1 className="section-heading text-balance">{title}</h1>}
            {subtitle && <p className="section-copy mt-3">{subtitle}</p>}
          </div>
        </div>
      )}

      <main>{children}</main>
    </div>
  );
};

export default PlatformShell;
