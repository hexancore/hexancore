import { AsyncResult } from '@hexcore/common';
import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, IQuery } from '@nestjs/cqrs';

@Injectable()
export abstract class GeneralBus {
  public abstract handleCommand<T>(command: ICommand): AsyncResult<T>;
  public abstract handleEvent(event: IEvent): AsyncResult<boolean>;
  public abstract handleQuery<T>(query: IQuery): AsyncResult<T>;
}