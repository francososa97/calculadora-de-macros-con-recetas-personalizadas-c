/**
 * Tipos del Motor de Sugerencia de Recetas (Épica E5).
 *
 * NOTA: cuando `src/shared/types/index.ts` exponga estos contratos,
 * reemplazar las definiciones locales por `import type { ... } from '../../shared/types'`.
 * Se mantienen aquí para que el feature sea autocontenido y compile en strict mode.
 */

/** Macronutrientes en gramos. Base común para objetivos y recetas. */
export interface Macros {
  /** Proteína en gramos. */
  readonly protein: number;
  /** Carbohidratos en gramos. */
  readonly carbs: number;
  /** Grasas en gramos. */
  readonly fat: number;
}

/** Objetivo de macros del usuario para una comida o para el día. */
export interface MacroTarget extends Macros {
  /** Calorías objetivo. Opcional: si se omite se derivan de los macros (4/4/9). */
  readonly calories?: number;
}

/** Receta candidata a ser sugerida. Los macros son por porción. */
export interface Recipe {
  readonly id: string;
  readonly name: string;
  /** Macros por una (1) porción. */
  readonly macros: Macros;
  /** Calorías por porción. Opcional: se derivan de los macros si falta. */
  readonly calories?: number;
  /** Etiquetas dietéticas (p. ej. 'vegan', 'gluten-free'). */
  readonly tags?: readonly string[];
}

/**
 * Tolerancia de desviación permitida respecto al objetivo.
 * Se puede expresar como fracción relativa (0.15 = ±15%) por macro.
 */
export interface MacroTolerance {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Pesos de importancia por macro al calcular el score. Deben ser >= 0. */
export interface MacroWeights {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Opciones de configuración del algoritmo de filtrado. */
export interface MacroFilterOptions {
  /**
   * Tolerancia relativa por macro (fracción del objetivo).
   * Default: ±20% en cada macro.
   */
  readonly tolerance?: Partial<MacroTolerance>;
  /**
   * Pesos relativos por macro. Por defecto la proteína pesa más,
   * ya que suele ser el macro crítico en objetivos de fitness.
   */
  readonly weights?: Partial<MacroWeights>;
  /**
   * Si es true, permite escalar la receta a un número entero de porciones
   * (1..maxServings) buscando la cantidad que mejor encaje con el objetivo.
   * Default: false (se evalúa 1 porción).
   */
  readonly allowScaling?: boolean;
  /** Máximo de porciones a considerar cuando allowScaling=true. Default: 4. */
  readonly maxServings?: number;
  /**
   * Si es true, sólo se devuelven recetas dentro de la tolerancia.
   * Si es false, se devuelven todas ordenadas por score. Default: true.
   */
  readonly strict?: boolean;
  /** Limita la cantidad de resultados devueltos (top-N). */
  readonly limit?: number;
  /** Etiquetas requeridas: la receta debe contenerlas todas. */
  readonly requiredTags?: readonly string[];
  /** Etiquetas excluidas: la receta no debe contener ninguna. */
  readonly excludedTags?: readonly string[];
}

/** Detalle por macro del match de una receta. */
export interface MacroMatchDetail {
  /** Diferencia absoluta (gramos) entre receta escalada y objetivo. */
  readonly delta: number;
  /** Diferencia relativa (fracción del objetivo). */
  readonly relativeDelta: number;
  /** Si este macro cae dentro de la tolerancia configurada. */
  readonly withinTolerance: boolean;
}

/** Resultado del match de una receta contra un objetivo. */
export interface RecipeMatch {
  readonly recipe: Recipe;
  /** Score de 0 (peor) a 1 (encaje perfecto). */
  readonly score: number;
  /** Número de porciones que produce el mejor encaje. */
  readonly servings: number;
  /** Macros efectivos de la receta ya escalada por `servings`. */
  readonly effectiveMacros: Macros;
  /** Si la receta cae dentro de la tolerancia en todos los macros ponderados. */
  readonly withinTolerance: boolean;
  /** Desglose por macro. */
  readonly breakdown: {
    readonly protein: MacroMatchDetail;
    readonly carbs: MacroMatchDetail;
    readonly fat: MacroMatchDetail;
  };
}
