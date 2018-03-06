import 'mocha'
import { expect } from 'chai';
import {
  BaseServiceD, NotInjectedClass, ServiceA, ServiceB, ServiceB2, ServiceC, ServiceD, ServiceD2
} from '../types/services';
import { Context } from "../../index";

describe('Context::setOrigin', () => {

  const parentCtx = Context.create(ServiceA, ServiceB, ServiceB2, ServiceD);
  const childCtx = Context.create(ServiceC, ServiceD2);

  childCtx.setOrigin(parentCtx);

  it('should get origin instance as dependency', () => {
    const serviceC = childCtx.get(ServiceC);
    expect(serviceC.constructor).to.eq(ServiceC);

    const serviceA = parentCtx.get(ServiceA);
    expect(serviceC.serviceA).to.eq(serviceA);
  });

  it('should get all instance from origin context and current context', () => {
    const services = childCtx.getAll(BaseServiceD);
    expect(services.length).to.eq(2);
  });
});