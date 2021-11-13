import { ValueObject } from './ValueObject';

export abstract class StringValue<T extends StringValue = any> extends ValueObject {
  protected readonly value: string;

  protected constructor(value: string) {
    super();
    this.value = value;
  }

  public equals(other: T): boolean {
    return this.value === other.value;
  }

  public getRaw(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
