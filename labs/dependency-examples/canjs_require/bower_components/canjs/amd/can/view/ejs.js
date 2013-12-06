/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/view", "can/util/string", "can/compute", "can/view/scanner", "can/view/render"], function( can ) {
	// ## ejs.js
	// `can.EJS`  
	// _Embedded JavaScript Templates._

	// Helper methods.
	var extend = can.extend,
		EJS = function( options ) {
			// Supports calling EJS without the constructor
			// This returns a function that renders the template.
			if ( this.constructor != EJS ) {
				var ejs = new EJS(options);
				return function( data, helpers ) {
					return ejs.render(data, helpers);
				};
			}
			// If we get a `function` directly, it probably is coming from
			// a `steal`-packaged view.
			if ( typeof options == "function" ) {
				this.template = {
					fn: options
				};
				return;
			}
			// Set options on self.
			extend(this, options);
			this.template = this.scanner.scan(this.text, this.name);
		};

	can.EJS = EJS;

	/**
	 * @add can.EJS
	 * @prototype
	 */
	EJS.prototype.
	/**
	 * @function can.EJS.prototype.render render
	 * @parent can.EJS.prototype
	 * @description Render a view object with data and helpers.
	 * @signature `ejs.render(data[, helpers])`
	 * @param {Object} [data] The data to populate the template with.
	 * @param {Object.<String, function>} [helpers] Helper methods referenced in the template.
	 * @return {String} The template with interpolated data.
	 *
	 * @body	 
	 * Renders an object with view helpers attached to the view.
	 * 
	 *     var rendered = new can.EJS({text: "<h1><%= message %>"</h1>}).render({
	 *       message: "foo"
	 *     },{helper: function(){ ... }})
	 *     
	 *     console.log(rendered); // "<h1>foo</h1>"
	 */
	render = function( object, extraHelpers ) {
		object = object || {};
		return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
	};
	
	extend(EJS.prototype, {
		/**
		 * @hide
		 * Singleton scanner instance for parsing templates.
		 */
		scanner: new can.view.Scanner({
			text: {
				outStart: 'with(_VIEW) { with (_CONTEXT) {',
				outEnd: "}}",
				argNames: '_CONTEXT,_VIEW'
			},
			/**
			 * @hide
			 * An ordered token registry for the scanner.
			 * This needs to be ordered by priority to prevent token parsing errors.
			 * Each token is defined as: ["token-name", "string representation", "optional regexp override"]
			 */
			tokens: [
				["templateLeft", "<%%"], // Template
				["templateRight", "%>"], // Right Template
				["returnLeft", "<%=="], // Return Unescaped
				["escapeLeft", "<%="], // Return Escaped
				["commentLeft", "<%#"], // Comment
				["left", "<%"], // Run --- this is hack for now
				["right", "%>"], // Right -> All have same FOR Mustache ...
				["returnRight", "%>"]
			],
			helpers: [
			/**
			 * Check if its a func like `()->`.
			 * @param {String} content
			 */
				{
					name:/\s*\(([\$\w]+)\)\s*->([^\n]*)/,
					fn: function(content){
						var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
							parts = content.match(quickFunc);
		
						return "can.proxy(function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}, this);";
					}
				}],
			/**
			 * @hide
			 * Transforms the EJS template to add support for shared blocks.
			 * Essentially, this breaks up EJS tags into multiple EJS tags 
			 * if they contained unmatched brackets.
			 *
			 * For example, this doesn't work:
			 * 	<% if (1) { %><% if (1) { %> hi <% } } %>
			 * ...without isolated EJS blocks:
			 * 	<% if (1) { %><% if (1) { %> hi <% } %><% } %> 
			 * The result of transforming:
			 * 	<% if (1) { %><% %><% if (1) { %><% %> hi <% } %><% } %> 
			 */
			transform: function(source) {
				return source.replace(/<%([\s\S]+?)%>/gm, function(whole, part) {
					var brackets = [], 
						foundBracketPair, 
						i;

					// Look for brackets (for removing self-contained blocks)
					part.replace(/[{}]/gm, function(bracket, offset) {
						brackets.push([ bracket, offset ]);
					});

					// Remove bracket pairs from the list of replacements
					do {
						foundBracketPair = false;
						for (i = brackets.length - 2; i >= 0; i--) {
							if (brackets[i][0] == '{' && brackets[i+1][0] == '}') {
								brackets.splice(i, 2);
								foundBracketPair = true;
								break;
							}
						}
					} while (foundBracketPair);

					// Unmatched brackets found, inject EJS tags
					if (brackets.length >= 2) {
						var result = ['<%'],
							bracket,
							last = 0;
						for (i = 0; bracket = brackets[i]; i++) {
							result.push(part.substring(last, last = bracket[1]));
							if ((bracket[0] == '{' && i < brackets.length - 1) || (bracket[0] == '}' && i > 0)) {
								result.push(bracket[0] == '{' ? '{ %><% ' : ' %><% }');
							}
							else {
								result.push(bracket[0]);
							}
							++last;
						}
						result.push(part.substring(last), '%>');
						return result.join('');
					}
					// Otherwise return the original
					else {
						return '<%' + part + '%>';
					}
				});
			}
		})
	});

	EJS.Helpers = function( data, extras ) {
		this._data = data;
		this._extras = extras;
		extend(this, extras);
	};

	/**
	 * @page can.EJS.Helpers Helpers
	 * @parent can.EJS
	 *
	 * @body
	 * By adding functions to can.EJS.Helpers.prototype, those functions will be available in the
	 * views.
	 *
	 * The following helper converts a given string to upper case:
	 *
	 * 	can.EJS.Helpers.prototype.toUpper = function(params)
	 * 	{
	 * 		return params.toUpperCase();
	 * 	}
	 *
	 * Use it like this in any EJS template:
	 *
	 * 	<%= toUpper('javascriptmvc') %>
	 *
	 * To access the current DOM element return a function that takes the element as a parameter:
	 *
	 * 	can.EJS.Helpers.prototype.upperHtml = function(params)
	 * 	{
	 * 		return function(el) {
	 * 			$(el).html(params.toUpperCase());
	 * 		}
	 * 	}
	 *
	 * In your EJS view you can then call the helper on an element tag:
	 *
	 * 	<div <%= upperHtml('javascriptmvc') %>></div>
	 */
	EJS.Helpers.prototype = {
		// TODO Deprecated!!
		list : function(list, cb){
			
			can.each(list, function(item, i){
				cb(item, i, list)
			})
		},
		each: function(list, cb){
			// Normal arrays don't get live updated
			if (can.isArray(list)) {
				this.list(list, cb);
			}
			else {
				can.view.lists(list, cb);
			}
		}
	};

	// Options for `steal`'s build.
	can.view.register({
		suffix: "ejs",
		// returns a `function` that renders the view.
		script: function( id, src ) {
			return "can.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
				text: src,
				name: id
			}).template.out + " })";
		},
		renderer: function( id, text ) {
			return EJS({
				text: text,
				name: id
			});
		}
	});

	return can;
});