# uni-app 通用模板

**官网地址** [https://uniapp.dcloud.io/](https://uniapp.dcloud.io/ "点击跳转")

**平台兼容说明** [https://uniapp.dcloud.io/use](https://uniapp.dcloud.io/use "点击跳转")

### 模板说明：
1. 基于`cli`创建的轻量化项目模板，只保留`vue`最基础的使用方式，保证打包到多端时不需要作太多判断处理

2. 状态管理不建议使用`vuex`，因为会导致代码变得冗余，而且在编辑器中失去代码静态追踪和提示“[被忽略的官方说明](https://vuex.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%83%85%E5%86%B5%E4%B8%8B%E6%88%91%E5%BA%94%E8%AF%A5%E4%BD%BF%E7%94%A8-vuex%EF%BC%9F)”使用方式可参考：[你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8) 

3. 模板为了轻量化只保留了常用的组件，需要其他组件自行添加，[官方扩展组件](https://uniapp.dcloud.io/component/README?id=uniui)，这里不推荐使用除官方外的扩展组件，因为打包成多端可能会有兼容问题，所以我习惯自己写，这样代码会更少

4. 已经配置好在`manifest.json`文件中h5端请求代理，不需要可剔除

5. 预装了`sass`，部分注意事项请看`uni.scss`代码注释

**注意：`vue.config.js` 中配置的 `css.loaderOptions` 是无法在当前项目生效的，可能是`uni-app`项目设定和标准`vue-cli`项目设定不一样导致的，需要在`uni.scss`文件全局引入即可，具体看代码**

### 目录说明

**首字母大写的均是`class`模块**

> `api` 所有接口模块目录

> `components` 通用组件目录

> `modules` 基础模块目录

> `pages` 主程序页面目录，需要分包自行新建其他页面目录

> `static` 图片或一些静态文件目录

> `store` 各个状态管理类模块目录

> `utils` 实用工具模块目录

> `styles` 不说了...


### sass安装失败时配置（window系统）cmd 窗口首先执行命令再初始化
```
set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

## 初始化项目
```
npm install
```

### 运行项目
```
npm run serve
```

### 打包项目，APP项目只能用官方 HBuildX IDE 去打包
```
npm run build
```

### 在 HBuildX 控制台中出现版本更新提示需要手动升级一下项目
```
npm update
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/)