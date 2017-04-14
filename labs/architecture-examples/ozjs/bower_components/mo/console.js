
define('mo/console', [
    './lang',
    './browsers',
    './template/string',
    './domready'
], function(_, browsers, tpl){

    var console = this.console = this.console || {},
        origin_console = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error
        },
        RE_CODE = /^function[^(]*\([^)]*\)[^{]*\{([.\s\S]*)\}$/;

    console._ccBuffer = [];

    console.config = function(opt){

        if (opt.output) {
            this._ccOutput = opt.output;
            this._ccOutput.innerHTML = this._ccBuffer.join('');
        }

        if (opt.record !== undefined) {
            this._recording = opt.record;
            if (!opt.record) {
                console.cc();
            }
        }

        return this;
    };

    console.enable = function(){
        for (var i in origin_console) {
            console[i] = console_api(i);
        }
        console.run = run;
        return this;
    };

    console.disable = function(){
        for (var i in origin_console) {
            console[i] = origin_console[i];
        }
        console.run = console.log;
        return this;
    };

    console.cc = function(newlog){
        if (newlog === undefined) {
            return this._ccBuffer.join('');
        } else {
            this._ccBuffer.push(newlog);
            var result = this._ccBuffer.join('');
            if (!this._recording) {
                //if (!this._ccOutput) {
                    //this._ccOutput = default_output();
                //}
                if (this._ccOutput) {
                    this._ccOutput.innerHTML = result;
                }
            }
            return result;
        }
    };

    function run(fn, opt){
        opt = opt || {};
        var code = fn.toString().trim()
            .match(RE_CODE)[1]
            .trim()
            .replace(/return\s+/, '')
            .replace(/;$/, '');
        console.info('run `' + code + '`');
        try {
            console.info(fn());
        } catch(ex) {
            console.error(opt.showStack ? ex : ex.message);
        }
    }

    function console_api(method){
        return function(){
            if (_.isFunction(origin_console[method])) {
                origin_console[method].apply(console, arguments);
            }
            console.cc('<p>'
                + '<span class="type type-' + method + '"></span>'
                + '<span class="log">'
                + Array.prototype.slice.call(arguments)
                    .map(escape_log, method).join('</span><span class="log">')
                + '</span></p>');
        };
    }

    //function default_output(){
        //var output = document.createElement('DIV');
        //output.setAttribute('id', 'console');
        //document.body.insertBefore(output, document.body.firstChild);
        //return output;
    //}

    function escape_log(text){
        var method = this;
        if (text instanceof Error) {
            text = text.stack ? text.stack.split(/at\s/) : [text.message];
            return text.map(function(msg){
                return escape_log('at ' + msg, method);
            }).join('<br>');
        } else if (method.toString() !== 'log' 
                && text 
                && typeof text === 'object'
                && (!browsers.aosp || text.nodeType !== 1)) {
            text = [
                '<span class="obj-start">' + tpl.escapeHTML('{') + '</span>', 
                Object.keys(text).map(function(key){
                    var v;
                    try {
                        v = this[key];
                    } catch(ex) {
                        v = ex.message;
                    }
                    if (typeof v === 'string') {
                        v = '"' + v + '"';
                    } else {
                        v = String(v);
                    }
                    return '<span class="obj-item">' 
                        + '<span class="obj-k">'
                        + escape_log(key, method) 
                        + ': </span><span class="obj-v">'
                        + (typeof v === 'string' ? tpl.escapeHTML(v) : v)
                        + '</span>,</span>';
                }, text).join(''), 
                '<span class="obj-end">' + tpl.escapeHTML('}') + '</span>'
            ].join('');
            return '<span class="obj-wrap"><span class="obj-overview">' 
                + text
                + '</span><span class="obj-end">...}</span><span class="obj-detail">' 
                + text 
                + '</span></span></span>';
        }
        text = String(text);
        return typeof text === 'string' ? tpl.escapeHTML(text) : text;
    }

    return console;

});
