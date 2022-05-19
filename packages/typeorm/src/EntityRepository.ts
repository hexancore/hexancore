import { Repository, EntitySchema, EntityRepository } from 'typeorm';
import { AsyncResult, fromPromise, success, AbstractValueObject } from '@hexcore/common';
import { ModuleEntityNotFoundErrorResult, ModuleEntityRepositoryInterface, ModuleEntityRepository } from '@hexcore/core';

/**
 * Decorator
 * @param moduleName Name of module
 * @param entitySchema Schema of entity
 */
export function TypeOrmModuleEntityRepository(moduleName: string, entitySchema: EntitySchema): (constructor: Function) => void {
  return function (constructor: Function) {
    ModuleEntityRepository(moduleName, entitySchema.options.target)(constructor);
    EntityRepository(entitySchema)(constructor);
  };
}

export class AbstractTypeOrmModuleEntityRepository<T extends any, IdType extends AbstractValueObject<any>>
  extends Repository<T>
  implements ModuleEntityRepositoryInterface<T, IdType>
{
  public persist(entity: T): AsyncResult<boolean> {
    return fromPromise(this.save(entity as any)).mapToTrue();
  }

  public getById(id: IdType): AsyncResult<T> {
    return fromPromise(
      this.findOne({
        where: {
          id,
        },
      }),
    ).andThen((p?: T) => {
      return p ? success(p) : ModuleEntityNotFoundErrorResult(this, { id });
    });
  }

  public getAll(): AsyncResult<Iterable<T>> {
    return fromPromise(super.find());
  }
}
