import { AbstractValueObject } from './ValueObject';

export abstract class StringValue<T extends StringValue = any> extends AbstractValueObject<T> {
  public readonly v: string;

  public constructor(value: string) {
    super();
    this.v = value;
  }

  public static c<T extends StringValue<T>>(this: { new (value: string): T }, value: string): T {
    return new this(value);
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
