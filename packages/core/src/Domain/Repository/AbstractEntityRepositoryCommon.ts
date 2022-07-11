import { CurrentTime, Result, pascalCaseToSnakeCase, INTERNAL_ERR, AbstractValueObject, R } from '@hexcore/common';
import { EntityBase } from '../Entity/EntityBase';
import { ENTITY_REPOSITORY_META_PROPERTY } from './EntityRepositoryDecorator';

export abstract class AbstractEntityRepositoryCommon<T extends EntityBase<IdType>, IdType extends AbstractValueObject<any>> {
  public ct: CurrentTime;

  public constructor() {
    this.ct = CurrentTime.i;
  }

  public get entityName(): string {
    return this.entityClass.name;
  }

  public get entityClass(): Function {
    return this.entityRepositoryMeta.entityClass;
  }

  public get moduleName(): string {
    return this.entityRepositoryMeta.module;
  }

  protected get entityRepositoryMeta() {
    return this.constructor[ENTITY_REPOSITORY_META_PROPERTY];
  }

  protected abstract getDomainErrors(): Object;

  protected duplicateError<T>(data?: any): R<T> {
    return this.entityError('duplicate', data);
  }

  protected notFoundError<T>(searchCriteria: Record<string, any>): R<T> {
    return this.entityError('not_found', { searchCriteria });
  }

  protected entityError<T>(type: string, data?: any): R<T> {
    const entityType = pascalCaseToSnakeCase(this.entityName);
    const entityErrors = this.getDomainErrors()['entity'][entityType];
    if (!entityErrors) {
      return INTERNAL_ERR(new Error('Undefined domain error: ' + entityType));
    }
    return entityErrors.err(type, data);
  }
}
