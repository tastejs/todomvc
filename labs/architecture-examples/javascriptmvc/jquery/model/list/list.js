steal('jquery/model').then(function( $ ) {

	var getArgs = function( args ) {
		if ( args[0] && ($.isArray(args[0])) ) {
			return args[0]
		} else if ( args[0] instanceof $.Model.List ) {
			return $.makeArray(args[0])
		} else {
			return $.makeArray(args)
		}
	},
		//used for namespacing
		id = 0,
		getIds = function( item ) {
			return item[item.constructor.id]
		},
		expando = jQuery.expando,
		each = $.each,
		ajax = $.Model._ajax,

		/**
		 * @class jQuery.Model.List
		 * @parent jQuery.Model
		 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/list/list.js
		 * @test jquery/model/list/qunit.html
		 * @plugin jquery/model/list
		 * 
		 * Model.Lists manage a lists (or arrays) of 
		 * model instances.  Similar to [jQuery.Model $.Model], 
		 * they are used to:
		 * 
		 *  - create events when a list changes 
		 *  - make Ajax requests on multiple instances
		 *  - add helper function for multiple instances (ACLs)
		 * 
		 * The [todo] app demonstrates using a $.Controller to 
		 * implement an interface for a $.Model.List.
		 * 
		 * ## Creating A List Class
		 * 
		 * Create a `$.Model.List [jQuery.Class class] for a $.Model
		 * like:
		 * 
		 *     $.Model('Todo')
		 *     $.Model.List('Todo.List',{
		 *       // static properties
		 *     },{
		 *       // prototype properties
		 *     })
		 * 
		 * This creates a `Todo.List` class for the `Todo` 
		 * class. This creates some nifty magic that we will see soon.
		 * 
		 * `static` properties are typically used to describe how 
		 * a list makes requests.  `prototype` properties are 
		 * helper functions that operate on an instance of 
		 * a list. 
		 * 
		 * ## Make a Helper Function
		 * 
		 * Often, a user wants to select multiple items on a
		 * page and perform some action on them (for example, 
		 * deleting them). The app
		 * needs to indicate if this is possible (for example,
		 * by enabling a "DELETE" button).
		 * 
		 * 
		 * If we get todo data back like:
		 * 
		 *     // GET /todos.json ->
		 *     [{
		 *       "id" : 1,
		 *       "name" : "dishes",
		 *       "acl" : "rwd"
		 *     },{
		 *       "id" : 2,
		 *       "name" : "laundry",
		 *       "acl" : "r"
		 *     }, ... ]
		 * 
		 * We can add a helper function to let us know if we can 
		 * delete all the instances:
		 * 
		 *     $.Model.List('Todo.List',{
		 *     
		 *     },{
		 *        canDelete : function(){
		 *          return this.grep(function(todo){
		 *            return todo.acl.indexOf("d") != 0
		 *          }).length == this.length
		 *        }
		 *     })
		 * 
		 * `canDelete` gets a list of all todos that have
		 * __d__ in their acl.  If all todos have __d__,
		 * then `canDelete` returns true.
		 * 
		 * ## Get a List Instance
		 * 
		 * You can create a model list instance by using
		 * `new Todo.List( instances )` like:
		 * 
		 *     var todos = new Todo.List([
		 *       new Todo({id: 1, name: ...}),
		 *       new Todo({id: 2, name: ...}),
		 *     ]);
		 * 
		 * And call `canDelete` on it like:
		 * 
		 *     todos.canDelete() //-> boolean
		 * 
		 * BUT! $.Model, [jQuery.fn.models $.fn.models], and $.Model.List are designed 
		 * to work with each other.
		 * 
		 * When you use `Todo.findAll`, it will callback with an instance
		 * of `Todo.List`:
		 * 
		 *     Todo.findAll({}, function(todos){
		 *        todos.canDelete() //-> boolean
		 *     })
		 * 
		 * If you are adding the model instance to elements and
		 * retrieving them back with `$().models()`, it will 
		 * return a instance of `Todo.List`.  The following
		 * returns if the checked `.todo` elements are
		 * deletable:
		 * 
		 *     // get the checked inputs
		 *     $('.todo input:checked')
		 *        // get the todo elements
		 *        .closest('.todo')
		 *        // get the model list
		 *        .models()
		 *        // check canDelete
		 *        .canDelete()
		 * 
		 * ## Make Ajax Requests with Lists
		 * 
		 * After checking if we can delete the todos,
		 * we should delete them from the server. Like 
		 * `$.Model`, we can add a 
		 * static [jQuery.Model.List.static.destroy destroy] url:
		 * 
		 *     $.Model.List('Todo.List',{
		 *        destroy : 'POST /todos/delete'
		 *     },{
		 *        canDelete : function(){
		 *          return this.grep(function(todo){
		 *            return todo.acl.indexOf("d") != 0
		 *          }).length == this.length
		 *        }
		 *     })
		 * 
		 * 
		 * and call [jQuery.Model.List.prototype.destroy destroy] on
		 * our list.  
		 * 
		 *     // get the checked inputs
		 *     var todos = $('.todo input:checked')
		 *        // get the todo elements
		 *        .closest('.todo')
		 *        // get the model list
		 *        .models()
		 *     
		 *     if( todos.canDelete() ) {
		 *        todos.destroy()
		 *     }
		 * 
		 * By default, destroy will create an AJAX request to 
		 * delete these instances on the server, when
		 * the AJAX request is successful, the instances are removed
		 * from the list and events are dispatched.
		 * 
		 * ## Listening to events on Lists
		 * 
		 * Use [jQuery.Model.List.prototype.bind bind]`(eventName, handler(event, data))` 
		 * to listen to __add__, __remove__, and __updated__ events on a 
		 * list.  
		 * 
		 * When a model instance is destroyed, it is removed from
		 * all lists.  In the todo example, we can bind to remove to know
		 * when a todo has been destroyed.  The following 
		 * removes all the todo elements from the page when they are removed
		 * from the list:
		 * 
		 *     todos.bind('remove', function(ev, removedTodos){
		 *       removedTodos.elements().remove();
		 *     })
		 * 
		 * ## Demo
		 * 
		 * The following demo illustrates the previous features with
		 * a contacts list.  Check
		 * multiple Contacts and click "DESTROY ALL"
		 * 
		 * @demo jquery/model/list/list.html
		 * 
		 * ## Other List Features
		 * 
		 *  - Store and retrieve multiple instances
		 *  - Fast HTML inserts
		 *
		 * ### Store and retrieve multiple instances
		 * 
		 * Once you have a collection of models, you often want to retrieve and update 
		 * that list with new instances.  Storing and retrieving is a powerful feature
		 * you can leverage to manage and maintain a list of models.
		 *
		 * To store a new model instance in a list...
		 *
		 *     listInstance.push(new Animal({ type: dog, id: 123 }))
		 * 
		 * To later retrieve that instance in your list...
		 * 
		 *     var animal = listInstance.get(123);
		 *
		 * 
		 * ### Faster Inserts
		 * 
		 * The 'easy' way to add a model to an element is simply inserting
		 * the model into the view like:
		 * 
		 * @codestart xml
		 * &lt;div &lt;%= task %>> A task &lt;/div>
		 * @codeend
		 * 
		 * And then you can use [jQuery.fn.models $('.task').models()].
		 * 
		 * This pattern is fast enough for 90% of all widgets.  But it
		 * does require an extra query.  Lists help you avoid this.
		 * 
		 * The [jQuery.Model.List.prototype.get get] method takes elements and
		 * uses their className to return matched instances in the list.
		 * 
		 * To use get, your elements need to have the instance's 
		 * identity in their className.  So to setup a div to reprsent
		 * a task, you would have the following in a view:
		 * 
		 * @codestart xml
		 * &lt;div class='task &lt;%= task.identity() %>'> A task &lt;/div>
		 * @codeend
		 * 
		 * Then, with your model list, you could use get to get a list of
		 * tasks:
		 * 
		 * @codestart
		 * taskList.get($('.task'))
		 * @codeend
		 * 
		 * The following demonstrates how to use this technique:
		 * 
		 * @demo jquery/model/list/list-insert.html
		 *
		 */
		ajaxMethods =
		/**
		 * @static
		 */
		{
			update: function( str ) {
				/**
				 * @function update
				 * Update is used to update a set of model instances on the server.  By implementing 
				 * update along with the rest of the [jquery.model.services service api], your models provide an abstract
				 * API for services.  
				 * 
				 * The easist way to implement update is to just give it the url to put data to:
				 * 
				 *     $.Model.List("Recipe",{
				 *       update: "PUT /thing/update/"
				 *     },{})
				 *
				 * Or you can implement update manually like:
				 * 
				 *     $.Model.List("Thing",{
				 *       update : function(ids, attrs, success, error){
				 * 		   return $.ajax({
				 * 		   	  url: "/thing/update/",
				 * 		      success: success,
				 * 		      type: "PUT",
				 * 		      data: { ids: ids, attrs : attrs }
				 * 		      error: error
				 * 		   });
				 *       }
				 *     })
				 *     
				 * Then you update models by calling the [jQuery.Model.List.prototype.update prototype update method].
				 *
				 *     listInstance.update({ name: "Food" })
				 *
				 *
				 * By default, the request will PUT an array of ids to be updated and
				 * the changed attributes of the model instances in the body of the Ajax request.
				 *
				 *     { 
				 *         ids: [5,10,20],
				 *         attrs: { 
				 *             name: "Food" 
				 *         } 
				 *     }
				 * 
				 * Your server should send back an object with any new attributes the model 
				 * should have.  For example if your server udpates the "updatedAt" property, it
				 * should send back something like:
				 * 
				 *     // PUT /recipes/4,25,20 { name: "Food" } ->
				 *     {
				 *       updatedAt : "10-20-2011"
				 *     }
				 * 
				 * @param {Array} ids the ids of the model instance
				 * @param {Object} attrs Attributes on the model instance
				 * @param {Function} success the callback function.  It optionally accepts 
				 * an object of attribute / value pairs of property changes the client doesn't already 
				 * know about. For example, when you update a name property, the server might 
				 * update other properties as well (such as updatedAt). The server should send 
				 * these properties as the response to updates.  Passing them to success will 
				 * update the model instances with these properties.
				 * @param {Function} error a function to callback if something goes wrong.  
				 */
				return function( ids, attrs, success, error ) {
					return ajax(str, {
						ids: ids,
						attrs: attrs
					}, success, error, "-updateAll", "put")
				}
			},
			destroy: function( str ) {
				/**
				 * @function destroy
				 * Destroy is used to remove a set of model instances from the server. By implementing 
				 * destroy along with the rest of the [jquery.model.services service api], your models provide an abstract
				 * service API.
				 * 
				 * You can implement destroy with a string like:
				 * 
				 *     $.Model.List("Thing",{
				 *       destroy : "POST /thing/destroy/"
				 *     })
				 * 
				 * Or you can implement destroy manually like:
				 * 
				 *     $.Model.List("Thing",{
				 *       destroy : function(ids, success, error){
				 * 		   return $.ajax({
				 * 		   	  url: "/thing/destroy/",
				 * 		      data: ids,
				 * 		      success: success,
				 * 		      error: error,
				 * 		      type: "POST"
				 * 		   });
				 *       }
				 *     })
				 *
				 * Then you delete models by calling the [jQuery.Model.List.prototype.destroy prototype delete method].
				 *
				 *     listInstance.destroy();
				 *
				 * By default, the request will POST an array of ids to be deleted in the body of the Ajax request.
				 *
				 *     { 
				 *         ids: [5,10,20]
				 *     }
				 * 
				 * @param {Array} ids the ids of the instances you want destroyed
				 * @param {Function} success the callback function
				 * @param {Function} error a function to callback if something goes wrong.  
				 */
				return function( ids, success, error ) {
					return ajax(str, ids, success, error, "-destroyAll", "post")
				}
			}
		};

	$.Class("jQuery.Model.List", {
		setup: function() {
			for ( var name in ajaxMethods ) {
				if ( typeof this[name] !== 'function' ) {
					this[name] = ajaxMethods[name](this[name]);
				}
			}
		}
	},
	/**
	 * @Prototype
	 */
	{
		init: function( instances, noEvents ) {
			this.length = 0;
			// a cache for quick lookup by id
			this._data = {};
			//a namespace so we can remove all events bound by this list
			this._namespace = ".list" + (++id), this.push.apply(this, $.makeArray(instances || []));
		},
		/**
		 * The slice method selects a part of an array, and returns another instance of this model list's class.
		 * 
		 *     list.slice(start, end)
		 *
		 * @param {Number} start the start index to select
		 * @param {Number} end the last index to select
		 */
		slice: function() {
			return new this.Class(Array.prototype.slice.apply(this, arguments));
		},
		/**
		 * Returns a list of all instances who's property matches the given value.
		 *
		 *     list.match('candy', 'snickers')
		 * 
		 * @param {String} property the property to match
		 * @param {Object} value the value the property must equal
		 */
		match: function( property, value ) {
			return this.grep(function( inst ) {
				return inst[property] == value;
			});
		},
		/**
		 * Finds the instances of the list which satisfy a callback filter function. The original array is not affected.
		 * 
		 *     var matchedList = list.grep(function(instanceInList, indexInArray){
		 *        return instanceInList.date < new Date();
		 *     });
		 * 
		 * @param {Function} callback the function to call back.  This function has the same call pattern as what jQuery.grep provides.
		 * @param {Object} args
		 */
		grep: function( callback, args ) {
			return new this.Class($.grep(this, callback, args));
		},
		_makeData: function() {
			var data = this._data = {};
			this.each(function( i, inst ) {
				data[inst[inst.constructor.id]] = inst;
			})
		},
		/**
		 * Gets a list of elements by ID or element.
		 *
		 * To fetch by id:
		 *
		 *     var match = list.get(23);
		 *
		 * or to fetch by element:
		 * 
		 *     var match = list.get($('#content')[0])
		 * 
		 * @param {Object} args elements or ids to retrieve.
         * @return {$.Model.List} A sub-Model.List with the elements that were queried.
		 */
		get: function() {
			if (!this.length ) {
				return new this.Class([]);
			}
			if ( this._changed ) {
				this._makeData();
			}
			var list = [],
				constructor = this[0].constructor,
				underscored = constructor._fullName,
				idName = constructor.id,
				test = new RegExp(underscored + "_([^ ]+)"),
				matches, val, args = getArgs(arguments);

			for ( var i = 0; i < args.length; i++ ) {
				if ( args[i].nodeName && (matches = args[i].className.match(test)) ) {
                // If this is a dom element
					val = this._data[matches[1]]
				} else {
                // Else an id was provided as a number or string.
					val = this._data[typeof args[i] == 'string' || typeof args[i] == 'number' ? args[i] : args[i][idName]]
				}
				val && list.push(val)
			}
			return new this.Class(list)
		},
		/**
		 * Removes instances from this list by id or by an element.
		 *
		 * To remove by id:
		 *
		 *     var match = list.remove(23);
		 *
		 * or to remove by element:
		 * 
		 *     var match = list.remove($('#content')[0])
		 *
		 * @param {Object} args elements or ids to remove.
         * @return {$.Model.List} A Model.List of the elements that were removed.
		 */
		remove: function( args ) {
			if (!this.length ) {
				return [];
			}
			var list = [],
				constructor = this[0].constructor,
				underscored = constructor._fullName,
				idName = constructor.id,
				test = new RegExp(underscored + "_([^ ]+)"),
				matches, val;
			args = getArgs(arguments)

			//for performance, we will go through each and splice it
			var i = 0;
			while ( i < this.length ) {
				//check 
				var inst = this[i],
					found = false
					for ( var a = 0; a < args.length; a++ ) {
						var id = (args[a].nodeName && (matches = args[a].className.match(test)) && matches[1]) || (typeof args[a] == 'string' || typeof args[a] == 'number' ? args[a] : args[a][idName]);
						if ( inst[idName] == id ) {
							list.push.apply(list, this.splice(i, 1));
							args.splice(a, 1);
							found = true;
							break;
						}
					}
					if (!found ) {
						i++;
					}
			}
			var ret = new this.Class(list);
			if ( ret.length ) {
				$([this]).trigger("remove", [ret])
			}

			return ret;
		},
		/**
		 * Returns elements that represent this list.  For this to work, your element's should
		 * us the [jQuery.Model.prototype.identity identity] function in their class name.  Example:
		 * 
		 *     <div class='todo <%= todo.identity() %>'> ... </div>
		 * 
		 * This also works if you hooked up the model:
		 * 
		 *     <div <%= todo %>> ... </div>
		 *     
		 * Typically, you'll use this as a response to a Model Event:
		 * 
		 *     "{Todo} destroyed": function(Todo, event, todo){
		 *       todo.elements(this.element).remove();
		 *     }
		 * 
		 * @param {String|jQuery|element} context If provided, only elements inside this element that represent this model will be returned.
		 * @return {jQuery} Returns a jQuery wrapped nodelist of elements that have these model instances identities in their class names.
		 */
		elements: function( context ) {
			// TODO : this can probably be done with 1 query.
			return $(
			this.map(function( item ) {
				return "." + item.identity()
			}).join(','), context);
		},
		model: function() {
			return this.constructor.namespace
		},
		/**
		 * Finds items and adds them to this list.  This uses [jQuery.Model.static.findAll]
		 * to find items with the params passed.
		 * 
		 * @param {Object} params options to refind the returned items
		 * @param {Function} success called with the list
		 * @param {Object} error
		 */
		findAll: function( params, success, error ) {
			var self = this;
			this.model().findAll(params, function( items ) {
				self.push(items);
				success && success(self)
			}, error)
		},
		/**
		 * Destroys all items in this list.  This will use the List's 
		 * [jQuery.Model.List.static.destroy static destroy] method.
		 * 
		 *     list.destroy(function(destroyedItems){
		 *         //success
		 *     }, function(){
		 *         //error
		 *     });
		 * 
		 * @param {Function} success a handler called back with the destroyed items.  The original list will be emptied.
		 * @param {Function} error a handler called back when the destroy was unsuccessful.
		 */
		destroy: function( success, error ) {
			var ids = this.map(getIds),
				items = this.slice(0, this.length);

			if ( ids.length ) {
				this.constructor.destroy(ids, function() {
					each(items, function() {
						this.destroyed();
					})
					success && success(items)
				}, error);
			} else {
				success && success(this);
			}

			return this;
		},
		/**
		 * Updates items in the list with attributes.  This makes a 
		 * request using the list class's [jQuery.Model.List.static.update static update].
		 *
		 *     list.update(function(updatedItems){
		 *         //success
		 *     }, function(){
		 *         //error
		 *     });
		 * 
		 * @param {Object} attrs attributes to update the list with.
		 * @param {Function} success a handler called back with the updated items.
		 * @param {Function} error a handler called back when the update was unsuccessful.
		 */
		update: function( attrs, success, error ) {
			var ids = this.map(getIds),
				items = this.slice(0, this.length);

			if ( ids.length ) {
				this.constructor.update(ids, attrs, function( newAttrs ) {
					// final attributes to update with
					var attributes = $.extend(attrs, newAttrs || {})
					each(items, function() {
						this.updated(attributes);
					})
					success && success(items)
				}, error);
			} else {
				success && success(this);
			}

			return this;
		},
		/**
		 * Listens for an events on this list.  The only useful events are:
		 * 
		 *   . add - when new items are added
		 *   . update - when an item is updated
		 *   . remove - when items are removed from the list (typically because they are destroyed).
		 *    
		 * ## Listen for items being added 
		 *  
		 *     list.bind('add', function(ev, newItems){
		 *     
		 *     })
		 *     
		 * ## Listen for items being removed
		 * 
		 *     list.bind('remove',function(ev, removedItems){
		 *     
		 *     })
		 *     
		 * ## Listen for an item being updated
		 * 
		 *     list.bind('update',function(ev, updatedItem){
		 *     
		 *     })
		 */
		bind: function() {
			if ( this[expando] === undefined ) {
				this.bindings(this);
				// we should probably remove destroyed models here
			}
			$.fn.bind.apply($([this]), arguments);
			return this;
		},
		/**
		 * Unbinds an event on this list.  Once all events are unbound,
		 * unbind stops listening to all elements in the collection.
		 * 
		 *     list.unbind("update") //unbinds all update events
		 */
		unbind: function() {
			$.fn.unbind.apply($([this]), arguments);
			if ( this[expando] === undefined ) {
				$(this).unbind(this._namespace)
			}
			return this;
		},
		// listens to destroyed and updated on instances so when an item is
		//  updated - updated is called on model
		//  destroyed - it is removed from the list
		bindings: function( items ) {
			var self = this;
			$(items).bind("destroyed" + this._namespace, function() {
				//remove from me
				self.remove(this); //triggers the remove event
			}).bind("updated" + this._namespace, function() {
				$([self]).trigger("updated", this)
			});
		},
		/**
		 * @function push
		 * Adds an instance or instances to the list
		 * 
		 *     list.push(new Recipe({id: 5, name: "Water"}))
         *     
         * @param args {Object} The instance(s) to push onto the list.
         * @return {Number} The number of elements in the list after the new element was pushed in.
		 */
		push: function() {
			var args = getArgs(arguments);
			//listen to events on this only if someone is listening on us, this means remove won't
			//be called if we aren't listening for removes
			if ( this[expando] !== undefined ) {
				this.bindings(args);
			}

			this._changed = true;
			var res = push.apply(this, args)
			//do this first so we could prevent?
			if ( this[expando] && args.length ) {
				$([this]).trigger("add", [args]);
			}

			return res;
		},
		serialize: function() {
			return this.map(function( item ) {
				return item.serialize()
			});
		}
	});

	var push = [].push,
		modifiers = {

			/**
			 * @function pop
			 * Removes the last instance of the list, and returns that instance.
			 *
			 *     list.pop()
			 * 
			 */
			pop: [].pop,
			/**
			 * @function shift
			 * Removes the first instance of the list, and returns that instance.
			 *
			 *     list.shift()
			 * 
			 */
			shift: [].shift,
			/**
			 * @function unshift
			 * Adds a new instance to the beginning of an array, and returns the new length.
			 *
			 *     list.unshift(element1,element2,...) 
			 *
			 */
			unshift: [].unshift,
			/**
			 * @function splice
			 * The splice method adds and/or removes instances to/from the list, and returns the removed instance(s).
			 *
			 *     list.splice(index,howmany)
			 * 
			 */
			splice: [].splice,
			/**
			 * @function sort
			 * Sorts the instances in the list.
			 *
			 *     list.sort(sortfunc)
			 * 
			 */
			sort: [].sort,
			/**
			 * @function reverse
			 * Reverse the list in place
			 *
			 *     list.reverse()
			 * 
			 */
			reverse: [].reverse
		}

		each(modifiers, function( name, func ) {
			$.Model.List.prototype[name] = function() {
				this._changed = true;
				return func.apply(this, arguments);
			}
		})

		each([
		/**
		 * @function each
		 * Iterates through the list of model instances, calling the callback function on each iteration. 
		 *
		 *     list.each(function(indexInList, modelOfList){
		 *         ...
		 *     });
		 * 
		 * @param {Function} callback The function that will be executed on every object.
		 */
		'each',
		/**
		 * @function map
		 * Iterates through the list of model instances, calling the callback function on each iteration.
		 * 
		 *     list.map(function(modelOfList, indexInList){
		 *         ...
		 *     });
		 * 
		 * @param {Function} callback The function to process each item against.
		 */
		'map'], function( i, name ) {
			$.Model.List.prototype[name] = function( callback, args ) {
				return $[name](this, callback, args);
			}
		})


})