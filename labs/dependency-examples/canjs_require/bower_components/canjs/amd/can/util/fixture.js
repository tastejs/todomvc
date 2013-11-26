/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/util/string", "can/util/object"], function (can) {

	// Get the URL from old Steal root, new Steal config or can.fixture.rootUrl
	var getUrl = function(url) {
		if(typeof steal !== 'undefined') {
			if(can.isFunction(steal.config)) {
				return steal.config().root.mapJoin(url).toString();
			}
			return steal.root.join(url).toString();
		}
		return (can.fixture.rootUrl || '') + url;
	}

	var updateSettings = function (settings, originalOptions) {
			if (!can.fixture.on) {
				return;
			}

			//simple wrapper for logging
			var _logger = function(type, arr){
				if(console.log.apply){
					Function.prototype.call.apply(console[type], [console].concat(arr));
					// console[type].apply(console, arr)
				} else {
					console[type](arr)
				}
			},
			log = function () {
				if(typeof steal !== 'undefined' && steal.dev) {
					steal.dev.log('fixture INFO: ' + Array.prototype.slice.call(arguments).join(' '));
				}
			}

			// We always need the type which can also be called method, default to GET
			settings.type = settings.type || settings.method || 'GET';

			// add the fixture option if programmed in
			var data = overwrite(settings);

			// if we don't have a fixture, do nothing
			if (!settings.fixture) {
				if (window.location.protocol === "file:") {
					log("ajax request to " + settings.url + ", no fixture found");
				}
				return;
			}

			//if referencing something else, update the fixture option
			if (typeof settings.fixture === "string" && can.fixture[settings.fixture]) {
				settings.fixture = can.fixture[settings.fixture];
			}

			// if a string, we just point to the right url
			if (typeof settings.fixture == "string") {
				var url = settings.fixture;

				if (/^\/\//.test(url)) {
					// this lets us use rootUrl w/o having steal...
					url = getUrl(settings.fixture.substr(2));
				}

				if(data) {
					// Template static fixture URLs
					url = can.sub(url, data);
				}

				delete settings.fixture;

			

				settings.url = url;
				settings.data = null;
				settings.type = "GET";
				if (!settings.error) {
					settings.error = function (xhr, error, message) {
						throw "fixtures.js Error " + error + " " + message;
					};
				}
			}
			else {
			

				//it's a function ... add the fixture datatype so our fixture transport handles it
				// TODO: make everything go here for timing and other fun stuff
				// add to settings data from fixture ...
				settings.dataTypes && settings.dataTypes.splice(0, 0, "fixture");

				if (data && originalOptions) {
					can.extend(originalOptions.data, data)
				}
			}
		},
		// A helper function that takes what's called with response
		// and moves some common args around to make it easier to call
		extractResponse = function(status, statusText, responses, headers) {
			// if we get response(RESPONSES, HEADERS)
			if(typeof status != "number"){
				headers = statusText;
				responses = status;
				statusText = "success"
				status = 200;
			}
			// if we get response(200, RESPONSES, HEADERS)
			if(typeof statusText != "string"){
				headers = responses;
				responses = statusText;
				statusText = "success";
			}
			if ( status >= 400 && status <= 599 ) {
				this.dataType = "text"
			}
			return [status, statusText, extractResponses(this, responses), headers];
		},
		// If we get data instead of responses,
		// make sure we provide a response type that matches the first datatype (typically json)
		extractResponses = function(settings, responses){
			var next = settings.dataTypes ? settings.dataTypes[0] : (settings.dataType || 'json');
			if (!responses || !responses[next]) {
				var tmp = {}
				tmp[next] = responses;
				responses = tmp;
			}
			return responses;
		};

	//used to check urls
	// check if jQuery
	if (can.ajaxPrefilter && can.ajaxTransport) {

		// the pre-filter needs to re-route the url
		can.ajaxPrefilter(updateSettings);

		can.ajaxTransport("fixture", function (s, original) {
			// remove the fixture from the datatype
			s.dataTypes.shift();

			//we'll return the result of the next data type
			var timeout, stopped = false;

			return {
				send: function (headers, callback) {
					// we'll immediately wait the delay time for all fixtures
					timeout = setTimeout(function () {
						// if the user wants to call success on their own, we allow it ...
						var success = function() {
							if(stopped === false) {
								callback.apply(null, extractResponse.apply(s, arguments) );
							}
						},
						// get the result form the fixture
						result = s.fixture(original, success, headers, s);
						if(result !== undefined) {
							// make sure the result has the right dataType
							callback(200, "success", extractResponses(s, result), {});
						}
					}, can.fixture.delay);
				},
				abort: function () {
					stopped = true;
					clearTimeout(timeout)
				}
			};
		});
	} else {
		var AJAX = can.ajax;
		can.ajax = function (settings) {
			updateSettings(settings, settings);
			if (settings.fixture) {
				var timeout, d = new can.Deferred(),
					stopped = false;

				//TODO this should work with response
				d.getResponseHeader = function () {
				}

				// call success and fail
				d.then(settings.success, settings.fail);

				// abort should stop the timeout and calling success
				d.abort = function () {
					clearTimeout(timeout);
					stopped = true;
					d.reject(d)
				}
				// set a timeout that simulates making a request ....
				timeout = setTimeout(function () {
					// if the user wants to call success on their own, we allow it ...
					var success = function() {
						var response = extractResponse.apply(settings, arguments),
							status = response[0];

						if ( (status >= 200 && status < 300 || status === 304) && stopped === false) {
							d.resolve(response[2][settings.dataType])
						} else {
							// TODO probably resolve better
							d.reject(d, 'error', response[1]);
						}
					},
					// get the result form the fixture
					result = settings.fixture(settings, success, settings.headers, settings);
					if(result !== undefined) {
						d.resolve(result)
					}
				}, can.fixture.delay);
				
				return d;
			} else {
				return AJAX(settings);
			}
		}
	}

	var typeTest = /^(script|json|text|jsonp)$/,
	// a list of 'overwrite' settings object
		overwrites = [],
	// returns the index of an overwrite function
		find = function (settings, exact) {
			for (var i = 0; i < overwrites.length; i++) {
				if ($fixture._similar(settings, overwrites[i], exact)) {
					return i;
				}
			}
			return -1;
		},
	// overwrites the settings fixture if an overwrite matches
		overwrite = function (settings) {
			var index = find(settings);
			if (index > -1) {
				settings.fixture = overwrites[index].fixture;
				return $fixture._getData(overwrites[index].url, settings.url)
			}

		},
		// Makes an attempt to guess where the id is at in the url and returns it.
		getId = function (settings) {
			var id = settings.data.id;

			if (id === undefined && typeof settings.data === "number") {
				id = settings.data;
			}

			/*
			 Check for id in params(if query string)
			 If this is just a string representation of an id, parse
			 if(id === undefined && typeof settings.data === "string") {
			 id = settings.data;
			 }
			 //*/

			if (id === undefined) {
				settings.url.replace(/\/(\d+)(\/|$|\.)/g, function (all, num) {
					id = num;
				});
			}

			if (id === undefined) {
				id = settings.url.replace(/\/(\w+)(\/|$|\.)/g, function (all, num) {
					if (num != 'update') {
						id = num;
					}
				})
			}

			if (id === undefined) { // if still not set, guess a random number
				id = Math.round(Math.random() * 1000)
			}

			return id;
		};


	var $fixture = can.fixture = function (settings, fixture) {
		// if we provide a fixture ...
		if (fixture !== undefined) {
			if (typeof settings == 'string') {
				// handle url strings
				var matches = settings.match(/(GET|POST|PUT|DELETE) (.+)/i);
				if (!matches) {
					settings = {
						url : settings
					};
				} else {
					settings = {
						url : matches[2],
						type : matches[1]
					};
				}

			}

			//handle removing.  An exact match if fixture was provided, otherwise, anything similar
			var index = find(settings, !!fixture);
			if (index > -1) {
				overwrites.splice(index, 1)
			}
			if (fixture == null) {
				return
			}
			settings.fixture = fixture;
			overwrites.push(settings)
		} else {
			can.each(settings, function(fixture, url){
				$fixture(url, fixture);
			})
		}
	};
	var replacer = can.replacer;

	can.extend(can.fixture, {
		// given ajax settings, find an overwrite
		_similar : function (settings, overwrite, exact) {
			if (exact) {
				return can.Object.same(settings, overwrite, {fixture : null})
			} else {
				return can.Object.subset(settings, overwrite, can.fixture._compare)
			}
		},
		_compare : {
			url : function (a, b) {
				return !!$fixture._getData(b, a)
			},
			fixture : null,
			type : "i"
		},
		// gets data from a url like "/todo/{id}" given "todo/5"
		_getData : function (fixtureUrl, url) {
			var order = [],
				fixtureUrlAdjusted = fixtureUrl.replace('.', '\\.').replace('?', '\\?'),
				res = new RegExp(fixtureUrlAdjusted.replace(replacer, function (whole, part) {
					order.push(part)
					return "([^\/]+)"
				}) + "$").exec(url),
				data = {};

			if (!res) {
				return null;
			}
			res.shift();
			can.each(order, function (name) {
				data[name] = res.shift()
			})
			return data;
		},
		/**
		 * @description Make a store of objects to use when making requests against fixtures.
		 * @function can.fixture.store store
		 * @parent can.fixture
		 * 
		 * @signature `can.fixture.store(count, make[, filter])`
		 * 
		 * @param {Number} count The number of items to create.
		 * 
		 * @param {Function} make A function that will return the JavaScript object. The
		 * make function is called back with the id and the current array of items.
		 * 
		 * @param {Function} [filter] A function used to further filter results. Used for to simulate
		 * server params like searchText or startDate.
		 * The function should return true if the item passes the filter,
		 * false otherwise. For example:
		 *
		 *
		 *     function(item, settings){
		 *       if(settings.data.searchText){
		 *            var regex = new RegExp("^"+settings.data.searchText)
		 *           return regex.test(item.name);
		 *       }
		 *     }
		 *
		 * @return {can.fixture.Store} A generator object providing fixture functions for *findAll*, *findOne*, *create*,
		 * *update* and *destroy*.
		 *
		 * @body
		 * `can.fixture.store(count, generator(index,items))` is used
		 * to create a store of items that can simulate a full CRUD service. Furthermore,
		 * the store can do filtering, grouping, sorting, and paging.
		 * 
		 * ## Basic Example
		 * 
		 * The following creates a store for 100 todos:
		 * 
		 *     var todoStore = can.fixture.store(100, function(i){
		 *       return {
		 *         id: i,
		 *         name: "todo number "+i,
		 *         description: "a description of some todo",
		 *         ownerId: can.fixture.rand(10)
		 *       }
		 *     })
		 * 
		 * `todoStore`'s methods:
		 * 
		 *  - [can.fixture.types.Store.findAll findAll],
		 *  - [can.fixture.types.Store.findOne findOne],
		 *  - [can.fixture.types.Store.create create],
		 *  - [can.fixture.types.Store.update update], and
		 *  - [can.fixture.types.Store.destroy destroy] 
		 * 
		 * Can be used to simulate a REST service like:
		 * 
		 *      can.fixture({
		 *        'GET /todos':         todoStore.findAll,
		 *        'GET /todos/{id}':    todoStore.findOne,
		 *        'POST /todos':        todoStore.create,
		 *        'PUT /todos/{id}':    todoStore.update,
		 *        'DELETE /todos/{id}': todoStore.destroy
		 *      });
		 * 
		 * These fixtures, combined with a [can.Model] that connects to these services like:
		 * 
		 *      var Todo = can.Model.extend({
		 *          findAll : 'GET /todos',
		 *          findOne : 'GET /todos/{id}',
		 *          create  : 'POST /todos',
		 *          update  : 'PUT /todos/{id}',
		 *          destroy : 'DELETE /todos/{id}'
		 *      }, {});
		 * 
		 * ... allows you to simulate requests for all of owner 5's todos like:
		 * 
		 *     Todo.findAll({ownerId: 5}, function(todos){
		 *        	   
		 *     })
		 * 
		 * 
		 */
		store: function (types, count, make, filter) {

			var items = [], // TODO: change this to a hash
				currentId = 0,
				findOne = function (id) {
					for (var i = 0; i < items.length; i++) {
						if (id == items[i].id) {
							return items[i];
						}
					}
				},
				methods = {};

			if (typeof types === "string") {
				types = [types + "s", types ]
			} else if (!can.isArray(types)) {
				filter = make;
				make = count;
				count = types;
			}

			// make all items
			can.extend(methods, {
				/**
				 * @description Simulate a findAll to a fixture.
				 * @function can.fixture.types.Store.findAll
				 * @parent can.fixture.types.Store
				 * @signature `store.findAll(request)`
				 * 
				 * `store.findAll(request)` simulates a request to 
				 * get a list items from the server. It supports the
				 * following params:
				 * 
				 *  - order - `order=name ASC` 
				 *  - group - `group=name`
				 *  - limit - `limit=20`
				 *  - offset - `offset=60`
				 *  - id filtering - `ownerId=5`
				 * 
				 * 
				 * @param {{}} request The ajax request object. The available parameters are:
				 * @option {String} order The order of the results.
				 * `order: 'name ASC'`
				 * @option {String} group How to group the results.
				 * `group: 'name'`
				 * @option {String} limit A limit on the number to retrieve.
				 * `limit: 20`
				 * @option {String} offset The offset of the results.
				 * `offset: 60`
				 * @option {String} id Filtering by ID.
				 * `id: 5`
				 * 
				 * @return {Object} a response object like:
				 * 
				 *     {
				 *       count: 1000,
				 *       limit: 20,
				 *       offset: 60,
				 *       data: [item1, item2, ...]
				 *     }
				 * 
				 * where:
				 * 
				 * - count - the number of items that match any filtering 
				 *   before limit and offset is taken into account
				 * - offset - the offset passed
				 * - limit - the limit passed
				 * - data - an array of JS objects with each item's properties
				 * 
				 */
				findAll: function (request) {
					request =  request || {}
					//copy array of items
					var retArr = items.slice(0);
					request.data = request.data || {};
					//sort using order
					//order looks like ["age ASC","gender DESC"]
					can.each((request.data.order || []).slice(0).reverse(), function (name) {
						var split = name.split(" ");
						retArr = retArr.sort(function (a, b) {
							if (split[1].toUpperCase() !== "ASC") {
								if (a[split[0]] < b[split[0]]) {
									return 1;
								} else if (a[split[0]] == b[split[0]]) {
									return 0
								} else {
									return -1;
								}
							}
							else {
								if (a[split[0]] < b[split[0]]) {
									return -1;
								} else if (a[split[0]] == b[split[0]]) {
									return 0
								} else {
									return 1;
								}
							}
						});
					});

					//group is just like a sort
					can.each((request.data.group || []).slice(0).reverse(), function (name) {
						var split = name.split(" ");
						retArr = retArr.sort(function (a, b) {
							return a[split[0]] > b[split[0]];
						});
					});


					var offset = parseInt(request.data.offset, 10) || 0,
						limit = parseInt(request.data.limit, 10) || (items.length - offset),
						i = 0;

					//filter results if someone added an attr like parentId
					for (var param in request.data) {
						i = 0;
						if (request.data[param] !== undefined && // don't do this if the value of the param is null (ignore it)
							(param.indexOf("Id") != -1 || param.indexOf("_id") != -1)) {
							while (i < retArr.length) {
								if (request.data[param] != retArr[i][param]) {
									retArr.splice(i, 1);
								} else {
									i++;
								}
							}
						}
					}

					if (filter) {
						i = 0;
						while (i < retArr.length) {
							if (!filter(retArr[i], request)) {
								retArr.splice(i, 1);
							} else {
								i++;
							}
						}
					}

					//return data spliced with limit and offset
					return {
						"count" : retArr.length,
						"limit" : request.data.limit,
						"offset" : request.data.offset,
						"data" : retArr.slice(offset, offset + limit)
					};
				},
				/**
				 * @description Simulate a findOne request on a fixture.
				 * @function can.fixture.types.Store.findOne
				 * @parent can.fixture.types.Store
				 * @signature `store.findOne(request, callback)`
				 * @param {Object} request Parameters for the request.
				 * @param {Function} callback A function to call with the retrieved item.
				 * 
				 * @body
				 * `store.findOne(request, response(item))` simulates a request to 
				 * get a single item from the server by id.
				 * 
				 *     todosStore.findOne({
				 *       url: "/todos/5"
				 *     }, function(todo){
				 *       
				 *     });
				 * 
				 */
				findOne : function (request, response) {
					var item = findOne(getId(request));
					response(item ? item : undefined);
				},
				/**
				 * @description Simulate an update on a fixture.
				 * @function can.fixture.types.Store.update
				 * @parent can.fixture.types.Store
				 * @signature `store.update(request, callback)`
				 * @param {Object} request Parameters for the request.
				 * @param {Function} callback A function to call with the updated item and headers.
				 * 
				 * @body
				 * `store.update(request, response(props,headers))` simulates
				 * a request to update an items properties on a server.
				 * 
				 *     todosStore.update({
				 *       url: "/todos/5"
				 *     }, function(props, headers){
				 *       props.id //-> 5
				 *       headers.location // "todos/5"
				 *     });
				 */
				update: function (request,response) {
					var id = getId(request);

					// TODO: make it work with non-linear ids ..
					can.extend(findOne(id), request.data);
					response({
						id : getId(request)
					}, {
						location : request.url || "/" + getId(request)
					});
				},
				/**
				 * @description Simulate destroying a Model on a fixture.
				 * @function can.fixture.types.Store.destroy
				 * @parent can.fixture.types.Store
				 * @signature `store.destroy(request, callback)`
				 * @param {Object} request Parameters for the request.
				 * @param {Function} callback A function to call after destruction.
				 * 
				 * @body
				 * `store.destroy(request, response())` simulates
				 * a request to destroy an item from the server.
				 * 
				 * @codestart
				 * todosStore.destroy({
				 *   url: "/todos/5"
				 * }, function(){});
				 * @codeend
				 */
				destroy: function (request) {
					var id = getId(request);
					for (var i = 0; i < items.length; i++) {
						if (items[i].id == id) {
							items.splice(i, 1);
							break;
						}
					}

					// TODO: make it work with non-linear ids ..
					can.extend(findOne(id) || {}, request.data);
					return {};
				},
				/**
				 * @description Simulate creating a Model with a fixture.
				 * @function can.fixture.types.Store.create
				 * @parent can.fixture.types.Store
				 * @signature `store.create(request, callback)`
				 * @param {Object} request Parameters for the request.
				 * @param {Function} callback A function to call with the created item.
				 * 
				 * @body
				 * `store.destroy(request, callback)` simulates
				 * a request to destroy an item from the server.
				 * 
				 * @codestart
				 * todosStore.create({
				 *   url: "/todos"
				 * }, function(){});
				 * @codeend
				 */
				create: function (settings, response) {
					var item = make(items.length, items);

					can.extend(item, settings.data);

					if (!item.id) {
						item.id = currentId++;
					}

					items.push(item);
					response({
						id : item.id
					}, {
						location : settings.url + "/" + item.id
					})
				}
			});

			var reset = function(){
				items = [];
				for (var i = 0; i < (count); i++) {
					//call back provided make
					var item = make(i, items);
	
					if (!item.id) {
						item.id = i;
					}
					currentId = Math.max(item.id+1, currentId+1) || items.length;
					items.push(item);
				}
				if(can.isArray(types)) {
					can.fixture["~" + types[0]] = items;
					can.fixture["-" + types[0]] = methods.findAll;
					can.fixture["-" + types[1]] = methods.findOne;
					can.fixture["-" + types[1]+"Update"] = methods.update;
					can.fixture["-" + types[1]+"Destroy"] = methods.destroy;
					can.fixture["-" + types[1]+"Create"] = methods.create;
				}
				
			}
			reset()
			// if we have types given add them to can.fixture
			

			return can.extend({
				getId: getId,
				/**
				 * @description Get an item from the store by ID.
				 * @function can.fixture.types.Store.find
				 * @parent can.fixture.types.Store
				 * @signature `store.find(settings)`
				 * @param {Object} settings An object containing an `id` key
				 * corresponding to the item to find.
				 * 
				 * @body
				 * `store.find(settings)`
				 * `store.destroy(request, callback)` simulates a request to 
				 * get a single item from the server.
				 * 
				 * @codestart
				 * todosStore.find({
				 *   url: "/todos/5"
				 * }, function(){});
				 * @codeend
				 */
				find: function(settings){
					return findOne( getId(settings) );
				},
				/**
				 * @description Reset the fixture store.
				 * @function can.fixture.types.Store.reset
				 * @parent can.fixture.types.Store
				 * @signature `store.reset()`
				 * 
				 * @body
				 * `store.reset()` resets the store to contain its 
				 * original data. This is useful for making tests that
				 * operate independently.
				 * 
				 * ## Basic Example
				 * 
				 * After creating a `taskStore` and hooking it up to a 
				 * `task` model in the "Basic Example" in [can.fixture.store store's docs],
				 * a test might create several tasks like:
				 * 
				 *     new Task({name: "Take out trash", ownerId: 5}).save();
				 * 
				 * But, another test might need to operate on the original set of
				 * tasks created by `can.fixture.store`. Reset the task store with:
				 * 
				 *     taskStore.reset()
				 * 
				 */
				reset: reset
			}, methods);
		},
		/**
		 * @description Create a random number or selection.
		 * @function can.fixture.rand rand
		 * @parent can.fixture
		 * @signature `can.fixture.rand([min,] max)`
		 * @param {Number} [min=0] The lower bound on integers to select.
		 * @param {Number} max The upper bound on integers to select.
		 * @return {Number} A random integer in the range [__min__, __max__).
		 *
		 * @signature `can.fixture.rand(choices, min[ ,max])`
		 * @param {Array} choices An array of things to choose from.
		 * @param {Number} min The minimum number of times to choose from __choices__.
		 * @param {Number} [max=min] The maximum number of times to choose from __choices__.
		 * @return {Array} An array of between __min__ and __max__ random choices from __choices__.
		 *
		 * @body
		 * `can.fixture.rand` creates random integers or random arrays of
		 * other arrays.
		 *
		 * ## Examples
		 *
		 *     var rand = can.fixture.rand;
		 *
		 *     // get a random integer between 0 and 10 (inclusive)
		 *     rand(11);
		 *
		 *     // get a random number between -5 and 5 (inclusive)
		 *     rand(-5, 6);
		 *
		 *     // pick a random item from an array
		 *     rand(["j","m","v","c"],1)[0]
		 *
		 *     // pick a random number of items from an array
		 *     rand(["j","m","v","c"])
		 *
		 *     // pick 2 items from an array
		 *     rand(["j","m","v","c"],2)
		 *
		 *     // pick between 2 and 3 items at random
		 *     rand(["j","m","v","c"],2,3)
		 */
		rand : function (arr, min, max) {
			if (typeof arr == 'number') {
				if (typeof min == 'number') {
					return arr + Math.floor(Math.random() * (min - arr));
				} else {
					return Math.floor(Math.random() * arr);
				}

			}
			var rand = arguments.callee;
			// get a random set
			if (min === undefined) {
				return rand(arr, rand(arr.length + 1))
			}
			// get a random selection of arr
			var res = [];
			arr = arr.slice(0);
			// set max
			if (!max) {
				max = min;
			}
			//random max
			max = min + Math.round(rand(max - min))
			for (var i = 0; i < max; i++) {
				res.push(arr.splice(rand(arr.length), 1)[0])
			}
			return res;
		},
		/**
		 * @hide
		 *
		 * Use can.fixture.xhr to create an object that looks like an xhr object.
		 *
		 * ## Example
		 *
		 * The following example shows how the -restCreate fixture uses xhr to return
		 * a simulated xhr object:
		 * @codestart
		 * "-restCreate" : function( settings, cbType ) {
		 *   switch(cbType){
		 *     case "success":
		 *       return [
		 *         {id: parseInt(Math.random()*1000)},
		 *         "success",
		 *         can.fixture.xhr()];
		 *     case "complete":
		 *       return [
		 *         can.fixture.xhr({
		 *           getResponseHeader: function() { 
		 *             return settings.url+"/"+parseInt(Math.random()*1000);
		 *           }
		 *         }),
		 *         "success"];
		 *   }
		 * }
		 * @codeend
		 * @param {Object} [xhr] properties that you want to overwrite
		 * @return {Object} an object that looks like a successful XHR object.
		 */
		xhr : function (xhr) {
			return can.extend({}, {
				abort : can.noop,
				getAllResponseHeaders : function () {
					return "";
				},
				getResponseHeader : function () {
					return "";
				},
				open : can.noop,
				overrideMimeType : can.noop,
				readyState : 4,
				responseText : "",
				responseXML : null,
				send : can.noop,
				setRequestHeader : can.noop,
				status : 200,
				statusText : "OK"
			}, xhr);
		},
		/**
		 * @property {Boolean} can.fixture.on on
		 * @parent can.fixture
		 *
		 * `can.fixture.on` lets you programatically turn off fixtures. This is mostly used for testing.
		 *
		 *     can.fixture.on = false
		 *     Task.findAll({}, function(){
		 *       can.fixture.on = true;
		 *     })
		 */
		on : true
	});
	/**
	 * @property {Number} can.fixture.delay delay
	 * @parent can.fixture
	 *
	 * `can.fixture.delay` indicates the delay in milliseconds between an ajax request is made and
	 * the success and complete handlers are called.  This only sets
	 * functional synchronous fixtures that return a result. By default, the delay is 200ms.
	 *
	 * @codestart
	 * steal('can/util/fixtures').then(function(){
	 *   can.fixture.delay = 1000;
	 * })
	 * @codeend
	 */
	can.fixture.delay = 200;

	/**
	 * @property {String} can.fixture.rootUrl rootUrl
	 * @parent can.fixture
	 *
	 * `can.fixture.rootUrl` contains the root URL for fixtures to use.
	 * If you are using StealJS it will use the Steal root
	 * URL by default.
	 */
	can.fixture.rootUrl = getUrl('');

	can.fixture["-handleFunction"] = function (settings) {
		if (typeof settings.fixture === "string" && can.fixture[settings.fixture]) {
			settings.fixture = can.fixture[settings.fixture];
		}
		if (typeof settings.fixture == "function") {
			setTimeout(function () {
				if (settings.success) {
					settings.success.apply(null, settings.fixture(settings, "success"));
				}
				if (settings.complete) {
					settings.complete.apply(null, settings.fixture(settings, "complete"));
				}
			}, can.fixture.delay);
			return true;
		}
		return false;
	};

	//Expose this for fixture debugging
	can.fixture.overwrites = overwrites;
	can.fixture.make = can.fixture.store;
	return can.fixture;
});