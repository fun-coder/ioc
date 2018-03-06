import 'mocha'
import { expect } from 'chai';
import {
  BaseServiceC, BaseServiceD, NotInjectedClass, ServiceA, ServiceB, ServiceB2, ServiceC, ServiceD,
  ServiceD2
} from '../types/services';
import { Context } from "../../index";

describe('Context::get', () => {

  const ctx = Context.create(ServiceA, ServiceB, ServiceB2, ServiceC, ServiceD, ServiceD2);

  it('should return the instance of given constructor', () => {
    const serviceA = ctx.get(ServiceA);
    expect(serviceA.constructor).to.eq(ServiceA);
  });

  it('should return the same object when get one type twice', () => {
    const serviceA = ctx.get(ServiceA);
    const secondUserService = ctx.get(ServiceA);
    expect(serviceA).to.eq(secondUserService);
  });

  it('should inject the dependencies to the instance', () => {
    const serviceB = ctx.get(ServiceB);
    expect(serviceB.serviceA.constructor).to.eq(ServiceA);
  });

  it('should inject the parent class properties', () => {
    const serviceC = ctx.get(ServiceC);
    const serviceA = ctx.get(ServiceA);
    expect(serviceC.serviceA).to.eq(serviceA);
  });

  it('should get the injected subclass by parent class', () => {
    const serviceC = ctx.get(BaseServiceC);
    expect(serviceC.constructor).to.eq(ServiceC);
  });

  it('should throw error when get a not injected type', () => {
    expect(() => ctx.get(NotInjectedClass))
      .to
      .throw(`${NotInjectedClass.name} is not registered !!!`);
  });

  it('should throw error when class has two injected subclasses', () => {
    expect(() => ctx.get(BaseServiceD))
      .to
      .throw(`There are 2 instances found by ${BaseServiceD.name}`);
  });
});