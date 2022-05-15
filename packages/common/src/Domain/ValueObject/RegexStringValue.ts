import { error, Result, success } from '../../Util/Result';
import { VALUE_OBJECT_META_PROPERTY, AbstractValueObject } from './ValueObject';

export type RegexStringIdRawType = string;

export abstract class RegexStringValue<T extends RegexStringValue<any>> extends AbstractValueObject<T> {
  public readonly v: string;

  public constructor(value: string) {
    super();
    this.v = value;
  }

  protected static create<T extends RegexStringValue<T>>(this: { new (value: string): T }, value: string, regex: RegExp): Result<T> {
    if (!regex.test(value)) {
      return AbstractValueObject.invalidRaw(this);
    }
    return success(new this(value));
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
