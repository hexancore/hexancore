import { nanoid } from 'nanoid/async';
import { StringId } from './StringId';

const PUBLIC_ID_SIZE = 21;

export abstract class PublicIdValue extends StringId {
  protected async generateNew(): Promise<string> {
    return "pk"+ await nanoid(PUBLIC_ID_SIZE);
  }
}
