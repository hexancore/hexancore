import { Email, MailContent } from '@hexcore/common';

export interface SendMailDto {
  readonly typeId: string;
  readonly from: Email;
  readonly fromName: string;
  readonly to: Email;
  readonly content: MailContent;
}
