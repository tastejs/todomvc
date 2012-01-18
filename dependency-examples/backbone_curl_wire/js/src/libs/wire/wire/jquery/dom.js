/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

/**
 * dom.js
 */
define(['jquery', 'wire/domReady'], function(jquery, domReady) {

    function resolveQuery(resolver, name, refObj /*, wire */) {

        domReady(function() {
            var result, i;

            result = jQuery(name);
            i = refObj.i;

            if (typeof i == 'number') {
                if (i < result.length) {
                    resolver.resolve(result[i]);
                } else {
                    resolver.reject(new Error("Query '" + name + "' returned " + result.length + " items while expecting at least " + (refObj.i + 1)));
                }
            } else {
                resolver.resolve(jQuery.makeArray(result));
            }
        });

    }

    /**
     * The plugin instance.  Can be the same for all wiring runs
     */
    var plugin = {
        resolvers: {
            'dom.query': resolveQuery
        }
    };

    return {
        wire$plugin: function(/*ready, destroyed, options*/) {
            return plugin;
        }
    };

});
