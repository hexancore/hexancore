import { StringValue } from './StringValue';
import { ValueObjectMeta, ValueObject } from './ValueObject';
import { EmailHash } from './EmailHash';
import { Result, error, success } from '../../Util/Result';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

const META: ValueObjectMeta = {
  module: 'Core',
  class: 'Email',
};

export type EmailRawType = string;

export class Email extends StringValue {
  public static create(value: string): Result<Email> {
    if (EMAIL_REGEX.test(value)) {
      return success(new Email(value.toLowerCase()));
    }

    return error(ValueObject.createInvalidRawValueError(META, ["'" + value + "' is not email"]));
  }

  public getLocalPart(): string {
    return this.v.split('@', 2)[0];
  }

  public getDomain(): string {
    return this.v.split('@', 2)[1];
  }

  public getHash(): EmailHash {
    return EmailHash.createFromEmail(this);
  }
}
