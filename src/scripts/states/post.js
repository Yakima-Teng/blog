const post = {
  url: '/posts/:id?from&value',
  templateUrl: 'tpls/post.html',
  controller: ['$rootScope', '$scope', '$stateParams', '$timeout', '$interval', '$sce', 'Api', function ($rootScope, $scope, $stateParams, $timeout, $interval, $sce, Api) {
    $scope.postId = $stateParams.id
    $scope.prePostId = ''
    $scope.prePostStatus = '正在查询上一篇文章信息'
    $scope.nextPostId = ''
    $scope.nextPostStatus = '正在查询下一篇文章信息'
    $scope.fromValueString = `?from=${$stateParams.from || 'posts'}&value=${$stateParams.value || ''}`

    /***********************************************************************************
     *                                                                                  *
     * 获取上一篇和下一篇文章标题和id
     *                                                                                  *
     ***********************************************************************************/
    Api.get('/blog/v1/post/siblings', {
      postId: $stateParams.id,
      from: $stateParams.from || 'posts',
      value: $stateParams.value || ''
    })
      .success(data => {
        if (data && data.code && data.code === '200') {
          $scope.prePostId = data.body.prev.post_id || ''
          $scope.prePostStatus = data.body.prev.post_id ? data.body.prev.post_title : '没有更早的文章了'

          $scope.nextPostId = data.body.next.post_id || ''
          $scope.nextPostStatus = data.body.next.post_id ? data.body.next.post_title : '没有更新的文章了'
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .error(() => {
        $scope.prePostId = ''
        $scope.prePostStatus = '获取上一篇文章信息失败'

        $scope.nextPostId = ''
        $scope.nextPostStatus = '获取下一篇文章信息失败'
      })

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
    $rootScope.isWaiting = true
    Api.get(`/blog/v1/posts/${$scope.postId}`)
      .success(data => {
        if (data && data.code && data.code === '200') {
          $scope.post = {
            post_id: data.body.post_id,
            post_title: data.body.post_title,
            post_content: $sce.trustAsHtml(Api.insertTagP(data.body.post_content)),
            post_date: data.body.post_date,
            cat_slug: data.body.cat_slug,
            cat_name: data.body.cat_name
          }
          Api.highlightCode()
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('Oh, there is something wrong')
        }
      })
      .finally(() => $rootScope.isWaiting = false)

    /**
     * 获取随机的20篇与当前文章相关的文章
     */
    $scope.getRelatedPost = () => Api.get('/blog/v1/related-posts', {
      postId: $scope.postId,
      limit: 20
    })
      .success(data => {
        if (data && data.code && data.code === '200') {
          $scope.relatedPosts = data.body.map(item => {
            return {
              post_id: item.post_id,
              post_title: item.post_title
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message} : ${data.code}`)
        } else {
          window.alert('获取相关文章列表失败')
        }
      })
      .error(() => {
        window.alert('获取相关文章列表失败')
      })

    /**
     * 获取最新的20条评论
     */
    $scope.getComments = () => Api.get('/blog/v1/comments', {
      postId: $scope.postId,
      limit: 20
    })
      .success(data => {
        if (data && data.code && data.code === '200') {
          $scope.relatedComments = data.body.map(item => {
            return {
              comment_author: item.comment_author,
              comment_author_url: item.comment_author_url,
              comment_date: item.comment_date,
              comment_agent: item.comment_agent,
              comment_content: item.comment_content,
              comment_id: item.comment_ID,
              comment_parent_id: item.comment_parent_ID
            }
          })
        } else if (data && data.code && data.code !== '200') {
          window.alert(`${data.message}: ${data.code}`)
        } else {
          window.alert('拉取评论列表失败')
        }
      })

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
      $scope.comment.parentId = c.comment_id
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
        $scope.comment.parentId = '0'
        $scope.comment.replyHint = ''
      }
      Api.post('/blog/v1/comment/create', {
        postId: $scope.postId,
        parentId: $scope.comment.parentId,
        author: $scope.comment.author,
        email: $scope.comment.email,
        url: $scope.comment.url,
        message: $scope.comment.message
      }).success(data => {
        if (data && data.code && data.code === '200') {
          $scope.comment.tip = data.message
          $scope.countingDown(6, () => {
            $scope.comment.flag = true
          })
          $scope.getComments()
        }
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
      return comment.comment_parent_id === 0
    }

    $scope.getRelatedPost()
    $scope.getComments()
  }]
}
