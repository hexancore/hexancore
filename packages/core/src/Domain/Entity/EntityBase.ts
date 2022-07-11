import { AbstractValueObject } from '@hexcore/common';

export abstract class EntityBase<IdType extends AbstractValueObject<IdType>> {
  public id?: IdType;

  /**
   * managed on infrastructure level by persistanse layer like orm
   */
  public __tracked: boolean;

  /**
   * Tracks entity property modification
   */
  public __modifiedProperties: Set<string>;

  /**
   * use return this.proxify() in child class
   */
  public constructor() {
    this.__tracked = false;
  }

  protected proxify(): this {
    return new Proxy(this, {
      set: (target, prop: string, val) => {
        if (target.__tracked && !['__tracked', '__modifiedProperties'].includes(prop)) {
          if (!this.__modifiedProperties) {
            this.__modifiedProperties = new Set();
          }
          target.__modifiedProperties.add(prop);
        }
        target[prop] = val;
        return true;
      },
    });
  }

  get __modified(): boolean {
    return this.__modifiedProperties && this.__modifiedProperties.size > 0;
  }
}
