//!steal-clean
/*******************************************************************************
 * OpenAjax.js
 *
 * Reference implementation of the OpenAjax Hub, as specified by OpenAjax Alliance.
 * Specification is under development at: 
 *
 *   http://www.openajax.org/member/wiki/OpenAjax_Hub_Specification
 *
 * Copyright 2006-2009 OpenAjax Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not 
 * use this file except in compliance with the License. You may obtain a copy 
 * of the License at http://www.apache.org/licenses/LICENSE-2.0 . Unless 
 * required by applicable law or agreed to in writing, software distributed 
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 *
 ******************************************************************************/
steal.then(function(){
// prevent re-definition of the OpenAjax object
if(!window["OpenAjax"]){
	/**
	* @class OpenAjax
	* Use OpenAjax.hub to publish and subscribe to messages.
	*/
	OpenAjax = new function(){
		var t = true;
		var f = false;
		var g = window;
		var ooh = "org.openajax.hub.";

		var h = {};
		this.hub = h;
		h.implementer = "http://openajax.org";
		h.implVersion = "2.0";
		h.specVersion = "2.0";
		h.implExtraData = {};
		var libs = {};
		h.libraries = libs;

		h.registerLibrary = function(prefix, nsURL, version, extra){
			libs[prefix] = {
				prefix: prefix,
				namespaceURI: nsURL,
				version: version,
				extraData: extra 
			};
			this.publish(ooh+"registerLibrary", libs[prefix]);
		}
		h.unregisterLibrary = function(prefix){
			this.publish(ooh+"unregisterLibrary", libs[prefix]);
			delete libs[prefix];
		}

		h._subscriptions = { c:{}, s:[] };
		h._cleanup = [];
		h._subIndex = 0;
		h._pubDepth = 0;

		h.subscribe = function(name, callback, scope, subscriberData, filter)			
		{
			if(!scope){
				scope = window;
			}
			var handle = name + "." + this._subIndex;
			var sub = { scope: scope, cb: callback, fcb: filter, data: subscriberData, sid: this._subIndex++, hdl: handle };
			var path = name.split(".");
	 		this._subscribe(this._subscriptions, path, 0, sub);
			return handle;
		}

		h.publish = function(name, message)		
		{
			var path = name.split(".");
			this._pubDepth++;
			this._publish(this._subscriptions, path, 0, name, message);
			this._pubDepth--;
			if((this._cleanup.length > 0) && (this._pubDepth == 0)) {
				for(var i = 0; i < this._cleanup.length; i++) 
					this.unsubscribe(this._cleanup[i].hdl);
				delete(this._cleanup);
				this._cleanup = [];
			}
		}

		h.unsubscribe = function(sub) 
		{
			var path = sub.split(".");
			var sid = path.pop();
			this._unsubscribe(this._subscriptions, path, 0, sid);
		}
		
		h._subscribe = function(tree, path, index, sub) 
		{
			var token = path[index];
			if(index == path.length) 	
				tree.s.push(sub);
			else { 
				if(typeof tree.c == "undefined")
					 tree.c = {};
				if(typeof tree.c[token] == "undefined") {
					tree.c[token] = { c: {}, s: [] }; 
					this._subscribe(tree.c[token], path, index + 1, sub);
				}
				else 
					this._subscribe( tree.c[token], path, index + 1, sub);
			}
		}

		h._publish = function(tree, path, index, name, msg, pid) {
			if(typeof tree != "undefined") {
				var node;
				if(index == path.length) {
					node = tree;
				} else {
					this._publish(tree.c[path[index]], path, index + 1, name, msg, pid);
					this._publish(tree.c["*"], path, index + 1, name, msg, pid);
					node = tree.c["**"];
				}
				if(typeof node != "undefined") {
					var callbacks = node.s;
					var max = callbacks.length;
					for(var i = 0; i < max; i++) {
						if(callbacks[i].cb) {
							var sc = callbacks[i].scope;
							var cb = callbacks[i].cb;
							var fcb = callbacks[i].fcb;
							var d = callbacks[i].data;
							if(typeof cb == "string"){
								// get a function object
								cb = sc[cb];
							}
							if(typeof fcb == "string"){
								// get a function object
								fcb = sc[fcb];
							}
							if((!fcb) || (fcb.call(sc, name, msg, d))) {
								cb.call(sc, name, msg, d, pid);
							}
						}
					}
				}
			}
		}
			
		h._unsubscribe = function(tree, path, index, sid) {
			if(typeof tree != "undefined") {
				if(index < path.length) {
					var childNode = tree.c[path[index]];
					this._unsubscribe(childNode, path, index + 1, sid);
					if(childNode.s.length == 0) {
						for(var x in childNode.c) 
					 		return;		
						delete tree.c[path[index]];	
					}
					return;
				}
				else {
					var callbacks = tree.s;
					var max = callbacks.length;
					for(var i = 0; i < max; i++) 
						if(sid == callbacks[i].sid) {
							if(this._pubDepth > 0) {
								callbacks[i].cb = null;	
								this._cleanup.push(callbacks[i]);						
							}
							else
								callbacks.splice(i, 1);
							return; 	
						}
				}
			}
		}
		// The following function is provided for automatic testing purposes.
		// It is not expected to be deployed in run-time OpenAjax Hub implementations.
		h.reinit = function()
		{
			for (var lib in OpenAjax.hub.libraries) {
				delete OpenAjax.hub.libraries[lib];
			}
			OpenAjax.hub.registerLibrary("OpenAjax", "http://openajax.org/hub", "1.0", {});

			delete OpenAjax._subscriptions;
			OpenAjax._subscriptions = {c:{},s:[]};
			delete OpenAjax._cleanup;
			OpenAjax._cleanup = [];
			OpenAjax._subIndex = 0;
			OpenAjax._pubDepth = 0;
		}
	};
	// Register the OpenAjax Hub itself as a library.
	OpenAjax.hub.registerLibrary("OpenAjax", "http://openajax.org/hub", "1.0", {});

}
OpenAjax.hub.registerLibrary("JavaScriptMVC", "http://JavaScriptMVC.com", "3.1", {});
});
