import { ERR, OK, Result } from '../../Util';
import { SimpleValueObject, SimpleValueObjectConstructor } from './SimpleValueObject';
import { AbstractValueObject, ValueObject } from './ValueObject';

export type UIntValueConstructor<T> = SimpleValueObjectConstructor<T, number>;

@ValueObject('Core')
export class UIntValue<T extends UIntValue<any> = any> extends SimpleValueObject<T, number> {
  public static c<T extends SimpleValueObject<T, number>>(this: UIntValueConstructor<T>, value: any): Result<T> {
    if (typeof value === 'string') {
      try {
        value = Number.parseInt(value);
      } catch (e) {
        return AbstractValueObject.invalidRaw(this, { raw: value });
      }
    }

    const checkResult = this.checkRawValue(value);
    return checkResult.isError() ? ERR(checkResult.e) : OK(new this(value));
  }

  public static cs<T extends SimpleValueObject<T, number>>(this: UIntValueConstructor<T>, value: any): T {
    if (typeof value === 'string') {
      value = Number.parseInt(value);
    }
    return new this(value);
  }

  public static checkRawValue(value: number): Result<boolean> {
    return value >= 0 ? OK(true) : AbstractValueObject.invalidRaw(this, { raw: value });
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJSON(): number {
    return this.v;
  }
}
