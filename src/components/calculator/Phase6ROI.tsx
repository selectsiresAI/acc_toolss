import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeneticCalculator } from "@/hooks/useGeneticCalculator";
import { useTranslation } from "@/hooks/useTranslation";

const formatCurrency = (value: number, locale: string = 'pt-BR') => {
  // M4: Sempre BRL — custos e receitas são em Reais
  const displayLocale = locale === 'es' ? 'es-MX' : locale === 'en-US' ? 'pt-BR' : locale;
  return new Intl.NumberFormat(displayLocale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function Phase6ROI() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const { outputs } = useGeneticCalculator();
  const { dosesNeeded, roi } = outputs;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <span className="bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            6
          </span>
          {isEs ? "Fase 6 - Retorno sobre inversión" : isEn ? "Phase 6 - Return on Investment" : "Fase 6 - Retorno sobre investimento"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Doses e embriões necessários */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{isEs ? "Dosis y embriones necesarios" : isEn ? "Doses and embryos needed" : "Doses e embriões necessários"}</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 p-2 text-left"></th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Vacas" : isEn ? "Cows" : "Vacas"}</th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Vaquillas" : isEn ? "Heifers" : "Novilhas"}</th>
                  <th className="border border-gray-300 p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Sexado" : isEn ? "Sexed" : "Sexado"}</td>
                  <td className="border border-gray-300 p-2 text-center">{Math.round(dosesNeeded.sexed.annual * 0.23)}</td>
                  <td className="border border-gray-300 p-2 text-center">{Math.round(dosesNeeded.sexed.annual * 0.77)}</td>
                  <td className="border border-gray-300 p-2 text-center">{dosesNeeded.sexed.annual}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Convencional" : isEn ? "Conventional" : "Convencional"}</td>
                  <td className="border border-gray-300 p-2 text-center">{Math.round(dosesNeeded.conventional.annual * 0.9)}</td>
                  <td className="border border-gray-300 p-2 text-center">{Math.round(dosesNeeded.conventional.annual * 0.1)}</td>
                  <td className="border border-gray-300 p-2 text-center">{dosesNeeded.conventional.annual}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Conv NxGen" : isEn ? "Conv NxGen" : "Conv NxGen"}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Sexado NxGen" : isEn ? "Sexed NxGen" : "Sexado NxGen"}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Embriones" : isEn ? "Embryos" : "Embriões"}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Embriones sexados" : isEn ? "Sexed embryos" : "Embriões sexado"}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Carne" : isEn ? "Beef" : "Corte"}</td>
                  <td className="border border-gray-300 p-2 text-center">{dosesNeeded.beef.annual}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">{dosesNeeded.beef.annual}</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 p-2 font-semibold">Total</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">
                    {Math.round(dosesNeeded.sexed.annual * 0.23) + Math.round(dosesNeeded.conventional.annual * 0.9) + dosesNeeded.beef.annual}
                  </td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">
                    {Math.round(dosesNeeded.sexed.annual * 0.77) + Math.round(dosesNeeded.conventional.annual * 0.1)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">
                    {dosesNeeded.sexed.annual + dosesNeeded.conventional.annual + dosesNeeded.beef.annual}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Investimento genética */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{isEs ? "Inversión en genética" : isEn ? "Genetics investment" : "Investimento genética"}</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 p-2 text-left"></th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Costo/dosis" : isEn ? "Cost/dose" : "Custo/dose"}</th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Semen" : isEn ? "Semen" : "Sêmen"}</th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Costo Genética" : isEn ? "Genetics Cost" : "Custo Genética"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Sexado" : isEn ? "Sexed" : "Sexado"}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(200, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(roi.sexedGeneticCost, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Convencional" : isEn ? "Conventional" : "Convencional"}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(50, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(roi.conventionalGeneticCost, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Conv NxGen</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(0, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(0, locale)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Sexado NxGen" : isEn ? "Sexed NxGen" : "Sexado NxGen"}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(0, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(0, locale)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Embriones" : isEn ? "Embryos" : "Embriões"}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(0, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Embriones sexados" : isEn ? "Sexed embryos" : "Embriões sexado"}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(0, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Carne" : isEn ? "Beef" : "Corte"}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(20, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(roi.beefGeneticCost, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 p-2 font-semibold">Total</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">-</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">{formatCurrency(roi.totalGeneticCost, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Animais vendidos */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{isEs ? "Animales vendidos" : isEn ? "Animals sold" : "Animais vendidos"}</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 p-2 text-left"></th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Número" : isEn ? "Number" : "Número"}</th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Valor/animal" : isEn ? "Value/animal" : "Valor/animal"}</th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Valor total" : isEn ? "Total value" : "Valor total"}</th>
                  <th className="border border-gray-300 p-2 text-center">{isEs ? "Retorno" : isEn ? "Return" : "Retorno"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Machos lecheros" : isEn ? "Dairy males" : "Machos de leite"}</td>
                  <td className="border border-gray-300 p-2 text-center">{roi.dairyMaleCalves}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(100, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(roi.dairyMaleCalves * 100, locale)}</td>

                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Machos de carne" : isEn ? "Beef males" : "Machos de corte"}</td>
                  <td className="border border-gray-300 p-2 text-center">{roi.beefCalves}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(400, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(roi.beefCalves * 400, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Hembras de carne" : isEn ? "Beef females" : "Fêmeas de corte"}</td>
                  <td className="border border-gray-300 p-2 text-center">{roi.beefHeifers}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(500, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">{formatCurrency(roi.beefHeifers * 500, locale)}</td>
                  <td className="border border-gray-300 p-2 text-center">-</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 p-2 font-semibold">{isEs ? "Total ventas" : isEn ? "Total sales" : "Total vendas"}</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">-</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">-</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">
                    {formatCurrency(roi.totalRevenue, locale)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Retorno sobre investimento */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{isEs ? "Retorno sobre inversión" : isEn ? "Return on investment" : "Retorno sobre investimento"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">{isEs ? "Inversión total:" : isEn ? "Total investment:" : "Investimento total:"}</span>
              <span className="font-bold ml-2">{formatCurrency(roi.totalGeneticCost, locale)}</span>
            </div>
            <div>
              <span className="text-gray-600">{isEs ? "Ingresos por ventas:" : isEn ? "Sales revenue:" : "Receita vendas:"}</span>
              <span className="font-bold ml-2">
                {formatCurrency(roi.totalRevenue, locale)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">{isEs ? "Margen:" : isEn ? "Margin:" : "Margem:"}</span>
              <span className={`font-bold ml-2 ${roi.margin < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(roi.margin, locale)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">{isEs ? "Margen por vaquilla:" : isEn ? "Margin per heifer:" : "Margem por novilha:"}</span>
              <span className={`font-bold ml-2 ${roi.marginPerHeifer < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(roi.marginPerHeifer, locale)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
