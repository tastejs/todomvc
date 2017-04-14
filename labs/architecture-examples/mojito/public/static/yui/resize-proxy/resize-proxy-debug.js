/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('resize-proxy', function (Y, NAME) {

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


function ResizeProxy() {
    ResizeProxy.superclass.constructor.apply(this, arguments);
}

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
                return Y.Node.create(this.PROXY_TEMPLATE);
            }
        }
    }
});

Y.extend(ResizeProxy, Y.Plugin.Base, {
    /**
     * Template used to create the resize proxy.
     *
     * @property PROXY_TEMPLATE
     * @type {String}
     */
    PROXY_TEMPLATE: '<div class="'+CSS_RESIZE_PROXY+'"></div>',

    initializer: function() {
        var instance = this;

        instance.afterHostEvent('resize:start', instance._afterResizeStart);
        instance.beforeHostMethod('_resize', instance._beforeHostResize);
        instance.afterHostMethod('_resizeEnd', instance._afterHostResizeEnd);
    },

    destructor: function() {
        var instance = this;

        instance.get(PROXY_NODE).remove(true);
    },

    _afterHostResizeEnd: function(event) {
        var instance = this,
            drag = event.dragEvent.target;

        // reseting actXY from drag when drag end
        drag.actXY = [];

        // if proxy is true, hide it on resize end
        instance._syncProxyUI();

        instance.get(PROXY_NODE).hide();
    },

    _afterResizeStart: function() {
        var instance = this;

        instance._renderProxy();
    },

    _beforeHostResize: function(event) {
        var instance = this,
            host = this.get(HOST);

        host._handleResizeAlignEvent(event.dragEvent);

        // if proxy is true _syncProxyUI instead of _syncUI
        instance._syncProxyUI();

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
        var instance = this,
            host = this.get(HOST),
            proxyNode = instance.get(PROXY_NODE);

        if (!proxyNode.inDoc()) {
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
        var instance = this,
            host = this.get(HOST),
            info = host.info,
            activeHandleNode = host.get(ACTIVE_HANDLE_NODE),
            proxyNode = instance.get(PROXY_NODE),
            cursor = activeHandleNode.getStyle(CURSOR);

        proxyNode.show().setStyle(CURSOR, cursor);

        host.delegate.dd.set(DRAG_CURSOR, cursor);

        proxyNode.sizeTo(info.offsetWidth, info.offsetHeight);

        proxyNode.setXY([ info.left, info.top ]);
    }
});

Y.namespace('Plugin');
Y.Plugin.ResizeProxy = ResizeProxy;


}, '3.7.3', {"requires": ["plugin", "resize-base"]});
