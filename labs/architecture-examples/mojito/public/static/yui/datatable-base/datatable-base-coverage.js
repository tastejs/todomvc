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
_yuitest_coverage["build/datatable-base/datatable-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatable-base/datatable-base.js",
    code: []
};
_yuitest_coverage["build/datatable-base/datatable-base.js"].code=["YUI.add('datatable-base', function (Y, NAME) {","","/**","A Widget for displaying tabular data.  The base implementation of DataTable","provides the ability to dynamically generate an HTML table from a set of column","configurations and row data.","","Two classes are included in the `datatable-base` module: `Y.DataTable` and","`Y.DataTable.Base`.","","@module datatable","@submodule datatable-base","@main datatable","@since 3.5.0","**/","","// DataTable API docs included before DataTable.Base to make yuidoc work","/**","A Widget for displaying tabular data.  Before feature modules are `use()`d,","this class is functionally equivalent to DataTable.Base.  However, feature","modules can modify this class in non-destructive ways, expanding the API and","functionality.","","This is the primary DataTable class.  Out of the box, it provides the ability","to dynamically generate an HTML table from a set of column configurations and","row data.  But feature module inclusion can add table sorting, pagintaion,","highlighting, selection, and more.","","<pre><code>","// The functionality of this table would require additional modules be use()d,","// but the feature APIs are aggregated onto Y.DataTable.","// (Snippet is for illustration. Not all features are available today.)","var table = new Y.DataTable({","    columns: [","        { type: 'checkbox', defaultChecked: true },","        { key: 'firstName', sortable: true, resizable: true },","        { key: 'lastName', sortable: true },","        { key: 'role', formatter: toRoleName }","    ],","    data: {","        source: 'http://myserver.com/service/json',","        type: 'json',","        schema: {","            resultListLocator: 'results.users',","            fields: [","                'username',","                'firstName',","                'lastName',","                { key: 'role', type: 'number' }","            ]","        }","    },","    recordType: UserModel,","    pagedData: {","        location: 'footer',","        pageSizes: [20, 50, 'all'],","        rowsPerPage: 20,","        pageLinks: 5","    },","    editable: true","});","</code></pre>","","### Column Configuration","","The column configurations are set in the form of an array of objects, where","each object corresponds to a column.  For columns populated directly from the","row data, a 'key' property is required to bind the column to that property or","attribute in the row data.","","Not all columns need to relate to row data, nor do all properties or attributes","of the row data need to have a corresponding column.  However, only those","columns included in the `columns` configuration attribute will be rendered.","","Other column configuration properties are supported by the configured","`view`, class as well as any features added by plugins or class extensions.","See the description of DataTable.TableView and its subviews","DataTable.HeaderView, DataTable.BodyView, and DataTable.FooterView (and other","DataTable feature classes) to see what column properties they support.","","Some examples of column configurations would be:","","<pre><code>","// Basic","var columns = [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }];","","// For columns without any additional configuration, strings can be used","var columns = ['firstName', 'lastName', 'age'];","","// Multi-row column headers (see DataTable.HeaderView for details)","var columns = [","    {","        label: 'Name',","        children: [","            { key: 'firstName' },","            { key: 'lastName' }","        ]","    },","    'age' // mixing and matching objects and strings is ok","];","","// Including columns that are not related 1:1 to row data fields/attributes","// (See DataTable.BodyView for details)","var columns = [","    {","        label: 'Name', // Needed for the column header","        formatter: function (o) {","            // Fill the column cells with data from firstName and lastName","            if (o.data.age > 55) {","                o.className += ' senior';","            }","            return o.data.lastName + ', ' + o.data.firstName;","        }","    },","    'age'","];","","// Columns that include feature configurations (for illustration; not all","// features are available today).","var columns = [","    { type: 'checkbox', defaultChecked: true },","    { key: 'firstName', sortable: true, resizable: true, min-width: '300px' },","    { key: 'lastName', sortable: true, resizable: true, min-width: '300px' },","    { key: 'age', emptyCellValue: '<em>unknown</em>' }","];","</code></pre>","","### Row Data Configuration","","The `data` configuration attribute is responsible for housing the data objects that will be rendered as rows.  You can provide this information in two ways by default:","","1. An array of simple objects with key:value pairs","2. A ModelList of Base-based class instances (presumably Model subclass","   instances)","","If an array of objects is passed, it will be translated into a ModelList filled","with instances of the class provided to the `recordType` attribute.  This","attribute can also create a custom Model subclass from an array of field names","or an object of attribute configurations.  If no `recordType` is provided, one","will be created for you from available information (see `_initRecordType`).","Providing either your own ModelList instance for `data`, or at least Model","class for `recordType`, is the best way to control client-server","synchronization when modifying data on the client side.","","The ModelList instance that manages the table's data is available in the `data`","property on the DataTable instance.","","","### Rendering","","Table rendering is a collaborative process between the DataTable and its","configured `view`. The DataTable creates an instance of the configured `view`","(DataTable.TableView by default), and calls its `render()` method.","DataTable.TableView, for instance, then creates the `<table>` and `<caption>`,","then delegates the rendering of the specific sections of the table to subviews,","which can be configured as `headerView`, `bodyView`, and `footerView`.","DataTable.TableView defaults the `headerView` to DataTable.HeaderView and the","`bodyView` to DataTable.BodyView, but leaves the `footerView` unassigned.","Setting any subview to `null` will result in that table section not being","rendered.","","@class DataTable","@extends DataTable.Base","@since 3.5.0","**/","","// DataTable API docs included before DataTable.Base to make yuidoc work","/**","The baseline implementation of a DataTable.  This class should be used","primarily as a superclass for a custom DataTable with a specific set of","features.  Because features can be composed onto `Y.DataTable`, custom","subclasses of DataTable.Base will remain unmodified when new feature modules","are loaded.","","Example usage might look like this:","","<pre><code>","// Custom subclass with only sorting and mutability added.  If other datatable","// feature modules are loaded, this class will not be affected.","var MyTableClass = Y.Base.create('table', Y.DataTable.Base,","                       [ Y.DataTable.Sortable, Y.DataTable.Mutable ]);","","var table = new MyTableClass({","    columns: ['firstName', 'lastName', 'age'],","    data: [","        { firstName: 'Frank', lastName: 'Zappa', age: 71 },","        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },","        { firstName: 'Albert', lastName: 'Einstein', age: 132 },","        ...","    ]","});","","table.render('#over-there');","","// DataTable.Base can be instantiated if a featureless table is needed.","var table = new Y.DataTable.Base({","    columns: ['firstName', 'lastName', 'age'],","    data: [","        { firstName: 'Frank', lastName: 'Zappa', age: 71 },","        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },","        { firstName: 'Albert', lastName: 'Einstein', age: 132 },","        ...","    ]","});","","table.render('#in-here');","</code></pre>","","DataTable.Base is built from DataTable.Core, and sets the default `view`","to `Y.DataTable.TableView`.","","@class Base","@extends Widget","@uses DataTable.Core","@namespace DataTable","@since 3.5.0","**/","Y.DataTable.Base = Y.Base.create('datatable', Y.Widget, [Y.DataTable.Core], {","","    /**","    Pass through to `delegate()` called from the `contentBox`.","","    @method delegate","    @param type {String} the event type to delegate","    @param fn {Function} the callback function to execute.  This function","                 will be provided the event object for the delegated event.","    @param spec {String|Function} a selector that must match the target of the","                 event or a function to test target and its parents for a match","    @param context {Object} optional argument that specifies what 'this' refers to","    @param args* {any} 0..n additional arguments to pass on to the callback","                 function.  These arguments will be added after the event object.","    @return {EventHandle} the detach handle","    @since 3.5.0","    **/","    delegate: function () {","        var contentBox = this.get('contentBox');","","        return contentBox.delegate.apply(contentBox, arguments);","    },","","    /**","    Destroys the table `View` if it's been created.","","    @method destructor","    @protected","    @since 3.6.0","    **/","    destructor: function () {","        if (this.view) {","            this.view.destroy();","        }","    },","","    /**","    Returns the `<td>` Node from the given row and column index.  Alternately,","    the `seed` can be a Node.  If so, the nearest ancestor cell is returned.","    If the `seed` is a cell, it is returned.  If there is no cell at the given","    coordinates, `null` is returned.","","    Optionally, include an offset array or string to return a cell near the","    cell identified by the `seed`.  The offset can be an array containing the","    number of rows to shift followed by the number of columns to shift, or one","    of \"above\", \"below\", \"next\", or \"previous\".","","    <pre><code>// Previous cell in the previous row","    var cell = table.getCell(e.target, [-1, -1]);","","    // Next cell","    var cell = table.getCell(e.target, 'next');","    var cell = table.getCell(e.taregt, [0, 1];</pre></code>","","    This is actually just a pass through to the `view` instance's method","    by the same name.","","    @method getCell","    @param {Number[]|Node} seed Array of row and column indexes, or a Node that","        is either the cell itself or a descendant of one.","    @param {Number[]|String} [shift] Offset by which to identify the returned","        cell Node","    @return {Node}","    @since 3.5.0","    **/","    getCell: function (seed, shift) {","        return this.view && this.view.getCell &&","            this.view.getCell.apply(this.view, arguments);","    },","","    /**","    Returns the `<tr>` Node from the given row index, Model, or Model's","    `clientId`.  If the rows haven't been rendered yet, or if the row can't be","    found by the input, `null` is returned.","","    This is actually just a pass through to the `view` instance's method","    by the same name.","","    @method getRow","    @param {Number|String|Model} id Row index, Model instance, or clientId","    @return {Node}","    @since 3.5.0","    **/","    getRow: function (id) {","        return this.view && this.view.getRow &&","            this.view.getRow.apply(this.view, arguments);","    },","","    /**","    Updates the `_displayColumns` property.","","    @method _afterDisplayColumnsChange","    @param {EventFacade} e The `columnsChange` event","    @protected","    @since 3.6.0","    **/","    // FIXME: This is a kludge for back compat with features that reference","    // _displayColumns.  They should be updated to TableView plugins.","    _afterDisplayColumnsChange: function (e) {","        this._extractDisplayColumns(e.newVal || []);","    },","","    /**","    Attaches subscriptions to relay core change events to the view.","","    @method bindUI","    @protected","    @since 3.6.0","    **/","    bindUI: function () {","        this._eventHandles.relayCoreChanges = this.after(","            ['columnsChange',","             'dataChange',","             'summaryChange',","             'captionChange',","             'widthChange'],","            Y.bind('_relayCoreAttrChange', this));","    },","","    /**","    The default behavior of the `renderView` event.  Calls `render()` on the","    `View` instance on the event.","","    @method _defRenderViewFn","    @param {EventFacade} e The `renderView` event","    @protected","    **/","    _defRenderViewFn: function (e) {","        e.view.render();","    },","","    /**","    Processes the full column array, distilling the columns down to those that","    correspond to cell data columns.","","    @method _extractDisplayColumns","    @param {Object[]} columns The full set of table columns","    @protected","    **/","    // FIXME: this is a kludge for back compat, duplicating logic in the","    // tableView","    _extractDisplayColumns: function (columns) {","        var displayColumns = [];","","        function process(cols) {","            var i, len, col;","","            for (i = 0, len = cols.length; i < len; ++i) {","                col = cols[i];","","                if (Y.Lang.isArray(col.children)) {","                    process(col.children);","                } else {","                    displayColumns.push(col);","                }","            }","        }","","        process(columns);","","        /**","        Array of the columns that correspond to those with value cells in the","        data rows. Excludes colspan header columns (configured with `children`).","","        @property _displayColumns","        @type {Object[]}","        @since 3.5.0","        **/","        this._displayColumns = displayColumns;","    },","","    /**","    Sets up the instance's events.","","    @method initializer","    @param {Object} [config] Configuration object passed at construction","    @protected","    @since 3.6.0","    **/","    initializer: function () {","        this.publish('renderView', {","            defaultFn: Y.bind('_defRenderViewFn', this)","        });","","        // Have to use get('columns'), not config.columns because the setter","        // needs to transform string columns to objects.","        this._extractDisplayColumns(this.get('columns') || []);","","        // FIXME: kludge for back compat of features that reference","        // _displayColumns on the instance.  They need to be updated to","        // TableView plugins, most likely.","        this.after('columnsChange', Y.bind('_afterDisplayColumnsChange', this));","    },","","    /**","    Relays attribute changes to the instance's `view`.","","    @method _relayCoreAttrChange","    @param {EventFacade} e The change event","    @protected","    @since 3.6.0","    **/","    _relayCoreAttrChange: function (e) {","        var attr = (e.attrName === 'data') ? 'modelList' : e.attrName;","","        this.view.set(attr, e.newVal);","    },","","    /**","    Instantiates the configured `view` class that will be responsible for","    setting up the View class.","","    @method @renderUI","    @protected","    @since 3.6.0","    **/","    renderUI: function () {","        var self = this,","            View = this.get('view');","","        if (View) {","            this.view = new View(","                Y.merge(","                    this.getAttrs(),","                    {","                        host     : this,","                        container: this.get('contentBox'),","                        modelList: this.data","                    },","                    this.get('viewConfig')));","","            // For back compat, share the view instances and primary nodes","            // on this instance.","            // TODO: Remove this?","            if (!this._eventHandles.legacyFeatureProps) {","                this._eventHandles.legacyFeatureProps = this.view.after({","                    renderHeader: function (e) {","                        self.head = e.view;","                        self._theadNode = e.view.theadNode;","                        // TODO: clean up the repetition.","                        // This is here so that subscribers to renderHeader etc","                        // have access to this._tableNode from the DT instance","                        self._tableNode = e.view.get('container');","                    },","                    renderFooter: function (e) {","                        self.foot = e.view;","                        self._tfootNode = e.view.tfootNode;","                        self._tableNode = e.view.get('container');","                    },","                    renderBody: function (e) {","                        self.body = e.view;","                        self._tbodyNode = e.view.tbodyNode;","                        self._tableNode = e.view.get('container');","                    },","                    // FIXME: guarantee that the properties are available, even","                    // if the configured (or omitted) views don't create them","                    renderTable: function (e) {","                        var contentBox = this.get('container');","","                        self._tableNode = this.tableNode ||","                            contentBox.one('.' + this.getClassName('table') +","                                           ', table');","","                        // FIXME: _captionNode isn't available until after","                        // renderTable unless in the renderX subs I look for","                        // it under the container's parentNode (to account for","                        // scroll breaking out the caption table).","                        self._captionNode = this.captionNode ||","                            contentBox.one('caption');","","                        if (!self._theadNode) {","                            self._theadNode = contentBox.one(","                                '.' + this.getClassName('columns') + ', thead');","                        }","","                        if (!self._tbodyNode) {","                            self._tbodyNode = contentBox.one(","                                '.' + this.getClassName('data') + ', tbody');","                        }","","                        if (!self._tfootNode) {","                            self._tfootNode = contentBox.one(","                                '.' + this.getClassName('footer') + ', tfoot');","                        }","                    }","                });","            }","","            // To *somewhat* preserve table.on('renderHeader', fn) in the","            // form of table.on('table:renderHeader', fn), because I couldn't","            // figure out another option.","            this.view.addTarget(this);","        }","    },","","    /**","    Fires the `renderView` event, delegating UI updates to the configured View.","","    @method syncUI","    @since 3.5.0","    **/","    syncUI: function () {","        if (this.view) {","            this.fire('renderView', { view: this.view });","        }","    },","","    /**","    Verifies the input value is a function with a `render` method on its","    prototype.  `null` is also accepted to remove the default View.","","    @method _validateView","    @protected","    @since 3.5.0","    **/","    _validateView: function (val) {","        // TODO support View instances?","        return val === null || (Y.Lang.isFunction(val) && val.prototype.render);","    }","}, {","    ATTRS: {","        /**","        The View class used to render the `<table>` into the Widget's","        `contentBox`.  This View can handle the entire table rendering itself","        or delegate to other Views.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        When the DataTable is rendered, an instance of this View will be","        created and its `render()` method called.  The View instance will be","        assigned to the DataTable instance's `view` property.","","        @attribute view","        @type {Function}","        @default Y.DataTable.TableView","        @since 3.6.0","        **/","        view: {","            value: Y.DataTable.TableView,","            validator: '_validateView'","        },","","        /**","        Configuration object passed to the class constructor in `view`","        during render.","","        @attribute viewConfig","        @type {Object}","        @default undefined (initially unset)","        @protected","        @since 3.6.0","        **/","        viewConfig: {}","","        /**","        If the View class assigned to the DataTable's `view` attribute supports","        it, this class will be used for rendering the contents of the","        `<thead>`&mdash;the column headers for the table.","        ","        Similar to `view`, the instance of this View will be assigned to the","        DataTable instance's `head` property.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        @attribute headerView","        @type {Function|Object}","        @default Y.DataTable.HeaderView","        @since 3.5.0","        **/","        /*","        headerView: {","            value: Y.DataTable.HeaderView,","            validator: '_validateView'","        },","        */","","        /**","        Configuration object passed to the class constructor in `headerView`","        during render.","","        @attribute headerConfig","        @type {Object}","        @default undefined (initially unset)","        @protected","        @since 3.6.0","        **/","        //headConfig: {},","","        /**","        If the View class assigned to the DataTable's `view` attribute supports","        it, this class will be used for rendering the contents of the `<tfoot>`.","        ","        Similar to `view`, the instance of this View will be assigned to the","        DataTable instance's `foot` property.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        @attribute footerView","        @type {Function|Object}","        @since 3.5.0","        **/","        /*","        footerView: {","            validator: '_validateView'","        },","        */","","        /**","        Configuration object passed to the class constructor in `footerView`","        during render.","","        @attribute footerConfig","        @type {Object}","        @default undefined (initially unset)","        @protected","        @since 3.6.0","        **/","        //footerConfig: {},","","        /**","        If the View class assigned to the DataTable's `view` attribute supports","        it, this class will be used for rendering the contents of the `<tbody>`","        including all data rows.","        ","        Similar to `view`, the instance of this View will be assigned to the","        DataTable instance's `body` property.","","        It is not strictly necessary that the class function assigned here be","        a View subclass.  It must however have a `render()` method.","","        @attribute bodyView","        @type {Function}","        @default Y.DataTable.BodyView","        @since 3.5.0","        **/","        /*","        bodyView: {","            value: Y.DataTable.BodyView,","            validator: '_validateView'","        },","        */","","        /**","        Configuration object passed to the class constructor in `bodyView`","        during render.","","        @attribute bodyConfig","        @type {Object}","        @default undefined (initially unset)","        @protected","        @since 3.6.0","        **/","        //bodyConfig: {}","    }","});","","// The DataTable API docs are above DataTable.Base docs.","Y.DataTable = Y.mix(","    Y.Base.create('datatable', Y.DataTable.Base, []), // Create the class","    Y.DataTable); // Migrate static and namespaced classes","","","}, '3.7.3', {\"requires\": [\"datatable-core\", \"datatable-table\", \"datatable-head\", \"datatable-body\", \"base-build\", \"widget\"], \"skinnable\": true});"];
_yuitest_coverage["build/datatable-base/datatable-base.js"].lines = {"1":0,"218":0,"236":0,"238":0,"249":0,"250":0,"284":0,"302":0,"317":0,"328":0,"346":0,"360":0,"362":0,"363":0,"365":0,"366":0,"368":0,"369":0,"371":0,"376":0,"386":0,"398":0,"404":0,"409":0,"421":0,"423":0,"435":0,"438":0,"439":0,"452":0,"453":0,"455":0,"456":0,"460":0,"463":0,"464":0,"465":0,"468":0,"469":0,"470":0,"475":0,"477":0,"485":0,"488":0,"489":0,"493":0,"494":0,"498":0,"499":0,"509":0,"520":0,"521":0,"535":0,"678":0};
_yuitest_coverage["build/datatable-base/datatable-base.js"].functions = {"delegate:235":0,"destructor:248":0,"getCell:283":0,"getRow:301":0,"_afterDisplayColumnsChange:316":0,"bindUI:327":0,"_defRenderViewFn:345":0,"process:362":0,"_extractDisplayColumns:359":0,"initializer:397":0,"_relayCoreAttrChange:420":0,"renderHeader:454":0,"renderFooter:462":0,"renderBody:467":0,"renderTable:474":0,"renderUI:434":0,"syncUI:519":0,"_validateView:533":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatable-base/datatable-base.js"].coveredLines = 54;
_yuitest_coverage["build/datatable-base/datatable-base.js"].coveredFunctions = 19;
_yuitest_coverline("build/datatable-base/datatable-base.js", 1);
YUI.add('datatable-base', function (Y, NAME) {

/**
A Widget for displaying tabular data.  The base implementation of DataTable
provides the ability to dynamically generate an HTML table from a set of column
configurations and row data.

Two classes are included in the `datatable-base` module: `Y.DataTable` and
`Y.DataTable.Base`.

@module datatable
@submodule datatable-base
@main datatable
@since 3.5.0
**/

// DataTable API docs included before DataTable.Base to make yuidoc work
/**
A Widget for displaying tabular data.  Before feature modules are `use()`d,
this class is functionally equivalent to DataTable.Base.  However, feature
modules can modify this class in non-destructive ways, expanding the API and
functionality.

This is the primary DataTable class.  Out of the box, it provides the ability
to dynamically generate an HTML table from a set of column configurations and
row data.  But feature module inclusion can add table sorting, pagintaion,
highlighting, selection, and more.

<pre><code>
// The functionality of this table would require additional modules be use()d,
// but the feature APIs are aggregated onto Y.DataTable.
// (Snippet is for illustration. Not all features are available today.)
var table = new Y.DataTable({
    columns: [
        { type: 'checkbox', defaultChecked: true },
        { key: 'firstName', sortable: true, resizable: true },
        { key: 'lastName', sortable: true },
        { key: 'role', formatter: toRoleName }
    ],
    data: {
        source: 'http://myserver.com/service/json',
        type: 'json',
        schema: {
            resultListLocator: 'results.users',
            fields: [
                'username',
                'firstName',
                'lastName',
                { key: 'role', type: 'number' }
            ]
        }
    },
    recordType: UserModel,
    pagedData: {
        location: 'footer',
        pageSizes: [20, 50, 'all'],
        rowsPerPage: 20,
        pageLinks: 5
    },
    editable: true
});
</code></pre>

### Column Configuration

The column configurations are set in the form of an array of objects, where
each object corresponds to a column.  For columns populated directly from the
row data, a 'key' property is required to bind the column to that property or
attribute in the row data.

Not all columns need to relate to row data, nor do all properties or attributes
of the row data need to have a corresponding column.  However, only those
columns included in the `columns` configuration attribute will be rendered.

Other column configuration properties are supported by the configured
`view`, class as well as any features added by plugins or class extensions.
See the description of DataTable.TableView and its subviews
DataTable.HeaderView, DataTable.BodyView, and DataTable.FooterView (and other
DataTable feature classes) to see what column properties they support.

Some examples of column configurations would be:

<pre><code>
// Basic
var columns = [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }];

// For columns without any additional configuration, strings can be used
var columns = ['firstName', 'lastName', 'age'];

// Multi-row column headers (see DataTable.HeaderView for details)
var columns = [
    {
        label: 'Name',
        children: [
            { key: 'firstName' },
            { key: 'lastName' }
        ]
    },
    'age' // mixing and matching objects and strings is ok
];

// Including columns that are not related 1:1 to row data fields/attributes
// (See DataTable.BodyView for details)
var columns = [
    {
        label: 'Name', // Needed for the column header
        formatter: function (o) {
            // Fill the column cells with data from firstName and lastName
            if (o.data.age > 55) {
                o.className += ' senior';
            }
            return o.data.lastName + ', ' + o.data.firstName;
        }
    },
    'age'
];

// Columns that include feature configurations (for illustration; not all
// features are available today).
var columns = [
    { type: 'checkbox', defaultChecked: true },
    { key: 'firstName', sortable: true, resizable: true, min-width: '300px' },
    { key: 'lastName', sortable: true, resizable: true, min-width: '300px' },
    { key: 'age', emptyCellValue: '<em>unknown</em>' }
];
</code></pre>

### Row Data Configuration

The `data` configuration attribute is responsible for housing the data objects that will be rendered as rows.  You can provide this information in two ways by default:

1. An array of simple objects with key:value pairs
2. A ModelList of Base-based class instances (presumably Model subclass
   instances)

If an array of objects is passed, it will be translated into a ModelList filled
with instances of the class provided to the `recordType` attribute.  This
attribute can also create a custom Model subclass from an array of field names
or an object of attribute configurations.  If no `recordType` is provided, one
will be created for you from available information (see `_initRecordType`).
Providing either your own ModelList instance for `data`, or at least Model
class for `recordType`, is the best way to control client-server
synchronization when modifying data on the client side.

The ModelList instance that manages the table's data is available in the `data`
property on the DataTable instance.


### Rendering

Table rendering is a collaborative process between the DataTable and its
configured `view`. The DataTable creates an instance of the configured `view`
(DataTable.TableView by default), and calls its `render()` method.
DataTable.TableView, for instance, then creates the `<table>` and `<caption>`,
then delegates the rendering of the specific sections of the table to subviews,
which can be configured as `headerView`, `bodyView`, and `footerView`.
DataTable.TableView defaults the `headerView` to DataTable.HeaderView and the
`bodyView` to DataTable.BodyView, but leaves the `footerView` unassigned.
Setting any subview to `null` will result in that table section not being
rendered.

@class DataTable
@extends DataTable.Base
@since 3.5.0
**/

// DataTable API docs included before DataTable.Base to make yuidoc work
/**
The baseline implementation of a DataTable.  This class should be used
primarily as a superclass for a custom DataTable with a specific set of
features.  Because features can be composed onto `Y.DataTable`, custom
subclasses of DataTable.Base will remain unmodified when new feature modules
are loaded.

Example usage might look like this:

<pre><code>
// Custom subclass with only sorting and mutability added.  If other datatable
// feature modules are loaded, this class will not be affected.
var MyTableClass = Y.Base.create('table', Y.DataTable.Base,
                       [ Y.DataTable.Sortable, Y.DataTable.Mutable ]);

var table = new MyTableClass({
    columns: ['firstName', 'lastName', 'age'],
    data: [
        { firstName: 'Frank', lastName: 'Zappa', age: 71 },
        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },
        { firstName: 'Albert', lastName: 'Einstein', age: 132 },
        ...
    ]
});

table.render('#over-there');

// DataTable.Base can be instantiated if a featureless table is needed.
var table = new Y.DataTable.Base({
    columns: ['firstName', 'lastName', 'age'],
    data: [
        { firstName: 'Frank', lastName: 'Zappa', age: 71 },
        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },
        { firstName: 'Albert', lastName: 'Einstein', age: 132 },
        ...
    ]
});

table.render('#in-here');
</code></pre>

DataTable.Base is built from DataTable.Core, and sets the default `view`
to `Y.DataTable.TableView`.

@class Base
@extends Widget
@uses DataTable.Core
@namespace DataTable
@since 3.5.0
**/
_yuitest_coverfunc("build/datatable-base/datatable-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatable-base/datatable-base.js", 218);
Y.DataTable.Base = Y.Base.create('datatable', Y.Widget, [Y.DataTable.Core], {

    /**
    Pass through to `delegate()` called from the `contentBox`.

    @method delegate
    @param type {String} the event type to delegate
    @param fn {Function} the callback function to execute.  This function
                 will be provided the event object for the delegated event.
    @param spec {String|Function} a selector that must match the target of the
                 event or a function to test target and its parents for a match
    @param context {Object} optional argument that specifies what 'this' refers to
    @param args* {any} 0..n additional arguments to pass on to the callback
                 function.  These arguments will be added after the event object.
    @return {EventHandle} the detach handle
    @since 3.5.0
    **/
    delegate: function () {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "delegate", 235);
_yuitest_coverline("build/datatable-base/datatable-base.js", 236);
var contentBox = this.get('contentBox');

        _yuitest_coverline("build/datatable-base/datatable-base.js", 238);
return contentBox.delegate.apply(contentBox, arguments);
    },

    /**
    Destroys the table `View` if it's been created.

    @method destructor
    @protected
    @since 3.6.0
    **/
    destructor: function () {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "destructor", 248);
_yuitest_coverline("build/datatable-base/datatable-base.js", 249);
if (this.view) {
            _yuitest_coverline("build/datatable-base/datatable-base.js", 250);
this.view.destroy();
        }
    },

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

    This is actually just a pass through to the `view` instance's method
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
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "getCell", 283);
_yuitest_coverline("build/datatable-base/datatable-base.js", 284);
return this.view && this.view.getCell &&
            this.view.getCell.apply(this.view, arguments);
    },

    /**
    Returns the `<tr>` Node from the given row index, Model, or Model's
    `clientId`.  If the rows haven't been rendered yet, or if the row can't be
    found by the input, `null` is returned.

    This is actually just a pass through to the `view` instance's method
    by the same name.

    @method getRow
    @param {Number|String|Model} id Row index, Model instance, or clientId
    @return {Node}
    @since 3.5.0
    **/
    getRow: function (id) {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "getRow", 301);
_yuitest_coverline("build/datatable-base/datatable-base.js", 302);
return this.view && this.view.getRow &&
            this.view.getRow.apply(this.view, arguments);
    },

    /**
    Updates the `_displayColumns` property.

    @method _afterDisplayColumnsChange
    @param {EventFacade} e The `columnsChange` event
    @protected
    @since 3.6.0
    **/
    // FIXME: This is a kludge for back compat with features that reference
    // _displayColumns.  They should be updated to TableView plugins.
    _afterDisplayColumnsChange: function (e) {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "_afterDisplayColumnsChange", 316);
_yuitest_coverline("build/datatable-base/datatable-base.js", 317);
this._extractDisplayColumns(e.newVal || []);
    },

    /**
    Attaches subscriptions to relay core change events to the view.

    @method bindUI
    @protected
    @since 3.6.0
    **/
    bindUI: function () {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "bindUI", 327);
_yuitest_coverline("build/datatable-base/datatable-base.js", 328);
this._eventHandles.relayCoreChanges = this.after(
            ['columnsChange',
             'dataChange',
             'summaryChange',
             'captionChange',
             'widthChange'],
            Y.bind('_relayCoreAttrChange', this));
    },

    /**
    The default behavior of the `renderView` event.  Calls `render()` on the
    `View` instance on the event.

    @method _defRenderViewFn
    @param {EventFacade} e The `renderView` event
    @protected
    **/
    _defRenderViewFn: function (e) {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "_defRenderViewFn", 345);
_yuitest_coverline("build/datatable-base/datatable-base.js", 346);
e.view.render();
    },

    /**
    Processes the full column array, distilling the columns down to those that
    correspond to cell data columns.

    @method _extractDisplayColumns
    @param {Object[]} columns The full set of table columns
    @protected
    **/
    // FIXME: this is a kludge for back compat, duplicating logic in the
    // tableView
    _extractDisplayColumns: function (columns) {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "_extractDisplayColumns", 359);
_yuitest_coverline("build/datatable-base/datatable-base.js", 360);
var displayColumns = [];

        _yuitest_coverline("build/datatable-base/datatable-base.js", 362);
function process(cols) {
            _yuitest_coverfunc("build/datatable-base/datatable-base.js", "process", 362);
_yuitest_coverline("build/datatable-base/datatable-base.js", 363);
var i, len, col;

            _yuitest_coverline("build/datatable-base/datatable-base.js", 365);
for (i = 0, len = cols.length; i < len; ++i) {
                _yuitest_coverline("build/datatable-base/datatable-base.js", 366);
col = cols[i];

                _yuitest_coverline("build/datatable-base/datatable-base.js", 368);
if (Y.Lang.isArray(col.children)) {
                    _yuitest_coverline("build/datatable-base/datatable-base.js", 369);
process(col.children);
                } else {
                    _yuitest_coverline("build/datatable-base/datatable-base.js", 371);
displayColumns.push(col);
                }
            }
        }

        _yuitest_coverline("build/datatable-base/datatable-base.js", 376);
process(columns);

        /**
        Array of the columns that correspond to those with value cells in the
        data rows. Excludes colspan header columns (configured with `children`).

        @property _displayColumns
        @type {Object[]}
        @since 3.5.0
        **/
        _yuitest_coverline("build/datatable-base/datatable-base.js", 386);
this._displayColumns = displayColumns;
    },

    /**
    Sets up the instance's events.

    @method initializer
    @param {Object} [config] Configuration object passed at construction
    @protected
    @since 3.6.0
    **/
    initializer: function () {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "initializer", 397);
_yuitest_coverline("build/datatable-base/datatable-base.js", 398);
this.publish('renderView', {
            defaultFn: Y.bind('_defRenderViewFn', this)
        });

        // Have to use get('columns'), not config.columns because the setter
        // needs to transform string columns to objects.
        _yuitest_coverline("build/datatable-base/datatable-base.js", 404);
this._extractDisplayColumns(this.get('columns') || []);

        // FIXME: kludge for back compat of features that reference
        // _displayColumns on the instance.  They need to be updated to
        // TableView plugins, most likely.
        _yuitest_coverline("build/datatable-base/datatable-base.js", 409);
this.after('columnsChange', Y.bind('_afterDisplayColumnsChange', this));
    },

    /**
    Relays attribute changes to the instance's `view`.

    @method _relayCoreAttrChange
    @param {EventFacade} e The change event
    @protected
    @since 3.6.0
    **/
    _relayCoreAttrChange: function (e) {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "_relayCoreAttrChange", 420);
_yuitest_coverline("build/datatable-base/datatable-base.js", 421);
var attr = (e.attrName === 'data') ? 'modelList' : e.attrName;

        _yuitest_coverline("build/datatable-base/datatable-base.js", 423);
this.view.set(attr, e.newVal);
    },

    /**
    Instantiates the configured `view` class that will be responsible for
    setting up the View class.

    @method @renderUI
    @protected
    @since 3.6.0
    **/
    renderUI: function () {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "renderUI", 434);
_yuitest_coverline("build/datatable-base/datatable-base.js", 435);
var self = this,
            View = this.get('view');

        _yuitest_coverline("build/datatable-base/datatable-base.js", 438);
if (View) {
            _yuitest_coverline("build/datatable-base/datatable-base.js", 439);
this.view = new View(
                Y.merge(
                    this.getAttrs(),
                    {
                        host     : this,
                        container: this.get('contentBox'),
                        modelList: this.data
                    },
                    this.get('viewConfig')));

            // For back compat, share the view instances and primary nodes
            // on this instance.
            // TODO: Remove this?
            _yuitest_coverline("build/datatable-base/datatable-base.js", 452);
if (!this._eventHandles.legacyFeatureProps) {
                _yuitest_coverline("build/datatable-base/datatable-base.js", 453);
this._eventHandles.legacyFeatureProps = this.view.after({
                    renderHeader: function (e) {
                        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "renderHeader", 454);
_yuitest_coverline("build/datatable-base/datatable-base.js", 455);
self.head = e.view;
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 456);
self._theadNode = e.view.theadNode;
                        // TODO: clean up the repetition.
                        // This is here so that subscribers to renderHeader etc
                        // have access to this._tableNode from the DT instance
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 460);
self._tableNode = e.view.get('container');
                    },
                    renderFooter: function (e) {
                        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "renderFooter", 462);
_yuitest_coverline("build/datatable-base/datatable-base.js", 463);
self.foot = e.view;
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 464);
self._tfootNode = e.view.tfootNode;
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 465);
self._tableNode = e.view.get('container');
                    },
                    renderBody: function (e) {
                        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "renderBody", 467);
_yuitest_coverline("build/datatable-base/datatable-base.js", 468);
self.body = e.view;
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 469);
self._tbodyNode = e.view.tbodyNode;
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 470);
self._tableNode = e.view.get('container');
                    },
                    // FIXME: guarantee that the properties are available, even
                    // if the configured (or omitted) views don't create them
                    renderTable: function (e) {
                        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "renderTable", 474);
_yuitest_coverline("build/datatable-base/datatable-base.js", 475);
var contentBox = this.get('container');

                        _yuitest_coverline("build/datatable-base/datatable-base.js", 477);
self._tableNode = this.tableNode ||
                            contentBox.one('.' + this.getClassName('table') +
                                           ', table');

                        // FIXME: _captionNode isn't available until after
                        // renderTable unless in the renderX subs I look for
                        // it under the container's parentNode (to account for
                        // scroll breaking out the caption table).
                        _yuitest_coverline("build/datatable-base/datatable-base.js", 485);
self._captionNode = this.captionNode ||
                            contentBox.one('caption');

                        _yuitest_coverline("build/datatable-base/datatable-base.js", 488);
if (!self._theadNode) {
                            _yuitest_coverline("build/datatable-base/datatable-base.js", 489);
self._theadNode = contentBox.one(
                                '.' + this.getClassName('columns') + ', thead');
                        }

                        _yuitest_coverline("build/datatable-base/datatable-base.js", 493);
if (!self._tbodyNode) {
                            _yuitest_coverline("build/datatable-base/datatable-base.js", 494);
self._tbodyNode = contentBox.one(
                                '.' + this.getClassName('data') + ', tbody');
                        }

                        _yuitest_coverline("build/datatable-base/datatable-base.js", 498);
if (!self._tfootNode) {
                            _yuitest_coverline("build/datatable-base/datatable-base.js", 499);
self._tfootNode = contentBox.one(
                                '.' + this.getClassName('footer') + ', tfoot');
                        }
                    }
                });
            }

            // To *somewhat* preserve table.on('renderHeader', fn) in the
            // form of table.on('table:renderHeader', fn), because I couldn't
            // figure out another option.
            _yuitest_coverline("build/datatable-base/datatable-base.js", 509);
this.view.addTarget(this);
        }
    },

    /**
    Fires the `renderView` event, delegating UI updates to the configured View.

    @method syncUI
    @since 3.5.0
    **/
    syncUI: function () {
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "syncUI", 519);
_yuitest_coverline("build/datatable-base/datatable-base.js", 520);
if (this.view) {
            _yuitest_coverline("build/datatable-base/datatable-base.js", 521);
this.fire('renderView', { view: this.view });
        }
    },

    /**
    Verifies the input value is a function with a `render` method on its
    prototype.  `null` is also accepted to remove the default View.

    @method _validateView
    @protected
    @since 3.5.0
    **/
    _validateView: function (val) {
        // TODO support View instances?
        _yuitest_coverfunc("build/datatable-base/datatable-base.js", "_validateView", 533);
_yuitest_coverline("build/datatable-base/datatable-base.js", 535);
return val === null || (Y.Lang.isFunction(val) && val.prototype.render);
    }
}, {
    ATTRS: {
        /**
        The View class used to render the `<table>` into the Widget's
        `contentBox`.  This View can handle the entire table rendering itself
        or delegate to other Views.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        When the DataTable is rendered, an instance of this View will be
        created and its `render()` method called.  The View instance will be
        assigned to the DataTable instance's `view` property.

        @attribute view
        @type {Function}
        @default Y.DataTable.TableView
        @since 3.6.0
        **/
        view: {
            value: Y.DataTable.TableView,
            validator: '_validateView'
        },

        /**
        Configuration object passed to the class constructor in `view`
        during render.

        @attribute viewConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        viewConfig: {}

        /**
        If the View class assigned to the DataTable's `view` attribute supports
        it, this class will be used for rendering the contents of the
        `<thead>`&mdash;the column headers for the table.
        
        Similar to `view`, the instance of this View will be assigned to the
        DataTable instance's `head` property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute headerView
        @type {Function|Object}
        @default Y.DataTable.HeaderView
        @since 3.5.0
        **/
        /*
        headerView: {
            value: Y.DataTable.HeaderView,
            validator: '_validateView'
        },
        */

        /**
        Configuration object passed to the class constructor in `headerView`
        during render.

        @attribute headerConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        //headConfig: {},

        /**
        If the View class assigned to the DataTable's `view` attribute supports
        it, this class will be used for rendering the contents of the `<tfoot>`.
        
        Similar to `view`, the instance of this View will be assigned to the
        DataTable instance's `foot` property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute footerView
        @type {Function|Object}
        @since 3.5.0
        **/
        /*
        footerView: {
            validator: '_validateView'
        },
        */

        /**
        Configuration object passed to the class constructor in `footerView`
        during render.

        @attribute footerConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        //footerConfig: {},

        /**
        If the View class assigned to the DataTable's `view` attribute supports
        it, this class will be used for rendering the contents of the `<tbody>`
        including all data rows.
        
        Similar to `view`, the instance of this View will be assigned to the
        DataTable instance's `body` property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute bodyView
        @type {Function}
        @default Y.DataTable.BodyView
        @since 3.5.0
        **/
        /*
        bodyView: {
            value: Y.DataTable.BodyView,
            validator: '_validateView'
        },
        */

        /**
        Configuration object passed to the class constructor in `bodyView`
        during render.

        @attribute bodyConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        //bodyConfig: {}
    }
});

// The DataTable API docs are above DataTable.Base docs.
_yuitest_coverline("build/datatable-base/datatable-base.js", 678);
Y.DataTable = Y.mix(
    Y.Base.create('datatable', Y.DataTable.Base, []), // Create the class
    Y.DataTable); // Migrate static and namespaced classes


}, '3.7.3', {"requires": ["datatable-core", "datatable-table", "datatable-head", "datatable-body", "base-build", "widget"], "skinnable": true});
