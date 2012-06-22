// Author: Pascal Hartig <phartig@weluse.de>
// Filename: main.js

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

require(['angular', 'controllers/todo', 'directives/todo'], function (angular) {
    angular.bootstrap(document, ['todomvc']);
});

// vim:sts=4:sw=4:ft=javascript
