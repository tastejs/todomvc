/*global define, LAZO */
/*jshint unused:false */
define(['l!lazoCollectionView', 'underscore'], function (View, _) {

    'use strict';

    return View.extend({

        events: {
            'click #toggle-all': 'toggle',
            'keypress #new-todo': 'create',
            'click #clear-completed': 'destroy'
        },

        // pull in collection instance from component context
        collection: 'todos',

        // use app/views/todo.js && todo.hbs
        itemView: 'a:todo',

        initialize: function () {
            this.setCount();
            this.setViewProps();
            this.listenTo(this.collection, 'add', this.updateCountDisplay);
            this.listenTo(this.collection, 'remove', this.updateCountDisplay);
            this.listenTo(this.collection, 'change', this.updateCountDisplay);
        },

        afterRender: function () {
            this.$remaining = this.$('#todo-count strong');
            this.$completed = this.$('#clear-completed');
            this.$input = this.$('#new-todo');
            this.$allCheckbox = this.$('#toggle-all');
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
            this.allChecked = !this.remaining ? 'checked="checked"' : '';
        },

        destroy: function () {
            _.invoke(this.collection.completed(), 'destroy');
            this.updateCountDisplay();
        },

        // create new todo on enter
        create: function (e) {
            if (e.which !== LAZO.app.ENTER_KEY || !this.$input.val().trim()) {
                return;
            }

            this.ctl.ctx.collections.todos.create({
                title: this.$input.val()
            }, { slient: true });

            this.$input.val('');
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

        toggle: function (e) {
            this.collection.each(function (todo) {
                todo.save({
                    'completed': e.target.checked
                });
            });
        }

    });

});