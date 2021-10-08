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

export function IGNORE_ERROR(): AppError {
  return { type: 'core.ignore_error' };
}
export function isIgnoreError(e: AppError): boolean {
  return e.type === 'core.ignore_error';
}
