export type Constructor<T> = { new(): T };
export type NoArgConstructor = { new() };

export const getParentClass = (constructor: NoArgConstructor): NoArgConstructor => constructor.prototype.__proto__.constructor;

export const getAttachedKeys = key => target => {
  if (!target[key]) {
    Object.defineProperty(target, key, { value: [], enumerable: false, });
  }
  return target[key];
};
