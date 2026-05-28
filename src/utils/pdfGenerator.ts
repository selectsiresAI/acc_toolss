import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPtaValue } from '@/utils/ptaFormat';
import type { Locale } from '@/lib/i18n';

const pdfI18n = {
  'pt-BR': {
    segmentationReport: 'Relatório de Segmentação',
    farm: 'Fazenda',
    date: 'Data',
    appliedFilters: 'Filtros Aplicados:',
    categories: 'Categorias',
    classifications: 'Classificações',
    groupDistribution: 'Distribuição dos Grupos:',
    donor: 'Doadora',
    intermediate: 'Intermediária',
    recipient: 'Receptora',
    customSettings: 'Configurações Personalizadas:',
    selectedIndex: 'Índice Selecionado',
    ptaWeights: 'Pesos dos PTAs:',
    statistics: 'Estatísticas:',
    totalFemales: 'Total de Fêmeas',
    donors: 'Doadoras',
    intermediates: 'Intermediárias',
    recipients: 'Receptoras',
    botijaoReport: 'Relatório - Botijão Virtual',
    settings: 'Configurações:',
    bullsPerFemale: 'Número de touros por fêmea',
    strategy: 'Estratégia',
    automatic: 'Automática',
    femalesInBotijao: 'Fêmeas no Botijão:',
    total: 'Total',
    females: 'fêmeas',
    andMore: 'e mais',
    plannedMatings: 'Acasalamentos Planejados:',
    totalMatings: 'Total de acasalamentos',
    geneticProjectionPlan: 'Plano de Projeção Genética',
    geneticPlan: 'Plano Genético:',
    objective: 'Objetivo',
    timeframe: 'Prazo',
    priorityTraits: 'Características Prioritárias',
    selectedBulls: 'Touros Selecionados:',
    expectedResults: 'Resultados Esperados:',
    totalProjections: 'Total de projeções',
    projectedAvgTPI: 'TPI médio projetado',
    projectedAvgNM: 'NM$ médio projetado',
  },
  'en-US': {
    segmentationReport: 'Segmentation Report',
    farm: 'Farm',
    date: 'Date',
    appliedFilters: 'Applied Filters:',
    categories: 'Categories',
    classifications: 'Classifications',
    groupDistribution: 'Group Distribution:',
    donor: 'Donor',
    intermediate: 'Intermediate',
    recipient: 'Recipient',
    customSettings: 'Custom Settings:',
    selectedIndex: 'Selected Index',
    ptaWeights: 'PTA Weights:',
    statistics: 'Statistics:',
    totalFemales: 'Total Females',
    donors: 'Donors',
    intermediates: 'Intermediates',
    recipients: 'Recipients',
    botijaoReport: 'Report - Virtual Tank',
    settings: 'Settings:',
    bullsPerFemale: 'Bulls per female',
    strategy: 'Strategy',
    automatic: 'Automatic',
    femalesInBotijao: 'Females in Tank:',
    total: 'Total',
    females: 'females',
    andMore: 'and more',
    plannedMatings: 'Planned Matings:',
    totalMatings: 'Total matings',
    geneticProjectionPlan: 'Genetic Projection Plan',
    geneticPlan: 'Genetic Plan:',
    objective: 'Objective',
    timeframe: 'Timeframe',
    priorityTraits: 'Priority Traits',
    selectedBulls: 'Selected Bulls:',
    expectedResults: 'Expected Results:',
    totalProjections: 'Total projections',
    projectedAvgTPI: 'Projected avg TPI',
    projectedAvgNM: 'Projected avg NM$',
  },
  'es': {
    segmentationReport: 'Informe de Segmentación',
    farm: 'Finca',
    date: 'Fecha',
    appliedFilters: 'Filtros Aplicados:',
    categories: 'Categorías',
    classifications: 'Clasificaciones',
    groupDistribution: 'Distribución de Grupos:',
    donor: 'Donante',
    intermediate: 'Intermedia',
    recipient: 'Receptora',
    customSettings: 'Configuraciones Personalizadas:',
    selectedIndex: 'Índice Seleccionado',
    ptaWeights: 'Pesos de PTAs:',
    statistics: 'Estadísticas:',
    totalFemales: 'Total de Hembras',
    donors: 'Donantes',
    intermediates: 'Intermedias',
    recipients: 'Receptoras',
    botijaoReport: 'Informe - Tanque Virtual',
    settings: 'Configuraciones:',
    bullsPerFemale: 'Toros por hembra',
    strategy: 'Estrategia',
    automatic: 'Automática',
    femalesInBotijao: 'Hembras en el Tanque:',
    total: 'Total',
    females: 'hembras',
    andMore: 'y más',
    plannedMatings: 'Apareamientos Planificados:',
    totalMatings: 'Total de apareamientos',
    geneticProjectionPlan: 'Plan de Proyección Genética',
    geneticPlan: 'Plan Genético:',
    objective: 'Objetivo',
    timeframe: 'Plazo',
    priorityTraits: 'Características Prioritarias',
    selectedBulls: 'Toros Seleccionados:',
    expectedResults: 'Resultados Esperados:',
    totalProjections: 'Total de proyecciones',
    projectedAvgTPI: 'TPI promedio proyectado',
    projectedAvgNM: 'NM$ promedio proyectado',
  },
} as const;

export const generateSegmentationPDF = async (data: {
  farmName: string;
  filters: any;
  distribution: any;
  customSettings?: any;
  femalesData: any[];
  date: string;
  locale?: Locale;
}) => {
  const L = pdfI18n[data.locale ?? 'pt-BR'];
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.segmentationReport, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${L.farm}: ${data.farmName}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`${L.date}: ${data.date}`, 20, yPosition);
  yPosition += 15;

  // Filtros aplicados
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.appliedFilters, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (data.filters.categories && data.filters.categories.length > 0) {
    pdf.text(`${L.categories}: ${data.filters.categories.join(', ')}`, 25, yPosition);
    yPosition += 6;
  }
  if (data.filters.classifications && data.filters.classifications.length > 0) {
    pdf.text(`${L.classifications}: ${data.filters.classifications.join(', ')}`, 25, yPosition);
    yPosition += 6;
  }

  yPosition += 10;

  // Distribuição dos grupos
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.groupDistribution, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (data.distribution.donor) {
    pdf.text(`${L.donor}: ${data.distribution.donor}%`, 25, yPosition);
    yPosition += 6;
  }
  if (data.distribution.inter) {
    pdf.text(`${L.intermediate}: ${data.distribution.inter}%`, 25, yPosition);
    yPosition += 6;
  }
  if (data.distribution.recipient) {
    pdf.text(`${L.recipient}: ${data.distribution.recipient}%`, 25, yPosition);
    yPosition += 6;
  }

  // Custom settings se existir
  if (data.customSettings) {
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${L.customSettings}:`, 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${L.selectedIndex}: ${data.customSettings.selectedIndex}`, 25, yPosition);
    yPosition += 6;

    if (data.customSettings.weights) {
      pdf.text(`${L.ptaWeights}`, 25, yPosition);
      yPosition += 6;
      Object.entries(data.customSettings.weights).forEach(([pta, weight]: [string, any]) => {
        pdf.text(`  ${pta}: ${weight}%`, 30, yPosition);
        yPosition += 5;
      });
    }
  }

  // Estatísticas das fêmeas
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.statistics, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${L.totalFemales}: ${data.femalesData.length}`, 25, yPosition);
  yPosition += 6;

  const donors = data.femalesData.filter(f => f.classification === 'donor').length;
  const inter = data.femalesData.filter(f => f.classification === 'inter').length;
  const recipients = data.femalesData.filter(f => f.classification === 'recipient').length;

  pdf.text(`${L.donors}: ${donors}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`${L.intermediates}: ${inter}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`${L.recipients}: ${recipients}`, 25, yPosition);

  return pdf;
};

export const generateBotijaoVirtualPDF = async (data: {
  farmName: string;
  females: any[];
  matings: any[];
  settings: any;
  date: string;
  locale?: Locale;
}) => {
  const L = pdfI18n[data.locale ?? 'pt-BR'];
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.botijaoReport, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${L.farm}: ${data.farmName}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`${L.date}: ${data.date}`, 20, yPosition);
  yPosition += 15;

  // Configurações
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.settings, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${L.bullsPerFemale}: ${data.settings.bullsPerFemale || 3}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`${L.strategy}: ${data.settings.strategy || L.automatic}`, 25, yPosition);
  yPosition += 15;

  // Fêmeas no botijão
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.femalesInBotijao, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${L.total}: ${data.females.length} ${L.females}`, 25, yPosition);
  yPosition += 10;

  // Lista de fêmeas (limitada para não estourar página)
  const maxFemales = Math.min(data.females.length, 20);
  for (let i = 0; i < maxFemales; i++) {
    const female = data.females[i];
    pdf.text(`${i + 1}. ${female.name} (${female.identifier})`, 25, yPosition);
    yPosition += 5;

    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
  }

  if (data.females.length > maxFemales) {
    pdf.text(`... ${L.andMore} ${data.females.length - maxFemales} ${L.females}`, 25, yPosition);
    yPosition += 10;
  }

  // Acasalamentos
  if (data.matings && data.matings.length > 0) {
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(L.plannedMatings, 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${L.totalMatings}: ${data.matings.length}`, 25, yPosition);
  }

  return pdf;
};

export const generateGeneticProjectionPDF = async (data: {
  farmName: string;
  geneticPlan: any;
  selectedBulls: any[];
  results: any[];
  charts: any;
  date: string;
  locale?: Locale;
}) => {
  const L = pdfI18n[data.locale ?? 'pt-BR'];
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.geneticProjectionPlan, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${L.farm}: ${data.farmName}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`${L.date}: ${data.date}`, 20, yPosition);
  yPosition += 15;

  // Plano Genético
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(L.geneticPlan, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  if (data.geneticPlan.objective) {
    pdf.text(`${L.objective}: ${data.geneticPlan.objective}`, 25, yPosition);
    yPosition += 6;
  }
  if (data.geneticPlan.timeframe) {
    pdf.text(`${L.timeframe}: ${data.geneticPlan.timeframe}`, 25, yPosition);
    yPosition += 6;
  }
  if (data.geneticPlan.priorityTraits) {
    pdf.text(`${L.priorityTraits}: ${data.geneticPlan.priorityTraits.join(', ')}`, 25, yPosition);
    yPosition += 6;
  }
  yPosition += 10;

  // Touros Selecionados
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${L.selectedBulls}:`, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  data.selectedBulls.forEach((bull, index) => {
    pdf.text(`${index + 1}. ${bull.name} (${bull.code})`, 25, yPosition);
    yPosition += 5;
    if (bull.tpi) {
      pdf.text(`   TPI: ${bull.tpi} | NM$: ${bull.nm_dollar || 'N/A'}`, 30, yPosition);
      yPosition += 5;
    }
    yPosition += 2;
  });
  yPosition += 10;

  // Resultados
  if (data.results && data.results.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${L.expectedResults}:`, 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${L.totalProjections}: ${data.results.length}`, 25, yPosition);
    yPosition += 6;

    // Estatísticas resumidas
    const avgTPI = data.results.reduce((sum: number, r: any) => sum + (r.projectedTPI || 0), 0) / data.results.length;
    const avgNM = data.results.reduce((sum: number, r: any) => sum + (r.projectedNM || 0), 0) / data.results.length;

    pdf.text(`${L.projectedAvgTPI}: ${formatPtaValue('TPI', avgTPI)}`, 25, yPosition);
    yPosition += 6;
    pdf.text(`${L.projectedAvgNM}: ${formatPtaValue('NM$', avgNM)}`, 25, yPosition);
  }

  return pdf;
};

export const generatePDFBlob = async (pdf: jsPDF): Promise<Blob> => {
  return new Promise((resolve) => {
    const pdfBlob = pdf.output('blob');
    resolve(pdfBlob);
  });
};