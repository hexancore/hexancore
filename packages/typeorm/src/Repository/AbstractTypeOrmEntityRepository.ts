import { Repository, FindManyOptions, FindOneOptions, EntityManager } from 'typeorm';
import { AsyncResult, P } from '@hexcore/common';
import {
  AbstractEntityRepository,
  EIDT,
  EntityBase,
  EntityCollectionImpl,
  EntityCollectionInterface,
  EntityCollectionWaitingChangesCollector,
  RT,
} from '@hexcore/core';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TypeOrmEntityRepositoryCommon } from './TypeOrmEntityRepositoryCommon';
import { TypeOrmEntityCollectionQueries } from './TypeOrmEntityCollectionQueries';

export abstract class AbstractTypeOrmEntityRepository<
  T extends EntityBase<any, any>,
  EID = EIDT<T>,
  ECQ extends TypeOrmEntityCollectionQueries<T, EID> = TypeOrmEntityCollectionQueries<T, EID>,
> extends AbstractEntityRepository<T, EID, ECQ> {
  protected common: TypeOrmEntityRepositoryCommon<T, EID>;

  protected isRootIdPropertyPrimary?: boolean;

  public constructor(@InjectEntityManager() em: EntityManager) {
    super();
    this.common = new TypeOrmEntityRepositoryCommon(em, this.entityRepositoryMeta, this.getDomainErrors());
  }

  public persist(entity: T | T[]): AsyncResult<boolean> {
    return this.common.persist(entity);
  }

  public persistCollectionFromRoot(entity: RT<T> | RT<T>[]): AsyncResult<boolean> {
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
      return this.persist(collector.waitingUpdate).onOk(() => P(this.r.remove(collector.waitingRemove)).mapToTrue());
    });
  }

  public getById(id: EID, collection: EntityCollectionImpl<T, EID>): AsyncResult<T> {
    const rootIdProperty = collection.rootIdPropertyName;
    if (this.isRootIdPropertyPrimary === undefined) {
      this.isRootIdPropertyPrimary = this.r.metadata.columns.find((c) => c.propertyName == rootIdProperty && c.isPrimary) !== undefined;
    }

    if (this.isRootIdPropertyPrimary) {
      return this.common.getById({ [rootIdProperty]: collection.root.id, id } as any);
    }

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

  protected set em(value: EntityManager) {
    this.common.em = value;
  }

  protected get r(): Repository<T> {
    return this.common.r;
  }

  protected createCollectionQueries(): ECQ {
    return new TypeOrmEntityCollectionQueries(this) as any;
  }
}
