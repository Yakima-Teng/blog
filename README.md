# blog

2016年9月15日早上无聊开启手机VPN访问了下AngularJS官网，发现Angular2终于出正式版了，心血来潮之际决定整理一下这个自己业余时间写的前端项目作为对Angular1的告别。主要说明如下：

* 使用了angular.js（1.5.8版本）, angular-sanitize.js, angular-ui-router.js；

* 使用了ES6语法；

* 前端自动化采用的是gulp；

* 该单页应用（SPA）的在线地址为：[http://www.orzzone.com:18080/blog/](http://www.orzzone.com:18080/blog/);

* 界面主体UI不是我设计的,当初是看到一个wordpress博客的样子挺好看的就模仿了过来，然后根据自己的需要修改了下。

## 功能列表

- 支持评论嵌套（最多五层）；
- 支持在文章页根据来源显示对应的上一篇和下一篇文章（比如显示某个分类目录中的上一篇/下一篇文章，比如显示某个月份里的上一篇/下一篇文章）；

## 使用说明

安装所需模块，开启本地服务器：

``` bash
$ npm install # 安装所需依赖包

$ npm run dev # 开发时使用，生成的文件在dev目录下，使用未压缩的.css, .js

$ npm run build # 生成生产环境下使用的文件(dist目录下)，使用压缩的.css, .js
```

通过npm run dev或npm run build命令开启服务后，用浏览器打开ttp://localhost:3000/blog（正常情况下程序会自动打开网页，如果没有自动打开请自行手动打开）即可访问本地demo文件。

实际上执行npm run dev或npm run build与执行gulp dev或gulp build是等价的，具体可以看package.json中scripts的内容。对于开发环境和生产环境，默认都开启了文件监控，因为angular的依赖注入原因，不排除你修改代码后在开发环境下一切正常但切换到生产环境时缺因为js文件压缩的原因在浏览器上出现了报错，为了发现这种问题，在生产环境下也开启了文件监控便于调试。（注意，注入依赖时请一定使用数组形式，否则就会出现这种问题）。

gulp命令相关的task可以直接看gulpfile.js文件，已经美化了注释，可读性还可以，也可以直接在项目根目录开启命令行工具，执行:

``` bash
$ gulp
```

然后你会看到类似下面这样的提示信息：

<div align="center">
  <img src="https://raw.githubusercontent.com/Yakima-Teng/blog/master/snapshots/gulp-help.png" alt="gulp-help" width="99%">
</div>

## 截图

<div align="center">
  <img src="https://raw.githubusercontent.com/Yakima-Teng/blog/master/snapshots/post_English.png" alt="post_English" width="99%">

  <img src="https://raw.githubusercontent.com/Yakima-Teng/blog/master/snapshots/post_Chinese.png" alt="post_Chinese" width="99%">

  <img src="https://raw.githubusercontent.com/Yakima-Teng/blog/master/snapshots/footer.png" alt="footer" width="99%">

  <img src="https://raw.githubusercontent.com/Yakima-Teng/blog/master/snapshots/list.png" alt="list" width="99%">
</div>

## 运行环境

我自己本地使用的运行环境如下：

1. Node: v4.4.5;
2. npm: 3.10.8;
3. cnpm: 4.3.2 （用于代替npm，因为使用的是国内的镜像，在大陆下载更快）。

## 目录结构

dist和dev目录是运行npm run dev/build或其他gulp命令后生成的，git clone本仓库时一开始是没有这些目录的，我们的源文件存放在src目录下。

<pre>
.
├── dev/                        # 用于存放开发环境下生成的文件
├── dist/                       # 用于存放生产环境下生成的文件
├── snapshots/                  # app快照
├── src/
│   ├── index.html              # app入口文件
│   ├── tpls/                   # html模版文件
│   ├── fonts/                  # 字体文件
│   ├── libs/                   # 第三方脚本文件
│   ├── styles/                 # 各种样式文件
│   ├── scripts/                # 各种脚本文件
│   └── assets/                 # 图片文件
├── .gitignore                  # 取消git版本控制的文件/目录
├── .gulpfile.js                # 定义gulp工具的task命令
├── README.md                   # 说明文件
└── package.json                # 命令脚本和依赖包
.
</pre>

## 相关文档

* [AngularJS: API](https://docs.angularjs.org/api)

* [DEMO](http://www.orzzone.com:18080/blog/)

## LICENSE

MIT
