// Tipos del subdominio de etiquetado dietético (E7-T1).
// Autocontenido: si src/shared/types/index.ts expone estos tipos,
// re-exportarlos desde aquí en lugar de duplicarlos.

/** Etiquetas dietéticas soportadas por el motor de filtros. */
export type DietaryTag =
  | 'vegan'
  | 'vegetarian'
  | 'pescatarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'egg-free'
  | 'nut-free'
  | 'soy-free'
  | 'keto'
  | 'low-carb'
  | 'high-protein';

/** Categorías de origen de un ingrediente, usadas para inferir etiquetas. */
export type IngredientCategory =
  | 'meat'
  | 'poultry'
  | 'fish'
  | 'shellfish'
  | 'dairy'
  | 'egg'
  | 'gluten'
  | 'nut'
  | 'soy'
  | 'legume'
  | 'vegetable'
  | 'fruit'
  | 'grain'
  | 'fat'
  | 'sweetener'
  | 'other';

/** Macros por porción de la receta (gramos), reusable con shared/types. */
export interface Macros {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly calories: number;
}

/** Ingrediente normalizado de una receta. */
export interface RecipeIngredient {
  readonly id: string;
  readonly name: string;
  readonly category: IngredientCategory;
  /** Cantidad en gramos por porción (opcional, no requerido para etiquetar). */
  readonly grams?: number;
}

/** Entrada mínima que necesita el etiquetador. */
export interface TaggableRecipe {
  readonly id: string;
  readonly name: string;
  readonly ingredients: readonly RecipeIngredient[];
  readonly macrosPerServing: Macros;
}

/** Explicación de por qué una etiqueta NO se pudo aplicar. */
export interface TagExclusion {
  readonly tag: DietaryTag;
  readonly reason: string;
  /** ids de ingredientes que bloquearon la etiqueta. */
  readonly blockedBy: readonly string[];
}

/** Resultado del etiquetado de una receta. */
export interface DietaryTaggingResult {
  readonly recipeId: string;
  readonly tags: readonly DietaryTag[];
  readonly exclusions: readonly TagExclusion[];
}

/** Umbrales configurables para etiquetas basadas en macros. */
export interface MacroTagThresholds {
  /** Carbohidratos máx (g/porción) para 'keto'. */
  readonly ketoMaxCarbs: number;
  /** Carbohidratos máx (g/porción) para 'low-carb'. */
  readonly lowCarbMaxCarbs: number;
  /** Fracción mínima de calorías provenientes de proteína para 'high-protein'. */
  readonly highProteinMinCalorieFraction: number;
}

export const DEFAULT_MACRO_THRESHOLDS: MacroTagThresholds = {
  ketoMaxCarbs: 10,
  lowCarbMaxCarbs: 25,
  highProteinMinCalorieFraction: 0.3,
};
