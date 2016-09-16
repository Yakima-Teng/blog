/**
 * Created by Administrator on 4/16.
 */
'use strict'
angular.module('app-base', ['ngSanitize'])
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
      }
    ]
    $rootScope.$httpPost = function (url, data, success, fail, timeout, noPageLoading) {
      if (!noPageLoading) {
        $rootScope.isLoading = true
      }
      $http.post(url, $httpParamSerializerJQLike(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': '*/*'
        },
        timeout: timeout
      }).then(function (resp) {
        if (!noPageLoading) {
          $rootScope.isLoading = false
        }
        if (angular.isFunction(success)) {
          success(resp)
        }
      }, function (resp) {
        if (!noPageLoading) {
          $rootScope.isLoading = false
        }
        if (angular.isFunction(fail)) {
          fail(resp)
        }
      })
    }

    $rootScope.$httpGet = function (url, data, success, fail, timeout, noPageLoading) {
      if (!noPageLoading) {
        $rootScope.isLoading = true
      }
      $http.get(url + ((data) ? '?' : '') + $httpParamSerializerJQLike(data), {timeout: timeout})
        .success(function (data, status, headers, config) {
          if (!noPageLoading) {
            $rootScope.isLoading = false
          }
          if (angular.isFunction(success)) {
            success(data, status, headers, config)
          }
        })
        .error(function (data, status, headers, config) {
          if (!noPageLoading) {
            $rootScope.isLoading = false
          }
          if (angular.isFunction(fail)) {
            fail(data, status, headers, config)
          }
        })
    }

    $rootScope.$httpJSONP = function (url, data, success, fail, timeout, noPageLoading) {
      if (!noPageLoading) {
        $rootScope.isLoading = true
      }
      $http.jsonp(url + '?' + $httpParamSerializerJQLike(data), {timeout: timeout})
        .success(function (data, status, headers, config) {
          if (!noPageLoading) {
            $rootScope.isLoading = false
          }
          if (angular.isFunction(success)) {
            success(data, status, headers, config)
          }
        })
        .error(function (data, status, headers, config) {
          if (!noPageLoading) {
            $rootScope.isLoading = false
          }
          if (angular.isFunction(fail)) {
            fail(data, status, headers, config)
          }
        })
    }

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
     * 给字符串中换行的地方追加p标签
     */
    $rootScope.insertTagP = function (content) {
      // 先判断原文中是否含有html标签，若有的话，只将中间没有内容（空格/tab等也视为无内容）的成对<p></p>标签删除掉，没有html的纯文本才进行标签处理
      console.log(/(<\/a>)|(<\/p>)|(<\/ul>)|(<\/div>)|(<\/dl>)|(<\/article>)|(<\/header>)|(<\/footer>)|(<\/pre>)/.test(content))
      console.log(content)
      if (!/(<\/a>)|(<\/p>)|(<\/ul>)|(<\/div>)|(<\/dl>)|(<\/article>)|(<\/header>)|(<\/footer>)|(<\/pre>)/.test(content)) {
        // replace newline character with html element <p></p>, \u0085代表下一行的字符，\u2028行分隔符，\u2029分段符
        content = '<p>' + content.replace(/\B(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))+\B/g, '</p><p>') + '</p>'
        content = content.replace(/(<p>)\1/g, '$1')
        content = content.replace(/<p>\s*?<\/p>/g, '')
        content = content.replace(/<\/p>\s+?<p>/g, '</p><p>')
        content = content.replace(/<p>(<h[1-6]>)/g, '$1')
        content = content.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
        console.log(content)
      } else {
        content = content.replace(/<p>\s*?<\/p>/g, '')
        content = content.replace(/<\/p>\s+?<p>/g, '</p><p>')
        console.log(content)
      }
      return content
    }

    /**
     * 代码高亮
     */
    $rootScope.highlightCode = function () {
      setTimeout(function () {
        $('pre code').each(function (i, block) {
          hljs.highlightBlock(block)
          if ($(this).hasClass('xml')) {
            console.log('has class xml')
            $(this).text($(this).html())
          }
        })
      }, 0)
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
      var month = date.getMonth() < 9 ? '0' + date.getMonth() : '' + date.getMonth()
      var day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()
      var hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()
      var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
      return [year, month, day].join('-') + ' ' + hour + ':' + minute
    }
  }])
  .filter('hasParentComment', function () {
    return function (originalArray, parentCommentId) {
      var childComments = []
      for (var i = 0, length = originalArray.length; i < length; i++) {
        if (originalArray[i].comment_parent === parentCommentId) {
          childComments.push(originalArray[i])
        }
      }
      return childComments
    }
  })
  .directive('activeLink', ['$location', function ($location) {
    var link = function (scope, element) {
      scope.$watch(function () {
        return $location.path()
      }, function (path) {
        var url = element.attr('href')
        if (path.replace(/[0-9]*$/g, '') === url.replace(/^\/blog\/#/g, '').replace(/[0-9]*$/g, '')) {
          element.addClass('active')
          element.append('<span class="selected"></span>')
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

