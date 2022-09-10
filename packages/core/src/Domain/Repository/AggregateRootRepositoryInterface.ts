import { AR } from '@hexcore/common';
import { AggregateRootBase } from '../Entity/AggregateRootBase';
import { EIDT } from '../Entity/EntityCommonBase';

export interface AggregateRootRepositoryInterface<T extends AggregateRootBase<any>> {
  persist(entity: T | T[]): AR<boolean>;
  getById(id: EIDT<T>): AR<T>;
  getAll(): AR<Iterable<T>>;
  getAllAsArray(): AR<T[]>;
}
