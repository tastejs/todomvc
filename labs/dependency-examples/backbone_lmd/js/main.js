var $ = require('$'),
    AppView = require('AppView'),
    Workspace = require('Workspace'),
    Backbone = require('Backbone');

$(function () {
    // Initialize routing and start Backbone.history()
    new Workspace();
    Backbone.history.start();

    // Initialize the application view
    new AppView();
});
