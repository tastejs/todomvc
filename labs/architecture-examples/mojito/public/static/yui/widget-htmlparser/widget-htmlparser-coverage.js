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
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-htmlparser/widget-htmlparser.js",
    code: []
};
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].code=["YUI.add('widget-htmlparser', function (Y, NAME) {","","/**"," * Adds HTML Parser support to the base Widget class"," *"," * @module widget"," * @submodule widget-htmlparser"," * @for Widget"," */","","var Widget = Y.Widget,","    Node = Y.Node,","    Lang = Y.Lang,","","    SRC_NODE = \"srcNode\",","    CONTENT_BOX = \"contentBox\";","","/**"," * Object hash, defining how attribute values are to be parsed from"," * markup contained in the widget's content box. e.g.:"," * <pre>"," *   {"," *       // Set single Node references using selector syntax "," *       // (selector is run through node.one)"," *       titleNode: \"span.yui-title\","," *       // Set NodeList references using selector syntax "," *       // (array indicates selector is to be run through node.all)"," *       listNodes: [\"li.yui-item\"],"," *       // Set other attribute types, using a parse function. "," *       // Context is set to the widget instance."," *       label: function(contentBox) {"," *           return contentBox.one(\"span.title\").get(\"innerHTML\");"," *       }"," *   }"," * </pre>"," * "," * @property HTML_PARSER"," * @type Object"," * @static"," */","Widget.HTML_PARSER = {};","","/**"," * The build configuration for the Widget class."," * <p>"," * Defines the static fields which need to be aggregated,"," * when this class is used as the main class passed to "," * the <a href=\"Base.html#method_build\">Base.build</a> method."," * </p>"," * @property _buildCfg"," * @type Object"," * @static"," * @final"," * @private"," */","Widget._buildCfg = {","    aggregates : [\"HTML_PARSER\"]","};","","/**"," * The DOM node to parse for configuration values, passed to the Widget's HTML_PARSER definition"," *"," * @attribute srcNode"," * @type String | Node"," * @writeOnce"," */","Widget.ATTRS[SRC_NODE] = {","    value: null,","    setter: Node.one,","    getter: \"_getSrcNode\",","    writeOnce: true","};","","Y.mix(Widget.prototype, {","","    /**","     * @method _getSrcNode","     * @protected","     * @return {Node} The Node to apply HTML_PARSER to","     */","    _getSrcNode : function(val) {","        return val || this.get(CONTENT_BOX);","    },","","    /**","     * @method _applyParsedConfig","     * @protected","     * @return {Object} The merged configuration literal","     */","    _applyParsedConfig : function(node, cfg, parsedCfg) {","        return (parsedCfg) ? Y.mix(cfg, parsedCfg, false) : cfg;","    },","","    /**","     * Utility method used to apply the <code>HTML_PARSER</code> configuration for the ","     * instance, to retrieve config data values.","     *","     * @method _applyParser","     * @protected","     * @param config {Object} User configuration object (will be populated with values from Node) ","     */","    _applyParser : function(config) {","","        var widget = this,","            srcNode = this._getNodeToParse(),","            schema = widget._getHtmlParser(),","            parsedConfig,","            val;","","        if (schema && srcNode) {","            Y.Object.each(schema, function(v, k, o) {","                val = null;","","                if (Lang.isFunction(v)) {","                    val = v.call(widget, srcNode);","                } else {","                    if (Lang.isArray(v)) {","                        val = srcNode.all(v[0]);","                        if (val.isEmpty()) {","                            val = null;","                        }","                    } else {","                        val = srcNode.one(v);","                    }","                }","","                if (val !== null && val !== undefined) {","                    parsedConfig = parsedConfig || {};","                    parsedConfig[k] = val;","                }","            });","        }","        config = widget._applyParsedConfig(srcNode, config, parsedConfig);","    },","","    /**","     * Determines whether we have a node reference which we should try and parse.","     * ","     * The current implementation does not parse nodes generated from CONTENT_TEMPLATE,","     * only explicitly set srcNode, or contentBox attributes.","     * ","     * @method _getNodeToParse","     * @return {Node} The node reference to apply HTML_PARSER to.","     * @private","     */","    _getNodeToParse : function() {","        var srcNode = this.get(\"srcNode\");","        return (!this._cbFromTemplate) ? srcNode : null;","    },","","    /**","     * Gets the HTML_PARSER definition for this instance, by merging HTML_PARSER","     * definitions across the class hierarchy.","     *","     * @private","     * @method _getHtmlParser","     * @return {Object} HTML_PARSER definition for this instance","     */","    _getHtmlParser : function() {","        // Removed caching for kweight. This is a private method","        // and only called once so don't need to cache HTML_PARSER","        var classes = this._getClasses(),","            parser = {},","            i, p;","","        for (i = classes.length - 1; i >= 0; i--) {","            p = classes[i].HTML_PARSER;","            if (p) {","                Y.mix(parser, p, true);","            }","        }","        return parser;","    }","});","","","}, '3.7.3', {\"requires\": [\"widget-base\"]});"];
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].lines = {"1":0,"11":0,"41":0,"56":0,"67":0,"74":0,"82":0,"91":0,"104":0,"110":0,"111":0,"112":0,"114":0,"115":0,"117":0,"118":0,"119":0,"120":0,"123":0,"127":0,"128":0,"129":0,"133":0,"147":0,"148":0,"162":0,"166":0,"167":0,"168":0,"169":0,"172":0};
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].functions = {"_getSrcNode:81":0,"_applyParsedConfig:90":0,"(anonymous 2):111":0,"_applyParser:102":0,"_getNodeToParse:146":0,"_getHtmlParser:159":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].coveredLines = 31;
_yuitest_coverage["build/widget-htmlparser/widget-htmlparser.js"].coveredFunctions = 7;
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 1);
YUI.add('widget-htmlparser', function (Y, NAME) {

/**
 * Adds HTML Parser support to the base Widget class
 *
 * @module widget
 * @submodule widget-htmlparser
 * @for Widget
 */

_yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 11);
var Widget = Y.Widget,
    Node = Y.Node,
    Lang = Y.Lang,

    SRC_NODE = "srcNode",
    CONTENT_BOX = "contentBox";

/**
 * Object hash, defining how attribute values are to be parsed from
 * markup contained in the widget's content box. e.g.:
 * <pre>
 *   {
 *       // Set single Node references using selector syntax 
 *       // (selector is run through node.one)
 *       titleNode: "span.yui-title",
 *       // Set NodeList references using selector syntax 
 *       // (array indicates selector is to be run through node.all)
 *       listNodes: ["li.yui-item"],
 *       // Set other attribute types, using a parse function. 
 *       // Context is set to the widget instance.
 *       label: function(contentBox) {
 *           return contentBox.one("span.title").get("innerHTML");
 *       }
 *   }
 * </pre>
 * 
 * @property HTML_PARSER
 * @type Object
 * @static
 */
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 41);
Widget.HTML_PARSER = {};

/**
 * The build configuration for the Widget class.
 * <p>
 * Defines the static fields which need to be aggregated,
 * when this class is used as the main class passed to 
 * the <a href="Base.html#method_build">Base.build</a> method.
 * </p>
 * @property _buildCfg
 * @type Object
 * @static
 * @final
 * @private
 */
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 56);
Widget._buildCfg = {
    aggregates : ["HTML_PARSER"]
};

/**
 * The DOM node to parse for configuration values, passed to the Widget's HTML_PARSER definition
 *
 * @attribute srcNode
 * @type String | Node
 * @writeOnce
 */
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 67);
Widget.ATTRS[SRC_NODE] = {
    value: null,
    setter: Node.one,
    getter: "_getSrcNode",
    writeOnce: true
};

_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 74);
Y.mix(Widget.prototype, {

    /**
     * @method _getSrcNode
     * @protected
     * @return {Node} The Node to apply HTML_PARSER to
     */
    _getSrcNode : function(val) {
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_getSrcNode", 81);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 82);
return val || this.get(CONTENT_BOX);
    },

    /**
     * @method _applyParsedConfig
     * @protected
     * @return {Object} The merged configuration literal
     */
    _applyParsedConfig : function(node, cfg, parsedCfg) {
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_applyParsedConfig", 90);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 91);
return (parsedCfg) ? Y.mix(cfg, parsedCfg, false) : cfg;
    },

    /**
     * Utility method used to apply the <code>HTML_PARSER</code> configuration for the 
     * instance, to retrieve config data values.
     *
     * @method _applyParser
     * @protected
     * @param config {Object} User configuration object (will be populated with values from Node) 
     */
    _applyParser : function(config) {

        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_applyParser", 102);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 104);
var widget = this,
            srcNode = this._getNodeToParse(),
            schema = widget._getHtmlParser(),
            parsedConfig,
            val;

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 110);
if (schema && srcNode) {
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 111);
Y.Object.each(schema, function(v, k, o) {
                _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "(anonymous 2)", 111);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 112);
val = null;

                _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 114);
if (Lang.isFunction(v)) {
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 115);
val = v.call(widget, srcNode);
                } else {
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 117);
if (Lang.isArray(v)) {
                        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 118);
val = srcNode.all(v[0]);
                        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 119);
if (val.isEmpty()) {
                            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 120);
val = null;
                        }
                    } else {
                        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 123);
val = srcNode.one(v);
                    }
                }

                _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 127);
if (val !== null && val !== undefined) {
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 128);
parsedConfig = parsedConfig || {};
                    _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 129);
parsedConfig[k] = val;
                }
            });
        }
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 133);
config = widget._applyParsedConfig(srcNode, config, parsedConfig);
    },

    /**
     * Determines whether we have a node reference which we should try and parse.
     * 
     * The current implementation does not parse nodes generated from CONTENT_TEMPLATE,
     * only explicitly set srcNode, or contentBox attributes.
     * 
     * @method _getNodeToParse
     * @return {Node} The node reference to apply HTML_PARSER to.
     * @private
     */
    _getNodeToParse : function() {
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_getNodeToParse", 146);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 147);
var srcNode = this.get("srcNode");
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 148);
return (!this._cbFromTemplate) ? srcNode : null;
    },

    /**
     * Gets the HTML_PARSER definition for this instance, by merging HTML_PARSER
     * definitions across the class hierarchy.
     *
     * @private
     * @method _getHtmlParser
     * @return {Object} HTML_PARSER definition for this instance
     */
    _getHtmlParser : function() {
        // Removed caching for kweight. This is a private method
        // and only called once so don't need to cache HTML_PARSER
        _yuitest_coverfunc("build/widget-htmlparser/widget-htmlparser.js", "_getHtmlParser", 159);
_yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 162);
var classes = this._getClasses(),
            parser = {},
            i, p;

        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 166);
for (i = classes.length - 1; i >= 0; i--) {
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 167);
p = classes[i].HTML_PARSER;
            _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 168);
if (p) {
                _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 169);
Y.mix(parser, p, true);
            }
        }
        _yuitest_coverline("build/widget-htmlparser/widget-htmlparser.js", 172);
return parser;
    }
});


}, '3.7.3', {"requires": ["widget-base"]});
