import { ValueObject } from './ValueObject';

export abstract class StringValue<T extends StringValue = any> extends ValueObject {
  public readonly v: string;

  protected constructor(value: string) {
    super();
    this.v = value;
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public getRaw(): string {
    return this.v;
  }

  public toString(): string {
    return this.v;
  }
}
