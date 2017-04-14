/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-head', function (Y, NAME) {

/**
View class responsible for rendering the `<thead>` section of a table. Used as
the default `headerView` for `Y.DataTable.Base` and `Y.DataTable` classes.

@module datatable
@submodule datatable-head
@since 3.5.0
**/
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
    Creates the `<thead>` Node content by assembling markup generated by
    populating the `ROW_TEMPLATE` and `CELL_TEMPLATE` templates with content
    from the `columns` property.
    
    @method render
    @return {HeaderView} The instance
    @chainable
    @since 3.5.0
    **/
    render: function () {
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

        if (thead && columns) {
            html = '';

            if (columns.length) {
                for (i = 0, len = columns.length; i < len; ++i) {
                    content = '';

                    for (j = 0, jlen = columns[i].length; j < jlen; ++j) {
                        col = columns[i][j];
                        values = Y.merge(
                            defaults,
                            col, {
                                className: this.getClassName('header'),
                                content  : col.label || col.key ||
                                           ("Column " + (j + 1))
                            }
                        );

                        values._id = col._id ?
                            ' data-yui3-col-id="' + col._id + '"' : '';
                        
                        if (col.abbr) {
                            values.abbr = ' abbr="' + col.abbr + '"';
                        }

                        if (col.className) {
                            values.className += ' ' + col.className;
                        }

                        if (col._first) {
                            values.className += ' ' + this.getClassName('first', 'header');
                        }

                        if (col._id) {
                            values.className +=
                                ' ' + this.getClassName('col', col._id);
                        }

                        content += fromTemplate(
                            col.headerTemplate || this.CELL_TEMPLATE, values);
                    }

                    html += fromTemplate(this.ROW_TEMPLATE, {
                        content: content
                    });
                }
            }

            thead.setHTML(html);

            if (thead.get('parentNode') !== table) {
                table.insertBefore(thead, table.one('tfoot, tbody'));
            }
        }

        this.bindUI();

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
        this.columns = this._parseColumns(e.newVal);

        this.render();
    },

    /**
    Binds event subscriptions from the UI and the source (if assigned).

    @method bindUI
    @protected
    @since 3.5.0
    **/
    bindUI: function () {
        if (!this._eventHandles.columnsChange) {
            // TODO: How best to decouple this?
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
        this.host  = config.host;
        this.columns = this._parseColumns(config.columns);

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
        var columns = [],
            stack = [],
            rowSpan = 1,
            entry, row, col, children, parent, i, len, j;
        
        if (isArray(data) && data.length) {
            // don't modify the input array
            data = data.slice();

            // First pass, assign colspans and calculate row count for
            // non-nested headers' rowspan
            stack.push([data, -1]);

            while (stack.length) {
                entry = stack[stack.length - 1];
                row   = entry[0];
                i     = entry[1] + 1;

                for (len = row.length; i < len; ++i) {
                    row[i] = col = Y.merge(row[i]);
                    children = col.children;

                    Y.stamp(col);

                    if (!col.id) {
                        col.id = Y.guid();
                    }

                    if (isArray(children) && children.length) {
                        stack.push([children, -1]);
                        entry[1] = i;

                        rowSpan = Math.max(rowSpan, stack.length);

                        // break to let the while loop process the children
                        break;
                    } else {
                        col._colspan = 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    if (stack.length > 1) {
                        entry  = stack[stack.length - 2];
                        parent = entry[0][entry[1]];

                        parent._colspan = 0;

                        for (i = 0, len = row.length; i < len; ++i) {
                            // Can't use .length because in 3+ rows, colspan
                            // needs to aggregate the colspans of children
                            row[i]._parent   = parent;
                            parent._colspan += row[i]._colspan;
                        }
                    }
                    stack.pop();
                }
            }

            // Second pass, build row arrays and assign rowspan
            for (i = 0; i < rowSpan; ++i) {
                columns.push([]);
            }

            stack.push([data, -1]);

            while (stack.length) {
                entry = stack[stack.length - 1];
                row   = entry[0];
                i     = entry[1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    columns[stack.length - 1].push(col);

                    entry[1] = i;

                    // collect the IDs of parent cols
                    col._headers = [col.id];

                    for (j = stack.length - 2; j >= 0; --j) {
                        parent = stack[j][0][stack[j][1]];

                        col._headers.unshift(parent.id);
                    }

                    if (children && children.length) {
                        // parent cells must assume rowspan 1 (long story)

                        // break to let the while loop process the children
                        stack.push([children, -1]);
                        break;
                    } else {
                        col._rowspan = rowSpan - stack.length + 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    stack.pop();
                }
            }
        }

        for (i = 0, len = columns.length; i < len; i += col._rowspan) {
            col = columns[i][0];

            col._first = true;
        }

        return columns;
    }
});


}, '3.7.3', {"requires": ["datatable-core", "view", "classnamemanager"]});
