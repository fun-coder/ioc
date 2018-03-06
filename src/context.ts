import { getAllInjections } from "./injected";
import { IOCException } from "./ioc-exception";
import { Constructor, getParentClass, NoArgConstructor } from "./utils";

export class Context {

  public static create(...factories) {
    return new Context(factories);
  }

  private instanceMap: Map<NoArgConstructor, any> = new Map();
  private subClassMap: Map<NoArgConstructor, Array<NoArgConstructor>> = new Map();
  private origin?: Context;

  private constructor(factories: NoArgConstructor[]) {
    factories.forEach(factory => {
      this.instanceMap.set(factory, null);
      this.buildSubClassMap(factory);
    });
  }

  public get<T>(constructor: Constructor<T>): T {
    const instances = this.getAllInstances(constructor);
    if (instances.length === 1) return instances[0];
    if (instances.length > 1)
      throw new IOCException(`There are ${instances.length} instances found by ${constructor.name}`);
    if (instances.length === 0)
      throw new IOCException(`${constructor.name} is not registered !!!`);
  }

  public getAll<T>(constructor: Constructor<T>): T[] {
    const instances = this.getAllInstances(constructor);
    if (instances.length === 0 && this.origin) instances.push(...this.origin.getAll(constructor));
    if (instances.length === 0) throw new IOCException(`${constructor.name} is not registered !!!`);
    return instances;
  }

  public setOrigin(context: Context): void {
    this.origin = context;
  }

  private getAllInstances<T>(constructor: Constructor<T>): T[] {
    const instances = this.getForByParentClass(constructor);
    const instance = this.getOrInit(constructor);
    if (instance) instances.push(instance);
    return instances;
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

  private getForByParentClass<T>(factory: Constructor<T>): T[] {
    const hasSubClass = this.subClassMap.has(factory);
    if (!hasSubClass) return [];
    return this.subClassMap.get(factory)
      .map(subClass => this.getOrInit(subClass));
  }

  private getOrInit<T>(constructor: Constructor<T>): T {
    if (this.instanceMap.has(constructor)) {
      return this.instanceMap.get(constructor) || this.inject(constructor);
    }
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