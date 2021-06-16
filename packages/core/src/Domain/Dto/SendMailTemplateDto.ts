
import { FilePath } from '@/Util';
import { Email } from '../ValueObject/Email';

export type TemplateContentType = string | FilePath | Buffer;
export interface SendMailTemplateDto {
  readonly typeId: string;
  readonly from?: Email;
  readonly fromName?: string;
  readonly to: Email;
  readonly subject: string;
  readonly html: TemplateContentType;
  readonly text: TemplateContentType;
}
