/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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


    var Sortable = function() {
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

            if (this.get('handles')) {
                delConfig.handles = this.get('handles');
            }
            del = new Y.DD.Delegate(delConfig);

            this.set(ID, id);

            del.dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: false,
                cloneNode: true
            });

            this.drop =  new Y.DD.Drop({
                node: this.get(CONT),
                bubbleTarget: del,
                groups: del.dd.get('groups')
            });
            this.drop.on('drop:enter', Y.bind(this._onDropEnter, this));
            
            del.on({
                'drag:start': Y.bind(this._onDragStart, this),
                'drag:end': Y.bind(this._onDragEnd, this),
                'drag:over': Y.bind(this._onDragOver, this),
                'drag:drag': Y.bind(this._onDrag, this)
            });

            this.delegate = del;
            Sortable.reg(this, id);
        },
        _up: null,
        _y: null,
        _onDrag: function(e) {
            if (e.pageY < this._y) {
                this._up = true;
            } else if (e.pageY > this._y) {
                this._up = false;
            }

            this._y = e.pageY;
        },
        /**
        * @private
        * @method _onDropEnter
        * @param Event e The Event Object
        * @description Handles the DropEnter event to append a new node to a target.
        */
        _onDropEnter: function(e) {
            var dropNode = e.drop.get(NODE),
                dragNode = e.drag.get(NODE);

            if (!dropNode.test(this.get(NODES)) &&
                !dragNode.get(PARENT_NODE).compareTo(dropNode)) {
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
            if (!e.drop.get(NODE).test(this.get(NODES))) {
                return;
            }
            if (e.drag.get(NODE) === e.drop.get(NODE)) {
                return;
            }
            // is drop a child of drag?
            if (e.drag.get(NODE).contains(e.drop.get(NODE))) {
                return;
            }
            var same = false, dir, oldNode, newNode, dropsort, dropNode,
                moveType = this.get('moveType').toLowerCase();

            if (e.drag.get(NODE).get(PARENT_NODE).contains(e.drop.get(NODE))) {
                same = true;
            }
            if (same && moveType === 'move') {
                moveType = 'insert';
            }
            switch (moveType) {
                case 'insert':
                    dir = ((this._up) ? 'before' : 'after');
                    dropNode = e.drop.get(NODE);
                    if (Y.Sortable._test(dropNode, this.get(CONT))) {
                        dropNode.append(e.drag.get(NODE));
                    } else {
                        dropNode.insert(e.drag.get(NODE), dir);
                    }
                    break;
                case 'swap':
                    Y.DD.DDM.swapNode(e.drag, e.drop);
                    break;
                case 'move':
                case 'copy':
                    dropsort = Y.Sortable.getSortable(e.drop.get(NODE).get(PARENT_NODE));

                    if (!dropsort) {
                        Y.log('No delegate parent found', 'error', 'sortable');
                        return;
                    }
                    
                    Y.DD.DDM.getDrop(e.drag.get(NODE)).addToGroup(dropsort.get(ID));

                    //Same List
                    if (same) {
                        Y.DD.DDM.swapNode(e.drag, e.drop);
                    } else {
                        if (this.get('moveType') === 'copy') {
                            //New List
                            oldNode = e.drag.get(NODE);
                            newNode = oldNode.cloneNode(true);

                            newNode.set(ID, '');
                            e.drag.set(NODE, newNode);
                            dropsort.delegate.createDrop(newNode, [dropsort.get(ID)]);
                            oldNode.setStyles({
                                top: '',
                                left: ''
                            });
                        }
                        e.drop.get(NODE).insert(e.drag.get(NODE), 'before');
                    }
                    break;
            }

            this.fire(moveType, { same: same, drag: e.drag, drop: e.drop });
            this.fire('moved', { same: same, drag: e.drag, drop: e.drop });
        },
        /**
        * @private
        * @method _onDragStart
        * @param Event e The Event Object
        * @description Handles the DragStart event and initializes some settings.
        */
        _onDragStart: function() {
            var del = this.delegate,
                lastNode = del.get('lastNode');
            if (lastNode && lastNode.getDOMNode()) {
                lastNode.setStyle(ZINDEX, '');
            }
            del.get(this.get(OPACITY_NODE)).setStyle(OPACITY, this.get(OPACITY));
            del.get(CURRENT_NODE).setStyle(ZINDEX, '999');
        },
        /**
        * @private
        * @method _onDragEnd
        * @param Event e The Event Object
        * @description Handles the DragEnd event that cleans up the settings in the drag:start event.
        */
        _onDragEnd: function() {
            this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, 1);
            this.delegate.get(CURRENT_NODE).setStyles({
                top: '',
                left: ''
            });
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
            if (cls && cls.NAME.substring(0, 4).toLowerCase() === 'sort') {
                this.constructor.superclass.plug.call(this, cls, config);
            } else {
                this.delegate.dd.plug(cls, config);
            }
            return this;
        },
        /**
        * @method sync
        * @description Passthrough to the DD.Delegate syncTargets method.
        * @chainable
        */
        sync: function() {
            this.delegate.syncTargets();
            return this;
        },
        destructor: function() {
            this.drop.destroy();
            this.delegate.destroy();
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
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: join needs a Sortable Instance');
                return this;
            }
            if (!type) {
                type = 'full';
            }
            type = type.toLowerCase();
            var method = '_join_' + type;

            if (this[method]) {
                this[method](sel);
            }
            
            return this;
        },
        /**
        * @private
        * @method _join_none
        * @param Sortable sel The Sortable to remove the join from
        * @description Removes the join with the passed Sortable.
        */
        _join_none: function(sel) {
            this.delegate.dd.removeFromGroup(sel.get(ID));
            sel.delegate.dd.removeFromGroup(this.get(ID));
        },
        /**
        * @private
        * @method _join_full
        * @param Sortable sel The Sortable list to join with
        * @description Joins both of the Sortables together.
        */
        _join_full: function(sel) {
            this.delegate.dd.addToGroup(sel.get(ID));
            sel.delegate.dd.addToGroup(this.get(ID));
        },
        /**
        * @private
        * @method _join_outer
        * @param Sortable sel The Sortable list to join with
        * @description Allows this Sortable to accept items from the passed Sortable.
        */
        _join_outer: function(sel) {
            this.delegate.dd.addToGroup(sel.get(ID));
        },
        /**
        * @private
        * @method _join_inner
        * @param Sortable sel The Sortable list to join with
        * @description Allows this Sortable to give items to the passed Sortable.
        */
        _join_inner: function(sel) {
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
            var ordering = [];

            if (!Y.Lang.isFunction(callback)) {
                callback = function (node) {
                    return node;
                };
            }

            Y.one(this.get(CONT)).all(this.get(NODES)).each(function(node) {
                ordering.push(callback(node));
            });
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
            var ret;
            if (test instanceof Y.Node) {
                ret = (test === node);
            } else {
                ret = node.test(test);
            }
            return ret;
        },
        /**
        * @static
        * @method getSortable
        * @param {String|Node} node The node instance or selector string to use to find a Sortable instance.
        * @description Get a Sortable instance back from a node reference or a selector string.
        */
        getSortable: function(node) {
            var s = null,
                id = null;
            node = Y.one(node);
            id = node.get(ID);
            if(id && Y.Sortable._sortables[id]) {
                return Y.Sortable._sortables[id];
            }
            Y.Object.each(Y.Sortable._sortables, function(v) {
                if (Y.Sortable._test(node, v.get(CONT))) {
                    s = v;
                }
            });
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
            if (!id) {
                id = s.get(ID);
            }
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
            if (!id) {
                id = s.get(ID);
            }
            if (id && Y.Sortable._sortables[id]) {
                delete Y.Sortable._sortables[id];
                return;
            }
            Y.Object.each(Y.Sortable._sortables, function(v, k) {
                if (v === s) {
                    delete Sortable._sortables[k];
                }
            });
        }
    });

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
