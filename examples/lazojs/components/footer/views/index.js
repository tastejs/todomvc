/*global define */
/*jshint unused:false */
define(['l!lazoView', 'underscore'], function (View, _) {

    'use strict';

    return View.extend({

        events: {
            'click #clear-completed': 'destroy'
        },

        initialize: function () {
            this.collection = this.ctl.ctx.collections.todos;

            this.setViewProps();
            this.setCount();
            this.listenTo(this.collection, 'add', this.updateCountDisplay);
            this.listenTo(this.collection, 'remove', this.updateCountDisplay);
            this.listenTo(this.collection, 'change', this.updateCountDisplay);
        },

        setCount: function () {
            this.completed = this.collection.completed().length;
            this.remaining = this.collection.remaining().length;
        },

        // set view properties for rendering; all view properties are automatically
        // serialized to the template rendering context
        setViewProps: function () {
            var filter = this.ctl.ctx.params.filter;
            var self = this;
            _.each(['all', 'active', 'completed'], function (filterName) {
                self[filterName + 'Selected'] = (!filter && filterName === 'all') || filter === filterName ? 'selected' : '';
            });

            this.hideCompletedBtn = this.completed ? '' : 'hidden';
        },

        destroy: function (e) {
            _.invoke(this.collection.completed(), 'destroy');
            this.updateCountDisplay();
        },

        updateCountDisplay: function () {
            this.setCount();
            this.$remaining.text(this.remaining);

            if (this.completed) {
                this.$completed.text('Clear completed (' + this.completed + ')')
                    .removeClass('hidden');
            } else {
                this.$completed.addClass('hidden');
            }
        },

        afterRender: function () {
            this.$remaining = this.$('#todo-count strong');
            this.$completed = this.$('#clear-completed');
        }

    });

});