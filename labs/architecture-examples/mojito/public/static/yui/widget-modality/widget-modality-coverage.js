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
_yuitest_coverage["build/widget-modality/widget-modality.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-modality/widget-modality.js",
    code: []
};
_yuitest_coverage["build/widget-modality/widget-modality.js"].code=["YUI.add('widget-modality', function (Y, NAME) {","","/**"," * Provides modality support for Widgets, though an extension"," *"," * @module widget-modality"," */","","var WIDGET       = 'widget',","    RENDER_UI    = 'renderUI',","    BIND_UI      = 'bindUI',","    SYNC_UI      = 'syncUI',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX  = 'contentBox',","    VISIBLE      = 'visible',","    Z_INDEX      = 'zIndex',","    CHANGE       = 'Change',","    isBoolean    = Y.Lang.isBoolean,","    getCN        = Y.ClassNameManager.getClassName,","    MaskShow     = \"maskShow\",","    MaskHide     = \"maskHide\",","    ClickOutside = \"clickoutside\",","    FocusOutside = \"focusoutside\",","","    supportsPosFixed = (function(){","","        /*! IS_POSITION_FIXED_SUPPORTED - Juriy Zaytsev (kangax) - http://yura.thinkweb2.com/cft/ */","","        var doc         = Y.config.doc,","            isSupported = null,","            el, root;","","        if (doc.createElement) {","            el = doc.createElement('div');","            if (el && el.style) {","                el.style.position = 'fixed';","                el.style.top = '10px';","                root = doc.body;","                if (root && root.appendChild && root.removeChild) {","                    root.appendChild(el);","                    isSupported = (el.offsetTop === 10);","                    root.removeChild(el);","                }","            }","        }","","        return isSupported;","    }());","","    /**","     * Widget extension, which can be used to add modality support to the base Widget class,","     * through the Base.create method.","     *","     * @class WidgetModality","     * @param {Object} config User configuration object","     */","    function WidgetModal(config) {}","","    var MODAL           = 'modal',","        MASK            = 'mask',","        MODAL_CLASSES   = {","            modal   : getCN(WIDGET, MODAL),","            mask    : getCN(WIDGET, MASK)","        };","","    /**","    * Static property used to define the default attribute","    * configuration introduced by WidgetModality.","    *","    * @property ATTRS","    * @static","    * @type Object","    */","    WidgetModal.ATTRS = {","            /**","             * @attribute maskNode","             * @type Y.Node","             *","             * @description Returns a Y.Node instance of the node being used as the mask.","             */","            maskNode : {","                getter      : '_getMaskNode',","                readOnly    : true","            },","","","            /**","             * @attribute modal","             * @type boolean","             *","             * @description Whether the widget should be modal or not.","             */","            modal: {","                value:false,","                validator: isBoolean","            },","","            /**","             * @attribute focusOn","             * @type array","             *","             * @description An array of objects corresponding to the nodes and events that will trigger a re-focus back on the widget.","             * The implementer can supply an array of objects, with each object having the following properties:","             * <p>eventName: (string, required): The eventName to listen to.</p>","             * <p>node: (Y.Node, optional): The Y.Node that will fire the event (defaults to the boundingBox of the widget)</p>","             * <p>By default, this attribute consists of two objects which will cause the widget to re-focus if anything","             * outside the widget is clicked on or focussed upon.</p>","             */","            focusOn: {","                valueFn: function() {","                    return [","                        {","                            // node: this.get(BOUNDING_BOX),","                            eventName: ClickOutside","                        },","                        {","                            //node: this.get(BOUNDING_BOX),","                            eventName: FocusOutside","                        }","                    ];","                },","","                validator: Y.Lang.isArray","            }","","    };","","","    WidgetModal.CLASSES = MODAL_CLASSES;","","","    /**","     * Returns the mask if it exists on the page - otherwise creates a mask. There's only","     * one mask on a page at a given time.","     * <p>","     * This method in invoked internally by the getter of the maskNode ATTR.","     * </p>","     * @method _GET_MASK","     * @static","     */","    WidgetModal._GET_MASK = function() {","","        var mask = Y.one('.' + MODAL_CLASSES.mask),","            win  = Y.one('win');","","        if (mask) {","            return mask;","        }","","        mask = Y.Node.create('<div></div>').addClass(MODAL_CLASSES.mask);","","        if (supportsPosFixed) {","            mask.setStyles({","                position: 'fixed',","                width   : '100%',","                height  : '100%',","                top     : '0',","                left    : '0',","                display : 'block'","            });","        } else {","            mask.setStyles({","                position: 'absolute',","                width   : win.get('winWidth') +'px',","                height  : win.get('winHeight') + 'px',","                top     : '0',","                left    : '0',","                display : 'block'","            });","        }","","        return mask;","    };","","    /**","     * A stack of Y.Widget objects representing the current hierarchy of modal widgets presently displayed on the screen","     * @property STACK","     */","    WidgetModal.STACK = [];","","","    WidgetModal.prototype = {","","        initializer: function () {","            Y.after(this._renderUIModal, this, RENDER_UI);","            Y.after(this._syncUIModal, this, SYNC_UI);","            Y.after(this._bindUIModal, this, BIND_UI);","        },","","        destructor: function () {","            // Hack to remove this thing from the STACK.","            this._uiSetHostVisibleModal(false);","        },","","        // *** Instance Members *** //","","        _uiHandlesModal: null,","","","        /**","         * Adds modal class to the bounding box of the widget","         * <p>","         * This method in invoked after renderUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _renderUIModal","         * @protected","         */","        _renderUIModal : function () {","","            var bb = this.get(BOUNDING_BOX);","                //cb = this.get(CONTENT_BOX);","","            //this makes the content box content appear over the mask","            // cb.setStyles({","            //     position: \"\"","            // });","","            this._repositionMask(this);","            bb.addClass(MODAL_CLASSES.modal);","","        },","","","        /**","         * Hooks up methods to be executed when the widget's visibility or z-index changes","         * <p>","         * This method in invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIModal","         * @protected","         */","        _bindUIModal : function () {","","            this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeModal);","            this.after(Z_INDEX+CHANGE, this._afterHostZIndexChangeModal);","            this.after(\"focusOnChange\", this._afterFocusOnChange);","","            // Re-align the mask in the viewport if `position: fixed;` is not","            // supported. iOS < 5 and Android < 3 don't actually support it even","            // though they both pass the feature test; the UA sniff is here to","            // account for that. Ideally this should be replaced with a better","            // feature test.","            if (!supportsPosFixed ||","                    (Y.UA.ios && Y.UA.ios < 5) ||","                    (Y.UA.android && Y.UA.android < 3)) {","","                Y.one('win').on('scroll', this._resyncMask, this);","            }","        },","","        /**","         * Syncs the mask with the widget's current state, namely the visibility and z-index of the widget","         * <p>","         * This method in invoked after syncUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _syncUIModal","         * @protected","         */","        _syncUIModal : function () {","","            //var host = this.get(HOST);","","            this._uiSetHostVisibleModal(this.get(VISIBLE));","            this._uiSetHostZIndexModal(this.get(Z_INDEX));","","        },","","        /**","         * Provides mouse and tab focus to the widget's bounding box.","         *","         * @method _focus","         */","        _focus : function (e) {","","            var bb = this.get(BOUNDING_BOX),","            oldTI = bb.get('tabIndex');","","            bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);","            this.focus();","        },","        /**","         * Blurs the widget.","         *","         * @method _blur","         */","        _blur : function () {","","            this.blur();","        },","","        /**","         * Returns the Y.Node instance of the maskNode","         *","         * @method _getMaskNode","         * @return {Node} The Y.Node instance of the mask, as returned from WidgetModal._GET_MASK","         */","        _getMaskNode : function () {","","            return WidgetModal._GET_MASK();","        },","","        /**","         * Performs events attaching/detaching, stack shifting and mask repositioning based on the visibility of the widget","         *","         * @method _uiSetHostVisibleModal","         * @param {boolean} Whether the widget is visible or not","         */","        _uiSetHostVisibleModal : function (visible) {","            var stack    = WidgetModal.STACK,","                maskNode = this.get('maskNode'),","                isModal  = this.get('modal'),","                topModal, index;","","            if (visible) {","","                Y.Array.each(stack, function(modal){","                    modal._detachUIHandlesModal();","                    modal._blur();","                });","","                // push on top of stack","                stack.unshift(this);","","                this._repositionMask(this);","                this._uiSetHostZIndexModal(this.get(Z_INDEX));","","                if (isModal) {","                    maskNode.show();","                    Y.later(1, this, '_attachUIHandlesModal');","                    this._focus();","                }","","","            } else {","","                index = Y.Array.indexOf(stack, this);","                if (index >= 0) {","                    // Remove modal widget from global stack.","                    stack.splice(index, 1);","                }","","                this._detachUIHandlesModal();","                this._blur();","","                if (stack.length) {","                    topModal = stack[0];","                    this._repositionMask(topModal);","                    //topModal._attachUIHandlesModal();","                    topModal._uiSetHostZIndexModal(topModal.get(Z_INDEX));","","                    if (topModal.get('modal')) {","                        //topModal._attachUIHandlesModal();","                        Y.later(1, topModal, '_attachUIHandlesModal');","                        topModal._focus();","                    }","","                } else {","","                    if (maskNode.getStyle('display') === 'block') {","                        maskNode.hide();","                    }","","                }","","            }","        },","","        /**","         * Sets the z-index of the mask node.","         *","         * @method _uiSetHostZIndexModal","         * @param {Number} Z-Index of the widget","         */","        _uiSetHostZIndexModal : function (zIndex) {","","            if (this.get('modal')) {","                this.get('maskNode').setStyle(Z_INDEX, zIndex || 0);","            }","","        },","","        /**","         * Attaches UI Listeners for \"clickoutside\" and \"focusoutside\" on the","         * widget. When these events occur, and the widget is modal, focus is","         * shifted back onto the widget.","         *","         * @method _attachUIHandlesModal","         */","        _attachUIHandlesModal : function () {","","            if (this._uiHandlesModal || WidgetModal.STACK[0] !== this) {","                // Quit early if we have ui handles, or if we not at the top","                // of the global stack.","                return;","            }","","            var bb          = this.get(BOUNDING_BOX),","                maskNode    = this.get('maskNode'),","                focusOn     = this.get('focusOn'),","                focus       = Y.bind(this._focus, this),","                uiHandles   = [],","                i, len, o;","","            for (i = 0, len = focusOn.length; i < len; i++) {","","                o = {};","                o.node = focusOn[i].node;","                o.ev = focusOn[i].eventName;","                o.keyCode = focusOn[i].keyCode;","","                //no keycode or node defined","                if (!o.node && !o.keyCode && o.ev) {","                    uiHandles.push(bb.on(o.ev, focus));","                }","","                //node defined, no keycode (not a keypress)","                else if (o.node && !o.keyCode && o.ev) {","                    uiHandles.push(o.node.on(o.ev, focus));","                }","","                //node defined, keycode defined, event defined (its a key press)","                else if (o.node && o.keyCode && o.ev) {","                    uiHandles.push(o.node.on(o.ev, focus, o.keyCode));","                }","","                else {","                    Y.Log('focusOn ATTR Error: The event with name \"'+o.ev+'\" could not be attached.');","                }","","            }","","            if ( ! supportsPosFixed) {","                uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){","                    maskNode.setStyle('top', maskNode.get('docScrollY'));","                }, this)));","            }","","            this._uiHandlesModal = uiHandles;","        },","","        /**","         * Detaches all UI Listeners that were set in _attachUIHandlesModal from the widget.","         *","         * @method _detachUIHandlesModal","         */","        _detachUIHandlesModal : function () {","            Y.each(this._uiHandlesModal, function(h){","                h.detach();","            });","            this._uiHandlesModal = null;","        },","","        /**","         * Default function that is called when visibility is changed on the widget.","         *","         * @method _afterHostVisibleChangeModal","         * @param {EventFacade} e The event facade of the change","         */","        _afterHostVisibleChangeModal : function (e) {","","            this._uiSetHostVisibleModal(e.newVal);","        },","","        /**","         * Default function that is called when z-index is changed on the widget.","         *","         * @method _afterHostZIndexChangeModal","         * @param {EventFacade} e The event facade of the change","         */","        _afterHostZIndexChangeModal : function (e) {","","            this._uiSetHostZIndexModal(e.newVal);","        },","","        /**","         * Returns a boolean representing whether the current widget is in a \"nested modality\" state.","         * This is done by checking the number of widgets currently on the stack.","         *","         * @method isNested","         * @public","         */","        isNested: function() {","            var length = WidgetModal.STACK.length,","            retval = (length > 1) ? true : false;","            return retval;","        },","","        /**","         * Repositions the mask in the DOM for nested modality cases.","         *","         * @method _repositionMask","         * @param {Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.","         */","        _repositionMask: function(nextElem) {","","            var currentModal = this.get('modal'),","                nextModal    = nextElem.get('modal'),","                maskNode     = this.get('maskNode'),","                bb, bbParent;","","            //if this is modal and host is not modal","            if (currentModal && !nextModal) {","                //leave the mask where it is, since the host is not modal.","                maskNode.remove();","                this.fire(MaskHide);","            }","","            //if the main widget is not modal but the host is modal, or both of them are modal","            else if ((!currentModal && nextModal) || (currentModal && nextModal)) {","","                //then remove the mask off DOM, reposition it, and reinsert it into the DOM","                maskNode.remove();","                this.fire(MaskHide);","                bb = nextElem.get(BOUNDING_BOX);","                bbParent = bb.get('parentNode') || Y.one('body');","                bbParent.insert(maskNode, bbParent.get('firstChild'));","                this.fire(MaskShow);","            }","","        },","","        /**","         * Resyncs the mask in the viewport for browsers that don't support fixed positioning","         *","         * @method _resyncMask","         * @param {Y.Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.","         * @private","         */","        _resyncMask: function (e) {","            var o       = e.currentTarget,","                offsetX = o.get('docScrollX'),","                offsetY = o.get('docScrollY'),","                w       = o.get('innerWidth') || o.get('winWidth'),","                h       = o.get('innerHeight') || o.get('winHeight'),","                mask    = this.get('maskNode');","","            mask.setStyles({","                \"top\": offsetY + \"px\",","                \"left\": offsetX + \"px\",","                \"width\": w + 'px',","                \"height\": h + 'px'","            });","        },","","        /**","         * Default function called when focusOn Attribute is changed. Remove existing listeners and create new listeners.","         *","         * @method _afterFocusOnChange","         */","        _afterFocusOnChange : function(e) {","            this._detachUIHandlesModal();","","            if (this.get(VISIBLE)) {","                this._attachUIHandlesModal();","            }","        }","    };","","    Y.WidgetModality = WidgetModal;","","","","}, '3.7.3', {\"requires\": [\"base-build\", \"event-outside\", \"widget\"], \"skinnable\": true});"];
_yuitest_coverage["build/widget-modality/widget-modality.js"].lines = {"1":0,"9":0,"29":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"47":0,"57":0,"59":0,"74":0,"111":0,"129":0,"141":0,"143":0,"146":0,"147":0,"150":0,"152":0,"153":0,"162":0,"172":0,"179":0,"182":0,"185":0,"186":0,"187":0,"192":0,"211":0,"219":0,"220":0,"236":0,"237":0,"238":0,"245":0,"249":0,"266":0,"267":0,"278":0,"281":0,"282":0,"291":0,"302":0,"312":0,"317":0,"319":0,"320":0,"321":0,"325":0,"327":0,"328":0,"330":0,"331":0,"332":0,"333":0,"339":0,"340":0,"342":0,"345":0,"346":0,"348":0,"349":0,"350":0,"352":0,"354":0,"356":0,"357":0,"362":0,"363":0,"379":0,"380":0,"394":0,"397":0,"400":0,"407":0,"409":0,"410":0,"411":0,"412":0,"415":0,"416":0,"420":0,"421":0,"425":0,"426":0,"430":0,"435":0,"436":0,"437":0,"441":0,"450":0,"451":0,"453":0,"464":0,"475":0,"486":0,"488":0,"499":0,"505":0,"507":0,"508":0,"512":0,"515":0,"516":0,"517":0,"518":0,"519":0,"520":0,"533":0,"540":0,"554":0,"556":0,"557":0,"562":0};
_yuitest_coverage["build/widget-modality/widget-modality.js"].functions = {"(anonymous 2):25":0,"WidgetModal:57":0,"valueFn:110":0,"_GET_MASK:141":0,"initializer:184":0,"destructor:190":0,"_renderUIModal:209":0,"_bindUIModal:234":0,"_syncUIModal:262":0,"_focus:276":0,"_blur:289":0,"_getMaskNode:300":0,"(anonymous 3):319":0,"_uiSetHostVisibleModal:311":0,"_uiSetHostZIndexModal:377":0,"(anonymous 4):436":0,"_attachUIHandlesModal:392":0,"(anonymous 5):450":0,"_detachUIHandlesModal:449":0,"_afterHostVisibleChangeModal:462":0,"_afterHostZIndexChangeModal:473":0,"isNested:485":0,"_repositionMask:497":0,"_resyncMask:532":0,"_afterFocusOnChange:553":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-modality/widget-modality.js"].coveredLines = 120;
_yuitest_coverage["build/widget-modality/widget-modality.js"].coveredFunctions = 26;
_yuitest_coverline("build/widget-modality/widget-modality.js", 1);
YUI.add('widget-modality', function (Y, NAME) {

/**
 * Provides modality support for Widgets, though an extension
 *
 * @module widget-modality
 */

_yuitest_coverfunc("build/widget-modality/widget-modality.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-modality/widget-modality.js", 9);
var WIDGET       = 'widget',
    RENDER_UI    = 'renderUI',
    BIND_UI      = 'bindUI',
    SYNC_UI      = 'syncUI',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX  = 'contentBox',
    VISIBLE      = 'visible',
    Z_INDEX      = 'zIndex',
    CHANGE       = 'Change',
    isBoolean    = Y.Lang.isBoolean,
    getCN        = Y.ClassNameManager.getClassName,
    MaskShow     = "maskShow",
    MaskHide     = "maskHide",
    ClickOutside = "clickoutside",
    FocusOutside = "focusoutside",

    supportsPosFixed = (function(){

        /*! IS_POSITION_FIXED_SUPPORTED - Juriy Zaytsev (kangax) - http://yura.thinkweb2.com/cft/ */

        _yuitest_coverfunc("build/widget-modality/widget-modality.js", "(anonymous 2)", 25);
_yuitest_coverline("build/widget-modality/widget-modality.js", 29);
var doc         = Y.config.doc,
            isSupported = null,
            el, root;

        _yuitest_coverline("build/widget-modality/widget-modality.js", 33);
if (doc.createElement) {
            _yuitest_coverline("build/widget-modality/widget-modality.js", 34);
el = doc.createElement('div');
            _yuitest_coverline("build/widget-modality/widget-modality.js", 35);
if (el && el.style) {
                _yuitest_coverline("build/widget-modality/widget-modality.js", 36);
el.style.position = 'fixed';
                _yuitest_coverline("build/widget-modality/widget-modality.js", 37);
el.style.top = '10px';
                _yuitest_coverline("build/widget-modality/widget-modality.js", 38);
root = doc.body;
                _yuitest_coverline("build/widget-modality/widget-modality.js", 39);
if (root && root.appendChild && root.removeChild) {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 40);
root.appendChild(el);
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 41);
isSupported = (el.offsetTop === 10);
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 42);
root.removeChild(el);
                }
            }
        }

        _yuitest_coverline("build/widget-modality/widget-modality.js", 47);
return isSupported;
    }());

    /**
     * Widget extension, which can be used to add modality support to the base Widget class,
     * through the Base.create method.
     *
     * @class WidgetModality
     * @param {Object} config User configuration object
     */
    _yuitest_coverline("build/widget-modality/widget-modality.js", 57);
function WidgetModal(config) {}

    _yuitest_coverline("build/widget-modality/widget-modality.js", 59);
var MODAL           = 'modal',
        MASK            = 'mask',
        MODAL_CLASSES   = {
            modal   : getCN(WIDGET, MODAL),
            mask    : getCN(WIDGET, MASK)
        };

    /**
    * Static property used to define the default attribute
    * configuration introduced by WidgetModality.
    *
    * @property ATTRS
    * @static
    * @type Object
    */
    _yuitest_coverline("build/widget-modality/widget-modality.js", 74);
WidgetModal.ATTRS = {
            /**
             * @attribute maskNode
             * @type Y.Node
             *
             * @description Returns a Y.Node instance of the node being used as the mask.
             */
            maskNode : {
                getter      : '_getMaskNode',
                readOnly    : true
            },


            /**
             * @attribute modal
             * @type boolean
             *
             * @description Whether the widget should be modal or not.
             */
            modal: {
                value:false,
                validator: isBoolean
            },

            /**
             * @attribute focusOn
             * @type array
             *
             * @description An array of objects corresponding to the nodes and events that will trigger a re-focus back on the widget.
             * The implementer can supply an array of objects, with each object having the following properties:
             * <p>eventName: (string, required): The eventName to listen to.</p>
             * <p>node: (Y.Node, optional): The Y.Node that will fire the event (defaults to the boundingBox of the widget)</p>
             * <p>By default, this attribute consists of two objects which will cause the widget to re-focus if anything
             * outside the widget is clicked on or focussed upon.</p>
             */
            focusOn: {
                valueFn: function() {
                    _yuitest_coverfunc("build/widget-modality/widget-modality.js", "valueFn", 110);
_yuitest_coverline("build/widget-modality/widget-modality.js", 111);
return [
                        {
                            // node: this.get(BOUNDING_BOX),
                            eventName: ClickOutside
                        },
                        {
                            //node: this.get(BOUNDING_BOX),
                            eventName: FocusOutside
                        }
                    ];
                },

                validator: Y.Lang.isArray
            }

    };


    _yuitest_coverline("build/widget-modality/widget-modality.js", 129);
WidgetModal.CLASSES = MODAL_CLASSES;


    /**
     * Returns the mask if it exists on the page - otherwise creates a mask. There's only
     * one mask on a page at a given time.
     * <p>
     * This method in invoked internally by the getter of the maskNode ATTR.
     * </p>
     * @method _GET_MASK
     * @static
     */
    _yuitest_coverline("build/widget-modality/widget-modality.js", 141);
WidgetModal._GET_MASK = function() {

        _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_GET_MASK", 141);
_yuitest_coverline("build/widget-modality/widget-modality.js", 143);
var mask = Y.one('.' + MODAL_CLASSES.mask),
            win  = Y.one('win');

        _yuitest_coverline("build/widget-modality/widget-modality.js", 146);
if (mask) {
            _yuitest_coverline("build/widget-modality/widget-modality.js", 147);
return mask;
        }

        _yuitest_coverline("build/widget-modality/widget-modality.js", 150);
mask = Y.Node.create('<div></div>').addClass(MODAL_CLASSES.mask);

        _yuitest_coverline("build/widget-modality/widget-modality.js", 152);
if (supportsPosFixed) {
            _yuitest_coverline("build/widget-modality/widget-modality.js", 153);
mask.setStyles({
                position: 'fixed',
                width   : '100%',
                height  : '100%',
                top     : '0',
                left    : '0',
                display : 'block'
            });
        } else {
            _yuitest_coverline("build/widget-modality/widget-modality.js", 162);
mask.setStyles({
                position: 'absolute',
                width   : win.get('winWidth') +'px',
                height  : win.get('winHeight') + 'px',
                top     : '0',
                left    : '0',
                display : 'block'
            });
        }

        _yuitest_coverline("build/widget-modality/widget-modality.js", 172);
return mask;
    };

    /**
     * A stack of Y.Widget objects representing the current hierarchy of modal widgets presently displayed on the screen
     * @property STACK
     */
    _yuitest_coverline("build/widget-modality/widget-modality.js", 179);
WidgetModal.STACK = [];


    _yuitest_coverline("build/widget-modality/widget-modality.js", 182);
WidgetModal.prototype = {

        initializer: function () {
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "initializer", 184);
_yuitest_coverline("build/widget-modality/widget-modality.js", 185);
Y.after(this._renderUIModal, this, RENDER_UI);
            _yuitest_coverline("build/widget-modality/widget-modality.js", 186);
Y.after(this._syncUIModal, this, SYNC_UI);
            _yuitest_coverline("build/widget-modality/widget-modality.js", 187);
Y.after(this._bindUIModal, this, BIND_UI);
        },

        destructor: function () {
            // Hack to remove this thing from the STACK.
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "destructor", 190);
_yuitest_coverline("build/widget-modality/widget-modality.js", 192);
this._uiSetHostVisibleModal(false);
        },

        // *** Instance Members *** //

        _uiHandlesModal: null,


        /**
         * Adds modal class to the bounding box of the widget
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIModal
         * @protected
         */
        _renderUIModal : function () {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_renderUIModal", 209);
_yuitest_coverline("build/widget-modality/widget-modality.js", 211);
var bb = this.get(BOUNDING_BOX);
                //cb = this.get(CONTENT_BOX);

            //this makes the content box content appear over the mask
            // cb.setStyles({
            //     position: ""
            // });

            _yuitest_coverline("build/widget-modality/widget-modality.js", 219);
this._repositionMask(this);
            _yuitest_coverline("build/widget-modality/widget-modality.js", 220);
bb.addClass(MODAL_CLASSES.modal);

        },


        /**
         * Hooks up methods to be executed when the widget's visibility or z-index changes
         * <p>
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIModal
         * @protected
         */
        _bindUIModal : function () {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_bindUIModal", 234);
_yuitest_coverline("build/widget-modality/widget-modality.js", 236);
this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeModal);
            _yuitest_coverline("build/widget-modality/widget-modality.js", 237);
this.after(Z_INDEX+CHANGE, this._afterHostZIndexChangeModal);
            _yuitest_coverline("build/widget-modality/widget-modality.js", 238);
this.after("focusOnChange", this._afterFocusOnChange);

            // Re-align the mask in the viewport if `position: fixed;` is not
            // supported. iOS < 5 and Android < 3 don't actually support it even
            // though they both pass the feature test; the UA sniff is here to
            // account for that. Ideally this should be replaced with a better
            // feature test.
            _yuitest_coverline("build/widget-modality/widget-modality.js", 245);
if (!supportsPosFixed ||
                    (Y.UA.ios && Y.UA.ios < 5) ||
                    (Y.UA.android && Y.UA.android < 3)) {

                _yuitest_coverline("build/widget-modality/widget-modality.js", 249);
Y.one('win').on('scroll', this._resyncMask, this);
            }
        },

        /**
         * Syncs the mask with the widget's current state, namely the visibility and z-index of the widget
         * <p>
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIModal
         * @protected
         */
        _syncUIModal : function () {

            //var host = this.get(HOST);

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_syncUIModal", 262);
_yuitest_coverline("build/widget-modality/widget-modality.js", 266);
this._uiSetHostVisibleModal(this.get(VISIBLE));
            _yuitest_coverline("build/widget-modality/widget-modality.js", 267);
this._uiSetHostZIndexModal(this.get(Z_INDEX));

        },

        /**
         * Provides mouse and tab focus to the widget's bounding box.
         *
         * @method _focus
         */
        _focus : function (e) {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_focus", 276);
_yuitest_coverline("build/widget-modality/widget-modality.js", 278);
var bb = this.get(BOUNDING_BOX),
            oldTI = bb.get('tabIndex');

            _yuitest_coverline("build/widget-modality/widget-modality.js", 281);
bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);
            _yuitest_coverline("build/widget-modality/widget-modality.js", 282);
this.focus();
        },
        /**
         * Blurs the widget.
         *
         * @method _blur
         */
        _blur : function () {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_blur", 289);
_yuitest_coverline("build/widget-modality/widget-modality.js", 291);
this.blur();
        },

        /**
         * Returns the Y.Node instance of the maskNode
         *
         * @method _getMaskNode
         * @return {Node} The Y.Node instance of the mask, as returned from WidgetModal._GET_MASK
         */
        _getMaskNode : function () {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_getMaskNode", 300);
_yuitest_coverline("build/widget-modality/widget-modality.js", 302);
return WidgetModal._GET_MASK();
        },

        /**
         * Performs events attaching/detaching, stack shifting and mask repositioning based on the visibility of the widget
         *
         * @method _uiSetHostVisibleModal
         * @param {boolean} Whether the widget is visible or not
         */
        _uiSetHostVisibleModal : function (visible) {
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_uiSetHostVisibleModal", 311);
_yuitest_coverline("build/widget-modality/widget-modality.js", 312);
var stack    = WidgetModal.STACK,
                maskNode = this.get('maskNode'),
                isModal  = this.get('modal'),
                topModal, index;

            _yuitest_coverline("build/widget-modality/widget-modality.js", 317);
if (visible) {

                _yuitest_coverline("build/widget-modality/widget-modality.js", 319);
Y.Array.each(stack, function(modal){
                    _yuitest_coverfunc("build/widget-modality/widget-modality.js", "(anonymous 3)", 319);
_yuitest_coverline("build/widget-modality/widget-modality.js", 320);
modal._detachUIHandlesModal();
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 321);
modal._blur();
                });

                // push on top of stack
                _yuitest_coverline("build/widget-modality/widget-modality.js", 325);
stack.unshift(this);

                _yuitest_coverline("build/widget-modality/widget-modality.js", 327);
this._repositionMask(this);
                _yuitest_coverline("build/widget-modality/widget-modality.js", 328);
this._uiSetHostZIndexModal(this.get(Z_INDEX));

                _yuitest_coverline("build/widget-modality/widget-modality.js", 330);
if (isModal) {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 331);
maskNode.show();
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 332);
Y.later(1, this, '_attachUIHandlesModal');
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 333);
this._focus();
                }


            } else {

                _yuitest_coverline("build/widget-modality/widget-modality.js", 339);
index = Y.Array.indexOf(stack, this);
                _yuitest_coverline("build/widget-modality/widget-modality.js", 340);
if (index >= 0) {
                    // Remove modal widget from global stack.
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 342);
stack.splice(index, 1);
                }

                _yuitest_coverline("build/widget-modality/widget-modality.js", 345);
this._detachUIHandlesModal();
                _yuitest_coverline("build/widget-modality/widget-modality.js", 346);
this._blur();

                _yuitest_coverline("build/widget-modality/widget-modality.js", 348);
if (stack.length) {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 349);
topModal = stack[0];
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 350);
this._repositionMask(topModal);
                    //topModal._attachUIHandlesModal();
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 352);
topModal._uiSetHostZIndexModal(topModal.get(Z_INDEX));

                    _yuitest_coverline("build/widget-modality/widget-modality.js", 354);
if (topModal.get('modal')) {
                        //topModal._attachUIHandlesModal();
                        _yuitest_coverline("build/widget-modality/widget-modality.js", 356);
Y.later(1, topModal, '_attachUIHandlesModal');
                        _yuitest_coverline("build/widget-modality/widget-modality.js", 357);
topModal._focus();
                    }

                } else {

                    _yuitest_coverline("build/widget-modality/widget-modality.js", 362);
if (maskNode.getStyle('display') === 'block') {
                        _yuitest_coverline("build/widget-modality/widget-modality.js", 363);
maskNode.hide();
                    }

                }

            }
        },

        /**
         * Sets the z-index of the mask node.
         *
         * @method _uiSetHostZIndexModal
         * @param {Number} Z-Index of the widget
         */
        _uiSetHostZIndexModal : function (zIndex) {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_uiSetHostZIndexModal", 377);
_yuitest_coverline("build/widget-modality/widget-modality.js", 379);
if (this.get('modal')) {
                _yuitest_coverline("build/widget-modality/widget-modality.js", 380);
this.get('maskNode').setStyle(Z_INDEX, zIndex || 0);
            }

        },

        /**
         * Attaches UI Listeners for "clickoutside" and "focusoutside" on the
         * widget. When these events occur, and the widget is modal, focus is
         * shifted back onto the widget.
         *
         * @method _attachUIHandlesModal
         */
        _attachUIHandlesModal : function () {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_attachUIHandlesModal", 392);
_yuitest_coverline("build/widget-modality/widget-modality.js", 394);
if (this._uiHandlesModal || WidgetModal.STACK[0] !== this) {
                // Quit early if we have ui handles, or if we not at the top
                // of the global stack.
                _yuitest_coverline("build/widget-modality/widget-modality.js", 397);
return;
            }

            _yuitest_coverline("build/widget-modality/widget-modality.js", 400);
var bb          = this.get(BOUNDING_BOX),
                maskNode    = this.get('maskNode'),
                focusOn     = this.get('focusOn'),
                focus       = Y.bind(this._focus, this),
                uiHandles   = [],
                i, len, o;

            _yuitest_coverline("build/widget-modality/widget-modality.js", 407);
for (i = 0, len = focusOn.length; i < len; i++) {

                _yuitest_coverline("build/widget-modality/widget-modality.js", 409);
o = {};
                _yuitest_coverline("build/widget-modality/widget-modality.js", 410);
o.node = focusOn[i].node;
                _yuitest_coverline("build/widget-modality/widget-modality.js", 411);
o.ev = focusOn[i].eventName;
                _yuitest_coverline("build/widget-modality/widget-modality.js", 412);
o.keyCode = focusOn[i].keyCode;

                //no keycode or node defined
                _yuitest_coverline("build/widget-modality/widget-modality.js", 415);
if (!o.node && !o.keyCode && o.ev) {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 416);
uiHandles.push(bb.on(o.ev, focus));
                }

                //node defined, no keycode (not a keypress)
                else {_yuitest_coverline("build/widget-modality/widget-modality.js", 420);
if (o.node && !o.keyCode && o.ev) {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 421);
uiHandles.push(o.node.on(o.ev, focus));
                }

                //node defined, keycode defined, event defined (its a key press)
                else {_yuitest_coverline("build/widget-modality/widget-modality.js", 425);
if (o.node && o.keyCode && o.ev) {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 426);
uiHandles.push(o.node.on(o.ev, focus, o.keyCode));
                }

                else {
                    _yuitest_coverline("build/widget-modality/widget-modality.js", 430);
Y.Log('focusOn ATTR Error: The event with name "'+o.ev+'" could not be attached.');
                }}}

            }

            _yuitest_coverline("build/widget-modality/widget-modality.js", 435);
if ( ! supportsPosFixed) {
                _yuitest_coverline("build/widget-modality/widget-modality.js", 436);
uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){
                    _yuitest_coverfunc("build/widget-modality/widget-modality.js", "(anonymous 4)", 436);
_yuitest_coverline("build/widget-modality/widget-modality.js", 437);
maskNode.setStyle('top', maskNode.get('docScrollY'));
                }, this)));
            }

            _yuitest_coverline("build/widget-modality/widget-modality.js", 441);
this._uiHandlesModal = uiHandles;
        },

        /**
         * Detaches all UI Listeners that were set in _attachUIHandlesModal from the widget.
         *
         * @method _detachUIHandlesModal
         */
        _detachUIHandlesModal : function () {
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_detachUIHandlesModal", 449);
_yuitest_coverline("build/widget-modality/widget-modality.js", 450);
Y.each(this._uiHandlesModal, function(h){
                _yuitest_coverfunc("build/widget-modality/widget-modality.js", "(anonymous 5)", 450);
_yuitest_coverline("build/widget-modality/widget-modality.js", 451);
h.detach();
            });
            _yuitest_coverline("build/widget-modality/widget-modality.js", 453);
this._uiHandlesModal = null;
        },

        /**
         * Default function that is called when visibility is changed on the widget.
         *
         * @method _afterHostVisibleChangeModal
         * @param {EventFacade} e The event facade of the change
         */
        _afterHostVisibleChangeModal : function (e) {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_afterHostVisibleChangeModal", 462);
_yuitest_coverline("build/widget-modality/widget-modality.js", 464);
this._uiSetHostVisibleModal(e.newVal);
        },

        /**
         * Default function that is called when z-index is changed on the widget.
         *
         * @method _afterHostZIndexChangeModal
         * @param {EventFacade} e The event facade of the change
         */
        _afterHostZIndexChangeModal : function (e) {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_afterHostZIndexChangeModal", 473);
_yuitest_coverline("build/widget-modality/widget-modality.js", 475);
this._uiSetHostZIndexModal(e.newVal);
        },

        /**
         * Returns a boolean representing whether the current widget is in a "nested modality" state.
         * This is done by checking the number of widgets currently on the stack.
         *
         * @method isNested
         * @public
         */
        isNested: function() {
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "isNested", 485);
_yuitest_coverline("build/widget-modality/widget-modality.js", 486);
var length = WidgetModal.STACK.length,
            retval = (length > 1) ? true : false;
            _yuitest_coverline("build/widget-modality/widget-modality.js", 488);
return retval;
        },

        /**
         * Repositions the mask in the DOM for nested modality cases.
         *
         * @method _repositionMask
         * @param {Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.
         */
        _repositionMask: function(nextElem) {

            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_repositionMask", 497);
_yuitest_coverline("build/widget-modality/widget-modality.js", 499);
var currentModal = this.get('modal'),
                nextModal    = nextElem.get('modal'),
                maskNode     = this.get('maskNode'),
                bb, bbParent;

            //if this is modal and host is not modal
            _yuitest_coverline("build/widget-modality/widget-modality.js", 505);
if (currentModal && !nextModal) {
                //leave the mask where it is, since the host is not modal.
                _yuitest_coverline("build/widget-modality/widget-modality.js", 507);
maskNode.remove();
                _yuitest_coverline("build/widget-modality/widget-modality.js", 508);
this.fire(MaskHide);
            }

            //if the main widget is not modal but the host is modal, or both of them are modal
            else {_yuitest_coverline("build/widget-modality/widget-modality.js", 512);
if ((!currentModal && nextModal) || (currentModal && nextModal)) {

                //then remove the mask off DOM, reposition it, and reinsert it into the DOM
                _yuitest_coverline("build/widget-modality/widget-modality.js", 515);
maskNode.remove();
                _yuitest_coverline("build/widget-modality/widget-modality.js", 516);
this.fire(MaskHide);
                _yuitest_coverline("build/widget-modality/widget-modality.js", 517);
bb = nextElem.get(BOUNDING_BOX);
                _yuitest_coverline("build/widget-modality/widget-modality.js", 518);
bbParent = bb.get('parentNode') || Y.one('body');
                _yuitest_coverline("build/widget-modality/widget-modality.js", 519);
bbParent.insert(maskNode, bbParent.get('firstChild'));
                _yuitest_coverline("build/widget-modality/widget-modality.js", 520);
this.fire(MaskShow);
            }}

        },

        /**
         * Resyncs the mask in the viewport for browsers that don't support fixed positioning
         *
         * @method _resyncMask
         * @param {Y.Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.
         * @private
         */
        _resyncMask: function (e) {
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_resyncMask", 532);
_yuitest_coverline("build/widget-modality/widget-modality.js", 533);
var o       = e.currentTarget,
                offsetX = o.get('docScrollX'),
                offsetY = o.get('docScrollY'),
                w       = o.get('innerWidth') || o.get('winWidth'),
                h       = o.get('innerHeight') || o.get('winHeight'),
                mask    = this.get('maskNode');

            _yuitest_coverline("build/widget-modality/widget-modality.js", 540);
mask.setStyles({
                "top": offsetY + "px",
                "left": offsetX + "px",
                "width": w + 'px',
                "height": h + 'px'
            });
        },

        /**
         * Default function called when focusOn Attribute is changed. Remove existing listeners and create new listeners.
         *
         * @method _afterFocusOnChange
         */
        _afterFocusOnChange : function(e) {
            _yuitest_coverfunc("build/widget-modality/widget-modality.js", "_afterFocusOnChange", 553);
_yuitest_coverline("build/widget-modality/widget-modality.js", 554);
this._detachUIHandlesModal();

            _yuitest_coverline("build/widget-modality/widget-modality.js", 556);
if (this.get(VISIBLE)) {
                _yuitest_coverline("build/widget-modality/widget-modality.js", 557);
this._attachUIHandlesModal();
            }
        }
    };

    _yuitest_coverline("build/widget-modality/widget-modality.js", 562);
Y.WidgetModality = WidgetModal;



}, '3.7.3', {"requires": ["base-build", "event-outside", "widget"], "skinnable": true});
