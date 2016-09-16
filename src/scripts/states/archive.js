var archive = {
  url: '/archives/:year-:month/:id',
  templateUrl: 'tpls/posts.html',
  controller: ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams) {
    $scope.baseLink = '/blog/#/archives/' + $stateParams.year + '-' + $stateParams.month + '/';
    $scope.currentPostsPageId = parseInt($stateParams.id);
    $scope.isLoadingPosts = true;
    $rootScope.$httpGet('/blog/v1/archives', {
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10',
      year: parseInt($stateParams.year),
      month: parseInt($stateParams.month)
    }, function(data, status, headers, config) {
      $scope.recentPosts = data.responseBody;
      $scope.isLoadingPosts = false;
    }, function(data, status, headers, config) {
      $scope.isLoadingPosts = false;
    }, undefined, true);
  }]
};