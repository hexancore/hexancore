import { MailingService } from '../../Domain/Service/MailingService';
import { SendMailDto } from '../../Domain/Dto/SendMailDto';
import { NullLogger } from '../../Util/Logger';
import { LoggerService } from '@nestjs/common';
import { Result, success } from '../..';

export class MockMailingService implements MailingService {
  private logger: LoggerService;

  public constructor(logger: LoggerService = null) {
    this.logger = logger ?? new NullLogger();
  }

  public async sendEmail(data: SendMailDto): Promise<Result<boolean>> {
    this.logger.log({ msg:'Sent mail', typeId: data.typeId, to: data.to.getHash() });
    return success(true);
  }
}
