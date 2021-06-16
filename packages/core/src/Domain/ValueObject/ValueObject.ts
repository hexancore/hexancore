import { AppError } from '../../Util';

export interface ValueObjectMeta {
  readonly module: string;
  readonly class: string;
}

export abstract class ValueObject {
  protected static createInvalidRawValueError(meta: ValueObjectMeta, data: any = null): AppError {
    return {
      type: meta.module.toLowerCase() + '.domain.value_object.' + meta.class.toLowerCase() + '.invalid_raw_value',
      data,
      code: 400,
    };
  }
}
