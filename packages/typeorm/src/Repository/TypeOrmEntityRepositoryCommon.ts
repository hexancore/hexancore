import { Repository, EntitySchema, FindManyOptions, FindOneOptions, EntityManager, UpdateValuesMissingError } from 'typeorm';
import { AsyncResult, AbstractValueObject as AVO, OK, IGNORE_ERROR, INTERNAL_ERROR, AppError, isIgnoreError, ERR, P, AR, SAR } from '@hexcore/common';
import { AbstractEntityRepository, AbstractEntityRepositoryCommon, EIDT, EntityBase } from '@hexcore/core';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export class TypeOrmEntityRepositoryCommon<T extends EntityBase<any, any>, EID = EIDT<T>> extends AbstractEntityRepositoryCommon<T> {
  private propertiesToFillWithNow: string[];

  protected repository: Repository<T>;

  public constructor(public em: EntityManager, protected meta: any, protected domainErrors: Object) {
    super();
  }

  public persist(entity: T | T[]): AR<boolean> {
    const entities = Array.isArray(entity) ? entity : [entity];
    this.injectNowToEntities(entities);

    return P(this.r.save(entities as any), (e: Error) => (e instanceof UpdateValuesMissingError ? IGNORE_ERROR() : INTERNAL_ERROR(e)))
      .onOk(() => {
        this.markEntitiesAsTracked(entities);
        return OK(true);
      })
      .onErr((e: AppError) => {
        if (!isIgnoreError(e)) {
          if (e.message.startsWith('Duplicate entry')) {
            return this.duplicateError();
          }
          return ERR<boolean>(e);
        }
        this.markEntitiesAsTracked(entities);
        return OK(true);
      });
  }

  public getById(id: EID): AsyncResult<T> {
    let key: any = { id };
    if (this.r.metadata.hasMultiplePrimaryKeys) {
      key = { ...id };
    }
    return this.getOne({
      where: key,
    });
  }

  public getAll(): AsyncResult<Iterable<T>> {
    return P(this.find());
  }

  public getOne(options: FindOneOptions<T>): AsyncResult<T> {
    return P(this.r.findOne(options)).onOk((entity: T) => {
      if (!entity) {
        return this.notFoundError(options.where);
      }
      this.markEntitiesAsTracked([entity]);
      return OK<T>(entity);
    });
  }

  public find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.r.find(options).then((entities: T[]) => {
      this.markEntitiesAsTracked(entities);
      return entities;
    });
  }

  public markEntitiesAsTracked(entities: T[]): void {
    entities.forEach((e: T) => {
      if (e.__modifiedProperties) {
        e.__modifiedProperties = undefined;
      }
      e.__tracked = true;
    });
  }

  public injectNowToEntities(entities: T[]): void {
    if (this.propertiesToFillWithNow === undefined) {
      this.propertiesToFillWithNow = [];
      this.r.metadata.columns.forEach((c: ColumnMetadata) => {
        if (c.type === 'timestamp' && !c.isNullable) {
          this.propertiesToFillWithNow.push(c.propertyName);
        }
      });
    }

    if (this.propertiesToFillWithNow.length > 0) {
      const now = this.ct.now;
      this.propertiesToFillWithNow.forEach((propertyName: string) => {
        entities.forEach((e: T) => {
          e[propertyName] = e[propertyName] ?? now;
        });
      });
    }
  }

  public get entityRepositoryMeta() {
    return this.meta;
  }

  public getDomainErrors(): Object {
    return this.domainErrors;
  }

  public get r(): Repository<T> {
    if (!this.repository) {
      this.repository = this.em.getRepository(this.meta.entityClass);
    }
    return this.repository;
  }
}
