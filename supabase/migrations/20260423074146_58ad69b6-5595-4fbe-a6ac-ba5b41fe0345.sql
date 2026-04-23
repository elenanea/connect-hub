CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.enterprise_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.service_mode AS ENUM ('service_provider', 'product_manufacturer', 'both');
CREATE TYPE public.partnership_status AS ENUM ('suggested', 'requested', 'accepted', 'declined');
CREATE TYPE public.contact_request_status AS ENUM ('new', 'in_progress', 'resolved');
CREATE TYPE public.analytics_event_type AS ENUM ('enterprise_view', 'product_view', 'service_view', 'partnership_click', 'chat_started', 'contact_sent');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  job_title text,
  company_name text,
  phone text,
  bio text,
  city text,
  preferred_language text DEFAULT 'uk',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE TABLE public.enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  cover_image_url text,
  categories text[] NOT NULL DEFAULT '{}',
  short_summary text,
  activity_description text,
  service_mode public.service_mode NOT NULL DEFAULT 'both',
  website_url text,
  phone text,
  email text,
  address text,
  google_map_url text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.enterprise_status NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.enterprise_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  branch_name text NOT NULL,
  address text NOT NULL,
  phone text,
  working_hours text,
  map_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.enterprise_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  category text,
  price_from numeric(12,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.enterprise_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  category text,
  price numeric(12,2),
  currency text NOT NULL DEFAULT 'UAH',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.partnership_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_enterprise_id uuid NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  target_enterprise_id uuid REFERENCES public.enterprises(id) ON DELETE CASCADE,
  created_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text NOT NULL,
  partnership_type text,
  status public.partnership_status NOT NULL DEFAULT 'suggested',
  cta_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.loyalty_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid NOT NULL REFERENCES public.enterprises(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  tier_name text,
  benefit_type text,
  benefit_value text,
  terms text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_requests_to_city_admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES public.enterprises(id) ON DELETE SET NULL,
  sender_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text,
  message text NOT NULL,
  status public.contact_request_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enterprise_id uuid REFERENCES public.enterprises(id) ON DELETE SET NULL,
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chat_id, user_id)
);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  summary text,
  content text,
  event_date timestamptz,
  is_event boolean NOT NULL DEFAULT false,
  image_url text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  enterprise_id uuid REFERENCES public.enterprises(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.enterprise_products(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.enterprise_services(id) ON DELETE SET NULL,
  event_type public.analytics_event_type NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_enterprises_owner ON public.enterprises(owner_user_id);
CREATE INDEX idx_enterprises_status ON public.enterprises(status);
CREATE INDEX idx_enterprises_categories ON public.enterprises USING gin(categories);
CREATE INDEX idx_enterprises_search ON public.enterprises USING gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(short_summary,'') || ' ' || coalesce(activity_description,'')));
CREATE INDEX idx_services_enterprise ON public.enterprise_services(enterprise_id);
CREATE INDEX idx_products_enterprise ON public.enterprise_products(enterprise_id);
CREATE INDEX idx_services_search ON public.enterprise_services USING gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(category,'')));
CREATE INDEX idx_products_search ON public.enterprise_products USING gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(category,'')));
CREATE INDEX idx_partnership_target ON public.partnership_offers(target_enterprise_id);
CREATE INDEX idx_chat_participants_user ON public.chat_participants(user_id);
CREATE INDEX idx_chat_messages_chat ON public.chat_messages(chat_id, created_at DESC);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type, created_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests_to_city_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view roles" ON public.user_roles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Published enterprises are viewable by everyone" ON public.enterprises
FOR SELECT TO authenticated, anon
USING (status = 'published' OR owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Owners can create enterprises" ON public.enterprises
FOR INSERT TO authenticated
WITH CHECK (owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can update enterprises" ON public.enterprises
FOR UPDATE TO authenticated
USING (owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Owners can delete enterprises" ON public.enterprises
FOR DELETE TO authenticated
USING (owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Enterprise branches are viewable with enterprise access" ON public.enterprise_branches
FOR SELECT TO authenticated, anon
USING (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.status = 'published' OR e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Enterprise owners manage branches" ON public.enterprise_branches
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Enterprise services are publicly viewable for published enterprises" ON public.enterprise_services
FOR SELECT TO authenticated, anon
USING (is_active = true AND EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.status = 'published' OR e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Enterprise owners manage services" ON public.enterprise_services
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Enterprise products are publicly viewable for published enterprises" ON public.enterprise_products
FOR SELECT TO authenticated, anon
USING (is_active = true AND EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.status = 'published' OR e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Enterprise owners manage products" ON public.enterprise_products
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Partnership offers are visible to involved enterprises and admins" ON public.partnership_offers
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = source_enterprise_id AND e.owner_user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = target_enterprise_id AND e.owner_user_id = auth.uid())
  OR (target_enterprise_id IS NULL AND EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = source_enterprise_id AND e.status = 'published'))
);

CREATE POLICY "Enterprise owners create partnership offers" ON public.partnership_offers
FOR INSERT TO authenticated
WITH CHECK (
  created_by_user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = source_enterprise_id AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

CREATE POLICY "Enterprise owners update partnership offers" ON public.partnership_offers
FOR UPDATE TO authenticated
USING (
  created_by_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.enterprises e WHERE e.id = target_enterprise_id AND e.owner_user_id = auth.uid())
);

CREATE POLICY "Loyalty programs are viewable for published enterprises" ON public.loyalty_programs
FOR SELECT TO authenticated, anon
USING (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.status = 'published' OR e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Enterprise owners manage loyalty programs" ON public.loyalty_programs
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.enterprises e
  WHERE e.id = enterprise_id
    AND (e.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
));

CREATE POLICY "Authenticated users can create city admin requests" ON public.contact_requests_to_city_admin
FOR INSERT TO authenticated
WITH CHECK (sender_user_id = auth.uid());

CREATE POLICY "Users view their own city admin requests" ON public.contact_requests_to_city_admin
FOR SELECT TO authenticated
USING (sender_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins moderate city admin requests" ON public.contact_requests_to_city_admin
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Chat members can view chats" ON public.chats
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_id = id AND cp.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Authenticated users can create chats" ON public.chats
FOR INSERT TO authenticated
WITH CHECK (created_by_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Chat creator or admins update chats" ON public.chats
FOR UPDATE TO authenticated
USING (created_by_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Chat members can view participants" ON public.chat_participants
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_id = chat_id AND cp.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Chat creator or admins manage participants" ON public.chat_participants
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.chats c WHERE c.id = chat_id AND (c.created_by_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.chats c WHERE c.id = chat_id AND (c.created_by_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

CREATE POLICY "Chat members can view messages" ON public.chat_messages
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_id = chat_id AND cp.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Chat participants send messages" ON public.chat_messages
FOR INSERT TO authenticated
WITH CHECK (
  sender_user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_id = chat_id AND cp.user_id = auth.uid())
);

CREATE POLICY "Published news is visible to everyone" ON public.news_items
FOR SELECT TO authenticated, anon
USING (published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins manage news" ON public.news_items
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Authenticated users can create analytics events" ON public.analytics_events
FOR INSERT TO authenticated
WITH CHECK (actor_user_id = auth.uid() OR actor_user_id IS NULL);

CREATE POLICY "Admins can view analytics events" ON public.analytics_events
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enterprises_updated_at
BEFORE UPDATE ON public.enterprises
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enterprise_branches_updated_at
BEFORE UPDATE ON public.enterprise_branches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enterprise_services_updated_at
BEFORE UPDATE ON public.enterprise_services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enterprise_products_updated_at
BEFORE UPDATE ON public.enterprise_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partnership_offers_updated_at
BEFORE UPDATE ON public.partnership_offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_programs_updated_at
BEFORE UPDATE ON public.loyalty_programs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests_to_city_admin
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_items_updated_at
BEFORE UPDATE ON public.news_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();