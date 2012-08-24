/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


YUI.add('dali-bean', function(Y) {

    function DaliBean(obj) {
        DaliBean.superclass.constructor.call(this, {
            bubbles: true,
            emitFacade: true
        });

        Y.mix(this, obj);

        // make sure all events are published so parents that add themselves as
        // targets get called with the firing of the event. This prevents users
        // of this class having to manually call publish for each event they
        // want to fire
        Y.Do.before(function(x) {
            this.publish(x.type || x);
        }, this, 'fire');
    }

    Y.extend(DaliBean, Y.EventTarget);

    Y.namespace('Dali');
    Y.Dali.Bean = DaliBean;

}, '1.6.3', {requires: [
    'breg',
    'oop',
    'event-custom'
]});
