/**
 * Tipos del formulario de datos personales (E2-T1).
 *
 * Estos datos son la entrada base de la Calculadora de Macros Objetivo:
 * alimentan el cálculo de TMB (Mifflin-St Jeor), TDEE y el reparto de macros.
 * Se definen aquí de forma explícita porque src/shared/types/index.ts todavía
 * no expone tipos nutricionales; cuando existan, este módulo debería reexportarlos.
 */

/** Sexo biológico, requerido por las fórmulas de TMB. */
export type BiologicalSex = 'male' | 'female';

/** Sistema de unidades en el que el usuario introduce sus medidas. */
export type UnitSystem = 'metric' | 'imperial';

/** Nivel de actividad física. Cada valor mapea a un multiplicador de TDEE. */
export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

/** Objetivo nutricional del usuario. */
export type Goal = 'fat_loss' | 'maintenance' | 'muscle_gain';

/**
 * Entrada cruda del formulario. Los campos numéricos ya vienen parseados desde
 * los inputs; `unitSystem` indica cómo interpretar `weight` y `height`.
 */
export interface PersonalDataInput {
  readonly sex: BiologicalSex;
  readonly age: number;
  /** Peso en kg si `unitSystem` es 'metric', en libras si es 'imperial'. */
  readonly weight: number;
  /** Altura en cm si `unitSystem` es 'metric', en pulgadas si es 'imperial'. */
  readonly height: number;
  readonly activityLevel: ActivityLevel;
  readonly goal: Goal;
  readonly unitSystem: UnitSystem;
}

/**
 * Datos personales validados y normalizados al sistema métrico.
 * Es la forma que consumen los cálculos posteriores de la épica.
 */
export interface NormalizedPersonalData {
  readonly sex: BiologicalSex;
  readonly age: number;
  /** Peso en kilogramos. */
  readonly weightKg: number;
  /** Altura en centímetros. */
  readonly heightCm: number;
  readonly activityLevel: ActivityLevel;
  readonly goal: Goal;
}

/** Campos del formulario que pueden producir un error de validación. */
export type PersonalDataField =
  | 'sex'
  | 'age'
  | 'weight'
  | 'height'
  | 'activityLevel'
  | 'goal'
  | 'unitSystem';

/** Error de validación asociado a un campo concreto. */
export interface ValidationError {
  readonly field: PersonalDataField;
  readonly message: string;
}

/** Resultado discriminado de la validación del formulario. */
export type ValidationResult =
  | { readonly ok: true; readonly data: NormalizedPersonalData }
  | { readonly ok: false; readonly errors: readonly ValidationError[] };
