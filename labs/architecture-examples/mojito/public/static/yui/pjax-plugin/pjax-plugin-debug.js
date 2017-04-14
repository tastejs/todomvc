/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('pjax-plugin', function (Y, NAME) {

/**
Node plugin that provides seamless, gracefully degrading pjax functionality.

@module pjax
@submodule pjax-plugin
@since 3.5.0
**/

/**
Node plugin that provides seamless, gracefully degrading pjax functionality.

@class Plugin.Pjax
@extends Pjax
@since 3.5.0
**/

Y.Plugin.Pjax = Y.Base.create('pjaxPlugin', Y.Pjax, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        this.set('container', config.host);
    }
}, {
    NS: 'pjax'
});


}, '3.7.3', {"requires": ["node-pluginhost", "pjax", "plugin"]});
