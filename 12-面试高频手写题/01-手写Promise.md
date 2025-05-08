# 手写Promise

## 概念介绍

Promise 是 JavaScript 中用于处理异步操作的对象，它代表了一个尚未完成但最终会完成的操作，并且可以获取其结果。Promise 有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。一旦状态改变，就不会再变，状态只能从 pending 变为 fulfilled 或者从 pending 变为 rejected。

## 基本语法

原生 Promise 的基本使用如下：
```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject('操作失败');
    }
  }, 1000);
});

promise.then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
```

## 核心特性

### 链式调用
Promise 可以通过 `.then()` 方法进行链式调用，每个 `.then()` 方法都会返回一个新的 Promise 对象，从而实现异步操作的顺序执行。

### 错误处理
可以使用 `.catch()` 方法捕获 Promise 链中的错误，也可以在 `.then()` 方法的第二个参数中处理错误。

## 实战案例

以下是一个手写 Promise 的实现：
```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason; };

    const newPromise = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        try {
          const x = onFulfilled(this.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = () => {
        try {
          const x = onRejected(this.reason);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'fulfilled') {
        setTimeout(handleFulfilled, 0);
      } else if (this.state === 'rejected') {
        setTimeout(handleRejected, 0);
      } else if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => setTimeout(handleFulfilled, 0));
        this.onRejectedCallbacks.push(() => setTimeout(handleRejected, 0));
      }
    });

    return newPromise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((_, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  if (x instanceof MyPromise) {
    x.then((value) => resolvePromise(promise, value, resolve, reject), reject);
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;
      if (typeof then === 'function') {
        let called = false;
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
```

## 兼容性说明

Promise 是 ES6 引入的特性，现代浏览器基本都支持，但在一些旧版本的浏览器（如 IE）中不支持。可以使用 Babel 等工具进行转译，或者引入第三方库（如 bluebird）来提供兼容支持。

## 面试常见问题

### 1. 什么是 Promise 的状态机？
**答案**：Promise 有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。状态只能从 pending 变为 fulfilled 或者从 pending 变为 rejected，一旦状态改变，就不会再变。

### 2. 如何实现 Promise 的链式调用？
**答案**：每个 `.then()` 方法都会返回一个新的 Promise 对象，通过这种方式可以实现链式调用。在 `.then()` 方法中，根据前一个 Promise 的状态执行相应的回调函数，并将结果传递给下一个 Promise。

### 3. 如何处理 Promise 链中的错误？
**答案**：可以使用 `.catch()` 方法捕获 Promise 链中的错误，也可以在 `.then()` 方法的第二个参数中处理错误。错误会沿着 Promise 链向后传递，直到遇到第一个 `.catch()` 方法。