/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/view", "can/view/elements", "can/view/live", "can/util/string"], function(can, elements, live){

/**
 * Helper(s)
 */
var pendingHookups = [],
	tagChildren = function(tagName) {
		var newTag = elements.tagMap[tagName] || "span";
		if(newTag === "span") {
			//innerHTML in IE doesn't honor leading whitespace after empty elements
			return "@@!!@@";
		}	
		return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
	},
	contentText = function( input, tag ) {	
		
		// If it's a string, return.
		if ( typeof input == 'string' ) {
			return input;
		}
		// If has no value, return an empty string.
		if ( !input && input !== 0 ) {
			return '';
		}

		// If it's an object, and it has a hookup method.
		var hook = (input.hookup &&

		// Make a function call the hookup method.
		function( el, id ) {
			input.hookup.call(input, el, id);
		}) ||

		// Or if it's a `function`, just use the input.
		(typeof input == 'function' && input);

		// Finally, if there is a `function` to hookup on some dom,
		// add it to pending hookups.
		if ( hook ) {
			if(tag){
				return "<"+tag+" "+can.view.hook(hook)+"></"+tag+">"
			} else {
				pendingHookups.push(hook);
			}
			
			return '';
		}

		// Finally, if all else is `false`, `toString()` it.
		return "" + input;
	},
	// Returns escaped/sanatized content for anything other than a live-binding
	contentEscape = function( txt , tag) {
		return (typeof txt == 'string' || typeof txt == 'number') ?
			can.esc( txt ) :
			contentText(txt, tag);
	};


var current;

can.extend(can.view, {
	live: live,
	// called in text to make a temporary 
	// can.view.lists function that can be called with
	// the list to iterate over and the template
	// used to produce the content within the list
	setupLists: function(){

		var old = can.view.lists,
			data;

		can.view.lists = function(list, renderer){
			data = {
				list: list,
				renderer: renderer
			}
			return Math.random()
		}
		// sets back to the old data
		return function(){
			can.view.lists = old;
			return data;
		}
	},
	pending: function(data) {
		// TODO, make this only run for the right tagName
		var hooks = can.view.getHooks();
		return can.view.hook(function(el){
			can.each(hooks, function(fn){
				fn(el);
			});
			can.view.Scanner.hookupAttributes(data, el);
		});
	},
	getHooks: function(){
		var hooks = pendingHookups.slice(0);
		lastHookups = hooks;
		pendingHookups = [];
		return hooks;
	},
	onlytxt: function(self, func){
		return contentEscape(func.call(self))
	},
	/**
	 * @function can.view.txt
	 * @hide
	 * 
	 * A helper function used to insert the 
	 * value of the contents of a magic tag into 
	 * a template's output. It detects if an observable value is
	 * read and will setup live binding.
	 * 
	 * @signature `can.view.txt(escape, tagName, status, self, func)`
	 * 
	 * @param {Number} 1 if the content returned should be escaped, 0 if otherwise.
	 * @param {String} tagName the name of the tag the magic tag is most immediately
	 * within. Ex: `"li"`.
	 * @param {String|Number} status A flag indicates which part of a tag the
	 * magic tag is within. Status can be:
	 * 
	 *  - _STRING_ - The name of the attribute the magic tag is within. Ex: `"class"`
	 *  - `1` - The magic tag is within a tag like `<div <%= %>>`
	 *  - `0` - The magic tag is outside (or between) tags like `<div><%= %></div>`
	 * 
	 * @param {*} self The `this` of the current context template. `func` is called with
	 * self as this.
	 *   
	 * @param {function} func The "wrapping" function. For 
	 * example:  `<%= task.attr('name') %>` becomes
	 *   `(function(){return task.attr('name')})
	 *
	 */
	txt: function(escape, tagName, status, self, func){
		var listTeardown = can.view.setupLists(),
			emptyHandler = function(){},
			unbind = function(){
				compute.unbind("change",emptyHandler)
			};

		var compute = can.compute(func, self, false);
		// bind to get and temporarily cache the value
		compute.bind("change",emptyHandler);
		// call the "wrapping" function and get the binding information
		var tag = (elements.tagMap[tagName] || "span"),
			listData = listTeardown(),
			value = compute();
		
		if(listData){
			return "<" +tag+can.view.hook(function(el, parentNode){
				live.list(el, listData.list, listData.renderer, self, parentNode);
			})+"></" +tag+">";
		}

		// If we had no observes just return the value returned by func.
		if(!compute.hasDependencies || typeof value === "function"){
			unbind();
			return (  (escape || typeof status === 'string') && escape !== 2  ? contentEscape : contentText)(value, status === 0 && tag);
		}


		// the property (instead of innerHTML elements) to adjust. For
		// example options should use textContent
		var contentProp = elements.tagToContentPropMap[tagName];
		

		// The magic tag is outside or between tags.
		if ( status === 0 && !contentProp ) {
			// Return an element tag with a hookup in place of the content
			return "<" +tag+can.view.hook(
			escape ? 
				// If we are escaping, replace the parentNode with 
				// a text node who's value is `func`'s return value.
				function(el, parentNode){
					live.text(el, compute, parentNode);
					unbind();
				} 
				:
				// If we are not escaping, replace the parentNode with a
				// documentFragment created as with `func`'s return value.
				function( el, parentNode ) {
					live.html(el, compute, parentNode);
					unbind();
				//children have to be properly nested HTML for buildFragment to work properly
				}) + ">"+tagChildren(tag)+"</" +tag+">";
		// In a tag, but not in an attribute
		} else if( status === 1 ) { 
			// remember the old attr name
			pendingHookups.push(function(el) {
				live.attributes(el, compute, compute());
				unbind();
			});
			return compute();
		} else if( escape === 2 ) { // In a special attribute like src or style
			
			var attributeName = status;
			pendingHookups.push(function(el){
				live.specialAttribute(el, attributeName, compute);
				unbind();
			})
			return compute();
		} else { // In an attribute...
			var attributeName = status === 0 ? contentProp : status;
			// if the magic tag is inside the element, like `<option><% TAG %></option>`,
			// we add this hookup to the last element (ex: `option`'s) hookups.
			// Otherwise, the magic tag is in an attribute, just add to the current element's
			// hookups.
			(status === 0  ? lastHookups : pendingHookups ).push(function(el){
				live.attribute(el, attributeName, compute);
				unbind();
			});
			return live.attributePlaceholder;
		}
	}
});

return can;
});