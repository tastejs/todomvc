/* global plat, __extends */
/* jshint unused:false */
var todoapp;
(function (todoapp) {
    'use strict';
    (function (repositories) {

        var StateRepository = (function () {
            function StateRepository(storage) {
                this.storage = storage;
                this.stateId = 'state-platypits';
            }
            StateRepository.prototype.getState = function () {
                return this.storage.getItem(this.stateId) || '';
            };

            StateRepository.prototype.setState = function (state) {
                if (state === 'all') {
                    state = '';
                }

                this.storage.setItem('state-platypits', state);
            };
            return StateRepository;
        })();
        repositories.StateRepository = StateRepository;

        plat.register.injectable('stateRepository', StateRepository, [plat.storage.LocalStorage]);
    })(todoapp.repositories || (todoapp.repositories = {}));
    var repositories = todoapp.repositories;
})(todoapp || (todoapp = {}));
//# sourceMappingURL=state.repository.js.map
