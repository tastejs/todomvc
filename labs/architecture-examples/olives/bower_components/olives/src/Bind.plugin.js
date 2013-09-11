/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["Store", "Observable", "Tools", "DomUtils"],

/**
 * @class
 * This plugin links dom nodes to a model
 * @requires Store, Observable
 */
function BindPlugin(Store, Observable, Tools, DomUtils) {

	return function BindPluginConstructor($model, $bindings) {

		/**
		 * The model to watch
		 * @private
		 */
		var _model = null,

		/**
		 * The list of custom bindings
		 * @private
		 */
		_bindings = {},

		/**
		 * The list of itemRenderers
		 * each foreach has its itemRenderer
		 * @private
		 */
		_itemRenderers = {};

		/**
		 * The observers handlers
		 * for debugging only
		 * @private
		 */
		this.observers = {};

		/**
		 * Define the model to watch for
		 * @param {Store} model the model to watch for changes
		 * @returns {Boolean} true if the model was set
		 */
		this.setModel = function setModel(model) {
			if (model instanceof Store) {
				// Set the model
				_model = model;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Get the store that is watched for
		 * for debugging only
		 * @private
		 * @returns the Store
		 */
		this.getModel = function getModel() {
			return _model;
		};

		/**
		 * The item renderer defines a dom node that can be duplicated
		 * It is made available for debugging purpose, don't use it
		 * @private
		 */
		this.ItemRenderer = function ItemRenderer($plugins, $rootNode) {

			/**
			 * The node that will be cloned
			 * @private
			 */
			var _node = null,

			/**
			 * The object that contains plugins.name and plugins.apply
			 * @private
			 */
			_plugins = null,

			/**
			 * The _rootNode where to append the created items
			 * @private
			 */
			_rootNode = null,

			/**
			 * The lower boundary
			 * @private
			 */
			_start = null,

			/**
			 * The number of item to display
			 * @private
			 */
			_nb = null;

			/**
			 * Set the duplicated node
			 * @private
			 */
			this.setRenderer = function setRenderer(node) {
				_node = node;
				return true;
			};

			/**
			 * Returns the node that is going to be used for rendering
			 * @private
			 * @returns the node that is duplicated
			 */
			this.getRenderer = function getRenderer() {
				return _node;
			};

			/**
			 * Sets the rootNode and gets the node to copy
			 * @private
			 * @param {HTMLElement|SVGElement} rootNode
			 * @returns
			 */
			this.setRootNode = function setRootNode(rootNode) {
				var renderer;
				if (DomUtils.isAcceptedType(rootNode)) {
					_rootNode = rootNode;
					renderer = _rootNode.querySelector("*");
					this.setRenderer(renderer);
					renderer && _rootNode.removeChild(renderer);
					return true;
				} else {
					return false;
				}
			};

			/**
			 * Gets the rootNode
			 * @private
			 * @returns _rootNode
			 */
			this.getRootNode = function getRootNode() {
				return _rootNode;
			};

			/**
			 * Set the plugins objet that contains the name and the apply function
			 * @private
			 * @param plugins
			 * @returns true
			 */
			this.setPlugins = function setPlugins(plugins) {
				_plugins = plugins;
				return true;
			};

			/**
			 * Get the plugins object
			 * @private
			 * @returns the plugins object
			 */
			this.getPlugins = function getPlugins() {
				return _plugins;
			};

			/**
			 * The nodes created from the items are stored here
			 * @private
			 */
			this.items = new Store([]);

			/**
			 * Set the start limit
			 * @private
			 * @param {Number} start the value to start rendering the items from
			 * @returns the value
			 */
			this.setStart = function setStart(start) {
				return _start = parseInt(start, 10);
			};

			/**
			 * Get the start value
			 * @private
			 * @returns the start value
			 */
			this.getStart = function getStart() {
				return _start;
			};

			/**
			 * Set the number of item to display
			 * @private
			 * @param {Number/String} nb the number of item to display or "*" for all
			 * @returns the value
			 */
			this.setNb = function setNb(nb) {
				return _nb = nb == "*" ? nb : parseInt(nb, 10);
			};

			/**
			 * Get the number of item to display
			 * @private
			 * @returns the value
			 */
			this.getNb = function getNb() {
				return _nb;
			};

			/**
			 * Adds a new item and adds it in the items list
			 * @private
			 * @param {Number} id the id of the item
			 * @returns
			 */
			this.addItem = function addItem(id) {
				var node,
					next;

				if (typeof id == "number" && !this.items.get(id)) {
					node = this.create(id);
					if (node) {
						// IE (until 9) apparently fails to appendChild when insertBefore's second argument is null, hence this.
						next = this.getNextItem(id);
						next ? _rootNode.insertBefore(node, next) : _rootNode.appendChild(node);
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			};

			/**
			 * Get the next item in the item store given an id.
			 * @private
			 * @param {Number} id the id to start from
			 * @returns
			 */
			this.getNextItem = function getNextItem(id) {
				return this.items.alter("slice", id+1).filter(function (value) {
					if (DomUtils.isAcceptedType(value)) {
						return true;
					}
				})[0];
			};

			/**
			 * Remove an item from the dom and the items list
			 * @private
			 * @param {Number} id the id of the item to remove
			 * @returns
			 */
			this.removeItem = function removeItem(id) {
				var item = this.items.get(id);
				if (item) {
					_rootNode.removeChild(item);
					this.items.set(id);
					return true;
				} else {
					return false;
				}
			};

			/**
			 * create a new node. Actually makes a clone of the initial one
			 * and adds pluginname_id to each node, then calls plugins.apply to apply all plugins
			 * @private
			 * @param id
			 * @param pluginName
			 * @returns the associated node
			 */
			this.create = function create(id) {
				if (_model.has(id)) {
					var newNode = _node.cloneNode(true),
					nodes = DomUtils.getNodes(newNode);

					Tools.toArray(nodes).forEach(function (child) {
	            		child.setAttribute("data-" + _plugins.name+"_id", id);
					});

					this.items.set(id, newNode);
					_plugins.apply(newNode);
					return newNode;
				}
			};

			/**
			 * Renders the dom tree, adds nodes that are in the boundaries
			 * and removes the others
			 * @private
			 * @returns true boundaries are set
			 */
			this.render = function render() {
				// If the number of items to render is all (*)
				// Then get the number of items
				var _tmpNb = _nb == "*" ? _model.getNbItems() : _nb;

				// This will store the items to remove
				var marked = [];

				// Render only if boundaries have been set
				if (_nb !== null && _start !== null) {

					// Loop through the existing items
					this.items.loop(function (value, idx) {
						// If an item is out of the boundary
						if (idx < _start || idx >= (_start + _tmpNb) || !_model.has(idx)) {
							// Mark it
							marked.push(idx);
						}
					}, this);

					// Remove the marked item from the highest id to the lowest
					// Doing this will avoid the id change during removal
					// (removing id 2 will make id 3 becoming 2)
					marked.sort(Tools.compareNumbers).reverse().forEach(this.removeItem, this);

					// Now that we have removed the old nodes
					// Add the missing one
					for (var i=_start, l=_tmpNb+_start; i<l; i++) {
						this.addItem(i);
					}
					return true;
				} else {
					return false;
				}
			};

			this.setPlugins($plugins);
			this.setRootNode($rootNode);
		};

		/**
		 * Save an itemRenderer according to its id
		 * @private
		 * @param {String} id the id of the itemRenderer
		 * @param {ItemRenderer} itemRenderer an itemRenderer object
		 */
		this.setItemRenderer = function setItemRenderer(id, itemRenderer) {
			id = id || "default";
			_itemRenderers[id] = itemRenderer;
		};

		/**
		 * Get an itemRenderer
		 * @private
		 * @param {String} id the name of the itemRenderer
		 * @returns the itemRenderer
		 */
		this.getItemRenderer = function getItemRenderer(id) {
			return _itemRenderers[id];
		};

		/**
		 * Expands the inner dom nodes of a given dom node, filling it with model's values
		 * @param {HTMLElement|SVGElement} node the dom node to apply foreach to
		 */
		this.foreach = function foreach(node, idItemRenderer, start, nb) {
			var itemRenderer = new this.ItemRenderer(this.plugins, node);

			itemRenderer.setStart(start || 0);
			itemRenderer.setNb(nb || "*");

			itemRenderer.render();

			// Add the newly created item
            _model.watch("added", itemRenderer.render, itemRenderer);

			// If an item is deleted
            _model.watch("deleted", function (idx) {
            	itemRenderer.render();
                // Also remove all observers
                this.observers[idx] && this.observers[idx].forEach(function (handler) {
                	_model.unwatchValue(handler);
                }, this);
                delete this.observers[idx];
            },this);

            this.setItemRenderer(idItemRenderer, itemRenderer);
         };

         /**
          * Update the lower boundary of a foreach
          * @param {String} id the id of the foreach to update
          * @param {Number} start the new value
          * @returns true if the foreach exists
          */
         this.updateStart = function updateStart(id, start) {
        	 var itemRenderer = this.getItemRenderer(id);
        	 if (itemRenderer) {
        		 itemRenderer.setStart(start);
        		 return true;
        	 } else {
        		 return false;
        	 }
         };

         /**
          * Update the number of item to display in a foreach
          * @param {String} id the id of the foreach to update
          * @param {Number} nb the number of items to display
          * @returns true if the foreach exists
          */
         this.updateNb = function updateNb(id, nb) {
        	 var itemRenderer = this.getItemRenderer(id);
        	 if (itemRenderer) {
        		 itemRenderer.setNb(nb);
        		 return true;
        	 } else {
        		 return false;
        	 }
         };

         /**
          * Refresh a foreach after having modified its limits
          * @param {String} id the id of the foreach to refresh
          * @returns true if the foreach exists
          */
         this.refresh = function refresh(id) {
        	var itemRenderer = this.getItemRenderer(id);
    	 	if (itemRenderer) {
    	 		itemRenderer.render();
    	 		return true;
    	 	} else {
    	 		return false;
    	 	}
         };

		/**
		 * Both ways binding between a dom node attributes and the model
		 * @param {HTMLElement|SVGElement} node the dom node to apply the plugin to
		 * @param {String} name the name of the property to look for in the model's value
		 * @returns
		 */
		this.bind = function bind(node, property, name) {

			// Name can be unset if the value of a row is plain text
			name = name || "";

			// In case of an array-like model the id is the index of the model's item to look for.
			// The _id is added by the foreach function
			var id = node.getAttribute("data-" + this.plugins.name+"_id"),

			// Else, it is the first element of the following
			split = name.split("."),

			// So the index of the model is either id or the first element of split
			modelIdx = id || split.shift(),

			// And the name of the property to look for in the value is
			prop = id ? name : split.join("."),

			// Get the model's value
			get =  Tools.getNestedProperty(_model.get(modelIdx), prop),

			// When calling bind like bind:newBinding,param1, param2... we need to get them
			extraParam = Tools.toArray(arguments).slice(3);

			// 0 and false are acceptable falsy values
			if (get || get === 0 || get === false) {
				// If the binding hasn't been overriden
				if (!this.execBinding.apply(this,
						[node, property, get]
					// Extra params are passed to the new binding too
						.concat(extraParam))) {
					// Execute the default one which is a simple assignation
					//node[property] = get;
					DomUtils.setAttribute(node, property, get);
				}
			}

			// Only watch for changes (double way data binding) if the binding
			// has not been redefined
			if (!this.hasBinding(property)) {
				node.addEventListener("change", function (event) {
					if (_model.has(modelIdx)) {
						if (prop) {
							_model.update(modelIdx, name, node[property]);
						} else {
							_model.set(modelIdx, node[property]);
						}
					}
				}, true);

			}

			// Watch for changes
			this.observers[modelIdx] = this.observers[modelIdx] || [];
			this.observers[modelIdx].push(_model.watchValue(modelIdx, function (value) {
				if (!this.execBinding.apply(this,
						[node, property, Tools.getNestedProperty(value, prop)]
						// passing extra params too
						.concat(extraParam))) {
					//node[property] = Tools.getNestedProperty(value, prop);
					DomUtils.setAttribute(node, property, Tools.getNestedProperty(value, prop));
				}
			}, this));

		};

		/**
		 * Set the node's value into the model, the name is the model's property
		 * @private
		 * @param {HTMLElement|SVGElement} node
		 * @returns true if the property is added
		 */
		this.set = function set(node) {
			if (DomUtils.isAcceptedType(node) && node.name) {
				_model.set(node.name, node.value);
				return true;
			} else {
				return false;
			}
		};

		this.getItemIndex = function getElementId(dom) {
			var dataset = DomUtils.getDataset(dom);

			if (dataset && typeof dataset[this.plugins.name + "_id"] != "undefined") {
				return +dataset[this.plugins.name + "_id"];
			} else {
				return false;
			}
		};

		/**
		 * Prevents the submit and set the model with all form's inputs
		 * @param {HTMLFormElement} form
		 * @returns true if valid form
		 */
		this.form = function form(form) {
			if (form && form.nodeName == "FORM") {
				var that = this;
				form.addEventListener("submit", function (event) {
					Tools.toArray(form.querySelectorAll("[name]")).forEach(that.set, that);
					event.preventDefault();
				}, true);
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Add a new way to handle a binding
		 * @param {String} name of the binding
		 * @param {Function} binding the function to handle the binding
		 * @returns
		 */
		this.addBinding = function addBinding(name, binding) {
			if (name && typeof name == "string" && typeof binding == "function") {
				_bindings[name] = binding;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Execute a binding
		 * Only used by the plugin
		 * @private
		 * @param {HTMLElement} node the dom node on which to execute the binding
		 * @param {String} name the name of the binding
		 * @param {Any type} value the value to pass to the function
		 * @returns
		 */
		this.execBinding = function execBinding(node, name) {
			if (this.hasBinding(name)) {
				_bindings[name].apply(node, Array.prototype.slice.call(arguments, 2));
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Check if the binding exists
		 * @private
		 * @param {String} name the name of the binding
		 * @returns
		 */
		this.hasBinding = function hasBinding(name) {
			return _bindings.hasOwnProperty(name);
		};

		/**
		 * Get a binding
		 * For debugging only
		 * @private
		 * @param {String} name the name of the binding
		 * @returns
		 */
		this.getBinding = function getBinding(name) {
			return _bindings[name];
		};

		/**
		 * Add multiple binding at once
		 * @param {Object} list the list of bindings to add
		 * @returns
		 */
		this.addBindings = function addBindings(list) {
			return Tools.loop(list, function (binding, name) {
				this.addBinding(name, binding);
			}, this);
		};

		// Inits the model
		this.setModel($model);
		// Inits bindings
		this.addBindings($bindings);


	};

});
