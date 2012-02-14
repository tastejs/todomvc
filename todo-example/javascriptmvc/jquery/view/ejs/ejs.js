/*jslint evil: true */



steal.plugins('jquery/view', 'jquery/lang/rsplit').then(function( $ ) {
	var myEval = function(script){
			eval(script);
		},
		chop = function( string ) {
			return string.substr(0, string.length - 1);
		},
		rSplit = $.String.rsplit,
		extend = $.extend,
		isArray = $.isArray,
		clean = function( content ) {
				return content.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
		}
		// from prototype  http://www.prototypejs.org/
		escapeHTML = function(content){
			return content.replace(/&/g,'&amp;')
					.replace(/</g,'&lt;')
					.replace(/>/g,'&gt;')
					.replace(/"/g, '&#34;')
					.replace(/'/g, "&#39;");
		},
		EJS = function( options ) {
			//returns a renderer function
			if ( this.constructor != EJS ) {
				var ejs = new EJS(options);
				return function( data, helpers ) {
					return ejs.render(data, helpers);
				};
			}
			//so we can set the processor
			if ( typeof options == "function" ) {
				this.template = {};
				this.template.process = options;
				return;
			}
			//set options on self
			extend(this, EJS.options, options);
			this.template = compile(this.text, this.type, this.name);
		};
	/**
	 * @class jQuery.EJS
	 * 
	 * @plugin jquery/view/ejs
	 * @parent jQuery.View
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/view/ejs/ejs.js
	 * @test jquery/view/ejs/qunit.html
	 * 
	 * 
	 * Ejs provides <a href="http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/">ERB</a> 
	 * style client side templates.  Use them with controllers to easily build html and inject
	 * it into the DOM.
	 * 
	 * ###  Example
	 * 
	 * The following generates a list of tasks:
	 * 
	 * @codestart html
	 * &lt;ul>
	 * &lt;% for(var i = 0; i < tasks.length; i++){ %>
	 *     &lt;li class="task &lt;%= tasks[i].identity %>">&lt;%= tasks[i].name %>&lt;/li>
	 * &lt;% } %>
	 * &lt;/ul>
	 * @codeend
	 * 
	 * For the following examples, we assume this view is in <i>'views\tasks\list.ejs'</i>.
	 * 
	 * 
	 * ## Use
	 * 
	 * ### Loading and Rendering EJS:
	 * 
	 * You should use EJS through the helper functions [jQuery.View] provides such as:
	 * 
	 *   - [jQuery.fn.after after]
	 *   - [jQuery.fn.append append]
	 *   - [jQuery.fn.before before]
	 *   - [jQuery.fn.html html], 
	 *   - [jQuery.fn.prepend prepend],
	 *   - [jQuery.fn.replaceWith replaceWith], and 
	 *   - [jQuery.fn.text text].
	 * 
	 * or [jQuery.Controller.prototype.view].
	 * 
	 * ### Syntax
	 * 
	 * EJS uses 5 types of tags:
	 * 
	 *   - <code>&lt;% CODE %&gt;</code> - Runs JS Code.
	 *     For example:
	 *     
	 *         <% alert('hello world') %>
	 *     
	 *   - <code>&lt;%= CODE %&gt;</code> - Runs JS Code and writes the result into the result of the template.
	 *     For example:
	 *     
	 *         <h1><%= 'hello world' %></h1>
	 *        
	 *   - <code>&lt;%~ CODE %&gt;</code> - Runs JS Code and writes the _escaped_ result into the result of the template.
	 *     For example:
	 *     
	 *         <%~ 'hello world' %>
	 *         
	 *   - <code>&lt;%%= CODE %&gt;</code> - Writes <%= CODE %> to the result of the template.  This is very useful for generators.
	 *     
	 *         <%%= 'hello world' %>
	 *         
	 *   - <code>&lt;%# CODE %&gt;</code> - Used for comments.  This does nothing.
	 *     
	 *         <%# 'hello world' %>
	 *        
	 * ## Hooking up controllers
	 * 
	 * After drawing some html, you often want to add other widgets and plugins inside that html.
	 * View makes this easy.  You just have to return the Contoller class you want to be hooked up.
	 * 
	 * @codestart
	 * &lt;ul &lt;%= Mxui.Tabs%>>...&lt;ul>
	 * @codeend
	 * 
	 * You can even hook up multiple controllers:
	 * 
	 * @codestart
	 * &lt;ul &lt;%= [Mxui.Tabs, Mxui.Filler]%>>...&lt;ul>
	 * @codeend
	 * 
	 * <h2>View Helpers</h2>
	 * View Helpers return html code.  View by default only comes with 
	 * [jQuery.EJS.Helpers.prototype.view view] and [jQuery.EJS.Helpers.prototype.text text].
	 * You can include more with the view/helpers plugin.  But, you can easily make your own!
	 * Learn how in the [jQuery.EJS.Helpers Helpers] page.
	 * 
	 * @constructor Creates a new view
	 * @param {Object} options A hash with the following options
	 * <table class="options">
	 *     <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
	 *     <tr>
	 *      <td>url</td>
	 *      <td>&nbsp;</td>
	 *      <td>loads the template from a file.  This path should be relative to <i>[jQuery.root]</i>.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>text</td>
	 *      <td>&nbsp;</td>
	 *      <td>uses the provided text as the template. Example:<br/><code>new View({text: '&lt;%=user%>'})</code>
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>element</td>
	 *      <td>&nbsp;</td>
	 *      <td>loads a template from the innerHTML or value of the element.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>type</td>
	 *      <td>'<'</td>
	 *      <td>type of magic tags.  Options are '&lt;' or '['
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>name</td>
	 *      <td>the element ID or url </td>
	 *      <td>an optional name that is used for caching.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>cache</td>
	 *      <td>true in production mode, false in other modes</td>
	 *      <td>true to cache template.
	 *      </td>
	 *     </tr>
	 *     
	 *    </tbody></table>
	 */
	$.EJS = EJS;
	/** 
	 * @Prototype
	 */
	EJS.prototype = {
		constructor: EJS,
		/**
		 * Renders an object with extra view helpers attached to the view.
		 * @param {Object} object data to be rendered
		 * @param {Object} extra_helpers an object with additonal view helpers
		 * @return {String} returns the result of the string
		 */
		render: function( object, extraHelpers ) {
			object = object || {};
			this._extra_helpers = extraHelpers;
			var v = new EJS.Helpers(object, extraHelpers || {});
			return this.template.process.call(object, object, v);
		}
	};
	/* @Static */


	EJS.
	/**
	 * Used to convert what's in &lt;%= %> magic tags to a string
	 * to be inserted in the rendered output.
	 * 
	 * Typically, it's a string, and the string is just inserted.  However,
	 * if it's a function or an object with a hookup method, it can potentially be 
	 * be ran on the element after it's inserted into the page.
	 * 
	 * This is a very nice way of adding functionality through the view.
	 * Usually this is done with [jQuery.EJS.Helpers.prototype.plugin]
	 * but the following fades in the div element after it has been inserted:
	 * 
	 * @codestart
	 * &lt;%= function(el){$(el).fadeIn()} %>
	 * @codeend
	 * 
	 * @param {String|Object|Function} input the value in between the
	 * write majic tags: &lt;%= %>
	 * @return {String} returns the content to be added to the rendered
	 * output.  The content is different depending on the type:
	 * 
	 *   * string - a bac
	 *   * foo - bar
	 */
	text = function( input ) {
		if ( typeof input == 'string' ) {
			return input;
		}
		if ( input === null || input === undefined ) {
			return '';
		}
		var hook = 
			(input.hookup && function( el, id ) {
				input.hookup.call(input, el, id);
			}) 
			||
			(typeof input == 'function' && input)
			||
			(isArray(input) && function( el, id ) {
				for ( var i = 0; i < input.length; i++ ) {
					var stub;
					stub = input[i].hookup ? input[i].hookup(el, id) : input[i](el, id);
				}
			});
		if(hook){
			return "data-view-id='" + $.View.hookup(hook) + "'";
		}
		return input.toString ? input.toString() : "";
	};
	EJS.clean = function(text){
		//return sanatized text
		if(typeof text == 'string'){
			return escapeHTML(text)
		}else{
			return "";
		}
	}
	//returns something you can call scan on
	var scan = function(scanner, source, block ) {
		var source_split = rSplit(source, /\n/),
			i=0;
		for (; i < source_split.length; i++ ) {
			scanline(scanner,  source_split[i], block);
		}
		
	},
	scanline= function(scanner,  line, block ) {
		scanner.lines++;
		var line_split = rSplit(line, scanner.splitter),
			token;
		for ( var i = 0; i < line_split.length; i++ ) {
			token = line_split[i];
			if ( token !== null ) {
				block(token, scanner);
			}
		}
	},
	makeScanner = function(left, right){
		var scanner = {};
		extend(scanner, {
			left: left + '%',
			right: '%' + right,
			dLeft: left + '%%',
			dRight: '%%' + right,
			eeLeft : left + '%==',
			eLeft: left + '%=',
			cmnt: left + '%#',
			cleanLeft: left+"%~",
			scan : scan,
			lines : 0
		});
		scanner.splitter = new RegExp("(" + [scanner.dLeft, scanner.dRight, scanner.eeLeft, scanner.eLeft, scanner.cleanLeft,
		scanner.cmnt, scanner.left, scanner.right + '\n', scanner.right, '\n'].join(")|(").
			replace(/\[/g,"\\[").replace(/\]/g,"\\]") + ")");
		return scanner;
	},
	// compiles a template
	compile = function( source, left, name ) {
		source = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		//normalize line endings
		left = left || '<';
		var put_cmd = "___v1ew.push(",
			insert_cmd = put_cmd,
			buff = new EJS.Buffer(['var ___v1ew = [];'], []),
			content = '',
			put = function( content ) {
				buff.push(put_cmd, '"', clean(content), '");');
			},
			startTag = null,
			empty = function(){
				content = ''
			};
		
		scan( makeScanner(left, left === '[' ? ']' : '>') , 
			source||"", 
			function( token, scanner ) {
				// if we don't have a start pair
				if ( startTag === null ) {
					switch ( token ) {
					case '\n':
						content = content + "\n";
						put(content);
						buff.cr();
						empty();
						break;
					case scanner.left:
					case scanner.eLeft:
					case scanner.eeLeft:
					case scanner.cleanLeft:
					case scanner.cmnt:
						startTag = token;
						if ( content.length > 0 ) {
							put(content);
						}
						empty();
						break;

						// replace <%% with <%
					case scanner.dLeft:
						content += scanner.left;
						break;
					default:
						content +=  token;
						break;
					}
				}
				else {
					switch ( token ) {
					case scanner.right:
						switch ( startTag ) {
						case scanner.left:
							if ( content[content.length - 1] == '\n' ) {
								content = chop(content);
								buff.push(content, ";");
								buff.cr();
							}
							else {
								buff.push(content, ";");
							}
							break;
						case scanner.cleanLeft : 
							buff.push(insert_cmd, "(jQuery.EJS.clean(", content, ")));");
							break;
						case scanner.eLeft:
							buff.push(insert_cmd, "(jQuery.EJS.text(", content, ")));");
							break;
						case scanner.eeLeft:
							buff.push(insert_cmd, "(jQuery.EJS.text(", content, ")));");
							break;
						}
						startTag = null;
						empty();
						break;
					case scanner.dRight:
						content += scanner.right;
						break;
					default:
						content += token;
						break;
					}
				}
			})
		if ( content.length > 0 ) {
			// Should be content.dump in Ruby
			buff.push(put_cmd, '"', clean(content) + '");');
		}
		var template = buff.close(),
			out = {
				out : 'try { with(_VIEW) { with (_CONTEXT) {' + template + " return ___v1ew.join('');}}}catch(e){e.lineNumber=null;throw e;}"
			};
		//use eval instead of creating a function, b/c it is easier to debug
		myEval.call(out,'this.process = (function(_CONTEXT,_VIEW){' + out.out + '});\r\n//@ sourceURL='+name+".js");
		return out;
	};


	// a line and script buffer
	// we use this so we know line numbers when there
	// is an error.  
	// pre and post are setup and teardown for the buffer
	EJS.Buffer = function( pre_cmd, post ) {
		this.line = [];
		this.script = [];
		this.post = post;

		// add the pre commands to the first line
		this.push.apply(this, pre_cmd);
	};
	EJS.Buffer.prototype = {
		//need to maintain your own semi-colons (for performance)
		push: function() {
			this.line.push.apply(this.line, arguments);
		},

		cr: function() {
			this.script.push(this.line.join(''), "\n");
			this.line = [];
		},
		//returns the script too
		close: function() {
			var stub;

			if ( this.line.length > 0 ) {
				this.script.push(this.line.join(''));
				this.line = [];
			}

			stub = this.post.length && this.push.apply(this, this.post);

			this.script.push(";"); //makes sure we always have an ending /
			return this.script.join("");
		}

	};
	

	//type, cache, folder
	/**
	 * @attribute options
	 * Sets default options for all views
	 * <table class="options">
	 * <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
	 * <tr>
	 * <td>type</td>
	 * <td>'<'</td>
	 * <td>type of magic tags.  Options are '&lt;' or '['
	 * </td>
	 * </tr>
	 * <tr>
	 * <td>cache</td>
	 * <td>true in production mode, false in other modes</td>
	 * <td>true to cache template.
	 * </td>
	 * </tr>
	 * </tbody></table>
	 * 
	 */
	EJS.options = {
		type: '<',
		ext: '.ejs'
	};




	/**
	 * @class jQuery.EJS.Helpers
	 * @parent jQuery.EJS
	 * By adding functions to jQuery.EJS.Helpers.prototype, those functions will be available in the 
	 * views.
	 * @constructor Creates a view helper.  This function is called internally.  You should never call it.
	 * @param {Object} data The data passed to the view.  Helpers have access to it through this._data
	 */
	EJS.Helpers = function( data, extras ) {
		this._data = data;
		this._extras = extras;
		extend(this, extras);
	};
	/* @prototype*/
	EJS.Helpers.prototype = {
		/**
		 * Hooks up a jQuery plugin on.
		 * @param {String} name the plugin name
		 */
		plugin: function( name ) {
			var args = $.makeArray(arguments),
				widget = args.shift();
			return function( el ) {
				var jq = $(el);
				jq[widget].apply(jq, args);
			};
		},
		/**
		 * Renders a partial view.  This is deprecated in favor of <code>$.View()</code>.
		 */
		view: function( url, data, helpers ) {
			helpers = helpers || this._extras;
			data = data || this._data;
			return $.View(url, data, helpers); //new EJS(options).render(data, helpers);
		}
	};


	$.View.register({
		suffix: "ejs",
		//returns a function that renders the view
		script: function( id, src ) {
			return "jQuery.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
				text: src
			}).template.out + " })";
		},
		renderer: function( id, text ) {
			var ejs = new EJS({
				text: text,
				name: id
			});
			return function( data, helpers ) {
				return ejs.render.call(ejs, data, helpers);
			};
		}
	});
});