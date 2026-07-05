// Tipos del dominio para la aceptación de una receta sugerida y su registro como comida.
// Se mantienen locales al feature; cuando src/shared/types/index.ts exponga estos tipos,
// reemplazar por `export type { ... } from '../../shared/types'`.

/** Macronutrientes en gramos + energía en kcal. */
export interface Macros {
  readonly calorias: number;
  readonly proteina: number;
  readonly carbohidratos: number;
  readonly grasas: number;
}

/** Momento del día en el que se registra la comida. */
export type TipoComida = 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';

/** Receta sugerida por el motor de recomendación. Los macros son por porción. */
export interface RecetaSugerida {
  readonly id: string;
  readonly nombre: string;
  /** Cantidad de porciones que rinde la receta completa. */
  readonly porciones: number;
  /** Macros por UNA porción. */
  readonly macrosPorPorcion: Macros;
}

/** Objetivo diario de macros del usuario. */
export interface ObjetivoDiario {
  readonly usuarioId: string;
  readonly fecha: string; // ISO date 'YYYY-MM-DD'
  readonly objetivo: Macros;
}

/** Entrada persistida tras aceptar una receta. */
export interface RegistroComida {
  readonly id: string;
  readonly usuarioId: string;
  readonly fecha: string; // ISO date 'YYYY-MM-DD'
  readonly tipoComida: TipoComida;
  readonly recetaId: string;
  readonly nombreReceta: string;
  readonly porcionesConsumidas: number;
  /** Macros efectivamente consumidos = macrosPorPorcion * porcionesConsumidas. */
  readonly macrosConsumidos: Macros;
  readonly aceptadaEn: string; // ISO datetime
}

/** Comando de entrada para aceptar una receta sugerida. */
export interface AceptarRecetaInput {
  readonly usuarioId: string;
  readonly fecha: string; // ISO date 'YYYY-MM-DD'
  readonly tipoComida: TipoComida;
  readonly receta: RecetaSugerida;
  /** Porciones que el usuario declara haber comido. Default: 1. */
  readonly porcionesConsumidas?: number;
  /**
   * Clave de idempotencia opcional. Si el mismo comando se reenvía con la misma
   * clave, no se duplica el registro.
   */
  readonly idempotencyKey?: string;
}

/** Progreso del día luego de sumar el nuevo registro. */
export interface ProgresoDiario {
  readonly consumido: Macros;
  readonly objetivo: Macros;
  readonly restante: Macros;
  /** Porcentaje 0..100+ de avance hacia el objetivo, por macro. */
  readonly porcentaje: Macros;
}

/** Resultado de aceptar una receta. */
export interface AceptarRecetaResult {
  readonly registro: RegistroComida;
  readonly progreso: ProgresoDiario;
  /** true si el registro ya existía (idempotencia) y no se creó uno nuevo. */
  readonly yaRegistrada: boolean;
}

/** Puerto de persistencia de registros de comida. */
export interface RegistroComidaRepository {
  guardar(registro: RegistroComida): Promise<void>;
  listarPorDia(usuarioId: string, fecha: string): Promise<readonly RegistroComida[]>;
  buscarPorIdempotencyKey(
    usuarioId: string,
    idempotencyKey: string,
  ): Promise<RegistroComida | null>;
}

/** Puerto de lectura del objetivo diario del usuario. */
export interface ObjetivoDiarioRepository {
  obtener(usuarioId: string, fecha: string): Promise<ObjetivoDiario | null>;
}

/** Dependencias inyectables (facilita testing y desacopla infraestructura). */
export interface AceptarRecetaDeps {
  readonly registros: RegistroComidaRepository;
  readonly objetivos: ObjetivoDiarioRepository;
  /** Genera IDs únicos para el registro. */
  readonly generarId: () => string;
  /** Reloj inyectable; retorna ISO datetime. */
  readonly ahora: () => string;
}

/** Error de dominio con código estable para el consumidor. */
export class AceptarRecetaError extends Error {
  constructor(
    public readonly codigo:
      | 'INPUT_INVALIDO'
      | 'PORCIONES_INVALIDAS'
      | 'MACROS_INVALIDOS'
      | 'OBJETIVO_NO_ENCONTRADO',
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'AceptarRecetaError';
  }
}
