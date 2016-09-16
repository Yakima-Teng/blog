const post = {
  url: '/posts/:id',
  templateUrl: 'tpls/post.html',
  controller: ['$rootScope', '$scope', '$stateParams', '$timeout', '$interval', '$sce', 'Api', function ($rootScope, $scope, $stateParams, $timeout, $interval, $sce, Api) {
    $scope.postId = $stateParams.id

    $scope.comment = {
      parent: '',
      author: '',
      email: '',
      url: '',
      message: '',
      // 提交评论时（后）的反馈信息
      tip: '',
      // 提交评论时的倒计时
      timing: 5,
      // 判断是否允许提交评论: true可以，false不可以：防止用户连续快速点击评论按钮
      flag: true,
      // 回复评论时显示在评论内容开头的提示文字
      replyHint: ''
    }

    /**
     * 获取当前postId对应的文章内容
     */
    Api.get(`/blog/v1/posts/${$scope.postId}`).success(data => {
      $scope.post = data.responseBody
      $scope.post.post_content = $sce.trustAsHtml(Api.insertTagP($scope.post.post_content))
      Api.highlightCode()
    })

    /**
     * 获取随机的一篇与当前文章相关的文章
     */
    $scope.getRelatedPost = () => Api.get('/blog/v1/related-posts', {
      id: $scope.postId,
      limit: 1
    }).success(data => $scope.relatedPosts = data.responseBody)

    /**
     * 获取最新的20条评论
     */
    $scope.getComments = () => Api.get('/blog/v1/comments', {
      postId: $scope.postId,
      limit: 20
    }).success(data => $scope.relatedComments = data.responseBody)

    /**
     * n秒倒计时，倒计时结束后清空评论反馈信息
     * 回调函数可选
     */
    $scope.countingDown = (n, cb) => {
      $scope.comment.timing = n
      $timeout(() => {
        $scope.comment.tip = ''
        if (cb) { cb() }
      }, n * 1000)
      let timer = $interval(() => {
        $scope.comment.timing--
        if ($scope.comment.timing < 1) {
          $interval.cancel(timer)
          $scope.comment.timing = n
        }
      }, 1000)
    }

    /**
     * 验证评论
     */
    $scope.validateComment = () => {
      if (!$scope.comment.author) {
        $scope.comment.tip = '请输入姓名'
        $('#commentAuthor').trigger('focus')
        $scope.countingDown(6)
        return false
      }
      if (!$scope.comment.email) {
        $scope.comment.tip = '请输入邮箱'
        $('#commentEmail').trigger('focus')
        $scope.countingDown(6)
        return false
      }
      if (!$scope.comment.url) {
        $scope.comment.tip = '请输入博客地址'
        $('#commentUrl').trigger('focus')
        $scope.countingDown(6)
        return false
      }
      if (!$scope.comment.message) {
        $scope.comment.tip = '请输入评论内容'
        $('#commentMessage').trigger('focus')
        $scope.countingDown(6)
        return false
      }
      return true
    }

    /**
     * 回复评论
     */
    $scope.reply = (commentObj) => {
      const c = commentObj
      $scope.comment.parent = c.comment_ID
      $scope.comment.replyHint = `to [[${c.comment_author}]]: `
      $scope.comment.message = $scope.comment.replyHint
      // 点击评论按钮后跳转到评论输入框
      $('#commentMessage').trigger('focus')
    }

    /**
     * 提交评论
     */
    $scope.submitComment = () => {
      if ($scope.comment.flag === false || $scope.validateComment() === false) {
        return
      }
      $scope.comment.flag = false
      // 如果用户在点击‘回复’按钮后删掉了评论正文开头处的回复提示文字，则不算进行回复，而是当做发布单独的新评论处理
      if ($scope.comment.replyHint === '' || $scope.comment.message.indexOf($scope.comment.replyHint) === -1) {
        $scope.comment.parent = '0'
        $scope.comment.replyHint = ''
      }
      Api.post('/blog/v1/submit-comment', {
        postId: $scope.postId,
        parent: $scope.comment.parent,
        author: $scope.comment.author,
        email: $scope.comment.email,
        url: $scope.comment.url,
        message: $scope.comment.message
      }).success(data => {
        const d = data.responseBody
        if (d.success === false) {
          $scope.comment.tip = d.msg
          $scope.countingDown(6, () => {
            $scope.comment.flag = true
          })
          return
        }
        $scope.comment.tip = d.msg
        $scope.countingDown(6, () => {
          $scope.comment.flag = true
        })
        $scope.getComments()
      }).error(() => {
        $scope.comment.tip = '提交评论失败，可能是网络问题'
        $scope.countingDown(6, () => {
          $scope.comment.flag = true
        })
      })
    }

    /**
     * 获取一级评论
     */
    $scope.getFirstLevelComments = function (comment) {
      return comment.comment_parent === 0
    }

    $scope.getRelatedPost()
    $scope.getComments()
  }]
}
