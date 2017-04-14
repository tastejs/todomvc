/*global define*/
define([
    'mo/lang',
    'nerv'
], function (_, nerv) {
    'use strict';

    var uuid = +new Date();

    return nerv.model({

        init: function () {
            if (!this.get('iid')) {
                this.set('iid', ++uuid);
            }
        },

        defaults: {
            iid: 0,
            title: '',
            completed: false
        },

        toggle: function () {
            this.set('completed', !this.get('completed'));
        }

    });

});


