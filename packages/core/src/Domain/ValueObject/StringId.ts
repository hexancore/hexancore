import { Id } from "./Id";
import { ValueObject } from './ValueObject';

export abstract class StringId extends ValueObject implements Id {
  public readonly v: string;

  protected constructor(v: string) {
    super();
    this.v = v;
  }

  public toString(): string {
    return this.v;
  }
}