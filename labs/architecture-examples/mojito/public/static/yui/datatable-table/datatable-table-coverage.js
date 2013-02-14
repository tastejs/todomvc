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
_yuitest_coverage["build/datatable-table/datatable-table.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatable-table/datatable-table.js",
    code: []
};
_yuitest_coverage["build/datatable-table/datatable-table.js"].code=["YUI.add('datatable-table', function (Y, NAME) {","","/**","View class responsible for rendering a `<table>` from provided data.  Used as","the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.","","@module datatable","@submodule datatable-table","@since 3.6.0","**/","var toArray = Y.Array,","    YLang   = Y.Lang,","    fromTemplate = YLang.sub,","","    isArray    = YLang.isArray,","    isFunction = YLang.isFunction;","","/**","View class responsible for rendering a `<table>` from provided data.  Used as","the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.","","","","@class TableView","@namespace DataTable","@extends View","@since 3.6.0","**/","Y.namespace('DataTable').TableView = Y.Base.create('table', Y.View, [], {","","    /**","    The HTML template used to create the caption Node if the `caption`","    attribute is set.","","    @property CAPTION_TEMPLATE","    @type {HTML}","    @default '<caption class=\"{className}\"/>'","    @since 3.6.0","    **/","    CAPTION_TEMPLATE: '<caption class=\"{className}\"/>',","","    /**","    The HTML template used to create the table Node.","","    @property TABLE_TEMPLATE","    @type {HTML}","    @default '<table cellspacing=\"0\" class=\"{className}\"/>'","    @since 3.6.0","    **/","    TABLE_TEMPLATE  : '<table cellspacing=\"0\" class=\"{className}\"/>',","","    /**","    The object or instance of the class assigned to `bodyView` that is","    responsible for rendering and managing the table's `<tbody>`(s) and its","    content.","","    @property body","    @type {Object}","    @default undefined (initially unset)","    @since 3.5.0","    **/","    //body: null,","","    /**","    The object or instance of the class assigned to `footerView` that is","    responsible for rendering and managing the table's `<tfoot>` and its","    content.","","    @property foot","    @type {Object}","    @default undefined (initially unset)","    @since 3.5.0","    **/","    //foot: null,","","    /**","    The object or instance of the class assigned to `headerView` that is","    responsible for rendering and managing the table's `<thead>` and its","    content.","","    @property head","    @type {Object}","    @default undefined (initially unset)","    @since 3.5.0","    **/","    //head: null,","","    //-----------------------------------------------------------------------//","    // Public methods","    //-----------------------------------------------------------------------//","","    /**","    Returns the `<td>` Node from the given row and column index.  Alternately,","    the `seed` can be a Node.  If so, the nearest ancestor cell is returned.","    If the `seed` is a cell, it is returned.  If there is no cell at the given","    coordinates, `null` is returned.","","    Optionally, include an offset array or string to return a cell near the","    cell identified by the `seed`.  The offset can be an array containing the","    number of rows to shift followed by the number of columns to shift, or one","    of \"above\", \"below\", \"next\", or \"previous\".","","    <pre><code>// Previous cell in the previous row","    var cell = table.getCell(e.target, [-1, -1]);","","    // Next cell","    var cell = table.getCell(e.target, 'next');","    var cell = table.getCell(e.taregt, [0, 1];</pre></code>","","    This is actually just a pass through to the `bodyView` instance's method","    by the same name.","","    @method getCell","    @param {Number[]|Node} seed Array of row and column indexes, or a Node that","        is either the cell itself or a descendant of one.","    @param {Number[]|String} [shift] Offset by which to identify the returned","        cell Node","    @return {Node}","    @since 3.5.0","    **/","    getCell: function (seed, shift) {","        return this.body && this.body.getCell &&","            this.body.getCell.apply(this.body, arguments);","    },","","    /**","    Returns the generated CSS classname based on the input.  If the `host`","    attribute is configured, it will attempt to relay to its `getClassName`","    or use its static `NAME` property as a string base.","    ","    If `host` is absent or has neither method nor `NAME`, a CSS classname","    will be generated using this class's `NAME`.","","    @method getClassName","    @param {String} token* Any number of token strings to assemble the","        classname from.","    @return {String}","    @protected","    **/","    getClassName: function () {","        // TODO: add attr with setter for host?","        var host = this.host,","            NAME = (host && host.constructor.NAME) ||","                    this.constructor.NAME;","","        if (host && host.getClassName) {","            return host.getClassName.apply(host, arguments);","        } else {","            return Y.ClassNameManager.getClassName","                .apply(Y.ClassNameManager,","                       [NAME].concat(toArray(arguments, 0, true)));","        }","    },","","    /**","    Relays call to the `bodyView`'s `getRecord` method if it has one.","","    @method getRecord","    @param {String|Node} seed Node or identifier for a row or child element","    @return {Model}","    @since 3.6.0","    **/","    getRecord: function () {","        return this.body && this.body.getRecord &&","            this.body.getRecord.apply(this.body, arguments);","    },","","    /**","    Returns the `<tr>` Node from the given row index, Model, or Model's","    `clientId`.  If the rows haven't been rendered yet, or if the row can't be","    found by the input, `null` is returned.","","    This is actually just a pass through to the `bodyView` instance's method","    by the same name.","","    @method getRow","    @param {Number|String|Model} id Row index, Model instance, or clientId","    @return {Node}","    @since 3.5.0","    **/","    getRow: function (id) {","        return this.body && this.body.getRow &&","            this.body.getRow.apply(this.body, arguments);","    },","","","    //-----------------------------------------------------------------------//","    // Protected and private methods","    //-----------------------------------------------------------------------//","    /**","    Updates the table's `summary` attribute.","","    @method _afterSummaryChange","    @param {EventHandle} e The change event","    @protected","    @since 3.6.0","    **/","    _afterSummaryChange: function (e) {","        this._uiSetSummary(e.newVal);","    },","","    /**","    Updates the table's `<caption>`.","","    @method _afterCaptionChange","    @param {EventHandle} e The change event","    @protected","    @since 3.6.0","    **/","    _afterCaptionChange: function (e) {","        this._uiSetCaption(e.newVal);","    },","","    /**","    Updates the table's width.","","    @method _afterWidthChange","    @param {EventHandle} e The change event","    @protected","    @since 3.6.0","    **/","    _afterWidthChange: function (e) {","        this._uiSetWidth(e.newVal);","    },","","    /**","    Attaches event subscriptions to relay attribute changes to the child Views.","","    @method _bindUI","    @protected","    @since 3.6.0","    **/","    _bindUI: function () {","        var relay;","","        if (!this._eventHandles) {","            relay = Y.bind('_relayAttrChange', this);","","            this._eventHandles = this.after({","                columnsChange  : relay,","                modelListChange: relay,","                summaryChange  : Y.bind('_afterSummaryChange', this),","                captionChange  : Y.bind('_afterCaptionChange', this),","                widthChange    : Y.bind('_afterWidthChange', this)","            });","        }","    },","","    /**","    Creates the `<table>`.","","    @method _createTable","    @return {Node} The `<table>` node","    @protected","    @since 3.5.0","    **/","    _createTable: function () {","        return Y.Node.create(fromTemplate(this.TABLE_TEMPLATE, {","            className: this.getClassName('table')","        })).empty();","    },","","    /**","    Calls `render()` on the `bodyView` class instance.","","    @method _defRenderBodyFn","    @param {EventFacade} e The renderBody event","    @protected","    @since 3.5.0","    **/","    _defRenderBodyFn: function (e) {","        e.view.render();","    },","","    /**","    Calls `render()` on the `footerView` class instance.","","    @method _defRenderFooterFn","    @param {EventFacade} e The renderFooter event","    @protected","    @since 3.5.0","    **/","    _defRenderFooterFn: function (e) {","        e.view.render();","    },","","    /**","    Calls `render()` on the `headerView` class instance.","","    @method _defRenderHeaderFn","    @param {EventFacade} e The renderHeader event","    @protected","    @since 3.5.0","    **/","    _defRenderHeaderFn: function (e) {","        e.view.render();","    },","","    /**","    Renders the `<table>` and, if there are associated Views, the `<thead>`,","    `<tfoot>`, and `<tbody>` (empty until `syncUI`).","","    Assigns the generated table nodes to the `tableNode`, `_theadNode`,","    `_tfootNode`, and `_tbodyNode` properties.  Assigns the instantiated Views","    to the `head`, `foot`, and `body` properties.","","","    @method _defRenderTableFn","    @param {EventFacade} e The renderTable event","    @protected","    @since 3.5.0","    **/","    _defRenderTableFn: function (e) {","        var container = this.get('container'),","            attrs = this.getAttrs();","","        if (!this.tableNode) {","            this.tableNode = this._createTable();","        }","","        attrs.host  = this.get('host') || this;","        attrs.table = this;","        attrs.container = this.tableNode;","","        this._uiSetCaption(this.get('caption'));","        this._uiSetSummary(this.get('summary'));","        this._uiSetWidth(this.get('width'));","","        if (this.head || e.headerView) {","            if (!this.head) {","                this.head = new e.headerView(Y.merge(attrs, e.headerConfig));","            }","","            this.fire('renderHeader', { view: this.head });","        }","","        if (this.foot || e.footerView) {","            if (!this.foot) {","                this.foot = new e.footerView(Y.merge(attrs, e.footerConfig));","            }","","            this.fire('renderFooter', { view: this.foot });","        }","","        attrs.columns = this.displayColumns;","","        if (this.body || e.bodyView) {","            if (!this.body) {","                this.body = new e.bodyView(Y.merge(attrs, e.bodyConfig));","            }","","            this.fire('renderBody', { view: this.body });","        }","","        if (!container.contains(this.tableNode)) {","            container.append(this.tableNode);","        }","","        this._bindUI();","    },","","    /**","    Cleans up state, destroys child views, etc.","","    @method destructor","    @protected","    **/","    destructor: function () {","        if (this.head && this.head.destroy) {","            this.head.destroy();","        }","        delete this.head;","","        if (this.foot && this.foot.destroy) {","            this.foot.destroy();","        }","        delete this.foot;","","        if (this.body && this.body.destroy) {","            this.body.destroy();","        }","        delete this.body;","","        if (this._eventHandles) {","            this._eventHandles.detach();","            delete this._eventHandles;","        }","","        if (this.tableNode) {","            this.tableNode.remove().destroy(true);","        }","    },","","    /**","    Processes the full column array, distilling the columns down to those that","    correspond to cell data columns.","","    @method _extractDisplayColumns","    @protected","    **/","    _extractDisplayColumns: function () {","        var columns = this.get('columns'),","            displayColumns = [];","","        function process(cols) {","            var i, len, col;","","            for (i = 0, len = cols.length; i < len; ++i) {","                col = cols[i];","","                if (isArray(col.children)) {","                    process(col.children);","                } else {","                    displayColumns.push(col);","                }","            }","        }","","        process(columns);","","        /**","        Array of the columns that correspond to those with value cells in the","        data rows. Excludes colspan header columns (configured with `children`).","","        @property displayColumns","        @type {Object[]}","        @since 3.6.0","        **/","        this.displayColumns = displayColumns;","    },","","    /**","    Publishes core events.","","    @method _initEvents","    @protected","    @since 3.5.0","    **/","    _initEvents: function () {","        this.publish({","            // Y.bind used to allow late binding for method override support","            renderTable : { defaultFn: Y.bind('_defRenderTableFn', this) },","            renderHeader: { defaultFn: Y.bind('_defRenderHeaderFn', this) },","            renderBody  : { defaultFn: Y.bind('_defRenderBodyFn', this) },","            renderFooter: { defaultFn: Y.bind('_defRenderFooterFn', this) }","        });","    },","","    /**","    Constructor logic.","","    @method intializer","    @param {Object} config Configuration object passed to the constructor","    @protected","    @since 3.6.0","    **/","    initializer: function (config) {","        this.host = config.host;","","        this._initEvents();","","        this._extractDisplayColumns();","","        this.after('columnsChange', this._extractDisplayColumns, this);","    },","","    /**","    Relays attribute changes to the child Views.","","    @method _relayAttrChange","    @param {EventHandle} e The change event","    @protected","    @since 3.6.0","    **/","    _relayAttrChange: function (e) {","        var attr = e.attrName,","            val  = e.newVal;","","        if (this.head) {","            this.head.set(attr, val);","        }","","        if (this.foot) {","            this.foot.set(attr, val);","        }","","        if (this.body) {","            if (attr === 'columns') {","                val = this.displayColumns;","            }","","            this.body.set(attr, val);","        }","    },","","    /**","    Creates the UI in the configured `container`.","","    @method render","    @return {TableView}","    @chainable","    **/","    render: function () {","        if (this.get('container')) {","            this.fire('renderTable', {","                headerView  : this.get('headerView'),","                headerConfig: this.get('headerConfig'),","","                bodyView    : this.get('bodyView'),","                bodyConfig  : this.get('bodyConfig'),","","                footerView  : this.get('footerView'),","                footerConfig: this.get('footerConfig')","            });","        }","","        return this;","    },","","    /**","    Creates, removes, or updates the table's `<caption>` element per the input","    value.  Empty values result in the caption being removed.","","    @method _uiSetCaption","    @param {HTML} htmlContent The content to populate the table caption","    @protected","    @since 3.5.0","    **/","    _uiSetCaption: function (htmlContent) {","        var table   = this.tableNode,","            caption = this.captionNode;","","        if (htmlContent) {","            if (!caption) {","                this.captionNode = caption = Y.Node.create(","                    fromTemplate(this.CAPTION_TEMPLATE, {","                        className: this.getClassName('caption')","                    }));","","                table.prepend(this.captionNode);","            }","","            caption.setHTML(htmlContent);","","        } else if (caption) {","            caption.remove(true);","","            delete this.captionNode;","        }","    },","","    /**","    Updates the table's `summary` attribute with the input value.","","    @method _uiSetSummary","    @protected","    @since 3.5.0","    **/","    _uiSetSummary: function (summary) {","        if (summary) {","            this.tableNode.setAttribute('summary', summary);","        } else {","            this.tableNode.removeAttribute('summary');","        }","    },","","    /**","    Sets the `boundingBox` and table width per the input value.","","    @method _uiSetWidth","    @param {Number|String} width The width to make the table","    @protected","    @since 3.5.0","    **/","    _uiSetWidth: function (width) {","        var table = this.tableNode;","","        // Table width needs to account for borders","        table.setStyle('width', !width ? '' :","            (this.get('container').get('offsetWidth') -","             (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0) -","             (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0)) +","             'px');","","        table.setStyle('width', width);","    },","","    /**","    Ensures that the input is a View class or at least has a `render` method.","","    @method _validateView","    @param {View|Function} val The View class","    @return {Boolean}","    @protected","    **/","    _validateView: function (val) {","        return isFunction(val) && val.prototype.render;","    }","}, {","    ATTRS: {","        /**","        Content for the `<table summary=\"ATTRIBUTE VALUE HERE\">`.  Values","        assigned to this attribute will be HTML escaped for security.","","        @attribute summary","        @type {String}","        @default '' (empty string)","        @since 3.5.0","        **/","        //summary: {},","","        /**","        HTML content of an optional `<caption>` element to appear above the","        table.  Leave this config unset or set to a falsy value to remove the","        caption.","","        @attribute caption","        @type HTML","        @default undefined (initially unset)","        @since 3.6.0","        **/","        //caption: {},","","        /**","        Columns to include in the rendered table.","","        This attribute takes an array of objects. Each object is considered a","        data column or header cell to be rendered.  How the objects are","        translated into markup is delegated to the `headerView`, `bodyView`,","        and `footerView`.","","        The raw value is passed to the `headerView` and `footerView`.  The","        `bodyView` receives the instance's `displayColumns` array, which is","        parsed from the columns array.  If there are no nested columns (columns","        configured with a `children` array), the `displayColumns` is the same","        as the raw value.","        ","        @attribute columns","        @type {Object[]}","        @since 3.6.0","        **/","        columns: {","            validator: isArray","        },","","        /**","        Width of the table including borders.  This value requires units, so","        `200` is invalid, but `'200px'` is valid.  Setting the empty string","        (the default) will allow the browser to set the table width.","","        @attribute width","        @type {String}","        @default ''","        @since 3.6.0","        **/","        width: {","            value: '',","            validator: YLang.isString","        },","","        /**","        An instance of this class is used to render the contents of the","        `<thead>`&mdash;the column headers for the table.","        ","        The instance of this View will be assigned to the instance's `head`","        property.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        @attribute headerView","        @type {Function|Object}","        @default Y.DataTable.HeaderView","        @since 3.6.0","        **/","        headerView: {","            value: Y.DataTable.HeaderView,","            validator: '_validateView'","        },","","        /**","        Configuration overrides used when instantiating the `headerView`","        instance.","","        @attribute headerConfig","        @type {Object}","        @since 3.6.0","        **/","        //headerConfig: {},","","        /**","        An instance of this class is used to render the contents of the","        `<tfoot>` (if appropriate).","        ","        The instance of this View will be assigned to the instance's `foot`","        property.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        @attribute footerView","        @type {Function|Object}","        @since 3.6.0","        **/","        footerView: {","            validator: '_validateView'","        },","","        /**","        Configuration overrides used when instantiating the `footerView`","        instance.","","        @attribute footerConfig","        @type {Object}","        @since 3.6.0","        **/","        //footerConfig: {},","","        /**","        An instance of this class is used to render the contents of the table's","        `<tbody>`&mdash;the data cells in the table.","        ","        The instance of this View will be assigned to the instance's `body`","        property.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        @attribute bodyView","        @type {Function|Object}","        @default Y.DataTable.BodyView","        @since 3.6.0","        **/","        bodyView: {","            value: Y.DataTable.BodyView,","            validator: '_validateView'","        }","","        /**","        Configuration overrides used when instantiating the `bodyView`","        instance.","","        @attribute bodyConfig","        @type {Object}","        @since 3.6.0","        **/","        //bodyConfig: {}","    }","});","","","","","}, '3.7.3', {\"requires\": [\"datatable-core\", \"datatable-head\", \"datatable-body\", \"view\", \"classnamemanager\"]});"];
_yuitest_coverage["build/datatable-table/datatable-table.js"].lines = {"1":0,"11":0,"29":0,"122":0,"142":0,"146":0,"147":0,"149":0,"164":0,"182":0,"199":0,"211":0,"223":0,"234":0,"236":0,"237":0,"239":0,"258":0,"272":0,"284":0,"296":0,"314":0,"317":0,"318":0,"321":0,"322":0,"323":0,"325":0,"326":0,"327":0,"329":0,"330":0,"331":0,"334":0,"337":0,"338":0,"339":0,"342":0,"345":0,"347":0,"348":0,"349":0,"352":0,"355":0,"356":0,"359":0,"369":0,"370":0,"372":0,"374":0,"375":0,"377":0,"379":0,"380":0,"382":0,"384":0,"385":0,"386":0,"389":0,"390":0,"402":0,"405":0,"406":0,"408":0,"409":0,"411":0,"412":0,"414":0,"419":0,"429":0,"440":0,"458":0,"460":0,"462":0,"464":0,"476":0,"479":0,"480":0,"483":0,"484":0,"487":0,"488":0,"489":0,"492":0,"504":0,"505":0,"517":0,"530":0,"533":0,"534":0,"535":0,"540":0,"543":0,"545":0,"546":0,"548":0,"560":0,"561":0,"563":0,"576":0,"579":0,"585":0,"597":0};
_yuitest_coverage["build/datatable-table/datatable-table.js"].functions = {"getCell:121":0,"getClassName:140":0,"getRecord:163":0,"getRow:181":0,"_afterSummaryChange:198":0,"_afterCaptionChange:210":0,"_afterWidthChange:222":0,"_bindUI:233":0,"_createTable:257":0,"_defRenderBodyFn:271":0,"_defRenderFooterFn:283":0,"_defRenderHeaderFn:295":0,"_defRenderTableFn:313":0,"destructor:368":0,"process:405":0,"_extractDisplayColumns:401":0,"_initEvents:439":0,"initializer:457":0,"_relayAttrChange:475":0,"render:503":0,"_uiSetCaption:529":0,"_uiSetSummary:559":0,"_uiSetWidth:575":0,"_validateView:596":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatable-table/datatable-table.js"].coveredLines = 103;
_yuitest_coverage["build/datatable-table/datatable-table.js"].coveredFunctions = 25;
_yuitest_coverline("build/datatable-table/datatable-table.js", 1);
YUI.add('datatable-table', function (Y, NAME) {

/**
View class responsible for rendering a `<table>` from provided data.  Used as
the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.

@module datatable
@submodule datatable-table
@since 3.6.0
**/
_yuitest_coverfunc("build/datatable-table/datatable-table.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatable-table/datatable-table.js", 11);
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
_yuitest_coverline("build/datatable-table/datatable-table.js", 29);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "getCell", 121);
_yuitest_coverline("build/datatable-table/datatable-table.js", 122);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "getClassName", 140);
_yuitest_coverline("build/datatable-table/datatable-table.js", 142);
var host = this.host,
            NAME = (host && host.constructor.NAME) ||
                    this.constructor.NAME;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 146);
if (host && host.getClassName) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 147);
return host.getClassName.apply(host, arguments);
        } else {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 149);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "getRecord", 163);
_yuitest_coverline("build/datatable-table/datatable-table.js", 164);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "getRow", 181);
_yuitest_coverline("build/datatable-table/datatable-table.js", 182);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_afterSummaryChange", 198);
_yuitest_coverline("build/datatable-table/datatable-table.js", 199);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_afterCaptionChange", 210);
_yuitest_coverline("build/datatable-table/datatable-table.js", 211);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_afterWidthChange", 222);
_yuitest_coverline("build/datatable-table/datatable-table.js", 223);
this._uiSetWidth(e.newVal);
    },

    /**
    Attaches event subscriptions to relay attribute changes to the child Views.

    @method _bindUI
    @protected
    @since 3.6.0
    **/
    _bindUI: function () {
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_bindUI", 233);
_yuitest_coverline("build/datatable-table/datatable-table.js", 234);
var relay;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 236);
if (!this._eventHandles) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 237);
relay = Y.bind('_relayAttrChange', this);

            _yuitest_coverline("build/datatable-table/datatable-table.js", 239);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_createTable", 257);
_yuitest_coverline("build/datatable-table/datatable-table.js", 258);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_defRenderBodyFn", 271);
_yuitest_coverline("build/datatable-table/datatable-table.js", 272);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_defRenderFooterFn", 283);
_yuitest_coverline("build/datatable-table/datatable-table.js", 284);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_defRenderHeaderFn", 295);
_yuitest_coverline("build/datatable-table/datatable-table.js", 296);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_defRenderTableFn", 313);
_yuitest_coverline("build/datatable-table/datatable-table.js", 314);
var container = this.get('container'),
            attrs = this.getAttrs();

        _yuitest_coverline("build/datatable-table/datatable-table.js", 317);
if (!this.tableNode) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 318);
this.tableNode = this._createTable();
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 321);
attrs.host  = this.get('host') || this;
        _yuitest_coverline("build/datatable-table/datatable-table.js", 322);
attrs.table = this;
        _yuitest_coverline("build/datatable-table/datatable-table.js", 323);
attrs.container = this.tableNode;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 325);
this._uiSetCaption(this.get('caption'));
        _yuitest_coverline("build/datatable-table/datatable-table.js", 326);
this._uiSetSummary(this.get('summary'));
        _yuitest_coverline("build/datatable-table/datatable-table.js", 327);
this._uiSetWidth(this.get('width'));

        _yuitest_coverline("build/datatable-table/datatable-table.js", 329);
if (this.head || e.headerView) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 330);
if (!this.head) {
                _yuitest_coverline("build/datatable-table/datatable-table.js", 331);
this.head = new e.headerView(Y.merge(attrs, e.headerConfig));
            }

            _yuitest_coverline("build/datatable-table/datatable-table.js", 334);
this.fire('renderHeader', { view: this.head });
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 337);
if (this.foot || e.footerView) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 338);
if (!this.foot) {
                _yuitest_coverline("build/datatable-table/datatable-table.js", 339);
this.foot = new e.footerView(Y.merge(attrs, e.footerConfig));
            }

            _yuitest_coverline("build/datatable-table/datatable-table.js", 342);
this.fire('renderFooter', { view: this.foot });
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 345);
attrs.columns = this.displayColumns;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 347);
if (this.body || e.bodyView) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 348);
if (!this.body) {
                _yuitest_coverline("build/datatable-table/datatable-table.js", 349);
this.body = new e.bodyView(Y.merge(attrs, e.bodyConfig));
            }

            _yuitest_coverline("build/datatable-table/datatable-table.js", 352);
this.fire('renderBody', { view: this.body });
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 355);
if (!container.contains(this.tableNode)) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 356);
container.append(this.tableNode);
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 359);
this._bindUI();
    },

    /**
    Cleans up state, destroys child views, etc.

    @method destructor
    @protected
    **/
    destructor: function () {
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "destructor", 368);
_yuitest_coverline("build/datatable-table/datatable-table.js", 369);
if (this.head && this.head.destroy) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 370);
this.head.destroy();
        }
        _yuitest_coverline("build/datatable-table/datatable-table.js", 372);
delete this.head;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 374);
if (this.foot && this.foot.destroy) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 375);
this.foot.destroy();
        }
        _yuitest_coverline("build/datatable-table/datatable-table.js", 377);
delete this.foot;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 379);
if (this.body && this.body.destroy) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 380);
this.body.destroy();
        }
        _yuitest_coverline("build/datatable-table/datatable-table.js", 382);
delete this.body;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 384);
if (this._eventHandles) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 385);
this._eventHandles.detach();
            _yuitest_coverline("build/datatable-table/datatable-table.js", 386);
delete this._eventHandles;
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 389);
if (this.tableNode) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 390);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_extractDisplayColumns", 401);
_yuitest_coverline("build/datatable-table/datatable-table.js", 402);
var columns = this.get('columns'),
            displayColumns = [];

        _yuitest_coverline("build/datatable-table/datatable-table.js", 405);
function process(cols) {
            _yuitest_coverfunc("build/datatable-table/datatable-table.js", "process", 405);
_yuitest_coverline("build/datatable-table/datatable-table.js", 406);
var i, len, col;

            _yuitest_coverline("build/datatable-table/datatable-table.js", 408);
for (i = 0, len = cols.length; i < len; ++i) {
                _yuitest_coverline("build/datatable-table/datatable-table.js", 409);
col = cols[i];

                _yuitest_coverline("build/datatable-table/datatable-table.js", 411);
if (isArray(col.children)) {
                    _yuitest_coverline("build/datatable-table/datatable-table.js", 412);
process(col.children);
                } else {
                    _yuitest_coverline("build/datatable-table/datatable-table.js", 414);
displayColumns.push(col);
                }
            }
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 419);
process(columns);

        /**
        Array of the columns that correspond to those with value cells in the
        data rows. Excludes colspan header columns (configured with `children`).

        @property displayColumns
        @type {Object[]}
        @since 3.6.0
        **/
        _yuitest_coverline("build/datatable-table/datatable-table.js", 429);
this.displayColumns = displayColumns;
    },

    /**
    Publishes core events.

    @method _initEvents
    @protected
    @since 3.5.0
    **/
    _initEvents: function () {
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_initEvents", 439);
_yuitest_coverline("build/datatable-table/datatable-table.js", 440);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "initializer", 457);
_yuitest_coverline("build/datatable-table/datatable-table.js", 458);
this.host = config.host;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 460);
this._initEvents();

        _yuitest_coverline("build/datatable-table/datatable-table.js", 462);
this._extractDisplayColumns();

        _yuitest_coverline("build/datatable-table/datatable-table.js", 464);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_relayAttrChange", 475);
_yuitest_coverline("build/datatable-table/datatable-table.js", 476);
var attr = e.attrName,
            val  = e.newVal;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 479);
if (this.head) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 480);
this.head.set(attr, val);
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 483);
if (this.foot) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 484);
this.foot.set(attr, val);
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 487);
if (this.body) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 488);
if (attr === 'columns') {
                _yuitest_coverline("build/datatable-table/datatable-table.js", 489);
val = this.displayColumns;
            }

            _yuitest_coverline("build/datatable-table/datatable-table.js", 492);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "render", 503);
_yuitest_coverline("build/datatable-table/datatable-table.js", 504);
if (this.get('container')) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 505);
this.fire('renderTable', {
                headerView  : this.get('headerView'),
                headerConfig: this.get('headerConfig'),

                bodyView    : this.get('bodyView'),
                bodyConfig  : this.get('bodyConfig'),

                footerView  : this.get('footerView'),
                footerConfig: this.get('footerConfig')
            });
        }

        _yuitest_coverline("build/datatable-table/datatable-table.js", 517);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_uiSetCaption", 529);
_yuitest_coverline("build/datatable-table/datatable-table.js", 530);
var table   = this.tableNode,
            caption = this.captionNode;

        _yuitest_coverline("build/datatable-table/datatable-table.js", 533);
if (htmlContent) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 534);
if (!caption) {
                _yuitest_coverline("build/datatable-table/datatable-table.js", 535);
this.captionNode = caption = Y.Node.create(
                    fromTemplate(this.CAPTION_TEMPLATE, {
                        className: this.getClassName('caption')
                    }));

                _yuitest_coverline("build/datatable-table/datatable-table.js", 540);
table.prepend(this.captionNode);
            }

            _yuitest_coverline("build/datatable-table/datatable-table.js", 543);
caption.setHTML(htmlContent);

        } else {_yuitest_coverline("build/datatable-table/datatable-table.js", 545);
if (caption) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 546);
caption.remove(true);

            _yuitest_coverline("build/datatable-table/datatable-table.js", 548);
delete this.captionNode;
        }}
    },

    /**
    Updates the table's `summary` attribute with the input value.

    @method _uiSetSummary
    @protected
    @since 3.5.0
    **/
    _uiSetSummary: function (summary) {
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_uiSetSummary", 559);
_yuitest_coverline("build/datatable-table/datatable-table.js", 560);
if (summary) {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 561);
this.tableNode.setAttribute('summary', summary);
        } else {
            _yuitest_coverline("build/datatable-table/datatable-table.js", 563);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_uiSetWidth", 575);
_yuitest_coverline("build/datatable-table/datatable-table.js", 576);
var table = this.tableNode;

        // Table width needs to account for borders
        _yuitest_coverline("build/datatable-table/datatable-table.js", 579);
table.setStyle('width', !width ? '' :
            (this.get('container').get('offsetWidth') -
             (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0) -
             (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0)) +
             'px');

        _yuitest_coverline("build/datatable-table/datatable-table.js", 585);
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
        _yuitest_coverfunc("build/datatable-table/datatable-table.js", "_validateView", 596);
_yuitest_coverline("build/datatable-table/datatable-table.js", 597);
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
