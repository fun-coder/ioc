import { getParentClass } from "./utils";

export const getInjections = (() => {
  const map = new Map();

  return constructor => {
    if (!map.has(constructor)) {
      map.set(constructor, []);
    }
    return map.get(constructor);
  }
})();

export const getAllInjections = constructor => {
  const injections = getInjections(constructor);
  const parentInjections = getInjections(getParentClass(constructor));
  return injections.concat(parentInjections);
};

export const injected = () => (target, propName: string) => {
  getInjections(target.constructor).push(propName);
};
