/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('editor-para-base', function (Y, NAME) {


    /**
     * Base Plugin for Editor to paragraph auto wrapping and correction.
     * @class Plugin.EditorParaBase
     * @extends Base
     * @constructor
     * @module editor
     * @submodule editor-para-base
     */


    var EditorParaBase = function() {
        EditorParaBase.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body',
    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>';


    Y.extend(EditorParaBase, Y.Base, {
        /**
        * Utility method to create an empty paragraph when the document is empty.
        * @private
        * @method _fixFirstPara
        */
        _fixFirstPara: function() {
            Y.log('Fix First Paragraph', 'info', 'editor-para');
            var host = this.get(HOST), inst = host.getInstance(), sel, n,
                body = inst.config.doc.body,
                html = body.innerHTML,
                col = ((html.length) ? true : false);

            if (html === BR) {
                html = '';
                col = false;
            }

            body.innerHTML = '<' + P + '>' + html + inst.EditorSelection.CURSOR + '</' + P + '>';

            n = inst.one(FIRST_P);
            sel = new inst.EditorSelection();

            sel.selectNode(n, true, col);
        },
        /**
        * Performs a block element filter when the Editor is first ready
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            var host = this.get(HOST), inst = host.getInstance(), btag;
            if (inst) {
                inst.EditorSelection.filterBlocks();
                btag = inst.EditorSelection.DEFAULT_BLOCK_TAG;
                FIRST_P = BODY + ' > ' + btag;
                P = btag;
            }
        },
        /**
        * Performs a block element filter when the Editor after an content change
        * @private
        * @method _afterContentChange
        */
        _afterContentChange: function() {
            var host = this.get(HOST), inst = host.getInstance();
            if (inst && inst.EditorSelection) {
                inst.EditorSelection.filterBlocks();
            }
        },
        /**
        * Performs block/paste filtering after paste.
        * @private
        * @method _afterPaste
        */
        _afterPaste: function() {
            var host = this.get(HOST), inst = host.getInstance();

            Y.later(50, host, function() {
                inst.EditorSelection.filterBlocks();
            });

        },
        initializer: function() {
            var host = this.get(HOST);
            if (host.editorBR) {
                Y.error('Can not plug EditorPara and EditorBR at the same time.');
                return;
            }

            host.after('ready', Y.bind(this._afterEditorReady, this));
            host.after('contentChange', Y.bind(this._afterContentChange, this));
            if (Y.Env.webkit) {
                host.after('dom:paste', Y.bind(this._afterPaste, this));
            }
        }
    }, {
        /**
        * editorPara
        * @static
        * @property NAME
        */
        NAME: 'editorParaBase',
        /**
        * editorPara
        * @static
        * @property NS
        */
        NS: 'editorParaBase',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorParaBase = EditorParaBase;




}, '3.7.3', {"requires": ["editor-base"]});
