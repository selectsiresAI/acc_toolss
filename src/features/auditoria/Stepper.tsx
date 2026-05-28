"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

const stepKeys = [
  "ag.step1", "ag.step2", "ag.step3", "ag.step4", "ag.step5", "ag.step6", "ag.step7"
] as const;

export function AGStepper({
  active,
  onChange
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  const { t } = useTranslation();
  return <div className="flex flex-wrap gap-2 mb-4 bg-slate-50">
      {stepKeys.map((key, i) => <Button key={i} variant={active === i ? "default" : "outline"} size="sm" onClick={() => onChange(i)} className={cn("rounded-full")}>
          {i + 1}. {t(key)}
        </Button>)}
    </div>;
}
