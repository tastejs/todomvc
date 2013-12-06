/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/control", "can/observe", "can/view/mustache", "can/view/bindings"], function(can){
	
	var ignoreAttributesRegExp = /dataViewId|class|id/i
	/**
	 * @add can.Component
	 */
	var Component = can.Component = can.Construct.extend(
	/**
	 * @static
	 */
	{
		setup: function(){
			can.Construct.setup.apply( this, arguments );
			
			if(can.Component){
				var self = this;
				this.Control = can.Control.extend({
					_lookup: function(options){
						return [options.scope, options, window]
					}
				},can.extend({
					setup: function(el, options){
						var res = can.Control.prototype.setup.call(this, el, options)
						this.scope = options.scope;
						// call on() whenever scope changes
						var self = this;
						this.on(this.scope,"change",function(){
							self.on();
							self.on(self.scope,"change",arguments.callee);
						});
						return res;
					}
				},this.prototype.events));
				
				var attributeScopeMappings = {};
				// go through scope and get attribute ones
				can.each(this.prototype.scope, function(val, prop){
					if(val === "@") {
						attributeScopeMappings[prop] = prop;
					}
				}) 
				this.attributeScopeMappings = attributeScopeMappings;
				
				// If scope is an object,
				if(! this.prototype.scope || typeof this.prototype.scope === "object" ){
					// use that object as the prototype of an extened Map constructor function.
					// A new instance of that Map constructor function will be created and
					// set as this.scope.
					this.Map = can.Map.extend( this.prototype.scope||{} );
				} 
				// If scope is a can.Map constructor function, 
				else if(this.prototype.scope.prototype instanceof can.Map) {
					// just use that.
					this.Map = this.prototype.scope;
				}
				
				
				
				
				if(this.prototype.template){
					if(typeof this.prototype.template == "function"){
						var temp = this.prototype.template
						this.renderer = function(){
							return can.view.frag(temp.apply(null, arguments))
						}
					} else {
						this.renderer =can.view.mustache( this.prototype.template );
					}
				}
				
				
				
				can.view.Scanner.tag(this.prototype.tag,function(el, options){
					new self(el, options)
				});
			}
			
		}
	},{
		/**
		 * @prototype
		 */
		setup: function(el, hookupOptions){
			// Setup values passed to component
			var initalScopeData = {},
				component = this,
				twoWayBindings = {},
				// what scope property is currently updating
				scopePropertyUpdating,
				// the object added to the scope
				componentScope;
			
			// scope prototype properties marked with an "@" are added here
			can.each(this.constructor.attributeScopeMappings,function(val, prop){
				initalScopeData[prop] = el.getAttribute(can.hyphenate(val));
			})
			
			// get the value in the scope for each attribute
			// the hookup should probably happen after?
			can.each(can.makeArray(el.attributes), function(node, index){
				
				var name = can.camelize(node.nodeName.toLowerCase()),
					value = node.value;
				// ignore attributes already in ScopeMappings
				if(component.constructor.attributeScopeMappings[name] || ignoreAttributesRegExp.test(name)){
					return;
				}
				
				// Cross-bind the value in the scope to this 
				// component's scope
				var computeData = hookupOptions.scope.computeData(value, {args: []}),
					compute = computeData.compute;
				
				// bind on this, check it's value, if it has dependencies
				var handler = function(ev, newVal){
					scopePropertyUpdating = name;
					componentScope.attr(name, newVal);
					scopePropertyUpdating = null;
				}
				// compute only returned if bindable
				
				compute.bind("change", handler);
				
				// set the value to be added to the scope
				initalScopeData[name] = compute();
				
				if(!compute.hasDependencies) {
					compute.unbind("change", handler);
				} else {
					// make sure we unbind (there's faster ways of doing this)
					can.bind.call(el,"removed",function(){
						compute.unbind("change", handler);
					})
					// setup two-way binding
					twoWayBindings[name] = computeData
				}
				
			})
			
			
			
			if(this.constructor.Map){
				componentScope = new this.constructor.Map(initalScopeData);
			} else if(this.scope instanceof can.Map) {
				componentScope = this.scope;
			} else if(can.isFunction(this.scope)){

				var scopeResult = this.scope(initalScopeData, hookupOptions.scope, el);
				// if the function returns a can.Map, use that as the scope
				if(scopeResult instanceof can.Map){
					componentScope = scopeResult
				} else if( scopeResult.prototype instanceof can.Map ){
					componentScope = new scopeResult(initalScopeData);
				} else {
					componentScope = new ( can.Map.extend(scopeResult) )(initalScopeData);
				}
				
			}
			var handlers = {};
			// setup reverse bindings
			can.each(twoWayBindings, function(computeData, prop){
				handlers[prop] = function(ev, newVal){
					// check that this property is not being changed because
					// it's source value just changed
					if(scopePropertyUpdating !== prop){
						computeData.compute(newVal)
					}
				}
				componentScope.bind(prop, handlers[prop])
			});
			// teardown reverse bindings when element is removed
			can.bind.call(el,"removed",function(){
				can.each(handlers, function(handler, prop){
					componentScope.unbind(prop, handlers[prop])
				})
			})
			
			this.scope = componentScope;
			can.data(can.$(el),"scope", this.scope)
			
			// create a real Scope object out of the scope property
			var renderedScope = hookupOptions.scope.add( this.scope ),
			
				// setup helpers to callback with `this` as the component
				helpers = {};

			can.each(this.helpers || {}, function(val, prop){
				if(can.isFunction(val)) {
					helpers[prop] = function(){
						return val.apply(componentScope, arguments)
					}
				}
			});
			
			// create a control to listen to events
			this._control = new this.constructor.Control(el, {scope: this.scope});
			
			// if this component has a template (that we've already converted to a renderer)
			if( this.constructor.renderer ) {
				// add content to tags
				if(!helpers._tags){
					helpers._tags = {};
				}
				
				// we need be alerted to when a <content> element is rendered so we can put the original contents of the widget in its place
				helpers._tags.content = function(el, rendererOptions){
					// first check if there was content within the custom tag
					// otherwise, render what was within <content>, the default code
					var subtemplate = hookupOptions.subtemplate || rendererOptions.subtemplate
					if(subtemplate) {
						var frag = can.view.frag( subtemplate(rendererOptions.scope, rendererOptions.options.add(helpers) ) );
						can.insertBefore(el.parentNode, frag, el);
						can.remove( can.$(el) );
					}
				}
				// render the component's template
				var frag = this.constructor.renderer( renderedScope, helpers);
			} else {
				// otherwise render the contents between the 
				var frag = can.view.frag( hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(helpers)) : "");
			}
			can.appendChild(el, frag);
		}
	})
	
	if(window.$ && $.fn){
		$.fn.scope = function(attr){
			if( attr ) {
				return this.data("scope").attr(attr)
			} else {
				return this.data("scope")
			}
		}
	}
	
	
	can.scope = function(el, attr){
		var el = can.$(el);
		if( attr ){
			return can.data(el,"scope").attr(attr)
		} else {
			return can.data(el, "scope")
		}
	}
	
	return Component;
});