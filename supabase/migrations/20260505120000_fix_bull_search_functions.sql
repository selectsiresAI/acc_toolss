-- Fix bull search RPCs: remove jsonb versions (100 arg limit), use RETURNS TABLE
-- Also fix nx3_bulls_lookup to reference naab_code instead of code
-- Improve search to match partial NAAB: "7H" -> "7HO%", "011H" -> "11HO%", "001HO" -> "1HO%"

-- Helper: expand partial NAAB input for flexible matching
-- "7H" -> "7HO", "011H" -> "11HO", "7H18596" -> "7HO18596", "9HO" -> "9HO"
CREATE OR REPLACE FUNCTION public.expand_naab_query(q text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $$
DECLARE
  normalized text;
BEGIN
  IF q IS NULL OR TRIM(q) = '' THEN
    RETURN NULL;
  END IF;

  -- Normalize: uppercase, remove spaces/hyphens, strip leading zeros
  normalized := UPPER(REPLACE(REPLACE(TRIM(q), ' ', ''), '-', ''));
  normalized := regexp_replace(normalized, '^0+([1-9][0-9]*[A-Z]+)', '\1');
  normalized := regexp_replace(normalized, '^0+([A-Z]+)', '\1');

  -- If has pattern digits-H-digits (without O), insert O: 7H18596 -> 7HO18596
  IF normalized ~ '^[0-9]+H[0-9]+$' THEN
    normalized := regexp_replace(normalized, '^([0-9]+H)([0-9]+)$', '\1O\2');
  END IF;

  -- If ends with H alone (no digits after), append O: 7H -> 7HO
  IF normalized ~ '^[0-9]+H$' THEN
    normalized := normalized || 'O';
  END IF;

  RETURN normalized;
END;
$$;

-- ============================================================
-- DROP conflicting jsonb versions
-- ============================================================
DROP FUNCTION IF EXISTS public.search_bulls(text, int);
DROP FUNCTION IF EXISTS public.search_bulls(text, integer);
DROP FUNCTION IF EXISTS public.get_bull_by_naab(text);

-- ============================================================
-- search_bulls: busca por NAAB (parcial/completo) ou nome
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_bulls(q text, limit_count integer DEFAULT 20)
RETURNS TABLE(
    bull_id uuid,
    code text,
    name text,
    registration text,
    birth_date date,
    company text,
    sire_naab text,
    mgs_naab text,
    mmgs_naab text,
    hhp_dollar numeric,
    tpi numeric,
    nm_dollar numeric,
    cm_dollar numeric,
    fm_dollar numeric,
    gm_dollar numeric,
    f_sav numeric,
    ptam numeric,
    cfp numeric,
    ptaf numeric,
    ptaf_pct numeric,
    ptap numeric,
    ptap_pct numeric,
    pl numeric,
    dpr numeric,
    liv numeric,
    scs numeric,
    mast numeric,
    met numeric,
    rp numeric,
    da numeric,
    ket numeric,
    mf numeric,
    ptat numeric,
    udc numeric,
    flc numeric,
    sce numeric,
    dce numeric,
    ssb numeric,
    dsb numeric,
    h_liv numeric,
    ccr numeric,
    hcr numeric,
    fi numeric,
    bwc numeric,
    sta numeric,
    str numeric,
    dfm numeric,
    rua numeric,
    rls numeric,
    rtp numeric,
    ftl numeric,
    rw numeric,
    rlr numeric,
    fta numeric,
    fls numeric,
    fua numeric,
    ruh numeric,
    ruw numeric,
    ucl numeric,
    udp numeric,
    ftp numeric,
    rfi numeric,
    beta_casein text,
    kappa_casein text,
    gfi numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  trimmed text;
  expanded text;
  is_naab_like boolean;
BEGIN
  trimmed := TRIM(q);
  IF trimmed IS NULL OR LENGTH(trimmed) < 1 THEN
    RETURN;
  END IF;

  -- Detect if query looks like a NAAB code (starts with digits or is alphanumeric pattern)
  is_naab_like := trimmed ~ '^[0-9]' OR trimmed ~* '^[0-9]*H[O]?';
  expanded := public.expand_naab_query(trimmed);

  RETURN QUERY
  SELECT
    bd.id,
    bd.code,
    bd.name,
    bd.registration,
    bd.birth_date,
    bd.company,
    bd.sire_naab,
    bd.mgs_naab,
    bd.mmgs_naab,
    bd.hhp_dollar,
    bd.tpi,
    bd.nm_dollar,
    bd.cm_dollar,
    bd.fm_dollar,
    bd.gm_dollar,
    bd.f_sav,
    bd.ptam,
    bd.cfp,
    bd.ptaf,
    bd.ptaf_pct,
    bd.ptap,
    bd.ptap_pct,
    bd.pl,
    bd.dpr,
    bd.liv,
    bd.scs,
    bd.mast,
    bd.met,
    bd.rp,
    bd.da,
    bd.ket,
    bd.mf,
    bd.ptat,
    bd.udc,
    bd.flc,
    bd.sce,
    bd.dce,
    bd.ssb,
    bd.dsb,
    bd.h_liv,
    bd.ccr,
    bd.hcr,
    bd.fi,
    bd.bwc,
    bd.sta,
    bd.str,
    bd.dfm,
    bd.rua,
    bd.rls,
    bd.rtp,
    bd.ftl,
    bd.rw,
    bd.rlr,
    bd.fta,
    bd.fls,
    bd.fua,
    bd.ruh,
    bd.ruw,
    bd.ucl,
    bd.udp,
    bd.ftp,
    bd.rfi,
    bd.beta_casein,
    bd.kappa_casein,
    bd.gfi
  FROM public.bulls_denorm bd
  WHERE
    -- Match by normalized NAAB code (prefix match)
    (expanded IS NOT NULL AND public.normalize_naab(bd.code) ILIKE expanded || '%')
    -- Match by name (contains)
    OR bd.name ILIKE '%' || trimmed || '%'
    -- Match by registration
    OR bd.registration ILIKE '%' || trimmed || '%'
  ORDER BY
    CASE
      -- Exact NAAB match first
      WHEN expanded IS NOT NULL AND public.normalize_naab(bd.code) = expanded THEN 1
      -- NAAB prefix match second
      WHEN expanded IS NOT NULL AND public.normalize_naab(bd.code) ILIKE expanded || '%' THEN 2
      -- Name match third
      ELSE 3
    END,
    bd.tpi DESC NULLS LAST
  LIMIT limit_count;
END;
$$;

-- ============================================================
-- get_bull_by_naab: busca exata por NAAB (normalizado)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_bull_by_naab(naab text)
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
    hhp_dollar numeric,
    tpi numeric,
    nm_dollar numeric,
    cm_dollar numeric,
    fm_dollar numeric,
    gm_dollar numeric,
    f_sav numeric,
    ptam numeric,
    cfp numeric,
    ptaf numeric,
    ptaf_pct numeric,
    ptap numeric,
    ptap_pct numeric,
    pl numeric,
    dpr numeric,
    liv numeric,
    scs numeric,
    mast numeric,
    met numeric,
    rp numeric,
    da numeric,
    ket numeric,
    mf numeric,
    ptat numeric,
    udc numeric,
    flc numeric,
    sce numeric,
    dce numeric,
    ssb numeric,
    dsb numeric,
    h_liv numeric,
    ccr numeric,
    hcr numeric,
    fi numeric,
    bwc numeric,
    sta numeric,
    str numeric,
    dfm numeric,
    rua numeric,
    rls numeric,
    rtp numeric,
    ftl numeric,
    rw numeric,
    rlr numeric,
    fta numeric,
    fls numeric,
    fua numeric,
    ruh numeric,
    ruw numeric,
    ucl numeric,
    udp numeric,
    ftp numeric,
    rfi numeric,
    beta_casein text,
    kappa_casein text,
    gfi numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  normalized_input text;
BEGIN
  normalized_input := public.expand_naab_query(naab);

  IF normalized_input IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, NULL::text,
      NULL::date, NULL::text, NULL::text, NULL::text, NULL::text,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric,
      NULL::text, NULL::text, NULL::numeric;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    true,
    bd.id,
    bd.code,
    bd.name,
    bd.registration,
    bd.birth_date,
    bd.company,
    bd.sire_naab,
    bd.mgs_naab,
    bd.mmgs_naab,
    bd.hhp_dollar,
    bd.tpi,
    bd.nm_dollar,
    bd.cm_dollar,
    bd.fm_dollar,
    bd.gm_dollar,
    bd.f_sav,
    bd.ptam,
    bd.cfp,
    bd.ptaf,
    bd.ptaf_pct,
    bd.ptap,
    bd.ptap_pct,
    bd.pl,
    bd.dpr,
    bd.liv,
    bd.scs,
    bd.mast,
    bd.met,
    bd.rp,
    bd.da,
    bd.ket,
    bd.mf,
    bd.ptat,
    bd.udc,
    bd.flc,
    bd.sce,
    bd.dce,
    bd.ssb,
    bd.dsb,
    bd.h_liv,
    bd.ccr,
    bd.hcr,
    bd.fi,
    bd.bwc,
    bd.sta,
    bd.str,
    bd.dfm,
    bd.rua,
    bd.rls,
    bd.rtp,
    bd.ftl,
    bd.rw,
    bd.rlr,
    bd.fta,
    bd.fls,
    bd.fua,
    bd.ruh,
    bd.ruw,
    bd.ucl,
    bd.udp,
    bd.ftp,
    bd.rfi,
    bd.beta_casein,
    bd.kappa_casein,
    bd.gfi
  FROM public.bulls_denorm bd
  WHERE public.normalize_naab(bd.code) = normalized_input
  LIMIT 1;
END;
$$;

-- ============================================================
-- nx3_bulls_lookup: fix column references (naab_code, not code)
-- Also drop old 2-arg version to avoid overload conflicts
-- ============================================================
DROP FUNCTION IF EXISTS public.nx3_bulls_lookup(text, text);
DROP FUNCTION IF EXISTS public.nx3_bulls_lookup(text, text, integer);

CREATE OR REPLACE FUNCTION public.nx3_bulls_lookup(
  p_query text,
  p_trait text,
  p_limit integer DEFAULT 12
)
RETURNS TABLE(
  id uuid,
  code text,
  name text,
  trait_value numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  expanded text;
BEGIN
  -- Validate trait is a valid numeric column on bulls table
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bulls'
      AND column_name = p_trait
      AND data_type IN ('numeric', 'integer', 'double precision', 'real')
  ) THEN
    -- Try mapping view alias to real column name
    IF p_trait = 'ptam' THEN p_trait := 'pta_milk';
    ELSIF p_trait = 'ptaf' THEN p_trait := 'pta_fat';
    ELSIF p_trait = 'ptaf_pct' THEN p_trait := 'pta_fat_pct';
    ELSIF p_trait = 'ptap' THEN p_trait := 'pta_protein';
    ELSIF p_trait = 'ptap_pct' THEN p_trait := 'pta_protein_pct';
    ELSIF p_trait = 'pl' THEN p_trait := 'pta_pl';
    ELSIF p_trait = 'dpr' THEN p_trait := 'pta_dpr';
    ELSIF p_trait = 'liv' THEN p_trait := 'pta_livability';
    ELSIF p_trait = 'scs' THEN p_trait := 'pta_scs';
    ELSIF p_trait = 'ptat' THEN p_trait := 'pta_ptat';
    ELSIF p_trait = 'udc' THEN p_trait := 'pta_udc';
    ELSIF p_trait = 'flc' THEN p_trait := 'pta_flc';
    ELSIF p_trait = 'sce' THEN p_trait := 'pta_sce';
    ELSIF p_trait = 'dce' THEN p_trait := 'pta_sire_sce';
    ELSIF p_trait = 'ccr' THEN p_trait := 'pta_ccr';
    ELSIF p_trait = 'hcr' THEN p_trait := 'pta_hcr';
    ELSIF p_trait = 'mf' THEN p_trait := 'mf_num';
    ELSIF p_trait = 'str' THEN p_trait := 'str_num';
    ELSE
      RAISE EXCEPTION 'Invalid trait: %', p_trait;
    END IF;
  END IF;

  expanded := public.expand_naab_query(p_query);

  RETURN QUERY EXECUTE format(
    'SELECT
      b.id,
      b.naab_code AS code,
      b.name,
      b.%I::numeric AS trait_value
    FROM public.bulls b
    WHERE (
      public.normalize_naab(b.naab_code) ILIKE $1 || ''%%''
      OR b.name ILIKE ''%%'' || $2 || ''%%''
      OR b.code_normalized ILIKE $1 || ''%%''
    )
    AND b.%I IS NOT NULL
    ORDER BY b.%I DESC NULLS LAST
    LIMIT $3',
    p_trait, p_trait, p_trait
  ) USING expanded, TRIM(p_query), p_limit;
END;
$$;
