const posts = {
  url: '/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    $scope.baseLink = '/blog/#/'
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $scope.isLoadingPosts = true
    $scope.from = 'posts'
    $scope.value = ''
    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }).success(data => {
      $scope.recentPosts = data.responseBody
      $scope.isLoadingPosts = false
    })
  }]
}
