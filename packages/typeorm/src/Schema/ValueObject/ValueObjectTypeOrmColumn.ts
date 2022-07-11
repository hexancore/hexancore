import { ColumnType, EntitySchemaColumnOptions, ValueTransformer } from 'typeorm';

export interface ValueObjectTypeOrmColumnOptions {
  nullable?: boolean;
  update?: boolean;
  unique?: boolean;
}

export type ValueObjectAsPrimaryKeyColumnOptions = {
  generated?: true | null;
};

export interface ValueObjectTypeOrmColumn<OP extends ValueObjectTypeOrmColumnOptions = ValueObjectTypeOrmColumnOptions> {
  asRaw(options?: OP): EntitySchemaColumnOptions;
  asSelf(options?: OP): EntitySchemaColumnOptions;
  asPrimaryKey(voConstructor: any, options?: ValueObjectAsPrimaryKeyColumnOptions): EntitySchemaColumnOptions;
  as(voConstructor: any, options?: OP): EntitySchemaColumnOptions;
}
