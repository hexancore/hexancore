import { AggregateRootRepository, EntityRepository, EntityRepositoryOptions } from '@hexcore/core';
import { EntitySchema } from 'typeorm';

interface TypeOrmEntityRepositoryOptions {
  moduleName: string;
  rootEntityClass: Function;
  rootCollectionProperty?: string;
  entitySchema: EntitySchema;
}

/**
 * Decorator
 * @param moduleName Name of module
 * @param rootEntityClass
 * @param entitySchema Schema of entity
 */
export function TypeOrmEntityRepository(options: TypeOrmEntityRepositoryOptions): (constructor: Function) => void {
  return function (constructor: Function) {
    EntityRepository({
      moduleName: options.moduleName,
      entityClass: options.entitySchema.options.target,
      rootEntityClass: options.rootEntityClass,
      rootCollectionProperty: options.rootCollectionProperty,
    })(constructor);
  };
}

/**
 * Decorator
 * @param moduleName Name of module
 * @param entitySchema Schema of entity
 */
export function TypeOrmAggregateRootRepository(moduleName: string, entitySchema: EntitySchema): (constructor: Function) => void {
  return function (constructor: Function) {
    AggregateRootRepository(moduleName, entitySchema.options.target)(constructor);
  };
}
