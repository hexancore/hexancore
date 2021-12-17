import { StringValue } from './StringValue';
import * as crypto from 'crypto';
import { Email } from './Email';

export type EmailHashRawType = string;

export class EmailHash extends StringValue {
  public static createFromEmail(email: Email): EmailHash {
    return new EmailHash(
      crypto
        .createHash('sha1')
        .update(email.getRaw())
        .digest('hex'),
    );
  }
}
