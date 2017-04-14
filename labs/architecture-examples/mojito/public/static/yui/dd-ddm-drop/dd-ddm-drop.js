/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dd-ddm-drop', function (Y, NAME) {


    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target
     * shims inside the viewport shim. It also handles all Drop Target related events and interactions.
     * @module dd
     * @submodule dd-ddm-drop
     * @for DDM
     * @namespace DD
     */

    //TODO CSS class name for the bestMatch..
    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @property _noShim
        * @description This flag turns off the use of the mouseover/mouseout shim. It should not be used unless you know what you are doing.
        * @type {Boolean}
        */
        _noShim: false,
        /**
        * @private
        * @property _activeShims
        * @description Placeholder for all active shims on the page
        * @type {Array}
        */
        _activeShims: [],
        /**
        * @private
        * @method _hasActiveShim
        * @description This method checks the _activeShims Object to see if there is a shim active.
        * @return {Boolean}
        */
        _hasActiveShim: function() {
            if (this._noShim) {
                return true;
            }
            return this._activeShims.length;
        },
        /**
        * @private
        * @method _addActiveShim
        * @description Adds a Drop Target to the list of active shims
        * @param {Object} d The Drop instance to add to the list.
        */
        _addActiveShim: function(d) {
            this._activeShims[this._activeShims.length] = d;
        },
        /**
        * @private
        * @method _removeActiveShim
        * @description Removes a Drop Target to the list of active shims
        * @param {Object} d The Drop instance to remove from the list.
        */
        _removeActiveShim: function(d) {
            var s = [];
            Y.each(this._activeShims, function(v) {
                if (v._yuid !== d._yuid) {
                    s[s.length] = v;
                }

            });
            this._activeShims = s;
        },
        /**
        * @method syncActiveShims
        * @description This method will sync the position of the shims on the Drop Targets that are currently active.
        * @param {Boolean} force Resize/sync all Targets.
        */
        syncActiveShims: function(force) {
            Y.later(0, this, function(force) {
                var drops = ((force) ? this.targets : this._lookup());
                Y.each(drops, function(v) {
                    v.sizeShim.call(v);
                }, this);
            }, force);
        },
        /**
        * @private
        * @property mode
        * @description The mode that the drag operations will run in 0 for Point, 1 for Intersect, 2 for Strict
        * @type Number
        */
        mode: 0,
        /**
        * @private
        * @property POINT
        * @description In point mode, a Drop is targeted by the cursor being over the Target
        * @type Number
        */
        POINT: 0,
        /**
        * @private
        * @property INTERSECT
        * @description In intersect mode, a Drop is targeted by "part" of the drag node being over the Target
        * @type Number
        */
        INTERSECT: 1,
        /**
        * @private
        * @property STRICT
        * @description In strict mode, a Drop is targeted by the "entire" drag node being over the Target
        * @type Number
        */
        STRICT: 2,
        /**
        * @property useHash
        * @description Should we only check targets that are in the viewport on drags (for performance), default: true
        * @type {Boolean}
        */
        useHash: true,
        /**
        * @property activeDrop
        * @description A reference to the active Drop Target
        * @type {Object}
        */
        activeDrop: null,
        /**
        * @property validDrops
        * @description An array of the valid Drop Targets for this interaction.
        * @type {Array}
        */
        //TODO Change array/object literals to be in sync..
        validDrops: [],
        /**
        * @property otherDrops
        * @description An object literal of Other Drop Targets that we encountered during this interaction (in the case of overlapping Drop Targets)
        * @type {Object}
        */
        otherDrops: {},
        /**
        * @property targets
        * @description All of the Targets
        * @type {Array}
        */
        targets: [],
        /**
        * @private
        * @method _addValid
        * @description Add a Drop Target to the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @param {Object} drop
        * @return {Self}
        * @chainable
        */
        _addValid: function(drop) {
            this.validDrops[this.validDrops.length] = drop;
            return this;
        },
        /**
        * @private
        * @method _removeValid
        * @description Removes a Drop Target from the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @param {Object} drop
        * @return {Self}
        * @chainable
        */
        _removeValid: function(drop) {
            var drops = [];
            Y.each(this.validDrops, function(v) {
                if (v !== drop) {
                    drops[drops.length] = v;
                }
            });

            this.validDrops = drops;
            return this;
        },
        /**
        * @method isOverTarget
        * @description Check to see if the Drag element is over the target, method varies on current mode
        * @param {Object} drop The drop to check against
        * @return {Boolean}
        */
        isOverTarget: function(drop) {
            if (this.activeDrag && drop) {
                var xy = this.activeDrag.mouseXY, r, dMode = this.activeDrag.get('dragMode'),
                    aRegion, node = drop.shim;
                if (xy && this.activeDrag) {
                    aRegion = this.activeDrag.region;
                    if (dMode === this.STRICT) {
                        return this.activeDrag.get('dragNode').inRegion(drop.region, true, aRegion);
                    }
                    if (drop && drop.shim) {
                        if ((dMode === this.INTERSECT) && this._noShim) {
                            r = aRegion || this.activeDrag.get('node');
                            return drop.get('node').intersect(r, drop.region).inRegion;
                        }

                        if (this._noShim) {
                            node = drop.get('node');
                        }
                        return node.intersect({
                            top: xy[1],
                            bottom: xy[1],
                            left: xy[0],
                            right: xy[0]
                        }, drop.region).inRegion;
                    }
                }
            }
            return false;
        },
        /**
        * @method clearCache
        * @description Clears the cache data used for this interaction.
        */
        clearCache: function() {
            this.validDrops = [];
            this.otherDrops = {};
            this._activeShims = [];
        },
        /**
        * @private
        * @method _activateTargets
        * @description Clear the cache and activate the shims of all the targets
        */
        _activateTargets: function() {
            this._noShim = true;
            this.clearCache();
            Y.each(this.targets, function(v) {
                v._activateShim([]);
                if (v.get('noShim') === true) {
                    this._noShim = false;
                }
            }, this);
            this._handleTargetOver();

        },
        /**
        * @method getBestMatch
        * @description This method will gather the area for all potential targets and see which has the hightest covered area and return it.
        * @param {Array} drops An Array of drops to scan for the best match.
        * @param {Boolean} all If present, it returns an Array. First item is best match, second is an Array of the other items in the original Array.
        * @return {Object or Array}
        */
        getBestMatch: function(drops, all) {
            var biggest = null, area = 0, out;

            Y.each(drops, function(v) {
                var inter = this.activeDrag.get('dragNode').intersect(v.get('node'));
                v.region.area = inter.area;

                if (inter.inRegion) {
                    if (inter.area > area) {
                        area = inter.area;
                        biggest = v;
                    }
                }
            }, this);
            if (all) {
                out = [];
                //TODO Sort the others in numeric order by area covered..
                Y.each(drops, function(v) {
                    if (v !== biggest) {
                        out[out.length] = v;
                    }
                }, this);
                return [biggest, out];
            }
            return biggest;
        },
        /**
        * @private
        * @method _deactivateTargets
        * @description This method fires the drop:hit, drag:drophit, drag:dropmiss methods and deactivates the shims..
        */
        _deactivateTargets: function() {
            var other = [], tmp,
                activeDrag = this.activeDrag,
                activeDrop = this.activeDrop;

            //TODO why is this check so hard??
            if (activeDrag && activeDrop && this.otherDrops[activeDrop]) {
                if (!activeDrag.get('dragMode')) {
                    //TODO otherDrops -- private..
                    other = this.otherDrops;
                    delete other[activeDrop];
                } else {
                    tmp = this.getBestMatch(this.otherDrops, true);
                    activeDrop = tmp[0];
                    other = tmp[1];
                }
                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');
                if (activeDrop) {
                    activeDrop.fire('drop:hit', { drag: activeDrag, drop: activeDrop, others: other });
                    activeDrag.fire('drag:drophit', { drag: activeDrag,  drop: activeDrop, others: other });
                }
            } else if (activeDrag && activeDrag.get('dragging')) {
                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');
                activeDrag.fire('drag:dropmiss', { pageX: activeDrag.lastXY[0], pageY: activeDrag.lastXY[1] });
            }

            this.activeDrop = null;

            Y.each(this.targets, function(v) {
                v._deactivateShim([]);
            }, this);
        },
        /**
        * @private
        * @method _dropMove
        * @description This method is called when the move method is called on the Drag Object.
        */
        _dropMove: function() {
            if (this._hasActiveShim()) {
                this._handleTargetOver();
            } else {
                Y.each(this.otherDrops, function(v) {
                    v._handleOut.apply(v, []);
                });
            }
        },
        /**
        * @private
        * @method _lookup
        * @description Filters the list of Drops down to those in the viewport.
        * @return {Array} The valid Drop Targets that are in the viewport.
        */
        _lookup: function() {
            if (!this.useHash || this._noShim) {
                return this.validDrops;
            }
            var drops = [];
            //Only scan drop shims that are in the Viewport
            Y.each(this.validDrops, function(v) {
                if (v.shim && v.shim.inViewportRegion(false, v.region)) {
                    drops[drops.length] = v;
                }
            });
            return drops;

        },
        /**
        * @private
        * @method _handleTargetOver
        * @description This method execs _handleTargetOver on all valid Drop Targets
        */
        _handleTargetOver: function() {
            var drops = this._lookup();
            Y.each(drops, function(v) {
                v._handleTargetOver.call(v);
            }, this);
        },
        /**
        * @private
        * @method _regTarget
        * @description Add the passed in Target to the targets collection
        * @param {Object} t The Target to add to the targets collection
        */
        _regTarget: function(t) {
            this.targets[this.targets.length] = t;
        },
        /**
        * @private
        * @method _unregTarget
        * @description Remove the passed in Target from the targets collection
        * @param {Object} drop The Target to remove from the targets collection
        */
        _unregTarget: function(drop) {
            var targets = [], vdrops;
            Y.each(this.targets, function(v) {
                if (v !== drop) {
                    targets[targets.length] = v;
                }
            }, this);
            this.targets = targets;

            vdrops = [];
            Y.each(this.validDrops, function(v) {
                if (v !== drop) {
                    vdrops[vdrops.length] = v;
                }
            });

            this.validDrops = vdrops;
        },
        /**
        * @method getDrop
        * @description Get a valid Drop instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drop Object
        * @return {Object}
        */
        getDrop: function(node) {
            var drop = false,
                n = Y.one(node);
            if (n instanceof Y.Node) {
                Y.each(this.targets, function(v) {
                    if (n.compareTo(v.get('node'))) {
                        drop = v;
                    }
                });
            }
            return drop;
        }
    }, true);




}, '3.7.3', {"requires": ["dd-ddm"]});
