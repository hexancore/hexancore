import { ValueTransformer } from 'typeorm';
import { IntegerIdValue, IntegerIdValueConstructor } from '@hexcore/common';

export const IntegerIdValueTransformer = <T extends IntegerIdValue<T>>(voConstructor: IntegerIdValueConstructor<T>): ValueTransformer => ({
  to: (v?: T): number | null => (v ? v.v : null),
  from: (v: number): T => voConstructor.c(v).v,
});
