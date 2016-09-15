var page = {
  url: '/pages/:name',
  templateUrl: 'tpls/page.html',
  controller: function($rootScope, $scope, $stateParams) {
    $rootScope.$httpGet('/blog/v1/pages/' + $stateParams.name, null, function(data, status, headers, config) {
      $scope.post = data.responseBody;
    }, function(data, status, headers, config) {
      console.log(data);
    }, undefined, true);
  }
};