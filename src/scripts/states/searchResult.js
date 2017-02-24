const searchResult = {
  url: '/search?:keyword&:pagenumber',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    const keyword = $stateParams.keyword
    $scope.from = 'search'
    $scope.value = keyword
    $scope.baseLink = `/blog/#/search?keyword=${keyword}&pagenumber=`
    $scope.currentPostsPageId = parseInt($stateParams.pagenumber)
    $rootScope.isWaiting = true
    Api.get('/blog/v1/search', {
      keyword,
      sortby: 'post_date',
      order: 'desc',
      offset: ($scope.currentPostsPageId - 1) * 10,
      limit: '10'
    }).success(data => {
      $scope.recentPosts = data.responseBody
    }).finally(() => $rootScope.isWaiting = false)
  }]
}