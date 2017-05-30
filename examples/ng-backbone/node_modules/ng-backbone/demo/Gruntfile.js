module.exports = function( grunt ) {
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-contrib-sass" );
  grunt.loadNpmTasks( "grunt-shell" );
  grunt.initConfig({
    sass: {
      app: {
        options: {
          style: "compressed",
          unixNewlines: true
        },
        files: [{
          expand: true,
          cwd: "./src/Sass",
          src: [ "*.scss" ],
          dest: "./build/css/",
          ext: ".css"
        }]
      },
      debug: {
        options: {
          style: "expanded",
          unixNewlines: true,
          trace: true,
          sourcemap: "inline"
        },
        files: [{
          expand: true,
          cwd: "./src/Sass",
          src: [ "*.scss" ],
          dest: "./build/css",
          ext: ".css"
        }]
      }
    },

    pkg: grunt.file.readJSON("package.json"),

    watch: {
      options: {
        livereload: false
      },
      js: {
        files: [ "./src/Js/**/**/**/**/*.ts" ],
        tasks: [ "shell:init", "shell:tsc" ]
      },
      styles: {
          files: [ "./src/Sass/**/**/**/*.scss" ],
          tasks: [ "shell:init", "sass:debug" ]
      }
    },

    shell: {
      init: {
        command: "mkdir -p ./build/js && " +
          "mkdir -p ./build/css/ "
      },
      tsc: {
        command: "tsc"
      },
      clean: {
        command: "cd src/Js && find . -name \"*.js\" -type f -delete && cd -"
      }
    }
  });

  grunt.registerTask( "test", [ "shell:tsc" ]);
  grunt.registerTask( "debug", [ "shell:init", "sass:debug", "shell:tsc" ]);
  grunt.registerTask( "build", [ "shell:init", "sass:app", "shell:tsc", "shell:clean" ]);
  grunt.registerTask( "default", ["build"]);

};
