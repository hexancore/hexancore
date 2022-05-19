import { AbstractValueObject, AsyncResult, error, NotFoundEntityError, Result } from '@hexcore/common';

export const ENTITY_REPOSITORY_META_PROPERTY = '__HC_ENTITY_REPOSITORY_META';

/**
 * Decorator
 * @param moduleName Name of module
 * @param entityClass Entity class
 */
export function ModuleEntityRepository(moduleName: string, entityClass: Function): (constructor: Function) => void {
  return function (constructor: Function) {
    constructor[ENTITY_REPOSITORY_META_PROPERTY] = {
      module: moduleName,
      entityClass: entityClass,
    };
  };
}

export interface ModuleEntityRepositoryInterface<T extends any, IdType extends AbstractValueObject<any>> {
  persist(entity: T): AsyncResult<boolean>;
  getById(id: IdType): AsyncResult<T>;
  getAll(): AsyncResult<Iterable<T>>;
}

export function ModuleEntityNotFoundErrorResult<T>(entityRepositoryObject: any, searchCriteria: Record<string, any>): Result<T> {
  const m = Object.getPrototypeOf(entityRepositoryObject).constructor[ENTITY_REPOSITORY_META_PROPERTY];
  return error(NotFoundEntityError(m.module, m.entityClass.name, searchCriteria));
}
