const searchResult = {
  url: '/search?:keyword&:pagenumber',
  templateUrl: 'tpls/search-result.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function ($rootScope, $scope, $stateParams, Api) {
    const keyword = $stateParams.keyword
    const curPageNumber = parseInt($stateParams.pagenumber)
    $scope.isLoadingPosts = true
    $scope.baseLink = `/blog/#/search?keyword=${keyword}&pagenumber=`
    $scope.currentPostsPageId = curPageNumber
    Api.get('/blog/v1/search', {
      keyword,
      offset: (curPageNumber - 1) * 10,
      limit: '10'
    }).success(data => {
      $scope.searchResult = data.responseBody
    }).finally(() => $scope.isLoadingPosts = false)
  }]
}
