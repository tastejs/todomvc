/*global OpenAjax: true */

steal.plugins('jquery/class', 'jquery/lang').then(function() {
	
	//helper stuff for later.  Eventually, might not need jQuery.
	var underscore = $.String.underscore,
		classize = $.String.classize,
		isArray = $.isArray,
		makeArray = $.makeArray,
		extend = $.extend,
		each = $.each,
		reqType = /GET|POST|PUT|DELETE/i,
		ajax = function(ajaxOb, attrs, success, error, fixture, type, dataType){
			var dataType = dataType || "json",
				src = "",
				tmp;
			if(typeof ajaxOb == "string"){
				var sp = ajaxOb.indexOf(" ")
				if( sp > 2 && sp <7){
					tmp = ajaxOb.substr(0,sp);
					if(reqType.test(tmp)){
						type = tmp;
					}else{
						dataType = tmp;
					}
					src = ajaxOb.substr(sp+1)
				}else{
					src = ajaxOb;
				}
			}
			attrs = extend({},attrs)
			
			var url = $.String.sub(src, attrs, true)
			return $.ajax({
				url : url,
				data : attrs,
				success : success,
				error: error,
				type : type || "post",
				dataType : dataType,
				fixture: fixture
			});
		},
		//guesses at a fixture name
		fixture = function(extra, or){
			var u = underscore( this.shortName ),
				f = "-"+u+(extra||"");
			return $.fixture && $.fixture[f] ? f : or ||
				"//"+underscore( this.fullName )
						.replace(/\.models\..*/,"")
						.replace(/\./g,"/")+"/fixtures/"+u+
						(extra || "")+".json";
		},
		addId = function(attrs, id){
			attrs = attrs || {};
			var identity = this.id;
			if(attrs[identity] && attrs[identity] !== id){
				attrs["new"+$.String.capitalize(id)] = attrs[identity];
				delete attrs[identity];
			}
			attrs[identity] = id;
			return attrs;
		},
		getList = function(type){
			var listType = type || $.Model.List || Array;
			return new listType();
		},
		getId = function(inst){
			return inst[inst.Class.id]
		},
		unique = function(items){
	        var collect = [];
	        for(var i=0; i < items.length; i++){
	            if(!items[i]["__u Nique"]){
	                collect.push(items[i]);
	                items[i]["__u Nique"] = true;
	            }
	        }
	        for(i=0; i< collect.length; i++){
	            delete collect[i]["__u Nique"];
	        }
	        return collect;
	    },
		// makes a deferred request
		makeRequest = function(self, type, success, error, method){
			var deferred = $.Deferred(),
				resolve = function(data){
					self[method || type+"d"](data);
					deferred.resolveWith(self,[self, data, type]);
				},
				reject = function(data){
					deferred.rejectWith(self, [data])
				},
				args = [self.attrs(), resolve, reject];
				
			if(type == 'destroy'){
				args.shift();
			}	
				
			if(type !== 'create' ){
				args.unshift(getId(self))
			} 
			
			deferred.then(success);
			deferred.fail(error);
			
			self.Class[type].apply(self.Class, args);
				
			return deferred.promise();
		},
		// a quick way to tell if it's an object and not some string
		isObject = function(obj){
			return typeof obj === 'object' && obj !== null && obj;
		},
		$method = function(name){
			return function( eventType, handler ) {
				$.fn[name].apply($([this]), arguments);
				return this;
			}
		},
		bind = $method('bind'),
		unbind = $method('unbind');
	/**
	 * @class jQuery.Model
	 * @tag core
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/model.js
	 * @test jquery/model/qunit.html
	 * @plugin jquery/model
	 * 
	 * Models wrap an application's data layer.  In large applications, a model is critical for:
	 * 
	 *  - [jquery.model.encapsulate Encapsulating] services so controllers + views don't care where data comes from.
	 *    
	 *  - Providing helper functions that make manipulating and abstracting raw service data easier.
	 * 
	 * This is done in two ways:
	 * 
	 *  - Requesting data from and interacting with services
	 *  
	 *  - Converting or wrapping raw service data into a more useful form.
	 * 
	 * 
	 * ## Basic Use
	 * 
	 * The [jQuery.Model] class provides a basic skeleton to organize pieces of your application's data layer.
	 * First, consider doing Ajax <b>without</b> a model.  In our imaginary app, you:
	 * 
	 *  - retrieve a list of tasks</li>
	 *  - display the number of days remaining for each task
	 *  - mark tasks as complete after users click them
	 * 
	 * Let's see how that might look without a model:
	 * 
	 * @codestart
	 * $.Controller("Tasks",
	 * {
	 *   // get tasks when the page is ready 
	 *   init: function() {
	 *     $.get('/tasks.json', this.callback('gotTasks'), 'json')
	 *   },
	 *  |* 
	 *   * assume json is an array like [{name: "trash", due_date: 1247111409283}, ...]
	 *   *|
	 *  gotTasks: function( json ) { 
	 *     for(var i =0; i < json.length; i++){
	 *       var taskJson = json[i];
	 *       
	 *       //calculate time remaining
	 *       var remaininTime = new Date() - new Date(taskJson.due_date);
	 *       
	 *       //append some html
	 *       $("#tasks").append("&lt;div class='task' taskid='"+taskJson.id+"'>"+
	 *                           "&lt;label>"+taskJson.name+"&lt;/label>"+
	 *                           "Due Date = "+remaininTime+"&lt;/div>")
	 *     }
	 *   },
	 *   // when a task is complete, get the id, make a request, remove it
	 *   ".task click" : function( el ) {
	 *     $.post('/tasks/'+el.attr('data-taskid')+'.json',
	 *     	 {complete: true}, 
	 *       function(){
	 *         el.remove();
	 *       })
	 *   }
	 * })
	 * @codeend
	 * 
	 * This code might seem fine for right now, but what if:
	 * 
	 *  - The service changes?
	 *  - Other parts of the app want to calculate <code>remaininTime</code>?
	 *  - Other parts of the app want to get tasks?</li>
	 *  - The same task is represented multiple palces on the page?
	 * 
	 * The solution is of course a strong model layer.  Lets look at what a
	 * a good model does for a controller before we learn how to make one:
	 * 
	 * @codestart
	 * $.Controller("Tasks",
	 * {
	 *   init: function() {
	 *     Task.findAll({}, this.callback('tasks'));
	 *   },
	 *   list : function(todos){
	 *     this.element.html("tasks.ejs", todos );
	 *   },
	 *   ".task click" : function( el ) {
	 *     el.model().update({complete: true},function(){
	 *       el.remove();
	 *     });
	 *   }
	 * });
	 * @codeend
	 * 
	 * In tasks.ejs
	 * 
	 * @codestart html
	 * &lt;% for(var i =0; i &lt; tasks.length; i++){ %>
	 * &lt;div &lt;%= tasks[i] %>>
	 *    &lt;label>&lt;%= tasks[i].name %>&lt;/label>
	 *    &lt;%= tasks[i].<b>timeRemaining</b>() %>
	 * &lt;/div>
	 * &lt;% } %>
	 * @codeend
	 * 
	 * Isn't that better!  Granted, some of the improvement comes because we used a view, but we've
	 * also made our controller completely understandable.  Now lets take a look at the model:
	 * 
	 * @codestart
	 * $.Model("Task",
	 * {
	 *  findAll: "/tasks.json",
	 *  update: "/tasks/{id}.json"
	 * },
	 * {
	 *  timeRemaining: function() {
	 *   return new Date() - new Date(this.due_date)
	 *  }
	 * })
	 * @codeend
	 * 
	 * Much better!  Now you have a single place where you 
	 * can organize Ajax functionality and
	 * wrap the data that it returned.  Lets go through 
	 * each bolded item in the controller and view.
	 * 
	 * ### Task.findAll
	 * 
	 * The findAll function requests data from "/tasks.json".  When the data is returned, 
	 * it converted by the [jQuery.Model.static.models models] function before being 
	 * passed to the success callback.
	 * 
	 * ### el.model
	 * 
	 * [jQuery.fn.model] is a jQuery helper that returns a model instance from an element.  The 
	 * list.ejs template assings tasks to elements with the following line:
	 * 
	 * @codestart html
	 * &lt;div &lt;%= tasks[i] %>> ... &lt;/div>
	 * @codeend
	 * 
	 * ### timeRemaining
	 * 
	 * timeRemaining is an example of wrapping your model's raw data with more useful functionality.
	 * 
	 * ## Other Good Stuff
	 * 
	 * This is just a tiny taste of what models can do.  Check out these other features:
	 * 
	 * ### [jquery.model.encapsulate Encapsulation]
	 * 
	 * Learn how to connect to services.
	 * 
	 *     $.Model("Task",{
	 *       findAll : "/tasks.json",    
	 *       findOne : "/tasks/{id}.json", 
	 *       create : "/tasks.json",
	 *       update : "/tasks/{id}.json"
	 *     },{})
	 * 
	 * ### [jquery.model.typeconversion Type Conversion]
	 * 
	 * Convert data like "10-20-1982" into new Date(1982,9,20) auto-magically:
	 * 
	 *     $.Model("Task",{
	 *       attributes : {birthday : "date"}
	 *       convert : {
	 *         date : function(raw){ ... }
	 *       }
	 *     },{})
	 * 
	 * ### [jQuery.Model.List]
	 * 
	 * Learn how to handle multiple instances with ease.
	 * 
	 *     $.Model.List("Task.List",{
	 *       destroyAll : function(){
	 *         var ids = this.map(function(c){ return c.id });
	 *         $.post("/destroy",
	 *           ids,
	 *           this.callback('destroyed'),
	 *           'json')
	 *       },
	 *       destroyed : function(){
	 *         this.each(function(){ this.destroyed() });
	 *       }
	 *     });
	 *     
	 *     ".destroyAll click" : function(){
	 *       this.find('.destroy:checked')
	 *           .closest('.task')
	 *           .models()
	 *           .destroyAll();
	 *     }
	 * 
	 * ### [jquery.model.validations Validations]
	 * 
	 * Validate your model's attributes.
	 * 
	 *     $.Model("Contact",{
	 *     init : function(){
	 *         this.validate("birthday",function(){
	 *             if(this.birthday > new Date){
	 *                 return "your birthday needs to be in the past"
	 *             }
	 *         })
	 *     }
	 *     ,{});
	 *     
	 *     
	 */
		// methods that we'll weave into model if provided
		ajaxMethods = 
		/** 
	     * @Static
	     */
		{
		create: function(str  ) {
			/**
			 * @function create
			 * Create is used to create a model instance on the server.  By implementing 
			 * create along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * API for services.  
			 * 
			 * Create is called by save to create a new instance.  If you want to be able to call save on an instance
			 * you have to implement create.
			 * 
			 * The easiest way to implement create is to just give it the url to post data to:
			 * 
			 *     $.Model("Recipe",{
			 *       create: "/recipes"
			 *     },{})
			 *     
			 * This lets you create a recipe like:
			 *  
			 *     new Recipe({name: "hot dog"}).save(function(){
			 *       this.name //this is the new recipe
			 *     }).save(callback)
			 *  
			 * You can also implement create by yourself.  You just need to call success back with
			 * an object that contains the id of the new instance and any other properties that should be
			 * set on the instance.
			 *  
			 * For example, the following code makes a request 
			 * to '/recipes.json?name=hot+dog' and gets back
			 * something that looks like:
			 *  
			 *     { 
			 *       id: 5,
			 *       createdAt: 2234234329
			 *     }
			 * 
			 * The code looks like:
			 * 
			 *     $.Model("Recipe", {
			 *       create : function(attrs, success, error){
			 *         $.post("/recipes.json",attrs, success,"json");
			 *       }
			 *     },{})
			 * 
			 * ## API
			 * 
			 * @param {Object} attrs Attributes on the model instance
			 * @param {Function} success(attrs) the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function(attrs, success, error){
				return ajax(str, attrs, success, error, "-restCreate")
			};
		},
		update: function( str ) {
			/**
			 * @function update
			 * Update is used to update a model instance on the server.  By implementing 
			 * update along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * API for services.  
			 * 
			 * Update is called by [jQuery.Model.prototype.save] or [jQuery.Model.prototype.update] 
			 * on an existing model instance.  If you want to be able to call save on an instance
			 * you have to implement update.
			 * 
			 * The easist way to implement update is to just give it the url to put data to:
			 * 
			 *     $.Model("Recipe",{
			 *       create: "/recipes/{id}"
			 *     },{})
			 *     
			 * This lets you update a recipe like:
			 *  
			 *     // PUT /recipes/5 {name: "Hot Dog"}
			 *     recipe.update({name: "Hot Dog"},
			 *       function(){
			 *         this.name //this is the updated recipe
			 *       })
			 *  
			 * If your server doesn't use PUT, you can change it to post like:
			 * 
			 *     $.Model("Recipe",{
			 *       create: "POST /recipes/{id}"
			 *     },{})
			 * 
			 * Your server should send back an object with any new attributes the model 
			 * should have.  For example if your server udpates the "updatedAt" property, it
			 * should send back something like:
			 * 
			 *     // PUT /recipes/4 {name: "Food"} ->
			 *     {
			 *       updatedAt : "10-20-2011"
			 *     }
			 * 
			 * You can also implement create by yourself.  You just need to call success back with
			 * an object that contains any properties that should be
			 * set on the instance.
			 *  
			 * For example, the following code makes a request 
			 * to '/recipes/5.json?name=hot+dog' and gets back
			 * something that looks like:
			 *  
			 *     { 
			 *       updatedAt: "10-20-2011"
			 *     }
			 * 
			 * The code looks like:
			 * 
			 *     $.Model("Recipe", {
			 *       update : function(id, attrs, success, error){
			 *         $.post("/recipes/"+id+".json",attrs, success,"json");
			 *       }
			 *     },{})
			 * 
			 * ## API
			 * 
			 * @param {String} id the id of the model instance
			 * @param {Object} attrs Attributes on the model instance
			 * @param {Function} success(attrs) the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function(id, attrs, success, error){
				return ajax(str, addId.call(this,attrs, id), success, error, "-restUpdate","put")
			}
		},
		destroy: function( str ) {
			/**
			 * @function destroy
			 * Destroy is used to remove a model instance from the server. By implementing 
			 * destroy along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * 
			 * You can implement destroy with a string like:
			 * 
			 *     $.Model("Thing",{
			 *       destroy : "POST /thing/destroy/{id}"
			 *     })
			 * 
			 * Or you can implement destroy manually like:
			 * 
			 *     $.Model("Thing",{
			 *       destroy : function(id, success, error){
			 *         $.post("/thing/destroy/"+id,{}, success);
			 *       }
			 *     })
			 * 
			 * You just have to call success if the destroy was successful.
			 * 
			 * @param {String|Number} id the id of the instance you want destroyed
			 * @param {Function} success the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function( id, success, error ) {
				var attrs = {};
				attrs[this.id] = id;
				return ajax(str, attrs, success, error, "-restDestroy","delete")
			}
		},
		
		findAll: function( str ) {
			/**
			 * @function findAll
			 * FindAll is used to retrive a model instances from the server. By implementing 
			 * findAll along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * findAll returns a deferred ($.Deferred)
			 * 
			 * You can implement findAll with a string:
			 * 
			 *     $.Model("Thing",{
			 *       findAll : "/things.json"
			 *     },{})
			 * 
			 * Or you can implement it yourself.  The 'dataType' attribute is used to convert a JSON array of attributes
			 * to an array of instances.  For example:
			 * 
			 *     $.Model("Thing",{
			 *       findAll : function(params, success, error){
			 *         return $.ajax({
			 *         	 url: '/things.json',
			 *           type: 'get',
			 *           dataType: 'json thing.models',
			 *           data: params,
			 *           success: success,
			 *           error: error})
			 *       }
			 *     },{})
			 * 
			 * ## API
			 * 
			 * @param {Object} params data to refine the results.  An example might be passing {limit : 20} to
			 * limit the number of items retrieved.
			 * @param {Function} success(items) called with an array (or Model.List) of model instances.
			 * @param {Function} error
			 */
			return function(params, success, error){
				return ajax(str || this.shortName+"s.json", 
					params, 
					success, 
					error, 
					fixture.call(this,"s"),
					"get",
					"json "+this._shortName+".models");
			};
		},
		findOne: function( str ) {
			/**
			 * @function findOne
			 * FindOne is used to retrive a model instances from the server. By implementing 
			 * findOne along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * 
			 * You can implement findOne with a string:
			 * 
			 *     $.Model("Thing",{
			 *       findOne : "/things/{id}.json"
			 *     },{})
			 * 
			 * Or you can implement it yourself. 
			 * 
			 *     $.Model("Thing",{
			 *       findOne : function(params, success, error){
			 *         var self = this,
			 *             id = params.id;
			 *         delete params.id;
			 *         return $.get("/things/"+id+".json",
			 *           params,
			 *           success,
			 *           "json thing.model")
			 *       }
			 *     },{})
			 * 
			 * ## API
			 * 
			 * @param {Object} params data to refine the results. This is often something like {id: 5}.
			 * @param {Function} success(item) called with a model instance
			 * @param {Function} error
			 */
			return function(params, success, error){
				return ajax(str,
					params, 
					success,
					error, 
					fixture.call(this),
					"get",
					"json "+this._shortName+".model");
			};
		}
	};





	jQuery.Class("jQuery.Model",	{
		setup: function( superClass , stat, proto) {
			//we do not inherit attributes (or associations)
			var self=this;
			each(["attributes","associations","validations"],function(i,name){
				if (!self[name] || superClass[name] === self[name] ) {
					self[name] = {};
				}
			})

			//add missing converters
			if ( superClass.convert != this.convert ) {
				this.convert = extend(superClass.convert, this.convert);
			}


			this._fullName = underscore(this.fullName.replace(/\./g, "_"));
			this._shortName = underscore(this.shortName);

			if ( this.fullName.substr(0, 7) == "jQuery." ) {
				return;
			}

			//add this to the collection of models
			//jQuery.Model.models[this._fullName] = this;

			if ( this.listType ) {
				this.list = new this.listType([]);
			}
			//@steal-remove-start
			if (! proto ) {
				steal.dev.warn("model.js "+this.fullName+" has no static properties.  You probably need  ,{} ")
			}
			//@steal-remove-end
			for(var name in ajaxMethods){
				if(typeof this[name] !== 'function'){
					this[name] = ajaxMethods[name](this[name]);
				}
			}
			
			//add ajax converters
			var converters = {},
				convertName = "* "+this._shortName+".model";
			converters[convertName+"s"] = this.callback('models');
			converters[convertName] = this.callback('model');
			$.ajaxSetup({
				converters : converters
			});				
		},
		/**
		 * @attribute attributes
		 * Attributes contains a list of properties and their types
		 * for this model.  You can use this in conjunction with 
		 * [jQuery.Model.static.convert] to provide automatic 
		 * [jquery.model.typeconversion type conversion].  
		 * 
		 * The following converts dueDates to JavaScript dates:
		 * 
		 * @codestart
		 * $.Model("Contact",{
		 *   attributes : { 
		 *     birthday : 'date'
		 *   },
		 *   convert : {
		 *     date : function(raw){
		 *       if(typeof raw == 'string'){
		 *         var matches = raw.match(/(\d+)-(\d+)-(\d+)/)
		 *         return new Date( matches[1], 
		 *                  (+matches[2])-1, 
		 *                 matches[3] )
		 *       }else if(raw instanceof Date){
		 *           return raw;
		 *       }
		 *     }
		 *   }
		 * },{})
		 * @codeend
		 */
		attributes: {},
		/**
		 * @function wrap
		 * @hide
		 * @tag deprecated
		 * __warning__ : wrap is deprecated in favor of [jQuery.Model.static.model].  They 
		 * provide the same functionality; however, model works better with Deferreds.
		 * 
		 * Wrap is used to create a new instance from data returned from the server.
		 * It is very similar to doing <code> new Model(attributes) </code> 
		 * except that wrap will check if the data passed has an
		 * 
		 * - attributes,
		 * - data, or
		 * - <i>singularName</i>
		 * 
		 * property.  If it does, it will use that objects attributes.
		 * 
		 * Wrap is really a convience method for servers that don't return just attributes.
		 * 
		 * @param {Object} attributes
		 * @return {Model} an instance of the model
		 */
		// wrap place holder
		/**
		 * $.Model.model is used as a [http://api.jquery.com/extending-ajax/#Converters Ajax converter] 
		 * to convert the response of a [jQuery.Model.static.findOne] request 
		 * into a model instance.  
		 * 
		 * You will never call this method directly.  Instead, you tell $.ajax about it in findOne:
		 * 
		 *     $.Model('Recipe',{
		 *       findOne : function(params, success, error ){
		 *         return $.ajax({
		 *           url: '/services/recipes/'+params.id+'.json',
		 *           type: 'get',
		 *           
		 *           dataType : 'json recipe.model' //LOOK HERE!
		 *         });
		 *       }
		 *     },{})
		 * 
		 * This makes the result of findOne a [http://api.jquery.com/category/deferred-object/ $.Deferred]
		 * that resolves to a model instance:
		 * 
		 *     var deferredRecipe = Recipe.findOne({id: 6});
		 *     
		 *     deferredRecipe.then(function(recipe){
		 *       console.log('I am '+recipes.description+'.');
		 *     })
		 * 
		 * ## Non-standard Services
		 * 
		 * $.jQuery.model expects data to be name-value pairs like:
		 * 
		 *     {id: 1, name : "justin"}
		 *     
		 * It can also take an object with attributes in a data, attributes, or
		 * 'shortName' property.  For a App.Models.Person model the following will  all work:
		 * 
		 *     { data : {id: 1, name : "justin"} }
		 *     
		 *     { attributes : {id: 1, name : "justin"} }
		 *     
		 *     { person : {id: 1, name : "justin"} }
		 * 
		 * 
		 * ### Overwriting Model
		 * 
		 * If your service returns data like:
		 * 
		 *     {id : 1, name: "justin", data: {foo : "bar"} }
		 *     
		 * This will confuse $.Model.model.  You will want to overwrite it to create 
		 * an instance manually:
		 * 
		 *     $.Model('Person',{
		 *       model : function(data){
		 *         return new this(data);
		 *       }
		 *     },{})
		 *     
		 * ## API
		 * 
		 * @param {Object} attributes An object of name-value pairs or an object that has a 
		 *  data, attributes, or 'shortName' property that maps to an object of name-value pairs.
		 * @return {Model} an instance of the model
		 */
		model: function( attributes ) {
			if (!attributes ) {
				return null;
			}
			return new this(
				// checks for properties in an object (like rails 2.0 gives);
				isObject(attributes[this._shortName]) ||
				isObject(attributes.data) || 
				isObject(attributes.attributes) || 
				attributes);
		},
		/**
		 * @function wrapMany
		 * @hide
		 * @tag deprecated
		 * 
		 * __warning__ : wrapMany is deprecated in favor of [jQuery.Model.static.models].  They 
		 * provide the same functionality; however, models works better with Deferreds.
		 * 
		 * $.Model.wrapMany converts a raw array of JavaScript Objects into an array (or [jQuery.Model.List $.Model.List]) of model instances.
		 * 
		 *     // a Recipe Model wi
		 *     $.Model("Recipe",{
		 *       squareId : function(){
		 *         return this.id*this.id;
		 *       }
		 *     })
		 * 
		 *     var recipes = Recipe.wrapMany([{id: 1},{id: 2}])
		 *     recipes[0].squareId() //-> 1
		 * 
		 * If an array is not passed to wrapMany, it will look in the object's .data
		 * property.  
		 * 
		 * For example:
		 * 
		 *     var recipes = Recipe.wrapMany({data: [{id: 1},{id: 2}]})
		 *     recipes[0].squareId() //-> 1
		 * 
		 * 
		 * Often wrapMany is used with this.callback inside a model's [jQuery.Model.static.findAll findAll]
		 * method like:
		 * 
		 *     findAll : function(params, success, error){
		 *       $.get('/url',
		 *             params,
		 *             this.callback(['wrapMany',success]), 'json' )
		 *     }
		 * 
		 * If you are having problems getting your model to callback success correctly,
		 * make sure a request is being made (with firebug's net tab).  Also, you 
		 * might not use this.callback and instead do:
		 * 
		 *     findAll : function(params, success, error){
		 *       self = this;
		 *       $.get('/url',
		 *             params,
		 *             function(data){
		 *               var wrapped = self.wrapMany(data);
		 *               success(wrapped)
		 *             },
		 *             'json')
		 *     }
		 * 
		 * ## API
		 * 
		 * @param {Array} instancesRawData an array of raw name - value pairs like
		 * 
		 *     [{name: "foo", id: 4},{name: "bar", id: 5}]
		 *     
		 * @return {Array} a JavaScript array of instances or a [jQuery.Model.List list] of instances
		 *  if the model list plugin has been included.
		 */
		// wrapMany placeholder
		/**
		 * $.Model.models is used as a [http://api.jquery.com/extending-ajax/#Converters Ajax converter] 
		 * to convert the response of a [jQuery.Model.static.findAll] request 
		 * into an array (or [jQuery.Model.List $.Model.List]) of model instances.  
		 * 
		 * You will never call this method directly.  Instead, you tell $.ajax about it in findAll:
		 * 
		 *     $.Model('Recipe',{
		 *       findAll : function(params, success, error ){
		 *         return $.ajax({
		 *           url: '/services/recipes.json',
		 *           type: 'get',
		 *           data: params
		 *           
		 *           dataType : 'json recipe.models' //LOOK HERE!
		 *         });
		 *       }
		 *     },{})
		 * 
		 * This makes the result of findAll a [http://api.jquery.com/category/deferred-object/ $.Deferred]
		 * that resolves to a list of model instances:
		 * 
		 *     var deferredRecipes = Recipe.findAll({});
		 *     
		 *     deferredRecipes.then(function(recipes){
		 *       console.log('I have '+recipes.length+'recipes.');
		 *     })
		 * 
		 * ## Non-standard Services
		 * 
		 * $.jQuery.models expects data to be an array of name-value pairs like:
		 * 
		 *     [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
		 *     
		 * It can also take an object with additional data about the array like:
		 * 
		 *     {
		 *       count: 15000 //how many total items there might be
		 *       data: [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
		 *     }
		 * 
		 * In this case, models will return an array of instances found in 
		 * data, but with additional properties as expandos on the array:
		 * 
		 *     var people = Person.models({
		 *       count : 1500,
		 *       data : [{id: 1, name: 'justin'}, ...]
		 *     })
		 *     people[0].name // -> justin
		 *     people.count // -> 1500
		 * 
		 * ### Overwriting Models
		 * 
		 * If your service returns data like:
		 * 
		 *     {ballers: [{name: "justin", id: 5}]}
		 * 
		 * You will want to overwrite models to pass the base models what it expects like:
		 * 
		 *     $.Model('Person',{
		 *       models : function(data){
		 *         this._super(data.ballers);
		 *       }
		 *     },{})
		 * 
		 * @param {Array} instancesRawData an array of raw name - value pairs.
		 * @return {Array} a JavaScript array of instances or a [jQuery.Model.List list] of instances
		 *  if the model list plugin has been included.
		 */
		models: function( instancesRawData ) {
			if (!instancesRawData ) {
				return null;
			}
			var res = getList(this.List),
				arr = isArray(instancesRawData),
				raw = arr ? instancesRawData : instancesRawData.data,
				length = raw.length,
				i = 0;
			//@steal-remove-start
			if (! length ) {
				steal.dev.warn("model.js models has no data.  If you have one item, use model")
			}
			//@steal-remove-end
			res._use_call = true; //so we don't call next function with all of these
			for (; i < length; i++ ) {
				res.push(this.model(raw[i]));
			}
			if (!arr ) { //push other stuff onto array
				for ( var prop in instancesRawData ) {
					if ( prop !== 'data' ) {
						res[prop] = instancesRawData[prop];
					}

				}
			}
			return res;
		},
		/**
		 * The name of the id field.  Defaults to 'id'. Change this if it is something different.
		 * 
		 * For example, it's common in .NET to use Id.  Your model might look like:
		 * 
		 * @codestart
		 * $.Model("Friends",{
		 *   id: "Id"
		 * },{});
		 * @codeend
		 */
		id: 'id',
		//if null, maybe treat as an array?
		/**
		 * Adds an attribute to the list of attributes for this class.
		 * @hide
		 * @param {String} property
		 * @param {String} type
		 */
		addAttr: function( property, type ) {
			var stub;

			if ( this.associations[property] ) {
				return;
			}
			
			stub = this.attributes[property] || (this.attributes[property] = type);
			return type;
		},
		// a collection of all models
		_models: {},
		/**
		 * If OpenAjax is available,
		 * publishes to OpenAjax.hub.  Always adds the shortName.event.
		 * 
		 * @codestart
		 * // publishes contact.completed
		 * Namespace.Contact.publish("completed",contact);
		 * @codeend
		 * 
		 * @param {String} event The event name to publish
		 * @param {Object} data The data to publish
		 */
		publish: function( event, data ) {
			//@steal-remove-start
			steal.dev.log("Model.js - publishing " + this._shortName + "." + event);
			//@steal-remove-end
			if ( window.OpenAjax ) {
				OpenAjax.hub.publish(this._shortName + "." + event, data);
			}

		},
		guessType : function(){
			return "string"
		},
		/**
		 * @attribute convert
		 * @type Object
		 * An object of name-function pairs that are used to convert attributes.
		 * Check out [jQuery.Model.static.attributes] or 
		 * [jquery.model.typeconversion type conversion]
		 * for examples.
		 */
		convert: {
			"date": function( str ) {
				return typeof str === "string" ? (isNaN(Date.parse(str)) ? null : Date.parse(str)) : str;
			},
			"number": function( val ) {
				return parseFloat(val);
			},
			"boolean": function( val ) {
				return Boolean(val);
			}
		},
		bind: bind,
		unbind: unbind
	},
	/**
	 * @Prototype
	 */
	{
		/**
		 * Setup is called when a new model instance is created.
		 * It adds default attributes, then whatever attributes
		 * are passed to the class.
		 * Setup should never be called directly.
		 * 
		 * @codestart
		 * $.Model("Recipe")
		 * var recipe = new Recipe({foo: "bar"});
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * @param {Object} attributes a hash of attributes
		 */
		setup: function( attributes ) {
			// so we know not to fire events
			this._init = true;
			this.attrs(extend({},this.Class.defaults,attributes));
			delete this._init;
		},
		/**
		 * Sets the attributes on this instance and calls save.
		 * The instance needs to have an id.  It will use
		 * the instance class's [jQuery.Model.static.update update]
		 * method.
		 * 
		 * @codestart
		 * recipe.update({name: "chicken"}, success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, the model will also
		 * publish a "<i>modelName</i>.updated" message with
		 * the updated instance.
		 * 
		 * @param {Object} attrs the model's attributes
		 * @param {Function} success called if a successful update
		 * @param {Function} error called if there's an error
		 */
		update: function( attrs, success, error ) {
			this.attrs(attrs);
			return this.save(success, error); //on success, we should 
		},
		/**
		 * Runs the validations on this model.  You can
		 * also pass it an array of attributes to run only those attributes.
		 * It returns nothing if there are no errors, or an object
		 * of errors by attribute.
		 * 
		 * To use validations, it's suggested you use the 
		 * model/validations plugin.
		 * 
		 * @codestart
		 * $.Model("Task",{
		 *   init : function(){
		 *     this.validatePresenceOf("dueDate")
		 *   }
		 * },{});
		 * 
		 * var task = new Task(),
		 *     errors = task.errors()
		 * 
		 * errors.dueDate[0] //-> "can't be empty"
		 * @codeend
		 */
		errors: function( attrs ) {
			if ( attrs ) {
				attrs = isArray(attrs) ? attrs : makeArray(arguments);
			}
			var errors = {},
				self = this,
				addErrors = function( attr, funcs ) {
					each(funcs, function( i, func ) {
						var res = func.call(self);
						if ( res ) {
							if (!errors.hasOwnProperty(attr) ) {
								errors[attr] = [];
							}

							errors[attr].push(res);
						}

					});
				};

			each(attrs || this.Class.validations || {}, function( attr, funcs ) {
				if ( typeof attr == 'number' ) {
					attr = funcs;
					funcs = self.Class.validations[attr];
				}
				addErrors(attr, funcs || []);
			});

			for ( var attr in errors ) {
				if ( errors.hasOwnProperty(attr) ) {
					return errors;
				}
			}
			return null;
		},
		/**
		 * Gets or sets an attribute on the model using setters and 
		 * getters if available.
		 * 
		 * @codestart
		 * $.Model("Recipe")
		 * var recipe = new Recipe();
		 * recipe.attr("foo","bar")
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * ## Setters
		 * 
		 * If you add a set<i>AttributeName</i> method on your model,
		 * it will be used to set the value.  The set method is called
		 * with the value and is expected to return the converted value.
		 * 
		 * @codestart
		 * $.Model("Recipe",{
		 *   setCreatedAt : function(raw){
		 *     return Date.parse(raw)
		 *   }
		 * })
		 * var recipe = new Recipe();
		 * recipe.attr("createdAt","Dec 25, 1995")
		 * recipe.createAt //-> Date
		 * @codeend
		 * 
		 * ## Asynchronous Setters
		 * 
		 * Sometimes, you want to perform an ajax request when 
		 * you set a property.  You can do this with setters too.
		 * 
		 * To do this, your setter should return undefined and
		 * call success with the converted value.  For example:
		 * 
		 * @codestart
		 * $.Model("Recipe",{
		 *   setTitle : function(title, success, error){
		 *     $.post(
		 *       "recipe/update/"+this.id+"/title",
		 *       title,
		 *       function(){
		 *         success(title);
		 *       },
		 *       "json")
		 *   }
		 * })
		 * 
		 * recipe.attr("title","fish")
		 * @codeend
		 * 
		 * ## Events
		 * 
		 * When you use attr, it can also trigger events.  This is
		 * covered in [jQuery.Model.prototype.bind].
		 * 
		 * @param {String} attribute the attribute you want to set or get
		 * @param {String|Number|Boolean} [value] value the value you want to set.
		 * @param {Function} [success] an optional success callback.  
		 *    This gets called if the attribute was successful.
		 * @param {Function} [error] an optional success callback.  
		 *    The error function is called with validation errors.
		 */
		attr: function( attribute, value, success, error ) {
			var cap = classize(attribute),
				get = "get" + cap;
			if ( value !== undefined ) {
				this._setProperty(attribute, value, success, error, cap);
				return this;
			}
			return this[get] ? this[get]() : this[attribute];
		},
		/**
		 * Binds to events on this model instance.  Typically 
		 * you'll bind to an attribute name.  Handler will be called
		 * every time the attribute value changes.  For example:
		 * 
		 * @codestart
		 * $.Model("School")
		 * var school = new School();
		 * school.bind("address", function(ev, address){
		 *   alert('address changed to '+address);
		 * })
		 * school.attr("address","1124 Park St");
		 * @codeend
		 * 
		 * You can also bind to attribute errors.
		 * 
		 * @codestart
		 * $.Model("School",{
		 *   setName : function(name, success, error){
		 *     if(!name){
		 *        error("no name");
		 *     }
		 *     return error;
		 *   }
		 * })
		 * var school = new School();
		 * school.bind("error.name", function(ev, mess){
		 *    mess // -> "no name";
		 * })
		 * school.attr("name","");
		 * @codeend
		 * 
		 * You can also bind to created, updated, and destroyed events.
		 * 
		 * @param {String} eventType the name of the event.
		 * @param {Function} handler a function to call back when an event happens on this model.
		 * @return {model} the model instance for chaining
		 */
		bind: bind,
		/**
		 * Unbinds an event handler from this instance.
		 * Read [jQuery.Model.prototype.bind] for 
		 * more information.
		 * @param {String} eventType
		 * @param {Function} handler
		 */
		unbind: unbind,
		/**
		 * Checks if there is a set_<i>property</i> value.  If it returns true, lets it handle; otherwise
		 * saves it.
		 * @hide
		 * @param {Object} property
		 * @param {Object} value
		 */
		_setProperty: function( property, value, success, error, capitalized ) {
			// the potential setter name
			var setName = "set" + capitalized,
				//the old value
				old = this[property],
				self = this,
				errorCallback = function( errors ) {
					var stub;
					stub = error && error.call(self, errors);
					$(self).triggerHandler("error." + property, errors);
				};

			// provides getter / setters
			// 
			if ( this[setName] && 
				(value = this[setName](value, this.callback('_updateProperty', property, value, old, success, errorCallback), errorCallback)) === undefined ) {
				return;
			}
			this._updateProperty(property, value, old, success, errorCallback);
		},
		/**
		 * Triggers events when a property has been updated
		 * @hide
		 * @param {Object} property
		 * @param {Object} value
		 * @param {Object} old
		 * @param {Object} success
		 */
		_updateProperty: function( property, value, old, success, errorCallback ) {
			var Class = this.Class,
				val, type = Class.attributes[property] || Class.addAttr(property, Class.guessType(value)),
				//the converter
				converter = Class.convert[type],
				errors = null,
				stub;

			val = this[property] = (value === null ? //if the value is null or undefined
			null : // it should be null
			(converter ? converter.call(Class, value) : //convert it to something useful
			value)); //just return it
			//validate (only if not initializing, this is for performance)
			if (!this._init ) {
				errors = this.errors(property);
			}

			if ( errors ) {
				//get an array of errors
				errorCallback(errors);
			} else {
				if ( old !== val && !this._init ) {
					$(this).triggerHandler(property, [val]);
					$(this).triggerHandler("updated.attr", [property,val, old]); // this is for 3.1
				}
				stub = success && success(this);

			}

			//if this class has a global list, add / remove from the list.
			if ( property === Class.id && val !== null && Class.list ) {
				// if we didn't have an old id, add ourselves
				if (!old ) {
					Class.list.push(this);
				} else if ( old != val ) {
					// if our id has changed ... well this should be ok
					Class.list.remove(old);
					Class.list.push(this);
				}
			}

		},
		/**
		 * Gets or sets a list of attributes. 
		 * Each attribute is set with [jQuery.Model.prototype.attr attr].
		 * 
		 * @codestart
		 * recipe.attrs({
		 *   name: "ice water",
		 *   instructions : "put water in a glass"
		 * })
		 * @codeend
		 * 
		 * This can be used nicely with [jquery.model.events].
		 * 
		 * @param {Object} [attributes]  if present, the list of attributes to send
		 * @return {Object} the current attributes of the model
		 */
		attrs: function( attributes ) {
			var key;
			if (!attributes ) {
				attributes = {};
				for ( key in this.Class.attributes ) {
					if ( this.Class.attributes.hasOwnProperty(key) ) {
						attributes[key] = this.attr(key);
					}
				}
			} else {
				var idName = this.Class.id;
				//always set the id last
				for ( key in attributes ) {
					if ( key != idName ) {
						this.attr(key, attributes[key]);
					}
				}
				if ( idName in attributes ) {
					this.attr(idName, attributes[idName]);
				}

			}
			return attributes;
		},
		/**
		 * Returns if the instance is a new object.  This is essentially if the
		 * id is null or undefined.
		 * 
		 *     new Recipe({id: 1}).isNew() //-> false
		 * @return {Boolean} false if an id is set, true if otherwise.
		 */
		isNew: function() {
			var id = getId(this);
			return (id === undefined || id === null); //if null or undefined
		},
		/**
		 * Saves the instance if there are no errors.  
		 * If the instance is new, [jQuery.Model.static.create] is
		 * called; otherwise, [jQuery.Model.static.update] is
		 * called.
		 * 
		 * @codestart
		 * recipe.save(success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, after a successful create or update, 
		 * "<i>modelName</i>.created" or "<i>modelName</i>.updated" is published.
		 * 
		 * @param {Function} [success] called if a successful save.
		 * @param {Function} [error] called if the save was not successful.
		 */
		save: function( success, error ) {
			return makeRequest(this, this.isNew()  ? 'create' : 'update' , success, error);
		},

		/**
		 * Destroys the instance by calling 
		 * [jQuery.Model.static.destroy] with the id of the instance.
		 * 
		 * @codestart
		 * recipe.destroy(success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, after a successful
		 * destroy "<i>modelName</i>.destroyed" is published
		 * with the model instance.
		 * 
		 * @param {Function} [success] called if a successful destroy
		 * @param {Function} [error] called if an unsuccessful destroy
		 */
		destroy: function( success, error ) {
			return makeRequest(this, 'destroy' , success, error , 'destroyed');
		},
		

		/**
		 * Returns a unique identifier for the model instance.  For example:
		 * @codestart
		 * new Todo({id: 5}).identity() //-> 'todo_5'
		 * @codeend
		 * Typically this is used in an element's shortName property so you can find all elements
		 * for a model with [jQuery.Model.prototype.elements elements].
		 * @return {String}
		 */
		identity: function() {
			var id = getId(this);
			return this.Class._fullName + '_' + (this.Class.escapeIdentity ? encodeURIComponent(id) : id);
		},
		/**
		 * Returns elements that represent this model instance.  For this to work, your element's should
		 * us the [jQuery.Model.prototype.identity identity] function in their class name.  Example:
		 * 
		 *     <div class='todo <%= todo.identity() %>'> ... </div>
		 * 
		 * This also works if you hooked up the model:
		 * 
		 *     <div <%= todo %>> ... </div>
		 *     
		 * Typically, you'll use this as a response of an OpenAjax message:
		 * 
		 *     "todo.destroyed subscribe": function(called, todo){
		 *       todo.elements(this.element).remove();
		 *     }
		 * 
		 * ## API
		 * 
		 * @param {String|jQuery|element} context If provided, only elements inside this element
		 * that represent this model will be returned.
		 * 
		 * @return {jQuery} Returns a jQuery wrapped nodelist of elements that have this model instances
		 *  identity in their class name.
		 */
		elements: function( context ) {
			return $("." + this.identity(), context);
		},
		/**
		 * Publishes to OpenAjax.hub
		 * 
		 *     $.Model('Task', {
		 *       complete : function(cb){
		 *         var self = this;
		 *         $.post('/task/'+this.id,
		 *           {complete : true},
		 *           function(){
		 *             self.attr('completed', true);
		 *             self.publish('completed');
		 *           })
		 *       }
		 *     })
		 *     
		 *     
		 * @param {String} event The event type.  The model's short name will be automatically prefixed.
		 * @param {Object} [data] if missing, uses the instance in {data: this}
		 */
		publish: function( event, data ) {
			this.Class.publish(event, data || this);
		},
		hookup: function( el ) {
			var shortName = this.Class._shortName,
				models = $.data(el, "models") || $.data(el, "models", {});
			$(el).addClass(shortName + " " + this.identity());
			models[shortName] = this;
		}
	});
	// map wrapMany
	$.Model.wrapMany = $.Model.models;
	$.Model.wrap = $.Model.model;


	each([
	/**
	 * @function created
	 * @hide
	 * Called by save after a new instance is created.  Publishes 'created'.
	 * @param {Object} attrs
	 */
	"created",
	/**
	 * @function updated
	 * @hide
	 * Called by save after an instance is updated.  Publishes 'updated'.
	 * @param {Object} attrs
	 */
	"updated",
	/**
	 * @function destroyed
	 * @hide
	 * Called after an instance is destroyed.  
	 *   - Publishes "shortName.destroyed".
	 *   - Triggers a "destroyed" event on this model.
	 *   - Removes the model from the global list if its used.
	 * 
	 */
	"destroyed"], function( i, funcName ) {
		$.Model.prototype[funcName] = function( attrs ) {
			var stub;

			if ( funcName === 'destroyed' && this.Class.list ) {
				this.Class.list.remove(getId(this));
			}
			stub = attrs && typeof attrs == 'object' && this.attrs(attrs.attrs ? attrs.attrs() : attrs);
			$(this).triggerHandler(funcName);
			this.publish(funcName, this);
			$([this.Class]).triggerHandler(funcName, this);
			return [this].concat(makeArray(arguments)); // return like this for this.callback chains
		};
	});

	/**
	 *  @add jQuery.fn
	 */
	// break
	/**
	 * @function models
	 * Returns a list of models.  If the models are of the same
	 * type, and have a [jQuery.Model.List], it will return 
	 * the models wrapped with the list.
	 * 
	 * @codestart
	 * $(".recipes").models() //-> [recipe, ...]
	 * @codeend
	 * 
	 * @param {jQuery.Class} [type] if present only returns models of the provided type.
	 * @return {Array|jQuery.Model.List} returns an array of model instances that are represented by the contained elements.
	 */
	$.fn.models = function( type ) {
		//get it from the data
		var collection = [],
			kind, ret, retType;
		this.each(function() {
			each($.data(this, "models") || {}, function( name, instance ) {
				//either null or the list type shared by all classes
				kind = kind === undefined ? 
					instance.Class.List || null : 
					(instance.Class.List === kind ? kind : null);
				collection.push(instance);
			});
		});

		ret = getList(kind);

		ret.push.apply(ret, unique(collection));
		return ret;
	};
	/**
	 * @function model
	 * 
	 * Returns the first model instance found from [jQuery.fn.models] or
	 * sets the model instance on an element.
	 * 
	 *     //gets an instance
	 *     ".edit click" : function(el) {
	 *       el.closest('.todo').model().destroy()
	 *     },
	 *     // sets an instance
	 *     list : function(items){
	 *        var el = this.element;
	 *        $.each(item, function(item){
	 *          $('<div/>').model(item)
	 *            .appendTo(el)
	 *        })
	 *     }
	 * 
	 * @param {Object} [type] The type of model to return.  If a model instance is provided
	 * it will add the model to the element.
	 */
	$.fn.model = function( type ) {
		if ( type && type instanceof $.Model ) {
			type.hookup(this[0]);
			return this;
		} else {
			return this.models.apply(this, arguments)[0];
		}

	};
	/**
	 * @page jquery.model.services Service APIs
	 * @parent jQuery.Model
	 * 
	 * Models provide an abstract API for connecting to your Services.  
	 * By implementing static:
	 * 
	 *  - [jQuery.Model.static.findAll] 
	 *  - [jQuery.Model.static.findOne] 
	 *  - [jQuery.Model.static.create] 
	 *  - [jQuery.Model.static.update] 
	 *  - [jQuery.Model.static.destroy]
	 *  
	 * You can find more details on how to implement each method.
	 * Typically, you can just use templated service urls. But if you need to
	 * implement these methods yourself, the following
	 * is a useful quick reference:
	 * 
	 * ### create(attrs, success([attrs]), error()) -> deferred
	 *  
	 *  - <code>attrs</code> - an Object of attribute / value pairs
	 *  - <code>success([attrs])</code> - Create calls success when the request has completed 
	 *    successfully.  Success can be called back with an object that represents
	 *    additional properties that will be set on the instance. For example, the server might 
	 *    send back an updatedAt date.
	 *  - <code>error</code> - Create should callback error if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to any additional attrs
	 *    that might need to be set on the model instance.
	 * 
	 * 
	 * ### findAll( params, success(items), error) -> deferred
	 * 
	 * 
	 *  - <code>params</code> - an Object that filters the items returned
	 *  - <code>success(items)</code> - success should be called with an Array of Model instances.
	 *  - <code>error</code> - called if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to the list of items
	 *          
	 * ### findOne(params, success(items), error) -> deferred
	 *          
	 *  - <code>params</code> - an Object that filters the item returned
	 *  - <code>success(item)</code> - success should be called with a model instance.
	 *  - <code>error</code> - called if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to a model instance
	 *        
	 * ### update(id, attrs, success([attrs]), error()) -> deferred
	 *  
	 *  - <code>id</code> - the id of the instance you are updating
	 *  - <code>attrs</code> - an Object of attribute / value pairs
	 *  - <code>success([attrs])</code> - Call success when the request has completed 
	 *    successfully.  Success can be called back with an object that represents
	 *    additional properties that will be set on the instance. For example, the server might 
	 *    send back an updatedAt date.
	 *  - <code>error</code> - Callback error if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to any additional attrs
	 *      that might need to be set on the model instance.
	 *     
	 * ### destroy(id, success([attrs]), error()) -> deferred
	 *  
	 *  - <code>id</code> - the id of the instance you are destroying
	 *  - <code>success([attrs])</code> - Calls success when the request has completed 
	 *      successfully.  Success can be called back with an object that represents
	 *      additional properties that will be set on the instance. 
	 *  - <code>error</code> - Create should callback error if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to any additional attrs
	 *      that might need to be set on the model instance.
	 */
});