void function() {

	var w = window,
		regexp = {
			trailingSpaces: /^\s+/
		},
		Helper = {
			resolveDom: function(compo, values) {
				if (compo.nodes != null) {
					if (compo.tagName != null) return compo;

					return mask.renderDom(compo.nodes, values);
				}
				if (compo.attr.template != null) {
					var e;
					if (compo.attr.template[0] === '#') {
						e = document.getElementById(compo.attr.template.substring(1));
						if (e == null) {
							console.error('Template Element not Found:', arg);
							return null;
						}
					}
					return mask.renderDom(e != null ? e.innerHTML : compo.attr.template, values);
				}
				return null;
			},
			ensureTemplate: function(compo) {
				if (compo.nodes != null) return;

				var template;
				if (compo.attr.template != null) {
					if (compo.attr.template[0] === '#') template = this.templateById(compo.attr.template.substring(1));
					else template = compo.attr.template;

					delete compo.attr.template;
				}
				if (typeof template == 'string') {
					template = mask.compile(template);
				}
				if (template != null) {
					compo.nodes = template;
					return;
				}

				return;
			},
			templateById: function(id) {
				var e = document.getElementById(id);
				if (e == null) console.error('Template Element not Found:', id);
				else
				return e.innerHTML;
				return '';
			},
			containerArray: function() {
				var arr = [];
				arr.appendChild = function(child) {
					this.push(child);
				}
				return arr;
			},
			parseSelector: function(selector, type, direction) {
				var key, prop, nextKey;

				if (key == null) {
					switch (selector[0]) {
					case '#':
						key = 'id';
						selector = selector.substring(1);
						prop = 'attr';
						break;
					case '.':
						key = 'class';
						selector = new RegExp('\\b' + selector.substring(1) + '\\b');
						prop = 'attr';
						break;
					default:
						key = type == 'node' ? 'tagName' : 'compoName';
						break;
					}
				}

				if (direction == 'up') nextKey = 'parent';
				else nextKey = type == 'node' ? 'nodes' : 'components';

				return {
					key: key,
					prop: prop,
					selector: selector,
					nextKey: nextKey
				}
			}
		},
		/**
		 *   Component Events. Fires only once.
		 *   Used for component Initialization.
		 *   Supported events:
		 *       DOMInsert
		 *       +custom
		 *   UI-Eevent exchange must be made over DOMLibrary
		 */
		Shots = { /** from parent to childs */
			emit: function(component, event, args) {
				if (component.listeners != null && event in component.listeners) {
					component.listeners[event].apply(component, args);
					delete component.listeners[event];
				}
				if (component.components instanceof Array) {
					for (var i = 0; i < component.components.length; i++) {
						Shots.emit(component.components[i], event, args);
					}
				}
			},
			on: function(component, event, fn) {
				if (component.listeners == null) component.listeners = {};
				component.listeners[event] = fn;
			}
		},
		Events_ = {
			on: function(component, events, $element) {
				if ($element == null) $element = component.$;
				
				var isarray = events instanceof Array,
					length = isarray ? events.length : 1,
					x = null;
				for (var i = 0; x = isarray ? events[i] : events, isarray ? i < length : i < 1; i++) {

					if (x instanceof Array) {
						$element.on.apply($element, x);
						continue;
					}


					for (var key in x) {
						var fn = typeof x[key] === 'string' ? component[x[key]] : x[key],
							parts = key.split(':');
							
						$element.on(parts[0] || 'click', parts.splice(1).join(':').trim() || null , fn.bind(component));
						
						
					}
				}
			}
		},
		Children_ = {
			select: function(component, compos) {
				for (var name in compos) {
					var data = compos[name],
						events = null,
						selector = null;
						
					if (data instanceof Array){
						selector = data[0];
						events = data.splice(1);
					}
					if (typeof data == 'string'){
						selector = data;
					}
					if (data == null){
						console.error('Unknown component child', name, compos[name]);
						return;
					}
					
					var index = selector.indexOf(':'),
						engine = selector.substring(0, index);

					engine = Compo.config.selectors[engine];

					if (engine == null) {
						component.compos[name] = component.$[0].querySelector(selector);						
					}else{
						selector = selector.substring(++index).replace(regexp.trailingSpaces, '');
						component.compos[name] = engine(component, selector);
					}
					
					if (events != null){
						Events_.on(component, events, component.compos[name]);
					}
				}
			}
		};

	w.Compo = Class({
		/**
		 * @param - arg -
		 *      1. object - model object, receive from mask.renderDom
		 *      Custom Initialization:
		 *      2. String - template
		 * @param cntx
		 *      1. maskDOM context
		 */
		Construct: function(arg) {
			if (typeof arg === 'string') {
				var template = arg;
				if (template[0] == '#') template = Helper.templateById(template.substring(1));
				this.nodes = mask.compile(template);
			}

		},
		render: function(values, container, cntx) {
			this.create(values, cntx);

			if (container != null) {
				for (var i = 0; i < this.$.length; i++) container.appendChild(this.$[i]);
			}
			return this;
		},
		insert: function(parent) {
			for (var i = 0; i < this.$.length; i++) parent.appendChild(this.$[i]);

			Shots.emit(this, 'DOMInsert');
			return this;
		},
		append: function(template, values, selector) {
			if (this.$ == null) {
				var dom = typeof template == 'string' ? mask.compile(template) : template,
					parent = selector ? Compo.findNode(this, selector) : this;

				if (parent.nodes == null) this.nodes = dom;
				else if (parent.nodes instanceof Array) parent.nodes.push(dom);
				else parent.nodes = [this.nodes, dom];

				return this;
			}
			var array = mask.renderDom(template, values, Helper.containerArray(), this),
				parent = selector ? this.$.find(selector) : this.$;

			for (var i = 0; i < array.length; i++) parent.append(array[i]);

			Shots.emit(this, 'DOMInsert');
			return this;
		},
		create: function(values, cntx) {
			if (cntx == null) cntx = this;

			Helper.ensureTemplate(this);

			var elements = mask.renderDom(this.tagName == null ? this.nodes : this, values, Helper.containerArray(), cntx);
			this.$ = $(elements);

			if (this.events != null) {
				Events_.on(this, this.events);
			}
			if (this.compos != null) {
				Children_.select(this, this.compos);
				//////for (var key in this.compos) {
				//////	if (typeof this.compos[key] !== 'string') continue;
				//////	var selector = this.compos[key],
				//////		index = selector.indexOf(':'),
				//////		engine = selector.substring(0, index);
				//////
				//////	engine = Compo.config.selectors[engine];
				//////
				//////	if (engine == null) {
				//////		this.compos[key] = this.$.get(0).querySelector(selector);
				//////		continue;
				//////	}
				//////
				//////	selector = selector.substring(++index).replace(regexp.trailingSpaces, '');
				//////	this.compos[key] = engine(this, selector);
				//////
				//////}
			}

			return this;
		},
		on: function() {
			var x = Array.prototype.slice.call(arguments)
			switch (arguments.length) {
			case 1:
			case 2:
				x.unshift('click');
				break;

			}

			if (this.events == null) this.events = [x];
			else if (this.events instanceof Array) this.events.push(x)
			else this.events = [x, this.events];
			return this;
		},
		remove: function() {
			this.$ && this.$.remove();
			Compo.dispose(this);

			if (this.parent != null) {
				var i = this.parent.components.indexOf(this);
				this.parent.components.splice(i, 1);
			}

			return this;
		},
		Static: {
			config: {
				selectors: {
					'$': function(compo, selector) {
						var r = compo.$.find(selector);
						return r.length > 0 ? r : compo.$.filter(selector);
					},
					'compo': function(compo, selector) {
						var r = Compo.findCompo(compo, selector);
						return r;
					}
				},
				/**
				 @default, global $ is used
				 IDOMLibrary = {
				 {fn}(elements) - create dom-elements wrapper,
				 on(event, selector, fn) - @see jQuery 'on'
				 }
				 */
				setDOMLibrary: function(lib) {
					$ = lib;
				}
			},
			match: function(compo, selector, type) {
				if (typeof selector === 'string') {
					if (type == null) type = compo.compoName ? 'compo' : 'node';
					selector = Helper.parseSelector(selector, type, direction);
				}

				var obj = selector.prop ? compo[selector.prop] : compo;
				if (obj == null) return false;

				if (selector.selector.test != null) {
					if (selector.selector.test(obj[selector.key])) return true;
				} else {
					if (obj[selector.key] == selector.selector) return true;
				}
				return false;
			},
			find: function(compo, selector, direction, type) {
				if (compo == null) return null;

				if (typeof selector === 'string') {
					if (type == null) type = compo.compoName ? 'compo' : 'node';
					selector = Helper.parseSelector(selector, type, direction);

				}

				if (compo instanceof Array) {
					for (var i = 0, x, length = compo.length; x = compo[i], i < length; i++) {
						var r = Compo.find(x, selector);


						if (r != null) return r;
					}
					return null;
				}

				if (Compo.match(compo, selector) == true) return compo;

				return Compo.find(compo[selector.nextKey], selector);
			},
			findCompo: function(compo, selector, direction) {
				return Compo.find(compo, selector, direction, 'compo');

			},
			findNode: function(compo, selector, direction) {
				return Compo.find(compo, selector, direction, 'node');
			},
			dispose: function(compo) {
				compo.dispose && compo.dispose();
				if (this.components == null) return;
				for (var i = 0, x, length = compo.components.length; x = compo.components[i], i < length; i++) {
					Compo.dispose(x);
				}
			},
			events: Shots
		}
	});

	/** CompoUtils */
	var Traversing = {
		find: function(selector, type) {
			return Compo.find(this, selector, null, type || 'compo');
		},
		closest: function(selector, type) {
			return Compo.find(this, selector, 'up', type || 'compo');
		},
		all: function(selector, type) {
			var current = arguments[2] || this,
				arr = arguments[3] || []

				if (typeof selector === 'string') selector = Helper.parseSelector(selector, type);


			if (Compo.match(current, selector)) {
				arr.push(current);
			}

			var childs = current[selector.nextKey];

			if (childs != null) {
				for (var i = 0; i < childs.length; i++) {
					this.all(selector, null, childs[i], arr);
				}
			}

			return arr;
		}
	}

	var Manipulate = {
		addClass: function(_class) {
			this.attr.class = this.attr.class ? this.attr.class + ' ' + _class : _class;
		}
	}

	w.CompoUtils = Class({
		Extends: [Traversing, Manipulate]
	});

}();