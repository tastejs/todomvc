/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('editor-tab', function (Y, NAME) {


    /**
     * Handles tab and shift-tab indent/outdent support.
     * @class Plugin.EditorTab
     * @constructor
     * @extends Base
     * @module editor
     * @submodule editor-tab
     */

    var EditorTab = function() {
        EditorTab.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    Y.extend(EditorTab, Y.Base, {
        /**
        * Listener for host's nodeChange event and captures the tabkey interaction.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event facade passed from the host.
        */
        _onNodeChange: function(e) {
            var action = 'indent';

            if (e.changedType === 'tab') {
                if (!e.changedNode.test('li, li *')) {
                    e.changedEvent.halt();
                    e.preventDefault();
                    if (e.changedEvent.shiftKey) {
                        action = 'outdent';
                    }

                    this.get(HOST).execCommand(action, '');
                }
            }
        },
        initializer: function() {
            this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * editorTab
        * @property NAME
        * @static
        */
        NAME: 'editorTab',
        /**
        * tab
        * @property NS
        * @static
        */
        NS: 'tab',
        ATTRS: {
            host: {
                value: false
            }
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorTab = EditorTab;


}, '3.7.3', {"requires": ["editor-base"]});
