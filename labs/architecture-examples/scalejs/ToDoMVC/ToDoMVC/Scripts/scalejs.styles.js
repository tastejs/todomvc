/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            var names = name.match(/([^,]+)/g) || [];

            names = names.map(function (n) {
                if (n.indexOf('/') === -1) {
                    n = './styles/' + n;
                }

                return 'css!' + n;
            });

            req(names, function () {
                onLoad(Array.prototype.slice.call(arguments, 0, arguments.length));
            });
        }
    };
});