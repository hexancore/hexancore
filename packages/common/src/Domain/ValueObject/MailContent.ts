import { AbstractValueObject, ValueObject, ValueObjectMeta } from './ValueObject';
import V from '../../Util/Validator';
import { SyncCheckFunction } from 'fastest-validator';
import { Result, OK } from '../../Util/Result';

const checkValue: SyncCheckFunction = <SyncCheckFunction>V.compile({
  subject: { type: 'string', min: 5, max: 100 },
  html: { type: 'string', min: 100, max: 32000 },
  text: { type: 'string', min: 100, max: 32000 },
});

@ValueObject('Core')
export class MailContent extends AbstractValueObject<MailContent> {
  public readonly subject: string;
  public readonly html: string;
  public readonly text: string;

  protected constructor(subject: string, html: string, text: string) {
    super();
    this.subject = subject;
    this.html = html;
    this.text = text;
  }

  public static create(subject: string, html: string, text: string): Result<MailContent> {
    const checkResult = checkValue({ subject, html, text });
    if (checkResult !== true) {
      return AbstractValueObject.invalidRaw(
        this,
        checkResult.map((value) => value.message),
      );
    }

    return OK(new MailContent(subject, html, text));
  }

  public equals(o: MailContent): boolean {
    return this.subject === o.subject && this.html === o.html && this.text === o.text;
  }
  public toString(): string {
    return JSON.stringify(this);
  }
  public toJSON(): object {
    return this;
  }
}
