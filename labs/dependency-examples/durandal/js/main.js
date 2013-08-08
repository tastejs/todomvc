/*global requirejs, define, ko */
'use strict';

requirejs.config({
    paths: {
        'text': 'bower_components/durandal/amd/text'
    },
    baseUrl: './'
});

var ENTER_KEY = 13;

// a custom binding to handle the enter key (could go in a separate library)
ko.bindingHandlers.enterKey = {
    init: function (element, valueAccessor, allBindingsAccessor, data) {
        var wrappedHandler, newValueAccessor;

        // wrap the handler with a check for the enter key
        wrappedHandler = function (data, event) {
            if (event.keyCode === ENTER_KEY) {
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
        ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
    }
};

// wrapper to hasfocus that also selects text and applies focus async
ko.bindingHandlers.selectAndFocus = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        ko.bindingHandlers.hasfocus.init(element, valueAccessor, allBindingsAccessor);
        ko.utils.registerEventHandler(element, 'focus', function () {
            element.focus();
        });
    },
    update: function (element, valueAccessor) {
            ko.utils.unwrapObservable(valueAccessor()); // for dependency
            // ensure that element is visible before trying to focus
            setTimeout(function () {
                ko.bindingHandlers.hasfocus.update(element, valueAccessor);
            }, 0);
        }
};



define(['bower_components/durandal/app',
    'bower_components/durandal/viewLocator',
    'bower_components/durandal/system',
    'bower_components/durandal/plugins/router'],
    function (app, viewLocator, system, router) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'Durandal Starter Kit';
        app.start().then(function () {
            //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
            //Look for partial views in a 'views' folder in the root.
            viewLocator.useConvention();

            //configure routing
            router.useConvention('js/viewmodels');
            router.mapNav('todoapp');
            // router.mapNav('flickr');

            app.adaptToDevice();

            //Show the app by setting the root view model for our application with a transition.
            app.setRoot('js/viewmodels/shell');
        });
    });