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
```
