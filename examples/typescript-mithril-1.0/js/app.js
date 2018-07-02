'use strict';
/*global m */
var mainView = new MainView();
//m.route.prefix("?");
m.route(document.getElementById('todoapp'), '/', {
    '/': mainView,
    '/:filter': mainView
});
//# sourceMappingURL=app.js.map