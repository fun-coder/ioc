import { getAllInjections } from "./injected";
import { IOCException } from "./ioc-exception";
import { Constructor, getParentClass, NoArgConstructor } from "./utils";

export class Context {

  public static create(...factories: NoArgConstructor[]) {
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
    this.checkForOnInstance(instances, constructor);
    return instances[0];
  }

  public newInstance<T>(constructor: Constructor<T>): T {
    const types = this.getAllTypes(constructor)
      .filter(type => this.instanceMap.has(type))
      .concat(this.origin ? this.origin.getAllTypes(constructor) : []);
    this.checkForOnInstance(types, constructor);
    return this.generateInstance(types[0]);
  }

  private generateInstance<T>(constructor: Constructor<T>): T {
    const instance = new constructor();
    getAllInjections(constructor).forEach(prop => {
      const type = Reflect.getMetadata('design:type', constructor.prototype, prop);
      const dependency = this.get(type);
      Object.defineProperty(instance, prop, { value: dependency });
    });
    return instance;
  }

  public getAll<T>(constructor: Constructor<T>): T[] {
    const instances = this.getAllInstances(constructor);
    if (instances.length === 0) throw new IOCException(`${constructor.name} is not registered !!!`);
    return instances;
  }

  public setOrigin(context: Context): void {
    this.origin = context;
  }

  private getAllInstances<T>(constructor: Constructor<T>): T[] {
    return this.getAllTypes(constructor)
      .filter(type => this.instanceMap.has(type))
      .map(type => this.getOfSelf(type))
      .concat(this.origin ? this.origin.getAllInstances(constructor) : []);
  }

  private inject<T>(constructor: Constructor<T>): T {
    const instance = this.generateInstance(constructor);
    this.instanceMap.set(constructor, instance);
    return instance;
  }

  private getAllTypes(factory: NoArgConstructor): NoArgConstructor[] {
    const subclasses = this.subClassMap.get(factory) || [];
    return subclasses.reduce((classes, subclass) => classes.concat(this.getAllTypes(subclass)), [factory]);
  }

  public getOfSelf<T>(constructor: Constructor<T>): T | null {
    if (!this.instanceMap.has(constructor)) return null;
    return this.instanceMap.get(constructor) || this.inject(constructor);
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

  private checkForOnInstance(instances: any[], constructor: NoArgConstructor) {
    if (instances.length > 1) {
      throw new IOCException(`There are ${instances.length} instances found by ${constructor.name}`);
    } else if (instances.length == 0) {
      throw new IOCException(`${constructor.name} is not registered !!!`);
    }
  }
}