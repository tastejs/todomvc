/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-column-widths', function (Y, NAME) {

/**
Adds basic, programmatic column width support to DataTable via column
configuration property `width` and method `table.setColumnWidth(id, width);`.

@module datatable
@submodule datatable-column-widths
@since 3.5.0
**/
var isNumber = Y.Lang.isNumber,
    arrayIndex = Y.Array.indexOf;

Y.Features.add('table', 'badColWidth', {
    test: function () {
        var body = Y.one('body'),
            node, broken;

        if (body) {
            // In modern browsers, <col style="width:X"> will make columns,
            // *including padding and borders* X wide. The cell content width
            // is reduced.  In old browsers and all Opera versions to date, the
            // col's width style is passed to the cells, which causes cell
            // padding/border to bloat the rendered width.
            node = body.insertBefore(
                '<table style="position:absolute;visibility:hidden;border:0 none">' +
                    '<colgroup><col style="width:9px"></colgroup>' +
                    '<tbody><tr>' +
                        '<td style="' +
                            'padding:0 4px;' +
                            'font:normal 2px/2px arial;' +
                            'border:0 none">' +
                        '.' + // Just something to give the cell dimension
                    '</td></tr></tbody>' +
                '</table>',
                body.get('firstChild'));

            broken = node.one('td').getComputedStyle('width') !== '1px';

            node.remove(true);
        }

        return broken;
    }
});

/**
_API docs for this extension are included in the DataTable class._

Adds basic, programmatic column width support to DataTable. Note, this does not
add support for truncated columns.  Due to the way HTML tables render, column
width is more like a "recommended width".  Column content wider than the
assigned width will cause the column to expand, despite the configured width.
Similarly if the table is too narrow to fit the column with the configured
column width, the column width will be reduced.

To set a column width, either add a `width` value to the column configuration
or call the `setColumnWidth(id, width)` method.

Note, assigning column widths is possible without this module, as each cell is
decorated with a class appropriate for that column which you can statically
target in your site's CSS.

To achieve absolute column widths, with content truncation, you can either:

1. Use this module, configure *all* columns to have `width`s, then add
   `table-layout: fixed;` to your CSS for the appropriate `<table>`, or
2. Wrap the contents of all cells in the column with a `<div>` (using a
   `cellTemplate` or `formatter`), assign the div's style `width`, then assign
   the column `width` or add a CSS `width` to the column class created by
   DataTable.

<pre><code>.yui3-datatable .yui3-datatable-col-foo {
    padding: 0;
    width: 125px;
}
.yui3-datatable .yui3-datatable-col-foo .yui3-datatable-liner {
    overflow: hidden;
    padding: 4px 10px;
    width: 125px;
}
</pre></code>

<pre><code>var table = new Y.DataTable({
    columns: [
        {
            key: 'foo',
            cellTemplate:
                '&lt;td class="{className}">' +
                    '&lt;div class="yui3-datatable-liner">{content}&lt;/div>' +
                '&lt;/td>'
        },
        ...
    ],
    ...
});
</code></pre>

To add a liner to all columns, either provide a custom `bodyView` to the
DataTable constructor or update the default `bodyView`'s `CELL_TEMPLATE` like
so:

<pre><code>table.on('renderBody', function (e) {
    e.view.CELL_TEMPLATE = e.view.CELL_TEMPLATE.replace(/\{content\}/,
            '&lt;div class="yui3-datatable-liner">{content}&lt;/div>');
});
</code></pre>

Keep in mind that DataTable skins apply cell `padding`, so assign your CSS
`width`s accordingly or override the `padding` style for that column's `<td>`s
to 0, and add `padding` to the liner `<div>`'s styles as shown above.

@class DataTable.ColumnWidths
@for DataTable
@since 3.5.0
**/
function ColumnWidths() {}

Y.mix(ColumnWidths.prototype, {
    /**
    The HTML template used to create the table's `<col>`s.

    @property COL_TEMPLATE
    @type {HTML}
    @default '<col/>'
    @since 3.5.0
    **/
    COL_TEMPLATE: '<col/>',

    /**
    The HTML template used to create the table's `<colgroup>`.

    @property COLGROUP_TEMPLATE
    @type {HTML}
    @default '<colgroup/>'
    @since 3.5.0
    **/
    COLGROUP_TEMPLATE: '<colgroup/>',

    /**
    Assigns the style width of the `<col>` representing the column identifed by
    `id` and updates the column configuration.

    Pass the empty string for `width` to return a column to auto sizing.

    This does not trigger a `columnsChange` event today, but I can be convinced
    that it should.

    @method setColumnWidth
    @param {Number|String|Object} id The column config object or key, name, or
            index of a column in the host's `_displayColumns` array.
    @param {Number|String} width CSS width value. Numbers are treated as pixels
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    setColumnWidth: function (id, width) {
        var col = this.getColumn(id),
            index = col && arrayIndex(this._displayColumns, col);

        if (index > -1) {
            if (isNumber(width)) {
                width += 'px';
            }

            col.width = width;

            this._setColumnWidth(index, width);
        }

        return this;
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------
    /**
    Renders the table's `<colgroup>` and populates the `_colgroupNode` property.

    @method _createColumnGroup
    @protected
    @since 3.5.0
    **/
    _createColumnGroup: function () {
        return Y.Node.create(this.COLGROUP_TEMPLATE);
    },

    /**
    Hooks up to the rendering lifecycle to also render the `<colgroup>` and
    subscribe to `columnChange` events.

    @method initializer
    @protected
    @since 3.5.0
    **/
    initializer: function (config) {
        this.after(['renderView', 'columnsChange'], this._uiSetColumnWidths);
    },

    /**
    Sets a columns's `<col>` element width style. This is needed to get around
    browser rendering differences.

    The colIndex corresponds to the item index of the `<col>` in the table's
    `<colgroup>`.

    To unset the width, pass a falsy value for the `width`.

    @method _setColumnWidth
    @param {Number} colIndex The display column index
    @param {Number|String} width The desired width
    @protected
    @since 3.5.0
    **/
    // TODO: move this to a conditional module
    _setColumnWidth: function (colIndex, width) {
        // Opera (including Opera Next circa 1/13/2012) and IE7- pass on the
        // width style to the cells directly, allowing padding and borders to
        // expand the rendered width.  Chrome 16, Safari 5.1.1, and FF 3.6+ all
        // make the rendered width equal the col's style width, reducing the
        // cells' calculated width.
        var colgroup  = this._colgroupNode,
            col       = colgroup && colgroup.all('col').item(colIndex),
            cell, getCStyle;

        if (col) {
            if (width && isNumber(width)) {
                width += 'px';
            }

            col.setStyle('width', width);

            // Adjust the width for browsers that make
            // td.style.width === col.style.width
            if  (width && Y.Features.test('table', 'badColWidth')) {
                cell = this.getCell([0, colIndex]);
                
                if (cell) {
                    getCStyle = function (prop) {
                        return parseInt(cell.getComputedStyle(prop), 10)|0;
                    };

                    col.setStyle('width',
                        // I hate this
                        parseInt(width, 10) -
                        getCStyle('paddingLeft') -
                        getCStyle('paddingRight') -
                        getCStyle('borderLeftWidth') -
                        getCStyle('borderRightWidth') + 'px');

                }
            }
        }
    },

    /**
    Populates the table's `<colgroup>` with a `<col>` per item in the `columns`
    attribute without children.  It is assumed that these are the columns that
    have data cells renderered for them.

    @method _uiSetColumnWidths
    @protected
    @since 3.5.0
    **/
    _uiSetColumnWidths: function () {
        if (!this.view) {
            return;
        }

        var template = this.COL_TEMPLATE,
            colgroup = this._colgroupNode,
            columns  = this._displayColumns,
            i, len;

        if (!colgroup) {
            colgroup = this._colgroupNode = this._createColumnGroup();

            this._tableNode.insertBefore(
                colgroup,
                this._tableNode.one('> thead, > tfoot, > tbody'));
        } else {
            colgroup.empty();
        }

        for (i = 0, len = columns.length; i < len; ++i) {

            colgroup.append(template);

            this._setColumnWidth(i, columns[i].width);
        }
    }
}, true);

Y.DataTable.ColumnWidths = ColumnWidths;

Y.Base.mix(Y.DataTable, [ColumnWidths]);


}, '3.7.3', {"requires": ["datatable-base"]});
