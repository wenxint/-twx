// 引入调试辅助函数（如果在同一文件中可以直接使用）
// const { debugWhen, debugOnCondition } = require('./debug_helper.js');

/**
 * 调试辅助函数 - 快速检测特定数组状态
 */
function debugWhen(currentArray, targetArray, label = '调试点') {
  if (JSON.stringify(currentArray) === JSON.stringify(targetArray)) {
    console.log(`🚀 ${label}:`, currentArray);
    debugger; // 触发断点
    return true;
  }
  return false;
}

/**
 * @description 使用回溯算法生成数组的全排列
 * @param {number[]} nums - 输入数组
 * @return {number[][]} 所有可能的排列
 */
function permute(nums) {
  const res = [];                                    // 存储所有排列结果
  const used = new Array(nums.length).fill(false);  // 标记数字是否被使用

  /**
   * 回溯函数
   * @param {number[]} path - 当前构建的排列路径
   */
  function backtrack(path) {
    // 🎯 调试：检测特定路径（更简洁的方式）
    debugWhen(path, [2, 1, 3], '找到目标排列');

    // 你也可以同时检测多个状态
    // debugWhen(path, [2, 1], '中间状态：以2,1开始');
    // debugWhen(path, [1, 2, 3], '另一个目标排列');

    // 终止条件：当前路径长度等于原数组长度
    if (path.length === nums.length) {
      res.push([...path]); // 复制当前路径并加入结果
      return;
    }

    // 遍历所有可能的选择
    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {        // 如果当前数字未被使用
        used[i] = true;      // 标记为已使用
        path.push(nums[i]);  // 将数字加入当前路径
        backtrack(path);     // 递归探索下一层
       let a= path.pop();          // 撤销选择（回溯）
        // console.log(path.pop());
        console.log(a);
        used[i] = false;     // 恢复未使用状态
        console.log(used);
      }
    }
  }

  backtrack([]);
  return res;
}

console.log(permute([1, 2, 3]));




















// function wrongPermute(nums) {
//   const res = [];

//   function backtrack(path) {
//     if (path.length === nums.length) {
//       res.push([...path]);
//       return;
//     }

//     for (let i = 0; i < nums.length; i++) {
//       path.push(nums[i]);  // 直接添加，可能重复使用同一个数字
//       backtrack(path);
//       path.pop();
//     }
//   }

//   backtrack([]);
//   return res;
// }

// // 结果会包含重复使用同一位置数字的排列，如[1,1,1]
// console.log(wrongPermute([1, 2, 3]));
