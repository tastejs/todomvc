/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI,Image*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-assets-addon', function(Y, NAME) {

    var isInline = function(id) {
        return YUI._mojito && YUI._mojito._cache &&
            YUI._mojito._cache.compiled &&
            YUI._mojito._cache.compiled.css &&
            YUI._mojito._cache.compiled.css.inline &&
            YUI._mojito._cache.compiled.css.inline[id];
    };


    /**
     * <strong>Access point:</strong> <em>ac.assets.*</em>
     * Provides methods for adding HTML assets to a page.
     * @class Assets.common
     */
    function AssetsAcAddon(command, adapter, ac) {
        this.assetsRoot = command.instance.assetsRoot;
        this.assets = {};
        this.added = {};    // content: boolean
        this.mojitType = command.instance.type;
        this.context = command.context;

        // Add "assets" if they are found in the config.
        if (command.instance && command.instance.config &&
                command.instance.config.assets) {
            this.addAssets(command.instance.config.assets);
        }
    }


    AssetsAcAddon.prototype = {

        namespace: 'assets',

        /**
         * Method for adding a CSS file to the page.
         * @method addCss
         * @param {string} link A URL (./local.css converts to
         *     /static/mojit_type/assets/local.css).
         * @param {string} location Either "top" or "bottom".
         */
        addCss: function(link, location) {
            this.addAsset('css', (location || 'top'), link);
        },


        /**
         * Method for adding a JS file to the page.
         * @method addJs
         * @param {string} link A URL (./local.css converts to
         *     /static/mojit_type/assets/local.css).
         * @param {string} location Either "top" or "bottom".
         */
        addJs: function(link, location) {
            this.addAsset('js', (location || 'bottom'), link);
        },


        /**
         * Method for adding a Blob of data to the page. This can be used
         * for adding custom "script" or "style" blocks.
         * @method addBlob
         * @param {string} content A string of data.
         * @param {string} location Either "top" or "bottom".
         */
        addBlob: function(content, location) {
            this.addAsset('blob', (location || 'bottom'), content);
        },


        /**
         * @method addAsset
         * @param {string} type css|js|blob
         * @param {string} location Either "top" or "bottom".
         * @param {string} content A string of data.
         */
        addAsset: function(type, location, content) {
            if (!content) {
                return;
            }

            if (content.indexOf('./') === 0) {
                content = this.getUrl(content.slice(2));
            }

            if (this.added[content]) {
                return;
            }

            this.added[content] = true;

            // If we have not added the files for this mojit, we should add
            // them inline now.
            if (('css' === type) && isInline(content)) {

                // We can't do this on the server, because YUI._mojito._cache is
                // a server-lifetime global, so it "tunnels" between requests.
                if ('client' === this.context.runtime) {
                    if (!YUI._mojito._cache.compiled.css.inline.added) {
                        YUI._mojito._cache.compiled.css.inline.added = {};
                    }

                    if (YUI._mojito._cache.compiled.css.inline.added[content]) {
                        // Looks like we've already added this to the DOM
                        return;
                    }

                    YUI._mojito._cache.compiled.css.inline.added[
                        content
                    ] = true;
                }

                // Y.log('Inlining css for mojitType for the first time' +
                //     content, 'debug' , NAME);
                type = 'blob';
                content = '<style type="text/css">\n' +
                    YUI._mojito._cache.compiled.css.inline[content] +
                    '</style>\n';

                // Beware! "content" changes here. This is the actual CSS and
                // not the URI of the CSS resource!!!
                if (this.added[content]) {
                    return;
                }
            }

            if (!this.assets[location]) {
                this.assets[location] = {};
            }

            if (!this.assets[location][type]) {
                this.assets[location][type] = [];
            }

            this.assets[location][type].push(content);
        },


        /**
         * @method addAssets
         * @param {object} assets by location (top|bottom) & type (css|js|blob)
         */
        addAssets: function(assets) {
            var location,
                type,
                content;

            for (location in assets) {
                if (assets.hasOwnProperty(location)) {
                    for (type in assets[location]) {
                        if (assets[location].hasOwnProperty(type)) {
                            for (content in assets[location][type]) {
                                if (assets[location][type].
                                        hasOwnProperty(content)) {
                                    this.addAsset(type, location,
                                            assets[location][type][content]);
                                }
                            }
                        }
                    }
                }
            }
        },


        /**
         * @method preLoadImage
         * @param {string} url
         * @deprecated
         */
        preLoadImage: function(url) {
            var img;

            if (typeof document !== 'undefined') {
                img = new Image();
                img.src = url;
            }
        },


        /**
         * @method preLoadImages
         * @param {array.<string>} url
         * @deprecated
         */
        preLoadImages: function(urls) {
            var i;

            for (i in urls) {
                if (urls.hasOwnProperty(i)) {
                    this.preLoadImage(urls[i]);
                }
            }
        },


        /**
         * @method getUrl
         * @param {string} path of asset, relative
         * @return {string}
         */
        getUrl: function(path) {
            return this.assetsRoot + '/' + path;
        },


        /**
         * @method mixAssets
         * @param {object} to
         * @param {object} from
         * @return {object}
         */
        mixAssets: function(to, from) {
            return Y.mojito.util.metaMerge(to, from);
        },


        /**
         * @method getAssets
         * @return {object} assets by location (top|bottom) & type (css|js|blob)
         */
        getAssets: function() {
            return this.assets;
        },


        /**
         * @method renderLocations
         * @return {object} hash table with location and the HTML fragments
         * for each location with all the assets rendered.
         */
        renderLocations: function () {
            var fragments = {};

            // Attach assets found in the "meta" to the page
            Y.Object.each(this.assets, function (types, location) {

                if (!fragments[location]) {
                    fragments[location] = '';
                }

                Y.Object.each(types, function (list, type) {
                    var i,
                        data = '',
                        url;

                    if ('js' === type) {
                        for (i = 0; i < list.length; i += 1) {
                            // TODO: Fuly escape any HTML chars in the URL to avoid trivial
                            // attribute injection attacks. See owasp-esapi reference impl.
                            url = encodeURI(list[i]);
                            data += '<script type="text/javascript" src="' +
                                url + '"></script>\n';
                        }
                    } else if ('css' === type) {
                        for (i = 0; i < list.length; i += 1) {
                            // TODO: Escape any HTML chars in the URL to avoid trivial
                            // attribute injection attacks. See owasp-esapi reference impl.
                            url = encodeURI(list[i]);
                            data += '<link rel="stylesheet" type="text/css" href="' +
                                url + '"/>\n';
                        }
                    } else if ('blob' === type) {
                        for (i = 0; i < list.length; i += 1) {
                            // NOTE: Giant security hole...but used by everyone who uses
                            // Mojito so there's not much we can do except tell authors of
                            // Mojito applications to _never_ use user input to generate
                            // blob content or populate config data. Whatever goes in here
                            // can't be easily encoded without the likelihood of corruption.
                            data += list[i] + '\n';
                        }
                    } else {
                        Y.log('Unknown asset type "' + type + '". Skipped.', 'warn', NAME);
                    }

                    fragments[location] += data;
                });
            });

            return fragments;
        },


        /**
         * @mergeMetaInto
         * @private
         */
        mergeMetaInto: function(meta) {
            this.mixAssets(meta.assets, this.assets);
        }
    };

    Y.namespace('mojito.addons.ac').assets = AssetsAcAddon;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-util'
]});
