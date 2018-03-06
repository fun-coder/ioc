import 'mocha'
import { expect } from 'chai';
import {
  BaseServiceD, NotInjectedClass, ServiceA, ServiceB, ServiceB2, ServiceC, ServiceD, ServiceD2
} from '../types/services';
import { Context } from "../../index";

describe('Context::getAll', () => {

  const ctx = Context.create(ServiceA, ServiceB, ServiceB2, ServiceC, ServiceD, ServiceD2);

  it('should get all the injected subclass instances by parent class', () => {
    const services = ctx.getAll(BaseServiceD);
    expect(services.length).to.eq(2);
    const constructors = services.map(service => service.constructor);
    expect(constructors).to.include(ServiceD);
    expect(constructors).to.include(ServiceD2);
  });

  it('should throw error when get a not injected type', () => {
    expect(() => ctx.getAll(NotInjectedClass))
      .to
      .throw(`${NotInjectedClass.name} is not registered !!!`);
  });
});