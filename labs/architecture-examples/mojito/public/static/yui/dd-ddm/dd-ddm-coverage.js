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
_yuitest_coverage["build/dd-ddm/dd-ddm.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-ddm/dd-ddm.js",
    code: []
};
_yuitest_coverage["build/dd-ddm/dd-ddm.js"].code=["YUI.add('dd-ddm', function (Y, NAME) {","","","    /**","     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable","     * anode to drag to be dragged over an iframe or any other node that traps mousemove events.","     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.","     * @module dd","     * @submodule dd-ddm","     * @for DDM","     * @namespace DD","     */","    Y.mix(Y.DD.DDM, {","        /**","        * @private","        * @property _pg","        * @description The shim placed over the screen to track the mousemove event.","        * @type {Node}","        */","        _pg: null,","        /**","        * @private","        * @property _debugShim","        * @description Set this to true to set the shims opacity to .5 for debugging it, default: false.","        * @type {Boolean}","        */","        _debugShim: false,","        _activateTargets: function() { },","        _deactivateTargets: function() {},","        _startDrag: function() {","            if (this.activeDrag && this.activeDrag.get('useShim')) {","                this._shimming = true;","                this._pg_activate();","                this._activateTargets();","            }","        },","        _endDrag: function() {","            this._pg_deactivate();","            this._deactivateTargets();","        },","        /**","        * @private","        * @method _pg_deactivate","        * @description Deactivates the shim","        */","        _pg_deactivate: function() {","            this._pg.setStyle('display', 'none');","        },","        /**","        * @private","        * @method _pg_activate","        * @description Activates the shim","        */","        _pg_activate: function() {","            if (!this._pg) {","                this._createPG();","            }","            var ah = this.activeDrag.get('activeHandle'), cur = 'auto';","            if (ah) {","                cur = ah.getStyle('cursor');","            }","            if (cur === 'auto') {","                cur = this.get('dragCursor');","            }","","            this._pg_size();","            this._pg.setStyles({","                top: 0,","                left: 0,","                display: 'block',","                opacity: ((this._debugShim) ? '.5' : '0'),","                cursor: cur","            });","        },","        /**","        * @private","        * @method _pg_size","        * @description Sizes the shim on: activatation, window:scroll, window:resize","        */","        _pg_size: function() {","            if (this.activeDrag) {","                var b = Y.one('body'),","                h = b.get('docHeight'),","                w = b.get('docWidth');","                this._pg.setStyles({","                    height: h + 'px',","                    width: w + 'px'","                });","            }","        },","        /**","        * @private","        * @method _createPG","        * @description Creates the shim and adds it's listeners to it.","        */","        _createPG: function() {","            var pg = Y.Node.create('<div></div>'),","            bd = Y.one('body'), win;","            pg.setStyles({","                top: '0',","                left: '0',","                position: 'absolute',","                zIndex: '9999',","                overflow: 'hidden',","                backgroundColor: 'red',","                display: 'none',","                height: '5px',","                width: '5px'","            });","            pg.set('id', Y.stamp(pg));","            pg.addClass(Y.DD.DDM.CSS_PREFIX + '-shim');","            bd.prepend(pg);","            this._pg = pg;","            this._pg.on('mousemove', Y.throttle(Y.bind(this._move, this), this.get('throttleTime')));","            this._pg.on('mouseup', Y.bind(this._end, this));","","            win = Y.one('win');","            Y.on('window:resize', Y.bind(this._pg_size, this));","            win.on('scroll', Y.bind(this._pg_size, this));","        }","    }, true);","","","","","}, '3.7.3', {\"requires\": [\"dd-ddm-base\", \"event-resize\"]});"];
_yuitest_coverage["build/dd-ddm/dd-ddm.js"].lines = {"1":0,"13":0,"31":0,"32":0,"33":0,"34":0,"38":0,"39":0,"47":0,"55":0,"56":0,"58":0,"59":0,"60":0,"62":0,"63":0,"66":0,"67":0,"81":0,"82":0,"85":0,"97":0,"99":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"117":0,"118":0,"119":0};
_yuitest_coverage["build/dd-ddm/dd-ddm.js"].functions = {"_startDrag:30":0,"_endDrag:37":0,"_pg_deactivate:46":0,"_pg_activate:54":0,"_pg_size:80":0,"_createPG:96":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-ddm/dd-ddm.js"].coveredLines = 32;
_yuitest_coverage["build/dd-ddm/dd-ddm.js"].coveredFunctions = 7;
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 1);
YUI.add('dd-ddm', function (Y, NAME) {


    /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable
     * anode to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     * @module dd
     * @submodule dd-ddm
     * @for DDM
     * @namespace DD
     */
    _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 13);
Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @property _pg
        * @description The shim placed over the screen to track the mousemove event.
        * @type {Node}
        */
        _pg: null,
        /**
        * @private
        * @property _debugShim
        * @description Set this to true to set the shims opacity to .5 for debugging it, default: false.
        * @type {Boolean}
        */
        _debugShim: false,
        _activateTargets: function() { },
        _deactivateTargets: function() {},
        _startDrag: function() {
            _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "_startDrag", 30);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 31);
if (this.activeDrag && this.activeDrag.get('useShim')) {
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 32);
this._shimming = true;
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 33);
this._pg_activate();
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 34);
this._activateTargets();
            }
        },
        _endDrag: function() {
            _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "_endDrag", 37);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 38);
this._pg_deactivate();
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 39);
this._deactivateTargets();
        },
        /**
        * @private
        * @method _pg_deactivate
        * @description Deactivates the shim
        */
        _pg_deactivate: function() {
            _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "_pg_deactivate", 46);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 47);
this._pg.setStyle('display', 'none');
        },
        /**
        * @private
        * @method _pg_activate
        * @description Activates the shim
        */
        _pg_activate: function() {
            _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "_pg_activate", 54);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 55);
if (!this._pg) {
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 56);
this._createPG();
            }
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 58);
var ah = this.activeDrag.get('activeHandle'), cur = 'auto';
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 59);
if (ah) {
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 60);
cur = ah.getStyle('cursor');
            }
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 62);
if (cur === 'auto') {
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 63);
cur = this.get('dragCursor');
            }

            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 66);
this._pg_size();
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 67);
this._pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0'),
                cursor: cur
            });
        },
        /**
        * @private
        * @method _pg_size
        * @description Sizes the shim on: activatation, window:scroll, window:resize
        */
        _pg_size: function() {
            _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "_pg_size", 80);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 81);
if (this.activeDrag) {
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 82);
var b = Y.one('body'),
                h = b.get('docHeight'),
                w = b.get('docWidth');
                _yuitest_coverline("build/dd-ddm/dd-ddm.js", 85);
this._pg.setStyles({
                    height: h + 'px',
                    width: w + 'px'
                });
            }
        },
        /**
        * @private
        * @method _createPG
        * @description Creates the shim and adds it's listeners to it.
        */
        _createPG: function() {
            _yuitest_coverfunc("build/dd-ddm/dd-ddm.js", "_createPG", 96);
_yuitest_coverline("build/dd-ddm/dd-ddm.js", 97);
var pg = Y.Node.create('<div></div>'),
            bd = Y.one('body'), win;
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 99);
pg.setStyles({
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '9999',
                overflow: 'hidden',
                backgroundColor: 'red',
                display: 'none',
                height: '5px',
                width: '5px'
            });
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 110);
pg.set('id', Y.stamp(pg));
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 111);
pg.addClass(Y.DD.DDM.CSS_PREFIX + '-shim');
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 112);
bd.prepend(pg);
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 113);
this._pg = pg;
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 114);
this._pg.on('mousemove', Y.throttle(Y.bind(this._move, this), this.get('throttleTime')));
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 115);
this._pg.on('mouseup', Y.bind(this._end, this));

            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 117);
win = Y.one('win');
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 118);
Y.on('window:resize', Y.bind(this._pg_size, this));
            _yuitest_coverline("build/dd-ddm/dd-ddm.js", 119);
win.on('scroll', Y.bind(this._pg_size, this));
        }
    }, true);




}, '3.7.3', {"requires": ["dd-ddm-base", "event-resize"]});
