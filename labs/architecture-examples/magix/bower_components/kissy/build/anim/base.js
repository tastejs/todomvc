/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 6 11:53
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 anim/base/queue
 anim/base/utils
 anim/base
*/

/**
 * @ignore queue data structure
 * @author yiminghe@gmail.com
 */
KISSY.add('anim/base/queue', function (S, Dom) {

    var // 队列集合容器
        queueCollectionKey = S.guid('ks-queue-' + S.now() + '-'),
    // 默认队列
        queueKey = S.guid('ks-queue-' + S.now() + '-'),
        Q;

    function getQueue(node, name, readOnly) {
        name = name || queueKey;

        var qu,
            quCollection = Dom.data(node, queueCollectionKey);

        if (!quCollection && !readOnly) {
            Dom.data(node, queueCollectionKey, quCollection = {});
        }

        if (quCollection) {
            qu = quCollection[name];
            if (!qu && !readOnly) {
                qu = quCollection[name] = [];
            }
        }

        return qu;
    }

    return Q = {

        queueCollectionKey: queueCollectionKey,

        queue: function (node, queue, item) {
            var qu = getQueue(node, queue);
            qu.push(item);
            return qu;
        },

        remove: function (node, queue, item) {
            var qu = getQueue(node, queue, 1),
                index;
            if (qu) {
                index = S.indexOf(item, qu);
                if (index > -1) {
                    qu.splice(index, 1);
                }
            }
            if (qu && !qu.length) {
                // remove queue data
                Q.clearQueue(node, queue);
            }
            return qu;
        },

        'clearQueues': function (node) {
            Dom.removeData(node, queueCollectionKey);
        },

        clearQueue: function clearQueue(node, queue) {
            queue = queue || queueKey;
            var quCollection = Dom.data(node, queueCollectionKey);
            if (quCollection) {
                delete quCollection[queue];
            }
            if (S.isEmptyObject(quCollection)) {
                Dom.removeData(node, queueCollectionKey);
            }
        },

        dequeue: function (node, queue) {
            var qu = getQueue(node, queue, 1);
            if (qu) {
                qu.shift();
                if (!qu.length) {
                    // remove queue data
                    Q.clearQueue(node, queue);
                }
            }
            return qu;
        }

    };
}, {
    requires: ['dom']
});
/**
 * utils for anim
 * @author yiminghe@gmail.com
 * @ignore
 */
KISSY.add('anim/base/utils', function (S, Dom, Q,undefined) {

    var runningKey = S.guid('ks-anim-unqueued-' + S.now() + '-');

    function saveRunningAnim(anim) {
        var node = anim.node,
            allRunning = Dom.data(node, runningKey);
        if (!allRunning) {
            Dom.data(node, runningKey, allRunning = {});
        }
        allRunning[S.stamp(anim)] = anim;
    }

    function removeRunningAnim(anim) {
        var node = anim.node,
            allRunning = Dom.data(node, runningKey);
        if (allRunning) {
            delete allRunning[S.stamp(anim)];
            if (S.isEmptyObject(allRunning)) {
                Dom.removeData(node, runningKey);
            }
        }
    }

    function isAnimRunning(anim) {
        var node = anim.node,
            allRunning = Dom.data(node, runningKey);
        if (allRunning) {
            return !!allRunning[S.stamp(anim)];
        }
        return 0;
    }

    var pausedKey = S.guid('ks-anim-paused-' + S.now() + '-');

    function savePausedAnim(anim) {
        var node = anim.node,
            paused = Dom.data(node, pausedKey);
        if (!paused) {
            Dom.data(node, pausedKey, paused = {});
        }
        paused[S.stamp(anim)] = anim;
    }

    function removePausedAnim(anim) {
        var node = anim.node,
            paused = Dom.data(node, pausedKey);
        if (paused) {
            delete paused[S.stamp(anim)];
            if (S.isEmptyObject(paused)) {
                Dom.removeData(node, pausedKey);
            }
        }
    }

    function isAnimPaused(anim) {
        var node = anim.node,
            paused = Dom.data(node, pausedKey);
        if (paused) {
            return !!paused[S.stamp(anim)];
        }
        return 0;
    }

    function pauseOrResumeQueue(node, queue, action) {
        var allAnims = Dom.data(node, action == 'resume' ? pausedKey : runningKey),
        // can not stop in for/in , stop will modified allRunning too
            anims = S.merge(allAnims);

        S.each(anims, function (anim) {
            if (queue === undefined ||
                anim.config.queue == queue) {
                anim[action]();
            }
        });
    }

    return {
        saveRunningAnim: saveRunningAnim,
        removeRunningAnim: removeRunningAnim,
        isAnimPaused: isAnimPaused,
        removePausedAnim: removePausedAnim,
        savePausedAnim: savePausedAnim,
        isAnimRunning: isAnimRunning,
        // whether node has paused anim
        'isElPaused': function (node) {
            var paused = Dom.data(node, pausedKey);
            return paused && !S.isEmptyObject(paused);
        },
        // whether node is running anim
        'isElRunning': function (node) {
            var allRunning = Dom.data(node, runningKey);
            return allRunning && !S.isEmptyObject(allRunning);
        },
        pauseOrResumeQueue: pauseOrResumeQueue,
        stopEl: function (node, end, clearQueue, queue) {
            if (clearQueue) {
                if (queue === undefined) {
                    Q.clearQueues(node);
                } else if (queue !== false) {
                    Q.clearQueue(node, queue);
                }
            }
            var allRunning = Dom.data(node, runningKey),
            // can not stop in for/in , stop will modified allRunning too
                anims = S.merge(allRunning);
            S.each(anims, function (anim) {
                if (queue === undefined || anim.config.queue == queue) {
                    anim.stop(end);
                }
            });
        }
    }
}, {
    requires: ['dom', './queue']
});
/**
 * base class for transition anim and timer anim
 * @author yiminghe@gmail.com
 * @ignore
 */
KISSY.add('anim/base', function (S, Dom, Utils, Promise, Q) {
    var NodeType = Dom.NodeType,
        noop = S.noop,
        logger = S.getLogger('s/anim'),
        specialVals = {
            toggle: 1,
            hide: 1,
            show: 1
        };

    /**
     * superclass for transition anim and js anim
     * @class KISSY.Anim.Base
     * @extend KISSY.Promise
     * @private
     */
    function AnimBase(config) {
        var self = this;
        AnimBase.superclass.constructor.call(self);
        Promise.Defer(self);
        /**
         * config object of current anim instance
         * @type {Object}
         */
        self.config = config;
        var node = config.node;
        if (!S.isPlainObject(node)) {
            node = Dom.get(config.node);
        }
        self.node = self.el = node;
        self._backupProps = {};
        self._propsData = {};
    }

    // stop(true) will run complete function synchronously
    function syncComplete(self) {
        var _backupProps, complete;
        // only recover after complete anim
        if (!S.isEmptyObject(_backupProps = self._backupProps)) {
            Dom.css(self.node, _backupProps);
        }
        if (complete = self.config.complete) {
            complete.call(self);
        }
    }

    S.extend(AnimBase, Promise, {
        /**
         * please use promise api instead
         * @deprecated
         */
        on: function (name, fn) {
            var self = this;
            logger.warn('please use promise api of anim instead');
            if (name == 'complete') {
                self.then(fn);
            } else if (name == 'end') {
                self.fin(fn);
            } else if (name == 'step') {
                self.progress(fn);
            } else {
                logger.error('not supported event for anim: ' + name);
            }
            return self;
        },

        /**
         * prepare fx hook
         * @protected
         * @method
         */
        prepareFx: noop,

        runInternal: function () {
            var self = this,
                config = self.config,
                node = self.node,
                val,
                _backupProps = self._backupProps,
                _propsData = self._propsData,
                to = config.to,
                defaultDelay = (config.delay || 0),
                defaultDuration = config.duration;

            // 进入该函数即代表执行（q[0] 已经是 ...）
            Utils.saveRunningAnim(self);

            // 分离 easing
            S.each(to, function (val, prop) {
                if (!S.isPlainObject(val)) {
                    val = {
                        value: val
                    };
                }
                _propsData[prop] = S.mix({
                    // simulate css3
                    delay: defaultDelay,
                    //// timing-function
                    easing: config.easing,
                    frame: config.frame,
                    duration: defaultDuration
                }, val);
            });

            if (node.nodeType == NodeType.ELEMENT_NODE) {
                // 放在前面，设置 overflow hidden，否则后面 ie6  取 width/height 初值导致错误
                // <div style='width:0'><div style='width:100px'></div></div>
                if (to.width || to.height) {
                    // Make sure that nothing sneaks out
                    // Record all 3 overflow attributes because IE does not
                    // change the overflow attribute when overflowX and
                    // overflowY are set to the same value
                    var elStyle = node.style;
                    S.mix(_backupProps, {
                        overflow: elStyle.overflow,
                        'overflow-x': elStyle.overflowX,
                        'overflow-y': elStyle.overflowY
                    });
                    elStyle.overflow = 'hidden';
                    // inline element should has layout/inline-block
                    if (Dom.css(node, 'display') === 'inline' &&
                        Dom.css(node, 'float') === 'none') {
                        if (S.UA['ie']) {
                            elStyle.zoom = 1;
                        } else {
                            elStyle.display = 'inline-block';
                        }
                    }
                }

                var exit, hidden;
                hidden = (Dom.css(node, 'display') === 'none');
                S.each(_propsData, function (_propData, prop) {
                    val = _propData.value;
                    // 直接结束
                    if (specialVals[val]) {
                        if (val == 'hide' && hidden || val == 'show' && !hidden) {
                            // need to invoke complete
                            self.stop(true);
                            return exit = false;
                        }
                        // backup original inline css value
                        _backupProps[prop] = Dom.style(node, prop);
                        if (val == 'toggle') {
                            val = hidden ? 'show' : 'hide';
                        }
                        else if (val == 'hide') {
                            _propData.value = 0;
                            // 执行完后隐藏
                            _backupProps.display = 'none';
                        } else {
                            _propData.value = Dom.css(node, prop);
                            // prevent flash of content
                            Dom.css(node, prop, 0);
                            Dom.show(node);
                        }
                    }
                    return undefined;
                });

                if (exit === false) {
                    return;
                }
            }

            self.startTime = S.now();
            if (S.isEmptyObject(_propsData)) {
                self.__totalTime = defaultDuration * 1000;
                self.__waitTimeout = setTimeout(function () {
                    self.stop(true);
                }, self.__totalTime);
            } else {
                self.prepareFx();
                self.doStart();
            }
        },

        /**
         * whether this animation is running
         * @return {Boolean}
         */
        isRunning: function () {
            return Utils.isAnimRunning(this);
        },

        /**
         * whether this animation is paused
         * @return {Boolean}
         */
        isPaused: function () {
            return Utils.isAnimPaused(this);
        },


        /**
         * pause current anim
         * @chainable
         */
        pause: function () {
            var self = this;
            if (self.isRunning()) {
                // already run time
                self._runTime = S.now() - self.startTime;
                self.__totalTime -= self._runTime;
                Utils.removeRunningAnim(self);
                Utils.savePausedAnim(self);
                if (self.__waitTimeout) {
                    clearTimeout(self.__waitTimeout);
                } else {
                    self.doStop();
                }
            }
            return self;
        },

        /**
         * stop by dom operation
         * @protected
         * @method
         */
        doStop: noop,

        /**
         * start by dom operation
         * @protected
         * @method
         */
        doStart: noop,

        /**
         * resume current anim
         * @chainable
         */
        resume: function () {
            var self = this;
            if (self.isPaused()) {
                // adjust time by run time caused by pause
                self.startTime = S.now() - self._runTime;
                Utils.removePausedAnim(self);
                Utils.saveRunningAnim(self);
                if (self.__waitTimeout) {
                    self.__waitTimeout = setTimeout(function () {
                        self.stop(true);
                    }, self.__totalTime);
                } else {
                    self['beforeResume']();
                    self.doStart();
                }
            }
            return self;
        },

        /**
         * before resume hook
         * @protected
         * @method
         */
        'beforeResume': noop,

        /**
         * start this animation
         * @chainable
         */
        run: function () {
            var self = this,
                q,
                queue = self.config.queue;

            if (queue === false) {
                self.runInternal();
            } else {
                // 当前动画对象加入队列
                q = Q.queue(self.node, queue, self);
                if (q.length == 1) {
                    self.runInternal();
                }
            }

            return self;
        },

        /**
         * stop this animation
         * @param {Boolean} [finish] whether jump to the last position of this animation
         * @chainable
         */
        stop: function (finish) {
            var self = this,
                node = self.node,
                q,
                queue = self.config.queue;

            if (self.isResolved() || self.isRejected()) {
                return self;
            }

            if (self.__waitTimeout) {
                clearTimeout(self.__waitTimeout);
                self.__waitTimeout = 0;
            }

            if (!self.isRunning() && !self.isPaused()) {
                if (queue !== false) {
                    // queued but not start to run
                    Q.remove(node, queue, self);
                }
                return self;
            }

            self.doStop(finish);
            Utils.removeRunningAnim(self);
            Utils.removePausedAnim(self);

            var defer = self.defer;
            if (finish) {
                syncComplete(self);
                defer.resolve([self]);
            } else {
                defer.reject([self]);
            }

            if (queue !== false) {
                // notify next anim to run in the same queue
                q = Q.dequeue(node, queue);
                if (q && q[0]) {
                    q[0].runInternal();
                }
            }
            return self;
        }
    });

    AnimBase.Utils = Utils;
    AnimBase.Q = Q;

    return AnimBase;
}, {
    requires: ['dom', './base/utils', 'promise', './base/queue']
});

