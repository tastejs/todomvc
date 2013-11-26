/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/view/mustache", "can/control"], function(can){
	
	
	
	/**
	 * @function can.view.bindings.can-value can-value
	 * @parent can.view.bindings
	 * 
	 * Sets up two way bindings in a template.
	 * 
	 * @signature `can-value='KEY'`
	 * 
	 * Binds the element's value or checked property to the value specified by 
	 * key. Example:
	 * 
	 *     <input type='text' can-value='first.name'/>
	 * 
	 * @param {can.Mustache.key} key A named value in the current scope.
	 * 
	 * @body
	 * 
	 * ## Use
	 * 
	 * Add a `can-value="KEY"` attribute to an input or select element and
	 * the element's value will be cross-bound to an observable value specified by `KEY`.
	 * 
	 * Depending on the element and the element's type, `can-value` takes on 
	 * different behaviors.  If an input element has a type
	 * not listed here, the behavior is the same as the `text` type.
	 * 
	 * ## input type=text
	 * 
	 * Cross binds the input's string text value with the observable value.
	 * 
	 * @demo can/view/bindings/hyperloop.html
	 * 
	 * ## input type=checkbox
	 * 
	 * Cross binds the checked property to a true or false value. An alternative
	 * true and false value can be specified by setting `can-true-value` and
	 * `can-false-value` attributes.
	 * 
	 * @demo can/view/bindings/input-checkbox.html
	 * 
	 * ## input type='radio'
	 * 
	 * If the radio element is checked, sets the observable specified by `can-value` to match the value of 
	 * `value` attribute.  
	 * 
	 * @demo can/view/bindings/input-radio.html
	 * 
	 * ## select
	 * 
	 * Cross binds the selected option value with an observable value.
	 * 
	 * @demo can/view/bindings/select.html
	 * 
	 */
	can.view.Scanner.attribute("can-value", function(data, el){
		
		var attr = el.getAttribute("can-value"),
			value = data.scope.computeData(attr,{args:[]}).compute;
		
		if(el.nodeName.toLowerCase() === "input"){
			if(el.type === "checkbox") {
				if( el.hasAttribute("can-true-value") ) {
					var trueValue = data.scope.compute( el.getAttribute("can-true-value") )
				} else {
					var trueValue = can.compute(true)
				}
				if( el.hasAttribute("can-false-value") ) {
					var falseValue = data.scope.compute( el.getAttribute("can-false-value") )
				} else {
					var falseValue = can.compute(false)
				}
			}
			
			if(el.type === "checkbox" || el.type === "radio") {
				new Checked(el,{
					value: value,
					trueValue: trueValue,
					falseValue: falseValue
				});
				return;
			}
		}
		
		new Value(el,{value: value})
	});
	
	var special = {
		enter: function(data, el, original){
			return {
				event: "keyup",
				handler: function(ev){
					if(ev.keyCode == 13) {
						return original.call(this,ev)
					}
				}
			}
		}
	}
	
	/**
	 * @function can.view.bindings.can-EVENT can-EVENT
	 * @parent can.view.bindings
	 * 
	 * @signature `can-EVENT='KEY'`
	 * 
	 * Specify a callback function to be called on a particular event.
	 * 
	 * @param {String} EVENT A event name like `click` or `keyup`.  If you are
	 * using jQuery, you can listen to jQuery special events too.
	 * 
	 * @param {can.Mustache.key} key A named value in the current scope.  The value
	 * should be a function.
	 * 
	 * @body
	 * 
	 * ## Use
	 * 
	 * By adding `can-EVENT='KEY'` to an element, the function pointed to
	 * by `KEY` is bound to the element's `EVENT` event. The function 
	 * is called back with:
	 * 
	 *  - `context` - the context of the element
	 *  - `element` - the element that was bound
	 *  - `event` - the event that was triggered
	 * 
	 * @demo can/view/bindings/can-event.html
	 * 
	 */
	can.view.Scanner.attribute(/can-[\w\.]+/,function(data, el){
		
		var attributeName = data.attr,
			event = data.attr.substr("can-".length),
			handler = function(ev){
				var attr = el.getAttribute(attributeName),
					scopeData = data.scope.read(attr,{returnObserveMethods: true, isArgument: true});
				return scopeData.value.call(scopeData.parent,data.scope._context, can.$(this), ev )
			};
		
		if(special[event]){
			var specialData = special[event](data, el, handler);
			handler = specialData.handler;
			event = specialData.event;
		}
		
		can.bind.call( el, event, handler);
	});
	
	
	var Value = can.Control.extend({
		init: function(){
			if(this.element[0].nodeName.toUpperCase() === "SELECT"){
				// need to wait until end of turn ...
				setTimeout($.proxy(this.set,this),1)
			} else {
				this.set()
			}
			
		},
		"{value} change": "set",
		set: function(){
			this.element[0].value = this.options.value()
		},
		"change": function(){
			this.options.value(this.element[0].value)
		}
	})
	
	var Checked = can.Control.extend({
		init: function(){
			this.isCheckebox = (this.element[0].type.toLowerCase() == "checkbox");
			this.check()
		},
		"{value} change": "check",
		"{trueValue} change": "check",
		"{falseValue} change": "check",
		check: function(){
			if(this.isCheckebox){
				var value =  this.options.value(),
					trueValue = this.options.trueValue() || true,
					falseValue = this.options.falseValue() || false;
					
				this.element[0].checked = ( value == trueValue )
			} else {
				if(this.options.value() === this.element[0].value){
					this.element[0].checked = true //.prop("checked", true)
				} else {
					this.element[0].checked = false //.prop("checked", false)
				}
			}
			
			
		},
		"change": function(){
			
			if(this.isCheckebox){
				this.options.value( this.element[0].checked? this.options.trueValue() : this.options.falseValue() );
			} else {
				if(this.element[0].checked){
					this.options.value( this.element[0].value );
				}
			}
			
		}
	});
	
});