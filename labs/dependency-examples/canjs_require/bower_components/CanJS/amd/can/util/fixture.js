/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/util/string', 'can/util/object'], function (can) {

    // Get the URL from old Steal root, new Steal config or can.fixture.rootUrl
    var getUrl = function (url) {
        if (typeof steal !== 'undefined') {
            if (can.isFunction(steal.config)) {
                return steal.config().root.mapJoin(url).toString();
            }
            return steal.root.join(url).toString();
        }
        return (can.fixture.rootUrl || '') + url;
    }

    var updateSettings = function (settings, originalOptions) {
        if (!can.fixture.on) {
            return;
        }

        //simple wrapper for logging
        var _logger = function (type, arr) {
            if (console.log.apply) {
                Function.prototype.call.apply(console[type], [console].concat(arr));
                // console[type].apply(console, arr)
            } else {
                console[type](arr)
            }
        },
            log = function () {
                if (window.console && console.log) {
                    Array.prototype.unshift.call(arguments, 'fixture INFO:');
                    _logger("log", Array.prototype.slice.call(arguments));
                }
                else if (window.opera && window.opera.postError) {
                    opera.postError("fixture INFO: " + Array.prototype.join.call(arguments, ','));
                }
            }

            // We always need the type which can also be called method, default to GET
            settings.type = settings.type || settings.method || 'GET';

        // add the fixture option if programmed in
        var data = overwrite(settings);

        // if we don't have a fixture, do nothing
        if (!settings.fixture) {
            if (window.location.protocol === "file:") {
                log("ajax request to " + settings.url + ", no fixture found");
            }
            return;
        }

        //if referencing something else, update the fixture option
        if (typeof settings.fixture === "string" && can.fixture[settings.fixture]) {
            settings.fixture = can.fixture[settings.fixture];
        }

        // if a string, we just point to the right url
        if (typeof settings.fixture == "string") {
            var url = settings.fixture;

            if (/^\/\//.test(url)) {
                // this lets us use rootUrl w/o having steal...
                url = getUrl(settings.fixture.substr(2));
            }

            if (data) {
                // Template static fixture URLs
                url = can.sub(url, data);
            }

            delete settings.fixture;



            settings.url = url;
            settings.data = null;
            settings.type = "GET";
            if (!settings.error) {
                settings.error = function (xhr, error, message) {
                    throw "fixtures.js Error " + error + " " + message;
                };
            }
        }
        else {


            //it's a function ... add the fixture datatype so our fixture transport handles it
            // TODO: make everything go here for timing and other fun stuff
            // add to settings data from fixture ...
            settings.dataTypes && settings.dataTypes.splice(0, 0, "fixture");

            if (data && originalOptions) {
                can.extend(originalOptions.data, data)
            }
        }
    },
        // A helper function that takes what's called with response
        // and moves some common args around to make it easier to call
        extractResponse = function (status, statusText, responses, headers) {
            // if we get response(RESPONSES, HEADERS)
            if (typeof status != "number") {
                headers = statusText;
                responses = status;
                statusText = "success"
                status = 200;
            }
            // if we get response(200, RESPONSES, HEADERS)
            if (typeof statusText != "string") {
                headers = responses;
                responses = statusText;
                statusText = "success";
            }
            if (status >= 400 && status <= 599) {
                this.dataType = "text"
            }
            return [status, statusText, extractResponses(this, responses), headers];
        },
        // If we get data instead of responses,
        // make sure we provide a response type that matches the first datatype (typically json)
        extractResponses = function (settings, responses) {
            var next = settings.dataTypes ? settings.dataTypes[0] : (settings.dataType || 'json');
            if (!responses || !responses[next]) {
                var tmp = {}
                tmp[next] = responses;
                responses = tmp;
            }
            return responses;
        };

    //used to check urls
    // check if jQuery
    if (can.ajaxPrefilter && can.ajaxTransport) {

        // the pre-filter needs to re-route the url
        can.ajaxPrefilter(updateSettings);

        can.ajaxTransport("fixture", function (s, original) {
            // remove the fixture from the datatype
            s.dataTypes.shift();

            //we'll return the result of the next data type
            var timeout, stopped = false;

            return {
                send: function (headers, callback) {
                    // we'll immediately wait the delay time for all fixtures
                    timeout = setTimeout(function () {
                        // if the user wants to call success on their own, we allow it ...
                        var success = function () {
                            if (stopped === false) {
                                callback.apply(null, extractResponse.apply(s, arguments));
                            }
                        },
                            // get the result form the fixture
                            result = s.fixture(original, success, headers, s);
                        if (result !== undefined) {
                            // make sure the result has the right dataType
                            callback(200, "success", extractResponses(s, result), {});
                        }
                    }, can.fixture.delay);
                },
                abort: function () {
                    stopped = true;
                    clearTimeout(timeout)
                }
            };
        });
    } else {
        var AJAX = can.ajax;
        can.ajax = function (settings) {
            updateSettings(settings, settings);
            if (settings.fixture) {
                var timeout, d = new can.Deferred(),
                    stopped = false;

                //TODO this should work with response
                d.getResponseHeader = function () {}

                // call success and fail
                d.then(settings.success, settings.fail);

                // abort should stop the timeout and calling success
                d.abort = function () {
                    clearTimeout(timeout);
                    stopped = true;
                    d.reject(d)
                }
                // set a timeout that simulates making a request ....
                timeout = setTimeout(function () {
                    // if the user wants to call success on their own, we allow it ...
                    var success = function () {
                        var response = extractResponse.apply(settings, arguments),
                            status = response[0];

                        if ((status >= 200 && status < 300 || status === 304) && stopped === false) {
                            d.resolve(response[2][settings.dataType])
                        } else {
                            // TODO probably resolve better
                            d.reject(d, 'error', response[1]);
                        }
                    },
                        // get the result form the fixture
                        result = settings.fixture(settings, success, settings.headers, settings);
                    if (result !== undefined) {
                        d.resolve(result)
                    }
                }, can.fixture.delay);

                return d;
            } else {
                return AJAX(settings);
            }
        }
    }

    var typeTest = /^(script|json|text|jsonp)$/,
        // a list of 'overwrite' settings object
        overwrites = [],
        // returns the index of an overwrite function
        find = function (settings, exact) {
            for (var i = 0; i < overwrites.length; i++) {
                if ($fixture._similar(settings, overwrites[i], exact)) {
                    return i;
                }
            }
            return -1;
        },
        // overwrites the settings fixture if an overwrite matches
        overwrite = function (settings) {
            var index = find(settings);
            if (index > -1) {
                settings.fixture = overwrites[index].fixture;
                return $fixture._getData(overwrites[index].url, settings.url)
            }

        },
        // Makes an attempt to guess where the id is at in the url and returns it.
        getId = function (settings) {
            var id = settings.data.id;

            if (id === undefined && typeof settings.data === "number") {
                id = settings.data;
            }



            if (id === undefined) {
                settings.url.replace(/\/(\d+)(\/|$|\.)/g, function (all, num) {
                    id = num;
                });
            }

            if (id === undefined) {
                id = settings.url.replace(/\/(\w+)(\/|$|\.)/g, function (all, num) {
                    if (num != 'update') {
                        id = num;
                    }
                })
            }

            if (id === undefined) { // if still not set, guess a random number
                id = Math.round(Math.random() * 1000)
            }

            return id;
        };

    var $fixture = can.fixture = function (settings, fixture) {
        // if we provide a fixture ...
        if (fixture !== undefined) {
            if (typeof settings == 'string') {
                // handle url strings
                var matches = settings.match(/(GET|POST|PUT|DELETE) (.+)/i);
                if (!matches) {
                    settings = {
                        url: settings
                    };
                } else {
                    settings = {
                        url: matches[2],
                        type: matches[1]
                    };
                }

            }

            //handle removing.  An exact match if fixture was provided, otherwise, anything similar
            var index = find(settings, !! fixture);
            if (index > -1) {
                overwrites.splice(index, 1)
            }
            if (fixture == null) {
                return
            }
            settings.fixture = fixture;
            overwrites.push(settings)
        } else {
            can.each(settings, function (fixture, url) {
                $fixture(url, fixture);
            })
        }
    };
    var replacer = can.replacer;

    can.extend(can.fixture, {
        // given ajax settings, find an overwrite
        _similar: function (settings, overwrite, exact) {
            if (exact) {
                return can.Object.same(settings, overwrite, {
                    fixture: null
                })
            } else {
                return can.Object.subset(settings, overwrite, can.fixture._compare)
            }
        },
        _compare: {
            url: function (a, b) {
                return !!$fixture._getData(b, a)
            },
            fixture: null,
            type: "i"
        },
        // gets data from a url like "/todo/{id}" given "todo/5"
        _getData: function (fixtureUrl, url) {
            var order = [],
                fixtureUrlAdjusted = fixtureUrl.replace('.', '\\.').replace('?', '\\?'),
                res = new RegExp(fixtureUrlAdjusted.replace(replacer, function (whole, part) {
                    order.push(part)
                    return "([^\/]+)"
                }) + "$").exec(url),
                data = {};

            if (!res) {
                return null;
            }
            res.shift();
            can.each(order, function (name) {
                data[name] = res.shift()
            })
            return data;
        },

        store: function (types, count, make, filter) {

            var items = [],
                // TODO: change this to a hash
                findOne = function (id) {
                    for (var i = 0; i < items.length; i++) {
                        if (id == items[i].id) {
                            return items[i];
                        }
                    }
                },
                methods = {};

            if (typeof types === "string") {
                types = [types + "s", types]
            } else if (!can.isArray(types)) {
                filter = make;
                make = count;
                count = types;
            }

            // make all items
            can.extend(methods, {

                findAll: function (request) {
                    //copy array of items
                    var retArr = items.slice(0);
                    request.data = request.data || {};
                    //sort using order
                    //order looks like ["age ASC","gender DESC"]
                    can.each((request.data.order || []).slice(0).reverse(), function (name) {
                        var split = name.split(" ");
                        retArr = retArr.sort(function (a, b) {
                            if (split[1].toUpperCase() !== "ASC") {
                                if (a[split[0]] < b[split[0]]) {
                                    return 1;
                                } else if (a[split[0]] == b[split[0]]) {
                                    return 0
                                } else {
                                    return -1;
                                }
                            }
                            else {
                                if (a[split[0]] < b[split[0]]) {
                                    return -1;
                                } else if (a[split[0]] == b[split[0]]) {
                                    return 0
                                } else {
                                    return 1;
                                }
                            }
                        });
                    });

                    //group is just like a sort
                    can.each((request.data.group || []).slice(0).reverse(), function (name) {
                        var split = name.split(" ");
                        retArr = retArr.sort(function (a, b) {
                            return a[split[0]] > b[split[0]];
                        });
                    });

                    var offset = parseInt(request.data.offset, 10) || 0,
                        limit = parseInt(request.data.limit, 10) || (items.length - offset),
                        i = 0;

                    //filter results if someone added an attr like parentId
                    for (var param in request.data) {
                        i = 0;
                        if (request.data[param] !== undefined && // don't do this if the value of the param is null (ignore it)
                        (param.indexOf("Id") != -1 || param.indexOf("_id") != -1)) {
                            while (i < retArr.length) {
                                if (request.data[param] != retArr[i][param]) {
                                    retArr.splice(i, 1);
                                } else {
                                    i++;
                                }
                            }
                        }
                    }

                    if (filter) {
                        i = 0;
                        while (i < retArr.length) {
                            if (!filter(retArr[i], request)) {
                                retArr.splice(i, 1);
                            } else {
                                i++;
                            }
                        }
                    }

                    //return data spliced with limit and offset
                    return {
                        "count": retArr.length,
                        "limit": request.data.limit,
                        "offset": request.data.offset,
                        "data": retArr.slice(offset, offset + limit)
                    };
                },

                findOne: function (request, response) {
                    var item = findOne(getId(request));
                    response(item ? item : undefined);
                },

                update: function (request, response) {
                    var id = getId(request);

                    // TODO: make it work with non-linear ids ..
                    can.extend(findOne(id), request.data);
                    response({
                        id: getId(request)
                    }, {
                        location: request.url || "/" + getId(request)
                    });
                },

                destroy: function (request) {
                    var id = getId(request);
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id == id) {
                            items.splice(i, 1);
                            break;
                        }
                    }

                    // TODO: make it work with non-linear ids ..
                    can.extend(findOne(id) || {}, request.data);
                    return {};
                },

                create: function (settings, response) {
                    var item = make(items.length, items);

                    can.extend(item, settings.data);

                    if (!item.id) {
                        item.id = items.length;
                    }

                    items.push(item);
                    var id = item.id || parseInt(Math.random() * 100000, 10);
                    response({
                        id: id
                    }, {
                        location: settings.url + "/" + id
                    })
                }
            });

            var reset = function () {
                items = [];
                for (var i = 0; i < (count); i++) {
                    //call back provided make
                    var item = make(i, items);

                    if (!item.id) {
                        item.id = i;
                    }
                    items.push(item);
                }
                if (can.isArray(types)) {
                    can.fixture["~" + types[0]] = items;
                    can.fixture["-" + types[0]] = methods.findAll;
                    can.fixture["-" + types[1]] = methods.findOne;
                    can.fixture["-" + types[1] + "Update"] = methods.update;
                    can.fixture["-" + types[1] + "Destroy"] = methods.destroy;
                    can.fixture["-" + types[1] + "Create"] = methods.create;
                }
            }
            reset()
            // if we have types given add them to can.fixture

            return can.extend({
                getId: getId,

                find: function (settings) {
                    return findOne(getId(settings));
                },

                reset: reset
            }, methods);
        },

        rand: function (arr, min, max) {
            if (typeof arr == 'number') {
                if (typeof min == 'number') {
                    return arr + Math.floor(Math.random() * (min - arr));
                } else {
                    return Math.floor(Math.random() * arr);
                }

            }
            var rand = arguments.callee;
            // get a random set
            if (min === undefined) {
                return rand(arr, rand(arr.length + 1))
            }
            // get a random selection of arr
            var res = [];
            arr = arr.slice(0);
            // set max
            if (!max) {
                max = min;
            }
            //random max
            max = min + Math.round(rand(max - min))
            for (var i = 0; i < max; i++) {
                res.push(arr.splice(rand(arr.length), 1)[0])
            }
            return res;
        },

        xhr: function (xhr) {
            return can.extend({}, {
                abort: can.noop,
                getAllResponseHeaders: function () {
                    return "";
                },
                getResponseHeader: function () {
                    return "";
                },
                open: can.noop,
                overrideMimeType: can.noop,
                readyState: 4,
                responseText: "",
                responseXML: null,
                send: can.noop,
                setRequestHeader: can.noop,
                status: 200,
                statusText: "OK"
            }, xhr);
        },

        on: true
    });

    can.fixture.delay = 200;


    can.fixture.rootUrl = getUrl('');

    can.fixture["-handleFunction"] = function (settings) {
        if (typeof settings.fixture === "string" && can.fixture[settings.fixture]) {
            settings.fixture = can.fixture[settings.fixture];
        }
        if (typeof settings.fixture == "function") {
            setTimeout(function () {
                if (settings.success) {
                    settings.success.apply(null, settings.fixture(settings, "success"));
                }
                if (settings.complete) {
                    settings.complete.apply(null, settings.fixture(settings, "complete"));
                }
            }, can.fixture.delay);
            return true;
        }
        return false;
    };

    //Expose this for fixture debugging
    can.fixture.overwrites = overwrites;
    can.fixture.make = can.fixture.store;
    return can.fixture;
});