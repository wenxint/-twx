/**
 * 递归模板字符串函数演示
 *
 * 这个文件展示了一个修复后的递归模板字符串标签函数
 */

/**
 * 修复后的递归模板字符串标签函数
 *
 * @param {Array} strings - 模板字符串的静态部分数组
 * @param {...any} values - 模板字符串中插值表达式的值
 * @returns {string} 处理后的HTML字符串
 */
function recursiveTemplate(strings, ...values) {
  return strings.reduce((result, str, i) => {
    // 如果已经处理完所有值，只添加剩余字符串
    if (i >= values.length) {
      return result + str;
    }

    const value = values[i];

    // 递归处理数组，确保生成正确的HTML列表项
    if (Array.isArray(value)) {
      const listItems = value.map(item => {
        if (item === null || item === undefined) {
          return '<li>null</li>';
        } else if (typeof item === 'object') {
          return `<li>${JSON.stringify(item)}</li>`;
        } else {
          return `<li>${item}</li>`;
        }
      }).join('');
      return result + str + listItems;
    }

    // 处理对象，但需要排除null并确保值是真正的对象
    if (value !== null && typeof value === 'object') {
      const properties = Object.entries(value).map(([key, val]) => {
        // 处理嵌套对象和数组
        if (val === null || val === undefined) {
          return `<div>${key}: null</div>`;
        } else if (typeof val === 'object') {
          return `<div>${key}: ${JSON.stringify(val)}</div>`;
        } else {
          return `<div>${key}: ${val}</div>`;
        }
      }).join('');
      return result + str + properties;
    }

    // 处理null和undefined值
    const displayValue = value === null || value === undefined ? '' : value;
    return result + str + displayValue;
  }, '');
}

// 测试用例1: 基本类型
console.log('===== 基本类型测试 =====');
console.log(recursiveTemplate`数字: ${123} 布尔值: ${true}`);
console.log(recursiveTemplate`空值: ${null} 未定义: ${undefined}`);

// 测试用例2: 对象和数组
console.log('\n===== 对象和数组测试 =====');
const user = { name: '张三', age: 30 };
const hobbies = ['阅读', '编程', { type: '运动', name: '网球' }];

console.log('用户对象:');
console.log(recursiveTemplate`${user}`);

console.log('\n爱好数组:');
console.log(recursiveTemplate`${hobbies}`);

// 测试用例3: 完整HTML模板
console.log('\n===== 完整HTML模板测试 =====');
const template = recursiveTemplate`
<div class="user-card">
  <h2>用户信息</h2>
  <div class="details">
    ${user}
  </div>
  <h3>爱好</h3>
  <ul>
    ${hobbies}
  </ul>
</div>
`;

console.log(template);