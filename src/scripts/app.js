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
      .state('搜索结果', searchResult)
      .state('文章列表', posts)
  }])
  .run(['$rootScope', '$state', '$timeout', 'Api', function($rootScope, $state, $timeout, Api) {
    window.app = $rootScope
    $rootScope.keyword = ''
    angular.element('body').css({ 'display': 'block' })
    let over = {
      categories: false,
      randomPosts: false,
      pages: false,
      archives: false,
      recentComments: false
    }
    function whetherToCancelLoading () {
      const tempArr = Object.keys(over)
      for (let value of tempArr) {
        if (value === false) {
          return
        }
      }
      $timeout(() => {
        Api.load(false)
      }, 300)
    }
    Api.get('/blog/v1/cats')
      .success(data => {
        if (data && data.code && data.code === '200') {
          $rootScope.categories = data.body.map(item => {
            return {
              slug: item.cat_slug,
              name: item.cat_name
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .error(() => {})
      .finally(() => {
        over.categories = true
        whetherToCancelLoading()
      })

    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'RAND',
      limit: '10'
    })
      .success(data => {
        if (data && data.code && data.code === '200') {
          $rootScope.randomPosts = data.body.map(item => {
            return {
              post_id: item.post_id,
              post_title: item.post_title,
              post_date: item.post_date
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .finally(() => {
        over.randomPosts = true
        whetherToCancelLoading()
      })

    Api.get('/blog/v1/pages')
      .success(data => {
        if (data && data.code && data.code === '200') {
          $rootScope.pages = data.body.map(item => {
            return {
              post_name: item.post_name,
              post_title: item.post_title
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .finally(() => {
        over.pages = true
        whetherToCancelLoading()
      })

    Api.get('/blog/v1/months')
      .success(data => {
        if (data && data.code && data.code === '200') {
          $rootScope.archives = data.body.map(item => {
            return {
              year: item.year,
              month: item.month
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .finally(() => {
        over.archives = true
        whetherToCancelLoading()
      })

    Api.get('/blog/v1/comments', {
      order: 'desc',
      offset: '0',
      limit: '10'
    })
      .success(data => {
        if (data && data.code && data.code === '200') {
          $rootScope.recentComments = data.body.map(item => {
            return {
              post_id: item.post_ID,
              comment_content: item.comment_content
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .finally(() => {
        over.recentComments = true
        whetherToCancelLoading()
      })

    $rootScope.search = (e) => {
      e.preventDefault()
      window.location.hash = `#/search?keyword=${$rootScope.keyword}&pagenumber=1`
    }

    $rootScope.currentYear = new Date().getFullYear()

    // 若滚动条不在顶部，当锚点改变时让滚动条回到顶部
    window.onload = window.onhashchange = () => {
      $('html, body').animate({scrollTop: 0}, 'slow')
      enableTooltips('app-nav')
    }
  }])
