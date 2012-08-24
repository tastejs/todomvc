/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true, node:true*/
/*global YUI*/


YUI.add('mojito-mu', function(Y, NAME) {

    var mu = YUI.require(__dirname + '/../../libs/Mulib/Mu'),
        fs = require('fs');


    /**
     * Class text.
     * @class MuAdapterServer
     * @private
     */
    function MuAdapter(viewId) {
        this.viewId = viewId;
    }


    MuAdapter.prototype = {

        /**
         * Renders the mustache template using the data provided.
         * @method render
         * @param {object} data The data to render.
         * @param {string} mojitType The name of the mojit type.
         * @param {string} tmpl The name of the template to render.
         * @param {object} adapter The output adapter to use.
         * @param {object} meta Optional metadata.
         * @param {boolean} more Whether there will be more content later.
         */
        render: function(data, mojitType, tmpl, adapter, meta, more) {
            var me = this,
                handleRender = function(err, output) {
                    if (err) {
                        throw err;
                    }

                    output.addListener('data', function(c) {
                        adapter.flush(c, meta);
                    });

                    output.addListener('end', function() {
                        if (!more) {
                            Y.log('render complete for view "' +
                                me.viewId + '"',
                                'mojito', 'qeperf');
                            adapter.done('', meta);
                        }
                    });
                };

            /*
             * We can't use pre-compiled Mu templates on the server :(
             */

            // If we don't have a compliled template, make one.
            Y.log('Rendering template "' + tmpl + '"', 'mojito', NAME);
            mu.render(tmpl, data, {cached: meta.view.cacheTemplates},
                handleRender);
        },


        compiler: function(tmpl) {
            return Y.JSON.stringify(fs.readFileSync(tmpl, 'utf8'));
        }
    };

    Y.namespace('mojito.addons.viewEngines').mu = MuAdapter;

}, '0.1.0', {requires: []});
