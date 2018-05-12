module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            clean: [
                "dist"
            ]
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: 'bundle-min.js',
                        dest: 'dist'
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: '\n\n',
                //stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
            },
            dist: {
                files: {
                    'src/bundle.js': [
                        'node_modules/twobirds-core/dist/tb/tb.js',
                        'src/src/app.js',
                        'src/src/app/*.js'
                    ]
                },
                nonull: true
            }
        },

        uglify: {
            options: {
            },
            my_target: {
                options: {
                    mangle: true
                },
                files: [
                    {
                        'src/bundle-min.js': [
                            'src/bundle.js'
                        ]
                    }
                ]
            }
        },

        jshint: {
            options: {
                esversion: 6,
                force: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: false,
                noarg: false,
                sub: true,
                undef: true,
                boss: true,
                debug: true,
                eqnull: true,
                node: true,
                laxbreak: true,
                laxcomma: true,
                globals: {
                    exports: true,
                    module: false,
                    tb: true,
                    Tb: true,
                    "window": false,
                    "document": false,
                    "HTMLCollection": false,
                    "HTMLElement": false,
                    "NodeList": false,
                    "XMLHttpRequest": false,
                    "ActiveXObject": false,
                    "customElements": false
                }
            },
            all: [
                'src/bundle.js'
            ]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask(
        'default', [
            'clean',
            'concat',
            'jshint',
            'uglify',
            'copy:main'
        ]
    );

};
