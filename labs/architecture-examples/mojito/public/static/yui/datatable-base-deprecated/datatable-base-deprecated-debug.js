/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-base-deprecated', function(Y) {

// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
var YLang = Y.Lang,
    YisValue = YLang.isValue,
    fromTemplate = Y.Lang.sub,
    YNode = Y.Node,
    Ycreate = YNode.create,
    YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column",
    
    FOCUS = "focus",
    KEYDOWN = "keydown",
    MOUSEENTER = "mouseenter",
    MOUSELEAVE = "mouseleave",
    MOUSEUP = "mouseup",
    MOUSEDOWN = "mousedown",
    CLICK = "click",
    DBLCLICK = "dblclick",

    CLASS_COLUMNS = YgetClassName(DATATABLE, "columns"),
    CLASS_DATA = YgetClassName(DATATABLE, "data"),
    CLASS_MSG = YgetClassName(DATATABLE, "msg"),
    CLASS_LINER = YgetClassName(DATATABLE, "liner"),
    CLASS_FIRST = YgetClassName(DATATABLE, "first"),
    CLASS_LAST = YgetClassName(DATATABLE, "last"),
    CLASS_EVEN = YgetClassName(DATATABLE, "even"),
    CLASS_ODD = YgetClassName(DATATABLE, "odd"),

    TEMPLATE_TABLE = '<table></table>',
    TEMPLATE_COL = '<col></col>',
    TEMPLATE_THEAD = '<thead class="'+CLASS_COLUMNS+'"></thead>',
    TEMPLATE_TBODY = '<tbody class="'+CLASS_DATA+'"></tbody>',
    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}" abbr="{abbr}"><div class="'+CLASS_LINER+'">{value}</div></th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></td>',
    TEMPLATE_VALUE = '{value}',
    TEMPLATE_MSG = '<tbody class="'+CLASS_MSG+'"></tbody>';
    


// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/*
 * The Column class defines and manages attributes of Columns for DataTable.
 *
 * @class Column
 * @extends Widget
 * @constructor
 */
function Column(config) {
    Column.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Column, {
    /*
     * Class name.
     *
     * @property NAME
     * @type {String}
     * @static
     * @final
     * @value "column"
     */
    NAME: "column",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /*
        Unique internal identifier, used to stamp ID on TH element.
        
        @attribute id
        @type {String}
        @readOnly
        **/
        id: {
            valueFn: "_defaultId",
            readOnly: true
        },
        
        /*
        User-supplied identifier. Defaults to id.
        @attribute key
        @type {String}
        **/
        key: {
            valueFn: "_defaultKey"
        },

        /*
        Points to underlying data field (for sorting or formatting, for
        example). Useful when column doesn't hold any data itself, but is just
        a visual representation of data from another column or record field.
        Defaults to key.

        @attribute field
        @type {String}
        @default (column key)
        **/
        field: {
            valueFn: "_defaultField"
        },

        /*
        Display label for column header. Defaults to key.

        @attribute label
        @type {String}
        **/
        label: {
            valueFn: "_defaultLabel"
        },
        
        /*
        Array of child column definitions (for nested headers).

        @attribute children
        @type {String}
        @default null
        **/
        children: {
            value: null
        },
        
        /*
        TH abbr attribute.

        @attribute abbr
        @type {String}
        @default ""
        **/
        abbr: {
            value: ""
        },

        //TODO: support custom classnames
        // TH CSS classnames
        classnames: {
            readOnly: true,
            getter: "_getClassnames"
        },
        
        /*
        Formating template string or function for cells in this column.

        Function formatters receive a single object (described below) and are
        expected to output the `innerHTML` of the cell.

        String templates can include markup and {placeholder} tokens to be
        filled in from the object passed to function formatters.

        @attribute formatter
        @type {String|Function}
        @param {Object} data Data relevant to the rendering of this cell
            @param {String} data.classnames CSS classes to add to the cell
            @param {Column} data.column This Column instance
            @param {Object} data.data The raw object data from the Record
            @param {String} data.field This Column's "field" attribute value
            @param {String} data.headers TH ids to reference in the cell's
                            "headers" attribute
            @param {Record} data.record The Record instance for this row
            @param {Number} data.rowindex The index for this row
            @param {Node}   data.tbody The TBODY Node that will house the cell
            @param {Node}   data.tr The row TR Node that will house the cell
            @param {Any}    data.value The raw Record data for this cell
        **/
        formatter: {},

        /*
        The default markup to display in cells that have no corresponding record
        data or content from formatters.

        @attribute emptyCellValue
        @type {String}
        @default ''
        **/
        emptyCellValue: {
            value: '',
            validator: Y.Lang.isString
        },

        //requires datatable-sort
        sortable: {
            value: false
        },
        //sortOptions:defaultDir, sortFn, field

        //TODO: support editable columns
        // Column editor
        editor: {},

        //TODO: support resizeable columns
        //TODO: support setting widths
        // requires datatable-colresize
        width: {},
        resizeable: {},
        minimized: {},
        minWidth: {},
        maxAutoWidth: {}
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Column, Y.Widget, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * Return ID for instance.
    *
    * @method _defaultId
    * @return {String}
    * @private
    */
    _defaultId: function() {
        return Y.guid();
    },

    /*
    * Return key for instance. Defaults to ID if one was not provided.
    *
    * @method _defaultKey
    * @return {String}
    * @private
    */
    _defaultKey: function() {
        return Y.guid();
    },

    /*
    * Return field for instance. Defaults to key if one was not provided.
    *
    * @method _defaultField
    * @return {String}
    * @private
    */
    _defaultField: function() {
        return this.get("key");
    },

    /*
    * Return label for instance. Defaults to key if one was not provided.
    *
    * @method _defaultLabel
    * @return {String}
    * @private
    */
    _defaultLabel: function() {
        return this.get("key");
    },

    /*
     * Updates the UI if changes are made to abbr.
     *
     * @method _afterAbbrChange
     * @param e {Event} Custom event for the attribute change.
     * @private
     */
    _afterAbbrChange: function (e) {
        this._uiSetAbbr(e.newVal);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // PROPERTIES
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
     * Reference to Column's current position index within its Columnset's keys
     * array, if applicable. This property only applies to non-nested and bottom-
     * level child Columns. Value is set by Columnset code.
     *
     * @property keyIndex
     * @type {Number}
     */
    keyIndex: null,
    
    /*
    * Array of TH IDs associated with this column, for TD "headers" attribute.
    * Value is set by Columnset code
    *
    * @property headers
    * @type {String[]}
    */
    headers: null,

    /*
     * Number of cells the header spans. Value is set by Columnset code.
     *
     * @property colSpan
     * @type {Number}
     * @default 1
     */
    colSpan: 1,
    
    /*
     * Number of rows the header spans. Value is set by Columnset code.
     *
     * @property rowSpan
     * @type {Number}
     * @default 1
     */
    rowSpan: 1,

    /*
     * Column's parent Column instance, if applicable. Value is set by Columnset
     * code.
     *
     * @property parent
     * @type {Column}
     */
    parent: null,

    /*
     * The Node reference to the associated TH element.
     *
     * @property thNode
     * @type {Node}
     */
     
    thNode: null,

    /*TODO
     * The Node reference to the associated liner element.
     *
     * @property thLinerNode
     * @type {Node}
     
    thLinerNode: null,*/
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
    },

    /*
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /*
     * Returns classnames for Column.
     *
     * @method _getClassnames
     * @private
     */
    _getClassnames: function () {
        return Y.ClassNameManager.getClassName(COLUMN, this.get("key").replace(/[^\w\-]/g,""));
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////
    /*
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    /*
     * Updates abbr.
     *
     * @method _uiSetAbbr
     * @param val {String} New abbr.
     * @protected
     */
    _uiSetAbbr: function(val) {
        this.thNode.set("abbr", val);
    }
});

Y.Column = Column;
// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/*
 * The Columnset class defines and manages a collection of Columns.
 *
 * @class Columnset
 * @extends Base
 * @constructor
 */
function Columnset(config) {
    Columnset.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Columnset, {
    /*
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "columnset"
     */
    NAME: "columnset",

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTES
    //
    /////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /*
        * @attribute definitions
        * @description Array of column definitions that will populate this Columnset.
        * @type Array
        */
        definitions: {
            setter: "_setDefinitions"
        }

    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Columnset, Y.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * @method _setDefinitions
    * @description Clones definitions before setting.
    * @param definitions {Array} Array of column definitions.
    * @return Array
    * @private
    */
    _setDefinitions: function(definitions) {
            return Y.clone(definitions);
    },
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // PROPERTIES
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
     * Top-down tree representation of Column hierarchy. Used to create DOM
     * elements.
     *
     * @property tree
     * @type {Column[]}
     */
    tree: null,

    /*
     * Hash of all Columns by ID.
     *
     * @property idHash
     * @type Object
     */
    idHash: null,

    /*
     * Hash of all Columns by key.
     *
     * @property keyHash
     * @type Object
     */
    keyHash: null,

    /*
     * Array of only Columns that are meant to be displayed in DOM.
     *
     * @property keys
     * @type {Column[]}
     */
    keys: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * Initializer. Generates all internal representations of the collection of
    * Columns.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function() {

        // DOM tree representation of all Columns
        var tree = [],
        // Hash of all Columns by ID
        idHash = {},
        // Hash of all Columns by key
        keyHash = {},
        // Flat representation of only Columns that are meant to display data
        keys = [],
        // Original definitions
        definitions = this.get("definitions"),

        self = this;

        // Internal recursive function to define Column instances
        function parseColumns(depth, currentDefinitions, parent) {
            var i=0,
                len = currentDefinitions.length,
                currentDefinition,
                column,
                currentChildren;

            // One level down
            depth++;

            // Create corresponding dom node if not already there for this depth
            if(!tree[depth]) {
                tree[depth] = [];
            }

            // Parse each node at this depth for attributes and any children
            for(; i<len; ++i) {
                currentDefinition = currentDefinitions[i];

                currentDefinition = YLang.isString(currentDefinition) ? {key:currentDefinition} : currentDefinition;

                // Instantiate a new Column for each node
                column = new Y.Column(currentDefinition);

                // Cross-reference Column ID back to the original object literal definition
                currentDefinition.yuiColumnId = column.get("id");

                // Add the new Column to the hash
                idHash[column.get("id")] = column;
                keyHash[column.get("key")] = column;

                // Assign its parent as an attribute, if applicable
                if(parent) {
                    column.parent = parent;
                }

                // The Column has descendants
                if(YLang.isArray(currentDefinition.children)) {
                    currentChildren = currentDefinition.children;
                    column._set("children", currentChildren);

                    self._setColSpans(column, currentDefinition);

                    self._cascadePropertiesToChildren(column, currentChildren);

                    // The children themselves must also be parsed for Column instances
                    if(!tree[depth+1]) {
                        tree[depth+1] = [];
                    }
                    parseColumns(depth, currentChildren, column);
                }
                // This Column does not have any children
                else {
                    column.keyIndex = keys.length;
                    // Default is already 1
                    //column.colSpan = 1;
                    keys.push(column);
                }

                // Add the Column to the top-down dom tree
                tree[depth].push(column);
            }
            depth--;
        }

        // Parse out Column instances from the array of object literals
        parseColumns(-1, definitions);


        // Save to the Columnset instance
        this.tree = tree;
        this.idHash = idHash;
        this.keyHash = keyHash;
        this.keys = keys;

        this._setRowSpans();
        this._setHeaders();
    },

    /*
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // COLUMN HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * Cascade certain properties to children if not defined on their own.
    *
    * @method _cascadePropertiesToChildren
    * @private
    */
    _cascadePropertiesToChildren: function(column, currentChildren) {
        //TODO: this is all a giant todo
        var i = 0,
            len = currentChildren.length,
            child;

        // Cascade certain properties to children if not defined on their own
        for(; i<len; ++i) {
            child = currentChildren[i];
            if(column.get("className") && (child.className === undefined)) {
                child.className = column.get("className");
            }
            if(column.get("editor") && (child.editor === undefined)) {
                child.editor = column.get("editor");
            }
            if(column.get("formatter") && (child.formatter === undefined)) {
                child.formatter = column.get("formatter");
            }
            if(column.get("resizeable") && (child.resizeable === undefined)) {
                child.resizeable = column.get("resizeable");
            }
            if(column.get("sortable") && (child.sortable === undefined)) {
                child.sortable = column.get("sortable");
            }
            if(column.get("hidden")) {
                child.hidden = true;
            }
            if(column.get("width") && (child.width === undefined)) {
                child.width = column.get("width");
            }
            if(column.get("minWidth") && (child.minWidth === undefined)) {
                child.minWidth = column.get("minWidth");
            }
            if(column.get("maxAutoWidth") && (child.maxAutoWidth === undefined)) {
                child.maxAutoWidth = column.get("maxAutoWidth");
            }
        }
    },

    /*
    * @method _setColSpans
    * @description Calculates and sets colSpan attribute on given Column.
    * @param column {Array} Column instance.
    * @param definition {Object} Column definition.
    * @private
    */
    _setColSpans: function(column, definition) {
        // Determine COLSPAN value for this Column
        var terminalChildNodes = 0;

        function countTerminalChildNodes(ancestor) {
            var descendants = ancestor.children,
                i = 0,
                len = descendants.length;

            // Drill down each branch and count terminal nodes
            for(; i<len; ++i) {
                // Keep drilling down
                if(YLang.isArray(descendants[i].children)) {
                    countTerminalChildNodes(descendants[i]);
                }
                // Reached branch terminus
                else {
                    terminalChildNodes++;
                }
            }
        }
        countTerminalChildNodes(definition);
        column.colSpan = terminalChildNodes;
    },

    /*
    * @method _setRowSpans
    * @description Calculates and sets rowSpan attribute on all Columns.
    * @private
    */
    _setRowSpans: function() {
        // Determine ROWSPAN value for each Column in the DOM tree
        function parseDomTreeForRowSpan(tree) {
            var maxRowDepth = 1,
                currentRow,
                currentColumn,
                m,p;

            // Calculate the max depth of descendants for this row
            function countMaxRowDepth(row, tmpRowDepth) {
                tmpRowDepth = tmpRowDepth || 1;

                var i = 0,
                    len = row.length,
                    col;

                for(; i<len; ++i) {
                    col = row[i];
                    // Column has children, so keep counting
                    if(YLang.isArray(col.children)) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.children, tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // Column has children, so keep counting
                    else if(col.get && YLang.isArray(col.get("children"))) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.get("children"), tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // No children, is it the max depth?
                    else {
                        if(tmpRowDepth > maxRowDepth) {
                            maxRowDepth = tmpRowDepth;
                        }
                    }
                }
            }

            // Count max row depth for each row
            for(m=0; m<tree.length; m++) {
                currentRow = tree[m];
                countMaxRowDepth(currentRow);

                // Assign the right ROWSPAN values to each Column in the row
                for(p=0; p<currentRow.length; p++) {
                    currentColumn = currentRow[p];
                    if(!YLang.isArray(currentColumn.get("children"))) {
                        currentColumn.rowSpan = maxRowDepth;
                    }
                    // Default is already 1
                    // else currentColumn.rowSpan =1;
                }

                // Reset counter for next row
                maxRowDepth = 1;
            }
        }
        parseDomTreeForRowSpan(this.tree);
    },

    /*
    * @method _setHeaders
    * @description Calculates and sets headers attribute on all Columns.
    * @private
    */
    _setHeaders: function() {
        var headers, column,
            allKeys = this.keys,
            i=0, len = allKeys.length;

        function recurseAncestorsForHeaders(headers, column) {
            headers.push(column.get("id"));
            if(column.parent) {
                recurseAncestorsForHeaders(headers, column.parent);
            }
        }
        for(; i<len; ++i) {
            headers = [];
            column = allKeys[i];
            recurseAncestorsForHeaders(headers, column);
            column.headers = headers.reverse().join(" ");
        }
    },

    //TODO
    getColumn: function() {
    }
});

Y.Columnset = Columnset;
// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/**
The DataTable widget provides a progressively enhanced DHTML control for
displaying tabular data across A-grade browsers.

DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module
corresponds to the 3.4.1 version of DataTable and will be removed from the
library in a future version.

See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the
latest version.

For complete API docs for the classes in this and other deprecated
DataTable-related modules, refer to the static API doc files in the 3.4.1
download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip

@module datatable-deprecated
@main datatable-deprecated
@deprecated
**/

/**
Provides the base DataTable implementation, which can be extended to add
additional functionality, such as sorting or scrolling.

DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module
corresponds to the 3.4.1 version of DataTable and will be removed from the
library in a future version.

See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the
latest version.

For complete API docs for the classes in this and other deprecated
DataTable-related modules, refer to the static API doc files in the 3.4.1
download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip

@module datatable-deprecated
@submodule datatable-base-deprecated
@deprecated
**/

/*
 * Base class for the DataTable widget.
 * @class DataTable.Base
 * @extends Widget
 * @constructor
 */
function DTBase(config) {
    DTBase.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DTBase, {

    /*
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTable"
     */
    NAME:  "dataTable",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /*
        * @attribute columnset
        * @description Pointer to Columnset instance.
        * @type Array | Y.Columnset
        */
        columnset: {
            setter: "_setColumnset"
        },

        /*
        * @attribute recordset
        * @description Pointer to Recordset instance.
        * @type Array | Y.Recordset
        */
        recordset: {
            valueFn: '_initRecordset',
            setter: "_setRecordset"
        },

        /*TODO
        * @attribute state
        * @description Internal state.
        * @readonly
        * @type
        */
        /*state: {
            value: new Y.State(),
            readOnly: true

        },*/

        /*
        * @attribute summary
        * @description Summary.
        * @type String
        */
        summary: {
        },

        /*
        * @attribute caption
        * @description Caption
        * @type String
        */
        caption: {
        },

        /*
        * @attribute thValueTemplate
        * @description Tokenized markup template for TH value.
        * @type String
        * @default '{value}'
        */
        thValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /*
        * @attribute tdValueTemplate
        * @description Tokenized markup template for TD value.
        * @type String
        * @default '{value}'
        */
        tdValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /*
        * @attribute trTemplate
        * @description Tokenized markup template for TR node creation.
        * @type String
        * @default '<tr id="{id}"></tr>'
        */
        trTemplate: {
            value: TEMPLATE_TR
        }
    },

/////////////////////////////////////////////////////////////////////////////
//
// TODO: HTML_PARSER
//
/////////////////////////////////////////////////////////////////////////////
    HTML_PARSER: {
        /*caption: function (srcNode) {
            
        }*/
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(DTBase, Y.Widget, {
    /*
    * @property thTemplate
    * @description Tokenized markup template for TH node creation.
    * @type String
    * @default '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}" abbr="{abbr}"><div class="'+CLASS_LINER+'">{value}</div></th>'
    */
    thTemplate: TEMPLATE_TH,

    /*
    * @property tdTemplate
    * @description Tokenized markup template for TD node creation.
    * @type String
    * @default '<td headers="{headers}" class="{classnames}"><div class="yui3-datatable-liner">{value}</div></td>'
    */
    tdTemplate: TEMPLATE_TD,
    
    /*
    * @property _theadNode
    * @description Pointer to THEAD node.
    * @type {Node}
    * @private
    */
    _theadNode: null,
    
    /*
    * @property _tbodyNode
    * @description Pointer to TBODY node.
    * @type {Node}
    * @private
    */
    _tbodyNode: null,
    
    /*
    * @property _msgNode
    * @description Pointer to message display node.
    * @type {Node}
    * @private
    */
    _msgNode: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * @method _setColumnset
    * @description Converts Array to Y.Columnset.
    * @param columns {Array | Y.Columnset}
    * @return {Columnset}
    * @private
    */
    _setColumnset: function(columns) {
        return YLang.isArray(columns) ? new Y.Columnset({definitions:columns}) : columns;
    },

    /*
     * Updates the UI if Columnset is changed.
     *
     * @method _afterColumnsetChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterColumnsetChange: function (e) {
        this._uiSetColumnset(e.newVal);
    },

    /*
    * @method _setRecordset
    * @description Converts Array to Y.Recordset.
    * @param records {Array | Recordset}
    * @return {Recordset}
    * @private
    */
    _setRecordset: function(rs) {
        if(YLang.isArray(rs)) {
            rs = new Y.Recordset({records:rs});
        }

        rs.addTarget(this);
        return rs;
    },
    
    /*
    * Updates the UI if Recordset is changed.
    *
    * @method _afterRecordsetChange
    * @param e {Event} Custom event for the attribute change.
    * @protected
    */
    _afterRecordsetChange: function (e) {
        this._uiSetRecordset(e.newVal);
    },

    /*
    * Updates the UI if Recordset records are changed.
    *
    * @method _afterRecordsChange
    * @param e {Event} Custom event for the attribute change.
    * @protected
    */
    _afterRecordsChange: function (e) {
        this._uiSetRecordset(this.get('recordset'));
    },

    /*
     * Updates the UI if summary is changed.
     *
     * @method _afterSummaryChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterSummaryChange: function (e) {
        this._uiSetSummary(e.newVal);
    },

    /*
     * Updates the UI if caption is changed.
     *
     * @method _afterCaptionChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterCaptionChange: function (e) {
        this._uiSetCaption(e.newVal);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
         this.get("recordset").removeTarget(this);
    },
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // RENDER
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
    * Renders UI.
    *
    * @method renderUI
    * @private
    */
    renderUI: function() {
        // TABLE
        this._addTableNode(this.get("contentBox"));

        // COLGROUP
        this._addColgroupNode(this._tableNode);

        // THEAD
        this._addTheadNode(this._tableNode);

        // Primary TBODY
        this._addTbodyNode(this._tableNode);

        // Message TBODY
        this._addMessageNode(this._tableNode);

        // CAPTION
        this._addCaptionNode(this._tableNode);
   },

    /*
    * Creates and attaches TABLE element to given container.
    *
    * @method _addTableNode
    * @param containerNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addTableNode: function(containerNode) {
        if (!this._tableNode) {
            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        return this._tableNode;
    },

    /*
    * Creates and attaches COLGROUP element to given TABLE.
    *
    * @method _addColgroupNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addColgroupNode: function(tableNode) {
        // Add COLs to DOCUMENT FRAGMENT
        var len = this.get("columnset").keys.length,
            i = 0,
            allCols = ["<colgroup>"];

        for(; i<len; ++i) {
            allCols.push(TEMPLATE_COL);
        }

        allCols.push("</colgroup>");

        // Create COLGROUP
        this._colgroupNode = tableNode.insertBefore(Ycreate(allCols.join("")), tableNode.get("firstChild"));

        return this._colgroupNode;
    },

    /*
    * Creates and attaches THEAD element to given container.
    *
    * @method _addTheadNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    /*
    * Creates and attaches TBODY element to given container.
    *
    * @method _addTbodyNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        return this._tbodyNode;
    },

    /*
    * Creates and attaches message display element to given container.
    *
    * @method _addMessageNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        return this._msgNode;
    },

    /*
    * Creates and attaches CAPTION element to given container.
    *
    * @method _addCaptionNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addCaptionNode: function(tableNode) {
        this._captionNode = Y.Node.create('<caption></caption>');
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // BIND
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
    * Binds events.
    *
    * @method bindUI
    * @private
    */
    bindUI: function() {
        this.after({
            columnsetChange: this._afterColumnsetChange,
            summaryChange  : this._afterSummaryChange,
            captionChange  : this._afterCaptionChange,
            recordsetChange: this._afterRecordsChange,
            "recordset:tableChange": this._afterRecordsChange
        });
    },
    
    delegate: function(type) {
        //TODO: is this necessary?
        if(type==="dblclick") {
            this.get("boundingBox").delegate.apply(this.get("boundingBox"), arguments);
        }
        else {
            this.get("contentBox").delegate.apply(this.get("contentBox"), arguments);
        }
    },
    

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        // THEAD ROWS
        this._uiSetColumnset(this.get("columnset"));
        // DATA ROWS
        this._uiSetRecordset(this.get("recordset"));
        // SUMMARY
        this._uiSetSummary(this.get("summary"));
        // CAPTION
        this._uiSetCaption(this.get("caption"));
    },

    /*
     * Updates summary.
     *
     * @method _uiSetSummary
     * @param val {String} New summary.
     * @protected
     */
    _uiSetSummary: function(val) {
        val = YisValue(val) ? val : "";
        this._tableNode.set("summary", val);
    },

    /*
     * Updates caption.
     *
     * @method _uiSetCaption
     * @param val {String} New caption.
     * @protected
     */
    _uiSetCaption: function(val) {
        var caption = this._captionNode,
            inDoc   = caption.inDoc(),
            method  = val ? (!inDoc && 'prepend') : (inDoc && 'removeChild');

        caption.setContent(val || '');

        if (method) {
            // prepend of remove necessary
            this._tableNode[method](caption);
        }
    },


    ////////////////////////////////////////////////////////////////////////////
    //
    // THEAD/COLUMNSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /*
     * Updates THEAD.
     *
     * @method _uiSetColumnset
     * @param cs {Columnset} New Columnset.
     * @protected
     */
    _uiSetColumnset: function(cs) {
        var tree = cs.tree,
            thead = this._theadNode,
            i = 0,
            len = tree.length,
            parent = thead.get("parentNode"),
            nextSibling = thead.next();
            
        // Move THEAD off DOM
        thead.remove();
        
        thead.get("children").remove(true);

        // Iterate tree of columns to add THEAD rows
        for(; i<len; ++i) {
            this._addTheadTrNode({
                thead:   thead,
                columns: tree[i],
                id     : '' // to avoid {id} leftovers from the trTemplate
            }, (i === 0), (i === len - 1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        // Re-attach THEAD to DOM
        parent.insert(thead, nextSibling);

     },
     
    /*
    * Creates and attaches header row element.
    *
    * @method _addTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isFirst {Boolean} Is last row.
    * @protected
    */
     _addTheadTrNode: function(o, isFirst, isLast) {
        o.tr = this._createTheadTrNode(o, isFirst, isLast);
        this._attachTheadTrNode(o);
     },
     

    /*
    * Creates header row element.
    *
    * @method _createTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isLast {Boolean} Is last row.
    * @protected
    * @return {Node}
    */
    _createTheadTrNode: function(o, isFirst, isLast) {
        //TODO: custom classnames
        var tr = Ycreate(fromTemplate(this.get("trTemplate"), o)),
            i = 0,
            columns = o.columns,
            len = columns.length,
            column;

         // Set FIRST/LAST class
        if(isFirst) {
            tr.addClass(CLASS_FIRST);
        }
        if(isLast) {
            tr.addClass(CLASS_LAST);
        }

        for(; i<len; ++i) {
            column = columns[i];
            this._addTheadThNode({value:column.get("label"), column: column, tr:tr});
        }

        return tr;
    },

    /*
    * Attaches header row element.
    *
    * @method _attachTheadTrNode
    * @param o {Object} {thead, columns, tr}.
    * @protected
    */
    _attachTheadTrNode: function(o) {
        o.thead.appendChild(o.tr);
    },

    /*
    * Creates and attaches header cell element.
    *
    * @method _addTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _addTheadThNode: function(o) {
        o.th = this._createTheadThNode(o);
        this._attachTheadThNode(o);
        //TODO: assign all node pointers: thNode, thLinerNode, thLabelNode
        o.column.thNode = o.th;
    },

    /*
    * Creates header cell element.
    *
    * @method _createTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    * @return {Node}
    */
    _createTheadThNode: function(o) {
        var column = o.column;
        
        // Populate template object
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.colspan = column.colSpan;
        o.rowspan = column.rowSpan;
        o.abbr = column.get("abbr");
        o.classnames = column.get("classnames");
        o.value = fromTemplate(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        return Ycreate(fromTemplate(this.thTemplate, o));
    },

    /*
    * Attaches header cell element.
    *
    * @method _attachTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _attachTheadThNode: function(o) {
        o.tr.appendChild(o.th);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // TBODY/RECORDSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /*
     * Updates TBODY.
     *
     * @method _uiSetRecordset
     * @param rs {Recordset} New Recordset.
     * @protected
     */
    _uiSetRecordset: function(rs) {
        var self = this,
            oldTbody = this._tbodyNode,
            parent = oldTbody.get("parentNode"),
            nextSibling = oldTbody.next(),
            columns = this.get('columnset').keys,
            cellValueTemplate = this.get('tdValueTemplate'),
            o = {},
            newTbody, i, len, column, formatter;

        // Replace TBODY with a new one
        //TODO: split _addTbodyNode into create/attach
        oldTbody.remove();
        oldTbody = null;
        newTbody = this._addTbodyNode(this._tableNode);
        newTbody.remove();
        this._tbodyNode = newTbody;
        o.tbody = newTbody;

        o.rowTemplate = this.get('trTemplate');
        o.columns = [];

        // Build up column data to avoid passing through Attribute APIs inside
        // render loops for rows and cells
        for (i = columns.length - 1; i >= 0; --i) {
            column = columns[i];
            o.columns[i] = {
                column        : column,
                fields        : column.get('field'),
                classnames    : column.get('classnames'),
                emptyCellValue: column.get('emptyCellValue')
            }

            formatter = column.get('formatter');

            if (YLang.isFunction(formatter)) {
                // function formatters need to run before checking if the value
                // needs defaulting from column.emptyCellValue
                formatter = Y.bind(this._functionFormatter, this, formatter);
            } else {
                if (!YLang.isString(formatter)) {
                    formatter = cellValueTemplate;
                }

                // string formatters need the value defaulted before processing
                formatter = Y.bind(this._templateFormatter, this, formatter);
            }

            o.columns[i].formatter = formatter;
        }


        // Iterate Recordset to use existing TR when possible or add new TR
        // TODO i = this.get("state.offsetIndex")
        // TODO len =this.get("state.pageLength")
        for (i = 0, len = rs.size(); i < len; ++i) {
            o.record = rs.item(i);
            o.data   = o.record.get("data");
            o.rowindex = i;
            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
        
        // TBODY to DOM
        parent.insert(this._tbodyNode, nextSibling);
    },

    _functionFormatter: function (formatter, o) {
        var value = formatter.call(this, o);

        return (value !== undefined) ? value : o.emptyCellValue;
    },

    _templateFormatter: function (template, o) {
        if (o.value === undefined) {
            o.value = o.emptyCellValue;
        }

        return fromTemplate(template, o);
    },

    /*
    * Creates and attaches data row element.
    *
    * @method _addTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    */
    _addTbodyTrNode: function(o) {
        var row = o.tbody.one("#" + o.record.get("id"));

        o.tr = row || this._createTbodyTrNode(o);

        this._attachTbodyTrNode(o);
    },

    /*
    * Creates data row element.
    *
    * @method _createTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    * @return {Node}
    */
    _createTbodyTrNode: function(o) {
        var columns = o.columns,
            i, len, columnInfo;

        o.tr = Ycreate(fromTemplate(o.rowTemplate, { id: o.record.get('id') }));
        
        for (i = 0, len = columns.length; i < len; ++i) {
            columnInfo      = columns[i];
            o.column        = columnInfo.column;
            o.field         = columnInfo.fields;
            o.classnames    = columnInfo.classnames;
            o.formatter     = columnInfo.formatter;
            o.emptyCellValue= columnInfo.emptyCellValue;

            this._addTbodyTdNode(o);
        }
        
        return o.tr;
    },

    /*
    * Attaches data row element.
    *
    * @method _attachTbodyTrNode
    * @param o {Object} {tbody, record, tr}.
    * @protected
    */
    _attachTbodyTrNode: function(o) {
        var tbody = o.tbody,
            tr = o.tr,
            index = o.rowindex,
            nextSibling = tbody.get("children").item(index) || null,
            isOdd = (index % 2);
            
        if(isOdd) {
            tr.replaceClass(CLASS_EVEN, CLASS_ODD);
        } else {
            tr.replaceClass(CLASS_ODD, CLASS_EVEN);
        }
        
        tbody.insertBefore(tr, nextSibling);
    },

    /*
    * Creates and attaches data cell element.
    *
    * @method _addTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    */
    _addTbodyTdNode: function(o) {
        o.td = this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
        delete o.td;
    },
    
    /*
    Creates a TD Node from the tdTemplate property using the input object as
    template {placeholder} values.  The created Node is also assigned to the
    `td` property on the input object.

    If the input object already has a `td` property, it is returned an no new
    Node is created.

    @method createCell
    @param {Object} data Template values
    @return {Node}
    **/
    createCell: function (data) {
        return data && (data.td ||
            (data.td = Ycreate(fromTemplate(this.tdTemplate, data))));
    },

    /*
    * Creates data cell element.
    *
    * @method _createTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    * @return {Node}
    */
    _createTbodyTdNode: function(o) {
        o.headers = o.column.headers;
        o.value   = this.formatDataCell(o);

        return o.td || this.createCell(o);
    },
    
    /*
    * Attaches data cell element.
    *
    * @method _attachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _attachTbodyTdNode: function(o) {
        o.tr.appendChild(o.td);
    },

    /*
     * Returns markup to insert into data cell element.
     *
     * @method formatDataCell
     * @param @param o {Object} {record, column, tr, headers, classnames}.
     */
    formatDataCell: function (o) {
        o.value = o.data[o.field];

        return o.formatter.call(this, o);
    },

    _initRecordset: function () {
        return new Y.Recordset({ records: [] });
    }
});

Y.namespace("DataTable").Base = DTBase;


}, '3.7.3' ,{requires:['recordset-base','widget','substitute','event-mouseenter']});
