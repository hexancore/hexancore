import { AbstractValueObject } from '@hexcore/common';
import { EntityBase } from '../Entity/EntityBase';
import { AbstractEntityRepositoryCommon } from './AbstractEntityRepositoryCommon';

/**
 * Aggregate root entity repository base class
 */
export abstract class AbstractAggregateRootRepository<
  T extends EntityBase<IdType>,
  IdType extends AbstractValueObject<any>,
> extends AbstractEntityRepositoryCommon<T, IdType> {}
