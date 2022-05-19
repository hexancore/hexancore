import { ValueTransformer } from 'typeorm';
import { NumericStringIdValue, NumericStringIdValueConstructor } from '@hexcore/common';

export const NumericStringIdValueTransformer = <T extends NumericStringIdValue<T>>(
  voConstructor: NumericStringIdValueConstructor<T>,
): ValueTransformer => ({
  to: (v?: T): string | null => (v ? v.v : null),
  from: (v: string): T => voConstructor.c(v).v,
});
