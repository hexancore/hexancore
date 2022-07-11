import { ERR,  OK, Result } from '../../Util';
import { SimpleValueObject, SimpleValueObjectConstructor } from './SimpleValueObject';
import { AbstractValueObject, ValueObject } from './ValueObject';

export type UBigIntValueConstructor<T> = SimpleValueObjectConstructor<T, bigint>;

@ValueObject('Core')
export class UBigIntValue<T extends UBigIntValue<any> = any> extends SimpleValueObject<T, bigint> {
  public static c<T extends SimpleValueObject<T, bigint>>(this: UBigIntValueConstructor<T>, value: any): Result<T> {
    if (typeof value === 'string') {
      try {
        value = BigInt(value);
      } catch (e) {
        return AbstractValueObject.invalidRaw(this, { raw: value });
      }
    }

    const checkResult = this.checkRawValue(value);
    return checkResult.isError() ? ERR(checkResult.e) : OK(new this(value));
  }

  public static cs<T extends SimpleValueObject<T, bigint>>(this: UBigIntValueConstructor<T>, value: any): T {
    if (typeof value === 'string') {
      value = BigInt(value);
    }
    return new this(value);
  }

  public static checkRawValue(value: any): Result<boolean> {
    return value >= 0n ? OK(true) : AbstractValueObject.invalidRaw(this, { raw: value });
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJSON(): string {
    return this.v.toString();
  }
}
