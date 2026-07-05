/**
 * Tipos del dominio para el cálculo de macros restantes (E3-T2).
 *
 * Nota: idealmente estos tipos vivirían en `src/shared/types/index.ts` y se
 * reexportarían desde aquí. Mientras ese módulo compartido no exista en el
 * repo, se declaran localmente para que la feature sea autocontenida y
 * compile en modo strict. Cuando el módulo compartido esté disponible,
 * reemplazar estas declaraciones por `export type { Macros } from '@/shared/types';`
 */

/** Los tres macronutrientes rastreados, en gramos. */
export interface Macros {
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
}

/** Macros + calorías. Las calorías se expresan en kcal. */
export interface MacroTargets extends Macros {
  readonly calories: number;
}

/**
 * Un alimento ya consumido y registrado por el usuario en el día.
 * `servings` permite escalar la porción base (ej: 1.5 raciones).
 */
export interface ConsumedEntry {
  readonly id: string;
  readonly name: string;
  readonly servings: number;
  readonly macros: Macros;
}

/** Estado de un macronutriente respecto de su objetivo. */
export type MacroStatus = 'under' | 'on-track' | 'over';

/** Detalle por macronutriente del cálculo de restantes. */
export interface MacroBreakdown {
  /** Objetivo diario (g o kcal). */
  readonly target: number;
  /** Total consumido hasta ahora (g o kcal). */
  readonly consumed: number;
  /** Restante = target - consumed. Puede ser negativo (exceso). */
  readonly remaining: number;
  /** Porcentaje consumido respecto del objetivo, 0-100+ (redondeado a 1 decimal). */
  readonly percentConsumed: number;
  /** Estado según el margen de tolerancia configurado. */
  readonly status: MacroStatus;
}

/** Resultado completo del cálculo de macros restantes para el día. */
export interface RemainingMacros {
  readonly calories: MacroBreakdown;
  readonly protein: MacroBreakdown;
  readonly carbs: MacroBreakdown;
  readonly fat: MacroBreakdown;
  /** true si todos los macros están dentro del margen o por debajo sin excesos. */
  readonly withinBudget: boolean;
}

/** Opciones de configuración del cálculo. */
export interface RemainingMacrosOptions {
  /**
   * Margen de tolerancia (fracción, ej: 0.05 = 5%) alrededor del objetivo
   * dentro del cual un macro se considera 'on-track'. Default: 0.05.
   */
  readonly toleranceRatio?: number;
}
