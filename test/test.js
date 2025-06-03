/**
 * 控制异步请求并发数的简单函数式实现
 * @param {Array<Function>} tasks - 异步任务数组，每个任务都是返回Promise的函数
 * @param {number} limit - 最大并发数
 * @returns {Promise<Array>} - 所有任务的结果数组（按照添加顺序）
 */
function limitConcurrency(tasks, limit) {
  // 任务结果数组（保持与tasks相同顺序）
  const results = new Array(tasks.length);
  // 记录已完成的任务数量
  let completedCount = 0;
  // 当前正在执行的任务数量
  let runningCount = 0;
  // 下一个要执行的任务索引
  let nextIndex = 0;

  return new Promise((resolve) => {
    // 定义执行下一批任务的函数
    function runNextTasks() {
      // 当所有任务都已完成时，返回结果
      if (completedCount === tasks.length) {
        resolve(results);
        return;
      }

      // 尝试启动新任务，直到达到并发上限或任务都已分配
      while (runningCount < limit && nextIndex < tasks.length) {
        const taskIndex = nextIndex++;
        const task = tasks[taskIndex];

        // 增加运行计数
        runningCount++;

        // 执行任务并处理结果
        Promise.resolve(task())
          .then(result => {
            // 保存结果到对应位置
            results[taskIndex] = result;
            console.log(taskIndex,'taskIndextaskIndex');

            completedCount++;
            runningCount--;

            // 尝试执行更多任务
            runNextTasks();
          })
          .catch(error => {
            // 错误处理：记录错误并继续
            results[taskIndex] = { error };
            completedCount++;
            runningCount--;

            // 尝试执行更多任务
            runNextTasks();
          });
      }
    }

    // 开始执行任务
    runNextTasks();
  });
}

// 使用示例：控制5个setTimeout的并发执行
const tasks = [
  () => new Promise(resolve => setTimeout(() => {
    console.log('任务1完成');
    resolve('结果1');
  }, 5000)),
  () => new Promise(resolve => setTimeout(() => {
    console.log('任务2完成');
    resolve('结果2');
  }, 1000)),
  () => new Promise(resolve => setTimeout(() => {
    console.log('任务3完成');
    resolve('结果3');
  }, 1000)),
  () => new Promise(resolve => setTimeout(() => {
    console.log('任务4完成');
    resolve('结果4');
  }, 1800)),
  () => new Promise(resolve => setTimeout(() => {
    console.log('任务5完成');
    resolve('结果5');
  }, 1200))
];

// 限制并发数为2
limitConcurrency(tasks, 2).then(results => {
  console.log('所有任务完成，结果：', results);
});