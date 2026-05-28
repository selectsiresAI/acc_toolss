// English help content for all pages/modules
import type { HelpContent } from './helpContent';

export const helpContentMapEN: Record<string, HelpContent> = {
  // Spreadsheet Conversion
  conversao: {
    faq: [
      {
        question: "What is the Conversion tool?",
        answer: "It standardizes spreadsheets with different naming conventions, automatically mapping columns to a standard format using an alias database, regex, and fuzzy matching. Ideal for consolidating data from different sources."
      },
      {
        question: "Should I use the default template or create my own?",
        answer: "Use the 'Use our default template' button to access all commonly used genetic columns (PTAs, economic indexes, health, fertility, type). Create your own only if you need specific different columns."
      },
      {
        question: "Do I always need to upload the legend database?",
        answer: "Not required. The system already has a built-in default database. But if you click 'Use our default legends', you'll get hundreds of additional mappings that greatly improve automatic match detection."
      },
      {
        question: "What are 'safe' suggestions?",
        answer: "These are high-confidence mappings (score >= 0.8) from the legend database or regex patterns. You can approve them all at once with the 'Approve Safe' button to save time."
      },
      {
        question: "Can I adjust the suggested mappings?",
        answer: "Yes! For each row in the table, you can accept the automatic suggestion, manually choose another column from the template, or leave it unmapped. You have full control."
      },
      {
        question: "How does automatic detection work?",
        answer: "The system uses 3 methods in priority order: 1) Legend database (custom + default), 2) Regex patterns for known formats, 3) Fuzzy matching for text similarity. Each suggestion shows its source and score."
      }
    ],
    resources: [
      {
        title: "Guide: Spreadsheet Conversion",
        description: "Complete step-by-step guide to standardize your data",
        type: "Guide"
      },
      {
        title: "Video: Using Default Templates and Legends",
        description: "How to speed up the process with pre-configured files",
        type: "Video"
      },
      {
        title: "Naming Database",
        description: "Understand how to create and use custom alias databases",
        type: "Guide"
      }
    ],
    hints: {
      modelUpload: "Upload the default template or click to use our template with all genetic columns",
      legendUpload: "Optional: use our default legends to improve automatic detection",
      dataUpload: "Upload the spreadsheet you want to standardize - Excel or CSV format",
      suggestions: "Review automatic suggestions and approve or adjust as needed",
      safeSuggestions: "Approve all 'safe' suggestions at once to save time",
      download: "Download the standardized spreadsheet after approving all mappings"
    }
  },

  // Dashboard / Home
  dashboard: {
    faq: [
      {
        question: "How do I create a new farm?",
        answer: "Click the 'Create New Farm' button on the dashboard. Enter the farm name and confirm. You can add animals later."
      },
      {
        question: "How do I delete a farm?",
        answer: "On the farm card in the dashboard, click the trash icon. Confirm the deletion. WARNING: This action is permanent and will remove all farm data."
      },
      {
        question: "What are the available modules?",
        answer: "Each farm has access to 5 modules: Herd (animal management), Nexus (genetic prediction), Plan (genetic planning), Charts (visual analysis), and Audit (complete reports)."
      }
    ],
    resources: [
      {
        title: "Getting Started",
        description: "Complete guide to start using the platform",
        type: "Guide"
      },
      {
        title: "Video: Platform Tour",
        description: "Discover all features in 5 minutes",
        type: "Video"
      }
    ],
    hints: {
      createFarm: "Create your first farm to start managing your herd",
      selectFarm: "Select a farm to access its modules and data",
      modules: "Each module offers specific tools for genetic management"
    }
  },

  // Herd
  herd: {
    faq: [
      {
        question: "How do I import female data?",
        answer: "Click 'Import Females' and select your CSV or Excel file. The system accepts various formats and will perform automatic validation. If your file has non-standard headers (e.g., genomic lab files), use the Conversion Menu to automatically standardize columns before importing."
      },
      {
        question: "My file has different headers, what should I do?",
        answer: "Use the Conversion Menu (available on the Dashboard under 'Operations and Support'). This tool automatically converts any genomic file format to the ToolSS standard, mapping hundreds of different naming conventions. After converting, import the standardized file."
      },
      {
        question: "How do I export herd data?",
        answer: "Click the 'Export' button to download a CSV file with all female data, including PTAs, pedigree, and reproductive information."
      },
      {
        question: "What are the automatic categories?",
        answer: "The system automatically categorizes animals into: Calf (up to 90 days), Heifer (91 days to 1st calving), Primiparous (1st calving), Secundiparous (2nd calving), and Multiparous (3+ calvings)."
      },
      {
        question: "How do I filter animals by year?",
        answer: "Use the year filter at the top of the table to view only animals born in a specific year. Useful for crop-year analysis."
      },
      {
        question: "How do I delete selected animals?",
        answer: "Select the females using the checkboxes, then click the 'Delete Selected' button. Confirm the deletion. This action is permanent."
      }
    ],
    resources: [
      {
        title: "Guide: Data Import",
        description: "Complete step-by-step guide to import your animals",
        type: "Guide"
      },
      {
        title: "Video: Herd Management",
        description: "How to use filters, sorting, and export",
        type: "Video"
      },
      {
        title: "Import File Format",
        description: "Technical specifications for accepted CSV/Excel files",
        type: "Guide"
      }
    ],
    hints: {
      import: "Import female data via CSV or Excel. Supports multiple formats with automatic validation",
      export: "Export all herd data for backup or external analysis",
      search: "Search by animal name or identifier",
      filter: "Filter by birth year for crop-year analysis",
      select: "Select multiple animals for batch actions",
      delete: "Delete selected animals (permanent action)",
      sort: "Click headers to sort by any column",
      category: "Automatic categories based on age and calving order",
      pedigree: "View complete pedigree with NAAB codes and names"
    }
  },

  // Nexus
  nexus: {
    faq: [
      {
        question: "What is Nexus?",
        answer: "Nexus is our advanced genetic prediction tool. It offers 3 methods: Nexus 1 (genomics), Nexus 2 (pedigree), and Nexus 3 (groups), to calculate estimated PTAs for animals."
      },
      {
        question: "Which Nexus method should I use?",
        answer: "Nexus 1 for animals with genomic data; Nexus 2 for pedigree-based prediction (sire, maternal grandsire, maternal great-grandsire); Nexus 3 for comparative group analysis."
      },
      {
        question: "How does Nexus 2 (Pedigree) work?",
        answer: "Enter the NAAB codes for the sire, maternal grandsire, and maternal great-grandsire. The system calculates estimated PTAs using pedigree regression and standard selection indexes."
      },
      {
        question: "Can I use Nexus without genomic data?",
        answer: "Yes! Nexus 2 works with pedigree information only (NAAB codes). Ideal when genotyping data is not available."
      }
    ],
    resources: [
      {
        title: "Guide: Nexus Pedigree",
        description: "How to use Nexus 2 for pedigree predictions",
        type: "Guide"
      },
      {
        title: "Video: Genomic Nexus",
        description: "Complete tutorial of Nexus 1 for genomic data",
        type: "Video"
      },
      {
        title: "Nexus 3: Group Analysis",
        description: "Compare groups of animals and identify patterns",
        type: "Guide"
      }
    ],
    hints: {
      methodSelection: "Choose the Nexus method appropriate for your available data",
      genomic: "Nexus 1: Use when you have genotyping data for the animals",
      pedigree: "Nexus 2: Use when you only have pedigree information (NAAB codes)",
      groups: "Nexus 3: Compare groups of animals and identify genetic trends",
      naabCode: "NAAB codes identify bulls registered in the USA. E.g.: 11HO12345",
      prediction: "Predictions are estimates based on validated statistical models"
    }
  },

  // Genetic Plan
  plano: {
    faq: [
      {
        question: "What is Genetic Projection?",
        answer: "It's a tool that simulates different mating strategies, calculating the genetic and economic impact (ROI) of each scenario over time."
      },
      {
        question: "What is the Replacement Calculator?",
        answer: "A complete system with 7 planning phases: population growth, genetic strategy, reproductive goals, composition, investments, revenue, and ROI analysis."
      },
      {
        question: "How do I set genetic goals?",
        answer: "In the Replacement Calculator, set target indexes (TPI, NM$, etc.) you want to achieve. The system will calculate the strategies needed to reach those goals."
      }
    ],
    resources: [
      {
        title: "Guide: Genetic Projection",
        description: "How to simulate mating strategies",
        type: "Guide"
      },
      {
        title: "Video: Replacement Calculator",
        description: "Tutorial of the 7 planning phases",
        type: "Video"
      },
      {
        title: "ROI and Genetic Return",
        description: "Understand how to calculate genetic investment return",
        type: "Guide"
      }
    ],
    hints: {
      projection: "Simulate different mating strategies and see the impact on the herd",
      calculator: "Plan herd replacement in 7 structured phases",
      goals: "Set realistic genetic and economic goals for your herd",
      roi: "Calculate the expected financial return of each genetic strategy",
      phases: "Each calculator phase depends on the previous ones - follow the order"
    }
  },

  // Charts
  charts: {
    faq: [
      {
        question: "How do I interpret trend charts?",
        answer: "Charts show the evolution of PTAs over time. Ascending lines indicate positive genetic progress. Use them to evaluate the effectiveness of selection strategies."
      },
      {
        question: "How do I export charts?",
        answer: "Click the 'Export' button to download data in CSV or generate a PDF with all charts. Ideal for reports and presentations."
      },
      {
        question: "What are the different grouping types?",
        answer: "Group by year (temporal evolution), category (calves, heifers, etc.), or parity (calving order) for specific herd analyses."
      },
      {
        question: "How do I add more PTAs to the charts?",
        answer: "In the settings panel, click on PTA badges to add/remove. You can view up to 5 PTAs simultaneously for comparison."
      }
    ],
    resources: [
      {
        title: "Guide: Chart Interpretation",
        description: "How to analyze herd genetic trends",
        type: "Guide"
      },
      {
        title: "Video: Visual Data Analysis",
        description: "Complete tour of visualization features",
        type: "Video"
      },
      {
        title: "Report Export",
        description: "How to generate professional PDFs and CSVs",
        type: "Guide"
      }
    ],
    hints: {
      config: "Configure which PTAs to visualize and how to group data",
      chartType: "Switch between line, bar, or area charts as needed",
      grouping: "Group by year, category, or parity for different perspectives",
      export: "Export data in CSV or charts in PDF for external reports",
      trends: "Trend lines help identify genetic progress over time",
      distribution: "Distribution charts show how animals are distributed for each PTA",
      multiPTA: "Compare up to 5 PTAs simultaneously for multivariate analysis"
    }
  },

  // Bull Search
  bulls: {
    faq: [
      {
        question: "How do I import bull data?",
        answer: "Click 'Import Bulls', select a CSV or Excel file with the data. The system supports multiple formats and performs automatic validation. Use the 'Download Template' button to see the correct format."
      },
      {
        question: "How does the scoring system work?",
        answer: "You define weights for each PTA (TPI, NM$, etc.). The system calculates a weighted score for each bull. Bulls with higher scores are best suited to your criteria."
      },
      {
        question: "What is staging migration?",
        answer: "After importing, data goes to 'staging' (temporary area). Click 'Migrate Bulls' to process and validate the data, moving it to the permanent database."
      },
      {
        question: "How do I export the bull list?",
        answer: "Use the 'Export' button to download all data in CSV, including PTAs, scores, and pedigree information. Useful for external analysis or backup."
      }
    ],
    resources: [
      {
        title: "Guide: Bull Import",
        description: "File format and complete import process",
        type: "Guide"
      },
      {
        title: "Video: Bull Selection",
        description: "How to use filters and scores to choose the best bulls",
        type: "Video"
      },
      {
        title: "Custom Scoring System",
        description: "Configure custom weights for your objectives",
        type: "Guide"
      }
    ],
    hints: {
      import: "Import bull data via CSV/Excel. Use the template to ensure correct format",
      template: "Download the template with real data examples to facilitate import",
      staging: "Imported data goes to staging. Use 'Migrate Bulls' to process",
      search: "Search bulls by NAAB code, name, or company",
      filter: "Filter by company or birth year",
      weights: "Adjust PTA weights according to your selection objectives",
      score: "Higher scores indicate bulls more aligned with your criteria",
      export: "Export the complete bull list with all data and scores",
      company: "Filter by company to see bulls from specific AI centers"
    }
  },

  // Segmentation
  segmentation: {
    faq: [
      {
        question: "What is herd segmentation?",
        answer: "It's the process of classifying animals into groups (Superior, Intermediate, Inferior) based on customizable genetic indexes. Useful for selection and culling decisions."
      },
      {
        question: "How do I create a custom index?",
        answer: "Select the relevant PTAs, define weights for each, and choose whether to use standardization (Z-score). The system will calculate a single index to classify your animals."
      },
      {
        question: "What are 'gates'?",
        answer: "Filters that exclude animals that don't meet minimum criteria. E.g.: 'SCS <= 2.75' excludes animals with very high somatic cell count."
      },
      {
        question: "How do I export the segmentation report?",
        answer: "Click 'Export PDF' to generate a complete report with charts, statistics, and animal list by classification. Ideal for documenting decisions."
      }
    ],
    resources: [
      {
        title: "Guide: Herd Segmentation",
        description: "How to strategically classify and select animals",
        type: "Guide"
      },
      {
        title: "Video: Custom Indexes",
        description: "Create personalized indexes for your objectives",
        type: "Video"
      },
      {
        title: "Gates and Advanced Filters",
        description: "How to use filters for precise selection",
        type: "Guide"
      }
    ],
    hints: {
      indexSelection: "Choose between HHP$, TPI, NM$ or create a custom index",
      traits: "Select which PTAs to include in your custom index",
      weights: "Define the relative importance of each PTA (sum must be 100%)",
      standardize: "Standardization (Z-score) recommended when PTAs have different scales",
      gates: "Use gates to exclude animals that don't meet minimum requirements",
      segmentation: "Adjust percentages to classify animals into 3 groups",
      presets: "Save frequent configurations as presets for future use",
      export: "Export complete PDF report with charts and statistics",
      visualization: "Pie and bar charts help visualize herd distribution"
    }
  },

  // Genetic Audit
  auditoria: {
    faq: [
      {
        question: "What is the Genetic Audit?",
        answer: "A complete herd analysis in 7 steps: parentage, top parents, quartiles, progression, comparison, distribution, and benchmark. Provides a 360-degree view of genetic potential."
      },
      {
        question: "How do I interpret quartiles?",
        answer: "Animals are divided into 4 groups of 25% each. Q4 (superior) represents the top 25%. Compare your herd's distribution with the national average."
      },
      {
        question: "What is the benchmark?",
        answer: "Compares your herd's average indexes with national or regional averages. Shows where you are above or below industry standards."
      },
      {
        question: "How do I export the complete audit?",
        answer: "Use the 'Export PDF' button to generate a professional report with all 7 steps, charts, and analyses. Ideal for meetings and decision-making."
      }
    ],
    resources: [
      {
        title: "Guide: Complete Genetic Audit",
        description: "Understand each of the 7 audit steps",
        type: "Guide"
      },
      {
        title: "Video: Result Interpretation",
        description: "How to use audit insights for strategic decisions",
        type: "Video"
      },
      {
        title: "Benchmark and Comparisons",
        description: "How to position yourself relative to the market",
        type: "Guide"
      }
    ],
    hints: {
      steps: "Navigate through the 7 steps using the buttons at the top of the page",
      parentesco: "Analyze herd inbreeding and genetic diversity",
      topParents: "Identify the most influential bulls and cows in your herd",
      quartis: "See how your animals are distributed in each index's quartiles",
      progression: "Evaluate genetic progress over the years",
      comparison: "Compare different generations or periods",
      distribution: "Visualize detailed distribution of each PTA",
      benchmark: "Compare yourself with national averages and identify opportunities",
      export: "Export professional PDF report with all analyses"
    }
  },

  // Audit Step 1: Parentage
  "auditoria-step1": {
    faq: [
      {
        question: "What does 'Complete Parentage' mean?",
        answer: "The animal has information for Sire, Maternal Grandsire (MGS), and Maternal Great-Grandsire (MMGS). Essential for accurate predictions in Nexus 2 (pedigree). The more complete, the higher the genetic reliability."
      },
      {
        question: "Why does the system split into 3 categories (Complete, Incomplete, Unknown)?",
        answer: "'Complete' = has all 3 ancestors. 'Incomplete' = has 1 or 2 ancestors. 'Unknown' = no registered ancestors. This division helps identify priorities: complete the 'Incomplete' ones first (they already have a partial base)."
      },
      {
        question: "What is the importance of each ancestor (Sire vs MGS vs MMGS)?",
        answer: "Sire contributes 50% of genetics, MGS 25%, MMGS 12.5%. Priority focus: complete Sire (highest impact), then MGS, finally MMGS. Without a registered Sire, genetic prediction is compromised."
      },
      {
        question: "What does it mean when more than 50% of the herd is 'Unknown' for Sire?",
        answer: "Critical alert! Half the animals have no registered sire, harming genetic predictions. Common causes: AI data not imported, incomplete manual registration, bulls without NAAB codes. ACTION: review AI history and complete codes."
      },
      {
        question: "Why does the 'Complete' percentage vary between Sire, MGS, and MMGS?",
        answer: "This is expected. Older records (MMGS) tend to have less data. Focus: achieve 80%+ Sire complete, 60%+ MGS, 40%+ MMGS. Prioritize young animals and those classified as 'Superior' in Segmentation."
      },
      {
        question: "How do I prioritize which pedigrees to complete?",
        answer: "Focus on: 1) Animals classified as 'Donor' or 'Superior' in Segmentation (highest future genetic impact), 2) Heifers and Primiparous (recent generations), 3) Animals with 'Incomplete' status (already have partial base, easier to complete)."
      },
      {
        question: "Can I correct pedigrees directly in Step 1?",
        answer: "No. Step 1 is read-only (displays statistics). To correct, go to the 'Herd' module, find the animal, edit the NAAB codes for Sire/MGS/MMGS. Return to the Audit and data will be updated automatically."
      },
      {
        question: "How do I export the list of animals with incomplete pedigree?",
        answer: "Step 1 doesn't export individual lists. Go to the 'Herd' module, filter animals where Sire/MGS/MMGS are empty, export to CSV. Use this list to create a data completeness action plan."
      },
      {
        question: "What is 'critical inbreeding'?",
        answer: "When more than 25% of the herd has the same bull as sire. Increases risk of genetic problems (low fertility, hereditary diseases). Step 1 doesn't automatically detect this, but Step 2 (Top Parents) shows this alert."
      },
      {
        question: "Why does the animal total vary between Sire, MGS, and MMGS?",
        answer: "May vary due to applied filters or incomplete data. Ideally the total should be equal (all herd animals). If there's a large discrepancy (>5%), investigate possible data import issues."
      },
      {
        question: "How do I use this analysis in Nexus 2?",
        answer: "Complete pending pedigrees (especially Sire and MGS) and reprocess in Nexus 2 for more reliable predictions. The system will prioritize animals with complete pedigree in calculations (higher REL%)."
      },
      {
        question: "How do I compare pedigree completeness between farms?",
        answer: "Not directly in Step 1. Export data from each farm to CSV (via Herd), compare 'Complete' percentages externally. Or request the developer to create a multi-farm comparative report."
      }
    ],
    resources: [
      {
        title: "Guide: Pedigree Completeness",
        description: "How to prioritize data completeness",
        type: "Guide"
      }
    ],
    hints: {
      completeness: "Focus on completing Sire (50% impact) before MGS/MMGS",
      priority: "Prioritize 'Superior' and 'Donor' animals from Segmentation",
      validation: "Check Step 2 to detect critical inbreeding"
    }
  },

  // Audit Step 2: Top Parents
  "auditoria-step2": {
    faq: [
      {
        question: "How are 'Top Parents' defined?",
        answer: "They are the most influential sires and maternal grandsires (MGS) in the herd, ranked by number of daughters (not by genetic quality, but by frequency). Useful for identifying genetic dependency and inbreeding risk."
      },
      {
        question: "What's the difference between the 'Sire' and 'MGS' tabs?",
        answer: "'Sire' = ranking of bulls used as direct sires (50% of genetics). 'MGS' = ranking of bulls that are maternal grandsires (25% of genetics, through the dam). Use both to see the complete family structure of the herd."
      },
      {
        question: "Why is the ranking by 'Number of Daughters' and not by genetic quality?",
        answer: "This step evaluates frequency of use (how many times each bull was used), not quality (PTAs). Bulls with many daughters indicate genetic dependency. To evaluate genetic quality, use Step 3 (Quartiles) or Step 6 (Indexes)."
      },
      {
        question: "How do I identify over-used bulls?",
        answer: "Watch the '%' column. If a bull represents >20% of the herd, there's future inbreeding risk (matings between relatives). Consider diversifying genetics: reduce use of that bull, introduce new bulls with similar profile."
      },
      {
        question: "What does 'trait: N/A' mean in the bull's row?",
        answer: "The bull has no registered value for the selected trait filter (e.g., hhp_dollar). Causes: domestic bull without genetic evaluation, incorrect NAAB code, or trait not available in the database."
      },
      {
        question: "Why does 'Total daughters' vary between the Sire and MGS tabs?",
        answer: "This is expected. A bull can be the direct sire of 50 animals (appears in Sire) but maternal grandsire of 20 (appears in MGS). These are independent counts. Add both to see total genetic influence."
      },
      {
        question: "How do the 'Start Year' and 'End Year' filters affect the ranking?",
        answer: "They filter only daughters born in that period. Example: Year 2020-2025 shows only bulls that had daughters born in those years. Use to analyze: recent bulls (last 2 years) vs complete history (last 10 years)."
      },
      {
        question: "What is the 'Segment' filter (Calf, Heifer, Primiparous)?",
        answer: "Filters daughters by age category. Example: 'Heifer' segment shows which bulls have more heifer daughters. Useful to evaluate: which bulls generated more replacement animals (Heifers/Primiparous) vs multiparous in production."
      },
      {
        question: "How does the 'Index for RPC' field work?",
        answer: "Defines which trait (e.g., hhp_dollar, tpi) will be displayed in the 'trait' column. It's informational only (doesn't affect ranking, which is always by number of daughters). Use to see average trait value of each bull's daughters."
      },
      {
        question: "How do I use this ranking to select next bulls?",
        answer: "Identify which bulls produced the best daughters (cross-reference with Step 3 or Segmentation). Look for similar bulls (same genetic line or similar PTAs) to maintain consistency. Avoid bulls that already dominate >15% of the herd (inbreeding risk)."
      },
      {
        question: "How do I compare performance between domestic and imported bulls?",
        answer: "Use the 'trait' column (daughter average). Compare bulls with >20 daughters (robust sample). If imported bulls have an average 100+ points higher, the ROI of imported semen is justified. If difference <50 points, consider domestic (cost-benefit)."
      },
      {
        question: "Does the system suggest actions based on top parents?",
        answer: "Yes (automatic alerts in development). Examples: 1) Bull >25% of herd -> 'Inbreeding risk, diversify'. 2) Top 3 bulls >60% of total -> 'Critical genetic dependency'. 3) Bull with many daughters but low 'trait' -> 'Consider replacement'."
      },
      {
        question: "Why do some bulls appear without names (only NAAB code)?",
        answer: "Bull name is not registered in the database. The system displays only the NAAB code. To fix: import complete bull data (name, PTAs) via the 'Bulls' module or update the bull database."
      },
      {
        question: "How do I export the top parents ranking?",
        answer: "Click 'Export Top Parents' (button in the upper right corner of the card). Generates CSV with complete ranking, frequencies, and 'trait' average. Useful for technical presentations or sharing with the team."
      },
      {
        question: "Can I see which specific daughters belong to each bull?",
        answer: "Not directly in Step 2. Go to the 'Herd' module, filter by Sire (bull code), export the list. Or click on the bull name (if link is implemented) to see daughter details."
      }
    ],
    resources: [
      {
        title: "Guide: Top Parents Analysis",
        description: "Identify key bulls and diversify",
        type: "Guide"
      }
    ],
    hints: {
      frequency: "Watch for bulls >20% of the herd (inbreeding risk)",
      diversity: "Top 3 bulls should not exceed 50% of the herd",
      quality: "Cross-reference with Step 3 to see genetic quality of daughters"
    }
  },

  // Audit Step 3: Quartiles Overview
  "auditoria-step3": {
    faq: [
      {
        question: "How does the system define the Top 25% and Bottom 25% quartiles exactly?",
        answer: "For each PTA, the system sorts all animals in descending order (best first). The Top 25% are the first N/4 animals (rounded). The Bottom 25% are the N/4 animals with lowest values. If N=100, each quartile has 25 animals."
      },
      {
        question: "Why do some PTAs show Top 25% and Bottom 25% very close together?",
        answer: "Indicates low genetic variability for that trait in the herd. All animals are similar. May mean: very uniform selection, few bulls used, or trait not historically prioritized."
      },
      {
        question: "What does it mean when Top 25% has a negative value?",
        answer: "Even the best animals in the herd are below the population base (0). Indicates urgent need to introduce superior genetics for that trait (e.g., high SCS or low DPR)."
      },
      {
        question: "How do I interpret the difference between Top and Bottom?",
        answer: "Large difference (>2x standard deviation) = good variability for selection. Small (<1 SD) = uniform herd, difficult to progress with internal selection alone. Use the difference to prioritize which PTAs have the greatest potential for genetic gain."
      },
      {
        question: "How do I choose which PTAs to analyze in Step 3?",
        answer: "Start with economic traits (HHP$, NM$, TPI) for a macro view. Then expand to known bottlenecks (e.g., high SCS, low DPR). Use 'Select all' only for initial exploration, then focus on 5-8 priority PTAs."
      },
      {
        question: "Can I export the PTA selection as a preset?",
        answer: "Not directly in Step 3. After defining which PTAs are priorities here, note them and use in subsequent Steps (4, 5, 6, 7) to maintain analytical consistency throughout the audit."
      },
      {
        question: "What should I do when the calculation takes too long?",
        answer: "Reduce the number of selected PTAs. Processing 50+ PTAs in large herds (>2000 animals) can take 10-15 seconds. Select smaller groups (5-10 PTAs) and process in separate batches."
      },
      {
        question: "How do I identify improvement priorities using Step 3?",
        answer: "Sort traits by: 1) Economic impact (HHP$, PTAM, CFP), 2) Distance from Top 25% to goal, 3) Top-Bottom difference (how much to gain by selecting). PTAs with negative Top 25% or very distant from benchmark are top priority."
      },
      {
        question: "What's the relationship between audit steps and Segmentation?",
        answer: "Step 3 shows **what to improve** (deficient traits). Segmentation shows **who to improve** (superior/inferior animals). Use insights from here to adjust weights in Segmentation: increase weight of PTAs where Top 25% is far from the goal."
      },
      {
        question: "How do I use quartiles for culling decisions?",
        answer: "Animals in the Bottom 25% of critical PTAs (SCS, DPR, and other fertility traits) are priority culling candidates. Export this list, cross-reference with age/production for final decision. Avoid culling young animals without a chance to improve."
      },
      {
        question: "Why do some PTAs appear as '--' (no data)?",
        answer: "No animal in the herd has a value for that PTA. Common causes: data not imported, incomplete genotype/pedigree, or PTA not relevant for the breed (e.g., beef PTAs in a dairy herd)."
      },
      {
        question: "The total N varies between PTAs. Why?",
        answer: "Not all animals have all PTAs. Heifers without genotype may have fewer PTAs than cows with complete pedigree. Linear PTAs (STA, STR, UDC) require physical classification. Focus analysis on PTAs with N >100 for reliability."
      },
      {
        question: "How do I compare quartiles between farms?",
        answer: "Not directly in Step 3. Export data from each farm to CSV, compare externally. Or use Step 8 (Benchmark) to compare herd Top% with global average. Step 3 is internal analysis, not comparative."
      },
      {
        question: "Can I filter quartiles for heifers or primiparous only?",
        answer: "Not at this time. If this is a need, submit it in the suggestion box. Currently the calculation considers all herd animals."
      },
      {
        question: "How do I save quartile analysis for month-to-month comparison?",
        answer: "Click 'Export' in the upper right corner of the card. Save the PDF/XLSX with date in the name (e.g., Quartiles_Jan2025.pdf). Compare old versions to see evolution. Improving quartiles = effective selection."
      },
      {
        question: "How do I identify trade-offs between traits?",
        answer: "Compare quartiles of related PTAs. Example: If Top 25% of PTAM is high but Top 25% of CFP is low, there's a production vs fertility trade-off. Use to review selection strategy and balance objectives in the Genetic Plan."
      },
      {
        question: "What should I do when Top 25% is very far from the sector benchmark?",
        answer: "Indicates a large genetic gap vs market. Actions: 1) Introduce external genetics (elite semen/embryos), 2) Review genetic suppliers, 3) Adjust Plan goals (make more ambitious), 4) Evaluate ROI of genomics investment."
      },
      {
        question: "How do I use Step 3 to validate AI strategy?",
        answer: "Compare quartiles before/after changing bulls. If after 2 years using bull A, the Top 25% of heifers improved, the choice was good. If it worsened or stagnated, review bull selection (use Step 2 to identify which bulls to use/avoid)."
      },
      {
        question: "Can I create automatic alerts based on quartiles?",
        answer: "Not natively. Request the developer to create custom rules. Examples: alert if Top 25% DPR <0, or if Top-Bottom SCS difference <0.5 (low variability). Useful for proactive monitoring."
      }
    ],
    resources: [
      {
        title: "Basic Statistics: Quartiles and Percentiles",
        description: "Fundamentals of quartile analysis",
        type: "Guide"
      }
    ],
    hints: {
      selection: "Start with 5-8 economic PTAs, not all",
      interpretation: "Large Top-Bottom difference = high selection potential",
      export: "Save with date (Quartiles_Jan2025.pdf) for monthly comparison"
    }
  },

  // Audit Step 4: Genetic Progression
  "auditoria-step4": {
    faq: [
      {
        question: "What does 'Genetic Progression' mean in practice?",
        answer: "It's the genetic gain (or loss) across birth years. The chart shows whether younger animals are genetically superior to older ones. Positive trend = breeding program working. Negative = red alert of regression."
      },
      {
        question: "Why do we use birth year and not current age?",
        answer: "Birth year represents the genetics transmitted at that time (bulls used, dam quality). Current age changes daily. Analysis by birth year allows you to see the evolution of reproductive strategy over time."
      },
      {
        question: "What is the 'trend line'?",
        answer: "A linear regression that smooths annual fluctuations, showing overall direction. Positive slope = average genetic gain per year. Negative = regression. The '/year' value indicates how many PTA points you gain (or lose) annually."
      },
      {
        question: "What does R-squared mean in the trend chart?",
        answer: "Measures how well the trend line explains the data (0 to 1). R-squared=0.9 = 90% of variation is explained by the linear trend (consistent progression). R-squared<0.3 = lots of fluctuation, weak trend. Focus on PTAs with R-squared>0.5 for strategic decisions."
      },
      {
        question: "How do I interpret years with peaks or 'valleys' in the chart?",
        answer: "Peak = exceptional year (elite bull used, superior donor crop) or extreme trait focus. Valley = problematic year (poor bull, reproductive issues, few births). Investigate causes: review AI records, bulls used, management events that year."
      },
      {
        question: "Why does the annual average fluctuate so much between years?",
        answer: "Natural fluctuations reflect: sample size (years with few births vary more), specific bulls dominating that year, or concentrated embryo crops. Use the trend (line) to see overall pattern, ignore fluctuations in years with N<20."
      },
      {
        question: "What should I do when the trend is negative?",
        answer: "Critical alert! Means genetic regression. Causes: low-quality bulls, wrong matings, focus on non-genetic traits. ACTION: review bull selection, adjust goal plan, evaluate semen suppliers."
      },
      {
        question: "How do I use progression to predict future genetics?",
        answer: "Extrapolate the trend line. If gain is +50 HHP$/year and trend is linear, in 3 years you'll gain +150 HHP$ in heifer average. Use to calculate time needed to reach Genetic Plan goals. Consider R-squared: low = less reliable prediction."
      },
      {
        question: "What is the 'Farm Overall Average' (dashed orange line)?",
        answer: "Weighted average of all females in the herd (all years). Serves as reference: years above the line = better than historical average. Below = worse. Useful to see how many crop years have already surpassed the overall average."
      },
      {
        question: "Why should I show/hide the overall average?",
        answer: "Show to see which years already surpassed the farm standard (focus on how many recent years are above). Hide when you want to focus only on annual gain trend (slope), without absolute reference. Makes visualization easier in charts with many years."
      },
      {
        question: "Can I compare progression of multiple PTAs side by side?",
        answer: "Yes, but not simultaneously in 1 chart. Select 2-4 priority PTAs, scroll vertically to compare. PTAs with diverging trends (one rising, another falling) indicate trade-off: you gain in one but lose in another. Review custom index weights."
      },
      {
        question: "How do I handle years without data (gaps in the chart)?",
        answer: "System skips years without births. Causes: import issue (empty/incorrect birth date), or genuinely no births (crisis, disease). Review raw data in the Herd tab. Gaps harm trend calculation, fix if possible."
      },
      {
        question: "Why do some years have very low N (<10)?",
        answer: "Few births or many missing data (empty PTAs). Years with N<10 are unstable (1 exceptional animal distorts the average). Use category or year filter at the top of the Audit to focus analysis on robust years (N>20)."
      },
      {
        question: "Can I filter only heifers born after 2020?",
        answer: "Yes. Use the 'Birth Year' filter at the top of the Audit page. Select the desired range. All steps (1 to 7) respect this filter. Useful for analyzing 'new genetics' isolated from older animals."
      },
      {
        question: "How do I export the progression for presenting to the technician?",
        answer: "Each chart has an 'Export' button (upper right corner). Generates PDF with chart, data table, and statistics (trend, R-squared). Or use 'Export Complete Audit' at the end for a consolidated report of all steps."
      },
      {
        question: "How do I identify the effect of changing bulls in the chart?",
        answer: "Look for sharp changes in slope (before/after introducing a new bull). If you introduced bull A in 2020 and from 2021 the trend accelerated, the bull is working. If the slope decreased, review the choice."
      },
      {
        question: "What does it mean when R-squared is very low (<0.3) but there are large fluctuations?",
        answer: "Indicates high variability without a clear pattern. Causes: frequent changes in AI strategy, semen supplier inconsistency, or strong environmental effects (nutrition, management). Stabilize the strategy to create a consistent trend."
      },
      {
        question: "How do I use progression to justify investment in genomics?",
        answer: "Show that the current trend (e.g., +30 HHP$/year) is insufficient to reach goals in the desired timeframe. With genomics (donor selection + embryos), you can accelerate to +80 HHP$/year. Calculate ROI: time saved x value per HHP$ point."
      },
      {
        question: "Can I compare progression between farms?",
        answer: "Not directly in Step 4. Export charts from each farm as PDF, compare visually (trend slopes). Farms with steeper slope = faster genetic gain. Use for internal benchmark between properties."
      },
      {
        question: "How do I detect a genetic 'plateau' (stagnant gain)?",
        answer: "When R-squared is high (>0.7) but slope is near zero. Means genetics aren't improving over time. Causes: reached the limit of current strategy, bulls of similar quality to herd animals. Solution: introduce elite external genetics."
      },
      {
        question: "What should I do when progression is positive but overall average is falling?",
        answer: "Possible data error or selective culling effect. If you're culling animals from specific categories (e.g., old multiparous), the overall average may temporarily fall. Check filters and imported data consistency."
      },
      {
        question: "How do I use Step 4 to validate embryo vs conventional AI impact?",
        answer: "Mark years when embryos were used intensively. If the average of those years is significantly higher (+200 HHP$), the embryo investment is justified. If difference is small (<50 HHP$), review strategy or embryo suppliers."
      },
      {
        question: "Can I create annual genetic gain goals based on progression?",
        answer: "Yes. Use current slope as baseline (e.g., +40 HHP$/year). Set ambitious but realistic goal (e.g., +60 HHP$/year). Adjust AI strategy (better bulls, more embryos) to achieve it. Monitor in coming years if the new slope is reaching the goal."
      },
      {
        question: "How do I interpret progression when there's a breed change (e.g., introduction of crossbreeding)?",
        answer: "PTAs from different breeds aren't directly comparable. Filter only main breed animals (pure Holstein) or create separate analyses by breed. Crossbreeds (Holstein x Jersey) can distort the trend if mixed."
      },
      {
        question: "Does the system calculate confidence intervals for the trend?",
        answer: "Not natively. The trend line is a simple linear regression. For confidence intervals, export data to CSV and use statistical tools (R, Python) to calculate 95% CI. Useful for high-risk decisions (large investments)."
      }
    ],
    resources: [
      {
        title: "Video: Understanding R-squared and Trends",
        description: "Linear regression interpretation",
        type: "Video"
      }
    ],
    hints: {
      trend: "Focus on PTAs with R-squared>0.5 (reliable trend)",
      extrapolation: "Use slope to predict time to goal",
      alert: "Negative trend = critical regression alert"
    }
  },

  // Audit Step 5: Category Comparison
  "auditoria-step5": {
    faq: [
      {
        question: "What does this step do differently from Step 4 (Genetic Progression)?",
        answer: "Step 4 = evolution over time (years). Step 5 = comparison **between age categories** (Heifers vs Primiparous vs Multiparous) at a **point in time** (current herd). Use Step 5 to see differences between generations now."
      },
      {
        question: "How does the system detect categories automatically?",
        answer: "It looks for columns with typical names (Category, category, age_group) and validates if they contain known values (Calf, Heifer, Primiparous...). If not found, tries to calculate from the 'Parity' column. If that fails, looks in localStorage (cache) from previous sessions."
      },
      {
        question: "What is the 'Radar' chart and how do I interpret it?",
        answer: "A radar (spider) chart showing multiple PTAs simultaneously on radial axes. Larger area = superior group. Compare the 2 polygons: traits where one group excels appear as 'spikes' in the radar. Useful for seeing genetic profiles visually."
      },
      {
        question: "Why are radar values normalized (0-100)?",
        answer: "PTAs have different scales (HHP$ in hundreds, SCS in units). Normalization transforms everything to 0-100 based on min and max values in the 2 groups. 100 = best of the two groups. 0 = worst. Allows fair visual comparison."
      },
      {
        question: "How do I choose which 2 groups to compare?",
        answer: "Depends on objective: 1) **Heifers vs Primiparous**: see first calving impact. 2) **Primiparous vs Multiparous**: evaluate genetic longevity. 3) **Heifers vs Multiparous**: measure generational gain (largest expected difference). Avoid comparing Calves (incomplete data)."
      },
      {
        question: "Can I compare 3 or more groups simultaneously?",
        answer: "No. Step 5 supports only 2 groups. To compare 3+, make multiple 2-by-2 comparisons (e.g., A vs B, A vs C, B vs C). Or use Step 3 (Quartiles) to see all categories together in tabular format."
      },
      {
        question: "How do I filter groups by other characteristics (origin, farm)?",
        answer: "Not directly here. Use general Audit filters (top of page) before accessing Step 5. Or export raw data and filter externally. Step 5 works with pre-defined age categories."
      },
      {
        question: "Which traits should I include in the table vs the radar?",
        answer: "**Table:** 5-8 priority traits (HHP$, TPI, NM$, PTAM, CFP, SCS, DPR). **Radar:** 8-12 traits (add important linears: PTAT, UDC, PL). Table for precise numbers, radar for visual pattern. Too many traits (>15) clutters the radar."
      },
      {
        question: "Why do some PTAs appear as zero in the radar?",
        answer: "No animal in either group has a value for that PTA. Automatically removed from radar to avoid distortion. Check if genotype/pedigree data is complete. Linear PTAs require physical classification."
      },
      {
        question: "How do I save the PTA configuration for reuse?",
        answer: "Currently no preset available. Note the selected PTAs or export the configuration as PDF ('Export' button). In the next session, reselect manually. Or use a browser with form auto-fill to speed up."
      },
      {
        question: "How do I use the comparison for selection decisions?",
        answer: "If Heifers surpass Primiparous in key traits (HHP$, TPI), continue current strategy (good bulls). If Primiparous are better, investigate: recent bulls worse? AI problem? Adjust immediately before deteriorating more generations."
      },
      {
        question: "What does it mean when raw values are very different from normalized?",
        answer: "Normalization (0-100) is relative to the 2 groups. If Group A has HHP$ +500 and B +1000, A may appear as 0 and B as 100, but both are positive. Always check raw values (tooltip or table) for real decisions."
      },
      {
        question: "How do I identify genetic trade-offs in the radar?",
        answer: "Look for traits where groups reverse: Group A better in production (high PTAM), Group B better in health (low SCS). Indicates conflicting selection history. Use to adjust future strategy: balance with custom index in Segmentation."
      },
      {
        question: "How do I interpret when Heifers are worse than Multiparous?",
        answer: "Critical alert! Indicates recent genetic regression (poor bulls, low-quality embryos, or wrong matings). Review immediately: Step 2 (which bulls are being used), Step 4 (progression trend), and adjust AI strategy."
      },
      {
        question: "Can I compare the same category between different birth years?",
        answer: "Not directly in Step 5 (compares age categories). Use Step 4 (Progression) to compare years. Or filter the herd by birth year (top of Audit) and compare Heifers from 2020 vs Heifers from 2023 in two separate sessions."
      },
      {
        question: "How do I use Step 5 to evaluate embryo program impact?",
        answer: "If embryos were used intensively in Heifers (and not in Multiparous), compare the two groups. Heifers with HHP$ 200+ points higher = program worked. If difference <100 points, review suppliers or embryo donors."
      },
      {
        question: "What should I do when the radar shows very similar profiles?",
        answer: "Indicates genetics between generations is uniform (little evolution). Causes: very similar bulls over the years, or herd has reached a genetic 'plateau'. Solution: introduce elite external genetics to renew variability."
      },
      {
        question: "How do I export the comparison to share with a technician?",
        answer: "Click 'Export' in the upper right corner. Generates PDF with radar, table, and statistics. Include notes about insights (e.g., 'Heifers superior in DPR, maintain current strategy'). Useful for technical meetings."
      },
      {
        question: "Can I create automatic alerts based on the comparison?",
        answer: "Not natively. Request the developer to create rules. Examples: alert if Heifers have HHP$ 50+ points lower than Multiparous (regression), or if difference between groups is <10 points (stagnation). Useful for continuous monitoring."
      },
      {
        question: "How do I use Step 5 for selective culling decisions?",
        answer: "If Multiparous have much inferior genetics to Heifers (gap >300 HHP$), prioritize culling old Multiparous (>5 calvings) even with reasonable production. Free space for genetically superior Heifers (higher future return)."
      },
      {
        question: "Does the system consider environmental effects in the comparison?",
        answer: "No. The comparison is **pure genetics** (PTAs), not observed production. Environmental effects (nutrition, management) are not considered. If you want to compare actual production (milk, fat), use the 'Herd' module with category filters."
      },
      {
        question: "How do I validate if the comparison is correct?",
        answer: "Cross-reference with Step 3 (Quartiles). If Heifers have higher Top 25% HHP$ than Multiparous, this should appear in Step 5 (Heifers superior on radar). If there's inconsistency, review data (possible import or filter issue)."
      }
    ],
    resources: [
      {
        title: "Guide: Category Comparison",
        description: "Heifers vs Cows: what to analyze",
        type: "Guide"
      }
    ],
    hints: {
      groups: "Heifers vs Multiparous = largest expected difference (generational gain)",
      radar: "Larger area = superior group in those PTAs",
      normalization: "Always check raw values for real decisions"
    }
  },

  // Audit Step 6: Index Quartiles
  "auditoria-step6": {
    faq: [
      {
        question: "What's the difference between Step 3 (Quartiles Overview) and Step 6 (Index Quartiles)?",
        answer: "Step 3 = quartiles of individual PTAs (one at a time). Step 6 = quartiles based on economic indexes (HHP$, TPI, NM$, FM$, CM$) showing how the TOP 25% of that index differ in underlying PTAs. Step 6 answers: 'If I select animals by TPI, how do other PTAs look?'"
      },
      {
        question: "What are 'Index A' and 'Index B'?",
        answer: "Two economic indexes chosen for comparison. Example: Index A = HHP$ (profit), Index B = TPI (pure genetics). The system classifies animals by each index separately and shows how the Top 25% of each differ. Useful for seeing trade-offs between objectives."
      },
      {
        question: "How do I choose which indexes to compare?",
        answer: "Depends on strategy: **HHP$ vs NM$**: overall profit vs net merit. **TPI vs FM$**: elite genetics vs fat focus. **CM$ vs HHP$**: cheese market vs net profit. Start with HHP$ (always) and compare with your secondary objective."
      },
      {
        question: "What does the 'Difference' row in the table mean?",
        answer: "Shows the difference between Top 25% of Index A and Top 25% of Index B for each PTA. Positive values = Index A superior in that PTA. Negative = Index B superior. Useful for seeing **exactly where** the two indexes diverge."
      },
      {
        question: "How do I interpret positive vs negative values in the Difference row?",
        answer: "Positive (green) = Top 25% of Index A has higher average in that PTA. Example: Difference PTAM = +500 -> top HHP$ animals produce 500 lbs more than top TPI. Negative = Index B is superior. Magnitude indicates trade-off importance."
      },
      {
        question: "What's the practical meaning of the Top25 vs Bottom25 difference?",
        answer: "Magnitude of internal genetic gap. Large difference (e.g., HHP$ Top25=+800, Bottom25=-200) = enormous potential for gain by selecting internally. Small = low variability, need to introduce external genetics (semen/embryos)."
      },
      {
        question: "Why do some indexes have near-zero difference?",
        answer: "Both indexes (A and B) weight that PTA similarly, so the Top 25% of each are genetically similar. Example: SCS generally has similar weight in HHP$ and NM$, so the difference is small. Focus on PTAs with difference >100 for strategic insights."
      },
      {
        question: "How do I use the table to choose which index to follow?",
        answer: "Identify which index has Top 25% more aligned with your actual goals. If you prioritize milk production (PTAM), choose the index where Difference in PTAM is positive. If you prioritize health (low SCS, high DPR), choose the index that scores better in those PTAs."
      },
      {
        question: "Can I compare custom indexes (created in Segmentation)?",
        answer: "Not directly. Step 6 only supports standard economic indexes (HHP$, TPI, NM$, FM$, CM$). To evaluate a custom index, use Segmentation (Superior/Intermediate/Inferior classification) then go to Step 3 to see individual PTA quartiles."
      },
      {
        question: "Why does the 'Update' button exist if the table loads automatically?",
        answer: "Auto-loading occurs when entering the step. Use 'Update' when: changing general filters (year, category), or after importing new data. Forces quartile recalculation. Useful during long sessions to ensure fresh data."
      },
      {
        question: "How do I export just the 'Difference' row for analysis?",
        answer: "Click 'Export' in the upper right corner. Generates XLSX with 3 tabs: IndexA, IndexB, Difference. Open the Difference tab in Excel, filter/sort by magnitude. Or copy directly from the table (Ctrl+C) to paste into an external spreadsheet."
      },
      {
        question: "How do I use Step 6 to decide between HHP$ and TPI?",
        answer: "Compare the Difference rows. If HHP$ has Top 25% much higher in PTAM (+500) but lower in PTAT (-50), and you prioritize production, follow HHP$. If you prioritize conformation/longevity, follow TPI. There's no 'right' or 'wrong', it depends on your market strategy."
      },
      {
        question: "What should I do when the Top 25% of both indexes are very similar?",
        answer: "Indicates both indexes select similar animals. In that case, choose the simpler index to use or more market-recognized (e.g., TPI is industry standard). Or create a custom index in Segmentation with weights adjusted to your priorities."
      },
      {
        question: "How do I identify 'conflicting' traits between indexes?",
        answer: "Look for PTAs where the difference is large and negative. Example: HHP$ prioritizes production (+300 PTAM) but sacrifices fertility (-100 DPR). If fertility is critical for you, adjust strategy: use NM$ (more balanced) or create a custom index."
      },
      {
        question: "Can I use Step 6 to validate genetic supplier indexes?",
        answer: "Yes. If a supplier uses a proprietary index (e.g., 'Happy Farm Index'), compare their 'Top'-classified animals vs Top 25% of HHP$. If there's large divergence (>200 points), question the supplier's methodology."
      },
      {
        question: "What should I do when Top25 of Index A has very different N from Index B?",
        answer: "This shouldn't happen (both are always 25% of total herd). If it occurs, indicates a bug or inconsistent data. Check if the index column is filled for all animals. Report the issue with a screenshot to support."
      },
      {
        question: "Can I add more indexes beyond the 5 standard ones (HHP$, TPI, NM$, FM$, CM$)?",
        answer: "Not without modifying the code. If you use a proprietary index (e.g., ABS Genomic Index, Gir Dairy Index), request the developer to add it to the INDEX_OPTIONS list. The system is extensible but requires a technical update."
      },
      {
        question: "How do I use Step 6 for embryo purchase decisions?",
        answer: "Compare the index used by the embryo center (e.g., TPI) with HHP$. If the difference in key PTAs (PTAM, CFP) is >200 points, negotiate price or find a supplier whose index is more aligned with HHP$ (your economic objective)."
      },
      {
        question: "Does the system consider sex selection (sexed semen) in the analysis?",
        answer: "No. Step 6 analyzes pure genetics (PTAs) only, not AI strategy. To simulate sexed semen impact, use the 'Genetic Plan' module (Replacement Calculator) which allows defining % sexed by category."
      },
      {
        question: "How do I create an alert if the index difference exceeds a threshold?",
        answer: "Not natively. Request the developer to create a custom rule. Example: alert if Difference in DPR between HHP$ and NM$ >100 (excessive fertility sacrifice). Useful for periodic strategy review."
      }
    ],
    resources: [
      {
        title: "Documentation: Economic Indexes (HHP$, TPI, NM$)",
        description: "What each index prioritizes",
        type: "Guide"
      }
    ],
    hints: {
      comparison: "Always start with HHP$ vs your secondary objective",
      difference: "Focus on PTAs with difference >100 (significant trade-offs)",
      strategy: "Choose the index aligned with your market goals"
    }
  },

  // Audit Step 7: PTA Distribution
  "auditoria-step7": {
    faq: [
      {
        question: "What are 'bins' and how do they affect the histogram?",
        answer: "Bins are intervals (ranges) that group values. The system uses fixed bins. Example: if HHP$ ranges from 0 to 1000, each bin groups 50 points (0-50, 50-100...). More bins = more detail but smaller bars. 20 is the ideal balance for visualization."
      },
      {
        question: "Why use distribution instead of a simple average?",
        answer: "Average hides variability. Example: Average HHP$ = 400, but distribution shows 2 peaks (one at 200, another at 600 = bimodal herd). Distribution reveals: asymmetry, outliers, multiple subpopulations. Essential for selection and mating decisions."
      },
      {
        question: "How do I interpret 'normal' vs 'skewed' histograms?",
        answer: "**Normal** (bell): Most animals near the mean, few at extremes. Indicates good homogeneity. **Skewed** (long tail): Many animals at one extreme, few at the other. Example: SCS with right tail = some animals with chronic mastitis. Identify and cull the outliers."
      },
      {
        question: "What is a 'bimodal' distribution and what does it mean?",
        answer: "Two distinct peaks in the histogram. Indicates two subpopulations. Common causes: breed mix (pure Holstein + crossbred), two AI strategies (elite bull + cheap bull), or recent introduction of external genetics. Investigate causes to direct selection."
      },
      {
        question: "How do I identify outliers in the histogram?",
        answer: "Look for isolated bars at the extremes (far from the main peak). Example: HHP$ with majority at 300-500, but 5 animals at 1000+. These are outliers (potential donors) or data errors. Validate with individual table before decisions."
      },
      {
        question: "What should I do with animals in the lower tail (worst 5%)?",
        answer: "Priority culling candidates. Cross-reference with: age (old with low genetics = immediate cull), health issues (high SCS, mastitis), low production. Avoid culling heifers (haven't proven their potential yet). Export the list for detailed analysis."
      },
      {
        question: "How do I use distribution to define gates in Segmentation?",
        answer: "See where the 'natural cuts' are. Example: HHP$ with valley at 400 -> use 400 as gate between Superior and Intermediate. Distribution shows whether chosen gates make statistical sense or are arbitrary. Adjust gates to coincide with histogram valleys."
      },
      {
        question: "Why do some histograms have peaks at zero?",
        answer: "Many animals with PTA exactly zero. Causes: 1) Population base (PTA=0 by definition), 2) Animals without genotype/pedigree (system assigns 0), 3) PTA irrelevant for the herd. If >30% is at zero, investigate data quality."
      },
      {
        question: "How do I compare distributions between farms?",
        answer: "Export histograms from each farm (PDF), place side by side. Compare: peak position (is farm A's average higher?), amplitude (does farm B have more variability?), skewness. Or use external tools (R, Excel) to overlay histograms."
      },
      {
        question: "Can I save the PTA selection for reuse?",
        answer: "System always starts at HHP$. Reselect manually each session. Or note priority PTAs (e.g., HHP$, TPI, PTAM, SCS, DPR) and mark them quickly. Consider creating a personal checklist to speed up."
      },
      {
        question: "How do I interpret different total N between PTAs?",
        answer: "Normal. Not all animals have all PTAs. Heifers without genotype = fewer PTAs. Linear PTAs require classification. Focus analysis on PTAs with N >100 (robust sample). N <50 = unstable distribution, interpret with caution."
      },
      {
        question: "How do I detect embryo program effect in the distribution?",
        answer: "If embryos were used intensively in recent years, filter the herd by birth year (e.g., 2022-2024). Compare HHP$ distribution of those animals vs the whole herd. If there's a peak to the right (high-value animals), the program worked."
      },
      {
        question: "What does it mean when the distribution has a 'long tail' to the right?",
        answer: "Few animals of very high genetic value (positive outliers). Causes: elite embryos, top genomic bulls, or external genetics introduction. ACTION: identify these animals (Step 3, Top 25%), use as donors, multiply genetics."
      },
      {
        question: "How do I use distribution to estimate selective culling impact?",
        answer: "Mentally remove the lower tail (5-10% worst). Recalculate the average with remaining only. Example: current average HHP$ = 400, removing 10% worst -> average rises to 450. Estimated gain = +50 HHP$/animal from culling alone."
      },
      {
        question: "Can I create selection groups based on distribution valleys?",
        answer: "Yes. If distribution shows valleys at 350 and 650 HHP$, create 3 groups: <350 (cull), 350-650 (maintain), >650 (elite multiplication). Use these values as gates in Segmentation for automation."
      },
      {
        question: "How do I interpret very flat (platykurtic) distributions?",
        answer: "Animals spread uniformly across a wide range of values (low concentration). Indicates high internal genetic variability. ADVANTAGE: great potential for gain through selection. DISADVANTAGE: non-uniform herd, harder to standardize management."
      },
      {
        question: "What should I do when the distribution has multiple peaks (multimodal)?",
        answer: "Each peak represents a distinct subpopulation. Investigate causes: specific bulls (Step 2), age categories (Step 5), or different origins (genomic vs pedigree). Decide: maintain diversity (multiple peaks) or unify (focus on 1 peak)?"
      },
      {
        question: "Why do some histograms appear 'empty' (few bars)?",
        answer: "Few animals with that PTA, or values very concentrated. If N <30, the histogram is not representative. Increase sample (remove category/year filters) or focus on PTAs with more complete data."
      }
    ],
    resources: [
      {
        title: "Descriptive Statistics: Distributions",
        description: "Normal, skewed, bimodal",
        type: "Guide"
      }
    ],
    hints: {
      outliers: "Isolated bars at extremes = potential donors or errors",
      gates: "Use distribution valleys to define gates in Segmentation",
      bimodal: "Two peaks = two subpopulations (investigate causes)"
    }
  },

  // Nexus 1 - Genomic Prediction
  "nexus1-genomic": {
    faq: [
      {
        question: "What files does Nexus 1 accept?",
        answer: "Import CSV or XLSX spreadsheets with minimum columns: Animal ID, Genotype ID, Collection Date, and already-evaluated PTAs. The system performs automatic validation and flags missing columns."
      },
      {
        question: "Can I mix genotyped and non-genotyped females?",
        answer: "Yes. Females without genotype will be calculated using standard regressions. Genotyped ones receive adjustments from the imported file and the CDCB database."
      },
      {
        question: "How do I interpret the reliability index?",
        answer: "Reliability (REL%) indicates prediction confidence. Values above 70% represent robust estimates; below that, consider supplementing with pedigree or production data."
      },
      {
        question: "Can I export Nexus 1 results?",
        answer: "Use the export button to download an XLSX with all projected PTAs, reliability, and expected gains per generation."
      },
      {
        question: "How do I integrate with the Genetic Plan?",
        answer: "After generating predictions, use the 'Send to Plan' button to automatically sync with Genetic Projection and the Replacement Calculator."
      }
    ],
    resources: [
      {
        title: "Guide: Complete Genomic Prediction",
        description: "File setup, model execution, and PTA interpretation",
        type: "Guide"
      },
      {
        title: "Video: Nexus 1 Workflow",
        description: "Import, processing, and export in 10 minutes",
        type: "Video"
      },
      {
        title: "Validation Checklist",
        description: "Required items before running Nexus 1",
        type: "Guide"
      }
    ],
    hints: {
      upload: "Import the genomic file with official CDCB or Interbull headers",
      validation: "Review the validation panel to fix missing or duplicate IDs",
      refresh: "Use 'Update Predictions' to recalculate after data corrections",
      export: "Export results to XLSX and share with the technical team",
      integration: "Send the batch to the Genetic Plan to simulate matings",
      filters: "Filter by genotyping status to prioritize analyses"
    }
  },

  // Nexus 2 - Pedigree Prediction (individual)
  "nexus2-pedigree": {
    faq: [
      {
        question: "What data is needed?",
        answer: "Enter the NAAB code for the sire, maternal grandsire, and maternal great-grandsire. Optional fields include parent PTAs to reinforce the regression."
      },
      {
        question: "How does pedigree regression work?",
        answer: "We apply specific weights for each ancestor (sire 50%, MGS 25%, MMGS 12.5%) and adjust by base average. The result is displayed as estimated PTA."
      },
      {
        question: "Can I save different scenarios?",
        answer: "Yes. Use 'Save Scenario' to store pedigree combinations and compare later in Nexus 2 reports."
      },
      {
        question: "Is there NAAB validation?",
        answer: "When typing the code, we automatically validate against the registered bull database. Invalid codes are flagged in red."
      },
      {
        question: "How do I send results to the herd?",
        answer: "After calculating, click 'Send to Herd' to update the females with the projected PTAs in the database."
      }
    ],
    resources: [
      {
        title: "Guide: Nexus 2 Step by Step",
        description: "Pedigree entry, validations, and exports",
        type: "Guide"
      },
      {
        title: "Video: Pedigree Regression in Practice",
        description: "Complete demonstration with a real example",
        type: "Video"
      },
      {
        title: "Parentage Weight Table",
        description: "Learn the coefficients used for each ancestor",
        type: "Guide"
      }
    ],
    hints: {
      sire: "Enter the sire's NAAB code. Press Enter to validate",
      mgs: "Enter the maternal grandsire's NAAB to improve accuracy",
      mmgs: "Complete with the maternal great-grandsire when available",
      calculate: "Click 'Calculate PTA' to generate estimates immediately",
      save: "Save frequent scenarios and reuse them from the side list",
      send: "Send approved results directly to the herd"
    }
  },

  // Nexus 2 - Batch Processing
  "nexus2-batch": {
    faq: [
      {
        question: "What is the batch file format?",
        answer: "Use CSV or XLSX with headers: female_id, sire_naab, mgs_naab, mmgs_naab, and optionally observed PTAs. We provide a ready-made template for download."
      },
      {
        question: "What is the record limit per file?",
        answer: "We recommend up to 5,000 rows per import to keep processing fast. Larger files can be split."
      },
      {
        question: "How do I monitor processing?",
        answer: "The status panel displays queue, estimated time, and error history. You can refresh at any time via the 'Update Status' button."
      },
      {
        question: "How do I handle import errors?",
        answer: "Download the error report, fix the flagged records (e.g., invalid NAAB), and re-upload only the problematic rows."
      },
      {
        question: "Can I send results directly to the herd?",
        answer: "Yes. After completion, use 'Send to Herd' to update all processed animals."
      }
    ],
    resources: [
      {
        title: "Nexus 2 Batch Template",
        description: "Spreadsheet with required columns and filled examples",
        type: "Guide"
      },
      {
        title: "Video: Batch Processing",
        description: "Demonstration of upload, monitoring, and export",
        type: "Video"
      },
      {
        title: "Post-Processing Checklist",
        description: "Checks before sending data to the herd",
        type: "Guide"
      }
    ],
    hints: {
      upload: "Upload the batch file with complete pedigree",
      template: "Download the template to avoid incorrect headers",
      process: "Start processing and monitor the queue in real time",
      errors: "Download the error report to fix specific records",
      results: "Export the final file with estimated PTAs",
      send: "Send approved predictions directly to the herd"
    }
  },

  // Nexus 3 - Group Analysis
  "nexus3-groups": {
    faq: [
      {
        question: "How do I create comparison groups?",
        answer: "Define filters (category, year, origin) and save each set as a group. You can compare up to 4 groups simultaneously."
      },
      {
        question: "What metrics are compared?",
        answer: "We show PTA averages, quartile distribution, and projected economic gains for each configured group."
      },
      {
        question: "Can I import pre-defined groups?",
        answer: "Yes. Use the 'Import Groups' button to load animal lists or segments created in the Segmentation tool."
      },
      {
        question: "How do I interpret the Dams vs Daughters chart?",
        answer: "The chart shows progression between generations. Points above the diagonal line indicate positive evolution of daughters relative to dams."
      },
      {
        question: "Is there a dedicated export?",
        answer: "Use 'Export Comparison' to generate a PDF with tables, charts, and insights ready for presentation."
      }
    ],
    resources: [
      {
        title: "Guide: Nexus 3",
        description: "Segmentation, group creation, and detailed comparison",
        type: "Guide"
      },
      {
        title: "Video: Internal Benchmark",
        description: "Learn to compare lots, crops, and suppliers",
        type: "Video"
      },
      {
        title: "Presentation Template",
        description: "Editable slides with Nexus 3 charts",
        type: "Guide"
      }
    ],
    hints: {
      create: "Build groups using filters by category, year, or origin",
      compare: "Select up to 4 groups and visualize PTA differences",
      mothersVsDaughters: "Use the Dams vs Daughters chart to evaluate genetic gain",
      import: "Import groups previously saved in Segmentation",
      export: "Generate a PDF with the comparison to share with the team",
      notes: "Add insights directly in the report sidebar"
    }
  },

  // Genetic Plan - Projection
  "plano-projecao": {
    faq: [
      {
        question: "How do I configure mating scenarios?",
        answer: "Select bulls, set PTA goals, and choose inbreeding restrictions. The simulator calculates the impact on each generation."
      },
      {
        question: "What is genetic ROI?",
        answer: "The estimated financial return considering production increase, savings on health issues, and semen cost."
      },
      {
        question: "Can I compare scenarios?",
        answer: "Yes. Create multiple scenarios and use the 'Compare Scenarios' tab to visualize differences in genetic gain and ROI."
      },
      {
        question: "How do I send the projection to the Virtual Tank?",
        answer: "After defining the scenario, click 'Send to Tank' to reserve doses aligned with the plan."
      },
      {
        question: "How do I interpret the evolution chart?",
        answer: "The chart shows projection of key PTAs over 5 years. Use it to validate whether goals will be achieved."
      }
    ],
    resources: [
      {
        title: "Guide: Genetic Planning",
        description: "Build scenarios, evaluate ROI, and integrate with the Tank",
        type: "Guide"
      },
      {
        title: "Video: Mating Simulator",
        description: "Complete demonstration of Genetic Projection",
        type: "Video"
      },
      {
        title: "ROI Spreadsheet",
        description: "Template to compare with actual results",
        type: "Guide"
      }
    ],
    hints: {
      scenario: "Configure the bulls and PTA goals for the scenario",
      roi: "Analyze projected ROI considering costs and gains",
      constraints: "Use inbreeding restrictions to avoid critical matings",
      compare: "Compare scenarios to choose the best strategy",
      sendToTank: "Reserve doses in the Virtual Tank directly from the projection",
      export: "Export the plan as PDF to share with consultants"
    }
  },

  // Genetic Plan - Replacement Calculator
  "plano-calculadora": {
    faq: [
      {
        question: "What are the 7 calculator phases?",
        answer: "1) Population diagnosis, 2) Genetic strategy, 3) Reproductive goals, 4) Herd composition, 5) Investments, 6) Projected revenue, 7) Consolidated ROI."
      },
      {
        question: "How do I fill in the initial data?",
        answer: "Enter the number of females by category, culling rates, and replacement goals. The system fills in suggestions based on benchmarks."
      },
      {
        question: "Can I simulate different pregnancy rates?",
        answer: "Yes. Adjust the rate by phase (conventional AI, sexed, embryo) and see the immediate impact on required calf calculations."
      },
      {
        question: "How do I generate a complete report?",
        answer: "Click 'Export Plan' to download a PDF with all phases, charts, and consolidated recommendations."
      },
      {
        question: "Is there integration with the Goals Plan?",
        answer: "Goals defined in the Calculator automatically feed the 'Goals' tab and the farm summary."
      }
    ],
    resources: [
      {
        title: "Guide: Replacement Calculator",
        description: "Understand each phase and required indicators",
        type: "Guide"
      },
      {
        title: "Video: Building the Plan in 20 Minutes",
        description: "Complete step-by-step to fill all phases",
        type: "Video"
      },
      {
        title: "Data Checklist",
        description: "Information you should collect before starting",
        type: "Guide"
      }
    ],
    hints: {
      phase1: "Diagnose herd size and birth projection",
      phase2: "Define genetic goals and target indexes",
      phase3: "Configure pregnancy rates and AI strategies",
      phase4: "Plan culling and replacement by category",
      phase5: "Enter costs for semen, embryos, and management",
      phase6: "Project additional revenue from production gains",
      phase7: "Review the final ROI before approving the plan"
    }
  },

  // Genetic Plan - IM5 Configurator
  "plano-im5": {
    faq: [
      {
        question: "What is IM5$?",
        answer: "A custom economic index with up to 5 traits. Allows calculating financial return per daughter based on selected PTAs."
      },
      {
        question: "Which traits can I use?",
        answer: "Any PTA available in the database (production, health, conformation). We recommend combining profit traits with functional characteristics."
      },
      {
        question: "How do I define monetary weights?",
        answer: "Enter the value per PTA unit. E.g.: +1.0 PTAM = $35.00 revenue/year. The calculator helps with benchmark-based suggestions."
      },
      {
        question: "How do I apply IM5$ to the projection?",
        answer: "After calculating the index, click 'Apply IM5$' to use the value directly in the ROI module of Genetic Projection."
      },
      {
        question: "Can I save different configurations?",
        answer: "Yes. Save presets with trait and weight combinations to reuse on other farms or cycles."
      }
    ],
    resources: [
      {
        title: "Guide: Configuring IM5$",
        description: "Trait selection, monetary weights, and interpretation",
        type: "Guide"
      },
      {
        title: "Video: ROI with IM5$",
        description: "See how the index impacts financial analysis",
        type: "Video"
      },
      {
        title: "Support Spreadsheet",
        description: "Economic weight templates to start the calculation",
        type: "Guide"
      }
    ],
    hints: {
      traits: "Select up to 5 strategic traits for the index",
      weights: "Define the monetary value for each PTA unit",
      calculate: "Click 'Calculate IM5$' to generate the custom index",
      apply: "Apply IM5$ directly to Genetic Projection",
      presets: "Save presets to reuse in other plans",
      export: "Export a spreadsheet with the IM5$ breakdown"
    }
  },

  // Genetic Plan - Goals
  "plano-metas": {
    faq: [
      {
        question: "What goals should I define?",
        answer: "Configure goals for genetic indexes (TPI, NM$), production (kg milk), reproduction (pregnancy rate), and population (number of heifers)."
      },
      {
        question: "How do I track progress?",
        answer: "Use the automatic indicators and comparative charts that show current status versus desired goal."
      },
      {
        question: "Can I attach strategic notes?",
        answer: "Yes. Use the general notes field to record decisions, deadlines, and responsible parties. Everything is saved per farm."
      },
      {
        question: "Do goals integrate with other modules?",
        answer: "Yes. Goals feed Audit, Segmentation, and Plan reports, ensuring indicator consistency."
      },
      {
        question: "Is there version history?",
        answer: "Each save creates a snapshot that can be compared later through the history panel."
      }
    ],
    resources: [
      {
        title: "Guide: SMART Goals",
        description: "Transform objectives into measurable goals",
        type: "Guide"
      },
      {
        title: "Video: PDCA Cycle for the Herd",
        description: "How to review goals quarterly",
        type: "Video"
      },
      {
        title: "Tracking Template",
        description: "Spreadsheet to compare goals vs actual",
        type: "Guide"
      }
    ],
    hints: {
      categories: "Define goals by area: genetics, reproduction, production, and population",
      targets: "Enter numeric values and achievement deadlines",
      notes: "Record action plans and responsible parties",
      reset: "Use 'Reset' to return to suggested defaults",
      save: "Save goals to update the general dashboard",
      export: "Generate a PDF summary for alignment meetings"
    }
  },

  // Population Structure
  estrutural: {
    faq: [
      {
        question: "What is structural analysis?",
        answer: "Shows distribution of categories (calves, heifers, cows) over time, projecting replacement needs."
      },
      {
        question: "How do I interpret the pyramid chart?",
        answer: "Each band's width indicates the number of animals by age/parity. Unbalanced pyramids suggest adjustments to the reproductive plan."
      },
      {
        question: "Can I simulate scenarios?",
        answer: "Use controls to adjust culling and birth rates and see the immediate impact on the pyramid."
      },
      {
        question: "How do I export the analysis?",
        answer: "Generate a PDF or PNG with charts and key indicators for strategic meetings."
      },
      {
        question: "Does it integrate with the Replacement Calculator?",
        answer: "Yes. The structural analysis automatically feeds Phase 1 data of the calculator."
      }
    ],
    resources: [
      {
        title: "Guide: Population Structure",
        description: "Understand your age pyramid and adjust replacement",
        type: "Guide"
      },
      {
        title: "Video: Population Diagnosis",
        description: "Practical interpretation examples",
        type: "Video"
      }
    ],
    hints: {
      pyramid: "Analyze the age pyramid to identify bottlenecks",
      sliders: "Adjust culling and birth rates to simulate scenarios",
      alerts: "Watch for automatic deficit or surplus alerts",
      export: "Download the diagnosis as PDF for meetings",
      integration: "Send data to the Replacement Calculator"
    }
  },

  // File Folder
  "pasta-arquivos": {
    faq: [
      {
        question: "What files are available?",
        answer: "Reports generated on the platform (Segmentation, Tank, Projection, Audit) and manual uploads categorized by module."
      },
      {
        question: "How do I organize files better?",
        answer: "Use tags and automatic folders to separate by farm, module, or period. You can rename and add descriptions."
      },
      {
        question: "Can I share with the team?",
        answer: "Click 'Share' to generate a secure link with configurable expiration or send by email directly from the platform."
      },
      {
        question: "Is there version control?",
        answer: "Exported files have automatic versioning with date and time. You can compare versions and restore previous ones."
      },
      {
        question: "What is the storage limit?",
        answer: "Each farm has 5 GB included. The panel shows current usage and allows purchasing additional space."
      }
    ],
    resources: [
      {
        title: "Guide: Document Management",
        description: "Best practices for organizing genetic reports",
        type: "Guide"
      },
      {
        title: "Video: File Folder",
        description: "Tour of the interface and sharing features",
        type: "Video"
      }
    ],
    hints: {
      upload: "Upload reports and spreadsheets by dragging to the highlighted area",
      tags: "Add tags to facilitate future searches",
      share: "Share files with password-protected links",
      search: "Use search to find reports by name or tag",
      download: "Download any file in one click",
      history: "Access version history to restore documents"
    }
  },

  // Virtual Tank
  "botijao-virtual": {
    faq: [
      {
        question: "What is the Virtual Tank?",
        answer: "A tool to manage the farm's semen inventory. Control available doses, distribute by female category, record nitrogen refills, and track stock value."
      },
      {
        question: "How do I add bulls to the tank?",
        answer: "Click 'Add to Tank', search for the desired bull, set type (conventional/sexed), dose quantity, price, and distribute by category. Data is saved automatically."
      },
      {
        question: "How do I distribute doses by category?",
        answer: "When editing each bull, define how many doses to allocate for: Heifers, Primiparous, Secundiparous, Multiparous, Donors, Intermediates, and Recipients. The system validates that the sum doesn't exceed stock."
      },
      {
        question: "What is nitrogen tracking for?",
        answer: "Record each liquid nitrogen refill with date, volume, and notes. Essential for cost control and replacement planning."
      },
      {
        question: "How do I export the inventory?",
        answer: "Click 'Export' to download a complete CSV with all bulls, doses, distributions, and values. Use for backup or external analysis."
      }
    ],
    resources: [
      {
        title: "Guide: Semen Inventory Management",
        description: "How to organize and control your virtual tank",
        type: "Guide"
      },
      {
        title: "Video: Strategic Distribution",
        description: "How to allocate doses by category efficiently",
        type: "Video"
      },
      {
        title: "Cost Control",
        description: "Calculate the ROI of your genetic inventory",
        type: "Guide"
      }
    ],
    hints: {
      addBull: "Add bulls to the tank to control semen inventory",
      stockType: "Differentiate conventional and sexed semen for correct planning",
      distribution: "Distribute doses by category before performing inseminations",
      nitrogen: "Record nitrogen refills for cost control",
      stats: "Track statistics of total doses, by type, and stock value",
      export: "Export to CSV for backup or analysis in other tools",
      price: "Set price per dose to calculate total stock value",
      categories: "7 categories available for strategic dose distribution",
      sorting: "Sort by name, company, or type to find bulls quickly"
    }
  },

  // Goals
  metas: {
    faq: [
      {
        question: "What are goals for?",
        answer: "Establish measurable objectives in 4 areas: Genetics (PTAs), Reproductive (rates and intervals), Production (milk and quality), and Population (herd structure). Track progress in real time."
      },
      {
        question: "How do I set genetic goals?",
        answer: "In the 'Genetics' tab, set current values and desired goals for each PTA (TPI, NM$, Milk, Fat, Protein, SCS, DPR, PTAT). The system calculates progress percentage automatically."
      },
      {
        question: "Can I customize goals?",
        answer: "Default goals cover the main indicators, but you can add new goals or modify existing ones according to the farm's specific needs."
      },
      {
        question: "How do I interpret progress?",
        answer: "Progress bars visually show how far you are from each goal. Values above 100% indicate you've already exceeded the defined objective."
      },
      {
        question: "Is data saved automatically?",
        answer: "Yes. All entered values are saved locally in real time. Use the 'Save Goals' button to register a specific checkpoint with date and time."
      }
    ],
    resources: [
      {
        title: "Guide: Setting Realistic Goals",
        description: "How to establish achievable and measurable objectives",
        type: "Guide"
      },
      {
        title: "Video: Goals System",
        description: "Complete tour of the 4 goal categories",
        type: "Video"
      },
      {
        title: "Goals and Genetic Strategy",
        description: "Align your goals with mating planning",
        type: "Guide"
      }
    ],
    hints: {
      geneticGoals: "Set PTA goals aligned with your selection objectives",
      reproductiveGoals: "Establish reproductive rates compatible with your management",
      productionGoals: "Configure realistic production goals for your region",
      populationGoals: "Plan the ideal population structure of the herd",
      progress: "Track progress bars to identify critical areas",
      save: "Save periodically to maintain goal evolution history",
      reset: "Use 'Reset' only if you want to start from scratch",
      tabs: "Navigate between the 4 tabs to manage different goal types",
      notes: "Use the notes tab to record strategies and observations"
    }
  }
};
