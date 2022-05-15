import { error, Result, success } from '../../Util';
import { AbstractValueObject } from './ValueObject';

export type IntegerIdRawType = number;

export abstract class IntegerIdValue<T extends IntegerIdValue<any>> extends AbstractValueObject<T> {
  public readonly v: number;

  /**
   * @internal Use factory method only
   */
  public constructor(v: number) {
    super();
    this.v = v;
  }

  public static c<T extends IntegerIdValue<T>>(this: { new (value: number): T }, value: number): Result<T> {
    if (!IntegerIdValue.isValid(value)) {
      return AbstractValueObject.invalidRaw(this);
    }
    return success(new this(value));
  }

  protected static isValid(v: any): boolean {
    return Number.isInteger(v) && v >= 0;
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJson(): number {
    return this.v;
  }
}
