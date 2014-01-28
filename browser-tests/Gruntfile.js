module.exports = function (grunt) {
  
    grunt.loadNpmTasks('grunt-simple-mocha');

    var gruntConfig = {
        simplemocha: {
            options: {
                reporter: 'mocha-known-issues-reporter'            
            },
            files: {
              src: 'allTests.js'
            }
        }
    };
    grunt.initConfig(gruntConfig);

     // build tasks  
    grunt.registerTask('test', ['simplemocha']);
};
