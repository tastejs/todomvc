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
_yuitest_coverage["build/autocomplete-list/autocomplete-list.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-list/autocomplete-list.js",
    code: []
};
_yuitest_coverage["build/autocomplete-list/autocomplete-list.js"].code=["YUI.add('autocomplete-list', function (Y, NAME) {","","/**","Traditional autocomplete dropdown list widget, just like Mom used to make.","","@module autocomplete","@submodule autocomplete-list","**/","","/**","Traditional autocomplete dropdown list widget, just like Mom used to make.","","@class AutoCompleteList","@extends Widget","@uses AutoCompleteBase","@uses WidgetPosition","@uses WidgetPositionAlign","@constructor","@param {Object} config Configuration object.","**/","","var Lang   = Y.Lang,","    Node   = Y.Node,","    YArray = Y.Array,","","    // Whether or not we need an iframe shim.","    useShim = Y.UA.ie && Y.UA.ie < 7,","","    // keyCode constants.","    KEY_TAB = 9,","","    // String shorthand.","    _CLASS_ITEM        = '_CLASS_ITEM',","    _CLASS_ITEM_ACTIVE = '_CLASS_ITEM_ACTIVE',","    _CLASS_ITEM_HOVER  = '_CLASS_ITEM_HOVER',","    _SELECTOR_ITEM     = '_SELECTOR_ITEM',","","    ACTIVE_ITEM      = 'activeItem',","    ALWAYS_SHOW_LIST = 'alwaysShowList',","    CIRCULAR         = 'circular',","    HOVERED_ITEM     = 'hoveredItem',","    ID               = 'id',","    ITEM             = 'item',","    LIST             = 'list',","    RESULT           = 'result',","    RESULTS          = 'results',","    VISIBLE          = 'visible',","    WIDTH            = 'width',","","    // Event names.","    EVT_SELECT = 'select',","","List = Y.Base.create('autocompleteList', Y.Widget, [","    Y.AutoCompleteBase,","    Y.WidgetPosition,","    Y.WidgetPositionAlign","], {","    // -- Prototype Properties -------------------------------------------------","    ARIA_TEMPLATE: '<div/>',","    ITEM_TEMPLATE: '<li/>',","    LIST_TEMPLATE: '<ul/>',","","    // Widget automatically attaches delegated event handlers to everything in","    // Y.Node.DOM_EVENTS, including synthetic events. Since Widget's event","    // delegation won't work for the synthetic valuechange event, and since","    // it creates a name collision between the backcompat \"valueChange\" synth","    // event alias and AutoCompleteList's \"valueChange\" event for the \"value\"","    // attr, this hack is necessary in order to prevent Widget from attaching","    // valuechange handlers.","    UI_EVENTS: (function () {","        var uiEvents = Y.merge(Y.Node.DOM_EVENTS);","","        delete uiEvents.valuechange;","        delete uiEvents.valueChange;","","        return uiEvents;","    }()),","","    // -- Lifecycle Prototype Methods ------------------------------------------","    initializer: function () {","        var inputNode = this.get('inputNode');","","        if (!inputNode) {","            Y.error('No inputNode specified.');","            return;","        }","","        this._inputNode  = inputNode;","        this._listEvents = [];","","        // This ensures that the list is rendered inside the same parent as the","        // input node by default, which is necessary for proper ARIA support.","        this.DEF_PARENT_NODE = inputNode.get('parentNode');","","        // Cache commonly used classnames and selectors for performance.","        this[_CLASS_ITEM]        = this.getClassName(ITEM);","        this[_CLASS_ITEM_ACTIVE] = this.getClassName(ITEM, 'active');","        this[_CLASS_ITEM_HOVER]  = this.getClassName(ITEM, 'hover');","        this[_SELECTOR_ITEM]     = '.' + this[_CLASS_ITEM];","","        /**","        Fires when an autocomplete suggestion is selected from the list,","        typically via a keyboard action or mouse click.","","        @event select","        @param {Node} itemNode List item node that was selected.","        @param {Object} result AutoComplete result object.","        @preventable _defSelectFn","        **/","        this.publish(EVT_SELECT, {","            defaultFn: this._defSelectFn","        });","    },","","    destructor: function () {","        while (this._listEvents.length) {","            this._listEvents.pop().detach();","        }","","        if (this._ariaNode) {","            this._ariaNode.remove().destroy(true);","        }","    },","","    bindUI: function () {","        this._bindInput();","        this._bindList();","    },","","    renderUI: function () {","        var ariaNode    = this._createAriaNode(),","            boundingBox = this.get('boundingBox'),","            contentBox  = this.get('contentBox'),","            inputNode   = this._inputNode,","            listNode    = this._createListNode(),","            parentNode  = inputNode.get('parentNode');","","        inputNode.addClass(this.getClassName('input')).setAttrs({","            'aria-autocomplete': LIST,","            'aria-expanded'    : false,","            'aria-owns'        : listNode.get('id')","        });","","        // ARIA node must be outside the widget or announcements won't be made","        // when the widget is hidden.","        parentNode.append(ariaNode);","","        // Add an iframe shim for IE6.","        if (useShim) {","            boundingBox.plug(Y.Plugin.Shim);","        }","","        // Force position: absolute on the boundingBox. This works around a","        // potential CSS loading race condition in Gecko that can cause the","        // boundingBox to become relatively positioned, which is all kinds of","        // no good.","        boundingBox.setStyle('position', 'absolute');","","        this._ariaNode    = ariaNode;","        this._boundingBox = boundingBox;","        this._contentBox  = contentBox;","        this._listNode    = listNode;","        this._parentNode  = parentNode;","    },","","    syncUI: function () {","        // No need to call _syncPosition() here; the other _sync methods will","        // call it when necessary.","        this._syncResults();","        this._syncVisibility();","    },","","    // -- Public Prototype Methods ---------------------------------------------","","    /**","    Hides the list, unless the `alwaysShowList` attribute is `true`.","","    @method hide","    @see show","    @chainable","    **/","    hide: function () {","        return this.get(ALWAYS_SHOW_LIST) ? this : this.set(VISIBLE, false);","    },","","    /**","    Selects the specified _itemNode_, or the current `activeItem` if _itemNode_","    is not specified.","","    @method selectItem","    @param {Node} [itemNode] Item node to select.","    @param {EventFacade} [originEvent] Event that triggered the selection, if","        any.","    @chainable","    **/","    selectItem: function (itemNode, originEvent) {","        if (itemNode) {","            if (!itemNode.hasClass(this[_CLASS_ITEM])) {","                return this;","            }","        } else {","            itemNode = this.get(ACTIVE_ITEM);","","            if (!itemNode) {","                return this;","            }","        }","","        this.fire(EVT_SELECT, {","            itemNode   : itemNode,","            originEvent: originEvent || null,","            result     : itemNode.getData(RESULT)","        });","","        return this;","    },","","    // -- Protected Prototype Methods ------------------------------------------","","    /**","    Activates the next item after the currently active item. If there is no next","    item and the `circular` attribute is `true`, focus will wrap back to the","    input node.","","    @method _activateNextItem","    @chainable","    @protected","    **/","    _activateNextItem: function () {","        var item = this.get(ACTIVE_ITEM),","            nextItem;","","        if (item) {","            nextItem = item.next(this[_SELECTOR_ITEM]) ||","                    (this.get(CIRCULAR) ? null : item);","        } else {","            nextItem = this._getFirstItemNode();","        }","","        this.set(ACTIVE_ITEM, nextItem);","","        return this;","    },","","    /**","    Activates the item previous to the currently active item. If there is no","    previous item and the `circular` attribute is `true`, focus will wrap back","    to the input node.","","    @method _activatePrevItem","    @chainable","    @protected","    **/","    _activatePrevItem: function () {","        var item     = this.get(ACTIVE_ITEM),","            prevItem = item ? item.previous(this[_SELECTOR_ITEM]) :","                    this.get(CIRCULAR) && this._getLastItemNode();","","        this.set(ACTIVE_ITEM, prevItem || null);","","        return this;","    },","","    /**","    Appends the specified result _items_ to the list inside a new item node.","","    @method _add","    @param {Array|Node|HTMLElement|String} items Result item or array of","        result items.","    @return {NodeList} Added nodes.","    @protected","    **/","    _add: function (items) {","        var itemNodes = [];","","        YArray.each(Lang.isArray(items) ? items : [items], function (item) {","            itemNodes.push(this._createItemNode(item).setData(RESULT, item));","        }, this);","","        itemNodes = Y.all(itemNodes);","        this._listNode.append(itemNodes.toFrag());","","        return itemNodes;","    },","","    /**","    Updates the ARIA live region with the specified message.","","    @method _ariaSay","    @param {String} stringId String id (from the `strings` attribute) of the","        message to speak.","    @param {Object} [subs] Substitutions for placeholders in the string.","    @protected","    **/","    _ariaSay: function (stringId, subs) {","        var message = this.get('strings.' + stringId);","        this._ariaNode.set('text', subs ? Lang.sub(message, subs) : message);","    },","","    /**","    Binds `inputNode` events and behavior.","","    @method _bindInput","    @protected","    **/","    _bindInput: function () {","        var inputNode = this._inputNode,","            alignNode, alignWidth, tokenInput;","","        // Null align means we can auto-align. Set align to false to prevent","        // auto-alignment, or a valid alignment config to customize the","        // alignment.","        if (this.get('align') === null) {","            // If this is a tokenInput, align with its bounding box.","            // Otherwise, align with the inputNode. Bit of a cheat.","            tokenInput = this.get('tokenInput');","            alignNode  = (tokenInput && tokenInput.get('boundingBox')) || inputNode;","","            this.set('align', {","                node  : alignNode,","                points: ['tl', 'bl']","            });","","            // If no width config is set, attempt to set the list's width to the","            // width of the alignment node. If the alignment node's width is","            // falsy, do nothing.","            if (!this.get(WIDTH) && (alignWidth = alignNode.get('offsetWidth'))) {","                this.set(WIDTH, alignWidth);","            }","        }","","        // Attach inputNode events.","        this._listEvents = this._listEvents.concat([","            inputNode.after('blur',  this._afterListInputBlur, this),","            inputNode.after('focus', this._afterListInputFocus, this)","        ]);","    },","","    /**","    Binds list events.","","    @method _bindList","    @protected","    **/","    _bindList: function () {","        this._listEvents = this._listEvents.concat([","            Y.one('doc').after('click', this._afterDocClick, this),","            Y.one('win').after('windowresize', this._syncPosition, this),","","            this.after({","                mouseover: this._afterMouseOver,","                mouseout : this._afterMouseOut,","","                activeItemChange    : this._afterActiveItemChange,","                alwaysShowListChange: this._afterAlwaysShowListChange,","                hoveredItemChange   : this._afterHoveredItemChange,","                resultsChange       : this._afterResultsChange,","                visibleChange       : this._afterVisibleChange","            }),","","            this._listNode.delegate('click', this._onItemClick,","                    this[_SELECTOR_ITEM], this)","        ]);","    },","","    /**","    Clears the contents of the tray.","","    @method _clear","    @protected","    **/","    _clear: function () {","        this.set(ACTIVE_ITEM, null);","        this._set(HOVERED_ITEM, null);","","        this._listNode.get('children').remove(true);","    },","","    /**","    Creates and returns an ARIA live region node.","","    @method _createAriaNode","    @return {Node} ARIA node.","    @protected","    **/","    _createAriaNode: function () {","        var ariaNode = Node.create(this.ARIA_TEMPLATE);","","        return ariaNode.addClass(this.getClassName('aria')).setAttrs({","            'aria-live': 'polite',","            role       : 'status'","        });","    },","","    /**","    Creates and returns an item node with the specified _content_.","","    @method _createItemNode","    @param {Object} result Result object.","    @return {Node} Item node.","    @protected","    **/","    _createItemNode: function (result) {","        var itemNode = Node.create(this.ITEM_TEMPLATE);","","        return itemNode.addClass(this[_CLASS_ITEM]).setAttrs({","            id  : Y.stamp(itemNode),","            role: 'option'","        }).setAttribute('data-text', result.text).append(result.display);","    },","","    /**","    Creates and returns a list node. If the `listNode` attribute is already set","    to an existing node, that node will be used.","","    @method _createListNode","    @return {Node} List node.","    @protected","    **/","    _createListNode: function () {","        var listNode = this.get('listNode') || Node.create(this.LIST_TEMPLATE);","","        listNode.addClass(this.getClassName(LIST)).setAttrs({","            id  : Y.stamp(listNode),","            role: 'listbox'","        });","","        this._set('listNode', listNode);","        this.get('contentBox').append(listNode);","","        return listNode;","    },","","    /**","    Gets the first item node in the list, or `null` if the list is empty.","","    @method _getFirstItemNode","    @return {Node|null}","    @protected","    **/","    _getFirstItemNode: function () {","        return this._listNode.one(this[_SELECTOR_ITEM]);","    },","","    /**","    Gets the last item node in the list, or `null` if the list is empty.","","    @method _getLastItemNode","    @return {Node|null}","    @protected","    **/","    _getLastItemNode: function () {","        return this._listNode.one(this[_SELECTOR_ITEM] + ':last-child');","    },","","    /**","    Synchronizes the result list's position and alignment.","","    @method _syncPosition","    @protected","    **/","    _syncPosition: function () {","        // Force WidgetPositionAlign to refresh its alignment.","        this._syncUIPosAlign();","","        // Resize the IE6 iframe shim to match the list's dimensions.","        this._syncShim();","    },","","    /**","    Synchronizes the results displayed in the list with those in the _results_","    argument, or with the `results` attribute if an argument is not provided.","","    @method _syncResults","    @param {Array} [results] Results.","    @protected","    **/","    _syncResults: function (results) {","        if (!results) {","            results = this.get(RESULTS);","        }","","        this._clear();","","        if (results.length) {","            this._add(results);","            this._ariaSay('items_available');","        }","","        this._syncPosition();","","        if (this.get('activateFirstItem') && !this.get(ACTIVE_ITEM)) {","            this.set(ACTIVE_ITEM, this._getFirstItemNode());","        }","    },","","    /**","    Synchronizes the size of the iframe shim used for IE6 and lower. In other","    browsers, this method is a noop.","","    @method _syncShim","    @protected","    **/","    _syncShim: useShim ? function () {","        var shim = this._boundingBox.shim;","","        if (shim) {","            shim.sync();","        }","    } : function () {},","","    /**","    Synchronizes the visibility of the tray with the _visible_ argument, or with","    the `visible` attribute if an argument is not provided.","","    @method _syncVisibility","    @param {Boolean} [visible] Visibility.","    @protected","    **/","    _syncVisibility: function (visible) {","        if (this.get(ALWAYS_SHOW_LIST)) {","            visible = true;","            this.set(VISIBLE, visible);","        }","","        if (typeof visible === 'undefined') {","            visible = this.get(VISIBLE);","        }","","        this._inputNode.set('aria-expanded', visible);","        this._boundingBox.set('aria-hidden', !visible);","","        if (visible) {","            this._syncPosition();","        } else {","            this.set(ACTIVE_ITEM, null);","            this._set(HOVERED_ITEM, null);","","            // Force a reflow to work around a glitch in IE6 and 7 where some of","            // the contents of the list will sometimes remain visible after the","            // container is hidden.","            this._boundingBox.get('offsetWidth');","        }","","        // In some pages, IE7 fails to repaint the contents of the list after it","        // becomes visible. Toggling a bogus class on the body forces a repaint","        // that fixes the issue.","        if (Y.UA.ie === 7) {","            // Note: We don't actually need to use ClassNameManager here. This","            // class isn't applying any actual styles; it's just frobbing the","            // body element to force a repaint. The actual class name doesn't","            // really matter.","            Y.one('body')","                .addClass('yui3-ie7-sucks')","                .removeClass('yui3-ie7-sucks');","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `activeItemChange` events.","","    @method _afterActiveItemChange","    @param {EventFacade} e","    @protected","    **/","    _afterActiveItemChange: function (e) {","        var inputNode = this._inputNode,","            newVal    = e.newVal,","            prevVal   = e.prevVal,","            node;","","        // The previous item may have disappeared by the time this handler runs,","        // so we need to be careful.","        if (prevVal && prevVal._node) {","            prevVal.removeClass(this[_CLASS_ITEM_ACTIVE]);","        }","","        if (newVal) {","            newVal.addClass(this[_CLASS_ITEM_ACTIVE]);","            inputNode.set('aria-activedescendant', newVal.get(ID));","        } else {","            inputNode.removeAttribute('aria-activedescendant');","        }","","        if (this.get('scrollIntoView')) {","            node = newVal || inputNode;","","            if (!node.inRegion(Y.DOM.viewportRegion(), true)","                    || !node.inRegion(this._contentBox, true)) {","","                node.scrollIntoView();","            }","        }","    },","","    /**","    Handles `alwaysShowListChange` events.","","    @method _afterAlwaysShowListChange","    @param {EventFacade} e","    @protected","    **/","    _afterAlwaysShowListChange: function (e) {","        this.set(VISIBLE, e.newVal || this.get(RESULTS).length > 0);","    },","","    /**","    Handles click events on the document. If the click is outside both the","    input node and the bounding box, the list will be hidden.","","    @method _afterDocClick","    @param {EventFacade} e","    @protected","    @since 3.5.0","    **/","    _afterDocClick: function (e) {","        var boundingBox = this._boundingBox,","            target      = e.target;","","        if(target !== this._inputNode && target !== boundingBox &&","                target.ancestor('#' + boundingBox.get('id'), true)){","            this.hide();","        }","    },","","    /**","    Handles `hoveredItemChange` events.","","    @method _afterHoveredItemChange","    @param {EventFacade} e","    @protected","    **/","    _afterHoveredItemChange: function (e) {","        var newVal  = e.newVal,","            prevVal = e.prevVal;","","        if (prevVal) {","            prevVal.removeClass(this[_CLASS_ITEM_HOVER]);","        }","","        if (newVal) {","            newVal.addClass(this[_CLASS_ITEM_HOVER]);","        }","    },","","    /**","    Handles `inputNode` blur events.","","    @method _afterListInputBlur","    @protected","    **/","    _afterListInputBlur: function () {","        this._listInputFocused = false;","","        if (this.get(VISIBLE) &&","                !this._mouseOverList &&","                (this._lastInputKey !== KEY_TAB ||","                    !this.get('tabSelect') ||","                    !this.get(ACTIVE_ITEM))) {","            this.hide();","        }","    },","","    /**","    Handles `inputNode` focus events.","","    @method _afterListInputFocus","    @protected","    **/","    _afterListInputFocus: function () {","        this._listInputFocused = true;","    },","","    /**","    Handles `mouseover` events.","","    @method _afterMouseOver","    @param {EventFacade} e","    @protected","    **/","    _afterMouseOver: function (e) {","        var itemNode = e.domEvent.target.ancestor(this[_SELECTOR_ITEM], true);","","        this._mouseOverList = true;","","        if (itemNode) {","            this._set(HOVERED_ITEM, itemNode);","        }","    },","","    /**","    Handles `mouseout` events.","","    @method _afterMouseOut","    @param {EventFacade} e","    @protected","    **/","    _afterMouseOut: function () {","        this._mouseOverList = false;","        this._set(HOVERED_ITEM, null);","    },","","    /**","    Handles `resultsChange` events.","","    @method _afterResultsChange","    @param {EventFacade} e","    @protected","    **/","    _afterResultsChange: function (e) {","        this._syncResults(e.newVal);","","        if (!this.get(ALWAYS_SHOW_LIST)) {","            this.set(VISIBLE, !!e.newVal.length);","        }","    },","","    /**","    Handles `visibleChange` events.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this._syncVisibility(!!e.newVal);","    },","","    /**","    Delegated event handler for item `click` events.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var itemNode = e.currentTarget;","","        this.set(ACTIVE_ITEM, itemNode);","        this.selectItem(itemNode, e);","    },","","    // -- Protected Default Event Handlers -------------------------------------","","    /**","    Default `select` event handler.","","    @method _defSelectFn","    @param {EventFacade} e","    @protected","    **/","    _defSelectFn: function (e) {","        var text = e.result.text;","","        // TODO: support typeahead completion, etc.","        this._inputNode.focus();","        this._updateValue(text);","        this._ariaSay('item_selected', {item: text});","        this.hide();","    }","}, {","    ATTRS: {","        /**","        If `true`, the first item in the list will be activated by default when","        the list is initially displayed and when results change.","","        @attribute activateFirstItem","        @type Boolean","        @default false","        **/","        activateFirstItem: {","            value: false","        },","","        /**","        Item that's currently active, if any. When the user presses enter, this","        is the item that will be selected.","","        @attribute activeItem","        @type Node","        **/","        activeItem: {","            setter: Y.one,","            value: null","        },","","        /**","        If `true`, the list will remain visible even when there are no results","        to display.","","        @attribute alwaysShowList","        @type Boolean","        @default false","        **/","        alwaysShowList: {","            value: false","        },","","        /**","        If `true`, keyboard navigation will wrap around to the opposite end of","        the list when navigating past the first or last item.","","        @attribute circular","        @type Boolean","        @default true","        **/","        circular: {","            value: true","        },","","        /**","        Item currently being hovered over by the mouse, if any.","","        @attribute hoveredItem","        @type Node|null","        @readOnly","        **/","        hoveredItem: {","            readOnly: true,","            value: null","        },","","        /**","        Node that will contain result items.","","        @attribute listNode","        @type Node|null","        @initOnly","        **/","        listNode: {","            writeOnce: 'initOnly',","            value: null","        },","","        /**","        If `true`, the viewport will be scrolled to ensure that the active list","        item is visible when necessary.","","        @attribute scrollIntoView","        @type Boolean","        @default false","        **/","        scrollIntoView: {","            value: false","        },","","        /**","        Translatable strings used by the AutoCompleteList widget.","","        @attribute strings","        @type Object","        **/","        strings: {","            valueFn: function () {","                return Y.Intl.get('autocomplete-list');","            }","        },","","        /**","        If `true`, pressing the tab key while the list is visible will select","        the active item, if any.","","        @attribute tabSelect","        @type Boolean","        @default true","        **/","        tabSelect: {","            value: true","        },","","        // The \"visible\" attribute is documented in Widget.","        visible: {","            value: false","        }","    },","","    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')","});","","Y.AutoCompleteList = List;","","/**","Alias for <a href=\"AutoCompleteList.html\">`AutoCompleteList`</a>. See that class","for API docs.","","@class AutoComplete","**/","","Y.AutoComplete = List;","","","}, '3.7.3', {\"lang\": [\"en\"], \"requires\": [\"autocomplete-base\", \"event-resize\", \"node-screen\", \"selector-css3\", \"shim-plugin\", \"widget\", \"widget-position\", \"widget-position-align\"], \"skinnable\": true});"];
_yuitest_coverage["build/autocomplete-list/autocomplete-list.js"].lines = {"1":0,"22":0,"71":0,"73":0,"74":0,"76":0,"81":0,"83":0,"84":0,"85":0,"88":0,"89":0,"93":0,"96":0,"97":0,"98":0,"99":0,"110":0,"116":0,"117":0,"120":0,"121":0,"126":0,"127":0,"131":0,"138":0,"146":0,"149":0,"150":0,"157":0,"159":0,"160":0,"161":0,"162":0,"163":0,"169":0,"170":0,"183":0,"197":0,"198":0,"199":0,"202":0,"204":0,"205":0,"209":0,"215":0,"230":0,"233":0,"234":0,"237":0,"240":0,"242":0,"255":0,"259":0,"261":0,"274":0,"276":0,"277":0,"280":0,"281":0,"283":0,"296":0,"297":0,"307":0,"313":0,"316":0,"317":0,"319":0,"327":0,"328":0,"333":0,"346":0,"373":0,"374":0,"376":0,"387":0,"389":0,"404":0,"406":0,"421":0,"423":0,"428":0,"429":0,"431":0,"442":0,"453":0,"464":0,"467":0,"479":0,"480":0,"483":0,"485":0,"486":0,"487":0,"490":0,"492":0,"493":0,"505":0,"507":0,"508":0,"521":0,"522":0,"523":0,"526":0,"527":0,"530":0,"531":0,"533":0,"534":0,"536":0,"537":0,"542":0,"548":0,"553":0,"569":0,"576":0,"577":0,"580":0,"581":0,"582":0,"584":0,"587":0,"588":0,"590":0,"593":0,"606":0,"619":0,"622":0,"624":0,"636":0,"639":0,"640":0,"643":0,"644":0,"655":0,"657":0,"662":0,"673":0,"684":0,"686":0,"688":0,"689":0,"701":0,"702":0,"713":0,"715":0,"716":0,"728":0,"739":0,"741":0,"742":0,"755":0,"758":0,"759":0,"760":0,"761":0,"857":0,"882":0,"891":0};
_yuitest_coverage["build/autocomplete-list/autocomplete-list.js"].functions = {"(anonymous 2):70":0,"initializer:80":0,"destructor:115":0,"bindUI:125":0,"renderUI:130":0,"syncUI:166":0,"hide:182":0,"selectItem:196":0,"_activateNextItem:229":0,"_activatePrevItem:254":0,"(anonymous 3):276":0,"_add:273":0,"_ariaSay:295":0,"_bindInput:306":0,"_bindList:345":0,"_clear:372":0,"_createAriaNode:386":0,"_createItemNode:403":0,"_createListNode:420":0,"_getFirstItemNode:441":0,"_getLastItemNode:452":0,"_syncPosition:462":0,"_syncResults:478":0,"(anonymous 4):504":0,"_syncVisibility:520":0,"_afterActiveItemChange:568":0,"_afterAlwaysShowListChange:605":0,"_afterDocClick:618":0,"_afterHoveredItemChange:635":0,"_afterListInputBlur:654":0,"_afterListInputFocus:672":0,"_afterMouseOver:683":0,"_afterMouseOut:700":0,"_afterResultsChange:712":0,"_afterVisibleChange:727":0,"_onItemClick:738":0,"_defSelectFn:754":0,"valueFn:856":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-list/autocomplete-list.js"].coveredLines = 159;
_yuitest_coverage["build/autocomplete-list/autocomplete-list.js"].coveredFunctions = 39;
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 1);
YUI.add('autocomplete-list', function (Y, NAME) {

/**
Traditional autocomplete dropdown list widget, just like Mom used to make.

@module autocomplete
@submodule autocomplete-list
**/

/**
Traditional autocomplete dropdown list widget, just like Mom used to make.

@class AutoCompleteList
@extends Widget
@uses AutoCompleteBase
@uses WidgetPosition
@uses WidgetPositionAlign
@constructor
@param {Object} config Configuration object.
**/

_yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 22);
var Lang   = Y.Lang,
    Node   = Y.Node,
    YArray = Y.Array,

    // Whether or not we need an iframe shim.
    useShim = Y.UA.ie && Y.UA.ie < 7,

    // keyCode constants.
    KEY_TAB = 9,

    // String shorthand.
    _CLASS_ITEM        = '_CLASS_ITEM',
    _CLASS_ITEM_ACTIVE = '_CLASS_ITEM_ACTIVE',
    _CLASS_ITEM_HOVER  = '_CLASS_ITEM_HOVER',
    _SELECTOR_ITEM     = '_SELECTOR_ITEM',

    ACTIVE_ITEM      = 'activeItem',
    ALWAYS_SHOW_LIST = 'alwaysShowList',
    CIRCULAR         = 'circular',
    HOVERED_ITEM     = 'hoveredItem',
    ID               = 'id',
    ITEM             = 'item',
    LIST             = 'list',
    RESULT           = 'result',
    RESULTS          = 'results',
    VISIBLE          = 'visible',
    WIDTH            = 'width',

    // Event names.
    EVT_SELECT = 'select',

List = Y.Base.create('autocompleteList', Y.Widget, [
    Y.AutoCompleteBase,
    Y.WidgetPosition,
    Y.WidgetPositionAlign
], {
    // -- Prototype Properties -------------------------------------------------
    ARIA_TEMPLATE: '<div/>',
    ITEM_TEMPLATE: '<li/>',
    LIST_TEMPLATE: '<ul/>',

    // Widget automatically attaches delegated event handlers to everything in
    // Y.Node.DOM_EVENTS, including synthetic events. Since Widget's event
    // delegation won't work for the synthetic valuechange event, and since
    // it creates a name collision between the backcompat "valueChange" synth
    // event alias and AutoCompleteList's "valueChange" event for the "value"
    // attr, this hack is necessary in order to prevent Widget from attaching
    // valuechange handlers.
    UI_EVENTS: (function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "(anonymous 2)", 70);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 71);
var uiEvents = Y.merge(Y.Node.DOM_EVENTS);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 73);
delete uiEvents.valuechange;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 74);
delete uiEvents.valueChange;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 76);
return uiEvents;
    }()),

    // -- Lifecycle Prototype Methods ------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "initializer", 80);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 81);
var inputNode = this.get('inputNode');

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 83);
if (!inputNode) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 84);
Y.error('No inputNode specified.');
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 85);
return;
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 88);
this._inputNode  = inputNode;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 89);
this._listEvents = [];

        // This ensures that the list is rendered inside the same parent as the
        // input node by default, which is necessary for proper ARIA support.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 93);
this.DEF_PARENT_NODE = inputNode.get('parentNode');

        // Cache commonly used classnames and selectors for performance.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 96);
this[_CLASS_ITEM]        = this.getClassName(ITEM);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 97);
this[_CLASS_ITEM_ACTIVE] = this.getClassName(ITEM, 'active');
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 98);
this[_CLASS_ITEM_HOVER]  = this.getClassName(ITEM, 'hover');
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 99);
this[_SELECTOR_ITEM]     = '.' + this[_CLASS_ITEM];

        /**
        Fires when an autocomplete suggestion is selected from the list,
        typically via a keyboard action or mouse click.

        @event select
        @param {Node} itemNode List item node that was selected.
        @param {Object} result AutoComplete result object.
        @preventable _defSelectFn
        **/
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 110);
this.publish(EVT_SELECT, {
            defaultFn: this._defSelectFn
        });
    },

    destructor: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "destructor", 115);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 116);
while (this._listEvents.length) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 117);
this._listEvents.pop().detach();
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 120);
if (this._ariaNode) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 121);
this._ariaNode.remove().destroy(true);
        }
    },

    bindUI: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "bindUI", 125);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 126);
this._bindInput();
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 127);
this._bindList();
    },

    renderUI: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "renderUI", 130);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 131);
var ariaNode    = this._createAriaNode(),
            boundingBox = this.get('boundingBox'),
            contentBox  = this.get('contentBox'),
            inputNode   = this._inputNode,
            listNode    = this._createListNode(),
            parentNode  = inputNode.get('parentNode');

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 138);
inputNode.addClass(this.getClassName('input')).setAttrs({
            'aria-autocomplete': LIST,
            'aria-expanded'    : false,
            'aria-owns'        : listNode.get('id')
        });

        // ARIA node must be outside the widget or announcements won't be made
        // when the widget is hidden.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 146);
parentNode.append(ariaNode);

        // Add an iframe shim for IE6.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 149);
if (useShim) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 150);
boundingBox.plug(Y.Plugin.Shim);
        }

        // Force position: absolute on the boundingBox. This works around a
        // potential CSS loading race condition in Gecko that can cause the
        // boundingBox to become relatively positioned, which is all kinds of
        // no good.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 157);
boundingBox.setStyle('position', 'absolute');

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 159);
this._ariaNode    = ariaNode;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 160);
this._boundingBox = boundingBox;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 161);
this._contentBox  = contentBox;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 162);
this._listNode    = listNode;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 163);
this._parentNode  = parentNode;
    },

    syncUI: function () {
        // No need to call _syncPosition() here; the other _sync methods will
        // call it when necessary.
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "syncUI", 166);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 169);
this._syncResults();
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 170);
this._syncVisibility();
    },

    // -- Public Prototype Methods ---------------------------------------------

    /**
    Hides the list, unless the `alwaysShowList` attribute is `true`.

    @method hide
    @see show
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "hide", 182);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 183);
return this.get(ALWAYS_SHOW_LIST) ? this : this.set(VISIBLE, false);
    },

    /**
    Selects the specified _itemNode_, or the current `activeItem` if _itemNode_
    is not specified.

    @method selectItem
    @param {Node} [itemNode] Item node to select.
    @param {EventFacade} [originEvent] Event that triggered the selection, if
        any.
    @chainable
    **/
    selectItem: function (itemNode, originEvent) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "selectItem", 196);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 197);
if (itemNode) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 198);
if (!itemNode.hasClass(this[_CLASS_ITEM])) {
                _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 199);
return this;
            }
        } else {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 202);
itemNode = this.get(ACTIVE_ITEM);

            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 204);
if (!itemNode) {
                _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 205);
return this;
            }
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 209);
this.fire(EVT_SELECT, {
            itemNode   : itemNode,
            originEvent: originEvent || null,
            result     : itemNode.getData(RESULT)
        });

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 215);
return this;
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
    Activates the next item after the currently active item. If there is no next
    item and the `circular` attribute is `true`, focus will wrap back to the
    input node.

    @method _activateNextItem
    @chainable
    @protected
    **/
    _activateNextItem: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_activateNextItem", 229);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 230);
var item = this.get(ACTIVE_ITEM),
            nextItem;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 233);
if (item) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 234);
nextItem = item.next(this[_SELECTOR_ITEM]) ||
                    (this.get(CIRCULAR) ? null : item);
        } else {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 237);
nextItem = this._getFirstItemNode();
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 240);
this.set(ACTIVE_ITEM, nextItem);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 242);
return this;
    },

    /**
    Activates the item previous to the currently active item. If there is no
    previous item and the `circular` attribute is `true`, focus will wrap back
    to the input node.

    @method _activatePrevItem
    @chainable
    @protected
    **/
    _activatePrevItem: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_activatePrevItem", 254);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 255);
var item     = this.get(ACTIVE_ITEM),
            prevItem = item ? item.previous(this[_SELECTOR_ITEM]) :
                    this.get(CIRCULAR) && this._getLastItemNode();

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 259);
this.set(ACTIVE_ITEM, prevItem || null);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 261);
return this;
    },

    /**
    Appends the specified result _items_ to the list inside a new item node.

    @method _add
    @param {Array|Node|HTMLElement|String} items Result item or array of
        result items.
    @return {NodeList} Added nodes.
    @protected
    **/
    _add: function (items) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_add", 273);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 274);
var itemNodes = [];

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 276);
YArray.each(Lang.isArray(items) ? items : [items], function (item) {
            _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "(anonymous 3)", 276);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 277);
itemNodes.push(this._createItemNode(item).setData(RESULT, item));
        }, this);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 280);
itemNodes = Y.all(itemNodes);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 281);
this._listNode.append(itemNodes.toFrag());

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 283);
return itemNodes;
    },

    /**
    Updates the ARIA live region with the specified message.

    @method _ariaSay
    @param {String} stringId String id (from the `strings` attribute) of the
        message to speak.
    @param {Object} [subs] Substitutions for placeholders in the string.
    @protected
    **/
    _ariaSay: function (stringId, subs) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_ariaSay", 295);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 296);
var message = this.get('strings.' + stringId);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 297);
this._ariaNode.set('text', subs ? Lang.sub(message, subs) : message);
    },

    /**
    Binds `inputNode` events and behavior.

    @method _bindInput
    @protected
    **/
    _bindInput: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_bindInput", 306);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 307);
var inputNode = this._inputNode,
            alignNode, alignWidth, tokenInput;

        // Null align means we can auto-align. Set align to false to prevent
        // auto-alignment, or a valid alignment config to customize the
        // alignment.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 313);
if (this.get('align') === null) {
            // If this is a tokenInput, align with its bounding box.
            // Otherwise, align with the inputNode. Bit of a cheat.
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 316);
tokenInput = this.get('tokenInput');
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 317);
alignNode  = (tokenInput && tokenInput.get('boundingBox')) || inputNode;

            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 319);
this.set('align', {
                node  : alignNode,
                points: ['tl', 'bl']
            });

            // If no width config is set, attempt to set the list's width to the
            // width of the alignment node. If the alignment node's width is
            // falsy, do nothing.
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 327);
if (!this.get(WIDTH) && (alignWidth = alignNode.get('offsetWidth'))) {
                _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 328);
this.set(WIDTH, alignWidth);
            }
        }

        // Attach inputNode events.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 333);
this._listEvents = this._listEvents.concat([
            inputNode.after('blur',  this._afterListInputBlur, this),
            inputNode.after('focus', this._afterListInputFocus, this)
        ]);
    },

    /**
    Binds list events.

    @method _bindList
    @protected
    **/
    _bindList: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_bindList", 345);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 346);
this._listEvents = this._listEvents.concat([
            Y.one('doc').after('click', this._afterDocClick, this),
            Y.one('win').after('windowresize', this._syncPosition, this),

            this.after({
                mouseover: this._afterMouseOver,
                mouseout : this._afterMouseOut,

                activeItemChange    : this._afterActiveItemChange,
                alwaysShowListChange: this._afterAlwaysShowListChange,
                hoveredItemChange   : this._afterHoveredItemChange,
                resultsChange       : this._afterResultsChange,
                visibleChange       : this._afterVisibleChange
            }),

            this._listNode.delegate('click', this._onItemClick,
                    this[_SELECTOR_ITEM], this)
        ]);
    },

    /**
    Clears the contents of the tray.

    @method _clear
    @protected
    **/
    _clear: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_clear", 372);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 373);
this.set(ACTIVE_ITEM, null);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 374);
this._set(HOVERED_ITEM, null);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 376);
this._listNode.get('children').remove(true);
    },

    /**
    Creates and returns an ARIA live region node.

    @method _createAriaNode
    @return {Node} ARIA node.
    @protected
    **/
    _createAriaNode: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_createAriaNode", 386);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 387);
var ariaNode = Node.create(this.ARIA_TEMPLATE);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 389);
return ariaNode.addClass(this.getClassName('aria')).setAttrs({
            'aria-live': 'polite',
            role       : 'status'
        });
    },

    /**
    Creates and returns an item node with the specified _content_.

    @method _createItemNode
    @param {Object} result Result object.
    @return {Node} Item node.
    @protected
    **/
    _createItemNode: function (result) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_createItemNode", 403);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 404);
var itemNode = Node.create(this.ITEM_TEMPLATE);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 406);
return itemNode.addClass(this[_CLASS_ITEM]).setAttrs({
            id  : Y.stamp(itemNode),
            role: 'option'
        }).setAttribute('data-text', result.text).append(result.display);
    },

    /**
    Creates and returns a list node. If the `listNode` attribute is already set
    to an existing node, that node will be used.

    @method _createListNode
    @return {Node} List node.
    @protected
    **/
    _createListNode: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_createListNode", 420);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 421);
var listNode = this.get('listNode') || Node.create(this.LIST_TEMPLATE);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 423);
listNode.addClass(this.getClassName(LIST)).setAttrs({
            id  : Y.stamp(listNode),
            role: 'listbox'
        });

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 428);
this._set('listNode', listNode);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 429);
this.get('contentBox').append(listNode);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 431);
return listNode;
    },

    /**
    Gets the first item node in the list, or `null` if the list is empty.

    @method _getFirstItemNode
    @return {Node|null}
    @protected
    **/
    _getFirstItemNode: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_getFirstItemNode", 441);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 442);
return this._listNode.one(this[_SELECTOR_ITEM]);
    },

    /**
    Gets the last item node in the list, or `null` if the list is empty.

    @method _getLastItemNode
    @return {Node|null}
    @protected
    **/
    _getLastItemNode: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_getLastItemNode", 452);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 453);
return this._listNode.one(this[_SELECTOR_ITEM] + ':last-child');
    },

    /**
    Synchronizes the result list's position and alignment.

    @method _syncPosition
    @protected
    **/
    _syncPosition: function () {
        // Force WidgetPositionAlign to refresh its alignment.
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_syncPosition", 462);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 464);
this._syncUIPosAlign();

        // Resize the IE6 iframe shim to match the list's dimensions.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 467);
this._syncShim();
    },

    /**
    Synchronizes the results displayed in the list with those in the _results_
    argument, or with the `results` attribute if an argument is not provided.

    @method _syncResults
    @param {Array} [results] Results.
    @protected
    **/
    _syncResults: function (results) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_syncResults", 478);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 479);
if (!results) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 480);
results = this.get(RESULTS);
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 483);
this._clear();

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 485);
if (results.length) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 486);
this._add(results);
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 487);
this._ariaSay('items_available');
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 490);
this._syncPosition();

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 492);
if (this.get('activateFirstItem') && !this.get(ACTIVE_ITEM)) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 493);
this.set(ACTIVE_ITEM, this._getFirstItemNode());
        }
    },

    /**
    Synchronizes the size of the iframe shim used for IE6 and lower. In other
    browsers, this method is a noop.

    @method _syncShim
    @protected
    **/
    _syncShim: useShim ? function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "(anonymous 4)", 504);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 505);
var shim = this._boundingBox.shim;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 507);
if (shim) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 508);
shim.sync();
        }
    } : function () {},

    /**
    Synchronizes the visibility of the tray with the _visible_ argument, or with
    the `visible` attribute if an argument is not provided.

    @method _syncVisibility
    @param {Boolean} [visible] Visibility.
    @protected
    **/
    _syncVisibility: function (visible) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_syncVisibility", 520);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 521);
if (this.get(ALWAYS_SHOW_LIST)) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 522);
visible = true;
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 523);
this.set(VISIBLE, visible);
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 526);
if (typeof visible === 'undefined') {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 527);
visible = this.get(VISIBLE);
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 530);
this._inputNode.set('aria-expanded', visible);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 531);
this._boundingBox.set('aria-hidden', !visible);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 533);
if (visible) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 534);
this._syncPosition();
        } else {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 536);
this.set(ACTIVE_ITEM, null);
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 537);
this._set(HOVERED_ITEM, null);

            // Force a reflow to work around a glitch in IE6 and 7 where some of
            // the contents of the list will sometimes remain visible after the
            // container is hidden.
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 542);
this._boundingBox.get('offsetWidth');
        }

        // In some pages, IE7 fails to repaint the contents of the list after it
        // becomes visible. Toggling a bogus class on the body forces a repaint
        // that fixes the issue.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 548);
if (Y.UA.ie === 7) {
            // Note: We don't actually need to use ClassNameManager here. This
            // class isn't applying any actual styles; it's just frobbing the
            // body element to force a repaint. The actual class name doesn't
            // really matter.
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 553);
Y.one('body')
                .addClass('yui3-ie7-sucks')
                .removeClass('yui3-ie7-sucks');
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `activeItemChange` events.

    @method _afterActiveItemChange
    @param {EventFacade} e
    @protected
    **/
    _afterActiveItemChange: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterActiveItemChange", 568);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 569);
var inputNode = this._inputNode,
            newVal    = e.newVal,
            prevVal   = e.prevVal,
            node;

        // The previous item may have disappeared by the time this handler runs,
        // so we need to be careful.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 576);
if (prevVal && prevVal._node) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 577);
prevVal.removeClass(this[_CLASS_ITEM_ACTIVE]);
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 580);
if (newVal) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 581);
newVal.addClass(this[_CLASS_ITEM_ACTIVE]);
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 582);
inputNode.set('aria-activedescendant', newVal.get(ID));
        } else {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 584);
inputNode.removeAttribute('aria-activedescendant');
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 587);
if (this.get('scrollIntoView')) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 588);
node = newVal || inputNode;

            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 590);
if (!node.inRegion(Y.DOM.viewportRegion(), true)
                    || !node.inRegion(this._contentBox, true)) {

                _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 593);
node.scrollIntoView();
            }
        }
    },

    /**
    Handles `alwaysShowListChange` events.

    @method _afterAlwaysShowListChange
    @param {EventFacade} e
    @protected
    **/
    _afterAlwaysShowListChange: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterAlwaysShowListChange", 605);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 606);
this.set(VISIBLE, e.newVal || this.get(RESULTS).length > 0);
    },

    /**
    Handles click events on the document. If the click is outside both the
    input node and the bounding box, the list will be hidden.

    @method _afterDocClick
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _afterDocClick: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterDocClick", 618);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 619);
var boundingBox = this._boundingBox,
            target      = e.target;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 622);
if(target !== this._inputNode && target !== boundingBox &&
                target.ancestor('#' + boundingBox.get('id'), true)){
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 624);
this.hide();
        }
    },

    /**
    Handles `hoveredItemChange` events.

    @method _afterHoveredItemChange
    @param {EventFacade} e
    @protected
    **/
    _afterHoveredItemChange: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterHoveredItemChange", 635);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 636);
var newVal  = e.newVal,
            prevVal = e.prevVal;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 639);
if (prevVal) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 640);
prevVal.removeClass(this[_CLASS_ITEM_HOVER]);
        }

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 643);
if (newVal) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 644);
newVal.addClass(this[_CLASS_ITEM_HOVER]);
        }
    },

    /**
    Handles `inputNode` blur events.

    @method _afterListInputBlur
    @protected
    **/
    _afterListInputBlur: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterListInputBlur", 654);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 655);
this._listInputFocused = false;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 657);
if (this.get(VISIBLE) &&
                !this._mouseOverList &&
                (this._lastInputKey !== KEY_TAB ||
                    !this.get('tabSelect') ||
                    !this.get(ACTIVE_ITEM))) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 662);
this.hide();
        }
    },

    /**
    Handles `inputNode` focus events.

    @method _afterListInputFocus
    @protected
    **/
    _afterListInputFocus: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterListInputFocus", 672);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 673);
this._listInputFocused = true;
    },

    /**
    Handles `mouseover` events.

    @method _afterMouseOver
    @param {EventFacade} e
    @protected
    **/
    _afterMouseOver: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterMouseOver", 683);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 684);
var itemNode = e.domEvent.target.ancestor(this[_SELECTOR_ITEM], true);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 686);
this._mouseOverList = true;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 688);
if (itemNode) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 689);
this._set(HOVERED_ITEM, itemNode);
        }
    },

    /**
    Handles `mouseout` events.

    @method _afterMouseOut
    @param {EventFacade} e
    @protected
    **/
    _afterMouseOut: function () {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterMouseOut", 700);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 701);
this._mouseOverList = false;
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 702);
this._set(HOVERED_ITEM, null);
    },

    /**
    Handles `resultsChange` events.

    @method _afterResultsChange
    @param {EventFacade} e
    @protected
    **/
    _afterResultsChange: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterResultsChange", 712);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 713);
this._syncResults(e.newVal);

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 715);
if (!this.get(ALWAYS_SHOW_LIST)) {
            _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 716);
this.set(VISIBLE, !!e.newVal.length);
        }
    },

    /**
    Handles `visibleChange` events.

    @method _afterVisibleChange
    @param {EventFacade} e
    @protected
    **/
    _afterVisibleChange: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_afterVisibleChange", 727);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 728);
this._syncVisibility(!!e.newVal);
    },

    /**
    Delegated event handler for item `click` events.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_onItemClick", 738);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 739);
var itemNode = e.currentTarget;

        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 741);
this.set(ACTIVE_ITEM, itemNode);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 742);
this.selectItem(itemNode, e);
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
    Default `select` event handler.

    @method _defSelectFn
    @param {EventFacade} e
    @protected
    **/
    _defSelectFn: function (e) {
        _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "_defSelectFn", 754);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 755);
var text = e.result.text;

        // TODO: support typeahead completion, etc.
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 758);
this._inputNode.focus();
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 759);
this._updateValue(text);
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 760);
this._ariaSay('item_selected', {item: text});
        _yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 761);
this.hide();
    }
}, {
    ATTRS: {
        /**
        If `true`, the first item in the list will be activated by default when
        the list is initially displayed and when results change.

        @attribute activateFirstItem
        @type Boolean
        @default false
        **/
        activateFirstItem: {
            value: false
        },

        /**
        Item that's currently active, if any. When the user presses enter, this
        is the item that will be selected.

        @attribute activeItem
        @type Node
        **/
        activeItem: {
            setter: Y.one,
            value: null
        },

        /**
        If `true`, the list will remain visible even when there are no results
        to display.

        @attribute alwaysShowList
        @type Boolean
        @default false
        **/
        alwaysShowList: {
            value: false
        },

        /**
        If `true`, keyboard navigation will wrap around to the opposite end of
        the list when navigating past the first or last item.

        @attribute circular
        @type Boolean
        @default true
        **/
        circular: {
            value: true
        },

        /**
        Item currently being hovered over by the mouse, if any.

        @attribute hoveredItem
        @type Node|null
        @readOnly
        **/
        hoveredItem: {
            readOnly: true,
            value: null
        },

        /**
        Node that will contain result items.

        @attribute listNode
        @type Node|null
        @initOnly
        **/
        listNode: {
            writeOnce: 'initOnly',
            value: null
        },

        /**
        If `true`, the viewport will be scrolled to ensure that the active list
        item is visible when necessary.

        @attribute scrollIntoView
        @type Boolean
        @default false
        **/
        scrollIntoView: {
            value: false
        },

        /**
        Translatable strings used by the AutoCompleteList widget.

        @attribute strings
        @type Object
        **/
        strings: {
            valueFn: function () {
                _yuitest_coverfunc("build/autocomplete-list/autocomplete-list.js", "valueFn", 856);
_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 857);
return Y.Intl.get('autocomplete-list');
            }
        },

        /**
        If `true`, pressing the tab key while the list is visible will select
        the active item, if any.

        @attribute tabSelect
        @type Boolean
        @default true
        **/
        tabSelect: {
            value: true
        },

        // The "visible" attribute is documented in Widget.
        visible: {
            value: false
        }
    },

    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')
});

_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 882);
Y.AutoCompleteList = List;

/**
Alias for <a href="AutoCompleteList.html">`AutoCompleteList`</a>. See that class
for API docs.

@class AutoComplete
**/

_yuitest_coverline("build/autocomplete-list/autocomplete-list.js", 891);
Y.AutoComplete = List;


}, '3.7.3', {"lang": ["en"], "requires": ["autocomplete-base", "event-resize", "node-screen", "selector-css3", "shim-plugin", "widget", "widget-position", "widget-position-align"], "skinnable": true});
