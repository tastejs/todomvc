/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('TodoMojitBinderIndex', function(Y, NAME) {
	"use strict";

    Y.namespace('mojito.binders')[NAME] = {

        init: function(mojitProxy) {
        },

        bind: function(node) {
			new Y.TodoMVC.TodoApp();
		}
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'json', 'todo-app']});
