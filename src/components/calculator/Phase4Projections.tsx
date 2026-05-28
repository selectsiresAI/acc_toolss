import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeneticCalculator } from "@/hooks/useGeneticCalculator";
import { useTranslation } from "@/hooks/useTranslation";

export function Phase4Projections() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const { outputs } = useGeneticCalculator();
  const { inseminations, pregnancies } = outputs;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <span className="bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            4
          </span>
          {isEs ? "Fase 4 - Proyecciones de inseminación" : isEn ? "Phase 4 - Insemination Projections" : "Fase 4 - Projeções de inseminação"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Tabela de Inseminações */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {isEs ? "Proyección de inseminaciones necesarias según la estrategia seleccionada" : isEn ? "Projected inseminations needed based on the selected strategy" : "Projeção de inseminações necessárias baseadas no uso da estratégia selecionada"}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Inseminaciones proyectadas" : isEn ? "Projected inseminations" : "Inseminações projetadas"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Trimestral" : isEn ? "Quarterly" : "Trimestre"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Mensual" : isEn ? "Monthly" : "Mensal"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Inseminaciones actuales" : isEn ? "Current inseminations" : "Inseminações atualizadas"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Diferencia" : isEn ? "Difference" : "Diferença"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">{isEs ? "Vacas" : isEn ? "Cows" : "Vacas"}</td>
                  <td className="border border-gray-300 p-2">{inseminations.cows.trimester}</td>
                  <td className="border border-gray-300 p-2">{inseminations.cows.monthly}</td>
                  <td className="border border-gray-300 p-2">{inseminations.cows.current}</td>
                  <td className={`border border-gray-300 p-2 ${inseminations.cows.difference < 0 ? 'text-red-500' : ''}`}>
                    {inseminations.cows.difference}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">{isEs ? "Vaquillas" : isEn ? "Heifers" : "Novilhas"}</td>
                  <td className="border border-gray-300 p-2">{inseminations.heifers.trimester}</td>
                  <td className="border border-gray-300 p-2">{inseminations.heifers.monthly}</td>
                  <td className="border border-gray-300 p-2">{inseminations.heifers.current}</td>
                  <td className={`border border-gray-300 p-2 ${inseminations.heifers.difference < 0 ? 'text-red-500' : ''}`}>
                    {inseminations.heifers.difference}
                  </td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 p-2 font-semibold">Total</td>
                  <td className="border border-gray-300 p-2 font-semibold">{inseminations.total.trimester}</td>
                  <td className="border border-gray-300 p-2 font-semibold">{inseminations.total.monthly}</td>
                  <td className="border border-gray-300 p-2 font-semibold">{inseminations.total.current}</td>
                  <td className={`border border-gray-300 p-2 font-semibold ${inseminations.total.difference < 0 ? 'text-red-500' : ''}`}>
                    {inseminations.total.difference}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela de Prenhez */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {isEs ? "Preñeces proyectadas producidas según la estrategia propuesta" : isEn ? "Projected pregnancies produced based on the proposed strategy" : "Prenhez projetadas produzidas baseadas no uso da estratégia proposta"}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Preñeces/año" : isEn ? "Pregnancies/year" : "Prenhez/ano"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Trimestral" : isEn ? "Quarterly" : "Trimestre"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Mensual" : isEn ? "Monthly" : "Mensal"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Preñeces actuales" : isEn ? "Current pregnancies" : "Prenhez atualizadas"}</th>
                  <th className="border border-gray-300 p-2 text-left">{isEs ? "Diferencia" : isEn ? "Difference" : "Diferença"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">{isEs ? "Vacas" : isEn ? "Cows" : "Vacas"}</td>
                  <td className="border border-gray-300 p-2">{pregnancies.cows.trimester}</td>
                  <td className="border border-gray-300 p-2">{pregnancies.cows.monthly}</td>
                  <td className="border border-gray-300 p-2">{pregnancies.cows.current}</td>
                  <td className={`border border-gray-300 p-2 ${pregnancies.cows.difference < 0 ? 'text-red-500' : ''}`}>
                    {pregnancies.cows.difference}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">{isEs ? "Vaquillas" : isEn ? "Heifers" : "Novilhas"}</td>
                  <td className="border border-gray-300 p-2">{pregnancies.heifers.trimester}</td>
                  <td className="border border-gray-300 p-2">{pregnancies.heifers.monthly}</td>
                  <td className="border border-gray-300 p-2">{pregnancies.heifers.current}</td>
                  <td className={`border border-gray-300 p-2 ${pregnancies.heifers.difference < 0 ? 'text-red-500' : ''}`}>
                    {pregnancies.heifers.difference}
                  </td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 p-2 font-semibold">Total</td>
                  <td className="border border-gray-300 p-2 font-semibold">{pregnancies.total.trimester}</td>
                  <td className="border border-gray-300 p-2 font-semibold">{pregnancies.total.monthly}</td>
                  <td className="border border-gray-300 p-2 font-semibold">{pregnancies.total.current}</td>
                  <td className={`border border-gray-300 p-2 font-semibold ${pregnancies.total.difference < 0 ? 'text-red-500' : ''}`}>
                    {pregnancies.total.difference}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
