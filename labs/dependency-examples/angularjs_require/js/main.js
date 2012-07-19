'use strict';

require.config({
    paths: {
        angular: 'libs/angular/angular.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    }
});

require(['angular', 'app', 'controllers/todo', 'directives/todoFocus', 'directives/todoBlur'], function (angular) {
    angular.bootstrap(document, ['todomvc']);
});
