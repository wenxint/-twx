# let与const块级作用域

## let、const与var的区别

### 问题：let、const与var的区别是什么？什么是暂时性死区？

**let、const与var的主要区别：**

1. **块级作用域**
   - `var` 声明的变量只有函数作用域和全局作用域
   - `let` 和 `const` 声明的变量具有块级作用域（花括号`{}`内）

```javascript
{
  var varVariable = 'var变量';
  let letVariable = 'let变量';
}
console.log(varVariable); // 'var变量'
console.log(letVariable); // ReferenceError: letVariable is not defined
```

2. **变量提升**
   - `var` 声明的变量存在变量提升，可以在声明前使用（值为undefined）
   - `let` 和 `const` 不存在变量提升，在声明前使用会报错（暂时性死区）

```javascript
console.log(varVariable); // undefined
var varVariable = 'var变量';

console.log(letVariable); // ReferenceError: Cannot access 'letVariable' before initialization
let letVariable = 'let变量';
```

3. **重复声明**
   - 同一作用域内，`var` 可以重复声明同一个变量
   - 同一作用域内，`let` 和 `const` 不允许重复声明

```javascript
var a = 1;
var a = 2; // 正常工作

let b = 1;
let b = 2; // SyntaxError: Identifier 'b' has already been declared
```

4. **全局对象属性**
   - 全局作用域下，`var` 声明的变量会成为全局对象（浏览器中的window）的属性
   - 全局作用域下，`let` 和 `const` 声明的变量不会成为全局对象的属性

```javascript
var varGlobal = 'var全局变量';
let letGlobal = 'let全局变量';

console.log(window.varGlobal); // 'var全局变量'
console.log(window.letGlobal); // undefined
```

5. **const的特殊性**
   - `const` 必须在声明时初始化
   - `const` 声明的变量不能重新赋值，但如果值是对象，对象的属性可以修改

```javascript
const a; // SyntaxError: Missing initializer in const declaration

const b = 1;
b = 2; // TypeError: Assignment to constant variable

const obj = { name: 'Alice' };
obj.name = 'Bob'; // 可以修改对象属性
obj = {}; // TypeError: Assignment to constant variable
```

**暂时性死区（Temporal Dead Zone, TDZ）：**

暂时性死区是指从块级作用域的开始到变量声明之前的区域，在这个区域内，变量虽然已经存在，但不能被访问，会抛出ReferenceError错误。

```javascript
{
  // 从这里开始是 name 的暂时性死区
  console.log(name); // ReferenceError: Cannot access 'name' before initialization

  let name = 'Alice'; // 暂时性死区结束
  console.log(name); // 'Alice'
}
```

暂时性死区的出现是因为JavaScript引擎在编译阶段会检测到块中的所有变量声明，但`let`和`const`声明的变量在声明语句之前不能被访问。

## 块级作用域应用

### 问题：块级作用域有哪些实际应用场景？请举例说明。

**块级作用域的实际应用场景：**

1. **循环中的计数器变量**

使用`let`声明循环变量可以避免变量泄露到循环外部：

```javascript
// 使用var
for (var i = 0; i < 3; i++) {
  // 循环体
}
console.log(i); // 3 (i泄露到外部作用域)

// 使用let
for (let j = 0; j < 3; j++) {
  // 循环体
}
console.log(j); // ReferenceError: j is not defined (j被限制在循环作用域内)
```

2. **解决循环闭包问题**

使用`let`可以为每次循环创建新的变量绑定，解决经典的循环闭包问题：

```javascript
// 使用var - 问题
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 输出三次3
  }, 1000);
}

// 使用let - 解决方案
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 输出0、1、2
  }, 1000);
}
```

3. **临时作用域**

创建临时的块级作用域，避免变量污染外部命名空间：

```javascript
// 不使用块级作用域
let temp = calculateTemp();
processTemp(temp);
// temp变量在后续代码中仍然可用，可能造成命名冲突

// 使用块级作用域
{
  let temp = calculateTemp();
  processTemp(temp);
}
// temp仅在块内有效，块外无法访问
```

4. **防止变量重定义**

在同一个函数内，不同的代码块可以使用相同名称的局部变量：

```javascript
function process() {
  {
    let value = 'first value';
    console.log(value);
  }

  {
    let value = 'second value'; // 在新的块级作用域中可以重新定义同名变量
    console.log(value);
  }
}
```

5. **switch语句中的变量定义**

在`switch`的不同`case`分支中定义同名变量：

```javascript
switch (type) {
  case 'A':
    let value = getValueA();
    break;
  case 'B':
    let value = getValueB(); // 使用var会报错，使用let是安全的
    break;
}
```

6. **模块模式的替代**

ES6之前，常用立即执行函数表达式(IIFE)创建作用域，现在可以直接用块级作用域替代：

```javascript
// ES5 IIFE
(function() {
  var private = 'private data';
  // 其他代码
})();

// ES6 块级作用域
{
  let private = 'private data';
  // 其他代码
}
```

7. **常量定义**

使用`const`定义常量，增强代码可读性并防止意外修改：

```javascript
const API_URL = 'https://api.example.com';
const MAX_ITEMS = 100;

// 对象常量通常用于配置
const CONFIG = {
  theme: 'dark',
  timeout: 3000,
  retries: 3
};
```

8. **保护外部变量**

在处理函数内部使用与外部同名变量时，可以避免意外修改外部变量：

```javascript
let data = fetchData();

function processData() {
  // 处理外部变量
  data = transformData(data);

  // 使用块级作用域保护外部变量
  {
    let data = localData();
    // 这里的操作不会影响外部的data变量
  }

  // 继续处理外部data
}
```

## const与不可变性

### 问题：const声明的对象为什么可以修改属性？如何实现真正的不可变对象？

**const和对象可变性：**

`const`关键字保证的是变量的引用（指向）不变，而非变量内容不变。当使用`const`声明一个对象时，不能重新为其赋值（引用不变），但可以修改对象的属性（内容可变）：

```javascript
const person = { name: 'Alice' };

person.name = 'Bob'; // 可以修改属性
person.age = 30; // 可以添加属性
delete person.name; // 可以删除属性

person = { name: 'Charlie' }; // TypeError: Assignment to constant variable
```

**实现真正的不可变对象的方法：**

1. **Object.freeze()**

   浅冻结对象，防止添加、删除或修改对象的直接属性：

```javascript
const person = Object.freeze({ name: 'Alice' });

person.name = 'Bob'; // 在严格模式下抛出错误，非严格模式下静默失败
person.age = 30; // 同上
console.log(person); // { name: 'Alice' } (没有变化)

// 但Object.freeze()是浅冻结，嵌套对象的属性仍然可以修改
const nested = Object.freeze({
  name: 'Alice',
  address: { city: 'New York' }
});

nested.address.city = 'Boston'; // 成功修改
console.log(nested.address.city); // 'Boston'
```

2. **深度冻结**

   递归应用Object.freeze()，实现深度冻结：

```javascript
function deepFreeze(obj) {
  // 获取对象的属性名
  const propNames = Object.getOwnPropertyNames(obj);

  // 在冻结当前对象之前递归冻结属性
  for (const name of propNames) {
    const value = obj[name];

    // 如果值是对象且不是null，递归冻结
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  // 冻结自身
  return Object.freeze(obj);
}

const deepFrozen = deepFreeze({
  name: 'Alice',
  address: { city: 'New York' }
});

deepFrozen.address.city = 'Boston'; // 严格模式下抛出错误
console.log(deepFrozen.address.city); // 'New York'
```

3. **使用不可变数据库**

   如Immutable.js, immer等库提供的数据结构：

```javascript
// 使用Immutable.js
const { Map } = require('immutable');
const immutablePerson = Map({ name: 'Alice' });

// 不会修改原数据，而是返回新的数据结构
const updatedPerson = immutablePerson.set('name', 'Bob');

console.log(immutablePerson.get('name')); // 'Alice'
console.log(updatedPerson.get('name')); // 'Bob'
```

```javascript
// 使用immer
const produce = require('immer').produce;
const person = { name: 'Alice' };

const updated = produce(person, draft => {
  draft.name = 'Bob'; // 看起来是直接修改，但实际上是创建新对象
});

console.log(person.name); // 'Alice'
console.log(updated.name); // 'Bob'
```

4. **Object.defineProperty()配合**

   使用Object.defineProperty()将属性设为不可修改：

```javascript
const person = {};

Object.defineProperty(person, 'name', {
  value: 'Alice',
  writable: false,      // 不可修改
  enumerable: true,     // 可枚举
  configurable: false   // 不可重新配置或删除
});

person.name = 'Bob'; // 严格模式下抛出错误
console.log(person.name); // 'Alice'
```

5. **使用getter，不提供setter**

   只提供getter方法读取属性，不提供setter方法修改属性：

```javascript
const createImmutable = (initialData) => {
  const data = { ...initialData };

  return Object.keys(data).reduce((obj, key) => {
    Object.defineProperty(obj, key, {
      get: () => data[key],
      enumerable: true
    });
    return obj;
  }, {});
};

const person = createImmutable({ name: 'Alice' });
person.name = 'Bob'; // 无效操作，不会报错
console.log(person.name); // 'Alice'
```

**对象不可变性的应用场景：**

1. **状态管理**：如Redux、React中的状态更新，防止状态被意外修改
2. **配置对象**：确保配置不被修改，特别是在多个模块共享配置时
3. **缓存**：确保缓存数据不被修改
4. **API返回数据**：确保从API获取的数据不被意外修改
5. **并发编程**：减少在并发环境中数据突变带来的问题

> **经验分享**：在实际开发中，深度冻结对象可能会带来性能问题，尤其是对于大型对象。我通常采用不可变数据库（如Immer）来处理需要不可变性的场景，它既提供了不可变性保证，又有较好的性能表现。
>
> 对于配置对象等简单场景，Object.freeze()已经足够；而对于复杂的状态管理，考虑使用专门的库或遵循不可变数据的编程模式。
>
> 记住，JavaScript中的不可变性总是通过约定或工具实现的，而非语言本身强制的特性。在团队开发中，建立良好的不可变性实践比单纯依赖技术手段更重要。