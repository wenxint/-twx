# Sass常用语法规则

> Sass（Syntactically Awesome Stylesheets）是世界上最成熟、最稳定、最强大的CSS扩展语言之一，它通过增加变量、嵌套、混合、继承、控制指令等特性，极大提升了CSS的可维护性和开发效率。

## 概念介绍

Sass是一种CSS预处理器，诞生于2006年，由Hampton Catlin设计，后由Natalie Weizenbaum主要开发。它为CSS增加了编程语言的特性，使得样式表更加强大和灵活。

### 两种语法格式对比

Sass提供两种语法格式，各有优势：

**1. Sass语法（缩进式）**
```sass
// 变量定义
$primary-color: #007bff
$base-font-size: 16px

// 嵌套结构
.navbar
  background: $primary-color
  ul
    margin: 0
    padding: 0
    li
      list-style: none
      a
        color: white
        text-decoration: none
        &:hover
          text-decoration: underline
```

**2. SCSS语法（CSS超集）**
```scss
/**
 * @description SCSS语法示例 - 完全兼容CSS
 */
// 变量定义
$primary-color: #007bff;
$base-font-size: 16px;

// 嵌套结构
.navbar {
  background: $primary-color;

  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;

      a {
        color: white;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
```

**语法对比表格**：

| 特性 | Sass语法 | SCSS语法 | 推荐场景 |
|------|----------|----------|----------|
| 兼容性 | 不兼容CSS | 完全兼容CSS | SCSS适合团队协作 |
| 语法简洁性 | 更简洁 | 需要大括号和分号 | Sass适合个人项目 |
| 学习成本 | 需要适应新语法 | 几乎无学习成本 | SCSS适合初学者 |
| 文件扩展名 | .sass | .scss | 当前主流选择SCSS |

### Sass的核心优势

1. **变量管理**：集中管理颜色、字体、尺寸等设计要素
2. **代码复用**：通过混合器（mixin）和继承减少重复代码
3. **逻辑控制**：支持条件语句、循环等编程特性
4. **模块化**：通过导入功能实现样式的模块化管理
5. **数学运算**：支持数值和颜色的计算操作

## 基本语法

### 1. 变量（Variables）

变量是Sass最基础也是最重要的特性，使用`$`符号声明。

#### 基础变量类型

```scss
/**
 * @description Sass变量类型演示
 */

// 1. 颜色变量
$primary-color: #007bff;          // 十六进制
$secondary-color: rgb(108, 117, 125); // RGB函数
$success-color: hsl(134, 61%, 41%);   // HSL函数

// 2. 数值变量
$base-font-size: 16px;            // 像素值
$line-height: 1.5;                // 无单位数值
$container-width: 100%;           // 百分比
$border-radius: 0.25rem;          // rem单位

// 3. 字符串变量
$font-family: 'Helvetica Neue', Arial, sans-serif;
$image-path: '/assets/images/';
$font-weight-bold: bold;

// 4. 布尔值
$enable-rounded: true;
$enable-shadows: false;

// 5. 空值
$custom-margin: null;

// 6. 列表（类似数组）
$font-sizes: 12px, 14px, 16px, 18px, 24px;
$margin-sizes: 0, 0.25rem, 0.5rem, 1rem, 2rem;

// 7. 映射（类似对象）
$theme-colors: (
  primary: #007bff,
  secondary: #6c757d,
  success: #28a745,
  danger: #dc3545,
  warning: #ffc107,
  info: #17a2b8
);
```

#### 变量作用域和默认值

```scss
/**
 * @description 变量作用域管理示例
 */

// 全局变量
$global-color: #333 !default; // !default表示如果变量已定义则不覆盖

// 局部作用域
.component {
  $local-color: #666; // 局部变量
  color: $local-color;

  .nested {
    // 访问外层变量
    border-color: $local-color;
  }
}

// 强制全局变量
.sidebar {
  $sidebar-width: 300px !global; // 使局部变量变为全局
  width: $sidebar-width;
}

.main-content {
  margin-left: $sidebar-width; // 可以访问上面定义的全局变量
}

// 变量插值（Interpolation）
$prefix: 'app';
$property: 'margin';

.#{$prefix}-container {
  #{$property}-top: 20px;
  background-image: url('#{$image-path}logo.png');
}

// 编译结果：
// .app-container {
//   margin-top: 20px;
//   background-image: url('/assets/images/logo.png');
// }
```

### 2. 嵌套（Nesting）

嵌套是Sass的核心特性，让CSS结构更加清晰和易维护。

#### 选择器嵌套

```scss
/**
 * @description 选择器嵌套完整示例
 */

// 基础嵌套
.navbar {
  background: $primary-color;
  padding: 1rem;

  // 后代选择器
  .nav-brand {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }

  .nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;

    .nav-item {
      margin-right: 1rem;

      .nav-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;

        // 父选择器引用 &
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &:active {
          background-color: rgba(255, 255, 255, 0.2);
        }

        // 修饰符类
        &.active {
          background-color: rgba(255, 255, 255, 0.15);
          font-weight: bold;
        }

        // 组合父选择器
        .dark-theme & {
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  // 响应式嵌套
  @media (max-width: 768px) {
    padding: 0.5rem;

    .nav-menu {
      flex-direction: column;

      .nav-item {
        margin-right: 0;
        margin-bottom: 0.5rem;
      }
    }
  }
}

// 编译后的CSS会自动展开嵌套结构
```

#### 属性嵌套

```scss
/**
 * @description 属性嵌套演示
 */

.card {
  // 普通属性嵌套
  border: {
    width: 1px;
    style: solid;
    color: #dee2e6;
    radius: 0.375rem;
  }

  // 简写属性嵌套
  margin: {
    top: 1rem;
    bottom: 1rem;
    left: auto;
    right: auto;
  }

  // 字体属性嵌套
  font: {
    family: $font-family;
    size: $base-font-size;
    weight: normal;
    style: normal;
  }

  // 背景属性嵌套
  background: {
    color: white;
    image: url('texture.png');
    repeat: no-repeat;
    position: center center;
    size: cover;
  }
}

// 编译结果：
// .card {
//   border-width: 1px;
//   border-style: solid;
//   border-color: #dee2e6;
//   border-radius: 0.375rem;
//   margin-top: 1rem;
//   margin-bottom: 1rem;
//   margin-left: auto;
//   margin-right: auto;
//   /* ... 其他属性 */
// }
```

#### 嵌套注意事项

```scss
/**
 * @description 嵌套最佳实践和注意事项
 */

// ❌ 避免过深嵌套（超过3-4层）
.header {
  .navigation {
    .menu {
      .item {
        .link {
          .icon {
            // 嵌套过深，难以维护
            color: red;
          }
        }
      }
    }
  }
}

// ✅ 推荐的嵌套深度
.header {
  .navigation {
    background: $primary-color;
  }
}

.nav-menu {
  .nav-item {
    margin: 0.5rem;

    .nav-link {
      color: $primary-color;
    }
  }
}

// ✅ 合理使用父选择器引用
.button {
  background: $primary-color;

  // 状态修饰
  &:hover,
  &:focus {
    background: darken($primary-color, 10%);
  }

  // 尺寸修饰
  &.btn-large {
    padding: 12px 24px;
    font-size: 18px;
  }

  &.btn-small {
    padding: 6px 12px;
    font-size: 14px;
  }

  // 主题修饰
  &.btn-outline {
    background: transparent;
    border: 2px solid $primary-color;
    color: $primary-color;
  }
}
```

## 核心特性

### 3. 混合器（Mixins）

混合器是Sass最强大的特性之一，允许定义可重用的样式组合。

#### 基础混合器

```scss
/**
 * @description 混合器基础用法演示
 */

// 无参数混合器
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 使用混合器
.nav-menu {
  @include reset-list;
  display: flex;
}

// 带参数的混合器
@mixin button-style($bg-color, $text-color: white, $padding: 10px 20px) {
  background-color: $bg-color;
  color: $text-color;
  padding: $padding;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken($bg-color, 10%);
    transform: translateY(-1px);
  }
}

// 使用带参数的混合器
.primary-button {
  @include button-style($primary-color);
}

.secondary-button {
  @include button-style($secondary-color, white, 8px 16px);
}
```

#### 高级混合器技术

```scss
/**
 * @description 高级混合器技术演示
 */

// 1. 使用@content指令
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 767px) {
      @content;
    }
  }
  @if $breakpoint == tablet {
    @media (min-width: 768px) and (max-width: 1023px) {
      @content;
    }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1024px) {
      @content;
    }
  }
}

// 使用响应式混合器
.container {
  width: 100%;
  padding: 0 15px;

  @include respond-to(mobile) {
    padding: 0 10px;
  }

  @include respond-to(tablet) {
    max-width: 750px;
    margin: 0 auto;
  }

  @include respond-to(desktop) {
    max-width: 1200px;
  }
}

// 2. 可变参数混合器
@mixin box-shadow($shadows...) {
  -webkit-box-shadow: $shadows;
  -moz-box-shadow: $shadows;
  box-shadow: $shadows;
}

// 使用可变参数
.card {
  @include box-shadow(
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1)
  );
}

// 3. 条件混合器
@mixin border-radius($radius, $important: false) {
  @if $important {
    border-radius: $radius !important;
  } @else {
    border-radius: $radius;
  }
}

// 4. 复杂布局混合器
@mixin flex-center($direction: row) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: $direction;
}

@mixin grid-container($columns: 12, $gap: 20px) {
  display: grid;
  grid-template-columns: repeat($columns, 1fr);
  gap: $gap;
}

// 使用布局混合器
.modal {
  @include flex-center(column);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.grid-layout {
  @include grid-container(12, 30px);
  max-width: 1200px;
  margin: 0 auto;
}
```

### 4. 继承（Extend/Inheritance）

继承允许选择器共享另一个选择器的样式，是减少CSS重复的有效方法。

#### 基础继承

```scss
/**
 * @description 继承基础用法演示
 */

// 占位符选择器（推荐使用）
%button-base {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// 继承占位符选择器
.btn-primary {
  @extend %button-base;
  background-color: $primary-color;
  color: white;

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 10%);
  }
}

.btn-secondary {
  @extend %button-base;
  background-color: $secondary-color;
  color: white;

  &:hover:not(:disabled) {
    background-color: darken($secondary-color, 10%);
  }
}

.btn-outline {
  @extend %button-base;
  background-color: transparent;
  border: 2px solid $primary-color;
  color: $primary-color;

  &:hover:not(:disabled) {
    background-color: $primary-color;
    color: white;
  }
}
```

#### 继承与混合器的对比

```scss
/**
 * @description 继承vs混合器对比示例
 */

// 使用继承的情况
%message-base {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.alert-success {
  @extend %message-base;
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  @extend %message-base;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

// 编译后的CSS（继承）：
// .alert-success, .alert-danger {
//   padding: 15px;
//   margin-bottom: 20px;
//   border: 1px solid transparent;
//   border-radius: 4px;
// }
// .alert-success { /* 特定样式 */ }
// .alert-danger { /* 特定样式 */ }

// 使用混合器的情况
@mixin message-base {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.info-success {
  @include message-base;
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.info-danger {
  @include message-base;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

// 编译后的CSS（混合器）：
// .info-success {
//   padding: 15px;
//   margin-bottom: 20px;
//   border: 1px solid transparent;
//   border-radius: 4px;
//   color: #155724;
//   background-color: #d4edda;
//   border-color: #c3e6cb;
// }
// .info-danger { /* 重复相同的基础样式 */ }
```

#### 继承的最佳实践

```scss
/**
 * @description 继承最佳实践演示
 */

// ✅ 推荐：使用占位符选择器
%clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.container {
  @extend %clearfix;
  width: 100%;
}

// ❌ 避免：继承复杂的嵌套选择器
.navbar .nav-item .nav-link {
  color: blue;
}

.sidebar-link {
  @extend .navbar .nav-item .nav-link; // 会生成复杂的选择器组合
}

// ✅ 推荐：使用混合器处理复杂逻辑
@mixin link-style($color: blue) {
  color: $color;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.nav-link {
  @include link-style($primary-color);
}

.sidebar-link {
  @include link-style($secondary-color);
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

### 5. 控制指令（Control Directives）

Sass提供了条件语句、循环等控制指令，让样式表具备编程能力。

#### 条件控制（@if, @else if, @else）

```scss
/**
 * @description 条件控制指令演示
 */

// 主题切换混合器
@mixin theme-button($theme: 'primary') {
  @if $theme == 'primary' {
    background-color: $primary-color;
    color: white;
  } @else if $theme == 'secondary' {
    background-color: $secondary-color;
    color: white;
  } @else if $theme == 'success' {
    background-color: #28a745;
    color: white;
  } @else {
    background-color: #f8f9fa;
    color: #212529;
    border: 1px solid #dee2e6;
  }

  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

// 使用条件混合器
.btn-primary { @include theme-button('primary'); }
.btn-secondary { @include theme-button('secondary'); }
.btn-success { @include theme-button('success'); }
.btn-default { @include theme-button(); }

// 响应式字体大小
@mixin responsive-font($size) {
  @if $size < 14px {
    font-size: $size;
    line-height: 1.4;
  } @else if $size >= 14px and $size < 18px {
    font-size: $size;
    line-height: 1.5;
  } @else {
    font-size: $size;
    line-height: 1.6;
  }
}
```

#### 循环控制（@for, @each, @while）

```scss
/**
 * @description 循环控制指令演示
 */

// 1. @for循环 - 生成栅格系统
@for $i from 1 through 12 {
  .col-#{$i} {
    width: percentage($i / 12);
    float: left;
    padding-left: 15px;
    padding-right: 15px;
  }
}

// 2. @each循环 - 遍历列表
$sizes: small, medium, large, xlarge;
$size-values: 12px, 16px, 20px, 24px;

@each $size in $sizes {
  $index: index($sizes, $size);
  .text-#{$size} {
    font-size: nth($size-values, $index);
  }
}

// 3. @each循环 - 遍历映射
$social-colors: (
  facebook: #3b5998,
  twitter: #1da1f2,
  instagram: #e4405f,
  linkedin: #0077b5,
  github: #333
);

@each $platform, $color in $social-colors {
  .btn-#{$platform} {
    background-color: $color;
    color: white;

    &:hover {
      background-color: darken($color, 10%);
    }
  }
}

// 4. @while循环 - 生成间距类
$spacing: 5;
@while $spacing <= 50 {
  .margin-#{$spacing} {
    margin: #{$spacing}px;
  }
  .padding-#{$spacing} {
    padding: #{$spacing}px;
  }
  $spacing: $spacing + 5;
}

// 5. 复杂的循环嵌套
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
);

$utilities: (
  margin: m,
  padding: p
);

$sides: (
  top: t,
  right: r,
  bottom: b,
  left: l
);

// 生成响应式工具类
@each $breakpoint-name, $breakpoint-value in $breakpoints {
  @if $breakpoint-value == 0 {
    @each $property, $property-abbr in $utilities {
      @each $side, $side-abbr in $sides {
        @for $i from 0 through 5 {
          .#{$property-abbr}#{$side-abbr}-#{$i} {
            #{$property}-#{$side}: #{$i * 0.25}rem;
          }
        }
      }
    }
  } @else {
    @media (min-width: $breakpoint-value) {
      @each $property, $property-abbr in $utilities {
        @each $side, $side-abbr in $sides {
          @for $i from 0 through 5 {
            .#{$property-abbr}#{$side-abbr}-#{$breakpoint-name}-#{$i} {
              #{$property}-#{$side}: #{$i * 0.25}rem;
            }
          }
        }
      }
    }
  }
}
```

### 6. 函数（Functions）

Sass提供了丰富的内置函数，同时支持自定义函数。

#### 内置函数

```scss
/**
 * @description Sass内置函数演示
 */

// 1. 颜色函数
$base-color: #007bff;

.color-functions {
  // 明度调整
  background: lighten($base-color, 20%);    // 变亮
  border-color: darken($base-color, 15%);   // 变暗

  // 饱和度调整
  color: saturate($base-color, 30%);        // 增加饱和度
  outline-color: desaturate($base-color, 20%); // 降低饱和度

  // 色相调整
  box-shadow: 0 0 10px adjust-hue($base-color, 45deg);

  // 透明度调整
  background-color: fade-out($base-color, 0.3);  // 减少不透明度
  border-color: fade-in($base-color, 0.2);       // 增加不透明度

  // 颜色混合
  background: mix($base-color, white, 75%);       // 混合颜色

  // 获取颜色信息
  color: rgb(red($base-color), green($base-color), blue($base-color));
  opacity: alpha($base-color);
}

// 2. 数学函数
.math-functions {
  // 数值操作
  font-size: abs(-16px);           // 绝对值: 16px
  line-height: ceil(1.7);          // 向上取整: 2
  width: floor(100.9px);           // 向下取整: 100px
  height: round(50.6px);           // 四舍五入: 51px

  // 最值函数
  padding: max(10px, 15px, 8px);   // 最大值: 15px
  margin: min(5px, 10px, 3px);     // 最小值: 3px

  // 百分比计算
  width: percentage(5/8);          // 62.5%
}

// 3. 字符串函数
$font-family: 'Helvetica Neue';

.string-functions {
  // 字符串长度
  content: str-length($font-family);        // 14

  // 字符串切片
  font-family: str-slice($font-family, 1, 9); // 'Helvetica'

  // 字符串插入
  content: str-insert($font-family, ' Bold', -1); // 'Helvetica Bold Neue'

  // 大小写转换
  content: to-upper-case('hello');          // 'HELLO'
  content: to-lower-case('WORLD');          // 'world'
}

// 4. 列表函数
$font-sizes: 12px, 14px, 16px, 18px, 24px;

.list-functions {
  // 列表长度
  content: length($font-sizes);             // 5

  // 获取元素
  font-size: nth($font-sizes, 3);          // 16px

  // 查找索引
  content: index($font-sizes, 18px);       // 4

  // 添加元素
  $new-sizes: append($font-sizes, 32px);   // 12px, 14px, 16px, 18px, 24px, 32px

  // 连接列表
  $all-sizes: join($font-sizes, (36px, 48px)); // 合并列表
}

// 5. 映射函数
$theme-colors: (
  primary: #007bff,
  secondary: #6c757d,
  success: #28a745
);

.map-functions {
  // 获取值
  color: map-get($theme-colors, primary);           // #007bff

  // 检查键
  @if map-has-key($theme-colors, danger) {
    background: map-get($theme-colors, danger);
  }

  // 获取所有键
  content: map-keys($theme-colors);                 // primary, secondary, success

  // 获取所有值
  content: map-values($theme-colors);               // #007bff, #6c757d, #28a745
}
```

#### 自定义函数

```scss
/**
 * @description 自定义函数演示
 */

// 1. 简单的计算函数
@function px-to-rem($px, $base-font-size: 16px) {
  @return $px / $base-font-size * 1rem;
}

// 使用自定义函数
.container {
  padding: px-to-rem(20px);     // 1.25rem
  margin: px-to-rem(32px);      // 2rem
}

// 2. 颜色处理函数
@function get-contrast-color($color) {
  $lightness: lightness($color);
  @if $lightness > 50% {
    @return #000;
  } @else {
    @return #fff;
  }
}

// 智能按钮颜色
@mixin smart-button($bg-color) {
  background-color: $bg-color;
  color: get-contrast-color($bg-color);

  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

.btn-light { @include smart-button(#f8f9fa); }
.btn-dark { @include smart-button(#343a40); }

// 3. 复杂的工具函数
@function strip-unit($value) {
  @return $value / ($value * 0 + 1);
}

@function em($px, $base: 16px) {
  @return (strip-unit($px) / strip-unit($base)) * 1em;
}

// 4. 递归函数
@function power($base, $exponent) {
  $result: 1;
  @if $exponent > 0 {
    @for $i from 1 through $exponent {
      $result: $result * $base;
    }
  }
  @return $result;
}

// 5. 条件函数
@function theme-color($color-name, $opacity: 1) {
  $color: map-get($theme-colors, $color-name);
  @if $color {
    @if $opacity < 1 {
      @return rgba($color, $opacity);
    } @else {
      @return $color;
    }
  } @else {
    @warn "Color '#{$color-name}' not found in theme colors.";
    @return #000;
  }
}

// 使用条件函数
.alert {
  background-color: theme-color(primary, 0.1);
  border-color: theme-color(primary);
  color: theme-color(primary);
}
```

### 7. 运算（Operations）

```scss
/**
 * @description Sass运算演示
 */

// 1. 数值运算
$container-width: 1200px;
$sidebar-width: 300px;
$gap: 20px;

.layout {
  // 加法运算
  width: $container-width + $gap * 2;

  // 减法运算
  .main-content {
    width: $container-width - $sidebar-width - $gap;
  }

  // 乘法运算
  .grid-item {
    width: 100% / 3;  // 33.33333%
    margin: $gap * 0.5;
  }

  // 除法运算（需要用括号包围或变量）
  font-size: (16px / 14px) * 1em;  // 1.14286em
  line-height: $base-font-size / 14px; // 使用变量
}

// 2. 颜色运算
$primary: #007bff;
$secondary: #6c757d;

.color-operations {
  // 颜色加法
  border-color: $primary + #111;   // 增加RGB值

  // 颜色减法
  background: $primary - #222;     // 减少RGB值

  // 颜色乘法
  color: $secondary * 1.2;         // 放大RGB值

  // 颜色除法
  outline-color: $primary / 2;     // 缩小RGB值
}

// 3. 字符串运算
$font-path: '/assets/fonts/';
$font-name: 'custom-font';

.string-operations {
  // 字符串连接
  font-family: $font-name + '-regular';
  src: url($font-path + $font-name + '.woff2');

  // 插值运算
  background-image: url('#{$font-path}icons/#{$font-name}.svg');
}

// 4. 布尔运算
$enable-rounded: true;
$enable-shadows: false;

.boolean-operations {
  @if $enable-rounded and not $enable-shadows {
    border-radius: 4px;
    box-shadow: none;
  }

  @if $enable-rounded or $enable-shadows {
    transition: all 0.3s ease;
  }
}

// 5. 比较运算
@mixin responsive-text($size) {
  font-size: $size;

  @if $size >= 18px {
    line-height: 1.6;
    letter-spacing: 0.5px;
  } @else if $size <= 12px {
    line-height: 1.4;
    font-weight: bold;
  } @else {
    line-height: 1.5;
  }
}
```

### 8. 导入和模块化（@import, @use, @forward）

```scss
/**
 * @description Sass模块化演示
 */

// 传统的@import方式
@import 'variables';
@import 'mixins';
@import 'base';
@import 'components/buttons';
@import 'components/cards';

// 新的@use方式（Sass 3.5+推荐）
// _variables.scss
$primary-color: #007bff !default;
$secondary-color: #6c757d !default;

// _mixins.scss
@mixin button-style($color) {
  background: $color;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

// main.scss
@use 'variables' as vars;
@use 'mixins';

.button {
  @include mixins.button-style(vars.$primary-color);
}

// 使用@forward转发模块
// _index.scss
@forward 'variables';
@forward 'mixins';
@forward 'functions';

// main.scss
@use 'index' as *;  // 导入所有转发的模块

.component {
  color: $primary-color;  // 来自variables
  @include button-style(blue);  // 来自mixins
}
```