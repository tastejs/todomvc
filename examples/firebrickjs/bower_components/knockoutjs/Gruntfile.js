/*global module:false*/
module.exports = function(grunt) {
    var _ = grunt.util._;

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        fragments: './build/fragments/',
        banner: '/*!\n' +
                ' * Knockout JavaScript library v<%= pkg.version %>\n' +
                ' * (c) Steven Sanderson - <%= pkg.homepage %>\n' +
                ' * License: <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)\n' +
                ' */\n\n',

        checktrailingspaces: {
            main: {
                src: [
                    "**/*.{js,html,css,bat,ps1,sh}",
                    "!build/output/**",
                    "!node_modules/**"
                ],
                filter: 'isFile'
            }
        },
        build: {
            debug: './build/output/knockout-latest.debug.js',
            min: './build/output/knockout-latest.js'
        },
        dist: {
            debug: './dist/knockout.debug.js',
            min: './dist/knockout.js'
        },
        test: {
            phantomjs: 'spec/runner.phantom.js',
            node: 'spec/runner.node.js'
        }
    });

    grunt.registerTask('clean', 'Clean up output files.', function (target) {
        var output = grunt.config('build');
        var files = [ output.debug, output.min ];
        var options = { force: (target == 'force') };
        _.forEach(files, function (file) {
            if (grunt.file.exists(file))
                grunt.file.delete(file, options);
        });
        return !this.errorCount;
    });

    var trailingSpaceRegex = /[ ]$/;
    grunt.registerMultiTask('checktrailingspaces', 'checktrailingspaces', function() {
        var matches = [];
        this.files[0].src.forEach(function(filepath) {
            var content = grunt.file.read(filepath),
                lines = content.split(/\r*\n/);
            lines.forEach(function(line, index) {
                if (trailingSpaceRegex.test(line)) {
                    matches.push([filepath, (index+1), line].join(':'));
                }
            });
        });
        if (matches.length) {
            grunt.log.error("The following files have trailing spaces that need to be cleaned up:");
            grunt.log.writeln(matches.join('\n'));
            return false;
        }
    });

    function getReferencedSources(sourceReferencesFilename) {
        // Returns the array of filenames referenced by a file like source-references.js
        var result;
        global.knockoutDebugCallback = function(sources) { result = sources; };
        eval(grunt.file.read(sourceReferencesFilename));
        return result;
    }

    function getCombinedSources() {
        var fragments = grunt.config('fragments'),
            sourceFilenames = [
                fragments + 'extern-pre.js',
                fragments + 'amd-pre.js',
                getReferencedSources(fragments + 'source-references.js'),
                fragments + 'amd-post.js',
                fragments + 'extern-post.js'
            ],
            flattenedSourceFilenames = Array.prototype.concat.apply([], sourceFilenames),
            combinedSources = flattenedSourceFilenames.map(function(filename) {
                return grunt.file.read('./' + filename);
            }).join('');

        return combinedSources.replace('##VERSION##', grunt.config('pkg.version'));
    }

    function buildDebug(output) {
        var source = [];
        source.push(grunt.config('banner'));
        source.push('(function(){\n');
        source.push('var DEBUG=true;\n');
        source.push(getCombinedSources());
        source.push('})();\n');
        grunt.file.write(output, source.join('').replace(/\r\n/g, '\n'));
    }

    function buildMin(output, done) {
        var cc = require('closure-compiler');
        var options = {
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            output_wrapper: '(function() {%output%})();'
        };
        grunt.log.write('Compiling...');
        cc.compile('/**@const*/var DEBUG=false;' + getCombinedSources(), options, function (err, stdout, stderr) {
            if (err) {
                grunt.log.error(err);
                done(false);
            } else {
                grunt.log.ok();
                grunt.file.write(output, (grunt.config('banner') + stdout).replace(/\r\n/g, '\n'));
                done(true);
            }
        });
    }

    grunt.registerMultiTask('build', 'Build', function() {
        if (!this.errorCount) {
            var output = this.data;
            if (this.target === 'debug') {
                buildDebug(output);
            } else if (this.target === 'min') {
                buildMin(output, this.async());
            }
        }
        return !this.errorCount;
    });

    grunt.registerMultiTask('test', 'Run tests', function () {
        var done = this.async();
        grunt.util.spawn({ cmd: this.target, args: [this.data] },
            function (error, result, code) {
                if (code === 127 /*not found*/) {
                    grunt.verbose.error(result.stderr);
                    // ignore this error
                    done(true);
                } else {
                    grunt.log.writeln(result.stdout);
                    if (error)
                        grunt.log.error(result.stderr);
                    done(!error);
                }
            }
        );
    });

    grunt.registerTask('dist', function() {
        // Update the version in bower.json
        var bowerConfig = grunt.file.readJSON('bower.json'),
            version = grunt.config('pkg.version');
        bowerConfig.version = version;
        grunt.file.write('bower.json', JSON.stringify(bowerConfig, true, 2));

        var buildConfig = grunt.config('build'),
            distConfig = grunt.config('dist');
        grunt.file.copy(buildConfig.debug, distConfig.debug);
        grunt.file.copy(buildConfig.min, distConfig.min);

        console.log('To publish, run:');
        console.log('    git add bower.json');
        console.log('    git add -f ' + distConfig.debug);
        console.log('    git add -f ' + distConfig.min);
        console.log('    git checkout head');
        console.log('    git commit -m \'Version ' + version + ' for distribution\'');
        console.log('    git tag -a v' + version + ' -m \'Add tag v' + version + '\'');
        console.log('    git checkout master');
        console.log('    git push origin --tags');
    });

    // Default task.
    grunt.registerTask('default', ['clean', 'checktrailingspaces', 'build', 'test']);
};
