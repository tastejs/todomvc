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
_yuitest_coverage["build/dd-ddm-drop/dd-ddm-drop.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-ddm-drop/dd-ddm-drop.js",
    code: []
};
_yuitest_coverage["build/dd-ddm-drop/dd-ddm-drop.js"].code=["YUI.add('dd-ddm-drop', function (Y, NAME) {","","","    /**","     * Extends the dd-ddm Class to add support for the placement of Drop Target","     * shims inside the viewport shim. It also handles all Drop Target related events and interactions.","     * @module dd","     * @submodule dd-ddm-drop","     * @for DDM","     * @namespace DD","     */","","    //TODO CSS class name for the bestMatch..","    Y.mix(Y.DD.DDM, {","        /**","        * @private","        * @property _noShim","        * @description This flag turns off the use of the mouseover/mouseout shim. It should not be used unless you know what you are doing.","        * @type {Boolean}","        */","        _noShim: false,","        /**","        * @private","        * @property _activeShims","        * @description Placeholder for all active shims on the page","        * @type {Array}","        */","        _activeShims: [],","        /**","        * @private","        * @method _hasActiveShim","        * @description This method checks the _activeShims Object to see if there is a shim active.","        * @return {Boolean}","        */","        _hasActiveShim: function() {","            if (this._noShim) {","                return true;","            }","            return this._activeShims.length;","        },","        /**","        * @private","        * @method _addActiveShim","        * @description Adds a Drop Target to the list of active shims","        * @param {Object} d The Drop instance to add to the list.","        */","        _addActiveShim: function(d) {","            this._activeShims[this._activeShims.length] = d;","        },","        /**","        * @private","        * @method _removeActiveShim","        * @description Removes a Drop Target to the list of active shims","        * @param {Object} d The Drop instance to remove from the list.","        */","        _removeActiveShim: function(d) {","            var s = [];","            Y.each(this._activeShims, function(v) {","                if (v._yuid !== d._yuid) {","                    s[s.length] = v;","                }","","            });","            this._activeShims = s;","        },","        /**","        * @method syncActiveShims","        * @description This method will sync the position of the shims on the Drop Targets that are currently active.","        * @param {Boolean} force Resize/sync all Targets.","        */","        syncActiveShims: function(force) {","            Y.later(0, this, function(force) {","                var drops = ((force) ? this.targets : this._lookup());","                Y.each(drops, function(v) {","                    v.sizeShim.call(v);","                }, this);","            }, force);","        },","        /**","        * @private","        * @property mode","        * @description The mode that the drag operations will run in 0 for Point, 1 for Intersect, 2 for Strict","        * @type Number","        */","        mode: 0,","        /**","        * @private","        * @property POINT","        * @description In point mode, a Drop is targeted by the cursor being over the Target","        * @type Number","        */","        POINT: 0,","        /**","        * @private","        * @property INTERSECT","        * @description In intersect mode, a Drop is targeted by \"part\" of the drag node being over the Target","        * @type Number","        */","        INTERSECT: 1,","        /**","        * @private","        * @property STRICT","        * @description In strict mode, a Drop is targeted by the \"entire\" drag node being over the Target","        * @type Number","        */","        STRICT: 2,","        /**","        * @property useHash","        * @description Should we only check targets that are in the viewport on drags (for performance), default: true","        * @type {Boolean}","        */","        useHash: true,","        /**","        * @property activeDrop","        * @description A reference to the active Drop Target","        * @type {Object}","        */","        activeDrop: null,","        /**","        * @property validDrops","        * @description An array of the valid Drop Targets for this interaction.","        * @type {Array}","        */","        //TODO Change array/object literals to be in sync..","        validDrops: [],","        /**","        * @property otherDrops","        * @description An object literal of Other Drop Targets that we encountered during this interaction (in the case of overlapping Drop Targets)","        * @type {Object}","        */","        otherDrops: {},","        /**","        * @property targets","        * @description All of the Targets","        * @type {Array}","        */","        targets: [],","        /**","        * @private","        * @method _addValid","        * @description Add a Drop Target to the list of Valid Targets. This list get's regenerated on each new drag operation.","        * @param {Object} drop","        * @return {Self}","        * @chainable","        */","        _addValid: function(drop) {","            this.validDrops[this.validDrops.length] = drop;","            return this;","        },","        /**","        * @private","        * @method _removeValid","        * @description Removes a Drop Target from the list of Valid Targets. This list get's regenerated on each new drag operation.","        * @param {Object} drop","        * @return {Self}","        * @chainable","        */","        _removeValid: function(drop) {","            var drops = [];","            Y.each(this.validDrops, function(v) {","                if (v !== drop) {","                    drops[drops.length] = v;","                }","            });","","            this.validDrops = drops;","            return this;","        },","        /**","        * @method isOverTarget","        * @description Check to see if the Drag element is over the target, method varies on current mode","        * @param {Object} drop The drop to check against","        * @return {Boolean}","        */","        isOverTarget: function(drop) {","            if (this.activeDrag && drop) {","                var xy = this.activeDrag.mouseXY, r, dMode = this.activeDrag.get('dragMode'),","                    aRegion, node = drop.shim;","                if (xy && this.activeDrag) {","                    aRegion = this.activeDrag.region;","                    if (dMode === this.STRICT) {","                        return this.activeDrag.get('dragNode').inRegion(drop.region, true, aRegion);","                    }","                    if (drop && drop.shim) {","                        if ((dMode === this.INTERSECT) && this._noShim) {","                            r = aRegion || this.activeDrag.get('node');","                            return drop.get('node').intersect(r, drop.region).inRegion;","                        }","","                        if (this._noShim) {","                            node = drop.get('node');","                        }","                        return node.intersect({","                            top: xy[1],","                            bottom: xy[1],","                            left: xy[0],","                            right: xy[0]","                        }, drop.region).inRegion;","                    }","                }","            }","            return false;","        },","        /**","        * @method clearCache","        * @description Clears the cache data used for this interaction.","        */","        clearCache: function() {","            this.validDrops = [];","            this.otherDrops = {};","            this._activeShims = [];","        },","        /**","        * @private","        * @method _activateTargets","        * @description Clear the cache and activate the shims of all the targets","        */","        _activateTargets: function() {","            this._noShim = true;","            this.clearCache();","            Y.each(this.targets, function(v) {","                v._activateShim([]);","                if (v.get('noShim') === true) {","                    this._noShim = false;","                }","            }, this);","            this._handleTargetOver();","","        },","        /**","        * @method getBestMatch","        * @description This method will gather the area for all potential targets and see which has the hightest covered area and return it.","        * @param {Array} drops An Array of drops to scan for the best match.","        * @param {Boolean} all If present, it returns an Array. First item is best match, second is an Array of the other items in the original Array.","        * @return {Object or Array}","        */","        getBestMatch: function(drops, all) {","            var biggest = null, area = 0, out;","","            Y.each(drops, function(v) {","                var inter = this.activeDrag.get('dragNode').intersect(v.get('node'));","                v.region.area = inter.area;","","                if (inter.inRegion) {","                    if (inter.area > area) {","                        area = inter.area;","                        biggest = v;","                    }","                }","            }, this);","            if (all) {","                out = [];","                //TODO Sort the others in numeric order by area covered..","                Y.each(drops, function(v) {","                    if (v !== biggest) {","                        out[out.length] = v;","                    }","                }, this);","                return [biggest, out];","            }","            return biggest;","        },","        /**","        * @private","        * @method _deactivateTargets","        * @description This method fires the drop:hit, drag:drophit, drag:dropmiss methods and deactivates the shims..","        */","        _deactivateTargets: function() {","            var other = [], tmp,","                activeDrag = this.activeDrag,","                activeDrop = this.activeDrop;","","            //TODO why is this check so hard??","            if (activeDrag && activeDrop && this.otherDrops[activeDrop]) {","                if (!activeDrag.get('dragMode')) {","                    //TODO otherDrops -- private..","                    other = this.otherDrops;","                    delete other[activeDrop];","                } else {","                    tmp = this.getBestMatch(this.otherDrops, true);","                    activeDrop = tmp[0];","                    other = tmp[1];","                }","                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');","                if (activeDrop) {","                    activeDrop.fire('drop:hit', { drag: activeDrag, drop: activeDrop, others: other });","                    activeDrag.fire('drag:drophit', { drag: activeDrag,  drop: activeDrop, others: other });","                }","            } else if (activeDrag && activeDrag.get('dragging')) {","                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');","                activeDrag.fire('drag:dropmiss', { pageX: activeDrag.lastXY[0], pageY: activeDrag.lastXY[1] });","            }","","            this.activeDrop = null;","","            Y.each(this.targets, function(v) {","                v._deactivateShim([]);","            }, this);","        },","        /**","        * @private","        * @method _dropMove","        * @description This method is called when the move method is called on the Drag Object.","        */","        _dropMove: function() {","            if (this._hasActiveShim()) {","                this._handleTargetOver();","            } else {","                Y.each(this.otherDrops, function(v) {","                    v._handleOut.apply(v, []);","                });","            }","        },","        /**","        * @private","        * @method _lookup","        * @description Filters the list of Drops down to those in the viewport.","        * @return {Array} The valid Drop Targets that are in the viewport.","        */","        _lookup: function() {","            if (!this.useHash || this._noShim) {","                return this.validDrops;","            }","            var drops = [];","            //Only scan drop shims that are in the Viewport","            Y.each(this.validDrops, function(v) {","                if (v.shim && v.shim.inViewportRegion(false, v.region)) {","                    drops[drops.length] = v;","                }","            });","            return drops;","","        },","        /**","        * @private","        * @method _handleTargetOver","        * @description This method execs _handleTargetOver on all valid Drop Targets","        */","        _handleTargetOver: function() {","            var drops = this._lookup();","            Y.each(drops, function(v) {","                v._handleTargetOver.call(v);","            }, this);","        },","        /**","        * @private","        * @method _regTarget","        * @description Add the passed in Target to the targets collection","        * @param {Object} t The Target to add to the targets collection","        */","        _regTarget: function(t) {","            this.targets[this.targets.length] = t;","        },","        /**","        * @private","        * @method _unregTarget","        * @description Remove the passed in Target from the targets collection","        * @param {Object} drop The Target to remove from the targets collection","        */","        _unregTarget: function(drop) {","            var targets = [], vdrops;","            Y.each(this.targets, function(v) {","                if (v !== drop) {","                    targets[targets.length] = v;","                }","            }, this);","            this.targets = targets;","","            vdrops = [];","            Y.each(this.validDrops, function(v) {","                if (v !== drop) {","                    vdrops[vdrops.length] = v;","                }","            });","","            this.validDrops = vdrops;","        },","        /**","        * @method getDrop","        * @description Get a valid Drop instance back from a Node or a selector string, false otherwise","        * @param {String/Object} node The Node instance or Selector string to check for a valid Drop Object","        * @return {Object}","        */","        getDrop: function(node) {","            var drop = false,","                n = Y.one(node);","            if (n instanceof Y.Node) {","                Y.each(this.targets, function(v) {","                    if (n.compareTo(v.get('node'))) {","                        drop = v;","                    }","                });","            }","            return drop;","        }","    }, true);","","","","","}, '3.7.3', {\"requires\": [\"dd-ddm\"]});"];
_yuitest_coverage["build/dd-ddm-drop/dd-ddm-drop.js"].lines = {"1":0,"14":0,"36":0,"37":0,"39":0,"48":0,"57":0,"58":0,"59":0,"60":0,"64":0,"72":0,"73":0,"74":0,"75":0,"147":0,"148":0,"159":0,"160":0,"161":0,"162":0,"166":0,"167":0,"176":0,"177":0,"179":0,"180":0,"181":0,"182":0,"184":0,"185":0,"186":0,"187":0,"190":0,"191":0,"193":0,"202":0,"209":0,"210":0,"211":0,"219":0,"220":0,"221":0,"222":0,"223":0,"224":0,"227":0,"238":0,"240":0,"241":0,"242":0,"244":0,"245":0,"246":0,"247":0,"251":0,"252":0,"254":0,"255":0,"256":0,"259":0,"261":0,"269":0,"274":0,"275":0,"277":0,"278":0,"280":0,"281":0,"282":0,"284":0,"285":0,"286":0,"287":0,"289":0,"290":0,"291":0,"294":0,"296":0,"297":0,"306":0,"307":0,"309":0,"310":0,"321":0,"322":0,"324":0,"326":0,"327":0,"328":0,"331":0,"340":0,"341":0,"342":0,"352":0,"361":0,"362":0,"363":0,"364":0,"367":0,"369":0,"370":0,"371":0,"372":0,"376":0,"385":0,"387":0,"388":0,"389":0,"390":0,"394":0};
_yuitest_coverage["build/dd-ddm-drop/dd-ddm-drop.js"].functions = {"_hasActiveShim:35":0,"_addActiveShim:47":0,"(anonymous 2):58":0,"_removeActiveShim:56":0,"(anonymous 4):74":0,"(anonymous 3):72":0,"syncActiveShims:71":0,"_addValid:146":0,"(anonymous 5):160":0,"_removeValid:158":0,"isOverTarget:175":0,"clearCache:208":0,"(anonymous 6):221":0,"_activateTargets:218":0,"(anonymous 7):240":0,"(anonymous 8):254":0,"getBestMatch:237":0,"(anonymous 9):296":0,"_deactivateTargets:268":0,"(anonymous 10):309":0,"_dropMove:305":0,"(anonymous 11):326":0,"_lookup:320":0,"(anonymous 12):341":0,"_handleTargetOver:339":0,"_regTarget:351":0,"(anonymous 13):362":0,"(anonymous 14):370":0,"_unregTarget:360":0,"(anonymous 15):388":0,"getDrop:384":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-ddm-drop/dd-ddm-drop.js"].coveredLines = 111;
_yuitest_coverage["build/dd-ddm-drop/dd-ddm-drop.js"].coveredFunctions = 32;
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 1);
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
    _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 14);
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
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_hasActiveShim", 35);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 36);
if (this._noShim) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 37);
return true;
            }
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 39);
return this._activeShims.length;
        },
        /**
        * @private
        * @method _addActiveShim
        * @description Adds a Drop Target to the list of active shims
        * @param {Object} d The Drop instance to add to the list.
        */
        _addActiveShim: function(d) {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_addActiveShim", 47);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 48);
this._activeShims[this._activeShims.length] = d;
        },
        /**
        * @private
        * @method _removeActiveShim
        * @description Removes a Drop Target to the list of active shims
        * @param {Object} d The Drop instance to remove from the list.
        */
        _removeActiveShim: function(d) {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_removeActiveShim", 56);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 57);
var s = [];
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 58);
Y.each(this._activeShims, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 2)", 58);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 59);
if (v._yuid !== d._yuid) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 60);
s[s.length] = v;
                }

            });
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 64);
this._activeShims = s;
        },
        /**
        * @method syncActiveShims
        * @description This method will sync the position of the shims on the Drop Targets that are currently active.
        * @param {Boolean} force Resize/sync all Targets.
        */
        syncActiveShims: function(force) {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "syncActiveShims", 71);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 72);
Y.later(0, this, function(force) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 3)", 72);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 73);
var drops = ((force) ? this.targets : this._lookup());
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 74);
Y.each(drops, function(v) {
                    _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 4)", 74);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 75);
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
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_addValid", 146);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 147);
this.validDrops[this.validDrops.length] = drop;
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 148);
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
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_removeValid", 158);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 159);
var drops = [];
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 160);
Y.each(this.validDrops, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 5)", 160);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 161);
if (v !== drop) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 162);
drops[drops.length] = v;
                }
            });

            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 166);
this.validDrops = drops;
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 167);
return this;
        },
        /**
        * @method isOverTarget
        * @description Check to see if the Drag element is over the target, method varies on current mode
        * @param {Object} drop The drop to check against
        * @return {Boolean}
        */
        isOverTarget: function(drop) {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "isOverTarget", 175);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 176);
if (this.activeDrag && drop) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 177);
var xy = this.activeDrag.mouseXY, r, dMode = this.activeDrag.get('dragMode'),
                    aRegion, node = drop.shim;
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 179);
if (xy && this.activeDrag) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 180);
aRegion = this.activeDrag.region;
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 181);
if (dMode === this.STRICT) {
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 182);
return this.activeDrag.get('dragNode').inRegion(drop.region, true, aRegion);
                    }
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 184);
if (drop && drop.shim) {
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 185);
if ((dMode === this.INTERSECT) && this._noShim) {
                            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 186);
r = aRegion || this.activeDrag.get('node');
                            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 187);
return drop.get('node').intersect(r, drop.region).inRegion;
                        }

                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 190);
if (this._noShim) {
                            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 191);
node = drop.get('node');
                        }
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 193);
return node.intersect({
                            top: xy[1],
                            bottom: xy[1],
                            left: xy[0],
                            right: xy[0]
                        }, drop.region).inRegion;
                    }
                }
            }
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 202);
return false;
        },
        /**
        * @method clearCache
        * @description Clears the cache data used for this interaction.
        */
        clearCache: function() {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "clearCache", 208);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 209);
this.validDrops = [];
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 210);
this.otherDrops = {};
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 211);
this._activeShims = [];
        },
        /**
        * @private
        * @method _activateTargets
        * @description Clear the cache and activate the shims of all the targets
        */
        _activateTargets: function() {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_activateTargets", 218);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 219);
this._noShim = true;
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 220);
this.clearCache();
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 221);
Y.each(this.targets, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 6)", 221);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 222);
v._activateShim([]);
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 223);
if (v.get('noShim') === true) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 224);
this._noShim = false;
                }
            }, this);
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 227);
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
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "getBestMatch", 237);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 238);
var biggest = null, area = 0, out;

            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 240);
Y.each(drops, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 7)", 240);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 241);
var inter = this.activeDrag.get('dragNode').intersect(v.get('node'));
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 242);
v.region.area = inter.area;

                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 244);
if (inter.inRegion) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 245);
if (inter.area > area) {
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 246);
area = inter.area;
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 247);
biggest = v;
                    }
                }
            }, this);
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 251);
if (all) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 252);
out = [];
                //TODO Sort the others in numeric order by area covered..
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 254);
Y.each(drops, function(v) {
                    _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 8)", 254);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 255);
if (v !== biggest) {
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 256);
out[out.length] = v;
                    }
                }, this);
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 259);
return [biggest, out];
            }
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 261);
return biggest;
        },
        /**
        * @private
        * @method _deactivateTargets
        * @description This method fires the drop:hit, drag:drophit, drag:dropmiss methods and deactivates the shims..
        */
        _deactivateTargets: function() {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_deactivateTargets", 268);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 269);
var other = [], tmp,
                activeDrag = this.activeDrag,
                activeDrop = this.activeDrop;

            //TODO why is this check so hard??
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 274);
if (activeDrag && activeDrop && this.otherDrops[activeDrop]) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 275);
if (!activeDrag.get('dragMode')) {
                    //TODO otherDrops -- private..
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 277);
other = this.otherDrops;
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 278);
delete other[activeDrop];
                } else {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 280);
tmp = this.getBestMatch(this.otherDrops, true);
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 281);
activeDrop = tmp[0];
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 282);
other = tmp[1];
                }
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 284);
activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 285);
if (activeDrop) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 286);
activeDrop.fire('drop:hit', { drag: activeDrag, drop: activeDrop, others: other });
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 287);
activeDrag.fire('drag:drophit', { drag: activeDrag,  drop: activeDrop, others: other });
                }
            } else {_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 289);
if (activeDrag && activeDrag.get('dragging')) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 290);
activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 291);
activeDrag.fire('drag:dropmiss', { pageX: activeDrag.lastXY[0], pageY: activeDrag.lastXY[1] });
            }}

            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 294);
this.activeDrop = null;

            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 296);
Y.each(this.targets, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 9)", 296);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 297);
v._deactivateShim([]);
            }, this);
        },
        /**
        * @private
        * @method _dropMove
        * @description This method is called when the move method is called on the Drag Object.
        */
        _dropMove: function() {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_dropMove", 305);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 306);
if (this._hasActiveShim()) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 307);
this._handleTargetOver();
            } else {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 309);
Y.each(this.otherDrops, function(v) {
                    _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 10)", 309);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 310);
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
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_lookup", 320);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 321);
if (!this.useHash || this._noShim) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 322);
return this.validDrops;
            }
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 324);
var drops = [];
            //Only scan drop shims that are in the Viewport
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 326);
Y.each(this.validDrops, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 11)", 326);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 327);
if (v.shim && v.shim.inViewportRegion(false, v.region)) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 328);
drops[drops.length] = v;
                }
            });
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 331);
return drops;

        },
        /**
        * @private
        * @method _handleTargetOver
        * @description This method execs _handleTargetOver on all valid Drop Targets
        */
        _handleTargetOver: function() {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_handleTargetOver", 339);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 340);
var drops = this._lookup();
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 341);
Y.each(drops, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 12)", 341);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 342);
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
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_regTarget", 351);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 352);
this.targets[this.targets.length] = t;
        },
        /**
        * @private
        * @method _unregTarget
        * @description Remove the passed in Target from the targets collection
        * @param {Object} drop The Target to remove from the targets collection
        */
        _unregTarget: function(drop) {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "_unregTarget", 360);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 361);
var targets = [], vdrops;
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 362);
Y.each(this.targets, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 13)", 362);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 363);
if (v !== drop) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 364);
targets[targets.length] = v;
                }
            }, this);
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 367);
this.targets = targets;

            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 369);
vdrops = [];
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 370);
Y.each(this.validDrops, function(v) {
                _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 14)", 370);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 371);
if (v !== drop) {
                    _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 372);
vdrops[vdrops.length] = v;
                }
            });

            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 376);
this.validDrops = vdrops;
        },
        /**
        * @method getDrop
        * @description Get a valid Drop instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drop Object
        * @return {Object}
        */
        getDrop: function(node) {
            _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "getDrop", 384);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 385);
var drop = false,
                n = Y.one(node);
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 387);
if (n instanceof Y.Node) {
                _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 388);
Y.each(this.targets, function(v) {
                    _yuitest_coverfunc("build/dd-ddm-drop/dd-ddm-drop.js", "(anonymous 15)", 388);
_yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 389);
if (n.compareTo(v.get('node'))) {
                        _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 390);
drop = v;
                    }
                });
            }
            _yuitest_coverline("build/dd-ddm-drop/dd-ddm-drop.js", 394);
return drop;
        }
    }, true);




}, '3.7.3', {"requires": ["dd-ddm"]});
