import { OK, Result } from '../../Util/Result';
import { AbstractValueObject } from './ValueObject';
import { StringValue } from './StringValue';

export type RegexStringIdRawType = string;

export type RegexStringSubtype<T> = {
  new (value: string): T;
  getRegex(): RegExp;
};
export abstract class RegexStringValue<T extends RegexStringValue<any>> extends StringValue<T> {
  public static checkRawValue<T>(this: RegexStringSubtype<T>, value: string): Result<boolean> {
    return this.getRegex().test(value) ? OK(true) : AbstractValueObject.invalidRaw(this, { raw: value });
  }
}
