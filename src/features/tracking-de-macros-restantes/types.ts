// Tipos de dominio para el tracking de macros restantes.
// Si en el futuro existen en src/shared/types/index.ts, reemplazar por re-exports.

/** Los tres macronutrientes que se trackean, en gramos. */
export interface MacroTargets {
  /** Proteína objetivo del día, en gramos. */
  protein: number;
  /** Carbohidratos objetivo del día, en gramos. */
  carbs: number;
  /** Grasas objetivo del día, en gramos. */
  fat: number;
  /** Calorías objetivo del día, en kcal. */
  calories: number;
}

/** Macros ya consumidos en el día (misma forma que los objetivos). */
export type MacroConsumed = MacroTargets;

/** Clave de un macronutriente individual. */
export type MacroKey = keyof MacroTargets;

/** Estado de progreso de un macro respecto a su objetivo. */
export type MacroStatus = 'under' | 'on-track' | 'over';

/** Resultado calculado para un único macronutriente. */
export interface MacroProgress {
  key: MacroKey;
  /** Etiqueta legible para la UI. */
  label: string;
  /** Unidad de medida (g o kcal). */
  unit: 'g' | 'kcal';
  target: number;
  consumed: number;
  /** target - consumed. Puede ser negativo si hay exceso. */
  remaining: number;
  /** Porcentaje consumido respecto al objetivo, saturado a [0, 999]. */
  percentage: number;
  status: MacroStatus;
}

/** Snapshot completo del dashboard de macros restantes. */
export interface MacrosDashboardData {
  macros: MacroProgress[];
  /** True si algún macro superó su objetivo. */
  hasOverage: boolean;
}
