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
_yuitest_coverage["build/tabview-base/tabview-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tabview-base/tabview-base.js",
    code: []
};
_yuitest_coverage["build/tabview-base/tabview-base.js"].code=["YUI.add('tabview-base', function (Y, NAME) {","","var getClassName = Y.ClassNameManager.getClassName,","    TABVIEW = 'tabview',","    TAB = 'tab',","    CONTENT = 'content',","    PANEL = 'panel',","    SELECTED = 'selected',","    EMPTY_OBJ = {},","    DOT = '.',","","    _classNames = {","        tabview: getClassName(TABVIEW),","        tabviewPanel: getClassName(TABVIEW, PANEL),","        tabviewList: getClassName(TABVIEW, 'list'),","        tab: getClassName(TAB),","        tabLabel: getClassName(TAB, 'label'),","        tabPanel: getClassName(TAB, PANEL),","        selectedTab: getClassName(TAB, SELECTED),","        selectedPanel: getClassName(TAB, PANEL, SELECTED)","    },","","    _queries = {","        tabview: DOT + _classNames.tabview,","        tabviewList: '> ul',","        tab: '> ul > li',","        tabLabel: '> ul > li > a',","        tabviewPanel: '> div',","        tabPanel: '> div > div',","        selectedTab: '> ul > ' + DOT + _classNames.selectedTab,","        selectedPanel: '> div ' + DOT + _classNames.selectedPanel","    },","","    TabviewBase = function(config) {","        this.init.apply(this, arguments);","    };","","TabviewBase.NAME = 'tabviewBase';","TabviewBase._queries = _queries;","TabviewBase._classNames = _classNames;","","Y.mix(TabviewBase.prototype, {","    init: function(config) {","        config = config || EMPTY_OBJ;","        this._node = config.host || Y.one(config.node);","","        this.refresh();","    },","","    initClassNames: function(index) {","        Y.Object.each(_queries, function(query, name) {","            // this === tabview._node","            if (_classNames[name]) {","                var result = this.all(query);","                ","                if (index !== undefined) {","                    result = result.item(index);","                }","","                if (result) {","                    result.addClass(_classNames[name]);","                }","            }","        }, this._node);","","        this._node.addClass(_classNames.tabview);","    },","","    _select: function(index) {","        var node = this._node,","            oldItem = node.one(_queries.selectedTab),","            oldContent = node.one(_queries.selectedPanel),","            newItem = node.all(_queries.tab).item(index),","            newContent = node.all(_queries.tabPanel).item(index);","","        if (oldItem) {","            oldItem.removeClass(_classNames.selectedTab);","        }","","        if (oldContent) {","            oldContent.removeClass(_classNames.selectedPanel);","        }","","        if (newItem) {","            newItem.addClass(_classNames.selectedTab);","        }","","        if (newContent) {","            newContent.addClass(_classNames.selectedPanel);","        }","    },","","    initState: function() {","        var node = this._node,","            activeNode = node.one(_queries.selectedTab),","            activeIndex = activeNode ?","                    node.all(_queries.tab).indexOf(activeNode) : 0;","","        this._select(activeIndex);","    },","","    // collapse extra space between list-items","    _scrubTextNodes: function() {","        this._node.one(_queries.tabviewList).get('childNodes').each(function(node) {","            if (node.get('nodeType') === 3) { // text node","                node.remove();","            }","        });","    },","","    // base renderer only enlivens existing markup","    refresh: function() {","        this._scrubTextNodes();","        this.initClassNames();","        this.initState();","        this.initEvents();","    },","","    tabEventName: 'click',","","    initEvents: function() {","        // TODO: detach prefix for delegate?","        // this._node.delegate('tabview|' + this.tabEventName),","        this._node.delegate(this.tabEventName,","            this.onTabEvent,","            _queries.tab,","            this","        );","    },","","    onTabEvent: function(e) {","        e.preventDefault();","        this._select(this._node.all(_queries.tab).indexOf(e.currentTarget));","    },","","    destroy: function() {","        this._node.detach(this.tabEventName);","    }","});","","Y.TabviewBase = TabviewBase;","","","}, '3.7.3', {\"requires\": [\"node-event-delegate\", \"classnamemanager\", \"skin-sam-tabview\"]});"];
_yuitest_coverage["build/tabview-base/tabview-base.js"].lines = {"1":0,"3":0,"35":0,"38":0,"39":0,"40":0,"42":0,"44":0,"45":0,"47":0,"51":0,"53":0,"54":0,"56":0,"57":0,"60":0,"61":0,"66":0,"70":0,"76":0,"77":0,"80":0,"81":0,"84":0,"85":0,"88":0,"89":0,"94":0,"99":0,"104":0,"105":0,"106":0,"113":0,"114":0,"115":0,"116":0,"124":0,"132":0,"133":0,"137":0,"141":0};
_yuitest_coverage["build/tabview-base/tabview-base.js"].functions = {"TabviewBase:34":0,"init:43":0,"(anonymous 2):51":0,"initClassNames:50":0,"_select:69":0,"initState:93":0,"(anonymous 3):104":0,"_scrubTextNodes:103":0,"refresh:112":0,"initEvents:121":0,"onTabEvent:131":0,"destroy:136":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tabview-base/tabview-base.js"].coveredLines = 41;
_yuitest_coverage["build/tabview-base/tabview-base.js"].coveredFunctions = 13;
_yuitest_coverline("build/tabview-base/tabview-base.js", 1);
YUI.add('tabview-base', function (Y, NAME) {

_yuitest_coverfunc("build/tabview-base/tabview-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tabview-base/tabview-base.js", 3);
var getClassName = Y.ClassNameManager.getClassName,
    TABVIEW = 'tabview',
    TAB = 'tab',
    CONTENT = 'content',
    PANEL = 'panel',
    SELECTED = 'selected',
    EMPTY_OBJ = {},
    DOT = '.',

    _classNames = {
        tabview: getClassName(TABVIEW),
        tabviewPanel: getClassName(TABVIEW, PANEL),
        tabviewList: getClassName(TABVIEW, 'list'),
        tab: getClassName(TAB),
        tabLabel: getClassName(TAB, 'label'),
        tabPanel: getClassName(TAB, PANEL),
        selectedTab: getClassName(TAB, SELECTED),
        selectedPanel: getClassName(TAB, PANEL, SELECTED)
    },

    _queries = {
        tabview: DOT + _classNames.tabview,
        tabviewList: '> ul',
        tab: '> ul > li',
        tabLabel: '> ul > li > a',
        tabviewPanel: '> div',
        tabPanel: '> div > div',
        selectedTab: '> ul > ' + DOT + _classNames.selectedTab,
        selectedPanel: '> div ' + DOT + _classNames.selectedPanel
    },

    TabviewBase = function(config) {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "TabviewBase", 34);
_yuitest_coverline("build/tabview-base/tabview-base.js", 35);
this.init.apply(this, arguments);
    };

_yuitest_coverline("build/tabview-base/tabview-base.js", 38);
TabviewBase.NAME = 'tabviewBase';
_yuitest_coverline("build/tabview-base/tabview-base.js", 39);
TabviewBase._queries = _queries;
_yuitest_coverline("build/tabview-base/tabview-base.js", 40);
TabviewBase._classNames = _classNames;

_yuitest_coverline("build/tabview-base/tabview-base.js", 42);
Y.mix(TabviewBase.prototype, {
    init: function(config) {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "init", 43);
_yuitest_coverline("build/tabview-base/tabview-base.js", 44);
config = config || EMPTY_OBJ;
        _yuitest_coverline("build/tabview-base/tabview-base.js", 45);
this._node = config.host || Y.one(config.node);

        _yuitest_coverline("build/tabview-base/tabview-base.js", 47);
this.refresh();
    },

    initClassNames: function(index) {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "initClassNames", 50);
_yuitest_coverline("build/tabview-base/tabview-base.js", 51);
Y.Object.each(_queries, function(query, name) {
            // this === tabview._node
            _yuitest_coverfunc("build/tabview-base/tabview-base.js", "(anonymous 2)", 51);
_yuitest_coverline("build/tabview-base/tabview-base.js", 53);
if (_classNames[name]) {
                _yuitest_coverline("build/tabview-base/tabview-base.js", 54);
var result = this.all(query);
                
                _yuitest_coverline("build/tabview-base/tabview-base.js", 56);
if (index !== undefined) {
                    _yuitest_coverline("build/tabview-base/tabview-base.js", 57);
result = result.item(index);
                }

                _yuitest_coverline("build/tabview-base/tabview-base.js", 60);
if (result) {
                    _yuitest_coverline("build/tabview-base/tabview-base.js", 61);
result.addClass(_classNames[name]);
                }
            }
        }, this._node);

        _yuitest_coverline("build/tabview-base/tabview-base.js", 66);
this._node.addClass(_classNames.tabview);
    },

    _select: function(index) {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "_select", 69);
_yuitest_coverline("build/tabview-base/tabview-base.js", 70);
var node = this._node,
            oldItem = node.one(_queries.selectedTab),
            oldContent = node.one(_queries.selectedPanel),
            newItem = node.all(_queries.tab).item(index),
            newContent = node.all(_queries.tabPanel).item(index);

        _yuitest_coverline("build/tabview-base/tabview-base.js", 76);
if (oldItem) {
            _yuitest_coverline("build/tabview-base/tabview-base.js", 77);
oldItem.removeClass(_classNames.selectedTab);
        }

        _yuitest_coverline("build/tabview-base/tabview-base.js", 80);
if (oldContent) {
            _yuitest_coverline("build/tabview-base/tabview-base.js", 81);
oldContent.removeClass(_classNames.selectedPanel);
        }

        _yuitest_coverline("build/tabview-base/tabview-base.js", 84);
if (newItem) {
            _yuitest_coverline("build/tabview-base/tabview-base.js", 85);
newItem.addClass(_classNames.selectedTab);
        }

        _yuitest_coverline("build/tabview-base/tabview-base.js", 88);
if (newContent) {
            _yuitest_coverline("build/tabview-base/tabview-base.js", 89);
newContent.addClass(_classNames.selectedPanel);
        }
    },

    initState: function() {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "initState", 93);
_yuitest_coverline("build/tabview-base/tabview-base.js", 94);
var node = this._node,
            activeNode = node.one(_queries.selectedTab),
            activeIndex = activeNode ?
                    node.all(_queries.tab).indexOf(activeNode) : 0;

        _yuitest_coverline("build/tabview-base/tabview-base.js", 99);
this._select(activeIndex);
    },

    // collapse extra space between list-items
    _scrubTextNodes: function() {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "_scrubTextNodes", 103);
_yuitest_coverline("build/tabview-base/tabview-base.js", 104);
this._node.one(_queries.tabviewList).get('childNodes').each(function(node) {
            _yuitest_coverfunc("build/tabview-base/tabview-base.js", "(anonymous 3)", 104);
_yuitest_coverline("build/tabview-base/tabview-base.js", 105);
if (node.get('nodeType') === 3) { // text node
                _yuitest_coverline("build/tabview-base/tabview-base.js", 106);
node.remove();
            }
        });
    },

    // base renderer only enlivens existing markup
    refresh: function() {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "refresh", 112);
_yuitest_coverline("build/tabview-base/tabview-base.js", 113);
this._scrubTextNodes();
        _yuitest_coverline("build/tabview-base/tabview-base.js", 114);
this.initClassNames();
        _yuitest_coverline("build/tabview-base/tabview-base.js", 115);
this.initState();
        _yuitest_coverline("build/tabview-base/tabview-base.js", 116);
this.initEvents();
    },

    tabEventName: 'click',

    initEvents: function() {
        // TODO: detach prefix for delegate?
        // this._node.delegate('tabview|' + this.tabEventName),
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "initEvents", 121);
_yuitest_coverline("build/tabview-base/tabview-base.js", 124);
this._node.delegate(this.tabEventName,
            this.onTabEvent,
            _queries.tab,
            this
        );
    },

    onTabEvent: function(e) {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "onTabEvent", 131);
_yuitest_coverline("build/tabview-base/tabview-base.js", 132);
e.preventDefault();
        _yuitest_coverline("build/tabview-base/tabview-base.js", 133);
this._select(this._node.all(_queries.tab).indexOf(e.currentTarget));
    },

    destroy: function() {
        _yuitest_coverfunc("build/tabview-base/tabview-base.js", "destroy", 136);
_yuitest_coverline("build/tabview-base/tabview-base.js", 137);
this._node.detach(this.tabEventName);
    }
});

_yuitest_coverline("build/tabview-base/tabview-base.js", 141);
Y.TabviewBase = TabviewBase;


}, '3.7.3', {"requires": ["node-event-delegate", "classnamemanager", "skin-sam-tabview"]});
