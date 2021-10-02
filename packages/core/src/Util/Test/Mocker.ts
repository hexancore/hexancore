/* eslint-disable @typescript-eslint/ban-types */

interface MethodCallExpection {
  method: string;
  args?: any[];
}

export class MethodMock {
  public constructor(private readonly mock: any) {}

  public andReturn(value: any): void {
    this.mock.mockReturnValueOnce(value);
  }

  public andReturnResolved(value: any): void {
    this.mock.mockResolvedValueOnce(value);
  }
}

interface DoneCallback {
  (...args: any[]): any;
  fail(error?: string | { message: string }): any;
}

type ProvidesCallback = (cb: DoneCallback) => any;

export class Mocker<T> {
  private readonly mock: Partial<T>;
  public readonly name: string;
  private methodCallExpections: MethodCallExpection[];

  public constructor(name = '') {
    this.mock = {};
    this.name = name;
    this.methodCallExpections = [];
  }

  public static of<T extends object>(name = ''): Mocker<T> {
    return new Mocker(name);
  }

  public get i(): T {
    return this.mock as T;
  }

  /**
   * Experimental
   * @param callback
   * @param mocks
   * @returns
   */
  public static checkMocksAfter(callback: ProvidesCallback, mocks: Mocker<any>[]): any {
    return (doneCallback: DoneCallback) => {
      const result = callback.apply(this, doneCallback);
      if (result instanceof Promise) {
        result.then(() => {
          mocks.forEach((mock: Mocker<any>) => mock.checkExpections());
        });
      }
      return result;
    };
  }

  public expect<K extends keyof T>(name: K, ...args: any): MethodMock {
    if (!this.mock[name]) {
      this.mock[<string>name] = jest.fn();
    }

    this.methodCallExpections.push({ method: <string>name, args });
    return new MethodMock(this.mock[<string>name]);
  }

  public checkExpections(): void {
    this.methodCallExpections.forEach((expection) => {
      const callMatcher = expect(this.mock[expection.method]);

      try {
        if (expection.args.length > 0) {
          callMatcher.toBeCalledWith(...expection.args);
        } else {
          callMatcher.toBeCalled();
        }
      } catch (e) {
        const message: string = e.matcherResult.message;
        const callName = (this.name !== '' ? this.name : 'Mock') + '.' + expection.method;
        e.message = message.replace('jest.fn()', callName);
        throw e;
      }
    });
  }
}
