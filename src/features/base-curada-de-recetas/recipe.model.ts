/**
 * E4-T1 — Modelo de datos de receta (Épica: Base Curada de Recetas)
 *
 * Tipos de dominio para una receta dentro de la base curada. El diseño gira
 * en torno a los macros por porción, ya que el motor de recomendación necesita
 * comparar el aporte nutricional de cada receta contra los objetivos del usuario.
 *
 * NOTA: cuando `src/shared/types/index.ts` esté disponible, `MacroNutrients`,
 * `Grams` y `Kilocalories` deberían reexportarse desde allí para evitar
 * duplicación. Se definen aquí de forma explícita para mantener el modelo
 * autocontenido y compilable bajo `strict`.
 */

/** Gramos de un macronutriente o ingrediente. Siempre >= 0. */
export type Grams = number;

/** Kilocalorías. Siempre >= 0. */
export type Kilocalories = number;

/** Minutos de preparación/cocción. Siempre >= 0. */
export type Minutes = number;

/** Identificador único y estable de una receta dentro de la base curada. */
export type RecipeId = string;

/**
 * Aporte de macronutrientes. Es la unidad de comparación central entre lo que
 * el usuario necesita y lo que una receta ofrece.
 */
export interface MacroNutrients {
  readonly calories: Kilocalories;
  readonly protein: Grams;
  readonly carbs: Grams;
  readonly fat: Grams;
  /** Fibra en gramos. Opcional: no todas las fuentes la reportan. */
  readonly fiber?: Grams;
}

/** Unidades de medida soportadas para las cantidades de ingredientes. */
export type MeasurementUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'unidad'
  | 'cucharada'
  | 'cucharadita'
  | 'taza'
  | 'pizca';

/**
 * Un ingrediente de la receta. `openFoodFactsId` permite enlazar con el
 * producto escaneado de OpenFoodFacts para recalcular macros si cambia la
 * cantidad.
 */
export interface RecipeIngredient {
  readonly name: string;
  readonly quantity: number;
  readonly unit: MeasurementUnit;
  /** Código de barras / id del producto en OpenFoodFacts, si aplica. */
  readonly openFoodFactsId?: string;
  /** Marca el ingrediente como opcional dentro de la receta. */
  readonly optional?: boolean;
}

/** Un paso individual de preparación, ordenado por `order`. */
export interface RecipeStep {
  /** Posición 1-indexada del paso dentro del instructivo. */
  readonly order: number;
  readonly instruction: string;
  /** Duración estimada del paso, si es relevante para el usuario. */
  readonly durationMinutes?: Minutes;
}

/** Nivel de dificultad de la preparación. */
export type RecipeDifficulty = 'facil' | 'media' | 'dificil';

/** Momento del día sugerido para la receta. */
export type MealType = 'desayuno' | 'almuerzo' | 'cena' | 'snack' | 'postre';

/** Etiquetas dietéticas para filtrado y matching con preferencias del usuario. */
export type DietaryTag =
  | 'vegano'
  | 'vegetariano'
  | 'sin-gluten'
  | 'sin-lactosa'
  | 'keto'
  | 'bajo-en-carbos'
  | 'alto-en-proteina'
  | 'sin-frutos-secos';

/**
 * Receta curada. Entidad raíz de la épica. Todos los campos de macros se
 * expresan **por porción** (`macrosPerServing`) para que el matching contra los
 * objetivos del usuario sea directo, independientemente de `servings`.
 */
export interface Recipe {
  readonly id: RecipeId;
  readonly name: string;
  readonly description: string;
  /** Número de porciones que rinde la receta completa. Entero >= 1. */
  readonly servings: number;
  readonly prepTimeMinutes: Minutes;
  readonly cookTimeMinutes: Minutes;
  readonly difficulty: RecipeDifficulty;
  readonly mealTypes: readonly MealType[];
  readonly dietaryTags: readonly DietaryTag[];
  readonly ingredients: readonly RecipeIngredient[];
  readonly steps: readonly RecipeStep[];
  /** Aporte nutricional de UNA porción. */
  readonly macrosPerServing: MacroNutrients;
  /** URL de la imagen principal, si existe. */
  readonly imageUrl?: string;
  /** Origen/cocina, p.ej. 'mexicana', 'mediterranea'. Libre. */
  readonly cuisine?: string;
  /** ISO 8601. Metadatos de curación. */
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Tiempo total de una receta (prep + cocción). Helper puro reutilizado por la
 * UI y por los filtros de "recetas rápidas".
 */
export function totalTimeMinutes(recipe: Recipe): Minutes {
  return recipe.prepTimeMinutes + recipe.cookTimeMinutes;
}

/**
 * Macros de la receta COMPLETA (todas las porciones). Útil para meal-prep.
 */
export function totalMacros(recipe: Recipe): MacroNutrients {
  const per = recipe.macrosPerServing;
  const s = recipe.servings;
  return {
    calories: per.calories * s,
    protein: per.protein * s,
    carbs: per.carbs * s,
    fat: per.fat * s,
    ...(per.fiber !== undefined ? { fiber: per.fiber * s } : {}),
  };
}
