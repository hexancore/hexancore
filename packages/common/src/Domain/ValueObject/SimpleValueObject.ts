import { Result, ERR, OK } from '../../Util/Result';
import { AbstractValueObject } from './ValueObject';

/**
 * For pass child class constructor as parameter
 */
export type SimpleValueObjectConstructor<T, VT> = {
  new (v: VT): T;
  c<T extends SimpleValueObject<T, VT>>(this: SimpleValueObjectConstructor<T, VT>, value: any): Result<T>;
  checkRawValue(value: any): Result<boolean>;
};

export class SimpleValueObject<T extends SimpleValueObject<any, any>, VT> extends AbstractValueObject<T> {
  public readonly v: VT;

  public constructor(value: VT) {
    super();
    this.v = value;
  }

  public static c<T extends SimpleValueObject<T, any>>(this: SimpleValueObjectConstructor<T, any>, value: any): Result<T> {
    const checkResult = this.checkRawValue(value);
    return checkResult.isError() ? ERR(checkResult.e) : OK(new this(value));
  }

  public static cs<T extends SimpleValueObject<T, any>>(this: SimpleValueObjectConstructor<T, any>, value: any): T {
    return new this(value);
  }

  public static checkRawValue(value: any): Result<boolean> {
    return OK(true);
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public toString(): any {
    return this.v;
  }

  public toJSON(): any {
    return this.v;
  }
}
