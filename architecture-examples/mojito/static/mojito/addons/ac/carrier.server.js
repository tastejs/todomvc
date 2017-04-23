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
YUI.add('mojito-carrier-addon', function(Y, NAME) {

    /**
     * <strong>Access point:</strong> <em>ac.carrier.get()</em>
     * Carrier catalog addon
     * @class Carrier.common
     */
    function CarrierAddon(command, adapter, ac) {
        var req,
            my = this;

        this._ac = ac;
        this.command = command;

        if (ac.http) {
            req = ac.http.getRequest();
            if (req) {

                // Set carrier accessor
                Object.defineProperty(ac, 'carrier', {
                    get: function() {
                        if (req.carrier) {
                            return req.carrier;
                        } else {
                            return my;
                        }
                    },
                    set: function() {
                    },
                    configurable: true
                });
            }
        }
    }

    CarrierAddon.prototype = {

        // Intentionally commented out make it instantiable on demand.
        //namespace: 'carrier'

        /**
         * Returns the attribute of the catalog for the current carrier used for
         * this request.
         * @method get
         * @param {string} attribute The name of the catalog attribute e.g
         *     "ticker".
         * @return {object} The catalog attribute value.
         */
        get: function() {
            //TODO: make an RPC call.
        }
    };

    CarrierAddon.dependsOn = ['config', 'http'];

    Y.namespace('mojito.addons.ac').carrier = CarrierAddon;

}, '0.1.0', {requires: [
    'mojito'
]});
