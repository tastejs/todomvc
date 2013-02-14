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
_yuitest_coverage["build/intl/intl.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/intl/intl.js",
    code: []
};
_yuitest_coverage["build/intl/intl.js"].code=["YUI.add('intl', function (Y, NAME) {","","var _mods = {},","","    ROOT_LANG = \"yuiRootLang\",","    ACTIVE_LANG = \"yuiActiveLang\",","    NONE = [];","","/**"," * Provides utilities to support the management of localized resources (strings and formatting patterns)."," *"," * @module intl"," */","","/**"," * The Intl utility provides a central location for managing sets of localized resources (strings and formatting patterns)."," *"," * @class Intl"," * @uses EventTarget"," * @static"," */","Y.mix(Y.namespace(\"Intl\"), {","","    /**","     * Private method to retrieve the language hash for a given module.","     *","     * @method _mod","     * @private","     *","     * @param {String} module The name of the module","     * @return {Object} The hash of localized resources for the module, keyed by BCP language tag","     */","    _mod : function(module) {","        if (!_mods[module]) {","            _mods[module] = {};","        }","        return _mods[module];","    },","","    /**","     * Sets the active language for the given module.","     *","     * Returns false on failure, which would happen if the language had not been registered through the <a href=\"#method_add\">add()</a> method.","     *","     * @method setLang","     *","     * @param {String} module The module name.","     * @param {String} lang The BCP 47 language tag.","     * @return boolean true if successful, false if not.","     */","    setLang : function(module, lang) {","        var langs = this._mod(module),","            currLang = langs[ACTIVE_LANG],","            exists = !!langs[lang];","","        if (exists && lang !== currLang) {","            langs[ACTIVE_LANG] = lang;","            this.fire(\"intl:langChange\", {module: module, prevVal: currLang, newVal: (lang === ROOT_LANG) ? \"\" : lang});","        }","","        return exists;","    },","","    /**","     * Get the currently active language for the given module.","     *","     * @method getLang","     *","     * @param {String} module The module name.","     * @return {String} The BCP 47 language tag.","     */","    getLang : function(module) {","        var lang = this._mod(module)[ACTIVE_LANG];","        return (lang === ROOT_LANG) ? \"\" : lang;","    },","","    /**","     * Register a hash of localized resources for the given module and language","     *","     * @method add","     *","     * @param {String} module The module name.","     * @param {String} lang The BCP 47 language tag.","     * @param {Object} strings The hash of localized values, keyed by the string name.","     */","    add : function(module, lang, strings) {","        lang = lang || ROOT_LANG;","        this._mod(module)[lang] = strings;","        this.setLang(module, lang);","    },","","    /**","     * Gets the module's localized resources for the currently active language (as provided by the <a href=\"#method_getLang\">getLang</a> method).","     * <p>","     * Optionally, the localized resources for alternate languages which have been added to Intl (see the <a href=\"#method_add\">add</a> method) can","     * be retrieved by providing the BCP 47 language tag as the lang parameter.","     * </p>","     * @method get","     *","     * @param {String} module The module name.","     * @param {String} key Optional. A single resource key. If not provided, returns a copy (shallow clone) of all resources.","     * @param {String} lang Optional. The BCP 47 language tag. If not provided, the module's currently active language is used.","     * @return String | Object A copy of the module's localized resources, or a single value if key is provided.","     */","    get : function(module, key, lang) {","        var mod = this._mod(module),","            strs;","","        lang = lang || mod[ACTIVE_LANG];","        strs = mod[lang] || {};","","        return (key) ? strs[key] : Y.merge(strs);","    },","","    /**","     * Gets the list of languages for which localized resources are available for a given module, based on the module","     * meta-data (part of loader). If loader is not on the page, returns an empty array.","     *","     * @method getAvailableLangs","     * @param {String} module The name of the module","     * @return {Array} The array of languages available.","     */","    getAvailableLangs : function(module) {","        var loader = Y.Env._loader,","            mod = loader && loader.moduleInfo[module],","            langs = mod && mod.lang;","        return (langs) ? langs.concat() : NONE;","","    }","});","","Y.augment(Y.Intl, Y.EventTarget);","","/**"," * Notification event to indicate when the lang for a module has changed. There is no default behavior associated with this event,"," * so the on and after moments are equivalent."," *"," * @event intl:langChange"," * @param {EventFacade} e The event facade"," * <p>The event facade contains:</p>"," * <dl>"," *     <dt>module</dt><dd>The name of the module for which the language changed</dd>"," *     <dt>newVal</dt><dd>The new language tag</dd>"," *     <dt>prevVal</dt><dd>The current language tag</dd>"," * </dl>"," */","Y.Intl.publish(\"intl:langChange\", {emitFacade:true});","","","}, '3.7.3', {\"requires\": [\"intl-base\", \"event-custom\"]});"];
_yuitest_coverage["build/intl/intl.js"].lines = {"1":0,"3":0,"22":0,"34":0,"35":0,"37":0,"52":0,"56":0,"57":0,"58":0,"61":0,"73":0,"74":0,"87":0,"88":0,"89":0,"106":0,"109":0,"110":0,"112":0,"124":0,"127":0,"132":0,"147":0};
_yuitest_coverage["build/intl/intl.js"].functions = {"_mod:33":0,"setLang:51":0,"getLang:72":0,"add:86":0,"get:105":0,"getAvailableLangs:123":0,"(anonymous 1):1":0};
_yuitest_coverage["build/intl/intl.js"].coveredLines = 24;
_yuitest_coverage["build/intl/intl.js"].coveredFunctions = 7;
_yuitest_coverline("build/intl/intl.js", 1);
YUI.add('intl', function (Y, NAME) {

_yuitest_coverfunc("build/intl/intl.js", "(anonymous 1)", 1);
_yuitest_coverline("build/intl/intl.js", 3);
var _mods = {},

    ROOT_LANG = "yuiRootLang",
    ACTIVE_LANG = "yuiActiveLang",
    NONE = [];

/**
 * Provides utilities to support the management of localized resources (strings and formatting patterns).
 *
 * @module intl
 */

/**
 * The Intl utility provides a central location for managing sets of localized resources (strings and formatting patterns).
 *
 * @class Intl
 * @uses EventTarget
 * @static
 */
_yuitest_coverline("build/intl/intl.js", 22);
Y.mix(Y.namespace("Intl"), {

    /**
     * Private method to retrieve the language hash for a given module.
     *
     * @method _mod
     * @private
     *
     * @param {String} module The name of the module
     * @return {Object} The hash of localized resources for the module, keyed by BCP language tag
     */
    _mod : function(module) {
        _yuitest_coverfunc("build/intl/intl.js", "_mod", 33);
_yuitest_coverline("build/intl/intl.js", 34);
if (!_mods[module]) {
            _yuitest_coverline("build/intl/intl.js", 35);
_mods[module] = {};
        }
        _yuitest_coverline("build/intl/intl.js", 37);
return _mods[module];
    },

    /**
     * Sets the active language for the given module.
     *
     * Returns false on failure, which would happen if the language had not been registered through the <a href="#method_add">add()</a> method.
     *
     * @method setLang
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     * @return boolean true if successful, false if not.
     */
    setLang : function(module, lang) {
        _yuitest_coverfunc("build/intl/intl.js", "setLang", 51);
_yuitest_coverline("build/intl/intl.js", 52);
var langs = this._mod(module),
            currLang = langs[ACTIVE_LANG],
            exists = !!langs[lang];

        _yuitest_coverline("build/intl/intl.js", 56);
if (exists && lang !== currLang) {
            _yuitest_coverline("build/intl/intl.js", 57);
langs[ACTIVE_LANG] = lang;
            _yuitest_coverline("build/intl/intl.js", 58);
this.fire("intl:langChange", {module: module, prevVal: currLang, newVal: (lang === ROOT_LANG) ? "" : lang});
        }

        _yuitest_coverline("build/intl/intl.js", 61);
return exists;
    },

    /**
     * Get the currently active language for the given module.
     *
     * @method getLang
     *
     * @param {String} module The module name.
     * @return {String} The BCP 47 language tag.
     */
    getLang : function(module) {
        _yuitest_coverfunc("build/intl/intl.js", "getLang", 72);
_yuitest_coverline("build/intl/intl.js", 73);
var lang = this._mod(module)[ACTIVE_LANG];
        _yuitest_coverline("build/intl/intl.js", 74);
return (lang === ROOT_LANG) ? "" : lang;
    },

    /**
     * Register a hash of localized resources for the given module and language
     *
     * @method add
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     * @param {Object} strings The hash of localized values, keyed by the string name.
     */
    add : function(module, lang, strings) {
        _yuitest_coverfunc("build/intl/intl.js", "add", 86);
_yuitest_coverline("build/intl/intl.js", 87);
lang = lang || ROOT_LANG;
        _yuitest_coverline("build/intl/intl.js", 88);
this._mod(module)[lang] = strings;
        _yuitest_coverline("build/intl/intl.js", 89);
this.setLang(module, lang);
    },

    /**
     * Gets the module's localized resources for the currently active language (as provided by the <a href="#method_getLang">getLang</a> method).
     * <p>
     * Optionally, the localized resources for alternate languages which have been added to Intl (see the <a href="#method_add">add</a> method) can
     * be retrieved by providing the BCP 47 language tag as the lang parameter.
     * </p>
     * @method get
     *
     * @param {String} module The module name.
     * @param {String} key Optional. A single resource key. If not provided, returns a copy (shallow clone) of all resources.
     * @param {String} lang Optional. The BCP 47 language tag. If not provided, the module's currently active language is used.
     * @return String | Object A copy of the module's localized resources, or a single value if key is provided.
     */
    get : function(module, key, lang) {
        _yuitest_coverfunc("build/intl/intl.js", "get", 105);
_yuitest_coverline("build/intl/intl.js", 106);
var mod = this._mod(module),
            strs;

        _yuitest_coverline("build/intl/intl.js", 109);
lang = lang || mod[ACTIVE_LANG];
        _yuitest_coverline("build/intl/intl.js", 110);
strs = mod[lang] || {};

        _yuitest_coverline("build/intl/intl.js", 112);
return (key) ? strs[key] : Y.merge(strs);
    },

    /**
     * Gets the list of languages for which localized resources are available for a given module, based on the module
     * meta-data (part of loader). If loader is not on the page, returns an empty array.
     *
     * @method getAvailableLangs
     * @param {String} module The name of the module
     * @return {Array} The array of languages available.
     */
    getAvailableLangs : function(module) {
        _yuitest_coverfunc("build/intl/intl.js", "getAvailableLangs", 123);
_yuitest_coverline("build/intl/intl.js", 124);
var loader = Y.Env._loader,
            mod = loader && loader.moduleInfo[module],
            langs = mod && mod.lang;
        _yuitest_coverline("build/intl/intl.js", 127);
return (langs) ? langs.concat() : NONE;

    }
});

_yuitest_coverline("build/intl/intl.js", 132);
Y.augment(Y.Intl, Y.EventTarget);

/**
 * Notification event to indicate when the lang for a module has changed. There is no default behavior associated with this event,
 * so the on and after moments are equivalent.
 *
 * @event intl:langChange
 * @param {EventFacade} e The event facade
 * <p>The event facade contains:</p>
 * <dl>
 *     <dt>module</dt><dd>The name of the module for which the language changed</dd>
 *     <dt>newVal</dt><dd>The new language tag</dd>
 *     <dt>prevVal</dt><dd>The current language tag</dd>
 * </dl>
 */
_yuitest_coverline("build/intl/intl.js", 147);
Y.Intl.publish("intl:langChange", {emitFacade:true});


}, '3.7.3', {"requires": ["intl-base", "event-custom"]});
