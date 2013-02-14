/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('scrollview-list', function (Y, NAME) {

/**
 * Provides a plugin, which adds support for a scroll indicator to ScrollView instances
 *
 * @module scrollview-list
 */
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
function ListPlugin() {
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
ListPlugin.NAME = 'pluginList';
    
/**
 * The namespace on which the plugin will reside.
 *
 * @property NS
 * @type String
 * @default 'list'
 * @static
 */
ListPlugin.NS = 'list';


/**
 * The default attribute configuration for the plugin
 *
 * @property ATTRS
 * @type Object
 * @static
 */
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

Y.namespace("Plugin").ScrollViewList = Y.extend(ListPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     */
    initializer: function() {
        this._host = this.get(HOST);
        this.afterHostEvent("render", this._addClassesToList);
    },

    _addClassesToList: function() {
        if (!this.get('isAttached')) {
            var cb = this._host.get(CONTENT_BOX),
            ulList,
            liList;

            if (cb.hasChildNodes()) {
                //get all direct descendants of the UL's that are directly under the content box.
                ulList = cb.all('> ul');
                liList = cb.all('> ul > li');

                //go through the UL's and add the class
                ulList.each(function(list) {
                    list.addClass(LIST_CLASS);
                });

                //go through LI's and add the class
                liList.each(function(item) {
                    item.addClass(ITEM_CLASS);
                });

                this.set('isAttached', true);
                
                // We need to call this again, since sv-list 
                // relies on the "-vert" class, to apply padding.
                // [ 1st syncUI pass applies -vert, 2nd pass re-calcs dims ] 
                this._host.syncUI();
            }
        }
    }

});












}, '3.7.3', {"requires": ["plugin", "classnamemanager"], "skinnable": true});
