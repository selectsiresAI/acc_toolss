import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Import Alert from the correct location
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHerdStore, getInt } from '@/hooks/useHerdStore';
import { RefreshCw } from 'lucide-react';

interface EstruturalPopulacionalProps {
  className?: string;
}

export default function EstruturalPopulacional({ className }: EstruturalPopulacionalProps) {
  const { t } = useTranslation();
  const { selectedHerdId, dashboardCounts, refreshFromSupabase } = useHerdStore();
  const [activeTab, setActiveTab] = useState("auto");
  const [manualCounts, setManualCounts] = useState({
    novilhas: 0,
    primiparas: 0,
    secundiparas: 0,
    multiparas: 0
  });

  // Load data from store or fallback to Supabase when component mounts
  useEffect(() => {
    const hasAnyData = dashboardCounts && Object.values(dashboardCounts).some(v => Number(v) > 0);
    
    if (!hasAnyData && selectedHerdId) {
      refreshFromSupabase();
    }
  }, [selectedHerdId, dashboardCounts, refreshFromSupabase]);

  // Get values using defensive function
  const novilhas = getInt(dashboardCounts, "Novilhas");
  const primiparas = getInt(dashboardCounts, "Primíparas");
  const secundiparas = getInt(dashboardCounts, "Secundíparas");
  const multiparas = getInt(dashboardCounts, "Multíparas");
  const totalAptas = novilhas + primiparas + secundiparas + multiparas;

  // Update manual counts when switching from auto to manual
  useEffect(() => {
    if (activeTab === "manual" && dashboardCounts) {
      setManualCounts({
        novilhas: Math.round(novilhas),
        primiparas: Math.round(primiparas),
        secundiparas: Math.round(secundiparas),
        multiparas: Math.round(multiparas)
      });
    }
  }, [activeTab, novilhas, primiparas, secundiparas, multiparas, dashboardCounts]);

  const handleRecalculate = () => {
    refreshFromSupabase(selectedHerdId);
  };

  const updateManualCount = (field: keyof typeof manualCounts, value: string) => {
    const numValue = Number(value);
    if (!Number.isFinite(numValue) || numValue < 0) return;
    
    setManualCounts(prev => ({
      ...prev,
      [field]: Math.round(numValue)
    }));
  };

  const manualTotal = manualCounts.novilhas + manualCounts.primiparas + manualCounts.secundiparas + manualCounts.multiparas;

  // Show alert when no herd selected or all categories return 0
  const showEmptyAlert = !selectedHerdId || (activeTab === "auto" && totalAptas === 0);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>{t('pop.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">{t('pop.automatic')}</TabsTrigger>
              <TabsTrigger value="manual">{t('pop.manual')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="auto" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  onClick={handleRecalculate}
                  variant="outline"
                  size="sm"
                  disabled={!selectedHerdId}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('pop.recalculate')}
                </Button>
                
                {selectedHerdId && totalAptas > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    ✅ {t('pop.calculated')} {totalAptas} {t('pop.eligibleFemales')}
                  </span>
                )}
              </div>

              {showEmptyAlert && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    {!selectedHerdId
                      ? `❌ ${t('pop.noHerdSelected')}`
                      : `⚠️ ${t('pop.noFemalesFound')}`
                    }
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="input-novilhas">{t('pop.heifersParity')}</Label>
                  <Input
                    id="input-novilhas"
                    data-testid="input-novilhas"
                    type="number"
                    value={Math.round(novilhas)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="input-primiparas">{t('pop.primiparousParity')}</Label>
                  <Input
                    id="input-primiparas"
                    data-testid="input-primiparas"
                    type="number"
                    value={Math.round(primiparas)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="input-secundiparas">{t('pop.secondiparousParity')}</Label>
                  <Input
                    id="input-secundiparas"
                    data-testid="input-secundiparas"
                    type="number"
                    value={Math.round(secundiparas)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="input-multiparas">{t('pop.multiparousParity')}</Label>
                  <Input
                    id="input-multiparas"
                    data-testid="input-multiparas"
                    type="number"
                    value={Math.round(multiparas)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="input-total-aptas">{t('pop.totalEligible')}</Label>
                <Input
                  id="input-total-aptas"
                  data-testid="input-total-aptas"
                  type="number"
                  value={Math.round(totalAptas)}
                  disabled
                  className="bg-gray-50 font-bold"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="text-sm text-blue-600 mb-4">
                {t('pop.manualHint')}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-novilhas">{t('pop.heifersParity')}</Label>
                  <Input
                    id="manual-novilhas"
                    data-testid="input-novilhas"
                    type="number"
                    min="0"
                    value={manualCounts.novilhas}
                    onChange={(e) => updateManualCount('novilhas', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="manual-primiparas">{t('pop.primiparousParity')}</Label>
                  <Input
                    id="manual-primiparas"
                    data-testid="input-primiparas"
                    type="number"
                    min="0"
                    value={manualCounts.primiparas}
                    onChange={(e) => updateManualCount('primiparas', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="manual-secundiparas">{t('pop.secondiparousParity')}</Label>
                  <Input
                    id="manual-secundiparas"
                    data-testid="input-secundiparas"
                    type="number"
                    min="0"
                    value={manualCounts.secundiparas}
                    onChange={(e) => updateManualCount('secundiparas', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="manual-multiparas">{t('pop.multiparousParity')}</Label>
                  <Input
                    id="manual-multiparas"
                    data-testid="input-multiparas"
                    type="number"
                    min="0"
                    value={manualCounts.multiparas}
                    onChange={(e) => updateManualCount('multiparas', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="manual-total-aptas">{t('pop.totalEligible')}</Label>
                <Input
                  id="manual-total-aptas"
                  data-testid="input-total-aptas"
                  type="number"
                  value={manualTotal}
                  disabled
                  className="bg-gray-50 font-bold"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}