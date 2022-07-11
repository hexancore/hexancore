import { AppError, AppErrorProps, INTERNAL_ERROR } from './AppError';
import { ERR, OK, Result } from './Result';
import { DropLastParam } from './types';

/**
 * Alias type Promise<Result<T>>
 */
export type ARP<T> = Promise<Result<T>>;

/**
 * Alias type Promise<Result<boolean>>
 */
export type BoolAsyncResultPromise = Promise<Result<boolean>>;

export type SAR<U> = Result<U> | AsyncResult<U>;
export type AR<T> = AsyncResult<T>;

export class AsyncResult<T> implements PromiseLike<Result<T>> {
  private callbackThis: any;

  public constructor(public readonly p: ARP<T>) {}

  public static fromSafePromise<T>(promise: Promise<T>): AsyncResult<T> {
    const newPromise = promise.then((value: T) => OK<T>(value));
    return new AsyncResult(newPromise);
  }

  public static fromPromise<T>(promise: Promise<T>, errorFn?: (e: unknown) => AppError | AppErrorProps): AsyncResult<T> {
    errorFn = errorFn ?? ((e: unknown) => INTERNAL_ERROR(e as Error));

    const newPromise = promise
      .then((value: T) => OK<T>(value))
      .catch((e) => {
        return ERR<T>(errorFn(e));
      });

    return new AsyncResult(newPromise);
  }

  public static fromPromiseOkTrue(promise: Promise<any>, errorFn?: (e: unknown) => AppError | AppErrorProps): AsyncResult<boolean> {
    errorFn = errorFn ?? ((e: unknown) => INTERNAL_ERROR(e as Error));

    const newPromise = promise
      .then(() => OK<boolean>(true))
      .catch((e) => {
        return ERR<boolean>(errorFn(e));
      });

    return new AsyncResult(newPromise).mapToTrue();
  }

  public bind(thisArg: any): AsyncResult<T> {
    this.callbackThis = thisArg;
    return this;
  }

  /**
   * backward compatibility use `p` property;
   */
  public get promise(): ARP<T> {
    return this.p;
  }

  public map<U>(f: (v: T) => U | Promise<U>): AR<U> {
    return new AsyncResult(
      this.p.then(async (res: Result<T>) => {
        if (res.isError()) {
          return ERR<U>(res.e);
        }

        return OK<U>(await f(res.v));
      }),
    );
  }

  public mapToTrue(): AR<boolean> {
    return this.map(() => true);
  }

  public mapErr(f: (e: AppError) => AppError | AppErrorProps | Promise<AppError | AppErrorProps>): AR<T> {
    return new AsyncResult(
      this.p.then(async (res: Result<T>) => {
        if (res.isSuccess()) {
          return OK<T>(res.v);
        }

        return ERR<T>(await f(res.e));
      }),
    );
  }

  public onOk<U>(f: (v: T) => SAR<U>): AR<U> {
    return new AsyncResult(
      this.p.then((res) => {
        if (res.isError()) {
          return ERR<U>(res.e);
        }

        const newValue = f(res.v);
        return newValue instanceof AsyncResult ? newValue.p : newValue;
      }),
    );
  }

  public onOkBind<F extends (...args: [...any, T]) => SAR<U>, U = any | T>(f: F, thisArg: any, ...argArray: DropLastParam<F>): AR<U> {
    return this.onOk(f.bind(thisArg, ...argArray));
  }

  public onOkThis<F extends (...args: [...any, T]) => SAR<U>, U = any | T>(f: F, ...argArray: DropLastParam<F>): AsyncResult<U> {
    return this.onOkBind(f, this.callbackThis, ...argArray).bind(this.callbackThis);
  }

  /**
   * Adds callback called when error result comes from promise
   * @param errorType Runs callback only for selected errors types or '*' for any error
   * @param f Callback
   * @returns this
   */
  public onErr<U = T>(f: ((e: AppError) => SAR<U>) | Record<string, (e: AppError) => SAR<U>>): AR<U> {
    return new AsyncResult<U>(
      this.p.then(async (res: Result<T>): Promise<any> => {
        if (res.isError()) {
          if (f instanceof Function) {
            return f(res.e);
          }

          const c = f[res.e.type];
          return c ? c(res.e) : res;
        }

        return OK(res.v);
      }),
    );
  }

  /**
   *  Use callback function binded to thisArg with some args
   */
  public onErrBind<F extends (...args: [...any, AppError]) => SAR<T>>(f: F, thisArg: any, ...argArray: DropLastParam<F>): AR<T> {
    return this.onErr(f.bind(thisArg, ...argArray));
  }

  /**
   *  Use callback function binded to this binded with that result with some args
   */
  public onErrThis<F extends (...args: [...any, AppError]) => SAR<T>>(f: F, ...argArray: DropLastParam<F>): AR<T> {
    return this.onErrBind(f, this.callbackThis, ...argArray);
  }

  public then<A, B>(
    successCallback?: (res: Result<T>) => A | PromiseLike<A>,
    failureCallback?: (reason: unknown) => B | PromiseLike<B>,
  ): PromiseLike<A | B> {
    return this.p.then(successCallback, failureCallback);
  }
}

export const OKA = <T>(v: T): AR<T> => new AsyncResult(Promise.resolve(OK<T>(v)));
export const OKAP = <T>(v: T): ARP<T> => OKA(v).p;

export const ERRA = <T>(error: AppError | Partial<AppError> | string, code = 400, data?: any): AR<T> => {
  let e: AppError;
  if (typeof error === 'string') {
    e = new AppError({ type: error, code, data });
  } else {
    e = error instanceof AppError ? error : new AppError(error);
  }
  return new AsyncResult(Promise.resolve(ERR<T>(error)));
};
export const ERRAP = <T>(error: AppError | Partial<AppError> | string, code = 400, data?: any): ARP<T> => ERRA<T>(error, code, data).p;

export const P = AsyncResult.fromPromise;
export const PS = AsyncResult.fromSafePromise;
export const PB = AsyncResult.fromPromiseOkTrue;
