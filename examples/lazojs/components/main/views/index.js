/*global define */
/*jshint unused:false */
define(['l!lazoCollectionView'], function (View) {

    'use strict';

    return View.extend({

        events: {
            'click #toggle-all': 'toggle'
        },

        collection: 'todos',

        itemView: 'a:todo',

        initialize: function () {
            this.collection = this.ctl.ctx.collections.todos;
            // value used by template; all view properties are automatically serialized to template rendering context
            this.allChecked = !this.collection.remaining().length ? 'checked="checked"' : '';
        },

        toggle: function (e) {
            this.collection.each(function (todo) {
                todo.save({
                    'completed': e.target.checked
                });
            });
        }

    });

});