/**
 * 设计思路：
 * 1. LazyMan本质是一个任务队列调度器，所有操作（如问候、sleep、eat等）都被封装为任务函数，按顺序依次执行。
 * 2. 每次调用sleep、eat等方法时，都是往队列中添加一个任务（函数）。sleepFirst则是插入到队列最前面。
 * 3. 构造时，问候语任务最先加入队列，并用setTimeout保证所有链式方法注册完毕后再开始执行。
 * 4. 每个任务执行完毕后，自动调用next方法执行下一个任务，实现链式异步调度。
 * 5. 通过类封装，保证每个LazyMan实例互不影响，支持多次链式调用。
 */

/**
 * @description 实现LazyMan，支持sleep、sleepFirst、eat链式调用
 * @param {string} name - 名字
 * @returns {Object} 支持链式调用的LazyMan实例
 */
function LazyMan(name) {
  // 实际返回一个类实例，隐藏实现细节
  return new _LazyManClass(name);
}

/**
 * @class _LazyManClass
 * @description LazyMan调度器，内部维护任务队列
 */
class _LazyManClass {
  /**
   * 构造函数，初始化任务队列并加入问候任务
   * @param {string} name
   */
  constructor(name) {
    this.tasks = [];
    // 问候语任务，始终第一个执行
    this.tasks.push(() => {
      console.log(`Hi! This is ${name}!`);
      this._next(); // 执行下一个任务
    });
    // 用setTimeout确保链式方法注册完毕后再开始执行任务队列
    setTimeout(() => this._next(), 0);
  }

  /**
   * @private
   * 执行下一个任务
   */
  _next() {
    const task = this.tasks.shift();
    if (task) task();
  }

  /**
   * @description 延迟指定秒数后再执行后续任务
   * @param {number} time - 延迟秒数
   * @returns {this}
   */
  sleep(time) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this._next();
      }, time * 1000);
    });
    return this;
  }

  /**
   * @description 立即延迟指定秒数（插入队列最前），再执行后续任务
   * @param {number} time - 延迟秒数
   * @returns {this}
   */
  sleepFirst(time) {
    this.tasks.unshift(() => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this._next();
      }, time * 1000);
    });
    return this;
  }

  /**
   * @description 吃指定食物，输出提示
   * @param {string} food - 食物名称
   * @returns {this}
   */
  eat(food) {
    this.tasks.push(() => {
      console.log(`Eat ${food}~`);
      this._next();
    });
    return this;
  }
}

// 测试用例
// LazyMan("Hank");
// LazyMan("Hank").sleep(10).eat("dinner");
// LazyMan("Hank").eat("dinner").eat("supper");
// LazyMan("Hank").eat("supper").sleepFirst(5);


