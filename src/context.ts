import { getAllInjections } from "./injected";
import { IOCException } from "./ioc-exception";
import { Constructor, getParentClass, NoArgConstructor } from "./utils";

export class Context {

  public static create(...factories) {
    return new Context(factories);
  }

  private instanceMap: Map<NoArgConstructor, any> = new Map();
  private subClassMap: Map<NoArgConstructor, Array<NoArgConstructor>> = new Map();

  constructor(factories: NoArgConstructor[]) {
    factories.forEach(factory => {
      this.instanceMap.set(factory, null);
      this.buildSubClassMap(factory);
    });
  }

  public get<T>(constructor: Constructor<T>): T {
    this.validate(constructor);

    const instances = this.getForByParentClass(constructor);
    if (instances.length == 1) return instances[0];
    if (instances.length > 1)
      throw new IOCException(`There are ${instances.length} instances found by ${constructor.name}`);

    return this.getOrInit(constructor);
  }

  public getAll(constructor: NoArgConstructor): any[] {
    this.validate(constructor);
    const instances = this.getForByParentClass(constructor);
    const instance = this.getOrInit(constructor);
    if (instance) instances.push(instances);
    return instances;
  }

  private validate(constructor: NoArgConstructor) {
    if (!this.subClassMap.has(constructor) && !this.instanceMap.has(constructor)) {
      throw new IOCException(`${constructor.name} is not registered !!!`);
    }
  }

  public getExisted<T>(constructor: Constructor<T>): T {
    const [instance] = this.instanceMap.get(constructor);
    return instance;
  }

  private getOrInit<T>(constructor: Constructor<T>): T {
    if (this.instanceMap.has(constructor)) {
      return this.instanceMap.get(constructor) || this.inject(constructor);
    }
  }

  private inject<T>(constructor: Constructor<T>): T {
    const instance = new constructor();
    this.instanceMap.set(constructor, instance);

    getAllInjections(constructor).forEach(prop => {
      const type = Reflect.getMetadata('design:type', constructor.prototype, prop);
      const dependency = this.get(type);
      Object.defineProperty(instance, prop, { value: dependency });
    });

    return this.instanceMap.get(constructor);
  }

  private getForByParentClass(factory: NoArgConstructor): null | any[] {
    const hasSubClass = this.subClassMap.has(factory);
    if (!hasSubClass) return [];
    return this.subClassMap.get(factory)
      .map(subClass => this.getOrInit(subClass));
  }

  private buildSubClassMap(factory: NoArgConstructor) {
    const parentConstructor = getParentClass(factory);
    if (parentConstructor !== Object) {
      this.getSubClasses(parentConstructor).push(factory);
      this.buildSubClassMap(parentConstructor);
    }
  }

  private getSubClasses(parentClass: NoArgConstructor): NoArgConstructor[] {
    if (!this.subClassMap.has(parentClass)) {
      this.subClassMap.set(parentClass, []);
    }
    return this.subClassMap.get(parentClass);
  }
}