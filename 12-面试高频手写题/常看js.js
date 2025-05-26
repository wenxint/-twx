//1.requestAnimationFrame 优化动画（含停止条件）

/**
 * @description 使用 requestAnimationFrame 优化动画（含停止条件）
 */
let position = 0;
const targetPosition = 300; // 目标位置（300px）
let animationId;

function animate() {
  position += 5;
  element.style.transform = `translateX(${position}px)`;

  // 达到目标位置时停止动画
  if (position < targetPosition) {
    animationId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animationId); // 取消下一帧请求
    console.log("动画已停止，最终位置：", position, "px");
  }
}

// 启动动画
animationId = requestAnimationFrame(animate);

/**
 * @description Promise.MyAll方法的完整调用示例
 * 展示如何使用自定义的MyAll方法处理多个Promise
 */

// 首先，让我们回顾一下MyAll的实现
Promise.MyAll = function (promises) {
  // 存储所有 Promise 的结果
  let arr = [],
    // 计数器,记录已完成的 Promise 数量
    count = 0;

  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    // 处理空数组的情况
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    // 遍历传入的 promises 数组
    promises.forEach((item, i) => {
      // 将每个项转为 Promise 对象并执行
      Promise.resolve(item).then(
        (res) => {
          // 按照原始顺序存储结果
          arr[i] = res;
          // 完成计数加1
          count += 1;
          // 当所有 Promise 都完成时,返回结果数组
          if (count === promises.length) resolve(arr);
        },
        // 任何一个 Promise 失败时直接 reject
        reject
      );
    });
  });
};

// ==================== 调用示例 ====================

/**
 * 示例1: 处理全部成功的Promise
 */
console.log("\n===== 示例1: 全部成功的Promise =====");

// 创建多种类型的Promise
const promise1 = Promise.resolve(1); // 立即解决的Promise
const promise2 = new Promise((resolve) => setTimeout(() => resolve(2), 1000)); // 延迟解决的Promise
const promise3 = 3; // 非Promise值(会被自动转换为Promise)
const promise4 = new Promise((resolve) => setTimeout(() => resolve(4), 500)); // 另一个延迟解决的Promise

// 使用自定义的MyAll方法
console.log("开始执行MyAll...");
const startTimeMyAll = Date.now();

Promise.MyAll([promise1, promise2, promise3, promise4])
  .then((results) => {
    const endTimeMyAll = Date.now();
    console.log("MyAll结果:", results);
    console.log("MyAll执行时间:", endTimeMyAll - startTimeMyAll, "ms");
    console.log("MyAll结果类型:", Object.prototype.toString.call(results));
    console.log(
      "MyAll保持了原始顺序，即使promise2(1000ms)比promise4(500ms)晚完成"
    );
  })
  .catch((error) => {
    console.error("MyAll错误:", error);
  });
