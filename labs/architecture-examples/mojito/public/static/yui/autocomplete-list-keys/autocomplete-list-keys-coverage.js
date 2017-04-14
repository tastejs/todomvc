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
_yuitest_coverage["build/autocomplete-list-keys/autocomplete-list-keys.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-list-keys/autocomplete-list-keys.js",
    code: []
};
_yuitest_coverage["build/autocomplete-list-keys/autocomplete-list-keys.js"].code=["YUI.add('autocomplete-list-keys', function (Y, NAME) {","","/**","Mixes keyboard support into AutoCompleteList. By default, this module is not","loaded for iOS and Android devices.","","@module autocomplete","@submodule autocomplete-list-keys","**/",""," // keyCode constants.","var KEY_DOWN  = 40,","    KEY_ENTER = 13,","    KEY_ESC   = 27,","    KEY_TAB   = 9,","    KEY_UP    = 38;","","function ListKeys() {","    Y.before(this._bindKeys, this, 'bindUI');","    this._initKeys();","}","","ListKeys.prototype = {","    // -- Lifecycle Methods ----------------------------------------------------","","    /**","    Initializes keyboard command mappings.","","    @method _initKeys","    @protected","    @for AutoCompleteList","    **/","    _initKeys: function () {","        var keys        = {},","            keysVisible = {};","","        // Register keyboard command handlers. _keys contains handlers that will","        // always be called; _keysVisible contains handlers that will only be","        // called when the list is visible.","        keys[KEY_DOWN] = this._keyDown;","","        keysVisible[KEY_ENTER] = this._keyEnter;","        keysVisible[KEY_ESC]   = this._keyEsc;","        keysVisible[KEY_TAB]   = this._keyTab;","        keysVisible[KEY_UP]    = this._keyUp;","","        this._keys        = keys;","        this._keysVisible = keysVisible;","    },","","    destructor: function () {","        this._unbindKeys();","    },","","    /**","    Binds keyboard events.","","    @method _bindKeys","    @protected","    **/","    _bindKeys: function () {","        this._keyEvents = this._inputNode.on('keydown', this._onInputKey, this);","    },","","    /**","    Unbinds keyboard events.","","    @method _unbindKeys","    @protected","    **/","    _unbindKeys: function () {","        this._keyEvents && this._keyEvents.detach();","        this._keyEvents = null;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Called when the down arrow key is pressed.","","    @method _keyDown","    @protected","    **/","    _keyDown: function () {","        if (this.get('visible')) {","            this._activateNextItem();","        } else {","            this.show();","        }","    },","","    /**","    Called when the enter key is pressed.","","    @method _keyEnter","    @protected","    **/","    _keyEnter: function (e) {","        var item = this.get('activeItem');","","        if (item) {","            this.selectItem(item, e);","        } else {","            // Don't prevent form submission when there's no active item.","            return false;","        }","    },","","    /**","    Called when the escape key is pressed.","","    @method _keyEsc","    @protected","    **/","    _keyEsc: function () {","        this.hide();","    },","","    /**","    Called when the tab key is pressed.","","    @method _keyTab","    @protected","    **/","    _keyTab: function (e) {","        var item;","","        if (this.get('tabSelect')) {","            item = this.get('activeItem');","","            if (item) {","                this.selectItem(item, e);","                return true;","            }","        }","","        return false;","    },","","    /**","    Called when the up arrow key is pressed.","","    @method _keyUp","    @protected","    **/","    _keyUp: function () {","        this._activatePrevItem();","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `inputNode` key events.","","    @method _onInputKey","    @param {EventTarget} e","    @protected","    **/","    _onInputKey: function (e) {","        var handler,","            keyCode = e.keyCode;","","        this._lastInputKey = keyCode;","","        if (this.get('results').length) {","            handler = this._keys[keyCode];","","            if (!handler && this.get('visible')) {","                handler = this._keysVisible[keyCode];","            }","","            if (handler) {","                // A handler may return false to indicate that it doesn't wish","                // to prevent the default key behavior.","                if (handler.call(this, e) !== false) {","                    e.preventDefault();","                }","            }","        }","    }","};","","Y.Base.mix(Y.AutoCompleteList, [ListKeys]);","","","}, '3.7.3', {\"requires\": [\"autocomplete-list\", \"base-build\"]});"];
_yuitest_coverage["build/autocomplete-list-keys/autocomplete-list-keys.js"].lines = {"1":0,"12":0,"18":0,"19":0,"20":0,"23":0,"34":0,"40":0,"42":0,"43":0,"44":0,"45":0,"47":0,"48":0,"52":0,"62":0,"72":0,"73":0,"85":0,"86":0,"88":0,"99":0,"101":0,"102":0,"105":0,"116":0,"126":0,"128":0,"129":0,"131":0,"132":0,"133":0,"137":0,"147":0,"160":0,"163":0,"165":0,"166":0,"168":0,"169":0,"172":0,"175":0,"176":0,"183":0};
_yuitest_coverage["build/autocomplete-list-keys/autocomplete-list-keys.js"].functions = {"ListKeys:18":0,"_initKeys:33":0,"destructor:51":0,"_bindKeys:61":0,"_unbindKeys:71":0,"_keyDown:84":0,"_keyEnter:98":0,"_keyEsc:115":0,"_keyTab:125":0,"_keyUp:146":0,"_onInputKey:159":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-list-keys/autocomplete-list-keys.js"].coveredLines = 44;
_yuitest_coverage["build/autocomplete-list-keys/autocomplete-list-keys.js"].coveredFunctions = 12;
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 1);
YUI.add('autocomplete-list-keys', function (Y, NAME) {

/**
Mixes keyboard support into AutoCompleteList. By default, this module is not
loaded for iOS and Android devices.

@module autocomplete
@submodule autocomplete-list-keys
**/

 // keyCode constants.
_yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 12);
var KEY_DOWN  = 40,
    KEY_ENTER = 13,
    KEY_ESC   = 27,
    KEY_TAB   = 9,
    KEY_UP    = 38;

_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 18);
function ListKeys() {
    _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "ListKeys", 18);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 19);
Y.before(this._bindKeys, this, 'bindUI');
    _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 20);
this._initKeys();
}

_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 23);
ListKeys.prototype = {
    // -- Lifecycle Methods ----------------------------------------------------

    /**
    Initializes keyboard command mappings.

    @method _initKeys
    @protected
    @for AutoCompleteList
    **/
    _initKeys: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_initKeys", 33);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 34);
var keys        = {},
            keysVisible = {};

        // Register keyboard command handlers. _keys contains handlers that will
        // always be called; _keysVisible contains handlers that will only be
        // called when the list is visible.
        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 40);
keys[KEY_DOWN] = this._keyDown;

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 42);
keysVisible[KEY_ENTER] = this._keyEnter;
        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 43);
keysVisible[KEY_ESC]   = this._keyEsc;
        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 44);
keysVisible[KEY_TAB]   = this._keyTab;
        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 45);
keysVisible[KEY_UP]    = this._keyUp;

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 47);
this._keys        = keys;
        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 48);
this._keysVisible = keysVisible;
    },

    destructor: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "destructor", 51);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 52);
this._unbindKeys();
    },

    /**
    Binds keyboard events.

    @method _bindKeys
    @protected
    **/
    _bindKeys: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_bindKeys", 61);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 62);
this._keyEvents = this._inputNode.on('keydown', this._onInputKey, this);
    },

    /**
    Unbinds keyboard events.

    @method _unbindKeys
    @protected
    **/
    _unbindKeys: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_unbindKeys", 71);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 72);
this._keyEvents && this._keyEvents.detach();
        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 73);
this._keyEvents = null;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Called when the down arrow key is pressed.

    @method _keyDown
    @protected
    **/
    _keyDown: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_keyDown", 84);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 85);
if (this.get('visible')) {
            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 86);
this._activateNextItem();
        } else {
            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 88);
this.show();
        }
    },

    /**
    Called when the enter key is pressed.

    @method _keyEnter
    @protected
    **/
    _keyEnter: function (e) {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_keyEnter", 98);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 99);
var item = this.get('activeItem');

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 101);
if (item) {
            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 102);
this.selectItem(item, e);
        } else {
            // Don't prevent form submission when there's no active item.
            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 105);
return false;
        }
    },

    /**
    Called when the escape key is pressed.

    @method _keyEsc
    @protected
    **/
    _keyEsc: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_keyEsc", 115);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 116);
this.hide();
    },

    /**
    Called when the tab key is pressed.

    @method _keyTab
    @protected
    **/
    _keyTab: function (e) {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_keyTab", 125);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 126);
var item;

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 128);
if (this.get('tabSelect')) {
            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 129);
item = this.get('activeItem');

            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 131);
if (item) {
                _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 132);
this.selectItem(item, e);
                _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 133);
return true;
            }
        }

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 137);
return false;
    },

    /**
    Called when the up arrow key is pressed.

    @method _keyUp
    @protected
    **/
    _keyUp: function () {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_keyUp", 146);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 147);
this._activatePrevItem();
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `inputNode` key events.

    @method _onInputKey
    @param {EventTarget} e
    @protected
    **/
    _onInputKey: function (e) {
        _yuitest_coverfunc("build/autocomplete-list-keys/autocomplete-list-keys.js", "_onInputKey", 159);
_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 160);
var handler,
            keyCode = e.keyCode;

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 163);
this._lastInputKey = keyCode;

        _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 165);
if (this.get('results').length) {
            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 166);
handler = this._keys[keyCode];

            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 168);
if (!handler && this.get('visible')) {
                _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 169);
handler = this._keysVisible[keyCode];
            }

            _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 172);
if (handler) {
                // A handler may return false to indicate that it doesn't wish
                // to prevent the default key behavior.
                _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 175);
if (handler.call(this, e) !== false) {
                    _yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 176);
e.preventDefault();
                }
            }
        }
    }
};

_yuitest_coverline("build/autocomplete-list-keys/autocomplete-list-keys.js", 183);
Y.Base.mix(Y.AutoCompleteList, [ListKeys]);


}, '3.7.3', {"requires": ["autocomplete-list", "base-build"]});
