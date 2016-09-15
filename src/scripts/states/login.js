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