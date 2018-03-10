IOC Container  
---

[![Build Status](https://travis-ci.org/fun-coder/ioc.svg?branch=master)](https://travis-ci.org/fun-coder/ioc)

Define classes
```typescript
import { Context, injected } from '@fun-coder/ioc';

abstract class BaseService {
  abstract getName(): string;
}

class ServiceA extends BaseService {
  getName(): string {
    return 'Hello, I come from A';
  };
}

class ServiceB extends BaseService {
 
  @injected()
  serviceA: ServiceA;
  
  getName(): string {
    return 'Hello, I come from B';
  };
}
```

Create context
```typescript
const context = Context.create(ServiceA, ServiceB);
```

Get instance from context

```typescript
const serviceA = context.get(ServiceA);
serviceA.getName(); // Hello, I come from A;

const serviceB = context.get(ServiceB);
serviceB.getName(); // Hello, I come from B;

console.log(serviceB.serviceA === serviceA); // => true
```

Get instances by parent class
```typescript
context.getAll(BaseService); // [serviceA, serviceB]
```

