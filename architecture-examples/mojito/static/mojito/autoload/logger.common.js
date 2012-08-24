/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('mojito-logger', function(Y, NAME) {

    // TODO: [Issue 70] Clean up the logger implementation.

    var isYuiLog = /^yui/,
        LOG_LEVEL = 'info',
        logNothingAtAllEver = false,
        defaults = {
            writer: null, //assigned below
            formatter: null, //assigned below
            timestamp: true,
            level: LOG_LEVEL,
            defaultLevel: 'info',
            yui: false,
            buffer: false,
            maxBufferSize: 1024,
            order: [
                'DEBUG', 'MOJITO', 'INFO', 'WARN', 'ERROR', 'NONE'
            ],
            filter: {
                DEBUG: true,
                MOJITO: true,
                INFO: true,
                WARN: true,
                ERROR: true,
                NONE: true
            }
        };


    defaults.writer = function(data) {
        var i = 0;
        if (!console || !console.log) {
            // not much to do if I can't console.log. Sorry, IE6
            return;
        }
        if (Y.Lang.isArray(data)) {
            // this is a flush of many logs
            for (i = 0; i < data.length; i += 1) {
                console.log(data[i]);
            }
        } else {
            console.log.apply(console, arguments);
        }
    };


    defaults.formatter = function(msg, lvl, source, timestamp, opts, id) {
        var ts = opts.timestamp ? '(' + timestamp + ') ' : '',
            code = '',
            stack = '';

        if (msg instanceof Error) {
            if (msg.code) {
                code = ' ' + msg.code;
            }
            if (msg.stack) {
                stack = '\n' + msg.stack;
            }
            msg = 'Error' + code + ': ' + msg.message + stack;
        } else if (Y.Lang.isObject(msg)) {
            msg = Y.JSON.stringify(msg, null, 2);
        }
        source = source ? source + ': ' : '';
        return '[' + lvl.toUpperCase() + '] ' + ts + source + msg;
    };


    function Logger(opts, id) {
        var cnt = 0,
            order,
            lvl;

        this._opts = Y.merge(defaults, opts);
        this._buffer = [];

        if (id) {
            this._id = id;
        }

        order = this._opts.order || [];
        lvl = this._opts.level.toLowerCase();

        for (cnt = 0; cnt < order.length; cnt += 1) {
            this._opts.filter[order[cnt]] = true;
        }
        cnt = 0;
        while (cnt <= order.length) {
            if (order[cnt] && order[cnt].toLowerCase() !== lvl) {
                this._opts.filter[order[cnt]] = false;
            } else {
                break;
            }
            cnt += 1;
        }

        //Hmm... If the count is the same length as the order list we mean NONE
        if (cnt === order.length) {
            logNothingAtAllEver = true;
        }

        if (this._opts.filter.DEBUG) {
            if (!YUI._mojito) {
                YUI._mojito = {};
            }
            YUI._mojito.DEBUG = true;
        }
    }


    Logger.prototype = {

        log: function(msg, lvl, source) {

            var level,
                isYui,
                baseLevel,
                now;

            if (logNothingAtAllEver) {
                return;
            }

            now = new Date().getTime();

            // flush-fast if msg is {flush: true}
            if (Y.Lang.isObject(msg) && msg.flush === true) {
                return this.flush();
            }

            level = (lvl || this._opts.defaultLevel).toLowerCase();
            isYui = isYuiLog.test(level);
            baseLevel = isYui ? level.split('-').pop() : level;

            // the fat filter strips out log calls below current base log level
            if (!this._opts.filter[baseLevel.toUpperCase()]) {
                return;
            }

            // this strips out all YUI logs if the 'showYui' option is false
            if (isYui && !this._opts.yui) {
                return;
            }

            if (this._opts.buffer) {
                this._buffer.push([msg, level, source, now]);
                // auto-flush buffer if breaking max buffer size
                if (Y.Object.size(this._buffer) > this._opts.maxBufferSize) {
                    this.flush();
                }
            } else {
                this._publish(msg, level, source, now);
            }
        },


        flush: function() {
            var log, logs = [];
            if (this._opts.publisher) {
                this._opts.publisher(this._buffer);
            } else {
                while (this._buffer.length) {
                    log = this._buffer.shift();
                    logs.push(this._opts.formatter(log[0], log[1], log[2],
                        log[3], this._opts, this._id));
                }
                this._opts.writer(logs);
            }
            this._buffer = [];
        },


        setFormatter: function(f) {
            this._opts.formatter = f;
        },


        setWriter: function(w) {
            this._opts.writer = w;
        },


        setPublisher: function(p) {
            console.log('publisher set: ' + p.toString());
            this._opts.publisher = p;
        },


        _publish: function(msg, lvl, src, ts) {
            //console.log('default publisher');
            if (this._opts.publisher) {
                this._opts.publisher(msg, lvl, src, ts, this._id);
            } else {
                this._opts.writer(this._opts.formatter(msg, lvl, src, ts,
                    this._opts, this._id));
            }
        }
    };

    Y.namespace('mojito').Logger = Logger;

}, '0.1.0', {requires: [
    'mojito'
]});
