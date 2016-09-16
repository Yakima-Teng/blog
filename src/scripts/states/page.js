const page = {
  url: '/pages/:name',
  templateUrl: 'tpls/page.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    Api.get(`/blog/v1/pages/${$stateParams.name}`).success(data => $scope.post = data.responseBody)
  }]
}
