/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-device-addon', function(Y, NAME) {

    /**
     * <strong>Access point:</strong> <em>ac.device.get()</em>
     * Device catalog addon
     * @class Device.common
     */
    function DeviceAddon(command, adapter, ac) {
        var req,
            my = this;

        this._ac = ac;
        this.command = command;

        req = ac.http.getRequest();

        // Set device accessor
        Object.defineProperty(ac, 'device', {
            get: function() {
                if (req.device) {
                    return req.device;
                } else {
                    return my;
                }
            },
            set: function() {
            },
            configurable: true
        });
    }

    DeviceAddon.prototype = {
        // Intentionally commented out to make it instantiable on demand.
        //        namespace: 'device',

        /**
         * Returns the attribute of the catalog for the device
         * this request was intiated from.
         * @method get
         * @param {string} attribute The name of the catalog attribute e.g
         *     "make" or "model".
         * @return {object} The value of the named attribute.
         */
        get: function(attribute) {
            //TODO: make an RPC call.
        }
    };

    DeviceAddon.dependsOn = ['config', 'http'];

    Y.namespace('mojito.addons.ac').device = DeviceAddon;

}, '0.1.0', {requires: [
    'mojito'
]});
