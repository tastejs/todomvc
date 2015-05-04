/* jshint camelcase: false */
var path = require('path');

module.exports = function(grunt) {
    'use strict';

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        appName: '<%= pkg.name %>',
        public: 'public',
        build: 'build',
        server: 'server',
        dist: {
            client: 'dist/public',
            server: 'dist/server'
        },
        cwd: path.resolve('.')
    };

    // We need the user name for config_ccv_{user name}.json
    var exec = require('child_process').exec;
    exec('whoami', function (error, username) {
        username = username.split('\n')[0];
        config.username = username;
    });

    // Load grunt config
    require('load-grunt-config')(grunt, {
        init: true,


        // can optionally pass options to load-grunt-tasks.
        // If you set to false, it will disable auto loading tasks.
        loadGruntTasks: {

            pattern: ['grunt-*', '!grunt-template-jasmine-istanbul'],
            config: require('./package.json'),
            scope: 'devDependencies'
        },

        data: {
            /**
             * We read in our `package.json` file so we can access the package name and
             * version. It's already there, so we don't repeat ourselves here.
             */
            pkg: grunt.file.readJSON('package.json'),
            config: config
        }
    });
};
