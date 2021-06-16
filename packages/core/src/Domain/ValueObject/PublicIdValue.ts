import { Id } from './Id';
import { StringValue } from './StringValue';
import { nanoid } from 'nanoid/async'

const PUBLIC_ID_SIZE = 21;

export abstract class PublicIdValue extends StringValue implements Id {

  protected async generateNew(): Promise<string> {
    return "pk"+ await nanoid(PUBLIC_ID_SIZE);
  }
}
