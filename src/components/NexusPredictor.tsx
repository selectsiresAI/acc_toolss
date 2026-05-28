import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PedigreePredictor from './PedigreePredictor';
import NexusAppOriginal from './NexusApp';
import { Calculator, Dna } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

const NexusPredictor: React.FC = () => {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Calculator className="w-6 h-6" />
          {isEs ? "Nexus - Sistema de Predicción Genética" : isEn ? "Nexus - Genetic Prediction System" : "Nexus - Sistema de Predição Genética"}
        </h2>
        <p className="text-muted-foreground">
          {isEs ? "Elija el método de predicción basado en los datos disponibles" : isEn ? "Choose the prediction method based on available data" : "Escolha o método de predição baseado nos dados disponíveis"}
        </p>
      </div>

      <Tabs defaultValue="pedigree" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="genomic" className="flex items-center gap-2">
            <Dna className="w-4 h-4" />
            {isEs ? "Nexus 1: Información Genómica" : isEn ? "Nexus 1: Genomic Information" : "Nexus 1: Informação Genômica"}
          </TabsTrigger>
          <TabsTrigger value="pedigree" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            {isEs ? "Nexus 2: Predicción por Pedigrí" : isEn ? "Nexus 2: Pedigree Prediction" : "Nexus 2: Predição por Pedigree"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="genomic" className="mt-6">
          <NexusAppOriginal />
        </TabsContent>
        
        <TabsContent value="pedigree" className="mt-6">
          <PedigreePredictor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NexusPredictor;
