import { AbstractValueObject,ERR,OK,Result} from '@hexcore/common';
import { EntityBase } from '../EntityBase';
import { EntityCollectionInterface } from './EntityCollectionInterface';
import { EntityCollectionQueries } from './EntityCollectionQueries';

export interface EntityCollectionQueriesImpl<T extends EntityBase<any>> extends EntityCollectionQueries<T> {
  set collection(c: EntityCollectionImpl<T, EntityCollectionQueriesImpl<T>>);
}

export class EntityCollectionImpl<T extends EntityBase<any>, ECQ extends EntityCollectionQueriesImpl<T> = EntityCollectionQueriesImpl<T>>
  implements EntityCollectionInterface<T, ECQ>
{
  private added: T[] = [];
  private updated: T[] = [];
  private removed: T[] = [];
  public q: ECQ;

  public constructor(public readonly root: EntityBase<AbstractValueObject<any>>, public readonly rootIdPropertyName: string) {}

  public add(entity: T): void {
    this.added.push(entity);
  }

  public update(entity: T): void {
    if (entity.id === undefined) {
      throw new Error("Logic error: can't update entity without id");
    }

    if (this.root.id.equals(entity[this.rootIdPropertyName])) {
      throw new Error("Logic error: can't update entity from other aggregate root");
    }

    this.updated.push(entity);
  }

  public remove(entity: T): void {
    if (entity.id === undefined) {
      throw new Error("Logic error: can't remove entity without id");
    }

    if (this.root.id.equals(entity[this.rootIdPropertyName])) {
      throw new Error("Logic error: can't remove entity from other aggregate root");
    }
    this.removed.push(entity);
  }

  public get waitingAdd(): ReadonlyArray<T> {
    if (this.root.id) {
      this.added.forEach((e: EntityBase<any>) => {
        e[this.rootIdPropertyName] = this.root.id;
      });
    }
    return this.added;
  }

  public get waitingUpdate(): ReadonlyArray<T> {
    return this.updated;
  }

  public get waitingRemove(): ReadonlyArray<T> {
    return this.removed;
  }

  public clearWaiting(): void {
    this.added = [];
    this.updated = [];
    this.removed = [];
  }

  public all(): AsyncGenerator<Result<T>, void, void> {
    return this.q.all();
  }

  public async getAllAsArray(): Promise<Result<T[]>> {
    const b = [];
    for await (const row of this.q.all()) {
      if (row.isError()) {
        return ERR(row.e);
      }

      b.push(row.v);
    }
    return OK(b);
  }

  public [Symbol.asyncIterator](): AsyncIterator<Result<T>, void, void> {
    return this.q.all();
  }

  /**
   * Used only in infra layer.
   */
  public set __queries(q: ECQ) {
    this.q = q;
    q.collection = this;
  }
}
