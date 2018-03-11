import { Constructor, getParentClass } from "./utils";

export const getInjections: (factory: Constructor<any>) => string[] = (() => {
  const map = new Map<Constructor<any>, string[]>();
  return constructor => {
    if (!map.has(constructor)) {
      map.set(constructor, []);
    }
    return map.get(constructor);
  }
})();

export const getAllInjections = (constructor: Constructor<any>): string[] => {
  const injections = getInjections(constructor);
  const parentInjections = getInjections(getParentClass(constructor));
  return injections.concat(parentInjections);
};

export const injected = () => (target, propName: string) => {
  getInjections(target.constructor).push(propName);
};
