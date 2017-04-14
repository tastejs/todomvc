/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dd-drop-plugin', function (Y, NAME) {


       /**
        * Simple Drop plugin that can be attached to a Node via the plug method.
        * @module dd
        * @submodule dd-drop-plugin
        */
       /**
        * Simple Drop plugin that can be attached to a Node via the plug method.
        * @class Drop
        * @extends DD.Drop
        * @constructor
        * @namespace Plugin
        */


        var Drop = function(config) {
            config.node = config.host;
            Drop.superclass.constructor.apply(this, arguments);
        };

        /**
        * @property NAME
        * @description dd-drop-plugin
        * @type {String}
        */
        Drop.NAME = "dd-drop-plugin";
        /**
        * @property NS
        * @description The Drop instance will be placed on the Node instance under the drop namespace. It can be accessed via Node.drop;
        * @type {String}
        */
        Drop.NS = "drop";


        Y.extend(Drop, Y.DD.Drop);
        Y.namespace('Plugin');
        Y.Plugin.Drop = Drop;




}, '3.7.3', {"requires": ["dd-drop"]});
