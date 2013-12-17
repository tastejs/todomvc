/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            var names = name.match(/([\w\-]+)/g) || [];

            names = names.map(function (n) {
                if (n.indexOf('.html', n.length - 5) === -1) {
                    n = n + '.html';
                }

                if (n.indexOf('/') === -1) {
                    n = './views/' + n;
                }

                return 'text!' + n;
            });

            names.push('scalejs.mvvm', 'scalejs!core');

            req(names, function () {
                var core = arguments[arguments.length - 1],
                    views = Array.prototype.slice.call(arguments, 0, arguments.length - 2);

                if (!config.isBuild) {
                    core.mvvm.registerTemplates.apply(null, views);
                }

                onLoad(views);
            });
        }
    };
});