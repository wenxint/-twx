/**
 * @description 控制异步请求并发数的工具类
 * @class AsyncRequestControl
 */
class AsyncRequestControl {
  /**
   * @param {number} [maxConcurrent=3] 最大并发请求数
   */
  /**
   * 构造函数，初始化并发控制器
   * @param {number} [maxConcurrent=3] 最大允许的并发请求数量
   */
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent; // 最大并发数上限
    this.currentConcurrent = 0; // 当前正在执行的请求计数
    this.taskQueue = []; // 待执行的任务队列（存储包含请求函数和回调的对象）
  }

  /**
   * @description 添加请求任务到队列
   * @param {Function} requestFn 请求函数（需返回Promise）
   * @returns {Promise} 请求结果
   */
  /**
   * 向队列中添加待执行的异步请求任务
   * @param {Function} requestFn 实际的请求函数（需返回Promise）
   * @returns {Promise} 该请求的执行结果（通过resolve/reject传递）
   * @description 任务会被暂存到队列中，当并发数未达上限时立即执行
   */
  addTask(requestFn) {
    return new Promise((resolve, reject) => {
      // 将任务封装为包含请求函数和回调的对象存入队列
      this.taskQueue.push({
        requestFn,
        resolve,
        reject,
      });
      // 触发任务执行检查
      this._runTask();
    });
  }

  /**
   * @description 执行队列中的任务
   * @private
   */
  /**
   * 私有方法：执行队列中的任务（核心调度逻辑）
   * @private
   * @description 循环检查并发数和队列状态，决定是否执行新任务
   */
  _runTask() {
    // 循环条件：当前并发数未达上限 且 队列中有待执行任务
    while (
      this.currentConcurrent < this.maxConcurrent &&
      this.taskQueue.length > 0
    ) {
      // 取出队列头部的任务（FIFO顺序）
      const task = this.taskQueue.shift();
      // 增加当前并发计数
      this.currentConcurrent++;
      // 执行请求函数并处理回调
      task
        .requestFn()
        .then(task.resolve)
        .catch(task.reject)
        .finally(() => {
          this.currentConcurrent--;
          this._runTask(); // 任务完成后递归触发剩余任务
        });
    }
  }

  /**
   * @description 动态调整最大并发数
   * @param {number} newMax 新的最大并发数
   */
  setMaxConcurrent(newMax) {
    this.maxConcurrent = newMax;
    this._runTask(); // 调整后可能释放更多槽位，触发任务执行
  }
}
// 模拟异步请求函数（返回Promise）
function mockRequest(url, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`请求${url}成功`);
    }, delay);
  });
}

// 创建并发控制器（最大并发2）
const controller = new AsyncRequestControl(2);

// 添加5个请求任务
[1, 2, 3, 4, 5].forEach((i) => {
  controller
    .addTask(() => mockRequest(`/api/${i}`, 1000*i))
    .then((res) => console.log(res));
});
