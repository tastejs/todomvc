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
_yuitest_coverage["build/intl-base/intl-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/intl-base/intl-base.js",
    code: []
};
_yuitest_coverage["build/intl-base/intl-base.js"].code=["YUI.add('intl-base', function (Y, NAME) {","","/**"," * The Intl utility provides a central location for managing sets of"," * localized resources (strings and formatting patterns)."," *"," * @class Intl"," * @uses EventTarget"," * @static"," */","","var SPLIT_REGEX = /[, ]/;","","Y.mix(Y.namespace('Intl'), {",""," /**","    * Returns the language among those available that","    * best matches the preferred language list, using the Lookup","    * algorithm of BCP 47.","    * If none of the available languages meets the user's preferences,","    * then \"\" is returned.","    * Extended language ranges are not supported.","    *","    * @method lookupBestLang","    * @param {String[] | String} preferredLanguages The list of preferred","    * languages in descending preference order, represented as BCP 47","    * language tags. A string array or a comma-separated list.","    * @param {String[]} availableLanguages The list of languages","    * that the application supports, represented as BCP 47 language","    * tags.","    *","    * @return {String} The available language that best matches the","    * preferred language list, or \"\".","    * @since 3.1.0","    */","    lookupBestLang: function(preferredLanguages, availableLanguages) {","","        var i, language, result, index;","","        // check whether the list of available languages contains language;","        // if so return it","        function scan(language) {","            var i;","            for (i = 0; i < availableLanguages.length; i += 1) {","                if (language.toLowerCase() ===","                            availableLanguages[i].toLowerCase()) {","                    return availableLanguages[i];","                }","            }","        }","","        if (Y.Lang.isString(preferredLanguages)) {","            preferredLanguages = preferredLanguages.split(SPLIT_REGEX);","        }","","        for (i = 0; i < preferredLanguages.length; i += 1) {","            language = preferredLanguages[i];","            if (!language || language === '*') {","                continue;","            }","            // check the fallback sequence for one language","            while (language.length > 0) {","                result = scan(language);","                if (result) {","                    return result;","                } else {","                    index = language.lastIndexOf('-');","                    if (index >= 0) {","                        language = language.substring(0, index);","                        // one-character subtags get cut along with the","                        // following subtag","                        if (index >= 2 && language.charAt(index - 2) === '-') {","                            language = language.substring(0, index - 2);","                        }","                    } else {","                        // nothing available for this language","                        break;","                    }","                }","            }","        }","","        return '';","    }","});","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/intl-base/intl-base.js"].lines = {"1":0,"12":0,"14":0,"38":0,"42":0,"43":0,"44":0,"45":0,"47":0,"52":0,"53":0,"56":0,"57":0,"58":0,"59":0,"62":0,"63":0,"64":0,"65":0,"67":0,"68":0,"69":0,"72":0,"73":0,"77":0,"83":0};
_yuitest_coverage["build/intl-base/intl-base.js"].functions = {"scan:42":0,"lookupBestLang:36":0,"(anonymous 1):1":0};
_yuitest_coverage["build/intl-base/intl-base.js"].coveredLines = 26;
_yuitest_coverage["build/intl-base/intl-base.js"].coveredFunctions = 3;
_yuitest_coverline("build/intl-base/intl-base.js", 1);
YUI.add('intl-base', function (Y, NAME) {

/**
 * The Intl utility provides a central location for managing sets of
 * localized resources (strings and formatting patterns).
 *
 * @class Intl
 * @uses EventTarget
 * @static
 */

_yuitest_coverfunc("build/intl-base/intl-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/intl-base/intl-base.js", 12);
var SPLIT_REGEX = /[, ]/;

_yuitest_coverline("build/intl-base/intl-base.js", 14);
Y.mix(Y.namespace('Intl'), {

 /**
    * Returns the language among those available that
    * best matches the preferred language list, using the Lookup
    * algorithm of BCP 47.
    * If none of the available languages meets the user's preferences,
    * then "" is returned.
    * Extended language ranges are not supported.
    *
    * @method lookupBestLang
    * @param {String[] | String} preferredLanguages The list of preferred
    * languages in descending preference order, represented as BCP 47
    * language tags. A string array or a comma-separated list.
    * @param {String[]} availableLanguages The list of languages
    * that the application supports, represented as BCP 47 language
    * tags.
    *
    * @return {String} The available language that best matches the
    * preferred language list, or "".
    * @since 3.1.0
    */
    lookupBestLang: function(preferredLanguages, availableLanguages) {

        _yuitest_coverfunc("build/intl-base/intl-base.js", "lookupBestLang", 36);
_yuitest_coverline("build/intl-base/intl-base.js", 38);
var i, language, result, index;

        // check whether the list of available languages contains language;
        // if so return it
        _yuitest_coverline("build/intl-base/intl-base.js", 42);
function scan(language) {
            _yuitest_coverfunc("build/intl-base/intl-base.js", "scan", 42);
_yuitest_coverline("build/intl-base/intl-base.js", 43);
var i;
            _yuitest_coverline("build/intl-base/intl-base.js", 44);
for (i = 0; i < availableLanguages.length; i += 1) {
                _yuitest_coverline("build/intl-base/intl-base.js", 45);
if (language.toLowerCase() ===
                            availableLanguages[i].toLowerCase()) {
                    _yuitest_coverline("build/intl-base/intl-base.js", 47);
return availableLanguages[i];
                }
            }
        }

        _yuitest_coverline("build/intl-base/intl-base.js", 52);
if (Y.Lang.isString(preferredLanguages)) {
            _yuitest_coverline("build/intl-base/intl-base.js", 53);
preferredLanguages = preferredLanguages.split(SPLIT_REGEX);
        }

        _yuitest_coverline("build/intl-base/intl-base.js", 56);
for (i = 0; i < preferredLanguages.length; i += 1) {
            _yuitest_coverline("build/intl-base/intl-base.js", 57);
language = preferredLanguages[i];
            _yuitest_coverline("build/intl-base/intl-base.js", 58);
if (!language || language === '*') {
                _yuitest_coverline("build/intl-base/intl-base.js", 59);
continue;
            }
            // check the fallback sequence for one language
            _yuitest_coverline("build/intl-base/intl-base.js", 62);
while (language.length > 0) {
                _yuitest_coverline("build/intl-base/intl-base.js", 63);
result = scan(language);
                _yuitest_coverline("build/intl-base/intl-base.js", 64);
if (result) {
                    _yuitest_coverline("build/intl-base/intl-base.js", 65);
return result;
                } else {
                    _yuitest_coverline("build/intl-base/intl-base.js", 67);
index = language.lastIndexOf('-');
                    _yuitest_coverline("build/intl-base/intl-base.js", 68);
if (index >= 0) {
                        _yuitest_coverline("build/intl-base/intl-base.js", 69);
language = language.substring(0, index);
                        // one-character subtags get cut along with the
                        // following subtag
                        _yuitest_coverline("build/intl-base/intl-base.js", 72);
if (index >= 2 && language.charAt(index - 2) === '-') {
                            _yuitest_coverline("build/intl-base/intl-base.js", 73);
language = language.substring(0, index - 2);
                        }
                    } else {
                        // nothing available for this language
                        _yuitest_coverline("build/intl-base/intl-base.js", 77);
break;
                    }
                }
            }
        }

        _yuitest_coverline("build/intl-base/intl-base.js", 83);
return '';
    }
});


}, '3.7.3', {"requires": ["yui-base"]});
