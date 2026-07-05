// Modelo de dominio para el registro diario de comidas (E3-T1).
// Estos tipos idealmente viven en src/shared/types/index.ts; se declaran aqui
// de forma local (y re-exportable) porque el modulo compartido aun no existe.

/** Conjunto de macronutrientes en gramos, mas las calorias derivadas. */
export interface Macros {
  /** Proteina en gramos. */
  readonly proteinG: number;
  /** Carbohidratos en gramos. */
  readonly carbsG: number;
  /** Grasas en gramos. */
  readonly fatG: number;
  /** Energia en kilocalorias. */
  readonly kcal: number;
}

/** Momento del dia en el que se registra una comida. */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** Un alimento concreto consumido, con su aporte de macros ya calculado. */
export interface FoodEntry {
  /** Identificador unico de la entrada dentro del registro. */
  readonly id: string;
  /** Nombre legible del alimento o producto. */
  readonly name: string;
  /** Codigo de barras (OpenFoodFacts) si el alimento fue escaneado. */
  readonly barcode: string | null;
  /** Cantidad consumida expresada en gramos. */
  readonly quantityG: number;
  /** Aporte de macros correspondiente a `quantityG`. */
  readonly macros: Macros;
  /** Momento del dia al que pertenece la entrada. */
  readonly mealType: MealType;
  /** Timestamp ISO-8601 de cuando se registro. */
  readonly loggedAt: string;
}

/** Registro completo de comidas de un usuario para un dia calendario. */
export interface DailyMealLog {
  /** Identificador del usuario dueno del registro. */
  readonly userId: string;
  /** Fecha del registro en formato ISO `YYYY-MM-DD`. */
  readonly date: string;
  /** Macros objetivo del usuario para ese dia. */
  readonly target: Macros;
  /** Entradas de alimentos registradas, en orden de insercion. */
  readonly entries: readonly FoodEntry[];
}

/** Resumen del progreso de macros de un dia: consumido, objetivo y restante. */
export interface MacroProgress {
  /** Macros objetivo del dia. */
  readonly target: Macros;
  /** Macros ya consumidos (suma de todas las entradas). */
  readonly consumed: Macros;
  /** Macros restantes (`target - consumed`, puede ser negativo si hay exceso). */
  readonly remaining: Macros;
  /** Porcentaje consumido por macro respecto al objetivo (0-100+, redondeado). */
  readonly percentConsumed: {
    readonly proteinG: number;
    readonly carbsG: number;
    readonly fatG: number;
    readonly kcal: number;
  };
}
