(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function SingleThread() {
    this.worker = {};
    this.self = {postMessage: messenger(this.worker)};
    this.worker.postMessage = messenger(this.self);
}

function messenger(destination) {
    return function postMessage(data) {
        setTimeout(function tick() {
            if (typeof destination.onmessage === 'function') {
                destination.onmessage({data: data});
            }
        }, 0);
    }
}

module.exports = SingleThread;

},{}],2:[function(require,module,exports){
var vdom = require('virtual-dom');
var serialize = require('vdom-serialized-patch/serialize');
var pathnameMatch = require('pathname-match');
var hashMatch = require('hash-match');

var msg = require('./msg');
var domEvent = require('./domEvent');
var localStorage = require('./localStorage');

function appThread(self, app, options) {
    var currentVDOM, view, router, initialHREF;

    function render(state) {
        var nextVDOM, diff, patch;

        nextVDOM = view(state);
        diff = vdom.diff(currentVDOM, nextVDOM);
        patch = serialize(diff);
        currentVDOM = nextVDOM;

        domEvent.cycleHandlers();

        self.postMessage({
            type: 'DOM_PATCH',
            data: patch
        });
    }

    function init(_view, model, _router) {
        if (view) {
            throw new Error('tried to initialise app more than once');
        }

        view = _view;
        currentVDOM = vdom.h('div');
        render(model());
        model(render);

        router = _router;
        onLocation(initialHREF);
    }

    function onReady(data) {
        initialHREF = data;
        app(init);
    }

    function onLocation(data) {
        var route, splitLocation;

        if (typeof router !== 'function') {
            return;
        }

        if (!options.isHashRouter) {

            route = pathnameMatch(data);

            if (!route.length) {

                route = '/';
            }

        } else {

            splitLocation = data.split('#');

            if (splitLocation.length > 1) {

                splitLocation.shift();

                route = hashMatch('#'.concat(splitLocation.join('#')));
            }

        }

        if (route) {
            router(route);
        }

    }

    function onDomEvent(data) {
        var handler = domEvent.getHandler(data.handlerKey);

        if (handler != null) {
            handler(data);
        }
    }

    function onLocalStorage(data) {
        var handler = localStorage.getHandler(data.handlerKey);

        if (handler != null) {
            handler(data);
        }
    }

    function handleMessageType(type, data) {
        switch (type) {
            case 'READY':
                onReady(data);
                break;
            case 'LOCATION':
                onLocation(data);
                break;
            case 'DOM_EVENT':
                onDomEvent(data);
                break;
            case 'LOCAL_STORAGE':
                onLocalStorage(data);
                break;
            default:
                break;
        }
    }

    self.onmessage = msg(handleMessageType, options.isDebug && 'USER');

    return self.postMessage.bind(self);
}

module.exports = appThread;

},{"./domEvent":5,"./localStorage":8,"./msg":10,"hash-match":37,"pathname-match":48,"vdom-serialized-patch/serialize":66,"virtual-dom":70}],3:[function(require,module,exports){
var extend = require('xtend/mutable');
var csjs = require('csjs');
var slice = Array.prototype.slice;

var queue = [];
var post;

function init(_post) {
    if (typeof post !== 'function') {
        post = _post;
        flush();
    }
}

function flush() {
    if (typeof post === 'function') {
        while (queue.length) {
            post({type: 'CSS', data: queue.shift()});
        }
    }
}

function css() {
    var args, styles;

    args = slice.call(arguments);
    styles = csjs.apply(null, args);

    queue.push(csjs.getCss(styles));

    flush();

    return styles;
}

module.exports = extend(css, {
    init: init // [1]
});

// [1] TODO: These should not part of the public API

},{"csjs":23,"xtend/mutable":105}],4:[function(require,module,exports){
var extend = require('xtend/mutable');
var vdom = require('virtual-dom');
var hyperstyles = require('hyperstyles');
var hyperx = require('hyperx');

function domFor(styles) {
    return hyperx(hyperstyles(vdom.h, styles));
}

var dom = hyperx(vdom.h);

module.exports = extend(dom, {
    domFor: domFor
});

},{"hyperstyles":38,"hyperx":40,"virtual-dom":70,"xtend/mutable":105}],5:[function(require,module,exports){
var extend = require('xtend/mutable');

var domEventNames = require('./domEventNames');

var nextHandlerKey = 0;
var currentHandlers = {};
var nextHandlers = {};

function domEvent(model, fn, customData) {
    var handlerKey;

    handlerKey = nextHandlerKey++;

    nextHandlers[handlerKey] = function handle(data) {
        fn(model, {
            event: data.eventData,
            form: data.formData,
            custom: customData
        });
    };

    return handlerKey;
}

function forModel(fn, customData) {
    return domEvent(this, fn, customData);
}

function getHandler(handlerKey) {
    return currentHandlers[handlerKey];
}

function cycleHandlers() {
    currentHandlers = nextHandlers;
    nextHandlers = {};
    nextHandlerKey = 0;
}

module.exports = extend(domEvent, {
    domEventNames: domEventNames,
    forModel: forModel,
    getHandler: getHandler, // [1]
    cycleHandlers: cycleHandlers // [1]
});

// [1] TODO: These should not part of the public API

},{"./domEventNames":6,"xtend/mutable":105}],6:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/Events

module.exports = [

    // CSSOM
    'animationend',
	'animationiteration',
	'animationstart',
	'transitionend',

    // DOM
	'abort',
	'beforeinput',
	'blur',
	'click',
	'compositionend',
	'compositionstart',
	'compositionupdate',
	'dblclick',
	'error',
	'focus',
	'focusin',
	'focusout',
	'input',
	'keydown',
	'keyup',
	'load',
	'mousedown',
	'mouseenter',
	'mouseleave',
	'mousemove',
	'mouseout',
	'mouseover',
	'mouseup',
	'resize',
	'scroll',
	'select',
	'unload',
	'wheel',

    // HTML DOM
	'DOMContentLoaded',
	// 'abort',
	'afterprint',
	'afterscriptexecute',
	'autocomplete',
	'autocompleteerror',
	'beforeprint',
	'beforescriptexecute',
	'beforeunload',
	// 'blur',
	'cancel',
	'canplay',
	'canplaythrough',
	'change',
	// 'click',
	'close',
	'connect',
	'contextmenu',
	'durationchange',
	'emptied',
	'error',
	// 'focus',
	'hashchange',
	// 'input',
	'invalid',
	'languagechange',
	// 'load',
	'loadeddata',
	'loadedmetadata',
	'loadend',
	'loadstart',
	'message',
	'offline',
	'online',
	'open',
	'pagehide',
	'pageshow',
	'play',
	'playing',
	'popstate',
	'progress',
	'readystatechange',
	'reset',
	'seeked',
	'seeking',
	'select',
	'show',
	'sort',
	'stalled',
	'storage',
	'submit',
	'suspend',
	'timeupdate',
	'toggle',
	// 'unload',
	'volumechange',
	'waiting',

    // HTML Drag and Drop API
    'drag',
	'dragend',
	'dragenter',
	'dragexit',
	'dragleave',
	'dragover',
	'dragstart',
	'drop',

    // Pointer
	'gotpointercapture',
	'lostpointercapture',
	'pointercancel',
	'pointerdown',
	'pointerenter',
	'pointerleave',
	'pointermove',
	'pointerout',
	'pointerover',
	'pointerup',

    // Selection
	'selectionchange',
	'selectstart',

    // Touch
	'touchcancel',
	'touchend',
	'touchmove',
	'touchstart'

];

},{}],7:[function(require,module,exports){
(function (global){
var extend = require('xtend/mutable');

var userThread = require('./userThread');
var appThread = require('./appThread');
var SingleThread = require('./SingleThread');

var dom = require('./dom');
var domEvent = require('./domEvent');

var model = require('./model');
var localStorage = require('./localStorage');
var css = require('./css');
var router = require('./router');

var WORKER_ENABLED = !!(global === global.window && global.URL && global.Worker);
var IN_WORKER_CONTEXT = !!(global === global.self && global.location);
var PATHNAME = WORKER_ENABLED && (function getPathname() {
    var scripts, script;

    scripts = global.document.getElementsByTagName('script');
    script = scripts[scripts.length - 1].src;

    return new global.URL(script).pathname;
})();

function duet(app, selector, options) {
    var singleThread;

    function initAPI(postMessageToUser) {
        localStorage.init(postMessageToUser);
        css.init(postMessageToUser);
    }

    options = (typeof options == 'object' && options !== null && options) || {};

    if (!options.forceSingleThread) {

        if (WORKER_ENABLED) {
            return userThread(new global.Worker(PATHNAME), selector, options);
        }

        if (IN_WORKER_CONTEXT) {
            return initAPI(appThread(global.self, app, options));
        }

    }

    singleThread = new SingleThread();
    userThread(singleThread.worker, selector, options);
    initAPI(appThread(singleThread.self, app, options));
}

module.exports = extend(duet, {

    dom: dom,
    domFor: dom.domFor,

    domEvent: domEvent,
    event: domEvent, // alias
    ev: domEvent, // alias

    model: model,
    modelFor: model.modelFor,
    struct: model.struct,
    varhash: model.varhash,
    value: model.value,

    localStorage: localStorage,

    css: css,

    router: router
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kdWV0L2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kL211dGFibGUnKTtcblxudmFyIHVzZXJUaHJlYWQgPSByZXF1aXJlKCcuL3VzZXJUaHJlYWQnKTtcbnZhciBhcHBUaHJlYWQgPSByZXF1aXJlKCcuL2FwcFRocmVhZCcpO1xudmFyIFNpbmdsZVRocmVhZCA9IHJlcXVpcmUoJy4vU2luZ2xlVGhyZWFkJyk7XG5cbnZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xudmFyIGRvbUV2ZW50ID0gcmVxdWlyZSgnLi9kb21FdmVudCcpO1xuXG52YXIgbW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyk7XG52YXIgbG9jYWxTdG9yYWdlID0gcmVxdWlyZSgnLi9sb2NhbFN0b3JhZ2UnKTtcbnZhciBjc3MgPSByZXF1aXJlKCcuL2NzcycpO1xudmFyIHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5cbnZhciBXT1JLRVJfRU5BQkxFRCA9ICEhKGdsb2JhbCA9PT0gZ2xvYmFsLndpbmRvdyAmJiBnbG9iYWwuVVJMICYmIGdsb2JhbC5Xb3JrZXIpO1xudmFyIElOX1dPUktFUl9DT05URVhUID0gISEoZ2xvYmFsID09PSBnbG9iYWwuc2VsZiAmJiBnbG9iYWwubG9jYXRpb24pO1xudmFyIFBBVEhOQU1FID0gV09SS0VSX0VOQUJMRUQgJiYgKGZ1bmN0aW9uIGdldFBhdGhuYW1lKCkge1xuICAgIHZhciBzY3JpcHRzLCBzY3JpcHQ7XG5cbiAgICBzY3JpcHRzID0gZ2xvYmFsLmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgICBzY3JpcHQgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjO1xuXG4gICAgcmV0dXJuIG5ldyBnbG9iYWwuVVJMKHNjcmlwdCkucGF0aG5hbWU7XG59KSgpO1xuXG5mdW5jdGlvbiBkdWV0KGFwcCwgc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2luZ2xlVGhyZWFkO1xuXG4gICAgZnVuY3Rpb24gaW5pdEFQSShwb3N0TWVzc2FnZVRvVXNlcikge1xuICAgICAgICBsb2NhbFN0b3JhZ2UuaW5pdChwb3N0TWVzc2FnZVRvVXNlcik7XG4gICAgICAgIGNzcy5pbml0KHBvc3RNZXNzYWdlVG9Vc2VyKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gKHR5cGVvZiBvcHRpb25zID09ICdvYmplY3QnICYmIG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucykgfHwge307XG5cbiAgICBpZiAoIW9wdGlvbnMuZm9yY2VTaW5nbGVUaHJlYWQpIHtcblxuICAgICAgICBpZiAoV09SS0VSX0VOQUJMRUQpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyVGhyZWFkKG5ldyBnbG9iYWwuV29ya2VyKFBBVEhOQU1FKSwgc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKElOX1dPUktFUl9DT05URVhUKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdEFQSShhcHBUaHJlYWQoZ2xvYmFsLnNlbGYsIGFwcCwgb3B0aW9ucykpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBzaW5nbGVUaHJlYWQgPSBuZXcgU2luZ2xlVGhyZWFkKCk7XG4gICAgdXNlclRocmVhZChzaW5nbGVUaHJlYWQud29ya2VyLCBzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgaW5pdEFQSShhcHBUaHJlYWQoc2luZ2xlVGhyZWFkLnNlbGYsIGFwcCwgb3B0aW9ucykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChkdWV0LCB7XG5cbiAgICBkb206IGRvbSxcbiAgICBkb21Gb3I6IGRvbS5kb21Gb3IsXG5cbiAgICBkb21FdmVudDogZG9tRXZlbnQsXG4gICAgZXZlbnQ6IGRvbUV2ZW50LCAvLyBhbGlhc1xuICAgIGV2OiBkb21FdmVudCwgLy8gYWxpYXNcblxuICAgIG1vZGVsOiBtb2RlbCxcbiAgICBtb2RlbEZvcjogbW9kZWwubW9kZWxGb3IsXG4gICAgc3RydWN0OiBtb2RlbC5zdHJ1Y3QsXG4gICAgdmFyaGFzaDogbW9kZWwudmFyaGFzaCxcbiAgICB2YWx1ZTogbW9kZWwudmFsdWUsXG5cbiAgICBsb2NhbFN0b3JhZ2U6IGxvY2FsU3RvcmFnZSxcblxuICAgIGNzczogY3NzLFxuXG4gICAgcm91dGVyOiByb3V0ZXJcbn0pO1xuIl19
},{"./SingleThread":1,"./appThread":2,"./css":3,"./dom":4,"./domEvent":5,"./localStorage":8,"./model":9,"./router":11,"./userThread":12,"xtend/mutable":105}],8:[function(require,module,exports){
var extend = require('xtend/mutable');

var nextHandlerKey = 0;
var handlers = {};
var queue = [];
var post;

function init(_post) {
    if (typeof post !== 'function') {
        post = _post;
        flush();
    }
}

function flush() {
    if (typeof post === 'function') {
        while (queue.length) {
            post({type: 'LOCAL_STORAGE', data: queue.shift()});
        }
    }
}

function getHandler(handlerKey) {
    return handlers[handlerKey];
}

function localStorage(key, valueOrFn) {
    var handlerKey;

    if (typeof valueOrFn === 'function') {

        handlerKey = nextHandlerKey++;

        handlers[handlerKey] = function handle(data) {
            valueOrFn(data.value);
        };

        queue.push({handlerKey: handlerKey, key: key});

        flush();

        return handlerKey;

    }

    queue.push({key: key, value: valueOrFn});

    flush();
}


module.exports = extend(localStorage, {
    init: init, // [1]
    getHandler: getHandler // [1]
});

// [1] TODO: These should not part of the public API

},{"xtend/mutable":105}],9:[function(require,module,exports){
var extend = require('xtend/mutable');
var struct = require('observ-struct');
var varhash = require('observ-varhash');
var value = require('observ');

var forModel = require('./domEvent').forModel;

var models = [];

function modelFor(state) {
    var model;

    if (state.__MODEL_REFERENCE__ == null) {
        throw new Error('__MODEL_REFERENCE__ not found on state');
    }

    model = models[state.__MODEL_REFERENCE__];

    if (model == null) {
        throw new Error('__MODEL_REFERENCE__ is invalid');
    }

    return model;
}


function model(state) {
    var model;

    state = typeof state === 'object' ? state : {};

    if (state.__MODEL_REFERENCE__ != null) {
        throw new Error('"__MODEL_REFERENCE__" is a reserved key');
    }

    state.__MODEL_REFERENCE__ = models.length;

    if (state.event != null) {
        throw new Error('"event" is a reserved key');
    }

    model = struct(state);

    model.event = forModel;
    model.ev = forModel; // alias

    models.push(model);

    return model;
}

module.exports = extend(model, {
    struct: struct,
    varhash: varhash,
    value: value,
    modelFor: modelFor
});

},{"./domEvent":5,"observ":47,"observ-struct":43,"observ-varhash":45,"xtend/mutable":105}],10:[function(require,module,exports){
var console = require('console');

function msg(handleMessageType, logSource) {
    return function handleMessage(event) {
        if (logSource) {
            console.debug(logSource + '::' + event.data.type, event.data.data);
        }

        return handleMessageType(event.data.type, event.data.data);
    };
}

module.exports = msg;

},{"console":15}],11:[function(require,module,exports){
module.exports = require('wayfarer');

},{"wayfarer":101}],12:[function(require,module,exports){
var insertCSS = require('insert-css');
var getFormData = require('form-data-set/element');
var patch = require('vdom-serialized-patch/patch');
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var msg = require('./msg');
var domEventNames = require('./domEvent').domEventNames;

function userThread(worker, selector, options) {
    var container, target, domEventListeners;

    function domEventHandler(eventName, event) {
        var handlerKey, eventData, formData;

        function propsReducer(props, key) {
            var value = event[key];

            if (key.charAt(0) === key.charAt(0).toLowerCase() && (
                typeof value === 'number' ||
                typeof value === 'string' ||
                typeof value === 'boolean')) {

                props[key] = value;
            }

            return props;
        }

        handlerKey = event.target.dataset[eventName];

        if (typeof handlerKey === 'string') {

            eventData = Object.keys(event.constructor.prototype).reduce(propsReducer, {});

            formData = getFormData(event.target);

            if (!(new RegExp('\\b' + eventName + '\\b')).test(event.target.dataset['default'])) {
                event.preventDefault();
            }

            worker.postMessage({
                type: 'DOM_EVENT',
                data: {
                    handlerKey: handlerKey,
                    eventName: eventName,
                    eventData: eventData,
                    formData: formData
                }
            });
        }
    }

    function listenTo(domEventName) {
        domEventListeners[domEventName] = domEventHandler.bind(null, domEventName);
        target.addEventListener(domEventName, domEventListeners[domEventName]);
    }

    function unlistenTo(domEventName) {
        target.removeEventListener(domEventName, domEventListeners[domEventName]);
        delete domEventListeners[domEventName];
    }

    function updateDom(data) {
        var activeDomEventNames, activeElement;

        function updateActiveDomEventsForDataAttributes(el) {
            Object.keys(el.dataset)
            .forEach(updateActiveDomEventsForDataAttribute);
        }

        function updateActiveDomEventsForDataAttribute(key) {
            if (domEventNames.indexOf(key) > -1 && activeDomEventNames.indexOf(key) < 0) {
                activeDomEventNames.push(key);
            }
        }

        function updateDomEventBinding(domEventName) {
            if (activeDomEventNames.indexOf(domEventName) > -1 && domEventListeners[domEventName] == null) {
                listenTo(domEventName);
            } else if (activeDomEventNames.indexOf(domEventName) < 0 && domEventListeners[domEventName] != null) {
                unlistenTo(domEventName);
            }
        }

        // 1) Patch DOM

        patch(target, data);

        setTimeout(function () {

            // 2) Update DOM event bindings

            activeDomEventNames = [];

            concat.apply(target, target.querySelectorAll('*'))
            .forEach(updateActiveDomEventsForDataAttributes);

            domEventNames.forEach(updateDomEventBinding);

            // 3) Focus element if needed

            activeElement = target.querySelector('[autofocus]');

            if (activeElement != null && document.activeElement !== activeElement) {
                activeElement.focus();
            }

        }, 0);
    }

    function onDomPatch(data) {
        window.requestAnimationFrame(updateDom.bind(null, data));
    }

    function onLocalStorage(data) {
        if (!data.value) {
            return worker.postMessage({
                type: 'LOCAL_STORAGE',
                data: {
                    handlerKey: data.handlerKey,
                    value: localStorage.getItem(data.key)
                }
            });
        }

        localStorage.setItem(data.key, data.value);
    }

    function onCSS(data) {
        insertCSS(data);
    }

    function handleMessageType(type, data) {
        switch (type) {
            case 'DOM_PATCH':
                onDomPatch(data);
                break;
            case 'LOCAL_STORAGE':
                onLocalStorage(data);
                break;
            case 'CSS':
                onCSS(data);
                break;
            default:
                break;
        }
    }

    container = document.querySelector(selector);

    if (container == null) {
        throw new Error('selector did not match an element');
    }

    target = document.createElement('div');
    container.insertBefore(target, container.firstChild);

    domEventListeners = {};

    window.onclick = function onClick(event) {
        if (event.target.localName !== 'a' ||
            event.target.href === undefined ||
            window.location.host !== event.target.host) {
            return;
        }

        event.preventDefault();

        worker.postMessage({
            type: 'LOCATION',
            data: event.target.href
        });

        window.history.pushState({}, null, event.target.href)
    }

    window.onpopstate = function onPopState() {
        worker.postMessage({
            type: 'LOCATION',
            data: document.location.href
        });
    }

    worker.onmessage = msg(handleMessageType, options.isDebug && 'APP');

    worker.postMessage({
        type: 'READY',
        data: document.location.href
    });
}

module.exports = userThread;

},{"./domEvent":5,"./msg":10,"form-data-set/element":34,"insert-css":42,"vdom-serialized-patch/patch":65}],13:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":20}],14:[function(require,module,exports){

},{}],15:[function(require,module,exports){
(function (global){
/*global window, global*/
var util = require("util")
var assert = require("assert")
var now = require("date-now")

var slice = Array.prototype.slice
var console
var times = {}

if (typeof global !== "undefined" && global.console) {
    console = global.console
} else if (typeof window !== "undefined" && window.console) {
    console = window.console
} else {
    console = {}
}

var functions = [
    [log, "log"],
    [info, "info"],
    [warn, "warn"],
    [error, "error"],
    [time, "time"],
    [timeEnd, "timeEnd"],
    [trace, "trace"],
    [dir, "dir"],
    [consoleAssert, "assert"]
]

for (var i = 0; i < functions.length; i++) {
    var tuple = functions[i]
    var f = tuple[0]
    var name = tuple[1]

    if (!console[name]) {
        console[name] = f
    }
}

module.exports = console

function log() {}

function info() {
    console.log.apply(console, arguments)
}

function warn() {
    console.log.apply(console, arguments)
}

function error() {
    console.warn.apply(console, arguments)
}

function time(label) {
    times[label] = now()
}

function timeEnd(label) {
    var time = times[label]
    if (!time) {
        throw new Error("No such label: " + label)
    }

    var duration = now() - time
    console.log(label + ": " + duration + "ms")
}

function trace() {
    var err = new Error()
    err.name = "Trace"
    err.message = util.format.apply(null, arguments)
    console.error(err.stack)
}

function dir(object) {
    console.log(util.inspect(object) + "\n")
}

function consoleAssert(expression) {
    if (!expression) {
        var arr = slice.call(arguments, 1)
        assert.ok(false, util.format.apply(null, arr))
    }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jb25zb2xlLWJyb3dzZXJpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgd2luZG93LCBnbG9iYWwqL1xudmFyIHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKVxudmFyIGFzc2VydCA9IHJlcXVpcmUoXCJhc3NlcnRcIilcbnZhciBub3cgPSByZXF1aXJlKFwiZGF0ZS1ub3dcIilcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG52YXIgY29uc29sZVxudmFyIHRpbWVzID0ge31cblxuaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNvbnNvbGUpIHtcbiAgICBjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGVcbn0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cuY29uc29sZSkge1xuICAgIGNvbnNvbGUgPSB3aW5kb3cuY29uc29sZVxufSBlbHNlIHtcbiAgICBjb25zb2xlID0ge31cbn1cblxudmFyIGZ1bmN0aW9ucyA9IFtcbiAgICBbbG9nLCBcImxvZ1wiXSxcbiAgICBbaW5mbywgXCJpbmZvXCJdLFxuICAgIFt3YXJuLCBcIndhcm5cIl0sXG4gICAgW2Vycm9yLCBcImVycm9yXCJdLFxuICAgIFt0aW1lLCBcInRpbWVcIl0sXG4gICAgW3RpbWVFbmQsIFwidGltZUVuZFwiXSxcbiAgICBbdHJhY2UsIFwidHJhY2VcIl0sXG4gICAgW2RpciwgXCJkaXJcIl0sXG4gICAgW2NvbnNvbGVBc3NlcnQsIFwiYXNzZXJ0XCJdXG5dXG5cbmZvciAodmFyIGkgPSAwOyBpIDwgZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1cGxlID0gZnVuY3Rpb25zW2ldXG4gICAgdmFyIGYgPSB0dXBsZVswXVxuICAgIHZhciBuYW1lID0gdHVwbGVbMV1cblxuICAgIGlmICghY29uc29sZVtuYW1lXSkge1xuICAgICAgICBjb25zb2xlW25hbWVdID0gZlxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zb2xlXG5cbmZ1bmN0aW9uIGxvZygpIHt9XG5cbmZ1bmN0aW9uIGluZm8oKSB7XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuXG5mdW5jdGlvbiB3YXJuKCkge1xuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbn1cblxuZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbn1cblxuZnVuY3Rpb24gdGltZShsYWJlbCkge1xuICAgIHRpbWVzW2xhYmVsXSA9IG5vdygpXG59XG5cbmZ1bmN0aW9uIHRpbWVFbmQobGFiZWwpIHtcbiAgICB2YXIgdGltZSA9IHRpbWVzW2xhYmVsXVxuICAgIGlmICghdGltZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzdWNoIGxhYmVsOiBcIiArIGxhYmVsKVxuICAgIH1cblxuICAgIHZhciBkdXJhdGlvbiA9IG5vdygpIC0gdGltZVxuICAgIGNvbnNvbGUubG9nKGxhYmVsICsgXCI6IFwiICsgZHVyYXRpb24gKyBcIm1zXCIpXG59XG5cbmZ1bmN0aW9uIHRyYWNlKCkge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKVxuICAgIGVyci5uYW1lID0gXCJUcmFjZVwiXG4gICAgZXJyLm1lc3NhZ2UgPSB1dGlsLmZvcm1hdC5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spXG59XG5cbmZ1bmN0aW9uIGRpcihvYmplY3QpIHtcbiAgICBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3Qob2JqZWN0KSArIFwiXFxuXCIpXG59XG5cbmZ1bmN0aW9uIGNvbnNvbGVBc3NlcnQoZXhwcmVzc2lvbikge1xuICAgIGlmICghZXhwcmVzc2lvbikge1xuICAgICAgICB2YXIgYXJyID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgICAgIGFzc2VydC5vayhmYWxzZSwgdXRpbC5mb3JtYXQuYXBwbHkobnVsbCwgYXJyKSlcbiAgICB9XG59XG4iXX0=
},{"assert":13,"date-now":16,"util":20}],16:[function(require,module,exports){
module.exports = now

function now() {
    return new Date().getTime()
}

},{}],17:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],18:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],19:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],20:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiJdfQ==
},{"./support/isBuffer":19,"_process":18,"inherits":17}],21:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":27}],22:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":30}],23:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":21,"./get-css":22}],24:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],25:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":26}],26:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],27:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var isComposition = require('./composition').isComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');

module.exports = function csjsHandler(strings) {
  var values = Array.prototype.slice.call(arguments, 1);
  var css = joiner(strings, values.map(selectorize));

  var ignores = values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});

  var scoped = scopify(css, ignores);
  var hashes = Object.assign({}, scoped.classes, scoped.keyframes);
  var extracted = extractExtends(scoped.css, hashes);

  var localClasses = without(scoped.classes, ignores);
  var localKeyframes = without(scoped.keyframes, ignores);
  var compositions = extracted.compositions;

  var exports = buildExports(localClasses, localKeyframes, compositions);

  return Object.defineProperty(exports, cssKey, {
    enumerable: false,
    configurable: false,
    writeable: false,
    value: extracted.css
  });
};

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":25,"./composition":26,"./css-extract-extends":28,"./css-key":29,"./scopeify":33}],28:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /(.*?)(\s+?)(extends\s+?)((?:.|\n)*?){(?:(?:.|\n)*?)}/g;

module.exports = function extractExtends(css, hashed) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + acc.css.slice(index + len);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":26}],29:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],30:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":29}],31:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],32:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":24,"./hash-string":31}],33:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name) {
      return preamble + animations[name];
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./scoped-name":32}],34:[function(require,module,exports){
var walk = require('dom-walk')

var FormData = require('./index.js')

module.exports = getFormData

function buildElems(rootElem) {
    var hash = {}
    if (rootElem.name) {
	hash[rootElem.name] = rootElem
    }

    walk(rootElem, function (child) {
        if (child.name) {
            hash[child.name] = child
        }
    })


    return hash
}

function getFormData(rootElem) {
    var elements = buildElems(rootElem)

    return FormData(elements)
}

},{"./index.js":35,"dom-walk":36}],35:[function(require,module,exports){
/*jshint maxcomplexity: 10*/

module.exports = FormData

//TODO: Massive spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#constructing-form-data-set
function FormData(elements) {
    return Object.keys(elements).reduce(function (acc, key) {
        var elem = elements[key]

        acc[key] = valueOfElement(elem)

        return acc
    }, {})
}

function valueOfElement(elem) {
    if (typeof elem === "function") {
        return elem()
    } else if (containsRadio(elem)) {
        var elems = toList(elem)
        var checked = elems.filter(function (elem) {
            return elem.checked
        })[0] || null

        return checked ? checked.value : null
    } else if (Array.isArray(elem)) {
        return elem.map(valueOfElement).filter(filterNull)
    } else if (elem.tagName === undefined && elem.nodeType === undefined) {
        return FormData(elem)
    } else if (elem.tagName === "INPUT" && isChecked(elem)) {
        if (elem.hasAttribute("value")) {
            return elem.checked ? elem.value : null
        } else {
            return elem.checked
        }
    } else if (elem.tagName === "INPUT") {
        return elem.value
    } else if (elem.tagName === "TEXTAREA") {
        return elem.value
    } else if (elem.tagName === "SELECT") {
        return elem.value
    }
}

function isChecked(elem) {
    return elem.type === "checkbox" || elem.type === "radio"
}

function containsRadio(value) {
    if (value.tagName || value.nodeType) {
        return false
    }

    var elems = toList(value)

    return elems.some(function (elem) {
        return elem.tagName === "INPUT" && elem.type === "radio"
    })
}

function toList(value) {
    if (Array.isArray(value)) {
        return value
    }

    return Object.keys(value).map(prop, value)
}

function prop(x) {
    return this[x]
}

function filterNull(val) {
    return val !== null
}

},{}],36:[function(require,module,exports){
var slice = Array.prototype.slice

module.exports = iterativelyWalk

function iterativelyWalk(nodes, cb) {
    if (!('length' in nodes)) {
        nodes = [nodes]
    }

    nodes = slice.call(nodes)

    while(nodes.length) {
        var node = nodes.shift(),
            ret = cb(node)

        if (ret) {
            return ret
        }

        if (node.childNodes && node.childNodes.length) {
            nodes = slice.call(node.childNodes).concat(nodes)
        }
    }
}

},{}],37:[function(require,module,exports){
module.exports = function hashMatch (hash, prefix) {
  var pre = prefix || '/';
  if (hash.length === 0) return pre;
  hash = hash.replace('#', '');
  hash = hash.replace(/\/$/, '')
  if (hash.indexOf('/') != 0) hash = '/' + hash;
  if (pre == '/') return hash;
  else return hash.replace(pre, '');
}

},{}],38:[function(require,module,exports){
var transform = require('./transform');

var slice = Array.prototype.slice;

function hyperstyles(hyperscript, styles) {
    if (typeof hyperscript !== 'function') {
        throw new Error('Expected a hyperscript-compatible function as the first argument.');
    }

    if (typeof styles !== 'object') {
        return function partial(styles) {
            if (typeof styles !== 'object') {
                throw new Error('Expected a CSS Modules-compatible styles object as the first argument.');
            }

            return wrap(hyperscript, styles);
        }
    }

    return wrap(hyperscript, styles)
}

function wrap(hyperscript, styles) {
    return function wrapped() {
        return hyperscript.apply(null, transform(styles, slice.call(arguments)));
    }
}

module.exports = hyperstyles;

},{"./transform":39}],39:[function(require,module,exports){
var toString = Object.prototype.toString;
var isString = function (x) {
    return typeof x === 'string';
};
var isArray =  Array.isArray || function (x) {
    return toString.call(x) == '[object Array]';
};
var isObject = function (x) {
    return x != null && typeof x === 'object' && !isArray(x);
};
var toClass = function (selector) {
    return selector.substring(1, selector.length);
};
function isNotProps(x) {
    return x == null ||
        isString(x) ||
        typeof x === 'number' ||
        typeof x === 'function' ||
        isArray(x) ||
        (isObject(x) && (
            // ReactElement
            x.hasOwnProperty('$$typeof') ||
            // VirtualNode
            (x.hasOwnProperty('type') && x.hasOwnProperty('version')) ||
            // Node
            (typeof Node !== 'undefined' && x instanceof Node)
        ));
}

var CLASS_SELECTOR = /\.([a-zA-Z0-9\u007F-\uFFFF_:-]+)/g;

function transform(styles, args) {
    var styleNames, parseMatch;

    styleNames = [];

    if (isString(args[0])) {
        parseMatch = args[0].match(CLASS_SELECTOR);

        if (parseMatch) {
            styleNames.push.apply(styleNames, parseMatch.map(toClass));
            args[0] = args[0].replace(CLASS_SELECTOR, '');
        }
    }

    if (isObject(args[1]) && args[1].styleName) {
        styleNames.push.apply(styleNames, args[1].styleName.split(' '));
        delete args[1].styleName;
    }

    if (styleNames.length) {

        if (isNotProps(args[1])) {
            if (args[1] == null) {
                if (args[2] == null) {
                    args.splice(1, 0, {});
                } else {
                    args[1] = {};
                }
            } else {
                args.splice(1, 0, {});
            }
        }

        args[1].className = styleNames.reduce(function (className, styleName) {
            if (!styles[styleName]) {
                throw new Error('"' + styleName + '" doesn\'t exist');
            }

            className += (className.length ? ' ' : '') + styles[styleName];

            return className;
        }, args[1].className || '');

    }

    while (args.length && args[args.length - 1] === undefined) {
        args.pop();
    }

    return args;
}

module.exports = transform;

},{}],40:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12

module.exports = function (h, opts) {
  h = attrToProp(h)
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else cur[1][key] = concat(cur[1][key], parts[i][1])
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else cur[1][key] = concat(cur[1][key], parts[i][2])
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state)) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === TEXT) {
          reg += c
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[\w-]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_BREAK],[ATTR_VALUE,reg])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":41}],41:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],42:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;

    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }

    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],43:[function(require,module,exports){
var Observ = require("observ")
var extend = require("xtend")

var blackList = {
    "length": "Clashes with `Function.prototype.length`.\n",
    "name": "Clashes with `Function.prototype.name`.\n",
    "_diff": "_diff is reserved key of observ-struct.\n",
    "_type": "_type is reserved key of observ-struct.\n",
    "_version": "_version is reserved key of observ-struct.\n"
}
var NO_TRANSACTION = {}

function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

/* ObservStruct := (Object<String, Observ<T>>) =>
    Object<String, Observ<T>> &
        Observ<Object<String, T> & {
            _diff: Object<String, Any>
        }>

*/
module.exports = ObservStruct

function ObservStruct(struct) {
    var keys = Object.keys(struct)

    var initialState = {}
    var currentTransaction = NO_TRANSACTION
    var nestedTransaction = NO_TRANSACTION

    keys.forEach(function (key) {
        if (blackList.hasOwnProperty(key)) {
            throw new Error("cannot create an observ-struct " +
                "with a key named '" + key + "'.\n" +
                blackList[key]);
        }

        var observ = struct[key]
        initialState[key] = typeof observ === "function" ?
            observ() : observ
    })

    var obs = Observ(initialState)
    keys.forEach(function (key) {
        var observ = struct[key]
        obs[key] = observ

        if (typeof observ === "function") {
            observ(function (value) {
                if (nestedTransaction === value) {
                    return
                }

                var state = extend(obs())
                state[key] = value
                var diff = {}
                diff[key] = value && value._diff ?
                    value._diff : value

                setNonEnumerable(state, "_diff", diff)
                currentTransaction = state
                obs.set(state)
                currentTransaction = NO_TRANSACTION
            })
        }
    })
    var _set = obs.set
    obs.set = function trackDiff(value) {
        if (currentTransaction === value) {
            return _set(value)
        }

        var newState = extend(value)
        setNonEnumerable(newState, "_diff", value)
        _set(newState)
    }

    obs(function (newState) {
        if (currentTransaction === newState) {
            return
        }

        keys.forEach(function (key) {
            var observ = struct[key]
            var newObservValue = newState[key]

            if (typeof observ === "function" &&
                observ() !== newObservValue
            ) {
                nestedTransaction = newObservValue
                observ.set(newState[key])
                nestedTransaction = NO_TRANSACTION
            }
        })
    })

    obs._type = "observ-struct"
    obs._version = "5"

    return obs
}

},{"observ":47,"xtend":44}],44:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],45:[function(require,module,exports){
var Observ = require('observ')
var extend = require('xtend')

var NO_TRANSACTION = {}

module.exports = ObservVarhash

function ObservVarhash (hash, createValue) {
  createValue = createValue || function (obj) { return obj }

  var initialState = {}
  var currentTransaction = NO_TRANSACTION
  var nestedTransaction = NO_TRANSACTION

  var obs = Observ(initialState)
  setNonEnumerable(obs, '_removeListeners', {})

  setNonEnumerable(obs, 'get', get.bind(obs))
  setNonEnumerable(obs, 'put', put.bind(obs))
  setNonEnumerable(obs, 'delete', del.bind(obs))

  for (var key in hash) {
    obs[key] = isFn(hash[key]) ? hash[key] : createValue(hash[key], key)

    if (isFn(obs[key])) {
      obs._removeListeners[key] = obs[key](watch(obs, key))
    }
  }

  var _set = obs.set

  obs.set = function trackDiff (value) {
    if (currentTransaction === value) {
      return _set(value)
    }

    var newState = extend(value)
    setNonEnumerable(newState, '_diff', value)

    _set(newState)
  }
  setNonEnumerable(obs, 'set', obs.set)

  var newState = {}
  for (key in hash) {
    var observ = obs[key]
    checkKey(key)
    newState[key] = isFn(observ) ? observ() : observ
  }
  obs.set(newState)

  obs(function (newState) {
    if (currentTransaction === newState) {
      return
    }

    for (var key in hash) {
      var observ = hash[key]
      var newObservValue = newState[key]

      if (isFn(observ) && observ() !== newState[key]) {
        nestedTransaction = newObservValue
        observ.set(newState[key])
        nestedTransaction = NO_TRANSACTION
      }
    }
  })

  function put (key, val) {
    checkKey(key)

    if (val === undefined) {
      throw new Error('cannot varhash.put(key, undefined).')
    }

    var observ = isFn(val) ? val : createValue(val, key)
    var state = extend(this())

    state[key] = isFn(observ) ? observ() : observ

    if (isFn(this._removeListeners[key])) {
      this._removeListeners[key]()
    }

    this._removeListeners[key] = isFn(observ)
      ? observ(watch(this, key)) : null

    setNonEnumerable(state, '_diff', diff(key, state[key]))

    this[key] = observ

    currentTransaction = state
    _set(state)
    currentTransaction = NO_TRANSACTION

    return this
  }

  function del (key) {
    var state = extend(this())
    if (isFn(this._removeListeners[key])) {
      this._removeListeners[key]()
    }

    delete this._removeListeners[key]
    delete state[key]
    delete this[key]

    setNonEnumerable(state, '_diff', diff(key, undefined))
    _set(state)

    return this
  }

  return obs

  // processing
  function watch (obs, key) {
    return function (value) {
      if (nestedTransaction === value) {
        return
      }

      var state = extend(obs())
      state[key] = value

      setNonEnumerable(state, '_diff', diff(key, value))

      currentTransaction = state
      obs.set(state)
      currentTransaction = NO_TRANSACTION
    }
  }
}

// access and mutate
function get (key) {
  return this[key]
}

function diff (key, value) {
  var obj = {}
  obj[key] = value && value._diff ? value._diff : value
  return obj
}

function isFn (obj) {
  return typeof obj === 'function'
}

function setNonEnumerable (object, key, value) {
  Object.defineProperty(object, key, {
    value: value,
    writable: true,
    configurable: true,
    enumerable: false
  })
}

// errors
var blacklist = {
  name: 'Clashes with `Function.prototype.name`.',
  get: 'get is a reserved key of observ-varhash method',
  put: 'put is a reserved key of observ-varhash method',
  'delete': 'delete is a reserved key of observ-varhash method',
  _diff: '_diff is a reserved key of observ-varhash method',
  _removeListeners: '_removeListeners is a reserved key of observ-varhash'
}

function checkKey (key) {
  if (!blacklist[key]) return
  throw new Error(
    'cannot create an observ-varhash with key `' + key + '`. ' + blacklist[key]
  )
}

},{"observ":47,"xtend":46}],46:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],47:[function(require,module,exports){
module.exports = Observable

function Observable(value) {
    var listeners = []
    value = value === undefined ? null : value

    observable.set = function (v) {
        value = v
        listeners.forEach(function (f) {
            f(v)
        })
    }

    return observable

    function observable(listener) {
        if (!listener) {
            return value
        }

        listeners.push(listener)

        return function remove() {
            listeners.splice(listeners.indexOf(listener), 1)
        }
    }
}

},{}],48:[function(require,module,exports){
const assert = require('assert')

module.exports = match

// get url path section from a url
// strip querystrings / hashes
// strip protocol
// strip hostname and port (both ip and route)
// str -> str
function match (route) {
  assert.equal(typeof route, 'string')

  return route.trim()
    .replace(/[\?|#].*$/, '')
    .replace(/^(?:https?\:)\/\//, '')
    .replace(/^(?:[\w+(?:-\w+)+.])+(?:[\:0-9]{4,5})?/, '')
    .replace(/\/$/, '')
}

},{"assert":13}],49:[function(require,module,exports){
var isObject = require('./isObject');
var isSoftSetHook = require('./isSoftSetHook');

module.exports = applyProperties;

function applyProperties(node, props, previous) {
  for (var propName in props) {
    var propValue = props[propName]

    if (propValue === undefined) {
      removeProperty(node, propName, previous);
    } else if (isSoftSetHook(propValue)) {
      removeProperty(node, propName, propValue, previous)
      node[propName] = propValue.value
    } else {
      if (isObject(propValue)) {
        patchObject(node, props, previous, propName, propValue);
      } else {
        node[propName] = propValue
      }
    }
  }
}

function removeProperty(node, propName, previous) {
  if (!previous) {
    return
  }
  var previousValue = previous[propName]

  if (propName === "attributes") {
    for (var attrName in previousValue) {
      node.removeAttribute(attrName)
    }
  } else if (propName === "style") {
    for (var i in previousValue) {
      node.style[i] = ""
    }
  } else if (typeof previousValue === "string") {
    node[propName] = ""
  } else {
    node[propName] = null
  }
}

function patchObject(node, props, previous, propName, propValue) {
  var previousValue = previous ? previous[propName] : undefined

  // Set attributes
  if (propName === "attributes") {
    for (var attrName in propValue) {
      var attrValue = propValue[attrName]

      if (attrValue === undefined) {
        node.removeAttribute(attrName)
      } else {
        node.setAttribute(attrName, attrValue)
      }
    }

    return
  }

  if (previousValue && isObject(previousValue) &&
    getPrototype(previousValue) !== getPrototype(propValue)) {
    node[propName] = propValue
    return
  }

  if (!isObject(node[propName])) {
    node[propName] = {}
  }

  var replacer = propName === "style" ? "" : undefined

  for (var k in propValue) {
    var value = propValue[k]
    node[propName][k] = (value === undefined) ? replacer : value
  }
}

function getPrototype(value) {
  // getPrototypeOf shim for older browsers
  /* istanbul ignore else */
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else {
    return value.__proto__ || value.constructor.prototype;
  }
}

},{"./isObject":53,"./isSoftSetHook":54}],50:[function(require,module,exports){
var applyProperties = require("./applyProperties")
var isVText = require('./isVText');
var isVNode = require('./isVNode');

module.exports = createElement;

function createElement(vnode) {
  var doc = document;

  if (isVText(vnode)) {
    return doc.createTextNode(vnode.x) // 'x' means 'text'
  } else if (!isVNode(vnode)) {
    return null
  }

  var node = (!vnode.n) ? // 'n' === 'namespace'
    doc.createElement(vnode.tn) : // 'tn' === 'tagName'
    doc.createElementNS(vnode.n, vnode.tn)

  var props = vnode.p // 'p' === 'properties'
  applyProperties(node, props)

  var children = vnode.c // 'c' === 'children'

  if (children) {
    for (var i = 0; i < children.length; i++) {
      var childNode = createElement(children[i])
      if (childNode) {
        node.appendChild(childNode)
      }
    }
  }

  return node
}

},{"./applyProperties":49,"./isVNode":55,"./isVText":56}],51:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
  if (!indices || indices.length === 0) {
    return {}
  } else {
    indices.sort(ascending)
    return recurse(rootNode, tree, indices, nodes, 0)
  }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
  nodes = nodes || {}


  if (rootNode) {
    if (indexInRange(indices, rootIndex, rootIndex)) {
      nodes[rootIndex] = rootNode
    }

    var treeChildren = tree[0];

    if (treeChildren) {

      var childNodes = rootNode.childNodes

      for (var i = 0; i < treeChildren.length; i++) {
        rootIndex += 1

        var vChild = treeChildren[i] || noChild
        var nextIndex = rootIndex + (vChild[1] || 0)

        // skip recursion down the tree if there are no nodes down here
        if (indexInRange(indices, rootIndex, nextIndex)) {
          recurse(childNodes[i], vChild, indices, nodes, rootIndex)
        }

        rootIndex = nextIndex
      }
    }
  }

  return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
  if (indices.length === 0) {
    return false
  }

  var minIndex = 0
  var maxIndex = indices.length - 1
  var currentIndex
  var currentItem

  while (minIndex <= maxIndex) {
    currentIndex = ((maxIndex + minIndex) / 2) >> 0
    currentItem = indices[currentIndex]

    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right
    } else if (currentItem < left) {
      minIndex = currentIndex + 1
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1
    } else {
      return true
    }
  }

  return false;
}

function ascending(a, b) {
  return a > b ? 1 : -1
}

},{}],52:[function(require,module,exports){
var patchRecursive = require('./patchRecursive');

function patch(rootNode, patches) {
  return patchRecursive(rootNode, patches);
}

module.exports = patch;
},{"./patchRecursive":58}],53:[function(require,module,exports){
'use strict';

module.exports = function isObject(x) {
  return typeof x === "object" && x !== null;
};
},{}],54:[function(require,module,exports){
module.exports = isSoftSetHook

function isSoftSetHook(x) {
  return x && typeof x === 'object' && typeof x.value !== 'undefined';
}

},{}],55:[function(require,module,exports){
module.exports = isVirtualNode

var types = require('./types');

function isVirtualNode(x) {
  return x && x.t === types.VirtualNode
}

},{"./types":59}],56:[function(require,module,exports){
module.exports = isVirtualText

var types = require('./types');

function isVirtualText(x) {
  return x && x.t === types.VirtualTree;
}

},{"./types":59}],57:[function(require,module,exports){
var applyProperties = require("./applyProperties");
var patchTypes = require("../patchTypes");
var render = require('./createElement');

module.exports = applyPatch

function applyPatch(vpatch, domNode) {
  var type = vpatch[0]
  var patch = vpatch[1]
  var vNode = vpatch[2]

  switch (type) {
    case patchTypes.REMOVE:
      return removeNode(domNode)
    case patchTypes.INSERT:
      return insertNode(domNode, patch)
    case patchTypes.VTEXT:
      return stringPatch(domNode, patch)
    case patchTypes.VNODE:
      return vNodePatch(domNode, patch)
    case patchTypes.ORDER:
      reorderChildren(domNode, patch)
      return domNode
    case patchTypes.PROPS:
      applyProperties(domNode, patch, vNode.p) // 'p' === 'properties'
      return domNode
    default:
      return domNode
  }
}

function removeNode(domNode) {
  var parentNode = domNode.parentNode

  if (parentNode) {
    parentNode.removeChild(domNode)
  }

  return null
}

function insertNode(parentNode, vNode) {
  var newNode = render(vNode)

  if (parentNode) {
    parentNode.appendChild(newNode)
  }

  return parentNode
}

function stringPatch(domNode, vText) {
  var newNode

  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.x) // 'x' means 'text'
    newNode = domNode
  } else {
    var parentNode = domNode.parentNode
    newNode = render(vText)

    if (parentNode && newNode !== domNode) {
      parentNode.replaceChild(newNode, domNode)
    }
  }

  return newNode
}

function vNodePatch(domNode, vNode) {
  var parentNode = domNode.parentNode
  var newNode = render(vNode)

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  return newNode
}

function reorderChildren(domNode, moves) {
  var childNodes = domNode.childNodes
  var keyMap = {}
  var node
  var remove
  var insert

  for (var i = 0; i < moves.removes.length; i++) {
    remove = moves.removes[i]
    node = childNodes[remove.from]
    if (remove.key) {
      keyMap[remove.key] = node
    }
    domNode.removeChild(node)
  }

  var length = childNodes.length
  for (var j = 0; j < moves.inserts.length; j++) {
    insert = moves.inserts[j]
    node = keyMap[insert.key]
    // this is the weirdest bug i've ever seen in webkit
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
  }
}

},{"../patchTypes":60,"./applyProperties":49,"./createElement":50}],58:[function(require,module,exports){
var domIndex = require("./domIndex")
var patchOp = require("./patchOp")

function patchRecursive(rootNode, patches) {
  var indices = patchIndices(patches)

  if (indices.length === 0) {
    return rootNode
  }

  var index = domIndex(rootNode, patches.a, indices)

  for (var i = 0; i < indices.length; i++) {
    var nodeIndex = indices[i]
    rootNode = applyPatch(rootNode,
      index[nodeIndex],
      patches[nodeIndex])
  }

  return rootNode
}

function applyPatch(rootNode, domNode, patchList) {
  if (!domNode) {
    return rootNode
  }

  var newNode

  for (var i = 0; i < patchList.length; i++) {
    newNode = patchOp(patchList[i], domNode)

    if (domNode === rootNode) {
      rootNode = newNode
    }
  }

  return rootNode
}

function patchIndices(patches) {
  var indices = []

  for (var key in patches) {
    if (key !== "a") {
      indices.push(Number(key))
    }
  }

  return indices
}


module.exports = patchRecursive;
},{"./domIndex":51,"./patchOp":57}],59:[function(require,module,exports){
// copied from vdom-as-json/types.js

module.exports = {
  VirtualTree: 1,
  VirtualPatch: 2,
  VirtualNode: 3,
  SoftSetHook: 4
};
},{}],60:[function(require,module,exports){
// original this was is-vpatch.js

module.exports = {
  NONE: 0,
  VTEXT: 1,
  VNODE: 2,
  WIDGET: 3,
  PROPS: 4,
  ORDER: 5,
  INSERT: 6,
  REMOVE: 7,
  THUNK: 8
};
},{}],61:[function(require,module,exports){
var patchTypes = require('../patchTypes');
var toJson = require('vdom-as-json/toJson');

// traverse the thing that the original patch structure called "a',
// i.e. the virtual tree representing the current node structure.
// this thing only really needs two properties - "children" and "count",
// so trim out everything else
function serializeCurrentNode(currentNode) {
  var children = currentNode.children;
  if (!children) {
    return null;
  }
  var len = children.length;
  var arr = new Array(len);
  var i = -1;
  while (++i < len) {
    arr[i] = serializeCurrentNode(children[i]);
  }
  if (currentNode.count) {
    return [arr, currentNode.count];
  } else {
    return [arr];
  }
}

function serializeVirtualPatchOrPatches(vPatch) {
  if (Array.isArray(vPatch)) {
    var len = vPatch.length;
    var res = new Array(len);
    var i = -1;
    while (++i < len) {
      res[i] = serializeVirtualPatch(vPatch[i]);
    }
    return res;
  }
  return [serializeVirtualPatch(vPatch)];
}

function serializeVirtualPatch(vPatch) {
  var type = vPatch.type;
  var res = [
    type,
    toJson(vPatch.patch)
  ];

  if (type === patchTypes.PROPS) {
    // this is the only time the vNode is needed
    res.push({p: vPatch.vNode.properties}); // 'p' === 'properties'
  }
  return res;
}

module.exports = function (patch) {
  var outputRootNode = serializeCurrentNode(patch.a);

  var res = {
    a: outputRootNode
  };

  for (var key in patch) {
    if (key !== 'a') {
      res[key] = serializeVirtualPatchOrPatches(patch[key]);
    }
  }

  return res;
};

},{"../patchTypes":60,"vdom-as-json/toJson":64}],62:[function(require,module,exports){
'use strict';

var types = require('./types');

var SoftSetHook =
  require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook');

function arrayToJson(arr) {
  var len = arr.length;
  var i = -1;
  var res = new Array(len);
  while (++i < len) {
    res[i] = toJson(arr[i]);
  }
  return res;
}

function plainObjectToJson(obj) {
  var res = {};
  /* jshint -W089 */
  /* this is fine; these objects are always plain */
  for (var key in obj) {
    var val = obj[key];
    res[key] = typeof val !== 'undefined' ? toJson(val) : val;
  }
  return res;
}

function virtualNodeToJson(obj) {
  var res = {
    // type
    t: types.VirtualNode,
    tn: obj.tagName
  };
  if (Object.keys(obj.properties).length) {
    res.p = plainObjectToJson(obj.properties);
  }
  if (obj.children.length) {
    res.c = arrayToJson(obj.children);
  }
  if (obj.key) {
    res.k = obj.key;
  }
  if (obj.namespace) {
    res.n = obj.namespace;
  }
  return res;
}

function virtualTextToJson(obj) {
  return {
    // type
    t: types.VirtualTree,
    // text
    x: obj.text
  };
}

function virtualPatchToJson(obj) {
  var res = {
    // type
    t: types.VirtualPatch,
    // patch type
    pt: obj.type
  };

  if (obj.vNode) {
    res.v = toJson(obj.vNode);
  }

  if (obj.patch) {
    res.p = toJson(obj.patch);
  }

  return res;
}

function softSetHookToJson(obj) {
  return {
    // type
    t: types.SoftSetHook,
    value: obj.value
  };
}

function objectToJson(obj) {
  if ('patch' in obj && typeof obj.type === 'number') {
    return virtualPatchToJson(obj);
  }
  if (obj.type === 'VirtualNode') {
    return virtualNodeToJson(obj);
  }
  if (obj.type === 'VirtualText') {
    return virtualTextToJson(obj);
  }
  if (obj instanceof SoftSetHook) {
    return softSetHookToJson(obj);
  }

  // plain object
  return plainObjectToJson(obj);
}

function toJson(obj) {

  var type = typeof obj;

  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      return obj;
  }

  // type === 'object'
  if (Array.isArray(obj)) {
    return arrayToJson(obj);
  }

  if (!obj) { // null
    return null;
  }

  return objectToJson(obj);
}

module.exports = toJson;
},{"./types":63,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook":86}],63:[function(require,module,exports){
module.exports = {
  VirtualTree: 1,
  VirtualPatch: 2,
  VirtualNode: 3,
  SoftSetHook: 4
};
},{}],64:[function(require,module,exports){
'use strict';

module.exports = require('./lib/toJson');
},{"./lib/toJson":62}],65:[function(require,module,exports){
module.exports = require('./lib/patch');

},{"./lib/patch":52}],66:[function(require,module,exports){
module.exports = require('./lib/serialize');

},{"./lib/serialize":61}],67:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":80}],68:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":100}],69:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":87}],70:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":67,"./diff.js":68,"./h.js":69,"./patch.js":78,"./vnode/vnode.js":96,"./vnode/vtext.js":98}],71:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],72:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":74}],73:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9ub2RlX21vZHVsZXMvZXYtc3RvcmUvbm9kZV9tb2R1bGVzL2luZGl2aWR1YWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLypnbG9iYWwgd2luZG93LCBnbG9iYWwqL1xuXG52YXIgcm9vdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID9cbiAgICB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/XG4gICAgZ2xvYmFsIDoge307XG5cbm1vZHVsZS5leHBvcnRzID0gSW5kaXZpZHVhbDtcblxuZnVuY3Rpb24gSW5kaXZpZHVhbChrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiByb290KSB7XG4gICAgICAgIHJldHVybiByb290W2tleV07XG4gICAgfVxuXG4gICAgcm9vdFtrZXldID0gdmFsdWU7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG4iXX0=
},{}],74:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":73}],75:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9ub2RlX21vZHVsZXMvZ2xvYmFsL2RvY3VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvcExldmVsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge31cbnZhciBtaW5Eb2MgPSByZXF1aXJlKCdtaW4tZG9jdW1lbnQnKTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50O1xufSBlbHNlIHtcbiAgICB2YXIgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddO1xuXG4gICAgaWYgKCFkb2NjeSkge1xuICAgICAgICBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J10gPSBtaW5Eb2M7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2NjeTtcbn1cbiJdfQ==
},{"min-document":14}],76:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],77:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],78:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":83}],79:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":91,"is-object":76}],80:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":89,"../vnode/is-vnode.js":92,"../vnode/is-vtext.js":93,"../vnode/is-widget.js":94,"./apply-properties":79,"global/document":75}],81:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],82:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":94,"../vnode/vpatch.js":97,"./apply-properties":79,"./update-widget":84}],83:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":80,"./dom-index":81,"./patch-op":82,"global/document":75,"x-is-array":77}],84:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":94}],85:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":72}],86:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],87:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":90,"../vnode/is-vhook":91,"../vnode/is-vnode":92,"../vnode/is-vtext":93,"../vnode/is-widget":94,"../vnode/vnode.js":96,"../vnode/vtext.js":98,"./hooks/ev-hook.js":85,"./hooks/soft-set-hook.js":86,"./parse-tag.js":88,"x-is-array":77}],88:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":71}],89:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":90,"./is-vnode":92,"./is-vtext":93,"./is-widget":94}],90:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],91:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],92:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":95}],93:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":95}],94:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],95:[function(require,module,exports){
module.exports = "2"

},{}],96:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":90,"./is-vhook":91,"./is-vnode":92,"./is-widget":94,"./version":95}],97:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":95}],98:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":95}],99:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":91,"is-object":76}],100:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":89,"../vnode/is-thunk":90,"../vnode/is-vnode":92,"../vnode/is-vtext":93,"../vnode/is-widget":94,"../vnode/vpatch":97,"./diff-props":99,"x-is-array":77}],101:[function(require,module,exports){
const assert = require('assert')
const sliced = require('sliced')
const trie = require('./trie')

module.exports = Wayfarer

// create a router
// str -> obj
function Wayfarer (dft) {
  if (!(this instanceof Wayfarer)) return new Wayfarer(dft)

  const _default = (dft || '').replace(/^\//, '')
  const _trie = trie()

  emit._trie = _trie
  emit.emit = emit
  emit.on = on
  emit._wayfarer = true

  return emit

  // define a route
  // (str, fn) -> obj
  function on (route, cb) {
    assert.equal(typeof route, 'string')
    assert.equal(typeof cb, 'function')

    route = route || '/'

    if (cb && cb._wayfarer && cb._trie) {
      _trie.mount(route, cb._trie.trie)
    } else {
      const node = _trie.create(route)
      node.cb = cb
    }

    return emit
  }

  // match and call a route
  // (str, obj?) -> null
  function emit (route) {
    assert.notEqual(route, undefined, "'route' must be defined")
    const args = sliced(arguments)

    const node = _trie.match(route)
    if (node && node.cb) {
      args[0] = node.params
      return node.cb.apply(null, args)
    }

    const dft = _trie.match(_default)
    if (dft && dft.cb) {
      args[0] = dft.params
      return dft.cb.apply(null, args)
    }

    throw new Error("route '" + route + "' did not match")
  }
}

},{"./trie":103,"assert":13,"sliced":102}],102:[function(require,module,exports){

/**
 * An Array.prototype.slice.call(arguments) alternative
 *
 * @param {Object} args something with a length
 * @param {Number} slice
 * @param {Number} sliceEnd
 * @api public
 */

module.exports = function (args, slice, sliceEnd) {
  var ret = [];
  var len = args.length;

  if (0 === len) return ret;

  var start = slice < 0
    ? Math.max(0, slice + len)
    : slice || 0;

  if (sliceEnd !== undefined) {
    len = sliceEnd < 0
      ? sliceEnd + len
      : sliceEnd
  }

  while (len-- > start) {
    ret[len - start] = args[len];
  }

  return ret;
}


},{}],103:[function(require,module,exports){
const mutate = require('xtend/mutable')
const assert = require('assert')
const xtend = require('xtend')

module.exports = Trie

// create a new trie
// null -> obj
function Trie () {
  if (!(this instanceof Trie)) return new Trie()
  this.trie = { nodes: {} }
}

// create a node on the trie at route
// and return a node
// str -> null
Trie.prototype.create = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')
  // strip leading '/' and split routes
  const routes = route.replace(/^\//, '').split('/')
  return (function createNode (index, trie, routes) {
    const route = routes[index]

    if (route === undefined) return trie

    var node = null
    if (/^:/.test(route)) {
      // if node is a name match, set name and append to ':' node
      if (!trie.nodes[':']) {
        node = { nodes: {} }
        trie.nodes[':'] = node
      }
      trie.name = route.replace(/^:/, '')
    } else if (!trie.nodes[route]) {
      node = { nodes: {} }
      trie.nodes[route] = node
    } else {
      node = trie.nodes[route]
    }

    // we must recurse deeper
    return createNode(index + 1, node, routes)
  })(0, this.trie, routes)
}

// match a route on the trie
// and return the node
// str -> obj
Trie.prototype.match = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')

  const routes = route.replace(/^\//, '').split('/')
  const params = {}

  var node = (function search (index, trie) {
    // either there's no match, or we're done searching
    if (trie === undefined) return undefined
    const route = routes[index]
    if (route === undefined) return trie

    if (trie.nodes[route]) {
      // match regular routes first
      return search(index + 1, trie.nodes[route])
    } else if (trie.name) {
      // match named routes
      params[trie.name] = route
      return search(index + 1, trie.nodes[':'])
    } else {
      // no matches found
      return search(index + 1)
    }
  })(0, this.trie)

  if (!node) return undefined
  node = xtend(node)
  node.params = params
  return node
}

// mount a trie onto a node at route
// (str, obj) -> null
Trie.prototype.mount = function (route, trie) {
  assert.equal(typeof route, 'string', 'route should be a string')
  assert.equal(typeof trie, 'object', 'trie should be a object')

  const split = route.replace(/^\//, '').split('/')
  var node = null
  var key = null

  if (split.length === 1) {
    key = split[0]
    node = this.create(key)
  } else {
    const headArr = split.splice(0, split.length - 1)
    const head = headArr.join('/')
    key = split[0]
    node = this.create(head)
  }

  mutate(node.nodes, trie.nodes)
  if (trie.name) node.name = trie.name

  // delegate properties from '/' to the new node
  // '/' cannot be reached once mounted
  if (node.nodes['']) {
    Object.keys(node.nodes['']).forEach(function (key) {
      if (key === 'nodes') return
      node[key] = node.nodes[''][key]
    })
    mutate(node.nodes, node.nodes[''].nodes)
    delete node.nodes[''].nodes
  }
}

},{"assert":13,"xtend":104,"xtend/mutable":105}],104:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],105:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],106:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <footer class=', '>\n      <span class="todo-count"></span>\n      <ul class="filters">\n        <li><a class=', ' href="/#/">All</a></li>\n        <li><a class=', ' href="/#/active">Active</a></li>\n        <li><a class=', ' href="/#/completed">Completed</a></li>\n      </ul>\n      <button\n        class=', '\n        dataset=', '>Clear completed</button>\n    </footer>\n  '], ['\n    <footer class=', '>\n      <span class="todo-count"></span>\n      <ul class="filters">\n        <li><a class=', ' href="/#/">All</a></li>\n        <li><a class=', ' href="/#/active">Active</a></li>\n        <li><a class=', ' href="/#/completed">Completed</a></li>\n      </ul>\n      <button\n        class=', '\n        dataset=', '>Clear completed</button>\n    </footer>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('duet');

var dom = _require.dom;
var modelFor = _require.modelFor;


module.exports = function (state) {
  var model = modelFor(state);
  var ids = Object.keys(state.todos);

  var selected = function selected(filter) {
    return state.filter === filter ? 'selected' : '';
  };

  var clear = function clear(model) {
    ids.forEach(function (id) {
      if (model.todos.get(id).completed) {
        model.todos['delete'](id);
      }
    });
  };

  var numCompleted = ids.reduce(function (sum, id) {
    return state.todos[id].completed ? sum + 1 : sum;
  }, 0);

  return dom(_templateObject, 'footer' + (ids.length ? '' : ' hidden'), selected('all'), selected('active'), selected('completed'), 'clear-completed' + (numCompleted ? '' : ' hidden'), { click: model.ev(clear) });
};

},{"duet":7}],107:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <header class="header">\n      <h1>todos</h1>\n      <input type="text"\n        class="new-todo"\n        name="new-todo"\n        value=', '\n        dataset=', '\n        placeholder="What needs to be done?"\n        ', ' />\n    </header>\n  '], ['\n    <header class="header">\n      <h1>todos</h1>\n      <input type="text"\n        class="new-todo"\n        name="new-todo"\n        value=', '\n        dataset=', '\n        placeholder="What needs to be done?"\n        ', ' />\n    </header>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('duet');

var dom = _require.dom;
var modelFor = _require.modelFor;

var _require2 = require('../utils');

var uuid = _require2.uuid;


var ENTER_KEY = 13;

var onKeydown = function onKeydown(model, data) {
  var title;

  if (data.event.keyCode !== ENTER_KEY) {
    return;
  }

  title = data.form['new-todo'].trim();

  if (title) {
    model.todos.put(uuid(), {
      title: title,
      completed: false
    });
    model.newTodo.set('');
  }
};

module.exports = function (state) {
  var model = modelFor(state);

  return dom(_templateObject, state.newTodo, {
    keydown: model.ev(onKeydown),
    default: 'keydown'
  }, state.isInitLoad ? 'autofocus' : '');
};

},{"../utils":113,"duet":7}],108:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n      <li class=', ' key=', '>\n        <div class="view">\n          <input type="checkbox"\n            class="toggle"\n            key=', '\n            ', '\n            dataset=', ' />\n          <label dataset=', '>', '</label>\n          <button class="destroy" dataset=', '></button>\n        </div>\n        <input type="text"\n          class="edit"\n          name="title"\n          value=', '\n          dataset=', '\n          ', ' />\n      </li>\n    '], ['\n      <li class=', ' key=', '>\n        <div class="view">\n          <input type="checkbox"\n            class="toggle"\n            key=', '\n            ', '\n            dataset=', ' />\n          <label dataset=', '>', '</label>\n          <button class="destroy" dataset=', '></button>\n        </div>\n        <input type="text"\n          class="edit"\n          name="title"\n          value=', '\n          dataset=', '\n          ', ' />\n      </li>\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    <section class=', '>\n      <input type="checkbox"\n        class="toggle-all"\n        key=', '\n        ', '\n        dataset=', ' />\n      <label for="toggle-all">Mark all as complete</label>\n      <ul class="todo-list">\n        ', '\n      </ul>\n    </section>\n  '], ['\n    <section class=', '>\n      <input type="checkbox"\n        class="toggle-all"\n        key=', '\n        ', '\n        dataset=', ' />\n      <label for="toggle-all">Mark all as complete</label>\n      <ul class="todo-list">\n        ', '\n      </ul>\n    </section>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('duet');

var dom = _require.dom;
var modelFor = _require.modelFor;

var _require2 = require('../utils');

var extend = _require2.extend;

var _require3 = require('duet/node_modules/virtual-dom');

var create = _require3.create;


var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

module.exports = function (state) {
  var model = modelFor(state);
  var ids = Object.keys(state.todos);

  var toggleAllCompleted = function toggleAllCompleted(model) {
    var numActive = Object.keys(model().todos).reduce(function (sum, id) {
      return state.todos[id].completed ? sum : sum + 1;
    }, 0);

    ids.forEach(function (id) {
      var todo = model.todos.get(id);

      model.todos.put(id, extend(todo, { completed: numActive > 0 }));
    });
  };

  var toggleCompleted = function toggleCompleted(model, data) {
    var id = data.custom;
    var todo = model.todos.get(id);

    model.todos.put(id, extend(todo, { completed: !todo.completed }));
  };

  var edit = function edit(model, data) {
    model.editing.set(data.custom);
  };

  var clear = function clear(model, data) {
    model.todos['delete'](data.custom);
  };

  var onKeydown = function onKeydown(model, data) {
    var id = data.custom;
    var title = void 0,
        todo = void 0;

    if (data.event.keyCode === ESCAPE_KEY) {
      model.editing.set(null);

      return;
    }

    if (data.event.keyCode !== ENTER_KEY) {
      return;
    }

    title = data.form.title;
    todo = model.todos.get(id);

    console.log(title);

    model.todos.put(id, extend(todo, { title: title }));
    model.editing.set(null);
  };

  var close = function close(model) {
    model.editing.set(null);
  };

  var numActive = ids.reduce(function (sum, id) {
    return state.todos[id].completed ? sum : sum + 1;
  }, 0);

  var numCompleted = ids.length - numActive;

  var filteredIds = ids.filter(function (id) {
    var todo = state.todos[id];

    switch (state.filter) {
      case 'completed':
        return todo.completed;
      case 'active':
        return !todo.completed;
      default:
        return true;
    }
  });

  var Todo = function Todo(id) {
    var todo = state.todos[id];

    return dom(_templateObject, state.editing === id ? 'editing' : '', 'todo--' + id, 'toggle--' + id + (todo.completed ? '--checked' : ''), todo.completed ? 'checked' : '', { change: model.ev(toggleCompleted, id) }, { dblclick: model.ev(edit, id) }, todo.title, { click: model.ev(clear, id) }, todo.title, {
      keydown: model.ev(onKeydown, id),
      focusout: model.ev(close),
      default: 'keydown'
    }, state.editing === id ? 'autofocus' : '');
  };

  return dom(_templateObject2, 'main' + (ids.length ? '' : ' hidden'), 'toggle-all' + (numActive === 0 ? '--checked' : ''), numActive === 0 ? 'checked' : '', { change: model.ev(toggleAllCompleted) }, filteredIds.map(Todo));
};

},{"../utils":113,"duet":7,"duet/node_modules/virtual-dom":70}],109:[function(require,module,exports){
'use strict';

var _require = require('./utils');

var store = _require.store;

var view = require('./view');
var createModel = require('./model');
var createRouter = require('./router');

module.exports = function (start) {
  store('todos-duet', function (stored) {
    var model = createModel(stored);
    var router = createRouter(model);

    start(view, model, router);
  });
};

},{"./model":111,"./router":112,"./utils":113,"./view":114}],110:[function(require,module,exports){
'use strict';

var duet = require('duet');
var app = require('./app');

duet(app, '.todoapp', {
  // forceSingleThread: true,
  isDebug: true,
  isHashRouter: true
});

},{"./app":109,"duet":7}],111:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _require = require('duet');

var model = _require.model;
var value = _require.value;
var varhash = _require.varhash;

var _require2 = require('./utils');

var store = _require2.store;


var Todo = function Todo(_ref, key) {
  var title = _ref.title;
  var completed = _ref.completed;

  return {
    title: title,
    completed: completed
  };
};

module.exports = function (stored) {
  var todos = stored != null && (typeof stored === 'undefined' ? 'undefined' : _typeof(stored)) === 'object' && stored || {};

  var appModel = model({
    isInitLoad: value(true),
    todos: varhash(todos, Todo),
    newTodo: value(''),
    editing: value(null),
    filter: value('all')
  });

  var initLoad = appModel(function (state) {
    if (state.isInitLoad) {
      initLoad();
      appModel.isInitLoad.set(false);
    }
  });

  appModel.todos(function (todosState) {
    store('todos-duet', todosState);
  });

  return appModel;
};

},{"./utils":113,"duet":7}],112:[function(require,module,exports){
'use strict';

var _require = require('duet');

var router = _require.router;


module.exports = function (model) {

  var filter = function filter(value) {
    model.filter.set(value);
  };

  return router().on('/', filter.bind(null, 'all')).on('/active', filter.bind(null, 'active')).on('/completed', filter.bind(null, 'completed'));
};

},{"duet":7}],113:[function(require,module,exports){
'use strict';

var _require = require('duet');

var localStorage = _require.localStorage;


var uuid = function uuid() {
  var uuid = '';

  for (var i = 0; i < 32; i++) {
    var random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
  }

  return uuid;
};

var store = function store(namespace, dataOrHandler) {
  if (typeof dataOrHandler === 'function') {
    return localStorage(namespace, function (storeJSON) {
      dataOrHandler(storeJSON && JSON.parse(storeJSON) || []);
    });
  }

  return localStorage(namespace, JSON.stringify(dataOrHandler));
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

var extend = function extend() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var target = {};

  for (var i = 0; i < args.length; i++) {
    var source = args[i];

    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

module.exports = {
  uuid: uuid,
  store: store,
  extend: extend
};

},{"duet":7}],114:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n      ', '\n      ', '\n      ', '\n    </div>\n  '], ['\n    <div>\n      ', '\n      ', '\n      ', '\n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('duet');

var dom = _require.dom;

var Header = require('./Header');
var Main = require('./Main');
var Footer = require('./Footer');

module.exports = function (state) {
  return dom(_templateObject, Header(state), Main(state), Footer(state));
};

},{"./Footer":106,"./Header":107,"./Main":108,"duet":7}]},{},[110])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZHVldC9saWIvU2luZ2xlVGhyZWFkLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbGliL2FwcFRocmVhZC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L2xpYi9jc3MuanMiLCJub2RlX21vZHVsZXMvZHVldC9saWIvZG9tLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbGliL2RvbUV2ZW50LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbGliL2RvbUV2ZW50TmFtZXMuanMiLCJub2RlX21vZHVsZXMvZHVldC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9saWIvbG9jYWxTdG9yYWdlLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbGliL21vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbGliL21zZy5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L2xpYi9yb3V0ZXIuanMiLCJub2RlX21vZHVsZXMvZHVldC9saWIvdXNlclRocmVhZC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9hc3NlcnQvYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jb25zb2xlLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY29uc29sZS1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9kYXRlLW5vdy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9jc2pzL2NzanMuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvY3Nqcy9nZXQtY3NzLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2NzanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvY3Nqcy9saWIvYmFzZTYyLWVuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9jc2pzL2xpYi9idWlsZC1leHBvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2NzanMvbGliL2NvbXBvc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2NzanMvbGliL2NzanMuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvY3Nqcy9saWIvY3NzLWV4dHJhY3QtZXh0ZW5kcy5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9jc2pzL2xpYi9jc3Mta2V5LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2NzanMvbGliL2dldC1jc3MuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvY3Nqcy9saWIvaGFzaC1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvY3Nqcy9saWIvc2NvcGVkLW5hbWUuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvY3Nqcy9saWIvc2NvcGVpZnkuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvZm9ybS1kYXRhLXNldC9lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2Zvcm0tZGF0YS1zZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvZm9ybS1kYXRhLXNldC9ub2RlX21vZHVsZXMvZG9tLXdhbGsvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvaGFzaC1tYXRjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9oeXBlcnN0eWxlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9oeXBlcnN0eWxlcy90cmFuc2Zvcm0uanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvaHlwZXJ4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2h5cGVyeC9ub2RlX21vZHVsZXMvaHlwZXJzY3JpcHQtYXR0cmlidXRlLXRvLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL2luc2VydC1jc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvb2JzZXJ2LXN0cnVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9vYnNlcnYtc3RydWN0L25vZGVfbW9kdWxlcy94dGVuZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9vYnNlcnYtdmFyaGFzaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy9vYnNlcnYvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvcGF0aG5hbWUtbWF0Y2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL2xpYi9wYXRjaC9hcHBseVByb3BlcnRpZXMuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL2xpYi9wYXRjaC9jcmVhdGVFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9saWIvcGF0Y2gvZG9tSW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL2xpYi9wYXRjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92ZG9tLXNlcmlhbGl6ZWQtcGF0Y2gvbGliL3BhdGNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9saWIvcGF0Y2gvaXNTb2Z0U2V0SG9vay5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92ZG9tLXNlcmlhbGl6ZWQtcGF0Y2gvbGliL3BhdGNoL2lzVk5vZGUuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL2xpYi9wYXRjaC9pc1ZUZXh0LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9saWIvcGF0Y2gvcGF0Y2hPcC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92ZG9tLXNlcmlhbGl6ZWQtcGF0Y2gvbGliL3BhdGNoL3BhdGNoUmVjdXJzaXZlLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9saWIvcGF0Y2gvdHlwZXMuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL2xpYi9wYXRjaFR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9saWIvc2VyaWFsaXplL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9ub2RlX21vZHVsZXMvdmRvbS1hcy1qc29uL2xpYi90b0pzb24uanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL25vZGVfbW9kdWxlcy92ZG9tLWFzLWpzb24vbGliL3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3Zkb20tc2VyaWFsaXplZC1wYXRjaC9ub2RlX21vZHVsZXMvdmRvbS1hcy1qc29uL3RvSnNvbi5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92ZG9tLXNlcmlhbGl6ZWQtcGF0Y2gvcGF0Y2guanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmRvbS1zZXJpYWxpemVkLXBhdGNoL3NlcmlhbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9jcmVhdGUtZWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9kaWZmLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL2guanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vbm9kZV9tb2R1bGVzL2Jyb3dzZXItc3BsaXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vbm9kZV9tb2R1bGVzL2V2LXN0b3JlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL25vZGVfbW9kdWxlcy9ldi1zdG9yZS9ub2RlX21vZHVsZXMvaW5kaXZpZHVhbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9ub2RlX21vZHVsZXMvZXYtc3RvcmUvbm9kZV9tb2R1bGVzL2luZGl2aWR1YWwvb25lLXZlcnNpb24uanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vbm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9ub2RlX21vZHVsZXMvaXMtb2JqZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL25vZGVfbW9kdWxlcy94LWlzLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3BhdGNoLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zkb20vYXBwbHktcHJvcGVydGllcy5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92ZG9tL2NyZWF0ZS1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zkb20vZG9tLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zkb20vcGF0Y2gtb3AuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdmRvbS9wYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92ZG9tL3VwZGF0ZS13aWRnZXQuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdmlydHVhbC1oeXBlcnNjcmlwdC9ob29rcy9ldi1ob29rLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3ZpcnR1YWwtaHlwZXJzY3JpcHQvaG9va3Mvc29mdC1zZXQtaG9vay5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92aXJ0dWFsLWh5cGVyc2NyaXB0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3ZpcnR1YWwtaHlwZXJzY3JpcHQvcGFyc2UtdGFnLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zub2RlL2hhbmRsZS10aHVuay5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy10aHVuay5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy12aG9vay5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy12bm9kZS5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy12dGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy13aWRnZXQuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdm5vZGUvdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS92bm9kZS5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS92cGF0Y2guanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdm5vZGUvdnRleHQuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdnRyZWUvZGlmZi1wcm9wcy5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92dHJlZS9kaWZmLmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3dheWZhcmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R1ZXQvbm9kZV9tb2R1bGVzL3dheWZhcmVyL25vZGVfbW9kdWxlcy9zbGljZWQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMvd2F5ZmFyZXIvdHJpZS5qcyIsIm5vZGVfbW9kdWxlcy9kdWV0L25vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiLCJub2RlX21vZHVsZXMvZHVldC9ub2RlX21vZHVsZXMveHRlbmQvbXV0YWJsZS5qcyIsImluZGV4LmpzIiwiYXBwLmpzIiwibW9kZWwuanMiLCJyb3V0ZXIuanMiLCJ1dGlscy5qcyIsInZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2V0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3a0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O2VDakJ3QixRQUFRLE1BQVI7O0lBQWpCO0lBQUs7OztBQUVaLE9BQU8sT0FBUCxHQUFpQixVQUFDLEtBQUQsRUFBVztBQUMxQixNQUFNLFFBQVEsU0FBUyxLQUFULENBQVIsQ0FEb0I7QUFFMUIsTUFBTSxNQUFNLE9BQU8sSUFBUCxDQUFZLE1BQU0sS0FBTixDQUFsQixDQUZvQjs7QUFJMUIsTUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLE1BQUQ7V0FBWSxNQUFNLE1BQU4sS0FBaUIsTUFBakIsR0FBMEIsVUFBMUIsR0FBdUMsRUFBdkM7R0FBWixDQUpTOztBQU0xQixNQUFNLFFBQVEsU0FBUixLQUFRLENBQUMsS0FBRCxFQUFXO0FBQ3ZCLFFBQUksT0FBSixDQUFZLFVBQUMsRUFBRCxFQUFRO0FBQ2xCLFVBQUksTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixFQUFoQixFQUFvQixTQUFwQixFQUErQjtBQUNqQyxjQUFNLEtBQU4sQ0FBWSxRQUFaLEVBQXNCLEVBQXRCLEVBRGlDO09BQW5DO0tBRFUsQ0FBWixDQUR1QjtHQUFYLENBTlk7O0FBYzFCLE1BQU0sZUFBZSxJQUFJLE1BQUosQ0FBVyxVQUFVLEdBQVYsRUFBZSxFQUFmLEVBQW1CO0FBQ2pELFdBQU8sTUFBTSxLQUFOLENBQVksRUFBWixFQUFnQixTQUFoQixHQUE0QixNQUFNLENBQU4sR0FBVSxHQUF0QyxDQUQwQztHQUFuQixFQUU3QixDQUZrQixDQUFmLENBZG9COztBQWtCMUIsU0FBTyxxQkFDVyxZQUFZLElBQUksTUFBSixHQUFhLEVBQWIsR0FBa0IsU0FBbEIsQ0FBWixFQUdHLFNBQVMsS0FBVCxHQUNBLFNBQVMsUUFBVCxHQUNBLFNBQVMsV0FBVCxHQUdQLHFCQUFxQixlQUFlLEVBQWYsR0FBb0IsU0FBcEIsQ0FBckIsRUFDRSxFQUFDLE9BQU8sTUFBTSxFQUFOLENBQVMsS0FBVCxDQUFQLEdBVmpCLENBbEIwQjtDQUFYOzs7Ozs7Ozs7ZUFGTyxRQUFRLE1BQVI7O0lBQWpCO0lBQUs7O2dCQUNZLFFBQVEsVUFBUjs7SUFBakI7OztBQUVQLElBQU0sWUFBWSxFQUFaOztBQUVOLElBQU0sWUFBWSxTQUFaLFNBQVksQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUNqQyxNQUFJLEtBQUosQ0FEaUM7O0FBR2pDLE1BQUksS0FBSyxLQUFMLENBQVcsT0FBWCxLQUF1QixTQUF2QixFQUFrQztBQUNwQyxXQURvQztHQUF0Qzs7QUFJQSxVQUFRLEtBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsSUFBdEIsRUFBUixDQVBpQzs7QUFTakMsTUFBSSxLQUFKLEVBQVc7QUFDVCxVQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLE1BQWhCLEVBQXdCO0FBQ3RCLGFBQU8sS0FBUDtBQUNBLGlCQUFXLEtBQVg7S0FGRixFQURTO0FBS1QsVUFBTSxPQUFOLENBQWMsR0FBZCxDQUFrQixFQUFsQixFQUxTO0dBQVg7Q0FUZ0I7O0FBa0JsQixPQUFPLE9BQVAsR0FBaUIsVUFBQyxLQUFELEVBQVc7QUFDMUIsTUFBTSxRQUFRLFNBQVMsS0FBVCxDQUFSLENBRG9COztBQUcxQixTQUFPLHFCQU1PLE1BQU0sT0FBTixFQUNFO0FBQ1IsYUFBUyxNQUFNLEVBQU4sQ0FBUyxTQUFULENBQVQ7QUFDQSxhQUFTLFNBQVQ7S0FHQSxNQUFNLFVBQU4sR0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FaUixDQUgwQjtDQUFYOzs7Ozs7Ozs7O2VBdkJPLFFBQVEsTUFBUjs7SUFBakI7SUFBSzs7Z0JBQ1ksUUFBUSxVQUFSOztJQUFqQjs7Z0JBQ2lCLFFBQVEsK0JBQVI7O0lBQWpCOzs7QUFFUCxJQUFNLFlBQVksRUFBWjtBQUNOLElBQU0sYUFBYSxFQUFiOztBQUVOLE9BQU8sT0FBUCxHQUFpQixVQUFDLEtBQUQsRUFBVztBQUMxQixNQUFNLFFBQVEsU0FBUyxLQUFULENBQVIsQ0FEb0I7QUFFMUIsTUFBTSxNQUFNLE9BQU8sSUFBUCxDQUFZLE1BQU0sS0FBTixDQUFsQixDQUZvQjs7QUFJMUIsTUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLENBQUMsS0FBRCxFQUFXO0FBQ3BDLFFBQU0sWUFBWSxPQUFPLElBQVAsQ0FBWSxRQUFRLEtBQVIsQ0FBWixDQUEyQixNQUEzQixDQUFrQyxVQUFVLEdBQVYsRUFBZSxFQUFmLEVBQW1CO0FBQ3JFLGFBQU8sTUFBTSxLQUFOLENBQVksRUFBWixFQUFnQixTQUFoQixHQUE0QixHQUE1QixHQUFrQyxNQUFNLENBQU4sQ0FENEI7S0FBbkIsRUFFakQsQ0FGZSxDQUFaLENBRDhCOztBQUtwQyxRQUFJLE9BQUosQ0FBWSxVQUFDLEVBQUQsRUFBUTtBQUNsQixVQUFNLE9BQU8sTUFBTSxLQUFOLENBQVksR0FBWixDQUFnQixFQUFoQixDQUFQLENBRFk7O0FBR2xCLFlBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsRUFBaEIsRUFBb0IsT0FBTyxJQUFQLEVBQWEsRUFBQyxXQUFXLFlBQVksQ0FBWixFQUF6QixDQUFwQixFQUhrQjtLQUFSLENBQVosQ0FMb0M7R0FBWCxDQUpEOztBQWdCMUIsTUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUN2QyxRQUFNLEtBQUssS0FBSyxNQUFMLENBRDRCO0FBRXZDLFFBQU0sT0FBTyxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLEVBQWhCLENBQVAsQ0FGaUM7O0FBSXZDLFVBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsRUFBaEIsRUFBb0IsT0FBTyxJQUFQLEVBQWEsRUFBQyxXQUFXLENBQUMsS0FBSyxTQUFMLEVBQTFCLENBQXBCLEVBSnVDO0dBQWpCLENBaEJFOztBQXVCMUIsTUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQzVCLFVBQU0sT0FBTixDQUFjLEdBQWQsQ0FBa0IsS0FBSyxNQUFMLENBQWxCLENBRDRCO0dBQWpCLENBdkJhOztBQTJCMUIsTUFBTSxRQUFRLFNBQVIsS0FBUSxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQzdCLFVBQU0sS0FBTixDQUFZLFFBQVosRUFBc0IsS0FBSyxNQUFMLENBQXRCLENBRDZCO0dBQWpCLENBM0JZOztBQStCMUIsTUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQ2pDLFFBQU0sS0FBSyxLQUFLLE1BQUwsQ0FEc0I7QUFFakMsUUFBSSxjQUFKO1FBQVcsYUFBWCxDQUZpQzs7QUFJakMsUUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLEtBQXVCLFVBQXZCLEVBQW1DO0FBQ3JDLFlBQU0sT0FBTixDQUFjLEdBQWQsQ0FBa0IsSUFBbEIsRUFEcUM7O0FBR3JDLGFBSHFDO0tBQXZDOztBQU1BLFFBQUksS0FBSyxLQUFMLENBQVcsT0FBWCxLQUF1QixTQUF2QixFQUFrQztBQUNwQyxhQURvQztLQUF0Qzs7QUFJQSxZQUFRLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FkeUI7QUFlakMsV0FBTyxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWdCLEVBQWhCLENBQVAsQ0FmaUM7O0FBaUJqQyxZQUFRLEdBQVIsQ0FBWSxLQUFaLEVBakJpQzs7QUFtQmpDLFVBQU0sS0FBTixDQUFZLEdBQVosQ0FBZ0IsRUFBaEIsRUFBb0IsT0FBTyxJQUFQLEVBQWEsRUFBQyxPQUFPLEtBQVAsRUFBZCxDQUFwQixFQW5CaUM7QUFvQmpDLFVBQU0sT0FBTixDQUFjLEdBQWQsQ0FBa0IsSUFBbEIsRUFwQmlDO0dBQWpCLENBL0JROztBQXVEMUIsTUFBTSxRQUFRLFNBQVIsS0FBUSxDQUFDLEtBQUQsRUFBVztBQUN2QixVQUFNLE9BQU4sQ0FBYyxHQUFkLENBQWtCLElBQWxCLEVBRHVCO0dBQVgsQ0F2RFk7O0FBMkQxQixNQUFNLFlBQVksSUFBSSxNQUFKLENBQVcsVUFBVSxHQUFWLEVBQWUsRUFBZixFQUFtQjtBQUM5QyxXQUFPLE1BQU0sS0FBTixDQUFZLEVBQVosRUFBZ0IsU0FBaEIsR0FBNEIsR0FBNUIsR0FBa0MsTUFBTSxDQUFOLENBREs7R0FBbkIsRUFFMUIsQ0FGZSxDQUFaLENBM0RvQjs7QUErRDFCLE1BQU0sZUFBZSxJQUFJLE1BQUosR0FBYSxTQUFiLENBL0RLOztBQWlFMUIsTUFBTSxjQUFjLElBQUksTUFBSixDQUFXLFVBQVUsRUFBVixFQUFjO0FBQzNDLFFBQU0sT0FBTyxNQUFNLEtBQU4sQ0FBWSxFQUFaLENBQVAsQ0FEcUM7O0FBRzNDLFlBQVEsTUFBTSxNQUFOO0FBQ04sV0FBSyxXQUFMO0FBQ0UsZUFBTyxLQUFLLFNBQUwsQ0FEVDtBQURGLFdBR08sUUFBTDtBQUNFLGVBQU8sQ0FBQyxLQUFLLFNBQUwsQ0FEVjtBQUhGO0FBTUksZUFBTyxJQUFQLENBREY7QUFMRixLQUgyQztHQUFkLENBQXpCLENBakVvQjs7QUE4RTFCLE1BQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxFQUFELEVBQVE7QUFDbkIsUUFBTSxPQUFPLE1BQU0sS0FBTixDQUFZLEVBQVosQ0FBUCxDQURhOztBQUduQixXQUFPLHFCQUNPLE1BQU0sT0FBTixLQUFrQixFQUFsQixHQUF1QixTQUF2QixHQUFtQyxFQUFuQyxFQUE2QyxXQUFXLEVBQVgsRUFJN0MsYUFBYSxFQUFiLElBQW1CLEtBQUssU0FBTCxHQUFpQixXQUFqQixHQUErQixFQUEvQixDQUFuQixFQUNKLEtBQUssU0FBTCxHQUFpQixTQUFqQixHQUE2QixFQUE3QixFQUNRLEVBQUMsUUFBUSxNQUFNLEVBQU4sQ0FBUyxlQUFULEVBQTBCLEVBQTFCLENBQVIsSUFDSSxFQUFDLFVBQVUsTUFBTSxFQUFOLENBQVMsSUFBVCxFQUFlLEVBQWYsQ0FBVixJQUFpQyxLQUFLLEtBQUwsRUFDakIsRUFBQyxPQUFPLE1BQU0sRUFBTixDQUFTLEtBQVQsRUFBZ0IsRUFBaEIsQ0FBUCxJQUszQixLQUFLLEtBQUwsRUFDRTtBQUNSLGVBQVMsTUFBTSxFQUFOLENBQVMsU0FBVCxFQUFvQixFQUFwQixDQUFUO0FBQ0EsZ0JBQVUsTUFBTSxFQUFOLENBQVMsS0FBVCxDQUFWO0FBQ0EsZUFBUyxTQUFUO09BRUEsTUFBTSxPQUFOLEtBQWtCLEVBQWxCLEdBQXVCLFdBQXZCLEdBQXFDLEVBQXJDLENBcEJSLENBSG1CO0dBQVIsQ0E5RWE7O0FBMEcxQixTQUFPLHNCQUNZLFVBQVUsSUFBSSxNQUFKLEdBQWEsRUFBYixHQUFrQixTQUFsQixDQUFWLEVBR1AsZ0JBQWdCLGNBQWMsQ0FBZCxHQUFrQixXQUFsQixHQUFnQyxFQUFoQyxDQUFoQixFQUNKLGNBQWMsQ0FBZCxHQUFrQixTQUFsQixHQUE4QixFQUE5QixFQUNRLEVBQUMsUUFBUSxNQUFNLEVBQU4sQ0FBUyxrQkFBVCxDQUFSLElBR1QsWUFBWSxHQUFaLENBQWdCLElBQWhCLEVBVFIsQ0ExRzBCO0NBQVg7Ozs7O2VDUEksUUFBUSxTQUFSOztJQUFkOztBQUNQLElBQU0sT0FBZSxRQUFRLFFBQVIsQ0FBZjtBQUNOLElBQU0sY0FBZSxRQUFRLFNBQVIsQ0FBZjtBQUNOLElBQU0sZUFBZSxRQUFRLFVBQVIsQ0FBZjs7QUFHTixPQUFPLE9BQVAsR0FBaUIsVUFBQyxLQUFELEVBQVc7QUFDMUIsUUFBTSxZQUFOLEVBQW9CLFVBQUMsTUFBRCxFQUFZO0FBQzlCLFFBQU0sUUFBUSxZQUFZLE1BQVosQ0FBUixDQUR3QjtBQUU5QixRQUFNLFNBQVMsYUFBYSxLQUFiLENBQVQsQ0FGd0I7O0FBSTlCLFVBQU0sSUFBTixFQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFKOEI7R0FBWixDQUFwQixDQUQwQjtDQUFYOzs7OztBRE5qQixJQUFNLE9BQU8sUUFBUSxNQUFSLENBQVA7QUFDTixJQUFNLE1BQU8sUUFBUSxPQUFSLENBQVA7O0FBRU4sS0FBSyxHQUFMLEVBQVUsVUFBVixFQUFzQjs7QUFFcEIsV0FBUyxJQUFUO0FBQ0EsZ0JBQWMsSUFBZDtDQUhGOzs7Ozs7O2VFSGdDLFFBQVEsTUFBUjs7SUFBekI7SUFBTztJQUFPOztnQkFDVyxRQUFRLFNBQVI7O0lBQXpCOzs7QUFFUCxJQUFNLE9BQU8sU0FBUCxJQUFPLE9BQXFCLEdBQXJCLEVBQTZCO01BQTNCLG1CQUEyQjtNQUFwQiwyQkFBb0I7O0FBQ3hDLFNBQU87QUFDTCxnQkFESztBQUVMLHdCQUZLO0dBQVAsQ0FEd0M7Q0FBN0I7O0FBT2IsT0FBTyxPQUFQLEdBQWlCLFVBQUMsTUFBRCxFQUFZO0FBQzNCLE1BQU0sUUFBUSxVQUFVLElBQVYsSUFBa0IsUUFBTyx1REFBUCxLQUFrQixRQUFsQixJQUE4QixNQUFoRCxJQUEwRCxFQUExRCxDQURhOztBQUczQixNQUFNLFdBQVcsTUFBTTtBQUNyQixnQkFBWSxNQUFNLElBQU4sQ0FBWjtBQUNBLFdBQU8sUUFBUSxLQUFSLEVBQWUsSUFBZixDQUFQO0FBQ0EsYUFBUyxNQUFNLEVBQU4sQ0FBVDtBQUNBLGFBQVMsTUFBTSxJQUFOLENBQVQ7QUFDQSxZQUFRLE1BQU0sS0FBTixDQUFSO0dBTGUsQ0FBWCxDQUhxQjs7QUFXM0IsTUFBTSxXQUFXLFNBQVMsVUFBVSxLQUFWLEVBQWlCO0FBQ3pDLFFBQUksTUFBTSxVQUFOLEVBQWtCO0FBQ3BCLGlCQURvQjtBQUVwQixlQUFTLFVBQVQsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEIsRUFGb0I7S0FBdEI7R0FEd0IsQ0FBcEIsQ0FYcUI7O0FBa0IzQixXQUFTLEtBQVQsQ0FBZSxVQUFDLFVBQUQsRUFBZ0I7QUFDN0IsVUFBTSxZQUFOLEVBQW9CLFVBQXBCLEVBRDZCO0dBQWhCLENBQWYsQ0FsQjJCOztBQXNCM0IsU0FBTyxRQUFQLENBdEIyQjtDQUFaOzs7OztlQ1ZDLFFBQVEsTUFBUjs7SUFBWDs7O0FBRVAsT0FBTyxPQUFQLEdBQWlCLFVBQUMsS0FBRCxFQUFXOztBQUUxQixNQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsS0FBRCxFQUFXO0FBQ3hCLFVBQU0sTUFBTixDQUFhLEdBQWIsQ0FBaUIsS0FBakIsRUFEd0I7R0FBWCxDQUZXOztBQU0xQixTQUFPLFNBQ04sRUFETSxDQUNILEdBREcsRUFDVyxPQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCLENBRFgsRUFFTixFQUZNLENBRUgsU0FGRyxFQUVXLE9BQU8sSUFBUCxDQUFZLElBQVosRUFBa0IsUUFBbEIsQ0FGWCxFQUdOLEVBSE0sQ0FHSCxZQUhHLEVBR1csT0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixXQUFsQixDQUhYLENBQVAsQ0FOMEI7Q0FBWDs7Ozs7ZUNGTSxRQUFRLE1BQVI7O0lBQWhCOzs7QUFFUCxJQUFNLE9BQU8sZ0JBQU07QUFDakIsTUFBSSxPQUFPLEVBQVAsQ0FEYTs7QUFHakIsT0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksRUFBSixFQUFRLEdBQXhCLEVBQTZCO0FBQzNCLFFBQU0sU0FBUyxLQUFLLE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBckIsQ0FEWTtBQUUzQixRQUFJLE1BQU0sQ0FBTixJQUFXLE1BQU0sRUFBTixJQUFZLE1BQU0sRUFBTixJQUFZLE1BQU0sRUFBTixFQUFVO0FBQy9DLGNBQVEsR0FBUixDQUQrQztLQUFqRDtBQUdBLFlBQVEsQ0FBQyxNQUFNLEVBQU4sR0FBVyxDQUFYLEdBQWdCLE1BQU0sRUFBTixHQUFZLFNBQVMsQ0FBVCxHQUFhLENBQWIsR0FBa0IsTUFBOUIsQ0FBakIsQ0FBd0QsUUFBeEQsQ0FBaUUsRUFBakUsQ0FBUixDQUwyQjtHQUE3Qjs7QUFRQSxTQUFPLElBQVAsQ0FYaUI7Q0FBTjs7QUFjYixJQUFNLFFBQVEsU0FBUixLQUFRLENBQUMsU0FBRCxFQUFZLGFBQVosRUFBOEI7QUFDMUMsTUFBSSxPQUFPLGFBQVAsS0FBeUIsVUFBekIsRUFBcUM7QUFDdkMsV0FBTyxhQUFhLFNBQWIsRUFBd0IsVUFBVSxTQUFWLEVBQXFCO0FBQ2xELG9CQUFjLFNBQUMsSUFBYSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQWIsSUFBdUMsRUFBeEMsQ0FBZCxDQURrRDtLQUFyQixDQUEvQixDQUR1QztHQUF6Qzs7QUFNQSxTQUFPLGFBQWEsU0FBYixFQUF3QixLQUFLLFNBQUwsQ0FBZSxhQUFmLENBQXhCLENBQVAsQ0FQMEM7Q0FBOUI7O0FBVWQsSUFBTSxpQkFBaUIsT0FBTyxTQUFQLENBQWlCLGNBQWpCOztBQUV2QixJQUFNLFNBQVMsU0FBVCxNQUFTLEdBQWE7b0NBQVQ7O0dBQVM7O0FBQzFCLE1BQU0sU0FBUyxFQUFULENBRG9COztBQUcxQixPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLE1BQUwsRUFBYSxHQUFqQyxFQUFzQztBQUNwQyxRQUFNLFNBQVMsS0FBSyxDQUFMLENBQVQsQ0FEOEI7O0FBR3BDLFNBQUssSUFBSSxHQUFKLElBQVcsTUFBaEIsRUFBd0I7QUFDdEIsVUFBSSxlQUFlLElBQWYsQ0FBb0IsTUFBcEIsRUFBNEIsR0FBNUIsQ0FBSixFQUFzQztBQUNwQyxlQUFPLEdBQVAsSUFBYyxPQUFPLEdBQVAsQ0FBZCxDQURvQztPQUF0QztLQURGO0dBSEY7O0FBVUEsU0FBTyxNQUFQLENBYjBCO0NBQWI7O0FBZ0JmLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFlBRGU7QUFFZixjQUZlO0FBR2YsZ0JBSGU7Q0FBakI7Ozs7Ozs7OztlQzVDZSxRQUFRLE1BQVI7O0lBQVI7O0FBQ1AsSUFBTSxTQUFTLFFBQVEsVUFBUixDQUFUO0FBQ04sSUFBTSxPQUFTLFFBQVEsUUFBUixDQUFUO0FBQ04sSUFBTSxTQUFTLFFBQVEsVUFBUixDQUFUOztBQUVOLE9BQU8sT0FBUCxHQUFpQixVQUFDLEtBQUQsRUFBVztBQUMxQixTQUFPLHFCQUVELE9BQU8sS0FBUCxHQUNBLEtBQUssS0FBTCxHQUNBLE9BQU8sS0FBUCxFQUpOLENBRDBCO0NBQVgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gU2luZ2xlVGhyZWFkKCkge1xuICAgIHRoaXMud29ya2VyID0ge307XG4gICAgdGhpcy5zZWxmID0ge3Bvc3RNZXNzYWdlOiBtZXNzZW5nZXIodGhpcy53b3JrZXIpfTtcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSA9IG1lc3Nlbmdlcih0aGlzLnNlbGYpO1xufVxuXG5mdW5jdGlvbiBtZXNzZW5nZXIoZGVzdGluYXRpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcG9zdE1lc3NhZ2UoZGF0YSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlc3RpbmF0aW9uLm9ubWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLm9ubWVzc2FnZSh7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2luZ2xlVGhyZWFkO1xuIiwidmFyIHZkb20gPSByZXF1aXJlKCd2aXJ0dWFsLWRvbScpO1xudmFyIHNlcmlhbGl6ZSA9IHJlcXVpcmUoJ3Zkb20tc2VyaWFsaXplZC1wYXRjaC9zZXJpYWxpemUnKTtcbnZhciBwYXRobmFtZU1hdGNoID0gcmVxdWlyZSgncGF0aG5hbWUtbWF0Y2gnKTtcbnZhciBoYXNoTWF0Y2ggPSByZXF1aXJlKCdoYXNoLW1hdGNoJyk7XG5cbnZhciBtc2cgPSByZXF1aXJlKCcuL21zZycpO1xudmFyIGRvbUV2ZW50ID0gcmVxdWlyZSgnLi9kb21FdmVudCcpO1xudmFyIGxvY2FsU3RvcmFnZSA9IHJlcXVpcmUoJy4vbG9jYWxTdG9yYWdlJyk7XG5cbmZ1bmN0aW9uIGFwcFRocmVhZChzZWxmLCBhcHAsIG9wdGlvbnMpIHtcbiAgICB2YXIgY3VycmVudFZET00sIHZpZXcsIHJvdXRlciwgaW5pdGlhbEhSRUY7XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoc3RhdGUpIHtcbiAgICAgICAgdmFyIG5leHRWRE9NLCBkaWZmLCBwYXRjaDtcblxuICAgICAgICBuZXh0VkRPTSA9IHZpZXcoc3RhdGUpO1xuICAgICAgICBkaWZmID0gdmRvbS5kaWZmKGN1cnJlbnRWRE9NLCBuZXh0VkRPTSk7XG4gICAgICAgIHBhdGNoID0gc2VyaWFsaXplKGRpZmYpO1xuICAgICAgICBjdXJyZW50VkRPTSA9IG5leHRWRE9NO1xuXG4gICAgICAgIGRvbUV2ZW50LmN5Y2xlSGFuZGxlcnMoKTtcblxuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdET01fUEFUQ0gnLFxuICAgICAgICAgICAgZGF0YTogcGF0Y2hcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdChfdmlldywgbW9kZWwsIF9yb3V0ZXIpIHtcbiAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndHJpZWQgdG8gaW5pdGlhbGlzZSBhcHAgbW9yZSB0aGFuIG9uY2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZpZXcgPSBfdmlldztcbiAgICAgICAgY3VycmVudFZET00gPSB2ZG9tLmgoJ2RpdicpO1xuICAgICAgICByZW5kZXIobW9kZWwoKSk7XG4gICAgICAgIG1vZGVsKHJlbmRlcik7XG5cbiAgICAgICAgcm91dGVyID0gX3JvdXRlcjtcbiAgICAgICAgb25Mb2NhdGlvbihpbml0aWFsSFJFRik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25SZWFkeShkYXRhKSB7XG4gICAgICAgIGluaXRpYWxIUkVGID0gZGF0YTtcbiAgICAgICAgYXBwKGluaXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTG9jYXRpb24oZGF0YSkge1xuICAgICAgICB2YXIgcm91dGUsIHNwbGl0TG9jYXRpb247XG5cbiAgICAgICAgaWYgKHR5cGVvZiByb3V0ZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3B0aW9ucy5pc0hhc2hSb3V0ZXIpIHtcblxuICAgICAgICAgICAgcm91dGUgPSBwYXRobmFtZU1hdGNoKGRhdGEpO1xuXG4gICAgICAgICAgICBpZiAoIXJvdXRlLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgcm91dGUgPSAnLyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgc3BsaXRMb2NhdGlvbiA9IGRhdGEuc3BsaXQoJyMnKTtcblxuICAgICAgICAgICAgaWYgKHNwbGl0TG9jYXRpb24ubGVuZ3RoID4gMSkge1xuXG4gICAgICAgICAgICAgICAgc3BsaXRMb2NhdGlvbi5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgcm91dGUgPSBoYXNoTWF0Y2goJyMnLmNvbmNhdChzcGxpdExvY2F0aW9uLmpvaW4oJyMnKSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm91dGUpIHtcbiAgICAgICAgICAgIHJvdXRlcihyb3V0ZSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uRG9tRXZlbnQoZGF0YSkge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGRvbUV2ZW50LmdldEhhbmRsZXIoZGF0YS5oYW5kbGVyS2V5KTtcblxuICAgICAgICBpZiAoaGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Mb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGxvY2FsU3RvcmFnZS5nZXRIYW5kbGVyKGRhdGEuaGFuZGxlcktleSk7XG5cbiAgICAgICAgaWYgKGhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgaGFuZGxlcihkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2VUeXBlKHR5cGUsIGRhdGEpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdSRUFEWSc6XG4gICAgICAgICAgICAgICAgb25SZWFkeShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0xPQ0FUSU9OJzpcbiAgICAgICAgICAgICAgICBvbkxvY2F0aW9uKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnRE9NX0VWRU5UJzpcbiAgICAgICAgICAgICAgICBvbkRvbUV2ZW50KGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnTE9DQUxfU1RPUkFHRSc6XG4gICAgICAgICAgICAgICAgb25Mb2NhbFN0b3JhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5vbm1lc3NhZ2UgPSBtc2coaGFuZGxlTWVzc2FnZVR5cGUsIG9wdGlvbnMuaXNEZWJ1ZyAmJiAnVVNFUicpO1xuXG4gICAgcmV0dXJuIHNlbGYucG9zdE1lc3NhZ2UuYmluZChzZWxmKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBUaHJlYWQ7XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgneHRlbmQvbXV0YWJsZScpO1xudmFyIGNzanMgPSByZXF1aXJlKCdjc2pzJyk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBxdWV1ZSA9IFtdO1xudmFyIHBvc3Q7XG5cbmZ1bmN0aW9uIGluaXQoX3Bvc3QpIHtcbiAgICBpZiAodHlwZW9mIHBvc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zdCA9IF9wb3N0O1xuICAgICAgICBmbHVzaCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgaWYgKHR5cGVvZiBwb3N0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdoaWxlIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBvc3Qoe3R5cGU6ICdDU1MnLCBkYXRhOiBxdWV1ZS5zaGlmdCgpfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNzcygpIHtcbiAgICB2YXIgYXJncywgc3R5bGVzO1xuXG4gICAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBzdHlsZXMgPSBjc2pzLmFwcGx5KG51bGwsIGFyZ3MpO1xuXG4gICAgcXVldWUucHVzaChjc2pzLmdldENzcyhzdHlsZXMpKTtcblxuICAgIGZsdXNoKCk7XG5cbiAgICByZXR1cm4gc3R5bGVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChjc3MsIHtcbiAgICBpbml0OiBpbml0IC8vIFsxXVxufSk7XG5cbi8vIFsxXSBUT0RPOiBUaGVzZSBzaG91bGQgbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBBUElcbiIsInZhciBleHRlbmQgPSByZXF1aXJlKCd4dGVuZC9tdXRhYmxlJyk7XG52YXIgdmRvbSA9IHJlcXVpcmUoJ3ZpcnR1YWwtZG9tJyk7XG52YXIgaHlwZXJzdHlsZXMgPSByZXF1aXJlKCdoeXBlcnN0eWxlcycpO1xudmFyIGh5cGVyeCA9IHJlcXVpcmUoJ2h5cGVyeCcpO1xuXG5mdW5jdGlvbiBkb21Gb3Ioc3R5bGVzKSB7XG4gICAgcmV0dXJuIGh5cGVyeChoeXBlcnN0eWxlcyh2ZG9tLmgsIHN0eWxlcykpO1xufVxuXG52YXIgZG9tID0gaHlwZXJ4KHZkb20uaCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKGRvbSwge1xuICAgIGRvbUZvcjogZG9tRm9yXG59KTtcbiIsInZhciBleHRlbmQgPSByZXF1aXJlKCd4dGVuZC9tdXRhYmxlJyk7XG5cbnZhciBkb21FdmVudE5hbWVzID0gcmVxdWlyZSgnLi9kb21FdmVudE5hbWVzJyk7XG5cbnZhciBuZXh0SGFuZGxlcktleSA9IDA7XG52YXIgY3VycmVudEhhbmRsZXJzID0ge307XG52YXIgbmV4dEhhbmRsZXJzID0ge307XG5cbmZ1bmN0aW9uIGRvbUV2ZW50KG1vZGVsLCBmbiwgY3VzdG9tRGF0YSkge1xuICAgIHZhciBoYW5kbGVyS2V5O1xuXG4gICAgaGFuZGxlcktleSA9IG5leHRIYW5kbGVyS2V5Kys7XG5cbiAgICBuZXh0SGFuZGxlcnNbaGFuZGxlcktleV0gPSBmdW5jdGlvbiBoYW5kbGUoZGF0YSkge1xuICAgICAgICBmbihtb2RlbCwge1xuICAgICAgICAgICAgZXZlbnQ6IGRhdGEuZXZlbnREYXRhLFxuICAgICAgICAgICAgZm9ybTogZGF0YS5mb3JtRGF0YSxcbiAgICAgICAgICAgIGN1c3RvbTogY3VzdG9tRGF0YVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGhhbmRsZXJLZXk7XG59XG5cbmZ1bmN0aW9uIGZvck1vZGVsKGZuLCBjdXN0b21EYXRhKSB7XG4gICAgcmV0dXJuIGRvbUV2ZW50KHRoaXMsIGZuLCBjdXN0b21EYXRhKTtcbn1cblxuZnVuY3Rpb24gZ2V0SGFuZGxlcihoYW5kbGVyS2V5KSB7XG4gICAgcmV0dXJuIGN1cnJlbnRIYW5kbGVyc1toYW5kbGVyS2V5XTtcbn1cblxuZnVuY3Rpb24gY3ljbGVIYW5kbGVycygpIHtcbiAgICBjdXJyZW50SGFuZGxlcnMgPSBuZXh0SGFuZGxlcnM7XG4gICAgbmV4dEhhbmRsZXJzID0ge307XG4gICAgbmV4dEhhbmRsZXJLZXkgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChkb21FdmVudCwge1xuICAgIGRvbUV2ZW50TmFtZXM6IGRvbUV2ZW50TmFtZXMsXG4gICAgZm9yTW9kZWw6IGZvck1vZGVsLFxuICAgIGdldEhhbmRsZXI6IGdldEhhbmRsZXIsIC8vIFsxXVxuICAgIGN5Y2xlSGFuZGxlcnM6IGN5Y2xlSGFuZGxlcnMgLy8gWzFdXG59KTtcblxuLy8gWzFdIFRPRE86IFRoZXNlIHNob3VsZCBub3QgcGFydCBvZiB0aGUgcHVibGljIEFQSVxuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvRXZlbnRzXG5cbm1vZHVsZS5leHBvcnRzID0gW1xuXG4gICAgLy8gQ1NTT01cbiAgICAnYW5pbWF0aW9uZW5kJyxcblx0J2FuaW1hdGlvbml0ZXJhdGlvbicsXG5cdCdhbmltYXRpb25zdGFydCcsXG5cdCd0cmFuc2l0aW9uZW5kJyxcblxuICAgIC8vIERPTVxuXHQnYWJvcnQnLFxuXHQnYmVmb3JlaW5wdXQnLFxuXHQnYmx1cicsXG5cdCdjbGljaycsXG5cdCdjb21wb3NpdGlvbmVuZCcsXG5cdCdjb21wb3NpdGlvbnN0YXJ0Jyxcblx0J2NvbXBvc2l0aW9udXBkYXRlJyxcblx0J2RibGNsaWNrJyxcblx0J2Vycm9yJyxcblx0J2ZvY3VzJyxcblx0J2ZvY3VzaW4nLFxuXHQnZm9jdXNvdXQnLFxuXHQnaW5wdXQnLFxuXHQna2V5ZG93bicsXG5cdCdrZXl1cCcsXG5cdCdsb2FkJyxcblx0J21vdXNlZG93bicsXG5cdCdtb3VzZWVudGVyJyxcblx0J21vdXNlbGVhdmUnLFxuXHQnbW91c2Vtb3ZlJyxcblx0J21vdXNlb3V0Jyxcblx0J21vdXNlb3ZlcicsXG5cdCdtb3VzZXVwJyxcblx0J3Jlc2l6ZScsXG5cdCdzY3JvbGwnLFxuXHQnc2VsZWN0Jyxcblx0J3VubG9hZCcsXG5cdCd3aGVlbCcsXG5cbiAgICAvLyBIVE1MIERPTVxuXHQnRE9NQ29udGVudExvYWRlZCcsXG5cdC8vICdhYm9ydCcsXG5cdCdhZnRlcnByaW50Jyxcblx0J2FmdGVyc2NyaXB0ZXhlY3V0ZScsXG5cdCdhdXRvY29tcGxldGUnLFxuXHQnYXV0b2NvbXBsZXRlZXJyb3InLFxuXHQnYmVmb3JlcHJpbnQnLFxuXHQnYmVmb3Jlc2NyaXB0ZXhlY3V0ZScsXG5cdCdiZWZvcmV1bmxvYWQnLFxuXHQvLyAnYmx1cicsXG5cdCdjYW5jZWwnLFxuXHQnY2FucGxheScsXG5cdCdjYW5wbGF5dGhyb3VnaCcsXG5cdCdjaGFuZ2UnLFxuXHQvLyAnY2xpY2snLFxuXHQnY2xvc2UnLFxuXHQnY29ubmVjdCcsXG5cdCdjb250ZXh0bWVudScsXG5cdCdkdXJhdGlvbmNoYW5nZScsXG5cdCdlbXB0aWVkJyxcblx0J2Vycm9yJyxcblx0Ly8gJ2ZvY3VzJyxcblx0J2hhc2hjaGFuZ2UnLFxuXHQvLyAnaW5wdXQnLFxuXHQnaW52YWxpZCcsXG5cdCdsYW5ndWFnZWNoYW5nZScsXG5cdC8vICdsb2FkJyxcblx0J2xvYWRlZGRhdGEnLFxuXHQnbG9hZGVkbWV0YWRhdGEnLFxuXHQnbG9hZGVuZCcsXG5cdCdsb2Fkc3RhcnQnLFxuXHQnbWVzc2FnZScsXG5cdCdvZmZsaW5lJyxcblx0J29ubGluZScsXG5cdCdvcGVuJyxcblx0J3BhZ2VoaWRlJyxcblx0J3BhZ2VzaG93Jyxcblx0J3BsYXknLFxuXHQncGxheWluZycsXG5cdCdwb3BzdGF0ZScsXG5cdCdwcm9ncmVzcycsXG5cdCdyZWFkeXN0YXRlY2hhbmdlJyxcblx0J3Jlc2V0Jyxcblx0J3NlZWtlZCcsXG5cdCdzZWVraW5nJyxcblx0J3NlbGVjdCcsXG5cdCdzaG93Jyxcblx0J3NvcnQnLFxuXHQnc3RhbGxlZCcsXG5cdCdzdG9yYWdlJyxcblx0J3N1Ym1pdCcsXG5cdCdzdXNwZW5kJyxcblx0J3RpbWV1cGRhdGUnLFxuXHQndG9nZ2xlJyxcblx0Ly8gJ3VubG9hZCcsXG5cdCd2b2x1bWVjaGFuZ2UnLFxuXHQnd2FpdGluZycsXG5cbiAgICAvLyBIVE1MIERyYWcgYW5kIERyb3AgQVBJXG4gICAgJ2RyYWcnLFxuXHQnZHJhZ2VuZCcsXG5cdCdkcmFnZW50ZXInLFxuXHQnZHJhZ2V4aXQnLFxuXHQnZHJhZ2xlYXZlJyxcblx0J2RyYWdvdmVyJyxcblx0J2RyYWdzdGFydCcsXG5cdCdkcm9wJyxcblxuICAgIC8vIFBvaW50ZXJcblx0J2dvdHBvaW50ZXJjYXB0dXJlJyxcblx0J2xvc3Rwb2ludGVyY2FwdHVyZScsXG5cdCdwb2ludGVyY2FuY2VsJyxcblx0J3BvaW50ZXJkb3duJyxcblx0J3BvaW50ZXJlbnRlcicsXG5cdCdwb2ludGVybGVhdmUnLFxuXHQncG9pbnRlcm1vdmUnLFxuXHQncG9pbnRlcm91dCcsXG5cdCdwb2ludGVyb3ZlcicsXG5cdCdwb2ludGVydXAnLFxuXG4gICAgLy8gU2VsZWN0aW9uXG5cdCdzZWxlY3Rpb25jaGFuZ2UnLFxuXHQnc2VsZWN0c3RhcnQnLFxuXG4gICAgLy8gVG91Y2hcblx0J3RvdWNoY2FuY2VsJyxcblx0J3RvdWNoZW5kJyxcblx0J3RvdWNobW92ZScsXG5cdCd0b3VjaHN0YXJ0J1xuXG5dO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kL211dGFibGUnKTtcblxudmFyIHVzZXJUaHJlYWQgPSByZXF1aXJlKCcuL3VzZXJUaHJlYWQnKTtcbnZhciBhcHBUaHJlYWQgPSByZXF1aXJlKCcuL2FwcFRocmVhZCcpO1xudmFyIFNpbmdsZVRocmVhZCA9IHJlcXVpcmUoJy4vU2luZ2xlVGhyZWFkJyk7XG5cbnZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xudmFyIGRvbUV2ZW50ID0gcmVxdWlyZSgnLi9kb21FdmVudCcpO1xuXG52YXIgbW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyk7XG52YXIgbG9jYWxTdG9yYWdlID0gcmVxdWlyZSgnLi9sb2NhbFN0b3JhZ2UnKTtcbnZhciBjc3MgPSByZXF1aXJlKCcuL2NzcycpO1xudmFyIHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5cbnZhciBXT1JLRVJfRU5BQkxFRCA9ICEhKGdsb2JhbCA9PT0gZ2xvYmFsLndpbmRvdyAmJiBnbG9iYWwuVVJMICYmIGdsb2JhbC5Xb3JrZXIpO1xudmFyIElOX1dPUktFUl9DT05URVhUID0gISEoZ2xvYmFsID09PSBnbG9iYWwuc2VsZiAmJiBnbG9iYWwubG9jYXRpb24pO1xudmFyIFBBVEhOQU1FID0gV09SS0VSX0VOQUJMRUQgJiYgKGZ1bmN0aW9uIGdldFBhdGhuYW1lKCkge1xuICAgIHZhciBzY3JpcHRzLCBzY3JpcHQ7XG5cbiAgICBzY3JpcHRzID0gZ2xvYmFsLmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgICBzY3JpcHQgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjO1xuXG4gICAgcmV0dXJuIG5ldyBnbG9iYWwuVVJMKHNjcmlwdCkucGF0aG5hbWU7XG59KSgpO1xuXG5mdW5jdGlvbiBkdWV0KGFwcCwgc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2luZ2xlVGhyZWFkO1xuXG4gICAgZnVuY3Rpb24gaW5pdEFQSShwb3N0TWVzc2FnZVRvVXNlcikge1xuICAgICAgICBsb2NhbFN0b3JhZ2UuaW5pdChwb3N0TWVzc2FnZVRvVXNlcik7XG4gICAgICAgIGNzcy5pbml0KHBvc3RNZXNzYWdlVG9Vc2VyKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gKHR5cGVvZiBvcHRpb25zID09ICdvYmplY3QnICYmIG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucykgfHwge307XG5cbiAgICBpZiAoIW9wdGlvbnMuZm9yY2VTaW5nbGVUaHJlYWQpIHtcblxuICAgICAgICBpZiAoV09SS0VSX0VOQUJMRUQpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyVGhyZWFkKG5ldyBnbG9iYWwuV29ya2VyKFBBVEhOQU1FKSwgc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKElOX1dPUktFUl9DT05URVhUKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdEFQSShhcHBUaHJlYWQoZ2xvYmFsLnNlbGYsIGFwcCwgb3B0aW9ucykpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBzaW5nbGVUaHJlYWQgPSBuZXcgU2luZ2xlVGhyZWFkKCk7XG4gICAgdXNlclRocmVhZChzaW5nbGVUaHJlYWQud29ya2VyLCBzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgaW5pdEFQSShhcHBUaHJlYWQoc2luZ2xlVGhyZWFkLnNlbGYsIGFwcCwgb3B0aW9ucykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChkdWV0LCB7XG5cbiAgICBkb206IGRvbSxcbiAgICBkb21Gb3I6IGRvbS5kb21Gb3IsXG5cbiAgICBkb21FdmVudDogZG9tRXZlbnQsXG4gICAgZXZlbnQ6IGRvbUV2ZW50LCAvLyBhbGlhc1xuICAgIGV2OiBkb21FdmVudCwgLy8gYWxpYXNcblxuICAgIG1vZGVsOiBtb2RlbCxcbiAgICBtb2RlbEZvcjogbW9kZWwubW9kZWxGb3IsXG4gICAgc3RydWN0OiBtb2RlbC5zdHJ1Y3QsXG4gICAgdmFyaGFzaDogbW9kZWwudmFyaGFzaCxcbiAgICB2YWx1ZTogbW9kZWwudmFsdWUsXG5cbiAgICBsb2NhbFN0b3JhZ2U6IGxvY2FsU3RvcmFnZSxcblxuICAgIGNzczogY3NzLFxuXG4gICAgcm91dGVyOiByb3V0ZXJcbn0pO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlrZFdWMEwyeHBZaTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJR1Y0ZEdWdVpDQTlJSEpsY1hWcGNtVW9KM2gwWlc1a0wyMTFkR0ZpYkdVbktUdGNibHh1ZG1GeUlIVnpaWEpVYUhKbFlXUWdQU0J5WlhGMWFYSmxLQ2N1TDNWelpYSlVhSEpsWVdRbktUdGNiblpoY2lCaGNIQlVhSEpsWVdRZ1BTQnlaWEYxYVhKbEtDY3VMMkZ3Y0ZSb2NtVmhaQ2NwTzF4dWRtRnlJRk5wYm1kc1pWUm9jbVZoWkNBOUlISmxjWFZwY21Vb0p5NHZVMmx1WjJ4bFZHaHlaV0ZrSnlrN1hHNWNiblpoY2lCa2IyMGdQU0J5WlhGMWFYSmxLQ2N1TDJSdmJTY3BPMXh1ZG1GeUlHUnZiVVYyWlc1MElEMGdjbVZ4ZFdseVpTZ25MaTlrYjIxRmRtVnVkQ2NwTzF4dVhHNTJZWElnYlc5a1pXd2dQU0J5WlhGMWFYSmxLQ2N1TDIxdlpHVnNKeWs3WEc1MllYSWdiRzlqWVd4VGRHOXlZV2RsSUQwZ2NtVnhkV2x5WlNnbkxpOXNiMk5oYkZOMGIzSmhaMlVuS1R0Y2JuWmhjaUJqYzNNZ1BTQnlaWEYxYVhKbEtDY3VMMk56Y3ljcE8xeHVkbUZ5SUhKdmRYUmxjaUE5SUhKbGNYVnBjbVVvSnk0dmNtOTFkR1Z5SnlrN1hHNWNiblpoY2lCWFQxSkxSVkpmUlU1QlFreEZSQ0E5SUNFaEtHZHNiMkpoYkNBOVBUMGdaMnh2WW1Gc0xuZHBibVJ2ZHlBbUppQm5iRzlpWVd3dVZWSk1JQ1ltSUdkc2IySmhiQzVYYjNKclpYSXBPMXh1ZG1GeUlFbE9YMWRQVWt0RlVsOURUMDVVUlZoVUlEMGdJU0VvWjJ4dlltRnNJRDA5UFNCbmJHOWlZV3d1YzJWc1ppQW1KaUJuYkc5aVlXd3ViRzlqWVhScGIyNHBPMXh1ZG1GeUlGQkJWRWhPUVUxRklEMGdWMDlTUzBWU1gwVk9RVUpNUlVRZ0ppWWdLR1oxYm1OMGFXOXVJR2RsZEZCaGRHaHVZVzFsS0NrZ2UxeHVJQ0FnSUhaaGNpQnpZM0pwY0hSekxDQnpZM0pwY0hRN1hHNWNiaUFnSUNCelkzSnBjSFJ6SUQwZ1oyeHZZbUZzTG1SdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SelFubFVZV2RPWVcxbEtDZHpZM0pwY0hRbktUdGNiaUFnSUNCelkzSnBjSFFnUFNCelkzSnBjSFJ6VzNOamNtbHdkSE11YkdWdVozUm9JQzBnTVYwdWMzSmpPMXh1WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJuYkc5aVlXd3VWVkpNS0hOamNtbHdkQ2t1Y0dGMGFHNWhiV1U3WEc1OUtTZ3BPMXh1WEc1bWRXNWpkR2x2YmlCa2RXVjBLR0Z3Y0N3Z2MyVnNaV04wYjNJc0lHOXdkR2x2Ym5NcElIdGNiaUFnSUNCMllYSWdjMmx1WjJ4bFZHaHlaV0ZrTzF4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnYVc1cGRFRlFTU2h3YjNOMFRXVnpjMkZuWlZSdlZYTmxjaWtnZTF4dUlDQWdJQ0FnSUNCc2IyTmhiRk4wYjNKaFoyVXVhVzVwZENod2IzTjBUV1Z6YzJGblpWUnZWWE5sY2lrN1hHNGdJQ0FnSUNBZ0lHTnpjeTVwYm1sMEtIQnZjM1JOWlhOellXZGxWRzlWYzJWeUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCdmNIUnBiMjV6SUQwZ0tIUjVjR1Z2WmlCdmNIUnBiMjV6SUQwOUlDZHZZbXBsWTNRbklDWW1JRzl3ZEdsdmJuTWdJVDA5SUc1MWJHd2dKaVlnYjNCMGFXOXVjeWtnZkh3Z2UzMDdYRzVjYmlBZ0lDQnBaaUFvSVc5d2RHbHZibk11Wm05eVkyVlRhVzVuYkdWVWFISmxZV1FwSUh0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvVjA5U1MwVlNYMFZPUVVKTVJVUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCMWMyVnlWR2h5WldGa0tHNWxkeUJuYkc5aVlXd3VWMjl5YTJWeUtGQkJWRWhPUVUxRktTd2djMlZzWldOMGIzSXNJRzl3ZEdsdmJuTXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLRWxPWDFkUFVrdEZVbDlEVDA1VVJWaFVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXNXBkRUZRU1NoaGNIQlVhSEpsWVdRb1oyeHZZbUZzTG5ObGJHWXNJR0Z3Y0N3Z2IzQjBhVzl1Y3lrcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQjlYRzVjYmlBZ0lDQnphVzVuYkdWVWFISmxZV1FnUFNCdVpYY2dVMmx1WjJ4bFZHaHlaV0ZrS0NrN1hHNGdJQ0FnZFhObGNsUm9jbVZoWkNoemFXNW5iR1ZVYUhKbFlXUXVkMjl5YTJWeUxDQnpaV3hsWTNSdmNpd2diM0IwYVc5dWN5azdYRzRnSUNBZ2FXNXBkRUZRU1NoaGNIQlVhSEpsWVdRb2MybHVaMnhsVkdoeVpXRmtMbk5sYkdZc0lHRndjQ3dnYjNCMGFXOXVjeWtwTzF4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1Y0ZEdWdVpDaGtkV1YwTENCN1hHNWNiaUFnSUNCa2IyMDZJR1J2YlN4Y2JpQWdJQ0JrYjIxR2IzSTZJR1J2YlM1a2IyMUdiM0lzWEc1Y2JpQWdJQ0JrYjIxRmRtVnVkRG9nWkc5dFJYWmxiblFzWEc0Z0lDQWdaWFpsYm5RNklHUnZiVVYyWlc1MExDQXZMeUJoYkdsaGMxeHVJQ0FnSUdWMk9pQmtiMjFGZG1WdWRDd2dMeThnWVd4cFlYTmNibHh1SUNBZ0lHMXZaR1ZzT2lCdGIyUmxiQ3hjYmlBZ0lDQnRiMlJsYkVadmNqb2diVzlrWld3dWJXOWtaV3hHYjNJc1hHNGdJQ0FnYzNSeWRXTjBPaUJ0YjJSbGJDNXpkSEoxWTNRc1hHNGdJQ0FnZG1GeWFHRnphRG9nYlc5a1pXd3VkbUZ5YUdGemFDeGNiaUFnSUNCMllXeDFaVG9nYlc5a1pXd3VkbUZzZFdVc1hHNWNiaUFnSUNCc2IyTmhiRk4wYjNKaFoyVTZJR3h2WTJGc1UzUnZjbUZuWlN4Y2JseHVJQ0FnSUdOemN6b2dZM056TEZ4dVhHNGdJQ0FnY205MWRHVnlPaUJ5YjNWMFpYSmNibjBwTzF4dUlsMTkiLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgneHRlbmQvbXV0YWJsZScpO1xuXG52YXIgbmV4dEhhbmRsZXJLZXkgPSAwO1xudmFyIGhhbmRsZXJzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBwb3N0O1xuXG5mdW5jdGlvbiBpbml0KF9wb3N0KSB7XG4gICAgaWYgKHR5cGVvZiBwb3N0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc3QgPSBfcG9zdDtcbiAgICAgICAgZmx1c2goKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGlmICh0eXBlb2YgcG9zdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3aGlsZSAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBwb3N0KHt0eXBlOiAnTE9DQUxfU1RPUkFHRScsIGRhdGE6IHF1ZXVlLnNoaWZ0KCl9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0SGFuZGxlcihoYW5kbGVyS2V5KSB7XG4gICAgcmV0dXJuIGhhbmRsZXJzW2hhbmRsZXJLZXldO1xufVxuXG5mdW5jdGlvbiBsb2NhbFN0b3JhZ2Uoa2V5LCB2YWx1ZU9yRm4pIHtcbiAgICB2YXIgaGFuZGxlcktleTtcblxuICAgIGlmICh0eXBlb2YgdmFsdWVPckZuID09PSAnZnVuY3Rpb24nKSB7XG5cbiAgICAgICAgaGFuZGxlcktleSA9IG5leHRIYW5kbGVyS2V5Kys7XG5cbiAgICAgICAgaGFuZGxlcnNbaGFuZGxlcktleV0gPSBmdW5jdGlvbiBoYW5kbGUoZGF0YSkge1xuICAgICAgICAgICAgdmFsdWVPckZuKGRhdGEudmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHF1ZXVlLnB1c2goe2hhbmRsZXJLZXk6IGhhbmRsZXJLZXksIGtleToga2V5fSk7XG5cbiAgICAgICAgZmx1c2goKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlcktleTtcblxuICAgIH1cblxuICAgIHF1ZXVlLnB1c2goe2tleToga2V5LCB2YWx1ZTogdmFsdWVPckZufSk7XG5cbiAgICBmbHVzaCgpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKGxvY2FsU3RvcmFnZSwge1xuICAgIGluaXQ6IGluaXQsIC8vIFsxXVxuICAgIGdldEhhbmRsZXI6IGdldEhhbmRsZXIgLy8gWzFdXG59KTtcblxuLy8gWzFdIFRPRE86IFRoZXNlIHNob3VsZCBub3QgcGFydCBvZiB0aGUgcHVibGljIEFQSVxuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kL211dGFibGUnKTtcbnZhciBzdHJ1Y3QgPSByZXF1aXJlKCdvYnNlcnYtc3RydWN0Jyk7XG52YXIgdmFyaGFzaCA9IHJlcXVpcmUoJ29ic2Vydi12YXJoYXNoJyk7XG52YXIgdmFsdWUgPSByZXF1aXJlKCdvYnNlcnYnKTtcblxudmFyIGZvck1vZGVsID0gcmVxdWlyZSgnLi9kb21FdmVudCcpLmZvck1vZGVsO1xuXG52YXIgbW9kZWxzID0gW107XG5cbmZ1bmN0aW9uIG1vZGVsRm9yKHN0YXRlKSB7XG4gICAgdmFyIG1vZGVsO1xuXG4gICAgaWYgKHN0YXRlLl9fTU9ERUxfUkVGRVJFTkNFX18gPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ19fTU9ERUxfUkVGRVJFTkNFX18gbm90IGZvdW5kIG9uIHN0YXRlJyk7XG4gICAgfVxuXG4gICAgbW9kZWwgPSBtb2RlbHNbc3RhdGUuX19NT0RFTF9SRUZFUkVOQ0VfX107XG5cbiAgICBpZiAobW9kZWwgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ19fTU9ERUxfUkVGRVJFTkNFX18gaXMgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbDtcbn1cblxuXG5mdW5jdGlvbiBtb2RlbChzdGF0ZSkge1xuICAgIHZhciBtb2RlbDtcblxuICAgIHN0YXRlID0gdHlwZW9mIHN0YXRlID09PSAnb2JqZWN0JyA/IHN0YXRlIDoge307XG5cbiAgICBpZiAoc3RhdGUuX19NT0RFTF9SRUZFUkVOQ0VfXyAhPSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJfX01PREVMX1JFRkVSRU5DRV9fXCIgaXMgYSByZXNlcnZlZCBrZXknKTtcbiAgICB9XG5cbiAgICBzdGF0ZS5fX01PREVMX1JFRkVSRU5DRV9fID0gbW9kZWxzLmxlbmd0aDtcblxuICAgIGlmIChzdGF0ZS5ldmVudCAhPSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJldmVudFwiIGlzIGEgcmVzZXJ2ZWQga2V5Jyk7XG4gICAgfVxuXG4gICAgbW9kZWwgPSBzdHJ1Y3Qoc3RhdGUpO1xuXG4gICAgbW9kZWwuZXZlbnQgPSBmb3JNb2RlbDtcbiAgICBtb2RlbC5ldiA9IGZvck1vZGVsOyAvLyBhbGlhc1xuXG4gICAgbW9kZWxzLnB1c2gobW9kZWwpO1xuXG4gICAgcmV0dXJuIG1vZGVsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChtb2RlbCwge1xuICAgIHN0cnVjdDogc3RydWN0LFxuICAgIHZhcmhhc2g6IHZhcmhhc2gsXG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIG1vZGVsRm9yOiBtb2RlbEZvclxufSk7XG4iLCJ2YXIgY29uc29sZSA9IHJlcXVpcmUoJ2NvbnNvbGUnKTtcblxuZnVuY3Rpb24gbXNnKGhhbmRsZU1lc3NhZ2VUeXBlLCBsb2dTb3VyY2UpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgICAgICBpZiAobG9nU291cmNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGxvZ1NvdXJjZSArICc6OicgKyBldmVudC5kYXRhLnR5cGUsIGV2ZW50LmRhdGEuZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGFuZGxlTWVzc2FnZVR5cGUoZXZlbnQuZGF0YS50eXBlLCBldmVudC5kYXRhLmRhdGEpO1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbXNnO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCd3YXlmYXJlcicpO1xuIiwidmFyIGluc2VydENTUyA9IHJlcXVpcmUoJ2luc2VydC1jc3MnKTtcbnZhciBnZXRGb3JtRGF0YSA9IHJlcXVpcmUoJ2Zvcm0tZGF0YS1zZXQvZWxlbWVudCcpO1xudmFyIHBhdGNoID0gcmVxdWlyZSgndmRvbS1zZXJpYWxpemVkLXBhdGNoL3BhdGNoJyk7XG52YXIgY29uY2F0ID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdDtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxudmFyIG1zZyA9IHJlcXVpcmUoJy4vbXNnJyk7XG52YXIgZG9tRXZlbnROYW1lcyA9IHJlcXVpcmUoJy4vZG9tRXZlbnQnKS5kb21FdmVudE5hbWVzO1xuXG5mdW5jdGlvbiB1c2VyVGhyZWFkKHdvcmtlciwgc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGFpbmVyLCB0YXJnZXQsIGRvbUV2ZW50TGlzdGVuZXJzO1xuXG4gICAgZnVuY3Rpb24gZG9tRXZlbnRIYW5kbGVyKGV2ZW50TmFtZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJLZXksIGV2ZW50RGF0YSwgZm9ybURhdGE7XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvcHNSZWR1Y2VyKHByb3BzLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGV2ZW50W2tleV07XG5cbiAgICAgICAgICAgIGlmIChrZXkuY2hhckF0KDApID09PSBrZXkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgJiYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpKSB7XG5cbiAgICAgICAgICAgICAgICBwcm9wc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgICAgfVxuXG4gICAgICAgIGhhbmRsZXJLZXkgPSBldmVudC50YXJnZXQuZGF0YXNldFtldmVudE5hbWVdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlcktleSA9PT0gJ3N0cmluZycpIHtcblxuICAgICAgICAgICAgZXZlbnREYXRhID0gT2JqZWN0LmtleXMoZXZlbnQuY29uc3RydWN0b3IucHJvdG90eXBlKS5yZWR1Y2UocHJvcHNSZWR1Y2VyLCB7fSk7XG5cbiAgICAgICAgICAgIGZvcm1EYXRhID0gZ2V0Rm9ybURhdGEoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cCgnXFxcXGInICsgZXZlbnROYW1lICsgJ1xcXFxiJykpLnRlc3QoZXZlbnQudGFyZ2V0LmRhdGFzZXRbJ2RlZmF1bHQnXSkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdET01fRVZFTlQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcktleTogaGFuZGxlcktleSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50RGF0YTogZXZlbnREYXRhLFxuICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YTogZm9ybURhdGFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RlblRvKGRvbUV2ZW50TmFtZSkge1xuICAgICAgICBkb21FdmVudExpc3RlbmVyc1tkb21FdmVudE5hbWVdID0gZG9tRXZlbnRIYW5kbGVyLmJpbmQobnVsbCwgZG9tRXZlbnROYW1lKTtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZG9tRXZlbnROYW1lLCBkb21FdmVudExpc3RlbmVyc1tkb21FdmVudE5hbWVdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmxpc3RlblRvKGRvbUV2ZW50TmFtZSkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21FdmVudE5hbWUsIGRvbUV2ZW50TGlzdGVuZXJzW2RvbUV2ZW50TmFtZV0pO1xuICAgICAgICBkZWxldGUgZG9tRXZlbnRMaXN0ZW5lcnNbZG9tRXZlbnROYW1lXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVEb20oZGF0YSkge1xuICAgICAgICB2YXIgYWN0aXZlRG9tRXZlbnROYW1lcywgYWN0aXZlRWxlbWVudDtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVBY3RpdmVEb21FdmVudHNGb3JEYXRhQXR0cmlidXRlcyhlbCkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoZWwuZGF0YXNldClcbiAgICAgICAgICAgIC5mb3JFYWNoKHVwZGF0ZUFjdGl2ZURvbUV2ZW50c0ZvckRhdGFBdHRyaWJ1dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQWN0aXZlRG9tRXZlbnRzRm9yRGF0YUF0dHJpYnV0ZShrZXkpIHtcbiAgICAgICAgICAgIGlmIChkb21FdmVudE5hbWVzLmluZGV4T2Yoa2V5KSA+IC0xICYmIGFjdGl2ZURvbUV2ZW50TmFtZXMuaW5kZXhPZihrZXkpIDwgMCkge1xuICAgICAgICAgICAgICAgIGFjdGl2ZURvbUV2ZW50TmFtZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlRG9tRXZlbnRCaW5kaW5nKGRvbUV2ZW50TmFtZSkge1xuICAgICAgICAgICAgaWYgKGFjdGl2ZURvbUV2ZW50TmFtZXMuaW5kZXhPZihkb21FdmVudE5hbWUpID4gLTEgJiYgZG9tRXZlbnRMaXN0ZW5lcnNbZG9tRXZlbnROYW1lXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuVG8oZG9tRXZlbnROYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlRG9tRXZlbnROYW1lcy5pbmRleE9mKGRvbUV2ZW50TmFtZSkgPCAwICYmIGRvbUV2ZW50TGlzdGVuZXJzW2RvbUV2ZW50TmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHVubGlzdGVuVG8oZG9tRXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDEpIFBhdGNoIERPTVxuXG4gICAgICAgIHBhdGNoKHRhcmdldCwgZGF0YSk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIDIpIFVwZGF0ZSBET00gZXZlbnQgYmluZGluZ3NcblxuICAgICAgICAgICAgYWN0aXZlRG9tRXZlbnROYW1lcyA9IFtdO1xuXG4gICAgICAgICAgICBjb25jYXQuYXBwbHkodGFyZ2V0LCB0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnKicpKVxuICAgICAgICAgICAgLmZvckVhY2godXBkYXRlQWN0aXZlRG9tRXZlbnRzRm9yRGF0YUF0dHJpYnV0ZXMpO1xuXG4gICAgICAgICAgICBkb21FdmVudE5hbWVzLmZvckVhY2godXBkYXRlRG9tRXZlbnRCaW5kaW5nKTtcblxuICAgICAgICAgICAgLy8gMykgRm9jdXMgZWxlbWVudCBpZiBuZWVkZWRcblxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXV0b2ZvY3VzXScpO1xuXG4gICAgICAgICAgICBpZiAoYWN0aXZlRWxlbWVudCAhPSBudWxsICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Eb21QYXRjaChkYXRhKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlRG9tLmJpbmQobnVsbCwgZGF0YSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnTE9DQUxfU1RPUkFHRScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyS2V5OiBkYXRhLmhhbmRsZXJLZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShkYXRhLmtleSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGRhdGEua2V5LCBkYXRhLnZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkNTUyhkYXRhKSB7XG4gICAgICAgIGluc2VydENTUyhkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlVHlwZSh0eXBlLCBkYXRhKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnRE9NX1BBVENIJzpcbiAgICAgICAgICAgICAgICBvbkRvbVBhdGNoKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnTE9DQUxfU1RPUkFHRSc6XG4gICAgICAgICAgICAgICAgb25Mb2NhbFN0b3JhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdDU1MnOlxuICAgICAgICAgICAgICAgIG9uQ1NTKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgaWYgKGNvbnRhaW5lciA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2VsZWN0b3IgZGlkIG5vdCBtYXRjaCBhbiBlbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmluc2VydEJlZm9yZSh0YXJnZXQsIGNvbnRhaW5lci5maXJzdENoaWxkKTtcblxuICAgIGRvbUV2ZW50TGlzdGVuZXJzID0ge307XG5cbiAgICB3aW5kb3cub25jbGljayA9IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5sb2NhbE5hbWUgIT09ICdhJyB8fFxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmhyZWYgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhvc3QgIT09IGV2ZW50LnRhcmdldC5ob3N0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnTE9DQVRJT04nLFxuICAgICAgICAgICAgZGF0YTogZXZlbnQudGFyZ2V0LmhyZWZcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBudWxsLCBldmVudC50YXJnZXQuaHJlZilcbiAgICB9XG5cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uIG9uUG9wU3RhdGUoKSB7XG4gICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnTE9DQVRJT04nLFxuICAgICAgICAgICAgZGF0YTogZG9jdW1lbnQubG9jYXRpb24uaHJlZlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3b3JrZXIub25tZXNzYWdlID0gbXNnKGhhbmRsZU1lc3NhZ2VUeXBlLCBvcHRpb25zLmlzRGVidWcgJiYgJ0FQUCcpO1xuXG4gICAgd29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ1JFQURZJyxcbiAgICAgICAgZGF0YTogZG9jdW1lbnQubG9jYXRpb24uaHJlZlxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXJUaHJlYWQ7XG4iLCIvLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gd2hlbiB1c2VkIGluIG5vZGUsIHRoaXMgd2lsbCBhY3R1YWxseSBsb2FkIHRoZSB1dGlsIG1vZHVsZSB3ZSBkZXBlbmQgb25cbi8vIHZlcnN1cyBsb2FkaW5nIHRoZSBidWlsdGluIHV0aWwgbW9kdWxlIGFzIGhhcHBlbnMgb3RoZXJ3aXNlXG4vLyB0aGlzIGlzIGEgYnVnIGluIG5vZGUgbW9kdWxlIGxvYWRpbmcgYXMgZmFyIGFzIEkgYW0gY29uY2VybmVkXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG5cbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gc3RhY2tTdGFydEZ1bmN0aW9uLm5hbWU7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7XG4gIGlmICh1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgIHJldHVybiAnJyArIHZhbHVlO1xuICB9XG4gIGlmICh1dGlsLmlzTnVtYmVyKHZhbHVlKSAmJiAhaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgaWYgKHV0aWwuaXNGdW5jdGlvbih2YWx1ZSkgfHwgdXRpbC5pc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocykpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeShzZWxmLmFjdHVhbCwgcmVwbGFjZXIpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5leHBlY3RlZCwgcmVwbGFjZXIpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmICh1dGlsLmlzQnVmZmVyKGFjdHVhbCkgJiYgdXRpbC5pc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICBpZiAoYWN0dWFsLmxlbmd0aCAhPSBleHBlY3RlZC5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWN0dWFsW2ldICE9PSBleHBlY3RlZFtpXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICghdXRpbC5pc09iamVjdChhY3R1YWwpICYmICF1dGlsLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYikge1xuICBpZiAodXRpbC5pc051bGxPclVuZGVmaW5lZChhKSB8fCB1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LlxuICBpZiAoYS5wcm90b3R5cGUgIT09IGIucHJvdG90eXBlKSByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKSB7XG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIH1cbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKSxcbiAgICAgIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYik7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgIGtiID0gb2JqZWN0S2V5cyhiKSxcbiAgICAgIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHV0aWwuaXNTdHJpbmcoZXhwZWN0ZWQpKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFjdHVhbCA9IGU7XG4gIH1cblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICghc2hvdWxkVGhyb3cgJiYgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW3RydWVdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFtmYWxzZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHt0aHJvdyBlcnI7fX07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIixudWxsLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKmdsb2JhbCB3aW5kb3csIGdsb2JhbCovXG52YXIgdXRpbCA9IHJlcXVpcmUoXCJ1dGlsXCIpXG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKVxudmFyIG5vdyA9IHJlcXVpcmUoXCJkYXRlLW5vd1wiKVxuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbnZhciBjb25zb2xlXG52YXIgdGltZXMgPSB7fVxuXG5pZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuY29uc29sZSkge1xuICAgIGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZVxufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5jb25zb2xlKSB7XG4gICAgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlXG59IGVsc2Uge1xuICAgIGNvbnNvbGUgPSB7fVxufVxuXG52YXIgZnVuY3Rpb25zID0gW1xuICAgIFtsb2csIFwibG9nXCJdLFxuICAgIFtpbmZvLCBcImluZm9cIl0sXG4gICAgW3dhcm4sIFwid2FyblwiXSxcbiAgICBbZXJyb3IsIFwiZXJyb3JcIl0sXG4gICAgW3RpbWUsIFwidGltZVwiXSxcbiAgICBbdGltZUVuZCwgXCJ0aW1lRW5kXCJdLFxuICAgIFt0cmFjZSwgXCJ0cmFjZVwiXSxcbiAgICBbZGlyLCBcImRpclwiXSxcbiAgICBbY29uc29sZUFzc2VydCwgXCJhc3NlcnRcIl1cbl1cblxuZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdHVwbGUgPSBmdW5jdGlvbnNbaV1cbiAgICB2YXIgZiA9IHR1cGxlWzBdXG4gICAgdmFyIG5hbWUgPSB0dXBsZVsxXVxuXG4gICAgaWYgKCFjb25zb2xlW25hbWVdKSB7XG4gICAgICAgIGNvbnNvbGVbbmFtZV0gPSBmXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGVcblxuZnVuY3Rpb24gbG9nKCkge31cblxuZnVuY3Rpb24gaW5mbygpIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmZ1bmN0aW9uIHdhcm4oKSB7XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuXG5mdW5jdGlvbiBlcnJvcigpIHtcbiAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuXG5mdW5jdGlvbiB0aW1lKGxhYmVsKSB7XG4gICAgdGltZXNbbGFiZWxdID0gbm93KClcbn1cblxuZnVuY3Rpb24gdGltZUVuZChsYWJlbCkge1xuICAgIHZhciB0aW1lID0gdGltZXNbbGFiZWxdXG4gICAgaWYgKCF0aW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1Y2ggbGFiZWw6IFwiICsgbGFiZWwpXG4gICAgfVxuXG4gICAgdmFyIGR1cmF0aW9uID0gbm93KCkgLSB0aW1lXG4gICAgY29uc29sZS5sb2cobGFiZWwgKyBcIjogXCIgKyBkdXJhdGlvbiArIFwibXNcIilcbn1cblxuZnVuY3Rpb24gdHJhY2UoKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpXG4gICAgZXJyLm5hbWUgPSBcIlRyYWNlXCJcbiAgICBlcnIubWVzc2FnZSA9IHV0aWwuZm9ybWF0LmFwcGx5KG51bGwsIGFyZ3VtZW50cylcbiAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjaylcbn1cblxuZnVuY3Rpb24gZGlyKG9iamVjdCkge1xuICAgIGNvbnNvbGUubG9nKHV0aWwuaW5zcGVjdChvYmplY3QpICsgXCJcXG5cIilcbn1cblxuZnVuY3Rpb24gY29uc29sZUFzc2VydChleHByZXNzaW9uKSB7XG4gICAgaWYgKCFleHByZXNzaW9uKSB7XG4gICAgICAgIHZhciBhcnIgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAgICAgYXNzZXJ0Lm9rKGZhbHNlLCB1dGlsLmZvcm1hdC5hcHBseShudWxsLCBhcnIpKVxuICAgIH1cbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5a2RXVjBMMjV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5YVdaNUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjI1emIyeGxMV0p5YjNkelpYSnBabmt2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVNJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeXBuYkc5aVlXd2dkMmx1Wkc5M0xDQm5iRzlpWVd3cUwxeHVkbUZ5SUhWMGFXd2dQU0J5WlhGMWFYSmxLRndpZFhScGJGd2lLVnh1ZG1GeUlHRnpjMlZ5ZENBOUlISmxjWFZwY21Vb1hDSmhjM05sY25SY0lpbGNiblpoY2lCdWIzY2dQU0J5WlhGMWFYSmxLRndpWkdGMFpTMXViM2RjSWlsY2JseHVkbUZ5SUhOc2FXTmxJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbk5zYVdObFhHNTJZWElnWTI5dWMyOXNaVnh1ZG1GeUlIUnBiV1Z6SUQwZ2UzMWNibHh1YVdZZ0tIUjVjR1Z2WmlCbmJHOWlZV3dnSVQwOUlGd2lkVzVrWldacGJtVmtYQ0lnSmlZZ1oyeHZZbUZzTG1OdmJuTnZiR1VwSUh0Y2JpQWdJQ0JqYjI1emIyeGxJRDBnWjJ4dlltRnNMbU52Ym5OdmJHVmNibjBnWld4elpTQnBaaUFvZEhsd1pXOW1JSGRwYm1SdmR5QWhQVDBnWENKMWJtUmxabWx1WldSY0lpQW1KaUIzYVc1a2IzY3VZMjl1YzI5c1pTa2dlMXh1SUNBZ0lHTnZibk52YkdVZ1BTQjNhVzVrYjNjdVkyOXVjMjlzWlZ4dWZTQmxiSE5sSUh0Y2JpQWdJQ0JqYjI1emIyeGxJRDBnZTMxY2JuMWNibHh1ZG1GeUlHWjFibU4wYVc5dWN5QTlJRnRjYmlBZ0lDQmJiRzluTENCY0lteHZaMXdpWFN4Y2JpQWdJQ0JiYVc1bWJ5d2dYQ0pwYm1adlhDSmRMRnh1SUNBZ0lGdDNZWEp1TENCY0luZGhjbTVjSWwwc1hHNGdJQ0FnVzJWeWNtOXlMQ0JjSW1WeWNtOXlYQ0pkTEZ4dUlDQWdJRnQwYVcxbExDQmNJblJwYldWY0lsMHNYRzRnSUNBZ1czUnBiV1ZGYm1Rc0lGd2lkR2x0WlVWdVpGd2lYU3hjYmlBZ0lDQmJkSEpoWTJVc0lGd2lkSEpoWTJWY0lsMHNYRzRnSUNBZ1cyUnBjaXdnWENKa2FYSmNJbDBzWEc0Z0lDQWdXMk52Ym5OdmJHVkJjM05sY25Rc0lGd2lZWE56WlhKMFhDSmRYRzVkWEc1Y2JtWnZjaUFvZG1GeUlHa2dQU0F3T3lCcElEd2dablZ1WTNScGIyNXpMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnZG1GeUlIUjFjR3hsSUQwZ1puVnVZM1JwYjI1elcybGRYRzRnSUNBZ2RtRnlJR1lnUFNCMGRYQnNaVnN3WFZ4dUlDQWdJSFpoY2lCdVlXMWxJRDBnZEhWd2JHVmJNVjFjYmx4dUlDQWdJR2xtSUNnaFkyOXVjMjlzWlZ0dVlXMWxYU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsVzI1aGJXVmRJRDBnWmx4dUlDQWdJSDFjYm4xY2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQmpiMjV6YjJ4bFhHNWNibVoxYm1OMGFXOXVJR3h2WnlncElIdDlYRzVjYm1aMWJtTjBhVzl1SUdsdVptOG9LU0I3WEc0Z0lDQWdZMjl1YzI5c1pTNXNiMmN1WVhCd2JIa29ZMjl1YzI5c1pTd2dZWEpuZFcxbGJuUnpLVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQjNZWEp1S0NrZ2UxeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bkxtRndjR3g1S0dOdmJuTnZiR1VzSUdGeVozVnRaVzUwY3lsY2JuMWNibHh1Wm5WdVkzUnBiMjRnWlhKeWIzSW9LU0I3WEc0Z0lDQWdZMjl1YzI5c1pTNTNZWEp1TG1Gd2NHeDVLR052Ym5OdmJHVXNJR0Z5WjNWdFpXNTBjeWxjYm4xY2JseHVablZ1WTNScGIyNGdkR2x0WlNoc1lXSmxiQ2tnZTF4dUlDQWdJSFJwYldWelcyeGhZbVZzWFNBOUlHNXZkeWdwWEc1OVhHNWNibVoxYm1OMGFXOXVJSFJwYldWRmJtUW9iR0ZpWld3cElIdGNiaUFnSUNCMllYSWdkR2x0WlNBOUlIUnBiV1Z6VzJ4aFltVnNYVnh1SUNBZ0lHbG1JQ2doZEdsdFpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9YQ0pPYnlCemRXTm9JR3hoWW1Wc09pQmNJaUFySUd4aFltVnNLVnh1SUNBZ0lIMWNibHh1SUNBZ0lIWmhjaUJrZFhKaGRHbHZiaUE5SUc1dmR5Z3BJQzBnZEdsdFpWeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHeGhZbVZzSUNzZ1hDSTZJRndpSUNzZ1pIVnlZWFJwYjI0Z0t5QmNJbTF6WENJcFhHNTlYRzVjYm1aMWJtTjBhVzl1SUhSeVlXTmxLQ2tnZTF4dUlDQWdJSFpoY2lCbGNuSWdQU0J1WlhjZ1JYSnliM0lvS1Z4dUlDQWdJR1Z5Y2k1dVlXMWxJRDBnWENKVWNtRmpaVndpWEc0Z0lDQWdaWEp5TG0xbGMzTmhaMlVnUFNCMWRHbHNMbVp2Y20xaGRDNWhjSEJzZVNodWRXeHNMQ0JoY21kMWJXVnVkSE1wWEc0Z0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2lobGNuSXVjM1JoWTJzcFhHNTlYRzVjYm1aMWJtTjBhVzl1SUdScGNpaHZZbXBsWTNRcElIdGNiaUFnSUNCamIyNXpiMnhsTG14dlp5aDFkR2xzTG1sdWMzQmxZM1FvYjJKcVpXTjBLU0FySUZ3aVhGeHVYQ0lwWEc1OVhHNWNibVoxYm1OMGFXOXVJR052Ym5OdmJHVkJjM05sY25Rb1pYaHdjbVZ6YzJsdmJpa2dlMXh1SUNBZ0lHbG1JQ2doWlhod2NtVnpjMmx2YmlrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnWVhKeUlEMGdjMnhwWTJVdVkyRnNiQ2hoY21kMWJXVnVkSE1zSURFcFhHNGdJQ0FnSUNBZ0lHRnpjMlZ5ZEM1dmF5aG1ZV3h6WlN3Z2RYUnBiQzVtYjNKdFlYUXVZWEJ3Ykhrb2JuVnNiQ3dnWVhKeUtTbGNiaUFnSUNCOVhHNTlYRzRpWFgwPSIsIm1vZHVsZS5leHBvcnRzID0gbm93XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJyksdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlrZFdWMEwyNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlhV1o1TDI1dlpHVmZiVzlrZFd4bGN5OTFkR2xzTDNWMGFXd3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRU52Y0hseWFXZG9kQ0JLYjNsbGJuUXNJRWx1WXk0Z1lXNWtJRzkwYUdWeUlFNXZaR1VnWTI5dWRISnBZblYwYjNKekxseHVMeTljYmk4dklGQmxjbTFwYzNOcGIyNGdhWE1nYUdWeVpXSjVJR2R5WVc1MFpXUXNJR1p5WldVZ2IyWWdZMmhoY21kbExDQjBieUJoYm5rZ2NHVnljMjl1SUc5aWRHRnBibWx1WnlCaFhHNHZMeUJqYjNCNUlHOW1JSFJvYVhNZ2MyOW1kSGRoY21VZ1lXNWtJR0Z6YzI5amFXRjBaV1FnWkc5amRXMWxiblJoZEdsdmJpQm1hV3hsY3lBb2RHaGxYRzR2THlCY0lsTnZablIzWVhKbFhDSXBMQ0IwYnlCa1pXRnNJR2x1SUhSb1pTQlRiMlowZDJGeVpTQjNhWFJvYjNWMElISmxjM1J5YVdOMGFXOXVMQ0JwYm1Oc2RXUnBibWRjYmk4dklIZHBkR2h2ZFhRZ2JHbHRhWFJoZEdsdmJpQjBhR1VnY21sbmFIUnpJSFJ2SUhWelpTd2dZMjl3ZVN3Z2JXOWthV1o1TENCdFpYSm5aU3dnY0hWaWJHbHphQ3hjYmk4dklHUnBjM1J5YVdKMWRHVXNJSE4xWW14cFkyVnVjMlVzSUdGdVpDOXZjaUJ6Wld4c0lHTnZjR2xsY3lCdlppQjBhR1VnVTI5bWRIZGhjbVVzSUdGdVpDQjBieUJ3WlhKdGFYUmNiaTh2SUhCbGNuTnZibk1nZEc4Z2QyaHZiU0IwYUdVZ1UyOW1kSGRoY21VZ2FYTWdablZ5Ym1semFHVmtJSFJ2SUdSdklITnZMQ0J6ZFdKcVpXTjBJSFJ2SUhSb1pWeHVMeThnWm05c2JHOTNhVzVuSUdOdmJtUnBkR2x2Ym5NNlhHNHZMMXh1THk4Z1ZHaGxJR0ZpYjNabElHTnZjSGx5YVdkb2RDQnViM1JwWTJVZ1lXNWtJSFJvYVhNZ2NHVnliV2x6YzJsdmJpQnViM1JwWTJVZ2MyaGhiR3dnWW1VZ2FXNWpiSFZrWldSY2JpOHZJR2x1SUdGc2JDQmpiM0JwWlhNZ2IzSWdjM1ZpYzNSaGJuUnBZV3dnY0c5eWRHbHZibk1nYjJZZ2RHaGxJRk52Wm5SM1lYSmxMbHh1THk5Y2JpOHZJRlJJUlNCVFQwWlVWMEZTUlNCSlV5QlFVazlXU1VSRlJDQmNJa0ZUSUVsVFhDSXNJRmRKVkVoUFZWUWdWMEZTVWtGT1ZGa2dUMFlnUVU1WklFdEpUa1FzSUVWWVVGSkZVMU5jYmk4dklFOVNJRWxOVUV4SlJVUXNJRWxPUTB4VlJFbE9SeUJDVlZRZ1RrOVVJRXhKVFVsVVJVUWdWRThnVkVoRklGZEJVbEpCVGxSSlJWTWdUMFpjYmk4dklFMUZVa05JUVU1VVFVSkpURWxVV1N3Z1JrbFVUa1ZUVXlCR1QxSWdRU0JRUVZKVVNVTlZURUZTSUZCVlVsQlBVMFVnUVU1RUlFNVBUa2xPUmxKSlRrZEZUVVZPVkM0Z1NVNWNiaTh2SUU1UElFVldSVTVVSUZOSVFVeE1JRlJJUlNCQlZWUklUMUpUSUU5U0lFTlBVRmxTU1VkSVZDQklUMHhFUlZKVElFSkZJRXhKUVVKTVJTQkdUMUlnUVU1WklFTk1RVWxOTEZ4dUx5OGdSRUZOUVVkRlV5QlBVaUJQVkVoRlVpQk1TVUZDU1V4SlZGa3NJRmRJUlZSSVJWSWdTVTRnUVU0Z1FVTlVTVTlPSUU5R0lFTlBUbFJTUVVOVUxDQlVUMUpVSUU5U1hHNHZMeUJQVkVoRlVsZEpVMFVzSUVGU1NWTkpUa2NnUmxKUFRTd2dUMVZVSUU5R0lFOVNJRWxPSUVOUFRrNUZRMVJKVDA0Z1YwbFVTQ0JVU0VVZ1UwOUdWRmRCVWtVZ1QxSWdWRWhGWEc0dkx5QlZVMFVnVDFJZ1QxUklSVklnUkVWQlRFbE9SMU1nU1U0Z1ZFaEZJRk5QUmxSWFFWSkZMbHh1WEc1MllYSWdabTl5YldGMFVtVm5SWGh3SUQwZ0x5VmJjMlJxSlYwdlp6dGNibVY0Y0c5eWRITXVabTl5YldGMElEMGdablZ1WTNScGIyNG9aaWtnZTF4dUlDQnBaaUFvSVdselUzUnlhVzVuS0dZcEtTQjdYRzRnSUNBZ2RtRnlJRzlpYW1WamRITWdQU0JiWFR0Y2JpQWdJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUdGeVozVnRaVzUwY3k1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdiMkpxWldOMGN5NXdkWE5vS0dsdWMzQmxZM1FvWVhKbmRXMWxiblJ6VzJsZEtTazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ2WW1wbFkzUnpMbXB2YVc0b0p5QW5LVHRjYmlBZ2ZWeHVYRzRnSUhaaGNpQnBJRDBnTVR0Y2JpQWdkbUZ5SUdGeVozTWdQU0JoY21kMWJXVnVkSE03WEc0Z0lIWmhjaUJzWlc0Z1BTQmhjbWR6TG14bGJtZDBhRHRjYmlBZ2RtRnlJSE4wY2lBOUlGTjBjbWx1WnlobUtTNXlaWEJzWVdObEtHWnZjbTFoZEZKbFowVjRjQ3dnWm5WdVkzUnBiMjRvZUNrZ2UxeHVJQ0FnSUdsbUlDaDRJRDA5UFNBbkpTVW5LU0J5WlhSMWNtNGdKeVVuTzF4dUlDQWdJR2xtSUNocElENDlJR3hsYmlrZ2NtVjBkWEp1SUhnN1hHNGdJQ0FnYzNkcGRHTm9JQ2g0S1NCN1hHNGdJQ0FnSUNCallYTmxJQ2NsY3ljNklISmxkSFZ5YmlCVGRISnBibWNvWVhKbmMxdHBLeXRkS1R0Y2JpQWdJQ0FnSUdOaGMyVWdKeVZrSnpvZ2NtVjBkWEp1SUU1MWJXSmxjaWhoY21kelcya3JLMTBwTzF4dUlDQWdJQ0FnWTJGelpTQW5KV29uT2x4dUlDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJLVTA5T0xuTjBjbWx1WjJsbWVTaGhjbWR6VzJrcksxMHBPMXh1SUNBZ0lDQWdJQ0I5SUdOaGRHTm9JQ2hmS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDZGJRMmx5WTNWc1lYSmRKenRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnWkdWbVlYVnNkRHBjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSGc3WEc0Z0lDQWdmVnh1SUNCOUtUdGNiaUFnWm05eUlDaDJZWElnZUNBOUlHRnlaM05iYVYwN0lHa2dQQ0JzWlc0N0lIZ2dQU0JoY21keld5c3JhVjBwSUh0Y2JpQWdJQ0JwWmlBb2FYTk9kV3hzS0hncElIeDhJQ0ZwYzA5aWFtVmpkQ2g0S1NrZ2UxeHVJQ0FnSUNBZ2MzUnlJQ3M5SUNjZ0p5QXJJSGc3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lITjBjaUFyUFNBbklDY2dLeUJwYm5Od1pXTjBLSGdwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdjM1J5TzF4dWZUdGNibHh1WEc0dkx5Qk5ZWEpySUhSb1lYUWdZU0J0WlhSb2IyUWdjMmh2ZFd4a0lHNXZkQ0JpWlNCMWMyVmtMbHh1THk4Z1VtVjBkWEp1Y3lCaElHMXZaR2xtYVdWa0lHWjFibU4wYVc5dUlIZG9hV05vSUhkaGNtNXpJRzl1WTJVZ1lua2daR1ZtWVhWc2RDNWNiaTh2SUVsbUlDMHRibTh0WkdWd2NtVmpZWFJwYjI0Z2FYTWdjMlYwTENCMGFHVnVJR2wwSUdseklHRWdibTh0YjNBdVhHNWxlSEJ2Y25SekxtUmxjSEpsWTJGMFpTQTlJR1oxYm1OMGFXOXVLR1p1TENCdGMyY3BJSHRjYmlBZ0x5OGdRV3hzYjNjZ1ptOXlJR1JsY0hKbFkyRjBhVzVuSUhSb2FXNW5jeUJwYmlCMGFHVWdjSEp2WTJWemN5QnZaaUJ6ZEdGeWRHbHVaeUIxY0M1Y2JpQWdhV1lnS0dselZXNWtaV1pwYm1Wa0tHZHNiMkpoYkM1d2NtOWpaWE56S1NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJsZUhCdmNuUnpMbVJsY0hKbFkyRjBaU2htYml3Z2JYTm5LUzVoY0hCc2VTaDBhR2x6TENCaGNtZDFiV1Z1ZEhNcE8xeHVJQ0FnSUgwN1hHNGdJSDFjYmx4dUlDQnBaaUFvY0hKdlkyVnpjeTV1YjBSbGNISmxZMkYwYVc5dUlEMDlQU0IwY25WbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdadU8xeHVJQ0I5WEc1Y2JpQWdkbUZ5SUhkaGNtNWxaQ0E5SUdaaGJITmxPMXh1SUNCbWRXNWpkR2x2YmlCa1pYQnlaV05oZEdWa0tDa2dlMXh1SUNBZ0lHbG1JQ2doZDJGeWJtVmtLU0I3WEc0Z0lDQWdJQ0JwWmlBb2NISnZZMlZ6Y3k1MGFISnZkMFJsY0hKbFkyRjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lodGMyY3BPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h3Y205alpYTnpMblJ5WVdObFJHVndjbVZqWVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzUwY21GalpTaHRjMmNwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaHRjMmNwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnZDJGeWJtVmtJRDBnZEhKMVpUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJR1p1TG1Gd2NHeDVLSFJvYVhNc0lHRnlaM1Z0Wlc1MGN5azdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdaR1Z3Y21WallYUmxaRHRjYm4wN1hHNWNibHh1ZG1GeUlHUmxZblZuY3lBOUlIdDlPMXh1ZG1GeUlHUmxZblZuUlc1MmFYSnZianRjYm1WNGNHOXlkSE11WkdWaWRXZHNiMmNnUFNCbWRXNWpkR2x2YmloelpYUXBJSHRjYmlBZ2FXWWdLR2x6Vlc1a1pXWnBibVZrS0dSbFluVm5SVzUyYVhKdmJpa3BYRzRnSUNBZ1pHVmlkV2RGYm5acGNtOXVJRDBnY0hKdlkyVnpjeTVsYm5ZdVRrOUVSVjlFUlVKVlJ5QjhmQ0FuSnp0Y2JpQWdjMlYwSUQwZ2MyVjBMblJ2VlhCd1pYSkRZWE5sS0NrN1hHNGdJR2xtSUNnaFpHVmlkV2R6VzNObGRGMHBJSHRjYmlBZ0lDQnBaaUFvYm1WM0lGSmxaMFY0Y0NnblhGeGNYR0luSUNzZ2MyVjBJQ3NnSjF4Y1hGeGlKeXdnSjJrbktTNTBaWE4wS0dSbFluVm5SVzUyYVhKdmJpa3BJSHRjYmlBZ0lDQWdJSFpoY2lCd2FXUWdQU0J3Y205alpYTnpMbkJwWkR0Y2JpQWdJQ0FnSUdSbFluVm5jMXR6WlhSZElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnRjMmNnUFNCbGVIQnZjblJ6TG1admNtMWhkQzVoY0hCc2VTaGxlSEJ2Y25SekxDQmhjbWQxYldWdWRITXBPMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtDY2xjeUFsWkRvZ0pYTW5MQ0J6WlhRc0lIQnBaQ3dnYlhObktUdGNiaUFnSUNBZ0lIMDdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUdSbFluVm5jMXR6WlhSZElEMGdablZ1WTNScGIyNG9LU0I3ZlR0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnY21WMGRYSnVJR1JsWW5WbmMxdHpaWFJkTzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUVWamFHOXpJSFJvWlNCMllXeDFaU0J2WmlCaElIWmhiSFZsTGlCVWNubHpJSFJ2SUhCeWFXNTBJSFJvWlNCMllXeDFaU0J2ZFhSY2JpQXFJR2x1SUhSb1pTQmlaWE4wSUhkaGVTQndiM056YVdKc1pTQm5hWFpsYmlCMGFHVWdaR2xtWm1WeVpXNTBJSFI1Y0dWekxseHVJQ3BjYmlBcUlFQndZWEpoYlNCN1QySnFaV04wZlNCdlltb2dWR2hsSUc5aWFtVmpkQ0IwYnlCd2NtbHVkQ0J2ZFhRdVhHNGdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdiM0IwY3lCUGNIUnBiMjVoYkNCdmNIUnBiMjV6SUc5aWFtVmpkQ0IwYUdGMElHRnNkR1Z5Y3lCMGFHVWdiM1YwY0hWMExseHVJQ292WEc0dktpQnNaV2RoWTNrNklHOWlhaXdnYzJodmQwaHBaR1JsYml3Z1pHVndkR2dzSUdOdmJHOXljeW92WEc1bWRXNWpkR2x2YmlCcGJuTndaV04wS0c5aWFpd2diM0IwY3lrZ2UxeHVJQ0F2THlCa1pXWmhkV3gwSUc5d2RHbHZibk5jYmlBZ2RtRnlJR04wZUNBOUlIdGNiaUFnSUNCelpXVnVPaUJiWFN4Y2JpQWdJQ0J6ZEhsc2FYcGxPaUJ6ZEhsc2FYcGxUbTlEYjJ4dmNseHVJQ0I5TzF4dUlDQXZMeUJzWldkaFkza3VMaTVjYmlBZ2FXWWdLR0Z5WjNWdFpXNTBjeTVzWlc1bmRHZ2dQajBnTXlrZ1kzUjRMbVJsY0hSb0lEMGdZWEpuZFcxbGJuUnpXekpkTzF4dUlDQnBaaUFvWVhKbmRXMWxiblJ6TG14bGJtZDBhQ0ErUFNBMEtTQmpkSGd1WTI5c2IzSnpJRDBnWVhKbmRXMWxiblJ6V3pOZE8xeHVJQ0JwWmlBb2FYTkNiMjlzWldGdUtHOXdkSE1wS1NCN1hHNGdJQ0FnTHk4Z2JHVm5ZV041TGk0dVhHNGdJQ0FnWTNSNExuTm9iM2RJYVdSa1pXNGdQU0J2Y0hSek8xeHVJQ0I5SUdWc2MyVWdhV1lnS0c5d2RITXBJSHRjYmlBZ0lDQXZMeUJuYjNRZ1lXNGdYQ0p2Y0hScGIyNXpYQ0lnYjJKcVpXTjBYRzRnSUNBZ1pYaHdiM0owY3k1ZlpYaDBaVzVrS0dOMGVDd2diM0IwY3lrN1hHNGdJSDFjYmlBZ0x5OGdjMlYwSUdSbFptRjFiSFFnYjNCMGFXOXVjMXh1SUNCcFppQW9hWE5WYm1SbFptbHVaV1FvWTNSNExuTm9iM2RJYVdSa1pXNHBLU0JqZEhndWMyaHZkMGhwWkdSbGJpQTlJR1poYkhObE8xeHVJQ0JwWmlBb2FYTlZibVJsWm1sdVpXUW9ZM1I0TG1SbGNIUm9LU2tnWTNSNExtUmxjSFJvSUQwZ01qdGNiaUFnYVdZZ0tHbHpWVzVrWldacGJtVmtLR04wZUM1amIyeHZjbk1wS1NCamRIZ3VZMjlzYjNKeklEMGdabUZzYzJVN1hHNGdJR2xtSUNocGMxVnVaR1ZtYVc1bFpDaGpkSGd1WTNWemRHOXRTVzV6Y0dWamRDa3BJR04wZUM1amRYTjBiMjFKYm5Od1pXTjBJRDBnZEhKMVpUdGNiaUFnYVdZZ0tHTjBlQzVqYjJ4dmNuTXBJR04wZUM1emRIbHNhWHBsSUQwZ2MzUjViR2w2WlZkcGRHaERiMnh2Y2p0Y2JpQWdjbVYwZFhKdUlHWnZjbTFoZEZaaGJIVmxLR04wZUN3Z2IySnFMQ0JqZEhndVpHVndkR2dwTzF4dWZWeHVaWGh3YjNKMGN5NXBibk53WldOMElEMGdhVzV6Y0dWamREdGNibHh1WEc0dkx5Qm9kSFJ3T2k4dlpXNHVkMmxyYVhCbFpHbGhMbTl5Wnk5M2FXdHBMMEZPVTBsZlpYTmpZWEJsWDJOdlpHVWpaM0poY0docFkzTmNibWx1YzNCbFkzUXVZMjlzYjNKeklEMGdlMXh1SUNBblltOXNaQ2NnT2lCYk1Td2dNakpkTEZ4dUlDQW5hWFJoYkdsakp5QTZJRnN6TENBeU0xMHNYRzRnSUNkMWJtUmxjbXhwYm1VbklEb2dXelFzSURJMFhTeGNiaUFnSjJsdWRtVnljMlVuSURvZ1d6Y3NJREkzWFN4Y2JpQWdKM2RvYVhSbEp5QTZJRnN6Tnl3Z016bGRMRnh1SUNBblozSmxlU2NnT2lCYk9UQXNJRE01WFN4Y2JpQWdKMkpzWVdOckp5QTZJRnN6TUN3Z016bGRMRnh1SUNBbllteDFaU2NnT2lCYk16UXNJRE01WFN4Y2JpQWdKMk41WVc0bklEb2dXek0yTENBek9WMHNYRzRnSUNkbmNtVmxiaWNnT2lCYk16SXNJRE01WFN4Y2JpQWdKMjFoWjJWdWRHRW5JRG9nV3pNMUxDQXpPVjBzWEc0Z0lDZHlaV1FuSURvZ1d6TXhMQ0F6T1Ywc1hHNGdJQ2Q1Wld4c2IzY25JRG9nV3pNekxDQXpPVjFjYm4wN1hHNWNiaTh2SUVSdmJpZDBJSFZ6WlNBbllteDFaU2NnYm05MElIWnBjMmxpYkdVZ2IyNGdZMjFrTG1WNFpWeHVhVzV6Y0dWamRDNXpkSGxzWlhNZ1BTQjdYRzRnSUNkemNHVmphV0ZzSnpvZ0oyTjVZVzRuTEZ4dUlDQW5iblZ0WW1WeUp6b2dKM2xsYkd4dmR5Y3NYRzRnSUNkaWIyOXNaV0Z1SnpvZ0ozbGxiR3h2ZHljc1hHNGdJQ2QxYm1SbFptbHVaV1FuT2lBblozSmxlU2NzWEc0Z0lDZHVkV3hzSnpvZ0oySnZiR1FuTEZ4dUlDQW5jM1J5YVc1bkp6b2dKMmR5WldWdUp5eGNiaUFnSjJSaGRHVW5PaUFuYldGblpXNTBZU2NzWEc0Z0lDOHZJRndpYm1GdFpWd2lPaUJwYm5SbGJuUnBiMjVoYkd4NUlHNXZkQ0J6ZEhsc2FXNW5YRzRnSUNkeVpXZGxlSEFuT2lBbmNtVmtKMXh1ZlR0Y2JseHVYRzVtZFc1amRHbHZiaUJ6ZEhsc2FYcGxWMmwwYUVOdmJHOXlLSE4wY2l3Z2MzUjViR1ZVZVhCbEtTQjdYRzRnSUhaaGNpQnpkSGxzWlNBOUlHbHVjM0JsWTNRdWMzUjViR1Z6VzNOMGVXeGxWSGx3WlYwN1hHNWNiaUFnYVdZZ0tITjBlV3hsS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2RjWEhVd01ERmlXeWNnS3lCcGJuTndaV04wTG1OdmJHOXljMXR6ZEhsc1pWMWJNRjBnS3lBbmJTY2dLeUJ6ZEhJZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FuWEZ4MU1EQXhZbHNuSUNzZ2FXNXpjR1ZqZEM1amIyeHZjbk5iYzNSNWJHVmRXekZkSUNzZ0oyMG5PMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSEpsZEhWeWJpQnpkSEk3WEc0Z0lIMWNibjFjYmx4dVhHNW1kVzVqZEdsdmJpQnpkSGxzYVhwbFRtOURiMnh2Y2loemRISXNJSE4wZVd4bFZIbHdaU2tnZTF4dUlDQnlaWFIxY200Z2MzUnlPMXh1ZlZ4dVhHNWNibVoxYm1OMGFXOXVJR0Z5Y21GNVZHOUlZWE5vS0dGeWNtRjVLU0I3WEc0Z0lIWmhjaUJvWVhOb0lEMGdlMzA3WEc1Y2JpQWdZWEp5WVhrdVptOXlSV0ZqYUNobWRXNWpkR2x2YmloMllXd3NJR2xrZUNrZ2UxeHVJQ0FnSUdoaGMyaGJkbUZzWFNBOUlIUnlkV1U3WEc0Z0lIMHBPMXh1WEc0Z0lISmxkSFZ5YmlCb1lYTm9PMXh1ZlZ4dVhHNWNibVoxYm1OMGFXOXVJR1p2Y20xaGRGWmhiSFZsS0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeWtnZTF4dUlDQXZMeUJRY205MmFXUmxJR0VnYUc5dmF5Qm1iM0lnZFhObGNpMXpjR1ZqYVdacFpXUWdhVzV6Y0dWamRDQm1kVzVqZEdsdmJuTXVYRzRnSUM4dklFTm9aV05ySUhSb1lYUWdkbUZzZFdVZ2FYTWdZVzRnYjJKcVpXTjBJSGRwZEdnZ1lXNGdhVzV6Y0dWamRDQm1kVzVqZEdsdmJpQnZiaUJwZEZ4dUlDQnBaaUFvWTNSNExtTjFjM1J2YlVsdWMzQmxZM1FnSmlaY2JpQWdJQ0FnSUhaaGJIVmxJQ1ltWEc0Z0lDQWdJQ0JwYzBaMWJtTjBhVzl1S0haaGJIVmxMbWx1YzNCbFkzUXBJQ1ltWEc0Z0lDQWdJQ0F2THlCR2FXeDBaWElnYjNWMElIUm9aU0IxZEdsc0lHMXZaSFZzWlN3Z2FYUW5jeUJwYm5Od1pXTjBJR1oxYm1OMGFXOXVJR2x6SUhOd1pXTnBZV3hjYmlBZ0lDQWdJSFpoYkhWbExtbHVjM0JsWTNRZ0lUMDlJR1Y0Y0c5eWRITXVhVzV6Y0dWamRDQW1KbHh1SUNBZ0lDQWdMeThnUVd4emJ5Qm1hV3gwWlhJZ2IzVjBJR0Z1ZVNCd2NtOTBiM1I1Y0dVZ2IySnFaV04wY3lCMWMybHVaeUIwYUdVZ1kybHlZM1ZzWVhJZ1kyaGxZMnN1WEc0Z0lDQWdJQ0FoS0haaGJIVmxMbU52Ym5OMGNuVmpkRzl5SUNZbUlIWmhiSFZsTG1OdmJuTjBjblZqZEc5eUxuQnliM1J2ZEhsd1pTQTlQVDBnZG1Gc2RXVXBLU0I3WEc0Z0lDQWdkbUZ5SUhKbGRDQTlJSFpoYkhWbExtbHVjM0JsWTNRb2NtVmpkWEp6WlZScGJXVnpMQ0JqZEhncE8xeHVJQ0FnSUdsbUlDZ2hhWE5UZEhKcGJtY29jbVYwS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBJRDBnWm05eWJXRjBWbUZzZFdVb1kzUjRMQ0J5WlhRc0lISmxZM1Z5YzJWVWFXMWxjeWs3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYUTdYRzRnSUgxY2JseHVJQ0F2THlCUWNtbHRhWFJwZG1VZ2RIbHdaWE1nWTJGdWJtOTBJR2hoZG1VZ2NISnZjR1Z5ZEdsbGMxeHVJQ0IyWVhJZ2NISnBiV2wwYVhabElEMGdabTl5YldGMFVISnBiV2wwYVhabEtHTjBlQ3dnZG1Gc2RXVXBPMXh1SUNCcFppQW9jSEpwYldsMGFYWmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIQnlhVzFwZEdsMlpUdGNiaUFnZlZ4dVhHNGdJQzh2SUV4dmIyc2dkWEFnZEdobElHdGxlWE1nYjJZZ2RHaGxJRzlpYW1WamRDNWNiaUFnZG1GeUlHdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aDJZV3gxWlNrN1hHNGdJSFpoY2lCMmFYTnBZbXhsUzJWNWN5QTlJR0Z5Y21GNVZHOUlZWE5vS0d0bGVYTXBPMXh1WEc0Z0lHbG1JQ2hqZEhndWMyaHZkMGhwWkdSbGJpa2dlMXh1SUNBZ0lHdGxlWE1nUFNCUFltcGxZM1F1WjJWMFQzZHVVSEp2Y0dWeWRIbE9ZVzFsY3loMllXeDFaU2s3WEc0Z0lIMWNibHh1SUNBdkx5QkpSU0JrYjJWemJpZDBJRzFoYTJVZ1pYSnliM0lnWm1sbGJHUnpJRzV2YmkxbGJuVnRaWEpoWW14bFhHNGdJQzh2SUdoMGRIQTZMeTl0YzJSdUxtMXBZM0p2YzI5bWRDNWpiMjB2Wlc0dGRYTXZiR2xpY21GeWVTOXBaUzlrZDNjMU1uTmlkQ2gyUFhaekxqazBLUzVoYzNCNFhHNGdJR2xtSUNocGMwVnljbTl5S0haaGJIVmxLVnh1SUNBZ0lDQWdKaVlnS0d0bGVYTXVhVzVrWlhoUFppZ25iV1Z6YzJGblpTY3BJRDQ5SURBZ2ZId2dhMlY1Y3k1cGJtUmxlRTltS0Nka1pYTmpjbWx3ZEdsdmJpY3BJRDQ5SURBcEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdadmNtMWhkRVZ5Y205eUtIWmhiSFZsS1R0Y2JpQWdmVnh1WEc0Z0lDOHZJRk52YldVZ2RIbHdaU0J2WmlCdlltcGxZM1FnZDJsMGFHOTFkQ0J3Y205d1pYSjBhV1Z6SUdOaGJpQmlaU0J6YUc5eWRHTjFkSFJsWkM1Y2JpQWdhV1lnS0d0bGVYTXViR1Z1WjNSb0lEMDlQU0F3S1NCN1hHNGdJQ0FnYVdZZ0tHbHpSblZ1WTNScGIyNG9kbUZzZFdVcEtTQjdYRzRnSUNBZ0lDQjJZWElnYm1GdFpTQTlJSFpoYkhWbExtNWhiV1VnUHlBbk9pQW5JQ3NnZG1Gc2RXVXVibUZ0WlNBNklDY25PMXh1SUNBZ0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLQ2RiUm5WdVkzUnBiMjRuSUNzZ2JtRnRaU0FySUNkZEp5d2dKM053WldOcFlXd25LVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR2x6VW1WblJYaHdLSFpoYkhWbEtTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHTjBlQzV6ZEhsc2FYcGxLRkpsWjBWNGNDNXdjbTkwYjNSNWNHVXVkRzlUZEhKcGJtY3VZMkZzYkNoMllXeDFaU2tzSUNkeVpXZGxlSEFuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dselJHRjBaU2gyWVd4MVpTa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2hFWVhSbExuQnliM1J2ZEhsd1pTNTBiMU4wY21sdVp5NWpZV3hzS0haaGJIVmxLU3dnSjJSaGRHVW5LVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR2x6UlhKeWIzSW9kbUZzZFdVcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1ptOXliV0YwUlhKeWIzSW9kbUZzZFdVcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIWmhjaUJpWVhObElEMGdKeWNzSUdGeWNtRjVJRDBnWm1Gc2MyVXNJR0p5WVdObGN5QTlJRnNuZXljc0lDZDlKMTA3WEc1Y2JpQWdMeThnVFdGclpTQkJjbkpoZVNCellYa2dkR2hoZENCMGFHVjVJR0Z5WlNCQmNuSmhlVnh1SUNCcFppQW9hWE5CY25KaGVTaDJZV3gxWlNrcElIdGNiaUFnSUNCaGNuSmhlU0E5SUhSeWRXVTdYRzRnSUNBZ1luSmhZMlZ6SUQwZ1d5ZGJKeXdnSjEwblhUdGNiaUFnZlZ4dVhHNGdJQzh2SUUxaGEyVWdablZ1WTNScGIyNXpJSE5oZVNCMGFHRjBJSFJvWlhrZ1lYSmxJR1oxYm1OMGFXOXVjMXh1SUNCcFppQW9hWE5HZFc1amRHbHZiaWgyWVd4MVpTa3BJSHRjYmlBZ0lDQjJZWElnYmlBOUlIWmhiSFZsTG01aGJXVWdQeUFuT2lBbklDc2dkbUZzZFdVdWJtRnRaU0E2SUNjbk8xeHVJQ0FnSUdKaGMyVWdQU0FuSUZ0R2RXNWpkR2x2YmljZ0t5QnVJQ3NnSjEwbk8xeHVJQ0I5WEc1Y2JpQWdMeThnVFdGclpTQlNaV2RGZUhCeklITmhlU0IwYUdGMElIUm9aWGtnWVhKbElGSmxaMFY0Y0hOY2JpQWdhV1lnS0dselVtVm5SWGh3S0haaGJIVmxLU2tnZTF4dUlDQWdJR0poYzJVZ1BTQW5JQ2NnS3lCU1pXZEZlSEF1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29kbUZzZFdVcE8xeHVJQ0I5WEc1Y2JpQWdMeThnVFdGclpTQmtZWFJsY3lCM2FYUm9JSEJ5YjNCbGNuUnBaWE1nWm1seWMzUWdjMkY1SUhSb1pTQmtZWFJsWEc0Z0lHbG1JQ2hwYzBSaGRHVW9kbUZzZFdVcEtTQjdYRzRnSUNBZ1ltRnpaU0E5SUNjZ0p5QXJJRVJoZEdVdWNISnZkRzkwZVhCbExuUnZWVlJEVTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwTzF4dUlDQjlYRzVjYmlBZ0x5OGdUV0ZyWlNCbGNuSnZjaUIzYVhSb0lHMWxjM05oWjJVZ1ptbHljM1FnYzJGNUlIUm9aU0JsY25KdmNseHVJQ0JwWmlBb2FYTkZjbkp2Y2loMllXeDFaU2twSUh0Y2JpQWdJQ0JpWVhObElEMGdKeUFuSUNzZ1ptOXliV0YwUlhKeWIzSW9kbUZzZFdVcE8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0d0bGVYTXViR1Z1WjNSb0lEMDlQU0F3SUNZbUlDZ2hZWEp5WVhrZ2ZId2dkbUZzZFdVdWJHVnVaM1JvSUQwOUlEQXBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHSnlZV05sYzFzd1hTQXJJR0poYzJVZ0t5QmljbUZqWlhOYk1WMDdYRzRnSUgxY2JseHVJQ0JwWmlBb2NtVmpkWEp6WlZScGJXVnpJRHdnTUNrZ2UxeHVJQ0FnSUdsbUlDaHBjMUpsWjBWNGNDaDJZV3gxWlNrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamRIZ3VjM1I1YkdsNlpTaFNaV2RGZUhBdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBMQ0FuY21WblpYaHdKeWs3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamRIZ3VjM1I1YkdsNlpTZ25XMDlpYW1WamRGMG5MQ0FuYzNCbFkybGhiQ2NwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdOMGVDNXpaV1Z1TG5CMWMyZ29kbUZzZFdVcE8xeHVYRzRnSUhaaGNpQnZkWFJ3ZFhRN1hHNGdJR2xtSUNoaGNuSmhlU2tnZTF4dUlDQWdJRzkxZEhCMWRDQTlJR1p2Y20xaGRFRnljbUY1S0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeXdnZG1semFXSnNaVXRsZVhNc0lHdGxlWE1wTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUc5MWRIQjFkQ0E5SUd0bGVYTXViV0Z3S0daMWJtTjBhVzl1S0d0bGVTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWnZjbTFoZEZCeWIzQmxjblI1S0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeXdnZG1semFXSnNaVXRsZVhNc0lHdGxlU3dnWVhKeVlYa3BPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWTNSNExuTmxaVzR1Y0c5d0tDazdYRzVjYmlBZ2NtVjBkWEp1SUhKbFpIVmpaVlJ2VTJsdVoyeGxVM1J5YVc1bktHOTFkSEIxZEN3Z1ltRnpaU3dnWW5KaFkyVnpLVHRjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJtYjNKdFlYUlFjbWx0YVhScGRtVW9ZM1I0TENCMllXeDFaU2tnZTF4dUlDQnBaaUFvYVhOVmJtUmxabWx1WldRb2RtRnNkV1VwS1Z4dUlDQWdJSEpsZEhWeWJpQmpkSGd1YzNSNWJHbDZaU2duZFc1a1pXWnBibVZrSnl3Z0ozVnVaR1ZtYVc1bFpDY3BPMXh1SUNCcFppQW9hWE5UZEhKcGJtY29kbUZzZFdVcEtTQjdYRzRnSUNBZ2RtRnlJSE5wYlhCc1pTQTlJQ2RjWENjbklDc2dTbE5QVGk1emRISnBibWRwWm5rb2RtRnNkV1VwTG5KbGNHeGhZMlVvTDE1Y0lueGNJaVF2Wnl3Z0p5Y3BYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2d2Snk5bkxDQmNJbHhjWEZ3blhDSXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2d2WEZ4Y1hGd2lMMmNzSUNkY0lpY3BJQ3NnSjF4Y0p5YzdYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtITnBiWEJzWlN3Z0ozTjBjbWx1WnljcE8xeHVJQ0I5WEc0Z0lHbG1JQ2hwYzA1MWJXSmxjaWgyWVd4MVpTa3BYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDY25JQ3NnZG1Gc2RXVXNJQ2R1ZFcxaVpYSW5LVHRjYmlBZ2FXWWdLR2x6UW05dmJHVmhiaWgyWVd4MVpTa3BYRzRnSUNBZ2NtVjBkWEp1SUdOMGVDNXpkSGxzYVhwbEtDY25JQ3NnZG1Gc2RXVXNJQ2RpYjI5c1pXRnVKeWs3WEc0Z0lDOHZJRVp2Y2lCemIyMWxJSEpsWVhOdmJpQjBlWEJsYjJZZ2JuVnNiQ0JwY3lCY0ltOWlhbVZqZEZ3aUxDQnpieUJ6Y0dWamFXRnNJR05oYzJVZ2FHVnlaUzVjYmlBZ2FXWWdLR2x6VG5Wc2JDaDJZV3gxWlNrcFhHNGdJQ0FnY21WMGRYSnVJR04wZUM1emRIbHNhWHBsS0NkdWRXeHNKeXdnSjI1MWJHd25LVHRjYm4xY2JseHVYRzVtZFc1amRHbHZiaUJtYjNKdFlYUkZjbkp2Y2loMllXeDFaU2tnZTF4dUlDQnlaWFIxY200Z0oxc25JQ3NnUlhKeWIzSXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwSUNzZ0oxMG5PMXh1ZlZ4dVhHNWNibVoxYm1OMGFXOXVJR1p2Y20xaGRFRnljbUY1S0dOMGVDd2dkbUZzZFdVc0lISmxZM1Z5YzJWVWFXMWxjeXdnZG1semFXSnNaVXRsZVhNc0lHdGxlWE1wSUh0Y2JpQWdkbUZ5SUc5MWRIQjFkQ0E5SUZ0ZE8xeHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Dd2diQ0E5SUhaaGJIVmxMbXhsYm1kMGFEc2dhU0E4SUd3N0lDc3JhU2tnZTF4dUlDQWdJR2xtSUNob1lYTlBkMjVRY205d1pYSjBlU2gyWVd4MVpTd2dVM1J5YVc1bktHa3BLU2tnZTF4dUlDQWdJQ0FnYjNWMGNIVjBMbkIxYzJnb1ptOXliV0YwVUhKdmNHVnlkSGtvWTNSNExDQjJZV3gxWlN3Z2NtVmpkWEp6WlZScGJXVnpMQ0IyYVhOcFlteGxTMlY1Y3l4Y2JpQWdJQ0FnSUNBZ0lDQlRkSEpwYm1jb2FTa3NJSFJ5ZFdVcEtUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYjNWMGNIVjBMbkIxYzJnb0p5Y3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dUlDQnJaWGx6TG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYTJWNUtTQjdYRzRnSUNBZ2FXWWdLQ0ZyWlhrdWJXRjBZMmdvTDE1Y1hHUXJKQzhwS1NCN1hHNGdJQ0FnSUNCdmRYUndkWFF1Y0hWemFDaG1iM0p0WVhSUWNtOXdaWEowZVNoamRIZ3NJSFpoYkhWbExDQnlaV04xY25ObFZHbHRaWE1zSUhacGMybGliR1ZMWlhsekxGeHVJQ0FnSUNBZ0lDQWdJR3RsZVN3Z2RISjFaU2twTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzRnSUhKbGRIVnliaUJ2ZFhSd2RYUTdYRzU5WEc1Y2JseHVablZ1WTNScGIyNGdabTl5YldGMFVISnZjR1Z5ZEhrb1kzUjRMQ0IyWVd4MVpTd2djbVZqZFhKelpWUnBiV1Z6TENCMmFYTnBZbXhsUzJWNWN5d2dhMlY1TENCaGNuSmhlU2tnZTF4dUlDQjJZWElnYm1GdFpTd2djM1J5TENCa1pYTmpPMXh1SUNCa1pYTmpJRDBnVDJKcVpXTjBMbWRsZEU5M2JsQnliM0JsY25SNVJHVnpZM0pwY0hSdmNpaDJZV3gxWlN3Z2EyVjVLU0I4ZkNCN0lIWmhiSFZsT2lCMllXeDFaVnRyWlhsZElIMDdYRzRnSUdsbUlDaGtaWE5qTG1kbGRDa2dlMXh1SUNBZ0lHbG1JQ2hrWlhOakxuTmxkQ2tnZTF4dUlDQWdJQ0FnYzNSeUlEMGdZM1I0TG5OMGVXeHBlbVVvSjF0SFpYUjBaWEl2VTJWMGRHVnlYU2NzSUNkemNHVmphV0ZzSnlrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSE4wY2lBOUlHTjBlQzV6ZEhsc2FYcGxLQ2RiUjJWMGRHVnlYU2NzSUNkemNHVmphV0ZzSnlrN1hHNGdJQ0FnZlZ4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUdsbUlDaGtaWE5qTG5ObGRDa2dlMXh1SUNBZ0lDQWdjM1J5SUQwZ1kzUjRMbk4wZVd4cGVtVW9KMXRUWlhSMFpYSmRKeXdnSjNOd1pXTnBZV3duS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnYVdZZ0tDRm9ZWE5QZDI1UWNtOXdaWEowZVNoMmFYTnBZbXhsUzJWNWN5d2dhMlY1S1NrZ2UxeHVJQ0FnSUc1aGJXVWdQU0FuV3ljZ0t5QnJaWGtnS3lBblhTYzdYRzRnSUgxY2JpQWdhV1lnS0NGemRISXBJSHRjYmlBZ0lDQnBaaUFvWTNSNExuTmxaVzR1YVc1a1pYaFBaaWhrWlhOakxuWmhiSFZsS1NBOElEQXBJSHRjYmlBZ0lDQWdJR2xtSUNocGMwNTFiR3dvY21WamRYSnpaVlJwYldWektTa2dlMXh1SUNBZ0lDQWdJQ0J6ZEhJZ1BTQm1iM0p0WVhSV1lXeDFaU2hqZEhnc0lHUmxjMk11ZG1Gc2RXVXNJRzUxYkd3cE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2MzUnlJRDBnWm05eWJXRjBWbUZzZFdVb1kzUjRMQ0JrWlhOakxuWmhiSFZsTENCeVpXTjFjbk5sVkdsdFpYTWdMU0F4S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdsbUlDaHpkSEl1YVc1a1pYaFBaaWduWEZ4dUp5a2dQaUF0TVNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWVhKeVlYa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCemRISWdQU0J6ZEhJdWMzQnNhWFFvSjF4Y2JpY3BMbTFoY0NobWRXNWpkR2x2Ymloc2FXNWxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z0p5QWdKeUFySUd4cGJtVTdYRzRnSUNBZ0lDQWdJQ0FnZlNrdWFtOXBiaWduWEZ4dUp5a3VjM1ZpYzNSeUtESXBPMXh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUhOMGNpQTlJQ2RjWEc0bklDc2djM1J5TG5Od2JHbDBLQ2RjWEc0bktTNXRZWEFvWm5WdVkzUnBiMjRvYkdsdVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUNjZ0lDQW5JQ3NnYkdsdVpUdGNiaUFnSUNBZ0lDQWdJQ0I5S1M1cWIybHVLQ2RjWEc0bktUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCemRISWdQU0JqZEhndWMzUjViR2w2WlNnblcwTnBjbU4xYkdGeVhTY3NJQ2R6Y0dWamFXRnNKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNGdJR2xtSUNocGMxVnVaR1ZtYVc1bFpDaHVZVzFsS1NrZ2UxeHVJQ0FnSUdsbUlDaGhjbkpoZVNBbUppQnJaWGt1YldGMFkyZ29MMTVjWEdRckpDOHBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1J5TzF4dUlDQWdJSDFjYmlBZ0lDQnVZVzFsSUQwZ1NsTlBUaTV6ZEhKcGJtZHBabmtvSnljZ0t5QnJaWGtwTzF4dUlDQWdJR2xtSUNodVlXMWxMbTFoZEdOb0tDOWVYQ0lvVzJFdGVrRXRXbDlkVzJFdGVrRXRXbDh3TFRsZEtpbGNJaVF2S1NrZ2UxeHVJQ0FnSUNBZ2JtRnRaU0E5SUc1aGJXVXVjM1ZpYzNSeUtERXNJRzVoYldVdWJHVnVaM1JvSUMwZ01pazdYRzRnSUNBZ0lDQnVZVzFsSUQwZ1kzUjRMbk4wZVd4cGVtVW9ibUZ0WlN3Z0oyNWhiV1VuS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdibUZ0WlNBOUlHNWhiV1V1Y21Wd2JHRmpaU2d2Snk5bkxDQmNJbHhjWEZ3blhDSXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzV5WlhCc1lXTmxLQzljWEZ4Y1hDSXZaeXdnSjF3aUp5bGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMbkpsY0d4aFkyVW9MeWhlWENKOFhDSWtLUzluTENCY0lpZGNJaWs3WEc0Z0lDQWdJQ0J1WVcxbElEMGdZM1I0TG5OMGVXeHBlbVVvYm1GdFpTd2dKM04wY21sdVp5Y3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnVZVzFsSUNzZ0p6b2dKeUFySUhOMGNqdGNibjFjYmx4dVhHNW1kVzVqZEdsdmJpQnlaV1IxWTJWVWIxTnBibWRzWlZOMGNtbHVaeWh2ZFhSd2RYUXNJR0poYzJVc0lHSnlZV05sY3lrZ2UxeHVJQ0IyWVhJZ2JuVnRUR2x1WlhORmMzUWdQU0F3TzF4dUlDQjJZWElnYkdWdVozUm9JRDBnYjNWMGNIVjBMbkpsWkhWalpTaG1kVzVqZEdsdmJpaHdjbVYyTENCamRYSXBJSHRjYmlBZ0lDQnVkVzFNYVc1bGMwVnpkQ3NyTzF4dUlDQWdJR2xtSUNoamRYSXVhVzVrWlhoUFppZ25YRnh1SnlrZ1BqMGdNQ2tnYm5WdFRHbHVaWE5GYzNRckt6dGNiaUFnSUNCeVpYUjFjbTRnY0hKbGRpQXJJR04xY2k1eVpYQnNZV05sS0M5Y1hIVXdNREZpWEZ4YlhGeGtYRnhrUDIwdlp5d2dKeWNwTG14bGJtZDBhQ0FySURFN1hHNGdJSDBzSURBcE8xeHVYRzRnSUdsbUlDaHNaVzVuZEdnZ1BpQTJNQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQmljbUZqWlhOYk1GMGdLMXh1SUNBZ0lDQWdJQ0FnSUNBb1ltRnpaU0E5UFQwZ0p5Y2dQeUFuSnlBNklHSmhjMlVnS3lBblhGeHVJQ2NwSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdKeUFuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdiM1YwY0hWMExtcHZhVzRvSnl4Y1hHNGdJQ2NwSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdKeUFuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdZbkpoWTJWeld6RmRPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJR0p5WVdObGMxc3dYU0FySUdKaGMyVWdLeUFuSUNjZ0t5QnZkWFJ3ZFhRdWFtOXBiaWduTENBbktTQXJJQ2NnSnlBcklHSnlZV05sYzFzeFhUdGNibjFjYmx4dVhHNHZMeUJPVDFSRk9pQlVhR1Z6WlNCMGVYQmxJR05vWldOcmFXNW5JR1oxYm1OMGFXOXVjeUJwYm5SbGJuUnBiMjVoYkd4NUlHUnZiaWQwSUhWelpTQmdhVzV6ZEdGdVkyVnZabUJjYmk4dklHSmxZMkYxYzJVZ2FYUWdhWE1nWm5KaFoybHNaU0JoYm1RZ1kyRnVJR0psSUdWaGMybHNlU0JtWVd0bFpDQjNhWFJvSUdCUFltcGxZM1F1WTNKbFlYUmxLQ2xnTGx4dVpuVnVZM1JwYjI0Z2FYTkJjbkpoZVNoaGNpa2dlMXh1SUNCeVpYUjFjbTRnUVhKeVlYa3VhWE5CY25KaGVTaGhjaWs3WEc1OVhHNWxlSEJ2Y25SekxtbHpRWEp5WVhrZ1BTQnBjMEZ5Y21GNU8xeHVYRzVtZFc1amRHbHZiaUJwYzBKdmIyeGxZVzRvWVhKbktTQjdYRzRnSUhKbGRIVnliaUIwZVhCbGIyWWdZWEpuSUQwOVBTQW5ZbTl2YkdWaGJpYzdYRzU5WEc1bGVIQnZjblJ6TG1selFtOXZiR1ZoYmlBOUlHbHpRbTl2YkdWaGJqdGNibHh1Wm5WdVkzUnBiMjRnYVhOT2RXeHNLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdZWEpuSUQwOVBTQnVkV3hzTzF4dWZWeHVaWGh3YjNKMGN5NXBjMDUxYkd3Z1BTQnBjMDUxYkd3N1hHNWNibVoxYm1OMGFXOXVJR2x6VG5Wc2JFOXlWVzVrWldacGJtVmtLR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdZWEpuSUQwOUlHNTFiR3c3WEc1OVhHNWxlSEJ2Y25SekxtbHpUblZzYkU5eVZXNWtaV1pwYm1Wa0lEMGdhWE5PZFd4c1QzSlZibVJsWm1sdVpXUTdYRzVjYm1aMWJtTjBhVzl1SUdselRuVnRZbVZ5S0dGeVp5a2dlMXh1SUNCeVpYUjFjbTRnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKMjUxYldKbGNpYzdYRzU5WEc1bGVIQnZjblJ6TG1selRuVnRZbVZ5SUQwZ2FYTk9kVzFpWlhJN1hHNWNibVoxYm1OMGFXOXVJR2x6VTNSeWFXNW5LR0Z5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlHRnlaeUE5UFQwZ0ozTjBjbWx1WnljN1hHNTlYRzVsZUhCdmNuUnpMbWx6VTNSeWFXNW5JRDBnYVhOVGRISnBibWM3WEc1Y2JtWjFibU4wYVc5dUlHbHpVM2x0WW05c0tHRnlaeWtnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUdGeVp5QTlQVDBnSjNONWJXSnZiQ2M3WEc1OVhHNWxlSEJ2Y25SekxtbHpVM2x0WW05c0lEMGdhWE5UZVcxaWIydzdYRzVjYm1aMWJtTjBhVzl1SUdselZXNWtaV1pwYm1Wa0tHRnlaeWtnZTF4dUlDQnlaWFIxY200Z1lYSm5JRDA5UFNCMmIybGtJREE3WEc1OVhHNWxlSEJ2Y25SekxtbHpWVzVrWldacGJtVmtJRDBnYVhOVmJtUmxabWx1WldRN1hHNWNibVoxYm1OMGFXOXVJR2x6VW1WblJYaHdLSEpsS1NCN1hHNGdJSEpsZEhWeWJpQnBjMDlpYW1WamRDaHlaU2tnSmlZZ2IySnFaV04wVkc5VGRISnBibWNvY21VcElEMDlQU0FuVzI5aWFtVmpkQ0JTWldkRmVIQmRKenRjYm4xY2JtVjRjRzl5ZEhNdWFYTlNaV2RGZUhBZ1BTQnBjMUpsWjBWNGNEdGNibHh1Wm5WdVkzUnBiMjRnYVhOUFltcGxZM1FvWVhKbktTQjdYRzRnSUhKbGRIVnliaUIwZVhCbGIyWWdZWEpuSUQwOVBTQW5iMkpxWldOMEp5QW1KaUJoY21jZ0lUMDlJRzUxYkd3N1hHNTlYRzVsZUhCdmNuUnpMbWx6VDJKcVpXTjBJRDBnYVhOUFltcGxZM1E3WEc1Y2JtWjFibU4wYVc5dUlHbHpSR0YwWlNoa0tTQjdYRzRnSUhKbGRIVnliaUJwYzA5aWFtVmpkQ2hrS1NBbUppQnZZbXBsWTNSVWIxTjBjbWx1Wnloa0tTQTlQVDBnSjF0dlltcGxZM1FnUkdGMFpWMG5PMXh1ZlZ4dVpYaHdiM0owY3k1cGMwUmhkR1VnUFNCcGMwUmhkR1U3WEc1Y2JtWjFibU4wYVc5dUlHbHpSWEp5YjNJb1pTa2dlMXh1SUNCeVpYUjFjbTRnYVhOUFltcGxZM1FvWlNrZ0ppWmNiaUFnSUNBZ0lDaHZZbXBsWTNSVWIxTjBjbWx1WnlobEtTQTlQVDBnSjF0dlltcGxZM1FnUlhKeWIzSmRKeUI4ZkNCbElHbHVjM1JoYm1ObGIyWWdSWEp5YjNJcE8xeHVmVnh1Wlhod2IzSjBjeTVwYzBWeWNtOXlJRDBnYVhORmNuSnZjanRjYmx4dVpuVnVZM1JwYjI0Z2FYTkdkVzVqZEdsdmJpaGhjbWNwSUh0Y2JpQWdjbVYwZFhKdUlIUjVjR1Z2WmlCaGNtY2dQVDA5SUNkbWRXNWpkR2x2YmljN1hHNTlYRzVsZUhCdmNuUnpMbWx6Um5WdVkzUnBiMjRnUFNCcGMwWjFibU4wYVc5dU8xeHVYRzVtZFc1amRHbHZiaUJwYzFCeWFXMXBkR2wyWlNoaGNtY3BJSHRjYmlBZ2NtVjBkWEp1SUdGeVp5QTlQVDBnYm5Wc2JDQjhmRnh1SUNBZ0lDQWdJQ0FnZEhsd1pXOW1JR0Z5WnlBOVBUMGdKMkp2YjJ4bFlXNG5JSHg4WEc0Z0lDQWdJQ0FnSUNCMGVYQmxiMllnWVhKbklEMDlQU0FuYm5WdFltVnlKeUI4ZkZ4dUlDQWdJQ0FnSUNBZ2RIbHdaVzltSUdGeVp5QTlQVDBnSjNOMGNtbHVaeWNnZkh4Y2JpQWdJQ0FnSUNBZ0lIUjVjR1Z2WmlCaGNtY2dQVDA5SUNkemVXMWliMnduSUh4OElDQXZMeUJGVXpZZ2MzbHRZbTlzWEc0Z0lDQWdJQ0FnSUNCMGVYQmxiMllnWVhKbklEMDlQU0FuZFc1a1pXWnBibVZrSnp0Y2JuMWNibVY0Y0c5eWRITXVhWE5RY21sdGFYUnBkbVVnUFNCcGMxQnlhVzFwZEdsMlpUdGNibHh1Wlhod2IzSjBjeTVwYzBKMVptWmxjaUE5SUhKbGNYVnBjbVVvSnk0dmMzVndjRzl5ZEM5cGMwSjFabVpsY2ljcE8xeHVYRzVtZFc1amRHbHZiaUJ2WW1wbFkzUlViMU4wY21sdVp5aHZLU0I3WEc0Z0lISmxkSFZ5YmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29ieWs3WEc1OVhHNWNibHh1Wm5WdVkzUnBiMjRnY0dGa0tHNHBJSHRjYmlBZ2NtVjBkWEp1SUc0Z1BDQXhNQ0EvSUNjd0p5QXJJRzR1ZEc5VGRISnBibWNvTVRBcElEb2diaTUwYjFOMGNtbHVaeWd4TUNrN1hHNTlYRzVjYmx4dWRtRnlJRzF2Ym5Sb2N5QTlJRnNuU21GdUp5d2dKMFpsWWljc0lDZE5ZWEluTENBblFYQnlKeXdnSjAxaGVTY3NJQ2RLZFc0bkxDQW5TblZzSnl3Z0owRjFaeWNzSUNkVFpYQW5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5UMk4wSnl3Z0owNXZkaWNzSUNkRVpXTW5YVHRjYmx4dUx5OGdNallnUm1WaUlERTJPakU1T2pNMFhHNW1kVzVqZEdsdmJpQjBhVzFsYzNSaGJYQW9LU0I3WEc0Z0lIWmhjaUJrSUQwZ2JtVjNJRVJoZEdVb0tUdGNiaUFnZG1GeUlIUnBiV1VnUFNCYmNHRmtLR1F1WjJWMFNHOTFjbk1vS1Nrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhCaFpDaGtMbWRsZEUxcGJuVjBaWE1vS1Nrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhCaFpDaGtMbWRsZEZObFkyOXVaSE1vS1NsZExtcHZhVzRvSnpvbktUdGNiaUFnY21WMGRYSnVJRnRrTG1kbGRFUmhkR1VvS1N3Z2JXOXVkR2h6VzJRdVoyVjBUVzl1ZEdnb0tWMHNJSFJwYldWZExtcHZhVzRvSnlBbktUdGNibjFjYmx4dVhHNHZMeUJzYjJjZ2FYTWdhblZ6ZENCaElIUm9hVzRnZDNKaGNIQmxjaUIwYnlCamIyNXpiMnhsTG14dlp5QjBhR0YwSUhCeVpYQmxibVJ6SUdFZ2RHbHRaWE4wWVcxd1hHNWxlSEJ2Y25SekxteHZaeUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0JqYjI1emIyeGxMbXh2WnlnbkpYTWdMU0FsY3ljc0lIUnBiV1Z6ZEdGdGNDZ3BMQ0JsZUhCdmNuUnpMbVp2Y20xaGRDNWhjSEJzZVNobGVIQnZjblJ6TENCaGNtZDFiV1Z1ZEhNcEtUdGNibjA3WEc1Y2JseHVMeW9xWEc0Z0tpQkpibWhsY21sMElIUm9aU0J3Y205MGIzUjVjR1VnYldWMGFHOWtjeUJtY205dElHOXVaU0JqYjI1emRISjFZM1J2Y2lCcGJuUnZJR0Z1YjNSb1pYSXVYRzRnS2x4dUlDb2dWR2hsSUVaMWJtTjBhVzl1TG5CeWIzUnZkSGx3WlM1cGJtaGxjbWwwY3lCbWNtOXRJR3hoYm1jdWFuTWdjbVYzY21sMGRHVnVJR0Z6SUdFZ2MzUmhibVJoYkc5dVpWeHVJQ29nWm5WdVkzUnBiMjRnS0c1dmRDQnZiaUJHZFc1amRHbHZiaTV3Y205MGIzUjVjR1VwTGlCT1QxUkZPaUJKWmlCMGFHbHpJR1pwYkdVZ2FYTWdkRzhnWW1VZ2JHOWhaR1ZrWEc0Z0tpQmtkWEpwYm1jZ1ltOXZkSE4wY21Gd2NHbHVaeUIwYUdseklHWjFibU4wYVc5dUlHNWxaV1J6SUhSdklHSmxJSEpsZDNKcGRIUmxiaUIxYzJsdVp5QnpiMjFsSUc1aGRHbDJaVnh1SUNvZ1puVnVZM1JwYjI1eklHRnpJSEJ5YjNSdmRIbHdaU0J6WlhSMWNDQjFjMmx1WnlCdWIzSnRZV3dnU21GMllWTmpjbWx3ZENCa2IyVnpJRzV2ZENCM2IzSnJJR0Z6WEc0Z0tpQmxlSEJsWTNSbFpDQmtkWEpwYm1jZ1ltOXZkSE4wY21Gd2NHbHVaeUFvYzJWbElHMXBjbkp2Y2k1cWN5QnBiaUJ5TVRFME9UQXpLUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0JqZEc5eUlFTnZibk4wY25WamRHOXlJR1oxYm1OMGFXOXVJSGRvYVdOb0lHNWxaV1J6SUhSdklHbHVhR1Z5YVhRZ2RHaGxYRzRnS2lBZ0lDQWdjSEp2ZEc5MGVYQmxMbHh1SUNvZ1FIQmhjbUZ0SUh0bWRXNWpkR2x2Ym4wZ2MzVndaWEpEZEc5eUlFTnZibk4wY25WamRHOXlJR1oxYm1OMGFXOXVJSFJ2SUdsdWFHVnlhWFFnY0hKdmRHOTBlWEJsSUdaeWIyMHVYRzRnS2k5Y2JtVjRjRzl5ZEhNdWFXNW9aWEpwZEhNZ1BTQnlaWEYxYVhKbEtDZHBibWhsY21sMGN5Y3BPMXh1WEc1bGVIQnZjblJ6TGw5bGVIUmxibVFnUFNCbWRXNWpkR2x2YmlodmNtbG5hVzRzSUdGa1pDa2dlMXh1SUNBdkx5QkViMjRuZENCa2J5QmhibmwwYUdsdVp5QnBaaUJoWkdRZ2FYTnVKM1FnWVc0Z2IySnFaV04wWEc0Z0lHbG1JQ2doWVdSa0lIeDhJQ0ZwYzA5aWFtVmpkQ2hoWkdRcEtTQnlaWFIxY200Z2IzSnBaMmx1TzF4dVhHNGdJSFpoY2lCclpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNb1lXUmtLVHRjYmlBZ2RtRnlJR2tnUFNCclpYbHpMbXhsYm1kMGFEdGNiaUFnZDJocGJHVWdLR2t0TFNrZ2UxeHVJQ0FnSUc5eWFXZHBibHRyWlhselcybGRYU0E5SUdGa1pGdHJaWGx6VzJsZFhUdGNiaUFnZlZ4dUlDQnlaWFIxY200Z2IzSnBaMmx1TzF4dWZUdGNibHh1Wm5WdVkzUnBiMjRnYUdGelQzZHVVSEp2Y0dWeWRIa29iMkpxTENCd2NtOXdLU0I3WEc0Z0lISmxkSFZ5YmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFMQ0J3Y205d0tUdGNibjFjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvY3NqcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2dldC1jc3MnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNzanMgPSByZXF1aXJlKCcuL2NzanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjc2pzO1xubW9kdWxlLmV4cG9ydHMuY3NqcyA9IGNzanM7XG5tb2R1bGUuZXhwb3J0cy5nZXRDc3MgPSByZXF1aXJlKCcuL2dldC1jc3MnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBiYXNlNjIgZW5jb2RlIGltcGxlbWVudGF0aW9uIGJhc2VkIG9uIGJhc2U2MiBtb2R1bGU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5kcmV3L2Jhc2U2Mi5qc1xuICovXG5cbnZhciBDSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5jb2RlKGludGVnZXIpIHtcbiAgaWYgKGludGVnZXIgPT09IDApIHtcbiAgICByZXR1cm4gJzAnO1xuICB9XG4gIHZhciBzdHIgPSAnJztcbiAgd2hpbGUgKGludGVnZXIgPiAwKSB7XG4gICAgc3RyID0gQ0hBUlNbaW50ZWdlciAlIDYyXSArIHN0cjtcbiAgICBpbnRlZ2VyID0gTWF0aC5mbG9vcihpbnRlZ2VyIC8gNjIpO1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWFrZUNvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLm1ha2VDb21wb3NpdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFeHBvcnRzKGNsYXNzZXMsIGtleWZyYW1lcywgY29tcG9zaXRpb25zKSB7XG4gIHZhciBrZXlmcmFtZXNPYmogPSBPYmplY3Qua2V5cyhrZXlmcmFtZXMpLnJlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgIHZhciB2YWwgPSBrZXlmcmFtZXNba2V5XTtcbiAgICBhY2NbdmFsXSA9IG1ha2VDb21wb3NpdGlvbihba2V5XSwgW3ZhbF0sIHRydWUpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuICB2YXIgZXhwb3J0cyA9IE9iamVjdC5rZXlzKGNsYXNzZXMpLnJlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgIHZhciB2YWwgPSBjbGFzc2VzW2tleV07XG4gICAgdmFyIGNvbXBvc2l0aW9uID0gY29tcG9zaXRpb25zW2tleV07XG4gICAgdmFyIGV4dGVuZGVkID0gY29tcG9zaXRpb24gPyBnZXRDbGFzc0NoYWluKGNvbXBvc2l0aW9uKSA6IFtdO1xuICAgIHZhciBhbGxDbGFzc2VzID0gW2tleV0uY29uY2F0KGV4dGVuZGVkKTtcbiAgICB2YXIgdW5zY29wZWQgPSBhbGxDbGFzc2VzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gY2xhc3Nlc1tuYW1lXSA/IGNsYXNzZXNbbmFtZV0gOiBuYW1lO1xuICAgIH0pO1xuICAgIGFjY1t2YWxdID0gbWFrZUNvbXBvc2l0aW9uKGFsbENsYXNzZXMsIHVuc2NvcGVkKTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCBrZXlmcmFtZXNPYmopO1xuXG4gIHJldHVybiBleHBvcnRzO1xufVxuXG5mdW5jdGlvbiBnZXRDbGFzc0NoYWluKG9iaikge1xuICB2YXIgdmlzaXRlZCA9IHt9LCBhY2MgPSBbXTtcblxuICBmdW5jdGlvbiB0cmF2ZXJzZShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKCF2aXNpdGVkW2tleV0pIHtcbiAgICAgICAgdmlzaXRlZFtrZXldID0gdHJ1ZTtcbiAgICAgICAgYWNjLnB1c2goa2V5KTtcbiAgICAgICAgdHJhdmVyc2Uob2JqW2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdHJhdmVyc2Uob2JqKTtcbiAgcmV0dXJuIGFjYztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ha2VDb21wb3NpdGlvbjogbWFrZUNvbXBvc2l0aW9uLFxuICBpc0NvbXBvc2l0aW9uOiBpc0NvbXBvc2l0aW9uXG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gaW1tdXRhYmxlIGNvbXBvc2l0aW9uIG9iamVjdCBjb250YWluaW5nIHRoZSBnaXZlbiBjbGFzcyBuYW1lc1xuICogQHBhcmFtICB7YXJyYXl9IGNsYXNzTmFtZXMgLSBUaGUgaW5wdXQgYXJyYXkgb2YgY2xhc3MgbmFtZXNcbiAqIEByZXR1cm4ge0NvbXBvc2l0aW9ufSAgICAgIC0gQW4gaW1tdXRhYmxlIG9iamVjdCB0aGF0IGhvbGRzIG11bHRpcGxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgY2xhc3MgY29tcG9zaXRpb25cbiAqL1xuZnVuY3Rpb24gbWFrZUNvbXBvc2l0aW9uKGNsYXNzTmFtZXMsIHVuc2NvcGVkLCBpc0FuaW1hdGlvbikge1xuICB2YXIgY2xhc3NTdHJpbmcgPSBjbGFzc05hbWVzLmpvaW4oJyAnKTtcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoQ29tcG9zaXRpb24ucHJvdG90eXBlLCB7XG4gICAgY2xhc3NOYW1lczogeyAvLyB0aGUgb3JpZ2luYWwgYXJyYXkgb2YgY2xhc3MgbmFtZXNcbiAgICAgIHZhbHVlOiBPYmplY3QuZnJlZXplKGNsYXNzTmFtZXMpLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIHVuc2NvcGVkOiB7IC8vIHRoZSBvcmlnaW5hbCBhcnJheSBvZiBjbGFzcyBuYW1lc1xuICAgICAgdmFsdWU6IE9iamVjdC5mcmVlemUodW5zY29wZWQpLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIGNsYXNzTmFtZTogeyAvLyBzcGFjZS1zZXBhcmF0ZWQgY2xhc3Mgc3RyaW5nIGZvciB1c2UgaW4gSFRNTFxuICAgICAgdmFsdWU6IGNsYXNzU3RyaW5nLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIHNlbGVjdG9yOiB7IC8vIGNvbW1hLXNlcGFyYXRlZCwgcGVyaW9kLXByZWZpeGVkIHN0cmluZyBmb3IgdXNlIGluIENTU1xuICAgICAgdmFsdWU6IGNsYXNzTmFtZXMubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGlzQW5pbWF0aW9uID8gbmFtZSA6ICcuJyArIG5hbWU7XG4gICAgICB9KS5qb2luKCcsICcpLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIHRvU3RyaW5nOiB7IC8vIHRvU3RyaW5nKCkgbWV0aG9kLCByZXR1cm5zIGNsYXNzIHN0cmluZyBmb3IgdXNlIGluIEhUTUxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzU3RyaW5nO1xuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0ZWFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciB0aGUgaW5wdXQgdmFsdWUgaXMgYSBDb21wb3NpdGlvblxuICogQHBhcmFtIHZhbHVlICAgICAgLSB2YWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Ym9vbGVhbn0gLSB3aGV0aGVyIHZhbHVlIGlzIGEgQ29tcG9zaXRpb24gb3Igbm90XG4gKi9cbmZ1bmN0aW9uIGlzQ29tcG9zaXRpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQ29tcG9zaXRpb247XG59XG5cbi8qKlxuICogUHJpdmF0ZSBjb25zdHJ1Y3RvciBmb3IgdXNlIGluIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAqL1xuZnVuY3Rpb24gQ29tcG9zaXRpb24oKSB7fVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0cmFjdEV4dGVuZHMgPSByZXF1aXJlKCcuL2Nzcy1leHRyYWN0LWV4dGVuZHMnKTtcbnZhciBpc0NvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLmlzQ29tcG9zaXRpb247XG52YXIgYnVpbGRFeHBvcnRzID0gcmVxdWlyZSgnLi9idWlsZC1leHBvcnRzJyk7XG52YXIgc2NvcGlmeSA9IHJlcXVpcmUoJy4vc2NvcGVpZnknKTtcbnZhciBjc3NLZXkgPSByZXF1aXJlKCcuL2Nzcy1rZXknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjc2pzSGFuZGxlcihzdHJpbmdzKSB7XG4gIHZhciB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgY3NzID0gam9pbmVyKHN0cmluZ3MsIHZhbHVlcy5tYXAoc2VsZWN0b3JpemUpKTtcblxuICB2YXIgaWdub3JlcyA9IHZhbHVlcy5yZWR1Y2UoZnVuY3Rpb24oYWNjLCB2YWwpIHtcbiAgICBpZiAoaXNDb21wb3NpdGlvbih2YWwpKSB7XG4gICAgICB2YWwuY2xhc3NOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGkpIHtcbiAgICAgICAgYWNjW25hbWVdID0gdmFsLnVuc2NvcGVkW2ldO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuICB2YXIgc2NvcGVkID0gc2NvcGlmeShjc3MsIGlnbm9yZXMpO1xuICB2YXIgaGFzaGVzID0gT2JqZWN0LmFzc2lnbih7fSwgc2NvcGVkLmNsYXNzZXMsIHNjb3BlZC5rZXlmcmFtZXMpO1xuICB2YXIgZXh0cmFjdGVkID0gZXh0cmFjdEV4dGVuZHMoc2NvcGVkLmNzcywgaGFzaGVzKTtcblxuICB2YXIgbG9jYWxDbGFzc2VzID0gd2l0aG91dChzY29wZWQuY2xhc3NlcywgaWdub3Jlcyk7XG4gIHZhciBsb2NhbEtleWZyYW1lcyA9IHdpdGhvdXQoc2NvcGVkLmtleWZyYW1lcywgaWdub3Jlcyk7XG4gIHZhciBjb21wb3NpdGlvbnMgPSBleHRyYWN0ZWQuY29tcG9zaXRpb25zO1xuXG4gIHZhciBleHBvcnRzID0gYnVpbGRFeHBvcnRzKGxvY2FsQ2xhc3NlcywgbG9jYWxLZXlmcmFtZXMsIGNvbXBvc2l0aW9ucyk7XG5cbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBjc3NLZXksIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIHdyaXRlYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IGV4dHJhY3RlZC5jc3NcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJlcGxhY2VzIGNsYXNzIGNvbXBvc2l0aW9ucyB3aXRoIGNvbW1hIHNlcGVyYXRlZCBjbGFzcyBzZWxlY3RvcnNcbiAqIEBwYXJhbSAgdmFsdWUgLSB0aGUgcG90ZW50aWFsIGNsYXNzIGNvbXBvc2l0aW9uXG4gKiBAcmV0dXJuICAgICAgIC0gdGhlIG9yaWdpbmFsIHZhbHVlIG9yIHRoZSBzZWxlY3Rvcml6ZWQgY2xhc3MgY29tcG9zaXRpb25cbiAqL1xuZnVuY3Rpb24gc2VsZWN0b3JpemUodmFsdWUpIHtcbiAgcmV0dXJuIGlzQ29tcG9zaXRpb24odmFsdWUpID8gdmFsdWUuc2VsZWN0b3IgOiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBKb2lucyB0ZW1wbGF0ZSBzdHJpbmcgbGl0ZXJhbHMgYW5kIHZhbHVlc1xuICogQHBhcmFtICB7YXJyYXl9IHN0cmluZ3MgLSBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcGFyYW0gIHthcnJheX0gdmFsdWVzICAtIGFycmF5IG9mIHZhbHVlc1xuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgLSBzdHJpbmdzIGFuZCB2YWx1ZXMgam9pbmVkXG4gKi9cbmZ1bmN0aW9uIGpvaW5lcihzdHJpbmdzLCB2YWx1ZXMpIHtcbiAgcmV0dXJuIHN0cmluZ3MubWFwKGZ1bmN0aW9uKHN0ciwgaSkge1xuICAgIHJldHVybiAoaSAhPT0gdmFsdWVzLmxlbmd0aCkgPyBzdHIgKyB2YWx1ZXNbaV0gOiBzdHI7XG4gIH0pLmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgZmlyc3Qgb2JqZWN0IHdpdGhvdXQga2V5cyBvZiBzZWNvbmRcbiAqIEBwYXJhbSAge29iamVjdH0gb2JqICAgICAgLSBzb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0gIHtvYmplY3R9IHVud2FudGVkIC0gb2JqZWN0IHdpdGggdW53YW50ZWQga2V5c1xuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAtIGZpcnN0IG9iamVjdCB3aXRob3V0IHVud2FudGVkIGtleXNcbiAqL1xuZnVuY3Rpb24gd2l0aG91dChvYmosIHVud2FudGVkKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgIGlmICghdW53YW50ZWRba2V5XSkge1xuICAgICAgYWNjW2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWFrZUNvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLm1ha2VDb21wb3NpdGlvbjtcblxudmFyIHJlZ2V4ID0gLyguKj8pKFxccys/KShleHRlbmRzXFxzKz8pKCg/Oi58XFxuKSo/KXsoPzooPzoufFxcbikqPyl9L2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0cmFjdEV4dGVuZHMoY3NzLCBoYXNoZWQpIHtcbiAgdmFyIGZvdW5kLCBtYXRjaGVzID0gW107XG4gIHdoaWxlIChmb3VuZCA9IHJlZ2V4LmV4ZWMoY3NzKSkge1xuICAgIG1hdGNoZXMudW5zaGlmdChmb3VuZCk7XG4gIH1cblxuICBmdW5jdGlvbiBleHRyYWN0Q29tcG9zaXRpb25zKGFjYywgbWF0Y2gpIHtcbiAgICB2YXIgZXh0ZW5kZWUgPSBnZXRDbGFzc05hbWUobWF0Y2hbMV0pO1xuICAgIHZhciBrZXl3b3JkID0gbWF0Y2hbM107XG4gICAgdmFyIGV4dGVuZGVkID0gbWF0Y2hbNF07XG5cbiAgICAvLyByZW1vdmUgZnJvbSBvdXRwdXQgY3NzXG4gICAgdmFyIGluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGggKyBtYXRjaFsyXS5sZW5ndGg7XG4gICAgdmFyIGxlbiA9IGtleXdvcmQubGVuZ3RoICsgZXh0ZW5kZWQubGVuZ3RoO1xuICAgIGFjYy5jc3MgPSBhY2MuY3NzLnNsaWNlKDAsIGluZGV4KSArIGFjYy5jc3Muc2xpY2UoaW5kZXggKyBsZW4pO1xuICAgIFxuICAgIHZhciBleHRlbmRlZENsYXNzZXMgPSBzcGxpdHRlcihleHRlbmRlZCk7XG5cbiAgICBleHRlbmRlZENsYXNzZXMuZm9yRWFjaChmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIGlmICghYWNjLmNvbXBvc2l0aW9uc1tleHRlbmRlZV0pIHtcbiAgICAgICAgYWNjLmNvbXBvc2l0aW9uc1tleHRlbmRlZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICghYWNjLmNvbXBvc2l0aW9uc1tjbGFzc05hbWVdKSB7XG4gICAgICAgIGFjYy5jb21wb3NpdGlvbnNbY2xhc3NOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgYWNjLmNvbXBvc2l0aW9uc1tleHRlbmRlZV1bY2xhc3NOYW1lXSA9IGFjYy5jb21wb3NpdGlvbnNbY2xhc3NOYW1lXTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXMucmVkdWNlKGV4dHJhY3RDb21wb3NpdGlvbnMsIHtcbiAgICBjc3M6IGNzcyxcbiAgICBjb21wb3NpdGlvbnM6IHt9XG4gIH0pO1xuXG59O1xuXG5mdW5jdGlvbiBzcGxpdHRlcihtYXRjaCkge1xuICByZXR1cm4gbWF0Y2guc3BsaXQoJywnKS5tYXAoZ2V0Q2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHN0cikge1xuICB2YXIgdHJpbW1lZCA9IHN0ci50cmltKCk7XG4gIHJldHVybiB0cmltbWVkWzBdID09PSAnLicgPyB0cmltbWVkLnN1YnN0cigxKSA6IHRyaW1tZWQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ1NTIGlkZW50aWZpZXJzIHdpdGggd2hpdGVzcGFjZSBhcmUgaW52YWxpZFxuICogSGVuY2UgdGhpcyBrZXkgd2lsbCBub3QgY2F1c2UgYSBjb2xsaXNpb25cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9ICcgY3NzICc7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjc3NLZXkgPSByZXF1aXJlKCcuL2Nzcy1rZXknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRDc3MoY3Nqcykge1xuICByZXR1cm4gY3Nqc1tjc3NLZXldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBkamIyIHN0cmluZyBoYXNoIGltcGxlbWVudGF0aW9uIGJhc2VkIG9uIHN0cmluZy1oYXNoIG1vZHVsZTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNoU3RyKHN0cikge1xuICB2YXIgaGFzaCA9IDUzODE7XG4gIHZhciBpID0gc3RyLmxlbmd0aDtcblxuICB3aGlsZSAoaSkge1xuICAgIGhhc2ggPSAoaGFzaCAqIDMzKSBeIHN0ci5jaGFyQ29kZUF0KC0taSlcbiAgfVxuICByZXR1cm4gaGFzaCA+Pj4gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmNvZGUgPSByZXF1aXJlKCcuL2Jhc2U2Mi1lbmNvZGUnKTtcbnZhciBoYXNoID0gcmVxdWlyZSgnLi9oYXNoLXN0cmluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbGVTY29wZXIoZmlsZVNyYykge1xuICB2YXIgc3VmZml4ID0gZW5jb2RlKGhhc2goZmlsZVNyYykpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBzY29wZWROYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSArICdfJyArIHN1ZmZpeDtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZpbGVTY29wZXIgPSByZXF1aXJlKCcuL3Njb3BlZC1uYW1lJyk7XG5cbnZhciBmaW5kQ2xhc3NlcyA9IC8oXFwuKSg/IVxcZCkoW15cXHNcXC4se1xcWz4rfiM6XSopKD8hW157XSp9KS8uc291cmNlO1xudmFyIGZpbmRLZXlmcmFtZXMgPSAvKEBcXFMqa2V5ZnJhbWVzXFxzKikoW157XFxzXSopLy5zb3VyY2U7XG52YXIgaWdub3JlQ29tbWVudHMgPSAvKD8hKD86W14qL118XFwqW14vXXxcXC9bXipdKSpcXCorXFwvKS8uc291cmNlO1xuXG52YXIgY2xhc3NSZWdleCA9IG5ldyBSZWdFeHAoZmluZENsYXNzZXMgKyBpZ25vcmVDb21tZW50cywgJ2cnKTtcbnZhciBrZXlmcmFtZXNSZWdleCA9IG5ldyBSZWdFeHAoZmluZEtleWZyYW1lcyArIGlnbm9yZUNvbW1lbnRzLCAnZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNjb3BpZnk7XG5cbmZ1bmN0aW9uIHNjb3BpZnkoY3NzLCBpZ25vcmVzKSB7XG4gIHZhciBtYWtlU2NvcGVkTmFtZSA9IGZpbGVTY29wZXIoY3NzKTtcbiAgdmFyIHJlcGxhY2VycyA9IHtcbiAgICBjbGFzc2VzOiBjbGFzc1JlZ2V4LFxuICAgIGtleWZyYW1lczoga2V5ZnJhbWVzUmVnZXhcbiAgfTtcblxuICBmdW5jdGlvbiBzY29wZUNzcyhyZXN1bHQsIGtleSkge1xuICAgIHZhciByZXBsYWNlciA9IHJlcGxhY2Vyc1trZXldO1xuICAgIGZ1bmN0aW9uIHJlcGxhY2VGbihmdWxsTWF0Y2gsIHByZWZpeCwgbmFtZSkge1xuICAgICAgdmFyIHNjb3BlZE5hbWUgPSBpZ25vcmVzW25hbWVdID8gbmFtZSA6IG1ha2VTY29wZWROYW1lKG5hbWUpO1xuICAgICAgcmVzdWx0W2tleV1bc2NvcGVkTmFtZV0gPSBuYW1lO1xuICAgICAgcmV0dXJuIHByZWZpeCArIHNjb3BlZE5hbWU7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBjc3M6IHJlc3VsdC5jc3MucmVwbGFjZShyZXBsYWNlciwgcmVwbGFjZUZuKSxcbiAgICAgIGtleWZyYW1lczogcmVzdWx0LmtleWZyYW1lcyxcbiAgICAgIGNsYXNzZXM6IHJlc3VsdC5jbGFzc2VzXG4gICAgfTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBPYmplY3Qua2V5cyhyZXBsYWNlcnMpLnJlZHVjZShzY29wZUNzcywge1xuICAgIGNzczogY3NzLFxuICAgIGtleWZyYW1lczoge30sXG4gICAgY2xhc3Nlczoge31cbiAgfSk7XG5cbiAgcmV0dXJuIHJlcGxhY2VBbmltYXRpb25zKHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VBbmltYXRpb25zKHJlc3VsdCkge1xuICB2YXIgYW5pbWF0aW9ucyA9IE9iamVjdC5rZXlzKHJlc3VsdC5rZXlmcmFtZXMpLnJlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgIGFjY1tyZXN1bHQua2V5ZnJhbWVzW2tleV1dID0ga2V5O1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbiAgdmFyIHVuc2NvcGVkID0gT2JqZWN0LmtleXMoYW5pbWF0aW9ucyk7XG5cbiAgaWYgKHVuc2NvcGVkLmxlbmd0aCkge1xuICAgIHZhciByZWdleFN0ciA9ICcoKD86YW5pbWF0aW9ufGFuaW1hdGlvbi1uYW1lKVxcXFxzKjpbXn07XSopKCdcbiAgICAgICsgdW5zY29wZWQuam9pbignfCcpICsgJyknICsgaWdub3JlQ29tbWVudHM7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0ciwgJ2cnKTtcblxuICAgIHZhciByZXBsYWNlZCA9IHJlc3VsdC5jc3MucmVwbGFjZShyZWdleCwgZnVuY3Rpb24obWF0Y2gsIHByZWFtYmxlLCBuYW1lKSB7XG4gICAgICByZXR1cm4gcHJlYW1ibGUgKyBhbmltYXRpb25zW25hbWVdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNzczogcmVwbGFjZWQsXG4gICAgICBrZXlmcmFtZXM6IHJlc3VsdC5rZXlmcmFtZXMsXG4gICAgICBjbGFzc2VzOiByZXN1bHQuY2xhc3Nlc1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJ2YXIgd2FsayA9IHJlcXVpcmUoJ2RvbS13YWxrJylcblxudmFyIEZvcm1EYXRhID0gcmVxdWlyZSgnLi9pbmRleC5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Rm9ybURhdGFcblxuZnVuY3Rpb24gYnVpbGRFbGVtcyhyb290RWxlbSkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBpZiAocm9vdEVsZW0ubmFtZSkge1xuICAgIFx0aGFzaFtyb290RWxlbS5uYW1lXSA9IHJvb3RFbGVtXG4gICAgfVxuXG4gICAgd2Fsayhyb290RWxlbSwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZC5uYW1lKSB7XG4gICAgICAgICAgICBoYXNoW2NoaWxkLm5hbWVdID0gY2hpbGRcbiAgICAgICAgfVxuICAgIH0pXG5cblxuICAgIHJldHVybiBoYXNoXG59XG5cbmZ1bmN0aW9uIGdldEZvcm1EYXRhKHJvb3RFbGVtKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gYnVpbGRFbGVtcyhyb290RWxlbSlcblxuICAgIHJldHVybiBGb3JtRGF0YShlbGVtZW50cylcbn1cbiIsIi8qanNoaW50IG1heGNvbXBsZXhpdHk6IDEwKi9cblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtRGF0YVxuXG4vL1RPRE86IE1hc3NpdmUgc3BlYzogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvYXNzb2NpYXRpb24tb2YtY29udHJvbHMtYW5kLWZvcm1zLmh0bWwjY29uc3RydWN0aW5nLWZvcm0tZGF0YS1zZXRcbmZ1bmN0aW9uIEZvcm1EYXRhKGVsZW1lbnRzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGVsZW1lbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgIHZhciBlbGVtID0gZWxlbWVudHNba2V5XVxuXG4gICAgICAgIGFjY1trZXldID0gdmFsdWVPZkVsZW1lbnQoZWxlbSlcblxuICAgICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG59XG5cbmZ1bmN0aW9uIHZhbHVlT2ZFbGVtZW50KGVsZW0pIHtcbiAgICBpZiAodHlwZW9mIGVsZW0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gZWxlbSgpXG4gICAgfSBlbHNlIGlmIChjb250YWluc1JhZGlvKGVsZW0pKSB7XG4gICAgICAgIHZhciBlbGVtcyA9IHRvTGlzdChlbGVtKVxuICAgICAgICB2YXIgY2hlY2tlZCA9IGVsZW1zLmZpbHRlcihmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0uY2hlY2tlZFxuICAgICAgICB9KVswXSB8fCBudWxsXG5cbiAgICAgICAgcmV0dXJuIGNoZWNrZWQgPyBjaGVja2VkLnZhbHVlIDogbnVsbFxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlbGVtKSkge1xuICAgICAgICByZXR1cm4gZWxlbS5tYXAodmFsdWVPZkVsZW1lbnQpLmZpbHRlcihmaWx0ZXJOdWxsKVxuICAgIH0gZWxzZSBpZiAoZWxlbS50YWdOYW1lID09PSB1bmRlZmluZWQgJiYgZWxlbS5ub2RlVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBGb3JtRGF0YShlbGVtKVxuICAgIH0gZWxzZSBpZiAoZWxlbS50YWdOYW1lID09PSBcIklOUFVUXCIgJiYgaXNDaGVja2VkKGVsZW0pKSB7XG4gICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZShcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5jaGVja2VkID8gZWxlbS52YWx1ZSA6IG51bGxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtLmNoZWNrZWRcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZWxlbS50YWdOYW1lID09PSBcIklOUFVUXCIpIHtcbiAgICAgICAgcmV0dXJuIGVsZW0udmFsdWVcbiAgICB9IGVsc2UgaWYgKGVsZW0udGFnTmFtZSA9PT0gXCJURVhUQVJFQVwiKSB7XG4gICAgICAgIHJldHVybiBlbGVtLnZhbHVlXG4gICAgfSBlbHNlIGlmIChlbGVtLnRhZ05hbWUgPT09IFwiU0VMRUNUXCIpIHtcbiAgICAgICAgcmV0dXJuIGVsZW0udmFsdWVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQ2hlY2tlZChlbGVtKSB7XG4gICAgcmV0dXJuIGVsZW0udHlwZSA9PT0gXCJjaGVja2JveFwiIHx8IGVsZW0udHlwZSA9PT0gXCJyYWRpb1wiXG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zUmFkaW8odmFsdWUpIHtcbiAgICBpZiAodmFsdWUudGFnTmFtZSB8fCB2YWx1ZS5ub2RlVHlwZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB2YXIgZWxlbXMgPSB0b0xpc3QodmFsdWUpXG5cbiAgICByZXR1cm4gZWxlbXMuc29tZShmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gZWxlbS50YWdOYW1lID09PSBcIklOUFVUXCIgJiYgZWxlbS50eXBlID09PSBcInJhZGlvXCJcbiAgICB9KVxufVxuXG5mdW5jdGlvbiB0b0xpc3QodmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKS5tYXAocHJvcCwgdmFsdWUpXG59XG5cbmZ1bmN0aW9uIHByb3AoeCkge1xuICAgIHJldHVybiB0aGlzW3hdXG59XG5cbmZ1bmN0aW9uIGZpbHRlck51bGwodmFsKSB7XG4gICAgcmV0dXJuIHZhbCAhPT0gbnVsbFxufVxuIiwidmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG5cbm1vZHVsZS5leHBvcnRzID0gaXRlcmF0aXZlbHlXYWxrXG5cbmZ1bmN0aW9uIGl0ZXJhdGl2ZWx5V2Fsayhub2RlcywgY2IpIHtcbiAgICBpZiAoISgnbGVuZ3RoJyBpbiBub2RlcykpIHtcbiAgICAgICAgbm9kZXMgPSBbbm9kZXNdXG4gICAgfVxuICAgIFxuICAgIG5vZGVzID0gc2xpY2UuY2FsbChub2RlcylcblxuICAgIHdoaWxlKG5vZGVzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzLnNoaWZ0KCksXG4gICAgICAgICAgICByZXQgPSBjYihub2RlKVxuXG4gICAgICAgIGlmIChyZXQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLmNoaWxkTm9kZXMgJiYgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbm9kZXMgPSBzbGljZS5jYWxsKG5vZGUuY2hpbGROb2RlcykuY29uY2F0KG5vZGVzKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNoTWF0Y2ggKGhhc2gsIHByZWZpeCkge1xuICB2YXIgcHJlID0gcHJlZml4IHx8ICcvJztcbiAgaWYgKGhhc2gubGVuZ3RoID09PSAwKSByZXR1cm4gcHJlO1xuICBoYXNoID0gaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICBoYXNoID0gaGFzaC5yZXBsYWNlKC9cXC8kLywgJycpXG4gIGlmIChoYXNoLmluZGV4T2YoJy8nKSAhPSAwKSBoYXNoID0gJy8nICsgaGFzaDtcbiAgaWYgKHByZSA9PSAnLycpIHJldHVybiBoYXNoO1xuICBlbHNlIHJldHVybiBoYXNoLnJlcGxhY2UocHJlLCAnJyk7XG59XG4iLCJ2YXIgdHJhbnNmb3JtID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0nKTtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBoeXBlcnN0eWxlcyhoeXBlcnNjcmlwdCwgc3R5bGVzKSB7XG4gICAgaWYgKHR5cGVvZiBoeXBlcnNjcmlwdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGEgaHlwZXJzY3JpcHQtY29tcGF0aWJsZSBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzdHlsZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBwYXJ0aWFsKHN0eWxlcykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHlsZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIENTUyBNb2R1bGVzLWNvbXBhdGlibGUgc3R5bGVzIG9iamVjdCBhcyB0aGUgZmlyc3QgYXJndW1lbnQuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB3cmFwKGh5cGVyc2NyaXB0LCBzdHlsZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXAoaHlwZXJzY3JpcHQsIHN0eWxlcylcbn1cblxuZnVuY3Rpb24gd3JhcChoeXBlcnNjcmlwdCwgc3R5bGVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWQoKSB7XG4gICAgICAgIHJldHVybiBoeXBlcnNjcmlwdC5hcHBseShudWxsLCB0cmFuc2Zvcm0oc3R5bGVzLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwZXJzdHlsZXM7XG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIGlzU3RyaW5nID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdzdHJpbmcnO1xufTtcbnZhciBpc0FycmF5ID0gIEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh4KSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbnZhciBpc09iamVjdCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggIT0gbnVsbCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgIWlzQXJyYXkoeCk7XG59O1xudmFyIHRvQ2xhc3MgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gc2VsZWN0b3Iuc3Vic3RyaW5nKDEsIHNlbGVjdG9yLmxlbmd0aCk7XG59O1xuZnVuY3Rpb24gaXNOb3RQcm9wcyh4KSB7XG4gICAgcmV0dXJuIHggPT0gbnVsbCB8fFxuICAgICAgICBpc1N0cmluZyh4KSB8fFxuICAgICAgICB0eXBlb2YgeCA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgaXNBcnJheSh4KSB8fFxuICAgICAgICAoaXNPYmplY3QoeCkgJiYgKFxuICAgICAgICAgICAgLy8gUmVhY3RFbGVtZW50XG4gICAgICAgICAgICB4Lmhhc093blByb3BlcnR5KCckJHR5cGVvZicpIHx8XG4gICAgICAgICAgICAvLyBWaXJ0dWFsTm9kZVxuICAgICAgICAgICAgKHguaGFzT3duUHJvcGVydHkoJ3R5cGUnKSAmJiB4Lmhhc093blByb3BlcnR5KCd2ZXJzaW9uJykpIHx8XG4gICAgICAgICAgICAvLyBOb2RlXG4gICAgICAgICAgICAodHlwZW9mIE5vZGUgIT09ICd1bmRlZmluZWQnICYmIHggaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgICApKTtcbn1cblxudmFyIENMQVNTX1NFTEVDVE9SID0gL1xcLihbYS16QS1aMC05XFx1MDA3Ri1cXHVGRkZGXzotXSspL2c7XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybShzdHlsZXMsIGFyZ3MpIHtcbiAgICB2YXIgc3R5bGVOYW1lcywgcGFyc2VNYXRjaDtcblxuICAgIHN0eWxlTmFtZXMgPSBbXTtcblxuICAgIGlmIChpc1N0cmluZyhhcmdzWzBdKSkge1xuICAgICAgICBwYXJzZU1hdGNoID0gYXJnc1swXS5tYXRjaChDTEFTU19TRUxFQ1RPUik7XG5cbiAgICAgICAgaWYgKHBhcnNlTWF0Y2gpIHtcbiAgICAgICAgICAgIHN0eWxlTmFtZXMucHVzaC5hcHBseShzdHlsZU5hbWVzLCBwYXJzZU1hdGNoLm1hcCh0b0NsYXNzKSk7XG4gICAgICAgICAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKENMQVNTX1NFTEVDVE9SLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNPYmplY3QoYXJnc1sxXSkgJiYgYXJnc1sxXS5zdHlsZU5hbWUpIHtcbiAgICAgICAgc3R5bGVOYW1lcy5wdXNoLmFwcGx5KHN0eWxlTmFtZXMsIGFyZ3NbMV0uc3R5bGVOYW1lLnNwbGl0KCcgJykpO1xuICAgICAgICBkZWxldGUgYXJnc1sxXS5zdHlsZU5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlTmFtZXMubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYgKGlzTm90UHJvcHMoYXJnc1sxXSkpIHtcbiAgICAgICAgICAgIGlmIChhcmdzWzFdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJnc1syXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3Muc3BsaWNlKDEsIDAsIHt9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdzWzFdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcmdzLnNwbGljZSgxLCAwLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhcmdzWzFdLmNsYXNzTmFtZSA9IHN0eWxlTmFtZXMucmVkdWNlKGZ1bmN0aW9uIChjbGFzc05hbWUsIHN0eWxlTmFtZSkge1xuICAgICAgICAgICAgaWYgKCFzdHlsZXNbc3R5bGVOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgc3R5bGVOYW1lICsgJ1wiIGRvZXNuXFwndCBleGlzdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGFzc05hbWUgKz0gKGNsYXNzTmFtZS5sZW5ndGggPyAnICcgOiAnJykgKyBzdHlsZXNbc3R5bGVOYW1lXTtcblxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZTtcbiAgICAgICAgfSwgYXJnc1sxXS5jbGFzc05hbWUgfHwgJycpO1xuXG4gICAgfVxuXG4gICAgd2hpbGUgKGFyZ3MubGVuZ3RoICYmIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFyZ3MucG9wKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3M7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmb3JtO1xuIiwidmFyIGF0dHJUb1Byb3AgPSByZXF1aXJlKCdoeXBlcnNjcmlwdC1hdHRyaWJ1dGUtdG8tcHJvcGVydHknKVxuXG52YXIgVkFSID0gMCwgVEVYVCA9IDEsIE9QRU4gPSAyLCBDTE9TRSA9IDMsIEFUVFIgPSA0XG52YXIgQVRUUl9LRVkgPSA1LCBBVFRSX0tFWV9XID0gNlxudmFyIEFUVFJfVkFMVUVfVyA9IDcsIEFUVFJfVkFMVUUgPSA4XG52YXIgQVRUUl9WQUxVRV9TUSA9IDksIEFUVFJfVkFMVUVfRFEgPSAxMFxudmFyIEFUVFJfRVEgPSAxMSwgQVRUUl9CUkVBSyA9IDEyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGgsIG9wdHMpIHtcbiAgaCA9IGF0dHJUb1Byb3AoaClcbiAgaWYgKCFvcHRzKSBvcHRzID0ge31cbiAgdmFyIGNvbmNhdCA9IG9wdHMuY29uY2F0IHx8IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIFN0cmluZyhhKSArIFN0cmluZyhiKVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmdzKSB7XG4gICAgdmFyIHN0YXRlID0gVEVYVCwgcmVnID0gJydcbiAgICB2YXIgYXJnbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgIHZhciBwYXJ0cyA9IFtdXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpIDwgYXJnbGVuIC0gMSkge1xuICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2krMV1cbiAgICAgICAgdmFyIHAgPSBwYXJzZShzdHJpbmdzW2ldKVxuICAgICAgICB2YXIgeHN0YXRlID0gc3RhdGVcbiAgICAgICAgaWYgKHhzdGF0ZSA9PT0gQVRUUl9WQUxVRV9EUSkgeHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRKSB4c3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgIGlmICh4c3RhdGUgPT09IEFUVFJfVkFMVUVfVykgeHN0YXRlID0gQVRUUl9WQUxVRVxuICAgICAgICBpZiAoeHN0YXRlID09PSBBVFRSKSB4c3RhdGUgPSBBVFRSX0tFWVxuICAgICAgICBwLnB1c2goWyBWQVIsIHhzdGF0ZSwgYXJnIF0pXG4gICAgICAgIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHApXG4gICAgICB9IGVsc2UgcGFydHMucHVzaC5hcHBseShwYXJ0cywgcGFyc2Uoc3RyaW5nc1tpXSkpXG4gICAgfVxuXG4gICAgdmFyIHRyZWUgPSBbbnVsbCx7fSxbXV1cbiAgICB2YXIgc3RhY2sgPSBbW3RyZWUsLTFdXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjdXIgPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMF1cbiAgICAgIHZhciBwID0gcGFydHNbaV0sIHMgPSBwWzBdXG4gICAgICBpZiAocyA9PT0gT1BFTiAmJiAvXlxcLy8udGVzdChwWzFdKSkge1xuICAgICAgICB2YXIgaXggPSBzdGFja1tzdGFjay5sZW5ndGgtMV1bMV1cbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aC0xXVswXVsyXVtpeF0gPSBoKFxuICAgICAgICAgICAgY3VyWzBdLCBjdXJbMV0sIGN1clsyXS5sZW5ndGggPyBjdXJbMl0gOiB1bmRlZmluZWRcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gT1BFTikge1xuICAgICAgICB2YXIgYyA9IFtwWzFdLHt9LFtdXVxuICAgICAgICBjdXJbMl0ucHVzaChjKVxuICAgICAgICBzdGFjay5wdXNoKFtjLGN1clsyXS5sZW5ndGgtMV0pXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfS0VZIHx8IChzID09PSBWQVIgJiYgcFsxXSA9PT0gQVRUUl9LRVkpKSB7XG4gICAgICAgIHZhciBrZXkgPSAnJ1xuICAgICAgICB2YXIgY29weUtleVxuICAgICAgICBmb3IgKDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAga2V5ID0gY29uY2F0KGtleSwgcGFydHNbaV1bMV0pXG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJ0c1tpXVswXSA9PT0gVkFSICYmIHBhcnRzW2ldWzFdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJ0c1tpXVsyXSA9PT0gJ29iamVjdCcgJiYgIWtleSkge1xuICAgICAgICAgICAgICBmb3IgKGNvcHlLZXkgaW4gcGFydHNbaV1bMl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydHNbaV1bMl0uaGFzT3duUHJvcGVydHkoY29weUtleSkgJiYgIWN1clsxXVtjb3B5S2V5XSkge1xuICAgICAgICAgICAgICAgICAgY3VyWzFdW2NvcHlLZXldID0gcGFydHNbaV1bMl1bY29weUtleV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGtleSA9IGNvbmNhdChrZXksIHBhcnRzW2ldWzJdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBicmVha1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1tpXVswXSA9PT0gQVRUUl9FUSkgaSsrXG4gICAgICAgIHZhciBqID0gaVxuICAgICAgICBmb3IgKDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnRzW2ldWzBdID09PSBBVFRSX1ZBTFVFIHx8IHBhcnRzW2ldWzBdID09PSBBVFRSX0tFWSkge1xuICAgICAgICAgICAgaWYgKCFjdXJbMV1ba2V5XSkgY3VyWzFdW2tleV0gPSBzdHJmbihwYXJ0c1tpXVsxXSlcbiAgICAgICAgICAgIGVsc2UgY3VyWzFdW2tleV0gPSBjb25jYXQoY3VyWzFdW2tleV0sIHBhcnRzW2ldWzFdKVxuICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV1bMF0gPT09IFZBUlxuICAgICAgICAgICYmIChwYXJ0c1tpXVsxXSA9PT0gQVRUUl9WQUxVRSB8fCBwYXJ0c1tpXVsxXSA9PT0gQVRUUl9LRVkpKSB7XG4gICAgICAgICAgICBpZiAoIWN1clsxXVtrZXldKSBjdXJbMV1ba2V5XSA9IHN0cmZuKHBhcnRzW2ldWzJdKVxuICAgICAgICAgICAgZWxzZSBjdXJbMV1ba2V5XSA9IGNvbmNhdChjdXJbMV1ba2V5XSwgcGFydHNbaV1bMl0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrZXkubGVuZ3RoICYmICFjdXJbMV1ba2V5XSAmJiBpID09PSBqXG4gICAgICAgICAgICAmJiAocGFydHNbaV1bMF0gPT09IENMT1NFIHx8IHBhcnRzW2ldWzBdID09PSBBVFRSX0JSRUFLKSkge1xuICAgICAgICAgICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbmZyYXN0cnVjdHVyZS5odG1sI2Jvb2xlYW4tYXR0cmlidXRlc1xuICAgICAgICAgICAgICAvLyBlbXB0eSBzdHJpbmcgaXMgZmFsc3ksIG5vdCB3ZWxsIGJlaGF2ZWQgdmFsdWUgaW4gYnJvd3NlclxuICAgICAgICAgICAgICBjdXJbMV1ba2V5XSA9IGtleS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBBVFRSX0tFWSkge1xuICAgICAgICBjdXJbMV1bcFsxXV0gPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IFZBUiAmJiBwWzFdID09PSBBVFRSX0tFWSkge1xuICAgICAgICBjdXJbMV1bcFsyXV0gPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IENMT1NFKSB7XG4gICAgICAgIGlmIChzZWxmQ2xvc2luZyhjdXJbMF0pICYmIHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBpeCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXVsxXVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoLTFdWzBdWzJdW2l4XSA9IGgoXG4gICAgICAgICAgICBjdXJbMF0sIGN1clsxXSwgY3VyWzJdLmxlbmd0aCA/IGN1clsyXSA6IHVuZGVmaW5lZFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBWQVIgJiYgcFsxXSA9PT0gVEVYVCkge1xuICAgICAgICBpZiAocFsyXSA9PT0gdW5kZWZpbmVkIHx8IHBbMl0gPT09IG51bGwpIHBbMl0gPSAnJ1xuICAgICAgICBlbHNlIGlmICghcFsyXSkgcFsyXSA9IGNvbmNhdCgnJywgcFsyXSlcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocFsyXVswXSkpIHtcbiAgICAgICAgICBjdXJbMl0ucHVzaC5hcHBseShjdXJbMl0sIHBbMl0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyWzJdLnB1c2gocFsyXSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzID09PSBURVhUKSB7XG4gICAgICAgIGN1clsyXS5wdXNoKHBbMV0pXG4gICAgICB9IGVsc2UgaWYgKHMgPT09IEFUVFJfRVEgfHwgcyA9PT0gQVRUUl9CUkVBSykge1xuICAgICAgICAvLyBuby1vcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmhhbmRsZWQ6ICcgKyBzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0cmVlWzJdLmxlbmd0aCA+IDEgJiYgL15cXHMqJC8udGVzdCh0cmVlWzJdWzBdKSkge1xuICAgICAgdHJlZVsyXS5zaGlmdCgpXG4gICAgfVxuXG4gICAgaWYgKHRyZWVbMl0ubGVuZ3RoID4gMlxuICAgIHx8ICh0cmVlWzJdLmxlbmd0aCA9PT0gMiAmJiAvXFxTLy50ZXN0KHRyZWVbMl1bMV0pKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnbXVsdGlwbGUgcm9vdCBlbGVtZW50cyBtdXN0IGJlIHdyYXBwZWQgaW4gYW4gZW5jbG9zaW5nIHRhZydcbiAgICAgIClcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodHJlZVsyXVswXSkgJiYgdHlwZW9mIHRyZWVbMl1bMF1bMF0gPT09ICdzdHJpbmcnXG4gICAgJiYgQXJyYXkuaXNBcnJheSh0cmVlWzJdWzBdWzJdKSkge1xuICAgICAgdHJlZVsyXVswXSA9IGgodHJlZVsyXVswXVswXSwgdHJlZVsyXVswXVsxXSwgdHJlZVsyXVswXVsyXSlcbiAgICB9XG4gICAgcmV0dXJuIHRyZWVbMl1bMF1cblxuICAgIGZ1bmN0aW9uIHBhcnNlIChzdHIpIHtcbiAgICAgIHZhciByZXMgPSBbXVxuICAgICAgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1cpIHN0YXRlID0gQVRUUlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGkpXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gVEVYVCAmJiBjID09PSAnPCcpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkgcmVzLnB1c2goW1RFWFQsIHJlZ10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IE9QRU5cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicgJiYgIXF1b3Qoc3RhdGUpKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBPUEVOKSB7XG4gICAgICAgICAgICByZXMucHVzaChbT1BFTixyZWddKVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfS0VZKSB7XG4gICAgICAgICAgICByZXMucHVzaChbQVRUUl9LRVkscmVnXSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcy5wdXNoKFtDTE9TRV0pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IFRFWFRcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gVEVYVCkge1xuICAgICAgICAgIHJlZyArPSBjXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IE9QRU4gJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtPUEVOLCByZWddKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IE9QRU4pIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSICYmIC9bXFx3LV0vLnRlc3QoYykpIHtcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZXG4gICAgICAgICAgcmVnID0gY1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSICYmIC9cXHMvLnRlc3QoYykpIHtcbiAgICAgICAgICBpZiAocmVnLmxlbmd0aCkgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfQlJFQUtdKVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX0tFWSAmJiAvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJfS0VZX1dcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkgJiYgYyA9PT0gJz0nKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10sW0FUVFJfRVFdKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX1dcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9IGVsc2UgaWYgKChzdGF0ZSA9PT0gQVRUUl9LRVlfVyB8fCBzdGF0ZSA9PT0gQVRUUikgJiYgYyA9PT0gJz0nKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfRVFdKVxuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9XXG4gICAgICAgIH0gZWxzZSBpZiAoKHN0YXRlID09PSBBVFRSX0tFWV9XIHx8IHN0YXRlID09PSBBVFRSKSAmJiAhL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICBpZiAoL1tcXHctXS8udGVzdChjKSkge1xuICAgICAgICAgICAgcmVnICs9IGNcbiAgICAgICAgICAgIHN0YXRlID0gQVRUUl9LRVlcbiAgICAgICAgICB9IGVsc2Ugc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiBjID09PSAnXCInKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFX0RRXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfVyAmJiBjID09PSBcIidcIikge1xuICAgICAgICAgIHN0YXRlID0gQVRUUl9WQUxVRV9TUVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRICYmIGMgPT09ICdcIicpIHtcbiAgICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddLFtBVFRSX0JSRUFLXSlcbiAgICAgICAgICByZWcgPSAnJ1xuICAgICAgICAgIHN0YXRlID0gQVRUUlxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX1NRICYmIGMgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSxbQVRUUl9CUkVBS10pXG4gICAgICAgICAgcmVnID0gJydcbiAgICAgICAgICBzdGF0ZSA9IEFUVFJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRV9XICYmICEvXFxzLy50ZXN0KGMpKSB7XG4gICAgICAgICAgc3RhdGUgPSBBVFRSX1ZBTFVFXG4gICAgICAgICAgaS0tXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgJiYgL1xccy8udGVzdChjKSkge1xuICAgICAgICAgIHJlcy5wdXNoKFtBVFRSX0JSRUFLXSxbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICAgIHJlZyA9ICcnXG4gICAgICAgICAgc3RhdGUgPSBBVFRSXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUUgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfU1FcbiAgICAgICAgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfRFEpIHtcbiAgICAgICAgICByZWcgKz0gY1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUgPT09IFRFWFQgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbVEVYVCxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9WQUxVRSAmJiByZWcubGVuZ3RoKSB7XG4gICAgICAgIHJlcy5wdXNoKFtBVFRSX1ZBTFVFLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBBVFRSX1ZBTFVFX0RRICYmIHJlZy5sZW5ndGgpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfVkFMVUUscmVnXSlcbiAgICAgICAgcmVnID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgJiYgcmVnLmxlbmd0aCkge1xuICAgICAgICByZXMucHVzaChbQVRUUl9WQUxVRSxyZWddKVxuICAgICAgICByZWcgPSAnJ1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gQVRUUl9LRVkpIHtcbiAgICAgICAgcmVzLnB1c2goW0FUVFJfS0VZLHJlZ10pXG4gICAgICAgIHJlZyA9ICcnXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyZm4gKHgpIHtcbiAgICBpZiAodHlwZW9mIHggPT09ICdmdW5jdGlvbicpIHJldHVybiB4XG4gICAgZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSByZXR1cm4geFxuICAgIGVsc2UgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSByZXR1cm4geFxuICAgIGVsc2UgcmV0dXJuIGNvbmNhdCgnJywgeClcbiAgfVxufVxuXG5mdW5jdGlvbiBxdW90IChzdGF0ZSkge1xuICByZXR1cm4gc3RhdGUgPT09IEFUVFJfVkFMVUVfU1EgfHwgc3RhdGUgPT09IEFUVFJfVkFMVUVfRFFcbn1cblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbmZ1bmN0aW9uIGhhcyAob2JqLCBrZXkpIHsgcmV0dXJuIGhhc093bi5jYWxsKG9iaiwga2V5KSB9XG5cbnZhciBjbG9zZVJFID0gUmVnRXhwKCdeKCcgKyBbXG4gICdhcmVhJywgJ2Jhc2UnLCAnYmFzZWZvbnQnLCAnYmdzb3VuZCcsICdicicsICdjb2wnLCAnY29tbWFuZCcsICdlbWJlZCcsXG4gICdmcmFtZScsICdocicsICdpbWcnLCAnaW5wdXQnLCAnaXNpbmRleCcsICdrZXlnZW4nLCAnbGluaycsICdtZXRhJywgJ3BhcmFtJyxcbiAgJ3NvdXJjZScsICd0cmFjaycsICd3YnInLFxuICAvLyBTVkcgVEFHU1xuICAnYW5pbWF0ZScsICdhbmltYXRlVHJhbnNmb3JtJywgJ2NpcmNsZScsICdjdXJzb3InLCAnZGVzYycsICdlbGxpcHNlJyxcbiAgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJyxcbiAgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLCAnZmVEaXNwbGFjZW1lbnRNYXAnLFxuICAnZmVEaXN0YW50TGlnaHQnLCAnZmVGbG9vZCcsICdmZUZ1bmNBJywgJ2ZlRnVuY0InLCAnZmVGdW5jRycsICdmZUZ1bmNSJyxcbiAgJ2ZlR2F1c3NpYW5CbHVyJywgJ2ZlSW1hZ2UnLCAnZmVNZXJnZScsICdmZU1lcmdlTm9kZScsICdmZU1vcnBob2xvZ3knLFxuICAnZmVPZmZzZXQnLCAnZmVQb2ludExpZ2h0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsICdmZVNwb3RMaWdodCcsICdmZVRpbGUnLFxuICAnZmVUdXJidWxlbmNlJywgJ2ZvbnQtZmFjZS1mb3JtYXQnLCAnZm9udC1mYWNlLW5hbWUnLCAnZm9udC1mYWNlLXVyaScsXG4gICdnbHlwaCcsICdnbHlwaFJlZicsICdoa2VybicsICdpbWFnZScsICdsaW5lJywgJ21pc3NpbmctZ2x5cGgnLCAnbXBhdGgnLFxuICAncGF0aCcsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JlY3QnLCAnc2V0JywgJ3N0b3AnLCAndHJlZicsICd1c2UnLCAndmlldycsXG4gICd2a2Vybidcbl0uam9pbignfCcpICsgJykoPzpbXFwuI11bYS16QS1aMC05XFx1MDA3Ri1cXHVGRkZGXzotXSspKiQnKVxuZnVuY3Rpb24gc2VsZkNsb3NpbmcgKHRhZykgeyByZXR1cm4gY2xvc2VSRS50ZXN0KHRhZykgfVxuIiwibW9kdWxlLmV4cG9ydHMgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5XG5cbnZhciB0cmFuc2Zvcm0gPSB7XG4gICdjbGFzcyc6ICdjbGFzc05hbWUnLFxuICAnZm9yJzogJ2h0bWxGb3InLFxuICAnaHR0cC1lcXVpdic6ICdodHRwRXF1aXYnXG59XG5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHkgKGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YWdOYW1lLCBhdHRycywgY2hpbGRyZW4pIHtcbiAgICBmb3IgKHZhciBhdHRyIGluIGF0dHJzKSB7XG4gICAgICBpZiAoYXR0ciBpbiB0cmFuc2Zvcm0pIHtcbiAgICAgICAgYXR0cnNbdHJhbnNmb3JtW2F0dHJdXSA9IGF0dHJzW2F0dHJdXG4gICAgICAgIGRlbGV0ZSBhdHRyc1thdHRyXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaCh0YWdOYW1lLCBhdHRycywgY2hpbGRyZW4pXG4gIH1cbn1cbiIsInZhciBpbnNlcnRlZCA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MsIG9wdGlvbnMpIHtcbiAgICBpZiAoaW5zZXJ0ZWRbY3NzXSkgcmV0dXJuO1xuICAgIGluc2VydGVkW2Nzc10gPSB0cnVlO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuXG4gICAgaWYgKCd0ZXh0Q29udGVudCcgaW4gZWxlbSkge1xuICAgICAgZWxlbS50ZXh0Q29udGVudCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgfVxuICAgIFxuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnByZXBlbmQpIHtcbiAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGVsZW0pO1xuICAgIH1cbn07XG4iLCJ2YXIgT2JzZXJ2ID0gcmVxdWlyZShcIm9ic2VydlwiKVxudmFyIGV4dGVuZCA9IHJlcXVpcmUoXCJ4dGVuZFwiKVxuXG52YXIgYmxhY2tMaXN0ID0ge1xuICAgIFwibGVuZ3RoXCI6IFwiQ2xhc2hlcyB3aXRoIGBGdW5jdGlvbi5wcm90b3R5cGUubGVuZ3RoYC5cXG5cIixcbiAgICBcIm5hbWVcIjogXCJDbGFzaGVzIHdpdGggYEZ1bmN0aW9uLnByb3RvdHlwZS5uYW1lYC5cXG5cIixcbiAgICBcIl9kaWZmXCI6IFwiX2RpZmYgaXMgcmVzZXJ2ZWQga2V5IG9mIG9ic2Vydi1zdHJ1Y3QuXFxuXCIsXG4gICAgXCJfdHlwZVwiOiBcIl90eXBlIGlzIHJlc2VydmVkIGtleSBvZiBvYnNlcnYtc3RydWN0LlxcblwiLFxuICAgIFwiX3ZlcnNpb25cIjogXCJfdmVyc2lvbiBpcyByZXNlcnZlZCBrZXkgb2Ygb2JzZXJ2LXN0cnVjdC5cXG5cIlxufVxudmFyIE5PX1RSQU5TQUNUSU9OID0ge31cblxuZnVuY3Rpb24gc2V0Tm9uRW51bWVyYWJsZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0pXG59XG5cbi8qIE9ic2VydlN0cnVjdCA6PSAoT2JqZWN0PFN0cmluZywgT2JzZXJ2PFQ+PikgPT5cbiAgICBPYmplY3Q8U3RyaW5nLCBPYnNlcnY8VD4+ICZcbiAgICAgICAgT2JzZXJ2PE9iamVjdDxTdHJpbmcsIFQ+ICYge1xuICAgICAgICAgICAgX2RpZmY6IE9iamVjdDxTdHJpbmcsIEFueT5cbiAgICAgICAgfT5cblxuKi9cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2U3RydWN0XG5cbmZ1bmN0aW9uIE9ic2VydlN0cnVjdChzdHJ1Y3QpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHN0cnVjdClcblxuICAgIHZhciBpbml0aWFsU3RhdGUgPSB7fVxuICAgIHZhciBjdXJyZW50VHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuICAgIHZhciBuZXN0ZWRUcmFuc2FjdGlvbiA9IE5PX1RSQU5TQUNUSU9OXG5cbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoYmxhY2tMaXN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbm5vdCBjcmVhdGUgYW4gb2JzZXJ2LXN0cnVjdCBcIiArXG4gICAgICAgICAgICAgICAgXCJ3aXRoIGEga2V5IG5hbWVkICdcIiArIGtleSArIFwiJy5cXG5cIiArXG4gICAgICAgICAgICAgICAgYmxhY2tMaXN0W2tleV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9ic2VydiA9IHN0cnVjdFtrZXldXG4gICAgICAgIGluaXRpYWxTdGF0ZVtrZXldID0gdHlwZW9mIG9ic2VydiA9PT0gXCJmdW5jdGlvblwiID9cbiAgICAgICAgICAgIG9ic2VydigpIDogb2JzZXJ2XG4gICAgfSlcblxuICAgIHZhciBvYnMgPSBPYnNlcnYoaW5pdGlhbFN0YXRlKVxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBvYnNlcnYgPSBzdHJ1Y3Rba2V5XVxuICAgICAgICBvYnNba2V5XSA9IG9ic2VydlxuXG4gICAgICAgIGlmICh0eXBlb2Ygb2JzZXJ2ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIG9ic2VydihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAobmVzdGVkVHJhbnNhY3Rpb24gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IGV4dGVuZChvYnMoKSlcbiAgICAgICAgICAgICAgICBzdGF0ZVtrZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IHt9XG4gICAgICAgICAgICAgICAgZGlmZltrZXldID0gdmFsdWUgJiYgdmFsdWUuX2RpZmYgP1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5fZGlmZiA6IHZhbHVlXG5cbiAgICAgICAgICAgICAgICBzZXROb25FbnVtZXJhYmxlKHN0YXRlLCBcIl9kaWZmXCIsIGRpZmYpXG4gICAgICAgICAgICAgICAgY3VycmVudFRyYW5zYWN0aW9uID0gc3RhdGVcbiAgICAgICAgICAgICAgICBvYnMuc2V0KHN0YXRlKVxuICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFuc2FjdGlvbiA9IE5PX1RSQU5TQUNUSU9OXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcbiAgICB2YXIgX3NldCA9IG9icy5zZXRcbiAgICBvYnMuc2V0ID0gZnVuY3Rpb24gdHJhY2tEaWZmKHZhbHVlKSB7XG4gICAgICAgIGlmIChjdXJyZW50VHJhbnNhY3Rpb24gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3NldCh2YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IGV4dGVuZCh2YWx1ZSlcbiAgICAgICAgc2V0Tm9uRW51bWVyYWJsZShuZXdTdGF0ZSwgXCJfZGlmZlwiLCB2YWx1ZSlcbiAgICAgICAgX3NldChuZXdTdGF0ZSlcbiAgICB9XG5cbiAgICBvYnMoZnVuY3Rpb24gKG5ld1N0YXRlKSB7XG4gICAgICAgIGlmIChjdXJyZW50VHJhbnNhY3Rpb24gPT09IG5ld1N0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICB2YXIgb2JzZXJ2ID0gc3RydWN0W2tleV1cbiAgICAgICAgICAgIHZhciBuZXdPYnNlcnZWYWx1ZSA9IG5ld1N0YXRlW2tleV1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYnNlcnYgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgICAgICAgIG9ic2VydigpICE9PSBuZXdPYnNlcnZWYWx1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbmVzdGVkVHJhbnNhY3Rpb24gPSBuZXdPYnNlcnZWYWx1ZVxuICAgICAgICAgICAgICAgIG9ic2Vydi5zZXQobmV3U3RhdGVba2V5XSlcbiAgICAgICAgICAgICAgICBuZXN0ZWRUcmFuc2FjdGlvbiA9IE5PX1RSQU5TQUNUSU9OXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIG9icy5fdHlwZSA9IFwib2JzZXJ2LXN0cnVjdFwiXG4gICAgb2JzLl92ZXJzaW9uID0gXCI1XCJcblxuICAgIHJldHVybiBvYnNcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCJ2YXIgT2JzZXJ2ID0gcmVxdWlyZSgnb2JzZXJ2JylcbnZhciBleHRlbmQgPSByZXF1aXJlKCd4dGVuZCcpXG5cbnZhciBOT19UUkFOU0FDVElPTiA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2VmFyaGFzaFxuXG5mdW5jdGlvbiBPYnNlcnZWYXJoYXNoIChoYXNoLCBjcmVhdGVWYWx1ZSkge1xuICBjcmVhdGVWYWx1ZSA9IGNyZWF0ZVZhbHVlIHx8IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiB9XG5cbiAgdmFyIGluaXRpYWxTdGF0ZSA9IHt9XG4gIHZhciBjdXJyZW50VHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuICB2YXIgbmVzdGVkVHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuXG4gIHZhciBvYnMgPSBPYnNlcnYoaW5pdGlhbFN0YXRlKVxuICBzZXROb25FbnVtZXJhYmxlKG9icywgJ19yZW1vdmVMaXN0ZW5lcnMnLCB7fSlcblxuICBzZXROb25FbnVtZXJhYmxlKG9icywgJ2dldCcsIGdldC5iaW5kKG9icykpXG4gIHNldE5vbkVudW1lcmFibGUob2JzLCAncHV0JywgcHV0LmJpbmQob2JzKSlcbiAgc2V0Tm9uRW51bWVyYWJsZShvYnMsICdkZWxldGUnLCBkZWwuYmluZChvYnMpKVxuXG4gIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgb2JzW2tleV0gPSBpc0ZuKGhhc2hba2V5XSkgPyBoYXNoW2tleV0gOiBjcmVhdGVWYWx1ZShoYXNoW2tleV0sIGtleSlcblxuICAgIGlmIChpc0ZuKG9ic1trZXldKSkge1xuICAgICAgb2JzLl9yZW1vdmVMaXN0ZW5lcnNba2V5XSA9IG9ic1trZXldKHdhdGNoKG9icywga2V5KSlcbiAgICB9XG4gIH1cblxuICB2YXIgX3NldCA9IG9icy5zZXRcblxuICBvYnMuc2V0ID0gZnVuY3Rpb24gdHJhY2tEaWZmICh2YWx1ZSkge1xuICAgIGlmIChjdXJyZW50VHJhbnNhY3Rpb24gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gX3NldCh2YWx1ZSlcbiAgICB9XG5cbiAgICB2YXIgbmV3U3RhdGUgPSBleHRlbmQodmFsdWUpXG4gICAgc2V0Tm9uRW51bWVyYWJsZShuZXdTdGF0ZSwgJ19kaWZmJywgdmFsdWUpXG5cbiAgICBfc2V0KG5ld1N0YXRlKVxuICB9XG4gIHNldE5vbkVudW1lcmFibGUob2JzLCAnc2V0Jywgb2JzLnNldClcblxuICB2YXIgbmV3U3RhdGUgPSB7fVxuICBmb3IgKGtleSBpbiBoYXNoKSB7XG4gICAgdmFyIG9ic2VydiA9IG9ic1trZXldXG4gICAgY2hlY2tLZXkoa2V5KVxuICAgIG5ld1N0YXRlW2tleV0gPSBpc0ZuKG9ic2VydikgPyBvYnNlcnYoKSA6IG9ic2VydlxuICB9XG4gIG9icy5zZXQobmV3U3RhdGUpXG5cbiAgb2JzKGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgIGlmIChjdXJyZW50VHJhbnNhY3Rpb24gPT09IG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgdmFyIG9ic2VydiA9IGhhc2hba2V5XVxuICAgICAgdmFyIG5ld09ic2VydlZhbHVlID0gbmV3U3RhdGVba2V5XVxuXG4gICAgICBpZiAoaXNGbihvYnNlcnYpICYmIG9ic2VydigpICE9PSBuZXdTdGF0ZVtrZXldKSB7XG4gICAgICAgIG5lc3RlZFRyYW5zYWN0aW9uID0gbmV3T2JzZXJ2VmFsdWVcbiAgICAgICAgb2JzZXJ2LnNldChuZXdTdGF0ZVtrZXldKVxuICAgICAgICBuZXN0ZWRUcmFuc2FjdGlvbiA9IE5PX1RSQU5TQUNUSU9OXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGZ1bmN0aW9uIHB1dCAoa2V5LCB2YWwpIHtcbiAgICBjaGVja0tleShrZXkpXG5cbiAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IHZhcmhhc2gucHV0KGtleSwgdW5kZWZpbmVkKS4nKVxuICAgIH1cblxuICAgIHZhciBvYnNlcnYgPSBpc0ZuKHZhbCkgPyB2YWwgOiBjcmVhdGVWYWx1ZSh2YWwsIGtleSlcbiAgICB2YXIgc3RhdGUgPSBleHRlbmQodGhpcygpKVxuXG4gICAgc3RhdGVba2V5XSA9IGlzRm4ob2JzZXJ2KSA/IG9ic2VydigpIDogb2JzZXJ2XG5cbiAgICBpZiAoaXNGbih0aGlzLl9yZW1vdmVMaXN0ZW5lcnNba2V5XSkpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc1trZXldKClcbiAgICB9XG5cbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnNba2V5XSA9IGlzRm4ob2JzZXJ2KVxuICAgICAgPyBvYnNlcnYod2F0Y2godGhpcywga2V5KSkgOiBudWxsXG5cbiAgICBzZXROb25FbnVtZXJhYmxlKHN0YXRlLCAnX2RpZmYnLCBkaWZmKGtleSwgc3RhdGVba2V5XSkpXG5cbiAgICB0aGlzW2tleV0gPSBvYnNlcnZcblxuICAgIGN1cnJlbnRUcmFuc2FjdGlvbiA9IHN0YXRlXG4gICAgX3NldChzdGF0ZSlcbiAgICBjdXJyZW50VHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbCAoa2V5KSB7XG4gICAgdmFyIHN0YXRlID0gZXh0ZW5kKHRoaXMoKSlcbiAgICBpZiAoaXNGbih0aGlzLl9yZW1vdmVMaXN0ZW5lcnNba2V5XSkpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc1trZXldKClcbiAgICB9XG5cbiAgICBkZWxldGUgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzW2tleV1cbiAgICBkZWxldGUgc3RhdGVba2V5XVxuICAgIGRlbGV0ZSB0aGlzW2tleV1cblxuICAgIHNldE5vbkVudW1lcmFibGUoc3RhdGUsICdfZGlmZicsIGRpZmYoa2V5LCB1bmRlZmluZWQpKVxuICAgIF9zZXQoc3RhdGUpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcmV0dXJuIG9ic1xuXG4gIC8vIHByb2Nlc3NpbmdcbiAgZnVuY3Rpb24gd2F0Y2ggKG9icywga2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKG5lc3RlZFRyYW5zYWN0aW9uID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlID0gZXh0ZW5kKG9icygpKVxuICAgICAgc3RhdGVba2V5XSA9IHZhbHVlXG5cbiAgICAgIHNldE5vbkVudW1lcmFibGUoc3RhdGUsICdfZGlmZicsIGRpZmYoa2V5LCB2YWx1ZSkpXG5cbiAgICAgIGN1cnJlbnRUcmFuc2FjdGlvbiA9IHN0YXRlXG4gICAgICBvYnMuc2V0KHN0YXRlKVxuICAgICAgY3VycmVudFRyYW5zYWN0aW9uID0gTk9fVFJBTlNBQ1RJT05cbiAgICB9XG4gIH1cbn1cblxuLy8gYWNjZXNzIGFuZCBtdXRhdGVcbmZ1bmN0aW9uIGdldCAoa2V5KSB7XG4gIHJldHVybiB0aGlzW2tleV1cbn1cblxuZnVuY3Rpb24gZGlmZiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqID0ge31cbiAgb2JqW2tleV0gPSB2YWx1ZSAmJiB2YWx1ZS5fZGlmZiA/IHZhbHVlLl9kaWZmIDogdmFsdWVcbiAgcmV0dXJuIG9ialxufVxuXG5mdW5jdGlvbiBpc0ZuIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbidcbn1cblxuZnVuY3Rpb24gc2V0Tm9uRW51bWVyYWJsZSAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSlcbn1cblxuLy8gZXJyb3JzXG52YXIgYmxhY2tsaXN0ID0ge1xuICBuYW1lOiAnQ2xhc2hlcyB3aXRoIGBGdW5jdGlvbi5wcm90b3R5cGUubmFtZWAuJyxcbiAgZ2V0OiAnZ2V0IGlzIGEgcmVzZXJ2ZWQga2V5IG9mIG9ic2Vydi12YXJoYXNoIG1ldGhvZCcsXG4gIHB1dDogJ3B1dCBpcyBhIHJlc2VydmVkIGtleSBvZiBvYnNlcnYtdmFyaGFzaCBtZXRob2QnLFxuICAnZGVsZXRlJzogJ2RlbGV0ZSBpcyBhIHJlc2VydmVkIGtleSBvZiBvYnNlcnYtdmFyaGFzaCBtZXRob2QnLFxuICBfZGlmZjogJ19kaWZmIGlzIGEgcmVzZXJ2ZWQga2V5IG9mIG9ic2Vydi12YXJoYXNoIG1ldGhvZCcsXG4gIF9yZW1vdmVMaXN0ZW5lcnM6ICdfcmVtb3ZlTGlzdGVuZXJzIGlzIGEgcmVzZXJ2ZWQga2V5IG9mIG9ic2Vydi12YXJoYXNoJ1xufVxuXG5mdW5jdGlvbiBjaGVja0tleSAoa2V5KSB7XG4gIGlmICghYmxhY2tsaXN0W2tleV0pIHJldHVyblxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ2Nhbm5vdCBjcmVhdGUgYW4gb2JzZXJ2LXZhcmhhc2ggd2l0aCBrZXkgYCcgKyBrZXkgKyAnYC4gJyArIGJsYWNrbGlzdFtrZXldXG4gIClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2YWJsZVxuXG5mdW5jdGlvbiBPYnNlcnZhYmxlKHZhbHVlKSB7XG4gICAgdmFyIGxpc3RlbmVycyA9IFtdXG4gICAgdmFsdWUgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHZhbHVlXG5cbiAgICBvYnNlcnZhYmxlLnNldCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZhbHVlID0gdlxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgICAgICAgICAgZih2KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBvYnNlcnZhYmxlXG5cbiAgICBmdW5jdGlvbiBvYnNlcnZhYmxlKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UobGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpLCAxKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JylcblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaFxuXG4vLyBnZXQgdXJsIHBhdGggc2VjdGlvbiBmcm9tIGEgdXJsXG4vLyBzdHJpcCBxdWVyeXN0cmluZ3MgLyBoYXNoZXNcbi8vIHN0cmlwIHByb3RvY29sXG4vLyBzdHJpcCBob3N0bmFtZSBhbmQgcG9ydCAoYm90aCBpcCBhbmQgcm91dGUpXG4vLyBzdHIgLT4gc3RyXG5mdW5jdGlvbiBtYXRjaCAocm91dGUpIHtcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiByb3V0ZSwgJ3N0cmluZycpXG5cbiAgcmV0dXJuIHJvdXRlLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bXFw/fCNdLiokLywgJycpXG4gICAgLnJlcGxhY2UoL14oPzpodHRwcz9cXDopXFwvXFwvLywgJycpXG4gICAgLnJlcGxhY2UoL14oPzpbXFx3Kyg/Oi1cXHcrKSsuXSkrKD86W1xcOjAtOV17NCw1fSk/LywgJycpXG4gICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcbnZhciBpc1NvZnRTZXRIb29rID0gcmVxdWlyZSgnLi9pc1NvZnRTZXRIb29rJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHlQcm9wZXJ0aWVzO1xuXG5mdW5jdGlvbiBhcHBseVByb3BlcnRpZXMobm9kZSwgcHJvcHMsIHByZXZpb3VzKSB7XG4gIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXVxuXG4gICAgaWYgKHByb3BWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZW1vdmVQcm9wZXJ0eShub2RlLCBwcm9wTmFtZSwgcHJldmlvdXMpO1xuICAgIH0gZWxzZSBpZiAoaXNTb2Z0U2V0SG9vayhwcm9wVmFsdWUpKSB7XG4gICAgICByZW1vdmVQcm9wZXJ0eShub2RlLCBwcm9wTmFtZSwgcHJvcFZhbHVlLCBwcmV2aW91cylcbiAgICAgIG5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlLnZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc09iamVjdChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHBhdGNoT2JqZWN0KG5vZGUsIHByb3BzLCBwcmV2aW91cywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVQcm9wZXJ0eShub2RlLCBwcm9wTmFtZSwgcHJldmlvdXMpIHtcbiAgaWYgKCFwcmV2aW91cykge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNbcHJvcE5hbWVdXG5cbiAgaWYgKHByb3BOYW1lID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgIGZvciAodmFyIGF0dHJOYW1lIGluIHByZXZpb3VzVmFsdWUpIHtcbiAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKVxuICAgIH1cbiAgfSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgZm9yICh2YXIgaSBpbiBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICBub2RlLnN0eWxlW2ldID0gXCJcIlxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJldmlvdXNWYWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIG5vZGVbcHJvcE5hbWVdID0gXCJcIlxuICB9IGVsc2Uge1xuICAgIG5vZGVbcHJvcE5hbWVdID0gbnVsbFxuICB9XG59XG5cbmZ1bmN0aW9uIHBhdGNoT2JqZWN0KG5vZGUsIHByb3BzLCBwcmV2aW91cywgcHJvcE5hbWUsIHByb3BWYWx1ZSkge1xuICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzID8gcHJldmlvdXNbcHJvcE5hbWVdIDogdW5kZWZpbmVkXG5cbiAgLy8gU2V0IGF0dHJpYnV0ZXNcbiAgaWYgKHByb3BOYW1lID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgIGZvciAodmFyIGF0dHJOYW1lIGluIHByb3BWYWx1ZSkge1xuICAgICAgdmFyIGF0dHJWYWx1ZSA9IHByb3BWYWx1ZVthdHRyTmFtZV1cblxuICAgICAgaWYgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChwcmV2aW91c1ZhbHVlICYmIGlzT2JqZWN0KHByZXZpb3VzVmFsdWUpICYmXG4gICAgZ2V0UHJvdG90eXBlKHByZXZpb3VzVmFsdWUpICE9PSBnZXRQcm90b3R5cGUocHJvcFZhbHVlKSkge1xuICAgIG5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoIWlzT2JqZWN0KG5vZGVbcHJvcE5hbWVdKSkge1xuICAgIG5vZGVbcHJvcE5hbWVdID0ge31cbiAgfVxuXG4gIHZhciByZXBsYWNlciA9IHByb3BOYW1lID09PSBcInN0eWxlXCIgPyBcIlwiIDogdW5kZWZpbmVkXG5cbiAgZm9yICh2YXIgayBpbiBwcm9wVmFsdWUpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9wVmFsdWVba11cbiAgICBub2RlW3Byb3BOYW1lXVtrXSA9ICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IHJlcGxhY2VyIDogdmFsdWVcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQcm90b3R5cGUodmFsdWUpIHtcbiAgLy8gZ2V0UHJvdG90eXBlT2Ygc2hpbSBmb3Igb2xkZXIgYnJvd3NlcnNcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbHVlLl9fcHJvdG9fXyB8fCB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH1cbn1cbiIsInZhciBhcHBseVByb3BlcnRpZXMgPSByZXF1aXJlKFwiLi9hcHBseVByb3BlcnRpZXNcIilcbnZhciBpc1ZUZXh0ID0gcmVxdWlyZSgnLi9pc1ZUZXh0Jyk7XG52YXIgaXNWTm9kZSA9IHJlcXVpcmUoJy4vaXNWTm9kZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUVsZW1lbnQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodm5vZGUpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50O1xuXG4gIGlmIChpc1ZUZXh0KHZub2RlKSkge1xuICAgIHJldHVybiBkb2MuY3JlYXRlVGV4dE5vZGUodm5vZGUueCkgLy8gJ3gnIG1lYW5zICd0ZXh0J1xuICB9IGVsc2UgaWYgKCFpc1ZOb2RlKHZub2RlKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICB2YXIgbm9kZSA9ICghdm5vZGUubikgPyAvLyAnbicgPT09ICduYW1lc3BhY2UnXG4gICAgZG9jLmNyZWF0ZUVsZW1lbnQodm5vZGUudG4pIDogLy8gJ3RuJyA9PT0gJ3RhZ05hbWUnXG4gICAgZG9jLmNyZWF0ZUVsZW1lbnROUyh2bm9kZS5uLCB2bm9kZS50bilcblxuICB2YXIgcHJvcHMgPSB2bm9kZS5wIC8vICdwJyA9PT0gJ3Byb3BlcnRpZXMnXG4gIGFwcGx5UHJvcGVydGllcyhub2RlLCBwcm9wcylcblxuICB2YXIgY2hpbGRyZW4gPSB2bm9kZS5jIC8vICdjJyA9PT0gJ2NoaWxkcmVuJ1xuXG4gIGlmIChjaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZE5vZGUgPSBjcmVhdGVFbGVtZW50KGNoaWxkcmVuW2ldKVxuICAgICAgaWYgKGNoaWxkTm9kZSkge1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKGNoaWxkTm9kZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZVxufVxuIiwiLy8gTWFwcyBhIHZpcnR1YWwgRE9NIHRyZWUgb250byBhIHJlYWwgRE9NIHRyZWUgaW4gYW4gZWZmaWNpZW50IG1hbm5lci5cbi8vIFdlIGRvbid0IHdhbnQgdG8gcmVhZCBhbGwgb2YgdGhlIERPTSBub2RlcyBpbiB0aGUgdHJlZSBzbyB3ZSB1c2Vcbi8vIHRoZSBpbi1vcmRlciB0cmVlIGluZGV4aW5nIHRvIGVsaW1pbmF0ZSByZWN1cnNpb24gZG93biBjZXJ0YWluIGJyYW5jaGVzLlxuLy8gV2Ugb25seSByZWN1cnNlIGludG8gYSBET00gbm9kZSBpZiB3ZSBrbm93IHRoYXQgaXQgY29udGFpbnMgYSBjaGlsZCBvZlxuLy8gaW50ZXJlc3QuXG5cbnZhciBub0NoaWxkID0ge31cblxubW9kdWxlLmV4cG9ydHMgPSBkb21JbmRleFxuXG5mdW5jdGlvbiBkb21JbmRleChyb290Tm9kZSwgdHJlZSwgaW5kaWNlcywgbm9kZXMpIHtcbiAgaWYgKCFpbmRpY2VzIHx8IGluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHt9XG4gIH0gZWxzZSB7XG4gICAgaW5kaWNlcy5zb3J0KGFzY2VuZGluZylcbiAgICByZXR1cm4gcmVjdXJzZShyb290Tm9kZSwgdHJlZSwgaW5kaWNlcywgbm9kZXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVjdXJzZShyb290Tm9kZSwgdHJlZSwgaW5kaWNlcywgbm9kZXMsIHJvb3RJbmRleCkge1xuICBub2RlcyA9IG5vZGVzIHx8IHt9XG5cblxuICBpZiAocm9vdE5vZGUpIHtcbiAgICBpZiAoaW5kZXhJblJhbmdlKGluZGljZXMsIHJvb3RJbmRleCwgcm9vdEluZGV4KSkge1xuICAgICAgbm9kZXNbcm9vdEluZGV4XSA9IHJvb3ROb2RlXG4gICAgfVxuXG4gICAgdmFyIHRyZWVDaGlsZHJlbiA9IHRyZWVbMF07XG5cbiAgICBpZiAodHJlZUNoaWxkcmVuKSB7XG5cbiAgICAgIHZhciBjaGlsZE5vZGVzID0gcm9vdE5vZGUuY2hpbGROb2Rlc1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWVDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICByb290SW5kZXggKz0gMVxuXG4gICAgICAgIHZhciB2Q2hpbGQgPSB0cmVlQ2hpbGRyZW5baV0gfHwgbm9DaGlsZFxuICAgICAgICB2YXIgbmV4dEluZGV4ID0gcm9vdEluZGV4ICsgKHZDaGlsZFsxXSB8fCAwKVxuXG4gICAgICAgIC8vIHNraXAgcmVjdXJzaW9uIGRvd24gdGhlIHRyZWUgaWYgdGhlcmUgYXJlIG5vIG5vZGVzIGRvd24gaGVyZVxuICAgICAgICBpZiAoaW5kZXhJblJhbmdlKGluZGljZXMsIHJvb3RJbmRleCwgbmV4dEluZGV4KSkge1xuICAgICAgICAgIHJlY3Vyc2UoY2hpbGROb2Rlc1tpXSwgdkNoaWxkLCBpbmRpY2VzLCBub2Rlcywgcm9vdEluZGV4KVxuICAgICAgICB9XG5cbiAgICAgICAgcm9vdEluZGV4ID0gbmV4dEluZGV4XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGVzXG59XG5cbi8vIEJpbmFyeSBzZWFyY2ggZm9yIGFuIGluZGV4IGluIHRoZSBpbnRlcnZhbCBbbGVmdCwgcmlnaHRdXG5mdW5jdGlvbiBpbmRleEluUmFuZ2UoaW5kaWNlcywgbGVmdCwgcmlnaHQpIHtcbiAgaWYgKGluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB2YXIgbWluSW5kZXggPSAwXG4gIHZhciBtYXhJbmRleCA9IGluZGljZXMubGVuZ3RoIC0gMVxuICB2YXIgY3VycmVudEluZGV4XG4gIHZhciBjdXJyZW50SXRlbVxuXG4gIHdoaWxlIChtaW5JbmRleCA8PSBtYXhJbmRleCkge1xuICAgIGN1cnJlbnRJbmRleCA9ICgobWF4SW5kZXggKyBtaW5JbmRleCkgLyAyKSA+PiAwXG4gICAgY3VycmVudEl0ZW0gPSBpbmRpY2VzW2N1cnJlbnRJbmRleF1cblxuICAgIGlmIChtaW5JbmRleCA9PT0gbWF4SW5kZXgpIHtcbiAgICAgIHJldHVybiBjdXJyZW50SXRlbSA+PSBsZWZ0ICYmIGN1cnJlbnRJdGVtIDw9IHJpZ2h0XG4gICAgfSBlbHNlIGlmIChjdXJyZW50SXRlbSA8IGxlZnQpIHtcbiAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMVxuICAgIH0gZWxzZSBpZiAoY3VycmVudEl0ZW0gPiByaWdodCkge1xuICAgICAgbWF4SW5kZXggPSBjdXJyZW50SW5kZXggLSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICByZXR1cm4gYSA+IGIgPyAxIDogLTFcbn1cbiIsInZhciBwYXRjaFJlY3Vyc2l2ZSA9IHJlcXVpcmUoJy4vcGF0Y2hSZWN1cnNpdmUnKTtcblxuZnVuY3Rpb24gcGF0Y2gocm9vdE5vZGUsIHBhdGNoZXMpIHtcbiAgcmV0dXJuIHBhdGNoUmVjdXJzaXZlKHJvb3ROb2RlLCBwYXRjaGVzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaDsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgeCAhPT0gbnVsbDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBpc1NvZnRTZXRIb29rXG5cbmZ1bmN0aW9uIGlzU29mdFNldEhvb2soeCkge1xuICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHgudmFsdWUgIT09ICd1bmRlZmluZWQnO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc1ZpcnR1YWxOb2RlXG5cbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcblxuZnVuY3Rpb24gaXNWaXJ0dWFsTm9kZSh4KSB7XG4gIHJldHVybiB4ICYmIHgudCA9PT0gdHlwZXMuVmlydHVhbE5vZGVcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gaXNWaXJ0dWFsVGV4dFxuXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJyk7XG5cbmZ1bmN0aW9uIGlzVmlydHVhbFRleHQoeCkge1xuICByZXR1cm4geCAmJiB4LnQgPT09IHR5cGVzLlZpcnR1YWxUcmVlO1xufVxuIiwidmFyIGFwcGx5UHJvcGVydGllcyA9IHJlcXVpcmUoXCIuL2FwcGx5UHJvcGVydGllc1wiKTtcbnZhciBwYXRjaFR5cGVzID0gcmVxdWlyZShcIi4uL3BhdGNoVHlwZXNcIik7XG52YXIgcmVuZGVyID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHlQYXRjaFxuXG5mdW5jdGlvbiBhcHBseVBhdGNoKHZwYXRjaCwgZG9tTm9kZSkge1xuICB2YXIgdHlwZSA9IHZwYXRjaFswXVxuICB2YXIgcGF0Y2ggPSB2cGF0Y2hbMV1cbiAgdmFyIHZOb2RlID0gdnBhdGNoWzJdXG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBwYXRjaFR5cGVzLlJFTU9WRTpcbiAgICAgIHJldHVybiByZW1vdmVOb2RlKGRvbU5vZGUpXG4gICAgY2FzZSBwYXRjaFR5cGVzLklOU0VSVDpcbiAgICAgIHJldHVybiBpbnNlcnROb2RlKGRvbU5vZGUsIHBhdGNoKVxuICAgIGNhc2UgcGF0Y2hUeXBlcy5WVEVYVDpcbiAgICAgIHJldHVybiBzdHJpbmdQYXRjaChkb21Ob2RlLCBwYXRjaClcbiAgICBjYXNlIHBhdGNoVHlwZXMuVk5PREU6XG4gICAgICByZXR1cm4gdk5vZGVQYXRjaChkb21Ob2RlLCBwYXRjaClcbiAgICBjYXNlIHBhdGNoVHlwZXMuT1JERVI6XG4gICAgICByZW9yZGVyQ2hpbGRyZW4oZG9tTm9kZSwgcGF0Y2gpXG4gICAgICByZXR1cm4gZG9tTm9kZVxuICAgIGNhc2UgcGF0Y2hUeXBlcy5QUk9QUzpcbiAgICAgIGFwcGx5UHJvcGVydGllcyhkb21Ob2RlLCBwYXRjaCwgdk5vZGUucCkgLy8gJ3AnID09PSAncHJvcGVydGllcydcbiAgICAgIHJldHVybiBkb21Ob2RlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkb21Ob2RlXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTm9kZShkb21Ob2RlKSB7XG4gIHZhciBwYXJlbnROb2RlID0gZG9tTm9kZS5wYXJlbnROb2RlXG5cbiAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpXG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBpbnNlcnROb2RlKHBhcmVudE5vZGUsIHZOb2RlKSB7XG4gIHZhciBuZXdOb2RlID0gcmVuZGVyKHZOb2RlKVxuXG4gIGlmIChwYXJlbnROb2RlKSB7XG4gICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChuZXdOb2RlKVxuICB9XG5cbiAgcmV0dXJuIHBhcmVudE5vZGVcbn1cblxuZnVuY3Rpb24gc3RyaW5nUGF0Y2goZG9tTm9kZSwgdlRleHQpIHtcbiAgdmFyIG5ld05vZGVcblxuICBpZiAoZG9tTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgIGRvbU5vZGUucmVwbGFjZURhdGEoMCwgZG9tTm9kZS5sZW5ndGgsIHZUZXh0LngpIC8vICd4JyBtZWFucyAndGV4dCdcbiAgICBuZXdOb2RlID0gZG9tTm9kZVxuICB9IGVsc2Uge1xuICAgIHZhciBwYXJlbnROb2RlID0gZG9tTm9kZS5wYXJlbnROb2RlXG4gICAgbmV3Tm9kZSA9IHJlbmRlcih2VGV4dClcblxuICAgIGlmIChwYXJlbnROb2RlICYmIG5ld05vZGUgIT09IGRvbU5vZGUpIHtcbiAgICAgIHBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIGRvbU5vZGUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld05vZGVcbn1cblxuZnVuY3Rpb24gdk5vZGVQYXRjaChkb21Ob2RlLCB2Tm9kZSkge1xuICB2YXIgcGFyZW50Tm9kZSA9IGRvbU5vZGUucGFyZW50Tm9kZVxuICB2YXIgbmV3Tm9kZSA9IHJlbmRlcih2Tm9kZSlcblxuICBpZiAocGFyZW50Tm9kZSAmJiBuZXdOb2RlICE9PSBkb21Ob2RlKSB7XG4gICAgcGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgZG9tTm9kZSlcbiAgfVxuXG4gIHJldHVybiBuZXdOb2RlXG59XG5cbmZ1bmN0aW9uIHJlb3JkZXJDaGlsZHJlbihkb21Ob2RlLCBtb3Zlcykge1xuICB2YXIgY2hpbGROb2RlcyA9IGRvbU5vZGUuY2hpbGROb2Rlc1xuICB2YXIga2V5TWFwID0ge31cbiAgdmFyIG5vZGVcbiAgdmFyIHJlbW92ZVxuICB2YXIgaW5zZXJ0XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3Zlcy5yZW1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVtb3ZlID0gbW92ZXMucmVtb3Zlc1tpXVxuICAgIG5vZGUgPSBjaGlsZE5vZGVzW3JlbW92ZS5mcm9tXVxuICAgIGlmIChyZW1vdmUua2V5KSB7XG4gICAgICBrZXlNYXBbcmVtb3ZlLmtleV0gPSBub2RlXG4gICAgfVxuICAgIGRvbU5vZGUucmVtb3ZlQ2hpbGQobm9kZSlcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBjaGlsZE5vZGVzLmxlbmd0aFxuICBmb3IgKHZhciBqID0gMDsgaiA8IG1vdmVzLmluc2VydHMubGVuZ3RoOyBqKyspIHtcbiAgICBpbnNlcnQgPSBtb3Zlcy5pbnNlcnRzW2pdXG4gICAgbm9kZSA9IGtleU1hcFtpbnNlcnQua2V5XVxuICAgIC8vIHRoaXMgaXMgdGhlIHdlaXJkZXN0IGJ1ZyBpJ3ZlIGV2ZXIgc2VlbiBpbiB3ZWJraXRcbiAgICBkb21Ob2RlLmluc2VydEJlZm9yZShub2RlLCBpbnNlcnQudG8gPj0gbGVuZ3RoKysgPyBudWxsIDogY2hpbGROb2Rlc1tpbnNlcnQudG9dKVxuICB9XG59XG4iLCJ2YXIgZG9tSW5kZXggPSByZXF1aXJlKFwiLi9kb21JbmRleFwiKVxudmFyIHBhdGNoT3AgPSByZXF1aXJlKFwiLi9wYXRjaE9wXCIpXG5cbmZ1bmN0aW9uIHBhdGNoUmVjdXJzaXZlKHJvb3ROb2RlLCBwYXRjaGVzKSB7XG4gIHZhciBpbmRpY2VzID0gcGF0Y2hJbmRpY2VzKHBhdGNoZXMpXG5cbiAgaWYgKGluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHJvb3ROb2RlXG4gIH1cblxuICB2YXIgaW5kZXggPSBkb21JbmRleChyb290Tm9kZSwgcGF0Y2hlcy5hLCBpbmRpY2VzKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlSW5kZXggPSBpbmRpY2VzW2ldXG4gICAgcm9vdE5vZGUgPSBhcHBseVBhdGNoKHJvb3ROb2RlLFxuICAgICAgaW5kZXhbbm9kZUluZGV4XSxcbiAgICAgIHBhdGNoZXNbbm9kZUluZGV4XSlcbiAgfVxuXG4gIHJldHVybiByb290Tm9kZVxufVxuXG5mdW5jdGlvbiBhcHBseVBhdGNoKHJvb3ROb2RlLCBkb21Ob2RlLCBwYXRjaExpc3QpIHtcbiAgaWYgKCFkb21Ob2RlKSB7XG4gICAgcmV0dXJuIHJvb3ROb2RlXG4gIH1cblxuICB2YXIgbmV3Tm9kZVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbmV3Tm9kZSA9IHBhdGNoT3AocGF0Y2hMaXN0W2ldLCBkb21Ob2RlKVxuXG4gICAgaWYgKGRvbU5vZGUgPT09IHJvb3ROb2RlKSB7XG4gICAgICByb290Tm9kZSA9IG5ld05vZGVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcm9vdE5vZGVcbn1cblxuZnVuY3Rpb24gcGF0Y2hJbmRpY2VzKHBhdGNoZXMpIHtcbiAgdmFyIGluZGljZXMgPSBbXVxuXG4gIGZvciAodmFyIGtleSBpbiBwYXRjaGVzKSB7XG4gICAgaWYgKGtleSAhPT0gXCJhXCIpIHtcbiAgICAgIGluZGljZXMucHVzaChOdW1iZXIoa2V5KSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kaWNlc1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hSZWN1cnNpdmU7IiwiLy8gY29waWVkIGZyb20gdmRvbS1hcy1qc29uL3R5cGVzLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBWaXJ0dWFsVHJlZTogMSxcbiAgVmlydHVhbFBhdGNoOiAyLFxuICBWaXJ0dWFsTm9kZTogMyxcbiAgU29mdFNldEhvb2s6IDRcbn07IiwiLy8gb3JpZ2luYWwgdGhpcyB3YXMgaXMtdnBhdGNoLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBOT05FOiAwLFxuICBWVEVYVDogMSxcbiAgVk5PREU6IDIsXG4gIFdJREdFVDogMyxcbiAgUFJPUFM6IDQsXG4gIE9SREVSOiA1LFxuICBJTlNFUlQ6IDYsXG4gIFJFTU9WRTogNyxcbiAgVEhVTks6IDhcbn07IiwidmFyIHBhdGNoVHlwZXMgPSByZXF1aXJlKCcuLi9wYXRjaFR5cGVzJyk7XG52YXIgdG9Kc29uID0gcmVxdWlyZSgndmRvbS1hcy1qc29uL3RvSnNvbicpO1xuXG4vLyB0cmF2ZXJzZSB0aGUgdGhpbmcgdGhhdCB0aGUgb3JpZ2luYWwgcGF0Y2ggc3RydWN0dXJlIGNhbGxlZCBcImEnLFxuLy8gaS5lLiB0aGUgdmlydHVhbCB0cmVlIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBub2RlIHN0cnVjdHVyZS5cbi8vIHRoaXMgdGhpbmcgb25seSByZWFsbHkgbmVlZHMgdHdvIHByb3BlcnRpZXMgLSBcImNoaWxkcmVuXCIgYW5kIFwiY291bnRcIixcbi8vIHNvIHRyaW0gb3V0IGV2ZXJ5dGhpbmcgZWxzZVxuZnVuY3Rpb24gc2VyaWFsaXplQ3VycmVudE5vZGUoY3VycmVudE5vZGUpIHtcbiAgdmFyIGNoaWxkcmVuID0gY3VycmVudE5vZGUuY2hpbGRyZW47XG4gIGlmICghY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgbGVuID0gY2hpbGRyZW4ubGVuZ3RoO1xuICB2YXIgYXJyID0gbmV3IEFycmF5KGxlbik7XG4gIHZhciBpID0gLTE7XG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICBhcnJbaV0gPSBzZXJpYWxpemVDdXJyZW50Tm9kZShjaGlsZHJlbltpXSk7XG4gIH1cbiAgaWYgKGN1cnJlbnROb2RlLmNvdW50KSB7XG4gICAgcmV0dXJuIFthcnIsIGN1cnJlbnROb2RlLmNvdW50XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW2Fycl07XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplVmlydHVhbFBhdGNoT3JQYXRjaGVzKHZQYXRjaCkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2UGF0Y2gpKSB7XG4gICAgdmFyIGxlbiA9IHZQYXRjaC5sZW5ndGg7XG4gICAgdmFyIHJlcyA9IG5ldyBBcnJheShsZW4pO1xuICAgIHZhciBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgcmVzW2ldID0gc2VyaWFsaXplVmlydHVhbFBhdGNoKHZQYXRjaFtpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgcmV0dXJuIFtzZXJpYWxpemVWaXJ0dWFsUGF0Y2godlBhdGNoKV07XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVZpcnR1YWxQYXRjaCh2UGF0Y2gpIHtcbiAgdmFyIHR5cGUgPSB2UGF0Y2gudHlwZTtcbiAgdmFyIHJlcyA9IFtcbiAgICB0eXBlLFxuICAgIHRvSnNvbih2UGF0Y2gucGF0Y2gpXG4gIF07XG5cbiAgaWYgKHR5cGUgPT09IHBhdGNoVHlwZXMuUFJPUFMpIHtcbiAgICAvLyB0aGlzIGlzIHRoZSBvbmx5IHRpbWUgdGhlIHZOb2RlIGlzIG5lZWRlZFxuICAgIHJlcy5wdXNoKHtwOiB2UGF0Y2gudk5vZGUucHJvcGVydGllc30pOyAvLyAncCcgPT09ICdwcm9wZXJ0aWVzJ1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBhdGNoKSB7XG4gIHZhciBvdXRwdXRSb290Tm9kZSA9IHNlcmlhbGl6ZUN1cnJlbnROb2RlKHBhdGNoLmEpO1xuXG4gIHZhciByZXMgPSB7XG4gICAgYTogb3V0cHV0Um9vdE5vZGVcbiAgfTtcblxuICBmb3IgKHZhciBrZXkgaW4gcGF0Y2gpIHtcbiAgICBpZiAoa2V5ICE9PSAnYScpIHtcbiAgICAgIHJlc1trZXldID0gc2VyaWFsaXplVmlydHVhbFBhdGNoT3JQYXRjaGVzKHBhdGNoW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJyk7XG5cbnZhciBTb2Z0U2V0SG9vayA9XG4gIHJlcXVpcmUoJ3ZpcnR1YWwtZG9tL3ZpcnR1YWwtaHlwZXJzY3JpcHQvaG9va3Mvc29mdC1zZXQtaG9vaycpO1xuXG5mdW5jdGlvbiBhcnJheVRvSnNvbihhcnIpIHtcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gIHZhciBpID0gLTE7XG4gIHZhciByZXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgIHJlc1tpXSA9IHRvSnNvbihhcnJbaV0pO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHBsYWluT2JqZWN0VG9Kc29uKG9iaikge1xuICB2YXIgcmVzID0ge307XG4gIC8qIGpzaGludCAtVzA4OSAqL1xuICAvKiB0aGlzIGlzIGZpbmU7IHRoZXNlIG9iamVjdHMgYXJlIGFsd2F5cyBwbGFpbiAqL1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgdmFyIHZhbCA9IG9ialtrZXldO1xuICAgIHJlc1trZXldID0gdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgPyB0b0pzb24odmFsKSA6IHZhbDtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiB2aXJ0dWFsTm9kZVRvSnNvbihvYmopIHtcbiAgdmFyIHJlcyA9IHtcbiAgICAvLyB0eXBlXG4gICAgdDogdHlwZXMuVmlydHVhbE5vZGUsXG4gICAgdG46IG9iai50YWdOYW1lXG4gIH07XG4gIGlmIChPYmplY3Qua2V5cyhvYmoucHJvcGVydGllcykubGVuZ3RoKSB7XG4gICAgcmVzLnAgPSBwbGFpbk9iamVjdFRvSnNvbihvYmoucHJvcGVydGllcyk7XG4gIH1cbiAgaWYgKG9iai5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICByZXMuYyA9IGFycmF5VG9Kc29uKG9iai5jaGlsZHJlbik7XG4gIH1cbiAgaWYgKG9iai5rZXkpIHtcbiAgICByZXMuayA9IG9iai5rZXk7XG4gIH1cbiAgaWYgKG9iai5uYW1lc3BhY2UpIHtcbiAgICByZXMubiA9IG9iai5uYW1lc3BhY2U7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gdmlydHVhbFRleHRUb0pzb24ob2JqKSB7XG4gIHJldHVybiB7XG4gICAgLy8gdHlwZVxuICAgIHQ6IHR5cGVzLlZpcnR1YWxUcmVlLFxuICAgIC8vIHRleHRcbiAgICB4OiBvYmoudGV4dFxuICB9O1xufVxuXG5mdW5jdGlvbiB2aXJ0dWFsUGF0Y2hUb0pzb24ob2JqKSB7XG4gIHZhciByZXMgPSB7XG4gICAgLy8gdHlwZVxuICAgIHQ6IHR5cGVzLlZpcnR1YWxQYXRjaCxcbiAgICAvLyBwYXRjaCB0eXBlXG4gICAgcHQ6IG9iai50eXBlXG4gIH07XG5cbiAgaWYgKG9iai52Tm9kZSkge1xuICAgIHJlcy52ID0gdG9Kc29uKG9iai52Tm9kZSk7XG4gIH1cblxuICBpZiAob2JqLnBhdGNoKSB7XG4gICAgcmVzLnAgPSB0b0pzb24ob2JqLnBhdGNoKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHNvZnRTZXRIb29rVG9Kc29uKG9iaikge1xuICByZXR1cm4ge1xuICAgIC8vIHR5cGVcbiAgICB0OiB0eXBlcy5Tb2Z0U2V0SG9vayxcbiAgICB2YWx1ZTogb2JqLnZhbHVlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG9iamVjdFRvSnNvbihvYmopIHtcbiAgaWYgKCdwYXRjaCcgaW4gb2JqICYmIHR5cGVvZiBvYmoudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmlydHVhbFBhdGNoVG9Kc29uKG9iaik7XG4gIH1cbiAgaWYgKG9iai50eXBlID09PSAnVmlydHVhbE5vZGUnKSB7XG4gICAgcmV0dXJuIHZpcnR1YWxOb2RlVG9Kc29uKG9iaik7XG4gIH1cbiAgaWYgKG9iai50eXBlID09PSAnVmlydHVhbFRleHQnKSB7XG4gICAgcmV0dXJuIHZpcnR1YWxUZXh0VG9Kc29uKG9iaik7XG4gIH1cbiAgaWYgKG9iaiBpbnN0YW5jZW9mIFNvZnRTZXRIb29rKSB7XG4gICAgcmV0dXJuIHNvZnRTZXRIb29rVG9Kc29uKG9iaik7XG4gIH1cblxuICAvLyBwbGFpbiBvYmplY3RcbiAgcmV0dXJuIHBsYWluT2JqZWN0VG9Kc29uKG9iaik7XG59XG5cbmZ1bmN0aW9uIHRvSnNvbihvYmopIHtcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIHR5cGUgPT09ICdvYmplY3QnXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gYXJyYXlUb0pzb24ob2JqKTtcbiAgfVxuXG4gIGlmICghb2JqKSB7IC8vIG51bGxcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBvYmplY3RUb0pzb24ob2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0pzb247IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFZpcnR1YWxUcmVlOiAxLFxuICBWaXJ0dWFsUGF0Y2g6IDIsXG4gIFZpcnR1YWxOb2RlOiAzLFxuICBTb2Z0U2V0SG9vazogNFxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvdG9Kc29uJyk7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9wYXRjaCcpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9zZXJpYWxpemUnKTtcbiIsInZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZShcIi4vdmRvbS9jcmVhdGUtZWxlbWVudC5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUVsZW1lbnRcbiIsInZhciBkaWZmID0gcmVxdWlyZShcIi4vdnRyZWUvZGlmZi5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmZcbiIsInZhciBoID0gcmVxdWlyZShcIi4vdmlydHVhbC1oeXBlcnNjcmlwdC9pbmRleC5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhcbiIsInZhciBkaWZmID0gcmVxdWlyZShcIi4vZGlmZi5qc1wiKVxyXG52YXIgcGF0Y2ggPSByZXF1aXJlKFwiLi9wYXRjaC5qc1wiKVxyXG52YXIgaCA9IHJlcXVpcmUoXCIuL2guanNcIilcclxudmFyIGNyZWF0ZSA9IHJlcXVpcmUoXCIuL2NyZWF0ZS1lbGVtZW50LmpzXCIpXHJcbnZhciBWTm9kZSA9IHJlcXVpcmUoJy4vdm5vZGUvdm5vZGUuanMnKVxyXG52YXIgVlRleHQgPSByZXF1aXJlKCcuL3Zub2RlL3Z0ZXh0LmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZGlmZjogZGlmZixcclxuICAgIHBhdGNoOiBwYXRjaCxcclxuICAgIGg6IGgsXHJcbiAgICBjcmVhdGU6IGNyZWF0ZSxcclxuICAgIFZOb2RlOiBWTm9kZSxcclxuICAgIFZUZXh0OiBWVGV4dFxyXG59XHJcbiIsIi8qIVxuICogQ3Jvc3MtQnJvd3NlciBTcGxpdCAxLjEuMVxuICogQ29weXJpZ2h0IDIwMDctMjAxMiBTdGV2ZW4gTGV2aXRoYW4gPHN0ZXZlbmxldml0aGFuLmNvbT5cbiAqIEF2YWlsYWJsZSB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqIEVDTUFTY3JpcHQgY29tcGxpYW50LCB1bmlmb3JtIGNyb3NzLWJyb3dzZXIgc3BsaXQgbWV0aG9kXG4gKi9cblxuLyoqXG4gKiBTcGxpdHMgYSBzdHJpbmcgaW50byBhbiBhcnJheSBvZiBzdHJpbmdzIHVzaW5nIGEgcmVnZXggb3Igc3RyaW5nIHNlcGFyYXRvci4gTWF0Y2hlcyBvZiB0aGVcbiAqIHNlcGFyYXRvciBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSByZXN1bHQgYXJyYXkuIEhvd2V2ZXIsIGlmIGBzZXBhcmF0b3JgIGlzIGEgcmVnZXggdGhhdCBjb250YWluc1xuICogY2FwdHVyaW5nIGdyb3VwcywgYmFja3JlZmVyZW5jZXMgYXJlIHNwbGljZWQgaW50byB0aGUgcmVzdWx0IGVhY2ggdGltZSBgc2VwYXJhdG9yYCBpcyBtYXRjaGVkLlxuICogRml4ZXMgYnJvd3NlciBidWdzIGNvbXBhcmVkIHRvIHRoZSBuYXRpdmUgYFN0cmluZy5wcm90b3R5cGUuc3BsaXRgIGFuZCBjYW4gYmUgdXNlZCByZWxpYWJseVxuICogY3Jvc3MtYnJvd3Nlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIHNwbGl0LlxuICogQHBhcmFtIHtSZWdFeHB8U3RyaW5nfSBzZXBhcmF0b3IgUmVnZXggb3Igc3RyaW5nIHRvIHVzZSBmb3Igc2VwYXJhdGluZyB0aGUgc3RyaW5nLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtsaW1pdF0gTWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0IGFycmF5LlxuICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBzdWJzdHJpbmdzLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBCYXNpYyB1c2VcbiAqIHNwbGl0KCdhIGIgYyBkJywgJyAnKTtcbiAqIC8vIC0+IFsnYScsICdiJywgJ2MnLCAnZCddXG4gKlxuICogLy8gV2l0aCBsaW1pdFxuICogc3BsaXQoJ2EgYiBjIGQnLCAnICcsIDIpO1xuICogLy8gLT4gWydhJywgJ2InXVxuICpcbiAqIC8vIEJhY2tyZWZlcmVuY2VzIGluIHJlc3VsdCBhcnJheVxuICogc3BsaXQoJy4ud29yZDEgd29yZDIuLicsIC8oW2Etel0rKShcXGQrKS9pKTtcbiAqIC8vIC0+IFsnLi4nLCAnd29yZCcsICcxJywgJyAnLCAnd29yZCcsICcyJywgJy4uJ11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gc3BsaXQodW5kZWYpIHtcblxuICB2YXIgbmF0aXZlU3BsaXQgPSBTdHJpbmcucHJvdG90eXBlLnNwbGl0LFxuICAgIGNvbXBsaWFudEV4ZWNOcGNnID0gLygpPz8vLmV4ZWMoXCJcIilbMV0gPT09IHVuZGVmLFxuICAgIC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG4gICAgc2VsZjtcblxuICBzZWxmID0gZnVuY3Rpb24oc3RyLCBzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBgbmF0aXZlU3BsaXRgXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzZXBhcmF0b3IpICE9PSBcIltvYmplY3QgUmVnRXhwXVwiKSB7XG4gICAgICByZXR1cm4gbmF0aXZlU3BsaXQuY2FsbChzdHIsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH1cbiAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/IFwiaVwiIDogXCJcIikgKyAoc2VwYXJhdG9yLm11bHRpbGluZSA/IFwibVwiIDogXCJcIikgKyAoc2VwYXJhdG9yLmV4dGVuZGVkID8gXCJ4XCIgOiBcIlwiKSArIC8vIFByb3Bvc2VkIGZvciBFUzZcbiAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ID8gXCJ5XCIgOiBcIlwiKSxcbiAgICAgIC8vIEZpcmVmb3ggMytcbiAgICAgIGxhc3RMYXN0SW5kZXggPSAwLFxuICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgIHNlcGFyYXRvciA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyBcImdcIiksXG4gICAgICBzZXBhcmF0b3IyLCBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoO1xuICAgIHN0ciArPSBcIlwiOyAvLyBUeXBlLWNvbnZlcnRcbiAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnKSB7XG4gICAgICAvLyBEb2Vzbid0IG5lZWQgZmxhZ3MgZ3ksIGJ1dCB0aGV5IGRvbid0IGh1cnRcbiAgICAgIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKFwiXlwiICsgc2VwYXJhdG9yLnNvdXJjZSArIFwiJCg/IVxcXFxzKVwiLCBmbGFncyk7XG4gICAgfVxuICAgIC8qIFZhbHVlcyBmb3IgYGxpbWl0YCwgcGVyIHRoZSBzcGVjOlxuICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICogSWYgMCwgSW5maW5pdHksIG9yIE5hTjogMFxuICAgICAqIElmIHBvc2l0aXZlIG51bWJlcjogbGltaXQgPSBNYXRoLmZsb29yKGxpbWl0KTsgaWYgKGxpbWl0ID4gNDI5NDk2NzI5NSkgbGltaXQgLT0gNDI5NDk2NzI5NjtcbiAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgKiBJZiBvdGhlcjogVHlwZS1jb252ZXJ0LCB0aGVuIHVzZSB0aGUgYWJvdmUgcnVsZXNcbiAgICAgKi9cbiAgICBsaW1pdCA9IGxpbWl0ID09PSB1bmRlZiA/IC0xID4+PiAwIDogLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgIGxpbWl0ID4+PiAwOyAvLyBUb1VpbnQzMihsaW1pdClcbiAgICB3aGlsZSAobWF0Y2ggPSBzZXBhcmF0b3IuZXhlYyhzdHIpKSB7XG4gICAgICAvLyBgc2VwYXJhdG9yLmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goc3RyLnNsaWNlKGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgIGZvclxuICAgICAgICAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cHNcbiAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZyAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB1bmRlZikge1xuICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdW5kZWY7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaC5pbmRleCA8IHN0ci5sZW5ndGgpIHtcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW1pdCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2VwYXJhdG9yLmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgc2VwYXJhdG9yLmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHIubGVuZ3RoKSB7XG4gICAgICBpZiAobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yLnRlc3QoXCJcIikpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goXCJcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKHN0ci5zbGljZShsYXN0TGFzdEluZGV4KSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltaXQgPyBvdXRwdXQuc2xpY2UoMCwgbGltaXQpIDogb3V0cHV0O1xuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIE9uZVZlcnNpb25Db25zdHJhaW50ID0gcmVxdWlyZSgnaW5kaXZpZHVhbC9vbmUtdmVyc2lvbicpO1xuXG52YXIgTVlfVkVSU0lPTiA9ICc3Jztcbk9uZVZlcnNpb25Db25zdHJhaW50KCdldi1zdG9yZScsIE1ZX1ZFUlNJT04pO1xuXG52YXIgaGFzaEtleSA9ICdfX0VWX1NUT1JFX0tFWUAnICsgTVlfVkVSU0lPTjtcblxubW9kdWxlLmV4cG9ydHMgPSBFdlN0b3JlO1xuXG5mdW5jdGlvbiBFdlN0b3JlKGVsZW0pIHtcbiAgICB2YXIgaGFzaCA9IGVsZW1baGFzaEtleV07XG5cbiAgICBpZiAoIWhhc2gpIHtcbiAgICAgICAgaGFzaCA9IGVsZW1baGFzaEtleV0gPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzaDtcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxuLypnbG9iYWwgd2luZG93LCBnbG9iYWwqL1xuXG52YXIgcm9vdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID9cbiAgICB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/XG4gICAgZ2xvYmFsIDoge307XG5cbm1vZHVsZS5leHBvcnRzID0gSW5kaXZpZHVhbDtcblxuZnVuY3Rpb24gSW5kaXZpZHVhbChrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiByb290KSB7XG4gICAgICAgIHJldHVybiByb290W2tleV07XG4gICAgfVxuXG4gICAgcm9vdFtrZXldID0gdmFsdWU7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OWtkV1YwTDI1dlpHVmZiVzlrZFd4bGN5OTJhWEowZFdGc0xXUnZiUzl1YjJSbFgyMXZaSFZzWlhNdlpYWXRjM1J2Y21VdmJtOWtaVjl0YjJSMWJHVnpMMmx1WkdsMmFXUjFZV3d2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dUx5cG5iRzlpWVd3Z2QybHVaRzkzTENCbmJHOWlZV3dxTDF4dVhHNTJZWElnY205dmRDQTlJSFI1Y0dWdlppQjNhVzVrYjNjZ0lUMDlJQ2QxYm1SbFptbHVaV1FuSUQ5Y2JpQWdJQ0IzYVc1a2IzY2dPaUIwZVhCbGIyWWdaMnh2WW1Gc0lDRTlQU0FuZFc1a1pXWnBibVZrSnlBL1hHNGdJQ0FnWjJ4dlltRnNJRG9nZTMwN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdTVzVrYVhacFpIVmhiRHRjYmx4dVpuVnVZM1JwYjI0Z1NXNWthWFpwWkhWaGJDaHJaWGtzSUhaaGJIVmxLU0I3WEc0Z0lDQWdhV1lnS0d0bGVTQnBiaUJ5YjI5MEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnliMjkwVzJ0bGVWMDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtOXZkRnRyWlhsZElEMGdkbUZzZFdVN1hHNWNiaUFnSUNCeVpYUjFjbTRnZG1Gc2RXVTdYRzU5WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBJbmRpdmlkdWFsID0gcmVxdWlyZSgnLi9pbmRleC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9uZVZlcnNpb247XG5cbmZ1bmN0aW9uIE9uZVZlcnNpb24obW9kdWxlTmFtZSwgdmVyc2lvbiwgZGVmYXVsdFZhbHVlKSB7XG4gICAgdmFyIGtleSA9ICdfX0lORElWSURVQUxfT05FX1ZFUlNJT05fJyArIG1vZHVsZU5hbWU7XG4gICAgdmFyIGVuZm9yY2VLZXkgPSBrZXkgKyAnX0VORk9SQ0VfU0lOR0xFVE9OJztcblxuICAgIHZhciB2ZXJzaW9uVmFsdWUgPSBJbmRpdmlkdWFsKGVuZm9yY2VLZXksIHZlcnNpb24pO1xuXG4gICAgaWYgKHZlcnNpb25WYWx1ZSAhPT0gdmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBvbmx5IGhhdmUgb25lIGNvcHkgb2YgJyArXG4gICAgICAgICAgICBtb2R1bGVOYW1lICsgJy5cXG4nICtcbiAgICAgICAgICAgICdZb3UgYWxyZWFkeSBoYXZlIHZlcnNpb24gJyArIHZlcnNpb25WYWx1ZSArXG4gICAgICAgICAgICAnIGluc3RhbGxlZC5cXG4nICtcbiAgICAgICAgICAgICdUaGlzIG1lYW5zIHlvdSBjYW5ub3QgaW5zdGFsbCB2ZXJzaW9uICcgKyB2ZXJzaW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5kaXZpZHVhbChrZXksIGRlZmF1bHRWYWx1ZSk7XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgdG9wTGV2ZWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fVxudmFyIG1pbkRvYyA9IHJlcXVpcmUoJ21pbi1kb2N1bWVudCcpO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIHZhciBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J107XG5cbiAgICBpZiAoIWRvY2N5KSB7XG4gICAgICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXSA9IG1pbkRvYztcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY2N5O1xufVxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlrZFdWMEwyNXZaR1ZmYlc5a2RXeGxjeTkyYVhKMGRXRnNMV1J2YlM5dWIyUmxYMjF2WkhWc1pYTXZaMnh2WW1Gc0wyUnZZM1Z0Wlc1MExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlIUnZjRXhsZG1Wc0lEMGdkSGx3Wlc5bUlHZHNiMkpoYkNBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnUHlCbmJHOWlZV3dnT2x4dUlDQWdJSFI1Y0dWdlppQjNhVzVrYjNjZ0lUMDlJQ2QxYm1SbFptbHVaV1FuSUQ4Z2QybHVaRzkzSURvZ2UzMWNiblpoY2lCdGFXNUViMk1nUFNCeVpYRjFhWEpsS0NkdGFXNHRaRzlqZFcxbGJuUW5LVHRjYmx4dWFXWWdLSFI1Y0dWdlppQmtiMk4xYldWdWRDQWhQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnSUNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdSdlkzVnRaVzUwTzF4dWZTQmxiSE5sSUh0Y2JpQWdJQ0IyWVhJZ1pHOWpZM2tnUFNCMGIzQk1aWFpsYkZzblgxOUhURTlDUVV4ZlJFOURWVTFGVGxSZlEwRkRTRVZBTkNkZE8xeHVYRzRnSUNBZ2FXWWdLQ0ZrYjJOamVTa2dlMXh1SUNBZ0lDQWdJQ0JrYjJOamVTQTlJSFJ2Y0V4bGRtVnNXeWRmWDBkTVQwSkJURjlFVDBOVlRVVk9WRjlEUVVOSVJVQTBKMTBnUFNCdGFXNUViMk03WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQmtiMk5qZVR0Y2JuMWNiaUpkZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcblx0cmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHggIT09IG51bGw7XG59O1xuIiwidmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlSXNBcnJheSB8fCBpc0FycmF5XG5cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiXG59XG4iLCJ2YXIgcGF0Y2ggPSByZXF1aXJlKFwiLi92ZG9tL3BhdGNoLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoXCJpcy1vYmplY3RcIilcbnZhciBpc0hvb2sgPSByZXF1aXJlKFwiLi4vdm5vZGUvaXMtdmhvb2suanNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseVByb3BlcnRpZXNcblxuZnVuY3Rpb24gYXBwbHlQcm9wZXJ0aWVzKG5vZGUsIHByb3BzLCBwcmV2aW91cykge1xuICAgIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV1cblxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlbW92ZVByb3BlcnR5KG5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUsIHByZXZpb3VzKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0hvb2socHJvcFZhbHVlKSkge1xuICAgICAgICAgICAgcmVtb3ZlUHJvcGVydHkobm9kZSwgcHJvcE5hbWUsIHByb3BWYWx1ZSwgcHJldmlvdXMpXG4gICAgICAgICAgICBpZiAocHJvcFZhbHVlLmhvb2spIHtcbiAgICAgICAgICAgICAgICBwcm9wVmFsdWUuaG9vayhub2RlLFxuICAgICAgICAgICAgICAgICAgICBwcm9wTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMgPyBwcmV2aW91c1twcm9wTmFtZV0gOiB1bmRlZmluZWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QocHJvcFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHBhdGNoT2JqZWN0KG5vZGUsIHByb3BzLCBwcmV2aW91cywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVByb3BlcnR5KG5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUsIHByZXZpb3VzKSB7XG4gICAgaWYgKHByZXZpb3VzKSB7XG4gICAgICAgIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNbcHJvcE5hbWVdXG5cbiAgICAgICAgaWYgKCFpc0hvb2socHJldmlvdXNWYWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcE5hbWUgPT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnN0eWxlW2ldID0gXCJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHByZXZpb3VzVmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BOYW1lXSA9IFwiXCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZVtwcm9wTmFtZV0gPSBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNWYWx1ZS51bmhvb2spIHtcbiAgICAgICAgICAgIHByZXZpb3VzVmFsdWUudW5ob29rKG5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhdGNoT2JqZWN0KG5vZGUsIHByb3BzLCBwcmV2aW91cywgcHJvcE5hbWUsIHByb3BWYWx1ZSkge1xuICAgIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXMgPyBwcmV2aW91c1twcm9wTmFtZV0gOiB1bmRlZmluZWRcblxuICAgIC8vIFNldCBhdHRyaWJ1dGVzXG4gICAgaWYgKHByb3BOYW1lID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBhdHRyVmFsdWUgPSBwcm9wVmFsdWVbYXR0ck5hbWVdXG5cbiAgICAgICAgICAgIGlmIChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYocHJldmlvdXNWYWx1ZSAmJiBpc09iamVjdChwcmV2aW91c1ZhbHVlKSAmJlxuICAgICAgICBnZXRQcm90b3R5cGUocHJldmlvdXNWYWx1ZSkgIT09IGdldFByb3RvdHlwZShwcm9wVmFsdWUpKSB7XG4gICAgICAgIG5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghaXNPYmplY3Qobm9kZVtwcm9wTmFtZV0pKSB7XG4gICAgICAgIG5vZGVbcHJvcE5hbWVdID0ge31cbiAgICB9XG5cbiAgICB2YXIgcmVwbGFjZXIgPSBwcm9wTmFtZSA9PT0gXCJzdHlsZVwiID8gXCJcIiA6IHVuZGVmaW5lZFxuXG4gICAgZm9yICh2YXIgayBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcHJvcFZhbHVlW2tdXG4gICAgICAgIG5vZGVbcHJvcE5hbWVdW2tdID0gKHZhbHVlID09PSB1bmRlZmluZWQpID8gcmVwbGFjZXIgOiB2YWx1ZVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0UHJvdG90eXBlKHZhbHVlKSB7XG4gICAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKVxuICAgIH0gZWxzZSBpZiAodmFsdWUuX19wcm90b19fKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5fX3Byb3RvX19cbiAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICB9XG59XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKFwiZ2xvYmFsL2RvY3VtZW50XCIpXG5cbnZhciBhcHBseVByb3BlcnRpZXMgPSByZXF1aXJlKFwiLi9hcHBseS1wcm9wZXJ0aWVzXCIpXG5cbnZhciBpc1ZOb2RlID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXZub2RlLmpzXCIpXG52YXIgaXNWVGV4dCA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy12dGV4dC5qc1wiKVxudmFyIGlzV2lkZ2V0ID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXdpZGdldC5qc1wiKVxudmFyIGhhbmRsZVRodW5rID0gcmVxdWlyZShcIi4uL3Zub2RlL2hhbmRsZS10aHVuay5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUVsZW1lbnRcblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh2bm9kZSwgb3B0cykge1xuICAgIHZhciBkb2MgPSBvcHRzID8gb3B0cy5kb2N1bWVudCB8fCBkb2N1bWVudCA6IGRvY3VtZW50XG4gICAgdmFyIHdhcm4gPSBvcHRzID8gb3B0cy53YXJuIDogbnVsbFxuXG4gICAgdm5vZGUgPSBoYW5kbGVUaHVuayh2bm9kZSkuYVxuXG4gICAgaWYgKGlzV2lkZ2V0KHZub2RlKSkge1xuICAgICAgICByZXR1cm4gdm5vZGUuaW5pdCgpXG4gICAgfSBlbHNlIGlmIChpc1ZUZXh0KHZub2RlKSkge1xuICAgICAgICByZXR1cm4gZG9jLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpXG4gICAgfSBlbHNlIGlmICghaXNWTm9kZSh2bm9kZSkpIHtcbiAgICAgICAgaWYgKHdhcm4pIHtcbiAgICAgICAgICAgIHdhcm4oXCJJdGVtIGlzIG5vdCBhIHZhbGlkIHZpcnR1YWwgZG9tIG5vZGVcIiwgdm5vZGUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICB2YXIgbm9kZSA9ICh2bm9kZS5uYW1lc3BhY2UgPT09IG51bGwpID9cbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnQodm5vZGUudGFnTmFtZSkgOlxuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudE5TKHZub2RlLm5hbWVzcGFjZSwgdm5vZGUudGFnTmFtZSlcblxuICAgIHZhciBwcm9wcyA9IHZub2RlLnByb3BlcnRpZXNcbiAgICBhcHBseVByb3BlcnRpZXMobm9kZSwgcHJvcHMpXG5cbiAgICB2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGROb2RlID0gY3JlYXRlRWxlbWVudChjaGlsZHJlbltpXSwgb3B0cylcbiAgICAgICAgaWYgKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZE5vZGUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZVxufVxuIiwiLy8gTWFwcyBhIHZpcnR1YWwgRE9NIHRyZWUgb250byBhIHJlYWwgRE9NIHRyZWUgaW4gYW4gZWZmaWNpZW50IG1hbm5lci5cbi8vIFdlIGRvbid0IHdhbnQgdG8gcmVhZCBhbGwgb2YgdGhlIERPTSBub2RlcyBpbiB0aGUgdHJlZSBzbyB3ZSB1c2Vcbi8vIHRoZSBpbi1vcmRlciB0cmVlIGluZGV4aW5nIHRvIGVsaW1pbmF0ZSByZWN1cnNpb24gZG93biBjZXJ0YWluIGJyYW5jaGVzLlxuLy8gV2Ugb25seSByZWN1cnNlIGludG8gYSBET00gbm9kZSBpZiB3ZSBrbm93IHRoYXQgaXQgY29udGFpbnMgYSBjaGlsZCBvZlxuLy8gaW50ZXJlc3QuXG5cbnZhciBub0NoaWxkID0ge31cblxubW9kdWxlLmV4cG9ydHMgPSBkb21JbmRleFxuXG5mdW5jdGlvbiBkb21JbmRleChyb290Tm9kZSwgdHJlZSwgaW5kaWNlcywgbm9kZXMpIHtcbiAgICBpZiAoIWluZGljZXMgfHwgaW5kaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5kaWNlcy5zb3J0KGFzY2VuZGluZylcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2Uocm9vdE5vZGUsIHRyZWUsIGluZGljZXMsIG5vZGVzLCAwKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVjdXJzZShyb290Tm9kZSwgdHJlZSwgaW5kaWNlcywgbm9kZXMsIHJvb3RJbmRleCkge1xuICAgIG5vZGVzID0gbm9kZXMgfHwge31cblxuXG4gICAgaWYgKHJvb3ROb2RlKSB7XG4gICAgICAgIGlmIChpbmRleEluUmFuZ2UoaW5kaWNlcywgcm9vdEluZGV4LCByb290SW5kZXgpKSB7XG4gICAgICAgICAgICBub2Rlc1tyb290SW5kZXhdID0gcm9vdE5vZGVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2Q2hpbGRyZW4gPSB0cmVlLmNoaWxkcmVuXG5cbiAgICAgICAgaWYgKHZDaGlsZHJlbikge1xuXG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlcyA9IHJvb3ROb2RlLmNoaWxkTm9kZXNcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm9vdEluZGV4ICs9IDFcblxuICAgICAgICAgICAgICAgIHZhciB2Q2hpbGQgPSB2Q2hpbGRyZW5baV0gfHwgbm9DaGlsZFxuICAgICAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSByb290SW5kZXggKyAodkNoaWxkLmNvdW50IHx8IDApXG5cbiAgICAgICAgICAgICAgICAvLyBza2lwIHJlY3Vyc2lvbiBkb3duIHRoZSB0cmVlIGlmIHRoZXJlIGFyZSBubyBub2RlcyBkb3duIGhlcmVcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhJblJhbmdlKGluZGljZXMsIHJvb3RJbmRleCwgbmV4dEluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGNoaWxkTm9kZXNbaV0sIHZDaGlsZCwgaW5kaWNlcywgbm9kZXMsIHJvb3RJbmRleClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb290SW5kZXggPSBuZXh0SW5kZXhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2Rlc1xufVxuXG4vLyBCaW5hcnkgc2VhcmNoIGZvciBhbiBpbmRleCBpbiB0aGUgaW50ZXJ2YWwgW2xlZnQsIHJpZ2h0XVxuZnVuY3Rpb24gaW5kZXhJblJhbmdlKGluZGljZXMsIGxlZnQsIHJpZ2h0KSB7XG4gICAgaWYgKGluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHZhciBtaW5JbmRleCA9IDBcbiAgICB2YXIgbWF4SW5kZXggPSBpbmRpY2VzLmxlbmd0aCAtIDFcbiAgICB2YXIgY3VycmVudEluZGV4XG4gICAgdmFyIGN1cnJlbnRJdGVtXG5cbiAgICB3aGlsZSAobWluSW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKChtYXhJbmRleCArIG1pbkluZGV4KSAvIDIpID4+IDBcbiAgICAgICAgY3VycmVudEl0ZW0gPSBpbmRpY2VzW2N1cnJlbnRJbmRleF1cblxuICAgICAgICBpZiAobWluSW5kZXggPT09IG1heEluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEl0ZW0gPj0gbGVmdCAmJiBjdXJyZW50SXRlbSA8PSByaWdodFxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJdGVtIDwgbGVmdCkge1xuICAgICAgICAgICAgbWluSW5kZXggPSBjdXJyZW50SW5kZXggKyAxXG4gICAgICAgIH0gZWxzZSAgaWYgKGN1cnJlbnRJdGVtID4gcmlnaHQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgICByZXR1cm4gYSA+IGIgPyAxIDogLTFcbn1cbiIsInZhciBhcHBseVByb3BlcnRpZXMgPSByZXF1aXJlKFwiLi9hcHBseS1wcm9wZXJ0aWVzXCIpXG5cbnZhciBpc1dpZGdldCA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy13aWRnZXQuanNcIilcbnZhciBWUGF0Y2ggPSByZXF1aXJlKFwiLi4vdm5vZGUvdnBhdGNoLmpzXCIpXG5cbnZhciB1cGRhdGVXaWRnZXQgPSByZXF1aXJlKFwiLi91cGRhdGUtd2lkZ2V0XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHlQYXRjaFxuXG5mdW5jdGlvbiBhcHBseVBhdGNoKHZwYXRjaCwgZG9tTm9kZSwgcmVuZGVyT3B0aW9ucykge1xuICAgIHZhciB0eXBlID0gdnBhdGNoLnR5cGVcbiAgICB2YXIgdk5vZGUgPSB2cGF0Y2gudk5vZGVcbiAgICB2YXIgcGF0Y2ggPSB2cGF0Y2gucGF0Y2hcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFZQYXRjaC5SRU1PVkU6XG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlTm9kZShkb21Ob2RlLCB2Tm9kZSlcbiAgICAgICAgY2FzZSBWUGF0Y2guSU5TRVJUOlxuICAgICAgICAgICAgcmV0dXJuIGluc2VydE5vZGUoZG9tTm9kZSwgcGF0Y2gsIHJlbmRlck9wdGlvbnMpXG4gICAgICAgIGNhc2UgVlBhdGNoLlZURVhUOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ1BhdGNoKGRvbU5vZGUsIHZOb2RlLCBwYXRjaCwgcmVuZGVyT3B0aW9ucylcbiAgICAgICAgY2FzZSBWUGF0Y2guV0lER0VUOlxuICAgICAgICAgICAgcmV0dXJuIHdpZGdldFBhdGNoKGRvbU5vZGUsIHZOb2RlLCBwYXRjaCwgcmVuZGVyT3B0aW9ucylcbiAgICAgICAgY2FzZSBWUGF0Y2guVk5PREU6XG4gICAgICAgICAgICByZXR1cm4gdk5vZGVQYXRjaChkb21Ob2RlLCB2Tm9kZSwgcGF0Y2gsIHJlbmRlck9wdGlvbnMpXG4gICAgICAgIGNhc2UgVlBhdGNoLk9SREVSOlxuICAgICAgICAgICAgcmVvcmRlckNoaWxkcmVuKGRvbU5vZGUsIHBhdGNoKVxuICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGVcbiAgICAgICAgY2FzZSBWUGF0Y2guUFJPUFM6XG4gICAgICAgICAgICBhcHBseVByb3BlcnRpZXMoZG9tTm9kZSwgcGF0Y2gsIHZOb2RlLnByb3BlcnRpZXMpXG4gICAgICAgICAgICByZXR1cm4gZG9tTm9kZVxuICAgICAgICBjYXNlIFZQYXRjaC5USFVOSzpcbiAgICAgICAgICAgIHJldHVybiByZXBsYWNlUm9vdChkb21Ob2RlLFxuICAgICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMucGF0Y2goZG9tTm9kZSwgcGF0Y2gsIHJlbmRlck9wdGlvbnMpKVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5vZGUoZG9tTm9kZSwgdk5vZGUpIHtcbiAgICB2YXIgcGFyZW50Tm9kZSA9IGRvbU5vZGUucGFyZW50Tm9kZVxuXG4gICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKVxuICAgIH1cblxuICAgIGRlc3Ryb3lXaWRnZXQoZG9tTm9kZSwgdk5vZGUpO1xuXG4gICAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnROb2RlLCB2Tm9kZSwgcmVuZGVyT3B0aW9ucykge1xuICAgIHZhciBuZXdOb2RlID0gcmVuZGVyT3B0aW9ucy5yZW5kZXIodk5vZGUsIHJlbmRlck9wdGlvbnMpXG5cbiAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKG5ld05vZGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudE5vZGVcbn1cblxuZnVuY3Rpb24gc3RyaW5nUGF0Y2goZG9tTm9kZSwgbGVmdFZOb2RlLCB2VGV4dCwgcmVuZGVyT3B0aW9ucykge1xuICAgIHZhciBuZXdOb2RlXG5cbiAgICBpZiAoZG9tTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBkb21Ob2RlLnJlcGxhY2VEYXRhKDAsIGRvbU5vZGUubGVuZ3RoLCB2VGV4dC50ZXh0KVxuICAgICAgICBuZXdOb2RlID0gZG9tTm9kZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwYXJlbnROb2RlID0gZG9tTm9kZS5wYXJlbnROb2RlXG4gICAgICAgIG5ld05vZGUgPSByZW5kZXJPcHRpb25zLnJlbmRlcih2VGV4dCwgcmVuZGVyT3B0aW9ucylcblxuICAgICAgICBpZiAocGFyZW50Tm9kZSAmJiBuZXdOb2RlICE9PSBkb21Ob2RlKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCBkb21Ob2RlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld05vZGVcbn1cblxuZnVuY3Rpb24gd2lkZ2V0UGF0Y2goZG9tTm9kZSwgbGVmdFZOb2RlLCB3aWRnZXQsIHJlbmRlck9wdGlvbnMpIHtcbiAgICB2YXIgdXBkYXRpbmcgPSB1cGRhdGVXaWRnZXQobGVmdFZOb2RlLCB3aWRnZXQpXG4gICAgdmFyIG5ld05vZGVcblxuICAgIGlmICh1cGRhdGluZykge1xuICAgICAgICBuZXdOb2RlID0gd2lkZ2V0LnVwZGF0ZShsZWZ0Vk5vZGUsIGRvbU5vZGUpIHx8IGRvbU5vZGVcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdOb2RlID0gcmVuZGVyT3B0aW9ucy5yZW5kZXIod2lkZ2V0LCByZW5kZXJPcHRpb25zKVxuICAgIH1cblxuICAgIHZhciBwYXJlbnROb2RlID0gZG9tTm9kZS5wYXJlbnROb2RlXG5cbiAgICBpZiAocGFyZW50Tm9kZSAmJiBuZXdOb2RlICE9PSBkb21Ob2RlKSB7XG4gICAgICAgIHBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIGRvbU5vZGUpXG4gICAgfVxuXG4gICAgaWYgKCF1cGRhdGluZykge1xuICAgICAgICBkZXN0cm95V2lkZ2V0KGRvbU5vZGUsIGxlZnRWTm9kZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Tm9kZVxufVxuXG5mdW5jdGlvbiB2Tm9kZVBhdGNoKGRvbU5vZGUsIGxlZnRWTm9kZSwgdk5vZGUsIHJlbmRlck9wdGlvbnMpIHtcbiAgICB2YXIgcGFyZW50Tm9kZSA9IGRvbU5vZGUucGFyZW50Tm9kZVxuICAgIHZhciBuZXdOb2RlID0gcmVuZGVyT3B0aW9ucy5yZW5kZXIodk5vZGUsIHJlbmRlck9wdGlvbnMpXG5cbiAgICBpZiAocGFyZW50Tm9kZSAmJiBuZXdOb2RlICE9PSBkb21Ob2RlKSB7XG4gICAgICAgIHBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIGRvbU5vZGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld05vZGVcbn1cblxuZnVuY3Rpb24gZGVzdHJveVdpZGdldChkb21Ob2RlLCB3KSB7XG4gICAgaWYgKHR5cGVvZiB3LmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIiAmJiBpc1dpZGdldCh3KSkge1xuICAgICAgICB3LmRlc3Ryb3koZG9tTm9kZSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlb3JkZXJDaGlsZHJlbihkb21Ob2RlLCBtb3Zlcykge1xuICAgIHZhciBjaGlsZE5vZGVzID0gZG9tTm9kZS5jaGlsZE5vZGVzXG4gICAgdmFyIGtleU1hcCA9IHt9XG4gICAgdmFyIG5vZGVcbiAgICB2YXIgcmVtb3ZlXG4gICAgdmFyIGluc2VydFxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3Zlcy5yZW1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlbW92ZSA9IG1vdmVzLnJlbW92ZXNbaV1cbiAgICAgICAgbm9kZSA9IGNoaWxkTm9kZXNbcmVtb3ZlLmZyb21dXG4gICAgICAgIGlmIChyZW1vdmUua2V5KSB7XG4gICAgICAgICAgICBrZXlNYXBbcmVtb3ZlLmtleV0gPSBub2RlXG4gICAgICAgIH1cbiAgICAgICAgZG9tTm9kZS5yZW1vdmVDaGlsZChub2RlKVxuICAgIH1cblxuICAgIHZhciBsZW5ndGggPSBjaGlsZE5vZGVzLmxlbmd0aFxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbW92ZXMuaW5zZXJ0cy5sZW5ndGg7IGorKykge1xuICAgICAgICBpbnNlcnQgPSBtb3Zlcy5pbnNlcnRzW2pdXG4gICAgICAgIG5vZGUgPSBrZXlNYXBbaW5zZXJ0LmtleV1cbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgd2VpcmRlc3QgYnVnIGkndmUgZXZlciBzZWVuIGluIHdlYmtpdFxuICAgICAgICBkb21Ob2RlLmluc2VydEJlZm9yZShub2RlLCBpbnNlcnQudG8gPj0gbGVuZ3RoKysgPyBudWxsIDogY2hpbGROb2Rlc1tpbnNlcnQudG9dKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVwbGFjZVJvb3Qob2xkUm9vdCwgbmV3Um9vdCkge1xuICAgIGlmIChvbGRSb290ICYmIG5ld1Jvb3QgJiYgb2xkUm9vdCAhPT0gbmV3Um9vdCAmJiBvbGRSb290LnBhcmVudE5vZGUpIHtcbiAgICAgICAgb2xkUm9vdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdSb290LCBvbGRSb290KVxuICAgIH1cblxuICAgIHJldHVybiBuZXdSb290O1xufVxuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZShcImdsb2JhbC9kb2N1bWVudFwiKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKFwieC1pcy1hcnJheVwiKVxuXG52YXIgcmVuZGVyID0gcmVxdWlyZShcIi4vY3JlYXRlLWVsZW1lbnRcIilcbnZhciBkb21JbmRleCA9IHJlcXVpcmUoXCIuL2RvbS1pbmRleFwiKVxudmFyIHBhdGNoT3AgPSByZXF1aXJlKFwiLi9wYXRjaC1vcFwiKVxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaFxuXG5mdW5jdGlvbiBwYXRjaChyb290Tm9kZSwgcGF0Y2hlcywgcmVuZGVyT3B0aW9ucykge1xuICAgIHJlbmRlck9wdGlvbnMgPSByZW5kZXJPcHRpb25zIHx8IHt9XG4gICAgcmVuZGVyT3B0aW9ucy5wYXRjaCA9IHJlbmRlck9wdGlvbnMucGF0Y2ggJiYgcmVuZGVyT3B0aW9ucy5wYXRjaCAhPT0gcGF0Y2hcbiAgICAgICAgPyByZW5kZXJPcHRpb25zLnBhdGNoXG4gICAgICAgIDogcGF0Y2hSZWN1cnNpdmVcbiAgICByZW5kZXJPcHRpb25zLnJlbmRlciA9IHJlbmRlck9wdGlvbnMucmVuZGVyIHx8IHJlbmRlclxuXG4gICAgcmV0dXJuIHJlbmRlck9wdGlvbnMucGF0Y2gocm9vdE5vZGUsIHBhdGNoZXMsIHJlbmRlck9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIHBhdGNoUmVjdXJzaXZlKHJvb3ROb2RlLCBwYXRjaGVzLCByZW5kZXJPcHRpb25zKSB7XG4gICAgdmFyIGluZGljZXMgPSBwYXRjaEluZGljZXMocGF0Y2hlcylcblxuICAgIGlmIChpbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcm9vdE5vZGVcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSBkb21JbmRleChyb290Tm9kZSwgcGF0Y2hlcy5hLCBpbmRpY2VzKVxuICAgIHZhciBvd25lckRvY3VtZW50ID0gcm9vdE5vZGUub3duZXJEb2N1bWVudFxuXG4gICAgaWYgKCFyZW5kZXJPcHRpb25zLmRvY3VtZW50ICYmIG93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJlbmRlck9wdGlvbnMuZG9jdW1lbnQgPSBvd25lckRvY3VtZW50XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlSW5kZXggPSBpbmRpY2VzW2ldXG4gICAgICAgIHJvb3ROb2RlID0gYXBwbHlQYXRjaChyb290Tm9kZSxcbiAgICAgICAgICAgIGluZGV4W25vZGVJbmRleF0sXG4gICAgICAgICAgICBwYXRjaGVzW25vZGVJbmRleF0sXG4gICAgICAgICAgICByZW5kZXJPcHRpb25zKVxuICAgIH1cblxuICAgIHJldHVybiByb290Tm9kZVxufVxuXG5mdW5jdGlvbiBhcHBseVBhdGNoKHJvb3ROb2RlLCBkb21Ob2RlLCBwYXRjaExpc3QsIHJlbmRlck9wdGlvbnMpIHtcbiAgICBpZiAoIWRvbU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHJvb3ROb2RlXG4gICAgfVxuXG4gICAgdmFyIG5ld05vZGVcblxuICAgIGlmIChpc0FycmF5KHBhdGNoTGlzdCkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRjaExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5ld05vZGUgPSBwYXRjaE9wKHBhdGNoTGlzdFtpXSwgZG9tTm9kZSwgcmVuZGVyT3B0aW9ucylcblxuICAgICAgICAgICAgaWYgKGRvbU5vZGUgPT09IHJvb3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgcm9vdE5vZGUgPSBuZXdOb2RlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdOb2RlID0gcGF0Y2hPcChwYXRjaExpc3QsIGRvbU5vZGUsIHJlbmRlck9wdGlvbnMpXG5cbiAgICAgICAgaWYgKGRvbU5vZGUgPT09IHJvb3ROb2RlKSB7XG4gICAgICAgICAgICByb290Tm9kZSA9IG5ld05vZGVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByb290Tm9kZVxufVxuXG5mdW5jdGlvbiBwYXRjaEluZGljZXMocGF0Y2hlcykge1xuICAgIHZhciBpbmRpY2VzID0gW11cblxuICAgIGZvciAodmFyIGtleSBpbiBwYXRjaGVzKSB7XG4gICAgICAgIGlmIChrZXkgIT09IFwiYVwiKSB7XG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goTnVtYmVyKGtleSkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5kaWNlc1xufVxuIiwidmFyIGlzV2lkZ2V0ID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXdpZGdldC5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZVdpZGdldFxuXG5mdW5jdGlvbiB1cGRhdGVXaWRnZXQoYSwgYikge1xuICAgIGlmIChpc1dpZGdldChhKSAmJiBpc1dpZGdldChiKSkge1xuICAgICAgICBpZiAoXCJuYW1lXCIgaW4gYSAmJiBcIm5hbWVcIiBpbiBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5pZCA9PT0gYi5pZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGEuaW5pdCA9PT0gYi5pbml0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2Vcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2U3RvcmUgPSByZXF1aXJlKCdldi1zdG9yZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2SG9vaztcblxuZnVuY3Rpb24gRXZIb29rKHZhbHVlKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEV2SG9vaykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFdkhvb2sodmFsdWUpO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbn1cblxuRXZIb29rLnByb3RvdHlwZS5ob29rID0gZnVuY3Rpb24gKG5vZGUsIHByb3BlcnR5TmFtZSkge1xuICAgIHZhciBlcyA9IEV2U3RvcmUobm9kZSk7XG4gICAgdmFyIHByb3BOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cigzKTtcblxuICAgIGVzW3Byb3BOYW1lXSA9IHRoaXMudmFsdWU7XG59O1xuXG5Fdkhvb2sucHJvdG90eXBlLnVuaG9vayA9IGZ1bmN0aW9uKG5vZGUsIHByb3BlcnR5TmFtZSkge1xuICAgIHZhciBlcyA9IEV2U3RvcmUobm9kZSk7XG4gICAgdmFyIHByb3BOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cigzKTtcblxuICAgIGVzW3Byb3BOYW1lXSA9IHVuZGVmaW5lZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gU29mdFNldEhvb2s7XG5cbmZ1bmN0aW9uIFNvZnRTZXRIb29rKHZhbHVlKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNvZnRTZXRIb29rKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNvZnRTZXRIb29rKHZhbHVlKTtcbiAgICB9XG5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cblNvZnRTZXRIb29rLnByb3RvdHlwZS5ob29rID0gZnVuY3Rpb24gKG5vZGUsIHByb3BlcnR5TmFtZSkge1xuICAgIGlmIChub2RlW3Byb3BlcnR5TmFtZV0gIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgbm9kZVtwcm9wZXJ0eU5hbWVdID0gdGhpcy52YWx1ZTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ3gtaXMtYXJyYXknKTtcblxudmFyIFZOb2RlID0gcmVxdWlyZSgnLi4vdm5vZGUvdm5vZGUuanMnKTtcbnZhciBWVGV4dCA9IHJlcXVpcmUoJy4uL3Zub2RlL3Z0ZXh0LmpzJyk7XG52YXIgaXNWTm9kZSA9IHJlcXVpcmUoJy4uL3Zub2RlL2lzLXZub2RlJyk7XG52YXIgaXNWVGV4dCA9IHJlcXVpcmUoJy4uL3Zub2RlL2lzLXZ0ZXh0Jyk7XG52YXIgaXNXaWRnZXQgPSByZXF1aXJlKCcuLi92bm9kZS9pcy13aWRnZXQnKTtcbnZhciBpc0hvb2sgPSByZXF1aXJlKCcuLi92bm9kZS9pcy12aG9vaycpO1xudmFyIGlzVlRodW5rID0gcmVxdWlyZSgnLi4vdm5vZGUvaXMtdGh1bmsnKTtcblxudmFyIHBhcnNlVGFnID0gcmVxdWlyZSgnLi9wYXJzZS10YWcuanMnKTtcbnZhciBzb2Z0U2V0SG9vayA9IHJlcXVpcmUoJy4vaG9va3Mvc29mdC1zZXQtaG9vay5qcycpO1xudmFyIGV2SG9vayA9IHJlcXVpcmUoJy4vaG9va3MvZXYtaG9vay5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGg7XG5cbmZ1bmN0aW9uIGgodGFnTmFtZSwgcHJvcGVydGllcywgY2hpbGRyZW4pIHtcbiAgICB2YXIgY2hpbGROb2RlcyA9IFtdO1xuICAgIHZhciB0YWcsIHByb3BzLCBrZXksIG5hbWVzcGFjZTtcblxuICAgIGlmICghY2hpbGRyZW4gJiYgaXNDaGlsZHJlbihwcm9wZXJ0aWVzKSkge1xuICAgICAgICBjaGlsZHJlbiA9IHByb3BlcnRpZXM7XG4gICAgICAgIHByb3BzID0ge307XG4gICAgfVxuXG4gICAgcHJvcHMgPSBwcm9wcyB8fCBwcm9wZXJ0aWVzIHx8IHt9O1xuICAgIHRhZyA9IHBhcnNlVGFnKHRhZ05hbWUsIHByb3BzKTtcblxuICAgIC8vIHN1cHBvcnQga2V5c1xuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eSgna2V5JykpIHtcbiAgICAgICAga2V5ID0gcHJvcHMua2V5O1xuICAgICAgICBwcm9wcy5rZXkgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydCBuYW1lc3BhY2VcbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoJ25hbWVzcGFjZScpKSB7XG4gICAgICAgIG5hbWVzcGFjZSA9IHByb3BzLm5hbWVzcGFjZTtcbiAgICAgICAgcHJvcHMubmFtZXNwYWNlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGZpeCBjdXJzb3IgYnVnXG4gICAgaWYgKHRhZyA9PT0gJ0lOUFVUJyAmJlxuICAgICAgICAhbmFtZXNwYWNlICYmXG4gICAgICAgIHByb3BzLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmXG4gICAgICAgIHByb3BzLnZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgIWlzSG9vayhwcm9wcy52YWx1ZSlcbiAgICApIHtcbiAgICAgICAgcHJvcHMudmFsdWUgPSBzb2Z0U2V0SG9vayhwcm9wcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtUHJvcGVydGllcyhwcm9wcyk7XG5cbiAgICBpZiAoY2hpbGRyZW4gIT09IHVuZGVmaW5lZCAmJiBjaGlsZHJlbiAhPT0gbnVsbCkge1xuICAgICAgICBhZGRDaGlsZChjaGlsZHJlbiwgY2hpbGROb2RlcywgdGFnLCBwcm9wcyk7XG4gICAgfVxuXG5cbiAgICByZXR1cm4gbmV3IFZOb2RlKHRhZywgcHJvcHMsIGNoaWxkTm9kZXMsIGtleSwgbmFtZXNwYWNlKTtcbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGQoYywgY2hpbGROb2RlcywgdGFnLCBwcm9wcykge1xuICAgIGlmICh0eXBlb2YgYyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY2hpbGROb2Rlcy5wdXNoKG5ldyBWVGV4dChjKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY2hpbGROb2Rlcy5wdXNoKG5ldyBWVGV4dChTdHJpbmcoYykpKTtcbiAgICB9IGVsc2UgaWYgKGlzQ2hpbGQoYykpIHtcbiAgICAgICAgY2hpbGROb2Rlcy5wdXNoKGMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFkZENoaWxkKGNbaV0sIGNoaWxkTm9kZXMsIHRhZywgcHJvcHMpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChjID09PSBudWxsIHx8IGMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgVW5leHBlY3RlZFZpcnR1YWxFbGVtZW50KHtcbiAgICAgICAgICAgIGZvcmVpZ25PYmplY3Q6IGMsXG4gICAgICAgICAgICBwYXJlbnRWbm9kZToge1xuICAgICAgICAgICAgICAgIHRhZ05hbWU6IHRhZyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybVByb3BlcnRpZXMocHJvcHMpIHtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG5cbiAgICAgICAgICAgIGlmIChpc0hvb2sodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdWJzdHIoMCwgMykgPT09ICdldi0nKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIGV2LWZvbyBzdXBwb3J0XG4gICAgICAgICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZXZIb29rKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNDaGlsZCh4KSB7XG4gICAgcmV0dXJuIGlzVk5vZGUoeCkgfHwgaXNWVGV4dCh4KSB8fCBpc1dpZGdldCh4KSB8fCBpc1ZUaHVuayh4KTtcbn1cblxuZnVuY3Rpb24gaXNDaGlsZHJlbih4KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnc3RyaW5nJyB8fCBpc0FycmF5KHgpIHx8IGlzQ2hpbGQoeCk7XG59XG5cbmZ1bmN0aW9uIFVuZXhwZWN0ZWRWaXJ0dWFsRWxlbWVudChkYXRhKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuXG4gICAgZXJyLnR5cGUgPSAndmlydHVhbC1oeXBlcnNjcmlwdC51bmV4cGVjdGVkLnZpcnR1YWwtZWxlbWVudCc7XG4gICAgZXJyLm1lc3NhZ2UgPSAnVW5leHBlY3RlZCB2aXJ0dWFsIGNoaWxkIHBhc3NlZCB0byBoKCkuXFxuJyArXG4gICAgICAgICdFeHBlY3RlZCBhIFZOb2RlIC8gVnRodW5rIC8gVldpZGdldCAvIHN0cmluZyBidXQ6XFxuJyArXG4gICAgICAgICdnb3Q6XFxuJyArXG4gICAgICAgIGVycm9yU3RyaW5nKGRhdGEuZm9yZWlnbk9iamVjdCkgK1xuICAgICAgICAnLlxcbicgK1xuICAgICAgICAnVGhlIHBhcmVudCB2bm9kZSBpczpcXG4nICtcbiAgICAgICAgZXJyb3JTdHJpbmcoZGF0YS5wYXJlbnRWbm9kZSlcbiAgICAgICAgJ1xcbicgK1xuICAgICAgICAnU3VnZ2VzdGVkIGZpeDogY2hhbmdlIHlvdXIgYGgoLi4uLCBbIC4uLiBdKWAgY2FsbHNpdGUuJztcbiAgICBlcnIuZm9yZWlnbk9iamVjdCA9IGRhdGEuZm9yZWlnbk9iamVjdDtcbiAgICBlcnIucGFyZW50Vm5vZGUgPSBkYXRhLnBhcmVudFZub2RlO1xuXG4gICAgcmV0dXJuIGVycjtcbn1cblxuZnVuY3Rpb24gZXJyb3JTdHJpbmcob2JqKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgJyAgICAnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzcGxpdCA9IHJlcXVpcmUoJ2Jyb3dzZXItc3BsaXQnKTtcblxudmFyIGNsYXNzSWRTcGxpdCA9IC8oW1xcLiNdP1thLXpBLVowLTlcXHUwMDdGLVxcdUZGRkZfOi1dKykvO1xudmFyIG5vdENsYXNzSWQgPSAvXlxcLnwjLztcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVRhZztcblxuZnVuY3Rpb24gcGFyc2VUYWcodGFnLCBwcm9wcykge1xuICAgIGlmICghdGFnKSB7XG4gICAgICAgIHJldHVybiAnRElWJztcbiAgICB9XG5cbiAgICB2YXIgbm9JZCA9ICEocHJvcHMuaGFzT3duUHJvcGVydHkoJ2lkJykpO1xuXG4gICAgdmFyIHRhZ1BhcnRzID0gc3BsaXQodGFnLCBjbGFzc0lkU3BsaXQpO1xuICAgIHZhciB0YWdOYW1lID0gbnVsbDtcblxuICAgIGlmIChub3RDbGFzc0lkLnRlc3QodGFnUGFydHNbMV0pKSB7XG4gICAgICAgIHRhZ05hbWUgPSAnRElWJztcbiAgICB9XG5cbiAgICB2YXIgY2xhc3NlcywgcGFydCwgdHlwZSwgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0YWdQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJ0ID0gdGFnUGFydHNbaV07XG5cbiAgICAgICAgaWYgKCFwYXJ0KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGUgPSBwYXJ0LmNoYXJBdCgwKTtcblxuICAgICAgICBpZiAoIXRhZ05hbWUpIHtcbiAgICAgICAgICAgIHRhZ05hbWUgPSBwYXJ0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICcuJykge1xuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgW107XG4gICAgICAgICAgICBjbGFzc2VzLnB1c2gocGFydC5zdWJzdHJpbmcoMSwgcGFydC5sZW5ndGgpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnIycgJiYgbm9JZCkge1xuICAgICAgICAgICAgcHJvcHMuaWQgPSBwYXJ0LnN1YnN0cmluZygxLCBwYXJ0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBpZiAocHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBjbGFzc2VzLnB1c2gocHJvcHMuY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3BzLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9wcy5uYW1lc3BhY2UgPyB0YWdOYW1lIDogdGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xufVxuIiwidmFyIGlzVk5vZGUgPSByZXF1aXJlKFwiLi9pcy12bm9kZVwiKVxudmFyIGlzVlRleHQgPSByZXF1aXJlKFwiLi9pcy12dGV4dFwiKVxudmFyIGlzV2lkZ2V0ID0gcmVxdWlyZShcIi4vaXMtd2lkZ2V0XCIpXG52YXIgaXNUaHVuayA9IHJlcXVpcmUoXCIuL2lzLXRodW5rXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gaGFuZGxlVGh1bmtcblxuZnVuY3Rpb24gaGFuZGxlVGh1bmsoYSwgYikge1xuICAgIHZhciByZW5kZXJlZEEgPSBhXG4gICAgdmFyIHJlbmRlcmVkQiA9IGJcblxuICAgIGlmIChpc1RodW5rKGIpKSB7XG4gICAgICAgIHJlbmRlcmVkQiA9IHJlbmRlclRodW5rKGIsIGEpXG4gICAgfVxuXG4gICAgaWYgKGlzVGh1bmsoYSkpIHtcbiAgICAgICAgcmVuZGVyZWRBID0gcmVuZGVyVGh1bmsoYSwgbnVsbClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhOiByZW5kZXJlZEEsXG4gICAgICAgIGI6IHJlbmRlcmVkQlxuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyVGh1bmsodGh1bmssIHByZXZpb3VzKSB7XG4gICAgdmFyIHJlbmRlcmVkVGh1bmsgPSB0aHVuay52bm9kZVxuXG4gICAgaWYgKCFyZW5kZXJlZFRodW5rKSB7XG4gICAgICAgIHJlbmRlcmVkVGh1bmsgPSB0aHVuay52bm9kZSA9IHRodW5rLnJlbmRlcihwcmV2aW91cylcbiAgICB9XG5cbiAgICBpZiAoIShpc1ZOb2RlKHJlbmRlcmVkVGh1bmspIHx8XG4gICAgICAgICAgICBpc1ZUZXh0KHJlbmRlcmVkVGh1bmspIHx8XG4gICAgICAgICAgICBpc1dpZGdldChyZW5kZXJlZFRodW5rKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGh1bmsgZGlkIG5vdCByZXR1cm4gYSB2YWxpZCBub2RlXCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJlZFRodW5rXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzVGh1bmtcclxuXHJcbmZ1bmN0aW9uIGlzVGh1bmsodCkge1xyXG4gICAgcmV0dXJuIHQgJiYgdC50eXBlID09PSBcIlRodW5rXCJcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzSG9va1xuXG5mdW5jdGlvbiBpc0hvb2soaG9vaykge1xuICAgIHJldHVybiBob29rICYmXG4gICAgICAodHlwZW9mIGhvb2suaG9vayA9PT0gXCJmdW5jdGlvblwiICYmICFob29rLmhhc093blByb3BlcnR5KFwiaG9va1wiKSB8fFxuICAgICAgIHR5cGVvZiBob29rLnVuaG9vayA9PT0gXCJmdW5jdGlvblwiICYmICFob29rLmhhc093blByb3BlcnR5KFwidW5ob29rXCIpKVxufVxuIiwidmFyIHZlcnNpb24gPSByZXF1aXJlKFwiLi92ZXJzaW9uXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gaXNWaXJ0dWFsTm9kZVxuXG5mdW5jdGlvbiBpc1ZpcnR1YWxOb2RlKHgpIHtcbiAgICByZXR1cm4geCAmJiB4LnR5cGUgPT09IFwiVmlydHVhbE5vZGVcIiAmJiB4LnZlcnNpb24gPT09IHZlcnNpb25cbn1cbiIsInZhciB2ZXJzaW9uID0gcmVxdWlyZShcIi4vdmVyc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVmlydHVhbFRleHRcblxuZnVuY3Rpb24gaXNWaXJ0dWFsVGV4dCh4KSB7XG4gICAgcmV0dXJuIHggJiYgeC50eXBlID09PSBcIlZpcnR1YWxUZXh0XCIgJiYgeC52ZXJzaW9uID09PSB2ZXJzaW9uXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzV2lkZ2V0XG5cbmZ1bmN0aW9uIGlzV2lkZ2V0KHcpIHtcbiAgICByZXR1cm4gdyAmJiB3LnR5cGUgPT09IFwiV2lkZ2V0XCJcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIyXCJcbiIsInZhciB2ZXJzaW9uID0gcmVxdWlyZShcIi4vdmVyc2lvblwiKVxudmFyIGlzVk5vZGUgPSByZXF1aXJlKFwiLi9pcy12bm9kZVwiKVxudmFyIGlzV2lkZ2V0ID0gcmVxdWlyZShcIi4vaXMtd2lkZ2V0XCIpXG52YXIgaXNUaHVuayA9IHJlcXVpcmUoXCIuL2lzLXRodW5rXCIpXG52YXIgaXNWSG9vayA9IHJlcXVpcmUoXCIuL2lzLXZob29rXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gVmlydHVhbE5vZGVcblxudmFyIG5vUHJvcGVydGllcyA9IHt9XG52YXIgbm9DaGlsZHJlbiA9IFtdXG5cbmZ1bmN0aW9uIFZpcnR1YWxOb2RlKHRhZ05hbWUsIHByb3BlcnRpZXMsIGNoaWxkcmVuLCBrZXksIG5hbWVzcGFjZSkge1xuICAgIHRoaXMudGFnTmFtZSA9IHRhZ05hbWVcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IG5vUHJvcGVydGllc1xuICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbiB8fCBub0NoaWxkcmVuXG4gICAgdGhpcy5rZXkgPSBrZXkgIT0gbnVsbCA/IFN0cmluZyhrZXkpIDogdW5kZWZpbmVkXG4gICAgdGhpcy5uYW1lc3BhY2UgPSAodHlwZW9mIG5hbWVzcGFjZSA9PT0gXCJzdHJpbmdcIikgPyBuYW1lc3BhY2UgOiBudWxsXG5cbiAgICB2YXIgY291bnQgPSAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB8fCAwXG4gICAgdmFyIGRlc2NlbmRhbnRzID0gMFxuICAgIHZhciBoYXNXaWRnZXRzID0gZmFsc2VcbiAgICB2YXIgaGFzVGh1bmtzID0gZmFsc2VcbiAgICB2YXIgZGVzY2VuZGFudEhvb2tzID0gZmFsc2VcbiAgICB2YXIgaG9va3NcblxuICAgIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXVxuICAgICAgICAgICAgaWYgKGlzVkhvb2socHJvcGVydHkpICYmIHByb3BlcnR5LnVuaG9vaykge1xuICAgICAgICAgICAgICAgIGlmICghaG9va3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaG9va3MgPSB7fVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGhvb2tzW3Byb3BOYW1lXSA9IHByb3BlcnR5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKGlzVk5vZGUoY2hpbGQpKSB7XG4gICAgICAgICAgICBkZXNjZW5kYW50cyArPSBjaGlsZC5jb3VudCB8fCAwXG5cbiAgICAgICAgICAgIGlmICghaGFzV2lkZ2V0cyAmJiBjaGlsZC5oYXNXaWRnZXRzKSB7XG4gICAgICAgICAgICAgICAgaGFzV2lkZ2V0cyA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFoYXNUaHVua3MgJiYgY2hpbGQuaGFzVGh1bmtzKSB7XG4gICAgICAgICAgICAgICAgaGFzVGh1bmtzID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRlc2NlbmRhbnRIb29rcyAmJiAoY2hpbGQuaG9va3MgfHwgY2hpbGQuZGVzY2VuZGFudEhvb2tzKSkge1xuICAgICAgICAgICAgICAgIGRlc2NlbmRhbnRIb29rcyA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghaGFzV2lkZ2V0cyAmJiBpc1dpZGdldChjaGlsZCkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hpbGQuZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaGFzV2lkZ2V0cyA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghaGFzVGh1bmtzICYmIGlzVGh1bmsoY2hpbGQpKSB7XG4gICAgICAgICAgICBoYXNUaHVua3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb3VudCA9IGNvdW50ICsgZGVzY2VuZGFudHNcbiAgICB0aGlzLmhhc1dpZGdldHMgPSBoYXNXaWRnZXRzXG4gICAgdGhpcy5oYXNUaHVua3MgPSBoYXNUaHVua3NcbiAgICB0aGlzLmhvb2tzID0gaG9va3NcbiAgICB0aGlzLmRlc2NlbmRhbnRIb29rcyA9IGRlc2NlbmRhbnRIb29rc1xufVxuXG5WaXJ0dWFsTm9kZS5wcm90b3R5cGUudmVyc2lvbiA9IHZlcnNpb25cblZpcnR1YWxOb2RlLnByb3RvdHlwZS50eXBlID0gXCJWaXJ0dWFsTm9kZVwiXG4iLCJ2YXIgdmVyc2lvbiA9IHJlcXVpcmUoXCIuL3ZlcnNpb25cIilcblxuVmlydHVhbFBhdGNoLk5PTkUgPSAwXG5WaXJ0dWFsUGF0Y2guVlRFWFQgPSAxXG5WaXJ0dWFsUGF0Y2guVk5PREUgPSAyXG5WaXJ0dWFsUGF0Y2guV0lER0VUID0gM1xuVmlydHVhbFBhdGNoLlBST1BTID0gNFxuVmlydHVhbFBhdGNoLk9SREVSID0gNVxuVmlydHVhbFBhdGNoLklOU0VSVCA9IDZcblZpcnR1YWxQYXRjaC5SRU1PVkUgPSA3XG5WaXJ0dWFsUGF0Y2guVEhVTksgPSA4XG5cbm1vZHVsZS5leHBvcnRzID0gVmlydHVhbFBhdGNoXG5cbmZ1bmN0aW9uIFZpcnR1YWxQYXRjaCh0eXBlLCB2Tm9kZSwgcGF0Y2gpIHtcbiAgICB0aGlzLnR5cGUgPSBOdW1iZXIodHlwZSlcbiAgICB0aGlzLnZOb2RlID0gdk5vZGVcbiAgICB0aGlzLnBhdGNoID0gcGF0Y2hcbn1cblxuVmlydHVhbFBhdGNoLnByb3RvdHlwZS52ZXJzaW9uID0gdmVyc2lvblxuVmlydHVhbFBhdGNoLnByb3RvdHlwZS50eXBlID0gXCJWaXJ0dWFsUGF0Y2hcIlxuIiwidmFyIHZlcnNpb24gPSByZXF1aXJlKFwiLi92ZXJzaW9uXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gVmlydHVhbFRleHRcblxuZnVuY3Rpb24gVmlydHVhbFRleHQodGV4dCkge1xuICAgIHRoaXMudGV4dCA9IFN0cmluZyh0ZXh0KVxufVxuXG5WaXJ0dWFsVGV4dC5wcm90b3R5cGUudmVyc2lvbiA9IHZlcnNpb25cblZpcnR1YWxUZXh0LnByb3RvdHlwZS50eXBlID0gXCJWaXJ0dWFsVGV4dFwiXG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKFwiaXMtb2JqZWN0XCIpXG52YXIgaXNIb29rID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXZob29rXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZGlmZlByb3BzXG5cbmZ1bmN0aW9uIGRpZmZQcm9wcyhhLCBiKSB7XG4gICAgdmFyIGRpZmZcblxuICAgIGZvciAodmFyIGFLZXkgaW4gYSkge1xuICAgICAgICBpZiAoIShhS2V5IGluIGIpKSB7XG4gICAgICAgICAgICBkaWZmID0gZGlmZiB8fCB7fVxuICAgICAgICAgICAgZGlmZlthS2V5XSA9IHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFWYWx1ZSA9IGFbYUtleV1cbiAgICAgICAgdmFyIGJWYWx1ZSA9IGJbYUtleV1cblxuICAgICAgICBpZiAoYVZhbHVlID09PSBiVmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoYVZhbHVlKSAmJiBpc09iamVjdChiVmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoZ2V0UHJvdG90eXBlKGJWYWx1ZSkgIT09IGdldFByb3RvdHlwZShhVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgZGlmZiA9IGRpZmYgfHwge31cbiAgICAgICAgICAgICAgICBkaWZmW2FLZXldID0gYlZhbHVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzSG9vayhiVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgIGRpZmYgPSBkaWZmIHx8IHt9XG4gICAgICAgICAgICAgICAgIGRpZmZbYUtleV0gPSBiVmFsdWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG9iamVjdERpZmYgPSBkaWZmUHJvcHMoYVZhbHVlLCBiVmFsdWUpXG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdERpZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA9IGRpZmYgfHwge31cbiAgICAgICAgICAgICAgICAgICAgZGlmZlthS2V5XSA9IG9iamVjdERpZmZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaWZmID0gZGlmZiB8fCB7fVxuICAgICAgICAgICAgZGlmZlthS2V5XSA9IGJWYWx1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgYktleSBpbiBiKSB7XG4gICAgICAgIGlmICghKGJLZXkgaW4gYSkpIHtcbiAgICAgICAgICAgIGRpZmYgPSBkaWZmIHx8IHt9XG4gICAgICAgICAgICBkaWZmW2JLZXldID0gYltiS2V5XVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpZmZcbn1cblxuZnVuY3Rpb24gZ2V0UHJvdG90eXBlKHZhbHVlKSB7XG4gIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKVxuICB9IGVsc2UgaWYgKHZhbHVlLl9fcHJvdG9fXykge1xuICAgIHJldHVybiB2YWx1ZS5fX3Byb3RvX19cbiAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgfVxufVxuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKFwieC1pcy1hcnJheVwiKVxuXG52YXIgVlBhdGNoID0gcmVxdWlyZShcIi4uL3Zub2RlL3ZwYXRjaFwiKVxudmFyIGlzVk5vZGUgPSByZXF1aXJlKFwiLi4vdm5vZGUvaXMtdm5vZGVcIilcbnZhciBpc1ZUZXh0ID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXZ0ZXh0XCIpXG52YXIgaXNXaWRnZXQgPSByZXF1aXJlKFwiLi4vdm5vZGUvaXMtd2lkZ2V0XCIpXG52YXIgaXNUaHVuayA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy10aHVua1wiKVxudmFyIGhhbmRsZVRodW5rID0gcmVxdWlyZShcIi4uL3Zub2RlL2hhbmRsZS10aHVua1wiKVxuXG52YXIgZGlmZlByb3BzID0gcmVxdWlyZShcIi4vZGlmZi1wcm9wc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmZcblxuZnVuY3Rpb24gZGlmZihhLCBiKSB7XG4gICAgdmFyIHBhdGNoID0geyBhOiBhIH1cbiAgICB3YWxrKGEsIGIsIHBhdGNoLCAwKVxuICAgIHJldHVybiBwYXRjaFxufVxuXG5mdW5jdGlvbiB3YWxrKGEsIGIsIHBhdGNoLCBpbmRleCkge1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHZhciBhcHBseSA9IHBhdGNoW2luZGV4XVxuICAgIHZhciBhcHBseUNsZWFyID0gZmFsc2VcblxuICAgIGlmIChpc1RodW5rKGEpIHx8IGlzVGh1bmsoYikpIHtcbiAgICAgICAgdGh1bmtzKGEsIGIsIHBhdGNoLCBpbmRleClcbiAgICB9IGVsc2UgaWYgKGIgPT0gbnVsbCkge1xuXG4gICAgICAgIC8vIElmIGEgaXMgYSB3aWRnZXQgd2Ugd2lsbCBhZGQgYSByZW1vdmUgcGF0Y2ggZm9yIGl0XG4gICAgICAgIC8vIE90aGVyd2lzZSBhbnkgY2hpbGQgd2lkZ2V0cy9ob29rcyBtdXN0IGJlIGRlc3Ryb3llZC5cbiAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBhZGRpbmcgdHdvIHJlbW92ZSBwYXRjaGVzIGZvciBhIHdpZGdldC5cbiAgICAgICAgaWYgKCFpc1dpZGdldChhKSkge1xuICAgICAgICAgICAgY2xlYXJTdGF0ZShhLCBwYXRjaCwgaW5kZXgpXG4gICAgICAgICAgICBhcHBseSA9IHBhdGNoW2luZGV4XVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkgPSBhcHBlbmRQYXRjaChhcHBseSwgbmV3IFZQYXRjaChWUGF0Y2guUkVNT1ZFLCBhLCBiKSlcbiAgICB9IGVsc2UgaWYgKGlzVk5vZGUoYikpIHtcbiAgICAgICAgaWYgKGlzVk5vZGUoYSkpIHtcbiAgICAgICAgICAgIGlmIChhLnRhZ05hbWUgPT09IGIudGFnTmFtZSAmJlxuICAgICAgICAgICAgICAgIGEubmFtZXNwYWNlID09PSBiLm5hbWVzcGFjZSAmJlxuICAgICAgICAgICAgICAgIGEua2V5ID09PSBiLmtleSkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wc1BhdGNoID0gZGlmZlByb3BzKGEucHJvcGVydGllcywgYi5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgICAgIGlmIChwcm9wc1BhdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVlBhdGNoKFZQYXRjaC5QUk9QUywgYSwgcHJvcHNQYXRjaCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFwcGx5ID0gZGlmZkNoaWxkcmVuKGEsIGIsIHBhdGNoLCBhcHBseSwgaW5kZXgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goVlBhdGNoLlZOT0RFLCBhLCBiKSlcbiAgICAgICAgICAgICAgICBhcHBseUNsZWFyID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwbHkgPSBhcHBlbmRQYXRjaChhcHBseSwgbmV3IFZQYXRjaChWUGF0Y2guVk5PREUsIGEsIGIpKVxuICAgICAgICAgICAgYXBwbHlDbGVhciA9IHRydWVcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNWVGV4dChiKSkge1xuICAgICAgICBpZiAoIWlzVlRleHQoYSkpIHtcbiAgICAgICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goVlBhdGNoLlZURVhULCBhLCBiKSlcbiAgICAgICAgICAgIGFwcGx5Q2xlYXIgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoYS50ZXh0ICE9PSBiLnRleHQpIHtcbiAgICAgICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goVlBhdGNoLlZURVhULCBhLCBiKSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNXaWRnZXQoYikpIHtcbiAgICAgICAgaWYgKCFpc1dpZGdldChhKSkge1xuICAgICAgICAgICAgYXBwbHlDbGVhciA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goVlBhdGNoLldJREdFVCwgYSwgYikpXG4gICAgfVxuXG4gICAgaWYgKGFwcGx5KSB7XG4gICAgICAgIHBhdGNoW2luZGV4XSA9IGFwcGx5XG4gICAgfVxuXG4gICAgaWYgKGFwcGx5Q2xlYXIpIHtcbiAgICAgICAgY2xlYXJTdGF0ZShhLCBwYXRjaCwgaW5kZXgpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBkaWZmQ2hpbGRyZW4oYSwgYiwgcGF0Y2gsIGFwcGx5LCBpbmRleCkge1xuICAgIHZhciBhQ2hpbGRyZW4gPSBhLmNoaWxkcmVuXG4gICAgdmFyIG9yZGVyZWRTZXQgPSByZW9yZGVyKGFDaGlsZHJlbiwgYi5jaGlsZHJlbilcbiAgICB2YXIgYkNoaWxkcmVuID0gb3JkZXJlZFNldC5jaGlsZHJlblxuXG4gICAgdmFyIGFMZW4gPSBhQ2hpbGRyZW4ubGVuZ3RoXG4gICAgdmFyIGJMZW4gPSBiQ2hpbGRyZW4ubGVuZ3RoXG4gICAgdmFyIGxlbiA9IGFMZW4gPiBiTGVuID8gYUxlbiA6IGJMZW5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGxlZnROb2RlID0gYUNoaWxkcmVuW2ldXG4gICAgICAgIHZhciByaWdodE5vZGUgPSBiQ2hpbGRyZW5baV1cbiAgICAgICAgaW5kZXggKz0gMVxuXG4gICAgICAgIGlmICghbGVmdE5vZGUpIHtcbiAgICAgICAgICAgIGlmIChyaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBFeGNlc3Mgbm9kZXMgaW4gYiBuZWVkIHRvIGJlIGFkZGVkXG4gICAgICAgICAgICAgICAgYXBwbHkgPSBhcHBlbmRQYXRjaChhcHBseSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZQYXRjaChWUGF0Y2guSU5TRVJULCBudWxsLCByaWdodE5vZGUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2FsayhsZWZ0Tm9kZSwgcmlnaHROb2RlLCBwYXRjaCwgaW5kZXgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNWTm9kZShsZWZ0Tm9kZSkgJiYgbGVmdE5vZGUuY291bnQpIHtcbiAgICAgICAgICAgIGluZGV4ICs9IGxlZnROb2RlLmNvdW50XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3JkZXJlZFNldC5tb3Zlcykge1xuICAgICAgICAvLyBSZW9yZGVyIG5vZGVzIGxhc3RcbiAgICAgICAgYXBwbHkgPSBhcHBlbmRQYXRjaChhcHBseSwgbmV3IFZQYXRjaChcbiAgICAgICAgICAgIFZQYXRjaC5PUkRFUixcbiAgICAgICAgICAgIGEsXG4gICAgICAgICAgICBvcmRlcmVkU2V0Lm1vdmVzXG4gICAgICAgICkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFwcGx5XG59XG5cbmZ1bmN0aW9uIGNsZWFyU3RhdGUodk5vZGUsIHBhdGNoLCBpbmRleCkge1xuICAgIC8vIFRPRE86IE1ha2UgdGhpcyBhIHNpbmdsZSB3YWxrLCBub3QgdHdvXG4gICAgdW5ob29rKHZOb2RlLCBwYXRjaCwgaW5kZXgpXG4gICAgZGVzdHJveVdpZGdldHModk5vZGUsIHBhdGNoLCBpbmRleClcbn1cblxuLy8gUGF0Y2ggcmVjb3JkcyBmb3IgYWxsIGRlc3Ryb3llZCB3aWRnZXRzIG11c3QgYmUgYWRkZWQgYmVjYXVzZSB3ZSBuZWVkXG4vLyBhIERPTSBub2RlIHJlZmVyZW5jZSBmb3IgdGhlIGRlc3Ryb3kgZnVuY3Rpb25cbmZ1bmN0aW9uIGRlc3Ryb3lXaWRnZXRzKHZOb2RlLCBwYXRjaCwgaW5kZXgpIHtcbiAgICBpZiAoaXNXaWRnZXQodk5vZGUpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygdk5vZGUuZGVzdHJveSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBwYXRjaFtpbmRleF0gPSBhcHBlbmRQYXRjaChcbiAgICAgICAgICAgICAgICBwYXRjaFtpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV3IFZQYXRjaChWUGF0Y2guUkVNT1ZFLCB2Tm9kZSwgbnVsbClcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNWTm9kZSh2Tm9kZSkgJiYgKHZOb2RlLmhhc1dpZGdldHMgfHwgdk5vZGUuaGFzVGh1bmtzKSkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB2Tm9kZS5jaGlsZHJlblxuICAgICAgICB2YXIgbGVuID0gY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICAgICAgICBpbmRleCArPSAxXG5cbiAgICAgICAgICAgIGRlc3Ryb3lXaWRnZXRzKGNoaWxkLCBwYXRjaCwgaW5kZXgpXG5cbiAgICAgICAgICAgIGlmIChpc1ZOb2RlKGNoaWxkKSAmJiBjaGlsZC5jb3VudCkge1xuICAgICAgICAgICAgICAgIGluZGV4ICs9IGNoaWxkLmNvdW50XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzVGh1bmsodk5vZGUpKSB7XG4gICAgICAgIHRodW5rcyh2Tm9kZSwgbnVsbCwgcGF0Y2gsIGluZGV4KVxuICAgIH1cbn1cblxuLy8gQ3JlYXRlIGEgc3ViLXBhdGNoIGZvciB0aHVua3NcbmZ1bmN0aW9uIHRodW5rcyhhLCBiLCBwYXRjaCwgaW5kZXgpIHtcbiAgICB2YXIgbm9kZXMgPSBoYW5kbGVUaHVuayhhLCBiKVxuICAgIHZhciB0aHVua1BhdGNoID0gZGlmZihub2Rlcy5hLCBub2Rlcy5iKVxuICAgIGlmIChoYXNQYXRjaGVzKHRodW5rUGF0Y2gpKSB7XG4gICAgICAgIHBhdGNoW2luZGV4XSA9IG5ldyBWUGF0Y2goVlBhdGNoLlRIVU5LLCBudWxsLCB0aHVua1BhdGNoKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzUGF0Y2hlcyhwYXRjaCkge1xuICAgIGZvciAodmFyIGluZGV4IGluIHBhdGNoKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gXCJhXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuLy8gRXhlY3V0ZSBob29rcyB3aGVuIHR3byBub2RlcyBhcmUgaWRlbnRpY2FsXG5mdW5jdGlvbiB1bmhvb2sodk5vZGUsIHBhdGNoLCBpbmRleCkge1xuICAgIGlmIChpc1ZOb2RlKHZOb2RlKSkge1xuICAgICAgICBpZiAodk5vZGUuaG9va3MpIHtcbiAgICAgICAgICAgIHBhdGNoW2luZGV4XSA9IGFwcGVuZFBhdGNoKFxuICAgICAgICAgICAgICAgIHBhdGNoW2luZGV4XSxcbiAgICAgICAgICAgICAgICBuZXcgVlBhdGNoKFxuICAgICAgICAgICAgICAgICAgICBWUGF0Y2guUFJPUFMsXG4gICAgICAgICAgICAgICAgICAgIHZOb2RlLFxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRLZXlzKHZOb2RlLmhvb2tzKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2Tm9kZS5kZXNjZW5kYW50SG9va3MgfHwgdk5vZGUuaGFzVGh1bmtzKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB2Tm9kZS5jaGlsZHJlblxuICAgICAgICAgICAgdmFyIGxlbiA9IGNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMVxuXG4gICAgICAgICAgICAgICAgdW5ob29rKGNoaWxkLCBwYXRjaCwgaW5kZXgpXG5cbiAgICAgICAgICAgICAgICBpZiAoaXNWTm9kZShjaGlsZCkgJiYgY2hpbGQuY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gY2hpbGQuY291bnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzVGh1bmsodk5vZGUpKSB7XG4gICAgICAgIHRodW5rcyh2Tm9kZSwgbnVsbCwgcGF0Y2gsIGluZGV4KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdW5kZWZpbmVkS2V5cyhvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge31cblxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbi8vIExpc3QgZGlmZiwgbmFpdmUgbGVmdCB0byByaWdodCByZW9yZGVyaW5nXG5mdW5jdGlvbiByZW9yZGVyKGFDaGlsZHJlbiwgYkNoaWxkcmVuKSB7XG4gICAgLy8gTyhNKSB0aW1lLCBPKE0pIG1lbW9yeVxuICAgIHZhciBiQ2hpbGRJbmRleCA9IGtleUluZGV4KGJDaGlsZHJlbilcbiAgICB2YXIgYktleXMgPSBiQ2hpbGRJbmRleC5rZXlzXG4gICAgdmFyIGJGcmVlID0gYkNoaWxkSW5kZXguZnJlZVxuXG4gICAgaWYgKGJGcmVlLmxlbmd0aCA9PT0gYkNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hpbGRyZW46IGJDaGlsZHJlbixcbiAgICAgICAgICAgIG1vdmVzOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPKE4pIHRpbWUsIE8oTikgbWVtb3J5XG4gICAgdmFyIGFDaGlsZEluZGV4ID0ga2V5SW5kZXgoYUNoaWxkcmVuKVxuICAgIHZhciBhS2V5cyA9IGFDaGlsZEluZGV4LmtleXNcbiAgICB2YXIgYUZyZWUgPSBhQ2hpbGRJbmRleC5mcmVlXG5cbiAgICBpZiAoYUZyZWUubGVuZ3RoID09PSBhQ2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGlsZHJlbjogYkNoaWxkcmVuLFxuICAgICAgICAgICAgbW92ZXM6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE8oTUFYKE4sIE0pKSBtZW1vcnlcbiAgICB2YXIgbmV3Q2hpbGRyZW4gPSBbXVxuXG4gICAgdmFyIGZyZWVJbmRleCA9IDBcbiAgICB2YXIgZnJlZUNvdW50ID0gYkZyZWUubGVuZ3RoXG4gICAgdmFyIGRlbGV0ZWRJdGVtcyA9IDBcblxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBhIGFuZCBtYXRjaCBhIG5vZGUgaW4gYlxuICAgIC8vIE8oTikgdGltZSxcbiAgICBmb3IgKHZhciBpID0gMCA7IGkgPCBhQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFJdGVtID0gYUNoaWxkcmVuW2ldXG4gICAgICAgIHZhciBpdGVtSW5kZXhcblxuICAgICAgICBpZiAoYUl0ZW0ua2V5KSB7XG4gICAgICAgICAgICBpZiAoYktleXMuaGFzT3duUHJvcGVydHkoYUl0ZW0ua2V5KSkge1xuICAgICAgICAgICAgICAgIC8vIE1hdGNoIHVwIHRoZSBvbGQga2V5c1xuICAgICAgICAgICAgICAgIGl0ZW1JbmRleCA9IGJLZXlzW2FJdGVtLmtleV1cbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKGJDaGlsZHJlbltpdGVtSW5kZXhdKVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBvbGQga2V5ZWQgaXRlbXNcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBpIC0gZGVsZXRlZEl0ZW1zKytcbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBNYXRjaCB0aGUgaXRlbSBpbiBhIHdpdGggdGhlIG5leHQgZnJlZSBpdGVtIGluIGJcbiAgICAgICAgICAgIGlmIChmcmVlSW5kZXggPCBmcmVlQ291bnQpIHtcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBiRnJlZVtmcmVlSW5kZXgrK11cbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKGJDaGlsZHJlbltpdGVtSW5kZXhdKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgbm8gZnJlZSBpdGVtcyBpbiBiIHRvIG1hdGNoIHdpdGhcbiAgICAgICAgICAgICAgICAvLyB0aGUgZnJlZSBpdGVtcyBpbiBhLCBzbyB0aGUgZXh0cmEgZnJlZSBub2Rlc1xuICAgICAgICAgICAgICAgIC8vIGFyZSBkZWxldGVkLlxuICAgICAgICAgICAgICAgIGl0ZW1JbmRleCA9IGkgLSBkZWxldGVkSXRlbXMrK1xuICAgICAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2gobnVsbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYXN0RnJlZUluZGV4ID0gZnJlZUluZGV4ID49IGJGcmVlLmxlbmd0aCA/XG4gICAgICAgIGJDaGlsZHJlbi5sZW5ndGggOlxuICAgICAgICBiRnJlZVtmcmVlSW5kZXhdXG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggYiBhbmQgYXBwZW5kIGFueSBuZXcga2V5c1xuICAgIC8vIE8oTSkgdGltZVxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYkNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBuZXdJdGVtID0gYkNoaWxkcmVuW2pdXG5cbiAgICAgICAgaWYgKG5ld0l0ZW0ua2V5KSB7XG4gICAgICAgICAgICBpZiAoIWFLZXlzLmhhc093blByb3BlcnR5KG5ld0l0ZW0ua2V5KSkge1xuICAgICAgICAgICAgICAgIC8vIEFkZCBhbnkgbmV3IGtleWVkIGl0ZW1zXG4gICAgICAgICAgICAgICAgLy8gV2UgYXJlIGFkZGluZyBuZXcgaXRlbXMgdG8gdGhlIGVuZCBhbmQgdGhlbiBzb3J0aW5nIHRoZW1cbiAgICAgICAgICAgICAgICAvLyBpbiBwbGFjZS4gSW4gZnV0dXJlIHdlIHNob3VsZCBpbnNlcnQgbmV3IGl0ZW1zIGluIHBsYWNlLlxuICAgICAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2gobmV3SXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChqID49IGxhc3RGcmVlSW5kZXgpIHtcbiAgICAgICAgICAgIC8vIEFkZCBhbnkgbGVmdG92ZXIgbm9uLWtleWVkIGl0ZW1zXG4gICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKG5ld0l0ZW0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2ltdWxhdGUgPSBuZXdDaGlsZHJlbi5zbGljZSgpXG4gICAgdmFyIHNpbXVsYXRlSW5kZXggPSAwXG4gICAgdmFyIHJlbW92ZXMgPSBbXVxuICAgIHZhciBpbnNlcnRzID0gW11cbiAgICB2YXIgc2ltdWxhdGVJdGVtXG5cbiAgICBmb3IgKHZhciBrID0gMDsgayA8IGJDaGlsZHJlbi5sZW5ndGg7KSB7XG4gICAgICAgIHZhciB3YW50ZWRJdGVtID0gYkNoaWxkcmVuW2tdXG4gICAgICAgIHNpbXVsYXRlSXRlbSA9IHNpbXVsYXRlW3NpbXVsYXRlSW5kZXhdXG5cbiAgICAgICAgLy8gcmVtb3ZlIGl0ZW1zXG4gICAgICAgIHdoaWxlIChzaW11bGF0ZUl0ZW0gPT09IG51bGwgJiYgc2ltdWxhdGUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZW1vdmVzLnB1c2gocmVtb3ZlKHNpbXVsYXRlLCBzaW11bGF0ZUluZGV4LCBudWxsKSlcbiAgICAgICAgICAgIHNpbXVsYXRlSXRlbSA9IHNpbXVsYXRlW3NpbXVsYXRlSW5kZXhdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpbXVsYXRlSXRlbSB8fCBzaW11bGF0ZUl0ZW0ua2V5ICE9PSB3YW50ZWRJdGVtLmtleSkge1xuICAgICAgICAgICAgLy8gaWYgd2UgbmVlZCBhIGtleSBpbiB0aGlzIHBvc2l0aW9uLi4uXG4gICAgICAgICAgICBpZiAod2FudGVkSXRlbS5rZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2ltdWxhdGVJdGVtICYmIHNpbXVsYXRlSXRlbS5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYW4gaW5zZXJ0IGRvZXNuJ3QgcHV0IHRoaXMga2V5IGluIHBsYWNlLCBpdCBuZWVkcyB0byBtb3ZlXG4gICAgICAgICAgICAgICAgICAgIGlmIChiS2V5c1tzaW11bGF0ZUl0ZW0ua2V5XSAhPT0gayArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZXMucHVzaChyZW1vdmUoc2ltdWxhdGUsIHNpbXVsYXRlSW5kZXgsIHNpbXVsYXRlSXRlbS5rZXkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGVJdGVtID0gc2ltdWxhdGVbc2ltdWxhdGVJbmRleF1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByZW1vdmUgZGlkbid0IHB1dCB0aGUgd2FudGVkIGl0ZW0gaW4gcGxhY2UsIHdlIG5lZWQgdG8gaW5zZXJ0IGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNpbXVsYXRlSXRlbSB8fCBzaW11bGF0ZUl0ZW0ua2V5ICE9PSB3YW50ZWRJdGVtLmtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydHMucHVzaCh7a2V5OiB3YW50ZWRJdGVtLmtleSwgdG86IGt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlbXMgYXJlIG1hdGNoaW5nLCBzbyBza2lwIGFoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW11bGF0ZUluZGV4KytcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydHMucHVzaCh7a2V5OiB3YW50ZWRJdGVtLmtleSwgdG86IGt9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnNlcnRzLnB1c2goe2tleTogd2FudGVkSXRlbS5rZXksIHRvOiBrfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaysrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhIGtleSBpbiBzaW11bGF0ZSBoYXMgbm8gbWF0Y2hpbmcgd2FudGVkIGtleSwgcmVtb3ZlIGl0XG4gICAgICAgICAgICBlbHNlIGlmIChzaW11bGF0ZUl0ZW0gJiYgc2ltdWxhdGVJdGVtLmtleSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZXMucHVzaChyZW1vdmUoc2ltdWxhdGUsIHNpbXVsYXRlSW5kZXgsIHNpbXVsYXRlSXRlbS5rZXkpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2ltdWxhdGVJbmRleCsrXG4gICAgICAgICAgICBrKytcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBhbGwgdGhlIHJlbWFpbmluZyBub2RlcyBmcm9tIHNpbXVsYXRlXG4gICAgd2hpbGUoc2ltdWxhdGVJbmRleCA8IHNpbXVsYXRlLmxlbmd0aCkge1xuICAgICAgICBzaW11bGF0ZUl0ZW0gPSBzaW11bGF0ZVtzaW11bGF0ZUluZGV4XVxuICAgICAgICByZW1vdmVzLnB1c2gocmVtb3ZlKHNpbXVsYXRlLCBzaW11bGF0ZUluZGV4LCBzaW11bGF0ZUl0ZW0gJiYgc2ltdWxhdGVJdGVtLmtleSkpXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG9ubHkgbW92ZXMgd2UgaGF2ZSBhcmUgZGVsZXRlcyB0aGVuIHdlIGNhbiBqdXN0XG4gICAgLy8gbGV0IHRoZSBkZWxldGUgcGF0Y2ggcmVtb3ZlIHRoZXNlIGl0ZW1zLlxuICAgIGlmIChyZW1vdmVzLmxlbmd0aCA9PT0gZGVsZXRlZEl0ZW1zICYmICFpbnNlcnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hpbGRyZW46IG5ld0NoaWxkcmVuLFxuICAgICAgICAgICAgbW92ZXM6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNoaWxkcmVuOiBuZXdDaGlsZHJlbixcbiAgICAgICAgbW92ZXM6IHtcbiAgICAgICAgICAgIHJlbW92ZXM6IHJlbW92ZXMsXG4gICAgICAgICAgICBpbnNlcnRzOiBpbnNlcnRzXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShhcnIsIGluZGV4LCBrZXkpIHtcbiAgICBhcnIuc3BsaWNlKGluZGV4LCAxKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZnJvbTogaW5kZXgsXG4gICAgICAgIGtleToga2V5XG4gICAgfVxufVxuXG5mdW5jdGlvbiBrZXlJbmRleChjaGlsZHJlbikge1xuICAgIHZhciBrZXlzID0ge31cbiAgICB2YXIgZnJlZSA9IFtdXG4gICAgdmFyIGxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aFxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuXG4gICAgICAgIGlmIChjaGlsZC5rZXkpIHtcbiAgICAgICAgICAgIGtleXNbY2hpbGQua2V5XSA9IGlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyZWUucHVzaChpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5czoga2V5cywgICAgIC8vIEEgaGFzaCBvZiBrZXkgbmFtZSB0byBpbmRleFxuICAgICAgICBmcmVlOiBmcmVlICAgICAgLy8gQW4gYXJyYXkgb2YgdW5rZXllZCBpdGVtIGluZGljZXNcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFwcGVuZFBhdGNoKGFwcGx5LCBwYXRjaCkge1xuICAgIGlmIChhcHBseSkge1xuICAgICAgICBpZiAoaXNBcnJheShhcHBseSkpIHtcbiAgICAgICAgICAgIGFwcGx5LnB1c2gocGF0Y2gpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcHBseSA9IFthcHBseSwgcGF0Y2hdXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXBwbHlcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGF0Y2hcbiAgICB9XG59XG4iLCJjb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxuY29uc3Qgc2xpY2VkID0gcmVxdWlyZSgnc2xpY2VkJylcbmNvbnN0IHRyaWUgPSByZXF1aXJlKCcuL3RyaWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdheWZhcmVyXG5cbi8vIGNyZWF0ZSBhIHJvdXRlclxuLy8gc3RyIC0+IG9ialxuZnVuY3Rpb24gV2F5ZmFyZXIgKGRmdCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgV2F5ZmFyZXIpKSByZXR1cm4gbmV3IFdheWZhcmVyKGRmdClcblxuICBjb25zdCBfZGVmYXVsdCA9IChkZnQgfHwgJycpLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgY29uc3QgX3RyaWUgPSB0cmllKClcblxuICBlbWl0Ll90cmllID0gX3RyaWVcbiAgZW1pdC5lbWl0ID0gZW1pdFxuICBlbWl0Lm9uID0gb25cbiAgZW1pdC5fd2F5ZmFyZXIgPSB0cnVlXG5cbiAgcmV0dXJuIGVtaXRcblxuICAvLyBkZWZpbmUgYSByb3V0ZVxuICAvLyAoc3RyLCBmbikgLT4gb2JqXG4gIGZ1bmN0aW9uIG9uIChyb3V0ZSwgY2IpIHtcbiAgICBhc3NlcnQuZXF1YWwodHlwZW9mIHJvdXRlLCAnc3RyaW5nJylcbiAgICBhc3NlcnQuZXF1YWwodHlwZW9mIGNiLCAnZnVuY3Rpb24nKVxuXG4gICAgcm91dGUgPSByb3V0ZSB8fCAnLydcblxuICAgIGlmIChjYiAmJiBjYi5fd2F5ZmFyZXIgJiYgY2IuX3RyaWUpIHtcbiAgICAgIF90cmllLm1vdW50KHJvdXRlLCBjYi5fdHJpZS50cmllKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBub2RlID0gX3RyaWUuY3JlYXRlKHJvdXRlKVxuICAgICAgbm9kZS5jYiA9IGNiXG4gICAgfVxuXG4gICAgcmV0dXJuIGVtaXRcbiAgfVxuXG4gIC8vIG1hdGNoIGFuZCBjYWxsIGEgcm91dGVcbiAgLy8gKHN0ciwgb2JqPykgLT4gbnVsbFxuICBmdW5jdGlvbiBlbWl0IChyb3V0ZSkge1xuICAgIGFzc2VydC5ub3RFcXVhbChyb3V0ZSwgdW5kZWZpbmVkLCBcIidyb3V0ZScgbXVzdCBiZSBkZWZpbmVkXCIpXG4gICAgY29uc3QgYXJncyA9IHNsaWNlZChhcmd1bWVudHMpXG5cbiAgICBjb25zdCBub2RlID0gX3RyaWUubWF0Y2gocm91dGUpXG4gICAgaWYgKG5vZGUgJiYgbm9kZS5jYikge1xuICAgICAgYXJnc1swXSA9IG5vZGUucGFyYW1zXG4gICAgICByZXR1cm4gbm9kZS5jYi5hcHBseShudWxsLCBhcmdzKVxuICAgIH1cblxuICAgIGNvbnN0IGRmdCA9IF90cmllLm1hdGNoKF9kZWZhdWx0KVxuICAgIGlmIChkZnQgJiYgZGZ0LmNiKSB7XG4gICAgICBhcmdzWzBdID0gZGZ0LnBhcmFtc1xuICAgICAgcmV0dXJuIGRmdC5jYi5hcHBseShudWxsLCBhcmdzKVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihcInJvdXRlICdcIiArIHJvdXRlICsgXCInIGRpZCBub3QgbWF0Y2hcIilcbiAgfVxufVxuIiwiXG4vKipcbiAqIEFuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykgYWx0ZXJuYXRpdmVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYXJncyBzb21ldGhpbmcgd2l0aCBhIGxlbmd0aFxuICogQHBhcmFtIHtOdW1iZXJ9IHNsaWNlXG4gKiBAcGFyYW0ge051bWJlcn0gc2xpY2VFbmRcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJncywgc2xpY2UsIHNsaWNlRW5kKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuXG4gIGlmICgwID09PSBsZW4pIHJldHVybiByZXQ7XG5cbiAgdmFyIHN0YXJ0ID0gc2xpY2UgPCAwXG4gICAgPyBNYXRoLm1heCgwLCBzbGljZSArIGxlbilcbiAgICA6IHNsaWNlIHx8IDA7XG5cbiAgaWYgKHNsaWNlRW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICBsZW4gPSBzbGljZUVuZCA8IDBcbiAgICAgID8gc2xpY2VFbmQgKyBsZW5cbiAgICAgIDogc2xpY2VFbmRcbiAgfVxuXG4gIHdoaWxlIChsZW4tLSA+IHN0YXJ0KSB7XG4gICAgcmV0W2xlbiAtIHN0YXJ0XSA9IGFyZ3NbbGVuXTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbiIsImNvbnN0IG11dGF0ZSA9IHJlcXVpcmUoJ3h0ZW5kL211dGFibGUnKVxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JylcbmNvbnN0IHh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWVcblxuLy8gY3JlYXRlIGEgbmV3IHRyaWVcbi8vIG51bGwgLT4gb2JqXG5mdW5jdGlvbiBUcmllICgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRyaWUpKSByZXR1cm4gbmV3IFRyaWUoKVxuICB0aGlzLnRyaWUgPSB7IG5vZGVzOiB7fSB9XG59XG5cbi8vIGNyZWF0ZSBhIG5vZGUgb24gdGhlIHRyaWUgYXQgcm91dGVcbi8vIGFuZCByZXR1cm4gYSBub2RlXG4vLyBzdHIgLT4gbnVsbFxuVHJpZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKHJvdXRlKSB7XG4gIGFzc2VydC5lcXVhbCh0eXBlb2Ygcm91dGUsICdzdHJpbmcnLCAncm91dGUgc2hvdWxkIGJlIGEgc3RyaW5nJylcbiAgLy8gc3RyaXAgbGVhZGluZyAnLycgYW5kIHNwbGl0IHJvdXRlc1xuICBjb25zdCByb3V0ZXMgPSByb3V0ZS5yZXBsYWNlKC9eXFwvLywgJycpLnNwbGl0KCcvJylcbiAgcmV0dXJuIChmdW5jdGlvbiBjcmVhdGVOb2RlIChpbmRleCwgdHJpZSwgcm91dGVzKSB7XG4gICAgY29uc3Qgcm91dGUgPSByb3V0ZXNbaW5kZXhdXG5cbiAgICBpZiAocm91dGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRyaWVcblxuICAgIHZhciBub2RlID0gbnVsbFxuICAgIGlmICgvXjovLnRlc3Qocm91dGUpKSB7XG4gICAgICAvLyBpZiBub2RlIGlzIGEgbmFtZSBtYXRjaCwgc2V0IG5hbWUgYW5kIGFwcGVuZCB0byAnOicgbm9kZVxuICAgICAgaWYgKCF0cmllLm5vZGVzWyc6J10pIHtcbiAgICAgICAgbm9kZSA9IHsgbm9kZXM6IHt9IH1cbiAgICAgICAgdHJpZS5ub2Rlc1snOiddID0gbm9kZVxuICAgICAgfVxuICAgICAgdHJpZS5uYW1lID0gcm91dGUucmVwbGFjZSgvXjovLCAnJylcbiAgICB9IGVsc2UgaWYgKCF0cmllLm5vZGVzW3JvdXRlXSkge1xuICAgICAgbm9kZSA9IHsgbm9kZXM6IHt9IH1cbiAgICAgIHRyaWUubm9kZXNbcm91dGVdID0gbm9kZVxuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdHJpZS5ub2Rlc1tyb3V0ZV1cbiAgICB9XG5cbiAgICAvLyB3ZSBtdXN0IHJlY3Vyc2UgZGVlcGVyXG4gICAgcmV0dXJuIGNyZWF0ZU5vZGUoaW5kZXggKyAxLCBub2RlLCByb3V0ZXMpXG4gIH0pKDAsIHRoaXMudHJpZSwgcm91dGVzKVxufVxuXG4vLyBtYXRjaCBhIHJvdXRlIG9uIHRoZSB0cmllXG4vLyBhbmQgcmV0dXJuIHRoZSBub2RlXG4vLyBzdHIgLT4gb2JqXG5UcmllLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICBhc3NlcnQuZXF1YWwodHlwZW9mIHJvdXRlLCAnc3RyaW5nJywgJ3JvdXRlIHNob3VsZCBiZSBhIHN0cmluZycpXG5cbiAgY29uc3Qgcm91dGVzID0gcm91dGUucmVwbGFjZSgvXlxcLy8sICcnKS5zcGxpdCgnLycpXG4gIGNvbnN0IHBhcmFtcyA9IHt9XG5cbiAgdmFyIG5vZGUgPSAoZnVuY3Rpb24gc2VhcmNoIChpbmRleCwgdHJpZSkge1xuICAgIC8vIGVpdGhlciB0aGVyZSdzIG5vIG1hdGNoLCBvciB3ZSdyZSBkb25lIHNlYXJjaGluZ1xuICAgIGlmICh0cmllID09PSB1bmRlZmluZWQpIHJldHVybiB1bmRlZmluZWRcbiAgICBjb25zdCByb3V0ZSA9IHJvdXRlc1tpbmRleF1cbiAgICBpZiAocm91dGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRyaWVcblxuICAgIGlmICh0cmllLm5vZGVzW3JvdXRlXSkge1xuICAgICAgLy8gbWF0Y2ggcmVndWxhciByb3V0ZXMgZmlyc3RcbiAgICAgIHJldHVybiBzZWFyY2goaW5kZXggKyAxLCB0cmllLm5vZGVzW3JvdXRlXSlcbiAgICB9IGVsc2UgaWYgKHRyaWUubmFtZSkge1xuICAgICAgLy8gbWF0Y2ggbmFtZWQgcm91dGVzXG4gICAgICBwYXJhbXNbdHJpZS5uYW1lXSA9IHJvdXRlXG4gICAgICByZXR1cm4gc2VhcmNoKGluZGV4ICsgMSwgdHJpZS5ub2Rlc1snOiddKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBtYXRjaGVzIGZvdW5kXG4gICAgICByZXR1cm4gc2VhcmNoKGluZGV4ICsgMSlcbiAgICB9XG4gIH0pKDAsIHRoaXMudHJpZSlcblxuICBpZiAoIW5vZGUpIHJldHVybiB1bmRlZmluZWRcbiAgbm9kZSA9IHh0ZW5kKG5vZGUpXG4gIG5vZGUucGFyYW1zID0gcGFyYW1zXG4gIHJldHVybiBub2RlXG59XG5cbi8vIG1vdW50IGEgdHJpZSBvbnRvIGEgbm9kZSBhdCByb3V0ZVxuLy8gKHN0ciwgb2JqKSAtPiBudWxsXG5UcmllLnByb3RvdHlwZS5tb3VudCA9IGZ1bmN0aW9uIChyb3V0ZSwgdHJpZSkge1xuICBhc3NlcnQuZXF1YWwodHlwZW9mIHJvdXRlLCAnc3RyaW5nJywgJ3JvdXRlIHNob3VsZCBiZSBhIHN0cmluZycpXG4gIGFzc2VydC5lcXVhbCh0eXBlb2YgdHJpZSwgJ29iamVjdCcsICd0cmllIHNob3VsZCBiZSBhIG9iamVjdCcpXG5cbiAgY29uc3Qgc3BsaXQgPSByb3V0ZS5yZXBsYWNlKC9eXFwvLywgJycpLnNwbGl0KCcvJylcbiAgdmFyIG5vZGUgPSBudWxsXG4gIHZhciBrZXkgPSBudWxsXG5cbiAgaWYgKHNwbGl0Lmxlbmd0aCA9PT0gMSkge1xuICAgIGtleSA9IHNwbGl0WzBdXG4gICAgbm9kZSA9IHRoaXMuY3JlYXRlKGtleSlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBoZWFkQXJyID0gc3BsaXQuc3BsaWNlKDAsIHNwbGl0Lmxlbmd0aCAtIDEpXG4gICAgY29uc3QgaGVhZCA9IGhlYWRBcnIuam9pbignLycpXG4gICAga2V5ID0gc3BsaXRbMF1cbiAgICBub2RlID0gdGhpcy5jcmVhdGUoaGVhZClcbiAgfVxuXG4gIG11dGF0ZShub2RlLm5vZGVzLCB0cmllLm5vZGVzKVxuICBpZiAodHJpZS5uYW1lKSBub2RlLm5hbWUgPSB0cmllLm5hbWVcblxuICAvLyBkZWxlZ2F0ZSBwcm9wZXJ0aWVzIGZyb20gJy8nIHRvIHRoZSBuZXcgbm9kZVxuICAvLyAnLycgY2Fubm90IGJlIHJlYWNoZWQgb25jZSBtb3VudGVkXG4gIGlmIChub2RlLm5vZGVzWycnXSkge1xuICAgIE9iamVjdC5rZXlzKG5vZGUubm9kZXNbJyddKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChrZXkgPT09ICdub2RlcycpIHJldHVyblxuICAgICAgbm9kZVtrZXldID0gbm9kZS5ub2Rlc1snJ11ba2V5XVxuICAgIH0pXG4gICAgbXV0YXRlKG5vZGUubm9kZXMsIG5vZGUubm9kZXNbJyddLm5vZGVzKVxuICAgIGRlbGV0ZSBub2RlLm5vZGVzWycnXS5ub2Rlc1xuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCJjb25zdCBkdWV0ID0gcmVxdWlyZSgnZHVldCcpO1xuY29uc3QgYXBwICA9IHJlcXVpcmUoJy4vYXBwJyk7XG5cbmR1ZXQoYXBwLCAnLnRvZG9hcHAnLCB7XG4gIC8vIGZvcmNlU2luZ2xlVGhyZWFkOiB0cnVlLFxuICBpc0RlYnVnOiB0cnVlLFxuICBpc0hhc2hSb3V0ZXI6IHRydWVcbn0pO1xuIiwiY29uc3Qge3N0b3JlfSAgICAgID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgdmlldyAgICAgICAgID0gcmVxdWlyZSgnLi92aWV3Jyk7XG5jb25zdCBjcmVhdGVNb2RlbCAgPSByZXF1aXJlKCcuL21vZGVsJyk7XG5jb25zdCBjcmVhdGVSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKHN0YXJ0KSA9PiB7XG4gIHN0b3JlKCd0b2Rvcy1kdWV0JywgKHN0b3JlZCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoc3RvcmVkKTtcbiAgICBjb25zdCByb3V0ZXIgPSBjcmVhdGVSb3V0ZXIobW9kZWwpO1xuXG4gICAgc3RhcnQodmlldywgbW9kZWwsIHJvdXRlcik7XG4gIH0pXG59O1xuIiwiY29uc3Qge21vZGVsLCB2YWx1ZSwgdmFyaGFzaH0gPSByZXF1aXJlKCdkdWV0Jyk7XG5jb25zdCB7c3RvcmV9ICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgVG9kbyA9ICh7dGl0bGUsIGNvbXBsZXRlZH0sIGtleSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRpdGxlLFxuICAgIGNvbXBsZXRlZFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoc3RvcmVkKSA9PiB7XG4gIGNvbnN0IHRvZG9zID0gc3RvcmVkICE9IG51bGwgJiYgdHlwZW9mIHN0b3JlZCA9PT0gJ29iamVjdCcgJiYgc3RvcmVkIHx8IHt9O1xuXG4gIGNvbnN0IGFwcE1vZGVsID0gbW9kZWwoe1xuICAgIGlzSW5pdExvYWQ6IHZhbHVlKHRydWUpLFxuICAgIHRvZG9zOiB2YXJoYXNoKHRvZG9zLCBUb2RvKSxcbiAgICBuZXdUb2RvOiB2YWx1ZSgnJyksXG4gICAgZWRpdGluZzogdmFsdWUobnVsbCksXG4gICAgZmlsdGVyOiB2YWx1ZSgnYWxsJylcbiAgfSk7XG5cbiAgY29uc3QgaW5pdExvYWQgPSBhcHBNb2RlbChmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuaXNJbml0TG9hZCkge1xuICAgICAgaW5pdExvYWQoKTtcbiAgICAgIGFwcE1vZGVsLmlzSW5pdExvYWQuc2V0KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcE1vZGVsLnRvZG9zKCh0b2Rvc1N0YXRlKSA9PiB7XG4gICAgc3RvcmUoJ3RvZG9zLWR1ZXQnLCB0b2Rvc1N0YXRlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFwcE1vZGVsO1xufTtcbiIsImNvbnN0IHtyb3V0ZXJ9ICA9IHJlcXVpcmUoJ2R1ZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAobW9kZWwpID0+IHtcblxuICBjb25zdCBmaWx0ZXIgPSAodmFsdWUpID0+IHtcbiAgICBtb2RlbC5maWx0ZXIuc2V0KHZhbHVlKTtcbiAgfTtcblxuICByZXR1cm4gcm91dGVyKClcbiAgLm9uKCcvJywgICAgICAgICAgZmlsdGVyLmJpbmQobnVsbCwgJ2FsbCcpKVxuICAub24oJy9hY3RpdmUnLCAgICBmaWx0ZXIuYmluZChudWxsLCAnYWN0aXZlJykpXG4gIC5vbignL2NvbXBsZXRlZCcsIGZpbHRlci5iaW5kKG51bGwsICdjb21wbGV0ZWQnKSk7XG59O1xuIiwiY29uc3Qge2xvY2FsU3RvcmFnZX0gPSByZXF1aXJlKCdkdWV0Jyk7XG5cbmNvbnN0IHV1aWQgPSAoKSA9PiB7XG4gIGxldCB1dWlkID0gJyc7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzMjsgaSsrKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICBpZiAoaSA9PT0gOCB8fCBpID09PSAxMiB8fCBpID09PSAxNiB8fCBpID09PSAyMCkge1xuICAgICAgdXVpZCArPSAnLSc7XG4gICAgfVxuICAgIHV1aWQgKz0gKGkgPT09IDEyID8gNCA6IChpID09PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNik7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn07XG5cbmNvbnN0IHN0b3JlID0gKG5hbWVzcGFjZSwgZGF0YU9ySGFuZGxlcikgPT4ge1xuICBpZiAodHlwZW9mIGRhdGFPckhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlKG5hbWVzcGFjZSwgZnVuY3Rpb24gKHN0b3JlSlNPTikge1xuICAgICAgZGF0YU9ySGFuZGxlcigoc3RvcmVKU09OICYmIEpTT04ucGFyc2Uoc3RvcmVKU09OKSkgfHwgW10pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxvY2FsU3RvcmFnZShuYW1lc3BhY2UsIEpTT04uc3RyaW5naWZ5KGRhdGFPckhhbmRsZXIpKTtcbn07XG5cbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuY29uc3QgZXh0ZW5kID0gKC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgdGFyZ2V0ID0ge307XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc291cmNlID0gYXJnc1tpXTtcblxuICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1dWlkLFxuICBzdG9yZSxcbiAgZXh0ZW5kXG59O1xuIiwiY29uc3Qge2RvbX0gID0gcmVxdWlyZSgnZHVldCcpO1xuY29uc3QgSGVhZGVyID0gcmVxdWlyZSgnLi9IZWFkZXInKTtcbmNvbnN0IE1haW4gICA9IHJlcXVpcmUoJy4vTWFpbicpO1xuY29uc3QgRm9vdGVyID0gcmVxdWlyZSgnLi9Gb290ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoc3RhdGUpID0+IHtcbiAgcmV0dXJuIGRvbWBcbiAgICA8ZGl2PlxuICAgICAgJHtIZWFkZXIoc3RhdGUpfVxuICAgICAgJHtNYWluKHN0YXRlKX1cbiAgICAgICR7Rm9vdGVyKHN0YXRlKX1cbiAgICA8L2Rpdj5cbiAgYDtcbn07XG4iXX0=
