const IGNORE_ERROR_TYPE = 'core.ignore_error';
const INTERNAL_ERROR_TYPE = 'core.internal_error';

export type AppErrorProps = {
  [P in keyof AppError]?: AppError[P];
};

/**
 * Represents app error like invalid user input data
 */
export class AppError<ET = Error> {
  public readonly type: string;
  public readonly code?: number;
  public readonly data?: any;
  public readonly i18n?: string;
  public readonly message?: string;
  public readonly error?: ET;
  public readonly cause?: AppError<Error>;

  public constructor(props: AppErrorProps) {
    Object.assign(this, props);
  }

  public static IGNORE() {
    return new this({ type: IGNORE_ERROR_TYPE });
  }

  public static INTERNAL() {
    return new this({ type: INTERNAL_ERROR_TYPE });
  }

  public isIgnoreError(): boolean {
    return this.type === IGNORE_ERROR_TYPE;
  }

  public isInternalError(): boolean {
    return this.type === INTERNAL_ERROR_TYPE;
  }

  public toJSON() {
    const r: any = Object.assign({}, this);
    if (r.error) {
      r.error = JSON.stringify(r.error, Object.getOwnPropertyNames(r.error));
    }
    return r;
  }
}

export function isAppError(value: any): value is AppError {
  return value instanceof AppError;
}

export function IGNORE_ERROR(): AppError {
  return new AppError({ type: IGNORE_ERROR_TYPE });
}

export function isIgnoreError(e: AppError): boolean {
  return e.type === IGNORE_ERROR_TYPE;
}

export function INTERNAL_ERROR(error: Error): AppError {
  return new AppError({
    type: INTERNAL_ERROR_TYPE,
    code: 500,
    message: error.message,
    error,
  });
}

export function isInternalError(e: AppError): boolean {
  return e.type === INTERNAL_ERROR_TYPE;
}
