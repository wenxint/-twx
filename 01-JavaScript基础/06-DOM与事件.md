# DOM与事件

## DOM基础

### DOM的概念
DOM（Document Object Model，文档对象模型）是HTML和XML文档的编程接口。它提供了对文档的结构化表示，并定义了一种方式可以使程序对该结构进行访问和修改。DOM将网页表示为一个树形结构，其中每个节点都是页面的一部分（如元素、属性或文本等）。

### DOM树的结构
```html
<!DOCTYPE html>
<html>
<head>
    <title>DOM示例</title>
</head>
<body>
    <div id="container">
        <h1>DOM树结构</h1>
        <p>这是一个<span>示例</span>段落</p>
    </div>
</body>
</html>
```

上述HTML对应的DOM树结构如下：
- Document
  - DOCTYPE
  - html (根元素)
    - head
      - title
        - "DOM示例" (文本节点)
    - body
      - div#container
        - h1
          - "DOM树结构" (文本节点)
        - p
          - "这是一个" (文本节点)
          - span
            - "示例" (文本节点)
          - "段落" (文本节点)

### 节点类型
在DOM中，有多种类型的节点：

1. **元素节点**：对应HTML标签，如`<div>`、`<p>`等
2. **文本节点**：包含文本内容
3. **属性节点**：元素的属性，如`id`、`class`等
4. **注释节点**：HTML中的注释
5. **文档节点**：整个文档（根节点）

常用节点类型常量：
```javascript
Node.ELEMENT_NODE // 1
Node.TEXT_NODE // 3
Node.COMMENT_NODE // 8
Node.DOCUMENT_NODE // 9
```

### 节点关系
DOM树中的节点之间存在各种关系：

- **父子关系**：直接包含与被包含的关系
- **兄弟关系**：拥有相同父节点的节点之间的关系
- **祖先后代关系**：直接或间接包含的关系

访问这些关系的属性：
```javascript
// 父节点关系
node.parentNode
node.parentElement

// 子节点关系
node.childNodes // 所有子节点的NodeList
node.children // 所有元素子节点的HTMLCollection
node.firstChild // 第一个子节点
node.lastChild // 最后一个子节点
node.firstElementChild // 第一个元素子节点
node.lastElementChild // 最后一个元素子节点

// 兄弟节点关系
node.previousSibling // 前一个兄弟节点
node.nextSibling // 后一个兄弟节点
node.previousElementSibling // 前一个元素兄弟节点
node.nextElementSibling // 后一个元素兄弟节点
```

## DOM操作

### 查找元素
```javascript
// 通过ID查找
const elementById = document.getElementById('container');

// 通过类名查找
const elementsByClass = document.getElementsByClassName('item'); // 返回HTMLCollection

// 通过标签名查找
const elementsByTag = document.getElementsByTagName('div'); // 返回HTMLCollection

// 通过CSS选择器查找
const elementBySelector = document.querySelector('.item'); // 返回第一个匹配元素
const elementsBySelectorAll = document.querySelectorAll('.item'); // 返回NodeList

// 特殊元素
document.documentElement // <html>元素
document.body // <body>元素
document.head // <head>元素
```

### 创建元素
```javascript
// 创建元素节点
const div = document.createElement('div');

// 创建文本节点
const text = document.createTextNode('Hello World');

// 创建注释节点
const comment = document.createComment('这是一个注释');

// 创建文档片段（高效批量操作）
const fragment = document.createDocumentFragment();
```

### 插入元素
```javascript
// 添加子节点
parent.appendChild(child);

// 在参考节点之前插入
parent.insertBefore(newNode, referenceNode);

// 现代API - 更加灵活
parent.append(...nodes); // 在末尾添加多个节点
parent.prepend(...nodes); // 在开头添加多个节点
node.before(...nodes); // 在节点之前添加多个节点
node.after(...nodes); // 在节点之后添加多个节点
node.replaceWith(...nodes); // 替换节点
```

### 删除元素
```javascript
// 删除子节点
parent.removeChild(child);

// 现代API
node.remove(); // 删除节点本身
```

### 修改元素
```javascript
// 修改内容
element.textContent = '新文本内容'; // 纯文本内容
element.innerHTML = '<span>新HTML内容</span>'; // HTML内容（注意XSS风险）
element.innerText = '新显示文本'; // 显示的文本

// 修改属性
element.setAttribute('class', 'new-class');
element.getAttribute('class');
element.removeAttribute('class');
element.hasAttribute('class');

// 直接访问常见属性
element.id = 'new-id';
element.className = 'new-class';
element.classList.add('item');
element.classList.remove('item');
element.classList.toggle('active');
element.classList.contains('item');

// 修改样式
element.style.color = 'red';
element.style.backgroundColor = 'black';
element.style.cssText = 'color: red; background-color: black;';

// 获取计算样式（只读）
const computedStyle = getComputedStyle(element);
computedStyle.color; // "rgb(255, 0, 0)"
```

### 性能优化
操作DOM是昂贵的，可能导致重排和重绘。以下是一些优化技巧：

1. **减少DOM操作次数**
   ```javascript
   // 优化前
   for (let i = 0; i < 1000; i++) {
     container.appendChild(document.createElement('div'));
   }

   // 优化后 - 使用文档片段
   const fragment = document.createDocumentFragment();
   for (let i = 0; i < 1000; i++) {
     fragment.appendChild(document.createElement('div'));
   }
   container.appendChild(fragment);
   ```

2. **批量修改样式**
   ```javascript
   // 优化前
   element.style.color = 'red';
   element.style.backgroundColor = 'black';
   element.style.fontSize = '16px';

   // 优化后
   element.classList.add('styled-element'); // 使用CSS类
   // 或者
   element.style.cssText = 'color: red; background-color: black; font-size: 16px;';
   ```

3. **避免布局抖动**
   ```javascript
   // 引起布局抖动的代码（不推荐）
   for (let i = 0; i < elements.length; i++) {
     elements[i].style.width = elements[i].offsetWidth + 10 + 'px';
   }

   // 优化后
   const widths = [];
   for (let i = 0; i < elements.length; i++) {
     widths[i] = elements[i].offsetWidth;
   }
   for (let i = 0; i < elements.length; i++) {
     elements[i].style.width = widths[i] + 10 + 'px';
   }
   ```

4. **使用文档位置外操作**
   ```javascript
   // 临时从DOM中移除元素进行操作
   const parent = element.parentNode;
   const nextSibling = element.nextSibling;
   parent.removeChild(element);

   // 执行大量DOM操作
   // ...

   // 重新插入DOM
   if (nextSibling) {
     parent.insertBefore(element, nextSibling);
   } else {
     parent.appendChild(element);
   }
   ```

## 事件机制

### 事件流
DOM事件流描述了事件在DOM树中传播的顺序。事件传播有三个阶段：

1. **捕获阶段**：事件从`window`到目标元素的父元素
2. **目标阶段**：事件到达目标元素
3. **冒泡阶段**：事件从目标元素的父元素冒泡到`window`

![事件流](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling_and_capture/bubbling-capturing.png)

```javascript
// 默认在冒泡阶段触发
element.addEventListener('click', handler);

// 在捕获阶段触发
element.addEventListener('click', handler, true);
// 或
element.addEventListener('click', handler, { capture: true });
```

### 事件绑定
有三种为元素添加事件处理程序的方式：

1. **HTML属性（不推荐）**
   ```html
   <button onclick="alert('点击了')">点击我</button>
   ```

2. **DOM属性**
   ```javascript
   element.onclick = function(event) {
     console.log('点击了');
   };
   ```

   注意：这种方式一个事件只能绑定一个处理程序，新的会覆盖旧的。

3. **addEventListener方法（推荐）**
   ```javascript
   element.addEventListener('click', function(event) {
     console.log('点击了');
   });

   // 添加多个处理程序
   element.addEventListener('click', handler1);
   element.addEventListener('click', handler2);

   // 移除处理程序（注意必须是相同的函数引用）
   element.removeEventListener('click', handler1);
   ```

### 事件对象
当事件触发时，会传递一个事件对象给事件处理程序，包含了与事件相关的信息。

```javascript
element.addEventListener('click', function(event) {
  console.log(event.type); // "click"
  console.log(event.target); // 事件触发的元素（原始目标节点）
  console.log(event.currentTarget); // 事件处理程序所在的元素（当前绑定事件的节点）

### e.target 与 e.currentTarget 的核心区别
- **e.target**：触发事件的原始元素，即用户实际交互的元素（如点击按钮时，target是按钮本身）
- **e.currentTarget**：绑定事件处理程序的元素（如事件绑定在父div上时，currentTarget是div）

**典型场景示例**：
```html
<div id="parent">
  <button id="child">点击我</button>
</div>
```
```javascript
// 事件绑定在父div上
document.getElementById('parent').addEventListener('click', function(e) {
  console.log('e.target:', e.target.id);       // 输出"child"（实际点击的按钮）
  console.log('e.currentTarget:', e.currentTarget.id); // 输出"parent"（绑定事件的div）
});
```

**关键总结**：target是事件的"起点"，currentTarget是事件的"终点"（绑定位置）。当事件处理程序直接绑定在目标元素上时，两者指向相同；当事件委托到父元素时，两者指向不同元素。
  console.log(event.clientX, event.clientY); // 鼠标事件的坐标
});
```

常用的事件对象属性和方法：

- **通用属性**
  - `event.type`: 事件类型
  - `event.target`: 触发事件的元素
  - `event.currentTarget`: 事件处理程序所在的元素
  - `event.timeStamp`: 事件创建时的时间戳
  - `event.bubbles`: 指示事件是否冒泡
  - `event.cancelable`: 指示事件是否可以取消默认行为

- **通用方法**
  - `event.preventDefault()`: 阻止默认行为
  - `event.stopPropagation()`: 阻止事件冒泡
  - `event.stopImmediatePropagation()`: 阻止事件冒泡并阻止同一元素上其他事件处理程序的执行

- **鼠标事件特有属性**
  - `event.clientX/Y`: 相对于浏览器视口的坐标
  - `event.pageX/Y`: 相对于文档的坐标（包括滚动）
  - `event.screenX/Y`: 相对于屏幕的坐标
  - `event.button`: 按下的鼠标按钮
  - `event.altKey/ctrlKey/shiftKey/metaKey`: 修饰键状态

- **键盘事件特有属性**
  - `event.key`: 按键的值
  - `event.code`: 物理按键的代码
  - `event.keyCode`: 按键的ASCII码（已弃用）
  - `event.altKey/ctrlKey/shiftKey/metaKey`: 修饰键状态

### 事件委托
事件委托是一种常用的事件处理模式，利用事件冒泡机制，将事件处理程序设置在父元素上，而不是每个子元素上。

**优点**：
- 减少事件处理程序的数量，提升性能
- 动态添加的元素无需额外绑定事件

```javascript
// 不使用事件委托
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
  button.addEventListener('click', function() {
    console.log('按钮被点击了');
  });
});

// 使用事件委托
document.querySelector('.buttons-container').addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    console.log('按钮被点击了');
  }
});
```

### 常见事件类型

#### 鼠标事件
- **click**: 单击
- **dblclick**: 双击
- **mousedown**: 鼠标按下
- **mouseup**: 鼠标释放
- **mousemove**: 鼠标移动
- **mouseover**: 鼠标进入元素
- **mouseout**: 鼠标离开元素
- **mouseenter**: 鼠标进入元素（不冒泡）
- **mouseleave**: 鼠标离开元素（不冒泡）

#### 键盘事件
- **keydown**: 键盘按下
- **keyup**: 键盘释放
- **keypress**: 键盘按下（已弃用）

#### 表单事件
- **submit**: 表单提交
- **reset**: 表单重置
- **change**: 表单元素的值改变并失去焦点
- **input**: 表单元素的值改变（实时）
- **focus**: 获得焦点
- **blur**: 失去焦点

#### 文档事件
- **DOMContentLoaded**: HTML文档解析完成（不等待样式表、图片等外部资源）
- **load**: 页面及所有资源加载完成
- **unload**: 页面卸载
- **beforeunload**: 页面即将卸载（可以提示用户确认）
- **resize**: 窗口大小改变
- **scroll**: 滚动

#### 触摸事件
- **touchstart**: 触摸开始
- **touchmove**: 触摸移动
- **touchend**: 触摸结束
- **touchcancel**: 触摸取消

### 自定义事件
可以创建和分发自定义事件：

```javascript
// 创建自定义事件
const customEvent = new CustomEvent('myEvent', {
  detail: { message: '这是自定义数据' },
  bubbles: true,
  cancelable: true
});

// 触发自定义事件
element.dispatchEvent(customEvent);

// 监听自定义事件
element.addEventListener('myEvent', function(event) {
  console.log(event.detail.message); // "这是自定义数据"
});
```

### 事件循环与异步
浏览器中的JavaScript是单线程的，事件处理是通过事件循环机制实现的：

1. 同步代码在主线程上执行
2. 异步任务（如事件回调、定时器、Promise等）进入任务队列
3. 主线程空闲时，从任务队列取出任务执行

事件处理程序是异步执行的，会在事件触发时被加入到任务队列中，等待主线程执行。

### 常见面试题

#### 1. 事件委托的原理及优缺点
**原理**：利用事件冒泡，将事件监听器设置在父元素上，通过判断`event.target`来处理子元素事件。

**优点**：
- 减少事件处理程序数量，提高性能
- 无需对动态添加的元素重新绑定事件
- 减少内存占用

**缺点**：
- 对不冒泡的事件无效（如focus、blur）
- 层级过深时可能影响性能
- 处理逻辑可能更复杂

#### 2. event.preventDefault() 和 event.stopPropagation() 的区别
- `event.preventDefault()`: 阻止元素的默认行为（如链接跳转、表单提交）
- `event.stopPropagation()`: 阻止事件冒泡到父元素

#### 3. 如何阻止事件冒泡和捕获
```javascript
// 阻止冒泡
element.addEventListener('click', function(event) {
  event.stopPropagation();
});

// 阻止所有后续事件处理程序
element.addEventListener('click', function(event) {
  event.stopImmediatePropagation();
});
```

#### 4. 事件执行顺序问题
```html
<div id="parent">
  <button id="child">点击</button>
</div>
```

```javascript
// 问题：点击按钮，输出顺序是什么？
document.getElementById('parent').addEventListener('click', () => console.log('父元素冒泡'), false);
document.getElementById('child').addEventListener('click', () => console.log('子元素冒泡'), false);
document.getElementById('parent').addEventListener('click', () => console.log('父元素捕获'), true);
document.getElementById('child').addEventListener('click', () => console.log('子元素捕获'), true);
```

**答案**：
1. 父元素捕获
2. 子元素捕获
3. 子元素冒泡
4. 父元素冒泡

#### 5. 如何自定义事件并触发
```javascript
// 创建事件
const event = new CustomEvent('myEvent', {
  detail: { message: '自定义数据' },
  bubbles: true
});

// 监听事件
element.addEventListener('myEvent', function(e) {
  console.log(e.detail.message);
});

// 触发事件
element.dispatchEvent(event);
```