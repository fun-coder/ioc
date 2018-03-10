import { Constructor, getParentClass, IOCFactory } from "./utils";

const getSubclasses = (map, constructor) => {
  if (!map.has(constructor)) {
    map.set(constructor, []);
  }
  return map.get(constructor);
};

const build = (map, constructor) => {
  const parentConstructor = getParentClass(constructor);
  if (parentConstructor !== Object) {
    getSubclasses(map, parentConstructor).push(constructor);
    build(map, parentConstructor);
  }
  return map;
};

export const buildSubclassMap = (classes: Constructor<any>[]): Map<IOCFactory<any>, Array<IOCFactory<any>>> => {
  return classes.reduce(build, new Map());
};