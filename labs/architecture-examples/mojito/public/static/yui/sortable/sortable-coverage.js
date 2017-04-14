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
_yuitest_coverage["build/sortable/sortable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/sortable/sortable.js",
    code: []
};
_yuitest_coverage["build/sortable/sortable.js"].code=["YUI.add('sortable', function (Y, NAME) {","","","    /**","     * The class allows you to create a Drag & Drop reordered list.","     * @module sortable","     */","    /**","     * The class allows you to create a Drag & Drop reordered list.","     * @class Sortable","     * @extends Base","     * @constructor","     */","","","    var Sortable = function() {","        Sortable.superclass.constructor.apply(this, arguments);","    },","    CURRENT_NODE = 'currentNode',","    OPACITY_NODE = 'opacityNode',","    CONT = 'container',","    ID = 'id',","    ZINDEX = 'zIndex',","    OPACITY = 'opacity',","    PARENT_NODE = 'parentNode',","    NODES = 'nodes',","    NODE = 'node';","","","    Y.extend(Sortable, Y.Base, {","        /**","        * @property delegate","        * @type DD.Delegate","        * @description A reference to the DD.Delegate instance.","        */","        delegate: null,","        /**","        * @property drop","        * @type DD.Drop","        * @description A reference to the DD.Drop instance","        */","        drop: null,","        initializer: function() {","            var id = 'sortable-' + Y.guid(),","                delConfig = {","                    container: this.get(CONT),","                    nodes: this.get(NODES),","                    target: true,","                    invalid: this.get('invalid'),","                    dragConfig: {","                        groups: [ id ]","                    }","                }, del;","","            if (this.get('handles')) {","                delConfig.handles = this.get('handles');","            }","            del = new Y.DD.Delegate(delConfig);","","            this.set(ID, id);","","            del.dd.plug(Y.Plugin.DDProxy, {","                moveOnEnd: false,","                cloneNode: true","            });","","            this.drop =  new Y.DD.Drop({","                node: this.get(CONT),","                bubbleTarget: del,","                groups: del.dd.get('groups')","            });","            this.drop.on('drop:enter', Y.bind(this._onDropEnter, this));","            ","            del.on({","                'drag:start': Y.bind(this._onDragStart, this),","                'drag:end': Y.bind(this._onDragEnd, this),","                'drag:over': Y.bind(this._onDragOver, this),","                'drag:drag': Y.bind(this._onDrag, this)","            });","","            this.delegate = del;","            Sortable.reg(this, id);","        },","        _up: null,","        _y: null,","        _onDrag: function(e) {","            if (e.pageY < this._y) {","                this._up = true;","            } else if (e.pageY > this._y) {","                this._up = false;","            }","","            this._y = e.pageY;","        },","        /**","        * @private","        * @method _onDropEnter","        * @param Event e The Event Object","        * @description Handles the DropEnter event to append a new node to a target.","        */","        _onDropEnter: function(e) {","            var dropNode = e.drop.get(NODE),","                dragNode = e.drag.get(NODE);","","            if (!dropNode.test(this.get(NODES)) &&","                !dragNode.get(PARENT_NODE).compareTo(dropNode)) {","                dropNode.append(dragNode);","            }","        },","        /**","        * @private","        * @method _onDragOver","        * @param Event e The Event Object","        * @description Handles the DragOver event that moves the object in the list or to another list.","        */","        _onDragOver: function(e) {","            if (!e.drop.get(NODE).test(this.get(NODES))) {","                return;","            }","            if (e.drag.get(NODE) === e.drop.get(NODE)) {","                return;","            }","            // is drop a child of drag?","            if (e.drag.get(NODE).contains(e.drop.get(NODE))) {","                return;","            }","            var same = false, dir, oldNode, newNode, dropsort, dropNode,","                moveType = this.get('moveType').toLowerCase();","","            if (e.drag.get(NODE).get(PARENT_NODE).contains(e.drop.get(NODE))) {","                same = true;","            }","            if (same && moveType === 'move') {","                moveType = 'insert';","            }","            switch (moveType) {","                case 'insert':","                    dir = ((this._up) ? 'before' : 'after');","                    dropNode = e.drop.get(NODE);","                    if (Y.Sortable._test(dropNode, this.get(CONT))) {","                        dropNode.append(e.drag.get(NODE));","                    } else {","                        dropNode.insert(e.drag.get(NODE), dir);","                    }","                    break;","                case 'swap':","                    Y.DD.DDM.swapNode(e.drag, e.drop);","                    break;","                case 'move':","                case 'copy':","                    dropsort = Y.Sortable.getSortable(e.drop.get(NODE).get(PARENT_NODE));","","                    if (!dropsort) {","                        return;","                    }","                    ","                    Y.DD.DDM.getDrop(e.drag.get(NODE)).addToGroup(dropsort.get(ID));","","                    //Same List","                    if (same) {","                        Y.DD.DDM.swapNode(e.drag, e.drop);","                    } else {","                        if (this.get('moveType') === 'copy') {","                            //New List","                            oldNode = e.drag.get(NODE);","                            newNode = oldNode.cloneNode(true);","","                            newNode.set(ID, '');","                            e.drag.set(NODE, newNode);","                            dropsort.delegate.createDrop(newNode, [dropsort.get(ID)]);","                            oldNode.setStyles({","                                top: '',","                                left: ''","                            });","                        }","                        e.drop.get(NODE).insert(e.drag.get(NODE), 'before');","                    }","                    break;","            }","","            this.fire(moveType, { same: same, drag: e.drag, drop: e.drop });","            this.fire('moved', { same: same, drag: e.drag, drop: e.drop });","        },","        /**","        * @private","        * @method _onDragStart","        * @param Event e The Event Object","        * @description Handles the DragStart event and initializes some settings.","        */","        _onDragStart: function() {","            var del = this.delegate,","                lastNode = del.get('lastNode');","            if (lastNode && lastNode.getDOMNode()) {","                lastNode.setStyle(ZINDEX, '');","            }","            del.get(this.get(OPACITY_NODE)).setStyle(OPACITY, this.get(OPACITY));","            del.get(CURRENT_NODE).setStyle(ZINDEX, '999');","        },","        /**","        * @private","        * @method _onDragEnd","        * @param Event e The Event Object","        * @description Handles the DragEnd event that cleans up the settings in the drag:start event.","        */","        _onDragEnd: function() {","            this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, 1);","            this.delegate.get(CURRENT_NODE).setStyles({","                top: '',","                left: ''","            });","            this.sync();","        },","        /**","        * @method plug","        * @param Class cls The class to plug","        * @param Object config The class config","        * @description Passthrough to the DD.Delegate.ddplug method","        * @chainable","        */","        plug: function(cls, config) {","            //I don't like this.. Not at all, need to discuss with the team","            if (cls && cls.NAME.substring(0, 4).toLowerCase() === 'sort') {","                this.constructor.superclass.plug.call(this, cls, config);","            } else {","                this.delegate.dd.plug(cls, config);","            }","            return this;","        },","        /**","        * @method sync","        * @description Passthrough to the DD.Delegate syncTargets method.","        * @chainable","        */","        sync: function() {","            this.delegate.syncTargets();","            return this;","        },","        destructor: function() {","            this.drop.destroy();","            this.delegate.destroy();","            Sortable.unreg(this, this.get(ID));","        },","        /**","        * @method join","        * @param Sortable sel The Sortable list to join with","        * @param String type The type of join to do: full, inner, outer, none. Default: full","        * @description Join this Sortable with another Sortable instance.","        * <ul>","        *   <li>full: Exchange nodes with both lists.</li>","        *   <li>inner: Items can go into this list from the joined list.</li>","        *   <li>outer: Items can go out of the joined list into this list.</li>","        *   <li>none: Removes the join.</li>","        * </ul>","        * @chainable","        */","        join: function(sel, type) {","            if (!(sel instanceof Y.Sortable)) {","                Y.error('Sortable: join needs a Sortable Instance');","                return this;","            }","            if (!type) {","                type = 'full';","            }","            type = type.toLowerCase();","            var method = '_join_' + type;","","            if (this[method]) {","                this[method](sel);","            }","            ","            return this;","        },","        /**","        * @private","        * @method _join_none","        * @param Sortable sel The Sortable to remove the join from","        * @description Removes the join with the passed Sortable.","        */","        _join_none: function(sel) {","            this.delegate.dd.removeFromGroup(sel.get(ID));","            sel.delegate.dd.removeFromGroup(this.get(ID));","        },","        /**","        * @private","        * @method _join_full","        * @param Sortable sel The Sortable list to join with","        * @description Joins both of the Sortables together.","        */","        _join_full: function(sel) {","            this.delegate.dd.addToGroup(sel.get(ID));","            sel.delegate.dd.addToGroup(this.get(ID));","        },","        /**","        * @private","        * @method _join_outer","        * @param Sortable sel The Sortable list to join with","        * @description Allows this Sortable to accept items from the passed Sortable.","        */","        _join_outer: function(sel) {","            this.delegate.dd.addToGroup(sel.get(ID));","        },","        /**","        * @private","        * @method _join_inner","        * @param Sortable sel The Sortable list to join with","        * @description Allows this Sortable to give items to the passed Sortable.","        */","        _join_inner: function(sel) {","            sel.delegate.dd.addToGroup(this.get(ID));","        },","        /**","        * A custom callback to allow a user to extract some sort of id or any other data","        * from the node to use in the \"ordering list\" and then that data should be returned from the callback.","        * @method getOrdering","        * @param Function callback","        * @return Array","        */","        getOrdering: function(callback) {","            var ordering = [];","","            if (!Y.Lang.isFunction(callback)) {","                callback = function (node) {","                    return node;","                };","            }","","            Y.one(this.get(CONT)).all(this.get(NODES)).each(function(node) {","                ordering.push(callback(node));","            });","            return ordering;","       }","    }, {","        NAME: 'sortable',","        ATTRS: {","            /**","            * @attribute handles","            * @description Drag handles to pass on to the internal DD.Delegate instance.","            * @type Array","            */","            handles: {","                value: false","            },","            /**","            * @attribute container","            * @description A selector query to get the container to listen for mousedown events on. All \"nodes\" should be a child of this container.","            * @type String","            */","            container: {","                value: 'body'","            },","            /**","            * @attribute nodes","            * @description A selector query to get the children of the \"container\" to make draggable elements from.","            * @type String","            */","            nodes: {","                value: '.dd-draggable'","            },","            /**","            * @attribute opacity","            * @description The opacity to change the proxy item to when dragging.","            * @type String","            */","            opacity: {","                value: '.75'","            },","            /**","            * @attribute opacityNode","            * @description The node to set opacity on when dragging (dragNode or currentNode). Default: currentNode.","            * @type String","            */","            opacityNode: {","                value: 'currentNode'","            },","            /**","            * @attribute id","            * @description The id of this Sortable, used to get a reference to this Sortable list from another list.","            * @type String","            */","            id: {","                value: null","            },","            /**","            * @attribute moveType","            * @description How should an item move to another list: insert, swap, move, copy. Default: insert","            * @type String","            */","            moveType: {","                value: 'insert'","            },","            /**","            * @attribute invalid","            * @description A selector string to test if a list item is invalid and not sortable","            * @type String","            */","            invalid: {","                value: ''","            }","        },","        /**","        * @static","        * @property _sortables","        * @private","        * @type Object","        * @description Hash map of all Sortables on the page.","        */","        _sortables: {},","        /**","        * @static","        * @method _test","        * @param {Node} node The node instance to test.","        * @param {String|Node} test The node instance or selector string to test against.","        * @description Test a Node or a selector for the container","        */","        _test: function(node, test) {","            var ret;","            if (test instanceof Y.Node) {","                ret = (test === node);","            } else {","                ret = node.test(test);","            }","            return ret;","        },","        /**","        * @static","        * @method getSortable","        * @param {String|Node} node The node instance or selector string to use to find a Sortable instance.","        * @description Get a Sortable instance back from a node reference or a selector string.","        */","        getSortable: function(node) {","            var s = null,","                id = null;","            node = Y.one(node);","            id = node.get(ID);","            if(id && Y.Sortable._sortables[id]) {","                return Y.Sortable._sortables[id];","            }","            Y.Object.each(Y.Sortable._sortables, function(v) {","                if (Y.Sortable._test(node, v.get(CONT))) {","                    s = v;","                }","            });","            return s;","        },","        /**","        * @static","        * @method reg","        * @param Sortable s A Sortable instance.","        * @param String id (optional) The id of the sortable instance.","        * @description Register a Sortable instance with the singleton to allow lookups later.","        */","        reg: function(s, id) {","            if (!id) {","                id = s.get(ID);","            }","            Y.Sortable._sortables[id] = s;","        },","        /**","        * @static","        * @method unreg","        * @param Sortable s A Sortable instance.","        * @param String id (optional) The id of the sortable instance.","        * @description Unregister a Sortable instance with the singleton.","        */","        unreg: function(s, id) {","            if (!id) {","                id = s.get(ID);","            }","            if (id && Y.Sortable._sortables[id]) {","                delete Y.Sortable._sortables[id];","                return;","            }","            Y.Object.each(Y.Sortable._sortables, function(v, k) {","                if (v === s) {","                    delete Sortable._sortables[k];","                }","            });","        }","    });","","    Y.Sortable = Sortable;","","    /**","    * @event copy","    * @description A Sortable node was moved with a copy.","    * @param {Event.Facade} event An Event Facade object","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event move","    * @description A Sortable node was moved with a move.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event insert","    * @description A Sortable node was moved with an insert.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event swap","    * @description A Sortable node was moved with a swap.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event moved","    * @description A Sortable node was moved.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","","","","}, '3.7.3', {\"requires\": [\"dd-delegate\", \"dd-drop-plugin\", \"dd-proxy\"]});"];
_yuitest_coverage["build/sortable/sortable.js"].lines = {"1":0,"16":0,"17":0,"30":0,"44":0,"55":0,"56":0,"58":0,"60":0,"62":0,"67":0,"72":0,"74":0,"81":0,"82":0,"87":0,"88":0,"89":0,"90":0,"93":0,"102":0,"105":0,"107":0,"117":0,"118":0,"120":0,"121":0,"124":0,"125":0,"127":0,"130":0,"131":0,"133":0,"134":0,"136":0,"138":0,"139":0,"140":0,"141":0,"143":0,"145":0,"147":0,"148":0,"151":0,"153":0,"154":0,"157":0,"160":0,"161":0,"163":0,"165":0,"166":0,"168":0,"169":0,"170":0,"171":0,"176":0,"178":0,"181":0,"182":0,"191":0,"193":0,"194":0,"196":0,"197":0,"206":0,"207":0,"211":0,"222":0,"223":0,"225":0,"227":0,"235":0,"236":0,"239":0,"240":0,"241":0,"257":0,"258":0,"259":0,"261":0,"262":0,"264":0,"265":0,"267":0,"268":0,"271":0,"280":0,"281":0,"290":0,"291":0,"300":0,"309":0,"319":0,"321":0,"322":0,"323":0,"327":0,"328":0,"330":0,"416":0,"417":0,"418":0,"420":0,"422":0,"431":0,"433":0,"434":0,"435":0,"436":0,"438":0,"439":0,"440":0,"443":0,"453":0,"454":0,"456":0,"466":0,"467":0,"469":0,"470":0,"471":0,"473":0,"474":0,"475":0,"481":0};
_yuitest_coverage["build/sortable/sortable.js"].functions = {"Sortable:16":0,"initializer:43":0,"_onDrag:86":0,"_onDropEnter:101":0,"_onDragOver:116":0,"_onDragStart:190":0,"_onDragEnd:205":0,"plug:220":0,"sync:234":0,"destructor:238":0,"join:256":0,"_join_none:279":0,"_join_full:289":0,"_join_outer:299":0,"_join_inner:308":0,"callback:322":0,"(anonymous 2):327":0,"getOrdering:318":0,"_test:415":0,"(anonymous 3):438":0,"getSortable:430":0,"reg:452":0,"(anonymous 4):473":0,"unreg:465":0,"(anonymous 1):1":0};
_yuitest_coverage["build/sortable/sortable.js"].coveredLines = 126;
_yuitest_coverage["build/sortable/sortable.js"].coveredFunctions = 25;
_yuitest_coverline("build/sortable/sortable.js", 1);
YUI.add('sortable', function (Y, NAME) {


    /**
     * The class allows you to create a Drag & Drop reordered list.
     * @module sortable
     */
    /**
     * The class allows you to create a Drag & Drop reordered list.
     * @class Sortable
     * @extends Base
     * @constructor
     */


    _yuitest_coverfunc("build/sortable/sortable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/sortable/sortable.js", 16);
var Sortable = function() {
        _yuitest_coverfunc("build/sortable/sortable.js", "Sortable", 16);
_yuitest_coverline("build/sortable/sortable.js", 17);
Sortable.superclass.constructor.apply(this, arguments);
    },
    CURRENT_NODE = 'currentNode',
    OPACITY_NODE = 'opacityNode',
    CONT = 'container',
    ID = 'id',
    ZINDEX = 'zIndex',
    OPACITY = 'opacity',
    PARENT_NODE = 'parentNode',
    NODES = 'nodes',
    NODE = 'node';


    _yuitest_coverline("build/sortable/sortable.js", 30);
Y.extend(Sortable, Y.Base, {
        /**
        * @property delegate
        * @type DD.Delegate
        * @description A reference to the DD.Delegate instance.
        */
        delegate: null,
        /**
        * @property drop
        * @type DD.Drop
        * @description A reference to the DD.Drop instance
        */
        drop: null,
        initializer: function() {
            _yuitest_coverfunc("build/sortable/sortable.js", "initializer", 43);
_yuitest_coverline("build/sortable/sortable.js", 44);
var id = 'sortable-' + Y.guid(),
                delConfig = {
                    container: this.get(CONT),
                    nodes: this.get(NODES),
                    target: true,
                    invalid: this.get('invalid'),
                    dragConfig: {
                        groups: [ id ]
                    }
                }, del;

            _yuitest_coverline("build/sortable/sortable.js", 55);
if (this.get('handles')) {
                _yuitest_coverline("build/sortable/sortable.js", 56);
delConfig.handles = this.get('handles');
            }
            _yuitest_coverline("build/sortable/sortable.js", 58);
del = new Y.DD.Delegate(delConfig);

            _yuitest_coverline("build/sortable/sortable.js", 60);
this.set(ID, id);

            _yuitest_coverline("build/sortable/sortable.js", 62);
del.dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: false,
                cloneNode: true
            });

            _yuitest_coverline("build/sortable/sortable.js", 67);
this.drop =  new Y.DD.Drop({
                node: this.get(CONT),
                bubbleTarget: del,
                groups: del.dd.get('groups')
            });
            _yuitest_coverline("build/sortable/sortable.js", 72);
this.drop.on('drop:enter', Y.bind(this._onDropEnter, this));
            
            _yuitest_coverline("build/sortable/sortable.js", 74);
del.on({
                'drag:start': Y.bind(this._onDragStart, this),
                'drag:end': Y.bind(this._onDragEnd, this),
                'drag:over': Y.bind(this._onDragOver, this),
                'drag:drag': Y.bind(this._onDrag, this)
            });

            _yuitest_coverline("build/sortable/sortable.js", 81);
this.delegate = del;
            _yuitest_coverline("build/sortable/sortable.js", 82);
Sortable.reg(this, id);
        },
        _up: null,
        _y: null,
        _onDrag: function(e) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_onDrag", 86);
_yuitest_coverline("build/sortable/sortable.js", 87);
if (e.pageY < this._y) {
                _yuitest_coverline("build/sortable/sortable.js", 88);
this._up = true;
            } else {_yuitest_coverline("build/sortable/sortable.js", 89);
if (e.pageY > this._y) {
                _yuitest_coverline("build/sortable/sortable.js", 90);
this._up = false;
            }}

            _yuitest_coverline("build/sortable/sortable.js", 93);
this._y = e.pageY;
        },
        /**
        * @private
        * @method _onDropEnter
        * @param Event e The Event Object
        * @description Handles the DropEnter event to append a new node to a target.
        */
        _onDropEnter: function(e) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_onDropEnter", 101);
_yuitest_coverline("build/sortable/sortable.js", 102);
var dropNode = e.drop.get(NODE),
                dragNode = e.drag.get(NODE);

            _yuitest_coverline("build/sortable/sortable.js", 105);
if (!dropNode.test(this.get(NODES)) &&
                !dragNode.get(PARENT_NODE).compareTo(dropNode)) {
                _yuitest_coverline("build/sortable/sortable.js", 107);
dropNode.append(dragNode);
            }
        },
        /**
        * @private
        * @method _onDragOver
        * @param Event e The Event Object
        * @description Handles the DragOver event that moves the object in the list or to another list.
        */
        _onDragOver: function(e) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_onDragOver", 116);
_yuitest_coverline("build/sortable/sortable.js", 117);
if (!e.drop.get(NODE).test(this.get(NODES))) {
                _yuitest_coverline("build/sortable/sortable.js", 118);
return;
            }
            _yuitest_coverline("build/sortable/sortable.js", 120);
if (e.drag.get(NODE) === e.drop.get(NODE)) {
                _yuitest_coverline("build/sortable/sortable.js", 121);
return;
            }
            // is drop a child of drag?
            _yuitest_coverline("build/sortable/sortable.js", 124);
if (e.drag.get(NODE).contains(e.drop.get(NODE))) {
                _yuitest_coverline("build/sortable/sortable.js", 125);
return;
            }
            _yuitest_coverline("build/sortable/sortable.js", 127);
var same = false, dir, oldNode, newNode, dropsort, dropNode,
                moveType = this.get('moveType').toLowerCase();

            _yuitest_coverline("build/sortable/sortable.js", 130);
if (e.drag.get(NODE).get(PARENT_NODE).contains(e.drop.get(NODE))) {
                _yuitest_coverline("build/sortable/sortable.js", 131);
same = true;
            }
            _yuitest_coverline("build/sortable/sortable.js", 133);
if (same && moveType === 'move') {
                _yuitest_coverline("build/sortable/sortable.js", 134);
moveType = 'insert';
            }
            _yuitest_coverline("build/sortable/sortable.js", 136);
switch (moveType) {
                case 'insert':
                    _yuitest_coverline("build/sortable/sortable.js", 138);
dir = ((this._up) ? 'before' : 'after');
                    _yuitest_coverline("build/sortable/sortable.js", 139);
dropNode = e.drop.get(NODE);
                    _yuitest_coverline("build/sortable/sortable.js", 140);
if (Y.Sortable._test(dropNode, this.get(CONT))) {
                        _yuitest_coverline("build/sortable/sortable.js", 141);
dropNode.append(e.drag.get(NODE));
                    } else {
                        _yuitest_coverline("build/sortable/sortable.js", 143);
dropNode.insert(e.drag.get(NODE), dir);
                    }
                    _yuitest_coverline("build/sortable/sortable.js", 145);
break;
                case 'swap':
                    _yuitest_coverline("build/sortable/sortable.js", 147);
Y.DD.DDM.swapNode(e.drag, e.drop);
                    _yuitest_coverline("build/sortable/sortable.js", 148);
break;
                case 'move':
                case 'copy':
                    _yuitest_coverline("build/sortable/sortable.js", 151);
dropsort = Y.Sortable.getSortable(e.drop.get(NODE).get(PARENT_NODE));

                    _yuitest_coverline("build/sortable/sortable.js", 153);
if (!dropsort) {
                        _yuitest_coverline("build/sortable/sortable.js", 154);
return;
                    }
                    
                    _yuitest_coverline("build/sortable/sortable.js", 157);
Y.DD.DDM.getDrop(e.drag.get(NODE)).addToGroup(dropsort.get(ID));

                    //Same List
                    _yuitest_coverline("build/sortable/sortable.js", 160);
if (same) {
                        _yuitest_coverline("build/sortable/sortable.js", 161);
Y.DD.DDM.swapNode(e.drag, e.drop);
                    } else {
                        _yuitest_coverline("build/sortable/sortable.js", 163);
if (this.get('moveType') === 'copy') {
                            //New List
                            _yuitest_coverline("build/sortable/sortable.js", 165);
oldNode = e.drag.get(NODE);
                            _yuitest_coverline("build/sortable/sortable.js", 166);
newNode = oldNode.cloneNode(true);

                            _yuitest_coverline("build/sortable/sortable.js", 168);
newNode.set(ID, '');
                            _yuitest_coverline("build/sortable/sortable.js", 169);
e.drag.set(NODE, newNode);
                            _yuitest_coverline("build/sortable/sortable.js", 170);
dropsort.delegate.createDrop(newNode, [dropsort.get(ID)]);
                            _yuitest_coverline("build/sortable/sortable.js", 171);
oldNode.setStyles({
                                top: '',
                                left: ''
                            });
                        }
                        _yuitest_coverline("build/sortable/sortable.js", 176);
e.drop.get(NODE).insert(e.drag.get(NODE), 'before');
                    }
                    _yuitest_coverline("build/sortable/sortable.js", 178);
break;
            }

            _yuitest_coverline("build/sortable/sortable.js", 181);
this.fire(moveType, { same: same, drag: e.drag, drop: e.drop });
            _yuitest_coverline("build/sortable/sortable.js", 182);
this.fire('moved', { same: same, drag: e.drag, drop: e.drop });
        },
        /**
        * @private
        * @method _onDragStart
        * @param Event e The Event Object
        * @description Handles the DragStart event and initializes some settings.
        */
        _onDragStart: function() {
            _yuitest_coverfunc("build/sortable/sortable.js", "_onDragStart", 190);
_yuitest_coverline("build/sortable/sortable.js", 191);
var del = this.delegate,
                lastNode = del.get('lastNode');
            _yuitest_coverline("build/sortable/sortable.js", 193);
if (lastNode && lastNode.getDOMNode()) {
                _yuitest_coverline("build/sortable/sortable.js", 194);
lastNode.setStyle(ZINDEX, '');
            }
            _yuitest_coverline("build/sortable/sortable.js", 196);
del.get(this.get(OPACITY_NODE)).setStyle(OPACITY, this.get(OPACITY));
            _yuitest_coverline("build/sortable/sortable.js", 197);
del.get(CURRENT_NODE).setStyle(ZINDEX, '999');
        },
        /**
        * @private
        * @method _onDragEnd
        * @param Event e The Event Object
        * @description Handles the DragEnd event that cleans up the settings in the drag:start event.
        */
        _onDragEnd: function() {
            _yuitest_coverfunc("build/sortable/sortable.js", "_onDragEnd", 205);
_yuitest_coverline("build/sortable/sortable.js", 206);
this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, 1);
            _yuitest_coverline("build/sortable/sortable.js", 207);
this.delegate.get(CURRENT_NODE).setStyles({
                top: '',
                left: ''
            });
            _yuitest_coverline("build/sortable/sortable.js", 211);
this.sync();
        },
        /**
        * @method plug
        * @param Class cls The class to plug
        * @param Object config The class config
        * @description Passthrough to the DD.Delegate.ddplug method
        * @chainable
        */
        plug: function(cls, config) {
            //I don't like this.. Not at all, need to discuss with the team
            _yuitest_coverfunc("build/sortable/sortable.js", "plug", 220);
_yuitest_coverline("build/sortable/sortable.js", 222);
if (cls && cls.NAME.substring(0, 4).toLowerCase() === 'sort') {
                _yuitest_coverline("build/sortable/sortable.js", 223);
this.constructor.superclass.plug.call(this, cls, config);
            } else {
                _yuitest_coverline("build/sortable/sortable.js", 225);
this.delegate.dd.plug(cls, config);
            }
            _yuitest_coverline("build/sortable/sortable.js", 227);
return this;
        },
        /**
        * @method sync
        * @description Passthrough to the DD.Delegate syncTargets method.
        * @chainable
        */
        sync: function() {
            _yuitest_coverfunc("build/sortable/sortable.js", "sync", 234);
_yuitest_coverline("build/sortable/sortable.js", 235);
this.delegate.syncTargets();
            _yuitest_coverline("build/sortable/sortable.js", 236);
return this;
        },
        destructor: function() {
            _yuitest_coverfunc("build/sortable/sortable.js", "destructor", 238);
_yuitest_coverline("build/sortable/sortable.js", 239);
this.drop.destroy();
            _yuitest_coverline("build/sortable/sortable.js", 240);
this.delegate.destroy();
            _yuitest_coverline("build/sortable/sortable.js", 241);
Sortable.unreg(this, this.get(ID));
        },
        /**
        * @method join
        * @param Sortable sel The Sortable list to join with
        * @param String type The type of join to do: full, inner, outer, none. Default: full
        * @description Join this Sortable with another Sortable instance.
        * <ul>
        *   <li>full: Exchange nodes with both lists.</li>
        *   <li>inner: Items can go into this list from the joined list.</li>
        *   <li>outer: Items can go out of the joined list into this list.</li>
        *   <li>none: Removes the join.</li>
        * </ul>
        * @chainable
        */
        join: function(sel, type) {
            _yuitest_coverfunc("build/sortable/sortable.js", "join", 256);
_yuitest_coverline("build/sortable/sortable.js", 257);
if (!(sel instanceof Y.Sortable)) {
                _yuitest_coverline("build/sortable/sortable.js", 258);
Y.error('Sortable: join needs a Sortable Instance');
                _yuitest_coverline("build/sortable/sortable.js", 259);
return this;
            }
            _yuitest_coverline("build/sortable/sortable.js", 261);
if (!type) {
                _yuitest_coverline("build/sortable/sortable.js", 262);
type = 'full';
            }
            _yuitest_coverline("build/sortable/sortable.js", 264);
type = type.toLowerCase();
            _yuitest_coverline("build/sortable/sortable.js", 265);
var method = '_join_' + type;

            _yuitest_coverline("build/sortable/sortable.js", 267);
if (this[method]) {
                _yuitest_coverline("build/sortable/sortable.js", 268);
this[method](sel);
            }
            
            _yuitest_coverline("build/sortable/sortable.js", 271);
return this;
        },
        /**
        * @private
        * @method _join_none
        * @param Sortable sel The Sortable to remove the join from
        * @description Removes the join with the passed Sortable.
        */
        _join_none: function(sel) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_join_none", 279);
_yuitest_coverline("build/sortable/sortable.js", 280);
this.delegate.dd.removeFromGroup(sel.get(ID));
            _yuitest_coverline("build/sortable/sortable.js", 281);
sel.delegate.dd.removeFromGroup(this.get(ID));
        },
        /**
        * @private
        * @method _join_full
        * @param Sortable sel The Sortable list to join with
        * @description Joins both of the Sortables together.
        */
        _join_full: function(sel) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_join_full", 289);
_yuitest_coverline("build/sortable/sortable.js", 290);
this.delegate.dd.addToGroup(sel.get(ID));
            _yuitest_coverline("build/sortable/sortable.js", 291);
sel.delegate.dd.addToGroup(this.get(ID));
        },
        /**
        * @private
        * @method _join_outer
        * @param Sortable sel The Sortable list to join with
        * @description Allows this Sortable to accept items from the passed Sortable.
        */
        _join_outer: function(sel) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_join_outer", 299);
_yuitest_coverline("build/sortable/sortable.js", 300);
this.delegate.dd.addToGroup(sel.get(ID));
        },
        /**
        * @private
        * @method _join_inner
        * @param Sortable sel The Sortable list to join with
        * @description Allows this Sortable to give items to the passed Sortable.
        */
        _join_inner: function(sel) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_join_inner", 308);
_yuitest_coverline("build/sortable/sortable.js", 309);
sel.delegate.dd.addToGroup(this.get(ID));
        },
        /**
        * A custom callback to allow a user to extract some sort of id or any other data
        * from the node to use in the "ordering list" and then that data should be returned from the callback.
        * @method getOrdering
        * @param Function callback
        * @return Array
        */
        getOrdering: function(callback) {
            _yuitest_coverfunc("build/sortable/sortable.js", "getOrdering", 318);
_yuitest_coverline("build/sortable/sortable.js", 319);
var ordering = [];

            _yuitest_coverline("build/sortable/sortable.js", 321);
if (!Y.Lang.isFunction(callback)) {
                _yuitest_coverline("build/sortable/sortable.js", 322);
callback = function (node) {
                    _yuitest_coverfunc("build/sortable/sortable.js", "callback", 322);
_yuitest_coverline("build/sortable/sortable.js", 323);
return node;
                };
            }

            _yuitest_coverline("build/sortable/sortable.js", 327);
Y.one(this.get(CONT)).all(this.get(NODES)).each(function(node) {
                _yuitest_coverfunc("build/sortable/sortable.js", "(anonymous 2)", 327);
_yuitest_coverline("build/sortable/sortable.js", 328);
ordering.push(callback(node));
            });
            _yuitest_coverline("build/sortable/sortable.js", 330);
return ordering;
       }
    }, {
        NAME: 'sortable',
        ATTRS: {
            /**
            * @attribute handles
            * @description Drag handles to pass on to the internal DD.Delegate instance.
            * @type Array
            */
            handles: {
                value: false
            },
            /**
            * @attribute container
            * @description A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
            * @type String
            */
            container: {
                value: 'body'
            },
            /**
            * @attribute nodes
            * @description A selector query to get the children of the "container" to make draggable elements from.
            * @type String
            */
            nodes: {
                value: '.dd-draggable'
            },
            /**
            * @attribute opacity
            * @description The opacity to change the proxy item to when dragging.
            * @type String
            */
            opacity: {
                value: '.75'
            },
            /**
            * @attribute opacityNode
            * @description The node to set opacity on when dragging (dragNode or currentNode). Default: currentNode.
            * @type String
            */
            opacityNode: {
                value: 'currentNode'
            },
            /**
            * @attribute id
            * @description The id of this Sortable, used to get a reference to this Sortable list from another list.
            * @type String
            */
            id: {
                value: null
            },
            /**
            * @attribute moveType
            * @description How should an item move to another list: insert, swap, move, copy. Default: insert
            * @type String
            */
            moveType: {
                value: 'insert'
            },
            /**
            * @attribute invalid
            * @description A selector string to test if a list item is invalid and not sortable
            * @type String
            */
            invalid: {
                value: ''
            }
        },
        /**
        * @static
        * @property _sortables
        * @private
        * @type Object
        * @description Hash map of all Sortables on the page.
        */
        _sortables: {},
        /**
        * @static
        * @method _test
        * @param {Node} node The node instance to test.
        * @param {String|Node} test The node instance or selector string to test against.
        * @description Test a Node or a selector for the container
        */
        _test: function(node, test) {
            _yuitest_coverfunc("build/sortable/sortable.js", "_test", 415);
_yuitest_coverline("build/sortable/sortable.js", 416);
var ret;
            _yuitest_coverline("build/sortable/sortable.js", 417);
if (test instanceof Y.Node) {
                _yuitest_coverline("build/sortable/sortable.js", 418);
ret = (test === node);
            } else {
                _yuitest_coverline("build/sortable/sortable.js", 420);
ret = node.test(test);
            }
            _yuitest_coverline("build/sortable/sortable.js", 422);
return ret;
        },
        /**
        * @static
        * @method getSortable
        * @param {String|Node} node The node instance or selector string to use to find a Sortable instance.
        * @description Get a Sortable instance back from a node reference or a selector string.
        */
        getSortable: function(node) {
            _yuitest_coverfunc("build/sortable/sortable.js", "getSortable", 430);
_yuitest_coverline("build/sortable/sortable.js", 431);
var s = null,
                id = null;
            _yuitest_coverline("build/sortable/sortable.js", 433);
node = Y.one(node);
            _yuitest_coverline("build/sortable/sortable.js", 434);
id = node.get(ID);
            _yuitest_coverline("build/sortable/sortable.js", 435);
if(id && Y.Sortable._sortables[id]) {
                _yuitest_coverline("build/sortable/sortable.js", 436);
return Y.Sortable._sortables[id];
            }
            _yuitest_coverline("build/sortable/sortable.js", 438);
Y.Object.each(Y.Sortable._sortables, function(v) {
                _yuitest_coverfunc("build/sortable/sortable.js", "(anonymous 3)", 438);
_yuitest_coverline("build/sortable/sortable.js", 439);
if (Y.Sortable._test(node, v.get(CONT))) {
                    _yuitest_coverline("build/sortable/sortable.js", 440);
s = v;
                }
            });
            _yuitest_coverline("build/sortable/sortable.js", 443);
return s;
        },
        /**
        * @static
        * @method reg
        * @param Sortable s A Sortable instance.
        * @param String id (optional) The id of the sortable instance.
        * @description Register a Sortable instance with the singleton to allow lookups later.
        */
        reg: function(s, id) {
            _yuitest_coverfunc("build/sortable/sortable.js", "reg", 452);
_yuitest_coverline("build/sortable/sortable.js", 453);
if (!id) {
                _yuitest_coverline("build/sortable/sortable.js", 454);
id = s.get(ID);
            }
            _yuitest_coverline("build/sortable/sortable.js", 456);
Y.Sortable._sortables[id] = s;
        },
        /**
        * @static
        * @method unreg
        * @param Sortable s A Sortable instance.
        * @param String id (optional) The id of the sortable instance.
        * @description Unregister a Sortable instance with the singleton.
        */
        unreg: function(s, id) {
            _yuitest_coverfunc("build/sortable/sortable.js", "unreg", 465);
_yuitest_coverline("build/sortable/sortable.js", 466);
if (!id) {
                _yuitest_coverline("build/sortable/sortable.js", 467);
id = s.get(ID);
            }
            _yuitest_coverline("build/sortable/sortable.js", 469);
if (id && Y.Sortable._sortables[id]) {
                _yuitest_coverline("build/sortable/sortable.js", 470);
delete Y.Sortable._sortables[id];
                _yuitest_coverline("build/sortable/sortable.js", 471);
return;
            }
            _yuitest_coverline("build/sortable/sortable.js", 473);
Y.Object.each(Y.Sortable._sortables, function(v, k) {
                _yuitest_coverfunc("build/sortable/sortable.js", "(anonymous 4)", 473);
_yuitest_coverline("build/sortable/sortable.js", 474);
if (v === s) {
                    _yuitest_coverline("build/sortable/sortable.js", 475);
delete Sortable._sortables[k];
                }
            });
        }
    });

    _yuitest_coverline("build/sortable/sortable.js", 481);
Y.Sortable = Sortable;

    /**
    * @event copy
    * @description A Sortable node was moved with a copy.
    * @param {Event.Facade} event An Event Facade object
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event move
    * @description A Sortable node was moved with a move.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event insert
    * @description A Sortable node was moved with an insert.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event swap
    * @description A Sortable node was moved with a swap.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event moved
    * @description A Sortable node was moved.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */



}, '3.7.3', {"requires": ["dd-delegate", "dd-drop-plugin", "dd-proxy"]});
