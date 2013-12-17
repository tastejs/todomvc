/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            req(['scalejs!core', 'scalejs!extensions'], function (core) {
                if (config.isBuild) {
                    onLoad();
                } else {
                    var sandbox = core.buildSandbox(name);
                    onLoad(sandbox);
                }
            });
        }
    };
});