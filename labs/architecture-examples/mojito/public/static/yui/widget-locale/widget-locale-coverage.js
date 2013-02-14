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
_yuitest_coverage["build/widget-locale/widget-locale.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-locale/widget-locale.js",
    code: []
};
_yuitest_coverage["build/widget-locale/widget-locale.js"].code=["YUI.add('widget-locale', function (Y, NAME) {","","/**"," * Provides string support for widget with BCP 47 language tag lookup. This module has been deprecated. It's replaced by the \"intl\" module which provides generic internationalization and BCP 47 language tag support with externalization."," *"," * @module widget-locale"," * @deprecated This module has been deprecated. It's replaced by the \"intl\" module which provides generic internationalization and BCP 47 language tag support with externalization."," */","var TRUE = true,","    LOCALE = \"locale\",","    INIT_VALUE = \"initValue\",","    HYPHEN = \"-\",","    EMPTY_STR = \"\",","    Widget = Y.Widget;","","/**"," * @attribute locale"," * @deprecated Use Y.config.lang and Y.Intl externalization support"," * @description"," * The default locale for the widget. NOTE: Using get/set on the \"strings\" attribute will"," * return/set strings for this locale."," * @default \"en\""," * @type String"," */","Widget.ATTRS[LOCALE] = {","    value: \"en\"","};","","// Since strings support with locale needs the private _strs setup","Widget.ATTRS.strings.lazyAdd = false;","","Y.mix(Widget.prototype, {","","    /**","     * Sets strings for a particular locale, merging with any existing","     * strings which may already be defined for the locale.","     *","     * @method _setStrings","     * @protected","     * @param {Object} strings The hash of string key/values to set","     * @param {Object} locale The locale for the string values being set","     */","    _setStrings : function(strings, locale) {","        var strs = this._strs;","        locale = locale.toLowerCase();","","        if (!strs[locale]) {","            strs[locale] = {};","        }","","        Y.aggregate(strs[locale], strings, TRUE);","        return strs[locale];","    },","","    /**","     * Returns the strings key/value hash for a paricular locale, without locale lookup applied.","     *","     * @method _getStrings","     * @protected","     * @param {Object} locale","     */","    _getStrings : function(locale) {","        return this._strs[locale.toLowerCase()];","    },","","    /**","     * Gets the entire strings hash for a particular locale, performing locale lookup.","     * <p>","     * If no values of the key are defined for a particular locale the value for the ","     * default locale (in initial locale set for the class) is returned.","     * </p>","     * @method getStrings","     * @param {String} locale (optional) The locale for which the string value is required. Defaults to the current locale, if not provided.","     */","    // TODO: Optimize/Cache. Clear cache on _setStrings call.","    getStrings : function(locale) {","    ","        locale = (locale || this.get(LOCALE)).toLowerCase();","    ","    ","        var defLocale = this.getDefaultLocale().toLowerCase(),","            defStrs = this._getStrings(defLocale),","            strs = (defStrs) ? Y.merge(defStrs) : {},","            localeSegments = locale.split(HYPHEN),","            localeStrs,","            i, l,","            lookup;","    ","        // If locale is different than the default, or needs lookup support","        if (locale !== defLocale || localeSegments.length > 1) {","            lookup = EMPTY_STR;","            for (i = 0, l = localeSegments.length; i < l; ++i) {","                lookup += localeSegments[i];","    ","    ","                localeStrs = this._getStrings(lookup);","                if (localeStrs) {","                    Y.aggregate(strs, localeStrs, TRUE);","                }","                lookup += HYPHEN;","            }","        }","    ","        return strs;","    },","    ","    /**","     * Gets the string for a particular key, for a particular locale, performing locale lookup.","     * <p>","     * If no values if defined for the key, for the given locale, the value for the ","     * default locale (in initial locale set for the class) is returned.","     * </p>","     * @method getString","     * @param {String} key The key.","     * @param {String} locale (optional) The locale for which the string value is required. Defaults to the current locale, if not provided.","     */","    getString : function(key, locale) {","","        locale = (locale || this.get(LOCALE)).toLowerCase();","    ","    ","        var defLocale = (this.getDefaultLocale()).toLowerCase(),","            strs = this._getStrings(defLocale) || {},","            str = strs[key],","            idx = locale.lastIndexOf(HYPHEN);","    ","        // If locale is different than the default, or needs lookup support","        if (locale !== defLocale || idx != -1) {","            do {","    ","                strs = this._getStrings(locale);","                if (strs && key in strs) {","                    str = strs[key];","                    break;","                }","                idx = locale.lastIndexOf(HYPHEN);","                // Chop of last locale segment","                if (idx != -1) {","                    locale = locale.substring(0, idx);","                }","    ","            } while (idx != -1);","        }","    ","        return str;","    },","","    /**","     * Returns the default locale for the widget (the locale value defined by the","     * widget class, or provided by the user during construction).","     *","     * @method getDefaultLocale","     * @return {String} The default locale for the widget","     */","    getDefaultLocale : function() {","        return this._state.get(LOCALE, INIT_VALUE);","    },","    ","    _strSetter : function(val) {","        return this._setStrings(val, this.get(LOCALE));","    },","","    _strGetter : function(val) {","        return this._getStrings(this.get(LOCALE));","    }","}, true);","","","}, '3.7.3', {\"requires\": [\"widget-base\"]});"];
_yuitest_coverage["build/widget-locale/widget-locale.js"].lines = {"1":0,"9":0,"25":0,"30":0,"32":0,"44":0,"45":0,"47":0,"48":0,"51":0,"52":0,"63":0,"78":0,"81":0,"90":0,"91":0,"92":0,"93":0,"96":0,"97":0,"98":0,"100":0,"104":0,"119":0,"122":0,"128":0,"129":0,"131":0,"132":0,"133":0,"134":0,"136":0,"138":0,"139":0,"145":0,"156":0,"160":0,"164":0};
_yuitest_coverage["build/widget-locale/widget-locale.js"].functions = {"_setStrings:43":0,"_getStrings:62":0,"getStrings:76":0,"getString:117":0,"getDefaultLocale:155":0,"_strSetter:159":0,"_strGetter:163":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-locale/widget-locale.js"].coveredLines = 38;
_yuitest_coverage["build/widget-locale/widget-locale.js"].coveredFunctions = 8;
_yuitest_coverline("build/widget-locale/widget-locale.js", 1);
YUI.add('widget-locale', function (Y, NAME) {

/**
 * Provides string support for widget with BCP 47 language tag lookup. This module has been deprecated. It's replaced by the "intl" module which provides generic internationalization and BCP 47 language tag support with externalization.
 *
 * @module widget-locale
 * @deprecated This module has been deprecated. It's replaced by the "intl" module which provides generic internationalization and BCP 47 language tag support with externalization.
 */
_yuitest_coverfunc("build/widget-locale/widget-locale.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-locale/widget-locale.js", 9);
var TRUE = true,
    LOCALE = "locale",
    INIT_VALUE = "initValue",
    HYPHEN = "-",
    EMPTY_STR = "",
    Widget = Y.Widget;

/**
 * @attribute locale
 * @deprecated Use Y.config.lang and Y.Intl externalization support
 * @description
 * The default locale for the widget. NOTE: Using get/set on the "strings" attribute will
 * return/set strings for this locale.
 * @default "en"
 * @type String
 */
_yuitest_coverline("build/widget-locale/widget-locale.js", 25);
Widget.ATTRS[LOCALE] = {
    value: "en"
};

// Since strings support with locale needs the private _strs setup
_yuitest_coverline("build/widget-locale/widget-locale.js", 30);
Widget.ATTRS.strings.lazyAdd = false;

_yuitest_coverline("build/widget-locale/widget-locale.js", 32);
Y.mix(Widget.prototype, {

    /**
     * Sets strings for a particular locale, merging with any existing
     * strings which may already be defined for the locale.
     *
     * @method _setStrings
     * @protected
     * @param {Object} strings The hash of string key/values to set
     * @param {Object} locale The locale for the string values being set
     */
    _setStrings : function(strings, locale) {
        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "_setStrings", 43);
_yuitest_coverline("build/widget-locale/widget-locale.js", 44);
var strs = this._strs;
        _yuitest_coverline("build/widget-locale/widget-locale.js", 45);
locale = locale.toLowerCase();

        _yuitest_coverline("build/widget-locale/widget-locale.js", 47);
if (!strs[locale]) {
            _yuitest_coverline("build/widget-locale/widget-locale.js", 48);
strs[locale] = {};
        }

        _yuitest_coverline("build/widget-locale/widget-locale.js", 51);
Y.aggregate(strs[locale], strings, TRUE);
        _yuitest_coverline("build/widget-locale/widget-locale.js", 52);
return strs[locale];
    },

    /**
     * Returns the strings key/value hash for a paricular locale, without locale lookup applied.
     *
     * @method _getStrings
     * @protected
     * @param {Object} locale
     */
    _getStrings : function(locale) {
        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "_getStrings", 62);
_yuitest_coverline("build/widget-locale/widget-locale.js", 63);
return this._strs[locale.toLowerCase()];
    },

    /**
     * Gets the entire strings hash for a particular locale, performing locale lookup.
     * <p>
     * If no values of the key are defined for a particular locale the value for the 
     * default locale (in initial locale set for the class) is returned.
     * </p>
     * @method getStrings
     * @param {String} locale (optional) The locale for which the string value is required. Defaults to the current locale, if not provided.
     */
    // TODO: Optimize/Cache. Clear cache on _setStrings call.
    getStrings : function(locale) {
    
        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "getStrings", 76);
_yuitest_coverline("build/widget-locale/widget-locale.js", 78);
locale = (locale || this.get(LOCALE)).toLowerCase();
    
    
        _yuitest_coverline("build/widget-locale/widget-locale.js", 81);
var defLocale = this.getDefaultLocale().toLowerCase(),
            defStrs = this._getStrings(defLocale),
            strs = (defStrs) ? Y.merge(defStrs) : {},
            localeSegments = locale.split(HYPHEN),
            localeStrs,
            i, l,
            lookup;
    
        // If locale is different than the default, or needs lookup support
        _yuitest_coverline("build/widget-locale/widget-locale.js", 90);
if (locale !== defLocale || localeSegments.length > 1) {
            _yuitest_coverline("build/widget-locale/widget-locale.js", 91);
lookup = EMPTY_STR;
            _yuitest_coverline("build/widget-locale/widget-locale.js", 92);
for (i = 0, l = localeSegments.length; i < l; ++i) {
                _yuitest_coverline("build/widget-locale/widget-locale.js", 93);
lookup += localeSegments[i];
    
    
                _yuitest_coverline("build/widget-locale/widget-locale.js", 96);
localeStrs = this._getStrings(lookup);
                _yuitest_coverline("build/widget-locale/widget-locale.js", 97);
if (localeStrs) {
                    _yuitest_coverline("build/widget-locale/widget-locale.js", 98);
Y.aggregate(strs, localeStrs, TRUE);
                }
                _yuitest_coverline("build/widget-locale/widget-locale.js", 100);
lookup += HYPHEN;
            }
        }
    
        _yuitest_coverline("build/widget-locale/widget-locale.js", 104);
return strs;
    },
    
    /**
     * Gets the string for a particular key, for a particular locale, performing locale lookup.
     * <p>
     * If no values if defined for the key, for the given locale, the value for the 
     * default locale (in initial locale set for the class) is returned.
     * </p>
     * @method getString
     * @param {String} key The key.
     * @param {String} locale (optional) The locale for which the string value is required. Defaults to the current locale, if not provided.
     */
    getString : function(key, locale) {

        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "getString", 117);
_yuitest_coverline("build/widget-locale/widget-locale.js", 119);
locale = (locale || this.get(LOCALE)).toLowerCase();
    
    
        _yuitest_coverline("build/widget-locale/widget-locale.js", 122);
var defLocale = (this.getDefaultLocale()).toLowerCase(),
            strs = this._getStrings(defLocale) || {},
            str = strs[key],
            idx = locale.lastIndexOf(HYPHEN);
    
        // If locale is different than the default, or needs lookup support
        _yuitest_coverline("build/widget-locale/widget-locale.js", 128);
if (locale !== defLocale || idx != -1) {
            _yuitest_coverline("build/widget-locale/widget-locale.js", 129);
do {
    
                _yuitest_coverline("build/widget-locale/widget-locale.js", 131);
strs = this._getStrings(locale);
                _yuitest_coverline("build/widget-locale/widget-locale.js", 132);
if (strs && key in strs) {
                    _yuitest_coverline("build/widget-locale/widget-locale.js", 133);
str = strs[key];
                    _yuitest_coverline("build/widget-locale/widget-locale.js", 134);
break;
                }
                _yuitest_coverline("build/widget-locale/widget-locale.js", 136);
idx = locale.lastIndexOf(HYPHEN);
                // Chop of last locale segment
                _yuitest_coverline("build/widget-locale/widget-locale.js", 138);
if (idx != -1) {
                    _yuitest_coverline("build/widget-locale/widget-locale.js", 139);
locale = locale.substring(0, idx);
                }
    
            }while (idx != -1);
        }
    
        _yuitest_coverline("build/widget-locale/widget-locale.js", 145);
return str;
    },

    /**
     * Returns the default locale for the widget (the locale value defined by the
     * widget class, or provided by the user during construction).
     *
     * @method getDefaultLocale
     * @return {String} The default locale for the widget
     */
    getDefaultLocale : function() {
        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "getDefaultLocale", 155);
_yuitest_coverline("build/widget-locale/widget-locale.js", 156);
return this._state.get(LOCALE, INIT_VALUE);
    },
    
    _strSetter : function(val) {
        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "_strSetter", 159);
_yuitest_coverline("build/widget-locale/widget-locale.js", 160);
return this._setStrings(val, this.get(LOCALE));
    },

    _strGetter : function(val) {
        _yuitest_coverfunc("build/widget-locale/widget-locale.js", "_strGetter", 163);
_yuitest_coverline("build/widget-locale/widget-locale.js", 164);
return this._getStrings(this.get(LOCALE));
    }
}, true);


}, '3.7.3', {"requires": ["widget-base"]});
