/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


(function() {

    //a single shared message buffer
    var buffer = [];


    YUI.add('mojito-perf', function(Y, NAME) {

        var perfEnabled = false,
            requestId = 0,
            microtime;

        try {
            microtime = require('microtime');
        } catch (e) {
            Y.log('microtime not found. Recorded times will not have' +
                ' microsecond accuracy', 'warn', NAME);
        }


        //internal. abstracts where timestamps come from
        function timestamp() {
            return microtime ? microtime.now() : new Date().getTime();
        }


        //internal. controls the format of performance marks
        function format(group, label, message, id, timestamp) {
            if (typeof id === 'number') {
                id = 'req:' + id + ' ';
            } else {
                id = '';
            }

            if (timestamp) {
                timestamp = timestamp + ' ';
            } else {
                timestamp = '';
            }

            return id + timestamp + group + ':' + label;
        }


        function mark(request, group, label, message) {
            var s;

            if (request.connection && request.connection.mojitoPerfMark) {
                request.connection.mojitoPerfMark(group, label, message);
            } else if (typeof request === 'string') {
                message = label;
                label = group;
                group = request;
                s = format(group, label, message, null, timestamp());
                buffer.push(s);
            } else {
                Y.log('Invalid request object', 'warn', NAME);
                Y.log('mark(): invalid argument', 'warn', NAME);
            }
        }


        function dump() {
            var len = buffer.length,
                i;
            for (i = 0; i < len; i += 1) {
                Y.log(buffer[i], 'mojito', NAME);
            }
            buffer = [];
        }


        function instrumentConnectApp(app) {
            app.on('connection', function(conn) {
                var id = (requestId += 1);

                conn.mojitoPerfMark = function(group, label, message) {
                    var s = format(group, label, message, id, timestamp());
                    buffer.push(s);
                };

                conn.on('close', function() {
                    conn.mojitoPerfMark('mojito', NAME + ':connection_end');
                    dump();
                });

                conn.mojitoPerfMark('mojito', NAME + ':connection');
            });

            app.use(function(req, res, next) {
                req.connection.mojitoPerfMark('mojito', NAME + ':request');
                next();
            });
        }


        Y.namespace('mojito').perf = {

            instrumentConnectApp: perfEnabled ?
                    instrumentConnectApp :
                    function() {},


            mark: perfEnabled ?
                    mark :
                    function() {},


            dump: perfEnabled ?
                    dump :
                    function() {}
        };
    });
}());
