import { AbstractValueObject } from '@hexcore/common';
import { AggregateRootBase } from './AggregateRootBase';
import { EntityCommonBase, EIDT } from './EntityCommonBase';

export type RT<T extends EntityBase<any, any>> = T extends EntityBase<any, infer U> ? U : T;
export type RTID<T extends EntityBase<any, any>> = T extends EntityBase<any, infer U> ? EIDT<U> : T;

export abstract class EntityBase<IdType extends AbstractValueObject<IdType>, RT extends AggregateRootBase<any>> extends EntityCommonBase<IdType> {}
