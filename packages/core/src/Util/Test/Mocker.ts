import 'jest-ts-auto-mock';
/* eslint-disable @typescript-eslint/ban-types */
import { method, On, ɵMarker } from 'ts-auto-mock/extension';

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

export class Mocker<T extends object> {
  public readonly i: T;
  public readonly name: string;
  private methods: Map<string, any>;
  private methodCallExpections: MethodCallExpection[];

  public constructor(instance: T, name = '') {
    // Hack ts-automock marker when Mocker used in other project tests - instance come here without marker property
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!instance[ɵMarker.instance.get()]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance[ɵMarker.instance.get()] = true;
    }
    // end Hack

    this.i = instance;
    this.name = name;
    this.methods = new Map();
    this.methodCallExpections = [];
  }

  public static of<T extends object>(instance: T, name = ''): Mocker<T> {
    return new Mocker(instance, name);
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

  public expect(name: keyof T, ...args: any): MethodMock {
    let methodMock;
    if (!this.methods.has(<string>name)) {
      methodMock = On(this.i).get(method(name));
      this.methods.set(<string>name, methodMock);
    } else {
      methodMock = this.methods.get(<string>name);
    }

    this.methodCallExpections.push({ method: <string>name, args });
    return new MethodMock(methodMock);
  }

  public checkExpections(): void {
    this.methodCallExpections.forEach((expection) => {
      const callMatcher = expect(this.methods.get(expection.method));

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
