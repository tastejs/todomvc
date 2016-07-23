/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/view", "can/view/elements"], function (can, elements) {

	/**
	 * Helper(s)
	 */
	var newLine = /(\r|\n)+/g,
		// Escapes characters starting with `\`.
		clean = function (content) {
			return content.split('\\')
				.join('\\\\')
				.split('\n')
				.join('\\n')
				.split('"')
				.join('\\"')
				.split('\t')
				.join('\\t');
		},
		// Returns a tagName to use as a temporary placeholder for live content
		// looks forward ... could be slow, but we only do it when necessary
		getTag = function (tagName, tokens, i) {
			// if a tagName is provided, use that
			if (tagName) {
				return tagName;
			} else {
				// otherwise go searching for the next two tokens like "<",TAG
				while (i < tokens.length) {
					if (tokens[i] === '<' && elements.reverseTagMap[tokens[i + 1]]) {
						return elements.reverseTagMap[tokens[i + 1]];
					}
					i++;
				}
			}
			return '';
		}, bracketNum = function (content) {
			return content.split('{')
				.length - content.split('}')
				.length;
		}, myEval = function (script) {
			eval(script);
		},
		attrReg = /([^\s]+)[\s]*=[\s]*$/,
		// Commands for caching.
		startTxt = 'var ___v1ew = [];',
		finishTxt = 'return ___v1ew.join(\'\')',
		put_cmd = '___v1ew.push(\n',
		insert_cmd = put_cmd,
		// Global controls (used by other functions to know where we are).
		// Are we inside a tag?
		htmlTag = null,
		// Are we within a quote within a tag?
		quote = null,
		// What was the text before the current quote? (used to get the `attr` name)
		beforeQuote = null,
		// Whether a rescan is in progress
		rescan = null,
		getAttrName = function () {
			var matches = beforeQuote.match(attrReg);
			return matches && matches[1];
		},
		// Used to mark where the element is.
		status = function () {
			// `t` - `1`.
			// `h` - `0`.
			// `q` - String `beforeQuote`.
			return quote ? '\'' + getAttrName() + '\'' : htmlTag ? 1 : 0;
		},
		// returns the top of a stack
		top = function (stack) {
			return stack[stack.length - 1];
		},
		// characters that automatically mean a custom element
		automaticCustomElementCharacters = /[-\:]/,
		Scanner;

	/**
	 * @constructor can.view.Scanner
	 *
	 * can.view.Scanner is used to convert a template into a JavaScript function.  That
	 * function is called to produce a rendered result as a string. Often
	 * the rendered result will include data-view-id attributes on elements that
	 * will be processed after the template is used to create a document fragment.
	 *
	 *
	 * @param {{text: can.view.Scanner.text, tokens: Array<can.view.Scanner.token>, helpers: Array<can.view.Scanner.helpers>}}
	 */
	//
	/**
	 * @typedef {{0:String,}}
	 */

	can.view.Scanner = Scanner = function (options) {
		// Set options on self
		can.extend(this, {
			/**
			 * @typedef {{start: String, escape: String, scope: String, options: String}}  can.view.Scanner.text
			 */
			text: {},
			tokens: []
		}, options);
		// make sure it's an empty string if it's not
		this.text.options = this.text.options || '';
		// Cache a token lookup
		this.tokenReg = [];
		this.tokenSimple = {
			"<": "<",
			">": ">",
			'"': '"',
			"'": "'"
		};
		this.tokenComplex = [];
		this.tokenMap = {};
		for (var i = 0, token; token = this.tokens[i]; i++) {
			/**
			 * Token data structure (complex token and rescan function are optional):
			 * [
			 *	"token name",
			 *	"simple token or abbreviation",
			 *	/complex token regexp/,
			 *	function(content) {
			 *		// Rescan Function
			 *		return {
			 *			before: '\n',
			 *			content: content.trim(),
			 *			after: '\n'
			 *		}
			 * ]
			 */

			// Save complex mappings (custom regexp)
			if (token[2]) {
				this.tokenReg.push(token[2]);
				this.tokenComplex.push({
					abbr: token[1],
					re: new RegExp(token[2]),
					rescan: token[3]
				});
			}
			// Save simple mappings (string only, no regexp)
			else {
				this.tokenReg.push(token[1]);
				this.tokenSimple[token[1]] = token[0];
			}
			this.tokenMap[token[0]] = token[1];
		}

		// Cache the token registry.
		this.tokenReg = new RegExp("(" + this.tokenReg.slice(0)
			.concat(["<", ">", '"', "'"])
			.join("|") + ")", "g");
	};

	Scanner.attributes = {};
	Scanner.regExpAttributes = {};

	Scanner.attribute = function (attribute, callback) {
		if (typeof attribute === 'string') {
			Scanner.attributes[attribute] = callback;
		} else {
			Scanner.regExpAttributes[attribute] = {
				match: attribute,
				callback: callback
			};
		}
	};
	Scanner.hookupAttributes = function (options, el) {
		can.each(options && options.attrs || [], function (attr) {
			options.attr = attr;
			if (Scanner.attributes[attr]) {
				Scanner.attributes[attr](options, el);
			} else {
				can.each(Scanner.regExpAttributes, function (attrMatcher) {
					if (attrMatcher.match.test(attr)) {
						attrMatcher.callback(options, el);
					}
				});
			}
		});
	};
	Scanner.tag = function (tagName, callback) {
		// if we have html5shive ... re-generate
		if (window.html5) {
			window.html5.elements += ' ' + tagName;
			window.html5.shivDocument();
		}

		Scanner.tags[tagName.toLowerCase()] = callback;
	};
	Scanner.tags = {};
	// This is called when there is a special tag
	Scanner.hookupTag = function (hookupOptions) {
		// we need to call any live hookups
		// so get that and return the hook
		// a better system will always be called with the same stuff
		var hooks = can.view.getHooks();
		return can.view.hook(function (el) {
			can.each(hooks, function (fn) {
				fn(el);
			});

			var tagName = hookupOptions.tagName,
				helperTagCallback = hookupOptions.options.read('helpers._tags.' + tagName, {
					isArgument: true,
					proxyMethods: false
				})
					.value,
				tagCallback = helperTagCallback || Scanner.tags[tagName];

			// If this was an element like <foo-bar> that doesn't have a component, just render its content
			var scope = hookupOptions.scope,
				res = tagCallback ? tagCallback(el, hookupOptions) : scope;

		

			// If the tagCallback gave us something to render with, and there is content within that element
			// render it!
			if (res && hookupOptions.subtemplate) {

				if (scope !== res) {
					scope = scope.add(res);
				}
				var frag = can.view.frag(hookupOptions.subtemplate(scope, hookupOptions.options));
				can.appendChild(el, frag);
			}
			can.view.Scanner.hookupAttributes(hookupOptions, el);
		});
	};
	/**
	 * Extend can.View to add scanner support.
	 */
	Scanner.prototype = {
		// a default that can be overwritten
		helpers: [],

		scan: function (source, name) {
			var tokens = [],
				last = 0,
				simple = this.tokenSimple,
				complex = this.tokenComplex;
			var cleanedTagName;
			source = source.replace(newLine, '\n');
			if (this.transform) {
				source = this.transform(source);
			}
			source.replace(this.tokenReg, function (whole, part) {
				// offset is the second to last argument
				var offset = arguments[arguments.length - 2];

				// if the next token starts after the last token ends
				// push what's in between
				if (offset > last) {
					tokens.push(source.substring(last, offset));
				}

				// push the simple token (if there is one)
				if (simple[whole]) {
					tokens.push(whole);
				}
				// otherwise lookup complex tokens
				else {
					for (var i = 0, token; token = complex[i]; i++) {
						if (token.re.test(whole)) {
							tokens.push(token.abbr);
							// Push a rescan function if one exists
							if (token.rescan) {
								tokens.push(token.rescan(part));
							}
							break;
						}
					}
				}

				// update the position of the last part of the last token
				last = offset + part.length;
			});

			// if there's something at the end, add it
			if (last < source.length) {
				tokens.push(source.substr(last));
			}

			var content = '',
				buff = [startTxt + (this.text.start || '')],
				// Helper `function` for putting stuff in the view concat.
				put = function (content, bonus) {
					buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
				},
				// A stack used to keep track of how we should end a bracket
				// `}`.
				// Once we have a `<%= %>` with a `leftBracket`,
				// we store how the file should end here (either `))` or `;`).
				endStack = [],
				// The last token, used to remember which tag we are in.
				lastToken,
				// The corresponding magic tag.
				startTag = null,
				// Was there a magic tag inside an html tag?
				magicInTag = false,
				// was there a special state
				specialStates = {
					attributeHookups: [],
					// a stack of tagHookups
					tagHookups: [],
					//last tag hooked up
					lastTagHookup: ''
				},
				// Helper `function` for removing tagHookups from the hookup stack
				popTagHookup = function() {
					// The length of tagHookups is the nested depth which can be used to uniquely identify custom tags of the same type
					specialStates.lastTagHookup = specialStates.tagHookups.pop() + specialStates.tagHookups.length;
				},
				// The current tag name.
				tagName = '',
				// stack of tagNames
				tagNames = [],
				// Pop from tagNames?
				popTagName = false,
				// Declared here.
				bracketCount,
				// in a special attr like src= or style=
				specialAttribute = false,

				i = 0,
				token,
				tmap = this.tokenMap,
				attrName;

			// Reinitialize the tag state goodness.
			htmlTag = quote = beforeQuote = null;
			for (;
				(token = tokens[i++]) !== undefined;) {
				if (startTag === null) {
					switch (token) {
					case tmap.left:
					case tmap.escapeLeft:
					case tmap.returnLeft:
						magicInTag = htmlTag && 1;
						/* falls through */
					case tmap.commentLeft:
						// A new line -- just add whatever content within a clean.
						// Reset everything.
						startTag = token;
						if (content.length) {
							put(content);
						}
						content = '';
						break;
					case tmap.escapeFull:
						// This is a full line escape (a line that contains only whitespace and escaped logic)
						// Break it up into escape left and right
						magicInTag = htmlTag && 1;
						rescan = 1;
						startTag = tmap.escapeLeft;
						if (content.length) {
							put(content);
						}
						rescan = tokens[i++];
						content = rescan.content || rescan;
						if (rescan.before) {
							put(rescan.before);
						}
						tokens.splice(i, 0, tmap.right);
						break;
					case tmap.commentFull:
						// Ignore full line comments.
						break;
					case tmap.templateLeft:
						content += tmap.left;
						break;
					case '<':
						// Make sure we are not in a comment.
						if (tokens[i].indexOf('!--') !== 0) {
							htmlTag = 1;
							magicInTag = 0;
						}

						content += token;

						break;
					case '>':
						htmlTag = 0;
						// content.substr(-1) doesn't work in IE7/8
						var emptyElement = content.substr(content.length - 1) === '/' || content.substr(content.length - 2) === '--',
							attrs = '';
						// if there was a magic tag
						// or it's an element that has text content between its tags,
						// but content is not other tags add a hookup
						// TODO: we should only add `can.EJS.pending()` if there's a magic tag
						// within the html tags.
						if (specialStates.attributeHookups.length) {
							attrs = "attrs: ['" + specialStates.attributeHookups.join("','") + "'], ";
							specialStates.attributeHookups = [];
						}
						// this is the > of a special tag
						// comparison to lastTagHookup makes sure the same custom tags can be nested
						if ((tagName + specialStates.tagHookups.length) !== specialStates.lastTagHookup && tagName === top(specialStates.tagHookups)) {
							// If it's a self closing tag (like <content/>) make sure we put the / at the end.
							if (emptyElement) {
								content = content.substr(0, content.length - 1);
							}
							// Put the start of the end
							buff.push(put_cmd,
								'"', clean(content), '"',
								",can.view.Scanner.hookupTag({tagName:'" + tagName + "'," + (attrs) + "scope: " + (this.text.scope || "this") + this.text.options);

							// if it's a self closing tag (like <content/>) close and end the tag
							if (emptyElement) {
								buff.push("}));");
								content = "/>";
								popTagHookup();
							}
							// if it's an empty tag
							else if (tokens[i] === "<" && tokens[i + 1] === "/" + tagName) {
								buff.push("}));");
								content = token;
								popTagHookup();
							} else {
								// it has content
								buff.push(",subtemplate: function(" + this.text.argNames + "){\n" + startTxt + (this.text.start || ''));
								content = '';
							}
						} else if (magicInTag || !popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]] || attrs) {
							// make sure / of /> is on the right of pending
							var pendingPart = ",can.view.pending({" + attrs + "scope: " + (this.text.scope || "this") + this.text.options + "}),\"";
							if (emptyElement) {
								put(content.substr(0, content.length - 1), pendingPart + "/>\"");
							} else {
								put(content, pendingPart + ">\"");
							}
							content = '';
							magicInTag = 0;
						} else {
							content += token;
						}

						// if it's a tag like <input/>
						if (emptyElement || popTagName) {
							// remove the current tag in the stack
							tagNames.pop();
							// set the current tag to the previous parent
							tagName = tagNames[tagNames.length - 1];
							// Don't pop next time
							popTagName = false;
						}
						specialStates.attributeHookups = [];
						break;
					case "'":
					case '"':
						// If we are in an html tag, finding matching quotes.
						if (htmlTag) {
							// We have a quote and it matches.
							if (quote && quote === token) {
								// We are exiting the quote.
								quote = null;
								// Otherwise we are creating a quote.
								// TODO: does this handle `\`?
								var attr = getAttrName();
								if (Scanner.attributes[attr]) {
									specialStates.attributeHookups.push(attr);
								} else {
									can.each(Scanner.regExpAttributes, function (attrMatcher) {
										if (attrMatcher.match.test(attr)) {
											specialStates.attributeHookups.push(attr);
										}
									});
								}

								if (specialAttribute) {

									content += token;
									put(content);
									buff.push(finishTxt, "}));\n");
									content = "";
									specialAttribute = false;

									break;
								}

							} else if (quote === null) {
								quote = token;
								beforeQuote = lastToken;
								attrName = getAttrName();
								// TODO: check if there's magic!!!!
								if (tagName === 'img' && attrName === 'src' || attrName === 'style') {
									// put content that was before the attr name, but don't include the src=
									put(content.replace(attrReg, ""));
									content = '';
									specialAttribute = true;

									buff.push(insert_cmd, "can.view.txt(2,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt);
									put(attrName + "=" + token);
									break;
								}

							}
						}
						//default is meant to run on all cases
						/*falls through*/
					default:
						// Track the current tag
						if (lastToken === '<') {

							tagName = token.substr(0, 3) === "!--" ?
								"!--" : token.split(/\s/)[0];

							var isClosingTag = false;

							if (tagName.indexOf("/") === 0) {
								isClosingTag = true;
								cleanedTagName = tagName.substr(1);
							}

							if (isClosingTag) { // </tag>

								// when we enter a new tag, pop the tag name stack
								if (top(tagNames) === cleanedTagName) {
									// set tagName to the last tagName
									// if there are no more tagNames, we'll rely on getTag.
									tagName = cleanedTagName;
									popTagName = true;
								}
								// if we are in a closing tag of a custom tag
								if (top(specialStates.tagHookups) === cleanedTagName) {
									// remove the last < from the content
									put(content.substr(0, content.length - 1));

									// finish the "section"
									buff.push(finishTxt + "}}) );");
									// the < belongs to the outside
									content = "><";
									popTagHookup();
								}

							} else {
								if (tagName.lastIndexOf('/') === tagName.length - 1) {
									tagName = tagName.substr(0, tagName.length - 1);

								}

								if (tagName !== "!--" && (Scanner.tags[tagName] || automaticCustomElementCharacters.test(tagName))) {
									// if the content tag is inside something it doesn't belong ...
									if (tagName === 'content' && elements.tagMap[top(tagNames)]) {
										// convert it to an element that will work
										token = token.replace('content', elements.tagMap[top(tagNames)]);
									}
									// we will hookup at the ending tag>
									specialStates.tagHookups.push(tagName);
								}

								tagNames.push(tagName);

							}

						}
						content += token;
						break;
					}
				} else {
					// We have a start tag.
					switch (token) {
					case tmap.right:
					case tmap.returnRight:
						switch (startTag) {
						case tmap.left:
							// Get the number of `{ minus }`
							bracketCount = bracketNum(content);

							// We are ending a block.
							if (bracketCount === 1) {
								// We are starting on.
								buff.push(insert_cmd, 'can.view.txt(0,\'' + getTag(tagName, tokens, i) + '\',' + status() + ',this,function(){', startTxt, content);
								endStack.push({
									before: '',
									after: finishTxt + '}));\n'
								});
							} else {

								// How are we ending this statement?
								last = endStack.length && bracketCount === -1 ? endStack.pop() : {
									after: ';'
								};

								// If we are ending a returning block,
								// add the finish text which returns the result of the
								// block.
								if (last.before) {
									buff.push(last.before);
								}
								// Add the remaining content.
								buff.push(content, ';', last.after);
							}
							break;
						case tmap.escapeLeft:
						case tmap.returnLeft:
							// We have an extra `{` -> `block`.
							// Get the number of `{ minus }`.
							bracketCount = bracketNum(content);
							// If we have more `{`, it means there is a block.
							if (bracketCount) {
								// When we return to the same # of `{` vs `}` end with a `doubleParent`.
								endStack.push({
									before: finishTxt,
									after: '}));\n'
								});
							}

							var escaped = startTag === tmap.escapeLeft ? 1 : 0,
								commands = {
									insert: insert_cmd,
									tagName: getTag(tagName, tokens, i),
									status: status(),
									specialAttribute: specialAttribute
								};

							for (var ii = 0; ii < this.helpers.length; ii++) {
								// Match the helper based on helper
								// regex name value
								var helper = this.helpers[ii];
								if (helper.name.test(content)) {
									content = helper.fn(content, commands);

									// dont escape partials
									if (helper.name.source === /^>[\s]*\w*/.source) {
										escaped = 0;
									}
									break;
								}
							}

							// Handle special cases
							if (typeof content === 'object') {
								if (content.raw) {
									buff.push(content.raw);
								}
							} else if (specialAttribute) {
								buff.push(insert_cmd, content, ');');
							} else {
								// If we have `<%== a(function(){ %>` then we want
								// `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.
								buff.push(insert_cmd, "can.view.txt(\n" +
									(typeof status() === "string" || escaped) + ",\n'" +
									tagName + "',\n" +
									status() + ",\n" +
									"this,\nfunction(){ " +
									(this.text.escape || '') +
									"return ", content,
									// If we have a block.
									bracketCount ?
									// Start with startTxt `"var _v1ew = [];"`.
									startTxt :
									// If not, add `doubleParent` to close push and text.
									"}));\n");
							}

							if (rescan && rescan.after && rescan.after.length) {
								put(rescan.after.length);
								rescan = null;
							}
							break;
						}
						startTag = null;
						content = '';
						break;
					case tmap.templateLeft:
						content += tmap.left;
						break;
					default:
						content += token;
						break;
					}
				}
				lastToken = token;
			}

			// Put it together...
			if (content.length) {
				// Should be `content.dump` in Ruby.
				put(content);
			}
			buff.push(';');
			var template = buff.join(''),
				out = {
					out: (this.text.outStart || '') + template + ' ' + finishTxt + (this.text.outEnd || '')
				};
			// Use `eval` instead of creating a function, because it is easier to debug.
			myEval.call(out, 'this.fn = (function(' + this.text.argNames + '){' + out.out + '});\r\n//# sourceURL=' + name + '.js');
			return out;
		}
	};
	can.view.Scanner.tag('content', function (el, options) {
		return options.scope;
	});

	return Scanner;
});