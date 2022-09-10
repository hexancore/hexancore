import { AbstractValueObject as AVO, AsyncResult, OK, P } from '@hexcore/common';
import { AbstractAggregateRootRepository, AggregateRootBase, EIDT } from '@hexcore/core';
import { EntityManager, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { InjectEntityManager } from '@nestjs/typeorm';
import { TypeOrmEntityRepositoryCommon } from './TypeOrmEntityRepositoryCommon';

export abstract class AbstractTypeOrmAggregateRootRepository<
  T extends AggregateRootBase<any>,
  EID = EIDT<T>,
> extends AbstractAggregateRootRepository<T> {
  protected common: TypeOrmEntityRepositoryCommon<T, EID>;

  public constructor(@InjectEntityManager() em: EntityManager) {
    super();
    this.common = new TypeOrmEntityRepositoryCommon(em, this.entityRepositoryMeta, this.getDomainErrors());
  }

  public persist(entity: T | T[]): AsyncResult<boolean> {
    return this.common.persist(entity);
  }

  public getById(id: EIDT<T>): AsyncResult<T> {
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

  protected find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.common.find(options);
  }

  protected get r(): Repository<T> {
    return this.common.r;
  }

  protected get em(): EntityManager {
    return this.common.em;
  }
}
