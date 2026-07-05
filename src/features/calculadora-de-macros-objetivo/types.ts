// Tipos de dominio del motor de cálculo de macros (E2-T2).
// Se definen localmente porque src/shared/types/index.ts aún no expone
// estos contratos; cuando existan, reexportar desde shared y eliminar duplicados.

/** Sexo biológico, necesario para la fórmula de tasa metabólica basal. */
export type BiologicalSex = 'male' | 'female';

/** Objetivo nutricional del usuario. Determina el ajuste calórico y el reparto de macros. */
export type Goal = 'fat_loss' | 'maintenance' | 'muscle_gain';

/**
 * Nivel de actividad física. Se mapea a un multiplicador sobre la TMB
 * para estimar el gasto energético total diario (TDEE).
 */
export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

/** Sistema de unidades aceptado en la entrada. Internamente todo se normaliza a métrico. */
export type UnitSystem = 'metric' | 'imperial';

/** Datos de entrada del usuario para el cálculo. */
export interface MacroProfileInput {
  readonly sex: BiologicalSex;
  /** Edad en años cumplidos. */
  readonly age: number;
  /** Peso: kg si units === 'metric', lb si units === 'imperial'. */
  readonly weight: number;
  /** Altura: cm si units === 'metric', in (pulgadas) si units === 'imperial'. */
  readonly height: number;
  readonly activityLevel: ActivityLevel;
  readonly goal: Goal;
  /**
   * Sistema de unidades de weight/height. Por defecto 'metric'.
   * El resultado siempre se devuelve en unidades métricas (kg, cm) y gramos.
   */
  readonly units?: UnitSystem;
  /**
   * Ajuste calórico manual opcional que sobrescribe el preset del objetivo.
   * Número de kcal a sumar (positivo) o restar (negativo) sobre el TDEE.
   */
  readonly calorieAdjustmentOverride?: number;
}

/** Reparto de macronutrientes expresado en gramos y kilocalorías. */
export interface MacroBreakdown {
  readonly protein: MacroNutrientTarget;
  readonly carbs: MacroNutrientTarget;
  readonly fat: MacroNutrientTarget;
}

/** Objetivo de un macronutriente individual. */
export interface MacroNutrientTarget {
  /** Gramos objetivo por día. */
  readonly grams: number;
  /** Kilocalorías que aportan esos gramos. */
  readonly calories: number;
  /** Porcentaje del total calórico diario (0-100). */
  readonly percentage: number;
}

/** Resultado completo del motor de cálculo. */
export interface MacroTargets {
  /** Tasa metabólica basal (Mifflin-St Jeor), en kcal/día. */
  readonly bmr: number;
  /** Gasto energético total diario, en kcal/día. */
  readonly tdee: number;
  /** Calorías objetivo diarias ya ajustadas al objetivo del usuario. */
  readonly targetCalories: number;
  /** Diferencia aplicada sobre el TDEE (negativa en déficit, positiva en superávit). */
  readonly calorieAdjustment: number;
  readonly macros: MacroBreakdown;
}

/** Error de validación de entrada. */
export interface ValidationError {
  readonly field: keyof MacroProfileInput;
  readonly message: string;
}

/**
 * Resultado tipo `Result` para evitar excepciones en el flujo de negocio.
 * `ok: true` incluye los targets; `ok: false` incluye los errores de validación.
 */
export type MacroCalculationResult =
  | { readonly ok: true; readonly value: MacroTargets }
  | { readonly ok: false; readonly errors: readonly ValidationError[] };
