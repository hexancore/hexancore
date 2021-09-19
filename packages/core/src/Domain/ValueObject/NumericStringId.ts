import { AppError } from '@/Util/AppError';
import { Id } from './Id';
import { ValueObject, ValueObjectMeta } from './ValueObject';
import { Result, success } from '../../Util/Result';

const VALUE_REGEX = /^\d+$/;

export abstract class NumericStringId extends ValueObject implements Id {
  public readonly v: string;

  protected constructor(v: string) {
    super();
    this.v = v;
  }

  protected static isValid(value: string): boolean {
    return VALUE_REGEX.test(value);
  }

  public toString(): string {
    return this.v;
  }
}
