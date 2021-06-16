import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, ICommand, IEvent, IQuery, QueryBus } from '@nestjs/cqrs';
import { AsyncResult, fromSafePromise, successAsync } from '../AsyncResult';
import { GeneralBus } from './GeneralBus';

@Injectable()
export class DefaultGeneralBus extends GeneralBus {
  private commandBus: CommandBus;
  private eventBus: EventBus;
  private queryBus: QueryBus;

  public constructor(commandBus: CommandBus, eventBus: EventBus, queryBus: QueryBus) {
    super();
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.queryBus = queryBus;
  }

  public handleCommand<T>(command: ICommand): AsyncResult<T> {
    return fromSafePromise(this.commandBus.execute(command));
  }

  public handleEvent(event: IEvent): AsyncResult<boolean> {
    return this.eventBus.publish(event);
  }

  public handleQuery<T>(query: IQuery): AsyncResult<T> {
    return fromSafePromise(this.queryBus.execute(query));
  }
}
