/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/route"], function(can) {
    "use strict";

    if(window.history && history.pushState) {
		can.route.bindings.pushstate = {
			/**
        	 * @property {String} can.route.pushstate.root
        	 * @parent can.route.pushstate
        	 * 
        	 * @description Configure the base url that will not be modified.
        	 * 
        	 * @option {String} Represents the base url that pushstate will prepend to all 
        	 * routes.  `root` defaults to: `"/"`.
        	 * 
        	 * @body
        	 * 
        	 * ## Use
        	 * 
        	 * By default, a route like:
        	 * 
        	 *     can.route(":type/:id")
        	 * 
        	 * Matches urls like:
        	 * 
        	 *     http://domain.com/contact/5
        	 * 
        	 * But sometimes, you only want to match pages within a certain directory.  For 
        	 * example, an application that is a filemanager.  You might want to 
        	 * specify root and routes like:
        	 * 
        	 *     can.route.pushstate.root = "/filemanager/"
        	 *     can.route("file-:fileId");
        	 *     can.route("folder-:fileId")
        	 * 
        	 * Which matches urls like:
        	 * 
        	 *     http://domain.com/filemanager/file-34234
        	 * 
        	 */
        	root: "/",
        	paramsMatcher: /^\?(?:[^=]+=[^&]*&)*[^=]+=[^&]*/,
	        querySeparator: '?',
	        bind: function() {
	        	// intercept routable links
                can.delegate.call(can.$(document.documentElement),'a', 'click', anchorClickFix);
                
                // popstate only fires on back/forward.
		        // To detect when someone calls push/replaceState, we need to wrap each method.
		        can.each(['pushState','replaceState'],function(method) {
		            originalMethods[method] = window.history[method];
		            window.history[method] = function(state) {
		                var result = originalMethods[method].apply(window.history, arguments);
		                can.route.setState();
		                return result;
		            };
		        });
		        
		        // Bind to popstate for back/forward
		        can.bind.call(window, 'popstate', can.route.setState);
            },
	        unbind: function(){
        		can.undelegate.call(can.$(document.documentElement),'click', 'a', anchorClickFix);
        	
            	can.each(['pushState','replaceState'],function(method) {
		            window.history[method] = originalMethods[method];
		        });
            	can.unbind.call(window, 'popstate', can.route.setState);
            },
	        matchingPartOfURL: function(){
            	var root = cleanRoot(),
            		loc = (location.pathname + location.search),
            		index = loc.indexOf(root);
            	
            	return loc.substr(index+root.length);
            },
            setURL: function(path) {
            	// keep hash if not in path, but in 
            	if( includeHash && path.indexOf("#") == -1 && window.location.hash) {
            		path += window.location.hash
            	}
            	window.history.pushState(null, null, can.route._call("root")+path);
            }
		}
		
		
        var anchorClickFix = function(e) {
        	if(!( e.isDefaultPrevented ? e.isDefaultPrevented() : e.defaultPrevented === true )) {
                // YUI calls back events triggered with this as a wrapped object
                var node = this._node || this;
                // Fix for ie showing blank host, but blank host means current host.
                var linksHost = node.host || window.location.host;
                // if link is within the same domain
                if( window.location.host == linksHost ) {
                    var curParams = can.route.deparam(node.pathname+node.search);
                    // if a route matches
                    if(curParams.hasOwnProperty('route')) {
                    	// make it possible to have a link with a hash
                    	includeHash = true;
                    	// update the data
                    	window.history.pushState(null, null, node.href);
                    	// test if you can preventDefault
                    	// our tests can't call .click() b/c this
                    	// freezes phantom
                    	e.preventDefault && e.preventDefault();
                	}
                }
        	}
		},
			cleanRoot = function(){
        		var domain = location.protocol+"//"+location.host,
        			root = can.route._call("root"),
        			index = root.indexOf( domain );
        		if( index == 0 ) {
        			return can.route.root.substr(domain.length)
        		}
        		return root
	        },
	        // a collection of methods on history that we are overwriting
	        originalMethods = {},
	        // used to tell setURL to include the hash because 
	        // we clicked on a link
	        includeHash = false;
	        
        can.route.defaultBinding = "pushstate";
        
    }

	return can;
});