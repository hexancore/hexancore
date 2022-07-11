import { AppError, AppErrorProps, INTERNAL_ERROR } from './AppError';
import { AR, AsyncResult, ERRA } from './AsyncResult';

export type Result<T> = ErrorResult<T> | SuccessResult<T>;
export type R<T> = Result<T>;

export class ErrorResult<T> {
  public constructor(private readonly value: AppError) {}

  public isError(): this is ErrorResult<T> {
    return true;
  }

  public get e(): AppError {
    return this.value;
  }

  public mapErr(fn: (e: AppError) => AppError | AppErrorProps): R<T> {
    return ERR(fn(this.value));
  }

  public onErr<U>(fn: ((e: AppError) => R<U>) | Record<string, (e: AppError) => R<U>>): R<U | T> {
    if (fn instanceof Function) {
      return fn(this.value);
    }

    const c = fn[this.value.type];
    return c ? c(this.value) : this;
  }

  public isSuccess(): this is SuccessResult<T> {
    return false;
  }

  public get v(): T {
    throw new ReferenceError("Can't use on ErrorResult: " + this.value.type);
  }

  public map<U>(fn: (v: T) => U): R<U> {
    return this as unknown as Result<U>;
  }

  public onOk<U>(fn: (v: T) => R<U>): R<U> {
    return this as unknown as R<U>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onOkA<U>(fn: (v: T) => AR<U>): AR<U> {
    return ERRA(this.value);
  }
}

export class SuccessResult<T> {
  public constructor(private readonly value: T) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isError(): this is ErrorResult<T> {
    return false;
  }

  public isSuccess(): this is SuccessResult<T> {
    return true;
  }

  public get v(): T {
    return this.value;
  }

  public get e(): AppError {
    throw new ReferenceError("Can't use on SuccessResult");
  }

  public map<U>(fn: (v: T) => U): R<U> {
    return OK(fn(this.value));
  }

  /**
   * Calls function with result value when result is success
   * @param fn
   * @returns new result from function
   */
  public onOk<U>(fn: (v: T) => R<U>): R<U> {
    return fn(this.value);
  }

  public onOkA<U>(fn: (v: T) => AR<U>): AR<U> {
    return fn(this.value);
  }

  public mapErr(fn: (e: AppError) => AppError | AppErrorProps): R<T> {
    return this;
  }

  /**
   * Calls function with result value when result is error
   * @param fn
   * @returns new result from function
   */
  public onErr<U>(fn: ((e: AppError) => R<U>) | Record<string, (e: AppError) => R<U>>): R<U | T> {
    return this;
  }
}

export const OK = <T>(v: T): R<T> => {
  if (v instanceof SuccessResult || v instanceof ErrorResult) {
    return v;
  }

  return new SuccessResult<T>(v);
};

export const ERR = <T>(error: AppError | Partial<AppError> | string, code = 400, data?: any): R<T> => {
  let e: AppError;
  if (typeof error === 'string') {
    e = new AppError({ type: error, code, data });
  } else {
    e = error instanceof AppError ? error : new AppError(error);
  }
  return new ErrorResult(e);
};

export const INTERNAL_ERR = <T>(error: Error): R<T> => {
  return ERR(INTERNAL_ERROR(error));
}
