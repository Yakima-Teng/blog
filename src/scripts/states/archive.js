const archive = {
  url: '/archives/:year-:month/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    $scope.from = 'months'
    $scope.value = `${$stateParams.year}-${$stateParams.month}`
    $scope.baseLink = `#/archives/${$stateParams.year}-${$stateParams.month}/`
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $rootScope.isWaiting = true
    Api.get(`/blog/v1/months/${$stateParams.year}/${$stateParams.month}`, {
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }).success(data => {
      if (data && data.code && data.code === '200') {
        $scope.recentPosts = data.body.map(item => {
          return {
            post_id: item.post_id,
            post_date: item.post_date,
            post_title: item.post_title,
            post_excerpt: item.post_excerpt,
            cat_slug: item.cat_slug,
            cat_name: item.cat_name,
            comment_count: item.comment_count,
            recent_comment_content: item.comment_recent
          }
        })
      }
    }).finally(() => $rootScope.isWaiting = false)
  }]
}
