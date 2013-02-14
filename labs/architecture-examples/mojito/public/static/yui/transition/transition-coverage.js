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
_yuitest_coverage["build/transition/transition.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/transition/transition.js",
    code: []
};
_yuitest_coverage["build/transition/transition.js"].code=["YUI.add('transition', function (Y, NAME) {","","/**","* Provides the transition method for Node.","* Transition has no API of its own, but adds the transition method to Node.","*","* @module transition","* @requires node-style","*/","","var CAMEL_VENDOR_PREFIX = '',","    VENDOR_PREFIX = '',","    DOCUMENT = Y.config.doc,","    DOCUMENT_ELEMENT = 'documentElement',","    TRANSITION = 'transition',","    TRANSITION_CAMEL = 'transition',","    TRANSITION_PROPERTY_CAMEL = 'transitionProperty',","    TRANSFORM_CAMEL = 'transform',","    TRANSITION_PROPERTY,","    TRANSITION_DURATION,","    TRANSITION_TIMING_FUNCTION,","    TRANSITION_DELAY,","    TRANSITION_END,","    ON_TRANSITION_END,","","    EMPTY_OBJ = {},","","    VENDORS = [","        'Webkit',","        'Moz'","    ],","","    VENDOR_TRANSITION_END = {","        Webkit: 'webkitTransitionEnd'","    },","","/**"," * A class for constructing transition instances."," * Adds the \"transition\" method to Node."," * @class Transition"," * @constructor"," */","","Transition = function() {","    this.init.apply(this, arguments);","};","","Transition._toCamel = function(property) {","    property = property.replace(/-([a-z])/gi, function(m0, m1) {","        return m1.toUpperCase();","    });","","    return property;","};","","Transition._toHyphen = function(property) {","    property = property.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {","        var str = ((m1) ? '-' + m1.toLowerCase() : '') + m2;","","        if (m3) {","            str += '-' + m3.toLowerCase();","        }","","        return str;","    });","","    return property;","};","","Transition.SHOW_TRANSITION = 'fadeIn';","Transition.HIDE_TRANSITION = 'fadeOut';","","Transition.useNative = false;","","if ('transition' in DOCUMENT[DOCUMENT_ELEMENT].style) {","    Transition.useNative = true;","    Transition.supported = true; // TODO: remove","} else {","    Y.Array.each(VENDORS, function(val) { // then vendor specific","        var property = val + 'Transition';","        if (property in DOCUMENT[DOCUMENT_ELEMENT].style) {","            CAMEL_VENDOR_PREFIX = val;","            VENDOR_PREFIX       = Transition._toHyphen(val) + '-';","","            Transition.useNative = true;","            Transition.supported = true; // TODO: remove","            Transition._VENDOR_PREFIX = val;","        }","    });","}","","if (CAMEL_VENDOR_PREFIX) {","    TRANSITION_CAMEL          = CAMEL_VENDOR_PREFIX + 'Transition';","    TRANSITION_PROPERTY_CAMEL = CAMEL_VENDOR_PREFIX + 'TransitionProperty';","    TRANSFORM_CAMEL           = CAMEL_VENDOR_PREFIX + 'Transform';","}","","TRANSITION_PROPERTY        = VENDOR_PREFIX + 'transition-property';","TRANSITION_DURATION        = VENDOR_PREFIX + 'transition-duration';","TRANSITION_TIMING_FUNCTION = VENDOR_PREFIX + 'transition-timing-function';","TRANSITION_DELAY           = VENDOR_PREFIX + 'transition-delay';","","TRANSITION_END    = 'transitionend';","ON_TRANSITION_END = 'on' + CAMEL_VENDOR_PREFIX.toLowerCase() + 'transitionend';","TRANSITION_END    = VENDOR_TRANSITION_END[CAMEL_VENDOR_PREFIX] || TRANSITION_END;","","Transition.fx = {};","Transition.toggles = {};","","Transition._hasEnd = {};","","Transition._reKeywords = /^(?:node|duration|iterations|easing|delay|on|onstart|onend)$/i;","","Y.Node.DOM_EVENTS[TRANSITION_END] = 1;","","Transition.NAME = 'transition';","","Transition.DEFAULT_EASING = 'ease';","Transition.DEFAULT_DURATION = 0.5;","Transition.DEFAULT_DELAY = 0;","","Transition._nodeAttrs = {};","","Transition.prototype = {","    constructor: Transition,","    init: function(node, config) {","        var anim = this;","        anim._node = node;","        if (!anim._running && config) {","            anim._config = config;","            node._transition = anim; // cache for reuse","","            anim._duration = ('duration' in config) ?","                config.duration: anim.constructor.DEFAULT_DURATION;","","            anim._delay = ('delay' in config) ?","                config.delay: anim.constructor.DEFAULT_DELAY;","","            anim._easing = config.easing || anim.constructor.DEFAULT_EASING;","            anim._count = 0; // track number of animated properties","            anim._running = false;","","        }","","        return anim;","    },","","    addProperty: function(prop, config) {","        var anim = this,","            node = this._node,","            uid = Y.stamp(node),","            nodeInstance = Y.one(node),","            attrs = Transition._nodeAttrs[uid],","            computed,","            compareVal,","            dur,","            attr,","            val;","","        if (!attrs) {","            attrs = Transition._nodeAttrs[uid] = {};","        }","","        attr = attrs[prop];","","        // might just be a value","        if (config && config.value !== undefined) {","            val = config.value;","        } else if (config !== undefined) {","            val = config;","            config = EMPTY_OBJ;","        }","","        if (typeof val === 'function') {","            val = val.call(nodeInstance, nodeInstance);","        }","","        if (attr && attr.transition) {","            // take control if another transition owns this property","            if (attr.transition !== anim) {","                attr.transition._count--; // remapping attr to this transition","            }","        }","","        anim._count++; // properties per transition","","        // make 0 async and fire events","        dur = ((typeof config.duration != 'undefined') ? config.duration :","                    anim._duration) || 0.0001;","","        attrs[prop] = {","            value: val,","            duration: dur,","            delay: (typeof config.delay != 'undefined') ? config.delay :","                    anim._delay,","","            easing: config.easing || anim._easing,","","            transition: anim","        };","","        // native end event doesnt fire when setting to same value","        // supplementing with timer","        // val may be a string or number (height: 0, etc), but computedStyle is always string","        computed = Y.DOM.getComputedStyle(node, prop);","        compareVal = (typeof val === 'string') ? computed : parseFloat(computed);","","        if (Transition.useNative && compareVal === val) {","            setTimeout(function() {","                anim._onNativeEnd.call(node, {","                    propertyName: prop,","                    elapsedTime: dur","                });","            }, dur * 1000);","        }","    },","","    removeProperty: function(prop) {","        var anim = this,","            attrs = Transition._nodeAttrs[Y.stamp(anim._node)];","","        if (attrs && attrs[prop]) {","            delete attrs[prop];","            anim._count--;","        }","","    },","","    initAttrs: function(config) {","        var attr,","            node = this._node;","","        if (config.transform && !config[TRANSFORM_CAMEL]) {","            config[TRANSFORM_CAMEL] = config.transform;","            delete config.transform; // TODO: copy","        }","","        for (attr in config) {","            if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {","                this.addProperty(attr, config[attr]);","","                // when size is auto or % webkit starts from zero instead of computed","                // (https://bugs.webkit.org/show_bug.cgi?id=16020)","                // TODO: selective set","                if (node.style[attr] === '') {","                    Y.DOM.setStyle(node, attr, Y.DOM.getComputedStyle(node, attr));","                }","            }","        }","    },","","    /**","     * Starts or an animation.","     * @method run","     * @chainable","     * @private","     */","    run: function(callback) {","        var anim = this,","            node = anim._node,","            config = anim._config,","            data = {","                type: 'transition:start',","                config: config","            };","","","        if (!anim._running) {","            anim._running = true;","","            if (config.on && config.on.start) {","                config.on.start.call(Y.one(node), data);","            }","","            anim.initAttrs(anim._config);","","            anim._callback = callback;","            anim._start();","        }","","","        return anim;","    },","","    _start: function() {","        this._runNative();","    },","","    _prepDur: function(dur) {","        dur = parseFloat(dur) * 1000;","","        return dur + 'ms';","    },","","    _runNative: function(time) {","        var anim = this,","            node = anim._node,","            uid = Y.stamp(node),","            style = node.style,","            computed = node.ownerDocument.defaultView.getComputedStyle(node),","            attrs = Transition._nodeAttrs[uid],","            cssText = '',","            cssTransition = computed[Transition._toCamel(TRANSITION_PROPERTY)],","","            transitionText = TRANSITION_PROPERTY + ': ',","            duration = TRANSITION_DURATION + ': ',","            easing = TRANSITION_TIMING_FUNCTION + ': ',","            delay = TRANSITION_DELAY + ': ',","            hyphy,","            attr,","            name;","","        // preserve existing transitions","        if (cssTransition !== 'all') {","            transitionText += cssTransition + ',';","            duration += computed[Transition._toCamel(TRANSITION_DURATION)] + ',';","            easing += computed[Transition._toCamel(TRANSITION_TIMING_FUNCTION)] + ',';","            delay += computed[Transition._toCamel(TRANSITION_DELAY)] + ',';","","        }","","        // run transitions mapped to this instance","        for (name in attrs) {","            hyphy = Transition._toHyphen(name);","            attr = attrs[name];","            if ((attr = attrs[name]) && attr.transition === anim) {","                if (name in node.style) { // only native styles allowed","                    duration += anim._prepDur(attr.duration) + ',';","                    delay += anim._prepDur(attr.delay) + ',';","                    easing += (attr.easing) + ',';","","                    transitionText += hyphy + ',';","                    cssText += hyphy + ': ' + attr.value + '; ';","                } else {","                    this.removeProperty(name);","                }","            }","        }","","        transitionText = transitionText.replace(/,$/, ';');","        duration = duration.replace(/,$/, ';');","        easing = easing.replace(/,$/, ';');","        delay = delay.replace(/,$/, ';');","","        // only one native end event per node","        if (!Transition._hasEnd[uid]) {","            node.addEventListener(TRANSITION_END, anim._onNativeEnd, '');","            Transition._hasEnd[uid] = true;","","        }","","        style.cssText += transitionText + duration + easing + delay + cssText;","","    },","","    _end: function(elapsed) {","        var anim = this,","            node = anim._node,","            callback = anim._callback,","            config = anim._config,","            data = {","                type: 'transition:end',","                config: config,","                elapsedTime: elapsed","            },","","            nodeInstance = Y.one(node);","","        anim._running = false;","        anim._callback = null;","","        if (node) {","            if (config.on && config.on.end) {","                setTimeout(function() { // IE: allow previous update to finish","                    config.on.end.call(nodeInstance, data);","","                    // nested to ensure proper fire order","                    if (callback) {","                        callback.call(nodeInstance, data);","                    }","","                }, 1);","            } else if (callback) {","                setTimeout(function() { // IE: allow previous update to finish","                    callback.call(nodeInstance, data);","                }, 1);","            }","        }","","    },","","    _endNative: function(name) {","        var node = this._node,","            value = node.ownerDocument.defaultView.getComputedStyle(node, '')[Transition._toCamel(TRANSITION_PROPERTY)];","","        name = Transition._toHyphen(name);","        if (typeof value === 'string') {","            value = value.replace(new RegExp('(?:^|,\\\\s)' + name + ',?'), ',');","            value = value.replace(/^,|,$/, '');","            node.style[TRANSITION_CAMEL] = value;","        }","    },","","    _onNativeEnd: function(e) {","        var node = this,","            uid = Y.stamp(node),","            event = e,//e._event,","            name = Transition._toCamel(event.propertyName),","            elapsed = event.elapsedTime,","            attrs = Transition._nodeAttrs[uid],","            attr = attrs[name],","            anim = (attr) ? attr.transition : null,","            data,","            config;","","        if (anim) {","            anim.removeProperty(name);","            anim._endNative(name);","            config = anim._config[name];","","            data = {","                type: 'propertyEnd',","                propertyName: name,","                elapsedTime: elapsed,","                config: config","            };","","            if (config && config.on && config.on.end) {","                config.on.end.call(Y.one(node), data);","            }","","            if (anim._count <= 0)  { // after propertyEnd fires","                anim._end(elapsed);","                node.style[TRANSITION_PROPERTY_CAMEL] = ''; // clean up style","            }","        }","    },","","    destroy: function() {","        var anim = this,","            node = anim._node;","","        if (node) {","            node.removeEventListener(TRANSITION_END, anim._onNativeEnd, false);","            anim._node = null;","        }","    }","};","","Y.Transition = Transition;","Y.TransitionNative = Transition; // TODO: remove","","/**"," *   Animate one or more css properties to a given value. Requires the \"transition\" module."," *   <pre>example usage:"," *       Y.one('#demo').transition({"," *           duration: 1, // in seconds, default is 0.5"," *           easing: 'ease-out', // default is 'ease'"," *           delay: '1', // delay start for 1 second, default is 0"," *"," *           height: '10px',"," *           width: '10px',"," *"," *           opacity: { // per property"," *               value: 0,"," *               duration: 2,"," *               delay: 2,"," *               easing: 'ease-in'"," *           }"," *       });"," *   </pre>"," *   @for Node"," *   @method transition"," *   @param {Object} config An object containing one or more style properties, a duration and an easing."," *   @param {Function} callback A function to run after the transition has completed."," *   @chainable","*/","Y.Node.prototype.transition = function(name, config, callback) {","    var","        transitionAttrs = Transition._nodeAttrs[Y.stamp(this._node)],","        anim = (transitionAttrs) ? transitionAttrs.transition || null : null,","        fxConfig,","        prop;","","    if (typeof name === 'string') { // named effect, pull config from registry","        if (typeof config === 'function') {","            callback = config;","            config = null;","        }","","        fxConfig = Transition.fx[name];","","        if (config && typeof config !== 'boolean') {","            config = Y.clone(config);","","            for (prop in fxConfig) {","                if (fxConfig.hasOwnProperty(prop)) {","                    if (! (prop in config)) {","                        config[prop] = fxConfig[prop];","                    }","                }","            }","        } else {","            config = fxConfig;","        }","","    } else { // name is a config, config is a callback or undefined","        callback = config;","        config = name;","    }","","    if (anim && !anim._running) {","        anim.init(this, config);","    } else {","        anim = new Transition(this._node, config);","    }","","    anim.run(callback);","    return this;","};","","Y.Node.prototype.show = function(name, config, callback) {","    this._show(); // show prior to transition","    if (name && Y.Transition) {","        if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default","            if (typeof config === 'function') {","                callback = config;","                config = name;","            }","            name = Transition.SHOW_TRANSITION;","        }","        this.transition(name, config, callback);","    }","    return this;","};","","var _wrapCallBack = function(anim, fn, callback) {","    return function() {","        if (fn) {","            fn.call(anim);","        }","        if (callback) {","            callback.apply(anim._node, arguments);","        }","    };","};","","Y.Node.prototype.hide = function(name, config, callback) {","    if (name && Y.Transition) {","        if (typeof config === 'function') {","            callback = config;","            config = null;","        }","","        callback = _wrapCallBack(this, this._hide, callback); // wrap with existing callback","        if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default","            if (typeof config === 'function') {","                callback = config;","                config = name;","            }","            name = Transition.HIDE_TRANSITION;","        }","        this.transition(name, config, callback);","    } else {","        this._hide();","    }","    return this;","};","","/**"," *   Animate one or more css properties to a given value. Requires the \"transition\" module."," *   <pre>example usage:"," *       Y.all('.demo').transition({"," *           duration: 1, // in seconds, default is 0.5"," *           easing: 'ease-out', // default is 'ease'"," *           delay: '1', // delay start for 1 second, default is 0"," *"," *           height: '10px',"," *           width: '10px',"," *"," *           opacity: { // per property"," *               value: 0,"," *               duration: 2,"," *               delay: 2,"," *               easing: 'ease-in'"," *           }"," *       });"," *   </pre>"," *   @for NodeList"," *   @method transition"," *   @param {Object} config An object containing one or more style properties, a duration and an easing."," *   @param {Function} callback A function to run after the transition has completed. The callback fires"," *       once per item in the NodeList."," *   @chainable","*/","Y.NodeList.prototype.transition = function(config, callback) {","    var nodes = this._nodes,","        i = 0,","        node;","","    while ((node = nodes[i++])) {","        Y.one(node).transition(config, callback);","    }","","    return this;","};","","Y.Node.prototype.toggleView = function(name, on, callback) {","    this._toggles = this._toggles || [];","    callback = arguments[arguments.length - 1];","","    if (typeof name == 'boolean') { // no transition, just toggle","        on = name;","        name = null;","    }","","    name = name || Y.Transition.DEFAULT_TOGGLE;","","    if (typeof on == 'undefined' && name in this._toggles) { // reverse current toggle","        on = ! this._toggles[name];","    }","","    on = (on) ? 1 : 0;","    if (on) {","        this._show();","    }  else {","        callback = _wrapCallBack(this, this._hide, callback);","    }","","    this._toggles[name] = on;","    this.transition(Y.Transition.toggles[name][on], callback);","","    return this;","};","","Y.NodeList.prototype.toggleView = function(name, on, callback) {","    var nodes = this._nodes,","        i = 0,","        node;","","    while ((node = nodes[i++])) {","        Y.one(node).toggleView(name, on, callback);","    }","","    return this;","};","","Y.mix(Transition.fx, {","    fadeOut: {","        opacity: 0,","        duration: 0.5,","        easing: 'ease-out'","    },","","    fadeIn: {","        opacity: 1,","        duration: 0.5,","        easing: 'ease-in'","    },","","    sizeOut: {","        height: 0,","        width: 0,","        duration: 0.75,","        easing: 'ease-out'","    },","","    sizeIn: {","        height: function(node) {","            return node.get('scrollHeight') + 'px';","        },","        width: function(node) {","            return node.get('scrollWidth') + 'px';","        },","        duration: 0.5,","        easing: 'ease-in',","","        on: {","            start: function() {","                var overflow = this.getStyle('overflow');","                if (overflow !== 'hidden') { // enable scrollHeight/Width","                    this.setStyle('overflow', 'hidden');","                    this._transitionOverflow = overflow;","                }","            },","","            end: function() {","                if (this._transitionOverflow) { // revert overridden value","                    this.setStyle('overflow', this._transitionOverflow);","                    delete this._transitionOverflow;","                }","            }","        }","    }","});","","Y.mix(Transition.toggles, {","    size: ['sizeOut', 'sizeIn'],","    fade: ['fadeOut', 'fadeIn']","});","","Transition.DEFAULT_TOGGLE = 'fade';","","","","}, '3.7.3', {\"requires\": [\"node-style\"]});"];
_yuitest_coverage["build/transition/transition.js"].lines = {"1":0,"11":0,"45":0,"48":0,"49":0,"50":0,"53":0,"56":0,"57":0,"58":0,"60":0,"61":0,"64":0,"67":0,"70":0,"71":0,"73":0,"75":0,"76":0,"77":0,"79":0,"80":0,"81":0,"82":0,"83":0,"85":0,"86":0,"87":0,"92":0,"93":0,"94":0,"95":0,"98":0,"99":0,"100":0,"101":0,"103":0,"104":0,"105":0,"107":0,"108":0,"110":0,"112":0,"114":0,"116":0,"118":0,"119":0,"120":0,"122":0,"124":0,"127":0,"128":0,"129":0,"130":0,"131":0,"133":0,"136":0,"139":0,"140":0,"141":0,"145":0,"149":0,"160":0,"161":0,"164":0,"167":0,"168":0,"169":0,"170":0,"171":0,"174":0,"175":0,"178":0,"180":0,"181":0,"185":0,"188":0,"191":0,"205":0,"206":0,"208":0,"209":0,"210":0,"219":0,"222":0,"223":0,"224":0,"230":0,"233":0,"234":0,"235":0,"238":0,"239":0,"240":0,"245":0,"246":0,"259":0,"268":0,"269":0,"271":0,"272":0,"275":0,"277":0,"278":0,"282":0,"286":0,"290":0,"292":0,"296":0,"314":0,"315":0,"316":0,"317":0,"318":0,"323":0,"324":0,"325":0,"326":0,"327":0,"328":0,"329":0,"330":0,"332":0,"333":0,"335":0,"340":0,"341":0,"342":0,"343":0,"346":0,"347":0,"348":0,"352":0,"357":0,"369":0,"370":0,"372":0,"373":0,"374":0,"375":0,"378":0,"379":0,"383":0,"384":0,"385":0,"393":0,"396":0,"397":0,"398":0,"399":0,"400":0,"405":0,"416":0,"417":0,"418":0,"419":0,"421":0,"428":0,"429":0,"432":0,"433":0,"434":0,"440":0,"443":0,"444":0,"445":0,"450":0,"451":0,"478":0,"479":0,"485":0,"486":0,"487":0,"488":0,"491":0,"493":0,"494":0,"496":0,"497":0,"498":0,"499":0,"504":0,"508":0,"509":0,"512":0,"513":0,"515":0,"518":0,"519":0,"522":0,"523":0,"524":0,"525":0,"526":0,"527":0,"528":0,"530":0,"532":0,"534":0,"537":0,"538":0,"539":0,"540":0,"542":0,"543":0,"548":0,"549":0,"550":0,"551":0,"552":0,"555":0,"556":0,"557":0,"558":0,"559":0,"561":0,"563":0,"565":0,"567":0,"596":0,"597":0,"601":0,"602":0,"605":0,"608":0,"609":0,"610":0,"612":0,"613":0,"614":0,"617":0,"619":0,"620":0,"623":0,"624":0,"625":0,"627":0,"630":0,"631":0,"633":0,"636":0,"637":0,"641":0,"642":0,"645":0,"648":0,"670":0,"673":0,"680":0,"681":0,"682":0,"683":0,"688":0,"689":0,"690":0,"697":0,"702":0};
_yuitest_coverage["build/transition/transition.js"].functions = {"Transition:44":0,"(anonymous 2):49":0,"_toCamel:48":0,"(anonymous 3):57":0,"_toHyphen:56":0,"(anonymous 4):79":0,"init:126":0,"(anonymous 5):209":0,"addProperty:148":0,"removeProperty:218":0,"initAttrs:229":0,"run:258":0,"_start:285":0,"_prepDur:289":0,"_runNative:295":0,"(anonymous 6):374":0,"(anonymous 7):384":0,"_end:356":0,"_endNative:392":0,"_onNativeEnd:404":0,"destroy:439":0,"transition:478":0,"show:522":0,"(anonymous 8):538":0,"_wrapCallBack:537":0,"hide:548":0,"transition:596":0,"toggleView:608":0,"toggleView:636":0,"height:669":0,"width:672":0,"start:679":0,"end:687":0,"(anonymous 1):1":0};
_yuitest_coverage["build/transition/transition.js"].coveredLines = 257;
_yuitest_coverage["build/transition/transition.js"].coveredFunctions = 34;
_yuitest_coverline("build/transition/transition.js", 1);
YUI.add('transition', function (Y, NAME) {

/**
* Provides the transition method for Node.
* Transition has no API of its own, but adds the transition method to Node.
*
* @module transition
* @requires node-style
*/

_yuitest_coverfunc("build/transition/transition.js", "(anonymous 1)", 1);
_yuitest_coverline("build/transition/transition.js", 11);
var CAMEL_VENDOR_PREFIX = '',
    VENDOR_PREFIX = '',
    DOCUMENT = Y.config.doc,
    DOCUMENT_ELEMENT = 'documentElement',
    TRANSITION = 'transition',
    TRANSITION_CAMEL = 'transition',
    TRANSITION_PROPERTY_CAMEL = 'transitionProperty',
    TRANSFORM_CAMEL = 'transform',
    TRANSITION_PROPERTY,
    TRANSITION_DURATION,
    TRANSITION_TIMING_FUNCTION,
    TRANSITION_DELAY,
    TRANSITION_END,
    ON_TRANSITION_END,

    EMPTY_OBJ = {},

    VENDORS = [
        'Webkit',
        'Moz'
    ],

    VENDOR_TRANSITION_END = {
        Webkit: 'webkitTransitionEnd'
    },

/**
 * A class for constructing transition instances.
 * Adds the "transition" method to Node.
 * @class Transition
 * @constructor
 */

Transition = function() {
    _yuitest_coverfunc("build/transition/transition.js", "Transition", 44);
_yuitest_coverline("build/transition/transition.js", 45);
this.init.apply(this, arguments);
};

_yuitest_coverline("build/transition/transition.js", 48);
Transition._toCamel = function(property) {
    _yuitest_coverfunc("build/transition/transition.js", "_toCamel", 48);
_yuitest_coverline("build/transition/transition.js", 49);
property = property.replace(/-([a-z])/gi, function(m0, m1) {
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 2)", 49);
_yuitest_coverline("build/transition/transition.js", 50);
return m1.toUpperCase();
    });

    _yuitest_coverline("build/transition/transition.js", 53);
return property;
};

_yuitest_coverline("build/transition/transition.js", 56);
Transition._toHyphen = function(property) {
    _yuitest_coverfunc("build/transition/transition.js", "_toHyphen", 56);
_yuitest_coverline("build/transition/transition.js", 57);
property = property.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 3)", 57);
_yuitest_coverline("build/transition/transition.js", 58);
var str = ((m1) ? '-' + m1.toLowerCase() : '') + m2;

        _yuitest_coverline("build/transition/transition.js", 60);
if (m3) {
            _yuitest_coverline("build/transition/transition.js", 61);
str += '-' + m3.toLowerCase();
        }

        _yuitest_coverline("build/transition/transition.js", 64);
return str;
    });

    _yuitest_coverline("build/transition/transition.js", 67);
return property;
};

_yuitest_coverline("build/transition/transition.js", 70);
Transition.SHOW_TRANSITION = 'fadeIn';
_yuitest_coverline("build/transition/transition.js", 71);
Transition.HIDE_TRANSITION = 'fadeOut';

_yuitest_coverline("build/transition/transition.js", 73);
Transition.useNative = false;

_yuitest_coverline("build/transition/transition.js", 75);
if ('transition' in DOCUMENT[DOCUMENT_ELEMENT].style) {
    _yuitest_coverline("build/transition/transition.js", 76);
Transition.useNative = true;
    _yuitest_coverline("build/transition/transition.js", 77);
Transition.supported = true; // TODO: remove
} else {
    _yuitest_coverline("build/transition/transition.js", 79);
Y.Array.each(VENDORS, function(val) { // then vendor specific
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 4)", 79);
_yuitest_coverline("build/transition/transition.js", 80);
var property = val + 'Transition';
        _yuitest_coverline("build/transition/transition.js", 81);
if (property in DOCUMENT[DOCUMENT_ELEMENT].style) {
            _yuitest_coverline("build/transition/transition.js", 82);
CAMEL_VENDOR_PREFIX = val;
            _yuitest_coverline("build/transition/transition.js", 83);
VENDOR_PREFIX       = Transition._toHyphen(val) + '-';

            _yuitest_coverline("build/transition/transition.js", 85);
Transition.useNative = true;
            _yuitest_coverline("build/transition/transition.js", 86);
Transition.supported = true; // TODO: remove
            _yuitest_coverline("build/transition/transition.js", 87);
Transition._VENDOR_PREFIX = val;
        }
    });
}

_yuitest_coverline("build/transition/transition.js", 92);
if (CAMEL_VENDOR_PREFIX) {
    _yuitest_coverline("build/transition/transition.js", 93);
TRANSITION_CAMEL          = CAMEL_VENDOR_PREFIX + 'Transition';
    _yuitest_coverline("build/transition/transition.js", 94);
TRANSITION_PROPERTY_CAMEL = CAMEL_VENDOR_PREFIX + 'TransitionProperty';
    _yuitest_coverline("build/transition/transition.js", 95);
TRANSFORM_CAMEL           = CAMEL_VENDOR_PREFIX + 'Transform';
}

_yuitest_coverline("build/transition/transition.js", 98);
TRANSITION_PROPERTY        = VENDOR_PREFIX + 'transition-property';
_yuitest_coverline("build/transition/transition.js", 99);
TRANSITION_DURATION        = VENDOR_PREFIX + 'transition-duration';
_yuitest_coverline("build/transition/transition.js", 100);
TRANSITION_TIMING_FUNCTION = VENDOR_PREFIX + 'transition-timing-function';
_yuitest_coverline("build/transition/transition.js", 101);
TRANSITION_DELAY           = VENDOR_PREFIX + 'transition-delay';

_yuitest_coverline("build/transition/transition.js", 103);
TRANSITION_END    = 'transitionend';
_yuitest_coverline("build/transition/transition.js", 104);
ON_TRANSITION_END = 'on' + CAMEL_VENDOR_PREFIX.toLowerCase() + 'transitionend';
_yuitest_coverline("build/transition/transition.js", 105);
TRANSITION_END    = VENDOR_TRANSITION_END[CAMEL_VENDOR_PREFIX] || TRANSITION_END;

_yuitest_coverline("build/transition/transition.js", 107);
Transition.fx = {};
_yuitest_coverline("build/transition/transition.js", 108);
Transition.toggles = {};

_yuitest_coverline("build/transition/transition.js", 110);
Transition._hasEnd = {};

_yuitest_coverline("build/transition/transition.js", 112);
Transition._reKeywords = /^(?:node|duration|iterations|easing|delay|on|onstart|onend)$/i;

_yuitest_coverline("build/transition/transition.js", 114);
Y.Node.DOM_EVENTS[TRANSITION_END] = 1;

_yuitest_coverline("build/transition/transition.js", 116);
Transition.NAME = 'transition';

_yuitest_coverline("build/transition/transition.js", 118);
Transition.DEFAULT_EASING = 'ease';
_yuitest_coverline("build/transition/transition.js", 119);
Transition.DEFAULT_DURATION = 0.5;
_yuitest_coverline("build/transition/transition.js", 120);
Transition.DEFAULT_DELAY = 0;

_yuitest_coverline("build/transition/transition.js", 122);
Transition._nodeAttrs = {};

_yuitest_coverline("build/transition/transition.js", 124);
Transition.prototype = {
    constructor: Transition,
    init: function(node, config) {
        _yuitest_coverfunc("build/transition/transition.js", "init", 126);
_yuitest_coverline("build/transition/transition.js", 127);
var anim = this;
        _yuitest_coverline("build/transition/transition.js", 128);
anim._node = node;
        _yuitest_coverline("build/transition/transition.js", 129);
if (!anim._running && config) {
            _yuitest_coverline("build/transition/transition.js", 130);
anim._config = config;
            _yuitest_coverline("build/transition/transition.js", 131);
node._transition = anim; // cache for reuse

            _yuitest_coverline("build/transition/transition.js", 133);
anim._duration = ('duration' in config) ?
                config.duration: anim.constructor.DEFAULT_DURATION;

            _yuitest_coverline("build/transition/transition.js", 136);
anim._delay = ('delay' in config) ?
                config.delay: anim.constructor.DEFAULT_DELAY;

            _yuitest_coverline("build/transition/transition.js", 139);
anim._easing = config.easing || anim.constructor.DEFAULT_EASING;
            _yuitest_coverline("build/transition/transition.js", 140);
anim._count = 0; // track number of animated properties
            _yuitest_coverline("build/transition/transition.js", 141);
anim._running = false;

        }

        _yuitest_coverline("build/transition/transition.js", 145);
return anim;
    },

    addProperty: function(prop, config) {
        _yuitest_coverfunc("build/transition/transition.js", "addProperty", 148);
_yuitest_coverline("build/transition/transition.js", 149);
var anim = this,
            node = this._node,
            uid = Y.stamp(node),
            nodeInstance = Y.one(node),
            attrs = Transition._nodeAttrs[uid],
            computed,
            compareVal,
            dur,
            attr,
            val;

        _yuitest_coverline("build/transition/transition.js", 160);
if (!attrs) {
            _yuitest_coverline("build/transition/transition.js", 161);
attrs = Transition._nodeAttrs[uid] = {};
        }

        _yuitest_coverline("build/transition/transition.js", 164);
attr = attrs[prop];

        // might just be a value
        _yuitest_coverline("build/transition/transition.js", 167);
if (config && config.value !== undefined) {
            _yuitest_coverline("build/transition/transition.js", 168);
val = config.value;
        } else {_yuitest_coverline("build/transition/transition.js", 169);
if (config !== undefined) {
            _yuitest_coverline("build/transition/transition.js", 170);
val = config;
            _yuitest_coverline("build/transition/transition.js", 171);
config = EMPTY_OBJ;
        }}

        _yuitest_coverline("build/transition/transition.js", 174);
if (typeof val === 'function') {
            _yuitest_coverline("build/transition/transition.js", 175);
val = val.call(nodeInstance, nodeInstance);
        }

        _yuitest_coverline("build/transition/transition.js", 178);
if (attr && attr.transition) {
            // take control if another transition owns this property
            _yuitest_coverline("build/transition/transition.js", 180);
if (attr.transition !== anim) {
                _yuitest_coverline("build/transition/transition.js", 181);
attr.transition._count--; // remapping attr to this transition
            }
        }

        _yuitest_coverline("build/transition/transition.js", 185);
anim._count++; // properties per transition

        // make 0 async and fire events
        _yuitest_coverline("build/transition/transition.js", 188);
dur = ((typeof config.duration != 'undefined') ? config.duration :
                    anim._duration) || 0.0001;

        _yuitest_coverline("build/transition/transition.js", 191);
attrs[prop] = {
            value: val,
            duration: dur,
            delay: (typeof config.delay != 'undefined') ? config.delay :
                    anim._delay,

            easing: config.easing || anim._easing,

            transition: anim
        };

        // native end event doesnt fire when setting to same value
        // supplementing with timer
        // val may be a string or number (height: 0, etc), but computedStyle is always string
        _yuitest_coverline("build/transition/transition.js", 205);
computed = Y.DOM.getComputedStyle(node, prop);
        _yuitest_coverline("build/transition/transition.js", 206);
compareVal = (typeof val === 'string') ? computed : parseFloat(computed);

        _yuitest_coverline("build/transition/transition.js", 208);
if (Transition.useNative && compareVal === val) {
            _yuitest_coverline("build/transition/transition.js", 209);
setTimeout(function() {
                _yuitest_coverfunc("build/transition/transition.js", "(anonymous 5)", 209);
_yuitest_coverline("build/transition/transition.js", 210);
anim._onNativeEnd.call(node, {
                    propertyName: prop,
                    elapsedTime: dur
                });
            }, dur * 1000);
        }
    },

    removeProperty: function(prop) {
        _yuitest_coverfunc("build/transition/transition.js", "removeProperty", 218);
_yuitest_coverline("build/transition/transition.js", 219);
var anim = this,
            attrs = Transition._nodeAttrs[Y.stamp(anim._node)];

        _yuitest_coverline("build/transition/transition.js", 222);
if (attrs && attrs[prop]) {
            _yuitest_coverline("build/transition/transition.js", 223);
delete attrs[prop];
            _yuitest_coverline("build/transition/transition.js", 224);
anim._count--;
        }

    },

    initAttrs: function(config) {
        _yuitest_coverfunc("build/transition/transition.js", "initAttrs", 229);
_yuitest_coverline("build/transition/transition.js", 230);
var attr,
            node = this._node;

        _yuitest_coverline("build/transition/transition.js", 233);
if (config.transform && !config[TRANSFORM_CAMEL]) {
            _yuitest_coverline("build/transition/transition.js", 234);
config[TRANSFORM_CAMEL] = config.transform;
            _yuitest_coverline("build/transition/transition.js", 235);
delete config.transform; // TODO: copy
        }

        _yuitest_coverline("build/transition/transition.js", 238);
for (attr in config) {
            _yuitest_coverline("build/transition/transition.js", 239);
if (config.hasOwnProperty(attr) && !Transition._reKeywords.test(attr)) {
                _yuitest_coverline("build/transition/transition.js", 240);
this.addProperty(attr, config[attr]);

                // when size is auto or % webkit starts from zero instead of computed
                // (https://bugs.webkit.org/show_bug.cgi?id=16020)
                // TODO: selective set
                _yuitest_coverline("build/transition/transition.js", 245);
if (node.style[attr] === '') {
                    _yuitest_coverline("build/transition/transition.js", 246);
Y.DOM.setStyle(node, attr, Y.DOM.getComputedStyle(node, attr));
                }
            }
        }
    },

    /**
     * Starts or an animation.
     * @method run
     * @chainable
     * @private
     */
    run: function(callback) {
        _yuitest_coverfunc("build/transition/transition.js", "run", 258);
_yuitest_coverline("build/transition/transition.js", 259);
var anim = this,
            node = anim._node,
            config = anim._config,
            data = {
                type: 'transition:start',
                config: config
            };


        _yuitest_coverline("build/transition/transition.js", 268);
if (!anim._running) {
            _yuitest_coverline("build/transition/transition.js", 269);
anim._running = true;

            _yuitest_coverline("build/transition/transition.js", 271);
if (config.on && config.on.start) {
                _yuitest_coverline("build/transition/transition.js", 272);
config.on.start.call(Y.one(node), data);
            }

            _yuitest_coverline("build/transition/transition.js", 275);
anim.initAttrs(anim._config);

            _yuitest_coverline("build/transition/transition.js", 277);
anim._callback = callback;
            _yuitest_coverline("build/transition/transition.js", 278);
anim._start();
        }


        _yuitest_coverline("build/transition/transition.js", 282);
return anim;
    },

    _start: function() {
        _yuitest_coverfunc("build/transition/transition.js", "_start", 285);
_yuitest_coverline("build/transition/transition.js", 286);
this._runNative();
    },

    _prepDur: function(dur) {
        _yuitest_coverfunc("build/transition/transition.js", "_prepDur", 289);
_yuitest_coverline("build/transition/transition.js", 290);
dur = parseFloat(dur) * 1000;

        _yuitest_coverline("build/transition/transition.js", 292);
return dur + 'ms';
    },

    _runNative: function(time) {
        _yuitest_coverfunc("build/transition/transition.js", "_runNative", 295);
_yuitest_coverline("build/transition/transition.js", 296);
var anim = this,
            node = anim._node,
            uid = Y.stamp(node),
            style = node.style,
            computed = node.ownerDocument.defaultView.getComputedStyle(node),
            attrs = Transition._nodeAttrs[uid],
            cssText = '',
            cssTransition = computed[Transition._toCamel(TRANSITION_PROPERTY)],

            transitionText = TRANSITION_PROPERTY + ': ',
            duration = TRANSITION_DURATION + ': ',
            easing = TRANSITION_TIMING_FUNCTION + ': ',
            delay = TRANSITION_DELAY + ': ',
            hyphy,
            attr,
            name;

        // preserve existing transitions
        _yuitest_coverline("build/transition/transition.js", 314);
if (cssTransition !== 'all') {
            _yuitest_coverline("build/transition/transition.js", 315);
transitionText += cssTransition + ',';
            _yuitest_coverline("build/transition/transition.js", 316);
duration += computed[Transition._toCamel(TRANSITION_DURATION)] + ',';
            _yuitest_coverline("build/transition/transition.js", 317);
easing += computed[Transition._toCamel(TRANSITION_TIMING_FUNCTION)] + ',';
            _yuitest_coverline("build/transition/transition.js", 318);
delay += computed[Transition._toCamel(TRANSITION_DELAY)] + ',';

        }

        // run transitions mapped to this instance
        _yuitest_coverline("build/transition/transition.js", 323);
for (name in attrs) {
            _yuitest_coverline("build/transition/transition.js", 324);
hyphy = Transition._toHyphen(name);
            _yuitest_coverline("build/transition/transition.js", 325);
attr = attrs[name];
            _yuitest_coverline("build/transition/transition.js", 326);
if ((attr = attrs[name]) && attr.transition === anim) {
                _yuitest_coverline("build/transition/transition.js", 327);
if (name in node.style) { // only native styles allowed
                    _yuitest_coverline("build/transition/transition.js", 328);
duration += anim._prepDur(attr.duration) + ',';
                    _yuitest_coverline("build/transition/transition.js", 329);
delay += anim._prepDur(attr.delay) + ',';
                    _yuitest_coverline("build/transition/transition.js", 330);
easing += (attr.easing) + ',';

                    _yuitest_coverline("build/transition/transition.js", 332);
transitionText += hyphy + ',';
                    _yuitest_coverline("build/transition/transition.js", 333);
cssText += hyphy + ': ' + attr.value + '; ';
                } else {
                    _yuitest_coverline("build/transition/transition.js", 335);
this.removeProperty(name);
                }
            }
        }

        _yuitest_coverline("build/transition/transition.js", 340);
transitionText = transitionText.replace(/,$/, ';');
        _yuitest_coverline("build/transition/transition.js", 341);
duration = duration.replace(/,$/, ';');
        _yuitest_coverline("build/transition/transition.js", 342);
easing = easing.replace(/,$/, ';');
        _yuitest_coverline("build/transition/transition.js", 343);
delay = delay.replace(/,$/, ';');

        // only one native end event per node
        _yuitest_coverline("build/transition/transition.js", 346);
if (!Transition._hasEnd[uid]) {
            _yuitest_coverline("build/transition/transition.js", 347);
node.addEventListener(TRANSITION_END, anim._onNativeEnd, '');
            _yuitest_coverline("build/transition/transition.js", 348);
Transition._hasEnd[uid] = true;

        }

        _yuitest_coverline("build/transition/transition.js", 352);
style.cssText += transitionText + duration + easing + delay + cssText;

    },

    _end: function(elapsed) {
        _yuitest_coverfunc("build/transition/transition.js", "_end", 356);
_yuitest_coverline("build/transition/transition.js", 357);
var anim = this,
            node = anim._node,
            callback = anim._callback,
            config = anim._config,
            data = {
                type: 'transition:end',
                config: config,
                elapsedTime: elapsed
            },

            nodeInstance = Y.one(node);

        _yuitest_coverline("build/transition/transition.js", 369);
anim._running = false;
        _yuitest_coverline("build/transition/transition.js", 370);
anim._callback = null;

        _yuitest_coverline("build/transition/transition.js", 372);
if (node) {
            _yuitest_coverline("build/transition/transition.js", 373);
if (config.on && config.on.end) {
                _yuitest_coverline("build/transition/transition.js", 374);
setTimeout(function() { // IE: allow previous update to finish
                    _yuitest_coverfunc("build/transition/transition.js", "(anonymous 6)", 374);
_yuitest_coverline("build/transition/transition.js", 375);
config.on.end.call(nodeInstance, data);

                    // nested to ensure proper fire order
                    _yuitest_coverline("build/transition/transition.js", 378);
if (callback) {
                        _yuitest_coverline("build/transition/transition.js", 379);
callback.call(nodeInstance, data);
                    }

                }, 1);
            } else {_yuitest_coverline("build/transition/transition.js", 383);
if (callback) {
                _yuitest_coverline("build/transition/transition.js", 384);
setTimeout(function() { // IE: allow previous update to finish
                    _yuitest_coverfunc("build/transition/transition.js", "(anonymous 7)", 384);
_yuitest_coverline("build/transition/transition.js", 385);
callback.call(nodeInstance, data);
                }, 1);
            }}
        }

    },

    _endNative: function(name) {
        _yuitest_coverfunc("build/transition/transition.js", "_endNative", 392);
_yuitest_coverline("build/transition/transition.js", 393);
var node = this._node,
            value = node.ownerDocument.defaultView.getComputedStyle(node, '')[Transition._toCamel(TRANSITION_PROPERTY)];

        _yuitest_coverline("build/transition/transition.js", 396);
name = Transition._toHyphen(name);
        _yuitest_coverline("build/transition/transition.js", 397);
if (typeof value === 'string') {
            _yuitest_coverline("build/transition/transition.js", 398);
value = value.replace(new RegExp('(?:^|,\\s)' + name + ',?'), ',');
            _yuitest_coverline("build/transition/transition.js", 399);
value = value.replace(/^,|,$/, '');
            _yuitest_coverline("build/transition/transition.js", 400);
node.style[TRANSITION_CAMEL] = value;
        }
    },

    _onNativeEnd: function(e) {
        _yuitest_coverfunc("build/transition/transition.js", "_onNativeEnd", 404);
_yuitest_coverline("build/transition/transition.js", 405);
var node = this,
            uid = Y.stamp(node),
            event = e,//e._event,
            name = Transition._toCamel(event.propertyName),
            elapsed = event.elapsedTime,
            attrs = Transition._nodeAttrs[uid],
            attr = attrs[name],
            anim = (attr) ? attr.transition : null,
            data,
            config;

        _yuitest_coverline("build/transition/transition.js", 416);
if (anim) {
            _yuitest_coverline("build/transition/transition.js", 417);
anim.removeProperty(name);
            _yuitest_coverline("build/transition/transition.js", 418);
anim._endNative(name);
            _yuitest_coverline("build/transition/transition.js", 419);
config = anim._config[name];

            _yuitest_coverline("build/transition/transition.js", 421);
data = {
                type: 'propertyEnd',
                propertyName: name,
                elapsedTime: elapsed,
                config: config
            };

            _yuitest_coverline("build/transition/transition.js", 428);
if (config && config.on && config.on.end) {
                _yuitest_coverline("build/transition/transition.js", 429);
config.on.end.call(Y.one(node), data);
            }

            _yuitest_coverline("build/transition/transition.js", 432);
if (anim._count <= 0)  { // after propertyEnd fires
                _yuitest_coverline("build/transition/transition.js", 433);
anim._end(elapsed);
                _yuitest_coverline("build/transition/transition.js", 434);
node.style[TRANSITION_PROPERTY_CAMEL] = ''; // clean up style
            }
        }
    },

    destroy: function() {
        _yuitest_coverfunc("build/transition/transition.js", "destroy", 439);
_yuitest_coverline("build/transition/transition.js", 440);
var anim = this,
            node = anim._node;

        _yuitest_coverline("build/transition/transition.js", 443);
if (node) {
            _yuitest_coverline("build/transition/transition.js", 444);
node.removeEventListener(TRANSITION_END, anim._onNativeEnd, false);
            _yuitest_coverline("build/transition/transition.js", 445);
anim._node = null;
        }
    }
};

_yuitest_coverline("build/transition/transition.js", 450);
Y.Transition = Transition;
_yuitest_coverline("build/transition/transition.js", 451);
Y.TransitionNative = Transition; // TODO: remove

/**
 *   Animate one or more css properties to a given value. Requires the "transition" module.
 *   <pre>example usage:
 *       Y.one('#demo').transition({
 *           duration: 1, // in seconds, default is 0.5
 *           easing: 'ease-out', // default is 'ease'
 *           delay: '1', // delay start for 1 second, default is 0
 *
 *           height: '10px',
 *           width: '10px',
 *
 *           opacity: { // per property
 *               value: 0,
 *               duration: 2,
 *               delay: 2,
 *               easing: 'ease-in'
 *           }
 *       });
 *   </pre>
 *   @for Node
 *   @method transition
 *   @param {Object} config An object containing one or more style properties, a duration and an easing.
 *   @param {Function} callback A function to run after the transition has completed.
 *   @chainable
*/
_yuitest_coverline("build/transition/transition.js", 478);
Y.Node.prototype.transition = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "transition", 478);
_yuitest_coverline("build/transition/transition.js", 479);
var
        transitionAttrs = Transition._nodeAttrs[Y.stamp(this._node)],
        anim = (transitionAttrs) ? transitionAttrs.transition || null : null,
        fxConfig,
        prop;

    _yuitest_coverline("build/transition/transition.js", 485);
if (typeof name === 'string') { // named effect, pull config from registry
        _yuitest_coverline("build/transition/transition.js", 486);
if (typeof config === 'function') {
            _yuitest_coverline("build/transition/transition.js", 487);
callback = config;
            _yuitest_coverline("build/transition/transition.js", 488);
config = null;
        }

        _yuitest_coverline("build/transition/transition.js", 491);
fxConfig = Transition.fx[name];

        _yuitest_coverline("build/transition/transition.js", 493);
if (config && typeof config !== 'boolean') {
            _yuitest_coverline("build/transition/transition.js", 494);
config = Y.clone(config);

            _yuitest_coverline("build/transition/transition.js", 496);
for (prop in fxConfig) {
                _yuitest_coverline("build/transition/transition.js", 497);
if (fxConfig.hasOwnProperty(prop)) {
                    _yuitest_coverline("build/transition/transition.js", 498);
if (! (prop in config)) {
                        _yuitest_coverline("build/transition/transition.js", 499);
config[prop] = fxConfig[prop];
                    }
                }
            }
        } else {
            _yuitest_coverline("build/transition/transition.js", 504);
config = fxConfig;
        }

    } else { // name is a config, config is a callback or undefined
        _yuitest_coverline("build/transition/transition.js", 508);
callback = config;
        _yuitest_coverline("build/transition/transition.js", 509);
config = name;
    }

    _yuitest_coverline("build/transition/transition.js", 512);
if (anim && !anim._running) {
        _yuitest_coverline("build/transition/transition.js", 513);
anim.init(this, config);
    } else {
        _yuitest_coverline("build/transition/transition.js", 515);
anim = new Transition(this._node, config);
    }

    _yuitest_coverline("build/transition/transition.js", 518);
anim.run(callback);
    _yuitest_coverline("build/transition/transition.js", 519);
return this;
};

_yuitest_coverline("build/transition/transition.js", 522);
Y.Node.prototype.show = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "show", 522);
_yuitest_coverline("build/transition/transition.js", 523);
this._show(); // show prior to transition
    _yuitest_coverline("build/transition/transition.js", 524);
if (name && Y.Transition) {
        _yuitest_coverline("build/transition/transition.js", 525);
if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default
            _yuitest_coverline("build/transition/transition.js", 526);
if (typeof config === 'function') {
                _yuitest_coverline("build/transition/transition.js", 527);
callback = config;
                _yuitest_coverline("build/transition/transition.js", 528);
config = name;
            }
            _yuitest_coverline("build/transition/transition.js", 530);
name = Transition.SHOW_TRANSITION;
        }
        _yuitest_coverline("build/transition/transition.js", 532);
this.transition(name, config, callback);
    }
    _yuitest_coverline("build/transition/transition.js", 534);
return this;
};

_yuitest_coverline("build/transition/transition.js", 537);
var _wrapCallBack = function(anim, fn, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "_wrapCallBack", 537);
_yuitest_coverline("build/transition/transition.js", 538);
return function() {
        _yuitest_coverfunc("build/transition/transition.js", "(anonymous 8)", 538);
_yuitest_coverline("build/transition/transition.js", 539);
if (fn) {
            _yuitest_coverline("build/transition/transition.js", 540);
fn.call(anim);
        }
        _yuitest_coverline("build/transition/transition.js", 542);
if (callback) {
            _yuitest_coverline("build/transition/transition.js", 543);
callback.apply(anim._node, arguments);
        }
    };
};

_yuitest_coverline("build/transition/transition.js", 548);
Y.Node.prototype.hide = function(name, config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "hide", 548);
_yuitest_coverline("build/transition/transition.js", 549);
if (name && Y.Transition) {
        _yuitest_coverline("build/transition/transition.js", 550);
if (typeof config === 'function') {
            _yuitest_coverline("build/transition/transition.js", 551);
callback = config;
            _yuitest_coverline("build/transition/transition.js", 552);
config = null;
        }

        _yuitest_coverline("build/transition/transition.js", 555);
callback = _wrapCallBack(this, this._hide, callback); // wrap with existing callback
        _yuitest_coverline("build/transition/transition.js", 556);
if (typeof name !== 'string' && !name.push) { // named effect or array of effects supercedes default
            _yuitest_coverline("build/transition/transition.js", 557);
if (typeof config === 'function') {
                _yuitest_coverline("build/transition/transition.js", 558);
callback = config;
                _yuitest_coverline("build/transition/transition.js", 559);
config = name;
            }
            _yuitest_coverline("build/transition/transition.js", 561);
name = Transition.HIDE_TRANSITION;
        }
        _yuitest_coverline("build/transition/transition.js", 563);
this.transition(name, config, callback);
    } else {
        _yuitest_coverline("build/transition/transition.js", 565);
this._hide();
    }
    _yuitest_coverline("build/transition/transition.js", 567);
return this;
};

/**
 *   Animate one or more css properties to a given value. Requires the "transition" module.
 *   <pre>example usage:
 *       Y.all('.demo').transition({
 *           duration: 1, // in seconds, default is 0.5
 *           easing: 'ease-out', // default is 'ease'
 *           delay: '1', // delay start for 1 second, default is 0
 *
 *           height: '10px',
 *           width: '10px',
 *
 *           opacity: { // per property
 *               value: 0,
 *               duration: 2,
 *               delay: 2,
 *               easing: 'ease-in'
 *           }
 *       });
 *   </pre>
 *   @for NodeList
 *   @method transition
 *   @param {Object} config An object containing one or more style properties, a duration and an easing.
 *   @param {Function} callback A function to run after the transition has completed. The callback fires
 *       once per item in the NodeList.
 *   @chainable
*/
_yuitest_coverline("build/transition/transition.js", 596);
Y.NodeList.prototype.transition = function(config, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "transition", 596);
_yuitest_coverline("build/transition/transition.js", 597);
var nodes = this._nodes,
        i = 0,
        node;

    _yuitest_coverline("build/transition/transition.js", 601);
while ((node = nodes[i++])) {
        _yuitest_coverline("build/transition/transition.js", 602);
Y.one(node).transition(config, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 605);
return this;
};

_yuitest_coverline("build/transition/transition.js", 608);
Y.Node.prototype.toggleView = function(name, on, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "toggleView", 608);
_yuitest_coverline("build/transition/transition.js", 609);
this._toggles = this._toggles || [];
    _yuitest_coverline("build/transition/transition.js", 610);
callback = arguments[arguments.length - 1];

    _yuitest_coverline("build/transition/transition.js", 612);
if (typeof name == 'boolean') { // no transition, just toggle
        _yuitest_coverline("build/transition/transition.js", 613);
on = name;
        _yuitest_coverline("build/transition/transition.js", 614);
name = null;
    }

    _yuitest_coverline("build/transition/transition.js", 617);
name = name || Y.Transition.DEFAULT_TOGGLE;

    _yuitest_coverline("build/transition/transition.js", 619);
if (typeof on == 'undefined' && name in this._toggles) { // reverse current toggle
        _yuitest_coverline("build/transition/transition.js", 620);
on = ! this._toggles[name];
    }

    _yuitest_coverline("build/transition/transition.js", 623);
on = (on) ? 1 : 0;
    _yuitest_coverline("build/transition/transition.js", 624);
if (on) {
        _yuitest_coverline("build/transition/transition.js", 625);
this._show();
    }  else {
        _yuitest_coverline("build/transition/transition.js", 627);
callback = _wrapCallBack(this, this._hide, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 630);
this._toggles[name] = on;
    _yuitest_coverline("build/transition/transition.js", 631);
this.transition(Y.Transition.toggles[name][on], callback);

    _yuitest_coverline("build/transition/transition.js", 633);
return this;
};

_yuitest_coverline("build/transition/transition.js", 636);
Y.NodeList.prototype.toggleView = function(name, on, callback) {
    _yuitest_coverfunc("build/transition/transition.js", "toggleView", 636);
_yuitest_coverline("build/transition/transition.js", 637);
var nodes = this._nodes,
        i = 0,
        node;

    _yuitest_coverline("build/transition/transition.js", 641);
while ((node = nodes[i++])) {
        _yuitest_coverline("build/transition/transition.js", 642);
Y.one(node).toggleView(name, on, callback);
    }

    _yuitest_coverline("build/transition/transition.js", 645);
return this;
};

_yuitest_coverline("build/transition/transition.js", 648);
Y.mix(Transition.fx, {
    fadeOut: {
        opacity: 0,
        duration: 0.5,
        easing: 'ease-out'
    },

    fadeIn: {
        opacity: 1,
        duration: 0.5,
        easing: 'ease-in'
    },

    sizeOut: {
        height: 0,
        width: 0,
        duration: 0.75,
        easing: 'ease-out'
    },

    sizeIn: {
        height: function(node) {
            _yuitest_coverfunc("build/transition/transition.js", "height", 669);
_yuitest_coverline("build/transition/transition.js", 670);
return node.get('scrollHeight') + 'px';
        },
        width: function(node) {
            _yuitest_coverfunc("build/transition/transition.js", "width", 672);
_yuitest_coverline("build/transition/transition.js", 673);
return node.get('scrollWidth') + 'px';
        },
        duration: 0.5,
        easing: 'ease-in',

        on: {
            start: function() {
                _yuitest_coverfunc("build/transition/transition.js", "start", 679);
_yuitest_coverline("build/transition/transition.js", 680);
var overflow = this.getStyle('overflow');
                _yuitest_coverline("build/transition/transition.js", 681);
if (overflow !== 'hidden') { // enable scrollHeight/Width
                    _yuitest_coverline("build/transition/transition.js", 682);
this.setStyle('overflow', 'hidden');
                    _yuitest_coverline("build/transition/transition.js", 683);
this._transitionOverflow = overflow;
                }
            },

            end: function() {
                _yuitest_coverfunc("build/transition/transition.js", "end", 687);
_yuitest_coverline("build/transition/transition.js", 688);
if (this._transitionOverflow) { // revert overridden value
                    _yuitest_coverline("build/transition/transition.js", 689);
this.setStyle('overflow', this._transitionOverflow);
                    _yuitest_coverline("build/transition/transition.js", 690);
delete this._transitionOverflow;
                }
            }
        }
    }
});

_yuitest_coverline("build/transition/transition.js", 697);
Y.mix(Transition.toggles, {
    size: ['sizeOut', 'sizeIn'],
    fade: ['fadeOut', 'fadeIn']
});

_yuitest_coverline("build/transition/transition.js", 702);
Transition.DEFAULT_TOGGLE = 'fade';



}, '3.7.3', {"requires": ["node-style"]});
