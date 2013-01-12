/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    coffee: {
      compile: {
        files: {
          "js/*.js": "src/**/*.coffee"
        },

        options: {
          flatten: false,
          bare: false
        }
      }
    },
    watch: {
      files: 'src/**/*.coffee',
      tasks: 'coffee'
    }
  });

  grunt.loadNpmTasks("grunt-contrib-coffee")
  // Default task.
  grunt.registerTask('default', 'coffee watch');
};
