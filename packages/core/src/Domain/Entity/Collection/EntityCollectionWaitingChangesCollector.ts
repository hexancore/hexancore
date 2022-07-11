import { EntityBase } from '../EntityBase';
import { EntityCollectionInterface } from './EntityCollectionInterface';
import { EntityCollectionQueries } from './EntityCollectionQueries';

export class EntityCollectionWaitingChangesCollector<T extends EntityBase<any>> {
  public waitingAdd: T[] = [];
  public waitingUpdate: T[] = [];
  public waitingRemove: T[] = [];

  public static collectFrom<T extends EntityBase<any>, ECQ extends EntityCollectionQueries<T> = EntityCollectionQueries<T>>(
    collection: EntityCollectionInterface<T, ECQ> | ReadonlyArray<EntityCollectionInterface<T, ECQ>>,
  ): EntityCollectionWaitingChangesCollector<T> {
    const collector = new this<T>();
    if (Array.isArray(collection)) {
      collection.reduce((collector: EntityCollectionWaitingChangesCollector<T>, c: EntityCollectionInterface<T, ECQ>) => {
        collector.waitingAdd.push(...c.waitingAdd);
        collector.waitingUpdate.push(...c.waitingUpdate);
        collector.waitingRemove.push(...c.waitingRemove);
        c.clearWaiting();
        return collector;
      }, collector);
    } else {
      const c = collection as EntityCollectionInterface<T, ECQ>;

      collector.waitingAdd.push(...c.waitingAdd);
      collector.waitingUpdate.push(...c.waitingUpdate);
      collector.waitingRemove.push(...c.waitingRemove);
      c.clearWaiting();
    }

    return collector;
  }
}
