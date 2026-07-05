// Tipos de dominio para la Base Curada de Recetas (E4).
// Se mantienen locales al feature; cuando exista src/shared/types/index.ts
// las entidades comunes (MacroBreakdown, DietTag) deberían promoverse allí.

/** Desglose de macronutrientes en gramos, más energía en kcal. */
export interface MacroBreakdown {
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Etiquetas dietéticas soportadas por la base curada. */
export type DietTag =
  | 'high-protein'
  | 'low-carb'
  | 'keto'
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'bulking'
  | 'cutting'
  | 'maintenance';

/** Estado de curación de una receta dentro del flujo editorial. */
export type RecipeStatus = 'draft' | 'published' | 'archived';

/** Ingrediente con su aporte de macros para la cantidad indicada. */
export interface RecipeIngredient {
  readonly name: string;
  /** Cantidad en gramos del ingrediente en la receta completa. */
  readonly grams: number;
  /** Macros que aporta ESTA cantidad de ingrediente (no por 100g). */
  readonly macros: MacroBreakdown;
}

/** Receta completa tal como se persiste en la base curada. */
export interface Recipe {
  readonly id: string;
  readonly title: string;
  readonly servings: number;
  readonly ingredients: readonly RecipeIngredient[];
  readonly steps: readonly string[];
  readonly tags: readonly DietTag[];
  readonly status: RecipeStatus;
  /** Macros por porción, derivados de los ingredientes. */
  readonly macrosPerServing: MacroBreakdown;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Datos que provee el administrador al crear una receta. */
export interface CreateRecipeInput {
  readonly title: string;
  readonly servings: number;
  readonly ingredients: readonly RecipeIngredient[];
  readonly steps: readonly string[];
  readonly tags?: readonly DietTag[];
  readonly status?: RecipeStatus;
}

/** Campos editables al actualizar una receta existente. */
export interface UpdateRecipeInput {
  readonly title?: string;
  readonly servings?: number;
  readonly ingredients?: readonly RecipeIngredient[];
  readonly steps?: readonly string[];
  readonly tags?: readonly DietTag[];
  readonly status?: RecipeStatus;
}

/** Filtros para listar/buscar recetas en la herramienta de administración. */
export interface RecipeQuery {
  readonly status?: RecipeStatus;
  readonly tags?: readonly DietTag[];
  readonly minProtein?: number;
  readonly maxCalories?: number;
  readonly text?: string;
}

/** Error de validación de dominio con campo asociado. */
export class RecipeValidationError extends Error {
  readonly field: string;
  constructor(field: string, message: string) {
    super(message);
    this.name = 'RecipeValidationError';
    this.field = field;
  }
}

/** Se lanza cuando una receta referenciada no existe. */
export class RecipeNotFoundError extends Error {
  readonly recipeId: string;
  constructor(recipeId: string) {
    super(`Recipe not found: ${recipeId}`);
    this.name = 'RecipeNotFoundError';
    this.recipeId = recipeId;
  }
}
