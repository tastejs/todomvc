/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _extends; });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@hullo/browser/ofHistory.js":
/*!**************************************************!*\
  !*** ./node_modules/@hullo/browser/ofHistory.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! @hullo/core/observable */ "./node_modules/@hullo/core/observable.js");
const duplex_1 = __webpack_require__(/*! @hullo/core/duplex */ "./node_modules/@hullo/core/duplex.js");
const state_1 = __webpack_require__(/*! @hullo/core/operators/state */ "./node_modules/@hullo/core/operators/state.js");
function ofHistory(history) {
    const acks = [];
    return new duplex_1.Duplex(new observable_1.Observable(new HistoryProducer(history, acks)).pipe(state_1.state(history.location)), new HistoryInput(history, acks));
}
exports.ofHistory = ofHistory;
class HistoryProducer {
    constructor(history, acks) {
        this.history = history;
        this.acks = acks;
    }
    subscribe(observer) {
        return this.history.listen((location, _action) => {
            const acks = this.acks.splice(0);
            observer.next(location).then(() => {
                acks.forEach(call);
            });
        });
    }
}
function call(f) {
    f();
}
class HistoryInput {
    constructor(history, acks) {
        this.history = history;
        this.acks = acks;
    }
    get closed() {
        return false;
    }
    next(next) {
        return new Promise(resolve => {
            this.acks.push(resolve);
            this.history.push(next);
        });
    }
    complete() {
        return Promise.resolve();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/browser/route.js":
/*!**********************************************!*\
  !*** ./node_modules/@hullo/browser/route.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! @hullo/core/observable */ "./node_modules/@hullo/core/observable.js");
function route(config) {
    return function routeI(source) {
        return new observable_1.Observable(new RouteProducer(source, config));
    };
}
exports.route = route;
class RouteProducer {
    constructor(source, config) {
        this.source = source;
        this.config = config;
    }
    subscribe(observer) {
        const sub = this.source.subscribe(new RouteObserver(this.config, observer));
        return new RoutingCancel(sub);
    }
}
class RoutingCancel {
    constructor(sub) {
        this.sub = sub;
    }
    cancel() {
        if (!this.sub.closed) {
            this.sub.cancel();
        }
    }
}
class RouteObserver {
    constructor(config, observer) {
        this.config = config;
        this.observer = observer;
    }
    get closed() {
        return this.observer.closed;
    }
    next(location) {
        if (typeof location.pathname === "string") {
            for (const { when, have } of this.config) {
                const result = when.exec(location.pathname);
                if (result) {
                    return this.observer.next(have(result.slice(1)));
                }
            }
        }
        return Promise.resolve();
    }
    complete() {
        return this.observer.complete();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/atom.js":
/*!******************************************!*\
  !*** ./node_modules/@hullo/core/atom.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const duplex_1 = __webpack_require__(/*! ./duplex */ "./node_modules/@hullo/core/duplex.js");
const observable_1 = __webpack_require__(/*! ./observable */ "./node_modules/@hullo/core/observable.js");
class Atom extends duplex_1.Duplex {
    constructor(state) {
        const context = {
            closed: false,
            remotes: [],
            state: { ref: state }
        };
        const out = new observable_1.Observable(new AtomProducer(context));
        const ins = new AtomObserver(context);
        super(out, ins);
        this.context = context;
        this.lastUpdate = Promise.resolve();
    }
    valueOf() {
        return this.context.state.ref;
    }
    unwrap() {
        return this.context.state.ref;
    }
    update(xf) {
        return (this.lastUpdate = this.lastUpdate
            .then(() => xf(this.context.state.ref))
            .then(result => {
            return this.next(result);
        }));
    }
}
exports.Atom = Atom;
class AtomProducer {
    constructor(context) {
        this.context = context;
    }
    subscribe(observer) {
        if (this.context.closed) {
            observer.complete();
        }
        else {
            this.context.remotes.push(observer);
            const { state } = this.context;
            Promise.resolve().then(() => {
                if (this.context.state === state) {
                    observer.next(this.context.state.ref);
                }
            });
            return new AtomCancel(this.context, observer);
        }
    }
}
class AtomCancel {
    constructor(context, observer) {
        this.context = context;
        this.observer = observer;
    }
    cancel() {
        this.context.remotes.splice(this.context.remotes.indexOf(this.observer), 1);
    }
}
class AtomObserver {
    constructor(context) {
        this.context = context;
    }
    get closed() {
        return this.context.closed;
    }
    next(ref) {
        if (this.context.closed) {
            return Promise.resolve();
        }
        this.context.state = { ref };
        return this.context.remotes.length
            ? Promise.all(this.context.remotes.map(remote => remote.next(ref)))
            : Promise.resolve();
    }
    complete() {
        if (this.closed) {
            return Promise.resolve();
        }
        this.context.closed = true;
        return this.context.remotes.length
            ? Promise.all(this.context.remotes.map(remote => remote.complete()))
            : Promise.resolve();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/channel.js":
/*!*********************************************!*\
  !*** ./node_modules/@hullo/core/channel.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const duplex_1 = __webpack_require__(/*! ./duplex */ "./node_modules/@hullo/core/duplex.js");
const observable_1 = __webpack_require__(/*! ./observable */ "./node_modules/@hullo/core/observable.js");
const subject_1 = __webpack_require__(/*! ./operators/subject */ "./node_modules/@hullo/core/operators/subject.js");
class Channel extends duplex_1.Duplex {
    constructor() {
        const context = {
            buffer: [],
            closed: false,
            remote: undefined,
            nextSafeHandlers: [],
            nextUnsafeHandlers: []
        };
        const out = new observable_1.Observable(new ChannelProducer(context)).pipe(subject_1.subject);
        const ins = new ChannelObserver(context);
        super(out, ins);
        this.context = context;
    }
    take() {
        return new Promise((resolve, reject) => {
            this.context.nextUnsafeHandlers.push({ resolve, reject });
            Promise.resolve(this.context).then(flushBuffer);
        });
    }
    tryTake() {
        return new Promise(resolve => {
            this.context.nextSafeHandlers.push(resolve);
            Promise.resolve(this.context).then(flushBuffer);
        });
    }
}
exports.Channel = Channel;
class ChannelObserver {
    constructor(context) {
        this.context = context;
    }
    get closed() {
        return this.context.closed;
    }
    next(value) {
        return deliver(this.context, {
            closed: false,
            value
        });
    }
    complete() {
        return deliver(this.context, {
            closed: true
        });
    }
}
class ChannelProducer {
    constructor(wide) {
        this.wide = wide;
    }
    subscribe(observer) {
        if (this.wide.closed) {
            observer.complete();
        }
        else {
            this.wide.remote = observer;
            Promise.resolve(this.wide).then(flushBuffer);
            return new ChannelCancel(this.wide);
        }
    }
}
class ChannelCancel {
    constructor(wide) {
        this.wide = wide;
    }
    cancel() {
        this.wide.remote = undefined;
    }
}
function flushBuffer(wideContext) {
    for (const { message, ack } of wideContext.buffer.splice(0)) {
        deliver(wideContext, message).then(ack);
    }
}
function deliver(context, message) {
    if (context.closed) {
        return Promise.resolve();
    }
    if (context.nextSafeHandlers.length === 0 &&
        context.nextUnsafeHandlers.length === 0 &&
        !context.remote) {
        return new Promise(ack => {
            context.buffer.push({ message, ack });
        });
    }
    if (message.closed) {
        context.closed = true;
    }
    for (const handler of context.nextSafeHandlers.splice(0)) {
        handler(message);
    }
    if (message.closed) {
        for (const handler of context.nextUnsafeHandlers.splice(0)) {
            handler.reject(new Error("Channel closed before it got a message"));
        }
        return context.remote ? context.remote.complete() : Promise.resolve();
    }
    else {
        for (const handler of context.nextUnsafeHandlers.splice(0)) {
            handler.resolve(message.value);
        }
        return context.remote
            ? context.remote.next(message.value)
            : Promise.resolve();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/combineLatest.js":
/*!***************************************************!*\
  !*** ./node_modules/@hullo/core/combineLatest.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ./observable */ "./node_modules/@hullo/core/observable.js");
const map_1 = __webpack_require__(/*! ./operators/map */ "./node_modules/@hullo/core/operators/map.js");
const of_1 = __webpack_require__(/*! ./of */ "./node_modules/@hullo/core/of.js");
function combineLatest(streams) {
    if (streams.length === 0) {
        return of_1.of([[]]);
    }
    if (streams.length === 1) {
        return streams[0].pipe(map_1.map(singleToArrayOfOne));
    }
    return new observable_1.Observable(new CombineLatestProducer(streams));
}
exports.combineLatest = combineLatest;
function singleToArrayOfOne(v) {
    return [v];
}
class CombineLatestProducer {
    constructor(streams) {
        this.streams = streams;
    }
    subscribe(observer) {
        const context = {
            closed: false,
            streams: this.streams,
            subs: [],
            everyOk: this.streams.map(() => false),
            allOk: false,
            values: [],
            frame: undefined,
            observer
        };
        for (let i = 0, l = context.streams.length; i < l; i++) {
            context.subs[i] = context.streams[i].subscribe(new CombineLatestEntryObserver(context, i));
        }
        return new CombineLatestCancel(context);
    }
}
class CombineLatestCancel {
    constructor(context) {
        this.context = context;
    }
    cancel() {
        this.context.closed = true;
        for (let i = 0, l = this.context.subs.length; i < l; i++) {
            if (!this.context.subs[i].closed) {
                this.context.subs[i].cancel();
            }
        }
    }
}
class CombineLatestEntryObserver {
    constructor(_context, _position) {
        this._context = _context;
        this._position = _position;
    }
    get closed() {
        return this._context.closed;
    }
    next(value) {
        if (this._context.closed) {
            return Promise.resolve();
        }
        if (this._context.frame && this._context.frame.completion) {
            const frame = this._context.frame;
            return new Promise(r => frameDeliveryProducer(frame, r));
        }
        const values = this._context.values.slice(0);
        values[this._position] = value;
        const frame = {
            sent: false,
            completion: false,
            values,
            merged: this._context.frame
        };
        this._context.frame = frame;
        this._context.values = values;
        if (!this._context.allOk) {
            if (!this._context.everyOk[this._position]) {
                this._context.everyOk[this._position] = true;
                this._context.allOk = true;
                for (let i = 0, l = this._context.everyOk.length; i < l; i++) {
                    if (!this._context.everyOk[i]) {
                        this._context.allOk = false;
                        break;
                    }
                }
            }
        }
        if (this._context.allOk) {
            Promise.resolve(this._context).then(send);
        }
        return new Promise(r => frameDeliveryProducer(frame, r));
    }
    complete() {
        if (this._context.closed) {
            return Promise.resolve();
        }
        if (this._context.frame && this._context.frame.completion) {
            const frame = this._context.frame;
            return new Promise(r => frameDeliveryProducer(frame, r));
        }
        const frame = {
            sent: false,
            completion: true,
            values: this._context.values,
            merged: this._context.frame
        };
        this._context.frame = frame;
        Promise.resolve(this._context).then(send);
        for (let i = 0, l = this._context.subs.length; i < l; i++) {
            if (i !== this._position && !this._context.subs[i].closed) {
                this._context.subs[i].cancel();
            }
        }
        return new Promise(r => frameDeliveryProducer(frame, r));
    }
}
function send(context) {
    if (context.closed || !context.frame || !context.observer) {
        return;
    }
    const frame = context.frame;
    context.frame = undefined;
    if (frame.completion) {
        context.closed = true;
    }
    (frame.completion
        ? context.observer.complete()
        : context.observer.next(frame.values)).then(() => frameDeliveryConfirmations(frame));
}
function frameDeliveryProducer(frame, resolve) {
    if (frame.sent) {
        resolve();
    }
    else {
        if (frame.acks) {
            frame.acks.push(resolve);
        }
        else {
            frame.acks = [resolve];
        }
    }
}
function frameDeliveryConfirmations(frame) {
    let innerFrame = frame;
    while (innerFrame) {
        innerFrame.sent = true;
        for (let i = 0, l = innerFrame.acks ? innerFrame.acks.length : 0; i < l; i += 1) {
            innerFrame.acks[i]();
        }
        innerFrame = innerFrame.merged;
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/duplex.js":
/*!********************************************!*\
  !*** ./node_modules/@hullo/core/duplex.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
"use strict";
const observable_1 = __webpack_require__(/*! ./observable */ "./node_modules/@hullo/core/observable.js");
const duplexSymbol = Symbol("is Duplex");
class Duplex extends observable_1.Observable {
    constructor(observable, observer) {
        super(Duplex.prototype.duplexProduce);
        this.observable = observable;
        this.observer = observer;
        this[_a] = true;
    }
    duplexProduce(observer) {
        return this.observable.subscribe(observer);
    }
    get closed() {
        return this.observer.closed;
    }
    next(value) {
        return this.observer.next(value);
    }
    complete() {
        return this.observer.complete();
    }
}
_a = duplexSymbol;
exports.Duplex = Duplex;


/***/ }),

/***/ "./node_modules/@hullo/core/observable.js":
/*!************************************************!*\
  !*** ./node_modules/@hullo/core/observable.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
"use strict";
exports.observableSymbol = Symbol("is observable");
class Observable {
    constructor(produce) {
        this.produce = produce;
        this[_a] = true;
    }
    static isObservable(o) {
        return o != null && typeof o === "object" && o[exports.observableSymbol];
    }
    subscribe(observer) {
        const observation = {
            stage: Stage.active,
            subscriber: observer
        };
        const sub = new BaseSubscription(observation);
        const teardown = typeof this.produce === "function"
            ? this.produce(new BaseObserver(observation))
            : this.produce.subscribe(new BaseObserver(observation));
        if (isTeardown(teardown)) {
            observation.teardown = teardown;
        }
        return sub;
    }
    pipe(transducer) {
        return transducer(this);
    }
}
_a = exports.observableSymbol;
exports.Observable = Observable;
class BaseSubscription {
    constructor(observation) {
        this.observation = observation;
    }
    get closed() {
        const { stage } = this.observation;
        return stage === Stage.cancelled || stage === Stage.completed;
    }
    cancel() {
        this.observation.stage = Stage.cancelled;
        const { teardown, sending } = this.observation;
        if (teardown) {
            (sending || Promise.resolve()).then(() => {
                doTeardown(teardown);
            });
        }
    }
}
class BaseObserver {
    constructor(observation) {
        this.observation = observation;
    }
    get closed() {
        return this.observation.stage !== Stage.active;
    }
    next(value) {
        const { stage, subscriber, sending } = this.observation;
        if (stage !== Stage.active || !subscriber.next) {
            return Promise.resolve();
        }
        if (sending) {
            return sending.then(() => {
                this.observation.sending = undefined;
                return this.next(value);
            });
        }
        const nextSending = subscriber.next(value) || undefined;
        this.observation.sending = nextSending;
        return nextSending || Promise.resolve();
    }
    complete() {
        const { stage, subscriber, sending } = this.observation;
        if (stage !== Stage.active || !subscriber.complete) {
            return Promise.resolve();
        }
        if (sending) {
            return sending.then(() => {
                this.observation.sending = undefined;
                return this.complete();
            });
        }
        this.observation.stage = Stage.completed;
        const nextSending = subscriber.complete() || undefined;
        this.observation.sending = nextSending;
        return nextSending || Promise.resolve();
    }
}
var Stage;
(function (Stage) {
    Stage[Stage["active"] = 0] = "active";
    Stage[Stage["completed"] = 1] = "completed";
    Stage[Stage["cancelled"] = 2] = "cancelled";
})(Stage || (Stage = {}));
function doTeardown(t) {
    if (t && typeof t === "function") {
        t();
        return;
    }
    if (t &&
        typeof t === "object" &&
        "cancel" in t &&
        typeof t.cancel === "function") {
        t.cancel();
        return;
    }
}
function isTeardown(t) {
    return (t != null &&
        (typeof t === "function" || (typeof t === "object" && "cancel" in t)));
}


/***/ }),

/***/ "./node_modules/@hullo/core/of.js":
/*!****************************************!*\
  !*** ./node_modules/@hullo/core/of.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ./observable */ "./node_modules/@hullo/core/observable.js");
function of(source, autoclose = true) {
    if (typeof source === "object" && Symbol.asyncIterator in source) {
        const asyncSource = source;
        return new observable_1.Observable(new AsyncSourceProducer(asyncSource, autoclose));
    }
    if (typeof source === "object" && Symbol.iterator in source) {
        const syncSource = source;
        return new observable_1.Observable(new SyncSourceProducer(syncSource, autoclose));
    }
    const unitSource = source;
    return new observable_1.Observable(new UnitProducer(unitSource, autoclose));
}
exports.of = of;
class AsyncSourceProducer {
    constructor(source, autoclose) {
        this.source = source;
        this.autoclose = autoclose;
    }
    subscribe(observer) {
        const context = {
            observer,
            asyncIterable: this.source,
            asyncIterator: this.source[Symbol.asyncIterator](),
            retrieving: false,
            drained: false,
            cancelled: false,
            autoclose: this.autoclose
        };
        asyncSourceIterate(context);
        return new AsyncSourceCancel(context);
    }
}
function asyncSourceIterate(context) {
    if (context.cancelled &&
        context.asyncIterator &&
        context.asyncIterator.return) {
        context.asyncIterator.return();
    }
    if (context.cancelled || context.drained) {
        return;
    }
    context.retrieving = true;
    context.asyncIterator
        .next()
        .then(iteration => resultHandler(context, iteration));
}
function resultHandler(context, iteration) {
    context.retrieving = false;
    if (context.cancelled &&
        context.asyncIterator &&
        context.asyncIterator.return) {
        context.asyncIterator.return();
    }
    if (context.drained || context.cancelled) {
        return;
    }
    if (iteration.done) {
        context.drained = true;
        if (context.autoclose) {
            context.observer.complete();
        }
    }
    else {
        context.observer
            .next(iteration.value)
            .then(() => asyncSourceIterate(context));
    }
}
class AsyncSourceCancel {
    constructor(context) {
        this.context = context;
    }
    cancel() {
        this.context.cancelled = true;
        if (!this.context.retrieving &&
            this.context.asyncIterator &&
            this.context.asyncIterator.return) {
            this.context.asyncIterator.return();
        }
    }
}
class SyncSourceProducer {
    constructor(source, autoclose) {
        this.source = source;
        this.autoclose = autoclose;
    }
    subscribe(observer) {
        const context = {
            observer,
            iterable: this.source,
            drained: false,
            cancelled: false,
            autoclose: this.autoclose
        };
        syncSourceIterate(context);
        return new SyncSourceCancel(context);
    }
}
function syncSourceIterate(context) {
    if (context.drained || context.cancelled) {
        return;
    }
    const iteration = (context.iterator || (context.iterator = context.iterable[Symbol.iterator]())).next();
    if (iteration.done) {
        context.drained = true;
        if (context.autoclose) {
            context.observer.complete();
        }
    }
    else {
        context.observer
            .next(iteration.value)
            .then(() => syncSourceIterate(context));
    }
}
class SyncSourceCancel {
    constructor(context) {
        this.context = context;
    }
    cancel() {
        this.context.cancelled = true;
        if (this.context.iterator && this.context.iterator.return) {
            this.context.iterator.return();
        }
    }
}
// ::of single value
class UnitProducer {
    constructor(value, autoclose) {
        this.value = value;
        this.autoclose = autoclose;
    }
    subscribe(observer) {
        observer.next(this.value).then(() => {
            if (observer.closed) {
                return;
            }
            if (this.autoclose) {
                observer.complete();
            }
        });
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/operators/deepMap.js":
/*!*******************************************************!*\
  !*** ./node_modules/@hullo/core/operators/deepMap.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ../observable */ "./node_modules/@hullo/core/observable.js");
const atom_1 = __webpack_require__(/*! ../atom */ "./node_modules/@hullo/core/atom.js");
function deepMap(xf) {
    return function deepMapI(source) {
        return new observable_1.Observable(new DeepMapProducer(xf, source));
    };
}
exports.deepMap = deepMap;
class DeepMapProducer {
    constructor(xf, source) {
        this.xf = xf;
        this.source = source;
    }
    subscribe(observer) {
        const context = {
            observer,
            xf: this.xf,
            source: this.source,
            detail$s: [],
            output: [],
            lastInput: []
        };
        const sub = this.source.subscribe(new DeepMapSourceObserver(context));
        return new DeepMapCancel(sub);
    }
}
class DeepMapCancel {
    constructor(sub) {
        this.sub = sub;
    }
    cancel() {
        if (!this.sub.closed) {
            this.sub.cancel();
        }
    }
}
class DeepMapSourceObserver {
    constructor(context) {
        this.context = context;
    }
    get closed() {
        return this.context.observer.closed;
    }
    next(list) {
        const { context } = this;
        const deliveries = [];
        let needsToPushOutput = false;
        for (let i = 0; i < list.length && i < context.output.length; i++) {
            if (context.detail$s[i].unwrap() !== list[i]) {
                const delivery = context.detail$s[i].next(list[i]);
                deliveries.push(delivery);
            }
        }
        for (let i = context.output.length, l = list.length; i < l; i++) {
            needsToPushOutput = true;
            const detail$ = new atom_1.Atom(list[i]);
            context.detail$s.push(detail$);
            context.output.push(context.xf(detail$, i));
            const delivery = detail$.next(list[i]);
            deliveries.push(delivery);
        }
        for (let i = list.length, l = context.output.length; i < l; i++) {
            needsToPushOutput = true;
            const delivery = context.detail$s[i].complete();
            deliveries.push(delivery);
        }
        context.detail$s.splice(list.length);
        context.output.splice(list.length);
        if (needsToPushOutput && context.observer) {
            const delivery = context.observer.next(context.output.slice(0));
            deliveries.push(delivery);
        }
        return deliveries.length ? Promise.all(deliveries) : Promise.resolve();
    }
    complete() {
        const { context } = this;
        if (!context.observer) {
            return Promise.resolve();
        }
        const deliveries = [];
        for (let i = 0, l = context.detail$s.length; i < l; i++) {
            const delivery = context.detail$s[i].complete();
            deliveries.push(delivery);
        }
        {
            const delivery = context.observer.complete();
            deliveries.push(delivery);
        }
        return Promise.all(deliveries);
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/operators/distinct.js":
/*!********************************************************!*\
  !*** ./node_modules/@hullo/core/operators/distinct.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ../observable */ "./node_modules/@hullo/core/observable.js");
function distinctEqual(source) {
    return new observable_1.Observable(new DistinctProducer(source, equal));
}
exports.distinctEqual = distinctEqual;
function equal(p, n) {
    return p != n;
}
function distinctStrictEqual(source) {
    return new observable_1.Observable(new DistinctProducer(source, strictEqual));
}
exports.distinctStrictEqual = distinctStrictEqual;
function strictEqual(p, n) {
    return p !== n;
}
function distinct(compare) {
    return function distinctI(source) {
        return new observable_1.Observable(new DistinctProducer(source, compare));
    };
}
exports.distinct = distinct;
class DistinctProducer {
    constructor(source, compare) {
        this.source = source;
        this.compare = compare;
    }
    subscribe(observer) {
        const sub = this.source.subscribe(new DistinctSourceObserver(observer, this.compare));
        return new DistinctCancel(sub);
    }
}
class DistinctCancel {
    constructor(sub) {
        this.sub = sub;
    }
    cancel() {
        if (!this.sub.closed) {
            this.sub.cancel();
        }
    }
}
class DistinctSourceObserver {
    constructor(outerObserver, compare) {
        this.outerObserver = outerObserver;
        this.compare = compare;
        this.last = null;
    }
    get closed() {
        return this.outerObserver.closed;
    }
    next(value) {
        if (this.last === null) {
            this.last = { value };
            return this.outerObserver.next(value);
        }
        else if (this.compare(this.last.value, value)) {
            this.last.value = value;
            return this.outerObserver.next(value);
        }
        return Promise.resolve();
    }
    complete() {
        return this.outerObserver.complete();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/operators/map.js":
/*!***************************************************!*\
  !*** ./node_modules/@hullo/core/operators/map.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ../observable */ "./node_modules/@hullo/core/observable.js");
function map(xf) {
    return function mapI(source) {
        return new observable_1.Observable(new MapProducer(source, xf));
    };
}
exports.map = map;
class MapProducer {
    constructor(source, xf) {
        this.source = source;
        this.xf = xf;
    }
    subscribe(observer) {
        const sub = this.source.subscribe(new MapSourceObserver(this.xf, observer));
        return new MapCancel(sub);
    }
}
class MapSourceObserver {
    constructor(xf, observer) {
        this.xf = xf;
        this.observer = observer;
    }
    get closed() {
        return this.observer.closed;
    }
    next(value) {
        const { xf } = this;
        return this.observer.next(xf(value));
    }
    complete() {
        return this.observer.complete();
    }
}
class MapCancel {
    constructor(sub) {
        this.sub = sub;
    }
    cancel() {
        if (!this.sub.closed) {
            this.sub.cancel();
        }
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/operators/state.js":
/*!*****************************************************!*\
  !*** ./node_modules/@hullo/core/operators/state.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ../observable */ "./node_modules/@hullo/core/observable.js");
function state(initial) {
    return function stateI(source) {
        return new State(initial, source);
    };
}
exports.state = state;
class State extends observable_1.Observable {
    constructor(value, source) {
        const context = {
            last: value,
            source,
            sourceSub: undefined,
            leeches: []
        };
        super(new StateProducer(context));
        this.context = context;
    }
    valueOf() {
        return this.context.last;
    }
    unwrap() {
        return this.context.last;
    }
}
exports.State = State;
class StateProducer {
    constructor(context) {
        this.context = context;
    }
    subscribe(observer) {
        const leechContext = {
            initialValueScheduled: true,
            observer
        };
        if (this.context.leeches == undefined) {
            this.context.leeches = [];
        }
        this.context.leeches.push(leechContext);
        Promise.resolve({ context: this.context, leechContext }).then(sendInitial);
        this.context.sourceSub =
            this.context.sourceSub ||
                this.context.source.subscribe(new StateSourceObserver(this.context));
        return new StateCancel(leechContext, this.context);
    }
}
function sendInitial({ context, leechContext }) {
    if (leechContext.initialValueScheduled) {
        leechContext.initialValueScheduled = false;
        leechContext.observer.next(context.last);
    }
}
class StateCancel {
    constructor(leech, context) {
        this.leech = leech;
        this.context = context;
    }
    cancel() {
        if (this.context.leeches != undefined) {
            const pos = this.context.leeches.indexOf(this.leech);
            if (pos >= 0) {
                this.context.leeches.splice(pos, 1);
                if (this.context.leeches.length === 0) {
                    const { sourceSub } = this.context;
                    this.context.sourceSub = undefined;
                    if (sourceSub && !sourceSub.closed) {
                        sourceSub.cancel();
                    }
                }
            }
        }
    }
}
class StateSourceObserver {
    constructor(context) {
        this.context = context;
    }
    get closed() {
        return this.context.leeches.length > 0;
    }
    next(value) {
        this.context.last = value;
        const deliveries = [];
        const { leeches } = this.context;
        if (leeches != undefined) {
            for (let i = 0, l = leeches.length; i < l; i++) {
                leeches[i].initialValueScheduled = false;
                const delivery = leeches[i].observer.next(value);
                deliveries.push(delivery);
            }
        }
        return deliveries.length ? Promise.all(deliveries) : Promise.resolve();
    }
    complete() {
        const deliveries = [];
        const { leeches } = this.context;
        this.context.leeches = [];
        if (leeches != undefined) {
            for (let i = 0, l = leeches.length; i < l; i++) {
                const delivery = leeches[i].observer.complete();
                deliveries.push(delivery);
            }
        }
        return deliveries.length ? Promise.all(deliveries) : Promise.resolve();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/core/operators/subject.js":
/*!*******************************************************!*\
  !*** ./node_modules/@hullo/core/operators/subject.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! ../observable */ "./node_modules/@hullo/core/observable.js");
function subject(source) {
    return new observable_1.Observable(new SubjectProducer(source, {
        observers: [],
        sourceSub: undefined
    }));
}
exports.subject = subject;
class SubjectProducer {
    constructor(source, context) {
        this.source = source;
        this.context = context;
    }
    subscribe(observer) {
        this.context.observers.push(observer);
        if (!this.context.sourceSub) {
            this.context.sourceSub = this.source.subscribe(new SubjectSourceObserver(this.context));
        }
        return new SubjectCancel(observer, this.context);
    }
}
class SubjectSourceObserver {
    constructor(context) {
        this.context = context;
    }
    get closed() {
        return this.context.observers.length === 0;
    }
    next(value) {
        const deliveries = [];
        const { observers } = this.context;
        for (let i = 0, l = observers.length; i < l; i++) {
            const delivery = observers[i].next(value);
            deliveries.push(delivery);
        }
        return deliveries.length ? Promise.all(deliveries) : Promise.resolve();
    }
    complete() {
        const deliveries = [];
        this.context.sourceSub = undefined;
        const observers = this.context.observers.splice(0);
        for (let i = 0, l = observers.length; i < l; i++) {
            const delivery = observers[i].complete();
            deliveries.push(delivery);
        }
        return deliveries.length ? Promise.all(deliveries) : Promise.resolve();
    }
}
class SubjectCancel {
    constructor(observer, context) {
        this.observer = observer;
        this.context = context;
    }
    cancel() {
        const pos = this.context.observers.indexOf(this.observer);
        if (pos >= 0) {
            this.context.observers.splice(pos, 1);
            if (this.context.observers.length === 0 && this.context.sourceSub) {
                const { sourceSub } = this.context;
                this.context.sourceSub = undefined;
                if (!sourceSub.closed) {
                    sourceSub.cancel();
                }
            }
        }
    }
}


/***/ }),

/***/ "./node_modules/@hullo/dom/element.js":
/*!********************************************!*\
  !*** ./node_modules/@hullo/dom/element.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const emptyProps = {};
const emptyChildren = [];
function element(tagName, desc, children2) {
    return {
        tagName,
        attrs: emptyProps,
        props: emptyProps,
        style: emptyProps,
        events: emptyProps,
        children: emptyChildren,
        ...desc,
        ...(children2 ? { children: children2 } : emptyProps)
    };
}
exports.element = element;


/***/ }),

/***/ "./node_modules/@hullo/dom/h.js":
/*!**************************************!*\
  !*** ./node_modules/@hullo/dom/h.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const element_1 = __webpack_require__(/*! ./element */ "./node_modules/@hullo/dom/element.js");
function h(...args) {
    if (typeof args[0] === "function") {
        const [component, props, ...children] = args;
        return component(children && children.length ? { ...props, children } : props);
    }
    const [tag, desc, ...children] = args;
    return element_1.element(tag, desc, children && children.length === 1 && typeof children[0] === "function"
        ? children[0]
        : children);
}
exports.h = h;


/***/ }),

/***/ "./node_modules/@hullo/dom/html.js":
/*!*****************************************!*\
  !*** ./node_modules/@hullo/dom/html.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const element_1 = __webpack_require__(/*! ./element */ "./node_modules/@hullo/dom/element.js");
function bindToTag(tagName) {
    return (desc, children) => element_1.element(tagName, desc, children);
}
var html;
(function (html_1) {
    html_1.a = bindToTag("a");
    html_1.abbr = bindToTag("abbr");
    html_1.address = bindToTag("address");
    html_1.applet = bindToTag("applet");
    html_1.area = bindToTag("area");
    html_1.article = bindToTag("article");
    html_1.aside = bindToTag("aside");
    html_1.audio = bindToTag("audio");
    html_1.b = bindToTag("b");
    html_1.base = bindToTag("base");
    html_1.basefont = bindToTag("basefont");
    html_1.bdo = bindToTag("bdo");
    html_1.blockquote = bindToTag("blockquote");
    html_1.body = bindToTag("body");
    html_1.br = bindToTag("br");
    html_1.button = bindToTag("button");
    html_1.canvas = bindToTag("canvas");
    html_1.caption = bindToTag("caption");
    html_1.cite = bindToTag("cite");
    html_1.code = bindToTag("code");
    html_1.col = bindToTag("col");
    html_1.colgroup = bindToTag("colgroup");
    html_1.data = bindToTag("data");
    html_1.datalist = bindToTag("datalist");
    html_1.dd = bindToTag("dd");
    html_1.del = bindToTag("del");
    html_1.details = bindToTag("details");
    html_1.dfn = bindToTag("dfn");
    html_1.dialog = bindToTag("dialog");
    html_1.dir = bindToTag("dir");
    html_1.div = bindToTag("div");
    html_1.dl = bindToTag("dl");
    html_1.dt = bindToTag("dt");
    html_1.em = bindToTag("em");
    html_1.embed = bindToTag("embed");
    html_1.fieldset = bindToTag("fieldset");
    html_1.figcaption = bindToTag("figcaption");
    html_1.figure = bindToTag("figure");
    html_1.font = bindToTag("font");
    html_1.footer = bindToTag("footer");
    html_1.form = bindToTag("form");
    html_1.frame = bindToTag("frame");
    html_1.frameset = bindToTag("frameset");
    html_1.h1 = bindToTag("h1");
    html_1.h2 = bindToTag("h2");
    html_1.h3 = bindToTag("h3");
    html_1.h4 = bindToTag("h4");
    html_1.h5 = bindToTag("h5");
    html_1.h6 = bindToTag("h6");
    html_1.head = bindToTag("head");
    html_1.header = bindToTag("header");
    html_1.hgroup = bindToTag("hgroup");
    html_1.hr = bindToTag("hr");
    html_1.html = bindToTag("html");
    html_1.i = bindToTag("i");
    html_1.iframe = bindToTag("iframe");
    html_1.img = bindToTag("img");
    html_1.input = bindToTag("input");
    html_1.ins = bindToTag("ins");
    html_1.kbd = bindToTag("kbd");
    html_1.label = bindToTag("label");
    html_1.legend = bindToTag("legend");
    html_1.li = bindToTag("li");
    html_1.link = bindToTag("link");
    html_1.map = bindToTag("map");
    html_1.mark = bindToTag("mark");
    html_1.marquee = bindToTag("marquee");
    html_1.menu = bindToTag("menu");
    html_1.meta = bindToTag("meta");
    html_1.meter = bindToTag("meter");
    html_1.nav = bindToTag("nav");
    html_1.noscript = bindToTag("noscript");
    html_1.object = bindToTag("object");
    html_1.ol = bindToTag("ol");
    html_1.optgroup = bindToTag("optgroup");
    html_1.option = bindToTag("option");
    html_1.output = bindToTag("output");
    html_1.p = bindToTag("p");
    html_1.param = bindToTag("param");
    html_1.picture = bindToTag("picture");
    html_1.pre = bindToTag("pre");
    html_1.progress = bindToTag("progress");
    html_1.q = bindToTag("q");
    html_1.rt = bindToTag("rt");
    html_1.ruby = bindToTag("ruby");
    html_1.s = bindToTag("s");
    html_1.samp = bindToTag("samp");
    html_1.script = bindToTag("script");
    html_1.section = bindToTag("section");
    html_1.select = bindToTag("select");
    html_1.slot = bindToTag("slot");
    html_1.small = bindToTag("small");
    html_1.source = bindToTag("source");
    html_1.span = bindToTag("span");
    html_1.strong = bindToTag("strong");
    html_1.style = bindToTag("style");
    html_1.sub = bindToTag("sub");
    html_1.sup = bindToTag("sup");
    html_1.table = bindToTag("table");
    html_1.tbody = bindToTag("tbody");
    html_1.td = bindToTag("td");
    html_1.template = bindToTag("template");
    html_1.textarea = bindToTag("textarea");
    html_1.tfoot = bindToTag("tfoot");
    html_1.th = bindToTag("th");
    html_1.thead = bindToTag("thead");
    html_1.time = bindToTag("time");
    html_1.title = bindToTag("title");
    html_1.tr = bindToTag("tr");
    html_1.track = bindToTag("track");
    html_1.u = bindToTag("u");
    html_1.ul = bindToTag("ul");
    html_1.variable = bindToTag("var");
    html_1.video = bindToTag("video");
    html_1.wbr = bindToTag("wbr");
})(html = exports.html || (exports.html = {}));


/***/ }),

/***/ "./node_modules/@hullo/dom/index.js":
/*!******************************************!*\
  !*** ./node_modules/@hullo/dom/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./element */ "./node_modules/@hullo/dom/element.js"));
__export(__webpack_require__(/*! ./h */ "./node_modules/@hullo/dom/h.js"));
__export(__webpack_require__(/*! ./html */ "./node_modules/@hullo/dom/html.js"));
__export(__webpack_require__(/*! ./mount */ "./node_modules/@hullo/dom/mount.js"));
__export(__webpack_require__(/*! ./render */ "./node_modules/@hullo/dom/render.js"));
__export(__webpack_require__(/*! ./svg */ "./node_modules/@hullo/dom/svg.js"));


/***/ }),

/***/ "./node_modules/@hullo/dom/mount.js":
/*!******************************************!*\
  !*** ./node_modules/@hullo/dom/mount.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = __webpack_require__(/*! ./render */ "./node_modules/@hullo/dom/render.js");
function mount(mount, app) {
    const { element, possesion } = render_1.render(app);
    mount.appendChild(element);
    return () => {
        mount.removeChild(element);
        possesion.clean(element, true);
    };
}
exports.mount = mount;


/***/ }),

/***/ "./node_modules/@hullo/dom/render.js":
/*!*******************************************!*\
  !*** ./node_modules/@hullo/dom/render.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = __webpack_require__(/*! @hullo/core/observable */ "./node_modules/@hullo/core/observable.js");
const NO_POSSESSION = {
    clean() { }
};
function render(shape) {
    const e = document.createElement(shape.tagName);
    return { element: e, possesion: mold(e, shape) };
}
exports.render = render;
function render_internal(shape, inheritedSync) {
    const e = document.createElement(shape.tagName);
    return { element: e, possesion: mold(e, shape, inheritedSync) };
}
function mold(htmlElement, elementShape, inheritedSync) {
    const { attrs, props, events, style, children } = elementShape;
    const syncOptions = elementShape.sync || inheritedSync || "immediate";
    const possesions = new Array();
    for (const k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) {
            continue;
        }
        possesions.push(render_attr(htmlElement, syncOptions, k, attrs[k]));
    }
    for (const k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) {
            continue;
        }
        possesions.push(render_prop(htmlElement, syncOptions, k, props[k]));
    }
    for (const k in events) {
        if (!Object.prototype.hasOwnProperty.call(events, k)) {
            continue;
        }
        const handler = events[k];
        possesions.push(typeof handler === "function"
            ? render_event_regular(htmlElement, k, handler)
            : render_event_observer(htmlElement, k, handler));
    }
    for (const k in style) {
        if (!Object.prototype.hasOwnProperty.call(style, k)) {
            continue;
        }
        possesions.push(render_style(htmlElement, syncOptions, k, style[k]));
    }
    possesions.push(render_children(htmlElement, syncOptions, children));
    if (elementShape.ref) {
        elementShape.ref(htmlElement);
    }
    if (elementShape.deref) {
        possesions.push(new DerefPossesion(elementShape));
    }
    return new JoinedPossesions(possesions);
}
exports.mold = mold;
class JoinedPossesions {
    constructor(possesions) {
        this.possesions = possesions;
    }
    clean(htmlElement, abandonment) {
        for (let i = 0; i < this.possesions.length; i++) {
            this.possesions[i].clean(htmlElement, abandonment);
        }
    }
}
class DerefPossesion {
    constructor(shape) {
        this.shape = shape;
    }
    clean(htmlElement, _abandonment) {
        this.shape.deref(htmlElement);
    }
}
function render_children(htmlElement, syncOptions, childShapes$) {
    const children = {
        shapes: [],
        elements: [],
        possesions: []
    };
    return render_each(htmlElement, syncOptions, childShapes$, children, render_children_each, render_children_cleanup);
}
function render_children_each(htmlElement, syncOptions, nextShapes, children) {
    const { shapes, elements, possesions } = children;
    const nextElements = [];
    const nextPossesions = [];
    for (let i = 0; i < Math.max(shapes.length, nextShapes.length); i++) {
        const currentShape = shapes[i];
        const currentElement = elements[i];
        const currentPossesion = possesions[i];
        const nextShape = nextShapes[i];
        let nextShapePrevPos = -1;
        // element stays on position
        if (i < shapes.length &&
            i < nextShapes.length &&
            currentShape === nextShape) {
            nextElements.push(elements[i]);
            nextPossesions.push(possesions[i]);
        }
        // element exists and should be moved
        else if (i < nextShapes.length &&
            (nextShapePrevPos = shapes.indexOf(nextShape)) >= 0 &&
            nextShapes.indexOf(nextShape) === i) {
            nextElements.push(elements[nextShapePrevPos]);
            nextPossesions.push(possesions[nextShapePrevPos]);
        }
        //element remains
        else if (i < shapes.length && i < nextShapes.length) {
            const abandon = typeof currentShape === "string" ||
                typeof nextShape === "string" ||
                currentShape.tagName !== nextShape.tagName;
            if (typeof currentShape === "object") {
                currentPossesion.clean(currentElement, abandon);
            }
            const { element, possesion } = typeof nextShape === "string"
                ? {
                    element: document.createTextNode(nextShape),
                    possesion: NO_POSSESSION
                }
                : abandon
                    ? render_internal(nextShape, syncOptions)
                    : {
                        element: currentElement,
                        possesion: mold(currentElement, nextShape, syncOptions)
                    };
            nextElements.push(element);
            nextPossesions.push(possesion);
        }
        // element adding
        else if (i < nextShapes.length) {
            if (typeof nextShape === "string") {
                nextElements.push(document.createTextNode(nextShape));
                nextPossesions.push(NO_POSSESSION);
            }
            else {
                const { element, possesion } = render_internal(nextShape, syncOptions);
                nextElements.push(element);
                nextPossesions.push(possesion);
            }
        }
    }
    // diff
    let currVec = 0;
    let nextVec = 0;
    while (currVec < elements.length && nextVec < nextElements.length) {
        const currLen = elements.length;
        const nextLen = nextElements.length;
        const currElem = elements[currVec];
        const nextElem = nextElements[nextVec];
        if (currElem === nextElem) {
            currVec++;
            nextVec++;
            continue;
        }
        const currElementAtNext = nextElements.indexOf(currElem, nextVec);
        if (currElementAtNext < 0) {
            htmlElement.removeChild(currElem);
            currVec++;
            continue;
        }
        const nextElementAtCurr = elements.indexOf(nextElem, currVec);
        if (nextElementAtCurr < 0) {
            if (currVec < currLen) {
                htmlElement.insertBefore(nextElem, elements[currVec]);
            }
            else {
                htmlElement.appendChild(nextElem);
            }
            nextVec++;
            continue;
        }
        let fromCurrVecStableLen = 0;
        for (let distance = 0, max = Math.min(nextLen - currElementAtNext, currLen - currVec); distance < max; distance++) {
            if (elements[currVec + distance] ===
                nextElements[currElementAtNext + distance]) {
                fromCurrVecStableLen++;
            }
            else {
                break;
            }
        }
        let leftStaysBenefit = fromCurrVecStableLen - (currElementAtNext - nextVec);
        let fromNextVecStableLen = 0;
        for (let distance = 0, max = Math.min(currLen - nextElementAtCurr, nextLen - nextVec); distance < max; distance++) {
            if (elements[nextVec + distance] ===
                nextElements[nextElementAtCurr + distance]) {
                fromNextVecStableLen++;
            }
            else {
                break;
            }
        }
        let rightStaysBenefit = fromNextVecStableLen - (nextElementAtCurr - currVec);
        if (leftStaysBenefit > rightStaysBenefit && rightStaysBenefit > 0) {
            for (let i = nextVec; i < currElementAtNext; i++) {
                htmlElement.insertBefore(nextElements[i], currElem);
            }
            nextVec += currElementAtNext - nextVec;
            currVec += fromCurrVecStableLen;
            nextVec += fromCurrVecStableLen;
        }
        else if (rightStaysBenefit >= leftStaysBenefit && leftStaysBenefit > 0) {
            for (let i = currVec; i < nextElementAtCurr; i++) {
                htmlElement.removeChild(elements[i]);
            }
            currVec += nextElementAtCurr - currVec;
            currVec += fromNextVecStableLen;
            nextVec += fromNextVecStableLen;
        }
        else {
            htmlElement.replaceChild(nextElem, currElem);
            currVec++;
            nextVec++;
            elements.splice(nextElementAtCurr, 1);
            shapes.splice(nextElementAtCurr, 1);
            possesions.splice(nextElementAtCurr, 1);
        }
    }
    for (let i = currVec; i < elements.length; i++) {
        htmlElement.removeChild(elements[i]);
    }
    for (let i = nextVec; i < nextElements.length; i++) {
        htmlElement.appendChild(nextElements[i]);
    }
    children.shapes = nextShapes;
    children.elements = nextElements;
    children.possesions = nextPossesions;
}
function render_children_cleanup(htmlElement, _syncOptions, _children) {
    for (let i = 0, l = htmlElement.children.length; i < l; i++) {
        htmlElement.removeChild(htmlElement.firstChild);
    }
}
function render_event_regular(htmlElement, name, handler) {
    htmlElement.addEventListener(name, handler);
    return {
        clean: function cancelEventListenerApplication() {
            htmlElement.removeEventListener(name, handler);
        }
    };
}
function render_event_observer(htmlElement, name, handler) {
    const observer = handler;
    let closed = false;
    htmlElement.addEventListener(name, render_event_observer_listener);
    return {
        clean: render_event_observer_cancel
    };
    function render_event_observer_cancel() {
        if (closed) {
            return;
        }
        closed = true;
        htmlElement.removeEventListener(name, render_event_observer_listener);
        observer.complete();
    }
    function render_event_observer_listener(event) {
        if (closed) {
            return;
        }
        observer.next(event);
    }
}
function render_prop(htmlElement, syncOptions, name, value) {
    const hasDefaultValue = name in htmlElement;
    const defaultValue = hasDefaultValue ? htmlElement[name] : undefined;
    const state = {
        name,
        hasDefaultValue,
        defaultValue,
        lastValue: defaultValue
    };
    return render_each(htmlElement, syncOptions, value, state, render_prop_each, render_prop_cleanup);
}
function render_prop_each(htmlElement, _syncOptions, value, state) {
    if (value !== state.lastValue) {
        state.lastValue = value;
        htmlElement[state.name] = value;
    }
}
function render_prop_cleanup(htmlElement, _syncOptions, state) {
    if (state.hasDefaultValue) {
        if (state.defaultValue !== state.lastValue) {
            htmlElement[state.name] = state.defaultValue;
        }
    }
    else {
        if (name in htmlElement) {
            delete htmlElement[state.name];
        }
    }
}
function render_style(htmlElement, syncOptions, name, value) {
    const defaultValue = htmlElement.style[name];
    const state = {
        name,
        defaultValue,
        lastValue: defaultValue
    };
    return render_each(htmlElement, syncOptions, value, state, render_style_each, render_style_cleanup);
}
function render_style_each(htmlElement, _syncOptions, value, state) {
    if (value !== state.lastValue) {
        state.lastValue = value;
        htmlElement.style[state.name] = value;
    }
}
function render_style_cleanup(htmlElement, _syncOptions, state) {
    if (state.defaultValue !== state.lastValue) {
        htmlElement.style[state.name] = state.defaultValue;
    }
}
function render_attr(htmlElement, syncOptions, name, value) {
    const defaultValue = htmlElement.getAttribute(name);
    return render_each(htmlElement, syncOptions, value, { name, defaultValue, lastValue: defaultValue }, render_attr_each, render_attr_cleanup);
}
function render_attr_each(htmlElement, _syncOptions, value, state) {
    if (value !== state.lastValue) {
        state.lastValue = value;
        if (value == null) {
            htmlElement.removeAttribute(state.name);
        }
        else {
            htmlElement.setAttribute(state.name, value);
        }
    }
}
function render_attr_cleanup(htmlElement, _syncOptions, state) {
    if (state.defaultValue !== state.lastValue) {
        if (state.defaultValue == null) {
            htmlElement.removeAttribute(state.name);
        }
        else {
            htmlElement.setAttribute(state.name, state.defaultValue);
        }
    }
}
function render_each(htmlElement, syncMode, streamOrValue, state, process, cleanup) {
    if (observable_1.Observable.isObservable(streamOrValue)) {
        const isClosed = { ref: false };
        return new RenderEachStreamPossesions(isClosed, cleanup, streamOrValue.subscribe(new RenderEachObserver(isClosed, htmlElement, syncMode, state, process)), syncMode, state);
    }
    else {
        process(htmlElement, syncMode, streamOrValue, state);
        return new RenderEachPossesions(cleanup, syncMode, state);
    }
}
class RenderEachObserver {
    constructor(isClosed, htmlElement, syncMode, state, process) {
        this.isClosed = isClosed;
        this.htmlElement = htmlElement;
        this.syncMode = syncMode;
        this.state = state;
        this.process = process;
    }
    get closed() {
        return this.isClosed.ref;
    }
    next(singleValue) {
        this.process(this.htmlElement, this.syncMode, singleValue, this.state);
        if (this.syncMode !== "immediate") {
            return whenPainted();
        }
        return Promise.resolve();
    }
    complete() {
        return Promise.resolve();
    }
}
class RenderEachStreamPossesions {
    constructor(isClosed, cleanup, subscription, syncMode, state) {
        this.isClosed = isClosed;
        this.cleanup = cleanup;
        this.subscription = subscription;
        this.syncMode = syncMode;
        this.state = state;
    }
    clean(htmlElement, abandonment) {
        this.isClosed.ref = true;
        if (!abandonment) {
            this.cleanup(htmlElement, this.syncMode, this.state);
        }
        if (this.subscription && !this.subscription.closed) {
            this.subscription.cancel();
        }
    }
}
class RenderEachPossesions {
    constructor(cleanup, syncMode, state) {
        this.cleanup = cleanup;
        this.syncMode = syncMode;
        this.state = state;
    }
    clean(htmlElement, abandonment) {
        if (!abandonment) {
            this.cleanup(htmlElement, this.syncMode, this.state);
        }
    }
}
// paint sync
let resolveWhenPainted = null;
let whenPaintedTask = null;
const whenPainted = typeof window === "undefined" || !("requestAnimationFrame" in window)
    ? function getWhenPainted() {
        return (whenPaintedTask ||
            (whenPaintedTask = new Promise(whenPainter_timeout)));
    }
    : function getWhenPainted() {
        return (whenPaintedTask ||
            (whenPaintedTask = new Promise(whenPainted_raf)));
    };
function whenPainter_timeout(resolve) {
    setTimeout(flushWhenPaintedCbs, 0);
    resolveWhenPainted = resolve;
}
function whenPainted_raf(resolve) {
    window.requestAnimationFrame(flushWhenPaintedCbs);
    resolveWhenPainted = resolve;
}
function flushWhenPaintedCbs() {
    whenPaintedTask = null;
    if (resolveWhenPainted) {
        const _whenPaintedConsumer = resolveWhenPainted;
        resolveWhenPainted = null;
        _whenPaintedConsumer();
    }
}


/***/ }),

/***/ "./node_modules/@hullo/dom/svg.js":
/*!****************************************!*\
  !*** ./node_modules/@hullo/dom/svg.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const element_1 = __webpack_require__(/*! ./element */ "./node_modules/@hullo/dom/element.js");
function bindToTag(tagName) {
    return (desc, children) => element_1.element(tagName, desc, children);
}
var svg;
(function (svg_1) {
    svg_1.a = bindToTag("a");
    svg_1.altGlyph = bindToTag("altGlyph");
    svg_1.altGlyphDef = bindToTag("altGlyphDef");
    svg_1.altGlyphItem = bindToTag("altGlyphItem");
    svg_1.animate = bindToTag("animate");
    svg_1.animateColor = bindToTag("animateColor");
    svg_1.animateMotion = bindToTag("animateMotion");
    svg_1.animateTransform = bindToTag("animateTransform");
    svg_1.audio = bindToTag("audio");
    svg_1.canvas = bindToTag("canvas");
    svg_1.circle = bindToTag("circle");
    svg_1.clipPath = bindToTag("clipPath");
    svg_1.colorProfile = bindToTag("color-profile");
    svg_1.cursor = bindToTag("cursor");
    svg_1.defs = bindToTag("defs");
    svg_1.desc = bindToTag("desc");
    svg_1.discard = bindToTag("discard");
    svg_1.ellipse = bindToTag("ellipse");
    svg_1.feBlend = bindToTag("feBlend");
    svg_1.feColorMatrix = bindToTag("feColorMatrix");
    svg_1.feComponentTransfer = bindToTag("feComponentTransfer");
    svg_1.feComposite = bindToTag("feComposite");
    svg_1.feConvolveMatrix = bindToTag("feConvolveMatrix");
    svg_1.feDiffuseLighting = bindToTag("feDiffuseLighting");
    svg_1.feDisplacementMap = bindToTag("feDisplacementMap");
    svg_1.feDistantLight = bindToTag("feDistantLight");
    svg_1.feDropShadow = bindToTag("feDropShadow");
    svg_1.feFlood = bindToTag("feFlood");
    svg_1.feFuncA = bindToTag("feFuncA");
    svg_1.feFuncB = bindToTag("feFuncB");
    svg_1.feFuncG = bindToTag("feFuncG");
    svg_1.feFuncR = bindToTag("feFuncR");
    svg_1.feGaussianBlur = bindToTag("feGaussianBlur");
    svg_1.feImage = bindToTag("feImage");
    svg_1.feMerge = bindToTag("feMerge");
    svg_1.feMergeNode = bindToTag("feMergeNode");
    svg_1.feMorphology = bindToTag("feMorphology");
    svg_1.feOffset = bindToTag("feOffset");
    svg_1.fePointLight = bindToTag("fePointLight");
    svg_1.feSpecularLighting = bindToTag("feSpecularLighting");
    svg_1.feSpotLight = bindToTag("feSpotLight");
    svg_1.feTile = bindToTag("feTile");
    svg_1.feTurbulence = bindToTag("feTurbulence");
    svg_1.filter = bindToTag("filter");
    svg_1.font = bindToTag("font");
    svg_1.fontFace = bindToTag("font-face");
    svg_1.fontFaceFormat = bindToTag("font-face-format");
    svg_1.fontFaceName = bindToTag("font-face-name");
    svg_1.fontFaceSrc = bindToTag("font-face-src");
    svg_1.fontFaceUri = bindToTag("font-face-uri");
    svg_1.foreignObject = bindToTag("foreignObject");
    svg_1.g = bindToTag("g");
    svg_1.glyph = bindToTag("glyph");
    svg_1.glyphRef = bindToTag("glyphRef");
    svg_1.hatch = bindToTag("hatch");
    svg_1.hatchpath = bindToTag("hatchpath");
    svg_1.hkern = bindToTag("hkern");
    svg_1.iframe = bindToTag("iframe");
    svg_1.image = bindToTag("image");
    svg_1.line = bindToTag("line");
    svg_1.linearGradient = bindToTag("linearGradient");
    svg_1.marker = bindToTag("marker");
    svg_1.mask = bindToTag("mask");
    svg_1.mesh = bindToTag("mesh");
    svg_1.meshgradient = bindToTag("meshgradient");
    svg_1.meshpatch = bindToTag("meshpatch");
    svg_1.meshrow = bindToTag("meshrow");
    svg_1.metadata = bindToTag("metadata");
    svg_1.missingGlyph = bindToTag("missing-glyph");
    svg_1.mpath = bindToTag("mpath");
    svg_1.path = bindToTag("path");
    svg_1.pattern = bindToTag("pattern");
    svg_1.polygon = bindToTag("polygon");
    svg_1.polyline = bindToTag("polyline");
    svg_1.radialGradient = bindToTag("radialGradient");
    svg_1.rect = bindToTag("rect");
    svg_1.script = bindToTag("script");
    svg_1.set = bindToTag("set");
    svg_1.solidcolor = bindToTag("solidcolor");
    svg_1.stop = bindToTag("stop");
    svg_1.style = bindToTag("style");
    svg_1.svg = bindToTag("svg");
    svg_1.switchElement = bindToTag("switch");
    svg_1.symbol = bindToTag("symbol");
    svg_1.text = bindToTag("text");
    svg_1.textPath = bindToTag("textPath");
    svg_1.title = bindToTag("title");
    svg_1.tref = bindToTag("tref");
    svg_1.tspan = bindToTag("tspan");
    svg_1.unknown = bindToTag("unknown");
    svg_1.use = bindToTag("use");
    svg_1.video = bindToTag("video");
    svg_1.view = bindToTag("view");
    svg_1.vkern = bindToTag("vkern");
})(svg = exports.svg || (exports.svg = {}));


/***/ }),

/***/ "./node_modules/history/esm/history.js":
/*!*********************************************!*\
  !*** ./node_modules/history/esm/history.js ***!
  \*********************************************/
/*! exports provided: createBrowserHistory, createHashHistory, createMemoryHistory, createLocation, locationsAreEqual, parsePath, createPath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBrowserHistory", function() { return createBrowserHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createHashHistory", function() { return createHashHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMemoryHistory", function() { return createMemoryHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLocation", function() { return createLocation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "locationsAreEqual", function() { return locationsAreEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parsePath", function() { return parsePath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createPath", function() { return createPath; });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var resolve_pathname__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! resolve-pathname */ "./node_modules/resolve-pathname/index.js");
/* harmony import */ var value_equal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! value-equal */ "./node_modules/value-equal/index.js");
/* harmony import */ var tiny_warning__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tiny-warning */ "./node_modules/tiny-warning/dist/tiny-warning.esm.js");
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tiny-invariant */ "./node_modules/tiny-invariant/dist/tiny-invariant.esm.js");






function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
function hasBasename(path, prefix) {
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = Object(resolve_pathname__WEBPACK_IMPORTED_MODULE_1__["default"])(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && Object(value_equal__WEBPACK_IMPORTED_MODULE_2__["default"])(a.state, b.state);
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(prompt == null, 'A history supports only one prompt at a time') : undefined;
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
           true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(false, 'A history needs a getUserConfirmation function in order to use a prompt message') : undefined;
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  true ? Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_4__["default"])(false, 'Browser history needs a DOM') : undefined : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : undefined;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : undefined;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history') : undefined;
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : undefined;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history') : undefined;
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var HashChangeEvent$1 = 'hashchange';
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  var hashIndex = window.location.href.indexOf('#');
  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
}

function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  true ? Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_4__["default"])(false, 'Hash history needs a DOM') : undefined : void 0;
  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
  var _props = props,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$hashType = _props.hashType,
      hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;

  function getDOMLocation() {
    var path = decodePath(getHashPath());
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : undefined;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  var forceNextPop = false;
  var ignorePath = null;

  function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;
      if (!forceNextPop && locationsAreEqual(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;
      handlePop(location);
    }
  }

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  } // Ensure the hash is encoded properly before doing anything else.


  var path = getHashPath();
  var encodedPath = encodePath(path);
  if (path !== encodedPath) replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)]; // Public interface

  function createHref(location) {
    return '#' + encodePath(basename + createPath(location));
  }

  function push(path, state) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(state === undefined, 'Hash history cannot push state; it is ignored') : undefined;
    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);
        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
        nextPaths.push(path);
        allPaths = nextPaths;
        setState({
          action: action,
          location: location
        });
      } else {
         true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack') : undefined;
        setState();
      }
    });
  }

  function replace(path, state) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(state === undefined, 'Hash history cannot replace state; it is ignored') : undefined;
    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));
      if (prevIndex !== -1) allPaths[prevIndex] = path;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : undefined;
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/**
 * Creates a history object that stores locations in memory.
 */


function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      getUserConfirmation = _props.getUserConfirmation,
      _props$initialEntries = _props.initialEntries,
      initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
      _props$initialIndex = _props.initialIndex,
      initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();

  function setState(nextState) {
    Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])(history, nextState);

    history.length = history.entries.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  }); // Public interface

  var createHref = createPath;

  function push(path, state) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : undefined;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history.entries.slice(0);

      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }

  function replace(path, state) {
     true ? Object(tiny_warning__WEBPACK_IMPORTED_MODULE_3__["default"])(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : undefined;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      history.entries[history.index] = location;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
    var action = 'POP';
    var location = history.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  }

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    return transitionManager.setPrompt(prompt);
  }

  function listen(listener) {
    return transitionManager.appendListener(listener);
  }

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };
  return history;
}




/***/ }),

/***/ "./node_modules/resolve-pathname/index.js":
/*!************************************************!*\
  !*** ./node_modules/resolve-pathname/index.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (resolvePathname);

/***/ }),

/***/ "./node_modules/tiny-invariant/dist/tiny-invariant.esm.js":
/*!****************************************************************!*\
  !*** ./node_modules/tiny-invariant/dist/tiny-invariant.esm.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var isProduction = "development" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
  if (condition) {
    return;
  }

  if (isProduction) {
    throw new Error(prefix);
  } else {
    throw new Error(prefix + ": " + (message || ''));
  }
}

/* harmony default export */ __webpack_exports__["default"] = (invariant);


/***/ }),

/***/ "./node_modules/tiny-warning/dist/tiny-warning.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/tiny-warning/dist/tiny-warning.esm.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var isProduction = "development" === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

/* harmony default export */ __webpack_exports__["default"] = (warning);


/***/ }),

/***/ "./node_modules/value-equal/index.js":
/*!*******************************************!*\
  !*** ./node_modules/value-equal/index.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function valueEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return valueEqual(item, b[index]);
    });
  }

  var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);

  if (aType !== bType) return false;

  if (aType === 'object') {
    var aValue = a.valueOf();
    var bValue = b.valueOf();

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(function (key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (valueEqual);

/***/ }),

/***/ "./ts/Adder.ts":
/*!*********************!*\
  !*** ./ts/Adder.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = __webpack_require__(/*! @hullo/core/channel */ "./node_modules/@hullo/core/channel.js");
var atom_1 = __webpack_require__(/*! @hullo/core/atom */ "./node_modules/@hullo/core/atom.js");
var map_1 = __webpack_require__(/*! @hullo/core/operators/map */ "./node_modules/@hullo/core/operators/map.js");
var html_1 = __webpack_require__(/*! @hullo/dom/html */ "./node_modules/@hullo/dom/html.js");
function Adder(props) {
    var onInput = new channel_1.Channel();
    var newTask = new atom_1.Atom("");
    onInput
        .pipe(map_1.map(function (event) { return event.target.value; }))
        .subscribe(newTask);
    return html_1.html.header({ attrs: { class: "header" } }, [
        html_1.html.h1({ props: { innerText: "todos" } }),
        html_1.html.input({
            attrs: {
                class: "new-todo",
                autofocus: "autofocus",
                autocomplete: "off",
                placeholder: "What needs to be done?"
            },
            props: { value: newTask },
            events: {
                input: onInput,
                keydown: function (event) {
                    if (event instanceof KeyboardEvent && event.keyCode === 13) {
                        props.onAdd(newTask.unwrap());
                        newTask.next("");
                    }
                }
            }
        })
    ]);
}
exports.Adder = Adder;


/***/ }),

/***/ "./ts/App.ts":
/*!*******************!*\
  !*** ./ts/App.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = __webpack_require__(/*! history */ "./node_modules/history/esm/history.js");
var route_1 = __webpack_require__(/*! @hullo/browser/route */ "./node_modules/@hullo/browser/route.js");
var ofHistory_1 = __webpack_require__(/*! @hullo/browser/ofHistory */ "./node_modules/@hullo/browser/ofHistory.js");
var atom_1 = __webpack_require__(/*! @hullo/core/atom */ "./node_modules/@hullo/core/atom.js");
var combineLatest_1 = __webpack_require__(/*! @hullo/core/combineLatest */ "./node_modules/@hullo/core/combineLatest.js");
var map_1 = __webpack_require__(/*! @hullo/core/operators/map */ "./node_modules/@hullo/core/operators/map.js");
var state_1 = __webpack_require__(/*! @hullo/core/operators/state */ "./node_modules/@hullo/core/operators/state.js");
var html_1 = __webpack_require__(/*! @hullo/dom/html */ "./node_modules/@hullo/dom/html.js");
var filters_1 = __webpack_require__(/*! ./filters */ "./ts/filters.ts");
var Adder_1 = __webpack_require__(/*! ./Adder */ "./ts/Adder.ts");
var Main_1 = __webpack_require__(/*! ./Main */ "./ts/Main.ts");
var Footer_1 = __webpack_require__(/*! ./Footer */ "./ts/Footer.ts");
function App() {
    var tasksSerialized = window.localStorage.getItem("todos-hullo");
    var tasks$ = new atom_1.Atom(tasksSerialized ? JSON.parse(tasksSerialized) : []);
    tasks$.subscribe({
        next: function (tasks) {
            window.localStorage.setItem("todos-hullo", JSON.stringify(tasks));
        }
    });
    var selectedFilter$ = ofHistory_1.ofHistory(history_1.createHashHistory())
        .pipe(route_1.route([
        {
            when: /^\/([a-z]*)$/,
            have: function (_a) {
                var filter = _a[0];
                return (filter in filters_1.filters ? filter : "all");
            }
        }
    ]))
        .pipe(state_1.state("all"));
    var selectedTasks$ = combineLatest_1.combineLatest([
        tasks$,
        selectedFilter$
    ]).pipe(map_1.map(function (_a) {
        var tasks = _a[0], selectedFilter = _a[1];
        return filters_1.filters[selectedFilter](tasks);
    }));
    return html_1.html.section({
        attrs: { class: "todoapp" }
    }, [
        Adder_1.Adder({
            onAdd: function (label) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tasks$.update(function (tasks) {
                                    return tasks.concat([
                                        {
                                            label: label,
                                            completed: selectedFilter$.unwrap() === "completed"
                                        }
                                    ]);
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }),
        Main_1.Main({
            tasks$: tasks$,
            selectedTasks$: selectedTasks$,
            onToggle: function (idx) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tasks$.update(function (tasks) {
                                    return tasks.map(function (task, i) {
                                        return i === idx ? __assign({}, task, { completed: !task.completed }) : task;
                                    });
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            onRemove: function (idx) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tasks$.update(function (tasks) { return tasks.filter(function (_tasks, i) { return i !== idx; }); })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            onRename: function (idx, label) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tasks$.update(function (tasks) {
                                    return tasks.map(function (task, i) { return (i === idx ? __assign({}, task, { label: label }) : task); });
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            onToggleAll: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var tasks, completed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                tasks = tasks$.unwrap();
                                completed = filters_1.filters.active(tasks).length > 0;
                                return [4 /*yield*/, tasks$.update(function (tasks) {
                                        return tasks.map(function (_a) {
                                            var label = _a.label;
                                            return ({ label: label, completed: completed });
                                        });
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }),
        Footer_1.Footer({
            tasks$: tasks$,
            selectedFilter$: selectedFilter$,
            clearCompleted: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tasks$.update(function (tasks) { return tasks.filter(function (task) { return !task.completed; }); })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        })
    ]);
}
exports.App = App;


/***/ }),

/***/ "./ts/Footer.ts":
/*!**********************!*\
  !*** ./ts/Footer.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __webpack_require__(/*! @hullo/dom/html */ "./node_modules/@hullo/dom/html.js");
var map_1 = __webpack_require__(/*! @hullo/core/operators/map */ "./node_modules/@hullo/core/operators/map.js");
var filters_1 = __webpack_require__(/*! ./filters */ "./ts/filters.ts");
var distinct_1 = __webpack_require__(/*! @hullo/core/operators/distinct */ "./node_modules/@hullo/core/operators/distinct.js");
function Footer(props) {
    return html_1.html.footer({
        attrs: {
            class: "footer",
            hidden: props.tasks$
                .pipe(map_1.map(function (tasks) { return (tasks.length === 0 ? "hidden" : undefined); }))
                .pipe(distinct_1.distinctStrictEqual)
        }
    }, [
        html_1.html.span({ attrs: { class: "todo-count" } }, props.tasks$.pipe(map_1.map(function (tasks) { return [
            html_1.html.strong({
                props: {
                    innerText: props.tasks$.pipe(map_1.map(function (tasks) { return filters_1.filters.active(tasks).length.toString(); }))
                }
            }),
            " " + (filters_1.filters.active(tasks).length === 1 ? "item" : "items") + " left"
        ]; }))),
        html_1.html.ul({ attrs: { class: "filters" } }, [
            html_1.html.li({}, [
                html_1.html.a({
                    attrs: {
                        href: "/#all",
                        class: props.selectedFilter$.pipe(map_1.map(function (filter) { return (filter === "all" ? "selected" : ""); }))
                    },
                    props: { innerText: "All" }
                })
            ]),
            html_1.html.li({}, [
                html_1.html.a({
                    attrs: {
                        href: "/#active",
                        class: props.selectedFilter$.pipe(map_1.map(function (filter) { return (filter === "active" ? "selected" : ""); }))
                    },
                    props: { innerText: "Active" }
                })
            ]),
            html_1.html.li({}, [
                html_1.html.a({
                    attrs: {
                        href: "/#completed",
                        class: props.selectedFilter$.pipe(map_1.map(function (filter) { return (filter === "completed" ? "selected" : ""); }))
                    },
                    props: { innerText: "Completed" }
                })
            ])
        ]),
        html_1.html.button({
            attrs: {
                class: "clear-completed",
                hidden: props.tasks$.pipe(map_1.map(function (tasks) {
                    return filters_1.filters.completed(tasks).length > 0 ? undefined : "hidden";
                }))
            },
            props: { innerText: "Clear completed" },
            events: {
                click: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, props.clearCompleted()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
            }
        })
    ]);
}
exports.Footer = Footer;


/***/ }),

/***/ "./ts/List.ts":
/*!********************!*\
  !*** ./ts/List.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var atom_1 = __webpack_require__(/*! @hullo/core/atom */ "./node_modules/@hullo/core/atom.js");
var deepMap_1 = __webpack_require__(/*! @hullo/core/operators/deepMap */ "./node_modules/@hullo/core/operators/deepMap.js");
var map_1 = __webpack_require__(/*! @hullo/core/operators/map */ "./node_modules/@hullo/core/operators/map.js");
var combineLatest_1 = __webpack_require__(/*! @hullo/core/combineLatest */ "./node_modules/@hullo/core/combineLatest.js");
var html_1 = __webpack_require__(/*! @hullo/dom/html */ "./node_modules/@hullo/dom/html.js");
function List(props) {
    var edited$ = new atom_1.Atom(-1);
    return html_1.html.ul({
        attrs: {
            class: "todo-list"
        }
    }, props.list$.pipe(deepMap_1.deepMap(function (task$, i) {
        var tmpLabel$ = new atom_1.Atom(task$.unwrap().label);
        task$.pipe(map_1.map(function (task) { return task.label; })).subscribe(tmpLabel$);
        var editInput = null;
        return html_1.html.li({
            attrs: {
                class: combineLatest_1.combineLatest([task$, edited$]).pipe(map_1.map(function (_a) {
                    var task = _a[0], edited = _a[1];
                    return [
                        "todo",
                        task.completed ? "completed" : "active",
                        i === edited ? "editing" : "viewing"
                    ]
                        .join(" ")
                        .trim();
                }))
            }
        }, [
            html_1.html.div({ attrs: { class: "view" } }, [
                html_1.html.input({
                    attrs: {
                        class: "toggle",
                        type: "checkbox"
                    },
                    props: {
                        checked: task$.pipe(map_1.map(function (task) { return task.completed; }))
                    },
                    events: {
                        click: function (_event) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, props.onToggle(i)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    }
                }),
                html_1.html.label({
                    props: {
                        innerText: task$.pipe(map_1.map(function (task) { return task.label; }))
                    },
                    events: {
                        dblclick: function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, edited$.next(i)];
                                        case 1:
                                            _a.sent();
                                            if (editInput) {
                                                editInput.focus();
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    }
                }),
                html_1.html.button({
                    attrs: { class: "destroy" },
                    events: {
                        click: function (event) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            event.preventDefault();
                                            return [4 /*yield*/, props.onRemove(i)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }
                    }
                })
            ]),
            html_1.html.input({
                ref: function (e) {
                    editInput = e;
                },
                deref: function () {
                    editInput = null;
                },
                attrs: { class: "edit", type: "text" },
                props: {
                    value: tmpLabel$
                },
                events: {
                    input: function (event) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpLabel$.next(event.target.value)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    blur: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, props.onRename(i, tmpLabel$.unwrap())];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, edited$.next(-1)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    keydown: function (event) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(event instanceof KeyboardEvent && event.keyCode === 13)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, props.onRename(i, tmpLabel$.unwrap())];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, edited$.next(-1)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        if (!(event instanceof KeyboardEvent && event.keyCode === 27)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, edited$.next(-1)];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, tmpLabel$.next(task$.unwrap().label)];
                                    case 5:
                                        _a.sent();
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    }
                }
            })
        ]);
    })));
}
exports.List = List;


/***/ }),

/***/ "./ts/Main.ts":
/*!********************!*\
  !*** ./ts/Main.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(/*! @hullo/dom */ "./node_modules/@hullo/dom/index.js");
var map_1 = __webpack_require__(/*! @hullo/core/operators/map */ "./node_modules/@hullo/core/operators/map.js");
var filters_1 = __webpack_require__(/*! ./filters */ "./ts/filters.ts");
var List_1 = __webpack_require__(/*! ./List */ "./ts/List.ts");
var distinct_1 = __webpack_require__(/*! @hullo/core/operators/distinct */ "./node_modules/@hullo/core/operators/distinct.js");
function Main(props) {
    return dom_1.html.section({
        attrs: {
            class: "main",
            hidden: props.tasks$
                .pipe(map_1.map(function (tasks) { return (tasks.length === 0 ? "hidden" : undefined); }))
                .pipe(distinct_1.distinctStrictEqual)
        }
    }, [
        dom_1.html.input({
            attrs: {
                id: "toggle-all",
                class: "toggle-all",
                type: "checkbox"
            },
            props: {
                checked: props.tasks$.pipe(map_1.map(function (tasks) { return filters_1.filters.active(tasks).length > 0; }))
            },
            events: {
                input: function (event) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.preventDefault();
                                    return [4 /*yield*/, props.onToggleAll()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
            }
        }),
        dom_1.html.label({
            attrs: { for: "toggle-all" },
            props: { innerText: "Mark all as complete" }
        }),
        List_1.List({
            list$: props.selectedTasks$,
            onToggle: function (idx) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, props.onToggle(idx)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            onRename: function (idx, label) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, props.onRename(idx, label)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            onRemove: function (idx) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, props.onRemove(idx)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        })
    ]);
}
exports.Main = Main;


/***/ }),

/***/ "./ts/filters.ts":
/*!***********************!*\
  !*** ./ts/filters.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.filters = {
    all: function (tasks) { return tasks; },
    active: function (tasks) { return tasks.filter(function (task) { return !task.completed; }); },
    completed: function (tasks) { return tasks.filter(function (task) { return task.completed; }); }
};


/***/ }),

/***/ "./ts/index.ts":
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(/*! @hullo/dom */ "./node_modules/@hullo/dom/index.js");
var App_1 = __webpack_require__(/*! ./App */ "./ts/App.ts");
dom_1.mount(document.getElementById("app"), App_1.App());


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map