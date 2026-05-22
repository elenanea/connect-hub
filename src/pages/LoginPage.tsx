import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, LogIn, UserCheck } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleTemplates, roleWorkspaceTemplates } from "@/data/mockAuth";
import { getMockSession, initializeMockAuthData, listMockUsers, loginMockUser, logoutMockUser, type SessionUser } from "@/lib/mock-auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    initializeMockAuthData();
    setSession(getMockSession());
  }, []);

  const demoUsers = useMemo(() => listMockUsers(), []);

  const activeRoleTemplate = useMemo(() => roleTemplates.find((item) => item.role === session?.role), [session?.role]);
  const activeWorkspaceTemplate = useMemo(
    () => roleWorkspaceTemplates.find((item) => item.role === session?.role),
    [session?.role],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const result = loginMockUser(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const { session } = result;
    setSession(session);
    
    // Перенаправляем на кабинет для предпринимателей
    if (session.role === "entrepreneur" && session.enterpriseSlug) {
      const targetPath = `/enterprise/${session.enterpriseSlug}/cabinet`;
      setMessage("Вхід успішний. Перенаправління...");
      // Используем requestAnimationFrame для гарантии того, что навигация произойдет в следующем фрейме
      requestAnimationFrame(() => {
        navigate(targetPath);
      });
    } else {
      setMessage("Вхід успішний. Тестова сесія збережена у localStorage.");
    }
  };

  const onLogout = () => {
    logoutMockUser();
    setSession(null);
    setMessage("Сесію завершено.");
  };

  return (
    <PlatformShell
      title="Вхід"
      subtitle="Авторизація працює у демо-режимі без бекенду: користувачі та сесія зберігаються локально в браузері."
    >
      <section className="section-band pt-2">
        <div className="site-container grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="section-frame space-y-5">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.ua" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ваш пароль" required />
              </div>

              {error && <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
              {message && <p className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p>}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="rounded-full px-7">
                  <LogIn className="h-4 w-4" />
                  Увійти
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/70 bg-white/70 px-7 backdrop-blur-sm">
                  <Link to="/register">Створити акаунт</Link>
                </Button>
              </div>
            </form>

            <div className="soft-divider" />

            <div>
              <div className="mb-3 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Демо-акаунти</p>
              </div>
              <div className="space-y-3">
                {demoUsers.map((user) => {
                  const role = roleTemplates.find((item) => item.role === user.role);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setEmail(user.email);
                        setPassword(user.password);
                      }}
                      className="w-full rounded-2xl border border-line/80 bg-secondary/60 p-3 text-left transition-colors hover:bg-accent"
                    >
                      <p className="text-sm font-semibold">{role?.title ?? user.role}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{user.email} · пароль: {user.password}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            {!session && (
              <article className="surface-panel p-5">
                <p className="eyebrow">Стан сесії</p>
                <h2 className="mt-3 text-2xl font-semibold">Ви не авторизовані</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Увійдіть у будь-який демо-акаунт, щоб побачити шаблон робочого простору для конкретної ролі.
                </p>
              </article>
            )}

            {session && (
              <article className="surface-panel p-5">
                <p className="eyebrow">Активна сесія</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{session.fullName}</h2>
                    <p className="text-sm text-muted-foreground">{session.email}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-line/70 bg-secondary/60 p-4">
                  <p className="text-sm font-semibold">Роль: {activeRoleTemplate?.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeRoleTemplate?.description}</p>
                </div>

                <div className="mt-4 space-y-3">
                  {activeWorkspaceTemplate?.sampleItems.map((item) => (
                    <div key={item.title} className="mini-metric flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{item.title}</span>
                      <span className="text-lg font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {activeWorkspaceTemplate?.quickActions.map((action) => (
                    <p key={action} className="mini-metric text-sm">
                      {action}
                    </p>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={onLogout} className="mt-5 rounded-full border-white/70 bg-white/70 px-7 backdrop-blur-sm">
                  Вийти
                </Button>
              </article>
            )}
          </aside>
        </div>
      </section>
    </PlatformShell>
  );
};

export default LoginPage;
