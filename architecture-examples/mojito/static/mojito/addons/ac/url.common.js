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
YUI.add('mojito-url-addon', function(Y, NAME) {

    function objectToQueryStr(obj, removeEmpty) {
        // If "removeEmpty" is true we remove any params with no value.
        if (removeEmpty) {
            Y.Object.each(obj, function(val, key) {
                if (!val) {
                    delete obj[key];
                }
            });
        }

        if (Y.Lang.isObject(obj) && Y.Object.size(obj) > 0) {
            obj = Y.QueryString.stringify(obj);
        }

        return obj;
    }


    /**
     * <strong>Access point:</strong> <em>ac.url.*</em>
     * Generates URL's based on the applictions routing configuration
     * @class Url.common
     */
    function UrlAcAddon(command, adapter, ac) {
        this.routeConfig = ac.app.routes;
        this.appConfig = ac.app.config;
    }


    UrlAcAddon.prototype = {

        namespace: 'url',

        /**
         * Generates a URL from the given parameters
         * @method make
         * @param {string} base Base mojit defined at the root level of the
         *     Mojito application configuration.
         * @param {string} action Action reference, concatenated to the base
         *     using a period (.) separator.
         * @param {object} routeParams used to lookup the route in the routing
         *     table.
         * @param {string} varb GET, POST, PUT, DELETE (case insensitive).
         * @param {object} urlParams added to the looked up route as query
         *     params.
         */
        make: function(base, action, routeParams, verb, urlParams) {
            var url,
                query = base + '.' + action;

            routeParams = objectToQueryStr(routeParams);

            if (routeParams && routeParams.length) {
                query = query + '?' + routeParams;
            }

            url = this.getRouteMaker().make(query, verb);

            if (urlParams) {
                urlParams = objectToQueryStr(urlParams, true);

                if (urlParams && urlParams.length) {
                    url = url + '?' + urlParams;
                }
            }

            // IOS PATCH
            if (typeof window !== 'undefined') {
                url = Y.mojito.util.iOSUrl(url);
            }

            // this is mainly used by html5app
            if (this.appConfig.pathToRoot) {
                url = this.appConfig.pathToRoot + url;
            }

            return url;
        },


        /**
         * Finds the first matching route from the given URL
         * @method find
         * @param {string} url the URL to find a route for.
         * @param {string} verb the HTTP method.
         */
        find: function(url, verb) {

            // Remove http://some.domain.com/ stuff
            if (url.indexOf('http://') === 0) {
                url = url.slice(url.indexOf('/', 7));
            }

            // Remove an query params given
            if (url.indexOf('?') > 0) {
                url = url.slice(0, url.indexOf('?'));
            }

            return this.getRouteMaker().find(url, verb);
        },

        getRouteMaker: function() {
            if (!this.maker) {
                this.maker = new Y.mojito.RouteMaker(this.routeConfig);
            }
            return this.maker;
        }
    };

    Y.namespace('mojito.addons.ac').url = UrlAcAddon;

}, '0.1.0', {requires: [
    'querystring-stringify-simple',
    'mojito-route-maker',
    'mojito-util'
]});
