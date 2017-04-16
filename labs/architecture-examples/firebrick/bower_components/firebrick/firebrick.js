/**
* Firebrick JS - JavaScript MVC Framework powered by jQuery and Rivets
* Author: Steven Masala
* dependencies: jquery, rivets.js
* contact: me@smasala.com
*/ 

(function(window, document, $){
	
	if(window.Firebrick){
		console.error("unable to initialise FirebrickJS, Firebrick already defined");
		return;
	}
	
	var Firebrick = {
		
		version_type: "alpha",
		version: "1.0.0",
		
		/**
		* used to store configurations set Firebrick.ready()
		* @private
		*/
		app: {
			name: "",
			path: ""
		},
		
		/** ready function to kick start the application
		* @param options :: object = {
					go:function(), //called on document ready
					app:{
						name: string, //name of the app
						path: string //path of the app
					},
					autoRender: boolean //whether to call first view automatically  "{app.name}.view.Index",
					initialData: object //initialData to be passed to the autoRender view
				}
		*/
		ready: function(options){
			var me = this;
				me.app = options.app,
				whenReady = me.whenReady(options);
				
			//if files need to be required first, then require them and fire the application
			if(options.require && options.require.length > 0){
			
				$.each(options.require, function(index, className){
					me.create(className);
				});
			
				$(document).ready(whenReady);
			}else{
				//no files were required - lets go!
				$(document).ready(whenReady);
			}
		},
		
		/**
		* Do not call - this function is returned to ready() and is fired when the document has completed loading
		* @private
		* @param options :: object :: config object passed to Firebrick.ready({})
		* @returns function
		*/
		whenReady: function(options){
			var me = this;
			return function(){
					if(options.autoRender !== false){
						me.createView(me.app.name + ".view.Index", {data:options.initialData});
					}
					if($.isFunction(options.go)){
						options.go();
					}
				};
		},
		
		/** SHORTCUTS **/
		shortcut: function(scope, func, args){
			return scope[func].apply(scope, args);
		},
		
		get: function(){
			return this.shortcut(this.classes, "get", arguments);
		},
		
		create: function(){
			return this.shortcut(this.classes, "create", arguments);
		},
		
		define: function(){
			return this.shortcut(this.classes, "define", arguments);
		},
		
		require: function(){
			return this.shortcut(this.utils, "require", arguments);
		},
		
		getView: function(){
			return this.shortcut(this.view, "getView", arguments);
		},
		
		createView: function(){
			return this.shortcut(this.view, "createView", arguments);
		},
		
		defineView: function(){
			return this.shortcut(this.view, "defineView", arguments);
		},
		
		getBody: function(){
			return this.shortcut(this.view, "getBody", arguments);
		},
		
		delay: function(){
			return this.shortcut(this.utils, "delay", arguments);
		},
		
		addListener: function(){
			return this.shortcut(this.events, "addListener", arguments);
		},
		
		removeListener: function(){
			return this.shortcut(this.events, "removeListener", arguments);
		},
		
		fireEvent: function(){
			return this.shortcut(this.events, "fireEvent", arguments);
		},
		
		on: function(){
			return this.shortcut(this.events, "on", arguments);
		},
		
		off: function(){
			return this.shortcut(this.events, "off", arguments);
		},
		
		createStore: function(){
			return this.shortcut(this.data.store, "createStore", arguments);
		},
		
		createRecord: function(){
			return this.shortcut(this.data.record, "createRecord", arguments);
		},
		/** END OF SHORTCUTS **/
		
		classes: {
		
			/**
			* Class Registry
			* @private
			*/
			classRegistry: {},
			
			/**
			* get or returns a firebrick class by name
			* @param name :: string
			* @param config :: object
			* @returns object
			*/
			get: function(name, config){
				return this.createClass(name, config);
			},
			
			/**
			* get or returns a firebrick class by name and calls init()
			* @param name :: string
			* @param config :: object
			* @returns object
			*/
			create: function(name, config){
				var me = this,
					clazz = me.get(name, config);
					
				//initalise the class
				clazz.init();
				
				//return it
				return clazz;
			},
			
			/**
			* creates the specified class, fetches it if no already
			* @private
			* @param name :: string
			* @param config :: object
			* @returns object
			*/
			createClass:function(name, config){
				var me = this;
			
				if($.isPlainObject(name)){
					//object has been passed, just return it
					return name;
				}
				
				//does it already exist?
				if(!me.classRegistry[name]){
					//require the class first
					Firebrick.utils.require(name, function(){
						//check and load any sub dependencies
						if(me.classRegistry[name].hasDependencies()){
							var subDeps = me.classRegistry[name].require;
							if(!$.isArray(subDeps)){
								subDeps = [subDeps];
							}
							$.each(subDeps, function(index, className){
								me.create(className);
							});
						}
						
						if(config){
							//if config is passed, extend the class
							me.classRegistry[name] = Firebrick.utils.extend(me.classRegistry[name], config);
						}
						
						
					}, false);
				}
				
				return me.classRegistry[name];
			},
			
			/**
			* define a firebrick class
			* @param name :: string
			* @param config :: object :: optional
			* @returns the newly created class
			*/
			define: function(name, config){
				//build class with inheritance if present
				var me = this,
					clazz = me.buildClass(name, config);
					me.classRegistry[name] = clazz;
				return clazz;
			},
			
			/**
			* build the class with inheriting from the classes in which they extend from
			* @private
			* @param name :: string
			* @param config :: class object
			* @returns object
			*/
			buildClass: function(name, config){
				var me = this, config = config || {};
				//is the class extending from something?
				if(config.extends){
					//does the parent exist?
					var parent = me.classRegistry[config.extends];
					if(parent){
						//iterate over the parents configuration
						config = Firebrick.utils.extend(config, parent);
						config._super = parent;						
					}else{
						console.warn("unable to find parent class to inherit from:", config.extends);
					}
					
				}
				
				var clazz = config;
				clazz._classname = name;
				
				return clazz;
			}
		
		},
		
		view: {
			
			/**
			* View Registry - stores all views by name
			* @private
			*/
			viewRegistry: {},
			
			/**
			* Extensions of the view files
			*/
			viewExtension: "html",
			
			/**
			* get view class by name
			* @param name :: string
			* @return class
			*/
			getView: function(name){
				return this.defineView(name);
			},
			
			/**
			* Create and render a view
			* @param name :: string :: MyApp.view.MyView
			* @param config :: object (optional) :: object to config the View class with
			* @returns Firebrick.view.Base || object
			**/
			createView: function(name, config){
				//get, define and call the construtor of the view
				var me = this, 
					view = me.defineView(name, config).init();
				return view;
			},
			
			/**
			* Note: different to Firebrick.define() for classes - 
			* Firebrick.defineView, defines and fetches if not already loaded the given view by name
			* @param name :: string :: name of the view to me shown "MyApp.view.MyView"
			* @param config :: object (optional) :: object to config the View class with
			* @returns Firebrick.view.Base :: object
			*/
			defineView: function(name, config){
				var me = this;
				
				if(!me.viewRegistry[name]){
					//set basic configurations for view class
					config = me.basicViewConfigurations(config);
					
					//get the view
					Firebrick.utils.require(name, function(tpl){
						config.tpl = tpl;
						//save the view in the registry
						me.viewRegistry[name] = Firebrick.classes.buildClass(name, config);
					}, false, "html", me.viewExtension);
				}
				
				//return the new view
				return me.viewRegistry[name];
			},
			
			/**
			* Basic view configurations when defining/creating a view
			* @private
			* @param config :: object (optional)
			* @returns object
			*/
			basicViewConfigurations: function(config){
				var me = this;
				config = config || {};
				if(!config.extends){
					config.extends = "Firebrick.view.Base";
					if(!config.init){
						config.init = function(){
							return this.callParent();
						}
					}
				}
				return config;
			},
			
			/**
			* jQuery body object (cache) - is set initally by getBody()
			* @private
			*/
			body: null,
			
			/**
			* Shortcut to get jQuery("body")
			* @param refresh :: boolean (optional) :: defaults to false - if true gets the body object fresh and not from cache
			* @returns jquery object of body
			*/
			getBody: function(refresh){
				var me = this;
				if(refresh === true || !me.body){
					me.body = $("body");
				}
				return this.body;
			},
			
			/**
			* find the target using a selector - same as jQuery(selector)
			* @param selector :: string || jquery object
			* @returns jquery object || null
			*/
			getTarget: function(selector){
				var a = selector && selector.jquery ? selector : $(selector);
				return a.length > 0 ? a : null;
			},
			
			/**
			* Render HTML or Rivets Template to the given target
			* @private
			* @param target :: jquery object ::
			* @param html :: string :: rivets template or html
			* @return target as jquery object
			*/
			renderTo:function(target, html){
				return target.html(html);
			}
			
		},
		
		utils: {
		
			/**
			* extend class 1 with properties of class 2
			* @param config :: object :: object to extend
			* @param obj2 :: object :: properties to extend from 
			* @returns merged object
			*/
			extend: function(config, obj2){
				var me = this;
				$.each(obj2, function(key, value){
					//doesn't exist then copy it over
					if(!config.hasOwnProperty(key)){
						config[key] = value;
					}else{
						//does exists
						//is a function
						if($.isFunction(config[key])){
							//enable function to call its obj2 : http://stackoverflow.com/a/22073649/425226
							//TODO: stop recursion on itself when obj2 has no callParent	
							(function(current, parent){
								config[key] =  function() { // inherit
											this.callParent = parent;
											var res = current.apply(this, arguments);
											delete this.callParent;
											return res;
										};
							})(config[key], value);
						}
					}
				});
				return config;
			},
			
			/**
			* overwrite properties in the first object from that of the second
			* @param obj1 :: object
			* @param obj2 :: object
			* @returns object
			*/
			overwrite: function(obj1, obj2){
				$.each(obj2, function(k,v){
					obj1[k] = v;
				});
				return obj1;
			},
			
			/**
			*	Javascript setTimout function
			* @usage delay(function(){}, 1000, scope);
			* @param callback :: function
			* @param timeout :: integer :: miliseconds
			* @param scope :: object (optional) :: scope of the callback function. Defaults to: window
			*/
			delay: function(callback, timeout, scope, data){
				setTimeout(function(){
					callback.apply(scope || this);
				}, timeout);
			},
		
			/**
			* Basic clone from one object to a new one object
			* @param object :: object :: object you wish to clone
			* @param config :: object :: new properties you wish to add to the clone
			* @returns object :: new object clone
			*/
			clone: function(object, config){
				var clone = {}, config = config || {};
				$.each(object, function(key, value){
					clone[key] = value;
				});
				$.each(config, function(key, value){
					clone[key] = value;
				});
				return clone;
			},
		
			/**
			* Get a script/file from path
			* @usage require("MyApp.controller.MyController", function(){}, true, "html", "js");
			* @param name :: string || [string] :: MyApp.controller.MyController
			* @param callback :: function (optional) :: called when last require has completed or failed
			* @param async :: boolean :: defaults true
			* @param data_type :: string :: jQuery ajax datatype. defauts to 'script'
			* @param ext :: string :: file extension. defaults to 'js'
			*/
			require: function(names, callback, async, data_type, ext){
				var me = this, 
					path, 
					data_type = data_type || "script",
					ext = ext || "js"; 
				
				if(!$.isArray(names)){
					names = [names];
				}
				
				//mark how files are to be fetched
				var ajaxCounter = names.length,
					//prepare callback function
					newCallback = function(){
						ajaxCounter--;
						if(ajaxCounter == 0){
							if(callback && $.isFunction(callback)){
								callback.apply(this, arguments);
							}
						}
					};
				
				//iterate of each file and get them
				for(var i = 0, l = names.length; i<l; i++){
					//convert the name into the correct path
					path = me.getPathFromName(names[i], ext);
					$.ajax({
						async:$.type(async) == "boolean" ? async : true,
						dataType:data_type,
						url:path,
						success:function(){
							newCallback.apply(this, arguments);
						},
						error:function(reponse, error, errorMessage){
							console.warn("unable to load file/class '", names[i], "' at:", path);
							console.error(error, errorMessage);
							newCallback.apply(this, arguments);
						}
					});
				}
			},
			
			/**
			* Converts a name like "MyApp.controller.MyController" to a path MyApp/controller/MyController
			* @private
			* @param name :: string
			* @param ext :: string :: default to 'js'
			* @returns string
			*/
			getPathFromName: function(name, ext){
				var me = this,
					homePath = Firebrick.app.path,
					appName = Firebrick.app.name,
					ext = ext || "js";
				
				name = name.trim();
				
				if(name.indexOf(".") > 0){
					//check if the appName is found at the beginning
					if(name.indexOf(appName) == 0){
						//replace the appName with the target path
						name = name.replace(appName, homePath);
						//replace all . with /
						return name.replace(/\./g, "/") + "." + ext;
					}
				}
				
				//local file
				return homePath + "/" + name;
			},
			
			/**
			*	returns a unique id: http://stackoverflow.com/a/19223188
			* @private
			*/
			globalC: 1,
			uniqId: function() {
				var me = this,
					d = new Date(),
					m = d.getMilliseconds() + "",
					u = ++d + m + (++me.globalC === 10000 ? (me.globalC = 1) : me.globalC);

				return u;
			}
		},
		
		events: {
			
			/**
			* Event registry
			* @private
			*/
			eventRegistry: {},
			
			/**
			* Event Counter - used to make callbacks by id
			* @private
			*/
			eventCounter: 0,
			
			/**
			* add a listener to a specific event by name
			* @usage addListener("myEvent", myFunction(){}, this);
			* @usage addListener({
						"myEvent": function(){},
						"mySecondEvent": function(){},
						scope: this
					})
			* @param eventName :: string || object
			* @param callback :: function
			* @param scope :: object (optional) :: scope in which the listener is fired in
			* @returns the function with the assigned callbackId;
			*/
			addListener: function(eventName, callback, scope){
				var me = this;
				
				if($.isPlainObject(eventName)){
					return me.addListener_internal(eventName);
				}
				
				if(!callback.conf){
					callback.conf = {};
					callback.conf.callbackId = me.eventCounter++;
				}
				
				callback.conf.scope = scope;
				
				if(!me.eventRegistry[eventName]){
					//no listeners under this event name yet
					me.eventRegistry[eventName] = [];
				}
				
				me.eventRegistry[eventName].push(callback);
				return callback;
			},
			
			/**
			* Use Firebrick.events.addListeners
			* @private
			* @usage addListeners_internal({
					"myEvent": function(){},
					"mySecondEvent": function(){},
					scope: this
				})
			* @param object :: object
			*/
			addListener_internal: function(object){
				var me = this, scope = object.scope;
				delete object.scope;
				$.each(object, function(eventName, callback){
					me.addListener(eventName, callback, scope);
				});
			},
			
			/**
			* remove listener by eventName and function
			* @usage removeListener("myEvent", function);
			* @param eventName :: string
			* @param function :: optional :: if non given will remove all listeners for event
			*/
			removeListener: function(eventName, funct){
				var me = this, reg = me.eventRegistry[eventName];
				if(reg){
					if(funct.conf.callbackId || funct.conf.callbackId == 0){
						for(var i = 0, l = reg.length; i<l; i++){
							//compare callbackId's
							if(reg[i].conf.callbackId == funct.conf.callbackId){
								//function found so remove from array of listeners
								reg.splice(i, 1);
								if(reg.length == 0){
									delete me.eventRegistry[eventName];
								}
							}
						}
					}else{
						console.warn("No callbackId for function whilst trying to remove listener");
					}
				}else{
					console.warn("Unable to remove listener. No events found for:", eventName);
				}
			},
			
			/**
			* Fire an event by name
			* @usage fireEvent("eventFired", 1, "test", false);
			* @param eventName :: string
			* @param data :: any... :: arguments passed to event when fired
			*/
			fireEvent: function(eventName, data){
				var me = this, reg = me.eventRegistry[eventName];
				if(reg){
					//get the argument from this function call
					var args = [].splice.call(arguments, 1),
						ev = me.createEventData(eventName);	//create an event object to pass to the function argument
					//place event object as the first argument
					args.unshift(ev);
					for(var i = 0, l = reg.length; i<l; i++){
						var f = reg[i];
						//copy the function config created by addListener into the event argument and the function itself
						ev.conf = f.conf;
						ev.funct = f;
						//place the event object as the first item in arguments list
						args.unshift(ev);
						//call the event with the new arguments
						f.apply(f.conf.scope || window, args);
					}
				}
			},
			
			/**
			* creates the event object to be passed as argument when event is fired
			* @private
			* @param eventName :: string
			*/
			createEventData: function(eventName){
				var me = this, ev = {
					event: eventName, 
					conf: null,
					/**
					* removes the listener it called from within
					* @usage event.removeSelf();
					*/
					removeSelf: function(){
						me.removeListener(eventName, ev.funct);
					}
				};
				
				return ev;
			},
			
			/**
			* Define events and their callbacks, similar to $(selector).on(eventname, callback)
			* @usage on("click", "a.mylink", function(){})
			* @usage on({
							"a.link":{
								click:function(){},
								mouseover:function(){}
							},
							scope:this
						})
			* @param eventName :: string ||  object || same as jquery selector(s)
			* @param selector :: string (optional) :: use if first arg is not an object
			* @param callback :: function (optional) :: use if first arg is not an object
			* @param scope :: object (optional) :: change scope on callback function use if first arg is not an object
			*/
			on: function(eventName, selector, callback, scope){
				var me = this;
				//if the eventName is an object
				if($.isPlainObject(eventName)){
					return me.on_internal(eventName);
				}
				//register single event
				return me.register_on_event(eventName, selector, callback, scope);
			},
			
			/**
			* Makes use of the jQuery .off() function
			* @usage .off( "click", "#theone", function(){} )
			* @param selector :: string
			* @param eventName :: string
			* @param callback :: function :: the function used in on()
			*/
			off: function(eventName, selector, callback){
				$(document.body).off(eventName, selector, callback);
			},
			
			/**
			* use Firebrick.events.on()
			* @param object :: object :: {
							"a.link":{
								click:function(){},
								mouseover:function(){}
							},
							scope:this
						}
			* @private
			**/
			on_internal: function(object){
				var me = this, scope = object.scope;
				$.each(object, function(selector, value){
					$.each(value, function(eventName, callback){
						me.register_on_event(eventName, selector, callback, scope);
					});
				});
			},
			
			/**
			* use Firebrick.events.on()
			* @private
			*/
			register_on_event: function(eventName, selector, callback, scope){
				$(document.body).on(eventName, selector, function(){
					//add scope as last argument, just in case the scope of the function is changed
					var args = [].splice.call(arguments, 0);
					args.push(this);
					callback.apply(scope || this, args);
				});
			}
			
		},
		
		data: {
			
			/**
			* Used by createStore or createRecord to create basic object to be reused
			* @private
			* @param type :: string :: whether record or store
			* @param name :: string (optional) || object :: if string, then Firebrick.create(name, config) is called
			* @param config :: object (optional) :: data to config the class with - called in conjuction when name is set
			*/
			createDataObject: function(type, name, config){
				var me = this; 
					
				//name is a string - hence the user is looking to create an actual defined store
				if($.type(name) == "string"){
					//return the created class
					var clazz = Firebrick.get(name);
					clazz = Firebrick.utils.overwrite(clazz, config);
					clazz.init();
					return clazz;
				}else{
					
					type = type.toLowerCase();
					
					//only 1 parameter in this case, name is then config.
					config = name || {};
					
					//if no extend is defined (which is standard case) - give it one - ie. the store base class
					if(!config.extends){
						config.extends = "Firebrick." + type + ".Base";
					}
					
					//return a new object based on the Base class
					return Firebrick.classes.buildClass("Firebrick." + type + ".Base", config);
				}
				
			},
			
			//store functions
			store: {
				
				/**
				* creates a new Firebrick.store.Base store to be used OR if a name and config are supplied, then Firebrick.create() is called
				* @usage createStore({
							data:{name:"bob"}
						}); :: creates a new class Firebrick.store.Base to be used
				* @usage createStore("MyApp.store.MyStore", {}); :: Firebrick.create() is called
				* @usage createStore() :: returns a Store class to be used
				* @param name || config :: string (optional) || object :: if string, then Firebrick.create(name, config) is called
				* @param config :: object (optional) :: data to config the class with - called in conjuction when name is set
				* @returns Firebrick.store.Base
				*/
				createStore:function(name, config){
					//return a new object based on the Base class
					return Firebrick.data.createDataObject("Store", name, config);
				},
				
				/**
				* Used by Firebrick.store.Base.load();
				* @private
				* @param store = Firebrick.store.Base object
				* @param options :: object :: {callback:function(jsonObject, status, response), scope: object}
				* @return store
				**/
				loadStore: function(store, options){
					var me = this, 
						options = options || {}
						url = store.url;
					
					if($.isPlainObject(url)){
						url = url.get;
					}					
					
					store.status = "preload";
					
					$.ajax({
						datatype: store.datatype,
						url: store.url,
						success:function(jsonObject, status, response){
							store.setData(jsonObject);
							store.status = status;
							if($.isFunction(options.callback)){
								options.callback.apply(options.scope || store, [jsonObject, status, response]);
							}
						},
						error:function(reponse, error, errorMessage){
							console.warn("unable to load store '", store.classname, "' with path:", store.url);
							console.error(error, errorMessage);
						}
					});
					
					return store;
				},
				
				/**
				* @private
				* @fires recordInserted :: record || data
				* @fires storeUpdated :: record || data
				* @returns store
				*/
				insert: function(store, pos, data){
					var me = this;
					if(pos == -1){
						//add to the end
						store.data[store.root].push(data);
					}else{
						//add at specific index
						store.data[store.root].splice(pos, 0, data);
					}
					if(data && data.isRecord){
						data.store = store;
						me.registerStoreRecordListeners(store, data);
					}
					store.fireEvent("recordInserted", store, data);
					store.fireEvent("storeUpdated", store, data);
					return store;
				},
				
				/**
				* Register listeners onto the record that bubble up to the store
				* @private
				* @param store :: store class
				* @param record :: record class
				* @returns store
				*/
				registerStoreRecordListeners: function(store, record){
					record.bubbleEvents = {};
					
					var f = function(){
						store.fireEvent("storeUpdated", store, record);
					};
					
					record.bubbleEvents["recordChanged"] = (f);
					record.on("recordChanged", f);
					
					return store;
				},
				
				/**
				* Remove all listeners registered by registerStoreRecordListeners
				* @private
				* @param store :: store class
				* @param record :: record class
				* @returns store
				*/
				removeRecordListeners: function(store, record){
					var me = this;
					$.each(record.bubbleEvents, function(name, func){
						record.off(name, func);
					});
					return store;
				},
				
				/**
				* @private
				*/
				add: function(store, data){
					var me = this;
					return me.insert(store, -1, data);
				},
				
				/**
				* do a deep search and look if key && value or key is present and remove it
				* @private
				* @usage findAndRemove(["a","b","c"], "b"); :: simple array search, removes value "b" from array
				* @usage findAndRemove([records...], "name", "bob") :: deep search (records in records). removes the first record where "name" == "bob".
				* @param store :: Firebrick.base.Store
				* @param data :: simple array or array of records
				* @param key :: string :: either the name of an object key or the value in simple array
				* @param value :: any (optional) :: only used if searching in records
				* @returns store;
				*/
				remove: function(store, key, value, all){
					var me = this;
					store.changedRecords = [];
					var r = me.findRecordAndExecute(store, "remove", key, value, all);
					if(store.changedRecords.length > 0){
						store.fireEvent("recordRemoved", store, store.changedRecords);
						store.fireEvent("storeUpdated", store, store.changedRecords);
						$.each(store.changedRecords, function(i, record){
							me.removeRecordListeners(store, record);
						});
						store.changedRecords = [];
					}
					return store;
				},
				
				/**
				*	same as findAndRemove, just removes all matches
				* @see findAndRemove
				* @private
				*/
				removeAll: function(store, key, value){
					return this.remove(store, key, value, true);
				},
				
				/**
				* deep search, find record within records
				* @private
				* @usage findRecord([records...], "name", "bob"); find the record where "name" == "bob"
				* @usage findRecord(["a", "b", "c"], "b")
				* @param store :: Firebrick.base.Store
				* @param data :: array[records]
				* @param key :: string
				* @param value :: any
				* @returns record[]
				*/
				findRecord: function(store, key, value){
					return this.findRecordAndExecute(store, "find", key, value);
				},
				
				/**
				*	same as findRecord, just finds all records
				* @see findRecord
				* @private
				*/
				findAllRecords: function(store, key, value){
					return this.findRecordAndExecute(store, "find", key, value, true);
				},
				
				/**
				* find record and execute an action on it. internal use only
				* @private
				* @param action :: string :: find, remove
				* @returns array of results
				*/
				findRecordAndExecute: function(store, action, key, value, all){
					all = all === true ? all : false;
					var result = [], data = store.getRoot();
					
					var f = function(v){
						//is the iterated item a Record?
						if($.isPlainObject(v) && v.isRecord){
							//check if this is the item we were looking for
							if((key == "recordId" && v.recordId == value) || (v.data.hasOwnProperty(key) && v.data[key] == value)){
								if(action == "remove"){
									//found, remove and stop iteration
									store.changedRecords.push(v);
									//don't return this element so that it is removed during filtering
								}else if(action == "find"){
									//return the found item
									return v;
								}
							}else{
								if(action == "remove"){
									//not a match so we can return this element
									return v; 
								}
							}
						}
					};
					
					
					result = data.filter(f);
					
					if(action == "remove"){
						//set the store again with the filter records
						store.data[store.root] = result;
					}
						
					//return the new array with removed items or found matching results
					return result;
				},
				
				/**
				* Called from within a store - converts json object into a data object with records
				* @private
				* @param store :: Firebrick.store.Base object
				* @param data :: json object
				* @returns store
				*/
				setDataForStore: function(store, data){
					var me = this;
					
					if($.isArray(data)){
						data = { root: data };
					}
					
					if(data[store.root]){
						data[store.root] = me.convertToRecords(store, data[store.root]);
					}else{
						console.info("store root was not found in the specified data:", store.root, store);
					}
					
					return store;
				},
				
				
				
				/**
				* Convert a simple json array into an array with Firebrick.record.Base objects (recursive function)
				* @private
				* @param array :: array :: json array
				* @returns array :: new array with records
				*/
				convertToRecords: function(store, array){
					var me = this, 
						record;
					//array = [{},{},{}] || [1,2,3,4]
					$.each(array, function(index, value){
						//each item in the array
						if($.isPlainObject(value)){
							//item is also an object
							$.each(value, function(k,v){
								//iterate over all object properties
								if($.isArray(v)){
									//found an array, convert those to record recursively as well
									value[k] = me.convertToRecords(store, v);
								}
							});
						}
						//create a new record from the data
						//manipulate the original array by changing its value to the new record
						array[index] = Firebrick.createRecord().setData(value);
					});
					
					return array;
				},
				
				/**
				* Submit the given store with its data to the specified url
				* @private
				* @param store :: Firebricks.store.Base class
				* @param callback :: function (optional) :: function to call on store submission success
				* @returns store
				*/
				submit: function(store, callback){
					var me = this,
						data;
					
					if(store && store.url && store.url.submit){
						
						store.status = "presubmit";
					
						data = store.toJson();
						$.ajax({
							url: store.url.submit,
							data: {data: data},
							type: store.protocol,
							beforeSend: function(){
								return store.fireEvent("beforeSubmit", store, data);
							},
							success: function(data, status, response){
								store.status = status;
								if(callback){
									callback.apply(store, arguments);
								}
							},
							error: function(){
								console.error("error submitting data for store to url", store.url.submit, store);
							}
						});
					}else{
						console.error("unable to submit store, no submit path found (url.submit)", store);
					}
					
					return store;
				},
				
			},
			
			/**
			* convert records back to a plain object recursively
			* @private
			* @param data :: store data
			*/
			convertToPlainObject: function(data){
				var me = this,
					convertedData;
				
				if($.isArray(data)){
					convertedData = [];
					$.each(data, function(index, value){
						convertedData.push(me.convertToPlainObject(value));
					});
				}else if($.isPlainObject(data)){
					if(data.isRecord){
						//record class - extract the info we need
						data = data.data;
					}
					convertedData = {};
					$.each(data, function(key, value){
						convertedData[key] = me.convertToPlainObject(value); 
					});
				}else{
					//nothing to convert
					convertedData = data;
				}
				
				return convertedData;
			},
			
			record: {
			
				/**
				* creates a new Firebrick.record.Base store to be used OR if a name and config are supplied, then Firebrick.create() is called
				* @usage createRecord({
							key:"name",
							value:"bob"
						}); :: creates a new class Firebrick.record.Base to be used
				* @usage createRecord() :: returns a Record class to be used
				* @usage createRecord("MyApp.record.MyRecord", {}); :: Firebrick.create() is called
				* @param name || config :: string (optional) || object :: if string, then Firebrick.create(name, config) is called
				* @param config :: object (optional) :: data to config the class with - called in conjuction when name is set
				* @returns Firebrick.record.Base
				*/
				createRecord:function(name, config){
					//return a new object based on the Base class
					return Firebrick.data.createDataObject("Record", name, config).init();
				}
			
			}
			
		},
		
		router:{
		
			/**
			* Call a function when the hash changes on the site
			* @param callback :: function :: function to call on hashchange
			*/
			onHashChange: function(callback){
				$(window).on("hashchange", function(){
					callback.apply(this, arguments);
				});
			},
		
			/**
			* Check whether the pattern or hash is present
			* @usage Firebrick.router.is("#/completed") :: returns true or false
			* @param pattern :: string
			* @returns boolean
			*/
			is: function(pattern){
				if(pattern.contains("#")){
					return window.location.hash == pattern;
				}
				
				return window.location.href.replace(window.location.origin) == pattern;
			}
		
		}
		
	};
	
	Firebrick.define("Firebrick.class.Base", {

		init:function(){
			//inits of all inits :)
			return this;
		},
	
		localEventId:0,
		localEventRegistry: {},
		/**
		* used to register a link of events
		* e.g. if the records fires an event, so must its store etc.
		*/
		bubbleEvents: {},
	
		/**
		* Check whether this class has any sub dependencies declared by "require"
		* @returns boolean
		*/
		hasDependencies:function(){
			var me = this;
			return (me.require && ( $.type(me.require) == "string" || ( $.isArray(me.require) && me.require.length > 0 ) ) );
		},
		
		/**
		* register a listener to this object, when the object fires a specific event
		* @param eventName :: string
		* @param callback :: function
		* @returns self
		*/
		on: function(eventName, callback){
			var me = this;
			if(!me.localEventRegistry[eventName]){
				me.localEventRegistry[eventName] = [];
			}
			callback.id = me.localEventId;
			localEventId = me.localEventId++;
			me.localEventRegistry[eventName].push(callback);
			return me;
		},
		
		/**
		* remove a listener that was registered with .on()
		* @param eventName :: string
		* @param callback :: function :: the function that was used during .on()
		* @returns self
		*/
		off: function(eventName, callback){
			var me = this;
			if(me.localEventRegistry[eventName]){
				$.each(me.localEventRegistry[eventName], function(i, func){
					if(func.id == callback.id){
						me.localEventRegistry[eventName].splice(i, 1);
						return false;
					}
				});
			}
			return me;
		},
		
		/**
		* Fire an event on this object
		* @param eventName :: string :: name of the event to fire`
		* @param args :: any... (optional)
		* @returns self
		*/
		fireEvent: function(){
			var me = this,
				args = arguments, 
				eventName = [].splice.call(arguments, 0, 1);	//get first argument - i.e. the event name
			
			if(me.localEventRegistry[eventName]){
				$.each(me.localEventRegistry[eventName], function(i, func){
					func.apply(func, args);
				});
			}
			return me;
		}
	});
	
	Firebrick.define("Firebrick.view.Base", {
		extends:"Firebrick.class.Base",
		
		/**
		* set when the view is loaded by the ajax request
		* @private
		*/
		tpl: "",
		/**
		* data to bind to the view
		*/
		data: "",
		/**
		* parsed html using the tpl and data
		*/
		html:"",
		/**
		* Target to which to render the html content
		* string || object :: jquery selector || jquery object
		*/
		target:null,
		/**
		* render the view on class creation
		*/
		autoRender:true,
		/**
		* controller to bind to the view
		* string || object :: name of the controller || controller class itself
		*/
		controller: null,
		/**
		* Rivets object that is returned when the template and data is bound
		*/
		rivets: null,
		rivets_config: {},
		
		/**
		* State the view is current in. "Initial", "Rendered"
		* @private
		*/
		state:"initial",

		/**
		* Called on creation
		*/
		init: function(){
			var me = this;
			//check the data of the view is in the correct format
			me.initStore();
			//parse html with data
			me.initView(me.tpl, me.getData());
			return me.callParent();
		},
		
		/**
		* Returns the store linked to the view
		*/
		getStore: function(){
			return this.data;
		},
		
		/**
		*	Returns data store data as object
		* @returns object
		*/
		getData: function(){
			return this.getStore().data;
		},
		
		/**
		* Construct the view with the Rivets template and data binding
		* @param html_template :: string (optional) :: rivets html
		* @param data :: object (optional) :: data to bind to the rivets template
		* @returns self
		*/
		initView: function(html_template, data){
			var me = this;
			me.html = html_template;
			
			//set rivet default configs
			me.rivets_config = me.rivets_config || $.isEmptyObject(me.rivets_config) ? {
				store: me.getStore()
			} : me.rivets_config;

			if(me.controller && !me.rivets_config.hasOwnProperty("controller")){
				me.rivets_config.controller = Firebrick.get(me.controller);
			}
			
			if(me.autoRender){
				me.render();
			}
			
			return me;
		},
		
		/**
		* @returns jquery object
		*/
		getTarget: function(){
			return Firebrick.view.getTarget(this.target);
		},
		
		/**
		* Calls renderTo without parameters
		* @returns self
		*/
		render:function(){
			return this.renderTo();
		},
		
		/**
		* Render view to specified target
		* @param target :: string || jQuery Object (optional) :: defaults to this.target
		* @returns self
		*/
		renderTo: function(target){
			var me = this,
				ovt = target,
				target = me.getTarget(target);
			
			if(target){
				
				Firebrick.view.renderTo(target, me.html);
			
				if(me.state == "initial"){
					me.rivets = rivets.bind(target, me.rivets_config);
					me.state = "rendered";
				}
				
			}else{
				console.warn("unable to render, no target found for", ovt || me.target, this);
			}
			
			return me;
		},
		
		/**
		* Converts View data into a Store if not already done
		* @private
		* @param :: object :: Firebrick.view.Base object
		* @returns view
		*/
		initStore:function(){
			var me = this;
			me.data = me.data || {};
			if(!me.data.isStore){
				me.data = Firebrick.createStore({data:me.data});
			}
			return me;
		},
		
		/**
		* Refresh the new with the template and data
		* @param data :: object :: extra data you wish to pass to the view
		* @returns self
		*/
		refresh:function(data){
			var me = this,
				store = me.getStore();
			
			if(data && store){
				$.each(data, function(k, v){
					store.data[k] = v;
				});
			}
			
			me.init();
			me.render();
			return me;
		}
		
	});
	
	Firebrick.define("Firebrick.controller.Base", {
		extends:"Firebrick.class.Base",
		/**
		*String or Array of Strings of classes/stores etc. that are needed
		*/
		require:[],
		
		/**
		* Called on creation
		*/
		init: function(){
			return this.callParent();
		},
		
		app:{
		
			/**
			* @see Firebrick.events.on()
			*/
			on: function(){
				return Firebrick.events.on.apply(Firebrick.events, arguments);
			},
			
			/**
			*	@see Firebrick.events.addListener
			*/
			listeners:function(){
				return Firebrick.events.addListener.apply(Firebrick.events, arguments);
			}
		}
	});
	
	Firebrick.define("Firebrick.store.Base", {
		extends:"Firebrick.class.Base",
		/**
		* Called on creation
		*/
		init: function(){
			var me = this;
			if(!me.dataInitialised){
				me.setData(me.data);
			}
			return this.callParent();
		},
		
		/**
		* Default store configurations
		* any types that jQuery allows in $.ajax()
		**/
		datatype: "json",
		/**
		* URL Config:
		* string :: only a get store - i.e. 1-way store, get information from the server
		* object :: mutliple directional store - get and send information to and from the server
		* @usage: url: "/getusers.php"
		* @usage: url: {
						get:"/getusers.php",
						submit: "/saveusers.php"
					}	
		*/
		url:{
			get:null,	//strings
			submit:null //strings 
		},
		
		/**
		* set the connection protocol, POST or GET for submit
		*/
		protocol: "POST",
		
		/**
		* Store status
		* @private
		* 1. initial :: store has just been created
		* 2. preload :: store is just about to fire the $.ajax event
		* 3. any :: success status of $.ajax()
		*/
		status:"initial",
		/**
		* Simple property to check whether this object is a store
		* @private
		*/
		isStore:true,
		/**
		* What is the root property in the stores data
		*/
		root: "root",
		/**
		* Whether the data in the store has been initialised, ie. convert to records etc.
		* @private
		**/
		dataInitialised: false,
		
		/**
		* Load the store
		* @usage load({
					callback:function(){},
					scope:this //scope for callback
				})
		* @param options :: object
		* @returns self
		*/
		load: function(options){
			return Firebrick.data.store.loadStore(this, options);
		},
		
		/**
		* Remove from Store by key where value = {value}
		* @usage remove("name", "bob");
		* @param key :: string :: search data for entry with key
		* @param value :: any :: if value matches that of the data with the {key} name then remove
		* @return self
		*/
		remove: function(key, value){
			var me = this;
			return Firebrick.data.store.remove(me, key, value);
		},
		
		/**
		* same as remove() just removes all instances found
		* @see remove
		*/
		removeAll: function(key, value){
			var me = this;
			return Firebrick.data.store.removeAll(me, key, value);
		},
		
		/**
		* Returns the store data attribute
		* @returns store data
		*/
		getData:function(){
			return this.data;
		},
		
		/**
		* Converts a json object into stores with records
		* @param data :: json object
		* @returns self
		*/
		setData: function(data){
			var me = this;
			Firebrick.data.store.setDataForStore(me, data);
			me.dataInitialised = true;
			return me;
		},
		
		/**
		* insert into store at specific position
		* @param pos :: int :: position at which you wish to add the data item
		* @param data :: any
		* @returns self
		*/
		insert:function(pos, data){
			var me = this;
			return Firebrick.data.store.insert(me, pos, data);
		},
		
		/**
		* adds to the end of the data items
		* @param data :: any
		* @returns self
		*/
		add: function(data){
			var me = this;
			return Firebrick.data.store.add(me, data);
		},
		
		/**
		* Finds first record matching key and value
		* @usage findRecord("text", "bob");
		* @param key :: string
		* @param value :: any
		* @returns record
		*/
		findRecord: function(key, value){
			var me = this;
			return Firebrick.data.store.findRecord(me, key, value);
		},
		
		/**
		* Finds all records matching key and value
		* @usage findRecord("text", "bob");
		* @param key :: string
		* @param value :: any
		* @returns record[]
		*/
		findAllRecords: function(key, value){
			var me = this;
			return Firebrick.data.store.findAllRecords(me, key, value);
		},
		
		/**
		* returns all root records or data - calls getRoot();
		* @returns any
		*/
		findAll: function(){
			return this.getRoot();
		},
		
		/**
		* @returns root data
		*/
		getRoot: function(){
			return this.data[this.root];
		},
		
		/**
		* @returns integer :: the length of getRoot(); as long as getRoot is an array, otherwise returns 0
		*/
		size: function(){
			var me = this;
			if($.isArray(me.getRoot())){
				return me.getRoot().length;
			}
			return 0;
		},
		
		/**
		* Submit the store data to the specified url.submit path
		* @returns store
		*/
		submit: function(){
			return Firebrick.data.store.submit(this);
		},
		
		/**
		* convert store data to a plain object
		* @returns object
		*/
		toPlainObject: function(){
			return Firebrick.data.convertToPlainObject(this.data);
		},
		
		/**
		* Convert store data to json string
		* @returns json string
		*/
		toJson: function(){
			return JSON.stringify(this.toPlainObject());
		}
		
	});
	
	Firebrick.define("Firebrick.record.Base", {
		extends:"Firebrick.class.Base",
		
		/**
		* unique id given on creation
		* @private
		*/
		recordId: null,
		/**
		* data to pass to the record
		*/
		data: null,
		/**
		* property to determine whether this class is a record
		*/
		isRecord: true,
		
		init:function(){
			var me = this;
			me.data = me.data || {};
			me.recordId = Firebrick.utils.uniqId();	//give this record an id
			return this.callParent();
		},
		
		/**
		* Returns the id specified in the data object - this is separate to that of the Record.id
		* @returns data.id || null;
		*/
		getDataId: function(){
			var me = this;
			if(me.data && me.data.id){
				return me.data.id;
			}
			return;
		},
		
		/**
		* Get the id of the record Record.recordId
		* @returns this.recordId
		*/
		getId: function(){
			return this.recordId;
		},
		
		/**
		* Add data to the current record data
		* @param data :: any :: adds the data to the current data values - overwrites when passed data is an object and the key is already present in this record
		* @returns self
		*/
		addData: function(data){
			var me = this;
			if($.isArray(me.data)){
				//if the current record data is an array we add the new data to the end
				me.data.push(data);
			}else if($.isPlainObject(me.data)){
				//if the current record data is an object, then we copy all the properties of the argument into the current data
				//note that the argument data must also be an object
				$.each(data, function(k,v){
					me.data[k] = v;
				});
			}else{
				//me.data is a primitive type so just overwrite it.
				me.data = data;
			}
			return me;
		},
		
		/**
		* Set the data property with new values
		* @param data :: any
		* @returns self
		*/
		setData: function(data){
			var me = this;
			me.data = data;
			return me;
		},
		
		/**
		* get data from the data object by key
		* @param key :: string (optional) :: returns all data when no key is specified
		* @returns any
		**/
		getData: function(key){
			var me = this;
			if(key){
				return me.formatter(me.data[key]);
			}
			return me.data;
		},
		
		/**
		* Set a value in the record 
		* @fires "recordChanged" :: record, key, value
		* @param key :: string :: key to which you wish to set the value too
		* @param value :: any :: value you wish to set
		* @returns self
		*/
		setValue:function(key, value){
			var me = this;
			if(me.data){
				if(me.data[key] !== value){
					me.data[key] = value;
					me.fireEvent("recordChanged", me, key, value);
				}
			}
			return me;
		},
		
		/**
		* Todo: allow user to define this
		*/
		formatter: function(value){
			return value;
		},
		
		/**
		*	returns the store data to JSON object
		* @returns object
		*/
		toPlainObject: function(){
			return Firebrick.data.convertToPlainObject(this.data);
		},
		
		/**
		* convert record to json string
		* @returns json string
		*/
		toJson: function(){
			return JSON.stringify(this.toPlainObject());
		}
		
		
	});
	
	/**
	* Rivets Extensions
	*/
	if(window.rivets){
		rivets.formatters.size = function(value){
			return value.length;
		}
		
		//Overwrite prototype function to access the model when calling a controller from the view
		//v0.6.10
		rivets._.Binding.prototype.set = function(value) {
			var _ref1;
			value = value instanceof Function && !this.binder["function"] ? this.formattedValue(value.call(this.model, this)) : this.formattedValue(value);
			return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
		};
		
	}
	/*** EO Rivets Extensions **/
	
	window.Firebrick = Firebrick;
	
})(window, document, jQuery);
