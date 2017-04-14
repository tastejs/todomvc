/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 19 23:58
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 event/dom/touch/handle-map
 event/dom/touch/single-touch
 event/dom/touch/tap
 event/dom/touch/swipe
 event/dom/touch/double-tap
 event/dom/touch/multi-touch
 event/dom/touch/pinch
 event/dom/touch/tap-hold
 event/dom/touch/rotate
 event/dom/touch/handle
 event/dom/touch
*/

/**
 * @ignore
 * handles for gesture events
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/handle-map', function () {
    return {};
});
/**
 * @ignore
 * touch count guard
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/single-touch', function (S) {
    function SingleTouch() {
    }

    SingleTouch.prototype = {
        constructor: SingleTouch,
        requiredTouchCount: 1,
        onTouchStart: function (e) {
            var self = this,
                touches;
            if (e.touches.length != self.requiredTouchCount) {
                return false;
            }
            touches = self.lastTouches = e.touches;
            // ios will share touches with touchmove...
            self.lastXY = {
                pageX: touches[0].pageX,
                pageY: touches[0].pageY
            };
            return undefined;
        },
        onTouchMove: S.noop,
        onTouchEnd: S.noop
    };

    return SingleTouch;
});
/**
 * @ignore
 * gesture tap
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/tap', function (S, eventHandleMap, DomEvent, SingleTouch) {
    function preventDefault(e) {
        e.preventDefault();
    }

    var sensitivity = 5;

    var event = 'tap';

    var DomEventObject = DomEvent.Object;

    function Tap() {
        Tap.superclass.constructor.apply(this, arguments);
    }

    S.extend(Tap, SingleTouch, {
        onTouchMove: function (e) {
            var firstTouchXY = this.lastXY;
            var currentTouch = e.changedTouches[0];
            // some sensitivity
            // android browser will trigger touchmove event finger is not moved ...
            // ie10 will has no touch when mouse
            if (!currentTouch ||
                Math.abs(currentTouch.pageX - firstTouchXY.pageX) > sensitivity ||
                Math.abs(currentTouch.pageY - firstTouchXY.pageY) > sensitivity) {
                return false;
            }
            return undefined;
        },

        onTouchEnd: function (e) {
            var touch = e.changedTouches[0];
            var target = e.target;
            var eventObject = new DomEventObject({
                type: event,
                target: target,
                currentTarget: target
            });
            S.mix(eventObject, {
                pageX: touch.pageX,
                pageY: touch.pageY,
                which: 1,
                touch: touch
            });
            DomEvent.fire(target, event, eventObject);
            if (eventObject.isDefaultPrevented()) {
                DomEvent.on(target, 'click', {
                    fn: preventDefault,
                    once: 1
                });
            }
        }
    });

    eventHandleMap[event] = {
        handle: new Tap()
    };

    return Tap;
}, {
    requires: ['./handle-map', 'event/dom/base', './single-touch']
});
/**
 * @ignore
 *
 * yiminghe@gmail.com 2012-10-31
 *
 * 页面改动必须先用桌面 chrome 刷新下，再用 ios 刷新，否则很可能不生效??
 *
 * why to implement tap:
 * 1.   click 造成 clickable element 有 -webkit-tap-highlight-color 其内不能选择文字
 * 2.   touchstart touchdown 时间间隔非常短不会触发 click (touchstart)
 * 3.   click 在touchmove 到其他地方后仍然会触发（如果没有组织touchmove默认行为导致的屏幕移动）
 *
 * tap:
 * 1.   长按可以选择文字，
 *      可以选择阻止 document 的 touchstart 来阻止整个程序的文字选择功能:
 *      同时阻止了touch 的 mouse/click 相关事件触发
 * 2.   反应更灵敏
 *
 * https://developers.google.com/mobile/articles/fast_buttons
 */
/**
 * @ignore
 * gesture swipe
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/swipe', function (S, eventHandleMap, DomEvent, SingleTouch) {
    var event = 'swipe',
        ingEvent = 'swiping',
        MAX_DURATION = 1000,
        MAX_OFFSET = 35,
        MIN_DISTANCE = 50;

    function fire(self, e, ing) {
        var touches = e.changedTouches,
            touch = touches[0],
            x = touch.pageX,
            y = touch.pageY,
            deltaX = x - self.startX,
            deltaY = y - self.startY,
            absDeltaX = Math.abs(deltaX),
            absDeltaY = Math.abs(deltaY),
            distance,
            direction;

        if (ing) {
            if (self.isVertical && self.isHorizontal) {
                // allow little deviation
                if (Math.max(absDeltaX, absDeltaY) < 5) {
                    return;
                }

                if (absDeltaY > absDeltaX) {
                    self.isHorizontal = 0;
                } else {
                    self.isVertical = 0;
                }
            }
        } else {
            if (self.isVertical && absDeltaY < MIN_DISTANCE) {
                self.isVertical = 0;
            }

            if (self.isHorizontal && absDeltaX < MIN_DISTANCE) {
                self.isHorizontal = 0;
            }
        }

        if (self.isHorizontal) {
            direction = deltaX < 0 ? 'left' : 'right';
            distance = absDeltaX;
        } else if (self.isVertical) {
            direction = deltaY < 0 ? 'up' : 'down';
            distance = absDeltaY;
        } else {
            return false;
        }

        DomEvent.fire(e.target, ing ? ingEvent : event, {
            originalEvent: e.originalEvent,
            pageX: touch.pageX,
            pageY: touch.pageY,
            which: 1,
            /**
             *
             * native touch property **only for touch event**.
             *
             * @property touch
             * @member KISSY.Event.DomEvent.Object
             */
            touch: touch,
            /**
             *
             * direction property **only for event swipe/singleTap/doubleTap**.
             *
             * can be one of 'up' 'down' 'left' 'right'
             * @property {String} direction
             * @member KISSY.Event.DomEvent.Object
             */
            direction: direction,
            /**
             *
             * distance property **only for event swipe**.
             *
             * the distance swipe gesture costs
             * @property {Number} distance
             * @member KISSY.Event.DomEvent.Object
             */
            distance: distance,
            /**
             *
             * duration property **only for touch event**.
             *
             * the duration swipe gesture costs
             * @property {Number} duration
             * @member KISSY.Event.DomEvent.Object
             */
            duration: (e.timeStamp - self.startTime) / 1000
        });

        return undefined;
    }

    function Swipe() {
    }

    S.extend(Swipe, SingleTouch, {

        onTouchStart: function (e) {
            var self = this;
            if (Swipe.superclass.onTouchStart.apply(self, arguments) === false) {
                return false;
            }
            var touch = e.touches[0];
            self.startTime = e.timeStamp;

            self.isHorizontal = 1;
            self.isVertical = 1;

            self.startX = touch.pageX;
            this.startY = touch.pageY;

            if (e.type.indexOf('mouse') != -1) {
                e.preventDefault();
            }
            return undefined;
        },

        onTouchMove: function (e) {
            var self = this,
                touch = e.changedTouches[0],
                x = touch.pageX,
                y = touch.pageY,
                deltaX = x - self.startX,
                deltaY = y - self.startY,
                absDeltaX = Math.abs(deltaX),
                absDeltaY = Math.abs(deltaY),
                time = e.timeStamp;

            if (time - self.startTime > MAX_DURATION) {
                return false;
            }

            if (self.isVertical && absDeltaX > MAX_OFFSET) {
                self.isVertical = 0;
            }

            if (self.isHorizontal && absDeltaY > MAX_OFFSET) {
                self.isHorizontal = 0;
            }

            return fire(self, e, 1);
        },

        onTouchEnd: function (e) {
            var self = this;
            if (self.onTouchMove(e) === false) {
                return false;
            }
            return fire(self, e, 0);
        }

    });

    eventHandleMap[event] = eventHandleMap[ingEvent] = {
        handle: new Swipe()
    };

    return Swipe;
}, {
    requires: ['./handle-map', 'event/dom/base', './single-touch']
});
/**
 * @ignore
 * gesture single tap double tap
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/double-tap', function (S, eventHandleMap, DomEvent, SingleTouch) {
    var SINGLE_TAP = 'singleTap',
        DOUBLE_TAP = 'doubleTap',
    // same with native click delay
        MAX_DURATION = 300;

    function DoubleTap() {
    }

    S.extend(DoubleTap, SingleTouch, {
        onTouchStart: function (e) {
            var self = this;
            if (DoubleTap.superclass.onTouchStart.apply(self, arguments) === false) {
                return false;
            }
            self.startTime = e.timeStamp;
            if (self.singleTapTimer) {
                clearTimeout(self.singleTapTimer);
                self.singleTapTimer = 0;
            }
        },

        onTouchMove: function () {
            return false;
        },

        onTouchEnd: function (e) {
            var self = this,
                lastEndTime = self.lastEndTime,
                time = e.timeStamp,
                target = e.target,
                touch = e.changedTouches[0],
                duration = time - self.startTime;
            self.lastEndTime = time;
            // second touch end
            if (lastEndTime) {
                // time between current up and last up
                duration = time - lastEndTime;
                // a double tap
                if (duration < MAX_DURATION) {
                    // a new double tap cycle
                    self.lastEndTime = 0;

                    DomEvent.fire(target, DOUBLE_TAP, {
                        touch: touch,
                        duration: duration / 1000
                    });
                    return;
                }
                // else treat as the first tap cycle
            }

            // time between down and up is long enough
            // then a singleTap
            duration = time - self.startTime;
            if (duration > MAX_DURATION) {
                DomEvent.fire(target, SINGLE_TAP, {
                    touch: touch,
                    pageX: touch.pageX,
                    which: 1,
                    pageY: touch.pageY,
                    duration: duration / 1000
                })
            } else {
                // buffer singleTap
                // wait for a second tap
                self.singleTapTimer = setTimeout(function () {
                    DomEvent.fire(target, SINGLE_TAP, {
                        touch: touch,
                        pageX: touch.pageX,
                        which: 1,
                        pageY: touch.pageY,
                        duration: duration / 1000
                    });
                }, MAX_DURATION);
            }
        }
    });

    eventHandleMap[SINGLE_TAP] = eventHandleMap[DOUBLE_TAP] = {
        handle: new DoubleTap()
    };

    return DoubleTap;
}, {
    requires: ['./handle-map', 'event/dom/base', './single-touch']
});
/**
 * @ignore
 * multi-touch base
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/multi-touch', function (S, Dom) {

    function MultiTouch() {}

    MultiTouch.prototype = {

        constructor: MultiTouch,

        requiredTouchCount: 2,

        onTouchStart: function (e) {
            var self = this,
                requiredTouchesCount = self.requiredTouchCount,
                touches = e.touches,
                touchesCount = touches.length;

            if (touchesCount === requiredTouchesCount) {
                self.start();
            }
            else if (touchesCount > requiredTouchesCount) {
                self.end(e);
            }
        },

        onTouchEnd: function (e) {
            this.end(e);
        },

        start: function () {
            var self = this;
            if (!self.isTracking) {
                self.isTracking = true;
                self.isStarted = false;
            }
        },

        fireEnd: S.noop,

        getCommonTarget: function (e) {
            var touches = e.touches,
                t1 = touches[0].target,
                t2 = touches[1].target;
            if (t1 == t2) {
                return t1;
            }
            if (Dom.contains(t1, t2)) {
                return t1;
            }

            while (1) {
                if (Dom.contains(t2, t1)) {
                    return t2;
                }
                t2 = t2.parentNode;
            }
            S.error('getCommonTarget error!');
            return undefined;
        },

        end: function (e) {
            var self = this;
            // finger1 down, finger2 down -> start multi touch
            // move finger1 or finger2 -> multi-touch move
            // finger2 up -> end multi touch
            // finger1 move -> ignore
            if (self.isTracking) {
                self.isTracking = false;

                if (self.isStarted) {
                    self.isStarted = false;
                    self.fireEnd(e);
                }
            }
        }
    };

    return MultiTouch;

}, {
    requires: ['dom']
});
/**
 * @ignore
 * gesture pinch
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/pinch', function (S, eventHandleMap, DomEvent, MultiTouch) {

    var PINCH = 'pinch',
        PINCH_START = 'pinchStart',
        PINCH_END = 'pinchEnd';

    function getDistance(p1, p2) {
        var deltaX = p1.pageX - p2.pageX,
            deltaY = p1.pageY - p2.pageY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    function Pinch() {
    }

    S.extend(Pinch, MultiTouch, {

        onTouchMove: function (e) {
            var self = this;

            if (!self.isTracking) {
                return;
            }

            var touches = e.touches;
            var distance = getDistance(touches[0], touches[1]);

            self.lastTouches = touches;

            if (!self.isStarted) {
                self.isStarted = true;
                self.startDistance = distance;
                var target = self.target = self.getCommonTarget(e);
                DomEvent.fire(target,
                    PINCH_START, S.mix(e, {
                        distance: distance,
                        scale: 1
                    }));
            } else {
                DomEvent.fire(self.target,
                    PINCH, S.mix(e, {
                        distance: distance,
                        scale: distance / self.startDistance
                    }));
            }
        },

        fireEnd: function (e) {
            var self = this;
            DomEvent.fire(self.target, PINCH_END, S.mix(e, {
                touches: self.lastTouches
            }));
        }

    });

    var p = new Pinch();

    eventHandleMap[PINCH_START] =
        eventHandleMap[PINCH_END] = {
            handle: p
        };

    function prevent(e) {
        if (e.touches.length == 2) {
            e.preventDefault();
        }
    }

    eventHandleMap[PINCH] = {
        handle: p,
        add: function () {
            // need on this
            // if on document, will affect other elements!
            DomEvent.on(this, 'touchmove', prevent);
        },
        remove: function () {
            DomEvent.detach(this, 'touchmove', prevent);
        }
    };

    return Pinch;

}, {
    requires: ['./handle-map', 'event/dom/base', './multi-touch']
});
/**
 * @ignore
 * fired when tap and hold for more than 1s
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/tap-hold', function (S, eventHandleMap, SingleTouch, DomEvent) {
    var event = 'tapHold';

    var duration = 1000;

    function TapHold() {
    }

    S.extend(TapHold, SingleTouch, {
        onTouchStart: function (e) {
            var self = this;
            if (TapHold.superclass.onTouchStart.call(self, e) === false) {
                return false;
            }
            self.timer = setTimeout(function () {
                var touch = e.touches[0];
                DomEvent.fire(e.target, event, {
                    touch: touch,
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    which: 1,
                    duration: (S.now() - e.timeStamp) / 1000
                });
            }, duration);
        },

        onTouchMove: function () {
            clearTimeout(this.timer);
            return false;
        },

        onTouchEnd: function () {
            clearTimeout(this.timer);
        }
    });

    eventHandleMap[event] = {
        handle: new TapHold()
    };

    return TapHold;

}, {
    requires: ['./handle-map', './single-touch', 'event/dom/base']
});
/**
 * @ignore
 * fired when rotate using two fingers
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/rotate', function (S, eventHandleMap, MultiTouch, DomEvent, undefined) {
    var ROTATE_START = 'rotateStart',
        ROTATE = 'rotate',
        RAD_2_DEG = 180 / Math.PI,
        ROTATE_END = 'rotateEnd';

    function Rotate() {
    }

    S.extend(Rotate, MultiTouch, {

        onTouchMove: function (e) {
            var self = this;

            if (!self.isTracking) {
                return;
            }

            var touches = e.touches,
                one = touches[0],
                two = touches[1],
                lastAngle = self.lastAngle,
                angle = Math.atan2(two.pageY - one.pageY,
                    two.pageX - one.pageX) * RAD_2_DEG;

            if (lastAngle !== undefined) {
                // more smooth
                // 5 4 3 2 1 -1 -2 -3 -4
                // 170 180 190 200
                var diff = Math.abs(angle - lastAngle);
                var positiveAngle = (angle + 360) % 360;
                var negativeAngle = (angle - 360) % 360;

                // process '>' scenario: top -> bottom
                if (Math.abs(positiveAngle - lastAngle) < diff) {
                    angle = positiveAngle;
                }
                // process '>' scenario: bottom -> top
                else if (Math.abs(negativeAngle - lastAngle) < diff) {
                    angle = negativeAngle;
                }
            }

            self.lastTouches = touches;
            self.lastAngle = angle;

            if (!self.isStarted) {
                self.isStarted = true;

                self.startAngle = angle;

                self.target = self.getCommonTarget(e);

                DomEvent.fire(self.target, ROTATE_START, S.mix(e, {
                    angle: angle,
                    rotation: 0
                }));

            } else {
                DomEvent.fire(self.target, ROTATE, S.mix(e, {
                    angle: angle,
                    rotation: angle - self.startAngle
                }));
            }
        },

        end: function () {
            var self = this;
            self.lastAngle = undefined;
            Rotate.superclass.end.apply(self, arguments);
        },

        fireEnd: function (e) {
            var self = this;
            DomEvent.fire(self.target, ROTATE_END, S.mix(e, {
                touches: self.lastTouches
            }));
        }
    });

    function prevent(e) {
        // android can not throttle
        // need preventDefault always
        if (e.touches.length == 2) {
            e.preventDefault();
        }
    }

    var r = new Rotate();

    eventHandleMap[ROTATE_END] =
        eventHandleMap[ROTATE_START] = {
            handle: r
        };

    eventHandleMap[ROTATE] = {
        handle: r,
        add: function () {
            DomEvent.on(this, 'touchmove', prevent);
        },
        remove: function () {
            DomEvent.detach(this, 'touchmove', prevent);
        }
    };

    return Rotate;

}, {
    requires: ['./handle-map', './multi-touch', 'event/dom/base']
});
/**
 * @ignore
 * base handle for touch gesture, mouse and touch normalization
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/handle', function (S, Dom, eventHandleMap, DomEvent) {
    var key = S.guid('touch-handle'),
        Features = S.Features,
        gestureStartEvent,
        gestureMoveEvent,
        gestureEndEvent;

    function isTouchEvent(type) {
        return S.startsWith(type, 'touch');
    }

    function isMouseEvent(type) {
        return S.startsWith(type, 'mouse');
    }

    function isMSPointerEvent(type) {
        return S.startsWith(type, 'MSPointer');
    }

    // This should be long enough to ignore compatible mouse events made by touch
    var DUP_TIMEOUT = 2500;
    // radius around touchend that swallows mouse events
    var DUP_DIST = 25;

    if (Features.isTouchEventSupported()) {
        if (S.UA.ios) {
            // ios mousedown is buggy
            gestureEndEvent = 'touchend touchcancel';
            gestureStartEvent = 'touchstart';
            gestureMoveEvent = 'touchmove';
        } else {
            gestureEndEvent = 'touchend touchcancel mouseup';
            // allow touch and mouse both!
            gestureStartEvent = 'touchstart mousedown';
            gestureMoveEvent = 'touchmove mousemove';
        }
    } else if (Features.isMsPointerSupported()) {
        gestureStartEvent = 'MSPointerDown';
        gestureMoveEvent = 'MSPointerMove';
        gestureEndEvent = 'MSPointerUp MSPointerCancel';
    } else {
        gestureStartEvent = 'mousedown';
        gestureMoveEvent = 'mousemove';
        gestureEndEvent = 'mouseup';
    }

    function DocumentHandler(doc) {
        var self = this;
        self.doc = doc;
        self.eventHandle = {};
        self.init();
        // normalize pointer event to touch event
        self.touches = [];
        // touches length of touch event
        self.inTouch = 0;
    }

    DocumentHandler.prototype = {
        constructor: DocumentHandler,

        lastTouches: [],

        firstTouch: null,

        init: function () {
            var self = this,
                doc = self.doc;
            DomEvent.on(doc, gestureStartEvent, self.onTouchStart, self);
            if (!isMSPointerEvent(gestureMoveEvent)) {
                DomEvent.on(doc, gestureMoveEvent, self.onTouchMove, self);
            }
            DomEvent.on(doc, gestureEndEvent, self.onTouchEnd, self);
        },

        addTouch: function (originalEvent) {
            originalEvent.identifier = originalEvent['pointerId'];
            this.touches.push(originalEvent);
        },

        removeTouch: function (originalEvent) {
            var i = 0,
                touch,
                pointerId = originalEvent['pointerId'],
                touches = this.touches,
                l = touches.length;
            for (; i < l; i++) {
                touch = touches[i];
                if (touch['pointerId'] === pointerId) {
                    touches.splice(i, 1);
                    break;
                }
            }
        },

        updateTouch: function (originalEvent) {
            var i = 0,
                touch,
                pointerId = originalEvent['pointerId'],
                touches = this.touches,
                l = touches.length;
            for (; i < l; i++) {
                touch = touches[i];
                if (touch['pointerId'] === pointerId) {
                    touches[i] = originalEvent;
                }
            }
        },

        isPrimaryTouch: function (inTouch) {
            return this.firstTouch === inTouch.identifier;
        },

        setPrimaryTouch: function (inTouch) {
            if (this.firstTouch === null) {
                this.firstTouch = inTouch.identifier;
            }
        },

        removePrimaryTouch: function (inTouch) {
            if (this.isPrimaryTouch(inTouch)) {
                this.firstTouch = null;
            }
        },

        // prevent mouse events from creating pointer events
        dupMouse: function (inEvent) {
            var lts = this.lastTouches;
            var t = inEvent.changedTouches[0];
            // only the primary finger will dup mouse events
            if (this.isPrimaryTouch(t)) {
                // remember x/y of last touch
                var lt = {x: t.clientX, y: t.clientY};
                lts.push(lt);
                setTimeout(function () {
                    var i = lts.indexOf(lt);
                    if (i > -1) {
                        lts.splice(i, 1);
                    }
                }, DUP_TIMEOUT);
            }
        },

        // collide with the touch event
        isEventSimulatedFromTouch: function (inEvent) {
            var lts = this.lastTouches;
            var x = inEvent.clientX,
                y = inEvent.clientY;
            for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
                // simulated mouse events will be swallowed near a primary touchend
                var dx = Math.abs(x - t.x),
                    dy = Math.abs(y - t.y);
                if (dx <= DUP_DIST && dy <= DUP_DIST) {
                    return true;
                }
            }
            return 0;
        },

        normalize: function (e) {
            var type = e.type,
                notUp,
                touchList;
            if (isTouchEvent(type)) {
                touchList = (type == 'touchend' || type == 'touchcancel') ?
                    e.changedTouches :
                    e.touches;
                if (touchList.length == 1) {
                    e.which = 1;
                    e.pageX = touchList[0].pageX;
                    e.pageY = touchList[0].pageY;
                }
                return e;
            } else {
                touchList = this.touches;
            }
            notUp = !type.match(/(up|cancel)$/i);
            e.touches = notUp ? touchList : [];
            e.targetTouches = notUp ? touchList : [];
            e.changedTouches = touchList;
            return e;
        },

        onTouchStart: function (event) {
            var e, h,
                self = this,
                type = event.type,
                eventHandle = self.eventHandle;
            if (isTouchEvent(type)) {
                self.setPrimaryTouch(event.changedTouches[0]);
                self.dupMouse(event);
            } else if (isMouseEvent(type)) {
                if (self.isEventSimulatedFromTouch(event)) {
                    return;
                }
                self.touches = [event.originalEvent];
            } else if (isMSPointerEvent(type)) {
                self.addTouch(event.originalEvent);
                if (self.touches.length == 1) {
                    DomEvent.on(self.doc, gestureMoveEvent, self.onTouchMove, self);
                }
            } else {
                throw new Error('unrecognized touch event: ' + event.type);
            }

            for (e in eventHandle) {
                h = eventHandle[e].handle;
                h.isActive = 1;
            }
            // if preventDefault, will not trigger click event
            self.callEventHandle('onTouchStart', event);
        },

        onTouchMove: function (event) {
            var self = this,
                type = event.type;
            if (isTouchEvent(type)) {
            } else if (isMouseEvent(type)) {
                if (self.isEventSimulatedFromTouch(type)) {
                    return;
                }
                self.touches = [event.originalEvent];
            } else if (isMSPointerEvent(type)) {
                self.updateTouch(event.originalEvent);
            } else {
                throw new Error('unrecognized touch event: ' + event.type);
            }
            // no throttle! to allow preventDefault
            self.callEventHandle('onTouchMove', event);
        },

        onTouchEnd: function (event) {
            var self = this,
                type = event.type;
            if (isMouseEvent(type)) {
                if (self.isEventSimulatedFromTouch(event)) {
                    return;
                }
            }

            self.callEventHandle('onTouchEnd', event);
            if (isTouchEvent(type)) {
                self.dupMouse(event);
                S.makeArray(event.changedTouches).forEach(function (touch) {
                    self.removePrimaryTouch(touch);
                });
            } else if (isMouseEvent(type)) {
                self.touches = [];
            } else if (isMSPointerEvent(type)) {
                self.removeTouch(event.originalEvent);
                if (!self.touches.length) {
                    DomEvent.detach(self.doc, gestureMoveEvent, self.onTouchMove, self);
                }
            }
        },

        callEventHandle: function (method, event) {
            var self = this,
                eventHandle = self.eventHandle,
                e,
                h;
            event = self.normalize(event);
            for (e in eventHandle) {
                // event processor shared by multiple events
                h = eventHandle[e].handle;
                if (h.processed) {
                    continue;
                }
                h.processed = 1;
                //type=event.type;
                if (h.isActive && h[method] && h[method](event) === false) {
                    h.isActive = 0;
                }
                //event.type=type;
            }
            for (e in eventHandle) {
                h = eventHandle[e].handle;
                h.processed = 0;
            }
        },

        addEventHandle: function (event) {
            var self = this,
                eventHandle = self.eventHandle,
                handle = eventHandleMap[event].handle;
            if (eventHandle[event]) {
                eventHandle[event].count++;
            } else {
                eventHandle[event] = {
                    count: 1,
                    handle: handle
                };
            }
        },

        'removeEventHandle': function (event) {
            var eventHandle = this.eventHandle;
            if (eventHandle[event]) {
                eventHandle[event].count--;
                if (!eventHandle[event].count) {
                    delete eventHandle[event];
                }
            }
        },

        destroy: function () {
            var self = this,
                doc = self.doc;
            DomEvent.detach(doc, gestureStartEvent, self.onTouchStart, self);
            DomEvent.detach(doc, gestureMoveEvent, self.onTouchMove, self);
            DomEvent.detach(doc, gestureEndEvent, self.onTouchEnd, self);
        }
    };

    return {
        addDocumentHandle: function (el, event) {
            var doc = Dom.getDocument(el),
                handle = Dom.data(doc, key);
            if (!handle) {
                Dom.data(doc, key, handle = new DocumentHandler(doc));
            }
            if (event) {
                handle.addEventHandle(event);
            }
        },

        removeDocumentHandle: function (el, event) {
            var doc = Dom.getDocument(el),
                handle = Dom.data(doc, key);
            if (handle) {
                if (event) {
                    handle.removeEventHandle(event);
                }
                if (S.isEmptyObject(handle.eventHandle)) {
                    handle.destroy();
                    Dom.removeData(doc, key);
                }
            }
        }
    };
}, {
    requires: [
        'dom',
        './handle-map',
        'event/dom/base',
        './tap',
        './swipe',
        './double-tap',
        './pinch',
        './tap-hold',
        './rotate'
    ]
});
/*
 2013-08-29 yiminghe@gmail.com
 - ios bug
 create new element on touchend handler
 then a mousedown event will be fired on the new element
 - refer: https://github.com/Polymer/PointerEvents/

 2013-08-28 yiminghe@gmail.com
 - chrome android bug: first series touchstart is not fired!
 - chrome android bug when bind mousedown and touch together to ordinary div
 chrome pc ：
 touchstart mousedown touchend
 chrome android ：
 touchstart touchend mousedown
 safari no mousedown
 - https://code.google.com/p/chromium/issues/detail?id=280516
 - https://code.google.com/p/chromium/issues/detail?id=280507

 2013-07-23 yiminghe@gmail.com
 - bind both mouse and touch for start
 - but bind mousemove or touchmove for move

 2012 yiminghe@gmail.com
 in order to make tap/doubleTap bubbling same with native event.
 register event on document and then bubble
 */
/**
 * @ignore
 * touch event logic module
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch', function (S, DomEvent, eventHandleMap, eventHandle) {
    var Gesture = DomEvent.Gesture;
    var startEvent = Gesture.start = 'KSPointerDown';
    var moveEvent = Gesture.move = 'KSPointerMove';
    var endEvent = Gesture.end = 'KSPointerUp';
    Gesture.tap = 'tap';
    Gesture.doubleTap = 'doubleTap';

    eventHandleMap[startEvent] = {
        handle: {
            // always fire
            isActive: 1,
            onTouchStart: function (e) {
                DomEvent.fire(e.target, startEvent, e);
            }
        }
    };

    eventHandleMap[moveEvent] = {
        setup: function () {
            var doc = this.ownerDocument || this;
            doc.__ks__pointer_events_count = doc.__ks__pointer_events_count || 0;
            doc.__ks__pointer_events_count++;
        },
        tearDown: function () {
            var doc = this.ownerDocument || this;
            if (doc.__ks__pointer_events_count) {
                doc.__ks__pointer_events_count--;
            }
        },
        handle: {
            // always fire
            isActive: 1,
            onTouchMove: function (e) {
                // if no register then do not fire
                var t = e.target,
                    doc = t.ownerDocument || t;
                if (doc.__ks__pointer_events_count) {
                    DomEvent.fire(t, moveEvent, e);
                }
            }
        }
    };

    eventHandleMap[endEvent] = {
        handle: {
            // always fire
            isActive: 1,
            onTouchEnd: function (e) {
                DomEvent.fire(e.target, endEvent, e);
            }
        }
    };

    function setupExtra(event) {
        setup.call(this, event);
        eventHandleMap[event].setup.apply(this, arguments);
    }

    function tearDownExtra(event) {
        tearDown.call(this, event);
        eventHandleMap[event].tearDown.apply(this, arguments);
    }

    function setup(event) {
        eventHandle.addDocumentHandle(this, event);
    }

    function tearDown(event) {
        eventHandle.removeDocumentHandle(this, event);
    }

    var Special = DomEvent.Special,
        specialEvent, e, eventHandleValue;

    for (e in eventHandleMap) {
        specialEvent = {};
        eventHandleValue = eventHandleMap[e];
        if (eventHandleValue.setup) {
            specialEvent.setup = setupExtra;
        } else {
            specialEvent.setup = setup;
        }
        if (eventHandleValue.tearDown) {
            specialEvent.tearDown = tearDownExtra;
        } else {
            specialEvent.tearDown = tearDown;
        }
        if (eventHandleValue.add) {
            specialEvent.add = eventHandleValue.add;
        }
        if (eventHandleValue.remove) {
            specialEvent.remove = eventHandleValue.remove;
        }
        Special[e] = specialEvent;
    }
}, {
    requires: ['event/dom/base', './touch/handle-map', './touch/handle']
});

