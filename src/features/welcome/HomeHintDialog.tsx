"use client";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Bug, Star, Sparkles } from "lucide-react";
import { useAGFilters } from "@/features/auditoria/store";
import { useTranslation } from "@/hooks/useTranslation";
function useTenantId(): string | null {
  const filters = useAGFilters();
  const farmId = filters?.farmId;

  if (import.meta.env.MODE !== "production") {
    console.debug("HomeHint tenantId", farmId);
  }

  if (typeof farmId === "string" && farmId.length > 0) return farmId;
  if (typeof farmId === "number" && Number.isFinite(farmId)) return String(farmId);
  return null;
}

function storageKey(userId: string | null, tenantId: string | null) {
  return `toolss:homehint:dismissed:${userId ?? "anon"}:${tenantId ?? "na"}`;
}

type HomeHintDialogProps = {
  userId?: string | null;
};

export default function HomeHintDialog({ userId = null }: HomeHintDialogProps) {
  const { t } = useTranslation();
  const tenantId = useTenantId();

  const key = useMemo(() => storageKey(userId, tenantId), [userId, tenantId]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const dismissed = localStorage.getItem(key) === "true";
      if (!dismissed) setOpen(true);
    } catch (error) {
      // Unable to access localStorage
    }
  }, [key]);

  function closeDialog() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, "true");
      } catch (error) {
        // Unable to persist preference
      }
    }
    setOpen(false);
  }

  function handleStartTutorial() {
    closeDialog();
    // Tutorial será implementado futuramente
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) {
        closeDialog();
      } else {
        setOpen(true);
      }
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t("hint.welcome")}
          </DialogTitle>
          <DialogDescription>
            {t("hint.welcomeDesc")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{t("hint.helpCenter")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("hint.helpCenterDesc")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Bug className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{t("hint.bugReport")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("hint.bugReportDesc")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{t("hint.ratePlatform")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("hint.ratePlatformDesc")}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={closeDialog}
            className="flex-1"
          >
            {t("hint.gotIt")}
          </Button>
          <Button 
            onClick={handleStartTutorial}
            className="flex-1"
          >
            {t("hint.startTutorial")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Dica de reset manual (dev): localStorage.removeItem(storageKey("<userId>","<tenantId>"));
