import { AggregateRootBase } from '../Entity/AggregateRootBase';
import { AbstractEntityRepositoryCommon } from './AbstractEntityRepositoryCommon';

/**
 * Aggregate root entity repository base class
 */
export abstract class AbstractAggregateRootRepository<T extends AggregateRootBase<any>> extends AbstractEntityRepositoryCommon<T> {}
