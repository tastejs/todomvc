/*! JsRender v1.0pre: http://github.com/BorisMoore/jsrender */
/*
* Optimized version of jQuery Templates, for rendering to string.
* Does not require jQuery, or HTML DOM
* Integrates with JsViews (http://github.com/BorisMoore/jsviews)
* Copyright 2012, Boris Moore
* Released under the MIT License.
*/
// informal pre beta commit counter: 26

(function(global, jQuery, undefined) {
	// global is the this object, which is window when running in the usual browser environment.
	"use strict";

	if (jQuery && jQuery.views || global.jsviews) { return; } // JsRender is already loaded

	//========================== Top-level vars ==========================

	var versionNumber = "v1.0pre",

		$, jsvStoreName, rTag, rTmplString,
//TODO	tmplFnsCache = {},
		delimOpenChar0 = "{", delimOpenChar1 = "{", delimCloseChar0 = "}", delimCloseChar1 = "}", linkChar = "^",
		FALSE = false, TRUE = true,

		rPath = /^(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
		//                                     object     helper    view  viewProperty pathTokens      leafToken

		rParams = /(\()(?=|\s*\()|(?:([([])\s*)?(?:([#~]?[\w$.^]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$.^]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*([)\]])([([]?))|(\s+)/g,
		//          lftPrn        lftPrn2                 path    operator err                                                eq          path2       prn    comma   lftPrn2   apos quot        rtPrn   prn2   space
		// (left paren? followed by (path? followed by operator) or (path followed by paren?)) or comma or apos or quot or right paren or space

		rNewLine = /\r?\n/g,
		rUnescapeQuotes = /\\(['"])/g,
		// escape quotes and \ character
		rEscapeQuotes = /([\\'"])/g,
		rBuildHash = /\x08(~)?([^\x08]+)\x08/g,
		rTestElseIf = /^if\s/,
		rFirstElem = /<(\w+)[>\s]/,
		rPrevElem = /<(\w+)[^>\/]*>[^>]*$/,
		rAttrEncode = /[<"'&]/g,
		rHtmlEncode = /[\x00<>"'&]/g,
		autoTmplName = 0,
		viewId = 0,
		charEntities = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\x00": "&#0;",
			"'": "&#39;",
			'"': "&#34;"
		},
		tmplAttr = "data-jsv-tmpl",
		fnDeclStr = "var j=j||" + (jQuery ? "jQuery." : "js") + "views,",
		slice = [].slice,

		$render = {},
		jsvStores = {
			template: {
				compile: compileTmpl
			},
			tag: {
				compile: compileTag
			},
			helper: {},
			converter: {}
		},

		// jsviews object ($.views if jQuery is loaded)
		$views = {
			jsviews: versionNumber,
			render: $render,
			View: View,
			settings: {
				delimiters: $viewsDelimiters,
				debugMode: TRUE,
				tryCatch: TRUE
			},
			sub: {
				// subscription, e.g. JsViews integration
				Error: JsViewsError,
				tmplFn: tmplFn,
				parse: parseParams,
				extend: $extend,
				error: error,
				syntaxError: syntaxError
//TODO			invoke: $invoke
			},
			_cnvt: convertVal,
			_tag: renderTag,

			// TODO provide better debug experience - e.g. support $.views.onError callback
			_err: function(e) {
				// Place a breakpoint here to intercept template rendering errors
				return $viewsSettings.debugMode ? ("Error: " + (e.message || e)) + ". " : '';
			}
		};

		function JsViewsError(message, object) {
			// Error exception type for JsViews/JsRender
			// Override of $.views.sub.Error is possible
			if (object && object.onError) {
				if (object.onError(message) === FALSE) {
					return;
				}
			}
			this.name = "JsRender Error";
			this.message = message || "JsRender error";
		}

		function $extend(target, source) {
			var name;
			target = target || {};
			for (name in source) {
				target[name] = source[name];
			}
			return target;
		}

//TODO		function $invoke() {
//			try {
//				return arguments[1].apply(arguments[0], arguments[2]);
//			}
//			catch(e) {
//				throw new $views.sub.Error(e, arguments[0]);
//			}
//		}

		(JsViewsError.prototype = new Error()).constructor = JsViewsError;

	//========================== Top-level functions ==========================

	//===================
	// jsviews.delimiters
	//===================

	function $viewsDelimiters(openChars, closeChars, link) {
		// Set the tag opening and closing delimiters and 'link' character. Default is "{{", "}}" and "^"
		// openChars, closeChars: opening and closing strings, each with two characters

		if (!$viewsSub.rTag || arguments.length) {
			delimOpenChar0 = openChars ? openChars.charAt(0) : delimOpenChar0; // Escape the characters - since they could be regex special characters
			delimOpenChar1 = openChars ? openChars.charAt(1) : delimOpenChar1;
			delimCloseChar0 = closeChars ? closeChars.charAt(0) : delimCloseChar0;
			delimCloseChar1 = closeChars ? closeChars.charAt(1) : delimCloseChar1;
			linkChar = link || linkChar;
			openChars = "\\" + delimOpenChar0 + "(\\" + linkChar + ")?\\" + delimOpenChar1;  // Default is "{^{"
			closeChars = "\\" + delimCloseChar0 + "\\" + delimCloseChar1;                   // Default is "}}"
			// Build regex with new delimiters
			//          tag    (followed by / space or })   or cvtr+colon or html or code
			rTag = "(?:(?:(\\w+(?=[\\/\\s\\" + delimCloseChar0 + "]))|(?:(\\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\\*)))"
				+ "\\s*((?:[^\\" + delimCloseChar0 + "]|\\" + delimCloseChar0 + "(?!\\" + delimCloseChar1 + "))*?)";

			// make rTag available to JsViews (or other components) for parsing binding expressions
			$viewsSub.rTag = rTag + ")";

			rTag = new RegExp(openChars + rTag + "(\\/)?|(?:\\/(\\w+)))" + closeChars, "g");

			// Default:    bind           tag       converter colon html     comment            code      params            slash   closeBlock
			//           /{(\^)?{(?:(?:(\w+(?=[\/\s}]))|(?:(\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\*)))\s*((?:[^}]|}(?!}))*?)(\/)?|(?:\/(\w+)))}}/g

			rTmplString = new RegExp("<.*>|([^\\\\]|^)[{}]|" + openChars + ".*" + closeChars);
			// rTmplString looks for html tags or { or } char not preceded by \\, or JsRender tags {{xxx}}. Each of these strings are considered NOT to be jQuery selectors
		}
		return [delimOpenChar0, delimOpenChar1, delimCloseChar0, delimCloseChar1, linkChar];
	}

	//=========
	// View.get
	//=========

	function getView(inner, type) { //view.get(inner, type)
		if (!type) {
			// view.get(type)
			type = inner;
			inner = undefined;
		}

		var views, i, l, found,
			view = this,
			root = !type || type === "root";
			// If type is undefined, returns root view (view under top view).

		if (inner) {
			// Go through views - this one, and all nested ones, depth-first - and return first one with given type.
			found = view.type === type ? view : undefined;
			if (!found) {
				views = view.views;
				if (view._.useKey) {
					for (i in views) {
						if (found = views[i].get(inner, type)) {
							break;
						}
					}
				} else for (i = 0, l = views.length; !found && i < l; i++) {
					found = views[i].get(inner, type);
				}
			}
		} else if (root) {
			// Find root view. (view whose parent is top view)
			while (view.parent.parent) {
				found = view = view.parent;
			}
		} else while (view && !found) {
			// Go through views - this one, and all parent ones - and return first one with given type.
			found = view.type === type ? view : undefined;
			view = view.parent;
		}
		return found;
	}

	function getIndex() {
		var view = this.get("item");
		return view ? view.index : undefined;
	}

	getIndex.depends = function(view) {
		return [view.get("item"), "index"];
	};

	//==========
	// View.hlp
	//==========

	function getHelper(helper) {
		// Helper method called as view.hlp(key) from compiled template, for helper functions or template parameters ~foo
		var wrapped,
			view = this,
			res = (view.ctx || {})[helper];

		res = res === undefined ? view.getRsc("helpers", helper) : res;

		if (res) {
			if (typeof res === "function") {
				wrapped = function() {
					// If it is of type function, we will wrap it so it gets called with view as 'this' context.
					// If the helper ~foo() was in a data-link expression, the view will have a 'temporary' linkCtx property too.
					// However note that helper functions on deeper paths will not have access to view and tagCtx.
					// For example, ~util.foo() will have the ~util object as 'this' pointer
					return res.apply(view, arguments);
				};
				$extend(wrapped, res);
			}
		}
		return wrapped || res;
	}

	//==============
	// jsviews._cnvt
	//==============

	function convertVal(converter, view, self, tagCtx, bindingPaths, text) {
		// self is template object or linkCtx object
		if (converter || bindingPaths) {
			var tmplConverter,
				linkCtx = !self.markup && self,
				tag = {
					_: {
						inline: !linkCtx
					},
					tagName:  converter + ":",
					tagCtx: tagCtx,
					flow: TRUE,
					_is: "tag"
				},
				args = tagCtx.args = slice.call(arguments, 5);

			tagCtx.view = view;
			tagCtx.bind = !!(linkCtx || bindingPaths);

			if (linkCtx) {
				linkCtx.tag = tag;
				tag.linkCtx = linkCtx;
				tagCtx.ctx = extendCtx(tagCtx.ctx, linkCtx.view.ctx);
			}
			tag.ctx = tagCtx.ctx || {};
			tagCtx.props = tagCtx.props || {};
			delete tagCtx.ctx;

			converter = converter !== "true" && converter; // If there is a convertBack but no convert, converter will be "true"

			if (converter && ((tmplConverter = view.getRsc("converters", converter)) || error("Unknown converter: {{"+ converter + ":"))) {
				// A call to {{cnvt: ... }} or {^{cnvt: ... }} or data-link="{cnvt: ... }"
				text = tmplConverter.apply(tag, args);
			}
			if (bindingPaths) {
				// A call to {^{: ... }} or {^{cnvt: ... }}
				bindingPaths = view.tmpl.bnds[bindingPaths-1];
				linkCtx.paths = bindingPaths;
				// Consider being able to switch off binding if parent view is not currently bound.

				view._.tag = tag; // Provide this tag on view, for addBindingMarkers^ on bound tags to add the tag
				// to view._.bnds, associated with the tag id, and for getting the tagCtx and linkCtx during
				// rendering, and so when rendering subsequent {{else}}, will be associated with this tag.
				//TODO does this work with nested elses and with {^{foo:...}} which also adds tag to view, for markerNodes.

				text = view._.onRender(text, view, TRUE);
	//Example:  text = '<script type="jsv123"></script>' + text + '<script type="jsv123/"></script>';
			}
		}
		return text;
	}

	//=============
	// jsviews._tag
	//=============

	function getResource(storeName, item) {
		var res,
			view = this,
			store = $views[storeName];

		res = store && store[item];
		while ((res === undefined) && view) {
			store = view.tmpl[storeName];
			res = store && store[item];
			view = view.parent;
		}
		return res;
	}

	function renderTag(tagName, parentView, self, content, tagCtx, bind) {
		// Called from within compiled template function, to render a template tag
		// Returns the rendered tag

		var ret, render, ctx, elses, tag, tags, attr,
			tmpl = self.markup && self,
			// self is either a template object (if rendering a tag) or a linkCtx object (if linking using a link tag)
			linkCtx = !tmpl && self,
			parentView_ = parentView._,
			parentTmpl = tmpl || parentView.tmpl,
			tagDef = parentView.getRsc("tags", tagName) || error("Unknown tag: {{"+ tagName + "}}"),
			args = tagCtx.args = arguments.length > 6 ? slice.call(arguments, 6) : [],
			props = tagCtx.props = tagCtx.props || {};

		tagCtx.view = parentView;
		tagCtx.ctx = extendCtx(tagCtx.ctx, parentView.ctx); // Extend parentView.ctx
		ctx = tagCtx.ctx || {};
		delete tagCtx.ctx;

		// Set the tmpl property to the content of the block tag, unless set as an override property on the tag
		tmpl = props.tmpl;
		content = content && parentTmpl.tmpls[content - 1];
		tmpl = tmpl || content || tagDef.template || undefined;
		tmpl = "" + tmpl === tmpl // if a string
			? parentView.getRsc("templates", tmpl) || $templates(tmpl)
			: tmpl;

		if (tagName === "else") {
			tag = parentView._.tag;
			// Switch current tagCtx of tag instance to this {{else ...}}
			elses = tag._.elses = tag._.elses || [];
			elses.push(tmpl);
			tagCtx.isElse = elses.length;
			render = tag.render;
		}

		tag = tag || linkCtx.tag;

		if (!tag) {
			if (tagDef.init) {
				// If the tag has not already been instantiated, we will create a new instance and add to the tags hash,
				// so ~tags.tagName will access the tag, even within the rendering of the template content of this tag
//	TODO provide error handling owned by the tag - using tag.onError
//			try {
					tag = new tagDef.init(tagCtx, linkCtx, ctx);
//				}
//				catch(e) {
//					tagDef.onError(e);
//				}
				// Set attr on linkCtx to ensure outputting to the correct target attribute.
				tag.attr = tag.attr || tagDef.attr || undefined; // Setting either linkCtx.attr or this.attr in the init() allows per-instance choice of target attrib.
			} else {
				// This is a simple tag declared as a function. We won't instantiate a specific tag constructor - just a standard instance object.
				tag = {
					// tag instance object if no init constructor
					render: tagDef.render,
					renderContent: renderContent
				};
			}
			tag._ = {
				parentTag: ctx.tag,
				tmpl: tmpl,
				inline: !linkCtx
			};
			if (linkCtx) {
				// Set attr on linkCtx to ensure outputting to the correct target attribute.
				linkCtx.attr = tag.attr = linkCtx.attr || tag.attr;
			}
		}
		if (!tag.flow) {
			// tags hash: tag.ctx.tags, merged with parentView.ctx.tags,
			tags = ctx.tags = parentView.ctx && extendCtx(ctx.tags, parentView.ctx.tags) || {};
			ctx.tag = tags[tagName] = tag;
		}
		// Provide tagCtx, linkCtx and ctx access from tag
		tag.tagCtx = tagCtx;
		tag.tagName = tagName;
		tag.ctx = ctx;
		tag._is = "tag";
		tag._.done = tagCtx.isElse ? tag._.done : FALSE; // If not an {{else}} this is a new
		tmpl = tmpl || tag._.tmpl;
		elses = tag._.elses;

//TODO The above works for initial rendering, but when refreshing {^{foo}} need also to associate with {{else}} tags. Use compilation to bind else content templates and expressions with the primary tag template and expression.

		parentView_.tag = tag;
		// Provide this tag on view, for addBindingMarkers on bound tags to add the tag to view._.bnds, associated with the tag id,
		// for getting the tagCtx and linkCtx during rendering, and so when rendering subsequent {{else}}, will be associated with this tag
		//TODO does this work with nested elses and with {^{foo:...}} which also adds tag to view, for markerNodes.

//		while (tmpl) {
			// If tagDef has a 'render' function, call it.
			// If the return result is undefined, return "", or, if a template (or content) is provided,
			// return the rendered template(using the current data);

			if (linkCtx) {
				linkCtx.tag = tag;
				tag.linkCtx = linkCtx;
			}
			if (render = render || tag.render) {
				ret = render.apply(tag, args);

//	TODO		ret = $invoke(tag, render, args);
			}
			ret = ret !== undefined
				? ret    // Return result of render function unless it is undefined, in which case return rendered template
				: tmpl
					// render template/content on the current data item
					? tag.renderContent()
					: ""; // No return value from render, and no template/content defined, so return ""

//			tmpl = (tag !== "else" && elses) ? (tagCtx.isElse = tagCtx.isElse || 0, elses[tagCtx.isElse++]) : undefined;
//}

		// If bind, for {^{tag ... }}, insert script marker nodes
		if (tag._.inline && (attr = tag.attr) && attr !== "html") {
			ret = attr === "text"
				? $converters.html(ret)
				: "";
		}

		return bind && parentView_.onRender ? parentView_.onRender(ret, parentView, bind) : ret;
	}

	//=================
	// View constructor
	//=================

	function View(context, type, parentView, data, template, key, onRender) {
		// Constructor for view object in view hierarchy. (Augmented by JsViews if JsViews is loaded)
		var views, parentView_,
			isArray = type === "array",
			self_ = {
				key: 0,
				useKey: isArray ? 0 : 1,
				id: "" + viewId++,
				onRender: onRender,
				bnd: {}
			},
			self = {
				data: data,
				tmpl: template,
				views: isArray ? [] : {},
				parent: parentView,
				ctx: context,
				type: type,
				// If the data is an array, this is an 'array view' with a views array for each child 'item view'
				// If the data is not an array, this is an 'item view' with a views 'map' object for any child nested views
				// ._.useKey is non zero if is not an 'array view' (owning a data array). Uuse this as next key for adding to child views map
				get: getView,
				getIndex: getIndex,
				getRsc: getResource,
				hlp: getHelper,
				_: self_
		};

		if (parentView) {
			views = parentView.views;
			parentView_ = parentView._;
			if (parentView_.useKey) {
				// Parent is an 'item view'. Add this view to its views object
				// self._key = is the key in the parent view map
				views[self_.key = "_" + parentView_.useKey++] = self;
			} else {
				// Parent is an 'array view'. Add this view to its views array
				views.splice(
					// self._.key = self.index - the index in the parent view array
					self_.key = self.index =
						key !== undefined
							? key
							: views.length,
				0, self);
			}
			// If no context was passed in, use parent context
			// If context was passed in, it should have been merged already with parent context
			self.ctx = context || parentView.ctx;
		}
		return self;
	}

	//=============
	// Registration
	//=============

	function compileChildResources(parentTmpl) {
		var storeName, resources, resourceName, settings, compile;
		for (storeName in jsvStores) {
			settings = jsvStores[storeName];
			if ((compile = settings.compile) && (resources = parentTmpl[storeName + "s"])) {
				for (resourceName in resources) {
					// compile child resource declarations (templates, tags, converters or helpers)
					resources[resourceName] = compile(resourceName, resources[resourceName], parentTmpl, storeName, settings);
				}
			}
		}
	}

	function compileTag(name, item, parentTmpl) {
		var init, tmpl;
		if (typeof item === "function") {
			// Simple tag declared as function. No presenter instantation.
			item = {
				depends: item.depends,
				render: item
			};
		} else {
			// Tag declared as object, used as the prototype for tag instantiation (control/presenter)
			if (tmpl = item.template) {
				item.template = "" + tmpl === tmpl ? ($templates[tmpl] || $templates(tmpl)) : tmpl;
			}
			if (item.init !== FALSE) {
				init = item.init = item.init || function(tagCtx) {};
				init.prototype = item;
				(init.prototype = item).constructor = init;
			}
		}
		item.renderContent = renderContent;
		if (parentTmpl) {
			item._parentTmpl = parentTmpl;
		}
//TODO	item.onError = function(e) {
//			var error;
//			if (error = this.prototype.onError) {
//				error.call(this, e);
//			} else {
//				throw e;
//			}
//		}
		return item;
	}

	function compileTmpl(name, tmpl, parentTmpl, storeName, storeSettings, options) {
		// tmpl is either a template object, a selector for a template script block, the name of a compiled template, or a template object

		//==== nested functions ====
		function tmplOrMarkupFromStr(value) {
			// If value is of type string - treat as selector, or name of compiled template
			// Return the template object, if already compiled, or the markup string

			if (("" + value === value) || value.nodeType > 0) {
				try {
					elem = value.nodeType > 0
					? value
					: !rTmplString.test(value)
					// If value is a string and does not contain HTML or tag content, then test as selector
						&& jQuery && jQuery(global.document).find(value)[0];
					// If selector is valid and returns at least one element, get first element
					// If invalid, jQuery will throw. We will stay with the original string.
				} catch (e) {}

				if (elem) {
					// Generally this is a script element.
					// However we allow it to be any element, so you can for example take the content of a div,
					// use it as a template, and replace it by the same content rendered against data.
					// e.g. for linking the content of a div to a container, and using the initial content as template:
					// $.link("#content", model, {tmpl: "#content"});

					value = elem.getAttribute(tmplAttr);
					name = name || value;
					value = $templates[value];
					if (!value) {
						// Not already compiled and cached, so compile and cache the name
						// Create a name for compiled template if none provided
						name = name || "_" + autoTmplName++;
						elem.setAttribute(tmplAttr, name);
						value = $templates[name] = compileTmpl(name, elem.innerHTML, parentTmpl, storeName, storeSettings, options); // Use tmpl as options
					}
				}
				return value;
			}
			// If value is not a string, return undefined
		}

		var tmplOrMarkup, elem;

		//==== Compile the template ====
		tmpl = tmpl || "";
		tmplOrMarkup = tmplOrMarkupFromStr(tmpl);

		// If options, then this was already compiled from a (script) element template declaration.
		// If not, then if tmpl is a template object, use it for options
		options = options || (tmpl.markup ? tmpl : {});
		options.tmplName = name;
		if (parentTmpl) {
			options._parentTmpl = parentTmpl;
		}
		// If tmpl is not a markup string or a selector string, then it must be a template object
		// In that case, get it from the markup property of the object
		if (!tmplOrMarkup && tmpl.markup && (tmplOrMarkup = tmplOrMarkupFromStr(tmpl.markup))) {
			if (tmplOrMarkup.fn && (tmplOrMarkup.debug !== tmpl.debug || tmplOrMarkup.allowCode !== tmpl.allowCode)) {
				// if the string references a compiled template object, but the debug or allowCode props are different, need to recompile
				tmplOrMarkup = tmplOrMarkup.markup;
			}
		}
		if (tmplOrMarkup !== undefined) {
			if (name && !parentTmpl) {
				$render[name] = function() {
					return tmpl.render.apply(tmpl, arguments);
				};
			}
			if (tmplOrMarkup.fn || tmpl.fn) {
				// tmpl is already compiled, so use it, or if different name is provided, clone it
				if (tmplOrMarkup.fn) {
					if (name && name !== tmplOrMarkup.tmplName) {
						tmpl = extendCtx(options, tmplOrMarkup);
					} else {
						tmpl = tmplOrMarkup;
					}
				}
			} else {
				// tmplOrMarkup is a markup string, not a compiled template
				// Create template object
				tmpl = TmplObject(tmplOrMarkup, options);
				// Compile to AST and then to compiled function
				tmplFn(tmplOrMarkup, tmpl);
			}
			compileChildResources(options);
			return tmpl;
		}
	}
	//==== /end of function compile ====

	function TmplObject(markup, options) {
		// Template object constructor
		var htmlTag,
			wrapMap = $viewsSettings.wrapMap || {},
			tmpl = $extend(
				{
					markup: markup,
					tmpls: [],
					links: {},
					bnds: [],
					render: renderContent
				},
				options
			);

		if (!options.htmlTag) {
			// Set tmpl.tag to the top-level HTML tag used in the template, if any...
			htmlTag = rFirstElem.exec(markup);
			tmpl.htmlTag = htmlTag ? htmlTag[1].toLowerCase() : "";
		}
		htmlTag = wrapMap[tmpl.htmlTag];
		if (htmlTag && htmlTag !== wrapMap.div) {
			// When using JsViews, we trim templates which are inserted into HTML contexts where text nodes are not rendered (i.e. not 'Phrasing Content').
			tmpl.markup = $.trim(tmpl.markup);
			tmpl._elCnt = TRUE; // element content model (no rendered text nodes), not phrasing content model
		}

		return tmpl;
	}

	function registerStore(storeName, storeSettings) {

		function theStore(name, item, parentTmpl) {
			// The store is also the function used to add items to the store. e.g. $.templates, or $.views.tags

			// For store of name 'thing', Call as:
			//    $.views.things(items[, parentTmpl]),
			// or $.views.things(name, item[, parentTmpl])

			var onStore, compile, itemName, thisStore;

			if (name && "" + name !== name && !name.nodeType && !name.markup) {
				// Call to $.views.things(items[, parentTmpl]),

				// Adding items to the store
				// If name is a map, then item is parentTmpl. Iterate over map and call store for key.
				for (itemName in name) {
					theStore(itemName, name[itemName], item);
				}
				return $views;
			}
			thisStore = parentTmpl ? parentTmpl[storeNames] = parentTmpl[storeNames] || {} : theStore;

			// Adding a single unnamed item to the store
			if (item === undefined) {
				item = name;
				name = undefined;
			}
			compile = storeSettings.compile;
			if (onStore = $viewsSub.onBeforeStoreItem) {
				// e.g. provide an external compiler or preprocess the item.
				compile = onStore(thisStore, name, item, compile) || compile;
			}
			if (!name) {
				item = compile(undefined, item);
			} else if ("" + name === name) { // name must be a string
				if (item === null) {
					// If item is null, delete this entry
					delete thisStore[name];
				} else {
					thisStore[name] = compile ? (item = compile(name, item, parentTmpl, storeName, storeSettings)) : item;
				}
			}
			if (item) {
				item._is = storeName;
			}
			if (onStore = $viewsSub.onStoreItem) {
				// e.g. JsViews integration
				onStore(thisStore, name, item, compile);
			}
			return item;
		}

		var storeNames = storeName + "s";

		$views[storeNames] = theStore;
		jsvStores[storeName] = storeSettings;
	}

	//==============
	// renderContent
	//==============

	function renderContent(data, context, parentView, key, isLayout, onRender) {
		// Render template against data as a tree of subviews (nested rendered template instances), or as a string (top-level template).
		// If the data is the parent view, treat as layout template, re-render with the same data context.
		var i, l, dataItem, newView, childView, itemResult, props, swapContent, tagCtx, tag_, outerOnRender, tmplName,
			self = this,
			tmpl = self,
			allowDataLink = !self.attr || self.attr === "html",
			result = "";

		if (key === TRUE) {
			swapContent = TRUE;
			key = 0;
		}
		if (self._is === "tag") {
			tag_ = self._;
			tmplName = self.tagName;
			tagCtx = self.tagCtx;
			// This is a call from renderTag
			tmpl = tagCtx.isElse ? tag_.elses[tagCtx.isElse-1] : tag_.tmpl;
			context = extendCtx(context, self.ctx);
			props = tagCtx.props;
			if ( props.link === FALSE ) {
				// link=false setting on block tag
				// We will override inherited value of link by the explicit setting link=false taken from props
				// The child views of an unlinked view are also unlinked. So setting child back to true will not have any effect.
				context =  context || {};
				context.link = FALSE;
			}
			parentView = parentView || tagCtx.view;
			data = data === undefined ?  parentView : data;
		} else {
			tmpl = self.jquery && (self[0] || error('Unknown template: "' + self.selector + '"')) // This is a call from $(selector).render
				|| self;
		}
		if (tmpl) {
			if (parentView) {
				onRender = onRender || parentView._.onRender;
				if (data === parentView) {
					// Inherit the data from the parent view.
					// This may be the contents of an {{if}} block
					// Set isLayout = true so we don't iterate the if block if the data is an array.
					data = parentView.data;
					isLayout = TRUE;
				}
				context = extendCtx(context, parentView.ctx);
			} else {
				(context = context || {}).root = data; // Provide ~root as shortcut to top-level data.
			}

			// Set additional context on views created here, (as modified context inherited from the parent, and to be inherited by child views)
			// Note: If no jQuery, $extend does not support chained copies - so limit extend() to two parameters

			if (!tmpl.fn) {
				tmpl = $templates[tmpl] || $templates(tmpl);
			}

			if (tmpl) {
				onRender = (context && context.link) !== FALSE && allowDataLink && onRender;
				// If link===false, do not call onRender, so no data-linking marker nodes
				outerOnRender = onRender;
				if (onRender === TRUE) {
					// Used by view.refresh(). Don't create a new wrapper view.
					outerOnRender = undefined;
					onRender = parentView._.onRender;
				}
				if ($.isArray(data) && !isLayout) {
					// Create a view for the array, whose child views correspond to each data item. (Note: if key and parentView are passed in
					// along with parent view, treat as insert -e.g. from view.addViews - so parentView is already the view item for array)
					newView = swapContent ? parentView : (key !== undefined && parentView) || View(context, "array", parentView, data, tmpl, key, onRender);
					for (i = 0, l = data.length; i < l; i++) {
						// Create a view for each data item.
						dataItem = data[i];
						childView = View(context, "item", newView, dataItem, tmpl, (key || 0) + i, onRender);
						itemResult = tmpl.fn(dataItem, childView, $views);
						result += newView._.onRender ? newView._.onRender(itemResult, childView) : itemResult;
					}
				} else {
					// Create a view for singleton data object. The type of the view will be the tag name, e.g. "if" or "myTag" except for
					// "item", "array" and "data" views. A "data" view is from programatic render(object) against a 'singleton'.
					newView = swapContent ? parentView : View(context, tmplName||"data", parentView, data, tmpl, key, onRender);
					if (tag_ && !self.flow) {
						newView.tag = self;
					}
					result += tmpl.fn(data, newView, $views);
				}
				return outerOnRender ? outerOnRender(result, newView) : result;
			}
		}
		return "";
	}

	//===========================
	// Build and compile template
	//===========================

	// Generate a reusable function that will serve to render a template against data
	// (Compile AST then build template function)

	function error(message) {
		if ($viewsSettings.debugMode) {
			throw new $views.sub.Error(message);
		}
	}

	function syntaxError(message) {
		error("Syntax error\n" + message);
	}

	function tmplFn(markup, tmpl, isLinkExpression, convertBack) {
		// Compile markup to AST (abtract syntax tree) then build the template function code from the AST nodes
		// Used for compiling templates, and also by JsViews to build functions for data link expressions


		//==== nested functions ====
		function pushprecedingContent(shift) {
			shift -= loc;
			if (shift) {
				content.push(markup.substr(loc, shift).replace(rNewLine, "\\n"));
			}
		}

		function blockTagCheck(tagName) {
			tagName && syntaxError('Unmatched or missing tag: "{{/' + tagName + '}}" in template:\n' + markup);
		}

		function parseTag(all, bind, tagName, converter, colon, html, comment, codeTag, params, slash, closeBlock, index) {

			//    bind         tag        converter colon html     comment            code      params            slash   closeBlock
			// /{(\^)?{(?:(?:(\w+(?=[\/\s}]))|(?:(\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\*)))\s*((?:[^}]|}(?!}))*?)(\/)?|(?:\/(\w+)))}}/g
			// Build abstract syntax tree (AST): [ tagName, converter, params, content, hash, bindings, contentMarkup ]
			if (html) {
				colon = ":";
				converter = "html";
			}
			var noError, current0,
				pathBindings = [],
				code = "",
				hash = "",
				passedCtx = "",
				// Block tag if not self-closing and not {{:}} or {{>}} (special case) and not a data-link expression
				block = !slash && !colon && !comment && !isLinkExpression;

			//==== nested helper function ====
			tagName = tagName || colon;
			pushprecedingContent(index);
			loc = index + all.length; // location marker - parsed up to here
			if (codeTag) {
				if (allowCode) {
					content.push(["*", "\n" + params.replace(rUnescapeQuotes, "$1") + "\n"]);
				}
			} else if (tagName) {
				if (tagName === "else") {
					if (rTestElseIf.test(params)) {
						syntaxError('for "{{else if expr}}" use "{{else expr}}"');
					}
					current[7] = markup.substring(current[7], index); // contentMarkup for block tag
					current = stack.pop();
					content = current[3];
					block = TRUE;
				}
				if (params) {
					params = params.replace(/\s*\n\s*/g, " "); // remove newlines from the params string, to avoid compiled code errors for unterminated strings
					code = parseParams(params, pathBindings)
						.replace(rBuildHash, function(all, isCtx, keyValue) {
							if (isCtx) {
								passedCtx += keyValue + ",";
							} else {
								hash += keyValue + ",";
							}
							return "";
						});
				}
				hash = hash.slice(0, -1);
				code = code.slice(0, -1);
				noError = hash && (hash.indexOf("noerror:true") + 1) && hash || "";

				newNode = [
						tagName,
						converter || !!convertBack || "",
						code,
						block && [],
						"{" + (hash ? ("props:" + (noError ? "hsh": "{" + hash + "}")
							+ ",") : "") + 'params:"' + params + '"' + (passedCtx ? ",ctx:{" + passedCtx.slice(0, -1) + "}" : "") + "},",
						noError,
						//"{" + (hash ? ("props:{" + hash + "},") : "") + 'params:"' + params + '"' + (passedCtx ? ",ctx:{" + passedCtx.slice(0, -1) + "}" : "") + "},",
						bind && pathBindings || 0
//						(bind || hash || code.indexOf(",")+1) && pathBindings || 0
					];
				content.push(newNode);
				if (block) {
					stack.push(current);
					current = newNode;
					current[7] = loc; // Store current location of open tag, to be able to add contentMarkup when we reach closing tag
				}
			} else if (closeBlock) {
				current0 = current[0];
				blockTagCheck(closeBlock !== current0 && current0 && current0 !== "else");
				current[7] = markup.substring(current[7], index); // contentMarkup for block tag
				current = stack.pop();
			}
			blockTagCheck(!current && closeBlock);
			content = current[3];
		}
		//==== /end of nested functions ====

		var newNode,
			allowCode = tmpl && tmpl.allowCode,
			astTop = [],
			loc = 0,
			stack = [],
			content = astTop,
			current = [, , , astTop];

		markup = markup.replace(rEscapeQuotes, "\\$1");

//TODO	result = tmplFnsCache[markup];  // Only cache if template is not named and markup length < ..., and there are no bindings or subtemplates?? Consider standard optimization for data-link="a.b.c"
//		if (result) {
//			tmpl.fn = result;
//		} else {

//		result = markup;

		blockTagCheck(stack[0] && stack[0][3].pop()[0]);

		// Build the AST (abstract syntax tree) under astTop
		markup.replace(rTag, parseTag);

		pushprecedingContent(markup.length);

		if (loc = astTop[astTop.length-1]) {
			blockTagCheck("" + loc !== loc && (+loc[7] === loc[7]) && loc[0]);
		}
//			result = tmplFnsCache[markup] = buildCode(astTop, tmpl);
//		}
		return buildCode(astTop, tmpl);
	}

	function buildCode(ast, tmpl) {
		// Build the template function code from the AST nodes, and set as property on the passed-in template object
		// Used for compiling templates, and also by JsViews to build functions for data link expressions
		var ret, i, node, hasTag, noError, hasEncoder, getsValue, hasConverter, hasViewPath, tagName, converter, params, hash, bindings, bindingPaths, nestedTmpls, nestedTmpl, allowCode, content, markup,
			code = "",
			tmplOptions = {},
			l = ast.length;

		if (tmpl) {
			if (allowCode = tmpl.allowCode) {
				tmplOptions.allowCode = TRUE;
			}
			if (tmpl.debug) {
				tmplOptions.debug = TRUE;
			}
			bindings = tmpl.bnds;
			nestedTmpls = tmpl.tmpls;
		}

		for (i = 0; i < l; i++) {
			// AST nodes: [ tagName, converter, params, content, hash, bindings, contentMarkup, link ]
			node = ast[i];

			// Add newline for each callout to t() c() etc. and each markup string
			ret = "";
			if ("" + node === node) {
				// a markup string to be inserted
				ret = 'ret+="' + node + '";';
			} else {
				// a compiled tag expression to be inserted
				tagName = node[0];
				if (tagName === "*") {
					// Code tag: {{* }}
					ret = "" + node[1];
				} else {
					converter = node[1];
					params = node[2];
					content = node[3];
					hash = node[4];
					noError = node[5];
					bindingPaths = node[6];
					markup = node[7];

					if (content) {
						// Create template object for nested template
						nestedTmpl = TmplObject(markup, tmplOptions);
						// Compile to AST and then to compiled function
						buildCode(content, nestedTmpl);
						nestedTmpls.push(nestedTmpl);
					}
					if (bindingPaths) {
						// Add leaf binding paths to template
						bindings.push(bindingPaths);
						bindingPaths = bindings.length;
					}
					hasViewPath = hasViewPath || hash.indexOf("view") > -1;
					// Add newline for each callout to t() c() etc.

					//TODO consider passing in ret to c() and t() so they can look at the previous ret, and detect whether this is a jsrender tag _within_an_HTML_element_tag_
					// and if so, don't insert marker nodes, add data-link attributes to the HTML element markup... No need for people to set link=false.

					if (noError) {
						// If the tag includes noerror=true, we will do a try catch around expressions for named or unnamed parameters
						// passed to the tag, and return the empty string for each expression if it throws during evaluation
						// TODO perhaps support noerror=xxx and return the value of the expression xxx||'', rather than always the empty string
						noError = "try{prm=" + params + ";hsh={" + noError + '};}catch(e){prm="";hsh={};}\n';
						params = "prm";
					}

					ret += noError + "ret+=" + (tagName === ":"
						? (converter === "html" && !bindingPaths
							? (hasEncoder = TRUE, "h(" + params+ ");")
							: converter || bindingPaths // Call _cnvt if there is a converter, or binding: {{cnvt: ... }}, {^{: ... }} or {^{cnvt: ... }}
								? (hasConverter = TRUE, 'c("' + converter + '",view,this,' + hash + bindingPaths + "," + params + ");")
								: (getsValue = TRUE, "(v=" + params + ')!=u?v:"";')
						)
						: (hasTag = TRUE, 't("' + tagName + '",view,this,'
							+ (content ? nestedTmpls.length : '""') // For block tags, pass in the key (nestedTmpls.length) to the nested content template
							+ "," + hash + bindingPaths + (params ? "," : "") + params) + ");");
				}
			}
			code += "\n" + ret;
		}

		// Include only the var references that are needed in the code
		code = fnDeclStr
		+ (noError? "prm,hsh," : "")
		+ (getsValue ? "v," : "")
		+ (hasTag ? "t=j._tag," : "")
		+ (hasConverter ? "c=j._cnvt," : "")
		+ (hasEncoder ? "h=j.converters.html," : "")
		+ 'ret="";\n'
		+ ($viewsSettings.tryCatch ? "try{\n" : "")
		+ (tmplOptions.debug ? "debugger;" : "")
		+ code + "\nreturn ret;\n"
		+ ($viewsSettings.tryCatch ? "\n}catch(e){return j._err(e);}" : "");

		try {
			code = new Function("data, view, j, u", code);
		} catch (e) {
			syntaxError("Compiled template code:\n\n" + code, e);
		}

		if (tmpl) {
			tmpl.fn = code;
		}
		return code;
	}

	function parseParams(params, bindings) {

		function parseTokens(all, lftPrn0, lftPrn, path, operator, err, eq, path2, prn, comma, lftPrn2, apos, quot, rtPrn, prn2, space) {
			// rParams = /(\()(?=|\s*\()|(?:([([])\s*)?(?:([#~]?[\w$^.]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$^.]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*([)\]])([([]?))|(\s+)
			//          lftPrn0-flwed by (- lftPrn               path    operator err                                                eq         path2       prn    comma   lftPrn3   apos quot        rtPrn   prn2   space
			// (left paren? followed by (path? followed by operator) or (path followed by paren?)) or comma or apos or quot or right paren or space
			operator = operator || "";
			lftPrn = lftPrn || lftPrn0 || lftPrn2;
			path = path || path2;
			prn = prn || prn2 || "";

			function parsePath(all, object, helper, view, viewProperty, pathTokens, leafToken) {
				// rPath = /^(?:null|true|false|\d[\d.]*|([\w$]+|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
				//                                        object   helper    view  viewProperty pathTokens       leafToken

				if (object) {
					bindings.push(path);
					if (object !== ".") {
						var leaf,
							ret = (helper
								? 'view.hlp("' + helper + '")'
								: view
									? "view"
									: "data")
							+ (leafToken
								? (viewProperty
									? "." + viewProperty
									: helper
										? ""
										: (view ? "" : "." + object)
									) + (pathTokens || "")
								: (leafToken = helper ? "" : view ? viewProperty || "" : object, ""));

						leaf = (leafToken ? "." + leafToken : "");
						ret = ret + leaf;
						ret = ret.slice(0, 9) === "view.data"
						? ret.slice(5) // convert #view.data... to data...
						: ret;
						return ret;
					}
				}
				return all;
			}

			if (err) {
				syntaxError(params);
			} else {
				return (aposed
					// within single-quoted string
					? (aposed = !apos, (aposed ? all : '"'))
					: quoted
					// within double-quoted string
						? (quoted = !quot, (quoted ? all : '"'))
						:
					(
						(lftPrn
								? (parenDepth++, lftPrn)
								: "")
						+ (space
							? (parenDepth
								? ""
								: named
									? (named = FALSE, "\b")
									: ","
							)
							: eq
					// named param
					// Insert backspace \b (\x08) as separator for named params, used subsequently by rBuildHash
								? (parenDepth && syntaxError(params), named = TRUE, '\b' + path + ':')
								: path
					// path
									? (path.split("^").join(".").replace(rPath, parsePath)
										+ (prn
											? (fnCall[++parenDepth] = TRUE, prn)
											: operator)
									)
									: operator
										? operator
										: rtPrn
					// function
											? ((fnCall[parenDepth--] = FALSE, rtPrn)
												+ (prn
													? (fnCall[++parenDepth] = TRUE, prn)
													: "")
											)
											: comma
												? (fnCall[parenDepth] || syntaxError(params), ",") // We don't allow top-level literal arrays or objects
												: lftPrn0
													? ""
													: (aposed = apos, quoted = quot, '"')
					))
				);
			}
		}
		var named,
			fnCall = {},
			parenDepth = 0,
			quoted = FALSE, // boolean for string content in double quotes
			aposed = FALSE; // or in single quotes

		bindings.expr = params.replace(rUnescapeQuotes, "$1");
		return (params + " ").replace(rParams, parseTokens);
	}

	//==========
	// Utilities
	//==========

	// Merge objects, in particular contexts which inherit from parent contexts
	function extendCtx(context, parentContext) {
		// Return copy of parentContext, unless context is defined and is different, in which case return a new merged context
		// If neither context nor parentContext are undefined, return undefined
		return context && context !== parentContext
			? (parentContext
				? $extend($extend({}, parentContext), context)
				: context)
			: parentContext && $extend({}, parentContext);
	}

	//========================== Initialize ==========================

	for (jsvStoreName in jsvStores) {
		registerStore(jsvStoreName, jsvStores[jsvStoreName]);
	}

	var $templates = $views.templates,
		$converters = $views.converters,
		$helpers = $views.helpers,
		$tags = $views.tags,
		$viewsSub = $views.sub,
		$viewsSettings = $views.settings;

	if (jQuery) {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// jQuery is loaded, so make $ the jQuery object
		$ = jQuery;
		$.render = $render;
		$.views = $views;
		$.templates = $templates = $views.templates;
		$.fn.render = renderContent;

	} else {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// jQuery is not loaded.

		$ = global.jsviews = $views;

		$.isArray = Array && Array.isArray || function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
	}

	//========================== Register tags ==========================

	$tags({
		"if": {
				render: function(val) {
				var self = this;
					// If not done and val is truey, set done=true on tag instance and render content. Otherwise return ""
					// On else will call this function again on the same tag instance.
				return (self._.done || arguments.length && !val)
					? ""
					: (self._.done = true,
						// Test is satisfied, so render content on current context. Rather than return undefined
						// (which will render the tmpl/content on the current context but will iterate if it is an array),
						// we pass in the view. This ensures treating as a layout template - with no iteration
						self.renderContent());
			},
			flow: TRUE
		},
// Temporary fix for binding to {{if}}
//	"if": {
//		render: function(val) {
//			var self = this;
//			return (self._done || arguments.length && !val) ? "" : (self._done = true, self.renderContent());
//		}
//	},
		"else": function() {}, // Does nothing but ensures {{else}} tags are recognized as valid
		"for": {
			render: function() {
				var i, arg,
					self = this,
					tagCtx = self.tagCtx,
					result = "",
					args = arguments,
					done = 0,
					l = args.length;

				if (!l) {
					return tagCtx.done
						? ""
						: (tagCtx.done = TRUE,
							// Test is satisfied, so render content on current context. Rather than return undefined
							// (which will render the tmpl/content on the current context but will iterate if it is an array),
							// we pass in the view. This ensures treating as a layout template - with no iteration
							self.renderContent());
				}
				for (i = 0; i < l; i++) {
					arg = args[i];
					if (arg === undefined) {
						return "";
					} else {
						done += $.isArray(arg) ? arg.length : 1;
						result += self.renderContent(arg);
					}
				}
				tagCtx.done = done;
				return result;
			},
			flow: TRUE
		},
		"*": {
			render: function(value) {
				return value;
			},
			flow: TRUE
		}
	});

	//========================== Register global helpers ==========================

	//	$helpers({ // Global helper functions
	//		// TODO add any useful built-in helper functions
	//	});

	//========================== Register converters ==========================

	// Get character entity for HTML and Attribute encoding
	function getCharEntity(ch) {
		return charEntities[ch];
	}

	$converters({
		html: function(text) {
			// HTML encode: Replace < > & and ' and " by corresponding entities.
			return text != undefined ? String(text).replace(rHtmlEncode, getCharEntity) : "";
		},
		attr: function(text) {
			// Attribute encode: Replace < & ' and " by corresponding entities.
			return text != undefined ? String(text).replace(rAttrEncode, getCharEntity) : "";
		},
		url: function(text) {
			// TODO - support chaining {{attr|url:....}} to protect against injection attacks from url parameters containing " or '.
			// URL encoding helper.
			return text != undefined ? encodeURI(String(text)) : "";
		}
	});

	//========================== Define default delimiters ==========================
	$viewsDelimiters();

})(this, this.jQuery);
