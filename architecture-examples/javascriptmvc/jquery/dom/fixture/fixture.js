steal.plugins('jquery/dom').then(function( $ ) {
	
	// the pre-filter needs to re-route the url
	$.ajaxPrefilter( function( settings, originalOptions, jqXHR ) {
	  	// if fixtures are on
		if(! $.fixture.on) {
			return;
		}
		
		// add the fixture option if programmed in
		overwrite(settings);
		
		// if we don't have a fixture, do nothing
		if(!settings.fixture){
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
				url = steal.root.join(settings.fixture.substr(2));
			}
			//@steal-remove-start
			steal.dev.log("looking for fixture in " + url);
			//@steal-remove-end
			settings.url = url;
			settings.data = null;
			settings.type = "GET";
			if (!settings.error ) {
				settings.error = function( xhr, error, message ) {
					throw "fixtures.js Error " + error + " " + message;
				};
			}

		}else {
			//@steal-remove-start
			steal.dev.log("using a dynamic fixture for " + settings.url);
			//@steal-remove-end
			
			//it's a function ... add the fixture datatype so our fixture transport handles it
			// TODO: make everything go here for timing and other fun stuff
			settings.dataTypes.splice(0,0,"fixture")
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
		// checks if an overwrite matches ajax settings
		isSimilar = function(settings, overwrite, exact){
			
			settings = $.extend({}, settings)
			
			for(var prop in overwrite){
				if(prop === 'fixture'){
					
				} else if(overwrite[prop] !== settings[prop]){
					return false;
				}
				if(exact){
					delete settings[prop]
				}
			}
			if(exact){
				for(var name in settings){
					return false
				}
			}
			return true;
		},
		// returns the index of an overwrite function
		find = function(settings, exact){
			for(var i =0; i < overwrites.length; i++){
				if(isSimilar(settings, overwrites[i], exact)){
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
			}

		},
		/**
		 * Makes an attempt to guess where the id is at in the url and returns it.
		 * @param {Object} settings
		 */
		getId = function(settings){
        	var id = settings.data.id;

			if(id === undefined){
                settings.url.replace(/\/(\d+)(\/|$)/g, function(all, num){
                    id = num;
                });
            }
			
            if(id === undefined){
                id = settings.url.replace(/\/(\w+)(\/|$)/g, function(all, num){
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
	 * @class jQuery.fixture
	 * @plugin jquery/dom/fixture
	 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/fixture/fixture.js
	 * @test jquery/dom/fixture/qunit.html
	 * @parent dom
	 * 
	 * Fixtures simulate AJAX responses.  Instead of making 
	 * a request to a server, fixtures simulate 
	 * the response with a file or function. They are a great technique when you want to develop JavaScript 
	 * independently of the backend. 
	 * 
	 * ### Two Quick Examples
	 * 
	 * There are two common ways of using fixtures.  The first is to 
	 * map Ajax requests to another file or function.  The following 
	 * intercepts requests to <code>/tasks.json</code> and directs them 
	 * to <code>fixtures/tasks.json</code>:
	 * 
	 *     $.fixture("/tasks.json","fixtures/tasks.json");
	 *     
	 * You can also add a fixture option directly to $.ajax like:
	 * 
	 *     $.ajax({url: "/tasks.json",
	 *       dataType: "json",
	 *       type: "get",
	 *       fixture: "fixtures/tasks.json",
	 *       success: myCallback
	 *     });
	 * 
	 * The first technique keeps fixture logic out of your Ajax 
	 * requests.  However, if your service urls are changing __a lot__ 
	 * the second technique means you only have to change the service
	 * url in one spot.
	 * 
	 * 
	 * 
	 * ## Types of Fixtures
	 * 
	 * There are 2 types of fixtures:
	 *   - __Static__ - the response is in a file.
	 *   - __Dynamic__ - the response is generated by a function.
	 * 
	 * There are different ways to lookup static and dynamic fixtures.
	 * 
	 * ### Static Fixtures
	 * 
	 * Static fixtures use an alternate url as the response of the Ajax request.
	 * 
	 *     // looks in fixtures/tasks1.json relative to page
	 *     $.fixture("tasks/1", "fixtures/task1.json");
	 *     
	 *     $.ajax({type:"get", 
	 *            url: "tasks/1", 
	 *            fixture: "fixtures/task1.json"})
	 *     
	 *     // looks in fixtures/tasks1.json relative to jmvc root
	 *     // this assumes you are using steal
	 *     $.fixture("tasks/1", "//fixtures/task1.json");
	 *     
	 *     $.ajax({type:"get", 
	 *            url: "tasks/1", 
	 *            fixture: "//fixtures/task1.json"})` 
	 * 
	 * ### Dynamic Fixtures
	 * 
	 * Dynamic Fixtures are functions that return the arguments the $.ajax callbacks 
	 * (<code>beforeSend</code>, <code>success</code>, <code>complete</code>, 
	 * <code>error</code>) expect. 
	 *    
	 * For example, the "<code>success</code>" of a json request is called with 
	 * <code>[data, textStatus, XMLHttpRequest].
	 * 
	 * There are 2 ways to lookup dynamic fixtures. They can provided:
	 * 
	 *     //just use a function as the fixture property
	 *     $.ajax({
	 *       type:     "get", 
	 *       url:      "tasks",
	 *       data:     {id: 5},
	 *       dataType: "json",
	 *       fixture: function( settings, callbackType ) {
	 *         var xhr = {responseText: "{id:"+settings.data.id+"}"}
	 *         switch(callbackType){
	 *           case "success": 
	 *             return [{id: settings.data.id},"success",xhr]
	 *           case "complete":
	 *             return [xhr,"success"]
	 *         }
	 *       }
	 *     })
	 * 
	 * Or found by name on $.fixture:
	 * 
	 *     // add your function on $.fixture
	 *     // We use -FUNC by convention
	 *     $.fixture["-myGet"] = function(settings, cbType){...}
	 * 
	 *     // reference it
	 *     $.ajax({
	 *       type:"get", 
	 *       url: "tasks/1", 
	 *       dataType: "json", 
	 *       fixture: "-myGet"})
	 * 
	 * <p>Dynamic fixture functions are called with:</p>
	 * <ul>
	 * <li> settings - the settings data passed to <code>$.ajax()</code>
	 * <li> calbackType - the type of callback about to be called: 
	 *  <code>"beforeSend"</code>, <code>"success"</code>, <code>"complete"</code>, 
	 *    <code>"error"</code></li>
	 * </ul>
	 * and should return an array of arguments for the callback.<br/><br/>
	 * <div class='whisper'>PRO TIP: 
	 * Dynamic fixtures are awesome for performance testing.  Want to see what 
	 * 10000 files does to your app's performance?  Make a fixture that returns 10000 items.
	 * 
	 * What to see what the app feels like when a request takes 5 seconds to return?  Set
	 * [jQuery.fixture.delay] to 5000.
	 * </div>
	 * 
	 * ## Helpers
	 * 
	 * The fixture plugin comes with a few ready-made dynamic fixtures and 
	 * fixture helpers:</p>
	 * 
	 * <ul>
	 * <li>[jQuery.fixture.make] - creates fixtures for findAll, findOne.</li>
	 * <li>[jQuery.fixture.-restCreate] - a fixture for restful creates.</li>
	 * <li>[jQuery.fixture.-restDestroy] - a fixture for restful updates.</li>
	 * <li>[jQuery.fixture.-restUpdate] - a fixture for restful destroys.</li>
	 * </ul>
	 * 
	 * @demo jquery/dom/fixture/fixture.html
	 * @constructor
	 * Takes an ajax settings and returns a url to look for a fixture.  Overwrite this if you want a custom lookup method.
	 * @param {Object} settings
	 * @return {String} the url that will be used for the fixture
	 */
	$.fixture = function( settings , fixture) {
		// if we provide a fixture ...
		if(fixture !== undefined){
			if(typeof settings == 'string'){
				// handle url strings
				settings  ={
					url : settings
				};
			}
			
			//handle removing.  An exact match if fixture was provided, otherwise, anything similar
			var index = find(settings, !!fixture);
			if(index >= -1){
				overwrites.splice(index,1)
			}
			if(fixture == null){
				return 
			}
			
			settings.fixture = fixture;
			overwrites.push(settings)
		}
	};

	$.extend($.fixture, {	
		/**
		 * Provides a rest update fixture function
		 */
		"-restUpdate": function( settings ) {
			return [{
					id: getId(settings)
				},{
					location: settings.url+"/"+getId(settings)
				}];
		},
		
		/**
		 * Provides a rest destroy fixture function
		 */
		"-restDestroy": function( settings, cbType ) {
			return {};
		},
		
		/**
		 * Provides a rest create fixture function
		 */
		"-restCreate": function( settings, cbType ) {
			var id = parseInt(Math.random() * 100000, 10);
			return [{
						id: id
					},{
						location: settings.url+"/"+id	
					}];
		},
		
		/**
		 * Used to make fixtures for findAll / findOne style requests.
		 * @codestart
		 * //makes a nested list of messages
		 * $.fixture.make(["messages","message"],1000, function(i, messages){
		 *   return {
		 *     subject: "This is message "+i,
		 *     body: "Here is some text for this message",
		 *     date: Math.floor( new Date().getTime() ),
		 *     parentId : i < 100 ? null : Math.floor(Math.random()*i)
		 *   }
		 * })
		 * //uses the message fixture to return messages limited by offset, limit, order, etc.
		 * $.ajax({
		 *   url: "messages",
		 *   data:{ 
		 *      offset: 100, 
		 *      limit: 50, 
		 *      order: ["date ASC"],
		 *      parentId: 5},
		 *    },
		 *    fixture: "-messages",
		 *    success: function( messages ) {  ... }
		 * });
		 * @codeend
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
		 * @codestart
		 * function(item, settings){
			  if(settings.data.searchText){
				  var regex = new RegExp("^"+settings.data.searchText)
				  return regex.test(item.name);
		      }
		 * }
		 * @codeend
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
					limit = parseInt(settings.data.limit, 10) || (count - offset),
					i = 0;

				//filter results if someone added an attr like parentId
				for ( var param in settings.data ) {
					i=0;
					if ( settings.data[param] && // don't do this if the value of the param is null (ignore it)
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
				return [findOne(settings.data.id)];
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
				return $.fixture["-restCreate"](settings, cbType)
			};
		},
		/**
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
	 * @attribute delay
	 * Sets the delay in milliseconds between an ajax request is made and
	 * the success and complete handlers are called.  This only sets
	 * functional fixtures.  By default, the delay is 200ms.
	 * @codestart
	 * steal.plugins('jquery/dom/fixtures').then(function(){
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
	 *  @add jQuery
	 */
	$.
	/**
	 * Adds a fixture param.  
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} callback
	 * @param {Object} type
	 * @param {Object} fixture
	 */
	get = function( url, data, callback, type, fixture ) {
		// shift arguments if data argument was ommited
		if ( jQuery.isFunction(data) ) {
            if(!typeTest.test(type||"")){
                fixture = type;
                type = callback;
            }
            callback = data;
            data = null;
        }
		if ( jQuery.isFunction(data) ) {
			fixture = type;
			type = callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type,
			fixture: fixture
		});
	};

	$.
	/**
	 * Adds a fixture param.
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} callback
	 * @param {Object} type
	 * @param {Object} fixture
	 */
	post = function( url, data, callback, type, fixture ) {
		if ( jQuery.isFunction(data) ) {
            if(!typeTest.test(type||"")){
                fixture = type;
                type = callback;
            }
            callback = data;
            data = {};
        }

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type,
			fixture: fixture
		});
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
	 *     steal.plugins( ... )
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
	//
	/**
	 * @add jQuery.fixture
	 */
	//
	/**
	 * @page jquery.fixture.1errors Simulating Errors
	 * @parent jQuery.fixture
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
	 */
});