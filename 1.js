var app = angular.module('myApp',['ngMaterial', 'ngRoute']);
app.controller('MyController',  function($scope, $http, $mdToast, $rootScope, $location){
  $rootScope.dangxuat = function(){
    $rootScope.dangnhapchua = ''; 
    $location.path('/login');
    return false; // cho dừng lại, không chuyển trang nữa
  }
})
app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: 'pages/userlist.html',
    controller: 'userlistController'
  })
  .when('/danh_sach_nguoi_dung', 
  {
    templateUrl: 'pages/userlist.html',
    controller: 'userlistController'
  })
  .when('/them_nguoi_dung', 
  {
    templateUrl: 'pages/add_user.html',
    controller: 'addUserController'
  })
  .when('/login', 
  {
    templateUrl: 'pages/login.html',
    controller: 'loginController'
  })
  .otherwise({redirectTo: '/'})

})

 // trang danh sách người dùng
 app.controller('userlistController', function($scope, $rootScope, $mdToast, $http, $location){
    $rootScope.tieude = 'Danh sách người dùng';
    //kiểm tra người dùng đã đăng nhập chưa
    if(!$rootScope.dangnhapchua){
      $location.path('/login');
    }

    var duongdanapi = 'http://localhost:8080/API/user/ApigetData';
    $http.get(duongdanapi).then(function(res){
      // console.log(res.data);
      $scope.dulieunguoidung = res.data;
    }, function(er){})

    // đổi hiển thị
    $scope.doihienthi = function(nguoi){
      nguoi.hienthi = !nguoi.hienthi; // đơn giản là đổi lại giá trị của một người
    }

    // Lưu dữ liệu sau khi sửa
    $scope.luudulieu = function(nguoi){
      nguoi.hienthi = !nguoi.hienthi; 
      // lấy dữ liệu về đã
      var dulieu = $.param({
        id: nguoi.id,
        username: nguoi.username,
        level: nguoi.level
      });
      console.log(dulieu); // kiểm tra
      var urlAPI = 'http://localhost:8080/API/user/APIupdateData';
      console.log(dulieu);
      var config = {
        headers:{
         'content-type' : 'application/x-www-form-urlencoded; charset = UTF-8'
        }
      }
      $http.post(urlAPI, dulieu, config)
      .then(function(res){
        console.log(res.data);
        $scope.trangthai("Cập nhật dữ liệu thành công!");
      }, function(er){
          console.log(er.data);
      })
    }


    // hiển thị thông báo
    var last = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
      .filter(function(pos){ 
        return $scope.toastPosition[pos]; 
      })
      .join(' ');
    };

    function sanitizePosition() {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    $scope.trangthai = function(thongbao) {
      var pinTo = $scope.getToastPosition();

      $mdToast.show(
        $mdToast.simple()
        .textContent(thongbao)
        .position(pinTo )
        .hideDelay(500)
        );
    };

    $scope.showActionToast = function() {
      var pinTo = $scope.getToastPosition();
      var toast = $mdToast.simple()
      .textContent('Marked as read')
      .action('UNDO')
      .highlightAction(true)
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position(pinTo);

      $mdToast.show(toast)
      .then(function(response) {
        if ( response == 'ok' ) {
          alert('You clicked the \'UNDO\' action.');
        }
      });
    };

 })

 // trang đăng nhập
 app.controller('loginController', function($scope, $mdToast, $http, $rootScope, $location){
    //định nghĩa về giao diện
    $rootScope.menubentrai = 'offcanvas';
    $rootScope.hienthimenutren = 'hidden-xs-up';


    // định nghĩa gọi hàm
    $scope.dangnhap = function(nguoidung){
      //lấy về xem chạy đc chưa
      console.log(nguoidung.username);
      console.log(nguoidung.password);

      var dulieu = $.param({
         username: nguoidung.username,
         password: nguoidung.password
      });
      var urlAPI = 'http://localhost:8080/API/user/ApiLogin/';
      console.log(dulieu);
      var config = {
        headers:{
          'content-type' : 'application/x-www-form-urlencoded; charset = UTF-8'
        }
      }
      $http.post(urlAPI, dulieu, config)
      .then(function(res){
          console.log(res.data);
            if((res.data.trangthai == 'dntc') && (res.data.level == 1)){
              $scope.trangthai('Đăng Nhập Thành Công!');
              // chuyển hướng
              $location.path('/');
              // cho hiển thị menu trên 
              $rootScope.hienthimenutren = '';
              // $rootScope.menubentrai = '';
              $rootScope.dangnhapchua = "roi";
              console.log($rootScope.hienthimenutren);
              console.log($rootScope.menubentrai);
            }
            else if((res.data.trangthai == 'dntc') && (res.data.level == 2)){
              $scope.trangthai('Không đủ quyền hạn truy cập quản trị!');
            }
            else{
              $scope.trangthai('Đăng nhập thất bại!');
            }
      }, function(er){
          console.log(er.data);
      })

      // hiển thị thông báo
      var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos){ 
          return $scope.toastPosition[pos]; 
        })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      $scope.trangthai = function(thongbao) {
        var pinTo = $scope.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
          .textContent(thongbao)
          .position(pinTo )
          .hideDelay(500)
          );
      };

      $scope.showActionToast = function() {
        var pinTo = $scope.getToastPosition();
        var toast = $mdToast.simple()
        .textContent('Marked as read')
        .action('UNDO')
        .highlightAction(true)
        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
        .position(pinTo);

        $mdToast.show(toast)
        .then(function(response) {
          if ( response == 'ok' ) {
            alert('You clicked the \'UNDO\' action.');
          }
        });
      };

    }
  })

 // trang thêm người dùng
 app.controller('addUserController', function($scope, $mdToast, $http, $rootScope){
  $rootScope.tieude = "Thêm người dùng";

  //kiểm tra người dùng đã đăng nhập chưa
    if(!$rootScope.dangnhapchua){
      $location.path('/login');
    }

    // lấy thông tin người dùng nhập vào
    // ng-model lấy bằng cách sử dụng scope.
    $scope.addUser = function(){
      // console.log($scope.username);
      // console.log($scope.password);
      // console.log($scope.level);
      var dulieu = $.param({
        username: $scope.username,
        password: $scope.password,
        level: $scope.level
      });
      var urlAPI = 'http://localhost:8080/API/user/addUser';
      console.log(dulieu);
      var config = {
        headers:{
          'content-type':'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
      $http.post(urlAPI, dulieu, config)
      .then(function(res){
          //thành công
          if(res.data == "Thêm thành công"){
            $scope.trangthai('cập nhật thành công!');
          }
          else
          {
            $scope.trangthai('cập nhật thất bại!');
          }
          // console.log(res.data);
        }, function(er){
          console.log(er.data);
        })
    }
    
    // hiển thị thông báo
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
      .filter(function(pos){ 
        return $scope.toastPosition[pos]; 
      })
      .join(' ');
    };

    function sanitizePosition() {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    $scope.trangthai = function(thongbao) {
      var pinTo = $scope.getToastPosition();

      $mdToast.show(
        $mdToast.simple()
        .textContent(thongbao)
        .position(pinTo )
        .hideDelay(3000)
        );
    };

    $scope.showActionToast = function() {
      var pinTo = $scope.getToastPosition();
      var toast = $mdToast.simple()
      .textContent('Marked as read')
      .action('UNDO')
      .highlightAction(true)
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position(pinTo);

      $mdToast.show(toast)
      .then(function(response) {
        if ( response == 'ok' ) {
          alert('You clicked the \'UNDO\' action.');
        }
      });
    };
})
