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


// 手写new
function myNew(constructor, ...args) {
  // 1. 创建一个新的空对象，并将其原型指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);

  // 2. 将构造函数的 this 绑定到这个新对象
  const result = constructor.apply(obj, args);

  // 3. 如果构造函数返回一个对象，则返回该对象；否则返回新创建的对象
  return result instanceof Object ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
};

// 使用原生的 new
const person1 = new Person("Alice", 25);
person1.sayHello(); // 输出: Hello, my name is Alice and I'm 25 years old.

// 使用我们的 myNew
const person2 = myNew(Person, "Bob", 30);
person2.sayHello(); // 输出: Hello, my name is Bob and I'm 30 years old.

// 手写call方法：修改函数执行时的this指向并立即执行
Function.prototype.myCall = function (context, ...args) {
  // 处理上下文：若未传入context则默认使用window（浏览器环境），null/undefined时也指向window
  context = context || window;
  // 创建唯一Symbol作为临时属性名，避免覆盖对象原有属性
  const fn = Symbol("fn");
  // 将当前函数（调用myCall的函数）挂载到context的临时属性上
  // this 指向当前函数（即调用 myCall 的函数）
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
/**
 * @description 自定义实现instanceof运算符，检测构造函数的prototype是否存在于对象的原型链中
 * @param {Object|Function} obj - 要检测的目标对象（注意：基本类型直接返回false）
 * @param {Function} constructor - 用于检测的构造函数
 * @return {boolean} 目标对象是否为构造函数的实例
 */
function myInstanceof(obj, constructor) {
  // 处理基本类型：基本类型没有原型链，直接返回false（null也在此处处理）
  if ((typeof obj !== "object" && typeof obj !== "function") || obj === null) {
    return false;
  }
  // 获取目标对象的原型（等同于obj.__proto__，但推荐使用标准方法）
  let proto = Object.getPrototypeOf(obj);
  // 遍历原型链，直到原型为null（原型链终点）
  while (proto !== null) {
    // 检查当前原型是否等于构造函数的prototype属性
    if (proto === constructor.prototype) {
      return true; // 找到匹配，返回true
    }
    // 继续向上查找原型链
    proto = Object.getPrototypeOf(proto);
  }
  // 遍历完整个原型链未找到匹配，返回false
  return false;
}

// 使用示例
function Animal() {}
const cat = new Animal();
console.log(myInstanceof(cat, Animal)); // 输出: true
console.log(myInstanceof(cat, Object)); // 输出: true
console.log(myInstanceof(123, Number)); // 输出: false（基本类型直接返回false）

/**
 * @description 自定义实现instanceof运算符，检测构造函数的prototype是否存在于对象的原型链中
 * @param {Object|Function} obj - 要检测的目标对象（注意：基本类型直接返回false）
 * @param {Function} constructor - 用于检测的构造函数
 * @return {boolean} 目标对象是否为构造函数的实例
 */
function myInstanceof(obj, constructor) {
  // 处理基本类型：基本类型没有原型链，直接返回false（null也在此处处理）
  if ((typeof obj !== "object" && typeof obj !== "function") || obj === null) {
    return false;
  }
  // 获取目标对象的原型（等同于obj.__proto__，但推荐使用标准方法）
  let proto = Object.getPrototypeOf(obj);
  // 遍历原型链，直到原型为null（原型链终点）
  while (proto !== null) {
    // 检查当前原型是否等于构造函数的prototype属性
    if (proto === constructor.prototype) {
      return true; // 找到匹配，返回true
    }
    // 继续向上查找原型链
    proto = Object.getPrototypeOf(proto);
  }
  // 遍历完整个原型链未找到匹配，返回false
  return false;
}

// 使用示例
function Animal() {}
const cat1 = new Animal();
console.log(myInstanceof(cat1, Animal)); // 输出: true
console.log(myInstanceof(cat1, Object)); // 输出: true
console.log(myInstanceof(123, Number)); // 输出: false（基本类型直接返回false）

/**
 * 深拷贝一个对象
 *
 * @param {any} obj 需要深拷贝的对象
 * @returns {any} 深拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    // 如果是基本类型或 null，直接返回
    return obj;
  }

  if (obj instanceof Date) {
    // 如果是 Date 对象，返回一个新的 Date
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    // 如果是正则表达式，返回一个新的 RegExp
    return new RegExp(obj);
  }

  // 如果是数组或对象，递归拷贝
  const clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]); // 递归拷贝每个属性
    }
  }

  return clone;
}

// 测试
const obj = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding"],
  address: {
    city: "Beijing",
    street: "Main St",
  },
  birthDate: new Date(),
  regex: /test/g,
};

const deepCopy = deepClone(obj);

deepCopy.name = "Bob";
deepCopy.address.city = "Shanghai";
deepCopy.birthDate.setFullYear(2000); // 不会影响原对象

console.log(obj.name); // "Alice"
console.log(deepCopy.name); // "Bob"
console.log(obj.address.city); // "Beijing"
console.log(deepCopy.address.city); // "Shanghai"
console.log(obj.birthDate.getFullYear()); // 原年份
console.log(deepCopy.birthDate.getFullYear()); // 2000

/**
 * 超简单版本：控制固定数量异步任务的并发执行
 * @param {number} limit - 最大并发数
 */
function simpleLimit(limit) {
  // 等待执行的任务队列
  const queue = [];
  // 当前正在执行的任务数量
  let activeCount = 0;

  // 执行队列中的下一个任务
  const runNext = () => {
    if (queue.length === 0) return;

    // 如果正在执行的任务数量小于限制，则执行下一个任务
    if (activeCount < limit) {
      // 从队列中取出一个任务
      const { fn, resolve, reject } = queue.shift();
      activeCount++;

      Promise.resolve(fn())
        .then(resolve)
        .catch(reject)
        .finally(() => {
          activeCount--;
          runNext(); // 任务完成后，尝试执行下一个任务
        });
    }
  };

  // 返回一个函数，用于添加任务
  return (fn) => {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      runNext();
    });
  };
}

// 使用示例
const runTask = simpleLimit(2); // 最多同时执行2个任务

// 创建5个模拟的异步任务
const createTask = (id, delay) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`任务${id}完成，耗时${delay}ms`);
      resolve(`任务${id}的结果`);
    }, delay);
  });
};

// 执行任务并获取结果
runTask(createTask(1, 1000)).then((result) => console.log(result));
runTask(createTask(2, 2000)).then((result) => console.log(result));
runTask(createTask(3, 1500)).then((result) => console.log(result));
runTask(createTask(4, 800)).then((result) => console.log(result));

/**
 * 图片懒加载类
 * @class LazyLoad
 */
class LazyLoad {
  /**
   * 创建懒加载实例
   * @param {Object} options - 配置选项
   * @param {string} options.selector - 懒加载图片的CSS选择器
   * @param {string} options.dataSrc - 存储真实图片地址的data属性名
   * @param {number} options.threshold - IntersectionObserver的阈值
   * @param {number} options.throttleDelay - 节流延迟时间（毫秒）
   */
  constructor(options = {}) {
    this.options = {
      selector: ".lazy-image",
      dataSrc: "data-src",
      threshold: 0.1,
      throttleDelay: 200,
      ...options,
    };

    this.images = [];
    this.observer = null;
    this.initialized = false;

    // 绑定方法的this
    this.throttledLoad = this.throttle(
      this.loadImages.bind(this),
      this.options.throttleDelay
    );
  }

  /**
   * 初始化懒加载
   */
  init() {
    if (this.initialized) return;

    this.images = Array.from(document.querySelectorAll(this.options.selector));

    if ("IntersectionObserver" in window) {
      this.initIntersectionObserver();
    } else {
      this.initLegacyLazyLoad();
    }

    this.initialized = true;
  }

  /**
   * 使用IntersectionObserver初始化
   */
  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.options.threshold,
      }
    );

    this.images.forEach((image) => {
      if (image.hasAttribute(this.options.dataSrc)) {
        this.observer.observe(image);
      }
    });
  }

  /**
   * 初始化传统的滚动监听方式
   */
  initLegacyLazyLoad() {
    // 初始检查
    this.loadImages();

    // 添加滚动事件监听
    window.addEventListener("scroll", this.throttledLoad);
    window.addEventListener("resize", this.throttledLoad);
    window.addEventListener("orientationchange", this.throttledLoad);
  }

  /**
   * 加载所有在可视区域内的图片
   */
  loadImages() {
    this.images = this.images.filter((image) => {
      if (!image.hasAttribute(this.options.dataSrc)) {
        return false;
      }

      if (this.isInViewport(image)) {
        this.loadImage(image);
        return false;
      }

      return true;
    });

    // 如果所有图片都已加载，移除事件监听
    if (this.images.length === 0) {
      this.destroy();
    }
  }

  /**
   * 加载单张图片
   * @param {HTMLImageElement} image - 要加载的图片元素
   */
  loadImage(image) {
    const src = image.getAttribute(this.options.dataSrc);
    if (!src) return;

    // 设置加载事件
    image.onload = () => {
      image.removeAttribute(this.options.dataSrc);
      image.classList.add("lazy-loaded");
    };

    // 设置错误处理
    image.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      image.removeAttribute(this.options.dataSrc);
    };

    // 触发图片加载
    image.src = src;
  }

  /**
   * 检查元素是否在可视区域内
   * @param {HTMLElement} element - 要检查的元素
   * @returns {boolean} 是否在可视区域内
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0 &&
      rect.left <=
        (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
  }

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 节流后的函数
   */
  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  /**
   * 重新扫描页面中的懒加载图片
   * 用于动态添加的内容
   */
  rescan() {
    const newImages = Array.from(
      document.querySelectorAll(this.options.selector)
    ).filter(
      (image) =>
        !this.images.includes(image) && image.hasAttribute(this.options.dataSrc)
    );

    if (newImages.length > 0) {
      this.images = [...this.images, ...newImages];

      if (this.observer) {
        newImages.forEach((image) => this.observer.observe(image));
      } else {
        this.loadImages();
      }
    }
  }

  /**
   * 销毁懒加载实例，移除所有事件监听
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    } else {
      window.removeEventListener("scroll", this.throttledLoad);
      window.removeEventListener("resize", this.throttledLoad);
      window.removeEventListener("orientationchange", this.throttledLoad);
    }

    this.initialized = false;
  }
}
/**
 * set集合操作交集、并集和差集
 */

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// 并集
const union = new Set([...a, ...b]); // Set(4) {1, 2, 3, 4}

// 交集
const intersection = new Set([...a].filter((x) => b.has(x))); // Set(2) {2, 3}

// 差集 (a - b)
const difference = new Set([...a].filter((x) => !b.has(x))); // Set(1) {1}

// 判断当前页面是否在 iframe 中
const isInIframe = window.self !== window.top;

if (isInIframe) {
  console.log("当前页面被嵌入在 iframe 中");
} else {
  console.log("当前页面是顶级窗口");
}
/**
 * 手写reduce函数实现
 */
Array.prototype.myReduce = function (callback, initialValue) {
  // 1. 检查回调函数是否为函数
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const array = this; // 当前数组
  const length = array.length;
  let accumulator;
  let startIndex;

  // 2. 处理初始值
  if (arguments.length >= 2) {
    // 如果提供了初始值，从第 0 个元素开始
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // 如果没有提供初始值，使用第一个元素作为初始值，并从第 1 个元素开始
    if (length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = array[0];
    startIndex = 1;
  }

  // 3. 遍历数组，执行累加器函数
  for (let i = startIndex; i < length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  // 4. 返回最终的累积值
  return accumulator;
};

/**
 * @description 带记忆功能的斐波那契数列实现
 * @param {number} n - 需要计算的斐波那契数列位置
 * @return {number} 斐波那契数列第n项的值
 */
function fibonacciMemoized() {
  // 创建缓存对象
  const cache = {};

  // 内部递归函数
  function fib(n) {
    // 检查缓存中是否已有计算结果
    if (n in cache) {
      return cache[n];
    }

    // 基本情况
    if (n <= 1) {
      return n;
    }

    // 计算结果并存入缓存
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  }

  // 返回内部函数
  return fib;
}

const fib = fibonacciMemoized();
console.log(fib(40)); // 输出: 102334155 (计算非常快)

//深度优先遍历和广度优先遍历的实现代码

/**
 * @description 树节点构造函数
 * @param {any} value - 节点值
 */
function TreeNode(value) {
  this.value = value;
  this.children = [];
}

/**
 * @description 深度优先遍历（DFS）
 * @param {TreeNode} node - 树节点
 * @param {function} callback - 处理节点的回调函数
 */
function depthFirstTraversal(node, callback) {
  // 基本情况：节点为null
  if (!node) return;

  // 处理当前节点
  callback(node.value);

  // 递归遍历所有子节点
  for (const child of node.children) {
    depthFirstTraversal(child, callback);
  }
}

/**
 * @description 广度优先遍历（BFS，使用队列，非递归实现）
 * @param {TreeNode} root - 根节点
 * @param {function} callback - 处理节点的回调函数
 */
function breadthFirstTraversal(root, callback) {
  if (!root) return;

  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    callback(node.value); // 执行回调处理当前节点
    for (const child of node.children) {
      queue.push(child);
    }
  }
}

// 创建一个示例树
const root = new TreeNode("A");
const nodeB = new TreeNode("B");
const nodeC = new TreeNode("C");
const nodeD = new TreeNode("D");
const nodeE = new TreeNode("E");
const nodeF = new TreeNode("F");

root.children.push(nodeB, nodeC);
nodeB.children.push(nodeD, nodeE);
nodeC.children.push(nodeF);
// A
// /
// B   C
// / \
// D  E   F
// 测试遍历
console.log("DFS遍历结果:");
depthFirstTraversal(root, (value) => console.log(value));
// 输出: A B D E C F

console.log("BFS遍历结果:");
breadthFirstTraversal(root, (value) => console.log(value));
// 输出: A B C D E F

//  组织架构树形数据转换为树形结构

const data = [
  { id: "01", name: "张大大", pid: "", job: "项目经理" },
  { id: "02", name: "小亮", pid: "01", job: "产品leader" },
  { id: "03", name: "小美", pid: "01", job: "UIleader" },
  { id: "04", name: "老马", pid: "01", job: "技术leader" },
  { id: "05", name: "老王", pid: "01", job: "测试leader" },
  { id: "06", name: "老李", pid: "01", job: "运维leader" },
  { id: "07", name: "小丽", pid: "02", job: "产品经理" },
  { id: "08", name: "大光", pid: "02", job: "产品经理" },
  { id: "09", name: "小高", pid: "03", job: "UI设计师" },
  { id: "10", name: "小刘", pid: "04", job: "前端工程师" },
  { id: "11", name: "小华", pid: "04", job: "后端工程师" },
  { id: "12", name: "小李", pid: "04", job: "后端工程师" },
  { id: "13", name: "小赵", pid: "05", job: "测试工程师" },
  { id: "14", name: "小强", pid: "05", job: "测试工程师" },
  { id: "15", name: "小涛", pid: "06", job: "运维工程师" },
];

function toTree(arr, parentId) {
  // 定义一个递归函数 loop，用于构建树结构
  function loop(parentId) {
    // 初始化结果数组
    let res = [];
    // 遍历数组 arr
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      // 如果当前项的父级 ID 不等于传入的 parentId，则跳过
      if (item.pid !== parentId) {
        continue;
      }

      // 递归调用 loop 函数，将当前项的 ID 作为父级 ID 传入，获取子节点
      item.children = loop(item.id);
      // 将当前项添加到结果数组中
      res.push(item);
    }
    // 返回结果数组
    return res;
  }
  // 调用递归函数 loop，并返回结果
  return loop(parentId);
}

function toTree(arr) {
  // 1. 建立 id 到节点的映射（避免重复遍历）
  // 建立节点映射
  const nodeMap = new Map();
  arr.forEach((item) => {
    // 用 id 作为 key 存储节点，并初始化 children 为空数组
    nodeMap.set(item.id, { ...item, children: [] }); // 用 id 作为 key 存储节点
  });

  // 2. 构建树
  // 初始化树数组
  const tree = [];
  arr.forEach((item) => {
    // 判断是否为根节点
    if (item.pid === null || item.pid === undefined) {
      // 如果是根节点，直接加入树
      // 将根节点加入树数组
      tree.push(nodeMap.get(item.id));
    } else {
      // 如果不是根节点，找到父节点并添加到其 children 中
      // 获取父节点
      const parent = nodeMap.get(item.pid);
      if (parent) {
        // 将当前节点添加到父节点的 children 数组中
        parent.children.push(nodeMap.get(item.id));
      }
    }
  });

  return tree;
}

const result = toTree(data, "");

//敏感信息脱敏（replace）
function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}
console.log(maskPhone("13812345678")); // 输出: '138****5678'

//URL参数解析（matchAll 或 replace）
function parseQueryString(url) {
  const queryString = url.split("?")[1];
  if (!queryString) return {};

  const params = {};
  // 使用 matchAll
  // const paramRegex = /([^&=]+)=([^&]*)/g;
  // for (const match of queryString.matchAll(paramRegex)) {
  //   params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  // }

  // 或者使用 replace 的函数回调
  queryString.replace(/([^&=]+)=([^&]*)/g, (match, key, value) => {
    params[decodeURIComponent(key)] = decodeURIComponent(value);
    return ""; // 返回空字符串，因为我们只关心副作用（填充params对象）
  });

  return params;
}

console.log(
  parseQueryString("https://example.com?name=Alice&age=30&city=New%20York")
);
// 输出: { name: 'Alice', age: '30', city: 'New York' }
function parseUrlParams(url) {
  const params = {};
  // 提取查询部分（? 后的内容）
  const queryString = url.split("?")[1] || "";
  // 分割键值对（处理 # 后的哈希，避免干扰）
  const pairs = queryString.split("#")[0].split("&");

  for (const pair of pairs) {
    if (!pair) continue; // 跳过空字符串（如 URL 末尾的 &）
    let [key, value] = pair.split("=");
    // 处理无值的参数（如 key 或 key=）
    value = value === undefined ? "" : value;
    // 解码 URI 编码（处理中文、特殊符号）
    key = decodeURIComponent(key.replace(/\+/g, " ")); // 替换 + 为空格（表单提交习惯）
    value = decodeURIComponent(value.replace(/\+/g, " "));
    // 多个相同键的情况（如 ?a=1&a=2），存储为数组
    if (params.hasOwnProperty(key)) {
      params[key] = [].concat(params[key], value);
    } else {
      params[key] = value;
    }
  }
  return params;
}

// 当前页面 URL（或任意 URL 字符串）
const url = new URL(
  "https://example.com/page?name=%E5%B0%8F%E6%98%8E&age=20&hobby=reading&hobby=music"
);

// 1. 直接获取参数对象（需手动处理多值）
const params = Object.fromEntries(url.searchParams.entries());
console.log(params);
// 输出：{ name: '小明', age: '20', hobby: 'reading' }（注意：hobby 只取第一个）

// 2. 获取单个参数（推荐）
const name = url.searchParams.get("name"); // '小明'
const age = url.searchParams.get("age"); // '20'

// 3. 获取多个值（如 hobby）
const hobbies = url.searchParams.getAll("hobby"); // ['reading', 'music']

// 4. 检查参数是否存在
const hasHobby = url.searchParams.has("hobby"); // true

// 5. 处理无值的参数（如 ?key）
const isEmpty = url.searchParams.get("key"); // null（若参数存在但无值，返回空字符串）

/**
 * @description 记忆化函数的实现
 * @example

 */
// 1. 基础记忆化
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 2. 实际应用：斐波那契数列
const fibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。

// 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
// 给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.' 来形成。你 不能 重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。

// 示例 1：

// 输入：s = "25525511135"
// 输出：["255.255.11.135","255.255.111.35"]
// 示例 2：

// 输入：s = "0000"
// 输出：["0.0.0.0"]
// 示例 3：

// 输入：s = "101023"
// 输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]

/**
 * @description 生成所有可能的有效IP地址
 * @param {string} s - 输入的纯数字字符串
 * @return {string[]} 所有有效的IP地址数组
 */
function restoreIpAddresses(s) {
  const result = [];
  const len = s.length;

  // 回溯函数：当前段数、当前路径、当前位置
  const backtrack = (segCount, path, start) => {
    // 终止条件：已分割4段且遍历完所有字符
    if (segCount === 4) {
      if (start === len) {
        result.push(path.join("."));
      }
      return;
    }

    // 尝试取1-3位作为当前段
    for (let end = start + 1; end <= Math.min(start + 3, len); end++) {
      const segment = s.substring(start, end);
      // 检查当前段是否有效
      if (isValidSegment(segment)) {
        path.push(segment);
        backtrack(segCount + 1, path, end);
        path.pop(); // 回溯
      }
    }
  };

  /**
   * @description 检查段是否有效
   * @param {string} segment - 当前分割段
   * @return {boolean} 是否有效
   */
  const isValidSegment = (segment) => {
    // 长度超过3或前导零（非单零）
    if (segment.length > 3 || (segment.length > 1 && segment[0] === "0")) {
      return false;
    }
    // 数值超过255
    return parseInt(segment, 10) <= 255;
  };

  backtrack(0, [], 0);
  return result;
}

// 示例1
console.log(restoreIpAddresses("25525511135")); // 输出: ["255.255.11.135","255.255.111.35"]

// 示例2
console.log(restoreIpAddresses("0000")); // 输出: ["0.0.0.0"]

// 示例3
console.log(restoreIpAddresses("101023")); // 输出: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]

/**
 * @description 记忆化函数的实现
 * @example
 *
 */
// 1. 基础记忆化
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 2. 实际应用：斐波那契数列
const fibonacci2 = memoize(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
//生成 [a, b] 之间的随机整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNum = getRandomInt(1, 10);
console.log(randomNum); // 可能是 1, 2, ..., 10

//回溯算法 实现全排列
function permute(nums) {
  const res = [];
  const used = new Array(nums.length).fill(false); // 标记数字是否被使用

  function backtrack(path) {
    if (path.length === nums.length) {
      res.push([...path]); // 当前路径完成，加入结果
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        used[i] = true; // 标记为已使用
        path.push(nums[i]); // 加入当前路径
        backtrack(path); // 递归选择下一个数字
        path.pop(); // 撤销选择（回溯）
        used[i] = false; // 恢复未使用状态
      }
    }
  }

  backtrack([]);
  return res;
}

// 测试
console.log(permute([1, 2, 3]));
// 输出: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,2,1], [3,1,2]]
