var archive = {
  url: '/archives/:year-:month/:id',
  templateUrl: 'tpls/posts.html',
  controller: function($rootScope, $scope, $stateParams) {
    $scope.baseLink = '/blog/#/archives/' + $stateParams.year + '-' + $stateParams.month + '/';
    $scope.currentPostsPageId = parseInt($stateParams.id);
    $scope.isLoadingPosts = true;
    $rootScope.$httpGet('/blog/v1/archives', {
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10',
      year: parseInt($stateParams.year),
      month: parseInt($stateParams.month)
    }, function(data, status, headers, config) {
      $scope.recentPosts = data.responseBody;
      $scope.isLoadingPosts = false;
    }, function(data, status, headers, config) {
      $scope.isLoadingPosts = false;
    }, undefined, true);
  }
};
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
var category = {
  url: '/categories/:slug/:id',
  templateUrl: 'tpls/posts.html',
  controller: function($rootScope, $scope, $stateParams) {
    $scope.baseLink = '/blog/#/categories/' + $stateParams.slug + '/';
    $scope.currentPostsPageId = parseInt($stateParams.id);
    $scope.isLoadingPosts = true;
    $rootScope.$httpGet('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      cat: $stateParams.slug.toLowerCase(),
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }, function(data, status, headers, config) {
      $scope.recentPosts = data.responseBody;
      $scope.isLoadingPosts = false;
    }, function(data, status, headers, config) {
      $scope.isLoadingPosts = false;
    }, undefined, true);
  }
};
var login = {
  url: '/login',
  templateUrl: 'tpls/login.html',
  controller: function($rootScope, $scope) {
    // $scope.output = document.getElementById('output');
    // $scope.writeToScreen = function(msg) {
    //     var output = document.getElementById('')
    //     var para = document.createElement('p');
    //     para.style.wordWrap = 'break-word';
    //     para.innerHTML = msg;
    //     $scope.output.appendChild(para);
    // };
    // $scope.doSend = function(msg) {
    //     $scope.writeToScreen('SENT: ' + msg);
    //     websocket.send(msg);
    // };
    // $scope.InitWebSocket = function() {
    //     var websocket = new WebSocket('ws://' + location.href.split('http://')[1].split('/#/')[0] + '/ws-login');
    //     websocket.onopen = function(event) {
    //         $scope.writeToScreen('CONNECTED');
    //         $scope.doSend('WebSocket rocks');
    //     };
    //     websocket.onclose = function(event) {
    //         $scope.writeToScreen('DISCONNECTED');
    //     };
    //     websocket.onmessage = function(event) {
    //         $scope.writeToScreen('<span style="color: blue;">RESPONSE: ' + event.data + '</span>');
    //         websocket.close();
    //     };
    //     websocket.onerror = function(event) {
    //         $scope.writeToScreen('<span style="color: red;">ERROR: ' + event.data + '</span>');
    //     };
    // };
    // $scope.InitWebSocket();
  }
};
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

'use strict'
var posts = {
  url: '/:id',
  templateUrl: 'tpls/posts.html',
  controller: function($rootScope, $scope, $stateParams) {
    $scope.baseLink = '/blog/#/'
    $scope.currentPostsPageId = parseInt($stateParams.id)
    $scope.isLoadingPosts = true
    $rootScope.$httpGet('/blog/v1/excerpts', {
      sortby: 'ID',
      order: 'desc',
      offset: (parseInt($stateParams.id) - 1) * 10,
      limit: '10'
    }, function(data, status, headers, config) {
      $scope.recentPosts = data.responseBody
      $scope.isLoadingPosts = false
    }, function(data, status, headers, config) {
      $scope.isLoadingPosts = false
    }, undefined, true)
  }
}

var randomPost = {
	url: '/posts/random',
	templateUrl: 'tpls/post.html',
	controller: function($rootScope, $scope, $injector) {
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
	}
};
