/// <reference path="../node_modules/angular2/platform/browser.d.ts" />
/// <reference path="../node_modules/angular2/core.d.ts" />
System.register(['angular2/platform/browser', 'angular2/core', './app', 'redux', './todoReducer', './todoActions'], function(exports_1) {
    "use strict";
    var browser_1, core_1, app_1, redux_1, todoReducer_1, todoActions_1;
    var appStore;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (redux_1_1) {
                redux_1 = redux_1_1;
            },
            function (todoReducer_1_1) {
                todoReducer_1 = todoReducer_1_1;
            },
            function (todoActions_1_1) {
                todoActions_1 = todoActions_1_1;
            }],
        execute: function() {
            appStore = redux_1.createStore(todoReducer_1.TodoReducer);
            core_1.enableProdMode();
            browser_1.bootstrap(app_1.App, [
                core_1.provide('AppStore', { useValue: appStore }),
                todoActions_1.TodoActions
            ])
                .catch(function (err) { return console.error(err); });
        }
    }
});
//# sourceMappingURL=bootstrap.js.map