import { Email } from '../ValueObject/Email';
import { MailContent } from '../ValueObject/MailContent';

export interface SendMailDto {
  readonly typeId: string;
  readonly from: Email;
  readonly fromName: string;
  readonly to: Email;
  readonly content: MailContent;
}
