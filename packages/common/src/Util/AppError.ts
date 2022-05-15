/**
 * Represents app error like invalid user input data
 */
export interface AppError {
  readonly type: string;
  readonly code?: number;
  readonly data?: any | (() => any);
  readonly i18n?: string;

  readonly message?: string;
  readonly error?: Error;
  readonly cause?: AppError;
}

export function isAppError(value: any): value is AppError {
  return typeof value === 'object' && 'type' in value;
}

const IGNORE_ERROR_TYPE = 'ignore_error';

export function IGNORE_ERROR(): AppError {
  return { type: IGNORE_ERROR_TYPE };
}

export function isIgnoreError(e: AppError): boolean {
  return e.type === IGNORE_ERROR_TYPE;
}

const INTERNAL_ERROR_TYPE = 'internal_error';

export function INTERNAL_ERROR(error: Error): AppError {
  return {
    type: INTERNAL_ERROR_TYPE,
    code: 500,
    message: error.message,
    error,
  };
}

export function isInternalError(e: AppError): boolean {
  return e.type === INTERNAL_ERROR_TYPE;
}
