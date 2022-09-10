import { AR, Result } from '@hexcore/common';
import { EntityBase } from '../EntityBase';
import { EIDT } from '../EntityCommonBase';

export interface EntityCollectionQueries<T extends EntityBase<any, any>,  EID = EIDT<T>> {
  all(): AsyncGenerator<Result<T>, void, void>;
  getById(id: EID): AR<T>;
}
