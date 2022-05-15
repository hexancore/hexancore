import { TemplateContentType } from '@';
import { Email } from '@hexcore/common';

export interface SendMailTemplateDto {
  readonly typeId: string;
  readonly from?: Email;
  readonly fromName?: string;
  readonly to: Email;
  readonly subject: string;
  readonly html: TemplateContentType;
  readonly text: TemplateContentType;
}
