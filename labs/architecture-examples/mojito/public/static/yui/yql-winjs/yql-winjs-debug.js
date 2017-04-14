/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('yql-winjs', function (Y, NAME) {

/**
* WinJS plugin for YQL to use native XHR to make requests instead of JSONP.
* Not required by the user, it's conditionally loaded and should "just work".
* @module yql
* @submodule yql-winjs
*/

//Over writes Y.YQLRequest._send to use IO instead of JSONP
Y.YQLRequest.prototype._send = function (url, o) {
    var req = new XMLHttpRequest(),
        timer;

    req.open('GET', url, true);
    req.onreadystatechange = function () {
        if (req.readyState === 4) { //Complete
            //No status code check here, since the YQL service will return JSON
            clearTimeout(timer);
            //No need to "call" this, YQL handles the context
            o.on.success(JSON.parse(req.responseText));
        }
    };
    req.send();

    //Simple timer to catch no connections
    timer = setTimeout(function() {
        req.abort();
        o.on.timeout('script timeout');
    }, o.timeout || 30000);
};


}, '3.7.3');
