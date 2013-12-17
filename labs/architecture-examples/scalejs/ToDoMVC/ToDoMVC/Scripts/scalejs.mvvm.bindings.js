/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            var names = name.match(/([\w\-]+)/g) || [];

            names = names.map(function (n) {
                if (n.indexOf('.js', n.length - 3) > -1) {
                    return n;
                }

                if (n.indexOf('Bindings', n.length - 'Bindings'.length) === -1) {
                    n = n + 'Bindings';
                }

                if (n.indexOf('/') === -1) {
                    return './bindings/' + n;
                }

                return n;
            });

            names.push('scalejs.mvvm', 'scalejs!core');

            req(names, function () {
                var core = arguments[arguments.length - 1],
                    bindings = Array.prototype.slice.call(arguments, 0, arguments.length - 2);

                if (!config.isBuild) {
                    core.mvvm.registerBindings.apply(null, bindings);
                }

                onLoad(bindings);
            });
        }
    };
});