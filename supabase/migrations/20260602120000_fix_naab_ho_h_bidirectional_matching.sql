-- Fix NAAB matching to handle bidirectional HO<->H conversion
-- Currently expand_naab_query converts H->HO but NOT HO->H
-- DB has old format (200H10624) but templates use new format (200HO10624)
-- Also fix regexp_replace backreference bug in PL/pgSQL (use regexp_match + concat instead)

-- Fix expand_naab_query: use regexp_match instead of broken regexp_replace
CREATE OR REPLACE FUNCTION public.expand_naab_query(q text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $fn$
DECLARE
  normalized text;
  parts text[];
BEGIN
  IF q IS NULL OR TRIM(q) = '' THEN
    RETURN NULL;
  END IF;

  -- Normalize: uppercase, remove spaces/hyphens, strip leading zeros
  normalized := UPPER(REPLACE(REPLACE(TRIM(q), ' ', ''), '-', ''));

  -- Strip leading zeros: 007HO -> 7HO, 011HO -> 11HO
  parts := regexp_match(normalized, '^0+([1-9][0-9]*[A-Z]+.*)$');
  IF parts IS NOT NULL THEN
    normalized := parts[1];
  ELSE
    parts := regexp_match(normalized, '^0+([A-Z]+.*)$');
    IF parts IS NOT NULL THEN
      normalized := parts[1];
    END IF;
  END IF;

  -- If has pattern digits-H-digits (without O), insert O: 7H18596 -> 7HO18596
  parts := regexp_match(normalized, '^([0-9]+)H([0-9]+)$');
  IF parts IS NOT NULL THEN
    normalized := parts[1] || 'HO' || parts[2];
  END IF;

  -- If ends with H alone (no digits after), append O: 7H -> 7HO
  IF normalized ~ '^[0-9]+H$' THEN
    normalized := normalized || 'O';
  END IF;

  RETURN normalized;
END;
$fn$;

-- Helper: generate both HO and H variants for a normalized NAAB
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

  -- H -> HO: 200H10624 -> 200HO10624 (only if not HO)
  IF parts IS NULL THEN
    parts := regexp_match(normalized, '^(\d+)H(\d+)$');
    IF parts IS NOT NULL THEN
      result := result || (parts[1] || 'HO' || parts[2]);
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

-- Extract breed+number suffix from a NAAB code (ignoring company prefix)
-- E.g. '200HO10624' -> ARRAY['HO10624','H10624'], '7H12988' -> ARRAY['H12988','HO12988']
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

-- Update get_bull_by_naab: exact match with variants + fallback by breed+number
DROP FUNCTION IF EXISTS public.get_bull_by_naab(text);

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
  suffixes text[];
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

  -- Try exact match with all variants (HO<->H, leading zeros)
  all_variants := public.naab_variants(normalized_input);

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
  WHERE public.normalize_naab(bd.code) = ANY(all_variants)
  LIMIT 1;

  IF FOUND THEN RETURN; END IF;

  -- Fallback: match by breed+number suffix (ignoring company prefix)
  suffixes := public.naab_breed_number_suffixes(normalized_input);
  IF array_length(suffixes, 1) IS NULL THEN RETURN; END IF;

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
  WHERE public.normalize_naab(bd.code) LIKE '%' || suffixes[1]
     OR (array_length(suffixes, 1) > 1 AND public.normalize_naab(bd.code) LIKE '%' || suffixes[2])
  ORDER BY bd.tpi DESC NULLS LAST
  LIMIT 1;
END;
$$;

-- Update search_bulls to use variants for exact NAAB matching
DROP FUNCTION IF EXISTS public.search_bulls(text, integer);

CREATE OR REPLACE FUNCTION public.search_bulls(q text, limit_count integer DEFAULT 20)
RETURNS TABLE(
    id uuid,
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
  all_variants text[];
BEGIN
  trimmed := TRIM(q);
  IF trimmed = '' THEN
    RETURN;
  END IF;

  expanded := public.expand_naab_query(trimmed);
  IF expanded IS NOT NULL THEN
    all_variants := public.naab_variants(expanded);
  ELSE
    all_variants := ARRAY[]::text[];
  END IF;

  RETURN QUERY
  SELECT
    bd.id, bd.code, bd.name, bd.registration, bd.birth_date, bd.company,
    bd.sire_naab, bd.mgs_naab, bd.mmgs_naab,
    bd.hhp_dollar, bd.tpi, bd.nm_dollar, bd.cm_dollar, bd.fm_dollar, bd.gm_dollar,
    bd.f_sav, bd.ptam, bd.cfp, bd.ptaf, bd.ptaf_pct, bd.ptap, bd.ptap_pct,
    bd.pl, bd.dpr, bd.liv, bd.scs, bd.mast, bd.met, bd.rp, bd.da, bd.ket, bd.mf,
    bd.ptat, bd.udc, bd.flc, bd.sce, bd.dce, bd.ssb, bd.dsb, bd.h_liv,
    bd.ccr, bd.hcr, bd.fi, bd.bwc, bd.sta, bd.str, bd.dfm, bd.rua, bd.rls,
    bd.rtp, bd.ftl, bd.rw, bd.rlr, bd.fta, bd.fls, bd.fua, bd.ruh, bd.ruw,
    bd.ucl, bd.udp, bd.ftp, bd.rfi, bd.beta_casein, bd.kappa_casein, bd.gfi
  FROM public.bulls_denorm bd
  WHERE
    bd.name ILIKE '%' || trimmed || '%'
    OR (array_length(all_variants, 1) > 0 AND public.normalize_naab(bd.code) = ANY(all_variants))
    OR (expanded IS NOT NULL AND public.normalize_naab(bd.code) ILIKE expanded || '%')
  ORDER BY
    CASE
      WHEN array_length(all_variants, 1) > 0 AND public.normalize_naab(bd.code) = ANY(all_variants) THEN 1
      WHEN bd.name ILIKE trimmed || '%' THEN 2
      WHEN expanded IS NOT NULL AND public.normalize_naab(bd.code) ILIKE expanded || '%' THEN 3
      ELSE 4
    END,
    bd.tpi DESC NULLS LAST
  LIMIT limit_count;
END;
$$;
