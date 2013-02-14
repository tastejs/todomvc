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
_yuitest_coverage["build/widget-stack/widget-stack.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-stack/widget-stack.js",
    code: []
};
_yuitest_coverage["build/widget-stack/widget-stack.js"].code=["YUI.add('widget-stack', function (Y, NAME) {","","/**"," * Provides stackable (z-index) support for Widgets through an extension."," *"," * @module widget-stack"," */","    var L = Y.Lang,","        UA = Y.UA,","        Node = Y.Node,","        Widget = Y.Widget,","","        ZINDEX = \"zIndex\",","        SHIM = \"shim\",","        VISIBLE = \"visible\",","","        BOUNDING_BOX = \"boundingBox\",","","        RENDER_UI = \"renderUI\",","        BIND_UI = \"bindUI\",","        SYNC_UI = \"syncUI\",","","        OFFSET_WIDTH = \"offsetWidth\",","        OFFSET_HEIGHT = \"offsetHeight\",","        PARENT_NODE = \"parentNode\",","        FIRST_CHILD = \"firstChild\",","        OWNER_DOCUMENT = \"ownerDocument\",","","        WIDTH = \"width\",","        HEIGHT = \"height\",","        PX = \"px\",","","        // HANDLE KEYS","        SHIM_DEFERRED = \"shimdeferred\",","        SHIM_RESIZE = \"shimresize\",","","        // Events","        VisibleChange = \"visibleChange\",","        WidthChange = \"widthChange\",","        HeightChange = \"heightChange\",","        ShimChange = \"shimChange\",","        ZIndexChange = \"zIndexChange\",","        ContentUpdate = \"contentUpdate\",","","        // CSS","        STACKED = \"stacked\";","","    /**","     * Widget extension, which can be used to add stackable (z-index) support to the","     * base Widget class along with a shimming solution, through the","     * <a href=\"Base.html#method_build\">Base.build</a> method.","     *","     * @class WidgetStack","     * @param {Object} User configuration object","     */","    function Stack(config) {","        this._stackNode = this.get(BOUNDING_BOX);","        this._stackHandles = {};","","        // WIDGET METHOD OVERLAP","        Y.after(this._renderUIStack, this, RENDER_UI);","        Y.after(this._syncUIStack, this, SYNC_UI);","        Y.after(this._bindUIStack, this, BIND_UI);","    }","","    // Static Properties","    /**","     * Static property used to define the default attribute","     * configuration introduced by WidgetStack.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    Stack.ATTRS = {","        /**","         * @attribute shim","         * @type boolean","         * @default false, for all browsers other than IE6, for which a shim is enabled by default.","         *","         * @description Boolean flag to indicate whether or not a shim should be added to the Widgets","         * boundingBox, to protect it from select box bleedthrough.","         */","        shim: {","            value: (UA.ie == 6)","        },","","        /**","         * @attribute zIndex","         * @type number","         * @default 0","         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for","         * zIndex will be converted to 0","         */","        zIndex: {","            value : 0,","            setter: '_setZIndex'","        }","    };","","    /**","     * The HTML parsing rules for the WidgetStack class.","     *","     * @property HTML_PARSER","     * @static","     * @type Object","     */","    Stack.HTML_PARSER = {","        zIndex: function (srcNode) {","            return this._parseZIndex(srcNode);","        }","    };","","    /**","     * Default class used to mark the shim element","     *","     * @property SHIM_CLASS_NAME","     * @type String","     * @static","     * @default \"yui3-widget-shim\"","     */","    Stack.SHIM_CLASS_NAME = Widget.getClassName(SHIM);","","    /**","     * Default class used to mark the boundingBox of a stacked widget.","     *","     * @property STACKED_CLASS_NAME","     * @type String","     * @static","     * @default \"yui3-widget-stacked\"","     */","    Stack.STACKED_CLASS_NAME = Widget.getClassName(STACKED);","","    /**","     * Default markup template used to generate the shim element.","     *","     * @property SHIM_TEMPLATE","     * @type String","     * @static","     */","    Stack.SHIM_TEMPLATE = '<iframe class=\"' + Stack.SHIM_CLASS_NAME + '\" frameborder=\"0\" title=\"Widget Stacking Shim\" src=\"javascript:false\" tabindex=\"-1\" role=\"presentation\"></iframe>';","","    Stack.prototype = {","","        /**","         * Synchronizes the UI to match the Widgets stack state. This method in","         * invoked after syncUI is invoked for the Widget class using YUI's aop infrastructure.","         *","         * @method _syncUIStack","         * @protected","         */","        _syncUIStack: function() {","            this._uiSetShim(this.get(SHIM));","            this._uiSetZIndex(this.get(ZINDEX));","        },","","        /**","         * Binds event listeners responsible for updating the UI state in response to","         * Widget stack related state changes.","         * <p>","         * This method is invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIStack","         * @protected","         */","        _bindUIStack: function() {","            this.after(ShimChange, this._afterShimChange);","            this.after(ZIndexChange, this._afterZIndexChange);","        },","","        /**","         * Creates/Initializes the DOM to support stackability.","         * <p>","         * This method in invoked after renderUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _renderUIStack","         * @protected","         */","        _renderUIStack: function() {","            this._stackNode.addClass(Stack.STACKED_CLASS_NAME);","        },","","        /**","        Parses a `zIndex` attribute value from this widget's `srcNode`.","","        @method _parseZIndex","        @param {Node} srcNode The node to parse a `zIndex` value from.","        @return {Mixed} The parsed `zIndex` value.","        @protected","        **/","        _parseZIndex: function (srcNode) {","            var zIndex;","","            // Prefers how WebKit handles `z-index` which better matches the","            // spec:","            //","            // * http://www.w3.org/TR/CSS2/visuren.html#z-index","            // * https://bugs.webkit.org/show_bug.cgi?id=15562","            //","            // When a node isn't rendered in the document, and/or when a","            // node is not positioned, then it doesn't have a context to derive","            // a valid `z-index` value from.","            if (!srcNode.inDoc() || srcNode.getStyle('position') === 'static') {","                zIndex = 'auto';","            } else {","                // Uses `getComputedStyle()` because it has greater accuracy in","                // more browsers than `getStyle()` does for `z-index`.","                zIndex = srcNode.getComputedStyle('zIndex');","            }","","            // This extension adds a stacking context to widgets, therefore a","            // `srcNode` witout a stacking context (i.e. \"auto\") will return","            // `null` from this DOM parser. This way the widget's default or","            // user provided value for `zIndex` will be used.","            return zIndex === 'auto' ? null : zIndex;","        },","","        /**","         * Default setter for zIndex attribute changes. Normalizes zIndex values to","         * numbers, converting non-numerical values to 0.","         *","         * @method _setZIndex","         * @protected","         * @param {String | Number} zIndex","         * @return {Number} Normalized zIndex","         */","        _setZIndex: function(zIndex) {","            if (L.isString(zIndex)) {","                zIndex = parseInt(zIndex, 10);","            }","            if (!L.isNumber(zIndex)) {","                zIndex = 0;","            }","            return zIndex;","        },","","        /**","         * Default attribute change listener for the shim attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterShimChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterShimChange : function(e) {","            this._uiSetShim(e.newVal);","        },","","        /**","         * Default attribute change listener for the zIndex attribute, responsible","         * for updating the UI, in response to attribute changes.","         *","         * @method _afterZIndexChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterZIndexChange : function(e) {","            this._uiSetZIndex(e.newVal);","        },","","        /**","         * Updates the UI to reflect the zIndex value passed in.","         *","         * @method _uiSetZIndex","         * @protected","         * @param {number} zIndex The zindex to be reflected in the UI","         */","        _uiSetZIndex: function (zIndex) {","            this._stackNode.setStyle(ZINDEX, zIndex);","        },","","        /**","         * Updates the UI to enable/disable the shim. If the widget is not currently visible,","         * creation of the shim is deferred until it is made visible, for performance reasons.","         *","         * @method _uiSetShim","         * @protected","         * @param {boolean} enable If true, creates/renders the shim, if false, removes it.","         */","        _uiSetShim: function (enable) {","            if (enable) {","                // Lazy creation","                if (this.get(VISIBLE)) {","                    this._renderShim();","                } else {","                    this._renderShimDeferred();","                }","","                // Eagerly attach resize handlers","                //","                // Required because of Event stack behavior, commit ref: cd8dddc","                // Should be revisted after Ticket #2531067 is resolved.","                if (UA.ie == 6) {","                    this._addShimResizeHandlers();","                }","            } else {","                this._destroyShim();","            }","        },","","        /**","         * Sets up change handlers for the visible attribute, to defer shim creation/rendering","         * until the Widget is made visible.","         *","         * @method _renderShimDeferred","         * @private","         */","        _renderShimDeferred : function() {","","            this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];","","            var handles = this._stackHandles[SHIM_DEFERRED],","                createBeforeVisible = function(e) {","                    if (e.newVal) {","                        this._renderShim();","                    }","                };","","            handles.push(this.on(VisibleChange, createBeforeVisible));","            // Depending how how Ticket #2531067 is resolved, a reversal of","            // commit ref: cd8dddc could lead to a more elagent solution, with","            // the addition of this line here:","            //","            // handles.push(this.after(VisibleChange, this.sizeShim));","        },","","        /**","         * Sets up event listeners to resize the shim when the size of the Widget changes.","         * <p>","         * NOTE: This method is only used for IE6 currently, since IE6 doesn't support a way to","         * resize the shim purely through CSS, when the Widget does not have an explicit width/height","         * set.","         * </p>","         * @method _addShimResizeHandlers","         * @private","         */","        _addShimResizeHandlers : function() {","","            this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];","","            var sizeShim = this.sizeShim,","                handles = this._stackHandles[SHIM_RESIZE];","","            handles.push(this.after(VisibleChange, sizeShim));","            handles.push(this.after(WidthChange, sizeShim));","            handles.push(this.after(HeightChange, sizeShim));","            handles.push(this.after(ContentUpdate, sizeShim));","        },","","        /**","         * Detaches any handles stored for the provided key","         *","         * @method _detachStackHandles","         * @param String handleKey The key defining the group of handles which should be detached","         * @private","         */","        _detachStackHandles : function(handleKey) {","            var handles = this._stackHandles[handleKey],","                handle;","","            if (handles && handles.length > 0) {","                while((handle = handles.pop())) {","                    handle.detach();","                }","            }","        },","","        /**","         * Creates the shim element and adds it to the DOM","         *","         * @method _renderShim","         * @private","         */","        _renderShim : function() {","            var shimEl = this._shimNode,","                stackEl = this._stackNode;","","            if (!shimEl) {","                shimEl = this._shimNode = this._getShimTemplate();","                stackEl.insertBefore(shimEl, stackEl.get(FIRST_CHILD));","","                this._detachStackHandles(SHIM_DEFERRED);","                this.sizeShim();","            }","        },","","        /**","         * Removes the shim from the DOM, and detaches any related event","         * listeners.","         *","         * @method _destroyShim","         * @private","         */","        _destroyShim : function() {","            if (this._shimNode) {","                this._shimNode.get(PARENT_NODE).removeChild(this._shimNode);","                this._shimNode = null;","","                this._detachStackHandles(SHIM_DEFERRED);","                this._detachStackHandles(SHIM_RESIZE);","            }","        },","","        /**","         * For IE6, synchronizes the size and position of iframe shim to that of","         * Widget bounding box which it is protecting. For all other browsers,","         * this method does not do anything.","         *","         * @method sizeShim","         */","        sizeShim: function () {","            var shim = this._shimNode,","                node = this._stackNode;","","            if (shim && UA.ie === 6 && this.get(VISIBLE)) {","                shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);","                shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);","            }","        },","","        /**","         * Creates a cloned shim node, using the SHIM_TEMPLATE html template, for use on a new instance.","         *","         * @method _getShimTemplate","         * @private","         * @return {Node} node A new shim Node instance.","         */","        _getShimTemplate : function() {","            return Node.create(Stack.SHIM_TEMPLATE, this._stackNode.get(OWNER_DOCUMENT));","        }","    };","","    Y.WidgetStack = Stack;","","","}, '3.7.3', {\"requires\": [\"base-build\", \"widget\"], \"skinnable\": true});"];
_yuitest_coverage["build/widget-stack/widget-stack.js"].lines = {"1":0,"8":0,"56":0,"57":0,"58":0,"61":0,"62":0,"63":0,"75":0,"108":0,"110":0,"122":0,"132":0,"141":0,"143":0,"153":0,"154":0,"168":0,"169":0,"182":0,"194":0,"205":0,"206":0,"210":0,"217":0,"230":0,"231":0,"233":0,"234":0,"236":0,"248":0,"260":0,"271":0,"283":0,"285":0,"286":0,"288":0,"295":0,"296":0,"299":0,"312":0,"314":0,"316":0,"317":0,"321":0,"341":0,"343":0,"346":0,"347":0,"348":0,"349":0,"360":0,"363":0,"364":0,"365":0,"377":0,"380":0,"381":0,"382":0,"384":0,"385":0,"397":0,"398":0,"399":0,"401":0,"402":0,"414":0,"417":0,"418":0,"419":0,"431":0,"435":0};
_yuitest_coverage["build/widget-stack/widget-stack.js"].functions = {"Stack:56":0,"zIndex:109":0,"_syncUIStack:152":0,"_bindUIStack:167":0,"_renderUIStack:181":0,"_parseZIndex:193":0,"_setZIndex:229":0,"_afterShimChange:247":0,"_afterZIndexChange:259":0,"_uiSetZIndex:270":0,"_uiSetShim:282":0,"createBeforeVisible:315":0,"_renderShimDeferred:310":0,"_addShimResizeHandlers:339":0,"_detachStackHandles:359":0,"_renderShim:376":0,"_destroyShim:396":0,"sizeShim:413":0,"_getShimTemplate:430":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-stack/widget-stack.js"].coveredLines = 72;
_yuitest_coverage["build/widget-stack/widget-stack.js"].coveredFunctions = 20;
_yuitest_coverline("build/widget-stack/widget-stack.js", 1);
YUI.add('widget-stack', function (Y, NAME) {

/**
 * Provides stackable (z-index) support for Widgets through an extension.
 *
 * @module widget-stack
 */
    _yuitest_coverfunc("build/widget-stack/widget-stack.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-stack/widget-stack.js", 8);
var L = Y.Lang,
        UA = Y.UA,
        Node = Y.Node,
        Widget = Y.Widget,

        ZINDEX = "zIndex",
        SHIM = "shim",
        VISIBLE = "visible",

        BOUNDING_BOX = "boundingBox",

        RENDER_UI = "renderUI",
        BIND_UI = "bindUI",
        SYNC_UI = "syncUI",

        OFFSET_WIDTH = "offsetWidth",
        OFFSET_HEIGHT = "offsetHeight",
        PARENT_NODE = "parentNode",
        FIRST_CHILD = "firstChild",
        OWNER_DOCUMENT = "ownerDocument",

        WIDTH = "width",
        HEIGHT = "height",
        PX = "px",

        // HANDLE KEYS
        SHIM_DEFERRED = "shimdeferred",
        SHIM_RESIZE = "shimresize",

        // Events
        VisibleChange = "visibleChange",
        WidthChange = "widthChange",
        HeightChange = "heightChange",
        ShimChange = "shimChange",
        ZIndexChange = "zIndexChange",
        ContentUpdate = "contentUpdate",

        // CSS
        STACKED = "stacked";

    /**
     * Widget extension, which can be used to add stackable (z-index) support to the
     * base Widget class along with a shimming solution, through the
     * <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetStack
     * @param {Object} User configuration object
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 56);
function Stack(config) {
        _yuitest_coverfunc("build/widget-stack/widget-stack.js", "Stack", 56);
_yuitest_coverline("build/widget-stack/widget-stack.js", 57);
this._stackNode = this.get(BOUNDING_BOX);
        _yuitest_coverline("build/widget-stack/widget-stack.js", 58);
this._stackHandles = {};

        // WIDGET METHOD OVERLAP
        _yuitest_coverline("build/widget-stack/widget-stack.js", 61);
Y.after(this._renderUIStack, this, RENDER_UI);
        _yuitest_coverline("build/widget-stack/widget-stack.js", 62);
Y.after(this._syncUIStack, this, SYNC_UI);
        _yuitest_coverline("build/widget-stack/widget-stack.js", 63);
Y.after(this._bindUIStack, this, BIND_UI);
    }

    // Static Properties
    /**
     * Static property used to define the default attribute
     * configuration introduced by WidgetStack.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 75);
Stack.ATTRS = {
        /**
         * @attribute shim
         * @type boolean
         * @default false, for all browsers other than IE6, for which a shim is enabled by default.
         *
         * @description Boolean flag to indicate whether or not a shim should be added to the Widgets
         * boundingBox, to protect it from select box bleedthrough.
         */
        shim: {
            value: (UA.ie == 6)
        },

        /**
         * @attribute zIndex
         * @type number
         * @default 0
         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for
         * zIndex will be converted to 0
         */
        zIndex: {
            value : 0,
            setter: '_setZIndex'
        }
    };

    /**
     * The HTML parsing rules for the WidgetStack class.
     *
     * @property HTML_PARSER
     * @static
     * @type Object
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 108);
Stack.HTML_PARSER = {
        zIndex: function (srcNode) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "zIndex", 109);
_yuitest_coverline("build/widget-stack/widget-stack.js", 110);
return this._parseZIndex(srcNode);
        }
    };

    /**
     * Default class used to mark the shim element
     *
     * @property SHIM_CLASS_NAME
     * @type String
     * @static
     * @default "yui3-widget-shim"
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 122);
Stack.SHIM_CLASS_NAME = Widget.getClassName(SHIM);

    /**
     * Default class used to mark the boundingBox of a stacked widget.
     *
     * @property STACKED_CLASS_NAME
     * @type String
     * @static
     * @default "yui3-widget-stacked"
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 132);
Stack.STACKED_CLASS_NAME = Widget.getClassName(STACKED);

    /**
     * Default markup template used to generate the shim element.
     *
     * @property SHIM_TEMPLATE
     * @type String
     * @static
     */
    _yuitest_coverline("build/widget-stack/widget-stack.js", 141);
Stack.SHIM_TEMPLATE = '<iframe class="' + Stack.SHIM_CLASS_NAME + '" frameborder="0" title="Widget Stacking Shim" src="javascript:false" tabindex="-1" role="presentation"></iframe>';

    _yuitest_coverline("build/widget-stack/widget-stack.js", 143);
Stack.prototype = {

        /**
         * Synchronizes the UI to match the Widgets stack state. This method in
         * invoked after syncUI is invoked for the Widget class using YUI's aop infrastructure.
         *
         * @method _syncUIStack
         * @protected
         */
        _syncUIStack: function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_syncUIStack", 152);
_yuitest_coverline("build/widget-stack/widget-stack.js", 153);
this._uiSetShim(this.get(SHIM));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 154);
this._uiSetZIndex(this.get(ZINDEX));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to
         * Widget stack related state changes.
         * <p>
         * This method is invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIStack
         * @protected
         */
        _bindUIStack: function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_bindUIStack", 167);
_yuitest_coverline("build/widget-stack/widget-stack.js", 168);
this.after(ShimChange, this._afterShimChange);
            _yuitest_coverline("build/widget-stack/widget-stack.js", 169);
this.after(ZIndexChange, this._afterZIndexChange);
        },

        /**
         * Creates/Initializes the DOM to support stackability.
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIStack
         * @protected
         */
        _renderUIStack: function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_renderUIStack", 181);
_yuitest_coverline("build/widget-stack/widget-stack.js", 182);
this._stackNode.addClass(Stack.STACKED_CLASS_NAME);
        },

        /**
        Parses a `zIndex` attribute value from this widget's `srcNode`.

        @method _parseZIndex
        @param {Node} srcNode The node to parse a `zIndex` value from.
        @return {Mixed} The parsed `zIndex` value.
        @protected
        **/
        _parseZIndex: function (srcNode) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_parseZIndex", 193);
_yuitest_coverline("build/widget-stack/widget-stack.js", 194);
var zIndex;

            // Prefers how WebKit handles `z-index` which better matches the
            // spec:
            //
            // * http://www.w3.org/TR/CSS2/visuren.html#z-index
            // * https://bugs.webkit.org/show_bug.cgi?id=15562
            //
            // When a node isn't rendered in the document, and/or when a
            // node is not positioned, then it doesn't have a context to derive
            // a valid `z-index` value from.
            _yuitest_coverline("build/widget-stack/widget-stack.js", 205);
if (!srcNode.inDoc() || srcNode.getStyle('position') === 'static') {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 206);
zIndex = 'auto';
            } else {
                // Uses `getComputedStyle()` because it has greater accuracy in
                // more browsers than `getStyle()` does for `z-index`.
                _yuitest_coverline("build/widget-stack/widget-stack.js", 210);
zIndex = srcNode.getComputedStyle('zIndex');
            }

            // This extension adds a stacking context to widgets, therefore a
            // `srcNode` witout a stacking context (i.e. "auto") will return
            // `null` from this DOM parser. This way the widget's default or
            // user provided value for `zIndex` will be used.
            _yuitest_coverline("build/widget-stack/widget-stack.js", 217);
return zIndex === 'auto' ? null : zIndex;
        },

        /**
         * Default setter for zIndex attribute changes. Normalizes zIndex values to
         * numbers, converting non-numerical values to 0.
         *
         * @method _setZIndex
         * @protected
         * @param {String | Number} zIndex
         * @return {Number} Normalized zIndex
         */
        _setZIndex: function(zIndex) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_setZIndex", 229);
_yuitest_coverline("build/widget-stack/widget-stack.js", 230);
if (L.isString(zIndex)) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 231);
zIndex = parseInt(zIndex, 10);
            }
            _yuitest_coverline("build/widget-stack/widget-stack.js", 233);
if (!L.isNumber(zIndex)) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 234);
zIndex = 0;
            }
            _yuitest_coverline("build/widget-stack/widget-stack.js", 236);
return zIndex;
        },

        /**
         * Default attribute change listener for the shim attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterShimChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterShimChange : function(e) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_afterShimChange", 247);
_yuitest_coverline("build/widget-stack/widget-stack.js", 248);
this._uiSetShim(e.newVal);
        },

        /**
         * Default attribute change listener for the zIndex attribute, responsible
         * for updating the UI, in response to attribute changes.
         *
         * @method _afterZIndexChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterZIndexChange : function(e) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_afterZIndexChange", 259);
_yuitest_coverline("build/widget-stack/widget-stack.js", 260);
this._uiSetZIndex(e.newVal);
        },

        /**
         * Updates the UI to reflect the zIndex value passed in.
         *
         * @method _uiSetZIndex
         * @protected
         * @param {number} zIndex The zindex to be reflected in the UI
         */
        _uiSetZIndex: function (zIndex) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_uiSetZIndex", 270);
_yuitest_coverline("build/widget-stack/widget-stack.js", 271);
this._stackNode.setStyle(ZINDEX, zIndex);
        },

        /**
         * Updates the UI to enable/disable the shim. If the widget is not currently visible,
         * creation of the shim is deferred until it is made visible, for performance reasons.
         *
         * @method _uiSetShim
         * @protected
         * @param {boolean} enable If true, creates/renders the shim, if false, removes it.
         */
        _uiSetShim: function (enable) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_uiSetShim", 282);
_yuitest_coverline("build/widget-stack/widget-stack.js", 283);
if (enable) {
                // Lazy creation
                _yuitest_coverline("build/widget-stack/widget-stack.js", 285);
if (this.get(VISIBLE)) {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 286);
this._renderShim();
                } else {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 288);
this._renderShimDeferred();
                }

                // Eagerly attach resize handlers
                //
                // Required because of Event stack behavior, commit ref: cd8dddc
                // Should be revisted after Ticket #2531067 is resolved.
                _yuitest_coverline("build/widget-stack/widget-stack.js", 295);
if (UA.ie == 6) {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 296);
this._addShimResizeHandlers();
                }
            } else {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 299);
this._destroyShim();
            }
        },

        /**
         * Sets up change handlers for the visible attribute, to defer shim creation/rendering
         * until the Widget is made visible.
         *
         * @method _renderShimDeferred
         * @private
         */
        _renderShimDeferred : function() {

            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_renderShimDeferred", 310);
_yuitest_coverline("build/widget-stack/widget-stack.js", 312);
this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];

            _yuitest_coverline("build/widget-stack/widget-stack.js", 314);
var handles = this._stackHandles[SHIM_DEFERRED],
                createBeforeVisible = function(e) {
                    _yuitest_coverfunc("build/widget-stack/widget-stack.js", "createBeforeVisible", 315);
_yuitest_coverline("build/widget-stack/widget-stack.js", 316);
if (e.newVal) {
                        _yuitest_coverline("build/widget-stack/widget-stack.js", 317);
this._renderShim();
                    }
                };

            _yuitest_coverline("build/widget-stack/widget-stack.js", 321);
handles.push(this.on(VisibleChange, createBeforeVisible));
            // Depending how how Ticket #2531067 is resolved, a reversal of
            // commit ref: cd8dddc could lead to a more elagent solution, with
            // the addition of this line here:
            //
            // handles.push(this.after(VisibleChange, this.sizeShim));
        },

        /**
         * Sets up event listeners to resize the shim when the size of the Widget changes.
         * <p>
         * NOTE: This method is only used for IE6 currently, since IE6 doesn't support a way to
         * resize the shim purely through CSS, when the Widget does not have an explicit width/height
         * set.
         * </p>
         * @method _addShimResizeHandlers
         * @private
         */
        _addShimResizeHandlers : function() {

            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_addShimResizeHandlers", 339);
_yuitest_coverline("build/widget-stack/widget-stack.js", 341);
this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];

            _yuitest_coverline("build/widget-stack/widget-stack.js", 343);
var sizeShim = this.sizeShim,
                handles = this._stackHandles[SHIM_RESIZE];

            _yuitest_coverline("build/widget-stack/widget-stack.js", 346);
handles.push(this.after(VisibleChange, sizeShim));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 347);
handles.push(this.after(WidthChange, sizeShim));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 348);
handles.push(this.after(HeightChange, sizeShim));
            _yuitest_coverline("build/widget-stack/widget-stack.js", 349);
handles.push(this.after(ContentUpdate, sizeShim));
        },

        /**
         * Detaches any handles stored for the provided key
         *
         * @method _detachStackHandles
         * @param String handleKey The key defining the group of handles which should be detached
         * @private
         */
        _detachStackHandles : function(handleKey) {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_detachStackHandles", 359);
_yuitest_coverline("build/widget-stack/widget-stack.js", 360);
var handles = this._stackHandles[handleKey],
                handle;

            _yuitest_coverline("build/widget-stack/widget-stack.js", 363);
if (handles && handles.length > 0) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 364);
while((handle = handles.pop())) {
                    _yuitest_coverline("build/widget-stack/widget-stack.js", 365);
handle.detach();
                }
            }
        },

        /**
         * Creates the shim element and adds it to the DOM
         *
         * @method _renderShim
         * @private
         */
        _renderShim : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_renderShim", 376);
_yuitest_coverline("build/widget-stack/widget-stack.js", 377);
var shimEl = this._shimNode,
                stackEl = this._stackNode;

            _yuitest_coverline("build/widget-stack/widget-stack.js", 380);
if (!shimEl) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 381);
shimEl = this._shimNode = this._getShimTemplate();
                _yuitest_coverline("build/widget-stack/widget-stack.js", 382);
stackEl.insertBefore(shimEl, stackEl.get(FIRST_CHILD));

                _yuitest_coverline("build/widget-stack/widget-stack.js", 384);
this._detachStackHandles(SHIM_DEFERRED);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 385);
this.sizeShim();
            }
        },

        /**
         * Removes the shim from the DOM, and detaches any related event
         * listeners.
         *
         * @method _destroyShim
         * @private
         */
        _destroyShim : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_destroyShim", 396);
_yuitest_coverline("build/widget-stack/widget-stack.js", 397);
if (this._shimNode) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 398);
this._shimNode.get(PARENT_NODE).removeChild(this._shimNode);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 399);
this._shimNode = null;

                _yuitest_coverline("build/widget-stack/widget-stack.js", 401);
this._detachStackHandles(SHIM_DEFERRED);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 402);
this._detachStackHandles(SHIM_RESIZE);
            }
        },

        /**
         * For IE6, synchronizes the size and position of iframe shim to that of
         * Widget bounding box which it is protecting. For all other browsers,
         * this method does not do anything.
         *
         * @method sizeShim
         */
        sizeShim: function () {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "sizeShim", 413);
_yuitest_coverline("build/widget-stack/widget-stack.js", 414);
var shim = this._shimNode,
                node = this._stackNode;

            _yuitest_coverline("build/widget-stack/widget-stack.js", 417);
if (shim && UA.ie === 6 && this.get(VISIBLE)) {
                _yuitest_coverline("build/widget-stack/widget-stack.js", 418);
shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);
                _yuitest_coverline("build/widget-stack/widget-stack.js", 419);
shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);
            }
        },

        /**
         * Creates a cloned shim node, using the SHIM_TEMPLATE html template, for use on a new instance.
         *
         * @method _getShimTemplate
         * @private
         * @return {Node} node A new shim Node instance.
         */
        _getShimTemplate : function() {
            _yuitest_coverfunc("build/widget-stack/widget-stack.js", "_getShimTemplate", 430);
_yuitest_coverline("build/widget-stack/widget-stack.js", 431);
return Node.create(Stack.SHIM_TEMPLATE, this._stackNode.get(OWNER_DOCUMENT));
        }
    };

    _yuitest_coverline("build/widget-stack/widget-stack.js", 435);
Y.WidgetStack = Stack;


}, '3.7.3', {"requires": ["base-build", "widget"], "skinnable": true});
