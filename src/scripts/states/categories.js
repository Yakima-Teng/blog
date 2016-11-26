const categories = {
  url: '/categories',
  templateUrl: 'tpls/categories.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
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
    }
    $rootScope.isWaiting = true
    for (let i = 0, length = $rootScope.categories.length; i < length; i++) {
      Api.get('/blog/v1/posts', {
        sortby: 'ID',
        order: 'rand',
        cat: $rootScope.categories[i].slug
      }).success(data => {
        $rootScope.categories[i].posts = data.responseBody
      }).finally(() => $rootScope.isWaiting = false)
    }
  }]
}
