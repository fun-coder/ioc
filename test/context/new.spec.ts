import 'mocha'
import { expect } from 'chai';
import {
  BaseServiceC, BaseServiceD, NotInjectedClass, ServiceA, ServiceB, ServiceB2, ServiceC, ServiceD,
  ServiceD2
} from '../types/services';
import { Context } from "../../index";

describe('Context::newInstance', () => {
  const parentCtx = Context.create(ServiceA, ServiceB, ServiceB2);
  const childCtx = Context.create(ServiceC, ServiceD, ServiceD2);

  childCtx.setOrigin(parentCtx);

  it('should return new instance', () => {
    const service = parentCtx.newInstance(ServiceA);
    const secondService = parentCtx.newInstance(ServiceA);
    const thirdService = parentCtx.newInstance(ServiceA);
    expect(service.constructor).to.eq(ServiceA);
    expect(service).to.not.eq(secondService);
    expect(secondService).to.not.eq(thirdService);
  });

  it('should new parent instance when parameter in the parent context constructor list', () => {
    const serviceA = childCtx.newInstance(ServiceA);
    expect(serviceA.constructor).to.eq(ServiceA);
  });
});