import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useGeneticCalculator } from "@/hooks/useGeneticCalculator";
import { useTranslation } from "@/hooks/useTranslation";

const SERVICE_LABELS = (isEn: boolean, isEs: boolean): Record<string, string> => ({
  sexed: isEs ? "Semen Sexado" : isEn ? "Sexed Semen" : "Sêmen Sexado",
  conventional: isEs ? "Semen Convencional" : isEn ? "Conventional Semen" : "Sêmen Convencional",
  beef: isEs ? "Semen de Carne" : isEn ? "Beef Semen" : "Sêmen de Corte",
  embryo: isEs ? "Embriones" : isEn ? "Embryos" : "Embriões",
  sexedEmbryo: isEs ? "Embriones Sexados" : isEn ? "Sexed Embryos" : "Embriões Sexados",
  none: "-",
});

export function Phase7Summary() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const { inputs, outputs } = useGeneticCalculator();
  const { strategy, growth } = inputs;
  const { dosesNeeded, roi } = outputs;

  const cowsKey = isEs ? 'vacas' : isEn ? 'cows' : 'vacas';
  const heifersKey = isEs ? 'vaquillas' : isEn ? 'heifers' : 'novilhas';

  const chartData = [
    {
      name: isEs ? 'Sexado' : isEn ? 'Sexed' : 'Sexado',
      [cowsKey]: Math.round(dosesNeeded.sexed.annual * 0.23),
      [heifersKey]: Math.round(dosesNeeded.sexed.annual * 0.77)
    },
    {
      name: isEs ? 'Convencional' : isEn ? 'Conventional' : 'Convencional',
      [cowsKey]: Math.round(dosesNeeded.conventional.annual * 0.9),
      [heifersKey]: Math.round(dosesNeeded.conventional.annual * 0.1)
    },
    { name: 'Conv NxGen', [cowsKey]: 0, [heifersKey]: 0 },
    { name: isEs ? 'Sexado NxGen' : isEn ? 'Sexed NxGen' : 'Sexado NxGen', [cowsKey]: 0, [heifersKey]: 0 },
    { name: isEs ? 'Carne' : isEn ? 'Beef' : 'Corte', [cowsKey]: dosesNeeded.beef.annual, [heifersKey]: 0 },
  ];

  const heifersPercent = roi.heifersNeeded > 0 
    ? Math.round((roi.heifersCreated / roi.heifersNeeded) * 100) 
    : 0;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <span className="bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            7
          </span>
          {isEs ? "Fase 7 - Resumen" : isEn ? "Phase 7 - Finalize" : "Fase 7 - Finalizar"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Resumo da estratégia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Novilhas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isEs ? "Vaquillas" : isEn ? "Heifers" : "Novilhas"}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="border border-gray-300 p-2">{isEs ? "Grupo" : isEn ? "Group" : "Grupo"}</th>
                    <th className="border border-gray-300 p-2">%</th>
                    <th className="border border-gray-300 p-2">{isEs ? "1° servicio" : isEn ? "1st service" : "1º serviço"}</th>
                    <th className="border border-gray-300 p-2">{isEs ? "2° servicio" : isEn ? "2nd service" : "2º serviço"}</th>
                    <th className="border border-gray-300 p-2">{isEs ? "3° servicio" : isEn ? "3rd service" : "3º serviço"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Top</td>
                    <td className="border border-gray-300 p-2 text-center">{strategy.heifersGroup.superior}%</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.firstService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.secondService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.thirdService]}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">{isEs ? "Medio" : isEn ? "Mid" : "Meio"}</td>
                    <td className="border border-gray-300 p-2 text-center">{strategy.heifersGroup.intermediate}%</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.firstService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.secondService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.thirdService]}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">{isEs ? "Inferior" : isEn ? "Inferior" : "Inferior"}</td>
                    <td className="border border-gray-300 p-2 text-center">{strategy.heifersGroup.inferior}%</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.firstService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.secondService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.heifersPlan.thirdService]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-sm text-gray-600">{isEs ? "Debe ser = 100%" : isEn ? "Must equal 100%" : "Deve ser = 100%"}</div>
          </div>

          {/* Grupo Vacas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isEs ? "Grupo Vacas" : isEn ? "Cow Group" : "Grupo Vacas"}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="border border-gray-300 p-2">{isEs ? "Grupo" : isEn ? "Group" : "Grupo"}</th>
                    <th className="border border-gray-300 p-2">%</th>
                    <th className="border border-gray-300 p-2">{isEs ? "1° servicio" : isEn ? "1st service" : "1º serviço"}</th>
                    <th className="border border-gray-300 p-2">{isEs ? "2° servicio" : isEn ? "2nd service" : "2º serviço"}</th>
                    <th className="border border-gray-300 p-2">{isEs ? "3° servicio" : isEn ? "3rd service" : "3º serviço"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Top</td>
                    <td className="border border-gray-300 p-2 text-center">{strategy.cowsGroup.superior}%</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.firstService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.secondService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.thirdService]}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">{isEs ? "Medio" : isEn ? "Mid" : "Meio"}</td>
                    <td className="border border-gray-300 p-2 text-center">{strategy.cowsGroup.intermediate}%</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.firstService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.secondService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.thirdService]}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Inferior</td>
                    <td className="border border-gray-300 p-2 text-center">{strategy.cowsGroup.inferior}%</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.firstService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.secondService]}</td>
                    <td className="border border-gray-300 p-2">{SERVICE_LABELS(isEn, isEs)[strategy.cowsPlan.thirdService]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-sm text-gray-600">{isEs ? "Debe ser = 100%" : isEn ? "Must equal 100%" : "Deve ser = 100%"}</div>
          </div>
        </div>

        {/* Bezerras vivas ao nascer */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{isEs ? "Terneras vivas al nacer" : isEn ? "Live heifer calves at birth" : "Bezerras vivas ao nascer"}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">{isEs ? "Vaquillas necesarias" : isEn ? "Heifers needed" : "Novilhas necessárias"}</div>
              <div className="text-2xl font-bold text-blue-500">{roi.heifersNeeded}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">{isEs ? "Vaquillas creadas" : isEn ? "Heifers created" : "Novilhas criadas"}</div>
              <div className="text-2xl font-bold text-green-500">{roi.totalHeifersBorn}</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-8 mb-4">
            <div 
              className="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" 
              style={{ width: `${Math.min((roi.heifersNeeded / roi.totalHeifersBorn) * 100, 100)}%` }}
            >
              {roi.heifersNeeded}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8">
            <div 
              className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" 
              style={{ width: '100%' }}
            >
              {roi.totalHeifersBorn}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
            <div>
              <div className="bg-green-500 text-white p-2 rounded">
                <div>{isEs ? "Vaquillas creadas" : isEn ? "Heifers created" : "Novilhas criadas"}</div>
                <div className="font-bold">{roi.heifersCreated}</div>
              </div>
            </div>
            <div>
              <div className="bg-blue-500 text-white p-2 rounded">
                <div>{isEs ? "Vaquillas necesarias" : isEn ? "Heifers needed" : "Novilhas necessárias"}</div>
                <div className="font-bold">{roi.heifersNeeded}</div>
              </div>
            </div>
            <div>
              <div className="bg-green-600 text-white p-2 rounded">
                <div>{isEs ? "% Creadas vs necesarias" : isEn ? "% Created vs needed" : "% Criadas e necessárias"}</div>
                <div className="font-bold">{heifersPercent}%</div>
              </div>
            </div>
            <div>
              <div className="bg-gray-500 text-white p-2 rounded">
                <div>{isEs ? "Tamaño del rebaño deseado" : isEn ? "Target herd size" : "Tamanho do rebanho desejado"}</div>
                <div className="font-bold">{growth.targetHerdSize}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey={cowsKey} fill="#3B82F6" />
              <Bar dataKey={heifersKey} fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
