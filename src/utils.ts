export interface Constructor<T> extends Function {
  new (): T;
}
export type AbstractConstructor<T> = Function & { prototype: T }
export type IOCFactory<T> = Constructor<T> | AbstractConstructor<T>;
export const getParentClass = (constructor: Constructor<any>): Constructor<any> => constructor.prototype.__proto__.constructor;

export const getAttachedKeys = key => target => {
  if (!target[key]) {
    Object.defineProperty(target, key, { value: [], enumerable: false, });
  }
  return target[key];
};
