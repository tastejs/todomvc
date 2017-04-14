/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/get-nodejs/get-nodejs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/get-nodejs/get-nodejs.js",
    code: []
};
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].code=["YUI.add('get', function (Y, NAME) {","","    /**","    * NodeJS specific Get module used to load remote resources. It contains the same signature as the default Get module so there is no code change needed.","    * @module get-nodejs","    * @class GetNodeJS","    */","        ","    var path = require('path'),","        vm = require('vm'),","        fs = require('fs'),","        request = require('request'),","        existsSync = fs.existsSync || path.existsSync;","","","    Y.Get = function() {","    };","","    //Setup the default config base path","    Y.config.base = path.join(__dirname, '../');","","    YUI.require = require;","    YUI.process = process;","    ","    /**","    * Escape the path for Windows, they need to be double encoded when used as `__dirname` or `__filename`","    * @method escapeWinPath","    * @protected","    * @param {String} p The path to modify","    * @return {String} The encoded path","    */","    var escapeWinPath = function(p) {","        return p.replace(/\\\\/g, '\\\\\\\\');","    };","","    /**","    * Takes the raw JS files and wraps them to be executed in the YUI context so they can be loaded","    * into the YUI object","    * @method _exec","    * @private","    * @param {String} data The JS to execute","    * @param {String} url The path to the file that was parsed","    * @param {Callback} cb The callback to execute when this is completed","    * @param {Error} cb.err=null Error object","    * @param {String} cb.url The URL that was just parsed","    */","","    Y.Get._exec = function(data, url, cb) {","        var dirName = escapeWinPath(path.dirname(url));","        var fileName = escapeWinPath(url);","","        if (dirName.match(/^https?:\\/\\//)) {","            dirName = '.';","            fileName = 'remoteResource';","        }","","        var mod = \"(function(YUI) { var __dirname = '\" + dirName + \"'; \"+","            \"var __filename = '\" + fileName + \"'; \" +","            \"var process = YUI.process;\" +","            \"var require = function(file) {\" +","            \" if (file.indexOf('./') === 0) {\" +","            \"   file = __dirname + file.replace('./', '/'); }\" +","            \" return YUI.require(file); }; \" +","            data + \" ;return YUI; })\";","    ","        //var mod = \"(function(YUI) { \" + data + \";return YUI; })\";","        var script = vm.createScript(mod, url);","        var fn = script.runInThisContext(mod);","        YUI = fn(YUI);","        cb(null, url);","    };","    ","    /**","    * Fetches the content from a remote URL or a file from disc and passes the content","    * off to `_exec` for parsing","    * @method _include","    * @private","    * @param {String} url The URL/File path to fetch the content from","    * @param {Callback} cb The callback to fire once the content has been executed via `_exec`","    */","    Y.Get._include = function(url, cb) {","        var self = this;","","        if (url.match(/^https?:\\/\\//)) {","            var cfg = {","                url: url,","                timeout: self.timeout","            };","            request(cfg, function (err, response, body) {","                if (err) {","                    cb(err, url);","                } else {","                    Y.Get._exec(body, url, cb);","                }","            });","        } else {","            if (Y.config.useSync) {","                //Needs to be in useSync","                if (existsSync(url)) {","                    var mod = fs.readFileSync(url,'utf8');","                    Y.Get._exec(mod, url, cb);","                } else {","                    cb('Path does not exist: ' + url, url);","                }","            } else {","                fs.readFile(url, 'utf8', function(err, mod) {","                    if (err) {","                        cb(err, url);","                    } else {","                        Y.Get._exec(mod, url, cb);","                    }","                });","            }","        }","        ","    };","","","    var end = function(cb, msg, result) {","        if (Y.Lang.isFunction(cb.onEnd)) {","            cb.onEnd.call(Y, msg, result);","        }","    }, pass = function(cb) {","        if (Y.Lang.isFunction(cb.onSuccess)) {","            cb.onSuccess.call(Y, cb);","        }","        end(cb, 'success', 'success');","    }, fail = function(cb, er) {","        er.errors = [er];","        if (Y.Lang.isFunction(cb.onFailure)) {","            cb.onFailure.call(Y, er, cb);","        }","        end(cb, er, 'fail');","    };","","","    /**","    * Override for Get.script for loading local or remote YUI modules.","    * @method js","    * @param {Array|String} s The URL's to load into this context","    * @param {Object} options Transaction options","    */","    Y.Get.js = function(s, options) {","        var A = Y.Array,","            self = this,","            urls = A(s), url, i, l = urls.length, c= 0,","            check = function() {","                if (c === l) {","                    pass(options);","                }","            };","","","","        for (i=0; i<l; i++) {","            url = urls[i];","            if (Y.Lang.isObject(url)) {","                url = url.url;","            }","","            url = url.replace(/'/g, '%27');","            Y.Get._include(url, function(err, url) {","                if (!Y.config) {","                    Y.config = {","                        debug: true","                    };","                }","                if (options.onProgress) {","                    options.onProgress.call(options.context || Y, url);","                }","                if (err) {","                    fail(options, err);","                } else {","                    c++;","                    check();","                }","            });","        }","    };","    ","    /**","    * Alias for `Y.Get.js`","    * @method script","    */","    Y.Get.script = Y.Get.js;","    ","    //Place holder for SS Dom access","    Y.Get.css = function(s, cb) {","        pass(cb);","    };","","","","}, '3.7.3');"];
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].lines = {"1":0,"9":0,"16":0,"20":0,"22":0,"23":0,"32":0,"33":0,"48":0,"49":0,"50":0,"52":0,"53":0,"54":0,"57":0,"67":0,"68":0,"69":0,"70":0,"81":0,"82":0,"84":0,"85":0,"89":0,"90":0,"91":0,"93":0,"97":0,"99":0,"100":0,"101":0,"103":0,"106":0,"107":0,"108":0,"110":0,"119":0,"120":0,"121":0,"124":0,"125":0,"127":0,"129":0,"130":0,"131":0,"133":0,"143":0,"144":0,"148":0,"149":0,"155":0,"156":0,"157":0,"158":0,"161":0,"162":0,"163":0,"164":0,"168":0,"169":0,"171":0,"172":0,"174":0,"175":0,"185":0,"188":0,"189":0};
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].functions = {"escapeWinPath:32":0,"_exec:48":0,"(anonymous 2):89":0,"(anonymous 3):106":0,"_include:81":0,"end:119":0,"pass:123":0,"fail:128":0,"check:147":0,"(anonymous 4):162":0,"js:143":0,"css:188":0,"(anonymous 1):1":0};
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].coveredLines = 67;
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].coveredFunctions = 13;
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 1);
YUI.add('get', function (Y, NAME) {

    /**
    * NodeJS specific Get module used to load remote resources. It contains the same signature as the default Get module so there is no code change needed.
    * @module get-nodejs
    * @class GetNodeJS
    */
        
    _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 9);
var path = require('path'),
        vm = require('vm'),
        fs = require('fs'),
        request = require('request'),
        existsSync = fs.existsSync || path.existsSync;


    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 16);
Y.Get = function() {
    };

    //Setup the default config base path
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 20);
Y.config.base = path.join(__dirname, '../');

    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 22);
YUI.require = require;
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 23);
YUI.process = process;
    
    /**
    * Escape the path for Windows, they need to be double encoded when used as `__dirname` or `__filename`
    * @method escapeWinPath
    * @protected
    * @param {String} p The path to modify
    * @return {String} The encoded path
    */
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 32);
var escapeWinPath = function(p) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "escapeWinPath", 32);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 33);
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

    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 48);
Y.Get._exec = function(data, url, cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "_exec", 48);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 49);
var dirName = escapeWinPath(path.dirname(url));
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 50);
var fileName = escapeWinPath(url);

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 52);
if (dirName.match(/^https?:\/\//)) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 53);
dirName = '.';
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 54);
fileName = 'remoteResource';
        }

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 57);
var mod = "(function(YUI) { var __dirname = '" + dirName + "'; "+
            "var __filename = '" + fileName + "'; " +
            "var process = YUI.process;" +
            "var require = function(file) {" +
            " if (file.indexOf('./') === 0) {" +
            "   file = __dirname + file.replace('./', '/'); }" +
            " return YUI.require(file); }; " +
            data + " ;return YUI; })";
    
        //var mod = "(function(YUI) { " + data + ";return YUI; })";
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 67);
var script = vm.createScript(mod, url);
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 68);
var fn = script.runInThisContext(mod);
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 69);
YUI = fn(YUI);
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 70);
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
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 81);
Y.Get._include = function(url, cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "_include", 81);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 82);
var self = this;

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 84);
if (url.match(/^https?:\/\//)) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 85);
var cfg = {
                url: url,
                timeout: self.timeout
            };
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 89);
request(cfg, function (err, response, body) {
                _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 2)", 89);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 90);
if (err) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 91);
cb(err, url);
                } else {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 93);
Y.Get._exec(body, url, cb);
                }
            });
        } else {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 97);
if (Y.config.useSync) {
                //Needs to be in useSync
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 99);
if (existsSync(url)) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 100);
var mod = fs.readFileSync(url,'utf8');
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 101);
Y.Get._exec(mod, url, cb);
                } else {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 103);
cb('Path does not exist: ' + url, url);
                }
            } else {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 106);
fs.readFile(url, 'utf8', function(err, mod) {
                    _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 3)", 106);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 107);
if (err) {
                        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 108);
cb(err, url);
                    } else {
                        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 110);
Y.Get._exec(mod, url, cb);
                    }
                });
            }
        }
        
    };


    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 119);
var end = function(cb, msg, result) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "end", 119);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 120);
if (Y.Lang.isFunction(cb.onEnd)) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 121);
cb.onEnd.call(Y, msg, result);
        }
    }, pass = function(cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "pass", 123);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 124);
if (Y.Lang.isFunction(cb.onSuccess)) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 125);
cb.onSuccess.call(Y, cb);
        }
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 127);
end(cb, 'success', 'success');
    }, fail = function(cb, er) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "fail", 128);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 129);
er.errors = [er];
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 130);
if (Y.Lang.isFunction(cb.onFailure)) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 131);
cb.onFailure.call(Y, er, cb);
        }
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 133);
end(cb, er, 'fail');
    };


    /**
    * Override for Get.script for loading local or remote YUI modules.
    * @method js
    * @param {Array|String} s The URL's to load into this context
    * @param {Object} options Transaction options
    */
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 143);
Y.Get.js = function(s, options) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "js", 143);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 144);
var A = Y.Array,
            self = this,
            urls = A(s), url, i, l = urls.length, c= 0,
            check = function() {
                _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "check", 147);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 148);
if (c === l) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 149);
pass(options);
                }
            };



        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 155);
for (i=0; i<l; i++) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 156);
url = urls[i];
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 157);
if (Y.Lang.isObject(url)) {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 158);
url = url.url;
            }

            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 161);
url = url.replace(/'/g, '%27');
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 162);
Y.Get._include(url, function(err, url) {
                _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 4)", 162);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 163);
if (!Y.config) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 164);
Y.config = {
                        debug: true
                    };
                }
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 168);
if (options.onProgress) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 169);
options.onProgress.call(options.context || Y, url);
                }
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 171);
if (err) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 172);
fail(options, err);
                } else {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 174);
c++;
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 175);
check();
                }
            });
        }
    };
    
    /**
    * Alias for `Y.Get.js`
    * @method script
    */
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 185);
Y.Get.script = Y.Get.js;
    
    //Place holder for SS Dom access
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 188);
Y.Get.css = function(s, cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "css", 188);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 189);
pass(cb);
    };



}, '3.7.3');
