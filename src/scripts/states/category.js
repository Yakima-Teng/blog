const category = {
  url: '/categories/:slug/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    $scope.baseLink = `#/categories/${$stateParams.slug}/`
    $scope.currentPostsPageId = parseInt($stateParams.id)
    Api.wait(true)
    $scope.from = 'categories'
    $scope.value = $stateParams.slug
    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      cat: $stateParams.slug.toLowerCase(),
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: 10
    }).success(data => {
      if (data && data.code && data.code === '200') {
        $scope.recentPosts = data.body.map(item => {
          return {
            post_id: item.post_id,
            post_title: item.post_title,
            post_date: item.post_date,
            post_excerpt: item.post_excerpt,
            cat_slug: item.cat_slug,
            cat_name: item.cat_name,
            comment_count: item.comment_count,
            recent_comment_content: item.comment_recent
          }
        })
      } else if (data && data.code && data.code !== '200') {
        Api.alert({ text: `${data.message}，错误代码：${data.code}` })
      } else {
        Api.alert({ text: '查询文章列表失败' })
      }
    }).finally(() => Api.wait(false))
  }]
}
