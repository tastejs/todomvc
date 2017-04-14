/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dd-ddm-base', function (Y, NAME) {


    /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @module dd
     * @submodule dd-ddm-base
     */
     /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @class DDM
     * @extends Base
     * @constructor
     * @namespace DD
     */

    var DDMBase = function() {
        DDMBase.superclass.constructor.apply(this, arguments);
    };

    DDMBase.NAME = 'ddm';

    DDMBase.ATTRS = {
        /**
        * @attribute dragCursor
        * @description The cursor to apply when dragging, if shimmed the shim will get the cursor.
        * @type String
        */
        dragCursor: {
            value: 'move'
        },
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: 3
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */
        clickTimeThresh: {
            value: 1000
        },
        /**
        * @attribute throttleTime
        * @description The number of milliseconds to throttle the mousemove event. Default: 150
        * @type Number
        */
        throttleTime: {
            //value: 150
            value: -1
        },
        /**
        * This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of all future Drag instances.
        * @attribute dragMode
        * @type String
        */
        dragMode: {
            value: 'point',
            setter: function(mode) {
                this._setDragMode(mode);
                return mode;
            }
        }

    };

    Y.extend(DDMBase, Y.Base, {
        _createPG: function() {},
        /**
        * @property _active
        * @description flag set when we activate our first drag, so DDM can start listening for events.
        * @type {Boolean}
        */
        _active: null,
        /**
        * @private
        * @method _setDragMode
        * @description Handler for dragMode attribute setter.
        * @param String/Number The Number value or the String for the DragMode to default all future drag instances to.
        * @return Number The Mode to be set
        */
        _setDragMode: function(mode) {
            if (mode === null) {
                mode = Y.DD.DDM.get('dragMode');
            }
            switch (mode) {
                case 1:
                case 'intersect':
                    return 1;
                case 2:
                case 'strict':
                    return 2;
                case 0:
                case 'point':
                    return 0;
            }
            return 0;
        },
        /**
        * @property CSS_PREFIX
        * @description The PREFIX to attach to all DD CSS class names
        * @type {String}
        */
        CSS_PREFIX: Y.ClassNameManager.getClassName('dd'),
        _activateTargets: function() {},
        /**
        * @private
        * @property _drags
        * @description Holder for all registered drag elements.
        * @type {Array}
        */
        _drags: [],
        /**
        * @property activeDrag
        * @description A reference to the currently active draggable object.
        * @type {Drag}
        */
        activeDrag: false,
        /**
        * @private
        * @method _regDrag
        * @description Adds a reference to the drag object to the DDM._drags array, called in the constructor of Drag.
        * @param {Drag} d The Drag object
        */
        _regDrag: function(d) {
            if (this.getDrag(d.get('node'))) {
                return false;
            }

            if (!this._active) {
                this._setupListeners();
            }
            this._drags.push(d);
            return true;
        },
        /**
        * @private
        * @method _unregDrag
        * @description Remove this drag object from the DDM._drags array.
        * @param {Drag} d The drag object.
        */
        _unregDrag: function(d) {
            var tmp = [];
            Y.each(this._drags, function(n) {
                if (n !== d) {
                    tmp[tmp.length] = n;
                }
            });
            this._drags = tmp;
        },
        /**
        * @private
        * @method _setupListeners
        * @description Add the document listeners.
        */
        _setupListeners: function() {
            this._createPG();
            this._active = true;

            var doc = Y.one(Y.config.doc);
            doc.on('mousemove', Y.throttle(Y.bind(this._docMove, this), this.get('throttleTime')));
            doc.on('mouseup', Y.bind(this._end, this));
        },
        /**
        * @private
        * @method _start
        * @description Internal method used by Drag to signal the start of a drag operation
        */
        _start: function() {
            this.fire('ddm:start');
            this._startDrag();
        },
        /**
        * @private
        * @method _startDrag
        * @description Factory method to be overwritten by other DDM's
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        _startDrag: function() {},
        /**
        * @private
        * @method _endDrag
        * @description Factory method to be overwritten by other DDM's
        */
        _endDrag: function() {},
        _dropMove: function() {},
        /**
        * @private
        * @method _end
        * @description Internal method used by Drag to signal the end of a drag operation
        */
        _end: function() {
            if (this.activeDrag) {
                this._shimming = false;
                this._endDrag();
                this.fire('ddm:end');
                this.activeDrag.end.call(this.activeDrag);
                this.activeDrag = null;
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        * @chainable
        */
        stopDrag: function() {
            if (this.activeDrag) {
                this._end();
            }
            return this;
        },
        /**
        * @private
        * @property _shimming
        * @description Set to true when drag starts and useShim is true. Used in pairing with _docMove
        * @see _docMove
        * @type {Boolean}
        */
        _shimming: false,
        /**
        * @private
        * @method _docMove
        * @description Internal listener for the mousemove on Document. Checks if the shim is in place to only call _move once per mouse move
        * @param {Event.Facade} ev The Dom mousemove Event
        */
        _docMove: function(ev) {
            if (!this._shimming) {
                this._move(ev);
            }
        },
        /**
        * @private
        * @method _move
        * @description Internal listener for the mousemove DOM event to pass to the Drag's move method.
        * @param {Event.Facade} ev The Dom mousemove Event
        */
        _move: function(ev) {
            if (this.activeDrag) {
                this.activeDrag._move.call(this.activeDrag, ev);
                this._dropMove();
            }
        },
        /**
        * //TODO Private, rename??...
        * Helper method to use to set the gutter from the attribute setter.
        * CSS style string for gutter: '5 0' (sets top and bottom to 5px, left and right to 0px), '1 2 3 4' (top 1px, right 2px, bottom 3px, left 4px)
        * @private
        * @method cssSizestoObject
        * @param {String} gutter CSS style string for gutter
        * @return {Object} The gutter Object Literal.
        */
        cssSizestoObject: function(gutter) {
            var x = gutter.split(' ');

            switch (x.length) {
                case 1: x[1] = x[2] = x[3] = x[0]; break;
                case 2: x[2] = x[0]; x[3] = x[1]; break;
                case 3: x[3] = x[1]; break;
            }

            return {
                top   : parseInt(x[0],10),
                right : parseInt(x[1],10),
                bottom: parseInt(x[2],10),
                left  : parseInt(x[3],10)
            };
        },
        /**
        * @method getDrag
        * @description Get a valid Drag instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drag Object
        * @return {Object}
        */
        getDrag: function(node) {
            var drag = false,
                n = Y.one(node);
            if (n instanceof Y.Node) {
                Y.each(this._drags, function(v) {
                    if (n.compareTo(v.get('node'))) {
                        drag = v;
                    }
                });
            }
            return drag;
        },
        /**
        * @method swapPosition
        * @description Swap the position of 2 nodes based on their CSS positioning.
        * @param {Node} n1 The first node to swap
        * @param {Node} n2 The first node to swap
        * @return {Node}
        */
        swapPosition: function(n1, n2) {
            n1 = Y.DD.DDM.getNode(n1);
            n2 = Y.DD.DDM.getNode(n2);
            var xy1 = n1.getXY(),
                xy2 = n2.getXY();

            n1.setXY(xy2);
            n2.setXY(xy1);
            return n1;
        },
        /**
        * @method getNode
        * @description Return a node instance from the given node, selector string or Y.Base extended object.
        * @param {Node/Object/String} n The node to resolve.
        * @return {Node}
        */
        getNode: function(n) {
            if (n instanceof Y.Node) {
                return n;
            }
            if (n && n.get) {
                if (Y.Widget && (n instanceof Y.Widget)) {
                    n = n.get('boundingBox');
                } else {
                    n = n.get('node');
                }
            } else {
                n = Y.one(n);
            }
            return n;
        },
        /**
        * @method swapNode
        * @description Swap the position of 2 nodes based on their DOM location.
        * @param {Node} n1 The first node to swap
        * @param {Node} n2 The first node to swap
        * @return {Node}
        */
        swapNode: function(n1, n2) {
            n1 = Y.DD.DDM.getNode(n1);
            n2 = Y.DD.DDM.getNode(n2);
            var p = n2.get('parentNode'),
                s = n2.get('nextSibling');

            if (s === n1) {
                p.insertBefore(n1, n2);
            } else if (n2 === n1.get('nextSibling')) {
                p.insertBefore(n2, n1);
            } else {
                n1.get('parentNode').replaceChild(n2, n1);
                p.insertBefore(n1, s);
            }
            return n1;
        }
    });

    Y.namespace('DD');
    Y.DD.DDM = new DDMBase();

    /**
    * @event ddm:start
    * @description Fires from the DDM before all drag events fire.
    * @type {CustomEvent}
    */
    /**
    * @event ddm:end
    * @description Fires from the DDM after the DDM finishes, before the drag end events.
    * @type {CustomEvent}
    */




}, '3.7.3', {"requires": ["node", "base", "yui-throttle", "classnamemanager"]});
