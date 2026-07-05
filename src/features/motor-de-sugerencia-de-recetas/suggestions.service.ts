// Motor de Sugerencia de Recetas — capa de servicio (E5-T3)
// Puntúa y ordena recetas segÃºn qué tan bien encajan con los macros objetivo del usuario.
// Reusa/define los tipos compartidos de dominio nutricional.

/** Macros expresados en gramos (proteína, carbohidratos, grasa). */
export interface Macros {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Objetivo diario del usuario, incluye calorías derivadas. */
export interface MacroTarget extends Macros {
  readonly calories: number;
}

/** Receta tal como llega desde la base de 10k+ recetas. */
export interface Recipe {
  readonly id: string;
  readonly name: string;
  readonly imageUrl?: string;
  readonly servings: number;
  /** Macros por porción. */
  readonly perServing: MacroTarget;
  readonly prepMinutes: number;
  readonly tags: readonly string[];
}

/** Filtros opcionales que el usuario puede aplicar sobre las sugerencias. */
export interface SuggestionFilters {
  readonly maxPrepMinutes?: number;
  readonly includeTags?: readonly string[];
  readonly excludeTags?: readonly string[];
}

export interface SuggestionQuery {
  readonly target: MacroTarget;
  readonly recipes: readonly Recipe[];
  readonly filters?: SuggestionFilters;
  /** Máximo de resultados a devolver. Default 20. */
  readonly limit?: number;
}

/** Receta sugerida con su puntaje de encaje (0..100) y desvío por macro. */
export interface RecipeSuggestion {
  readonly recipe: Recipe;
  /** 100 = encaje perfecto con el objetivo. */
  readonly matchScore: number;
  /** Desvío relativo por macro respecto al objetivo, firmado (positivo = excede). */
  readonly deviation: Macros & { readonly calories: number };
}

const DEFAULT_LIMIT = 20;

// Peso de cada macro en el puntaje: la proteína suele ser la restricción dura
// para el fitness tracker, por eso pesa más que carbohidratos y grasas.
const MACRO_WEIGHTS = {
  protein: 0.4,
  carbs: 0.3,
  fat: 0.3,
} as const;

function relativeDeviation(actual: number, target: number): number {
  if (target <= 0) {
    return actual === 0 ? 0 : 1;
  }
  return (actual - target) / target;
}

/**
 * Calcula un puntaje de encaje 0..100 comparando los macros de una porción
 * contra el objetivo. Penaliza el desvío absoluto ponderado por macro.
 */
export function scoreRecipe(recipe: Recipe, target: MacroTarget): RecipeSuggestion {
  const perServing = recipe.perServing;

  const deviation = {
    protein: relativeDeviation(perServing.protein, target.protein),
    carbs: relativeDeviation(perServing.carbs, target.carbs),
    fat: relativeDeviation(perServing.fat, target.fat),
    calories: relativeDeviation(perServing.calories, target.calories),
  };

  const weightedError =
    Math.abs(deviation.protein) * MACRO_WEIGHTS.protein +
    Math.abs(deviation.carbs) * MACRO_WEIGHTS.carbs +
    Math.abs(deviation.fat) * MACRO_WEIGHTS.fat;

  // weightedError = 0 -> 100. Se satura en 0 cuando el error medio llega a 1 (100%).
  const matchScore = Math.max(0, Math.round((1 - Math.min(weightedError, 1)) * 100));

  return { recipe, matchScore, deviation };
}

function passesFilters(recipe: Recipe, filters: SuggestionFilters | undefined): boolean {
  if (!filters) {
    return true;
  }
  if (
    typeof filters.maxPrepMinutes === 'number' &&
    recipe.prepMinutes > filters.maxPrepMinutes
  ) {
    return false;
  }
  if (filters.excludeTags?.some((tag) => recipe.tags.includes(tag))) {
    return false;
  }
  if (
    filters.includeTags &&
    filters.includeTags.length > 0 &&
    !filters.includeTags.every((tag) => recipe.tags.includes(tag))
  ) {
    return false;
  }
  return true;
}

/**
 * Genera la lista de sugerencias ordenadas de mejor a peor encaje.
 * Aplica filtros, puntúa y desempata por menor tiempo de preparación.
 */
export function suggestRecipes(query: SuggestionQuery): RecipeSuggestion[] {
  const limit = query.limit ?? DEFAULT_LIMIT;

  return query.recipes
    .filter((recipe) => passesFilters(recipe, query.filters))
    .map((recipe) => scoreRecipe(recipe, query.target))
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.recipe.prepMinutes - b.recipe.prepMinutes;
    })
    .slice(0, Math.max(0, limit));
}
