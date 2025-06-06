window.CODE_DATA = [
  {
    id: "requestAnimationFrame",
    title: "requestAnimationFrame 动画优化",
    description: "使用 requestAnimationFrame 实现平滑动画，相比 setTimeout 和 setInterval 具有更好的性能和更流畅的动画效果。",
    code: `/**
 * @description 使用 requestAnimationFrame 优化动画（含停止条件）
 */
let position = 0;
const targetPosition = 300; // 目标位置（300px）
let animationId;

function animate() {
  position += 5;
  element.style.transform = \`translateX(\${position}px)\`;

  // 达到目标位置时停止动画
  if (position < targetPosition) {
    animationId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animationId); // 取消下一帧请求
    console.log("动画已停止，最终位置：", position, "px");
  }
}

// 启动动画
animationId = requestAnimationFrame(animate);`
  },
  {
    id: "promiseMyAll",
    title: "Promise.MyAll 实现",
    description: "手动实现 Promise.all 方法，接收一个 Promise 数组，返回一个新的 Promise，当所有 Promise 都成功时返回结果数组，任一 Promise 失败则返回失败原因。",
    code: `/**
 * @description Promise.MyAll方法的完整调用示例
 */
Promise.MyAll = function (promises) {
  let arr = [], count = 0;
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    promises.forEach((item, i) => {
      Promise.resolve(item).then(
        (res) => {
          arr[i] = res;
          count += 1;
          if (count === promises.length) resolve(arr);
        },
        reject
      );
    });
  });
};

// 使用示例
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve) => setTimeout(() => resolve(2), 1000));
const promise3 = 3;

Promise.MyAll([promise1, promise2, promise3])
  .then((results) => {
    console.log("MyAll结果:", results); // [1, 2, 3]
  })
  .catch((error) => {
    console.error("MyAll错误:", error);
  });`
  },
  {
    id: "curry",
    title: "函数柯里化",
    description: "实现函数柯里化，将接受多个参数的函数转换为接受单个参数的函数序列，每个函数返回一个新函数，直到收集所有参数后执行原函数。",
    code: `/**
 * @description 通用柯里化函数
 * @param {Function} fn - 要柯里化的原始函数
 * @return {Function} 柯里化后的函数
 */
function curry(fn) {
  const collectArgs = (...args) => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs) => collectArgs(...args, ...nextArgs);
  };
  return collectArgs;
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 输出: 6
console.log(curriedAdd(1, 2)(3)); // 输出: 6
console.log(curriedAdd(1)(2, 3)); // 输出: 6
console.log(curriedAdd(1, 2, 3)); // 输出: 6`
  },
  {
    id: "mySetInterval",
    title: "自定义 setInterval",
    description: "使用 setTimeout 实现 setInterval 的功能，可以避免 setInterval 的一些问题，如回调函数执行时间超过间隔时间导致的连续执行。",
    code: `/**
 * @description 自定义实现 setInterval
 * @param {Function} callback - 每次间隔执行的回调函数
 * @param {number} delay - 间隔时间（毫秒）
 */
function mySetInterval(callback, delay) {
  let timerId;

  const interval = () => {
    callback();
    timerId = setTimeout(interval, delay);
  };

  timerId = setTimeout(interval, delay);

  return () => clearTimeout(timerId);
}

// 使用示例
console.log("mySetInterval 开始...");
const stopInterval = mySetInterval(() => {
  console.log("Hello from mySetInterval!");
}, 1000);

// 5秒后停止定时器
setTimeout(() => {
  stopInterval();
  console.log("mySetInterval 已停止。");
}, 5500);`
  },
  {
    id: "lengthOfLongestSubstring",
    title: "最长不重复子串",
    description: "查找字符串中最长的不含重复字符的子串，使用滑动窗口算法实现，时间复杂度为 O(n)。",
    code: `/**
 * @description 查找字符串中出现的不重复字符的最长长度
 * @param {string} s - 输入字符串
 * @returns {number} 最长不重复子串的长度
 */
function lengthOfLongestSubstring(s) {
  let start = 0;
  let maxLength = 0;
  let seen = new Set();

  for (let end = 0; end < s.length; end++) {
    while (seen.has(s[end])) {
      seen.delete(s[start]);
      start++;
    }
    seen.add(s[end]);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  return maxLength;
}

// 示例
const s = "abcabcbb";
console.log(\`字符串 "\${s}" 的最长不重复子串长度为: \${lengthOfLongestSubstring(s)}\`); // 输出: 3

const s2 = "bbbbb";
console.log(\`字符串 "\${s2}" 的最长不重复子串长度为: \${lengthOfLongestSubstring(s2)}\`); // 输出: 1`
  },
  {
    id: "axiosCancel",
    title: "Axios 请求取消",
    description: "使用 AbortController 取消 Axios 请求，避免不必要的网络请求和内存泄漏。",
    code: `/**
 * @description 取消 Axios 请求
 */
const controller = new AbortController();

axios.get("/foo/bar", {
  signal: controller.signal
}).then(function (response) {
  console.log("请求成功:", response.data);
}).catch(function (error) {
  if (error.name === 'AbortError') {
    console.log("请求已取消");
  } else {
    console.error("请求失败:", error);
  }
});

// 取消请求
controller.abort();`
  },
  {
    id: "thousandSeparator",
    title: "千分位分隔符",
    description: "使用正则表达式为数字添加千分位分隔符，将长数字字符串转换为每三位用逗号分隔的格式。",
    code: `/**
 * @description 千分位分隔符正则表达式
 * 将长数字字符串转换为每三位用逗号分隔的格式，如 "1000000" → "1,000,000"
 */
var str = "100000000000";

// 正则解释：
// - (?=(\B\d{3})+$)：正向先行断言，匹配后面能接「非单词边界+3位数字」且最终到达字符串结尾的位置
//   - \B：非单词边界（避免在数字开头前添加逗号）
//   - \d{3}：匹配3位数字
//   - (+)：前面的组合（\B\d{3}）至少出现1次（处理多组三位数字）
//   - $：匹配字符串结尾（确保从右往左分割）
// - g：全局匹配模式（替换所有符合条件的位置）
var reg = /(?=(\B\d{3})+$)/g;

console.log(str.replace(reg, ",")); // 输出: "100,000,000,000"`
  },
  {
    id: "floatEqual",
    title: "浮点数相等比较",
    description: "实现一个函数来判断两个浮点数是否近似相等，解决 JavaScript 浮点数运算精度问题，如 0.1+0.2≠0.3。",
    code: `/**
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
console.log(0.1 + 0.2 === 0.3); // 输出 false
console.log(floatEqual(0.1 + 0.2, 0.3)); // 输出 true

// 自定义精度
console.log(floatEqual(0.1 + 0.2, 0.3, 0.0001)); // 输出 true`
  },
  {
    id: "kebabToCamel",
    title: "转化为驼峰命名",
    description: "将 kebab-case（短横线分隔）字符串转换为 camelCase（驼峰）命名格式。",
    code: `/**
 * @description 转化为驼峰命名
 * @param {string} s - kebab-case 字符串
 * @returns {string} camelCase 字符串
 */
var s1 = "get-element-by-id";

var f = function (s) {
  return s.replace(/-\w/g, function (x) {
    return x.slice(1).toUpperCase();
  });
};

console.log(f(s1)); // 输出: "getElementById"

// 另一种写法（箭头函数）
const kebabToCamel = (str) => {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
};

console.log(kebabToCamel("get-element-by-id")); // 输出: "getElementById"`
  },
  {
    id: "binarySearch",
    title: "二分查找",
    description: "在有序数组中查找目标值的高效算法，时间复杂度为 O(log n)。",
    code: `/**
 * @description 二分查找算法
 * @param {number[]} arr - 已排序的输入数组（升序）
 * @param {number} target - 目标值
 * @return {number} 目标值的索引（未找到返回-1）
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// 调用示例
const sortedArr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(\`在数组中查找 23: \${binarySearch(sortedArr, 23)}\`); // 输出: 5
console.log(\`在数组中查找 10: \${binarySearch(sortedArr, 10)}\`); // 输出: -1`
  },
  {
    id: "bubbleSort",
    title: "冒泡排序",
    description: "最基础的排序算法之一，通过相邻元素的比较和交换来排序，时间复杂度 O(n²)。",
    code: `/**
 * @description 冒泡排序算法
 * @param {number[]} arr - 输入数组
 * @return {number[]} 排序后的数组
 */
function bubbleSort(arr) {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    let swapped = false;

    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 优化：如果本轮没有发生交换，说明数组已经有序
    if (!swapped) break;
  }

  return arr;
}

// 调用示例
const messyArr = [5, 3, 8, 4, 6];
console.log(bubbleSort(messyArr)); // 输出: [3, 4, 5, 6, 8]`
  },
  {
    id: "quickSort",
    title: "快速排序",
    description: "高效的分治排序算法，平均时间复杂度 O(n log n)，在大多数情况下性能优于其他排序算法。",
    code: `/**
 * @description 快速排序算法
 * @param {number[]} arr - 输入数组
 * @return {number[]} 排序后的数组
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const middle = [];
  const right = [];

  for (const num of arr) {
    if (num < pivot) left.push(num);
    else if (num === pivot) middle.push(num);
    else right.push(num);
  }

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 调用示例
const unsortedArr = [34, 12, 45, 6, 89, 23];
console.log(quickSort(unsortedArr)); // 输出: [6, 12, 23, 34, 45, 89]`
  },
  {
    id: "callApplyBind",
    title: "手写 call、apply、bind",
    description: "手动实现 JavaScript 中的 call、apply 和 bind 方法，用于改变函数执行时的 this 指向。",
    code: `/**
 * @description 手写 call、apply、bind 方法
 */

// 手写call方法：修改函数执行时的this指向并立即执行
Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  const fn = Symbol("fn");
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

// 手写apply方法：与call类似，但参数通过数组传递
Function.prototype.myApply = function (context, args) {
  context = context || window;
  const fn = Symbol("fn");
  context[fn] = this;
  const result = args ? context[fn](...args) : context[fn]();
  delete context[fn];
  return result;
};

// 手写bind方法：返回一个绑定this的新函数
Function.prototype.myBind = function (context, ...args) {
  const self = this;
  return function (...newArgs) {
    return self.myCall(context, ...args, ...newArgs);
  };
};

// 使用示例
const obj = { name: "Alice" };
function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

console.log(greet.myCall(obj, "Hello", "!")); // "Hello, Alice!"
console.log(greet.myApply(obj, ["Hi", "."])); // "Hi, Alice."

const boundGreet = greet.myBind(obj, "Hey");
console.log(boundGreet("?")); // "Hey, Alice?"`
  },
  {
    id: "myInstanceof",
    title: "自定义 instanceof",
    description: "手动实现 instanceof 运算符，检测构造函数的 prototype 是否存在于对象的原型链中。",
    code: `/**
 * @description 自定义实现instanceof运算符
 * @param {Object|Function} obj - 要检测的目标对象
 * @param {Function} constructor - 用于检测的构造函数
 * @return {boolean} 目标对象是否为构造函数的实例
 */
function myInstanceof(obj, constructor) {
  if ((typeof obj !== "object" && typeof obj !== "function") || obj === null) {
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
console.log(myInstanceof(123, Number)); // 输出: false`
  },
  {
    id: "deepClone",
    title: "深拷贝对象",
    description: "实现深拷贝函数，可以复制对象及其内部的所有属性和值，包括嵌套对象和数组，支持日期和正则表达式。",
    code: `/**
 * @description 深拷贝一个对象
 * @param {any} obj - 需要深拷贝的对象
 * @returns {any} 深拷贝后的对象
 */
function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (let i = 0; i < obj.length; i++) {
      newArr[i] = deepClone(obj[i]);
    }
    return newArr;
  }

  const newObj = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key]);
    }
  }
  return newObj;
}

// 使用示例
const original = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4],
    e: { f: 5 }
  },
  g: /\\d+/gi,
  h: new Date()
};

const cloned = deepClone(original);
console.log("original.b === cloned.b:", original.b === cloned.b); // false`
  },
  {
    id: "asyncLimit",
    title: "异步并发控制",
    description: "控制异步任务的并发数量，防止同时发起过多请求导致性能问题或服务器压力过大。",
    code: `/**
 * @description 简单版本：控制固定数量异步任务的并发执行
 * @param {number} limit - 最大并发数
 */
function simpleLimit(limit) {
  const queue = [];
  let activeCount = 0;

  const runNext = () => {
    if (queue.length === 0) return;

    if (activeCount < limit) {
      const { fn, resolve, reject } = queue.shift();
      activeCount++;

      Promise.resolve(fn())
        .then(resolve)
        .catch(reject)
        .finally(() => {
          activeCount--;
          runNext();
        });
    }
  };

  return (fn) => {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      runNext();
    });
  };
}

// 使用示例
const runTask = simpleLimit(2); // 最多同时执行2个任务

const createTask = (id, delay) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(\`任务\${id}完成，耗时\${delay}ms\`);
      resolve(\`任务\${id}的结果\`);
    }, delay);
  });
};

// 执行任务
runTask(createTask(1, 1000)).then((result) => console.log(result));
runTask(createTask(2, 2000)).then((result) => console.log(result));
runTask(createTask(3, 1500)).then((result) => console.log(result));`
  },
  {
    id: "lazyLoad",
    title: "图片懒加载",
    description: "实现图片懒加载功能，只有当图片进入可视区域时才开始加载，提高页面性能和用户体验。",
    code: `/**
 * @description 图片懒加载类
 */
class LazyLoad {
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

    this.throttledLoad = this.throttle(
      this.loadImages.bind(this),
      this.options.throttleDelay
    );
  }

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
      { threshold: this.options.threshold }
    );

    this.images.forEach((image) => {
      if (image.hasAttribute(this.options.dataSrc)) {
        this.observer.observe(image);
      }
    });
  }

  loadImage(image) {
    const src = image.getAttribute(this.options.dataSrc);
    if (!src) return;

    image.onload = () => {
      image.removeAttribute(this.options.dataSrc);
      image.classList.add("lazy-loaded");
    };

    image.onerror = () => {
      console.error(\`Failed to load image: \${src}\`);
    };

    image.src = src;
  }

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
}

// 使用示例
const lazyLoader = new LazyLoad({
  selector: '.lazy-image',
  dataSrc: 'data-src',
  threshold: 0.1
});
lazyLoader.init();`
  },
  {
    id: "setOperations",
    title: "Set 集合操作",
    description: "使用 ES6 Set 数据结构实现集合的交集、并集和差集操作。",
    code: `/**
 * @description Set集合操作：交集、并集和差集
 */

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// 并集 (Union)
const union = new Set([...a, ...b]);
console.log("并集:", union); // Set(4) {1, 2, 3, 4}

// 交集 (Intersection)
const intersection = new Set([...a].filter(x => b.has(x)));
console.log("交集:", intersection); // Set(2) {2, 3}

// 差集 (Difference) - a 中有但 b 中没有的元素
const difference = new Set([...a].filter(x => !b.has(x)));
console.log("差集 (a-b):", difference); // Set(1) {1}

// 对称差集 (Symmetric Difference) - 两个集合中不相交的元素
const symmetricDifference = new Set([
  ...[...a].filter(x => !b.has(x)),
  ...[...b].filter(x => !a.has(x))
]);
console.log("对称差集:", symmetricDifference); // Set(2) {1, 4}`
  },
  {
    id: "iframeDetection",
    title: "iframe 检测",
    description: "检测当前页面是否运行在 iframe 中，这在某些安全场景和功能判断中很有用。",
    code: `/**
 * @description 判断当前页面是否在 iframe 中
 */
const isInIframe = window.self !== window.top;

if (isInIframe) {
  console.log("当前页面被嵌入在 iframe 中");

  // 可以进行相应的处理
  document.body.style.backgroundColor = '#f0f0f0';

  // 或者阻止在 iframe 中运行
  // window.top.location = window.location;
} else {
  console.log("当前页面是顶级窗口");
}

// 更详细的检测
function getFrameInfo() {
  return {
    isInIframe: window.self !== window.top,
    frameDepth: (() => {
      let depth = 0;
      let win = window;
      while (win !== win.parent) {
        depth++;
        win = win.parent;
      }
      return depth;
    })(),
    parentOrigin: window.parent !== window ? document.referrer : null
  };
}

console.log("Frame 信息:", getFrameInfo());`
  },
  {
    id: "myReduce",
    title: "手写 Array.reduce",
    description: "手动实现 Array.prototype.reduce 方法，支持累加器函数和初始值参数。",
    code: `/**
 * @description 手写reduce函数实现
 */
Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const array = this;
  const length = array.length;
  let accumulator;
  let startIndex;

  if (arguments.length >= 2) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    if (length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  return accumulator;
};

// 使用示例
const numbers = [1, 2, 3, 4, 5];

// 求和
const sum = numbers.myReduce((acc, curr) => acc + curr, 0);
console.log("求和:", sum); // 15

// 求最大值
const max = numbers.myReduce((acc, curr) => Math.max(acc, curr));
console.log("最大值:", max); // 5

// 数组转对象
const fruits = ['apple', 'banana', 'orange'];
const fruitCounts = fruits.myReduce((acc, fruit, index) => {
  acc[fruit] = index + 1;
  return acc;
}, {});
console.log("数组转对象:", fruitCounts); // {apple: 1, banana: 2, orange: 3}`
  },
  {
    id: "fibonacciMemoized",
    title: "带记忆的斐波那契数列",
    description: "使用记忆化技术优化斐波那契数列的计算，避免重复计算，大幅提升性能。",
    code: `/**
 * @description 带记忆功能的斐波那契数列实现
 * @param {number} n - 需要计算的斐波那契数列位置
 * @return {number} 斐波那契数列第n项的值
 */
function fibonacciMemoized() {
  const cache = {};

  function fib(n) {
    if (n in cache) {
      return cache[n];
    }

    if (n <= 1) {
      return n;
    }

    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  }

  return fib;
}

// 使用示例
const fib = fibonacciMemoized();

console.time('计算斐波那契第40项');
console.log("fib(40) =", fib(40)); // 102334155
console.timeEnd('计算斐波那契第40项');

console.time('再次计算斐波那契第40项');
console.log("fib(40) =", fib(40)); // 从缓存获取，几乎瞬间完成
console.timeEnd('再次计算斐波那契第40项');

// 计算多个值
for (let i = 1; i <= 10; i++) {
  console.log(\`fib(\${i}) = \${fib(i)}\`);
}`
  },
  {
    id: "treeTraversal",
    title: "深度优先遍历和广度优先遍历",
    description: "实现树的深度优先遍历（DFS）和广度优先遍历（BFS）算法，用于遍历树形数据结构。",
    code: `/**
 * @description 树节点构造函数
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
  if (!node) return;

  callback(node.value);

  for (const child of node.children) {
    depthFirstTraversal(child, callback);
  }
}

/**
 * @description 广度优先遍历（BFS）
 * @param {TreeNode} root - 根节点
 * @param {function} callback - 处理节点的回调函数
 */
function breadthFirstTraversal(root, callback) {
  if (!root) return;

  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    callback(node.value);

    for (const child of node.children) {
      queue.push(child);
    }
  }
}

// 创建示例树
const root = new TreeNode("A");
const nodeB = new TreeNode("B");
const nodeC = new TreeNode("C");
const nodeD = new TreeNode("D");
const nodeE = new TreeNode("E");
const nodeF = new TreeNode("F");

root.children.push(nodeB, nodeC);
nodeB.children.push(nodeD, nodeE);
nodeC.children.push(nodeF);

// 测试遍历
console.log("DFS遍历结果:");
depthFirstTraversal(root, (value) => console.log(value));
// 输出: A B D E C F

console.log("BFS遍历结果:");
breadthFirstTraversal(root, (value) => console.log(value));
// 输出: A B C D E F`
  },
  {
    id: "arrayToTree",
    title: "数组转树形结构",
    description: "将扁平的数组数据转换为树形结构，常用于组织架构、菜单系统等场景。",
    code: `/**
 * @description 将扁平数组转换为树形结构
 * @param {Array} arr - 扁平数组
 * @returns {Array} 树形结构数组
 */
function arrayToTree(arr) {
  const nodeMap = new Map();

  // 建立节点映射
  arr.forEach((item) => {
    nodeMap.set(item.id, { ...item, children: [] });
  });

  const tree = [];

  arr.forEach((item) => {
    if (item.pid === null || item.pid === undefined || item.pid === "") {
      // 根节点
      tree.push(nodeMap.get(item.id));
    } else {
      // 子节点
      const parent = nodeMap.get(item.pid);
      if (parent) {
        parent.children.push(nodeMap.get(item.id));
      }
    }
  });

  return tree;
}

// 使用示例
const data = [
  { id: "01", name: "张大大", pid: "", job: "项目经理" },
  { id: "02", name: "小亮", pid: "01", job: "产品leader" },
  { id: "03", name: "小美", pid: "01", job: "UIleader" },
  { id: "04", name: "老马", pid: "01", job: "技术leader" },
  { id: "05", name: "老王", pid: "01", job: "测试leader" },
  { id: "07", name: "小丽", pid: "02", job: "产品经理" },
  { id: "08", name: "大光", pid: "02", job: "产品经理" },
  { id: "09", name: "小高", pid: "03", job: "UI设计师" },
  { id: "10", name: "小刘", pid: "04", job: "前端工程师" },
  { id: "11", name: "小华", pid: "04", job: "后端工程师" }
];

const tree = arrayToTree(data);
console.log("树形结构:", JSON.stringify(tree, null, 2));`
  },
  {
    id: "sensitiveInfoMask",
    title: "敏感信息脱敏",
    description: "对手机号、身份证号等敏感信息进行脱敏处理，保护用户隐私。",
    code: `/**
 * @description 敏感信息脱敏处理
 */

// 手机号脱敏（中间4位替换为****）
function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

// 身份证号脱敏（中间部分替换为****）
function maskIdCard(idCard) {
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, "$1********$2");
}

// 邮箱脱敏（用户名部分脱敏）
function maskEmail(email) {
  return email.replace(/(.{2}).+(.{2}@.+)/, "$1****$2");
}

// 银行卡号脱敏（保留前4位和后4位）
function maskBankCard(cardNumber) {
  return cardNumber.replace(/(\d{4})\d+(\d{4})/, "$1 **** **** $2");
}

// 姓名脱敏（保留姓氏）
function maskName(name) {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

// 使用示例
console.log("手机号脱敏:", maskPhone("13812345678")); // 138****5678
console.log("身份证脱敏:", maskIdCard("110101199003071234")); // 110101********1234
console.log("邮箱脱敏:", maskEmail("zhangsan@example.com")); // zh****an@example.com
console.log("银行卡脱敏:", maskBankCard("6225881234567890")); // 6225 **** **** 7890
console.log("姓名脱敏:", maskName("李小明")); // 李*明`
  },
  {
    id: "urlParser",
    title: "URL 参数解析",
    description: "解析 URL 中的查询参数，支持数组参数和 URL 编码解码。",
    code: `/**
 * @description URL参数解析
 */

// 方法1：使用正则表达式手动解析
function parseUrlParams(url) {
  const params = {};
  const queryString = url.split("?")[1] || "";
  const pairs = queryString.split("#")[0].split("&");

  for (const pair of pairs) {
    if (!pair) continue;

    let [key, value] = pair.split("=");
    value = value === undefined ? "" : value;

    key = decodeURIComponent(key.replace(/\+/g, " "));
    value = decodeURIComponent(value.replace(/\+/g, " "));

    // 处理多个相同键的情况
    if (params.hasOwnProperty(key)) {
      params[key] = [].concat(params[key], value);
    } else {
      params[key] = value;
    }
  }

  return params;
}

// 方法2：使用 URLSearchParams API（现代浏览器）
function parseUrlParamsModern(url) {
  const urlObj = new URL(url);
  const params = {};

  for (const [key, value] of urlObj.searchParams.entries()) {
    if (params.hasOwnProperty(key)) {
      params[key] = [].concat(params[key], value);
    } else {
      params[key] = value;
    }
  }

  return params;
}

// 使用示例
const testUrl = "https://example.com/page?name=%E5%B0%8F%E6%98%8E&age=20&hobby=reading&hobby=music&active";

console.log("手动解析:", parseUrlParams(testUrl));
// 输出: { name: '小明', age: '20', hobby: ['reading', 'music'], active: '' }

console.log("现代API解析:", parseUrlParamsModern(testUrl));
// 输出: { name: '小明', age: '20', hobby: ['reading', 'music'], active: '' }

// 获取单个参数的便捷方法
function getUrlParam(url, paramName) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(paramName);
}

console.log("获取name参数:", getUrlParam(testUrl, "name")); // 小明`
  }
];