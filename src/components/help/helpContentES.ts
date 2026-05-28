// Contenido de ayuda contextual en español para cada pagina/modulo
import type { HelpContent } from './helpContent';

export const helpContentMapES: Record<string, HelpContent> = {
  // Conversion de Planillas
  conversao: {
    faq: [
      {
        question: "Que es la herramienta de Conversion?",
        answer: "Estandariza planillas con diferentes nomenclaturas, mapeando automaticamente columnas a un formato estandar usando banco de alias, regex y fuzzy matching. Ideal para consolidar datos de diferentes fuentes."
      },
      {
        question: "Debo usar el modelo estandar o crear el mio?",
        answer: "Use el boton 'Usar nuestro modelo estandar' para acceder a todas las columnas geneticas mas utilizadas (PTAs, indices economicos, salud, fertilidad, tipo). Cree el suyo solo si necesita columnas especificas diferentes."
      },
      {
        question: "Siempre necesito enviar el banco de leyendas?",
        answer: "No es obligatorio. El sistema ya tiene un banco estandar interno. Pero si hace clic en 'Usar nuestras leyendas estandar', tendra cientos de mapeos adicionales que mejoran mucho la deteccion automatica de correspondencias."
      },
      {
        question: "Que son las sugerencias 'seguras'?",
        answer: "Son mapeos con alta confianza (score >= 0.8) provenientes del banco de leyendas o patrones regex. Puede aprobarlas todas de una vez con el boton 'Aprobar Seguras' para ahorrar tiempo."
      },
      {
        question: "Puedo ajustar los mapeos sugeridos?",
        answer: "Si. Para cada fila en la tabla, puede aceptar la sugerencia automatica, elegir manualmente otra columna del modelo, o dejarla sin mapear. El control es totalmente suyo."
      },
      {
        question: "Como funciona la deteccion automatica?",
        answer: "El sistema usa 3 metodos en orden de prioridad: 1) Banco de leyendas (personalizado + estandar), 2) Patrones regex para formatos conocidos, 3) Correspondencia fuzzy para similitud de texto. Cada sugerencia muestra su origen y puntuacion."
      }
    ],
    resources: [
      {
        title: "Guia: Conversion de Planillas",
        description: "Paso a paso completo para estandarizar sus datos",
        type: "Guia"
      },
      {
        title: "Video: Usando Modelos y Leyendas Estandar",
        description: "Como acelerar el proceso con archivos preconfigurados",
        type: "Video"
      },
      {
        title: "Banco de Nomenclaturas",
        description: "Entienda como crear y usar bancos de alias personalizados",
        type: "Guia"
      }
    ],
    hints: {
      modelUpload: "Cargue el modelo estandar o haga clic para usar nuestro modelo con todas las columnas geneticas",
      legendUpload: "Opcional: use nuestras leyendas estandar para mejorar la deteccion automatica",
      dataUpload: "Envie la planilla que desea estandarizar - formato Excel o CSV",
      suggestions: "Revise las sugerencias automaticas y apruebe o ajuste segun sea necesario",
      safeSuggestions: "Apruebe todas las sugerencias 'seguras' de una vez para ahorrar tiempo",
      download: "Descargue la planilla estandarizada despues de aprobar todos los mapeos"
    }
  },

  // Dashboard / Inicio
  dashboard: {
    faq: [
      {
        question: "Como creo una nueva finca?",
        answer: "Haga clic en el boton 'Crear Nueva Finca' en el dashboard. Complete el nombre de la finca y confirme. Podra agregar animales despues."
      },
      {
        question: "Como elimino una finca?",
        answer: "En la tarjeta de la finca en el dashboard, haga clic en el icono de papelera. Confirme la eliminacion. ATENCION: Esta accion es permanente y eliminara todos los datos de la finca."
      },
      {
        question: "Que son los modulos disponibles?",
        answer: "Cada finca tiene acceso a 5 modulos: Rebano (gestion de animales), Nexus (prediccion genetica), Plan (planificacion genetica), Graficos (analisis visuales) y Auditoria (informes completos)."
      }
    ],
    resources: [
      {
        title: "Primeros Pasos",
        description: "Guia completa para comenzar a usar la plataforma",
        type: "Guia"
      },
      {
        title: "Video: Tour por la Plataforma",
        description: "Conozca todas las funcionalidades en 5 minutos",
        type: "Video"
      }
    ],
    hints: {
      createFarm: "Cree su primera finca para comenzar a gestionar su rebano",
      selectFarm: "Seleccione una finca para acceder a sus modulos y datos",
      modules: "Cada modulo ofrece herramientas especificas para gestion genetica"
    }
  },

  // Rebano
  herd: {
    faq: [
      {
        question: "Como importo datos de hembras?",
        answer: "Haga clic en 'Importar Hembras' y seleccione su archivo CSV o Excel. El sistema acepta diversos formatos y realizara validacion automatica. Si su archivo tiene encabezados diferentes del estandar (ej.: archivos de laboratorios genomicos), use el Menu de Conversion para estandarizar las columnas automaticamente antes de importar."
      },
      {
        question: "Mi archivo tiene encabezados diferentes, como procedo?",
        answer: "Use el Menu de Conversion (disponible en el Dashboard en 'Operaciones y Soporte'). Esta herramienta convierte automaticamente cualquier formato de archivo genomico al estandar ToolSS, mapeando cientos de nomenclaturas diferentes. Despues de convertir, importe el archivo estandarizado."
      },
      {
        question: "Como exporto los datos del rebano?",
        answer: "Haga clic en el boton 'Exportar' para descargar un archivo CSV con todos los datos de las hembras, incluyendo PTAs, pedigri e informacion reproductiva."
      },
      {
        question: "Que son las categorias automaticas?",
        answer: "El sistema categoriza automaticamente los animales en: Ternera (hasta 90 dias), Vaquillona (91 dias hasta 1er parto), Primipara (1er parto), Secundipara (2do parto) y Multipara (3+ partos)."
      },
      {
        question: "Como filtro animales por ano?",
        answer: "Use el filtro de ano en la parte superior de la tabla para visualizar solo animales nacidos en un ano especifico. Util para analisis por zafra."
      },
      {
        question: "Como elimino animales seleccionados?",
        answer: "Seleccione las hembras usando las casillas de verificacion, luego haga clic en el boton 'Eliminar Seleccionados'. Confirme la eliminacion. Esta accion es permanente."
      }
    ],
    resources: [
      {
        title: "Guia: Importacion de Datos",
        description: "Paso a paso completo para importar sus animales",
        type: "Guia"
      },
      {
        title: "Video: Gestion del Rebano",
        description: "Como usar filtros, ordenamiento y exportacion",
        type: "Video"
      },
      {
        title: "Formato de Archivos de Importacion",
        description: "Especificaciones tecnicas de los archivos CSV/Excel aceptados",
        type: "Guia"
      }
    ],
    hints: {
      import: "Importe datos de hembras via CSV o Excel. Soporta multiples formatos con validacion automatica",
      export: "Exporte todos los datos del rebano para respaldo o analisis externo",
      search: "Busque por nombre o identificador del animal",
      filter: "Filtre por ano de nacimiento para analisis por zafra",
      select: "Seleccione multiples animales para acciones en lote",
      delete: "Elimine animales seleccionados (accion permanente)",
      sort: "Haga clic en los encabezados para ordenar por cualquier columna",
      category: "Categorias automaticas basadas en edad y orden de parto",
      pedigree: "Visualice el pedigri completo con codigos NAAB y nombres"
    }
  },

  // Nexus
  nexus: {
    faq: [
      {
        question: "Que es Nexus?",
        answer: "Nexus es nuestra herramienta de prediccion genetica avanzada. Ofrece 3 metodos: Nexus 1 (genomica), Nexus 2 (pedigri) y Nexus 3 (grupos), para calcular PTAs estimados de animales."
      },
      {
        question: "Que metodo Nexus debo usar?",
        answer: "Nexus 1 para animales con datos genomicos; Nexus 2 para prediccion basada en pedigri (padre, abuelo materno, bisabuelo); Nexus 3 para analisis comparativo de grupos de animales."
      },
      {
        question: "Como funciona Nexus 2 (Pedigri)?",
        answer: "Ingrese los codigos NAAB del padre, abuelo materno y bisabuelo materno. El sistema calcula PTAs estimados usando regresion de pedigri e indices de seleccion estandar."
      },
      {
        question: "Puedo usar Nexus sin datos genomicos?",
        answer: "Si. Nexus 2 funciona solo con informacion de pedigri (codigos NAAB). Ideal cuando no hay datos de genotipado disponibles."
      }
    ],
    resources: [
      {
        title: "Guia: Nexus Pedigri",
        description: "Como usar Nexus 2 para predicciones por pedigri",
        type: "Guia"
      },
      {
        title: "Video: Nexus Genomico",
        description: "Tutorial completo de Nexus 1 para datos genomicos",
        type: "Video"
      },
      {
        title: "Nexus 3: Analisis de Grupos",
        description: "Compare grupos de animales e identifique patrones",
        type: "Guia"
      }
    ],
    hints: {
      methodSelection: "Elija el metodo Nexus adecuado para sus datos disponibles",
      genomic: "Nexus 1: Use cuando tenga datos de genotipado de los animales",
      pedigree: "Nexus 2: Use cuando solo tenga informacion de pedigri (codigos NAAB)",
      groups: "Nexus 3: Compare grupos de animales e identifique tendencias geneticas",
      naabCode: "Los codigos NAAB identifican toros registrados en EE.UU. Ej.: 11HO12345",
      prediction: "Las predicciones son estimaciones basadas en modelos estadisticos validados"
    }
  },

  // Plan Genetico
  plano: {
    faq: [
      {
        question: "Que es la Proyeccion Genetica?",
        answer: "Es una herramienta que simula diferentes estrategias de apareamiento, calculando el impacto genetico y economico (ROI) de cada escenario a lo largo del tiempo."
      },
      {
        question: "Que es la Calculadora de Reposicion?",
        answer: "Sistema completo con 7 fases de planificacion: crecimiento poblacional, estrategia genetica, metas reproductivas, composicion, inversiones, ingresos y analisis de ROI."
      },
      {
        question: "Como defino metas geneticas?",
        answer: "En la Calculadora de Reposicion, defina los indices objetivo (TPI, NM$, etc.) que desea alcanzar. El sistema calculara las estrategias necesarias para lograr esas metas."
      }
    ],
    resources: [
      {
        title: "Guia: Proyeccion Genetica",
        description: "Como simular estrategias de apareamiento",
        type: "Guia"
      },
      {
        title: "Video: Calculadora de Reposicion",
        description: "Tutorial de las 7 fases de planificacion",
        type: "Video"
      },
      {
        title: "ROI y Retorno Genetico",
        description: "Entienda como calcular el retorno de la inversion genetica",
        type: "Guia"
      }
    ],
    hints: {
      projection: "Simule diferentes estrategias de apareamiento y vea el impacto en el rebano",
      calculator: "Planifique la reposicion del rebano en 7 fases estructuradas",
      goals: "Defina metas geneticas y economicas realistas para su rebano",
      roi: "Calcule el retorno financiero esperado de cada estrategia genetica",
      phases: "Cada fase de la calculadora depende de las anteriores - siga el orden"
    }
  },

  // Graficos
  charts: {
    faq: [
      {
        question: "Como interpreto los graficos de tendencias?",
        answer: "Los graficos muestran la evolucion de los PTAs a lo largo del tiempo. Lineas ascendentes indican progreso genetico positivo. Use para evaluar la eficacia de las estrategias de seleccion."
      },
      {
        question: "Como exporto graficos?",
        answer: "Haga clic en el boton 'Exportar' para descargar los datos en CSV o generar un PDF con todos los graficos. Ideal para informes y presentaciones."
      },
      {
        question: "Que son los diferentes tipos de agrupamiento?",
        answer: "Agrupe por ano (evolucion temporal), categoria (terneras, vaquillonas, etc.) o paridad (orden de parto) para analisis especificos de su rebano."
      },
      {
        question: "Como agrego mas PTAs a los graficos?",
        answer: "En el panel de configuraciones, haga clic en las insignias de PTAs para agregar/quitar. Puede visualizar hasta 5 PTAs simultaneamente para comparacion."
      }
    ],
    resources: [
      {
        title: "Guia: Interpretacion de Graficos",
        description: "Como analizar tendencias geneticas del rebano",
        type: "Guia"
      },
      {
        title: "Video: Analisis Visual de Datos",
        description: "Tour completo por los recursos de visualizacion",
        type: "Video"
      },
      {
        title: "Exportacion de Informes",
        description: "Como generar PDFs y CSVs profesionales",
        type: "Guia"
      }
    ],
    hints: {
      config: "Configure cuales PTAs visualizar y como agrupar los datos",
      chartType: "Alterne entre graficos de linea, barras o area segun su necesidad",
      grouping: "Agrupe por ano, categoria o paridad para diferentes perspectivas",
      export: "Exporte datos en CSV o graficos en PDF para informes externos",
      trends: "Las lineas de tendencia ayudan a identificar progreso genetico a lo largo del tiempo",
      distribution: "Los graficos de distribucion muestran como se distribuyen los animales en cada PTA",
      multiPTA: "Compare hasta 5 PTAs simultaneamente para analisis multivariado"
    }
  },

  // Busqueda de Toros
  bulls: {
    faq: [
      {
        question: "Como importo datos de toros?",
        answer: "Haga clic en 'Importar Toros', seleccione un archivo CSV o Excel con los datos. El sistema soporta multiples formatos y realiza validacion automatica. Use el boton 'Descargar Template' para ver el formato correcto."
      },
      {
        question: "Como funciona el sistema de puntuacion?",
        answer: "Usted define pesos para cada PTA (TPI, NM$, etc.). El sistema calcula un puntaje ponderado para cada toro. Toros con mayor puntaje son los mas adecuados a sus criterios."
      },
      {
        question: "Que es la migracion de staging?",
        answer: "Despues de importar, los datos quedan en 'staging' (area temporal). Haga clic en 'Migrar Toros' para procesar y validar los datos, moviendolos a la base definitiva."
      },
      {
        question: "Como exporto la lista de toros?",
        answer: "Use el boton 'Exportar' para descargar todos los datos en CSV, incluyendo PTAs, puntajes e informacion de pedigri. Util para analisis externos o respaldo."
      }
    ],
    resources: [
      {
        title: "Guia: Importacion de Toros",
        description: "Formato de archivos y proceso completo de importacion",
        type: "Guia"
      },
      {
        title: "Video: Seleccion de Toros",
        description: "Como usar filtros y puntajes para elegir los mejores toros",
        type: "Video"
      },
      {
        title: "Sistema de Puntuacion Personalizado",
        description: "Configure pesos personalizados para sus objetivos",
        type: "Guia"
      }
    ],
    hints: {
      import: "Importe datos de toros via CSV/Excel. Use el template para garantizar formato correcto",
      template: "Descargue el template con ejemplos de datos reales para facilitar la importacion",
      staging: "Los datos importados quedan en staging. Use 'Migrar Toros' para procesar",
      search: "Busque toros por codigo NAAB, nombre o empresa",
      filter: "Filtre por empresa o ano de nacimiento",
      weights: "Ajuste los pesos de los PTAs conforme a sus objetivos de seleccion",
      score: "Puntajes mas altos indican toros mas alineados con sus criterios",
      export: "Exporte la lista completa de toros con todos los datos y puntajes",
      company: "Filtre por empresa para ver toros de centrales especificas"
    }
  },

  // Segmentacion
  segmentation: {
    faq: [
      {
        question: "Que es la segmentacion del rebano?",
        answer: "Es el proceso de clasificar animales en grupos (Superior, Intermedio, Inferior) basado en indices geneticos personalizables. Util para decisiones de seleccion y descarte."
      },
      {
        question: "Como creo un indice personalizado?",
        answer: "Seleccione los PTAs relevantes, defina pesos para cada uno y elija si desea estandarizacion (Z-score). El sistema calculara un indice unico para clasificar sus animales."
      },
      {
        question: "Que son los 'gates' (puertas)?",
        answer: "Son filtros que excluyen animales que no cumplen criterios minimos. Ej.: 'SCS <= 2.75' excluye animales con conteo de celulas somaticas muy alto."
      },
      {
        question: "Como exporto el informe de segmentacion?",
        answer: "Haga clic en 'Exportar PDF' para generar un informe completo con graficos, estadisticas y lista de animales por clasificacion. Ideal para documentar decisiones."
      }
    ],
    resources: [
      {
        title: "Guia: Segmentacion del Rebano",
        description: "Como clasificar y seleccionar animales estrategicamente",
        type: "Guia"
      },
      {
        title: "Video: Indices Personalizados",
        description: "Cree indices personalizados para sus objetivos",
        type: "Video"
      },
      {
        title: "Gates y Filtros Avanzados",
        description: "Como usar filtros para seleccion precisa",
        type: "Guia"
      }
    ],
    hints: {
      indexSelection: "Elija entre HHP$, TPI, NM$ o cree un indice personalizado",
      traits: "Seleccione cuales PTAs incluir en su indice personalizado",
      weights: "Defina la importancia relativa de cada PTA (la suma debe ser 100%)",
      standardize: "Estandarizacion (Z-score) recomendada cuando los PTAs tienen escalas diferentes",
      gates: "Use gates para excluir animales que no cumplan requisitos minimos",
      segmentation: "Ajuste porcentajes para clasificar animales en 3 grupos",
      presets: "Guarde configuraciones frecuentes como presets para uso futuro",
      export: "Exporte informe PDF completo con graficos y estadisticas",
      visualization: "Graficos de torta y barras ayudan a visualizar la distribucion del rebano"
    }
  },

  // Auditoria Genetica
  auditoria: {
    faq: [
      {
        question: "Que es la Auditoria Genetica?",
        answer: "Es un analisis completo del rebano en 7 pasos: parentesco, top padres, cuartiles, progresion, comparacion, distribucion y benchmark. Proporciona una vision de 360 grados del potencial genetico."
      },
      {
        question: "Como interpreto los cuartiles?",
        answer: "Los animales se dividen en 4 grupos de 25% cada uno. El Q4 (superior) representa el 25% mejor. Compare la distribucion de su rebano con el promedio nacional."
      },
      {
        question: "Que es el benchmark?",
        answer: "Compara los indices promedio de su rebano con promedios nacionales o regionales. Muestra donde usted esta por encima o por debajo del estandar de la industria."
      },
      {
        question: "Como exporto la auditoria completa?",
        answer: "Use el boton 'Exportar PDF' para generar un informe profesional con los 7 pasos, graficos y analisis. Ideal para reuniones y toma de decisiones."
      }
    ],
    resources: [
      {
        title: "Guia: Auditoria Genetica Completa",
        description: "Entienda cada uno de los 7 pasos de la auditoria",
        type: "Guia"
      },
      {
        title: "Video: Interpretacion de Resultados",
        description: "Como usar los insights de la auditoria para decisiones estrategicas",
        type: "Video"
      },
      {
        title: "Benchmark y Comparaciones",
        description: "Como posicionarse en relacion al mercado",
        type: "Guia"
      }
    ],
    hints: {
      steps: "Navegue por los 7 pasos usando los botones en la parte superior de la pagina",
      parentesco: "Analice la consanguinidad y diversidad genetica del rebano",
      topParents: "Identifique los toros y vacas mas influyentes en su rebano",
      quartis: "Vea como se distribuyen sus animales en los cuartiles de cada indice",
      progression: "Evalue el progreso genetico a lo largo de los anos",
      comparison: "Compare diferentes generaciones o periodos",
      distribution: "Visualice la distribucion detallada de cada PTA",
      benchmark: "Comparese con promedios nacionales e identifique oportunidades",
      export: "Exporte informe PDF profesional con todos los analisis"
    }
  },

  // Auditoria Step 1: Parentesco
  "auditoria-step1": {
    faq: [
      {
        question: "Que significa 'Parentesco Completo'?",
        answer: "El animal posee informacion de Padre (Sire), Abuelo Materno (MGS) y Bisabuelo Materno (MMGS). Esencial para predicciones precisas en Nexus 2 (pedigri). Cuanto mas completo, mayor la confiabilidad genetica."
      },
      {
        question: "Por que el sistema divide en 3 categorias (Completo, Incompleto, Desconocido)?",
        answer: "'Completo' = posee los 3 ancestros. 'Incompleto' = posee 1 o 2 ancestros. 'Desconocido' = ningun ancestro registrado. La division facilita identificar prioridades: complete los 'Incompletos' primero (ya tienen base parcial)."
      },
      {
        question: "Cual es la importancia de cada ancestro (Sire vs MGS vs MMGS)?",
        answer: "Sire (Padre) contribuye 50% de la genetica, MGS (Abuelo Materno) 25%, MMGS (Bisabuelo) 12.5%. Foco prioritario: completar Sire (mayor impacto), despues MGS, finalmente MMGS. Sin el Padre registrado, la prediccion genetica queda comprometida."
      },
      {
        question: "Que significa cuando mas del 50% del rebano esta en 'Desconocido' para Sire?",
        answer: "Alerta critica. La mitad de los animales no tiene padre registrado, perjudicando predicciones geneticas. Causas comunes: datos de IA no importados, registro manual incompleto, toros sin codigo NAAB. ACCION: revisar historial de IA y completar codigos."
      },
      {
        question: "Como priorizo cuales pedigris completar?",
        answer: "Foquese en: 1) Animales clasificados como 'Donante' o 'Superior' en Segmentacion (mayor impacto genetico futuro), 2) Vaquillonas y Primiparas (generaciones recientes), 3) Animales con estado 'Incompleto' (ya tienen base parcial, mas facil completar)."
      }
    ],
    resources: [
      {
        title: "Guia: Completitud del Pedigri",
        description: "Como priorizar la completitud de datos",
        type: "Guia"
      }
    ],
    hints: {
      completeness: "Foquese en completar Sire (50% impacto) antes de MGS/MMGS",
      priority: "Priorice animales 'Superiores' y 'Donantes' de la Segmentacion",
      validation: "Verifique Step 2 para detectar consanguinidad critica"
    }
  },

  // Auditoria Step 2: Top Parents
  "auditoria-step2": {
    faq: [
      {
        question: "Como se definen los 'Top Parents'?",
        answer: "Son los toros (Sire/Padre) y abuelos maternos (MGS) mas influyentes del rebano, ranqueados por numero de hijas (no por calidad genetica, sino por frecuencia). Util para identificar dependencia genetica y riesgo de consanguinidad."
      },
      {
        question: "Cual es la diferencia entre la pestana 'Sire' y 'MGS'?",
        answer: "'Sire' = ranking de toros usados como padres directos (50% de la genetica). 'MGS' = ranking de toros que son abuelos maternos (25% de la genetica, a traves de la madre). Use ambas para ver la estructura familiar completa del rebano."
      },
      {
        question: "Como identifico toros sobreutilizados?",
        answer: "Observe la columna '%'. Si un toro representa >20% del rebano, hay riesgo de consanguinidad futura. Considere diversificar genetica: reduzca uso de ese toro, introduzca nuevos toros con perfil similar."
      }
    ],
    resources: [
      {
        title: "Guia: Analisis de Top Parents",
        description: "Identificar toros clave y diversificar",
        type: "Guia"
      }
    ],
    hints: {
      frequency: "Observe toros >20% del rebano (riesgo de consanguinidad)",
      diversity: "Los Top 3 toros no deben superar el 50% del rebano",
      quality: "Cruce con Step 3 para ver calidad genetica de las hijas"
    }
  },

  // Auditoria Step 3: Cuartiles Overview
  "auditoria-step3": {
    faq: [
      {
        question: "Como define el sistema los cuartiles Top 25% y Bottom 25%?",
        answer: "Para cada PTA, el sistema ordena todos los animales de forma descendente (mejores primero). El Top 25% son los primeros N/4 animales. El Bottom 25% son los N/4 animales con menores valores."
      },
      {
        question: "Que significa cuando el Top 25% tiene valor negativo?",
        answer: "Incluso los mejores animales del rebano estan por debajo de la base poblacional (0). Indica necesidad urgente de introducir genetica superior para esa caracteristica."
      },
      {
        question: "Como identifico prioridades de mejora usando Step 3?",
        answer: "Ordene las caracteristicas por: 1) Impacto economico (HHP$, PTAM, CFP), 2) Distancia del Top 25% a la meta, 3) Diferencia Top-Bottom (cuanto ganar seleccionando). PTAs con Top 25% negativo son prioridad maxima."
      }
    ],
    resources: [
      {
        title: "Estadistica Basica: Cuartiles y Percentiles",
        description: "Fundamentos de analisis por cuartiles",
        type: "Guia"
      }
    ],
    hints: {
      selection: "Inicie con 5-8 PTAs economicas, no todas",
      interpretation: "Diferencia Top-Bottom grande = alto potencial de seleccion",
      export: "Guarde con fecha (Cuartiles_Ene2025.pdf) para comparacion mensual"
    }
  },

  // Auditoria Step 4: Progresion Genetica
  "auditoria-step4": {
    faq: [
      {
        question: "Que significa 'Progresion Genetica' en la practica?",
        answer: "Es la ganancia (o perdida) genetica a lo largo de los anos de nacimiento. El grafico muestra si los animales mas jovenes son geneticamente superiores a los mayores. Tendencia positiva = mejoramiento funcionando. Negativa = alerta de regresion."
      },
      {
        question: "Que es la 'linea de tendencia'?",
        answer: "Regresion lineal que suaviza las oscilaciones anuales, mostrando la direccion general. Pendiente positiva = ganancia genetica promedio por ano. Negativa = regresion."
      },
      {
        question: "Que hacer cuando la tendencia es negativa?",
        answer: "Alerta critica. Significa regresion genetica. Causas: toros de baja calidad, apareamientos equivocados, enfoque en caracteristicas no geneticas. ACCION: revisar seleccion de toros, ajustar plan de metas."
      }
    ],
    resources: [
      {
        title: "Video: Entendiendo R2 y Tendencias",
        description: "Interpretacion de regresion lineal",
        type: "Video"
      }
    ],
    hints: {
      trend: "Foquese en PTAs con R2>0.5 (tendencia confiable)",
      extrapolation: "Use la pendiente para predecir tiempo hasta la meta",
      alert: "Tendencia negativa = alerta critica de regresion"
    }
  },

  // Auditoria Step 5: Comparacion por Categoria
  "auditoria-step5": {
    faq: [
      {
        question: "Que hace este paso diferente del Step 4?",
        answer: "Step 4 = evolucion a lo largo del tiempo (anos). Step 5 = comparacion entre categorias etarias (Vaquillonas vs Primiparas vs Multiparas) en un punto en el tiempo (rebano actual)."
      },
      {
        question: "Que es el grafico 'Radar' y como interpretarlo?",
        answer: "Grafico de radar (arana) que muestra multiples PTAs simultaneamente en ejes radiales. Area mayor = grupo superior. Compare los 2 poligonos: caracteristicas donde un grupo se destaca aparecen como 'puntas' en el radar."
      },
      {
        question: "Como interpretar cuando las Vaquillonas son peores que las Multiparas?",
        answer: "Alerta critica. Indica regresion genetica reciente (toros malos, embriones de baja calidad o apareamientos equivocados). Revise inmediatamente: Step 2 (que toros se estan usando) y ajuste la estrategia de IA."
      }
    ],
    resources: [
      {
        title: "Guia: Comparacion Categorica",
        description: "Vaquillonas vs Vacas: que analizar",
        type: "Guia"
      }
    ],
    hints: {
      groups: "Vaquillonas vs Multiparas = mayor diferencia esperada (ganancia generacional)",
      radar: "Area mayor = grupo superior en esas PTAs",
      normalization: "Siempre consulte valores brutos para decisiones reales"
    }
  },

  // Auditoria Step 6: Cuartiles de Indices
  "auditoria-step6": {
    faq: [
      {
        question: "Cual es la diferencia entre Step 3 y Step 6?",
        answer: "Step 3 = cuartiles de PTAs individuales. Step 6 = cuartiles basados en indices economicos (HHP$, TPI, NM$, FM$, CM$) y muestra como los TOP 25% de ese indice difieren en las PTAs subyacentes."
      },
      {
        question: "Que son 'Indice A' e 'Indice B'?",
        answer: "Son dos indices economicos elegidos para comparacion. El sistema clasifica animales por cada indice separadamente y muestra como los Top 25% de cada uno difieren. Util para ver trade-offs entre objetivos."
      },
      {
        question: "Como uso la tabla para elegir que indice seguir?",
        answer: "Identifique cual indice tiene Top 25% mas alineado con sus metas reales. Si prioriza produccion de leche (PTAM), elija el indice donde la Diferencia en PTAM es positiva."
      }
    ],
    resources: [
      {
        title: "Documentacion: Indices Economicos (HHP$, TPI, NM$)",
        description: "Que prioriza cada indice",
        type: "Guia"
      }
    ],
    hints: {
      comparison: "Comience siempre con HHP$ vs su objetivo secundario",
      difference: "Foquese en PTAs con diferencia >100 (trade-offs significativos)",
      strategy: "Elija el indice alineado con sus metas de mercado"
    }
  },

  // Auditoria Step 7: Distribucion de PTAs
  "auditoria-step7": {
    faq: [
      {
        question: "Que son los 'bins' y como afectan el histograma?",
        answer: "Los bins son intervalos que agrupan los valores. El sistema usa bins fijos. Mas bins = mas detalle pero barras menores. 20 es el equilibrio ideal para visualizacion."
      },
      {
        question: "Por que usar distribucion en vez de promedio simple?",
        answer: "El promedio oculta la variabilidad. La distribucion revela: asimetria, outliers, multiples subpoblaciones. Esencial para decisiones de seleccion y apareamiento."
      },
      {
        question: "Como identifico outliers en el histograma?",
        answer: "Busque barras aisladas en los extremos (lejos del pico principal). Estos son outliers (potenciales donantes) o errores de datos. Valide con tabla individual antes de tomar decisiones."
      }
    ],
    resources: [
      {
        title: "Estadistica Descriptiva: Distribuciones",
        description: "Normal, asimetrica, bimodal",
        type: "Guia"
      }
    ],
    hints: {
      outliers: "Barras aisladas en los extremos = potenciales donantes o errores",
      gates: "Use valles de la distribucion para definir gates en Segmentacion",
      bimodal: "Dos picos = dos subpoblaciones (investigue las causas)"
    }
  },

  // Nexus 1 - Prediccion Genomica
  "nexus1-genomic": {
    faq: [
      {
        question: "Que archivos acepta Nexus 1?",
        answer: "Importe planillas CSV o XLSX con columnas minimas: ID del animal, ID de Genotipo, Fecha de recoleccion y PTAs ya evaluadas. El sistema realiza validacion automatica."
      },
      {
        question: "Puedo mezclar hembras genotipadas y no genotipadas?",
        answer: "Si. Las hembras sin genotipo seran calculadas usando regresiones estandar. Las genotipadas reciben ajustes a partir del archivo importado y la base del CDCB."
      },
      {
        question: "Como interpreto el indice de confiabilidad?",
        answer: "La confiabilidad (REL%) indica seguridad de la prediccion. Valores superiores al 70% representan estimaciones robustas; por debajo, considere complementar con pedigri o datos de produccion."
      }
    ],
    resources: [
      {
        title: "Guia: Prediccion Genomica Completa",
        description: "Configuracion del archivo, ejecucion del modelo e interpretacion de PTAs",
        type: "Guia"
      },
      {
        title: "Video: Workflow Nexus 1",
        description: "Importacion, procesamiento y exportacion en 10 minutos",
        type: "Video"
      }
    ],
    hints: {
      upload: "Importe el archivo genomico con encabezados oficiales CDCB o Interbull",
      validation: "Revise el panel de validacion para corregir IDs ausentes o duplicados",
      refresh: "Use 'Actualizar Predicciones' para recalcular despues de corregir datos",
      export: "Exporte los resultados a XLSX y comparta con el equipo tecnico",
      integration: "Envie el lote al Plan Genetico para simular apareamientos",
      filters: "Filtre por estado de genotipado para priorizar analisis"
    }
  },

  // Nexus 2 - Prediccion por Pedigri (individual)
  "nexus2-pedigree": {
    faq: [
      {
        question: "Que datos son necesarios?",
        answer: "Informe el codigo NAAB del padre, abuelo materno y bisabuelo materno. Los campos opcionales incluyen PTA de los padres para reforzar la regresion."
      },
      {
        question: "Como funciona la regresion de pedigri?",
        answer: "Aplicamos pesos especificos para cada ancestro (padre 50%, MGS 25%, MMGS 12.5%) y ajustamos por promedio de base. El resultado se muestra como PTA estimado."
      },
      {
        question: "Puedo guardar diferentes escenarios?",
        answer: "Si. Use 'Guardar Escenario' para almacenar combinaciones de pedigri y comparar despues en informes del Nexus 2."
      }
    ],
    resources: [
      {
        title: "Guia: Nexus 2 paso a paso",
        description: "Llenado de pedigri, validaciones y exportaciones",
        type: "Guia"
      },
      {
        title: "Video: Regresion de Pedigri en la practica",
        description: "Demostracion completa con ejemplo real",
        type: "Video"
      }
    ],
    hints: {
      sire: "Digite el codigo NAAB del padre. Presione Enter para validar",
      mgs: "Informe el NAAB del abuelo materno para mejorar la precision",
      mmgs: "Complete con el bisabuelo materno cuando este disponible",
      calculate: "Haga clic en 'Calcular PTA' para generar las estimaciones inmediatamente",
      save: "Guarde escenarios frecuentes y reutilicelos desde la lista lateral",
      send: "Envie los resultados aprobados directo al rebano"
    }
  },

  // Nexus 2 - Procesamiento en Lote
  "nexus2-batch": {
    faq: [
      {
        question: "Cual es el formato del archivo en lote?",
        answer: "Utilice CSV o XLSX con encabezados: female_id, sire_naab, mgs_naab, mmgs_naab y opcionalmente PTAs observados. Proporcionamos un template listo para descarga."
      },
      {
        question: "Cual es el limite de registros por archivo?",
        answer: "Recomendamos hasta 5.000 filas por importacion para mantener el procesamiento rapido. Archivos mayores pueden dividirse."
      },
      {
        question: "Puedo enviar el resultado directo al rebano?",
        answer: "Si. Despues de la conclusion, use 'Enviar al Rebano' para actualizar todos los animales procesados."
      }
    ],
    resources: [
      {
        title: "Template Nexus 2 Lote",
        description: "Planilla con columnas obligatorias y ejemplos completados",
        type: "Guia"
      },
      {
        title: "Video: Procesamiento masivo",
        description: "Demostracion de carga, monitoreo y exportacion",
        type: "Video"
      }
    ],
    hints: {
      upload: "Cargue el archivo en lote con pedigri completo",
      template: "Descargue el template para evitar encabezados incorrectos",
      process: "Inicie el procesamiento y acompane la fila en tiempo real",
      errors: "Descargue el informe de errores para corregir registros especificos",
      results: "Exporte el archivo final con PTAs estimadas",
      send: "Envie las predicciones aprobadas directo al rebano"
    }
  },

  // Nexus 3 - Analisis de Grupos
  "nexus3-groups": {
    faq: [
      {
        question: "Como creo grupos de comparacion?",
        answer: "Defina filtros (categoria, ano, origen) y guarde cada conjunto como un grupo. Puede comparar hasta 4 grupos simultaneamente."
      },
      {
        question: "Que metricas se comparan?",
        answer: "Mostramos promedios de PTAs, distribucion por cuartiles y proyeccion de ganancias economicas para cada grupo configurado."
      },
      {
        question: "Como interpreto el grafico Madres vs. Hijas?",
        answer: "El grafico muestra la progresion entre generaciones. Puntos por encima de la linea diagonal indican evolucion positiva de las hijas en relacion a las madres."
      }
    ],
    resources: [
      {
        title: "Guia: Nexus 3",
        description: "Segmentacion, creacion de grupos y comparacion detallada",
        type: "Guia"
      },
      {
        title: "Video: Benchmark interno",
        description: "Aprenda a comparar lotes, zafras y proveedores",
        type: "Video"
      }
    ],
    hints: {
      create: "Monte grupos usando filtros por categoria, ano u origen",
      compare: "Seleccione hasta 4 grupos y visualice las diferencias de PTA",
      mothersVsDaughters: "Use el grafico Madres vs. Hijas para evaluar ganancia genetica",
      import: "Importe grupos previamente guardados en Segmentacion",
      export: "Genere un PDF con la comparacion para compartir con el equipo",
      notes: "Anote insights directamente en la barra lateral del informe"
    }
  },

  // Plan Genetico - Proyeccion
  "plano-projecao": {
    faq: [
      {
        question: "Como configuro escenarios de apareamiento?",
        answer: "Seleccione toros, defina metas de PTA y elija restricciones de consanguinidad. El simulador calcula el impacto en cada generacion."
      },
      {
        question: "Que es el ROI genetico?",
        answer: "Es el retorno financiero estimado considerando aumento de produccion, ahorro en problemas sanitarios y costo del semen."
      },
      {
        question: "Puedo comparar escenarios?",
        answer: "Si. Cree multiples escenarios y utilice la pestana 'Comparar Escenarios' para visualizar diferencias de ganancia genetica y ROI."
      }
    ],
    resources: [
      {
        title: "Guia: Planificacion Genetica",
        description: "Monte escenarios, evalue ROI e integre con el Tanque",
        type: "Guia"
      },
      {
        title: "Video: Simulador de Apareamientos",
        description: "Demostracion completa de la Proyeccion Genetica",
        type: "Video"
      }
    ],
    hints: {
      scenario: "Configure los toros y metas de PTA del escenario",
      roi: "Analice el ROI proyectado considerando costos y ganancias",
      constraints: "Use restricciones de consanguinidad para evitar cruces criticos",
      compare: "Compare escenarios para elegir la mejor estrategia",
      sendToTank: "Reserve dosis en el Tanque Virtual directo desde la proyeccion",
      export: "Exporte el plan en PDF para compartir con consultores"
    }
  },

  // Plan Genetico - Calculadora de Reposicion
  "plano-calculadora": {
    faq: [
      {
        question: "Cuales son las 7 fases de la calculadora?",
        answer: "1) Diagnostico poblacional, 2) Estrategia genetica, 3) Metas reproductivas, 4) Composicion del rebano, 5) Inversiones, 6) Ingresos proyectados, 7) ROI consolidado."
      },
      {
        question: "Como lleno los datos iniciales?",
        answer: "Informe numero de hembras por categoria, tasas de descarte y metas de reposicion. El sistema completa sugerencias basadas en benchmarks."
      },
      {
        question: "Puedo simular diferentes tasas de prenez?",
        answer: "Si. Ajuste la tasa por fase (IA convencional, sexada, embrion) y vea el impacto inmediato en los calculos de terneras necesarias."
      }
    ],
    resources: [
      {
        title: "Guia: Calculadora de Reposicion",
        description: "Entienda cada fase y los indicadores necesarios",
        type: "Guia"
      },
      {
        title: "Video: Montando el Plan en 20 minutos",
        description: "Paso a paso completo para completar todas las fases",
        type: "Video"
      }
    ],
    hints: {
      phase1: "Diagnostique el tamano del rebano y proyeccion de nacimientos",
      phase2: "Defina metas geneticas e indices objetivo",
      phase3: "Configure tasas de prenez y estrategias de IA",
      phase4: "Planifique descarte y reposicion por categoria",
      phase5: "Ingrese costos de semen, embriones y manejo",
      phase6: "Proyecte ingresos adicionales con ganancias de produccion",
      phase7: "Revise el ROI final antes de aprobar el plan"
    }
  },

  // Plan Genetico - Configurador IM5
  "plano-im5": {
    faq: [
      {
        question: "Que es el IM5$?",
        answer: "Es un indice economico personalizado con hasta 5 rasgos. Permite calcular retorno financiero por hija con base en las PTAs seleccionadas."
      },
      {
        question: "Que rasgos puedo utilizar?",
        answer: "Cualquier PTA disponible en el banco (produccion, salud, conformacion). Se recomienda combinar rasgos de lucro con caracteristicas funcionales."
      },
      {
        question: "Como defino pesos monetarios?",
        answer: "Informe el valor por unidad de PTA. Ej.: +1.0 PTAM = US$ 35.00 de ingreso/ano. La calculadora ayuda con sugerencias basadas en benchmarks."
      }
    ],
    resources: [
      {
        title: "Guia: Configurando el IM5$",
        description: "Seleccion de rasgos, pesos monetarios e interpretacion",
        type: "Guia"
      },
      {
        title: "Video: ROI con IM5$",
        description: "Vea como el indice impacta el analisis financiero",
        type: "Video"
      }
    ],
    hints: {
      traits: "Seleccione hasta 5 rasgos estrategicos para el indice",
      weights: "Defina el valor monetario para cada unidad de PTA",
      calculate: "Haga clic en 'Calcular IM5$' para generar el indice personalizado",
      apply: "Aplique el IM5$ directamente en la Proyeccion Genetica",
      presets: "Guarde presets para reutilizar en otros planificaciones",
      export: "Exporte una planilla con el desglose del IM5$"
    }
  },

  // Plan Genetico - Metas
  "plano-metas": {
    faq: [
      {
        question: "Que metas debo definir?",
        answer: "Configure metas para indices geneticos (TPI, NM$), produccion (kg leche), reproduccion (tasa de prenez) y poblacion (numero de vaquillonas)."
      },
      {
        question: "Como acompano el progreso?",
        answer: "Use los indicadores automaticos y graficos comparativos que muestran el estado actual versus la meta deseada."
      },
      {
        question: "Las metas se integran con otros modulos?",
        answer: "Si. Las metas alimentan informes de Auditoria, Segmentacion y Plan, garantizando consistencia de indicadores."
      }
    ],
    resources: [
      {
        title: "Guia: Metas SMART",
        description: "Transforme objetivos en metas medibles",
        type: "Guia"
      },
      {
        title: "Video: Ciclo PDCA en el rebano",
        description: "Como revisar metas cada trimestre",
        type: "Video"
      }
    ],
    hints: {
      categories: "Defina metas por area: genetica, reproduccion, produccion y poblacion",
      targets: "Ingrese valores numericos y plazos de logro",
      notes: "Registre planes de accion y responsables",
      reset: "Use 'Reinicializar' para volver a los valores sugeridos",
      save: "Guarde las metas para actualizar el dashboard general",
      export: "Genere un resumen en PDF para reuniones de alineacion"
    }
  },

  // Estructura Poblacional
  estrutural: {
    faq: [
      {
        question: "Que es el analisis estructural?",
        answer: "Muestra la distribucion de categorias (terneras, vaquillonas, vacas) a lo largo del tiempo, proyectando la necesidad de reposicion."
      },
      {
        question: "Como interpreto el grafico de piramide?",
        answer: "El ancho de cada franja indica la cantidad de animales por edad/paridad. Piramides desbalanceadas sugieren ajuste en el plan reproductivo."
      },
      {
        question: "Puedo simular escenarios?",
        answer: "Use los controles para ajustar tasas de descarte y nacimiento y vea el impacto inmediato en la piramide."
      }
    ],
    resources: [
      {
        title: "Guia: Estructura Poblacional",
        description: "Entienda su piramide etaria y ajuste la reposicion",
        type: "Guia"
      },
      {
        title: "Video: Diagnostico poblacional",
        description: "Ejemplos practicos de interpretacion",
        type: "Video"
      }
    ],
    hints: {
      pyramid: "Analice la piramide etaria para identificar cuellos de botella",
      sliders: "Ajuste tasas de descarte y nacimiento para simular escenarios",
      alerts: "Observe alertas automaticas de deficit o exceso",
      export: "Descargue el diagnostico en PDF para reuniones",
      integration: "Envie los datos a la Calculadora de Reposicion"
    }
  },

  // Carpeta de Archivos
  "pasta-arquivos": {
    faq: [
      {
        question: "Que archivos quedan disponibles?",
        answer: "Informes generados en la plataforma (Segmentacion, Tanque, Proyeccion, Auditoria) y cargas manuales categorizadas por modulo."
      },
      {
        question: "Como organizo mejor los archivos?",
        answer: "Use etiquetas y carpetas automaticas para separar por finca, modulo o periodo. Puede renombrar y agregar descripciones."
      },
      {
        question: "Puedo compartir con el equipo?",
        answer: "Haga clic en 'Compartir' para generar un enlace seguro con vigencia configurable o enviar por correo electronico directo desde la plataforma."
      }
    ],
    resources: [
      {
        title: "Guia: Gestion de documentos",
        description: "Buenas practicas para organizar informes geneticos",
        type: "Guia"
      },
      {
        title: "Video: Carpeta de Archivos",
        description: "Tour por la interfaz y funcionalidades de compartir",
        type: "Video"
      }
    ],
    hints: {
      upload: "Envie informes y planillas arrastrando al area destacada",
      tags: "Agregue etiquetas para facilitar la busqueda futura",
      share: "Comparta archivos con enlaces protegidos por contrasena",
      search: "Use la busqueda para encontrar informes por nombre o etiqueta",
      download: "Descargue cualquier archivo con un clic",
      history: "Acceda al historial de versiones para restaurar documentos"
    }
  },

  // Tanque Virtual
  "botijao-virtual": {
    faq: [
      {
        question: "Que es el Tanque Virtual?",
        answer: "Es una herramienta para gestionar el inventario de semen de la finca. Controle dosis disponibles, distribuya por categoria de hembras, registre abastecimientos de nitrogeno y acompane el valor del stock."
      },
      {
        question: "Como agrego toros al tanque?",
        answer: "Haga clic en 'Agregar al Tanque', busque el toro deseado, defina tipo (convencional/sexado), cantidad de dosis, precio y distribuya por categoria. Los datos se guardan automaticamente."
      },
      {
        question: "Como distribuyo dosis por categoria?",
        answer: "En la edicion de cada toro, defina cuantas dosis asignar para: Vaquillonas, Primiparas, Secundiparas, Multiparas, Donantes, Intermedias y Receptoras. El sistema valida que la suma no exceda el stock."
      },
      {
        question: "Para que sirve el registro de nitrogeno?",
        answer: "Registre cada abastecimiento de nitrogeno liquido con fecha, volumen y observaciones. Fundamental para control de costos y planificacion de reposicion."
      },
      {
        question: "Como exporto el inventario?",
        answer: "Haga clic en 'Exportar' para descargar CSV completo con todos los toros, dosis, distribuciones y valores. Use para respaldo o analisis externo."
      }
    ],
    resources: [
      {
        title: "Guia: Gestion de Inventario de Semen",
        description: "Como organizar y controlar su tanque virtual",
        type: "Guia"
      },
      {
        title: "Video: Distribucion Estrategica",
        description: "Como asignar dosis por categoria de forma eficiente",
        type: "Video"
      },
      {
        title: "Control de Costos",
        description: "Calcule el ROI de su inventario genetico",
        type: "Guia"
      }
    ],
    hints: {
      addBull: "Agregue toros al tanque para controlar inventario de semen",
      stockType: "Diferencie semen convencional y sexado para planificacion correcta",
      distribution: "Distribuya dosis por categoria antes de realizar inseminaciones",
      nitrogen: "Registre abastecimientos de nitrogeno para control de costos",
      stats: "Acompane estadisticas de dosis totales, por tipo y valor del stock",
      export: "Exporte a CSV para respaldo o analisis en otras herramientas",
      price: "Defina el precio por dosis para calcular el valor total del stock",
      categories: "7 categorias disponibles para distribucion estrategica de dosis",
      sorting: "Ordene por nombre, empresa o tipo para encontrar toros rapidamente"
    }
  },

  // Metas
  metas: {
    faq: [
      {
        question: "Para que sirven las metas?",
        answer: "Establezca objetivos medibles en 4 areas: Genetica (PTAs), Reproductiva (tasas e intervalos), Produccion (leche y calidad) y Poblacional (estructura del rebano). Acompane el progreso en tiempo real."
      },
      {
        question: "Como defino metas geneticas?",
        answer: "En la pestana 'Geneticas', defina valores actuales y metas deseadas para cada PTA (TPI, NM$, Milk, Fat, Protein, SCS, DPR, PTAT). El sistema calcula el porcentaje de progreso automaticamente."
      },
      {
        question: "Puedo personalizar las metas?",
        answer: "Las metas predeterminadas cubren los principales indicadores, pero puede agregar nuevas metas o modificar las existentes conforme a las necesidades especificas de la finca."
      },
      {
        question: "Como interpreto el progreso?",
        answer: "Las barras de progreso muestran visualmente cuanto falta para alcanzar cada meta. Valores superiores al 100% indican que ya supero el objetivo definido."
      },
      {
        question: "Los datos se guardan automaticamente?",
        answer: "Si. Todos los valores ingresados se guardan localmente en tiempo real. Use el boton 'Guardar Metas' para registrar un checkpoint especifico con fecha y hora."
      }
    ],
    resources: [
      {
        title: "Guia: Definiendo Metas Realistas",
        description: "Como establecer objetivos alcanzables y medibles",
        type: "Guia"
      },
      {
        title: "Video: Sistema de Metas",
        description: "Tour completo por las 4 categorias de metas",
        type: "Video"
      },
      {
        title: "Metas y Estrategia Genetica",
        description: "Alinee sus metas con la planificacion de apareamientos",
        type: "Guia"
      }
    ],
    hints: {
      geneticGoals: "Defina metas para PTAs alineadas con sus objetivos de seleccion",
      reproductiveGoals: "Establezca tasas reproductivas compatibles con su manejo",
      productionGoals: "Configure metas de produccion realistas para su region",
      populationGoals: "Planifique la estructura poblacional ideal del rebano",
      progress: "Acompane las barras de progreso para identificar areas criticas",
      save: "Guarde periodicamente para mantener historial de evolucion de las metas",
      reset: "Use 'Reinicializar' solo si quiere comenzar desde cero",
      tabs: "Navegue entre las 4 pestanas para gestionar diferentes tipos de metas",
      notes: "Use la pestana de anotaciones para registrar estrategias y observaciones"
    }
  }
};
