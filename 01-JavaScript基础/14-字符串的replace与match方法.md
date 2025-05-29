# 字符串的replace与match方法

## 概念介绍

JavaScript的`String`原型提供了`replace`和`match`两个核心方法，分别用于字符串替换和模式匹配。它们是处理文本操作的重要工具，广泛应用于数据清洗、格式校验、内容替换等场景。

## 基本语法

### 1. String.prototype.replace()

**作用**：替换字符串中的匹配项，可以是普通字符串或正则表达式匹配的内容。

**语法**：
```javascript
str.replace(regexp|substr, newSubstr|function)
```

- **参数1**：可以是正则表达式（`RegExp`）或要替换的子字符串（`String`）。
- **参数2**：可以是替换的新字符串（`String`）或用于生成替换内容的函数（`Function`）。

### 2. String.prototype.match()

**作用**：检索字符串中匹配正则表达式的结果，返回匹配的数组或`null`。

**语法**：
```javascript
str.match(regexp)
```

- **参数**：正则表达式对象（`RegExp`）。若传入非正则表达式，会隐式转换为`RegExp`。

## 核心特性

### replace() 的高级用法

#### （1）正则表达式与全局匹配

使用正则表达式的`g`标志可实现全局替换，`i`标志可忽略大小写：
```javascript
const str = 'Hello, hello!';
// 全局替换（不区分大小写）
const replaced = str.replace(/hello/gi, 'Hi');
console.log(replaced); // 输出: 'Hi, Hi!' 
```

#### （2）替换函数

通过传入函数，可动态生成替换内容，函数参数为匹配到的子串、捕获组等：
```javascript
const priceStr = 'Price: $100, $200';
// 将美元价格转换为欧元（假设汇率1:0.9）
const euroStr = priceStr.replace(/\$\d+/g, (match) => {
  const num = parseInt(match.slice(1));
  return `€${(num * 0.9).toFixed(2)}`;
});
console.log(euroStr); // 输出: 'Price: €90.00, €180.00'
```

### match() 的匹配结果

- 若正则无`g`标志，返回包含完整匹配和捕获组的数组，并带有`index`和`input`属性。
- 若有`g`标志，仅返回所有匹配的子串数组（无捕获组信息）。

```javascript
const str = '日期：2023-10-01，2024-05-15';
const regexWithoutG = /(\d{4})-(\d{2})-(\d{2})/;
const regexWithG = /(\d{4})-(\d{2})-(\d{2})/g;

console.log(str.match(regexWithoutG));
// 输出: [ '2023-10-01', '2023', '10', '01', index: 3, input: '日期：2023-10-01，2024-05-15' ]

console.log(str.match(regexWithG));
// 输出: [ '2023-10-01', '2024-05-15' ]
```

## 实战案例

### 案例1：敏感信息脱敏（replace）

将手机号中间4位替换为`****`：
```javascript
function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
console.log(maskPhone('13812345678')); // 输出: '138****5678'
```

### 案例2：提取HTML标签内容（match）

从HTML字符串中提取所有`<a>`标签的链接：
```javascript
const html = '<p>链接：<a href=