/* eslint-disable @typescript-eslint/ban-types */
import { method, On, Provider } from 'ts-auto-mock/extension';

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

export class Mocker<T extends object> {
  public readonly i: T;
  private methods: Map<string, any>;
  private methodCallExpections: MethodCallExpection[];

  public constructor(instance: T) {
    this.i = instance;
    this.methods = new Map();
    this.methodCallExpections = [];
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
      if (expection.args.length > 0) {
        expect(this.methods.get(expection.method)).toBeCalledWith(...expection.args);
      } else {
        expect(this.methods.get(expection.method)).toBeCalled();
      }
    });
  }
}
