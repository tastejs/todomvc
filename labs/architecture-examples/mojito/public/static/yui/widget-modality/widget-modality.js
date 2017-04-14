/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-modality', function (Y, NAME) {

/**
 * Provides modality support for Widgets, though an extension
 *
 * @module widget-modality
 */

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

        var doc         = Y.config.doc,
            isSupported = null,
            el, root;

        if (doc.createElement) {
            el = doc.createElement('div');
            if (el && el.style) {
                el.style.position = 'fixed';
                el.style.top = '10px';
                root = doc.body;
                if (root && root.appendChild && root.removeChild) {
                    root.appendChild(el);
                    isSupported = (el.offsetTop === 10);
                    root.removeChild(el);
                }
            }
        }

        return isSupported;
    }());

    /**
     * Widget extension, which can be used to add modality support to the base Widget class,
     * through the Base.create method.
     *
     * @class WidgetModality
     * @param {Object} config User configuration object
     */
    function WidgetModal(config) {}

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
    WidgetModal._GET_MASK = function() {

        var mask = Y.one('.' + MODAL_CLASSES.mask),
            win  = Y.one('win');

        if (mask) {
            return mask;
        }

        mask = Y.Node.create('<div></div>').addClass(MODAL_CLASSES.mask);

        if (supportsPosFixed) {
            mask.setStyles({
                position: 'fixed',
                width   : '100%',
                height  : '100%',
                top     : '0',
                left    : '0',
                display : 'block'
            });
        } else {
            mask.setStyles({
                position: 'absolute',
                width   : win.get('winWidth') +'px',
                height  : win.get('winHeight') + 'px',
                top     : '0',
                left    : '0',
                display : 'block'
            });
        }

        return mask;
    };

    /**
     * A stack of Y.Widget objects representing the current hierarchy of modal widgets presently displayed on the screen
     * @property STACK
     */
    WidgetModal.STACK = [];


    WidgetModal.prototype = {

        initializer: function () {
            Y.after(this._renderUIModal, this, RENDER_UI);
            Y.after(this._syncUIModal, this, SYNC_UI);
            Y.after(this._bindUIModal, this, BIND_UI);
        },

        destructor: function () {
            // Hack to remove this thing from the STACK.
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

            var bb = this.get(BOUNDING_BOX);
                //cb = this.get(CONTENT_BOX);

            //this makes the content box content appear over the mask
            // cb.setStyles({
            //     position: ""
            // });

            this._repositionMask(this);
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

            this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeModal);
            this.after(Z_INDEX+CHANGE, this._afterHostZIndexChangeModal);
            this.after("focusOnChange", this._afterFocusOnChange);

            // Re-align the mask in the viewport if `position: fixed;` is not
            // supported. iOS < 5 and Android < 3 don't actually support it even
            // though they both pass the feature test; the UA sniff is here to
            // account for that. Ideally this should be replaced with a better
            // feature test.
            if (!supportsPosFixed ||
                    (Y.UA.ios && Y.UA.ios < 5) ||
                    (Y.UA.android && Y.UA.android < 3)) {

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

            this._uiSetHostVisibleModal(this.get(VISIBLE));
            this._uiSetHostZIndexModal(this.get(Z_INDEX));

        },

        /**
         * Provides mouse and tab focus to the widget's bounding box.
         *
         * @method _focus
         */
        _focus : function (e) {

            var bb = this.get(BOUNDING_BOX),
            oldTI = bb.get('tabIndex');

            bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);
            this.focus();
        },
        /**
         * Blurs the widget.
         *
         * @method _blur
         */
        _blur : function () {

            this.blur();
        },

        /**
         * Returns the Y.Node instance of the maskNode
         *
         * @method _getMaskNode
         * @return {Node} The Y.Node instance of the mask, as returned from WidgetModal._GET_MASK
         */
        _getMaskNode : function () {

            return WidgetModal._GET_MASK();
        },

        /**
         * Performs events attaching/detaching, stack shifting and mask repositioning based on the visibility of the widget
         *
         * @method _uiSetHostVisibleModal
         * @param {boolean} Whether the widget is visible or not
         */
        _uiSetHostVisibleModal : function (visible) {
            var stack    = WidgetModal.STACK,
                maskNode = this.get('maskNode'),
                isModal  = this.get('modal'),
                topModal, index;

            if (visible) {

                Y.Array.each(stack, function(modal){
                    modal._detachUIHandlesModal();
                    modal._blur();
                });

                // push on top of stack
                stack.unshift(this);

                this._repositionMask(this);
                this._uiSetHostZIndexModal(this.get(Z_INDEX));

                if (isModal) {
                    maskNode.show();
                    Y.later(1, this, '_attachUIHandlesModal');
                    this._focus();
                }


            } else {

                index = Y.Array.indexOf(stack, this);
                if (index >= 0) {
                    // Remove modal widget from global stack.
                    stack.splice(index, 1);
                }

                this._detachUIHandlesModal();
                this._blur();

                if (stack.length) {
                    topModal = stack[0];
                    this._repositionMask(topModal);
                    //topModal._attachUIHandlesModal();
                    topModal._uiSetHostZIndexModal(topModal.get(Z_INDEX));

                    if (topModal.get('modal')) {
                        //topModal._attachUIHandlesModal();
                        Y.later(1, topModal, '_attachUIHandlesModal');
                        topModal._focus();
                    }

                } else {

                    if (maskNode.getStyle('display') === 'block') {
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

            if (this.get('modal')) {
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

            if (this._uiHandlesModal || WidgetModal.STACK[0] !== this) {
                // Quit early if we have ui handles, or if we not at the top
                // of the global stack.
                return;
            }

            var bb          = this.get(BOUNDING_BOX),
                maskNode    = this.get('maskNode'),
                focusOn     = this.get('focusOn'),
                focus       = Y.bind(this._focus, this),
                uiHandles   = [],
                i, len, o;

            for (i = 0, len = focusOn.length; i < len; i++) {

                o = {};
                o.node = focusOn[i].node;
                o.ev = focusOn[i].eventName;
                o.keyCode = focusOn[i].keyCode;

                //no keycode or node defined
                if (!o.node && !o.keyCode && o.ev) {
                    uiHandles.push(bb.on(o.ev, focus));
                }

                //node defined, no keycode (not a keypress)
                else if (o.node && !o.keyCode && o.ev) {
                    uiHandles.push(o.node.on(o.ev, focus));
                }

                //node defined, keycode defined, event defined (its a key press)
                else if (o.node && o.keyCode && o.ev) {
                    uiHandles.push(o.node.on(o.ev, focus, o.keyCode));
                }

                else {
                    Y.Log('focusOn ATTR Error: The event with name "'+o.ev+'" could not be attached.');
                }

            }

            if ( ! supportsPosFixed) {
                uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){
                    maskNode.setStyle('top', maskNode.get('docScrollY'));
                }, this)));
            }

            this._uiHandlesModal = uiHandles;
        },

        /**
         * Detaches all UI Listeners that were set in _attachUIHandlesModal from the widget.
         *
         * @method _detachUIHandlesModal
         */
        _detachUIHandlesModal : function () {
            Y.each(this._uiHandlesModal, function(h){
                h.detach();
            });
            this._uiHandlesModal = null;
        },

        /**
         * Default function that is called when visibility is changed on the widget.
         *
         * @method _afterHostVisibleChangeModal
         * @param {EventFacade} e The event facade of the change
         */
        _afterHostVisibleChangeModal : function (e) {

            this._uiSetHostVisibleModal(e.newVal);
        },

        /**
         * Default function that is called when z-index is changed on the widget.
         *
         * @method _afterHostZIndexChangeModal
         * @param {EventFacade} e The event facade of the change
         */
        _afterHostZIndexChangeModal : function (e) {

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
            var length = WidgetModal.STACK.length,
            retval = (length > 1) ? true : false;
            return retval;
        },

        /**
         * Repositions the mask in the DOM for nested modality cases.
         *
         * @method _repositionMask
         * @param {Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.
         */
        _repositionMask: function(nextElem) {

            var currentModal = this.get('modal'),
                nextModal    = nextElem.get('modal'),
                maskNode     = this.get('maskNode'),
                bb, bbParent;

            //if this is modal and host is not modal
            if (currentModal && !nextModal) {
                //leave the mask where it is, since the host is not modal.
                maskNode.remove();
                this.fire(MaskHide);
            }

            //if the main widget is not modal but the host is modal, or both of them are modal
            else if ((!currentModal && nextModal) || (currentModal && nextModal)) {

                //then remove the mask off DOM, reposition it, and reinsert it into the DOM
                maskNode.remove();
                this.fire(MaskHide);
                bb = nextElem.get(BOUNDING_BOX);
                bbParent = bb.get('parentNode') || Y.one('body');
                bbParent.insert(maskNode, bbParent.get('firstChild'));
                this.fire(MaskShow);
            }

        },

        /**
         * Resyncs the mask in the viewport for browsers that don't support fixed positioning
         *
         * @method _resyncMask
         * @param {Y.Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.
         * @private
         */
        _resyncMask: function (e) {
            var o       = e.currentTarget,
                offsetX = o.get('docScrollX'),
                offsetY = o.get('docScrollY'),
                w       = o.get('innerWidth') || o.get('winWidth'),
                h       = o.get('innerHeight') || o.get('winHeight'),
                mask    = this.get('maskNode');

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
            this._detachUIHandlesModal();

            if (this.get(VISIBLE)) {
                this._attachUIHandlesModal();
            }
        }
    };

    Y.WidgetModality = WidgetModal;



}, '3.7.3', {"requires": ["base-build", "event-outside", "widget"], "skinnable": true});
