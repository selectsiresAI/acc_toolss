"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { HelpButton } from "@/components/help/HelpButton";
import { HelpHint } from "@/components/help/HelpHint";
import { useTranslation } from "@/hooks/useTranslation";

interface AGLayoutProps {
  children: ReactNode;
  onBack?: () => void;
  farmName?: string;
  activeStep?: number;
}
export default function AGLayout({
  children,
  onBack,
  farmName,
  activeStep = 0
}: AGLayoutProps) {
  const { t } = useTranslation();
  const helpContext = activeStep >= 0 && activeStep <= 6
    ? `auditoria-step${activeStep + 1}`
    : "auditoria";

  return <div className="min-h-screen bg-background">
      <HelpButton context={helpContext} />

      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-3">
          {onBack && <Button variant="ghost" onClick={onBack} className="mr-2 bg-slate-300 hover:bg-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("ag.back")}
            </Button>}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{t("ag.title")}{farmName ? ` — ${farmName}` : ""}</h1>
            <HelpHint content={t("ag.helpHint")} />
          </div>
          <p className="text-sm text-muted-foreground">{t("ag.stepsSequential")}</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <Card className="p-4" data-tour="auditoria:resultados">{children}</Card>
      </div>
    </div>;
}