class MyPromise {
  /**
   * 自定义Promise构造函数
   * @param {Function} executor - 执行器函数（立即执行），参数为resolve和reject
   */
  constructor(executor) {
    this.state = "pending"; // Promise状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
    this.value = undefined; // 成功时保存的返回值
    this.reason = undefined; // 失败时保存的错误原因
    this.onResolvedCallbacks = []; // 保存成功回调的数组（处理异步情况）
    this.onRejectedCallbacks = []; // 保存失败回调的数组（处理异步情况）

    /**
     * 成功时的状态变更函数
     * @param {*} value - 成功时传递的值
     */
    const resolve = (value) => {
      if (this.state === "pending") {
        // 仅当状态为pending时可变更
        this.state = "fulfilled"; // 变更为成功状态
        this.value = value; // 保存成功值
        this.onResolvedCallbacks.forEach((fn) => fn()); // 执行所有成功回调
      }
    };

    /**
     * 失败时的状态变更函数
     * @param {*} reason - 失败时传递的错误原因
     */
    const reject = (reason) => {
      if (this.state === "pending") {
        // 仅当状态为pending时可变更
        this.state = "rejected"; // 变更为失败状态
        this.reason = reason; // 保存错误原因
        this.onRejectedCallbacks.forEach((fn) => fn()); // 执行所有失败回调
      }
    };

    try {
      executor(resolve, reject); // 立即执行执行器函数
    } catch (error) {
      reject(error); // 执行器内部出错时直接拒绝
    }
  }

  /**
   * 注册成功/失败回调
   * @param {Function} onFulfilled - 成功回调（可选）
   * @param {Function} onRejected - 失败回调（可选）
   * @returns {MyPromise} 新的Promise实例（实现链式调用）
   */
  then(onFulfilled, onRejected) {
    // 处理非函数参数：成功回调默认透传值，失败回调默认抛错误
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const newPromise = new MyPromise((resolve, reject) => {
      /** 处理成功回调的执行逻辑 */
      const handleFulfilled = () => {
        try {
          const x = onFulfilled(this.value); // 执行成功回调获取返回值
          resolvePromise(newPromise, x, resolve, reject); // 解析返回值以决定新Promise状态
        } catch (error) {
          reject(error); // 回调执行出错时拒绝新Promise
        }
      };

      /** 处理失败回调的执行逻辑 */
      const handleRejected = () => {
        try {
          const x = onRejected(this.reason); // 执行失败回调获取返回值
          resolvePromise(newPromise, x, resolve, reject); // 解析返回值以决定新Promise状态
        } catch (error) {
          reject(error); // 回调执行出错时拒绝新Promise
        }
      };

      // 根据当前状态立即执行或存储回调
      if (this.state === "fulfilled") {
        setTimeout(handleFulfilled, 0); // 异步执行保证微任务顺序（模拟原生Promise）
      } else if (this.state === "rejected") {
        setTimeout(handleRejected, 0); // 异步执行保证微任务顺序（模拟原生Promise）
      } else if (this.state === "pending") {
        // 状态未确定时存储回调（处理异步操作）
        this.onResolvedCallbacks.push(() => setTimeout(handleFulfilled, 0));
        this.onRejectedCallbacks.push(() => setTimeout(handleRejected, 0));
      }
    });

    return newPromise;
  }

  /**
   * 注册失败回调（语法糖）
   * @param {Function} onRejected - 失败回调
   * @returns {MyPromise} 新的Promise实例
   */
  catch(onRejected) {
    return this.then(null, onRejected); // 复用then方法，仅传递失败回调
  }

  /**
   * 静态方法：创建一个已解决的Promise
   * @param {*} value - 要解决的值（若为Promise则直接返回）
   * @returns {MyPromise} 已解决的Promise实例
   */
  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value); // 立即执行resolve
    });
  }

  /**
   * 静态方法：创建一个已拒绝的Promise
   * @param {*} reason - 拒绝的原因
   * @returns {MyPromise} 已拒绝的Promise实例
   */
  static reject(reason) {
    return new MyPromise((_, reject) => {
      reject(reason); // 立即执行reject
    });
  }
}

/**
 * 解析Promise回调的返回值，确保链式调用的正确性
 * @param {MyPromise} promise - 新的Promise实例（当前then返回的Promise）
 * @param {*} x - 回调函数的返回值
 * @param {Function} resolve - 新Promise的resolve函数
 * @param {Function} reject - 新Promise的reject函数
 */
function resolvePromise(promise, x, resolve, reject) {
  // 防止循环引用（如return this）
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  // 若x是MyPromise实例，递归解析其状态
  if (x instanceof MyPromise) {
    x.then((value) => resolvePromise(promise, value, resolve, reject), reject);
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 处理thenable对象（具有then方法的对象/函数）
    try {
      const then = x.then;
      if (typeof then === "function") {
        let called = false; // 防止多次调用resolve/reject
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x); // x是对象/函数但无then方法，直接resolve
      }
    } catch (error) {
      if (called) return;
      reject(error); // 获取then方法出错时拒绝
    }
  } else {
    resolve(x); // x是普通值，直接resolve
  }
}
const asyncPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("异步操作成功");
    } else {
      reject("异步操作失败");
    }
  }, 1000);
});

// 注册回调
asyncPromise
  .then((result) => console.log("成功:", result))
  .catch((error) => console.error("失败:", error));
