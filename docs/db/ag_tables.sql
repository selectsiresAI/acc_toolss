-- =====================================================================
-- Accelerated Genetics (AG) — tabelas isoladas
-- Aplicar via Supabase Dashboard → SQL Editor no projeto
-- odactdxpecpiyiyaqfgi (Plataform).
-- Namespace: sufixo _ag no schema public. Não toca em nada do ToolSS.
-- =====================================================================

-- 1. FARMS_AG ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farms_ag (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  code          text UNIQUE,
  country       text,
  state         text,
  city          text,
  address       text,
  contact_name  text,
  contact_email text,
  contact_phone text,
  notes         text,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farms_ag TO authenticated;
GRANT ALL ON public.farms_ag TO service_role;
ALTER TABLE public.farms_ag ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES_AG ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles_ag (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    text,
  email        text,
  phone        text,
  role_title   text,
  avatar_url   text,
  language     text DEFAULT 'pt-BR',
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles_ag TO authenticated;
GRANT ALL ON public.profiles_ag TO service_role;
ALTER TABLE public.profiles_ag ENABLE ROW LEVEL SECURITY;

-- 3. USER_FARMS_AG (multi-tenant N:N) ---------------------------------
CREATE TABLE IF NOT EXISTS public.user_farms_ag (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id    uuid NOT NULL REFERENCES public.farms_ag(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, farm_id)
);
CREATE INDEX IF NOT EXISTS idx_user_farms_ag_user ON public.user_farms_ag(user_id);
CREATE INDEX IF NOT EXISTS idx_user_farms_ag_farm ON public.user_farms_ag(farm_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_farms_ag TO authenticated;
GRANT ALL ON public.user_farms_ag TO service_role;
ALTER TABLE public.user_farms_ag ENABLE ROW LEVEL SECURITY;

-- 4. FEMALES_AG -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.females_ag (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id           uuid NOT NULL REFERENCES public.farms_ag(id) ON DELETE CASCADE,
  ear_tag           text,
  registration_id   text,
  name              text,
  birth_date        date,
  breed             text,
  sire_naab         text,
  dam_id            text,
  mgs_naab          text,
  status            text DEFAULT 'active',
  lactation_number  integer,
  notes             text,
  raw_data          jsonb,
  created_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (farm_id, ear_tag)
);
CREATE INDEX IF NOT EXISTS idx_females_ag_farm       ON public.females_ag(farm_id);
CREATE INDEX IF NOT EXISTS idx_females_ag_sire       ON public.females_ag(sire_naab);
CREATE INDEX IF NOT EXISTS idx_females_ag_birth_date ON public.females_ag(birth_date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.females_ag TO authenticated;
GRANT ALL ON public.females_ag TO service_role;
ALTER TABLE public.females_ag ENABLE ROW LEVEL SECURITY;

-- 5. SECURITY DEFINER: has_farm_access_ag -----------------------------
CREATE OR REPLACE FUNCTION public.has_farm_access_ag(_user_id uuid, _farm_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_farms_ag
     WHERE user_id = _user_id AND farm_id = _farm_id
  );
$$;
REVOKE ALL ON FUNCTION public.has_farm_access_ag(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_farm_access_ag(uuid, uuid) TO authenticated, service_role;

-- 6. Trigger updated_at -----------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_ag()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_farms_ag_updated_at    ON public.farms_ag;
DROP TRIGGER IF EXISTS trg_profiles_ag_updated_at ON public.profiles_ag;
DROP TRIGGER IF EXISTS trg_females_ag_updated_at  ON public.females_ag;
CREATE TRIGGER trg_farms_ag_updated_at    BEFORE UPDATE ON public.farms_ag    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_ag();
CREATE TRIGGER trg_profiles_ag_updated_at BEFORE UPDATE ON public.profiles_ag FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_ag();
CREATE TRIGGER trg_females_ag_updated_at  BEFORE UPDATE ON public.females_ag  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_ag();

-- 7. RLS POLICIES -----------------------------------------------------
-- profiles_ag (cada usuário só o próprio)
CREATE POLICY "profiles_ag_select_own" ON public.profiles_ag FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "profiles_ag_insert_own" ON public.profiles_ag FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "profiles_ag_update_own" ON public.profiles_ag FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- user_farms_ag (só as próprias associações)
CREATE POLICY "user_farms_ag_select_own" ON public.user_farms_ag FOR SELECT TO authenticated USING (user_id = auth.uid());

-- farms_ag (só farms às quais o usuário tem acesso)
CREATE POLICY "farms_ag_select_by_access" ON public.farms_ag FOR SELECT TO authenticated USING (public.has_farm_access_ag(auth.uid(), id));
CREATE POLICY "farms_ag_insert_creator"   ON public.farms_ag FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "farms_ag_update_by_access" ON public.farms_ag FOR UPDATE TO authenticated USING (public.has_farm_access_ag(auth.uid(), id)) WITH CHECK (public.has_farm_access_ag(auth.uid(), id));
CREATE POLICY "farms_ag_delete_by_access" ON public.farms_ag FOR DELETE TO authenticated USING (public.has_farm_access_ag(auth.uid(), id));

-- females_ag (CRUD condicionado à farm dona)
CREATE POLICY "females_ag_select_by_farm" ON public.females_ag FOR SELECT TO authenticated USING (public.has_farm_access_ag(auth.uid(), farm_id));
CREATE POLICY "females_ag_insert_by_farm" ON public.females_ag FOR INSERT TO authenticated WITH CHECK (public.has_farm_access_ag(auth.uid(), farm_id));
CREATE POLICY "females_ag_update_by_farm" ON public.females_ag FOR UPDATE TO authenticated USING (public.has_farm_access_ag(auth.uid(), farm_id)) WITH CHECK (public.has_farm_access_ag(auth.uid(), farm_id));
CREATE POLICY "females_ag_delete_by_farm" ON public.females_ag FOR DELETE TO authenticated USING (public.has_farm_access_ag(auth.uid(), farm_id));
