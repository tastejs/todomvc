var todos;
(function (todos) {
    'use strict';
    var TodoBlur = (function () {
        function TodoBlur() {
            var _this = this;
            this.link = function ($scope, element, attributes) {
                return _this.linkFn($scope, element, attributes);
            };
        }
        TodoBlur.prototype.injection = function () {
            return [
                function () {
                    return new TodoBlur();
                }            ];
        };
        TodoBlur.prototype.linkFn = function ($scope, element, attributes) {
            element.bind('blur', function () {
                $scope.$apply(attributes.todoBlur);
            });
        };
        return TodoBlur;
    })();
    todos.TodoBlur = TodoBlur;    
})(todos || (todos = {}));
//@ sourceMappingURL=TodoBlur.js.map
