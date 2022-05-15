import { StringValue } from './StringValue';
import { ValueObjectMeta, AbstractValueObject, ValueObject } from './ValueObject';
import { EmailHash } from './EmailHash';
import { Result, error, success } from '../../Util/Result';
import { RegexStringIdRawType, RegexStringValue } from './RegexStringValue';

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

export type EmailRawType = RegexStringIdRawType;

@ValueObject('Core')
export class Email extends RegexStringValue<Email> {
  public static c(value: string): Result<Email> {
    return this.create(value, EMAIL_REGEX);
  }

  public get local(): string {
    return this.v.split('@', 2)[0];
  }

  public get domain(): string {
    return this.v.split('@', 2)[1];
  }

  public get hash(): EmailHash {
    return EmailHash.createFromEmail(this);
  }
}
