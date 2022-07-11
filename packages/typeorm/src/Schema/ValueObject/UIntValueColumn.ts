import { EntitySchemaColumnOptions } from 'typeorm';
import { UIntValue, UIntValueConstructor } from '@hexcore/common';
import { ValueObjectAsPrimaryKeyColumnOptions, ValueObjectTypeOrmColumn, ValueObjectTypeOrmColumnOptions } from './ValueObjectTypeOrmColumn';

type VOCtor = UIntValueConstructor;

export type UIntValueColumnOptions = ValueObjectTypeOrmColumnOptions & {
  type: 'tinyint' | 'smallint' | 'mediumint' | 'int';
};

export const UIntValueColumn: ValueObjectTypeOrmColumn<UIntValueColumnOptions> = {
  asRaw(options: UIntValueColumnOptions = { type: 'int', nullable: false }): EntitySchemaColumnOptions {
    return {
      type: options.type,
      unsigned: true,
      update: options.update,
      nullable: options.nullable,
      unique: options.unique,
    };
  },

  as(voConstructor: VOCtor, options: UIntValueColumnOptions = { type: 'int', nullable: false }): EntitySchemaColumnOptions {
    const s = UIntValueColumn.asRaw(options);
    s.transformer = {
      to: (v?: UIntValue): number | null => (v ? v.v : null),
      from: (v?: number): UIntValue | null => (v ? voConstructor.c(v).v : null),
    };
    return s;
  },

  asPrimaryKey(voConstructor: VOCtor, options: ValueObjectAsPrimaryKeyColumnOptions = { generated: true }): EntitySchemaColumnOptions {
    const s = UIntValueColumn.as(voConstructor);
    s.primary = true;
    s.generated = options.generated;
    return s;
  },

  asSelf: function (options: UIntValueColumnOptions = { type: 'int', nullable: false }): EntitySchemaColumnOptions {
    throw new Error('Function not implemented.');
  },
};
