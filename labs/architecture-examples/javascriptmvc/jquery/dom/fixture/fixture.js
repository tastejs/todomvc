steal('jquery/dom',
	'jquery/lang/object',
	'jquery/lang/string',function( $ ) {
	
	//used to check urls
	

	
	// the pre-filter needs to re-route the url
	
	$.ajaxPrefilter( function( settings, originalOptions, jqXHR ) {
	  	// if fixtures are on
		if(! $.fixture.on) {
			return;
		}
		
		// add the fixture option if programmed in
		var data = overwrite(settings);
		
		// if we don't have a fixture, do nothing
		if(!settings.fixture){
			if(window.location.protocol === "file:"){
				steal.dev.log("ajax request to " + settings.url+", no fixture found");
			}
			return;
		}
		
		//if referencing something else, update the fixture option
		if ( typeof settings.fixture === "string" && $.fixture[settings.fixture] ) {
			settings.fixture = $.fixture[settings.fixture];
		}
		
		// if a string, we just point to the right url
		if ( typeof settings.fixture == "string" ) {
			var url = settings.fixture;
			
			if (/^\/\//.test(url) ) {
				url = steal.root.mapJoin(settings.fixture.substr(2))+'';
			}
			//!steal-remove-start
			steal.dev.log("looking for fixture in " + url);
			//!steal-remove-end
			settings.url = url;
			settings.data = null;
			settings.type = "GET";
			if (!settings.error ) {
				settings.error = function( xhr, error, message ) {
					throw "fixtures.js Error " + error + " " + message;
				};
			}

		}else {
			//!steal-remove-start
			steal.dev.log("using a dynamic fixture for " +settings.type+" "+ settings.url);
			//!steal-remove-end
			
			//it's a function ... add the fixture datatype so our fixture transport handles it
			// TODO: make everything go here for timing and other fun stuff
			settings.dataTypes.splice(0,0,"fixture");
			
			if(data){
				$.extend(originalOptions.data, data)
			}
			// add to settings data from fixture ...
			
		}
		
	});
		
	
	$.ajaxTransport( "fixture", function( s, original ) {

		// remove the fixture from the datatype
		s.dataTypes.shift();
		
		//we'll return the result of the next data type
		var next = s.dataTypes[0],
			timeout;
		
		return {
		
			send: function( headers , callback ) {
				
				// callback after a timeout
				timeout = setTimeout(function() {
					
					// get the callback data from the fixture function
					var response = s.fixture(original, s, headers);
					
					// normalize the fixture data into a response
					if(!$.isArray(response)){
						var tmp = [{}];
						tmp[0][next] = response
						response = tmp;
					}
					if(typeof response[0] != 'number'){
						response.unshift(200,"success")
					}
					
					// make sure we provide a response type that matches the first datatype (typically json)
					if(!response[2] || !response[2][next]){
						var tmp = {}
						tmp[next] = response[2];
						response[2] = tmp;
					}
					
					// pass the fixture data back to $.ajax
					callback.apply(null, response );
				}, $.fixture.delay);
			},
			
			abort: function() {
				clearTimeout(timeout)
			}
		};
		
	});



	var typeTest = /^(script|json|test|jsonp)$/,
		// a list of 'overwrite' settings object
		overwrites = [],
		// returns the index of an overwrite function
		find = function(settings, exact){
			for(var i =0; i < overwrites.length; i++){
				if($fixture._similar(settings, overwrites[i], exact)){
					return i;
				}
			}
			return -1;
		},
		// overwrites the settings fixture if an overwrite matches
		overwrite = function(settings){
			var index = find(settings);
			if(index > -1){
				settings.fixture = overwrites[index].fixture;
				return $fixture._getData(overwrites[index].url, settings.url)
			}

		},
		/**
		 * Makes an attempt to guess where the id is at in the url and returns it.
		 * @param {Object} settings
		 */
		getId = function(settings){
        	var id = settings.data.id;

			if(id === undefined && typeof settings.data === "number") {
				id = settings.data;
			}

			/*
			Check for id in params(if query string)
			If this is just a string representation of an id, parse
			if(id === undefined && typeof settings.data === "string") {
				id = settings.data;
			}
			//*/

			if(id === undefined){
                settings.url.replace(/\/(\d+)(\/|$|\.)/g, function(all, num){
                    id = num;
                });
            }
			
            if(id === undefined){
                id = settings.url.replace(/\/(\w+)(\/|$|\.)/g, function(all, num){
                    if(num != 'update'){
                        id = num;
                    }
                })
            }
			
			if(id === undefined){ // if still not set, guess a random number
                id = Math.round(Math.random()*1000)
            }

			return id;
		};

	/**
	 * @function jQuery.fixture
	 * @plugin jquery/dom/fixture
	 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/fixture/fixture.js
	 * @test jquery/dom/fixture/qunit.html
	 * @parent dom
	 * 
	 * <code>$.fixture</code> intercepts a AJAX request and simulates
	 * the response with a file or function. They are a great technique 
	 * when you want to develop JavaScript 
	 * independently of the backend. 
	 * 
	 * ## Types of Fixtures
	 * 
	 * There are two common ways of using fixtures.  The first is to 
	 * map Ajax requests to another file.  The following 
	 * intercepts requests to <code>/tasks.json</code> and directs them 
	 * to <code>fixtures/tasks.json</code>:
	 * 
	 *     $.fixture("/tasks.json","fixtures/tasks.json");
	 *     
	 * The other common option is to generate the Ajax response with
	 * a function.  The following intercepts updating tasks at
	 * <code>/tasks/ID.json</code> and responds with updated data:
	 * 
	 *     $.fixture("PUT /tasks/{id}.json", function(original, settings, headers){
	 *        return { updatedAt : new Date().getTime() }
	 *     })
	 * 
	 * We categorize fixtures into the following types:
	 * 
	 *   - __Static__ - the response is in a file.
	 *   - __Dynamic__ - the response is generated by a function.
	 * 
	 * There are different ways to lookup static and dynamic fixtures.
	 * 
	 * ## Static Fixtures
	 * 
	 * Static fixtures use an alternate url as the response of the Ajax request.
	 * 
	 *     // looks in fixtures/tasks1.json relative to page
	 *     $.fixture("tasks/1", "fixtures/task1.json");
	 *     
	 *     $.fixture("tasks/1", "//fixtures/task1.json");
	 * 
	 * ## Dynamic Fixtures
	 * 
	 * Dynamic Fixtures are functions that get the details of 
	 * the Ajax request and return the result of the mocked service
	 * request from your server.  
	 * 
	 * For example, the following returns a successful response 
	 * with JSON data from the server:
	 * 
	 *     $.fixture("/foobar.json", function(orig, settings, headers){
	 *       return [200, "success", {json: {foo: "bar" } }, {} ]
	 *     })
	 * 
	 * The fixture function has the following signature:
	 * 
	 *     function( originalOptions, options, headers ) {
	 *       return [ status, statusText, responses, responseHeaders ]
	 *     }
	 * 
	 * where the fixture function is called with:
	 * 
	 *   - originalOptions - are the options provided to the ajax method, unmodified,
	 *     and thus, without defaults from ajaxSettings
	 *   - options - are the request options
	 *   - headers - a map of key/value request headers
	 * 
	 * and the fixture function returns an array as arguments for  ajaxTransport's <code>completeCallback</code> with:
	 * 
	 *   - status - is the HTTP status code of the response.
	 *   - statusText - the status text of the response
	 *   - responses - a map of dataType/value that contains the responses for each data format supported
	 *   - headers - response headers
	 * 
	 * However, $.fixture handles the 
	 * common case where you want a successful response with JSON data.  The 
	 * previous can be written like:
	 * 
	 *     $.fixture("/foobar.json", function(orig, settings, headers){
	 *       return {foo: "bar" };
	 *     })
	 * 
	 * If you want to return an array of data, wrap your array in another array:
	 * 
	 *     $.fixture("/tasks.json", function(orig, settings, headers){
	 *       return [ [ "first","second","third"] ];
	 *     })
	 * 
	 * $.fixture works closesly with jQuery's 
	 * ajaxTransport system.  Understanding it is the key to creating advanced
	 * fixtures.
	 * 
	 * ### Templated Urls
	 * 
	 * Often, you want a dynamic fixture to handle urls 
	 * for multiple resources (for example a REST url scheme). $.fixture's
	 * templated urls allow you to match urls with a wildcard.  
	 * 
	 * The following example simulates services that get and update 100 todos.  
	 * 
	 *     // create todos
	 *     var todos = {};
	 *     for(var i = 0; i < 100; i++) {
	 *       todos[i] = {
	 *         id: i,
	 *         name: "Todo "+i
	 *       }
	 *     }
	 *     $.fixture("GET /todos/{id}", function(orig){
	 *       // return the JSON data
	 *       // notice that id is pulled from the url and added to data
	 *       return todos[orig.data.id]
	 *     })
	 *     $.fixture("PUT /todos/{id}", function(orig){
	 *       // update the todo's data
	 *       $.extend( todos[orig.data.id], orig.data );
	 *       
	 *       // return data
	 *       return {};
	 *     })
	 * 
	 * Notice that data found in templated urls (ex: <code>{id}</code>) is added to the original
	 * data object.
	 * 
	 * ## Simulating Errors
	 * 
	 * The following simulates an unauthorized request 
	 * to <code>/foo</code>.
	 * 
	 *     $.fixture("/foo", function(){
	 * 		return [401,"{type: 'unauthorized'}"]
	 * 	   });
	 * 
	 * This could be received by the following Ajax request:
	 * 
	 *     $.ajax({
	 *       url: '/foo',
	 *       error : function(jqXhr, status, statusText){
	 *         // status === 'error'
	 *         // statusText === "{type: 'unauthorized'}"
	 *       }
	 *     })
	 * 
	 * ## Turning off Fixtures
	 * 
	 * You can remove a fixture by passing <code>null</code> for the fixture option:
	 * 
	 *     // add a fixture
	 *     $.fixture("GET todos.json","//fixtures/todos.json");
	 *     
	 *     // remove the fixture
	 *     $.fixture("GET todos.json", null)
	 *     
	 * You can also set [jQuery.fixture.on $.fixture.on] to false:
	 * 
	 *     $.fixture.on = false;
	 * 
	 * ## Make
	 * 
	 * [jQuery.fixture.make $.fixture.make] makes a CRUD service layer that handles sorting, grouping,
	 * filtering and more.
	 * 
	 * ## Testing Performance
	 * 
	 * Dynamic fixtures are awesome for performance testing.  Want to see what 
	 * 10000 files does to your app's performance?  Make a fixture that returns 10000 items.
	 * 
	 * What to see what the app feels like when a request takes 5 seconds to return?  Set
	 * [jQuery.fixture.delay] to 5000.
	 * 
	 * @demo jquery/dom/fixture/fixture.html
	 * 
	 * @param {Object|String} settings Configures the AJAX requests the fixture should 
	 * intercept.  If an __object__ is passed, the object's properties and values
	 * are matched against the settings passed to $.ajax.  
	 * 
	 * If a __string__ is passed, it can be used to match the url and type. Urls
	 * can be templated, using <code>{NAME}</code> as wildcards.  
	 * 
	 * @param {Function|String} fixture The response to use for the AJAX 
	 * request. If a __string__ url is passed, the ajax request is redirected
	 * to the url. If a __function__ is provided, it looks like:
	 * 
	 *     fixture( originalSettings, settings, headers	)
	 *     
	 * where:
	 * 
	 *   - originalSettings - the orignal settings passed to $.ajax
	 *   - settings - the settings after all filters have run
	 *   - headers - request headers
	 *   
	 * If __null__ is passed, and there is a fixture at settings, that fixture will be removed,
	 * allowing the AJAX request to behave normally.
	 */
	var $fixture = $.fixture = function( settings , fixture ){
		// if we provide a fixture ...
		if(fixture !== undefined){
			if(typeof settings == 'string'){
				// handle url strings
				var matches = settings.match(/(GET|POST|PUT|DELETE) (.+)/i);
				if(!matches){
					settings  = {
						url : settings
					};
				} else {
					settings  = {
						url : matches[2],
						type: matches[1]
					};
				}
				
			}
			
			//handle removing.  An exact match if fixture was provided, otherwise, anything similar
			var index = find(settings, !!fixture);
			if(index > -1){
				overwrites.splice(index,1)
			}
			if(fixture == null){
				return 
			}
			settings.fixture = fixture;
			overwrites.push(settings)
		}
	};
	var replacer = $.String._regs.replacer;
	
	$.extend($.fixture, {
		// given ajax settings, find an overwrite
		_similar : function(settings, overwrite, exact){
			if(exact){
				return $.Object.same(settings , overwrite, {fixture :  null})
			} else {
				return $.Object.subset(settings, overwrite, $.fixture._compare)
			}
		},
		_compare : {
			url : function(a, b){
				return !! $fixture._getData(b, a)
			},
			fixture : null,
			type : "i"
		},
		// gets data from a url like "/todo/{id}" given "todo/5"
		_getData : function(fixtureUrl, url){
			var order = [],
				fixtureUrlAdjusted = fixtureUrl.replace('.', '\\.').replace('?', '\\?'),
				res = new RegExp(fixtureUrlAdjusted.replace(replacer, function(whole, part){
			  		order.push(part)
			 		 return "([^\/]+)"
				})+"$").exec(url),
				data = {};
			
			if(!res){
				return null;
			}
			res.shift();
			$.each(order, function(i, name){
				data[name] = res.shift()
			})
			return data;
		},
		/**
		 * @hide
		 * Provides a rest update fixture function
		 */
		"-restUpdate": function( settings ) {
			return [200,"succes",{
					id: getId(settings)
				},{
					location: settings.url+"/"+getId(settings)
				}];
		},
		
		/**
		 * @hide
		 * Provides a rest destroy fixture function
		 */
		"-restDestroy": function( settings, cbType ) {
			return {};
		},
		
		/**
		 * @hide
		 * Provides a rest create fixture function
		 */
		"-restCreate": function( settings, cbType, nul, id ) {
			var id = id || parseInt(Math.random() * 100000, 10);
			return [200,"succes",{
						id: id
					},{
						location: settings.url+"/"+id	
					}];
		},
		
		/**
		 * @function jQuery.fixture.make
		 * @parent jQuery.fixture
		 * Used to make fixtures for findAll / findOne style requests.
		 * 
		 *     //makes a nested list of messages
		 *     $.fixture.make(["messages","message"],1000, function(i, messages){
		 *       return {
		 *         subject: "This is message "+i,
		 *         body: "Here is some text for this message",
		 *         date: Math.floor( new Date().getTime() ),
		 *         parentId : i < 100 ? null : Math.floor(Math.random()*i)
		 *       }
		 *     })
		 *     //uses the message fixture to return messages limited by offset, limit, order, etc.
		 *     $.ajax({
		 *       url: "messages",
		 *       data:{ 
		 *          offset: 100, 
		 *          limit: 50, 
		 *          order: ["date ASC"],
		 *          parentId: 5},
		 *        },
		 *        fixture: "-messages",
		 *        success: function( messages ) {  ... }
		 *     });
		 * 
		 * @param {Array|String} types An array of the fixture names or the singular fixture name.
		 * If an array, the first item is the plural fixture name (prefixed with -) and the second
		 * item is the singular name.  If a string, it's assumed to be the singular fixture name.  Make
		 * will simply add s to the end of it for the plural name.
		 * @param {Number} count the number of items to create
		 * @param {Function} make a function that will return json data representing the object.  The
		 * make function is called back with the id and the current array of items.
		 * @param {Function} filter (optional) a function used to further filter results. Used for to simulate 
		 * server params like searchText or startDate.  The function should return true if the item passes the filter, 
		 * false otherwise.  For example:
		 * 
		 * 
		 *     function(item, settings){
		 *       if(settings.data.searchText){
		 * 	       var regex = new RegExp("^"+settings.data.searchText)
		 * 	      return regex.test(item.name);
		 *       }
		 *     }
		 * 
		 */
		make: function( types, count, make, filter ) {
			if(typeof types === "string"){
				types = [types+"s",types ]
			}
			// make all items
			var items = ($.fixture["~" + types[0]] = []), // TODO: change this to a hash
				findOne = function(id){
					for ( var i = 0; i < items.length; i++ ) {
						if ( id == items[i].id ) {
							return items[i];
						}
					}
				};
				
			for ( var i = 0; i < (count); i++ ) {
				//call back provided make
				var item = make(i, items);

				if (!item.id ) {
					item.id = i;
				}
				items.push(item);
			}
			//set plural fixture for findAll
			$.fixture["-" + types[0]] = function( settings ) {
				//copy array of items
				var retArr = items.slice(0);
				settings.data = settings.data || {};
				//sort using order
				//order looks like ["age ASC","gender DESC"]
				$.each((settings.data.order || []).slice(0).reverse(), function( i, name ) {
					var split = name.split(" ");
					retArr = retArr.sort(function( a, b ) {
						if ( split[1].toUpperCase() !== "ASC" ) {
							if( a[split[0]] < b[split[0]] ) {
								return 1;
							} else if(a[split[0]] == b[split[0]]){
								return 0
							} else {
								return -1;
							}
						}
						else {
							if( a[split[0]] < b[split[0]] ) {
								return -1;
							} else if(a[split[0]] == b[split[0]]){
								return 0
							} else {
								return 1;
							}
						}
					});
				});

				//group is just like a sort
				$.each((settings.data.group || []).slice(0).reverse(), function( i, name ) {
					var split = name.split(" ");
					retArr = retArr.sort(function( a, b ) {
						return a[split[0]] > b[split[0]];
					});
				});


				var offset = parseInt(settings.data.offset, 10) || 0,
					limit = parseInt(settings.data.limit, 10) || (items.length - offset),
					i = 0;

				//filter results if someone added an attr like parentId
				for ( var param in settings.data ) {
					i=0;
					if ( settings.data[param] !== undefined && // don't do this if the value of the param is null (ignore it)
						(param.indexOf("Id") != -1 || param.indexOf("_id") != -1) ) {
						while ( i < retArr.length ) {
							if ( settings.data[param] != retArr[i][param] ) {
								retArr.splice(i, 1);
							} else {
								i++;
							}
						}
					}
				}
				
				
				if( filter ) {
					i = 0;
					while (i < retArr.length) {
						if (!filter(retArr[i], settings)) {
							retArr.splice(i, 1);
						} else {
							i++;
						}
					}
				}

				//return data spliced with limit and offset
				return [{
					"count": retArr.length,
					"limit": settings.data.limit,
					"offset": settings.data.offset,
					"data": retArr.slice(offset, offset + limit)
				}];
			};
            // findOne
			$.fixture["-" + types[1]] = function( settings ) {
				var item = findOne(getId(settings));
				return item ? [item] : [];
			};
            // update
            $.fixture["-" + types[1]+"Update"] = function( settings, cbType ) {
                var id = getId(settings);

                // TODO: make it work with non-linear ids ..
                $.extend(findOne(id), settings.data);
				return $.fixture["-restUpdate"](settings, cbType)
			};
			$.fixture["-" + types[1]+"Destroy"] = function( settings, cbType ) {
				var id = getId(settings);
				for(var i = 0; i < items.length; i ++ ){
					if(items[i].id == id){
						items.splice(i, 1);
						break;
					}
				}
				
                // TODO: make it work with non-linear ids ..
                $.extend(findOne(id), settings.data);
				return $.fixture["-restDestroy"](settings, cbType)
			};
			$.fixture["-" + types[1]+"Create"] = function( settings, cbType ) {
                var item = make(items.length, items);
				
				$.extend(item, settings.data);
				
				if(!item.id){
					item.id = items.length;
				}
				
				items.push(item);
				
				return $.fixture["-restCreate"](settings, cbType, undefined, item.id );
			};
			
			
			return {
				getId: getId,
				findOne : findOne,
				find : function(settings){
					return findOne( getId(settings) );
				}
			}
		},
		/**
		 * @function jQuery.fixture.rand
		 * @parent jQuery.fixture
		 * 
		 * Creates random integers or random arrays of 
		 * other arrays. 
		 * 
		 * ## Examples
		 * 
		 *     var rand = $.fixture.rand;
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
		 *     
		 * 
		 * @param {Array|Number} arr An array of items to select from.
		 * If a number is provided, a random number is returned.
		 * If min and max are not provided, a random number of items are selected
		 * from this array.    
		 * @param {Number} [min] If only min is provided, min items 
		 * are selected.
		 * @param {Number} [max] If min and max are provided, a random number of
		 * items between min and max (inclusive) is selected.
		 */
		rand : function(arr, min, max){
			if(typeof arr == 'number'){
				if(typeof min  == 'number'){
					return arr+ Math.floor(Math.random() * (min - arr) );
				} else {
					return Math.floor(Math.random() * arr);
				}
				
			}
			var rand = arguments.callee;
			// get a random set
			if(min === undefined){
				return rand(arr, rand(arr.length+1))
			}
			// get a random selection of arr
			var res = [];
			arr = arr.slice(0);
			// set max
			if(!max){
				max = min;
			}
			//random max
			max = min + Math.round(  rand(max - min) )
			for(var i=0; i < max; i++){
				res.push(arr.splice( rand(arr.length), 1  )[0])
			}
			return res;
		},
		/**
		 * @hide
		 * Use $.fixture.xhr to create an object that looks like an xhr object. 
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
		 *         $.fixture.xhr()];
		 *     case "complete":
		 *       return [ 
		 *         $.fixture.xhr({
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
		xhr: function( xhr ) {
			return $.extend({}, {
				abort: $.noop,
				getAllResponseHeaders: function() {
					return "";
				},
				getResponseHeader: function() {
					return "";
				},
				open: $.noop,
				overrideMimeType: $.noop,
				readyState: 4,
				responseText: "",
				responseXML: null,
				send: $.noop,
				setRequestHeader: $.noop,
				status: 200,
				statusText: "OK"
			}, xhr);
		},
		/**
		 * @attribute on
		 * On lets you programatically turn off fixtures.  This is mostly used for testing.
		 * 
		 *     $.fixture.on = false
		 *     Task.findAll({}, function(){
		 *       $.fixture.on = true;
		 *     })
		 */
		on : true
	});
	/**
	 * @attribute $.fixture.delay
	 * @parent $.fixture
	 * Sets the delay in milliseconds between an ajax request is made and
	 * the success and complete handlers are called.  This only sets
	 * functional fixtures.  By default, the delay is 200ms.
	 * @codestart
	 * steal('jquery/dom/fixtures').then(function(){
	 *   $.fixture.delay = 1000;
	 * })
	 * @codeend
	 */
	$.fixture.delay = 200;

	$.fixture["-handleFunction"] = function( settings ) {
		if ( typeof settings.fixture === "string" && $.fixture[settings.fixture] ) {
			settings.fixture = $.fixture[settings.fixture];
		}
		if ( typeof settings.fixture == "function" ) {
			setTimeout(function() {
				if ( settings.success ) {
					settings.success.apply(null, settings.fixture(settings, "success"));
				}
				if ( settings.complete ) {
					settings.complete.apply(null, settings.fixture(settings, "complete"));
				}
			}, $.fixture.delay);
			return true;
		}
		return false;
	};

	
	
    /**
  	 * @page jquery.fixture.0organizing Organizing Fixtures
  	 * @parent jQuery.fixture
	 * 
	 * The __best__ way of organizing fixtures is to have a 'fixtures.js' file that steals
	 * <code>jquery/dom/fixture</code> and defines all your fixtures.  For example,
	 * if you have a 'todo' application, you might 
	 * have <code>todo/fixtures/fixtures.js</code> look like:
	 * 
	 *     steal({
	 *             path: '//jquery/dom/fixture.js',
	 *             ignore: true
	 *           })
	 *           .then(function(){
	 *       
	 *       $.fixture({
	 *           type: 'get',  
	 *           url: '/services/todos.json'
	 *         },
	 *         '//todo/fixtures/todos.json');
	 *         
	 *       $.fixture({
	 *           type: 'post',  
	 *           url: '/services/todos.json'
	 *         },
	 *         function(settings){
	 *         	return {id: Math.random(), 
	 *                  name: settings.data.name}
	 *         });
	 *         
	 *     })
	 * 
	 * __Notice__: We used steal's ignore option to prevent 
	 * loading the fixture plugin in production.
	 * 
	 * Finally, we steal <code>todo/fixtures/fixtures.js</code> in the 
	 * app file (<code>todo/todo.js</code>) like:
	 * 
	 * 
	 *     steal({path: '//todo/fixtures/fixtures.js',ignore: true});
	 *     
	 *     //start of your app's steals
	 *     steal( ... )
	 * 
	 * We typically keep it a one liner so it's easy to comment out.
	 * 
	 * ## Switching Between Sets of Fixtures
	 * 
	 * If you are using fixtures for testing, you often want to use different
	 * sets of fixtures.  You can add something like the following to your fixtures.js file:
	 * 
	 *     if( /fixtureSet1/.test( window.location.search) ){
	 *       $.fixture("/foo","//foo/fixtures/foo1.json');
	 *     } else if(/fixtureSet2/.test( window.location.search)){
	 *       $.fixture("/foo","//foo/fixtures/foo1.json');
	 *     } else {
	 *       // default fixtures (maybe no fixtures)
	 *     }
	 * 
	 */
	 //Expose this for fixture debugging
	 $.fixture.overwrites = overwrites;
});
