/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dd-delegate', function (Y, NAME) {


    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @module dd
     * @submodule dd-delegate
     */
    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @class Delegate
     * @extends Base
     * @constructor
     * @namespace DD
     */


    var Delegate = function() {
        Delegate.superclass.constructor.apply(this, arguments);
    },
    CONT = 'container',
    NODES = 'nodes',
    _tmpNode = Y.Node.create('<div>Temp Node</div>');


    Y.extend(Delegate, Y.Base, {
        /**
        * @private
        * @property _bubbleTargets
        * @description The default bubbleTarget for this object. Default: Y.DD.DDM
        */
        _bubbleTargets: Y.DD.DDM,
        /**
        * @property dd
        * @description A reference to the temporary dd instance used under the hood.
        */
        dd: null,
        /**
        * @property _shimState
        * @private
        * @description The state of the Y.DD.DDM._noShim property to it can be reset.
        */
        _shimState: null,
        /**
        * @private
        * @property _handles
        * @description Array of event handles to be destroyed
        */
        _handles: null,
        /**
        * @private
        * @method _onNodeChange
        * @description Listens to the nodeChange event and sets the dragNode on the temp dd instance.
        * @param {Event} e The Event.
        */
        _onNodeChange: function(e) {
            this.set('dragNode', e.newVal);
        },
        /**
        * @private
        * @method _afterDragEnd
        * @description Listens for the drag:end event and updates the temp dd instance.
        * @param {Event} e The Event.
        */
        _afterDragEnd: function() {
            Y.DD.DDM._noShim = this._shimState;

            this.set('lastNode', this.dd.get('node'));
            this.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');
            this.dd._unprep();
            this.dd.set('node', _tmpNode);
        },
        /**
        * @private
        * @method _delMouseDown
        * @description The callback for the Y.DD.Delegate instance used
        * @param {Event} e The MouseDown Event.
        */
        _delMouseDown: function(e) {
            var tar = e.currentTarget,
                dd = this.dd,
                dNode = tar,
                config = this.get('dragConfig');

            if (tar.test(this.get(NODES)) && !tar.test(this.get('invalid'))) {
                this._shimState = Y.DD.DDM._noShim;
                Y.DD.DDM._noShim = true;
                this.set('currentNode', tar);
                dd.set('node', tar);
                if (config && config.dragNode) {
                    dNode = config.dragNode;
                } else if (dd.proxy) {
                    dNode = Y.DD.DDM._proxy;
                }
                dd.set('dragNode', dNode);
                dd._prep();

                dd.fire('drag:mouseDown', { ev: e });
            }
        },
        /**
        * @private
        * @method _onMouseEnter
        * @description Sets the target shim state
        * @param {Event} e The MouseEnter Event
        */
        _onMouseEnter: function() {
            this._shimState = Y.DD.DDM._noShim;
            Y.DD.DDM._noShim = true;
        },
        /**
        * @private
        * @method _onMouseLeave
        * @description Resets the target shim state
        * @param {Event} e The MouseLeave Event
        */
        _onMouseLeave: function() {
            Y.DD.DDM._noShim = this._shimState;
        },
        initializer: function() {
            this._handles = [];
            //Create a tmp DD instance under the hood.
            //var conf = Y.clone(this.get('dragConfig') || {}),
            var conf = this.get('dragConfig') || {},
                cont = this.get(CONT);

            conf.node = _tmpNode.cloneNode(true);
            conf.bubbleTargets = this;

            if (this.get('handles')) {
                conf.handles = this.get('handles');
            }

            this.dd = new Y.DD.Drag(conf);

            //On end drag, detach the listeners
            this.dd.after('drag:end', Y.bind(this._afterDragEnd, this));
            this.dd.on('dragNodeChange', Y.bind(this._onNodeChange, this));
            this.dd.after('drag:mouseup', function() {
                this._unprep();
            });

            //Attach the delegate to the container
            this._handles.push(Y.delegate(Y.DD.Drag.START_EVENT, Y.bind(this._delMouseDown, this), cont, this.get(NODES)));

            this._handles.push(Y.on('mouseenter', Y.bind(this._onMouseEnter, this), cont));

            this._handles.push(Y.on('mouseleave', Y.bind(this._onMouseLeave, this), cont));

            Y.later(50, this, this.syncTargets);
            Y.DD.DDM.regDelegate(this);
        },
        /**
        * @method syncTargets
        * @description Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.
        * @return {Self}
        * @chainable
        */
        syncTargets: function() {
            if (!Y.Plugin.Drop || this.get('destroyed')) {
                return;
            }
            var items, groups, config;

            if (this.get('target')) {
                items = Y.one(this.get(CONT)).all(this.get(NODES));
                groups = this.dd.get('groups');
                config = this.get('dragConfig');

                if (config && config.groups) {
                    groups = config.groups;
                }

                items.each(function(i) {
                    this.createDrop(i, groups);
                }, this);
            }
            return this;
        },
        /**
        * @method createDrop
        * @description Apply the Drop plugin to this node
        * @param {Node} node The Node to apply the plugin to
        * @param {Array} groups The default groups to assign this target to.
        * @return Node
        */
        createDrop: function(node, groups) {
            var config = {
                useShim: false,
                bubbleTargets: this
            };

            if (!node.drop) {
                node.plug(Y.Plugin.Drop, config);
            }
            node.drop.set('groups', groups);
            return node;
        },
        destructor: function() {
            if (this.dd) {
                this.dd.destroy();
            }
            if (Y.Plugin.Drop) {
                var targets = Y.one(this.get(CONT)).all(this.get(NODES));
                targets.unplug(Y.Plugin.Drop);
            }
            Y.each(this._handles, function(v) {
                v.detach();
            });
        }
    }, {
        NAME: 'delegate',
        ATTRS: {
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
            * @attribute invalid
            * @description A selector query to test a node to see if it's an invalid item.
            * @type String
            */
            invalid: {
                value: 'input, select, button, a, textarea'
            },
            /**
            * @attribute lastNode
            * @description Y.Node instance of the last item dragged.
            * @type Node
            */
            lastNode: {
                value: _tmpNode
            },
            /**
            * @attribute currentNode
            * @description Y.Node instance of the dd node.
            * @type Node
            */
            currentNode: {
                value: _tmpNode
            },
            /**
            * @attribute dragNode
            * @description Y.Node instance of the dd dragNode.
            * @type Node
            */
            dragNode: {
                value: _tmpNode
            },
            /**
            * @attribute over
            * @description Is the mouse currently over the container
            * @type Boolean
            */
            over: {
                value: false
            },
            /**
            * @attribute target
            * @description Should the items also be a drop target.
            * @type Boolean
            */
            target: {
                value: false
            },
            /**
            * @attribute dragConfig
            * @description The default config to be used when creating the DD instance.
            * @type Object
            */
            dragConfig: {
                value: null
            },
            /**
            * @attribute handles
            * @description The handles config option added to the temp DD instance.
            * @type Array
            */
            handles: {
                value: null
            }
        }
    });

    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @for DDM
        * @property _delegates
        * @description Holder for all Y.DD.Delegate instances
        * @type Array
        */
        _delegates: [],
        /**
        * @for DDM
        * @method regDelegate
        * @description Register a Delegate with the DDM
        */
        regDelegate: function(del) {
            this._delegates.push(del);
        },
        /**
        * @for DDM
        * @method getDelegate
        * @description Get a delegate instance from a container node
        * @return Y.DD.Delegate
        */
        getDelegate: function(node) {
            var del = null;
            node = Y.one(node);
            Y.each(this._delegates, function(v) {
                if (node.test(v.get(CONT))) {
                    del = v;
                }
            }, this);
            return del;
        }
    });

    Y.namespace('DD');
    Y.DD.Delegate = Delegate;




}, '3.7.3', {"requires": ["dd-drag", "dd-drop-plugin", "event-mouseenter"]});
