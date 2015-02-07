/**
 * Root object of the Lava framework
 */
var Lava = {
	/**
	 * Version numbers, split by comma to allow easier comparison of versions
	 */
	version: [],

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Default namespaces reservation. All root members must be reserved ahead - v8 optimization.

	/** @ignore */
	schema: null,
	/** @ignore */
	ClassManager: null,
	/** @ignore */
	ExpressionParser: null,
	/** @ignore */
	TemplateParser: null,
	/** @ignore */
	ObjectParser: null,
	/** @ignore */
	TemplateWalker: null,
	/** @ignore */
	transitions: null,
	/** @ignore */
	Cron: null,
	/** @ignore */
	Core: null,
	/** @ignore */
	ScopeManager: null,
	/** @ignore */
	modifiers: null,
	/** @ignore */
	types: null,
	/** @ignore */
	extenders: null,
	/** @ignore */
	resources: null,
	/** @ignore */
	algorithms: {
		sorting: {}
	},

	/** @ignore */
	animation: {},
	/** @ignore */
	animator: {},
	/** @ignore */
	data: {},
	/** @ignore */
	system: {},
	/** @ignore */
	mixin: {},
	/** @ignore */
	parsers: {},
	/** @ignore */
	view: {},
	/** @ignore */
	widget: {},
	/** @ignore */
	scope: {},
	/**
	 * Place for any other user defined classes and variables
	 */
	user: {},

	/**
	 * Global App class instance
	 * @type {Lava.system.App}
	 */
	app: null,
	/**
	 * Global ViewManager instance
	 * @type {Lava.system.ViewManager}
	 */
	view_manager: null,
	/**
	 * Global PopoverManager instance
	 * @type {Lava.system.PopoverManager}
	 */
	popover_manager: null,
	/**
	 * Global FocusManager instance
	 * @type {Lava.system.FocusManager}
	 */
	focus_manager: null,
	/**
	 * Default instance of {@link Lava.system.Serializer}
	 * @type {Lava.system.Serializer}
	 */
	serializer: null,

	/**
	 * Container for locale-specific data (strings, date formats, etc)
	 * @type {Object.<string, Object>}
	 */
	locales: {},

	/**
	 * Global named widget configs
	 * @type {Object.<string, _cWidget>}
	 */
	widgets: {},
	/**
	 * Tag names that are parsed by Sugar class
	 * @type {Object.<string, _cSugarSchema>}
	 */
	sugar_map: {},
	/**
	 * All class definitions are stored here until framework initialization to allow monkey-patching
	 */
	classes: {},

	// end: default namespaces reservation
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// constants and predefined data

	/**
	 * Types of template arguments, allowed in view events and roles
	 * @enum {number}
	 */
	TARGET_ARGUMENT_TYPES: {
		VALUE: 1,
		BIND: 2
	},

	/**
	 * <str>"id"</str> attribute of framework's DOM elements start with this prefix.
	 * When changing this, you must also change SYSTEM_ID_REGEX
	 * @const
	 * */
	ELEMENT_ID_PREFIX: 'e',
	/**
	 * Does a string represent a valid element's id, used by the framework
	 */
	SYSTEM_ID_REGEX: /^e?\\d+$/,
	/**
	 * May a string be used as property/include name
	 */
	VALID_PROPERTY_NAME_REGEX: /^[a-zA-Z\_\$][a-zA-Z0-9\_\$]*$/,
	/**
	 * Match empty string or string with spaces
	 */
	EMPTY_REGEX: /^\s*$/,
	/**
	 * May a string be used as view's label
	 */
	VALID_LABEL_REGEX: /^[A-Za-z\_][A-Za-z\_0-9]*$/,

	/**
	 * Default comparison function
	 * @returns {boolean}
	 */
	DEFAULT_LESS: function(a, b) { return a < b; },
	// not sure if these obsolete tags should also be included: basefont, bgsound, frame, isindex
	/**
	 * HTML tags that do not require a closing tag
	 */
	VOID_TAGS: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
	/**
	 * List of all JavaScript keywords, used when serializing objects
	 */
	JS_KEYWORDS: ['break','case','catch','class','const','continue','debugger','default','delete','do','else','export','extends','false','finally',
		'for','function','if','import','in','instanceof','new','null','protected','return','super','switch','this','throw','true','try','typeof',
		'var','while','with','abstract','boolean','byte','char','decimal','double','enum','final','float','get','implements','int','interface',
		'internal','long','package','private','protected','public','sbyte','set','short','static','uint','ulong','ushort','void','assert','ensure',
		'event','goto','invariant','namespace','native','require','synchronized','throws','transient','use','volatile'],

	/**
	 * List of common framework exceptions to make the framework smaller in size. May be excluded in production
	 */
	KNOWN_EXCEPTIONS: null,

	// end: constants and predefined data
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// class members

	/**
	 * Cache for sugar API: sugar class instances for global widgets
	 * @type {Object.<string, Lava.system.Sugar>}
	 */
	_widget_title_to_sugar_instance: {},
	/**
	 * Global instances of Sugar class by class name
	 * @type {Object.<string, Lava.system.Sugar>}
	 */
	_sugar_instances: {},

	/**
	 * Global UID counter
	 * @type {_tGUID}
	 */
	guid: 1,

	/**
	 * Create all classes and global class instances.
	 * Must be called before bootstrap() or creating any widgets. Replaces itself with <kw>null</kw> after first use.
	 */
	init: function() {

		var path,
			i = 0,
			count;

		// You must know this yourself
		// for (var name in {}) Lava.t("LiquidLava framework can not coexist with frameworks that modify native object's prototype");

		if (typeof(Firestorm) == 'undefined') Lava.t('init: Firestorm is not loaded');

		this.ClassManager.registerRootNamespace('Lava', this);
		this.ScopeManager.init();

		for (path in this.classes) {

			this._loadClass(path);

		}

		this.serializer = new Lava.system.Serializer(Lava.schema.default_serializer_config);

		if (typeof(window) != 'undefined') {
			this._initGlobals();
			this.ClassManager.registerExistingConstructor('Lava.WidgetConfigExtensionGateway', this.WidgetConfigExtensionGateway);
			this.ClassManager.registerExistingConstructor('Lava.ClassLocatorGateway', this.ClassLocatorGateway);
		}

		for (count = this.schema.SUGAR_CLASSES.length; i < count; i++) {

			this.registerSugar(this.schema.SUGAR_CLASSES[i]);

		}

		this.define = this.define_Normal;
		this.init = null;

	},

	/**
	 * Create global class instances
	 */
	_initGlobals: function() {

		this._initGlobal(Lava.schema.system.VIEW_MANAGER_CLASS, 'view_manager');
		this._initGlobal(Lava.schema.system.APP_CLASS, 'app');
		this._initGlobal(Lava.schema.popover_manager.CLASS, 'popover_manager');
		this._initGlobal(Lava.schema.focus_manager.CLASS, 'focus_manager');

	},

	_initGlobal: function(class_name, property_name) {

		if (class_name) {
			var constructor = this.ClassManager.getConstructor(class_name);
			this[property_name] = new constructor();
		}

	},

	/**
	 * Validate and then eval the passed string.
	 * String does not necessarily need to be in strict JSON format, just any valid plain JS object (without logic!).
	 * Obviously, you must use this function only with the code you trust
	 * @param {string} serialized_object
	 */
	parseOptions: function(serialized_object) {
		Lava.schema.VALIDATE_OPTIONS && this.ObjectParser.parse(serialized_object);
		return eval('(' + serialized_object + ')');
	},

	/**
	 * Does the string represent a valid identifier, that can be referenced from expressions
	 * @param {string} id
	 * @returns {boolean}
	 */
	isValidId: function(id) {

		return this.VALID_LABEL_REGEX.test(id) && !this.SYSTEM_ID_REGEX.test(id);

	},

	/**
	 * Log a recoverable error
	 * @param {string} msg
	 */
	logError: function(msg) {

		if (typeof(window) == 'undefined') throw new Error(msg); // Node environment

		if (window.console) {
			window.console.error(msg);
		}

	},

	/**
	 * Log a caught exception
	 * @param {(Error|string|number)} e
	 */
	logException: function(e) {

		this.logError((typeof(e) == 'string' || typeof(e) == 'number') ? e : e.message);

	},

	/**
	 * Get extended config of global named widget
	 * @param {string} widget_title
	 * @returns {_cWidget}
	 */
	getWidgetConfig: function(widget_title) {

		if (Lava.schema.DEBUG && !(widget_title in this.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = this.widgets[widget_title];

		if (!config.is_extended) {

			Lava.extenders[config.extender_type](config);

		}

		return config;

	},

	/**
	 * Create a root widget instance
	 * @param {string} extends_title Name of global parent widget
	 * @param {_cWidget} [config] Partial config for new widget, will be extended with parent's config
	 * @param {Object} [properties] Properties for created widget
	 * @returns {Lava.widget.Standard} Created widget instance
	 */
	createWidget: function(extends_title, config, properties) {

		var widget_config = this.getWidgetConfig(extends_title),
			constructor;

		if (config) {

			if (Lava.schema.DEBUG && config['extends'] && config['extends'] != extends_title) Lava.t("Malformed widget config");

			config['extends'] = extends_title;
			Lava.extenders[config.extender_type || widget_config.extender_type](config);

		} else {

			// all widgets from schema must have their class present
			config = widget_config;

		}

		constructor = Lava.ClassManager.getConstructor(config['class']);
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + class_name);
		return /** @type {Lava.widget.Standard} */ new constructor(config, null, null, null, properties);

	},

	/**
	 * Is there a global widget with such `widget_title` registered
	 * @param {string} widget_title
	 * @returns {boolean}
	 */
	hasWidgetConfig: function(widget_title) {

		return widget_title in this.widgets;

	},

	/**
	 * Take an array of event names and remove default from {@link Lava.schema#system.DEFAULT_EVENTS}
	 * @param {Array.<string>} event_names
	 * @returns {Array.<string>} Filtered array of event names
	 */
	excludeDefaultEvents: function(event_names) {

		var i = 0,
			count = event_names.length,
			result = [];

		for (; i < count; i++) {

			if (Lava.schema.system.DEFAULT_EVENTS.indexOf(event_names[i]) == -1) {

				result.push(event_names[i]);

			}

		}

		return result;

	},

	/**
	 * Throw an error
	 * @param {string} [message] Defaults to <str>"Debug assertion failed"</str>
	 */
	t: function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	/**
	 * Create an instance of `class_name` and register it as sugar processor {@link Lava.system.Sugar}
	 * @param class_name
	 */
	registerSugar: function(class_name) {

		if (Lava.schema.DEBUG && (class_name in this._sugar_instances)) Lava.t('Class is already registered as sugar');
		var constructor = this.ClassManager.getConstructor(class_name);
		this._sugar_instances[class_name] = new constructor();

	},

	/**
	 * Get a Sugar class instance by it's name
	 * @param {string} class_name
	 * @returns {Lava.system.Sugar}
	 */
	getSugarInstance: function(class_name) {

		return this._sugar_instances[class_name];

	},

	/**
	 * Get a Sugar class instance by the title of the widget (each widget has a class that processes sugar for it)
	 * @param {string} widget_title
	 * @returns {_iSugarParser}
	 */
	getWidgetSugarInstance: function(widget_title) {

		var sugar_class,
			widget_config;

		if (!(widget_title in this._widget_title_to_sugar_instance)) {

			widget_config = this.getWidgetConfig(widget_title);
			if (!('sugar' in widget_config)) Lava.t("Widget " + widget_title + " does not have sugar in configuration");
			sugar_class = widget_config.sugar['class'] || Lava.schema.widget.DEFAULT_SUGAR_CLASS;
			this._widget_title_to_sugar_instance[widget_title] = this._sugar_instances[sugar_class];

		}

		return this._widget_title_to_sugar_instance[widget_title];

	},

	/**
	 * Register a global widget config
	 * @param {string} widget_title Title for new global widget
	 * @param {_cWidget} widget_config
	 */
	storeWidgetSchema: function(widget_title, widget_config) {

		if (!Lava.schema.widget.ALLOW_REDEFINITION && (widget_title in this.widgets))
			Lava.t("storeWidgetSchema: widget is already defined: " + widget_title);

		this.widgets[widget_title] = widget_config;

		if (('sugar' in widget_config) && widget_config.sugar.tag_name) {

			this.sugar_map[widget_config.sugar.tag_name] = {widget_title: widget_title};

		}

	},

	/**
	 * Parse the page &lt;body&gt; or special "lava-app" regions in the page and replace them with widgets
	 */
	bootstrap: function() {

		this.init && this.init();

		// focus manager must be initialized before any widgets are in DOM, so it could receive the focus event
		// which can be fired after insertion
		Lava.schema.focus_manager.IS_ENABLED && this.focus_manager && this.focus_manager.enable();

		var body = document.body,
			app_class = Firestorm.Element.getProperty(body, 'lava-app'),
			bootstrap_targets,
			i = 0,
			count;

		if (app_class != null) {

			this._elementToWidget(body);

		} else {

			bootstrap_targets = Firestorm.selectElements('script[type="lava/app"],lava-app');
			for (count = bootstrap_targets.length; i < count; i++) {

				if (Firestorm.Element.getTagName(bootstrap_targets[i]) == 'script') {
					this._scriptToWidget(bootstrap_targets[i]);
				} else {
					this._elementToWidget(bootstrap_targets[i]);
				}

			}

		}

		Lava.schema.popover_manager.IS_ENABLED && this.popover_manager && this.popover_manager.enable();

	},

	/**
	 * Convert a DOM element to widget instance
	 * @param {HTMLElement} element
	 * @returns {Lava.widget.Standard}
	 */
	_elementToWidget: function(element) {

		var widget,
			raw_template = Lava.TemplateParser.parseRaw(Firestorm.Element.getOuterHTML(element)),
			raw_tag,
			config,
			constructor;

		if (Lava.schema.DEBUG && raw_template.length != 1) Lava.t();

		raw_tag = raw_template[0];
		config = Lava.parsers.Common.toWidget(raw_tag);
		config.is_extended = true;
		config['class'] = raw_tag.attributes['lava-app'];

		if (raw_tag.attributes.id) Firestorm.Element.removeProperty(element, 'id'); // needed for captureExistingElement

		constructor = Lava.ClassManager.getConstructor(config['class'] || 'Lava.widget.Standard', 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + config['class']);
		widget = /** @type {Lava.widget.Standard} */ new constructor(config);
		widget.injectIntoExistingElement(element);
		return widget;

	},

	/**
	 * Convert a script DOM element to widget instance
	 * @param {HTMLElement} script_element
	 * @returns {Lava.widget.Standard}
	 */
	_scriptToWidget: function(script_element) {

		var widget,
			config,
			constructor,
			id = Firestorm.Element.getProperty(script_element, 'id'),
			class_name = Firestorm.Element.getProperty(script_element, 'lava-app');

		config = {
			type: 'widget',
			is_extended: true,
			template: null,
			container: {type: 'Morph'}
		};
		config.template = Lava.TemplateParser.parse(Firestorm.Element.getProperty(script_element, 'html'), config);

		if (id) {
			config.id = id;
			Firestorm.Element.removeProperty(script_element, 'id');
		}

		constructor = Lava.ClassManager.getConstructor(class_name || 'Lava.widget.Standard', 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + class_name);
		widget = /** @type {Lava.widget.Standard} */ new constructor(config);
		widget.inject(script_element, 'After');
		Firestorm.Element.destroy(script_element);
		return widget;

	},

	/**
	 * Behaves like a widget constructor, but accepts raw (unextended) widget config.
	 * Extends the config and creates the widget instance with the right class. Extension process stores the right
	 * class in widget config, so next time a widget is constructed - this method is not called.
	 *
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 * @returns {Lava.widget.Standard}
	 */
	WidgetConfigExtensionGateway: function(config, widget, parent_view, template, properties) {

		// here we do not need to check if the config is already extended, cause otherwise it would have real class
		// and it's constructor would be called directly.
		Lava.extenders[config.extender_type](config);

		if ('class_locator' in config) {

			config['class'] = Lava.schema.widget.DEFAULT_CLASS_LOCATOR_GATEWAY;

		}

		if (Lava.schema.DEBUG && !config['class']) Lava.t("Trying to create a widget without class");
		var constructor = Lava.ClassManager.getConstructor(config['class'], 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t("Class not found: " + config['class']);
		return new constructor(config, widget, parent_view, template, properties);

	},

	/**
	 * Behaves like view/widget constructor, but resolves the correct class name from widget hierarchy
	 *
	 * @param {(_cView|_cWidget)} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 * @returns {(Lava.widget.Standard|Lava.view.Abstract)}
	 */
	ClassLocatorGateway: function(config, widget, parent_view, template, properties) {

		var name_source = Lava.view_manager.locateTarget(widget, config.class_locator.locator_type, config.class_locator.name);
		if (Lava.schema.DEBUG && (!name_source || !name_source.isWidget)) Lava.t("[ClassLocatorGateway] Target is null or not a widget");

		var constructor = name_source.getPackageConstructor(config.real_class);
		return new constructor(config, widget, parent_view, template, properties);

	},

	/**
	 * Store class body in `this.classes`. Will be replaced with `define_Normal` inside `init()`
	 * @param {string} class_name Name of the class
	 * @param {Object} class_object Class body
	 */
	define: function(class_name, class_object) {

		this.classes[class_name] = class_object;

	},

	/**
	 * Proxy to {@link Lava.ClassManager#define}
	 * @param {string} class_name Name of the class
	 * @param {Object} class_object Class body
	 */
	define_Normal: function(class_name, class_object) {

		this.ClassManager.define(class_name, class_object);

	},

	/**
	 * Recursively define a class, stored in `this.classes`
	 * @param {string} path
	 */
	_loadClass: function(path) {

		var class_body = this.classes[path],
			i = 0,
			count;

		if (Lava.schema.DEBUG && !class_body) Lava.t("[Lava::_loadClass] Class does not exists: " + path);

		if ('Extends' in class_body) {
			if (!this.ClassManager.hasClass(class_body.Extends)) {
				this._loadClass(class_body.Extends);
			}
		}

		if ('Implements' in class_body) {
			if (typeof(class_body.Implements) == 'string') {
				if (!this.ClassManager.hasClass(class_body.Implements)) {
					this._loadClass(class_body.Implements);
				}
			} else {
				for (count = class_body.Implements.length; i < count; i++) {
					if (!this.ClassManager.hasClass(class_body.Implements[i])) {
						this._loadClass(class_body.Implements[i]);
					}
				}
			}
		}

		this.ClassManager.define(path, class_body);

	},

	/**
	 * Create a function, which returns a clone of given template or config.
	 * Note: widget configs must not be extended!
	 * @param {*} config Any clonable JavaScript object without circular references
	 * @returns {function}
	 */
	createCloner: function(config) {

		return new Function('return ' + this.serializer.serialize(config));

	},

	/**
	 * Perform view refresh outside of normal application lifecycle (in the end of AJAX call, or from browser console).
	 * Note: call to this function does not guarantee, that views will be refreshed immediately
	 */
	refreshViews: function() {

		if (!Lava.Core.isProcessingEvent() && !Lava.view_manager.isRefreshing()) {

			this.view_manager.refresh();

		}

	},

	/**
	 * Returns <kw>true</kw>, if tag name is void (does nor require closing tag), like "img" or "input"
	 * @param {string} name
	 * @returns {boolean}
	 */
	isVoidTag: function(name) {

		return this.VOID_TAGS.indexOf(name) != -1;

	},

	/**
	 * Used in process of config extension to merge {@link _cWidget#storage_schema}
	 * @param {Object.<string, _cStorageItemSchema>} dest Child schema
	 * @param {Object.<string, _cStorageItemSchema>} source Parent schema
	 */
	mergeStorageSchema: function(dest, source) {

		var name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (Lava.schema.DEBUG && (dest[name].type != source[name].type || dest[name].tag_name != source[name].tag_name)) Lava.t("[Config storage_schema] property types must match: " + name);

				if ('properties' in source[name]) {

					if (!('properties' in dest[name])) {

						dest[name].properties = source[name].properties;

					} else {

						Firestorm.implement(dest[name].properties, source[name].properties);

					}

				}

			}

		}

	},

	/**
	 * Utility method used in parsers and sugar
	 *
	 * @param {_cWidget} widget_config
	 * @param {string} storage_name
	 * @param {string} item_name
	 * @param {*} value
	 */
	store: function(widget_config, storage_name, item_name, value) {

		if (!(storage_name in widget_config)) widget_config[storage_name] = {};
		if (Lava.schema.DEBUG && (item_name in widget_config[storage_name])) Lava.t("Duplicate item in storage: " + item_name);
		widget_config[storage_name][item_name] = value;

	},

	/**
	 * Utility method used in parsers and sugar
	 *
	 * @param {Object} descriptor
	 * @param {string} value
	 * @returns {*}
	 */
	valueToType: function(descriptor, value) {

		if (Lava.schema.DEBUG && !Lava.types[descriptor.type_name].isValidString(value, descriptor)) Lava.t("Invalid attribute value: " + value);
		return Lava.types[descriptor.type_name].fromSafeString(value, descriptor);

	},

	/**
	 * Suspend a listener, returned by {@link Lava.mixin.Observable#on} or {@link Lava.mixin.Properties#onPropertyChanged}
	 * @param {_tListener} listener
	 */
	suspendListener: function(listener) {
		listener.fn = this.noop;
	},

	/**
	 * Resume listener, suspended by {@link Lava#suspendListener}
	 * @param {_tListener} listener
	 */
	resumeListener: function(listener) {
		listener.fn = listener.fn_original;
	},

	/**
	 * Do nothing
	 */
	noop: function() {},

	/**
	 * Does given class instance extend or implement `class_name`
	 * @param {Object} instance
	 * @param {string} class_name
	 * @returns {boolean}
	 */
	instanceOf: function(instance, class_name) {

		return instance.Class.hierarchy_paths.indexOf(class_name) != -1 || instance.Class.implements.indexOf(class_name) != -1;

	},

	/**
	 * Destroy global objects. Widgets must be destroyed manually, before calling this method.
	 */
	destroy: function () {

		this.popover_manager && this.popover_manager.destroy();
		this.view_manager && this.view_manager.destroy();
		this.app.destroy();
		this.view_manager.destroy();

	}

};
/**
 * Settings for the entire framework
 */
Lava.schema = {
	/** @const */
	//ELEMENT_EVENT_PREFIX: 'data-e-',
	/**
	 * This option should be turned off in production, but keep in mind: options, defined in template, are part of
	 * view configuration, and they must be valid JSON objects. Putting there anything else will most likely break
	 * existing and future functionality. Options must be serializable!
	 * @const
	 */
	VALIDATE_OPTIONS: true,
	/**
	 * Whether to check paths to objects in evaluated options
	 * @const
	 */
	VALIDATE_OBJECT_PATHS: true,
	/**
	 * Sort algorithm is called stable, if it preserves order of items that are already sorted. Suitable for ordering
	 * table data by several columns
	 * @const
	 */
	DEFAULT_STABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Unstable algorithms are faster, but subsequent sorts mess the previous results
	 * @const
	 */
	DEFAULT_UNSTABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Core settings
	 */
	system: {
		/**
		 * Class for {@link Lava#app}
		 * @const
		 */
		APP_CLASS: 'Lava.system.App',
		/**
		 * Class for {@link Lava#view_manager}
		 * @const
		 */
		VIEW_MANAGER_CLASS: 'Lava.system.ViewManager',
		/**
		 * ViewManager events (routed via templates), which are enabled by default, so does not require a call to lendEvent().
		 * Events from this list must have a valid `target` property.
		 * @const
		 */
		DEFAULT_EVENTS: [
			'click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu',
			'mousewheel', 'keydown', 'keypress', 'keyup',
			'change', 'focus', 'blur', 'input'
		],

		/**
		 * {@link Lava.Cron} uses requestAnimationFrame, if browser supports it
		 * @const
		 */
		ALLOW_REQUEST_ANIMATION_FRAME: true,
		/**
		 * How much times a scope may be refreshed during one refresh loop, before it's considered
		 * an infinite refresh loop
		 * @const
		 */
		REFRESH_INFINITE_LOOP_THRESHOLD: 3 // up to 5 times
	},
	/**
	 * Config for {@link Lava#serializer} - the default instance
	 */
	default_serializer_config: {},
	/**
	 * Settings for {@link Lava#popover_manager}
	 */
	popover_manager: {
		/**
		 * Is PopoverManager enabled
		 * @const
		 */
		IS_ENABLED: true,
		/**
		 * Class for {@link Lava#popover_manager}
		 * @const
		 */
		CLASS: 'Lava.system.PopoverManager',
		/**
		 * Whether it will ignore tooltips with no text
		 * @const
		 */
		HIDE_EMPTY_TOOLTIPS: true
	},
	/**
	 * Settings for {@link Lava#focus_manager}
	 */
	focus_manager: {
		/**
		 * Is FocusManager enabled
		 * @const
		 */
		IS_ENABLED: true,
		/**
		 * Class for {@link Lava#focus_manager}
		 * @const
		 */
		CLASS: 'Lava.system.FocusManager'
	},
	/**
	 * Settings for Data layer: modules, records and fields
	 */
	data: {
		/**
		 * Default class for modules
		 * @const
		 */
		DEFAULT_MODULE_CLASS: 'Module',
		/**
		 * Default class for module records
		 * @const
		 */
		DEFAULT_RECORD_CLASS: 'Record',
		/**
		 * Default class for record fields
		 * @const
		 */
		DEFAULT_FIELD_TYPE: 'Basic',
		/**
		 * Whether to validate the data, which is loaded into modules.
		 * Generally, it's NOT recommended to turn this off in production
		 * @const
		 */
		VALIDATE_IMPORT_DATA: true
	},
	/**
	 * User-defined module settings
	 */
	modules: {},
	/**
	 * Settings for views
	 */
	view: {
		/**
		 * Whether to validate content of the 'class' attribute on Element containers
		 * @const
		 */
		VALIDATE_CLASS_NAMES: true,
		/**
		 * Whether to validate content of the 'style' attribute on Element containers
		 * @const
		 */
		VALIDATE_STYLES: true,
		/**
		 * Gateway, which constructs the views with dynamic class names
		 * @const
		 */
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway'
	},
	/**
	 * Settings for parsers
	 */
	parsers: {
		/**
		 * Class that corresponds to each view
		 * @const
		 */
		view_name_to_class_map: {
			'expression': 'Expression',
			'foreach': 'Foreach',
			'if': 'If',
			'view': 'View',
			'include': 'Include'
		},
		/**
		 * Whether to keep original view names in compiled templates, or leave just classes
		 * @const
		 */
		PRESERVE_VIEW_NAME: false,
		/**
		 * When parsing resources: whether to call {@link Lava.resources#exportTranslatableString}
		 * @const
		 */
		EXPORT_STRINGS: false
	},
	/**
	 * Widget settings
	 */
	widget: {
		/**
		 * Whether to validate the values, that are `set()` to widget instances.
		 * May be treated same as DEBUG switch (most likely, you will want to turn this off in production)
		 * @const
		 */
		VALIDATE_PROPERTY_TYPES: true,
		/**
		 * Default class that parses widget's sugar
		 * @const
		 */
		DEFAULT_SUGAR_CLASS: 'Lava.system.Sugar',
		/**
		 * Whether a global widget config may be overwritten
		 */
		ALLOW_REDEFINITION: false,
		/**
		 * Constructor, that extends configs
		 * @const
		 */
		DEFAULT_EXTENSION_GATEWAY: 'Lava.WidgetConfigExtensionGateway',
		/**
		 * Constructor, that resolves class names
		 * @const
		 */
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway',
		/**
		 * Default config extension algorithm
		 */
		DEFAULT_EXTENDER: 'Standard'
	},
	/**
	 * Classes, that parse sugar. An instance of each class will be created at the time of initialization
	 * @const
	 */
	SUGAR_CLASSES: ['Lava.system.Sugar'],

	/**
	 * Current locale. Must not be <kw>null</kw> or <str>"default"</str>
	 * @const
	 */
	LOCALE: 'en',
	/**
	 * May be used to turn off resources globally and cut away all resource-related code
	 * @define
	 */
	RESOURCES_ENABLED: true,

	/**
	 * Framework contains hundreds of debug checks. It's strictly not recommended to turn this off
	 * at the time of development and testing
	 * @define
	 */
	DEBUG: true
};
/**
 * Global functions that are callable from templates
 */
Lava.modifiers = {

	/**
	 * Transform a string to lower case
	 * @param value
	 * @returns {string}
	 */
	toLower: function(value) {

		return value ? value.toString().toLowerCase() : '';

	},

	/**
	 * Upper-case the first letter
	 * @param value
	 * @returns {string}
	 */
	ucFirst: function(value) {

		var result = '';

		if (value) {
			result = value.toString();
			result = result[0].toUpperCase() + result.substr(1);
		}

		return result;

	},

	/**
	 * Apply a function from Firestorm.String
	 * @param value
	 * @param {string} callback_name
	 * @returns {string}
	 */
	stringFunction: function(value, callback_name) {

		return value ? Firestorm.String[callback_name](value.toString()) : '';

	},

	/**
	 * Translate a boolean type into user language
	 * @param value
	 * @returns {string}
	 */
	translateBoolean: function(value) {

		if (Lava.schema.DEBUG && typeof(value) != 'boolean') Lava.t("translateBoolean: argument is not boolean type");
		return Lava.locales[Lava.schema.LOCALE].booleans[+value];

	},

	/**
	 * Join an array of values
	 * @param {Array} array
	 * @param {string} glue
	 * @returns {string}
	 */
	joinArray: function(array, glue) {

		return array ? array.join(glue) : '';

	}

};
/**
 * Easings for animation
 */
Lava.transitions = {

	linear: function(x) {
		return x;
	},

	inSine: function (x) {
		return 1 - Math.cos(x * Math.PI / 2);
	},

	outSine: function (x) {
		return Math.sin(x * Math.PI / 2);
	},

	inOutSine: function(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	},

	inQuad: function (x) {
		return x * x;
	},

	outQuad: function (x) {
		return x * (2 - x);
	},

	inOutQuad: function (x) {
		return (x < .5) ? (2 * x * x) : (1 - 2 * (x -= 1) * x);
	},

	inCubic: function (x) {
		return x * x * x;
	},

	outCubic: function (x) {
		return (x -= 1) * x * x + 1;
	},

	inOutCubic: function (x) {
		return (x < .5) ? (4 * x * x * x) : (4 * (x -= 1) * x * x + 1);
	}

};


/**
 * API for working with resources, gathered into separate namespace for convenience
 */
Lava.resources = {

	/**
	 * Helper operations for merging container resources
	 * @type {Object.<string, string>}
	 */
	_container_resources_operations_map: {
		static_properties: '_containerSet',
		static_styles: '_containerSet',
		static_classes: '_containerSet',
		add_properties: '_containerAddObject',
		add_styles: '_containerAddObject',
		add_classes: '_containerAddArray',
		remove_properties: '_containerRemoveObject',
		remove_styles: '_containerRemoveObject',
		remove_classes: '_containerRemoveArray'
	},

	/**
	 * Another map for container resources operations
	 * @type {Object.<string, string>}
	 */
	_container_resources_operands_map: {
		add_properties: 'static_properties',
		remove_properties: 'static_properties',
		add_styles: 'static_styles',
		remove_styles: 'static_styles',
		add_classes: 'static_classes',
		remove_classes: 'static_classes'
	},

	/**
	 * Does nothing by default, but may be overwritten by user to handle string definitions in widget resources.
	 * Example usage: create an export file for translation
	 *
	 * @param {(_cTranslatableString|_cTranslatablePlural)} data
	 * @param {string} widget_title May be used as Domain for strings
	 * @param {string} locale
	 * @param {string} path
	 */
	exportTranslatableString: function(data, widget_title, locale, path) {

	},

	/**
	 * Attach resources object to global widget definition
	 * @param {string} widget_title The name in {@link Lava#widgets}
	 * @param {string} locale Locale of the resource object
	 * @param {Object} locale_resources The object with resources for given locale
	 */
	addWidgetResource: function(widget_title, locale, locale_resources) {

		if (Lava.schema.DEBUG && !(widget_title in Lava.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = Lava.widgets[widget_title];

		if (config.is_extended) Lava.t("Widget is already extended, can not add resources: " + widget_title);

		if (!config.resources) {
			config.resources = {}
		}

		if (Lava.schema.DEBUG && (locale in config.resources)) Lava.t("Locale is already defined: " + locale);

		config.resources[locale] = locale_resources;

	},

	/**
	 * Merge resource objects.
	 * `top_resources` is expected to be a copy or a new empty object.
	 * Properties in `top_resources` have priority over `bottom_resources`
	 *
	 * @param {Object} top_resources Child resources
	 * @param {Object} bottom_resources Parent resources
	 */
	mergeResources: function(top_resources, bottom_resources) {

		var name,
			result = Firestorm.Object.copy(top_resources);

		for (name in bottom_resources) {

			if (name in result) {

				if (Lava.schema.DEBUG && result[name].type != bottom_resources[name].type) Lava.t("Resource types mismatch: " + name);

				if (bottom_resources[name].type == 'component') {

					result[name] = {
						type: 'component',
						value: this.mergeResources(result[name].value, bottom_resources[name].value)
					};

				} else if (bottom_resources[name].type == 'container_stack') {

					if (result[name].type != 'container_stack') Lava.t();

					result[name] = {
						type: 'container_stack',
						value: bottom_resources[name].value.concat(result[name].value)
					}

				}

			} else {

				result[name] = bottom_resources[name];

			}

		}

		return result;

	},

	/**
	 * Container operations are stacked until first usage to guarantee correct inheritance
	 * @param {Object} resource_object
	 */
	mergeRootContainerStacks: function(resource_object) {

		for (var name in resource_object) {
			if (resource_object[name].type == 'container_stack') {

				resource_object[name] = {
					type: 'container',
					value: this._mergeRootContainerStack(resource_object[name].value)
				}

			}
		}

	},

	/**
	 * Perform merging of "container_stack" resource into "container" resource
	 * @param {Array} stack
	 * @returns {Object}
	 */
	_mergeRootContainerStack: function(stack) {

		var i = 0,
			count = stack.length,
			result = {},
			operation;

		if (Lava.schema.DEBUG && !Array.isArray(stack)) Lava.t();

		for (; i < count; i++) {
			operation = stack[i];
			this[this._container_resources_operations_map[operation.name]](result, operation.name, operation.value);
		}

		return result;

	},

	/** Container resources merging API */
	_containerSet: function(result, name, value) {
		result[name] = value;
	},

	/** Container resources merging API */
	_containerAddObject: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.extend(result[operand_name], value);
		} else {
			result[operand_name] = value;
		}
	},

	/** Container resources merging API */
	_containerAddArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			result[operand_name] = result[operand_name].concat(value);
		} else {
			result[operand_name] = value;
		}
	},

	/** Container resources merging API */
	_containerRemoveObject: function(result, name, value) {

		var target,
			operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			target = result[operand_name];
			for (var property_name in value) {
				delete target[property_name]
			}
		}
	},

	/** Container resources merging API */
	_containerRemoveArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.Array.excludeAll(result[operand_name], value);
		}
	},

	/**
	 * Helper function which puts the value inside the resources object under given path string.
	 * Used while parsing templates
	 *
	 * @param {Object} target_object The resources object which is being parsed
	 * @param {string} path Path inside the resources object
	 * @param {*} value
	 */
	putResourceValue: function(target_object, path, value) {

		var path_segments = path.split('.'),
			segment,
			resource_name = path_segments.pop(),
			i = 0,
			count = path_segments.length;

		if (Lava.schema.DEBUG && /[a-z]/.test(resource_name)) Lava.t("Terminal resource names must be uppercase");

		for (; i < count; i++) {

			segment = path_segments[i];
			if (Lava.schema.DEBUG && /[A-Z]/.test(segment)) Lava.t("Resource component names must be lowercase");

			if (!(segment in target_object)) {

				target_object[segment] = {
					type: 'component',
					value: {}
				};

			} else {

				if (Lava.schema.DEBUG && target_object[segment].type != 'component') Lava.t("Malformed resource definition, path is not component: " + path);

			}

			target_object = target_object[segment].value;

		}

		if (resource_name in target_object) Lava.t("Resource is already defined: " + path);
		target_object[resource_name] = value;

	}

};
/**
 * Predefined objects which can parse and check strings and values for compliance to certain types
 */
Lava.types = {

	/**
	 * For extension only
	 */
	AbstractType: {

		type_name: null,

		/**
		 * @param {string} value
		 * @param {Object} [descriptor]
		 * @returns {boolean}
		 */
		fromString: function(value, descriptor) {
			if (!this.isValidString(value, descriptor)) Lava.t("Invalid " + this.type_name + " string: " + value);
			return this.fromSafeString(value, descriptor);
		}

	},

	/**
	 * A common boolean type (<kw>true</kw> or <kw>false</kw>)
	 */
	Boolean: {

		"extends": 'AbstractType',

		_mappings: {
			'true': true,
			'1': true,
			'false': false,
			'0': false
		},

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'boolean';

		},

		isValidString: function(value) {

			return (value in this._mappings);

		},

		fromSafeString: function(value) {

			return this._mappings[value];

		}

	},

	/**
	 * Any string
	 */
	String: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'string';

		},

		isValidString: function() {

			return true;

		},

		fromSafeString: function(value) {

			return value;

		}

	},

	/**
	 * Any decimal number
	 */
	Number: {

		"extends": 'AbstractType',

		_valid_value_regex: /^(\-|\+)?\d+(\.\d*)?$/,

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'number' && this._valid_value_regex.test(value);

		},

		isValidString: function(value) {

			return this._valid_value_regex.test(value);

		},

		fromSafeString: function(value) {

			return +value;

		}

	},

	/**
	 * Numbers without fractional part
	 */
	Integer: {

		"extends": 'Number',

		_valid_value_regex: /^(\-|\+)?\d+$/

	},

	/**
	 * Integers strictly greater than zero
	 */
	PositiveInteger: {

		"extends": 'Number',

		_valid_value_regex: /^\+?[1-9]\d*$/

	},

	/**
	 * Integers greater than zero, or zero
	 */
	NonNegativeInteger: {

		"extends": 'Number',

		_valid_value_regex: /^\+?\d+$/

	},

	/**
	 * A number between 0 and 1, inclusive
	 */
	Percent: {

		"extends": 'Number',

		_valid_value_regex: /^(0?\.\d+|1\.0+|0|1)$/,

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'number' && value >= 0 && value <=1;

		}

	},

	/**
	 * A string with an array of allowed values
	 */
	Set: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			if (Lava.schema.DEBUG && (!descriptor || !('allowed_values' in descriptor))) Lava.t("Set type: missing allowed_values in schema");
			return descriptor['allowed_values'].indexOf(value) != -1;

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function(value) {

			return value;

		}

	},

	/**
	 * An HTML attribute which can take it's name as a value. Converts to <kw>true</kw>
	 *
	 * Example: <br/>
	 * checked="checked"<br/>
	 * checked=""
	 */
	SwitchAttribute: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			return value === '' || value === descriptor.name;

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function() {

			return true;

		}

	},

	/**
	 * A string which is converted to any other value from a map object
	 */
	Map: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			if (Lava.schema.DEBUG && (!descriptor || !('value_map' in descriptor))) Lava.t("Set type: missing allowed_values in schema");
			return (value in descriptor['value_map']);

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function(value, descriptor) {

			return descriptor['value_map'][value];

		}

	},

	/**
	 * Any array
	 */
	Array: {

		"extends": 'AbstractType',

		isValidValue: function(value) {

			return Array.isArray(value);

		},

		isValidString: function() {

			return false;

		},

		fromSafeString: function() {

			Lava.t();

		}

	},

	/**
	 * Any date
	 */
	Date: {

		"extends": 'AbstractType',

		isValidValue: function(value) {

			return Firestorm.getType(value) == 'date';

		},

		isValidString: function() {

			return false; // will be implemented later

		},

		fromSafeString: function() {

			Lava.t();

		}

	}

};

(function(types) {

	var name;

	function extendLavaType(type_object) {
		var base;
		if ('extends' in type_object) {
			base = types[type_object['extends']];
			if (!base.is_extended) {
				extendLavaType(base);
			}
			Firestorm.implement(type_object, base);
		}
		type_object.is_extended = true;
	}

	for (name in types) {
		extendLavaType(types[name]);
		types[name].type_name = name;
	}

})(Lava.types);
/**
 * The widget config extension algorithms
 */
Lava.extenders = {

	/**
	 * Properties that must be merged with parent configs
	 * @type {Object.<string, string>}
	 */
	_widget_config_merged_properties: {
		includes: '_mergeIncludes',
		sugar: '_mergeSugar',
		storage_schema: '_mergeStorageSchema',
		bindings: '_mergeConfigProperty',
		assigns: '_mergeConfigProperty',
		options: '_mergeConfigProperty',
		properties: '_mergeConfigProperty'
	},

	/**
	 * property_name => needs_implement || property_merge_map
	 * @type {Object}
	 */
	_sugar_merge_map: {
		attribute_mappings: true,
		content_schema: {
			tag_roles: true
		}
	},

	/**
	 * Properties that are merged separately
	 * @type {Array.<string>}
	 */
	_exceptions: ['resources', 'resources_cache', 'storage'],

	/**
	 * Common property merging algorithm, suitable for most cases
	 * @param {_cWidget} dest_container The child config
	 * @param {_cWidget} source_container The parent config
	 * @param {string} property_name The name of the property to merge
	 */
	_mergeConfigProperty: function(dest_container, source_container, property_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			}

		}

	},

	/**
	 * Advanced merging algorithm
	 * @param {Object} dest
	 * @param {Object} source
	 * @param {Object} map
	 */
	_mergeWithMap: function(dest, source, map) {

		var name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else if (name in map) {

				if (map[name] == true) {

					Firestorm.implement(dest[name], source[name]);

				} else {

					this._mergeWithMap(dest[name], source[name], map[name]);

				}

			}

		}

	},

	/**
	 * Merge algorithm for {@link _cWidget#sugar}
	 * @param {_cWidget} dest_container Child config
	 * @param {_cWidget} source_container Parent config
	 * @param {string} property_name
	 */
	_mergeSugar: function(dest_container, source_container, property_name) {

		this._mergeWithMap(dest_container[property_name], source_container[property_name], this._sugar_merge_map);

	},

	/**
	 * Merge algorithm for {@link _cWidget#includes}
	 * @param {_cWidget} dest_container Child config
	 * @param {_cWidget} source_container Parent config
	 * @param {string} property_name
	 * @param {string} parent_widget_name Name of the parent widget
	 */
	_mergeIncludes: function(dest_container, source_container, property_name, parent_widget_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name],
			new_name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				new_name = parent_widget_name + '$' + name;
				if (Lava.schema.DEBUG && (new_name in dest)) Lava.t();
				dest[new_name] = source[name];

			}

		}

	},

	/**
	 * Merging algorithm for {@link _cWidget#storage}
	 * @param {_cWidget} dest_container Child config
	 * @param {_cWidget} source_container Parent config
	 * @param {string} property_name
	 */
	_mergeStorage: function(dest_container, source_container, property_name) {

		var name,
			storage_schema = dest_container['storage_schema'],
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (['template_hash', 'object_hash', 'object'].indexOf(storage_schema[name].type) != -1) {

					Firestorm.implement(dest[name], source[name]);

				}

			}

		}

	},

	/**
	 * Merge algorithm for resources
	 * @param {_cWidget} config
	 * @param {_cWidget} parent_config
	 */
	_extendResources: function(config, parent_config) {

		var locale_cache = {};

		if ('resources' in config) {

			if (Lava.schema.LOCALE in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources[Lava.schema.LOCALE]);
			}
			if ('default' in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources['default']);
			}

		}

		if (parent_config && ('resources_cache' in parent_config)) {

			locale_cache = Lava.resources.mergeResources(locale_cache, parent_config.resources_cache[Lava.schema.LOCALE]);

		}

		if (!Firestorm.Object.isEmpty(locale_cache)) {

			config.resources_cache = {};
			config.resources_cache[Lava.schema.LOCALE] = locale_cache;

		}

	},

	/**
	 * Merge algorithm for {@link _cWidget#storage_schema}
	 * @param {_cWidget} dest_container
	 * @param {_cWidget} source_container
	 * @param {string} property_name
	 */
	_mergeStorageSchema: function(dest_container, source_container, property_name) {

		Lava.mergeStorageSchema(dest_container[property_name], source_container[property_name]);

	},

	/**
	 * Extend raw widget config
	 * @param {_cWidget} config
	 */
	Standard: function(config) {

		var parent_config,
			parent_widget_name;

		if ('extends' in config) {

			parent_widget_name = config['extends'];
			// returns already extended configs
			parent_config = Lava.getWidgetConfig(parent_widget_name);

			for (var name in parent_config) {

				if (this._exceptions.indexOf(name) == -1) {

					if (!(name in config)) {

						config[name] = parent_config[name];

					} else if (name in this._widget_config_merged_properties) {

						this[this._widget_config_merged_properties[name]](config, parent_config, name, parent_widget_name);

					}

				}

			}

			// delay merging of storage until storage_schema is merged
			if ('storage' in parent_config) {
				if (!('storage' in config)) {
					config['storage'] = parent_config['storage'];
				} else {
					this._mergeStorage(config, parent_config, 'storage', parent_widget_name);
				}
			}

		}

		if (Lava.schema.RESOURCES_ENABLED) {
			this._extendResources(config, parent_config);
		}

		if (config.real_class && !('class_locator' in config)) {

			config['class'] = Lava.ClassManager.hasConstructor(config.real_class)
				? config.real_class
				: 'Lava.widget.' + config.real_class;

		} else {

			config['class'] = null;

		}

		config.is_extended = true;

	}

};
/**
 * Controls animations
 */
Lava.Cron = {

	/**
	 * Minimum delay between animation frames
	 * @type {number}
	 * @const
	 */
	DEFAULT_TIMER_DELAY: 20, // up to 50 fps

	/**
	 * window.setInterval reference
	 * @readonly
	 */
	_timer: null,
	/**
	 * Is animation currently running
	 * @type {boolean}
	 * @readonly
	 */
	is_running: false,
	/**
	 * Active animations
	 * @type {Array.<Lava.animation.Abstract>}
	 */
	_active_tasks: [],

	/**
	 * Callback for window.setInterval()
	 */
	timeout_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (!self.is_running) {
			clearInterval(self._timer);
			self._timer = null;
		}

	},

	/**
	 * Callback for requestAnimationFrame()
	 */
	animation_frame_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (self.is_running) Firestorm.Environment.requestAnimationFrame(self.animation_frame_callback);

	},

	/**
	 * Start animating
	 * @param {Lava.animation.Abstract} task
	 */
	acceptTask: function(task) {

		if (this._active_tasks.indexOf(task) == -1) {

			this._active_tasks.push(task);

		}

		this._enable();

		if (!this.is_running) {
			this._enable();
			this.is_running = true;
		}

	},

	/**
	 * Create a timer, which executes a callback at nearly equal intervals
	 */
	_enable: function() {

		// one-time gateway
		this._enable = (Firestorm.Environment.requestAnimationFrame && Lava.schema.system.ALLOW_REQUEST_ANIMATION_FRAME)
			? function() { Firestorm.Environment.requestAnimationFrame(this.animation_frame_callback); }
			: function() { this._timer = window.setInterval(this.timeout_callback, this.DEFAULT_TIMER_DELAY); };

		this._enable();

	},

	/**
	 * Call {@link Lava.animation.Abstract#onTimer} of all animations
	 */
	onTimer: function() {

		var time = new Date().getTime(),
			i = 0,
			count = this._active_tasks.length,
			task,
			active_tasks = [];

		for (; i < count; i++) {

			task = this._active_tasks[i];

			if (task.isRunning()) {
				task.onTimer(time);
				// note: at this moment task may be already off, but it's not checked - to save processor resources.
				active_tasks.push(task);
			}

		}

		if (!active_tasks.length) {

			this.is_running = false;

		}

		this._active_tasks = active_tasks;

	}

};
/**
 * Listens to DOM events and provides them to framework
 */
Lava.Core = {

	/**
	 * Map of events that require special support from Core
	 * Note: IE8 and below are not fully supported
	 * @type {Object.<string, Object>}
	 */
	_dom_event_support: {
		focus: {delegation: true},
		blur: {delegation: true},
		change: {delegation: true},
		reset: {delegation: true},
		select: {delegation: true},
		submit: {delegation: true},
		paste: {delegation: true},
		input: {delegation: true}
	},

	/**
	 * Core's own handlers, which then call attached listeners
	 * @type {Object.<string, function>}
	 */
	_event_listeners: {},
	/**
	 * Event listeners are attached only once to the window, and released when they are not needed anymore
	 * @type {Object.<string, number>}
	 */
	_event_usage_counters: {},

	/**
	 * Framework listeners
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_event_handlers: {},

	/**
	 * Incremented at the beginning of Core's DOM event listener and decremented at the end.
	 * Used to delay refresh of views until the end of event processing.
	 *
	 * @type {number}
	 */
	_nested_handlers_count: 0,

	/**
	 * In case of infinite loops in scope layer, there may be lags, when processing mousemove and other frequent events
	 * @type {Array.<string>}
	 */
	_freeze_protected_events: ['mouseover', 'mouseout', 'mousemove'],

	/**
	 * Add a listener for DOM event. Similar to {@link Lava.mixin.Observable#on}
	 * @param {string} event_name Name of DOM event
	 * @param {function} fn Callback
	 * @param {Object} context Callback owner
	 * @returns {_tListener} The listener structure, similar to {@link Lava.mixin.Observable#on} result
	 */
	addGlobalHandler: function(event_name, fn, context) {

		var listener = {
				event_name: event_name,
				fn: fn,
				fn_original: fn,
				context: context
			};

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;
			this._event_handlers[event_name].push(listener);

		} else {

			this._event_usage_counters[event_name] = 1;
			this._event_handlers[event_name] = [listener];
			this._initEvent(event_name);

		}

		return listener;

	},

	/**
	 * Release the listener, acquired via call to {@link Lava.Core#addGlobalHandler}
	 * @param {_tListener} listener Listener structure
	 */
	removeGlobalHandler: function(listener) {

		var event_name = listener.event_name,
			index = this._event_handlers[event_name].indexOf(listener);
		if (Lava.schema.DEBUG && index == -1) Lava.t();
		this._event_handlers[event_name].splice(index, 1);

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	/**
	 * Used to bind `_onDomEvent` to Core instance
	 * @param {string} event_name DOM event name
	 * @returns {Function}
	 */
	_createEventWrapper: function(event_name) {

		var self = this,
			freeze_protection = this._freeze_protected_events.indexOf(event_name) != -1;

		// I'm not sure about this, but looks like the argument should be specifically named "event"
		// http://stackoverflow.com/questions/11188729/jquery-keyup-event-trouble-in-opera
		// see also this to understand the roots of such behaviour:
		// http://stackoverflow.com/questions/4968194/event-keyword-in-js
		return (Firestorm.Environment.browser_name == 'ie') ? function(event) {

			// IE bug: there can be fractional values for coordinates
			if ('x' in event.page) {
				event.page.x = Math.floor(event.page.x);
				event.page.y = Math.floor(event.page.y);
				event.client.x = Math.floor(event.client.x);
				event.client.y = Math.floor(event.client.y);
			}

			self._onDomEvent(event_name, event, freeze_protection);

		} : function(event) {

			self._onDomEvent(event_name, event, freeze_protection);

		};

	},

	/**
	 * Attach a listener to window object, start listening to the event
	 * @param {string} event_name DOM event name
	 */
	_initEvent: function(event_name) {

		this._event_listeners[event_name] = this._createEventWrapper(event_name);

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.addDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.addListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	/**
	 * Stop listening to DOM event
	 * @param {string} event_name DOM event name
	 */
	_shutdownEvent: function(event_name) {

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.removeDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.removeListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	/**
	 * Actual listener for DOM events. Calls framework listeners, attached via {@link Lava.Core#addGlobalHandler}
	 * @param {string} event_name DOM event name
	 * @param {Object} event_object Event object, returned by low-level framework
	 * @param {boolean} freeze_protection Is this a frequent event, which may cause lags
	 */
	_onDomEvent: function(event_name, event_object, freeze_protection) {

		// slice, cause handlers may be removed while they are called
		var handlers = this._event_handlers[event_name].slice(),
			i = 0,
			count = handlers.length;

		// unfortunately, browser can raise an event inside another event.
		// Example test case:
		// {$if(is_visible)}
		// 		<button x:click="remove_me">click me</button>
		// {/if}
		// Click handler should set `is_visible` to false, so the button is removed.
		// Button element will be removed from DOM inside click handler, in view_manager.refresh()
		// At the moment of removal, browser fires focusout event. Each event ends with view_manager.refresh(),
		// which will also try to remove the button.
		// Read more here:
		// for understanding, see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node
		this._nested_handlers_count++;

		for (; i < count; i++) {

			handlers[i].fn.call(handlers[i].context, event_name, event_object);

		}

		this._nested_handlers_count--;

		if (
			this._nested_handlers_count == 0
			&& !Lava.view_manager.isRefreshing()
			&& (!freeze_protection || !Lava.ScopeManager.hasInfiniteLoop())
		) {

			Lava.view_manager.refresh();

		}

	},

	/**
	 * Return <kw>true</kw>, if `_nested_handlers_count > 0`
	 * @returns {boolean} True, if Core is in the process of calling framework listeners
	 */
	isProcessingEvent: function() {

		return this._nested_handlers_count > 0;

	}

};
/**
 * Performs scope refresh
 */
Lava.ScopeManager = {

	/**
	 * There is a separate queue for each scope level
	 * @type {Array.<Array.<Lava.mixin.Refreshable>>}
	 */
	_scope_refresh_queues: [],
	/**
	 * Minimal index in `_scope_refresh_queues`
	 * @type {number}
	 */
	_min_scope_refresh_level: 0,
	/**
	 * Scopes are updated from lower to higher level, from first index in array to last.
	 * Update cycle may jump to lower level, if a scope is added there during the update cycle.
	 * For each scope level this array stores the number of already updated scopes on that level
	 * @type {Array.<number>}
	 */
	_scope_refresh_current_indices: [],

	/**
	 * User-accessible statistics with critical data
	 * @type {Object}
	 */
	statistics: {
		/**
		 * Each refresh loop has smaller cycles
		 * @type {number}
		 */
		max_refresh_cycles: 0,
		/**
		 * Number of times, when circular dependencies in scope tree has been encountered
		 * @type {number}
		 */
		count_dead_loop_exceptions: 0
	},

	/**
	 * Each refresh loop generates a new id
	 * @type {number}
	 */
	_refresh_id: 0,
	/**
	 * Sign of circular dependency for current loop
	 * @type {boolean}
	 */
	_has_exceptions: false,
	/**
	 * Sign of circular dependency for previous loop
	 * @type {boolean}
	 */
	_has_infinite_loop: false,
	/**
	 * Is refresh loop in progress
	 * @type {boolean}
	 */
	_is_refreshing: false,
	/**
	 * How many locks does it have, see the `lock()` method
	 * @type {number}
	 */
	_lock_count: 0,

	/**
	 * Initialize global ScopeManager object
	 */
	init: function() {

		this.scheduleScopeRefresh = this.scheduleScopeRefresh_Normal;

	},

	/**
	 * Queue a scope for update or refresh it immediately, depending on current ScopeManager state
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}} Refresh ticket
	 */
	scheduleScopeRefresh: function(target, level) {

		Lava.t("Framework requires initialization");

	},

	/**
	 * Normal version outside of view refresh cycle - adds scope into refresh queue.
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}}
	 */
	scheduleScopeRefresh_Normal: function(target, level) {

		if (!this._scope_refresh_queues[level]) {

			if (this._min_scope_refresh_level > level) {

				this._min_scope_refresh_level = level;

			}

			this._scope_refresh_queues[level] = [];

		}

		// It absolutely must be an object, but it has no methods for performance reasons - to stay as light as possible
		return {
			index: this._scope_refresh_queues[level].push(target) - 1
		}

	},

	/**
	 * Inside the refresh cycle - refreshes scope immediately
	 * @param {Lava.mixin.Refreshable} target
	 */
	scheduleScopeRefresh_Locked: function(target) {

		if (target.refresh(this._refresh_id)) {
			Lava.logError('Scope Manager: infinite loop exception outside of normal refresh cycle');
		}

		return null;

	},

	/**
	 * Swap `scheduleScopeRefresh` algorithm to `scheduleScopeRefresh_Locked`
	 */
	lock: function() {

		if (Lava.schema.DEBUG && this._is_refreshing) Lava.t();
		this.scheduleScopeRefresh = this.scheduleScopeRefresh_Locked;
		this._lock_count++;

	},

	/**
	 * Swap `scheduleScopeRefresh` algorithm to `scheduleScopeRefresh_Normal`
	 */
	unlock: function() {

		if (this._lock_count == 0) Lava.t();

		this._lock_count--;
		if (this._lock_count == 0) {
			this.scheduleScopeRefresh = this.scheduleScopeRefresh_Normal;
		}

	},

	/**
	 * Remove a scope from update queue
	 * @param {{index: number}} refresh_ticket
	 * @param {number} level
	 */
	cancelScopeRefresh: function(refresh_ticket, level) {

		if (Lava.schema.DEBUG && refresh_ticket == null) Lava.t();

		this._scope_refresh_queues[level][refresh_ticket.index] = null;

	},

	/**
	 * Get `_has_infinite_loop`
	 * @returns {boolean}
	 */
	hasInfiniteLoop: function() {

		return this._has_infinite_loop;

	},

	/**
	 * The main refresh loop
	 */
	refresh: function() {

		if (this._is_refreshing) {
			Lava.logError("ScopeManager: recursive call to ScopeManager#refresh()");
			return;
		}

		var count_refresh_cycles = 0,
			count_levels = this._scope_refresh_queues.length;

		if (count_levels == 0) {

			return;

		}

		this._is_refreshing = true;

		this._has_exceptions = false;
		this._refresh_id++;

		// find the first existent queue
		while (this._min_scope_refresh_level < count_levels) {

			if (this._min_scope_refresh_level in this._scope_refresh_queues) {

				break;

			}

			this._min_scope_refresh_level++;

		}

		if (this._min_scope_refresh_level < count_levels) {

			while (this._scopeRefreshCycle()) {

				count_refresh_cycles++;

			}

		}

		this._scopeMalfunctionCycle();

		if (this._has_exceptions) {

			this._scope_refresh_queues = this._preserveScopeRefreshQueues();

		} else {

			Lava.schema.DEBUG && this.debugVerify();
			this._scope_refresh_queues = [];

		}

		this._scope_refresh_current_indices = [];

		if (this.statistics.max_refresh_cycles < count_refresh_cycles) {

			this.statistics.max_refresh_cycles = count_refresh_cycles;

		}

		this._has_infinite_loop = this._has_exceptions;

		this._is_refreshing = false;

	},

	/**
	 * One refresh cycle in the refresh loop.
	 * Warning: violates codestyle with multiple return statements
	 * @returns {boolean} <kw>true</kw> if another cycle is needed, <kw>false</kw> when done and queue is clean
	 */
	_scopeRefreshCycle: function() {

		var current_level = this._min_scope_refresh_level,
			current_level_queue = this._scope_refresh_queues[current_level],
			queue_length = current_level_queue.length,
			count_levels,
			i = 0; // 'i' is a copy of current index, for optimizations

		if (current_level in this._scope_refresh_current_indices) {

			i = this._scope_refresh_current_indices[current_level];

		} else {

			this._scope_refresh_current_indices[current_level] = 0;

		}

		do {

			while (i < queue_length) {

				if (current_level_queue[i]) {

					if (current_level_queue[i].refresh(this._refresh_id)) {

						this._has_exceptions = true;
						this.statistics.count_dead_loop_exceptions++;
						Lava.logError('Scope Manager: infinite loop exception, interrupting');
						return false;

					}

				}

				i++;
				this._scope_refresh_current_indices[current_level] = i;

				// during the refresh cycle, additional scopes may be added to the queue, sometimes from lower levels
				if (this._min_scope_refresh_level < current_level) {

					return true;

				}

			}

			queue_length = current_level_queue.length;

		} while (i < queue_length);

		this._scope_refresh_queues[current_level] = null;
		this._scope_refresh_current_indices[current_level] = 0;

		count_levels = this._scope_refresh_queues.length;

		do {

			this._min_scope_refresh_level++;

			if (this._scope_refresh_queues[this._min_scope_refresh_level]) {

				return true;

			}

		} while (this._min_scope_refresh_level < count_levels);

		return false;

	},

	/**
	 * A refresh cycle that is launched in case of circular scope dependency
	 * It will refresh all dirty scopes one time
	 */
	_scopeMalfunctionCycle: function() {

		var current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				count = current_queue.length;

				if (current_level in this._scope_refresh_current_indices) {

					i = this._scope_refresh_current_indices[current_level];

				} else {

					this._scope_refresh_current_indices[current_level] = 0;
					i = 0;

				}

				while (i < count) {

					if (current_queue[i]) {

						current_queue[i].refresh(this._refresh_id, true);

					}

					i++;
					this._scope_refresh_current_indices[current_level] = i;

				}

			}

		}

	},

	/**
	 * Launched in case of infinite loop exception:
	 * all existing tickets must be preserved for the next refresh cycle, otherwise the system will be broken
	 * @returns {Array}
	 */
	_preserveScopeRefreshQueues: function() {

		var new_refresh_queues = [],
			current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count,
			new_level_queue,
			ticket;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				i = this._scope_refresh_current_indices[current_level] || 0;
				count = current_queue.length;
				new_level_queue = [];

				for (; i < count; i++) {

					if (current_queue[i]) {

						ticket = current_queue[i];
						ticket.index = new_level_queue.push(ticket) - 1;

					}

				}

				new_refresh_queues[current_level] = new_level_queue;

			}

		}

		return new_refresh_queues;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Debug-mode validations

	/**
	 * An array of all scopes in the framework, for debug purpose only
	 * @type {Array.<Lava.mixin.Refreshable>}
	 */
	_debug_all_scopes: [],

	/**
	 * Add a scope to `_debug_all_scopes`
	 * @param {Lava.mixin.Refreshable} scope
	 */
	debugTrackScope: function(scope) {

		this._debug_all_scopes.push(scope);

	},

	/**
	 * Remove a scope from `_debug_all_scopes`
	 * @param {Lava.mixin.Refreshable} scope
	 */
	debugStopTracking: function(scope) {

		var index = this._debug_all_scopes.indexOf(scope);
		if (index == -1) Lava.t();
		this._debug_all_scopes.splice(index, 1);

	},

	/**
	 * LiquidLava alpha: debug verification that scope refresh cycle works as expected
	 */
	debugVerify: function() {

		try {

			for (var i = 0, count = this._debug_all_scopes.length; i < count; i++) {
				this._debug_all_scopes[i].debugAssertClean();
			}

		} catch (e) {

			Lava.logException(e);

		}

	}

};

/**
 * Stable. Can not be called recursively
 */
Lava.algorithms.sorting.mergeSort = (function(){
	"use strict";

	var _less = null;

	/**
	 * @param {Array} left
	 * @param {Number} left_count
	 * @param {Array} right
	 * @param {Number} right_count
	 * @returns {Array}
	 */
	function _merge(left, left_count, right, right_count) {

		var result = [],
			left_index = 0,
			right_index = 0;

		while (left_index < left_count && right_index < right_count) {

			if (_less(left[left_index], right[right_index])) {

				result.push(left[left_index]);
				left_index++;

			} else {

				result.push(right[right_index]);
				right_index++;

			}

		}

		if (left_index < left_count) {

			result = result.concat(left.slice(left_index));

		}

		if (right_index < right_count) {

			result = result.concat(right.slice(right_index));

		}

		return result;

	}

	/**
	 * @param {Array} items
	 * @param {Number} length
	 * @returns {Array}
	 */
	function _sort(items, length) {

		var middle,
			right;

		if (length == 2) {
			return _less(items[0], items[1]) ? items : [items[1], items[0]];
		}

		middle = Math.floor(length / 2);
		right = length - middle;

		return _merge(
			(middle < 2) ? items.slice(0, middle) : _sort(items.slice(0, middle), middle),
			middle,
			(right < 2) ? items.slice(middle) : _sort(items.slice(middle), right),
			right
		);

	}

	return function(items, less) {

		var length = items.length,
			result;

		if (length < 2) {

			result = items;

		} else {

			_less = less;
			result = _sort(items, length);

		}

		return result;

	};

})();
/**
 * [ALPHA] Traverse templates with provided "visitor" object
 */
Lava.TemplateWalker = {

	/**
	 * Callbacks for different types of items in template
	 * @type {Object.<string, string>}
	 */
	_handlers_map: {
		'string': '_handleString',
		view: '_handleView',
		widget: '_handleWidget',
		include: '_handleInclude',
		static_value: '_handleStaticValue',
		static_eval: '_handleStaticEval',
		static_tag: '_handleStaticTag'
	},

	/**
	 * The visitor object, which has callbacks for different traversal events
	 * @type {_iVisitor}
	 */
	_visitor: null,
	/**
	 * Stack of nested templates
	 * @type {Array.<_tTemplate>}
	 */
	_template_stack: [],
	/**
	 * Stack of indices in `_template_stack`
	 * @type {Array.<number>}
	 */
	_index_stack: [],
	/**
	 * Stack of nested view configs
	 * @type {Array.<(_cView|_cWidget)>}
	 */
	_view_config_stack: [],

	// local vars for advanced compression
	/**
	 * Does current visitor have `enter()`
	 * @type {boolean}
	 */
	_has_enter: false,
	/**
	 * Does current visitor have `leave()`
	 * @type {boolean}
	 */
	_has_leave: false,
	/**
	 * Does current visitor have `enter)region()`
	 * @type {boolean}
	 */
	_has_enter_region: false,
	/**
	 * Does current visitor have `leave_region()`
	 * @type {boolean}
	 */
	_has_leave_region: false,

	/**
	 * Traverse a template, executing visitor's callbacks
	 * @param {_tTemplate} template
	 * @param {_iVisitor} visitor
	 */
	walkTemplate: function(template, visitor) {

		if (Lava.schema.DEBUG && this._visitor) Lava.t();

		// in case of WALKER_STOP exception, they might be filled with old garbage
		this._template_stack = [];
		this._index_stack = [];
		this._view_config_stack = [];

		this._visitor = visitor;
		this._has_enter = !!this._visitor.enter;
		this._has_leave = !!this._visitor.leave;
		this._has_enter_region = !!this._visitor.enterRegion;
		this._has_leave_region = !!this._visitor.leaveRegion;

		this._has_enter_region && this._visitor.enterRegion(this, 'root_template');
		try {
			this._walkTemplate(template);
		} catch (e) {
			if (e != "WALKER_STOP") throw e;
		}
		this._has_leave_region && this._visitor.leaveRegion(this, 'root_template');

		this._visitor = null;

	},

	/**
	 * Throw an exception, which will be caught in `walkTemplate`
	 * @throws TemplateWalker internal exception that will be caught in `walkTemplate`
	 */
	interrupt: function() {
		throw "WALKER_STOP";
	},

	/**
	 * Get a copy of `_template_stack`
	 * @returns {Array.<_tTemplate>}
	 */
	getTemplateStack: function() {
		return this._template_stack.slice();
	},

	/**
	 * Get a copy of `_index_stack`
	 * @returns {Array.<number>}
	 */
	getIndexStack: function() {
		return this._index_stack.slice();
	},

	/**
	 * Get the template on top of `_template_stack`
	 * @returns {_tTemplate}
	 */
	getCurrentTemplate: function() {
		return this._template_stack[this._template_stack.length - 1];
	},

	/**
	 * Get the template index on top of `_index_stack`
	 * @returns {number}
	 */
	getCurrentIndex: function() {
		return this._index_stack[this._index_stack.length - 1];
	},

	/**
	 * Get a copy of `_view_config_stack`
	 * @returns {Array.<_cView|_cWidget>}
	 */
	getViewConfigStack: function() {
		return this._view_config_stack.slice();
	},

	/**
	 * Get view config on top of `_view_config_stack`
	 * @returns {_cView|_cWidget}
	 */
	getCurrentViewConfig: function() {
		return this._view_config_stack[this._view_config_stack.length];
	},

	/**
	 * Walk a single template
	 * @param {_tTemplate} template
	 */
	_walkTemplate: function(template) {

		if (Lava.schema.DEBUG && !Array.isArray(template)) Lava.t();

		var i = 0,
			count = template.length,
			type,
			stack_index;

		stack_index = this._template_stack.push(template) - 1;
		this._index_stack.push(0);
		this._has_enter_region && this._visitor.enterRegion(this, 'template');

		for (; i < count; i++) {

			this._index_stack[stack_index] = i;
			type = (typeof (template[i]) == 'string') ? 'string' : template[i].type;
			this._has_enter && this._visitor.enter(this, type, template[i]);
			this[this._handlers_map[type]](template[i]);
			this._has_leave && this._visitor.leave(this, type, template[i]);

		}

		this._has_leave_region && this._visitor.leaveRegion(this, 'template');
		this._template_stack.pop();
		this._index_stack.pop();

	},

	/**
	 * Walk the common part of {@link _cView} and {@link _cWidget}
	 * @param {_cView} node
	 */
	_handleViewCommon: function(node) {

		var i = 0,
			count;

		if ('template' in node) {
			this._has_enter_region && this._visitor.enterRegion(this, 'template');
			this._walkTemplate(node.template);
			this._has_leave_region && this._visitor.leaveRegion(this, 'template');
		}

		if ('else_template' in node) {
			this._has_enter_region && this._visitor.enterRegion(this, 'else_template');
			this._walkTemplate(node.else_template);
			this._has_leave_region && this._visitor.leaveRegion(this, 'else_template');
		}

		if ('elseif_templates' in node) {
			this._has_enter_region && this._visitor.enterRegion(this, 'elseif_templates');
			for (count = node.elseif_templates.length; i < count; i++) {
				this._walkTemplate(node.elseif_templates[i]);
			}
			this._has_leave_region && this._visitor.leaveRegion(this, 'elseif_templates');
		}

	},

	/**
	 * Walk {@link _cView}
	 * @param {_cView} node
	 */
	_handleView: function(node) {

		this._view_config_stack.push(node);
		this._visitor.visitView && this._visitor.visitView(this, node);
		this._handleViewCommon(node);
		this._view_config_stack.pop();

	},

	/**
	 * Walk an object in {@link _cWidget#storage}
	 * @param {Object} object
	 * @param {Object} properties_schema
	 */
	_walkStorageObject: function(object, properties_schema) {

		var name;

		this._has_enter_region && this._visitor.enterRegion(this, 'object');
		for (name in properties_schema) {
			if (properties_schema[name].type == 'template') {
				this._walkTemplate(object[name]);
			}
		}
		this._has_leave_region && this._visitor.leaveRegion(this, 'object');

	},

	/**
	 * Walk a widget config
	 * @param {_cWidget} node
	 */
	_handleWidget: function(node) {

		var name,
			item,
			i,
			count,
			tmp_name,
			item_schema,
			storage_schema;

		this._view_config_stack.push(node);
		this._visitor.visitWidget && this._visitor.visitWidget(this, node);
		this._handleViewCommon(node);

		if (node.includes) {
			this._has_enter_region && this._visitor.enterRegion(this, 'includes');
			for (name in node.includes) {
				this._walkTemplate(node.includes[name]);
			}
			this._has_leave_region && this._visitor.leaveRegion(this, 'includes');
		}

		if (node.storage) {

			storage_schema = Lava.parsers.Storage.getMergedStorageSchema(node);
			for (name in node.storage) {

				this._has_enter_region && this._visitor.enterRegion(this, 'storage');

				item_schema = storage_schema[name];
				item = node.storage[name];

				switch (item_schema.type) {
					case 'template_collection':
						this._has_enter_region && this._visitor.enterRegion(this, 'template_collection');
						for (i = 0, count = item.length; i < count; i++) {
							this._walkTemplate(item[i]);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'template_collection');
						break;
					case 'object_collection':
						this._has_enter_region && this._visitor.enterRegion(this, 'object_collection');
						for (i = 0, count = item.length; i < count; i++) {
							this._walkStorageObject(item[i], item_schema.properties);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'object_collection');
						break;
					case 'template_hash':
						this._has_enter_region && this._visitor.enterRegion(this, 'template_hash');
						for (tmp_name in item) {
							this._walkTemplate(item[tmp_name]);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'template_hash');
						break;
					case 'object_hash':
						this._has_enter_region && this._visitor.enterRegion(this, 'object_hash');
						for (tmp_name in item) {
							this._walkStorageObject(item[tmp_name], item_schema.properties);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'object_hash');
						break;
					case 'object':
						this._walkStorageObject(item, item_schema.properties);
						break;
					default:
						Lava.t();
				}

				this._has_leave_region && this._visitor.leaveRegion(this, 'storage');

			}

		}

		this._view_config_stack.pop();

	},

	/**
	 * Walk a string in template
	 * @param {string} node
	 */
	_handleString: function(node) {

		this._visitor.visitString && this._visitor.visitString(this, node);

	},

	/**
	 * Walk an include config
	 * @param {_cInclude} node
	 */
	_handleInclude: function(node) {

		this._visitor.visitInclude && this._visitor.visitInclude(this, node);

	},

	/**
	 * Walk {@link _cStaticValue}
	 * @param {_cStaticValue} node
	 */
	_handleStaticValue: function(node) {

		this._visitor.visitStaticValue && this._visitor.visitStaticValue(this, node);

	},

	/**
	 * Walk {@link _cStaticEval}
	 * @param {_cStaticEval} node
	 */
	_handleStaticEval: function(node) {

		this._visitor.visitStaticEval && this._visitor.visitStaticEval(this, node);

	},

	/**
	 * Walk {@link _cStaticTag}
	 * @param {_cStaticTag} node
	 */
	_handleStaticTag: function(node) {

		this._visitor.visitStaticTag && this._visitor.visitStaticTag(this, node);

	}

};
/**
 * Create and manage classes
 */
Lava.ClassManager = {

	/**
	 * Whether to serialize them and inline as a value, when building constructor,
	 * or slice() from original array in original object
	 * @type {boolean}
	 * @const
	 */
	INLINE_SIMPLE_ARRAYS: true,
	/**
	 * If an array consists of these types - it can be inlined
	 * @type {Array.<string>}
	 */
	SIMPLE_TYPES: ['string', 'boolean', 'number', 'null', 'undefined'],

	/**
	 * All data that belongs to each class: everything that's needed for inheritance and building of a constructor
	 * @type {Object.<string, _cClassData>}
	 */
	_sources: {},
	/**
	 * Constructors for each class
	 * @type {Object.<string, function>}
	 */
	constructors: {},
	/**
	 * Special directives, understandable by ClassManager
	 */
	_reserved_members: ['Extends', 'Implements', 'Class', 'Shared'],

	/**
	 * Namespaces, which can hold class constructors
	 * @type {Object.<string, Object>}
	 */
	_root: {},

	/**
	 * Add a namespace, that can contain class constructors
	 * @param {string} name The name of the namespace
	 * @param {Object} object The namespace object
	 */
	registerRootNamespace: function(name, object) {

		this._root[name] = object;

	},

	/**
	 * Get {@link _cClassData} structure for each class
	 * @param {string} class_path
	 * @returns {_cClassData}
	 */
	getClassData: function(class_path) {

		return this._sources[class_path];

	},

	/**
	 * Create a class
	 * @param {string} class_path Full name of the class
	 * @param {Object} source_object Class body
	 */
	define: function(class_path, source_object) {

		var name,
			class_data,
			parent_data,
			i,
			count,
			shared_names;

		class_data = /** @type {_cClassData} */ {
			name: class_path.split('.').pop(),
			path: class_path,
			source_object: source_object,
			level: 0,
			"extends": null,
			"implements": [],
			parent_class_data: null,
			hierarchy_paths: null,
			hierarchy_names: null,
			skeleton: null,
			references: [],
			shared: {},
			constructor: null,
			own_references_count: 0
		};

		if ('Extends' in source_object) {

			if (Lava.schema.DEBUG && typeof(source_object.Extends) != 'string') Lava.t('Extends: string expected. ' + class_path);
			class_data['extends'] = /** @type {string} */ source_object.Extends;
			parent_data = this._sources[source_object.Extends];
			class_data.parent_class_data = parent_data;

			if (!parent_data) Lava.t('[define] Base class not found: "' + source_object.Extends + '"');
			if (!parent_data.skeleton) Lava.t("[define] Parent class was loaded without skeleton, extension is not possible: " + class_data['extends']);
			if (parent_data.hierarchy_names.indexOf(class_data.name) != -1) Lava.t("[define] Duplicate name in inheritance chain: " + class_data.name + " / " + class_path);

			class_data.level = parent_data.level + 1;
			class_data.hierarchy_paths = parent_data.hierarchy_paths.slice();
			class_data.hierarchy_paths.push(class_path);
			class_data.hierarchy_names = parent_data.hierarchy_names.slice();
			class_data.hierarchy_names.push(class_data.name);
			class_data.references = parent_data.references.slice();
			class_data.own_references_count -= parent_data.references.length;
			class_data.implements = parent_data.implements.slice();

			for (name in parent_data.shared) {

				class_data.shared[name] = {};
				Firestorm.extend(class_data.shared[name], parent_data.shared[name]);

				if (name in source_object) {

					Firestorm.extend(class_data.shared[name], source_object[name]);

				}

			}

		} else {

			class_data.hierarchy_paths = [class_path];
			class_data.hierarchy_names = [class_data.name];

		}

		if ('Shared' in source_object) {

			shared_names = (typeof(source_object.Shared) == 'string') ? [source_object.Shared] : source_object.Shared;

			for (i = 0, count = shared_names.length; i < count; i++) {

				name = shared_names[i];
				if (Lava.schema.DEBUG && !(name in source_object)) Lava.t("Shared member is not in class: " + name);
				if (Lava.schema.DEBUG && Firestorm.getType(source_object[name]) != 'object') Lava.t("Shared: class member must be an object");
				if (Lava.schema.DEBUG && class_data.parent_class_data && (name in class_data.parent_class_data.skeleton)) Lava.t("[ClassManager] instance member from parent class may not become shared in descendant: " + name);

				if (!(name in class_data.shared)) {

					class_data.shared[name] = {};

				}

				Firestorm.extend(class_data.shared[name], source_object[name]);

			}

		}

		class_data.skeleton = this._disassemble(class_data, source_object, class_data.level, true);

		if (parent_data) {

			this._extend(class_data, class_data.skeleton, parent_data, parent_data.skeleton, true);

		}

		class_data.own_references_count += class_data.references.length;

		if ('Implements' in source_object) {

			if (typeof(source_object.Implements) == 'string') {

				this._implementPath(class_data, source_object.Implements);

			} else {

				for (i = 0, count = source_object.Implements.length; i < count; i++) {

					this._implementPath(class_data, source_object.Implements[i]);

				}

			}

		}

		class_data.constructor = this._buildRealConstructor(class_data);

		this._registerClass(class_data);

	},

	/**
	 * Implement members from another class into current class data
	 * @param {_cClassData} class_data
	 * @param {string} path
	 */
	_implementPath: function(class_data, path) {

		var implements_source = this._sources[path],
			name,
			references_offset;

		if (!implements_source) Lava.t('Implements: class not found - "' + path + '"');
		if (Lava.schema.DEBUG) {

			for (name in implements_source.shared) Lava.t("Implements: unable to use a class with Shared as mixin.");

		}

		if (Lava.schema.DEBUG && class_data.implements.indexOf(path) != -1) {

			Lava.t("Implements: class " + class_data.path + " already implements " + path);

		}

		class_data.implements.push(path);
		references_offset = class_data.references.length;
		// array copy is inexpensive, cause it contains only reference types
		class_data.references = class_data.references.concat(implements_source.references);

		this._extend(class_data, class_data.skeleton, implements_source, implements_source.skeleton, true, references_offset);

	},

	/**
	 * Perform extend/implement operation
	 * @param {_cClassData} child_data
	 * @param {Object} child_skeleton The skeleton of a child object
	 * @param {_cClassData} parent_data
	 * @param {Object} parent_skeleton The skeleton of a parent object
	 * @param {boolean} is_root <kw>true</kw>, when extending skeletons class bodies, and <kw>false</kw> in all other cases
	 * @param {number} [references_offset] Also acts as a sign of 'implements' mode
	 */
	_extend: function (child_data, child_skeleton, parent_data, parent_skeleton, is_root, references_offset) {

		var parent_descriptor,
			name,
			new_name;

		for (name in parent_skeleton) {

			parent_descriptor = parent_skeleton[name];

			if (name in child_skeleton) {

				if (is_root && (child_skeleton[name].type == 'function' ^ parent_descriptor.type == 'function')) {
					Lava.t('Extend: functions in class root are not replaceable with other types (' + name + ')');
				}

				if (parent_descriptor.type == 'function') {

					if (!is_root || typeof(references_offset) != 'undefined') continue;

					new_name = parent_data.name + '$' + name;
					if (new_name in child_skeleton) Lava.t('[ClassManager] Assertion failed, function already exists: ' + new_name);
					child_skeleton[new_name] = parent_descriptor;

				} else if (parent_descriptor.type == 'object') {

					this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

				}

			} else if (parent_descriptor.type == 'object') {

				child_skeleton[name] = {type: 'object', skeleton: {}};
				this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

			} else if (references_offset && (parent_descriptor.type == 'function' || parent_descriptor.type == 'sliceArray')) {

				child_skeleton[name] = {type: parent_descriptor.type, index: parent_descriptor.index + references_offset};

			} else {

				child_skeleton[name] = parent_descriptor;

			}

		}

	},

	/**
	 * Recursively create skeletons for all objects inside class body
	 * @param {_cClassData} class_data
	 * @param {Object} source_object
	 * @param {number} level
	 * @param {boolean} is_root
	 * @returns {Object}
	 */
	_disassemble: function(class_data, source_object, level, is_root) {

		var name,
			skeleton = {},
			value,
			type,
			skeleton_value;

		for (name in source_object) {

			if (is_root && (this._reserved_members.indexOf(name) != -1 || (name in class_data.shared))) {

				continue;

			}

			value = source_object[name];
			type = Firestorm.getType(value);

			switch (type) {
				case 'object':
					skeleton_value = {
						type: 'object',
						skeleton: this._disassemble(class_data, value, level, false)
					};
					break;
				case 'function':
					skeleton_value = {type: 'function', index: class_data.references.length};
					class_data.references.push(value);
					break;
				case 'array':
					if (value.length == 0) {
						skeleton_value = {type: 'inlineArray', is_empty: true};
					} else if (this.INLINE_SIMPLE_ARRAYS && this.isInlineArray(value)) {
						skeleton_value = {type: 'inlineArray', value: value};
					} else {
						skeleton_value = {type: 'sliceArray', index: class_data.references.length};
						class_data.references.push(value);
					}
					break;
				case 'null':
					skeleton_value = {type: 'null'};
					break;
				case 'undefined':
					skeleton_value = {type: 'undefined'};
					break;
				case 'boolean':
					skeleton_value = {type: 'boolean', value: value};
					break;
				case 'number':
					skeleton_value = {type: 'number', value: value};
					break;
				case 'string':
					skeleton_value = {type: 'string', value: value};
					break;
				case 'regexp':
					skeleton_value = {type: 'regexp', value: value};
					break;
				default:
					Lava.t("[Class system] Unsupported property type in source object: " + type);
					break;
			}

			skeleton[name] = skeleton_value;

		}

		return skeleton;

	},

	/**
	 * Build class constructor that can be used with the <kw>new</kw> keyword
	 * @param {_cClassData} class_data
	 * @returns {function} The class constructor
	 */
	_buildRealConstructor: function(class_data) {

		var prototype = {},
			skeleton = class_data.skeleton,
			serialized_action,
			constructor_actions = [],
			name,
			source,
			constructor,
			object_properties,
			uses_references = false;

		for (name in skeleton) {

			serialized_action = null;

			switch (skeleton[name].type) {
				// members that should be in prototype
				case 'string':
					prototype[name] = skeleton[name].value;
					break;
				case 'null':
					prototype[name] = null;
					break;
				case 'undefined':
					prototype[name] = void 0;
					break;
				case 'boolean':
					prototype[name] = skeleton[name].value;
					break;
				case 'number':
					prototype[name] = skeleton[name].value;
					break;
				case 'function':
					prototype[name] = class_data.references[skeleton[name].index];
					break;
				case 'regexp':
					prototype[name] = skeleton[name].value;
					break;
				// members that are copied as inline property
				case 'sliceArray':
					serialized_action = 'r[' + skeleton[name].index + '].slice()';
					uses_references = true;
					break;
				case 'inlineArray':
					serialized_action = skeleton[name].is_empty ? '[]' : this._serializeInlineArray(skeleton[name].value);
					break;
				case 'object':
					object_properties = [];
					if (this._serializeSkeleton(skeleton[name].skeleton, class_data, "\t", object_properties)) {
						uses_references = true;
					}
					serialized_action = object_properties.length
						? "{\n\t" + object_properties.join(",\n\t") + "\n}"
						: "{}";
					break;
				default:
					Lava.t("[_buildRealConstructor] unknown property descriptor type: " + skeleton[name].type);
			}

			if (serialized_action) {

				if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

					constructor_actions.push('this.' + name + ' = ' + serialized_action);

				} else {

					constructor_actions.push('this["' + name.replace(/\"/g, "\\\"") + '"] = ' + serialized_action);

				}

			}

		}

		for (name in class_data.shared) {

			prototype[name] = class_data.shared[name];

		}

		prototype.Class = class_data;

		source = (uses_references ? ("var r=Lava.ClassManager.getClassData('" + class_data.path + "').references;\n") : '')
			+ constructor_actions.join(";\n")
			+ ";";

		if (class_data.skeleton.init) {

			source += "\nthis.init.apply(this, arguments);";

		}

		constructor = new Function(source);
		// for Chrome we could assign prototype object directly,
		// but in Firefox this will result in performance degradation
		Firestorm.extend(constructor.prototype, prototype);
		return constructor;

	},

	/**
	 * Perform special class serialization, that takes functions and resources from class data and can be used in constructors
	 * @param {Object} skeleton
	 * @param {_cClassData} class_data
	 * @param {string} padding
	 * @param {Array} serialized_properties
	 * @returns {boolean} <kw>true</kw>, if object uses {@link _cClassData#references}
	 */
	_serializeSkeleton: function(skeleton, class_data, padding, serialized_properties) {

		var name,
			serialized_value,
			uses_references = false,
			object_properties;

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case 'string':
					serialized_value = '"' + skeleton[name].value.replace(/\"/g, "\\\"") + '"';
					break;
				case 'null':
					serialized_value = 'null';
					break;
				case 'undefined':
					serialized_value = 'undefined';
					break;
				case 'boolean':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'number':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'function':
					serialized_value = 'r[' + skeleton[name].index + ']';
					uses_references = true;
					break;
				case 'regexp':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'sliceArray':
					serialized_value = 'r[' + skeleton[name].index + '].slice()';
					uses_references = true;
					break;
				case 'inlineArray':
					serialized_value = skeleton[name].is_empty ? '[]' : this._serializeInlineArray(skeleton[name].value);
					break;
				case 'object':
					object_properties = [];
					if (this._serializeSkeleton(skeleton[name].skeleton, class_data, padding + "\t", object_properties)) {
						uses_references = true;
					}
					serialized_value = object_properties.length
						? "{\n\t" + padding + object_properties.join(",\n\t" + padding) + "\n" + padding + "}" : "{}";
					break;
				default:
					Lava.t("[_serializeSkeleton] unknown property descriptor type: " + skeleton[name].type);
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name) && Lava.JS_KEYWORDS.indexOf(name) == -1) {

				serialized_properties.push(name + ': ' + serialized_value);

			} else {

				serialized_properties.push('"' + name.replace(/\"/g, "\\\"") + '": ' + serialized_value);

			}

		}

		return uses_references;

	},

	/**
	 * Get namespace for a class constructor
	 * @param {Array.<string>} path_segments Path to the namespace of a class. Must start with one of registered roots
	 * @returns {Object}
	 */
	_getNamespace: function(path_segments) {

		var namespace,
			segment_name,
			count = path_segments.length,
			i = 1;

		if (!count) Lava.t("ClassManager: class names must include a namespace, even for global classes.");
		if (!(path_segments[0] in this._root)) Lava.t("[ClassManager] namespace is not registered: " + path_segments[0]);
		namespace = this._root[path_segments[0]];

		for (; i < count; i++) {

			segment_name = path_segments[i];

			if (!(segment_name in namespace)) {

				namespace[segment_name] = {};

			}

			namespace = namespace[segment_name];

		}

		return namespace;

	},

	/**
	 * Get class constructor
	 * @param {string} class_path Full name of a class, or a short name (if namespace is provided)
	 * @param {string} [default_namespace] The default prefix where to search for the class, like <str>"Lava.widget"</str>
	 * @returns {function}
	 */
	getConstructor: function(class_path, default_namespace) {

		if (!(class_path in this.constructors) && default_namespace) {

			class_path = default_namespace + '.' + class_path;

		}

		return this.constructors[class_path];

	},

	/**
	 * Whether to inline or slice() an array in constructor
	 * @param {Array} items
	 * @returns {boolean}
	 */
	isInlineArray: function(items) {

		var result = true,
			i = 0,
			count = items.length;

		for (; i < count; i++) {

			if (this.SIMPLE_TYPES.indexOf(Firestorm.getType(items[i])) == -1) {
				result = false;
				break;
			}

		}

		return result;

	},

	/**
	 * Serialize an array which contains only certain primitive types from `SIMPLE_TYPES` property
	 *
	 * @param {Array} data
	 * @returns {string}
	 */
	_serializeInlineArray: function(data) {

		var tempResult = [],
			i = 0,
			count = data.length,
			type,
			value;

		for (; i < count; i++) {

			type = typeof(data[i]);
			switch (type) {
				case 'string':
					value = Firestorm.String.quote(data[i]);
					break;
				case 'boolean':
				case 'number':
					value = data[i].toString();
					break;
				case 'null':
				case 'undefined':
					value = type;
					break;
				default:
					Lava.t();
			}
			tempResult.push(value);

		}

		return '[' + tempResult.join(", ") + ']';

	},

	/**
	 * Register an existing function as a class constructor for usage with {@link Lava.ClassManager#getConstructor}()
	 * @param {string} class_path Full class path
	 * @param {function} constructor Constructor instance
	 */
	registerExistingConstructor: function(class_path, constructor) {

		if (class_path in this._sources) Lava.t('Class "' + class_path + '" is already defined');
		this.constructors[class_path] = constructor;

	},

	/**
	 * Does a constructor exists
	 * @param {string} class_path Full class path
	 * @returns {boolean}
	 */
	hasConstructor: function(class_path) {

		return class_path in this.constructors;

	},

	/**
	 * Does a class exists
	 * @param {string} class_path
	 * @returns {boolean}
	 */
	hasClass: function(class_path) {

		return class_path in this._sources;

	},

	/**
	 * Build a function that creates class constructor's prototype. Used in export
	 * @param {_cClassData} class_data
	 * @returns {function}
	 */
	_getPrototypeGenerator: function(class_data) {

		var skeleton = class_data.skeleton,
			name,
			serialized_value,
			serialized_actions = ['\tp.Class = cd;'];

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case 'string':
					serialized_value = '"' + skeleton[name].value.replace(/\"/g, "\\\"") + '"';
					break;
				case 'null':
					serialized_value = 'null';
					break;
				case 'undefined':
					serialized_value = 'undefined';
					break;
				case 'boolean':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'number':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'function':
					serialized_value = 'r[' + skeleton[name].index + ']';
					break;
				case 'regexp':
					serialized_value = skeleton[name].value.toString();
					break;
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

				serialized_actions.push('p.' + name + ' = ' + serialized_value + ';');

			} else {

				serialized_actions.push('p["' + name.replace(/\"/g, "\\\"") + '"] = ' + serialized_value + ';');

			}

		}

		for (name in class_data.shared) {

			serialized_actions.push('p.' + name + ' = s.' + name + ';');

		}

		return new Function('cd,p', "\tvar r=cd.references,\n\t\ts=cd.shared;\n\n\t" + serialized_actions.join('\n\t') + "\n");

	},

	/**
	 * Server-side export function: create an exported version of a class, which can be loaded by
	 * {@link Lava.ClassManager#loadClass} to save time on client
	 * @param {string} class_path
	 * @returns {Object}
	 */
	exportClass: function(class_path) {

		var class_data = this._sources[class_path],
			shared = {},
			name,
			result;

		for (name in class_data.shared) {

			if (name in class_data.source_object) {

				shared[name] = class_data.source_object[name];

			}

		}

		result = {
			// string data
			name: class_data.name,
			path: class_data.path,
			level: class_data.level,
			"extends": class_data['extends'],
			"implements": null,
			hierarchy_paths: class_data.hierarchy_paths,
			parent_class_data: null, // reserved for serialization

			prototype_generator: this._getPrototypeGenerator(class_data),
			shared: shared,
			references: null, // warning: partial array, contains only own class' members
			constructor: this.constructors[class_path],

			skeleton: class_data.skeleton, // may be deleted, if extension via define() is not needed for this class
			source_object: class_data.source_object // may be safely deleted before serialization.
		};

		if (class_data.parent_class_data) {

			// cut the parent's data and leave only child's
			result.references = class_data.references.slice(
				class_data.parent_class_data.references.length,
				class_data.parent_class_data.references.length + class_data.own_references_count
			);
			result.implements = class_data.implements.slice(class_data.parent_class_data.implements.length);

		} else {

			result.references = class_data.references.slice(0, class_data.own_references_count);
			result.implements = class_data.implements;

		}

		return result;

	},

	/**
	 * Load an object, exported by {@link Lava.ClassManager#exportClass}
	 * @param {Object} class_data
	 */
	loadClass: function(class_data) {

		var parent_data,
			name,
			shared = class_data.shared,
			i = 0,
			count,
			own_implements = class_data.implements;

		if (class_data['extends']) {

			parent_data = this._sources[class_data['extends']];
			if (Lava.schema.DEBUG && !parent_data) Lava.t("[loadClass] class parent does not exists: " + class_data['extends']);

			class_data.parent_class_data = parent_data;
			class_data.references = parent_data.references.concat(class_data.references);

			for (name in parent_data.shared) {

				if (!(name in shared)) {

					shared[name] = {};
					Firestorm.extend(shared[name], parent_data.shared[name]);

				} else {

					Firestorm.implement(shared[name], parent_data.shared[name]);

				}

			}

			class_data.implements = parent_data.implements.concat(class_data.implements);
			class_data.hierarchy_names = parent_data.hierarchy_names.slice();
			class_data.hierarchy_names.push(class_data.name);

		} else {

			class_data.hierarchy_names = [class_data.name];

		}

		for (count = own_implements.length; i < count; i++) {

			class_data.references = class_data.references.concat(this._sources[own_implements[i]].references);

		}

		class_data.prototype_generator(class_data, class_data.constructor.prototype);

		this._registerClass(class_data);

	},

	/**
	 * Put a newly built class constructor into it's namespace
	 * @param {_cClassData} class_data
	 */
	_registerClass: function(class_data) {

		var class_path = class_data.path,
			namespace_path = class_path.split('.'),
			class_name = namespace_path.pop(),
			namespace = this._getNamespace(namespace_path);

		if (Lava.schema.DEBUG && ((class_path in this._sources) || (class_path in this.constructors))) Lava.t("Class is already defined: " + class_path);

		if ((class_name in namespace) && namespace[class_name] != null) Lava.t("Class name conflict: '" + class_path + "' property is already defined in namespace path");

		this._sources[class_path] = class_data;
		this.constructors[class_path] = class_data.constructor;
		namespace[class_name] = class_data.constructor;

	},

	/**
	 * Find a class that begins with `base_path` or names of it's parents, and ends with `suffix`
	 * @param {string} base_path
	 * @param {string} suffix
	 * @returns {function}
	 */
	getPackageConstructor: function(base_path, suffix) {

		if (Lava.schema.DEBUG && !(base_path in this._sources)) Lava.t("[getPackageConstructor] Class not found: " + base_path);

		var path,
			current_class = this._sources[base_path],
			result = null;

		do {

			path = current_class.path + suffix;
			if (path in this.constructors) {

				result = this.constructors[path];
				break;

			}

			current_class = current_class.parent_class_data;

		} while (current_class);

		return result;

	},

	/**
	 * Get all names (full paths) of registered classes
	 * @returns {Array.<string>}
	 */
	getClassNames: function() {

		return Object.keys(this._sources);

	},

	/**
	 * Replace function in a class with new body. Class may be in middle of inheritance chain.
	 * Also replaces old method with <kw>null</kw>.
	 *
	 * @param {Object} instance Current class instance, must be <kw>this</kw>
	 * @param {string} instance_class_name Short name of current class
	 * @param {string} function_name Function to replace
	 * @param {string} new_function_name Name of new method from the prototype
	 * @returns {string} name of the method that was replaced
	 */
	patch: function(instance, instance_class_name, function_name, new_function_name) {

		var cd = instance.Class,
			proto = cd.constructor.prototype,
			names = cd.hierarchy_names,
			i = names.indexOf(instance_class_name),
			count = names.length,
			overridden_name;

		if (Lava.schema.DEBUG && i == -1) Lava.t();

		// find method that belongs to this class body
		for (; i < count; i++) {
			overridden_name = names[i] + "$" + function_name;
			// must not use "in" operator, as function body can be removed and assigned null (see below)
			if (proto[overridden_name]) {
				function_name = overridden_name;
				break;
			}
		}

		proto[function_name] = proto[new_function_name];
		// this plays role when class replaces it's method with parent's method (removes it's own method)
		// and parent also wants to apply patches to the same method (see comment above about the "in" operator)
		proto[new_function_name] = null;
		return function_name;

	}

};
