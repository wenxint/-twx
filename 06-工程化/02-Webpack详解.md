# Webpack详解

> Webpack是前端开发中最流行的模块打包工具之一，它可以将众多模块按照依赖关系打包成静态资源，在大型前端项目中扮演着至关重要的角色。

## 1. Webpack核心概念

### 1.1 什么是Webpack

Webpack是一个现代JavaScript应用程序的静态模块打包器(module bundler)。当Webpack处理应用程序时，会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。

### 1.2 核心概念

1. **入口(Entry)**：Webpack构建的起点，指示Webpack应该从哪个模块开始构建内部依赖图。
2. **输出(Output)**：告诉Webpack在哪里输出所创建的bundles，以及如何命名这些文件。
3. **加载器(Loaders)**：让Webpack能够处理非JavaScript文件（如CSS、图片等）。
4. **插件(Plugins)**：用于执行范围更广的任务，从打包优化到资源管理，再到环境变量注入。
5. **模式(Mode)**：设置development, production或none以启用相应环境下的内置优化。
6. **模块(Modules)**：在Webpack中，一切皆模块，包括JavaScript文件、CSS、图片等。
7. **依赖图(Dependency Graph)**：Webpack从入口文件开始，递归地构建应用的依赖图。

## 2. 基本配置

### 2.1 安装Webpack

```bash
# 本地安装Webpack和CLI
npm install webpack webpack-cli --save-dev

# 或使用yarn
yarn add webpack webpack-cli --dev
```

## 9. 面试常见问题

### 9.1 Webpack中模块联邦（Module Federation）的原理是什么？它解决了哪些问题？

**原理**：模块联邦是Webpack 5引入的跨应用共享模块的机制，允许应用动态导入其他应用暴露的模块。核心通过`ModuleFederationPlugin`实现，支持运行时共享依赖，避免重复打包。其原理包括：
- **远程容器（Remote Container）**：暴露模块的应用，通过`exposes`配置导出模块。
- **宿主容器（Host Container）**：消费模块的应用，通过`remotes`配置引用远程容器。
- **共享依赖（Shared Dependencies）**：配置共享的第三方库（如React），避免重复加载。

**解决的问题**：
- 微前端架构中跨应用代码共享，减少重复打包。
- 独立构建和部署多个应用，降低耦合。
- 动态加载模块，提升应用加载性能。

**实际案例**：
主应用（Host）引用子应用（Remote）的Header组件：

```javascript
// 子应用webpack.config.js（Remote）
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "header_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Header": "./src/Header",
      },
      shared: { react: { singleton: true } },
    }),
  ],
};

// 主应用webpack.config.js（Host）
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        header_app: "header_app@http://localhost:3001/remoteEntry.js",
      },
      shared: { react: { singleton: true } },
    }),
  ],
};
```

**最佳实践**：
- 使用`singleton`确保共享依赖的单例模式，避免版本冲突。
- 配置`requiredVersion`指定依赖版本，保证一致性。
- 对高频共享模块使用`eager`模式，避免动态加载延迟。

### 9.2 Webpack的资源模块（Asset Modules）有哪些类型？各自的使用场景是什么？

**类型与场景**：
Webpack 5引入资源模块（Asset Modules）替代了`file-loader`、`url-loader`等，支持以下类型：

1. **asset/resource**：输出单独文件（如图片、字体），适用于大文件（>8kb），避免base64增加包体积。
   ```javascript
   // webpack.config.js
   module: {
     rules: [
       {
         test: /\.(png|jpg|gif)$/,
         type: 'asset/resource',
         generator: {
           filename: 'images/[name][ext]'
         }
       }
     ]
   }
   ```

2. **asset/inline**：将资源转换为base64 URI，适用于小文件（<8kb），减少HTTP请求。
   ```javascript
   {
     test: /\.svg$/,
     type: 'asset/inline'
   }
   ```

3. **asset/source**：直接导出资源的原始内容（如文本文件），适用于需要读取文件内容的场景（如JSON配置）。
   ```javascript
   {
     test: /\.txt$/,
     type: 'asset/source'
   }
   ```

4. **asset**（混合类型）：根据文件大小自动选择`resource`或`inline`（默认8kb阈值），灵活处理不同大小资源。
   ```javascript
   {
     test: /\.ico$/,
     type: 'asset',
     parser: {
       dataUrlCondition: {
         maxSize: 4 * 1024 // 4kb
       }
     }
   }
   ```

**最佳实践**：
- 结合`generator.filename`配置输出路径，保持资源目录结构清晰。
- 通过`parser.dataUrlCondition`自定义大小阈值，平衡请求数和包体积。
- 对字体文件使用`asset/resource`，确保浏览器正确加载。

### 9.3 如何优化Webpack的构建速度？请结合具体配置说明。

**优化策略与配置**：

1. **缓存（Caching）**：
   - 使用`cache: { type: 'filesystem' }`启用文件系统缓存，避免重复编译。
   - 对`babel-loader`配置`cacheDirectory: true`，缓存转译结果。
   ```javascript
   module.exports = {
     cache: {
       type: 'filesystem',
       buildDependencies: {
         config: [__filename] // 配置变化时自动失效缓存
       }
     },
     module: {
       rules: [
         {
           test: /\.js$/,
           use: {
             loader: 'babel-loader',
             options: { cacheDirectory: true }
           }
         }
       ]
     }
   }
   ```

2. **并行编译**：
   - 使用`thread-loader`将耗时的loader（如`babel-loader`）放到独立线程执行。
   ```javascript
   {
     test: /\.js$/,
     use: [
       'thread-loader',
       { loader: 'babel-loader' }
     ]
   }
   ```

3. **排除不必要的处理**：
   - 使用`exclude`或`include`限制loader作用范围，减少处理文件数量。
   ```javascript
   {
     test: /\.js$/,
     include: path.resolve(__dirname, 'src'),
     exclude: /node_modules/,
     use: 'babel-loader'
   }
   ```

4. **优化解析（Resolve）**：
   - 配置`resolve.modules`指定第三方模块目录，减少查找时间。
   - 使用`resolve.alias`缩短长路径引用。
   ```javascript
   resolve: {
     modules: [path.resolve(__dirname, 'node_modules')],
     alias: {
       '@components': path.resolve(__dirname, 'src/components')
     }
   }
   ```

**效果**：通过以上配置，某项目构建时间从82s缩短至35s，提升约57%。

### 9.4 Webpack的构建流程是怎样的？核心阶段有哪些？

**构建流程概述**：
Webpack通过“依赖图”将模块打包为静态资源，核心流程分为以下阶段：

1. **初始化**：读取配置（`webpack.config.js`），创建`Compiler`和`Compilation`对象，注册插件钩子。

2. **解析入口**：从`entry`配置的入口文件开始，递归解析所有依赖模块。

3. **模块加载**：使用`loader`处理非JS模块（如CSS、图片），转换为JS模块。

4. **生成抽象语法树（AST）**：对JS模块进行词法、语法分析，提取依赖（如`import`语句）。

5. **依赖图构建**：收集所有模块及其依赖，形成完整的依赖关系图。

6. **代码生成**：根据`output`配置，将依赖图中的模块合并为`bundle`文件，应用`plugins`进行优化（如压缩、哈希命名）。

**核心阶段示例**（通过`compiler.hooks`监听）：
```javascript
compiler.hooks.compile.tap('MyPlugin', () => {
  console.log('开始编译...');
});

compiler.hooks.done.tap('MyPlugin', (stats) => {
  console.log(`编译完成！耗时：${stats.endTime - stats.startTime}ms`);
});
```

**面试重点**：需理解各阶段的作用（如loader在“模块加载”阶段工作，plugins在“代码生成”阶段优化），并能结合具体场景说明如何通过插件干预流程（如`HtmlWebpackPlugin`在生成阶段注入`bundle`路径）。

### 2.2 基础配置文件

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出配置
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // 模式
  mode: 'development', // 或 'production', 'none'

  // 模块处理规则
  module: {
    rules: [
      // JavaScript处理
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      // CSS处理
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // 图片处理
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },

  // 插件配置
  plugins: []
};
```

### 2.3 多入口配置

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

### 2.4 开发环境配置

```javascript
module.exports = {
  mode: 'development',

  // 开发工具配置，控制源代码映射生成方式
  devtool: 'inline-source-map',

  // 开发服务器配置
  devServer: {
    contentBase: './dist',
    hot: true, // 热模块替换
    port: 8080,
    open: true, // 自动打开浏览器
    proxy: {
      '/api': 'http://localhost:3000' // API代理
    }
  },

  // 其他配置...
};
```

## 3. 加载器详解

### 3.1 JavaScript处理

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    },
    // TypeScript处理
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }
  ]
}
```

### 3.2 样式处理

```javascript
module: {
  rules: [
    // CSS处理
    {
      test: /\.css$/,
      use: [
        'style-loader', // 将CSS注入到DOM
        'css-loader' // 解析CSS中的import和url()
      ]
    },

    // SASS处理
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader' // 将SASS转换为CSS
      ]
    },

    // Less处理
    {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader' // 将Less转换为CSS
      ]
    },

    // PostCSS处理
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer'),
              require('cssnano')
            ]
          }
        }
      ]
    }
  ]
}
```

### 3.3 资源处理

```javascript
module: {
  rules: [
    // 图片处理
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'images/'
          }
        }
      ]
    },

    // 字体处理
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    },

    // 加载数据
    {
      test: /\.(csv|tsv)$/,
      use: ['csv-loader']
    },
    {
      test: /\.xml$/,
      use: ['xml-loader']
    },

    // JSON已内置支持，不需要额外loader
  ]
}
```

### 3.4 HTML和模板处理

```javascript
module: {
  rules: [
    // Handlebars模板
    {
      test: /\.handlebars$/,
      use: 'handlebars-loader'
    },

    // Pug模板
    {
      test: /\.pug$/,
      use: ['pug-loader']
    }
  ]
}
```

## 4. 插件系统

### 4.1 常用内置插件

```javascript
const webpack = require('webpack');

module.exports = {
  // ...
  plugins: [
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'DEBUG': false
    }),

    // 提取公共模块
    new webpack.optimize.SplitChunksPlugin({
      chunks: 'all',
      name: 'common'
    }),

    // 启用热模块替换
    new webpack.HotModuleReplacementPlugin(),

    // 忽略特定模块
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // 提供全局变量
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
```

### 4.2 第三方流行插件

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // ...
  plugins: [
    // 清理dist目录
    new CleanWebpackPlugin(),

    // 生成HTML文件并注入资源
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),

    // 提取CSS到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    // 复制静态资源
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' }
      ]
    }),

    // 分析打包结果
    new BundleAnalyzerPlugin()
  ],

  // 优化配置
  optimization: {
    minimizer: [
      // JS压缩
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
};
```

## 5. 高级配置

### 5.1 代码分割

```javascript
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all', // 分割所有类型代码(异步、同步)
      minSize: 20000, // 最小分割大小(bytes)
      maxSize: 0, // 最大分割大小，设为0表示不限制
      minChunks: 1, // 被引用的最小次数
      maxAsyncRequests: 30, // 最大异步请求数
      maxInitialRequests: 30, // 最大初始化请求数
      automaticNameDelimiter: '~', // 名称分隔符
      name: true, // 保留名称
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### 5.2 缓存

```javascript
module.exports = {
  // ...
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },

  optimization: {
    // 将运行时代码提取到单独的chunk
    runtimeChunk: 'single',

    // 确保vendor的哈希值稳定
    moduleIds: 'hashed',

    // 代码分割配置
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 5.3 Tree Shaking

```javascript
// package.json
{
  "name": "my-project",
  "sideEffects": false, // 或 ["*.css", "*.scss"]
}

// webpack.config.js
module.exports = {
  mode: 'production', // Tree Shaking在生产模式下自动启用
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true, // 移除未使用的代码
  }
};
```

### 5.4 环境分离配置

```javascript
// webpack.common.js - 公共配置
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      // 通用加载器配置
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

// webpack.dev.js - 开发环境配置
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  }
});

// webpack.prod.js - 生产环境配置
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
    minimizer: [
      // 压缩配置
    ]
  }
});
```

## 6. 性能优化

### 6.1 打包速度优化

```javascript
module.exports = {
  // ...
  resolve: {
    // 解析模块时应该搜索的目录
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],

    // 扩展名
    extensions: ['.js', '.jsx', '.ts', '.tsx'],

    // 别名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 缓存加载器结果
  cache: {
    type: 'filesystem', // 'memory' | 'filesystem'
    buildDependencies: {
      config: [__filename] // 当配置改变时，缓存失效
    }
  },

  parallelism: 4, // 并行处理模块的数量

  // 仅将某些文件传给特定加载器
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
```

### 6.2 体积优化

```javascript
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // Gzip压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // 只处理大于10kb的资源
      minRatio: 0.8 // 只有压缩率小于0.8的资源才会被处理
    }),

    // 图片压缩
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            ['svgo', { plugins: [{ removeViewBox: false }] }]
          ]
        }
      }
    })
  ],

  optimization: {
    // 确保在生产环境中启用这些优化
    minimize: true,
    minimizer: [
      // JS压缩
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // 删除注释
          },
          compress: {
            drop_console: true, // 删除console语句
            drop_debugger: true // 删除debugger语句
          }
        },
        extractComments: false // 不将注释提取到单独文件
      }),

      // CSS压缩
      new CssMinimizerPlugin()
    ]
  }
};
```

### 6.3 运行时优化

```javascript
module.exports = {
  // ...
  optimization: {
    // 标记模块的副作用
    sideEffects: true,

    // 启用确定性模块ID
    moduleIds: 'deterministic',

    // 启用确定性块ID
    chunkIds: 'deterministic',

    // 从chunks中提取运行时代码
    runtimeChunk: 'single',

    // 优化模块引用
    concatenateModules: true, // 尝试安全地连接模块（作用域提升）

    // 确保文件大小最小
    minimize: true
  }
};
```

## 7. Webpack 5 新特性

### 7.1 持久化缓存

```javascript
module.exports = {
  // ...
  cache: {
    type: 'filesystem',
    version: '1.0', // 缓存版本
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    store: 'pack', // 'pack' | 'idle'
    buildDependencies: {
      config: [__filename]
    }
  }
};
```

### 7.2 资源模块(Asset Modules)

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // 代替file-loader
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },

      // 代替url-loader (小文件内联)
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192 // 8kb
          }
        }
      },

      // 代替raw-loader
      {
        test: /\.txt/,
        type: 'asset/source'
      },

      // 代替inline-loader
      {
        test: /\.svg/,
        type: 'asset/inline'
      }
    ]
  }
};
```

### 7.3 模块联邦(Module Federation)

```javascript
// 应用A配置 (host)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Header': './src/components/Header'
      },
      shared: ['react', 'react-dom']
    })
  ]
};

// 应用B配置 (consumer)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
};

// 在应用B中使用应用A的组件
// app2/src/App.js
import React, { Suspense } from 'react';

const RemoteButton = React.lazy(() => import('app1/Button'));

export default function App() {
  return (
    <div>
      <h1>App 2</h1>
      <Suspense fallback="Loading Button...">
        <RemoteButton />
      </Suspense>
    </div>
  );
}
```

## 8. 常见问题与解决方案

### 8.1 构建性能问题

1. **构建缓慢**

   - 使用`webpack-bundle-analyzer`分析包大小
   - 配置`include/exclude`限制处理范围
   - 启用`cache`和`parallel`选项
   - 减少插件和加载器数量
   - 使用`thread-loader`进行多线程构建
2. **内存溢出**

   - 增加Node.js内存限制：`node --max-old-space-size=4096 ./node_modules/.bin/webpack`
   - 拆分项目为多个小型项目
   - 优化加载器配置以减少内存使用

### 8.2 输出质量问题

1. **包体积过大**

   - 使用代码分割和动态导入
   - 启用Tree Shaking移除未使用代码
   - 使用`webpack-bundle-analyzer`分析并优化
   - 使用压缩插件减小体积
   - 移除不必要的依赖
2. **重复代码问题**

   - 配置`optimization.splitChunks`提取公共模块
   - 使用`DllPlugin`预构建稳定依赖
   - 适当使用`externals`排除某些库

### 8.3 配置问题

1. **路径解析问题**

   - 使用`resolve.alias`简化导入路径
   - 配置`resolve.extensions`自动识别扩展名
   - 检查`resolve.modules`配置
2. **环境变量问题**

   - 使用`DefinePlugin`正确设置环境变量
   - 使用`dotenv`管理不同环境变量
   - 确保变量值被字符串化

## 9. 面试常见问题

1. **Webpack的工作原理是什么？**

   Webpack的核心工作流程可分为以下5个关键步骤：
   - **依赖图构建**：从配置的`entry`入口文件开始，通过静态分析（如`import/require`语句）递归解析所有依赖模块，形成包含JS、CSS、图片等资源的完整依赖关系图。
   - **模块转换**：对非JS模块（如`.css`文件）使用`loader`进行转换（如`css-loader`解析CSS依赖，`style-loader`将CSS注入DOM），最终统一为JS模块。
   - **代码合并**：根据`output`配置将依赖图中的模块合并为`bundle`文件，支持多入口生成多个`bundle`。
   - **优化处理**：通过`plugins`执行压缩（`TerserPlugin`）、提取公共代码（`SplitChunksPlugin`）、环境变量注入（`DefinePlugin`）等优化操作。
   - **输出产物**：最终生成包含JS、CSS（通过`MiniCssExtractPlugin`提取）、图片（通过资源模块处理）的静态资源文件。

   **示例**：一个简单的Webpack构建流程配置：
   ```javascript
   // webpack.config.js
   module.exports = {
     entry: './src/index.js',
     module: { rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }] },
     plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
     output: { filename: 'bundle.[contenthash].js', path: path.resolve(__dirname, 'dist') }
   };
   ```
2. **Webpack与其他打包工具(如Rollup, Parcel)相比有什么优劣势？**

   **核心差异对比**：
   | 工具       | 优势                                                                 | 劣势                                                                 | 典型场景                     |
   |------------|----------------------------------------------------------------------|----------------------------------------------------------------------|------------------------------|
   | Webpack    | 支持复杂应用（多页/SPA）、丰富的loader/plugin生态、完善的HMR机制     | 配置复杂度高，小型项目可能过度设计                                   | 中大型前端应用（如企业级系统） |
   | Rollup     | 基于ES模块的Tree Shaking更彻底、输出体积更小、支持UMD/ES等多种格式   | 缺少HMR、复杂应用需额外配置                                         | 库/工具包开发（如Lodash）     |
   | Parcel     | 零配置（自动识别文件类型）、内置HMR和优化、快速启动                   | 配置灵活性差，大型项目性能可能下降                                   | 小型项目/原型开发             |

   **选择建议**：
   - 开发React/Vue应用：优先Webpack（生态成熟，支持TS、CSS Modules等）
   - 开发UI组件库：优先Rollup（体积更小，避免打包冗余）
   - 快速验证想法：优先Parcel（节省配置时间）
3. **如何优化Webpack的构建性能？**

   **构建性能优化可从以下4个维度实施**：
   ### 3.1 减少编译量
   - **缩小文件范围**：在`module.rules`中配置`include: path.resolve(__dirname, 'src')`，排除`node_modules`（除非需要处理其中的特定文件）。
   - **DLL预构建**：将稳定依赖（如React、Vue）提前打包为DLL文件，主构建时直接引用（通过`DllReferencePlugin`），减少重复编译。

   ### 3.2 利用缓存
   - **Webpack 5持久化缓存**：配置`cache: { type: 'filesystem' }`，将编译结果缓存到磁盘（默认路径：`node_modules/.cache/webpack`）。
   - **loader缓存**：在`loader`配置中添加`cacheDirectory: true`（如`babel-loader`），缓存转换后的模块。

   ### 3.3 并行处理
   - **thread-loader**：在耗时loader（如`babel-loader`）前添加，将任务分配到Worker池（示例：`use: ['thread-loader', 'babel-loader']`）。
   - **多进程编译**：使用`webpack-parallel-uglify-plugin`替代默认的`TerserPlugin`，并行执行代码压缩。

   ### 3.4 优化配置
   - **简化resolve**：配置`resolve.alias`缩短路径解析时间（如`alias: { '@': path.resolve(__dirname, 'src') }`）；减少`resolve.extensions`列表（仅保留常用扩展名）。
   - **按需生成source-map**：开发环境用`eval-cheap-module-source-map`（快速），生产环境用`hidden-source-map`（仅调试用）。

   **效果对比**：某项目优化后构建时间从120s降至45s（主要优化：启用持久化缓存+thread-loader+babel-loader缓存）
4. **热模块替换(HMR)的工作原理是什么？**

   HMR的实现依赖以下4个核心组件：
   - **HMR Runtime**：嵌入到bundle中的客户端代码，负责监听更新、替换模块并触发回调。
   - **webpack-dev-server**：启动HTTP服务器，同时创建WebSocket服务端，监听文件变更。
   - **compiler**：当检测到文件变更时，Webpack重新编译变更模块，生成`update chunk`（包含模块差异和HMR Runtime代码）。
   - **WebSocket**：用于服务器向客户端推送更新通知（包含`update chunk`的URL）。

   **执行流程示例**（以修改`src/components/Button.js`为例）：
   1. 开发者保存`Button.js`，触发Webpack重新编译该模块。
   2. Webpack生成`main.abc123.hot-update.json`（清单文件）和`main.abc123.hot-update.js`（更新模块）。
   3. 服务器通过WebSocket发送`{ action: 'building' }`→`{ action: 'built' }`通知客户端。
   4. 客户端HMR Runtime请求清单文件，确认有更新后下载`update chunk`。
   5. 运行时调用`module.hot.accept()`替换旧模块，触发组件的`componentWillUpdate`等生命周期方法（React场景），保留组件状态（如输入框内容）。

   **注意事项**：
   - 需在`webpack.config.js`中启用`devServer.hot: true`。
   - 框架需配合HMR插件（如`react-refresh-webpack-plugin`）才能保留组件状态。
5. **如何处理CSS和静态资源？**

   ### 5.1 CSS处理流程
   **基础配置**（以Sass+PostCSS为例）：
   ```javascript
   module: { 
     rules: [{
       test: /\.scss$/, 
       use: [
         'style-loader', // 开发环境：将CSS注入DOM
         { 
           loader: 'css-loader', 
           options: { modules: { auto: true } } // 启用CSS Modules
         },
         'postcss-loader', // 添加前缀（需配合postcss-preset-env）
         'sass-loader' // 编译Sass→CSS
       ]
     }]
   }
   ```
   **生产优化**：
   - 使用`MiniCssExtractPlugin`提取CSS到独立文件（替代`style-loader`）。
   - 配置`css-minimizer-webpack-plugin`压缩CSS（合并重复规则、移除注释）。
   - 通过`purgecss-webpack-plugin`+`glob`清理未使用的CSS（减少体积30%-50%）。

   ### 5.2 静态资源处理
   **Webpack 5资源模块**（替代file-loader/url-loader）：
   ```javascript
   module: { 
     rules: [{
       test: /\.(png|jpg|gif)$/, 
       type: 'asset', 
       parser: { dataUrlCondition: { maxSize: 8 * 1024 } } // 8KB以下转base64
     }]
   }
   ```
   **优化建议**：
   - 图片：使用`image-webpack-loader`压缩（JPEG压缩60-80质量，PNG使用Zopfli压缩）。
   - 字体：仅保留项目使用的字重/字族（如移除未使用的`bold`字体文件）。
   - 图标：使用`svg-sprite-loader`合并SVG图标为精灵图，减少HTTP请求。
6. **Tree Shaking是什么？如何确保它正常工作？**

   Tree Shaking（摇树优化）是基于ES模块静态分析，移除未被引用代码的过程，本质是**死代码消除（Dead Code Elimination）**。其核心依赖ES模块的静态特性（导入/导出在编译时确定），因此CommonJS模块（`require/module.exports`）无法被完全优化。

   ### 确保Tree Shaking生效的5个关键条件
   1. **使用ES模块语法**：
      错误示例：`const utils = require('./utils');`（CommonJS，无法静态分析）
      正确示例：`import { utilA } from './utils.js';`（ES模块，可识别未使用的`utilB`）

   2. **配置`sideEffects`**：
      在`package.json`中声明无副作用的模块（如纯JS工具库）：
      ```json
      { "sideEffects": false }
      ```
      若模块包含副作用（如CSS、polyfill），需明确列出：
      ```json
      { "sideEffects": ["./src/polyfill.js", "*.css"] }
      ```
      Webpack会跳过无副作用模块的未使用代码检查，提升优化效率。

   3. **启用`usedExports`**：
      在`webpack.config.js`中配置：
      ```javascript
      optimization: { usedExports: true } // 标记未使用导出（生产模式默认启用）
      ```
      配合Terser等压缩工具（如`terser-webpack-plugin`）删除标记的未使用代码。

   4. **避免副作用代码**：
      以下代码会导致Tree Shaking失效（被标记为有副作用）：
      - 模块顶层执行的函数（如`console.log('init')`）
      - 动态导入（`import('./module.js')`）
      - 修改全局对象（如`window.foo = 'bar'`）

   5. **使用现代打包工具链**：
      Webpack 5+配合`terser@5+`、Babel 7.4+（`@babel/preset-env`的`modules: false`配置）可获得最佳效果。

   **验证方法**：
   打包后通过`source-map-explorer`分析产物，检查未使用代码是否被移除（如工具库中仅使用的部分被保留）。
