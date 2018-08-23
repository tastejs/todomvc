const gulp = require('gulp');
module.exports = function(tasks) {
    tasks.forEach(function(name) {
        console.log('Adding task '+name+'...');
        gulp.task(name, require('./tasks/' + name));
    });
    return gulp;
};
