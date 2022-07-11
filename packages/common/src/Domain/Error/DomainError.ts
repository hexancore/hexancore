import { AppError, ERR, FilterNotStartsWith, FilterStartsWith, Result, StripPrefix } from '../../Util';
import { pascalCaseToSnakeCase } from '../../Util/functions';

export function formatEntityErrorType(module: string, entityType: string, type: string) {
  return `${module}.domain.entity.${entityType}${type ? '_' + type : ''}`;
}

export type standard_entity_error_types = 'duplicate' | 'not_found';

export class EntityErrorTypeObject<ErrorTypes> {
  public constructor(private readonly typePrefix: string) {}
  public err<T>(type: ErrorTypes, data?: any | (() => any)): Result<T> {
    return ERR(this.t(type), (type as unknown as string) == 'not_found' ? 404 : 400, data );
  }

  t(type: ErrorTypes): string {
    return (this.typePrefix + '.' + type) as unknown as string;
  }
}

export class ErrorTypeObject {
  public constructor(public readonly t: string) {}
  public toString() {
    return this.t;
  }
  public err<T>(data?: any | (() => any)): Result<T> {
    return ERR(this.t,400, data);
  }
}

type EntityErrorTypes<T> = {
  readonly [P in FilterStartsWith<keyof T, 'entity_'> as StripPrefix<P, 'entity_'>]: EntityErrorTypeObject<T[P]>;
};

type EntityErrorType<T extends DomainErrorsRaw> = {
  readonly entity: EntityErrorTypes<T>;
};

type ErrorType<T extends DomainErrorsRaw> = {
  readonly [P in FilterNotStartsWith<keyof T, 'entity_'>]: ErrorTypeObject & string;
};

type DomainErrorsRaw = Record<string, any>;

export function DefineDomainErrors<T>(module: string, obj: T): ErrorType<T> & EntityErrorType<T> {
  module = pascalCaseToSnakeCase(module);
  const moduleErrorTypePrefix = module + '.domain.';
  const entityModuleErrorTypePrefix = module + '.domain.entity.';
  const errors: any = {
    entity: {},
  };

  Object.getOwnPropertyNames(obj).forEach((name) => {
    if (name.startsWith('entity_')) {
      const entityType = name.substring(7);
      errors.entity[entityType] = new EntityErrorTypeObject(entityModuleErrorTypePrefix + entityType);
    } else {
      errors[name] = new ErrorTypeObject(moduleErrorTypePrefix + name);
    }
  });

  return errors;
}
