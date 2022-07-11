import { pascalCaseToCamelCase } from '@hexcore/common';
import { EntityBase } from '../EntityBase';
import { EntityCollectionImpl } from './EntityCollectionImpl';

/**
 * Used in persistance implementations
 */
export const ENTITY_COLLECTIONS_META_PROPERTY = '__HC_ENTITY_COLLECTIONS';

/**
 * Used in persistance implementations
 */
export const ROOT_ID_PROPERTY_META_PROPERTY = '__HC_ROOT_ID_PROPERTY';

/**
 * Decorator
 * @param rootIdPropertyName
 * @returns
 */
export const EntityCollection =
  (entityClass: Function): any =>
  (target: Object, propertyKey: string, descriptor) => {
    const rootIdPropertyName = pascalCaseToCamelCase(target.constructor.name) + 'Id';
    const symbol = Symbol(entityClass.name + 'Collection');

    if (!target.constructor[ENTITY_COLLECTIONS_META_PROPERTY]) {
      target.constructor[ENTITY_COLLECTIONS_META_PROPERTY] = {};
    }

    target.constructor[ROOT_ID_PROPERTY_META_PROPERTY] = rootIdPropertyName;

    target.constructor[ENTITY_COLLECTIONS_META_PROPERTY][propertyKey] = {
      entityClass: entityClass,
    };

    target.constructor.prototype[symbol] = descriptor
      ? typeof descriptor.initializer !== 'undefined'
        ? descriptor.initializer()
        : undefined
      : undefined;
    return {
      configurable: true,
      enumerable: true,

      get() {
        if (!this[symbol]) {
          this[symbol] = new EntityCollectionImpl(this, rootIdPropertyName as string);
        }
        return this[symbol];
      },
    };
  };
