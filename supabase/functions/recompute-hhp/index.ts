// Edge function: recalcula HHP$ em lotes para females e bulls.
// Invocação: POST { table?: 'females'|'bulls'|'both', batch?: number, max_seconds?: number }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const table: "females" | "bulls" | "both" = body.table ?? "both";
    const batch: number = Math.max(100, Math.min(20000, Number(body.batch) || 5000));
    const maxSeconds: number = Math.max(10, Math.min(540, Number(body.max_seconds) || 300));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const targets = table === "both" ? ["females", "bulls"] : [table];
    const start = Date.now();
    const result: Record<string, { updated: number; iterations: number; done: boolean }> = {};

    for (const t of targets) {
      let updated = 0;
      let iterations = 0;
      let done = false;
      while (true) {
        if ((Date.now() - start) / 1000 > maxSeconds) break;
        const { data, error } = await supabase.rpc("recompute_hhp_batch", {
          p_table: t,
          p_batch: batch,
        });
        if (error) {
          return new Response(JSON.stringify({ error: error.message, table: t, partial: result }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const n = Number(data) || 0;
        updated += n;
        iterations += 1;
        if (n === 0) { done = true; break; }
      }
      result[t] = { updated, iterations, done };
    }

    return new Response(
      JSON.stringify({ ok: true, elapsed_seconds: Math.round((Date.now() - start) / 1000), result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
