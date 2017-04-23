/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('TodoMojit', function(Y, NAME) {
	"use strict";

    Y.namespace('mojito.controllers')[NAME] = {

        init: function(config) {
            this.config = config;
        },

        index: function(ac) {
			ac.assets.addBlob('<meta charset="utf-8">\n<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">', 'top');
			ac.assets.addCss('/static/' + ac.type + '/assets/base.css', 'top');
			ac.assets.addBlob('<!--[if IE]>\n<script src="/static/' + ac.type + '/assets/ie.js"></script>\n<![endif]-->', 'top');
			ac.done({});
        },
    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon']});
