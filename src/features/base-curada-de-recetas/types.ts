// src/features/base-curada-de-recetas/types.ts
// Tipos del dominio para la API de consulta de recetas (E4-T3).
// Nota: idealmente estos tipos base viven en src/shared/types/index.ts y se
// re-exportan desde aquí. Como esa ubicación aún no existe en el repo, se
// definen aquí de forma autocontenida y se marcan para futura extracción.

/** Los tres macronutrientes que el usuario objetivo cuadra a diario. */
export interface Macros {
  /** Proteína en gramos. */
  readonly protein: number;
  /** Carbohidratos en gramos. */
  readonly carbs: number;
  /** Grasas en gramos. */
  readonly fat: number;
}

/** Ficha nutricional de una porción de receta. */
export interface NutritionPerServing extends Macros {
  /** Calorías totales de la porción. */
  readonly calories: number;
}

/** Etiquetas de dieta soportadas por la base curada. */
export type DietTag =
  | 'vegan'
  | 'vegetarian'
  | 'pescatarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'keto'
  | 'low-carb'
  | 'high-protein';

/** Momento de consumo sugerido. */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** Una receta de la base curada (10k+). */
export interface Recipe {
  readonly id: string;
  readonly title: string;
  readonly mealType: MealType;
  /** Minutos totales de preparación + cocción. */
  readonly totalTimeMinutes: number;
  readonly servings: number;
  readonly nutrition: NutritionPerServing;
  readonly dietTags: readonly DietTag[];
  readonly ingredients: readonly string[];
}

/** Rango inclusivo [min, max]; cualquiera de los extremos es opcional. */
export interface Range {
  readonly min?: number;
  readonly max?: number;
}

/** Criterio de ordenamiento del resultado. */
export type RecipeSortField =
  | 'relevance'
  | 'protein'
  | 'calories'
  | 'totalTime';

export type SortDirection = 'asc' | 'desc';

export interface RecipeSort {
  readonly field: RecipeSortField;
  readonly direction: SortDirection;
}

/**
 * Parámetros de consulta. Todos opcionales: una consulta vacía devuelve la
 * primera página de todas las recetas ordenadas por relevancia.
 */
export interface RecipeQuery {
  /** Búsqueda de texto libre sobre título e ingredientes. */
  readonly search?: string;
  readonly mealType?: MealType;
  /** La receta debe incluir TODAS estas etiquetas de dieta. */
  readonly dietTags?: readonly DietTag[];
  /** La receta debe incluir TODOS estos ingredientes (match parcial, case-insensitive). */
  readonly includeIngredients?: readonly string[];
  /** La receta NO debe incluir ninguno de estos ingredientes. */
  readonly excludeIngredients?: readonly string[];
  readonly protein?: Range;
  readonly carbs?: Range;
  readonly fat?: Range;
  readonly calories?: Range;
  /** Tope de minutos de preparación. */
  readonly maxTotalTimeMinutes?: number;
  /**
   * Macros objetivo por porción. Si se provee, se calcula un score de encaje
   * y habilita el orden por 'relevance'.
   */
  readonly targetMacros?: Macros;
  readonly sort?: RecipeSort;
  /** Página basada en 1. Default: 1. */
  readonly page?: number;
  /** Tamaño de página (1..100). Default: 20. */
  readonly pageSize?: number;
}

/** Una receta enriquecida con su puntaje de encaje frente a los macros objetivo. */
export interface ScoredRecipe {
  readonly recipe: Recipe;
  /**
   * Encaje con los macros objetivo en [0, 1] (1 = perfecto). Es null cuando la
   * consulta no incluyó targetMacros.
   */
  readonly matchScore: number | null;
}

/** Resultado paginado de una consulta. */
export interface RecipeQueryResult {
  readonly items: readonly ScoredRecipe[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

/** Fuente de datos abstracta: permite conectar memoria, DB o índice externo. */
export interface RecipeRepository {
  /** Devuelve el universo de recetas sobre el que se aplican los filtros. */
  getAll(): readonly Recipe[];
}
