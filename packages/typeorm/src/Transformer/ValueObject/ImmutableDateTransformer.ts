import { ValueTransformer } from 'typeorm';
import { ImmutableDate } from '@hexcore/common';

export const ImmutableDateTransformer = (): ValueTransformer => ({
  to: (v: ImmutableDate): Date => v.v,
  from: (v: Date): ImmutableDate => ImmutableDate.c(v),
});
