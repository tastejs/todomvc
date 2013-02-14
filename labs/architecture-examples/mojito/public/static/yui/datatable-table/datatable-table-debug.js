/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-table', function (Y, NAME) {

/**
View class responsible for rendering a `<table>` from provided data.  Used as
the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.

@module datatable
@submodule datatable-table
@since 3.6.0
**/
var toArray = Y.Array,
    YLang   = Y.Lang,
    fromTemplate = YLang.sub,

    isArray    = YLang.isArray,
    isFunction = YLang.isFunction;

/**
View class responsible for rendering a `<table>` from provided data.  Used as
the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.



@class TableView
@namespace DataTable
@extends View
@since 3.6.0
**/
Y.namespace('DataTable').TableView = Y.Base.create('table', Y.View, [], {

    /**
    The HTML template used to create the caption Node if the `caption`
    attribute is set.

    @property CAPTION_TEMPLATE
    @type {HTML}
    @default '<caption class="{className}"/>'
    @since 3.6.0
    **/
    CAPTION_TEMPLATE: '<caption class="{className}"/>',

    /**
    The HTML template used to create the table Node.

    @property TABLE_TEMPLATE
    @type {HTML}
    @default '<table cellspacing="0" class="{className}"/>'
    @since 3.6.0
    **/
    TABLE_TEMPLATE  : '<table cellspacing="0" class="{className}"/>',

    /**
    The object or instance of the class assigned to `bodyView` that is
    responsible for rendering and managing the table's `<tbody>`(s) and its
    content.

    @property body
    @type {Object}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //body: null,

    /**
    The object or instance of the class assigned to `footerView` that is
    responsible for rendering and managing the table's `<tfoot>` and its
    content.

    @property foot
    @type {Object}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //foot: null,

    /**
    The object or instance of the class assigned to `headerView` that is
    responsible for rendering and managing the table's `<thead>` and its
    content.

    @property head
    @type {Object}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //head: null,

    //-----------------------------------------------------------------------//
    // Public methods
    //-----------------------------------------------------------------------//

    /**
    Returns the `<td>` Node from the given row and column index.  Alternately,
    the `seed` can be a Node.  If so, the nearest ancestor cell is returned.
    If the `seed` is a cell, it is returned.  If there is no cell at the given
    coordinates, `null` is returned.

    Optionally, include an offset array or string to return a cell near the
    cell identified by the `seed`.  The offset can be an array containing the
    number of rows to shift followed by the number of columns to shift, or one
    of "above", "below", "next", or "previous".

    <pre><code>// Previous cell in the previous row
    var cell = table.getCell(e.target, [-1, -1]);

    // Next cell
    var cell = table.getCell(e.target, 'next');
    var cell = table.getCell(e.taregt, [0, 1];</pre></code>

    This is actually just a pass through to the `bodyView` instance's method
    by the same name.

    @method getCell
    @param {Number[]|Node} seed Array of row and column indexes, or a Node that
        is either the cell itself or a descendant of one.
    @param {Number[]|String} [shift] Offset by which to identify the returned
        cell Node
    @return {Node}
    @since 3.5.0
    **/
    getCell: function (seed, shift) {
        return this.body && this.body.getCell &&
            this.body.getCell.apply(this.body, arguments);
    },

    /**
    Returns the generated CSS classname based on the input.  If the `host`
    attribute is configured, it will attempt to relay to its `getClassName`
    or use its static `NAME` property as a string base.
    
    If `host` is absent or has neither method nor `NAME`, a CSS classname
    will be generated using this class's `NAME`.

    @method getClassName
    @param {String} token* Any number of token strings to assemble the
        classname from.
    @return {String}
    @protected
    **/
    getClassName: function () {
        // TODO: add attr with setter for host?
        var host = this.host,
            NAME = (host && host.constructor.NAME) ||
                    this.constructor.NAME;

        if (host && host.getClassName) {
            return host.getClassName.apply(host, arguments);
        } else {
            return Y.ClassNameManager.getClassName
                .apply(Y.ClassNameManager,
                       [NAME].concat(toArray(arguments, 0, true)));
        }
    },

    /**
    Relays call to the `bodyView`'s `getRecord` method if it has one.

    @method getRecord
    @param {String|Node} seed Node or identifier for a row or child element
    @return {Model}
    @since 3.6.0
    **/
    getRecord: function () {
        return this.body && this.body.getRecord &&
            this.body.getRecord.apply(this.body, arguments);
    },

    /**
    Returns the `<tr>` Node from the given row index, Model, or Model's
    `clientId`.  If the rows haven't been rendered yet, or if the row can't be
    found by the input, `null` is returned.

    This is actually just a pass through to the `bodyView` instance's method
    by the same name.

    @method getRow
    @param {Number|String|Model} id Row index, Model instance, or clientId
    @return {Node}
    @since 3.5.0
    **/
    getRow: function (id) {
        return this.body && this.body.getRow &&
            this.body.getRow.apply(this.body, arguments);
    },


    //-----------------------------------------------------------------------//
    // Protected and private methods
    //-----------------------------------------------------------------------//
    /**
    Updates the table's `summary` attribute.

    @method _afterSummaryChange
    @param {EventHandle} e The change event
    @protected
    @since 3.6.0
    **/
    _afterSummaryChange: function (e) {
        this._uiSetSummary(e.newVal);
    },

    /**
    Updates the table's `<caption>`.

    @method _afterCaptionChange
    @param {EventHandle} e The change event
    @protected
    @since 3.6.0
    **/
    _afterCaptionChange: function (e) {
        this._uiSetCaption(e.newVal);
    },

    /**
    Updates the table's width.

    @method _afterWidthChange
    @param {EventHandle} e The change event
    @protected
    @since 3.6.0
    **/
    _afterWidthChange: function (e) {
        this._uiSetWidth(e.newVal);
    },

    /**
    Attaches event subscriptions to relay attribute changes to the child Views.

    @method _bindUI
    @protected
    @since 3.6.0
    **/
    _bindUI: function () {
        var relay;

        if (!this._eventHandles) {
            relay = Y.bind('_relayAttrChange', this);

            this._eventHandles = this.after({
                columnsChange  : relay,
                modelListChange: relay,
                summaryChange  : Y.bind('_afterSummaryChange', this),
                captionChange  : Y.bind('_afterCaptionChange', this),
                widthChange    : Y.bind('_afterWidthChange', this)
            });
        }
    },

    /**
    Creates the `<table>`.

    @method _createTable
    @return {Node} The `<table>` node
    @protected
    @since 3.5.0
    **/
    _createTable: function () {
        return Y.Node.create(fromTemplate(this.TABLE_TEMPLATE, {
            className: this.getClassName('table')
        })).empty();
    },

    /**
    Calls `render()` on the `bodyView` class instance.

    @method _defRenderBodyFn
    @param {EventFacade} e The renderBody event
    @protected
    @since 3.5.0
    **/
    _defRenderBodyFn: function (e) {
        e.view.render();
    },

    /**
    Calls `render()` on the `footerView` class instance.

    @method _defRenderFooterFn
    @param {EventFacade} e The renderFooter event
    @protected
    @since 3.5.0
    **/
    _defRenderFooterFn: function (e) {
        e.view.render();
    },

    /**
    Calls `render()` on the `headerView` class instance.

    @method _defRenderHeaderFn
    @param {EventFacade} e The renderHeader event
    @protected
    @since 3.5.0
    **/
    _defRenderHeaderFn: function (e) {
        e.view.render();
    },

    /**
    Renders the `<table>` and, if there are associated Views, the `<thead>`,
    `<tfoot>`, and `<tbody>` (empty until `syncUI`).

    Assigns the generated table nodes to the `tableNode`, `_theadNode`,
    `_tfootNode`, and `_tbodyNode` properties.  Assigns the instantiated Views
    to the `head`, `foot`, and `body` properties.


    @method _defRenderTableFn
    @param {EventFacade} e The renderTable event
    @protected
    @since 3.5.0
    **/
    _defRenderTableFn: function (e) {
        var container = this.get('container'),
            attrs = this.getAttrs();

        if (!this.tableNode) {
            this.tableNode = this._createTable();
        }

        attrs.host  = this.get('host') || this;
        attrs.table = this;
        attrs.container = this.tableNode;

        this._uiSetCaption(this.get('caption'));
        this._uiSetSummary(this.get('summary'));
        this._uiSetWidth(this.get('width'));

        if (this.head || e.headerView) {
            if (!this.head) {
                this.head = new e.headerView(Y.merge(attrs, e.headerConfig));
            }

            this.fire('renderHeader', { view: this.head });
        }

        if (this.foot || e.footerView) {
            if (!this.foot) {
                this.foot = new e.footerView(Y.merge(attrs, e.footerConfig));
            }

            this.fire('renderFooter', { view: this.foot });
        }

        attrs.columns = this.displayColumns;

        if (this.body || e.bodyView) {
            if (!this.body) {
                this.body = new e.bodyView(Y.merge(attrs, e.bodyConfig));
            }

            this.fire('renderBody', { view: this.body });
        }

        if (!container.contains(this.tableNode)) {
            container.append(this.tableNode);
        }

        this._bindUI();
    },

    /**
    Cleans up state, destroys child views, etc.

    @method destructor
    @protected
    **/
    destructor: function () {
        if (this.head && this.head.destroy) {
            this.head.destroy();
        }
        delete this.head;

        if (this.foot && this.foot.destroy) {
            this.foot.destroy();
        }
        delete this.foot;

        if (this.body && this.body.destroy) {
            this.body.destroy();
        }
        delete this.body;

        if (this._eventHandles) {
            this._eventHandles.detach();
            delete this._eventHandles;
        }

        if (this.tableNode) {
            this.tableNode.remove().destroy(true);
        }
    },

    /**
    Processes the full column array, distilling the columns down to those that
    correspond to cell data columns.

    @method _extractDisplayColumns
    @protected
    **/
    _extractDisplayColumns: function () {
        var columns = this.get('columns'),
            displayColumns = [];

        function process(cols) {
            var i, len, col;

            for (i = 0, len = cols.length; i < len; ++i) {
                col = cols[i];

                if (isArray(col.children)) {
                    process(col.children);
                } else {
                    displayColumns.push(col);
                }
            }
        }

        process(columns);

        /**
        Array of the columns that correspond to those with value cells in the
        data rows. Excludes colspan header columns (configured with `children`).

        @property displayColumns
        @type {Object[]}
        @since 3.6.0
        **/
        this.displayColumns = displayColumns;
    },

    /**
    Publishes core events.

    @method _initEvents
    @protected
    @since 3.5.0
    **/
    _initEvents: function () {
        this.publish({
            // Y.bind used to allow late binding for method override support
            renderTable : { defaultFn: Y.bind('_defRenderTableFn', this) },
            renderHeader: { defaultFn: Y.bind('_defRenderHeaderFn', this) },
            renderBody  : { defaultFn: Y.bind('_defRenderBodyFn', this) },
            renderFooter: { defaultFn: Y.bind('_defRenderFooterFn', this) }
        });
    },

    /**
    Constructor logic.

    @method intializer
    @param {Object} config Configuration object passed to the constructor
    @protected
    @since 3.6.0
    **/
    initializer: function (config) {
        this.host = config.host;

        this._initEvents();

        this._extractDisplayColumns();

        this.after('columnsChange', this._extractDisplayColumns, this);
    },

    /**
    Relays attribute changes to the child Views.

    @method _relayAttrChange
    @param {EventHandle} e The change event
    @protected
    @since 3.6.0
    **/
    _relayAttrChange: function (e) {
        var attr = e.attrName,
            val  = e.newVal;

        if (this.head) {
            this.head.set(attr, val);
        }

        if (this.foot) {
            this.foot.set(attr, val);
        }

        if (this.body) {
            if (attr === 'columns') {
                val = this.displayColumns;
            }

            this.body.set(attr, val);
        }
    },

    /**
    Creates the UI in the configured `container`.

    @method render
    @return {TableView}
    @chainable
    **/
    render: function () {
        if (this.get('container')) {
            this.fire('renderTable', {
                headerView  : this.get('headerView'),
                headerConfig: this.get('headerConfig'),

                bodyView    : this.get('bodyView'),
                bodyConfig  : this.get('bodyConfig'),

                footerView  : this.get('footerView'),
                footerConfig: this.get('footerConfig')
            });
        }

        return this;
    },

    /**
    Creates, removes, or updates the table's `<caption>` element per the input
    value.  Empty values result in the caption being removed.

    @method _uiSetCaption
    @param {HTML} htmlContent The content to populate the table caption
    @protected
    @since 3.5.0
    **/
    _uiSetCaption: function (htmlContent) {
        var table   = this.tableNode,
            caption = this.captionNode;

        if (htmlContent) {
            if (!caption) {
                this.captionNode = caption = Y.Node.create(
                    fromTemplate(this.CAPTION_TEMPLATE, {
                        className: this.getClassName('caption')
                    }));

                table.prepend(this.captionNode);
            }

            caption.setHTML(htmlContent);

        } else if (caption) {
            caption.remove(true);

            delete this.captionNode;
        }
    },

    /**
    Updates the table's `summary` attribute with the input value.

    @method _uiSetSummary
    @protected
    @since 3.5.0
    **/
    _uiSetSummary: function (summary) {
        if (summary) {
            this.tableNode.setAttribute('summary', summary);
        } else {
            this.tableNode.removeAttribute('summary');
        }
    },

    /**
    Sets the `boundingBox` and table width per the input value.

    @method _uiSetWidth
    @param {Number|String} width The width to make the table
    @protected
    @since 3.5.0
    **/
    _uiSetWidth: function (width) {
        var table = this.tableNode;

        // Table width needs to account for borders
        table.setStyle('width', !width ? '' :
            (this.get('container').get('offsetWidth') -
             (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0) -
             (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0)) +
             'px');

        table.setStyle('width', width);
    },

    /**
    Ensures that the input is a View class or at least has a `render` method.

    @method _validateView
    @param {View|Function} val The View class
    @return {Boolean}
    @protected
    **/
    _validateView: function (val) {
        return isFunction(val) && val.prototype.render;
    }
}, {
    ATTRS: {
        /**
        Content for the `<table summary="ATTRIBUTE VALUE HERE">`.  Values
        assigned to this attribute will be HTML escaped for security.

        @attribute summary
        @type {String}
        @default '' (empty string)
        @since 3.5.0
        **/
        //summary: {},

        /**
        HTML content of an optional `<caption>` element to appear above the
        table.  Leave this config unset or set to a falsy value to remove the
        caption.

        @attribute caption
        @type HTML
        @default undefined (initially unset)
        @since 3.6.0
        **/
        //caption: {},

        /**
        Columns to include in the rendered table.

        This attribute takes an array of objects. Each object is considered a
        data column or header cell to be rendered.  How the objects are
        translated into markup is delegated to the `headerView`, `bodyView`,
        and `footerView`.

        The raw value is passed to the `headerView` and `footerView`.  The
        `bodyView` receives the instance's `displayColumns` array, which is
        parsed from the columns array.  If there are no nested columns (columns
        configured with a `children` array), the `displayColumns` is the same
        as the raw value.
        
        @attribute columns
        @type {Object[]}
        @since 3.6.0
        **/
        columns: {
            validator: isArray
        },

        /**
        Width of the table including borders.  This value requires units, so
        `200` is invalid, but `'200px'` is valid.  Setting the empty string
        (the default) will allow the browser to set the table width.

        @attribute width
        @type {String}
        @default ''
        @since 3.6.0
        **/
        width: {
            value: '',
            validator: YLang.isString
        },

        /**
        An instance of this class is used to render the contents of the
        `<thead>`&mdash;the column headers for the table.
        
        The instance of this View will be assigned to the instance's `head`
        property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute headerView
        @type {Function|Object}
        @default Y.DataTable.HeaderView
        @since 3.6.0
        **/
        headerView: {
            value: Y.DataTable.HeaderView,
            validator: '_validateView'
        },

        /**
        Configuration overrides used when instantiating the `headerView`
        instance.

        @attribute headerConfig
        @type {Object}
        @since 3.6.0
        **/
        //headerConfig: {},

        /**
        An instance of this class is used to render the contents of the
        `<tfoot>` (if appropriate).
        
        The instance of this View will be assigned to the instance's `foot`
        property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute footerView
        @type {Function|Object}
        @since 3.6.0
        **/
        footerView: {
            validator: '_validateView'
        },

        /**
        Configuration overrides used when instantiating the `footerView`
        instance.

        @attribute footerConfig
        @type {Object}
        @since 3.6.0
        **/
        //footerConfig: {},

        /**
        An instance of this class is used to render the contents of the table's
        `<tbody>`&mdash;the data cells in the table.
        
        The instance of this View will be assigned to the instance's `body`
        property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute bodyView
        @type {Function|Object}
        @default Y.DataTable.BodyView
        @since 3.6.0
        **/
        bodyView: {
            value: Y.DataTable.BodyView,
            validator: '_validateView'
        }

        /**
        Configuration overrides used when instantiating the `bodyView`
        instance.

        @attribute bodyConfig
        @type {Object}
        @since 3.6.0
        **/
        //bodyConfig: {}
    }
});




}, '3.7.3', {"requires": ["datatable-core", "datatable-head", "datatable-body", "view", "classnamemanager"]});
