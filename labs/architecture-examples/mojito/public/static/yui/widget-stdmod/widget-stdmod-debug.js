/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-stdmod', function (Y, NAME) {

/**
 * Provides standard module support for Widgets through an extension.
 *
 * @module widget-stdmod
 */
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
    function StdMod(config) {

        this._stdModNode = this.get(CONTENT_BOX);

        Y.before(this._renderUIStdMod, this, RENDERUI);
        Y.before(this._bindUIStdMod, this, BINDUI);
        Y.before(this._syncUIStdMod, this, SYNCUI);
    }

    /**
     * Constant used to refer the the standard module header, in methods which expect a section specifier
     *
     * @property HEADER
     * @static
     * @type String
     */
    StdMod.HEADER = HEADER;

    /**
     * Constant used to refer the the standard module body, in methods which expect a section specifier
     *
     * @property BODY
     * @static
     * @type String
     */
    StdMod.BODY = BODY;

    /**
     * Constant used to refer the the standard module footer, in methods which expect a section specifier
     *
     * @property FOOTER
     * @static
     * @type String
     */
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
    StdMod.REPLACE = "replace";

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
    StdMod.HTML_PARSER = {
        headerContent: function(contentBox) {
            return this._parseStdModHTML(STD_HEADER);
        },

        bodyContent: function(contentBox) {
            return this._parseStdModHTML(STD_BODY);
        },

        footerContent : function(contentBox) {
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
    StdMod.TEMPLATES = {
        header : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_HEADER] + '"></div>',
        body : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_BODY] + '"></div>',
        footer : '<div class="' + StdMod.SECTION_CLASS_NAMES[STD_FOOTER] + '"></div>'
    };

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
            var stdModParsed = this._stdModParsed;

            if (!stdModParsed || !stdModParsed[HEADER_CONTENT]) {
                this._uiSetStdMod(STD_HEADER, this.get(HEADER_CONTENT));
            }

            if (!stdModParsed || !stdModParsed[BODY_CONTENT]) {
                this._uiSetStdMod(STD_BODY, this.get(BODY_CONTENT));
            }

            if (!stdModParsed || !stdModParsed[FOOTER_CONTENT]) {
                this._uiSetStdMod(STD_FOOTER, this.get(FOOTER_CONTENT));
            }

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
            this._stdModNode.addClass(Widget.getClassName(STDMOD));
            this._renderStdModSections();

            //This normally goes in bindUI but in order to allow setStdModContent() to work before renderUI
            //stage, these listeners should be set up at the earliest possible time.
            this.after(HeaderChange, this._afterHeaderChange);
            this.after(BodyChange, this._afterBodyChange);
            this.after(FooterChange, this._afterFooterChange);
        },

        _renderStdModSections : function() {
            if (L.isValue(this.get(HEADER_CONTENT))) { this._renderStdMod(STD_HEADER); }
            if (L.isValue(this.get(BODY_CONTENT))) { this._renderStdMod(STD_BODY); }
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

            this.after(FillHeightChange, this._afterFillHeightChange);
            this.after(HeightChange, this._fillHeight);
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
            if (e.src !== UI) {
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
            if (e.src !== UI) {
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
            if (e.src !== UI) {
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
            var fillNode = this.getStdModNode(fillSection);
            var currNode = this._currFillNode;

            if (currNode && fillNode !== currNode){
                currNode.setStyle(HEIGHT, EMPTY);
            }

            if (fillNode) {
                this._currFillNode = fillNode;
            }

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
            if (this.get(FILL_HEIGHT)) {
                var height = this.get(HEIGHT);
                if (height != EMPTY && height != AUTO) {
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
            if (L.isValue(content)) {
                var node = this.getStdModNode(section, true);

                this._addStdModContent(node, content, where);

                this.set(section + CONTENT_SUFFIX, this._getStdModContent(section), {src:UI});
            } else {
                this._eraseStdMod(section);
            }
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

            var contentBox = this.get(CONTENT_BOX),
                sectionNode = this._findStdModSection(section);

            if (!sectionNode) {
                sectionNode = this._getStdModTemplate(section);
            }

            this._insertStdModSection(contentBox, section, sectionNode);

            this[section + NODE_SUFFIX] = sectionNode;
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
            var sectionNode = this.getStdModNode(section);
            if (sectionNode) {
                sectionNode.remove(true);
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
            var fc = contentBox.get(FIRST_CHILD);

            if (section === STD_FOOTER || !fc) {
                contentBox.appendChild(sectionNode);
            } else {
                if (section === STD_HEADER) {
                    contentBox.insertBefore(sectionNode, fc);
                } else {
                    var footer = this[STD_FOOTER + NODE_SUFFIX];
                    if (footer) {
                        contentBox.insertBefore(sectionNode, footer);
                    } else {
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
            switch (where) {
                case StdMod.BEFORE:  // 0 is before fistChild
                    where = 0;
                    break;
                case StdMod.AFTER:   // undefined is appendChild
                    where = undefined;
                    break;
                default:            // replace is replace, not specified is replace
                    where = StdMod.REPLACE;
            }

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
            var height = (node) ? node.get(OFFSET_HEIGHT) : 0,
                getBCR = "getBoundingClientRect";

            if (node && node.hasMethod(getBCR)) {
                var preciseRegion = node.invoke(getBCR);
                if (preciseRegion) {
                    height = preciseRegion.bottom - preciseRegion.top;
                }
            }

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

            var node = this._findStdModSection(section);

            if (node) {
                if (!this._stdModParsed) {
                    this._stdModParsed = {};
                    Y.before(this._applyStdModParsedConfig, this, APPLY_PARSED_CONFIG);
                }
                this._stdModParsed[section + CONTENT_SUFFIX] = 1;

                return node.get("innerHTML");
            }

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
            var parsed = this._stdModParsed;
            if (parsed) {
                parsed[HEADER_CONTENT] = !(HEADER_CONTENT in cfg) && (HEADER_CONTENT in parsed);
                parsed[BODY_CONTENT] = !(BODY_CONTENT in cfg) && (BODY_CONTENT in parsed);
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
            var node = this[section + NODE_SUFFIX] || null;

            if (!node && forceCreate) {
                node = this._renderStdMod(section);
            }

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
            if (node) {
                var contentBox = this.get(CONTENT_BOX),
                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],
                    stdModNode,
                    cbContentHeight,
                    filled = 0,
                    remaining = 0,

                    validNode = false;

                for (var i = 0, l = stdModNodes.length; i < l; i++) {
                    stdModNode = stdModNodes[i];
                    if (stdModNode) {
                        if (stdModNode !== node) {
                            filled += this._getPreciseHeight(stdModNode);
                        } else {
                            validNode = true;
                        }
                    }
                }

                if (validNode) {
                    if (UA.ie || UA.opera) {
                        // Need to set height to 0, to allow height to be reduced
                        node.set(OFFSET_HEIGHT, 0);
                    }

                    cbContentHeight = contentBox.get(OFFSET_HEIGHT) -
                            parseInt(contentBox.getComputedStyle("paddingTop"), 10) -
                            parseInt(contentBox.getComputedStyle("paddingBottom"), 10) -
                            parseInt(contentBox.getComputedStyle("borderBottomWidth"), 10) -
                            parseInt(contentBox.getComputedStyle("borderTopWidth"), 10);

                    if (L.isNumber(cbContentHeight)) {
                        remaining = cbContentHeight - filled;
                        if (remaining >= 0) {
                            node.set(OFFSET_HEIGHT, remaining);
                        }
                    }
                }
            }
        }
    };

    Y.WidgetStdMod = StdMod;


}, '3.7.3', {"requires": ["base-build", "widget"]});
