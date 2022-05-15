import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, IQuery } from '@nestjs/cqrs';
import { AsyncResult } from '..';

@Injectable()
export abstract class GeneralBus {
  public abstract handleCommand<T>(command: ICommand): AsyncResult<T>;
  public abstract handleEvent(event: IEvent): AsyncResult<boolean>;
  public abstract handleQuery<T>(query: IQuery): AsyncResult<T>;
}