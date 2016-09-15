'use strict'
var posts = {
  url: '/:id',
  templateUrl: 'tpls/posts.html',
  controller: function($rootScope, $scope, $stateParams) {
    $scope.baseLink = '/blog/#/'
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $scope.isLoadingPosts = true
    $rootScope.$httpGet('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }, function(data, status, headers, config) {
      $scope.recentPosts = data.responseBody
      $scope.isLoadingPosts = false
    }, function(data, status, headers, config) {
      $scope.isLoadingPosts = false
    }, undefined, true)
  }
}
