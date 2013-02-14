/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/widget-buttons/widget-buttons.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-buttons/widget-buttons.js",
    code: []
};
_yuitest_coverage["build/widget-buttons/widget-buttons.js"].code=["YUI.add('widget-buttons', function (Y, NAME) {","","/**","Provides header/body/footer button support for Widgets that use the","`WidgetStdMod` extension.","","@module widget-buttons","@since 3.4.0","**/","","var YArray  = Y.Array,","    YLang   = Y.Lang,","    YObject = Y.Object,","","    ButtonPlugin = Y.Plugin.Button,","    Widget       = Y.Widget,","    WidgetStdMod = Y.WidgetStdMod,","","    getClassName = Y.ClassNameManager.getClassName,","    isArray      = YLang.isArray,","    isNumber     = YLang.isNumber,","    isString     = YLang.isString,","    isValue      = YLang.isValue;","","// Utility to determine if an object is a Y.Node instance, even if it was","// created in a different YUI sandbox.","function isNode(node) {","    return !!node.getDOMNode;","}","","/**","Provides header/body/footer button support for Widgets that use the","`WidgetStdMod` extension.","","This Widget extension makes it easy to declaratively configure a widget's","buttons. It adds a `buttons` attribute along with button- accessor and mutator","methods. All button nodes have the `Y.Plugin.Button` plugin applied.","","This extension also includes `HTML_PARSER` support to seed a widget's `buttons`","from those which already exist in its DOM.","","@class WidgetButtons","@extensionfor Widget","@since 3.4.0","**/","function WidgetButtons() {","    // Require `Y.WidgetStdMod`.","    if (!this._stdModNode) {","        Y.error('WidgetStdMod must be added to a Widget before WidgetButtons.');","    }","","    // Has to be setup before the `initializer()`.","    this._buttonsHandles = {};","}","","WidgetButtons.ATTRS = {","    /**","    Collection containing a widget's buttons.","","    The collection is an Object which contains an Array of `Y.Node`s for every","    `WidgetStdMod` section (header, body, footer) which has one or more buttons.","    All button nodes have the `Y.Plugin.Button` plugin applied.","","    This attribute is very flexible in the values it will accept. `buttons` can","    be specified as a single Array, or an Object of Arrays keyed to a particular","    section.","","    All specified values will be normalized to this type of structure:","","        {","            header: [...],","            footer: [...]","        }","","    A button can be specified as a `Y.Node`, config Object, or String name for a","    predefined button on the `BUTTONS` prototype property. When a config Object","    is provided, it will be merged with any defaults provided by a button with","    the same `name` defined on the `BUTTONS` property.","","    See `addButton()` for the detailed list of configuration properties.","","    For convenience, a widget's buttons will always persist and remain rendered","    after header/body/footer content updates. Buttons should be removed by","    updating this attribute or using the `removeButton()` method.","","    @example","        {","            // Uses predefined \"close\" button by string name.","            header: ['close'],","","            footer: [","                {","                    name  : 'cancel',","                    label : 'Cancel',","                    action: 'hide'","                },","","                {","                    name     : 'okay',","                    label    : 'Okay',","                    isDefault: true,","","                    events: {","                        click: function (e) {","                            this.hide();","                        }","                    }","                }","            ]","        }","","    @attribute buttons","    @type Object","    @default {}","    @since 3.4.0","    **/","    buttons: {","        getter: '_getButtons',","        setter: '_setButtons',","        value : {}","    },","","    /**","    The current default button as configured through this widget's `buttons`.","","    A button can be configured as the default button in the following ways:","","      * As a config Object with an `isDefault` property:","        `{label: 'Okay', isDefault: true}`.","","      * As a Node with a `data-default` attribute:","        `<button data-default=\"true\">Okay</button>`.","","    This attribute is **read-only**; anytime there are changes to this widget's","    `buttons`, the `defaultButton` will be updated if needed.","","    **Note:** If two or more buttons are configured to be the default button,","    the last one wins.","","    @attribute defaultButton","    @type Node","    @default null","    @readOnly","    @since 3.5.0","    **/","    defaultButton: {","        readOnly: true,","        value   : null","    }","};","","/**","CSS classes used by `WidgetButtons`.","","@property CLASS_NAMES","@type Object","@static","@since 3.5.0","**/","WidgetButtons.CLASS_NAMES = {","    button : getClassName('button'),","    buttons: Widget.getClassName('buttons'),","    primary: getClassName('button', 'primary')","};","","WidgetButtons.HTML_PARSER = {","    buttons: function (srcNode) {","        return this._parseButtons(srcNode);","    }","};","","/**","The list of button configuration properties which are specific to","`WidgetButtons` and should not be passed to `Y.Plugin.Button.createNode()`.","","@property NON_BUTTON_NODE_CFG","@type Array","@static","@since 3.5.0","**/","WidgetButtons.NON_BUTTON_NODE_CFG = [","    'action', 'classNames', 'context', 'events', 'isDefault', 'section'","];","","WidgetButtons.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Collection of predefined buttons mapped by name -> config.","","    These button configurations will serve as defaults for any button added to a","    widget's buttons which have the same `name`.","","    See `addButton()` for a list of possible configuration values.","","    @property BUTTONS","    @type Object","    @default {}","    @see addButton()","    @since 3.5.0","    **/","    BUTTONS: {},","","    /**","    The HTML template to use when creating the node which wraps all buttons of a","    section. By default it will have the CSS class: \"yui3-widget-buttons\".","","    @property BUTTONS_TEMPLATE","    @type String","    @default \"<span />\"","    @since 3.5.0","    **/","    BUTTONS_TEMPLATE: '<span />',","","    /**","    The default section to render buttons in when no section is specified.","","    @property DEFAULT_BUTTONS_SECTION","    @type String","    @default Y.WidgetStdMod.FOOTER","    @since 3.5.0","    **/","    DEFAULT_BUTTONS_SECTION: WidgetStdMod.FOOTER,","","    // -- Protected Properties -------------------------------------------------","","    /**","    A map of button node `_yuid` -> event-handle for all button nodes which were","    created by this widget.","","    @property _buttonsHandles","    @type Object","    @protected","    @since 3.5.0","    **/","","    /**","    A map of this widget's `buttons`, both name -> button and","    section:name -> button.","","    @property _buttonsMap","    @type Object","    @protected","    @since 3.5.0","    **/","","    /**","    Internal reference to this widget's default button.","","    @property _defaultButton","    @type Node","    @protected","    @since 3.5.0","    **/","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        // Creates button mappings and sets the `defaultButton`.","        this._mapButtons(this.get('buttons'));","        this._updateDefaultButton();","","        // Bound with `Y.bind()` to make more extensible.","        this.after({","            buttonsChange      : Y.bind('_afterButtonsChange', this),","            defaultButtonChange: Y.bind('_afterDefaultButtonChange', this)","        });","","        Y.after(this._bindUIButtons, this, 'bindUI');","        Y.after(this._syncUIButtons, this, 'syncUI');","    },","","    destructor: function () {","        // Detach all event subscriptions this widget added to its `buttons`.","        YObject.each(this._buttonsHandles, function (handle) {","            handle.detach();","        });","","        delete this._buttonsHandles;","        delete this._buttonsMap;","        delete this._defaultButton;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Adds a button to this widget.","","    The new button node will have the `Y.Plugin.Button` plugin applied, be added","    to this widget's `buttons`, and rendered in the specified `section` at the","    specified `index` (or end of the section when no `index` is provided). If","    the section does not exist, it will be created.","","    This fires the `buttonsChange` event and adds the following properties to","    the event facade:","","      * `button`: The button node or config object to add.","","      * `section`: The `WidgetStdMod` section (header/body/footer) where the","        button will be added.","","      * `index`: The index at which the button will be in the section.","","      * `src`: \"add\"","","    **Note:** The `index` argument will be passed to the Array `splice()`","    method, therefore a negative value will insert the `button` that many items","    from the end. The `index` property on the `buttonsChange` event facade is","    the index at which the `button` was added.","","    @method addButton","    @param {Node|Object|String} button The button to add. This can be a `Y.Node`","        instance, config Object, or String name for a predefined button on the","        `BUTTONS` prototype property. When a config Object is provided, it will","        be merged with any defaults provided by any `srcNode` and/or a button","        with the same `name` defined on the `BUTTONS` property. The following","        are the possible configuration properties beyond what Node plugins","        accept by default:","      @param {Function|String} [button.action] The default handler that should","        be called when the button is clicked. A String name of a Function that","        exists on the `context` object can also be provided. **Note:**","        Specifying a set of `events` will override this setting.","      @param {String|String[]} [button.classNames] Additional CSS classes to add","        to the button node.","      @param {Object} [button.context=this] Context which any `events` or","        `action` should be called with. Defaults to `this`, the widget.","        **Note:** `e.target` will access the button node in the event handlers.","      @param {Boolean} [button.disabled=false] Whether the button should be","        disabled.","      @param {String|Object} [button.events=\"click\"] Event name, or set of","        events and handlers to bind to the button node. **See:** `Y.Node.on()`,","        this value is passed as the first argument to `on()`.","      @param {Boolean} [button.isDefault=false] Whether the button is the","        default button.","      @param {String} [button.label] The visible text/value displayed in the","        button.","      @param {String} [button.name] A name which can later be used to reference","        this button. If a button is defined on the `BUTTONS` property with this","        same name, its configuration properties will be merged in as defaults.","      @param {String} [button.section] The `WidgetStdMod` section (header, body,","        footer) where the button should be added.","      @param {Node} [button.srcNode] An existing Node to use for the button,","        default values will be seeded from this node, but are overriden by any","        values specified in the config object. By default a new &lt;button&gt;","        node will be created.","      @param {String} [button.template] A specific template to use when creating","        a new button node (e.g. \"&lt;a /&gt;\"). **Note:** Specifying a `srcNode`","        will overide this.","    @param {String} [section=\"footer\"] The `WidgetStdMod` section","        (header/body/footer) where the button should be added. This takes","        precedence over the `button.section` configuration property.","    @param {Number} [index] The index at which the button should be inserted. If","        not specified, the button will be added to the end of the section. This","        value is passed to the Array `splice()` method, therefore a negative","        value will insert the `button` that many items from the end.","    @chainable","    @see Plugin.Button.createNode()","    @since 3.4.0","    **/","    addButton: function (button, section, index) {","        var buttons = this.get('buttons'),","            sectionButtons, atIndex;","","        // Makes sure we have the full config object.","        if (!isNode(button)) {","            button = this._mergeButtonConfig(button);","            section || (section = button.section);","        }","","        section || (section = this.DEFAULT_BUTTONS_SECTION);","        sectionButtons = buttons[section] || (buttons[section] = []);","        isNumber(index) || (index = sectionButtons.length);","","        // Insert new button at the correct position.","        sectionButtons.splice(index, 0, button);","","        // Determine the index at which the `button` now exists in the array.","        atIndex = YArray.indexOf(sectionButtons, button);","","        this.set('buttons', buttons, {","            button : button,","            section: section,","            index  : atIndex,","            src    : 'add'","        });","","        return this;","    },","","    /**","    Returns a button node from this widget's `buttons`.","","    @method getButton","    @param {Number|String} name The string name or index of the button.","    @param {String} [section=\"footer\"] The `WidgetStdMod` section","        (header/body/footer) where the button exists. Only applicable when","        looking for a button by numerical index, or by name but scoped to a","        particular section.","    @return {Node} The button node.","    @since 3.5.0","    **/","    getButton: function (name, section) {","        if (!isValue(name)) { return; }","","        var map = this._buttonsMap,","            buttons;","","        section || (section = this.DEFAULT_BUTTONS_SECTION);","","        // Supports `getButton(1, 'header')` signature.","        if (isNumber(name)) {","            buttons = this.get('buttons');","            return buttons[section] && buttons[section][name];","        }","","        // Looks up button by name or section:name.","        return arguments.length > 1 ? map[section + ':' + name] : map[name];","    },","","    /**","    Removes a button from this widget.","","    The button will be removed from this widget's `buttons` and its DOM. Any","    event subscriptions on the button which were created by this widget will be","    detached. If the content section becomes empty after removing the button","    node, then the section will also be removed.","","    This fires the `buttonsChange` event and adds the following properties to","    the event facade:","","      * `button`: The button node to remove.","","      * `section`: The `WidgetStdMod` section (header/body/footer) where the","        button should be removed from.","","      * `index`: The index at which the button exists in the section.","","      * `src`: \"remove\"","","    @method removeButton","    @param {Node|Number|String} button The button to remove. This can be a","        `Y.Node` instance, index, or String name of a button.","    @param {String} [section=\"footer\"] The `WidgetStdMod` section","        (header/body/footer) where the button exists. Only applicable when","        removing a button by numerical index, or by name but scoped to a","        particular section.","    @chainable","    @since 3.5.0","    **/","    removeButton: function (button, section) {","        if (!isValue(button)) { return this; }","","        var buttons = this.get('buttons'),","            index;","","        // Shortcut if `button` is already an index which is needed for slicing.","        if (isNumber(button)) {","            section || (section = this.DEFAULT_BUTTONS_SECTION);","            index  = button;","            button = buttons[section][index];","        } else {","            // Supports `button` being the string name.","            if (isString(button)) {","                // `getButton()` is called this way because its behavior is","                // different based on the number of arguments.","                button = this.getButton.apply(this, arguments);","            }","","            // Determines the `section` and `index` at which the button exists.","            YObject.some(buttons, function (sectionButtons, currentSection) {","                index = YArray.indexOf(sectionButtons, button);","","                if (index > -1) {","                    section = currentSection;","                    return true;","                }","            });","        }","","        // Button was found at an appropriate index.","        if (button && index > -1) {","            // Remove button from `section` array.","            buttons[section].splice(index, 1);","","            this.set('buttons', buttons, {","                button : button,","                section: section,","                index  : index,","                src    : 'remove'","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Binds UI event listeners. This method is inserted via AOP, and will execute","    after `bindUI()`.","","    @method _bindUIButtons","    @protected","    @since 3.4.0","    **/","    _bindUIButtons: function () {","        // Event handlers are bound with `bind()` to make them more extensible.","        var afterContentChange = Y.bind('_afterContentChangeButtons', this);","","        this.after({","            visibleChange      : Y.bind('_afterVisibleChangeButtons', this),","            headerContentChange: afterContentChange,","            bodyContentChange  : afterContentChange,","            footerContentChange: afterContentChange","        });","    },","","    /**","    Returns a button node based on the specified `button` node or configuration.","","    The button node will either be created via `Y.Plugin.Button.createNode()`,","    or when `button` is specified as a node already, it will by `plug()`ed with","    `Y.Plugin.Button`.","","    @method _createButton","    @param {Node|Object} button Button node or configuration object.","    @return {Node} The button node.","    @protected","    @since 3.5.0","    **/","    _createButton: function (button) {","        var config, buttonConfig, nonButtonNodeCfg,","            i, len, action, context, handle;","","        // Makes sure the exiting `Y.Node` instance is from this YUI sandbox and","        // is plugged with `Y.Plugin.Button`.","        if (isNode(button)) {","            return Y.one(button.getDOMNode()).plug(ButtonPlugin);","        }","","        // Merge `button` config with defaults and back-compat.","        config = Y.merge({","            context: this,","            events : 'click',","            label  : button.value","        }, button);","","        buttonConfig     = Y.merge(config);","        nonButtonNodeCfg = WidgetButtons.NON_BUTTON_NODE_CFG;","","        // Remove all non-button Node config props.","        for (i = 0, len = nonButtonNodeCfg.length; i < len; i += 1) {","            delete buttonConfig[nonButtonNodeCfg[i]];","        }","","        // Create the button node using the button Node-only config.","        button = ButtonPlugin.createNode(buttonConfig);","","        context = config.context;","        action  = config.action;","","        // Supports `action` as a String name of a Function on the `context`","        // object.","        if (isString(action)) {","            action = Y.bind(action, context);","        }","","        // Supports all types of crazy configs for event subscriptions and","        // stores a reference to the returned `EventHandle`.","        handle = button.on(config.events, action, context);","        this._buttonsHandles[Y.stamp(button, true)] = handle;","","        // Tags the button with the configured `name` and `isDefault` settings.","        button.setData('name', this._getButtonName(config));","        button.setData('default', this._getButtonDefault(config));","","        // Add any CSS classnames to the button node.","        YArray.each(YArray(config.classNames), button.addClass, button);","","        return button;","    },","","    /**","    Returns the buttons container for the specified `section`, passing a truthy","    value for `create` will create the node if it does not already exist.","","    **Note:** It is up to the caller to properly insert the returned container","    node into the content section.","","    @method _getButtonContainer","    @param {String} section The `WidgetStdMod` section (header/body/footer).","    @param {Boolean} create Whether the buttons container should be created if","        it does not already exist.","    @return {Node} The buttons container node for the specified `section`.","    @protected","    @see BUTTONS_TEMPLATE","    @since 3.5.0","    **/","    _getButtonContainer: function (section, create) {","        var sectionClassName = WidgetStdMod.SECTION_CLASS_NAMES[section],","            buttonsClassName = WidgetButtons.CLASS_NAMES.buttons,","            contentBox       = this.get('contentBox'),","            containerSelector, container;","","        // Search for an existing buttons container within the section.","        containerSelector = '.' + sectionClassName + ' .' + buttonsClassName;","        container         = contentBox.one(containerSelector);","","        // Create the `container` if it doesn't already exist.","        if (!container && create) {","            container = Y.Node.create(this.BUTTONS_TEMPLATE);","            container.addClass(buttonsClassName);","        }","","        return container;","    },","","    /**","    Returns whether or not the specified `button` is configured to be the","    default button.","","    When a button node is specified, the button's `getData()` method will be","    used to determine if the button is configured to be the default. When a","    button config object is specified, the `isDefault` prop will determine","    whether the button is the default.","","    **Note:** `<button data-default=\"true\"></button>` is supported via the","    `button.getData('default')` API call.","","    @method _getButtonDefault","    @param {Node|Object} button The button node or configuration object.","    @return {Boolean} Whether the button is configured to be the default button.","    @protected","    @since 3.5.0","    **/","    _getButtonDefault: function (button) {","        var isDefault = isNode(button) ?","                button.getData('default') : button.isDefault;","","        if (isString(isDefault)) {","            return isDefault.toLowerCase() === 'true';","        }","","        return !!isDefault;","    },","","    /**","    Returns the name of the specified `button`.","","    When a button node is specified, the button's `getData('name')` method is","    preferred, but will fallback to `get('name')`, and the result will determine","    the button's name. When a button config object is specified, the `name` prop","    will determine the button's name.","","    **Note:** `<button data-name=\"foo\"></button>` is supported via the","    `button.getData('name')` API call.","","    @method _getButtonName","    @param {Node|Object} button The button node or configuration object.","    @return {String} The name of the button.","    @protected","    @since 3.5.0","    **/","    _getButtonName: function (button) {","        var name;","","        if (isNode(button)) {","            name = button.getData('name') || button.get('name');","        } else {","            name = button && (button.name || button.type);","        }","","        return name;","    },","","    /**","    Getter for the `buttons` attribute. A copy of the `buttons` object is","    returned so the stored state cannot be modified by the callers of","    `get('buttons')`.","","    This will recreate a copy of the `buttons` object, and each section array","    (the button nodes are *not* copied/cloned.)","","    @method _getButtons","    @param {Object} buttons The widget's current `buttons` state.","    @return {Object} A copy of the widget's current `buttons` state.","    @protected","    @since 3.5.0","    **/","    _getButtons: function (buttons) {","        var buttonsCopy = {};","","        // Creates a new copy of the `buttons` object.","        YObject.each(buttons, function (sectionButtons, section) {","            // Creates of copy of the array of button nodes.","            buttonsCopy[section] = sectionButtons.concat();","        });","","        return buttonsCopy;","    },","","    /**","    Adds the specified `button` to the buttons map (both name -> button and","    section:name -> button), and sets the button as the default if it is","    configured as the default button.","","    **Note:** If two or more buttons are configured with the same `name` and/or","    configured to be the default button, the last one wins.","","    @method _mapButton","    @param {Node} button The button node to map.","    @param {String} section The `WidgetStdMod` section (header/body/footer).","    @protected","    @since 3.5.0","    **/","    _mapButton: function (button, section) {","        var map       = this._buttonsMap,","            name      = this._getButtonName(button),","            isDefault = this._getButtonDefault(button);","","        if (name) {","            // name -> button","            map[name] = button;","","            // section:name -> button","            map[section + ':' + name] = button;","        }","","        isDefault && (this._defaultButton = button);","    },","","    /**","    Adds the specified `buttons` to the buttons map (both name -> button and","    section:name -> button), and set the a button as the default if one is","    configured as the default button.","","    **Note:** This will clear all previous button mappings and null-out any","    previous default button! If two or more buttons are configured with the same","    `name` and/or configured to be the default button, the last one wins.","","    @method _mapButtons","    @param {Node[]} buttons The button nodes to map.","    @protected","    @since 3.5.0","    **/","    _mapButtons: function (buttons) {","        this._buttonsMap    = {};","        this._defaultButton = null;","","        YObject.each(buttons, function (sectionButtons, section) {","            var i, len;","","            for (i = 0, len = sectionButtons.length; i < len; i += 1) {","                this._mapButton(sectionButtons[i], section);","            }","        }, this);","    },","","    /**","    Returns a copy of the specified `config` object merged with any defaults","    provided by a `srcNode` and/or a predefined configuration for a button","    with the same `name` on the `BUTTONS` property.","","    @method _mergeButtonConfig","    @param {Object|String} config Button configuration object, or string name.","    @return {Object} A copy of the button configuration object merged with any","        defaults.","    @protected","    @since 3.5.0","    **/","    _mergeButtonConfig: function (config) {","        var buttonConfig, defConfig, name, button, tagName, label;","","        // Makes sure `config` is an Object and a copy of the specified value.","        config = isString(config) ? {name: config} : Y.merge(config);","","        // Seeds default values from the button node, if there is one.","        if (config.srcNode) {","            button  = config.srcNode;","            tagName = button.get('tagName').toLowerCase();","            label   = button.get(tagName === 'input' ? 'value' : 'text');","","            // Makes sure the button's current values override any defaults.","            buttonConfig = {","                disabled : !!button.get('disabled'),","                isDefault: this._getButtonDefault(button),","                name     : this._getButtonName(button)","            };","","            // Label should only be considered when not an empty string.","            label && (buttonConfig.label = label);","","            // Merge `config` with `buttonConfig` values.","            Y.mix(config, buttonConfig, false, null, 0, true);","        }","","        name      = this._getButtonName(config);","        defConfig = this.BUTTONS && this.BUTTONS[name];","","        // Merge `config` with predefined default values.","        if (defConfig) {","            Y.mix(config, defConfig, false, null, 0, true);","        }","","        return config;","    },","","    /**","    `HTML_PARSER` implementation for the `buttons` attribute.","","    **Note:** To determine a button node's name its `data-name` and `name`","    attributes are examined. Whether the button should be the default is","    determined by its `data-default` attribute.","","    @method _parseButtons","    @param {Node} srcNode This widget's srcNode to search for buttons.","    @return {null|Object} `buttons` Config object parsed from this widget's DOM.","    @protected","    @since 3.5.0","    **/","    _parseButtons: function (srcNode) {","        var buttonSelector = '.' + WidgetButtons.CLASS_NAMES.button,","            sections       = ['header', 'body', 'footer'],","            buttonsConfig  = null;","","        YArray.each(sections, function (section) {","            var container = this._getButtonContainer(section),","                buttons   = container && container.all(buttonSelector),","                sectionButtons;","","            if (!buttons || buttons.isEmpty()) { return; }","","            sectionButtons = [];","","            // Creates a button config object for every button node found and","            // adds it to the section. This way each button configuration can be","            // merged with any defaults provided by predefined `BUTTONS`.","            buttons.each(function (button) {","                sectionButtons.push({srcNode: button});","            });","","            buttonsConfig || (buttonsConfig = {});","            buttonsConfig[section] = sectionButtons;","        }, this);","","        return buttonsConfig;","    },","","    /**","    Setter for the `buttons` attribute. This processes the specified `config`","    and returns a new `buttons` object which is stored as the new state; leaving","    the original, specified `config` unmodified.","","    The button nodes will either be created via `Y.Plugin.Button.createNode()`,","    or when a button is already a Node already, it will by `plug()`ed with","    `Y.Plugin.Button`.","","    @method _setButtons","    @param {Array|Object} config The `buttons` configuration to process.","    @return {Object} The processed `buttons` object which represents the new","        state.","    @protected","    @since 3.5.0","    **/","    _setButtons: function (config) {","        var defSection = this.DEFAULT_BUTTONS_SECTION,","            buttons    = {};","","        function processButtons(buttonConfigs, currentSection) {","            if (!isArray(buttonConfigs)) { return; }","","            var i, len, button, section;","","            for (i = 0, len = buttonConfigs.length; i < len; i += 1) {","                button  = buttonConfigs[i];","                section = currentSection;","","                if (!isNode(button)) {","                    button = this._mergeButtonConfig(button);","                    section || (section = button.section);","                }","","                // Always passes through `_createButton()` to make sure the node","                // is decorated as a button.","                button = this._createButton(button);","","                // Use provided `section` or fallback to the default section.","                section || (section = defSection);","","                // Add button to the array of buttons for the specified section.","                (buttons[section] || (buttons[section] = [])).push(button);","            }","        }","","        // Handle `config` being either an Array or Object of Arrays.","        if (isArray(config)) {","            processButtons.call(this, config);","        } else {","            YObject.each(config, processButtons, this);","        }","","        return buttons;","    },","","    /**","    Syncs this widget's current button-related state to its DOM. This method is","    inserted via AOP, and will execute after `syncUI()`.","","    @method _syncUIButtons","    @protected","    @since 3.4.0","    **/","    _syncUIButtons: function () {","        this._uiSetButtons(this.get('buttons'));","        this._uiSetDefaultButton(this.get('defaultButton'));","        this._uiSetVisibleButtons(this.get('visible'));","    },","","    /**","    Inserts the specified `button` node into this widget's DOM at the specified","    `section` and `index` and updates the section content.","","    The section and button container nodes will be created if they do not","    already exist.","","    @method _uiInsertButton","    @param {Node} button The button node to insert into this widget's DOM.","    @param {String} section The `WidgetStdMod` section (header/body/footer).","    @param {Number} index Index at which the `button` should be positioned.","    @protected","    @since 3.5.0","    **/","    _uiInsertButton: function (button, section, index) {","        var buttonsClassName = WidgetButtons.CLASS_NAMES.button,","            buttonContainer  = this._getButtonContainer(section, true),","            sectionButtons   = buttonContainer.all('.' + buttonsClassName);","","        // Inserts the button node at the correct index.","        buttonContainer.insertBefore(button, sectionButtons.item(index));","","        // Adds the button container to the section content.","        this.setStdModContent(section, buttonContainer, 'after');","    },","","    /**","    Removes the button node from this widget's DOM and detaches any event","    subscriptions on the button that were created by this widget. The section","    content will be updated unless `{preserveContent: true}` is passed in the","    `options`.","","    By default the button container node will be removed when this removes the","    last button of the specified `section`; and if no other content remains in","    the section node, it will also be removed.","","    @method _uiRemoveButton","    @param {Node} button The button to remove and destroy.","    @param {String} section The `WidgetStdMod` section (header/body/footer).","    @param {Object} [options] Additional options.","      @param {Boolean} [options.preserveContent=false] Whether the section","        content should be updated.","    @protected","    @since 3.5.0","    **/","    _uiRemoveButton: function (button, section, options) {","        var yuid    = Y.stamp(button, this),","            handles = this._buttonsHandles,","            handle  = handles[yuid],","            buttonContainer, buttonClassName;","","        if (handle) {","            handle.detach();","        }","","        delete handles[yuid];","","        button.remove();","","        options || (options = {});","","        // Remove the button container and section nodes if needed.","        if (!options.preserveContent) {","            buttonContainer = this._getButtonContainer(section);","            buttonClassName = WidgetButtons.CLASS_NAMES.button;","","            // Only matters if we have a button container which is empty.","            if (buttonContainer &&","                    buttonContainer.all('.' + buttonClassName).isEmpty()) {","","                buttonContainer.remove();","                this._updateContentButtons(section);","            }","        }","    },","","    /**","    Sets the current `buttons` state to this widget's DOM by rendering the","    specified collection of `buttons` and updates the contents of each section","    as needed.","","    Button nodes which already exist in the DOM will remain intact, or will be","    moved if they should be in a new position. Old button nodes which are no","    longer represented in the specified `buttons` collection will be removed,","    and any event subscriptions on the button which were created by this widget","    will be detached.","","    If the button nodes in this widget's DOM actually change, then each content","    section will be updated (or removed) appropriately.","","    @method _uiSetButtons","    @param {Object} buttons The current `buttons` state to visually represent.","    @protected","    @since 3.5.0","    **/","    _uiSetButtons: function (buttons) {","        var buttonClassName = WidgetButtons.CLASS_NAMES.button,","            sections        = ['header', 'body', 'footer'];","","        YArray.each(sections, function (section) {","            var sectionButtons  = buttons[section] || [],","                numButtons      = sectionButtons.length,","                buttonContainer = this._getButtonContainer(section, numButtons),","                buttonsUpdated  = false,","                oldNodes, i, button, buttonIndex;","","            // When there's no button container, there are no new buttons or old","            // buttons that we have to deal with for this section.","            if (!buttonContainer) { return; }","","            oldNodes = buttonContainer.all('.' + buttonClassName);","","            for (i = 0; i < numButtons; i += 1) {","                button      = sectionButtons[i];","                buttonIndex = oldNodes.indexOf(button);","","                // Buttons already rendered in the Widget should remain there or","                // moved to their new index. New buttons will be added to the","                // current `buttonContainer`.","                if (buttonIndex > -1) {","                    // Remove button from existing buttons nodeList since its in","                    // the DOM already.","                    oldNodes.splice(buttonIndex, 1);","","                    // Check that the button is at the right position, if not,","                    // move it to its new position.","                    if (buttonIndex !== i) {","                        // Using `i + 1` because the button should be at index","                        // `i`; it's inserted before the node which comes after.","                        buttonContainer.insertBefore(button, i + 1);","                        buttonsUpdated = true;","                    }","                } else {","                    buttonContainer.appendChild(button);","                    buttonsUpdated = true;","                }","            }","","            // Safely removes the old button nodes which are no longer part of","            // this widget's `buttons`.","            oldNodes.each(function (button) {","                this._uiRemoveButton(button, section, {preserveContent: true});","                buttonsUpdated = true;","            }, this);","","            // Remove leftover empty button containers and updated the StdMod","            // content area.","            if (numButtons === 0) {","                buttonContainer.remove();","                this._updateContentButtons(section);","                return;","            }","","            // Adds the button container to the section content.","            if (buttonsUpdated) {","                this.setStdModContent(section, buttonContainer, 'after');","            }","        }, this);","    },","","    /**","    Adds the \"yui3-button-primary\" CSS class to the new `defaultButton` and","    removes it from the old default button.","","    @method _uiSetDefaultButton","    @param {Node} newButton The new `defaultButton`.","    @param {Node} oldButton The old `defaultButton`.","    @protected","    @since 3.5.0","    **/","    _uiSetDefaultButton: function (newButton, oldButton) {","        var primaryClassName = WidgetButtons.CLASS_NAMES.primary;","","        if (newButton) { newButton.addClass(primaryClassName); }","        if (oldButton) { oldButton.removeClass(primaryClassName); }","    },","","    /**","    Focuses this widget's `defaultButton` if there is one and this widget is","    visible.","","    @method _uiSetVisibleButtons","    @param {Boolean} visible Whether this widget is visible.","    @protected","    @since 3.5.0","    **/","    _uiSetVisibleButtons: function (visible) {","        if (!visible) { return; }","","        var defaultButton = this.get('defaultButton');","        if (defaultButton) {","            defaultButton.focus();","        }","    },","","    /**","    Removes the specified `button` from the buttons map (both name -> button and","    section:name -> button), and nulls-out the `defaultButton` if it is","    currently the default button.","","    @method _unMapButton","    @param {Node} button The button node to remove from the buttons map.","    @param {String} section The `WidgetStdMod` section (header/body/footer).","    @protected","    @since 3.5.0","    **/","    _unMapButton: function (button, section) {","        var map  = this._buttonsMap,","            name = this._getButtonName(button),","            sectionName;","","        // Only delete the map entry if the specified `button` is mapped to it.","        if (name) {","            // name -> button","            if (map[name] === button) {","                delete map[name];","            }","","            // section:name -> button","            sectionName = section + ':' + name;","            if (map[sectionName] === button) {","                delete map[sectionName];","            }","        }","","        // Clear the default button if its the specified `button`.","        if (this._defaultButton === button) {","            this._defaultButton = null;","        }","    },","","    /**","    Updates the `defaultButton` attribute if it needs to be updated by comparing","    its current value with the protected `_defaultButton` property.","","    @method _updateDefaultButton","    @protected","    @since 3.5.0","    **/","    _updateDefaultButton: function () {","        var defaultButton = this._defaultButton;","","        if (this.get('defaultButton') !== defaultButton) {","            this._set('defaultButton', defaultButton);","        }","    },","","    /**","    Updates the content attribute which corresponds to the specified `section`.","","    The method updates the section's content to its current `childNodes`","    (text and/or HTMLElement), or will null-out its contents if the section is","    empty. It also specifies a `src` of `buttons` on the change event facade.","","    @method _updateContentButtons","    @param {String} section The `WidgetStdMod` section (header/body/footer) to","        update.","    @protected","    @since 3.5.0","    **/","    _updateContentButtons: function (section) {","        // `childNodes` return text nodes and HTMLElements.","        var sectionContent = this.getStdModNode(section).get('childNodes');","","        // Updates the section to its current contents, or null if it is empty.","        this.set(section + 'Content', sectionContent.isEmpty() ? null :","            sectionContent, {src: 'buttons'});","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles this widget's `buttonsChange` event which fires anytime the","    `buttons` attribute is modified.","","    **Note:** This method special-cases the `buttons` modifications caused by","    `addButton()` and `removeButton()`, both of which set the `src` property on","    the event facade to \"add\" and \"remove\" respectively.","","    @method _afterButtonsChange","    @param {EventFacade} e","    @protected","    @since 3.4.0","    **/","    _afterButtonsChange: function (e) {","        var buttons = e.newVal,","            section = e.section,","            index   = e.index,","            src     = e.src,","            button;","","        // Special cases `addButton()` to only set and insert the new button.","        if (src === 'add') {","            // Make sure we have the button node.","            button = buttons[section][index];","","            this._mapButton(button, section);","            this._updateDefaultButton();","            this._uiInsertButton(button, section, index);","","            return;","        }","","        // Special cases `removeButton()` to only remove the specified button.","        if (src === 'remove') {","            // Button node already exists on the event facade.","            button = e.button;","","            this._unMapButton(button, section);","            this._updateDefaultButton();","            this._uiRemoveButton(button, section);","","            return;","        }","","        this._mapButtons(buttons);","        this._updateDefaultButton();","        this._uiSetButtons(buttons);","    },","","    /**","    Handles this widget's `headerContentChange`, `bodyContentChange`,","    `footerContentChange` events by making sure the `buttons` remain rendered","    after changes to the content areas.","","    These events are very chatty, so extra caution is taken to avoid doing extra","    work or getting into an infinite loop.","","    @method _afterContentChangeButtons","    @param {EventFacade} e","    @protected","    @since 3.5.0","    **/","    _afterContentChangeButtons: function (e) {","        var src     = e.src,","            pos     = e.stdModPosition,","            replace = !pos || pos === WidgetStdMod.REPLACE;","","        // Only do work when absolutely necessary.","        if (replace && src !== 'buttons' && src !== Widget.UI_SRC) {","            this._uiSetButtons(this.get('buttons'));","        }","    },","","    /**","    Handles this widget's `defaultButtonChange` event by adding the","    \"yui3-button-primary\" CSS class to the new `defaultButton` and removing it","    from the old default button.","","    @method _afterDefaultButtonChange","    @param {EventFacade} e","    @protected","    @since 3.5.0","    **/","    _afterDefaultButtonChange: function (e) {","        this._uiSetDefaultButton(e.newVal, e.prevVal);","    },","","    /**","    Handles this widget's `visibleChange` event by focusing the `defaultButton`","    if there is one.","","    @method _afterVisibleChangeButtons","    @param {EventFacade} e","    @protected","    @since 3.5.0","    **/","    _afterVisibleChangeButtons: function (e) {","        this._uiSetVisibleButtons(e.newVal);","    }","};","","Y.WidgetButtons = WidgetButtons;","","","}, '3.7.3', {\"requires\": [\"button-plugin\", \"cssbutton\", \"widget-stdmod\"]});"];
_yuitest_coverage["build/widget-buttons/widget-buttons.js"].lines = {"1":0,"11":0,"27":0,"28":0,"46":0,"48":0,"49":0,"53":0,"56":0,"160":0,"166":0,"168":0,"181":0,"185":0,"260":0,"261":0,"264":0,"269":0,"270":0,"275":0,"276":0,"279":0,"280":0,"281":0,"361":0,"365":0,"366":0,"367":0,"370":0,"371":0,"372":0,"375":0,"378":0,"380":0,"387":0,"403":0,"405":0,"408":0,"411":0,"412":0,"413":0,"417":0,"451":0,"453":0,"457":0,"458":0,"459":0,"460":0,"463":0,"466":0,"470":0,"471":0,"473":0,"474":0,"475":0,"481":0,"483":0,"485":0,"493":0,"508":0,"510":0,"532":0,"537":0,"538":0,"542":0,"548":0,"549":0,"552":0,"553":0,"557":0,"559":0,"560":0,"564":0,"565":0,"570":0,"571":0,"574":0,"575":0,"578":0,"580":0,"600":0,"606":0,"607":0,"610":0,"611":0,"612":0,"615":0,"637":0,"640":0,"641":0,"644":0,"665":0,"667":0,"668":0,"670":0,"673":0,"691":0,"694":0,"696":0,"699":0,"717":0,"721":0,"723":0,"726":0,"729":0,"747":0,"748":0,"750":0,"751":0,"753":0,"754":0,"772":0,"775":0,"778":0,"779":0,"780":0,"781":0,"784":0,"791":0,"794":0,"797":0,"798":0,"801":0,"802":0,"805":0,"822":0,"826":0,"827":0,"831":0,"833":0,"838":0,"839":0,"842":0,"843":0,"846":0,"866":0,"869":0,"870":0,"872":0,"874":0,"875":0,"876":0,"878":0,"879":0,"880":0,"885":0,"888":0,"891":0,"896":0,"897":0,"899":0,"902":0,"914":0,"915":0,"916":0,"934":0,"939":0,"942":0,"965":0,"970":0,"971":0,"974":0,"976":0,"978":0,"981":0,"982":0,"983":0,"986":0,"989":0,"990":0,"1015":0,"1018":0,"1019":0,"1027":0,"1029":0,"1031":0,"1032":0,"1033":0,"1038":0,"1041":0,"1045":0,"1048":0,"1049":0,"1052":0,"1053":0,"1059":0,"1060":0,"1061":0,"1066":0,"1067":0,"1068":0,"1069":0,"1073":0,"1074":0,"1090":0,"1092":0,"1093":0,"1106":0,"1108":0,"1109":0,"1110":0,"1126":0,"1131":0,"1133":0,"1134":0,"1138":0,"1139":0,"1140":0,"1145":0,"1146":0,"1159":0,"1161":0,"1162":0,"1181":0,"1184":0,"1204":0,"1211":0,"1213":0,"1215":0,"1216":0,"1217":0,"1219":0,"1223":0,"1225":0,"1227":0,"1228":0,"1229":0,"1231":0,"1234":0,"1235":0,"1236":0,"1253":0,"1258":0,"1259":0,"1274":0,"1287":0,"1291":0};
_yuitest_coverage["build/widget-buttons/widget-buttons.js"].functions = {"isNode:27":0,"WidgetButtons:46":0,"buttons:167":0,"initializer:258":0,"(anonymous 2):275":0,"destructor:273":0,"addButton:360":0,"getButton:402":0,"(anonymous 3):470":0,"removeButton:450":0,"_bindUIButtons:506":0,"_createButton:531":0,"_getButtonContainer:599":0,"_getButtonDefault:636":0,"_getButtonName:664":0,"(anonymous 4):694":0,"_getButtons:690":0,"_mapButton:716":0,"(anonymous 5):750":0,"_mapButtons:746":0,"_mergeButtonConfig:771":0,"(anonymous 7):838":0,"(anonymous 6):826":0,"_parseButtons:821":0,"processButtons:869":0,"_setButtons:865":0,"_syncUIButtons:913":0,"_uiInsertButton:933":0,"_uiRemoveButton:964":0,"(anonymous 9):1059":0,"(anonymous 8):1018":0,"_uiSetButtons:1014":0,"_uiSetDefaultButton:1089":0,"_uiSetVisibleButtons:1105":0,"_unMapButton:1125":0,"_updateDefaultButton:1158":0,"_updateContentButtons:1179":0,"_afterButtonsChange:1203":0,"_afterContentChangeButtons:1252":0,"_afterDefaultButtonChange:1273":0,"_afterVisibleChangeButtons:1286":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-buttons/widget-buttons.js"].coveredLines = 237;
_yuitest_coverage["build/widget-buttons/widget-buttons.js"].coveredFunctions = 42;
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1);
YUI.add('widget-buttons', function (Y, NAME) {

/**
Provides header/body/footer button support for Widgets that use the
`WidgetStdMod` extension.

@module widget-buttons
@since 3.4.0
**/

_yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 11);
var YArray  = Y.Array,
    YLang   = Y.Lang,
    YObject = Y.Object,

    ButtonPlugin = Y.Plugin.Button,
    Widget       = Y.Widget,
    WidgetStdMod = Y.WidgetStdMod,

    getClassName = Y.ClassNameManager.getClassName,
    isArray      = YLang.isArray,
    isNumber     = YLang.isNumber,
    isString     = YLang.isString,
    isValue      = YLang.isValue;

// Utility to determine if an object is a Y.Node instance, even if it was
// created in a different YUI sandbox.
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 27);
function isNode(node) {
    _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "isNode", 27);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 28);
return !!node.getDOMNode;
}

/**
Provides header/body/footer button support for Widgets that use the
`WidgetStdMod` extension.

This Widget extension makes it easy to declaratively configure a widget's
buttons. It adds a `buttons` attribute along with button- accessor and mutator
methods. All button nodes have the `Y.Plugin.Button` plugin applied.

This extension also includes `HTML_PARSER` support to seed a widget's `buttons`
from those which already exist in its DOM.

@class WidgetButtons
@extensionfor Widget
@since 3.4.0
**/
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 46);
function WidgetButtons() {
    // Require `Y.WidgetStdMod`.
    _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "WidgetButtons", 46);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 48);
if (!this._stdModNode) {
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 49);
Y.error('WidgetStdMod must be added to a Widget before WidgetButtons.');
    }

    // Has to be setup before the `initializer()`.
    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 53);
this._buttonsHandles = {};
}

_yuitest_coverline("build/widget-buttons/widget-buttons.js", 56);
WidgetButtons.ATTRS = {
    /**
    Collection containing a widget's buttons.

    The collection is an Object which contains an Array of `Y.Node`s for every
    `WidgetStdMod` section (header, body, footer) which has one or more buttons.
    All button nodes have the `Y.Plugin.Button` plugin applied.

    This attribute is very flexible in the values it will accept. `buttons` can
    be specified as a single Array, or an Object of Arrays keyed to a particular
    section.

    All specified values will be normalized to this type of structure:

        {
            header: [...],
            footer: [...]
        }

    A button can be specified as a `Y.Node`, config Object, or String name for a
    predefined button on the `BUTTONS` prototype property. When a config Object
    is provided, it will be merged with any defaults provided by a button with
    the same `name` defined on the `BUTTONS` property.

    See `addButton()` for the detailed list of configuration properties.

    For convenience, a widget's buttons will always persist and remain rendered
    after header/body/footer content updates. Buttons should be removed by
    updating this attribute or using the `removeButton()` method.

    @example
        {
            // Uses predefined "close" button by string name.
            header: ['close'],

            footer: [
                {
                    name  : 'cancel',
                    label : 'Cancel',
                    action: 'hide'
                },

                {
                    name     : 'okay',
                    label    : 'Okay',
                    isDefault: true,

                    events: {
                        click: function (e) {
                            this.hide();
                        }
                    }
                }
            ]
        }

    @attribute buttons
    @type Object
    @default {}
    @since 3.4.0
    **/
    buttons: {
        getter: '_getButtons',
        setter: '_setButtons',
        value : {}
    },

    /**
    The current default button as configured through this widget's `buttons`.

    A button can be configured as the default button in the following ways:

      * As a config Object with an `isDefault` property:
        `{label: 'Okay', isDefault: true}`.

      * As a Node with a `data-default` attribute:
        `<button data-default="true">Okay</button>`.

    This attribute is **read-only**; anytime there are changes to this widget's
    `buttons`, the `defaultButton` will be updated if needed.

    **Note:** If two or more buttons are configured to be the default button,
    the last one wins.

    @attribute defaultButton
    @type Node
    @default null
    @readOnly
    @since 3.5.0
    **/
    defaultButton: {
        readOnly: true,
        value   : null
    }
};

/**
CSS classes used by `WidgetButtons`.

@property CLASS_NAMES
@type Object
@static
@since 3.5.0
**/
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 160);
WidgetButtons.CLASS_NAMES = {
    button : getClassName('button'),
    buttons: Widget.getClassName('buttons'),
    primary: getClassName('button', 'primary')
};

_yuitest_coverline("build/widget-buttons/widget-buttons.js", 166);
WidgetButtons.HTML_PARSER = {
    buttons: function (srcNode) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "buttons", 167);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 168);
return this._parseButtons(srcNode);
    }
};

/**
The list of button configuration properties which are specific to
`WidgetButtons` and should not be passed to `Y.Plugin.Button.createNode()`.

@property NON_BUTTON_NODE_CFG
@type Array
@static
@since 3.5.0
**/
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 181);
WidgetButtons.NON_BUTTON_NODE_CFG = [
    'action', 'classNames', 'context', 'events', 'isDefault', 'section'
];

_yuitest_coverline("build/widget-buttons/widget-buttons.js", 185);
WidgetButtons.prototype = {
    // -- Public Properties ----------------------------------------------------

    /**
    Collection of predefined buttons mapped by name -> config.

    These button configurations will serve as defaults for any button added to a
    widget's buttons which have the same `name`.

    See `addButton()` for a list of possible configuration values.

    @property BUTTONS
    @type Object
    @default {}
    @see addButton()
    @since 3.5.0
    **/
    BUTTONS: {},

    /**
    The HTML template to use when creating the node which wraps all buttons of a
    section. By default it will have the CSS class: "yui3-widget-buttons".

    @property BUTTONS_TEMPLATE
    @type String
    @default "<span />"
    @since 3.5.0
    **/
    BUTTONS_TEMPLATE: '<span />',

    /**
    The default section to render buttons in when no section is specified.

    @property DEFAULT_BUTTONS_SECTION
    @type String
    @default Y.WidgetStdMod.FOOTER
    @since 3.5.0
    **/
    DEFAULT_BUTTONS_SECTION: WidgetStdMod.FOOTER,

    // -- Protected Properties -------------------------------------------------

    /**
    A map of button node `_yuid` -> event-handle for all button nodes which were
    created by this widget.

    @property _buttonsHandles
    @type Object
    @protected
    @since 3.5.0
    **/

    /**
    A map of this widget's `buttons`, both name -> button and
    section:name -> button.

    @property _buttonsMap
    @type Object
    @protected
    @since 3.5.0
    **/

    /**
    Internal reference to this widget's default button.

    @property _defaultButton
    @type Node
    @protected
    @since 3.5.0
    **/

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        // Creates button mappings and sets the `defaultButton`.
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "initializer", 258);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 260);
this._mapButtons(this.get('buttons'));
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 261);
this._updateDefaultButton();

        // Bound with `Y.bind()` to make more extensible.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 264);
this.after({
            buttonsChange      : Y.bind('_afterButtonsChange', this),
            defaultButtonChange: Y.bind('_afterDefaultButtonChange', this)
        });

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 269);
Y.after(this._bindUIButtons, this, 'bindUI');
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 270);
Y.after(this._syncUIButtons, this, 'syncUI');
    },

    destructor: function () {
        // Detach all event subscriptions this widget added to its `buttons`.
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "destructor", 273);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 275);
YObject.each(this._buttonsHandles, function (handle) {
            _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 2)", 275);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 276);
handle.detach();
        });

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 279);
delete this._buttonsHandles;
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 280);
delete this._buttonsMap;
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 281);
delete this._defaultButton;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Adds a button to this widget.

    The new button node will have the `Y.Plugin.Button` plugin applied, be added
    to this widget's `buttons`, and rendered in the specified `section` at the
    specified `index` (or end of the section when no `index` is provided). If
    the section does not exist, it will be created.

    This fires the `buttonsChange` event and adds the following properties to
    the event facade:

      * `button`: The button node or config object to add.

      * `section`: The `WidgetStdMod` section (header/body/footer) where the
        button will be added.

      * `index`: The index at which the button will be in the section.

      * `src`: "add"

    **Note:** The `index` argument will be passed to the Array `splice()`
    method, therefore a negative value will insert the `button` that many items
    from the end. The `index` property on the `buttonsChange` event facade is
    the index at which the `button` was added.

    @method addButton
    @param {Node|Object|String} button The button to add. This can be a `Y.Node`
        instance, config Object, or String name for a predefined button on the
        `BUTTONS` prototype property. When a config Object is provided, it will
        be merged with any defaults provided by any `srcNode` and/or a button
        with the same `name` defined on the `BUTTONS` property. The following
        are the possible configuration properties beyond what Node plugins
        accept by default:
      @param {Function|String} [button.action] The default handler that should
        be called when the button is clicked. A String name of a Function that
        exists on the `context` object can also be provided. **Note:**
        Specifying a set of `events` will override this setting.
      @param {String|String[]} [button.classNames] Additional CSS classes to add
        to the button node.
      @param {Object} [button.context=this] Context which any `events` or
        `action` should be called with. Defaults to `this`, the widget.
        **Note:** `e.target` will access the button node in the event handlers.
      @param {Boolean} [button.disabled=false] Whether the button should be
        disabled.
      @param {String|Object} [button.events="click"] Event name, or set of
        events and handlers to bind to the button node. **See:** `Y.Node.on()`,
        this value is passed as the first argument to `on()`.
      @param {Boolean} [button.isDefault=false] Whether the button is the
        default button.
      @param {String} [button.label] The visible text/value displayed in the
        button.
      @param {String} [button.name] A name which can later be used to reference
        this button. If a button is defined on the `BUTTONS` property with this
        same name, its configuration properties will be merged in as defaults.
      @param {String} [button.section] The `WidgetStdMod` section (header, body,
        footer) where the button should be added.
      @param {Node} [button.srcNode] An existing Node to use for the button,
        default values will be seeded from this node, but are overriden by any
        values specified in the config object. By default a new &lt;button&gt;
        node will be created.
      @param {String} [button.template] A specific template to use when creating
        a new button node (e.g. "&lt;a /&gt;"). **Note:** Specifying a `srcNode`
        will overide this.
    @param {String} [section="footer"] The `WidgetStdMod` section
        (header/body/footer) where the button should be added. This takes
        precedence over the `button.section` configuration property.
    @param {Number} [index] The index at which the button should be inserted. If
        not specified, the button will be added to the end of the section. This
        value is passed to the Array `splice()` method, therefore a negative
        value will insert the `button` that many items from the end.
    @chainable
    @see Plugin.Button.createNode()
    @since 3.4.0
    **/
    addButton: function (button, section, index) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "addButton", 360);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 361);
var buttons = this.get('buttons'),
            sectionButtons, atIndex;

        // Makes sure we have the full config object.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 365);
if (!isNode(button)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 366);
button = this._mergeButtonConfig(button);
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 367);
section || (section = button.section);
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 370);
section || (section = this.DEFAULT_BUTTONS_SECTION);
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 371);
sectionButtons = buttons[section] || (buttons[section] = []);
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 372);
isNumber(index) || (index = sectionButtons.length);

        // Insert new button at the correct position.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 375);
sectionButtons.splice(index, 0, button);

        // Determine the index at which the `button` now exists in the array.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 378);
atIndex = YArray.indexOf(sectionButtons, button);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 380);
this.set('buttons', buttons, {
            button : button,
            section: section,
            index  : atIndex,
            src    : 'add'
        });

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 387);
return this;
    },

    /**
    Returns a button node from this widget's `buttons`.

    @method getButton
    @param {Number|String} name The string name or index of the button.
    @param {String} [section="footer"] The `WidgetStdMod` section
        (header/body/footer) where the button exists. Only applicable when
        looking for a button by numerical index, or by name but scoped to a
        particular section.
    @return {Node} The button node.
    @since 3.5.0
    **/
    getButton: function (name, section) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "getButton", 402);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 403);
if (!isValue(name)) { return; }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 405);
var map = this._buttonsMap,
            buttons;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 408);
section || (section = this.DEFAULT_BUTTONS_SECTION);

        // Supports `getButton(1, 'header')` signature.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 411);
if (isNumber(name)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 412);
buttons = this.get('buttons');
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 413);
return buttons[section] && buttons[section][name];
        }

        // Looks up button by name or section:name.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 417);
return arguments.length > 1 ? map[section + ':' + name] : map[name];
    },

    /**
    Removes a button from this widget.

    The button will be removed from this widget's `buttons` and its DOM. Any
    event subscriptions on the button which were created by this widget will be
    detached. If the content section becomes empty after removing the button
    node, then the section will also be removed.

    This fires the `buttonsChange` event and adds the following properties to
    the event facade:

      * `button`: The button node to remove.

      * `section`: The `WidgetStdMod` section (header/body/footer) where the
        button should be removed from.

      * `index`: The index at which the button exists in the section.

      * `src`: "remove"

    @method removeButton
    @param {Node|Number|String} button The button to remove. This can be a
        `Y.Node` instance, index, or String name of a button.
    @param {String} [section="footer"] The `WidgetStdMod` section
        (header/body/footer) where the button exists. Only applicable when
        removing a button by numerical index, or by name but scoped to a
        particular section.
    @chainable
    @since 3.5.0
    **/
    removeButton: function (button, section) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "removeButton", 450);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 451);
if (!isValue(button)) { return this; }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 453);
var buttons = this.get('buttons'),
            index;

        // Shortcut if `button` is already an index which is needed for slicing.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 457);
if (isNumber(button)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 458);
section || (section = this.DEFAULT_BUTTONS_SECTION);
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 459);
index  = button;
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 460);
button = buttons[section][index];
        } else {
            // Supports `button` being the string name.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 463);
if (isString(button)) {
                // `getButton()` is called this way because its behavior is
                // different based on the number of arguments.
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 466);
button = this.getButton.apply(this, arguments);
            }

            // Determines the `section` and `index` at which the button exists.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 470);
YObject.some(buttons, function (sectionButtons, currentSection) {
                _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 3)", 470);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 471);
index = YArray.indexOf(sectionButtons, button);

                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 473);
if (index > -1) {
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 474);
section = currentSection;
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 475);
return true;
                }
            });
        }

        // Button was found at an appropriate index.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 481);
if (button && index > -1) {
            // Remove button from `section` array.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 483);
buttons[section].splice(index, 1);

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 485);
this.set('buttons', buttons, {
                button : button,
                section: section,
                index  : index,
                src    : 'remove'
            });
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 493);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Binds UI event listeners. This method is inserted via AOP, and will execute
    after `bindUI()`.

    @method _bindUIButtons
    @protected
    @since 3.4.0
    **/
    _bindUIButtons: function () {
        // Event handlers are bound with `bind()` to make them more extensible.
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_bindUIButtons", 506);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 508);
var afterContentChange = Y.bind('_afterContentChangeButtons', this);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 510);
this.after({
            visibleChange      : Y.bind('_afterVisibleChangeButtons', this),
            headerContentChange: afterContentChange,
            bodyContentChange  : afterContentChange,
            footerContentChange: afterContentChange
        });
    },

    /**
    Returns a button node based on the specified `button` node or configuration.

    The button node will either be created via `Y.Plugin.Button.createNode()`,
    or when `button` is specified as a node already, it will by `plug()`ed with
    `Y.Plugin.Button`.

    @method _createButton
    @param {Node|Object} button Button node or configuration object.
    @return {Node} The button node.
    @protected
    @since 3.5.0
    **/
    _createButton: function (button) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_createButton", 531);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 532);
var config, buttonConfig, nonButtonNodeCfg,
            i, len, action, context, handle;

        // Makes sure the exiting `Y.Node` instance is from this YUI sandbox and
        // is plugged with `Y.Plugin.Button`.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 537);
if (isNode(button)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 538);
return Y.one(button.getDOMNode()).plug(ButtonPlugin);
        }

        // Merge `button` config with defaults and back-compat.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 542);
config = Y.merge({
            context: this,
            events : 'click',
            label  : button.value
        }, button);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 548);
buttonConfig     = Y.merge(config);
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 549);
nonButtonNodeCfg = WidgetButtons.NON_BUTTON_NODE_CFG;

        // Remove all non-button Node config props.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 552);
for (i = 0, len = nonButtonNodeCfg.length; i < len; i += 1) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 553);
delete buttonConfig[nonButtonNodeCfg[i]];
        }

        // Create the button node using the button Node-only config.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 557);
button = ButtonPlugin.createNode(buttonConfig);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 559);
context = config.context;
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 560);
action  = config.action;

        // Supports `action` as a String name of a Function on the `context`
        // object.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 564);
if (isString(action)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 565);
action = Y.bind(action, context);
        }

        // Supports all types of crazy configs for event subscriptions and
        // stores a reference to the returned `EventHandle`.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 570);
handle = button.on(config.events, action, context);
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 571);
this._buttonsHandles[Y.stamp(button, true)] = handle;

        // Tags the button with the configured `name` and `isDefault` settings.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 574);
button.setData('name', this._getButtonName(config));
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 575);
button.setData('default', this._getButtonDefault(config));

        // Add any CSS classnames to the button node.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 578);
YArray.each(YArray(config.classNames), button.addClass, button);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 580);
return button;
    },

    /**
    Returns the buttons container for the specified `section`, passing a truthy
    value for `create` will create the node if it does not already exist.

    **Note:** It is up to the caller to properly insert the returned container
    node into the content section.

    @method _getButtonContainer
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @param {Boolean} create Whether the buttons container should be created if
        it does not already exist.
    @return {Node} The buttons container node for the specified `section`.
    @protected
    @see BUTTONS_TEMPLATE
    @since 3.5.0
    **/
    _getButtonContainer: function (section, create) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_getButtonContainer", 599);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 600);
var sectionClassName = WidgetStdMod.SECTION_CLASS_NAMES[section],
            buttonsClassName = WidgetButtons.CLASS_NAMES.buttons,
            contentBox       = this.get('contentBox'),
            containerSelector, container;

        // Search for an existing buttons container within the section.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 606);
containerSelector = '.' + sectionClassName + ' .' + buttonsClassName;
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 607);
container         = contentBox.one(containerSelector);

        // Create the `container` if it doesn't already exist.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 610);
if (!container && create) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 611);
container = Y.Node.create(this.BUTTONS_TEMPLATE);
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 612);
container.addClass(buttonsClassName);
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 615);
return container;
    },

    /**
    Returns whether or not the specified `button` is configured to be the
    default button.

    When a button node is specified, the button's `getData()` method will be
    used to determine if the button is configured to be the default. When a
    button config object is specified, the `isDefault` prop will determine
    whether the button is the default.

    **Note:** `<button data-default="true"></button>` is supported via the
    `button.getData('default')` API call.

    @method _getButtonDefault
    @param {Node|Object} button The button node or configuration object.
    @return {Boolean} Whether the button is configured to be the default button.
    @protected
    @since 3.5.0
    **/
    _getButtonDefault: function (button) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_getButtonDefault", 636);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 637);
var isDefault = isNode(button) ?
                button.getData('default') : button.isDefault;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 640);
if (isString(isDefault)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 641);
return isDefault.toLowerCase() === 'true';
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 644);
return !!isDefault;
    },

    /**
    Returns the name of the specified `button`.

    When a button node is specified, the button's `getData('name')` method is
    preferred, but will fallback to `get('name')`, and the result will determine
    the button's name. When a button config object is specified, the `name` prop
    will determine the button's name.

    **Note:** `<button data-name="foo"></button>` is supported via the
    `button.getData('name')` API call.

    @method _getButtonName
    @param {Node|Object} button The button node or configuration object.
    @return {String} The name of the button.
    @protected
    @since 3.5.0
    **/
    _getButtonName: function (button) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_getButtonName", 664);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 665);
var name;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 667);
if (isNode(button)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 668);
name = button.getData('name') || button.get('name');
        } else {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 670);
name = button && (button.name || button.type);
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 673);
return name;
    },

    /**
    Getter for the `buttons` attribute. A copy of the `buttons` object is
    returned so the stored state cannot be modified by the callers of
    `get('buttons')`.

    This will recreate a copy of the `buttons` object, and each section array
    (the button nodes are *not* copied/cloned.)

    @method _getButtons
    @param {Object} buttons The widget's current `buttons` state.
    @return {Object} A copy of the widget's current `buttons` state.
    @protected
    @since 3.5.0
    **/
    _getButtons: function (buttons) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_getButtons", 690);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 691);
var buttonsCopy = {};

        // Creates a new copy of the `buttons` object.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 694);
YObject.each(buttons, function (sectionButtons, section) {
            // Creates of copy of the array of button nodes.
            _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 4)", 694);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 696);
buttonsCopy[section] = sectionButtons.concat();
        });

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 699);
return buttonsCopy;
    },

    /**
    Adds the specified `button` to the buttons map (both name -> button and
    section:name -> button), and sets the button as the default if it is
    configured as the default button.

    **Note:** If two or more buttons are configured with the same `name` and/or
    configured to be the default button, the last one wins.

    @method _mapButton
    @param {Node} button The button node to map.
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @protected
    @since 3.5.0
    **/
    _mapButton: function (button, section) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_mapButton", 716);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 717);
var map       = this._buttonsMap,
            name      = this._getButtonName(button),
            isDefault = this._getButtonDefault(button);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 721);
if (name) {
            // name -> button
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 723);
map[name] = button;

            // section:name -> button
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 726);
map[section + ':' + name] = button;
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 729);
isDefault && (this._defaultButton = button);
    },

    /**
    Adds the specified `buttons` to the buttons map (both name -> button and
    section:name -> button), and set the a button as the default if one is
    configured as the default button.

    **Note:** This will clear all previous button mappings and null-out any
    previous default button! If two or more buttons are configured with the same
    `name` and/or configured to be the default button, the last one wins.

    @method _mapButtons
    @param {Node[]} buttons The button nodes to map.
    @protected
    @since 3.5.0
    **/
    _mapButtons: function (buttons) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_mapButtons", 746);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 747);
this._buttonsMap    = {};
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 748);
this._defaultButton = null;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 750);
YObject.each(buttons, function (sectionButtons, section) {
            _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 5)", 750);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 751);
var i, len;

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 753);
for (i = 0, len = sectionButtons.length; i < len; i += 1) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 754);
this._mapButton(sectionButtons[i], section);
            }
        }, this);
    },

    /**
    Returns a copy of the specified `config` object merged with any defaults
    provided by a `srcNode` and/or a predefined configuration for a button
    with the same `name` on the `BUTTONS` property.

    @method _mergeButtonConfig
    @param {Object|String} config Button configuration object, or string name.
    @return {Object} A copy of the button configuration object merged with any
        defaults.
    @protected
    @since 3.5.0
    **/
    _mergeButtonConfig: function (config) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_mergeButtonConfig", 771);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 772);
var buttonConfig, defConfig, name, button, tagName, label;

        // Makes sure `config` is an Object and a copy of the specified value.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 775);
config = isString(config) ? {name: config} : Y.merge(config);

        // Seeds default values from the button node, if there is one.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 778);
if (config.srcNode) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 779);
button  = config.srcNode;
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 780);
tagName = button.get('tagName').toLowerCase();
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 781);
label   = button.get(tagName === 'input' ? 'value' : 'text');

            // Makes sure the button's current values override any defaults.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 784);
buttonConfig = {
                disabled : !!button.get('disabled'),
                isDefault: this._getButtonDefault(button),
                name     : this._getButtonName(button)
            };

            // Label should only be considered when not an empty string.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 791);
label && (buttonConfig.label = label);

            // Merge `config` with `buttonConfig` values.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 794);
Y.mix(config, buttonConfig, false, null, 0, true);
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 797);
name      = this._getButtonName(config);
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 798);
defConfig = this.BUTTONS && this.BUTTONS[name];

        // Merge `config` with predefined default values.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 801);
if (defConfig) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 802);
Y.mix(config, defConfig, false, null, 0, true);
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 805);
return config;
    },

    /**
    `HTML_PARSER` implementation for the `buttons` attribute.

    **Note:** To determine a button node's name its `data-name` and `name`
    attributes are examined. Whether the button should be the default is
    determined by its `data-default` attribute.

    @method _parseButtons
    @param {Node} srcNode This widget's srcNode to search for buttons.
    @return {null|Object} `buttons` Config object parsed from this widget's DOM.
    @protected
    @since 3.5.0
    **/
    _parseButtons: function (srcNode) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_parseButtons", 821);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 822);
var buttonSelector = '.' + WidgetButtons.CLASS_NAMES.button,
            sections       = ['header', 'body', 'footer'],
            buttonsConfig  = null;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 826);
YArray.each(sections, function (section) {
            _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 6)", 826);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 827);
var container = this._getButtonContainer(section),
                buttons   = container && container.all(buttonSelector),
                sectionButtons;

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 831);
if (!buttons || buttons.isEmpty()) { return; }

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 833);
sectionButtons = [];

            // Creates a button config object for every button node found and
            // adds it to the section. This way each button configuration can be
            // merged with any defaults provided by predefined `BUTTONS`.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 838);
buttons.each(function (button) {
                _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 7)", 838);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 839);
sectionButtons.push({srcNode: button});
            });

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 842);
buttonsConfig || (buttonsConfig = {});
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 843);
buttonsConfig[section] = sectionButtons;
        }, this);

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 846);
return buttonsConfig;
    },

    /**
    Setter for the `buttons` attribute. This processes the specified `config`
    and returns a new `buttons` object which is stored as the new state; leaving
    the original, specified `config` unmodified.

    The button nodes will either be created via `Y.Plugin.Button.createNode()`,
    or when a button is already a Node already, it will by `plug()`ed with
    `Y.Plugin.Button`.

    @method _setButtons
    @param {Array|Object} config The `buttons` configuration to process.
    @return {Object} The processed `buttons` object which represents the new
        state.
    @protected
    @since 3.5.0
    **/
    _setButtons: function (config) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_setButtons", 865);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 866);
var defSection = this.DEFAULT_BUTTONS_SECTION,
            buttons    = {};

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 869);
function processButtons(buttonConfigs, currentSection) {
            _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "processButtons", 869);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 870);
if (!isArray(buttonConfigs)) { return; }

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 872);
var i, len, button, section;

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 874);
for (i = 0, len = buttonConfigs.length; i < len; i += 1) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 875);
button  = buttonConfigs[i];
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 876);
section = currentSection;

                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 878);
if (!isNode(button)) {
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 879);
button = this._mergeButtonConfig(button);
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 880);
section || (section = button.section);
                }

                // Always passes through `_createButton()` to make sure the node
                // is decorated as a button.
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 885);
button = this._createButton(button);

                // Use provided `section` or fallback to the default section.
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 888);
section || (section = defSection);

                // Add button to the array of buttons for the specified section.
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 891);
(buttons[section] || (buttons[section] = [])).push(button);
            }
        }

        // Handle `config` being either an Array or Object of Arrays.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 896);
if (isArray(config)) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 897);
processButtons.call(this, config);
        } else {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 899);
YObject.each(config, processButtons, this);
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 902);
return buttons;
    },

    /**
    Syncs this widget's current button-related state to its DOM. This method is
    inserted via AOP, and will execute after `syncUI()`.

    @method _syncUIButtons
    @protected
    @since 3.4.0
    **/
    _syncUIButtons: function () {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_syncUIButtons", 913);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 914);
this._uiSetButtons(this.get('buttons'));
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 915);
this._uiSetDefaultButton(this.get('defaultButton'));
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 916);
this._uiSetVisibleButtons(this.get('visible'));
    },

    /**
    Inserts the specified `button` node into this widget's DOM at the specified
    `section` and `index` and updates the section content.

    The section and button container nodes will be created if they do not
    already exist.

    @method _uiInsertButton
    @param {Node} button The button node to insert into this widget's DOM.
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @param {Number} index Index at which the `button` should be positioned.
    @protected
    @since 3.5.0
    **/
    _uiInsertButton: function (button, section, index) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_uiInsertButton", 933);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 934);
var buttonsClassName = WidgetButtons.CLASS_NAMES.button,
            buttonContainer  = this._getButtonContainer(section, true),
            sectionButtons   = buttonContainer.all('.' + buttonsClassName);

        // Inserts the button node at the correct index.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 939);
buttonContainer.insertBefore(button, sectionButtons.item(index));

        // Adds the button container to the section content.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 942);
this.setStdModContent(section, buttonContainer, 'after');
    },

    /**
    Removes the button node from this widget's DOM and detaches any event
    subscriptions on the button that were created by this widget. The section
    content will be updated unless `{preserveContent: true}` is passed in the
    `options`.

    By default the button container node will be removed when this removes the
    last button of the specified `section`; and if no other content remains in
    the section node, it will also be removed.

    @method _uiRemoveButton
    @param {Node} button The button to remove and destroy.
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @param {Object} [options] Additional options.
      @param {Boolean} [options.preserveContent=false] Whether the section
        content should be updated.
    @protected
    @since 3.5.0
    **/
    _uiRemoveButton: function (button, section, options) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_uiRemoveButton", 964);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 965);
var yuid    = Y.stamp(button, this),
            handles = this._buttonsHandles,
            handle  = handles[yuid],
            buttonContainer, buttonClassName;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 970);
if (handle) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 971);
handle.detach();
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 974);
delete handles[yuid];

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 976);
button.remove();

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 978);
options || (options = {});

        // Remove the button container and section nodes if needed.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 981);
if (!options.preserveContent) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 982);
buttonContainer = this._getButtonContainer(section);
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 983);
buttonClassName = WidgetButtons.CLASS_NAMES.button;

            // Only matters if we have a button container which is empty.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 986);
if (buttonContainer &&
                    buttonContainer.all('.' + buttonClassName).isEmpty()) {

                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 989);
buttonContainer.remove();
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 990);
this._updateContentButtons(section);
            }
        }
    },

    /**
    Sets the current `buttons` state to this widget's DOM by rendering the
    specified collection of `buttons` and updates the contents of each section
    as needed.

    Button nodes which already exist in the DOM will remain intact, or will be
    moved if they should be in a new position. Old button nodes which are no
    longer represented in the specified `buttons` collection will be removed,
    and any event subscriptions on the button which were created by this widget
    will be detached.

    If the button nodes in this widget's DOM actually change, then each content
    section will be updated (or removed) appropriately.

    @method _uiSetButtons
    @param {Object} buttons The current `buttons` state to visually represent.
    @protected
    @since 3.5.0
    **/
    _uiSetButtons: function (buttons) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_uiSetButtons", 1014);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1015);
var buttonClassName = WidgetButtons.CLASS_NAMES.button,
            sections        = ['header', 'body', 'footer'];

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1018);
YArray.each(sections, function (section) {
            _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 8)", 1018);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1019);
var sectionButtons  = buttons[section] || [],
                numButtons      = sectionButtons.length,
                buttonContainer = this._getButtonContainer(section, numButtons),
                buttonsUpdated  = false,
                oldNodes, i, button, buttonIndex;

            // When there's no button container, there are no new buttons or old
            // buttons that we have to deal with for this section.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1027);
if (!buttonContainer) { return; }

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1029);
oldNodes = buttonContainer.all('.' + buttonClassName);

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1031);
for (i = 0; i < numButtons; i += 1) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1032);
button      = sectionButtons[i];
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1033);
buttonIndex = oldNodes.indexOf(button);

                // Buttons already rendered in the Widget should remain there or
                // moved to their new index. New buttons will be added to the
                // current `buttonContainer`.
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1038);
if (buttonIndex > -1) {
                    // Remove button from existing buttons nodeList since its in
                    // the DOM already.
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1041);
oldNodes.splice(buttonIndex, 1);

                    // Check that the button is at the right position, if not,
                    // move it to its new position.
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1045);
if (buttonIndex !== i) {
                        // Using `i + 1` because the button should be at index
                        // `i`; it's inserted before the node which comes after.
                        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1048);
buttonContainer.insertBefore(button, i + 1);
                        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1049);
buttonsUpdated = true;
                    }
                } else {
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1052);
buttonContainer.appendChild(button);
                    _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1053);
buttonsUpdated = true;
                }
            }

            // Safely removes the old button nodes which are no longer part of
            // this widget's `buttons`.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1059);
oldNodes.each(function (button) {
                _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "(anonymous 9)", 1059);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1060);
this._uiRemoveButton(button, section, {preserveContent: true});
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1061);
buttonsUpdated = true;
            }, this);

            // Remove leftover empty button containers and updated the StdMod
            // content area.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1066);
if (numButtons === 0) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1067);
buttonContainer.remove();
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1068);
this._updateContentButtons(section);
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1069);
return;
            }

            // Adds the button container to the section content.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1073);
if (buttonsUpdated) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1074);
this.setStdModContent(section, buttonContainer, 'after');
            }
        }, this);
    },

    /**
    Adds the "yui3-button-primary" CSS class to the new `defaultButton` and
    removes it from the old default button.

    @method _uiSetDefaultButton
    @param {Node} newButton The new `defaultButton`.
    @param {Node} oldButton The old `defaultButton`.
    @protected
    @since 3.5.0
    **/
    _uiSetDefaultButton: function (newButton, oldButton) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_uiSetDefaultButton", 1089);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1090);
var primaryClassName = WidgetButtons.CLASS_NAMES.primary;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1092);
if (newButton) { newButton.addClass(primaryClassName); }
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1093);
if (oldButton) { oldButton.removeClass(primaryClassName); }
    },

    /**
    Focuses this widget's `defaultButton` if there is one and this widget is
    visible.

    @method _uiSetVisibleButtons
    @param {Boolean} visible Whether this widget is visible.
    @protected
    @since 3.5.0
    **/
    _uiSetVisibleButtons: function (visible) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_uiSetVisibleButtons", 1105);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1106);
if (!visible) { return; }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1108);
var defaultButton = this.get('defaultButton');
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1109);
if (defaultButton) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1110);
defaultButton.focus();
        }
    },

    /**
    Removes the specified `button` from the buttons map (both name -> button and
    section:name -> button), and nulls-out the `defaultButton` if it is
    currently the default button.

    @method _unMapButton
    @param {Node} button The button node to remove from the buttons map.
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @protected
    @since 3.5.0
    **/
    _unMapButton: function (button, section) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_unMapButton", 1125);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1126);
var map  = this._buttonsMap,
            name = this._getButtonName(button),
            sectionName;

        // Only delete the map entry if the specified `button` is mapped to it.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1131);
if (name) {
            // name -> button
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1133);
if (map[name] === button) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1134);
delete map[name];
            }

            // section:name -> button
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1138);
sectionName = section + ':' + name;
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1139);
if (map[sectionName] === button) {
                _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1140);
delete map[sectionName];
            }
        }

        // Clear the default button if its the specified `button`.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1145);
if (this._defaultButton === button) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1146);
this._defaultButton = null;
        }
    },

    /**
    Updates the `defaultButton` attribute if it needs to be updated by comparing
    its current value with the protected `_defaultButton` property.

    @method _updateDefaultButton
    @protected
    @since 3.5.0
    **/
    _updateDefaultButton: function () {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_updateDefaultButton", 1158);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1159);
var defaultButton = this._defaultButton;

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1161);
if (this.get('defaultButton') !== defaultButton) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1162);
this._set('defaultButton', defaultButton);
        }
    },

    /**
    Updates the content attribute which corresponds to the specified `section`.

    The method updates the section's content to its current `childNodes`
    (text and/or HTMLElement), or will null-out its contents if the section is
    empty. It also specifies a `src` of `buttons` on the change event facade.

    @method _updateContentButtons
    @param {String} section The `WidgetStdMod` section (header/body/footer) to
        update.
    @protected
    @since 3.5.0
    **/
    _updateContentButtons: function (section) {
        // `childNodes` return text nodes and HTMLElements.
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_updateContentButtons", 1179);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1181);
var sectionContent = this.getStdModNode(section).get('childNodes');

        // Updates the section to its current contents, or null if it is empty.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1184);
this.set(section + 'Content', sectionContent.isEmpty() ? null :
            sectionContent, {src: 'buttons'});
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles this widget's `buttonsChange` event which fires anytime the
    `buttons` attribute is modified.

    **Note:** This method special-cases the `buttons` modifications caused by
    `addButton()` and `removeButton()`, both of which set the `src` property on
    the event facade to "add" and "remove" respectively.

    @method _afterButtonsChange
    @param {EventFacade} e
    @protected
    @since 3.4.0
    **/
    _afterButtonsChange: function (e) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_afterButtonsChange", 1203);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1204);
var buttons = e.newVal,
            section = e.section,
            index   = e.index,
            src     = e.src,
            button;

        // Special cases `addButton()` to only set and insert the new button.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1211);
if (src === 'add') {
            // Make sure we have the button node.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1213);
button = buttons[section][index];

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1215);
this._mapButton(button, section);
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1216);
this._updateDefaultButton();
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1217);
this._uiInsertButton(button, section, index);

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1219);
return;
        }

        // Special cases `removeButton()` to only remove the specified button.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1223);
if (src === 'remove') {
            // Button node already exists on the event facade.
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1225);
button = e.button;

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1227);
this._unMapButton(button, section);
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1228);
this._updateDefaultButton();
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1229);
this._uiRemoveButton(button, section);

            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1231);
return;
        }

        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1234);
this._mapButtons(buttons);
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1235);
this._updateDefaultButton();
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1236);
this._uiSetButtons(buttons);
    },

    /**
    Handles this widget's `headerContentChange`, `bodyContentChange`,
    `footerContentChange` events by making sure the `buttons` remain rendered
    after changes to the content areas.

    These events are very chatty, so extra caution is taken to avoid doing extra
    work or getting into an infinite loop.

    @method _afterContentChangeButtons
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _afterContentChangeButtons: function (e) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_afterContentChangeButtons", 1252);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1253);
var src     = e.src,
            pos     = e.stdModPosition,
            replace = !pos || pos === WidgetStdMod.REPLACE;

        // Only do work when absolutely necessary.
        _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1258);
if (replace && src !== 'buttons' && src !== Widget.UI_SRC) {
            _yuitest_coverline("build/widget-buttons/widget-buttons.js", 1259);
this._uiSetButtons(this.get('buttons'));
        }
    },

    /**
    Handles this widget's `defaultButtonChange` event by adding the
    "yui3-button-primary" CSS class to the new `defaultButton` and removing it
    from the old default button.

    @method _afterDefaultButtonChange
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _afterDefaultButtonChange: function (e) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_afterDefaultButtonChange", 1273);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1274);
this._uiSetDefaultButton(e.newVal, e.prevVal);
    },

    /**
    Handles this widget's `visibleChange` event by focusing the `defaultButton`
    if there is one.

    @method _afterVisibleChangeButtons
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _afterVisibleChangeButtons: function (e) {
        _yuitest_coverfunc("build/widget-buttons/widget-buttons.js", "_afterVisibleChangeButtons", 1286);
_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1287);
this._uiSetVisibleButtons(e.newVal);
    }
};

_yuitest_coverline("build/widget-buttons/widget-buttons.js", 1291);
Y.WidgetButtons = WidgetButtons;


}, '3.7.3', {"requires": ["button-plugin", "cssbutton", "widget-stdmod"]});
