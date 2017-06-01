/**
 * This file handles the routing of our example
 */
(function (app) {

    'use strict';

    // Fetching model and view for todos example in the app
    var model = app.models.get('todos');
    var view = app.views.get('todos');

    // Registering our controller
    var ctrl = app.controllers.add('todos');

    // Registering an action in the controller for the example url
    ctrl.addAction('todos_home', {
        route: {
            url: '/examples/nucleon/(index.html)(#/{filter})',
            params: {
                filter: 'word'
            }
        },
        fn: function (e, params) {
            // Updating attribute "filter" from model
            model.filter = params.filter || '';
            // Render the view if not already done yet
            view.render(function () {
                // Focus on input
                app.first('[autofocus]').focus();
                // Publish navigation change event.
                // Will be caught by a listener to handle appearance of the corresponding button.
                app.channel.publish('navigation::change');
            });
        }
    });

}(this.app));
