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
_yuitest_coverage["build/shim-plugin/shim-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/shim-plugin/shim-plugin.js",
    code: []
};
_yuitest_coverage["build/shim-plugin/shim-plugin.js"].code=["YUI.add('shim-plugin', function (Y, NAME) {","","    /**","     * Provides shimming support for Node via a Plugin.","     * This fixes SELECT bleedthrough for IE6 & Mac scrollbars","     * @module shim-plugin","     */","","    /**","     * Node plugin which can be used to add shim support.","     *","     * @class Plugin.Shim","     * @param {Object} User configuration object","     */","    function Shim(config) {","        this.init(config);","    }","","    /**","     * Default class used to mark the shim element","     *","     * @property CLASS_NAME","     * @type String","     * @static","     * @default \"yui-node-shim\"","     */","    // TODO: use ClassNameManager","    Shim.CLASS_NAME = 'yui-node-shim';","","    /**","     * Default markup template used to generate the shim element.","     * ","     * @property TEMPLATE","     * @type String","     * @static","     */","    Shim.TEMPLATE = '<iframe class=\"' + Shim.CLASS_NAME +","            '\" frameborder=\"0\" title=\"Node Stacking Shim\"' +","            'src=\"javascript:false\" tabindex=\"-1\" role=\"presentation\"' +","            'style=\"position:absolute; z-index:-1;\"></iframe>';","","    Shim.prototype = {","        init: function(config) {","            this._host = config.host;","            this.initEvents();","            this.insert();","            this.sync();","        },","","        initEvents: function() {","            this._resizeHandle = this._host.on('resize', this.sync, this);","        },","        ","        getShim: function() {","            return this._shim || (","                this._shim = Y.Node.create(","                    Shim.TEMPLATE,","                    this._host.get('ownerDocument')","                )","            );","        },","","        insert: function() {","            var node = this._host;","            this._shim = node.insertBefore( this.getShim(),","                    node.get('firstChild'));","        },","","        /**","         * Updates the size of the shim to fill its container","         * @method sync","         */","        sync: function() {","            var shim = this._shim,","                node = this._host;","","            if (shim) {","                shim.setAttrs({","                    width: node.getStyle('width'),","                    height: node.getStyle('height')","                });","            }","        },","","        /**","         * Removes the shim and destroys the plugin","         * @method destroy","         */","        destroy: function() {","            var shim = this._shim;","            if (shim) {","                shim.remove(true);","            }","","            this._resizeHandle.detach();","        }","    };","","    Shim.NAME = 'Shim';","    Shim.NS = 'shim';","","    Y.namespace('Plugin');","    Y.Plugin.Shim = Shim;","","","}, '3.7.3', {\"requires\": [\"node-style\", \"node-pluginhost\"]});"];
_yuitest_coverage["build/shim-plugin/shim-plugin.js"].lines = {"1":0,"15":0,"16":0,"28":0,"37":0,"42":0,"44":0,"45":0,"46":0,"47":0,"51":0,"55":0,"64":0,"65":0,"74":0,"77":0,"78":0,"90":0,"91":0,"92":0,"95":0,"99":0,"100":0,"102":0,"103":0};
_yuitest_coverage["build/shim-plugin/shim-plugin.js"].functions = {"Shim:15":0,"init:43":0,"initEvents:50":0,"getShim:54":0,"insert:63":0,"sync:73":0,"destroy:89":0,"(anonymous 1):1":0};
_yuitest_coverage["build/shim-plugin/shim-plugin.js"].coveredLines = 25;
_yuitest_coverage["build/shim-plugin/shim-plugin.js"].coveredFunctions = 8;
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 1);
YUI.add('shim-plugin', function (Y, NAME) {

    /**
     * Provides shimming support for Node via a Plugin.
     * This fixes SELECT bleedthrough for IE6 & Mac scrollbars
     * @module shim-plugin
     */

    /**
     * Node plugin which can be used to add shim support.
     *
     * @class Plugin.Shim
     * @param {Object} User configuration object
     */
    _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 15);
function Shim(config) {
        _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "Shim", 15);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 16);
this.init(config);
    }

    /**
     * Default class used to mark the shim element
     *
     * @property CLASS_NAME
     * @type String
     * @static
     * @default "yui-node-shim"
     */
    // TODO: use ClassNameManager
    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 28);
Shim.CLASS_NAME = 'yui-node-shim';

    /**
     * Default markup template used to generate the shim element.
     * 
     * @property TEMPLATE
     * @type String
     * @static
     */
    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 37);
Shim.TEMPLATE = '<iframe class="' + Shim.CLASS_NAME +
            '" frameborder="0" title="Node Stacking Shim"' +
            'src="javascript:false" tabindex="-1" role="presentation"' +
            'style="position:absolute; z-index:-1;"></iframe>';

    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 42);
Shim.prototype = {
        init: function(config) {
            _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "init", 43);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 44);
this._host = config.host;
            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 45);
this.initEvents();
            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 46);
this.insert();
            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 47);
this.sync();
        },

        initEvents: function() {
            _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "initEvents", 50);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 51);
this._resizeHandle = this._host.on('resize', this.sync, this);
        },
        
        getShim: function() {
            _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "getShim", 54);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 55);
return this._shim || (
                this._shim = Y.Node.create(
                    Shim.TEMPLATE,
                    this._host.get('ownerDocument')
                )
            );
        },

        insert: function() {
            _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "insert", 63);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 64);
var node = this._host;
            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 65);
this._shim = node.insertBefore( this.getShim(),
                    node.get('firstChild'));
        },

        /**
         * Updates the size of the shim to fill its container
         * @method sync
         */
        sync: function() {
            _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "sync", 73);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 74);
var shim = this._shim,
                node = this._host;

            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 77);
if (shim) {
                _yuitest_coverline("build/shim-plugin/shim-plugin.js", 78);
shim.setAttrs({
                    width: node.getStyle('width'),
                    height: node.getStyle('height')
                });
            }
        },

        /**
         * Removes the shim and destroys the plugin
         * @method destroy
         */
        destroy: function() {
            _yuitest_coverfunc("build/shim-plugin/shim-plugin.js", "destroy", 89);
_yuitest_coverline("build/shim-plugin/shim-plugin.js", 90);
var shim = this._shim;
            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 91);
if (shim) {
                _yuitest_coverline("build/shim-plugin/shim-plugin.js", 92);
shim.remove(true);
            }

            _yuitest_coverline("build/shim-plugin/shim-plugin.js", 95);
this._resizeHandle.detach();
        }
    };

    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 99);
Shim.NAME = 'Shim';
    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 100);
Shim.NS = 'shim';

    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 102);
Y.namespace('Plugin');
    _yuitest_coverline("build/shim-plugin/shim-plugin.js", 103);
Y.Plugin.Shim = Shim;


}, '3.7.3', {"requires": ["node-style", "node-pluginhost"]});
