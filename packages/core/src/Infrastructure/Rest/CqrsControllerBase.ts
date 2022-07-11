import { GeneralBus } from '../../Util/Cqrs/GeneralBus';
import { ICommand, IQuery } from '@nestjs/cqrs';
import { HttpStatus } from '@nestjs/common';
import { AsyncResult } from '@hexcore/common';
import { FResponse, sendAsyncResultResponse } from './RestHelperFunctions';

export abstract class CqrsControllerBase {
  private readonly generalBus: GeneralBus;

  public constructor(generalBus: GeneralBus) {
    this.generalBus = generalBus;
  }

  protected handleCommandAndSendResponse(command: ICommand, response: FResponse, successCode: HttpStatus = HttpStatus.OK): Promise<void> {
    return sendAsyncResultResponse(this.handleCommand(command), response, successCode);
  }

  protected handleCommand<R>(command: ICommand): AsyncResult<R> {
    return this.generalBus.handleCommand<R>(command);
  }

  protected handleQueryAndSendResponse(query: IQuery, response: FResponse, successCode: HttpStatus = HttpStatus.OK): Promise<void> {
    return sendAsyncResultResponse(this.handleQuery(query), response, successCode);
  }

  protected handleQuery<R>(query: IQuery): AsyncResult<R> {
    return this.generalBus.handleQuery<R>(query);
  }
}
