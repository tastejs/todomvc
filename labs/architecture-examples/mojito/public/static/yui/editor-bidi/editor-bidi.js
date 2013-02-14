/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('editor-bidi', function (Y, NAME) {


    /**
     * Plugin for Editor to support BiDirectional (bidi) text operations.
     * @class Plugin.EditorBidi
     * @extends Base
     * @constructor
     * @module editor
     * @submodule editor-bidi
     */


    var EditorBidi = function() {
        EditorBidi.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', DIR = 'dir', BODY = 'BODY', NODE_CHANGE = 'nodeChange',
    B_C_CHANGE = 'bidiContextChange', STYLE = 'style';

    Y.extend(EditorBidi, Y.Base, {
        /**
        * Place holder for the last direction when checking for a switch
        * @private
        * @property lastDirection
        */
        lastDirection: null,
        /**
        * Tells us that an initial bidi check has already been performed
        * @private
        * @property firstEvent
        */
        firstEvent: null,

        /**
        * Method checks to see if the direction of the text has changed based on a nodeChange event.
        * @private
        * @method _checkForChange
        */
        _checkForChange: function() {
            var host = this.get(HOST),
                inst = host.getInstance(),
                sel = new inst.EditorSelection(),
                node, direction;

            if (sel.isCollapsed) {
                node = EditorBidi.blockParent(sel.focusNode);
                if (node) {
                    direction = node.getStyle('direction');
                    if (direction !== this.lastDirection) {
                        host.fire(B_C_CHANGE, { changedTo: direction });
                        this.lastDirection = direction;
                    }
                }
            } else {
                host.fire(B_C_CHANGE, { changedTo: 'select' });
                this.lastDirection = null;
            }
        },

        /**
        * Checked for a change after a specific nodeChange event has been fired.
        * @private
        * @method _afterNodeChange
        */
        _afterNodeChange: function(e) {
            // If this is the first event ever, or an event that can result in a context change
            if (this.firstEvent || EditorBidi.EVENTS[e.changedType]) {
                this._checkForChange();
                this.firstEvent = false;
            }
        },

        /**
        * Checks for a direction change after a mouseup occurs.
        * @private
        * @method _afterMouseUp
        */
        _afterMouseUp: function() {
            this._checkForChange();
            this.firstEvent = false;
        },
        initializer: function() {
            var host = this.get(HOST);

            this.firstEvent = true;

            host.after(NODE_CHANGE, Y.bind(this._afterNodeChange, this));
            host.after('dom:mouseup', Y.bind(this._afterMouseUp, this));
        }
    }, {
        /**
        * The events to check for a direction change on
        * @property EVENTS
        * @static
        */
        EVENTS: {
            'backspace-up': true,
            'pageup-up': true,
            'pagedown-down': true,
            'end-up': true,
            'home-up': true,
            'left-up': true,
            'up-up': true,
            'right-up': true,
            'down-up': true,
            'delete-up': true
        },

        /**
        * More elements may be needed. BODY *must* be in the list to take care of the special case.
        *
        * blockParent could be changed to use inst.EditorSelection.BLOCKS
        * instead, but that would make Y.Plugin.EditorBidi.blockParent
        * unusable in non-RTE contexts (it being usable is a nice
        * side-effect).
        * @property BLOCKS
        * @static
        */
        //BLOCKS: Y.EditorSelection.BLOCKS+',LI,HR,' + BODY,
        BLOCKS: Y.EditorSelection.BLOCKS,
        /**
        * Template for creating a block element
        * @static
        * @property DIV_WRAPPER
        */
        DIV_WRAPPER: '<DIV></DIV>',
        /**
        * Returns a block parent for a given element
        * @static
        * @method blockParent
        */
        blockParent: function(node, wrap) {
            var parent = node, divNode, firstChild;

            if (!parent) {
                parent = Y.one(BODY);
            }

            if (!parent.test(EditorBidi.BLOCKS)) {
                parent = parent.ancestor(EditorBidi.BLOCKS);
            }
            if (wrap && parent.test(BODY)) {
                // This shouldn't happen if the RTE handles everything
                // according to spec: we should get to a P before BODY. But
                // we don't want to set the direction of BODY even if that
                // happens, so we wrap everything in a DIV.

                // The code is based on YUI3's Y.EditorSelection._wrapBlock function.
                divNode = Y.Node.create(EditorBidi.DIV_WRAPPER);
                parent.get('children').each(function(node, index) {
                    if (index === 0) {
                        firstChild = node;
                    } else {
                        divNode.append(node);
                    }
                });
                firstChild.replace(divNode);
                divNode.prepend(firstChild);
                parent = divNode;
            }
            return parent;
        },
        /**
        * The data key to store on the node.
        * @static
        * @property _NODE_SELECTED
        */
        _NODE_SELECTED: 'bidiSelected',
        /**
        * Generates a list of all the block parents of the current NodeList
        * @static
        * @method addParents
        */
        addParents: function(nodeArray) {
            var i, parent, addParent;
                tester = function(sibling) {
                    if (!sibling.getData(EditorBidi._NODE_SELECTED)) {
                        addParent = false;
                        return true; // stop more processing
                    }
                };

            for (i = 0; i < nodeArray.length; i += 1) {
                nodeArray[i].setData(EditorBidi._NODE_SELECTED, true);
            }

            // This works automagically, since new parents added get processed
            // later themselves. So if there's a node early in the process that
            // we haven't discovered some of its siblings yet, thus resulting in
            // its parent not added, the parent will be added later, since those
            // siblings will be added to the array and then get processed.
            for (i = 0; i < nodeArray.length; i += 1) {
                parent = nodeArray[i].get('parentNode');

                // Don't add the parent if the parent is the BODY element.
                // We don't want to change the direction of BODY. Also don't
                // do it if the parent is already in the list.
                if (!parent.test(BODY) && !parent.getData(EditorBidi._NODE_SELECTED)) {
                    addParent = true;
                    parent.get('children').some(tester);
                    if (addParent) {
                        nodeArray.push(parent);
                        parent.setData(EditorBidi._NODE_SELECTED, true);
                    }
                }
            }

            for (i = 0; i < nodeArray.length; i += 1) {
                nodeArray[i].clearData(EditorBidi._NODE_SELECTED);
            }

            return nodeArray;
        },


        /**
        * editorBidi
        * @static
        * @property NAME
        */
        NAME: 'editorBidi',
        /**
        * editorBidi
        * @static
        * @property NS
        */
        NS: 'editorBidi',
        ATTRS: {
            host: {
                value: false
            }
        },
        /**
        * Regex for testing/removing text-align style from an element
        * @static
        * @property RE_TEXT_ALIGN
        */
        RE_TEXT_ALIGN: /text-align:\s*\w*\s*;/,
        /**
        * Method to test a node's style attribute for text-align and removing it.
        * @static
        * @method removeTextAlign
        */
        removeTextAlign: function(n) {
            if (n) {
                if (n.getAttribute(STYLE).match(EditorBidi.RE_TEXT_ALIGN)) {
                    n.setAttribute(STYLE, n.getAttribute(STYLE).replace(EditorBidi.RE_TEXT_ALIGN, ''));
                }
                if (n.hasAttribute('align')) {
                    n.removeAttribute('align');
                }
            }
            return n;
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorBidi = EditorBidi;

    /**
     * bidi execCommand override for setting the text direction of a node.
     * This property is added to the `Y.Plugin.ExecCommands.COMMANDS`
     * collection.
     *
     * @for Plugin.ExecCommand
     * @property bidi
     */
    //TODO -- This should not add this command unless the plugin is added to the instance..
    Y.Plugin.ExecCommand.COMMANDS.bidi = function(cmd, direction) {
        var inst = this.getInstance(),
            sel = new inst.EditorSelection(),
            ns = this.get(HOST).get(HOST).editorBidi,
            returnValue, block, b,
            selected, selectedBlocks, dir;

        if (!ns) {
            Y.error('bidi execCommand is not available without the EditorBiDi plugin.');
            return;
        }

        inst.EditorSelection.filterBlocks();

        if (sel.isCollapsed) { // No selection
            block = EditorBidi.blockParent(sel.anchorNode);
            if (!block) {
                block = inst.one('body').one(inst.EditorSelection.BLOCKS);
            }
            //Remove text-align attribute if it exists
            block = EditorBidi.removeTextAlign(block);
            if (!direction) {
                //If no direction is set, auto-detect the proper setting to make it "toggle"
                dir = block.getAttribute(DIR);
                if (!dir || dir === 'ltr') {
                    direction = 'rtl';
                } else {
                    direction = 'ltr';
                }
            }
            block.setAttribute(DIR, direction);
            if (Y.UA.ie) {
                b = block.all('br.yui-cursor');
                if (b.size() === 1 && block.get('childNodes').size() === 1) {
                    b.remove();
                }
            }
            returnValue = block;
        } else { // some text is selected
            selected = sel.getSelected();
            selectedBlocks = [];
            selected.each(function(node) {
                selectedBlocks.push(EditorBidi.blockParent(node));
            });
            selectedBlocks = inst.all(EditorBidi.addParents(selectedBlocks));
            selectedBlocks.each(function(n) {
                var d = direction;
                //Remove text-align attribute if it exists
                n = EditorBidi.removeTextAlign(n);
                if (!d) {
                    dir = n.getAttribute(DIR);
                    if (!dir || dir === 'ltr') {
                        d = 'rtl';
                    } else {
                        d = 'ltr';
                    }
                }
                n.setAttribute(DIR, d);
            });
            returnValue = selectedBlocks;
        }
        ns._checkForChange();
        return returnValue;
    };




}, '3.7.3', {"requires": ["editor-base"]});
