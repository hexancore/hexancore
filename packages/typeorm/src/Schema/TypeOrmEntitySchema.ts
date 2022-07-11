import { EntityBase, ENTITY_META_PROPERTY } from "@hexcore/core";
import { EntitySchema, EntitySchemaOptions } from "typeorm";

export const TypeOrmEntitySchema = <T extends EntityBase<any>>(entityClass: {new(...args: any[]): T}, options: Pick<EntitySchemaOptions<T>, 'columns'|'indices' | 'embeddeds'>) => {
  if (!entityClass[ENTITY_META_PROPERTY]) {
    throw new ReferenceError(`Missing Entity or AggregateRoot decorator on entity class: ${entityClass.name}`)
  }

  return new EntitySchema<T>({
  name: entityClass.name,
  target: entityClass,
  tableName: entityClass[ENTITY_META_PROPERTY].moduleName + entityClass.name,
  ...options
  });
};