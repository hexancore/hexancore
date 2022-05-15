import { Result } from '../../Util/Result';
import { RegexStringValue } from './RegexStringValue';

const VALUE_REGEX = /^\d+$/;

export type NumericStringIdRawType = string;

export abstract class NumericStringIdValue<T extends NumericStringIdValue<any>> extends RegexStringValue<T> {

  public static c<T extends NumericStringIdValue<T>>(this: {new(value: string): T}, value: string): Result<T> {

    return NumericStringIdValue.create.call(this, value, VALUE_REGEX);
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v;
  }

  public toJson(): string {
    return this.v;
  }
}
