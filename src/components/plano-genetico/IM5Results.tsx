"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { IM5Config } from "./IM5Configurator";
import type { PlanBull } from "@/hooks/usePlanBulls";

function fmtMoney(v: number) {
  return `R$ ${v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export type IM5Row = {
  id: string;
  bull: string;
  im5: number;
  ret_per_preg: number;
  ret_per_dose_conv: number;
  ret_per_dose_sexed: number;
  missingPTA: boolean;
};

export function IM5Results({
  farmId,
  bulls,
  config,
  onComputed,
}: {
  farmId: string;
  bulls: PlanBull[];
  config: IM5Config | null;
  onComputed?: (rows: IM5Row[]) => void;
}) {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<IM5Row[]>([]);
  const [loading, setLoading] = useState(false);

  async function compute() {
    if (!config) return;
    setLoading(true);
    const out: IM5Row[] = [];

    for (const b of bulls) {
      const { data, error } = await supabase.rpc("ag_im5_bull_value" as any, {
        p_farm_id: farmId,
        p_bull_id: b.id,
        p_traits: config.traits,
      });

      if (error) {
        console.error("Erro ao calcular IM5$", error);
      }

      const im5 = Number(data) || 0;
      const retPerPreg = im5 * (config.femaleRate ?? 0.47);
      const retPerDoseConv =
        retPerPreg * (config.conceptionRate ?? 0.35) - (b.price_conv ?? 0);
      const retPerDoseSexed =
        retPerPreg * (config.conceptionRate ?? 0.35) - (b.price_sexed ?? 0);

      const missingPTA =
        (config.traits.includes("PTA_MILK_KG") && b.pta_milk == null) ||
        (config.traits.includes("PTA_FAT_KG") && b.pta_fat == null) ||
        (config.traits.includes("PTA_PROT_KG") && b.pta_prot == null) ||
        (config.traits.includes("PL_MO") && b.pl == null) ||
        (config.traits.includes("DPR_PP") && b.dpr == null);

      out.push({
        id: b.id,
        bull: b.name,
        im5,
        ret_per_preg: retPerPreg,
        ret_per_dose_conv: retPerDoseConv,
        ret_per_dose_sexed: retPerDoseSexed,
        missingPTA,
      });
    }

    setRows(out);
    onComputed?.(out);
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{isEs ? "IM5$ — Costo-beneficio por Toro" : isEn ? "IM5$ — Cost-Benefit per Bull" : "IM5$ — Custo-benefício por Touro"}</CardTitle>
        <button
          onClick={compute}
          className="text-sm underline"
          disabled={loading || !config}
        >
          {loading ? (isEs ? "Calculando..." : isEn ? "Calculating..." : "Calculando...") : (isEs ? "Calcular" : isEn ? "Calculate" : "Calcular")}
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t">
                <th className="p-2 text-left">{isEs ? "Toro" : isEn ? "Bull" : "Touro"}</th>
                <th className="p-2 text-right">{isEs ? "IM5$ / hija" : isEn ? "IM5$ / daughter" : "IM5$ / filha"}</th>
                <th className="p-2 text-right">{isEs ? "$ / preñez" : isEn ? "$ / pregnancy" : "R$ / prenhez"}</th>
                <th className="p-2 text-right">{isEs ? "$ / dosis (Conv.)" : isEn ? "$ / dose (Conv.)" : "R$ / dose (Conv.)"}</th>
                <th className="p-2 text-right">{isEs ? "$ / dosis (Sexado)" : isEn ? "$ / dose (Sexed)" : "R$ / dose (Sexado)"}</th>
                <th className="p-2 text-right">{isEs ? "Calidad PTA" : isEn ? "PTA Quality" : "Qualidade PTA"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{r.bull}</td>
                  <td className="p-2 text-right">{fmtMoney(r.im5)}</td>
                  <td className="p-2 text-right">{fmtMoney(r.ret_per_preg)}</td>
                  <td
                    className={`p-2 text-right ${
                      r.ret_per_dose_conv > 0
                        ? "text-green-700"
                        : r.ret_per_dose_conv < 0
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}
                  >
                    {fmtMoney(r.ret_per_dose_conv)}
                  </td>
                  <td
                    className={`p-2 text-right ${
                      r.ret_per_dose_sexed > 0
                        ? "text-green-700"
                        : r.ret_per_dose_sexed < 0
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}
                  >
                    {fmtMoney(r.ret_per_dose_sexed)}
                  </td>
                  <td className="p-2 text-right">
                    {r.missingPTA ? (
                      <span className="text-amber-700">{isEs ? "PTA incompleta" : isEn ? "Incomplete PTA" : "PTA incompleta"}</span>
                    ) : (
                      <span className="text-green-700">OK</span>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td
                    className="p-4 text-sm text-muted-foreground"
                    colSpan={6}
                  >
                    {isEs ? 'Haga clic en “Calcular”.' : isEn ? 'Click “Calculate”.' : 'Clique em “Calcular”.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {isEs
            ? "IM5$ = Σ(ΔPTA_i × $/unid_i). ΔPTA_i = PTA_toro − promedio de madres (finca). Los valores nulos se tratan como 0 para no bloquear el cálculo."
            : isEn
            ? "IM5$ = Σ(ΔPTA_i × $/unit_i). ΔPTA_i = PTA_bull − dam average (farm). Null values are treated as 0 to avoid blocking calculation."
            : "IM5$ = Σ(ΔPTA_i × R$/unid_i). ΔPTA_i = PTA_touro − média das mães (fazenda). Valores nulos são tratados como 0 para não travar o cálculo."}
        </div>
      </CardContent>
    </Card>
  );
}
