import { ValueObject, ValueObjectMeta } from './ValueObject';
import { Result, error, success } from '../../Util/Result';

const META: ValueObjectMeta = {
  module: 'Core',
  class: 'ImmutableDate',
};

export class ImmutableDate extends ValueObject {
  private value:Date;

  protected constructor(value:Date) {
    super();
    this.value = value;
  }

  public static now() : ImmutableDate {
    const now = Math.trunc(Date.now()/1000)*1000;
    return new ImmutableDate(new Date(now));
  }

  public static create(value:Date): ImmutableDate {
      return new ImmutableDate(new Date(value.getTime()));
  }

  public static createFromTimestamp(timestamp:number): Result<ImmutableDate> {
    if (timestamp < 0) {
      return error(ValueObject.createInvalidRawValueError(META, ["'"+timestamp+"' is not valid timestamp"]));
    }
    return success(new ImmutableDate(new Date(timestamp*1000)));
  }

  public getRaw(): Date {
    return new Date(this.value.getTime());
  }

  public getTimestamp(): number {
    return Math.trunc(this.value.getTime()/1000);
  }

  public get timestamp(): number {
    return this.getTimestamp();
  }

  public toString(): string {
    return this.value.toUTCString();
  }

}
