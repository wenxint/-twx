# 手写new

## 概念介绍

`new` 操作符用于创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。其核心作用是：创建一个新对象，将构造函数的`this`指向该对象，执行构造函数并绑定原型链，最后返回该对象（若构造函数无返回值）。

## 基本语法

原生`new`的使用：
```javascript
function Person(name) {
  this.name = name;
}
const person = new Person('Alice');
console.log(person.name); // 输出: Alice
```

## 核心特性

- 创建一个空对象，继承构造函数的原型。
- 将构造函数的`this`指向新对象，并执行构造函数。
- 若构造函数返回对象，则返回该对象；否则返回新创建的对象。

## 实战案例

手写`new`的实现：
```javascript
function myNew(constructor, ...args) {
  // 创建空对象并继承原型
  const obj = Object.create(constructor.prototype);
  // 执行构造函数并绑定this
  const result = constructor.apply(obj, args);
  // 返回结果（若构造函数返回对象则返回该对象，否则返回新对象）
  return typeof result === 'object' && result !== null ? result : obj;
}

// 使用示例
function Person(name) {
  this.name = name;
}
const person = myNew(Person, 'Bob');
console.log(person.name); // 输出: Bob
```

## 兼容性说明

`new` 是ES3引入的特性，所有现代浏览器及IE6+均支持，无需额外兼容处理。

## 面试常见问题

### 1. `new` 操作符的执行过程是怎样的？
**答案**：步骤包括：创建空对象、设置原型链、执行构造函数绑定`this`、处理返回值（若构造函数返回对象则返回该对象，否则返回新对象）。

### 2. 手写`new` 操作符需要注意哪些点？
**答案**：需要正确继承原型链（使用`Object.create`）、处理构造函数的返回值（区分对象和基本类型）、正确传递参数。

### 3. 如果构造函数返回`null`，`new` 会返回什么？
**答案**：返回新创建的对象，因为`null`是基本类型，不属于对象类型。