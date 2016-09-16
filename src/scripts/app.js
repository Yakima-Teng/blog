/**
 * Created by Administrator on 4/16.
 */
angular.module('app', ['app-base', 'ui.router', 'templates'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/1')
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
  .run(['$rootScope', '$state', '$timeout', 'Api', function($rootScope, $state, $timeout, Api) {
    window.app = $rootScope
    $rootScope.isLoading = true
    $timeout(() => {
      $rootScope.isLoading = false
    }, 1000)
    Api.get('/blog/v1/categories')
      .success(data => $rootScope.categories = data.responseBody)
      .error(() => {})
      .finally(() => {})

    Api.get('/blog/v1/posts', {
      sortby: 'ID',
      order: 'rand',
      limit: '10'
    }).success(data => $rootScope.randomPosts = data.responseBody)

    Api.get('/blog/v1/pages').success(data => $rootScope.pages = data.responseBody)

    Api.get('/blog/v1/archive-data').success(data => $rootScope.archives = data.responseBody)

    Api.get('/blog/v1/comments', {
      order: 'desc',
      offset: '0',
      limit: '10'
    }).success(data => $rootScope.recentComments = data.responseBody)

    $rootScope.search = (e) => {
      e.preventDefault()
      window.alert('Search function is not available now!')
    }

    $rootScope.currentYear = new Date().getFullYear()

    // 若滚动条不在顶部，当锚点改变时让滚动条回到顶部
    window.onload = window.onhashchange = () => {
      $('html, body').animate({scrollTop: 0}, 'slow')
      enableTooltips('app-nav')
    }
  }])
