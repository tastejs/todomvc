/**
 * Durandal 2.0.1 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
/**
 * The viewEngine module provides information to the viewLocator module which is used to locate the view's source file. The viewEngine also transforms a view id into a view instance.
 * @module viewEngine
 * @requires system
 * @requires jquery
 */
define(['durandal/system', 'jquery'], function (system, $) {
    var parseMarkup;

    if ($.parseHTML) {
        parseMarkup = function (html) {
            return $.parseHTML(html);
        };
    } else {
        parseMarkup = function (html) {
            return $(html).get();
        };
    }

    /**
     * @class ViewEngineModule
     * @static
     */
    return {
        /**
         * The file extension that view source files are expected to have.
         * @property {string} viewExtension
         * @default .html
         */
        viewExtension: '.html',
        /**
         * The name of the RequireJS loader plugin used by the viewLocator to obtain the view source. (Use requirejs to map the plugin's full path).
         * @property {string} viewPlugin
         * @default text
         */
        viewPlugin: 'text',
        /**
         * Determines if the url is a url for a view, according to the view engine.
         * @method isViewUrl
         * @param {string} url The potential view url.
         * @return {boolean} True if the url is a view url, false otherwise.
         */
        isViewUrl: function (url) {
            return url.indexOf(this.viewExtension, url.length - this.viewExtension.length) !== -1;
        },
        /**
         * Converts a view url into a view id.
         * @method convertViewUrlToViewId
         * @param {string} url The url to convert.
         * @return {string} The view id.
         */
        convertViewUrlToViewId: function (url) {
            return url.substring(0, url.length - this.viewExtension.length);
        },
        /**
         * Converts a view id into a full RequireJS path.
         * @method convertViewIdToRequirePath
         * @param {string} viewId The view id to convert.
         * @return {string} The require path.
         */
        convertViewIdToRequirePath: function (viewId) {
            return this.viewPlugin + '!' + viewId + this.viewExtension;
        },
        /**
         * Parses the view engine recognized markup and returns DOM elements.
         * @method parseMarkup
         * @param {string} markup The markup to parse.
         * @return {DOMElement[]} The elements.
         */
        parseMarkup: parseMarkup,
        /**
         * Calls `parseMarkup` and then pipes the results through `ensureSingleElement`.
         * @method processMarkup
         * @param {string} markup The markup to process.
         * @return {DOMElement} The view.
         */
        processMarkup: function (markup) {
            var allElements = this.parseMarkup(markup);
            return this.ensureSingleElement(allElements);
        },
        /**
         * Converts an array of elements into a single element. White space and comments are removed. If a single element does not remain, then the elements are wrapped.
         * @method ensureSingleElement
         * @param {DOMElement[]} allElements The elements.
         * @return {DOMElement} A single element.
         */
        ensureSingleElement:function(allElements){
            if (allElements.length == 1) {
                return allElements[0];
            }

            var withoutCommentsOrEmptyText = [];

            for (var i = 0; i < allElements.length; i++) {
                var current = allElements[i];
                if (current.nodeType != 8) {
                    if (current.nodeType == 3) {
                        var result = /\S/.test(current.nodeValue);
                        if (!result) {
                            continue;
                        }
                    }

                    withoutCommentsOrEmptyText.push(current);
                }
            }

            if (withoutCommentsOrEmptyText.length > 1) {
                return $(withoutCommentsOrEmptyText).wrapAll('<div class="durandal-wrapper"></div>').parent().get(0);
            }

            return withoutCommentsOrEmptyText[0];
        },
        /**
         * Creates the view associated with the view id.
         * @method createView
         * @param {string} viewId The view id whose view should be created.
         * @return {Promise} A promise of the view.
         */
        createView: function(viewId) {
            var that = this;
            var requirePath = this.convertViewIdToRequirePath(viewId);

            return system.defer(function(dfd) {
                system.acquire(requirePath).then(function(markup) {
                    var element = that.processMarkup(markup);
                    element.setAttribute('data-view', viewId);
                    dfd.resolve(element);
                }).fail(function(err){
                        that.createFallbackView(viewId, requirePath, err).then(function(element){
                            element.setAttribute('data-view', viewId);
                            dfd.resolve(element);
                        });
                    });
            }).promise();
        },
        /**
         * Called when a view cannot be found to provide the opportunity to locate or generate a fallback view. Mainly used to ease development.
         * @method createFallbackView
         * @param {string} viewId The view id whose view should be created.
         * @param {string} requirePath The require path that was attempted.
         * @param {Error} requirePath The error that was returned from the attempt to locate the default view.
         * @return {Promise} A promise for the fallback view.
         */
        createFallbackView: function (viewId, requirePath, err) {
            var that = this,
                message = 'View Not Found. Searched for "' + viewId + '" via path "' + requirePath + '".';

            return system.defer(function(dfd) {
                dfd.resolve(that.processMarkup('<div class="durandal-view-404">' + message + '</div>'));
            }).promise();
        }
    };
});
