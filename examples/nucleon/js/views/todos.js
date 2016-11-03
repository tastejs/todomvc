/**
 * This file handles the creation of our view.
 */
(function (app) {

    'use strict';

    // Registering a view in the app
    var view = app.views.add('todos', {
        root: '.todoapp',                   // Css selector to precise in which element rendered template has to be included in
        templateUrl: 'templates/todos.html' // Tells where to find the template
    });

}(this.app));
