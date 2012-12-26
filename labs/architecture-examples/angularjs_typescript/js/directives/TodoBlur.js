'use strict';
var TodoBlur = (function () {
    function TodoBlur() {
        var _this = this;
        this.link = function (s, e, a) {
            return _this.linkFn(s, e, a);
        };
    }
    TodoBlur.prototype.linkFn = function ($scope, elem, attrs) {
        elem.bind('blur', function () {
            $scope.$apply(attrs.todoBlur);
        });
    };
    return TodoBlur;
})();
//@ sourceMappingURL=TodoBlur.js.map
