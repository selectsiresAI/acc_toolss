import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useGeneticCalculator } from "@/hooks/useGeneticCalculator";
import { useTranslation } from "@/hooks/useTranslation";

interface Phase2ConceptionProps {
  useReferenceNumbers: boolean;
  setUseReferenceNumbers: (value: boolean) => void;
}

export function Phase2Conception({ useReferenceNumbers, setUseReferenceNumbers }: Phase2ConceptionProps) {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const { inputs, setConceptionInputs } = useGeneticCalculator();
  const { conception } = inputs;

  const updateCows = (key: keyof typeof conception.cows, value: number) => {
    setConceptionInputs((prev) => ({
      ...prev,
      cows: { ...prev.cows, [key]: value },
    }));
  };

  const updateHeifers = (key: keyof typeof conception.heifers, value: number) => {
    setConceptionInputs((prev) => ({
      ...prev,
      heifers: { ...prev.heifers, [key]: value },
    }));
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span className="bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              2
            </span>
            {isEs ? "Fase 2 - Datos de concepción" : isEn ? "Phase 2 - Conception Data" : "Fase 2 - Dados de concepção"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="use-reference-phase2"
              checked={useReferenceNumbers}
              onCheckedChange={(checked) => setUseReferenceNumbers(checked === true)}
            />
            <Label htmlFor="use-reference-phase2">{isEs ? "Usar números de referencia" : isEn ? "Use reference numbers" : "Usar números referência"}</Label>
          </div>

          <div className="space-y-6">
            {/* Taxa de concepção em vacas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{isEs ? "Tasa de concepción en vacas" : isEn ? "Cow conception rate" : "Taxa de concepção em vacas"}</h3>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>{isEs ? "Semen Sexado" : isEn ? "Sexed Semen" : "Sêmen Sexado"}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEs ? "Referencia: 25-35%" : isEn ? "Reference: 25-35%" : "Referência: 25-35%"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    value={useReferenceNumbers ? 30 : conception.cows.sexedSemen}
                    onChange={(e) => updateCows("sexedSemen", Number(e.target.value))}
                    className="mt-1"
                    disabled={useReferenceNumbers}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>{isEs ? "Convencional" : isEn ? "Conventional" : "Convencional"}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEs ? "Referencia: 35-45%" : isEn ? "Reference: 35-45%" : "Referência: 35-45%"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    value={useReferenceNumbers ? 40 : conception.cows.conventional}
                    onChange={(e) => updateCows("conventional", Number(e.target.value))}
                    className="mt-1"
                    disabled={useReferenceNumbers}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>{isEs ? "Carne" : isEn ? "Beef" : "Corte"}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEs ? "Referencia: 30-40%" : isEn ? "Reference: 30-40%" : "Referência: 30-40%"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    value={useReferenceNumbers ? 35 : conception.cows.beef}
                    onChange={(e) => updateCows("beef", Number(e.target.value))}
                    className="mt-1"
                    disabled={useReferenceNumbers}
                  />
                </div>
                <div>
                  <Label>{isEs ? "Embriones" : isEn ? "Embryos" : "Embriões"}</Label>
                  <Input
                    type="number"
                    value={conception.cows.embryos}
                    onChange={(e) => updateCows("embryos", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{isEs ? "Embrión sexado" : isEn ? "Sexed embryo" : "Embrião sexado"}</Label>
                  <Input
                    type="number"
                    value={conception.cows.sexedEmbryo}
                    onChange={(e) => updateCows("sexedEmbryo", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Taxa de concepção em novilhas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{isEs ? "Tasa de concepción en vaquillas" : isEn ? "Heifer conception rate" : "Taxa de concepção em novilhas"}</h3>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>{isEs ? "Semen Sexado" : isEn ? "Sexed Semen" : "Sêmen Sexado"}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEs ? "Referencia: 50-60%" : isEn ? "Reference: 50-60%" : "Referência: 50-60%"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    value={useReferenceNumbers ? 55 : conception.heifers.sexedSemen}
                    onChange={(e) => updateHeifers("sexedSemen", Number(e.target.value))}
                    className="mt-1"
                    disabled={useReferenceNumbers}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>{isEs ? "Convencional" : isEn ? "Conventional" : "Convencional"}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEs ? "Referencia: 65-75%" : isEn ? "Reference: 65-75%" : "Referência: 65-75%"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    value={useReferenceNumbers ? 70 : conception.heifers.conventional}
                    onChange={(e) => updateHeifers("conventional", Number(e.target.value))}
                    className="mt-1"
                    disabled={useReferenceNumbers}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>{isEs ? "Carne" : isEn ? "Beef" : "Corte"}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isEs ? "Referencia: 55-65%" : isEn ? "Reference: 55-65%" : "Referência: 55-65%"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    value={useReferenceNumbers ? 60 : conception.heifers.beef}
                    onChange={(e) => updateHeifers("beef", Number(e.target.value))}
                    className="mt-1"
                    disabled={useReferenceNumbers}
                  />
                </div>
                <div>
                  <Label>{isEs ? "Embriones" : isEn ? "Embryos" : "Embriões"}</Label>
                  <Input
                    type="number"
                    value={conception.heifers.embryos}
                    onChange={(e) => updateHeifers("embryos", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{isEs ? "Embrión sexado" : isEn ? "Sexed embryo" : "Embrião sexado"}</Label>
                  <Input
                    type="number"
                    value={conception.heifers.sexedEmbryo}
                    onChange={(e) => updateHeifers("sexedEmbryo", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
