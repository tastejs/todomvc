/* global plat, __extends */
/* jshint unused:false */
var todoapp;
(function (todoapp) {
    'use strict';
    (function (converters) {

        var Converters = (function () {
            function Converters() {
            }
            Converters.prototype.booleanToSelected = function (condition) {
                return this.booleanToValue('selected', condition);
            };

            Converters.prototype.booleanToCompleted = function (condition) {
                return this.booleanToValue('completed', condition);
            };

            Converters.prototype.booleanToState = function (condition) {
                return this.booleanToCompleted(condition) || 'active';
            };

            Converters.prototype.booleanToEditing = function (condition) {
                return this.booleanToValue('editing', condition);
            };

            Converters.prototype.booleanToValue = function (value, condition) {
                return !!condition ? value : '';
            };
            return Converters;
        })();
        converters.Converters = Converters;

        /**
        * Here is how you register an injectable. This injectable is registered as
        * 'converters'. If another component wants to use this injectable, it simply
        * adds 'converters' to its dependencies array. This injectable is interesting
        * because it is obtained as a resource from the Todo view control template.
        * Resources offer a way of including objects in your view outside of your context.
        */
        plat.register.injectable('converters', Converters);
    })(todoapp.converters || (todoapp.converters = {}));
    var converters = todoapp.converters;
})(todoapp || (todoapp = {}));
//# sourceMappingURL=converters.js.map
