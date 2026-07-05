/**
 * E2-T3 · Persistencia y visualización de macros objetivo
 *
 * Tipos de dominio de la feature "Calculadora de Macros Objetivo".
 *
 * NOTA: cuando `src/shared/types/index.ts` exista, los tipos base
 * (`MacroGrams`, `Grams`, `Kcal`) deberían reexportarse desde allí y
 * consumirse aquí para evitar duplicación. Se definen localmente por ahora
 * para mantener la feature autocontenida y compilable en strict mode.
 */

/** Gramos de un macronutriente (>= 0). */
export type Grams = number;

/** Kilocalorías (>= 0). */
export type Kcal = number;

/** Los tres macronutrientes en gramos. */
export interface MacroGrams {
  readonly protein: Grams;
  readonly carbs: Grams;
  readonly fat: Grams;
}

/** Clave discriminada de macronutriente. */
export type MacroKey = keyof MacroGrams;

/**
 * Objetivo de macros persistido por el usuario.
 * `calories` es derivable de los gramos pero se almacena para trazabilidad.
 */
export interface MacroTarget {
  readonly id: string;
  readonly protein: Grams;
  readonly carbs: Grams;
  readonly fat: Grams;
  readonly calories: Kcal;
  /** Timestamp ISO-8601 de creación. */
  readonly createdAt: string;
  /** Timestamp ISO-8601 de la última actualización. */
  readonly updatedAt: string;
}

/** Datos mínimos necesarios para crear/actualizar un objetivo. */
export interface MacroTargetInput {
  readonly protein: Grams;
  readonly carbs: Grams;
  readonly fat: Grams;
  /** Opcional: si no se provee se calcula desde los gramos (4/4/9 kcal/g). */
  readonly calories?: Kcal;
}

/** Distribución porcentual de calorías por macro (suma ~100). */
export interface MacroDistribution {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Fila lista para visualización de un macro individual. */
export interface MacroBreakdownRow {
  readonly macro: MacroKey;
  readonly grams: Grams;
  readonly calories: Kcal;
  /** Porcentaje de las calorías totales aportado por este macro (0-100). */
  readonly caloriePercent: number;
}

/** Modelo de vista completo para renderizar el objetivo de macros. */
export interface MacroTargetView {
  readonly target: MacroTarget;
  readonly totalCalories: Kcal;
  readonly distribution: MacroDistribution;
  readonly rows: readonly MacroBreakdownRow[];
}

/** Contrato de almacenamiento sincrónico key-value (compatible con Web Storage). */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Kcal por gramo de cada macronutriente (factores de Atwater). */
export const KCAL_PER_GRAM: Readonly<Record<MacroKey, number>> = {
  protein: 4,
  carbs: 4,
  fat: 9,
};
