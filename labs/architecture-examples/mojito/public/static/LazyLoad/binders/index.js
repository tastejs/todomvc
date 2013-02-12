/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


YUI.add('LazyLoadBinderIndex', function(Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function(mojitProxy) {
            this.mp = mojitProxy;
        },


        bind: function(node) {
            var my = this;

            // immediately load the lazy mojit in my config
            this.mp.invoke('load', {
                params: {
                    body: {
                        mojit: this.mp.config.proxied
                    }
                }
            }, function(err, data) {
                if (err) {
                    my.broadcast('lazy-load-error',
                        {
                            error: err,
                            proxied: my.mp.config.proxied
                        });
                } else {
                    // replace node completely
                    var markup = Y.JSON.parse(data).lazy;
                    node.replace(markup);
                    // notify
                    my.mp.broadcast('lazy-load-complete',
                        {
                            mojit: my.mp.config.proxied
                        });

                    // SEPPUKU!! (but leave the node on the DOM)
                    my.mp.destroySelf(true);
                }
            });
        }
    };

}, '0.0.1', {requires: [
    'mojito-client',
    'node',
    'json'
]});
