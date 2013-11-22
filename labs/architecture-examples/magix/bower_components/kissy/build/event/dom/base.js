/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 18 00:20
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 event/dom/base/utils
 event/dom/base/special
 event/dom/base/observer
 event/dom/base/object
 event/dom/base/observable
 event/dom/base/dom-event
 event/dom/base/key-codes
 event/dom/base/gesture
 event/dom/base/special-events
 event/dom/base/mouseenter
 event/dom/base/valuechange
 event/dom/base
*/

/**
 * @ignore
 * utils for event
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/utils', function (S, Dom) {
    var EVENT_GUID = 'ksEventTargetId_'+ S.now(),
        doc = S.Env.host.document,
        simpleAdd = doc && doc.addEventListener ?
            function (el, type, fn, capture) {
                if (el.addEventListener) {
                    el.addEventListener(type, fn, !!capture);
                }
            } :
            function (el, type, fn) {
                if (el.attachEvent) {
                    el.attachEvent('on' + type, fn);
                }
            },
        simpleRemove = doc && doc.removeEventListener ?
            function (el, type, fn, capture) {
                if (el.removeEventListener) {
                    el.removeEventListener(type, fn, !!capture);
                }
            } :
            function (el, type, fn) {
                if (el.detachEvent) {
                    el.detachEvent('on' + type, fn);
                }
            };

    return {
        simpleAdd: simpleAdd,

        simpleRemove: simpleRemove,

        data: function (elem, v) {
            return Dom.data(elem, EVENT_GUID, v);
        },

        removeData: function (elem) {
            return Dom.removeData(elem, EVENT_GUID);
        }
    };

}, {
    requires: ['dom']
});
/**
 * @ignore
 * special house for special events
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/special', function () {
    return {
    };
});
/**
 * @ignore
 * observer for dom event.
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/observer', function (S, Special, BaseEvent) {
    /**
     * observer for dom event
     * @class KISSY.Event.DomEvent.Observer
     * @extends KISSY.Event.Observer
     * @private
     */
    function DomEventObserver(cfg) {
        DomEventObserver.superclass.constructor.apply(this, arguments);
        /**
         * filter selector string or function to find right element
         * @cfg {String} filter
         */
        /**
         * extra data as second parameter of listener
         * @cfg {*} data
         */
    }

    S.extend(DomEventObserver, BaseEvent.Observer, {
        keys: ['fn', 'filter', 'data', 'context', 'originalType', 'groups', 'last'],

        notifyInternal: function (event, ce) {
            var self = this,
                s, t, ret,
                type = event.type,
                originalType;

            if (originalType = self.originalType) {
                event.type = originalType;
            } else {
                originalType = type;
            }

            // context undefined 时不能写死在 listener 中，否则不能保证 clone 时的 this
            if ((s = Special[originalType]) && s.handle) {
                t = s.handle(event, self, ce);
                // can handle
                if (t && t.length > 0) {
                    ret = t[0];
                }
            } else {
                ret = self.simpleNotify(event, ce);
            }

            if (ret === false) {
                event.halt();
            }

            // notify other mousemove listener
            event.type = type;

            return ret;
        }
    });

    return DomEventObserver;
}, {
    requires: ['./special', 'event/base']
});
/**
 * @ignore
 * event object for dom
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/object', function (S, BaseEvent, undefined) {
    var DOCUMENT = S.Env.host.document,
        TRUE = true,
        FALSE = false,
        commonProps = [
            'altKey', 'bubbles', 'cancelable',
            'ctrlKey', 'currentTarget', 'eventPhase',
            'metaKey', 'shiftKey', 'target',
            'timeStamp', 'view', 'type'
        ],
        eventNormalizers = [
            {
                reg: /^key/,
                props: ['char', 'charCode', 'key', 'keyCode', 'which'],
                fix: function (event, originalEvent) {
                    if (event.which == null) {
                        event.which = originalEvent.charCode != null ? originalEvent.charCode : originalEvent.keyCode;
                    }

                    // add metaKey to non-Mac browsers (use ctrl for PC 's and Meta for Macs)
                    if (event.metaKey === undefined) {
                        event.metaKey = event.ctrlKey;
                    }
                }
            },
            {
                reg: /^touch/,
                props: ['touches', 'changedTouches', 'targetTouches']
            },
            {
                reg: /^gesturechange$/i,
                props: ['rotation', 'scale']
            },
            {
                reg: /^(mousewheel|DOMMouseScroll)$/,
                props: [],
                fix: function (event, originalEvent) {
                    var deltaX,
                        deltaY,
                        delta,
                        wheelDelta = originalEvent.wheelDelta,
                        axis = originalEvent.axis,
                        wheelDeltaY = originalEvent['wheelDeltaY'],
                        wheelDeltaX = originalEvent['wheelDeltaX'],
                        detail = originalEvent.detail;

                    // ie/webkit
                    if (wheelDelta) {
                        delta = wheelDelta / 120;
                    }

                    // gecko
                    if (detail) {
                        // press control e.detail == 1 else e.detail == 3
                        delta = -(detail % 3 == 0 ? detail / 3 : detail);
                    }

                    // Gecko
                    if (axis !== undefined) {
                        if (axis === event['HORIZONTAL_AXIS']) {
                            deltaY = 0;
                            deltaX = -1 * delta;
                        } else if (axis === event['VERTICAL_AXIS']) {
                            deltaX = 0;
                            deltaY = delta;
                        }
                    }

                    // Webkit
                    if (wheelDeltaY !== undefined) {
                        deltaY = wheelDeltaY / 120;
                    }
                    if (wheelDeltaX !== undefined) {
                        deltaX = -1 * wheelDeltaX / 120;
                    }

                    // 默认 deltaY (ie)
                    if (!deltaX && !deltaY) {
                        deltaY = delta;
                    }

                    if (deltaX !== undefined) {
                        /**
                         * deltaX of mousewheel event
                         * @property deltaX
                         * @member KISSY.Event.DomEvent.Object
                         */
                        event.deltaX = deltaX;
                    }

                    if (deltaY !== undefined) {
                        /**
                         * deltaY of mousewheel event
                         * @property deltaY
                         * @member KISSY.Event.DomEvent.Object
                         */
                        event.deltaY = deltaY;
                    }

                    if (delta !== undefined) {
                        /**
                         * delta of mousewheel event
                         * @property delta
                         * @member KISSY.Event.DomEvent.Object
                         */
                        event.delta = delta;
                    }
                }
            },
            {
                reg: /^mouse|contextmenu|click|mspointer|(^DOMMouseScroll$)/i,
                props: [
                    'buttons', 'clientX', 'clientY', 'button',
                    'offsetX', 'relatedTarget', 'which',
                    'fromElement', 'toElement', 'offsetY',
                    'pageX', 'pageY', 'screenX', 'screenY'
                ],
                fix: function (event, originalEvent) {
                    var eventDoc, doc, body,
                        target = event.target,
                        button = originalEvent.button;

                    // Calculate pageX/Y if missing and clientX/Y available
                    if (event.pageX == null && originalEvent.clientX != null) {
                        eventDoc = target.ownerDocument || DOCUMENT;
                        doc = eventDoc.documentElement;
                        body = eventDoc.body;
                        event.pageX = originalEvent.clientX +
                            ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                            ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                        event.pageY = originalEvent.clientY +
                            ( doc && doc.scrollTop || body && body.scrollTop || 0 ) -
                            ( doc && doc.clientTop || body && body.clientTop || 0 );
                    }

                    // which for click: 1 === left; 2 === middle; 3 === right
                    // do not use button
                    if (!event.which && button !== undefined) {
                        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                    }

                    // add relatedTarget, if necessary
                    if (!event.relatedTarget && event.fromElement) {
                        event.relatedTarget = (event.fromElement === target) ? event.toElement : event.fromElement;
                    }

                    return event;
                }
            }
        ];

    function retTrue() {
        return TRUE;
    }

    function retFalse() {
        return FALSE;
    }

    /**
     * Do not new by yourself.
     *
     * KISSY 's dom event system normalizes the event object according to
     * W3C standards.
     *
     * The event object is guaranteed to be passed to
     * the event handler.
     *
     * Most properties from the original event are
     * copied over and normalized to the new event object
     * according to [W3C standards](http://www.w3.org/TR/dom/#event).
     *
     * @class KISSY.Event.DomEvent.Object
     * @extends KISSY.Event.Object
     * @private
     * @param originalEvent native dom event
     */
    function DomEventObject(originalEvent) {
        var self = this,
            type = originalEvent.type;

        /**
         * altKey
         * @property altKey
         */

        /**
         * attrChange
         * @property attrChange
         */

        /**
         * attrName
         * @property attrName
         */

        /**
         * bubbles
         * @property bubbles
         */

        /**
         * button
         * @property button
         */

        /**
         * cancelable
         * @property cancelable
         */

        /**
         * charCode
         * @property charCode
         */

        /**
         * clientX
         * @property clientX
         */

        /**
         * clientY
         * @property clientY
         */

        /**
         * ctrlKey
         * @property ctrlKey
         */

        /**
         * data
         * @property data
         */

        /**
         * detail
         * @property detail
         */

        /**
         * eventPhase
         * @property eventPhase
         */

        /**
         * fromElement
         * @property fromElement
         */

        /**
         * handler
         * @property handler
         */

        /**
         * keyCode
         * @property keyCode
         */

        /**
         * metaKey
         * @property metaKey
         */

        /**
         * newValue
         * @property newValue
         */

        /**
         * offsetX
         * @property offsetX
         */

        /**
         * offsetY
         * @property offsetY
         */

        /**
         * pageX
         * @property pageX
         */

        /**
         * pageY
         * @property pageY
         */

        /**
         * prevValue
         * @property prevValue
         */

        /**
         * relatedNode
         * @property relatedNode
         */

        /**
         * relatedTarget
         * @property relatedTarget
         */

        /**
         * screenX
         * @property screenX
         */

        /**
         * screenY
         * @property screenY
         */

        /**
         * shiftKey
         * @property shiftKey
         */

        /**
         * srcElement
         * @property srcElement
         */

        /**
         * toElement
         * @property toElement
         */

        /**
         * view
         * @property view
         */

        /**
         * wheelDelta
         * @property wheelDelta
         */

        /**
         * which
         * @property which
         */

        /**
         * changedTouches
         * @property changedTouches
         */

        /**
         * touches
         * @property touches
         */

        /**
         * targetTouches
         * @property targetTouches
         */

        /**
         * rotation
         * @property rotation
         */

        /**
         * scale
         * @property scale
         */

        /**
         * source html node of current event
         * @property target
         * @type {HTMLElement}
         */

        /**
         * current htm node which processes current event
         * @property currentTarget
         * @type {HTMLElement}
         */

        DomEventObject.superclass.constructor.call(self);

        self.originalEvent = originalEvent;

        // in case dom event has been mark as default prevented by lower dom node
        var isDefaultPrevented = retFalse;
        if ('defaultPrevented' in originalEvent) {
            isDefaultPrevented = originalEvent['defaultPrevented'] ? retTrue : retFalse;
        } else if ('getPreventDefault' in originalEvent) {
            // https://bugzilla.mozilla.org/show_bug.cgi?id=691151
            isDefaultPrevented = originalEvent['getPreventDefault']() ? retTrue : retFalse;
        } else if ('returnValue' in originalEvent) {
            isDefaultPrevented = originalEvent.returnValue === FALSE ? retTrue : retFalse;
        }

        self.isDefaultPrevented = isDefaultPrevented;

        var fixFns = [],
            fixFn,
            l,
            prop,
            props = commonProps.concat();

        S.each(eventNormalizers, function (normalizer) {
            if (type.match(normalizer.reg)) {
                props = props.concat(normalizer.props);
                if (normalizer.fix)
                    fixFns.push(normalizer.fix);
            }
            return undefined;
        });

        l = props.length;

        // clone properties of the original event object
        while (l) {
            prop = props[--l];
            self[prop] = originalEvent[prop];
        }

        // fix target property, if necessary
        if (!self.target) {
            self.target = originalEvent.srcElement || DOCUMENT; // srcElement might not be defined either
        }

        // check if target is a text node (safari)
        if (self.target.nodeType === 3) {
            self.target = self.target.parentNode;
        }

        l = fixFns.length;

        while (l) {
            fixFn = fixFns[--l];
            fixFn(self, originalEvent);
        }
    }

    S.extend(DomEventObject, BaseEvent.Object, {

        constructor: DomEventObject,

        preventDefault: function () {
            var self = this,
                e = self.originalEvent;

            // if preventDefault exists run it on the original event
            if (e.preventDefault) {
                e.preventDefault();
            }
            // otherwise set the returnValue property of the original event to FALSE (IE)
            else {
                e.returnValue = FALSE;
            }

            DomEventObject.superclass.preventDefault.call(self);
        },

        stopPropagation: function () {
            var self = this,
                e = self.originalEvent;

            // if stopPropagation exists run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to TRUE (IE)
            else {
                e.cancelBubble = TRUE;
            }

            DomEventObject.superclass.stopPropagation.call(self);
        }
    });

    return DomEventObject;

}, {
    requires: ['event/base']
});

/*
 2012-10-30
 - consider touch properties

 2012-10-24
 - merge with mousewheel: not perfect in osx : accelerated scroll

 2010.04
 - http://www.w3.org/TR/2003/WD-Dom-Level-3-Events-20030331/ecma-script-binding.html

 - refer:
 https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js
 http://www.planabc.net/2010/08/12/mousewheel_event_in_javascript/
 http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
 http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers/5542105#5542105
 http://www.javascriptkit.com/javatutors/onmousewheel.shtml
 http://www.adomas.org/javascript-mouse-wheel/
 http://plugins.jquery.com/project/mousewheel
 http://www.cnblogs.com/aiyuchen/archive/2011/04/19/2020843.html
 http://www.w3.org/TR/Dom-Level-3-Events/#events-mousewheelevents
 */
/**
 * @ignore
 * custom event for dom.
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/observable', function (S, Dom, Special, DomEventUtils, DomEventObserver, DomEventObject, BaseEvent) {

    // 记录手工 fire(domElement,type) 时的 type
    // 再在浏览器通知的系统 eventHandler 中检查
    // 如果相同，那么证明已经 fire 过了，不要再次触发了
    var BaseUtils = BaseEvent.Utils;
    var logger= S.getLogger('s/event');

    /**
     * custom event for dom
     * @param {Object} cfg
     * @private
     * @class KISSY.Event.DomEvent.Observable
     * @extends KISSY.Event.Observable
     */
    function DomEventObservable(cfg) {
        var self = this;
        S.mix(self, cfg);
        self.reset();
        /**
         * html node which binds current custom event
         * @cfg {HTMLElement} currentTarget
         */
    }

    S.extend(DomEventObservable, BaseEvent.Observable, {

        setup: function () {
            var self = this,
                type = self.type,
                s = Special[type] || {},
                currentTarget = self.currentTarget,
                eventDesc = DomEventUtils.data(currentTarget),
                handle = eventDesc.handle;
            // 第一次注册该事件，dom 节点才需要注册 dom 事件
            if (!s.setup || s.setup.call(currentTarget, type) === false) {
                DomEventUtils.simpleAdd(currentTarget, type, handle)
            }
        },

        constructor: DomEventObservable,

        reset: function () {
            var self = this;
            DomEventObservable.superclass.reset.call(self);
            self.delegateCount = 0;
            self.lastCount = 0;
        },

        /**
         * notify current event 's observers
         * @param {KISSY.Event.DomEvent.Object} event
         * @return {*} return false if one of custom event 's observers  else
         * return last value of custom event 's observers 's return value.
         */
        notify: function (event) {
            /*
             As some listeners may remove themselves from the
             event, the original array length is dynamic. So,
             let's make a copy of all listeners, so we are
             sure we'll call all of them.
             */
            /*
             Dom3 Events: EventListenerList objects in the Dom are live. ??
             */
            var target = event.target,
                eventType = event['type'],
                self = this,
                currentTarget = self.currentTarget,
                observers = self.observers,
                currentTarget0,
                allObservers = [],
                ret,
                gRet,
                observerObj,
                i,
                j,
                delegateCount = self.delegateCount || 0,
                len,
                currentTargetObservers,
                currentTargetObserver,
                observer;

            // collect delegated observers and corresponding element
            if (delegateCount && target.nodeType) {
                while (target != currentTarget) {
                    if (target.disabled !== true || eventType !== 'click') {
                        var cachedMatch = {},
                            matched, key, filter;
                        currentTargetObservers = [];
                        for (i = 0; i < delegateCount; i++) {
                            observer = observers[i];
                            filter = observer.filter;
                            key = filter + '';
                            matched = cachedMatch[key];
                            if (matched === undefined) {
                                matched = cachedMatch[key] = Dom.test(target, filter);
                            }
                            if (matched) {
                                currentTargetObservers.push(observer);
                            }
                        }
                        if (currentTargetObservers.length) {
                            allObservers.push({
                                currentTarget: target,
                                'currentTargetObservers': currentTargetObservers
                            });
                        }
                    }
                    target = target.parentNode || currentTarget;
                }
            }

            // root node's observers is placed at end position of add observers
            // in case child node stopPropagation of root node's observers
            if (delegateCount < observers.length) {
                allObservers.push({
                    currentTarget: currentTarget,
                    // http://www.w3.org/TR/dom/#dispatching-events
                    // Let listeners be a static list of the event listeners
                    // associated with the object for which these steps are run.
                    currentTargetObservers: observers.slice(delegateCount)
                });
            }

            //noinspection JSUnresolvedFunction
            for (i = 0, len = allObservers.length; !event.isPropagationStopped() && i < len; ++i) {

                observerObj = allObservers[i];
                currentTargetObservers = observerObj.currentTargetObservers;
                currentTarget0 = observerObj.currentTarget;
                event.currentTarget = currentTarget0;

                //noinspection JSUnresolvedFunction
                for (j = 0; !event.isImmediatePropagationStopped() && j < currentTargetObservers.length; j++) {

                    currentTargetObserver = currentTargetObservers[j];

                    ret = currentTargetObserver.notify(event, self);

                    // 和 jQuery 逻辑保持一致
                    // 有一个 false，最终结果就是 false
                    // 否则等于最后一个返回值
                    if (gRet !== false && ret !== undefined) {
                        gRet = ret;
                    }
                }
            }

            // fire 时判断如果 preventDefault，则返回 false 否则返回 true
            // 这里返回值意义不同
            return gRet;
        },

        /**
         * fire dom event from bottom to up , emulate dispatchEvent in Dom3 Events
         * @param {Object|KISSY.Event.DomEvent.Object} [event] additional event data
         * @param {Boolean} [onlyHandlers] for internal usage
         */
        fire: function (event, onlyHandlers/*internal usage*/) {
            event = event || {};

            var self = this,
                eventType = String(self.type),
                domEventObservable,
                eventData,
                specialEvent = Special[eventType] || {},
                bubbles = specialEvent.bubbles !== false,
                currentTarget = self.currentTarget;

            // special fire for click/focus/blur
            if (specialEvent.fire && specialEvent.fire.call(currentTarget, onlyHandlers) === false) {
                return;
            }

            if (!(event instanceof DomEventObject)) {
                eventData = event;
                event = new DomEventObject({
                    currentTarget: currentTarget,
                    type: eventType,
                    target: currentTarget
                });
                S.mix(event, eventData);
            }

            if (specialEvent.preFire && specialEvent.preFire.call(currentTarget, event, onlyHandlers) === false) {
                return;
            }

            // onlyHandlers is equal to event.halt()
            // but we can not call event.halt()
            // because handle will check event.isPropagationStopped
            var cur = currentTarget,
                win = Dom.getWindow(cur),
                curDocument = win.document,
                eventPath = [],
                gret,
                ret,
                ontype = 'on' + eventType,
                eventPathIndex = 0;

            // http://www.w3.org/TR/dom/#dispatching-events
            // let event path be a static ordered list of all its ancestors in tree order,
            // or let event path be the empty list otherwise.
            do {
                eventPath.push(cur);
                // Bubble up to document, then to window
                cur = cur.parentNode || cur.ownerDocument || (cur === curDocument) && win;
            } while (!onlyHandlers && cur && bubbles);

            cur = eventPath[eventPathIndex];

            // bubble up dom tree
            do {
                event['currentTarget'] = cur;
                domEventObservable = DomEventObservable.getDomEventObservable(cur, eventType);
                // default bubble for html node
                if (domEventObservable) {
                    ret = domEventObservable.notify(event);
                    if (ret !== undefined && gret !== false) {
                        gret = ret;
                    }
                }
                // Trigger an inline bound script
                if (cur[ ontype ] && cur[ ontype ].call(cur) === false) {
                    event.preventDefault();
                }
                cur = eventPath[++eventPathIndex];
            } while (!onlyHandlers && cur && !event.isPropagationStopped());

            if (!onlyHandlers && !event.isDefaultPrevented()) {
                // now all browser support click
                // https://developer.mozilla.org/en-US/docs/Dom/element.click
                try {
                    // execute default action on dom node
                    // exclude window
                    if (currentTarget[ eventType ] && !S.isWindow(currentTarget)) {
                        // 记录当前 trigger 触发
                        DomEventObservable.triggeredEvent = eventType;

                        // 只触发默认事件，而不要执行绑定的用户回调
                        // 同步触发
                        currentTarget[ eventType ]();
                    }
                } catch (eError) {
                    logger.debug('trigger action error: '+eError);
                }

                DomEventObservable.triggeredEvent = '';
            }

            return gret;
        },

        /**
         * add a observer to custom event's observers
         * @param {Object} cfg {@link KISSY.Event.DomEvent.Observer} 's config
         */
        on: function (cfg) {
            var self = this,
                observers = self.observers,
                s = Special[self.type] || {},
            // clone event
                observer = cfg instanceof DomEventObserver ? cfg : new DomEventObserver(cfg);

            if (S.Config.debug) {
                if (!observer.fn) {
                    S.error('lack event handler for ' + self.type);
                }
            }

            if (self.findObserver(/**@type KISSY.Event.DomEvent.Observer
             @ignore*/observer) == -1) {
                // 增加 listener
                if (observer.filter) {
                    observers.splice(self.delegateCount, 0, observer);
                    self.delegateCount++;
                } else {
                    if (observer.last) {
                        observers.push(observer);
                        self.lastCount++;
                    } else {
                        observers.splice(observers.length - self.lastCount, 0, observer);
                    }
                }

                if (s.add) {
                    s.add.call(self.currentTarget, observer);
                }
            }
        },

        /**
         * remove some observers from current event 's observers by observer config param
         * @param {Object} cfg {@link KISSY.Event.DomEvent.Observer} 's config
         */
        detach: function (cfg) {
            var groupsRe,
                self = this,
                s = Special[self.type] || {},
                hasFilter = 'filter' in cfg,
                filter = cfg.filter,
                context = cfg.context,
                fn = cfg.fn,
                currentTarget = self.currentTarget,
                observers = self.observers,
                groups = cfg.groups;

            if (!observers.length) {
                return;
            }

            if (groups) {
                groupsRe = BaseUtils.getGroupsRe(groups);
            }

            var i, j, t, observer, observerContext, len = observers.length;

            // 移除 fn
            if (fn || hasFilter || groupsRe) {
                context = context || currentTarget;

                for (i = 0, j = 0, t = []; i < len; ++i) {
                    observer = observers[i];
                    observerContext = observer.context || currentTarget;
                    if (
                        (context != observerContext) ||
                            // 指定了函数，函数不相等，保留
                            (fn && fn != observer.fn) ||
                            // 1.没指定函数
                            // 1.1 没有指定选择器,删掉 else2
                            // 1.2 指定选择器,字符串为空
                            // 1.2.1 指定选择器,字符串为空,待比较 observer 有选择器,删掉 else
                            // 1.2.2 指定选择器,字符串为空,待比较 observer 没有选择器,保留
                            // 1.3 指定选择器,字符串不为空,字符串相等,删掉 else
                            // 1.4 指定选择器,字符串不为空,字符串不相等,保留
                            // 2.指定了函数且函数相等
                            // 2.1 没有指定选择器,删掉 else
                            // 2.2 指定选择器,字符串为空
                            // 2.2.1 指定选择器,字符串为空,待比较 observer 有选择器,删掉 else
                            // 2.2.2 指定选择器,字符串为空,待比较 observer 没有选择器,保留
                            // 2.3 指定选择器,字符串不为空,字符串相等,删掉  else
                            // 2.4 指定选择器,字符串不为空,字符串不相等,保留
                            (
                                hasFilter &&
                                    (
                                        (filter && filter != observer.filter) ||
                                            (!filter && !observer.filter)
                                        )
                                ) ||

                            // 指定了删除的某些组，而该 observer 不属于这些组，保留，否则删除
                            (groupsRe && !observer.groups.match(groupsRe))
                        ) {
                        t[j++] = observer;
                    } else {
                        if (observer.filter && self.delegateCount) {
                            self.delegateCount--;
                        }
                        if (observer.last && self.lastCount) {
                            self.lastCount--;
                        }
                        if (s.remove) {
                            s.remove.call(currentTarget, observer);
                        }
                    }
                }

                self.observers = t;
            } else {
                // 全部删除
                self.reset();
            }

            self.checkMemory();
        },

        checkMemory: function () {
            var self = this,
                type = self.type,
                domEventObservables,
                handle,
                s = Special[type] || {},
                currentTarget = self.currentTarget,
                eventDesc = DomEventUtils.data(currentTarget);
            if (eventDesc) {
                domEventObservables = eventDesc.observables;
                if (!self.hasObserver()) {
                    handle = eventDesc.handle;
                    // remove(el, type) or fn 已移除光
                    // dom node need to detach handler from dom node
                    if ((!s['tearDown'] || s['tearDown'].call(currentTarget, type) === false)) {
                        DomEventUtils.simpleRemove(currentTarget, type, handle);
                    }
                    // remove currentTarget's single event description
                    delete domEventObservables[type];
                }

                // remove currentTarget's  all domEventObservables description
                if (S.isEmptyObject(domEventObservables)) {
                    eventDesc.handle = null;
                    DomEventUtils.removeData(currentTarget);
                }
            }
        }
    });

    DomEventObservable.triggeredEvent = '';

    /**
     * get custom event from html node by event type.
     * @param {HTMLElement} node
     * @param {String} type event type
     * @return {KISSY.Event.DomEvent.Observable}
     */
    DomEventObservable.getDomEventObservable = function (node, type) {

        var domEventObservablesHolder = DomEventUtils.data(node),
            domEventObservables;
        if (domEventObservablesHolder) {
            domEventObservables = domEventObservablesHolder.observables;
        }
        if (domEventObservables) {
            return domEventObservables[type];
        }

        return null;
    };


    DomEventObservable.getDomEventObservablesHolder = function (node, create) {
        var domEventObservables = DomEventUtils.data(node);
        if (!domEventObservables && create) {
            DomEventUtils.data(node, domEventObservables = {});
        }
        return domEventObservables;
    };

    return DomEventObservable;

}, {
    requires: ['dom', './special', './utils', './observer', './object', 'event/base']
});
/**
 * @ignore
 * setup event/dom api module
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/dom-event', function (S, BaseEvent, DomEventUtils, Dom, Special, DomEventObservable, DomEventObject) {
    var BaseUtils = BaseEvent.Utils;

    var undefined = undefined;

    function fixType(cfg, type) {
        var s = Special[type] || {},
            typeFix;

        // in case overwritten by typeFix in special events
        // (mouseenter/leave,focusin/out)
        if (!cfg.originalType && (typeFix = s.typeFix)) {
            // when on mouseenter, it's actually on mouseover,
            // and observers is saved with mouseover!
            cfg.originalType = type;
            type = typeFix;
        }

        return type;
    }

    function addInternal(currentTarget, type, cfg) {
        var domEventObservablesHolder,
            domEventObservable,
            domEventObservables,
            handle;

        cfg = S.merge(cfg);
        type = fixType(cfg, type);

        // 获取事件描述
        domEventObservablesHolder = DomEventObservable.getDomEventObservablesHolder(currentTarget, 1);

        if (!(handle = domEventObservablesHolder.handle)) {
            handle = domEventObservablesHolder.handle = function (event) {
                // 是经过 fire 手动调用而浏览器同步触发导致的，就不要再次触发了，
                // 已经在 fire 中 bubble 过一次了
                // in case after page has unloaded
                var type = event.type,
                    domEventObservable,
                    currentTarget = handle.currentTarget;
                if (DomEventObservable.triggeredEvent == type ||
                    typeof KISSY == 'undefined') {
                    return undefined;
                }
                domEventObservable = DomEventObservable.getDomEventObservable(currentTarget, type);
                if (domEventObservable) {
                    event.currentTarget = currentTarget;
                    event = new DomEventObject(event);
                    return domEventObservable.notify(event);
                }
                return undefined;
            };
            handle.currentTarget = currentTarget;
        }

        if (!(domEventObservables = domEventObservablesHolder.observables)) {
            domEventObservables = domEventObservablesHolder.observables = {};
        }

        //事件 listeners , similar to eventListeners in Dom3 Events
        domEventObservable = domEventObservables[type];

        if (!domEventObservable) {
            domEventObservable = domEventObservables[type] = new DomEventObservable({
                type: type,
                currentTarget: currentTarget
            });

            domEventObservable.setup();
        }

        domEventObservable.on(cfg);

        currentTarget = null;
    }

    function removeInternal(currentTarget, type, cfg) {
        // copy
        cfg = S.merge(cfg);

        var customEvent;

        type = fixType(cfg, type);

        var domEventObservablesHolder = DomEventObservable.getDomEventObservablesHolder(currentTarget),
            domEventObservables = (domEventObservablesHolder || {}).observables;

        if (!domEventObservablesHolder || !domEventObservables) {
            return;
        }

        // remove all types of event
        if (!type) {
            for (type in domEventObservables) {
                domEventObservables[type].detach(cfg);
            }
            return;
        }

        customEvent = domEventObservables[type];

        if (customEvent) {
            customEvent.detach(cfg);
        }
    }

    /**
     * Dom Event Management
     * @private
     * @class KISSY.Event.DomEvent
     */
    var DomEvent={
        /**
         * Adds an event listener.similar to addEventListener in Dom3 Events
         * @param targets KISSY selector
         * @param type {String} The type of event to append.
         * use space to separate multiple event types.
         * @param fn {Function|Object} The event listener or event description object.
         * @param {Function} fn.fn The event listener
         * @param {Function} fn.context The context (this reference) in which the handler function is executed.
         * @param {String|Function} fn.filter filter selector string or function to find right element
         * @param {Boolean} fn.once whether fn will be removed once after it is executed.
         * @param {Object} [context] The context (this reference) in which the handler function is executed.
         */
        on: function (targets, type, fn, context) {
            // data : 附加在回调后面的数据，delegate 检查使用
            // remove 时 data 相等(指向同一对象或者定义了 equals 比较函数)
            targets = Dom.query(targets);

            BaseUtils.batchForType(function (targets, type, fn, context) {
                var cfg = BaseUtils.normalizeParam(type, fn, context), i, t;
                type = cfg.type;
                for (i = targets.length - 1; i >= 0; i--) {
                    t = targets[i];
                    addInternal(t, type, cfg);
                }
            }, 1, targets, type, fn, context);

            return targets;
        },

        /**
         * Detach an event or set of events from an element. similar to removeEventListener in Dom3 Events
         * @param targets KISSY selector
         * @param {String|Boolean} [type] The type of event to remove.
         * use space to separate multiple event types.
         * or
         * whether to remove all events from descendants nodes.
         * @param [fn] {Function|Object} The event listener or event description object.
         * @param {Function} fn.fn The event listener
         * @param {Function} [fn.context] The context (this reference) in which the handler function is executed.
         * @param {String|Function} [fn.filter] filter selector string or function to find right element
         * @param {Boolean} [fn.once] whether fn will be removed once after it is executed.
         * @param {Object} [context] The context (this reference) in which the handler function is executed.
         */
        detach: function (targets, type, fn, context) {

            targets = Dom.query(targets);

            BaseUtils.batchForType(function (targets, singleType, fn, context) {

                var cfg = BaseUtils.normalizeParam(singleType, fn, context),
                    i,
                    j,
                    elChildren,
                    t;

                singleType = cfg.type;

                for (i = targets.length - 1; i >= 0; i--) {
                    t = targets[i];
                    removeInternal(t, singleType, cfg);
                    // deep remove
                    if (cfg.deep && t.getElementsByTagName) {
                        elChildren = t.getElementsByTagName('*');
                        for (j = elChildren.length - 1; j >= 0; j--) {
                            removeInternal(elChildren[j], singleType, cfg);
                        }
                    }
                }

            }, 1, targets, type, fn, context);

            return targets;

        },

        /**
         * Delegate event.
         * @param targets KISSY selector
         * @param {String|Function} filter filter selector string or function to find right element
         * @param {String} [eventType] The type of event to delegate.
         * use space to separate multiple event types.
         * @param {Function} [fn] The event listener.
         * @param {Object} [context] The context (this reference) in which the handler function is executed.
         * 
         */
        delegate: function (targets, eventType, filter, fn, context) {
            return DomEvent.on(targets, eventType, {
                fn: fn,
                context: context,
                filter: filter
            });
        },
        /**
         * undelegate event.
         * @param targets KISSY selector
         * @param {String} [eventType] The type of event to undelegate.
         * use space to separate multiple event types.
         * @param {String|Function} [filter] filter selector string or function to find right element
         * @param {Function} [fn] The event listener.
         * @param {Object} [context] The context (this reference) in which the handler function is executed.
         * 
         */
        undelegate: function (targets, eventType, filter, fn, context) {
            return DomEvent.detach(targets, eventType, {
                fn: fn,
                context: context,
                filter: filter
            });
        },

        /**
         * fire event,simulate bubble in browser. similar to dispatchEvent in Dom3 Events
         * @param targets html nodes
         * 
         * @param {String} eventType event type
         * @param [eventData] additional event data
         * @param {Boolean} [onlyHandlers] for internal usage
         * @return {*} return false if one of custom event 's observers (include bubbled) else
         * return last value of custom event 's observers (include bubbled) 's return value.
         */
        fire: function (targets, eventType, eventData, onlyHandlers/*internal usage*/) {
            var ret = undefined;
            // custom event firing moved to target.js
            eventData = eventData || {};

            /**
             * identify event as fired manually
             * @ignore
             */
            eventData.synthetic = 1;

            BaseUtils.splitAndRun(eventType, function (eventType) {

                var r,
                    i,
                    target,
                    domEventObservable;

                BaseUtils.fillGroupsForEvent(eventType, eventData);

                // mouseenter
                eventType = eventData.type;
                var s = Special[eventType];

                var originalType = eventType;

                // where observers lie
                // mouseenter observer lies on mouseover
                if (s && s.typeFix) {
                    // mousemove
                    originalType = s.typeFix;
                }

                targets = Dom.query(targets);

                for (i = targets.length - 1; i >= 0; i--) {
                    target = targets[i];
                    domEventObservable = DomEventObservable.getDomEventObservable(target, originalType);
                    // bubbling
                    // html dom event defaults to bubble
                    if (!onlyHandlers && !domEventObservable) {
                        domEventObservable = new DomEventObservable({
                            type: originalType,
                            currentTarget: target
                        });
                    }
                    if (domEventObservable) {
                        r = domEventObservable.fire(eventData, onlyHandlers);
                        if (ret !== false && r !== undefined) {
                            ret = r;
                        }
                    }
                }
            });

            return ret;
        },

        /**
         * same with fire but:
         * - does not cause default behavior to occur.
         * - does not bubble up the Dom hierarchy.
         * @param targets html nodes
         * 
         * @param {String} eventType event type
         * @param [eventData] additional event data
         * @return {*} return false if one of custom event 's observers (include bubbled) else
         * return last value of custom event 's observers (include bubbled) 's return value.
         */
        fireHandler: function (targets, eventType, eventData) {
            return DomEvent.fire(targets, eventType, eventData, 1);
        },


        /**
         * copy event from src to dest
         * 
         * @param {HTMLElement} src srcElement
         * @param {HTMLElement} dest destElement
         * @private
         */
        clone: function (src, dest) {
            var domEventObservablesHolder,
                domEventObservables;
            if (!(domEventObservablesHolder = DomEventObservable.getDomEventObservablesHolder(src))) {
                return;
            }
            var srcData = DomEventUtils.data(src);
            if (srcData && srcData === DomEventUtils.data(dest)) {
                // remove event data (but without dom attached listener)
                // which is copied from above Dom.data
                DomEventUtils.removeData(dest);
            }
            domEventObservables = domEventObservablesHolder.observables;
            S.each(domEventObservables, function (customEvent, type) {
                S.each(customEvent.observers, function (observer) {
                    // context undefined
                    // 不能 this 写死在 handlers 中
                    // 否则不能保证 clone 时的 this
                    addInternal(dest, type, observer);
                });
            });
        }
    };

    return DomEvent;
}, {
    requires: ['event/base',
        './utils',
        'dom', './special', './observable', './object']
});
/*
 2012-02-12 yiminghe@gmail.com note:
 - 普通 remove() 不管 filter 都会查，如果 fn context 相等就移除
 - undelegate() filter 为 ''，那么去除所有委托绑定的 handler
 */
/**
 * @ignore
 * some key-codes definition and utils from closure-library
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/key-codes', function (S) {
    var UA = S.UA,
        /**
         * @enum {Number} KISSY.Event.DomEvent.KeyCode
         * @alias KISSY.Event.KeyCode
         * All key codes.
         */
            KeyCode = {
            /**
             * MAC_ENTER
             */
            MAC_ENTER: 3,
            /**
             * BACKSPACE
             */
            BACKSPACE: 8,
            /**
             * TAB
             */
            TAB: 9,
            /**
             * NUMLOCK on FF/Safari Mac
             */
            NUM_CENTER: 12, // NUMLOCK on FF/Safari Mac
            /**
             * ENTER
             */
            ENTER: 13,
            /**
             * SHIFT
             */
            SHIFT: 16,
            /**
             * CTRL
             */
            CTRL: 17,
            /**
             * ALT
             */
            ALT: 18,
            /**
             * PAUSE
             */
            PAUSE: 19,
            /**
             * CAPS_LOCK
             */
            CAPS_LOCK: 20,
            /**
             * ESC
             */
            ESC: 27,
            /**
             * SPACE
             */
            SPACE: 32,
            /**
             * PAGE_UP
             */
            PAGE_UP: 33, // also NUM_NORTH_EAST
            /**
             * PAGE_DOWN
             */
            PAGE_DOWN: 34, // also NUM_SOUTH_EAST
            /**
             * END
             */
            END: 35, // also NUM_SOUTH_WEST
            /**
             * HOME
             */
            HOME: 36, // also NUM_NORTH_WEST
            /**
             * LEFT
             */
            LEFT: 37, // also NUM_WEST
            /**
             * UP
             */
            UP: 38, // also NUM_NORTH
            /**
             * RIGHT
             */
            RIGHT: 39, // also NUM_EAST
            /**
             * DOWN
             */
            DOWN: 40, // also NUM_SOUTH
            /**
             * PRINT_SCREEN
             */
            PRINT_SCREEN: 44,
            /**
             * INSERT
             */
            INSERT: 45, // also NUM_INSERT
            /**
             * DELETE
             */
            DELETE: 46, // also NUM_DELETE
            /**
             * ZERO
             */
            ZERO: 48,
            /**
             * ONE
             */
            ONE: 49,
            /**
             * TWO
             */
            TWO: 50,
            /**
             * THREE
             */
            THREE: 51,
            /**
             * FOUR
             */
            FOUR: 52,
            /**
             * FIVE
             */
            FIVE: 53,
            /**
             * SIX
             */
            SIX: 54,
            /**
             * SEVEN
             */
            SEVEN: 55,
            /**
             * EIGHT
             */
            EIGHT: 56,
            /**
             * NINE
             */
            NINE: 57,
            /**
             * QUESTION_MARK
             */
            QUESTION_MARK: 63, // needs localization
            /**
             * A
             */
            A: 65,
            /**
             * B
             */
            B: 66,
            /**
             * C
             */
            C: 67,
            /**
             * D
             */
            D: 68,
            /**
             * E
             */
            E: 69,
            /**
             * F
             */
            F: 70,
            /**
             * G
             */
            G: 71,
            /**
             * H
             */
            H: 72,
            /**
             * I
             */
            I: 73,
            /**
             * J
             */
            J: 74,
            /**
             * K
             */
            K: 75,
            /**
             * L
             */
            L: 76,
            /**
             * M
             */
            M: 77,
            /**
             * N
             */
            N: 78,
            /**
             * O
             */
            O: 79,
            /**
             * P
             */
            P: 80,
            /**
             * Q
             */
            Q: 81,
            /**
             * R
             */
            R: 82,
            /**
             * S
             */
            S: 83,
            /**
             * T
             */
            T: 84,
            /**
             * U
             */
            U: 85,
            /**
             * V
             */
            V: 86,
            /**
             * W
             */
            W: 87,
            /**
             * X
             */
            X: 88,
            /**
             * Y
             */
            Y: 89,
            /**
             * Z
             */
            Z: 90,
            /**
             * META
             */
            META: 91, // WIN_KEY_LEFT
            /**
             * WIN_KEY_RIGHT
             */
            WIN_KEY_RIGHT: 92,
            /**
             * CONTEXT_MENU
             */
            CONTEXT_MENU: 93,
            /**
             * NUM_ZERO
             */
            NUM_ZERO: 96,
            /**
             * NUM_ONE
             */
            NUM_ONE: 97,
            /**
             * NUM_TWO
             */
            NUM_TWO: 98,
            /**
             * NUM_THREE
             */
            NUM_THREE: 99,
            /**
             * NUM_FOUR
             */
            NUM_FOUR: 100,
            /**
             * NUM_FIVE
             */
            NUM_FIVE: 101,
            /**
             * NUM_SIX
             */
            NUM_SIX: 102,
            /**
             * NUM_SEVEN
             */
            NUM_SEVEN: 103,
            /**
             * NUM_EIGHT
             */
            NUM_EIGHT: 104,
            /**
             * NUM_NINE
             */
            NUM_NINE: 105,
            /**
             * NUM_MULTIPLY
             */
            NUM_MULTIPLY: 106,
            /**
             * NUM_PLUS
             */
            NUM_PLUS: 107,
            /**
             * NUM_MINUS
             */
            NUM_MINUS: 109,
            /**
             * NUM_PERIOD
             */
            NUM_PERIOD: 110,
            /**
             * NUM_DIVISION
             */
            NUM_DIVISION: 111,
            /**
             * F1
             */
            F1: 112,
            /**
             * F2
             */
            F2: 113,
            /**
             * F3
             */
            F3: 114,
            /**
             * F4
             */
            F4: 115,
            /**
             * F5
             */
            F5: 116,
            /**
             * F6
             */
            F6: 117,
            /**
             * F7
             */
            F7: 118,
            /**
             * F8
             */
            F8: 119,
            /**
             * F9
             */
            F9: 120,
            /**
             * F10
             */
            F10: 121,
            /**
             * F11
             */
            F11: 122,
            /**
             * F12
             */
            F12: 123,
            /**
             * NUMLOCK
             */
            NUMLOCK: 144,
            /**
             * SEMICOLON
             */
            SEMICOLON: 186, // needs localization
            /**
             * DASH
             */
            DASH: 189, // needs localization
            /**
             * EQUALS
             */
            EQUALS: 187, // needs localization
            /**
             * COMMA
             */
            COMMA: 188, // needs localization
            /**
             * PERIOD
             */
            PERIOD: 190, // needs localization
            /**
             * SLASH
             */
            SLASH: 191, // needs localization
            /**
             * APOSTROPHE
             */
            APOSTROPHE: 192, // needs localization
            /**
             * SINGLE_QUOTE
             */
            SINGLE_QUOTE: 222, // needs localization
            /**
             * OPEN_SQUARE_BRACKET
             */
            OPEN_SQUARE_BRACKET: 219, // needs localization
            /**
             * BACKSLASH
             */
            BACKSLASH: 220, // needs localization
            /**
             * CLOSE_SQUARE_BRACKET
             */
            CLOSE_SQUARE_BRACKET: 221, // needs localization
            /**
             * WIN_KEY
             */
            WIN_KEY: 224,
            /**
             * MAC_FF_META
             */
            MAC_FF_META: 224, // Firefox (Gecko) fires this for the meta key instead of 91
            /**
             * WIN_IME
             */
            WIN_IME: 229
        };

    /*
      whether text and modified key is entered at the same time.
     */
    KeyCode.isTextModifyingKeyEvent = function (e) {
        var keyCode = e.keyCode;
        if (e.altKey && !e.ctrlKey || e.metaKey ||
            // Function keys don't generate text
            keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
            return false;
        }

        // The following keys are quite harmless, even in combination with
        // CTRL, ALT or SHIFT.
        switch (keyCode) {
            case KeyCode.ALT:
            case KeyCode.CAPS_LOCK:
            case KeyCode.CONTEXT_MENU:
            case KeyCode.CTRL:
            case KeyCode.DOWN:
            case KeyCode.END:
            case KeyCode.ESC:
            case KeyCode.HOME:
            case KeyCode.INSERT:
            case KeyCode.LEFT:
            case KeyCode.MAC_FF_META:
            case KeyCode.META:
            case KeyCode.NUMLOCK:
            case KeyCode.NUM_CENTER:
            case KeyCode.PAGE_DOWN:
            case KeyCode.PAGE_UP:
            case KeyCode.PAUSE:
            case KeyCode.PRINT_SCREEN:
            case KeyCode.RIGHT:
            case KeyCode.SHIFT:
            case KeyCode.UP:
            case KeyCode.WIN_KEY:
            case KeyCode.WIN_KEY_RIGHT:
                return false;
            default:
                return true;
        }
    };

    /*
      whether character is entered.
     */
    KeyCode.isCharacterKey = function (keyCode) {
        if (keyCode >= KeyCode.ZERO &&
            keyCode <= KeyCode.NINE) {
            return true;
        }

        if (keyCode >= KeyCode.NUM_ZERO &&
            keyCode <= KeyCode.NUM_MULTIPLY) {
            return true;
        }

        if (keyCode >= KeyCode.A &&
            keyCode <= KeyCode.Z) {
            return true;
        }

        // Safari sends zero key code for non-latin characters.
        if (UA.webkit && keyCode == 0) {
            return true;
        }

        switch (keyCode) {
            case KeyCode.SPACE:
            case KeyCode.QUESTION_MARK:
            case KeyCode.NUM_PLUS:
            case KeyCode.NUM_MINUS:
            case KeyCode.NUM_PERIOD:
            case KeyCode.NUM_DIVISION:
            case KeyCode.SEMICOLON:
            case KeyCode.DASH:
            case KeyCode.EQUALS:
            case KeyCode.COMMA:
            case KeyCode.PERIOD:
            case KeyCode.SLASH:
            case KeyCode.APOSTROPHE:
            case KeyCode.SINGLE_QUOTE:
            case KeyCode.OPEN_SQUARE_BRACKET:
            case KeyCode.BACKSLASH:
            case KeyCode.CLOSE_SQUARE_BRACKET:
                return true;
            default:
                return false;
        }
    };

    return KeyCode;
});
/**
 * @ignore
 * gesture normalization for pc and touch.
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/gesture', function () {

    /**
     * gesture for event
     * @enum {String} KISSY.Event.DomEvent.Gesture
     * @alias KISSY.Event.Gesture
     */
    return {
        /**
         * start gesture
         */
        start: 'mousedown',
        /**
         * move gesture
         */
        move: 'mousemove',
        /**
         * end gesture
         */
        end: 'mouseup',
        /**
         * tap gesture
         */
        tap: 'click',
        /**
         * singleTap gesture, it is  same with click on pc
         */
        singleTap: 'click',
        /**
         * doubleTap gesture, it is  same with dblclick on pc
         */
        doubleTap: 'dblclick'
    };

});
/**
 * @ignore
 * special house for special events
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/special-events', function (S, DomEvent,Special) {
    var undefined = undefined,
        UA = S.UA,
        MOUSE_WHEEL = UA.gecko ? 'DOMMouseScroll' : 'mousewheel';

    return S.mix(Special, {

        mousewheel: {
            typeFix: MOUSE_WHEEL
        },

        load: {
            // defaults to bubbles as custom event
            bubbles: false
        },
        click: {
            // use native click for correct check state order
            fire: function (onlyHandlers) {
                var target = this;
                if (!onlyHandlers && String(target.type) === "checkbox" &&
                    target.click && target.nodeName.toLowerCase() == 'input') {
                    target.click();
                    return false;
                }
                return undefined;
            }
        },
        focus: {
            bubbles: false,
            // guarantee fire focusin first
            preFire: function (event, onlyHandlers) {
                if (!onlyHandlers) {
                    return DomEvent.fire(this, 'focusin');
                }
            },
            // guarantee fire blur first
            fire: function (onlyHandlers) {
                var target = this;
                if (!onlyHandlers && target.ownerDocument) {
                    if (target !== target.ownerDocument.activeElement && target.focus) {
                        target.focus();
                        return false;
                    }
                }
                return undefined;
            }
        },
        blur: {
            bubbles: false,
            // guarantee fire focusout first
            preFire: function (event, onlyHandlers) {
                if (!onlyHandlers) {
                    return DomEvent.fire(this, 'focusout');
                }
            },
            // guarantee fire blur first
            fire: function (onlyHandlers) {
                var target = this;
                if (!onlyHandlers && target.ownerDocument) {
                    if (target === target.ownerDocument.activeElement && target.blur) {
                        target.blur();
                        return false;
                    }
                }
                return undefined;
            }
        }
    });
}, {
    requires: ['./dom-event','./special']
});
/**
 * @ignore
 * event-mouseenter
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/mouseenter', function (S, Dom, Special) {

    S.each([
        { name: 'mouseenter', fix: 'mouseover' },
        { name: 'mouseleave', fix: 'mouseout' }
    ], function (o) {
        Special[o.name] = {
            // fix #75
            typeFix: o.fix,
            handle: function (event, observer, ce) {
                var currentTarget = event.currentTarget,
                    relatedTarget = event.relatedTarget;
                // 在自身外边就触发
                // self === document,parent === null
                // relatedTarget 与 currentTarget 之间就是 mouseenter/leave
                if (!relatedTarget ||
                    (relatedTarget !== currentTarget &&
                        !Dom.contains(currentTarget, relatedTarget))) {
                    // http://msdn.microsoft.com/en-us/library/ms536945(v=vs.85).aspx
                    // does not bubble
                    // 2012-04-12 把 mouseover 阻止冒泡有问题！
                    // <div id='0'><div id='1'><div id='2'><div id='3'></div></div></div></div>
                    // 2 mouseover 停止冒泡
                    // 然后快速 2,1 飞过，可能 1 的 mouseover 是 2 冒泡过来的
                    // mouseover 采样时跳跃的，可能 2,1 的 mouseover 事件
                    // target 都是 3,而 relatedTarget 都是 0
                    // event.stopPropagation();
                    return [observer.simpleNotify(event, ce)];
                }
            }
        };
    });
}, {
    requires: [ 'dom', './special']
});

/*
 yiminghe@gmail.com:2011-12-15
 - 借鉴 jq 1.7 新的架构

 yiminghe@gmail.com：2011-06-07
 - 根据新结构，调整 mouseenter 兼容处理
 - fire('mouseenter') 可以的，直接执行 mouseenter 的 handlers 用户回调数组
 */
/**
 * @ignore
 * inspired by yui3
 * Synthetic event that fires when the <code>value</code> property of an input
 * field or textarea changes as a result of a keystroke, mouse operation, or
 * input method editor (IME) input event.
 *
 * Unlike the <code>onchange</code> event, this event fires when the value
 * actually changes and not when the element loses focus. This event also
 * reports IME and multi-stroke input more reliably than <code>oninput</code> or
 * the various key events across browsers.
 *
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base/valuechange', function (S, DomEvent, Dom, Special) {
    var VALUE_CHANGE = 'valuechange',
        getNodeName = Dom.nodeName,
        KEY = 'event/valuechange',
        HISTORY_KEY = KEY + '/history',
        POLL_KEY = KEY + '/poll',
        interval = 50;

    function clearPollTimer(target) {
        if (Dom.hasData(target, POLL_KEY)) {
            var poll = Dom.data(target, POLL_KEY);
            clearTimeout(poll);
            Dom.removeData(target, POLL_KEY);
        }
    }

    function stopPoll(target) {
        Dom.removeData(target, HISTORY_KEY);
        clearPollTimer(target);
    }

    function stopPollHandler(ev) {
        clearPollTimer(ev.target);
    }

    function checkChange(target) {
        var v = target.value,
            h = Dom.data(target, HISTORY_KEY);
        if (v !== h) {
            // allow delegate
            DomEvent.fireHandler(target, VALUE_CHANGE, {
                prevVal: h,
                newVal: v
            });
            Dom.data(target, HISTORY_KEY, v);
        }
    }

    function startPoll(target) {
        if (Dom.hasData(target, POLL_KEY)) {
            return;
        }
        Dom.data(target, POLL_KEY, setTimeout(function () {
            checkChange(target);
            Dom.data(target, POLL_KEY, setTimeout(arguments.callee, interval));
        }, interval));
    }

    function startPollHandler(ev) {
        var target = ev.target;
        // when focus ,record its current value immediately
        if (ev.type == 'focus') {
            Dom.data(target, HISTORY_KEY, target.value);
        }
        startPoll(target);
    }

    function webkitSpeechChangeHandler(e) {
        checkChange(e.target);
    }

    function monitor(target) {
        unmonitored(target);
        DomEvent.on(target, 'blur', stopPollHandler);
        // fix #94
        // see note 2012-02-08
        DomEvent.on(target, 'webkitspeechchange', webkitSpeechChangeHandler);
        DomEvent.on(target, 'mousedown keyup keydown focus', startPollHandler);
    }

    function unmonitored(target) {
        stopPoll(target);
        DomEvent.detach(target, 'blur', stopPollHandler);
        DomEvent.detach(target, 'webkitspeechchange', webkitSpeechChangeHandler);
        DomEvent.detach(target, 'mousedown keyup keydown focus', startPollHandler);
    }

    Special[VALUE_CHANGE] = {
        setup: function () {
            var target = this, nodeName = getNodeName(target);
            if (nodeName == 'input' || nodeName == 'textarea') {
                monitor(target);
            }
        },
        tearDown: function () {
            var target = this;
            unmonitored(target);
        }
    };
    return DomEvent;
}, {
    requires: ['./dom-event', 'dom', './special']
});

/*
 2012-02-08 yiminghe@gmail.com note about webkitspeechchange :
 当 input 没焦点立即点击语音
 -> mousedown -> blur -> focus -> blur -> webkitspeechchange -> focus
 第二次：
 -> mousedown -> blur -> webkitspeechchange -> focus
 */
/**
 * @ignore
 * dom event facade
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/base', function (S, DomEvent, DomEventObject, KeyCode, Gesture, Special) {
    return S.merge({
        add: DomEvent.on,
        remove: DomEvent.detach,
        KeyCode: KeyCode,
        Gesture: Gesture,
        Special: Special,
        Object: DomEventObject
    }, DomEvent);
}, {
    requires: [
        './base/dom-event',
        './base/object',
        './base/key-codes',
        './base/gesture',
        './base/special-events',
        './base/mouseenter',
        './base/valuechange']
});


