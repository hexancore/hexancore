import { AbstractValueObject as AVO, ERRA, OKA, P, Result } from '@hexcore/common';
import { EntityBase, EntityCollectionImpl, EntityCollectionQueriesImpl } from '@hexcore/core';
import { AbstractTypeOrmEntityRepository as AbstractRepository } from './AbstractTypeOrmEntityRepository';

export interface TypeOrmEntityCollectionQueriesOptions<
  T extends EntityBase<IdType>,
  IdType extends AVO<IdType>,
  RT extends EntityBase<RIdType>,
  RIdType extends AVO<RIdType>,
> {
  repository: AbstractRepository<T, IdType, RT, RIdType>;
}

export class TypeOrmEntityCollectionQueries<
  T extends EntityBase<any>,
  IdType extends AVO<IdType>,
  RT extends EntityBase<any>,
  RIdType extends AVO<RIdType>,
> implements EntityCollectionQueriesImpl<T>
{
  public collection: EntityCollectionImpl<T, EntityCollectionQueriesImpl<T>>;

  public constructor(private options: TypeOrmEntityCollectionQueriesOptions<T, IdType, RT, RIdType>) {}

  public all(): AsyncGenerator<Result<T>, void, void> {
    const that = this;
    async function* g() {
      const propertyName = that.collection.rootIdPropertyName;

      const entities = await P(
        that.options.repository.find({
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
}
