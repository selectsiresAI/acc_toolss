import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { ReportSelection, GeneralReportConfig } from "@/hooks/useGeneralReport";
import type { Locale } from "@/lib/i18n";
import acceleratedLogoUrl from "@/assets/accelerated-genetics-logo.png";

let _logoDataUrlCache: { dataUrl: string; width: number; height: number } | null = null;
async function loadAcceleratedLogo(): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (_logoDataUrlCache) return _logoDataUrlCache;
  try {
    const res = await fetch(acceleratedLogoUrl);
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const dims: { width: number; height: number } = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    _logoDataUrlCache = { dataUrl, ...dims };
    return _logoDataUrlCache;
  } catch (e) {
    console.warn('Failed to load Accelerated Genetics logo for PDF', e);
    return null;
  }
}

export interface GenerateReportOptions {
  farmName: string;
  farmOwner: string;
  userName: string;
  reports: ReportSelection[];
  config: GeneralReportConfig;
  onProgress: (progress: number, message: string) => void;
  locale?: Locale;
}

interface PageInfo {
  title: string;
  pageNumber: number;
}

const REPORT_LABELS_I18N: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    herd_summary: 'Resumo do Rebanho',
    segmentation: 'Segmentação',
    auditoria_step1: 'Auditoria - Parentesco',
    auditoria_step2: 'Auditoria - Top Parents',
    auditoria_step3: 'Auditoria - Quartis Overview',
    auditoria_step4: 'Auditoria - Progressão',
    auditoria_step5: 'Auditoria - Comparação',
    auditoria_step6: 'Auditoria - Quartis Índices',
    auditoria_step7: 'Auditoria - Distribuição',
    botijao: 'Botijão Virtual',
    projecao: 'Projeção Genética',
    trends: 'Gráficos de Tendência',
    metas: 'Metas Genéticas',
    nexus: 'Nexus Predições',
  },
  'en-US': {
    herd_summary: 'Herd Summary',
    segmentation: 'Segmentation',
    auditoria_step1: 'Audit - Parentage',
    auditoria_step2: 'Audit - Top Parents',
    auditoria_step3: 'Audit - Quartiles Overview',
    auditoria_step4: 'Audit - Progression',
    auditoria_step5: 'Audit - Comparison',
    auditoria_step6: 'Audit - Index Quartiles',
    auditoria_step7: 'Audit - Distribution',
    botijao: 'Virtual Tank',
    projecao: 'Genetic Projection',
    trends: 'Trend Charts',
    metas: 'Genetic Goals',
    nexus: 'Nexus Predictions',
  },
  'es': {
    herd_summary: 'Resumen del Rebaño',
    segmentation: 'Segmentación',
    auditoria_step1: 'Auditoría - Parentesco',
    auditoria_step2: 'Auditoría - Top Padres',
    auditoria_step3: 'Auditoría - Cuartiles General',
    auditoria_step4: 'Auditoría - Progresión',
    auditoria_step5: 'Auditoría - Comparación',
    auditoria_step6: 'Auditoría - Cuartiles de Índices',
    auditoria_step7: 'Auditoría - Distribución',
    botijao: 'Tanque Virtual',
    projecao: 'Proyección Genética',
    trends: 'Gráficos de Tendencia',
    metas: 'Metas Genéticas',
    nexus: 'Nexus Predicciones',
  },
};

const reportI18n = {
  'pt-BR': {
    generalReport: 'RELATÓRIO GERAL',
    consolidatedAnalysis: 'Análise Genética Consolidada',
    owner: 'Proprietário',
    preparedBy: 'Preparado por',
    generatedOn: 'Gerado em',
    atTime: 'às',
    index: 'ÍNDICE',
    page: 'Página',
    of: 'de',
    preparingDoc: 'Preparando documento...',
    generating: 'Gerando',
    finalizingDoc: 'Finalizando documento...',
    done: 'Concluído!',
    distribution: 'Distribuição',
    histogram: 'Histograma',
  },
  'en-US': {
    generalReport: 'GENERAL REPORT',
    consolidatedAnalysis: 'Consolidated Genetic Analysis',
    owner: 'Owner',
    preparedBy: 'Prepared by',
    generatedOn: 'Generated on',
    atTime: 'at',
    index: 'INDEX',
    page: 'Page',
    of: 'of',
    preparingDoc: 'Preparing document...',
    generating: 'Generating',
    finalizingDoc: 'Finalizing document...',
    done: 'Done!',
    distribution: 'Distribution',
    histogram: 'Histogram',
  },
  'es': {
    generalReport: 'INFORME GENERAL',
    consolidatedAnalysis: 'Análisis Genético Consolidado',
    owner: 'Propietario',
    preparedBy: 'Preparado por',
    generatedOn: 'Generado el',
    atTime: 'a las',
    index: 'ÍNDICE',
    page: 'Página',
    of: 'de',
    preparingDoc: 'Preparando documento...',
    generating: 'Generando',
    finalizingDoc: 'Finalizando documento...',
    done: '¡Listo!',
    distribution: 'Distribución',
    histogram: 'Histograma',
  },
} as const;

async function captureElement(el: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // Hide tooltips during capture
  const tooltips = document.querySelectorAll<HTMLElement>(".recharts-tooltip-wrapper");
  const hiddenTooltips: Array<{ element: HTMLElement; display: string }> = [];
  
  tooltips.forEach((tooltip) => {
    hiddenTooltips.push({ element: tooltip, display: tooltip.style.display });
    tooltip.style.display = "none";
  });

  try {
    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      ignoreElements: (element) => {
        if (!(element instanceof HTMLElement)) return false;
        if (element.dataset?.pdfIgnore === "true") return true;
        if (element.classList.contains("pdf-ignore")) return true;
        return false;
      },
    });
    return canvas;
  } finally {
    hiddenTooltips.forEach(({ element, display }) => {
      element.style.display = display;
    });
  }
}

function addCoverPage(
  doc: jsPDF,
  farmName: string,
  farmOwner: string,
  userName: string,
  includeDateTime: boolean,
  locale: Locale = 'pt-BR',
  logo?: { dataUrl: string; width: number; height: number } | null
): void {
  const L = reportI18n[locale];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(239, 68, 68); // red-500
  doc.rect(0, 0, pageWidth, 80, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(L.generalReport, centerX, 40, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(L.consolidatedAnalysis, centerX, 55, { align: 'center' });

  // Farm info section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(farmName, centerX, 120, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${L.owner}: ${farmOwner}`, centerX, 135, { align: 'center' });

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(centerX - 60, 150, centerX + 60, 150);

  // Footer info
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`${L.preparedBy}: ${userName}`, centerX, pageHeight - 40, { align: 'center' });

  if (includeDateTime) {
    const now = new Date();
    const dateLocale = locale === 'en-US' ? 'en-US' : locale === 'es' ? 'es' : 'pt-BR';
    const dateStr = now.toLocaleDateString(dateLocale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString(dateLocale, {
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`${L.generatedOn}: ${dateStr} ${L.atTime} ${timeStr}`, centerX, pageHeight - 30, { align: 'center' });
  }

  // Accelerated Genetics branding (logo + text) at the very bottom
  if (logo) {
    const logoH = 12;
    const logoW = (logo.width / logo.height) * logoH;
    doc.addImage(logo.dataUrl, 'PNG', centerX - logoW / 2, pageHeight - 28, logoW, logoH);
  }
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Powered by ToolSS · by Accelerated Genetics', centerX, pageHeight - 10, { align: 'center' });
}

function addIndexPage(doc: jsPDF, pages: PageInfo[], locale: Locale = 'pt-BR'): void {
  const L = reportI18n[locale];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(L.index, margin, 30);
  
  // Divider
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(2);
  doc.line(margin, 35, margin + 40, 35);
  
  // Index items
  let y = 55;
  const lineHeight = 12;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  pages.forEach((page, index) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 30;
    }
    
    const number = `${index + 1}.`;
    const title = page.title;
    const pageNum = page.pageNumber.toString();
    
    // Number
    doc.setTextColor(239, 68, 68);
    doc.text(number, margin, y);
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin + 12, y);
    
    // Dots
    const titleWidth = doc.getTextWidth(title);
    const pageNumWidth = doc.getTextWidth(pageNum);
    const dotsStart = margin + 12 + titleWidth + 5;
    const dotsEnd = pageWidth - margin - pageNumWidth - 5;
    
    doc.setTextColor(180, 180, 180);
    let dotX = dotsStart;
    while (dotX < dotsEnd) {
      doc.text('.', dotX, y);
      dotX += 3;
    }
    
    // Page number
    doc.setTextColor(100, 100, 100);
    doc.text(pageNum, pageWidth - margin, y, { align: 'right' });
    
    y += lineHeight;
  });
}

function addPageNumber(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  locale: Locale = 'pt-BR',
  logo?: { dataUrl: string; width: number; height: number } | null
): void {
  const L = reportI18n[locale];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Footer divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(15, pageHeight - 14, pageWidth - 15, pageHeight - 14);

  // Left: logo + "by Accelerated Genetics"
  if (logo) {
    const logoH = 6;
    const logoW = (logo.width / logo.height) * logoH;
    doc.addImage(logo.dataUrl, 'PNG', 15, pageHeight - 11, logoW, logoH);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('by Accelerated Genetics', 15 + logoW + 2, pageHeight - 6);
  } else {
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('by Accelerated Genetics', 15, pageHeight - 6);
  }

  // Center: page numbering
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `${L.page} ${pageNum} ${L.of} ${totalPages}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );
}

function addSectionTitle(
  doc: jsPDF,
  title: string,
  logo?: { dataUrl: string; width: number; height: number } | null
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Background bar
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 25, 'F');

  // Red accent
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, 5, 25, 'F');

  // Title text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, 17);

  // Logo on the right side of the header
  if (logo) {
    const logoH = 10;
    const logoW = (logo.width / logo.height) * logoH;
    doc.addImage(logo.dataUrl, 'PNG', pageWidth - margin - logoW, 7.5, logoW, logoH);
  }
}

export async function generateGeneralReport(
  options: GenerateReportOptions,
  containerRef: HTMLElement | null
): Promise<Blob | null> {
  const { farmName, farmOwner, userName, reports, config, onProgress, locale: optLocale } = options;
  const locale: Locale = optLocale ?? 'pt-BR';
  const L = reportI18n[locale];
  const RL = REPORT_LABELS_I18N[locale];

  if (!containerRef) {
    console.error('Container ref is null');
    return null;
  }

  const selectedReports = reports.filter(r => r.enabled);
  if (selectedReports.length === 0) {
    // No reports selected
    return null;
  }

  const orientation = config.orientation === 'landscape' ? 'l' : 'p';
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const pageTracker: PageInfo[] = [];
  let currentPage = 1;

  // Calculate starting page for content
  let contentStartPage = 1;
  if (config.includeCover) contentStartPage++;
  if (config.includeIndex) contentStartPage++;

  onProgress(5, L.preparingDoc);

  // Preload Accelerated Genetics logo for headers/footers
  const brandLogo = await loadAcceleratedLogo();

  // Add cover page
  if (config.includeCover) {
    addCoverPage(doc, farmName, farmOwner, userName, config.includeDateTime, locale, brandLogo);
    doc.addPage();
    currentPage++;
  }

  // Reserve space for index (will be filled later)
  const indexPageNumber = config.includeIndex ? currentPage : -1;
  if (config.includeIndex) {
    doc.addPage();
    currentPage++;
  }

  // Process each selected report
  const totalReports = selectedReports.length;
  
  for (let i = 0; i < selectedReports.length; i++) {
    const report = selectedReports[i];
    const progressPercent = 10 + Math.floor((i / totalReports) * 80);
    const reportLabel = RL[report.type] ?? report.label;
    onProgress(progressPercent, `${L.generating} ${reportLabel}...`);

    // Find the rendered section in the container
    const sectionEl = containerRef.querySelector(`[data-report-section="${report.type}"]`) as HTMLElement;
    
    if (!sectionEl) {
      // Section not found for this report type
      continue;
    }

    // Special handling for Step 7 histograms - each chart on its own landscape page
    if (report.type === 'auditoria_step7') {
      const histogramCards = sectionEl.querySelectorAll('[data-chart-page="histogram"]');
      
      for (let hIdx = 0; hIdx < histogramCards.length; hIdx++) {
        const card = histogramCards[hIdx] as HTMLElement;
        const chartLabel = card.getAttribute('data-chart-label') || `${L.histogram} ${hIdx + 1}`;
        
        try {
          // Capture the individual histogram
          const canvas = await captureElement(card, 2);
          const imgData = canvas.toDataURL('image/png');
          
          // Add new page in LANDSCAPE orientation (forced for histograms)
          doc.addPage('a4', 'l');
          currentPage++;
          
          // Landscape A4 dimensions
          const pageWidth = 297; // mm
          const pageHeight = 210; // mm
          const margin = 15;
          const contentTop = 30;
          
          // Add section title
          addSectionTitle(doc, `${L.distribution} - ${chartLabel}`);
          
          // Calculate image dimensions for landscape
          const maxW = pageWidth - margin * 2;
          const maxH = pageHeight - contentTop - margin - 15;
          const ratio = canvas.height / canvas.width;
          
          let imgW = maxW;
          let imgH = imgW * ratio;
          
          if (imgH > maxH) {
            imgH = maxH;
            imgW = imgH / ratio;
          }
          
          // Center the image
          const xOffset = (pageWidth - imgW) / 2;
          doc.addImage(imgData, 'PNG', xOffset, contentTop, imgW, imgH);
          
          // Track page info
          pageTracker.push({
            title: `${L.distribution} - ${chartLabel}`,
            pageNumber: currentPage,
          });
        } catch (error) {
          console.error(`Error capturing histogram ${chartLabel}:`, error);
        }
        
        // Small delay to prevent UI freezing
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      
      continue; // Skip standard section processing
    }

    // Standard section capture for non-histogram reports
    try {
      const canvas = await captureElement(sectionEl, 2);
      const imgData = canvas.toDataURL('image/png');
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentTop = 30;
      
      // Calculate image dimensions
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - contentTop - margin - 15; // Leave space for page number
      const ratio = canvas.height / canvas.width;
      
      let imgW = maxW;
      let imgH = imgW * ratio;
      
      if (imgH > maxH) {
        imgH = maxH;
        imgW = imgH / ratio;
      }

      // Add section title
      const sectionLabel = RL[report.type] ?? report.label;
      addSectionTitle(doc, sectionLabel);

      // Add image
      const xOffset = (pageWidth - imgW) / 2;
      doc.addImage(imgData, 'PNG', xOffset, contentTop, imgW, imgH);

      // Track page info
      pageTracker.push({
        title: sectionLabel,
        pageNumber: currentPage,
      });
      
      // Add new page for next report (except for last one)
      if (i < selectedReports.length - 1) {
        doc.addPage();
        currentPage++;
      }
    } catch (error) {
      console.error(`Error capturing section ${report.type}:`, error);
    }

    // Small delay to prevent UI freezing
    await new Promise(resolve => requestAnimationFrame(resolve));
  }

  onProgress(90, L.finalizingDoc);

  // Go back and add index page
  if (config.includeIndex && indexPageNumber > 0) {
    doc.setPage(indexPageNumber);
    addIndexPage(doc, pageTracker, locale);
  }

  // Add page numbers
  if (config.includePageNumbers) {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      // Skip cover page
      if (config.includeCover && i === 1) continue;
      addPageNumber(doc, i, totalPages, locale);
    }
  }

  onProgress(100, L.done);

  // Return as blob
  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
