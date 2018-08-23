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

const delay = require('delay');
const fs = require('fs');
const chokidar = require('chokidar');
const config = require('config');
const zuixConfig = config.get('zuix');
const sourceFolder = zuixConfig.get('build.input');

const BuildingState = {
    IDLE: 0,
    RUNNING: 1,
    PENDING: 2
};
let status = BuildingState.IDLE;

if (!fs.existsSync(zuixConfig.get('build.output'))) {
    build();
}

startWatch();

function build() {
    status = BuildingState.RUNNING;
    const childProcess = require('child_process');
    try {
        childProcess.execFileSync('npm', ['run', 'build'], {stdio: [0, 1, 2]});
    } catch (e) {
        // TODO: report exception?
    }
    delay(1000).then(function() {
        if (status === BuildingState.PENDING) {
            build();
        } else status = BuildingState.IDLE;
    });
}
function buildSite(path, stats) {
    // TODO: IMPORTANT! :)
    // TODO: optmize by using the actual changed file ('path' and 'stats')
    // TODO: and avoid run compile over all files every single time
    if (status === BuildingState.IDLE) {
        build();
    } else status = BuildingState.PENDING;
}

function fileChanged(path, stats) {
    buildSite(path, stats);
}

function startWatch() {
    // 'add', 'addDir' and 'change' events also receive stat() results as second
    // argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
    const watcher = chokidar.watch(['config', sourceFolder], {
        ignored: /[\/\\]\./, persistent: true
    });
    setTimeout(()=>{
        watcher
            .on('add', fileChanged)
            .on('change', fileChanged)
            //.on('unlink', fileChanged)
            .on('unlinkDir', fileChanged);
    }, 1000);
    /*
    watcher
        .on('add', function(path) { log('File', path, 'has been added'); })
        .on('addDir', function(path) { log('Directory', path, 'has been added'); })
        .on('change', function(path) { log('File', path, 'has been changed'); })
        .on('unlink', function(path) { log('File', path, 'has been removed'); })
        .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
        .on('error', function(error) { log('Error happened', error); })
        .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
        .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })
    */
}
