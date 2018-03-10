import { getAllInjections } from "./injected";
import { IOCException } from "./ioc-exception";
import { Constructor, IOCFactory } from "./utils";
import { buildSubclassMap } from "./build-subclass-map";

export class Context {

  public static create(...factories: Constructor<any>[]) {
    return new Context(factories);
  }

  private instanceMap: Map<Constructor<any>, any> = new Map();
  private subClassMap: Map<IOCFactory<any>, Array<IOCFactory<any>>> = new Map();
  private origin?: Context;

  private constructor(factories: Constructor<any>[]) {
    this.instanceMap = factories.reduce((map, factory) => map.set(factory, null), new Map());
    this.subClassMap = buildSubclassMap(factories);
  }

  public get<T>(constructor: IOCFactory<T>): T {
    const instances = this.getAllInstances(constructor);
    Context.checkForOne(instances, constructor);
    return instances[0];
  }

  public newInstance<T>(constructor: IOCFactory<T>): T {
    const types = this.getFactories(constructor)
      .concat(this.origin ? this.origin.getFactories(constructor) : []);
    Context.checkForOne(types, constructor);
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

  public getAll<T>(constructor: IOCFactory<T>): T[] {
    const instances = this.getAllInstances(constructor);
    if (instances.length === 0) throw new IOCException(`${constructor.name} is not registered !!!`);
    return instances;
  }

  public setOrigin(context: Context): void {
    this.origin = context;
  }

  private getAllInstances<T>(constructor: IOCFactory<T>): T[] {
    return this.getFactories(constructor)
      .map(type => this.getOfSelf(type))
      .concat(this.origin ? this.origin.getAllInstances(constructor) : []);
  }

  private inject<T>(constructor: Constructor<T>): T {
    const instance = this.generateInstance(constructor);
    this.instanceMap.set(constructor, instance);
    return instance;
  }

  private getAllTypes<T>(factory: IOCFactory<T>): IOCFactory<T>[] {
    const subclasses = this.subClassMap.get(factory) || [];
    return subclasses.reduce((classes, subclass) => classes.concat(this.getAllTypes(subclass)), [factory]);
  }

  private getFactories<T>(factory: IOCFactory<T>): Constructor<T>[] {
    return <Constructor<T>[]> this.getAllTypes(factory)
      .filter(type => this.instanceMap.has(<Constructor<T>>type))
  }

  public getOfSelf<T>(constructor: Constructor<T>): T | null {
    if (!this.instanceMap.has(constructor)) return null;
    return this.instanceMap.get(constructor) || this.inject(constructor);
  }

  private static checkForOne(list: any[], constructor: IOCFactory<any>): void {
    if (list.length > 1) {
      throw new IOCException(`There are ${list.length} instances found by ${constructor.name}`);
    } else if (list.length == 0) {
      throw new IOCException(`${constructor.name} is not registered !!!`);
    }
  }
}