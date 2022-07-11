import { AbstractValueObject, AR } from '@hexcore/common';
import { EntityBase } from '../Entity/EntityBase';

export interface AggregateRootRepositoryInterface<T extends EntityBase<IdType>, IdType extends AbstractValueObject<any>> {
  persist(entity: T | T[]): AR<boolean>;
  getById(id: IdType): AR<T>;
  getAll(): AR<Iterable<T>>;
  getAllAsArray(): AR<T[]>;
}
