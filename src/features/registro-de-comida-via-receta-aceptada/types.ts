// Tipos de dominio para el registro de comida vía receta aceptada.
// Se definen localmente porque src/shared/types/index.ts aún no expone
// estos contratos; cuando exista, reexportar desde allí y eliminar duplicados.

/** Los cuatro macronutrientes que la calculadora rastrea. */
export interface Macros {
  /** Kilocalorías. */
  readonly calories: number;
  /** Gramos de proteína. */
  readonly protein: number;
  /** Gramos de carbohidratos. */
  readonly carbs: number;
  /** Gramos de grasa. */
  readonly fat: number;
}

/** Clave iterable de cada macro numérico. */
export type MacroKey = keyof Macros;

/** Lista canónica de macros; útil para iterar sin perder el tipado. */
export const MACRO_KEYS: readonly MacroKey[] = [
  'calories',
  'protein',
  'carbs',
  'fat',
] as const;

/** Objetivo diario de macros del usuario (target). */
export interface DailyMacroTarget {
  readonly userId: string;
  /** Día al que aplica el objetivo, en formato ISO `YYYY-MM-DD`. */
  readonly date: string;
  readonly target: Macros;
}

/** Receta aceptada por el usuario y lista para registrarse. */
export interface AcceptedRecipe {
  readonly recipeId: string;
  readonly name: string;
  /** Macros de UNA porción de la receta. */
  readonly perServing: Macros;
}

/** Entrada ya registrada en el diario de comidas del día. */
export interface LoggedMealEntry {
  readonly entryId: string;
  readonly recipeId: string;
  readonly recipeName: string;
  /** Cantidad de porciones consumidas (> 0). */
  readonly servings: number;
  /** Macros totales aportados por esta entrada (perServing * servings). */
  readonly consumed: Macros;
  /** Marca de tiempo epoch (ms) en que se registró. */
  readonly loggedAt: number;
}

/**
 * Estado de macros restantes recalculado tras cada registro.
 * `remaining` puede ser negativo si el usuario excede el objetivo.
 */
export interface RemainingMacrosState {
  readonly userId: string;
  readonly date: string;
  readonly target: Macros;
  readonly consumed: Macros;
  readonly remaining: Macros;
  /** Porcentaje consumido (0-100+) por macro; 0 si el target es 0. */
  readonly progress: Macros;
  /** Macros cuyo consumo superó el objetivo. */
  readonly exceeded: readonly MacroKey[];
  /** Entradas que componen el consumo del día. */
  readonly entries: readonly LoggedMealEntry[];
}

/** Callback notificado cada vez que cambian las macros restantes. */
export type RemainingMacrosListener = (state: RemainingMacrosState) => void;

/** Función para cancelar una suscripción. */
export type Unsubscribe = () => void;
