/* AJAX MODULE */
//must implement ajax using Promise pattern
//we can reuse jQuery ajax for fast release
//firstly, try to implement promise with setTimeout
(function() {
    var _html = this, array = _html.array;
    
    // Promise pattern for calling asynchronous code, usually ajax/setTimeout/setInterval
    this.Promise = function(task) {
        // save reference to done functions and fail function callback
        var done = [], fail = [], mockDone, mockFail;
        
        // resolve function, use to call all done functions
        var resolve = function(val) {
            //run all done methods on fulfilled
            array.each.call(done, function(f) {f(val);});
            promise = null;
        };
        // reject function, use to call fail function
        var reject = function(reason) {
            //run all fail methods on rejected
            array.each.call(fail, function(f) {f(reason);});
            promise = null;
        };
        
        // declare promise variable
        var promise = {};
        // promise done method, use to set done methods, these methods will be call when the resolve method called
        // we can call done and then as many times as we want
        promise.done = function(callback) {
            if(isFunction(callback)) {
                // only push the callback to the queue if it is a function
                done.push(callback);
            }
            return promise;
        };
        // promise fail method, use to set fail method, the method will be call when the reject method called
        // only call fail method once
        promise.fail = function(callback) {
            if (isFunction(callback)) {
                // only set the callback if it is a function
                fail.push(callback);
            }
            return promise;
        };
        
        promise.mockDone = function(data) {
            // assign mock data
            mockDone = data;
            // delete mockDone and mockFail methods in promise
            // can't use these methods any more
            delete promise.mockDone;
            delete promise.mockFail;
            return promise;
        };
        
        promise.mockFail = function(reason) {
            // assign mock reason
            mockFail = reason;
            // delete mockDone and mockFail methods in promise
            // can't use these methods any more
            delete promise.mockDone;
            delete promise.mockFail;
            return promise;
        };
        
        // need to setTimeout here for giving user a chance to set mockData/additional parameters
        setTimeout(function() {
            // try to resolve/reject using mockData
            if (mockDone || mockFail) {
                mockDone? resolve(mockDone): reject(mockFail);
            } else {
                // if there's no mockData set up, the run the task
                task(resolve, reject);
            }
        });
        
        return promise;
    };
    
    // create XHR object for ajax request
    var xhr = function() {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();  
        }
        var versions = [ "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp" ];

        var xhr;
        for(var i = 0; i < versions.length; i++) {
            // try to initialize one version of Microsoft XHR
            try {
                xhr = new ActiveXObject(versions[i]);
                break; // of course break here when initializing succeeded
            } catch (e) { }
        }
        return xhr;
    };

    // declare id for jsonp callback
    var jsonpId = 0;
    
    // ajax method
    // 2 parameters are enough for ajax: url and data
    // all other parameters can be set after this method with fluent API
    var ajax = this.ajax = function(url, data, method, async) {
        var method = method || 'GET', jsonp;
            header = {}, parser = null, timeout = null,
            async = isNotNull(async)? async: true,
            username = undefined, password = undefined,
            // the promise object to return, user can set a lot of options using this, of course with done and fail
            promise = _html.Promise(function(resolve, reject) {
                // process jsonp first if there come a jsonp callback
                if(jsonp) {
                    // create script node to load resource from another server
                    var src = url + (/\?/.test(url)? "&" : "?");
                    var head = document.getElementsByTagName("head")[0];
                    var newScript = document.createElement("script");
                    var params = [];
                    var param_name = ""
                    jsonpId++;
                    // save the reference of jsonp callback
                    _html.ajax['jsonpId' + jsonpId] = jsonp;
                    data = data || {};
                    // append callback to data
                    data["callback"] = "html.ajax.jsonpId" + jsonpId;
                    // append all parameters to the url
                    for(param_name in data) {
                        params.push(param_name + "=" + encodeURIComponent(data[param_name]));
                    }
                    src += params.join("&");
                    newScript.type = "text/javascript";  
                    newScript.src = src;
                    head.appendChild(newScript);
                    // save the callback id to element's expando
                    // this action for removing callback function after load script
                    _html(newScript).expando('jsonpId', jsonpId);
                    
                    // the event when script loaded and execute success
                    var scriptLoaded = function () {
                        //remove the node after finish loading
                        newScript.parentElement.removeChild(newScript);
                        // remove reference of jsonp callback
                        var jsonpId = _html(newScript).expando('jsonpId');
                        html.ajax['jsonpId' + jsonpId] = undefined;
                        // set the script node null, for release memory (I think this doesn't help too much)
                        newScript = null;
                    }
                    // binding load event to the jsonp script node
                    if (newScript.onreadystatechange !== undefined) {
                        newScript.onload = newScript.onreadystatechange = function () {
                            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                                scriptLoaded();
                            }
                        };
                    } else {
                        _html.bind(newScript, 'load', scriptLoaded);
                    }
                    return;
                }
                var x = xhr();                                      // init XHR object
                x.open(method, url, async, username, password);     // open connection to server, with username, password if possible
                x.onreadystatechange = function() {
                    if (x.readyState == 4 && x.status === 200) {
                        var res;
                        try {
                            // give parser a try
                            res = isNotNull(parser)? parser(x.responseText): x.responseText;
                        } catch (e) {
                            // reject the promise if the parser not work
                            reject('Invalid data type.');
                        };
                        // call resolve method when the ajax request success
                        resolve(res);
                    } else {
                        // call reject method when the ajax request fail
                        reject(x);
                    }
                };
                // set header for the request if possible
                // loop through the values inside header object and set to request header
                for(var h in header) {
                    x.setRequestHeader(h, header);
                }
                if (timeout && timeout > 0) {
                    // handle time out exception defined by user
                    x.timeout = timeout;
                    x.ontimeout = function() { reject('timeout'); };
                }
                // send the request
                // cross origin exception will throw if trying to get a resource in another server
                x.send(data);
            });
        
        // modified method to get/post
        promise.get = function() {
            method = 'GET';
            return this;
        };
        // modified method to get/post
        promise.post = function() {
            method = 'POST';
            return this;
        };
        // cross domain purpose
        // can't use jsonp any more, because of jsonp's nature
        // jsonp callback was padding to the result (aka hard code)
        promise.jsonp = function(callback) {
            jsonp = callback;
            delete promise.jsonp;
            return this;
        };
        // authenticate request with username and password (optional)
        promise.authenticate = function(user, pass) {
            username = user;
            password = pass;
            return this;
        };
        // set header for a request
        // note that I extend the header object instead of replace it
        // so that we can call this method so many times
        promise.header = function(arg) {
            _html.extend(header, arg);
            return this;
        };
        // set header for a request
        // note that I extend the header object instead of replace it
        // so that we can call this method so many times
        promise.async = function(isAsync) {
            async = isAsync;
            return this;
        };
        promise.parser = function(p) {
            parser = p;
            return this;
        };
        promise.timeout = function(miliseconds) {
            timeout = miliseconds;
            return this;
        };
        
        return promise;
    };

    // parser for JSON logic borrowed from jQuery
    var parseJSON = JSON && JSON.parse || function(data) {
		if (data === null) {
			return data;
		}

		if (typeof data === "string") {

			// Make sure leading/trailing white-space is removed (IE can't handle it)
			data = trim( data );

			if (data) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if (/^[\],:{}\s]*$/
                    .test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

					return ( new Function( "return " + data ) )();
				}
			}
		}
        return null;
	};
    
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
    var stringify = JSON && JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (_html.isString(t)) obj = '"'+obj+'"';
            // Date type
            if (_html.isDate(t)) obj = '"' +
                obj.getUTCFullYear()       + '-' +
                f(obj.getUTCMonth() + 1)   + '-' +
                f(obj.getUTCDate())        + 'T' +
                f(obj.getUTCHours())       + ':' +
                f(obj.getUTCMinutes())     + ':' +
                f(obj.getUTCSeconds())     + 'Z' +'"';
            return String(obj);
        } else {
            // recursive array or object
            // this method is similar to serialize
            var n, v, json = [], arr = (obj && isArray(obj));
            
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
    
    if(!JSON) JSON = { parse: parseJSON, stringify: stringify };
    
    // create shorthand for request JSON format with "GET" method
    this.getJSON = function(url, data, async) {
        var query = [];
        for (var key in data) {
            // get all parameters and append to query url
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        // do ajax request, and pass JSON parser for user
        // return a promise to user
        return ajax(url + '?' + query.join('&'), null, 'GET', async)
            .parser(parseJSON);
    };

    // create shorthand for request JSON format with "POST" method
    this.postJSON = function(url, data, async) {
        // do ajax request, and pass JSON parser for user
        // return a promise to user
        return ajax(url, stringify(data), 'POST', async)
            .header({ 'Content-type': 'application/json' })
            .parser(parseJSON);
    };
    
}).call(html);

/* END OF AJAX MODULE */