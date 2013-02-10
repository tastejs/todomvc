var todos;
(function (todos) {
    'use strict';
    var TodoFocus = (function () {
        function TodoFocus($timeout) {
            this.$timeout = $timeout;
            var _this = this;
            this.link = function ($scope, element, attributes) {
                return _this.linkFn($scope, element, attributes);
            };
        }
        TodoFocus.prototype.injection = function () {
            return [
                '$timeout', 
                function ($timeout) {
                    return new TodoFocus($timeout);
                }            ];
        };
        TodoFocus.prototype.linkFn = function ($scope, element, attributes) {
            var _this = this;
            $scope.$watch(attributes.todoFocus, function (newval) {
                if(newval) {
                    _this.$timeout(function () {
                        element[0].focus();
                    }, 0, false);
                }
            });
        };
        return TodoFocus;
    })();
    todos.TodoFocus = TodoFocus;    
})(todos || (todos = {}));
//@ sourceMappingURL=TodoFocus.js.map
