import { nanoid } from 'nanoid/async';
import { StringId } from './StringId';
import { AsyncResult, fromPromise } from '../../Util/AsyncResult';

const PUBLIC_ID_SIZE = 21;
const isValidRegex = /^[A-Za-z0-9_-]{21}$/;

export abstract class PublicIdValue extends StringId {
  protected static generateNew(): AsyncResult<string> {
    return fromPromise(nanoid(PUBLIC_ID_SIZE), (e) => {throw e;});
  }

  protected static isValidValue(value: string): boolean {
    return isValidRegex.test(value);
  }
}
