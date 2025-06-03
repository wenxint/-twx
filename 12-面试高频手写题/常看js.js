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

// 柯里化函数
/**
 * @description 通用柯里化函数
 * @param {Function} fn - 要柯里化的原始函数
 * @return {Function} 柯里化后的函数
 */
function curry(fn) {
  // 收集参数的闭包变量
  const collectArgs = (...args) => {
    // 如果已收集参数数量满足原始函数要求，执行原始函数
    if (args.length >= fn.length) {
      return fn(...args);
    }
    // 否则返回新函数继续收集参数
    return (...nextArgs) => collectArgs(...args, ...nextArgs);
  };
  return collectArgs;
}
// 手写mySetInterval
function mySetInterval(callback, delay) {
  // 初始调用
  callback(); // 递归调用 setTimeout 来模拟 setInterval
  const intervalId = setTimeout(() => {
    // 清除前一个 setTimeout，防止在回调函数执行时间较长时产生累积的延迟
    clearTimeout(intervalId); // 递归调用 mySetInterval
    mySetInterval(callback, delay); // 执行回调函数
  }, delay);
}
// 使用示例
mySetInterval(() => console.log("Hello, world!"), 1000);

//mySetInterval 中的递归通过 setTimeout 转换为 异步递归 ，每次递归调用的触发点是事件循环的宏任务队列，而非当前调用栈的延续。因此，调用栈不会累积，自然不会触发栈溢出。

//要找到字符串中出现的不重复字符的最长长度

function lengthOfLongestSubstring(s) {
  let start = 0; // 窗口起始位置
  let maxLength = 0; // 最长不重复子串的长度
  let seen = new Set(); // 用于存储窗口内的字符
  for (let end = 0; end < s.length; end++) {
    // 如果当前字符已经在窗口内，则移动窗口的起始位置
    while (seen.has(s[end])) {
      seen.delete(s[start]);
      start++;
    } // 将当前字符添加到窗口内
    seen.add(s[end]); // 更新最长不重复子串的长度
    maxLength = Math.max(maxLength, end - start + 1);
  }
  return maxLength;
}
// 示例
const s = "abcabcbb";
console.log(lengthOfLongestSubstring(s)); // 输出 3

//取消axios请求
const controller = new AbortController();
axios.get("/foo/bar", { signal: controller.signal }).then(function (response) {
  //...
});
controller.abort();

// 千分位分隔符正则表达式（将长数字字符串转换为每三位用逗号分隔的格式，如 "1000000" → "1,000,000"）
var str = "100000000000",
  // 正则解释：
  // - (?=(\B\d{3})+$)：正向先行断言，匹配后面能接「非单词边界+3位数字」且最终到达字符串结尾的位置
  //   - \B：非单词边界（避免在数字开头前添加逗号）
  //   - \d{3}：匹配3位数字
  //   - (+)：前面的组合（\B\d{3}）至少出现1次（处理多组三位数字）
  //   - $：匹配字符串结尾（确保从右往左分割）
  // - g：全局匹配模式（替换所有符合条件的位置）
  reg = /(?=(\B\d{3})+$)/g;
str.replace(reg, ",");
str.replace(reg, ",");

// 实现一个函数，0.1+0.2=0.3
/**
 * @description 判断两个浮点数是否近似相等
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @param {number} [epsilon=Number.EPSILON] - 误差容忍度（默认使用JS内置最小精度）
 * @returns {boolean} 是否近似相等
 */
function floatEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}

// 使用示例
console.log(floatEqual(0.1 + 0.2, 0.3)); // 输出 true

//转化为驼峰命名
var s1 = "get-element-by-id";
var f = function (s) {
  return s.replace(/-\w/g, function (x) {
    return x.slice(1).toUpperCase();
  });
};

/**
 * @description 二分查找算法
 * @param {number[]} arr - 已排序的输入数组（升序）
 * @param {number} target - 目标值
 * @return {number} 目标值的索引（未找到返回-1）
 */
function binarySearch(arr, target) {
  // 初始化左右指针，定义搜索范围的边界
  // 时间复杂度：O(1) - 常数时间的初始化操作
  let left = 0; // 搜索范围的左边界，初始为数组第一个元素
  let right = arr.length - 1; // 搜索范围的右边界，初始为数组最后一个元素

  // 当左指针小于等于右指针时，搜索范围内还有元素，继续搜索
  // 循环最多执行log₂n次，因为每次迭代都将搜索范围缩小一半
  while (left <= right) {
    // 计算中间位置，使用Math.floor确保得到整数索引
    // 使用(left + right) / 2可能导致大数溢出，更安全的写法是：left + Math.floor((right - left) / 2)
    const mid = Math.floor((left + right) / 2);

    // 找到目标值，直接返回索引位置（最好情况：O(1)）
    if (arr[mid] === target) return mid;

    // 中间值小于目标值，说明目标在右半部分
    // 将左边界移到中间位置的右侧，缩小搜索范围为右半部分
    if (arr[mid] < target) {
      left = mid + 1; // 排除了mid及左侧的所有元素
    } else {
      // 中间值大于目标值，说明目标在左半部分
      // 将右边界移到中间位置的左侧，缩小搜索范围为左半部分
      right = mid - 1; // 排除了mid及右侧的所有元素
    }
  }

  // 搜索范围为空仍未找到目标值，返回-1表示不存在
  return -1;
}

// 调用示例
const sortedArr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]; // 创建一个已排序的数组
console.log(binarySearch(sortedArr, 23)); // 输出: 5，表示23在数组中的索引位置
console.log(binarySearch(sortedArr, 10)); // 输出: -1，表示10不在数组中

/**
 * @description 二分查找算法
 * @param {number[]} arr - 已排序的输入数组（升序）
 * @param {number} target - 目标值
 * @return {number} 目标值的索引（未找到返回-1）
 */
function binarySearch(arr, target) {
  // 初始化左右指针，定义搜索范围的边界
  // 时间复杂度：O(1) - 常数时间的初始化操作
  let left = 0; // 搜索范围的左边界，初始为数组第一个元素
  let right = arr.length - 1; // 搜索范围的右边界，初始为数组最后一个元素

  // 当左指针小于等于右指针时，搜索范围内还有元素，继续搜索
  // 循环最多执行log₂n次，因为每次迭代都将搜索范围缩小一半
  while (left <= right) {
    // 计算中间位置，使用Math.floor确保得到整数索引
    // 使用(left + right) / 2可能导致大数溢出，更安全的写法是：left + Math.floor((right - left) / 2)
    const mid = Math.floor((left + right) / 2);

    // 找到目标值，直接返回索引位置（最好情况：O(1)）
    if (arr[mid] === target) return mid;

    // 中间值小于目标值，说明目标在右半部分
    // 将左边界移到中间位置的右侧，缩小搜索范围为右半部分
    if (arr[mid] < target) {
      left = mid + 1; // 排除了mid及左侧的所有元素
    } else {
      // 中间值大于目标值，说明目标在左半部分
      // 将右边界移到中间位置的左侧，缩小搜索范围为左半部分
      right = mid - 1; // 排除了mid及右侧的所有元素
    }
  }

  // 搜索范围为空仍未找到目标值，返回-1表示不存在
  return -1;
}

// 调用示例
const sortedArr2 = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]; // 创建一个已排序的数组
console.log(binarySearch(sortedArr2, 23)); // 输出: 5，表示23在数组中的索引位置
console.log(binarySearch(sortedArr2, 10)); // 输出: -1，表示10不在数组中

/**
 * @description 冒泡排序算法
 * @param {number[]} arr - 输入数组
 * @return {number[]} 排序后的数组
 */
function bubbleSort(arr) {
  // 获取数组长度，用于控制循环次数
  // 时间复杂度：O(1)，常数时间操作
  const len = arr.length;

  // 外层循环：控制排序轮数，最多需要n-1轮（n为数组长度）
  // 时间复杂度：O(n)，最多执行n-1次
  for (let i = 0; i < len - 1; i++) {
    // 优化标志：记录本轮是否发生交换，用于提前终止
    // 如果一轮中没有交换，说明数组已经有序
    let swapped = false;

    // 内层循环：比较并交换相邻元素
    // 每轮比较次数递减，因为每轮结束后最大的元素已经到达正确位置
    // 时间复杂度：O(n-i-1)，随着i增加而减少
    for (let j = 0; j < len - 1 - i; j++) {
      // 比较相邻元素，如果前一个大于后一个，则交换位置
      // 这确保较大的元素逐渐"冒泡"到数组末尾
      if (arr[j] > arr[j + 1]) {
        // 使用ES6解构赋值语法交换元素，无需临时变量
        // 时间复杂度：O(1)，常数时间操作
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 交换相邻元素
        swapped = true; // 标记本轮发生了交换
      }
    }

    // 优化：如果本轮没有发生交换，说明数组已经有序，可以提前终止
    // 最好情况下（已排序数组），时间复杂度降至O(n)
    if (!swapped) break; // 提前终止：若本轮无交换则已排序完成
  }

  // 返回排序后的数组（原地排序，返回原数组的引用）
  // 总体时间复杂度：O(n²)，因为有两层嵌套循环
  // 空间复杂度：O(1)，只使用了少量额外变量
  return arr;
}

// 调用示例
const messyArr = [5, 3, 8, 4, 6]; // 创建一个未排序的数组
console.log(bubbleSort(messyArr)); // 输出: [3, 4, 5, 6, 8]，展示排序后的结果

// https://juejin.cn/post/7353456468094599205?searchId=202505271123555EE696FDB0964BA59F47#heading-28
/**
 * @description 快速排序算法
 * @param {number[]} arr - 输入数组
 * @return {number[]} 排序后的数组
 */
function quickSort(arr) {
  // 基准情况：如果数组长度小于等于1，已经是排序状态，直接返回
  // 这是递归终止条件，确保算法最终会结束
  if (arr.length <= 1) return arr; // 基准情况：长度≤1直接返回

  // 选择中间元素作为基准值（pivot）
  // 选择策略影响算法效率，中间元素通常比首尾元素更平衡
  // 更好的做法是随机选择基准值，以避免最坏情况
  const pivot = arr[Math.floor(arr.length / 2)]; // 选择中间元素作为基准值

  // 创建三个数组，分别存储小于、等于和大于基准值的元素
  // 空间复杂度：O(n)，需要额外空间存储这些数组
  const left = []; // 存储所有小于基准值的元素
  const middle = []; // 存储所有等于基准值的元素
  const right = []; // 存储所有大于基准值的元素

  // 遍历原数组，将每个元素放入对应的分区
  // 时间复杂度：O(n)，需要遍历数组中的每个元素一次
  for (const num of arr) {
    // 根据元素与基准值的比较结果，将其放入对应数组
    // 每次比较和push操作的时间复杂度都是O(1)
    if (num < pivot) left.push(num); // 小于基准值，放入left数组
    else if (num === pivot) middle.push(num); // 等于基准值，放入middle数组
    else right.push(num); // 大于基准值，放入right数组
  }

  // 递归地对left和right数组进行排序，并与middle数组合并
  // 这是分治算法的核心：将问题分解为更小的子问题，解决后合并结果
  // 时间复杂度：T(n) = 2T(n/2) + O(n)，根据主定理，解为O(n log n)
  // 最坏情况（如已排序数组）：T(n) = T(n-1) + O(n)，解为O(n²)
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 调用示例
const unsortedArr = [34, 12, 45, 6, 89, 23]; // 创建一个未排序的数组
console.log(quickSort(unsortedArr)); // 输出: [6, 12, 23, 34, 45, 89]，展示排序后的结果

// 手写call方法：修改函数执行时的this指向并立即执行
Function.prototype.myCall = function (context, ...args) {
  // 处理上下文：若未传入context则默认使用window（浏览器环境），null/undefined时也指向window
  context = context || window;
  // 创建唯一Symbol作为临时属性名，避免覆盖对象原有属性
  const fn = Symbol("fn");
  // 将当前函数（调用myCall的函数）挂载到context的临时属性上
  context[fn] = this;
  // 执行临时属性（即原函数），传入剩余参数，此时函数内的this指向context
  const result = context[fn](...args);
  // 删除临时属性，避免污染原context对象
  delete context[fn];
  // 返回函数执行结果
  return result;
};

// 手写apply方法：与call类似，但参数通过数组传递
Function.prototype.myApply = function (context, args) {
  // 处理上下文：同call逻辑
  context = context || window;
  // 创建唯一Symbol作为临时属性名
  const fn = Symbol("fn");
  // 将当前函数挂载到context的临时属性上
  context[fn] = this;
  // 执行函数：若有参数数组则展开传递，否则直接执行
  const result = args ? context[fn](...args) : context[fn]();
  // 删除临时属性
  delete context[fn];
  // 返回执行结果
  return result;
};

// 手写bind方法：返回一个绑定this的新函数
Function.prototype.myBind = function (context, ...args) {
  // 保存原函数引用（调用bind的函数）
  const self = this;
  // 返回新函数，支持后续传递新参数
  return function (...newArgs) {
    // 调用自定义的myCall方法，合并初始参数和新参数
    return self.myCall(context, ...args, ...newArgs);
  };
};
