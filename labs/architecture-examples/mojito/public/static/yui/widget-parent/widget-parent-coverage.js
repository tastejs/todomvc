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
_yuitest_coverage["build/widget-parent/widget-parent.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-parent/widget-parent.js",
    code: []
};
_yuitest_coverage["build/widget-parent/widget-parent.js"].code=["YUI.add('widget-parent', function (Y, NAME) {","","/**"," * Extension enabling a Widget to be a parent of another Widget."," *"," * @module widget-parent"," */","","var Lang = Y.Lang,","    RENDERED = \"rendered\",","    BOUNDING_BOX = \"boundingBox\";","","/**"," * Widget extension providing functionality enabling a Widget to be a "," * parent of another Widget."," *"," * <p>In addition to the set of attributes supported by WidgetParent, the constructor"," * configuration object can also contain a <code>children</code> which can be used"," * to add child widgets to the parent during construction. The <code>children</code>"," * property is an array of either child widget instances or child widget configuration "," * objects, and is sugar for the <a href=\"#method_add\">add</a> method. See the "," * <a href=\"#method_add\">add</a> for details on the structure of the child widget "," * configuration object."," * @class WidgetParent"," * @constructor"," * @uses ArrayList"," * @param {Object} config User configuration object."," */","function Parent(config) {","","    /**","    * Fires when a Widget is add as a child.  The event object will have a ","    * 'child' property that returns a reference to the child Widget, as well ","    * as an 'index' property that returns a reference to the index specified ","    * when the add() method was called.","    * <p>","    * Subscribers to the \"on\" moment of this event, will be notified ","    * before a child is added.","    * </p>","    * <p>","    * Subscribers to the \"after\" moment of this event, will be notified","    * after a child is added.","    * </p>","    *","    * @event addChild","    * @preventable _defAddChildFn","    * @param {EventFacade} e The Event Facade","    */","    this.publish(\"addChild\", { ","        defaultTargetOnly: true,","        defaultFn: this._defAddChildFn ","    });","","","    /**","    * Fires when a child Widget is removed.  The event object will have a ","    * 'child' property that returns a reference to the child Widget, as well ","    * as an 'index' property that returns a reference child's ordinal position.","    * <p>","    * Subscribers to the \"on\" moment of this event, will be notified ","    * before a child is removed.","    * </p>","    * <p>","    * Subscribers to the \"after\" moment of this event, will be notified","    * after a child is removed.","    * </p>","    *","    * @event removeChild","    * @preventable _defRemoveChildFn","    * @param {EventFacade} e The Event Facade","    */","    this.publish(\"removeChild\", { ","        defaultTargetOnly: true,","        defaultFn: this._defRemoveChildFn ","    });","","    this._items = [];","","    var children,","        handle;","","    if (config && config.children) {","","        children = config.children;","        ","        handle = this.after(\"initializedChange\", function (e) {","            this._add(children);","            handle.detach();","        });","","    }","","    //  Widget method overlap","    Y.after(this._renderChildren, this, \"renderUI\");","    Y.after(this._bindUIParent, this, \"bindUI\");","","    this.after(\"selectionChange\", this._afterSelectionChange);","    this.after(\"selectedChange\", this._afterParentSelectedChange);","    this.after(\"activeDescendantChange\", this._afterActiveDescendantChange);","","    this._hDestroyChild = this.after(\"*:destroy\", this._afterDestroyChild);","    this.after(\"*:focusedChange\", this._updateActiveDescendant);","","}","","Parent.ATTRS = {","","    /**","     * @attribute defaultChildType","     * @type {String|Object}","     *","     * @description String representing the default type of the children ","     * managed by this Widget.  Can also supply default type as a constructor","     * reference.","     */","    defaultChildType: {","        setter: function (val) {","            ","            var returnVal = Y.Attribute.INVALID_VALUE,","                FnConstructor = Lang.isString(val) ? Y[val] : val;","            ","            if (Lang.isFunction(FnConstructor)) {","                returnVal = FnConstructor;","            }","            ","            return returnVal;","        }","    },","","    /**","     * @attribute activeDescendant","     * @type Widget","     * @readOnly","     *","     * @description Returns the Widget's currently focused descendant Widget.","     */","    activeDescendant: {    ","        readOnly: true","    },","","    /**","     * @attribute multiple","     * @type Boolean","     * @default false","     * @writeOnce ","     *","     * @description Boolean indicating if multiple children can be selected at ","     * once.  Whether or not multiple selection is enabled is always delegated","     * to the value of the <code>multiple</code> attribute of the root widget","     * in the object hierarchy.","     */","    multiple: {","        value: false,","        validator: Lang.isBoolean,","        writeOnce: true,","        getter: function (value) {","            var root = this.get(\"root\");","            return (root && root != this) ? root.get(\"multiple\") : value;","        }","    },","","","    /**","     * @attribute selection","     * @type {ArrayList|Widget}","     * @readOnly  ","     *","     * @description Returns the currently selected child Widget.  If the ","     * <code>mulitple</code> attribte is set to <code>true</code> will ","     * return an Y.ArrayList instance containing the currently selected ","     * children.  If no children are selected, will return null.","     */","    selection: {","        readOnly: true,","        setter: \"_setSelection\",","        getter: function (value) {","            var selection = Lang.isArray(value) ? ","                    (new Y.ArrayList(value)) : value;","            return selection;","        }","    },","","    selected: {","        setter: function (value) {","","            //  Enforces selection behavior on for parent Widgets.  Parent's ","            //  selected attribute can be set to the following:","            //  0 - Not selected","            //  1 - Fully selected (all children are selected).  In order for ","            //  all children to be selected, multiple selection must be ","            //  enabled.  Therefore, you cannot set the \"selected\" attribute ","            //  on a parent Widget to 1 unless multiple selection is enabled.","            //  2 - Partially selected, meaning one ore more (but not all) ","            //  children are selected.","","            var returnVal = value;","","            if (value === 1 && !this.get(\"multiple\")) {","                returnVal = Y.Attribute.INVALID_VALUE;","            }","            ","            return returnVal;","        }","    }","","};","","Parent.prototype = {","","    /**","     * The destructor implementation for Parent widgets. Destroys all children.","     * @method destructor","     */","    destructor: function() {","        this._destroyChildren();","    },","","    /**","     * Destroy event listener for each child Widget, responsible for removing ","     * the destroyed child Widget from the parent's internal array of children","     * (_items property).","     *","     * @method _afterDestroyChild","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */","    _afterDestroyChild: function (event) {","        var child = event.target;","","        if (child.get(\"parent\") == this) {","            child.remove();","        }        ","    },","","    /**","     * Attribute change listener for the <code>selection</code> ","     * attribute, responsible for setting the value of the ","     * parent's <code>selected</code> attribute.","     *","     * @method _afterSelectionChange","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */","    _afterSelectionChange: function (event) {","","        if (event.target == this && event.src != this) {","","            var selection = event.newVal,","                selectedVal = 0;    //  Not selected","","","            if (selection) {","","                selectedVal = 2;    //  Assume partially selected, confirm otherwise","","","                if (Y.instanceOf(selection, Y.ArrayList) && ","                    (selection.size() === this.size())) {","","                    selectedVal = 1;    //  Fully selected","","                }","                ","            }","","            this.set(\"selected\", selectedVal, { src: this });","        ","        }","    },","","","    /**","     * Attribute change listener for the <code>activeDescendant</code> ","     * attribute, responsible for setting the value of the ","     * parent's <code>activeDescendant</code> attribute.","     *","     * @method _afterActiveDescendantChange","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */","    _afterActiveDescendantChange: function (event) {","        var parent = this.get(\"parent\");","","        if (parent) {","            parent._set(\"activeDescendant\", event.newVal);","        }","    },","","    /**","     * Attribute change listener for the <code>selected</code> ","     * attribute, responsible for syncing the selected state of all children to ","     * match that of their parent Widget.","     * ","     *","     * @method _afterParentSelectedChange","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */","    _afterParentSelectedChange: function (event) {","","        var value = event.newVal;","","        if (this == event.target && event.src != this && ","            (value === 0 || value === 1)) {","","            this.each(function (child) {","","                //  Specify the source of this change as the parent so that ","                //  value of the parent's \"selection\" attribute isn't ","                //  recalculated","","                child.set(\"selected\", value, { src: this });","","            }, this);","            ","        }","        ","    },","","","    /**","     * Default setter for <code>selection</code> attribute changes.","     *","     * @method _setSelection","     * @protected","     * @param child {Widget|Array} Widget or Array of Widget instances.     ","     * @return {Widget|Array} Widget or Array of Widget instances.","     */","    _setSelection: function (child) {","","        var selection = null,","            selected;","","        if (this.get(\"multiple\") && !this.isEmpty()) {","","            selected = [];","            ","            this.each(function (v) {","","               if (v.get(\"selected\") > 0) {","                   selected.push(v);","               }","","            });","","            if (selected.length > 0) {","                selection = selected;","            }","","        }","        else {","","            if (child.get(\"selected\") > 0) {","                selection = child;","            }","","        }","        ","        return selection;","            ","    },","","","    /**","     * Attribute change listener for the <code>selected</code> ","     * attribute of child Widgets, responsible for setting the value of the ","     * parent's <code>selection</code> attribute.","     *","     * @method _updateSelection","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */","    _updateSelection: function (event) {","","        var child = event.target,","            selection;","","        if (child.get(\"parent\") == this) {","","            if (event.src != \"_updateSelection\") {","","                selection = this.get(\"selection\");","","                if (!this.get(\"multiple\") && selection && event.newVal > 0) {","","                    //  Deselect the previously selected child.","                    //  Set src equal to the current context to prevent","                    //  unnecessary re-calculation of the selection.","","                    selection.set(\"selected\", 0, { src: \"_updateSelection\" });","","                }","","                this._set(\"selection\", child);","","            }","","            if (event.src == this) {","                this._set(\"selection\", child, { src: this });","            }","            ","        }","","    },","","    /**","     * Attribute change listener for the <code>focused</code> ","     * attribute of child Widgets, responsible for setting the value of the ","     * parent's <code>activeDescendant</code> attribute.","     *","     * @method _updateActiveDescendant","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */","    _updateActiveDescendant: function (event) {","        var activeDescendant = (event.newVal === true) ? event.target : null;","        this._set(\"activeDescendant\", activeDescendant);","    },","","    /**","     * Creates an instance of a child Widget using the specified configuration.","     * By default Widget instances will be created of the type specified ","     * by the <code>defaultChildType</code> attribute.  Types can be explicitly","     * defined via the <code>childType</code> property of the configuration object","     * literal. The use of the <code>type</code> property has been deprecated, but ","     * will still be used as a fallback, if <code>childType</code> is not defined,","     * for backwards compatibility. ","     *","     * @method _createChild","     * @protected","     * @param config {Object} Object literal representing the configuration ","     * used to create an instance of a Widget.","     */","    _createChild: function (config) {","","        var defaultType = this.get(\"defaultChildType\"),","            altType = config.childType || config.type,","            child,","            Fn,","            FnConstructor;","","        if (altType) {","            Fn = Lang.isString(altType) ? Y[altType] : altType;","        }","","        if (Lang.isFunction(Fn)) {","            FnConstructor = Fn;","        } else if (defaultType) {","            // defaultType is normalized to a function in it's setter ","            FnConstructor = defaultType;","        }","","        if (FnConstructor) {","            child = new FnConstructor(config);","        } else {","            Y.error(\"Could not create a child instance because its constructor is either undefined or invalid.\");","        }","","        return child;","        ","    },","","    /**","     * Default addChild handler","     *","     * @method _defAddChildFn","     * @protected","     * @param event {EventFacade} The Event object","     * @param child {Widget} The Widget instance, or configuration ","     * object for the Widget to be added as a child.","     * @param index {Number} Number representing the position at ","     * which the child will be inserted.","     */","    _defAddChildFn: function (event) {","","        var child = event.child,","            index = event.index,","            children = this._items;","","        if (child.get(\"parent\")) {","            child.remove();","        }","","        if (Lang.isNumber(index)) {","            children.splice(index, 0, child);","        }","        else {","            children.push(child);","        }","","        child._set(\"parent\", this);","        child.addTarget(this);","","        // Update index in case it got normalized after addition","        // (e.g. user passed in 10, and there are only 3 items, the actual index would be 3. We don't want to pass 10 around in the event facade).","        event.index = child.get(\"index\");","","        //  TO DO: Remove in favor of using event bubbling","        child.after(\"selectedChange\", Y.bind(this._updateSelection, this));","    },","","","    /**","     * Default removeChild handler","     *","     * @method _defRemoveChildFn","     * @protected","     * @param event {EventFacade} The Event object","     * @param child {Widget} The Widget instance to be removed.","     * @param index {Number} Number representing the index of the Widget to ","     * be removed.","     */    ","    _defRemoveChildFn: function (event) {","","        var child = event.child,","            index = event.index,","            children = this._items;","","        if (child.get(\"focused\")) {","            child.blur(); // focused is readOnly, so use the public i/f to unset it","        }","","        if (child.get(\"selected\")) {","            child.set(\"selected\", 0);","        }","","        children.splice(index, 1);","","        child.removeTarget(this);","        child._oldParent = child.get(\"parent\");","        child._set(\"parent\", null);","    },","","    /**","    * @method _add","    * @protected","    * @param child {Widget|Object} The Widget instance, or configuration ","    * object for the Widget to be added as a child.","    * @param child {Array} Array of Widget instances, or configuration ","    * objects for the Widgets to be added as a children.","    * @param index {Number} (Optional.)  Number representing the position at ","    * which the child should be inserted.","    * @description Adds a Widget as a child.  If the specified Widget already","    * has a parent it will be removed from its current parent before","    * being added as a child.","    * @return {Widget|Array} Successfully added Widget or Array containing the ","    * successfully added Widget instance(s). If no children where added, will ","    * will return undefined.","    */","    _add: function (child, index) {   ","","        var children,","            oChild,","            returnVal;","","","        if (Lang.isArray(child)) {","","            children = [];","","            Y.each(child, function (v, k) {","","                oChild = this._add(v, (index + k));","","                if (oChild) {","                    children.push(oChild);","                }","                ","            }, this);","            ","","            if (children.length > 0) {","                returnVal = children;","            }","","        }","        else {","","            if (Y.instanceOf(child, Y.Widget)) {","                oChild = child;","            }","            else {","                oChild = this._createChild(child);","            }","","            if (oChild && this.fire(\"addChild\", { child: oChild, index: index })) {","                returnVal = oChild;","            }","","        }","","        return returnVal;","","    },","","","    /**","    * @method add","    * @param child {Widget|Object} The Widget instance, or configuration ","    * object for the Widget to be added as a child. The configuration object","    * for the child can include a <code>childType</code> property, which is either","    * a constructor function or a string which names a constructor function on the ","    * Y instance (e.g. \"Tab\" would refer to Y.Tab) (<code>childType</code> used to be ","    * named <code>type</code>, support for which has been deprecated, but is still","    * maintained for backward compatibility. <code>childType</code> takes precedence","    * over <code>type</code> if both are defined.","    * @param child {Array} Array of Widget instances, or configuration ","    * objects for the Widgets to be added as a children.","    * @param index {Number} (Optional.)  Number representing the position at ","    * which the child should be inserted.","    * @description Adds a Widget as a child.  If the specified Widget already","    * has a parent it will be removed from its current parent before","    * being added as a child.","    * @return {ArrayList} Y.ArrayList containing the successfully added ","    * Widget instance(s).  If no children where added, will return an empty ","    * Y.ArrayList instance.","    */","    add: function () {","","        var added = this._add.apply(this, arguments),","            children = added ? (Lang.isArray(added) ? added : [added]) : [];","","        return (new Y.ArrayList(children));","","    },","","","    /**","    * @method remove","    * @param index {Number} (Optional.)  Number representing the index of the ","    * child to be removed.","    * @description Removes the Widget from its parent.  Optionally, can remove","    * a child by specifying its index.","    * @return {Widget} Widget instance that was successfully removed, otherwise","    * undefined.","    */","    remove: function (index) {","","        var child = this._items[index],","            returnVal;","","        if (child && this.fire(\"removeChild\", { child: child, index: index })) {","            returnVal = child;","        }","        ","        return returnVal;","","    },","","","    /**","    * @method removeAll","    * @description Removes all of the children from the Widget.","    * @return {ArrayList} Y.ArrayList instance containing Widgets that were ","    * successfully removed.  If no children where removed, will return an empty ","    * Y.ArrayList instance.","    */","    removeAll: function () {","","        var removed = [],","            child;","","        Y.each(this._items.concat(), function () {","","            child = this.remove(0);","","            if (child) {","                removed.push(child);","            }","","        }, this);","","        return (new Y.ArrayList(removed));","","    },","    ","    /**","     * Selects the child at the given index (zero-based).","     *","     * @method selectChild","     * @param {Number} i the index of the child to be selected","     */","    selectChild: function(i) {","        this.item(i).set('selected', 1);","    },","","    /**","     * Selects all children.","     *","     * @method selectAll","     */","    selectAll: function () {","        this.set(\"selected\", 1);","    },","","    /**","     * Deselects all children.","     *","     * @method deselectAll","     */","    deselectAll: function () {","        this.set(\"selected\", 0);","    },","","    /**","     * Updates the UI in response to a child being added.","     *","     * @method _uiAddChild","     * @protected","     * @param child {Widget} The child Widget instance to render.","     * @param parentNode {Object} The Node under which the ","     * child Widget is to be rendered.","     */    ","    _uiAddChild: function (child, parentNode) {","","        child.render(parentNode);","","        // TODO: Ideally this should be in Child's render UI. ","","        var childBB = child.get(\"boundingBox\"),","            siblingBB,","            nextSibling = child.next(false),","            prevSibling;","","        // Insert or Append to last child.","","        // Avoiding index, and using the current sibling ","        // state (which should be accurate), means we don't have ","        // to worry about decorator elements which may be added ","        // to the _childContainer node.","    ","        if (nextSibling && nextSibling.get(RENDERED)) {","","            siblingBB = nextSibling.get(BOUNDING_BOX);","            siblingBB.insert(childBB, \"before\");","","        } else {","","            prevSibling = child.previous(false);","","            if (prevSibling && prevSibling.get(RENDERED)) {","","                siblingBB = prevSibling.get(BOUNDING_BOX);","                siblingBB.insert(childBB, \"after\");","","            } else if (!parentNode.contains(childBB)) {","","                // Based on pull request from andreas-karlsson","                // https://github.com/yui/yui3/pull/25#issuecomment-2103536","","                // Account for case where a child was rendered independently of the ","                // parent-child framework, to a node outside of the parentNode,","                // and there are no siblings.","","                parentNode.appendChild(childBB);","            }","        }","","    },","","    /**","     * Updates the UI in response to a child being removed.","     *","     * @method _uiRemoveChild","     * @protected","     * @param child {Widget} The child Widget instance to render.","     */        ","    _uiRemoveChild: function (child) {","        child.get(\"boundingBox\").remove();","    },","","    _afterAddChild: function (event) {","        var child = event.child;","","        if (child.get(\"parent\") == this) {","            this._uiAddChild(child, this._childrenContainer);","        }","    },","","    _afterRemoveChild: function (event) {","        var child = event.child;","","        if (child._oldParent == this) {","            this._uiRemoveChild(child);","        }","    },","","    /**","     * Sets up DOM and CustomEvent listeners for the parent widget.","     * <p>","     * This method in invoked after bindUI is invoked for the Widget class","     * using YUI's aop infrastructure.","     * </p>","     *","     * @method _bindUIParent","     * @protected","     */","    _bindUIParent: function () {","        this.after(\"addChild\", this._afterAddChild);","        this.after(\"removeChild\", this._afterRemoveChild);","    },","","    /**","     * Renders all child Widgets for the parent.","     * <p>","     * This method in invoked after renderUI is invoked for the Widget class","     * using YUI's aop infrastructure.","     * </p>","     * @method _renderChildren","     * @protected","     */","    _renderChildren: function () {","","        /**","         * <p>By default WidgetParent will render it's children to the parent's content box.</p>","         *","         * <p>If the children need to be rendered somewhere else, the _childrenContainer property","         * can be set to the Node which the children should be rendered to. This property should be","         * set before the _renderChildren method is invoked, ideally in your renderUI method, ","         * as soon as you create the element to be rendered to.</p>","         *","         * @protected","         * @property _childrenContainer","         * @value The content box","         * @type Node","         */","        var renderTo = this._childrenContainer || this.get(\"contentBox\");","","        this._childrenContainer = renderTo;","","        this.each(function (child) {","            child.render(renderTo);","        });","    },","","    /**","     * Destroys all child Widgets for the parent.","     * <p>","     * This method is invoked before the destructor is invoked for the Widget ","     * class using YUI's aop infrastructure.","     * </p>","     * @method _destroyChildren","     * @protected","     */","    _destroyChildren: function () {","","        //  Detach the handler responsible for removing children in ","        //  response to destroying them since:","        //  1)  It is unnecessary/inefficient at this point since we are doing ","        //      a batch destroy of all children.","        //  2)  Removing each child will affect our ability to iterate the ","        //      children since the size of _items will be changing as we ","        //      iterate.","        this._hDestroyChild.detach();","","        //  Need to clone the _items array since ","        this.each(function (child) {","            child.destroy();","        });","    }","    ","};","","Y.augment(Parent, Y.ArrayList);","","Y.WidgetParent = Parent;","","","}, '3.7.3', {\"requires\": [\"arraylist\", \"base-build\", \"widget\"]});"];
_yuitest_coverage["build/widget-parent/widget-parent.js"].lines = {"1":0,"9":0,"29":0,"49":0,"72":0,"77":0,"79":0,"82":0,"84":0,"86":0,"87":0,"88":0,"94":0,"95":0,"97":0,"98":0,"99":0,"101":0,"102":0,"106":0,"119":0,"122":0,"123":0,"126":0,"157":0,"158":0,"177":0,"179":0,"196":0,"198":0,"199":0,"202":0,"208":0,"215":0,"228":0,"230":0,"231":0,"246":0,"248":0,"252":0,"254":0,"257":0,"260":0,"266":0,"282":0,"284":0,"285":0,"301":0,"303":0,"306":0,"312":0,"331":0,"334":0,"336":0,"338":0,"340":0,"341":0,"346":0,"347":0,"353":0,"354":0,"359":0,"375":0,"378":0,"380":0,"382":0,"384":0,"390":0,"394":0,"398":0,"399":0,"416":0,"417":0,"436":0,"442":0,"443":0,"446":0,"447":0,"448":0,"450":0,"453":0,"454":0,"456":0,"459":0,"476":0,"480":0,"481":0,"484":0,"485":0,"488":0,"491":0,"492":0,"496":0,"499":0,"515":0,"519":0,"520":0,"523":0,"524":0,"527":0,"529":0,"530":0,"531":0,"552":0,"557":0,"559":0,"561":0,"563":0,"565":0,"566":0,"572":0,"573":0,"579":0,"580":0,"583":0,"586":0,"587":0,"592":0,"620":0,"623":0,"639":0,"642":0,"643":0,"646":0,"660":0,"663":0,"665":0,"667":0,"668":0,"673":0,"684":0,"693":0,"702":0,"716":0,"720":0,"732":0,"734":0,"735":0,"739":0,"741":0,"743":0,"744":0,"746":0,"755":0,"769":0,"773":0,"775":0,"776":0,"781":0,"783":0,"784":0,"799":0,"800":0,"827":0,"829":0,"831":0,"832":0,"854":0,"857":0,"858":0,"864":0,"866":0};
_yuitest_coverage["build/widget-parent/widget-parent.js"].functions = {"(anonymous 2):86":0,"Parent:29":0,"setter:117":0,"getter:156":0,"getter:176":0,"setter:184":0,"destructor:214":0,"_afterDestroyChild:227":0,"_afterSelectionChange:244":0,"_afterActiveDescendantChange:281":0,"(anonymous 3):306":0,"_afterParentSelectedChange:299":0,"(anonymous 4):338":0,"_setSelection:329":0,"_updateSelection:373":0,"_updateActiveDescendant:415":0,"_createChild:434":0,"_defAddChildFn:474":0,"_defRemoveChildFn:513":0,"(anonymous 5):561":0,"_add:550":0,"add:618":0,"remove:637":0,"(anonymous 6):663":0,"removeAll:658":0,"selectChild:683":0,"selectAll:692":0,"deselectAll:701":0,"_uiAddChild:714":0,"_uiRemoveChild:768":0,"_afterAddChild:772":0,"_afterRemoveChild:780":0,"_bindUIParent:798":0,"(anonymous 7):831":0,"_renderChildren:812":0,"(anonymous 8):857":0,"_destroyChildren:845":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-parent/widget-parent.js"].coveredLines = 162;
_yuitest_coverage["build/widget-parent/widget-parent.js"].coveredFunctions = 38;
_yuitest_coverline("build/widget-parent/widget-parent.js", 1);
YUI.add('widget-parent', function (Y, NAME) {

/**
 * Extension enabling a Widget to be a parent of another Widget.
 *
 * @module widget-parent
 */

_yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-parent/widget-parent.js", 9);
var Lang = Y.Lang,
    RENDERED = "rendered",
    BOUNDING_BOX = "boundingBox";

/**
 * Widget extension providing functionality enabling a Widget to be a 
 * parent of another Widget.
 *
 * <p>In addition to the set of attributes supported by WidgetParent, the constructor
 * configuration object can also contain a <code>children</code> which can be used
 * to add child widgets to the parent during construction. The <code>children</code>
 * property is an array of either child widget instances or child widget configuration 
 * objects, and is sugar for the <a href="#method_add">add</a> method. See the 
 * <a href="#method_add">add</a> for details on the structure of the child widget 
 * configuration object.
 * @class WidgetParent
 * @constructor
 * @uses ArrayList
 * @param {Object} config User configuration object.
 */
_yuitest_coverline("build/widget-parent/widget-parent.js", 29);
function Parent(config) {

    /**
    * Fires when a Widget is add as a child.  The event object will have a 
    * 'child' property that returns a reference to the child Widget, as well 
    * as an 'index' property that returns a reference to the index specified 
    * when the add() method was called.
    * <p>
    * Subscribers to the "on" moment of this event, will be notified 
    * before a child is added.
    * </p>
    * <p>
    * Subscribers to the "after" moment of this event, will be notified
    * after a child is added.
    * </p>
    *
    * @event addChild
    * @preventable _defAddChildFn
    * @param {EventFacade} e The Event Facade
    */
    _yuitest_coverfunc("build/widget-parent/widget-parent.js", "Parent", 29);
_yuitest_coverline("build/widget-parent/widget-parent.js", 49);
this.publish("addChild", { 
        defaultTargetOnly: true,
        defaultFn: this._defAddChildFn 
    });


    /**
    * Fires when a child Widget is removed.  The event object will have a 
    * 'child' property that returns a reference to the child Widget, as well 
    * as an 'index' property that returns a reference child's ordinal position.
    * <p>
    * Subscribers to the "on" moment of this event, will be notified 
    * before a child is removed.
    * </p>
    * <p>
    * Subscribers to the "after" moment of this event, will be notified
    * after a child is removed.
    * </p>
    *
    * @event removeChild
    * @preventable _defRemoveChildFn
    * @param {EventFacade} e The Event Facade
    */
    _yuitest_coverline("build/widget-parent/widget-parent.js", 72);
this.publish("removeChild", { 
        defaultTargetOnly: true,
        defaultFn: this._defRemoveChildFn 
    });

    _yuitest_coverline("build/widget-parent/widget-parent.js", 77);
this._items = [];

    _yuitest_coverline("build/widget-parent/widget-parent.js", 79);
var children,
        handle;

    _yuitest_coverline("build/widget-parent/widget-parent.js", 82);
if (config && config.children) {

        _yuitest_coverline("build/widget-parent/widget-parent.js", 84);
children = config.children;
        
        _yuitest_coverline("build/widget-parent/widget-parent.js", 86);
handle = this.after("initializedChange", function (e) {
            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 2)", 86);
_yuitest_coverline("build/widget-parent/widget-parent.js", 87);
this._add(children);
            _yuitest_coverline("build/widget-parent/widget-parent.js", 88);
handle.detach();
        });

    }

    //  Widget method overlap
    _yuitest_coverline("build/widget-parent/widget-parent.js", 94);
Y.after(this._renderChildren, this, "renderUI");
    _yuitest_coverline("build/widget-parent/widget-parent.js", 95);
Y.after(this._bindUIParent, this, "bindUI");

    _yuitest_coverline("build/widget-parent/widget-parent.js", 97);
this.after("selectionChange", this._afterSelectionChange);
    _yuitest_coverline("build/widget-parent/widget-parent.js", 98);
this.after("selectedChange", this._afterParentSelectedChange);
    _yuitest_coverline("build/widget-parent/widget-parent.js", 99);
this.after("activeDescendantChange", this._afterActiveDescendantChange);

    _yuitest_coverline("build/widget-parent/widget-parent.js", 101);
this._hDestroyChild = this.after("*:destroy", this._afterDestroyChild);
    _yuitest_coverline("build/widget-parent/widget-parent.js", 102);
this.after("*:focusedChange", this._updateActiveDescendant);

}

_yuitest_coverline("build/widget-parent/widget-parent.js", 106);
Parent.ATTRS = {

    /**
     * @attribute defaultChildType
     * @type {String|Object}
     *
     * @description String representing the default type of the children 
     * managed by this Widget.  Can also supply default type as a constructor
     * reference.
     */
    defaultChildType: {
        setter: function (val) {
            
            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "setter", 117);
_yuitest_coverline("build/widget-parent/widget-parent.js", 119);
var returnVal = Y.Attribute.INVALID_VALUE,
                FnConstructor = Lang.isString(val) ? Y[val] : val;
            
            _yuitest_coverline("build/widget-parent/widget-parent.js", 122);
if (Lang.isFunction(FnConstructor)) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 123);
returnVal = FnConstructor;
            }
            
            _yuitest_coverline("build/widget-parent/widget-parent.js", 126);
return returnVal;
        }
    },

    /**
     * @attribute activeDescendant
     * @type Widget
     * @readOnly
     *
     * @description Returns the Widget's currently focused descendant Widget.
     */
    activeDescendant: {    
        readOnly: true
    },

    /**
     * @attribute multiple
     * @type Boolean
     * @default false
     * @writeOnce 
     *
     * @description Boolean indicating if multiple children can be selected at 
     * once.  Whether or not multiple selection is enabled is always delegated
     * to the value of the <code>multiple</code> attribute of the root widget
     * in the object hierarchy.
     */
    multiple: {
        value: false,
        validator: Lang.isBoolean,
        writeOnce: true,
        getter: function (value) {
            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "getter", 156);
_yuitest_coverline("build/widget-parent/widget-parent.js", 157);
var root = this.get("root");
            _yuitest_coverline("build/widget-parent/widget-parent.js", 158);
return (root && root != this) ? root.get("multiple") : value;
        }
    },


    /**
     * @attribute selection
     * @type {ArrayList|Widget}
     * @readOnly  
     *
     * @description Returns the currently selected child Widget.  If the 
     * <code>mulitple</code> attribte is set to <code>true</code> will 
     * return an Y.ArrayList instance containing the currently selected 
     * children.  If no children are selected, will return null.
     */
    selection: {
        readOnly: true,
        setter: "_setSelection",
        getter: function (value) {
            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "getter", 176);
_yuitest_coverline("build/widget-parent/widget-parent.js", 177);
var selection = Lang.isArray(value) ? 
                    (new Y.ArrayList(value)) : value;
            _yuitest_coverline("build/widget-parent/widget-parent.js", 179);
return selection;
        }
    },

    selected: {
        setter: function (value) {

            //  Enforces selection behavior on for parent Widgets.  Parent's 
            //  selected attribute can be set to the following:
            //  0 - Not selected
            //  1 - Fully selected (all children are selected).  In order for 
            //  all children to be selected, multiple selection must be 
            //  enabled.  Therefore, you cannot set the "selected" attribute 
            //  on a parent Widget to 1 unless multiple selection is enabled.
            //  2 - Partially selected, meaning one ore more (but not all) 
            //  children are selected.

            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "setter", 184);
_yuitest_coverline("build/widget-parent/widget-parent.js", 196);
var returnVal = value;

            _yuitest_coverline("build/widget-parent/widget-parent.js", 198);
if (value === 1 && !this.get("multiple")) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 199);
returnVal = Y.Attribute.INVALID_VALUE;
            }
            
            _yuitest_coverline("build/widget-parent/widget-parent.js", 202);
return returnVal;
        }
    }

};

_yuitest_coverline("build/widget-parent/widget-parent.js", 208);
Parent.prototype = {

    /**
     * The destructor implementation for Parent widgets. Destroys all children.
     * @method destructor
     */
    destructor: function() {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "destructor", 214);
_yuitest_coverline("build/widget-parent/widget-parent.js", 215);
this._destroyChildren();
    },

    /**
     * Destroy event listener for each child Widget, responsible for removing 
     * the destroyed child Widget from the parent's internal array of children
     * (_items property).
     *
     * @method _afterDestroyChild
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterDestroyChild: function (event) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_afterDestroyChild", 227);
_yuitest_coverline("build/widget-parent/widget-parent.js", 228);
var child = event.target;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 230);
if (child.get("parent") == this) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 231);
child.remove();
        }        
    },

    /**
     * Attribute change listener for the <code>selection</code> 
     * attribute, responsible for setting the value of the 
     * parent's <code>selected</code> attribute.
     *
     * @method _afterSelectionChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterSelectionChange: function (event) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_afterSelectionChange", 244);
_yuitest_coverline("build/widget-parent/widget-parent.js", 246);
if (event.target == this && event.src != this) {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 248);
var selection = event.newVal,
                selectedVal = 0;    //  Not selected


            _yuitest_coverline("build/widget-parent/widget-parent.js", 252);
if (selection) {

                _yuitest_coverline("build/widget-parent/widget-parent.js", 254);
selectedVal = 2;    //  Assume partially selected, confirm otherwise


                _yuitest_coverline("build/widget-parent/widget-parent.js", 257);
if (Y.instanceOf(selection, Y.ArrayList) && 
                    (selection.size() === this.size())) {

                    _yuitest_coverline("build/widget-parent/widget-parent.js", 260);
selectedVal = 1;    //  Fully selected

                }
                
            }

            _yuitest_coverline("build/widget-parent/widget-parent.js", 266);
this.set("selected", selectedVal, { src: this });
        
        }
    },


    /**
     * Attribute change listener for the <code>activeDescendant</code> 
     * attribute, responsible for setting the value of the 
     * parent's <code>activeDescendant</code> attribute.
     *
     * @method _afterActiveDescendantChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterActiveDescendantChange: function (event) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_afterActiveDescendantChange", 281);
_yuitest_coverline("build/widget-parent/widget-parent.js", 282);
var parent = this.get("parent");

        _yuitest_coverline("build/widget-parent/widget-parent.js", 284);
if (parent) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 285);
parent._set("activeDescendant", event.newVal);
        }
    },

    /**
     * Attribute change listener for the <code>selected</code> 
     * attribute, responsible for syncing the selected state of all children to 
     * match that of their parent Widget.
     * 
     *
     * @method _afterParentSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterParentSelectedChange: function (event) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_afterParentSelectedChange", 299);
_yuitest_coverline("build/widget-parent/widget-parent.js", 301);
var value = event.newVal;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 303);
if (this == event.target && event.src != this && 
            (value === 0 || value === 1)) {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 306);
this.each(function (child) {

                //  Specify the source of this change as the parent so that 
                //  value of the parent's "selection" attribute isn't 
                //  recalculated

                _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 3)", 306);
_yuitest_coverline("build/widget-parent/widget-parent.js", 312);
child.set("selected", value, { src: this });

            }, this);
            
        }
        
    },


    /**
     * Default setter for <code>selection</code> attribute changes.
     *
     * @method _setSelection
     * @protected
     * @param child {Widget|Array} Widget or Array of Widget instances.     
     * @return {Widget|Array} Widget or Array of Widget instances.
     */
    _setSelection: function (child) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_setSelection", 329);
_yuitest_coverline("build/widget-parent/widget-parent.js", 331);
var selection = null,
            selected;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 334);
if (this.get("multiple") && !this.isEmpty()) {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 336);
selected = [];
            
            _yuitest_coverline("build/widget-parent/widget-parent.js", 338);
this.each(function (v) {

               _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 4)", 338);
_yuitest_coverline("build/widget-parent/widget-parent.js", 340);
if (v.get("selected") > 0) {
                   _yuitest_coverline("build/widget-parent/widget-parent.js", 341);
selected.push(v);
               }

            });

            _yuitest_coverline("build/widget-parent/widget-parent.js", 346);
if (selected.length > 0) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 347);
selection = selected;
            }

        }
        else {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 353);
if (child.get("selected") > 0) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 354);
selection = child;
            }

        }
        
        _yuitest_coverline("build/widget-parent/widget-parent.js", 359);
return selection;
            
    },


    /**
     * Attribute change listener for the <code>selected</code> 
     * attribute of child Widgets, responsible for setting the value of the 
     * parent's <code>selection</code> attribute.
     *
     * @method _updateSelection
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _updateSelection: function (event) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_updateSelection", 373);
_yuitest_coverline("build/widget-parent/widget-parent.js", 375);
var child = event.target,
            selection;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 378);
if (child.get("parent") == this) {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 380);
if (event.src != "_updateSelection") {

                _yuitest_coverline("build/widget-parent/widget-parent.js", 382);
selection = this.get("selection");

                _yuitest_coverline("build/widget-parent/widget-parent.js", 384);
if (!this.get("multiple") && selection && event.newVal > 0) {

                    //  Deselect the previously selected child.
                    //  Set src equal to the current context to prevent
                    //  unnecessary re-calculation of the selection.

                    _yuitest_coverline("build/widget-parent/widget-parent.js", 390);
selection.set("selected", 0, { src: "_updateSelection" });

                }

                _yuitest_coverline("build/widget-parent/widget-parent.js", 394);
this._set("selection", child);

            }

            _yuitest_coverline("build/widget-parent/widget-parent.js", 398);
if (event.src == this) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 399);
this._set("selection", child, { src: this });
            }
            
        }

    },

    /**
     * Attribute change listener for the <code>focused</code> 
     * attribute of child Widgets, responsible for setting the value of the 
     * parent's <code>activeDescendant</code> attribute.
     *
     * @method _updateActiveDescendant
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _updateActiveDescendant: function (event) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_updateActiveDescendant", 415);
_yuitest_coverline("build/widget-parent/widget-parent.js", 416);
var activeDescendant = (event.newVal === true) ? event.target : null;
        _yuitest_coverline("build/widget-parent/widget-parent.js", 417);
this._set("activeDescendant", activeDescendant);
    },

    /**
     * Creates an instance of a child Widget using the specified configuration.
     * By default Widget instances will be created of the type specified 
     * by the <code>defaultChildType</code> attribute.  Types can be explicitly
     * defined via the <code>childType</code> property of the configuration object
     * literal. The use of the <code>type</code> property has been deprecated, but 
     * will still be used as a fallback, if <code>childType</code> is not defined,
     * for backwards compatibility. 
     *
     * @method _createChild
     * @protected
     * @param config {Object} Object literal representing the configuration 
     * used to create an instance of a Widget.
     */
    _createChild: function (config) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_createChild", 434);
_yuitest_coverline("build/widget-parent/widget-parent.js", 436);
var defaultType = this.get("defaultChildType"),
            altType = config.childType || config.type,
            child,
            Fn,
            FnConstructor;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 442);
if (altType) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 443);
Fn = Lang.isString(altType) ? Y[altType] : altType;
        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 446);
if (Lang.isFunction(Fn)) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 447);
FnConstructor = Fn;
        } else {_yuitest_coverline("build/widget-parent/widget-parent.js", 448);
if (defaultType) {
            // defaultType is normalized to a function in it's setter 
            _yuitest_coverline("build/widget-parent/widget-parent.js", 450);
FnConstructor = defaultType;
        }}

        _yuitest_coverline("build/widget-parent/widget-parent.js", 453);
if (FnConstructor) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 454);
child = new FnConstructor(config);
        } else {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 456);
Y.error("Could not create a child instance because its constructor is either undefined or invalid.");
        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 459);
return child;
        
    },

    /**
     * Default addChild handler
     *
     * @method _defAddChildFn
     * @protected
     * @param event {EventFacade} The Event object
     * @param child {Widget} The Widget instance, or configuration 
     * object for the Widget to be added as a child.
     * @param index {Number} Number representing the position at 
     * which the child will be inserted.
     */
    _defAddChildFn: function (event) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_defAddChildFn", 474);
_yuitest_coverline("build/widget-parent/widget-parent.js", 476);
var child = event.child,
            index = event.index,
            children = this._items;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 480);
if (child.get("parent")) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 481);
child.remove();
        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 484);
if (Lang.isNumber(index)) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 485);
children.splice(index, 0, child);
        }
        else {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 488);
children.push(child);
        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 491);
child._set("parent", this);
        _yuitest_coverline("build/widget-parent/widget-parent.js", 492);
child.addTarget(this);

        // Update index in case it got normalized after addition
        // (e.g. user passed in 10, and there are only 3 items, the actual index would be 3. We don't want to pass 10 around in the event facade).
        _yuitest_coverline("build/widget-parent/widget-parent.js", 496);
event.index = child.get("index");

        //  TO DO: Remove in favor of using event bubbling
        _yuitest_coverline("build/widget-parent/widget-parent.js", 499);
child.after("selectedChange", Y.bind(this._updateSelection, this));
    },


    /**
     * Default removeChild handler
     *
     * @method _defRemoveChildFn
     * @protected
     * @param event {EventFacade} The Event object
     * @param child {Widget} The Widget instance to be removed.
     * @param index {Number} Number representing the index of the Widget to 
     * be removed.
     */    
    _defRemoveChildFn: function (event) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_defRemoveChildFn", 513);
_yuitest_coverline("build/widget-parent/widget-parent.js", 515);
var child = event.child,
            index = event.index,
            children = this._items;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 519);
if (child.get("focused")) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 520);
child.blur(); // focused is readOnly, so use the public i/f to unset it
        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 523);
if (child.get("selected")) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 524);
child.set("selected", 0);
        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 527);
children.splice(index, 1);

        _yuitest_coverline("build/widget-parent/widget-parent.js", 529);
child.removeTarget(this);
        _yuitest_coverline("build/widget-parent/widget-parent.js", 530);
child._oldParent = child.get("parent");
        _yuitest_coverline("build/widget-parent/widget-parent.js", 531);
child._set("parent", null);
    },

    /**
    * @method _add
    * @protected
    * @param child {Widget|Object} The Widget instance, or configuration 
    * object for the Widget to be added as a child.
    * @param child {Array} Array of Widget instances, or configuration 
    * objects for the Widgets to be added as a children.
    * @param index {Number} (Optional.)  Number representing the position at 
    * which the child should be inserted.
    * @description Adds a Widget as a child.  If the specified Widget already
    * has a parent it will be removed from its current parent before
    * being added as a child.
    * @return {Widget|Array} Successfully added Widget or Array containing the 
    * successfully added Widget instance(s). If no children where added, will 
    * will return undefined.
    */
    _add: function (child, index) {   

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_add", 550);
_yuitest_coverline("build/widget-parent/widget-parent.js", 552);
var children,
            oChild,
            returnVal;


        _yuitest_coverline("build/widget-parent/widget-parent.js", 557);
if (Lang.isArray(child)) {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 559);
children = [];

            _yuitest_coverline("build/widget-parent/widget-parent.js", 561);
Y.each(child, function (v, k) {

                _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 5)", 561);
_yuitest_coverline("build/widget-parent/widget-parent.js", 563);
oChild = this._add(v, (index + k));

                _yuitest_coverline("build/widget-parent/widget-parent.js", 565);
if (oChild) {
                    _yuitest_coverline("build/widget-parent/widget-parent.js", 566);
children.push(oChild);
                }
                
            }, this);
            

            _yuitest_coverline("build/widget-parent/widget-parent.js", 572);
if (children.length > 0) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 573);
returnVal = children;
            }

        }
        else {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 579);
if (Y.instanceOf(child, Y.Widget)) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 580);
oChild = child;
            }
            else {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 583);
oChild = this._createChild(child);
            }

            _yuitest_coverline("build/widget-parent/widget-parent.js", 586);
if (oChild && this.fire("addChild", { child: oChild, index: index })) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 587);
returnVal = oChild;
            }

        }

        _yuitest_coverline("build/widget-parent/widget-parent.js", 592);
return returnVal;

    },


    /**
    * @method add
    * @param child {Widget|Object} The Widget instance, or configuration 
    * object for the Widget to be added as a child. The configuration object
    * for the child can include a <code>childType</code> property, which is either
    * a constructor function or a string which names a constructor function on the 
    * Y instance (e.g. "Tab" would refer to Y.Tab) (<code>childType</code> used to be 
    * named <code>type</code>, support for which has been deprecated, but is still
    * maintained for backward compatibility. <code>childType</code> takes precedence
    * over <code>type</code> if both are defined.
    * @param child {Array} Array of Widget instances, or configuration 
    * objects for the Widgets to be added as a children.
    * @param index {Number} (Optional.)  Number representing the position at 
    * which the child should be inserted.
    * @description Adds a Widget as a child.  If the specified Widget already
    * has a parent it will be removed from its current parent before
    * being added as a child.
    * @return {ArrayList} Y.ArrayList containing the successfully added 
    * Widget instance(s).  If no children where added, will return an empty 
    * Y.ArrayList instance.
    */
    add: function () {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "add", 618);
_yuitest_coverline("build/widget-parent/widget-parent.js", 620);
var added = this._add.apply(this, arguments),
            children = added ? (Lang.isArray(added) ? added : [added]) : [];

        _yuitest_coverline("build/widget-parent/widget-parent.js", 623);
return (new Y.ArrayList(children));

    },


    /**
    * @method remove
    * @param index {Number} (Optional.)  Number representing the index of the 
    * child to be removed.
    * @description Removes the Widget from its parent.  Optionally, can remove
    * a child by specifying its index.
    * @return {Widget} Widget instance that was successfully removed, otherwise
    * undefined.
    */
    remove: function (index) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "remove", 637);
_yuitest_coverline("build/widget-parent/widget-parent.js", 639);
var child = this._items[index],
            returnVal;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 642);
if (child && this.fire("removeChild", { child: child, index: index })) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 643);
returnVal = child;
        }
        
        _yuitest_coverline("build/widget-parent/widget-parent.js", 646);
return returnVal;

    },


    /**
    * @method removeAll
    * @description Removes all of the children from the Widget.
    * @return {ArrayList} Y.ArrayList instance containing Widgets that were 
    * successfully removed.  If no children where removed, will return an empty 
    * Y.ArrayList instance.
    */
    removeAll: function () {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "removeAll", 658);
_yuitest_coverline("build/widget-parent/widget-parent.js", 660);
var removed = [],
            child;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 663);
Y.each(this._items.concat(), function () {

            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 6)", 663);
_yuitest_coverline("build/widget-parent/widget-parent.js", 665);
child = this.remove(0);

            _yuitest_coverline("build/widget-parent/widget-parent.js", 667);
if (child) {
                _yuitest_coverline("build/widget-parent/widget-parent.js", 668);
removed.push(child);
            }

        }, this);

        _yuitest_coverline("build/widget-parent/widget-parent.js", 673);
return (new Y.ArrayList(removed));

    },
    
    /**
     * Selects the child at the given index (zero-based).
     *
     * @method selectChild
     * @param {Number} i the index of the child to be selected
     */
    selectChild: function(i) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "selectChild", 683);
_yuitest_coverline("build/widget-parent/widget-parent.js", 684);
this.item(i).set('selected', 1);
    },

    /**
     * Selects all children.
     *
     * @method selectAll
     */
    selectAll: function () {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "selectAll", 692);
_yuitest_coverline("build/widget-parent/widget-parent.js", 693);
this.set("selected", 1);
    },

    /**
     * Deselects all children.
     *
     * @method deselectAll
     */
    deselectAll: function () {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "deselectAll", 701);
_yuitest_coverline("build/widget-parent/widget-parent.js", 702);
this.set("selected", 0);
    },

    /**
     * Updates the UI in response to a child being added.
     *
     * @method _uiAddChild
     * @protected
     * @param child {Widget} The child Widget instance to render.
     * @param parentNode {Object} The Node under which the 
     * child Widget is to be rendered.
     */    
    _uiAddChild: function (child, parentNode) {

        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_uiAddChild", 714);
_yuitest_coverline("build/widget-parent/widget-parent.js", 716);
child.render(parentNode);

        // TODO: Ideally this should be in Child's render UI. 

        _yuitest_coverline("build/widget-parent/widget-parent.js", 720);
var childBB = child.get("boundingBox"),
            siblingBB,
            nextSibling = child.next(false),
            prevSibling;

        // Insert or Append to last child.

        // Avoiding index, and using the current sibling 
        // state (which should be accurate), means we don't have 
        // to worry about decorator elements which may be added 
        // to the _childContainer node.
    
        _yuitest_coverline("build/widget-parent/widget-parent.js", 732);
if (nextSibling && nextSibling.get(RENDERED)) {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 734);
siblingBB = nextSibling.get(BOUNDING_BOX);
            _yuitest_coverline("build/widget-parent/widget-parent.js", 735);
siblingBB.insert(childBB, "before");

        } else {

            _yuitest_coverline("build/widget-parent/widget-parent.js", 739);
prevSibling = child.previous(false);

            _yuitest_coverline("build/widget-parent/widget-parent.js", 741);
if (prevSibling && prevSibling.get(RENDERED)) {

                _yuitest_coverline("build/widget-parent/widget-parent.js", 743);
siblingBB = prevSibling.get(BOUNDING_BOX);
                _yuitest_coverline("build/widget-parent/widget-parent.js", 744);
siblingBB.insert(childBB, "after");

            } else {_yuitest_coverline("build/widget-parent/widget-parent.js", 746);
if (!parentNode.contains(childBB)) {

                // Based on pull request from andreas-karlsson
                // https://github.com/yui/yui3/pull/25#issuecomment-2103536

                // Account for case where a child was rendered independently of the 
                // parent-child framework, to a node outside of the parentNode,
                // and there are no siblings.

                _yuitest_coverline("build/widget-parent/widget-parent.js", 755);
parentNode.appendChild(childBB);
            }}
        }

    },

    /**
     * Updates the UI in response to a child being removed.
     *
     * @method _uiRemoveChild
     * @protected
     * @param child {Widget} The child Widget instance to render.
     */        
    _uiRemoveChild: function (child) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_uiRemoveChild", 768);
_yuitest_coverline("build/widget-parent/widget-parent.js", 769);
child.get("boundingBox").remove();
    },

    _afterAddChild: function (event) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_afterAddChild", 772);
_yuitest_coverline("build/widget-parent/widget-parent.js", 773);
var child = event.child;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 775);
if (child.get("parent") == this) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 776);
this._uiAddChild(child, this._childrenContainer);
        }
    },

    _afterRemoveChild: function (event) {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_afterRemoveChild", 780);
_yuitest_coverline("build/widget-parent/widget-parent.js", 781);
var child = event.child;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 783);
if (child._oldParent == this) {
            _yuitest_coverline("build/widget-parent/widget-parent.js", 784);
this._uiRemoveChild(child);
        }
    },

    /**
     * Sets up DOM and CustomEvent listeners for the parent widget.
     * <p>
     * This method in invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     *
     * @method _bindUIParent
     * @protected
     */
    _bindUIParent: function () {
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_bindUIParent", 798);
_yuitest_coverline("build/widget-parent/widget-parent.js", 799);
this.after("addChild", this._afterAddChild);
        _yuitest_coverline("build/widget-parent/widget-parent.js", 800);
this.after("removeChild", this._afterRemoveChild);
    },

    /**
     * Renders all child Widgets for the parent.
     * <p>
     * This method in invoked after renderUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _renderChildren
     * @protected
     */
    _renderChildren: function () {

        /**
         * <p>By default WidgetParent will render it's children to the parent's content box.</p>
         *
         * <p>If the children need to be rendered somewhere else, the _childrenContainer property
         * can be set to the Node which the children should be rendered to. This property should be
         * set before the _renderChildren method is invoked, ideally in your renderUI method, 
         * as soon as you create the element to be rendered to.</p>
         *
         * @protected
         * @property _childrenContainer
         * @value The content box
         * @type Node
         */
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_renderChildren", 812);
_yuitest_coverline("build/widget-parent/widget-parent.js", 827);
var renderTo = this._childrenContainer || this.get("contentBox");

        _yuitest_coverline("build/widget-parent/widget-parent.js", 829);
this._childrenContainer = renderTo;

        _yuitest_coverline("build/widget-parent/widget-parent.js", 831);
this.each(function (child) {
            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 7)", 831);
_yuitest_coverline("build/widget-parent/widget-parent.js", 832);
child.render(renderTo);
        });
    },

    /**
     * Destroys all child Widgets for the parent.
     * <p>
     * This method is invoked before the destructor is invoked for the Widget 
     * class using YUI's aop infrastructure.
     * </p>
     * @method _destroyChildren
     * @protected
     */
    _destroyChildren: function () {

        //  Detach the handler responsible for removing children in 
        //  response to destroying them since:
        //  1)  It is unnecessary/inefficient at this point since we are doing 
        //      a batch destroy of all children.
        //  2)  Removing each child will affect our ability to iterate the 
        //      children since the size of _items will be changing as we 
        //      iterate.
        _yuitest_coverfunc("build/widget-parent/widget-parent.js", "_destroyChildren", 845);
_yuitest_coverline("build/widget-parent/widget-parent.js", 854);
this._hDestroyChild.detach();

        //  Need to clone the _items array since 
        _yuitest_coverline("build/widget-parent/widget-parent.js", 857);
this.each(function (child) {
            _yuitest_coverfunc("build/widget-parent/widget-parent.js", "(anonymous 8)", 857);
_yuitest_coverline("build/widget-parent/widget-parent.js", 858);
child.destroy();
        });
    }
    
};

_yuitest_coverline("build/widget-parent/widget-parent.js", 864);
Y.augment(Parent, Y.ArrayList);

_yuitest_coverline("build/widget-parent/widget-parent.js", 866);
Y.WidgetParent = Parent;


}, '3.7.3', {"requires": ["arraylist", "base-build", "widget"]});
