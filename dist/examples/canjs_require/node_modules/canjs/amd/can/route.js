/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/map", "can/list", "can/util/string/deparam"], function (can) {

	// ## route.js
	// `can.route`
	// _Helps manage browser history (and client state) by synchronizing the
	// `window.location.hash` with a `can.Map`._
	//
	// Helper methods used for matching routes.
	var
	// `RegExp` used to match route variables of the type ':name'.
	// Any word character or a period is matched.
	matcher = /\:([\w\.]+)/g,
		// Regular expression for identifying &amp;key=value lists.
		paramsMatcher = /^(?:&[^=]+=[^&]*)+/,
		// Converts a JS Object into a list of parameters that can be
		// inserted into an html element tag.
		makeProps = function (props) {
			var tags = [];
			can.each(props, function (val, name) {
				tags.push((name === 'className' ? 'class' : name) + '="' +
					(name === "href" ? val : can.esc(val)) + '"');
			});
			return tags.join(" ");
		},
		// Checks if a route matches the data provided. If any route variable
		// is not present in the data, the route does not match. If all route
		// variables are present in the data, the number of matches is returned
		// to allow discerning between general and more specific routes.
		matchesData = function (route, data) {
			var count = 0,
				i = 0,
				defaults = {};
			// look at default values, if they match ...
			for (var name in route.defaults) {
				if (route.defaults[name] === data[name]) {
					// mark as matched
					defaults[name] = 1;
					count++;
				}
			}
			for (; i < route.names.length; i++) {
				if (!data.hasOwnProperty(route.names[i])) {
					return -1;
				}
				if (!defaults[route.names[i]]) {
					count++;
				}

			}

			return count;
		},
		location = window.location,
		wrapQuote = function (str) {
			return (str + '')
				.replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
		},
		each = can.each,
		extend = can.extend,
		// Helper for convert any object (or value) to stringified object (or value)
		stringify = function (obj) {
			// Object is array, plain object, Map or List
			if (obj && typeof obj === "object") {
				// Get native object or array from Map or List
				if (obj instanceof can.Map) {
					obj = obj.attr();
					// Clone object to prevent change original values
				} else {
					obj = can.isFunction(obj.slice) ? obj.slice() : can.extend({}, obj);
				}
				// Convert each object property or array item into stringified new
				can.each(obj, function (val, prop) {
					obj[prop] = stringify(val);
				});
				// Object supports toString function
			} else if (obj !== undefined && obj !== null && can.isFunction(obj.toString)) {
				obj = obj.toString();
			}

			return obj;
		},
		removeBackslash = function (str) {
			return str.replace(/\\/g, "");
		},
		// A ~~throttled~~ debounced function called multiple times will only fire once the
		// timer runs down. Each call resets the timer.
		timer,
		// Intermediate storage for `can.route.data`.
		curParams,
		// The last hash caused by a data change
		lastHash,
		// Are data changes pending that haven't yet updated the hash
		changingData,
		// If the `can.route.data` changes, update the hash.
		// Using `.serialize()` retrieves the raw data contained in the `observable`.
		// This function is ~~throttled~~ debounced so it only updates once even if multiple values changed.
		// This might be able to use batchNum and avoid this.
		onRouteDataChange = function (ev, attr, how, newval) {
			// indicate that data is changing
			changingData = 1;
			clearTimeout(timer);
			timer = setTimeout(function () {
				// indicate that the hash is set to look like the data
				changingData = 0;
				var serialized = can.route.data.serialize(),
					path = can.route.param(serialized, true);
				can.route._call("setURL", path);

				lastHash = path;
			}, 10);
		};

	can.route = function (url, defaults) {
		// if route ends with a / and url starts with a /, remove the leading / of the url
		var root = can.route._call("root");

		if (root.lastIndexOf("/") === root.length - 1 &&
			url.indexOf("/") === 0) {
			url = url.substr(1);
		}

		defaults = defaults || {};
		// Extract the variable names and replace with `RegExp` that will match
		// an atual URL with values.
		var names = [],
			res,
			test = "",
			lastIndex = matcher.lastIndex = 0,
			next,
			querySeparator = can.route._call("querySeparator");

		// res will be something like [":foo","foo"]
		while (res = matcher.exec(url)) {
			names.push(res[1]);
			test += removeBackslash(url.substring(lastIndex, matcher.lastIndex - res[0].length));
			next = "\\" + (removeBackslash(url.substr(matcher.lastIndex, 1)) || querySeparator);
			// a name without a default value HAS to have a value
			// a name that has a default value can be empty
			// The `\\` is for string-escaping giving single `\` for `RegExp` escaping.
			test += "([^" + next + "]" + (defaults[res[1]] ? "*" : "+") + ")";
			lastIndex = matcher.lastIndex;
		}
		test += url.substr(lastIndex)
			.replace("\\", "");
		// Add route in a form that can be easily figured out.
		can.route.routes[url] = {
			// A regular expression that will match the route when variable values
			// are present; i.e. for `:page/:type` the `RegExp` is `/([\w\.]*)/([\w\.]*)/` which
			// will match for any value of `:page` and `:type` (word chars or period).
			test: new RegExp("^" + test + "($|" + wrapQuote(querySeparator) + ")"),
			// The original URL, same as the index for this entry in routes.
			route: url,
			// An `array` of all the variable names in this route.
			names: names,
			// Default values provided for the variables.
			defaults: defaults,
			// The number of parts in the URL separated by `/`.
			length: url.split('/')
				.length
		};
		return can.route;
	};

	/**
	 * @static
	 */
	extend(can.route, {

		/**
		 * @function can.route.param param
		 * @parent can.route.static
		 * @description Get a route path from given data.
		 * @signature `can.route.param( data )`
		 * @param {data} object The data to populate the route with.
		 * @return {String} The route, with the data populated in it.
		 *
		 * @body
		 * Parameterizes the raw JS object representation provided in data.
		 *
		 *     can.route.param( { type: "video", id: 5 } )
		 *          // -> "type=video&id=5"
		 *
		 * If a route matching the provided data is found, that URL is built
		 * from the data. Any remaining data is added at the end of the
		 * URL as &amp; separated key/value parameters.
		 *
		 *     can.route(":type/:id")
		 *
		 *     can.route.param( { type: "video", id: 5 } ) // -> "video/5"
		 *     can.route.param( { type: "video", id: 5, isNew: false } )
		 *          // -> "video/5&isNew=false"
		 */
		param: function (data, _setRoute) {
			// Check if the provided data keys match the names in any routes;
			// Get the one with the most matches.
			var route,
				// Need to have at least 1 match.
				matches = 0,
				matchCount,
				routeName = data.route,
				propCount = 0;

			delete data.route;

			each(data, function () {
				propCount++;
			});
			// Otherwise find route.
			each(can.route.routes, function (temp, name) {
				// best route is the first with all defaults matching

				matchCount = matchesData(temp, data);
				if (matchCount > matches) {
					route = temp;
					matches = matchCount;
				}
				if (matchCount >= propCount) {
					return false;
				}
			});
			// If we have a route name in our `can.route` data, and it's
			// just as good as what currently matches, use that
			if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
				route = can.route.routes[routeName];
			}
			// If this is match...
			if (route) {
				var cpy = extend({}, data),
					// Create the url by replacing the var names with the provided data.
					// If the default value is found an empty string is inserted.
					res = route.route.replace(matcher, function (whole, name) {
						delete cpy[name];
						return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
					})
						.replace("\\", ""),
					after;
				// Remove matching default values
				each(route.defaults, function (val, name) {
					if (cpy[name] === val) {
						delete cpy[name];
					}
				});

				// The remaining elements of data are added as
				// `&amp;` separated parameters to the url.
				after = can.param(cpy);
				// if we are paraming for setting the hash
				// we also want to make sure the route value is updated
				if (_setRoute) {
					can.route.attr('route', route.route);
				}
				return res + (after ? can.route._call("querySeparator") + after : "");
			}
			// If no route was found, there is no hash URL, only paramters.
			return can.isEmptyObject(data) ? "" : can.route._call("querySeparator") + can.param(data);
		},
		/**
		 * @function can.route.deparam deparam
		 * @parent can.route.static
		 * @description Extract data from a route path.
		 * @signature `can.route.deparam( url )`
		 * @param {String} url A route fragment to extract data from.
		 * @return {Object} An object containing the extracted data.
		 *
		 * @body
		 * Creates a data object based on the query string passed into it. This is
		 * useful to create an object based on the `location.hash`.
		 *
		 *     can.route.deparam("id=5&type=videos")
		 *          // -> { id: 5, type: "videos" }
		 *
		 *
		 * It's important to make sure the hash or exclamantion point is not passed
		 * to `can.route.deparam` otherwise it will be included in the first property's
		 * name.
		 *
		 *     can.route.attr("id", 5) // location.hash -> #!id=5
		 *     can.route.attr("type", "videos")
		 *          // location.hash -> #!id=5&type=videos
		 *     can.route.deparam(location.hash)
		 *          // -> { #!id: 5, type: "videos" }
		 *
		 * `can.route.deparam` will try and find a matching route and, if it does,
		 * will deconstruct the URL and parse our the key/value parameters into the data object.
		 *
		 *     can.route(":type/:id")
		 *
		 *     can.route.deparam("videos/5");
		 *          // -> { id: 5, route: ":type/:id", type: "videos" }
		 */
		deparam: function (url) {

			// remove the url
			var root = can.route._call("root");
			if (root.lastIndexOf("/") === root.length - 1 &&
				url.indexOf("/") === 0) {
				url = url.substr(1);
			}

			// See if the url matches any routes by testing it against the `route.test` `RegExp`.
			// By comparing the URL length the most specialized route that matches is used.
			var route = {
				length: -1
			},
				querySeparator = can.route._call("querySeparator"),
				paramsMatcher = can.route._call("paramsMatcher");

			each(can.route.routes, function (temp, name) {
				if (temp.test.test(url) && temp.length > route.length) {
					route = temp;
				}
			});
			// If a route was matched.
			if (route.length > -1) {

				var // Since `RegExp` backreferences are used in `route.test` (parens)
				// the parts will contain the full matched string and each variable (back-referenced) value.
				parts = url.match(route.test),
					// Start will contain the full matched string; parts contain the variable values.
					start = parts.shift(),
					// The remainder will be the `&amp;key=value` list at the end of the URL.
					remainder = url.substr(start.length - (parts[parts.length - 1] === querySeparator ? 1 : 0)),
					// If there is a remainder and it contains a `&amp;key=value` list deparam it.
					obj = (remainder && paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};

				// Add the default values for this route.
				obj = extend(true, {}, route.defaults, obj);
				// Overwrite each of the default values in `obj` with those in
				// parts if that part is not empty.
				each(parts, function (part, i) {
					if (part && part !== querySeparator) {
						obj[route.names[i]] = decodeURIComponent(part);
					}
				});
				obj.route = route.route;
				return obj;
			}
			// If no route was matched, it is parsed as a `&amp;key=value` list.
			if (url.charAt(0) !== querySeparator) {
				url = querySeparator + url;
			}
			return paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
		},
		/**
		 * @hide
		 * A can.Map that represents the state of the history.
		 */
		data: new can.Map({}),
		/**
		 * @property {Object} routes
		 * @hide
		 *
		 * A list of routes recognized by the router indixed by the url used to add it.
		 * Each route is an object with these members:
		 *
		 *  - test - A regular expression that will match the route when variable values
		 *    are present; i.e. for :page/:type the `RegExp` is /([\w\.]*)/([\w\.]*)/ which
		 *    will match for any value of :page and :type (word chars or period).
		 *
		 *  - route - The original URL, same as the index for this entry in routes.
		 *
		 *  - names - An array of all the variable names in this route
		 *
		 *  - defaults - Default values provided for the variables or an empty object.
		 *
		 *  - length - The number of parts in the URL separated by '/'.
		 */
		routes: {},
		/**
		 * @function can.route.ready ready
		 * @parent can.route.static
		 *
		 * Initialize can.route.
		 *
		 * @signature `can.route.ready()`
		 *
		 * Sets up the two-way binding between the hash and the can.route observable map and
		 * sets the can.route map to its initial values.
		 *
		 * @return {can.route} The `can.route` object.
		 *
		 * @body
		 *
		 * ## Use
		 *
		 * After setting all your routes, call can.route.ready().
		 *
		 *     can.route("overview/:dateStart-:dateEnd");
		 *     can.route(":type/:id")
		 *     can.route.ready()
		 */
		ready: function (val) {
			if (val !== true) {
				can.route._setup();
				can.route.setState();
			}
			return can.route;
		},
		/**
		 * @function can.route.url url
		 * @parent can.route.static
		 * @signature `can.route.url( data [, merge] )`
		 *
		 * Make a URL fragment that when set to window.location.hash will update can.route's properties
		 * to match those in `data`.
		 *
		 * @param {Object} data The data to populate the route with.
		 * @param {Boolean} [merge] Whether the given options should be merged into the current state of the route.
		 * @return {String} The route URL and query string.
		 *
		 * @body
		 * Similar to [can.route.link], but instead of creating an anchor tag, `can.route.url` creates
		 * only the URL based on the route options passed into it.
		 *
		 *     can.route.url( { type: "videos", id: 5 } )
		 *          // -> "#!type=videos&id=5"
		 *
		 * If a route matching the provided data is found the URL is built from the data. Any remaining
		 * data is added at the end of the URL as & separated key/value parameters.
		 *
		 *     can.route(":type/:id")
		 *
		 *     can.route.url( { type: "videos", id: 5 } ) // -> "#!videos/5"
		 *     can.route.url( { type: "video", id: 5, isNew: false } )
		 *          // -> "#!video/5&isNew=false"
		 */
		url: function (options, merge) {

			if (merge) {
				options = can.extend({}, can.route.deparam(can.route._call("matchingPartOfURL")), options);
			}
			return can.route._call("root") + can.route.param(options);
		},
		/**
		 * @function can.route.link link
		 * @parent can.route.static
		 * @signature `can.route.link( innerText, data, props [, merge] )`
		 *
		 * Make an anchor tag (`<A>`) that when clicked on will update can.route's properties
		 * to match those in `data`.
		 *
		 * @param {Object} innerText The text inside the link.
		 * @param {Object} data The data to populate the route with.
		 * @param {Object} props Properties for the anchor other than `href`.
		 * @param {Boolean} [merge] Whether the given options should be merged into the current state of the route.
		 * @return {String} A string with an anchor tag that points to the populated route.
		 *
		 * @body
		 * Creates and returns an anchor tag with an href of the route
		 * attributes passed into it, as well as any properies desired
		 * for the tag.
		 *
		 *     can.route.link( "My videos", { type: "videos" }, {}, false )
		 *          // -> <a href="#!type=videos">My videos</a>
		 *
		 * Other attributes besides href can be added to the anchor tag
		 * by passing in a data object with the attributes desired.
		 *
		 *     can.route.link( "My videos", { type: "videos" },
		 *       { className: "new" }, false )
		 *          // -> <a href="#!type=videos" class="new">My Videos</a>
		 *
		 * It is possible to utilize the current route options when making anchor
		 * tags in order to make your code more reusable. If merge is set to true,
		 * the route options passed into `can.route.link` will be passed into the
		 * current ones.
		 *
		 *     location.hash = "#!type=videos"
		 *     can.route.link( "The zoo", { id: 5 }, true )
		 *          // -> <a href="#!type=videos&id=5">The zoo</true>
		 *
		 *     location.hash = "#!type=pictures"
		 *     can.route.link( "The zoo", { id: 5 }, true )
		 *          // -> <a href="#!type=pictures&id=5">The zoo</true>
		 *
		 *
		 */
		link: function (name, options, props, merge) {
			return "<a " + makeProps(
				extend({
					href: can.route.url(options, merge)
				}, props)) + ">" + name + "</a>";
		},
		/**
		 * @function can.route.current current
		 * @parent can.route.static
		 * @signature `can.route.current( data )`
		 *
		 * Check if data represents the current route.
		 *
		 * @param {Object} data Data to check agains the current route.
		 * @return {Boolean} Whether the data matches the current URL.
		 *
		 * @body
		 * Checks the page's current URL to see if the route represents the options passed
		 * into the function.
		 *
		 * Returns true if the options respresent the current URL.
		 *
		 *     can.route.attr('id', 5) // location.hash -> "#!id=5"
		 *     can.route.current({ id: 5 }) // -> true
		 *     can.route.current({ id: 5, type: 'videos' }) // -> false
		 *
		 *     can.route.attr('type', 'videos')
		 *            // location.hash -> #!id=5&type=videos
		 *     can.route.current({ id: 5, type: 'videos' }) // -> true
		 */
		current: function (options) {
			return this._call("matchingPartOfURL") === can.route.param(options);
		},
		bindings: {
			hashchange: {
				paramsMatcher: paramsMatcher,
				querySeparator: "&",
				bind: function () {
					can.bind.call(window, 'hashchange', setState);
				},
				unbind: function () {
					can.unbind.call(window, 'hashchange', setState);
				},
				// Gets the part of the url we are determinging the route from.
				// For hashbased routing, it's everything after the #, for
				// pushState it's configurable
				matchingPartOfURL: function () {
					return location.href.split(/#!?/)[1] || "";
				},
				// gets called with the serialized can.route data after a route has changed
				// returns what the url has been updated to (for matching purposes)
				setURL: function (path) {
					location.hash = "#!" + path;
					return path;
				},
				root: "#!"
			}
		},
		defaultBinding: "hashchange",
		currentBinding: null,
		// ready calls setup
		// setup binds and listens to data changes
		// bind listens to whatever you should be listening to
		// data changes tries to set the path

		// we need to be able to
		// easily kick off calling setState
		// 	teardown whatever is there
		//  turn on a particular binding

		// called when the route is ready
		_setup: function () {
			if (!can.route.currentBinding) {
				can.route._call("bind");
				can.route.bind("change", onRouteDataChange);
				can.route.currentBinding = can.route.defaultBinding;
			}
		},
		_teardown: function () {
			if (can.route.currentBinding) {
				can.route._call("unbind");
				can.route.unbind("change", onRouteDataChange);
				can.route.currentBinding = null;
			}
			clearTimeout(timer);
			changingData = 0;
		},
		// a helper to get stuff from the current or default bindings
		_call: function () {
			var args = can.makeArray(arguments),
				prop = args.shift(),
				binding = can.route.bindings[can.route.currentBinding || can.route.defaultBinding],
				method = binding[prop];
			if (method.apply) {
				return method.apply(binding, args);
			} else {
				return method;
			}
		}
	});

	// The functions in the following list applied to `can.route` (e.g. `can.route.attr('...')`) will
	// instead act on the `can.route.data` observe.
	each(['bind', 'unbind', 'on', 'off', 'delegate', 'undelegate', 'removeAttr', 'compute', '_get', '__get'], function (name) {
		can.route[name] = function () {
			// `delegate` and `undelegate` require
			// the `can/map/delegate` plugin
			if (!can.route.data[name]) {
				return;
			}

			return can.route.data[name].apply(can.route.data, arguments);
		};
	});

	// Because everything in hashbang is in fact a string this will automaticaly convert new values to string. Works with single value, or deep hashes.
	// Main motivation for this is to prevent double route event call for same value.
	// Example (the problem):
	// When you load page with hashbang like #!&some_number=2 and bind 'some_number' on routes.
	// It will fire event with adding of "2" (string) to 'some_number' property
	// But when you after this set can.route.attr({some_number: 2}) or can.route.attr('some_number', 2). it fires another event with change of 'some_number' from "2" (string) to 2 (integer)
	// This wont happen again with this normalization
	can.route.attr = function (attr, val) {
		var type = typeof attr,
			newArguments;

		// Reading
		if (val === undefined) {
			newArguments = arguments;
			// Sets object
		} else if (type !== "string" && type !== "number") {
			newArguments = [stringify(attr), val];
			// Sets key - value
		} else {
			newArguments = [attr, stringify(val)];
		}

		return can.route.data.attr.apply(can.route.data, newArguments);
	};

	var // Deparameterizes the portion of the hash of interest and assign the
	// values to the `can.route.data` removing existing values no longer in the hash.
	// setState is called typically by hashchange which fires asynchronously
	// So it's possible that someone started changing the data before the
	// hashchange event fired.  For this reason, it will not set the route data
	// if the data is changing or the hash already matches the hash that was set.
	setState = can.route.setState = function () {
		var hash = can.route._call("matchingPartOfURL");
		curParams = can.route.deparam(hash);

		// if the hash data is currently changing, or
		// the hash is what we set it to anyway, do NOT change the hash
		if (!changingData || hash !== lastHash) {
			can.route.attr(curParams, true);
		}
	};

	return can.route;
});