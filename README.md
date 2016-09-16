# blog

一共会发布三个版本，quote_base、quote_normal和quote。您现在看到的是quote_normal版本。这三个版本是不断重构得到的，可以作为vue.js学习者的进阶参考。因为是根据生产实际开发的版本，也是现在比较流行的微信端SPA，或许是有些意义的demo吧。

* quote_base版：vue.js的基础使用，不涉及component的概念，也不涉及vue.js的周边产品（如vue-router、vuex）和webpack；

* quote_normal版本：quote_base的进阶，涉及component的概念和webpack（基于vue-cli）的使用，不涉及vue-router和vuex；

* quote版：quote_normal的进阶，涉及component的概念和webpack的使用，同时涉及了vue-router和vuex的使用。

## 使用说明

安装所需模块，开启本地服务器

``` bash
$ npm install # 安装所需依赖包

$ npm run dev # 开发时，开启本地服务器

$ npm run build # 生成生产状态下使用的文件，生成后的文件在dist目录中
```

通过npm run dev命令开启服务后，用浏览器打开ttp://localhost:8080/demos/quote/index.html即可访问本地demo文件

通过npm run build命令生成的生产文件的主页是quote.html文件，对应的url路径需要是/demos/quote/quote.html

## 截图

<div align="center">
  <img src="snapshots/basic-info.png" alt="basic-info" width="30%">

  <img src="snapshots/custom.png" alt="custom" width="30%">

  <img src="snapshots/applicant.png" alt="applicant" width="30%">
</div>

## 运行环境

我自己本地使用的运行环境如下：

1. Node: v4.4.5
2. npm: 2.15.5
3. cnpm: 4.2.0 （用于代替npm，因为使用的是国内的镜像，在大陆下载更快）

## 目录结构

目录主体是通过vue-cli工具生成的，我自己添加的主要是在src目录下的内容

<pre>
.
├── build/                      # webpack配置文件
├── snapshots/                  # app快照
├── config/
│   ├── index.js                # 项目配置文件
├── src/
│   ├── main.js                 # app入口文件
│   ├── App.vue                 # app主组件(component)（Root下一级）
│   ├── views/                  # 各种页面(其实也是组件)
│   ├── components/             # 各种组件(component)
│   ├── styles/                 # 各种样式文件
│   ├── scripts/                # 各种脚本文件
│   ├── mock/                   # 各种模拟数据
│   └── assets/                 # 资源文件 (会被webpack处理)
├── static/                     # 纯静态资源 (直接被复制到生产文件build下，不会被webpack处理)
├── test/
│   └── unit/                   # unit tests
│   │   ├── specs/              # test spec files
│   │   ├── index.js            # test build entry file
│   │   └── karma.conf.js       # test runner config file
│   └── e2e/                    # e2e tests
│   │   ├── specs/              # test spec files
│   │   ├── custom-assertions/  # custom assertions for e2e tests
│   │   ├── runner.js           # test runner script
│   │   └── nightwatch.conf.js  # test runner config file
├── .babelrc                    # babel config
├── .editorconfig.js            # editor config
├── .eslintrc.js                # eslint config
├── index.html                  # index.html模版
└── package.json                # 命令脚本和依赖包
.
</pre>

## 相关文档

* [vue](http://cn.vuejs.org/)

* [vue-cli](https://github.com/vuejs/vue-cli)

* [vuejs-templates](http://vuejs-templates.github.io/webpack/)

* [vue-loader](http://vuejs.github.io/vue-loader)

## LICENSE

ISC