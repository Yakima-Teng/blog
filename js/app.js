'use strict';

/**
 * Created by Administrator on 4/16.
 */
angular.module('app-base', ['ngSanitize', 'ngAnimate']).run(['$rootScope', '$http', '$httpParamSerializerJQLike', function ($rootScope, $http, $httpParamSerializerJQLike) {
  $rootScope.pageTitle = '滕运锋 | Yakima Teng';
  $rootScope.friends = [{
    url: 'http://www.kun.la/',
    name: '马力'
  }, {
    url: 'http://www.tipskill.com/',
    name: 'TipSkill药学博客'
  }, {
    url: 'http://www.ruanyifeng.com/blog/',
    name: '阮一峰'
  }, {
    url: 'http://www.orzzone.com/wp-admin',
    name: '管理'
  }];
  $rootScope.menus = [{
    menu: 'Pharmaceuticals',
    title: '药学资讯',
    tip: '侧重点为药品注册相关的文章，多数来自互联网',
    href: '/blog/#/categories/pharmaceutical-information/1',
    fontAwesomeIconClass: 'fa-line-chart'
  }, {
    menu: 'Html',
    title: 'HTML',
    tip: 'All are about html',
    href: '/blog/#/categories/html/1',
    fontAwesomeIconClass: 'fa-html5'
  }, {
    menu: 'CSS',
    title: 'CSS',
    tip: 'Bootstrap, WechatUI, CSS2&3 and more',
    href: '/blog/#/categories/css/1',
    fontAwesomeIconClass: 'fa-css3'
  }, {
    menu: 'JavaScript',
    title: 'JavaScript',
    tip: 'AngularJS, VueJS, jQuery and more',
    href: '/blog/#/categories/javascript/1',
    fontAwesomeIconClass: 'fa-line-chart'
  }, {
    menu: 'About',
    title: '关于',
    tip: '关于博主和这个站点的一些介绍',
    href: '/blog/#/pages/about',
    fontAwesomeIconClass: 'fa-gitlab'
  }];

  /**
   * 根据userAgent判断浏览器类型
   * 参考资料：https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
   */
  $rootScope.judgeBrowser = function (userAgent) {
    var ua = userAgent.toLowerCase();
    var version = '';
    // firefox UA demo: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'
    if (/firefox/.test(ua) && !/seamonkey/.test(ua)) {
      version = ua.match(/firefox\/([0-9\.]+)/)[1].split('.')[0];
      return 'Firefox' + '@' + version;
    }
    // Edge UA demo：'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586'
    if (ua.indexOf('edge') > -1) {
      version = ua.match(/edge\/([0-9\.]+)/)[1].split('.')[0];
      return 'Edge' + '@' + version;
    }
    // Opera 12-
    if (ua.indexOf('opera') > -1) {
      version = ua.match(/opera\/([0-9\.]+)/)[1].split('.')[0];
      return 'Opera' + '@' + version;
    }
    // Opera 15+
    if (ua.indexOf('opr') > -1) {
      version = ua.match(/opr\/([0-9\.]+)/)[1].split('.')[0];
      return 'Opera' + '@' + version;
    }
    // Seamonkey
    if (ua.indexOf('seamonkey') > -1) {
      version = ua.match(/seamonkey\/([0-9\.]+)/);
      return 'Seamonkey' + '@' + version;
    }
    // Chromium
    if (ua.indexOf('chromium') > -1) {
      version = ua.match(/chromium\/([0-9\.]+)/)[1].split('.')[0];
      return 'Chromium' + '@' + version;
    }
    // chrome UA demo: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
    if (ua.indexOf('chrome') > -1 && !/chromium|edge/.test(ua)) {
      version = ua.match(/chrome\/([0-9\.]+)/)[1].split('.')[0];
      return 'chrome' + '@' + version;
    }
    // safari
    if (ua.indexOf('safari') > -1 && !/(chrome|chromium|edge)/.test(ua)) {
      version = ua.match(/safari\/([0-9\.])+/)[1].split('.')[0];
      return 'Safari' + '@' + version;
    }
    // IE11
    // IE11浏览器UA示例：'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3; rv:11.0) like Gecko'
    if (/window.*trident.*rv:11\.0/.test(ua)) {
      version = ua.match(/rv:([0-9\.]+)/)[1].split('.')[0];
      return 'Internet Explorer' + '@' + version;
    }
    // IE6-10
    // IE10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
    // IE9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
    // IE8: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
    // IE7: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
    // IE6: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)'
    if (/; msie/.test(ua)) {
      version = ua.match(/msie\s([0-9\.]+)/)[1].split('.')[0];
      return 'Internet Explorer' + '@' + version;
    }
    // 其他情况下返回未知浏览器
    return '神奇浏览器';
  };

  /**
   * 格式化日期，输出'2016-06-20 13:26'格式的字符串
   */
  $rootScope.formatDate = function (date) {
    date = new Date(date);
    if (isNaN(date.valueOf())) {
      return 'Amazing Date';
    }
    var year = date.getFullYear();
    var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes();
    return [year, month, day].join('-') + ' ' + hour + ':' + minute;
  };
}]).service('Api', ['$rootScope', '$http', '$httpParamSerializerJQLike', function ($rootScope, $http, $httpParamSerializerJQLike) {
  var _this = this;
  var originDomain = window.location.href.indexOf('localhost') === -1 ? location.protocol + '//yakima.duapp.com' : '';
  _this.get = function (url, params) {
    var promise = $http({
      method: 'GET',
      url: originDomain + url,
      params: params || {},
      timeout: 30000
    });
    return promise;
  };
  _this.post = function (url, data) {
    var promise = $http({
      method: 'POST',
      url: originDomain + url,
      data: data || {},
      timeout: 30000
    });
    return promise;
  };
  /**
   * 代码高亮
   */
  _this.highlightCode = function () {
    setTimeout(function () {
      $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
        if ($(this).hasClass('xml')) {
          $(this).text($(this).html());
        }
      });
    }, 0);
  };
  /**
   * 给字符串中换行的地方追加p标签
   */
  _this.insertTagP = function (content) {
    // 先判断原文中是否含有html标签，若有的话，只将中间没有内容（空格/tab等也视为无内容）的成对<p></p>标签删除掉，没有html的纯文本才进行标签处理
    if (!/(<\/a>)|(<\/p>)|(<\/ul>)|(<\/div>)|(<\/dl>)|(<\/article>)|(<\/header>)|(<\/footer>)|(<\/pre>)/.test(content)) {
      // replace newline character with html element <p></p>, \u0085代表下一行的字符，\u2028行分隔符，\u2029分段符
      content = '<p>' + content.replace(/\B(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))+\B/g, '</p><p>') + '</p>';
      content = content.replace(/(<p>)\1/g, '$1');
      content = content.replace(/<p>\s*?<\/p>/g, '');
      content = content.replace(/<\/p>\s+?<p>/g, '</p><p>');
      content = content.replace(/<p>(<h[1-6]>)/g, '$1');
      content = content.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    } else {
      content = content.replace(/<p>\s*?<\/p>/g, '');
      content = content.replace(/<\/p>\s+?<p>/g, '</p><p>');
    }
    return content;
  };
}]).filter('hasParentComment', [function () {
  return function (originalArray, parentCommentId) {
    return originalArray.filter(function (elem, index, arr) {
      return elem.comment_parent_id === parentCommentId;
    });
  };
}]).directive('activeLink', ['$location', function ($location) {
  var link = function link(scope, element) {
    scope.$watch(function () {
      return $location.path();
    }, function (path) {
      var url = element.attr('href');
      if (path.replace(/[0-9]*$/g, '') === url.replace(/^\/blog\/#/g, '').replace(/[0-9]*$/g, '')) {
        element.addClass('active');
        if (element.find('span.selected').length < 1) {
          element.append('<span class="selected"></span>');
        }
      } else {
        element.removeClass('active');
        element.find('span.selected').remove();
      }
    });
  };
  return {
    restrict: 'A',
    link: link
  };
}]).directive('appFooter', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'tpls/footer.html',
    scope: false
  };
}]).directive('appSidebar', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'tpls/sidebar.html',
    scope: false
  };
}]).directive('appHeader', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'tpls/header.html',
    scope: false
  };
}]);

angular.module('templates', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put('tpls/archive.html', '<section class="app-archives">\r\n  <div class="header">Title</div>\r\n  <ul>\r\n    <li ng-repeat="item in allPosts"><a ng-href="/blog/#/posts/{{item.post_id}}">{{item.post_title}}</a></li>\r\n  </ul>\r\n</section>');
  $templateCache.put('tpls/categories.html', '<ul class="categories">\r\n    <li ng-repeat="x in categories" class="category">\r\n        <a ng-href="/blog/#/categories/{{x.slug}}">\r\n            <header><i class="fa fa-3x" ng-class="categoriesLogos[x.slug]"></i></header>\r\n            <article>\r\n                {{x.name}}\r\n            </article>\r\n            <aside ng-show="!x.posts.length" class="dotting"></aside>\r\n            <aside ng-show="x.posts.length">{{x.posts.length}}</aside>\r\n        </a>\r\n    </li>\r\n</ul>');
  $templateCache.put('tpls/category.html', '<article>\r\n    <ul class="category_posts">\r\n        <li ng-repeat="item in posts">\r\n            <a ng-href="/blog/#/posts/{{item.post_id}}">\r\n                <span>{{item.post_title}}</span>\r\n                <span>{{item.post_date}}</span>\r\n            </a>\r\n        </li>\r\n    </ul>\r\n</article>');
  $templateCache.put('tpls/footer.html', '<footer class="app-footer">\r\n  <div class="app-footer-widgets">\r\n    <section class="app-footer-widget" ng-if="recentComments.length">\r\n      <h4>Comments</h4>\r\n      <ul class="comments">\r\n        <li ng-repeat="item in recentComments">\r\n          <a ng-href="/blog/#/posts/{{item.post_id}}">{{item.comment_content}}</a>\r\n        </li>\r\n      </ul>\r\n    </section>\r\n    <section class="app-footer-widget" ng-if="pages.length">\r\n      <h4>Pages</h4>\r\n      <ul class="pages">\r\n        <li ng-repeat="item in pages">\r\n          <a ng-href="/blog/#/pages/{{item.post_name}}">{{item.post_title}}</a>\r\n        </li>\r\n      </ul>\r\n    </section>\r\n    <section class="app-footer-widget" ng-if="randomPosts.length">\r\n      <h4>Articles</h4>\r\n      <ul class="posts">\r\n        <li ng-repeat="item in randomPosts">\r\n          <a ng-href="/blog/#/posts/{{item.post_id}}">{{item.post_title}}</a>\r\n          <span>{{formatDate(item.post_date)}}</span>\r\n        </li>\r\n      </ul>\r\n    </section>\r\n  </div>\r\n  <small class="app-footer-copyright">\r\n    <span class="item">Copyright &copy; 2009-{{currentYear}} Yakima Teng.</span>\r\n    <span class="item">Powered by Node.js &amp; WordPress &amp; MySql.</span>\r\n  </small>\r\n</footer>');
  $templateCache.put('tpls/header.html', '<nav class="app-nav" id="app-nav">\r\n  <a active-link href="/blog/#/1" class="item item-logo" data-title="\u9996\u9875" data-tooltip="\u8FDB\u5165\u9996\u9875">\r\n    <img class="img" src="./img/yakima_bright.jpg" alt="Yakima Teng">\r\n    <span class="line">Yakima Teng</span>\r\n  </a>\r\n  <a ng-repeat="item in menus" active-link class="item item-normal" ng-href="{{item.href}}" data-title="{{item.title}}" data-tooltip="{{item.tip}}">\r\n    <i ng-class="item.fontAwesomeIconClass" class="fa"></i>\r\n    <span class="line">{{item.menu}}</span>\r\n  </a>\r\n  <form class="item-form" ng-submit="search($event)">\r\n    <input ng-model="keyword" type="text" class="field" placeholder="Search..." autocomplete="on" />\r\n    <button class="btn" type="submit">^_^</button>\r\n  </form>\r\n</nav>');
  $templateCache.put('tpls/login.html', '<!--<div id="output"></div>-->\r\n<div class="login">\r\n    <section class="form-item">\r\n        <aside class="left">\r\n            <label for="login-name">\u7528\u6237\u540D</label>\r\n        </aside>\r\n        <article>\r\n            <input type="text" id="login-name" placeholder="your user name">\r\n        </article>\r\n    </section>\r\n    <section class="form-item">\r\n        <aside>\r\n            <label for="login-password">\u5BC6&nbsp;\u7801</label>\r\n        </aside>\r\n        <article>\r\n            <input type="text" id="login-password" placeholder="your password">\r\n        </article>\r\n    </section>\r\n    <section class="form-item">\r\n        <article>\r\n            <button>\u767B\u9646</button>\r\n        </article>\r\n    </section>\r\n</div>');
  $templateCache.put('tpls/page.html', '<section class="app-post">\r\n  <header class="app-post-header">\r\n    <h1 class="title">{{post.post_title}}</h1>\r\n  </header>\r\n  <aside class="app-post-byline">\r\n    <span class="date">{{formatDate(post.post_date)}}</span>\r\n  </aside>\r\n  <article class="app-post-content" ng-bind-html="post.post_content"></article>\r\n</section>\r\n');
  $templateCache.put('tpls/post.html', '<article class="app-post">\r\n  <header class="app-post-header">\r\n    <h1 class="title">{{post.post_title}}</h1>\r\n  </header>\r\n  <aside class="app-post-byline">\r\n    <span class="category"><a ng-href="{{\'/blog/#/categories/\' + post.cat_slug + \'/1\'}}">{{post.cat_name}}</a></span>\r\n    <span class="date">{{formatDate(post.post_date)}}</span>\r\n  </aside>\r\n  <article class="app-post-content" ng-bind-html="post.post_content"></article>\r\n  <footer class="app-post-footer">\r\n    <span class="title">\u76F8\u5173\u6587\u7AE0</span>\r\n    <span class="item" ng-repeat="item in relatedPosts">\r\n      <a ng-href="/blog/#/posts/{{item.post_id}}">{{item.post_title}}</a>\r\n    </span>\r\n  </footer>\r\n  <section class="app-post-nav">\r\n    <a ng-href="{{nextPostId === \'\' ? \'\' : \'/blog/#/posts/\' + nextPostId + fromValueString}}" class="next">{{nextPostStatus}}</a>\r\n    <a ng-href="{{prePostId === \'\' ? \'\' : \'/blog/#/posts/\' + prePostId + fromValueString}}" class="pre">{{prePostStatus}}</a>\r\n  </section>\r\n  <section class="app-post-comments">\r\n    <section ng-repeat="commentOne in relatedComments | filter:getFirstLevelComments" class="post_comment">\r\n      <header class="header">\r\n        <a ng-href="{{commentOne.comment_author_url}}" class="post_comment_author">{{commentOne.comment_author}}</a>\r\n        <span class="item">{{formatDate(commentOne.comment_date)}}</span>\r\n        <span class="item">{{judgeBrowser(commentOne.comment_agent)}}</span>\r\n        <span ng-click="reply(commentOne)" class="item outstanding">\u56DE\u590D</span>\r\n      </header>\r\n      <article class="post_comment_content">{{commentOne.comment_content}}</article>\r\n      <section ng-repeat="commentTwo in relatedComments | hasParentComment:commentOne.comment_id" class="post_comment inner-comment">\r\n        <header class="header">\r\n          <a ng-href="{{commentTwo.comment_author_url}}" class="post_comment_author">{{commentTwo.comment_author}}</a>\r\n          <span class="item">{{formatDate(commentTwo.comment_date)}}</span>\r\n          <span class="item">{{judgeBrowser(commentTwo.comment_agent)}}</span>\r\n          <span ng-click="reply(commentTwo)" class="item outstanding">\u56DE\u590D</span>\r\n        </header>\r\n        <article class="post_comment_content">{{commentTwo.comment_content}}</article>\r\n        <section ng-repeat="commentThree in relatedComments | hasParentComment:commentTwo.comment_id" class="post_comment inner-comment">\r\n          <header class="header">\r\n            <a ng-href="{{commentThree.comment_author_url}}" class="post_comment_author">{{commentThree.comment_author}}</a>\r\n            <span class="item">{{formatDate(commentThree.comment_date)}}</span>\r\n            <span class="item">{{judgeBrowser(commentThree.comment_agent)}}</span>\r\n            <span ng-click="reply(commentThree)" class="item outstanding">\u56DE\u590D</span>\r\n          </header>\r\n          <article class="post_comment_content">{{commentThree.comment_content}}</article>\r\n          <section ng-repeat="commentFour in relatedComments | hasParentComment:commentThree.comment_id" class="post_comment inner-comment">\r\n            <header class="header">\r\n              <a ng-href="{{commentFour.comment_author_url}}" class="post_comment_author">{{commentFour.comment_author}}</a>\r\n              <span class="item">{{formatDate(commentFour.comment_date)}}</span>\r\n              <span class="item">{{judgeBrowser(commentFour.comment_agent)}}</span>\r\n              <span ng-click="reply(commentFour)" class="item outstanding">\u56DE\u590D</span>\r\n            </header>\r\n            <article class="post_comment_content">{{commentFour.comment_content}}</article>\r\n            <section ng-repeat="commentFive in relatedComments | hasParentComment:commentFour.comment_id" class="post_comment inner-comment">\r\n              <header class="header">\r\n                <a ng-href="{{commentFive.comment_author_url}}" class="post_comment_author">{{commentFive.comment_author}}</a>\r\n                <span class="item">{{formatDate(commentFive.comment_date)}}</span>\r\n                <span class="item">{{judgeBrowser(commentFive.comment_agent)}}</span>\r\n                <!-- <span ng-click="reply(commentFive)" class="item outstanding">\u56DE\u590D</span> -->\r\n              </header>\r\n              <article class="post_comment_content">{{commentFive.comment_content}}</article>\r\n            </section>\r\n          </section>\r\n        </section>\r\n      </section>\r\n    </section>\r\n  </section>\r\n  <section class="app-post-comment-submit">\r\n    <div class="fields">\r\n      <div class="item">\r\n        <label for="commentAuthor" class="label">Name</label>\r\n        <input ng-model="comment.author" id="commentAuthor" type="text" class="field" placeholder="Your name">\r\n      </div>\r\n      <div class="item">\r\n        <label for="commentEmail" class="label">Email</label>\r\n        <input ng-model="comment.email" id="commentEmail" type="text" class="field" placeholder="Your email">\r\n      </div>\r\n      <div class="item">\r\n        <label for="commentUrl" class="label">Blog Url</label>\r\n        <input ng-model="comment.url" id="commentUrl" type="text" class="field" placeholder="your blog url">\r\n      </div>\r\n    </div>\r\n    <div class="content">\r\n      <div ng-class="{\'show\': comment.tip !== \'\'}" class="detail-mask">\r\n        <div class="tip">\r\n          <div class="text">{{comment.tip}}</div>\r\n          <div class="timing">\uFF08\u5F39\u6846\u5C06\u4E8E{{comment.timing}}\u79D2\u540E\u5173\u95ED\uFF09</div>\r\n        </div>\r\n      </div>\r\n      <textarea ng-model="comment.message" class="detail" id="commentMessage" placeholder="\u4E3A\u9632\u6B62\u5783\u573E\u8BC4\u8BBA\uFF0C\u8981\u6C42\u8BC4\u8BBA\u5185\u5BB9\u9700\u4EE5\u82F1\u6587\u5F00\u5934\uFF0C\u4EE5\u4E2D\u6587\u7ED3\u5C3E\uFF0C\u6BD4\u5982\uFF1AHello,\u4F60\u771F\u68D2"></textarea>\r\n      <button ng-click="submitComment()" class="submit">\u53D1\u8868\u8BC4\u8BBA</button>\r\n    </div>\r\n  </section>\r\n</article>');
  $templateCache.put('tpls/posts.html', '<article class="app-posts">\r\n    <div>\r\n        <article class="app-excerpt" ng-show="!isWaiting && recentPosts.length" ng-repeat="item in recentPosts">\r\n            <header class="app-excerpt-header">\r\n                <a ng-href="{{\'/blog/#/posts/\' + item.post_id + \'?from=\' + (from || \'posts\') + \'&value=\' + (value || \'\')}}">{{item[\'post_title\']}}</a>\r\n            </header>\r\n            <aside class="app-excerpt-byline">\r\n                <span class="category"><a ng-href="{{\'/blog/#/categories/\' + item.cat_slug + \'/1\'}}">{{item.cat_name}}</a></span>\r\n                <span class="date">{{formatDate(item.post_date)}}</span>\r\n            </aside>\r\n            <article class="app-excerpt-content" ng-bind-html="item.post_excerpt"></article>\r\n            <footer ng-show="item.comment_count === 0" class="app-excerpt-footer">\r\n                <span class="title">\u6682\u65E0\u8BC4\u8BBA</span>\r\n            </footer>\r\n            <footer ng-show="item.comment_count !== 0" class="app-excerpt-footer">\r\n                <span class="title">\u6700\u65B0\u8BC4\u8BBA</span>\r\n                <span class="item"><a ng-href="{{\'/blog/#/posts/\' + item.post_id + \'?from=\' + (from || \'posts\') + \'&value=\' + (value || \'\')}}">{{item.recent_comment_content}}</a></span>\r\n            </footer>\r\n        </article>\r\n        <article ng-show="!isWaiting && !recentPosts.length">\r\n            (\u2299o\u2299)\u54E6\uFF0C\u6CA1\u6709\u6587\u7AE0\u4E86\r\n        </article>\r\n        <!-- <article ng-show="isWaiting" class="waiting">\r\n            <i class="fa fa-cog fa-spin fa-3x fa-fw margin-bottom"></i>\r\n            \u52A0\u8F7D\u4E2D\r\n        </article> -->\r\n    </div>\r\n</article>\r\n<section class="app-page-nav" ng-if="recentPosts.length">\r\n    <a ng-if="currentPostsPageId > 1" ng-href="{{baseLink + (currentPostsPageId - 1)}}" class="first"></a>\r\n    <a ng-if="currentPostsPageId > 5 && recentPosts.length == 10" ng-repeat="i in [-5,-4,-3,-2,-1,0,1,2,3,4]" ng-class="{true: \'active\'}[i == 0]" ng-href="{{baseLink + (currentPostsPageId + i)}}">{{currentPostsPageId + i}}</a>\r\n    <a ng-if="currentPostsPageId > 5 && recentPosts.length < 10" ng-repeat="i in [-5,-4,-3,-2,-1,0]" ng-class="{true: \'active\'}[i == 0]" ng-href="{{baseLink + (currentPostsPageId + i)}}">{{currentPostsPageId + i}}</a>\r\n    <a ng-if="currentPostsPageId <= 5 && recentPosts.length == 10" ng-repeat="i in [1,2,3,4,5,6,7,8,9,10]" ng-class="{\'active\': i == currentPostsPageId}" ng-href="{{baseLink + i}}">{{i}}</a>\r\n    <a ng-if="currentPostsPageId <= 5 && recentPosts.length < 10 && i <= currentPostsPageId" ng-repeat="i in [1,2,3,4,5,6,7,8,9,10]" ng-class="{\'active\': i == currentPostsPageId}" ng-href="{{baseLink + i}}">{{i}}</a>\r\n    <a ng-if="recentPosts.length == 10" ng-href="{{baseLink + (currentPostsPageId + 1)}}" class="last"></a>\r\n</section>');
  $templateCache.put('tpls/sidebar.html', '<aside class="app-sidebar">\r\n  <section class="widget-text">\r\n    <img class="top" src="./img/34.jpg" alt="">\r\n    <img class="photo" src="./img/suolong.jpg" alt="">\r\n    <article class="content">\r\n      \u76EE\u524D\u5728\u9B54\u90FD\u300213\u5E74\u6BD5\u4E1A\u4E8E\u5317\u836F\uFF0C\u5728\u6D59\u6C5Ftop10\u7684\u4E00\u5BB6\u4E0A\u5E02\u836F\u4F01\u505A\u8FC72\u5E74\u7684\u56FD\u9645\u836F\u54C1\u6CE8\u518C\u300215\u5E74\u672B\u6B63\u5F0F\u52A0\u5165\u667A\u5546\u66B4\u8E81\u7684\u524D\u7AEF\u7A0B\u5E8F\u5458\u5927\u519B\u3002\r\n      <br><a href="/blog/#/pages/about">\u66F4\u591A\u5185\u5BB9\u8BF7\u70B9\u51FB\u6B64\u5904</a>\r\n      <audio loop controls oncanplay="document.getElementById(\'audio\').volume = 0.3" id="audio" class="audio">\r\n        <source src="http://yakima.duapp.com/uploads/xiaoyaotan.mp3" type="audio/mpeg" />\r\n        Your browser does not support the audio element.\r\n      </audio>\r\n    </article>\r\n    <footer class="social">\r\n      <span class="qq"></span>\r\n      <span class="wechat"></span>\r\n      <span class="email"></span>\r\n    </footer>\r\n  </section>\r\n  <section class="widget-normal" ng-if="categories.length">\r\n    <h4 class="widget-title"><span>\u5206\u7C7B\u76EE\u5F55</span></h4>\r\n    <ul class="categories">\r\n      <li ng-repeat="item in categories" class="list"><a ng-href="/blog/#/categories/{{item.slug}}/1">{{item.name}}</a></li>\r\n    </ul>\r\n  </section>\r\n  <section class="widget-normal" ng-if="archives.length">\r\n    <h4 class="widget-title"><span>\u6587\u7AE0\u5F52\u6863</span></h4>\r\n    <ul class="archives">\r\n      <li ng-repeat="item in archives" class="list"><a ng-href="/blog/#/archives/{{item.year + \'-\' + item.month}}/1">{{item.year}}\u5E74{{item.month}}\u6708</a></li>\r\n    </ul>\r\n  </section>\r\n  <section class="widget-normal" ng-if="friends.length">\r\n    <h4 class="widget-title"><span>\u4E00\u4E9B\u94FE\u63A5</span></h4>\r\n    <ul class="links">\r\n      <li ng-repeat="item in friends" class="list"><a ng-href="{{item.url}}">{{item.name}}</a></li>\r\n    </ul>\r\n  </section>\r\n</aside>');
}]);
var archive = {
  url: '/archives/:year-:month/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    $scope.from = 'archives';
    $scope.value = $stateParams.year + '-' + $stateParams.month;
    $scope.baseLink = '/blog/#/archives/' + $stateParams.year + '-' + $stateParams.month + '/';
    $scope.currentPostsPageId = parseInt($stateParams.id);
    $rootScope.isWaiting = true;
    Api.get('/blog/v1/months/' + $stateParams.year + '/' + $stateParams.month, {
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }).success(function (data) {
      if (data && data.code && data.code === '200') {
        $scope.recentPosts = data.body.map(function (item) {
          return {
            post_id: item.post_id,
            post_date: item.post_date,
            post_title: item.post_title,
            post_excerpt: item.post_excerpt,
            cat_slug: item.cat_slug,
            cat_name: item.cat_name,
            comment_count: item.comment_count,
            recent_comment_content: item.comment_recent
          };
        });
      }
    }).finally(function () {
      return $rootScope.isWaiting = false;
    });
  }]
};

var categories = {
  url: '/categories',
  templateUrl: 'tpls/categories.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    $scope.categoriesLogos = {
      'qq-diary': 'fa-qq',
      'qq-copy': 'fa-folder-o',
      diary: 'fa-user',
      authoring: 'fa-edit',
      else: 'fa-terminal',
      'office-software': 'fa-file-word-o',
      'article-by-others': 'fa-chrome',
      usp: 'fa-rocket',
      english: 'fa-beer',
      'pharmaceutical-information': 'fa-newspaper-o',
      'regulatory-affairs': 'fa-registered',
      'pharmaceutical-knowledge': 'fa-university',
      'reading-book': 'fa-book'
    };
    $rootScope.isWaiting = true;

    var _loop = function _loop(i, length) {
      Api.get('/blog/v1/posts', {
        sortby: 'ID',
        order: 'rand',
        cat: $rootScope.categories[i].slug
      }).success(function (data) {
        $rootScope.categories[i].posts = data.responseBody;
      }).finally(function () {
        return $rootScope.isWaiting = false;
      });
    };

    for (var i = 0, length = $rootScope.categories.length; i < length; i++) {
      _loop(i, length);
    }
  }]
};

var category = {
  url: '/categories/:slug/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    $scope.baseLink = '/blog/#/categories/' + $stateParams.slug + '/';
    $scope.currentPostsPageId = parseInt($stateParams.id);
    $rootScope.isWaiting = true;
    $scope.from = 'categories';
    $scope.value = $stateParams.slug;
    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      cat: $stateParams.slug.toLowerCase(),
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: 10
    }).success(function (data) {
      if (data && data.code && data.code === '200') {
        $scope.recentPosts = data.body.map(function (item) {
          return {
            post_id: item.post_id,
            post_title: item.post_title,
            post_date: item.post_date,
            post_excerpt: item.post_excerpt,
            cat_slug: item.cat_slug,
            cat_name: item.cat_name,
            comment_count: item.comment_count,
            recent_comment_content: item.comment_recent
          };
        });
      } else if (data && data.code && data.code !== '200') {
        window.alert(data.message + ': ' + data.code);
      } else {
        window.alert('查询文章列表失败');
      }
    }).finally(function () {
      return $rootScope.isWaiting = false;
    });
  }]
};

var login = {
  url: '/login',
  templateUrl: 'tpls/login.html',
  controller: ['$rootScope', '$scope', function ($rootScope, $scope) {}]
};

var page = {
  url: '/pages/:name',
  templateUrl: 'tpls/page.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    $rootScope.isWaiting = true;
    Api.get('/blog/v1/pages/' + $stateParams.name).success(function (data) {
      if (data && data.code && data.code === '200') {
        if (data && data.code && data.code === '200') {
          $scope.post = {
            post_id: data.body.post_id,
            post_title: data.body.post_title,
            post_content: data.body.post_content
          };
        }
      } else if (data && data.code && data.code !== '200') {
        window.alert(data.message + ' : ' + data.code);
      } else {
        window.alert('查询文章内容失败');
      }
    }).finally(function () {
      return $rootScope.isWaiting = false;
    });
  }]
};

var post = {
  url: '/posts/:id?from&value',
  templateUrl: 'tpls/post.html',
  controller: ['$rootScope', '$scope', '$stateParams', '$timeout', '$interval', '$sce', 'Api', function ($rootScope, $scope, $stateParams, $timeout, $interval, $sce, Api) {
    $scope.postId = $stateParams.id;
    $scope.prePostId = '';
    $scope.prePostStatus = '正在查询上一篇文章信息';
    $scope.nextPostId = '';
    $scope.nextPostStatus = '正在查询下一篇文章信息';
    $scope.fromValueString = '?from=' + ($stateParams.from || 'posts') + '&value=' + ($stateParams.value || '');

    /***********************************************************************************
     *                                                                                  *
     * 获取上一篇和下一篇文章标题和id
     *                                                                                  *
     ***********************************************************************************/
    Api.get('/blog/v1/post/siblings', {
      postId: $stateParams.id,
      from: $stateParams.from || 'posts',
      value: $stateParams.value || ''
    }).success(function (data) {
      if (data && data.code && data.code === '200') {
        $scope.prePostId = data.body.prev.post_id || '';
        $scope.prePostStatus = data.body.prev.post_id ? data.body.prev.post_title : '没有更早的文章了';

        $scope.nextPostId = data.body.next.post_id || '';
        $scope.nextPostStatus = data.body.next.post_id ? data.body.next.post_title : '没有更新的文章了';
      } else if (data && data.code && data.code !== '200') {
        window.alert(data.message + ': ' + data.code);
      } else {
        window.alert('Oh, there is something wrong');
      }
    }).error(function () {
      $scope.prePostId = '';
      $scope.prePostStatus = '获取上一篇文章信息失败';

      $scope.nextPostId = '';
      $scope.nextPostStatus = '获取下一篇文章信息失败';
    });

    $scope.comment = {
      parent: '',
      author: '',
      email: '',
      url: '',
      message: '',
      // 提交评论时（后）的反馈信息
      tip: '',
      // 提交评论时的倒计时
      timing: 5,
      // 判断是否允许提交评论: true可以，false不可以：防止用户连续快速点击评论按钮
      flag: true,
      // 回复评论时显示在评论内容开头的提示文字
      replyHint: ''
    };

    /**
     * 获取当前postId对应的文章内容
     */
    $rootScope.isWaiting = true;
    Api.get('/blog/v1/posts/' + $scope.postId).success(function (data) {
      if (data && data.code && data.code === '200') {
        $scope.post = {
          post_id: data.body.post_id,
          post_title: data.body.post_title,
          post_content: $sce.trustAsHtml(Api.insertTagP(data.body.post_content)),
          post_date: data.body.post_date,
          cat_slug: data.body.cat_slug,
          cat_name: data.body.cat_name
        };
        Api.highlightCode();
      } else if (data && data.code && data.code !== '200') {
        window.alert(data.message + ': ' + data.code);
      } else {
        window.alert('Oh, there is something wrong');
      }
    }).finally(function () {
      return $rootScope.isWaiting = false;
    });

    /**
     * 获取随机的一篇与当前文章相关的文章
     */
    $scope.getRelatedPost = function () {
      return Api.get('/blog/v1/related-posts', {
        postId: $scope.postId,
        limit: 10
      }).success(function (data) {
        if (data && data.code && data.code === '200') {
          $scope.relatedPosts = data.body.map(function (item) {
            return {
              post_id: item.post_id,
              post_title: item.post_title
            };
          });
        } else if (data && data.code && data.code !== '200') {
          window.alert(data.message + ' : ' + data.code);
        } else {
          window.alert('获取相关文章列表失败');
        }
      }).error(function () {
        window.alert('获取相关文章列表失败');
      });
    };

    /**
     * 获取最新的20条评论
     */
    $scope.getComments = function () {
      return Api.get('/blog/v1/comments', {
        postId: $scope.postId,
        limit: 20
      }).success(function (data) {
        if (data && data.code && data.code === '200') {
          $scope.relatedComments = data.body.map(function (item) {
            return {
              comment_author: item.comment_author,
              comment_author_url: item.comment_author_url,
              comment_date: item.comment_date,
              comment_agent: item.comment_agent,
              comment_content: item.comment_content,
              comment_id: item.comment_ID,
              comment_parent_id: item.comment_parent_ID
            };
          });
        } else if (data && data.code && data.code !== '200') {
          window.alert(data.message + ': ' + data.code);
        } else {
          window.alert('拉取评论列表失败');
        }
      });
    };

    /**
     * n秒倒计时，倒计时结束后清空评论反馈信息
     * 回调函数可选
     */
    $scope.countingDown = function (n, cb) {
      $scope.comment.timing = n;
      $timeout(function () {
        $scope.comment.tip = '';
        if (cb) {
          cb();
        }
      }, n * 1000);
      var timer = $interval(function () {
        $scope.comment.timing--;
        if ($scope.comment.timing < 1) {
          $interval.cancel(timer);
          $scope.comment.timing = n;
        }
      }, 1000);
    };

    /**
     * 验证评论
     */
    $scope.validateComment = function () {
      if (!$scope.comment.author) {
        $scope.comment.tip = '请输入姓名';
        $('#commentAuthor').trigger('focus');
        $scope.countingDown(6);
        return false;
      }
      if (!$scope.comment.email) {
        $scope.comment.tip = '请输入邮箱';
        $('#commentEmail').trigger('focus');
        $scope.countingDown(6);
        return false;
      }
      if (!$scope.comment.url) {
        $scope.comment.tip = '请输入博客地址';
        $('#commentUrl').trigger('focus');
        $scope.countingDown(6);
        return false;
      }
      if (!$scope.comment.message) {
        $scope.comment.tip = '请输入评论内容';
        $('#commentMessage').trigger('focus');
        $scope.countingDown(6);
        return false;
      }
      return true;
    };

    /**
     * 回复评论
     */
    $scope.reply = function (commentObj) {
      var c = commentObj;
      $scope.comment.parentId = c.comment_id;
      $scope.comment.replyHint = 'to [[' + c.comment_author + ']]: ';
      $scope.comment.message = $scope.comment.replyHint;
      // 点击评论按钮后跳转到评论输入框
      $('#commentMessage').trigger('focus');
    };

    /**
     * 提交评论
     */
    $scope.submitComment = function () {
      if ($scope.comment.flag === false || $scope.validateComment() === false) {
        return;
      }
      $scope.comment.flag = false;
      // 如果用户在点击‘回复’按钮后删掉了评论正文开头处的回复提示文字，则不算进行回复，而是当做发布单独的新评论处理
      if ($scope.comment.replyHint === '' || $scope.comment.message.indexOf($scope.comment.replyHint) === -1) {
        $scope.comment.parentId = '0';
        $scope.comment.replyHint = '';
      }
      Api.post('/blog/v1/comment/create', {
        postId: $scope.postId,
        parentId: $scope.comment.parentId,
        author: $scope.comment.author,
        email: $scope.comment.email,
        url: $scope.comment.url,
        message: $scope.comment.message
      }).success(function (data) {
        if (data && data.code && data.code === '200') {
          $scope.comment.tip = data.message;
          $scope.countingDown(6, function () {
            $scope.comment.flag = true;
          });
          $scope.getComments();
        }
      }).error(function () {
        $scope.comment.tip = '提交评论失败，可能是网络问题';
        $scope.countingDown(6, function () {
          $scope.comment.flag = true;
        });
      });
    };

    /**
     * 获取一级评论
     */
    $scope.getFirstLevelComments = function (comment) {
      return comment.comment_parent_id === 0;
    };

    $scope.getRelatedPost();
    $scope.getComments();
  }]
};

var posts = {
  url: '/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    $scope.baseLink = '/blog/#/';
    $scope.currentPostsPageId = parseInt($stateParams.id);
    $scope.from = 'posts';
    $scope.value = '';
    $rootScope.isWaiting = true;
    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }).success(function (data) {
      if (data && data.code && data.code === '200') {
        $scope.recentPosts = data.body.map(function (item) {
          return {
            post_id: item.post_id,
            post_title: item.post_title,
            post_date: item.post_date,
            post_excerpt: item.post_excerpt,
            cat_slug: item.cat_slug,
            cat_name: item.cat_name,
            comment_count: item.comment_count,
            recent_comment_content: item.comment_recent
          };
        });
      } else if (data && data.code && data.code !== '200') {
        window.alert(data.message + ': ' + data.code);
      } else {
        window.alert('There is something wrong');
      }
    }).finally(function () {
      return $rootScope.isWaiting = false;
    });
  }]
};

var randomPost = {
  url: '/posts/random',
  templateUrl: 'tpls/post.html',
  controller: ['$rootScope', '$scope', '$injector', 'Api', function ($rootScope, $scope, $injector, Api) {
    $rootScope.isWaiting = true;
    $injector.get('$templateCache').removeAll();
    Api.get('/blog/v1/posts', {
      sortby: 'ID',
      order: 'rand',
      offset: 0,
      limit: '1'
    }).success(function (data) {
      $scope.post = data.responseBody[0];
      Api.get('/blog/v1/related-posts', {
        id: $scope.post.ID,
        limit: 20
      }).success(function (data) {
        return $scope.relatedPosts = data.responseBody;
      }).finally(function () {
        return $rootScope.isWaiting = false;
      });
      Api.get('/blog/v1/comments', {
        postId: $scope.post.ID,
        limit: 20
      }).success(function (data) {
        return $scope.relatedComments = data.responseBody;
      });
    });
  }]
};

var searchResult = {
  url: '/search?:keyword&:pagenumber',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    var keyword = $stateParams.keyword;
    $scope.from = 'search';
    $scope.value = keyword;
    $scope.baseLink = '/blog/#/search?keyword=' + keyword + '&pagenumber=';
    $scope.currentPostsPageId = parseInt($stateParams.pagenumber);
    $rootScope.isWaiting = true;
    Api.get('/blog/v1/search', {
      keyword: keyword,
      sortby: 'post_date',
      order: 'desc',
      offset: ($scope.currentPostsPageId - 1) * 10,
      limit: '10'
    }).success(function (data) {
      $scope.recentPosts = data.responseBody;
    }).finally(function () {
      return $rootScope.isWaiting = false;
    });
  }]
};

/**
 * Created by Administrator on 4/16.
 */
angular.module('app', ['app-base', 'ui.router', 'templates']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/1');
  $stateProvider.state('所有目录', categories).state('指定目录', category).state('随机文章', randomPost).state('具体文章', post).state('具体页面', page).state('指定月份', archive).state('登陆管理', login).state('搜索结果', searchResult).state('文章列表', posts);
}]).run(['$rootScope', '$state', '$timeout', 'Api', function ($rootScope, $state, $timeout, Api) {
  window.app = $rootScope;
  $rootScope.keyword = '';
  var over = {
    categories: false,
    randomPosts: false,
    pages: false,
    archives: false,
    recentComments: false
  };
  function whetherToCancelLoading() {
    var tempArr = Object.keys(over);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = tempArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var value = _step.value;

        if (value === false) {
          return;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    $timeout(function () {
      $rootScope.isLoading = false;
    }, 300);
  }
  $rootScope.isLoading = true;
  $rootScope.isWaiting = false;
  Api.get('/blog/v1/cats').success(function (data) {
    if (data && data.code && data.code === '200') {
      $rootScope.categories = data.body.map(function (item) {
        return {
          slug: item.cat_slug,
          name: item.cat_name
        };
      });
    } else if (data && data.code && data.code !== '200') {
      window.alert(data.message + ': ' + data.code);
    } else {
      window.alert('Oh, there is something wrong');
    }
  }).error(function () {}).finally(function () {
    over.categories = true;
    whetherToCancelLoading();
  });

  Api.get('/blog/v1/excerpts', {
    sortby: 'ID',
    order: 'RAND',
    limit: '10'
  }).success(function (data) {
    if (data && data.code && data.code === '200') {
      $rootScope.randomPosts = data.body.map(function (item) {
        return {
          post_id: item.post_id,
          post_title: item.post_title,
          post_date: item.post_date
        };
      });
    } else if (data && data.code && data.code !== '200') {
      window.alert(data.message + ': ' + data.code);
    } else {
      window.alert('Oh, there is something wrong');
    }
  }).finally(function () {
    over.randomPosts = true;
    whetherToCancelLoading();
  });

  Api.get('/blog/v1/pages').success(function (data) {
    if (data && data.code && data.code === '200') {
      $rootScope.pages = data.body.map(function (item) {
        return {
          post_name: item.post_name,
          post_title: item.post_title
        };
      });
    } else if (data && data.code && data.code !== '200') {
      window.alert(data.message + ': ' + data.code);
    } else {
      window.alert('Oh, there is something wrong');
    }
  }).finally(function () {
    over.pages = true;
    whetherToCancelLoading();
  });

  Api.get('/blog/v1/months').success(function (data) {
    if (data && data.code && data.code === '200') {
      $rootScope.archives = data.body.map(function (item) {
        return {
          year: item.year,
          month: item.month
        };
      });
    } else if (data && data.code && data.code !== '200') {
      window.alert(data.message + ': ' + data.code);
    } else {
      window.alert('Oh, there is something wrong');
    }
  }).finally(function () {
    over.archives = true;
    whetherToCancelLoading();
  });

  Api.get('/blog/v1/comments', {
    order: 'desc',
    offset: '0',
    limit: '10'
  }).success(function (data) {
    if (data && data.code && data.code === '200') {
      $rootScope.recentComments = data.body.map(function (item) {
        return {
          post_id: item.post_ID,
          comment_content: item.comment_content
        };
      });
    } else if (data && data.code && data.code !== '200') {
      window.alert(data.message + ': ' + data.code);
    } else {
      window.alert('Oh, there is something wrong');
    }
  }).finally(function () {
    over.recentComments = true;
    whetherToCancelLoading();
  });

  $rootScope.search = function (e) {
    e.preventDefault();
    window.location.href = '/blog/#/search?keyword=' + $rootScope.keyword + '&pagenumber=1';
  };

  $rootScope.currentYear = new Date().getFullYear();

  // 若滚动条不在顶部，当锚点改变时让滚动条回到顶部
  window.onload = window.onhashchange = function () {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    enableTooltips('app-nav');
  };
}]);