/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-parent', function (Y, NAME) {

/**
 * Extension enabling a Widget to be a parent of another Widget.
 *
 * @module widget-parent
 */

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
    this.publish("removeChild", { 
        defaultTargetOnly: true,
        defaultFn: this._defRemoveChildFn 
    });

    this._items = [];

    var children,
        handle;

    if (config && config.children) {

        children = config.children;
        
        handle = this.after("initializedChange", function (e) {
            this._add(children);
            handle.detach();
        });

    }

    //  Widget method overlap
    Y.after(this._renderChildren, this, "renderUI");
    Y.after(this._bindUIParent, this, "bindUI");

    this.after("selectionChange", this._afterSelectionChange);
    this.after("selectedChange", this._afterParentSelectedChange);
    this.after("activeDescendantChange", this._afterActiveDescendantChange);

    this._hDestroyChild = this.after("*:destroy", this._afterDestroyChild);
    this.after("*:focusedChange", this._updateActiveDescendant);

}

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
            
            var returnVal = Y.Attribute.INVALID_VALUE,
                FnConstructor = Lang.isString(val) ? Y[val] : val;
            
            if (Lang.isFunction(FnConstructor)) {
                returnVal = FnConstructor;
            }
            
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
            var root = this.get("root");
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
            var selection = Lang.isArray(value) ? 
                    (new Y.ArrayList(value)) : value;
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

            var returnVal = value;

            if (value === 1 && !this.get("multiple")) {
                returnVal = Y.Attribute.INVALID_VALUE;
            }
            
            return returnVal;
        }
    }

};

Parent.prototype = {

    /**
     * The destructor implementation for Parent widgets. Destroys all children.
     * @method destructor
     */
    destructor: function() {
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
        var child = event.target;

        if (child.get("parent") == this) {
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

        if (event.target == this && event.src != this) {

            var selection = event.newVal,
                selectedVal = 0;    //  Not selected


            if (selection) {

                selectedVal = 2;    //  Assume partially selected, confirm otherwise


                if (Y.instanceOf(selection, Y.ArrayList) && 
                    (selection.size() === this.size())) {

                    selectedVal = 1;    //  Fully selected

                }
                
            }

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
        var parent = this.get("parent");

        if (parent) {
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

        var value = event.newVal;

        if (this == event.target && event.src != this && 
            (value === 0 || value === 1)) {

            this.each(function (child) {

                //  Specify the source of this change as the parent so that 
                //  value of the parent's "selection" attribute isn't 
                //  recalculated

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

        var selection = null,
            selected;

        if (this.get("multiple") && !this.isEmpty()) {

            selected = [];
            
            this.each(function (v) {

               if (v.get("selected") > 0) {
                   selected.push(v);
               }

            });

            if (selected.length > 0) {
                selection = selected;
            }

        }
        else {

            if (child.get("selected") > 0) {
                selection = child;
            }

        }
        
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

        var child = event.target,
            selection;

        if (child.get("parent") == this) {

            if (event.src != "_updateSelection") {

                selection = this.get("selection");

                if (!this.get("multiple") && selection && event.newVal > 0) {

                    //  Deselect the previously selected child.
                    //  Set src equal to the current context to prevent
                    //  unnecessary re-calculation of the selection.

                    selection.set("selected", 0, { src: "_updateSelection" });

                }

                this._set("selection", child);

            }

            if (event.src == this) {
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
        var activeDescendant = (event.newVal === true) ? event.target : null;
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

        var defaultType = this.get("defaultChildType"),
            altType = config.childType || config.type,
            child,
            Fn,
            FnConstructor;

        if (altType) {
            Fn = Lang.isString(altType) ? Y[altType] : altType;
        }

        if (Lang.isFunction(Fn)) {
            FnConstructor = Fn;
        } else if (defaultType) {
            // defaultType is normalized to a function in it's setter 
            FnConstructor = defaultType;
        }

        if (FnConstructor) {
            child = new FnConstructor(config);
        } else {
            Y.error("Could not create a child instance because its constructor is either undefined or invalid.");
        }

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

        var child = event.child,
            index = event.index,
            children = this._items;

        if (child.get("parent")) {
            child.remove();
        }

        if (Lang.isNumber(index)) {
            children.splice(index, 0, child);
        }
        else {
            children.push(child);
        }

        child._set("parent", this);
        child.addTarget(this);

        // Update index in case it got normalized after addition
        // (e.g. user passed in 10, and there are only 3 items, the actual index would be 3. We don't want to pass 10 around in the event facade).
        event.index = child.get("index");

        //  TO DO: Remove in favor of using event bubbling
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

        var child = event.child,
            index = event.index,
            children = this._items;

        if (child.get("focused")) {
            child.blur(); // focused is readOnly, so use the public i/f to unset it
        }

        if (child.get("selected")) {
            child.set("selected", 0);
        }

        children.splice(index, 1);

        child.removeTarget(this);
        child._oldParent = child.get("parent");
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

        var children,
            oChild,
            returnVal;


        if (Lang.isArray(child)) {

            children = [];

            Y.each(child, function (v, k) {

                oChild = this._add(v, (index + k));

                if (oChild) {
                    children.push(oChild);
                }
                
            }, this);
            

            if (children.length > 0) {
                returnVal = children;
            }

        }
        else {

            if (Y.instanceOf(child, Y.Widget)) {
                oChild = child;
            }
            else {
                oChild = this._createChild(child);
            }

            if (oChild && this.fire("addChild", { child: oChild, index: index })) {
                returnVal = oChild;
            }

        }

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

        var added = this._add.apply(this, arguments),
            children = added ? (Lang.isArray(added) ? added : [added]) : [];

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

        var child = this._items[index],
            returnVal;

        if (child && this.fire("removeChild", { child: child, index: index })) {
            returnVal = child;
        }
        
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

        var removed = [],
            child;

        Y.each(this._items.concat(), function () {

            child = this.remove(0);

            if (child) {
                removed.push(child);
            }

        }, this);

        return (new Y.ArrayList(removed));

    },
    
    /**
     * Selects the child at the given index (zero-based).
     *
     * @method selectChild
     * @param {Number} i the index of the child to be selected
     */
    selectChild: function(i) {
        this.item(i).set('selected', 1);
    },

    /**
     * Selects all children.
     *
     * @method selectAll
     */
    selectAll: function () {
        this.set("selected", 1);
    },

    /**
     * Deselects all children.
     *
     * @method deselectAll
     */
    deselectAll: function () {
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

        child.render(parentNode);

        // TODO: Ideally this should be in Child's render UI. 

        var childBB = child.get("boundingBox"),
            siblingBB,
            nextSibling = child.next(false),
            prevSibling;

        // Insert or Append to last child.

        // Avoiding index, and using the current sibling 
        // state (which should be accurate), means we don't have 
        // to worry about decorator elements which may be added 
        // to the _childContainer node.
    
        if (nextSibling && nextSibling.get(RENDERED)) {

            siblingBB = nextSibling.get(BOUNDING_BOX);
            siblingBB.insert(childBB, "before");

        } else {

            prevSibling = child.previous(false);

            if (prevSibling && prevSibling.get(RENDERED)) {

                siblingBB = prevSibling.get(BOUNDING_BOX);
                siblingBB.insert(childBB, "after");

            } else if (!parentNode.contains(childBB)) {

                // Based on pull request from andreas-karlsson
                // https://github.com/yui/yui3/pull/25#issuecomment-2103536

                // Account for case where a child was rendered independently of the 
                // parent-child framework, to a node outside of the parentNode,
                // and there are no siblings.

                parentNode.appendChild(childBB);
            }
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
        child.get("boundingBox").remove();
    },

    _afterAddChild: function (event) {
        var child = event.child;

        if (child.get("parent") == this) {
            this._uiAddChild(child, this._childrenContainer);
        }
    },

    _afterRemoveChild: function (event) {
        var child = event.child;

        if (child._oldParent == this) {
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
        this.after("addChild", this._afterAddChild);
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
        var renderTo = this._childrenContainer || this.get("contentBox");

        this._childrenContainer = renderTo;

        this.each(function (child) {
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
        this._hDestroyChild.detach();

        //  Need to clone the _items array since 
        this.each(function (child) {
            child.destroy();
        });
    }
    
};

Y.augment(Parent, Y.ArrayList);

Y.WidgetParent = Parent;


}, '3.7.3', {"requires": ["arraylist", "base-build", "widget"]});
