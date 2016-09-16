/**
 * Created by Administrator on 4/16.
 */
angular.module('app', ['app-base', 'ui.router', 'templates'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/1');
    $stateProvider
      .state('所有目录', categories)
      .state('指定目录', category)
      .state('随机文章', randomPost)
      .state('具体文章', post)
      .state('具体页面', page)
      .state('指定月份', archive)
      .state('登陆管理', login)
      .state('文章列表', posts)
  }])
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$httpGet('/blog/v1/categories', null, function(data, status, headers, config) {
      $rootScope.categories = data.responseBody;
    }, function(data, status, headers, config) {
      console.log(data);
    }, undefined, false);

    $rootScope.$httpGet('/blog/v1/posts', {
      sortby: 'ID',
      order: 'rand',
      limit: '10'
    }, function(data, status, headers, config) {
      $rootScope.randomPosts = data.responseBody;
    }, function(data, status, headers, config) {
      console.log(data);
    }, undefined, false);

    $rootScope.$httpGet('/blog/v1/pages', null, function(data, status, headers, config) {
      $rootScope.pages = data.responseBody;
    }, function(data, status, headers, config) {
      console.log(data);
    }, undefined, false);

    $rootScope.$httpGet('/blog/v1/archive-data', null, function(data, status, headers, config) {
      $rootScope.archives = data.responseBody;
    }, function(data, status, headers, config) {
      console.log(data);
    }, undefined, false);

    $rootScope.$httpGet('/blog/v1/comments', {
      order: 'desc',
      offset: '0',
      limit: '10'
    }, function(data, status, headers, config) {
      $rootScope.recentComments = data.responseBody;
    }, function(data, status, headers, config) {
      console.log(data);
    }, undefined, false);

    $rootScope.search = function(e) {
      e.preventDefault();
      console.log('ready to search');
      alert('Search function is not available now!');
    };

    $rootScope.login = function(e) {
      var $el = $(e.target || e.srcElement);
      e.preventDefault();
      location.href = 'http://yakima.duapp.com/wp-admin';
    };

    $rootScope.currentYear = new Date().getFullYear();

    // 若滚动条不在顶部，当锚点改变时让滚动条回到顶部
    window.onload = window.onhashchange = () => {
      $('html, body').animate({scrollTop: 0}, 'slow');
      enableTooltips('app-nav');
    }
  }])
