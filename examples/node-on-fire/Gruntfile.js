var build = require('fire/lib/modules/build');

module.exports = function(grunt) {
    var config = {
        pkg: grunt.file.readJSON('package.json')
    };

    config = build.extendConfig(config, grunt);
    grunt.initConfig(config);
};
