import { AbstractValueObject, ValueObject } from './ValueObject';
import { OK, Result } from '../../Util/Result';

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

  public static c(v: Date | number | string): Result<ImmutableDate> {
    if (typeof v === 'number') {
      return this.fromTimestamp(v);
    }

    if (v instanceof Date) {
      return OK(new this(new Date(v.getTime())));
    }

    try {
      return OK(new this(new Date(v)));
    } catch (e) {
      return AbstractValueObject.invalidRaw(ImmutableDate, {
        raw: v,
        msg: 'invalid datetime format: ' + e.message,
      });
    }
  }

  public static cs(v: Date | number | string): ImmutableDate {
    if (typeof v === 'number') {
      return new this(new Date(v * 1000));
    }

    if (v instanceof Date) {
      return new this(new Date(v.getTime()));
    }

    return new this(new Date(v));
  }

  public static fromTimestamp(timestamp: number): Result<ImmutableDate> {
    if (timestamp < 0) {
      return AbstractValueObject.invalidRaw(ImmutableDate, {
        raw: timestamp,
        msg: 'invalid timestamp',
      });
    }
    return OK(new this(new Date(timestamp * 1000)));
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

  public toJSON() {
    return this.t;
  }
}
