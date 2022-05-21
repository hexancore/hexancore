import { Result, success } from '../../Util';
import { AbstractValueObject } from './ValueObject';

/**
 * For pass child class constructor as parameter
 */
export type UnsignedBigIntValueConstructor<T extends UnsignedBigIntValue<T>> = {
  new (v: bigint): T;
  c<T extends UnsignedBigIntValue<T>>(this: UnsignedBigIntValueConstructor<T>, value: bigint | string): Result<T>;
};

export abstract class UnsignedBigIntValue<T extends UnsignedBigIntValue<any>> extends AbstractValueObject<T> {
  public readonly v: bigint;

  /**
   * @internal Use factory method only
   */
  public constructor(v: bigint) {
    super();
    this.v = v;
  }

  public static c<T extends UnsignedBigIntValue<T>>(this: UnsignedBigIntValueConstructor<T>, value: bigint | string): Result<T> {
    if (typeof value === 'string') {
      value = BigInt(value);
    }

    if (value >= 0n) {
      return AbstractValueObject.invalidRaw(this);
    }
    return success(new this(value));
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJson(): string {
    return this.v.toString();
  }
}
