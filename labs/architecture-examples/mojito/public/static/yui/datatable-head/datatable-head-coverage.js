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
_yuitest_coverage["build/datatable-head/datatable-head.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatable-head/datatable-head.js",
    code: []
};
_yuitest_coverage["build/datatable-head/datatable-head.js"].code=["YUI.add('datatable-head', function (Y, NAME) {","","/**","View class responsible for rendering the `<thead>` section of a table. Used as","the default `headerView` for `Y.DataTable.Base` and `Y.DataTable` classes.","","@module datatable","@submodule datatable-head","@since 3.5.0","**/","var Lang = Y.Lang,","    fromTemplate = Lang.sub,","    isArray = Lang.isArray,","    toArray = Y.Array;","","/**","View class responsible for rendering the `<thead>` section of a table. Used as","the default `headerView` for `Y.DataTable.Base` and `Y.DataTable` classes.","","Translates the provided array of column configuration objects into a rendered","`<thead>` based on the data in those objects.","    ","","The structure of the column data is expected to be a single array of objects,","where each object corresponds to a `<th>`.  Those objects may contain a","`children` property containing a similarly structured array to indicate the","nested cells should be grouped under the parent column's colspan in a separate","row of header cells. E.g.","","<pre><code>","new Y.DataTable.HeaderView({","  container: tableNode,","  columns: [","    { key: 'id' }, // no nesting","    { key: 'name', children: [","      { key: 'firstName', label: 'First' },","      { key: 'lastName',  label: 'Last' } ] }","  ]","}).render();","</code></pre>","","This would translate to the following visualization:","","<pre>","---------------------","|    |     name     |","|    |---------------","| id | First | Last |","---------------------","</pre>","","Supported properties of the column objects include:","","  * `label`     - The HTML content of the header cell.","  * `key`       - If `label` is not specified, the `key` is used for content.","  * `children`  - Array of columns to appear below this column in the next","                  row.","  * `headerTemplate` - Overrides the instance's `CELL_TEMPLATE` for cells in this","    column only.","  * `abbr`      - The content of the 'abbr' attribute of the `<th>`","  * `className` - Adds this string of CSS classes to the column header","","Through the life of instantiation and rendering, the column objects will have","the following properties added to them:","","  * `id`       - (Defaulted by DataTable) The id to assign the rendered column","  * `_colspan` - To supply the `<th>` attribute","  * `_rowspan` - To supply the `<th>` attribute","  * `_parent`  - (Added by DataTable) If the column is a child of another","    column, this points to its parent column","","The column object is also used to provide values for {placeholder} tokens in the","instance's `CELL_TEMPLATE`, so you can modify the template and include other","column object properties to populate them.","","@class HeaderView","@namespace DataTable","@extends View","@since 3.5.0","**/","Y.namespace('DataTable').HeaderView = Y.Base.create('tableHeader', Y.View, [], {","    // -- Instance properties -------------------------------------------------","","    /**","    Template used to create the table's header cell markup.  Override this to","    customize how header cell markup is created.","","    @property CELL_TEMPLATE","    @type {HTML}","    @default '<th id=\"{id}\" colspan=\"{_colspan}\" rowspan=\"{_rowspan}\" class=\"{className}\" scope=\"col\" {_id}{abbr}>{content}</th>'","    @since 3.5.0","    **/","    CELL_TEMPLATE:","        '<th id=\"{id}\" colspan=\"{_colspan}\" rowspan=\"{_rowspan}\" class=\"{className}\" scope=\"col\" {_id}{abbr}>{content}</th>',","","    /**","    The data representation of the header rows to render.  This is assigned by","    parsing the `columns` configuration array, and is used by the render()","    method.","","    @property columns","    @type {Array[]}","    @default (initially unset)","    @since 3.5.0","    **/","    //TODO: should this be protected?","    //columns: null,","","    /**","    Template used to create the table's header row markup.  Override this to","    customize the row markup.","","    @property ROW_TEMPLATE","    @type {HTML}","    @default '<tr>{content}</tr>'","    @since 3.5.0","    **/","    ROW_TEMPLATE:","        '<tr>{content}</tr>',","","    /**","    The object that serves as the source of truth for column and row data.","    This property is assigned at instantiation from the `source` property of","    the configuration object passed to the constructor.","","    @property source","    @type {Object}","    @default (initially unset)","    @since 3.5.0","    **/","    //TODO: should this be protected?","    //source: null,","","    /**","    HTML templates used to create the `<thead>` containing the table headers.","","    @property THEAD_TEMPLATE","    @type {HTML}","    @default '<thead class=\"{className}\">{content}</thead>'","    @since 3.6.0","    **/","    THEAD_TEMPLATE: '<thead class=\"{className}\"></thead>',","","    // -- Public methods ------------------------------------------------------","","    /**","    Returns the generated CSS classname based on the input.  If the `host`","    attribute is configured, it will attempt to relay to its `getClassName`","    or use its static `NAME` property as a string base.","    ","    If `host` is absent or has neither method nor `NAME`, a CSS classname","    will be generated using this class's `NAME`.","","    @method getClassName","    @param {String} token* Any number of token strings to assemble the","        classname from.","    @return {String}","    @protected","    **/","    getClassName: function () {","        // TODO: add attribute with setter? to host to use property this.host","        // for performance","        var host = this.host,","            NAME = (host && host.constructor.NAME) ||","                    this.constructor.NAME;","","        if (host && host.getClassName) {","            return host.getClassName.apply(host, arguments);","        } else {","            return Y.ClassNameManager.getClassName","                .apply(Y.ClassNameManager,","                       [NAME].concat(toArray(arguments, 0, true)));","        }","    },","","    /**","    Creates the `<thead>` Node content by assembling markup generated by","    populating the `ROW_TEMPLATE` and `CELL_TEMPLATE` templates with content","    from the `columns` property.","    ","    @method render","    @return {HeaderView} The instance","    @chainable","    @since 3.5.0","    **/","    render: function () {","        var table    = this.get('container'),","            thead    = this.theadNode ||","                        (this.theadNode = this._createTHeadNode()),","            columns  = this.columns,","            defaults = {","                _colspan: 1,","                _rowspan: 1,","                abbr: ''","            },","            i, len, j, jlen, col, html, content, values;","","        if (thead && columns) {","            html = '';","","            if (columns.length) {","                for (i = 0, len = columns.length; i < len; ++i) {","                    content = '';","","                    for (j = 0, jlen = columns[i].length; j < jlen; ++j) {","                        col = columns[i][j];","                        values = Y.merge(","                            defaults,","                            col, {","                                className: this.getClassName('header'),","                                content  : col.label || col.key ||","                                           (\"Column \" + (j + 1))","                            }","                        );","","                        values._id = col._id ?","                            ' data-yui3-col-id=\"' + col._id + '\"' : '';","                        ","                        if (col.abbr) {","                            values.abbr = ' abbr=\"' + col.abbr + '\"';","                        }","","                        if (col.className) {","                            values.className += ' ' + col.className;","                        }","","                        if (col._first) {","                            values.className += ' ' + this.getClassName('first', 'header');","                        }","","                        if (col._id) {","                            values.className +=","                                ' ' + this.getClassName('col', col._id);","                        }","","                        content += fromTemplate(","                            col.headerTemplate || this.CELL_TEMPLATE, values);","                    }","","                    html += fromTemplate(this.ROW_TEMPLATE, {","                        content: content","                    });","                }","            }","","            thead.setHTML(html);","","            if (thead.get('parentNode') !== table) {","                table.insertBefore(thead, table.one('tfoot, tbody'));","            }","        }","","        this.bindUI();","","        return this;","    },","","    // -- Protected and private properties and methods ------------------------","","    /**","    Handles changes in the source's columns attribute.  Redraws the headers.","","    @method _afterColumnsChange","    @param {EventFacade} e The `columnsChange` event object","    @protected","    @since 3.5.0","    **/","    _afterColumnsChange: function (e) {","        this.columns = this._parseColumns(e.newVal);","","        this.render();","    },","","    /**","    Binds event subscriptions from the UI and the source (if assigned).","","    @method bindUI","    @protected","    @since 3.5.0","    **/","    bindUI: function () {","        if (!this._eventHandles.columnsChange) {","            // TODO: How best to decouple this?","            this._eventHandles.columnsChange =","                this.after('columnsChange',","                    Y.bind('_afterColumnsChange', this));","        }","    },","","    /**","    Creates the `<thead>` node that will store the header rows and cells.","","    @method _createTHeadNode","    @return {Node}","    @protected","    @since 3.6.0","    **/","    _createTHeadNode: function () {","        return Y.Node.create(fromTemplate(this.THEAD_TEMPLATE, {","            className: this.getClassName('columns')","        }));","    },","    ","    /**","    Destroys the instance.","","    @method destructor","    @protected","    @since 3.5.0","    **/","    destructor: function () {","        (new Y.EventHandle(Y.Object.values(this._eventHandles))).detach();","    },","","    /**","    Holds the event subscriptions needing to be detached when the instance is","    `destroy()`ed.","","    @property _eventHandles","    @type {Object}","    @default undefined (initially unset)","    @protected","    @since 3.5.0","    **/","    //_eventHandles: null,","","    /**","    Initializes the instance. Reads the following configuration properties:","","      * `columns` - (REQUIRED) The initial column information","      * `host`    - The object to serve as source of truth for column info","","    @method initializer","    @param {Object} config Configuration data","    @protected","    @since 3.5.0","    **/","    initializer: function (config) {","        this.host  = config.host;","        this.columns = this._parseColumns(config.columns);","","        this._eventHandles = [];","    },","","    /**","    Translate the input column format into a structure useful for rendering a","    `<thead>`, rows, and cells.  The structure of the input is expected to be a","    single array of objects, where each object corresponds to a `<th>`.  Those","    objects may contain a `children` property containing a similarly structured","    array to indicate the nested cells should be grouped under the parent","    column's colspan in a separate row of header cells. E.g.","","    <pre><code>","    [","      { key: 'id' }, // no nesting","      { key: 'name', children: [","        { key: 'firstName', label: 'First' },","        { key: 'lastName',  label: 'Last' } ] }","    ]","    </code></pre>","","    would indicate two header rows with the first column 'id' being assigned a","    `rowspan` of `2`, the 'name' column appearing in the first row with a","    `colspan` of `2`, and the 'firstName' and 'lastName' columns appearing in","    the second row, below the 'name' column.","","    <pre>","    ---------------------","    |    |     name     |","    |    |---------------","    | id | First | Last |","    ---------------------","    </pre>","","    Supported properties of the column objects include:","","      * `label`    - The HTML content of the header cell.","      * `key`      - If `label` is not specified, the `key` is used for content.","      * `children` - Array of columns to appear below this column in the next","                     row.","      * `abbr`     - The content of the 'abbr' attribute of the `<th>`","      * `headerTemplate` - Overrides the instance's `CELL_TEMPLATE` for cells","        in this column only.","","    The output structure is basically a simulation of the `<thead>` structure","    with arrays for rows and objects for cells.  Column objects have the","    following properties added to them:","    ","      * `id`       - (Defaulted by DataTable) The id to assign the rendered","                     column","      * `_colspan` - Per the `<th>` attribute","      * `_rowspan` - Per the `<th>` attribute","      * `_parent`  - (Added by DataTable) If the column is a child of another","        column, this points to its parent column","","    The column object is also used to provide values for {placeholder}","    replacement in the `CELL_TEMPLATE`, so you can modify the template and","    include other column object properties to populate them.","","    @method _parseColumns","    @param {Object[]} data Array of column object data","    @return {Array[]} An array of arrays corresponding to the header row","            structure to render","    @protected","    @since 3.5.0","    **/","    _parseColumns: function (data) {","        var columns = [],","            stack = [],","            rowSpan = 1,","            entry, row, col, children, parent, i, len, j;","        ","        if (isArray(data) && data.length) {","            // don't modify the input array","            data = data.slice();","","            // First pass, assign colspans and calculate row count for","            // non-nested headers' rowspan","            stack.push([data, -1]);","","            while (stack.length) {","                entry = stack[stack.length - 1];","                row   = entry[0];","                i     = entry[1] + 1;","","                for (len = row.length; i < len; ++i) {","                    row[i] = col = Y.merge(row[i]);","                    children = col.children;","","                    Y.stamp(col);","","                    if (!col.id) {","                        col.id = Y.guid();","                    }","","                    if (isArray(children) && children.length) {","                        stack.push([children, -1]);","                        entry[1] = i;","","                        rowSpan = Math.max(rowSpan, stack.length);","","                        // break to let the while loop process the children","                        break;","                    } else {","                        col._colspan = 1;","                    }","                }","","                if (i >= len) {","                    // All columns in this row are processed","                    if (stack.length > 1) {","                        entry  = stack[stack.length - 2];","                        parent = entry[0][entry[1]];","","                        parent._colspan = 0;","","                        for (i = 0, len = row.length; i < len; ++i) {","                            // Can't use .length because in 3+ rows, colspan","                            // needs to aggregate the colspans of children","                            row[i]._parent   = parent;","                            parent._colspan += row[i]._colspan;","                        }","                    }","                    stack.pop();","                }","            }","","            // Second pass, build row arrays and assign rowspan","            for (i = 0; i < rowSpan; ++i) {","                columns.push([]);","            }","","            stack.push([data, -1]);","","            while (stack.length) {","                entry = stack[stack.length - 1];","                row   = entry[0];","                i     = entry[1] + 1;","","                for (len = row.length; i < len; ++i) {","                    col = row[i];","                    children = col.children;","","                    columns[stack.length - 1].push(col);","","                    entry[1] = i;","","                    // collect the IDs of parent cols","                    col._headers = [col.id];","","                    for (j = stack.length - 2; j >= 0; --j) {","                        parent = stack[j][0][stack[j][1]];","","                        col._headers.unshift(parent.id);","                    }","","                    if (children && children.length) {","                        // parent cells must assume rowspan 1 (long story)","","                        // break to let the while loop process the children","                        stack.push([children, -1]);","                        break;","                    } else {","                        col._rowspan = rowSpan - stack.length + 1;","                    }","                }","","                if (i >= len) {","                    // All columns in this row are processed","                    stack.pop();","                }","            }","        }","","        for (i = 0, len = columns.length; i < len; i += col._rowspan) {","            col = columns[i][0];","","            col._first = true;","        }","","        return columns;","    }","});","","","}, '3.7.3', {\"requires\": [\"datatable-core\", \"view\", \"classnamemanager\"]});"];
_yuitest_coverage["build/datatable-head/datatable-head.js"].lines = {"1":0,"11":0,"81":0,"163":0,"167":0,"168":0,"170":0,"187":0,"198":0,"199":0,"201":0,"202":0,"203":0,"205":0,"206":0,"207":0,"216":0,"219":0,"220":0,"223":0,"224":0,"227":0,"228":0,"231":0,"232":0,"236":0,"240":0,"246":0,"248":0,"249":0,"253":0,"255":0,"269":0,"271":0,"282":0,"284":0,"299":0,"312":0,"339":0,"340":0,"342":0,"408":0,"413":0,"415":0,"419":0,"421":0,"422":0,"423":0,"424":0,"426":0,"427":0,"428":0,"430":0,"432":0,"433":0,"436":0,"437":0,"438":0,"440":0,"443":0,"445":0,"449":0,"451":0,"452":0,"453":0,"455":0,"457":0,"460":0,"461":0,"464":0,"469":0,"470":0,"473":0,"475":0,"476":0,"477":0,"478":0,"480":0,"481":0,"482":0,"484":0,"486":0,"489":0,"491":0,"492":0,"494":0,"497":0,"501":0,"502":0,"504":0,"508":0,"510":0,"515":0,"516":0,"518":0,"521":0};
_yuitest_coverage["build/datatable-head/datatable-head.js"].functions = {"getClassName:160":0,"render:186":0,"_afterColumnsChange:268":0,"bindUI:281":0,"_createTHeadNode:298":0,"destructor:311":0,"initializer:338":0,"_parseColumns:407":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatable-head/datatable-head.js"].coveredLines = 96;
_yuitest_coverage["build/datatable-head/datatable-head.js"].coveredFunctions = 9;
_yuitest_coverline("build/datatable-head/datatable-head.js", 1);
YUI.add('datatable-head', function (Y, NAME) {

/**
View class responsible for rendering the `<thead>` section of a table. Used as
the default `headerView` for `Y.DataTable.Base` and `Y.DataTable` classes.

@module datatable
@submodule datatable-head
@since 3.5.0
**/
_yuitest_coverfunc("build/datatable-head/datatable-head.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatable-head/datatable-head.js", 11);
var Lang = Y.Lang,
    fromTemplate = Lang.sub,
    isArray = Lang.isArray,
    toArray = Y.Array;

/**
View class responsible for rendering the `<thead>` section of a table. Used as
the default `headerView` for `Y.DataTable.Base` and `Y.DataTable` classes.

Translates the provided array of column configuration objects into a rendered
`<thead>` based on the data in those objects.
    

The structure of the column data is expected to be a single array of objects,
where each object corresponds to a `<th>`.  Those objects may contain a
`children` property containing a similarly structured array to indicate the
nested cells should be grouped under the parent column's colspan in a separate
row of header cells. E.g.

<pre><code>
new Y.DataTable.HeaderView({
  container: tableNode,
  columns: [
    { key: 'id' }, // no nesting
    { key: 'name', children: [
      { key: 'firstName', label: 'First' },
      { key: 'lastName',  label: 'Last' } ] }
  ]
}).render();
</code></pre>

This would translate to the following visualization:

<pre>
---------------------
|    |     name     |
|    |---------------
| id | First | Last |
---------------------
</pre>

Supported properties of the column objects include:

  * `label`     - The HTML content of the header cell.
  * `key`       - If `label` is not specified, the `key` is used for content.
  * `children`  - Array of columns to appear below this column in the next
                  row.
  * `headerTemplate` - Overrides the instance's `CELL_TEMPLATE` for cells in this
    column only.
  * `abbr`      - The content of the 'abbr' attribute of the `<th>`
  * `className` - Adds this string of CSS classes to the column header

Through the life of instantiation and rendering, the column objects will have
the following properties added to them:

  * `id`       - (Defaulted by DataTable) The id to assign the rendered column
  * `_colspan` - To supply the `<th>` attribute
  * `_rowspan` - To supply the `<th>` attribute
  * `_parent`  - (Added by DataTable) If the column is a child of another
    column, this points to its parent column

The column object is also used to provide values for {placeholder} tokens in the
instance's `CELL_TEMPLATE`, so you can modify the template and include other
column object properties to populate them.

@class HeaderView
@namespace DataTable
@extends View
@since 3.5.0
**/
_yuitest_coverline("build/datatable-head/datatable-head.js", 81);
Y.namespace('DataTable').HeaderView = Y.Base.create('tableHeader', Y.View, [], {
    // -- Instance properties -------------------------------------------------

    /**
    Template used to create the table's header cell markup.  Override this to
    customize how header cell markup is created.

    @property CELL_TEMPLATE
    @type {HTML}
    @default '<th id="{id}" colspan="{_colspan}" rowspan="{_rowspan}" class="{className}" scope="col" {_id}{abbr}>{content}</th>'
    @since 3.5.0
    **/
    CELL_TEMPLATE:
        '<th id="{id}" colspan="{_colspan}" rowspan="{_rowspan}" class="{className}" scope="col" {_id}{abbr}>{content}</th>',

    /**
    The data representation of the header rows to render.  This is assigned by
    parsing the `columns` configuration array, and is used by the render()
    method.

    @property columns
    @type {Array[]}
    @default (initially unset)
    @since 3.5.0
    **/
    //TODO: should this be protected?
    //columns: null,

    /**
    Template used to create the table's header row markup.  Override this to
    customize the row markup.

    @property ROW_TEMPLATE
    @type {HTML}
    @default '<tr>{content}</tr>'
    @since 3.5.0
    **/
    ROW_TEMPLATE:
        '<tr>{content}</tr>',

    /**
    The object that serves as the source of truth for column and row data.
    This property is assigned at instantiation from the `source` property of
    the configuration object passed to the constructor.

    @property source
    @type {Object}
    @default (initially unset)
    @since 3.5.0
    **/
    //TODO: should this be protected?
    //source: null,

    /**
    HTML templates used to create the `<thead>` containing the table headers.

    @property THEAD_TEMPLATE
    @type {HTML}
    @default '<thead class="{className}">{content}</thead>'
    @since 3.6.0
    **/
    THEAD_TEMPLATE: '<thead class="{className}"></thead>',

    // -- Public methods ------------------------------------------------------

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
        // TODO: add attribute with setter? to host to use property this.host
        // for performance
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "getClassName", 160);
_yuitest_coverline("build/datatable-head/datatable-head.js", 163);
var host = this.host,
            NAME = (host && host.constructor.NAME) ||
                    this.constructor.NAME;

        _yuitest_coverline("build/datatable-head/datatable-head.js", 167);
if (host && host.getClassName) {
            _yuitest_coverline("build/datatable-head/datatable-head.js", 168);
return host.getClassName.apply(host, arguments);
        } else {
            _yuitest_coverline("build/datatable-head/datatable-head.js", 170);
return Y.ClassNameManager.getClassName
                .apply(Y.ClassNameManager,
                       [NAME].concat(toArray(arguments, 0, true)));
        }
    },

    /**
    Creates the `<thead>` Node content by assembling markup generated by
    populating the `ROW_TEMPLATE` and `CELL_TEMPLATE` templates with content
    from the `columns` property.
    
    @method render
    @return {HeaderView} The instance
    @chainable
    @since 3.5.0
    **/
    render: function () {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "render", 186);
_yuitest_coverline("build/datatable-head/datatable-head.js", 187);
var table    = this.get('container'),
            thead    = this.theadNode ||
                        (this.theadNode = this._createTHeadNode()),
            columns  = this.columns,
            defaults = {
                _colspan: 1,
                _rowspan: 1,
                abbr: ''
            },
            i, len, j, jlen, col, html, content, values;

        _yuitest_coverline("build/datatable-head/datatable-head.js", 198);
if (thead && columns) {
            _yuitest_coverline("build/datatable-head/datatable-head.js", 199);
html = '';

            _yuitest_coverline("build/datatable-head/datatable-head.js", 201);
if (columns.length) {
                _yuitest_coverline("build/datatable-head/datatable-head.js", 202);
for (i = 0, len = columns.length; i < len; ++i) {
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 203);
content = '';

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 205);
for (j = 0, jlen = columns[i].length; j < jlen; ++j) {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 206);
col = columns[i][j];
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 207);
values = Y.merge(
                            defaults,
                            col, {
                                className: this.getClassName('header'),
                                content  : col.label || col.key ||
                                           ("Column " + (j + 1))
                            }
                        );

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 216);
values._id = col._id ?
                            ' data-yui3-col-id="' + col._id + '"' : '';
                        
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 219);
if (col.abbr) {
                            _yuitest_coverline("build/datatable-head/datatable-head.js", 220);
values.abbr = ' abbr="' + col.abbr + '"';
                        }

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 223);
if (col.className) {
                            _yuitest_coverline("build/datatable-head/datatable-head.js", 224);
values.className += ' ' + col.className;
                        }

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 227);
if (col._first) {
                            _yuitest_coverline("build/datatable-head/datatable-head.js", 228);
values.className += ' ' + this.getClassName('first', 'header');
                        }

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 231);
if (col._id) {
                            _yuitest_coverline("build/datatable-head/datatable-head.js", 232);
values.className +=
                                ' ' + this.getClassName('col', col._id);
                        }

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 236);
content += fromTemplate(
                            col.headerTemplate || this.CELL_TEMPLATE, values);
                    }

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 240);
html += fromTemplate(this.ROW_TEMPLATE, {
                        content: content
                    });
                }
            }

            _yuitest_coverline("build/datatable-head/datatable-head.js", 246);
thead.setHTML(html);

            _yuitest_coverline("build/datatable-head/datatable-head.js", 248);
if (thead.get('parentNode') !== table) {
                _yuitest_coverline("build/datatable-head/datatable-head.js", 249);
table.insertBefore(thead, table.one('tfoot, tbody'));
            }
        }

        _yuitest_coverline("build/datatable-head/datatable-head.js", 253);
this.bindUI();

        _yuitest_coverline("build/datatable-head/datatable-head.js", 255);
return this;
    },

    // -- Protected and private properties and methods ------------------------

    /**
    Handles changes in the source's columns attribute.  Redraws the headers.

    @method _afterColumnsChange
    @param {EventFacade} e The `columnsChange` event object
    @protected
    @since 3.5.0
    **/
    _afterColumnsChange: function (e) {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "_afterColumnsChange", 268);
_yuitest_coverline("build/datatable-head/datatable-head.js", 269);
this.columns = this._parseColumns(e.newVal);

        _yuitest_coverline("build/datatable-head/datatable-head.js", 271);
this.render();
    },

    /**
    Binds event subscriptions from the UI and the source (if assigned).

    @method bindUI
    @protected
    @since 3.5.0
    **/
    bindUI: function () {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "bindUI", 281);
_yuitest_coverline("build/datatable-head/datatable-head.js", 282);
if (!this._eventHandles.columnsChange) {
            // TODO: How best to decouple this?
            _yuitest_coverline("build/datatable-head/datatable-head.js", 284);
this._eventHandles.columnsChange =
                this.after('columnsChange',
                    Y.bind('_afterColumnsChange', this));
        }
    },

    /**
    Creates the `<thead>` node that will store the header rows and cells.

    @method _createTHeadNode
    @return {Node}
    @protected
    @since 3.6.0
    **/
    _createTHeadNode: function () {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "_createTHeadNode", 298);
_yuitest_coverline("build/datatable-head/datatable-head.js", 299);
return Y.Node.create(fromTemplate(this.THEAD_TEMPLATE, {
            className: this.getClassName('columns')
        }));
    },
    
    /**
    Destroys the instance.

    @method destructor
    @protected
    @since 3.5.0
    **/
    destructor: function () {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "destructor", 311);
_yuitest_coverline("build/datatable-head/datatable-head.js", 312);
(new Y.EventHandle(Y.Object.values(this._eventHandles))).detach();
    },

    /**
    Holds the event subscriptions needing to be detached when the instance is
    `destroy()`ed.

    @property _eventHandles
    @type {Object}
    @default undefined (initially unset)
    @protected
    @since 3.5.0
    **/
    //_eventHandles: null,

    /**
    Initializes the instance. Reads the following configuration properties:

      * `columns` - (REQUIRED) The initial column information
      * `host`    - The object to serve as source of truth for column info

    @method initializer
    @param {Object} config Configuration data
    @protected
    @since 3.5.0
    **/
    initializer: function (config) {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "initializer", 338);
_yuitest_coverline("build/datatable-head/datatable-head.js", 339);
this.host  = config.host;
        _yuitest_coverline("build/datatable-head/datatable-head.js", 340);
this.columns = this._parseColumns(config.columns);

        _yuitest_coverline("build/datatable-head/datatable-head.js", 342);
this._eventHandles = [];
    },

    /**
    Translate the input column format into a structure useful for rendering a
    `<thead>`, rows, and cells.  The structure of the input is expected to be a
    single array of objects, where each object corresponds to a `<th>`.  Those
    objects may contain a `children` property containing a similarly structured
    array to indicate the nested cells should be grouped under the parent
    column's colspan in a separate row of header cells. E.g.

    <pre><code>
    [
      { key: 'id' }, // no nesting
      { key: 'name', children: [
        { key: 'firstName', label: 'First' },
        { key: 'lastName',  label: 'Last' } ] }
    ]
    </code></pre>

    would indicate two header rows with the first column 'id' being assigned a
    `rowspan` of `2`, the 'name' column appearing in the first row with a
    `colspan` of `2`, and the 'firstName' and 'lastName' columns appearing in
    the second row, below the 'name' column.

    <pre>
    ---------------------
    |    |     name     |
    |    |---------------
    | id | First | Last |
    ---------------------
    </pre>

    Supported properties of the column objects include:

      * `label`    - The HTML content of the header cell.
      * `key`      - If `label` is not specified, the `key` is used for content.
      * `children` - Array of columns to appear below this column in the next
                     row.
      * `abbr`     - The content of the 'abbr' attribute of the `<th>`
      * `headerTemplate` - Overrides the instance's `CELL_TEMPLATE` for cells
        in this column only.

    The output structure is basically a simulation of the `<thead>` structure
    with arrays for rows and objects for cells.  Column objects have the
    following properties added to them:
    
      * `id`       - (Defaulted by DataTable) The id to assign the rendered
                     column
      * `_colspan` - Per the `<th>` attribute
      * `_rowspan` - Per the `<th>` attribute
      * `_parent`  - (Added by DataTable) If the column is a child of another
        column, this points to its parent column

    The column object is also used to provide values for {placeholder}
    replacement in the `CELL_TEMPLATE`, so you can modify the template and
    include other column object properties to populate them.

    @method _parseColumns
    @param {Object[]} data Array of column object data
    @return {Array[]} An array of arrays corresponding to the header row
            structure to render
    @protected
    @since 3.5.0
    **/
    _parseColumns: function (data) {
        _yuitest_coverfunc("build/datatable-head/datatable-head.js", "_parseColumns", 407);
_yuitest_coverline("build/datatable-head/datatable-head.js", 408);
var columns = [],
            stack = [],
            rowSpan = 1,
            entry, row, col, children, parent, i, len, j;
        
        _yuitest_coverline("build/datatable-head/datatable-head.js", 413);
if (isArray(data) && data.length) {
            // don't modify the input array
            _yuitest_coverline("build/datatable-head/datatable-head.js", 415);
data = data.slice();

            // First pass, assign colspans and calculate row count for
            // non-nested headers' rowspan
            _yuitest_coverline("build/datatable-head/datatable-head.js", 419);
stack.push([data, -1]);

            _yuitest_coverline("build/datatable-head/datatable-head.js", 421);
while (stack.length) {
                _yuitest_coverline("build/datatable-head/datatable-head.js", 422);
entry = stack[stack.length - 1];
                _yuitest_coverline("build/datatable-head/datatable-head.js", 423);
row   = entry[0];
                _yuitest_coverline("build/datatable-head/datatable-head.js", 424);
i     = entry[1] + 1;

                _yuitest_coverline("build/datatable-head/datatable-head.js", 426);
for (len = row.length; i < len; ++i) {
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 427);
row[i] = col = Y.merge(row[i]);
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 428);
children = col.children;

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 430);
Y.stamp(col);

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 432);
if (!col.id) {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 433);
col.id = Y.guid();
                    }

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 436);
if (isArray(children) && children.length) {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 437);
stack.push([children, -1]);
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 438);
entry[1] = i;

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 440);
rowSpan = Math.max(rowSpan, stack.length);

                        // break to let the while loop process the children
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 443);
break;
                    } else {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 445);
col._colspan = 1;
                    }
                }

                _yuitest_coverline("build/datatable-head/datatable-head.js", 449);
if (i >= len) {
                    // All columns in this row are processed
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 451);
if (stack.length > 1) {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 452);
entry  = stack[stack.length - 2];
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 453);
parent = entry[0][entry[1]];

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 455);
parent._colspan = 0;

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 457);
for (i = 0, len = row.length; i < len; ++i) {
                            // Can't use .length because in 3+ rows, colspan
                            // needs to aggregate the colspans of children
                            _yuitest_coverline("build/datatable-head/datatable-head.js", 460);
row[i]._parent   = parent;
                            _yuitest_coverline("build/datatable-head/datatable-head.js", 461);
parent._colspan += row[i]._colspan;
                        }
                    }
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 464);
stack.pop();
                }
            }

            // Second pass, build row arrays and assign rowspan
            _yuitest_coverline("build/datatable-head/datatable-head.js", 469);
for (i = 0; i < rowSpan; ++i) {
                _yuitest_coverline("build/datatable-head/datatable-head.js", 470);
columns.push([]);
            }

            _yuitest_coverline("build/datatable-head/datatable-head.js", 473);
stack.push([data, -1]);

            _yuitest_coverline("build/datatable-head/datatable-head.js", 475);
while (stack.length) {
                _yuitest_coverline("build/datatable-head/datatable-head.js", 476);
entry = stack[stack.length - 1];
                _yuitest_coverline("build/datatable-head/datatable-head.js", 477);
row   = entry[0];
                _yuitest_coverline("build/datatable-head/datatable-head.js", 478);
i     = entry[1] + 1;

                _yuitest_coverline("build/datatable-head/datatable-head.js", 480);
for (len = row.length; i < len; ++i) {
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 481);
col = row[i];
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 482);
children = col.children;

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 484);
columns[stack.length - 1].push(col);

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 486);
entry[1] = i;

                    // collect the IDs of parent cols
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 489);
col._headers = [col.id];

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 491);
for (j = stack.length - 2; j >= 0; --j) {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 492);
parent = stack[j][0][stack[j][1]];

                        _yuitest_coverline("build/datatable-head/datatable-head.js", 494);
col._headers.unshift(parent.id);
                    }

                    _yuitest_coverline("build/datatable-head/datatable-head.js", 497);
if (children && children.length) {
                        // parent cells must assume rowspan 1 (long story)

                        // break to let the while loop process the children
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 501);
stack.push([children, -1]);
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 502);
break;
                    } else {
                        _yuitest_coverline("build/datatable-head/datatable-head.js", 504);
col._rowspan = rowSpan - stack.length + 1;
                    }
                }

                _yuitest_coverline("build/datatable-head/datatable-head.js", 508);
if (i >= len) {
                    // All columns in this row are processed
                    _yuitest_coverline("build/datatable-head/datatable-head.js", 510);
stack.pop();
                }
            }
        }

        _yuitest_coverline("build/datatable-head/datatable-head.js", 515);
for (i = 0, len = columns.length; i < len; i += col._rowspan) {
            _yuitest_coverline("build/datatable-head/datatable-head.js", 516);
col = columns[i][0];

            _yuitest_coverline("build/datatable-head/datatable-head.js", 518);
col._first = true;
        }

        _yuitest_coverline("build/datatable-head/datatable-head.js", 521);
return columns;
    }
});


}, '3.7.3', {"requires": ["datatable-core", "view", "classnamemanager"]});
