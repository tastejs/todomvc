/*
 * js_channel is a very lightweight abstraction on top of
 * postMessage which defines message formats and semantics
 * to support interactions more rich than just message passing
 * js_channel supports:
 *  + query/response - traditional rpc
 *  + query/update/response - incremental async return of results
 *    to a query
 *  + notifications - fire and forget
 *  + error handling
 *
 * js_channel is based heavily on json-rpc, but is focused at the
 * problem of inter-iframe RPC.
 *
 * Message types:
 *  There are 5 types of messages that can flow over this channel,
 *  and you may determine what type of message an object is by
 *  examining its parameters:
 *  1. Requests
 *    + integer id
 *    + string method
 *    + (optional) any params
 *  2. Callback Invocations (or just "Callbacks")
 *    + integer id
 *    + string callback
 *    + (optional) params
 *  3. Error Responses (or just "Errors)
 *    + integer id
 *    + string error
 *    + (optional) string message
 *  4. Responses
 *    + integer id
 *    + (optional) any result
 *  5. Notifications
 *    + string method
 *    + (optional) any params
 */

;var Channel = (function() {
    "use strict";

    // current transaction id, start out at a random *odd* number between 1 and a million
    // There is one current transaction counter id per page, and it's shared between
    // channel instances.  That means of all messages posted from a single javascript
    // evaluation context, we'll never have two with the same id.
    var s_curTranId = Math.floor(Math.random()*1000001);

    // no two bound channels in the same javascript evaluation context may have the same origin, scope, and window.
    // futher if two bound channels have the same window and scope, they may not have *overlapping* origins
    // (either one or both support '*').  This restriction allows a single onMessage handler to efficiently
    // route messages based on origin and scope.  The s_boundChans maps origins to scopes, to message
    // handlers.  Request and Notification messages are routed using this table.
    // Finally, channels are inserted into this table when built, and removed when destroyed.
    var s_boundChans = { };

    // add a channel to s_boundChans, throwing if a dup exists
    function s_addBoundChan(win, origin, scope, handler) {
        function hasWin(arr) {
            for (var i = 0; i < arr.length; i++) if (arr[i].win === win) return true;
            return false;
        }

        // does she exist?
        var exists = false;


        if (origin === '*') {
            // we must check all other origins, sadly.
            for (var k in s_boundChans) {
                if (!s_boundChans.hasOwnProperty(k)) continue;
                if (k === '*') continue;
                if (typeof s_boundChans[k][scope] === 'object') {
                    exists = hasWin(s_boundChans[k][scope]);
                    if (exists) break;
                }
            }
        } else {
            // we must check only '*'
            if ((s_boundChans['*'] && s_boundChans['*'][scope])) {
                exists = hasWin(s_boundChans['*'][scope]);
            }
            if (!exists && s_boundChans[origin] && s_boundChans[origin][scope])
            {
                exists = hasWin(s_boundChans[origin][scope]);
            }
        }
        if (exists) throw "A channel is already bound to the same window which overlaps with origin '"+ origin +"' and has scope '"+scope+"'";

        if (typeof s_boundChans[origin] != 'object') s_boundChans[origin] = { };
        if (typeof s_boundChans[origin][scope] != 'object') s_boundChans[origin][scope] = [ ];
        s_boundChans[origin][scope].push({win: win, handler: handler});
    }

    function s_removeBoundChan(win, origin, scope) {
        var arr = s_boundChans[origin][scope];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].win === win) {
                arr.splice(i,1);
            }
        }
        if (s_boundChans[origin][scope].length === 0) {
            delete s_boundChans[origin][scope];
        }
    }

    function s_isArray(obj) {
        if (Array.isArray) return Array.isArray(obj);
        else {
            return (obj.constructor.toString().indexOf("Array") != -1);
        }
    }

    // No two outstanding outbound messages may have the same id, period.  Given that, a single table
    // mapping "transaction ids" to message handlers, allows efficient routing of Callback, Error, and
    // Response messages.  Entries are added to this table when requests are sent, and removed when
    // responses are received.
    var s_transIds = { };

    // class singleton onMessage handler
    // this function is registered once and all incoming messages route through here.  This
    // arrangement allows certain efficiencies, message data is only parsed once and dispatch
    // is more efficient, especially for large numbers of simultaneous channels.
    var s_onMessage = function(e) {
        try {
          var m = JSON.parse(e.data);
          if (typeof m !== 'object' || m === null) throw "malformed";
        } catch(e) {
          // just ignore any posted messages that do not consist of valid JSON
          return;
        }

        var w = e.source;
        var o = e.origin;
        var s, i, meth;

        if (typeof m.method === 'string') {
            var ar = m.method.split('::');
            if (ar.length == 2) {
                s = ar[0];
                meth = ar[1];
            } else {
                meth = m.method;
            }
        }

        if (typeof m.id !== 'undefined') i = m.id;

        // w is message source window
        // o is message origin
        // m is parsed message
        // s is message scope
        // i is message id (or undefined)
        // meth is unscoped method name
        // ^^ based on these factors we can route the message

        // if it has a method it's either a notification or a request,
        // route using s_boundChans
        if (typeof meth === 'string') {
            var delivered = false;
            if (s_boundChans[o] && s_boundChans[o][s]) {
                for (var j = 0; j < s_boundChans[o][s].length; j++) {
                    if (s_boundChans[o][s][j].win === w) {
                        s_boundChans[o][s][j].handler(o, meth, m);
                        delivered = true;
                        break;
                    }
                }
            }

            if (!delivered && s_boundChans['*'] && s_boundChans['*'][s]) {
                for (var j = 0; j < s_boundChans['*'][s].length; j++) {
                    if (s_boundChans['*'][s][j].win === w) {
                        s_boundChans['*'][s][j].handler(o, meth, m);
                        break;
                    }
                }
            }
        }
        // otherwise it must have an id (or be poorly formed
        else if (typeof i != 'undefined') {
            if (s_transIds[i]) s_transIds[i](o, meth, m);
        }
    };

    // Setup postMessage event listeners
    if (window.addEventListener) window.addEventListener('message', s_onMessage, false);
    else if(window.attachEvent) window.attachEvent('onmessage', s_onMessage);

    /* a messaging channel is constructed from a window and an origin.
     * the channel will assert that all messages received over the
     * channel match the origin
     *
     * Arguments to Channel.build(cfg):
     *
     *   cfg.window - the remote window with which we'll communicate
     *   cfg.origin - the expected origin of the remote window, may be '*'
     *                which matches any origin
     *   cfg.scope  - the 'scope' of messages.  a scope string that is
     *                prepended to message names.  local and remote endpoints
     *                of a single channel must agree upon scope. Scope may
     *                not contain double colons ('::').
     *   cfg.debugOutput - A boolean value.  If true and window.console.log is
     *                a function, then debug strings will be emitted to that
     *                function.
     *   cfg.debugOutput - A boolean value.  If true and window.console.log is
     *                a function, then debug strings will be emitted to that
     *                function.
     *   cfg.postMessageObserver - A function that will be passed two arguments,
     *                an origin and a message.  It will be passed these immediately
     *                before messages are posted.
     *   cfg.gotMessageObserver - A function that will be passed two arguments,
     *                an origin and a message.  It will be passed these arguments
     *                immediately after they pass scope and origin checks, but before
     *                they are processed.
     *   cfg.onReady - A function that will be invoked when a channel becomes "ready",
     *                this occurs once both sides of the channel have been
     *                instantiated and an application level handshake is exchanged.
     *                the onReady function will be passed a single argument which is
     *                the channel object that was returned from build().
     */
    return {
        build: function(cfg) {
            var debug = function(m) {
                if (cfg.debugOutput && window.console && window.console.log) {
                    // try to stringify, if it doesn't work we'll let javascript's built in toString do its magic
                    try { if (typeof m !== 'string') m = JSON.stringify(m); } catch(e) { }
                    console.log("["+chanId+"] " + m);
                }
            };

            /* browser capabilities check */
            if (!window.postMessage) throw("jschannel cannot run this browser, no postMessage");
            if (!window.JSON || !window.JSON.stringify || ! window.JSON.parse) {
                throw("jschannel cannot run this browser, no JSON parsing/serialization");
            }

            /* basic argument validation */
            if (typeof cfg != 'object') throw("Channel build invoked without a proper object argument");

            if (!cfg.window || !cfg.window.postMessage) throw("Channel.build() called without a valid window argument");

            /* we'd have to do a little more work to be able to run multiple channels that intercommunicate the same
             * window...  Not sure if we care to support that */
            if (window === cfg.window) throw("target window is same as present window -- not allowed");

            // let's require that the client specify an origin.  if we just assume '*' we'll be
            // propagating unsafe practices.  that would be lame.
            var validOrigin = false;
            if (typeof cfg.origin === 'string') {
                var oMatch;
                if (cfg.origin === "*") validOrigin = true;
                // allow valid domains under http and https.  Also, trim paths off otherwise valid origins.
                else if (null !== (oMatch = cfg.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/))) {
                    cfg.origin = oMatch[0].toLowerCase();
                    validOrigin = true;
                }
            }

            if (!validOrigin) throw ("Channel.build() called with an invalid origin");

            if (typeof cfg.scope !== 'undefined') {
                if (typeof cfg.scope !== 'string') throw 'scope, when specified, must be a string';
                if (cfg.scope.split('::').length > 1) throw "scope may not contain double colons: '::'";
            }

            /* private variables */
            // generate a random and psuedo unique id for this channel
            var chanId = (function () {
                var text = "";
                var alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                for(var i=0; i < 5; i++) text += alpha.charAt(Math.floor(Math.random() * alpha.length));
                return text;
            })();

            // registrations: mapping method names to call objects
            var regTbl = { };
            // current oustanding sent requests
            var outTbl = { };
            // current oustanding received requests
            var inTbl = { };
            // are we ready yet?  when false we will block outbound messages.
            var ready = false;
            var pendingQueue = [ ];

            var createTransaction = function(id,origin,callbacks) {
                var shouldDelayReturn = false;
                var completed = false;

                return {
                    origin: origin,
                    invoke: function(cbName, v) {
                        // verify in table
                        if (!inTbl[id]) throw "attempting to invoke a callback of a nonexistent transaction: " + id;
                        // verify that the callback name is valid
                        var valid = false;
                        for (var i = 0; i < callbacks.length; i++) if (cbName === callbacks[i]) { valid = true; break; }
                        if (!valid) throw "request supports no such callback '" + cbName + "'";

                        // send callback invocation
                        postMessage({ id: id, callback: cbName, params: v});
                    },
                    error: function(error, message) {
                        completed = true;
                        // verify in table
                        if (!inTbl[id]) throw "error called for nonexistent message: " + id;

                        // remove transaction from table
                        delete inTbl[id];

                        // send error
                        postMessage({ id: id, error: error, message: message });
                    },
                    complete: function(v) {
                        completed = true;
                        // verify in table
                        if (!inTbl[id]) throw "complete called for nonexistent message: " + id;
                        // remove transaction from table
                        delete inTbl[id];
                        // send complete
                        postMessage({ id: id, result: v });
                    },
                    delayReturn: function(delay) {
                        if (typeof delay === 'boolean') {
                            shouldDelayReturn = (delay === true);
                        }
                        return shouldDelayReturn;
                    },
                    completed: function() {
                        return completed;
                    }
                };
            };

            var setTransactionTimeout = function(transId, timeout, method) {
              return window.setTimeout(function() {
                if (outTbl[transId]) {
                  // XXX: what if client code raises an exception here?
                  var msg = "timeout (" + timeout + "ms) exceeded on method '" + method + "'";
                  (1,outTbl[transId].error)("timeout_error", msg);
                  delete outTbl[transId];
                  delete s_transIds[transId];
                }
              }, timeout);
            };

            var onMessage = function(origin, method, m) {
                // if an observer was specified at allocation time, invoke it
                if (typeof cfg.gotMessageObserver === 'function') {
                    // pass observer a clone of the object so that our
                    // manipulations are not visible (i.e. method unscoping).
                    // This is not particularly efficient, but then we expect
                    // that message observers are primarily for debugging anyway.
                    try {
                        cfg.gotMessageObserver(origin, m);
                    } catch (e) {
                        debug("gotMessageObserver() raised an exception: " + e.toString());
                    }
                }

                // now, what type of message is this?
                if (m.id && method) {
                    // a request!  do we have a registered handler for this request?
                    if (regTbl[method]) {
                        var trans = createTransaction(m.id, origin, m.callbacks ? m.callbacks : [ ]);
                        inTbl[m.id] = { };
                        try {
                            // callback handling.  we'll magically create functions inside the parameter list for each
                            // callback
                            if (m.callbacks && s_isArray(m.callbacks) && m.callbacks.length > 0) {
                                for (var i = 0; i < m.callbacks.length; i++) {
                                    var path = m.callbacks[i];
                                    var obj = m.params;
                                    var pathItems = path.split('/');
                                    for (var j = 0; j < pathItems.length - 1; j++) {
                                        var cp = pathItems[j];
                                        if (typeof obj[cp] !== 'object') obj[cp] = { };
                                        obj = obj[cp];
                                    }
                                    obj[pathItems[pathItems.length - 1]] = (function() {
                                        var cbName = path;
                                        return function(params) {
                                            return trans.invoke(cbName, params);
                                        };
                                    })();
                                }
                            }
                            var resp = regTbl[method](trans, m.params);
                            if (!trans.delayReturn() && !trans.completed()) trans.complete(resp);
                        } catch(e) {
                            // automagic handling of exceptions:
                            var error = "runtime_error";
                            var message = null;
                            // * if it's a string then it gets an error code of 'runtime_error' and string is the message
                            if (typeof e === 'string') {
                                message = e;
                            } else if (typeof e === 'object') {
                                // either an array or an object
                                // * if it's an array of length two, then  array[0] is the code, array[1] is the error message
                                if (e && s_isArray(e) && e.length == 2) {
                                    error = e[0];
                                    message = e[1];
                                }
                                // * if it's an object then we'll look form error and message parameters
                                else if (typeof e.error === 'string') {
                                    error = e.error;
                                    if (!e.message) message = "";
                                    else if (typeof e.message === 'string') message = e.message;
                                    else e = e.message; // let the stringify/toString message give us a reasonable verbose error string
                                }
                            }

                            // message is *still* null, let's try harder
                            if (message === null) {
                                try {
                                    message = JSON.stringify(e);
                                    /* On MSIE8, this can result in 'out of memory', which
                                     * leaves message undefined. */
                                    if (typeof(message) == 'undefined')
                                      message = e.toString();
                                } catch (e2) {
                                    message = e.toString();
                                }
                            }

                            trans.error(error,message);
                        }
                    }
                } else if (m.id && m.callback) {
                    if (!outTbl[m.id] ||!outTbl[m.id].callbacks || !outTbl[m.id].callbacks[m.callback])
                    {
                        debug("ignoring invalid callback, id:"+m.id+ " (" + m.callback +")");
                    } else {
                        // XXX: what if client code raises an exception here?
                        outTbl[m.id].callbacks[m.callback](m.params);
                    }
                } else if (m.id) {
                    if (!outTbl[m.id]) {
                        debug("ignoring invalid response: " + m.id);
                    } else {
                        // XXX: what if client code raises an exception here?
                        if (m.error) {
                            (1,outTbl[m.id].error)(m.error, m.message);
                        } else {
                            if (m.result !== undefined) (1,outTbl[m.id].success)(m.result);
                            else (1,outTbl[m.id].success)();
                        }
                        delete outTbl[m.id];
                        delete s_transIds[m.id];
                    }
                } else if (method) {
                    // tis a notification.
                    if (regTbl[method]) {
                        // yep, there's a handler for that.
                        // transaction has only origin for notifications.
                        regTbl[method]({ origin: origin }, m.params);
                        // if the client throws, we'll just let it bubble out
                        // what can we do?  Also, here we'll ignore return values
                    }
                }
            };

            // now register our bound channel for msg routing
            s_addBoundChan(cfg.window, cfg.origin, ((typeof cfg.scope === 'string') ? cfg.scope : ''), onMessage);

            // scope method names based on cfg.scope specified when the Channel was instantiated
            var scopeMethod = function(m) {
                if (typeof cfg.scope === 'string' && cfg.scope.length) m = [cfg.scope, m].join("::");
                return m;
            };

            // a small wrapper around postmessage whose primary function is to handle the
            // case that clients start sending messages before the other end is "ready"
            var postMessage = function(msg, force) {
                if (!msg) throw "postMessage called with null message";

                // delay posting if we're not ready yet.
                var verb = (ready ? "post  " : "queue ");
                debug(verb + " message: " + JSON.stringify(msg));
                if (!force && !ready) {
                    pendingQueue.push(msg);
                } else {
                    if (typeof cfg.postMessageObserver === 'function') {
                        try {
                            cfg.postMessageObserver(cfg.origin, msg);
                        } catch (e) {
                            debug("postMessageObserver() raised an exception: " + e.toString());
                        }
                    }

                    cfg.window.postMessage(JSON.stringify(msg), cfg.origin);
                }
            };

            var onReady = function(trans, type) {
                debug('ready msg received');
                if (ready) throw "received ready message while in ready state.  help!";

                if (type === 'ping') {
                    chanId += '-R';
                } else {
                    chanId += '-L';
                }

                obj.unbind('__ready'); // now this handler isn't needed any more.
                ready = true;
                debug('ready msg accepted.');

                if (type === 'ping') {
                    obj.notify({ method: '__ready', params: 'pong' });
                }

                // flush queue
                while (pendingQueue.length) {
                    postMessage(pendingQueue.pop());
                }

                // invoke onReady observer if provided
                if (typeof cfg.onReady === 'function') cfg.onReady(obj);
            };

            var obj = {
                // tries to unbind a bound message handler.  returns false if not possible
                unbind: function (method) {
                    if (regTbl[method]) {
                        if (!(delete regTbl[method])) throw ("can't delete method: " + method);
                        return true;
                    }
                    return false;
                },
                bind: function (method, cb) {
                    if (!method || typeof method !== 'string') throw "'method' argument to bind must be string";
                    if (!cb || typeof cb !== 'function') throw "callback missing from bind params";

                    if (regTbl[method]) throw "method '"+method+"' is already bound!";
                    regTbl[method] = cb;
                    return this;
                },
                call: function(m) {
                    if (!m) throw 'missing arguments to call function';
                    if (!m.method || typeof m.method !== 'string') throw "'method' argument to call must be string";
                    if (!m.success || typeof m.success !== 'function') throw "'success' callback missing from call";

                    // now it's time to support the 'callback' feature of jschannel.  We'll traverse the argument
                    // object and pick out all of the functions that were passed as arguments.
                    var callbacks = { };
                    var callbackNames = [ ];

                    var pruneFunctions = function (path, obj) {
                        if (typeof obj === 'object') {
                            for (var k in obj) {
                                if (!obj.hasOwnProperty(k)) continue;
                                var np = path + (path.length ? '/' : '') + k;
                                if (typeof obj[k] === 'function') {
                                    callbacks[np] = obj[k];
                                    callbackNames.push(np);
                                    delete obj[k];
                                } else if (typeof obj[k] === 'object') {
                                    pruneFunctions(np, obj[k]);
                                }
                            }
                        }
                    };
                    pruneFunctions("", m.params);

                    // build a 'request' message and send it
                    var msg = { id: s_curTranId, method: scopeMethod(m.method), params: m.params };
                    if (callbackNames.length) msg.callbacks = callbackNames;

                    if (m.timeout)
                      // XXX: This function returns a timeout ID, but we don't do anything with it.
                      // We might want to keep track of it so we can cancel it using clearTimeout()
                      // when the transaction completes.
                      setTransactionTimeout(s_curTranId, m.timeout, scopeMethod(m.method));

                    // insert into the transaction table
                    outTbl[s_curTranId] = { callbacks: callbacks, error: m.error, success: m.success };
                    s_transIds[s_curTranId] = onMessage;

                    // increment current id
                    s_curTranId++;

                    postMessage(msg);
                },
                notify: function(m) {
                    if (!m) throw 'missing arguments to notify function';
                    if (!m.method || typeof m.method !== 'string') throw "'method' argument to notify must be string";

                    // no need to go into any transaction table
                    postMessage({ method: scopeMethod(m.method), params: m.params });
                },
                destroy: function () {
                    s_removeBoundChan(cfg.window, cfg.origin, ((typeof cfg.scope === 'string') ? cfg.scope : ''));
                    if (window.removeEventListener) window.removeEventListener('message', onMessage, false);
                    else if(window.detachEvent) window.detachEvent('onmessage', onMessage);
                    ready = false;
                    regTbl = { };
                    inTbl = { };
                    outTbl = { };
                    cfg.origin = null;
                    pendingQueue = [ ];
                    debug("channel destroyed");
                    chanId = "";
                }
            };

            obj.bind('__ready', onReady);
            setTimeout(function() {
                postMessage({ method: scopeMethod('__ready'), params: "ping" }, true);
            }, 0);

            return obj;
        }
    };
})();
;/*
 * DOMParser HTML extension
 * 2012-09-04
 *
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
/*! @source https://gist.github.com/1129031 */
(function (DOMParser) {
  "use strict";
  var DOMParser_proto = DOMParser.prototype,
    real_parseFromString = DOMParser_proto.parseFromString;

  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if ((new DOMParser()).parseFromString("", "text/html")) {
      // text/html parsing is natively supported
      return;
    }
  } catch (ignore) {}

  DOMParser_proto.parseFromString = function (markup, type) {
    var result, doc, doc_elt, first_elt;
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      doc = document.implementation.createHTMLDocument("");
      doc_elt = doc.documentElement;

      doc_elt.innerHTML = markup;
      first_elt = doc_elt.firstElementChild;

      if (doc_elt.childElementCount === 1
          && first_elt.localName.toLowerCase() === "html") {
        doc.replaceChild(first_elt, doc_elt);
      }

      result = doc;
    } else {
      result = real_parseFromString.apply(this, arguments);
    }
    return result;
  };
}(DOMParser));

;// IE does not support have Document.prototype.contains.
if (typeof document.contains !== 'function') {
  Document.prototype.contains = function(node) {
    if (node === this || node.parentNode === this)
      return true;
    return this.documentElement.contains(node);
 }
}
;/*! RenderJs */
/*jslint nomen: true*/

/*
 * renderJs - Generic Gadget library renderer.
 * http://www.renderjs.org/documentation
 */
(function (document, window, RSVP, DOMParser, Channel, MutationObserver,
           Node, FileReader, Blob, navigator, Event, URL) {
  "use strict";

  function readBlobAsDataURL(blob) {
    var fr = new FileReader();
    return new RSVP.Promise(function (resolve, reject) {
      fr.addEventListener("load", function (evt) {
        resolve(evt.target.result);
      });
      fr.addEventListener("error", reject);
      fr.readAsDataURL(blob);
    }, function () {
      fr.abort();
    });
  }

  function loopEventListener(target, type, useCapture, callback,
                             prevent_default) {
    //////////////////////////
    // Infinite event listener (promise is never resolved)
    // eventListener is removed when promise is cancelled/rejected
    //////////////////////////
    var handle_event_callback,
      callback_promise;

    if (prevent_default === undefined) {
      prevent_default = true;
    }

    function cancelResolver() {
      if ((callback_promise !== undefined) &&
          (typeof callback_promise.cancel === "function")) {
        callback_promise.cancel();
      }
    }

    function canceller() {
      if (handle_event_callback !== undefined) {
        target.removeEventListener(type, handle_event_callback, useCapture);
      }
      cancelResolver();
    }
    function itsANonResolvableTrap(resolve, reject) {
      var result;
      handle_event_callback = function (evt) {
        if (prevent_default) {
          evt.stopPropagation();
          evt.preventDefault();
        }

        cancelResolver();

        try {
          result = callback(evt);
        } catch (e) {
          result = RSVP.reject(e);
        }

        callback_promise = result;
        new RSVP.Queue()
          .push(function () {
            return result;
          })
          .push(undefined, function (error) {
            if (!(error instanceof RSVP.CancellationError)) {
              canceller();
              reject(error);
            }
          });
      };

      target.addEventListener(type, handle_event_callback, useCapture);
    }
    return new RSVP.Promise(itsANonResolvableTrap, canceller);
  }

  function promiseAnimationFrame() {
    var request_id;

    function canceller() {
      window.cancelAnimationFrame(request_id);
    }

    function resolver(resolve) {
      request_id = window.requestAnimationFrame(resolve);
    }
    return new RSVP.Promise(resolver, canceller);
  }

  function ajax(url) {
    var xhr;
    function resolver(resolve, reject) {
      function handler() {
        try {
          if (xhr.readyState === 0) {
            // UNSENT
            reject(xhr);
          } else if (xhr.readyState === 4) {
            // DONE
            if ((xhr.status < 200) || (xhr.status >= 300) ||
                (!/^text\/html[;]?/.test(
                  xhr.getResponseHeader("Content-Type") || ""
                ))) {
              reject(xhr);
            } else {
              resolve(xhr);
            }
          }
        } catch (e) {
          reject(e);
        }
      }

      xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onreadystatechange = handler;
      xhr.setRequestHeader('Accept', 'text/html');
      xhr.withCredentials = true;
      xhr.send();
    }

    function canceller() {
      if ((xhr !== undefined) && (xhr.readyState !== xhr.DONE)) {
        xhr.abort();
      }
    }
    return new RSVP.Promise(resolver, canceller);
  }

  var gadget_model_defer_dict = {},
    javascript_registration_dict = {},
    stylesheet_registration_dict = {},
    gadget_loading_klass_list = [],
    renderJS,
    Monitor,
    scope_increment = 0,
    isAbsoluteOrDataURL = new RegExp('^(?:[a-z]+:)?//|data:', 'i'),
    is_page_unloaded = false,
    error_list = [],
    all_dependency_loaded_deferred;

  window.addEventListener('error', function (error) {
    error_list.push(error);
  });

  window.addEventListener('beforeunload', function () {
    // XXX If another listener cancel the page unload,
    // it will not restore renderJS crash report
    is_page_unloaded = true;
  });

  /////////////////////////////////////////////////////////////////
  // Helper functions
  /////////////////////////////////////////////////////////////////
  function removeHash(url) {
    var index = url.indexOf('#');
    if (index > 0) {
      url = url.substring(0, index);
    }
    return url;
  }

  function letsCrash(e) {
    var i,
      body,
      container,
      paragraph,
      link,
      error;
    if (is_page_unloaded) {
      /*global console*/
      console.info('-- Error dropped, as page is unloaded');
      console.info(e);
      return;
    }

    error_list.push(e);
    // Add error handling stack
    error_list.push(new Error('stopping renderJS'));

    body = document.getElementsByTagName('body')[0];
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }

    container = document.createElement("section");
    paragraph = document.createElement("h1");
    paragraph.textContent = 'Unhandled Error';
    container.appendChild(paragraph);

    paragraph = document.createElement("p");
    paragraph.textContent = 'Please report this error to the support team';
    container.appendChild(paragraph);

    paragraph = document.createElement("p");
    paragraph.textContent = 'Location: ';
    link = document.createElement("a");
    link.href = link.textContent = window.location.toString();
    paragraph.appendChild(link);
    container.appendChild(paragraph);

    paragraph = document.createElement("p");
    paragraph.textContent = 'User-agent: ' + navigator.userAgent;
    container.appendChild(paragraph);

    paragraph = document.createElement("p");
    paragraph.textContent = 'Date: ' + new Date(Date.now()).toISOString();
    container.appendChild(paragraph);

    body.appendChild(container);

    for (i = 0; i < error_list.length; i += 1) {
      error = error_list[i];

      if (error instanceof Event) {
        error = {
          string: error.toString(),
          message: error.message,
          type: error.type,
          target: error.target
        };
        if (error.target !== undefined) {
          error_list.splice(i + 1, 0, error.target);
        }
      }

      if (error instanceof XMLHttpRequest) {
        error = {
          message: error.toString(),
          readyState: error.readyState,
          status: error.status,
          statusText: error.statusText,
          response: error.response,
          responseUrl: error.responseUrl,
          response_headers: error.getAllResponseHeaders()
        };
      }
      if (error.constructor === Array ||
          error.constructor === String ||
          error.constructor === Object) {
        try {
          error = JSON.stringify(error);
        } catch (ignore) {
        }
      }

      container = document.createElement("section");

      paragraph = document.createElement("h2");
      paragraph.textContent = error.message || error;
      container.appendChild(paragraph);

      if (error.fileName !== undefined) {
        paragraph = document.createElement("p");
        paragraph.textContent = 'File: ' +
          error.fileName +
          ': ' + error.lineNumber;
        container.appendChild(paragraph);
      }

      if (error.stack !== undefined) {
        paragraph = document.createElement("pre");
        paragraph.textContent = 'Stack: ' + error.stack;
        container.appendChild(paragraph);
      }

      body.appendChild(container);
    }
    // XXX Do not crash the application if it fails
    // Where to write the error?
    /*global console*/
    console.error(e.stack);
    console.error(e);
  }

  /////////////////////////////////////////////////////////////////
  // Service Monitor promise
  /////////////////////////////////////////////////////////////////
  function ResolvedMonitorError(message) {
    this.name = "resolved";
    if ((message !== undefined) && (typeof message !== "string")) {
      throw new TypeError('You must pass a string.');
    }
    this.message = message || "Default Message";
  }
  ResolvedMonitorError.prototype = new Error();
  ResolvedMonitorError.prototype.constructor = ResolvedMonitorError;

  Monitor = function () {
    var monitor = this,
      promise_list = [],
      promise,
      reject,
      notify,
      resolved;

    if (!(this instanceof Monitor)) {
      return new Monitor();
    }

    function canceller() {
      var len = promise_list.length,
        i;
      for (i = 0; i < len; i += 1) {
        promise_list[i].cancel();
      }
      // Clean it to speed up other canceller run
      promise_list = [];
    }

    promise = new RSVP.Promise(function (done, fail, progress) {
      reject = function (rejectedReason) {
        if (resolved) {
          return;
        }
        monitor.isRejected = true;
        monitor.rejectedReason = rejectedReason;
        resolved = true;
        canceller();
        return fail(rejectedReason);
      };
      notify = progress;
    }, canceller);

    monitor.cancel = function () {
      if (resolved) {
        return;
      }
      resolved = true;
      promise.cancel();
      promise.fail(function (rejectedReason) {
        monitor.isRejected = true;
        monitor.rejectedReason = rejectedReason;
      });
    };
    monitor.then = function () {
      return promise.then.apply(promise, arguments);
    };
    monitor.fail = function () {
      return promise.fail.apply(promise, arguments);
    };

    monitor.monitor = function (promise_to_monitor) {
      if (resolved) {
        throw new ResolvedMonitorError();
      }
      var queue = new RSVP.Queue()
        .push(function () {
          return promise_to_monitor;
        })
        .push(function (fulfillmentValue) {
          // Promise to monitor is fullfilled, remove it from the list
          var len = promise_list.length,
            sub_promise_to_monitor,
            new_promise_list = [],
            i;
          for (i = 0; i < len; i += 1) {
            sub_promise_to_monitor = promise_list[i];
            if (!(sub_promise_to_monitor.isFulfilled ||
                sub_promise_to_monitor.isRejected)) {
              new_promise_list.push(sub_promise_to_monitor);
            }
          }
          promise_list = new_promise_list;
        }, function (rejectedReason) {
          if (rejectedReason instanceof RSVP.CancellationError) {
            if (!(promise_to_monitor.isFulfilled &&
                  promise_to_monitor.isRejected)) {
              // The queue could be cancelled before the first push is run
              promise_to_monitor.cancel();
            }
          }
          reject(rejectedReason);
          throw rejectedReason;
        }, function (notificationValue) {
          notify(notificationValue);
          return notificationValue;
        });

      promise_list.push(queue);

      return this;
    };
  };

  Monitor.prototype = Object.create(RSVP.Promise.prototype);
  Monitor.prototype.constructor = Monitor;

  /////////////////////////////////////////////////////////////////
  // RenderJSGadget
  /////////////////////////////////////////////////////////////////
  function RenderJSGadget() {
    if (!(this instanceof RenderJSGadget)) {
      return new RenderJSGadget();
    }
  }
  RenderJSGadget.prototype.__title = "";
  RenderJSGadget.prototype.__interface_list = [];
  RenderJSGadget.prototype.__path = "";
  RenderJSGadget.prototype.__html = "";
  RenderJSGadget.prototype.__required_css_list = [];
  RenderJSGadget.prototype.__required_js_list = [];

  function createMonitor(g) {
    if (g.__monitor !== undefined) {
      g.__monitor.cancel();
    }
    g.__monitor = new Monitor();
    g.__job_dict = {};
    g.__job_list = [];
    g.__job_triggered = false;
    g.__monitor.fail(function (error) {
      if (!(error instanceof RSVP.CancellationError)) {
        return g.aq_reportServiceError(error);
      }
    }).fail(function (error) {
      // Crash the application if the acquisition generates an error.
      return letsCrash(error);
    });
  }

  function clearGadgetInternalParameters() {
    this.__sub_gadget_dict = {};
    createMonitor(this);
  }

  function loadSubGadgetDOMDeclaration() {
    var element_list = this.element.querySelectorAll('[data-gadget-url]'),
      element,
      promise_list = [],
      scope,
      url,
      sandbox,
      i,
      context = this;

    function prepareReportGadgetDeclarationError(scope) {
      return function (error) {
        var aq_dict = context.__acquired_method_dict || {},
          method_name = 'reportGadgetDeclarationError';
        if (aq_dict.hasOwnProperty(method_name)) {
          return aq_dict[method_name].apply(context,
                                            [arguments, scope]);
        }
        throw error;
      };
    }

    for (i = 0; i < element_list.length; i += 1) {
      element = element_list[i];
      scope = element.getAttribute("data-gadget-scope");
      url = element.getAttribute("data-gadget-url");
      sandbox = element.getAttribute("data-gadget-sandbox");
      if (url !== null) {
        promise_list.push(
          context.declareGadget(url, {
            element: element,
            scope: scope || undefined,
            sandbox: sandbox || undefined
          })
            .push(undefined, prepareReportGadgetDeclarationError(scope))
        );
      }
    }

    return RSVP.all(promise_list);
  }

  RenderJSGadget.__ready_list = [clearGadgetInternalParameters,
                                 loadSubGadgetDOMDeclaration];
  RenderJSGadget.ready = function (callback) {
    this.__ready_list.push(callback);
    return this;
  };
  RenderJSGadget.setState = function (state_dict) {
    var json_state = JSON.stringify(state_dict);
    this.__ready_list.unshift(function () {
      this.state = JSON.parse(json_state);
    });
    return this;
  };
  RenderJSGadget.onStateChange = function (callback) {
    this.prototype.__state_change_callback = callback;
    return this;
  };

  RenderJSGadget.__service_list = [];
  RenderJSGadget.declareService = function (callback) {
    this.__service_list.push(callback);
    return this;
  };
  RenderJSGadget.onEvent = function (type, callback, use_capture,
                                     prevent_default) {
    this.__service_list.push(function () {
      return loopEventListener(this.element, type, use_capture,
                               callback.bind(this), prevent_default);
    });
    return this;
  };

  RenderJSGadget.onLoop = function (callback, delay) {
    if (delay === undefined) {
      delay = 0;
    }
    this.__service_list.push(function () {
      var queue_loop = new RSVP.Queue(),
        wait = function () {
          queue_loop
            .push(function () {
              return RSVP.delay(delay);
            })
            .push(function () {
              // Only loop when the app has the focus
              return promiseAnimationFrame();
            })
            .push(function () {
              return callback.apply(this, []);
            })
            .push(function () {
              wait();
            });
        };
      wait();
      return queue_loop;
    });
    return this;
  };

  function runJob(gadget, name, callback, argument_list) {
    var job_promise = new RSVP.Queue()
      .push(function () {
        return callback.apply(gadget, argument_list);
      });
    if (gadget.__job_dict.hasOwnProperty(name)) {
      gadget.__job_dict[name].cancel();
    }
    gadget.__job_dict[name] = job_promise;
    gadget.__monitor.monitor(new RSVP.Queue()
      .push(function () {
        return job_promise;
      })
      .push(undefined, function (error) {
        if (!(error instanceof RSVP.CancellationError)) {
          throw error;
        }
      }));
  }

  function startService(gadget) {
    gadget.__monitor.monitor(new RSVP.Queue()
      .push(function () {
        var i,
          service_list = gadget.constructor.__service_list,
          job_list = gadget.__job_list;
        for (i = 0; i < service_list.length; i += 1) {
          gadget.__monitor.monitor(service_list[i].apply(gadget));
        }
        for (i = 0; i < job_list.length; i += 1) {
          runJob(gadget, job_list[i][0], job_list[i][1], job_list[i][2]);
        }
        gadget.__job_list = [];
        gadget.__job_triggered = true;
      })
      );
  }

  /////////////////////////////////////////////////////////////////
  // RenderJSGadget.declareJob
  // gadget internal method, which trigger execution
  // of a function inside a service
  /////////////////////////////////////////////////////////////////
  RenderJSGadget.declareJob = function (name, callback) {
    this.prototype[name] = function () {
      var context = this,
        argument_list = arguments;

      if (context.__job_triggered) {
        runJob(context, name, callback, argument_list);
      } else {
        context.__job_list.push([name, callback, argument_list]);
      }
    };
    // Allow chain
    return this;
  };

  /////////////////////////////////////////////////////////////////
  // RenderJSGadget.declareMethod
  /////////////////////////////////////////////////////////////////
  RenderJSGadget.declareMethod = function (name, callback) {
    this.prototype[name] = function () {
      var context = this,
        argument_list = arguments;

      return new RSVP.Queue()
        .push(function () {
          return callback.apply(context, argument_list);
        });
    };
    // Allow chain
    return this;
  };

  RenderJSGadget
    .declareMethod('getInterfaceList', function () {
      // Returns the list of gadget prototype
      return this.__interface_list;
    })
    .declareMethod('getRequiredCSSList', function () {
      // Returns a list of CSS required by the gadget
      return this.__required_css_list;
    })
    .declareMethod('getRequiredJSList', function () {
      // Returns a list of JS required by the gadget
      return this.__required_js_list;
    })
    .declareMethod('getPath', function () {
      // Returns the path of the code of a gadget
      return this.__path;
    })
    .declareMethod('getTitle', function () {
      // Returns the title of a gadget
      return this.__title;
    })
    .declareMethod('getElement', function () {
      // Returns the DOM Element of a gadget
      // XXX Kept for compatibility. Use element property directly
      if (this.element === undefined) {
        throw new Error("No element defined");
      }
      return this.element;
    })
    .declareMethod('changeState', function (state_dict) {
      var next_onStateChange = new RSVP.Queue(),
        previous_onStateCHange,
        context = this;
      if (context.hasOwnProperty('__previous_onStateChange')) {
        previous_onStateCHange = context.__previous_onStateChange;
        next_onStateChange
          .push(function () {
            return previous_onStateCHange;
          })
          .push(undefined, function () {
            // Run callback even if previous failed
            return;
          });
      }
      context.__previous_onStateChange = next_onStateChange;
      return next_onStateChange
        .push(function () {
          var key,
            modified = false,
            previous_cancelled = context.hasOwnProperty('__modification_dict'),
            modification_dict;
          if (previous_cancelled) {
            modification_dict = context.__modification_dict;
            modified = true;
          } else {
            modification_dict = {};
          }
          for (key in state_dict) {
            if (state_dict.hasOwnProperty(key) &&
                (state_dict[key] !== context.state[key])) {
              context.state[key] = state_dict[key];
              modification_dict[key] = state_dict[key];
              modified = true;
            }
          }
          if (modified && context.__state_change_callback !== undefined) {
            context.__modification_dict = modification_dict;
            return new RSVP.Queue()
              .push(function () {
                return context.__state_change_callback(modification_dict);
              })
              .push(function (result) {
                delete context.__modification_dict;
                return result;
              });
          }
        });
    });

  /////////////////////////////////////////////////////////////////
  // RenderJSGadget.declareAcquiredMethod
  /////////////////////////////////////////////////////////////////
  function acquire(child_gadget, method_name, argument_list) {
    var gadget = this,
      key,
      gadget_scope;

    for (key in gadget.__sub_gadget_dict) {
      if (gadget.__sub_gadget_dict.hasOwnProperty(key)) {
        if (gadget.__sub_gadget_dict[key] === child_gadget) {
          gadget_scope = key;
        }
      }
    }
    return new RSVP.Queue()
      .push(function () {
        // Do not specify default __acquired_method_dict on prototype
        // to prevent modifying this default value (with
        // allowPublicAcquiredMethod for example)
        var aq_dict = gadget.__acquired_method_dict || {};
        if (aq_dict.hasOwnProperty(method_name)) {
          return aq_dict[method_name].apply(gadget,
                                            [argument_list, gadget_scope]);
        }
        throw new renderJS.AcquisitionError("aq_dynamic is not defined");
      })
      .push(undefined, function (error) {
        if (error instanceof renderJS.AcquisitionError) {
          return gadget.__aq_parent(method_name, argument_list);
        }
        throw error;
      });
  }

  RenderJSGadget.declareAcquiredMethod =
    function (name, method_name_to_acquire) {
      this.prototype[name] = function () {
        var argument_list = Array.prototype.slice.call(arguments, 0),
          gadget = this;
        return new RSVP.Queue()
          .push(function () {
            return gadget.__aq_parent(method_name_to_acquire, argument_list);
          });
      };

      // Allow chain
      return this;
    };
  RenderJSGadget.declareAcquiredMethod("aq_reportServiceError",
                                       "reportServiceError");
  RenderJSGadget.declareAcquiredMethod("aq_reportGadgetDeclarationError",
                                       "reportGadgetDeclarationError");

  /////////////////////////////////////////////////////////////////
  // RenderJSGadget.allowPublicAcquisition
  /////////////////////////////////////////////////////////////////
  RenderJSGadget.allowPublicAcquisition =
    function (method_name, callback) {
      this.prototype.__acquired_method_dict[method_name] = callback;

      // Allow chain
      return this;
    };

  // Set aq_parent on gadget_instance which call acquire on parent_gadget
  function setAqParent(gadget_instance, parent_gadget) {
    gadget_instance.__aq_parent = function (method_name, argument_list) {
      return acquire.apply(parent_gadget, [gadget_instance, method_name,
                                           argument_list]);
    };
  }

  /////////////////////////////////////////////////////////////////
  // RenderJSEmbeddedGadget
  /////////////////////////////////////////////////////////////////
  // Class inheritance
  function RenderJSEmbeddedGadget() {
    if (!(this instanceof RenderJSEmbeddedGadget)) {
      return new RenderJSEmbeddedGadget();
    }
    RenderJSGadget.call(this);
  }
  RenderJSEmbeddedGadget.__ready_list = RenderJSGadget.__ready_list.slice();
  RenderJSEmbeddedGadget.__service_list =
    RenderJSGadget.__service_list.slice();
  RenderJSEmbeddedGadget.ready =
    RenderJSGadget.ready;
  RenderJSEmbeddedGadget.setState =
    RenderJSGadget.setState;
  RenderJSEmbeddedGadget.onStateChange =
    RenderJSGadget.onStateChange;
  RenderJSEmbeddedGadget.declareService =
    RenderJSGadget.declareService;
  RenderJSEmbeddedGadget.onEvent =
    RenderJSGadget.onEvent;
  RenderJSEmbeddedGadget.onLoop =
    RenderJSGadget.onLoop;
  RenderJSEmbeddedGadget.prototype = new RenderJSGadget();
  RenderJSEmbeddedGadget.prototype.constructor = RenderJSEmbeddedGadget;

  /////////////////////////////////////////////////////////////////
  // privateDeclarePublicGadget
  /////////////////////////////////////////////////////////////////
  function privateDeclarePublicGadget(url, options, parent_gadget) {

    return new RSVP.Queue()
      .push(function () {
        return renderJS.declareGadgetKlass(url)
          // gadget loading should not be interrupted
          // if not, gadget's definition will not be complete
          //.then will return another promise
          //so loading_klass_promise can't be cancel
          .then(function (result) {
            return result;
          });
      })
      // Get the gadget class and instanciate it
      .push(function (Klass) {
        if (options.element === undefined) {
          options.element = document.createElement("div");
        }
        var i,
          gadget_instance,
          template_node_list = Klass.__template_element.body.childNodes,
          fragment = document.createDocumentFragment();
        gadget_instance = new Klass();
        gadget_instance.element = options.element;
        gadget_instance.state = {};
        for (i = 0; i < template_node_list.length; i += 1) {
          fragment.appendChild(
            template_node_list[i].cloneNode(true)
          );
        }
        gadget_instance.element.appendChild(fragment);
        setAqParent(gadget_instance, parent_gadget);
        return gadget_instance;
      });
  }

  /////////////////////////////////////////////////////////////////
  // RenderJSIframeGadget
  /////////////////////////////////////////////////////////////////
  function RenderJSIframeGadget() {
    if (!(this instanceof RenderJSIframeGadget)) {
      return new RenderJSIframeGadget();
    }
    RenderJSGadget.call(this);
  }
  RenderJSIframeGadget.__ready_list = RenderJSGadget.__ready_list.slice();
  RenderJSIframeGadget.ready =
    RenderJSGadget.ready;
  RenderJSIframeGadget.setState =
    RenderJSGadget.setState;
  RenderJSIframeGadget.onStateChange =
    RenderJSGadget.onStateChange;
  RenderJSIframeGadget.__service_list = RenderJSGadget.__service_list.slice();
  RenderJSIframeGadget.declareService =
    RenderJSGadget.declareService;
  RenderJSIframeGadget.onEvent =
    RenderJSGadget.onEvent;
  RenderJSIframeGadget.onLoop =
    RenderJSGadget.onLoop;
  RenderJSIframeGadget.prototype = new RenderJSGadget();
  RenderJSIframeGadget.prototype.constructor = RenderJSIframeGadget;

  /////////////////////////////////////////////////////////////////
  // privateDeclareIframeGadget
  /////////////////////////////////////////////////////////////////
  function privateDeclareIframeGadget(url, options, parent_gadget) {
    var gadget_instance,
      iframe,
      iframe_loading_deferred = RSVP.defer();
    if (options.element === undefined) {
      throw new Error("DOM element is required to create Iframe Gadget " +
                      url);
    }

    // Check if the element is attached to the DOM
    if (!document.contains(options.element)) {
      throw new Error("The parent element is not attached to the DOM for " +
                      url);
    }

    gadget_instance = new RenderJSIframeGadget();
    setAqParent(gadget_instance, parent_gadget);
    iframe = document.createElement("iframe");
    iframe.addEventListener('error', function (error) {
      iframe_loading_deferred.reject(error);
    });
    iframe.addEventListener('load', function () {
      return RSVP.timeout(5000)
        .fail(function () {
          iframe_loading_deferred.reject(
            new Error('Timeout while loading: ' + url)
          );
        });
    });
//    gadget_instance.element.setAttribute("seamless", "seamless");
    iframe.setAttribute("src", url);
    gadget_instance.__path = url;
    gadget_instance.element = options.element;
    gadget_instance.state = {};
    // Attach it to the DOM
    options.element.appendChild(iframe);

    // XXX Manage unbind when deleting the gadget

    // Create the communication channel with the iframe
    gadget_instance.__chan = Channel.build({
      window: iframe.contentWindow,
      // origin: (new URL(url, window.location)).origin,
      origin: '*',
      scope: "renderJS"
    });

    // Create new method from the declareMethod call inside the iframe
    gadget_instance.__chan.bind("declareMethod",
                                function (trans, method_name) {
        gadget_instance[method_name] = function () {
          var argument_list = arguments,
            wait_promise = new RSVP.Promise(function (resolve, reject) {
              gadget_instance.__chan.call({
                method: "methodCall",
                params: [
                  method_name,
                  Array.prototype.slice.call(argument_list, 0)],
                success: resolve,
                error: reject
              });
            });
          return new RSVP.Queue()
            .push(function () {
              return wait_promise;
            });
        };
        return "OK";
      });

    // Wait for the iframe to be loaded before continuing
    gadget_instance.__chan.bind("ready", function (trans) {
      iframe_loading_deferred.resolve(gadget_instance);
      return "OK";
    });
    gadget_instance.__chan.bind("failed", function (trans, params) {
      iframe_loading_deferred.reject(params);
      return "OK";
    });
    gadget_instance.__chan.bind("acquire", function (trans, params) {
      gadget_instance.__aq_parent.apply(gadget_instance, params)
        .then(function (g) {
          trans.complete(g);
        }).fail(function (e) {
          trans.error(e.toString());
        });
      trans.delayReturn(true);
    });

    return iframe_loading_deferred.promise;
  }

  /////////////////////////////////////////////////////////////////
  // privateDeclareDataUrlGadget
  /////////////////////////////////////////////////////////////////
  function privateDeclareDataUrlGadget(url, options, parent_gadget) {

    return new RSVP.Queue()
      .push(function () {
        return ajax(url);
      })
      .push(function (xhr) {
        // Insert a "base" element, in order to resolve all relative links
        // which could get broken with a data url
        var doc = (new DOMParser()).parseFromString(xhr.responseText,
                                                    'text/html'),
          base = doc.createElement('base'),
          blob;
        base.href = url;
        doc.head.insertBefore(base, doc.head.firstChild);
        blob = new Blob([doc.documentElement.outerHTML],
                        {type: "text/html;charset=UTF-8"});
        return readBlobAsDataURL(blob);
      })
      .push(function (data_url) {
        return privateDeclareIframeGadget(data_url, options, parent_gadget);
      });
  }

  /////////////////////////////////////////////////////////////////
  // RenderJSGadget.declareGadget
  /////////////////////////////////////////////////////////////////
  RenderJSGadget
    .declareMethod('declareGadget', function (url, options) {
      var parent_gadget = this;

      if (options === undefined) {
        options = {};
      }
      if (options.sandbox === undefined) {
        options.sandbox = "public";
      }

      // transform url to absolute url if it is relative
      url = renderJS.getAbsoluteURL(url, this.__path);

      return new RSVP.Queue()
        .push(function () {
          var method;
          if (options.sandbox === "public") {
            method = privateDeclarePublicGadget;
          } else if (options.sandbox === "iframe") {
            method = privateDeclareIframeGadget;
          } else if (options.sandbox === "dataurl") {
            method = privateDeclareDataUrlGadget;
          } else {
            throw new Error("Unsupported sandbox options '" +
                            options.sandbox + "'");
          }
          return method(url, options, parent_gadget);
        })
        // Set the HTML context
        .push(function (gadget_instance) {
          var i,
            scope,
            queue = new RSVP.Queue();
          // Trigger calling of all ready callback
          function ready_wrapper() {
            return gadget_instance;
          }
          function ready_executable_wrapper(fct) {
            return function () {
              return fct.call(gadget_instance, gadget_instance);
            };
          }
          for (i = 0; i < gadget_instance.constructor.__ready_list.length;
               i += 1) {
            // Put a timeout?
            queue.push(ready_executable_wrapper(
              gadget_instance.constructor.__ready_list[i]
            ));
            // Always return the gadget instance after ready function
            queue.push(ready_wrapper);
          }

          // Store local reference to the gadget instance
          scope = options.scope;
          if (scope === undefined) {
            scope = 'RJS_' + scope_increment;
            scope_increment += 1;
            while (parent_gadget.__sub_gadget_dict.hasOwnProperty(scope)) {
              scope = 'RJS_' + scope_increment;
              scope_increment += 1;
            }
          }
          parent_gadget.__sub_gadget_dict[scope] = gadget_instance;
          gadget_instance.element.setAttribute("data-gadget-scope",
                                               scope);

          // Put some attribute to ease page layout comprehension
          gadget_instance.element.setAttribute("data-gadget-url", url);
          gadget_instance.element.setAttribute("data-gadget-sandbox",
                                               options.sandbox);
          gadget_instance.element._gadget = gadget_instance;

          if (document.contains(gadget_instance.element)) {
            // Put a timeout
            queue.push(startService);
          }
          // Always return the gadget instance after ready function
          queue.push(ready_wrapper);

          return queue;
        });
    })
    .declareMethod('getDeclaredGadget', function (gadget_scope) {
      if (!this.__sub_gadget_dict.hasOwnProperty(gadget_scope)) {
        throw new Error("Gadget scope '" + gadget_scope + "' is not known.");
      }
      return this.__sub_gadget_dict[gadget_scope];
    })
    .declareMethod('dropGadget', function (gadget_scope) {
      if (!this.__sub_gadget_dict.hasOwnProperty(gadget_scope)) {
        throw new Error("Gadget scope '" + gadget_scope + "' is not known.");
      }
      // http://perfectionkills.com/understanding-delete/
      delete this.__sub_gadget_dict[gadget_scope];
    });

  /////////////////////////////////////////////////////////////////
  // renderJS selector
  /////////////////////////////////////////////////////////////////
  renderJS = function (selector) {
    var result;
    if (selector === window) {
      // window is the 'this' value when loading a javascript file
      // In this case, use the current loading gadget constructor
      result = gadget_loading_klass_list[0];
    }
    if (result === undefined) {
      throw new Error("Unknown selector '" + selector + "'");
    }
    return result;
  };

  /////////////////////////////////////////////////////////////////
  // renderJS.AcquisitionError
  /////////////////////////////////////////////////////////////////
  renderJS.AcquisitionError = function (message) {
    this.name = "AcquisitionError";
    if ((message !== undefined) && (typeof message !== "string")) {
      throw new TypeError('You must pass a string.');
    }
    this.message = message || "Acquisition failed";
  };
  renderJS.AcquisitionError.prototype = new Error();
  renderJS.AcquisitionError.prototype.constructor =
    renderJS.AcquisitionError;

  /////////////////////////////////////////////////////////////////
  // renderJS.getAbsoluteURL
  /////////////////////////////////////////////////////////////////
  renderJS.getAbsoluteURL = function (url, base_url) {
    if (base_url && url) {
      return new URL(url, base_url).href;
    }
    return url;
  };

  /////////////////////////////////////////////////////////////////
  // renderJS.declareJS
  /////////////////////////////////////////////////////////////////
  renderJS.declareJS = function (url, container, pop) {
    // https://www.html5rocks.com/en/tutorials/speed/script-loading/
    // Prevent infinite recursion if loading render.js
    // more than once
    var result;
    if (javascript_registration_dict.hasOwnProperty(url)) {
      result = RSVP.resolve();
    } else {
      javascript_registration_dict[url] = null;
      result = new RSVP.Promise(function (resolve, reject) {
        var newScript;
        newScript = document.createElement('script');
        newScript.async = false;
        newScript.type = 'text/javascript';
        newScript.onload = function () {
          if (pop === true) {
            // Drop the current loading klass info used by selector
            gadget_loading_klass_list.shift();
          }
          resolve();
        };
        newScript.onerror = function (e) {
          if (pop === true) {
            // Drop the current loading klass info used by selector
            gadget_loading_klass_list.shift();
          }
          reject(e);
        };
        newScript.src = url;
        container.appendChild(newScript);
      });
    }
    return result;
  };

  /////////////////////////////////////////////////////////////////
  // renderJS.declareCSS
  /////////////////////////////////////////////////////////////////
  renderJS.declareCSS = function (url, container) {
    // https://github.com/furf/jquery-getCSS/blob/master/jquery.getCSS.js
    // No way to cleanly check if a css has been loaded
    // So, always resolve the promise...
    // http://requirejs.org/docs/faq-advanced.html#css
    var result;
    if (stylesheet_registration_dict.hasOwnProperty(url)) {
      result = RSVP.resolve();
    } else {
      result = new RSVP.Promise(function (resolve, reject) {
        var link;
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = function () {
          stylesheet_registration_dict[url] = null;
          resolve();
        };
        link.onerror = function (e) {
          reject(e);
        };
        container.appendChild(link);
      });
    }
    return result;
  };

  /////////////////////////////////////////////////////////////////
  // renderJS.declareGadgetKlass
  /////////////////////////////////////////////////////////////////

  function parse(xhr, url) {
    var tmp_constructor,
      key,
      parsed_html;
    // Class inheritance
    tmp_constructor = function () {
      RenderJSGadget.call(this);
    };
    tmp_constructor.__ready_list = RenderJSGadget.__ready_list.slice();
    tmp_constructor.__service_list = RenderJSGadget.__service_list.slice();
    tmp_constructor.declareMethod =
      RenderJSGadget.declareMethod;
    tmp_constructor.declareJob =
      RenderJSGadget.declareJob;
    tmp_constructor.declareAcquiredMethod =
      RenderJSGadget.declareAcquiredMethod;
    tmp_constructor.allowPublicAcquisition =
      RenderJSGadget.allowPublicAcquisition;
    tmp_constructor.ready =
      RenderJSGadget.ready;
    tmp_constructor.setState =
      RenderJSGadget.setState;
    tmp_constructor.onStateChange =
      RenderJSGadget.onStateChange;
    tmp_constructor.declareService =
      RenderJSGadget.declareService;
    tmp_constructor.onEvent =
      RenderJSGadget.onEvent;
    tmp_constructor.onLoop =
      RenderJSGadget.onLoop;
    tmp_constructor.prototype = new RenderJSGadget();
    tmp_constructor.prototype.constructor = tmp_constructor;
    tmp_constructor.prototype.__path = url;
    tmp_constructor.prototype.__acquired_method_dict = {};
    // https://developer.mozilla.org/en-US/docs/HTML_in_XMLHttpRequest
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
    // https://developer.mozilla.org/en-US/docs/Code_snippets/HTML_to_DOM
    tmp_constructor.__template_element =
      (new DOMParser()).parseFromString(xhr.responseText, "text/html");
    parsed_html = renderJS.parseGadgetHTMLDocument(
      tmp_constructor.__template_element,
      url
    );
    for (key in parsed_html) {
      if (parsed_html.hasOwnProperty(key)) {
        tmp_constructor.prototype['__' + key] = parsed_html[key];
      }
    }
    return tmp_constructor;
  }

  renderJS.declareGadgetKlass = function (url) {
    if (gadget_model_defer_dict.hasOwnProperty(url)) {
      // Return klass object if it already exists
      return gadget_model_defer_dict[url].promise;
    }

    var tmp_constructor,
      defer = RSVP.defer();

    gadget_model_defer_dict[url] = defer;

    // Fetch the HTML page and parse it
    return new RSVP.Queue()
      .push(function () {
        return ajax(url);
      })
      .push(function (result) {
        tmp_constructor = parse(result, url);
        var fragment = document.createDocumentFragment(),
          promise_list = [],
          i,
          js_list = tmp_constructor.prototype.__required_js_list,
          css_list = tmp_constructor.prototype.__required_css_list;
        // Load JS
        if (js_list.length) {
          gadget_loading_klass_list.push(tmp_constructor);
          for (i = 0; i < js_list.length - 1; i += 1) {
            promise_list.push(renderJS.declareJS(js_list[i], fragment));
          }
          promise_list.push(renderJS.declareJS(js_list[i], fragment, true));
        }
        // Load CSS
        for (i = 0; i < css_list.length; i += 1) {
          promise_list.push(renderJS.declareCSS(css_list[i], fragment));
        }
        document.head.appendChild(fragment);
        return RSVP.all(promise_list);
      })
      .push(function () {
        defer.resolve(tmp_constructor);
        return tmp_constructor;
      })
      .push(undefined, function (e) {
        // Drop the current loading klass info used by selector
        // even in case of error
        defer.reject(e);
        throw e;
      });
  };

  /////////////////////////////////////////////////////////////////
  // renderJS.clearGadgetKlassList
  /////////////////////////////////////////////////////////////////
  // For test purpose only
  renderJS.clearGadgetKlassList = function () {
    gadget_model_defer_dict = {};
    javascript_registration_dict = {};
    stylesheet_registration_dict = {};
  };

  /////////////////////////////////////////////////////////////////
  // renderJS.parseGadgetHTMLDocument
  /////////////////////////////////////////////////////////////////
  renderJS.parseGadgetHTMLDocument = function (document_element, url) {
    var settings = {
        title: "",
        interface_list: [],
        required_css_list: [],
        required_js_list: []
      },
      i,
      element;

    if (!url || !isAbsoluteOrDataURL.test(url)) {
      throw new Error("The url should be absolute: " + url);
    }

    if (document_element.nodeType === 9) {
      settings.title = document_element.title;

      if (document_element.head !== null) {
        for (i = 0; i < document_element.head.children.length; i += 1) {
          element = document_element.head.children[i];
          if (element.href !== null) {
            // XXX Manage relative URL during extraction of URLs
            // element.href returns absolute URL in firefox but "" in chrome;
            if (element.rel === "stylesheet") {
              settings.required_css_list.push(
                renderJS.getAbsoluteURL(element.getAttribute("href"), url)
              );
            } else if (element.nodeName === "SCRIPT" &&
                       (element.type === "text/javascript" ||
                        !element.type)) {
              settings.required_js_list.push(
                renderJS.getAbsoluteURL(element.getAttribute("src"), url)
              );
            } else if (element.rel ===
                       "http://www.renderjs.org/rel/interface") {
              settings.interface_list.push(
                renderJS.getAbsoluteURL(element.getAttribute("href"), url)
              );
            }
          }
        }
      }
    } else {
      throw new Error("The first parameter should be an HTMLDocument");
    }
    return settings;
  };

  /////////////////////////////////////////////////////////////////
  // global
  /////////////////////////////////////////////////////////////////
  window.rJS = window.renderJS = renderJS;
  window.__RenderJSGadget = RenderJSGadget;
  window.__RenderJSEmbeddedGadget = RenderJSEmbeddedGadget;
  window.__RenderJSIframeGadget = RenderJSIframeGadget;

  ///////////////////////////////////////////////////
  // Bootstrap process. Register the self gadget.
  ///////////////////////////////////////////////////

  // Detect when all JS dependencies have been loaded
  all_dependency_loaded_deferred = new RSVP.defer();
  // Manually initializes the self gadget if the DOMContentLoaded event
  // is triggered before everything was ready.
  // (For instance, the HTML-tag for the self gadget gets inserted after
  //  page load)
  renderJS.manualBootstrap = function () {
    all_dependency_loaded_deferred.resolve();
  };
  document.addEventListener('DOMContentLoaded',
                            all_dependency_loaded_deferred.resolve, false);

  function configureMutationObserver(TmpConstructor, url, root_gadget) {
    // XXX HTML properties can only be set when the DOM is fully loaded
    var settings = renderJS.parseGadgetHTMLDocument(document, url),
      j,
      key,
      fragment = document.createDocumentFragment();
    for (key in settings) {
      if (settings.hasOwnProperty(key)) {
        TmpConstructor.prototype['__' + key] = settings[key];
      }
    }
    TmpConstructor.__template_element = document.createElement("div");
    root_gadget.element = document.body;
    root_gadget.state = {};
    for (j = 0; j < root_gadget.element.childNodes.length; j += 1) {
      fragment.appendChild(
        root_gadget.element.childNodes[j].cloneNode(true)
      );
    }
    TmpConstructor.__template_element.appendChild(fragment);
    return RSVP.all([root_gadget.getRequiredJSList(),
              root_gadget.getRequiredCSSList()])
      .then(function (all_list) {
        var i,
          js_list = all_list[0],
          css_list = all_list[1];
        for (i = 0; i < js_list.length; i += 1) {
          javascript_registration_dict[js_list[i]] = null;
        }
        for (i = 0; i < css_list.length; i += 1) {
          stylesheet_registration_dict[css_list[i]] = null;
        }
        gadget_loading_klass_list.shift();
      }).then(function () {

        // select the target node
        var target = document.querySelector('body'),
          // create an observer instance
          observer = new MutationObserver(function (mutations) {
            var i, k, len, len2, node, added_list;
            mutations.forEach(function (mutation) {
              if (mutation.type === 'childList') {

                len = mutation.removedNodes.length;
                for (i = 0; i < len; i += 1) {
                  node = mutation.removedNodes[i];
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.hasAttribute("data-gadget-url") &&
                        (node._gadget !== undefined)) {
                      createMonitor(node._gadget);
                    }
                    added_list =
                      node.querySelectorAll("[data-gadget-url]");
                    len2 = added_list.length;
                    for (k = 0; k < len2; k += 1) {
                      node = added_list[k];
                      if (node._gadget !== undefined) {
                        createMonitor(node._gadget);
                      }
                    }
                  }
                }

                len = mutation.addedNodes.length;
                for (i = 0; i < len; i += 1) {
                  node = mutation.addedNodes[i];
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.hasAttribute("data-gadget-url") &&
                        (node._gadget !== undefined)) {
                      if (document.contains(node)) {
                        startService(node._gadget);
                      }
                    }
                    added_list =
                      node.querySelectorAll("[data-gadget-url]");
                    len2 = added_list.length;
                    for (k = 0; k < len2; k += 1) {
                      node = added_list[k];
                      if (document.contains(node)) {
                        if (node._gadget !== undefined) {
                          startService(node._gadget);
                        }
                      }
                    }
                  }
                }

              }
            });
          }),
          // configuration of the observer:
          config = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
          };

        // pass in the target node, as well as the observer options
        observer.observe(target, config);

        return root_gadget;
      });
  }

  function createLastAcquisitionGadget() {
    var last_acquisition_gadget = new RenderJSGadget();
    last_acquisition_gadget.__acquired_method_dict = {
      reportServiceError: function (param_list) {
        letsCrash(param_list[0]);
      }
    };
    // Stop acquisition on the last acquisition gadget
    // Do not put this on the klass, as their could be multiple instances
    last_acquisition_gadget.__aq_parent = function (method_name) {
      throw new renderJS.AcquisitionError(
        "No gadget provides " + method_name
      );
    };
    return last_acquisition_gadget;
  }

/*
  function notifyAllMethodToParent() {
    ;
  }
*/

  function createLoadingGadget(url) {
    var TmpConstructor,
      root_gadget,
      embedded_channel,
      notifyDeclareMethod,
      declare_method_list_waiting,
      loading_result,
      channel_defer,
      real_result_list;
      // gadget_failed = false,
      // connection_ready = false;

    // Create the gadget class for the current url
    if (gadget_model_defer_dict.hasOwnProperty(url)) {
      throw new Error("bootstrap should not be called twice");
    }

    // Create the root gadget instance and put it in the loading stack
    TmpConstructor = RenderJSEmbeddedGadget;
    TmpConstructor.__ready_list = RenderJSGadget.__ready_list.slice();
    TmpConstructor.__service_list = RenderJSGadget.__service_list.slice();
    TmpConstructor.prototype.__path = url;
    root_gadget = new RenderJSEmbeddedGadget();
    setAqParent(root_gadget, createLastAcquisitionGadget());

    declare_method_list_waiting = [
      "getInterfaceList",
      "getRequiredCSSList",
      "getRequiredJSList",
      "getPath",
      "getTitle"
    ];

    // Inform parent gadget about declareMethod calls here.
    notifyDeclareMethod = function (name) {
      declare_method_list_waiting.push(name);
    };

    real_result_list = [TmpConstructor, root_gadget, embedded_channel,
                        declare_method_list_waiting];
    if (window.self === window.top) {
      loading_result = real_result_list;
    } else {
      channel_defer = RSVP.defer();
      loading_result = RSVP.any([
        channel_defer.promise,
        new RSVP.Queue()
          .push(function () {
            // Expect the channel to parent to be usable after 1 second
            // If not, consider the gadget as the root
            // Drop all iframe channel communication
            return RSVP.delay(1000);
          })
          .push(function () {
            real_result_list[2] = undefined;
            return real_result_list;
          })
      ]);
      // Create the communication channel
      embedded_channel = Channel.build({
        window: window.parent,
        origin: "*",
        scope: "renderJS",
        onReady: function () {
          var k,
            len;
          // Channel is ready, so now declare all methods
          notifyDeclareMethod = function (name) {
            declare_method_list_waiting.push(
              new RSVP.Promise(function (resolve, reject) {
                embedded_channel.call({
                  method: "declareMethod",
                  params: name,
                  success: resolve,
                  error: reject
                });
              })
            );
          };

          len = declare_method_list_waiting.length;
          for (k = 0; k < len; k += 1) {
            notifyDeclareMethod(declare_method_list_waiting[k]);
          }

          channel_defer.resolve(real_result_list);
        }
      });
      real_result_list[2] = embedded_channel;
    }

    // Surcharge declareMethod to inform parent window
    TmpConstructor.declareMethod = function (name, callback) {
      var result = RenderJSGadget.declareMethod.apply(
          this,
          [name, callback]
        );
      notifyDeclareMethod(name);
      return result;
    };

    TmpConstructor.declareService =
      RenderJSGadget.declareService;
    TmpConstructor.declareJob =
      RenderJSGadget.declareJob;
    TmpConstructor.onEvent =
      RenderJSGadget.onEvent;
    TmpConstructor.onLoop =
      RenderJSGadget.onLoop;
    TmpConstructor.declareAcquiredMethod =
      RenderJSGadget.declareAcquiredMethod;
    TmpConstructor.allowPublicAcquisition =
      RenderJSGadget.allowPublicAcquisition;

    TmpConstructor.prototype.__acquired_method_dict = {};
    gadget_loading_klass_list.push(TmpConstructor);

    return loading_result;
  }

  function triggerReadyList(TmpConstructor, root_gadget) {
    // XXX Probably duplicated
    var i,
      ready_queue = new RSVP.Queue();

    function ready_wrapper() {
      return root_gadget;
    }
    function ready_executable_wrapper(fct) {
      return function (g) {
        return fct.call(g, g);
      };
    }
    TmpConstructor.ready(function () {
      return startService(this);
    });

    ready_queue.push(ready_wrapper);
    for (i = 0; i < TmpConstructor.__ready_list.length; i += 1) {
      // Put a timeout?
      ready_queue
        .push(ready_executable_wrapper(TmpConstructor.__ready_list[i]))
        // Always return the gadget instance after ready function
        .push(ready_wrapper);
    }
    return ready_queue;
  }

  function finishAqParentConfiguration(TmpConstructor, root_gadget,
                                       embedded_channel) {
    // Define __aq_parent to inform parent window
    root_gadget.__aq_parent =
      TmpConstructor.prototype.__aq_parent = function (method_name,
                                                       argument_list,
                                                       time_out) {
        return new RSVP.Promise(function (resolve, reject) {
          embedded_channel.call({
            method: "acquire",
            params: [
              method_name,
              argument_list
            ],
            success: function (s) {
              resolve(s);
            },
            error: function (e) {
              reject(e);
            },
            timeout: time_out
          });
        });
      };

    // bind calls to renderJS method on the instance
    embedded_channel.bind("methodCall", function (trans, v) {
      root_gadget[v[0]].apply(root_gadget, v[1])
        .push(function (g) {
          trans.complete(g);
        }, function (e) {
          trans.error(e.toString());
        });
      trans.delayReturn(true);
    });
  }

  function bootstrap(url) {
    // Create the loading gadget
    var wait_for_gadget_loaded = createLoadingGadget(url),
      TmpConstructor,
      root_gadget,
      embedded_channel,
      declare_method_list_waiting;

    return new RSVP.Queue()
      .push(function () {
        // Wait for the loading gadget to be created
        return wait_for_gadget_loaded;
      })
      .push(function (result_list) {
        TmpConstructor = result_list[0];
        root_gadget = result_list[1];
        embedded_channel = result_list[2];
        declare_method_list_waiting = result_list[3];
        // Wait for all the gadget dependencies to be loaded
        return all_dependency_loaded_deferred.promise;
      })
      .push(function () {
        // Wait for all methods to be correctly declared
        return RSVP.all(declare_method_list_waiting);
      })
      .push(function (result_list) {
        if (embedded_channel !== undefined) {
          finishAqParentConfiguration(TmpConstructor, root_gadget,
                                      embedded_channel);
        }
        // Check all DOM modifications to correctly start/stop services
        return configureMutationObserver(TmpConstructor, url, root_gadget);
      })
      .push(function () {
        // Trigger all ready functions
        return triggerReadyList(TmpConstructor, root_gadget);
      })
      .push(function () {
        if (embedded_channel !== undefined) {
          embedded_channel.notify({method: "ready"});
        }
      })
      .push(undefined, function (e) {
        letsCrash(e);
        if (embedded_channel !== undefined) {
          embedded_channel.notify({method: "failed", params: e.toString()});
        }
        throw e;
      });
  }

  bootstrap(
    removeHash(window.location.href)
  );

}(document, window, RSVP, DOMParser, Channel, MutationObserver, Node,
  FileReader, Blob, navigator, Event, URL));