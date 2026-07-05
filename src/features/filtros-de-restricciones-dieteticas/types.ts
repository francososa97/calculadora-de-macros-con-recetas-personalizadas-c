/**
 * Tipos del dominio de restricciones dietéticas.
 *
 * NOTA: Cuando `src/shared/types/index.ts` exista, `DietaryRestriction` y
 * `RecipeDietaryTags` deberían moverse allí y reexportarse desde este módulo.
 * Se definen localmente aquí para que la feature sea autocontenida y compile
 * en TypeScript strict sin dependencias externas.
 */

/** Restricciones dietéticas soportadas por el filtro. */
export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'egg-free'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'pescatarian';

/** Lista canónica e inmutable de todas las restricciones conocidas. */
export const ALL_DIETARY_RESTRICTIONS: readonly DietaryRestriction[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'egg-free',
  'keto',
  'paleo',
  'low-carb',
  'pescatarian',
] as const;

/** Etiquetas legibles para renderizar cada toggle en la UI. */
export const DIETARY_RESTRICTION_LABELS: Readonly<Record<DietaryRestriction, string>> = {
  vegetarian: 'Vegetariano',
  vegan: 'Vegano',
  'gluten-free': 'Sin gluten',
  'dairy-free': 'Sin lácteos',
  'nut-free': 'Sin frutos secos',
  'egg-free': 'Sin huevo',
  keto: 'Keto',
  paleo: 'Paleo',
  'low-carb': 'Bajo en carbohidratos',
  pescatarian: 'Pescetariano',
};

/**
 * Etiquetas dietéticas que cumple una receta. Cada clave presente y en `true`
 * indica que la receta satisface esa restricción.
 */
export type RecipeDietaryTags = Readonly<Partial<Record<DietaryRestriction, boolean>>>;

/** Subconjunto mínimo de una receta necesario para el filtrado. */
export interface FilterableRecipe {
  readonly id: string;
  readonly dietaryTags: RecipeDietaryTags;
}

/** Representación de un toggle individual lista para renderizar en la UI. */
export interface DietaryFilterToggleView {
  readonly restriction: DietaryRestriction;
  readonly label: string;
  readonly active: boolean;
}

/** Estado completo del panel de filtros, consumible por la capa de UI. */
export interface DietaryFilterState {
  readonly toggles: readonly DietaryFilterToggleView[];
  readonly activeCount: number;
}

/** Type guard: valida en runtime que un string es una `DietaryRestriction`. */
export function isDietaryRestriction(value: string): value is DietaryRestriction {
  return (ALL_DIETARY_RESTRICTIONS as readonly string[]).includes(value);
}
