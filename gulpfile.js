'use strict'
const gulp = require('gulp')
const path = require('path')
const del = require('del')
const flatten = require('gulp-flatten')
const imagemin = require('gulp-imagemin')
const less = require('gulp-less')
const LessAutoPrefix = require('less-plugin-autoprefix')
const autoPrefix = new LessAutoPrefix({
  browers: ['last 2 versions']
})
const rename = require('gulp-rename')
const minifycss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')
const templateCache = require('gulp-angular-templatecache')
const htmlreplace = require('gulp-html-replace')
const gulpSequence = require('gulp-sequence')
const babel = require('gulp-babel')

const SOURCE = './src/'
let WWW = 'dist/'
let DEST = './' + WWW + 'blog/'
let port = 3000

/***********************************************************************************
 *                                                                                  *
 * reset value of variables WWW and DEST                                            *
 * will be the first task among series of 'gulp dev' tasks                          *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('before-dev', () => {
  WWW = 'dev/'
  DEST = './' + WWW + 'blog/'
  return
})

/***********************************************************************************
 *                                                                                  *
 * reset value of variables WWW and DEST                                            *
 * will be the first task among series of 'gulp build' tasks                        *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('before-build', () => {
  WWW = 'dist/'
  DEST = './' + WWW + 'blog/'
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
  return gulp.src(SOURCE + 'index.html')
    .pipe(gulp.dest(DEST))
    .pipe(connect.reload())
})

/***********************************************************************************
 *                                                                                  *
 * replace linked uncompressed .css, .js files to compressed ones                   *
 * this task will only be called under 'gulp build' command                         *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('html-replace', ['copy-index'], () => {
  return gulp.src(DEST + 'index.html')
    .pipe(htmlreplace({
      'css': 'css/app.min.css',
      'third': 'js/third.min.js',
      'app': 'js/app.min.js'
    }))
    .pipe(gulp.dest(DEST))
    .pipe(connect.reload())
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
    SOURCE + 'assets/**/*.jpg',
    SOURCE + 'assets/**/*.jpeg',
    SOURCE + 'assets/**/*.png',
    SOURCE + 'assets/**/*.gif',
    SOURCE + 'assets/**/*.ico'
  ])
  .pipe(flatten())
  .pipe(imagemin())
  .pipe(gulp.dest(DEST + 'img'))
  .pipe(connect.reload())
})

/***********************************************************************************
 *                                                                                  *
 * copy files under SOURCE /tpls to DEST /tpls                                          *
 * not used now, so commented                                                       *
 * remained for future use, so do not delete these commented lines                  *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('copy-templates', () => {
  return gulp.src(SOURCE + 'tpls/**/*.html')
    .pipe(gulp.dest(DEST + 'tpls'))
    .pipe(connect.reload())
})

/***********************************************************************************
 *                                                                                  *
 * cache angular templates                                                          *
 * will be called under both 'gulp dev' and 'gulp build' commands                   *
 * by and large, only one of this task and 'copy-templates' will be active          *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('cache-templates', () => {
  return gulp.src(SOURCE + 'tpls/**/*.html')
    .pipe(templateCache('templates.js', {
      root: 'tpls/',
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(SOURCE + 'scripts/temp'))
})

/***********************************************************************************
 *                                                                                  *
 * copy fonts under SOURCE /fonts to DEST /fonts                                    *
 * will be called under both 'gulp dev' and 'gulp build' commands                   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('copy-fonts', () => {
  return gulp.src(SOURCE + 'fonts/*.*')
    .pipe(gulp.dest(DEST + 'fonts'))
})

/***********************************************************************************
 *                                                                                  *
 * transform app.less in SOURCE /styles to app(.min).css files in DEST /css         *
 * will be called under both 'gulp dev' and 'gulp build' commands                   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('less', () => {
  return gulp.src(SOURCE + 'styles/app.less')
    .pipe(less({
      paths: [path.join(__dirname, 'src', 'styles')],
      plugins: [autoPrefix]
    }))
    .on('error', e => console.log(e))
    // ouput app.css
    .pipe(gulp.dest(DEST + 'css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss({
      compatibility: 'ie8'
    }))
    // output app.min.css
    .pipe(gulp.dest(DEST + 'css'))
    .pipe(connect.reload())
})

/***********************************************************************************
 *                                                                                  *
 * concatenate states files to SOURCE /scripts/temp/app-states.js                   *
 * will be called implicitly under both 'gulp dev' and 'gulp build' commands        *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('js-states', () => {
  return gulp.src([SOURCE + 'scripts/states/**/*.js'])
    .pipe(concat('app-states.js'))
    .pipe(gulp.dest(SOURCE + 'scripts/temp'))
})

/***********************************************************************************
 *                                                                                  *
 * concatenate third party .js files to DEST /js/third(.min).js                     *
 * these files won't be revised in high frequency                                   *
 * so extracted as a single files to take advantage in browser cache                *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('third', () => {
  return gulp.src([
    SOURCE + 'libs/jquery-1.12.2.js',
    SOURCE + 'libs/angular.js',
    SOURCE + 'libs/angular-animate.js',
    SOURCE + 'libs/angular-sanitize.js',
    SOURCE + 'libs/angular-ui-router.js',
    SOURCE + 'libs/tooltip.js',
    SOURCE + 'libs/highlight.pack.js'
  ])
    // important: files will be concatenated in the order specified in gulp.src
    .pipe(concat('third.js'))
    // output non-minified version
    .pipe(gulp.dest(DEST + 'js'))
    // output minified version
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(DEST + 'js'))
})

/***********************************************************************************
 *                                                                                  *
 * produce DEST /scripts/app(.min).js files                                         *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('js', ['js-states', 'cache-templates'], () => {
  return gulp.src([
    SOURCE + 'scripts/app-base.js',
    SOURCE + 'scripts/temp/templates.js',
    SOURCE + 'scripts/temp/app-states.js',
    SOURCE + 'scripts/app.js'
  ])
  .pipe(concat('app.js'))
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest(DEST + 'js'))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(DEST + 'js'))
  .pipe(connect.reload())
})

/***********************************************************************************
 *                                                                                  *
 * empty dist folder                                                                *
 * will be called as first task among series of 'gulp dev' or 'gulp build' tasks    *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('clean', () => {
  return del([WWW])
})

/***********************************************************************************
 *                                                                                  *
 * create a localhost server                                                        *
 * with proxy set for '/blog/v1' to target server
 *                                                                                  *
 ***********************************************************************************/
gulp.task('connect', () => {
  connect.server({
    root: WWW,
    port: port,
    livereload: true,
    middleware (connect, opt) {
      return [
        proxy('/blog/v1', {
          // target: 'http://localhost:18080',
          target: 'http://yakima.duapp.com',
          changeOrigin: true
        })
      ]
    }
  })
  return
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
  gulp.watch(SOURCE + 'index.html', ['copy-index']).on('change', event => {
    console.log(`File ${event.path} was ${event.type}, running task \"copy-index\"...`)
  })
  gulp.watch([
    SOURCE + 'assets/**/*.jpg',
    SOURCE + 'assets/**/*.jpeg',
    SOURCE + 'assets/**/*.png',
    SOURCE + 'assets/**/*.gif'
  ], ['copy-and-minify-images'])
    .on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running task \"copy-and-minify-images\"...`)
    })
  gulp.watch([
    SOURCE + 'styles/**/*.less',
    SOURCE + 'styles/**/*.css'
  ], ['less'])
    .on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running task \"less\"...`)
    })
  gulp.watch([
    SOURCE + 'scripts/states/**/*.js',
    SOURCE + 'scripts/app-base.js',
    SOURCE + 'tpls/**/*.html',
    SOURCE + 'scripts/app.js'
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
  console.log(`Build operation completed! Open localhost:${port}/blog to see the website`)
  return
})

/***********************************************************************************
 *                                                                                  *
 * simple tip words after 'guld dev' command                                        *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('after-dev', ['watch'], () => {
  console.log(`Dev operation completed! Open localhost:${port}/blog to see the website`)
  return
})
/***********************************************************************************
 *                                                                                  *
 * files will be produced under dist folder                                         *
 * watch is not available under 'gulp build' command                                *
 * 'connect' task is excuted for convenient checkinig purpose                       *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('build', gulpSequence('before-build', ['clean', 'connect'], ['html-replace', 'third', 'copy-and-minify-images', 'copy-fonts', 'less', 'js'], 'after-build'))

/***********************************************************************************
 *                                                                                  *
 * files will be produced under dev folder                                          *
 * almost same tasks as 'gulp build' command excerpt for available watch function   *
 *                                                                                  *
 ***********************************************************************************/
gulp.task('dev', gulpSequence('before-dev', ['clean', 'connect'], ['copy-index', 'third', 'copy-and-minify-images', 'copy-fonts', 'less', 'js'], 'after-dev'))

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