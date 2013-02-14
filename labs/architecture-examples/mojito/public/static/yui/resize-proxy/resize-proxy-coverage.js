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
_yuitest_coverage["build/resize-proxy/resize-proxy.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/resize-proxy/resize-proxy.js",
    code: []
};
_yuitest_coverage["build/resize-proxy/resize-proxy.js"].code=["YUI.add('resize-proxy', function (Y, NAME) {","","var ACTIVE_HANDLE_NODE = 'activeHandleNode',","    CURSOR = 'cursor',","    DRAG_CURSOR = 'dragCursor',","    HOST = 'host',","    PARENT_NODE = 'parentNode',","    PROXY = 'proxy',","    PROXY_NODE = 'proxyNode',","    RESIZE = 'resize',","    RESIZE_PROXY = 'resize-proxy',","    WRAPPER = 'wrapper',","","    getCN = Y.ClassNameManager.getClassName,","","    CSS_RESIZE_PROXY = getCN(RESIZE, PROXY);","","","/**","Adds a `proxyNode` attribute and resizes it instead of the actual node. __very similar to DDProxy__","","    var resize = new Y.Resize({","        //Selector of the node to resize","        node: '#demo'","    });","    resize.plug(Y.Plugin.ResizeProxy);","","","@class ResizeProxy","@module resize","@submodule resize-proxy","@constructor","@extends Plugin.Base","@namespace Plugin","*/","","","function ResizeProxy() {","    ResizeProxy.superclass.constructor.apply(this, arguments);","}","","Y.mix(ResizeProxy, {","    NAME: RESIZE_PROXY,","","    NS: PROXY,","","    ATTRS: {","        /**","         * The Resize proxy element.","         *","         * @attribute proxyNode","         * @default Generated using an internal HTML markup","         * @type String|Node","         */","        proxyNode: {","            setter: Y.one,","            valueFn: function() {","                return Y.Node.create(this.PROXY_TEMPLATE);","            }","        }","    }","});","","Y.extend(ResizeProxy, Y.Plugin.Base, {","    /**","     * Template used to create the resize proxy.","     *","     * @property PROXY_TEMPLATE","     * @type {String}","     */","    PROXY_TEMPLATE: '<div class=\"'+CSS_RESIZE_PROXY+'\"></div>',","","    initializer: function() {","        var instance = this;","","        instance.afterHostEvent('resize:start', instance._afterResizeStart);","        instance.beforeHostMethod('_resize', instance._beforeHostResize);","        instance.afterHostMethod('_resizeEnd', instance._afterHostResizeEnd);","    },","","    destructor: function() {","        var instance = this;","","        instance.get(PROXY_NODE).remove(true);","    },","","    _afterHostResizeEnd: function(event) {","        var instance = this,","            drag = event.dragEvent.target;","","        // reseting actXY from drag when drag end","        drag.actXY = [];","","        // if proxy is true, hide it on resize end","        instance._syncProxyUI();","","        instance.get(PROXY_NODE).hide();","    },","","    _afterResizeStart: function() {","        var instance = this;","","        instance._renderProxy();","    },","","    _beforeHostResize: function(event) {","        var instance = this,","            host = this.get(HOST);","","        host._handleResizeAlignEvent(event.dragEvent);","","        // if proxy is true _syncProxyUI instead of _syncUI","        instance._syncProxyUI();","","        return new Y.Do.Prevent();","    },","","    /**","      * Render the <a href=\"ResizeProxy.html#attr_proxyNode\">proxyNode</a> element and","      * make it sibling of the <a href=\"Resize.html#attr_node\">node</a>.","      *","      * @method _renderProxy","      * @protected","      */","    _renderProxy: function() {","        var instance = this,","            host = this.get(HOST),","            proxyNode = instance.get(PROXY_NODE);","","        if (!proxyNode.inDoc()) {","            host.get(WRAPPER).get(PARENT_NODE).append(","                proxyNode.hide()","            );","        }","    },","","    /**","     * Sync the proxy UI with internal values from","     * <a href=\"ResizeProxy.html#property_info\">info</a>.","     *","     * @method _syncProxyUI","     * @protected","     */","    _syncProxyUI: function() {","        var instance = this,","            host = this.get(HOST),","            info = host.info,","            activeHandleNode = host.get(ACTIVE_HANDLE_NODE),","            proxyNode = instance.get(PROXY_NODE),","            cursor = activeHandleNode.getStyle(CURSOR);","","        proxyNode.show().setStyle(CURSOR, cursor);","","        host.delegate.dd.set(DRAG_CURSOR, cursor);","","        proxyNode.sizeTo(info.offsetWidth, info.offsetHeight);","","        proxyNode.setXY([ info.left, info.top ]);","    }","});","","Y.namespace('Plugin');","Y.Plugin.ResizeProxy = ResizeProxy;","","","}, '3.7.3', {\"requires\": [\"plugin\", \"resize-base\"]});"];
_yuitest_coverage["build/resize-proxy/resize-proxy.js"].lines = {"1":0,"3":0,"38":0,"39":0,"42":0,"58":0,"64":0,"74":0,"76":0,"77":0,"78":0,"82":0,"84":0,"88":0,"92":0,"95":0,"97":0,"101":0,"103":0,"107":0,"110":0,"113":0,"115":0,"126":0,"130":0,"131":0,"145":0,"152":0,"154":0,"156":0,"158":0,"162":0,"163":0};
_yuitest_coverage["build/resize-proxy/resize-proxy.js"].functions = {"ResizeProxy:38":0,"valueFn:57":0,"initializer:73":0,"destructor:81":0,"_afterHostResizeEnd:87":0,"_afterResizeStart:100":0,"_beforeHostResize:106":0,"_renderProxy:125":0,"_syncProxyUI:144":0,"(anonymous 1):1":0};
_yuitest_coverage["build/resize-proxy/resize-proxy.js"].coveredLines = 33;
_yuitest_coverage["build/resize-proxy/resize-proxy.js"].coveredFunctions = 10;
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 1);
YUI.add('resize-proxy', function (Y, NAME) {

_yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "(anonymous 1)", 1);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 3);
var ACTIVE_HANDLE_NODE = 'activeHandleNode',
    CURSOR = 'cursor',
    DRAG_CURSOR = 'dragCursor',
    HOST = 'host',
    PARENT_NODE = 'parentNode',
    PROXY = 'proxy',
    PROXY_NODE = 'proxyNode',
    RESIZE = 'resize',
    RESIZE_PROXY = 'resize-proxy',
    WRAPPER = 'wrapper',

    getCN = Y.ClassNameManager.getClassName,

    CSS_RESIZE_PROXY = getCN(RESIZE, PROXY);


/**
Adds a `proxyNode` attribute and resizes it instead of the actual node. __very similar to DDProxy__

    var resize = new Y.Resize({
        //Selector of the node to resize
        node: '#demo'
    });
    resize.plug(Y.Plugin.ResizeProxy);


@class ResizeProxy
@module resize
@submodule resize-proxy
@constructor
@extends Plugin.Base
@namespace Plugin
*/


_yuitest_coverline("build/resize-proxy/resize-proxy.js", 38);
function ResizeProxy() {
    _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "ResizeProxy", 38);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 39);
ResizeProxy.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/resize-proxy/resize-proxy.js", 42);
Y.mix(ResizeProxy, {
    NAME: RESIZE_PROXY,

    NS: PROXY,

    ATTRS: {
        /**
         * The Resize proxy element.
         *
         * @attribute proxyNode
         * @default Generated using an internal HTML markup
         * @type String|Node
         */
        proxyNode: {
            setter: Y.one,
            valueFn: function() {
                _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "valueFn", 57);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 58);
return Y.Node.create(this.PROXY_TEMPLATE);
            }
        }
    }
});

_yuitest_coverline("build/resize-proxy/resize-proxy.js", 64);
Y.extend(ResizeProxy, Y.Plugin.Base, {
    /**
     * Template used to create the resize proxy.
     *
     * @property PROXY_TEMPLATE
     * @type {String}
     */
    PROXY_TEMPLATE: '<div class="'+CSS_RESIZE_PROXY+'"></div>',

    initializer: function() {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "initializer", 73);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 74);
var instance = this;

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 76);
instance.afterHostEvent('resize:start', instance._afterResizeStart);
        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 77);
instance.beforeHostMethod('_resize', instance._beforeHostResize);
        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 78);
instance.afterHostMethod('_resizeEnd', instance._afterHostResizeEnd);
    },

    destructor: function() {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "destructor", 81);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 82);
var instance = this;

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 84);
instance.get(PROXY_NODE).remove(true);
    },

    _afterHostResizeEnd: function(event) {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "_afterHostResizeEnd", 87);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 88);
var instance = this,
            drag = event.dragEvent.target;

        // reseting actXY from drag when drag end
        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 92);
drag.actXY = [];

        // if proxy is true, hide it on resize end
        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 95);
instance._syncProxyUI();

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 97);
instance.get(PROXY_NODE).hide();
    },

    _afterResizeStart: function() {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "_afterResizeStart", 100);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 101);
var instance = this;

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 103);
instance._renderProxy();
    },

    _beforeHostResize: function(event) {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "_beforeHostResize", 106);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 107);
var instance = this,
            host = this.get(HOST);

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 110);
host._handleResizeAlignEvent(event.dragEvent);

        // if proxy is true _syncProxyUI instead of _syncUI
        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 113);
instance._syncProxyUI();

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 115);
return new Y.Do.Prevent();
    },

    /**
      * Render the <a href="ResizeProxy.html#attr_proxyNode">proxyNode</a> element and
      * make it sibling of the <a href="Resize.html#attr_node">node</a>.
      *
      * @method _renderProxy
      * @protected
      */
    _renderProxy: function() {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "_renderProxy", 125);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 126);
var instance = this,
            host = this.get(HOST),
            proxyNode = instance.get(PROXY_NODE);

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 130);
if (!proxyNode.inDoc()) {
            _yuitest_coverline("build/resize-proxy/resize-proxy.js", 131);
host.get(WRAPPER).get(PARENT_NODE).append(
                proxyNode.hide()
            );
        }
    },

    /**
     * Sync the proxy UI with internal values from
     * <a href="ResizeProxy.html#property_info">info</a>.
     *
     * @method _syncProxyUI
     * @protected
     */
    _syncProxyUI: function() {
        _yuitest_coverfunc("build/resize-proxy/resize-proxy.js", "_syncProxyUI", 144);
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 145);
var instance = this,
            host = this.get(HOST),
            info = host.info,
            activeHandleNode = host.get(ACTIVE_HANDLE_NODE),
            proxyNode = instance.get(PROXY_NODE),
            cursor = activeHandleNode.getStyle(CURSOR);

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 152);
proxyNode.show().setStyle(CURSOR, cursor);

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 154);
host.delegate.dd.set(DRAG_CURSOR, cursor);

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 156);
proxyNode.sizeTo(info.offsetWidth, info.offsetHeight);

        _yuitest_coverline("build/resize-proxy/resize-proxy.js", 158);
proxyNode.setXY([ info.left, info.top ]);
    }
});

_yuitest_coverline("build/resize-proxy/resize-proxy.js", 162);
Y.namespace('Plugin');
_yuitest_coverline("build/resize-proxy/resize-proxy.js", 163);
Y.Plugin.ResizeProxy = ResizeProxy;


}, '3.7.3', {"requires": ["plugin", "resize-base"]});
