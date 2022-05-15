import { AppError, error, pascalCaseToSnakeCase, Result } from '../../Util';

export interface ValueObjectMeta {
  readonly module: string;
  readonly class: string;
}

export const VALUE_OBJECT_META_PROPERTY = '__VOMETA';

/**
 * Decorator
 * @param moduleName Name of module
 */
export function ValueObject(moduleName: string): (constructor: Function) => void {
  return function (constructor: Function) {
    constructor.prototype[VALUE_OBJECT_META_PROPERTY] = {
      module: moduleName,
      class: constructor.name,
    };
  };
}

export function ValueObjectInvalidRawValueError(meta: ValueObjectMeta, data: any = null): AppError {
  return {
    type: pascalCaseToSnakeCase(meta.module) + '.domain.value_object.' + pascalCaseToSnakeCase(meta.class) + '.invalid_raw_value',
    data,
    code: 400,
  };
}

export function checkEnumValueObject(value: any, enumType: any, meta: ValueObjectMeta, data: any = null): AppError | null {
  if (!(value in enumType)) {
    return ValueObjectInvalidRawValueError(meta, data);
  }
  return null;
}

export abstract class AbstractValueObject<T extends AbstractValueObject<any>> {
  protected static createInvalidRawValueError(meta: ValueObjectMeta, data: any = null): AppError {
    return ValueObjectInvalidRawValueError(this.prototype[VALUE_OBJECT_META_PROPERTY], data);
  }

  protected static invalidRaw<R>(valueObjectClass: Function, data: any = null): Result<R> {
    const meta = valueObjectClass.prototype[VALUE_OBJECT_META_PROPERTY];
    if (!meta) {
      throw new Error(VALUE_OBJECT_META_PROPERTY + " property isn't defined, add @ValueObject decorator to " + valueObjectClass.name);
    }
    return error(ValueObjectInvalidRawValueError(meta, data));
  }

  public abstract equals(o: T): boolean;
  public abstract toString(): string;
  public abstract toJson(): any;
}
