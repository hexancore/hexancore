import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, ICommand, IEvent, IQuery, QueryBus } from '@nestjs/cqrs';
import { AsyncResult, OKA, P } from '@hexcore/common';
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
    return P(this.commandBus.execute(command));
  }

  public handleEvent(event: IEvent): AsyncResult<boolean> {
    this.eventBus.publish(event);
    return OKA(true);
  }

  public handleQuery<T>(query: IQuery): AsyncResult<T> {
    return P(this.queryBus.execute(query));
  }
}
