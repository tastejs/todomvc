/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('createlink-base', function (Y, NAME) {


    /**
     * Adds prompt style link creation. Adds an override for the
     * <a href="Plugin.ExecCommand.html#method_COMMANDS.createlink">createlink execCommand</a>.
     * @class Plugin.CreateLinkBase
     * @static
     * @submodule createlink-base
     * @module editor
     */

    var CreateLinkBase = {};
    /**
    * Strings used by the plugin
    * @property STRINGS
    * @static
    */
    CreateLinkBase.STRINGS = {
            /**
            * String used for the Prompt
            * @property PROMPT
            * @static
            */
            PROMPT: 'Please enter the URL for the link to point to:',
            /**
            * String used as the default value of the Prompt
            * @property DEFAULT
            * @static
            */
            DEFAULT: 'http://'
    };

    Y.namespace('Plugin');
    Y.Plugin.CreateLinkBase = CreateLinkBase;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
        /**
        * Override for the createlink method from the <a href="Plugin.CreateLinkBase.html">CreateLinkBase</a> plugin.
        * @for ExecCommand
        * @method COMMANDS.createlink
        * @static
        * @param {String} cmd The command executed: createlink
        * @return {Node} Node instance of the item touched by this command.
        */
        createlink: function(cmd) {
            var inst = this.get('host').getInstance(), out, a, sel, holder,
                url = prompt(CreateLinkBase.STRINGS.PROMPT, CreateLinkBase.STRINGS.DEFAULT);

            if (url) {
                holder = inst.config.doc.createElement('div');
                url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                url = inst.config.doc.createTextNode(url);
                holder.appendChild(url);
                url = holder.innerHTML;

                Y.log('Adding link: ' + url, 'info', 'createLinkBase');

                this.get('host')._execCommand(cmd, url);
                sel = new inst.EditorSelection();
                out = sel.getSelected();
                if (!sel.isCollapsed && out.size()) {
                    //We have a selection
                    a = out.item(0).one('a');
                    if (a) {
                        out.item(0).replace(a);
                    }
                    if (Y.UA.gecko) {
                        if (a.get('parentNode').test('span')) {
                            if (a.get('parentNode').one('br.yui-cursor')) {
                                a.get('parentNode').insert(a, 'before');
                            }
                        }
                    }
                } else {
                    //No selection, insert a new node..
                    this.get('host').execCommand('inserthtml', '<a href="' + url + '">' + url + '</a>');
                }
            }
            return a;
        }
    });



}, '3.7.3', {"requires": ["editor-base"]});
