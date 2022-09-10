import { AbstractValueObject as AVO, AR, Result } from '@hexcore/common';
import { EntityBase } from '../EntityBase';
import { EIDT } from '../EntityCommonBase';
import { EntityCollectionQueries } from './EntityCollectionQueries';

export interface EntityCollectionInterface<
  T extends EntityBase<any, any>,
  EID = EIDT<T>,
  ECQ extends EntityCollectionQueries<T, EID> = EntityCollectionQueries<T>,
> extends AsyncIterable<Result<T>> {
  add(entity: T): void;
  update(entity: T): void;
  remove(entity: T): void;

  get waitingAdd(): ReadonlyArray<T>;
  get waitingUpdate(): ReadonlyArray<T>;
  get waitingRemove(): ReadonlyArray<T>;

  clearWaiting(): void;
  q?: ECQ;

  all(): AsyncGenerator<Result<T>, void, void>;
  getAllAsArray(): Promise<Result<T[]>>;
  getById(id: EID): AR<T>;
}
