/*global define */
/*jshint unused:false */
define(['lazoModel'], function (Model) {

    'use strict';

    return Model.extend({

        defaults: {
            title: '',
            completed: false,
            created: 0
        },

        initialize: function () {
            if (this.isNew()) {
                this.set('created', Date.now());
            }
        }

    });

});