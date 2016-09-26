const category = {
  url: '/categories/:slug/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    $scope.baseLink = `/blog/#/categories/${$stateParams.slug}/`
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $scope.isLoadingPosts = true
    $scope.from = 'categories'
    $scope.value = $stateParams.slug
    Api.get('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      cat: $stateParams.slug.toLowerCase(),
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }).success(data => {
      $scope.recentPosts = data.responseBody
    }).finally(() => $scope.isLoadingPosts = false)
  }]
}
