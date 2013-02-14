/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-outside', function (Y, NAME) {

/**
 * Outside events are synthetic DOM events that fire when a corresponding native
 * or synthetic DOM event occurs outside a bound element.
 *
 * The following outside events are pre-defined by this module:
 * <ul>
 *   <li>blur</li>
 *   <li>change</li>
 *   <li>click</li>
 *   <li>dblclick</li>
 *   <li>focus</li>
 *   <li>keydown</li>
 *   <li>keypress</li>
 *   <li>keyup</li>
 *   <li>mousedown</li>
 *   <li>mousemove</li>
 *   <li>mouseout</li>
 *   <li>mouseover</li>
 *   <li>mouseup</li>
 *   <li>select</li>
 *   <li>submit</li>
 * </ul>
 *
 * Define new outside events with
 * <code>Y.Event.defineOutside(eventType);</code>.
 * By default, the created synthetic event name will be the name of the event
 * with "outside" appended (e.g. "click" becomes "clickoutside"). If you want
 * a different name for the created Event, pass it as a second argument like so:
 * <code>Y.Event.defineOutside(eventType, "yonderclick")</code>.
 *
 * This module was contributed by Brett Stimmerman, promoted from his
 * gallery-outside-events module at
 * http://yuilibrary.com/gallery/show/outside-events
 *
 * @module event
 * @submodule event-outside
 * @author brettstimmerman
 * @since 3.4.0
 */

// Outside events are pre-defined for each of these native DOM events
var nativeEvents = [
        'blur', 'change', 'click', 'dblclick', 'focus', 'keydown', 'keypress',
        'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'select', 'submit'
    ];

/**
 * Defines a new outside event to correspond with the given DOM event.
 *
 * By default, the created synthetic event name will be the name of the event
 * with "outside" appended (e.g. "click" becomes "clickoutside"). If you want
 * a different name for the created Event, pass it as a second argument like so:
 * <code>Y.Event.defineOutside(eventType, "yonderclick")</code>.
 *
 * @method defineOutside
 * @param {String} event DOM event
 * @param {String} name (optional) custom outside event name
 * @static
 * @for Event
 */
Y.Event.defineOutside = function (event, name) {
    name = name || (event + 'outside');

    var config = {
    
        on: function (node, sub, notifier) {
            sub.handle = Y.one('doc').on(event, function(e) {
                if (this.isOutside(node, e.target)) {
                    e.currentTarget = node;
                    notifier.fire(e);
                }
            }, this);
        },
        
        detach: function (node, sub, notifier) {
            sub.handle.detach();
        },
        
        delegate: function (node, sub, notifier, filter) {
            sub.handle = Y.one('doc').delegate(event, function (e) {
                if (this.isOutside(node, e.target)) {
                    notifier.fire(e);
                }
            }, filter, this);
        },
        
        isOutside: function (node, target) {
            return target !== node && !target.ancestor(function (p) {
                    return p === node;
                });
        }
    };
    config.detachDelegate = config.detach;

    Y.Event.define(name, config);
};

// Define outside events for some common native DOM events
Y.Array.each(nativeEvents, function (event) {
    Y.Event.defineOutside(event);
});


}, '3.7.3', {"requires": ["event-synthetic"]});
