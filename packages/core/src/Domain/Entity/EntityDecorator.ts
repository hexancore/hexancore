export const ENTITY_META_PROPERTY = '__HC_ENTITY_META';

/**
 * Decorator
 * @param moduleName Name of module
 */
export function Entity(moduleName: string): (constructor: Function) => void {
  return function (constructor: Function) {
    constructor[ENTITY_META_PROPERTY] = {
      module: moduleName,
    };
  };
}

/**
 * Decorator
 * @param moduleName Name of module
 */
 export function AggregateRoot(moduleName: string): (constructor: Function) => void {
  return function (constructor: Function) {
    constructor[ENTITY_META_PROPERTY] = {
      module: moduleName,
    };
  };
}
