var categories = {
  url: '/categories',
  templateUrl: 'tpls/categories.html',
  controller: function($rootScope, $scope, $stateParams) {
    for (var i = 0; i < $rootScope.categories.length; i++) {
      (function(index) {
        $rootScope.$httpGet('/blog/v1/posts', {
          sortby: 'ID',
          order: 'rand',
          cat: $rootScope.categories[index].slug
        }, function(data, status, headers, config) {
          $rootScope.categories[index].posts = data.responseBody;
        }, function(data, status, headers, config) {
          console.log(data);
        }, undefined, true);
      })(i);
    }
    $scope.categoriesLogos = {
      'qq-diary': 'fa-qq',
      'qq-copy': 'fa-folder-o',
      diary: 'fa-user',
      authoring: 'fa-edit',
      else: 'fa-terminal',
      'office-software': 'fa-file-word-o',
      'article-by-others': 'fa-chrome',
      usp: 'fa-rocket',
      english: 'fa-beer',
      'pharmaceutical-information': 'fa-newspaper-o',
      'regulatory-affairs': 'fa-registered',
      'pharmaceutical-knowledge': 'fa-university',
      'reading-book': 'fa-book'
    };
  }
};