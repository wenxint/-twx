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

/**
 * @description 测试用的三参数函数
 */
function add(a, b, c) {
  console.log(`计算: ${a} + ${b} + ${c} = ${a + b + c}`);
  return a + b + c;
}

// 对add函数进行柯里化
const curriedAdd = curry(add);

console.log('curry函数执行完毕，返回了curriedAdd函数');

console.log(curriedAdd(1)(2)(3));
