'use strict';
 
angular.module('genericServices', [])
  .service('ParseService', ['$rootScope', function($rootScope) {
    var app_id = "yWTZRz60WfymokTSxKeI11Lu7ZfZT0Ny3uT6GAV0";
    var js_key = "7luLgXpWuaOMG8chT2UGGKV4FDcSheihVsM06r6Y";
    Parse.initialize(app_id, js_key);
    $rootScope.currentUser = Parse.User.current();
  }]);