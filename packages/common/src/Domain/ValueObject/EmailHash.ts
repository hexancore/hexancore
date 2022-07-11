import { StringValue } from './StringValue';
import * as crypto from 'crypto';
import { Email } from './Email';
import { ValueObject } from './ValueObject';
import { RegexStringIdRawType } from './RegexStringValue';

export type EmailHashRawType = RegexStringIdRawType;

@ValueObject('Core')
export class EmailHash extends StringValue<EmailHash> {
  public static createFromEmail(email: Email): EmailHash {
    return new EmailHash(crypto.createHash('sha1').update(email.v).digest('hex'));
  }
}
