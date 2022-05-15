export abstract class Entity<IdType> {
  public id?: IdType;

  public tracking: boolean;
  public readonly modifiedProperties: Set<string>;

  public constructor(id?: IdType) {
    this.id = id;
    this.tracking = false;
    this.modifiedProperties = new Set();
  }

  protected proxify(): this {
    return new Proxy(this, {
      set: (target, prop: string, val) => {
        if (!['tracking', 'modifiedProperties'].includes(prop) && target.tracking) {
          target.modifiedProperties.add(prop);
        }
        target[prop] = val;
        return true;
      },
    });
  }
}
