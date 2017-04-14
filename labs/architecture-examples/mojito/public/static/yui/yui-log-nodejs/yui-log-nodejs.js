/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('yui-log-nodejs', function (Y, NAME) {

var sys = require(process.binding('natives').util ? 'util' : 'sys'),
    hasColor = false;

try {
    var stdio = require("stdio");
    hasColor = stdio.isStderrATTY();
} catch (ex) {
    hasColor = true;
}

Y.config.useColor = hasColor;

Y.consoleColor = function(str, num) {
    if (!this.config.useColor) {
        return str;
    }
    if (!num) {
        num = '32';
    }
    return "\u001b[" + num +"m" + str + "\u001b[0m";
};


var logFn = function(str, t, m) {
    var id = '';
    if (this.id) {
        id = '[' + this.id + ']:';
    }
    t = t || 'info';
    m = (m) ? this.consoleColor(' (' +  m.toLowerCase() + '):', 35) : '';
    
    if (str === null) {
        str = 'null';
    }

    if ((typeof str === 'object') || str instanceof Array) {
        try {
            //Should we use this?
            if (str.tagName || str._yuid || str._query) {
                str = str.toString();
            } else {
                str = sys.inspect(str);
            }
        } catch (e) {
            //Fail catcher
        }
    }

    var lvl = '37;40', mLvl = ((str) ? '' : 31);
    t = t+''; //Force to a string..
    switch (t.toLowerCase()) {
        case 'error':
            lvl = mLvl = 31;
            break;
        case 'warn':
            lvl = 33;
            break;
        case 'debug':
            lvl = 34;
            break;
    }
    if (typeof str === 'string') {
        if (str && str.indexOf("\n") !== -1) {
            str = "\n" + str;
        }
    }

    // output log messages to stderr
    sys.error(this.consoleColor(t.toLowerCase() + ':', lvl) + m + ' ' + this.consoleColor(str, mLvl));
};

if (!Y.config.logFn) {
    Y.config.logFn = logFn;
}



}, '3.7.3');
