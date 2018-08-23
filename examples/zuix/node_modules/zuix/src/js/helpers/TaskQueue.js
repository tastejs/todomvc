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

const _log =
    require('./Logger')('TaskQueue.js');

/**
 * Task Queue Manager
 *
 * @class TaskQueue
 * @constructor
 */
function TaskQueue(listener) {
    const _t = this;
    _t._worker = null;
    _t._taskList = [];
    _t._requests = [];
    if (listener == null) {
        listener = function() { };
    }
    _t.taskQueue = function(tid, fn, pri) {
        _t._taskList.push({
            tid: tid,
            fn: fn,
            status: 0,
            priority: pri,
            step: function(tid) {
                // var _h = this;
                // _h.tid = tid;
                _log.t(tid, 'load:step');
                listener(_t, 'load:step', {
                    task: tid
                });
            },
            end: function() {
                this.status = 2;
                let _h = this;
                _log.t(_h.tid, 'load:next', 'timer:task:stop');
                listener(_t, 'load:next', {
                    task: _h.tid
                });
                _t._taskList.splice(this.index, 1);
                _t.taskCheck();
                if (this._callback != null) {
                    this._callback.call(this);
                }
            },
            callback: function(callback) {
                this._callback = callback;
            }
        });
        _log.t(tid, 'task added', pri, 'priority');
        _t._taskList.sort(function(a, b) {
            return (a.priority > b.priority) ?
                1 :
                ((b.priority > a.priority)
                    ? -1 : 0);
        } );
        _t.taskCheck();
    };
    _t.taskCheck = function() {
        for (let i = 0; i < _t._taskList.length; i++) {
            if (_t._taskList[i].status === 0) {
                _t._taskList[i].status = 1;
                _log.t(_t._taskList[i].tid, 'load:begin', 'timer:task:start');
                listener(_t, 'load:begin', {
                    task: _t._taskList[i].tid
                });
                _t._taskList[i].index = i;
                (_t._taskList[i].fn).call(_t._taskList[i]);
                return;
            } else if (_t._taskList[i].status === 1) {
                // currently running
                return;
            } else if (_t._taskList[i].status === 2) {
                // TODO: _!!!-!
                return;
            }
        }
        _log.t('load:end');
        listener(_t, 'load:end');
    };
}

/**
 *
 * @param handler {function}
 */
TaskQueue.prototype.callback = function(handler) { };
TaskQueue.prototype.queue = function(tid, fn, pri) {
    return this.taskQueue(tid, fn, pri);
};

module.exports = TaskQueue;
