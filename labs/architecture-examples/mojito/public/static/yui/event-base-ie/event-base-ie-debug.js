/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
(function() {

var stateChangeListener,
    GLOBAL_ENV   = YUI.Env,
    config       = YUI.config,
    doc          = config.doc,
    docElement   = doc && doc.documentElement,
    EVENT_NAME   = 'onreadystatechange',
    pollInterval = config.pollInterval || 40;

if (docElement.doScroll && !GLOBAL_ENV._ieready) {
    GLOBAL_ENV._ieready = function() {
        GLOBAL_ENV._ready();
    };

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */
// Internet Explorer: use the doScroll() method on the root element.
// This isolates what appears to be a safe moment to manipulate the
// DOM prior to when the document's readyState suggests it is safe to do so.
    if (self !== self.top) {
        stateChangeListener = function() {
            if (doc.readyState == 'complete') {
                GLOBAL_ENV.remove(doc, EVENT_NAME, stateChangeListener);
                GLOBAL_ENV.ieready();
            }
        };
        GLOBAL_ENV.add(doc, EVENT_NAME, stateChangeListener);
    } else {
        GLOBAL_ENV._dri = setInterval(function() {
            try {
                docElement.doScroll('left');
                clearInterval(GLOBAL_ENV._dri);
                GLOBAL_ENV._dri = null;
                GLOBAL_ENV._ieready();
            } catch (domNotReady) { }
        }, pollInterval);
    }
}

})();
YUI.add('event-base-ie', function (Y, NAME) {

/*
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event
 * @submodule event-base
 */

function IEEventFacade() {
    // IEEventFacade.superclass.constructor.apply(this, arguments);
    Y.DOM2EventFacade.apply(this, arguments);
}

/*
 * (intentially left out of API docs)
 * Alternate Facade implementation that is based on Object.defineProperty, which
 * is partially supported in IE8.  Properties that involve setup work are
 * deferred to temporary getters using the static _define method.
 */
function IELazyFacade(e) {
    var proxy = Y.config.doc.createEventObject(e),
        proto = IELazyFacade.prototype;

    // TODO: necessary?
    proxy.hasOwnProperty = function () { return true; };

    proxy.init = proto.init;
    proxy.halt = proto.halt;
    proxy.preventDefault           = proto.preventDefault;
    proxy.stopPropagation          = proto.stopPropagation;
    proxy.stopImmediatePropagation = proto.stopImmediatePropagation;

    Y.DOM2EventFacade.apply(proxy, arguments);

    return proxy;
}


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

            IEEventFacade.superclass.init.apply(this, arguments);

            var e = this._event,
                x, y, d, b, de, t;

            this.target = resolve(e.srcElement);

            if (('clientX' in e) && (!x) && (0 !== x)) {
                x = e.clientX;
                y = e.clientY;

                d = Y.config.doc;
                b = d.body;
                de = d.documentElement;

                x += (de.scrollLeft || (b && b.scrollLeft) || 0);
                y += (de.scrollTop  || (b && b.scrollTop)  || 0);

                this.pageX = x;
                this.pageY = y;
            }

            if (e.type == "mouseout") {
                t = e.toElement;
            } else if (e.type == "mouseover") {
                t = e.fromElement;
            }

            // fallback to t.relatedTarget to support simulated events.
            // IE doesn't support setting toElement or fromElement on generic
            // events, so Y.Event.simulate sets relatedTarget instead.
            this.relatedTarget = resolve(t || e.relatedTarget);

            // which should contain the unicode key code if this is a key event.
            // For click events, which is normalized for which mouse button was
            // clicked.
            this.which = // chained assignment
            this.button = e.keyCode || buttonMap[e.button] || e.button;
        },

        stopPropagation: function() {
            this._event.cancelBubble = true;
            this._wrapper.stopped = 1;
            this.stopped = 1;
        },

        stopImmediatePropagation: function() {
            this.stopPropagation();
            this._wrapper.stopped = 2;
            this.stopped = 2;
        },

        preventDefault: function(returnValue) {
            this._event.returnValue = returnValue || false;
            this._wrapper.prevented = 1;
            this.prevented = 1;
        }
    };

Y.extend(IEEventFacade, Y.DOM2EventFacade, proto);

Y.extend(IELazyFacade, Y.DOM2EventFacade, proto);
IELazyFacade.prototype.init = function () {
    var e         = this._event,
        overrides = this._wrapper.overrides,
        define    = IELazyFacade._define,
        lazyProperties = IELazyFacade._lazyProperties,
        prop;

    this.altKey   = e.altKey;
    this.ctrlKey  = e.ctrlKey;
    this.metaKey  = e.metaKey;
    this.shiftKey = e.shiftKey;
    this.type     = (overrides && overrides.type) || e.type;
    this.clientX  = e.clientX;
    this.clientY  = e.clientY;
    this.keyCode  = // chained assignment
    this.charCode = e.keyCode;
    this.which    = // chained assignment
    this.button   = e.keyCode || buttonMap[e.button] || e.button;

    for (prop in lazyProperties) {
        if (lazyProperties.hasOwnProperty(prop)) {
            define(this, prop, lazyProperties[prop]);
        }
    }

    if (this._touch) {
        this._touch(e, this._currentTarget, this._wrapper);
    }
};

IELazyFacade._lazyProperties = {
    target: function () {
        return resolve(this._event.srcElement);
    },
    relatedTarget: function () {
        var e = this._event,
            targetProp = relatedTargetMap[e.type] || 'relatedTarget';

        // fallback to t.relatedTarget to support simulated events.
        // IE doesn't support setting toElement or fromElement on generic
        // events, so Y.Event.simulate sets relatedTarget instead.
        return resolve(e[targetProp] || e.relatedTarget);
    },
    currentTarget: function () {
        return resolve(this._currentTarget);
    },

    wheelDelta: function () {
        var e = this._event;

        if (e.type === "mousewheel" || e.type === "DOMMouseScroll") {
            return (e.detail) ?
                (e.detail * -1) :
                // wheelDelta between -80 and 80 result in -1 or 1
                Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
        }
    },

    pageX: function () {
        var e = this._event,
            val = e.pageX,
            doc, bodyScroll, docScroll;
                
        if (val === undefined) {
            doc = Y.config.doc;
            bodyScroll = doc.body && doc.body.scrollLeft;
            docScroll = doc.documentElement.scrollLeft;

            val = e.clientX + (docScroll || bodyScroll || 0);
        }

        return val;
    },
    pageY: function () {
        var e = this._event,
            val = e.pageY,
            doc, bodyScroll, docScroll;
                
        if (val === undefined) {
            doc = Y.config.doc;
            bodyScroll = doc.body && doc.body.scrollTop;
            docScroll = doc.documentElement.scrollTop;

            val = e.clientY + (docScroll || bodyScroll || 0);
        }

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
IELazyFacade._define = function (o, prop, valueFn) {
    function val(v) {
        var ret = (arguments.length) ? v : valueFn.call(this);

        delete o[prop];
        Object.defineProperty(o, prop, {
            value: ret,
            configurable: true,
            writable: true
        });
        return ret;
    }
    Object.defineProperty(o, prop, {
        get: val,
        set: val,
        configurable: true
    });
};

if (imp && (!imp.hasFeature('Events', '2.0'))) {
    if (useLazyFacade) {
        // Make sure we can use the lazy facade logic
        try {
            Object.defineProperty(Y.config.doc.createEventObject(), 'z', {});
        } catch (e) {
            useLazyFacade = false;
        }
    }
        
    Y.DOMEventFacade = (useLazyFacade) ? IELazyFacade : IEEventFacade;
}


}, '3.7.3', {"requires": ["node-base"]});
