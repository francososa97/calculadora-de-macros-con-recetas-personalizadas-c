// Tipos del dominio para la Base Curada de Recetas (E4-T2).
// Si en el futuro existe src/shared/types/index.ts, estos tipos pueden
// re-exportarse desde allí. Se mantienen aquí para que la feature sea
// autónoma y compile bajo TypeScript strict sin dependencias externas.

/** Los tres macronutrientes que la calculadora rastrea, en gramos. */
export interface Macros {
  /** Proteína en gramos. */
  readonly protein: number;
  /** Carbohidratos en gramos. */
  readonly carbs: number;
  /** Grasas en gramos. */
  readonly fat: number;
}

/** Objetivo nutricional principal del usuario. */
export type DietGoal = 'fat_loss' | 'muscle_gain' | 'maintenance';

/** Momento del día / tipo de comida. */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** Etiquetas dietéticas para filtrado por restricciones. */
export type DietTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'dairy_free'
  | 'high_protein'
  | 'low_carb'
  | 'quick';

/** Un ingrediente con su cantidad expresada en texto legible. */
export interface Ingredient {
  readonly name: string;
  readonly amount: string;
}

/**
 * Una receta curada. Las calorías son derivadas de los macros
 * (4/4/9 kcal por gramo) y se recalculan en la curación, por lo que
 * no forman parte del dato fuente.
 */
export interface CuratedRecipe {
  readonly id: string;
  readonly title: string;
  readonly mealTypes: readonly MealType[];
  readonly goals: readonly DietGoal[];
  readonly tags: readonly DietTag[];
  /** Macros por porción. */
  readonly macrosPerServing: Macros;
  readonly servings: number;
  /** Tiempo total de preparación + cocción en minutos. */
  readonly totalTimeMinutes: number;
  readonly ingredients: readonly Ingredient[];
  readonly steps: readonly string[];
}

/** Receta enriquecida con métricas derivadas por el servicio. */
export interface EnrichedRecipe extends CuratedRecipe {
  /** Calorías por porción, derivadas de los macros. */
  readonly caloriesPerServing: number;
  /** Porcentaje de calorías provenientes de proteína (0-100). */
  readonly proteinPct: number;
}

/** Criterios de búsqueda sobre la base curada. Todos opcionales. */
export interface RecipeQuery {
  readonly goal?: DietGoal;
  readonly mealType?: MealType;
  readonly tags?: readonly DietTag[];
  readonly maxTimeMinutes?: number;
  readonly minProtein?: number;
  readonly maxCalories?: number;
  /** Máximo de resultados a devolver. */
  readonly limit?: number;
}

/** Resultado de validar la integridad de la base curada. */
export interface CurationReport {
  readonly total: number;
  readonly withinTargetRange: boolean;
  readonly duplicateIds: readonly string[];
  readonly invalidRecipes: readonly { readonly id: string; readonly reason: string }[];
  readonly byGoal: Readonly<Record<DietGoal, number>>;
  readonly byMealType: Readonly<Record<MealType, number>>;
}
