/* global plat, __extends */
/* jshint unused:false */
var todoapp;
(function (todoapp) {
    'use strict';
    (function (models) {

        var State = (function () {
            function State(_repository) {
                this._repository = _repository;
            }
            State.prototype.getState = function () {
                return this._repository.getState();
            };

            State.prototype.setState = function (state) {
                this._repository.setState(state);
            };
            return State;
        })();
        models.State = State;

        plat.register.injectable('stateModel', State, [todoapp.repositories.StateRepository]);
    })(todoapp.models || (todoapp.models = {}));
    var models = todoapp.models;
})(todoapp || (todoapp = {}));
//# sourceMappingURL=state.model.js.map
