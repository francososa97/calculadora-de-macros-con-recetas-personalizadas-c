/**
 * Tipos del Motor de Sugerencia de Recetas (Épica E5).
 *
 * NOTA: cuando `src/shared/types/index.ts` exista en el monorepo, `MacroProfile`,
 * `MacroTargets` y `Recipe` deberían reexportarse desde allí. Se definen aquí de
 * forma local para mantener la feature autocontenida y compilable en `strict`.
 */

/** Los cuatro macronutrientes que rastrea la app, en gramos (kcal para energía). */
export interface MacroProfile {
  /** Energía total en kilocalorías. */
  readonly calories: number;
  /** Proteína en gramos. */
  readonly protein: number;
  /** Carbohidratos en gramos. */
  readonly carbs: number;
  /** Grasas en gramos. */
  readonly fat: number;
}

/** Claves de macros ponderables (energía se deriva, no se pondera directo). */
export type MacroKey = 'protein' | 'carbs' | 'fat';

/** Objetivo nutricional del usuario para el período evaluado (día o comida). */
export interface MacroTargets extends MacroProfile {}

/** Receta candidata a ser rankeada. */
export interface Recipe {
  readonly id: string;
  readonly name: string;
  /** Macros por porción de la receta. */
  readonly macrosPerServing: MacroProfile;
  /** Porciones que rinde la receta (>= 1). */
  readonly servings: number;
  /** Tags opcionales (ej: 'vegano', 'sin-gluten') para filtros aguas arriba. */
  readonly tags?: readonly string[];
}

/**
 * Pesos relativos de cada macro en el score final. No necesitan sumar 1: se
 * normalizan internamente. Permiten priorizar, p.ej., proteína para usuarios de
 * ganancia muscular.
 */
export interface MacroWeights {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Configuración del algoritmo de ranking. */
export interface RankingOptions {
  /**
   * Objetivo contra el cual se evalúa cada receta. Típicamente los macros
   * *restantes* del día (target diario menos lo ya consumido).
   */
  readonly target: MacroTargets;
  /**
   * Pesos por macro. Por defecto la proteína pesa el doble que carbos/grasas,
   * reflejando la prioridad del fitness tracker disciplinado del PRD.
   */
  readonly weights?: MacroWeights;
  /**
   * Penalización extra (0..1) aplicada al exceso sobre el objetivo respecto a
   * quedarse corto. 0 = simétrico; 0.5 = pasarse pesa 50% más. Default 0.35.
   */
  readonly overshootPenalty?: number;
  /**
   * Cantidad máxima de resultados a devolver. Si se omite, devuelve todos.
   */
  readonly limit?: number;
}

/** Desglose del score por macro, útil para explicar el ranking en la UI. */
export interface MacroScoreBreakdown {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Resultado del ranking para una receta. */
export interface RankedRecipe {
  readonly recipe: Recipe;
  /** Score global normalizado en [0, 100]; 100 = encaje perfecto. */
  readonly score: number;
  /** Score por macro en [0, 100], antes de ponderar. */
  readonly breakdown: MacroScoreBreakdown;
  /** Diferencia (receta - objetivo) por macro, en gramos. Negativo = falta. */
  readonly deltas: MacroScoreBreakdown;
}

/** Pesos por defecto: proteína priorizada. */
export const DEFAULT_MACRO_WEIGHTS: MacroWeights = {
  protein: 2,
  carbs: 1,
  fat: 1,
};

/** Penalización por exceso por defecto. */
export const DEFAULT_OVERSHOOT_PENALTY = 0.35;
