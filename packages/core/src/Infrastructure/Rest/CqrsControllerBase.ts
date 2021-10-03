import { GeneralBus } from '../../Util/Cqrs/GeneralBus';
import { ICommand, IQuery } from '@nestjs/cqrs';
import { HttpStatus } from '@nestjs/common';
import { FResponse, sendAsyncResultResponse } from '@';

export abstract class CqrsControllerBase {
  private readonly generalBus: GeneralBus;

  public constructor(generalBus: GeneralBus) {
    this.generalBus = generalBus;
  }

  protected handleCommandAndSendResponse(command: ICommand, response: FResponse, successCode: HttpStatus = HttpStatus.OK): Promise<void> {
    return sendAsyncResultResponse(this.generalBus.handleCommand(command), response, successCode);
  }

  protected handleQueryAndSendResponse(query: IQuery, response: FResponse, successCode: HttpStatus = HttpStatus.OK): Promise<void> {
    return sendAsyncResultResponse(this.generalBus.handleCommand(query), response, successCode);
  }
}
