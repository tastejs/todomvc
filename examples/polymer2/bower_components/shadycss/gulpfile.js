/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const rename = require('gulp-rename');
const rollup = require('rollup-stream');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const closure = require('google-closure-compiler').gulp();
const size = require('gulp-size');
const runseq = require('run-sequence');

const modules = [
  'css-parse',
  'custom-style-element',
  'make-element',
  'svg-in-shadow',
  'style-util',
  'style-transformer'
];

const moduleTasks = modules.map((m) => {
  gulp.task(`test-module-${m}`, () => {
    return rollup({
      entry: `tests/module/${m}.js`,
      format: 'iife',
      moduleName: m
    })
    .pipe(source(`${m}.js`, 'tests/module'))
    .pipe(gulp.dest('./tests/module/generated'))
  });
  return `test-module-${m}`;
});

gulp.task('clean-test-modules', () => del(['tests/module/generated']));

gulp.task('test-modules', (cb) => {
  runseq('clean-test-modules', moduleTasks, cb);
});

function closurify(entry) {
  gulp.task(`closure-${entry}`, () => {
    return gulp.src(['src/*.js', 'entrypoints/*.js'])
    .pipe(sourcemaps.init())
    .pipe(closure({
      new_type_inf: true,
      compilation_level: 'ADVANCED',
      language_in: 'ES6_STRICT',
      language_out: 'ES5_STRICT',
      output_wrapper: '(function(){\n%output%\n}).call(self)',
      assume_function_wrapper: true,
      js_output_file: `${entry}.min.js`,
      entry_point: `/entrypoints/${entry}.js`,
      dependency_mode: 'STRICT',
      warning_level: 'VERBOSE',
      rewrite_polyfills: false,
      externs: 'externs/shadycss-externs.js'
    }))
    .pipe(size({showFiles: true, showTotal: false, gzip: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'))
  });
  return `closure-${entry}`;
}

function debugify(entry) {
  gulp.task(`debug-${entry}`, () => {
    return rollup({
      entry: `entrypoints/${entry}.js`,
      format: 'iife',
      moduleName: '${entry}',
    })
    .pipe(source(`${entry}.js`, 'entrypoints'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename(`${entry}.min.js`))
    .pipe(size({showFiles: true, showTotal: false, gzip: true}))
    .pipe(gulp.dest('./'))
  });
  return `debug-${entry}`;
}

const entrypoints = [
  'scoping-shim',
  'apply-shim',
  'custom-style-interface'
]

let closureTasks = entrypoints.map((e) => closurify(e));
let debugTasks = entrypoints.map((e) => debugify(e));

gulp.task('default', ['closure', 'test-modules']);

gulp.task('closure', closureTasks);

gulp.task('debug', debugTasks);
