import { MailingService } from '../../Domain/Service/MailingService';
import { SendMailDto } from '../../Domain/Dto/SendMailDto';
import { Result, success} from '../../Util/Result';
import { Logger, NullLogger } from '../../Util/Logger';

export class MockMailingService implements MailingService {
  private logger: Logger;

  public constructor(logger: Logger = null) {
    this.logger = logger ?? new NullLogger();
  }

  public async sendEmail(data: SendMailDto): Promise<Result<boolean>> {
    this.logger.info('Sent mail', { typeId: data.typeId, to: data.to.getHash() });
    return success(true);
  }
}
