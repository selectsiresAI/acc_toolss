-- Nível 1: Performance indexes for bulls table
-- Nível 2: bull_naab_aliases table for O(1) NAAB lookup

-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- Nível 1: Add breed_number column and indexes
ALTER TABLE public.bulls ADD COLUMN IF NOT EXISTS breed_number text;

-- Populate breed_number from code_normalized (extract breed+number suffix)
UPDATE public.bulls
SET breed_number = (regexp_match(code_normalized, '^\d+((?:HO|JE|BS|AY|GU|MS|H|J|B|A|G|M)\d+)$'))[1]
WHERE breed_number IS NULL AND code_normalized IS NOT NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bulls_code_normalized ON public.bulls (code_normalized);
CREATE INDEX IF NOT EXISTS idx_bulls_code_normalized_trgm ON public.bulls USING gin (code_normalized gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_bulls_breed_number ON public.bulls (breed_number);

-- Nível 2: bull_naab_aliases table
CREATE TABLE IF NOT EXISTS public.bull_naab_aliases (
  naab_variant text NOT NULL,
  bull_id uuid NOT NULL REFERENCES public.bulls(id) ON DELETE CASCADE,
  alias_type text NOT NULL DEFAULT 'exact',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (naab_variant, bull_id)
);

CREATE INDEX IF NOT EXISTS idx_bull_naab_aliases_bull_id ON public.bull_naab_aliases (bull_id);
CREATE INDEX IF NOT EXISTS idx_bull_naab_aliases_variant ON public.bull_naab_aliases (naab_variant);

-- RLS
ALTER TABLE public.bull_naab_aliases ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bull_naab_aliases' AND policyname = 'bull_naab_aliases_read') THEN
    CREATE POLICY bull_naab_aliases_read ON public.bull_naab_aliases FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Updated naab_variants function: handles breed-only suffixes (HO03415->H03415)
CREATE OR REPLACE FUNCTION public.naab_variants(normalized text)
RETURNS text[]
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $fn$
DECLARE
  result text[] := ARRAY[normalized];
  parts text[];
BEGIN
  IF normalized IS NULL THEN
    RETURN ARRAY[]::text[];
  END IF;

  -- HO -> H: 200HO10624 -> 200H10624
  parts := regexp_match(normalized, '^(\d+)HO(\d+)$');
  IF parts IS NOT NULL THEN
    result := result || (parts[1] || 'H' || parts[2]);
  END IF;

  -- H -> HO (only if not already HO)
  IF parts IS NULL THEN
    parts := regexp_match(normalized, '^(\d+)H(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || (parts[1] || 'HO' || parts[2]);
    END IF;
  END IF;

  -- Suffix-only patterns (no leading digits): HO03415 -> H03415
  IF parts IS NULL THEN
    parts := regexp_match(normalized, '^HO(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || ('H' || parts[1]);
    ELSE
      parts := regexp_match(normalized, '^H(\d+)$');
      IF parts IS NOT NULL THEN
        result := result || ('HO' || parts[1]);
      END IF;
    END IF;
  END IF;

  -- JE<->J
  parts := regexp_match(normalized, '^(\d+)JE(\d+)$');
  IF parts IS NOT NULL THEN
    result := result || (parts[1] || 'J' || parts[2]);
  ELSE
    parts := regexp_match(normalized, '^(\d+)J(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || (parts[1] || 'JE' || parts[2]);
    END IF;
  END IF;

  -- BS<->B
  parts := regexp_match(normalized, '^(\d+)BS(\d+)$');
  IF parts IS NOT NULL THEN
    result := result || (parts[1] || 'B' || parts[2]);
  ELSE
    parts := regexp_match(normalized, '^(\d+)B(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || (parts[1] || 'BS' || parts[2]);
    END IF;
  END IF;

  -- AY<->A
  parts := regexp_match(normalized, '^(\d+)AY(\d+)$');
  IF parts IS NOT NULL THEN
    result := result || (parts[1] || 'A' || parts[2]);
  ELSE
    parts := regexp_match(normalized, '^(\d+)A(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || (parts[1] || 'AY' || parts[2]);
    END IF;
  END IF;

  RETURN result;
END;
$fn$;

-- naab_breed_number_suffixes: extract breed+number for cross-company matching
CREATE OR REPLACE FUNCTION public.naab_breed_number_suffixes(naab text)
RETURNS text[]
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $fn$
DECLARE
  parts text[];
  suffix text;
  result text[];
BEGIN
  IF naab IS NULL THEN RETURN ARRAY[]::text[]; END IF;
  parts := regexp_match(naab, '^(\d+)((?:HO|JE|BS|AY|GU|MS|H|J|B|A|G|M)\d+)$');
  IF parts IS NULL THEN RETURN ARRAY[]::text[]; END IF;
  suffix := parts[2];
  result := ARRAY[suffix];
  -- Add HO<->H variant
  parts := regexp_match(suffix, '^HO(\d+)$');
  IF parts IS NOT NULL THEN
    result := result || ('H' || parts[1]);
  ELSE
    parts := regexp_match(suffix, '^H(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || ('HO' || parts[1]);
    END IF;
  END IF;
  RETURN result;
END;
$fn$;

-- Trigger function: auto-sync aliases when bulls are inserted/updated/deleted
CREATE OR REPLACE FUNCTION public.sync_bull_naab_aliases()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
DECLARE
  norm text;
  variants text[];
  v text;
  suffixes text[];
  no_zeros text;
  nz_variants text[];
BEGIN
  -- On DELETE or UPDATE, remove old aliases
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    DELETE FROM public.bull_naab_aliases WHERE bull_id = OLD.id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  END IF;

  -- On INSERT or UPDATE, create new aliases
  norm := NEW.code_normalized;
  IF norm IS NULL OR norm = '' THEN RETURN NEW; END IF;

  -- 1. Exact normalized
  INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
  VALUES (norm, NEW.id, 'exact')
  ON CONFLICT (naab_variant, bull_id) DO NOTHING;

  -- 2. All HO<->H variants
  variants := public.naab_variants(norm);
  FOREACH v IN ARRAY variants LOOP
    IF v <> norm THEN
      INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
      VALUES (v, NEW.id, 'ho_h_variant')
      ON CONFLICT (naab_variant, bull_id) DO NOTHING;
    END IF;
  END LOOP;

  -- 3. Zero-padded variants (add leading zeros: 7HO12988 -> 007HO12988, etc.)
  -- Also strip leading zeros for the reverse
  no_zeros := regexp_replace(norm, '^0+', '');
  IF no_zeros <> '' AND no_zeros <> norm THEN
    INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
    VALUES (no_zeros, NEW.id, 'zero_stripped')
    ON CONFLICT (naab_variant, bull_id) DO NOTHING;
    -- Also add HO<->H variants of zero-stripped
    nz_variants := public.naab_variants(no_zeros);
    FOREACH v IN ARRAY nz_variants LOOP
      IF v <> no_zeros THEN
        INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
        VALUES (v, NEW.id, 'zero_stripped_variant')
        ON CONFLICT (naab_variant, bull_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Common zero-padded formats: pad to 3 digits prefix
  DECLARE
    prefix_match text[];
    prefix_num text;
    breed_suffix text;
    padded text;
  BEGIN
    prefix_match := regexp_match(norm, '^(\d+)([A-Z]+\d+)$');
    IF prefix_match IS NOT NULL THEN
      prefix_num := prefix_match[1];
      breed_suffix := prefix_match[2];
      -- Pad to 3 digits
      IF length(prefix_num) < 3 THEN
        padded := lpad(prefix_num, 3, '0') || breed_suffix;
        INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
        VALUES (padded, NEW.id, 'zero_padded')
        ON CONFLICT (naab_variant, bull_id) DO NOTHING;
        -- Also HO<->H variant of padded
        nz_variants := public.naab_variants(padded);
        FOREACH v IN ARRAY nz_variants LOOP
          IF v <> padded THEN
            INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
            VALUES (v, NEW.id, 'zero_padded_variant')
            ON CONFLICT (naab_variant, bull_id) DO NOTHING;
          END IF;
        END LOOP;
      END IF;
    END IF;
  END;

  -- 4. Breed+number suffixes (for cross-company matching)
  suffixes := public.naab_breed_number_suffixes(norm);
  IF suffixes IS NOT NULL THEN
    FOREACH v IN ARRAY suffixes LOOP
      INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
      VALUES (v, NEW.id, 'breed_number')
      ON CONFLICT (naab_variant, bull_id) DO NOTHING;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$fn$;

-- Create trigger on bulls table
DROP TRIGGER IF EXISTS trg_sync_bull_aliases ON public.bulls;
CREATE TRIGGER trg_sync_bull_aliases
  AFTER INSERT OR UPDATE OF code_normalized, naab_code
  OR DELETE ON public.bulls
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_bull_naab_aliases();

-- Fast lookup RPC: uses aliases table for O(1) lookup
CREATE OR REPLACE FUNCTION public.lookup_bull_by_naab(naab text)
RETURNS TABLE(
    found boolean,
    bull_id uuid,
    code text,
    name text,
    registration text,
    birth_date date,
    company text,
    sire_naab text,
    mgs_naab text,
    mmgs_naab text,
    hhp_dollar numeric, tpi numeric, nm_dollar numeric, cm_dollar numeric,
    fm_dollar numeric, gm_dollar numeric, f_sav numeric, ptam numeric,
    cfp numeric, ptaf numeric, ptaf_pct numeric, ptap numeric,
    ptap_pct numeric, pl numeric, dpr numeric, liv numeric,
    scs numeric, mast numeric, met numeric, rp numeric,
    da numeric, ket numeric, mf numeric, ptat numeric,
    udc numeric, flc numeric, sce numeric, dce numeric,
    ssb numeric, dsb numeric, h_liv numeric, ccr numeric,
    hcr numeric, fi numeric, bwc numeric, sta numeric,
    str numeric, dfm numeric, rua numeric, rls numeric,
    rtp numeric, ftl numeric, rw numeric, rlr numeric,
    fta numeric, fls numeric, fua numeric, ruh numeric,
    ruw numeric, ucl numeric, udp numeric, ftp numeric,
    rfi numeric, beta_casein text, kappa_casein text, gfi numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  normalized_input text;
  all_variants text[];
  v text;
  suffixes text[];
  no_zeros text;
  matched_bull_id uuid;
BEGIN
  normalized_input := public.expand_naab_query(naab);
  IF normalized_input IS NULL THEN RETURN; END IF;

  -- Step 1: Direct alias lookup (exact match on pre-computed variants)
  SELECT a.bull_id INTO matched_bull_id
  FROM public.bull_naab_aliases a
  WHERE a.naab_variant = normalized_input
  LIMIT 1;

  -- Step 2: Try all HO<->H variants
  IF matched_bull_id IS NULL THEN
    all_variants := public.naab_variants(normalized_input);
    FOREACH v IN ARRAY all_variants LOOP
      SELECT a.bull_id INTO matched_bull_id
      FROM public.bull_naab_aliases a
      WHERE a.naab_variant = v
      LIMIT 1;
      EXIT WHEN matched_bull_id IS NOT NULL;
    END LOOP;
  END IF;

  -- Step 3: Try without leading zeros
  IF matched_bull_id IS NULL THEN
    no_zeros := regexp_replace(normalized_input, '^0+', '');
    IF no_zeros <> '' AND no_zeros <> normalized_input THEN
      SELECT a.bull_id INTO matched_bull_id
      FROM public.bull_naab_aliases a
      WHERE a.naab_variant = no_zeros
      LIMIT 1;
    END IF;
  END IF;

  -- Step 4: Breed+number suffix (cross-company matching)
  IF matched_bull_id IS NULL THEN
    suffixes := public.naab_breed_number_suffixes(normalized_input);
    IF suffixes IS NOT NULL THEN
      FOREACH v IN ARRAY suffixes LOOP
        SELECT a.bull_id INTO matched_bull_id
        FROM public.bull_naab_aliases a
        WHERE a.naab_variant = v
        LIMIT 1;
        EXIT WHEN matched_bull_id IS NOT NULL;
      END LOOP;
    END IF;
  END IF;

  IF matched_bull_id IS NULL THEN RETURN; END IF;

  RETURN QUERY
  SELECT true,
    bd.id, bd.code, bd.name, bd.registration, bd.birth_date, bd.company,
    bd.sire_naab, bd.mgs_naab, bd.mmgs_naab,
    bd.hhp_dollar, bd.tpi, bd.nm_dollar, bd.cm_dollar,
    bd.fm_dollar, bd.gm_dollar, bd.f_sav, bd.ptam,
    bd.cfp, bd.ptaf, bd.ptaf_pct, bd.ptap,
    bd.ptap_pct, bd.pl, bd.dpr, bd.liv,
    bd.scs, bd.mast, bd.met, bd.rp,
    bd.da, bd.ket, bd.mf, bd.ptat,
    bd.udc, bd.flc, bd.sce, bd.dce,
    bd.ssb, bd.dsb, bd.h_liv, bd.ccr,
    bd.hcr, bd.fi, bd.bwc, bd.sta,
    bd.str, bd.dfm, bd.rua, bd.rls,
    bd.rtp, bd.ftl, bd.rw, bd.rlr,
    bd.fta, bd.fls, bd.fua, bd.ruh,
    bd.ruw, bd.ucl, bd.udp, bd.ftp,
    bd.rfi, bd.beta_casein, bd.kappa_casein, bd.gfi
  FROM public.bulls_denorm bd
  WHERE bd.id = matched_bull_id
  LIMIT 1;
END;
$$;

-- Populate aliases for all existing bulls (one-time bulk insert)
-- This runs the trigger logic in bulk for performance
INSERT INTO public.bull_naab_aliases (naab_variant, bull_id, alias_type)
SELECT DISTINCT v.variant, b.id,
  CASE
    WHEN v.variant = b.code_normalized THEN 'exact'
    WHEN v.variant = ANY(public.naab_breed_number_suffixes(b.code_normalized)) THEN 'breed_number'
    ELSE 'normalized'
  END
FROM public.bulls b,
LATERAL (
  SELECT unnest(
    public.naab_variants(b.code_normalized) ||
    public.naab_breed_number_suffixes(b.code_normalized) ||
    CASE WHEN b.code_normalized ~ '^0' THEN
      public.naab_variants(regexp_replace(b.code_normalized, '^0+', ''))
    ELSE ARRAY[]::text[] END
  ) AS variant
) v
WHERE b.code_normalized IS NOT NULL AND b.code_normalized <> ''
ON CONFLICT (naab_variant, bull_id) DO NOTHING;
