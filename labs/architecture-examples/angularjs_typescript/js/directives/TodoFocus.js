'use strict';
var TodoFocus = (function () {
    function TodoFocus($timeout) {
        this.$timeout = $timeout;
        var _this = this;
        this.link = function (s, e, a) {
            return _this.linkFn(s, e, a);
        };
    }
    TodoFocus.prototype.linkFn = function ($scope, elem, attrs) {
        var _this = this;
        $scope.$watch(attrs.todoFocus, function (newval) {
            if(newval) {
                _this.$timeout(function () {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
    return TodoFocus;
})();
//@ sourceMappingURL=TodoFocus.js.map
