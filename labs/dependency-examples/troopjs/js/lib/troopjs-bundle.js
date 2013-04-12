/*!
* TroopJS Bundle - 1.0.7-0-gf886cba
* http://troopjs.com/
* Copyright (c) 2012 Mikael Karon <mikael@karon.se>
* Licensed MIT
*/


/*!
 * TroopJS RequireJS template plug-in
 *
 * parts of code from require-cs 0.4.0+ Copyright (c) 2010-2011, The Dojo Foundation
 *
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true, newcap:false, loopfunc:true */
/*global define:true */
define('troopjs-requirejs/template',[],function TemplateModule() {
	var FACTORIES = {
		"node" : function () {
			// Using special require.nodeRequire, something added by r.js.
			var fs = require.nodeRequire("fs");

			return function fetchText(path, callback) {
				callback(fs.readFileSync(path, 'utf8'));
			};
		},

		"browser" : function () {
			// Would love to dump the ActiveX crap in here. Need IE 6 to die first.
			var progIds = [ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"];
			var progId;
			var XHR;
			var i;

			if (typeof XMLHttpRequest !== "undefined") {
				XHR = XMLHttpRequest;
			}
			else {
				for (i = 0; i < 3; i++) {
					progId = progIds[i];

					try {
						new ActiveXObject(progId);
						XHR = function(){
							return new ActiveXObject(progId);
						};
						break;
					}
					catch (e) {
					}
				}

				if (!XHR){
					throw new Error("XHR: XMLHttpRequest not available");
				}
			}

			return function fetchText(url, callback) {
				var xhr = new XHR();
				xhr.open('GET', url, true);
				xhr.onreadystatechange = function (evt) {
					// Do not explicitly handle errors, those should be
					// visible via console output in the browser.
					if (xhr.readyState === 4) {
						callback(xhr.responseText);
					}
				};
				xhr.send(null);
			};
		},

		"rhino" : function () {
			var encoding = "utf-8";
			var lineSeparator = java.lang.System.getProperty("line.separator");

			// Why Java, why is this so awkward?
			return function fetchText(path, callback) {
				var file = new java.io.File(path);
				var input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding));
				var stringBuffer = new java.lang.StringBuffer();
				var line;
				var content = "";

				try {
					line = input.readLine();

					// Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
					// http://www.unicode.org/faq/utf_bom.html

					// Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
					// http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
					if (line && line.length() && line.charAt(0) === 0xfeff) {
						// Eat the BOM, since we've already found the encoding on this file,
						// and we plan to concatenating this buffer with others; the BOM should
						// only appear at the top of a file.
						line = line.substring(1);
					}

					stringBuffer.append(line);

					while ((line = input.readLine()) !== null) {
						stringBuffer.append(lineSeparator);
						stringBuffer.append(line);
					}
					// Make sure we return a JavaScript string and not a Java string.
					content = String(stringBuffer.toString()); // String
				} finally {
					input.close();
				}

				callback(content);
			};
		},

		"borked" : function () {
			return function fetchText() {
				throw new Error("Environment unsupported.");
			};
		}
	};

	var RE_SANITIZE = /^[\n\t\r]+|[\n\t\r]+$/g;
	var RE_BLOCK = /<%(=)?([\S\s]*?)%>/g;
	var RE_TOKENS = /<%(\d+)%>/gm;
	var RE_REPLACE = /(["\n\t\r])/gm;
	var RE_CLEAN = /o \+= "";| \+ ""/gm;
	var EMPTY = "";
	var REPLACE = {
		"\"" : "\\\"",
		"\n" : "\\n",
		"\t" : "\\t",
		"\r" : "\\r"
	};

	/**
	 * Compiles template
	 *
	 * @param body Template body
	 * @returns {Function}
	 */
	function compile(body) {
		var blocks = [];
		var length = 0;

		function blocksTokens(original, prefix, block) {
			blocks[length] = prefix
				? "\" +" + block + "+ \""
				: "\";" + block + "o += \"";
			return "<%" + String(length++) + "%>";
		}

		function tokensBlocks(original, token) {
			return blocks[token];
		}

		function replace(original, token) {
			return REPLACE[token] || token;
		}

		return ("function template(data) { var o = \""
		// Sanitize body before we start templating
		+ body.replace(RE_SANITIZE, "")

		// Replace script blocks with tokens
		.replace(RE_BLOCK, blocksTokens)

		// Replace unwanted tokens
		.replace(RE_REPLACE, replace)

		// Replace tokens with script blocks
		.replace(RE_TOKENS, tokensBlocks)

		+ "\"; return o; }")

		// Clean
		.replace(RE_CLEAN, EMPTY);
	}

	var buildMap = {};
	var fetchText = FACTORIES[ typeof process !== "undefined" && process.versions && !!process.versions.node
		? "node"
		: (typeof window !== "undefined" && window.navigator && window.document) || typeof importScripts !== "undefined"
			? "browser"
			: typeof Packages !== "undefined"
				? "rhino"
				: "borked" ]();

	return {
		load: function (name, parentRequire, load, config) {
			var path = parentRequire.toUrl(name);

			fetchText(path, function (text) {
				try {
					text = "define(function() { return " + compile(text, name, path, config.template) + "; })";
				}
				catch (err) {
					err.message = "In " + path + ", " + err.message;
					throw(err);
				}

				if (config.isBuild) {
					buildMap[name] = text;
				}

				// IE with conditional comments on cannot handle the
				// sourceURL trick, so skip it if enabled
				/*@if (@_jscript) @else @*/
				else {
					text += "\n//@ sourceURL='" + path +"'";
				}
				/*@end@*/

				load.fromText(name, text);

				// Give result to load. Need to wait until the module
				// is fully parse, which will happen after this
				// execution.
				parentRequire([name], function (value) {
					load(value);
				});
			});
		},

		write: function (pluginName, name, write) {
			if (buildMap.hasOwnProperty(name)) {
				write.asModule(pluginName + "!" + name, buildMap[name]);
			}
		}
	};
});

/*!
 * TroopJS jQuery hashchange plug-in
 *
 * Normalized hashchange event, ripped a _lot_ of code from
 * https://github.com/millermedeiros/Hasher
 *
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true, evil:true */
/*global define:true */
define('troopjs-jquery/hashchange',[ "jquery" ], function HashchangeModule($) {
	var INTERVAL = "interval";
	var HASHCHANGE = "hashchange";
	var ONHASHCHANGE = "on" + HASHCHANGE;
	var RE_HASH = /#(.*)$/;
	var RE_LOCAL = /\?/;

	// hack based on this: http://code.google.com/p/closure-compiler/issues/detail?id=47#c13
	var _isIE = /**@preserve@cc_on !@*/0;

	function getHash(window) {
		// parsed full URL instead of getting location.hash because Firefox
		// decode hash value (and all the other browsers don't)
		// also because of IE8 bug with hash query in local file
		var result = RE_HASH.exec(window.location.href);

		return result && result[1]
			? decodeURIComponent(result[1])
			: "";
	}

	function Frame(document) {
		var self = this;
		var element;

		self.element = element = document.createElement("iframe");
		element.src = "about:blank";
		element.style.display = "none";
	}

	Frame.prototype = {
		getElement : function () {
			return this.element;
		},

		getHash : function () {
			return this.element.contentWindow.frameHash;
		},

		update : function (hash) {
			var self = this;
			var document = self.element.contentWindow.document;

			// Quick return if hash has not changed
			if (self.getHash() === hash) {
				return;
			}

			// update iframe content to force new history record.
			// based on Really Simple History, SWFAddress and YUI.history.
			document.open();
			document.write("<html><head><title>' + document.title + '</title><script type='text/javascript'>var frameHash='" + hash + "';</script></head><body>&nbsp;</body></html>");
			document.close();
		}
	};

	$.event.special[HASHCHANGE] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browserâ€™s native event (this is used internally for the
		 *        beforeunload event, youâ€™ll never use it).
		 */
		setup : function hashChangeSetup(data, namespaces, eventHandle) {
			var window = this;

			// Quick return if we support onHashChange natively
			// FF3.6+, IE8+, Chrome 5+, Safari 5+
			if (ONHASHCHANGE in window) {
				return false;
			}

			// Make sure we're always a window
			if (!$.isWindow(window)) {
				throw new Error("Unable to bind 'hashchange' to a non-window object");
			}

			var $window = $(window);
			var hash = getHash(window);
			var location = window.location;

			$window.data(INTERVAL, window.setInterval(_isIE
				? (function hashChangeIntervalWrapper() {
					var document = window.document;
					var _isLocal = location.protocol === "file:";

					var frame = new Frame(document);
					document.body.appendChild(frame.getElement());
					frame.update(hash);

					return function hashChangeInterval() {
						var oldHash = hash;
						var newHash;
						var windowHash = getHash(window);
						var frameHash = frame.getHash();

						// Detect changes made pressing browser history buttons.
						// Workaround since history.back() and history.forward() doesn't
						// update hash value on IE6/7 but updates content of the iframe.
						if (frameHash !== hash && frameHash !== windowHash) {
							// Fix IE8 while offline
							newHash = decodeURIComponent(frameHash);

							if (hash !== newHash) {
								hash = newHash;
								frame.update(hash);
								$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
							}

							// Sync location.hash with frameHash
							location.hash = "#" + encodeURI(_isLocal
								? frameHash.replace(RE_LOCAL, "%3F")
								: frameHash);
						}
						// detect if hash changed (manually or using setHash)
						else if (windowHash !== hash) {
							// Fix IE8 while offline
							newHash = decodeURIComponent(windowHash);

							if (hash !== newHash) {
								hash = newHash;
								$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
							}
						}
					};
				})()
				: function hashChangeInterval() {
					var oldHash = hash;
					var newHash;
					var windowHash = getHash(window);

					if (windowHash !== hash) {
						// Fix IE8 while offline
						newHash = decodeURIComponent(windowHash);

						if (hash !== newHash) {
							hash = newHash;
							$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
						}
					}
				}, 25));
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function hashChangeTeardown(namespaces) {
			var window = this;

			// Quick return if we support onHashChange natively
			if (ONHASHCHANGE in window) {
				return false;
			}

			window.clearInterval($.data(window, INTERVAL));
		}
	};
});

/*!
 * TroopJS Utils getargs module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/getargs',[],function GetArgsModule() {
	var PUSH = Array.prototype.push;
	var SUBSTRING = String.prototype.substring;
	var RE_BOOLEAN = /^(?:false|true)$/i;
	var RE_BOOLEAN_TRUE = /^true$/i;
	var RE_DIGIT = /^\d+$/;

	return function getargs() {
		var self = this;
		var result = [];
		var length;
		var from;
		var to;
		var i;
		var c;
		var a;
		var q = false;

		// Iterate over string
		for (from = to = i = 0, length = self.length; i < length; i++) {
			// Get char
			c = self.charAt(i);

			switch(c) {
				case "\"" :
				case "'" :
					// If we are currently quoted...
					if (q === c) {
						// Stop quote
						q = false;

						// Store result (no need to convert, we know this is a string)
						PUSH.call(result, SUBSTRING.call(self, from, to));
					}
					// Otherwise
					else {
						// Start quote
						q = c;
					}

					// Update from/to
					from = to = i + 1;
					break;

				case "," :
					// Continue if we're quoted
					if (q) {
						to = i + 1;
						break;
					}

					// If we captured something...
					if (from !== to) {
						a = SUBSTRING.call(self, from, to);

						if (RE_BOOLEAN.test(a)) {
							a = RE_BOOLEAN_TRUE.test(a);
						}
						else if (RE_DIGIT.test(a)) {
							a = +a;
						}

						// Store result
						PUSH.call(result, a);
					}

					// Update from/to
					from = to = i + 1;
					break;

				case " " :
				case "\t" :
					// Continue if we're quoted
					if (q) {
						to = i + 1;
						break;
					}

					// Update from/to
					if (from === to) {
						from = to = i + 1;
					}
					break;

				default :
					// Update to
					to = i + 1;
			}
		}

		// If we captured something...
		if (from !== to) {
			a = SUBSTRING.call(self, from, to);

			if (RE_BOOLEAN.test(a)) {
				a = RE_BOOLEAN_TRUE.test(a);
			}
			else if (RE_DIGIT.test(a)) {
				a = +a;
			}

			// Store result
			PUSH.call(result, a);
		}

		return result;
	};
});
/*!
 * TroopJS jQuery action plug-in
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true */
/*global define:true */
define('troopjs-jquery/action',[ "jquery", "troopjs-utils/getargs" ], function ActionModule($, getargs) {
	var UNDEFINED;
	var FALSE = false;
	var NULL = null;
	var SLICE = Array.prototype.slice;
	var ACTION = "action";
	var ORIGINALEVENT = "originalEvent";
	var RE_ACTION = /^([\w\d\s_\-\/]+)(?:\.([\w\.]+))?(?:\((.*)\))?$/;
	var RE_DOT = /\.+/;

	/**
	 * Namespace iterator
	 * @param namespace (string) namespace
	 * @param index (number) index
	 */
	function namespaceIterator(namespace, index) {
		return namespace ? namespace + "." + ACTION : NULL;
	}

	/**
	 * Action handler
	 * @param $event (jQuery.Event) event
	 */
	function onAction($event) {
		// Set $target
		var $target = $(this);
		// Get argv
		var argv = SLICE.call(arguments, 1);
		// Extract type
		var type = ORIGINALEVENT in $event
			? $event[ORIGINALEVENT].type
			: ACTION;
		// Extract name
		var name = $event[ACTION];

		// Reset $event.type
		$event.type = ACTION + "/" + name + "." + type;

		// Trigger 'ACTION/{name}.{type}'
		$target.trigger($event, argv);

		// No handler, try without namespace, but exclusive
		if ($event.result !== FALSE) {
			// Reset $event.type
			$event.type = ACTION + "/" + name + "!";

			// Trigger 'ACTION/{name}'
			$target.trigger($event, argv);

			// Still no handler, try generic action with namespace
			if ($event.result !== FALSE) {
				// Reset $event.type
				$event.type = ACTION + "." + type;

				// Trigger 'ACTION.{type}'
				$target.trigger($event, argv);
			}
		}
	}

	/**
	 * Internal handler
	 *
	 * @param $event jQuery event
	 */
	function handler($event) {
		// Get closest element that has an action defined
		var $target = $($event.target).closest("[data-action]");

		// Fail fast if there is no action available
		if ($target.length === 0) {
			return;
		}

		// Extract all data in one go
		var $data = $target.data();
		// Extract matches from 'data-action'
		var matches = RE_ACTION.exec($data[ACTION]);

		// Return fast if action parameter was f*cked (no matches)
		if (matches === NULL) {
			return;
		}

		// Extract action name
		var name = matches[1];
		// Extract action namespaces
		var namespaces = matches[2];
		// Extract action args
		var args = matches[3];

		// If there are action namespaces, make sure we're only triggering action on applicable types
		if (namespaces !== UNDEFINED && !RegExp(namespaces.split(RE_DOT).join("|")).test($event.type)) {
			return;
		}

		// Split args by separator (if there were args)
		var argv = args !== UNDEFINED
			? getargs.call(args)
			: [];

		// Iterate argv to determine arg type
		$.each(argv, function argsIterator(i, value) {
			if (value in $data) {
				argv[i] = $data[value];
			}
		});

		$target
			// Trigger exclusive ACTION event
			.trigger($.Event($event, {
				type: ACTION + "!",
				action: name
			}), argv);

		// Since we've translated the event, stop propagation
		$event.stopPropagation();
	}

	$.event.special[ACTION] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browserâ€™s native event (this is used internally for the
		 *        beforeunload event, youâ€™ll never use it).
		 */
		setup : function onActionSetup(data, namespaces, eventHandle) {
			$(this).bind(ACTION, data, onAction);
		},

		/**
		 * Do something each time an event handler is bound to a particular element
		 * @param handleObj (Object)
		 */
		add : function onActionAdd(handleObj) {
			var events = $.map(handleObj.namespace.split(RE_DOT), namespaceIterator);

			if (events.length !== 0) {
				$(this).bind(events.join(" "), handler);
			}
		},

		/**
		 * Do something each time an event handler is unbound from a particular element
		 * @param handleObj (Object)
		 */
		remove : function onActionRemove(handleObj) {
			var events = $.map(handleObj.namespace.split(RE_DOT), namespaceIterator);

			if (events.length !== 0) {
				$(this).unbind(events.join(" "), handler);
			}
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function onActionTeardown(namespaces) {
			$(this).unbind(ACTION, onAction);
		}
	};

	$.fn[ACTION] = function action(name) {
		return $(this).trigger({
			type: ACTION + "!",
			action: name
		}, SLICE.call(arguments, 1));
	};
});

/*!
 * TroopJS jQuery weave plug-in
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true, loopfunc:true */
/*global define:true */
define('troopjs-jquery/weave',[ "jquery", "troopjs-utils/getargs", "require" ], function WeaveModule($, getargs, parentRequire) {
    var UNDEFINED;
	var NULL = null;
	var ARRAY = Array;
	var FUNCTION = Function;
	var ARRAY_PROTO = ARRAY.prototype;
	var JOIN = ARRAY_PROTO.join;
	var PUSH = ARRAY_PROTO.push;
	var POP = ARRAY_PROTO.pop;
	var $WHEN = $.when;
	var THEN = "then";
	var WEAVE = "weave";
	var UNWEAVE = "unweave";
	var WOVEN = "woven";
	var WEAVING = "weaving";
	var PENDING = "pending";
	var DESTROY = "destroy";
	var DATA = "data-";
	var DATA_WEAVE = DATA + WEAVE;
	var DATA_WOVEN = DATA + WOVEN;
	var DATA_WEAVING = DATA + WEAVING;
	var SELECTOR_WEAVE = "[" + DATA_WEAVE + "]";
	var SELECTOR_UNWEAVE = "[" + DATA_WEAVING + "],[" + DATA_WOVEN + "]";

	/**
	 * Generic destroy handler.
	 * Simply makes sure that unweave has been called
	 */
	function onDestroy() {
		$(this).unweave();
	}

	$.expr[":"][WEAVE] = $.expr.createPseudo
		? $.expr.createPseudo(function (widgets) {
		if (widgets !== UNDEFINED) {
			widgets = RegExp($.map(getargs.call(widgets), function (widget) {
				return "^" + widget + "$";
			}).join("|"), "m");
		}

		return function (element, context, isXml) {
			var weave = $(element).attr(DATA_WEAVE);

			return weave === UNDEFINED
				? false
				: widgets === UNDEFINED
					? true
					: widgets.test(weave.split(/[\s,]+/).join("\n"));
		};
	})
		: function (element, index, match) {
		var weave = $(element).attr(DATA_WEAVE);

		return weave === UNDEFINED
			? false
			: match === UNDEFINED
				? true
				: RegExp($.map(getargs.call(match[3]), function (widget) {
			return "^" + widget + "$";
		}).join("|"), "m").test(weave.split(/[\s,]+/).join("\n"));
	};

	$.expr[":"][WOVEN] = $.expr.createPseudo
		? $.expr.createPseudo(function (widgets) {
		if (widgets !== UNDEFINED) {
			widgets = RegExp($.map(getargs.call(widgets), function (widget) {
				return "^" + widget + "@\\d+";
			}).join("|"), "m");
		}

		return function (element, context, isXml) {
			var woven = $(element).attr(DATA_WOVEN);

			return woven === UNDEFINED
				? false
				: widgets === UNDEFINED
					? true
					: widgets.test(woven.split(/[\s,]+/).join("\n"));
		};
	})
		: function (element, index, match) {
		var woven = $(element).attr(DATA_WOVEN);

		return woven === UNDEFINED
			? false
			: match === UNDEFINED
				? true
				: RegExp($.map(getargs.call(match[3]), function (widget) {
			return "^" + widget + "@\\d+";
		}).join("|"), "m").test(woven.split(/[\s,]+/).join("\n"));
	};

	$.fn[WEAVE] = function weave(/* arg, arg, arg, deferred*/) {
		var widgets = [];
		var i = 0;
		var $elements = $(this);
		var arg = arguments;
		var argc = arg.length;

		// If deferred not a true Deferred, make it so
		var deferred = argc > 0 && arg[argc - 1][THEN] instanceof FUNCTION
			? POP.call(arg)
			: $.Deferred();

		$elements
			// Reduce to only elements that can be woven
			.filter(SELECTOR_WEAVE)
			// Iterate
			.each(function elementIterator(index, element) {
				// Defer weave
				$.Deferred(function deferredWeave(dfdWeave) {
					var $element = $(element);
					var $data = $element.data();
					var weave = $data[WEAVE] = $element.attr(DATA_WEAVE) || "";
					var woven = $data[WOVEN] || ($data[WOVEN] = []);
					var pending = $data[PENDING] || ($data[PENDING] = []);

					// Link deferred
					dfdWeave.done(function doneWeave() {
						$element
							// Remove DATA_WEAVING
							.removeAttr(DATA_WEAVING)
							// Set DATA_WOVEN with full names
							.attr(DATA_WOVEN, JOIN.call(arguments, " "));
					});

					// Wait for all pending deferred
					$WHEN.apply($, pending).then(function donePending() {
						var re = /[\s,]*([\w_\-\/\.]+)(?:\(([^\)]+)\))?/g;
						var mark = i;
						var j = 0;
						var matches;

						// Push dfdWeave on pending to signify we're starting a new task
						PUSH.call(pending, dfdWeave);

						$element
							// Make sure to remove DATA_WEAVE (so we don't try processing this again)
							.removeAttr(DATA_WEAVE)
							// Set DATA_WEAVING (so that unweave can pick this up)
							.attr(DATA_WEAVING, weave)
							// Bind destroy event
							.bind(DESTROY, onDestroy);

						// Iterate woven (while RE_WEAVE matches)
						while ((matches = re.exec(weave)) !== NULL) {
							// Defer widget
							$.Deferred(function deferredWidget(dfdWidget) {
								var _j = j++; // store _j before we increment
								var k;
								var l;
								var kMax;
								var value;

								// Add to widgets
								widgets[i++] = dfdWidget;

								// Link deferred
								dfdWidget.then(function doneWidget(widget) {
									woven[_j] = widget;
								}, dfdWeave.reject, dfdWeave.notify);

								// Get widget name
								var name = matches[1];

								// Set initial argv
								var argv = [ $element, name ];

								// Append values from arg to argv
								for (k = 0, kMax = arg.length, l = argv.length; k < kMax; k++, l++) {
									argv[l] = arg[k];
								}

								// Get widget args
								var args = matches[2];

								// Any widget arguments
								if (args !== UNDEFINED) {
									// Convert args using getargs
									args = getargs.call(args);

									// Append typed values from args to argv
									for (k = 0, kMax = args.length, l = argv.length; k < kMax; k++, l++) {
										// Get value
										value = args[k];

										// Get value from $data or fall back to pure value
										argv[l] = value in $data
											? $data[value]
											: value;
									}
								}

								// Require module
								parentRequire([ name ], function required(Widget) {
									// Defer start
									$.Deferred(function deferredStart(dfdStart) {
										// Constructed and initialized instance
										var widget = Widget.apply(Widget, argv);

										// Link deferred
										dfdStart.then(function doneStart() {
											dfdWidget.resolve(widget);
										}, dfdWidget.reject, dfdWidget.notify);

										// Start
										widget.start(dfdStart);
									});
								});
							});
						}

						// Slice out widgets woven for this element
						$WHEN.apply($, widgets.slice(mark, i)).then(dfdWeave.resolve, dfdWeave.reject, dfdWeave.notify);

					}, dfdWeave.reject, dfdWeave.notify);
				});
			});

		// When all widgets are resolved, resolve original deferred
		$WHEN.apply($, widgets).then(deferred.resolve, deferred.reject, deferred.notify);

		return $elements;
	};

	$.fn[UNWEAVE] = function unweave(deferred) {
		var widgets = [];
		var i = 0;
		var $elements = $(this);

		// Create default deferred if none was passed
		deferred = deferred || $.Deferred();

		$elements
			// Reduce to only elements that can be unwoven
			.filter(SELECTOR_UNWEAVE)
			// Iterate
			.each(function elementIterator(index, element) {
				// Defer unweave
				$.Deferred(function deferredUnweave(dfdUnweave) {
					var $element = $(element);
					var $data = $element.data();
					var pending = $data[PENDING] || ($data[PENDING] = []);
					var woven = $data[WOVEN] || [];

					// Link deferred
					dfdUnweave.done(function doneUnweave() {
						$element
							// Copy weave data to data-weave attribute
							.attr(DATA_WEAVE, $data[WEAVE])
							// Make sure to clean the destroy event handler
							.unbind(DESTROY, onDestroy);

						// Remove data fore WEAVE
						delete $data[WEAVE];
					});

					// Wait for all pending deferred
					$WHEN.apply($, pending).done(function donePending() {
						var mark = i;
						var widget;

						// Push dfdUnweave on pending to signify we're starting a new task
						PUSH.call(pending, dfdUnweave);

						// Remove WOVEN data
						delete $data[WOVEN];

						$element
							// Remove DATA_WOVEN attribute
							.removeAttr(DATA_WOVEN);

						// Somewhat safe(r) iterator over woven
						while ((widget = woven.shift()) !== UNDEFINED) {
							// Defer widget
							$.Deferred(function deferredWidget(dfdWidget) {
								// Add to unwoven and pending
								widgets[i++] = dfdWidget;

								// $.Deferred stop
								$.Deferred(function deferredStop(dfdStop) {
									// Link deferred
									dfdStop.then(function doneStop() {
										dfdWidget.resolve(widget);
									}, dfdWidget.reject, dfdWidget.notify);

									// Stop
									widget.stop(dfdStop);
								});
							});
						}

						// Slice out widgets unwoven for this element
						$WHEN.apply($, widgets.slice(mark, i)).then(dfdUnweave.resolve, dfdUnweave.reject, dfdUnweave.notify);
					});
				});
			});

		// When all deferred are resolved, resolve original deferred
		$WHEN.apply($, widgets).then(deferred.resolve, deferred.reject, deferred.notify);

		return $elements;
	};

	$.fn[WOVEN] = function woven(/* arg, arg */) {
		var result = [];
		var widgets = arguments.length > 0
			? RegExp($.map(arguments, function (widget) {
				return "^" + widget + "$";
			}).join("|"), "m")
			: UNDEFINED;

		$(this).each(function elementIterator(index, element) {
			if (!$.hasData(element)) {
				return;
			}

			PUSH.apply(result, widgets === UNDEFINED
				? $.data(element, WOVEN)
				: $.map($.data(element, WOVEN), function (woven) {
					return widgets.test(woven.displayName)
						? woven
						: UNDEFINED;
				}));
		});

		return result;
	};
});

/*!
 * TroopJS jQuery dimensions plug-in
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true */
/*global define:true */
define('troopjs-jquery/dimensions',[ "jquery" ], function DimensionsModule($) {
	var NULL = null;
	var DIMENSIONS = "dimensions";
	var RESIZE = "resize." + DIMENSIONS;
	var W = "w";
	var H = "h";
	var _W = "_" + W;
	var _H = "_" + H;

	/**
	 * Internal comparator used for reverse sorting arrays
	 */
	function reverse(a, b) {
		return b - a;
	}

	/**
	 * Internal onResize handler
	 * @param $event
	 */
	function onResize($event) {
		var $self = $(this);
		var width = $self.width();
		var height = $self.height();

		// Iterate all dimensions
		$.each($.data(self, DIMENSIONS), function dimensionIterator(namespace, dimension) {
			var w = dimension[W];
			var h = dimension[H];
			var _w;
			var _h;
			var i;

			i = w.length;
			_w = w[i - 1];
			while(w[--i] < width) {
				_w = w[i];
			}

			i = h.length;
			_h = h[i - 1];
			while(h[--i] < height) {
				_h = h[i];
			}

			// If _w or _h has changed, update and trigger
			if (_w !== dimension[_W] || _h !== dimension[_H]) {
				dimension[_W] = _w;
				dimension[_H] = _h;

				$self.trigger(DIMENSIONS + "." + namespace, [ _w, _h ]);
			}
		});
	}

	$.event.special[DIMENSIONS] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browserâ€™s native event (this is used internally for the
		 *        beforeunload event, youâ€™ll never use it).
		 */
		setup : function onDimensionsSetup(data, namespaces, eventHandle) {
			$(this)
				.bind(RESIZE, onResize)
				.data(DIMENSIONS, {});
		},

		/**
		 * Do something each time an event handler is bound to a particular element
		 * @param handleObj (Object)
		 */
		add : function onDimensionsAdd(handleObj) {
			var self = this;
			var namespace = handleObj.namespace;
			var dimension = {};
			var w = dimension[W] = [];
			var h = dimension[H] = [];
			var re = /(w|h)(\d+)/g;
			var matches;

			while ((matches = re.exec(namespace)) !== NULL) {
				dimension[matches[1]].push(parseInt(matches[2], 10));
			}

			w.sort(reverse);
			h.sort(reverse);

			$.data(self, DIMENSIONS)[namespace] = dimension;
		},

		/**
		 * Do something each time an event handler is unbound from a particular element
		 * @param handleObj (Object)
		 */
		remove : function onDimensionsRemove(handleObj) {
			delete $.data(this, DIMENSIONS)[handleObj.namespace];
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function onDimensionsTeardown(namespaces) {
			$(this)
				.removeData(DIMENSIONS)
				.unbind(RESIZE, onResize);
		}
	};
});
/*!
 * TroopJS jQuery destroy plug-in
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true */
/*global define:true */
define('troopjs-jquery/destroy',[ "jquery" ], function DestroyModule($) {
	$.event.special.destroy = {
		remove : function onDestroyRemove(handleObj) {
			var self = this;

			handleObj.handler.call(self, $.Event({
				"type" : handleObj.type,
				"data" : handleObj.data,
				"namespace" : handleObj.namespace,
				"target" : self
			}));
		}
	};
});

/*!
 * TroopJS jQuery resize plug-in
 *
 * Heavy inspiration from https://github.com/cowboy/jquery-resize.git
 *
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true */
/*global define:true */
define('troopjs-jquery/resize',[ "jquery" ], function ResizeModule($) {
	var NULL = null;
	var RESIZE = "resize";
	var W = "w";
	var H = "h";
	var $ELEMENTS = $([]);
	var INTERVAL = NULL;

	/**
	 * Iterator
	 * @param index
	 * @param self
	 */
	function iterator(index, self) {
		// Get data
		var $data = $.data(self);

		// Get reference to $self
		var $self = $(self);

		// Get previous width and height
		var w = $self.width();
		var h = $self.height();

		// Check if width or height has changed since last check
		if (w !== $data[W] || h !== $data[H]) {
			$self.trigger(RESIZE, [$data[W] = w, $data[H] = h]);
		}
	}

	/**
	 * Internal interval
	 */
	function interval() {
		$ELEMENTS.each(iterator);
	}

	$.event.special[RESIZE] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browserâ€™s native event (this is used internally for the
		 *        beforeunload event, youâ€™ll never use it).
		 */
		setup : function hashChangeSetup(data, namespaces, eventHandle) {
			var self = this;

			// window has a native resize event, exit fast
			if ($.isWindow(self)) {
				return false;
			}

			// Store data
			var $data = $.data(self, RESIZE, {});

			// Get reference to $self
			var $self = $(self);

			// Initialize data
			$data[W] = $self.width();
			$data[H] = $self.height();

			// Add to tracked collection
			$ELEMENTS = $ELEMENTS.add(self);

			// If this is the first element, start interval
			if($ELEMENTS.length === 1) {
				INTERVAL = setInterval(interval, 100);
			}
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function onDimensionsTeardown(namespaces) {
			var self = this;

			// window has a native resize event, exit fast
			if ($.isWindow(self)) {
				return false;
			}

			// Remove data
			$.removeData(self, RESIZE);

			// Remove from tracked collection
			$ELEMENTS = $ELEMENTS.not(self);

			// If this is the last element, stop interval
			if($ELEMENTS.length === 0 && INTERVAL !== NULL) {
				clearInterval(INTERVAL);
			}
		}
	};
});

/*!
 * TroopJS Utils merge module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/merge',[],function MergeModule() {
	var ARRAY = Array;
	var OBJECT = Object;

	return function merge(source) {
		var target = this;
		var key = null;
		var i;
		var iMax;
		var value;
		var constructor;

		for (i = 0, iMax = arguments.length; i < iMax; i++) {
			source = arguments[i];

			for (key in source) {
				value = source[key];
				constructor = value.constructor;

				if (!(key in target)) {
					target[key] = value;
				}
				else if (constructor === ARRAY) {
					target[key] = target[key].concat(value);
				}
				else if (constructor === OBJECT) {
					merge.call(target[key], value);
				}
				else {
					target[key] = value;
				}
			}
		}

		return target;
	};
});
/*!
 * TroopJS Utils grep component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/grep',[ "jquery" ], function GrepModule($) {
	return $.grep;
});
/*!
 * TroopJS Utils tr component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/tr',[],function TrModule() {
	var TYPEOF_NUMBER = typeof Number();

	return function tr(callback) {
		var self = this;
		var result = [];
		var i;
		var length = self.length;
		var key;

		// Is this an array? Basically, is length a number, is it 0 or is it greater than 0 and that we have index 0 and index length-1
		if (typeof length === TYPEOF_NUMBER && length === 0 || length > 0 && 0 in self && length - 1 in self) {
			for (i = 0; i < length; i++) {
				result.push(callback.call(self, self[i], i));
			}
		// Otherwise we'll iterate it as an object
		} else if (self){
			for (key in self) {
				result.push(callback.call(self, self[key], key));
			}
		}

		return result;
	};
});
/*
 * ComposeJS, object composition for JavaScript, featuring
* JavaScript-style prototype inheritance and composition, multiple inheritance,
* mixin and traits-inspired conflict resolution and composition
 */
(function(define){

define('compose',[], function(){
	// function for creating instances from a prototype
	function Create(){
	}
	var delegate = Object.create ?
		function(proto){
			return Object.create(typeof proto == "function" ? proto.prototype : proto || Object.prototype);
		} :
		function(proto){
			Create.prototype = typeof proto == "function" ? proto.prototype : proto;
			var instance = new Create();
			Create.prototype = null;
			return instance;
		};
	function validArg(arg){
		if(!arg){
			throw new Error("Compose arguments must be functions or objects");
		}
		return arg;
	}
	// this does the work of combining mixins/prototypes
	function mixin(instance, args, i){
		// use prototype inheritance for first arg
		var value, argsLength = args.length;
		for(; i < argsLength; i++){
			var arg = args[i];
			if(typeof arg == "function"){
				// the arg is a function, use the prototype for the properties
				var prototype = arg.prototype;
				for(var key in prototype){
					value = prototype[key];
					var own = prototype.hasOwnProperty(key);
					if(typeof value == "function" && key in instance && value !== instance[key]){
						var existing = instance[key];
						if(value == required){
							// it is a required value, and we have satisfied it
							value = existing;
						}
						else if(!own){
							// if it is own property, it is considered an explicit override
							// TODO: make faster calls on this, perhaps passing indices and caching
							if(isInMethodChain(value, key, getBases([].slice.call(args, 0, i), true))){
								// this value is in the existing method's override chain, we can use the existing method
								value = existing;
							}else if(!isInMethodChain(existing, key, getBases([arg], true))){
								// the existing method is not in the current override chain, so we are left with a conflict
								console.error("Conflicted method " + key + ", final composer must explicitly override with correct method.");
							}
						}
					}
					if(value && value.install && own && !isInMethodChain(existing, key, getBases([arg], true))){
						// apply modifier
						value.install.call(instance, key);
					}else{
						instance[key] = value;
					}
				}
			}else{
				// it is an object, copy properties, looking for modifiers
				for(var key in validArg(arg)){
					var value = arg[key];
					if(typeof value == "function"){
						if(value.install){
							// apply modifier
							value.install.call(instance, key);
							continue;
						}
						if(key in instance){
							if(value == required){
								// required requirement met
								continue;
							}
						}
					}
					// add it to the instance
					instance[key] = value;
				}
			}
		}
		return instance;
	}
	// allow for override (by es5 module)
	Compose._setMixin = function(newMixin){
		mixin = newMixin;
	};
	function isInMethodChain(method, name, prototypes){
		// searches for a method in the given prototype hierarchy
		for(var i = 0; i < prototypes.length;i++){
			var prototype = prototypes[i];
			if(prototype[name] == method){
				// found it
				return true;
			}
		}
	}
	// Decorator branding
	function Decorator(install, direct){
		function Decorator(){
			if(direct){
				return direct.apply(this, arguments);
			}
			throw new Error("Decorator not applied");
		}
		Decorator.install = install;
		return Decorator;
	}
	Compose.Decorator = Decorator;
	// aspect applier
	function aspect(handler){
		return function(advice){
			return Decorator(function install(key){
				var baseMethod = this[key];
				(advice = this[key] = baseMethod ? handler(this, baseMethod, advice) : advice).install = install;
			}, advice);
		};
	};
	// around advice, useful for calling super methods too
	Compose.around = aspect(function(target, base, advice){
		return advice.call(target, base);
	});
	Compose.before = aspect(function(target, base, advice){
		return function(){
			var results = advice.apply(this, arguments);
			if(results !== stop){
				return base.apply(this, results || arguments);
			}
		};
	});
	var stop = Compose.stop = {};
	var undefined;
	Compose.after = aspect(function(target, base, advice){
		return function(){
			var results = base.apply(this, arguments);
			var adviceResults = advice.apply(this, arguments);
			return adviceResults === undefined ? results : adviceResults;
		};
	});

	// rename Decorator for calling super methods
	Compose.from = function(trait, fromKey){
		if(fromKey){
			return (typeof trait == "function" ? trait.prototype : trait)[fromKey];
		}
		return Decorator(function(key){
			if(!(this[key] = (typeof trait == "string" ? this[trait] :
				(typeof trait == "function" ? trait.prototype : trait)[fromKey || key]))){
				throw new Error("Source method " + fromKey + " was not available to be renamed to " + key);
			}
		});
	};

	// Composes an instance
	Compose.create = function(base){
		// create the instance
		var instance = mixin(delegate(base), arguments, 1);
		var argsLength = arguments.length;
		// for go through the arguments and call the constructors (with no args)
		for(var i = 0; i < argsLength; i++){
			var arg = arguments[i];
			if(typeof arg == "function"){
				instance = arg.call(instance) || instance;
			}
		}
		return instance;
	}
	// The required function, just throws an error if not overriden
	function required(){
		throw new Error("This method is required and no implementation has been provided");
	};
	Compose.required = required;
	// get the value of |this| for direct function calls for this mode (strict in ES5)

	function extend(){
		var args = [this];
		args.push.apply(args, arguments);
		return Compose.apply(0, args);
	}
	// Compose a constructor
	function Compose(base){
		var args = arguments;
		var prototype = (args.length < 2 && typeof args[0] != "function") ?
			args[0] : // if there is just a single argument object, just use that as the prototype
			mixin(delegate(validArg(base)), args, 1); // normally create a delegate to start with
		function Constructor(){
			var instance;
			if(this instanceof Constructor){
				// called with new operator, can proceed as is
				instance = this;
			}else{
				// we allow for direct calls without a new operator, in this case we need to
				// create the instance ourself.
				Create.prototype = prototype;
				instance = new Create();
			}
			// call all the constructors with the given arguments
			for(var i = 0; i < constructorsLength; i++){
				var constructor = constructors[i];
				var result = constructor.apply(instance, arguments);
				if(typeof result == "object"){
					if(result instanceof Constructor){
						instance = result;
					}else{
						for(var j in result){
							if(result.hasOwnProperty(j)){
								instance[j] = result[j];
							}
						}
					}
				}
			}
			return instance;
		}
		// create a function that can retrieve the bases (constructors or prototypes)
		Constructor._getBases = function(prototype){
			return prototype ? prototypes : constructors;
		};
		// now get the prototypes and the constructors
		var constructors = getBases(args),
			constructorsLength = constructors.length;
		if(typeof args[args.length - 1] == "object"){
			args[args.length - 1] = prototype;
		}
		var prototypes = getBases(args, true);
		Constructor.extend = extend;
		if(!Compose.secure){
			prototype.constructor = Constructor;
		}
		Constructor.prototype = prototype;
		return Constructor;
	};

	Compose.apply = function(thisObject, args){
		// apply to the target
		return thisObject ?
			mixin(thisObject, args, 0) : // called with a target object, apply the supplied arguments as mixins to the target object
			extend.apply.call(Compose, 0, args); // get the Function.prototype apply function, call() it to apply arguments to Compose (the extend doesn't matter, just a handle way to grab apply, since we can't get it off of Compose)
	};
	Compose.call = function(thisObject){
		// call() should correspond with apply behavior
		return mixin(thisObject, arguments, 1);
	};

	function getBases(args, prototype){
		// this function registers a set of constructors for a class, eliminating duplicate
		// constructors that may result from diamond construction for classes (B->A, C->A, D->B&C, then D() should only call A() once)
		var bases = [];
		function iterate(args, checkChildren){
			outer:
			for(var i = 0; i < args.length; i++){
				var arg = args[i];
				var target = prototype && typeof arg == "function" ?
						arg.prototype : arg;
				if(prototype || typeof arg == "function"){
					var argGetBases = checkChildren && arg._getBases;
					if(argGetBases){
						iterate(argGetBases(prototype)); // don't need to check children for these, this should be pre-flattened
					}else{
						for(var j = 0; j < bases.length; j++){
							if(target == bases[j]){
								continue outer;
							}
						}
						bases.push(target);
					}
				}
			}
		}
		iterate(args, true);
		return bases;
	}
	// returning the export of the module
	return Compose;
});
})(typeof define != "undefined" ?
	define: // AMD/RequireJS format if available
	function(deps, factory){
		if(typeof module !="undefined"){
			module.exports = factory(); // CommonJS environment, like NodeJS
		//	require("./configure");
		}else{
			Compose = factory(); // raw script, assign to Compose global
		}
	});

/*!
 * TroopJS Utils URI module
 *
 * parts of code from parseUri 1.2.2 Copyright Steven Levithan <stevenlevithan.com>
 *
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true, newcap:false, forin:false, loopfunc:true */
/*global define:true */
define('troopjs-utils/uri',[ "compose" ], function URIModule(Compose) {
	var NULL = null;
	var ARRAY_PROTO = Array.prototype;
	var OBJECT_PROTO = Object.prototype;
	var PUSH = ARRAY_PROTO.push;
	var SPLIT = String.prototype.split;
	var TOSTRING = OBJECT_PROTO.toString;
	var TOSTRING_OBJECT = TOSTRING.call(OBJECT_PROTO);
	var TOSTRING_ARRAY = TOSTRING.call(ARRAY_PROTO);
	var TOSTRING_STRING = TOSTRING.call(String.prototype);
	var TOSTRING_FUNCTION = TOSTRING.call(Function.prototype);
	var RE_URI = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:([^?#]*)(?:\?([^#]*))?(?:#(.*))?)/;

	var PROTOCOL = "protocol";
	var AUTHORITY = "authority";
	var PATH = "path";
	var QUERY = "query";
	var ANCHOR = "anchor";

	var KEYS = [ "source",
		PROTOCOL,
		AUTHORITY,
		"userInfo",
		"user",
		"password",
		"host",
		"port",
		PATH,
		QUERY,
		ANCHOR ];

	// Store current Compose.secure setting
	var SECURE = Compose.secure;

	// Prevent Compose from creating constructor property
	Compose.secure = true;

	function Query(arg) {
		var result = {};
		var matches;
		var key = NULL;
		var value;
		var re = /(?:&|^)([^&=]*)=?([^&]*)/g;

		result.toString = Query.toString;

		if (TOSTRING.call(arg) === TOSTRING_OBJECT) {
			for (key in arg) {
				result[key] = arg[key];
			}
		} else {
			while ((matches = re.exec(arg)) !== NULL) {
				key = matches[1];

				if (key in result) {
					value = result[key];

					if (TOSTRING.call(value) === TOSTRING_ARRAY) {
						value[value.length] = matches[2];
					}
					else {
						result[key] = [ value, matches[2] ];
					}
				}
				else {
					result[key] = matches[2];
				}
			}
		}

		return result;
	}

	Query.toString = function toString() {
		var self = this;
		var key = NULL;
		var value = NULL;
		var values;
		var query = [];
		var i = 0;
		var j;

		for (key in self) {
			if (TOSTRING.call(self[key]) === TOSTRING_FUNCTION) {
				continue;
			}

			query[i++] = key;
		}

		query.sort();

		while (i--) {
			key = query[i];
			value = self[key];

			if (TOSTRING.call(value) === TOSTRING_ARRAY) {
				values = value.slice(0);

				values.sort();

				j = values.length;

				while (j--) {
					value = values[j];

					values[j] = value === ""
						? key
						: key + "=" + value;
				}

				query[i] = values.join("&");
			}
			else {
				query[i] = value === ""
					? key
					: key + "=" + value;
			}
		}

		return query.join("&");
	};

	// Extend on the instance of array rather than subclass it
	function Path(arg) {
		var result = [];

		result.toString = Path.toString;

		PUSH.apply(result, TOSTRING.call(arg) === TOSTRING_ARRAY
			? arg
			: SPLIT.call(arg, "/"));

		return result;
	}

	Path.toString = function() {
		return this.join("/");
	};

	var URI = Compose(function URI(str) {
		var self = this;
		var value;
		var matches;
		var i;

		if ((matches = RE_URI.exec(str)) !== NULL) {
			i = matches.length;

			while (i--) {
				value = matches[i];

				if (value) {
					self[KEYS[i]] = value;
				}
			}
		}

		if (QUERY in self) {
			self[QUERY] = Query(self[QUERY]);
		}

		if (PATH in self) {
			self[PATH] = Path(self[PATH]);
		}
	});

	URI.prototype.toString = function () {
		var self = this;
		var uri = [ PROTOCOL , "://", AUTHORITY, PATH, "?", QUERY, "#", ANCHOR ];
		var i;
		var key;

		if (!(PROTOCOL in self)) {
			uri[0] = uri[1] = "";
		}

		if (!(AUTHORITY in self)) {
			uri[2] = "";
		}

		if (!(PATH in self)) {
			uri[3] = "";
		}

		if (!(QUERY in self)) {
			uri[4] = uri[5] = "";
		}

		if (!(ANCHOR in self)) {
			uri[6] = uri[7] = "";
		}

		i = uri.length;

		while (i--) {
			key = uri[i];

			if (key in self) {
				uri[i] = self[key];
			}
		}

		return uri.join("");
	};

	// Restore Compose.secure setting
	Compose.secure = SECURE;

	URI.Path = Path;
	URI.Query = Query;

	return URI;
});
/*!
 * TroopJS Utils each component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/each',[ "jquery" ], function EachModule($) {
	return $.each;
});
/*!
 * TroopJS Utils callbacks component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/callbacks',[ "jquery" ], function CallbacksModule($) {
	return $.Callbacks;
});
/*!
 * TroopJS Utils unique component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/unique',[],function UniqueModule() {
	return function unique(callback) {
		var self = this;
		var length = self.length;
		var result = [];
		var value;
		var i;
		var j;
		var k;

		add: for (i = j = k = 0; i < length; i++, j = 0) {
			value = self[i];

			while(j < k) {
				if (callback.call(self, value, result[j++]) === true) {
					continue add;
				}
			}

			result[k++] = value;
		}

		return result;
	};
});
/*!
 * TroopJS Utils when component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/when',[ "jquery" ], function WhenModule($) {
	return $.when;
});
/*!
 * TroopJS Utils deferred component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-utils/deferred',[ "jquery" ], function DeferredModule($) {
	return $.Deferred;
});
/*!
 * TroopJS event/emitter module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true */
/*global define:true */
define('troopjs-core/event/emitter',[ "compose" ], function EventEmitterModule(Compose) {
	var UNDEFINED;
	var TRUE = true;
	var FALSE = false;
	var FUNCTION = Function;
	var MEMORY = "memory";
	var CONTEXT = "context";
	var CALLBACK = "callback";
	var LENGTH = "length";
	var HEAD = "head";
	var TAIL = "tail";
	var NEXT = "next";
	var HANDLED = "handled";
	var HANDLERS = "handlers";
	var ROOT = {};
	var COUNT = 0;

	return Compose(function EventEmitter() {
		this[HANDLERS] = {};
	}, {
		/**
		 * Subscribe to a event
		 *
		 * @param event Event to subscribe to
		 * @param context (optional) context to scope callbacks to
		 * @param memory (optional) do we want the last value applied to callbacks
		 * @param callback Callback for this event
		 * @returns self
		 */
		on : function on(event /*, context, memory, callback, callback, ..*/) {
			var self = this;
			var arg = arguments;
			var length = arg[LENGTH];
			var context = arg[1];
			var memory = arg[2];
			var callback = arg[3];
			var handlers = self[HANDLERS];
			var handler;
			var handled;
			var head;
			var tail;
			var offset;

			// No context or memory was supplied
			if (context instanceof FUNCTION) {
				memory = FALSE;
				context = ROOT;
				offset = 1;
			}
			// Only memory was supplied
			else if (context === TRUE || context === FALSE) {
				memory = context;
				context = ROOT;
				offset = 2;
			}
			// Context was supplied, but not memory
			else if (memory instanceof FUNCTION) {
				memory = FALSE;
				offset = 2;
			}
			// All arguments were supplied
			else if (callback instanceof FUNCTION){
				offset = 3;
			}
			// Something is wrong, return fast
			else {
				return self;
			}

			// Have handlers
			if (event in handlers) {

				// Get handlers
				handlers = handlers[event];

				// Create new handler
				handler = {
					"callback" : arg[offset++],
					"context" : context
				};

				// Get tail handler
				tail = TAIL in handlers
					// Have tail, update handlers.tail.next to point to handler
					? handlers[TAIL][NEXT] = handler
					// Have no tail, update handlers.head to point to handler
					: handlers[HEAD] = handler;

				// Iterate handlers from offset
				while (offset < length) {
					// Set tail -> tail.next -> handler
					tail = tail[NEXT] = {
						"callback" : arg[offset++],
						"context" : context
					};
				}

				// Set tail handler
				handlers[TAIL] = tail;

				// Want memory and have memory
				if (memory && MEMORY in handlers) {
					// Get memory
					memory = handlers[MEMORY];

					// Get handled
					handled = memory[HANDLED];

					// Optimize for arguments
					if (memory[LENGTH] > 0 ) {
						// Loop through handlers
						while(handler) {
							// Skip to next handler if this handler has already been handled
							if (handler[HANDLED] === handled) {
								handler = handler[NEXT];
								continue;
							}

							// Store handled
							handler[HANDLED] = handled;

							// Apply handler callback
							handler[CALLBACK].apply(handler[CONTEXT], memory);

							// Update handler
							handler = handler[NEXT];
						}
					}
					// Optimize for no arguments
					else {
						// Loop through handlers
						while(handler) {
							// Skip to next handler if this handler has already been handled
							if (handler[HANDLED] === handled) {
								handler = handler[NEXT];
								continue;
							}

							// Store handled
							handler[HANDLED] = handled;

							// Call handler callback
							handler[CALLBACK].call(handler[CONTEXT]);

							// Update handler
							handler = handler[NEXT];
						}
					}
				}
			}
			// No handlers
			else {
				// Create head and tail
				head = tail = {
					"callback" : arg[offset++],
					"context" : context
				};

				// Iterate handlers from offset
				while (offset < length) {
					// Set tail -> tail.next -> handler
					tail = tail[NEXT] = {
						"callback" : arg[offset++],
						"context" : context
					};
				}

				// Create event list
				handlers[event] = {
					"head" : head,
					"tail" : tail
				};
			}

			return self;
		},

		/**
		 * Unsubscribes from event
		 *
		 * @param event Event to unsubscribe from
		 * @param context (optional) context to scope callbacks to
		 * @param callback (optional) Callback to unsubscribe, if none
		 *        are provided all callbacks are unsubscribed
		 * @returns self
		 */
		off : function off(event /*, context, callback, callback, ..*/) {
			var self = this;
			var arg = arguments;
			var length = arg[LENGTH];
			var context = arg[1];
			var callback = arg[2];
			var handlers = self[HANDLERS];
			var handler;
			var head;
			var previous;
			var offset;

			// No context or memory was supplied
			if (context instanceof FUNCTION) {
				callback = context;
				context = ROOT;
				offset = 1;
			}
			// All arguments were supplied
			else if (callback instanceof FUNCTION){
				offset = 2;
			}
			// Something is wrong, return fast
			else {
				return self;
			}

			// Fast fail if we don't have subscribers
			if (!(event in handlers)) {
				return self;
			}

			// Get handlers
			handlers = handlers[event];

			// Get head
			head = handlers[HEAD];

			// Loop over remaining arguments
			while (offset < length) {
				// Store callback
				callback = arg[offset++];

				// Get first handler
				handler = previous = head;

				// Loop through handlers
				do {
					// Check if this handler should be unlinked
					if (handler[CALLBACK] === callback && handler[CONTEXT] === context) {
						// Is this the first handler
						if (handler === head) {
							// Re-link head and previous, then
							// continue
							head = previous = handler[NEXT];
							continue;
						}

						// Unlink current handler, then continue
						previous[NEXT] = handler[NEXT];
						continue;
					}

					// Update previous pointer
					previous = handler;
				} while ((handler = handler[NEXT]) !== UNDEFINED);
			}

			// Update head and tail
			if (head && previous) {
				handlers[HEAD] = head;
				handlers[TAIL] = previous;
			}
			else {
				delete handlers[HEAD];
				delete handlers[TAIL];
			}

			return self;
		},

		/**
		 * Emit an event
		 *
		 * @param event Event to emit
		 * @param arg (optional) Argument
		 * @returns self
		 */
		emit : function emit(event /*, arg, arg, ..*/) {
			var self = this;
			var arg = arguments;
			var handlers = self[HANDLERS];
			var handler;

			// Store handled
			var handled = arg[HANDLED] = COUNT++;

			// Have handlers
			if (event in handlers) {
				// Get handlers
				handlers = handlers[event];

				// Remember arguments
				handlers[MEMORY] = arg;

				// Get first handler
				handler = handlers[HEAD];

				// Optimize for arguments
				if (arg[LENGTH] > 0) {
					// Loop through handlers
					while(handler) {
						// Skip to next handler if this handler has already been handled
						if (handler[HANDLED] === handled) {
							handler = handler[NEXT];
							continue;
						}

						// Update handled
						handler[HANDLED] = handled;

						// Apply handler callback
						handler[CALLBACK].apply(handler[CONTEXT], arg);

						// Update handler
						handler = handler[NEXT];
					}
				}
				// Optimize for no arguments
				else {
					// Loop through handlers
					while(handler) {
						// Skip to next handler if this handler has already been handled
						if (handler[HANDLED] === handled) {
							handler = handler[NEXT];
							continue;
						}

						// Update handled
						handler[HANDLED] = handled;

						// Call handler callback
						handler[CALLBACK].call(handler[CONTEXT]);

						// Update handler
						handler = handler[NEXT];
					}
				}
			}
			// No handlers
			else if (arg[LENGTH] > 0){
				// Create handlers and store with event
				handlers[event] = handlers = {};

				// Remember arguments
				handlers[MEMORY] = arg;
			}

			return this;
		}
	});
});
/*!
 * TroopJS base component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true */
/*global define:true */
define('troopjs-core/component/base',[ "../event/emitter", "config" ], function ComponentModule(Emitter, config) {
	var COUNT = 0;
	var INSTANCE_COUNT = "instanceCount";

	var Component = Emitter.extend(function Component() {
		this[INSTANCE_COUNT] = COUNT++;
	}, {
		displayName : "core/component",

		/**
		 * Application configuration
		 */
		config : config
	});

	/**
	 * Generates string representation of this object
	 * @returns Combination displayName and instanceCount
	 */
	Component.prototype.toString = function () {
		var self = this;

		return self.displayName + "@" + self[INSTANCE_COUNT];
	};

	return Component;
});

/*!
 * TroopJS pubsub/hub module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true */
/*global define:true */
define('troopjs-core/pubsub/hub',[ "compose", "../component/base" ], function HubModule(Compose, Component) {

	var from = Compose.from;

	return Compose.create(Component, {
		displayName: "core/pubsub/hub",
		subscribe : from(Component, "on"),
		unsubscribe : from(Component, "off"),
		publish : from(Component, "emit")
	});
});

/*!
 * TroopJS gadget component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, newcap:false, forin:false, loopfunc:true */
/*global define:true */
define('troopjs-core/component/gadget',[ "compose", "./base", "troopjs-utils/deferred", "../pubsub/hub" ], function GadgetModule(Compose, Component, Deferred, hub) {
	var UNDEFINED;
	var NULL = null;
	var FUNCTION = Function;
	var RE_HUB = /^hub(?::(\w+))?\/(.+)/;
	var RE_SIG = /^sig\/(.+)/;
	var PUBLISH = hub.publish;
	var SUBSCRIBE = hub.subscribe;
	var UNSUBSCRIBE = hub.unsubscribe;
	var MEMORY = "memory";
	var SUBSCRIPTIONS = "subscriptions";

	return Component.extend(function Gadget() {
		var self = this;
		var bases = self.constructor._getBases(true);
		var base;
		var callbacks;
		var callback;
		var i;
		var j;
		var jMax;

		var signals = {};
		var signal;
		var matches;
		var key = null;

		// Iterate base chain (while there's a prototype)
		for (i = bases.length - 1; i >= 0; i--) {
			base = bases[i];

			add: for (key in base) {
				// Get value
				callback = base[key];

				// Continue if value is not a function
				if (!(callback instanceof FUNCTION)) {
					continue;
				}

				// Match signature in key
				matches = RE_SIG.exec(key);

				if (matches !== NULL) {
					// Get signal
					signal = matches[1];

					// Have we stored any callbacks for this signal?
					if (signal in signals) {
						// Get callbacks (for this signal)
						callbacks = signals[signal];

						// Reset counters
						j = jMax = callbacks.length;

						// Loop callbacks, continue add if we've already added this callback
						while (j--) {
							if (callback === callbacks[j]) {
								continue add;
							}
						}

						// Add callback to callbacks chain
						callbacks[jMax] = callback;
					}
					else {
						// First callback
						signals[signal] = [ callback ];
					}
				}
			}
		}

		// Extend self
		Compose.call(self, {
			signal : function onSignal(signal, deferred) {
				var _self = this;
				var _callbacks;
				var _j;
				var head = deferred;

				// Only trigger if we have callbacks for this signal
				if (signal in signals) {
					// Get callbacks
					_callbacks = signals[signal];

					// Reset counter
					_j = _callbacks.length;

					// Build deferred chain from end to 1
					while (--_j) {
						// Create new deferred
						head = Deferred(function (dfd) {
							// Store callback and deferred as they will have changed by the time we exec
							var _callback = _callbacks[_j];
							var _deferred = head;

							// Add done handler
							dfd.done(function done() {
								_callback.call(_self, signal, _deferred);
							});
						});
					}

					// Execute first sCallback, use head deferred
					_callbacks[0].call(_self, signal, head);
				}
				else if (deferred) {
					deferred.resolve();
				}

				return _self;
			}
		});
	}, {
		displayName : "core/component/gadget",

		"sig/initialize" : function initialize(signal, deferred) {
			var self = this;

			var subscriptions = self[SUBSCRIPTIONS] = [];
			var key = NULL;
			var value;
			var matches;
			var topic;

			// Loop over each property in gadget
			for (key in self) {
				// Get value
				value = self[key];

				// Continue if value is not a function
				if (!(value instanceof FUNCTION)) {
					continue;
				}

				// Match signature in key
				matches = RE_HUB.exec(key);

				if (matches !== NULL) {
					// Get topic
					topic = matches[2];

					// Subscribe
					hub.subscribe(topic, self, matches[1] === MEMORY, value);

					// Store in subscriptions
					subscriptions[subscriptions.length] = [topic, self, value];

					// NULL value
					self[key] = NULL;
				}
			}

			if (deferred) {
				deferred.resolve();
			}

			return self;
		},

		"sig/finalize" : function finalize(signal, deferred) {
			var self = this;
			var subscriptions = self[SUBSCRIPTIONS];
			var subscription;

			// Loop over subscriptions
			while ((subscription = subscriptions.shift()) !== UNDEFINED) {
				hub.unsubscribe(subscription[0], subscription[1], subscription[2]);
			}

			if (deferred) {
				deferred.resolve();
			}

			return self;
		},

		/**
			 * Calls hub.publish in self context
		 * @returns self
		 */
		publish : function publish() {
			var self = this;

			PUBLISH.apply(hub, arguments);

			return self;
		},

		/**
		 * Calls hub.subscribe in self context
		 * @returns self
		 */
		subscribe : function subscribe() {
			var self = this;

			SUBSCRIBE.apply(hub, arguments);

			return self;
		},

		/**
		 * Calls hub.unsubscribe in self context
		 * @returns self
		 */
		unsubscribe : function unsubscribe() {
			var self = this;

			UNSUBSCRIBE.apply(hub, arguments);

			return self;
		},

		start : function start(deferred) {
			var self = this;

			deferred = deferred || Deferred();

			Deferred(function deferredStart(dfdStart) {
				dfdStart.then(deferred.resolve, deferred.reject, deferred.notify);

				Deferred(function deferredInitialize(dfdInitialize) {
					dfdInitialize.then(function doneInitialize() {
						self.signal("start", dfdStart);
					}, dfdStart.reject, dfdStart.notify);

					self.signal("initialize", dfdInitialize);
				});
			});

			return self;
		},

		stop : function stop(deferred) {
			var self = this;

			deferred = deferred || Deferred();

			Deferred(function deferredFinalize(dfdFinalize) {
				dfdFinalize.then(deferred.resolve, deferred.reject, deferred.notify);

				Deferred(function deferredStop(dfdStop) {
					dfdStop.then(function doneStop() {
						self.signal("finalize", dfdFinalize);
					}, dfdFinalize.reject, dfdFinalize.notify);

					self.signal("stop", dfdStop);
				});
			});

			return self;
		}
	});
});

/*!
 * TroopJS service component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/component/service',[ "./gadget" ], function ServiceModule(Gadget) {
	return Gadget.extend({
		displayName : "core/component/service"
	});
});
/*!
 * TroopJS widget component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, newcap:false */
/*global define:true */
define('troopjs-core/component/widget',[ "./gadget", "jquery", "troopjs-utils/deferred" ], function WidgetModule(Gadget, $, Deferred) {
	var UNDEFINED;
	var NULL = null;
	var FUNCTION = Function;
	var ARRAY_PROTO = Array.prototype;
	var SHIFT = ARRAY_PROTO.shift;
	var UNSHIFT = ARRAY_PROTO.unshift;
	var $TRIGGER = $.fn.trigger;
	var $ONE = $.fn.one;
	var $BIND = $.fn.bind;
	var $UNBIND = $.fn.unbind;
	var RE = /^dom(?::(\w+))?\/([^\.]+(?:\.(.+))?)/;
	var REFRESH = "widget/refresh";
	var $ELEMENT = "$element";
	var $PROXIES = "$proxies";
	var ONE = "one";
	var THEN = "then";
	var ATTR_WEAVE = "[data-weave]";
	var ATTR_WOVEN = "[data-woven]";

	/**
	 * Creates a proxy of the inner method 'handlerProxy' with the 'topic', 'widget' and handler parameters set
	 * @param topic event topic
	 * @param widget target widget
	 * @param handler target handler
	 * @returns {Function} proxied handler
	 */
	function eventProxy(topic, widget, handler) {
		/**
		 * Creates a proxy of the outer method 'handler' that first adds 'topic' to the arguments passed
		 * @returns result of proxied hanlder invocation
		 */
		return function handlerProxy() {
			// Add topic to front of arguments
			UNSHIFT.call(arguments, topic);

			// Apply with shifted arguments to handler
			return handler.apply(widget, arguments);
		};
	}

	/**
	 * Creates a proxy of the inner method 'render' with the '$fn' parameter set
	 * @param $fn jQuery method
	 * @returns {Function} proxied render
	 */
	function renderProxy($fn) {
		/**
		 * Renders contents into element
		 * @param contents (Function | String) Template/String to render
		 * @param data (Object) If contents is a template - template data (optional)
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		function render(/* contents, data, ..., deferred */) {
			var self = this;
			var $element = self[$ELEMENT];
			var arg = arguments;

			// Shift contents from first argument
			var contents = SHIFT.call(arg);

			// Assume deferred is the last argument
			var deferred = arg[arg.length - 1];

			// If deferred not a true Deferred, make it so
			if (deferred === UNDEFINED || !(deferred[THEN] instanceof FUNCTION)) {
				deferred = Deferred();
			}

			// Defer render (as weaving it may need to load async)
			Deferred(function deferredRender(dfdRender) {

				// Link deferred
				dfdRender.then(function renderDone() {
					// Trigger refresh
					$element.trigger(REFRESH, arguments);

					// Resolve outer deferred
					deferred.resolve();
				}, deferred.reject, deferred.notify);

				// Notify that we're about to render
				dfdRender.notify("beforeRender", self);

				// Call render with contents (or result of contents if it's a function)
				$fn.call($element, contents instanceof FUNCTION ? contents.apply(self, arg) : contents);

				// Notify that we're rendered
				dfdRender.notify("afterRender", self);

				// Weave element
				$element.find(ATTR_WEAVE).weave(dfdRender);
			});

			return self;
		}

		return render;
	}

	return Gadget.extend(function Widget($element, displayName) {
		var self = this;

		self[$ELEMENT] = $element;

		if (displayName) {
			self.displayName = displayName;
		}
	}, {
		displayName : "core/component/widget",

		"sig/initialize" : function initialize(signal, deferred) {
			var self = this;
			var $element = self[$ELEMENT];
			var $proxies = self[$PROXIES] = [];
			var key = NULL;
			var value;
			var matches;
			var topic;

			// Loop over each property in widget
			for (key in self) {
				// Get value
				value = self[key];

				// Continue if value is not a function
				if (!(value instanceof FUNCTION)) {
					continue;
				}

				// Match signature in key
				matches = RE.exec(key);

				if (matches !== NULL) {
					// Get topic
					topic = matches[2];

					// Replace value with a scoped proxy
					value = eventProxy(topic, self, value);

					// Either ONE or BIND element
					(matches[2] === ONE ? $ONE : $BIND).call($element, topic, self, value);

					// Store in $proxies
					$proxies[$proxies.length] = [topic, value];

					// NULL value
					self[key] = NULL;
				}
			}

			if (deferred) {
				deferred.resolve();
			}

			return self;
		},

		"sig/finalize" : function finalize(signal, deferred) {
			var self = this;
			var $element = self[$ELEMENT];
			var $proxies = self[$PROXIES];
			var $proxy;

			// Loop over subscriptions
			while (($proxy = $proxies.shift()) !== UNDEFINED) {
				$element.unbind($proxy[0], $proxy[1]);
			}

			delete self[$ELEMENT];

			if (deferred) {
				deferred.resolve();
			}

			return self;
		},

		/**
		 * Weaves all children of $element
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		weave : function weave(deferred) {
			var self = this;

			self[$ELEMENT].find(ATTR_WEAVE).weave(deferred);

			return self;
		},

		/**
		 * Unweaves all children of $element _and_ self
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		unweave : function unweave(deferred) {
			var self = this;

			self[$ELEMENT].find(ATTR_WOVEN).andSelf().unweave(deferred);

			return this;
		},

		/**
		 * Binds event from $element, exactly once
		 * @returns self
		 */
		one : function one() {
			var self = this;

			$ONE.apply(self[$ELEMENT], arguments);

			return self;
		},

		/**
		 * Binds event to $element
		 * @returns self
		 */
		bind : function bind() {
			var self = this;

			$BIND.apply(self[$ELEMENT], arguments);

			return self;
		},

		/**
		 * Unbinds event from $element
		 * @returns self
		 */
		unbind : function unbind() {
			var self = this;

			$UNBIND.apply(self[$ELEMENT], arguments);

			return self;
		},

		/**
		 * Triggers event on $element
		 * @returns self
		 */
		trigger : function trigger() {
			var self = this;

			$TRIGGER.apply(self[$ELEMENT], arguments);

			return self;
		},

		/**
		 * Renders content and inserts it before $element
		 */
		before : renderProxy($.fn.before),

		/**
		 * Renders content and inserts it after $element
		 */
		after : renderProxy($.fn.after),

		/**
		 * Renders content and replaces $element contents
		 */
		html : renderProxy($.fn.html),

		/**
		 * Renders content and replaces $element contents
		 */
		text : renderProxy($.fn.text),

		/**
		 * Renders content and appends it to $element
		 */
		append : renderProxy($.fn.append),

		/**
		 * Renders content and prepends it to $element
		 */
		prepend : renderProxy($.fn.prepend),

		/**
		 * Empties widget
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		empty : function empty(deferred) {
			var self = this;

			// Ensure we have deferred
			deferred = deferred || Deferred();

			// Create deferred for emptying
			Deferred(function emptyDeferred(dfdEmpty) {
				// Link deferred
				dfdEmpty.then(deferred.resolve, deferred.reject, deferred.notify);

				// Get element
				var $element = self[$ELEMENT];

				// Detach contents
				var $contents = $element.contents().detach();

				// Trigger refresh
				$element.trigger(REFRESH, self);

				// Use timeout in order to yield
				setTimeout(function emptyTimeout() {
					// Get DOM elements
					var contents = $contents.get();

					// Remove elements from DOM
					$contents.remove();

					// Resolve deferred
					dfdEmpty.resolve(contents);
				}, 0);
			});

			return self;
		}
	});
});

/*!
 * TroopJS dimensions/service module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/dimensions/service',[ "../component/service" ], function DimensionsServiceModule(Service) {
	var DIMENSIONS = "dimensions";
	var $ELEMENT = "$element";

	function onDimensions($event, w, h) {
		$event.data.publish(DIMENSIONS, w, h);
	}

	return Service.extend(function DimensionsService($element, dimensions) {
		var self = this;

		self[$ELEMENT] = $element;
		self[DIMENSIONS] = dimensions;
	}, {
		displayName : "core/dimensions/service",

		"sig/initialize" : function initialize(signal, deferred) {
			var self = this;

			self[$ELEMENT].bind(DIMENSIONS + "." + self[DIMENSIONS], self, onDimensions);

			if (deferred) {
				deferred.resolve();
			}
		},

		"sig/start" : function start(signal, deferred) {
			var self = this;

			self[$ELEMENT].trigger("resize." + DIMENSIONS);

			if (deferred) {
				deferred.resolve();
			}
		},

		"sig/finalize" : function finalize(signal, deferred) {
			var self = this;

			self[$ELEMENT].unbind(DIMENSIONS + "." + self[DIMENSIONS], onDimensions);

			if (deferred) {
				deferred.resolve();
			}
		}
	});
});
/*!
 * TroopJS store/base module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/store/base',[ "compose", "../component/gadget" ], function StoreModule(Compose, Gadget) {
	var STORAGE = "storage";

	return Gadget.extend({
		storage : Compose.required,

		set : function set(key, value, deferred) {
			// JSON encoded 'value' then store as 'key'
			this[STORAGE].setItem(key, JSON.stringify(value));

			// Resolve deferred
			if (deferred) {
				deferred.resolve(value);
			}
		},

		get : function get(key, deferred) {
			// Get value from 'key', parse JSON
			var value = JSON.parse(this[STORAGE].getItem(key));

			// Resolve deferred
			if (deferred) {
				deferred.resolve(value);
			}
		},

		remove : function remove(key, deferred) {
			// Remove key
			this[STORAGE].removeItem(key);

			// Resolve deferred
			if (deferred) {
				deferred.resolve();
			}
		},

		clear : function clear(deferred) {
			// Clear
			this[STORAGE].clear();

			// Resolve deferred
			if (deferred) {
				deferred.resolve();
			}
		}
	});
});
/*!
 * TroopJS store/session module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/store/session',[ "compose", "./base" ], function StoreSessionModule(Compose, Store) {

	return Compose.create(Store, {
		displayName : "core/store/session",

		storage: window.sessionStorage
	});
});

/*!
 * TroopJS store/local module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/store/local',[ "compose", "./base" ], function StoreLocalModule(Compose, Store) {

	return Compose.create(Store, {
		displayName : "core/store/local",

		storage : window.localStorage
	});
});
/*!
 * TroopJS route/router module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/route/router',[ "../component/service", "troopjs-utils/uri" ], function RouterModule(Service, URI) {
	var HASHCHANGE = "hashchange";
	var $ELEMENT = "$element";
	var ROUTE = "route";
	var RE = /^#/;

	function onHashChange($event) {
		var self = $event.data;

		// Create URI
		var uri = URI($event.target.location.hash.replace(RE, ""));

		// Convert to string
		var route = uri.toString();

		// Did anything change?
		if (route !== self[ROUTE]) {
			// Store new value
			self[ROUTE] = route;

			// Publish route
			self.publish(ROUTE, uri);
		}
	}

	return Service.extend(function RouterService($element) {
		this[$ELEMENT] = $element;
	}, {
		displayName : "core/route/router",

		"sig/initialize" : function initialize(signal, deferred) {
			var self = this;

			self[$ELEMENT].bind(HASHCHANGE, self, onHashChange);

			if (deferred) {
				deferred.resolve();
			}

			return self;
		},

		"sig/start" : function start(signal, deferred) {
			var self = this;

			self[$ELEMENT].trigger(HASHCHANGE);

			if (deferred) {
				deferred.resolve();
			}

			return self;
		},

		"sig/finalize" : function finalize(signal, deferred) {
			var self = this;

			self[$ELEMENT].unbind(HASHCHANGE, onHashChange);

			if (deferred) {
				deferred.resolve();
			}

			return self;
		}
	});
});
/*!
 * TroopJS widget/placeholder component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true */
/*global define:true */
define('troopjs-core/widget/placeholder',[ "../component/widget", "troopjs-utils/deferred", "require" ], function WidgetPlaceholderModule(Widget, Deferred, parentRequire) {
	var FUNCTION = Function;
	var POP = Array.prototype.pop;
	var HOLDING = "holding";
	var DATA_HOLDING = "data-" + HOLDING;
	var $ELEMENT = "$element";
	var TARGET = "target";
	var THEN = "then";

	function release(/* arg, arg, arg, deferred*/) {
		var self = this;
		var arg = arguments;
		var argc = arg.length;

		// If deferred not a true Deferred, make it so
		var deferred = argc > 0 && arg[argc - 1][THEN] instanceof FUNCTION
			? POP.call(arg)
			: Deferred();

		Deferred(function deferredRelease(dfdRelease) {
			var i;
			var iMax;
			var name;
			var argv;

			// We're already holding something, resolve with cache
			if (HOLDING in self) {
				dfdRelease
					.done(deferred.resolve)
					.resolve(self[HOLDING]);
			}
			else {
				// Add done handler to release
				dfdRelease.then([ function doneRelease(widget) {
					// Set DATA_HOLDING attribute
					self[$ELEMENT].attr(DATA_HOLDING, widget);

					// Store widget
					self[HOLDING] = widget;
				}, deferred.resolve ], deferred.reject, deferred.notify);

				// Get widget name
				name = self[TARGET];

				// Set initial argv
				argv = [ self[$ELEMENT], name ];

				// Append values from arg to argv
				for (i = 0, iMax = arg.length; i < iMax; i++) {
					argv[i + 2] = arg[i];
				}

				// Require widget by name
				parentRequire([ name ], function required(Widget) {
					// Defer require
					Deferred(function deferredStart(dfdRequire) {
						// Constructed and initialized instance
						var widget = Widget
							.apply(Widget, argv);

						// Link deferred
						dfdRequire.then(function doneStart() {
							dfdRelease.resolve(widget);
						}, dfdRelease.reject, dfdRelease.notify);

						// Start
						widget.start(dfdRequire);
					});
				});
			}
		});

		return self;
	}

	function hold(deferred) {
		var self = this;

		deferred = deferred || Deferred();

		Deferred(function deferredHold(dfdHold) {
			var widget;

			// Link deferred
			dfdHold.then(deferred.resolve, deferred.reject, deferred.notify);

			// Check that we are holding
			if (HOLDING in self) {
				// Get what we're holding
				widget = self[HOLDING];

				// Cleanup
				delete self[HOLDING];

				// Remove DATA_HOLDING attribute
				self[$ELEMENT].removeAttr(DATA_HOLDING);

				// Stop
				widget.stop(dfdHold);
			}
			else {
				dfdHold.resolve();
			}
		});

		return self;
	}

	return Widget.extend(function WidgetPlaceholder($element, name, target) {
		this[TARGET] = target;
	}, {
		displayName : "core/widget/placeholder",

		"sig/finalize" : function finalize(signal, deferred) {
			this.hold(deferred);
		},

		release : release,
		hold : hold
	});
});

/*!
 * TroopJS route/placeholder module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/route/placeholder',[ "../widget/placeholder" ], function RoutePlaceholderModule(Placeholder) {
	var NULL = null;
	var ROUTE = "route";

	return Placeholder.extend(function RoutePlaceholderWidget($element, name) {
		this[ROUTE] = RegExp($element.data("route"));
	}, {
		"displayName" : "core/route/placeholder",

		"hub:memory/route" : function onRoute(topic, uri) {
			var self = this;
			var matches = self[ROUTE].exec(uri.path);

			if (matches !== NULL) {
				self.release.apply(self, matches.slice(1));
			}
			else {
				self.hold();
			}
		}
	});
});
/*!
 * TroopJS widget/application component
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/widget/application',[ "../component/widget", "troopjs-utils/deferred" ], function ApplicationModule(Widget, Deferred) {
	return Widget.extend({
		displayName : "core/widget/application",

		"sig/start" : function start(signal, deferred) {
			this.weave(deferred);
		},

		"sig/stop" : function stop(signal, deferred) {
			this.unweave(deferred);
		}
	});
});
/*!
 * TroopJS pubsub/topic module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/*jshint strict:false, smarttabs:true, laxbreak:true */
/*global define:true */
define('troopjs-core/pubsub/topic',[ "../component/base", "troopjs-utils/unique" ], function TopicModule(Component, unique) {
	var TOSTRING = Object.prototype.toString;
	var TOSTRING_ARRAY = TOSTRING.call(Array.prototype);

	function comparator (a, b) {
		return a.publisherInstanceCount === b.publisherInstanceCount;
	}

	var Topic = Component.extend(function Topic(topic, publisher, parent) {
		var self = this;

		self.topic = topic;
		self.publisher = publisher;
		self.parent = parent;
		self.publisherInstanceCount = publisher.instanceCount;
	}, {
		displayName : "core/pubsub/topic",

		/**
		 * Traces topic origin to root
		 * @returns String representation of all topics traced down to root
		 */
		trace : function trace() {
			var current = this;
			var constructor = current.constructor;
			var parent;
			var item;
			var stack = "";
			var i;
			var u;
			var iMax;

			while (current) {
				if (TOSTRING.call(current) === TOSTRING_ARRAY) {
					u = unique.call(current, comparator);

					for (i = 0, iMax = u.length; i < iMax; i++) {
						item = u[i];

						u[i] = item.constructor === constructor
							? item.trace()
							: item.topic;
					}

					stack += u.join(",");
					break;
				}

				parent = current.parent;
				stack += parent
					? current.publisher + ":"
					: current.publisher;
				current = parent;
			}

			return stack;
		}
	});

	/**
	 * Generates string representation of this object
	 * @returns Instance topic
	 */
	Topic.prototype.toString = function () {
		return this.topic;
	};

	return Topic;
});

/*!
 * TroopJS remote/ajax module
 * @license TroopJS Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/remote/ajax',[ "../component/service", "../pubsub/topic", "jquery", "troopjs-utils/merge" ], function AjaxModule(Service, Topic, $, merge) {
	return Service.extend({
		displayName : "core/remote/ajax",

		"hub/ajax" : function request(topic, settings, deferred) {
			// Request
			$.ajax(merge.call({
				"headers": {
					"x-request-id": new Date().getTime(),
					"x-components": topic instanceof Topic ? topic.trace() : topic
				}
			}, settings)).then(deferred.resolve, deferred.reject, deferred.notify);
		}
	});
});
