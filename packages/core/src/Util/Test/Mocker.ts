/* eslint-disable @typescript-eslint/ban-types */

interface MethodCallExpection {
  method: string;
  args?: any[];
}

export class MethodMock {
  public constructor(private readonly mock: jest.Mock) {}

  public andReturnWith(implementation: (...args: any) => any): void {
    this.mock.mockImplementationOnce(implementation);
  }

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

export class Mocker<T extends object> {
  private readonly mock: Partial<T>;
  private readonly mockProxy: T;
  public readonly name: string;
  private methodCallExpections: MethodCallExpection[];

  public constructor(name = 'mock') {
    this.mock = {};
    this.name = name;
    this.methodCallExpections = [];
    this.mockProxy = this.createMockProxy();
  }

  private createMockProxy(): T {
    const mock = this.mock;
    const mockName = this.name;

    return new Proxy<T>(mock as T, {
      get: (target: T, prop: string) => {
        if (target[prop]) {
          return target[prop];
        } else {
          return (...args: any[]) => {
            let message = `expect(${mockName}.${prop}).not.toBeCalled`;
            message += args.length > 0 ? `With(${args.join(', ')})` : '()';
            const e = new Error(message);
            const split = e.stack.split("\n");
            e.stack = [split[0], split[2]].join("\n");
            throw e;
          };
        }
      },
    });
  }

  public static of<T extends object>(name = 'mock'): Mocker<T> {
    return new Mocker(name);
  }

  public get i(): T {
    return this.mockProxy;
  }

  public expect<K extends keyof T>(name: K, ...args: any): MethodMock {
    let mockFunction: jest.Mock;
    if (!this.mock[name]) {
      mockFunction = this.mock[<string>name] = jest.fn();
      mockFunction.mockName(this.name + '.' + <string>name);
    } else {
      mockFunction = this.mock[<string>name];
    }

    this.methodCallExpections.push({ method: <string>name, args });
    return new MethodMock(mockFunction);
  }

  public checkExpections(): void {
    this.methodCallExpections.forEach((expection: MethodCallExpection) => {
      this.checkExpection(expection);
    });
  }

  private checkExpection(expection: MethodCallExpection): void {
    const callMatcher = expect(this.mock[expection.method]);
    if (expection.args.length > 0) {
      callMatcher.toBeCalledWith(...expection.args);
    } else {
      callMatcher.toBeCalled();
    }
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
}
