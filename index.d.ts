export interface Constructor<T> extends Function {
  new (): T;
}

export declare type IOCFactory<T> = Constructor<T> | Function & { prototype: T };

export declare class Context {
  static create(...args: Constructor<any>[]): Context;

  constructor(factories: Constructor<any>[]);

  public get<T>(constructor: IOCFactory<T>): T;

  public newInstance<T>(constructor: IOCFactory<T>): T;

  public getAll<T>(constructor: IOCFactory<T>): T[];

  public setOrigin(context: Context): void;
}

export declare function injected(): (target, propName: string) => void;


