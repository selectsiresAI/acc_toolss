"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAGFilters } from "../store";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/hooks/useTranslation";

type ParentRole = "sire" | "mgs" | "mmgs";
type ParentStatusKey = "informed" | "notInformed";

type RawRow = {
  role: ParentRole;
  status: "Completo" | "Incompleto" | "Desconhecido";
  n: number;
  pct: number;
};

type ConsolidatedRow = {
  statusKey: ParentStatusKey;
  n: number;
  pct: number;
};

type GroupedRows = Record<ParentRole, ConsolidatedRow[]>;

export default function Step1Parentesco() {
  const { farmId } = useAGFilters();
  const { t, locale } = useTranslation();
  const [rawRows, setRawRows] = useState<RawRow[]>([]);

  const STATUS_INFO: Record<ParentStatusKey, { icon: React.ReactNode; color: string; labelKey: string; descKey: string; actionKey: string }> = {
    notInformed: {
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-destructive",
      labelKey: "ag.parentesco.notInformed",
      descKey: "ag.parentesco.notInformedDesc",
      actionKey: "ag.parentesco.notInformedAction",
    },
    informed: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-emerald-500",
      labelKey: "ag.parentesco.informed",
      descKey: "ag.parentesco.informedDesc",
      actionKey: "ag.parentesco.informedAction",
    },
  };

  useEffect(() => {
    let active = true;
    async function load() {
      if (!farmId) {
        setRawRows([]);
        return;
      }
      const { data, error } = await (supabase.rpc as any)("ag_parentage_overview", {
        p_farm: farmId,
      });
      if (!active) return;
      if (error) {
        console.error("Failed to load parentage overview", error);
        setRawRows([]);
        return;
      }
      setRawRows(Array.isArray(data) ? (data as RawRow[]) : []);
    }
    load();
    return () => {
      active = false;
    };
  }, [farmId]);

  const byRole = useMemo(() => {
    const consolidated: Record<ParentRole, { informed: number; notInformed: number }> = {
      sire: { informed: 0, notInformed: 0 },
      mgs: { informed: 0, notInformed: 0 },
      mmgs: { informed: 0, notInformed: 0 },
    };

    rawRows.forEach((row) => {
      if (row.status === "Desconhecido") {
        consolidated[row.role].notInformed += row.n;
      } else {
        consolidated[row.role].informed += row.n;
      }
    });

    const map: GroupedRows = { sire: [], mgs: [], mmgs: [] };

    (["sire", "mgs", "mmgs"] as ParentRole[]).forEach((role) => {
      const total = consolidated[role].informed + consolidated[role].notInformed;
      if (total > 0) {
        if (consolidated[role].notInformed > 0) {
          map[role].push({
            statusKey: "notInformed",
            n: consolidated[role].notInformed,
            pct: (consolidated[role].notInformed / total) * 100,
          });
        }
        if (consolidated[role].informed > 0) {
          map[role].push({
            statusKey: "informed",
            n: consolidated[role].informed,
            pct: (consolidated[role].informed / total) * 100,
          });
        }
      }
    });

    return map;
  }, [rawRows]);

  const Block = ({ title, items }: { title: string; items?: ConsolidatedRow[] }) => {
    const total = (items ?? []).reduce((sum, row) => sum + (row.n || 0), 0);

    const sortedItems = [...(items ?? [])].sort((a, b) => {
      const order: Record<ParentStatusKey, number> = { notInformed: 0, informed: 1 };
      return order[a.statusKey] - order[b.statusKey];
    });

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {t("ag.parentesco.totalAnimals").replace("{{count}}", String(total))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedItems.map((item) => {
            const info = STATUS_INFO[item.statusKey];
            const statusLabel = t(info.labelKey as any);
            return (
              <TooltipProvider key={item.statusKey}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-help transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={info.color}>{info.icon}</span>
                        <span className="text-sm font-medium">{statusLabel}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{item.pct.toFixed(2)}%</div>
                        <div className="text-xs text-muted-foreground">
                          {item.n.toLocaleString(locale)} {t("ag.parentesco.animals")}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs p-3">
                    <p className="font-medium mb-1">{statusLabel}</p>
                    <p className="text-xs text-muted-foreground mb-2">{t(info.descKey as any)}</p>
                    <p className="text-xs font-medium text-primary">💡 {t(info.actionKey as any)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          {sortedItems.length === 0 && (
            <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
              {t("ag.parentesco.noData")}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">{t("ag.parentesco.howToInterpret")}</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><span className="text-destructive font-medium">{t("ag.parentesco.notInformed")}:</span> {t("ag.parentesco.notInformedExplain")}</li>
              <li><span className="text-emerald-500 font-medium">{t("ag.parentesco.informed")}:</span> {t("ag.parentesco.informedExplain")}</li>
            </ul>
            <p className="mt-2 text-xs text-primary">{t("ag.parentesco.hoverHint")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Block title={t("ag.parentesco.sire")} items={byRole.sire} />
        <Block title={t("ag.parentesco.mgs")} items={byRole.mgs} />
        <Block title={t("ag.parentesco.mmgs")} items={byRole.mmgs} />
      </div>
    </div>
  );
}
