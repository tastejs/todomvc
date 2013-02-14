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
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-custom-complex/event-custom-complex.js",
    code: []
};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].code=["YUI.add('event-custom-complex', function (Y, NAME) {","","","/**"," * Adds event facades, preventable default behavior, and bubbling."," * events."," * @module event-custom"," * @submodule event-custom-complex"," */","","var FACADE,","    FACADE_KEYS,","    key,","    EMPTY = {},","    CEProto = Y.CustomEvent.prototype,","    ETProto = Y.EventTarget.prototype, ","","    mixFacadeProps = function(facade, payload) {","        var p;","","        for (p in payload) {","            if (!(FACADE_KEYS.hasOwnProperty(p))) {","                facade[p] = payload[p];","            }","        }","    };","","/**"," * Wraps and protects a custom event for use when emitFacade is set to true."," * Requires the event-custom-complex module"," * @class EventFacade"," * @param e {Event} the custom event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," */","","Y.EventFacade = function(e, currentTarget) {","","    e = e || EMPTY;","","    this._event = e;","","    /**","     * The arguments passed to fire","     * @property details","     * @type Array","     */","    this.details = e.details;","","    /**","     * The event type, this can be overridden by the fire() payload","     * @property type","     * @type string","     */","    this.type = e.type;","","    /**","     * The real event type","     * @property _type","     * @type string","     * @private","     */","    this._type = e.type;","","    //////////////////////////////////////////////////////","","    /**","     * Node reference for the targeted eventtarget","     * @property target","     * @type Node","     */","    this.target = e.target;","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type Node","     */","    this.currentTarget = currentTarget;","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type Node","     */","    this.relatedTarget = e.relatedTarget;","","};","","Y.mix(Y.EventFacade.prototype, {","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","    stopPropagation: function() {","        this._event.stopPropagation();","        this.stopped = 1;","    },","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","    stopImmediatePropagation: function() {","        this._event.stopImmediatePropagation();","        this.stopped = 2;","    },","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     */","    preventDefault: function() {","        this._event.preventDefault();","        this.prevented = 1;","    },","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","    halt: function(immediate) {","        this._event.halt(immediate);","        this.prevented = 1;","        this.stopped = (immediate) ? 2 : 1;","    }","","});","","CEProto.fireComplex = function(args) {","","    var es, ef, q, queue, ce, ret, events, subs, postponed,","        self = this, host = self.host || self, next, oldbubble;","","    if (self.stack) {","        // queue this event if the current item in the queue bubbles","        if (self.queuable && self.type != self.stack.next.type) {","            self.stack.queue.push([self, args]);","            return true;","        }","    }","","    es = self.stack || {","       // id of the first event in the stack","       id: self.id,","       next: self,","       silent: self.silent,","       stopped: 0,","       prevented: 0,","       bubbling: null,","       type: self.type,","       // defaultFnQueue: new Y.Queue(),","       afterQueue: new Y.Queue(),","       defaultTargetOnly: self.defaultTargetOnly,","       queue: []","    };","","    subs = self.getSubs();","","    self.stopped = (self.type !== es.type) ? 0 : es.stopped;","    self.prevented = (self.type !== es.type) ? 0 : es.prevented;","","    self.target = self.target || host;","","    if (self.stoppedFn) {","        events = new Y.EventTarget({","            fireOnce: true,","            context: host","        });","        ","        self.events = events;","","        events.on('stopped', self.stoppedFn);","    }","","    self.currentTarget = host;","","    self.details = args.slice(); // original arguments in the details","","","    self._facade = null; // kill facade to eliminate stale properties","","    ef = self._getFacade(args);","","    if (Y.Lang.isObject(args[0])) {","        args[0] = ef;","    } else {","        args.unshift(ef);","    }","","    if (subs[0]) {","        self._procSubs(subs[0], args, ef);","    }","","    // bubble if this is hosted in an event target and propagation has not been stopped","    if (self.bubbles && host.bubble && !self.stopped) {","","        oldbubble = es.bubbling;","","        es.bubbling = self.type;","","        if (es.type != self.type) {","            es.stopped = 0;","            es.prevented = 0;","        }","","        ret = host.bubble(self, args, null, es);","","        self.stopped = Math.max(self.stopped, es.stopped);","        self.prevented = Math.max(self.prevented, es.prevented);","","        es.bubbling = oldbubble;","    }","","    if (self.prevented) {","        if (self.preventedFn) {","            self.preventedFn.apply(host, args);","        }","    } else if (self.defaultFn &&","              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||","                host === ef.target)) {","        self.defaultFn.apply(host, args);","    }","","    // broadcast listeners are fired as discreet events on the","    // YUI instance and potentially the YUI global.","    self._broadcast(args);","","    // Queue the after","    if (subs[1] && !self.prevented && self.stopped < 2) {","        if (es.id === self.id || self.type != host._yuievt.bubbling) {","            self._procSubs(subs[1], args, ef);","            while ((next = es.afterQueue.last())) {","                next();","            }","        } else {","            postponed = subs[1];","            if (es.execDefaultCnt) {","                postponed = Y.merge(postponed);","                Y.each(postponed, function(s) {","                    s.postponed = true;","                });","            }","","            es.afterQueue.add(function() {","                self._procSubs(postponed, args, ef);","            });","        }","    }","","    self.target = null;","","    if (es.id === self.id) {","        queue = es.queue;","","        while (queue.length) {","            q = queue.pop();","            ce = q[0];","            // set up stack to allow the next item to be processed","            es.next = ce;","            ce.fire.apply(ce, q[1]);","        }","","        self.stack = null;","    }","","    ret = !(self.stopped);","","    if (self.type != host._yuievt.bubbling) {","        es.stopped = 0;","        es.prevented = 0;","        self.stopped = 0;","        self.prevented = 0;","    }","","    // Kill the cached facade to free up memory.","    // Otherwise we have the facade from the last fire, sitting around forever.","    self._facade = null;","","    return ret;","};","","CEProto._getFacade = function() {","","    var ef = this._facade, o,","    args = this.details;","","    if (!ef) {","        ef = new Y.EventFacade(this, this.currentTarget);","    }","","    // if the first argument is an object literal, apply the","    // properties to the event facade","    o = args && args[0];","","    if (Y.Lang.isObject(o, true)) {","","        // protect the event facade properties","        mixFacadeProps(ef, o);","","        // Allow the event type to be faked","        // http://yuilibrary.com/projects/yui3/ticket/2528376","        ef.type = o.type || ef.type;","    }","","    // update the details field with the arguments","    // ef.type = this.type;","    ef.details = this.details;","","    // use the original target when the event bubbled to this target","    ef.target = this.originalTarget || this.target;","","    ef.currentTarget = this.currentTarget;","    ef.stopped = 0;","    ef.prevented = 0;","","    this._facade = ef;","","    return this._facade;","};","","/**"," * Stop propagation to bubble targets"," * @for CustomEvent"," * @method stopPropagation"," */","CEProto.stopPropagation = function() {","    this.stopped = 1;","    if (this.stack) {","        this.stack.stopped = 1;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Stops propagation to bubble targets, and prevents any remaining"," * subscribers on the current target from executing."," * @method stopImmediatePropagation"," */","CEProto.stopImmediatePropagation = function() {","    this.stopped = 2;","    if (this.stack) {","        this.stack.stopped = 2;","    }","    if (this.events) {","        this.events.fire('stopped', this);","    }","};","","/**"," * Prevents the execution of this event's defaultFn"," * @method preventDefault"," */","CEProto.preventDefault = function() {","    if (this.preventable) {","        this.prevented = 1;","        if (this.stack) {","            this.stack.prevented = 1;","        }","    }","};","","/**"," * Stops the event propagation and prevents the default"," * event behavior."," * @method halt"," * @param immediate {boolean} if true additional listeners"," * on the current target will not be executed"," */","CEProto.halt = function(immediate) {","    if (immediate) {","        this.stopImmediatePropagation();","    } else {","        this.stopPropagation();","    }","    this.preventDefault();","};","","/**"," * Registers another EventTarget as a bubble target.  Bubble order"," * is determined by the order registered.  Multiple targets can"," * be specified."," *"," * Events can only bubble if emitFacade is true."," *"," * Included in the event-custom-complex submodule."," *"," * @method addTarget"," * @param o {EventTarget} the target to add"," * @for EventTarget"," */","ETProto.addTarget = function(o) {","    this._yuievt.targets[Y.stamp(o)] = o;","    this._yuievt.hasTargets = true;","};","","/**"," * Returns an array of bubble targets for this object."," * @method getTargets"," * @return EventTarget[]"," */","ETProto.getTargets = function() {","    return Y.Object.values(this._yuievt.targets);","};","","/**"," * Removes a bubble target"," * @method removeTarget"," * @param o {EventTarget} the target to remove"," * @for EventTarget"," */","ETProto.removeTarget = function(o) {","    delete this._yuievt.targets[Y.stamp(o)];","};","","/**"," * Propagate an event.  Requires the event-custom-complex module."," * @method bubble"," * @param evt {CustomEvent} the custom event to propagate"," * @return {boolean} the aggregated return value from Event.Custom.fire"," * @for EventTarget"," */","ETProto.bubble = function(evt, args, target, es) {","","    var targs = this._yuievt.targets, ret = true,","        t, type = evt && evt.type, ce, i, bc, ce2,","        originalTarget = target || (evt && evt.target) || this,","        oldbubble;","","    if (!evt || ((!evt.stopped) && targs)) {","","        for (i in targs) {","            if (targs.hasOwnProperty(i)) {","                t = targs[i];","                ce = t.getEvent(type, true);","                ce2 = t.getSibling(type, ce);","","                if (ce2 && !ce) {","                    ce = t.publish(type);","                }","","                oldbubble = t._yuievt.bubbling;","                t._yuievt.bubbling = type;","","                // if this event was not published on the bubble target,","                // continue propagating the event.","                if (!ce) {","                    if (t._yuievt.hasTargets) {","                        t.bubble(evt, args, originalTarget, es);","                    }","                } else {","","                    ce.sibling = ce2;","","                    // set the original target to that the target payload on the","                    // facade is correct.","                    ce.target = originalTarget;","                    ce.originalTarget = originalTarget;","                    ce.currentTarget = t;","                    bc = ce.broadcast;","                    ce.broadcast = false;","","                    // default publish may not have emitFacade true -- that","                    // shouldn't be what the implementer meant to do","                    ce.emitFacade = true;","","                    ce.stack = es;","","                    ret = ret && ce.fire.apply(ce, args || evt.details || []);","                    ce.broadcast = bc;","                    ce.originalTarget = null;","","                    // stopPropagation() was called","                    if (ce.stopped) {","                        break;","                    }","                }","","                t._yuievt.bubbling = oldbubble;","            }","        }","    }","","    return ret;","};","","FACADE = new Y.EventFacade();","FACADE_KEYS = {};","","// Flatten whitelist","for (key in FACADE) {","    FACADE_KEYS[key] = true;","}","","}, '3.7.3', {\"requires\": [\"event-custom-base\"]});"];
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].lines = {"1":0,"11":0,"19":0,"21":0,"22":0,"23":0,"36":0,"38":0,"40":0,"47":0,"54":0,"62":0,"71":0,"78":0,"85":0,"89":0,"96":0,"97":0,"107":0,"108":0,"116":0,"117":0,"128":0,"129":0,"130":0,"135":0,"137":0,"140":0,"142":0,"143":0,"144":0,"148":0,"163":0,"165":0,"166":0,"168":0,"170":0,"171":0,"176":0,"178":0,"181":0,"183":0,"186":0,"188":0,"190":0,"191":0,"193":0,"196":0,"197":0,"201":0,"203":0,"205":0,"207":0,"208":0,"209":0,"212":0,"214":0,"215":0,"217":0,"220":0,"221":0,"222":0,"224":0,"227":0,"232":0,"235":0,"236":0,"237":0,"238":0,"239":0,"242":0,"243":0,"244":0,"245":0,"246":0,"250":0,"251":0,"256":0,"258":0,"259":0,"261":0,"262":0,"263":0,"265":0,"266":0,"269":0,"272":0,"274":0,"275":0,"276":0,"277":0,"278":0,"283":0,"285":0,"288":0,"290":0,"293":0,"294":0,"299":0,"301":0,"304":0,"308":0,"313":0,"316":0,"318":0,"319":0,"320":0,"322":0,"324":0,"332":0,"333":0,"334":0,"335":0,"337":0,"338":0,"347":0,"348":0,"349":0,"350":0,"352":0,"353":0,"361":0,"362":0,"363":0,"364":0,"365":0,"377":0,"378":0,"379":0,"381":0,"383":0,"399":0,"400":0,"401":0,"409":0,"410":0,"419":0,"420":0,"430":0,"432":0,"437":0,"439":0,"440":0,"441":0,"442":0,"443":0,"445":0,"446":0,"449":0,"450":0,"454":0,"455":0,"456":0,"460":0,"464":0,"465":0,"466":0,"467":0,"468":0,"472":0,"474":0,"476":0,"477":0,"478":0,"481":0,"482":0,"486":0,"491":0,"494":0,"495":0,"498":0,"499":0};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].functions = {"mixFacadeProps:18":0,"EventFacade:36":0,"stopPropagation:95":0,"stopImmediatePropagation:106":0,"preventDefault:115":0,"halt:127":0,"(anonymous 2):245":0,"(anonymous 3):250":0,"fireComplex:135":0,"_getFacade:288":0,"stopPropagation:332":0,"stopImmediatePropagation:347":0,"preventDefault:361":0,"halt:377":0,"addTarget:399":0,"getTargets:409":0,"removeTarget:419":0,"bubble:430":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].coveredLines = 172;
_yuitest_coverage["build/event-custom-complex/event-custom-complex.js"].coveredFunctions = 19;
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 1);
YUI.add('event-custom-complex', function (Y, NAME) {


/**
 * Adds event facades, preventable default behavior, and bubbling.
 * events.
 * @module event-custom
 * @submodule event-custom-complex
 */

_yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 11);
var FACADE,
    FACADE_KEYS,
    key,
    EMPTY = {},
    CEProto = Y.CustomEvent.prototype,
    ETProto = Y.EventTarget.prototype, 

    mixFacadeProps = function(facade, payload) {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "mixFacadeProps", 18);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 19);
var p;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 21);
for (p in payload) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 22);
if (!(FACADE_KEYS.hasOwnProperty(p))) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 23);
facade[p] = payload[p];
            }
        }
    };

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * Requires the event-custom-complex module
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 36);
Y.EventFacade = function(e, currentTarget) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "EventFacade", 36);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 38);
e = e || EMPTY;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 40);
this._event = e;

    /**
     * The arguments passed to fire
     * @property details
     * @type Array
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 47);
this.details = e.details;

    /**
     * The event type, this can be overridden by the fire() payload
     * @property type
     * @type string
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 54);
this.type = e.type;

    /**
     * The real event type
     * @property _type
     * @type string
     * @private
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 62);
this._type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @property target
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 71);
this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 78);
this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type Node
     */
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 85);
this.relatedTarget = e.relatedTarget;

};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 89);
Y.mix(Y.EventFacade.prototype, {

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    stopPropagation: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopPropagation", 95);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 96);
this._event.stopPropagation();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 97);
this.stopped = 1;
    },

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 106);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 107);
this._event.stopImmediatePropagation();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 108);
this.stopped = 2;
    },

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    preventDefault: function() {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "preventDefault", 115);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 116);
this._event.preventDefault();
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 117);
this.prevented = 1;
    },

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
    halt: function(immediate) {
        _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "halt", 127);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 128);
this._event.halt(immediate);
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 129);
this.prevented = 1;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 130);
this.stopped = (immediate) ? 2 : 1;
    }

});

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 135);
CEProto.fireComplex = function(args) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "fireComplex", 135);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 137);
var es, ef, q, queue, ce, ret, events, subs, postponed,
        self = this, host = self.host || self, next, oldbubble;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 140);
if (self.stack) {
        // queue this event if the current item in the queue bubbles
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 142);
if (self.queuable && self.type != self.stack.next.type) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 143);
self.stack.queue.push([self, args]);
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 144);
return true;
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 148);
es = self.stack || {
       // id of the first event in the stack
       id: self.id,
       next: self,
       silent: self.silent,
       stopped: 0,
       prevented: 0,
       bubbling: null,
       type: self.type,
       // defaultFnQueue: new Y.Queue(),
       afterQueue: new Y.Queue(),
       defaultTargetOnly: self.defaultTargetOnly,
       queue: []
    };

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 163);
subs = self.getSubs();

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 165);
self.stopped = (self.type !== es.type) ? 0 : es.stopped;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 166);
self.prevented = (self.type !== es.type) ? 0 : es.prevented;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 168);
self.target = self.target || host;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 170);
if (self.stoppedFn) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 171);
events = new Y.EventTarget({
            fireOnce: true,
            context: host
        });
        
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 176);
self.events = events;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 178);
events.on('stopped', self.stoppedFn);
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 181);
self.currentTarget = host;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 183);
self.details = args.slice(); // original arguments in the details


    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 186);
self._facade = null; // kill facade to eliminate stale properties

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 188);
ef = self._getFacade(args);

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 190);
if (Y.Lang.isObject(args[0])) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 191);
args[0] = ef;
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 193);
args.unshift(ef);
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 196);
if (subs[0]) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 197);
self._procSubs(subs[0], args, ef);
    }

    // bubble if this is hosted in an event target and propagation has not been stopped
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 201);
if (self.bubbles && host.bubble && !self.stopped) {

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 203);
oldbubble = es.bubbling;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 205);
es.bubbling = self.type;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 207);
if (es.type != self.type) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 208);
es.stopped = 0;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 209);
es.prevented = 0;
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 212);
ret = host.bubble(self, args, null, es);

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 214);
self.stopped = Math.max(self.stopped, es.stopped);
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 215);
self.prevented = Math.max(self.prevented, es.prevented);

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 217);
es.bubbling = oldbubble;
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 220);
if (self.prevented) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 221);
if (self.preventedFn) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 222);
self.preventedFn.apply(host, args);
        }
    } else {_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 224);
if (self.defaultFn &&
              ((!self.defaultTargetOnly && !es.defaultTargetOnly) ||
                host === ef.target)) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 227);
self.defaultFn.apply(host, args);
    }}

    // broadcast listeners are fired as discreet events on the
    // YUI instance and potentially the YUI global.
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 232);
self._broadcast(args);

    // Queue the after
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 235);
if (subs[1] && !self.prevented && self.stopped < 2) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 236);
if (es.id === self.id || self.type != host._yuievt.bubbling) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 237);
self._procSubs(subs[1], args, ef);
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 238);
while ((next = es.afterQueue.last())) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 239);
next();
            }
        } else {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 242);
postponed = subs[1];
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 243);
if (es.execDefaultCnt) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 244);
postponed = Y.merge(postponed);
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 245);
Y.each(postponed, function(s) {
                    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 2)", 245);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 246);
s.postponed = true;
                });
            }

            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 250);
es.afterQueue.add(function() {
                _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "(anonymous 3)", 250);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 251);
self._procSubs(postponed, args, ef);
            });
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 256);
self.target = null;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 258);
if (es.id === self.id) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 259);
queue = es.queue;

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 261);
while (queue.length) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 262);
q = queue.pop();
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 263);
ce = q[0];
            // set up stack to allow the next item to be processed
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 265);
es.next = ce;
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 266);
ce.fire.apply(ce, q[1]);
        }

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 269);
self.stack = null;
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 272);
ret = !(self.stopped);

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 274);
if (self.type != host._yuievt.bubbling) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 275);
es.stopped = 0;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 276);
es.prevented = 0;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 277);
self.stopped = 0;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 278);
self.prevented = 0;
    }

    // Kill the cached facade to free up memory.
    // Otherwise we have the facade from the last fire, sitting around forever.
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 283);
self._facade = null;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 285);
return ret;
};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 288);
CEProto._getFacade = function() {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "_getFacade", 288);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 290);
var ef = this._facade, o,
    args = this.details;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 293);
if (!ef) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 294);
ef = new Y.EventFacade(this, this.currentTarget);
    }

    // if the first argument is an object literal, apply the
    // properties to the event facade
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 299);
o = args && args[0];

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 301);
if (Y.Lang.isObject(o, true)) {

        // protect the event facade properties
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 304);
mixFacadeProps(ef, o);

        // Allow the event type to be faked
        // http://yuilibrary.com/projects/yui3/ticket/2528376
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 308);
ef.type = o.type || ef.type;
    }

    // update the details field with the arguments
    // ef.type = this.type;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 313);
ef.details = this.details;

    // use the original target when the event bubbled to this target
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 316);
ef.target = this.originalTarget || this.target;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 318);
ef.currentTarget = this.currentTarget;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 319);
ef.stopped = 0;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 320);
ef.prevented = 0;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 322);
this._facade = ef;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 324);
return this._facade;
};

/**
 * Stop propagation to bubble targets
 * @for CustomEvent
 * @method stopPropagation
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 332);
CEProto.stopPropagation = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopPropagation", 332);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 333);
this.stopped = 1;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 334);
if (this.stack) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 335);
this.stack.stopped = 1;
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 337);
if (this.events) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 338);
this.events.fire('stopped', this);
    }
};

/**
 * Stops propagation to bubble targets, and prevents any remaining
 * subscribers on the current target from executing.
 * @method stopImmediatePropagation
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 347);
CEProto.stopImmediatePropagation = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "stopImmediatePropagation", 347);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 348);
this.stopped = 2;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 349);
if (this.stack) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 350);
this.stack.stopped = 2;
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 352);
if (this.events) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 353);
this.events.fire('stopped', this);
    }
};

/**
 * Prevents the execution of this event's defaultFn
 * @method preventDefault
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 361);
CEProto.preventDefault = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "preventDefault", 361);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 362);
if (this.preventable) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 363);
this.prevented = 1;
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 364);
if (this.stack) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 365);
this.stack.prevented = 1;
        }
    }
};

/**
 * Stops the event propagation and prevents the default
 * event behavior.
 * @method halt
 * @param immediate {boolean} if true additional listeners
 * on the current target will not be executed
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 377);
CEProto.halt = function(immediate) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "halt", 377);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 378);
if (immediate) {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 379);
this.stopImmediatePropagation();
    } else {
        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 381);
this.stopPropagation();
    }
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 383);
this.preventDefault();
};

/**
 * Registers another EventTarget as a bubble target.  Bubble order
 * is determined by the order registered.  Multiple targets can
 * be specified.
 *
 * Events can only bubble if emitFacade is true.
 *
 * Included in the event-custom-complex submodule.
 *
 * @method addTarget
 * @param o {EventTarget} the target to add
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 399);
ETProto.addTarget = function(o) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "addTarget", 399);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 400);
this._yuievt.targets[Y.stamp(o)] = o;
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 401);
this._yuievt.hasTargets = true;
};

/**
 * Returns an array of bubble targets for this object.
 * @method getTargets
 * @return EventTarget[]
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 409);
ETProto.getTargets = function() {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "getTargets", 409);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 410);
return Y.Object.values(this._yuievt.targets);
};

/**
 * Removes a bubble target
 * @method removeTarget
 * @param o {EventTarget} the target to remove
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 419);
ETProto.removeTarget = function(o) {
    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "removeTarget", 419);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 420);
delete this._yuievt.targets[Y.stamp(o)];
};

/**
 * Propagate an event.  Requires the event-custom-complex module.
 * @method bubble
 * @param evt {CustomEvent} the custom event to propagate
 * @return {boolean} the aggregated return value from Event.Custom.fire
 * @for EventTarget
 */
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 430);
ETProto.bubble = function(evt, args, target, es) {

    _yuitest_coverfunc("build/event-custom-complex/event-custom-complex.js", "bubble", 430);
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 432);
var targs = this._yuievt.targets, ret = true,
        t, type = evt && evt.type, ce, i, bc, ce2,
        originalTarget = target || (evt && evt.target) || this,
        oldbubble;

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 437);
if (!evt || ((!evt.stopped) && targs)) {

        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 439);
for (i in targs) {
            _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 440);
if (targs.hasOwnProperty(i)) {
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 441);
t = targs[i];
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 442);
ce = t.getEvent(type, true);
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 443);
ce2 = t.getSibling(type, ce);

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 445);
if (ce2 && !ce) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 446);
ce = t.publish(type);
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 449);
oldbubble = t._yuievt.bubbling;
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 450);
t._yuievt.bubbling = type;

                // if this event was not published on the bubble target,
                // continue propagating the event.
                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 454);
if (!ce) {
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 455);
if (t._yuievt.hasTargets) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 456);
t.bubble(evt, args, originalTarget, es);
                    }
                } else {

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 460);
ce.sibling = ce2;

                    // set the original target to that the target payload on the
                    // facade is correct.
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 464);
ce.target = originalTarget;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 465);
ce.originalTarget = originalTarget;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 466);
ce.currentTarget = t;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 467);
bc = ce.broadcast;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 468);
ce.broadcast = false;

                    // default publish may not have emitFacade true -- that
                    // shouldn't be what the implementer meant to do
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 472);
ce.emitFacade = true;

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 474);
ce.stack = es;

                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 476);
ret = ret && ce.fire.apply(ce, args || evt.details || []);
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 477);
ce.broadcast = bc;
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 478);
ce.originalTarget = null;

                    // stopPropagation() was called
                    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 481);
if (ce.stopped) {
                        _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 482);
break;
                    }
                }

                _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 486);
t._yuievt.bubbling = oldbubble;
            }
        }
    }

    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 491);
return ret;
};

_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 494);
FACADE = new Y.EventFacade();
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 495);
FACADE_KEYS = {};

// Flatten whitelist
_yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 498);
for (key in FACADE) {
    _yuitest_coverline("build/event-custom-complex/event-custom-complex.js", 499);
FACADE_KEYS[key] = true;
}

}, '3.7.3', {"requires": ["event-custom-base"]});
