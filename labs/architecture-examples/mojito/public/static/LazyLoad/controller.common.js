/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


YUI.add('LazyLoad', function(Y, NAME) {

    Y.namespace('mojito.controllers')[NAME] = {

        /*
         * Initially, renders a bar node
         */
        index: function(ac) {
            // TODO: allow users to provide the loading content.
            ac.done({content: 'Loading...'});
        },


        /*
         * binder calls this to execute the lazy-mojit
         */
        load: function(ac) {
            var toLoad = ac.params.body('mojit');
            ac.composite.execute({
                children: {
                    'lazy': toLoad
                }
            }, function(data, meta) {
                // the meta has useful stuff for the client, so we'll use it,
                // but we want to send our data as JSON to the binder's callback
                meta.http.headers['content-type'] = 'application/json';
                // and we don't want the children
                delete meta.children;
                ac.done(Y.JSON.stringify(data), meta);
            });
        }
    };

}, '0.0.1', {requires: [
    'mojito',
    'json'
]});
