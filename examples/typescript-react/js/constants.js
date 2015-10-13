var app;
(function (app) {
    var constants;
    (function (constants) {
        constants.ALL_TODOS = 'all';
        constants.ACTIVE_TODOS = 'active';
        constants.COMPLETED_TODOS = 'completed';
        constants.ENTER_KEY = 13;
        constants.ESCAPE_KEY = 27;
    })(constants = app.constants || (app.constants = {}));
})(app || (app = {}));
