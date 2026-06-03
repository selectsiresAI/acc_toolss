-- Consolidate duplicate bull rows (same code_normalized) and add unique index.

CREATE TEMP TABLE _bull_dup_pairs AS
WITH ranked AS (
  SELECT id, code_normalized,
         row_number() OVER (
           PARTITION BY code_normalized
           ORDER BY
             (CASE WHEN tpi IS NOT NULL THEN 1 ELSE 0 END) DESC,
             tpi DESC NULLS LAST,
             updated_at DESC NULLS LAST,
             id
         ) AS rn
  FROM public.bulls
  WHERE code_normalized IS NOT NULL
)
SELECT k.code_normalized, k.id AS keep_id, d.id AS drop_id
FROM ranked k
JOIN ranked d ON d.code_normalized = k.code_normalized AND d.rn = 2
WHERE k.rn = 1;

UPDATE public.bulls k SET
  registration     = COALESCE(k.registration,     d.registration),
  short_name       = COALESCE(k.short_name,       d.short_name),
  breed            = COALESCE(k.breed,            d.breed),
  birth_date       = COALESCE(k.birth_date,       d.birth_date),
  pta_milk         = COALESCE(k.pta_milk,         d.pta_milk),
  pta_fat          = COALESCE(k.pta_fat,          d.pta_fat),
  pta_fat_pct      = COALESCE(k.pta_fat_pct,      d.pta_fat_pct),
  pta_protein      = COALESCE(k.pta_protein,      d.pta_protein),
  pta_protein_pct  = COALESCE(k.pta_protein_pct,  d.pta_protein_pct),
  pta_pl           = COALESCE(k.pta_pl,           d.pta_pl),
  pta_scs          = COALESCE(k.pta_scs,          d.pta_scs),
  pta_dpr          = COALESCE(k.pta_dpr,          d.pta_dpr),
  pta_hcr          = COALESCE(k.pta_hcr,          d.pta_hcr),
  pta_ccr          = COALESCE(k.pta_ccr,          d.pta_ccr),
  pta_livability   = COALESCE(k.pta_livability,   d.pta_livability),
  pta_sce          = COALESCE(k.pta_sce,          d.pta_sce),
  pta_sire_sce     = COALESCE(k.pta_sire_sce,     d.pta_sire_sce),
  pta_type         = COALESCE(k.pta_type,         d.pta_type),
  pta_udder        = COALESCE(k.pta_udder,        d.pta_udder),
  pta_feet_legs    = COALESCE(k.pta_feet_legs,    d.pta_feet_legs),
  pta_ptat         = COALESCE(k.pta_ptat,         d.pta_ptat),
  pta_udc          = COALESCE(k.pta_udc,          d.pta_udc),
  pta_flc          = COALESCE(k.pta_flc,          d.pta_flc),
  pta_bdc          = COALESCE(k.pta_bdc,          d.pta_bdc),
  tpi              = COALESCE(k.tpi,              d.tpi),
  nmpf             = COALESCE(k.nmpf,             d.nmpf),
  cheese_merit     = COALESCE(k.cheese_merit,     d.cheese_merit),
  fluid_merit      = COALESCE(k.fluid_merit,      d.fluid_merit),
  grazing_merit    = COALESCE(k.grazing_merit,    d.grazing_merit),
  hhp_dollar       = COALESCE(k.hhp_dollar,       d.hhp_dollar),
  rel_milk         = COALESCE(k.rel_milk,         d.rel_milk),
  rel_fat          = COALESCE(k.rel_fat,          d.rel_fat),
  rel_protein      = COALESCE(k.rel_protein,      d.rel_protein),
  bvh              = COALESCE(k.bvh,              d.bvh),
  blad             = COALESCE(k.blad,             d.blad),
  dumps            = COALESCE(k.dumps,            d.dumps),
  mf               = COALESCE(k.mf,               d.mf),
  cvm              = COALESCE(k.cvm,              d.cvm),
  naab_code_alt    = COALESCE(k.naab_code_alt,    d.naab_code_alt),
  company          = COALESCE(k.company,          d.company),
  pedigree         = COALESCE(k.pedigree,         d.pedigree),
  sire_naab        = COALESCE(k.sire_naab,        d.sire_naab),
  mgs_naab         = COALESCE(k.mgs_naab,         d.mgs_naab),
  mmgs_naab        = COALESCE(k.mmgs_naab,        d.mmgs_naab),
  beta_casein      = COALESCE(k.beta_casein,      d.beta_casein),
  kappa_casein     = COALESCE(k.kappa_casein,     d.kappa_casein),
  nm_dollar        = COALESCE(k.nm_dollar,        d.nm_dollar),
  cm_dollar        = COALESCE(k.cm_dollar,        d.cm_dollar),
  fm_dollar        = COALESCE(k.fm_dollar,        d.fm_dollar),
  gm_dollar        = COALESCE(k.gm_dollar,        d.gm_dollar),
  f_sav            = COALESCE(k.f_sav,            d.f_sav),
  cfp              = COALESCE(k.cfp,              d.cfp),
  mast             = COALESCE(k.mast,             d.mast),
  met              = COALESCE(k.met,              d.met),
  rp               = COALESCE(k.rp,               d.rp),
  da               = COALESCE(k.da,               d.da),
  ket              = COALESCE(k.ket,              d.ket),
  mf_num           = COALESCE(k.mf_num,           d.mf_num),
  h_liv            = COALESCE(k.h_liv,            d.h_liv),
  ccr_num          = COALESCE(k.ccr_num,          d.ccr_num),
  hcr_num          = COALESCE(k.hcr_num,          d.hcr_num),
  fi               = COALESCE(k.fi,               d.fi),
  gl               = COALESCE(k.gl,               d.gl),
  bwc              = COALESCE(k.bwc,              d.bwc),
  sta              = COALESCE(k.sta,              d.sta),
  str_num          = COALESCE(k.str_num,          d.str_num),
  dfm              = COALESCE(k.dfm,              d.dfm),
  rua              = COALESCE(k.rua,              d.rua),
  rls              = COALESCE(k.rls,              d.rls),
  rtp              = COALESCE(k.rtp,              d.rtp),
  ftl              = COALESCE(k.ftl,              d.ftl),
  rw               = COALESCE(k.rw,               d.rw),
  rlr              = COALESCE(k.rlr,              d.rlr),
  fta              = COALESCE(k.fta,              d.fta),
  fls              = COALESCE(k.fls,              d.fls),
  fua              = COALESCE(k.fua,              d.fua),
  ruh              = COALESCE(k.ruh,              d.ruh),
  ruw              = COALESCE(k.ruw,              d.ruw),
  ucl              = COALESCE(k.ucl,              d.ucl),
  udp              = COALESCE(k.udp,              d.udp),
  ftp              = COALESCE(k.ftp,              d.ftp),
  rfi              = COALESCE(k.rfi,              d.rfi),
  gfi              = COALESCE(k.gfi,              d.gfi),
  ssb              = COALESCE(k.ssb,              d.ssb),
  dsb              = COALESCE(k.dsb,              d.dsb),
  ptas             = COALESCE(d.ptas, '{}'::jsonb) || COALESCE(k.ptas, '{}'::jsonb),
  breed_number     = COALESCE(k.breed_number,     d.breed_number),
  updated_at       = now()
FROM _bull_dup_pairs p
JOIN public.bulls d ON d.id = p.drop_id
WHERE k.id = p.keep_id;

UPDATE public.bull_naab_aliases a SET bull_id = p.keep_id
FROM _bull_dup_pairs p
WHERE a.bull_id = p.drop_id;

DELETE FROM public.bulls WHERE id IN (SELECT drop_id FROM _bull_dup_pairs);

DROP TABLE _bull_dup_pairs;

CREATE UNIQUE INDEX IF NOT EXISTS bulls_code_normalized_unique
  ON public.bulls(code_normalized) WHERE code_normalized IS NOT NULL;