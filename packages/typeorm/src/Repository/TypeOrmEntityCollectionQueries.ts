import { AR, ERRA, OKA, P, Result } from '@hexcore/common';
import { EIDT, EntityBase, EntityCollectionImpl, EntityCollectionQueriesImpl } from '@hexcore/core';
import { AbstractTypeOrmEntityRepository as AbstractRepository } from './AbstractTypeOrmEntityRepository';

type RT = AbstractRepository<any, any, any>;
export interface TypeOrmEntityCollectionQueriesOptions<R extends RT = RT> {
  r: R;
}

export class TypeOrmEntityCollectionQueries<T extends EntityBase<any, any>, EID = EIDT<T>, R extends RT = any>
  implements EntityCollectionQueriesImpl<T, EID>
{
  public collection: EntityCollectionImpl<T, EID>;

  public constructor(public r: R) {}

  public all(): AsyncGenerator<Result<T>, void, void> {
    const that = this;
    async function* g() {
      const propertyName = that.collection.rootIdPropertyName;

      const entities = await P(
        that.r.find({
          where: {
            [propertyName]: that.collection.root.id,
          } as any,
        }),
      );

      if (entities.isError()) {
        yield ERRA<T>(entities.e).promise;
      }

      for (const entity of entities.v) {
        yield OKA(entity);
      }

      return;
    }

    return g();
  }

  public getById(id: EID): AR<T> {
    return this.r.getById(id, this.collection);
  }
}
