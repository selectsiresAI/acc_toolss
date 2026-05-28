import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dna, Calendar, ArrowRight, TrendingUp, FileSpreadsheet, Users } from 'lucide-react';

interface NexusEntryPageProps {
  onSelectMethod: (method: 'nexus1' | 'nexus2' | 'nexus3') => void;
}
const NexusEntryPage: React.FC<NexusEntryPageProps> = ({
  onSelectMethod
}) => {
  const { t } = useTranslation();
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left space-y-2 md:space-y-1">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3 md:justify-start">
              <TrendingUp className="w-8 h-8 text-primary" />
              {t("nexus.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0 md:max-w-xl">
              {t("nexus.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Nexus 1 - Predição Genômica */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Dna className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-xl">{t("nexus.n1.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("nexus.n1.desc")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t("nexus.n1.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("nexus.n1.f1")}</li>
                <li>• {t("nexus.n1.f2")}</li>

                <li>• {t("nexus.n1.f3")}</li>
                <li>• {t("nexus.n1.f4")}</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-rose-100">
              <p className="text-xs font-medium text-zinc-950 text-center">{t("nexus.n1.ideal")}</p>
            </div>
            <Button onClick={() => onSelectMethod('nexus1')} size="lg" className="w-full text-white bg-red-700 hover:bg-red-600">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {t("nexus.n1.use")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Nexus 2 - Predição por Pedigree */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50">

            </div>
            <CardTitle className="text-xl">{t("nexus.n2.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("nexus.n2.desc")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t("nexus.n1.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("nexus.n2.f1")}</li>
                <li>• {t("nexus.n2.f2")}</li>

                <li>• {t("nexus.n2.f3")}</li>
                <li>• {t("nexus.n2.f4")}</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <p className="text-xs font-medium text-slate-950 text-center">{t("nexus.n2.ideal")}</p>
            </div>
            <Button onClick={() => onSelectMethod('nexus2')} size="lg" variant="secondary" className="w-full text-neutral-50 bg-red-700 hover:bg-red-600">
              <Calendar className="w-4 h-4 mr-2" />
              {t("nexus.n2.use")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Nexus 3 - Acasalamento em Grupos */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-xl">{t("nexus.n3.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("nexus.n3.desc")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t("nexus.n1.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("nexus.n3.f1")}</li>
                <li>• {t("nexus.n3.f2")}</li>
                <li>• {t("nexus.n3.f3")}</li>
                <li>• {t("nexus.n3.f4")}</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-rose-100">
              <p className="text-xs font-medium text-zinc-950 text-center">{t("nexus.n3.ideal")}</p>
            </div>
            <Button onClick={() => onSelectMethod('nexus3')} size="lg" variant="secondary" className="w-full text-neutral-50 bg-red-700 hover:bg-red-600">
              <Users className="w-4 h-4 mr-2" />
              {t("nexus.n3.use")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="font-semibold mb-2">{t("nexus.whichMethod")}</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              {t("nexus.n1Recommend")}
            </p>
            <p>
              {t("nexus.n2Recommend")}
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default NexusEntryPage;
