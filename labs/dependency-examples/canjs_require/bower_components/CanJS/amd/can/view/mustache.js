/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/view', 'can/view/scanner', 'can/observe/compute', 'can/view/render'], function (can) {

    // # mustache.js
    // `can.Mustache`: The Mustache templating engine.
    // See the [Transformation](#section-29) section within *Scanning Helpers* for a detailed explanation 
    // of the runtime render code design. The majority of the Mustache engine implementation 
    // occurs within the *Transformation* scanning helper.
    // ## Initialization
    // Define the view extension.
    can.view.ext = ".mustache";

    // ### Setup internal helper variables and functions.
    // An alias for the context variable used for tracking a stack of contexts.
    // This is also used for passing to helper functions to maintain proper context.
    var CONTEXT = '___c0nt3xt',
        // An alias for the variable used for the hash object that can be passed
        // to helpers via `options.hash`.
        HASH = '___h4sh',
        // An alias for the function that adds a new context to the context stack.
        STACK = '___st4ck',
        STACKED = '___st4ck3d',
        // An alias for the most used context stacking call.
        CONTEXT_STACK = STACK + '(' + CONTEXT + ',this)',
        CONTEXT_OBJ = '{context:' + CONTEXT_STACK + ',options:options}',


        isObserve = function (obj) {
            return obj !== null && can.isFunction(obj.attr) && obj.constructor && !! obj.constructor.canMakeObserve;
        },


        isArrayLike = function (obj) {
            return obj && obj.splice && typeof obj.length == 'number';
        },

        // ## Mustache
        Mustache = function (options, helpers) {
            // Support calling Mustache without the constructor.
            // This returns a function that renders the template.
            if (this.constructor != Mustache) {
                var mustache = new Mustache(options);
                return function (data, options) {
                    return mustache.render(data, options);
                };
            }

            // If we get a `function` directly, it probably is coming from
            // a `steal`-packaged view.
            if (typeof options == "function") {
                this.template = {
                    fn: options
                };
                return;
            }

            // Set options on self.
            can.extend(this, options);
            this.template = this.scanner.scan(this.text, this.name);
        };


    // Put Mustache on the `can` object.
    can.Mustache = window.Mustache = Mustache;


    Mustache.prototype.

    render = function (object, options) {
        object = object || {};
        options = options || {};
        if (!options.helpers && !options.partials) {
            options.helpers = options;
        }
        return this.template.fn.call(object, object, {
            _data: object,
            options: options
        });
    };

    can.extend(Mustache.prototype, {
        // Share a singleton scanner for parsing templates.
        scanner: new can.view.Scanner({
            // A hash of strings for the scanner to inject at certain points.
            text: {
                // This is the logic to inject at the beginning of a rendered template. 
                // This includes initializing the `context` stack.
                start: 'var ' + CONTEXT + ' = this && this.' + STACKED + ' ? this : [];' + CONTEXT + '.' + STACKED + ' = true;' + 'var ' + STACK + ' = function(context, self) {' + 'var s;' + 'if (arguments.length == 1 && context) {' + 's = !context.' + STACKED + ' ? [context] : context;' +
                // Handle helpers with custom contexts (#228)
                '} else if (!context.' + STACKED + ') {' + 's = [self, context];' + '} else if (context && context === self && context.' + STACKED + ') {' + 's = context.slice(0);' + '} else {' + 's = context && context.' + STACKED + ' ? context.concat([self]) : ' + STACK + '(context).concat([self]);' + '}' + 'return (s.' + STACKED + ' = true) && s;' + '};'
            },

            // An ordered token registry for the scanner.
            // This needs to be ordered by priority to prevent token parsing errors.
            // Each token follows the following structure:
            //		[
            //			// Which key in the token map to match.
            //			"tokenMapName",
            //			// A simple token to match, like "{{".
            //			"token",
            //			// Optional. A complex (regexp) token to match that 
            //			// overrides the simple token.
            //			"[\\s\\t]*{{",
            //			// Optional. A function that executes advanced 
            //			// manipulation of the matched content. This is 
            //			// rarely used.
            //			function(content){   
            //				return content;
            //			}
            //		]
            tokens: [
            // Return unescaped
            ["returnLeft", "{{{", "{{[{&]"],
            // Full line comments
            ["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],
            // Inline comments
            ["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],
            // Full line escapes
            // This is used for detecting lines with only whitespace and an escaped tag
            ["escapeFull", "{{}}", "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)", function (content) {
                return {
                    before: /^\n.+?\n$/.test(content) ? '\n' : '',
                    content: content.match(/\{\{(.+?)\}\}/)[1] || ''
                };
            }],
            // Return escaped
            ["escapeLeft", "{{"],
            // Close return unescaped
            ["returnRight", "}}}"],
            // Close tag
            ["right", "}}"]],

            // ## Scanning Helpers
            // This is an array of helpers that transform content that is within escaped tags like `{{token}}`. These helpers are solely for the scanning phase; they are unrelated to Mustache/Handlebars helpers which execute at render time. Each helper has a definition like the following:
            //		{
            //			// The content pattern to match in order to execute.
            //			// Only the first matching helper is executed.
            //			name: /pattern to match/,
            //			// The function to transform the content with.
            //			// @param {String} content   The content to transform.
            //			// @param {Object} cmd       Scanner helper data.
            //			//                           {
            //			//                             insert: "insert command",
            //			//                             tagName: "div",
            //			//                             status: 0
            //			//                           }
            //			fn: function(content, cmd) {
            //				return 'for text injection' || 
            //					{ raw: 'to bypass text injection' };
            //			}
            //		}
            helpers: [
            // ### Partials
            // Partials begin with a greater than sign, like {{> box}}.
            // Partials are rendered at runtime (as opposed to compile time), 
            // so recursive partials are possible. Just avoid infinite loops.
            // For example, this template and partial:
            // 		base.mustache:
            // 			<h2>Names</h2>
            // 			{{#names}}
            // 				{{> user}}
            // 			{{/names}}
            // 		user.mustache:
            // 			<strong>{{name}}</strong>
            {
                name: /^>[\s]*\w*/,
                fn: function (content, cmd) {
                    // Get the template name and call back into the render method,
                    // passing the name and the current context.
                    var templateName = can.trim(content.replace(/^>\s?/, '')).replace(/["|']/g, "");
                    return "options.partials && options.partials['" + templateName + "'] ? can.Mustache.renderPartial(options.partials['" + templateName + "']," + CONTEXT_STACK + ".pop(),options) : can.Mustache.render('" + templateName + "', " + CONTEXT_STACK + ")";
                }
            },

            // ### Data Hookup
            // This will attach the data property of `this` to the element
            // its found on using the first argument as the data attribute
            // key.
            // For example:
            //		<li id="nameli" {{ data 'name' }}></li>
            // then later you can access it like:
            //		can.$('#nameli').data('name');
            {
                name: /^\s*data\s/,
                fn: function (content, cmd) {
                    var attr = content.match(/["|'](.*)["|']/)[1];
                    // return a function which calls `can.data` on the element
                    // with the attribute name with the current context.
                    return "can.proxy(function(__){" +
                    // "var context = this[this.length-1];" +
                    // "context = context." + STACKED + " ? context[context.length-2] : context; console.warn(this, context);" +
                    "can.data(can.$(__),'" + attr + "', this.pop()); }, " + CONTEXT_STACK + ")";
                }
            },

            // ### Transformation (default)
            // This transforms all content to its interpolated equivalent,
            // including calls to the corresponding helpers as applicable. 
            // This outputs the render code for almost all cases.
            // #### Definitions
            // * `context` - This is the object that the current rendering context operates within. 
            //		Each nested template adds a new `context` to the context stack.
            // * `stack` - Mustache supports nested sections, 
            //		each of which add their own context to a stack of contexts.
            //		Whenever a token gets interpolated, it will check for a match against the 
            //		last context in the stack, then iterate through the rest of the stack checking for matches.
            //		The first match is the one that gets returned.
            // * `Mustache.txt` - This serializes a collection of logic, optionally contained within a section.
            //		If this is a simple interpolation, only the interpolation lookup will be passed.
            //		If this is a section, then an `options` object populated by the truthy (`options.fn`) and 
            //		falsey (`options.inverse`) encapsulated functions will also be passed. This section handling 
            //		exists to support the runtime context nesting that Mustache supports.
            // * `Mustache.get` - This resolves an interpolation reference given a stack of contexts.
            // * `options` - An object containing methods for executing the inner contents of sections or helpers.  
            //		`options.fn` - Contains the inner template logic for a truthy section.  
            //		`options.inverse` - Contains the inner template logic for a falsey section.  
            //		`options.hash` - Contains the merged hash object argument for custom helpers.
            // #### Design
            // This covers the design of the render code that the transformation helper generates.
            // ##### Pseudocode
            // A detailed explanation is provided in the following sections, but here is some brief pseudocode
            // that gives a high level overview of what the generated render code does (with a template similar to  
            // `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`).
            // *Initialize the render code.*
            // 		view = []
            // 		context = []
            // 		stack = fn { context.concat([this]) }
            // *Render the root section.*
            // 		view.push( "string" )
            // 		view.push( can.view.txt(
            // *Render the nested section with `can.Mustache.txt`.*
            // 			txt( 
            // *Add the current context to the stack.*
            // 				stack(), 
            // *Flag this for truthy section mode.*
            // 				"#",
            // *Interpolate and check the `a` variable for truthyness using the stack with `can.Mustache.get`.*
            // 				get( "a", stack() ),
            // *Include the nested section's inner logic.
            // The stack argument is usually the parent section's copy of the stack, 
            // but it can be an override context that was passed by a custom helper.
            // Sections can nest `0..n` times -- **NESTCEPTION**.*
            // 				{ fn: fn(stack) {
            // *Render the nested section (everything between the `{{#a}}` and `{{/a}}` tokens).*
            // 					view = []
            // 					view.push( "string" )
            // 					view.push(
            // *Add the current context to the stack.*
            // 						stack(),
            // *Flag this as interpolation-only mode.*
            // 						null,
            // *Interpolate the `b.c.d.e.name` variable using the stack.*
            // 						get( "b.c.d.e.name", stack() ),
            // 					)
            // 					view.push( "string" )
            // *Return the result for the nested section.*
            // 					return view.join()
            // 				}}
            // 			)
            // 		))
            // 		view.push( "string" )
            // *Return the result for the root section, which includes all nested sections.*
            // 		return view.join()
            // ##### Initialization
            // Each rendered template is started with the following initialization code:
            // 		var ___v1ew = [];
            // 		var ___c0nt3xt = [];
            // 		___c0nt3xt.___st4ck = true;
            // 		var ___st4ck = function(context, self) {
            // 			var s;
            // 			if (arguments.length == 1 && context) {
            // 				s = !context.___st4ck ? [context] : context;
            // 			} else {
            // 				s = context && context.___st4ck 
            //					? context.concat([self]) 
            //					: ___st4ck(context).concat([self]);
            // 			}
            // 			return (s.___st4ck = true) && s;
            // 		};
            // The `___v1ew` is the the array used to serialize the view.
            // The `___c0nt3xt` is a stacking array of contexts that slices and expands with each nested section.
            // The `___st4ck` function is used to more easily update the context stack in certain situations.
            // Usually, the stack function simply adds a new context (`self`/`this`) to a context stack. 
            // However, custom helpers will occasionally pass override contexts that need their own context stack.
            // ##### Sections
            // Each section, `{{#section}} content {{/section}}`, within a Mustache template generates a section 
            // context in the resulting render code. The template itself is treated like a root section, with the 
            // same execution logic as any others. Each section can have `0..n` nested sections within it.
            // Here's an example of a template without any descendent sections.  
            // Given the template: `"{{a.b.c.d.e.name}}" == "Phil"`  
            // Would output the following render code:
            //		___v1ew.push("\"");
            //		___v1ew.push(can.view.txt(1, '', 0, this, function() {
            // 			return can.Mustache.txt(___st4ck(___c0nt3xt, this), null, 
            //				can.Mustache.get("a.b.c.d.e.name", 
            //					___st4ck(___c0nt3xt, this))
            //			);
            //		}));
            //		___v1ew.push("\" == \"Phil\"");
            // The simple strings will get appended to the view. Any interpolated references (like `{{a.b.c.d.e.name}}`) 
            // will be pushed onto the view via `can.view.txt` in order to support live binding.
            // The function passed to `can.view.txt` will call `can.Mustache.txt`, which serializes the object data by doing 
            // a context lookup with `can.Mustache.get`.
            // `can.Mustache.txt`'s first argument is a copy of the context stack with the local context `this` added to it.
            // This stack will grow larger as sections nest.
            // The second argument is for the section type. This will be `"#"` for truthy sections, `"^"` for falsey, 
            // or `null` if it is an interpolation instead of a section.
            // The third argument is the interpolated value retrieved with `can.Mustache.get`, which will perform the 
            // context lookup and return the approriate string or object.
            // Any additional arguments, if they exist, are used for passing arguments to custom helpers.
            // For nested sections, the last argument is an `options` object that contains the nested section's logic.
            // Here's an example of a template with a single nested section.  
            // Given the template: `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`  
            // Would output the following render code:
            //		___v1ew.push("\"");
            // 		___v1ew.push(can.view.txt(0, '', 0, this, function() {
            // 			return can.Mustache.txt(___st4ck(___c0nt3xt, this), "#", 
            //				can.Mustache.get("a", ___st4ck(___c0nt3xt, this)), 
            //					[{
            // 					_: function() {
            // 						return ___v1ew.join("");
            // 					}
            // 				}, {
            // 					fn: function(___c0nt3xt) {
            // 						var ___v1ew = [];
            // 						___v1ew.push(can.view.txt(1, '', 0, this, 
            //								function() {
            //  								return can.Mustache.txt(
            // 									___st4ck(___c0nt3xt, this), 
            // 									null, 
            // 									can.Mustache.get("b.c.d.e.name", 
            // 										___st4ck(___c0nt3xt, this))
            // 								);
            // 							}
            // 						));
            // 						return ___v1ew.join("");
            // 					}
            // 				}]
            //			)
            // 		}));
            //		___v1ew.push("\" == \"Phil\"");
            // This is specified as a truthy section via the `"#"` argument. The last argument includes an array of helper methods used with `options`.
            // These act similarly to custom helpers: `options.fn` will be called for truthy sections, `options.inverse` will be called for falsey sections.
            // The `options._` function only exists as a dummy function to make generating the section nesting easier (a section may have a `fn`, `inverse`,
            // or both, but there isn't any way to determine that at compilation time).
            // Within the `fn` function is the section's render context, which in this case will render anything between the `{{#a}}` and `{{/a}}` tokens.
            // This function has `___c0nt3xt` as an argument because custom helpers can pass their own override contexts. For any case where custom helpers
            // aren't used, `___c0nt3xt` will be equivalent to the `___st4ck(___c0nt3xt, this)` stack created by its parent section. The `inverse` function
            // works similarly, except that it is added when `{{^a}}` and `{{else}}` are used. `var ___v1ew = []` is specified in `fn` and `inverse` to 
            // ensure that live binding in nested sections works properly.
            // All of these nested sections will combine to return a compiled string that functions similar to EJS in its uses of `can.view.txt`.
            // #### Implementation
            {
                name: /^.*$/,
                fn: function (content, cmd) {
                    var mode = false,
                        result = [];

                    // Trim the content so we don't have any trailing whitespace.
                    content = can.trim(content);

                    // Determine what the active mode is.
                    // * `#` - Truthy section
                    // * `^` - Falsey section
                    // * `/` - Close the prior section
                    // * `else` - Inverted section (only exists within a truthy/falsey section)
                    if (content.length && (mode = content.match(/^([#^/]|else$)/))) {
                        mode = mode[0];
                        switch (mode) {
                            // Open a new section.
                        case '#':
                        case '^':
                            result.push(cmd.insert + 'can.view.txt(0,\'' + cmd.tagName + '\',' + cmd.status + ',this,function(){ return ');
                            break;
                            // Close the prior section.
                        case '/':
                            return {
                                raw: 'return ___v1ew.join("");}}])}));'
                            };
                            break;
                        }

                        // Trim the mode off of the content.
                        content = content.substring(1);
                    }

                    // `else` helpers are special and should be skipped since they don't 
                    // have any logic aside from kicking off an `inverse` function.
                    if (mode != 'else') {
                        var args = [],
                            i = 0,
                            hashing = false,
                            arg, split, m;

                        // Parse the helper arguments.
                        // This needs uses this method instead of a split(/\s/) so that 
                        // strings with spaces can be correctly parsed.
                        (can.trim(content) + ' ').replace(/((([^\s]+?=)?('.*?'|".*?"))|.*?)\s/g, function (whole, part) {
                            args.push(part);
                        });

                        // Start the content render block.
                        result.push('can.Mustache.txt(' + CONTEXT_OBJ + ',' + (mode ? '"' + mode + '"' : 'null') + ',');

                        // Iterate through the helper arguments, if there are any.
                        for (; arg = args[i]; i++) {
                            i && result.push(',');

                            // Check for special helper arguments (string/number/boolean/hashes).
                            if (i && (m = arg.match(/^(('.*?'|".*?"|[0-9.]+|true|false)|((.+?)=(('.*?'|".*?"|[0-9.]+|true|false)|(.+))))$/))) {
                                // Found a native type like string/number/boolean.
                                if (m[2]) {
                                    result.push(m[0]);
                                }
                                // Found a hash object.
                                else {
                                    // Open the hash object.
                                    if (!hashing) {
                                        hashing = true;
                                        result.push('{' + HASH + ':{');
                                    }

                                    // Add the key/value.
                                    result.push(m[4], ':', m[6] ? m[6] : 'can.Mustache.get("' + m[5].replace(/"/g, '\\"') + '",' + CONTEXT_OBJ + ')');

                                    // Close the hash if this was the last argument.
                                    if (i == args.length - 1) {
                                        result.push('}}');
                                    }
                                }
                            }
                            // Otherwise output a normal interpolation reference.
                            else {
                                result.push('can.Mustache.get("' +
                                // Include the reference name.
                                arg.replace(/"/g, '\\"') + '",' +
                                // Then the stack of context.
                                CONTEXT_OBJ +
                                // Flag as a helper method to aid performance, 
                                // if it is a known helper (anything with > 0 arguments).
                                (i == 0 && args.length > 1 ? ',true' : ',false') + (i > 0 ? ',true' : ',false') + ')');
                            }
                        }
                    }

                    // Create an option object for sections of code.
                    mode && mode != 'else' && result.push(',[{_:function(){');
                    switch (mode) {
                        // Truthy section
                    case '#':
                        result.push('return ___v1ew.join("");}},{fn:function(' + CONTEXT + '){var ___v1ew = [];');
                        break;
                        // If/else section
                        // Falsey section
                    case 'else':
                    case '^':
                        result.push('return ___v1ew.join("");}},{inverse:function(' + CONTEXT + '){var ___v1ew = [];');
                        break;
                        // Not a section
                    default:
                        result.push(');');
                        break;
                    }

                    // Return a raw result if there was a section, otherwise return the default string.
                    result = result.join('');
                    return mode ? {
                        raw: result
                    } : result;
                }
            }]
        })
    });

    // Add in default scanner helpers first.
    // We could probably do this differently if we didn't 'break' on every match.
    var helpers = can.view.Scanner.prototype.helpers;
    for (var i = 0; i < helpers.length; i++) {
        Mustache.prototype.scanner.helpers.unshift(helpers[i]);
    };


    Mustache.txt = function (context, mode, name) {
        // Grab the extra arguments to pass to helpers.
        var args = Array.prototype.slice.call(arguments, 3),
            // Create a default `options` object to pass to the helper.
            options = can.extend.apply(can, [{
                fn: function () {},
                inverse: function () {}
            }].concat(mode ? args.pop() : []));


        var extra = {};
        if (context.context) {
            extra = context.options;
            context = context.context;
        }

        // Check for a registered helper or a helper-like function.
        if (helper = (Mustache.getHelper(name, extra) || (can.isFunction(name) && !name.isComputed && {
            fn: name
        }))) {
            // Use the most recent context as `this` for the helper.
            var stack = context[STACKED] && context,
                context = (stack && context[context.length - 1]) || context,
                // Update the options with a function/inverse (the inner templates of a section).
                opts = {
                    fn: can.proxy(options.fn, context),
                    inverse: can.proxy(options.inverse, context)
                },
                lastArg = args[args.length - 1];

            // Store the context stack in the options if one exists
            if (stack) {
                opts.contexts = stack;
            }
            // Add the hash to `options` if one exists
            if (lastArg && lastArg[HASH]) {
                opts.hash = args.pop()[HASH];
            }
            args.push(opts);

            // Call the helper.
            return helper.fn.apply(context, args) || '';
        }

        // if a compute, get the value
        if (can.isFunction(name) && name.isComputed) {
            name = name();
        }

        // An array of arguments to check for truthyness when evaluating sections.
        var validArgs = args.length ? args : [name],
            // Whether the arguments meet the condition of the section.
            valid = true,
            result = [],
            i, helper, argIsObserve, arg;
        // Validate the arguments based on the section mode.
        if (mode) {
            for (i = 0; i < validArgs.length; i++) {
                arg = validArgs[i];
                argIsObserve = typeof arg !== 'undefined' && isObserve(arg);
                // Array-like objects are falsey if their length = 0.
                if (isArrayLike(arg)) {
                    // Use .attr to trigger binding on empty lists returned from function
                    if (mode == '#') {
                        valid = valid && !! (argIsObserve ? arg.attr('length') : arg.length);
                    } else if (mode == '^') {
                        valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
                    }
                }
                // Otherwise just check if it is truthy or not.
                else {
                    valid = mode == '#' ? valid && !! arg : mode == '^' ? valid && !arg : valid;
                }
            }
        }

        // Otherwise interpolate like normal.
        if (valid) {
            switch (mode) {
                // Truthy section.
            case '#':
                // Iterate over arrays
                if (isArrayLike(name)) {
                    var isObserveList = isObserve(name);

                    // Add the reference to the list in the contexts.
                    for (i = 0; i < name.length; i++) {
                        result.push(options.fn.call(name[i], context) || '');

                        // Ensure that live update works on observable lists
                        isObserveList && name.attr('' + i);
                    }
                    return result.join('');
                }
                // Normal case.
                else {
                    return options.fn.call(name || {}, context) || '';
                }
                break;
                // Falsey section.
            case '^':
                return options.inverse.call(name || {}, context) || '';
                break;
            default:
                // Add + '' to convert things like numbers to strings.
                // This can cause issues if you are trying to
                // eval on the length but this is the more
                // common case.
                return '' + (name !== undefined ? name : '');
                break;
            }
        }

        return '';
    };


    Mustache.get = function (ref, contexts, isHelper, isArgument) {
        var options = contexts.options || {};
        contexts = contexts.context || contexts;
        // Assume the local object is the last context in the stack.
        var obj = contexts[contexts.length - 1],
            // Assume the parent context is the second to last context in the stack.
            context = contexts[contexts.length - 2],
            // Split the reference (like `a.b.c`) into an array of key names.
            names = ref.split('.'),
            namesLength = names.length,
            value, lastValue, name, i, j,
            // if we walk up and don't find a property, we default
            // to listening on an undefined property of the first
            // context that is an observe
            defaultObserve, defaultObserveName;

        // Handle `this` references for list iteration: {{.}} or {{this}}
        if (/^\.|this$/.test(ref)) {
            // If context isn't an object, then it was a value passed by a helper so use it as an override.
            if (!/^object|undefined$/.test(typeof context)) {
                return context || '';
            }
            // Otherwise just return the closest object.
            else {
                while (value = contexts.pop()) {
                    if (typeof value !== 'undefined') {
                        return value;
                    }
                }
                return '';
            }
        }
        // Handle object resolution (like `a.b.c`).
        else if (!isHelper) {
            // Reverse iterate through the contexts (last in, first out).
            for (i = contexts.length - 1; i >= 0; i--) {
                // Check the context for the reference
                value = contexts[i];

                // Is the value a compute?
                if (can.isFunction(value) && value.isComputed) {
                    value = value();
                }

                // Make sure the context isn't a failed object before diving into it.
                if (typeof value !== 'undefined' && value !== null) {
                    var isHelper = Mustache.getHelper(ref, options);
                    for (j = 0; j < namesLength; j++) {
                        // Keep running up the tree while there are matches.
                        if (typeof value[names[j]] !== 'undefined' && value[names[j]] !== null) {
                            lastValue = value;
                            value = value[name = names[j]];
                        }
                        // if there's a name conflict between property and helper
                        // property wins
                        else if (isHelper) {
                            return ref;
                        }
                        // If it's undefined, still match if the parent is an Observe.
                        else if (isObserve(value)) {
                            defaultObserve = value;
                            defaultObserveName = names[j];
                            lastValue = value = undefined;
                            break;
                        }
                        else {
                            lastValue = value = undefined;
                            break;
                        }
                    }
                }

                // Found a matched reference.
                if (value !== undefined) {
                    return Mustache.resolve(value, lastValue, name, isArgument);
                }
            }
        }

        if (defaultObserve &&
        // if there's not a helper by this name and no attribute with this name
        !(Mustache.getHelper(ref) && can.inArray(defaultObserveName, can.Observe.keys(defaultObserve)) === -1)) {
            return defaultObserve.compute(defaultObserveName);
        }
        // Support helpers without arguments, but only if there wasn't a matching data reference.
        // Helpers have priority over local function, see https://github.com/bitovi/canjs/issues/258
        if (value = Mustache.getHelper(ref, options)) {
            return ref;
        } else if (typeof obj !== 'undefined' && obj !== null && can.isFunction(obj[ref])) {
            // Support helper-like functions as anonymous helpers
            return obj[ref];
        }

        return '';
    };


    Mustache.resolve = function (value, lastValue, name, isArgument) {
        if (lastValue && can.isFunction(lastValue[name]) && isArgument) {
            if (lastValue[name].isComputed) {
                return lastValue[name];
            }
            // Don't execute functions if they are parameters for a helper and are not a can.compute
            // Need to bind it to the original context so that that information doesn't get lost by the helper
            return function () {
                return lastValue[name].apply(lastValue, arguments);
            };
        } else if (lastValue && can.isFunction(lastValue[name])) {
            // Support functions stored in objects.
            return lastValue[name]();
        }
        // Invoke the length to ensure that Observe.List events fire.
        else if (isObserve(value) && isArrayLike(value) && value.attr('length')) {
            return value;
        }
        // Add support for observes
        else if (lastValue && isObserve(lastValue)) {
            return lastValue.compute(name);
        }
        else if (can.isFunction(value)) {
            return value();
        }
        else {
            return value;
        }
    };


    // ## Helpers
    // Helpers are functions that can be called from within a template.
    // These helpers differ from the scanner helpers in that they execute
    // at runtime instead of during compilation.
    // Custom helpers can be added via `can.Mustache.registerHelper`,
    // but there are also some built-in helpers included by default.
    // Most of the built-in helpers are little more than aliases to actions 
    // that the base version of Mustache simply implies based on the 
    // passed in object.
    // Built-in helpers:
    // * `data` - `data` is a special helper that is implemented via scanning helpers. 
    //		It hooks up the active element to the active data object: `<div {{data "key"}} />`
    // * `if` - Renders a truthy section: `{{#if var}} render {{/if}}`
    // * `unless` - Renders a falsey section: `{{#unless var}} render {{/unless}}`
    // * `each` - Renders an array: `{{#each array}} render {{this}} {{/each}}`
    // * `with` - Opens a context section: `{{#with var}} render {{/with}}`
    Mustache._helpers = {};

    Mustache.registerHelper = function (name, fn) {
        this._helpers[name] = {
            name: name,
            fn: fn
        };
    };


    Mustache.getHelper = function (name, options) {
        return options && options.helpers && options.helpers[name] && {
            fn: options.helpers[name]
        } || this._helpers[name]
        for (var i = 0, helper; helper = [i]; i++) {
            // Find the correct helper
            if (helper.name == name) {
                return helper;
            }
        }
        return null;
    };


    Mustache.render = function (partial, context) {
        // Make sure the partial being passed in
        // isn't a variable like { partial: "foo.mustache" }
        if (!can.view.cached[partial] && context[partial]) {
            partial = context[partial];
        }

        // Call into `can.view.render` passing the
        // partial and context.
        return can.view.render(partial, context);
    };

    Mustache.renderPartial = function (partial, context, options) {
        return partial.render ? partial.render(context, options) : partial(context, options);
    };

    // The built-in Mustache helpers.
    can.each({
        // Implements the `if` built-in helper.
        'if': function (expr, options) {
            if ( !! Mustache.resolve(expr)) {
                return options.fn(options.contexts || this);
            }
            else {
                return options.inverse(options.contexts || this);
            }
        },
        // Implements the `unless` built-in helper.
        'unless': function (expr, options) {
            if (!Mustache.resolve(expr)) {
                return options.fn(options.contexts || this);
            }
        },

        // Implements the `each` built-in helper.
        'each': function (expr, options) {
            expr = Mustache.resolve(expr);
            if ( !! expr && expr.length) {
                var result = [];
                for (var i = 0; i < expr.length; i++) {
                    result.push(options.fn(expr[i]));
                }
                return result.join('');
            }
        },
        // Implements the `with` built-in helper.
        'with': function (expr, options) {
            var ctx = expr;
            expr = Mustache.resolve(expr);
            if ( !! expr) {
                return options.fn(ctx);
            }
        }

    }, function (fn, name) {
        Mustache.registerHelper(name, fn);
    });

    // ## Registration
    // Registers Mustache with can.view.
    can.view.register({
        suffix: "mustache",

        contentType: "x-mustache-template",

        // Returns a `function` that renders the view.
        script: function (id, src) {
            return "can.Mustache(function(_CONTEXT,_VIEW) { " + new Mustache({
                text: src,
                name: id
            }).template.out + " })";
        },

        renderer: function (id, text) {
            return Mustache({
                text: text,
                name: id
            });
        }
    });

    return can;
});