import { SimpleValueObject } from './SimpleValueObject';

export abstract class StringValue<T extends StringValue<any> = any> extends SimpleValueObject<T, string> {}
