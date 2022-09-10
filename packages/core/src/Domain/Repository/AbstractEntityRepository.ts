import { AsyncResult } from '@hexcore/common';
import { EntityCollectionQueries } from '../Entity/Collection/EntityCollectionQueries';
import { EntityBase, RT } from '../Entity/EntityBase';
import { EIDT } from '../Entity/EntityCommonBase';
import { AbstractEntityRepositoryCommon } from './AbstractEntityRepositoryCommon';

/**
 * Entity Repository base class
 */
export abstract class AbstractEntityRepository<
  T extends EntityBase<any, any>,
  EID = EIDT<T>,
  ECQ extends EntityCollectionQueries<T, EID> = EntityCollectionQueries<T, EID>,
> extends AbstractEntityRepositoryCommon<T> {
  public constructor() {
    super();
  }

  public abstract persistCollectionFromRoot(root: RT<T> | RT<T>[]): AsyncResult<boolean>;

  public injectCollectionQueries(entity: RT<T> | RT<T>[]): void {
    const entities = Array.isArray(entity) ? entity : [entity];
    entities.forEach((re: any) => {
      re[this.rootCollectionProperty].__queries = this.createCollectionQueries();
    });
  }

  protected abstract createCollectionQueries(): ECQ;

  protected get rootCollectionProperty(): string {
    return this.entityRepositoryMeta.rootCollectionProperty;
  }

  protected get rootEntityClass(): Function {
    return this.entityRepositoryMeta.rootEntityClass;
  }
}
