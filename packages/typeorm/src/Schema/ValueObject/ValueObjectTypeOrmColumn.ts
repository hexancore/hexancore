import { ColumnType, EntitySchemaColumnOptions, ValueTransformer } from 'typeorm';

export interface ValueObjectTypeOrmColumnOptions {
  nullable?: boolean;
  update?: boolean;
  unique?: boolean;
}

export type ValueObjectAsPrimaryKeyColumnOptions = {
  generated?: true | null;
};

export interface ValueObjectTypeOrmColumn<
  O extends ValueObjectTypeOrmColumnOptions = ValueObjectTypeOrmColumnOptions,
  OP extends ValueObjectAsPrimaryKeyColumnOptions = ValueObjectAsPrimaryKeyColumnOptions,
> {
  asRaw(options?: O): EntitySchemaColumnOptions;
  asSelf(options?: O): EntitySchemaColumnOptions;
  asPrimaryKey(voConstructor: any, options?: OP): EntitySchemaColumnOptions;
  as(voConstructor: any, options?: O): EntitySchemaColumnOptions;
}
