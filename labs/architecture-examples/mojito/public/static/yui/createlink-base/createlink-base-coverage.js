/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/createlink-base/createlink-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/createlink-base/createlink-base.js",
    code: []
};
_yuitest_coverage["build/createlink-base/createlink-base.js"].code=["YUI.add('createlink-base', function (Y, NAME) {","","","    /**","     * Adds prompt style link creation. Adds an override for the","     * <a href=\"Plugin.ExecCommand.html#method_COMMANDS.createlink\">createlink execCommand</a>.","     * @class Plugin.CreateLinkBase","     * @static","     * @submodule createlink-base","     * @module editor","     */","","    var CreateLinkBase = {};","    /**","    * Strings used by the plugin","    * @property STRINGS","    * @static","    */","    CreateLinkBase.STRINGS = {","            /**","            * String used for the Prompt","            * @property PROMPT","            * @static","            */","            PROMPT: 'Please enter the URL for the link to point to:',","            /**","            * String used as the default value of the Prompt","            * @property DEFAULT","            * @static","            */","            DEFAULT: 'http://'","    };","","    Y.namespace('Plugin');","    Y.Plugin.CreateLinkBase = CreateLinkBase;","","    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {","        /**","        * Override for the createlink method from the <a href=\"Plugin.CreateLinkBase.html\">CreateLinkBase</a> plugin.","        * @for ExecCommand","        * @method COMMANDS.createlink","        * @static","        * @param {String} cmd The command executed: createlink","        * @return {Node} Node instance of the item touched by this command.","        */","        createlink: function(cmd) {","            var inst = this.get('host').getInstance(), out, a, sel, holder,","                url = prompt(CreateLinkBase.STRINGS.PROMPT, CreateLinkBase.STRINGS.DEFAULT);","","            if (url) {","                holder = inst.config.doc.createElement('div');","                url = url.replace(/\"/g, '').replace(/'/g, ''); //Remove single & double quotes","                url = inst.config.doc.createTextNode(url);","                holder.appendChild(url);","                url = holder.innerHTML;","","","                this.get('host')._execCommand(cmd, url);","                sel = new inst.EditorSelection();","                out = sel.getSelected();","                if (!sel.isCollapsed && out.size()) {","                    //We have a selection","                    a = out.item(0).one('a');","                    if (a) {","                        out.item(0).replace(a);","                    }","                    if (Y.UA.gecko) {","                        if (a.get('parentNode').test('span')) {","                            if (a.get('parentNode').one('br.yui-cursor')) {","                                a.get('parentNode').insert(a, 'before');","                            }","                        }","                    }","                } else {","                    //No selection, insert a new node..","                    this.get('host').execCommand('inserthtml', '<a href=\"' + url + '\">' + url + '</a>');","                }","            }","            return a;","        }","    });","","","","}, '3.7.3', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["build/createlink-base/createlink-base.js"].lines = {"1":0,"13":0,"19":0,"34":0,"35":0,"37":0,"47":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"58":0,"59":0,"60":0,"61":0,"63":0,"64":0,"65":0,"67":0,"68":0,"69":0,"70":0,"76":0,"79":0};
_yuitest_coverage["build/createlink-base/createlink-base.js"].functions = {"createlink:46":0,"(anonymous 1):1":0};
_yuitest_coverage["build/createlink-base/createlink-base.js"].coveredLines = 26;
_yuitest_coverage["build/createlink-base/createlink-base.js"].coveredFunctions = 2;
_yuitest_coverline("build/createlink-base/createlink-base.js", 1);
YUI.add('createlink-base', function (Y, NAME) {


    /**
     * Adds prompt style link creation. Adds an override for the
     * <a href="Plugin.ExecCommand.html#method_COMMANDS.createlink">createlink execCommand</a>.
     * @class Plugin.CreateLinkBase
     * @static
     * @submodule createlink-base
     * @module editor
     */

    _yuitest_coverfunc("build/createlink-base/createlink-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/createlink-base/createlink-base.js", 13);
var CreateLinkBase = {};
    /**
    * Strings used by the plugin
    * @property STRINGS
    * @static
    */
    _yuitest_coverline("build/createlink-base/createlink-base.js", 19);
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

    _yuitest_coverline("build/createlink-base/createlink-base.js", 34);
Y.namespace('Plugin');
    _yuitest_coverline("build/createlink-base/createlink-base.js", 35);
Y.Plugin.CreateLinkBase = CreateLinkBase;

    _yuitest_coverline("build/createlink-base/createlink-base.js", 37);
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
            _yuitest_coverfunc("build/createlink-base/createlink-base.js", "createlink", 46);
_yuitest_coverline("build/createlink-base/createlink-base.js", 47);
var inst = this.get('host').getInstance(), out, a, sel, holder,
                url = prompt(CreateLinkBase.STRINGS.PROMPT, CreateLinkBase.STRINGS.DEFAULT);

            _yuitest_coverline("build/createlink-base/createlink-base.js", 50);
if (url) {
                _yuitest_coverline("build/createlink-base/createlink-base.js", 51);
holder = inst.config.doc.createElement('div');
                _yuitest_coverline("build/createlink-base/createlink-base.js", 52);
url = url.replace(/"/g, '').replace(/'/g, ''); //Remove single & double quotes
                _yuitest_coverline("build/createlink-base/createlink-base.js", 53);
url = inst.config.doc.createTextNode(url);
                _yuitest_coverline("build/createlink-base/createlink-base.js", 54);
holder.appendChild(url);
                _yuitest_coverline("build/createlink-base/createlink-base.js", 55);
url = holder.innerHTML;


                _yuitest_coverline("build/createlink-base/createlink-base.js", 58);
this.get('host')._execCommand(cmd, url);
                _yuitest_coverline("build/createlink-base/createlink-base.js", 59);
sel = new inst.EditorSelection();
                _yuitest_coverline("build/createlink-base/createlink-base.js", 60);
out = sel.getSelected();
                _yuitest_coverline("build/createlink-base/createlink-base.js", 61);
if (!sel.isCollapsed && out.size()) {
                    //We have a selection
                    _yuitest_coverline("build/createlink-base/createlink-base.js", 63);
a = out.item(0).one('a');
                    _yuitest_coverline("build/createlink-base/createlink-base.js", 64);
if (a) {
                        _yuitest_coverline("build/createlink-base/createlink-base.js", 65);
out.item(0).replace(a);
                    }
                    _yuitest_coverline("build/createlink-base/createlink-base.js", 67);
if (Y.UA.gecko) {
                        _yuitest_coverline("build/createlink-base/createlink-base.js", 68);
if (a.get('parentNode').test('span')) {
                            _yuitest_coverline("build/createlink-base/createlink-base.js", 69);
if (a.get('parentNode').one('br.yui-cursor')) {
                                _yuitest_coverline("build/createlink-base/createlink-base.js", 70);
a.get('parentNode').insert(a, 'before');
                            }
                        }
                    }
                } else {
                    //No selection, insert a new node..
                    _yuitest_coverline("build/createlink-base/createlink-base.js", 76);
this.get('host').execCommand('inserthtml', '<a href="' + url + '">' + url + '</a>');
                }
            }
            _yuitest_coverline("build/createlink-base/createlink-base.js", 79);
return a;
        }
    });



}, '3.7.3', {"requires": ["editor-base"]});
