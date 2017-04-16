/// <reference path="ViewModel.ts" />

var App;
(function (App) {
    'use strict';

    var ENTER_KEY = 13, ESCAPE_KEY = 27;

    // a factory function we can use to create binding handlers for specific keycodes
    var keyhandlerBindingFactory = function (keyCode) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                var wrappedHandler, newValueAccessor;

                // wrap the handler with a check for the enter key
                wrappedHandler = function (data, event) {
                    if (event.keyCode === keyCode) {
                        valueAccessor().call(this, data, event);
                    }
                };

                // create a valueAccessor with the options that we would want to pass to the event binding
                newValueAccessor = function () {
                    return {
                        keyup: wrappedHandler
                    };
                };

                // call the real event binding's init function
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    };

    // a custom binding to handle the enter key
    ko.bindingHandlers['enterKey'] = keyhandlerBindingFactory(ENTER_KEY);

    // another custom binding, this time to handle the escape key
    ko.bindingHandlers['escapeKey'] = keyhandlerBindingFactory(ESCAPE_KEY);

    // wrapper to hasFocus that also selects text and applies focus async
    ko.bindingHandlers['selectAndFocus'] = {
        init: function (element, valueAccessor, allBindingsAccessor, bindingContext) {
            ko.bindingHandlers.hasFocus['init'](element, valueAccessor, allBindingsAccessor, bindingContext);
            ko.utils.registerEventHandler(element, 'focus', function () {
                element.focus();
            });
        },
        update: function (element, valueAccessor) {
            ko.utils.unwrapObservable(valueAccessor()); // for dependency

            // ensure that element is visible before trying to focus
            setTimeout(function () {
                ko.bindingHandlers.hasFocus['update'](element, valueAccessor);
            }, 0);
        }
    };

    // check local storage for todos
    var todos = ko.utils.parseJson(localStorage.getItem('todos-typescript-knockoutjs'));

    // bind a new instance of our view model to the page
    var viewModel = new ViewModel(todos || []);
    ko.applyBindings(viewModel);

    // set up filter routing
    Router({ '/:filter': viewModel.showMode }).init();
})(App || (App = {}));
