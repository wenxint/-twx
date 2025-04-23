# Class类

## 类的基础

### 问题：ES6中的类(Class)是什么？与ES5的构造函数相比有哪些区别和优势？

**类(Class)**是ES6引入的一种语法糖，用于更清晰、更面向对象的方式定义和创建对象，底层仍然基于JavaScript的原型继承机制。它让JS的面向对象编程变得更加简单和直观。

**类的基本用法：**

```javascript
// 基本类声明
class Person {
  // 构造方法
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  sayHello() {
    console.log(`你好，我是${this.name}，今年${this.age}岁。`);
  }

  // Getter方法
  get info() {
    return `${this.name}, ${this.age}岁`;
  }

  // Setter方法
  set info(value) {
    [this.name, this.age] = value.split(',');
    this.age = parseInt(this.age);
  }

  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }
}

// 使用类
const person = new Person('张三', 25);
person.sayHello(); // 你好，我是张三，今年25岁。
console.log(person.info); // 张三, 25岁
person.info = '李四,30';
console.log(person.name); // 李四
console.log(person.age); // 30

// 使用静态方法
const anotherPerson = Person.create('王五', 35);
console.log(anotherPerson.name); // 王五
```

**与ES5构造函数的对比：**

ES5构造函数实现：

```javascript
// ES5中的构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 原型方法
Person.prototype.sayHello = function() {
  console.log('你好，我是' + this.name + '，今年' + this.age + '岁。');
};

// 添加getter和setter
Object.defineProperty(Person.prototype, 'info', {
  get: function() {
    return this.name + ', ' + this.age + '岁';
  },
  set: function(value) {
    var parts = value.split(',');
    this.name = parts[0];
    this.age = parseInt(parts[1]);
  }
});

// 静态方法
Person.create = function(name, age) {
  return new Person(name, age);
};

// 使用构造函数
var person = new Person('张三', 25);
person.sayHello(); // 你好，我是张三，今年25岁。
```

**ES6类相比ES5构造函数的主要区别：**

1. **语法更简洁直观**：类提供了一种更简洁的语法来组织代码，使面向对象的编程风格更加明确。

2. **内部默认严格模式**：类的所有代码都自动运行在严格模式下，不需要手动添加`"use strict"`。

3. **不存在变量提升**：类声明不会被提升，必须先声明后使用，而函数声明会被提升。

   ```javascript
   // 错误 - 类在声明前无法访问
   const p = new Person(); // ReferenceError
   class Person {}

   // 正确 - 函数声明会被提升
   const p = new PersonFunc(); // 可以运行
   function PersonFunc() {}
   ```

4. **静态方法更加规范**：类通过`static`关键字直接定义静态方法，更加明确和统一。

5. **类方法不可枚举**：类定义的方法不可枚举，而构造函数的prototype属性上的方法可以枚举。

6. **必须使用new调用**：类必须使用`new`调用，否则会报错，而构造函数如果不使用`new`则this指向全局对象。

   ```javascript
   // 类必须使用new调用
   const person = Person('张三', 25); // TypeError: Class constructor Person cannot be invoked without 'new'

   // 构造函数可以不使用new（不推荐）
   const personFunc = PersonFunc('张三', 25); // 在非严格模式下，this指向全局对象
   ```

7. **更容易实现继承**：通过`extends`和`super`关键字，类继承的实现更加简单直观。

**类的特性和限制：**

1. **类本质上是函数**：

   ```javascript
   class Person {}
   console.log(typeof Person); // function
   ```

2. **实例属性必须在构造函数中定义**（ES2022前）：

   ```javascript
   class Person {
     constructor(name) {
       this.name = name; // 实例属性
     }
   }
   ```

3. **类方法不需要function关键字**：

   ```javascript
   class Person {
     sayHello() { // 无需function关键字
       console.log('Hello');
     }
   }
   ```

4. **类方法不可被当作构造函数使用**：

   ```javascript
   class Person {
     constructor() {}
     method() {}
   }

   const p = new Person();
   const m = new p.method(); // TypeError: p.method is not a constructor
   ```

## 类的继承与扩展

### 问题：如何使用ES6类实现继承和组合？有哪些高级特性？

**类的继承**：

```javascript
// 基类
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name}发出声音`);
  }
}

// 派生类
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name}汪汪叫`); // 覆盖父类方法
  }

  fetch() {
    console.log(`${this.name}捡回了球`); // 扩展新方法
  }
}

const dog = new Dog('旺财', '金毛');
dog.speak(); // 旺财汪汪叫
dog.fetch(); // 旺财捡回了球
console.log(dog.breed); // 金毛
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
```

**继承中的super关键字**：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name}发出声音`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 1. 调用父类构造函数
    this.breed = breed;
  }

  speak() {
    return `${super.speak()}，汪汪！`; // 2. 调用父类方法
  }
}

const dog = new Dog('旺财', '德牧');
console.log(dog.speak()); // 旺财发出声音，汪汪！
```

**使用super注意事项**：

1. **在构造函数中必须先调用super()**：

   ```javascript
   class Derived extends Base {
     constructor() {
       // 在访问this前必须调用super()
       // console.log(this.x); // ReferenceError
       super();
       console.log(this.x); // 现在可以访问
     }
   }
   ```

2. **super作为函数只能在派生类构造函数中使用**：

   ```javascript
   class Base {}
   class Derived extends Base {
     constructor() {
       super(); // 正确
     }
     method() {
       super(); // SyntaxError: 'super' keyword unexpected here
     }
   }
   ```

3. **super作为对象在非静态方法中指向父类原型，在静态方法中指向父类**：

   ```javascript
   class Parent {
     static staticMethod() {
       return 'static';
     }

     prototypeMethod() {
       return 'prototype';
     }
   }

   class Child extends Parent {
     static staticMethod() {
       return super.staticMethod() + ' - 子类静态方法';
     }

     prototypeMethod() {
       return super.prototypeMethod() + ' - 子类原型方法';
     }
   }

   console.log(Child.staticMethod()); // static - 子类静态方法
   console.log(new Child().prototypeMethod()); // prototype - 子类原型方法
   ```

**多层继承**：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(`${this.name}正在吃东西`);
  }
}

class Mammal extends Animal {
  constructor(name, furColor) {
    super(name);
    this.furColor = furColor;
  }

  giveBirth() {
    console.log(`${this.name}是哺乳动物，可以生育`);
  }
}

class Dog extends Mammal {
  constructor(name, furColor, breed) {
    super(name, furColor);
    this.breed = breed;
  }

  bark() {
    console.log(`${this.breed}${this.name}汪汪叫`);
  }
}

const dog = new Dog('小黑', '黑色', '拉布拉多');
dog.eat(); // 小黑正在吃东西
dog.giveBirth(); // 小黑是哺乳动物，可以生育
dog.bark(); // 拉布拉多小黑汪汪叫
console.log(dog.furColor); // 黑色
```

**使用extends扩展内建类**：

```javascript
// 扩展Array类
class MyArray extends Array {
  // 添加一个获取第一个元素的方法
  first() {
    return this[0];
  }

  // 添加一个获取最后一个元素的方法
  last() {
    return this[this.length - 1];
  }

  // 添加一个求和方法
  sum() {
    return this.reduce((acc, val) => acc + val, 0);
  }
}

const arr = new MyArray(1, 2, 3, 4, 5);
console.log(arr.first()); // 1
console.log(arr.last()); // 5
console.log(arr.sum()); // 15

// 继承的数组方法也可用
console.log(arr.map(x => x * 2)); // MyArray [2, 4, 6, 8, 10]
console.log(arr.filter(x => x % 2 === 0)); // MyArray [2, 4]
```

**Mixin模式（多重继承）**：

JavaScript不直接支持多重继承，但可以使用Mixin模式模拟：

```javascript
// 创建Mixin函数
const FlyableMixin = (Base) => class extends Base {
  fly() {
    console.log(`${this.name}正在飞行`);
  }

  land() {
    console.log(`${this.name}降落了`);
  }
};

const SwimmableMixin = (Base) => class extends Base {
  swim() {
    console.log(`${this.name}正在游泳`);
  }

  dive() {
    console.log(`${this.name}潜水了`);
  }
};

// 基类
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name}正在吃东西`);
  }
}

// 使用多个Mixin
class Duck extends SwimmableMixin(FlyableMixin(Animal)) {
  constructor(name) {
    super(name);
  }

  quack() {
    console.log(`${this.name}嘎嘎叫`);
  }
}

const duck = new Duck('唐老鸭');
duck.eat(); // 唐老鸭正在吃东西
duck.fly(); // 唐老鸭正在飞行
duck.swim(); // 唐老鸭正在游泳
duck.quack(); // 唐老鸭嘎嘎叫
```

**使用Symbol实现私有方法（ES6）**：

```javascript
// 使用Symbol定义"私有"方法
const _privateProp = Symbol('privateProp');
const _privateMethod = Symbol('privateMethod');

class MyClass {
  constructor() {
    this[_privateProp] = 'This is a private property';
  }

  [_privateMethod]() {
    return 'This is a private method';
  }

  publicMethod() {
    console.log(this[_privateProp]);
    console.log(this[_privateMethod]());
  }
}

const instance = new MyClass();
instance.publicMethod();
// This is a private property
// This is a private method

// 无法轻易访问Symbol属性（但不是真正私有）
console.log(Object.getOwnPropertySymbols(instance)); // [Symbol(privateProp)]
console.log(instance[Object.getOwnPropertySymbols(instance)[0]]); // This is a private property
```

## 类的高级特性与最佳实践

### 问题：类的私有字段、静态成员和装饰器等高级特性如何使用？有哪些最佳实践？

**私有字段和方法（ES2022）**：

使用`#`前缀定义真正的私有成员：

```javascript
class BankAccount {
  // 私有字段
  #balance = 0;
  #password;

  constructor(initialBalance, password) {
    this.#balance = initialBalance;
    this.#password = password;
  }

  // 私有方法
  #validatePassword(password) {
    return password === this.#password;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  withdraw(amount, password) {
    if (this.#validatePassword(password) && amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return amount;
    }
    return 0;
  }

  getBalance(password) {
    if (this.#validatePassword(password)) {
      return this.#balance;
    }
    return '无权限查看余额';
  }
}

const account = new BankAccount(1000, '1234');
account.deposit(500);
console.log(account.getBalance('1234')); // 1500
console.log(account.withdraw(200, '1234')); // 200
console.log(account.getBalance('wrong')); // 无权限查看余额

// 无法从外部访问私有成员
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
// account.#validatePassword('1234'); // SyntaxError: Private field '#validatePassword' must be declared in an enclosing class
```

**静态字段、方法和初始化块（ES2022）**：

```javascript
class MathUtils {
  // 静态公有字段
  static PI = 3.14159;

  // 静态私有字段
  static #count = 0;

  // 静态初始化块
  static {
    console.log('类初始化');
    this.#count = 10;
  }

  // 静态方法
  static square(x) {
    this.#incrementCount();
    return x * x;
  }

  static cube(x) {
    this.#incrementCount();
    return x * x * x;
  }

  // 静态私有方法
  static #incrementCount() {
    this.#count++;
  }

  // 访问静态私有字段的公共方法
  static getCount() {
    return this.#count;
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.square(4)); // 16
console.log(MathUtils.cube(3)); // 27
console.log(MathUtils.getCount()); // 12
```

**类字段（公有实例字段）（ES2022）**：

```javascript
class Product {
  // 类字段定义（无需在constructor中初始化）
  id = Math.random().toString(36).substr(2, 9);
  name = 'Default Product';
  price = 0;

  constructor(name, price) {
    if (name) this.name = name;
    if (price) this.price = price;
  }

  getInfo() {
    return `${this.name} (ID: ${this.id}): ¥${this.price}`;
  }
}

const p1 = new Product();
console.log(p1.getInfo()); // Default Product (ID: 随机ID): ¥0

const p2 = new Product('手机', 1999);
console.log(p2.getInfo()); // 手机 (ID: 随机ID): ¥1999
```

**使用getter和setter控制属性访问**：

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    if (value < -273.15) {
      throw new Error('温度不能低于绝对零度 (-273.15°C)');
    }
    this._celsius = value;
  }

  get fahrenheit() {
    return this._celsius * 9/5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) * 5/9;
  }

  get kelvin() {
    return this._celsius + 273.15;
  }

  set kelvin(value) {
    this.celsius = value - 273.15;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77
console.log(temp.kelvin); // 298.15

temp.fahrenheit = 68;
console.log(temp.celsius); // 20

try {
  temp.celsius = -300; // 错误：低于绝对零度
} catch (e) {
  console.error(e.message); // 温度不能低于绝对零度 (-273.15°C)
}
```

**类的组合与装饰模式**：

```javascript
// 基础组件
class Coffee {
  getCost() {
    return 15;
  }

  getDescription() {
    return '普通咖啡';
  }
}

// 装饰器类
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  getCost() {
    return this.coffee.getCost();
  }

  getDescription() {
    return this.coffee.getDescription();
  }
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 5;
  }

  getDescription() {
    return this.coffee.getDescription() + '，加牛奶';
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost() {
    return this.coffee.getCost() + 2;
  }

  getDescription() {
    return this.coffee.getDescription() + '，加糖';
  }
}

// 使用装饰器模式
let coffee = new Coffee();
console.log(coffee.getDescription()); // 普通咖啡
console.log(`¥${coffee.getCost()}`); // ¥15

coffee = new MilkDecorator(coffee);
console.log(coffee.getDescription()); // 普通咖啡，加牛奶
console.log(`¥${coffee.getCost()}`); // ¥20

coffee = new SugarDecorator(coffee);
console.log(coffee.getDescription()); // 普通咖啡，加牛奶，加糖
console.log(`¥${coffee.getCost()}`); // ¥22
```

**类的最佳实践：**

1. **封装数据，提供访问器**：

   ```javascript
   // 不好的做法：直接暴露所有属性
   class User {
     constructor(name, age) {
       this.name = name;
       this.age = age;
     }
   }

   // 更好的做法：使用私有字段和访问器
   class User {
     #name;
     #age;

     constructor(name, age) {
       this.#name = name;
       this.#age = age;
     }

     get name() {
       return this.#name;
     }

     set age(age) {
       if (age < 0 || age > 120) {
         throw new Error('年龄必须在0-120之间');
       }
       this.#age = age;
     }

     get age() {
       return this.#age;
     }
   }
   ```

2. **使用方法链**：

   ```javascript
   class StringBuilder {
     constructor(initialString = '') {
       this.string = initialString;
     }

     append(str) {
       this.string += str;
       return this; // 返回this实现链式调用
     }

     prepend(str) {
       this.string = str + this.string;
       return this;
     }

     removeStart(n) {
       this.string = this.string.substring(n);
       return this;
     }

     removeEnd(n) {
       this.string = this.string.substring(0, this.string.length - n);
       return this;
     }

     toString() {
       return this.string;
     }
   }

   const result = new StringBuilder('Hello')
     .append(' World')
     .append('!')
     .prepend('言：')
     .toString();

   console.log(result); // 言：Hello World!
   ```

3. **使用工厂方法**：

   ```javascript
   class User {
     constructor(type, details) {
       this.type = type;
       this.details = details;
     }

     // 工厂方法
     static createAdmin(details) {
       return new User('admin', { ...details, permissions: 'all' });
     }

     static createRegular(details) {
       return new User('regular', { ...details, permissions: 'read' });
     }

     static createGuest() {
       return new User('guest', { permissions: 'minimal' });
     }
   }

   const admin = User.createAdmin({ name: '管理员' });
   const user = User.createRegular({ name: '普通用户' });
   const guest = User.createGuest();

   console.log(admin.details.permissions); // all
   console.log(user.details.permissions); // read
   console.log(guest.details.permissions); // minimal
   ```

4. **避免过度使用继承**：

   ```javascript
   // 不推荐：深层继承链
   class Vehicle {}
   class LandVehicle extends Vehicle {}
   class Car extends LandVehicle {}
   class SportsCar extends Car {}
   class Ferrari extends SportsCar {}

   // 推荐：使用组合
   class Engine {
     start() { /* ... */ }
     stop() { /* ... */ }
   }

   class Transmission {
     shift() { /* ... */ }
   }

   class Car {
     constructor(engine, transmission) {
       this.engine = engine;
       this.transmission = transmission;
     }

     start() {
       this.engine.start();
     }

     shift() {
       this.transmission.shift();
     }
   }

   // 使用
   const myCar = new Car(new Engine(), new Transmission());
   ```

5. **使用类型检查**：

   ```javascript
   class Animal {}
   class Dog extends Animal {}

   function petAnimal(animal) {
     if (!(animal instanceof Animal)) {
       throw new TypeError('参数必须是Animal类型');
     }

     console.log('宠物被抚摸了');

     if (animal instanceof Dog) {
       console.log('狗狗摇尾巴');
     }
   }

   const dog = new Dog();
   petAnimal(dog); // 宠物被抚摸了 狗狗摇尾巴
   petAnimal({}); // TypeError: 参数必须是Animal类型
   ```

**实际经验分享：**

> **经验分享**：在我的开发经验中，ES6的类极大地提高了JavaScript代码的组织性和可维护性。从最初的ES5构造函数转向类语法使我们的代码库变得更加一致和易于理解。
>
> 一个关键经验是权衡继承和组合。曾经我们过度使用继承，导致了一个臃肿且难以维护的类层次结构。后来我们重构为更多使用组合模式，将功能分解为更小、更专注的类，然后通过组合而非继承来构建复杂对象。这使我们的代码更灵活，更易于测试。
>
> 在大型项目中，我们建立了这些类的最佳实践：
> 1. 使用私有字段保护内部状态
> 2. 为每个类创建单元测试
> 3. 类方法保持小而专注
> 4. 文档化公共API
> 5. 使用静态方法为常见操作提供工具函数
>
> 最后，不要忘记类只是语法糖。了解底层的原型机制仍然很重要，尤其是在调试复杂继承问题或优化性能时。类提供了更好的语法，但JavaScript的本质没有改变。