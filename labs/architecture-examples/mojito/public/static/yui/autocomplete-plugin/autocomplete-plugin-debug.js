/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('autocomplete-plugin', function (Y, NAME) {

/**
Binds an AutoCompleteList instance to a Node instance.

@module autocomplete
@submodule autocomplete-plugin
**/

/**
Binds an AutoCompleteList instance to a Node instance.

@example

    Y.one('#my-input').plug(Y.Plugin.AutoComplete, {
        source: 'select * from search.suggest where query="{query}"'
    });

    // You can now access the AutoCompleteList instance at Y.one('#my-input').ac

@class Plugin.AutoComplete
@extends AutoCompleteList
**/

var Plugin = Y.Plugin;

function ACListPlugin(config) {
    config.inputNode = config.host;

    // Render by default.
    if (!config.render && config.render !== false) {
      config.render = true;
    }

    ACListPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ACListPlugin, Y.AutoCompleteList, {}, {
    NAME      : 'autocompleteListPlugin',
    NS        : 'ac',
    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')
});

Plugin.AutoComplete     = ACListPlugin;
Plugin.AutoCompleteList = ACListPlugin;


}, '3.7.3', {"requires": ["autocomplete-list", "node-pluginhost"]});
