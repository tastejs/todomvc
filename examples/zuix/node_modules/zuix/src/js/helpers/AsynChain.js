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

'use strict';

function AsynChain(callback) {
    listener = callback;
}

AsynChain.prototype.isReady = function() {
    return jobsList.length === 0 || currentIndex === -1;
};
AsynChain.prototype.getJobs = function() {
    return jobsList;
};
AsynChain.prototype.setJobs = function(list) {
    if (jobsList.length > 0) {
        // TODO: this case should never happen
        currentIndex = -1;
        jobsList.length = 0;
        // done();
        return;
    }
    jobsList = list.slice();
    listener.status('start', jobsList);
    next();
};
AsynChain.prototype.append = function(list) {
    // TODO: this is causing stack-overflow
    if (this.isReady()) {
        this.setJobs(list);
    } else {
        Array.prototype.push.apply(jobsList, list);
    }
};

// --------------------------------------------

let jobsList = [];
let currentIndex = -1;
let listener = null;
let lazyThread = null;

function next() {
    resetAsynCallback();
    currentIndex++;
    if (currentIndex < jobsList.length && !listener.willBreak()) {
        worker();
        return true;
    }
    if (currentIndex >= jobsList.length || listener.willBreak()) {
        done();
    }
    return false;
}
function done(reason) {
    currentIndex = -1;
    jobsList.length = 0;
    jobsList = [];
    listener.status(reason != null ? reason : 'done');
}

function worker() {
    const job = jobsList[currentIndex];
    if (job == null) {
        return false;
    }
    const doWork = function() {
        resetAsynCallback();
        if (!listener.doWork(job.item, function() {
            lazyThread = requestAnimationFrame(next);
        })) {
            next();
        }
    };
    if (job.cancelable) {
        if (listener.willBreak()) {
            done('stopped');
        } else if (lazyThread == null) {
            lazyThread = requestAnimationFrame(doWork);
        } else {
            return false;
        }
    } else {
        doWork();
    }
    return true;
}

function resetAsynCallback() {
    if (lazyThread !== null) {
        cancelAnimationFrame(lazyThread);
        lazyThread = null;
    }
}

module.exports = function(callback) {
    return new AsynChain(callback);
};
