// Define libraries
require.config({
    baseUrl: 'js/',
    paths: {
        jquery: 'libs/jquery-1.7.1.min',
        ember: 'libs/ember-0.9.min',
        text: 'libs/require/text'
    }
});

// Load our app
define('Todos', [
    'jquery',
    'ember',
    'app/models/store'
    ], function($, Ember, Store) {
        return window.Todos = Em.Application.create({
            VERSION: '0.1-omfg',
            rootElement: '#todoapp .content',
            Models: {},
            Controllers: {},
            Views: {},
            // App viewport
            viewport: Em.ContainerView.create({
                addView: function(view) {
                    this.get('childViews').pushObject(view);
                }
            }),
            init: function() {
                this._super();
                this.get('viewport').appendTo(this.get('rootElement'));
                this.Models.Store = new Store('todos-emberjs');
                require(['app/controllers/create'], function(c){
                    c.activate();
                });
            }
        });
    }
);
