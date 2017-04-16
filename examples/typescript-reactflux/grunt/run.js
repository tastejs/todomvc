
module.exports =  function (grunt) {
    'use strict';
    return {
        server: {
            cmd: 'node',
            args: [ '<%= config.server %>/app.js' ]
        },
        dist: {
            cmd: 'node',
            args: [ '<%= config.dist.server %>/app.js' ]
        },
        serverNoWait: {
            options: {
                wait: false,
                quiet: true
            },
            cmd: 'node',
            args: [ '<%= config.server %>/app.js' ]
        },
        distNoWait: {
            options: {
                wait: false,
                quiet: true
            },
            cmd: 'node',
            args: [ '<%= config.dist.server %>/app.js' ]
        }
    };
};
