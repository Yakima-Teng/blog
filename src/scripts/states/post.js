var post = {
  url: '/posts/:id',
  templateUrl: 'tpls/post.html',
  controller: function ($rootScope, $scope, $stateParams, $timeout, $interval, $sce) {
    /**
     * 获取当前postId对应的文章内容
     */
    $scope.getPost = function () {
      $rootScope.$httpGet('/blog/v1/posts/' + $scope.postId, null, function (data, status, headers, config) {
        $scope.post = data.responseBody
        $scope.post.post_content = $sce.trustAsHtml($rootScope.insertTagP($scope.post.post_content))
        $rootScope.highlightCode()
      }, null, undefined, false)
    }

    /**
     * 获取随机的一篇与当前文章相关的文章
     */
    $scope.getRelatedPost = function () {
      $rootScope.$httpGet('/blog/v1/related-posts', {
        id: $scope.postId,
        limit: 1
      }, function (data, status, headers, config) {
        $scope.relatedPosts = data.responseBody
      }, null, 20000, true)
    }

    /**
     * 获取最新的20条评论
     */
    $scope.getComments = function () {
      $rootScope.$httpGet('/blog/v1/comments', {
        postId: $scope.postId,
        limit: 20
      }, function (data, status, headers, config) {
        $scope.relatedComments = data.responseBody
      }, null, undefined, true)
    }

    /**
     * n秒倒计时，倒计时结束后清空评论反馈信息
     * 回调函数可选
     */
    $scope.countingDown = function (n, cb) {
      $scope.comment.timing = n
      $timeout(function () {
        $scope.comment.tip = ''
        if (cb) {
          cb()
        }
      }, n * 1000)
      var timer = $interval(function () {
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
    $scope.validateComment = function () {
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
    $scope.reply = function (commentObj) {
      var c = commentObj
      console.log(c)
      $scope.comment.parent = c.comment_ID
      $scope.comment.replyHint = 'to [[' + c.comment_author + ']]: '
      $scope.comment.message = $scope.comment.replyHint
      // 点击评论按钮后跳转到评论输入框
      $('#commentMessage').trigger('focus')
    }

    /**
     * 提交评论
     */
    $scope.submitComment = function () {
      if ($scope.comment.flag === false || $scope.validateComment() === false) {
        return
      }
      $scope.comment.flag = false
      // 如果用户在点击‘回复’按钮后删掉了评论正文开头处的回复提示文字，则不算进行回复，而是当做发布单独的新评论处理
      if ($scope.comment.replyHint === '' || $scope.comment.message.indexOf($scope.comment.replyHint) === -1) {
        $scope.comment.parent = '0'
        $scope.comment.replyHint = ''
      }
      $rootScope.$httpPost('/blog/v1/submit-comment', {
        postId: $scope.postId,
        parent: $scope.comment.parent,
        author: $scope.comment.author,
        email: $scope.comment.email,
        url: $scope.comment.url,
        message: $scope.comment.message
      }, function (resp) {
        var d = resp.data.responseBody
        if (!d.success) {
          $scope.comment.tip = d.msg
          $scope.countingDown(6, function () {
            $scope.comment.flag = true
          })
          return
        }
        $scope.comment.tip = d.msg
        $scope.countingDown(6, function () {
          $scope.comment.flag = true
        })
        $scope.getComments()
      }, function () {
        $scope.comment.tip = '提交评论失败，可能是网络问题'
        $scope.countingDown(6, function () {
          $scope.comment.flag = true
        })
      }, undefined, true)
    }

    /**
     * 获取一级评论
     */
    $scope.getFirstLevelComments = function (comment) {
      return comment.comment_parent === 0
    }

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

    $scope.getPost()
    $scope.getRelatedPost()
    $scope.getComments()
  }
}
