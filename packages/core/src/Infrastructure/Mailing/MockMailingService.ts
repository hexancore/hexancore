import { MailingService } from '../../Domain/Service/MailingService';
import { SendMailDto } from '../../Domain/Dto/SendMailDto';
import { NullLogger } from '../../Util/Logger';
import { LoggerService } from '@nestjs/common';
import { OK, R, Result } from '@hexcore/common';

export class MockMailingService implements MailingService {
  private logger: LoggerService;

  public constructor(logger: LoggerService = null) {
    this.logger = logger ?? new NullLogger();
  }

  public async sendEmail(data: SendMailDto): Promise<R<boolean>> {
    this.logger.log({ msg:'Sent mail', typeId: data.typeId, to: data.to.hash });
    return OK(true);
  }
}
