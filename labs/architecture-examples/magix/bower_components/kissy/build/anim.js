/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Oct 22 17:03
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 anim
*/

/**
 * anim facade between native and timer
 * @author yiminghe@gmail.com
 * @ignore
 */
KISSY.add('anim', function (S, Dom, AnimBase, TimerAnim, TransitionAnim) {
    var Utils = AnimBase.Utils,
        logger= S.getLogger('s/anim'),
        defaultConfig = {
            duration: 1,
            easing: 'linear'
        };

    /**
     * @class KISSY.Anim
     * A class for constructing animation instances.
     * @extend KISSY.Event.CustomEvent.Target
     * @cfg {HTMLElement|Window} node html dom node or window
     * (window can only animate scrollTop/scrollLeft)
     * @cfg {Object} props end css style value.
     * @cfg {Number} [duration=1] duration(second) or anim config
     * @cfg {String|Function} [easing='easeNone'] easing fn or string
     * @cfg {Function} [complete] callback function when this animation is complete
     * @cfg {String|Boolean} [queue] current animation's queue, if false then no queue
     */
    function Anim(node, to, duration, easing, complete) {
        var config;
        if (node.node) {
            config = node;
        } else {
            // the transition properties
            if (typeof to == 'string') {
                to = S.unparam(String(to), ';', ':');
                S.each(to, function (value, prop) {
                    var trimProp = S.trim(prop);
                    if (trimProp) {
                        to[trimProp] = S.trim(value);
                    }
                    if (!trimProp || trimProp != prop) {
                        delete to[prop];
                    }
                });
            } else {
                // clone to prevent collision within multiple instance
                to = S.clone(to);
            }
            // animation config
            if (S.isPlainObject(duration)) {
                config = S.clone(duration);
            } else {
                config = {
                    complete: complete
                };
                if (duration) {
                    config.duration = duration;
                }
                if (easing) {
                    config.easing = easing;
                }
            }
            config.node = node;
            config.to = to;
        }
        config = S.merge(defaultConfig, config, {
            // default anim mode for whole kissy application
            useTransition: S.config('anim/useTransition')
        });
        if (config['useTransition'] && TransitionAnim) {
            logger.info('use transition anim');
            return new TransitionAnim(config);
        } else {
            logger.info('use js timer anim');
            return new TimerAnim(config);
        }
    }


    /**
     * pause all the anims currently running
     * @param {HTMLElement} node element which anim belongs to
     * @param {String|Boolean} queue current queue's name to be cleared
     * @method pause
     * @member KISSY.Anim
     * @static
     */

    /**
     * resume all the anims currently running
     * @param {HTMLElement} node element which anim belongs to
     * @param {String|Boolean} queue current queue's name to be cleared
     * @method resume
     * @member KISSY.Anim
     * @static
     */


    /**
     * stop this animation
     * @param {Boolean} [finish] whether jump to the last position of this animation
     * @chainable
     * @method stop
     * @member KISSY.Anim
     */

    /**
     * start this animation
     * @chainable
     * @method run
     * @member KISSY.Anim
     */

    /**
     * resume current anim
     * @chainable
     * @method resume
     * @member KISSY.Anim
     */

    /**
     * pause current anim
     * @chainable
     * @method pause
     * @member KISSY.Anim
     */

    /**
     * whether this animation is running
     * @return {Boolean}
     * @method isRunning
     * @member KISSY.Anim
     */


    /**
     * whether this animation is paused
     * @return {Boolean}
     * @method isPaused
     * @member KISSY.Anim
     */

    S.each(['pause', 'resume'], function (action) {
        Anim[action] = function (node, queue) {
            if (
            // default queue
                queue === null ||
                    // name of specified queue
                    typeof queue == 'string' ||
                    // anims not belong to any queue
                    queue === false
                ) {
                return Utils.pauseOrResumeQueue(node, queue, action);
            }
            return Utils.pauseOrResumeQueue(node, undefined, action);
        };
    });

    /**
     * whether node is running anim
     * @method
     * @param {HTMLElement} node
     * @return {Boolean}
     * @static
     */
    Anim.isRunning = Utils.isElRunning;

    /**
     * whether node has paused anim
     * @method
     * @param {HTMLElement} node
     * @return {Boolean}
     * @static
     */
    Anim.isPaused = Utils.isElPaused;

    /**
     * stop all the anims currently running
     * @static
     * @method stop
     * @member KISSY.Anim
     * @param {HTMLElement} node element which anim belongs to
     * @param {Boolean} end whether jump to last position
     * @param {Boolean} clearQueue whether clean current queue
     * @param {String|Boolean} queueName current queue's name to be cleared
     */
    Anim.stop = Utils.stopEl;

    Anim.Easing = TimerAnim.Easing;

    S.Anim = Anim;

    Anim.Q = AnimBase.Q;

    return Anim;
}, {
    requires: ['dom', 'anim/base', 'anim/timer',
        KISSY.Features.isTransitionSupported() ? 'anim/transition' : '']

});

