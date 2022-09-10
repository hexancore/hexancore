import { AbstractValueObject } from '@hexcore/common';
import { EntityCommonBase } from './EntityCommonBase';

export abstract class AggregateRootBase<IdType extends AbstractValueObject<IdType>> extends EntityCommonBase<IdType> {}
