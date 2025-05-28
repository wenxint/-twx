# Sass常用语法规则

> Sass（Syntactically Awesome Stylesheets）是世界上最成熟、最稳定、最强大的CSS扩展语言之一，通过增加变量、嵌套、混合、继承等特性，极大提升了CSS的可维护性和开发效率。

## 概念介绍

Sass提供两种语法格式：
- **Sass**：缩进式语法（无大括号和分号），适合追求简洁的开发者
- **SCSS**：CSS超集语法（完全兼容CSS），是当前主流选择

本文以SCSS语法为基础，介绍其核心语法规则。

## 基本语法

### 1. 变量（Variables）

使用`$`符号声明变量，支持重复使用和作用域规则：

```scss
// 基础变量
$primary-color: #007bff;  // 主题色
$base-font-size: 16px;   // 基础字号

// 嵌套作用域变量
.container {
  $inner-padding: 20px;
  padding: $inner-padding;
}

// 全局变量（!global）
.sidebar {
  $sidebar-width: 300px !global;
  width: $sidebar-width;
}

.main {
  margin-left: $sidebar-width;  // 可以访问全局变量
}
```

### 2. 嵌套（Nesting）

支持选择器嵌套和属性嵌套，减少重复代码：

```scss
// 选择器嵌套
nav {
  ul {
    margin: 0;
    li {
      list-style: none;
      a {
        color: $primary-color;
        &:hover { text-decoration: underline; }
      }
    }
  }
}

// 属性嵌套（以border为例）
.box {
  border: {
    width: 1px;
    style: solid;
    color: #ddd;
  }
}
```

## 核心特性

### 3. 混合（Mixin）

使用`@mixin`定义可复用的样式块，通过`@include`调用：

```scss
// 定义带参数的混合
@mixin responsive-container($max-width: 1200px) {
  width: 100%;
  max-width: $max-width;
  margin: 0 auto;
  padding: 0 15px;
}

// 调用混合
.container {
  @include responsive-container();
}

// 带媒体查询的混合
@mixin mobile-only {
  @media (max-width: 768px) {
    @content;  // 插入调用时的内容
  }
}

.button {
  @include mobile-only {
    font-size: 14px;
    padding: 8px 12px;
  }
}
```

### 4. 继承（Extend）

通过`@extend`共享已有选择器的样式：

```scss
// 基础按钮样式
%button-base {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

// 继承基础样式
.primary-btn {
  @extend %button-base;
  background: $primary-color;
  color: white;
}

.secondary-btn {
  @extend %button-base;
  background: #6c757d;
  color: white;
}
```

### 5. 运算与函数

支持数值、颜色、字符串的运算和内置函数：

```scss
// 数值运算
$grid-gap: 20px;
.col-6 {
  width: (100% - $grid-gap) / 2;
}

// 颜色函数
$hover-color: darken($primary-color, 10%);

// 字符串拼接
$icon-prefix: 'icon-';
.icon-close {
  background: url('#{$icon-prefix}close.png');
}
```

## 实战案例

### 主题色管理

```scss
// _variables.scss
$themes: (
  default: (#007bff, #fff),
  success: (#28a745, #fff),
  danger: (#dc3545, #fff)
);

// _buttons.scss
@each $name, $colors in $themes {
  .btn-#{$name} {
    background: nth($colors, 1);
    color: nth($colors, 2);
    &:hover {
      background: darken(nth($colors, 1), 5%);
    }
  }
}

// 使用
<button class="btn-default">默认按钮</button>
<button class="btn-success">成功按钮</button>
```

## 兼容性说明

Sass需要通过构建工具（如Webpack、Gulp）编译为标准CSS后才能在浏览器中使用。现代浏览器对编译后的CSS无兼容性问题，旧版浏览器（如IE9以下）需注意部分CSS特性的支持情况。

## 面试常见问题

### 1. Sass和SCSS有什么区别？

- Sass：缩进语法（无{}和;），语法更简洁但学习成本稍高
- SCSS：完全兼容CSS的大括号语法，是当前主流选择

### 2. @mixin和@extend的使用场景？

- @mixin：适合需要传递参数、包含复杂逻辑（如媒体查询）的场景
- @extend：适合共享静态样式规则，生成更简洁的CSS代码

### 3. 如何避免Sass编译后的CSS体积过大？

- 减少不必要的嵌套层级
- 避免过度使用@extend（可能导致选择器连锁）
- 使用占位符选择器（%）代替类选择器进行继承
- 合理使用@include的参数默认值减少重复声明