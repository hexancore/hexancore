import { EntitySchemaColumnOptions, ValueTransformer } from 'typeorm';
import { ImmutableDate } from '@hexcore/common';
import { ValueObjectAsPrimaryKeyColumnOptions, ValueObjectTypeOrmColumn, ValueObjectTypeOrmColumnOptions } from './ValueObjectTypeOrmColumn';

export const ImmutableDateColumn: ValueObjectTypeOrmColumn = {
  asRaw(options: ValueObjectTypeOrmColumnOptions = { nullable: false }): EntitySchemaColumnOptions {
    return {
      type: 'timestamp',
      nullable: options.nullable,
      update: false,
      unique: options.unique,
    };
  },

  as(voConstructor?: any, options: ValueObjectTypeOrmColumnOptions = { nullable: false }): EntitySchemaColumnOptions {
    const s = ImmutableDateColumn.asRaw(options);
    s.transformer = {
      to: (v?: ImmutableDate): Date | null => (v ? v.v : null),
      from: (v: string | Date): ImmutableDate | null => {
        if (typeof v === 'string') {
          v = new Date(v);
        }
        return v ? voConstructor.cs(v) : null;
      },
    };
    return s;
  },

  asPrimaryKey(voConstructor: any, options: ValueObjectAsPrimaryKeyColumnOptions = { generated: true }): EntitySchemaColumnOptions {
    throw new Error('Function not implemented.');
  },

  asSelf: function (options: ValueObjectTypeOrmColumnOptions = { nullable: false }): EntitySchemaColumnOptions {
    return ImmutableDateColumn.as(ImmutableDate, options);
  },
};
