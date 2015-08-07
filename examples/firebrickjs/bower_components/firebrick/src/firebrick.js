/*!
* Firebrick JS - JavaScript MVC Framework powered by jQuery and Knockout JS
* @author Steven Masala [me@smasala.com]
* @version 0.13.4 
*/

(function (root, factory) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        define(["jquery", "knockout", "knockout-mapping", "text"], function ($, ko, kom) {
            ko.mapping = kom;
            return factory($, ko);
        });
    } else {
        factory(root.jQuery, root.ko);
    }

}(this, function ($, ko) {
    
    "use strict";
    
	if (window.Firebrick || window.fb) {
		console.error("unable to initialise FirebrickJS, window.Firebrick or window.fb are already defined");
		return;
	}

	/**
	 * A lightweight JavaScript MVC Framework powered with jQuery, Knockout JS and Require JS
	 * 
	 * @module Firebrick
	 * @class Firebrick
	 */
	var Firebrick = {
		
		/**
		 * @property version
		 * @type {String}
		 */
		version: "0.13.4",

		/**2
		* used to store configurations set Firebrick.ready()
		* @private
		* @property app
		* @property app.name
		* @type {Object}
		*/
		app: {
			name: ""
		},
		
		/** 
		 * ready function to kick start the application
		* @method application
		* @param {Object} options
		* @param {Object} options.ready {Function} - called on document ready
		* @param {Object} options.app
		* @param {Object} options.app.name name of the app
		* @param {Object} options.app.path path of the app
		* @param {Object} options.autoRender {Boolean} whether to call first view automatically  "{app.name}.view.Index",
		* @param {Object} options.viewData {Object} viewData to be passed to the autoRender view,
		* @param {Object} options.splash {String} - html or string to be rendered before the document is loaded - removed on document.ready
		* @param {Object} options.require {String, Array of Strings} file(s) are required
		* @param {Object} options.cache {Boolean} [cache=true] whether require should cache files or not,
		* @param {Object} options.dev {Boolean} [dev=false] true to print requirejs exceptions to console
		* @param {Object} options.lang language file name or store,
		*/
		application: function (options) {
			var me = this;
			
            me.app = options.app;
			
			me.utils.initSplash(options.splash || me.templates.loadingTpl);

			Firebrick.boot.prepApplication(options);
			
			//if files need to be required first, then require them and fire the application
			if (options.require && options.require.length > 0) {
			
				if (!$.isArray(options.require)) {
					//convert to array if no already
					options.require = [options.require];
				}

				require(options.require, function () {
					me.utils.clearSplash();
					var args = arguments;
					$(document).ready(function () {
						if(options.ready){
							options.ready.apply(Firebrick, args);
						}
					});
				});
			
			} else {
				me.utils.clearSplash();
				$(document).ready(function () {
					if(options.ready){
						options.ready();	
					}
				});
			}
		},
		
		/**
		 * show stackTrace at any given point by creating an error. This will only work if the application is in "dev" mode.
		 * @method stackTrace
		 * @param force {Boolean} [default=false] set to true to force the stacktrace in prod mode too
		 * @return stack trace
		 */
		stackTrace: function(){
			return new Error().stack;
		},
		/**
		 * @method shortcut
		 * @private
		 * @param scope {Object}
		 * @param func {String}
		 * @param args {Args..}
		 * @return {Many}
		 */
		shortcut: function (scope, func, args) {
			return scope[func].apply(scope, args);
		},
		
		/**
		 * shortcut for Firebrick.classes:get
		 * @method get
		 */
		get: function () {
			return this.shortcut(this.classes, "get", arguments);
		},
		/**
		 * shortcut for Firebrick.classes:getById
		 * @method getById
		 */
		getById: function () {
			return this.shortcut(this.classes, "getById", arguments);
		},
		/**
		 * shortcut for Firebrick.classes:create
		 * @method create
		 */
		create: function () {
			return this.shortcut(this.classes, "create", arguments);
		},
		/**
		 * shortcut for Firebrick.classes:define
		 * @method define
		 */
		define: function () {
			return this.shortcut(this.classes, "define", arguments);
		},
		/**
		 * shortcut for Firebrick.controllers.createController
		 * @method createController
		 */
		createController: function () {
			return this.shortcut(this.controllers, "createController", arguments);
		},
		/**
		 * shortcut for Firebrick.utils.require
		 * @method require
		 */
		require: function () {
			return this.shortcut(this.utils, "require", arguments);
		},
		/**
		 * shortcut for Firebrick.views.loadRaw
		 * @method loadRaw
		 */
		loadRaw: function () {
			return this.shortcut(this.views, "loadRaw", arguments);
		},
		/**
		 * shortcut for Firebrick.views.createView
		 * @method createView
		 */
		createView: function () {
			return this.shortcut(this.views, "createView", arguments);
		},
		/**
		 * shortcut for Firebrick.views.defineView
		 * @method defineView
		 */
		defineView: function () {
			return this.shortcut(this.views, "defineView", arguments);
		},
		/**
		 * shortcut for Firebrick.views.getBody
		 * @method getBody
		 */
		getBody: function () {
			return this.shortcut(this.views, "getBody", arguments);
		},
		/**
		 * shortcut for Firebrick.utils.delay
		 * @method delay
		 */
		delay: function () {
			return this.shortcut(this.utils, "delay", arguments);
		},
		/**
		 * shortcut for Firebrick.events.addListener
		 * @method addListener
		 */
		addListener: function () {
			return this.shortcut(this.events, "addListener", arguments);
		},
		/**
		 * shortcut for Firebrick.events.removeListener
		 * @method removeListener
		 */
		removeListener: function () {
			return this.shortcut(this.events, "removeListener", arguments);
		},
		/**
		 * shortcut for Firebrick.events.fireEvent
		 * @method fireEvent
		 */
		fireEvent: function () {
			return this.shortcut(this.events, "fireEvent", arguments);
		},
		/**
		 * shortcut for Firebrick.events.on
		 * @method on
		 */
		on: function () {
			return this.shortcut(this.events, "on", arguments);
		},
		/**
		 * shortcut for Firebrick.events.off
		 * @method off
		 */
		off: function () {
			return this.shortcut(this.events, "off", arguments);
		},
		/**
		 * shortcut for Firebrick.data.store.createStore
		 * @method createStore
		 */
		createStore: function () {
			return this.shortcut(this.data.store, "createStore", arguments);
		},
		/**
		 * shortcut for Firebrick.languages.getByKey
		 * @method text
		 */
		text: function () {
			return this.shortcut(this.languages, "getByKey", arguments);
		},
		
		/**
		 * this is used in conjunction with "scrollTo" url parameter.
		 * This is needed if you have a fixed header for example and the browser
		 * scroll the anchor to position 0 which is behind the header - effectively cutting off content
		 * @property scrollTopOffset
		 * @type {Integer|Function}
		 * @default 0
		 */
		scrollTopOffset: 0,
		
		/**
		 * @property scrollContainerSelector
		 * @type {String}
		 * @default "body, html"
		 */
		scrollContainerSelector: "body, html",
		
		/**
		 * @for Firebrick
		 * @class Classes
		 */
		classes: {
		
			/**
			* Class Registry
			* @property _classRegistry
			* @private
			* @type {Object} map of all classes
			*/
			_classRegistry: {},
			
			/**
			 * @property _createdClasses
			 * @private
			 * @type {Object} map of all classes
			 */
			_createdClasses:{},
			
			/**
			 * @property _sNames
			 * @private
			 * @type {Object} map
			 */
			_sNames: {},
			
			/**
			* returns a firebrick class by name from the registry
			* @method get
			* @param name {String}
			* @return {Object}
			*/
			get: function (name) {
				var me = this;
				return me._classRegistry[name];
			},
			
			/**
			 * @example
			 *     addSNames({
			 *     		"mynamespace.MyClass":{
			 *     			path:"MyApp.class.MyClass"
			 *     		}
			 *     });
			 * @method addSNames
			 * @param obj {Object}
			 * @return {Object} all sName object (with new entries)
			 */
			addSNames: function(obj){	
				var me = this;
				me._sNames = Firebrick.utils.overwrite(me._sNames, obj);
				return me._sNames;
			},
			
			/**
			 * get a class by property: classId
			 * @method getById
			 * @param {String} id
			 * @return {Object|null}
			 */
			getById: function (id) {
				var me = this;
				
				if(id){
					return me._createdClasses[id];
				}
				
				return null;
			},
			
			/**
			 * @method getSNameConfig
			 * @param name {String} components unique shortname "fields.input"
			 * @return {Object|null}
			 */
			getSNameConfig: function(name){
				return this._sNames[name.toLowerCase()];
			},
			
			/**
			 * remove a class from the created classes registry 
			 * @method removeClass
			 * @param clazz {Object|String} clazz object or classname
			 */
			removeClass: function(clazz){
				var obj = typeof clazz === "string" ? Firebrick.get(clazz) : clazz;
				if(obj){
					if(obj.id){
						delete Firebrick.classes._createdClasses[obj.id];	//delete the tmp created obj
						//delete Firebrick.classes._classRegistry[obj._classname];
					}
//					if(!clazz.fbTmpClass){
//						delete Firebrick.classes._classRegistry[obj._classname];	//delete class itself	
//					}
				}
			},
			
			/**
			 * @method _callParentConstructor
			 * @private
			 * @param func {Function}
			 * @param parent {Function}
			 * @return new function {Function}
			 */
			_callParentConstructor: function(func, parent){
				return function () {
					var me = this,
						id = Firebrick.utils.uniqId(),
						scopeCallParentId;
					//if this callParent has already been set, then callParent is being call from inside a callParent call
					//make a copy of it to ensure it set to the current value after the parent function is called
					if(me.callParent){
						scopeCallParentId = "_scope_callParent_" + id;
						me[scopeCallParentId] = me.callParent;
					}
					me.callParent = function (args) {
							return parent.apply(me, args);
						};
                    var r = func.apply(me, arguments);
                    //restoring call function scope
                    if(scopeCallParentId){
                    	me.callParent = me[scopeCallParentId];
                    	delete me[scopeCallParentId];	
                    }else{
                    	delete me.callParent;	
                    }
                    return r;
                };	
			},
			
			/**
			 * pass a simple object and a super class that you wish to extend from OOP
			 * @method extend
			 * @param {Object} obj
			 * @param {Object} superc object class
			 * @return {Object} prototype of superc (i.e. obj which extends from super
			 */
			extend: function (obj, superc) {
				var me = this,
					objTemp = {},
                    p;

				//iterate over all obj parameters
				for (p in obj) {
					if (obj.hasOwnProperty(p)) {
						//replace the property with a descriptor object
						objTemp[p] = Object.getOwnPropertyDescriptor(obj, p);
						//if the property is found in the super class and is a function
						if (superc[p] && $.isFunction(superc[p]) && $.isFunction(obj[p])) {
							//enable the function to call its super function by calling this.callParent
							objTemp[p].value = me._callParentConstructor(objTemp[p].value, superc[p]);
		               }
					}
                }
				//create a tmp version of the super object
		        var tmp = Object.create(superc);
		        //create a new object with the descriptors that inherit from super
		        return Object.create(Object.getPrototypeOf(tmp), objTemp);
			},
			
			/**
			* get or returns a firebrick class by name and calls init()
			* @method create
			* @param name {String}
			* @param config {Object}
			* @return {Object} class
			*/
			create: function(name, config){
				var me = this,
					clazz = me.get(name);
				
				if(clazz){
			    	//check if there are any config options
		    		clazz = me.extend(config, clazz);	
			    }else{
			        clazz = me.define(name, config || {});
			    }
			    
			    clazz.initialConfig = config;
			    
			    if(!clazz.id){
			    	clazz.id = clazz.getId ? clazz.getId() : Firebrick.utils.uniqId();
			    }
			    
		    	me._createdClasses[clazz.id] = clazz;
		    	
		    	if(clazz.init){
			    	clazz.init();
			    }
			    
			    return clazz;
			},
			
			/**
			 * @method _initMixins
			 * @private
			 * @param clazz {Object}
			 * @param mix {Object} optional used by recursive
			 * @return {Object} clazz
			 */
			_initMixins: function(clazz, name){
				var me = this;
				//all mixins are mixed in when the class is defined - so only look if the object has the property itself (not parent)
				//so that mixins are not mixed twice or more
				if(clazz.hasOwnProperty("mixins")){
					
					//mixit check to make sure that the mixin hasn't been mixed in already
					var mixit = function(obj, mix){
						if($.isPlainObject(mix)){
//							if(!mix._mixedIn){
								me._doMix(obj, mix);
//							}
						}else if(typeof mix === "string"){
//							if(!obj.hasMixin(mix)){
								me._mixinAdded(obj, mix);
								mix = Firebrick.get(mix);
								if(!mix){
									new Error("unable to find mixin", obj.mixins);
								}
								me._doMix(obj, mix);
//							}
						}
						return mix;
					};
					
					if($.isArray(clazz.mixins)){
						for(var i = 0, l = clazz.mixins.length; i<l; i++){
							clazz.mixins[i] = mixit(clazz, clazz.mixins[i]);
						}
					}else{
						clazz.mixins = mixit(clazz, clazz.mixins);
					}
				}
				return clazz;
			},
			
			/**
			 * @method mixinAdded
			 * @param name {String}
			 * @return clazz {Object}
			 */
			_mixinAdded: function(clazz, name){
				var me = this;
				if(!clazz._mixins){
					clazz._mixins = {};
				}
				clazz._mixins[name] = 1;
				return me;
			},
			/**
			 * @method hasMixin
			 * @param name {String}
			 * @return {Boolean}
			 */
			hasMixin: function(clazz, name){
				var me = clazz;
				return !(!me._mixins || !me._mixins[name]);
			},
			
			/**
			 * @private
			 * @method _doMix
			 * @param obj {Object} core class
			 * @param mix {Object} mixin to mix into the core class (obj}
			 */
			_doMix: function(obj, mix){
				//mix._mixedIn = true;	//mark as mixed in - extra safety measure
				return Firebrick.utils.copyover(obj, mix);
			},
			
			/**
			* define a firebrick class
			* @method define
			* @param name {String}
			* @param config {Object} optional
			* @return {Object} the newly created class - only if called synchronously
			*/
			define: function(name, config){
				var me = this,
					_super, 
					url,
					ext = config.extend,
					args = arguments;
			    
			    if(ext){
			        _super = me.get(ext);
			        if(!_super){
			        	url = me.getSNameConfig(ext).path || require.toUrl(Firebrick.utils.getPathFromName(ext));
			        	console.warn(url, "is being loaded on demand, try preloading it before hand for better performance:", ext);
			        	require([url], function(){
			        		me._define.apply(me, args);
			        	});
			        }else{
			        	return me._define.apply(me, args);
			        }
			    }else{
			    	return me._define.apply(me, args);
			    }
			},
			
			/**
			* do not call directly... call Firebrick.define()
			* @private
			* @method define
			* @param name {String}
			* @param config {Object} optional
			* @return {Object} the newly created class
			*/
			_define: function(name, config){
				var me = this,
					clazz,
					_super,
					ext = config.extend;

				if(ext){
					_super = me.get(ext);
			        if(!_super){
			        	console.error("unable load super class", ext, "for class", name);
			        }
			        clazz = me.extend(config, _super);
			    }else{
			        clazz = config;
			    }
			    
			    clazz = me._initMixins(clazz, name);
			    
			    if(name){
					clazz._classname = name;
					//check if not a temporary class: Firebrick.create({...})
					if(!clazz.fbTmpClass){
						me._classRegistry[name] = clazz;
				    	if(clazz.hasOwnProperty("sName") && clazz.sName){
				    		//also sName
				    		me._classRegistry[clazz.sName] = clazz;
				    	}
					}
				}
			    
			    if(clazz.constructor){
			    	clazz.constructor(name);
			    }
			    
			    return clazz;
			},
			
			/**
			 * overwrite a class with new properties - uses Firebrick.utils.overwrite
			 * @method overwrite
			 * @param name {String}
			 * @param properties {Object}
			 * @return Overwritten {Object}
			 */
			overwrite: function(name, properties){
				return Firebrick.utils.overwrite(Firebrick.get(name), properties);
			}
		},
		/**
		 * @for Firebrick
		 * @class Controllers
		 */
		controllers:{
			/**
			 * shorthand method. Same as calling Firebrick:create, however it sets the extend value on the config to "Firebrick.controller.Base" automatically
			 * @method createController
			 * @param name {String}
			 * @param config {Object} optional
			 * @return {Object} class
			 */
			createController: function(name, config){
				config = config || {};
				if(typeof name !== "string"){
					name = "tmp" + Firebrick.utils.uniqId();
					config.fbTmpClass = true;
				}
				config.extend = "Firebrick.controller.Base";
				return Firebrick.create(name, config);
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Templates
		 */
		templates:{
			/**
			 * General loading tpl - override to change the loading mask
			 * Bootstrap is needed for this to work
			 * @property loadingTpl
			 */
			loadingTpl: "<div class='fb-view-loader'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>",
		},
		/**
		 * @for Firebrick
		 * @class Views
		 */
		views: {
			/**
			 * used by Firebrick.Boot:prepApplication to render the "view/Index.html" when autoRender is true
			 * @private
			 * @event viewReady
			 * @method bootView
			 * @param {Object} options
			 * @param {Object} options.viewData to pass to the view Store parameter
			 */
			bootView: function(options){
				Firebrick.utils.clearSplash();
				return Firebrick.createView(Firebrick.app.name + ".view.Index", {
					target:options.target || "body", 
					store:options.viewData, 
					async:true,
					listeners:{
						"ready": function(){
							Firebrick.fireEvent("viewReady", this);
						}
					}
				});
			},
			
			/**
			* Create and render a view (shorthand function)
			* @method createView
			* @example 
			* 	createView({...})
			* @example 
			* 	createView("MyApp.view.MyView")
			* @example
			* 	createView("MyApp.view.MyView", {...})
			* @param name {String} example: "MyApp.view.MyView"
			* @param config {Object} (optional) object to config the View class with
			* @return {Object} Firebrick.view.Base class
			*/
			createView: function(name, config){
				if(name && !config){
					if($.isPlainObject(name)){
						//one parameter passed
						//createView({
						// ...
						//})
						config = name;
						name = "tmp-" + Firebrick.utils.uniqId();
						config.fbTmpClass = true;
					}else{
						//createView("MyView")
						config = {};
					}
				}
				config = this._basicViewConfigurations(config);
				return Firebrick.create(name, config);
			},
			
			
			/**
			* Note: different to Firebrick.define() for classes -
			* Firebrick.defineView, defines and fetches if not already loaded the given view by name
			* @method defineView
			* @param name {String} name of the view to me shown "MyApp.view.MyView"
			* @param config {Object} (optional) object to config the View class with
			* @return {Object} Firebrick.view.Base class
			*/
			defineView: function(name, config){
				var me = this;
				config = me._basicViewConfigurations(config);
				return Firebrick.define(name, config);
			},
			/**
			 * initialise subviews of a view
			 * @private
			 * @method initSubViews
			 * @param view {Object}
			 * @return {Object} view passed
			 */
			initSubViews:function(view){
				var me = this,
					subViews = view.subViews;
				if(subViews){
					if($.isArray(subViews)){
						for(var i = 0, l = subViews.length; i<l; i++){
							view.subViews[i] = me._loadSubView(subViews[i]);
						}
					}else{
						view.subViews = me._loadSubView(subViews);
					}
				}
				
				return view;
			},
			
			/**
			 * used by initSubViews
			 * @private
			 * @method _loadSubView
			 * @param subView {Object}
			 * @return {Object} subView passed
			 */
			_loadSubView: function(subView){
				if(typeof subView === "string"){
					subView = Firebrick.createView(subView, {autoRender:false});
				}else if($.isPlainObject(subView)){
					if(subView.isView){
						if(subView._state === "unbound"){
							subView = subView.render();
						}else{
							var a = Firebrick.createView(subView._classname);
							subView = a;
							Firebrick.classes._classRegistry[subView._classname] = a;
						}
						
					}
				}
				return subView;
			},
			/**
			* Basic view configurations when defining/creating a view with shorthand function calls
			* @private
			* @method _basicViewConfigurations
			* @param config {Object} (optional)
			* @return {Object}
			*/
			_basicViewConfigurations: function(config){
				config = config || {};
				if(!config.extend){
					config.extend = "Firebrick.view.Base";
				}
				return config;
			},
			/**
			* jQuery body object (cache) - is set initally by {{crossLink Firebrick.views:getBody}}{{/crossLink}}
			* @private
			* @property _body
			* @type {Object} jquery object
			*/
			_body: null,
			/**
			* Shortcut to get jQuery("body")
			* @method getBody
			* @param refresh {Boolean} [default=false] (optional) if true gets the body object fresh from dom and not from cache
			* @return {Object} jquery object
			*/
			getBody: function(refresh){
				var me = this;
				if(refresh === true || !me._body){
					me._body = $("body");
				}
				return me._body;
			},
			/**
			* find the target using a selector - same as jQuery(selector)
			* @method getTarget
			* @param selector {String, jQuery Object}
			* @return {Object, Null} jquery object || null
			*/
			getTarget: function(selector){
				var a = selector && selector.jquery ? selector : $(selector);
				return a.length > 0 ? a : null;
			},
			/**
			* Render HTML or Template to the given target
			* @private
			* @method renderTo
			* @param target {jQuery Object}
			* @param html {String} template or html
			* @param append {Boolean} [default=false] if true will append to instead of overwriting content of target
			* @param options {$.show ( options )} arguments - optional
			* @return {jQuery Object} target
			*/
			renderTo:function(target, html, append, options){
				var $content = $(html);
				$content.hide();
				if(append === true){
					target.append( $content );
				}else{
					target.html( $content );
				}
				return $content.show( options );
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Boot
		 */
		boot:{
			/**
			 * used by Firebrick:ready
			 * @method prepApplication
			 * @private
			 * @param {Object} options
			 * @param {Object} options.cache
			 * @param {Object} options.dev
			 * @param {Object} options.lang
			 * @param {Object} options.autoRender
			 */
			prepApplication: function(options){
				if(options.cache === false){
					require.config({
					    urlArgs: "fb=" + (new Date()).getTime()
					});
					$.ajaxSetup({cache: false});
				}
				
				if(options.dev){
					requirejs.onError = function (err) {
					    
					    if (err.requireType === 'timeout') {
					        console.log('modules: ' + err.requireModules);
					    }else{
					    	console.error(err.message);
					    	console.error(err.text);
					    	console.error(err.requireMap);
					    	console.error(err.stack);
					    	new Error(err);
					    }

					};
				}
				
				if(options.lang){
					Firebrick.languages.init(options.lang);
				}
				
				if(options.autoRender !== false){
					Firebrick.views.bootView(options);
				}
				
			}
		},
		/**
		 * @for Firebrick
		 * @class Utils
		 */
		utils:{
			/**
			 * keep track of all require requests
			 * @property requiredFiles
			 * @private
			 * @type {Object} map
			 */
			requiredFiles:{},
			/**
			 * keep track of all the interval functions running
			 * @private
			 * @property intervalRegistry
			 * @type {Object} map
			 */
			intervalRegistry:{},
			/**
			 * used by init&Clear Splash
			 * @private
			 * @property splashCleared
			 * @type {Object} map
			 */
			splashCleared: false,
			/**
			 * html is appended to the $("html") tag before the document is ready 
			 * used by Firebrick:ready
			 * @example 
					Firebrick.ready({
						splash:"<div></div>"
					});
			 * @method initSplash
			 * @private
			 * @param {String} html
			 */
			initSplash: function(html){
				var me = this;
				Firebrick.delay(function(){
					if(!me.splashCleared){
						$("html").append("<div id='fb-splash'>" + html + "</div>");
					}
				}, 1);
			},
			/**
			 * removes splash tag $("#fb-splash")
			 * @private
			 * @method clearSplash
			 */
			clearSplash: function(){
				this.splashCleared = true;
				$("#fb-splash").remove();
			},
			/**
			 * shortcut for knockout.dataFor
			 * @method dataFor
			 * @return knockout.dataFor
			 */
			dataFor: function(){
				return ko.dataFor.apply(ko, arguments);
			},
			/**
			 * returns a deep property from an object
			 * fails silently and returns null
			 * 
			 * 
			 * @example 
			 * //get property "where.street"
			 * obj = {
			 * 		where: {
			 *			street: "Some Street" 	
			 *		}
			 * }
			 * @method getDeepProperty
			 * @param {String} property
			 * @param {Object} obj
			 * @return {Any|null} property value
			 */
			getDeepProperty: function(prop, obj){
				var me = this,
					it,
					bits = prop.split("."),
					value = obj;
				
				
				for(var i = 0, l = bits.length; i<l; i++){
					it = bits[i];
					if( value.hasOwnProperty( it ) ) {
						value = value[ bits[i] ];	
					}else{
						value = null;
						break;
					}
				}
				
				return value;
			},
			/**
			 * multidimensional array comparison
			 * inspired by: http://stackoverflow.com/a/14853974/425226
			 * @method compareArrays
			 * @param array1
			 * @param array2
			 * @return {Boolean} true is they are identical
			 */
			compareArrays: function(array1, array2){
				var me = this,
					it1, it2;
				
				//check lengths
				if(array1.length !== array2.length){
					return false;
				}
				
				for(var i = 0, l = array1.length; i<l; i++){
					it1 = array1[i];
					it2 = array2[i];
					
					if(typeof it1 !== typeof it2){
						return false;
					}else{
						if(it1 instanceof Array && it2 instanceof Array){
							if(!me.compareArrays(it1, it2)){
								return false;
							}
						}else if( it1 !== it2 ){
							return false;
						}
					}
				}
				
				return true;
			},
			/**
			* overwrite properties in {obj1} with properties from {obj2} (mixin)
			* @method overwrite
			* @param obj1 {Object}
			* @param obj2 {Object}
			* @return {Object} obj1 mixed in with obj2
			*/
			overwrite: function(obj1, obj2){
				var k;
				//iterate over all properties in obj2
				for(k in obj2){
					if(obj2.hasOwnProperty(k)){
						obj1[k] = obj2[k];
					}
				}
				
				return obj1;
			},
			/**
			 * unlike overwrite it does not overwrite any properties that are already in obj1
			 * @method copyover
			 * @param obj1 {Object}
			 * @param obj2 {Object}
			 * @return {Object} obj2 mixed in missing property into obj1
			 */
			copyover: function(obj1, obj2){
				//iterate over all properties in obj2
				var k;
				for(k in obj2){
					if(obj2.hasOwnProperty(k) && !obj1[k]){
						obj1[k] = obj2[k];
					}
				}
				
				return obj1;
			},
			/**
			 *  recursively iterate over prototypes and merge all the properties of an object together from its inherited parents for a specified property (name)
			 *  @private
			 *  @method merge
			 *  @param propName {String} name of property to merge
			 *  @param object {Object} object/class to iterate through
			 *  @param a {Object} (optional) used when calling itself recursively
			 *  @example 
			 *  		merge("a", {a:{a:"s"},__proto__:{a:{a:1, b:2, c:3}}})
			 *  		//returns {a:{a:"s", b:2, c:3},__proto__:{a:{a:1, b:2, c:3}}}
			 *  @return {Object} object : same object with property (name) merged
			 */
			merge:function(propName, object, a){
				var me = this,
					proto = Object.getPrototypeOf(a || object);
				
				if(proto.hasOwnProperty(propName)){
					
					var k,v, p = proto[propName];
					
					for(k in p){
						if(p.hasOwnProperty(k)){
							v = p[k];
							if(!(k in object[propName])){
								object[propName][k] = v;
							}
						}
					}
					
					//mixin deeper (recursive)
					me.merge(propName, object, proto);
				}else if(Object.getPrototypeOf(proto)){
					me.merge(propName, object, proto);
				}
				
				return object;
			},
			
			/**
			*	Javascript setTimout function
			* @example
			* 	delay(function(){}, 1000, scope);
			* @method delay
			* @param callback {Function}
			* @param timeout {Integer} miliseconds
			* @param args {any} pass to delay function
			* @param scope {Object} (optional) scope of the callback function. Defaults to: window
			*/
			delay: function(callback, timeout, args, scope){
				window.setTimeout(function(args1){
					callback.apply(scope || this, args1);
				}, timeout, args);
			},
			/**
			 * clear the interval running by id
			 * @method clearInterval
			 * @param id {String}
			 */
			clearInterval:function(id){
				var me = this,
					func = me.intervalRegistry[id];
				if(func){
					window.clearInterval(func.intId);
					delete this.intervalRegistry[id];
				}
			},
			/**
			 * set an interval and prevent any duplicates
			 * @method setInterval
			 * @param id {String} (optional)
			 * @param callback {Function} - callback gets this.id, this.stop()
			 * @param timeout {Integer} miliseconds
			 * @param scope {Object} scope to apply to the callback
			 */
			setInterval: function(){
				var me = this,
					fArg = arguments[0],
					id = $.isFunction(fArg) ? fArg.id : fArg,
					newId;
				
				if(!me.isIntervalRunning(id)){
					if($.isFunction(fArg)){
						newId = me._applyInterval(null, arguments[0], arguments[1], arguments[2]);
					}else{
						newId = me._applyInterval.apply(this, arguments);
					}
				}
				
				return newId;
			},
			/**
			 * use Firebrick.utils:setInterval()
			 * @method _applyInterval
			 * @private 
			 * @param id {String} (optional)
			 * @param callback {Function}
			 * @param interval {Interger}
			 * @param scope {Object}
			 * @return id {String}
			 */
			_applyInterval: function(id, callback, interval, scope){
				var me = this;
					id = id || me.uniqId();
				
				var f = function(){
					callback.id = id;
					callback.stop = function(){
						me.clearInterval(id);
					};
					callback.apply(scope || callback, arguments);
				};
				
				//start the interval
				f.intId = window.setInterval(f, interval);
				
				//register the interval function
				me.intervalRegistry[id] = f;
				//return the id
				return id;
			},
			/**
			 * Check whether interval already exists
			 * @method isIntervalRunning
			 * @param id {String}
			 * @return {Object} interval function
			 */
			isIntervalRunning: function(id){
				return !!this.intervalRegistry[id];
			},
			
			/**
			 * 
			 * @example 
			 * 		var a = function(){
			 * 			//arguments are [["a"]]
			 * 			return stripArguments(arguments) //return ["a"]
			 * 		}
			 * 		var b = function(){
			 * 			return a(arguments); //note not called with apply
			 * 		}
			 *		b("a")
			 * used to strip the arguments "array" inside an wrapper "array" - http://jsfiddle.net/smasala/ppdtLmag/
			 * @method stripArguments
			 * @param args {Object}
			 * @return {Object}
			 */
			stripArguments:function(args){
				if ($.isPlainObject(args) && $.isNumeric(args.length) && args.hasOwnProperty("callee")) {
					//convert the arguments array back to a simple array
					if (args.length) {
						args = args[0];
					}
				}
				return args;
			},
			/**
			 * @method mergeArrays
			 * @param {Array | Argument Arrays} any number - ignores null
			 * @return {Array}
			 */
			mergeArrays: function(){
				var me = this,
					it,
					newArr = [],
					args = me.argsToArray( arguments );
				
				for(var i = 0, l = args.length; i<l; i++){
					it = args[i];
					if( it !== null){
						newArr = newArr.concat( me.stripArguments( it ) );	
					}
				}
				
				return newArr;
			},
			/**
			 * convert arguments array to nomral array
			 * @method argsToArray
			 * @param args {Arguments Array}
			 * @return {Array}
			 */
			argsToArray: function( args ){
				return Array.prototype.slice.call( args );
			},
			/**
			* Get a script/file from path
			* @example 
			* 	require("MyApp.controller.MyController", function(){}, true, "html", "js");
			* @method require
			* @param name {String, Array of Strings} MyApp.controller.MyController
			* @param callback {Function} (optional) called when last require has completed or failed
			* @return {Array of Strings} the files that were eventually loaded
			*/
			require: function(names, callback){
				
				//if not defined, set an empty function as callback
				callback = callback || function(){};
				//make sure names is an array
				names = $.isArray(names) ? names : [names];
				
				//use requirejs to call the files
				require(names, callback);
				
				return names;
			},
			
			/**
			* Converts a name like "MyApp.controller.MyController" to a path MyApp/controller/MyController.js
			* @private
			* @method getPathFromName
			* @param name {String}
			* @param ext {String} [default='']
			* @return {String}
			*/
			getPathFromName: function(name, ext){
				var	appName = Firebrick.app.name;
        
					ext = ext || "";
				
				name = name.trim();
				
				if(name.indexOf(".") > 0){
					//check if the appName is found at the beginning
					if(name.indexOf(appName) === 0){
						//remove appName from path
						name = name.replace(appName, "");
						//replace all . with /
						return appName + name.replace(/\./g, "/") + (ext ? "." + ext : "");
					}
				}
				
				return name;
			},
			/**
			* @property _globalC
			* @private
			*/
			_globalC: 1,
			/**
			 * returns a unique id: http://stackoverflow.com/a/19223188
			 * @method uniqId
			 * @return {String} unique id
			 */
			uniqId: function() {
				var me = this,
					d = new Date(),
					m = d.getMilliseconds() + "",
					u = ++d + m + (++me._globalC === 10000 ? (me._globalC = 1) : me._globalC);

				return u;
			},
			/**
			 * load css file and append to HEAD
			 * @method loadCSS
			 * @param {String} url
			 */
			loadCSS: function(url) {
			    var link = document.createElement("link");
			    link.type = "text/css";
			    link.rel = "stylesheet";
			    link.href = url;
			    document.getElementsByTagName("head")[0].appendChild(link);
			},
			
			/**
			 * @method firstToUpper
			 * @param str {String}
			 * @return {String} first character in string uppercase
			 */
			firstToUpper: function( str ){
				 return str.charAt(0).toUpperCase() + str.slice(1);
			}
		},
		/**
		 * @for Firebrick
		 * @class Languages
		 */
		languages:{
			/**
			 * use get/setLang() to change the language
			 * @property lang
			 * @private
			 * @type {ko.observable}
			 * @default ko.observable("en")
			 */
			lang: ko.observable("en"),
			/**
			 * store of keys ko.observale
			 * @private
			 * @property keys
			 * @type {ko.observable}
			 * @default ko.observable({})
			 */
			keys:ko.observable({}),
			/**
			 * initial the language keys
			 * @example
			 * 	Firebrick.ready({lang:...}) //to set language
			 * @private
			 * @method
			 * @param lang {String, Store} string = url to load
			 */
			init:function(lang){
				var me = this;
				if(typeof lang === "string"){
					Firebrick.createStore({
						url:lang,
						autoLoad:false,
					}).load({
						callback:function(){
							me.keys(this.getData());
						}
					});
				}else if(lang.isStore){
					me.keys(lang.getData());
				}else if($.isPlainObject){
					me.keys(lang);
				}else{
					console.error("unable to load languages", lang);
				}
			},
			
			/**
			 * get text by its key (case sensitive)
			 * @method getByKey
			 * @param key {String}
			 * @return {String}
			 */
			getByKey: function(key){
				var me = this,
					a;
				
				key = $.isFunction(key) ? key() : key;
				a = me.keys()[me.lang()];
				
				return a && a[key] ? ($.isFunction(a[key]) ? a[key]() : a[key]) : key;
			},
			/**
			 * set the app language
			 * @method setLang
			 * @param langKey {String}
			 */
			setLang: function(langKey){
				this.lang(langKey);
			},
			/**
			 * get Lang as string
			 * @method getLang
			 * @return {String}
			 */
			getLang: function(){
				return this.lang();
			},
			/**
			 * available langages
			 * @method allLanguages
			 * @return {Array of Strings} all possible languages
			 */
			allLanguages: function(){
				var me = this,
					langs = [],
					data = ko.mapping.toJS(me.keys),
					l;
				
				for(l in data){
					if(data.hasOwnProperty(l)){
						langs.push(l);
					}
				}
				
				return langs;
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Events
		 */
		events: {
			/**
			* Event registry
			* @private
			* @property eventRegistry
			* @type {Object} map
			*/
			_eventRegistry: {},
			/**
			* add a listener to a specific event by name
			* @example 
			* 		addListener("myEvent", myFunction(){}, this);
			* @example
			* 		addListener({
						"myEvent": function(){},		
						"event1, event2": function(){},
						"mySecondEvent": function(){},
						scope: this
					})
			* @method addListener
			* @param eventName {String, Object}
			* @param callback {Function}
			* @param scope {Object} (optional) scope in which the listener is fired in
			* @return {Function} the function with the assigned callbackId;
			*/
			addListener: function(eventName, callback, scope){
				var me = this,
					ev;
				
				if($.isPlainObject(eventName)){
					return me._addListener(eventName);
				}
				
				if(!callback.conf){
					callback.conf = {};
					callback.conf.callbackId = Firebrick.utils.uniqId();
				}else{
					//already registered
					return callback;
				}
				
				callback.conf.scope = scope;
				
				eventName = eventName.split(",");
				
				for(var i = 0, l = eventName.length; i<l; i++){
					ev = eventName[i].trim();
					if(!me._eventRegistry[ev]){
						//no listeners under this event name yet
						me._eventRegistry[ev] = [];
					}
					
					me._eventRegistry[ev].push(callback);
				}
				
				return callback;
			},
			/**
			* Use Firebrick.events:addListeners
			* @private
			* @method _addListener
			* @example
			* 	 addListeners_internal({
					"myEvent": function(){},
					"mySecondEvent": function(){},
					scope: this
				})
			* @param {Object} object
			*/
			_addListener: function(object){
				var me = this, 
					scope = object.scope,
					eventName;
				
				delete object.scope;
				
				for(eventName in object){
					if(object.hasOwnProperty(eventName)){
						me.addListener(eventName, object[eventName], scope);
					}
				}
				
			},
			/**
			* remove listener by eventName and function
			* @example
			* 		removeListener("myEvent", function);
			* @method removeListener
			* @param eventName {String}
			* @param funct {Function} (optional) if non given will remove all listeners for event
			*/
			removeListener: function(eventName, funct){
				var me = this, 
					reg = me._eventRegistry[eventName],
					tmp;
				
				//check if any events are found for the given eventName
				if(reg && reg.length){
					//was a function passed as an argument?
					if(funct){
						//does the function have a callbackId?
						if(funct.conf.callbackId){
							//filter the event registry array
							tmp = reg.filter(function(func){
									//this is not the function that is to be removed
									if(func.conf.callbackId !== funct.conf.callbackId){
										return true;
									}
									
									//this is the function that should be removed
									return false;
								});
							
							//all functions were removed
							if(tmp.length === 0){
								//remove the event registry
								delete me._eventRegistry[eventName];
							}else{
								//replace the registry with the filtered results
								me._eventRegistry[eventName] = tmp;
							}
						}else{
							console.warn("No callbackId for function whilst trying to remove listener");
						}
					}else{
						delete me._eventRegistry[eventName];
					}
				}else{
					console.warn("Unable to remove listener. No events found for:", eventName);
				}
			},
			/**
			* Fire an event by name
			* @example 
			* 		fireEvent("eventToFire", 1, "test", false);
			* @method fireEvent
			* @param eventName {String}
			* @param arguments {Any...} arguments passed to event when fired
			*/
			fireEvent: function(eventName){
				var me = this, 
					reg = me._eventRegistry[eventName],
					args,
					ev,
					eventObject = me._initEventObject(eventName);
				
				if(reg){
					//get the argument from this function call
					args = Array.prototype.slice.call(arguments);
					ev = me.createEventData(eventName);	//create an event object to pass to the function argument

					args.shift(); //remove the eventName from argument
					
					for(var i = 0, l = reg.length; i<l; i++){
						var f = reg[i];
						//copy the function config created by addListener into the event argument and the function itself
						ev.conf = f.conf;
						ev.funct = f;
						//place the event object as the first item in arguments list
						args.unshift(ev);
						//add event object to stop
						f.event = eventObject;
						//call the event with the new arguments
						f.apply(f.conf.scope || window, args);
					}
				}
				
				return eventObject;
			},
			
			/**
			 * this object is passed to all fireEvent listeners
			 * @method _initEventObject
			 * @private
			 * @param name {String} event name
			 * @return {Object}
			 */
			_initEventObject: function(name){
				return {
					eventName: name,
					preventDefault: false,
					data: null
				};
			},
			
			/**
			* creates the event object to be passed as argument when event is fired
			* @method createEventData
			* @private
			* @param eventName {String}
			* @return {Object} event object
			*/
			createEventData: function(eventName){
				var me = this, ev = {
					event: eventName, 
					conf: null,
					/**
					* removes the listener it called from within
					* @example
					* @method removeSelf
					* 		event.removeSelf();
					*/
					removeSelf: function(){
						me.removeListener(eventName, ev.funct);
					}
				};
				
				return ev;
			},
			/**
			* Define events and their callbacks, similar to $(selector).on(eventname, callback)
			* @example
			* 		on("click", "a.mylink", function(){}, newScope)
			* @example 
			* 		on({
						"a.link":{
							click:function(){},
							mouseover:function(){}
						},
						"a, button":{
							click: function(){}
						}
						scope:this
					})
			* @method on
			* @param eventName {String, Object} string =  same as jquery selector(s)
			* @param selector {String} (optional) use if first arg is not an object
			* @param callback {Function} (optional) use if first arg is not an object
			* @param scope {Object} (optional) change scope on callback function use if first arg is not an object
			*/
			on: function(eventName, selector, callback, scope){
				var me = this;
				//if the eventName is an object
				if($.isPlainObject(eventName)){
					return me._on(eventName);
				}
				//register single event
				return me._registerOnEvent(eventName, selector, callback, scope);
			},
			/**
			* Makes use of the jQuery .off() function
			* @example
			* 		off( "click", "#theone", function(){} )
			* @method
			* @param selector {String}
			* @param eventName {String}
			* @param callback {Function} the function used in on()
			*/
			off: function(eventName, selector, callback){
				if(callback.offFunc){
					$(document).off(eventName, selector, callback.offFunc);	
				}
			},
			/**
			* use Firebrick.events:on
			* @example 
			* 		_on({
							"a.link":{					
								click:function(){},
								mouseover:function(){}
							},
							"a, button": {
								click: function(){}
							}
							scope:this
						}
			* @method _on
			* @param {Object} object
			* @private
			*/
			_on: function(object){
				var me = this, 
					scope = object.scope, 
					selector, 
					eventName,
					events;
				
				delete object.scope;
				
				for(selector in object){
					if(object.hasOwnProperty(selector)){
						events = object[selector];
						for(eventName in events){
							if(events.hasOwnProperty(eventName)){
								me._registerOnEvent(eventName, selector, events[eventName], scope);
							}
						}
					}
				}
				
			},
			/**
			* use Firebrick.events:on
			* @method _registerOnEvent
			* @private
			*/
			_registerOnEvent: function(eventName, selector, callback, scope){
				var func = function(){
						//add scope as last argument, just in case the scope of the function is changed
						var args = Array.prototype.slice.call(arguments);
						args.push(this);
						this.destroy = function(){
							Firebrick.events.off(eventName, selector, callback);
						};
						callback.apply(scope || this, args);
					};
				
				//needed for off() - set outside function, in case the event is called before it is fired
				callback.offFunc = func;
				
				eventName = eventName.split(",");	//convert to array
				
				for(var i = 0, l = eventName.length; i<l; i++){
					$(document).on(eventName[i].trim(), selector, func);	
				}
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Data
		 */
		data: {
			/**
			 * @for Data
			 * @namespace Data
			 * @class Store
			 */
			store: {
				/**
				* creates a new Firebrick.store.Base store to be used OR if a name and config are supplied, then Firebrick.create() is called
				* @example
				* 		//creates a new class Firebrick.store.Base to be used
				* 		createStore({
							data:{name:"bob"}
						}); 
				* @example 
				* 		createStore("MyApp.store.MyStore", {}); //Firebrick.create() is called
				* @example 
				* 		createStore() //returns a Store class to be used
				* @method createStore
				* @param name {String} if string, then Firebrick:create is called
				* @param config {Object} data to config the class with - called in conjuction when name is set
				* @return {Object} Firebrick.store.Base
				*/
				createStore:function(name, config){
					var me = this; 
					
					//name is a string - hence the user is looking to create an actual defined store
					if(typeof name === "string"){
						//return the created class
						var clazz = Firebrick.get(name);
						if(clazz){
							clazz = Firebrick.classes.extend(config, clazz);
							clazz.init();
						}else{
							config = me._basicStoreConfigurations(config);
							clazz = Firebrick.create(name, config);
						}
						return clazz;
					}else{
						//only 1 parameter in this case, name is then config.
						config = name || {};
						config = me._basicStoreConfigurations(config);
						name = "tmp-" + Firebrick.utils.uniqId();
						config.fbTmpClass = true;
						//return a new object based on the Base class
						return Firebrick.create(name, config);
					}
				},
				/**
				* Basic view configurations when defining/creating a view
				* @private
				* @method _basicStoreConfigurations
				* @param config {Object} (optional)
				* @return {Object}
				*/
				_basicStoreConfigurations: function(config){
					config = config || {};
					if(!config.extend){
						config.extend = "Firebrick.store.Base";
					}
					return config;
				},
				/**
				* Used by Firebrick.store.Base:load
				* GET
				* @private
				* @method _loadStore
				* @param store {Object} Firebrick.store.Base object
				* @param {Object} options 
				* @param {Boolean} options.async [default=store.async] 
				* @param {Function} options.callback [store, jsonObject, status, response]
				* @param {Function} options.error [response, error, errorMessage]
				* @param {Object} options.scope
				* @return {Object} store
				*/
				_loadStore: function(store, options){
					var url = store.url,       
						async,
						ajaxData;
					
					options = options || {};
					async = options.async;
					
					if($.isFunction(options)){
						//a single argument was passed and that was a function (callback)
						options = {
							callback: options
						};
					}
					
					if(typeof async !== "boolean"){
						async = store.async;
					}
						
					if($.isPlainObject(url)){
						url = url.get;
					}					
					
					store.status = "preload";
					ajaxData = options.params || store.params;
					$.ajax({
						dataType: store.datatype,
						type: store.loadProtocol,
						async: async,
						url: store.getUrl(),
						data: store.stringifyData ? { data: JSON.stringify(ajaxData) } : ajaxData,
						success:function(jsonObject, status, response){
							store.setData(jsonObject);
							store.status = status;
							if($.isFunction(options.callback)){
								options.callback.call(options.scope || store, jsonObject, status, response);
							}
						},
						error:function(response, error, errorMessage){
							if($.isFunction(options.error)){
								options.error.call(options.scope || store, response, error, errorMessage);
							}else{
								console.warn("unable to load store '", store._classname, "' with path:", store.url);
								console.error(response, error, errorMessage);
							}
						}
					});
					
					return store;
				},
				/**
				* Submit the given store with its data to the specified url
				* POST
				* @private
				* @method _submit
				* @param store {Object} //Firebricks.store.Base class
				* @param callback {Function} (optional) function to call on store submission success
				* @return {Object} store
				*/
				_submit: function(store, callback){
					var ajaxData;
					
					if(store && store.url && store.url.submit){
						
						store.status = "presubmit";
					
						ajaxData = store.toPlainObject();
						$.ajax({
							url: store.getUrl("submit"),
							data: store.stringifyData ? { data: JSON.stringify(ajaxData) } : ajaxData,
							type: store.submitProtocol,
							beforeSend: function(){
								return store.fireEvent("beforeSubmit", store, ajaxData);
							},
							success: function(data, status){
								store.status = status;
								if(callback){
									callback.apply(store, arguments);
								}
							},
							error: function(response, error, errorMessage){
								console.error("error submitting data for store to url", store.url.submit, store);
								console.error(response, error, errorMessage);
							}
						});
					}else{
						console.error("unable to submit store, no submit path found (url.submit)", store);
					}
					
					return store;
				},
				
			}
		},
		/**
		 * @for Firebrick
		 * @class Router
		 */
		router:{
			
			/**
			 * @property _routes
			 * @private
			 * @type {Array}
			 * @default []
			 */
			_routes:{},
			/**
			 * convert route urls to regex
			 * @method _convertToRegex
			 * @param routes {Object Map}
			 * @private
			 * @return {Object}
			 */
			_convertToRegex: function( routes ){
				var regRoutes = {},
					map,
					regex;
				
				//example url:      /users/:surname/:age
				
				for(var key in routes){
					if(routes.hasOwnProperty(key)){
						map = routes[key];
						regex = key;
						/*
						 * replace all * with the correct regex 
						 * thanks to: http://stackoverflow.com/a/15275806/425226
						 */
						regex = regex.replace("*", ".*?");
						/*
						 * convert all : params in url with regex
						 * /users/:surname/:age => /users/[a-z0-9._-]+/[a-z0-9._-]+
						*/ 
						regex = regex.replace(/:[a-zA-Z0-9._-]*/ig, "[a-zA-Z0-9._-]+");
						/*
						 * /users/[a-z0-9._-]+/[a-z0-9._-]+  =>   ^\/users\/[a-z0-9._-]+\/[a-z0-9._-]+$
						 */
						regex = "^" + regex.replace(/\//g, "\\/") + "$";
						
						if( $.isFunction(map) ){
							map = {
								callback: map
							}
						}
						
						map.path = key;	//original path as defined by set()
						
						regRoutes[regex] = map;
					}
				}
				
				return regRoutes;
			},
			/**
			 * @method _set
			 * @private
			 * @param routes {Object Map}
			 */
			_set: function( routes ){
				var me = this;
				
				if( $.isFunction(routes) ){
					//convert to object
					routes = {
						"*": routes
					};
				}
				
				if( $.isPlainObject(routes) ){
					
					Firebrick.router._routes = Firebrick.utils.overwrite( 
													Firebrick.router._routes, 
													me._convertToRegex( routes )
											);
				}else{
					console.error("incorrect routes", routes);
					return;
				}
				
				
				return routes;
			},
			/**
			 * @method match
			 * @param href {String}
			 * @return match or null
			 */
			match: function( href ){
				var me = this,
					routes = me._routes,
					url = href,
					hashPos = href.indexOf("#"),
					urlParams = href.indexOf("?"),
					hash = hashPos >= 0 ? href.substr( hashPos ) : null,
					match = null;
				
				//following only valid when history api active
				if( me.history._initialised && hash ){
					href = href.substr(0, hashPos);
				}
				
				if(urlParams !== -1){
					href = href.substr(0, urlParams);
				}
				
				for(var key in routes){
					if(routes.hasOwnProperty(key)){
						match = href.match(key);
						if(match){
							match = routes[key];
							break;
						}
					}
				}
				
				if(match){
					match.originalUrl = url;
				}
				
				return match;
			},
			/**
			 * @method _getParamsForMatch
			 * @private
			 * @param match {Object} return of me.match()
			 * @return {{map:{}, arr:[]}|Null} 
			 */
			_getParamsForMatch: function( match ){
				var url,
					matchUrl,
					it, val,
					params = {
						map:{},
						arr: []
					};
				
				if(match){
					url = match.originalUrl;
					matchUrl = match.path.split("/");
					url = url.replace( window.location.origin, "" );
					url = url.split("/");
					for(var i = 0, l = matchUrl.length; i<l; i++){
						it = matchUrl[i];
						if( it.indexOf(":") === 0){
							val = url[i];
							params.map[it.substr(1)] = val;
							params.arr.push( val );
						}
					}
					return params;
				}
			},
			
			_defaults: function(){
				var me = this,
					route = me.getRoute(),
					hash = route.hashbang ? route.parameters.scrollTo : route.hash;

				if(hash){
					me.scrollTo( hash );
				}
			},
			/**
			 * checks the callback function to see whether the parameter _defaults was declared for the function
			 * @method _hasParameterDefined
			 * @private
			 * @param callback {Function}
			 * @return {Boolean} 
			 */
			_hasParameterDefined: function( callback ){
				return callback.toString().match(/function *\( *[\D\d,]*(_defaults)/) ? true : false;
			},
			/**
			 * this function checks whether the callback has the method _defaults declared are a paramter.
			 * if not: the _defaults method is called after the callback is fired
			 * if yes: the _defaults method is passed to the callback as an argument, which must then be manually called
			 * used by callRoute()
			 * @method _routeCallback
			 * @private
			 */
			_routeCallback: function(callback, args){
				var me = this,
					res = true,
					dDefined,
					argsArr = [];
				
				if(callback){
					dDefined = me._hasParameterDefined( callback );
					
					if(!args.length){
						args = [];
					}
					
					if(dDefined){
						args[0] = Firebrick.utils.mergeArrays(args[0], [me._defaults.bind(me)]);	
					}
						
					for(var i = 0, l = args.length; i<l; i++){
						argsArr = Firebrick.utils.mergeArrays(argsArr, args[i]);
					}
					
					res = callback.apply(me, argsArr);
					
					if(!dDefined && res !== false){
						me._defaults();
					}
				}
				
			},
			/**
			 * @method callRoute
			 * @param url {String}
			 * @param args {Arguments Array}
			 */
			callRoute: function( url, args ){
				var me = this,
					deps,
					callback,
					params,
					match;

				match = me.match( url ) || me.match("404");
				
				if(match){
					
					params = me._getParamsForMatch( match );
					
					//are dependencies required to run this pattern
					if($.isPlainObject(match) && match.require){
						deps = match.require;
						
						if(!$.isArray(deps)){
							deps = [deps];	//convert to array if needed
						}
						
						require(deps, function(){
							//check if pattern has a callback and fire
							me._routeCallback( match.callback, [params.arr, arguments, args] );
						});
					}else{
						//no dependencies - just fire the callback
						
						//if object configuration
						if($.isPlainObject(match)){
							callback = match.callback;
						}else{
							//not object just a function defined
							callback = match;
						}
						
						me._routeCallback( callback, [args] );
					}
					
				}
				
			},
			/**
			 * @method scrollTo
			 * @param target {String} jquery selector
			 */
			scrollTo: function(target){
				var me = this,
					offset = Firebrick.scrollTopOffset,
					scrollContainer = $(Firebrick.scrollContainerSelector);
				
				if($.isFunction(offset)){
					offset = offset(target);
				}
				
				if(target){
					target = $(target);
					if(target.length){
						scrollContainer.animate({ scrollTop: target.offset().top - offset + scrollContainer.scrollTop() }, {
							duration: 1000,
							complete: function(){
								//finished
							}
						});
					}
				}
			},
			/**
			 * @for Router
			 * @namespace Router
			 * @class History
			 */
			history: {
				/**
				 * used to see whether document events for the history API have already been set
				 * @property _initialised
				 * @type {Boolean}
				 * @default false
				 */
				_initialised: false,
				/**
				 * set route definitions
				 * @example
				 * 		Firebrick.router.set({
				 * 			"users/abc": {
				 * 				require:["file1", "file2"],
				 * 				callback: function(){}
				 * 			},
				 * 			"contact": function(){}
				 * 			defaults: function(){}		//defaults pattern - fallback
				 * 		})
				 * @example
				 * 		Firebrick.router.set(function(){}) //call function regardless of route
				 * @method set
				 * @param routes {Object|Function} - if function then the function is called regardless of route
				 * @return routes function
				 */
				set: function(routes){
					var me = this;
				
					if(!me._initialised){
						//mark as set
						me._initialised = true;
						me._registerLinkEvent();
						me._registerPopEvent();
					}
					
					return Firebrick.router._set(routes);
				},
				/**
				 * used by init
				 * @method _registerLinkEvent
				 * @private
				 */
				_registerLinkEvent: function(){
					var me = this,
						origin = Firebrick.router.getRoute().origin;
					
					$(document).on("click", "a[href]:not([fb-ignore-router]):not([target]):not()", function(event){
						var $this = $(this),
							href = $this.attr("href"),
							external = (href.indexOf("http") === 0 && href.indexOf(origin) === -1),	//whether the link is external or internal 
							js = href.indexOf("javascript:") >= 0;
						
							if(!external && !js){
								event.preventDefault();
								me.location( href, arguments );	
							}
						
					});
				},
				/**
				 * similar to window.location
				 * @method location
				 * @param url
				 * @param args {Any Array} - optional - use to pass arguments to callRoute
				 */
				location: function( url, args ){
					var hash = url.indexOf("#") === 0,
						eventObj = Firebrick.fireEvent("router.pre.pushState", url);
					
					if(eventObj.preventDefault !== true){
						window.history.pushState(url, "", url);
						if(hash){
							if(url !== "#"){
								//more than just the has symbol
								Firebrick.router.scrollTo( url );											
							}
						}else{
							Firebrick.router.callRoute( url, args );
						}
						Firebrick.fireEvent("router.post.pushState", url);
					}
				},
				/**
				 * @method _registerPopEvent
				 * @private
				 */
				_registerPopEvent: function(){
					var me = this;
					window.addEventListener('popstate', function(popState){
						var pState = popState.state,
							eObj = Firebrick.fireEvent("router.pre.popState", popState),
							_routes = Firebrick.router._routes;
						if(eObj.preventDefault !== true){
							if(typeof pState === "string"){
								Firebrick.router.callRoute( pState, arguments );
								Firebrick.fireEvent("router.post.popState", pState);
							}else{
								console.warn("undefined popstate", pState);
							}
						}
					});
				}
				
			},
			/**
			 * @for Router
			 * @namespace Router
			 * @class Hashbang
			 */
			hashbang: {
				/**
				 * used to see whether document events for the history API have already been set
				 * @property _initialised
				 * @type {Boolean}
				 * @default false
				 */
				_initialised: false,
				/**
				 * set route definitions
				 * @example
				 * 		Firebrick.router.set({
				 * 			"users/abc": {
				 * 				require:["file1", "file2"],
				 * 				callback: function(){}
				 * 			},
				 * 			"contact": function(){}
				 * 			defaults: function(){}		//defaults pattern - fallback
				 * 		})
				 * @example
				 * 		Firebrick.router.set(function(){}) //call function regardless of route
				 * @method set
				 * @param routes {Object|Function} - if function then the function is called regardless of route
				 */
				set: function(routes){
					var me = this;
					Firebrick.router._set(routes);
					if(!me._initialised){
						me._initialised = true;
						me.onHashChange();
					}
				},
				
				/**
				* Call a function when the hash changes on the site
				* use Firebrick.route:set
				* @example
						Firebrick.router.onHashChange(function(){
							//something happens
						})
				* @private
				* @method onHashChange
				* @param callback {Function}
				* @param config {Object} config that was used for this callback - optional
				* @return {Object} jQuery object
				*/
				onHashChange: function(callback, config){
					return $(window).on("hashchange", function(){
						var eObj = Firebrick.fireEvent("router.pre.hashbang", config, arguments);
						if(eObj.preventDefault !== true){
							Firebrick.router.callRoute( Firebrick.router.getRoute().path, arguments );
							Firebrick.fireEvent("router.post.hashbang", config, arguments);
						}
					});
				}
				
			},
			
			/**
			 * call this after setting router.set({}) if you wish to do an immediate evaulation of url
			 * @method init
			 */
			init: function(){
				Firebrick.router.callRoute( Firebrick.router.getRoute().path );
			},
			
			/**
			* Check whether the url matches a pattern - removes any parameters in the url to check for a match
			* @example
			*		Firebrick.router.is("#/completed") // returns true or false
			* @example
			* 		Firebrick.router.is("/completed") // returns true or false
			* @method is
			* @param pattern {String}
			* @return {Boolean}
			*/
			is: function(pattern){
				var me = this,
					route = me.getRoute(),
					path = route.cleanHash;	//without parameters
				if(path){
					return path === pattern;
				}
				
				return route.path === pattern;
			},
			
			/**
			 * @method getRoute
			 * @return {Object} {
			 * 						href: "http://localhost/#/mypath/dayone?user=1",
			 * 						origin: "http://localhost"
			 * 						path: "/#/mypath/dayone?user=1",	// (href - origin)
			 * 						cleanPath: "/mypath/dayone",	//non hash routes
			 * 						hash: "#/mypath/dayone?user=1",		//window.location.hash
			 * 						cleanHash: "#/mypath/dayone"
			 * 						parameters:{}		//url parameter as object
			 * 					}
			 */
			getRoute: function(){
				var me = this,
					location = window.location,
					path = location.href.replace(location.origin, ""),
					hash = location.hash,
					pPos = hash.indexOf("?"),
					pPos1 = path.indexOf("?"), 	//paramter position
					cleanPath = path,
					urlParams = me._getParamsForMatch( me.match( location.href ) );
				
				if(hash){
					cleanPath = path.replace(hash, "");
				}
				if(pPos1 !== -1){
					cleanPath = path.substr(0, pPos1);
				}
				
				return {
					href: location.href,
					origin: location.origin,
					path: path,
					cleanPath: cleanPath,
					hash: hash,
					cleanHash: pPos !== -1 ? hash.substr(0, pPos) : hash,
					parameters: me.getUrlParam(path),
					urlParameters: urlParams ? urlParams.map : {},
					hashbang: me.hashbang._initialised
				}
			},
			
			/**
			 * adapted from http://stackoverflow.com/a/1099670/425226
			 * @method getUrlParam
			 * @param url {String} /#/mypath/dayone?user=1&name=fred
			 */
			getUrlParam: function(url){
				var qs = url,
					params = {}, tokens,
			        re = /[?&]?([^=]+)=([^&]*)/g;
				
				qs = qs.substr(qs.indexOf("?")+1, qs.length);
				
				qs = qs.split("+").join(" ");

			    while (tokens = re.exec(qs)) {
			        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
			    }

			    return params;
			}
		
		}
		
	};
	
	/**
	 * @class class.Base
	 * @module Firebrick.class
	 */
	Firebrick.define("Firebrick.class.Base", {
		/**
		 * when calling Firebrick.create("xxx", {});
		 * the second parameter {} (config) is stored in this property as a reference
		 * - in case one needs to know with what paramters the object was intialised with
		 * @property initialConfig
		 * @type {Object}
		 * @default null
		 */
		initialConfig: null,
		/**
		 * create a copy of the listener for each class
		 * @private
		 * @method _cloneListener
		 * @param {Function} function
		 * @return {Function}
		 */
		_cloneListener: function(func){
			return function(){
				return func.apply(this, arguments);
			};
		},
		/**
		 * use this give the class a shortname to reference
		 * Firebrick.get(sname) is also possible if this property is defined
		 * @property sName
		 * @type {String}
		 * @default null
		 */
		sName: null,
		/**
		 * @method init
		 * @return self
		 */
		init:function(){
			//inits of all inits :)
			var me = this,
				k,v, a = {};
			if(me.listeners){
				Firebrick.utils.merge("listeners", me);
				for(k in me.listeners){
					if(me.listeners.hasOwnProperty(k)){
						v = me.listeners[k];
						if($.isFunction(v)){
							//create a copy of the function - otherwise the all mixins point to the same function
							a[k] = me._cloneListener(v, k);
						}
					}
				}
				me.listeners = a;
				me.on(me.listeners);
			}
			
			me.fireEvent(me.classReadyEvent);
			return me;
		},
		/**
		 * @property classReadyEvent
		 * @type {String}
		 * @default "ready"
		 */
		classReadyEvent: "ready",
		/**
		 * controls which data will be destoryed
		 * @property autoDestroy
		 * @type {Boolean}
		 * @default true
		 */
		autoDestroy:true,
		/**
		 * @property mixins
		 * @type {String|Object|[String]}
		 * @default null
		 */
		mixins:null,
		/**
		 * reference for mixins that have been mixed in.
		 * works only if "mixins" is a String or array or strings
		 * @property mixedIn
		 * @private
		 * @type {Object}
		 * @default: null
		 */
		_mixins:null,
		/**
		 * @private
		 * @property _idPrefix
		 * @type {String}
		 */
		_idPrefix: "fb-",
		/**
		 * use Firebrick.class.Base:getId
		 * @private 
		 * @property id
		 * @type {String}
		 */
		id:null,
		/**
		 * event registry
		 * @private
		 * @property localEventRegistry
		 * @type {Object} map
		 */
		localEventRegistry: null,
		
		/**
		 * @method getId 
		 * @return {String} uniqueId
		 */
		getId: function(){
			var me = this,
				id = me.id;
			if(!id){
				//generate an id if it doesnt have one already
				id = me._idPrefix + Firebrick.utils.uniqId();
				me.id = id;
			}
			return id;
		},
		
		/**
		 * remove class from registry
		 * @method destroy
		 * @event destroy
		 */
		destroy: function(){
			var me = this;
			me.fireEvent("destroy");
			Firebrick.classes.removeClass(me);
		},
		
		/**
		 * shorthand for defining class listeners so you don't have to create the init function and use this.on()
		 * @example
		 * 		 listeners:{
		 * 				"ready": function(){},
		 * 				scope:this
		 * 			}
		 * @property listeners
		 * @type {Object} map
		 */
		listeners:null,
		/**
		 * use .on()
		 * @method _addEvent
		 * @private
		 * @param eventName {String} singular or comma separated
		 * @param funct {Function}
		 * @param scope
		 */
		_addEvent: function(eventName, func, scope){
			var me = this,
				eName;
			
			eventName = eventName.split(",");	//convert to array
			
			for(var i = 0, l = eventName.length; i<l; i++){
				eName = eventName[i].trim();
				//init the registry
				if(!me.localEventRegistry[eName]){
					me.localEventRegistry[eName] = [];
				}
				//give the function an id
				func.id = Firebrick.utils.uniqId();
				if(scope){
					//add the scope if needed
					func.scope = scope;
				}
				me.localEventRegistry[eName].push(func);
			}
		},
		/**
		* register a listener to this object class, when the object fires a specific event
		* @example 
		* 	on("someEvent", callback)
		* @example 
		* 	on({
		*     "someevent": callback,		//comma separate event names for the same callback
		*     "someotherevent": callback1,
		*     scope: this
		* 	})
		* @method on
		* @param eventName {String}
		* @param callback {Function}
		* @param scope {Object} (optional)
		* @return {Object} self
		*/
		on: function(eventName, callback, scope){
			var me = this;
			
			if(!me.localEventRegistry){
				me.localEventRegistry = {};
			}
			
			if($.isPlainObject(eventName)){
				//first argument is an object
				scope = scope || eventName.scope || me;
				delete eventName.scope;
				
				for(var k in eventName){
					if(eventName.hasOwnProperty(k)){
						me._addEvent(k, eventName[k], scope);
					}
				}
				
			}else{
				//just add the event
				me._addEvent(eventName, callback, (scope || me) );
			}
			
			return me;
		},
		/**
		* remove a listener that was registered with .on()
		* @method off
		* @param eventName {String}
		* @param callback {Function} the function that was used when registering the event with .on()
		* @return {Object}
		*/
		off: function(eventName, callback){
			var me = this,
				func;
			if(me.localEventRegistry && me.localEventRegistry[eventName]){
				
				for(var i = 0, l = me.localEventRegistry[eventName].length; i<l ; i++){
					func = me.localEventRegistry[eventName][i];
					if(func.id === callback.id){
						//delete listeners from array
						me.localEventRegistry[eventName].splice(i, 1);
						break;
					}
				}
				
			}
			return me;
		},
		/**
		* Fire an event on this object
		* @method fireEvent
		* @param eventName {String} name of the event to fire
		* @param args {Any...} (optional)
		* @return {Object} eventObject
		*/
		fireEvent: function(){
			var me = this,
				events = me.localEventRegistry,
				args = Array.prototype.slice.call(arguments), 
				eventName = args[0],	//get first argument - i.e. the event name
				func, eObj, 
				scope,
				eventObject = Firebrick.events._initEventObject(eventName);
			
			if(events && events[eventName]){
				//remove event name from arguments
				args.splice(0, 1);
				eObj = events[eventName];
				for(var i = 0, l = eObj.length; i < l; i++){
					func = eObj[i];
					//TODO: ugly, change this - check firebrick ui
					if(!func.__isDestroyed){
						scope = func.scope || func;
						scope.event = eventObject;
						func.apply(scope, args);
					}
				}
				
			}
			
			return eventObject;
		}
		
	});
	
	/**
	 * Extends {{#crossLink Firebrick.class.Base}}{{/crossLink}}
	 * @extends class.Base
	 * @class view.Base
	 */
	Firebrick.define("Firebrick.view.Base", {
		extend:"Firebrick.class.Base",
		/**
		* set when the view is loaded by the ajax request
		* @property tpl
		* @type {String} 
		* @default ""
		*/
		tpl: "",
		/**
		 * bind a store or plain data to the view
		 * @property store
		 * @type {String|Store Object}
		 * @default null
		 */
		store:null,
		/**
		* parsed html using the tpl and data
		* @property html
		* @type {String} html
		* @default ""
		*/
		html:"",
		/**
		* Target to which to render the html content
		* @property target
		* @type {String|Object} jquery selector || jquery object
		* @default null
		*/
		target:null,
		/**
		* render the view on class creation
		* @property autoRender
		* @type {Boolean}
		* @default true
		*/
		autoRender:true,
		/**
		* controller to bind to the view
		* @property controller
		* @type {String|Object} name of the controller || controller class itself
		* @default null
		*/
		controller: null,
		/**
		 * loading template - loaded into target is showLoading == true
		 * @property loadingTpl
		 * @type {String}
		 * @default Firebrick.templates:loadingTpl
		 */
		loadingTpl: Firebrick.templates.loadingTpl,
		/**
		 * whether the loader is being shown or not
		 * @private
		 * @property loading
		 * @type {Boolean}
		 * @default false
		 */
		loading: false,
		/**
		 * whether to show that the view is loading
		 * @property showLoading
		 * @type {Boolean}
		 * @default true
		 */
		showLoading: true,
		/**
		* State the view is current in. "initial", "rendered", "unbound", "destroyed"
		* @property _state
		* @type {String}
		* @private
		* @default "initial"
		*/
		_state:"initial",
		/**
		 * bindings are applied to its decendants, not on the target itself
		 * @property applyBindingsToDescendants
		 * @type {Boolean}
		 * @default false
		 */
		applyBindingsToDescendants:false,
		/**
		 * wrap the view inside its own div which gets bound separatly to its context
		 * @property enclosedBind
		 * @type {Boolean}
		 * @default false
		 */
		enclosedBind: false,
		/**
		 * define subviews to load after creation of this view
		 * @example 
		 * 		subViews: MyApp.view.MyView
		 * @example 
		 * 		subViews: ["MyApp.view.MyView", "MyApp.view.MyView1"]
		 * @example 
 		 *		subViews: Firebrick.defineView(...)
		 * @example 
		 * 		subViews: [Firebrick.defineView(...), Firebrick.defineView(...)]
		 * @property subViews
		 * @type {String|Array of Strings|Object|Array of Objects}
		 */
		subViews:null,
		/**
		 * boolean whether class is view
		 * @property isView
		 * @private
		 * @type {Boolean}
		 */
		isView: true,
		/**
		 * whether or not the template is to load asyncronously
		 * @property async
		 * @type {Boolean}
		 * @default true
		 */
		async:true,
		/**
		 * @property animations
		 * @type {$.show() Arguments}
		 * @default null
		 */
		animations: null,
		/**
		 * whether to append or overwrite the content of the target
		 * @property appendTarget
		 * @type {Boolean}
		 * @default false
		 */
		appendTarget:false,
		/**
		 * custom attribute to add to the element to mark as bound
		 * @property bindAttribute
		 * @type {String}
		 * @default "fb-view-bind"
		 */
		bindAttribute: "fb-view-bind",
		/**
		 * @property enclosedBindIdPrefix
		 * @type {String}
		 * @default "fb-enclosed-bind-"
		 */
		enclosedBindIdPrefix: "fb-enclosed-bind-",
		/**
		 * @private
		 * @method _init
		 * @param callback {Function}
		 */
		_init:function(callback){
			var me = this,
				url;
			
			if(me.autoRender){
				me.startLoader();
			}
			
			//get the view
			if(!me.tpl){
				url = require.toUrl(Firebrick.utils.getPathFromName(me._classname, "html"));
				require(["text!" + url], function(tpl){
					//save the template
					me.tpl = tpl;
					callback.call();
				});
			}else{
				if($.isFunction(me.tpl)){
					me.tpl = me.tpl();
				}
				callback.call();
			}
			
			return me;
		},
		
		/**
		* Called on creation
		* @method init
		*/
		init: function(){
			var me = this,
				classReadyEvent = me.classReadyEvent;
			//overwrite the original event
			me.classReadyEvent = "base";
			me.on(me.classReadyEvent, function(){
				me._init(function(){
					//check the data of the view is in the correct format
					me.initStore();
					//parse html with data
					me.initView();

					//fire original event
					me.fireEvent(classReadyEvent);
				});
			});
			
			return me.callParent(arguments);
		},
		/**
		* Returns the store linked to the view
		* @method getStore
		*/
		getStore: function(){
			return this.store;
		},
		/**
		*	Returns data store data as object
		* @method getData
		* @return {Object}
		*/
		getData: function(){
			var me = this,
				store = me.getStore();
			return store ? store.getData() : {};
		},
		/**
		* Construct the view with template and data binding
		* @method initView
		* @return {Object} self
		*/
		initView: function(){
			var me = this;
			me._html = me.tpl;

			if(me.autoRender && me.getTarget()){
				me.render();
			}
			
			return me;
		},
		/**
		 * @private
		 * @method initSubViews
		 */
		initSubViews: function(){
			return Firebrick.views.initSubViews(this);
		},
		/**
		* @method getTarget
		* @return {Object|Null} jquery object
		*/
		getTarget: function(){
			var me = this;
			return Firebrick.views.getTarget(me.target);
		},
		
		/**
		 * has data been bound to the target by THIS view
		 * @method isTargetBound
		 * @return {Boolean}
		 */
		isBound: function(){
			return this._isBound(true);
		},
		
		/**
		 * has data been bound to the target by A|ANY view
		 * @method isTargetBound
		 * @return {Boolean}
		 */
		isTargetBound: function(){
			return this._isBound();
		},
		
		/**
		 * has the data been bound
		 * @method _isBound
		 * @private
		 * @param checkId {Boolean} [default=false] optional - if true it will also check that the target it bound with the current view and not just generally bound to 
		 * @return {Boolean}
		 */
		_isBound: function(checkId){
			var me = this,
			target = me.enclosedBind ? me.getEnclosedTarget() : me.getTarget();
			if(target && target.length && target.attr("fb-view-bind")){
				if(checkId){
					if(target.attr("fb-view-bind") === me.getId()){
						//target is bound and with this view
						return true;
					}else{
						//target is bound and NOT with this view
						return false;
					}
				}
				
				//target is bound
				return true;
			}
			
			//target is not bound
			return false;
		},
		
		/**
		 * unbind and remove from DOM
		 * @method detroy
		 * @return {Object} self
		 */
		destroy: function(){
			var me = this;
			me.unbind().remove();
			me._state = "destroyed";
			return me.callParent(arguments);
		},
		
		/**
		 * @method getEnclosedBindId
		 * @return {String}
		 */
		getEnclosedBindId: function(){
			var me = this;
			return me.enclosedBindIdPrefix + me.getId();
		},
		
		/**
		 * remove from dom
		 * @method remove
		 * @return self {Object}
		 */
		remove: function(){
			var me = this, 
				t = me.enclosedBind ? Firebrick.views.getTarget("#" + me.getEnclosedBindId()) : me.getTarget();
			
			if(t){
				//jquery remove dom
				if(me.applyBindingsToDescendants || me.enclosedBind){
					t.remove();	//removes itself
				}else{
					t.empty();	//empties content
				}
				
				//more info on remove vs empty - http://stackoverflow.com/questions/3090662/jquery-empty-vs-remove
				
			}
			
			return me;
		},
		
		/**
		 * unbind the data from this view
		 * @method unbind
		 * @return self {Object}
		 */
		unbind:function(){
			var me = this,
				target = me.enclosedBind ? Firebrick.views.getTarget("#"+me.getEnclosedBindId()) : me.getTarget(),
				el;
			
			if(me.isTargetBound()){
				el = target[0];
				ko.cleanNode(el);
				target.removeAttr( me.bindAttribute );
				target.removeProp( me.bindAttribute );
			}
			return me;
		},
		
		/**
		 * @method getEnclosedTarget
		 * @return {jQuery Object|Null}
		 */
		getEnclosedTarget: function(){
			return Firebrick.views.getTarget("#" + this.getEnclosedBindId());
		},
		
		/**
		 * prepare the HTML for rendering
		 * @method prepHtml
		 * @return {String} html
		 */
		prepHtml: function(){
			var me	= this,
				enclosedTarget,
				html = me._html;
			
			//does the html content need to be wrapped?
			if(me.enclosedBind){
				enclosedTarget = me.getEnclosedTarget();
				//has this already been done before?
				if(!enclosedTarget){
					//if there is no enclosing wrapper - then create one
					//create a div template and insert the html into that div
					html = $('<div id="' + me.getEnclosedBindId() + '"></div>').html(html);
				}
			}
			
			return html;
		},
		
		/**
		 * @method _renderHTML
		 * @private 
		 * @param {String} html
		 * @return {Object} self
		 */
		_renderHTML: function(){
			var me = this,
				target = me.getTarget(),
				appendTarget = me.appendTarget,
				animations = me.animations,
				html,
				enclosedTarget;
			
			//prepare the HTML for rendering
			html = me.prepHtml();
			
			//should content be enclosed in its own binding context
			if(me.enclosedBind){
				enclosedTarget = me.getEnclosedTarget();
				//check if a enclosedTarget already exists
				if(enclosedTarget){
					target = enclosedTarget;
					appendTarget = false;
				}
			}
			
			me._render(target, html, appendTarget, animations);
			
			me.fireEvent("htmlRendered");
			
			return me;
		},
		/**
		 * @method _render
		 * @private
		 * @param those of Firebrick.views.renderTo
		 */
		_render: function(){
			return Firebrick.views.renderTo.apply(Firebrick.views, arguments);
		},
		/**
		 * @method bindContent
		 */
		bindContent: function(){
			var me = this,
				data = me.getData(),
				target = me.getTarget(),
				el = target[0];
			
			if(me.enclosedBind){
				//enclosed bind is needed so update variables with correct values
				target = me.getEnclosedTarget();
				el = target[0];
			}

			//add FB related bind attribute to mark it as bound
			target.attr(me.bindAttribute, true);
			target.prop(me.bindAttribute, me);
			
			//apply data bindings
			if(me.applyBindingsToDescendants){
				ko.applyBindingsToDescendants(data, el);
			}else{
				ko.applyBindings(data, el);
			}
			
			//set dispose callback (destory|unbind)
			me.setDisposeCallback(el);	
		},
		/**
		 * Called by view.Base:render()
		 * @method bind
		 */
		bind: function(){
			var me = this,
				target = me.getTarget();
			
			if(!me.isTargetBound()){
				
				me.hide();
				me._renderHTML();
				
				//set view state
				me._state = "rendered";
				
				me.bindContent();
				
				me.stopLoader();
				me.show();
				
				me.fireEvent("rendered", me);
				
			}else{
				console.info("target or bindTarget where not found, unable to render and bind the data", target);
			}
				
			
		},
		/**
		* Calls renderTo without parameters
		* @method render
		* @return {Object} self
		*/
		render:function(){
			var me = this,
				target = me.getTarget();
			 
			if(target){
				
				me.fireEvent("beforeRender", me);
				
				me.unbind();
				
				me.bind();
				
				me.initSubViews();
				
			}else{
				console.warn("unable to render, no target found for", me.target, this);
			}
			
			return me;
		},
		/**
		 * @method setDisposeCallback
		 * @param el {HTMLElement}
		 */
		setDisposeCallback: function(el){
			var me = this;
			ko.utils.domNodeDisposal.addDisposeCallback(el, function(el){
				var view = $(el).prop( me.bindAttribute );//Firebrick.getById( $(el).attr( me.bindAttribute ) );
				view.unbound();
			});
		},
		/**
		 * called by view.Base:setDisposeCallback
		 * @private
		 * @method unbound
		 */
		unbound:function(){
			var me = this,
				store = me.getStore();
				me._state = "unbound";
			if(me.autoDestroy){
				if(store){
					store.fireEvent("unbound", me);
					me.store = null;
				}
			}
			me.fireEvent("unbound", me);
		},
		/**
		 * show target view.Base:getTarget
		 * @method show
		 */
		show: function(){
			var me = this,
				t = me.getTarget();
			if(t){
				t.show();
			}
		},
		/**
		 * hide target view.Base:getTarget
		 * @method hide
		 */
		hide: function(){
			var me = this,
				t = me.getTarget();
			if(t){
				t.hide();
			}
		},
		/**
		 * @method isVisible
		 */
		isVisible: function(){
			var me = this,
			t = me.getTarget();
			if(t){
				return t.is(":visible");
			}
			return false;
		},
		/**
		* Converts View data into a Store if not already done
		* @private
		* @method initStore
		* @param {Object} Firebrick.view.Base object
		* @return {Object} self
		*/
		initStore:function(){
			var me = this;
			me.store = me.store;
			if(me.store && !me.store.isStore){
				me.store = Firebrick.createStore({data:me.store});
			}
			return me;
		},
		/**
		* update the view with new data
		* @method update
		* @param data {Object} extra data you wish to pass to the view
		* @return {Object} self
		*/
		update:function(data){
			var me = this;
			me.getStore().setData(data);
			return me;
		},
		/**
		 * @method startLoader
		 * @private
		 */
		startLoader: function(){
			var me = this,
				t = me.getTarget();
			
			if(t && !me.loading){
				me.loading = true;
				Firebrick.delay(function(){
					//if still loading...
					if(me.loading){
						me.hide();
						t.before("<div id='fb-loader-" + me.getId() + "'>" + me.loadingTpl + "</div>");
					}
				}, 1);
				
			}
		},
		/**
		 * @method stopLoader
		 * @private
		 */
		stopLoader: function(){
			var me = this;
			if(me.loading){
				$("#fb-loader-" + me.getId()).remove();
				me.show();
				me.loading = false;
			}
		}
		
	});
	/**
	 * Extends {{#crossLink Firebrick.class.Base}}{{/crossLink}}
	 * @extends class.Base
	 * @class controller.Base
	 */
	Firebrick.define("Firebrick.controller.Base", {
		extend:"Firebrick.class.Base",
		/**
		* Called on creation
		* @method init
		*/
		init: function(){
			return this.callParent(arguments);
		},
		/**
		 * @property app
		 * @type {Object}
		 * @example
		 * 		controller.app.on(...)
		 * 		controller.app.listeners(...)
		 */
		app:{
		
			/**
			 * see Firebrick.events:on
			* @property on
			* @type {Function} 
			*/
			on: function(){
				return Firebrick.events.on.apply(Firebrick.events, arguments);
			},
			
			/**
			 * see Firebrick.events:addListener
			* @property listeners
			* @type {Function} 
			*/
			listeners:function(){
				return Firebrick.events.addListener.apply(Firebrick.events, arguments);
			}
		},
		
	});
	/**
	 * Extends {{#crossLink Firebrick.class.Base}}{{/crossLink}}
	 * @extends class.Base
	 * @class store.Base
	 */
	Firebrick.define("Firebrick.store.Base", {
		extend:"Firebrick.class.Base",
		/**
		* Called on creation
		* @method init
		*/
		init: function(){
			var me = this;
			if(!me.dataInitialised){
				if(me.autoLoad){
					me.load();
				}else{
					if(me.data){
						me.setData(me.data);
					}	
				}
			}
			if(me.autoDestroy){
				me.on("unbound", function(){
					if(me.autoDestroy){
						me.destroy();
					}
				});
			}
			return this.callParent(arguments);
		},
		/**
		* Default store configurations
		* any types that jQuery allows in $.ajax()
		* @property datatype
		* @type {String}
		* @default "json"
		*/
		dataType: "json",
		/**
		* URL Config:
		* @property url
		* @type {String, Object} string :: only a get store - i.e. 1-way store, get information from the server. object :: mutliple directional store - get and send information to and from the server
		* @example
		* 	 url: "/getusers.php"
		* @example
		* 		 url: {
						get:"/getusers.php",
						submit: "/saveusers.php"
					}	
		*/
		url:{
			/**
			 * @property get
			 * @type {String}
			 * @default null
			 */
			get:null,	//strings
			/**
			 * @property submit
			 * @type {String}
			 * @default null
			 */
			submit:null //strings 
		},
		/**
		 * @property stringifyData
		 * @type {Boolean}
		 * @default true
		 */
		stringifyData: true,
		/**
		* set the connection protocol, POST or GET for load
		* @property loadProtocol
		* @type {String}
		* @default "GET"
		*/
		loadProtocol: "GET",
		/**
		* set the connection protocol, POST or GET for submit
		* @property submitProtocol
		* @type {String}
		* @default "POST"
		*/
		submitProtocol: "POST",
		/**
		* Store status
		* 1. initial :: store has just been created
		* 2. preload :: store is just about to fire the $.ajax event
		* 3. any :: success status of $.ajax()
		* @private
		* @property status
		* @type {String}
		*/
		status:"initial",
		/**
		* Simple property to check whether this object is a store
		* @private
		* @property isStore
		* @type {Boolean}
		* @default true
		*/
		isStore:true,
		/**
		* Whether the data in the store has been initialised, ie. convert to records etc.
		* @private
		* @property dataInitialised
		* @type {Boolean}
		* @default false
		*/
		dataInitialised: false,
		/**
		 * load store on creation
		 * @property autoLoad
		 * @type {Boolean}
		 * @default false
		 */
		autoLoad:false,
		/**
		 * 
		 * data store - use setData()
		 * @property data
		 * @type {Object}
		 * @default null
		 */
		data: null,
		/**
		 * pass parameters when loading the store
		 * @property params
		 * @type {Object}
		 * @default null
		 */
		params: null,
		/**
		 * initial raw data that was passed when setting the store with setData() function
		 * @private
		 * @property _initialData
		 * @type {Object}
		 * @default null
		 */
		_initialData:null,
		/**
		 * default value
		 * @property async
		 * @type {Boolean}
		 * @default true
		 */
		async: true,
		/**
		 * specify a root - used when calling getData()
		 * @property root
		 * @type {String}
		 * @default null
		 */
		root: null,
		
		/**
		 * return the correct url when getting or submitting the store
		 * @method getUrl
		 * @param type {String} optional - "get", "submit"
		 * @return {String}
		 */
		getUrl: function(type){
			var me = this;
			if(!type){
				if($.isPlainObject(me.url)){
					return me.url.get;
				}
				return me.url;
			}else{
				return me.url[type];
			}
		},
		/**
		* Load the store - see data.store:loadStore
		* @example 
		* 		load({
					callback:function(){},
					scope:this //scope for callback
				})
		* @method load
		* @param options {Object}
		* @return {Object} self
		*/
		load: function(options){
			return Firebrick.data.store._loadStore(this, options);
		},
		/**
		* Returns the store data attribute
		* @method getData
		* @return {Object} store data
		*/
		getData:function(){
			var me = this;
			if(me.root){
				if($.isPlainObject(me.data)){
					return $.isFunction(me.data[me.root]) ? me.data[me.root]() : me.data[me.root];
				}
			}
			return me.data;
		},
		/**
		 * remove data
		 * @method destroy
		 */
		destroy: function(){
			var me = this;
			
			me.data = null;
			me.status = "destroyed";
			me.dataInitialised = false;
			
			return me.callParent(arguments);
		},
		/**
		 * provide the raw data
		 * @method getRawData
		 * @param initial {Boolean} [default=false] (optional) set to true if you want the original data passed to setData() - if left out or false - it will parse the ko-ed data back to a JS object
		 * @return {Object}
		 */
		getRawData: function(initial){
			var me = this;
			if(initial){
				return me._initialData;
			}
			var b = me.getData();
			b = $.isFunction(b) ? b() : b;
			return ko.toJS(b);
		},
		/**
		* Converts a json object into stores with records
		* @method setData
		* @param data {Object}
		* @return {Object} self
		*/
		setData: function(data){
			var me = this;
			if(!me.dataInitialised){
				if(!ko.mapping.isMapped(data)){
					me._initialData = data;
					if(typeof data === "string"){
						data = ko.mapping.fromJSON(data);
					}else{
						data = ko.mapping.fromJS(data);
					}
				}
				me.data = data;
				me.dataInitialised = true;
			}else{
				if(!ko.mapping.isMapped(data)){
					me._initialData = data;
					ko.mapping.fromJS(data, me.data);
				}else{
					console.error("cannot update store data using a mapped object", data);
				}
			}
			
			return me;
		},
		/**
		* Submit the store data to the specified url.submit path
		* see data.store:submit
		* @method submit
		* @return {Object} self
		*/
		submit: function(){
			return Firebrick.data.store._submit(this);
		},
		/**
		* convert store data to a plain object
		* @method toPlainObject
		* @return {Object}
		*/
		toPlainObject: function(){
			var me = this,
				data = me.getData();
			
			//check if knockout data, if so, convert back to simple js object
			if($.isFunction(data)){
				return ko.toJS(data);
			}else if($.isPlainObject(data)){
				if(data.__ko_mapping__){					// jshint ignore:line
					return ko.mapping.toJS(data);
				}
			}
			
			
			return me.data;
		},
		/**
		* Convert store data to json string
		* @method toJson
		* @return {String} json
		*/
		toJson: function(){
			return JSON.stringify(this.toPlainObject());
		}
		
	});
	/**
	 * @class window
	 * @module Global
	 */

	/**
	 * 
	 * @property Firebrick 
	 * @type {Object}
	 */
	window.Firebrick = Firebrick;
	
	return Firebrick;
}));