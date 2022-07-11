
import { Result } from '@hexcore/common';
import { SendMailDto } from '../Dto/SendMailDto';

export interface MailingService {
  sendEmail(data: SendMailDto): Promise<Result<boolean>>;
}
