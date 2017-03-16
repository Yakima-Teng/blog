var randomPost = {
	url: '/posts/random',
	templateUrl: 'tpls/post.html',
	controller: ['$rootScope', '$scope', '$injector', 'Api', function($rootScope, $scope, $injector, Api) {
		Api.wait(true)
		$injector.get('$templateCache').removeAll()
		Api.get('/blog/v1/posts', {
			sortby: 'ID',
			order: 'rand',
			offset: 0,
			limit: '1'
		}).success(data => {
			$scope.post = data.responseBody[0]
			Api.get('/blog/v1/related-posts', {
				id: $scope.post.ID,
				limit: 20
			})
			.success(data => $scope.relatedPosts = data.responseBody)
			.finally(() => Api.wait(false))
			Api.get('/blog/v1/comments', {
				postId: $scope.post.ID,
				limit: 20
			})
			.success(data => $scope.relatedComments = data.responseBody)
			.finally(() => Api.wait(false))
		})
	}]
}
