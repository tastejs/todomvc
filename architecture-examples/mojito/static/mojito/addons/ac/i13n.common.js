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
YUI.add('mojito-i13n-addon', function(Y, NAME) {

    /**
     * Processes the following part of the mojit's config:
     * <code>
     * "i13n" : {
     *      "spaceid" : 12345,
     *      "page"    : { "val1" : "param1"}
     * }
     * </code>
     * @method initFromConfig
     * @param {object} command The comment object providing configuration data.
     * @param {ActionContext} ac The action context.
     * @param {object} i13n The localization object.
     * @private
     */
    function initFromConfig(command, ac, i13n) {
        var config,
            page,
            name;

        if (this.initialized) {
            return;
        }

        // get the i13n
        config = command.instance.config.i13n || null;
        if (config) {
            this.initialized = true;
            if (typeof config.spaceid === 'number' ||
                    typeof config.spaceid === 'string') {

                // stamp spaceid
                i13n.stamp.stampPageView(config.spaceid);

                // track page params
                if (typeof config.page === 'object') {
                    page = config.page;
                    for (name in page) {
                        if (page.hasOwnProperty(name)) {
                            i13n.trackPageParams(name, page[name],
                                i13n.ULT.ULT_PRECEDENCE_DEFAULT);
                        }
                    }
                }
            }
        }
    }


    /**
     * <strong>Access point:</strong> <em>ac.i13n.*</em>
     * Instrumentation addon for link tracking and page views.
     * @class I13n.server
     */
    function I13nAddon(command, adapter, ac) {
        var req;

        this._ac = ac;
        this.command = command;

        if (ac.http) {
            req = ac.http.getRequest();
            if (req && req.i13n) {
                ac.i13n = req.i13n;

                // additional functionality
                ac.i13n.make = I13nAddon.prototype.make;
                ac.i13n._ac = ac;

                initFromConfig.call(this, command, ac, req.i13n);
                return;
            }
        }

        ac.i13n = this;
    }


    I13nAddon.prototype = {

        /**
         * Provides facility to create an URL to other
         * mojits with a link tracking instrumentation.
         * @method make
         * @param {string} base Reference to a mojit defined at the root
         *     level of the Mojito application configuration.
         * @param {string} action The action to associate with the base.
         * @param {object} routeParams used to lookup the route in the routing
         *     table.
         * @param {string} verb GET, POST, PUT, DELETE (case insensitive).
         * @param {object} urlParams added to the looked up route as query
         *     params.
         * @param {object} i13nParams parameters to be used for link tracking.
         */
        make: function(base, action, routeParams, verb, urlParams, i13nParams) {
            var result = this._ac.url.make(base, action, routeParams, verb,
                urlParams);

            if (result) {
                result = this.trackLink(result, i13nParams);
            }
            return result;
        },


        /**
         * Stamps the page view event.
         * @param {number} spaceid The spaceid to be used.
         */
        stampPageView: function(spaceid) {
            // TODO: implement this.
        },


        /**
         * Tracks a pair of page parameters as (key, value) for this request.
         * @param {string} key The page parameter name.
         * @param {string} value The page parameter value.
         */
        trackPageParams: function(key, value) {
            // TODO: implement this.
        },


        /**
         * Tracks the link view and generates the URL with the hash token
         * appended to it.
         * @param {string} url The link to be instrumented.
         * @param {object} link_params The link parameters.
         * @param {object} local_groups - Optional.
         * @param {object} ult_args - Optional.
         * @return {string} url with the hash appended to it.
         */
        trackLink: function(url, link_params, local_groups, ult_args) {
            // TODO: implement this.
        },


        /**
         * Tracks the link view for the links taken from the user generated
         * content and hence need to be signed by B-cookie to prevent the
         * security problems.
         * @param {string} url The link to be instrumented.
         * @param {object} link_params The link parameters.
         * @param {object} local_groups Optional.
         * @param {object} ult_args Optional.
         * @return {string} url with the hash appended to it.
         */
        trackUserLink: function(url, link_params, local_groups, ult_args) {
            // TODO: implement this.
        },


        /**
         * , ,  [, ult_args [, return_code]]
         * @param {boolean} is_post_method True, if the method is POST.
         * @param {string} action_url The form action link to be instrumented.
         * @param {object} link_params Tracking parameters.
         * @param {object} ult_args Optional.
         * @return {string} form action url with the hash appended to it.
         */
        trackForm: function(is_post_method, action_url, link_params, ult_args) {
            // TODO: implement this.
        },


        /**
         * Instrument links for tracking of the link clicks by gemerating the
         * URL with the hash token appended to it.
         * @param {string} url The link to be instrumented.
         * @param {object} link_params The link parameters.
         * @param {object} ult_args Optional.
         * @return {string} url with the hash appended to it.
         */
        trackClickOnly: function(url, link_params, ult_args) {
            // TODO: implement this.
        },


        /**
         * Return spaceid used for this request.
         * @return {object} the spaceid previously set through stampPageView()
         *     or configuration.
         */
        getSpaceid: function() {
            // TODO: implement this.
        },


        stampNonClassified: function() {
            // TODO: implement this.
        },


        stampIgnore: function() {
            // TODO: implement this.
        },


        isStamped: function() {
            // TODO: implement this.
        }
    };

    I13nAddon.dependsOn = ['config', 'http', 'url'];

    Y.namespace('mojito.addons.ac').i13n = I13nAddon;

}, '0.1.0', {requires: [
    'mojito'
]});
