# Proxy与Reflect

Proxy（代理）和Reflect（反射）是ES6引入的两个强大特性，用于拦截和定制JavaScript对象的基本操作，提供了元编程（metaprogramming）的能力，使开发者能够自定义对象的行为。

## Proxy基础

### 概念

Proxy对象用于创建一个对象的代理，从而可以拦截和自定义对象的基本操作，如属性查找、赋值、枚举、函数调用等。Proxy充当了目标对象的"中间人"角色，允许你在访问对象之前进行拦截和处理。

### 基本语法

```javascript
const proxy = new Proxy(target, handler);
```

- `target`: 要代理的目标对象
- `handler`: 定义拦截行为的对象，包含各种可选的陷阱（trap）函数

### 常用陷阱（Traps）

Proxy可以拦截多种操作，每种操作对应一个陷阱函数：

#### get陷阱

拦截对象属性的读取操作：

```javascript
const person = {
  name: '张三',
  age: 30
};

const proxy = new Proxy(person, {
  get(target, property, receiver) {
    console.log(`正在获取${property}属性`);
    // target: 目标对象
    // property: 被获取的属性名
    // receiver: 代理对象或继承代理对象的对象

    // 自定义行为
    if (property === 'fullInfo') {
      return `${target.name}, ${target.age}岁`;
    }

    return target[property];
  }
});

console.log(proxy.name); // 正在获取name属性 张三
console.log(proxy.fullInfo); // 正在获取fullInfo属性 张三, 30岁
```

#### set陷阱

拦截对象属性的设置操作：

```javascript
const person = {
  name: '张三',
  age: 30
};

const proxy = new Proxy(person, {
  set(target, property, value, receiver) {
    console.log(`正在设置${property}属性为${value}`);

    // 数据验证
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('年龄必须是整数');
      }
      if (value < 0 || value > 150) {
        throw new RangeError('年龄必须在0-150之间');
      }
    }

    // 设置属性值
    target[property] = value;
    return true; // 表示设置成功
  }
});

proxy.name = '李四'; // 正在设置name属性为李四
proxy.age = 25; // 正在设置age属性为25
// proxy.age = -5; // 抛出RangeError: 年龄必须在0-150之间
// proxy.age = 'thirty'; // 抛出TypeError: 年龄必须是整数
```

#### has陷阱

拦截`in`操作符：

```javascript
const person = {
  name: '张三',
  age: 30,
  _password: '123456' // 假设这是私有属性
};

const proxy = new Proxy(person, {
  has(target, property) {
    console.log(`正在检查${property}是否存在`);

    // 隐藏以_开头的私有属性
    if (property.startsWith('_')) {
      return false;
    }

    return property in target;
  }
});

console.log('name' in proxy); // 正在检查name是否存在 true
console.log('_password' in proxy); // 正在检查_password是否存在 false
```

#### deleteProperty陷阱

拦截删除操作：

```javascript
const person = {
  name: '张三',
  age: 30,
  _password: '123456'
};

const proxy = new Proxy(person, {
  deleteProperty(target, property) {
    console.log(`正在删除${property}属性`);

    // 阻止删除以_开头的私有属性
    if (property.startsWith('_')) {
      return false;
    }

    delete target[property];
    return true;
  }
});

delete proxy.age; // 正在删除age属性
console.log(proxy.age); // undefined

delete proxy._password; // 正在删除_password属性
console.log(proxy._password); // 123456 (未被删除)
```

#### apply陷阱

拦截函数的调用：

```javascript
function sum(a, b) {
  return a + b;
}

const proxy = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {
    console.log(`调用函数，参数：${argumentsList}`);

    // 参数验证
    if (argumentsList.some(arg => typeof arg !== 'number')) {
      throw new TypeError('所有参数必须是数字');
    }

    // 增强功能
    const result = target.apply(thisArg, argumentsList);
    return result * 2; // 返回计算结果的两倍
  }
});

console.log(proxy(1, 2)); // 调用函数，参数：1,2 6
// proxy(1, '2'); // 抛出TypeError: 所有参数必须是数字
```

#### construct陷阱

拦截`new`操作符：

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const PersonProxy = new Proxy(Person, {
  construct(target, args, newTarget) {
    console.log(`使用new操作符，参数：${args}`);

    // 参数验证
    if (args.length < 2) {
      throw new Error('必须提供name和age参数');
    }

    // 可以修改或增强构造过程
    const instance = Reflect.construct(target, args, newTarget);
    instance.createdAt = new Date();
    return instance;
  }
});

const person = new PersonProxy('张三', 30);
console.log(person.name); // 张三
console.log(person.createdAt); // 创建时间

// const invalidPerson = new PersonProxy('李四'); // 抛出Error: 必须提供name和age参数
```

### 其他常用陷阱

- `getPrototypeOf`: 拦截`Object.getPrototypeOf`
- `setPrototypeOf`: 拦截`Object.setPrototypeOf`
- `isExtensible`: 拦截`Object.isExtensible`
- `preventExtensions`: 拦截`Object.preventExtensions`
- `getOwnPropertyDescriptor`: 拦截`Object.getOwnPropertyDescriptor`
- `defineProperty`: 拦截`Object.defineProperty`
- `ownKeys`: 拦截`Object.getOwnPropertyNames`和`Object.getOwnPropertySymbols`

## Reflect基础

### 概念

Reflect是一个内置的对象，提供了用于拦截JavaScript操作的方法，这些方法与Proxy的处理程序方法相同。Reflect的所有方法都是静态的，不能通过new操作符调用，而是直接在Reflect对象上调用。

Reflect API被设计成与Proxy API对应，使Proxy更易于使用和实现。

### 基本方法

Reflect对象提供了与Proxy处理程序一一对应的静态方法：

```javascript
// 获取属性
Reflect.get(target, propertyKey[, receiver])

// 设置属性
Reflect.set(target, propertyKey, value[, receiver])

// 判断属性是否存在
Reflect.has(target, propertyKey)

// 删除属性
Reflect.deleteProperty(target, propertyKey)

// 调用函数
Reflect.apply(target, thisArgument, argumentsList)

// 构造实例
Reflect.construct(target, argumentsList[, newTarget])

// 其他方法...
```

### Reflect的使用示例

```javascript
const obj = {
  name: '张三',
  age: 30
};

// 获取属性
console.log(Reflect.get(obj, 'name')); // 张三

// 设置属性
Reflect.set(obj, 'gender', '男');
console.log(obj.gender); // 男

// 检查属性是否存在
console.log(Reflect.has(obj, 'age')); // true

// 删除属性
Reflect.deleteProperty(obj, 'gender');
console.log(obj.gender); // undefined

// 获取所有属性
console.log(Reflect.ownKeys(obj)); // ['name', 'age']

// 阻止对象扩展
Reflect.preventExtensions(obj);
console.log(Reflect.isExtensible(obj)); // false

// 通过反射调用函数
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
console.log(Reflect.apply(greet, obj, ['你好'])); // 你好, 张三
```

### Reflect与传统方法对比

Reflect提供了更加函数式的API，相比传统方法有以下优势：

```javascript
// 传统方法
'name' in obj
delete obj.name
Object.defineProperty(obj, 'name', { value: '张三' })

// Reflect方法
Reflect.has(obj, 'name')
Reflect.deleteProperty(obj, 'name')
Reflect.defineProperty(obj, 'name', { value: '张三' })
```

Reflect方法的主要优势：
1. 返回值更加合理（如`Reflect.defineProperty`返回布尔值而不是对象）
2. 操作更加函数化，便于函数式编程
3. 与Proxy API保持一致，便于组合使用

## Proxy与Reflect的结合使用

Proxy和Reflect通常结合使用，特别是在创建"透明代理"时：

```javascript
const target = {
  name: '张三',
  age: 30
};

const handler = {
  get(target, property, receiver) {
    console.log(`获取${property}属性`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`设置${property}属性为${value}`);
    return Reflect.set(target, property, value, receiver);
  }
};

const proxy = new Proxy(target, handler);

proxy.name = '李四'; // 设置name属性为李四
console.log(proxy.name); // 获取name属性 李四
```

使用Reflect的好处：
1. 保持原始行为的同时添加新功能
2. 正确传递`this`值（`receiver`参数）
3. 处理原型链上的属性

## 实际应用场景

### 数据验证和格式化

```javascript
function createValidator(target, validations) {
  return new Proxy(target, {
    set(target, property, value, receiver) {
      if (validations.hasOwnProperty(property)) {
        const validator = validations[property];
        if (!validator.validate(value)) {
          throw new Error(validator.message || `Invalid value for ${property}`);
        }
        // 可选: 格式化数据
        if (validator.format) {
          value = validator.format(value);
        }
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}

const user = createValidator(
  { name: '', age: 0, email: '' },
  {
    name: {
      validate: value => typeof value === 'string' && value.length > 0,
      message: 'Name must be a non-empty string'
    },
    age: {
      validate: value => Number.isInteger(value) && value >= 18 && value <= 120,
      message: 'Age must be an integer between 18 and 120',
      format: value => Number(value) // 确保是数字
    },
    email: {
      validate: value => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value),
      message: 'Invalid email format'
    }
  }
);

user.name = '张三'; // 有效
user.age = 30; // 有效
// user.age = 10; // 错误: Age must be an integer between 18 and 120
// user.email = 'invalid-email'; // 错误: Invalid email format
user.email = 'zhangsan@example.com'; // 有效
```

### 访问控制和私有属性

```javascript
function createPrivateProperties(target, privateProps) {
  const privateValues = new Map();

  // 初始化私有属性
  privateProps.forEach(prop => {
    const key = Symbol(prop);
    privateValues.set(prop, { key, value: undefined });

    // 添加getter和setter
    Object.defineProperty(target, prop, {
      get() {
        return privateValues.get(prop).value;
      },
      set(value) {
        privateValues.get(prop).value = value;
      },
      enumerable: true
    });
  });

  return new Proxy(target, {
    get(target, property, receiver) {
      // 保护私有属性的直接访问
      if (privateProps.includes(String(property)) && property in privateValues) {
        return undefined;
      }
      return Reflect.get(target, property, receiver);
    },
    ownKeys(target) {
      // 不显示私有属性
      return Reflect.ownKeys(target).filter(key => !privateProps.includes(String(key)));
    },
    getOwnPropertyDescriptor(target, prop) {
      if (privateProps.includes(String(prop))) {
        return undefined;
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    }
  });
}

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password; // 这将是私有的
  }

  authenticate(pwd) {
    return pwd === this.password;
  }
}

const user = createPrivateProperties(new User('张三', 'zhangsan@example.com', '123456'), ['password']);

console.log(user.name); // 张三
console.log(user.email); // zhangsan@example.com
console.log(user.password); // undefined (外部无法直接访问)
console.log(user.authenticate('123456')); // true (但可以通过方法使用)
console.log(Object.keys(user)); // ['name', 'email'] (不包括password)
```

### 响应式数据系统

```javascript
function createObservable(target) {
  const handlers = new Map();

  function notify(property, value) {
    if (handlers.has(property)) {
      handlers.get(property).forEach(handler => handler(value));
    }
  }

  const observable = new Proxy(target, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      const success = Reflect.set(target, property, value, receiver);
      if (success) {
        notify(property, value);
      }
      return success;
    }
  });

  // 添加观察者API
  observable.observe = function(property, handler) {
    if (!handlers.has(property)) {
      handlers.set(property, new Set());
    }
    handlers.get(property).add(handler);

    return () => {
      handlers.get(property).delete(handler);
    };
  };

  return observable;
}

const user = createObservable({
  name: '张三',
  age: 30
});

// 观察name属性变化
const unsubscribe = user.observe('name', newValue => {
  console.log(`名字已更新为: ${newValue}`);
});

user.name = '李四'; // 输出: 名字已更新为: 李四

// 取消观察
unsubscribe();
user.name = '王五'; // 不会触发回调
```

### 元编程和方法拦截

```javascript
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const url = `${this.baseURL}/${endpoint}`;
    const response = await fetch(url);
    return await response.json();
  }

  async post(endpoint, data) {
    const url = `${this.baseURL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

// 创建增强的API代理
function createAPIProxy(api) {
  return new Proxy(api, {
    get(target, property, receiver) {
      // 已有的方法按原样返回
      if (property in target) {
        return Reflect.get(target, property, receiver);
      }

      // 动态创建端点方法
      return async function(...args) {
        // 将驼峰命名转换为路径
        // 例如: getUserById -> users/:id
        const endpoint = property
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, '')
          .replace(/get-/, '')
          .replace(/post-/, '')
          .replace(/put-/, '')
          .replace(/delete-/, '');

        // 根据方法名确定HTTP方法
        let method = 'get';
        if (property.startsWith('post')) method = 'post';
        if (property.startsWith('put')) method = 'put';
        if (property.startsWith('delete')) method = 'delete';

        // 调用相应的API方法
        if (method === 'get' || method === 'delete') {
          return target[method](endpoint);
        } else {
          return target[method](endpoint, args[0]);
        }
      };
    }
  });
}

const api = createAPIProxy(new API('https://api.example.com'));

// 现在可以动态调用不存在的方法
api.getUsers().then(users => console.log(users));
api.getUserProfile().then(profile => console.log(profile));
api.postUserData({ name: '张三' }).then(response => console.log(response));
```

### 缓存代理

```javascript
function createCacheProxy(target, ttl = 60000) {
  const cache = new Map();

  return new Proxy(target, {
    apply(target, thisArg, args) {
      // 创建缓存键
      const cacheKey = JSON.stringify({
        fn: target.name,
        args
      });

      const now = Date.now();

      // 检查缓存是否有效
      if (cache.has(cacheKey)) {
        const { value, timestamp } = cache.get(cacheKey);
        if (now - timestamp < ttl) {
          console.log('从缓存中获取结果');
          return value;
        }
      }

      // 调用原始函数
      const result = Reflect.apply(target, thisArg, args);

      // 缓存结果
      cache.set(cacheKey, {
        value: result,
        timestamp: now
      });

      return result;
    }
  });
}

// 昂贵的计算函数
function expensiveOperation(a, b) {
  console.log('执行昂贵的操作');
  return a + b;
}

const cachedOperation = createCacheProxy(expensiveOperation);

console.log(cachedOperation(1, 2)); // 执行昂贵的操作 3
console.log(cachedOperation(1, 2)); // 从缓存中获取结果 3
```

## 限制与注意事项

### 性能考虑

Proxy提供了强大的功能，但也带来了性能开销。在性能敏感的代码中应谨慎使用，特别是在频繁访问的对象上。

```javascript
// 性能基准测试
function benchmarkProxy() {
  const iterations = 1000000;

  const target = { value: 42 };
  const proxy = new Proxy(target, {
    get(target, property) {
      return target[property];
    }
  });

  console.time('Direct access');
  for (let i = 0; i < iterations; i++) {
    const value = target.value;
  }
  console.timeEnd('Direct access');

  console.time('Proxy access');
  for (let i = 0; i < iterations; i++) {
    const value = proxy.value;
  }
  console.timeEnd('Proxy access');
}

// 运行基准测试
benchmarkProxy();
```

### 无法代理的操作

某些操作无法被Proxy拦截，如：

- 严格相等运算符 (`===`)
- `typeof` 和 `instanceof` 操作符
- 内部插槽访问（如`Map`的内部插槽）

```javascript
const target = {};
const proxy = new Proxy(target, {});

console.log(target === proxy); // false

// Map的内部插槽问题
const map = new Map();
const proxyMap = new Proxy(map, {});

// 以下会抛出错误
// proxyMap.set('key', 'value');
```

### 不变量强制执行

对象的某些属性具有不变量，Proxy必须保持这些不变量，否则会抛出TypeError。

```javascript
const obj = {};
Object.defineProperty(obj, 'name', {
  configurable: false,
  value: '张三'
});

// 尝试返回不同的值
const proxy = new Proxy(obj, {
  get(target, prop) {
    if (prop === 'name') {
      return '李四'; // 违反不变量
    }
    return target[prop];
  }
});

// 抛出TypeError
// console.log(proxy.name);
```

## 浏览器兼容性

Proxy和Reflect在所有现代浏览器中都得到了良好支持，但不支持IE11及以下版本。Proxy没有完全可行的polyfill，因为某些陷阱功能无法在ES5中模拟。

## 面试常见问题

1. **什么是Proxy，它有什么用途？**
   - Proxy是ES6引入的用于拦截对象操作的功能
   - 主要用途包括：数据验证、格式化、访问控制、日志记录、性能优化、元编程等

2. **Proxy与Object.defineProperty的区别是什么？**
   - Proxy可以拦截更多的操作（如`in`、`delete`等）
   - Proxy可以拦截整个对象而不仅是某个属性
   - Proxy是惰性的，仅当操作发生时才触发拦截器
   - Proxy可以拦截数组操作，更适合实现响应式系统
   - Proxy不可被polyfill，不支持IE

3. **Reflect对象的主要用途是什么？**
   - 提供与Proxy处理程序一一对应的方法
   - 将对象操作变为函数形式（函数式编程）
   - 提供更可靠的函数返回值（如`Reflect.deleteProperty`返回布尔值）
   - 与Proxy结合使用更加方便

4. **如何使用Proxy实现数据验证？**
   ```javascript
   const validator = {
     set(target, property, value) {
       if (property === 'age') {
         if (!Number.isInteger(value)) {
           throw new TypeError('Age must be an integer');
         }
         if (value < 0 || value > 130) {
           throw new RangeError('Age must be between 0 and 130');
         }
       }
       target[property] = value;
       return true;
     }
   };

   const person = new Proxy({}, validator);
   person.age = 30; // 成功
   // person.age = -5; // RangeError
   ```

5. **Proxy可以实现Vue的响应式系统吗？**
   - 是的，Vue 3使用Proxy重写了响应式系统
   - Proxy相比Vue 2使用的Object.defineProperty有更好的性能和功能
   - Proxy可以检测到属性的添加和删除，以及数组索引和长度的变化
```
</rewritten_file>