/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library"], function (can) {
	// ## view.js
	// `can.view`  
	// _Templating abstraction._

	var isFunction = can.isFunction,
		makeArray = can.makeArray,
		// Used for hookup `id`s.
		hookupId = 1,
		/**
		 * @add can.view
		 */
		$view = can.view = can.template = function (view, data, helpers, callback) {
			// If helpers is a `function`, it is actually a callback.
			if (isFunction(helpers)) {
				callback = helpers;
				helpers = undefined;
			}

			var pipe = function (result) {
				return $view.frag(result);
			},
				// In case we got a callback, we need to convert the can.view.render
				// result to a document fragment
				wrapCallback = isFunction(callback) ? function (frag) {
					callback(pipe(frag));
				} : null,
				// Get the result, if a renderer function is passed in, then we just use that to render the data
				result = isFunction(view) ? view(data, helpers, wrapCallback) : $view.render(view, data, helpers, wrapCallback),
				deferred = can.Deferred();

			if (isFunction(result)) {
				return result;
			}

			if (can.isDeferred(result)) {
				result.then(function (result, data) {
					deferred.resolve.call(deferred, pipe(result), data);
				}, function () {
					deferred.fail.apply(deferred, arguments);
				});
				return deferred;
			}

			// Convert it into a dom frag.
			return pipe(result);
		};

	can.extend($view, {
		// creates a frag and hooks it up all at once
		/**
		 * @function can.view.frag frag
		 * @parent can.view.static
		 */
		frag: function (result, parentNode) {
			return $view.hookup($view.fragment(result), parentNode);
		},

		// simply creates a frag
		// this is used internally to create a frag
		// insert it
		// then hook it up
		fragment: function (result) {
			var frag = can.buildFragment(result, document.body);
			// If we have an empty frag...
			if (!frag.childNodes.length) {
				frag.appendChild(document.createTextNode(''));
			}
			return frag;
		},

		// Convert a path like string into something that's ok for an `element` ID.
		toId: function (src) {
			return can.map(src.toString()
				.split(/\/|\./g), function (part) {
					// Dont include empty strings in toId functions
					if (part) {
						return part;
					}
				})
				.join('_');
		},

		hookup: function (fragment, parentNode) {
			var hookupEls = [],
				id,
				func;

			// Get all `childNodes`.
			can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function (node) {
				if (node.nodeType === 1) {
					hookupEls.push(node);
					hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
				}
			});

			// Filter by `data-view-id` attribute.
			can.each(hookupEls, function (el) {
				if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
					func(el, parentNode, id);
					delete $view.hookups[id];
					el.removeAttribute('data-view-id');
				}
			});

			return fragment;
		},

		/**
		 * @function can.view.ejs ejs
		 * @parent can.view.static
		 *
		 * @signature `can.view.ejs( [id,] template )`
		 *
		 * Register an EJS template string and create a renderer function.
		 *
		 *     var renderer = can.view.ejs("<h1><%= message %></h1>");
		 *     renderer({message: "Hello"}) //-> docFrag[ <h1>Hello</h1> ]
		 *
		 * @param {String} [id] An optional ID to register the template.
		 *
		 *     can.view.ejs("greet","<h1><%= message %></h1>");
		 *     can.view("greet",{message: "Hello"}) //-> docFrag[<h1>Hello</h1>]
		 *
		 * @param {String} template An EJS template in string form.
		 * @return {can.view.renderer} A renderer function that takes data and helpers.
		 *
		 *
		 * @body
		 * `can.view.ejs([id,] template)` registers an EJS template string
		 * for a given id programatically. The following
		 * registers `myViewEJS` and renders it into a documentFragment.
		 *
		 *      can.view.ejs('myViewEJS', '<h2><%= message %></h2>');
		 *
		 *      var frag = can.view('myViewEJS', {
		 *          message : 'Hello there!'
		 *      });
		 *
		 *      frag // -> <h2>Hello there!</h2>
		 *
		 * To convert the template into a render function, just pass
		 * the template. Call the render function with the data
		 * you want to pass to the template and it returns the
		 * documentFragment.
		 *
		 *      var renderer = can.view.ejs('<div><%= message %></div>');
		 *      renderer({
		 *          message : 'EJS'
		 *      }); // -> <div>EJS</div>
		 */
		// auj
		/**
		 * @function can.view.mustache mustache
		 * @parent can.view.static
		 *
		 * @signature `can.view.mustache( [id,] template )`
		 *
		 * Register a Mustache template string and create a renderer function.
		 *
		 *     var renderer = can.view.mustache("<h1>{{message}}</h1>");
		 *     renderer({message: "Hello"}) //-> docFrag[ <h1>Hello</h1> ]
		 *
		 * @param {String} [id] An optional ID for the template.
		 *
		 *     can.view.ejs("greet","<h1>{{message}}</h1>");
		 *     can.view("greet",{message: "Hello"}) //-> docFrag[<h1>Hello</h1>]
		 *
		 * @param {String} template A Mustache template in string form.
		 *
		 * @return {can.view.renderer} A renderer function that takes data and helpers.
		 *
		 * @body
		 *
		 * `can.view.mustache([id,] template)` registers an Mustache template string
		 * for a given id programatically. The following
		 * registers `myStache` and renders it into a documentFragment.
		 *
		 *      can.viewmustache('myStache', '<h2>{{message}}</h2>');
		 *
		 *      var frag = can.view('myStache', {
		 *          message : 'Hello there!'
		 *      });
		 *
		 *      frag // -> <h2>Hello there!</h2>
		 *
		 * To convert the template into a render function, just pass
		 * the template. Call the render function with the data
		 * you want to pass to the template and it returns the
		 * documentFragment.
		 *
		 *      var renderer = can.view.mustache('<div>{{message}}</div>');
		 *      renderer({
		 *          message : 'Mustache'
		 *      }); // -> <div>Mustache</div>
		 */
		// heir
		/**
		 * @property hookups
		 * @hide
		 * A list of pending 'hookups'
		 */
		hookups: {},

		/**
		 * @description Create a hookup to insert into templates.
		 * @function can.view.hook hook
		 * @parent can.view.static
		 * @signature `can.view.hook(callback)`
		 * @param {Function} callback A callback function to be called with the element.
		 *
		 * @body
		 * Registers a hookup function that can be called back after the html is
		 * put on the page.  Typically this is handled by the template engine.  Currently
		 * only EJS supports this functionality.
		 *
		 *     var id = can.view.hook(function(el){
		 *            //do something with el
		 *         }),
		 *         html = "<div data-view-id='"+id+"'>"
		 *     $('.foo').html(html);
		 */
		hook: function (cb) {
			$view.hookups[++hookupId] = cb;
			return ' data-view-id=\'' + hookupId + '\'';
		},

		/**
		 * @hide
		 * @property {Object} can.view.cached view
		 * @parent can.view
		 * Cached are put in this object
		 */
		cached: {},

		cachedRenderers: {},

		/**
		 * @property {Boolean} can.view.cache cache
		 * @parent can.view.static
		 * By default, views are cached on the client.  If you'd like the
		 * the views to reload from the server, you can set the `cache` attribute to `false`.
		 *
		 *	//- Forces loads from server
		 *	can.view.cache = false;
		 *
		 */
		cache: true,

		/**
		 * @function can.view.register register
		 * @parent can.view.static
		 * @description Register a templating language.
		 * @signature `can.view.register(info)`
		 * @param {{}} info Information about the templating language.
		 * @option {String} plugin The location of the templating language's plugin.
		 * @option {String} suffix Files with this suffix will use this templating language's plugin by default.
		 * @option {function} renderer A function that returns a function that, given data, will render the template with that data.
		 * The __renderer__ function receives the id of the template and the text of the template.
		 * @option {function} script A function that returns the string form of the processed template.
		 *
		 * @body
		 * Registers a template engine to be used with
		 * view helpers and compression.
		 *
		 * ## Example
		 *
		 * @codestart
		 * can.View.register({
		 *	suffix : "tmpl",
		 *  plugin : "jquery/view/tmpl",
		 *	renderer: function( id, text ) {
		 *	return function(data){
		 *		return jQuery.render( text, data );
		 *		}
		 *	},
		 *	script: function( id, text ) {
		 *	var tmpl = can.tmpl(text).toString();
		 *	return "function(data){return ("+
		 *			tmpl+
		 *			").call(jQuery, jQuery, data); }";
		 *	}
		 * })
		 * @codeend
		 */
		register: function (info) {
			this.types['.' + info.suffix] = info;
		},

		types: {},

		/**
		 * @property {String} can.view.ext ext
		 * @parent can.view.static
		 * The default suffix to use if none is provided in the view's url.
		 * This is set to `.ejs` by default.
		 *
		 *	// Changes view ext to 'txt'
		 *	can.view.ext = 'txt';
		 *
		 */
		ext: ".ejs",

		/**
		 * Returns the text that
		 * @hide
		 * @param {Object} type
		 * @param {Object} id
		 * @param {Object} src
		 */
		registerScript: function () {},

		/**
		 * @hide
		 * Called by a production script to pre-load a renderer function
		 * into the view cache.
		 * @param {String} id
		 * @param {Function} renderer
		 */
		preload: function () {},

		/**
		 * @function can.view.render render
		 * @parent can.view.static
		 * @description Render a template.
		 * @signature `can.view.render(template[, callback])`
		 * @param {String|Object} view The path of the view template or a view object.
		 * @param {Function} [callback] A function executed after the template has been processed.
		 * @return {Function|can.Deferred} A renderer function to be called with data and helpers
		 * or a Deferred that resolves to a renderer function.
		 *
		 * @signature `can.view.render(template, data[, [helpers,] callback])`
		 * @param {String|Object} view The path of the view template or a view object.
		 * @param {Object} [data] The data to populate the template with.
		 * @param {Object.<String, function>} [helpers] Helper methods referenced in the template.
		 * @param {Function} [callback] A function executed after the template has been processed.
		 * @return {String|can.Deferred} The template with interpolated data in string form
		 * or a Deferred that resolves to the template with interpolated data.
		 *
		 * @body
		 * `can.view.render(view, [data], [helpers], callback)` returns the rendered markup produced by the corresponding template
		 * engine as String. If you pass a deferred object in as data, render returns
		 * a deferred resolving to the rendered markup.
		 *
		 * `can.view.render` is commonly used for sub-templates.
		 *
		 * ## Example
		 *
		 * _welcome.ejs_ looks like:
		 *
		 *     <h1>Hello <%= hello %></h1>
		 *
		 * Render it to a string like:
		 *
		 *     can.view.render("welcome.ejs",{hello: "world"})
		 *       //-> <h1>Hello world</h1>
		 *
		 * ## Use as a Subtemplate
		 *
		 * If you have a template like:
		 *
		 *     <ul>
		 *       <% list(items, function(item){ %>
		 *         <%== can.view.render("item.ejs",item) %>
		 *       <% }) %>
		 *     </ul>
		 *
		 * ## Using renderer functions
		 *
		 * If you only pass the view path, `can.view will return a renderer function that can be called with
		 * the data to render:
		 *
		 *     var renderer = can.view.render("welcome.ejs");
		 *     // Do some more things
		 *     renderer({hello: "world"}) // -> Document Fragment
		 *
		 */
		render: function (view, data, helpers, callback) {
			// If helpers is a `function`, it is actually a callback.
			if (isFunction(helpers)) {
				callback = helpers;
				helpers = undefined;
			}

			// See if we got passed any deferreds.
			var deferreds = getDeferreds(data);
			var reading, deferred, dataCopy, async, response;
			if (deferreds.length) {
				// Does data contain any deferreds?
				// The deferred that resolves into the rendered content...
				deferred = new can.Deferred();
				dataCopy = can.extend({}, data);

				// Add the view request to the list of deferreds.
				deferreds.push(get(view, true));
				// Wait for the view and all deferreds to finish...
				can.when.apply(can, deferreds)
					.then(function (resolved) {
						// Get all the resolved deferreds.
						var objs = makeArray(arguments),
							// Renderer is the last index of the data.
							renderer = objs.pop(),
							// The result of the template rendering with data.
							result;

						// Make data look like the resolved deferreds.
						if (can.isDeferred(data)) {
							dataCopy = usefulPart(resolved);
						} else {
							// Go through each prop in data again and
							// replace the defferreds with what they resolved to.
							for (var prop in data) {
								if (can.isDeferred(data[prop])) {
									dataCopy[prop] = usefulPart(objs.shift());
								}
							}
						}

						// Get the rendered result.
						result = renderer(dataCopy, helpers);

						// Resolve with the rendered view.
						deferred.resolve(result, dataCopy);

						// If there's a `callback`, call it back with the result.
						if (callback) {
							callback(result, dataCopy);
						}
					}, function () {
						deferred.reject.apply(deferred, arguments);
					});
				// Return the deferred...
				return deferred;
			} else {
				// get is called async but in 
				// ff will be async so we need to temporarily reset
				if (can.__reading) {
					reading = can.__reading;
					can.__reading = null;
				}

				// No deferreds! Render this bad boy.

				// If there's a `callback` function
				async = isFunction(callback);
				// Get the `view` type
				deferred = get(view, async);
				if (can.Map && reading) {
					can.__reading = reading;
				}

				// If we are `async`...
				if (async) {
					// Return the deferred
					response = deferred;
					// And fire callback with the rendered result.
					deferred.then(function (renderer) {
						callback(data ? renderer(data, helpers) : renderer);
					});
				} else {
					// if the deferred is resolved, call the cached renderer instead
					// this is because it's possible, with recursive deferreds to
					// need to render a view while its deferred is _resolving_.  A _resolving_ deferred
					// is a deferred that was just resolved and is calling back it's success callbacks.
					// If a new success handler is called while resoliving, it does not get fired by
					// jQuery's deferred system.  So instead of adding a new callback
					// we use the cached renderer.
					// We also add __view_id on the deferred so we can look up it's cached renderer.
					// In the future, we might simply store either a deferred or the cached result.
					if (deferred.state() === 'resolved' && deferred.__view_id) {
						var currentRenderer = $view.cachedRenderers[deferred.__view_id];
						return data ? currentRenderer(data, helpers) : currentRenderer;
					} else {
						// Otherwise, the deferred is complete, so
						// set response to the result of the rendering.
						deferred.then(function (renderer) {
							response = data ? renderer(data, helpers) : renderer;
						});
					}
				}

				return response;
			}
		},

		/**
		 * @hide
		 * Registers a view with `cached` object.  This is used
		 * internally by this class and Mustache to hookup views.
		 * @param  {String} id
		 * @param  {String} text
		 * @param  {String} type
		 * @param  {can.Deferred} def
		 */
		registerView: function (id, text, type, def) {
			// Get the renderer function.
			var func = (type || $view.types[$view.ext])
				.renderer(id, text);
			def = def || new can.Deferred();

			// Cache if we are caching.
			if ($view.cache) {
				$view.cached[id] = def;
				def.__view_id = id;
				$view.cachedRenderers[id] = func;
			}

			// Return the objects for the response's `dataTypes`
			// (in this case view).
			return def.resolve(func);
		}
	});

	// Makes sure there's a template, if not, have `steal` provide a warning.
	var checkText = function (text, url) {
		if (!text.length) {

		

			throw "can.view: No template or empty template:" + url;
		}
	},
		// `Returns a `view` renderer deferred.  
		// `url` - The url to the template.  
		// `async` - If the ajax request should be asynchronous.  
		// Returns a deferred.
		get = function (obj, async) {
			var url = typeof obj === 'string' ? obj : obj.url,
				suffix = obj.engine || url.match(/\.[\w\d]+$/),
				type,
				// If we are reading a script element for the content of the template,
				// `el` will be set to that script element.
				el,
				// A unique identifier for the view (used for caching).
				// This is typically derived from the element id or
				// the url for the template.
				id;

			//If the url has a #, we assume we want to use an inline template
			//from a script element and not current page's HTML
			if (url.match(/^#/)) {
				url = url.substr(1);
			}
			// If we have an inline template, derive the suffix from the `text/???` part.
			// This only supports `<script>` tags.
			if (el = document.getElementById(url)) {
				suffix = '.' + el.type.match(/\/(x\-)?(.+)/)[2];
			}

			// If there is no suffix, add one.
			if (!suffix && !$view.cached[url]) {
				url += suffix = $view.ext;
			}

			if (can.isArray(suffix)) {
				suffix = suffix[0];
			}

			// Convert to a unique and valid id.
			id = $view.toId(url);

			// If an absolute path, use `steal`/`require` to get it.
			// You should only be using `//` if you are using an AMD loader like `steal` or `require` (not almond).
			if (url.match(/^\/\//)) {
				url = url.substr(2);
				url = !window.steal ?
					url :
					steal.config()
					.root.mapJoin("" + steal.id(url));
			}

			// Localize for `require` (not almond)
			if (window.require) {
				if (require.toUrl) {
					url = require.toUrl(url);
				}
			}

			// Set the template engine type.
			type = $view.types[suffix];

			// If it is cached, 
			if ($view.cached[id]) {
				// Return the cached deferred renderer.
				return $view.cached[id];

				// Otherwise if we are getting this from a `<script>` element.
			} else if (el) {
				// Resolve immediately with the element's `innerHTML`.
				return $view.registerView(id, el.innerHTML, type);
			} else {
				// Make an ajax request for text.
				var d = new can.Deferred();
				can.ajax({
					async: async,
					url: url,
					dataType: 'text',
					error: function (jqXHR) {
						checkText('', url);
						d.reject(jqXHR);
					},
					success: function (text) {
						// Make sure we got some text back.
						checkText(text, url);
						$view.registerView(id, text, type, d);
					}
				});
				return d;
			}
		},
		// Gets an `array` of deferreds from an `object`.
		// This only goes one level deep.
		getDeferreds = function (data) {
			var deferreds = [];

			// pull out deferreds
			if (can.isDeferred(data)) {
				return [data];
			} else {
				for (var prop in data) {
					if (can.isDeferred(data[prop])) {
						deferreds.push(data[prop]);
					}
				}
			}
			return deferreds;
		},
		// Gets the useful part of a resolved deferred.
		// This is for `model`s and `can.ajax` that resolve to an `array`.
		usefulPart = function (resolved) {
			return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved;
		};



	can.extend($view, {
		register: function (info) {
			this.types['.' + info.suffix] = info;

		

			$view[info.suffix] = function (id, text) {
				if (!text) {
					// Return a nameless renderer
					var renderer = function () {
						return $view.frag(renderer.render.apply(this, arguments));
					};
					renderer.render = function () {
						var renderer = info.renderer(null, id);
						return renderer.apply(renderer, arguments);
					};
					return renderer;
				}

				return $view.preload(id, info.renderer(id, text));
			};
		},
		registerScript: function (type, id, src) {
			return 'can.view.preload(\'' + id + '\',' + $view.types['.' + type].script(id, src) + ');';
		},
		preload: function (id, renderer) {
			var def = $view.cached[id] = new can.Deferred()
				.resolve(function (data, helpers) {
					return renderer.call(data, data, helpers);
				});

			function frag() {
				return $view.frag(renderer.apply(this, arguments));
			}
			// expose the renderer for mustache
			frag.render = renderer;

			// set cache references (otherwise preloaded recursive views won't recurse properly)
			def.__view_id = id;
			$view.cachedRenderers[id] = renderer;

			return frag;
		}

	});

	return can;
});