import { Result } from '@hexcore/common';
import { EntityBase } from '../EntityBase';

export interface EntityCollectionQueries<T extends EntityBase<any>> {
  all(): AsyncGenerator<Result<T>, void, void>;
}
