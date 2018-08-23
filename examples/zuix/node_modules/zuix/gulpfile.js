const gulp = require('./build/gulp')([
    'zuix/browserify',
    'zuix/compile',
    'zuix/dox',
    'bundler/browserify',
    'bundler/compile'
]);
gulp.task('default', function() {
    console.log('\nRunning ESLint...');
    // ESLint
    const eslint = require('gulp-eslint');
    return gulp.src(['./src/js/**'])
        .pipe(eslint('./eslintrc.json'))
        .pipe(eslint.results((results) => {
            // Called once for all ESLint results.
            for (let res in results) {
                if (results[res].filePath) {
                    console.log('+', results[res].filePath);
                    for (let msg in results[res].messages) {
                        let messageData = results[res].messages[msg];
                        if (messageData.severity == 2) {
                            console.log('error:', '\n', messageData);
                        }
                    }
                }
            }
            console.log(`= ${results.length} files linted.`);
            console.log(`  warnings : ${results.warningCount}`);
            console.log(`    errors : ${results.errorCount}`, '\n');
            if (results.errorCount == 0) {
                // zuix
                gulp.start('zuix/browserify');
                gulp.start('zuix/dox');
                // zuix-bundler
                gulp.start('bundler/browserify');
                // Wait browserify to complete before running google-closure-compiler
                gulp.on('task_stop', function (event) {
                    switch (event.task) {
                        case 'zuix/browserify':
                            gulp.start('zuix/compile');
                            break;
                        case 'bundler/browserify':
                            gulp.start('bundler/compile');
                            break;
                    }
                });
            }
        }))
        .pipe(eslint.failAfterError());
});
