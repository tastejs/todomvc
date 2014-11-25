/*global define */
/*jshint unused:false */
define(['lazoCollection', 'models/todo/model'], function (Collection, Model) {

    'use strict';

    return Collection.extend({

        // if using a model, other than the default base class
        // then reference to the class is required
        model: Model,

        // if using a model, other than the default base class
        // then the name of the model is required
        modelName: 'todo',

        comparator: function (todo) {
            return todo.get('created');
        },

        completed: function () {
            return this.filter(function (todo) {
                return todo.get('completed');
            });
        },

        remaining: function () {
            return this.without.apply(this, this.completed());
        }

    });

});