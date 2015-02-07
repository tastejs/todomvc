
Lava.define(
'Lava.widget.input.InputAbstract',
/**
 * Base class for support of html &lt;input&gt; fields
 * @lends Lava.widget.input.InputAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	_property_descriptors: {
		name: {type: 'String', is_nullable: true},
		value: {type: 'String', is_nullable: true},
		is_disabled: {type: 'Boolean'},
		is_required: {type: 'Boolean'},
		is_readonly: {type: 'Boolean'},
		is_valid: {type: 'Boolean', is_readonly: true}
	},

	_properties: {
		/** Input's "name" attribute */
		name: null,
		/** Input's "value" attribute */
		value: null,
		/** "disabled" attribute of the input */
		is_disabled: false,
		/** "required" attribute of the input */
		is_required: false,
		/** "readonly" attribute of the input */
		is_readonly: false,
		/** Is current input of HTML element valid for this kind of field */
		is_valid: true
	},

	_event_handlers: {
		_focused: '_onInputFocused',
		_blurred: '_onInputBlurred'
	},

	_role_handlers: {
		_input_view: '_handleInputView',
		label: '_handleLabel'
	},

	/**
	 * The input's "type" attribute
	 * @type {string}
	 */
	_type: null,
	/**
	 * DOM input element
	 * @type {Lava.view.container.Element}
	 */
	_input_container: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, [{name: 'form_field'}]);

	},

	/**
	 * Save container of the DOM input element and set it's type
	 * @param {Lava.view.Abstract} view
	 */
	_handleInputView: function(view) {

		this._input_container = view.getContainer();

		// type may be null in textarea
		if (!this._input_container.getProperty('type') && this._type) {
			this._input_container.storeProperty('type', this._type);
		}

		Lava.view_manager.cancelBubble();

	},

	/**
	 * Get `_input_container`
	 * @returns {Lava.view.container.Element}
	 */
	getMainContainer: function() {

		return this._input_container;

	},

	/**
	 * Fire global "focus_acquired" event
	 */
	_onInputFocused: function(dom_event_name, dom_event, view) {

		Lava.app.fireGlobalEvent('focus_acquired', {
			target: this,
			element: view.getContainer().getDOMElement()
		});

	},

	/**
	 * Fire global "focus_lost" event
	 */
	_onInputBlurred: function() {

		Lava.app.fireGlobalEvent('focus_lost');

	},

	/**
	 * Focus the input's element, if it's currently in DOM
	 */
	focus: function(){

		if (this._input_container && this._input_container.isInDOM()) {
			this._input_container.getDOMElement().focus();
		}

	},

	/**
	 * Encode as part of GET request
	 * @returns {string}
	 */
	toQueryString: function() {

		return (this._properties.name && !this._properties.is_disabled && this._properties.value != null)
			? encodeURIComponent(this._properties.name) + '=' + encodeURIComponent(this._properties.value)
			: '';

	},

	/**
	 * Protected setter for readonly <wp>is_valid</wp> property
	 * @param {boolean} value New value for <wp>is_valid</wp> property
	 */
	_setValidity: function(value) {

		if (this._properties.is_valid != value) {
			this._set('is_valid', value);
		}

	},

	/**
	 * Assign "for" attribute to label
	 * @param view
	 */
	_handleLabel: function(view) {

		view.getContainer().setProperty('for', Lava.ELEMENT_ID_PREFIX + this.guid);

	},

	destroy: function() {
		this._input_container = null;
		this.Standard$destroy();
	}

});

Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * Base class for text inputs
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_properties: {
		/** Current text inside the input element */
		value: ''
	},

	_event_handlers: {
		value_changed: '_refreshValue',
		input: '_onTextInput'
	},

	/**
	 * Set input's value
	 * @param {string} value
	 */
	_setValue: function(value) {

		this._set('value', value);
		if (this._input_container) {
			this._input_container.setProperty('value', this._valueToElementProperty(value));
		}

	},

	/**
	 * Convert value before setting it to Element
	 * @param {*} value
	 * @returns {string}
	 */
	_valueToElementProperty: function(value) {

		return value;

	},

	/**
	 * Get value from DOM input element and set local {@link Lava.widget.input.InputAbstract#property:value} property
	 */
	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},

	/**
	 * DOM element's value changed: refresh local {@link Lava.widget.input.InputAbstract#property:value} property
	 */
	_onTextInput: function() {

		this._refreshValue();

	}

});

Lava.define(
'Lava.widget.input.TextArea',
/**
 * Multiline text input field
 * @lends Lava.widget.input.TextArea#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'textarea',

	_renderContent: function() {

		return Firestorm.String.escape(this._properties.value, Firestorm.String.TEXTAREA_ESCAPE_REGEX);

	}

});

Lava.define(
'Lava.widget.input.Text',
/**
 * Text input field
 * @lends Lava.widget.input.Text#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'text_input',
	_type: "text",

	_handleInputView: function(view, template_arguments) {

		this.TextAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('value', this._properties.value);

	}

});

Lava.define(
'Lava.widget.input.Password',
/**
 * Password input field
 * @lends Lava.widget.input.Password#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',
	_type: "password"

});

/**
 * Radio or checkbox has changed it's "checked" or "indeterminate" state
 * @event Lava.widget.input.RadioAbstract#checked_changed
 */

Lava.define(
'Lava.widget.input.RadioAbstract',
/**
 * Base class for Radio and CheckBox classes
 * @lends Lava.widget.input.RadioAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	_property_descriptors: {
		is_checked: {type: 'Boolean', setter: '_setIsChecked'}
	},

	_properties: {
		/** Is this checkbox or radio currently selected (checked)? */
		is_checked: false
	},

	_event_handlers: {
		checked_changed: '_onCheckedChanged'
	},

	_handleInputView: function(view, template_arguments) {

		this.InputAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('checked', this._properties.is_checked ? 'checked' : null);

	},

	/**
	 * Set the "checked" property on checkbox or radio input element
	 * @param {boolean} value
	 */
	_setIsChecked: function(value) {

		this._set('is_checked', value);
		if (this._input_container) {
			this._input_container.setProperty('checked', this._properties.is_checked ? 'checked' : null);
		}

	},

	/**
	 * Element's checked state has changed. Update local <wp>is_checked</wp> property
	 */
	_onCheckedChanged: function() {

		this.set('is_checked', this._input_container.getDOMElement().checked);
		this._fire('checked_changed');

	},

	toQueryString: function() {

		return (this._properties.name && this._properties.is_checked)
			? this._properties.name + "=" + (this._properties.value || 'on')
			: '';

	}

});

Lava.define(
'Lava.widget.input.CheckBox',
/**
 * CheckBox input
 * @lends Lava.widget.input.CheckBox#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'checkbox',
	_type: "checkbox",

	_property_descriptors: {
		is_indeterminate: {type: 'Boolean', setter: '_setIsIndeterminate'}
	},

	_properties: {
		/** Is checkbox in indeterminate state */
		is_indeterminate: false
	},

	/**
	 * Set "indeterminate" property on checkbox input element
	 */
	_refreshIndeterminate: function() {

		if (this._input_container && this._input_container.getDOMElement()) {
			this._input_container.getDOMElement().indeterminate = this._properties.is_indeterminate;
		}

	},

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();
		this._refreshIndeterminate();

	},

	_refresh: function() {

		this.RadioAbstract$_refresh();
		this._refreshIndeterminate();

	},

	_setIsChecked: function(value, name) {

		this.RadioAbstract$_setIsChecked(value, name);
		this._setIsIndeterminate(false);

	},

	/**
	 * Setter for <wp>is_indeterminate</wp> property
	 * @param {boolean} value
	 */
	_setIsIndeterminate: function(value) {

		if (this._properties.is_indeterminate != value) {
			this._set('is_indeterminate', value);
		}
		this._refreshIndeterminate(); // outside of condition: do not trust the browser and set anyway

	},

	_onCheckedChanged: function() {

		this.RadioAbstract$_onCheckedChanged();
		this.set('is_indeterminate', false);

	}

});

Lava.define(
'Lava.widget.input.Radio',
/**
 * Radio input
 * @lends Lava.widget.input.Radio#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'radio',
	_type: "radio",

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();

		if (this._input_container) {
			// There may be situation, when several radios with same name are rendered as checked.
			// Only the last one of them will stay checked, others will be turned off by the browser.
			this.set('is_checked', this._input_container.getDOMElement().checked);
		}

	}

});

/**
 * Submit button was clicked
 * @event Lava.widget.input.Submit#clicked
 */

Lava.define(
'Lava.widget.input.Submit',
/**
 * Submit button input
 * @lends Lava.widget.input.Submit#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	name: 'submit',
	_type: "submit",

	_event_handlers: {
		clicked: '_onClicked'
	},

	/**
	 * Submit button was clicked. Fire "clicked" event
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onClicked: function(dom_event_name, dom_event) {

		this._fire('clicked');
		dom_event.preventDefault();

	}

});

Lava.define(
'Lava.widget.input.SelectAbstract',
/**
 * Base class for select inputs
 * @lends Lava.widget.input.SelectAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	name: 'select',

	_properties: {
		/**
		 * Option groups in this select input.
		 * &lt;optgroup&gt; tag is created only for those groups that have a title
		 */
		optgroups: null
	},

	_event_handlers: {
		value_changed: '_onValueChanged'
	},

	_modifiers: {
		isValueSelected: 'isValueSelected'
	},

	broadcastInDOM: function() {

		this.InputAbstract$broadcastInDOM();
		this._refreshValue();

	},

	/**
	 * DOM element's value has changed: refresh local <wp>value</wp> property
	 */
	_onValueChanged: function() {

		this._refreshValue();

	},

	_refresh: function() {

		// to synchronize the selected value after setting options and optgroups property
		this.InputAbstract$_refresh();
		this._refreshValue();

	},

	/**
	 * Refresh local <wp>value</wp> property from DOM input element
	 */
	_refreshValue: function() {

		Lava.t('Abstract function call: _refreshValue');

	}

});

Lava.define(
'Lava.widget.input.Select',
/**
 * Dropdown select
 * @lends Lava.widget.input.Select#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement();
		// https://mootools.lighthouseapp.com/projects/2706/tickets/578-elementgetselected-behaves-differently-between-ffie-safari
		//noinspection BadExpressionStatementJS
		element.selectedIndex;
		this.set('value', element.value);

	},

	/**
	 * Setter for the <wp>value</wp> property
	 * @param {string} value
	 */
	_setValue: function(value) {

		var element;

		if (this._input_container) {
			element = this._input_container.getDOMElement();
			element.value = value;
			if (value != element.value) { // workaround for nonexistent values
				Lava.logError("[Select] nonexistent value assigned: " + value);
				value = element.value;
			}
		}

		this._set('value', value);

	},

	/**
	 * {modifier} This widget does not use live bindings of "selected" property, so this modifier is used to speed up rendering
	 * @param {string} value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {
		return value == this._properties.value;
	}

});

Lava.define(
'Lava.widget.input.MultipleSelect',
/**
 * Select input with multiple choices
 * @lends Lava.widget.input.MultipleSelect#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	name: 'select',

	_property_descriptors: {
		value: {type: 'Array', setter: '_setValue'}
	},

	_properties: {
		value: []
	},

	_handleInputView: function(view, template_arguments) {

		this.SelectAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('multiple', true);

	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement(),
			options = element.selectedOptions || element.options,
			result = [],
			i = 0,
			count = options.length,
			option_value,
			differs = false;

		for (; i < count; i++) {
			if (options[i].selected) {
				option_value = options[i].value || options[i].text;
				result.push(option_value);
				if (this._properties.value.indexOf(option_value) == -1) {
					differs = true;
				}
			}
		}

		if (differs || this._properties.value.length != result.length) {

			this._set('value', result);

		}

	},

	/**
	 * Setter for the <wp>value</wp> property
	 * @param {Array.<string>} value
	 */
	_setValue: function(value) {

		var element,
			options,
			count,
			i = 0,
			option_value;

		if (this._input_container) {

			element = this._input_container.getDOMElement();
			options = element.options;
			count = options.length;
			for (; i < count; i++) {
				option_value = options[i].value || options[i].text;
				options[i].selected = (value.indexOf(option_value) != -1);
			}

		}

		this._set('value', value);

	},

	/**
	 * {modifier} This widget does not use bindings of "selected" property, so this modifier is used to speed up rendering
	 * @param {string} value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {

		return this._properties.value.indexOf(value) != -1;

	},

	toQueryString: function() {

		var result = [],
			name = this._properties.name,
			values = this._properties.value,
			i = 0,
			count = values.length;

		if (this._properties.name && !this._properties.is_disabled) {
			for (; i < count; i++) {
				result.push(
					encodeURIComponent(name) + '=' + encodeURIComponent(values[i])
				);
			}
		}

		return result.join('&');

	}

});

Lava.define(
'Lava.widget.input.Numeric',
/**
 * Numeric input
 * @lends Lava.widget.input.Numeric#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',

	_property_descriptors: {
		value: {type: 'Number', setter: '_setValue'},
		input_value: {type: 'String', is_readonly: true}
	},

	_properties: {
		value: 0,
		/** Text, that is currently entered into the DOM element */
		input_value: ''
	},

	_type: "number",
	/**
	 * A type from {@link Lava.types}
	 * @type {string}
	 */
	_data_type: 'Number',

	/**
	 * @param config
	 * @param {string} config.options.type The only possible value is "text" - to change default &lt;input&gt; element
	 *  type from "number" to "text"
	 * @param {string} config.options.data_type Widget's value type from {@link Lava.types}.
	 *  Must produce valid JavaScript number. Defaults to "Number"
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Text$init(config, widget, parent_view, template, properties);

		if (config.options) {

			if (config.options['type']) {

				if (config.options['type'] != 'text') Lava.t('Numeric input: the only recognized "type" option value in "text"');
				this._type = config.options['type'];

			}

			if (config.options['data_type']) {

				this._data_type = config.options['data_type'];

			}

		}

	},

	_valueToElementProperty: function(value) {

		return value + '';

	},

	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value,
			is_valid = Lava.types[this._data_type].isValidString(value);

		if (this._properties.input_value != value) { // to bypass readonly check

			this._set('input_value', value);

		}

		if (is_valid) {

			if (this._properties.value != value) {

				this._set('value', value);
				this._input_container.storeProperty('value', value);

			}

			this._setValidity(true);

		}

		this._setValidity(is_valid);

	},

	_setValue: function(value, name) {

		this.Text$_setValue(value, name);
		this._setValidity(true);

	}

});

Lava.define(
'Lava.widget.FieldGroup',
/**
 * Manages a collection of form input fields
 * @lends Lava.widget.FieldGroup#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'field_group',

	_role_handlers: {
		form_field: '_handleFieldRole',
		form_group: '_handleGroupRole'
	},

	_event_handlers: {
		form_submit: '_onSubmit'
	},

	/**
	 * Input widgets, registered with the FieldGroup
	 * @type {Array.<Lava.widget.input.InputAbstract>}
	 */
	_fields: [],
	/**
	 * Other FieldGroup instances registered with this widget
	 * @type {Array.<Lava.widget.FieldGroup>}
	 */
	_groups: [],
	/**
	 * Submit button fields
	 * @type {Array.<Lava.widget.input.Submit>}
	 */
	_submit_fields: [],

	/**
	 * Register another FieldGroup widget with this one
	 * @param field_group_widget
	 */
	_handleGroupRole: function(field_group_widget) {

		this._groups.push(field_group_widget);

	},

	/**
	 * Register an input widget
	 * @param field_widget
	 */
	_handleFieldRole: function(field_widget) {

		if (field_widget.name == 'submit') {

			this._submit_fields.push(field_widget);
			field_widget.on('clicked', this._onSubmit, this);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._submit_fields);

		} else {

			this._fields.push(field_widget);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._fields);

		}

		Lava.view_manager.cancelBubble();

	},

	/**
	 * Submit input was clicked
	 */
	_onSubmit: function() {



	},

	/**
	 * Get `_fields`
	 * @returns {Array.<Lava.widget.input.InputAbstract>}
	 */
	getFields: function() {

		return this._fields.slice();

	},

	/**
	 * Get `_submit_fields`
	 * @returns {Array.<Lava.widget.input.InputAbstract>}
	 */
	getSubmitFields: function() {

		return this._submit_fields.slice();

	},

	/**
	 * Convert value of all registered inputs to query string, as in GET request
	 * @returns {string}
	 */
	toQueryString: function() {

		var i = 0,
			count = this._fields.length,
			result = [],
			value;

		for (; i < count; i++) {

			value = this._fields[i].toQueryString();
			if (value) {
				result.push(value);
			}

		}

		return result.join('&');

	},

	/**
	 * Cleanup destroyed fields from local members
	 * @param {Lava.widget.input.InputAbstract} field_widget
	 * @param event_args
	 * @param native_args Reference to local array with input widgets
	 */
	_onFieldDestroyed: function(field_widget, event_args, native_args) {

		Firestorm.Array.exclude(native_args, field_widget);

	}

});
/**
 * Panel is expanding
 * @event Lava.widget.Accordion#panel_expanding
 * @type {Object}
 * @property {Lava.widget.Standard} panel Panel, which triggered the event
 */

/**
 * Panel is collapsing
 * @event Lava.widget.Accordion#panel_collapsing
 * @type {Object}
 * @property {Lava.widget.Standard} panel Panel, which triggered the event
 */

Lava.define(
'Lava.widget.Accordion',
/**
 * Collection of expandable panels
 * @lends Lava.widget.Accordion#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'accordion',

	_property_descriptors: {
		is_enabled: {type: 'Boolean', setter: '_setIsEnabled'}
	},

	_properties: {
		/**
		 * Collection of "panel" <b>objects</b> (objects with properties for panel <b>widgets</b>)
		 * @type {Lava.system.Enumerable}
		 */
		_panels: null,
		/** If accordion is enabled - then it closes all other open panels when any panel is opened */
		is_enabled: true
	},

	_role_handlers: {
		panel: '_handlePanelRole'
	},

	/**
	 * Reference to the <wp>_panels</wp> property
	 * @type {Lava.system.Enumerable}
	 */
	_panels: null,
	/**
	 * Accordion's panels
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_panel_widgets: [],
	/**
	 * Panels, that are currently expanded
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_active_panels: [],
	/**
	 * Objects with listeners for accordion's panels
	 * @type {Object.<string, Object.<string, _tListener>>}
	 */
	_listeners_by_panel_guid: {},

	/**
	 * @param config
	 * @param {boolean} config.options.keep_new_panels_expanded If you add another expanded panel to accordion - it's collapsed by default.
	 *  You may set this option to keep it expanded - in this case all expanded panels will be collapsed as soon as any panel is expanded by user
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this._panels = new Lava.system.Enumerable();
		this._properties._panels = this._panels;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var data,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.panels) {

			data = this._config.storage.panels;
			for (i = 0, count = data.length; i < count; i++) {

				this.addPanel({
					is_expanded: data[i].is_expanded || false,
					title_template: data[i].title,
					content_template: data[i].content
				});

			}

		}

	},

	/**
	 * Create a panel inside accordion
	 * @param {Object} properties Plain object with panel's data
	 * @param {boolean} properties.is_expanded Initial "expanded" state
	 * @param {_tTemplate} properties.title_template
	 * @param {_tTemplate} properties.content_template
	 * @returns {Lava.mixin.Properties} The {@link Lava.mixin.Properties} instance with panel's data
	 */
	addPanel: function(properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addPanel. Plain object expected.");

		var panel = new Lava.mixin.Properties({
			is_expanded: false,
			title_template: null,
			content_template: null
		});
		panel.setProperties(properties);
		this._panels.push(panel);
		return panel;

	},

	/**
	 * Get panel objects
	 * @returns {Array.<Lava.widget.Standard>}
	 */
	getPanelObjects: function() {

		return this._panels.getValues();

	},

	/**
	 * Get a copy of `_panel_widgets`
	 * @returns {Array}
	 */
	getPanelWidgets: function() {

		return this._panel_widgets.slice();

	},

	/**
	 * Handle a panel inside accordion instance
	 * @param {Lava.widget.Standard} view
	 */
	_handlePanelRole: function(view) {

		this.registerPanel(view);

	},

	/**
	 * Add panel widget instance to Accordion. Panel does not need to be inside accordion
	 * @param {Lava.widget.Standard} panel_widget
	 */
	registerPanel: function(panel_widget) {

		var collapse_on_add = !this._config.options || !this._config.options['keep_new_panels_expanded'];

		if (panel_widget.get('is_expanded')) {

			if (this._active_panels.length && collapse_on_add && this._properties.is_enabled) {

				panel_widget.set('is_expanded', false);

			} else {

				this._active_panels.push(panel_widget);

			}

		}

		this._panel_widgets.push(panel_widget);

		this._listeners_by_panel_guid[panel_widget.guid] = {
			// note: if panel is outside of the widget, this listener may never fire
			destroy: panel_widget.on('destroy', this._onPanelDestroy, this, null, true),
			expanding: panel_widget.on('expanding', this._onPanelExpanding, this),
			collapsing: panel_widget.on('collapsing', this._onPanelCollapsing, this)
		};

	},

	/**
	 * Remove all references to panel widget from local members
	 * @param {Lava.widget.Standard} panel_widget
	 */
	_removePanel: function(panel_widget) {

		Firestorm.Array.exclude(this._panel_widgets, panel_widget);
		Firestorm.Array.exclude(this._active_panels, panel_widget);
		delete this._listeners_by_panel_guid[panel_widget.guid];

	},

	/**
	 * Stop controlling this panel widget
	 * @param {Lava.widget.Standard} panel_widget
	 */
	unregisterPanel: function(panel_widget) {

		var listeners = this._listeners_by_panel_guid[panel_widget.guid];
		if (listeners) {
			panel_widget.removeListener(listeners.destroy);
			panel_widget.removeListener(listeners.expanding);
			panel_widget.removeListener(listeners.collapsing);
			this._removePanel(panel_widget);
		}

	},

	/**
	 * Panel is expanding. Close all other panels
	 * @param {Lava.widget.Standard} panel
	 */
	_onPanelExpanding: function(panel) {

		var turnoff_panels,
			i = 0,
			count;

		if (this._properties.is_enabled) {

			turnoff_panels = this._active_panels.slice();
			for (i = 0, count = turnoff_panels.length; i < count; i++) {

				turnoff_panels[i].set('is_expanded', false);

			}

			this._active_panels = [panel];

		} else {

			this._active_panels.push(panel);

		}

		this._fire('panel_expanding', {
			panel: panel
		});

	},

	/**
	 * Handler of panel's "collapsing" event
	 * @param {Lava.widget.Standard} panel
	 */
	_onPanelCollapsing: function(panel) {

		Firestorm.Array.exclude(this._active_panels, panel);
		this._fire('panel_collapsing', {
			panel: panel
		});

	},

	/**
	 * Turn accordion on and off
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setIsEnabled: function(value, name) {

		var turnoff_panels = [],
			i = 0,
			last_index;

		if (value) {

			if (this._active_panels.length > 1) {

				last_index = this._active_panels.length - 1;
				// slice is needed for the listeners
				turnoff_panels = this._active_panels.slice(0, last_index);
				for (; i < last_index; i++) {
					turnoff_panels[i].set('is_expanded', false);
				}
				// keep expanded only the last opened panel
				this._active_panels = [this._active_panels[last_index]];

			}

		}

		this._set(name, value);

	},

	/**
	 * Remove references to destroyed panel
	 * @param panel
	 */
	_onPanelDestroy: function(panel) {

		this._removePanel(panel);

	},

	/**
	 * Remove all panels, added by `addPanel`
	 */
	removeNativePanels: function() {

		this._panels.removeAll();

	},

	/**
	 * Stop controlling all panels and remove panels which were added by `addPanel`
	 */
	removeAllPanels: function() {

		var panel_widgets = this._panel_widgets.slice(); // cause array will be modified during unregisterPanel()

		for (var i = 0, count = panel_widgets.length; i < count; i++) {

			this.unregisterPanel(panel_widgets[i]);

		}

		this._panels.removeAll();

	},

	/**
	 * Remove a panel, added by `addPanel`
	 * @param {Lava.mixin.Properties} panel The panel object, returned by `addPanel`
	 */
	removePanel: function(panel) {

		this._panels.removeValue(panel); // everything else will be done by destroy listener

	},

	destroy: function() {

		this.removeAllPanels();

		this._panels.destroy();
		this._panels = this._properties._panels = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Tabs',
/**
 * Tabs widget
 * @lends Lava.widget.Tabs#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tabs',

	_properties: {
		/**
		 * Collection of objects with tab data
		 * @type {Lava.system.Enumerable}
		 */
		_tabs: null,
		/**
		 * Active tab object
		 * @type {Lava.mixin.Properties}
		 */
		active_tab: null
	},

	_property_descriptors: {
		active_tab: {setter: '_setActiveTab'}
	},

	_event_handlers: {
		header_click: '_onTabHeaderClicked'
	},

	/**
	 * Reference to <wp>_tabs</wp> property
	 * @type {Lava.system.Enumerable}
	 */
	_tab_objects: null,

	init: function(config, widget, parent_view, template, properties) {

		this._tab_objects = new Lava.system.Enumerable();
		this._properties._tabs = this._tab_objects;

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var sugar_tabs,
			i,
			count,
			tab;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.tabs) {

			sugar_tabs = this._config.storage.tabs;
			i = 0;
			count = sugar_tabs.length;

			for (; i < count; i++) {

				tab = sugar_tabs[i];
				this.addTab({
					name: tab.name || '',
					is_enabled: ("is_enabled" in tab) ? tab.is_enabled : true,
					is_hidden: ("is_hidden" in tab) ? tab.is_hidden : false,
					is_active: ("is_active" in tab) ? tab.is_active : false,
					title_template: tab.title,
					content_template: tab.content
				});

			}

		}

	},

	/**
	 * Tab header was clicked. Switch active tab
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
	_onTabHeaderClicked: function(dom_event_name, dom_event, view, template_arguments) {

		var tab = template_arguments[0]; // tab object
		if (tab.get('is_enabled')) {
			this._setActiveTab(tab);
		}
		// to remove dotted outline in FF. This can be done with CSS, but CSS will disable it completely
		view.getContainer().getDOMElement().blur();
		dom_event.preventDefault();

	},

	/**
	 * Create a new tab
	 * @param {Object} properties The properties of the new tab
	 * @param {string} properties.name
	 * @param {boolean} properties.is_enabled
	 * @param {boolean} properties.is_hidden
	 * @param {_tTemplate} properties.title_template
	 * @param {_tTemplate} properties.content_template
	 * @returns {Lava.mixin.Properties} Created object with tab data
	 */
	addTab: function(properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addTab. Plain object expected.");

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			is_active: false,
			title_template: null,
			content_template: null
		});
		tab.setProperties(properties);

		if (Lava.schema.DEBUG && tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) Lava.t('Tabs: added tab cannot be active and disabled/hidden at the same time');

		if (this._properties.active_tab == null && tab.get('is_enabled') && !tab.get('is_hidden')) {

			this._setActiveTab(tab);

		}

		if (tab.get('is_active') && this._properties.active_tab != tab) {
			if (this._properties.active_tab) {
				this._properties.active_tab.set('is_active', false);
			}
			this._set('active_tab', tab);
		}

		this._tab_objects.push(tab);

		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_active', this._onTabIsActiveChanged, this);

		return tab;

	},

	/**
	 * "is_active" property of tab object has changed. Update active tab
	 * @param {Lava.mixin.Properties} tab
	 */
	_onTabIsActiveChanged: function(tab) {

		if (tab.get('is_active')) {

			this._setActiveTab(tab);

		} else if (this._properties.active_tab == tab) {

			this._setActiveTab(null);

		}

	},

	/**
	 * Change currently active tab
	 * @param {Lava.mixin.Properties} new_tab
	 */
	_setActiveTab: function(new_tab) {

		var old_active_tab = this._properties.active_tab;

		if (old_active_tab != new_tab) {

			this._set('active_tab', new_tab);
			if (new_tab) new_tab.set('is_active', true);
			if (old_active_tab) old_active_tab.set('is_active', false);

		}

	},

	/**
	 * If currently active tab was disabled or hidden - choose new active tab
	 * @param {Lava.mixin.Properties} tab
	 */
	_onTabStateChanged: function(tab) {

		if (tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) {

			this._fixActiveTab();

		}

	},

	/**
	 * Get all objects with tab data
	 * @returns {Array.<Lava.mixin.Properties>}
	 */
	getTabObjects: function() {

		return this._tab_objects.getValues();

	},

	/**
	 * Remove a tab object, returned by `addTab`
	 * @param {Lava.mixin.Properties} tab_object
	 */
	removeTab: function(tab_object) {

		this._tab_objects.removeValue(tab_object);

		if (this._properties.active_tab == tab_object) {

			this._fixActiveTab();

		}

	},

	/**
	 * Find first tab, that can be active and assign it as the current active tab
	 */
	_fixActiveTab: function() {

		var active_tab = null;

		this._tab_objects.each(function(tab) {
			var result = null;
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				result = false;
			}
			return result;
		});

		this._setActiveTab(active_tab);

	},

	/**
	 * Remove all tabs
	 */
	removeAllTabs: function() {

		var tabs = this._tab_objects.getValues(),
			i = 0,
			count = tabs.length;

		for (; i < count; i++) {
			this.removeTab(tabs[i]);
		}

		this._setActiveTab(null);

	},

	/**
	 * Reorder tabs
	 * @param {Array.<number>} indices
	 */
	reorderTabs: function(indices) {

		this._tab_objects.reorder(indices);

	},

	/**
	 * Sort tabs
	 * @param {_tLessCallback} callback
	 */
	sortTabs: function(callback) {

		this._tab_objects.sort(callback);

	},

	destroy: function() {

		this.removeAllTabs();
		this._tab_objects.destroy();
		this._tab_objects = this._properties._tab_objects = null;

		this.Standard$destroy();

	}

});
/**
 * Panel started to expand
 * @event Lava.widget.Collapsible#expanding
 */

/**
 * Panel started to collapse
 * @event Lava.widget.Collapsible#collapsing
 */

/**
 * Panel has fully expanded
 * @event Lava.widget.Collapsible#expanded
 */

/**
 * Panel is collapsed
 * @event Lava.widget.Collapsible#collapsed
 */

Lava.define(
'Lava.widget.Collapsible',
/**
 * Animated HTML element, which can be shown and hidden
 * @lends Lava.widget.Collapsible#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible',

	_property_descriptors: {
		is_expanded: {type: 'Boolean', setter: '_setExpanded'},
		is_animation_enabled: {type: 'Boolean'}
	},

	_properties: {
		/** Is the element expanded */
		is_expanded: true,
		/** Use animation, while expanding and collapsing the element */
		is_animation_enabled: true,
		/** Content for default widget's template */
		content: ''
	},

	_role_handlers: {
		_container_view: '_handleContainerView'
	},

	/**
	 * Main container of the expandable DOM element
	 * @type {Lava.view.container.Element}
	 */
	_panel_container: null,
	/**
	 * DOM element's animation
	 * @type {Lava.animation.Abstract}
	 */
	_animation: null,
	/**
	 * The "display" CSS rule from container's element
	 * @type {string}
	 */
	_default_display: null,

	/**
	 * When animation is disabled, Toggle animation is used to show and hide the DOM element
	 * @type {string}
	 * @const
	 */
	TOGGLE_ANIMATION_CLASS: 'Toggle',

	/**
	 * Create animation, set it's direction and run it
	 * @param {boolean} is_forwards Is widget's element expanding
	 */
	_refreshAnimation: function(is_forwards) {

		var element = this._panel_container.getDOMElement(),
			animation_options;

		if (!this._animation) {

			animation_options = this._properties.is_animation_enabled ? this._config.options.animation : {"class": this.TOGGLE_ANIMATION_CLASS};
			this._animation = new Lava.animation[animation_options['class']](animation_options, element);
			this._animation.on('complete', this._onAnimationComplete, this);

		}

		// content may be re-rendered and the old element reference may become obsolete
		this._animation.setTarget(element);

		if (is_forwards) {

			this._animation.resetDirection();

		} else {

			this._animation.reverseDirection();

		}

		this._animation.safeStart();

	},

	/**
	 * Fire widget's events and fix element's "display" CSS rule
	 */
	_onAnimationComplete: function() {

		if (this._animation.isReversed()) {

			this._fire('collapsed');
			this._panel_container.setStyle('display', 'none');

		} else {

			this._fire('expanded');

		}

	},

	/**
	 * Setter for <wp>is_expanded</wp> property
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setExpanded: function(value, name) {

		var new_display = 'none';

		this._set(name, value);

		if ((this._is_inDOM && this._properties.is_animation_enabled) || value) {

			new_display = this._default_display; // allow display:none only in case the panel must be collapsed and animation is disabled

		}

		// if this property is set in constructor - then container does not yet exist
		if (this._panel_container) {

			this._panel_container.setStyle('display', new_display);

		}

		if (this._is_inDOM) {

			this._fire(value ? 'expanding' : 'collapsing');

			if (this._properties.is_animation_enabled && this._panel_container) {

				this._refreshAnimation(value);

			} else {

				this._fire(value ? 'expanded' : 'collapsed');

			}

		}

	},

	/**
	 * Handle view with main container
	 * @param {Lava.view.Abstract} view
	 */
	_handleContainerView: function(view) {

		this._panel_container = view.getContainer();

		this._default_display = this._panel_container.getStyle('display') || null;

		if (!this._properties.is_expanded) {

			this._panel_container.setStyle('display', 'none');

		}

	},

	/**
	 * Get `_panel_container`
	 * @returns {Lava.view.container.Element}
	 */
	getMainContainer: function() {

		return this._panel_container;

	}

});

Lava.define(
'Lava.widget.CollapsiblePanel',
/**
 * An expandable panel with header and body
 * @lends Lava.widget.CollapsiblePanel#
 * @extends Lava.widget.Collapsible#
 */
{

	Extends: 'Lava.widget.Collapsible',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_locked: {type: 'Boolean'}
	},

	_properties: {
		/** When panel is locked - it does not respond to header clicks */
		is_locked: false,
		/** Panel's title */
		title: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	/**
	 * Toggle <wp>is_expanded</wp> property, when not locked
	 */
	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

		}

	}

});

/**
 * Panel started to expand it's body
 * @event Lava.widget.CollapsiblePanelExt#expanding
 */

/**
 * Panel started to collapse it's body
 * @event Lava.widget.CollapsiblePanelExt#collapsing
 */

/**
 * Panel's body has fully expanded
 * @event Lava.widget.CollapsiblePanelExt#expanded
 */

/**
 * Panel's body is collapsed
 * @event Lava.widget.CollapsiblePanelExt#collapsed
 */

Lava.define(
'Lava.widget.CollapsiblePanelExt',
/**
 * An expandable panel that removes it's content from DOM in collapsed state
 * @lends Lava.widget.CollapsiblePanelExt#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_expanded: {type: 'Boolean'},
		is_locked: {type: 'Boolean'},
		is_animation_enabled: {type: 'Boolean', setter: '_setAnimationEnabled'}
	},

	_properties: {
		/** Is panel expanded */
		is_expanded: true,
		/** When panel is locked - it does not respond to header clicks */
		is_locked: false,
		/** Does panel use animation to expand and collapse it's body */
		is_animation_enabled: true,
		/** Panel's title */
		title: '',
		/** Content for the default panel's template */
		content: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	_role_handlers: {
		_content_if: '_handleContentIf'
	},

	/**
	 * Refresher of the panel's body
	 * @type {Lava.view.refresher.Standard}
	 */
	_content_refresher: null,

	/**
	 * Handle view with the panel's body
	 * @param {Lava.view.Abstract} view
	 */
	_handleContentIf: function(view) {

		var refresher = view.getRefresher();

		refresher.on('insertion_complete', this._onInsertionComplete, this);
		refresher.on('removal_complete', this._onRemovalComplete, this);

		if (!this._properties.is_animation_enabled) {
			refresher.disableAnimation();
		}

		this._content_refresher = refresher;

	},

	/**
	 * Refresher has expanded the body, fire "expanded" event
	 */
	_onInsertionComplete: function() {

		this._fire('expanded');

	},

	/**
	 * Refresher has collapsed and removed the body, fire "collapsed" event
	 */
	_onRemovalComplete: function() {

		this._fire('collapsed');

	},

	/**
	 * Toggle <wp>is_expanded</wp> property, if not locked
	 */
	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

			// previous line has switched it's value, so events are also swapped
			this._fire(this._properties.is_expanded ? 'expanding' : 'collapsing');

		}

	},

	/**
	 * Setter for `is_animation_enabled`
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setAnimationEnabled: function(value, name) {

		this._set(name, value);

		// it may be set via assign or right after creation. At this time refresher does not exist yet.
		if (this._content_refresher) {

			if (value) {

				this._content_refresher.enableAnimation();

			} else {

				this._content_refresher.disableAnimation();

			}

		}

	}

});

Lava.define(
'Lava.widget.DropDown',
/**
 * Widget with content, that is shown on click
 * @lends Lava.widget.DropDown#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'dropdown',

	_property_descriptors: {
		is_open: {type: 'Boolean', setter: '_setIsOpen'}
	},

	_properties: {
		/** Is the widget expanded */
		is_open: false
	},

	_event_handlers: {
		trigger_click: '_onTriggerClick'
	},

	_role_handlers: {
		trigger: '_registerTrigger', // the link which toggles the dropdown
		target: '_registerTarget' // the target to which the class 'open' is applied
	},

	/**
	 * A view that responds to the "click" event
	 * @type {Lava.view.Abstract}
	 */
	_trigger: null,
	/**
	 * A view, that is displayed when `_trigger` is clicked
	 * @type {Lava.view.Abstract}
	 */
	_target: null,

	/**
	 * Listener for global "click" anywhere on page
	 * @type {_tListener}
	 */
	_click_listener: null,

	/**
	 * @param config
	 * @param {string} config.options.target_class Class name to add to `_target` when `_trigger` is clicked
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.app.on('close_popups', this._onClosePopups, this);

	},

	/**
	 * Handler for global {@link Lava.system.App} event "close_popups"
	 */
	_onClosePopups: function() {

		this.set('is_open', false);

	},

	/**
	 * Change <wp>is_open</wp> state (open dropdown which is closed and vice versa)
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onTriggerClick: function(dom_event_name, dom_event) {

		if (this._properties.is_open) {

			this.set('is_open', false);

		} else {

			Lava.app.fireGlobalEvent('close_popups');
			if (!this._click_listener) {
				this._click_listener = Lava.Core.addGlobalHandler('click', this._onGlobalClick, this);
			}

			this.set('is_open', true);

		}

		dom_event.preventDefault();

	},

	/**
	 * Click anywhere on page
	 */
	_onGlobalClick: function() {

		Lava.Core.removeGlobalHandler(this._click_listener);
		this._click_listener = null;
		this.set('is_open', false);

	},

	/**
	 * Get container of the element, which is shown, when widget is expanded
	 * @returns {_iContainer}
	 */
	_getTargetContainer: function() {

		return this._target && this._target.getContainer() || this._container;

	},

	/**
	 * Register `_trigger` view
	 * @param {Lava.view.Abstract} view
	 */
	_registerTrigger: function(view) {

		this._trigger = view;
		view.getContainer().addEventTarget('click', {locator_type: "Guid", locator: this.guid, name: "trigger_click"});

	},

	/**
	 * Register `_target` view
	 * @param {Lava.view.Abstract} view
	 */
	_registerTarget: function(view) {

		this._target = view;

	},

	/**
	 * Setter for <wp>is_open</wp> property
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setIsOpen: function(value, name) {

		var open_target_container = this._getTargetContainer();
		if (Lava.schema.DEBUG && !open_target_container) Lava.t("DropDown was created without container and target");

		this._set(name, value);

		if (value) {

			open_target_container.addClass(this._config.options.target_class);

		} else {

			open_target_container.removeClass(this._config.options.target_class);

		}

	},

	destroy: function() {

		if (this._click_listener) {
			Lava.Core.removeGlobalHandler(this._click_listener);
			this._click_listener = null;
		}

		this._trigger = this._target = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Tree',
/**
 * Tree with expandable nodes
 * @lends Lava.widget.Tree#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	Shared: ['_meta_storage_config', '_default_if_refresher_config', '_foreach_refresher_config',
		'_direct_bind_configs', '_meta_storage_bind_configs'],

	name: 'tree',

	/**
	 * Dynamic scope configs which use direct bindings to record properties
	 */
	_direct_bind_configs: {
		is_expanded: Lava.ExpressionParser.parseScopeEval('node.is_expanded'),
		is_expandable: Lava.ExpressionParser.parseScopeEval('node.children.length')
	},

	/**
	 * Dynamic scope configs for columns from MetaStorage
	 * @type {Object}
	 */
	_meta_storage_bind_configs: {
		is_expanded: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expanded'),
		// can be used by inherited classes
		is_expandable: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expandable')
	},

	/**
	 * MetaStorage is used by Tree to store the `expanded` state
	 * @type {Object}
	 */
	_meta_storage_config: {
		fields: {
			is_expanded: {type:'Boolean'}
			// is_expandable: {type:'Boolean'}
		}
	},

	/**
	 * Default refresher for the If view with node children (without animation)
	 * @type {_cRefresher}
	 */
	_default_if_refresher_config: {
		type: 'Standard'
	},

	/**
	 * Config of refresher, that expands children
	 * @type {_cRefresher}
	 */
	_if_refresher_config: null,

	/**
	 * Refresher, that inserts and removes new child nodes in the `record.children` collection.
	 * @type {_cRefresher}
	 */
	_foreach_refresher_config: {
		type: 'Standard',
		get_end_element_callback: function(template) {

			// Last view is the If with node children.
			// "_foreach_view" property was set in "node_children" role.
			var children_foreach = template.getLastView().get('_foreach_view'),
				node_children_element = children_foreach ? children_foreach.getContainer().getDOMElement() : null;

			return node_children_element || template.getFirstView().getContainer().getDOMElement();

		}
	},

	_property_descriptors: {
		records: {setter: '_setRecords'},
		meta_storage: {is_readonly: true}
	},

	_properties: {
		/** User-assigned records in the root of the tree */
		records: null,
		meta_storage: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_role_handlers: {
		node_children_view: '_handleNodeChildrenView',
		root_nodes_foreach: '_handleRootNodesForeach',
		nodes_foreach: '_handleNodesForeach'
	},

	/**
	 * MetaStorage instance for storage of "is_expanded" state of tree records
	 * @type {Lava.data.MetaStorage}
	 */
	_meta_storage: null,

	/**
	 * Columns, which are served from MetaStorage instead of record instance
	 * @type {Object.<string,true>}
	 */
	_meta_storage_columns: {},

	/**
	 * Dynamic scopes configuration
	 * @type {Object.<string,_cScopeLocator>}
	 */
	_column_bind_configs: {},

	/**
	 * May be overridden in inherited classes to force creation of MetaStorage in constructor
	 * @type {boolean}
	 */
	CREATE_META_STORAGE: false,

	/**
	 * @param config
	 * @param {Array.<string>} config.options.meta_storage_columns This setting allows you to define columns,
	 *  which will be stored in separate MetaStorage instance instead of record properties.
	 *  Commonly, you will want to store "is_expanded" property in MetaStorage.
	 * @param {Object} config.options.refresher You can assign custom refresher config for nodes (with animation support, etc).
	 * 	Use {type: 'Collapse'} to apply basic animation
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var i = 0,
			count,
			columns_list,
			name;

		if (config.options && config.options.meta_storage_columns) {
			columns_list = config.options.meta_storage_columns;
			count = columns_list.length;
			for (; i < count; i++) {
				this._meta_storage_columns[columns_list[i]] = true;
			}
		}

		for (name in this._direct_bind_configs) {

			this._column_bind_configs[name] = (name in this._meta_storage_columns)
				? this._meta_storage_bind_configs[name]
				: this._direct_bind_configs[name];

		}

		if (this.CREATE_META_STORAGE || !Firestorm.Object.isEmpty(this._meta_storage_columns)) {
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._properties.meta_storage = this._meta_storage;
		}

		this.Standard$init(config, widget, parent_view, template, properties);

		this._if_refresher_config = (config.options && config.options.refresher)
			? config.options.refresher
			: this._default_if_refresher_config

	},

	/**
	 * Setter for `records` property
	 * @param {?Array.<Object>} value
	 * @param {string} name
	 */
	_setRecords: function(value, name) {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._set('meta_storage', this._meta_storage);
		}

		this._set(name, value);

	},

	/**
	 * Get or create an instance of MetaRecord, which is attached to record from data
	 * @param {Object} record
	 * @returns {Lava.data.MetaRecord}
	 */
	_getMetaRecord: function(record) {

		return this._meta_storage.get(record.get('guid')) || this._meta_storage.createMetaRecord(record.get('guid'));

	},

	/**
	 * Create refresher for the If view with node children
	 * @param {Lava.view.If} view
	 */
	_handleNodeChildrenView: function(view) {

		view.createRefresher(this._if_refresher_config);

	},

	/**
	 * Create refresher for the root Foreach view
	 * @param {Lava.view.Foreach} view
	 */
	_handleRootNodesForeach: function(view) {

		view.createRefresher(this._foreach_refresher_config);

	},

	/**
	 * Initialize Foreach views with node children
	 * @param {Lava.view.Foreach} view
	 */
	_handleNodesForeach: function(view) {

		view.createRefresher(this._foreach_refresher_config);
		view.getParentView().set('_foreach_view', view);

	},

	/**
	 * Expand or collapse the node
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		// template_arguments[0] - node record
		if (Lava.schema.DEBUG) {
			if (!template_arguments[0].isProperties) {
				Lava.t("Tree: record is not instance of Properties");
			}
			if ('is_expanded' in this._meta_storage_columns) {
				if (!template_arguments[0].get('guid')) Lava.t("Tree: record without GUID");
			}
		}
		var property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(template_arguments[0]) : template_arguments[0];
		property_source.set('is_expanded', !property_source.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	},

	/**
	 * Switch expandable tree records to new state
	 * @param node
	 * @param {boolean} expanded_state
	 */
	_toggleTree: function(node, expanded_state) {

		var children = node.get('children'),
			child,
			i = 0,
			count = children.getCount(),
			property_source;

		if (count) {

			for (; i < count; i++) {
				child = children.getValueAt(i);
				if (child.get('children').getCount()) {
					this._toggleTree(child, expanded_state);
				}
			}

			property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(node) : node;
			property_source.set('is_expanded', expanded_state);

		}

	},

	/**
	 * Switch expandable root records to new state
	 * @param {boolean} expanded_state
	 */
	_toggleRecords: function(expanded_state) {

		var records = this._properties.records,
			i = 0,
			count,
			record;

		if (records) {
			count = records.getCount(); // Enumerable
			for (; i < count; i++) {
				record = records.getValueAt(i);
				this._toggleTree(record, expanded_state);
			}
		}

	},

	/**
	 * Expand all records in the tree
	 */
	expandAll: function() {

		this._toggleRecords(true);

	},

	/**
	 * Collapse all records in the tree
	 */
	collapseAll: function() {

		this._toggleRecords(false);

	},

	/**
	 * Locate record field references for templates (like "is_expanded" property)
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		if (!(config.property_name in this._column_bind_configs)) Lava.t('unknown dynamic scope: ' + config.property_name);
		return view.getScopeByPathConfig(this._column_bind_configs[config.property_name]);

	},

	destroy: function() {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = null;
		}

		this.Standard$destroy();

	}

});
Lava.define(
'Lava.widget.Table',
/**
 * Sortable table
 * @lends Lava.widget.Table#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'table',

	_properties: {
		/**
		 * User-assigned records collection for this table
		 * @type {Lava.system.Enumerable}
		 */
		records: null,
		/** Columns from table's options */
		_columns: null,
		/**
		 * The column, by which the records are sorted
		 * @type {string}
		 */
		_sort_column_name: null,
		/**
		 * Sort order
		 * @type {boolean}
		 */
		_sort_descending: false
	},

	_event_handlers: {
		column_header_click: '_onColumnHeaderClick'
	},

	_include_handlers: {
		cell: '_getCellInclude'
	},

	/**
	 * @param config
	 * @param {Array.<{name, title}>} config.options.columns Column descriptors. "title" is displayed in table head,
	 *  while "name" is name of the property in records
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		if (Lava.schema.DEBUG && (!config.options || !config.options.columns)) Lava.t("Table: config.options.columns is required");
		this._properties._columns = config.options.columns;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	/**
	 * Column header has been clicked. Apply sorting
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
	_onColumnHeaderClick: function(dom_event_name, dom_event, view, template_arguments) {

		var column_name = template_arguments[0].name,
			less;

		if (this._properties._sort_column_name != column_name) {

			this.set('_sort_column_name', column_name);
			this.set('_sort_descending', false);

		} else {

			this.set('_sort_descending', !this._properties._sort_descending);

		}

		less = this._properties._sort_descending
			? function(record_a, record_b) { return record_a.get(column_name) > record_b.get(column_name); }
			: function(record_a, record_b) { return record_a.get(column_name) < record_b.get(column_name); };

		if (this._properties.records) {
			this._properties.records.sort(less);
		}

	},

	/**
	 * Get include that renders content of a cell
	 * @param template_arguments
	 * @returns {_tTemplate}
	 */
	_getCellInclude: function(template_arguments) {

		// var column = template_arguments[0]; - column descriptor from options
		return this._config.storage.cells[template_arguments[0].type];

	}

});

Lava.define(
'Lava.widget.CalendarAbstract',
/**
 * Base class for calendar widgets
 * @lends Lava.widget.CalendarAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'calendar',

	_properties: {
		/** Currently selected year */
		_current_year: 0,
		/** Currently selected month */
		_current_month: 0,
		/** Currently selected day */
		_current_day: 0
	},

	/**
	 * Get data, which is used to build the month selection view
	 * @param {string} locale_name
	 * @returns {Array}
	 */
	_getMonthDescriptors: function(locale_name) {

		var i,
			result = [],
			month_names = Lava.locales[locale_name].short_month_names;

		for (i = 0; i < 12; i++) {

			result[i] = new Lava.mixin.Properties({
				index: i,
				title: month_names[i]
			});

		}

		return result;

	},

	/**
	 * Split array of month descriptors into rows
	 * @param {Array} descriptors
	 * @returns {Array}
	 */
	_getMonthDescriptorRows: function(descriptors) {

		var result = [];
		result.push(descriptors.slice(0, 4));
		result.push(descriptors.slice(4, 8));
		result.push(descriptors.slice(8, 12));
		return result;

	},

	/**
	 * Get descriptors for rendering the day names, with respect to cultural offset
	 * @param {string} locale
	 * @returns {Array}
	 */
	_getWeekDays: function(locale) {

		var culture_offset = Lava.locales[locale].first_day_offset,
			result = [],
			daynames = Lava.locales[locale].short_day_names,
			i,
			descriptor;

		for (i = 0; i < 7; i++) {
			descriptor = new Lava.mixin.Properties({
				index: i,
				title: daynames[culture_offset]
			});
			result.push(descriptor);
			culture_offset = (culture_offset + 1) % 7;
		}

		return result;

	},

	/**
	 * Get data, which is needed to display a month in template
	 * @param {number} year
	 * @param {number} month
	 * @param {string} locale_name
	 * @returns {{year: number, index: number, weeks: Array}}
	 */
	_renderMonthData: function(year, month, locale_name) {

		var culture_offset = Lava.locales[locale_name].first_day_offset,
			first_day_in_sequence = new Date(Date.UTC(year, month)),
			first_day_of_week = (first_day_in_sequence.getDay() - culture_offset + 7) % 7;

		if (first_day_of_week) { // the first day of month does not start at beginning of the row

			// Date object will correct the wrong arguments
			first_day_in_sequence = new Date(Date.UTC(year, month, 1 - first_day_of_week));

		}

		return {
			year: year,
			index: month,
			weeks: this._renderMonthWeeksData(first_day_in_sequence)
		}

	},

	/**
	 * Render 6 rows of 7 days
	 * @param {Date} start_date Date of the first day in the first row (day of week always starts from zero)
	 */
	_renderMonthWeeksData: function(start_date) {

		var year = start_date.getUTCFullYear(),
			month = start_date.getUTCMonth(),
			day = start_date.getUTCDate(),
			milliseconds = start_date.getTime(),
			day_of_week = 0, // 0 - 6
			days_in_month = Firestorm.Date.getDaysInMonth(year, month),
			i = 0,
			result = [],
			week = [];

		week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		do {

			if (day == days_in_month) {
				day = 1;
				month++;
				if (month == 12) {
					month = 0;
					year++;
				}
				days_in_month = Firestorm.Date.getDaysInMonth(year, month);
			} else {
				day++;
			}
			day_of_week = (day_of_week + 1) % 7;
			i++;
			milliseconds += 86400000; // 24 hours

			if (day_of_week == 0) {
				result.push(week);
				week = [];
			}

			week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		} while (i < 42); // 7*6

		return result;

	},

	/**
	 * Create a structure, which is used to display a day number in calendar template
	 * @param {number} year
	 * @param {number} month
	 * @param {number} day Day index in month, 0..30
	 * @param {number} day_of_week Weekday index, 0..6
	 * @param milliseconds Absolute time of the day
	 * @returns {{year: number, month: number, day: number, day_of_week: number, milliseconds: number, is_today: boolean}}
	 */
	_renderDayData: function(year, month, day, day_of_week, milliseconds) {
		return {
			year: year,
			month: month,
			day: day,
			day_of_week: day_of_week,
			milliseconds: milliseconds,
			is_today: this._properties._current_day == day
				&& this._properties._current_month == month
				&& this._properties._current_year == year
		};
	}

});

Lava.define(
'Lava.widget.Calendar',
/**
 * Calendar widget
 * @lends Lava.widget.Calendar#
 * @extends Lava.widget.CalendarAbstract#
 */
{

	Extends: 'Lava.widget.CalendarAbstract',

	_property_descriptors: {
		value: {type: 'Date', setter: '_setValue'}
	},

	_properties: {
		/**
		 * The current Date object
		 * @type {Date}
		 */
		value: null,
		/** Currently selected view: 'days' or 'months' */
		_selected_view: 'days',
		/** Culture-dependent list of week day descriptors */
		_weekdays: null,
		/** Displayed months for template */
		_months_data: null,
		/** Example: "May 2014" - displayed above the days_table */
		_month_year_string: null,
		/** Example: "24 May 2014" - displayed on the "today" link */
		_today_string: null,
		/**
		 * Start of selection, in milliseconds
		 * @type {number}
		 */
		_selection_start: 0,
		/**
		 * End of selection, in milliseconds (by default, always equals to <wp>_selection_start</wp>)
		 * @type {number}
		 */
		_selection_end: 0,
		/**
		 * Current year, displayed by calendar
		 * @type {number}
		 */
		_displayed_year: null,
		/**
		 * Current month of the displayed year
		 * @type {number}
		 */
		_displayed_month: null,
		/** Collection of template data, used to render month names */
		_month_descriptors: null,
		/** Month descriptors, split into rows - for the "months" selection view */
		_month_descriptor_rows: null
	},

	_event_handlers: {
		today_click: '_onTodayClick', // click on the current date to select it
		previous_month_click: '_onPreviousMonthClick',
		next_month_click: '_onNextMonthClick',
		days_view_month_name_click: '_onSwitchToMonthViewClick', // while in the 'days' view - click on the month name above the days
		//close_month_view_click: '_onCloseMonthsViewClick', // on 'months' select view: close it and return to the 'days' view
		month_click: '_onMonthClick', // on 'months' view - select month
		day_click: '_onDayClick',
		previous_year_click: '_onPreviousYearClick',
		next_year_click: '_onNextYearClick'
	},

	_role_handlers: {
		_year_input: '_handleYearInput'
	},

	/**
	 * Year input widget
	 * @type {Lava.widget.input.InputAbstract}
	 */
	_year_input: null,
	/**
	 * Cache of data for months rendering
	 * @type {Object}
	 */
	_months_cache: {},

	/**
	 * @param config
	 * @param {string} config.options.invalid_input_class Name of CSS class to apply to invalid year input field
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var current_date = new Date(),
			storage = this._properties,
			locale_object = Lava.locales[Lava.schema.LOCALE];

		// not using UTC values here to allow user to see the day in his own timezone
		storage._current_year = current_date.getFullYear();
		storage._current_month = current_date.getMonth();
		storage._current_day = current_date.getDate();

		storage._displayed_year = storage._current_year;
		storage._displayed_month = storage._current_month;

		storage._weekdays = this._getWeekDays(Lava.schema.LOCALE);
		storage._month_descriptors = this._getMonthDescriptors(Lava.schema.LOCALE);
		storage._month_descriptor_rows = this._getMonthDescriptorRows(storage._month_descriptors);

		this.CalendarAbstract$init(config, widget, parent_view, template, properties);

		if (this._properties.value == null) {
			this._setValue(current_date, 'value');
		}

		this.set(
			'_today_string',
			storage._current_day + ' ' + locale_object.month_names[storage._current_month] + ' ' + storage._current_year
		);

		this._refreshData();

	},

	/**
	 * Refresh data for templates
	 */
	_refreshData: function() {

		var locale_object = Lava.locales[Lava.schema.LOCALE],
			month_data = this._getMonthData(this._properties._displayed_year, this._properties._displayed_month);

		this.set('_months_data', [month_data]);

		// Formatting by hands, cause in future there may be added a possibility to set locale in options
		this.set(
			'_month_year_string',
			locale_object.month_names[this._properties._displayed_month] + ' ' + this._properties._displayed_year
		);

	},

	/**
	 * Get cached template data for month rendering
	 * @param {number} year
	 * @param {number} month
	 * @returns {Object}
	 */
	_getMonthData: function(year, month) {

		var month_key = year + '' + month;

		if (!(month_key in this._months_cache)) {
			this._months_cache[month_key] = this._renderMonthData(year, month, Lava.schema.LOCALE);
		}

		return this._months_cache[month_key];

	},

	/**
	 * Show previous month
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onPreviousMonthClick: function(dom_event_name, dom_event) {

		var month = this._properties._displayed_month;
		if (month == 0) {
			this.set('_displayed_year', this._properties._displayed_year - 1);
			this.set('_displayed_month', 11);
		} else {
			this.set('_displayed_month', month - 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},

	/**
	 * Show next month
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onNextMonthClick: function(dom_event_name, dom_event) {

		var month = this._properties._displayed_month;
		if (month == 11) {
			this.set('_displayed_year', this._properties._displayed_year + 1);
			this.set('_displayed_month', 0);
		} else {
			this.set('_displayed_month', month + 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},

	/**
	 * Select current day
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onTodayClick: function(dom_event_name, dom_event) {

		var time = Date.UTC(this._properties._current_year, this._properties._current_month, this._properties._current_day);
		this._select(this._properties._current_year, this._properties._current_month, time);
		dom_event.preventDefault();

	},

	/**
	 * Select the clicked day
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
	_onDayClick: function(dom_event_name, dom_event, view, template_arguments) {

		var day = template_arguments[0]; // the rendered "day" structure
		this._select(day.year, day.month, day.milliseconds);
		dom_event.preventDefault(); // cancel selection

	},

	/**
	 * Perform date selection
	 * @param {number} year
	 * @param {number} month
	 * @param {number} milliseconds
	 */
	_select: function(year, month, milliseconds) {

		this.set('_selection_start', milliseconds);
		this.set('_selection_end', milliseconds);
		if (this._properties._displayed_month != month) {
			this.set('_displayed_year', year);
			this.set('_displayed_month', month);
			this._refreshData();
		}

		this.set('value', new Date(milliseconds));

	},

	/**
	 * Switch current view to "months" selection
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onSwitchToMonthViewClick: function(dom_event_name, dom_event) {

		this.set('_selected_view', 'months');
		if (this._year_input) {
			this._year_input.set('value', this._properties._displayed_year + '');
		}
		dom_event.preventDefault();

	},

	/*_onCloseMonthsViewClick: function(dom_event_name, dom_event, view, template_arguments) {

		this._refreshData();
		this.set('_selected_view', 'days');

	},*/

	/**
	 * Display previous year
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onPreviousYearClick: function(dom_event_name, dom_event) {

		this.set('_displayed_year', this.get('_displayed_year') - 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},

	/**
	 * Display next year
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onNextYearClick: function(dom_event_name, dom_event) {

		this.set('_displayed_year', this.get('_displayed_year') + 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},

	/**
	 * Display calendar for chosen month
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
	_onMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month_descriptor = template_arguments[0];
		this.set('_displayed_month', month_descriptor.get('index'));
		this.set('_selected_view', 'days');
		this._refreshData();

	},

	/**
	 * Register input for the year on months view
	 * @param {Lava.widget.input.InputAbstract} view
	 */
	_handleYearInput: function(view) {

		this._year_input = view;
		view.onPropertyChanged('value', this._onYearInputValueChanged, this);

	},

	/**
	 * Add predefined CSS class to the year input to mark it as invalid
	 */
	_markInputAsInvalid: function() {

		// do not add the class to the container itself, just to the element
		// cause we do not need it to stay after refresh or render
		var year_input_container = this._year_input.getMainContainer(),
			element;

		if (year_input_container) {
			element = year_input_container.getDOMElement();
			if (element) {
				Firestorm.Element.addClass(element, this._config.options['invalid_input_class']);
			}
		}

	},

	/**
	 * Remove "invalid_input_class" from input field
	 */
	_clearInvalidInputState: function() {

		var year_input_container = this._year_input.getMainContainer(),
			element;

		if (year_input_container) {
			element = year_input_container.getDOMElement();
			if (element) {
				Firestorm.Element.removeClass(element, this._config.options['invalid_input_class']);
			}
		}

	},

	/**
	 * Refresh <wp>_displayed_year</wp> property from year input
	 * @param {Lava.widget.input.InputAbstract} widget
	 */
	_onYearInputValueChanged: function(widget) {

		var value = widget.get('value');

		// maxlength is also set on input in the template
		if (value.length > 2 && value.length < 6 && /^\d+$/.test(value)) {
			this.set('_displayed_year', +value);
			this._clearInvalidInputState();
		} else {
			this._markInputAsInvalid();
		}

	},

	/**
	 * Set selected date. Setter for <wp>value</wp> property
	 * @param {Date} value
	 */
	_setValue: function(value) {

		var year = value.getFullYear(),
			month = value.getMonth(),
			day = value.getDate(),
			new_time = Date.UTC(year, month, day); // normalize for selection

		this.set('_displayed_year', year);
		this.set('_displayed_month', month);

		this.set('_selection_start', new_time);
		this.set('_selection_end', new_time);

		this._set('value', value);

		this._refreshData();

	}

});

Lava.define(
'Lava.widget.Tooltip',
/**
 * Tooltip instance
 * @lends Lava.widget.Tooltip#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tooltip',

	_property_descriptors: {
		y: {type: 'Integer'},
		x: {type: 'Integer'},
		y_offset: {type: 'Integer'},
		x_offset: {type: 'Integer'},
		html: {type: 'String'},
		is_visible: {type: 'Boolean'}
	},

	_properties: {
		/** Vertical position of the tooltip */
		y: 0,
		/** Vertical position of the tooltip */
		x: 0,
		/** Vertical offset of the tooltip instance from cursor pointer */
		y_offset: -25,
		/** Horizontal tooltip offset */
		x_offset: 5,
		/** Tooltip's content */
		html: '',
		/** Is this tooltip instance visible */
		is_visible: false
	}

});
