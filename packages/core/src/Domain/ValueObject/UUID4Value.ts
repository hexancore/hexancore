import { v4 as uuidv4 } from 'uuid';
import { StringValue } from './StringValue';

const UUID4_REGEX = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;

export abstract class UUID4Value extends StringValue {

  protected static isValidValue(value: string): boolean {
    return !UUID4_REGEX.test(value);
  }

  protected static generateNewValue(): string {
    return uuidv4();
  }
}
