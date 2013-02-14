/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('get', function(Y) {

    /**
    * NodeJS specific Get module used to load remote resources. It contains the same signature as the default Get module so there is no code change needed.
    * @module get-nodejs
    * @class GetNodeJS
    */
        
    var path = require('path'),
        vm = require('vm'),
        fs = require('fs'),
        request = require('request'),
        existsSync = fs.existsSync || path.existsSync;


    Y.Get = function() {
    };

    //Setup the default config base path
    Y.config.base = path.join(__dirname, '../');

    YUI.require = require;
    YUI.process = process;
    
    /**
    * Escape the path for Windows, they need to be double encoded when used as `__dirname` or `__filename`
    * @method escapeWinPath
    * @protected
    * @param {String} p The path to modify
    * @return {String} The encoded path
    */
    var escapeWinPath = function(p) {
        return p.replace(/\\/g, '\\\\');
    };

    /**
    * Takes the raw JS files and wraps them to be executed in the YUI context so they can be loaded
    * into the YUI object
    * @method _exec
    * @private
    * @param {String} data The JS to execute
    * @param {String} url The path to the file that was parsed
    * @param {Callback} cb The callback to execute when this is completed
    * @param {Error} cb.err=null Error object
    * @param {String} cb.url The URL that was just parsed
    */

    Y.Get._exec = function(data, url, cb) {
        var dirName = escapeWinPath(path.dirname(url));
        var fileName = escapeWinPath(url);

        if (dirName.match(/^https?:\/\//)) {
            dirName = '.';
            fileName = 'remoteResource';
        }

        var mod = "(function(YUI) { var __dirname = '" + dirName + "'; "+
            "var __filename = '" + fileName + "'; " +
            "var process = YUI.process;" +
            "var require = function(file) {" +
            " if (file.indexOf('./') === 0) {" +
            "   file = __dirname + file.replace('./', '/'); }" +
            " return YUI.require(file); }; " +
            data + " ;return YUI; })";
    
        //var mod = "(function(YUI) { " + data + ";return YUI; })";
        var script = vm.createScript(mod, url);
        var fn = script.runInThisContext(mod);
        YUI = fn(YUI);
        cb(null, url);
    };
    
    /**
    * Fetches the content from a remote URL or a file from disc and passes the content
    * off to `_exec` for parsing
    * @method _include
    * @private
    * @param {String} url The URL/File path to fetch the content from
    * @param {Callback} cb The callback to fire once the content has been executed via `_exec`
    */
    Y.Get._include = function(url, cb) {
        var self = this;

        if (url.match(/^https?:\/\//)) {
            var cfg = {
                url: url,
                timeout: self.timeout
            };
            request(cfg, function (err, response, body) {
                if (err) {
                    Y.log(err, 'error', 'get');
                    cb(err, url);
                } else {
                    Y.Get._exec(body, url, cb);
                }
            });
        } else {
            if (Y.config.useSync) {
                //Needs to be in useSync
                if (existsSync(url)) {
                    var mod = fs.readFileSync(url,'utf8');
                    Y.Get._exec(mod, url, cb);
                } else {
                    cb('Path does not exist: ' + url, url);
                }
            } else {
                fs.readFile(url, 'utf8', function(err, mod) {
                    if (err) {
                        cb(err, url);
                    } else {
                        Y.Get._exec(mod, url, cb);
                    }
                });
            }
        }
        
    };


    var end = function(cb, msg, result) {
        //Y.log('Get end: ' + cb.onEnd);
        if (Y.Lang.isFunction(cb.onEnd)) {
            cb.onEnd.call(Y, msg, result);
        }
    }, pass = function(cb) {
        //Y.log('Get pass: ' + cb.onSuccess);
        if (Y.Lang.isFunction(cb.onSuccess)) {
            cb.onSuccess.call(Y, cb);
        }
        end(cb, 'success', 'success');
    }, fail = function(cb, er) {
        //Y.log('Get fail: ' + er);
        er.errors = [er];
        if (Y.Lang.isFunction(cb.onFailure)) {
            cb.onFailure.call(Y, er, cb);
        }
        end(cb, er, 'fail');
    };


    /**
    * Override for Get.script for loading local or remote YUI modules.
    * @method js
    * @param {Array|String} s The URL's to load into this context
    * @param {Object} options Transaction options
    */
    Y.Get.js = function(s, options) {
        var A = Y.Array,
            self = this,
            urls = A(s), url, i, l = urls.length, c= 0,
            check = function() {
                if (c === l) {
                    pass(options);
                }
            };



        for (i=0; i<l; i++) {
            url = urls[i];
            if (Y.Lang.isObject(url)) {
                url = url.url;
            }

            url = url.replace(/'/g, '%27');
            Y.log('URL: ' + url, 'info', 'get');
            Y.Get._include(url, function(err, url) {
                if (!Y.config) {
                    Y.config = {
                        debug: true
                    };
                }
                if (options.onProgress) {
                    options.onProgress.call(options.context || Y, url);
                }
                Y.log('After Load: ' + url, 'info', 'get');
                if (err) {
                    fail(options, err);
                    Y.log('----------------------------------------------------------', 'error', 'get');
                    Y.log(err, 'error', 'get');
                    Y.log('----------------------------------------------------------', 'error', 'get');
                } else {
                    c++;
                    check();
                }
            });
        }
    };
    
    /**
    * Alias for `Y.Get.js`
    * @method script
    */
    Y.Get.script = Y.Get.js;
    
    //Place holder for SS Dom access
    Y.Get.css = function(s, cb) {
        Y.log('Y.Get.css is not supported, just reporting that it has loaded but not fetching.', 'warn', 'get');
        pass(cb);
    };



}, '3.7.3' ,{requires:['yui-base']});
