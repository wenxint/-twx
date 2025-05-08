# 手写instanceof

## 概念介绍

`instanceof` 是JavaScript中的一个运算符，用于检测构造函数的`prototype`属性是否出现在某个对象的原型链上，从而判断该对象是否为该构造函数的实例。

## 基本语法

原生`instanceof`的使用：
```javascript
function Person() {}
const person = new Person();
console.log(person instanceof Person); // 输出: true
console.log(person instanceof Object); // 输出: true
```

## 核心特性

- 检查对象的原型链是否包含构造函数的`prototype`。
- 可用于判断对象类型（需注意基本类型的包装对象）。

## 实战案例

手写`instanceof`的实现：
```javascript
function myInstanceof(obj, constructor) {
  // 基本类型直接返回false
  if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
    return false;
  }
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// 使用示例
function Animal() {}
const cat = new Animal();
console.log(myInstanceof(cat, Animal)); // 输出: true
console.log(myInstanceof(cat, Object)); // 输出: true
console.log(myInstanceof(123, Number)); // 输出: false（基本类型直接返回false）
```

## 兼容性说明

`instanceof` 是ES3引入的特性，所有现代浏览器及IE6+均支持，无需额外兼容处理。

## 面试常见问题

### 1. `instanceof` 的判断原理是什么？
**答案**：通过遍历对象的原型链，检查构造函数的`prototype`是否存在于原型链中。

### 2. 手写`instanceof` 需要注意哪些情况？
**答案**：需要处理基本类型（直接返回false）、`null`和`undefined`（返回false），以及正确获取原型链（使用`Object.getPrototypeOf`）。

### 3. `obj instanceof Object` 一定为true吗？
**答案**：不一定。如果`obj`是`null`或基本类型（如`123`、`'str'`），则返回false；否则，对象的原型链最终会指向`Object.prototype`，返回true。