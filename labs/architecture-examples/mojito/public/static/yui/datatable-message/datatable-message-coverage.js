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
_yuitest_coverage["build/datatable-message/datatable-message.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatable-message/datatable-message.js",
    code: []
};
_yuitest_coverage["build/datatable-message/datatable-message.js"].code=["YUI.add('datatable-message', function (Y, NAME) {","","/**","Adds support for a message container to appear in the table.  This can be used","to indicate loading progress, lack of records, or any other communication","needed.","","@module datatable","@submodule datatable-message","@since 3.5.0","**/","var Message;","","/**","_API docs for this extension are included in the DataTable class._","","Adds support for a message container to appear in the table.  This can be used","to indicate loading progress, lack of records, or any other communication","needed.","","Features added to `Y.DataTable`, and made available for custom classes at","`Y.DataTable.Message`.","","@class DataTable.Message","@for DataTable","@since 3.5.0","**/","Y.namespace('DataTable').Message = Message = function () {};","","Message.ATTRS = {","    /**","    Enables the display of messages in the table.  Setting this to false will","    prevent the message Node from being created and `showMessage` from doing","    anything.","","    @attribute showMessages","    @type {Boolean}","    @default true","    @since 3.5.0","    **/","    showMessages: {","        value: true,","        validator: Y.Lang.isBoolean","    }","};","","Y.mix(Message.prototype, {","    /**","    Template used to generate the node that will be used to report messages.","","    @property MESSAGE_TEMPLATE","    @type {HTML}","    @default <tbody class=\"{className}\"><td class=\"{contentClass}\" colspan=\"{colspan}\"></td></tbody>","    @since 3.5.0","    **/","    MESSAGE_TEMPLATE: '<tbody class=\"{className}\"><tr><td class=\"{contentClass}\" colspan=\"{colspan}\"></td></tr></tbody>',","","    /**","    Hides the message node.","","    @method hideMessage","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    hideMessage: function () {","        this.get('boundingBox').removeClass(","            this.getClassName('message', 'visible'));","","        return this;","    },","","    /**","    Display the message node and set its content to `message`.  If there is a","    localized `strings` entry for the value of `message`, that string will be","    used.","","    @method showMessage","    @param {String} message The message name or message itself to display","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    showMessage: function (message) {","        var content = this.getString(message) || message;","","        if (!this._messageNode) {","            this._initMessageNode();","        }","","        if (this.get('showMessages')) {","            if (content) {","                this._messageNode.one(","                    '.' + this.getClassName('message', 'content'))","                    .setHTML(content);","","                this.get('boundingBox').addClass(","                    this.getClassName('message','visible'));","            } else {","                // TODO: is this right?","                // If no message provided, remove the message node.","                this.hideMessage();","            }","        }","","        return this;","    },","","    //--------------------------------------------------------------------------","    // Protected methods","    //--------------------------------------------------------------------------","    /**","    Updates the colspan of the `<td>` used to display the messages.","","    @method _afterMessageColumnsChange","    @param {EventFacade} e The columnsChange event","    @protected","    @since 3.5.0","    **/","    _afterMessageColumnsChange: function (e) {","        var contentNode;","","        if (this._messageNode) {","            contentNode = this._messageNode.one(","                '.' + this.getClassName('message', 'content'));","","            if (contentNode) {","                // FIXME: This needs to become a class extension plus a view or","                // plugin for the table view.","                contentNode.set('colSpan', this._displayColumns.length);","            }","        }","    },","","    /**","    Relays to `_uiSetMessage` to hide or show the message node.","","    @method _afterMessageDataChange","    @param {EventFacade} e The dataChange event","    @protected","    @since 3.5.0","    **/","    _afterMessageDataChange: function (e) {","        this._uiSetMessage();","    },","","    /**","    Removes the message node if `showMessages` is `false`, or relays to","    `_uiSetMessage` if `true`.","","    @method _afterShowMessagesChange","    @param {EventFacade} e The showMessagesChange event","    @protected","    @since 3.5.0","    **/","    _afterShowMessagesChange: function (e) {","        if (e.newVal) {","            this._uiSetMessage(e);","        } else if (this._messageNode) {","            this.get('boundingBox').removeClass(","                this.getClassName('message', 'visible'));","","            this._messageNode.remove().destroy(true);","            this._messageNode = null;","        }","    },","","    /**","    Binds the events necessary to keep the message node in sync with the current","    table and configuration state.","","    @method _bindMessageUI","    @protected","    @since 3.5.0","    **/","    _bindMessageUI: function () {","        this.after(['dataChange', '*:add', '*:remove', '*:reset'],","            Y.bind('_afterMessageDataChange', this));","","        this.after('columnsChange', Y.bind('_afterMessageColumnsChange', this));","","        this.after('showMessagesChange',","            Y.bind('_afterShowMessagesChange', this));","    },","","    /**","    Merges in the message related strings and hooks into the rendering cycle to","    also render and bind the message node.","","    @method initializer","    @protected","    @since 3.5.0","    **/","    initializer: function () {","        this._initMessageStrings();","","        if (this.get('showMessages')) {","            this.after('renderBody', Y.bind('_initMessageNode', this));","        }","","        this.after(Y.bind('_bindMessageUI', this), this, 'bindUI');","        this.after(Y.bind('_syncMessageUI', this), this, 'syncUI');","    },","","    /**","    Creates the `_messageNode` property from the configured `MESSAGE_TEMPLATE`","    and inserts it before the `<table>`'s `<tbody>` node.","","    @method _initMessageNode","    @protected","    @since 3.5.0","    **/","    _initMessageNode: function () {","        if (!this._messageNode) {","            this._messageNode = Y.Node.create(","                Y.Lang.sub(this.MESSAGE_TEMPLATE, {","                    className: this.getClassName('message'),","                    contentClass: this.getClassName('message', 'content'),","                    colspan: this._displayColumns.length || 1","                }));","","            this._tableNode.insertBefore(this._messageNode, this._tbodyNode);","        }","    },","","    /**","    Add the messaging related strings to the `strings` map.","    ","    @method _initMessageStrings","    @protected","    @since 3.5.0","    **/","    _initMessageStrings: function () {","        // Not a valueFn because other class extensions will want to add to it","        this.set('strings', Y.mix((this.get('strings') || {}), ","            Y.Intl.get('datatable-message')));","    },","","    /**","    Node used to display messages from `showMessage`.","","    @property _messageNode","    @type {Node}","    @value `undefined` (not initially set)","    @since 3.5.0","    **/","    //_messageNode: null,","","    /**","    Synchronizes the message UI with the table state.","","    @method _syncMessageUI","    @protected","    @since 3.5.0","    **/","    _syncMessageUI: function () {","        this._uiSetMessage();","    },","","    /**","    Calls `hideMessage` or `showMessage` as appropriate based on the presence of","    records in the `data` ModelList.","","    This is called when `data` is reset or records are added or removed.  Also,","    if the `showMessages` attribute is updated.  In either case, if the","    triggering event has a `message` property on the EventFacade, it will be","    passed to `showMessage` (if appropriate).  If no such property is on the","    facade, the `emptyMessage` will be used (see the strings).","","    @method _uiSetMessage","    @param {EventFacade} e The columnsChange event","    @protected","    @since 3.5.0","    **/","    _uiSetMessage: function (e) {","        if (!this.data.size()) {","            this.showMessage((e && e.message) || 'emptyMessage');","        } else {","            this.hideMessage();","        }","    }","});","","","if (Y.Lang.isFunction(Y.DataTable)) {","    Y.Base.mix(Y.DataTable, [ Message ]);","}","","","}, '3.7.3', {\"requires\": [\"datatable-base\"], \"lang\": [\"en\"], \"skinnable\": true});"];
_yuitest_coverage["build/datatable-message/datatable-message.js"].lines = {"1":0,"12":0,"28":0,"30":0,"47":0,"67":0,"70":0,"85":0,"87":0,"88":0,"91":0,"92":0,"93":0,"97":0,"102":0,"106":0,"121":0,"123":0,"124":0,"127":0,"130":0,"144":0,"157":0,"158":0,"159":0,"160":0,"163":0,"164":0,"177":0,"180":0,"182":0,"195":0,"197":0,"198":0,"201":0,"202":0,"214":0,"215":0,"222":0,"235":0,"257":0,"276":0,"277":0,"279":0,"285":0,"286":0};
_yuitest_coverage["build/datatable-message/datatable-message.js"].functions = {"hideMessage:66":0,"showMessage:84":0,"_afterMessageColumnsChange:120":0,"_afterMessageDataChange:143":0,"_afterShowMessagesChange:156":0,"_bindMessageUI:176":0,"initializer:194":0,"_initMessageNode:213":0,"_initMessageStrings:233":0,"_syncMessageUI:256":0,"_uiSetMessage:275":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatable-message/datatable-message.js"].coveredLines = 46;
_yuitest_coverage["build/datatable-message/datatable-message.js"].coveredFunctions = 12;
_yuitest_coverline("build/datatable-message/datatable-message.js", 1);
YUI.add('datatable-message', function (Y, NAME) {

/**
Adds support for a message container to appear in the table.  This can be used
to indicate loading progress, lack of records, or any other communication
needed.

@module datatable
@submodule datatable-message
@since 3.5.0
**/
_yuitest_coverfunc("build/datatable-message/datatable-message.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatable-message/datatable-message.js", 12);
var Message;

/**
_API docs for this extension are included in the DataTable class._

Adds support for a message container to appear in the table.  This can be used
to indicate loading progress, lack of records, or any other communication
needed.

Features added to `Y.DataTable`, and made available for custom classes at
`Y.DataTable.Message`.

@class DataTable.Message
@for DataTable
@since 3.5.0
**/
_yuitest_coverline("build/datatable-message/datatable-message.js", 28);
Y.namespace('DataTable').Message = Message = function () {};

_yuitest_coverline("build/datatable-message/datatable-message.js", 30);
Message.ATTRS = {
    /**
    Enables the display of messages in the table.  Setting this to false will
    prevent the message Node from being created and `showMessage` from doing
    anything.

    @attribute showMessages
    @type {Boolean}
    @default true
    @since 3.5.0
    **/
    showMessages: {
        value: true,
        validator: Y.Lang.isBoolean
    }
};

_yuitest_coverline("build/datatable-message/datatable-message.js", 47);
Y.mix(Message.prototype, {
    /**
    Template used to generate the node that will be used to report messages.

    @property MESSAGE_TEMPLATE
    @type {HTML}
    @default <tbody class="{className}"><td class="{contentClass}" colspan="{colspan}"></td></tbody>
    @since 3.5.0
    **/
    MESSAGE_TEMPLATE: '<tbody class="{className}"><tr><td class="{contentClass}" colspan="{colspan}"></td></tr></tbody>',

    /**
    Hides the message node.

    @method hideMessage
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    hideMessage: function () {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "hideMessage", 66);
_yuitest_coverline("build/datatable-message/datatable-message.js", 67);
this.get('boundingBox').removeClass(
            this.getClassName('message', 'visible'));

        _yuitest_coverline("build/datatable-message/datatable-message.js", 70);
return this;
    },

    /**
    Display the message node and set its content to `message`.  If there is a
    localized `strings` entry for the value of `message`, that string will be
    used.

    @method showMessage
    @param {String} message The message name or message itself to display
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    showMessage: function (message) {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "showMessage", 84);
_yuitest_coverline("build/datatable-message/datatable-message.js", 85);
var content = this.getString(message) || message;

        _yuitest_coverline("build/datatable-message/datatable-message.js", 87);
if (!this._messageNode) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 88);
this._initMessageNode();
        }

        _yuitest_coverline("build/datatable-message/datatable-message.js", 91);
if (this.get('showMessages')) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 92);
if (content) {
                _yuitest_coverline("build/datatable-message/datatable-message.js", 93);
this._messageNode.one(
                    '.' + this.getClassName('message', 'content'))
                    .setHTML(content);

                _yuitest_coverline("build/datatable-message/datatable-message.js", 97);
this.get('boundingBox').addClass(
                    this.getClassName('message','visible'));
            } else {
                // TODO: is this right?
                // If no message provided, remove the message node.
                _yuitest_coverline("build/datatable-message/datatable-message.js", 102);
this.hideMessage();
            }
        }

        _yuitest_coverline("build/datatable-message/datatable-message.js", 106);
return this;
    },

    //--------------------------------------------------------------------------
    // Protected methods
    //--------------------------------------------------------------------------
    /**
    Updates the colspan of the `<td>` used to display the messages.

    @method _afterMessageColumnsChange
    @param {EventFacade} e The columnsChange event
    @protected
    @since 3.5.0
    **/
    _afterMessageColumnsChange: function (e) {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_afterMessageColumnsChange", 120);
_yuitest_coverline("build/datatable-message/datatable-message.js", 121);
var contentNode;

        _yuitest_coverline("build/datatable-message/datatable-message.js", 123);
if (this._messageNode) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 124);
contentNode = this._messageNode.one(
                '.' + this.getClassName('message', 'content'));

            _yuitest_coverline("build/datatable-message/datatable-message.js", 127);
if (contentNode) {
                // FIXME: This needs to become a class extension plus a view or
                // plugin for the table view.
                _yuitest_coverline("build/datatable-message/datatable-message.js", 130);
contentNode.set('colSpan', this._displayColumns.length);
            }
        }
    },

    /**
    Relays to `_uiSetMessage` to hide or show the message node.

    @method _afterMessageDataChange
    @param {EventFacade} e The dataChange event
    @protected
    @since 3.5.0
    **/
    _afterMessageDataChange: function (e) {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_afterMessageDataChange", 143);
_yuitest_coverline("build/datatable-message/datatable-message.js", 144);
this._uiSetMessage();
    },

    /**
    Removes the message node if `showMessages` is `false`, or relays to
    `_uiSetMessage` if `true`.

    @method _afterShowMessagesChange
    @param {EventFacade} e The showMessagesChange event
    @protected
    @since 3.5.0
    **/
    _afterShowMessagesChange: function (e) {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_afterShowMessagesChange", 156);
_yuitest_coverline("build/datatable-message/datatable-message.js", 157);
if (e.newVal) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 158);
this._uiSetMessage(e);
        } else {_yuitest_coverline("build/datatable-message/datatable-message.js", 159);
if (this._messageNode) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 160);
this.get('boundingBox').removeClass(
                this.getClassName('message', 'visible'));

            _yuitest_coverline("build/datatable-message/datatable-message.js", 163);
this._messageNode.remove().destroy(true);
            _yuitest_coverline("build/datatable-message/datatable-message.js", 164);
this._messageNode = null;
        }}
    },

    /**
    Binds the events necessary to keep the message node in sync with the current
    table and configuration state.

    @method _bindMessageUI
    @protected
    @since 3.5.0
    **/
    _bindMessageUI: function () {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_bindMessageUI", 176);
_yuitest_coverline("build/datatable-message/datatable-message.js", 177);
this.after(['dataChange', '*:add', '*:remove', '*:reset'],
            Y.bind('_afterMessageDataChange', this));

        _yuitest_coverline("build/datatable-message/datatable-message.js", 180);
this.after('columnsChange', Y.bind('_afterMessageColumnsChange', this));

        _yuitest_coverline("build/datatable-message/datatable-message.js", 182);
this.after('showMessagesChange',
            Y.bind('_afterShowMessagesChange', this));
    },

    /**
    Merges in the message related strings and hooks into the rendering cycle to
    also render and bind the message node.

    @method initializer
    @protected
    @since 3.5.0
    **/
    initializer: function () {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "initializer", 194);
_yuitest_coverline("build/datatable-message/datatable-message.js", 195);
this._initMessageStrings();

        _yuitest_coverline("build/datatable-message/datatable-message.js", 197);
if (this.get('showMessages')) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 198);
this.after('renderBody', Y.bind('_initMessageNode', this));
        }

        _yuitest_coverline("build/datatable-message/datatable-message.js", 201);
this.after(Y.bind('_bindMessageUI', this), this, 'bindUI');
        _yuitest_coverline("build/datatable-message/datatable-message.js", 202);
this.after(Y.bind('_syncMessageUI', this), this, 'syncUI');
    },

    /**
    Creates the `_messageNode` property from the configured `MESSAGE_TEMPLATE`
    and inserts it before the `<table>`'s `<tbody>` node.

    @method _initMessageNode
    @protected
    @since 3.5.0
    **/
    _initMessageNode: function () {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_initMessageNode", 213);
_yuitest_coverline("build/datatable-message/datatable-message.js", 214);
if (!this._messageNode) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 215);
this._messageNode = Y.Node.create(
                Y.Lang.sub(this.MESSAGE_TEMPLATE, {
                    className: this.getClassName('message'),
                    contentClass: this.getClassName('message', 'content'),
                    colspan: this._displayColumns.length || 1
                }));

            _yuitest_coverline("build/datatable-message/datatable-message.js", 222);
this._tableNode.insertBefore(this._messageNode, this._tbodyNode);
        }
    },

    /**
    Add the messaging related strings to the `strings` map.
    
    @method _initMessageStrings
    @protected
    @since 3.5.0
    **/
    _initMessageStrings: function () {
        // Not a valueFn because other class extensions will want to add to it
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_initMessageStrings", 233);
_yuitest_coverline("build/datatable-message/datatable-message.js", 235);
this.set('strings', Y.mix((this.get('strings') || {}), 
            Y.Intl.get('datatable-message')));
    },

    /**
    Node used to display messages from `showMessage`.

    @property _messageNode
    @type {Node}
    @value `undefined` (not initially set)
    @since 3.5.0
    **/
    //_messageNode: null,

    /**
    Synchronizes the message UI with the table state.

    @method _syncMessageUI
    @protected
    @since 3.5.0
    **/
    _syncMessageUI: function () {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_syncMessageUI", 256);
_yuitest_coverline("build/datatable-message/datatable-message.js", 257);
this._uiSetMessage();
    },

    /**
    Calls `hideMessage` or `showMessage` as appropriate based on the presence of
    records in the `data` ModelList.

    This is called when `data` is reset or records are added or removed.  Also,
    if the `showMessages` attribute is updated.  In either case, if the
    triggering event has a `message` property on the EventFacade, it will be
    passed to `showMessage` (if appropriate).  If no such property is on the
    facade, the `emptyMessage` will be used (see the strings).

    @method _uiSetMessage
    @param {EventFacade} e The columnsChange event
    @protected
    @since 3.5.0
    **/
    _uiSetMessage: function (e) {
        _yuitest_coverfunc("build/datatable-message/datatable-message.js", "_uiSetMessage", 275);
_yuitest_coverline("build/datatable-message/datatable-message.js", 276);
if (!this.data.size()) {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 277);
this.showMessage((e && e.message) || 'emptyMessage');
        } else {
            _yuitest_coverline("build/datatable-message/datatable-message.js", 279);
this.hideMessage();
        }
    }
});


_yuitest_coverline("build/datatable-message/datatable-message.js", 285);
if (Y.Lang.isFunction(Y.DataTable)) {
    _yuitest_coverline("build/datatable-message/datatable-message.js", 286);
Y.Base.mix(Y.DataTable, [ Message ]);
}


}, '3.7.3', {"requires": ["datatable-base"], "lang": ["en"], "skinnable": true});
