import { AbstractValueObject, ValueObject } from './ValueObject';
import { Result, success } from '../../Util/Result';

export type ImmutableDateRawType = number;

@ValueObject('Core')
export class ImmutableDate extends AbstractValueObject<ImmutableDate> {
  private value: Date;

  protected constructor(value: Date) {
    super();
    this.value = value;
  }

  public static now(): ImmutableDate {
    const now = Math.trunc(Date.now() / 1000) * 1000;
    return new ImmutableDate(new Date(now));
  }

  public static c(value: Date): ImmutableDate {
    return new ImmutableDate(new Date(value.getTime()));
  }

  public static fromTimestamp(timestamp: number): Result<ImmutableDate> {
    if (timestamp < 0) {
      return AbstractValueObject.invalidRaw(ImmutableDate, {
        raw: timestamp,
        msg: "invalid timestamp",
      });
    }
    return success(new this(new Date(timestamp * 1000)));
  }

  public get v(): Date {
    return new Date(this.value.getTime());
  }

  public get t(): number {
    return Math.trunc(this.value.getTime() / 1000);
  }

  public equals(o: ImmutableDate): boolean {
    return this.t === o.t;
  }

  public toString(): string {
    return this.value.toUTCString();
  }

  public toJson() {
    return this.value;
  }
}
