import { AppError, isAppError } from './AppError';
import { AsyncResult, errorAsync } from './AsyncResult';
export type Result<T> = ErrorResult<T> | SuccessResult<T>;

type MapFunc = <T, U>(v: T) => U;
type MapErrorFunc = (e: AppError) => AppError;
type AndThenFunc = <T, U>(v: T) => Result<U>;
type OrElseFunc = <T>(e: AppError) => Result<T>;

export class ErrorResult<T> {
  public readonly value: AppError;

  public constructor(value: AppError) {
    this.value = value;
  }

  public isError(): this is ErrorResult<T> {
    return true;
  }

  public isSuccess(): this is SuccessResult<T> {
    return false;
  }

  public unwarp(): T {
    throw new ReferenceError("Can't unwarp on ErrorResult: " + this.value.type);
  }

  public getErrorType(): string {
    return this.value.type;
  }

  public getError(): Error {
    return this.value.error;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(fn: MapFunc): Result<U> {
    return error(this.value);
  }

  public mapError(fn: MapErrorFunc): Result<T> {
    return error(fn(this.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public andThen<U>(fn: AndThenFunc): Result<U> {
    return error(this.value);
  }

  public orElse(fn: OrElseFunc): Result<T> {
    return fn(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public andThenAsync<U>(f: (v: T) => AsyncResult<U>): AsyncResult<U> {
    return errorAsync<U>(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public asyncMap<U>(_f: (t: T) => Promise<U>): AsyncResult<U> {
    return errorAsync<U>(this.value);
  }
}

export class SuccessResult<T> {
  public readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isError(type?: string): this is ErrorResult<T> {
    return false;
  }

  public isSuccess(): this is SuccessResult<T> {
    return true;
  }

  public unwarp(): T {
    return this.value;
  }

  public getErrorType(): string {
    throw new ReferenceError("Can't use on SuccessResult");
  }

  public getError(): Error {
    throw new ReferenceError("Can't use on SuccessResult");
  }

  public map<U>(fn: MapFunc): Result<U> {
    return success(fn(this.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public mapError(fn: MapErrorFunc): Result<T> {
    return this;
  }

  public andThen<U>(f: AndThenFunc): Result<U> {
    return f(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public orElse(f: OrElseFunc): Result<T> {
    return success(this.value);
  }

  public andThenAsync<U>(f: (t: T) => AsyncResult<U>): AsyncResult<U> {
    return f(this.value);
  }

  public mapAsync<U>(f: (t: T) => Promise<U>): AsyncResult<U> {
    return AsyncResult.fromSafePromise(f(this.value));
  }
}

export const error = <T>(error: AppError | string, code = 400): Result<T> => {
  return new ErrorResult((isAppError(error) ? <AppError>error : { type: <string>error, code }));
};

export const success = <T>(result: T): Result<T> => {
  if (result instanceof SuccessResult || result instanceof ErrorResult) {
    return result;
  }

  return new SuccessResult<T>(result);
};
