
/**
 * Common methods and properties for working with widget templates
 */
Lava.parsers.Common = {

	/**
	 * Same as regex in {@link Firestorm.String}, but without quotes and backslash
	 */
	UNQUOTE_ESCAPE_REGEX: /[\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

	/**
	 * The only allowed options on view's hash
	 * @type {Array.<string>}
	 */
	_allowed_hash_options: ['id', 'label', 'escape_off', 'as', 'own_enumerable_mode', 'depends'],
	/**
	 * Allowed "x:" attributes on elements
	 * @type {Array.<string>}
	 */
	_allowed_control_attributes: ['event', 'bind', 'style', 'classes', 'container_class', 'type', 'options', 'label', 'roles', 'resource_id', 'widget'],
	/**
	 * Words, that cannot be used as a label
	 * @type {Array.<string>}
	 */
	_reserved_labels: ['parent', 'widget', 'this', 'root'],

	/**
	 * When widgets are referenced in expressions - they are prefixed with these special characters, which define the kind of reference
	 * @type {Object.<string, string>}
	 */
	locator_types: {
		'#': 'Id',
		'@': 'Label',
		'$': 'Name'
	},

	/**
	 * A widget locator with a name (`_identifier_regex`) after dot. Examples: <str>"@accordion.accordion_panel"</str>,
	 * <str>"$tree.Tree$node"</str>.
	 */
	_locator_regex: /^[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\.([a-zA-Z\_][\$a-zA-Z0-9\_]*)/,
	/**
	 * Valid name of a variable
	 * @type {RegExp}
	 */
	_identifier_regex: /^[a-zA-Z\_][\$a-zA-Z0-9\_]*/,

	/**
	 * Special setters for some properties in view config
	 * @type {Object.<string, string>}
	 */
	_view_config_property_setters: {
		id: 'setViewConfigId',
		label: 'setViewConfigLabel',
		own_enumerable_mode: '_setOwnEnumerableMode',
		depends: '_setDepends'
	},

	/**
	 * For each type of item in raw templates: callbacks that return it's "compiled" version
	 * @type {Object.<string, string>}
	 */
	_compile_handlers: {
		string: '_compileString',
		include: '_compileInclude',
		expression: '_compileExpression',
		directive: '_compileDirective',
		block: '_compileBlock',
		tag: '_compileTag', // plain html tag, which should be converted to string
		// depending on attributes, tag may be treated as one of the following types:
		view: '_compileView', // element with x:type='view'
		container: '_compileContainer', // element with x:type='container'
		static: '_compileStaticContainer', // element with x:type='static'
		widget: '_compileWidget', // element with x:widget='WidgetName'
		sugar: '_compileSugar' // element with it's name in schema.sugar_map
	},

	/**
	 * Does given string represent a JavaScript literal ('true', 'false', 'null', 'undefined')
	 * @param {string} string
	 * @returns {boolean}
	 */
	isLiteral: function(string) {

		return (['true','false','null','undefined'].indexOf(string.toLowerCase()) !== -1);

	},

	/**
	 * Translate name of the view to name of it's class
	 * @param {string} name
	 * @returns {string}
	 */
	_viewNameToClass: function(name) {

		return Lava.schema.parsers.view_name_to_class_map[name] || name;

	},

	/**
	 * Store values from view's hash as config properties
	 * @param {_cView} view_config
	 * @param {Object} raw_hash
	 */
	_parseViewHash: function(view_config, raw_hash) {

		for (var name in raw_hash) {

			if (Lava.schema.DEBUG && this._allowed_hash_options.indexOf(name) == -1) Lava.t("Hash option is not supported: " + name);
			if (name in this._view_config_property_setters) {
				this[this._view_config_property_setters[name]](view_config, raw_hash[name]);
			} else {
				view_config[name] = raw_hash[name];
			}

		}

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: config property setters

	/**
	 * Check {@link _cView#id} for validity before assignment
	 * @param {_cView} view_config
	 * @param {string} id
	 */
	setViewConfigId: function(view_config, id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(id)) Lava.t();
		view_config.id = id;

	},

	/**
	 * Check {@link _cView#label} for validity before assignment
	 * @param {_cView} view_config
	 * @param {string} label
	 */
	setViewConfigLabel: function(view_config, label) {

		if (Lava.schema.DEBUG && !Lava.VALID_LABEL_REGEX.test(label)) Lava.t("Malformed view label");
		if (Lava.schema.DEBUG && this._reserved_labels.indexOf(label) != -1) Lava.t("Label name is reserved: " + label);
		view_config.label = label;

	},

	/**
	 * Set {@link _cScopeForeach#own_enumerable_mode}
	 * @param {_cView} view_config
	 * @param {string} own_enumerable_mode <str>"Enumerable"</str> or <str>"DataView"</str>
	 */
	_setOwnEnumerableMode: function(view_config, own_enumerable_mode) {

		if (Lava.schema.DEBUG && ['Enumerable', 'DataView'].indexOf(own_enumerable_mode) == -1) Lava.t("Malformed 'own_enumerable_mode' hash option");

		if (!('scope' in view_config)) {
			view_config['scope'] = {
				"own_enumerable_mode": own_enumerable_mode
			}
		} else {
			if (Lava.schema.DEBUG && ('own_enumerable_mode' in view_config['scope'])) Lava.t();
			view_config['scope']['own_enumerable_mode'] = own_enumerable_mode;
		}

	},

	/**
	 * Set {@link _cScopeForeach#depends}
	 * @param {_cView} view_config
	 * @param {string} depends_text Semicolon-separated list of scope paths
	 */
	_setDepends: function(view_config, depends_text) {

		var binds = [],
			raw_arguments = Lava.ExpressionParser.parseRaw(depends_text, Lava.ExpressionParser.SEPARATORS.SEMICOLON),
			i = 0,
			count = raw_arguments.length;

		if (Lava.schema.DEBUG && count == 0) Lava.t("malformed 'depends' hash option");

		for (; i < count; i++) {
			if (Lava.schema.DEBUG && (!raw_arguments[i].flags || !raw_arguments[i].flags.isScopeEval)) Lava.t('malformed "depends" hash option: argument ');
			binds.push(raw_arguments[i].binds[0]);
		}

		if (!('scope' in view_config)) {
			view_config['scope'] = {
				"depends": binds
			}
		} else {
			if (Lava.schema.DEBUG && ('depends' in view_config['scope'])) Lava.t();
			view_config['scope']['depends'] = binds;
		}

	},

	// End: config property setters
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: block handlers

	/**
	 * Compile a raw directive. Directives either produce widget configs, or modify the config of their parent view
	 * @param {_tTemplate} result
	 * @param {_cRawDirective} directive
	 * @param {_cView} view_config
	 */
	_compileDirective: function(result, directive, view_config) {

		var directive_result = Lava.parsers.Directives.processDirective(
				directive,
				view_config,
				// code style: to ensure, that view/widget directives are at the top
				(result.length == 0 || (result.length == 1 && typeof(result[0]) == 'string' && Lava.EMPTY_REGEX.test(result[0])))
			);

		if (directive_result) {

			if (typeof(directive_result) == 'string') {

				this._compileString(result, directive_result);

			} else {

				result.push(directive_result);

			}

		}

	},

	/**
	 * Compile raw include (push as is)
	 * @param {_tTemplate} result
	 * @param {_cInclude} include_config
	 */
	_compileInclude: function(result, include_config) {

		result.push(include_config);

	},

	/**
	 * Compile raw string (push or append to the last string in result)
	 * @param {_tTemplate} result
	 * @param {string} string
	 */
	_compileString: function(result, string) {

		var lastIndex = result.length - 1,
			// lastIndex may be -1, but this will eval correctly
			append_string = typeof (result[lastIndex]) == 'string';

		if (append_string) {

			result[lastIndex] += string;

		} else {

			result.push(string);

		}

	},

	/**
	 * Compile raw block (represents a view)
	 * @param {_tTemplate} result
	 * @param {_cRawBlock} raw_block
	 */
	_compileBlock: function(result, raw_block) {

		/** @type {_cView} */
		var config = {
				type: 'view',
				"class": null
			},
			i = 0,
			count;

		if (Lava.schema.parsers.PRESERVE_VIEW_NAME) {
			config.view_name = raw_block.name;
		}

		if ('arguments' in raw_block) {

			if (Lava.schema.DEBUG && raw_block.arguments.length > 1) Lava.t('Block may have no more than one argument');
			if (raw_block.arguments.length) {
				config.argument = raw_block.arguments[0];
			}

		}

		if ('class_locator' in raw_block) {
			config.class_locator = raw_block.class_locator;
			config.real_class = raw_block.real_class;
			config['class'] = Lava.schema.view.DEFAULT_CLASS_LOCATOR_GATEWAY;
		} else {
			config['class'] = this._viewNameToClass(raw_block.name);
		}

		if (raw_block.prefix == '$') {
			config.container = {type: 'Morph'};
		}

		this._parseViewHash(config, raw_block.hash); // before content, so directives could be parsed into the config

		if ('content' in raw_block) {
			config.template = this.compileTemplate(raw_block.content, config);
		} else {
			config.template = [];
		}

		if ('else_content' in raw_block) {
			config.else_template = this.compileTemplate(raw_block.else_content);
		}

		if ('elseif_arguments' in raw_block) {
			config.elseif_arguments = raw_block.elseif_arguments;
			config.elseif_templates = [];
			for (count = raw_block.elseif_content.length; i < count; i++) {
				config.elseif_templates.push(this.compileTemplate(raw_block.elseif_content[i]));
			}
		}

		result.push(config);

	},

	/**
	 * Compile raw expression view. Will produce a view config with class="Expression"
	 * @param {_tTemplate} result
	 * @param {_cRawExpression} raw_expression
	 */
	_compileExpression: function(result, raw_expression) {

		if (raw_expression.arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		var config = {
			type: 'view',
			"class": 'Expression',
			argument: raw_expression.arguments[0]
		};

		if (raw_expression.prefix == '$') {

			config.container = {type: 'Morph'};

		}

		result.push(config);

	},

	/**
	 * Serialize the tag back into text
	 * @param {_tTemplate} result
	 * @param {_cRawTag} tag
	 */
	_compileTag: function(result, tag) {

		var is_void = Lava.isVoidTag(tag.name),
			tag_start_text = "<" + tag.name
				+ this.renderTagAttributes(tag.attributes)
				+ (is_void ? '/>' : '>'),
			inner_template,
			count;

		this. _compileString(result, tag_start_text);

		if (Lava.schema.DEBUG && is_void && tag.content) Lava.t("Void tag with content");

		if (!is_void) {

			if (tag.content) {

				inner_template = this.compileTemplate(tag.content);
				count = inner_template.length;

				if (count && typeof (inner_template[0]) == 'string') {

					this._compileString(result, inner_template.shift());
					count--;

				}

				if (count) {

					result.splice.apply(result, [result.length, 0].concat(inner_template));

				}

			}

			this. _compileString(result, "</" + tag.name + ">");

		}

	},

	/**
	 * Compile raw tag with x:type="view". Will produce a {@link Lava.view.View} with an Element container
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileView: function(result, raw_tag) {

		var view_config = {
				type: 'view',
				"class": 'View',
				container: this._toContainer(raw_tag)
			},
			x = raw_tag.x;

		this._parseViewAttributes(view_config, raw_tag);

		if ('content' in raw_tag) view_config.template = this.compileTemplate(raw_tag.content, view_config);
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in view_config.container) || ('static_properties' in view_config.container) || ('static_styles' in view_config.container)))
				Lava.t("View container with resource_id: all properties must be moved to resources");
			view_config.container.resource_id = Lava.parsers.Common.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Compile raw tag with x:type="container". Extract the wrapped view and set this tag as it's container
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileContainer: function(result, raw_tag) {

		var x = raw_tag.x,
			inner_template,
			view_config,
			container_config,
			container_config_directive = null,
			name;

		if (Lava.schema.DEBUG) {

			if (Lava.isVoidTag(raw_tag.name)) Lava.t("Void tag with type='container'");
			if (!raw_tag.content) Lava.t("Empty container tag");
			this._assertControlAttributesValid(x);

			if (('options' in x) || ('roles' in x) || ('label' in x)) {

				Lava.t("Please move x:options, x:roles and x:label from container element to the wrapped view");

			}

		}

		inner_template = this.asBlocks(raw_tag.content);

		// inside there may be either a single view, or x:container_config, followed by the view
		if (inner_template.length == 1) {

			view_config = this.compileAsView(inner_template);

		} else if (inner_template.length == 2) {

			container_config_directive = inner_template[0];
			view_config = this.compileAsView([inner_template[1]]);

		} else {

			Lava.t("Malformed content of tag with type='container'");

		}

		if (Lava.schema.DEBUG && view_config.container) Lava.t("Wrapped view already has a container");
		container_config = this._toContainer(raw_tag);
		view_config.container = container_config;

		if (container_config_directive) {
			if (Lava.schema.DEBUG && (container_config_directive.type != 'directive' || container_config_directive.name != 'container_config'))
				Lava.t("Malformed content of tag with type='container'");
			Lava.parsers.Directives.processDirective(container_config_directive, view_config, true);
		}

		if (Lava.schema.DEBUG) {

			if ('id' in view_config) Lava.t("Please, move the id attribute from inner view's hash to wrapping container: " + view_config.id);

			if (('static_properties' in container_config) && ('property_bindings' in container_config)) {

				for (name in container_config.property_bindings) {

					if (name in container_config.static_properties)
						Lava.t("Same property can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

			if (('static_styles' in container_config) && ('style_bindings' in container_config)) {

				for (name in container_config.static_styles) {

					if (name in container_config.style_bindings)
						Lava.t("Same style can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) view_config.id = raw_tag.attributes.id;
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in container_config) || ('static_properties' in container_config) || ('static_styles' in container_config)))
				Lava.t("Element container with resource_id: all properties must be moved to resources");
			container_config.resource_id = this.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Compile tag with x:type="static"
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileStaticContainer: function(result, raw_tag) {

		var name,
			block;

		if (Lava.schema.DEBUG) {

			if (!raw_tag.x.resource_id) Lava.t("Static container requires resource id");
			for (name in raw_tag.x) {
				if (['type', 'resource_id'].indexOf(name) == -1) Lava.t("Unknown control attribute on static container: " + name);
			}

		}

		block = {
			type: 'static_tag',
			resource_id: this.parseResourceId(raw_tag.x.resource_id),
			name: raw_tag.name
		};

		if ('attributes' in raw_tag) Lava.t("Static container with resource_id: all attributes must be moved to resources");

		if (raw_tag.content) {
			block.template = this.compileTemplate(raw_tag.content);
		}

		result.push(block);

	},

	/**
	 * Compile a tag which belongs to widget's sugar. Parse it into tag config using {@link Lava.system.Sugar} class instance
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileSugar: function(result, raw_tag) {

		var schema = Lava.sugar_map[raw_tag.name],
			widget_config,
			sugar,
			result_config;

		if ('parse' in schema) {

			result_config = schema.parse(raw_tag);

		} else {

			widget_config = Lava.getWidgetConfig(schema.widget_title);
			sugar = Lava.getWidgetSugarInstance(schema.widget_title);
			result_config = sugar.parse(widget_config.sugar, raw_tag, schema.widget_title);

		}

		result.push(result_config);

	},

	/**
	 * Compile tag with x:widget="WidgetName". Represents a widget with explicitly defined Element container
	 *
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileWidget: function(result, raw_tag) {

		var config = this.createDefaultWidgetConfig();

		config['extends'] = raw_tag.x.widget;
		config.container = this._toContainer(raw_tag);

		this._parseViewAttributes(config, raw_tag);
		// Otherwise, there will be ambiguity between the target of the attribute (widget or it's container)
		// to set resource_id with x:widget - rewrite the declaration to x:type='container' with <x:widget> inside
		if (Lava.schema.DEBUG && raw_tag.x && ('resource_id' in raw_tag.x)) Lava.t("x:widget attribute is not compatible with resource_id attribute");
		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		result.push(config);

	},

	// End: block handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Assign some attributes of an element to `view_config`
	 * @param {_cView} view_config
	 * @param {_cRawTag} raw_tag
	 */
	_parseViewAttributes: function(view_config, raw_tag) {

		var x = raw_tag.x;

		if (x) {

			if (Lava.schema.DEBUG) this._assertControlAttributesValid(x);
			if ('options' in x) {

				if (typeof(x.options) != 'object') Lava.t("Malformed x:options");
				view_config.options = x.options;

			}
			if ('label' in x) this.setViewConfigLabel(view_config, x.label);
			if ('roles' in x) view_config.roles = this.parseTargets(x.roles);

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) this.setViewConfigId(view_config, raw_tag.attributes.id);

	},

	/**
	 * Check validity of control attributes and throw exception, in case they are invalid
	 * @param {_cRawX} x
	 */
	_assertControlAttributesValid: function(x) {

		for (var name in x) {
			if (this._allowed_control_attributes.indexOf(name) == -1) Lava.t("Unknown option in x: " + name);
		}

	},

	/**
	 * Convert raw tag to an Element container config
	 * @param {_cRawTag} raw_tag
	 * @returns {_cElementContainer}
	 */
	_toContainer: function(raw_tag) {

		var container_config = {
				type: 'Element',
				tag_name: raw_tag.name
			};

		if ('attributes' in raw_tag) this._parseContainerStaticAttributes(container_config, raw_tag.attributes);
		if ('x' in raw_tag) this._parseContainerControlAttributes(container_config, raw_tag.x);

		return /** @type {_cElementContainer} */ container_config;

	},

	/**
	 * Take raw control attributes, parse them, and store in `container_config`
	 * @param {_cElementContainer} container_config
	 * @param {_cRawX} x
	 */
	_parseContainerControlAttributes: function(container_config, x) {

		var i,
			count,
			name;

		if ('event' in x) {

			if (typeof(x.event) != 'object') Lava.t("Malformed x:event attribute");

			container_config.events = {};

			for (name in x.event) {

				container_config.events[name] = Lava.parsers.Common.parseTargets(x.event[name]);

			}

		}

		// Attribute binding. Example: x:bind:src="<any_valid_expression>"
		if ('bind' in x) {

			if (typeof(x.bind) != 'object') Lava.t("Malformed x:bind attribute");

			container_config.property_bindings = this._parseBindingsHash(x.bind);

		}

		if ('style' in x) {

			if (typeof(x.style) != 'object') Lava.t("Malformed x:style attribute");

			container_config.style_bindings = this._parseBindingsHash(x.style);

		}

		if ('classes' in x) {

			var arguments = Lava.ExpressionParser.parse(x.classes, Lava.ExpressionParser.SEPARATORS.SEMICOLON),
				class_bindings = {};

			for (i = 0, count = arguments.length; i < count; i++) {

				class_bindings[i] = arguments[i];

			}

			container_config.class_bindings = class_bindings;

		}

		if ('container_class' in x) {

			container_config['class'] = x.container_class;

		}

	},

	/**
	 * Parse object as [name] => &lt;expression&gt; pairs
	 *
	 * @param {Object.<string, string>} hash
	 * @returns {Object.<string, _cArgument>}
	 */
	_parseBindingsHash: function(hash) {

		if (typeof(hash) != 'object') Lava.t("Malformed control tag");

		var name,
			arguments,
			result = {};

		for (name in hash) {

			arguments = Lava.ExpressionParser.parse(hash[name]);
			if (arguments.length == 0) Lava.t("Binding: empty expression (" + name + ")");
			if (arguments.length > 1) Lava.t("Binding: malformed expression for '" + name + "'");
			result[name] = arguments[0];

		}

		return result;

	},

	/**
	 * Parse style attribute content (plain string) into object with keys being individual style names,
	 * and values being actual style values
	 *
	 * @param {string} styles_string
	 * @returns {Object.<string, string>}
	 */
	parseStyleAttribute: function(styles_string) {

		styles_string = styles_string.trim();

		var styles = styles_string.split(/[\;]+/),
			result = {},
			parts,
			i = 0,
			count = styles.length,
			resultCount = 0;

		if (styles_string) {

			for (; i < count; i++) {

				styles[i] = styles[i].trim();

				if (styles[i]) {

					parts = styles[i].split(':');

					if (parts.length == 2) {

						parts[0] = parts[0].trim();
						parts[1] = parts[1].trim();
						result[parts[0]] = parts[1];
						resultCount++;

					} else {

						Lava.t("Unable to parse the style attribute");

					}

				}

			}

		}

		return resultCount ? result : null;

	},

	/**
	 * Fills the following properties of the container: static_styles, static_classes and static_properties
	 *
	 * @param {_cElementContainer} container_config
	 * @param {Object.<string, string>} raw_attributes
	 */
	_parseContainerStaticAttributes: function(container_config, raw_attributes) {

		var name,
			list,
			static_properties = {};

		for (name in raw_attributes) {

			if (name == 'style') {

				list = this.parseStyleAttribute(raw_attributes.style);

				if (list) container_config.static_styles = list;

			} else if (name == 'class') {

				container_config.static_classes = raw_attributes['class'].trim().split(/\s+/);

			} else if (name == 'id') {

				// skip, as ID is handled separately

			} else {

				static_properties[name] = raw_attributes[name];

			}

		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in static_properties) {
			container_config.static_properties = static_properties;
			break;
		}

	},

	/**
	 * Compile raw template config
	 * @param {_tRawTemplate} blocks
	 * @param {_cView} [view_config]
	 * @returns {_tTemplate}
	 */
	compileTemplate: function(blocks, view_config) {

		var current_block,
			result = [],
			type,
			i = 0,
			count = blocks.length,
			x;

		for (; i < count; i++) {

			current_block = blocks[i];
			type = (typeof(current_block) == 'string') ? 'string' : current_block.type;

			if (type == 'tag') {

				x = current_block.x;

				if (x) {

					if ('type' in x) {

						if ('widget' in x) Lava.t("Malformed tag: both x:type and x:widget present");
						type = x.type;
						if (['view', 'container', 'static'].indexOf(type) == -1) Lava.t("Unknown x:type attribute: " + type);

					} else if ('widget' in x) {

						type = 'widget';

					} else if (Lava.sugar_map[current_block.name]) {

						type = 'sugar';

					} else {

						Lava.t("Tag with control attributes and no sugar or type on it: " + current_block.name);

					}

				} else if (Lava.sugar_map[current_block.name]) {

					type = 'sugar';

				} // else type = 'tag' - default

			}

			this[this._compile_handlers[type]](result, current_block, view_config);

		}

		return result;

	},

	/**
	 * Compile template as usual and assert that it contains single view inside. Return that view
	 *
	 * @param {_tRawTemplate} raw_blocks
	 * @returns {_cView}
	 */
	compileAsView: function(raw_blocks) {

		var result = this.asBlocks(this.compileTemplate(raw_blocks));
		if (result.length != 1) Lava.t("Expected: exactly one view, got either several or none.");
		if (result[0].type != 'view' && result[0].type != 'widget') Lava.t("Expected: view, got: " + result[0].type);
		return result[0];

	},

	/**
	 * Remove strings from template and assert they are empty
	 * @param {(_tRawTemplate|_tTemplate)} template
	 * @returns {Array}
	 */
	asBlocks: function(template) {

		var i = 0,
			count = template.length,
			result = [];

		for (; i < count; i++) {

			if (typeof(template[i]) == 'string') {

				if (!Lava.EMPTY_REGEX.test(template[i])) Lava.t("Text between tags is not allowed in this context. You may want to use a lava-style comment ({* ... *})");

			} else {

				result.push(template[i]);

			}

		}

		return result;

	},

	/**
	 * Extract blocks/tags from template and assert they all have specific type
	 * @param {Array} blocks
	 * @param {string} type
	 * @returns {Array}
	 */
	asBlockType: function(blocks, type) {

		var result = this.asBlocks(blocks),
			i = 0,
			count = result.length;

		for (; i < count; i++) {

			if (result[i].type != type) Lava.t("Block type is not permitted in this context. Expected: " + type + ", got: " + result[i].type);

		}

		return result;

	},

	/**
	 * Convert an object with element's attributes ([name] => &lt;value&gt; pairs) back into plain string
	 *
	 * @param {Object.<string, string>} attributes_object
	 * @returns {string}
	 */
	renderTagAttributes: function(attributes_object) {

		var name,
			result = '';

		for (name in attributes_object) {

			result += ' ' + name + '="' + attributes_object[name].replace(/\"/g,'\"') + '"';

		}

		return result;

	},

	/**
	 * Parse a string with semicolon-delimited list of widget targets (optionally, with arguments)
	 * @param {string} targets_string
	 * @returns {Array.<_cTarget>}
	 */
	parseTargets: function(targets_string) {

		var target = {},
			result = [],
			match,
			guid_match,
			config_ref,
			raw_arguments,
			i,
			count,
			flags;

		targets_string = targets_string.trim();

		if (targets_string == '') Lava.t("Code style: empty targets are not allowed");

		while (targets_string.length) {

			match = this._locator_regex.exec(targets_string);
			if (!match) guid_match = /^\d+$/.exec(targets_string);

			if (match) {

				target.locator_type = this.locator_types[targets_string[0]];
				target.locator = match[1];
				target.name = match[2];

			} else if (guid_match) {

				target.locator_type = 'Guid';
				target.locator = +guid_match[0];

			} else {

				match = this._identifier_regex.exec(targets_string);
				if (!match) Lava.t("Malformed targets (1): " + targets_string);
				target.name = match[0];

			}

			if (Lava.schema.DEBUG) {

				if ((target.locator_type == 'Id' || target.locator_type == 'Name') && !Lava.isValidId(target.locator)) Lava.t("Malformed id: " + target.locator);
				else if (target.locator_type == 'Label' && !Lava.VALID_LABEL_REGEX.test(target.locator)) Lava.t("Malformed target label" + target.locator);

			}

			targets_string = targets_string.substr(match[0].length);

			if (targets_string[0] == '(') {

				if (targets_string[1] == ')') Lava.t("Code style: empty target arguments must be removed");

				config_ref = {
					input: targets_string.substr(1),
					tail_length: 0
				};
				raw_arguments = Lava.ExpressionParser.parseWithTailRaw(config_ref, Lava.ExpressionParser.SEPARATORS.COMMA);
				target.arguments = [];

				for (i = 0, count = raw_arguments.length; i < count; i++) {

					flags = raw_arguments[i].flags;
					if (flags.isScopeEval) {

						target.arguments.push({
							type: Lava.TARGET_ARGUMENT_TYPES.BIND,
							data: raw_arguments[i].binds[0]
						});

					} else if (flags.isLiteral || flags.isNumber || flags.isString) {

						target.arguments.push({
							type: Lava.TARGET_ARGUMENT_TYPES.VALUE,
							data: Function('return ' + raw_arguments[i].evaluator_src).apply({})
						});

					} else {

						Lava.t("Expressions are not allowed for target callback arguments, only scope paths and static values");

					}

				}

				targets_string = targets_string.substr(targets_string.length - config_ref.tail_length);

			}

			if (targets_string[0] == ';') {

				targets_string = targets_string.substr(1).trim();

			} else if (targets_string.length) {

				targets_string = targets_string.trim();
				if (Lava.schema.DEBUG && targets_string.length) {
					if (targets_string[0] == ';') Lava.t("Space between semicolon in targets is not allowed");
					Lava.t('Malformed targets (2): ' + targets_string);
				}

			}

			result.push(target);

		}

		return result;

	},

	/**
	 * Parse value of x:resource_id attribute
	 * @param {string} id_string
	 * @returns {_cResourceId}
	 */
	parseResourceId: function(id_string) {

		id_string = id_string.trim();
		var match = this._locator_regex.exec(id_string),
			result;

		if (!match || match[2].indexOf('$') != -1) Lava.t("Malformed resource id: " + id_string);

		/** @type {_cResourceId} */
		result = {
			locator_type: this.locator_types[id_string[0]],
			locator: match[1],
			name: match[2]
		};

		return result;

	},

	/**
	 * Create an empty widget config with default class and extender from schema
	 * @returns {_cWidget}
	 */
	createDefaultWidgetConfig: function() {

		return {
			type: 'widget',
			"class": Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY,
			extender_type: Lava.schema.widget.DEFAULT_EXTENDER
		}

	},

	/**
	 * Turn a serialized and quoted string back into it's JavaScript representation.
	 *
	 * Assume that everything that follows a backslash is a valid escape sequence
	 * (all backslashes are prefixed with another backslash).
	 *
	 * Quotes inside string: lexer's regex will match all escaped quotes
	 *
	 * @param {string} raw_string
	 * @returns {string}
	 */
	unquoteString: function(raw_string) {

		var map = Firestorm.String.quote_escape_map,
			result;

		try {
			result = eval("(" + raw_string.replace(this.UNQUOTE_ESCAPE_REGEX, function (a) {
				var c = map[a];
				return typeof c == 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + ")");
		} catch (e) {
			Lava.t("Malformed string: " + raw_string);
		}

		return result;

	},

	toWidget: function(raw_tag) {

		var config = this.createDefaultWidgetConfig();
		config.container = this._toContainer(raw_tag);
		this._parseViewAttributes(config, raw_tag);

		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		return config

	}

};
/**
 * All TemplateParser directives
 */
Lava.parsers.Directives = {

	/**
	 * Settings for each directive
	 * @type {Object.<string, Object>}
	 */
	_directives_schema: {

		// view_config_presence:
		//  true, in case the directive is valid only inside view or widget. This automatically means that it should be at top.
		//  false, if it must be outside of view config

		define: {view_config_presence: false},
		define_resources: {view_config_presence: false},
		widget: {},
		static_value: {},
		static_eval: {},
		attach_directives: {},
		assign: {view_config_presence: true, is_top_directive: true},
		roles: {view_config_presence: true, is_top_directive: true},
		container_config: {view_config_presence: true, is_top_directive: true},
		refresher: {view_config_presence: true, is_top_directive: true},
		option: {view_config_presence: true, is_top_directive: true},
		options: {view_config_presence: true, is_top_directive: true},
		// Widget-only directives
		bind: {view_config_presence: true, is_top_directive: true},
		property: {view_config_presence: true, is_top_directive: true},
		properties: {view_config_presence: true, is_top_directive: true},
		property_string: {view_config_presence: true, is_top_directive: true},
		resources: {view_config_presence: true, is_top_directive: true},
		default_events: {view_config_presence: true, is_top_directive: true}
	},

	/**
	 * Handlers for tags in widget definition
	 * @type {Object.<string, string>}
	 */
	_widget_tag_actions: {
		// with directive analog
		bind: '_widgetTagBind',
		assign: '_widgetTagAssign',
		option: '_widgetTagOption',
		property: '_widgetTagProperty',
		options: '_widgetTagOptions',
		properties: '_widgetTagProperties',
		roles: '_widgetTagRoles',
		resources: '_widgetTagResources',
		default_events: '_widgetTagDefaultEvents',
		// without directive analog
		sugar: '_widgetTagSugar',
		storage: '_widgetTagStorage',
		storage_schema: '_widgetTagStorageSchema',
		edit_template: '_widgetTagEditTemplate',
		include: '_widgetTagInclude'
	},

	/**
	 * Handlers for tags inside x:resources
	 * @type {Object.<string, string>}
	 */
	_resource_tag_actions: {
		options: '_resourceTagOptions',
		container: '_resourceTagContainer',
		string: '_resourceTagString',
		plural_string: '_resourceTagPluralString'
	},

	/**
	 * Predefined edit_template tasks
	 * @type {Object.<string, string>}
	 */
	_known_edit_tasks: {
		replace_config_option: '_editTaskSetConfigOptions',
		add_class_binding: '_editTaskAddClassBinding'
	},

	/**
	 * Allowed properties on config of &lt;view&gt; in widget definition
	 * @type {Array.<string>}
	 */
	WIDGET_DEFINITION_ALLOWED_MAIN_VIEW_MEMBERS: ['template', 'container', 'class', 'type'],

	/**
	 * The title of the widget in x:define directive, which is currently being processed
	 * @type {string}
	 */
	_current_widget_title: null,
	/**
	 * Stack of widget configs, which are currently being processed by x:widget/x:define directives
	 * @type {Array.<_cWidget>}
	 */
	_widget_directives_stack: [],

	/**
	 * Handle directive tag
	 * @param {_cRawDirective} raw_directive Raw directive tag
	 * @param {(_cView|_cWidget)} view_config Config of the directive's parent view
	 * @param {boolean} is_top_directive Code style validation switch. Some directives must be at the top of templates
	 * @returns {*} Compiled template item or nothing
	 */
	processDirective: function(raw_directive, view_config, is_top_directive) {

		var directive_name = raw_directive.name,
			config = this._directives_schema[directive_name];

		if (!config) Lava.t("Unknown directive: " + directive_name);

		if (config.view_config_presence) {
			if (view_config && !config.view_config_presence) Lava.t('Directive must not be inside view definition: ' + directive_name);
			if (!view_config && config.view_config_presence) Lava.t('Directive must be inside view definition: ' + directive_name);
		}

		if (config.is_top_directive && !is_top_directive) Lava.t("Directive must be at the top of the block content: " + directive_name);

		return this['_x' + directive_name](raw_directive, view_config);

	},

	/**
	 * Helper method to copy properties from `source` to `destination`, if they exist
	 * @param {Object} destination
	 * @param {Object} source
	 * @param {Array.<string>} name_list List of properties to copy from `source` to `destination`
	 */
	_importVars: function(destination, source, name_list) {
		for (var i = 0, count = name_list.length; i < count; i++) {
			var name = name_list[i];
			if (name in source) destination[name] = source[name];
		}
	},

	////////////////////////////////////////////////////////////////////
	// start: actions for widget tags

	/**
	 * Parse {@link _cWidget#bindings}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagBind: function(raw_tag, widget_config) {

		this._parseBinding(widget_config, raw_tag);

	},

	/**
	 * Parse {@link _cView#assigns}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagAssign: function(raw_tag, widget_config) {

		this._parseAssign(widget_config, raw_tag);

	},

	/**
	 * Parse one option for {@link _cView#options}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOption: function(raw_tag, widget_config) {

		this._parseOption(widget_config, raw_tag, 'options');

	},

	/**
	 * Parse one property for {@link _cWidget#properties}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperty: function(raw_tag, widget_config) {

		this._parseProperty(widget_config, raw_tag, 'properties');

	},

	/**
	 * Parse {@link _cView#options}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOptions: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'options', raw_tag);

	},

	/**
	 * Parse {@link _cWidget#storage_schema}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorageSchema: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'storage_schema', raw_tag);

	},

	/**
	 * Parse {@link _cWidget#properties}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperties: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'properties', raw_tag);

	},

	/**
	 * Parse {@link _cView#roles}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagRoles: function(raw_tag, widget_config) {

		this._parseRoles(widget_config, raw_tag);

	},

	/**
	 * Parse {@link _cWidget#sugar}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagSugar: function(raw_tag, widget_config) {

		if ('sugar' in widget_config) Lava.t("Sugar is already defined");
		if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed option: " + raw_tag.attributes.name);
		widget_config.sugar = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cWidget#storage}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorage: function(raw_tag, widget_config) {

		Lava.parsers.Storage.parse(widget_config, raw_tag.content);

	},

	/**
	 * Parse {@link _cWidget#default_events}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagDefaultEvents: function(raw_tag, widget_config) {

		this._parseDefaultEvents(raw_tag, widget_config);

	},

	/**
	 * Parse {@link _cWidget#resources}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagResources: function(raw_tag, widget_config) {

		this._xresources(raw_tag, widget_config);

	},

	/**
	 * Parse &lt;arguments&gt; tag for edit_template
	 * @param {_tRawTemplate} raw_template
	 * @returns {Array.<*>}
	 */
	_parseTaskArguments: function(raw_template) {

		var blocks = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = blocks.length,
			temp,
			item,
			result = [];

		for (; i < count; i++) {

			switch (blocks[i].name) {
				case 'template':
					item = blocks[i].content ? Lava.parsers.Common.compileTemplate(blocks[i].content) : [];
					break;
				case 'expression':
					if (Lava.schema.DEBUG && (!blocks[i].content || blocks[i].content.length != 1)) Lava.t('malformed task arguments');
					temp = Lava.ExpressionParser.parse(blocks[i].content[0]);
					if (Lava.schema.DEBUG && temp.length != 1) Lava.t('malformed task arguments: multiple expressions');
					item = temp[0];
					break;
				case 'options':
					item = Lava.parseOptions(blocks[i].content[0]);
					break;
				default:
					Lava.t('edit_template: unknown or malformed task argument');
			}

			result.push(item);
		}

		return result;

	},

	/**
	 * Helper method for edit_template to evaluate and extract editing method from task definition
	 * @param {string} src
	 * @returns {*}
	 */
	_evalTaskHandler: function(src) {
		var handler = null;
		eval(src);
		if (Lava.schema.DEBUG && typeof(handler) != 'function') Lava.t('malformed task handler');
		return handler;
	},

	/**
	 * [ALPHA] Copy template and apply editing operations to it
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagEditTemplate: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.attributes || !raw_tag.attributes['name'])) Lava.t('Malformed edit_template tag');

		var tasks = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tasks.length,
			source_widget_config,
			template,
			extends_,
			widget_tag,
			content_blocks,
			block_index,
			block_count,
			blocks_hash,
			task_arguments,
			handler;

		if (raw_tag.attributes['source_widget']) {

			source_widget_config = Lava.widgets[raw_tag.attributes['source_widget']];
			if (Lava.schema.DEBUG && (!source_widget_config || source_widget_config.is_extended)) Lava.t('edit_template: source widget does not exist or is already extended');
			if (Lava.schema.DEBUG && (!source_widget_config.includes || !source_widget_config.includes[raw_tag.attributes.name])) Lava.t('[edit_template] source widget does not have the include: ' + raw_tag.attributes.name);
			template = Firestorm.clone(source_widget_config.includes[raw_tag.attributes.name]);

		} else {

			if (('includes' in widget_config) && widget_config.includes[raw_tag.attributes.name]) {

				template = widget_config.includes[raw_tag.attributes.name];

			} else {

				widget_tag = this._widget_directives_stack[this._widget_directives_stack.length - 1];
				if (!widget_tag) Lava.t('edit_template: unable to find source template');

				extends_ = widget_tag.attributes['extends'];
				while (true) {
					if (!extends_) Lava.t('edit_template: unable to find source template');
					source_widget_config = Lava.widgets[extends_];
					if (Lava.schema.DEBUG && (!source_widget_config || source_widget_config.is_extended)) Lava.t('edit_template: source widget does not exist or is already extended');
					if (source_widget_config.includes && source_widget_config.includes[raw_tag.attributes.name]) {
						template = source_widget_config.includes[raw_tag.attributes.name];
						break;
					}
					extends_ = source_widget_config['extends'];
				}

			}
			if (!template) Lava.t();
			template = Firestorm.clone(template);

		}

		for (; i < count; i++) { // collection of <task> tags

			if (Lava.schema.DEBUG && (!tasks[i].attributes || tasks[i].name != 'task')) Lava.t('Malformed edit_template task');

			task_arguments = null;
			blocks_hash = null;

			if (tasks[i].content) {
				blocks_hash = {};
				content_blocks = Lava.parsers.Common.asBlockType(tasks[i].content, 'tag');
				for (block_index = 0, block_count = content_blocks.length; block_index < block_count; block_index++) {
					blocks_hash[content_blocks[block_index].name] = content_blocks[block_index];
				}
				if ('arguments' in blocks_hash) {
					if (Lava.schema.DEBUG && !blocks_hash['arguments'].content) Lava.t('edit_template: malformed task arguments');
					task_arguments = this._parseTaskArguments(blocks_hash['arguments'].content);
				}
			}

			switch (tasks[i].attributes.type) {
				case 'manual':
					if (Lava.schema.DEBUG && (!blocks_hash['handler'] || !blocks_hash['handler'].content || blocks_hash['handler'].content.length != 1)) Lava.t('edit_template: malformed task handler');
					handler = this._evalTaskHandler(blocks_hash['handler'].content[0]);
					handler(template, tasks[i], blocks_hash, task_arguments);
					break;
				case 'traverse':
					if (Lava.schema.DEBUG && (!blocks_hash['handler'] || !blocks_hash['handler'].content || blocks_hash['handler'].content.length != 1)) Lava.t('edit_template: malformed task handler');
					handler = eval('(' + blocks_hash['handler'].content[0] + ')');
					if (Lava.schema.DEBUG && typeof(handler) != 'object') Lava.t('edit_template: wrong handler for traverse task');
					handler.arguments = task_arguments;
					Lava.TemplateWalker.walkTemplate(template, handler);
					break;
				case 'known':
					if (Lava.schema.DEBUG && !(tasks[i].attributes.name in this._known_edit_tasks)) Lava.t('[edit_template] unknown task: ' + tasks[i].attributes.name);
					this[this._known_edit_tasks[tasks[i].attributes.name]](template, tasks[i], blocks_hash, task_arguments);
					break;
				default:
					Lava.t('edit_template: task requires the "type" attribute');
			}

		}

		Lava.store(widget_config, 'includes', raw_tag.attributes.as || raw_tag.attributes.name, template);

	},

	/**
	 * Parse one include for {_cWidget#includes}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagInclude: function(raw_tag, widget_config) {

		var include = raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];
		Lava.store(widget_config, 'includes', raw_tag.attributes.name, include);

	},

	// end: actions for widget tags
	////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// Start: resource tags

	/**
	 * Parse x:resources definition
	 * @param {_cRawTag} raw_tag
	 * @param {string} widget_title
	 * @returns {Object}
	 */
	_parseResources: function(raw_tag, widget_title) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			resources = {},
			tag,
			value;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Empty resources definition");

		for (; i < count; i++) {

			tag = tags[i];
			if (Lava.schema.DEBUG && (!tag.attributes || !tag.attributes.path)) Lava.t("resources, tag is missing attributes: " + tag.name);
			if (Lava.schema.DEBUG && !(tag.name in this._resource_tag_actions)) Lava.t("resources, unknown tag: " + tag.name);
			value = this[this._resource_tag_actions[tag.name]](tag);
			if (Lava.schema.parsers.EXPORT_STRINGS && (value.type == 'string' || value.type == 'plural_string')) {
				Lava.resources.exportTranslatableString(value, widget_title, raw_tag.attributes.locale, tag.attributes.path);
			}
			Lava.resources.putResourceValue(resources, tag.attributes.path, value);

		}

		return resources;

	},

	/**
	 * Parse resource value as any JavaScript type, including arrays, objects and literals
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagOptions: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources options tag");

		return {
			type: 'options',
			value: Lava.parseOptions(raw_tag.content[0])
		};

	},

	/**
	 * Parse a translatable string
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagString: function(raw_tag) {

		if (Lava.schema.DEBUG && raw_tag.content && raw_tag.content.length != 1) Lava.t("Malformed resources string tag");

		var result = {
			type: 'string',
			value: raw_tag.content ? raw_tag.content[0].trim() : ''
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;

		return result;

	},

	/**
	 * Parse translatable plural string
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagPluralString: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content)) Lava.t("Malformed resources plural string tag");

		var plural_tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = plural_tags.length,
			plurals = [],
			result;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Malformed resources plural string definition");

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && (plural_tags[i].name != 'string' || !plural_tags[i].content || !plural_tags[i].content[0])) Lava.t("Resources, malformed plural string");
			plurals.push(plural_tags[i].content[0].trim());

		}

		result = {
			type: 'plural_string',
			value: plurals
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;

		return result;

	},

	/**
	 * Parse inheritable actions for classes, styles and container properties
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagContainer: function(raw_tag) {

		var tags = raw_tag.content ? Lava.parsers.Common.asBlockType(raw_tag.content, 'tag') : [],
			count = tags.length,
			result = {
				type: 'container_stack',
				value: []
			},
			operations_stack = result.value,
			operation_value,
			used_instructions = {},
			name;

		if (count) {

			if (Lava.schema.DEBUG) {
				if (count > 1) Lava.t("Malformed resources/container definition");
				if (tags[0].name != 'static_properties' && tags[0].name != 'add_properties') Lava.t("Malformed resources/container definition");
				if (!tags[0].attributes || tags[0].content) Lava.t("resources/container: malformed (static/add)_properties tag");
				if (('class' in tags[0].attributes) || ('style' in tags[0].attributes)) Lava.t("resources/container: class and style attributes must be defined separately from properties");
			}

			operations_stack.push({
				name: tags[0].name,
				value: tags[0].attributes
			});
			used_instructions[tags[0].name] = true;

		}

		for (name in raw_tag.attributes) {

			switch (name) {
				case 'remove_classes':
				case 'remove_properties':
				case 'remove_styles':
					if (Lava.schema.DEBUG && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty remove_* attributes from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s*,\s*/);
					break;
				case 'add_classes':
				case 'static_classes':
					if (Lava.schema.DEBUG && name == 'add_classes' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty add_classes attribute from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s+/);
					break;
				case 'add_styles':
				case 'static_styles':
					if (Lava.schema.DEBUG && name == 'add_styles' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty style attribute from resources/container tag");
					operation_value = Lava.parsers.Common.parseStyleAttribute(raw_tag.attributes[name]);
					break;
				case 'path': // the path and name of the resource
					operation_value = null;
					break;
				default:
					Lava.t("Unknown resources/container attribute:" + name);
			}

			if (operation_value) {
				operations_stack.push({
					name: name,
					value: operation_value
				});
				used_instructions[name] = true;
			}

		}

		if (Lava.schema.DEBUG) {

			if (
				('static_styles' in used_instructions && (('add_styles' in used_instructions) || ('remove_styles' in used_instructions)))
				|| ('static_classes' in used_instructions && (('add_classes' in used_instructions) || ('remove_classes' in used_instructions)))
				|| ('static_properties' in used_instructions && (('add_properties' in used_instructions) || ('remove_properties' in used_instructions)))
			)
				Lava.t("resources/container: having add/remove instructions together with 'set' instruction has no sense");

			if (operations_stack.length == 0) Lava.t("Empty resources/container definition");

		}

		return result;

	},

	// End: resource tags
	////////////////////////////////////////////////////////////////////

	/**
	 * Parse view widget tag: compile, extract and validate a single view inside it
	 * @param {_cRawTag} raw_tag
	 */
	_asMainView: function(raw_tag) {

		var view_config = Lava.parsers.Common.compileAsView(raw_tag.content),
			widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			name;

		if (Lava.schema.DEBUG) {
			if (view_config['class'] != 'View') Lava.t("define: view in <view> must be pure View, not subclass");
			if ('argument' in view_config) Lava.t("Widgets do not support arguments");
			for (name in view_config) {
				if (this.WIDGET_DEFINITION_ALLOWED_MAIN_VIEW_MEMBERS.indexOf(name) == -1) {
					Lava.t("<view>: view has an option, which can not be copied to widget: " + name + ". Probably, it must be specified via separate tag");
				}
			}
		}

		this._importVars(widget_config, view_config, ['template', 'container']);

		return widget_config;

	},

	/**
	 * Parse x:view and x:widget directives
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinition: function(raw_directive) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("Widget definition is missing attributes");

		var tags = raw_directive.content ? Lava.parsers.Common.asBlockType(raw_directive.content, 'tag') : [],
			widget_config = {},
			i = 0,
			count = tags.length,
			tag,
			name,
			path,
			is_storage_parsed = false;

		this._widget_directives_stack.push(raw_directive);

		if (count) {

			if (tags[0].name == 'view') {

				widget_config = this._asMainView(tags[0]);
				i = 1;

			} else if (tags[0].name == 'template') {

				widget_config.template = Lava.parsers.Common.compileTemplate(tags[0].content);
				i = 1;

			}

		}

		// extends must be set before <storage> (required by Lava.parsers.Storage.getMergedStorageSchema())
		if (raw_directive.attributes['extends']) widget_config['extends'] = raw_directive.attributes['extends'];

		for (; i < count; i++) {

			tag = tags[i];
			if (tag.name == 'storage_schema' && is_storage_parsed) Lava.t('Widget definition: `storage_schema` must preceed the `storage` tag');
			if (!(tag.name in this._widget_tag_actions)) Lava.t("Unknown tag in widget definition: " + tag.name + ". Note, that <template> and <view> tags must be on top.");
			this[this._widget_tag_actions[tag.name]](tag, widget_config);
			if (tag.name == 'storage') is_storage_parsed = true;

		}

		if (raw_directive.attributes.controller) {

			path = raw_directive.attributes.controller;
			// example: "$widgetname/ClassName1"
			if (path[0] in Lava.parsers.Common.locator_types) {

				i = path.indexOf('/');
				if (Lava.schema.DEBUG && i == -1) Lava.t("Malformed class name locator: " + path);
				name = path.substr(0, i); // cut the locator part, "$widgetname"
				widget_config.real_class = path.substr(i); // leave the name part: "/ClassName1"
				widget_config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
				if (Lava.schema.DEBUG && (!widget_config.class_locator.name || !widget_config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + path);

			} else {

				widget_config.real_class = raw_directive.attributes.controller;

			}

		}

		if (raw_directive.attributes.label) Lava.parsers.Common.setViewConfigLabel(widget_config, raw_directive.attributes.label);
		if (raw_directive.attributes.id) {
			if (Lava.schema.DEBUG && widget_config.id) Lava.t("[Widget configuration] widget id was already set via main view configuration: " + raw_directive.attributes.id);
			Lava.parsers.Common.setViewConfigId(widget_config, raw_directive.attributes.id);
		}

		if (!widget_config['class']) widget_config['class'] = Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY;
		if (!widget_config.extender_type) widget_config.extender_type = Lava.schema.widget.DEFAULT_EXTENDER;

		this._widget_directives_stack.pop();

		return widget_config;

	},

	/**
	 * Define a widget
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine: function(raw_directive) {

		if (Lava.schema.DEBUG) {
			if (!raw_directive.attributes || !raw_directive.attributes.title) Lava.t("define: missing 'title' attribute");
			if (raw_directive.attributes.title.indexOf(' ') != -1) Lava.t("Widget title must not contain spaces");
			if ('resource_id' in raw_directive.attributes) Lava.t("resource_id is not allowed on define");
			if (this._current_widget_title) Lava.t("Nested defines are not allowed: " + raw_directive.attributes.title);
		}

		this._current_widget_title = raw_directive.attributes.title;
		var widget_config = this._parseWidgetDefinition(raw_directive);
		this._current_widget_title = null;
		widget_config.is_extended = false; // reserve it for serialization

		if (Lava.schema.DEBUG && ('class_locator' in widget_config)) Lava.t("Dynamic class names are allowed only in inline widgets, not in x:define");

		Lava.storeWidgetSchema(raw_directive.attributes.title, widget_config);

	},

	/**
	 * Inline widget definition
	 * @param {_cRawDirective} raw_directive
	 */
	_xwidget: function(raw_directive) {

		var widget_config = this._parseWidgetDefinition(raw_directive);

		if (Lava.schema.DEBUG && ('sugar' in widget_config)) Lava.t("Inline widgets must not have sugar");
		if (Lava.schema.DEBUG && !widget_config['class'] && !widget_config['extends']) Lava.t("x:define: widget definition is missing either 'controller' or 'extends' attribute");
		if (raw_directive.attributes.resource_id) widget_config.resource_id = Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id);

		widget_config.type = 'widget';
		return widget_config;

	},

	/**
	 * Parse an assign config for {@link _cView#assigns}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xassign: function(raw_directive, view_config) {

		this._parseAssign(view_config, raw_directive);

	},

	/**
	 * Perform parsing an assign from {@link _cView#assigns}
	 * @param {(_cView|_cWidget)} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseAssign: function(config, raw_tag) {

		if (!('assigns' in config)) config.assigns = {};

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("assign: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed assign");
		if (raw_tag.attributes.name in config.assigns) Lava.t("Duplicate assign: " + raw_tag.attributes.name);

		var arguments = Lava.ExpressionParser.parse(raw_tag.content[0]);
		if (Lava.schema.DEBUG && arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		if (raw_tag.attributes.once && Lava.types.Boolean.fromString(raw_tag.attributes.once)) {

			arguments[0].once = true;

		}

		config.assigns[raw_tag.attributes.name] = arguments[0];

	},

	/**
	 * Parse an option for {@link _cView#options}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xoption: function(raw_directive, view_config) {

		this._parseOption(view_config, raw_directive, 'options');

	},

	/**
	 * Perform parsing of a tag with serialized JavaScript object inside it
	 * @param {(_cView|_cWidget)} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} config_property_name Name of the config member, which holds target JavaScript object
	 */
	_parseOption: function(config, raw_tag, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);

		var option_type = raw_tag.attributes.type,
			result;

		if (option_type) {

			if (option_type == 'targets') {

				result = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

			} else if (option_type == 'expressions') {

				result = Lava.ExpressionParser.parse(raw_tag.content[0], Lava.ExpressionParser.SEPARATORS.SEMICOLON);

			} else {

				Lava.t("Unknown option type: " + option_type);

			}

		} else {

			result = Lava.parseOptions(raw_tag.content[0]);

		}

		Lava.store(config, config_property_name, raw_tag.attributes.name, result);

	},

	/**
	 * Perform parsing a property from {@link _cWidget#properties}
	 * @param {_cWidget} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} config_property_name Name of the config member, which holds target JavaScript object
	 */
	_parseProperty: function(config, raw_tag, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);
		Lava.store(config, config_property_name, raw_tag.attributes.name, Lava.parseOptions(raw_tag.content[0]));

	},

	/**
	 * Parse {@link _cView#roles}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xroles: function(raw_directive, view_config) {

		this._parseRoles(view_config, raw_directive);

	},

	/**
	 * Perform parsing a role from {@link _cView#roles}
	 * @param {(_cView|_cWidget)} config
	 * @param {_cRawTag} raw_tag
	 */
	_parseRoles: function(config, raw_tag) {

		if ('roles' in config) Lava.t("Roles are already defined");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed roles tag/directive");
		config.roles = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cView#container}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xcontainer_config: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length == 0)) Lava.t("Malformed container_config directive: content is missing");
		if (Lava.schema.DEBUG && !view_config.container) Lava.t("Trying to change container settings for container-less view. Please, change the view opening tag (# => $) or move the directive into wrapping container.");

		var original_config = view_config.container,
			config = Lava.parseOptions(raw_directive.content[0]),
			name;

		if (Lava.schema.DEBUG) {
			for (name in config) {
				if (['type', 'options'].indexOf(name) == -1) Lava.t('[_xcontainer_config] setting config property is not allowed: ' + name);
			}
		}

		if ('type' in config) original_config['type'] = config['type'];
		if ('options' in config) {
			if (!('options' in original_config)) original_config.options = {};
			Firestorm.extend(original_config.options, config.options);
		}

	},

	/**
	 * Parse {@link _cView#refresher}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xrefresher: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && view_config.type == 'widget') Lava.t("Wrong usage of x:refresher directive. May be applied only to views.");
		if (Lava.schema.DEBUG && ('refresher' in view_config)) Lava.t("Refresher is already defined");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed refresher config: no content");
		view_config.refresher = Lava.parseOptions(raw_directive.content[0]);

	},

	/**
	 * Perform parsing {@link _cWidget#bindings}
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBinding: function(widget_config, raw_element) {

		if (raw_element.content.length != 1) Lava.t("Malformed binding in widget definition: " + raw_element.attributes.name);

		var binding = {
			property_name: raw_element.attributes.name,
			path_config: Lava.ExpressionParser.parseScopeEval(raw_element.content[0])
		};
		if ('from_widget' in raw_element.attributes) {
			if (Lava.schema.DEBUG && ['', '1', 'true'].indexOf(raw_element.attributes['from_widget']) == -1) Lava.t('binding: invalid from_widget attribute');
			binding.from_widget = true;
		}
		Lava.store(widget_config, 'bindings', raw_element.attributes.name, binding);

	},

	/**
	 * Parse {@link _cWidget#bindings}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbind: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Binding directive requires a widget");
		this._parseBinding(widget_config, raw_directive);

	},

	/**
	 * Parse a tag with JavaScript object inside
	 * @param {(_cView|_cWidget)} config
	 * @param {string} name
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseObject: function(config, name, raw_tag) {

		if (Lava.schema.DEBUG && (name in config)) Lava.t("Object already exists: " + name + ". Ensure, that x:options and x:properties directives appear before x:option and x:property.");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed directive or tag for config property: " + name);
		config[name] = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cView#options}
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} config
	 */
	_xoptions: function(raw_directive, config) {

		this._parseObject(config, 'options', raw_directive);

	},

	/**
	 * Parse a property for {@link _cWidget#properties}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseProperty(widget_config, raw_directive, 'properties');

	},

	/**
	 * Parse {@link _cWidget#properties}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperties: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseObject(widget_config, 'properties', raw_directive);

	},

	/**
	 * Helper method for widget directives
	 * @param {_cWidget} widget_config
	 * @param {_cRawDirective} raw_directive
	 * @param {string} config_property_name
	 */
	_storeDirectiveContent: function(widget_config, raw_directive, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed property: " + raw_directive.attributes.name);
		Lava.store(widget_config, config_property_name, raw_directive.attributes.name, raw_directive.content[0]);

	},

	/**
	 * Parse a property for {@link _cWidget#properties} as a string
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty_string: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("property_string directive requires a widget");

		this._storeDirectiveContent(widget_config, raw_directive, 'properties');

	},

	/**
	 * Store a string as an option value
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xoption_string: function(raw_directive, widget_config) {

		this._storeDirectiveContent(widget_config, raw_directive, 'options');

	},

	/**
	 * Standalone resources definition for global widget
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine_resources: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'] || !raw_directive.attributes['for']))
			Lava.t("Malformed x:resources definition. 'locale' and 'for' are required");

		Lava.resources.addWidgetResource(
			raw_directive.attributes['for'],
			raw_directive.attributes['locale'],
			this._parseResources(raw_directive, raw_directive.attributes['for'])
		);

	},

	/**
	 * Parse {@link _cWidget#resources}
	 * @param {(_cRawDirective|_cRawTag)} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xresources: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'])) Lava.t("Malformed resources definition, missing locale");

		if (!widget_config.resources) {
			widget_config.resources = {}
		}

		if (Lava.schema.DEBUG && (raw_directive.attributes['locale'] in widget_config.resources))
			Lava.t("Locale is already defined: " + raw_directive.attributes['locale']);

		widget_config.resources[raw_directive.attributes['locale']] = this._parseResources(raw_directive, this._current_widget_title);

	},

	/**
	 * Parse {@link _cStaticValue}
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_value: function(raw_directive) {

		if (Lava.schema.DEBUG && (raw_directive.content || !raw_directive.attributes || !raw_directive.attributes.resource_id))
			Lava.t("Malformed static_value directive. Note: content inside directive is not allowed, even if it's blank space.");

		return {
			type: 'static_value',
			resource_id: Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id)
		}

	},

	/**
	 * Parse {@link _cStaticEval}.
	 * Warning! Inner argument should depend only on static data.
	 * Bindings are allowed, but not recommended, cause at the moment when template is rendered - they may be dirty
	 *
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_eval: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1))
			Lava.t('Malformed static_eval directive. No content.');

		var arguments = Lava.ExpressionParser.parse(raw_directive.content[0]);

		if (Lava.schema.DEBUG && arguments.length == 0) Lava.t("static_eval: malformed argument");

		return {
			type: 'static_eval',
			argument: arguments[0]
		}

	},

	/**
	 * Wrapper, used to apply directives to a void tag
	 * @param {_cRawDirective} raw_directive
	 */
	_xattach_directives: function(raw_directive) {

		if (Lava.schema.DEBUG && !raw_directive.content) Lava.t("empty attach_directives");

		var blocks = Lava.parsers.Common.asBlocks(raw_directive.content),
			sugar = blocks[0],
			directives = blocks.slice(1),
			i,
			count;

		if (Lava.schema.DEBUG) {
			if (sugar.type != 'tag' || sugar.content || directives.length == 0) Lava.t("Malformed attach_directives");
			for (i = 0, count = directives.length; i < count; i++) {
				if (directives[i].type != 'directive') Lava.t("Malformed attach_directives");
			}
		}

		sugar.content = directives;
		return Lava.parsers.Common.compileAsView([sugar]);

	},

	/**
	 * Perform parsing of {@link _cWidget#default_events}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseDefaultEvents: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.content || !raw_tag.content.length)) Lava.t('default_events: no content.');
		if (Lava.schema.DEBUG && ('default_events' in widget_config)) Lava.t('default_events: property already defined');

		var events = Lava.parseOptions(raw_tag.content[0]),
			i = 0,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(events)) Lava.t('default_events: array expected');
			for (count = events.length; i < count; i++) {
				if (typeof(events[i]) != 'string') Lava.t('default_events: expected an array of strings');
			}
		}

		widget_config.default_events = Lava.excludeDefaultEvents(events);

	},

	/**
	 * Parse {@link _cWidget#default_events}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xdefault_events: function(raw_directive, widget_config) {

		this._parseDefaultEvents(raw_directive, widget_config);

	},

	/**
	 * Search for an item inside template, for edit_template
	 * @param {_tTemplate} template
	 * @param {string} node_type Type of template item to search for
	 * @param {string} condition JavaScript expression which returns <kw>true</kw> for valid items
	 * @returns {_tTemplateItem}
	 */
	_selectFirst: function(template, node_type, condition) {

		var filter,
			visitor = {},
			target = null;

		filter = condition
			? new Function('node', 'return !!(' + condition + ')')
			: function() { return true; };

		visitor['visit' + node_type] = function(walker, node) {
			if (filter(node)) {
				target = node;
				walker.interrupt();
			}
		};

		Lava.TemplateWalker.walkTemplate(template, visitor);

		return target;

	},

	/**
	 * Predefined template editing task for edit_template: set any JavaScript object at some path inside template item
	 * @param {_tTemplate} template
	 * @param {_cRawTag} task_tag
	 * @param {Object.<string,_cRawTag>} content_blocks_hash
	 * @param {Array.<*>} task_arguments
	 */
	_editTaskSetConfigOptions: function(template, task_tag, content_blocks_hash, task_arguments) {

		if (Lava.schema.DEBUG && !task_tag.attributes.node_type) Lava.t('_editTaskSetConfigOptions: malformed attributes');

		var assign = content_blocks_hash.assign,
			set_path,
			set_var,
			set_value,
			i = 0,
			count,
			current_segment,
			type;

		if (Lava.schema.DEBUG && (!assign || !assign.attributes || !assign.attributes['path'] || !assign.content || assign.content.length != 1))
			Lava.t('_editTaskSetConfigOptions: malformed or missing assign');

		current_segment = this._selectFirst(template, task_tag.attributes.node_type, task_tag.attributes.condition);

		if (!current_segment) Lava.t('_editTaskSetConfigOptions: target not found');

		set_path = content_blocks_hash.assign.attributes['path'].split('.');
		set_var = set_path.pop();
		set_value = Lava.parseOptions(content_blocks_hash.assign.content[0]);

		for (count = set_path.length; i < count; i++) {
			if (!(set_path[i] in current_segment)) {
				current_segment[set_path[i]] = {};
			} else if (Lava.schema.DEBUG) {
				type = Firestorm.getType(current_segment[set_path[i]]);
				if (type != 'null' && type != 'object') Lava.t('_editTaskSetConfigOptions: trying to set a path, which is not an object');
			}
			current_segment = current_segment[set_path[i]]
		}

		current_segment[set_var] = set_value;

	},

	/**
	 * Predefined task for edit_template: add a class to view's container
	 * @param {_tTemplate} template
	 * @param {_cRawTag} task_tag
	 * @param {Object.<string,_cRawTag>} content_blocks_hash
	 * @param {Array.<*>} task_arguments
	 */
	_editTaskAddClassBinding: function(template, task_tag, content_blocks_hash, task_arguments) {

		if (Lava.schema.DEBUG && !task_tag.attributes.node_type) Lava.t('_editTaskAddClassBinding: malformed attributes');

		var target,
			i = 0;

		target = this._selectFirst(template, task_tag.attributes.node_type, task_tag.attributes.condition);

		if (!target || !target.container) Lava.t('_editTaskAddClassBinding: target not found or does not have a container');

		if (target.container.class_bindings) {
			while (i in target.container.class_bindings) { // find the first free index
				i++;
			}
			target.container.class_bindings[i] = task_arguments[0];
		} else {
			target.container.class_bindings = {
				0: task_arguments[0]
			};
		}

	}

};
/**
 * Methods for parsing {@link _cWidget#storage}
 */
Lava.parsers.Storage = {

	/**
	 * Kinds of tag with storage items
	 * @type {Object.<string, string>}
	 */
	_root_handlers: {
		template_collection: '_parseTemplateCollection',
		object_collection: '_parseObjectCollection',
		template_hash: '_parseTemplateHash',
		object_hash: '_parseObjectHash',
		object: '_parseObject'
	},

	/**
	 * Kinds of tags that describe object properties
	 * @type {Object.<string, string>}
	 */
	_object_property_handlers: {
		template: '_parsePropertyAsTemplate',
		lava_type: '_parsePropertyAsLavaType'
	},

	/**
	 * Kinds of attributes on tags that describe objects
	 * @type {Object.<string, string>}
	 */
	_object_attributes_handlers: {
		lava_type: '_parseAttributeAsLavaType'
	},

	/**
	 * Parse raw tags as widget's storage
	 * @param {_cWidget} widget_config
	 * @param {_tRawTemplate} raw_template
	 */
	parse: function(widget_config, raw_template) {

		var storage_schema = this.getMergedStorageSchema(widget_config),
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length,
			item_schema;

		for (; i < count; i++) {

			item_schema = storage_schema[tags[i].name];
			if (Lava.schema.DEBUG && !item_schema) Lava.t('parsing storage; no schema for ' + tags[i].name);
			Lava.store(widget_config, 'storage', tags[i].name, this[this._root_handlers[item_schema.type]](item_schema, tags[i]));

		}

	},

	/**
	 * Template represents an array of storage items (templates or objects)
	 * @param {_cStorageItemSchema} schema
	 * @param {_tRawTemplate} raw_template
	 * @param {string} callback_name
	 * @returns {Array}
	 */
	_walkTemplateAsArray: function(schema, raw_template, callback_name) {

		var result = [],
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			result.push(
				this[callback_name](schema, tags[i])
			);

		}

		return result;

	},

	/**
	 * Template represents a hash of items (templates or objects) with 'name' attribute on each item
	 * @param {_cStorageItemSchema} schema
	 * @param {_tRawTemplate} raw_template
	 * @param {string} callback_name
	 * @returns {Object}
	 */
	_walkTemplateAsHash: function(schema, raw_template, callback_name) {

		var result = {},
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (Lava.schema.DEBUG) {
				if (tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
				if (!tags[i].attributes || !tags[i].attributes.name) Lava.t("Storage: hash tag is missing the name attribute");
				if (tags[i].attributes.name in result) Lava.t('Duplicate item name in storage:' + tags[i].attributes.name);
			}

			result[tags[i].attributes.name] = this[callback_name](schema, tags[i], true);

		}

		return result;

	},

	/**
	 * Convert `raw_tag` into template
	 * @param {_cStorageItemSchema} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {_tTemplate}
	 */
	_asTemplate: function(schema, raw_tag) {

		return Lava.parsers.Common.compileTemplate(raw_tag.content);

	},

	/**
	 * Convert `raw_rag` into object with given `schema`
	 * @param {_cStorageItemSchema} schema
	 * @param {_cRawTag} raw_tag
	 * @param {boolean} exclude_name
	 * @returns {Object}
	 */
	_asObject: function(schema, raw_tag, exclude_name) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			result = {},
			descriptor,
			name;

		for (; i < count; i++) {

			descriptor = schema.properties[tags[i].name];
			if (Lava.schema.DEBUG && !descriptor) Lava.t("Unknown tag in object: " + tags[i].name);
			if (Lava.schema.DEBUG && (tags[i].name in result)) Lava.t('[Storage] duplicate item in object: ' + tags[i].name);
			result[tags[i].name] = this[this._object_property_handlers[descriptor.type]](descriptor, tags[i]);

		}

		for (name in raw_tag.attributes) {

			if (exclude_name && name == 'name') continue;
			descriptor = schema.properties[name];
			if (Lava.schema.DEBUG && (!descriptor || !descriptor.is_attribute)) Lava.t("Unknown attribute in object: " + name);
			if (Lava.schema.DEBUG && (name in result)) Lava.t('[Storage] duplicate item (attribute) in object: ' + name);
			result[name] = this[this._object_attributes_handlers[descriptor.type]](descriptor, raw_tag.attributes[name]);

		}

		return result;

	},

	/**
	 * In case of server-side parsing widget configs may be unextended. Manually merge only {@link _cWidget#storage_schema}
	 * from hierarchy of widget configs
	 * @param {_cWidget} widget_config
	 * @returns {Object.<name, _cStorageItemSchema>}
	 */
	getMergedStorageSchema: function(widget_config) {

		var parent_schema,
			result = widget_config.storage_schema;

		if (!widget_config.is_extended && widget_config['extends']) {

			parent_schema = this.getMergedStorageSchema(Lava.widgets[widget_config['extends']]);
			if (parent_schema) {
				if (result) {
					result = Firestorm.clone(result);
					Lava.mergeStorageSchema(result, parent_schema);
				} else {
					result = parent_schema;
				}
			}

		}

		return result;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root handlers

	/**
	 * Parse root storage tag's content as an array of templates
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseTemplateCollection: function(item_schema, raw_tag) {

		return this._walkTemplateAsArray(item_schema, raw_tag.content, '_asTemplate');

	},

	/**
	 * Parse root storage tag's content as array of objects with known structure
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObjectCollection: function(item_schema, raw_tag) {

		return this._walkTemplateAsArray(item_schema, raw_tag.content, '_asObject');

	},

	/**
	 * Parse root tag's content as hash of templates
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseTemplateHash: function(item_schema, raw_tag) {

		return this._walkTemplateAsHash(item_schema, raw_tag.content, '_asTemplate');

	},

	/**
	 * Parse root tag's content as hash of objects
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObjectHash: function(item_schema, raw_tag) {

		return this._walkTemplateAsHash(item_schema, raw_tag.content, '_asObject');

	},

	/**
	 * Parse tag's content as object with known structure
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObject: function(item_schema, raw_tag) {

		return this._asObject(item_schema, raw_tag);

	},

	// end: root handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Parse a tag inside object, that represents a template
	 * @param {_cStorageObjectPropertySchema} schema
	 * @param {_cRawTag} raw_tag
	 */
	_parsePropertyAsTemplate: function(schema, raw_tag) {

		return raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];

	},

	/**
	 * Parse tag inside object, that represents a type from {@link Lava.types}
	 * @param {_cStorageObjectPropertySchema} schema
	 * @param {_cRawTag} raw_tag
	 */
	_parsePropertyAsLavaType: function(schema, raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || typeof (raw_tag.content[0]) != 'string')) Lava.t("One string expected in tag content: " + raw_tag.name);
		return Lava.valueToType(schema, raw_tag.content[0]);

	},

	/**
	 * Parse object attribute as a type from {@link Lava.types}
	 * @param {_cStorageObjectPropertySchema} descriptor
	 * @param {string} value
	 * @returns {*}
	 */
	_parseAttributeAsLavaType: function(descriptor, value) {

		return Lava.valueToType(descriptor, value);

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ObjectParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"value":5,"objectDefinition":6,"arrayDefinition":7,"RAW_STRING":8,"NUMBER":9,"identifierPath":10,"DOT":11,"IDENTIFIER":12,"OPEN_CURLY":13,"memberList":14,"CLOSE_CURLY":15,"COMMA":16,"member":17,"COLON":18,"OPEN_SQUARE":19,"valueList":20,"CLOSE_SQUARE":21,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",8:"RAW_STRING",9:"NUMBER",11:"DOT",12:"IDENTIFIER",13:"OPEN_CURLY",15:"CLOSE_CURLY",16:"COMMA",18:"COLON",19:"OPEN_SQUARE",21:"CLOSE_SQUARE"},
productions_: [0,[3,1],[3,2],[5,1],[5,1],[5,1],[5,1],[5,1],[10,3],[10,1],[6,3],[6,2],[14,3],[14,1],[17,3],[17,3],[7,3],[7,2],[20,3],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 7: yy.assertPathValid($$[$0]); // note: also matches literals like 'true', 'false' and 'null' 
break;
case 8: $$[$0-2].push($$[$0]); 
break;
case 9: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{1:[3]},{1:[2,1]},{4:[1,12]},{4:[2,3],15:[2,3],16:[2,3],21:[2,3]},{4:[2,4],15:[2,4],16:[2,4],21:[2,4]},{4:[2,5],15:[2,5],16:[2,5],21:[2,5]},{4:[2,6],15:[2,6],16:[2,6],21:[2,6]},{4:[2,7],11:[1,13],15:[2,7],16:[2,7],21:[2,7]},{8:[1,17],12:[1,18],14:14,15:[1,15],17:16},{5:21,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10],20:19,21:[1,20]},{4:[2,9],11:[2,9],15:[2,9],16:[2,9],21:[2,9]},{1:[2,2]},{12:[1,22]},{15:[1,23],16:[1,24]},{4:[2,11],15:[2,11],16:[2,11],21:[2,11]},{15:[2,13],16:[2,13]},{18:[1,25]},{18:[1,26]},{16:[1,28],21:[1,27]},{4:[2,17],15:[2,17],16:[2,17],21:[2,17]},{16:[2,19],21:[2,19]},{4:[2,8],11:[2,8],15:[2,8],16:[2,8],21:[2,8]},{4:[2,10],15:[2,10],16:[2,10],21:[2,10]},{8:[1,17],12:[1,18],17:29},{5:30,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{5:31,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{4:[2,16],15:[2,16],16:[2,16],21:[2,16]},{5:32,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{15:[2,12],16:[2,12]},{15:[2,14],16:[2,14]},{15:[2,15],16:[2,15]},{16:[2,18],21:[2,18]}],
defaultActions: {2:[2,1],12:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: return 13; 
break;
case 1: return 15; 
break;
case 2: return 19; 
break;
case 3: return 21; 
break;
case 4: return 18; 
break;
case 5: return 11; 
break;
case 6: return 16; 
break;
case 7: return 9; 
break;
case 8: return 9; 
break;
case 9: return 8; 
break;
case 10: return 8; 
break;
case 11: return 12; 
break;
case 12: /* skip whitespace */ 
break;
case 13: return 4; 
break;
}
},
rules: [/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?::)/,/^(?:\.)/,/^(?:,)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"([^\\\"]|\\.)*")/,/^(?:'([^\\\']|\\.)*')/,/^(?:[a-zA-Z\_][a-zA-Z0-9\_]*)/,/^(?:\s+)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.ObjectParser.yy = {

	/**
	 * Additional globals may be added to the white list
	 */
	valid_globals: ['Lava'],

	/**
	 * Keep in mind: configs must be serializable
	 * @param {Array} path_segments
	 */
	assertPathValid: function(path_segments) {

		if (Lava.schema.VALIDATE_OBJECT_PATHS) {

			if (!Lava.parsers.Common.isLiteral(path_segments[0]) && this.valid_globals.indexOf(path_segments[0]) == -1) {
				Lava.t("ObjectParser: invalid external path. Text: " + path_segments.join('.'));
			}

		}

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ExpressionParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"expressions":5,"SEMICOLON":6,"expressionWithOptionalDepends":7,"COMMA":8,"scopeEvalList":9,"scopeEval":10,"expression":11,"DEPENDS_START":12,"OPEN_CURLY":13,"CLOSE_CURLY":14,"expressionTail":15,"operand":16,"OPERATOR":17,"OPEN_BRACE":18,"CLOSE_BRACE":19,"arrayDefinition":20,"NUMBER":21,"RAW_STRING":22,"LITERAL":23,"dynamicScope":24,"functionCall":25,"OPEN_SQUARE":26,"expressionList":27,"CLOSE_SQUARE":28,"knownView":29,"VIEW_BY_LABEL":30,"VIEW_BY_ID":31,"VIEW_BY_NAME":32,"lookupOperator":33,"LOOK_UP":34,"LOOK_DOWN":35,"viewLocator":36,"DEEPNESS_OPERATOR":37,"GLOBAL_MODIFIER_CALL":38,"WIDGET_MODIFIER_CALL":39,"ACTIVE_MODIFIER_CALL":40,"IDENTIFIER":41,"scopePath":42,"SEARCH_OPERATOR":43,"scopePathSegment":44,"DOT_PROPERTY":45,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",6:"SEMICOLON",8:"COMMA",12:"DEPENDS_START",13:"OPEN_CURLY",14:"CLOSE_CURLY",17:"OPERATOR",18:"OPEN_BRACE",19:"CLOSE_BRACE",21:"NUMBER",22:"RAW_STRING",23:"LITERAL",26:"OPEN_SQUARE",28:"CLOSE_SQUARE",30:"VIEW_BY_LABEL",31:"VIEW_BY_ID",32:"VIEW_BY_NAME",34:"LOOK_UP",35:"LOOK_DOWN",37:"DEEPNESS_OPERATOR",38:"GLOBAL_MODIFIER_CALL",39:"WIDGET_MODIFIER_CALL",40:"ACTIVE_MODIFIER_CALL",41:"IDENTIFIER",43:"SEARCH_OPERATOR",45:"DOT_PROPERTY"},
productions_: [0,[3,1],[3,2],[5,3],[5,3],[5,1],[9,3],[9,1],[7,5],[7,1],[11,1],[11,1],[11,2],[15,3],[15,2],[16,3],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[20,3],[20,2],[27,3],[27,1],[29,1],[29,1],[29,1],[33,1],[33,1],[36,1],[36,2],[36,2],[36,3],[25,3],[25,4],[25,4],[25,5],[25,4],[25,5],[24,4],[10,1],[10,2],[10,3],[10,2],[10,2],[42,2],[42,1],[44,1],[44,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: 
break;
case 2: 
break;
case 3:
			yy.assertSemicolonAllowed();
			yy.finishArgument($$[$0].trim());
		
break;
case 4:
			yy.assertCommaAllowed();
			yy.finishArgument($$[$0].trim());
		
break;
case 5: yy.finishArgument($$[$0].trim()); 
break;
case 6: yy.x_argument_binds.push($$[$0]); 
break;
case 7: yy.x_argument_binds.push($$[$0]); 
break;
case 8: this.$ = $$[$0-4]; 
break;
case 9: this.$ = $$[$0]; 
break;
case 10:
			yy.x_counters.expression_tails++;
			this.$ = $$[$0];
		
break;
case 11:
			yy.x_counters.operands++;
			this.$ = $$[$0];
		
break;
case 12:
			yy.x_counters.operands++;
			yy.x_counters.expression_tails++;
			this.$ = $$[$0-1] + ' ' + $$[$0];
		
break;
case 13:
			yy.x_counters.operands++;
			this.$ = $$[$0-2] + ' ' + $$[$0-1] + ' ' + $$[$0];
		
break;
case 14:
			yy.x_counters.operands++;
			this.$ = $$[$0-1] + ' ' + $$[$0];
		
break;
case 15:
			yy.x_counters.braces++;
			this.$ = '(' + $$[$0-1] + ')';
		
break;
case 16: this.$ = $$[$0]; 
break;
case 17:
			yy.x_counters.numbers++;
			this.$ = $$[$0];
		
break;
case 18:
			yy.x_counters.strings++;
			this.$ = $$[$0];
		
break;
case 19:
			yy.x_counters.literals++;
			this.$ = $$[$0];
		
break;
case 20:
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			this.$ = 'this._binds[' + index + '].getValue()';
		
break;
case 21:
			yy.x_counters.dynamic_scopes++;
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			this.$ = 'this._binds[' + index + '].getValue()';
		
break;
case 22: this.$ = $$[$0]; 
break;
case 23: this.$ = '[' + $$[$0-1] + ']'; 
break;
case 24: this.$ = '[]'; 
break;
case 25: this.$ = $$[$0-2] + ', ' + $$[$0]; 
break;
case 26: this.$ = $$[$0]; 
break;
case 27: this.$ = {locator_type: 'Label', locator: $$[$0]}; 
break;
case 28: this.$ = {locator_type: 'Id', locator: $$[$0]}; 
break;
case 29: this.$ = {locator_type: 'Name', locator: $$[$0]}; 
break;
case 30: this.$ = {label: $$[$0], direction: 'look_up'}; 
break;
case 31: this.$ = {label: $$[$0], direction: 'look_down'}; 
break;
case 32: this.$ = $$[$0]; 
break;
case 33: Lava.t("Lookup operator is not supported yet."); 
break;
case 34:
			$$[$0-1].depth = parseInt($$[$0]);
			if (!$$[$0-1].depth) Lava.t('Deepness operator: depth must be > 0');
			this.$ = $$[$0-1];
		
break;
case 35: Lava.t("Lookup operator is not supported yet."); 
break;
case 36:
			yy.x_counters.global_modifiers++;
			this.$ = 'this._callGlobalModifier("' + $$[$0-2] + '", [])';
		
break;
case 37:
			yy.x_counters.global_modifiers++;
			this.$ = 'this._callGlobalModifier("' + $$[$0-3] + '", [' + $$[$0-1] + '])';
		
break;
case 38:
			yy.x_counters.widget_modifiers++;
			$$[$0-3].callback_name = $$[$0-2];
			var index = yy.x_argument_widget_modifiers.push($$[$0-3]) - 1;
			this.$ = 'this._callModifier("' + index + '", [])';
		
break;
case 39:
			yy.x_counters.widget_modifiers++;
			$$[$0-4].callback_name = $$[$0-3];
			var index = yy.x_argument_widget_modifiers.push($$[$0-4]) - 1;
			this.$ = 'this._callModifier("' + index + '", [' + $$[$0-1] + '])';
		
break;
case 40:
			yy.x_counters.active_modifiers++;
			$$[$0-3].callback_name = $$[$0-2];
			var index = yy.x_argument_active_modifiers.push($$[$0-3]) - 1;
			this.$ = 'this._callActiveModifier("' + index + '", [])';
		
break;
case 41:
			yy.x_counters.active_modifiers++;
			$$[$0-4].callback_name = $$[$0-3];
			var index = yy.x_argument_active_modifiers.push($$[$0-4]) - 1;
			this.$ = 'this._callActiveModifier("' + index + '", [' + $$[$0-1] + '])';
		
break;
case 42:
			$$[$0-3].isDynamic = true;
			$$[$0-3].property_name = $$[$0-1];
			this.$ = $$[$0-3];
		
break;
case 43: this.$ = {property_name: $$[$0]}; 
break;
case 44: this.$ = {property_name: $$[$0-1], tail: $$[$0]}; 
break;
case 45:
			$$[$0-2].property_name = $$[$0-1];
			$$[$0-2].tail = $$[$0];
			this.$ = $$[$0-2];
		
break;
case 46:
			$$[$0-1].property_name = $$[$0];
			this.$ = $$[$0-1];
		
break;
case 47: $$[$0-1].tail = $$[$0]; this.$ = $$[$0-1]; 
break;
case 48: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 49: this.$ = [$$[$0]]; 
break;
case 50: this.$ = $$[$0]; 
break;
case 51:
			var segments = $$[$0-1].path_segments;
			if (segments) {
				for (var i = 0, count = segments.length; i < count; i++) {
					if (typeof(segments[i]) == 'object') Lava.t('Dynamic segment must not contain other dynamic segments');
				}
			}
			this.$ = $$[$0-1];
		
break;
}
},
table: [{3:1,4:[1,2],5:3,7:4,10:14,11:5,15:6,16:7,17:[1,8],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{1:[3]},{1:[2,1]},{4:[1,25],6:[1,26],8:[1,27]},{4:[2,5],6:[2,5],8:[2,5]},{4:[2,9],6:[2,9],8:[2,9],12:[1,28]},{4:[2,10],6:[2,10],8:[2,10],12:[2,10],17:[1,29],19:[2,10],28:[2,10]},{4:[2,11],6:[2,11],8:[2,11],12:[2,11],15:30,17:[1,8],19:[2,11],28:[2,11]},{10:14,16:31,18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{10:14,11:32,15:6,16:7,17:[1,8],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{4:[2,16],6:[2,16],8:[2,16],12:[2,16],17:[2,16],19:[2,16],28:[2,16]},{4:[2,17],6:[2,17],8:[2,17],12:[2,17],17:[2,17],19:[2,17],28:[2,17]},{4:[2,18],6:[2,18],8:[2,18],12:[2,18],17:[2,18],19:[2,18],28:[2,18]},{4:[2,19],6:[2,19],8:[2,19],12:[2,19],17:[2,19],19:[2,19],28:[2,19]},{4:[2,20],6:[2,20],8:[2,20],12:[2,20],17:[2,20],19:[2,20],28:[2,20]},{4:[2,21],6:[2,21],8:[2,21],12:[2,21],17:[2,21],19:[2,21],28:[2,21]},{4:[2,22],6:[2,22],8:[2,22],12:[2,22],17:[2,22],19:[2,22],28:[2,22]},{10:14,11:35,15:6,16:7,17:[1,8],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:33,28:[1,34],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{4:[2,43],6:[2,43],8:[2,43],12:[2,43],14:[2,43],17:[2,43],19:[2,43],26:[1,39],28:[2,43],42:36,44:37,45:[1,38]},{26:[1,39],42:41,43:[1,40],44:37,45:[1,38]},{13:[1,42],26:[2,32],33:45,34:[1,47],35:[1,48],37:[1,46],39:[1,43],40:[1,44],43:[2,32],45:[2,32]},{18:[1,49]},{13:[2,27],26:[2,27],34:[2,27],35:[2,27],37:[2,27],39:[2,27],40:[2,27],43:[2,27],45:[2,27]},{13:[2,28],26:[2,28],34:[2,28],35:[2,28],37:[2,28],39:[2,28],40:[2,28],43:[2,28],45:[2,28]},{13:[2,29],26:[2,29],34:[2,29],35:[2,29],37:[2,29],39:[2,29],40:[2,29],43:[2,29],45:[2,29]},{1:[2,2]},{7:50,10:14,11:5,15:6,16:7,17:[1,8],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{7:51,10:14,11:5,15:6,16:7,17:[1,8],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{13:[1,52]},{10:14,16:53,18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{4:[2,12],6:[2,12],8:[2,12],12:[2,12],17:[1,29],19:[2,12],28:[2,12]},{4:[2,14],6:[2,14],8:[2,14],12:[2,14],17:[2,14],19:[2,14],28:[2,14]},{19:[1,54]},{8:[1,56],28:[1,55]},{4:[2,24],6:[2,24],8:[2,24],12:[2,24],17:[2,24],19:[2,24],28:[2,24]},{8:[2,26],19:[2,26],28:[2,26]},{4:[2,44],6:[2,44],8:[2,44],12:[2,44],14:[2,44],17:[2,44],19:[2,44],26:[1,39],28:[2,44],44:57,45:[1,38]},{4:[2,49],6:[2,49],8:[2,49],12:[2,49],14:[2,49],17:[2,49],19:[2,49],26:[2,49],28:[2,49],45:[2,49]},{4:[2,50],6:[2,50],8:[2,50],12:[2,50],14:[2,50],17:[2,50],19:[2,50],26:[2,50],28:[2,50],45:[2,50]},{10:58,29:59,30:[1,22],31:[1,23],32:[1,24],36:19,41:[1,18]},{4:[2,46],6:[2,46],8:[2,46],12:[2,46],14:[2,46],17:[2,46],19:[2,46],26:[1,39],28:[2,46],42:60,44:37,45:[1,38]},{4:[2,47],6:[2,47],8:[2,47],12:[2,47],14:[2,47],17:[2,47],19:[2,47],26:[1,39],28:[2,47],44:57,45:[1,38]},{41:[1,61]},{18:[1,62]},{18:[1,63]},{26:[2,33],43:[2,33],45:[2,33]},{26:[2,34],33:64,34:[1,47],35:[1,48],43:[2,34],45:[2,34]},{26:[2,30],43:[2,30],45:[2,30]},{26:[2,31],43:[2,31],45:[2,31]},{10:14,11:35,15:6,16:7,17:[1,8],18:[1,9],19:[1,65],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:66,29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{4:[2,3],6:[2,3],8:[2,3]},{4:[2,4],6:[2,4],8:[2,4]},{9:67,10:68,29:59,30:[1,22],31:[1,23],32:[1,24],36:19,41:[1,18]},{4:[2,13],6:[2,13],8:[2,13],12:[2,13],17:[2,13],19:[2,13],28:[2,13]},{4:[2,15],6:[2,15],8:[2,15],12:[2,15],17:[2,15],19:[2,15],28:[2,15]},{4:[2,23],6:[2,23],8:[2,23],12:[2,23],17:[2,23],19:[2,23],28:[2,23]},{10:14,11:69,15:6,16:7,17:[1,8],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{4:[2,48],6:[2,48],8:[2,48],12:[2,48],14:[2,48],17:[2,48],19:[2,48],26:[2,48],28:[2,48],45:[2,48]},{28:[1,70]},{26:[2,32],33:45,34:[1,47],35:[1,48],37:[1,46],43:[2,32],45:[2,32]},{4:[2,45],6:[2,45],8:[2,45],12:[2,45],14:[2,45],17:[2,45],19:[2,45],26:[1,39],28:[2,45],44:57,45:[1,38]},{14:[1,71]},{10:14,11:35,15:6,16:7,17:[1,8],18:[1,9],19:[1,72],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:73,29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{10:14,11:35,15:6,16:7,17:[1,8],18:[1,9],19:[1,74],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:75,29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],41:[1,18]},{26:[2,35],43:[2,35],45:[2,35]},{4:[2,36],6:[2,36],8:[2,36],12:[2,36],17:[2,36],19:[2,36],28:[2,36]},{8:[1,56],19:[1,76]},{8:[1,78],14:[1,77]},{8:[2,7],14:[2,7]},{8:[2,25],19:[2,25],28:[2,25]},{4:[2,51],6:[2,51],8:[2,51],12:[2,51],14:[2,51],17:[2,51],19:[2,51],26:[2,51],28:[2,51],45:[2,51]},{4:[2,42],6:[2,42],8:[2,42],12:[2,42],17:[2,42],19:[2,42],28:[2,42]},{4:[2,38],6:[2,38],8:[2,38],12:[2,38],17:[2,38],19:[2,38],28:[2,38]},{8:[1,56],19:[1,79]},{4:[2,40],6:[2,40],8:[2,40],12:[2,40],17:[2,40],19:[2,40],28:[2,40]},{8:[1,56],19:[1,80]},{4:[2,37],6:[2,37],8:[2,37],12:[2,37],17:[2,37],19:[2,37],28:[2,37]},{4:[2,8],6:[2,8],8:[2,8]},{10:81,29:59,30:[1,22],31:[1,23],32:[1,24],36:19,41:[1,18]},{4:[2,39],6:[2,39],8:[2,39],12:[2,39],17:[2,39],19:[2,39],28:[2,39]},{4:[2,41],6:[2,41],8:[2,41],12:[2,41],17:[2,41],19:[2,41],28:[2,41]},{8:[2,6],14:[2,6]}],
defaultActions: {2:[2,1],25:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: Lava.t('Spaces between function name and opening brace are not allowed (1)'); 
break;
case 1: Lava.t('Spaces between function name and opening brace are not allowed (1)'); 
break;
case 2: Lava.t('Spaces between function name and opening brace are not allowed (2)'); 
break;
case 3: Lava.t('Spaces in scope path are not allowed (1)'); 
break;
case 4: Lava.t('Spaces in scope path are not allowed (2)'); 
break;
case 5: yy_.yytext = yy_.yytext.slice(1); return 30; 
break;
case 6: yy_.yytext = yy_.yytext.slice(1); return 31; 
break;
case 7: yy_.yytext = yy_.yytext.slice(1); return 32; 
break;
case 8: yy_.yytext = yy_.yytext.slice(2); return 40; 
break;
case 9: yy_.yytext = yy_.yytext.slice(5); return 40; 
break;
case 10: yy_.yytext = yy_.yytext.slice(1); return 39; 
break;
case 11: return 38; 
break;
case 12: yy_.yytext = yy_.yytext.slice(1); return 37; 
break;
case 13: yy_.yytext = yy_.yytext.slice(1); return 45; 
break;
case 14: yy_.yytext = yy_.yytext.slice(2); return 43; 
break;
case 15: yy_.yytext = yy_.yytext.slice(5); return 43; 
break;
case 16: yy_.yytext = yy_.yytext.substr(4, yy_.yyleng - 5); return 34; 
break;
case 17: yy_.yytext = yy_.yytext.substr(4, yy_.yyleng - 5); return 35; 
break;
case 18: yy_.yytext = yy.unescape(yy_.yytext); return 17; /*escaped operator versions*/ 
break;
case 19: yy_.yytext = yy.unescape(yy_.yytext); return 17; /*escaped operator versions + "&", "&&" */ 
break;
case 20: return 12; 
break;
case 21: return 17; /*arithmetic*/ 
break;
case 22: return 17; /*logical, without "&&" and "!" */ 
break;
case 23: return 17; /*comparison*/ 
break;
case 24: return 17; /*bitwise, without "&" */ 
break;
case 25: return 17; /*ternary*/ 
break;
case 26: return 17; /*unary*/ 
break;
case 27: return 8; 
break;
case 28: return 6; 
break;
case 29: return 21; 
break;
case 30: return 21; 
break;
case 31: return 22; 
break;
case 32: return 22; 
break;
case 33: return 26; 
break;
case 34: return 28; 
break;
case 35: /* skip whitespace */ 
break;
case 36: return 13; 
break;
case 37: return 14; 
break;
case 38:
		this.x_lex_brace_levels++;
		return 18;
	
break;
case 39:
		if (this.x_tail_mode && this.x_lex_brace_levels == 0) {
			this.x_input_tail_length = this._input.length;
			this._input = '';
			this.done = true;
			return 4;
		} else {
			this.x_lex_brace_levels--;
			return 19;
		}
	
break;
case 40:
		var lowercase = yy_.yytext.toLowerCase();
		var map = {
			'lt': '<',
			'gt': '>',
			'and': '&&'
		};

		if (lowercase == 'this') Lava.t("'this' is reserved word. Are you missing the Label sign (@)?");
		if ((lowercase in map) && lowercase != yy_.yytext) Lava.t("Expression parser: 'lt', 'gt', 'and' must be lower case");

		if (lowercase in map) {
			yy_.yytext = map[lowercase];
			return 17;
		}

		if (Lava.parsers.Common.isLiteral(yy_.yytext)) {
			if (lowercase != yy_.yytext) Lava.t("Expression parser, code style: literals must be lower case");
			return 23;
		}

		return 41;
	
break;
case 41: return 4; 
break;
}
},
rules: [/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:\s+[\~\.])/,/^(?:\[\s\b)/,/^(?:@([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:#([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:\$([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:~\d+)/,/^(?:\.[a-zA-Z0-9\_]+)/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?::up\(([a-zA-Z\_][a-zA-Z0-9\_]*)\))/,/^(?::dn\(([a-zA-Z\_][a-zA-Z0-9\_]*)\))/,/^(?:(&lt;|&gt;))/,/^(?:(&amp;|&lt;|&gt;|&)+)/,/^(?:\/\/depends:)/,/^(?:[\+\-\*\/\%])/,/^(?:\|\||!!)/,/^(?:===|!==|==|!=|<=|>=|<|>)/,/^(?:>>>|>>|<<|[\|\^])/,/^(?:[\?\:])/,/^(?:!)/,/^(?:,)/,/^(?:;)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"(\\"|[^"])*")/,/^(?:'(\\'|[^'])*')/,/^(?:\[(?=[^\s]))/,/^(?:\])/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.ExpressionParser._parse = Lava.ExpressionParser.parse;

/**
 * Allowed separators between expressions
 * @enum {number}
 */
Lava.ExpressionParser.SEPARATORS = {
	COMMA: 1,
	SEMICOLON: 2
};

/**
 * Parse expressions, but do not create evaluator functions from their source code
 * @param {string} input Expression source
 * @param {Lava.ExpressionParser.SEPARATORS} [separator] Allowed separator, when parsing multiple expressions
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseRaw = function(input, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = false;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return this.yy.x_arguments;

};

/**
 * Parse expressions
 * @param {string} input Source code
 * @param {Lava.ExpressionParser.SEPARATORS} [separator] Allowed separator, when parsing multiple expressions
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parse = function(input, separator) {
	return this.yy.convertArguments(this.parseRaw(input, separator));
};

/**
 * Same as {@link Lava.ExpressionParser#parseWithTail}, but does not create evaluator functions from source
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseWithTailRaw = function(config_ref, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = true;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(config_ref.input);

	} finally {

		this.yy.is_parsing = false;

	}

	config_ref.tail_length = this.lexer.x_input_tail_length;
	return this.yy.x_arguments;

};

/**
 * Parse expressions, which are followed by a closing brace (and anything after it).
 * Stores the length of unparsed content in `config_ref.tail_length`
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parseWithTail = function(config_ref, separator) {
	return this.yy.convertArguments(this.parseWithTailRaw(config_ref, separator));
};

/**
 * Parse expression which represents a single path,
 * like <str>"$my_widget.something.otherthing"</str> or <str>"$my_widget.something[name]"</str>
 *
 * @param {string} input Expression source
 * @returns {_cScopeLocator}
 */
Lava.ExpressionParser.parseScopeEval = function(input) {

	var raw_arguments = this.parseRaw(input);
	if (Lava.schema.DEBUG && (raw_arguments.length != 1 || !raw_arguments[0].flags || !raw_arguments[0].flags.isScopeEval)) Lava.t('parseScopeEval: malformed scope path');
	return raw_arguments[0].binds[0];

};

Lava.ExpressionParser.yy = {

	is_parsing: false,
	x_arguments: null,
	x_argument_binds: null,
	x_argument_widget_modifiers: null,
	x_argument_active_modifiers: null,
	x_allowed_separator: null,

	x_counters: {
		modifiers: 0,
		active_modifiers: 0,
		operands: 0,
		expression_tails: 0,
		braces: 0,
		literals: 0,
		numbers: 0,
		strings: 0,
		dynamic_scopes: 0
	},

	unescape: function(string) {
		return Firestorm.String.unescape(string);
	},

	reset: function() {
		// must reset everything, cause in case of parsing exception the parser will be left broken
		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.x_arguments = [];
	},

	resetCounters: function() {
		this.x_counters.global_modifiers = 0;
		this.x_counters.widget_modifiers = 0;
		this.x_counters.active_modifiers = 0;
		this.x_counters.operands = 0;
		this.x_counters.expression_tails = 0;
		this.x_counters.braces = 0;
		this.x_counters.literals = 0;
		this.x_counters.numbers = 0;
		this.x_counters.strings = 0;
		this.x_counters.dynamic_scopes = 0;
	},

	finishArgument: function(evaluator_src) {
		var result = {
				evaluator_src: evaluator_src
			},
			flags = {};
		if (this.x_argument_binds.length) result.binds = this.x_argument_binds;
		if (this.x_argument_widget_modifiers.length) result.modifiers = this.x_argument_widget_modifiers;
		if (this.x_argument_active_modifiers.length) result.active_modifiers = this.x_argument_active_modifiers;

		if (this.x_counters.global_modifiers > 0) flags.hasGlobalModifiers = true;
		if (this.x_argument_binds.length == 1
			&& this.x_counters.operands == 1
			&& this.x_counters.expression_tails == 0
			&& this.x_counters.braces == 0
			&& this.x_counters.dynamic_scopes == 0
		) {
			flags.isScopeEval = true;
		}
		if (this.x_argument_binds.length == 0 && this.x_counters.active_modifiers == 0) {
			flags.isStatic = true;
			if (this.x_counters.literals == 1 && this.x_counters.operands == 1) flags.isLiteral = true;
			if (this.x_counters.numbers == 1 && this.x_counters.operands == 1) flags.isNumber = true;
			if (this.x_counters.strings == 1 && this.x_counters.operands == 1) flags.isString = true;
		}

		if (!Firestorm.Object.isEmpty(flags)) result.flags = flags;
		this.x_arguments.push(result);

		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.resetCounters();
	},

	/**
	 * @param {Array.<_cRawArgument>} raw_arguments
	 * @returns {Array.<_cArgument>}
	 */
	convertArguments: function(raw_arguments) {

		var i = 0,
			count = raw_arguments.length,
			result = [];

		for (; i < count; i++) {
			result.push(this.convertArgument(raw_arguments[i]))
		}

		return result;

	},

	/**
	 * @param {_cRawArgument} raw_argument
	 * @returns {_cArgument}
	 */
	convertArgument: function(raw_argument) {

		var src = "return (" + raw_argument.evaluator_src + ");",
			result = {
				evaluator: new Function(src)
			};

		if ('flags' in raw_argument) result.flags = raw_argument.flags;
		if ('binds' in raw_argument) result.binds = raw_argument.binds;
		if ('modifiers' in raw_argument) result.modifiers = raw_argument.modifiers;
		if ('active_modifiers' in raw_argument) result.active_modifiers = raw_argument.active_modifiers;

		return result;

	},

	assertSemicolonAllowed: function() {

		if (this.x_allowed_separator == null) Lava.t("ExpressionParser: semicolon encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.SEMICOLON) Lava.t("ExpressionParser: comma is not allowed as separator here");

	},

	assertCommaAllowed: function() {

		if (this.x_allowed_separator == null) Lava.t("ExpressionParser: comma encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.COMMA) Lava.t("ExpressionParser: semicolon is not allowed as separator here");

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.TemplateParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"blocks":5,"block":6,"CONTENT":7,"INCLUDE":8,"EXPRESSION_BLOCK_N":9,"EXPRESSION_BLOCK_E":10,"blockStart":11,"BLOCK_END":12,"elsePart":13,"selfClosingTag":14,"tagStart":15,"TAG_END":16,"SCRIPT_CONTENT":17,"SWITCH_ON":18,"SWITCH_OFF":19,"OPEN_BLOCK":20,"blockInit":21,"BLOCK_CLOSE":22,"blockHash":23,"DYNAMIC_BLOCK_INIT":24,"EMPTY_ARGS":25,"EXPORT_ARGUMENTS":26,"BLOCK_INIT":27,"blockHashSegment":28,"IDENTIFIER":29,"HASH_ASSIGN":30,"STRING":31,"elseifChain":32,"BLOCK_ELSE":33,"blockElseif":34,"OPEN_ELSEIF":35,"TAG_OPEN":36,"TAG_END_CLOSE":37,"htmlHash":38,"TAG_CLOSE":39,"htmlHashSegment":40,"HASH_ATTRIBUTE":41,"UNESCAPED_HASH_ASSIGN":42,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"CONTENT",8:"INCLUDE",9:"EXPRESSION_BLOCK_N",10:"EXPRESSION_BLOCK_E",12:"BLOCK_END",16:"TAG_END",17:"SCRIPT_CONTENT",18:"SWITCH_ON",19:"SWITCH_OFF",20:"OPEN_BLOCK",22:"BLOCK_CLOSE",24:"DYNAMIC_BLOCK_INIT",25:"EMPTY_ARGS",26:"EXPORT_ARGUMENTS",27:"BLOCK_INIT",29:"IDENTIFIER",30:"HASH_ASSIGN",31:"STRING",33:"BLOCK_ELSE",35:"OPEN_ELSEIF",36:"TAG_OPEN",37:"TAG_END_CLOSE",39:"TAG_CLOSE",41:"HASH_ATTRIBUTE",42:"UNESCAPED_HASH_ASSIGN"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,3],[6,3],[6,4],[6,1],[6,2],[6,2],[6,3],[6,1],[6,1],[11,3],[11,4],[21,2],[21,2],[21,2],[21,2],[23,2],[23,1],[28,1],[28,2],[28,2],[13,3],[13,2],[13,1],[13,2],[13,1],[32,3],[32,2],[32,2],[32,1],[34,3],[14,2],[14,3],[15,2],[15,3],[38,2],[38,1],[40,1],[40,1],[40,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: return []; 
break;
case 2: return $$[$0-1]; 
break;
case 3:
			this.$ = $$[$0-1];
			if ($$[$0]) {
				// inline fragments
				if ($$[$0].name == 'script' && $$[$0].type == 'tag' && $$[$0].attributes && $$[$0].attributes.type == 'lava/fragment') {
					this.$ = $$[$0].content ? $$[$0-1].concat($$[$0].content) : $$[$0-1];
				} else if (typeof($$[$0]) == 'string' && this.$.length && typeof(this.$[this.$.length-1]) == 'string') {
					this.$[this.$.length-1] += $$[$0];
				} else {
					this.$.push($$[$0]);
				}
			}
		
break;
case 4:
			if ($$[$0]) {
				if ($$[$0].name == 'script' && $$[$0].type == 'tag' && $$[$0].attributes && $$[$0].attributes.type == 'lava/fragment') {
					this.$ = $$[$0].content || [];
				} else {
					this.$ = [$$[$0]];
				}
			} else {
				this.$ = [];
			}
		
break;
case 5:
			//this.$ = yy.preserve_whitespace ? $$[$0] : $$[$0].trim();
			this.$ = $$[$0];
		
break;
case 6:
			var targets = Lava.parsers.Common.parseTargets($$[$0]);
			if (targets.length != 1) Lava.t("Malformed include");
			targets[0].type = 'include';
			this.$ = targets[0];
		
break;
case 7:
			this.$ = {
				type: 'expression',
				prefix: $$[$0][1],
				arguments: Lava.ExpressionParser.parse(yytext.substr(3, yyleng - 4))
			};
		
break;
case 8:
			this.$ = {
				type: 'expression',
				prefix: $$[$0][1],
				arguments: Lava.ExpressionParser.parse(yytext.substr(6, yyleng - 7))
			};
		
break;
case 9:
			if ($$[$0-1].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-1].name + '") (1)');
			this.$ = $$[$0-1];
		
break;
case 10:
			if ($$[$0-2].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-2].name + '") (2)');
			$$[$0-2].content = $$[$0-1];
			this.$ = $$[$0-2];
		
break;
case 11:
			if ($$[$0-2].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-2].name + '") (3)');
			if ('elseif_arguments' in $$[$0-1]) {
				$$[$0-2].elseif_arguments = $$[$0-1].elseif_arguments;
				$$[$0-2].elseif_content = $$[$0-1].elseif_content;
			}
			if ('else_content' in $$[$0-1]) $$[$0-2].else_content = $$[$0-1].else_content;
			this.$ = $$[$0-2];
		
break;
case 12:
			if ($$[$0-3].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-3].name + '") (4)');
			$$[$0-3].content = $$[$0-2];
			if ('elseif_arguments' in $$[$0-1]) {
				$$[$0-3].elseif_arguments = $$[$0-1].elseif_arguments;
				$$[$0-3].elseif_content = $$[$0-1].elseif_content;
			}
			if ('else_content' in $$[$0-1]) $$[$0-3].else_content = $$[$0-1].else_content;
			this.$ = $$[$0-3];
		
break;
case 13:
			this.$ = $$[$0];
		
break;
case 14:
			yy.validateTagEnd($$[$0-1], $$[$0]);
			this.$ = $$[$0-1];
		
break;
case 15:
			this.$ = $$[$0-1];
			if ($$[$0-1].name == 'script' && $$[$0-1].x && ('equiv' in $$[$0-1].x)) {
				if (!$$[$0-1].x.equiv) Lava.t('empty x:equiv');
				this.$ = yy.parseRawTag($$[$0-1].x.equiv); // sets name and type (it may be directive)
				delete $$[$0-1].x.equiv;
				if (!Firestorm.Object.isEmpty($$[$0-1].x)) {
					this.$.x = Firestorm.Object.copy($$[$0-1].x);
				}
				if ('attributes' in $$[$0-1]) this.$.attributes = $$[$0-1].attributes;
			}
			this.$.content = [$$[$0]];
		
break;
case 16:
			yy.validateTagEnd($$[$0-2], $$[$0]);
			$$[$0-2].content = $$[$0-1];
			this.$ = $$[$0-2];
			if (Lava.isVoidTag(this.$.name)) Lava.t("Void tag with content: " + this.$.name);
		
break;
case 17:
			if ($$[$0] == 'preserve_whitespace') {
				if (yy.preserve_whitespace) Lava.t("Switch {pre:} is already active");
				yy.preserve_whitespace = true;
			} else {
				Lava.t("Parser error: lexer returned unknown switch: " + $$[$0]);
			}
			this.$ = null;
		
break;
case 18:
			if ($$[$0] == 'preserve_whitespace') {
				if (!yy.preserve_whitespace) Lava.t("Trying to turn off inactive switch: {:pre}");
				yy.preserve_whitespace = false;
			} else {
				Lava.t("Parser error: lexer returned unknown switch: " + $$[$0]);
			}
			this.$ = null;
		
break;
case 19:
			this.$ = $$[$0-1];
			this.$.prefix = $$[$0-2][1]; // '$' or '#'
		
break;
case 20:
			this.$ = $$[$0-2];
			this.$.prefix = $$[$0-3][1]; // '$' or '#'
			this.$.hash = $$[$0-1];
		
break;
case 21:
			this.$ = {type:'block'};
			yy.parseDynamicBlockInit(this.$, $$[$0-1].substr(1)); // substr to cut the colon before locator
		
break;
case 22:
			this.$ = {type:'block'};
			yy.parseDynamicBlockInit(this.$, $$[$0-1].substr(1)); // substr to cut the colon before locator
			this.$.arguments = yy.lexer.x_export_arguments;
			yy.lexer.x_export_arguments = null;
		
break;
case 23:
			this.$ = {
				type:'block',
				name: $$[$0-1]
			};
		
break;
case 24:
			this.$ = {
				type:'block',
				name: $$[$0-1]
			};
			this.$.arguments = yy.lexer.x_export_arguments;
			yy.lexer.x_export_arguments = null;
		
break;
case 25:
			if ($$[$0].name in $$[$0-1]) Lava.t('Duplicate attribute in block definition: ' + $$[$0].name);
			$$[$0-1][$$[$0].name] = $$[$0].value;
			this.$ = $$[$0-1];
		
break;
case 26: this.$ = {}; this.$[$$[$0].name] = $$[$0].value; 
break;
case 27: this.$ = {name:$$[$0], value:true}; 
break;
case 28:
			var literals = {
				'null': null,
				'undefined': undefined,
				'true': true,
				'false': false
			};
			if ($$[$0] in literals) {
				$$[$0] = literals[$$[$0]];
			}
			this.$ = {name:$$[$0-1], value:$$[$0]};
		
break;
case 29: this.$ = {name:$$[$0-1], value:$$[$0]}; 
break;
case 30:
			$$[$0-2].else_content = $$[$0];
			this.$ = $$[$0-2];
		
break;
case 31:
			$$[$0-1].else_content = [];
			this.$ = $$[$0-1];
		
break;
case 32:
			this.$ = $$[$0];
		
break;
case 33:
			this.$ = {else_content: $$[$0]};
		
break;
case 34:
			this.$ = {else_content: []};
		
break;
case 35:
			$$[$0-2].elseif_arguments.push($$[$0-1]);
			$$[$0-2].elseif_content.push($$[$0]);
			this.$ = $$[$0-2];
		
break;
case 36:
			$$[$0-1].elseif_arguments.push($$[$0]);
			$$[$0-1].elseif_content.push([]);
			this.$ = $$[$0-1];
		
break;
case 37:
			this.$ = {
				elseif_arguments: [$$[$0-1]],
				elseif_content: [$$[$0]]
			};
		
break;
case 38:
			this.$ = {
				elseif_arguments: [$$[$0]],
				elseif_content: [[]]
			};
		
break;
case 39:
			var arguments = yy.lexer.x_export_arguments;
			if (arguments.length != 1) Lava.t('Elseif block requires exactly one argument');
			this.$ = arguments[0];
			yy.lexer.x_export_arguments = null;
		
break;
case 40:
			if ($$[$0-1] != $$[$0-1].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-1]);
			this.$ = yy.parseRawTag($$[$0-1]);
		
break;
case 41:
			if ($$[$0-2] != $$[$0-2].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-2]);
			this.$ = yy.parseRawTag($$[$0-2], $$[$0-1]);
		
break;
case 42:
			if ($$[$0-1] != $$[$0-1].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-1]);
			this.$ = yy.parseRawTag($$[$0-1]);
		
break;
case 43:
			if ($$[$0-2] != $$[$0-2].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-2]);
			this.$ = yy.parseRawTag($$[$0-2], $$[$0-1]);
		
break;
case 44: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 45: this.$ = [$$[$0]]; 
break;
case 46: this.$ = {name:$$[$0], value: ''}; // behaviour of innerHTML 
break;
case 47:
			var parts = $$[$0].split('=');
			this.$ = {name:parts[0], value:parts[1]};
		
break;
case 48: this.$ = {name:$$[$0-1], value:$$[$0]}; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{1:[3]},{1:[2,1]},{4:[1,16],6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{4:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[2,4],12:[2,4],16:[2,4],18:[2,4],19:[2,4],20:[2,4],33:[2,4],35:[2,4],36:[2,4]},{4:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],12:[2,5],16:[2,5],18:[2,5],19:[2,5],20:[2,5],33:[2,5],35:[2,5],36:[2,5]},{4:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],12:[2,6],16:[2,6],18:[2,6],19:[2,6],20:[2,6],33:[2,6],35:[2,6],36:[2,6]},{4:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],12:[2,7],16:[2,7],18:[2,7],19:[2,7],20:[2,7],33:[2,7],35:[2,7],36:[2,7]},{4:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],12:[2,8],16:[2,8],18:[2,8],19:[2,8],20:[2,8],33:[2,8],35:[2,8],36:[2,8]},{5:19,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[1,18],13:20,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],32:21,33:[1,22],34:23,35:[1,24],36:[1,15]},{4:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],12:[2,13],16:[2,13],18:[2,13],19:[2,13],20:[2,13],33:[2,13],35:[2,13],36:[2,13]},{5:27,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,16:[1,25],17:[1,26],18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{4:[2,17],7:[2,17],8:[2,17],9:[2,17],10:[2,17],12:[2,17],16:[2,17],18:[2,17],19:[2,17],20:[2,17],33:[2,17],35:[2,17],36:[2,17]},{4:[2,18],7:[2,18],8:[2,18],9:[2,18],10:[2,18],12:[2,18],16:[2,18],18:[2,18],19:[2,18],20:[2,18],33:[2,18],35:[2,18],36:[2,18]},{21:28,24:[1,29],27:[1,30]},{30:[1,37],37:[1,31],38:32,39:[1,33],40:34,41:[1,35],42:[1,36]},{1:[2,2]},{4:[2,3],7:[2,3],8:[2,3],9:[2,3],10:[2,3],12:[2,3],16:[2,3],18:[2,3],19:[2,3],20:[2,3],33:[2,3],35:[2,3],36:[2,3]},{4:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],12:[2,9],16:[2,9],18:[2,9],19:[2,9],20:[2,9],33:[2,9],35:[2,9],36:[2,9]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[1,38],13:39,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],32:21,33:[1,22],34:23,35:[1,24],36:[1,15]},{12:[1,40]},{12:[2,32],33:[1,41],34:42,35:[1,24]},{5:43,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,34],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{5:44,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,38],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,38],35:[2,38],36:[1,15]},{26:[1,45]},{4:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],12:[2,14],16:[2,14],18:[2,14],19:[2,14],20:[2,14],33:[2,14],35:[2,14],36:[2,14]},{4:[2,15],7:[2,15],8:[2,15],9:[2,15],10:[2,15],12:[2,15],16:[2,15],18:[2,15],19:[2,15],20:[2,15],33:[2,15],35:[2,15],36:[2,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,16:[1,46],18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{22:[1,47],23:48,28:49,29:[1,50],30:[1,51]},{25:[1,52],26:[1,53]},{25:[1,54],26:[1,55]},{4:[2,40],7:[2,40],8:[2,40],9:[2,40],10:[2,40],12:[2,40],16:[2,40],18:[2,40],19:[2,40],20:[2,40],33:[2,40],35:[2,40],36:[2,40]},{30:[1,37],37:[1,56],39:[1,57],40:58,41:[1,35],42:[1,36]},{7:[2,42],8:[2,42],9:[2,42],10:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],20:[2,42],36:[2,42]},{30:[2,45],37:[2,45],39:[2,45],41:[2,45],42:[2,45]},{30:[2,46],37:[2,46],39:[2,46],41:[2,46],42:[2,46]},{30:[2,47],37:[2,47],39:[2,47],41:[2,47],42:[2,47]},{31:[1,59]},{4:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],12:[2,10],16:[2,10],18:[2,10],19:[2,10],20:[2,10],33:[2,10],35:[2,10],36:[2,10]},{12:[1,60]},{4:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],12:[2,11],16:[2,11],18:[2,11],19:[2,11],20:[2,11],33:[2,11],35:[2,11],36:[2,11]},{5:61,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,31],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{5:62,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,36],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,36],35:[2,36],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,33],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,37],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,37],35:[2,37],36:[1,15]},{22:[1,63]},{4:[2,16],7:[2,16],8:[2,16],9:[2,16],10:[2,16],12:[2,16],16:[2,16],18:[2,16],19:[2,16],20:[2,16],33:[2,16],35:[2,16],36:[2,16]},{7:[2,19],8:[2,19],9:[2,19],10:[2,19],12:[2,19],18:[2,19],19:[2,19],20:[2,19],33:[2,19],35:[2,19],36:[2,19]},{22:[1,64],28:65,29:[1,50],30:[1,51]},{22:[2,26],29:[2,26],30:[2,26]},{22:[2,27],29:[2,27],30:[2,27]},{29:[1,66],31:[1,67]},{22:[2,21],29:[2,21],30:[2,21]},{22:[2,22],29:[2,22],30:[2,22]},{22:[2,23],29:[2,23],30:[2,23]},{22:[2,24],29:[2,24],30:[2,24]},{4:[2,41],7:[2,41],8:[2,41],9:[2,41],10:[2,41],12:[2,41],16:[2,41],18:[2,41],19:[2,41],20:[2,41],33:[2,41],35:[2,41],36:[2,41]},{7:[2,43],8:[2,43],9:[2,43],10:[2,43],16:[2,43],17:[2,43],18:[2,43],19:[2,43],20:[2,43],36:[2,43]},{30:[2,44],37:[2,44],39:[2,44],41:[2,44],42:[2,44]},{30:[2,48],37:[2,48],39:[2,48],41:[2,48],42:[2,48]},{4:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],12:[2,12],16:[2,12],18:[2,12],19:[2,12],20:[2,12],33:[2,12],35:[2,12],36:[2,12]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,30],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,35],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,35],35:[2,35],36:[1,15]},{7:[2,39],8:[2,39],9:[2,39],10:[2,39],12:[2,39],18:[2,39],19:[2,39],20:[2,39],33:[2,39],35:[2,39],36:[2,39]},{7:[2,20],8:[2,20],9:[2,20],10:[2,20],12:[2,20],18:[2,20],19:[2,20],20:[2,20],33:[2,20],35:[2,20],36:[2,20]},{22:[2,25],29:[2,25],30:[2,25]},{22:[2,28],29:[2,28],30:[2,28]},{22:[2,29],29:[2,29],30:[2,29]}],
defaultActions: {2:[2,1],16:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
		if (this._input.length) {
			if (this._input[0] == '<') {
				if (this.x_pure_blocks_mode) {
					this.begin("skipTag");
				} else {
					this.begin("tag");
				}
			} else if (['#','$','/','>','*','&'].indexOf(this._input[1]) !== -1) {
				this.begin("block");
			} else if (this._input.substr(0, 6) == '{else}' || this._input.substr(0, 7) == '{elseif') { // } <- comment for Jison
				this.begin("block");
			} else {
				this.begin("switch");
			}
		}
		if(yy_.yytext) return 7;
	
break;
case 1: return 7; 
break;
case 2: this.popState(); return 7; 
break;
case 3: this.popState(); yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 3); return 8; 
break;
case 4: this.popState(); yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 6); return 8; // escaped variant 
break;
case 5: this.popState(); return 33; 
break;
case 6: this.popState(); yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 3); return 12; 
break;
case 7: this.popState(); /* yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 4); return 'COMMENT'; */ 
break;
case 8: this.popState(); return 9; // normal 
break;
case 9: this.popState(); return 10; // escaped 
break;
case 10: Lava.t('Spaces between block opening tag and block name are not allowed'); 
break;
case 11: Lava.t('Spaces between block name and opening brace are not allowed'); 
break;
case 12: return 20; 
break;
case 13: return 35; 
break;
case 14: return 24; 
break;
case 15: return 27; 
break;
case 16:
		this.popState(); // block
		this.begin('blockHash');
		return 25;
	
break;
case 17:
		var config_ref = {
			input: this._input,
			tail_length: 0
		};
		this.x_export_arguments = Lava.ExpressionParser.parseWithTail(config_ref);
		this._input = this._input.substr(this._input.length - config_ref.tail_length);
		// { <- comment for Jison
		if (!(/(\s|\})/.test(this._input[0]))) Lava.t('Lex: arguments closing brace must be followed by whitespace or CLOSE_CURLY');
		this.popState(); // block
		this.begin('blockHash');
		return 26;
	
break;
case 18: yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1); return 30; 
break;
case 19: return 29; 
break;
case 20: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 21: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 22: this.popState(); return 22; 
break;
case 23: 
break;
case 24: this.popState(); return 7; 
break;
case 25: this.popState(); return 7; 
break;
case 26: this.popState(); yy_.yytext = yy_.yytext.substr(2,yy_.yyleng-3).toLowerCase(); return 16; 
break;
case 27:
		yy_.yytext = yy_.yytext.substr(1).trim().toLowerCase();
		this.yy.x_lexer_tag_name = yy_.yytext;
		this.yy.x_lexer_is_fragment = false;
		if (yy_.yytext == 'script') {
			var index = this._input.indexOf('>');
			if (index == -1) Lava.t("Lexical error: malformed script tag");
			var attributes_string = this._input.substr(0, index);
			if (/type=(\'|\")lava\/fragment(\'|\")/.test(attributes_string)) {
				this.yy.x_lexer_is_fragment = true;
			}
		}
		return 36;
	
break;
case 28:
		var tag_name = this.yy.x_lexer_tag_name;
		this.yy.x_lexer_tag_name = null;
		this.popState();
		if (!this.yy.x_lexer_is_fragment && (tag_name == 'script' || tag_name == 'style')) {
			this.begin(tag_name == 'script' ? 'eatScript' : 'eatStyle');
		} else if (Lava.isVoidTag(tag_name)) {
			return 37; // in html5 browser returns void tags as unclosed
		}
		return 39;
	
break;
case 29:
		this.yy.x_lexer_tag_name = null;
		this.popState();
		return 37;
	
break;
case 30: yy_.yytext = yy_.yytext.trim(); return 41; 
break;
case 31: return 41; 
break;
case 32: yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1); return 30; 
break;
case 33: yy_.yytext = yy_.yytext.trim(); return 42; 
break;
case 34: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 35: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 36: 
break;
case 37: this.popState(); yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-9); return 17; 
break;
case 38: this.popState(); yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-8); return 17; 
break;
case 39:
		var _map = {
			L: '{', // comment for Jison is not needed (closing brace is below)
			R: '}',
			LT: '<',
			GT: '>',
			AMP: '&'
		};
		this.popState();
		yy_.yytext = _map[yy_.yytext.substr(2,yy_.yyleng-4)];
		return 7;
	
break;
case 40:
		this.popState();
		if (yy_.yytext == '{literal:}') {
			this.begin('literal');
		} else if (yy_.yytext == '{pure_blocks:}') {
			if (this.x_pure_blocks_mode) Lava.t('Lexer switch: "{pure_blocks:}" mode is already enabled');
			this.x_pure_blocks_mode = true;
		} else if (yy_.yytext == '{pre:}') {
			yy_.yytext = 'preserve_whitespace';
			return 18;
		} else {
			Lava.t('Unknown switch: ' + yy_.yytext);
		}
	
break;
case 41:
		this.popState();
		if (yy_.yytext == '{:pure_blocks}') {
			if (!this.x_pure_blocks_mode) Lava.t('Redundant lexer switch "{:pure_blocks}"');
			this.x_pure_blocks_mode = false;
		} else if (yy_.yytext == '{:pre}') {
			yy_.yytext = 'preserve_whitespace';
			return 19;
		} else {
			Lava.t('Unknown switch: ' + yy_.yytext);
		}
	
break;
case 42: this.popState(); yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-10); return 7; 
break;
case 43: return 4; 
break;
}
},
rules: [/^(?:[^\x00]*?(?=((\{[\#\$\>\*])|{&gt;|(\{\/)|(<([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s*)|(<\/([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)>)|(<!--(.|\s)*?-->)|(<!\[CDATA\[(.|\s)*?\]\]>)|\{literal:\}|\{:literal\}|(\{:[LR]:\}|\{:[LG])|\{elseif\s*\(|\{else\})))/,/^(?:[^\x00]+)/,/^(?:<)/,/^(?:\{>[^\}]*\})/,/^(?:\{&gt;[^\}]*\})/,/^(?:\{else\})/,/^(?:\{\/(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)\})/,/^(?:\{\*([^\*]|\*[^\}])*\*\})/,/^(?:\{(#|\$)>[^\}]+\})/,/^(?:\{(#|\$)&gt;[^\}]+\})/,/^(?:((\{[\#\$\>\*])|{&gt;)\s\b)/,/^(?:((\{[\#\$\>\*])|{&gt;)(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)\s\()/,/^(?:((\{[\#\$\>\*])|{&gt;))/,/^(?:\{elseif(?=\())/,/^(?::[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\/(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)(?=\())/,/^(?:(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)(?=\())/,/^(?:\(\s*\))/,/^(?:\()/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)=)/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=[\s\}]))/,/^(?:"([^\\\"]|\\.)*"(?=[\s\}]))/,/^(?:'([^\\\']|\\.)*'(?=[\s\}]))/,/^(?:\s*\})/,/^(?:\s+)/,/^(?:(<!--(.|\s)*?-->))/,/^(?:(<!\[CDATA\[(.|\s)*?\]\]>))/,/^(?:(<\/([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)>))/,/^(?:(<([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s*))/,/^(?:>)/,/^(?:\/>)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s+)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)(?=>))/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)=)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)=([a-zA-Z\_][a-zA-Z0-9\_]*)+\s\b)/,/^(?:"([^\\\"]|\\.)*")/,/^(?:'([^\\\']|\\.)*')/,/^(?:\s+)/,/^(?:[\s\S]*?<\/script>)/,/^(?:[\s\S]*?<\/style>)/,/^(?:(\{:[LR]:\}|\{:[LG]))/,/^(?:\{literal:\})/,/^(?:\{:literal\})/,/^(?:[^\x00]*?\{:literal\})/,/^(?:$)/],
conditions: {"block":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":false},"blockHash":{"rules":[18,19,20,21,22,23],"inclusive":false},"tag":{"rules":[24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":false},"skipTag":{"rules":[2],"inclusive":false},"switch":{"rules":[39,40,41],"inclusive":false},"literal":{"rules":[42],"inclusive":false},"eatScript":{"rules":[37],"inclusive":false},"eatStyle":{"rules":[38],"inclusive":false},"INITIAL":{"rules":[0,1,43],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.TemplateParser._parse = Lava.TemplateParser.parse;

/**
 * Parse and compile a template
 * @param {string} input
 * @param {_cView=} view_config View config for applying directives
 * @returns {_tTemplate}
 */
Lava.TemplateParser.parse = function(input, view_config) {

	return Lava.parsers.Common.compileTemplate(this.parseRaw(input), view_config);

};

/**
 * Parse template, but do not compile
 * @param {string} input
 * @returns {_tRawTemplate}
 */
Lava.TemplateParser.parseRaw = function(input) {

	if (this.yy.is_parsing) Lava.t("Calling TemplateParser.parseRaw() recursively will break the parser. Please, create another instance.");

	var result;

	this.lexer.x_pure_blocks_mode = false;
	this.lexer.x_export_arguments = null;
	this.yy.preserve_whitespace = false;

	try {

		this.yy.is_parsing = true;
		result = this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return result;

};

Lava.TemplateParser.yy = {

	is_parsing: false,
	/** @const */
	CONTROL_ATTRIBUTE_PREFIX: 'x:',
	preserve_whitespace: false,

	x_lexer_tag_name: null,
	x_lexer_is_fragment: false,

	/**
	 * Filters out attributes starting with 'x:' prefix, and puts them into separate property named 'x'.
	 * Control attributes are split by colon, resulting array is then used as path inside the 'x' object
	 * (similar to class paths)
	 *
	 * @param {{
		 *      attributes: Object.<string, string>,
		 *      x: _cRawX
		 * }} tag_config
	 * @param {Array.<_cRawAttribute>} raw_attributes
	 */
	_parseControlAttributes: function(tag_config, raw_attributes) {

		var i = 0,
			count = raw_attributes.length,
			attribute,
			normalized_path,
			current_object,
			segment_name,
			segments_count,
			name,
			x = {},
			attributes = {};

		for (; i < count; i++) {

			attribute = raw_attributes[i];
			if (attribute.name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

				current_object = x;
				normalized_path = attribute.name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length).split(':');
				segments_count = normalized_path.length;

				while (segments_count) {

					segments_count--;
					segment_name = normalized_path.shift();

					if (Lava.schema.DEBUG && segment_name == '') Lava.t("Malformed control attribute: " + attribute.name);

					if (segments_count) {

						if (!(segment_name in current_object)) current_object[segment_name] = {};
						current_object = current_object[segment_name];
						if (typeof(current_object) != 'object') Lava.t("Conflicting control attribute: " + attribute.name);

					} else {

						if (segment_name in current_object) Lava.t('Conflicting control attribute: ' + attribute.name);
						current_object[segment_name] = attribute.value;

					}

				}

			} else {

				// reason for second check: IE bug - it can duplicate attributes when serializing a tag
				if (Lava.schema.DEBUG && (attribute.name in attributes) && attributes[attribute.name] != attribute.value) Lava.t('Duplicate attribute on tag: ' + attribute.name);
				attributes[attribute.name] = attribute.value;

			}

		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in x) {
			tag_config.x = x;
			break;
		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in attributes) {
			tag_config.attributes = attributes;
			break;
		}

	},

	/**
	 * @param {string} tag_name
	 * @param {Array.<_cRawAttribute>=} raw_attributes
	 * @returns {(_cRawTag|_cRawDirective)}
	 */
	parseRawTag: function(tag_name, raw_attributes) {

		var result = {};

		if (raw_attributes) {
			this._parseControlAttributes(result, raw_attributes);
		}

		if (tag_name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

			result.type = 'directive';
			result.name = tag_name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length);

		} else {

			result.type = 'tag';
			result.name = tag_name;

		}

		return /** @type {(_cRawTag|_cRawDirective)} */ result;

	},

	validateTagEnd: function(start_object, end_name) {

		var start_name = (start_object.type == 'directive')
			? this.CONTROL_ATTRIBUTE_PREFIX + start_object.name
			: start_object.name;

		if (start_name != end_name) Lava.t('End tag ("' + end_name + '") does not match the start tag ("' + start_name + '")');

	},

	parseDynamicBlockInit: function(config, string) {

		var i = string.indexOf('/'),
			name = string.substr(0, i);

		if (Lava.schema.DEBUG && i == -1) Lava.t();
		if (Lava.schema.DEBUG && !(name[0] in Lava.parsers.Common.locator_types)) Lava.t("Malformed class name locator: " + string);

		config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
		config.real_class = string.substr(i);
		config.name = config.real_class.substr(1); // cut the slash to match the end block

		if (Lava.schema.DEBUG && (!config.class_locator.name || !config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + string);

	}

};
