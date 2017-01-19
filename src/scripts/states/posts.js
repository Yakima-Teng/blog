const posts = {
  url: '/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    $scope.baseLink = '/blog/#/'
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $scope.from = 'posts'
    $scope.value = ''
    $rootScope.isWaiting = true
    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    })
      .success(data => {
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
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('There is something wrong')
        }
      })
      .finally(() => $rootScope.isWaiting = false)
  }]
}
