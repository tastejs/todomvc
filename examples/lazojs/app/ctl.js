/*global define  */
/*jshint unused:false */
define(['l!lazoCtl'], function (Ctl) {

    'use strict';

    return Ctl.extend({

        index: function (options) {
            var self = this;

            // get todos collection data, create instance, and store in component context
            this.loadCollection('todos', {
                success: function (collection) {
                    // create a reference to the collection in the component's context
                    // this context object will persist throughout the lifetime of the compoent
                    self.ctx.collections.todos = collection;
                    // tell the component what view to render
                    options.success('index');
                },
                error: function (err) {
                    options.error(err);
                }
            });
        }

    });

});