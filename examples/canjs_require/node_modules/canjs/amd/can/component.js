/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/control", "can/observe", "can/view/mustache", "can/view/bindings"], function (can) {
	// ## Helpers
	// Attribute names to ignore for setting scope values.
	var ignoreAttributesRegExp = /^(dataViewId|class|id)$/i;
	/**
	 * @add can.Component
	 */
	var Component = can.Component = can.Construct.extend(
		
		// ## Static
		/**
		 * @static
		 */
		
		{
			// ### setup
			// 
			// When a component is extended, this sets up the component's internal constructor
			// functions and templates for later fast initialization.
			setup: function () {
				can.Construct.setup.apply(this, arguments);

				// Run the following only in constructors that extend can.Component.
				if (can.Component) {
					var self = this;
					
					// Define a control using the `events` prototype property.
					this.Control = can.Control.extend({
						// Change lookup to first look in the scope.
						_lookup: function (options) {
							return [options.scope, options, window];
						}
					},
					// Extend `events` with a setup method that listens to changes in `scope` and
					// rebinds all templated event handlers.
					can.extend({
						setup: function (el, options) {
							var res = can.Control.prototype.setup.call(this, el, options);
							this.scope = options.scope;
							var self = this;
							this.on(this.scope, "change", function handler() {
								self.on();
								self.on(self.scope, "change", handler);
							});
							return res;
						}
					}, this.prototype.events));
					
					// Look to convert `scope` to a Map constructor function.
					if (!this.prototype.scope || typeof this.prototype.scope === "object") {
						// If scope is an object, use that object as the prototype of an extended 
						// Map constructor function.
						// A new instance of that Map constructor function will be created and
						// set a the constructor instance's scope.
						this.Map = can.Map.extend(this.prototype.scope || {});
					}
					else if (this.prototype.scope.prototype instanceof can.Map) {
						// If scope is a can.Map constructor function, just use that.
						this.Map = this.prototype.scope;
					}
					
					// Look for default `@` values. If a `@` is found, these
					// attributes string values will be set and 2-way bound on the
					// component instance's scope.
					this.attributeScopeMappings = {};
					can.each(this.Map ? this.Map.defaults : {}, function (val, prop) {
						if (val === "@") {
							self.attributeScopeMappings[prop] = prop;
						}
					});

					// Convert the template into a renderer function.
					if (this.prototype.template) {
						if (typeof this.prototype.template === "function") {
							var temp = this.prototype.template;
							this.renderer = function () {
								return can.view.frag(temp.apply(null, arguments));
							};
						} else {
							this.renderer = can.view.mustache(this.prototype.template);
						}
					}

					// Register this component to be created when its `tag` is found.
					can.view.Scanner.tag(this.prototype.tag, function (el, options) {
						new self(el, options);
					});
				}

			}
		}, {
			// ## Prototype
			/**
			 * @prototype
			 */
			// ### setup
			// When a new component instance is created, setup bindings, render the template, etc.
			setup: function (el, hookupOptions) {
				// Setup values passed to component
				var initalScopeData = {},
					component = this,
					twoWayBindings = {},
					// what scope property is currently updating
					scopePropertyUpdating,
					// the object added to the scope
					componentScope,
					frag;

				// scope prototype properties marked with an "@" are added here
				can.each(this.constructor.attributeScopeMappings, function (val, prop) {
					initalScopeData[prop] = el.getAttribute(can.hyphenate(val));
				});

				// get the value in the scope for each attribute
				// the hookup should probably happen after?
				can.each(can.makeArray(el.attributes), function (node, index) {

					var name = can.camelize(node.nodeName.toLowerCase()),
						value = node.value;
					// ignore attributes already in ScopeMappings
					if (component.constructor.attributeScopeMappings[name] || ignoreAttributesRegExp.test(name) || can.view.Scanner.attributes[node.nodeName]) {
						return;
					}
					// ignore attr regexps
					for (var regAttr in can.view.Scanner.regExpAttributes) {
						if (can.view.Scanner.regExpAttributes[regAttr].match.test(node.nodeName)) {
							return;
						}
					}

					// Cross-bind the value in the scope to this 
					// component's scope
					var computeData = hookupOptions.scope.computeData(value, {
						args: []
					}),
						compute = computeData.compute;

					// bind on this, check it's value, if it has dependencies
					var handler = function (ev, newVal) {
						scopePropertyUpdating = name;
						componentScope.attr(name, newVal);
						scopePropertyUpdating = null;
					};
					// compute only returned if bindable

					compute.bind("change", handler);

					// set the value to be added to the scope
					initalScopeData[name] = compute();

					if (!compute.hasDependencies) {
						compute.unbind("change", handler);
					} else {
						// make sure we unbind (there's faster ways of doing this)
						can.bind.call(el, "removed", function () {
							compute.unbind("change", handler);
						});
						// setup two-way binding
						twoWayBindings[name] = computeData;
					}

				});

				if (this.constructor.Map) {
					componentScope = new this.constructor.Map(initalScopeData);
				} else if (this.scope instanceof can.Map) {
					componentScope = this.scope;
				} else if (can.isFunction(this.scope)) {

					var scopeResult = this.scope(initalScopeData, hookupOptions.scope, el);
					// if the function returns a can.Map, use that as the scope
					if (scopeResult instanceof can.Map) {
						componentScope = scopeResult;
					} else if (scopeResult.prototype instanceof can.Map) {
						componentScope = new scopeResult(initalScopeData);
					} else {
						componentScope = new(can.Map.extend(scopeResult))(initalScopeData);
					}

				}
				var handlers = {};
				// setup reverse bindings
				can.each(twoWayBindings, function (computeData, prop) {
					handlers[prop] = function (ev, newVal) {
						// check that this property is not being changed because
						// it's source value just changed
						if (scopePropertyUpdating !== prop) {
							computeData.compute(newVal);
						}
					};
					componentScope.bind(prop, handlers[prop]);
				});
				// teardown reverse bindings when element is removed
				can.bind.call(el, "removed", function () {
					can.each(handlers, function (handler, prop) {
						componentScope.unbind(prop, handlers[prop]);
					});
				});

				this.scope = componentScope;
				can.data(can.$(el), "scope", this.scope);

				// create a real Scope object out of the scope property
				var renderedScope = hookupOptions.scope.add(this.scope),

					// setup helpers to callback with `this` as the component
					helpers = {};

				can.each(this.helpers || {}, function (val, prop) {
					if (can.isFunction(val)) {
						helpers[prop] = function () {
							return val.apply(componentScope, arguments);
						};
					}
				});

				// create a control to listen to events
				this._control = new this.constructor.Control(el, {
					scope: this.scope
				});

				// if this component has a template (that we've already converted to a renderer)
				if (this.constructor.renderer) {
					// add content to tags
					if (!helpers._tags) {
						helpers._tags = {};
					}

					// we need be alerted to when a <content> element is rendered so we can put the original contents of the widget in its place
					helpers._tags.content = function render(el, rendererOptions) {
						// first check if there was content within the custom tag
						// otherwise, render what was within <content>, the default code
						var subtemplate = hookupOptions.subtemplate || rendererOptions.subtemplate;

						if (subtemplate) {

							// rendererOptions.options is a scope of helpers where `<content>` was found, so
							// the right helpers should already be available.
							// However, _tags.content is going to point to this current content callback.  We need to 
							// remove that so it will walk up the chain

							delete helpers._tags.content;

							can.view.live.replace([el], subtemplate(
								// This is the context of where `<content>` was found
								// which will have the the component's context
								rendererOptions.scope,

								rendererOptions.options));

							// restore the content tag so it could potentially be used again (as in lists)
							helpers._tags.content = render;
						}
					};
					// render the component's template
					frag = this.constructor.renderer(renderedScope, hookupOptions.options.add(helpers));
				} else {
					// otherwise render the contents between the 
					frag = can.view.frag(hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(helpers)) : "");
				}
				can.appendChild(el, frag);
			}
		});

	if (window.$ && $.fn) {
		$.fn.scope = function (attr) {
			if (attr) {
				return this.data("scope")
					.attr(attr);
			} else {
				return this.data("scope");
			}
		};
	}

	can.scope = function (el, attr) {
		el = can.$(el);
		if (attr) {
			return can.data(el, "scope")
				.attr(attr);
		} else {
			return can.data(el, "scope");
		}
	};

	return Component;
});