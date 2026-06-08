
-- Preserve existing hhp_dollar when one of the 15 traits is missing.

CREATE OR REPLACE FUNCTION public.trg_females_calc_hhp_dollar()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE v_calc numeric;
BEGIN
  IF NEW.hhp_dollar IS NULL THEN
    v_calc := public.calculate_hhp_dollar(
      NEW.pta_fat, NEW.pta_protein, NEW.pta_pl, NEW.pta_livability, NEW.pta_scs,
      NEW.pta_dpr, NEW.pta_ccr, NEW.rfi, NEW.sta, NEW.dfm,
      NEW.ruw, NEW.udp, NEW.rtp, NEW.ftl, NEW.mast
    );
    -- If computed is NULL (missing trait) but old row had a value, keep it.
    IF v_calc IS NULL AND TG_OP = 'UPDATE' AND OLD.hhp_dollar IS NOT NULL THEN
      NEW.hhp_dollar := OLD.hhp_dollar;
    ELSE
      NEW.hhp_dollar := v_calc;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trg_bulls_calc_hhp_dollar()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE v_calc numeric;
BEGIN
  IF NEW.hhp_dollar IS NULL THEN
    v_calc := public.calculate_hhp_dollar(
      NEW.pta_fat, NEW.pta_protein, NEW.pta_pl,
      COALESCE(NEW.pta_livability, NEW.h_liv), NEW.pta_scs, NEW.pta_dpr,
      COALESCE(NEW.pta_ccr, NEW.ccr_num), NEW.rfi, NEW.sta, NEW.dfm,
      NEW.ruw, NEW.udp, NEW.rtp, NEW.ftl, NEW.mast
    );
    IF v_calc IS NULL AND TG_OP = 'UPDATE' AND OLD.hhp_dollar IS NOT NULL THEN
      NEW.hhp_dollar := OLD.hhp_dollar;
    ELSE
      NEW.hhp_dollar := v_calc;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Backfill: only overwrite when we can compute a real value; never clobber existing HHP$ with NULL.
CREATE OR REPLACE FUNCTION public.recompute_hhp_batch(p_table text, p_batch integer DEFAULT 5000)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  affected int;
BEGIN
  IF p_table = 'females' THEN
    WITH cte AS (
      SELECT id, public.calculate_hhp_dollar(
        pta_fat, pta_protein, pta_pl, pta_livability, pta_scs,
        pta_dpr, pta_ccr, rfi, sta, dfm, ruw, udp, rtp, ftl, mast) AS new_hhp
      FROM public.females
      WHERE hhp_dollar IS DISTINCT FROM public.calculate_hhp_dollar(
        pta_fat, pta_protein, pta_pl, pta_livability, pta_scs,
        pta_dpr, pta_ccr, rfi, sta, dfm, ruw, udp, rtp, ftl, mast)
      LIMIT p_batch
    )
    UPDATE public.females f
       SET hhp_dollar = cte.new_hhp
      FROM cte
     WHERE f.id = cte.id
       AND cte.new_hhp IS NOT NULL;  -- preserve existing value when traits missing
    GET DIAGNOSTICS affected = ROW_COUNT;
    RETURN affected;
  ELSIF p_table = 'bulls' THEN
    WITH cte AS (
      SELECT id, public.calculate_hhp_dollar(
        pta_fat, pta_protein, pta_pl,
        COALESCE(pta_livability, h_liv), pta_scs, pta_dpr,
        COALESCE(pta_ccr, ccr_num), rfi, sta, dfm, ruw, udp, rtp, ftl, mast) AS new_hhp
      FROM public.bulls
      WHERE hhp_dollar IS DISTINCT FROM public.calculate_hhp_dollar(
        pta_fat, pta_protein, pta_pl,
        COALESCE(pta_livability, h_liv), pta_scs, pta_dpr,
        COALESCE(pta_ccr, ccr_num), rfi, sta, dfm, ruw, udp, rtp, ftl, mast)
      LIMIT p_batch
    )
    UPDATE public.bulls b
       SET hhp_dollar = cte.new_hhp
      FROM cte
     WHERE b.id = cte.id
       AND cte.new_hhp IS NOT NULL;
    GET DIAGNOSTICS affected = ROW_COUNT;
    RETURN affected;
  ELSE
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;
END;
$function$;
