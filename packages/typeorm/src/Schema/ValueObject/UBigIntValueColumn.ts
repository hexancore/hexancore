import { EntitySchemaColumnOptions } from 'typeorm';
import { UBigIntValue, UBigIntValueConstructor } from '@hexcore/common';
import { ValueObjectAsPrimaryKeyColumnOptions, ValueObjectTypeOrmColumn, ValueObjectTypeOrmColumnOptions } from './ValueObjectTypeOrmColumn';

type VOCtor = UBigIntValueConstructor<any>;

export const UBigIntValueColumn: ValueObjectTypeOrmColumn = {
  asRaw(options: ValueObjectTypeOrmColumnOptions = { nullable: false }): EntitySchemaColumnOptions {
    return {
      type: 'bigint',
      unsigned: true,
      nullable: options.nullable,
      unique: options.unique,
      transformer: {
        to: (v?: bigint): string | null => (v ? v.toString() : null),
        from: (v: string): bigint | null => (v ? BigInt(v) : null),
      },
    };
  },

  as(voConstructor: VOCtor, options: ValueObjectTypeOrmColumnOptions = { nullable: false }): EntitySchemaColumnOptions {
    const s = UBigIntValueColumn.asRaw(options);
    s.transformer = {
      to: (v?: UBigIntValue): string | null => (v ? v.toString() : null),
      from: (v: string): UBigIntValue | null => (v ? voConstructor.c(v).v : null),
    };
    return s;
  },

  asPrimaryKey(voConstructor: VOCtor, options: ValueObjectAsPrimaryKeyColumnOptions = { generated: true }): EntitySchemaColumnOptions {
    const s = UBigIntValueColumn.as(voConstructor);
    s.primary = true;
    s.generated = options.generated;
    return s;
  },

  asSelf: function (options: ValueObjectTypeOrmColumnOptions = { nullable: false }): EntitySchemaColumnOptions {
    return UBigIntValueColumn.as(UBigIntValue, options);
  },
};
