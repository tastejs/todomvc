/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["Tools", "DomUtils"],

/**
 * @class
 * Plugins is the link between the UI and your plugins.
 * You can design your own plugin, declare them in your UI, and call them
 * from the template, like :
 * <tag data-yourPlugin="method: param"></tag>
 * @see Model-Plugin for instance
 * @requires Tools
 */
function Plugins(Tools, DomUtils) {

	return function PluginsConstructor($plugins) {

		/**
		 * The list of plugins
		 * @private
		 */
		var _plugins = {},

		/**
		 * Just a "functionalification" of trim
		 * for code readability
		 * @private
		 */
		trim = function trim(string) {
			return string.trim();
		},

		/**
		 * Call the plugins methods, passing them the dom node
		 * A phrase can be :
		 * <tag data-plugin='method: param, param; method:param...'/>
		 * the function has to call every method of the plugin
		 * passing it the node, and the given params
		 * @private
		 */
		applyPlugin = function applyPlugin(node, phrase, plugin) {
			// Split the methods
			phrase.split(";")
			.forEach(function (couple) {
				// Split the result between method and params
				var split = couple.split(":"),
				// Trim the name
				method = split[0].trim(),
				// And the params, if any
				params = split[1] ? split[1].split(",").map(trim) : [];

				// The first param must be the dom node
				params.unshift(node);

				if (_plugins[plugin] && _plugins[plugin][method]) {
					// Call the method with the following params for instance :
					// [node, "param1", "param2" .. ]
					_plugins[plugin][method].apply(_plugins[plugin], params);
				}

			});
		};

		/**
		 * Add a plugin
		 *
		 * Note that once added, the function adds a "plugins" property to the plugin.
		 * It's an object that holds a name property, with the registered name of the plugin
		 * and an apply function, to use on new nodes that the plugin would generate
		 *
		 * @param {String} name the name of the data that the plugin should look for
		 * @param {Object} plugin the plugin that has the functions to execute
		 * @returns true if plugin successfully added.
		 */
		this.add = function add(name, plugin) {
			var that = this,
				propertyName = "plugins";

			if (typeof name == "string" && typeof plugin == "object" && plugin) {
				_plugins[name] = plugin;

				plugin[propertyName] = {
						name: name,
						apply: function apply() {
							return that.apply.apply(that, arguments);
						}
				};
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Add multiple plugins at once
		 * @param {Object} list key is the plugin name and value is the plugin
		 * @returns true if correct param
		 */
		this.addAll = function addAll(list) {
			return Tools.loop(list, function (plugin, name) {
				this.add(name, plugin);
			}, this);
		};

		/**
		 * Get a previously added plugin
		 * @param {String} name the name of the plugin
		 * @returns {Object} the plugin
		 */
		this.get = function get(name) {
			return _plugins[name];
		};

		/**
		 * Delete a plugin from the list
		 * @param {String} name the name of the plugin
		 * @returns {Boolean} true if success
		 */
		this.del = function del(name) {
			return delete _plugins[name];
		};

		/**
		 * Apply the plugins to a NodeList
		 * @param {HTMLElement|SVGElement} dom the dom nodes on which to apply the plugins
		 * @returns {Boolean} true if the param is a dom node
		 */
		this.apply = function apply(dom) {

			var nodes;

			if (DomUtils.isAcceptedType(dom)) {

				nodes = DomUtils.getNodes(dom);
				Tools.loop(Tools.toArray(nodes), function (node) {
					Tools.loop(DomUtils.getDataset(node), function (phrase, plugin) {
						applyPlugin(node, phrase, plugin);
					});
				});

				return dom;

			} else {
				return false;
			}
		};

		this.addAll($plugins);

	};
});
