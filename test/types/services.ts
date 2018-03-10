import { injected } from "../../index";

export class ServiceA {
  name: string;

  hello() {
    console.log(123);
  }
}

export class ServiceB {
  @injected()
  serviceA: ServiceA;
}

export class ServiceB2 {
  @injected()
  serviceA: ServiceA;
}


export abstract class BaseServiceC {
  @injected()
  public serviceA: ServiceA;

  public baseCSayHello() {
    return '1';
  }
}

export class ServiceC extends BaseServiceC {
  @injected()
  public serviceB: ServiceB;

  public cSayHello() {
    return '2';
  }
}

export class BaseServiceD {
  @injected()
  serviceA: ServiceA;
}

export class ServiceD extends BaseServiceD {
  @injected()
  serviceC: ServiceA;
}

export class ServiceD2 extends BaseServiceD {
  @injected()
  serviceB: ServiceB;
}

export class NotInjectedClass {
  @injected()
  serviceA: ServiceA;
}

