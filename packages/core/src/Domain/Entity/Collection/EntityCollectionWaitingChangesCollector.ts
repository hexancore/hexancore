import { EntityBase } from '../EntityBase';
import { EIDT } from '../EntityCommonBase';
import { EntityCollectionInterface } from './EntityCollectionInterface';
import { EntityCollectionQueries } from './EntityCollectionQueries';

export class EntityCollectionWaitingChangesCollector<T extends EntityBase<any, any>> {
  public waitingAdd: T[] = [];
  public waitingUpdate: T[] = [];
  public waitingRemove: T[] = [];

  public static collectFrom<T extends EntityBase<any, any>, EID = EIDT<T>, ECQ extends EntityCollectionQueries<T, EID> = EntityCollectionQueries<T>>(
    collection: EntityCollectionInterface<T, EID, ECQ> | ReadonlyArray<EntityCollectionInterface<T, EID, ECQ>>,
  ): EntityCollectionWaitingChangesCollector<T> {
    const collector = new this<T>();
    if (Array.isArray(collection)) {
      collection.reduce((collector: EntityCollectionWaitingChangesCollector<T>, c: EntityCollectionInterface<T, EID, ECQ>) => {
        collector.waitingAdd.push(...c.waitingAdd);
        collector.waitingUpdate.push(...c.waitingUpdate);
        collector.waitingRemove.push(...c.waitingRemove);
        c.clearWaiting();
        return collector;
      }, collector);
    } else {
      const c = collection as EntityCollectionInterface<T, EID, ECQ>;

      collector.waitingAdd.push(...c.waitingAdd);
      collector.waitingUpdate.push(...c.waitingUpdate);
      collector.waitingRemove.push(...c.waitingRemove);
      c.clearWaiting();
    }

    return collector;
  }
}
