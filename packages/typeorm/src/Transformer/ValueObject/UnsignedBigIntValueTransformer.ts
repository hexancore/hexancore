import { ValueTransformer } from 'typeorm';
import { UnsignedBigIntValue, UnsignedBigIntValueConstructor } from '@hexcore/common';

export const UnsignedBigIntValueTransformer = <T extends UnsignedBigIntValue<T>>(
  voConstructor: UnsignedBigIntValueConstructor<T>,
): ValueTransformer => ({
  to: (v?: T): string | null => (v ? v.toString() : null),
  from: (v: string): T => voConstructor.c(v).v,
});
