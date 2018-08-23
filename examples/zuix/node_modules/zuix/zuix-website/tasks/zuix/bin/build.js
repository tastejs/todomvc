/*
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

const staticSite = require('static-site');
const util = require('util');
const tlog = require('../lib/logger');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const measureTime = require('measure-time');

// Current package info
const pkg = require(process.cwd()+'/package.json');
tlog.term
    .bgDefaultColor()
    .defaultColor(util.format('^B%s^: v%s ^w%s^:\n',
        pkg.name, pkg.version, pkg.homepage));

// Configuration
tlog.info('^+Configuration')
    .br();
const config = require('config');
const zuixConfig = config.get('zuix');
const sourceFolder = zuixConfig.get('build.input');
const buildFolder = zuixConfig.get('build.output');
const copyFiles = zuixConfig.get('build.copy');
const ignoreFiles = zuixConfig.get('build.ignore');
const compileFiles = zuixConfig.get('build.compile');
const prettyUrl = zuixConfig.get('build.prettyUrl');
const bundle = zuixConfig.get('build.bundle');
const less = zuixConfig.get('build.less');
const esLint = zuixConfig.get('build.esLint');
const workBox = require('workbox-build');

// Build helpers list
const helperList = [];
const zuixHelpersPath = 'tasks/zuix/helpers/';
fs.readdirSync(zuixHelpersPath).forEach(file => {
    if (file.endsWith('.js')) {
        helperList.push(zuixHelpersPath + file);
    }
});
const customHelpersPath = sourceFolder+'/_helpers/';
if (fs.existsSync(customHelpersPath)) {
    fs.readdirSync(customHelpersPath).forEach(file => {
        if (file.endsWith('.js')) {
            helperList.push(customHelpersPath + file);
        }
    });
}

tlog.br('     ^Ginput^ %s', sourceFolder)
    .br('    ^Goutput^ %s', buildFolder)
    .br('      ^Gcopy^ %s', copyFiles)
    .br('    ^Gignore^ %s', ignoreFiles)
    .br('   ^Gcompile^ %s', compileFiles)
    .br(' ^GprettyUrl^ %s', prettyUrl)
    .br('   ^Ghelpers^ %s', JSON.stringify(helperList))
    .br('    ^Gbundle^ %s', JSON.stringify(bundle))
    .br('    ^Gminify^ %s', zuixConfig.build.minify != null && zuixConfig.build.minify !== false && zuixConfig.build.minify.disable !== true)
    .br('      ^Gless^ %s', less)
    .br('    ^GesLint^ %s', esLint)
    .br();

if (!fs.existsSync(sourceFolder)) {
    tlog.error('   "%s" does not exist', sourceFolder);
    process.exitCode = -1;
    return false;
}

// Build start
tlog.info('^+Copying base files from "%s" to "%s" ...', sourceFolder, buildFolder)
    .br().br();

// Copy files straight to the build folder without processing them
for (let i = 0; i < copyFiles.length; i++) {
    const path = copyFiles[i];
    const source = util.format('%s/%s', sourceFolder, path);
    const destination = util.format('%s/%s', buildFolder, path);
    tlog.overwrite('   | "%s" -> "%s"', source, destination);
    copyFolder(source, destination);
}

// Copy zuix-dist files and 'config.json'
tlog.overwrite('   | "%s" -> "%s"', 'zuix-dist', 'js');
// - last zUIx release
copyFolder(util.format('%s/node_modules/zuix-dist/js', process.cwd()), util.format('%s/js', buildFolder));
// - last zUIx build (if 'dist' folder is found in parent folder)
copyFolder(util.format('%s/../dist/js', process.cwd()), util.format('%s/js/zuix', buildFolder));
// - auto-generated config.js
copyAppConfig();
tlog.overwrite(' ^G\u2713^: done').br();

const getElapsed = measureTime();
tlog.info('^+Generating files ...');

// Parse and compile to static all other files
staticSite({
    build: buildFolder,
    source: sourceFolder,
    ignore: ignoreFiles.concat(copyFiles),
    files: compileFiles,
    prettyUrl: prettyUrl,
    helpers: helperList,
    templateEngine: 'tasks/zuix/engines/zuix-bundler.js'
}, function(err, stats) {
    tlog.term.defaultColor('\n\n');
    if (err != null) {
        tlog.term.bgBrightWhite().red('Error^: '+err+'\n');
        tlog.stats().error++;
    }
    const elapsed = getElapsed().millisecondsTotal;
    const count = stats.pages.length;
    tlog.term.defaultColor(util.format(
        'Generated ^B%s^: %s in ^B%s^:^w ms^:.\n%s ^r%s^: %s, ^y%s^: %s.\n\n',
        count,
        plural('file', count !== 1 ? 's' : ''),
        elapsed,
        tlog.stats().error === 0 ? '^G\u2713^:' : '^R*^:',
        tlog.stats().error,
        plural('error', tlog.stats().error),
        tlog.stats().warn,
        plural('warning', tlog.stats().warn),
    ));

    // TODO: run work box
    // NOTE: This should be run *AFTER* all your assets are built
    const buildSW = () => {
        // This will return a Promise
        return workBox.generateSW({

            globDirectory: buildFolder,
            globPatterns: [
                '**\/*.{html,json,js,css}',
                '**\/*.{png,jpg,jpeg,svg,gif}'
            ],

            swDest: path.join(buildFolder, 'service-worker.js'),

            // Define runtime caching rules.
            runtimeCaching: [{
                // Match any request ends with .png, .jpg, .jpeg or .svg.
                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

                // Apply a cache-first strategy.
                handler: 'cacheFirst',

                options: {
                    // Use a custom cache name.
                    cacheName: 'images',
                    // Cache up to 50 images.
                    expiration: {
                        maxEntries: 50,
                    }
                }
            },{
                // Match any request ends with .html, .json, .js or .css.
                urlPattern: /\.(?:html|json|js|css)$/,

                // Apply a cache-first strategy.
                handler: 'cacheFirst',

                options: {
                    // Use a custom cache name.
                    cacheName: 'default',
                    // Cache up to 50 items.
                    expiration: {
                        maxEntries: 50,
                    }
                }
            }]

        });
    };
    buildSW().then(function () {
        process.exitCode = tlog.stats().error;
    });
});

function copyAppConfig() {
    let cfg = `/* eslint-disable quotes */
(function() {
    zuix.store("config", `;
    cfg += JSON.stringify(config.get('zuix.app'), null, 8);
    cfg += ');\n';
    // WorkBox / Service Worker
    // TODO: fix service-worker path
    cfg += `
    // Check that service workers are registered
    if ('serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js');
        });
    }
})();\n`;
    fs.writeFileSync(buildFolder+'/config.js', cfg);
}

// destination type must match source (dir/dir or file/file)
function copyFolder(source, destination, done) {
    const ncp = require('ncp').ncp;
    // ncp.limit = 16;
    // ncp.stopOnErr = true;
    let folder = destination;
    if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isFile()) {
            folder = path.dirname(destination);
        }
        if (!fs.existsSync(folder)) {
            mkdirp.sync(folder);
            tlog.overwrite('   ^wcreated folder "%s"', folder)
                .br();
        }
    } else {
        tlog.overwrite();
        tlog.warn('   ^w"%s" not found', source)
            .br();
        // TODO: handle return value
        return false;
    }
    ncp(path.resolve(process.cwd(), source), path.resolve(process.cwd(), destination), function(err) {
        if (typeof done === 'function') {
            done(err);
        }
    });
}

function plural(s, n) {
    return s+(n !== 1 ? 's' : '');
}
