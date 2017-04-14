/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('editor-lists', function (Y, NAME) {


    /**
     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support.
     * Adds overrides for the <a href="Plugin.ExecCommand.html#method_COMMANDS.insertorderedlist">insertorderedlist</a>
     * and <a href="Plugin.ExecCommand.html#method_COMMANDS.insertunorderedlist">insertunorderedlist</a> execCommands.
     * @class Plugin.EditorLists
     * @constructor
     * @extends Base
     * @module editor
     * @submodule editor-lists
     */

    var EditorLists = function() {
        EditorLists.superclass.constructor.apply(this, arguments);
    }, LI = 'li', OL = 'ol', UL = 'ul', HOST = 'host';

    Y.extend(EditorLists, Y.Base, {
        /**
        * Listener for host's nodeChange event and captures the tabkey interaction only when inside a list node.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event facade passed from the host.
        */
        _onNodeChange: function(e) {
            var inst = this.get(HOST).getInstance(), li,
                newList, sTab, par, moved = false, tag, focusEnd = false;

            if (e.changedType === 'tab') {
                if (e.changedNode.test(LI + ', ' + LI + ' *')) {
                    e.changedEvent.halt();
                    e.preventDefault();
                    li = e.changedNode;
                    sTab = e.changedEvent.shiftKey;
                    par = li.ancestor(OL + ',' + UL);
                    tag = UL;

                    if (par.get('tagName').toLowerCase() === OL) {
                        tag = OL;
                    }

                    if (!li.test(LI)) {
                        li = li.ancestor(LI);
                    }
                    if (sTab) {
                        if (li.ancestor(LI)) {
                            li.ancestor(LI).insert(li, 'after');
                            moved = true;
                            focusEnd = true;
                        }
                    } else {
                        //li.setStyle('border', '1px solid red');
                        if (li.previous(LI)) {
                            newList = inst.Node.create('<' + tag + '></' + tag + '>');
                            li.previous(LI).append(newList);
                            newList.append(li);
                            moved = true;
                        }
                    }
                }
                if (moved) {
                    if (!li.test(LI)) {
                        li = li.ancestor(LI);
                    }
                    li.all(EditorLists.REMOVE).remove();
                    if (Y.UA.ie) {
                        li = li.append(EditorLists.NON).one(EditorLists.NON_SEL);
                    }
                    //Selection here..
                    (new inst.EditorSelection()).selectNode(li, true, focusEnd);
                }
            }
        },
        initializer: function() {
            this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * The non element placeholder, used for positioning the cursor and filling empty items
        * @property REMOVE
        * @static
        */
        NON: '<span class="yui-non">&nbsp;</span>',
        /**
        * The selector query to get all non elements
        * @property NONSEL
        * @static
        */
        NON_SEL: 'span.yui-non',
        /**
        * The items to removed from a list when a list item is moved, currently removes BR nodes
        * @property REMOVE
        * @static
        */
        REMOVE: 'br',
        /**
        * editorLists
        * @property NAME
        * @static
        */
        NAME: 'editorLists',
        /**
        * lists
        * @property NS
        * @static
        */
        NS: 'lists',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorLists = EditorLists;



}, '3.7.3', {"requires": ["editor-base"]});
