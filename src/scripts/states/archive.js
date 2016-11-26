const archive = {
  url: '/archives/:year-:month/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    $scope.from = 'archives'
    $scope.value = `${$stateParams.year}-${$stateParams.month}`
    $scope.baseLink = `/blog/#/archives/${$stateParams.year}-${$stateParams.month}/`
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $rootScope.isWaiting = true
    Api.get('/blog/v1/archives', {
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10',
      year: parseInt($stateParams.year),
      month: parseInt($stateParams.month)
    }).success(data => {
      $scope.recentPosts = data.responseBody
    }).finally(() => $rootScope.isWaiting = false)
  }]
}
