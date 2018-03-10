IOC Container  
---

[![Build Status](https://travis-ci.org/fun-coder/ioc.svg?branch=master)](https://travis-ci.org/fun-coder/ioc)

Create the context

```typescript
import { injected, Context } from '@fun-coder/ioc';

class ServiceA {
  name: string;
  hello() {
    console.log(123);
  }
}

class ServiceB {
  @injected()
  serviceA: ServiceA;
}

const context = Context.create(ServiceA, ServiceB);

const serviceA = context.get(ServiceA);
const serviceB = context.get(ServiceB);

serviceB.serviceA === serviceA   // true
```

Get the instance by parent class

```typescript
import { Context } from '@fun-coder/ioc';

abstract class BaseServiceA {
  abstract getName(): string;
}

class ServiceA extends BaseServiceA {
  getName(): string {
    return 'Hello';
  };
}

const context = Context.create(ServiceA);

const serviceA = context.get(BaseServiceA);

serviceA.constructor // ServiceA
```

Get class list by parent class 

```typescript
import { Context } from '@fun-coder/ioc';

abstract class BaseService {
  abstract getName(): string;
}

class ServiceA extends BaseService {
  getName(): string {
    return 'Hello, I come from A';
  };
}

class ServiceB extends BaseService {
  getName(): string {
    return 'Hello, I come from B';
  };
}

const context = Context.create(ServiceA, ServiceB);

context.getAll(BaseService); // [serviceA, serviceB]
```

