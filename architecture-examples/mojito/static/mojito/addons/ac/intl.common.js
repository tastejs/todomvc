/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-intl-addon', function(Y, NAME) {

    /**
     * <strong>Access point:</strong> <em>ac.intl.*</em>
     * Internationalization addon
     * @class Intl.common
     */
    function IntlAddon(command, adapter, ac) {
        this.ac = ac;
    }


    IntlAddon.prototype = {

        namespace: 'intl',

        /**
         * Returns translated string.
         * @method lang
         * @param label {string} Optional. The initial label to be translated. If not provided, returns a copy of all resources.
         * @param args {string|Array|Object} optional parameters for the string
         * @return {string|Object} translated string for label or if no label was provided an object containing all resources.
         */
        lang: function(label, args) {
            //Y.log('lang(' + label + ', ' + Y.JSON.stringify(args) + ') for ' + this.ac.type, 'debug', NAME);
            Y.Intl.setLang(this.ac.type, this.ac.context.lang);
            var string = Y.Intl.get(this.ac.type, label);
            if (string && args) {
                // simple string substitution
                return Y.Lang.sub(string, Y.Lang.isString(args) ? [args] : args);
            }
            return string;
        },


        /**
         * Returns local-specified date.
         * @method formatDate
         * @param {Date} date The initial date to be formatted.
         * @return {string} formatted data for language.
         */
        formatDate: function(date) {
            //Y.log('Formatting date (' + date + ') in lang "' +
            //    this.ac.context.lang + '"', 'debug', NAME);
            return Y.DataType.Date.format(date, {format: '%x'});
        }
    };

    IntlAddon.dependsOn = ['config'];

    Y.namespace('mojito.addons.ac').intl = IntlAddon;

}, '0.1.0', {requires: [
    'intl',
    'datatype-date',
    'mojito',
    'mojito-config-addon'
]});

