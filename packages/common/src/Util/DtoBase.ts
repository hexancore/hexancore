import { AbstractValueObject } from '@/Domain';
import { instanceToPlain, plainToInstance, Transform, TransformationType } from 'class-transformer';
import { INTERNAL_ERROR } from './AppError';
import { ERR, OK, Result } from './Result';

export const INVALID_PLAIN_OBJECT_ERROR_TYPE = 'core.dto.invalid_plain_object';

export type DtoBaseConstructor<T extends DtoBase> = {
  new (props?: Partial<T>): T;
};

export const TT = TransformationType;
export const isPT = (type: TransformationType) => type === TransformationType.CLASS_TO_PLAIN;

export function ValueObjectTransformer<T extends AbstractValueObject<any>>(t: { c: (value: any) => Result<T> }) {
  return Transform(({ value, type }) => {
    if (value) {
      if (isPT(type)) {
        return Array.isArray(value) ? value.map((v) => v.toJSON()) : value.toJSON();
      } else {
        return Array.isArray(value) ? value.map((v) => (t as any).c(v)) : (t as any).c(value);
      }
    }

    return undefined;
  });
}

export function DtoTransformer<T extends DtoBase>(t: { new (): T }) {
  return Transform(({ value, type }) => {
    if (value) {
      if (isPT(type)) {
        return Array.isArray(value) ? value.map((v) => v.toJSON()) : value.toJSON();
      } else {
        return Array.isArray(value) ? value.map((v) => (t as any).fromPlain(v)) : (t as any).fromPlain(value);
      }
    }

    return undefined;
  });
}

export function BigIntTransformer() {
  return Transform(({ value, type }) => {
    if (value) {
      if (isPT(type)) {
        return Array.isArray(value) ? value.map((v) => v.toString()) : value.toString();
      } else {
        return Array.isArray(value) ? value.map((v) => BigInt(v)) : BigInt(value);
      }
    }

    return undefined;
  });
}

export abstract class DtoBase {
  public static cs<T extends DtoBase>(this: DtoBaseConstructor<T>, props: Partial<T>): T {
    const i = new this();
    Object.assign(i, props);
    return i;
  }
  public static fromPlain<T extends DtoBase>(this: DtoBaseConstructor<T>, plain: any): Result<T> {
    try {
      const i: any = plainToInstance(this, plain);
      return (this as any).processFromPlain(i);
    } catch (e) {
      return ERR(INTERNAL_ERROR(e));
    }
  }

  /**
   * @param i
   * @returns Result of tranformation from plain
   */
  protected static processFromPlain<T extends DtoBase>(this: DtoBaseConstructor<T>, i: any): Result<any> {
    const errors = [];

    for (const p in i) {
      const v = i[p];
      if (v instanceof Result) {
        if (v.isError()) {
          errors.push(v.e);
        } else {
          i[p] = v.v;
        }
      }
    }
    if (errors.length > 0) {
      return ERR(INVALID_PLAIN_OBJECT_ERROR_TYPE, 400, {
        className: this.name,
        errors,
      });
    }
    return OK(i);
  }

  public toJSON() {
    return instanceToPlain(this);
  }
}
