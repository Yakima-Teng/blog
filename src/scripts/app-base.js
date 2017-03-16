/**
 * Created by Administrator on 4/16.
 */
angular.module('app-base', ['ngSanitize', 'ngAnimate'])
  .run(['$rootScope', '$http', '$httpParamSerializerJQLike', function ($rootScope, $http, $httpParamSerializerJQLike) {
    $rootScope.pageTitle = '滕运锋 | Yakima Teng'
    $rootScope.friends = [
      {
        url: 'http://www.kun.la/',
        name: '马力'
      },
      {
        url: 'http://www.tipskill.com/',
        name: 'TipSkill药学博客'
      },
      {
        url: 'http://www.ruanyifeng.com/blog/',
        name: '阮一峰'
      },
      {
        url: 'http://www.orzzone.com/blog/wp-admin',
        name: '管理'
      }
    ]
    $rootScope.menus = [
      {
        menu: 'Pharmaceuticals',
        title: '药学资讯',
        tip: '侧重点为药品注册相关的文章，多数来自互联网',
        href: '/blog/#/categories/pharmaceutical-information/1',
        fontAwesomeIconClass: 'fa-line-chart'
      },
      {
        menu: 'Html',
        title: 'HTML',
        tip: 'All are about html',
        href: '/blog/#/categories/html/1',
        fontAwesomeIconClass: 'fa-html5'
      },
      {
        menu: 'CSS',
        title: 'CSS',
        tip: 'Bootstrap, WechatUI, CSS2&3 and more',
        href: '/blog/#/categories/css/1',
        fontAwesomeIconClass: 'fa-css3'
      },
      {
        menu: 'JavaScript',
        title: 'JavaScript',
        tip: 'AngularJS, VueJS, jQuery and more',
        href: '/blog/#/categories/javascript/1',
        fontAwesomeIconClass: 'fa-line-chart'
      },
      {
        menu: 'About',
        title: '关于',
        tip: '关于博主和这个站点的一些介绍',
        href: '/blog/#/pages/about',
        fontAwesomeIconClass: 'fa-gitlab'
      }
    ]

    /**
     * 根据userAgent判断浏览器类型
     * 参考资料：https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
     */
    $rootScope.judgeBrowser = function (userAgent) {
      var ua = userAgent.toLowerCase()
      var version = ''
      // firefox UA demo: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'
      if (/firefox/.test(ua) && !/seamonkey/.test(ua)) {
        version = ua.match(/firefox\/([0-9\.]+)/)[1].split('.')[0]
        return 'Firefox' + '@' + version
      }
      // Edge UA demo：'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586'
      if (ua.indexOf('edge') > -1) {
        version = ua.match(/edge\/([0-9\.]+)/)[1].split('.')[0]
        return 'Edge' + '@' + version
      }
      // Opera 12-
      if (ua.indexOf('opera') > -1) {
        version = ua.match(/opera\/([0-9\.]+)/)[1].split('.')[0]
        return 'Opera' + '@' + version
      }
      // Opera 15+
      if (ua.indexOf('opr') > -1) {
        version = ua.match(/opr\/([0-9\.]+)/)[1].split('.')[0]
        return 'Opera' + '@' + version
      }
      // Seamonkey
      if (ua.indexOf('seamonkey') > -1) {
        version = ua.match(/seamonkey\/([0-9\.]+)/)
        return 'Seamonkey' + '@' + version
      }
      // Chromium
      if (ua.indexOf('chromium') > -1) {
        version = ua.match(/chromium\/([0-9\.]+)/)[1].split('.')[0]
        return 'Chromium' + '@' + version
      }
      // chrome UA demo: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
      if (ua.indexOf('chrome') > -1 && !/chromium|edge/.test(ua)) {
        version = ua.match(/chrome\/([0-9\.]+)/)[1].split('.')[0]
        return 'chrome' + '@' + version
      }
      // safari
      if (ua.indexOf('safari') > -1 && !/(chrome|chromium|edge)/.test(ua)) {
        version = ua.match(/safari\/([0-9\.])+/)[1].split('.')[0]
        return 'Safari' + '@' + version
      }
      // IE11
      // IE11浏览器UA示例：'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3; rv:11.0) like Gecko'
      if (/window.*trident.*rv:11\.0/.test(ua)) {
        version = ua.match(/rv:([0-9\.]+)/)[1].split('.')[0]
        return 'Internet Explorer' + '@' + version
      }
      // IE6-10
      // IE10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
      // IE9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
      // IE8: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
      // IE7: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
      // IE6: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)'
      if (/; msie/.test(ua)) {
        version = ua.match(/msie\s([0-9\.]+)/)[1].split('.')[0]
        return 'Internet Explorer' + '@' + version
      }
      // 其他情况下返回未知浏览器
      return '神奇浏览器'
    }

    /**
     * 格式化日期，输出'2016-06-20 13:26'格式的字符串
     */
    $rootScope.formatDate = function (date) {
      date = new Date(date)
      if (isNaN(date.valueOf())) {
        return 'Amazing Date'
      }
      var year = date.getFullYear()
      var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)
      var day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()
      var hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()
      var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
      return [year, month, day].join('-') + ' ' + hour + ':' + minute
    }
  }])
  .service('Api', ['$rootScope', '$http', '$httpParamSerializerJQLike', function ($rootScope, $http, $httpParamSerializerJQLike) {
    let _this = this
    const originDomain = window.location.href.indexOf('localhost') === -1 ? `${location.protocol}//www.orzzone.com:18080` : ''
    _this.get = (url, params) => {
      const promise = $http({
        method: 'GET',
        url: originDomain + url,
        params: params || {},
        timeout: 30000
      })
      return promise
    }
    _this.post = (url, data) => {
      const promise = $http({
        method: 'POST',
        url: originDomain + url,
        data: data || {},
        timeout: 30000
      })
      return promise
    }
    /**
     * 代码高亮
     */
    _this.highlightCode = () => {
      setTimeout(function () {
        $('pre code').each(function (i, block) {
          hljs.highlightBlock(block)
          if ($(this).hasClass('xml')) {
            $(this).text($(this).html())
          }
        })
      }, 0)
    }
    /**
     * 给字符串中换行的地方追加p标签
     */
    _this.insertTagP = (content) => {
      // 先判断原文中是否含有html标签，若有的话，只将中间没有内容（空格/tab等也视为无内容）的成对<p></p>标签删除掉，没有html的纯文本才进行标签处理
      if (!/(<\/a>)|(<\/p>)|(<\/ul>)|(<\/div>)|(<\/dl>)|(<\/article>)|(<\/header>)|(<\/footer>)|(<\/pre>)/.test(content)) {
        // replace newline character with html element <p></p>, \u0085代表下一行的字符，\u2028行分隔符，\u2029分段符
        content = '<p>' + content.replace(/\B(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))+\B/g, '</p><p>') + '</p>'
        content = content.replace(/(<p>)\1/g, '$1')
        content = content.replace(/<p>\s*?<\/p>/g, '')
        content = content.replace(/<\/p>\s+?<p>/g, '</p><p>')
        content = content.replace(/<p>(<h[1-6]>)/g, '$1')
        content = content.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      } else {
        content = content.replace(/<p>\s*?<\/p>/g, '')
        content = content.replace(/<\/p>\s+?<p>/g, '</p><p>')
      }
      return content
    }
  }])
  .filter('hasParentComment', [function () {
    return function (originalArray, parentCommentId) {
      return originalArray.filter((elem, index, arr) => {
        return elem.comment_parent_id === parentCommentId
      })
    }
  }])
  .directive('activeLink', ['$location', function ($location) {
    const link = (scope, element) => {
      scope.$watch(() => {
        return $location.path()
      }, (path) => {
        const url = element.attr('href')
        if (path.replace(/[0-9]*$/g, '') === url.replace(/^\/blog\/#/g, '').replace(/[0-9]*$/g, '')) {
          element.addClass('active')
          if (element.find('span.selected').length < 1) {
            element.append('<span class="selected"></span>')
          }
        } else {
          element.removeClass('active')
          element.find('span.selected').remove()
        }
      })
    }
    return {
      restrict: 'A',
      link: link
    }
  }])
  .directive('appFooter', [function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'tpls/footer.html',
      scope: false
    }
  }])
  .directive('appSidebar', [function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'tpls/sidebar.html',
      scope: false
    }
  }])
  .directive('appHeader', [function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'tpls/header.html',
      scope: false
    }
  }])
