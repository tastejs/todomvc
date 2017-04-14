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
_yuitest_coverage["build/widget-stdmod/widget-stdmod.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-stdmod/widget-stdmod.js",
    code: []
};
_yuitest_coverage["build/widget-stdmod/widget-stdmod.js"].code=["YUI.add('widget-stdmod', function (Y, NAME) {","","/**"," * Provides standard module support for Widgets through an extension."," *"," * @module widget-stdmod"," */","    var L = Y.Lang,","        Node = Y.Node,","        UA = Y.UA,","        Widget = Y.Widget,","","        EMPTY = \"\",","        HD = \"hd\",","        BD = \"bd\",","        FT = \"ft\",","        HEADER = \"header\",","        BODY = \"body\",","        FOOTER = \"footer\",","        FILL_HEIGHT = \"fillHeight\",","        STDMOD = \"stdmod\",","","        NODE_SUFFIX = \"Node\",","        CONTENT_SUFFIX = \"Content\",","","        FIRST_CHILD = \"firstChild\",","        CHILD_NODES = \"childNodes\",","        OWNER_DOCUMENT = \"ownerDocument\",","","        CONTENT_BOX = \"contentBox\",","","        HEIGHT = \"height\",","        OFFSET_HEIGHT = \"offsetHeight\",","        AUTO = \"auto\",","","        HeaderChange = \"headerContentChange\",","        BodyChange = \"bodyContentChange\",","        FooterChange = \"footerContentChange\",","        FillHeightChange = \"fillHeightChange\",","        HeightChange = \"heightChange\",","        ContentUpdate = \"contentUpdate\",","","        RENDERUI = \"renderUI\",","        BINDUI = \"bindUI\",","        SYNCUI = \"syncUI\",","","        APPLY_PARSED_CONFIG = \"_applyParsedConfig\",","","        UI = Y.Widget.UI_SRC;","","    /**","     * Widget extension, which can be used to add Standard Module support to the","     * base Widget class, through the <a href=\"Base.html#method_build\">Base.build</a>","     * method.","     * <p>","     * The extension adds header, body and footer sections to the Widget's content box and","     * provides the corresponding methods and attributes to modify the contents of these sections.","     * </p>","     * @class WidgetStdMod","     * @param {Object} The user configuration object","     */","    function StdMod(config) {","","        this._stdModNode = this.get(CONTENT_BOX);","","        Y.before(this._renderUIStdMod, this, RENDERUI);","        Y.before(this._bindUIStdMod, this, BINDUI);","        Y.before(this._syncUIStdMod, this, SYNCUI);","    }","","    /**","     * Constant used to refer the the standard module header, in methods which expect a section specifier","     *","     * @property HEADER","     * @static","     * @type String","     */","    StdMod.HEADER = HEADER;","","    /**","     * Constant used to refer the the standard module body, in methods which expect a section specifier","     *","     * @property BODY","     * @static","     * @type String","     */","    StdMod.BODY = BODY;","","    /**","     * Constant used to refer the the standard module footer, in methods which expect a section specifier","     *","     * @property FOOTER","     * @static","     * @type String","     */","    StdMod.FOOTER = FOOTER;","","    /**","     * Constant used to specify insertion position, when adding content to sections of the standard module in","     * methods which expect a \"where\" argument.","     * <p>","     * Inserts new content <em>before</em> the sections existing content.","     * </p>","     * @property AFTER","     * @static","     * @type String","     */","    StdMod.AFTER = \"after\";","","    /**","     * Constant used to specify insertion position, when adding content to sections of the standard module in","     * methods which expect a \"where\" argument.","     * <p>","     * Inserts new content <em>before</em> the sections existing content.","     * </p>","     * @property BEFORE","     * @static","     * @type String","     */","    StdMod.BEFORE = \"before\";","    /**","     * Constant used to specify insertion position, when adding content to sections of the standard module in","     * methods which expect a \"where\" argument.","     * <p>","     * <em>Replaces</em> the sections existing content, with new content.","     * </p>","     * @property REPLACE","     * @static","     * @type String","     */","    StdMod.REPLACE = \"replace\";","","    var STD_HEADER = StdMod.HEADER,","        STD_BODY = StdMod.BODY,","        STD_FOOTER = StdMod.FOOTER,","","        HEADER_CONTENT = STD_HEADER + CONTENT_SUFFIX,","        FOOTER_CONTENT = STD_FOOTER + CONTENT_SUFFIX,","        BODY_CONTENT = STD_BODY + CONTENT_SUFFIX;","","    /**","     * Static property used to define the default attribute","     * configuration introduced by WidgetStdMod.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    StdMod.ATTRS = {","","        /**","         * @attribute headerContent","         * @type HTML","         * @default undefined","         * @description The content to be added to the header section. This will replace any existing content","         * in the header. If you want to append, or insert new content, use the <a href=\"#method_setStdModContent\">setStdModContent</a> method.","         */","        headerContent: {","            value:null","        },","","        /**","         * @attribute footerContent","         * @type HTML","         * @default undefined","         * @description The content to be added to the footer section. This will replace any existing content","         * in the footer. If you want to append, or insert new content, use the <a href=\"#method_setStdModContent\">setStdModContent</a> method.","         */","        footerContent: {","            value:null","        },","","        /**","         * @attribute bodyContent","         * @type HTML","         * @default undefined","         * @description The content to be added to the body section. This will replace any existing content","         * in the body. If you want to append, or insert new content, use the <a href=\"#method_setStdModContent\">setStdModContent</a> method.","         */","        bodyContent: {","            value:null","        },","","        /**","         * @attribute fillHeight","         * @type {String}","         * @default WidgetStdMod.BODY","         * @description The section (WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER) which should be resized to fill the height of the standard module, when a","         * height is set on the Widget. If a height is not set on the widget, then all sections are sized based on","         * their content.","         */","        fillHeight: {","            value: StdMod.BODY,","            validator: function(val) {","                 return this._validateFillHeight(val);","            }","        }","    };","","    /**","     * The HTML parsing rules for the WidgetStdMod class.","     *","     * @property HTML_PARSER","     * @static","     * @type Object","     */","    StdMod.HTML_PARSER = {","        headerContent: function(contentBox) {","            return this._parseStdModHTML(STD_HEADER);","        },","","        bodyContent: function(contentBox) {","            return this._parseStdModHTML(STD_BODY);","        },","","        footerContent : function(contentBox) {","            return this._parseStdModHTML(STD_FOOTER);","        }","    };","","    /**","     * Static hash of default class names used for the header,","     * body and footer sections of the standard module, keyed by","     * the section identifier (WidgetStdMod.STD_HEADER, WidgetStdMod.STD_BODY, WidgetStdMod.STD_FOOTER)","     *","     * @property SECTION_CLASS_NAMES","     * @static","     * @type Object","     */","    StdMod.SECTION_CLASS_NAMES = {","        header: Widget.getClassName(HD),","        body: Widget.getClassName(BD),","        footer: Widget.getClassName(FT)","    };","","    /**","     * The template HTML strings for each of the standard module sections. Section entries are keyed by the section constants,","     * WidgetStdMod.HEADER, WidgetStdMod.BODY, WidgetStdMod.FOOTER, and contain the HTML to be added for each section.","     * e.g.","     * <pre>","     *    {","     *       header : '&lt;div class=\"yui-widget-hd\"&gt;&lt;/div&gt;',","     *       body : '&lt;div class=\"yui-widget-bd\"&gt;&lt;/div&gt;',","     *       footer : '&lt;div class=\"yui-widget-ft\"&gt;&lt;/div&gt;'","     *    }","     * </pre>","     * @property TEMPLATES","     * @type Object","     * @static","     */","    StdMod.TEMPLATES = {","        header : '<div class=\"' + StdMod.SECTION_CLASS_NAMES[STD_HEADER] + '\"></div>',","        body : '<div class=\"' + StdMod.SECTION_CLASS_NAMES[STD_BODY] + '\"></div>',","        footer : '<div class=\"' + StdMod.SECTION_CLASS_NAMES[STD_FOOTER] + '\"></div>'","    };","","    StdMod.prototype = {","","        /**","         * Synchronizes the UI to match the Widgets standard module state.","         * <p>","         * This method is invoked after syncUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _syncUIStdMod","         * @protected","         */","        _syncUIStdMod : function() {","            var stdModParsed = this._stdModParsed;","","            if (!stdModParsed || !stdModParsed[HEADER_CONTENT]) {","                this._uiSetStdMod(STD_HEADER, this.get(HEADER_CONTENT));","            }","","            if (!stdModParsed || !stdModParsed[BODY_CONTENT]) {","                this._uiSetStdMod(STD_BODY, this.get(BODY_CONTENT));","            }","","            if (!stdModParsed || !stdModParsed[FOOTER_CONTENT]) {","                this._uiSetStdMod(STD_FOOTER, this.get(FOOTER_CONTENT));","            }","","            this._uiSetFillHeight(this.get(FILL_HEIGHT));","        },","","        /**","         * Creates/Initializes the DOM for standard module support.","         * <p>","         * This method is invoked after renderUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _renderUIStdMod","         * @protected","         */","        _renderUIStdMod : function() {","            this._stdModNode.addClass(Widget.getClassName(STDMOD));","            this._renderStdModSections();","","            //This normally goes in bindUI but in order to allow setStdModContent() to work before renderUI","            //stage, these listeners should be set up at the earliest possible time.","            this.after(HeaderChange, this._afterHeaderChange);","            this.after(BodyChange, this._afterBodyChange);","            this.after(FooterChange, this._afterFooterChange);","        },","","        _renderStdModSections : function() {","            if (L.isValue(this.get(HEADER_CONTENT))) { this._renderStdMod(STD_HEADER); }","            if (L.isValue(this.get(BODY_CONTENT))) { this._renderStdMod(STD_BODY); }","            if (L.isValue(this.get(FOOTER_CONTENT))) { this._renderStdMod(STD_FOOTER); }","        },","","        /**","         * Binds event listeners responsible for updating the UI state in response to","         * Widget standard module related state changes.","         * <p>","         * This method is invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIStdMod","         * @protected","         */","        _bindUIStdMod : function() {","            // this.after(HeaderChange, this._afterHeaderChange);","            // this.after(BodyChange, this._afterBodyChange);","            // this.after(FooterChange, this._afterFooterChange);","","            this.after(FillHeightChange, this._afterFillHeightChange);","            this.after(HeightChange, this._fillHeight);","            this.after(ContentUpdate, this._fillHeight);","        },","","        /**","         * Default attribute change listener for the headerContent attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterHeaderChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterHeaderChange : function(e) {","            if (e.src !== UI) {","                this._uiSetStdMod(STD_HEADER, e.newVal, e.stdModPosition);","            }","        },","","        /**","         * Default attribute change listener for the bodyContent attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterBodyChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterBodyChange : function(e) {","            if (e.src !== UI) {","                this._uiSetStdMod(STD_BODY, e.newVal, e.stdModPosition);","            }","        },","","        /**","         * Default attribute change listener for the footerContent attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterFooterChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterFooterChange : function(e) {","            if (e.src !== UI) {","                this._uiSetStdMod(STD_FOOTER, e.newVal, e.stdModPosition);","            }","        },","","        /**","         * Default attribute change listener for the fillHeight attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterFillHeightChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterFillHeightChange: function (e) {","            this._uiSetFillHeight(e.newVal);","        },","","        /**","         * Default validator for the fillHeight attribute. Verifies that the","         * value set is a valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER,","         * or a falsey value if fillHeight is to be disabled.","         *","         * @method _validateFillHeight","         * @protected","         * @param {String} val The section which should be setup to fill height, or false/null to disable fillHeight","         * @return true if valid, false if not","         */","        _validateFillHeight : function(val) {","            return !val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER;","        },","","        /**","         * Updates the rendered UI, to resize the provided section so that the standard module fills out","         * the specified widget height. Note: This method does not check whether or not a height is set","         * on the Widget.","         *","         * @method _uiSetFillHeight","         * @protected","         * @param {String} fillSection A valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER","         */","        _uiSetFillHeight : function(fillSection) {","            var fillNode = this.getStdModNode(fillSection);","            var currNode = this._currFillNode;","","            if (currNode && fillNode !== currNode){","                currNode.setStyle(HEIGHT, EMPTY);","            }","","            if (fillNode) {","                this._currFillNode = fillNode;","            }","","            this._fillHeight();","        },","","        /**","         * Updates the rendered UI, to resize the current section specified by the fillHeight attribute, so","         * that the standard module fills out the Widget height. If a height has not been set on Widget,","         * the section is not resized (height is set to \"auto\").","         *","         * @method _fillHeight","         * @private","         */","        _fillHeight : function() {","            if (this.get(FILL_HEIGHT)) {","                var height = this.get(HEIGHT);","                if (height != EMPTY && height != AUTO) {","                    this.fillHeight(this._currFillNode);","                }","            }","        },","","        /**","         * Updates the rendered UI, adding the provided content (either an HTML string, or node reference),","         * to the specified section. The content is either added before, after or replaces existing content","         * in the section, based on the value of the <code>where</code> argument.","         *","         * @method _uiSetStdMod","         * @protected","         *","         * @param {String} section The section to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @param {String | Node} content The new content (either as an HTML string, or Node reference) to add to the section","         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.","         * If not provided, the content will replace existing content in the section.","         */","        _uiSetStdMod : function(section, content, where) {","            // Using isValue, so that \"\" is valid content","            if (L.isValue(content)) {","                var node = this.getStdModNode(section, true);","","                this._addStdModContent(node, content, where);","","                this.set(section + CONTENT_SUFFIX, this._getStdModContent(section), {src:UI});","            } else {","                this._eraseStdMod(section);","            }","            this.fire(ContentUpdate);","        },","","        /**","         * Creates the DOM node for the given section, and inserts it into the correct location in the contentBox.","         *","         * @method _renderStdMod","         * @protected","         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @return {Node} A reference to the added section node","         */","        _renderStdMod : function(section) {","","            var contentBox = this.get(CONTENT_BOX),","                sectionNode = this._findStdModSection(section);","","            if (!sectionNode) {","                sectionNode = this._getStdModTemplate(section);","            }","","            this._insertStdModSection(contentBox, section, sectionNode);","","            this[section + NODE_SUFFIX] = sectionNode;","            return this[section + NODE_SUFFIX];","        },","","        /**","         * Removes the DOM node for the given section.","         *","         * @method _eraseStdMod","         * @protected","         * @param {String} section The section to remove. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         */","        _eraseStdMod : function(section) {","            var sectionNode = this.getStdModNode(section);","            if (sectionNode) {","                sectionNode.remove(true);","                delete this[section + NODE_SUFFIX];","            }","        },","","        /**","         * Helper method to insert the Node for the given section into the correct location in the contentBox.","         *","         * @method _insertStdModSection","         * @private","         * @param {Node} contentBox A reference to the Widgets content box.","         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @param {Node} sectionNode The Node for the section.","         */","        _insertStdModSection : function(contentBox, section, sectionNode) {","            var fc = contentBox.get(FIRST_CHILD);","","            if (section === STD_FOOTER || !fc) {","                contentBox.appendChild(sectionNode);","            } else {","                if (section === STD_HEADER) {","                    contentBox.insertBefore(sectionNode, fc);","                } else {","                    var footer = this[STD_FOOTER + NODE_SUFFIX];","                    if (footer) {","                        contentBox.insertBefore(sectionNode, footer);","                    } else {","                        contentBox.appendChild(sectionNode);","                    }","                }","            }","        },","","        /**","         * Gets a new Node reference for the given standard module section, by cloning","         * the stored template node.","         *","         * @method _getStdModTemplate","         * @protected","         * @param {String} section The section to create a new node for. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @return {Node} The new Node instance for the section","         */","        _getStdModTemplate : function(section) {","            return Node.create(StdMod.TEMPLATES[section], this._stdModNode.get(OWNER_DOCUMENT));","        },","","        /**","         * Helper method to add content to a StdMod section node.","         * The content is added either before, after or replaces the existing node content","         * based on the value of the <code>where</code> argument.","         *","         * @method _addStdModContent","         * @private","         *","         * @param {Node} node The section Node to be updated.","         * @param {Node|NodeList|String} children The new content Node, NodeList or String to be added to section Node provided.","         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.","         * If not provided, the content will replace existing content in the Node.","         */","        _addStdModContent : function(node, children, where) {","","            // StdMod where to Node where","            switch (where) {","                case StdMod.BEFORE:  // 0 is before fistChild","                    where = 0;","                    break;","                case StdMod.AFTER:   // undefined is appendChild","                    where = undefined;","                    break;","                default:            // replace is replace, not specified is replace","                    where = StdMod.REPLACE;","            }","","            node.insert(children, where);","        },","","        /**","         * Helper method to obtain the precise height of the node provided, including padding and border.","         * The height could be a sub-pixel value for certain browsers, such as Firefox 3.","         *","         * @method _getPreciseHeight","         * @private","         * @param {Node} node The node for which the precise height is required.","         * @return {Number} The height of the Node including borders and padding, possibly a float.","         */","        _getPreciseHeight : function(node) {","            var height = (node) ? node.get(OFFSET_HEIGHT) : 0,","                getBCR = \"getBoundingClientRect\";","","            if (node && node.hasMethod(getBCR)) {","                var preciseRegion = node.invoke(getBCR);","                if (preciseRegion) {","                    height = preciseRegion.bottom - preciseRegion.top;","                }","            }","","            return height;","        },","","        /**","         * Helper method to to find the rendered node for the given section,","         * if it exists.","         *","         * @method _findStdModSection","         * @private","         * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @return {Node} The rendered node for the given section, or null if not found.","         */","        _findStdModSection: function(section) {","            return this.get(CONTENT_BOX).one(\"> .\" + StdMod.SECTION_CLASS_NAMES[section]);","        },","","        /**","         * Utility method, used by WidgetStdMods HTML_PARSER implementation","         * to extract data for each section from markup.","         *","         * @method _parseStdModHTML","         * @private","         * @param {String} section","         * @return {String} Inner HTML string with the contents of the section","         */","        _parseStdModHTML : function(section) {","","            var node = this._findStdModSection(section);","","            if (node) {","                if (!this._stdModParsed) {","                    this._stdModParsed = {};","                    Y.before(this._applyStdModParsedConfig, this, APPLY_PARSED_CONFIG);","                }","                this._stdModParsed[section + CONTENT_SUFFIX] = 1;","","                return node.get(\"innerHTML\");","            }","","            return null;","        },","","        /**","         * This method is injected before the _applyParsedConfig step in","         * the application of HTML_PARSER, and sets up the state to","         * identify whether or not we should remove the current DOM content","         * or not, based on whether or not the current content attribute value","         * was extracted from the DOM, or provided by the user configuration","         *","         * @method _applyStdModParsedConfig","         * @private","         */","        _applyStdModParsedConfig : function(node, cfg, parsedCfg) {","            var parsed = this._stdModParsed;","            if (parsed) {","                parsed[HEADER_CONTENT] = !(HEADER_CONTENT in cfg) && (HEADER_CONTENT in parsed);","                parsed[BODY_CONTENT] = !(BODY_CONTENT in cfg) && (BODY_CONTENT in parsed);","                parsed[FOOTER_CONTENT] = !(FOOTER_CONTENT in cfg) && (FOOTER_CONTENT in parsed);","            }","        },","","        /**","         * Retrieves the child nodes (content) of a standard module section","         *","         * @method _getStdModContent","         * @private","         * @param {String} section The standard module section whose child nodes are to be retrieved. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @return {Node} The child node collection of the standard module section.","         */","        _getStdModContent : function(section) {","            return (this[section + NODE_SUFFIX]) ? this[section + NODE_SUFFIX].get(CHILD_NODES) : null;","        },","","        /**","         * Updates the body section of the standard module with the content provided (either an HTML string, or node reference).","         * <p>","         * This method can be used instead of the corresponding section content attribute if you'd like to retain the current content of the section,","         * and insert content before or after it, by specifying the <code>where</code> argument.","         * </p>","         * @method setStdModContent","         * @param {String} section The standard module section whose content is to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.","         * @param {String | Node} content The content to be added, either an HTML string or a Node reference.","         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.","         * If not provided, the content will replace existing content in the section.","         */","        setStdModContent : function(section, content, where) {","            //var node = this.getStdModNode(section) || this._renderStdMod(section);","            this.set(section + CONTENT_SUFFIX, content, {stdModPosition:where});","            //this._addStdModContent(node, content, where);","        },","","        /**","        Returns the node reference for the specified `section`.","","        **Note:** The DOM is not queried for the node reference. The reference","        stored by the widget instance is returned if it was set. Passing a","        truthy for `forceCreate` will create the section node if it does not","        already exist.","","        @method getStdModNode","        @param {String} section The section whose node reference is required.","            Either `WidgetStdMod.HEADER`, `WidgetStdMod.BODY`, or","            `WidgetStdMod.FOOTER`.","        @param {Boolean} forceCreate Whether the section node should be created","            if it does not already exist.","        @return {Node} The node reference for the `section`, or null if not set.","        **/","        getStdModNode : function(section, forceCreate) {","            var node = this[section + NODE_SUFFIX] || null;","","            if (!node && forceCreate) {","                node = this._renderStdMod(section);","            }","","            return node;","        },","","        /**","         * Sets the height on the provided header, body or footer element to","         * fill out the height of the Widget. It determines the height of the","         * widgets bounding box, based on it's configured height value, and","         * sets the height of the provided section to fill out any","         * space remaining after the other standard module section heights","         * have been accounted for.","         *","         * <p><strong>NOTE:</strong> This method is not designed to work if an explicit","         * height has not been set on the Widget, since for an \"auto\" height Widget,","         * the heights of the header/body/footer will drive the height of the Widget.</p>","         *","         * @method fillHeight","         * @param {Node} node The node which should be resized to fill out the height","         * of the Widget bounding box. Should be a standard module section node which belongs","         * to the widget.","         */","        fillHeight : function(node) {","            if (node) {","                var contentBox = this.get(CONTENT_BOX),","                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],","                    stdModNode,","                    cbContentHeight,","                    filled = 0,","                    remaining = 0,","","                    validNode = false;","","                for (var i = 0, l = stdModNodes.length; i < l; i++) {","                    stdModNode = stdModNodes[i];","                    if (stdModNode) {","                        if (stdModNode !== node) {","                            filled += this._getPreciseHeight(stdModNode);","                        } else {","                            validNode = true;","                        }","                    }","                }","","                if (validNode) {","                    if (UA.ie || UA.opera) {","                        // Need to set height to 0, to allow height to be reduced","                        node.set(OFFSET_HEIGHT, 0);","                    }","","                    cbContentHeight = contentBox.get(OFFSET_HEIGHT) -","                            parseInt(contentBox.getComputedStyle(\"paddingTop\"), 10) -","                            parseInt(contentBox.getComputedStyle(\"paddingBottom\"), 10) -","                            parseInt(contentBox.getComputedStyle(\"borderBottomWidth\"), 10) -","                            parseInt(contentBox.getComputedStyle(\"borderTopWidth\"), 10);","","                    if (L.isNumber(cbContentHeight)) {","                        remaining = cbContentHeight - filled;","                        if (remaining >= 0) {","                            node.set(OFFSET_HEIGHT, remaining);","                        }","                    }","                }","            }","        }","    };","","    Y.WidgetStdMod = StdMod;","","","}, '3.7.3', {\"requires\": [\"base-build\", \"widget\"]});"];
_yuitest_coverage["build/widget-stdmod/widget-stdmod.js"].lines = {"1":0,"8":0,"62":0,"64":0,"66":0,"67":0,"68":0,"78":0,"87":0,"96":0,"108":0,"120":0,"131":0,"133":0,"149":0,"195":0,"207":0,"209":0,"213":0,"217":0,"230":0,"251":0,"257":0,"269":0,"271":0,"272":0,"275":0,"276":0,"279":0,"280":0,"283":0,"296":0,"297":0,"301":0,"302":0,"303":0,"307":0,"308":0,"309":0,"327":0,"328":0,"329":0,"341":0,"342":0,"355":0,"356":0,"369":0,"370":0,"383":0,"397":0,"410":0,"411":0,"413":0,"414":0,"417":0,"418":0,"421":0,"433":0,"434":0,"435":0,"436":0,"456":0,"457":0,"459":0,"461":0,"463":0,"465":0,"478":0,"481":0,"482":0,"485":0,"487":0,"488":0,"499":0,"500":0,"501":0,"502":0,"516":0,"518":0,"519":0,"521":0,"522":0,"524":0,"525":0,"526":0,"528":0,"544":0,"563":0,"565":0,"566":0,"568":0,"569":0,"571":0,"574":0,"587":0,"590":0,"591":0,"592":0,"593":0,"597":0,"610":0,"624":0,"626":0,"627":0,"628":0,"629":0,"631":0,"633":0,"636":0,"650":0,"651":0,"652":0,"653":0,"654":0,"667":0,"684":0,"705":0,"707":0,"708":0,"711":0,"732":0,"733":0,"742":0,"743":0,"744":0,"745":0,"746":0,"748":0,"753":0,"754":0,"756":0,"759":0,"765":0,"766":0,"767":0,"768":0,"776":0};
_yuitest_coverage["build/widget-stdmod/widget-stdmod.js"].functions = {"StdMod:62":0,"validator:194":0,"headerContent:208":0,"bodyContent:212":0,"footerContent:216":0,"_syncUIStdMod:268":0,"_renderUIStdMod:295":0,"_renderStdModSections:306":0,"_bindUIStdMod:322":0,"_afterHeaderChange:340":0,"_afterBodyChange:354":0,"_afterFooterChange:368":0,"_afterFillHeightChange:382":0,"_validateFillHeight:396":0,"_uiSetFillHeight:409":0,"_fillHeight:432":0,"_uiSetStdMod:454":0,"_renderStdMod:476":0,"_eraseStdMod:498":0,"_insertStdModSection:515":0,"_getStdModTemplate:543":0,"_addStdModContent:560":0,"_getPreciseHeight:586":0,"_findStdModSection:609":0,"_parseStdModHTML:622":0,"_applyStdModParsedConfig:649":0,"_getStdModContent:666":0,"setStdModContent:682":0,"getStdModNode:704":0,"fillHeight:731":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-stdmod/widget-stdmod.js"].coveredLines = 137;
_yuitest_coverage["build/widget-stdmod/widget-stdmod.js"].coveredFunctions = 31;
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 1);
YUI.add('widget-stdmod', function (Y, NAME) {

/**
 * Provides standard module support for Widgets through an extension.
 *
 * @module widget-stdmod
 */
    _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 8);
var L = Y.Lang,
        Node = Y.Node,
        UA = Y.UA,
        Widget = Y.Widget,

        EMPTY = "",
        HD = "hd",
        BD = "bd",
        FT = "ft",
        HEADER = "header",
        BODY = "body",
        FOOTER = "footer",
        FILL_HEIGHT = "fillHeight",
        STDMOD = "stdmod",

        NODE_SUFFIX = "Node",
        CONTENT_SUFFIX = "Content",

        FIRST_CHILD = "firstChild",
        CHILD_NODES = "childNodes",
        OWNER_DOCUMENT = "ownerDocument",

        CONTENT_BOX = "contentBox",

        HEIGHT = "height",
        OFFSET_HEIGHT = "offsetHeight",
        AUTO = "auto",

        HeaderChange = "headerContentChange",
        BodyChange = "bodyContentChange",
        FooterChange = "footerContentChange",
        FillHeightChange = "fillHeightChange",
        HeightChange = "heightChange",
        ContentUpdate = "contentUpdate",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        APPLY_PARSED_CONFIG = "_applyParsedConfig",

        UI = Y.Widget.UI_SRC;

    /**
     * Widget extension, which can be used to add Standard Module support to the
     * base Widget class, through the <a href="Base.html#method_build">Base.build</a>
     * method.
     * <p>
     * The extension adds header, body and footer sections to the Widget's content box and
     * provides the corresponding methods and attributes to modify the contents of these sections.
     * </p>
     * @class WidgetStdMod
     * @param {Object} The user configuration object
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 62);
function StdMod(config) {

        _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "StdMod", 62);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 64);
this._stdModNode = this.get(CONTENT_BOX);

        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 66);
Y.before(this._renderUIStdMod, this, RENDERUI);
        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 67);
Y.before(this._bindUIStdMod, this, BINDUI);
        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 68);
Y.before(this._syncUIStdMod, this, SYNCUI);
    }

    /**
     * Constant used to refer the the standard module header, in methods which expect a section specifier
     *
     * @property HEADER
     * @static
     * @type String
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 78);
StdMod.HEADER = HEADER;

    /**
     * Constant used to refer the the standard module body, in methods which expect a section specifier
     *
     * @property BODY
     * @static
     * @type String
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 87);
StdMod.BODY = BODY;

    /**
     * Constant used to refer the the standard module footer, in methods which expect a section specifier
     *
     * @property FOOTER
     * @static
     * @type String
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 96);
StdMod.FOOTER = FOOTER;

    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * Inserts new content <em>before</em> the sections existing content.
     * </p>
     * @property AFTER
     * @static
     * @type String
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 108);
StdMod.AFTER = "after";

    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * Inserts new content <em>before</em> the sections existing content.
     * </p>
     * @property BEFORE
     * @static
     * @type String
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 120);
StdMod.BEFORE = "before";
    /**
     * Constant used to specify insertion position, when adding content to sections of the standard module in
     * methods which expect a "where" argument.
     * <p>
     * <em>Replaces</em> the sections existing content, with new content.
     * </p>
     * @property REPLACE
     * @static
     * @type String
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 131);
StdMod.REPLACE = "replace";

    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 133);
var STD_HEADER = StdMod.HEADER,
        STD_BODY = StdMod.BODY,
        STD_FOOTER = StdMod.FOOTER,

        HEADER_CONTENT = STD_HEADER + CONTENT_SUFFIX,
        FOOTER_CONTENT = STD_FOOTER + CONTENT_SUFFIX,
        BODY_CONTENT = STD_BODY + CONTENT_SUFFIX;

    /**
     * Static property used to define the default attribute
     * configuration introduced by WidgetStdMod.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 149);
StdMod.ATTRS = {

        /**
         * @attribute headerContent
         * @type HTML
         * @default undefined
         * @description The content to be added to the header section. This will replace any existing content
         * in the header. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        headerContent: {
            value:null
        },

        /**
         * @attribute footerContent
         * @type HTML
         * @default undefined
         * @description The content to be added to the footer section. This will replace any existing content
         * in the footer. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        footerContent: {
            value:null
        },

        /**
         * @attribute bodyContent
         * @type HTML
         * @default undefined
         * @description The content to be added to the body section. This will replace any existing content
         * in the body. If you want to append, or insert new content, use the <a href="#method_setStdModContent">setStdModContent</a> method.
         */
        bodyContent: {
            value:null
        },

        /**
         * @attribute fillHeight
         * @type {String}
         * @default WidgetStdMod.BODY
         * @description The section (WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER) which should be resized to fill the height of the standard module, when a
         * height is set on the Widget. If a height is not set on the widget, then all sections are sized based on
         * their content.
         */
        fillHeight: {
            value: StdMod.BODY,
            validator: function(val) {
                 _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "validator", 194);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 195);
return this._validateFillHeight(val);
            }
        }
    };

    /**
     * The HTML parsing rules for the WidgetStdMod class.
     *
     * @property HTML_PARSER
     * @static
     * @type Object
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 207);
StdMod.HTML_PARSER = {
        headerContent: function(contentBox) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "headerContent", 208);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 209);
return this._parseStdModHTML(STD_HEADER);
        },

        bodyContent: function(contentBox) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "bodyContent", 212);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 213);
return this._parseStdModHTML(STD_BODY);
        },

        footerContent : function(contentBox) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "footerContent", 216);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 217);
return this._parseStdModHTML(STD_FOOTER);
        }
    };

    /**
     * Static hash of default class names used for the header,
     * body and footer sections of the standard module, keyed by
     * the section identifier (WidgetStdMod.STD_HEADER, WidgetStdMod.STD_BODY, WidgetStdMod.STD_FOOTER)
     *
     * @property SECTION_CLASS_NAMES
     * @static
     * @type Object
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 230);
StdMod.SECTION_CLASS_NAMES = {
        header: Widget.getClassName(HD),
        body: Widget.getClassName(BD),
        footer: Widget.getClassName(FT)
    };

    /**
     * The template HTML strings for each of the standard module sections. Section entries are keyed by the section constants,
     * WidgetStdMod.HEADER, WidgetStdMod.BODY, WidgetStdMod.FOOTER, and contain the HTML to be added for each section.
     * e.g.
     * <pre>
     *    {
     *       header : '&lt;div class="yui-widget-hd"&gt;&lt;/div&gt;',
     *       body : '&lt;div class="yui-widget-bd"&gt;&lt;/div&gt;',
     *       footer : '&lt;div class="yui-widget-ft"&gt;&lt;/div&gt;'
     *    }
     * </pre>
     * @property TEMPLATES
     * @type Object
     * @static
     */
    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 251);
StdMod.TEMPLATES = {
        header : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_HEADER] + '"></div>',
        body : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_BODY] + '"></div>',
        footer : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_FOOTER] + '"></div>'
    };

    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 257);
StdMod.prototype = {

        /**
         * Synchronizes the UI to match the Widgets standard module state.
         * <p>
         * This method is invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIStdMod
         * @protected
         */
        _syncUIStdMod : function() {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_syncUIStdMod", 268);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 269);
var stdModParsed = this._stdModParsed;

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 271);
if (!stdModParsed || !stdModParsed[HEADER_CONTENT]) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 272);
this._uiSetStdMod(STD_HEADER, this.get(HEADER_CONTENT));
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 275);
if (!stdModParsed || !stdModParsed[BODY_CONTENT]) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 276);
this._uiSetStdMod(STD_BODY, this.get(BODY_CONTENT));
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 279);
if (!stdModParsed || !stdModParsed[FOOTER_CONTENT]) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 280);
this._uiSetStdMod(STD_FOOTER, this.get(FOOTER_CONTENT));
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 283);
this._uiSetFillHeight(this.get(FILL_HEIGHT));
        },

        /**
         * Creates/Initializes the DOM for standard module support.
         * <p>
         * This method is invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIStdMod
         * @protected
         */
        _renderUIStdMod : function() {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_renderUIStdMod", 295);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 296);
this._stdModNode.addClass(Widget.getClassName(STDMOD));
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 297);
this._renderStdModSections();

            //This normally goes in bindUI but in order to allow setStdModContent() to work before renderUI
            //stage, these listeners should be set up at the earliest possible time.
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 301);
this.after(HeaderChange, this._afterHeaderChange);
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 302);
this.after(BodyChange, this._afterBodyChange);
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 303);
this.after(FooterChange, this._afterFooterChange);
        },

        _renderStdModSections : function() {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_renderStdModSections", 306);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 307);
if (L.isValue(this.get(HEADER_CONTENT))) { this._renderStdMod(STD_HEADER); }
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 308);
if (L.isValue(this.get(BODY_CONTENT))) { this._renderStdMod(STD_BODY); }
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 309);
if (L.isValue(this.get(FOOTER_CONTENT))) { this._renderStdMod(STD_FOOTER); }
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to
         * Widget standard module related state changes.
         * <p>
         * This method is invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIStdMod
         * @protected
         */
        _bindUIStdMod : function() {
            // this.after(HeaderChange, this._afterHeaderChange);
            // this.after(BodyChange, this._afterBodyChange);
            // this.after(FooterChange, this._afterFooterChange);

            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_bindUIStdMod", 322);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 327);
this.after(FillHeightChange, this._afterFillHeightChange);
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 328);
this.after(HeightChange, this._fillHeight);
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 329);
this.after(ContentUpdate, this._fillHeight);
        },

        /**
         * Default attribute change listener for the headerContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterHeaderChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterHeaderChange : function(e) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_afterHeaderChange", 340);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 341);
if (e.src !== UI) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 342);
this._uiSetStdMod(STD_HEADER, e.newVal, e.stdModPosition);
            }
        },

        /**
         * Default attribute change listener for the bodyContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterBodyChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterBodyChange : function(e) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_afterBodyChange", 354);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 355);
if (e.src !== UI) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 356);
this._uiSetStdMod(STD_BODY, e.newVal, e.stdModPosition);
            }
        },

        /**
         * Default attribute change listener for the footerContent attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterFooterChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterFooterChange : function(e) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_afterFooterChange", 368);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 369);
if (e.src !== UI) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 370);
this._uiSetStdMod(STD_FOOTER, e.newVal, e.stdModPosition);
            }
        },

        /**
         * Default attribute change listener for the fillHeight attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterFillHeightChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterFillHeightChange: function (e) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_afterFillHeightChange", 382);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 383);
this._uiSetFillHeight(e.newVal);
        },

        /**
         * Default validator for the fillHeight attribute. Verifies that the
         * value set is a valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER,
         * or a falsey value if fillHeight is to be disabled.
         *
         * @method _validateFillHeight
         * @protected
         * @param {String} val The section which should be setup to fill height, or false/null to disable fillHeight
         * @return true if valid, false if not
         */
        _validateFillHeight : function(val) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_validateFillHeight", 396);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 397);
return !val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER;
        },

        /**
         * Updates the rendered UI, to resize the provided section so that the standard module fills out
         * the specified widget height. Note: This method does not check whether or not a height is set
         * on the Widget.
         *
         * @method _uiSetFillHeight
         * @protected
         * @param {String} fillSection A valid section specifier - one of WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER
         */
        _uiSetFillHeight : function(fillSection) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_uiSetFillHeight", 409);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 410);
var fillNode = this.getStdModNode(fillSection);
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 411);
var currNode = this._currFillNode;

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 413);
if (currNode && fillNode !== currNode){
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 414);
currNode.setStyle(HEIGHT, EMPTY);
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 417);
if (fillNode) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 418);
this._currFillNode = fillNode;
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 421);
this._fillHeight();
        },

        /**
         * Updates the rendered UI, to resize the current section specified by the fillHeight attribute, so
         * that the standard module fills out the Widget height. If a height has not been set on Widget,
         * the section is not resized (height is set to "auto").
         *
         * @method _fillHeight
         * @private
         */
        _fillHeight : function() {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_fillHeight", 432);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 433);
if (this.get(FILL_HEIGHT)) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 434);
var height = this.get(HEIGHT);
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 435);
if (height != EMPTY && height != AUTO) {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 436);
this.fillHeight(this._currFillNode);
                }
            }
        },

        /**
         * Updates the rendered UI, adding the provided content (either an HTML string, or node reference),
         * to the specified section. The content is either added before, after or replaces existing content
         * in the section, based on the value of the <code>where</code> argument.
         *
         * @method _uiSetStdMod
         * @protected
         *
         * @param {String} section The section to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {String | Node} content The new content (either as an HTML string, or Node reference) to add to the section
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the section.
         */
        _uiSetStdMod : function(section, content, where) {
            // Using isValue, so that "" is valid content
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_uiSetStdMod", 454);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 456);
if (L.isValue(content)) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 457);
var node = this.getStdModNode(section, true);

                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 459);
this._addStdModContent(node, content, where);

                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 461);
this.set(section + CONTENT_SUFFIX, this._getStdModContent(section), {src:UI});
            } else {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 463);
this._eraseStdMod(section);
            }
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 465);
this.fire(ContentUpdate);
        },

        /**
         * Creates the DOM node for the given section, and inserts it into the correct location in the contentBox.
         *
         * @method _renderStdMod
         * @protected
         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} A reference to the added section node
         */
        _renderStdMod : function(section) {

            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_renderStdMod", 476);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 478);
var contentBox = this.get(CONTENT_BOX),
                sectionNode = this._findStdModSection(section);

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 481);
if (!sectionNode) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 482);
sectionNode = this._getStdModTemplate(section);
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 485);
this._insertStdModSection(contentBox, section, sectionNode);

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 487);
this[section + NODE_SUFFIX] = sectionNode;
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 488);
return this[section + NODE_SUFFIX];
        },

        /**
         * Removes the DOM node for the given section.
         *
         * @method _eraseStdMod
         * @protected
         * @param {String} section The section to remove. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         */
        _eraseStdMod : function(section) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_eraseStdMod", 498);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 499);
var sectionNode = this.getStdModNode(section);
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 500);
if (sectionNode) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 501);
sectionNode.remove(true);
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 502);
delete this[section + NODE_SUFFIX];
            }
        },

        /**
         * Helper method to insert the Node for the given section into the correct location in the contentBox.
         *
         * @method _insertStdModSection
         * @private
         * @param {Node} contentBox A reference to the Widgets content box.
         * @param {String} section The section to create/render. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {Node} sectionNode The Node for the section.
         */
        _insertStdModSection : function(contentBox, section, sectionNode) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_insertStdModSection", 515);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 516);
var fc = contentBox.get(FIRST_CHILD);

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 518);
if (section === STD_FOOTER || !fc) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 519);
contentBox.appendChild(sectionNode);
            } else {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 521);
if (section === STD_HEADER) {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 522);
contentBox.insertBefore(sectionNode, fc);
                } else {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 524);
var footer = this[STD_FOOTER + NODE_SUFFIX];
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 525);
if (footer) {
                        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 526);
contentBox.insertBefore(sectionNode, footer);
                    } else {
                        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 528);
contentBox.appendChild(sectionNode);
                    }
                }
            }
        },

        /**
         * Gets a new Node reference for the given standard module section, by cloning
         * the stored template node.
         *
         * @method _getStdModTemplate
         * @protected
         * @param {String} section The section to create a new node for. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The new Node instance for the section
         */
        _getStdModTemplate : function(section) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_getStdModTemplate", 543);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 544);
return Node.create(StdMod.TEMPLATES[section], this._stdModNode.get(OWNER_DOCUMENT));
        },

        /**
         * Helper method to add content to a StdMod section node.
         * The content is added either before, after or replaces the existing node content
         * based on the value of the <code>where</code> argument.
         *
         * @method _addStdModContent
         * @private
         *
         * @param {Node} node The section Node to be updated.
         * @param {Node|NodeList|String} children The new content Node, NodeList or String to be added to section Node provided.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the Node.
         */
        _addStdModContent : function(node, children, where) {

            // StdMod where to Node where
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_addStdModContent", 560);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 563);
switch (where) {
                case StdMod.BEFORE:  // 0 is before fistChild
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 565);
where = 0;
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 566);
break;
                case StdMod.AFTER:   // undefined is appendChild
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 568);
where = undefined;
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 569);
break;
                default:            // replace is replace, not specified is replace
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 571);
where = StdMod.REPLACE;
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 574);
node.insert(children, where);
        },

        /**
         * Helper method to obtain the precise height of the node provided, including padding and border.
         * The height could be a sub-pixel value for certain browsers, such as Firefox 3.
         *
         * @method _getPreciseHeight
         * @private
         * @param {Node} node The node for which the precise height is required.
         * @return {Number} The height of the Node including borders and padding, possibly a float.
         */
        _getPreciseHeight : function(node) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_getPreciseHeight", 586);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 587);
var height = (node) ? node.get(OFFSET_HEIGHT) : 0,
                getBCR = "getBoundingClientRect";

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 590);
if (node && node.hasMethod(getBCR)) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 591);
var preciseRegion = node.invoke(getBCR);
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 592);
if (preciseRegion) {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 593);
height = preciseRegion.bottom - preciseRegion.top;
                }
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 597);
return height;
        },

        /**
         * Helper method to to find the rendered node for the given section,
         * if it exists.
         *
         * @method _findStdModSection
         * @private
         * @param {String} section The section for which the render Node is to be found. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The rendered node for the given section, or null if not found.
         */
        _findStdModSection: function(section) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_findStdModSection", 609);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 610);
return this.get(CONTENT_BOX).one("> ." + StdMod.SECTION_CLASS_NAMES[section]);
        },

        /**
         * Utility method, used by WidgetStdMods HTML_PARSER implementation
         * to extract data for each section from markup.
         *
         * @method _parseStdModHTML
         * @private
         * @param {String} section
         * @return {String} Inner HTML string with the contents of the section
         */
        _parseStdModHTML : function(section) {

            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_parseStdModHTML", 622);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 624);
var node = this._findStdModSection(section);

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 626);
if (node) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 627);
if (!this._stdModParsed) {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 628);
this._stdModParsed = {};
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 629);
Y.before(this._applyStdModParsedConfig, this, APPLY_PARSED_CONFIG);
                }
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 631);
this._stdModParsed[section + CONTENT_SUFFIX] = 1;

                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 633);
return node.get("innerHTML");
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 636);
return null;
        },

        /**
         * This method is injected before the _applyParsedConfig step in
         * the application of HTML_PARSER, and sets up the state to
         * identify whether or not we should remove the current DOM content
         * or not, based on whether or not the current content attribute value
         * was extracted from the DOM, or provided by the user configuration
         *
         * @method _applyStdModParsedConfig
         * @private
         */
        _applyStdModParsedConfig : function(node, cfg, parsedCfg) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_applyStdModParsedConfig", 649);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 650);
var parsed = this._stdModParsed;
            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 651);
if (parsed) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 652);
parsed[HEADER_CONTENT] = !(HEADER_CONTENT in cfg) && (HEADER_CONTENT in parsed);
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 653);
parsed[BODY_CONTENT] = !(BODY_CONTENT in cfg) && (BODY_CONTENT in parsed);
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 654);
parsed[FOOTER_CONTENT] = !(FOOTER_CONTENT in cfg) && (FOOTER_CONTENT in parsed);
            }
        },

        /**
         * Retrieves the child nodes (content) of a standard module section
         *
         * @method _getStdModContent
         * @private
         * @param {String} section The standard module section whose child nodes are to be retrieved. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @return {Node} The child node collection of the standard module section.
         */
        _getStdModContent : function(section) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "_getStdModContent", 666);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 667);
return (this[section + NODE_SUFFIX]) ? this[section + NODE_SUFFIX].get(CHILD_NODES) : null;
        },

        /**
         * Updates the body section of the standard module with the content provided (either an HTML string, or node reference).
         * <p>
         * This method can be used instead of the corresponding section content attribute if you'd like to retain the current content of the section,
         * and insert content before or after it, by specifying the <code>where</code> argument.
         * </p>
         * @method setStdModContent
         * @param {String} section The standard module section whose content is to be updated. Either WidgetStdMod.HEADER, WidgetStdMod.BODY or WidgetStdMod.FOOTER.
         * @param {String | Node} content The content to be added, either an HTML string or a Node reference.
         * @param {String} where Optional. Either WidgetStdMod.AFTER, WidgetStdMod.BEFORE or WidgetStdMod.REPLACE.
         * If not provided, the content will replace existing content in the section.
         */
        setStdModContent : function(section, content, where) {
            //var node = this.getStdModNode(section) || this._renderStdMod(section);
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "setStdModContent", 682);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 684);
this.set(section + CONTENT_SUFFIX, content, {stdModPosition:where});
            //this._addStdModContent(node, content, where);
        },

        /**
        Returns the node reference for the specified `section`.

        **Note:** The DOM is not queried for the node reference. The reference
        stored by the widget instance is returned if it was set. Passing a
        truthy for `forceCreate` will create the section node if it does not
        already exist.

        @method getStdModNode
        @param {String} section The section whose node reference is required.
            Either `WidgetStdMod.HEADER`, `WidgetStdMod.BODY`, or
            `WidgetStdMod.FOOTER`.
        @param {Boolean} forceCreate Whether the section node should be created
            if it does not already exist.
        @return {Node} The node reference for the `section`, or null if not set.
        **/
        getStdModNode : function(section, forceCreate) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "getStdModNode", 704);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 705);
var node = this[section + NODE_SUFFIX] || null;

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 707);
if (!node && forceCreate) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 708);
node = this._renderStdMod(section);
            }

            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 711);
return node;
        },

        /**
         * Sets the height on the provided header, body or footer element to
         * fill out the height of the Widget. It determines the height of the
         * widgets bounding box, based on it's configured height value, and
         * sets the height of the provided section to fill out any
         * space remaining after the other standard module section heights
         * have been accounted for.
         *
         * <p><strong>NOTE:</strong> This method is not designed to work if an explicit
         * height has not been set on the Widget, since for an "auto" height Widget,
         * the heights of the header/body/footer will drive the height of the Widget.</p>
         *
         * @method fillHeight
         * @param {Node} node The node which should be resized to fill out the height
         * of the Widget bounding box. Should be a standard module section node which belongs
         * to the widget.
         */
        fillHeight : function(node) {
            _yuitest_coverfunc("build/widget-stdmod/widget-stdmod.js", "fillHeight", 731);
_yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 732);
if (node) {
                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 733);
var contentBox = this.get(CONTENT_BOX),
                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],
                    stdModNode,
                    cbContentHeight,
                    filled = 0,
                    remaining = 0,

                    validNode = false;

                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 742);
for (var i = 0, l = stdModNodes.length; i < l; i++) {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 743);
stdModNode = stdModNodes[i];
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 744);
if (stdModNode) {
                        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 745);
if (stdModNode !== node) {
                            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 746);
filled += this._getPreciseHeight(stdModNode);
                        } else {
                            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 748);
validNode = true;
                        }
                    }
                }

                _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 753);
if (validNode) {
                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 754);
if (UA.ie || UA.opera) {
                        // Need to set height to 0, to allow height to be reduced
                        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 756);
node.set(OFFSET_HEIGHT, 0);
                    }

                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 759);
cbContentHeight = contentBox.get(OFFSET_HEIGHT) -
                            parseInt(contentBox.getComputedStyle("paddingTop"), 10) -
                            parseInt(contentBox.getComputedStyle("paddingBottom"), 10) -
                            parseInt(contentBox.getComputedStyle("borderBottomWidth"), 10) -
                            parseInt(contentBox.getComputedStyle("borderTopWidth"), 10);

                    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 765);
if (L.isNumber(cbContentHeight)) {
                        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 766);
remaining = cbContentHeight - filled;
                        _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 767);
if (remaining >= 0) {
                            _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 768);
node.set(OFFSET_HEIGHT, remaining);
                        }
                    }
                }
            }
        }
    };

    _yuitest_coverline("build/widget-stdmod/widget-stdmod.js", 776);
Y.WidgetStdMod = StdMod;


}, '3.7.3', {"requires": ["base-build", "widget"]});
