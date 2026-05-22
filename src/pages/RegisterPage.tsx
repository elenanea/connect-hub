import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ShieldCheck, UserRound, Users } from "lucide-react";
import PlatformShell from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { roleTemplates, siteAdminAccessCode, type UserRole } from "@/data/mockAuth";
import { initializeMockAuthData, registerMockUser } from "@/lib/mock-auth";

type RegisterFormState = {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  interests: string;
  wantsDiscountMatching: boolean;
  companyName: string;
  edrpou: string;
  businessCategory: string;
  provideCatalog: boolean;
  department: string;
  position: string;
  officialId: string;
  adminCode: string;
  adminNotes: string;
  acceptedTerms: boolean;
};

const roleIcons: Record<UserRole, typeof UserRound> = {
  consumer: UserRound,
  entrepreneur: Building2,
  city_admin: Users,
  site_admin: ShieldCheck,
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>({
    role: "consumer",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    interests: "",
    wantsDiscountMatching: true,
    companyName: "",
    edrpou: "",
    businessCategory: "",
    provideCatalog: true,
    department: "",
    position: "",
    officialId: "",
    adminCode: "",
    adminNotes: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeRole = useMemo(() => roleTemplates.find((item) => item.role === form.role), [form.role]);

  const setField = <K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    initializeMockAuthData();

    if (!form.acceptedTerms) {
      setError("Потрібно прийняти умови використання платформи.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Паролі не співпадають.");
      return;
    }

    const result = registerMockUser({
      role: form.role,
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      adminCode: form.adminCode,
      profile: {
        fullName: form.fullName,
        city: form.city,
        interests: form.interests,
        wantsDiscountMatching: form.wantsDiscountMatching,
        companyName: form.companyName,
        edrpou: form.edrpou,
        businessCategory: form.businessCategory,
        provideCatalog: form.provideCatalog,
        department: form.department,
        position: form.position,
        officialId: form.officialId,
        adminNotes: form.adminNotes,
      },
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess("Реєстрацію виконано. Тепер можна увійти у тестовий акаунт.");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <PlatformShell
      title="Реєстрація"
      subtitle="Створіть акаунт з потрібною роллю. Форма підтримує рольові поля і працює на мок-даних без бекенду."
    >
      <section className="section-band pt-2">
        <div className="site-container grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={onSubmit} className="section-frame space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">ПІБ</Label>
                <Input id="fullName" value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} placeholder="Ім'я та прізвище" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} placeholder="name@company.ua" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value={form.password} onChange={(event) => setField("password", event.target.value)} placeholder="Не менше 8 символів" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
                <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(event) => setField("confirmPassword", event.target.value)} placeholder="Повторіть пароль" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Роль</Label>
              <Select value={form.role} onValueChange={(value: UserRole) => setField("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть роль" />
                </SelectTrigger>
                <SelectContent>
                  {roleTemplates.map((item) => (
                    <SelectItem key={item.role} value={item.role}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.role === "consumer" && (
              <div className="glass-strip space-y-4">
                <p className="eyebrow">Поля ролі: Споживач</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Місто</Label>
                    <Input id="city" value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="Київ" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interests">Інтереси</Label>
                    <Input id="interests" value={form.interests} onChange={(event) => setField("interests", event.target.value)} placeholder="IT, логістика, консалтинг" />
                  </div>
                </div>
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox checked={form.wantsDiscountMatching} onCheckedChange={(value) => setField("wantsDiscountMatching", Boolean(value))} />
                  Отримувати знижки через автоматичний match з підприємствами
                </label>
              </div>
            )}

            {form.role === "entrepreneur" && (
              <div className="glass-strip space-y-4">
                <p className="eyebrow">Поля ролі: Підприємець</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Назва підприємства</Label>
                    <Input id="companyName" value={form.companyName} onChange={(event) => setField("companyName", event.target.value)} placeholder="ТОВ NovaWorks" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edrpou">ЄДРПОУ</Label>
                    <Input id="edrpou" value={form.edrpou} onChange={(event) => setField("edrpou", event.target.value)} placeholder="8 цифр" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Категорія діяльності</Label>
                    <Input id="businessCategory" value={form.businessCategory} onChange={(event) => setField("businessCategory", event.target.value)} placeholder="Виробництво, сервіси, логістика" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bizCity">Місто</Label>
                    <Input id="bizCity" value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="Дніпро" required />
                  </div>
                </div>
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox checked={form.provideCatalog} onCheckedChange={(value) => setField("provideCatalog", Boolean(value))} />
                  Одразу розмістити товари та послуги після створення акаунта
                </label>
              </div>
            )}

            {form.role === "city_admin" && (
              <div className="glass-strip space-y-4">
                <p className="eyebrow">Поля ролі: Адміністрація міста</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Департамент</Label>
                    <Input id="department" value={form.department} onChange={(event) => setField("department", event.target.value)} placeholder="Департамент економіки" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Посада</Label>
                    <Input id="position" value={form.position} onChange={(event) => setField("position", event.target.value)} placeholder="Керівник напрямку" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminCity">Місто</Label>
                    <Input id="adminCity" value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="Львів" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officialId">Службовий ID</Label>
                    <Input id="officialId" value={form.officialId} onChange={(event) => setField("officialId", event.target.value)} placeholder="CITY-2026-001" required />
                  </div>
                </div>
              </div>
            )}

            {form.role === "site_admin" && (
              <div className="glass-strip space-y-4">
                <p className="eyebrow">Поля ролі: Адміністратор сайта</p>
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Код доступу</Label>
                  <Input id="adminCode" value={form.adminCode} onChange={(event) => setField("adminCode", event.target.value)} placeholder="Введіть код доступу" required />
                  <p className="text-xs text-muted-foreground">Для демо використайте код: {siteAdminAccessCode}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Нотатки адміністратора</Label>
                  <Textarea id="adminNotes" value={form.adminNotes} onChange={(event) => setField("adminNotes", event.target.value)} placeholder="Відповідальна зона, контур доступу, коментарі" />
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 text-sm">
              <Checkbox checked={form.acceptedTerms} onCheckedChange={(value) => setField("acceptedTerms", Boolean(value))} />
              <span>
                Підтверджую згоду з умовами використання та правилами обробки персональних даних у межах демо-середовища.
              </span>
            </label>

            {error && <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
            {success && <p className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">{success}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="rounded-full px-7">Створити акаунт</Button>
              <Button asChild variant="outline" className="rounded-full border-white/70 bg-white/70 px-7 backdrop-blur-sm">
                <Link to="/login">Вже є акаунт? Увійти</Link>
              </Button>
            </div>
          </form>

          <aside className="space-y-4">
            {roleTemplates.map((role) => {
              const Icon = roleIcons[role.role];
              const active = role.role === form.role;

              return (
                <article key={role.role} className={`surface-panel p-5 ${active ? "border-primary/40" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold">{role.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{role.description}</p>
                  <div className="mt-4 space-y-2">
                    {role.capabilities.map((capability) => (
                      <p key={capability} className="mini-metric text-sm">
                        {capability}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}
          </aside>
        </div>
      </section>
    </PlatformShell>
  );
};

export default RegisterPage;
