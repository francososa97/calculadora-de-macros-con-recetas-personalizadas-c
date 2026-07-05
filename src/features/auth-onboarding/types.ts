// Tipos locales de Auth & Onboarding.
// Nota: estos tipos son consumidos por session.ts y service.ts. Cuando exista
// src/shared/types/index.ts, `AuthUser`/`PublicUser` deben re-exportar desde ahí.

/** Usuario tal como se persiste (incluye el hash de contraseña, nunca se expone). */
export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  /** Formato: `scrypt$<saltHex>$<hashHex>`. */
  readonly passwordHash: string;
  readonly createdAt: string;
}

/** Proyección segura del usuario para enviar al cliente. */
export interface PublicUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

/** Sesión emitida tras un login válido. */
export interface Session {
  /** Token firmado (HMAC) que el cliente presenta en cada request. */
  readonly token: string;
  readonly userId: string;
  /** Epoch ms de emisión. */
  readonly issuedAt: number;
  /** Epoch ms de expiración. */
  readonly expiresAt: number;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export type AuthErrorCode =
  | 'INVALID_INPUT'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'
  | 'SESSION_NOT_FOUND';

export type LoginResult =
  | { readonly ok: true; readonly session: Session; readonly user: PublicUser }
  | { readonly ok: false; readonly error: AuthErrorCode };

/** Fuente de usuarios (adaptar a Prisma/Postgres/etc. en infra). */
export interface UserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
}

/** Almacén de sesiones (in-memory por defecto, reemplazable por Redis). */
export interface SessionStore {
  save(session: Session): Promise<void>;
  find(token: string): Promise<Session | null>;
  delete(token: string): Promise<void>;
}
