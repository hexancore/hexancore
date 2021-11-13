import { AppError, isIgnoreError, INTERNAL_ERROR } from './AppError';
import { error, Result, success } from './Result';

export class AsyncResult<T> implements PromiseLike<Result<T>> {
  public readonly promise: Promise<Result<T>>;

  public constructor(promise: Promise<Result<T>>) {
    this.promise = promise;
  }

  public static fromSafePromise<T>(promise: Promise<T>): AsyncResult<T> {
    const newPromise = promise.then((value: T) => success<T>(value));
    return new AsyncResult(newPromise);
  }

  public static fromPromise<T>(promise: Promise<T>, errorFn?: (e: unknown) => AppError): AsyncResult<T> {

    errorFn = errorFn ?? ((e: unknown) => INTERNAL_ERROR(e as Error));
    
    const newPromise = promise
      .then((value: T) => success<T>(value))
      .catch((e) => {
        return error<T>(errorFn(e));
      });

    return new AsyncResult(newPromise);
  }

  public map<A>(f: (v: T) => A | Promise<A>): AsyncResult<A> {
    return new AsyncResult(
      this.promise.then(async (res: Result<T>) => {
        if (res.isError()) {
          return error<A>(res.value);
        }

        return success<A>(await f(res.unwarp()));
      }),
    );
  }

  public mapToTrue(): AsyncResult<boolean> {
    return new AsyncResult(
      this.promise.then(() => {
        return success(true);
      }),
    );
  }

  public mapError(f: (e: AppError) => AppError | Promise<AppError>): AsyncResult<T> {
    return new AsyncResult(
      this.promise.then(async (res: Result<T>) => {
        if (res.isSuccess()) {
          return success<T>(res.value);
        }

        return error<T>(await f(res.value));
      }),
    );
  }

  public andThen<U>(f: (v: T) => Result<U> | AsyncResult<U>): AsyncResult<U> {
    return new AsyncResult(
      this.promise.then((res) => {
        if (res.isError()) {
          return error<U>(res.value);
        }

        const newValue = f(res.value);
        return newValue instanceof AsyncResult ? newValue.promise : newValue;
      }),
    );
  }

  public orElse(f: (e: AppError) => Result<T> | AsyncResult<T>): AsyncResult<T> {
    return new AsyncResult(
      this.promise.then(async (res: Result<T>) => {
        if (res.isError()) {
          return f(res.value);
        }

        return success<T>(res.value);
      }),
    );
  }

  public then<A, B>(
    successCallback?: (res: Result<T>) => A | PromiseLike<A>,
    failureCallback?: (reason: unknown) => B | PromiseLike<B>,
  ): PromiseLike<A | B> {
    return this.promise.then(successCallback, failureCallback);
  }
}

export const successAsync = <T>(v: T): AsyncResult<T> => new AsyncResult(Promise.resolve(success<T>(v)));

export const errorAsync = <T>(err: AppError): AsyncResult<T> => new AsyncResult(Promise.resolve(error<T>(err)));

export const fromPromise = AsyncResult.fromPromise;
export const fromSafePromise = AsyncResult.fromSafePromise;
