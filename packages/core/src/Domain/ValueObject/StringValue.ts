import { ValueObject } from './ValueObject';

export abstract class StringValue extends ValueObject {
  protected readonly value: string;

  protected constructor(value: string) {
    super();
    this.value = value;
  }

  public getRaw(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }

}
