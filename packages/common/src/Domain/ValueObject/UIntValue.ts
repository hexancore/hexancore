import { OK, Result} from '../../Util';
import { SimpleValueObject, SimpleValueObjectConstructor } from './SimpleValueObject';
import { AbstractValueObject, ValueObject } from './ValueObject';

export type UIntValueConstructor = SimpleValueObjectConstructor<UIntValue<any>, number>;

@ValueObject('Core')
export class UIntValue<T extends UIntValue<any> = any> extends SimpleValueObject<T, number> {
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
