import { AbstractValueObject } from '@hexcore/common';
import { EntityBase, EntityCommonBase, ENTITY_META_PROPERTY } from '@hexcore/core';
import { EntitySchema, EntitySchemaColumnOptions, EntitySchemaEmbeddedColumnOptions, EntitySchemaIndexOptions, EntitySchemaOptions } from 'typeorm';
import { EntitySchemaUniqueOptions } from 'typeorm/entity-schema/EntitySchemaUniqueOptions';

type TypeOrmEntitySchemaOptions<T> = {
  columns: {
    [P in keyof T]?: EntitySchemaColumnOptions;
  };
  indices?: EntitySchemaIndexOptions[];
  uniques?: EntitySchemaUniqueOptions[];
  embeddeds?: {
    [P in keyof Partial<T>]: EntitySchemaEmbeddedColumnOptions;
  };
};

export const TypeOrmEntitySchema = <T extends EntityCommonBase<any> | AbstractValueObject<any>>(
  entityClass: { new (...args: any[]): T },
  options: TypeOrmEntitySchemaOptions<T>,
) => {
  if (!entityClass[ENTITY_META_PROPERTY]) {
    throw new ReferenceError(`Missing Entity or AggregateRoot decorator on entity class: ${entityClass.name}`);
  }

  return new EntitySchema<T>({
    name: entityClass.name,
    target: entityClass,
    tableName: entityClass[ENTITY_META_PROPERTY].module + '_' + entityClass.name,
    ...options,
  });
};
