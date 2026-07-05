/**
 * Tipos del flujo de registro de usuario (E1-T1).
 *
 * Estos tipos son locales a la feature pero están diseñados para alinearse
 * con `src/shared/types/index.ts` (p. ej. `User`, `UserId`, `Result`). Cuando
 * ese módulo compartido exista, reemplazar las definiciones marcadas con
 * `// @shared` por los imports correspondientes.
 */

// @shared: mover a src/shared/types cuando esté disponible
export type UserId = string;

/** Objetivo nutricional principal del usuario (contexto del PRD). */
export type NutritionGoal = 'fat_loss' | 'muscle_gain' | 'maintenance';

/** Datos crudos que llegan desde el cliente (sin confiar en ellos). */
export interface RegistrationInput {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
  readonly goal: NutritionGoal;
}

/** Usuario ya persistido y saneado (sin credenciales sensibles expuestas). */
export interface User {
  readonly id: UserId;
  readonly email: string;
  readonly displayName: string;
  readonly goal: NutritionGoal;
  readonly createdAt: Date;
}

/** Registro de almacenamiento: incluye el hash de la contraseña. */
export interface StoredUser extends User {
  readonly passwordHash: string;
}

/** Códigos de error estables para consumo por la UI / capa HTTP. */
export type RegistrationErrorCode =
  | 'INVALID_EMAIL'
  | 'WEAK_PASSWORD'
  | 'INVALID_DISPLAY_NAME'
  | 'INVALID_GOAL'
  | 'EMAIL_ALREADY_REGISTERED';

export interface RegistrationError {
  readonly code: RegistrationErrorCode;
  readonly message: string;
  readonly field?: keyof RegistrationInput;
}

/**
 * Resultado discriminado. Evita lanzar excepciones para errores de dominio
 * esperables (validación, email duplicado) y reserva `throw` para fallos
 * de infraestructura.
 */
// @shared: candidato a moverse a src/shared/types como `Result<T, E>`
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

/** Puerto de persistencia. La implementación concreta (SQL/Prisma/etc.)
 *  vive fuera de la feature y se inyecta en el servicio. */
export interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  create(user: StoredUser): Promise<void>;
}

/** Abstracción de hashing para poder testear sin costo de CPU real. */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hash: string): Promise<boolean>;
}

/** Generador de IDs inyectable (facilita tests deterministas). */
export interface IdGenerator {
  next(): UserId;
}

/** Reloj inyectable para `createdAt` determinista en tests. */
export interface Clock {
  now(): Date;
}
