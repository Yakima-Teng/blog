var randomPost = {
	url: '/posts/random',
	templateUrl: 'tpls/post.html',
	controller: ['$rootScope', '$scope', '$injector', function($rootScope, $scope, $injector) {
		$injector.get('$templateCache').removeAll();
		$rootScope.$httpGet('/blog/v1/posts', {
			sortby: 'ID',
			order: 'rand',
			offset: 0,
			limit: '1'
			// cat: 'regulatory-affairs'
		}, function(data, status, headers, config) {
			console.log('again got random post!');
			$scope.post = data.responseBody[0];
			$rootScope.$httpGet('/blog/v1/related-posts', {
				id: $scope.post.ID,
				limit: 20
			}, function(data, status, headers, config) {
				$scope.relatedPosts = data.responseBody;
			}, function(data, status, headers, config) {
				console.log(data);
			}, undefined, true);

			$rootScope.$httpGet('/blog/v1/comments', {
				postId: $scope.post.ID,
				limit: 20
			}, function(data, status, headers, config) {
				console.log(data.responseBody);
				$scope.relatedComments = data.responseBody;
			}, function(data, status, headers, config) {
				console.log(data);
			}, undefined, true);
		}, function(data, status, headers, config) {
			console.log(data);
		}, undefined, true);
	}]
};
