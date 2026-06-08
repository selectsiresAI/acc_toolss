
CREATE OR REPLACE FUNCTION public.recompute_hhp_batch(p_table text, p_batch int DEFAULT 5000)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected int;
BEGIN
  IF p_table = 'females' THEN
    WITH cte AS (
      SELECT id FROM public.females
      WHERE hhp_dollar IS DISTINCT FROM public.calculate_hhp_dollar(
        pta_fat, pta_protein, pta_pl, pta_livability, pta_scs,
        pta_dpr, pta_ccr, rfi, sta, dfm, ruw, udp, rtp, ftl, mast)
      LIMIT p_batch
    )
    UPDATE public.females f
       SET hhp_dollar = public.calculate_hhp_dollar(
         f.pta_fat, f.pta_protein, f.pta_pl, f.pta_livability, f.pta_scs,
         f.pta_dpr, f.pta_ccr, f.rfi, f.sta, f.dfm, f.ruw, f.udp, f.rtp, f.ftl, f.mast)
      FROM cte WHERE f.id = cte.id;
    GET DIAGNOSTICS affected = ROW_COUNT;
    RETURN affected;
  ELSIF p_table = 'bulls' THEN
    WITH cte AS (
      SELECT id FROM public.bulls
      WHERE hhp_dollar IS DISTINCT FROM public.calculate_hhp_dollar(
        pta_fat, pta_protein, pta_pl,
        COALESCE(pta_livability, h_liv), pta_scs, pta_dpr,
        COALESCE(pta_ccr, ccr_num), rfi, sta, dfm, ruw, udp, rtp, ftl, mast)
      LIMIT p_batch
    )
    UPDATE public.bulls b
       SET hhp_dollar = public.calculate_hhp_dollar(
         b.pta_fat, b.pta_protein, b.pta_pl,
         COALESCE(b.pta_livability, b.h_liv), b.pta_scs, b.pta_dpr,
         COALESCE(b.pta_ccr, b.ccr_num), b.rfi, b.sta, b.dfm, b.ruw, b.udp, b.rtp, b.ftl, b.mast)
      FROM cte WHERE b.id = cte.id;
    GET DIAGNOSTICS affected = ROW_COUNT;
    RETURN affected;
  ELSE
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.recompute_hhp_batch(text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recompute_hhp_batch(text, int) TO service_role;
