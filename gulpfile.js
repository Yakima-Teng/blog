'use strict'
const gulp = require('gulp')
const path = require('path')
const del = require('del')
const flatten = require('gulp-flatten')
const imagemin = require('gulp-imagemin')
const less = require('gulp-less')
const LessAutoPrefix = require('less-plugin-autoprefix')
const autoPrefix = new LessAutoPrefix({
  browers: ['last 20 versions']
})
const rename = require('gulp-rename')
const minifycss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const proxy = require('http-proxy-middleware')
const templateCache = require('gulp-angular-templatecache')
const htmlreplace = require('gulp-html-replace')
const gulpSequence = require('gulp-sequence')
const babel = require('gulp-babel')

/**
 * *********************************************************************************
 *                                                                                  *
 * 基础配置
 *                                                                                  *
 ***********************************************************************************/
const frontEndPort = 4000
const mockServerPort = 5678
const domain = {
  mock: 'http://127.0.0.1:' + mockServerPort,
  test: 'http://www.orzzone.com:18080'
}
let ENV = 'PRODUCTION'
// 发布后的文件所在目录
let distFolder = path.join(__dirname, 'dist')
// 在url中访问前端文件时，distFolder目录对应的url路径
const urlPathForDistFolder = '/projects/blog/'
// 开发时自动在浏览器中打开的网址
const autoOpenUrl = urlPathForDistFolder + 'index.html'
// 代码源文件所在目录
const sourceFolder = path.join(__dirname, 'src')

/***********************************************************************************
 *                                                                                  *
 * reset value of variable distFolder                                               *
 * will be the first task among series of 'gulp dev' tasks                          *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('before-dev', () => {
  ENV = 'DEVELOPMENT'
  distFolder = path.join(__dirname, 'dev')
  return
})

/***********************************************************************************
 *                                                                                  *
 * reset value of variable distFolder                                               *
 * will be the first task among series of 'gulp build' tasks                        *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('before-build', () => {
  ENV = 'PRODUCTION'
  distFolder = path.join(__dirname, 'dist')
  return
})

/***********************************************************************************
 *                                                                                  *
 * copy index.html from SOURCE folder to DEST folder                                *
 * this task will be explilcitly called under 'gulp dev' command                    *
 * and implicitly called under 'gulp build' command by calling task 'html-replace'  *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('copy-index', () => {
  if (ENV === 'DEVELOPMENT') {
    return gulp.src(path.join(sourceFolder, 'index.html'))
      .pipe(gulp.dest(distFolder))
      .pipe(browserSync.stream())
  } else {
    return gulp.src(path.join(sourceFolder, 'index.html'))
      .pipe(gulp.dest(distFolder))
  }
})

/***********************************************************************************
 *                                                                                  *
 * replace linked uncompressed .css, .js files to compressed ones                   *
 * this task will only be called under 'gulp build' command                         *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('html-replace', ['copy-index'], () => {
  return gulp.src(path.join(distFolder, 'index.html'))
    .pipe(htmlreplace({
      'css': 'css/app.min.css',
      'third': 'js/third.min.js',
      'app': 'js/app.min.js'
    }))
    .pipe(gulp.dest(distFolder))
    .pipe(browserSync.stream())
})

/***********************************************************************************
 *                                                                                  *
 * copy and minify images                                                           *
 * from SOURCE /assets folder to DEST /img folder                                        *
 * with original folder structure removed (it's structure that was removed)         *
 * this task will be called under both 'gulp dev' and 'gulp build' command          *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('copy-and-minify-images', () => {
  return gulp.src([
    path.join(sourceFolder, 'assets', '**', '*.jpg'),
    path.join(sourceFolder, 'assets', '**', '*.jpeg'),
    path.join(sourceFolder, 'assets', '**', '*.png'),
    path.join(sourceFolder, 'assets', '**', '*.gif'),
    path.join(sourceFolder, 'assets', '**', '*.ico')
  ])
  .pipe(flatten())
  .pipe(imagemin())
  .pipe(gulp.dest(path.join(distFolder, 'img')))
  .pipe(browserSync.stream())
})

/***********************************************************************************
 *                                                                                  *
 * copy files under SOURCE /tpls to DEST /tpls                                          *
 * not used now, so commented                                                       *
 * remained for future use, so do not delete these commented lines                  *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('copy-templates', () => {
  return gulp.src(path.join(sourceFolder, 'tpls', '**', '*.html'))
    .pipe(gulp.dest(path.join(distFolder, 'tpls')))
    .pipe(browserSync.stream())
})

/***********************************************************************************
 *                                                                                  *
 * cache angular templates                                                          *
 * will be called under both 'gulp dev' and 'gulp build' commands                   *
 * by and large, only one of this task and 'copy-templates' will be active          *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('cache-templates', () => {
  return gulp.src(path.join(sourceFolder, 'tpls', '**', '*.html'))
    .pipe(templateCache('templates.js', {
      root: 'tpls/',
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(path.join(sourceFolder, 'scripts', 'temp')))
})

/***********************************************************************************
 *                                                                                  *
 * copy fonts under SOURCE /fonts to DEST /fonts                                    *
 * will be called under both 'gulp dev' and 'gulp build' commands                   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('copy-fonts', () => {
  return gulp.src(path.join(sourceFolder, 'fonts', '*.*'))
    .pipe(gulp.dest(path.join(distFolder, 'fonts')))
})

/***********************************************************************************
 *                                                                                  *
 * transform app.less in SOURCE /styles to app(.min).css files in DEST /css         *
 * will be called under both 'gulp dev' and 'gulp build' commands                   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('less', () => {
  if (ENV === 'DEVELOPMENT') {
    return gulp.src(path.join(sourceFolder, 'styles', 'app.less'))
      .pipe(less({
        paths: [path.join(sourceFolder, 'styles')],
        plugins: [autoPrefix]
      }))
      .on('error', e => console.log(e))
      // ouput app.css
      .pipe(gulp.dest(path.join(distFolder, 'css')))
      .pipe(browserSync.stream())
  } else {
    return gulp.src(path.join(sourceFolder, 'styles', 'app.less'))
      .pipe(less({
        paths: [path.join(sourceFolder, 'styles')],
        plugins: [autoPrefix]
      }))
      .on('error', e => console.log(e))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(minifycss({}))
      // output app.min.css
      .pipe(gulp.dest(path.join(distFolder, 'css')))
      .pipe(browserSync.stream())
  }
})

/***********************************************************************************
 *                                                                                  *
 * concatenate states files to SOURCE /scripts/temp/app-states.js                   *
 * will be called implicitly under both 'gulp dev' and 'gulp build' commands        *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('js-states', () => {
  return gulp.src([path.join(sourceFolder, 'scripts', 'states', '**', '*.js')])
    .pipe(concat('app-states.js'))
    .pipe(gulp.dest(path.join(sourceFolder, 'scripts', 'temp')))
})

/***********************************************************************************
 *                                                                                  *
 * concatenate third party .js files to DEST /js/third(.min).js                     *
 * these files won't be revised in high frequency                                   *
 * so extracted as a single files to take advantage in browser cache                *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('third', () => {
  if (ENV === 'DEVELOPMENT') {
    return gulp.src([
      path.join(sourceFolder, 'libs', 'jquery-1.12.2.js'),
      path.join(sourceFolder, 'libs', 'angular.js'),
      path.join(sourceFolder, 'libs', 'angular-animate.js'),
      path.join(sourceFolder, 'libs', 'angular-sanitize.js'),
      path.join(sourceFolder, 'libs', 'angular-ui-router.js'),
      path.join(sourceFolder, 'libs', 'tooltip.js'),
      path.join(sourceFolder, 'libs', 'highlight.pack.js')
    ])
      // important: files will be concatenated in the order specified in gulp.src
      .pipe(concat('third.js'))
      // output non-minified version
      .pipe(gulp.dest(path.join(distFolder, 'js')))
  } else {
    return gulp.src([
      path.join(sourceFolder, 'libs', 'jquery-1.12.2.js'),
      path.join(sourceFolder, 'libs', 'angular.js'),
      path.join(sourceFolder, 'libs', 'angular-animate.js'),
      path.join(sourceFolder, 'libs', 'angular-sanitize.js'),
      path.join(sourceFolder, 'libs', 'angular-ui-router.js'),
      path.join(sourceFolder, 'libs', 'tooltip.js'),
      path.join(sourceFolder, 'libs', 'highlight.pack.js')
    ])
      // important: files will be concatenated in the order specified in gulp.src
      .pipe(concat('third.js'))
      // output minified version
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest(path.join(distFolder, 'js')))
  }
})

/***********************************************************************************
 *                                                                                  *
 * produce DEST /scripts/app(.min).js files                                         *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('js', ['js-states', 'cache-templates'], () => {
  if (ENV === 'DEVELOPMENT') {
    return gulp.src([
      path.join(sourceFolder, 'scripts', 'app-base.js'),
      path.join(sourceFolder, 'scripts', 'temp', 'templates.js'),
      path.join(sourceFolder, 'scripts', 'temp', 'app-states.js'),
      path.join(sourceFolder, 'scripts', 'app.js')
    ])
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(path.join(distFolder, 'js')))
    .pipe(browserSync.stream())
  } else {
    return gulp.src([
      path.join(sourceFolder, 'scripts', 'app-base.js'),
      path.join(sourceFolder, 'scripts', 'temp', 'templates.js'),
      path.join(sourceFolder, 'scripts', 'temp', 'app-states.js'),
      path.join(sourceFolder, 'scripts', 'app.js')
    ])
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.join(distFolder, 'js')))
    .pipe(browserSync.stream())
  }
})

/***********************************************************************************
 *                                                                                  *
 * empty dist folder                                                                *
 * will be called as first task among series of 'gulp dev' or 'gulp build' tasks    *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('clean', () => {
  return del([distFolder])
})

/***********************************************************************************
 *                                                                                  *
 * create a localhost server                                                        *
 * with proxy set for '/blog/v1' to target server
 *                                                                                  *
 ***********************************************************************************/

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true,
      routes: {
        [urlPathForDistFolder]: distFolder
      }
    },
    port: frontEndPort,
    startPath: autoOpenUrl,
    middleware: [
      proxy('/blog/v1', { target: domain.test, changeOrigin: true })
    ]
  })
})

/***********************************************************************************
 *                                                                                  *
 * set task 'help' as the default gulp task                                         *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('default', () => {
  return gulp.start('help')
})

/***********************************************************************************
 *                                                                                  *
 * watch function                                                                   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('watch', () => {
  if (ENV === 'DEVELOPMENT') {
    gulp.watch(path.join(sourceFolder, 'index.html'), ['copy-index']).on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running task \"copy-index\"...`)
    })
  } else {
    gulp.watch(path.join(sourceFolder, 'index.html'), ['html-replace']).on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running task \"copy-index\"...`)
    })
  }
  gulp.watch([
    path.join(sourceFolder, 'assets', '**', '*.jpg'),
    path.join(sourceFolder, 'assets', '**', '*.jpeg'),
    path.join(sourceFolder, 'assets', '**', '*.png'),
    path.join(sourceFolder, 'assets', '**', '*.gif'),
    path.join(sourceFolder, 'assets', '**', '*.ico')
  ], ['copy-and-minify-images'])
    .on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running task \"copy-and-minify-images\"...`)
    })
  gulp.watch([
    path.join(sourceFolder, 'styles', '**', '*.less'),
    path.join(sourceFolder, 'styles', '**', '*.css')
  ], ['less'])
    .on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running task \"less\"...`)
    })
  gulp.watch([
    path.join(sourceFolder, 'scripts', 'states', '**', '*.js'),
    path.join(sourceFolder, 'scripts', 'app-base.js'),
    path.join(sourceFolder, 'tpls', '**', '*.html'),
    path.join(sourceFolder, 'scripts', 'app.js'),
  ], ['js']).on('change', event => {
    console.log(`File ${event.path} was ${event.type}, running task \"js\"...`)
  })
  return
})

/***********************************************************************************
 *                                                                                  *
 * simple tip words after 'gulp build' command                                      *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('after-build', ['watch'], () => {
  console.log(`Build operation completed! Please open localhost:${frontEndPort + autoOpenUrl} to see the website`)
  return
})

/***********************************************************************************
 *                                                                                  *
 * simple tip words after 'guld dev' command                                        *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('after-dev', ['watch'], () => {
  console.log(`Dev operation completed! Please wait to open localhost:${frontEndPort + autoOpenUrl}/blog/ to see the website`)
  return
})
/***********************************************************************************
 *                                                                                  *
 * files will be produced under dist folder                                         *
 * watch is not available under 'gulp build' command                                *
 * 'connect' task is excuted for convenient checkinig purpose                       *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('build', gulpSequence('before-build', ['clean', 'browser-sync'], ['html-replace', 'third', 'copy-and-minify-images', 'copy-fonts', 'less', 'js'], 'after-build'))

/***********************************************************************************
 *                                                                                  *
 * files will be produced under dev folder                                          *
 * almost same tasks as 'gulp build' command excerpt for available watch function   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('dev', gulpSequence('before-dev', ['clean', 'browser-sync'], ['copy-index', 'third', 'copy-and-minify-images', 'copy-fonts', 'less', 'js'], 'after-dev'))

/***********************************************************************************
 *                                                                                  *
 * great help guide                                                                 *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('help', () => {
  console.log(' -------------------------------- 说明开始 --------------------------------')
  console.log(` 运行gulp dev命令后，在浏览器上访问localhost:${port}即可访问本Angular DEMO，修改html、less、js文件后页面将自动刷新`)
  console.log(' gulp clean                      清空dist目录下的文件')
  console.log(' gulp copy-index                 复制index.html文件到dist目录')
  console.log(' gulp copy-and-minify-images     复制并压缩图片文件到dist/img目录(移除原目录结构)')
  console.log(' gulp third                      将src/libs中引用的第三方js合并后输出到dist/js/third(.min).js')
  console.log(' gulp copy-templates             将src/templates下的模版文件拷贝到dist/tpls目录下')
  console.log(' gulp cache-templates            将html模版文件转成javascript形式附加到Angular的缓存中，避免了对模版文件的ajax请求')
  console.log(' gulp copy-fonts                 将src/fonts下的字体文件拷贝至dist/fonts目录下')
  console.log(' gulp less                       将src/styles/app.less文件编译(并添加浏览器厂商前缀)到dist/css下并命名为app(.min).css')
  console.log(' gulp js-states                  将src/scripts/states目录下的视图controllers合并到src/scripts/temp/app-states.js')
  console.log(' gulp js                         合并src/scripts/下我们自己写的js源文件至dist/js/app(.min).js')
  console.log(' gulp build                      执行多种开发任务，启用压缩的样式和脚本文件，并对经常修改的脚本、样式、html、图片文件开启了监听自动刷新功能')
  console.log(' gulp dev                        基本同gulp build，但文件生成目录由build改为dev，并且启用的是未压缩的样式和脚本文件')
  console.log(' -------------------------------- 说明结束 --------------------------------')
})
