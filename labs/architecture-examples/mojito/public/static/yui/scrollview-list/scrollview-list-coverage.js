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
_yuitest_coverage["build/scrollview-list/scrollview-list.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-list/scrollview-list.js",
    code: []
};
_yuitest_coverage["build/scrollview-list/scrollview-list.js"].code=["YUI.add('scrollview-list', function (Y, NAME) {","","/**"," * Provides a plugin, which adds support for a scroll indicator to ScrollView instances"," *"," * @module scrollview-list"," */","var getCN = Y.ClassNameManager.getClassName,","SCROLLVIEW = 'scrollview',","LIST_CLASS = getCN(SCROLLVIEW, 'list'),","ITEM_CLASS = getCN(SCROLLVIEW, 'item'),","CONTENT_BOX = \"contentBox\",","RENDERED = 'rendered',","RENDER_UI = 'renderUI',","HOST = \"host\";","","/**"," * ScrollView plugin that adds class names to immediate descendant \"<li>\" to "," * allow for easier styling through CSS"," *"," * @class ScrollViewList"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," */","function ListPlugin() {","    ListPlugin.superclass.constructor.apply(this, arguments);","}",""," ","/**"," * The identity of the plugin"," *"," * @property NAME"," * @type String"," * @default 'pluginList'"," * @static"," */","ListPlugin.NAME = 'pluginList';","    ","/**"," * The namespace on which the plugin will reside."," *"," * @property NS"," * @type String"," * @default 'list'"," * @static"," */","ListPlugin.NS = 'list';","","","/**"," * The default attribute configuration for the plugin"," *"," * @property ATTRS"," * @type Object"," * @static"," */","ListPlugin.ATTRS = {","    ","    /**","     * Specifies whether the list elements (the immediate <ul>'s and the immediate <li>'s inside those <ul>'s) have class names attached to them or not","     *","     * @attribute isAttached","     * @type boolean","     * @deprecated No real use for this attribute on the public API","     */","    isAttached: {","        value:false,","        validator: Y.Lang.isBoolean","    }","};","","Y.namespace(\"Plugin\").ScrollViewList = Y.extend(ListPlugin, Y.Plugin.Base, {","","    /**","     * Designated initializer","     *","     * @method initializer","     */","    initializer: function() {","        this._host = this.get(HOST);","        this.afterHostEvent(\"render\", this._addClassesToList);","    },","","    _addClassesToList: function() {","        if (!this.get('isAttached')) {","            var cb = this._host.get(CONTENT_BOX),","            ulList,","            liList;","","            if (cb.hasChildNodes()) {","                //get all direct descendants of the UL's that are directly under the content box.","                ulList = cb.all('> ul');","                liList = cb.all('> ul > li');","","                //go through the UL's and add the class","                ulList.each(function(list) {","                    list.addClass(LIST_CLASS);","                });","","                //go through LI's and add the class","                liList.each(function(item) {","                    item.addClass(ITEM_CLASS);","                });","","                this.set('isAttached', true);","                ","                // We need to call this again, since sv-list ","                // relies on the \"-vert\" class, to apply padding.","                // [ 1st syncUI pass applies -vert, 2nd pass re-calcs dims ] ","                this._host.syncUI();","            }","        }","    }","","});","","","","","","","","","","","","","}, '3.7.3', {\"requires\": [\"plugin\", \"classnamemanager\"], \"skinnable\": true});"];
_yuitest_coverage["build/scrollview-list/scrollview-list.js"].lines = {"1":0,"8":0,"26":0,"27":0,"39":0,"49":0,"59":0,"74":0,"82":0,"83":0,"87":0,"88":0,"92":0,"94":0,"95":0,"98":0,"99":0,"103":0,"104":0,"107":0,"112":0};
_yuitest_coverage["build/scrollview-list/scrollview-list.js"].functions = {"ListPlugin:26":0,"initializer:81":0,"(anonymous 2):98":0,"(anonymous 3):103":0,"_addClassesToList:86":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-list/scrollview-list.js"].coveredLines = 21;
_yuitest_coverage["build/scrollview-list/scrollview-list.js"].coveredFunctions = 6;
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 1);
YUI.add('scrollview-list', function (Y, NAME) {

/**
 * Provides a plugin, which adds support for a scroll indicator to ScrollView instances
 *
 * @module scrollview-list
 */
_yuitest_coverfunc("build/scrollview-list/scrollview-list.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 8);
var getCN = Y.ClassNameManager.getClassName,
SCROLLVIEW = 'scrollview',
LIST_CLASS = getCN(SCROLLVIEW, 'list'),
ITEM_CLASS = getCN(SCROLLVIEW, 'item'),
CONTENT_BOX = "contentBox",
RENDERED = 'rendered',
RENDER_UI = 'renderUI',
HOST = "host";

/**
 * ScrollView plugin that adds class names to immediate descendant "<li>" to 
 * allow for easier styling through CSS
 *
 * @class ScrollViewList
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 */
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 26);
function ListPlugin() {
    _yuitest_coverfunc("build/scrollview-list/scrollview-list.js", "ListPlugin", 26);
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 27);
ListPlugin.superclass.constructor.apply(this, arguments);
}

 
/**
 * The identity of the plugin
 *
 * @property NAME
 * @type String
 * @default 'pluginList'
 * @static
 */
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 39);
ListPlugin.NAME = 'pluginList';
    
/**
 * The namespace on which the plugin will reside.
 *
 * @property NS
 * @type String
 * @default 'list'
 * @static
 */
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 49);
ListPlugin.NS = 'list';


/**
 * The default attribute configuration for the plugin
 *
 * @property ATTRS
 * @type Object
 * @static
 */
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 59);
ListPlugin.ATTRS = {
    
    /**
     * Specifies whether the list elements (the immediate <ul>'s and the immediate <li>'s inside those <ul>'s) have class names attached to them or not
     *
     * @attribute isAttached
     * @type boolean
     * @deprecated No real use for this attribute on the public API
     */
    isAttached: {
        value:false,
        validator: Y.Lang.isBoolean
    }
};

_yuitest_coverline("build/scrollview-list/scrollview-list.js", 74);
Y.namespace("Plugin").ScrollViewList = Y.extend(ListPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function() {
        _yuitest_coverfunc("build/scrollview-list/scrollview-list.js", "initializer", 81);
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 82);
this._host = this.get(HOST);
        _yuitest_coverline("build/scrollview-list/scrollview-list.js", 83);
this.afterHostEvent("render", this._addClassesToList);
    },

    _addClassesToList: function() {
        _yuitest_coverfunc("build/scrollview-list/scrollview-list.js", "_addClassesToList", 86);
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 87);
if (!this.get('isAttached')) {
            _yuitest_coverline("build/scrollview-list/scrollview-list.js", 88);
var cb = this._host.get(CONTENT_BOX),
            ulList,
            liList;

            _yuitest_coverline("build/scrollview-list/scrollview-list.js", 92);
if (cb.hasChildNodes()) {
                //get all direct descendants of the UL's that are directly under the content box.
                _yuitest_coverline("build/scrollview-list/scrollview-list.js", 94);
ulList = cb.all('> ul');
                _yuitest_coverline("build/scrollview-list/scrollview-list.js", 95);
liList = cb.all('> ul > li');

                //go through the UL's and add the class
                _yuitest_coverline("build/scrollview-list/scrollview-list.js", 98);
ulList.each(function(list) {
                    _yuitest_coverfunc("build/scrollview-list/scrollview-list.js", "(anonymous 2)", 98);
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 99);
list.addClass(LIST_CLASS);
                });

                //go through LI's and add the class
                _yuitest_coverline("build/scrollview-list/scrollview-list.js", 103);
liList.each(function(item) {
                    _yuitest_coverfunc("build/scrollview-list/scrollview-list.js", "(anonymous 3)", 103);
_yuitest_coverline("build/scrollview-list/scrollview-list.js", 104);
item.addClass(ITEM_CLASS);
                });

                _yuitest_coverline("build/scrollview-list/scrollview-list.js", 107);
this.set('isAttached', true);
                
                // We need to call this again, since sv-list 
                // relies on the "-vert" class, to apply padding.
                // [ 1st syncUI pass applies -vert, 2nd pass re-calcs dims ] 
                _yuitest_coverline("build/scrollview-list/scrollview-list.js", 112);
this._host.syncUI();
            }
        }
    }

});












}, '3.7.3', {"requires": ["plugin", "classnamemanager"], "skinnable": true});
