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

const SOURCE = './src/'
const DEST = './dist/blog/'
const port = 3000

// copy index.html from src folder to dist folder while original file still exists
gulp.task('copy-index', () => {
  return gulp.src(SOURCE + 'index.html')
    .pipe(gulp.dest(DEST))
    .pipe(connect.reload())
})

// copy and minify images from src/assets folder to dist/img folder with original folder structure removed
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

/**
 * copy files under src/tpls to build/tpls
 */
// gulp.task('copy-templates', () => {
//   return gulp.src(SOURCE + 'tpls/**/*.html')
//     .pipe(gulp.dest(DEST + 'tpls'))
//     .pipe(connect.reload())
// })

// cache angular templates
gulp.task('cache-templates', () => {
  return gulp.src(SOURCE + 'tpls/**/*.html')
    .pipe(templateCache('templates.js', {
      root: 'tpls/',
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(SOURCE + 'scripts'))
    // .pipe(connect.reload())
})

// copy fonts under src/fonts to build/fonts
gulp.task('copy-fonts', () => {
  return gulp.src(SOURCE + 'fonts/*.*')
    .pipe(gulp.dest(DEST + 'fonts'))
})

// transform app.less file in src/styles to app.css and app.min.css files in dist/css
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

gulp.task('js-states', () => {
  return gulp.src([SOURCE + 'scripts/states/**/*.js'])
    .pipe(concat('app-states.js'))
    .pipe(gulp.dest(SOURCE + 'scripts/temp'))
})
// tidy third-party javascript files in src/references to third.js and third.min.js under dist/js
// these files won't be revised in high frequency and in most case won't be revised
// therefore they can be transformed in one single file to store in user browser clients
gulp.task('third', () => {
  return gulp.src([
    SOURCE + 'references/jquery-1.12.2.js',
    SOURCE + 'references/angular.js',
    // SOURCE + 'references/angular-router.js',
    SOURCE + 'references/angular-sanitize.js',
    SOURCE + 'references/angular-ui-router.js',
    SOURCE + 'references/tooltip.js',
    SOURCE + 'references/highlight.pack.js'
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

gulp.task('js', ['js-states', 'cache-templates'], () => {
  return gulp.src([
    SOURCE + 'scripts/app-base.js',
    SOURCE + 'scripts/templates.js',
    SOURCE + 'scripts/temp/app-states.js',
    SOURCE + 'scripts/app.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest(DEST + 'js'))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(DEST + 'js'))
  .pipe(connect.reload())
})

// empty dist folder
gulp.task('clean', () => {
  return del([DEST + '**/*'])
})

gulp.task('connect', () => {
  connect.server({
    root: 'dist/',
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
})

// help guide
gulp.task('help', () => {
  console.log(' -------------------------------- 说明开始 --------------------------------')
  console.log(` 运行gulp dev命令后，在浏览器上访问localhost:${port}即可访问本Angular DEMO，修改html、less、js文件后页面将自动刷新`)
  console.log(' gulp clean                      清空dist目录下的文件')
  console.log(' gulp copy-index                 复制index.html文件到dist目录')
  console.log(' gulp copy-and-minify-images     复制并压缩图片文件到dist/img目录(移除原目录结构)')
  console.log(' gulp third                      将src/references中引用的第三方js合并后输出到dist/js/third(.min).js')
  console.log(' gulp copy-templates             将src/templates下的模版文件拷贝到dist/tpls目录下')
  console.log(' gulp copy-fonts                 将src/fonts下的字体文件拷贝至dist/fonts目录下')
  console.log(' gulp less                       将src/styles/app.less文件编译(并添加浏览器厂商前缀)到dist/css下并命名为app(.min).css')
  console.log(' gulp js-states                  将src/scripts/states目录下的视图controllers合并到src/scripts/temp/app-states.js')
  console.log(' gulp js                         合并src/scripts/app.js && app-base.js和src/scripts/temp/app-states.js至dist/js/app(.min).js')
  console.log(' gulp dev                        执行上述各种任务，并对经常修改的脚本、样式、html、图片文件开启了监听自动刷新功能')
  console.log(' gulp build                      同gulp dev，但不会开启文件监听')
  console.log(' -------------------------------- 说明结束 --------------------------------')
})

gulp.task('default', () => {
  return gulp.start('help')
})

gulp.task('build', ['copy-index', 'third', 'copy-and-minify-images', 'copy-templates', 'copy-fonts', 'less', 'js'], () => {
  console.log('Congratulations! You have successfully completed the build operation.')
})

gulp.task('dev', ['connect', 'copy-index', 'third', 'copy-and-minify-images', 'copy-fonts', 'less', 'js'], () => {
  console.log('Congratulations! You have successfully completed the dev operation.')
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
  // gulp.watch(SOURCE + 'tpls/**/*.html', ['cache-templates']).on('change', event => {
  //   console.log(`File ${event.path} was ${event.type}, running task \"cache-templates\"...`)
  // })
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
    // SOURCE + 'scripts/temp/app-states.js',
    // SOURCE + 'scripts/templates.js',
    SOURCE + 'tpls/**/*.html',
    SOURCE + 'scripts/app.js'
  ], ['js']).on('change', event => {
    console.log(`File ${event.path} was ${event.type}, running task \"js\"...`)
  })
})
