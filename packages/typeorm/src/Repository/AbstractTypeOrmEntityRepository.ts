import { Repository, EntitySchema, FindManyOptions, FindOneOptions, EntityManager, UpdateValuesMissingError } from 'typeorm';
import { AsyncResult, AbstractValueObject as AVO, OK, IGNORE_ERROR, INTERNAL_ERROR, AppError, isIgnoreError, ERR, P } from '@hexcore/common';
import { AbstractEntityRepository, EntityBase, EntityCollectionInterface, EntityCollectionWaitingChangesCollector } from '@hexcore/core';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TypeOrmEntityRepositoryCommon } from './TypeOrmEntityRepositoryCommon';
import { TypeOrmEntityCollectionQueries } from './TypeOrmEntityCollectionQueries';

export abstract class AbstractTypeOrmEntityRepository<
  T extends EntityBase<IdType>,
  IdType extends AVO<IdType>,
  RT extends EntityBase<RIdType>,
  RIdType extends AVO<RIdType>,
  ECQ extends TypeOrmEntityCollectionQueries<T, IdType, RT, RIdType> = TypeOrmEntityCollectionQueries<T, IdType, RT, RIdType>,
> extends AbstractEntityRepository<T, IdType, RT, RIdType, ECQ> {
  protected common: TypeOrmEntityRepositoryCommon<T, IdType>;

  public constructor(@InjectEntityManager() em: EntityManager) {
    super();
    this.common = new TypeOrmEntityRepositoryCommon(em, this.entityRepositoryMeta, this.getDomainErrors());
  }

  public persist(entity: T | T[]): AsyncResult<boolean> {
    return this.common.persist(entity);
  }

  public persistCollectionFromRoot(entity: RT | RT[]): AsyncResult<boolean> {
    const collections: EntityCollectionInterface<T, any>[] = [];
    if (Array.isArray(entity)) {
      entity.reduce((collected: any[], root: any) => {
        collected.push(root[this.rootCollectionProperty]);
        return collected;
      }, collections);
    } else {
      collections.push(entity[this.rootCollectionProperty]);
    }

    const collector = EntityCollectionWaitingChangesCollector.collectFrom(collections);
    return this.persist(collector.waitingAdd).onOk(() => {
      this.common.markEntitiesAsTracked(collector.waitingAdd);
      // todo implement updates
      return P(this.r.remove(collector.waitingRemove)).mapToTrue();
    });
  }

  public getById(id: IdType): AsyncResult<T> {
    return this.common.getById(id);
  }

  public getAll(): AsyncResult<Iterable<T>> {
    return this.common.getAll();
  }

  public getAllAsArray(): AsyncResult<T[]> {
    return this.getAll().map((entities: Iterable<T>) => Array.from(entities));
  }

  public getOne(options: FindOneOptions<T>): AsyncResult<T> {
    return this.common.getOne(options);
  }

  public find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.common.find(options);
  }

  protected get em(): EntityManager {
    return this.common.em;
  }

  protected get r(): Repository<T> {
    return this.common.r;
  }

  protected createCollectionQueries(): ECQ {
    return new TypeOrmEntityCollectionQueries<T, IdType, RT, RIdType>({ repository: this }) as any;
  }
}
