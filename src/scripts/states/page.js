const page = {
  url: '/pages/:name',
  templateUrl: 'tpls/page.html',
  controller: ['$rootScope', '$scope', '$stateParams', 'Api', function($rootScope, $scope, $stateParams, Api) {
    Api.wait(true)
    Api.get(`/blog/v1/pages/${$stateParams.name}`).success(data => {
      if (data && data.code && data.code === '200') {
        if (data && data.code && data.code === '200') {
          $scope.post = {
            post_id: data.body.post_id,
            post_title: data.body.post_title,
            post_content: data.body.post_content
          }
        }
      } else if (data && data.code && data.code !== '200') {
        window.alert(`${data.message} : ${data.code}`)
      } else {
        window.alert('查询文章内容失败')
      }
    }).finally(() => Api.wait(false))
  }]
}
