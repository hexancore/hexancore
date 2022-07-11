import { AbstractValueObject, AsyncResult, pascalCaseToCamelCase } from '@hexcore/common';
import { ENTITY_COLLECTIONS_META_PROPERTY } from '../Entity/Collection/EntityCollectionDecorator';
import { EntityCollectionQueries } from '../Entity/Collection/EntityCollectionQueries';
import { EntityBase } from '../Entity/EntityBase';
import { AbstractEntityRepositoryCommon } from './AbstractEntityRepositoryCommon';

/**
 * Entity Repository base class
 */
export abstract class AbstractEntityRepository<
  T extends EntityBase<IdType>,
  IdType extends AbstractValueObject<any>,
  RT extends EntityBase<any>,
  RIdType extends AbstractValueObject<any>,
  ECQ extends EntityCollectionQueries<T> = EntityCollectionQueries<T>,
> extends AbstractEntityRepositoryCommon<T, IdType> {
  protected ecq?: ECQ;

  public constructor() {
    super();
  }

  protected get collectionQueries(): ECQ {
    if (!this.ecq) {
      this.ecq = this.createCollectionQueries();
    }

    return this.ecq;
  }

  protected abstract createCollectionQueries(): ECQ;

  public abstract persistCollectionFromRoot(root: RT | RT[]): AsyncResult<boolean>;

  public injectCollectionQueries(entity: RT | RT[]): void {
    const entities = Array.isArray(entity) ? entity : [entity];
    entities.forEach((re: any) => {
      re[this.rootCollectionProperty].__queries = this.collectionQueries;
    });
  }

  protected get rootCollectionProperty(): string {
    return this.entityRepositoryMeta.rootCollectionProperty;
  }

  protected get rootEntityClass(): Function {
    return this.entityRepositoryMeta.rootEntityClass;
  }
}
