/*global define, LAZO */
/*jshint unused:false */
define(['lazoView'], function (View) {

    'use strict';

    return View.extend({

        tagName: 'li',

        events: {
            'click .toggle': 'toggle',
            'click .destroy': 'destroy',
            'dblclick label': 'edit',
            'keypress .edit': 'enter',
            'keydown .edit': 'revert',
            'blur .edit': 'update'
        },

        attributes: function () {
            var attributes = {},
                completed = this.model.get('completed'),
                filter = this.ctl.ctx.params.filter;

            if (this.model.get('completed')) {
                attributes['class'] = 'completed';
            }

            if (filter === 'completed' && !completed ||
                filter === 'active' && completed) {
                attributes['class'] = attributes['class'] ? attributes['class'] + ' hidden' : 'hidden';
            }

            return attributes;
        },

        afterRender: function () {
            this.$checkbox = this.$('.toggle');
            this.$input = this.$('.edit');
            this.listenTo(this.model, 'change', function () {
                this.$checkbox.prop('checked', this.model.get('completed'));
                this.$el.toggleClass(this.attributes()['class']);
                this.render();
                LAZO.app.trigger('todo-change');
            });
        },

        toggle: function (e) {
            this.model.save({
                'completed': e.target.checked
            });
        },

        destroy: function () {
            this.model.destroy();
        },

        edit: function () {
            this.$el.addClass('editing');
            this.$input.focus();
        },

        revert: function (e) {
            if (e.which === LAZO.app.ESC_KEY) {
                this.$el.removeClass('editing');
                this.$input.val(this.model.get('title'));
            }
        },

        update: function () {
            var value = this.$input.val();
            var trimmedValue = value.trim();

            if (!this.$el.hasClass('editing')) {
                return;
            }

            if (trimmedValue) {
                this.model.save({ title: trimmedValue });
            } else {
                this.destroy();
            }

            this.$el.removeClass('editing');
        },

        enter: function (e) {
            if (e.which === LAZO.app.ENTER_KEY) {
                this.update();
            }
        }

    });

});