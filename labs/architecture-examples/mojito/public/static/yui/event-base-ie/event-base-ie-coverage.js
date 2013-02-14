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
_yuitest_coverage["build/event-base-ie/event-base-ie.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-base-ie/event-base-ie.js",
    code: []
};
_yuitest_coverage["build/event-base-ie/event-base-ie.js"].code=["(function() {","","var stateChangeListener,","    GLOBAL_ENV   = YUI.Env,","    config       = YUI.config,","    doc          = config.doc,","    docElement   = doc && doc.documentElement,","    EVENT_NAME   = 'onreadystatechange',","    pollInterval = config.pollInterval || 40;","","if (docElement.doScroll && !GLOBAL_ENV._ieready) {","    GLOBAL_ENV._ieready = function() {","        GLOBAL_ENV._ready();","    };","","/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */","// Internet Explorer: use the doScroll() method on the root element.","// This isolates what appears to be a safe moment to manipulate the","// DOM prior to when the document's readyState suggests it is safe to do so.","    if (self !== self.top) {","        stateChangeListener = function() {","            if (doc.readyState == 'complete') {","                GLOBAL_ENV.remove(doc, EVENT_NAME, stateChangeListener);","                GLOBAL_ENV.ieready();","            }","        };","        GLOBAL_ENV.add(doc, EVENT_NAME, stateChangeListener);","    } else {","        GLOBAL_ENV._dri = setInterval(function() {","            try {","                docElement.doScroll('left');","                clearInterval(GLOBAL_ENV._dri);","                GLOBAL_ENV._dri = null;","                GLOBAL_ENV._ieready();","            } catch (domNotReady) { }","        }, pollInterval);","    }","}","","})();","YUI.add('event-base-ie', function (Y, NAME) {","","/*"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event"," * @submodule event-base"," */","","function IEEventFacade() {","    // IEEventFacade.superclass.constructor.apply(this, arguments);","    Y.DOM2EventFacade.apply(this, arguments);","}","","/*"," * (intentially left out of API docs)"," * Alternate Facade implementation that is based on Object.defineProperty, which"," * is partially supported in IE8.  Properties that involve setup work are"," * deferred to temporary getters using the static _define method."," */","function IELazyFacade(e) {","    var proxy = Y.config.doc.createEventObject(e),","        proto = IELazyFacade.prototype;","","    // TODO: necessary?","    proxy.hasOwnProperty = function () { return true; };","","    proxy.init = proto.init;","    proxy.halt = proto.halt;","    proxy.preventDefault           = proto.preventDefault;","    proxy.stopPropagation          = proto.stopPropagation;","    proxy.stopImmediatePropagation = proto.stopImmediatePropagation;","","    Y.DOM2EventFacade.apply(proxy, arguments);","","    return proxy;","}","","","var imp = Y.config.doc && Y.config.doc.implementation,","    useLazyFacade = Y.config.lazyEventFacade,","","    buttonMap = {","        0: 1, // left click","        4: 2, // middle click","        2: 3  // right click","    },","    relatedTargetMap = {","        mouseout: 'toElement',","        mouseover: 'fromElement'","    },","","    resolve = Y.DOM2EventFacade.resolve,","","    proto = {","        init: function() {","","            IEEventFacade.superclass.init.apply(this, arguments);","","            var e = this._event,","                x, y, d, b, de, t;","","            this.target = resolve(e.srcElement);","","            if (('clientX' in e) && (!x) && (0 !== x)) {","                x = e.clientX;","                y = e.clientY;","","                d = Y.config.doc;","                b = d.body;","                de = d.documentElement;","","                x += (de.scrollLeft || (b && b.scrollLeft) || 0);","                y += (de.scrollTop  || (b && b.scrollTop)  || 0);","","                this.pageX = x;","                this.pageY = y;","            }","","            if (e.type == \"mouseout\") {","                t = e.toElement;","            } else if (e.type == \"mouseover\") {","                t = e.fromElement;","            }","","            // fallback to t.relatedTarget to support simulated events.","            // IE doesn't support setting toElement or fromElement on generic","            // events, so Y.Event.simulate sets relatedTarget instead.","            this.relatedTarget = resolve(t || e.relatedTarget);","","            // which should contain the unicode key code if this is a key event.","            // For click events, which is normalized for which mouse button was","            // clicked.","            this.which = // chained assignment","            this.button = e.keyCode || buttonMap[e.button] || e.button;","        },","","        stopPropagation: function() {","            this._event.cancelBubble = true;","            this._wrapper.stopped = 1;","            this.stopped = 1;","        },","","        stopImmediatePropagation: function() {","            this.stopPropagation();","            this._wrapper.stopped = 2;","            this.stopped = 2;","        },","","        preventDefault: function(returnValue) {","            this._event.returnValue = returnValue || false;","            this._wrapper.prevented = 1;","            this.prevented = 1;","        }","    };","","Y.extend(IEEventFacade, Y.DOM2EventFacade, proto);","","Y.extend(IELazyFacade, Y.DOM2EventFacade, proto);","IELazyFacade.prototype.init = function () {","    var e         = this._event,","        overrides = this._wrapper.overrides,","        define    = IELazyFacade._define,","        lazyProperties = IELazyFacade._lazyProperties,","        prop;","","    this.altKey   = e.altKey;","    this.ctrlKey  = e.ctrlKey;","    this.metaKey  = e.metaKey;","    this.shiftKey = e.shiftKey;","    this.type     = (overrides && overrides.type) || e.type;","    this.clientX  = e.clientX;","    this.clientY  = e.clientY;","    this.keyCode  = // chained assignment","    this.charCode = e.keyCode;","    this.which    = // chained assignment","    this.button   = e.keyCode || buttonMap[e.button] || e.button;","","    for (prop in lazyProperties) {","        if (lazyProperties.hasOwnProperty(prop)) {","            define(this, prop, lazyProperties[prop]);","        }","    }","","    if (this._touch) {","        this._touch(e, this._currentTarget, this._wrapper);","    }","};","","IELazyFacade._lazyProperties = {","    target: function () {","        return resolve(this._event.srcElement);","    },","    relatedTarget: function () {","        var e = this._event,","            targetProp = relatedTargetMap[e.type] || 'relatedTarget';","","        // fallback to t.relatedTarget to support simulated events.","        // IE doesn't support setting toElement or fromElement on generic","        // events, so Y.Event.simulate sets relatedTarget instead.","        return resolve(e[targetProp] || e.relatedTarget);","    },","    currentTarget: function () {","        return resolve(this._currentTarget);","    },","","    wheelDelta: function () {","        var e = this._event;","","        if (e.type === \"mousewheel\" || e.type === \"DOMMouseScroll\") {","            return (e.detail) ?","                (e.detail * -1) :","                // wheelDelta between -80 and 80 result in -1 or 1","                Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);","        }","    },","","    pageX: function () {","        var e = this._event,","            val = e.pageX,","            doc, bodyScroll, docScroll;","                ","        if (val === undefined) {","            doc = Y.config.doc;","            bodyScroll = doc.body && doc.body.scrollLeft;","            docScroll = doc.documentElement.scrollLeft;","","            val = e.clientX + (docScroll || bodyScroll || 0);","        }","","        return val;","    },","    pageY: function () {","        var e = this._event,","            val = e.pageY,","            doc, bodyScroll, docScroll;","                ","        if (val === undefined) {","            doc = Y.config.doc;","            bodyScroll = doc.body && doc.body.scrollTop;","            docScroll = doc.documentElement.scrollTop;","","            val = e.clientY + (docScroll || bodyScroll || 0);","        }","","        return val;","    }","};","","","/**"," * Wrapper function for Object.defineProperty that creates a property whose"," * value will be calulated only when asked for.  After calculating the value,"," * the getter wll be removed, so it will behave as a normal property beyond that"," * point.  A setter is also assigned so assigning to the property will clear"," * the getter, so foo.prop = 'a'; foo.prop; won't trigger the getter,"," * overwriting value 'a'."," *"," * Used only by the DOMEventFacades used by IE8 when the YUI configuration"," * <code>lazyEventFacade</code> is set to true."," *"," * @method _define"," * @param o {DOMObject} A DOM object to add the property to"," * @param prop {String} The name of the new property"," * @param valueFn {Function} The function that will return the initial, default"," *                  value for the property."," * @static"," * @private"," */","IELazyFacade._define = function (o, prop, valueFn) {","    function val(v) {","        var ret = (arguments.length) ? v : valueFn.call(this);","","        delete o[prop];","        Object.defineProperty(o, prop, {","            value: ret,","            configurable: true,","            writable: true","        });","        return ret;","    }","    Object.defineProperty(o, prop, {","        get: val,","        set: val,","        configurable: true","    });","};","","if (imp && (!imp.hasFeature('Events', '2.0'))) {","    if (useLazyFacade) {","        // Make sure we can use the lazy facade logic","        try {","            Object.defineProperty(Y.config.doc.createEventObject(), 'z', {});","        } catch (e) {","            useLazyFacade = false;","        }","    }","        ","    Y.DOMEventFacade = (useLazyFacade) ? IELazyFacade : IEEventFacade;","}","","","}, '3.7.3', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/event-base-ie/event-base-ie.js"].lines = {"1":0,"3":0,"11":0,"12":0,"13":0,"20":0,"21":0,"22":0,"23":0,"24":0,"27":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"41":0,"50":0,"52":0,"61":0,"62":0,"66":0,"68":0,"69":0,"70":0,"71":0,"72":0,"74":0,"76":0,"80":0,"98":0,"100":0,"103":0,"105":0,"106":0,"107":0,"109":0,"110":0,"111":0,"113":0,"114":0,"116":0,"117":0,"120":0,"121":0,"122":0,"123":0,"129":0,"134":0,"139":0,"140":0,"141":0,"145":0,"146":0,"147":0,"151":0,"152":0,"153":0,"157":0,"159":0,"160":0,"161":0,"167":0,"168":0,"169":0,"170":0,"171":0,"172":0,"173":0,"174":0,"176":0,"179":0,"180":0,"181":0,"185":0,"186":0,"190":0,"192":0,"195":0,"201":0,"204":0,"208":0,"210":0,"211":0,"219":0,"223":0,"224":0,"225":0,"226":0,"228":0,"231":0,"234":0,"238":0,"239":0,"240":0,"241":0,"243":0,"246":0,"270":0,"271":0,"272":0,"274":0,"275":0,"280":0,"282":0,"289":0,"290":0,"292":0,"293":0,"295":0,"299":0};
_yuitest_coverage["build/event-base-ie/event-base-ie.js"].functions = {"_ieready:12":0,"stateChangeListener:21":0,"(anonymous 2):29":0,"(anonymous 1):1":0,"IEEventFacade:50":0,"hasOwnProperty:66":0,"IELazyFacade:61":0,"init:96":0,"stopPropagation:138":0,"stopImmediatePropagation:144":0,"preventDefault:150":0,"init:160":0,"target:191":0,"relatedTarget:194":0,"currentTarget:203":0,"wheelDelta:207":0,"pageX:218":0,"pageY:233":0,"val:271":0,"_define:270":0,"(anonymous 3):41":0};
_yuitest_coverage["build/event-base-ie/event-base-ie.js"].coveredLines = 112;
_yuitest_coverage["build/event-base-ie/event-base-ie.js"].coveredFunctions = 21;
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 1);
(function() {

_yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 3);
var stateChangeListener,
    GLOBAL_ENV   = YUI.Env,
    config       = YUI.config,
    doc          = config.doc,
    docElement   = doc && doc.documentElement,
    EVENT_NAME   = 'onreadystatechange',
    pollInterval = config.pollInterval || 40;

_yuitest_coverline("build/event-base-ie/event-base-ie.js", 11);
if (docElement.doScroll && !GLOBAL_ENV._ieready) {
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 12);
GLOBAL_ENV._ieready = function() {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "_ieready", 12);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 13);
GLOBAL_ENV._ready();
    };

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */
// Internet Explorer: use the doScroll() method on the root element.
// This isolates what appears to be a safe moment to manipulate the
// DOM prior to when the document's readyState suggests it is safe to do so.
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 20);
if (self !== self.top) {
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 21);
stateChangeListener = function() {
            _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "stateChangeListener", 21);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 22);
if (doc.readyState == 'complete') {
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 23);
GLOBAL_ENV.remove(doc, EVENT_NAME, stateChangeListener);
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 24);
GLOBAL_ENV.ieready();
            }
        };
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 27);
GLOBAL_ENV.add(doc, EVENT_NAME, stateChangeListener);
    } else {
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 29);
GLOBAL_ENV._dri = setInterval(function() {
            _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "(anonymous 2)", 29);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 30);
try {
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 31);
docElement.doScroll('left');
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 32);
clearInterval(GLOBAL_ENV._dri);
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 33);
GLOBAL_ENV._dri = null;
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 34);
GLOBAL_ENV._ieready();
            } catch (domNotReady) { }
        }, pollInterval);
    }
}

})();
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 41);
YUI.add('event-base-ie', function (Y, NAME) {

/*
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event
 * @submodule event-base
 */

_yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "(anonymous 3)", 41);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 50);
function IEEventFacade() {
    // IEEventFacade.superclass.constructor.apply(this, arguments);
    _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "IEEventFacade", 50);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 52);
Y.DOM2EventFacade.apply(this, arguments);
}

/*
 * (intentially left out of API docs)
 * Alternate Facade implementation that is based on Object.defineProperty, which
 * is partially supported in IE8.  Properties that involve setup work are
 * deferred to temporary getters using the static _define method.
 */
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 61);
function IELazyFacade(e) {
    _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "IELazyFacade", 61);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 62);
var proxy = Y.config.doc.createEventObject(e),
        proto = IELazyFacade.prototype;

    // TODO: necessary?
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 66);
proxy.hasOwnProperty = function () { _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "hasOwnProperty", 66);
return true; };

    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 68);
proxy.init = proto.init;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 69);
proxy.halt = proto.halt;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 70);
proxy.preventDefault           = proto.preventDefault;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 71);
proxy.stopPropagation          = proto.stopPropagation;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 72);
proxy.stopImmediatePropagation = proto.stopImmediatePropagation;

    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 74);
Y.DOM2EventFacade.apply(proxy, arguments);

    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 76);
return proxy;
}


_yuitest_coverline("build/event-base-ie/event-base-ie.js", 80);
var imp = Y.config.doc && Y.config.doc.implementation,
    useLazyFacade = Y.config.lazyEventFacade,

    buttonMap = {
        0: 1, // left click
        4: 2, // middle click
        2: 3  // right click
    },
    relatedTargetMap = {
        mouseout: 'toElement',
        mouseover: 'fromElement'
    },

    resolve = Y.DOM2EventFacade.resolve,

    proto = {
        init: function() {

            _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "init", 96);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 98);
IEEventFacade.superclass.init.apply(this, arguments);

            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 100);
var e = this._event,
                x, y, d, b, de, t;

            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 103);
this.target = resolve(e.srcElement);

            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 105);
if (('clientX' in e) && (!x) && (0 !== x)) {
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 106);
x = e.clientX;
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 107);
y = e.clientY;

                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 109);
d = Y.config.doc;
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 110);
b = d.body;
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 111);
de = d.documentElement;

                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 113);
x += (de.scrollLeft || (b && b.scrollLeft) || 0);
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 114);
y += (de.scrollTop  || (b && b.scrollTop)  || 0);

                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 116);
this.pageX = x;
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 117);
this.pageY = y;
            }

            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 120);
if (e.type == "mouseout") {
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 121);
t = e.toElement;
            } else {_yuitest_coverline("build/event-base-ie/event-base-ie.js", 122);
if (e.type == "mouseover") {
                _yuitest_coverline("build/event-base-ie/event-base-ie.js", 123);
t = e.fromElement;
            }}

            // fallback to t.relatedTarget to support simulated events.
            // IE doesn't support setting toElement or fromElement on generic
            // events, so Y.Event.simulate sets relatedTarget instead.
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 129);
this.relatedTarget = resolve(t || e.relatedTarget);

            // which should contain the unicode key code if this is a key event.
            // For click events, which is normalized for which mouse button was
            // clicked.
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 134);
this.which = // chained assignment
            this.button = e.keyCode || buttonMap[e.button] || e.button;
        },

        stopPropagation: function() {
            _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "stopPropagation", 138);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 139);
this._event.cancelBubble = true;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 140);
this._wrapper.stopped = 1;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 141);
this.stopped = 1;
        },

        stopImmediatePropagation: function() {
            _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "stopImmediatePropagation", 144);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 145);
this.stopPropagation();
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 146);
this._wrapper.stopped = 2;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 147);
this.stopped = 2;
        },

        preventDefault: function(returnValue) {
            _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "preventDefault", 150);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 151);
this._event.returnValue = returnValue || false;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 152);
this._wrapper.prevented = 1;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 153);
this.prevented = 1;
        }
    };

_yuitest_coverline("build/event-base-ie/event-base-ie.js", 157);
Y.extend(IEEventFacade, Y.DOM2EventFacade, proto);

_yuitest_coverline("build/event-base-ie/event-base-ie.js", 159);
Y.extend(IELazyFacade, Y.DOM2EventFacade, proto);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 160);
IELazyFacade.prototype.init = function () {
    _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "init", 160);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 161);
var e         = this._event,
        overrides = this._wrapper.overrides,
        define    = IELazyFacade._define,
        lazyProperties = IELazyFacade._lazyProperties,
        prop;

    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 167);
this.altKey   = e.altKey;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 168);
this.ctrlKey  = e.ctrlKey;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 169);
this.metaKey  = e.metaKey;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 170);
this.shiftKey = e.shiftKey;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 171);
this.type     = (overrides && overrides.type) || e.type;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 172);
this.clientX  = e.clientX;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 173);
this.clientY  = e.clientY;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 174);
this.keyCode  = // chained assignment
    this.charCode = e.keyCode;
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 176);
this.which    = // chained assignment
    this.button   = e.keyCode || buttonMap[e.button] || e.button;

    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 179);
for (prop in lazyProperties) {
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 180);
if (lazyProperties.hasOwnProperty(prop)) {
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 181);
define(this, prop, lazyProperties[prop]);
        }
    }

    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 185);
if (this._touch) {
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 186);
this._touch(e, this._currentTarget, this._wrapper);
    }
};

_yuitest_coverline("build/event-base-ie/event-base-ie.js", 190);
IELazyFacade._lazyProperties = {
    target: function () {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "target", 191);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 192);
return resolve(this._event.srcElement);
    },
    relatedTarget: function () {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "relatedTarget", 194);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 195);
var e = this._event,
            targetProp = relatedTargetMap[e.type] || 'relatedTarget';

        // fallback to t.relatedTarget to support simulated events.
        // IE doesn't support setting toElement or fromElement on generic
        // events, so Y.Event.simulate sets relatedTarget instead.
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 201);
return resolve(e[targetProp] || e.relatedTarget);
    },
    currentTarget: function () {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "currentTarget", 203);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 204);
return resolve(this._currentTarget);
    },

    wheelDelta: function () {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "wheelDelta", 207);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 208);
var e = this._event;

        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 210);
if (e.type === "mousewheel" || e.type === "DOMMouseScroll") {
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 211);
return (e.detail) ?
                (e.detail * -1) :
                // wheelDelta between -80 and 80 result in -1 or 1
                Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
        }
    },

    pageX: function () {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "pageX", 218);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 219);
var e = this._event,
            val = e.pageX,
            doc, bodyScroll, docScroll;
                
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 223);
if (val === undefined) {
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 224);
doc = Y.config.doc;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 225);
bodyScroll = doc.body && doc.body.scrollLeft;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 226);
docScroll = doc.documentElement.scrollLeft;

            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 228);
val = e.clientX + (docScroll || bodyScroll || 0);
        }

        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 231);
return val;
    },
    pageY: function () {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "pageY", 233);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 234);
var e = this._event,
            val = e.pageY,
            doc, bodyScroll, docScroll;
                
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 238);
if (val === undefined) {
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 239);
doc = Y.config.doc;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 240);
bodyScroll = doc.body && doc.body.scrollTop;
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 241);
docScroll = doc.documentElement.scrollTop;

            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 243);
val = e.clientY + (docScroll || bodyScroll || 0);
        }

        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 246);
return val;
    }
};


/**
 * Wrapper function for Object.defineProperty that creates a property whose
 * value will be calulated only when asked for.  After calculating the value,
 * the getter wll be removed, so it will behave as a normal property beyond that
 * point.  A setter is also assigned so assigning to the property will clear
 * the getter, so foo.prop = 'a'; foo.prop; won't trigger the getter,
 * overwriting value 'a'.
 *
 * Used only by the DOMEventFacades used by IE8 when the YUI configuration
 * <code>lazyEventFacade</code> is set to true.
 *
 * @method _define
 * @param o {DOMObject} A DOM object to add the property to
 * @param prop {String} The name of the new property
 * @param valueFn {Function} The function that will return the initial, default
 *                  value for the property.
 * @static
 * @private
 */
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 270);
IELazyFacade._define = function (o, prop, valueFn) {
    _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "_define", 270);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 271);
function val(v) {
        _yuitest_coverfunc("build/event-base-ie/event-base-ie.js", "val", 271);
_yuitest_coverline("build/event-base-ie/event-base-ie.js", 272);
var ret = (arguments.length) ? v : valueFn.call(this);

        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 274);
delete o[prop];
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 275);
Object.defineProperty(o, prop, {
            value: ret,
            configurable: true,
            writable: true
        });
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 280);
return ret;
    }
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 282);
Object.defineProperty(o, prop, {
        get: val,
        set: val,
        configurable: true
    });
};

_yuitest_coverline("build/event-base-ie/event-base-ie.js", 289);
if (imp && (!imp.hasFeature('Events', '2.0'))) {
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 290);
if (useLazyFacade) {
        // Make sure we can use the lazy facade logic
        _yuitest_coverline("build/event-base-ie/event-base-ie.js", 292);
try {
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 293);
Object.defineProperty(Y.config.doc.createEventObject(), 'z', {});
        } catch (e) {
            _yuitest_coverline("build/event-base-ie/event-base-ie.js", 295);
useLazyFacade = false;
        }
    }
        
    _yuitest_coverline("build/event-base-ie/event-base-ie.js", 299);
Y.DOMEventFacade = (useLazyFacade) ? IELazyFacade : IEEventFacade;
}


}, '3.7.3', {"requires": ["node-base"]});
