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
_yuitest_coverage["build/sortable-scroll/sortable-scroll.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/sortable-scroll/sortable-scroll.js",
    code: []
};
_yuitest_coverage["build/sortable-scroll/sortable-scroll.js"].code=["YUI.add('sortable-scroll', function (Y, NAME) {","","    ","    /**","     * Plugin for sortable to handle scrolling lists.","     * @module sortable","     * @submodule sortable-scroll","     */","    /**","     * Plugin for sortable to handle scrolling lists.","     * @class SortScroll","     * @extends Base","     * @constructor","     * @namespace Plugin","     */","    ","    var SortScroll = function() {","        SortScroll.superclass.constructor.apply(this, arguments);","    };","","    Y.extend(SortScroll, Y.Base, {","        initializer: function() {","            var host = this.get('host');","            host.plug(Y.Plugin.DDNodeScroll, {","                node: host.get('container')","            });","            host.delegate.on('drop:over', function(e) {","                if (this.dd.nodescroll && e.drag.nodescroll) {","                    e.drag.nodescroll.set('parentScroll', Y.one(this.get('container')));","                }","            });","        }","    }, {","        ATTRS: {","            host: {","                value: ''","            }","        },","        /**","        * @property NAME","        * @default SortScroll","        * @readonly","        * @protected","        * @static","        * @description The name of the class.","        * @type {String}","        */","        NAME: 'SortScroll',","        /**","        * @property NS","        * @default scroll","        * @readonly","        * @protected","        * @static","        * @description The scroll instance.","        * @type {String}","        */","        NS: 'scroll'","    });","","","    Y.namespace('Y.Plugin');","    Y.Plugin.SortableScroll = SortScroll;","","","","}, '3.7.3', {\"requires\": [\"dd-scroll\", \"sortable\"]});"];
_yuitest_coverage["build/sortable-scroll/sortable-scroll.js"].lines = {"1":0,"17":0,"18":0,"21":0,"23":0,"24":0,"27":0,"28":0,"29":0,"62":0,"63":0};
_yuitest_coverage["build/sortable-scroll/sortable-scroll.js"].functions = {"SortScroll:17":0,"(anonymous 2):27":0,"initializer:22":0,"(anonymous 1):1":0};
_yuitest_coverage["build/sortable-scroll/sortable-scroll.js"].coveredLines = 11;
_yuitest_coverage["build/sortable-scroll/sortable-scroll.js"].coveredFunctions = 4;
_yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 1);
YUI.add('sortable-scroll', function (Y, NAME) {

    
    /**
     * Plugin for sortable to handle scrolling lists.
     * @module sortable
     * @submodule sortable-scroll
     */
    /**
     * Plugin for sortable to handle scrolling lists.
     * @class SortScroll
     * @extends Base
     * @constructor
     * @namespace Plugin
     */
    
    _yuitest_coverfunc("build/sortable-scroll/sortable-scroll.js", "(anonymous 1)", 1);
_yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 17);
var SortScroll = function() {
        _yuitest_coverfunc("build/sortable-scroll/sortable-scroll.js", "SortScroll", 17);
_yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 18);
SortScroll.superclass.constructor.apply(this, arguments);
    };

    _yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 21);
Y.extend(SortScroll, Y.Base, {
        initializer: function() {
            _yuitest_coverfunc("build/sortable-scroll/sortable-scroll.js", "initializer", 22);
_yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 23);
var host = this.get('host');
            _yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 24);
host.plug(Y.Plugin.DDNodeScroll, {
                node: host.get('container')
            });
            _yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 27);
host.delegate.on('drop:over', function(e) {
                _yuitest_coverfunc("build/sortable-scroll/sortable-scroll.js", "(anonymous 2)", 27);
_yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 28);
if (this.dd.nodescroll && e.drag.nodescroll) {
                    _yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 29);
e.drag.nodescroll.set('parentScroll', Y.one(this.get('container')));
                }
            });
        }
    }, {
        ATTRS: {
            host: {
                value: ''
            }
        },
        /**
        * @property NAME
        * @default SortScroll
        * @readonly
        * @protected
        * @static
        * @description The name of the class.
        * @type {String}
        */
        NAME: 'SortScroll',
        /**
        * @property NS
        * @default scroll
        * @readonly
        * @protected
        * @static
        * @description The scroll instance.
        * @type {String}
        */
        NS: 'scroll'
    });


    _yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 62);
Y.namespace('Y.Plugin');
    _yuitest_coverline("build/sortable-scroll/sortable-scroll.js", 63);
Y.Plugin.SortableScroll = SortScroll;



}, '3.7.3', {"requires": ["dd-scroll", "sortable"]});
