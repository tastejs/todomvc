/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-child', function (Y, NAME) {

/**
 * Extension enabling a Widget to be a child of another Widget.
 *
 * @module widget-child
 */

var Lang = Y.Lang;

/**
 * Widget extension providing functionality enabling a Widget to be a 
 * child of another Widget.
 *
 * @class WidgetChild
 * @param {Object} config User configuration object.
*/
function Child() {

    //  Widget method overlap
    Y.after(this._syncUIChild, this, "syncUI");
    Y.after(this._bindUIChild, this, "bindUI");

}

Child.ATTRS = {

    /**
     * @attribute selected
     * @type Number
     * @default 0
     *
     * @description Number indicating if the Widget is selected.  Possible 
     * values are:
     * <dl>
     * <dt>0</dt> <dd>(Default) Not selected</dd>
     * <dt>1</dt> <dd>Fully selected</dd>
     * <dt>2</dt> <dd>Partially selected</dd>
     * </dl>
    */
    selected: {   
        value: 0,
        validator: Lang.isNumber
    },


    /**
     * @attribute index
     * @type Number
     * @readOnly
     *
     * @description Number representing the Widget's ordinal position in its 
     * parent Widget.
     */
    index: {
        readOnly: true,
        getter: function () {
            
            var parent = this.get("parent"),
                index = -1;
            
            if (parent) {
                index = parent.indexOf(this);
            }
            
            return index;
            
        }
    },


    /**
     * @attribute parent
     * @type Widget
     * @readOnly
     *
     * @description Retrieves the parent of the Widget in the object hierarchy.
    */
    parent: {
        readOnly: true
    },


    /**
     * @attribute depth
     * @type Number
     * @default -1 
     * @readOnly         
     *
     * @description Number representing the depth of this Widget relative to 
     * the root Widget in the object heirarchy.
     */
    depth: {
        readOnly: true,
        getter: function () {
            
            var parent = this.get("parent"),
                root = this.get("root"),
                depth = -1;
            
            while (parent) {

                depth = (depth + 1);

                if (parent == root) {
                    break;
                }

                parent = parent.get("parent");

            }
            
            return depth;
            
        }
    },

    /**
     * @attribute root
     * @type Widget 
     * @readOnly         
     *
     * @description Returns the root Widget in the object hierarchy.  If the
     * ROOT_TYPE property is set, the search for the root Widget will be 
     * constrained to parent Widgets of the specified type.
     */
    root: {
        readOnly: true,
        getter: function () {

            var getParent = function (child) {

                var parent = child.get("parent"),
                    FnRootType = child.ROOT_TYPE,
                    criteria = parent;

                if (FnRootType) {
                    criteria = (parent && Y.instanceOf(parent, FnRootType));
                }

                return (criteria ? getParent(parent) : child);
                
            };

            return getParent(this);
            
        }
    }

};

Child.prototype = {

    /**
     * Constructor reference used to determine the root of a Widget-based 
     * object tree.
     * <p>
     * Currently used to control the behavior of the <code>root</code>  
     * attribute so that recursing up the object heirarchy can be constrained 
     * to a specific type of Widget.  Widget authors should set this property
     * to the constructor function for a given Widget implementation.
     * </p>
     *
     * @property ROOT_TYPE
     * @type Object
     */
    ROOT_TYPE: null,

    /**
     * Returns the node on which to bind delegate listeners.
     * 
     * Override of Widget's implementation of _getUIEventNode() to ensure that 
     * all event listeners are bound to the Widget's topmost DOM element.
     * This ensures that the firing of each type of Widget UI event (click,
     * mousedown, etc.) is facilitated by a single, top-level, delegated DOM
     * event listener.
     *
     * @method _getUIEventNode
     * @for Widget
     * @protected
     */
    _getUIEventNode: function () {
        var root = this.get("root"),
            returnVal;
        
        if (root) {
            returnVal = root.get("boundingBox");
        }
    
        return returnVal;
    },

    /**
    * @method next
    * @description Returns the Widget's next sibling.
    * @param {Boolean} circular Boolean indicating if the parent's first child 
    * should be returned if the child has no next sibling.  
    * @return {Widget} Widget instance. 
    */
    next: function (circular) {

        var parent = this.get("parent"),
            sibling;

        if (parent) {
            sibling = parent.item((this.get("index")+1));
        }

        if (!sibling && circular) {
            sibling = parent.item(0);
        }

        return sibling;

    },


    /**
    * @method previous
    * @description Returns the Widget's previous sibling.
    * @param {Boolean} circular Boolean indicating if the parent's last child 
    * should be returned if the child has no previous sibling.
    * @return {Widget} Widget instance. 
    */
    previous: function (circular) {

        var parent = this.get("parent"),
            index = this.get("index"),
            sibling;
        
        if (parent && index > 0) {
            sibling = parent.item([(index-1)]);
        }

        if (!sibling && circular) {
            sibling = parent.item((parent.size() - 1));
        }

        return sibling; 
        
    },


    //  Override of Y.WidgetParent.remove()
    //  Sugar implementation allowing a child to remove itself from its parent.
    remove: function (index) {

        var parent,
            removed;

        if (Lang.isNumber(index)) {
            removed = Y.WidgetParent.prototype.remove.apply(this, arguments);
        }
        else {

            parent = this.get("parent");

            if (parent) {
                removed = parent.remove(this.get("index"));
            }
                        
        }
        
        return removed;
        
    },


    /**
    * @method isRoot
    * @description Determines if the Widget is the root Widget in the 
    * object hierarchy.
    * @return {Boolean} Boolean indicating if Widget is the root Widget in the 
    * object hierarchy.
    */
    isRoot: function () {
        return (this == this.get("root"));
    },


    /**
    * @method ancestor
    * @description Returns the Widget instance at the specified depth.
    * @param {number} depth Number representing the depth of the ancestor.
    * @return {Widget} Widget instance.
    */
    ancestor: function (depth) {

        var root = this.get("root"),
            parent;

        if (this.get("depth") > depth)  {

            parent = this.get("parent");

            while (parent != root && parent.get("depth") > depth) {
                parent = parent.get("parent");
            }

        }

        return parent;

    },


    /**
     * Updates the UI to reflect the <code>selected</code> attribute value.
     *
     * @method _uiSetChildSelected
     * @protected
     * @param {number} selected The selected value to be reflected in the UI.
     */    
    _uiSetChildSelected: function (selected) {

        var box = this.get("boundingBox"),
            sClassName = this.getClassName("selected");

        if (selected === 0) {
            box.removeClass(sClassName);
        }
        else {
            box.addClass(sClassName);
        }
        
    },


    /**
     * Default attribute change listener for the <code>selected</code> 
     * attribute, responsible for updating the UI, in response to 
     * attribute changes.
     *
     * @method _afterChildSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */    
    _afterChildSelectedChange: function (event) {
        this._uiSetChildSelected(event.newVal);
    },
    

    /**
     * Synchronizes the UI to match the WidgetChild state.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>     
     *
     * @method _syncUIChild
     * @protected
     */    
    _syncUIChild: function () {
        this._uiSetChildSelected(this.get("selected"));
    },


    /**
     * Binds event listeners responsible for updating the UI state in response 
     * to WidgetChild related state changes.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _bindUIChild
     * @protected
     */    
    _bindUIChild: function () { 
        this.after("selectedChange", this._afterChildSelectedChange);
    }
    
};

Y.WidgetChild = Child;

}, '3.7.3', {"requires": ["base-build", "widget"]});
