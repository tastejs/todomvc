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
_yuitest_coverage["build/widget-child/widget-child.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-child/widget-child.js",
    code: []
};
_yuitest_coverage["build/widget-child/widget-child.js"].code=["YUI.add('widget-child', function (Y, NAME) {","","/**"," * Extension enabling a Widget to be a child of another Widget."," *"," * @module widget-child"," */","","var Lang = Y.Lang;","","/**"," * Widget extension providing functionality enabling a Widget to be a "," * child of another Widget."," *"," * @class WidgetChild"," * @param {Object} config User configuration object.","*/","function Child() {","","    //  Widget method overlap","    Y.after(this._syncUIChild, this, \"syncUI\");","    Y.after(this._bindUIChild, this, \"bindUI\");","","}","","Child.ATTRS = {","","    /**","     * @attribute selected","     * @type Number","     * @default 0","     *","     * @description Number indicating if the Widget is selected.  Possible ","     * values are:","     * <dl>","     * <dt>0</dt> <dd>(Default) Not selected</dd>","     * <dt>1</dt> <dd>Fully selected</dd>","     * <dt>2</dt> <dd>Partially selected</dd>","     * </dl>","    */","    selected: {   ","        value: 0,","        validator: Lang.isNumber","    },","","","    /**","     * @attribute index","     * @type Number","     * @readOnly","     *","     * @description Number representing the Widget's ordinal position in its ","     * parent Widget.","     */","    index: {","        readOnly: true,","        getter: function () {","            ","            var parent = this.get(\"parent\"),","                index = -1;","            ","            if (parent) {","                index = parent.indexOf(this);","            }","            ","            return index;","            ","        }","    },","","","    /**","     * @attribute parent","     * @type Widget","     * @readOnly","     *","     * @description Retrieves the parent of the Widget in the object hierarchy.","    */","    parent: {","        readOnly: true","    },","","","    /**","     * @attribute depth","     * @type Number","     * @default -1 ","     * @readOnly         ","     *","     * @description Number representing the depth of this Widget relative to ","     * the root Widget in the object heirarchy.","     */","    depth: {","        readOnly: true,","        getter: function () {","            ","            var parent = this.get(\"parent\"),","                root = this.get(\"root\"),","                depth = -1;","            ","            while (parent) {","","                depth = (depth + 1);","","                if (parent == root) {","                    break;","                }","","                parent = parent.get(\"parent\");","","            }","            ","            return depth;","            ","        }","    },","","    /**","     * @attribute root","     * @type Widget ","     * @readOnly         ","     *","     * @description Returns the root Widget in the object hierarchy.  If the","     * ROOT_TYPE property is set, the search for the root Widget will be ","     * constrained to parent Widgets of the specified type.","     */","    root: {","        readOnly: true,","        getter: function () {","","            var getParent = function (child) {","","                var parent = child.get(\"parent\"),","                    FnRootType = child.ROOT_TYPE,","                    criteria = parent;","","                if (FnRootType) {","                    criteria = (parent && Y.instanceOf(parent, FnRootType));","                }","","                return (criteria ? getParent(parent) : child);","                ","            };","","            return getParent(this);","            ","        }","    }","","};","","Child.prototype = {","","    /**","     * Constructor reference used to determine the root of a Widget-based ","     * object tree.","     * <p>","     * Currently used to control the behavior of the <code>root</code>  ","     * attribute so that recursing up the object heirarchy can be constrained ","     * to a specific type of Widget.  Widget authors should set this property","     * to the constructor function for a given Widget implementation.","     * </p>","     *","     * @property ROOT_TYPE","     * @type Object","     */","    ROOT_TYPE: null,","","    /**","     * Returns the node on which to bind delegate listeners.","     * ","     * Override of Widget's implementation of _getUIEventNode() to ensure that ","     * all event listeners are bound to the Widget's topmost DOM element.","     * This ensures that the firing of each type of Widget UI event (click,","     * mousedown, etc.) is facilitated by a single, top-level, delegated DOM","     * event listener.","     *","     * @method _getUIEventNode","     * @for Widget","     * @protected","     */","    _getUIEventNode: function () {","        var root = this.get(\"root\"),","            returnVal;","        ","        if (root) {","            returnVal = root.get(\"boundingBox\");","        }","    ","        return returnVal;","    },","","    /**","    * @method next","    * @description Returns the Widget's next sibling.","    * @param {Boolean} circular Boolean indicating if the parent's first child ","    * should be returned if the child has no next sibling.  ","    * @return {Widget} Widget instance. ","    */","    next: function (circular) {","","        var parent = this.get(\"parent\"),","            sibling;","","        if (parent) {","            sibling = parent.item((this.get(\"index\")+1));","        }","","        if (!sibling && circular) {","            sibling = parent.item(0);","        }","","        return sibling;","","    },","","","    /**","    * @method previous","    * @description Returns the Widget's previous sibling.","    * @param {Boolean} circular Boolean indicating if the parent's last child ","    * should be returned if the child has no previous sibling.","    * @return {Widget} Widget instance. ","    */","    previous: function (circular) {","","        var parent = this.get(\"parent\"),","            index = this.get(\"index\"),","            sibling;","        ","        if (parent && index > 0) {","            sibling = parent.item([(index-1)]);","        }","","        if (!sibling && circular) {","            sibling = parent.item((parent.size() - 1));","        }","","        return sibling; ","        ","    },","","","    //  Override of Y.WidgetParent.remove()","    //  Sugar implementation allowing a child to remove itself from its parent.","    remove: function (index) {","","        var parent,","            removed;","","        if (Lang.isNumber(index)) {","            removed = Y.WidgetParent.prototype.remove.apply(this, arguments);","        }","        else {","","            parent = this.get(\"parent\");","","            if (parent) {","                removed = parent.remove(this.get(\"index\"));","            }","                        ","        }","        ","        return removed;","        ","    },","","","    /**","    * @method isRoot","    * @description Determines if the Widget is the root Widget in the ","    * object hierarchy.","    * @return {Boolean} Boolean indicating if Widget is the root Widget in the ","    * object hierarchy.","    */","    isRoot: function () {","        return (this == this.get(\"root\"));","    },","","","    /**","    * @method ancestor","    * @description Returns the Widget instance at the specified depth.","    * @param {number} depth Number representing the depth of the ancestor.","    * @return {Widget} Widget instance.","    */","    ancestor: function (depth) {","","        var root = this.get(\"root\"),","            parent;","","        if (this.get(\"depth\") > depth)  {","","            parent = this.get(\"parent\");","","            while (parent != root && parent.get(\"depth\") > depth) {","                parent = parent.get(\"parent\");","            }","","        }","","        return parent;","","    },","","","    /**","     * Updates the UI to reflect the <code>selected</code> attribute value.","     *","     * @method _uiSetChildSelected","     * @protected","     * @param {number} selected The selected value to be reflected in the UI.","     */    ","    _uiSetChildSelected: function (selected) {","","        var box = this.get(\"boundingBox\"),","            sClassName = this.getClassName(\"selected\");","","        if (selected === 0) {","            box.removeClass(sClassName);","        }","        else {","            box.addClass(sClassName);","        }","        ","    },","","","    /**","     * Default attribute change listener for the <code>selected</code> ","     * attribute, responsible for updating the UI, in response to ","     * attribute changes.","     *","     * @method _afterChildSelectedChange","     * @protected","     * @param {EventFacade} event The event facade for the attribute change.","     */    ","    _afterChildSelectedChange: function (event) {","        this._uiSetChildSelected(event.newVal);","    },","    ","","    /**","     * Synchronizes the UI to match the WidgetChild state.","     * <p>","     * This method is invoked after bindUI is invoked for the Widget class","     * using YUI's aop infrastructure.","     * </p>     ","     *","     * @method _syncUIChild","     * @protected","     */    ","    _syncUIChild: function () {","        this._uiSetChildSelected(this.get(\"selected\"));","    },","","","    /**","     * Binds event listeners responsible for updating the UI state in response ","     * to WidgetChild related state changes.","     * <p>","     * This method is invoked after bindUI is invoked for the Widget class","     * using YUI's aop infrastructure.","     * </p>","     * @method _bindUIChild","     * @protected","     */    ","    _bindUIChild: function () { ","        this.after(\"selectedChange\", this._afterChildSelectedChange);","    }","    ","};","","Y.WidgetChild = Child;","","}, '3.7.3', {\"requires\": [\"base-build\", \"widget\"]});"];
_yuitest_coverage["build/widget-child/widget-child.js"].lines = {"1":0,"9":0,"18":0,"21":0,"22":0,"26":0,"59":0,"62":0,"63":0,"66":0,"97":0,"101":0,"103":0,"105":0,"106":0,"109":0,"113":0,"131":0,"133":0,"137":0,"138":0,"141":0,"145":0,"152":0,"183":0,"186":0,"187":0,"190":0,"202":0,"205":0,"206":0,"209":0,"210":0,"213":0,"227":0,"231":0,"232":0,"235":0,"236":0,"239":0,"248":0,"251":0,"252":0,"256":0,"258":0,"259":0,"264":0,"277":0,"289":0,"292":0,"294":0,"296":0,"297":0,"302":0,"316":0,"319":0,"320":0,"323":0,"339":0,"354":0,"369":0,"374":0};
_yuitest_coverage["build/widget-child/widget-child.js"].functions = {"Child:18":0,"getter:57":0,"getter:95":0,"getParent:131":0,"getter:129":0,"_getUIEventNode:182":0,"next:200":0,"previous:225":0,"remove:246":0,"isRoot:276":0,"ancestor:287":0,"_uiSetChildSelected:314":0,"_afterChildSelectedChange:338":0,"_syncUIChild:353":0,"_bindUIChild:368":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-child/widget-child.js"].coveredLines = 62;
_yuitest_coverage["build/widget-child/widget-child.js"].coveredFunctions = 16;
_yuitest_coverline("build/widget-child/widget-child.js", 1);
YUI.add('widget-child', function (Y, NAME) {

/**
 * Extension enabling a Widget to be a child of another Widget.
 *
 * @module widget-child
 */

_yuitest_coverfunc("build/widget-child/widget-child.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-child/widget-child.js", 9);
var Lang = Y.Lang;

/**
 * Widget extension providing functionality enabling a Widget to be a 
 * child of another Widget.
 *
 * @class WidgetChild
 * @param {Object} config User configuration object.
*/
_yuitest_coverline("build/widget-child/widget-child.js", 18);
function Child() {

    //  Widget method overlap
    _yuitest_coverfunc("build/widget-child/widget-child.js", "Child", 18);
_yuitest_coverline("build/widget-child/widget-child.js", 21);
Y.after(this._syncUIChild, this, "syncUI");
    _yuitest_coverline("build/widget-child/widget-child.js", 22);
Y.after(this._bindUIChild, this, "bindUI");

}

_yuitest_coverline("build/widget-child/widget-child.js", 26);
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
            
            _yuitest_coverfunc("build/widget-child/widget-child.js", "getter", 57);
_yuitest_coverline("build/widget-child/widget-child.js", 59);
var parent = this.get("parent"),
                index = -1;
            
            _yuitest_coverline("build/widget-child/widget-child.js", 62);
if (parent) {
                _yuitest_coverline("build/widget-child/widget-child.js", 63);
index = parent.indexOf(this);
            }
            
            _yuitest_coverline("build/widget-child/widget-child.js", 66);
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
            
            _yuitest_coverfunc("build/widget-child/widget-child.js", "getter", 95);
_yuitest_coverline("build/widget-child/widget-child.js", 97);
var parent = this.get("parent"),
                root = this.get("root"),
                depth = -1;
            
            _yuitest_coverline("build/widget-child/widget-child.js", 101);
while (parent) {

                _yuitest_coverline("build/widget-child/widget-child.js", 103);
depth = (depth + 1);

                _yuitest_coverline("build/widget-child/widget-child.js", 105);
if (parent == root) {
                    _yuitest_coverline("build/widget-child/widget-child.js", 106);
break;
                }

                _yuitest_coverline("build/widget-child/widget-child.js", 109);
parent = parent.get("parent");

            }
            
            _yuitest_coverline("build/widget-child/widget-child.js", 113);
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

            _yuitest_coverfunc("build/widget-child/widget-child.js", "getter", 129);
_yuitest_coverline("build/widget-child/widget-child.js", 131);
var getParent = function (child) {

                _yuitest_coverfunc("build/widget-child/widget-child.js", "getParent", 131);
_yuitest_coverline("build/widget-child/widget-child.js", 133);
var parent = child.get("parent"),
                    FnRootType = child.ROOT_TYPE,
                    criteria = parent;

                _yuitest_coverline("build/widget-child/widget-child.js", 137);
if (FnRootType) {
                    _yuitest_coverline("build/widget-child/widget-child.js", 138);
criteria = (parent && Y.instanceOf(parent, FnRootType));
                }

                _yuitest_coverline("build/widget-child/widget-child.js", 141);
return (criteria ? getParent(parent) : child);
                
            };

            _yuitest_coverline("build/widget-child/widget-child.js", 145);
return getParent(this);
            
        }
    }

};

_yuitest_coverline("build/widget-child/widget-child.js", 152);
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
        _yuitest_coverfunc("build/widget-child/widget-child.js", "_getUIEventNode", 182);
_yuitest_coverline("build/widget-child/widget-child.js", 183);
var root = this.get("root"),
            returnVal;
        
        _yuitest_coverline("build/widget-child/widget-child.js", 186);
if (root) {
            _yuitest_coverline("build/widget-child/widget-child.js", 187);
returnVal = root.get("boundingBox");
        }
    
        _yuitest_coverline("build/widget-child/widget-child.js", 190);
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

        _yuitest_coverfunc("build/widget-child/widget-child.js", "next", 200);
_yuitest_coverline("build/widget-child/widget-child.js", 202);
var parent = this.get("parent"),
            sibling;

        _yuitest_coverline("build/widget-child/widget-child.js", 205);
if (parent) {
            _yuitest_coverline("build/widget-child/widget-child.js", 206);
sibling = parent.item((this.get("index")+1));
        }

        _yuitest_coverline("build/widget-child/widget-child.js", 209);
if (!sibling && circular) {
            _yuitest_coverline("build/widget-child/widget-child.js", 210);
sibling = parent.item(0);
        }

        _yuitest_coverline("build/widget-child/widget-child.js", 213);
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

        _yuitest_coverfunc("build/widget-child/widget-child.js", "previous", 225);
_yuitest_coverline("build/widget-child/widget-child.js", 227);
var parent = this.get("parent"),
            index = this.get("index"),
            sibling;
        
        _yuitest_coverline("build/widget-child/widget-child.js", 231);
if (parent && index > 0) {
            _yuitest_coverline("build/widget-child/widget-child.js", 232);
sibling = parent.item([(index-1)]);
        }

        _yuitest_coverline("build/widget-child/widget-child.js", 235);
if (!sibling && circular) {
            _yuitest_coverline("build/widget-child/widget-child.js", 236);
sibling = parent.item((parent.size() - 1));
        }

        _yuitest_coverline("build/widget-child/widget-child.js", 239);
return sibling; 
        
    },


    //  Override of Y.WidgetParent.remove()
    //  Sugar implementation allowing a child to remove itself from its parent.
    remove: function (index) {

        _yuitest_coverfunc("build/widget-child/widget-child.js", "remove", 246);
_yuitest_coverline("build/widget-child/widget-child.js", 248);
var parent,
            removed;

        _yuitest_coverline("build/widget-child/widget-child.js", 251);
if (Lang.isNumber(index)) {
            _yuitest_coverline("build/widget-child/widget-child.js", 252);
removed = Y.WidgetParent.prototype.remove.apply(this, arguments);
        }
        else {

            _yuitest_coverline("build/widget-child/widget-child.js", 256);
parent = this.get("parent");

            _yuitest_coverline("build/widget-child/widget-child.js", 258);
if (parent) {
                _yuitest_coverline("build/widget-child/widget-child.js", 259);
removed = parent.remove(this.get("index"));
            }
                        
        }
        
        _yuitest_coverline("build/widget-child/widget-child.js", 264);
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
        _yuitest_coverfunc("build/widget-child/widget-child.js", "isRoot", 276);
_yuitest_coverline("build/widget-child/widget-child.js", 277);
return (this == this.get("root"));
    },


    /**
    * @method ancestor
    * @description Returns the Widget instance at the specified depth.
    * @param {number} depth Number representing the depth of the ancestor.
    * @return {Widget} Widget instance.
    */
    ancestor: function (depth) {

        _yuitest_coverfunc("build/widget-child/widget-child.js", "ancestor", 287);
_yuitest_coverline("build/widget-child/widget-child.js", 289);
var root = this.get("root"),
            parent;

        _yuitest_coverline("build/widget-child/widget-child.js", 292);
if (this.get("depth") > depth)  {

            _yuitest_coverline("build/widget-child/widget-child.js", 294);
parent = this.get("parent");

            _yuitest_coverline("build/widget-child/widget-child.js", 296);
while (parent != root && parent.get("depth") > depth) {
                _yuitest_coverline("build/widget-child/widget-child.js", 297);
parent = parent.get("parent");
            }

        }

        _yuitest_coverline("build/widget-child/widget-child.js", 302);
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

        _yuitest_coverfunc("build/widget-child/widget-child.js", "_uiSetChildSelected", 314);
_yuitest_coverline("build/widget-child/widget-child.js", 316);
var box = this.get("boundingBox"),
            sClassName = this.getClassName("selected");

        _yuitest_coverline("build/widget-child/widget-child.js", 319);
if (selected === 0) {
            _yuitest_coverline("build/widget-child/widget-child.js", 320);
box.removeClass(sClassName);
        }
        else {
            _yuitest_coverline("build/widget-child/widget-child.js", 323);
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
        _yuitest_coverfunc("build/widget-child/widget-child.js", "_afterChildSelectedChange", 338);
_yuitest_coverline("build/widget-child/widget-child.js", 339);
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
        _yuitest_coverfunc("build/widget-child/widget-child.js", "_syncUIChild", 353);
_yuitest_coverline("build/widget-child/widget-child.js", 354);
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
        _yuitest_coverfunc("build/widget-child/widget-child.js", "_bindUIChild", 368);
_yuitest_coverline("build/widget-child/widget-child.js", 369);
this.after("selectedChange", this._afterChildSelectedChange);
    }
    
};

_yuitest_coverline("build/widget-child/widget-child.js", 374);
Y.WidgetChild = Child;

}, '3.7.3', {"requires": ["base-build", "widget"]});
