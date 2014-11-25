/*global define, LAZO */
/*jshint unused:false */
define(['lazoSyncher', 'fs'], function (LazoSyncher, fs) {

    'use strict';

    var todosPath = LAZO.FILE_REPO_PATH + '/models/todos.json',
        getTodos;

    getTodos = function (options) {
        return fs.existsSync(todosPath) ? JSON.parse(fs.readFileSync(todosPath, 'utf8')) : [];
    };

    return LazoSyncher.extend({

        fetch: function (options) {
            options.success(getTodos(options));
        }

    });
});
