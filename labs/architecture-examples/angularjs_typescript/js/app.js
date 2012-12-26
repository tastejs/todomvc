'use strict';
var todomvc = angular.module('todomvc', []).controller('todoCtrl', TodoCtrl).directive('todoBlur', function () {
    return new TodoBlur();
}).directive('todoFocus', function ($timeout) {
    return new TodoFocus($timeout);
}).service('todoStorage', TodoStorage);
//@ sourceMappingURL=app.js.map
