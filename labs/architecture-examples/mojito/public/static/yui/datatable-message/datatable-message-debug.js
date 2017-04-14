/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-message', function (Y, NAME) {

/**
Adds support for a message container to appear in the table.  This can be used
to indicate loading progress, lack of records, or any other communication
needed.

@module datatable
@submodule datatable-message
@since 3.5.0
**/
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
Y.namespace('DataTable').Message = Message = function () {};

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
        this.get('boundingBox').removeClass(
            this.getClassName('message', 'visible'));

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
        var content = this.getString(message) || message;

        if (!this._messageNode) {
            this._initMessageNode();
        }

        if (this.get('showMessages')) {
            if (content) {
                this._messageNode.one(
                    '.' + this.getClassName('message', 'content'))
                    .setHTML(content);

                this.get('boundingBox').addClass(
                    this.getClassName('message','visible'));
            } else {
                // TODO: is this right?
                // If no message provided, remove the message node.
                this.hideMessage();
            }
        }

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
        var contentNode;

        if (this._messageNode) {
            contentNode = this._messageNode.one(
                '.' + this.getClassName('message', 'content'));

            if (contentNode) {
                // FIXME: This needs to become a class extension plus a view or
                // plugin for the table view.
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
        if (e.newVal) {
            this._uiSetMessage(e);
        } else if (this._messageNode) {
            this.get('boundingBox').removeClass(
                this.getClassName('message', 'visible'));

            this._messageNode.remove().destroy(true);
            this._messageNode = null;
        }
    },

    /**
    Binds the events necessary to keep the message node in sync with the current
    table and configuration state.

    @method _bindMessageUI
    @protected
    @since 3.5.0
    **/
    _bindMessageUI: function () {
        this.after(['dataChange', '*:add', '*:remove', '*:reset'],
            Y.bind('_afterMessageDataChange', this));

        this.after('columnsChange', Y.bind('_afterMessageColumnsChange', this));

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
        this._initMessageStrings();

        if (this.get('showMessages')) {
            this.after('renderBody', Y.bind('_initMessageNode', this));
        }

        this.after(Y.bind('_bindMessageUI', this), this, 'bindUI');
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
        if (!this._messageNode) {
            this._messageNode = Y.Node.create(
                Y.Lang.sub(this.MESSAGE_TEMPLATE, {
                    className: this.getClassName('message'),
                    contentClass: this.getClassName('message', 'content'),
                    colspan: this._displayColumns.length || 1
                }));

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
        if (!this.data.size()) {
            this.showMessage((e && e.message) || 'emptyMessage');
        } else {
            this.hideMessage();
        }
    }
});


if (Y.Lang.isFunction(Y.DataTable)) {
    Y.Base.mix(Y.DataTable, [ Message ]);
}


}, '3.7.3', {"requires": ["datatable-base"], "lang": ["en"], "skinnable": true});
