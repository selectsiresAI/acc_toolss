import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useGeneticCalculator } from "@/hooks/useGeneticCalculator";
import { useTranslation } from "@/hooks/useTranslation";

interface Phase1GrowthProps {
  useReferenceNumbers: boolean;
  setUseReferenceNumbers: (value: boolean) => void;
}

export function Phase1Growth({ useReferenceNumbers, setUseReferenceNumbers }: Phase1GrowthProps) {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const { inputs, setGrowthInputs } = useGeneticCalculator();
  const { growth } = inputs;

  const updateField = <K extends keyof typeof growth>(key: K, value: number) => {
    setGrowthInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span className="bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              1
            </span>
            {isEs ? "Fase 1 - Variables de crecimiento" : isEn ? "Phase 1 - Growth Variables" : "Fase 1 - Variáveis de crescimento"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="use-reference"
              checked={useReferenceNumbers}
              onCheckedChange={(checked) => setUseReferenceNumbers(checked === true)}
            />
            <Label htmlFor="use-reference">{isEs ? "Usar números de referencia" : isEn ? "Use reference numbers" : "Usar números referência"}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coluna 1 - Inputs Gerais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{isEs ? "Datos Generales" : isEn ? "General Inputs" : "Inputs Gerais"}</h3>
              <div>
                <div className="flex items-center gap-2">
                  <Label>{isEs ? "Tasa de descarte (%)" : isEn ? "Culling rate (%)" : "Taxa de descarte (%)"}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEs ? "Referencia: 20-25%" : isEn ? "Reference: 20-25%" : "Referência: 20-25%"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  type="number"
                  value={useReferenceNumbers ? 22.5 : growth.cullingRate}
                  onChange={(e) => updateField("cullingRate", Number(e.target.value))}
                  className="mt-1"
                  disabled={useReferenceNumbers}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label>{isEs ? "Intervalo entre partos (meses)" : isEn ? "Calving interval (months)" : "Intervalo entre partos (meses)"}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEs ? "Referencia: 12-13 meses" : isEn ? "Reference: 12-13 months" : "Referência: 12-13 meses"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  type="number"
                  value={useReferenceNumbers ? 12.5 : growth.calvingIntervalMonths}
                  onChange={(e) => updateField("calvingIntervalMonths", Number(e.target.value))}
                  className="mt-1"
                  disabled={useReferenceNumbers}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label>{isEs ? "Edad al primer parto (meses)" : isEn ? "Age at first calving (months)" : "Idade ao primeiro parto (meses)"}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEs ? "Referencia: 22-24 meses" : isEn ? "Reference: 22-24 months" : "Referência: 22-24 meses"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  type="number"
                  value={useReferenceNumbers ? 23 : growth.firstCalvingAge}
                  onChange={(e) => updateField("firstCalvingAge", Number(e.target.value))}
                  className="mt-1"
                  disabled={useReferenceNumbers}
                />
              </div>
              <div>
                <Label>{isEs ? "Tamaño del rebaño deseado (nº vacas)" : isEn ? "Target herd size (# cows)" : "Tamanho do rebanho desejado (nº vacas)"}</Label>
                <Input
                  type="number"
                  value={growth.targetHerdSize}
                  onChange={(e) => updateField("targetHerdSize", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Coluna 2 - Inputs de Novilhas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{isEs ? "Datos de Vaquillas" : isEn ? "Heifer Inputs" : "Inputs de Novilhas"}</h3>
              <div>
                <Label>{isEs ? "Vaquillas nacidas muertas (%)" : isEn ? "Stillborn heifers (%)" : "Novilhas natimortas (%)"}</Label>
                <Input
                  type="number"
                  value={growth.stillbornHeifers}
                  onChange={(e) => updateField("stillbornHeifers", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas muertas/vendidas desde nac. hasta el parto (%)" : isEn ? "Heifers dead/sold from birth to calving (%)" : "Novilhas mortas/vendidas após nasc. até o parto (%)"}</Label>
                <Input
                  type="number"
                  value={growth.heiferDeathsPreWeaning}
                  onChange={(e) => updateField("heiferDeathsPreWeaning", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Inventario de vaquillas (nº)" : isEn ? "Heifer inventory (#)" : "Inventário de novilhas (nº)"}</Label>
                <Input
                  type="number"
                  value={growth.heiferInventory}
                  onChange={(e) => updateField("heiferInventory", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas preñadas (nº)" : isEn ? "Pregnant heifers (#)" : "Novilhas prenhas (nº)"}</Label>
                <Input
                  type="number"
                  value={growth.pregnantHeifersNow}
                  onChange={(e) => updateField("pregnantHeifersNow", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas de 0 a 12 meses (nº)" : isEn ? "Heifers 0 to 12 months (#)" : "Novilhas de 0 a 12 meses (nº)"}</Label>
                <Input
                  type="number"
                  value={growth.heifers0to12Months}
                  onChange={(e) => updateField("heifers0to12Months", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas inseminadas por mes actualmente" : isEn ? "Heifers inseminated per month currently" : "Novilhas inseminadas por mês atualmente"}</Label>
                <Input
                  type="number"
                  value={growth.heifersInseminatedPerMonth}
                  onChange={(e) => updateField("heifersInseminatedPerMonth", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas inseminadas (sin confirmar)" : isEn ? "Heifers inseminated (unconfirmed)" : "Novilhas inseminadas (não confirmadas)"}</Label>
                <Input
                  type="number"
                  value={growth.heifersInseminatedUnconfirmed}
                  onChange={(e) => updateField("heifersInseminatedUnconfirmed", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas preñadas por mes actualmente" : isEn ? "Pregnant heifers per month currently" : "Novilhas prenhas por mês atualmente"}</Label>
                <Input
                  type="number"
                  value={growth.pregnantHeifersPerMonth}
                  onChange={(e) => updateField("pregnantHeifersPerMonth", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vaquillas elegibles para reproducción en los próx. 12 meses" : isEn ? "Heifers eligible for breeding in next 12 months" : "Novilhas elegíveis para reprodução nos próx. 12 meses"}</Label>
                <Input
                  type="number"
                  value={growth.heifersEligibleNext12M}
                  onChange={(e) => updateField("heifersEligibleNext12M", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Coluna 3 - Inputs de Vacas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{isEs ? "Datos de Vacas" : isEn ? "Cow Inputs" : "Inputs de Vacas"}</h3>
              <div>
                <div className="flex items-center gap-2">
                  <Label>{isEs ? "Tasa de aborto en vacas (%)" : isEn ? "Cow abortion rate (%)" : "Aborto em vacas (%)"}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEs ? "Referencia: 10-20%" : isEn ? "Reference: 10-20%" : "Referência: 10-20%"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  type="number"
                  value={useReferenceNumbers ? 15 : growth.abortionsCows}
                  onChange={(e) => updateField("abortionsCows", Number(e.target.value))}
                  className="mt-1"
                  disabled={useReferenceNumbers}
                />
              </div>
              <div>
                <Label>{isEs ? "Total de vacas (secas y en lactancia)" : isEn ? "Total cows (dry and lactating)" : "Número total de vacas (secas e lactantes)"}</Label>
                <Input
                  type="number"
                  value={growth.totalCowsDryAndLactating}
                  onChange={(e) => updateField("totalCowsDryAndLactating", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vacas inseminadas por mes actualmente" : isEn ? "Cows inseminated per month currently" : "Vacas inseminadas por mês atualmente"}</Label>
                <Input
                  type="number"
                  value={growth.cowsInseminatedPerMonth}
                  onChange={(e) => updateField("cowsInseminatedPerMonth", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? "Vacas preñadas por mes actualmente" : isEn ? "Pregnant cows per month currently" : "Vacas prenhas por mês atualmente"}</Label>
                <Input
                  type="number"
                  value={growth.pregnantCowsPerMonth}
                  onChange={(e) => updateField("pregnantCowsPerMonth", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
