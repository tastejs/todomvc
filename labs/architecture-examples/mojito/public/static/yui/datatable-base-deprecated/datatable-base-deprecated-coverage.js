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
_yuitest_coverage["/build/datatable-base-deprecated/datatable-base-deprecated.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/datatable-base-deprecated/datatable-base-deprecated.js",
    code: []
};
_yuitest_coverage["/build/datatable-base-deprecated/datatable-base-deprecated.js"].code=["YUI.add('datatable-base-deprecated', function(Y) {","","// API Doc comments disabled to avoid deprecated class leakage into","// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the","// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.","var YLang = Y.Lang,","    YisValue = YLang.isValue,","    fromTemplate = Y.Lang.sub,","    YNode = Y.Node,","    Ycreate = YNode.create,","    YgetClassName = Y.ClassNameManager.getClassName,","","    DATATABLE = \"datatable\",","    COLUMN = \"column\",","    ","    FOCUS = \"focus\",","    KEYDOWN = \"keydown\",","    MOUSEENTER = \"mouseenter\",","    MOUSELEAVE = \"mouseleave\",","    MOUSEUP = \"mouseup\",","    MOUSEDOWN = \"mousedown\",","    CLICK = \"click\",","    DBLCLICK = \"dblclick\",","","    CLASS_COLUMNS = YgetClassName(DATATABLE, \"columns\"),","    CLASS_DATA = YgetClassName(DATATABLE, \"data\"),","    CLASS_MSG = YgetClassName(DATATABLE, \"msg\"),","    CLASS_LINER = YgetClassName(DATATABLE, \"liner\"),","    CLASS_FIRST = YgetClassName(DATATABLE, \"first\"),","    CLASS_LAST = YgetClassName(DATATABLE, \"last\"),","    CLASS_EVEN = YgetClassName(DATATABLE, \"even\"),","    CLASS_ODD = YgetClassName(DATATABLE, \"odd\"),","","    TEMPLATE_TABLE = '<table></table>',","    TEMPLATE_COL = '<col></col>',","    TEMPLATE_THEAD = '<thead class=\"'+CLASS_COLUMNS+'\"></thead>',","    TEMPLATE_TBODY = '<tbody class=\"'+CLASS_DATA+'\"></tbody>',","    TEMPLATE_TH = '<th id=\"{id}\" rowspan=\"{rowspan}\" colspan=\"{colspan}\" class=\"{classnames}\" abbr=\"{abbr}\"><div class=\"'+CLASS_LINER+'\">{value}</div></th>',","    TEMPLATE_TR = '<tr id=\"{id}\"></tr>',","    TEMPLATE_TD = '<td headers=\"{headers}\" class=\"{classnames}\"><div class=\"'+CLASS_LINER+'\">{value}</div></td>',","    TEMPLATE_VALUE = '{value}',","    TEMPLATE_MSG = '<tbody class=\"'+CLASS_MSG+'\"></tbody>';","    ","","","// API Doc comments disabled to avoid deprecated class leakage into","// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the","// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.","/*"," * The Column class defines and manages attributes of Columns for DataTable."," *"," * @class Column"," * @extends Widget"," * @constructor"," */","function Column(config) {","    Column.superclass.constructor.apply(this, arguments);","}","","/////////////////////////////////////////////////////////////////////////////","//","// STATIC PROPERTIES","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(Column, {","    /*","     * Class name.","     *","     * @property NAME","     * @type {String}","     * @static","     * @final","     * @value \"column\"","     */","    NAME: \"column\",","","/////////////////////////////////////////////////////////////////////////////","//","// ATTRIBUTES","//","/////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /*","        Unique internal identifier, used to stamp ID on TH element.","        ","        @attribute id","        @type {String}","        @readOnly","        **/","        id: {","            valueFn: \"_defaultId\",","            readOnly: true","        },","        ","        /*","        User-supplied identifier. Defaults to id.","        @attribute key","        @type {String}","        **/","        key: {","            valueFn: \"_defaultKey\"","        },","","        /*","        Points to underlying data field (for sorting or formatting, for","        example). Useful when column doesn't hold any data itself, but is just","        a visual representation of data from another column or record field.","        Defaults to key.","","        @attribute field","        @type {String}","        @default (column key)","        **/","        field: {","            valueFn: \"_defaultField\"","        },","","        /*","        Display label for column header. Defaults to key.","","        @attribute label","        @type {String}","        **/","        label: {","            valueFn: \"_defaultLabel\"","        },","        ","        /*","        Array of child column definitions (for nested headers).","","        @attribute children","        @type {String}","        @default null","        **/","        children: {","            value: null","        },","        ","        /*","        TH abbr attribute.","","        @attribute abbr","        @type {String}","        @default \"\"","        **/","        abbr: {","            value: \"\"","        },","","        //TODO: support custom classnames","        // TH CSS classnames","        classnames: {","            readOnly: true,","            getter: \"_getClassnames\"","        },","        ","        /*","        Formating template string or function for cells in this column.","","        Function formatters receive a single object (described below) and are","        expected to output the `innerHTML` of the cell.","","        String templates can include markup and {placeholder} tokens to be","        filled in from the object passed to function formatters.","","        @attribute formatter","        @type {String|Function}","        @param {Object} data Data relevant to the rendering of this cell","            @param {String} data.classnames CSS classes to add to the cell","            @param {Column} data.column This Column instance","            @param {Object} data.data The raw object data from the Record","            @param {String} data.field This Column's \"field\" attribute value","            @param {String} data.headers TH ids to reference in the cell's","                            \"headers\" attribute","            @param {Record} data.record The Record instance for this row","            @param {Number} data.rowindex The index for this row","            @param {Node}   data.tbody The TBODY Node that will house the cell","            @param {Node}   data.tr The row TR Node that will house the cell","            @param {Any}    data.value The raw Record data for this cell","        **/","        formatter: {},","","        /*","        The default markup to display in cells that have no corresponding record","        data or content from formatters.","","        @attribute emptyCellValue","        @type {String}","        @default ''","        **/","        emptyCellValue: {","            value: '',","            validator: Y.Lang.isString","        },","","        //requires datatable-sort","        sortable: {","            value: false","        },","        //sortOptions:defaultDir, sortFn, field","","        //TODO: support editable columns","        // Column editor","        editor: {},","","        //TODO: support resizeable columns","        //TODO: support setting widths","        // requires datatable-colresize","        width: {},","        resizeable: {},","        minimized: {},","        minWidth: {},","        maxAutoWidth: {}","    }","});","","/////////////////////////////////////////////////////////////////////////////","//","// PROTOTYPE","//","/////////////////////////////////////////////////////////////////////////////","Y.extend(Column, Y.Widget, {","    /////////////////////////////////////////////////////////////////////////////","    //","    // ATTRIBUTE HELPERS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * Return ID for instance.","    *","    * @method _defaultId","    * @return {String}","    * @private","    */","    _defaultId: function() {","        return Y.guid();","    },","","    /*","    * Return key for instance. Defaults to ID if one was not provided.","    *","    * @method _defaultKey","    * @return {String}","    * @private","    */","    _defaultKey: function() {","        return Y.guid();","    },","","    /*","    * Return field for instance. Defaults to key if one was not provided.","    *","    * @method _defaultField","    * @return {String}","    * @private","    */","    _defaultField: function() {","        return this.get(\"key\");","    },","","    /*","    * Return label for instance. Defaults to key if one was not provided.","    *","    * @method _defaultLabel","    * @return {String}","    * @private","    */","    _defaultLabel: function() {","        return this.get(\"key\");","    },","","    /*","     * Updates the UI if changes are made to abbr.","     *","     * @method _afterAbbrChange","     * @param e {Event} Custom event for the attribute change.","     * @private","     */","    _afterAbbrChange: function (e) {","        this._uiSetAbbr(e.newVal);","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // PROPERTIES","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","     * Reference to Column's current position index within its Columnset's keys","     * array, if applicable. This property only applies to non-nested and bottom-","     * level child Columns. Value is set by Columnset code.","     *","     * @property keyIndex","     * @type {Number}","     */","    keyIndex: null,","    ","    /*","    * Array of TH IDs associated with this column, for TD \"headers\" attribute.","    * Value is set by Columnset code","    *","    * @property headers","    * @type {String[]}","    */","    headers: null,","","    /*","     * Number of cells the header spans. Value is set by Columnset code.","     *","     * @property colSpan","     * @type {Number}","     * @default 1","     */","    colSpan: 1,","    ","    /*","     * Number of rows the header spans. Value is set by Columnset code.","     *","     * @property rowSpan","     * @type {Number}","     * @default 1","     */","    rowSpan: 1,","","    /*","     * Column's parent Column instance, if applicable. Value is set by Columnset","     * code.","     *","     * @property parent","     * @type {Column}","     */","    parent: null,","","    /*","     * The Node reference to the associated TH element.","     *","     * @property thNode","     * @type {Node}","     */","     ","    thNode: null,","","    /*TODO","     * The Node reference to the associated liner element.","     *","     * @property thLinerNode","     * @type {Node}","     ","    thLinerNode: null,*/","    ","    /////////////////////////////////////////////////////////////////////////////","    //","    // METHODS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * Initializer.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","    },","","    /*","    * Destructor.","    *","    * @method destructor","    * @private","    */","    destructor: function() {","    },","","    /*","     * Returns classnames for Column.","     *","     * @method _getClassnames","     * @private","     */","    _getClassnames: function () {","        return Y.ClassNameManager.getClassName(COLUMN, this.get(\"key\").replace(/[^\\w\\-]/g,\"\"));","    },","","    ////////////////////////////////////////////////////////////////////////////","    //","    // SYNC","    //","    ////////////////////////////////////////////////////////////////////////////","    /*","    * Syncs UI to intial state.","    *","    * @method syncUI","    * @private","    */","    syncUI: function() {","        this._uiSetAbbr(this.get(\"abbr\"));","    },","","    /*","     * Updates abbr.","     *","     * @method _uiSetAbbr","     * @param val {String} New abbr.","     * @protected","     */","    _uiSetAbbr: function(val) {","        this.thNode.set(\"abbr\", val);","    }","});","","Y.Column = Column;","// API Doc comments disabled to avoid deprecated class leakage into","// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the","// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.","/*"," * The Columnset class defines and manages a collection of Columns."," *"," * @class Columnset"," * @extends Base"," * @constructor"," */","function Columnset(config) {","    Columnset.superclass.constructor.apply(this, arguments);","}","","/////////////////////////////////////////////////////////////////////////////","//","// STATIC PROPERTIES","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(Columnset, {","    /*","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"columnset\"","     */","    NAME: \"columnset\",","","    /////////////////////////////////////////////////////////////////////////////","    //","    // ATTRIBUTES","    //","    /////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /*","        * @attribute definitions","        * @description Array of column definitions that will populate this Columnset.","        * @type Array","        */","        definitions: {","            setter: \"_setDefinitions\"","        }","","    }","});","","/////////////////////////////////////////////////////////////////////////////","//","// PROTOTYPE","//","/////////////////////////////////////////////////////////////////////////////","Y.extend(Columnset, Y.Base, {","    /////////////////////////////////////////////////////////////////////////////","    //","    // ATTRIBUTE HELPERS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * @method _setDefinitions","    * @description Clones definitions before setting.","    * @param definitions {Array} Array of column definitions.","    * @return Array","    * @private","    */","    _setDefinitions: function(definitions) {","            return Y.clone(definitions);","    },","    ","    /////////////////////////////////////////////////////////////////////////////","    //","    // PROPERTIES","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","     * Top-down tree representation of Column hierarchy. Used to create DOM","     * elements.","     *","     * @property tree","     * @type {Column[]}","     */","    tree: null,","","    /*","     * Hash of all Columns by ID.","     *","     * @property idHash","     * @type Object","     */","    idHash: null,","","    /*","     * Hash of all Columns by key.","     *","     * @property keyHash","     * @type Object","     */","    keyHash: null,","","    /*","     * Array of only Columns that are meant to be displayed in DOM.","     *","     * @property keys","     * @type {Column[]}","     */","    keys: null,","","    /////////////////////////////////////////////////////////////////////////////","    //","    // METHODS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * Initializer. Generates all internal representations of the collection of","    * Columns.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function() {","","        // DOM tree representation of all Columns","        var tree = [],","        // Hash of all Columns by ID","        idHash = {},","        // Hash of all Columns by key","        keyHash = {},","        // Flat representation of only Columns that are meant to display data","        keys = [],","        // Original definitions","        definitions = this.get(\"definitions\"),","","        self = this;","","        // Internal recursive function to define Column instances","        function parseColumns(depth, currentDefinitions, parent) {","            var i=0,","                len = currentDefinitions.length,","                currentDefinition,","                column,","                currentChildren;","","            // One level down","            depth++;","","            // Create corresponding dom node if not already there for this depth","            if(!tree[depth]) {","                tree[depth] = [];","            }","","            // Parse each node at this depth for attributes and any children","            for(; i<len; ++i) {","                currentDefinition = currentDefinitions[i];","","                currentDefinition = YLang.isString(currentDefinition) ? {key:currentDefinition} : currentDefinition;","","                // Instantiate a new Column for each node","                column = new Y.Column(currentDefinition);","","                // Cross-reference Column ID back to the original object literal definition","                currentDefinition.yuiColumnId = column.get(\"id\");","","                // Add the new Column to the hash","                idHash[column.get(\"id\")] = column;","                keyHash[column.get(\"key\")] = column;","","                // Assign its parent as an attribute, if applicable","                if(parent) {","                    column.parent = parent;","                }","","                // The Column has descendants","                if(YLang.isArray(currentDefinition.children)) {","                    currentChildren = currentDefinition.children;","                    column._set(\"children\", currentChildren);","","                    self._setColSpans(column, currentDefinition);","","                    self._cascadePropertiesToChildren(column, currentChildren);","","                    // The children themselves must also be parsed for Column instances","                    if(!tree[depth+1]) {","                        tree[depth+1] = [];","                    }","                    parseColumns(depth, currentChildren, column);","                }","                // This Column does not have any children","                else {","                    column.keyIndex = keys.length;","                    // Default is already 1","                    //column.colSpan = 1;","                    keys.push(column);","                }","","                // Add the Column to the top-down dom tree","                tree[depth].push(column);","            }","            depth--;","        }","","        // Parse out Column instances from the array of object literals","        parseColumns(-1, definitions);","","","        // Save to the Columnset instance","        this.tree = tree;","        this.idHash = idHash;","        this.keyHash = keyHash;","        this.keys = keys;","","        this._setRowSpans();","        this._setHeaders();","    },","","    /*","    * Destructor.","    *","    * @method destructor","    * @private","    */","    destructor: function() {","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // COLUMN HELPERS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * Cascade certain properties to children if not defined on their own.","    *","    * @method _cascadePropertiesToChildren","    * @private","    */","    _cascadePropertiesToChildren: function(column, currentChildren) {","        //TODO: this is all a giant todo","        var i = 0,","            len = currentChildren.length,","            child;","","        // Cascade certain properties to children if not defined on their own","        for(; i<len; ++i) {","            child = currentChildren[i];","            if(column.get(\"className\") && (child.className === undefined)) {","                child.className = column.get(\"className\");","            }","            if(column.get(\"editor\") && (child.editor === undefined)) {","                child.editor = column.get(\"editor\");","            }","            if(column.get(\"formatter\") && (child.formatter === undefined)) {","                child.formatter = column.get(\"formatter\");","            }","            if(column.get(\"resizeable\") && (child.resizeable === undefined)) {","                child.resizeable = column.get(\"resizeable\");","            }","            if(column.get(\"sortable\") && (child.sortable === undefined)) {","                child.sortable = column.get(\"sortable\");","            }","            if(column.get(\"hidden\")) {","                child.hidden = true;","            }","            if(column.get(\"width\") && (child.width === undefined)) {","                child.width = column.get(\"width\");","            }","            if(column.get(\"minWidth\") && (child.minWidth === undefined)) {","                child.minWidth = column.get(\"minWidth\");","            }","            if(column.get(\"maxAutoWidth\") && (child.maxAutoWidth === undefined)) {","                child.maxAutoWidth = column.get(\"maxAutoWidth\");","            }","        }","    },","","    /*","    * @method _setColSpans","    * @description Calculates and sets colSpan attribute on given Column.","    * @param column {Array} Column instance.","    * @param definition {Object} Column definition.","    * @private","    */","    _setColSpans: function(column, definition) {","        // Determine COLSPAN value for this Column","        var terminalChildNodes = 0;","","        function countTerminalChildNodes(ancestor) {","            var descendants = ancestor.children,","                i = 0,","                len = descendants.length;","","            // Drill down each branch and count terminal nodes","            for(; i<len; ++i) {","                // Keep drilling down","                if(YLang.isArray(descendants[i].children)) {","                    countTerminalChildNodes(descendants[i]);","                }","                // Reached branch terminus","                else {","                    terminalChildNodes++;","                }","            }","        }","        countTerminalChildNodes(definition);","        column.colSpan = terminalChildNodes;","    },","","    /*","    * @method _setRowSpans","    * @description Calculates and sets rowSpan attribute on all Columns.","    * @private","    */","    _setRowSpans: function() {","        // Determine ROWSPAN value for each Column in the DOM tree","        function parseDomTreeForRowSpan(tree) {","            var maxRowDepth = 1,","                currentRow,","                currentColumn,","                m,p;","","            // Calculate the max depth of descendants for this row","            function countMaxRowDepth(row, tmpRowDepth) {","                tmpRowDepth = tmpRowDepth || 1;","","                var i = 0,","                    len = row.length,","                    col;","","                for(; i<len; ++i) {","                    col = row[i];","                    // Column has children, so keep counting","                    if(YLang.isArray(col.children)) {","                        tmpRowDepth++;","                        countMaxRowDepth(col.children, tmpRowDepth);","                        tmpRowDepth--;","                    }","                    // Column has children, so keep counting","                    else if(col.get && YLang.isArray(col.get(\"children\"))) {","                        tmpRowDepth++;","                        countMaxRowDepth(col.get(\"children\"), tmpRowDepth);","                        tmpRowDepth--;","                    }","                    // No children, is it the max depth?","                    else {","                        if(tmpRowDepth > maxRowDepth) {","                            maxRowDepth = tmpRowDepth;","                        }","                    }","                }","            }","","            // Count max row depth for each row","            for(m=0; m<tree.length; m++) {","                currentRow = tree[m];","                countMaxRowDepth(currentRow);","","                // Assign the right ROWSPAN values to each Column in the row","                for(p=0; p<currentRow.length; p++) {","                    currentColumn = currentRow[p];","                    if(!YLang.isArray(currentColumn.get(\"children\"))) {","                        currentColumn.rowSpan = maxRowDepth;","                    }","                    // Default is already 1","                    // else currentColumn.rowSpan =1;","                }","","                // Reset counter for next row","                maxRowDepth = 1;","            }","        }","        parseDomTreeForRowSpan(this.tree);","    },","","    /*","    * @method _setHeaders","    * @description Calculates and sets headers attribute on all Columns.","    * @private","    */","    _setHeaders: function() {","        var headers, column,","            allKeys = this.keys,","            i=0, len = allKeys.length;","","        function recurseAncestorsForHeaders(headers, column) {","            headers.push(column.get(\"id\"));","            if(column.parent) {","                recurseAncestorsForHeaders(headers, column.parent);","            }","        }","        for(; i<len; ++i) {","            headers = [];","            column = allKeys[i];","            recurseAncestorsForHeaders(headers, column);","            column.headers = headers.reverse().join(\" \");","        }","    },","","    //TODO","    getColumn: function() {","    }","});","","Y.Columnset = Columnset;","// API Doc comments disabled to avoid deprecated class leakage into","// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the","// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.","/**","The DataTable widget provides a progressively enhanced DHTML control for","displaying tabular data across A-grade browsers.","","DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module","corresponds to the 3.4.1 version of DataTable and will be removed from the","library in a future version.","","See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the","latest version.","","For complete API docs for the classes in this and other deprecated","DataTable-related modules, refer to the static API doc files in the 3.4.1","download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip","","@module datatable-deprecated","@main datatable-deprecated","@deprecated","**/","","/**","Provides the base DataTable implementation, which can be extended to add","additional functionality, such as sorting or scrolling.","","DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module","corresponds to the 3.4.1 version of DataTable and will be removed from the","library in a future version.","","See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the","latest version.","","For complete API docs for the classes in this and other deprecated","DataTable-related modules, refer to the static API doc files in the 3.4.1","download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip","","@module datatable-deprecated","@submodule datatable-base-deprecated","@deprecated","**/","","/*"," * Base class for the DataTable widget."," * @class DataTable.Base"," * @extends Widget"," * @constructor"," */","function DTBase(config) {","    DTBase.superclass.constructor.apply(this, arguments);","}","","/////////////////////////////////////////////////////////////////////////////","//","// STATIC PROPERTIES","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(DTBase, {","","    /*","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataTable\"","     */","    NAME:  \"dataTable\",","","/////////////////////////////////////////////////////////////////////////////","//","// ATTRIBUTES","//","/////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /*","        * @attribute columnset","        * @description Pointer to Columnset instance.","        * @type Array | Y.Columnset","        */","        columnset: {","            setter: \"_setColumnset\"","        },","","        /*","        * @attribute recordset","        * @description Pointer to Recordset instance.","        * @type Array | Y.Recordset","        */","        recordset: {","            valueFn: '_initRecordset',","            setter: \"_setRecordset\"","        },","","        /*TODO","        * @attribute state","        * @description Internal state.","        * @readonly","        * @type","        */","        /*state: {","            value: new Y.State(),","            readOnly: true","","        },*/","","        /*","        * @attribute summary","        * @description Summary.","        * @type String","        */","        summary: {","        },","","        /*","        * @attribute caption","        * @description Caption","        * @type String","        */","        caption: {","        },","","        /*","        * @attribute thValueTemplate","        * @description Tokenized markup template for TH value.","        * @type String","        * @default '{value}'","        */","        thValueTemplate: {","            value: TEMPLATE_VALUE","        },","","        /*","        * @attribute tdValueTemplate","        * @description Tokenized markup template for TD value.","        * @type String","        * @default '{value}'","        */","        tdValueTemplate: {","            value: TEMPLATE_VALUE","        },","","        /*","        * @attribute trTemplate","        * @description Tokenized markup template for TR node creation.","        * @type String","        * @default '<tr id=\"{id}\"></tr>'","        */","        trTemplate: {","            value: TEMPLATE_TR","        }","    },","","/////////////////////////////////////////////////////////////////////////////","//","// TODO: HTML_PARSER","//","/////////////////////////////////////////////////////////////////////////////","    HTML_PARSER: {","        /*caption: function (srcNode) {","            ","        }*/","    }","});","","/////////////////////////////////////////////////////////////////////////////","//","// PROTOTYPE","//","/////////////////////////////////////////////////////////////////////////////","Y.extend(DTBase, Y.Widget, {","    /*","    * @property thTemplate","    * @description Tokenized markup template for TH node creation.","    * @type String","    * @default '<th id=\"{id}\" rowspan=\"{rowspan}\" colspan=\"{colspan}\" class=\"{classnames}\" abbr=\"{abbr}\"><div class=\"'+CLASS_LINER+'\">{value}</div></th>'","    */","    thTemplate: TEMPLATE_TH,","","    /*","    * @property tdTemplate","    * @description Tokenized markup template for TD node creation.","    * @type String","    * @default '<td headers=\"{headers}\" class=\"{classnames}\"><div class=\"yui3-datatable-liner\">{value}</div></td>'","    */","    tdTemplate: TEMPLATE_TD,","    ","    /*","    * @property _theadNode","    * @description Pointer to THEAD node.","    * @type {Node}","    * @private","    */","    _theadNode: null,","    ","    /*","    * @property _tbodyNode","    * @description Pointer to TBODY node.","    * @type {Node}","    * @private","    */","    _tbodyNode: null,","    ","    /*","    * @property _msgNode","    * @description Pointer to message display node.","    * @type {Node}","    * @private","    */","    _msgNode: null,","","    /////////////////////////////////////////////////////////////////////////////","    //","    // ATTRIBUTE HELPERS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * @method _setColumnset","    * @description Converts Array to Y.Columnset.","    * @param columns {Array | Y.Columnset}","    * @return {Columnset}","    * @private","    */","    _setColumnset: function(columns) {","        return YLang.isArray(columns) ? new Y.Columnset({definitions:columns}) : columns;","    },","","    /*","     * Updates the UI if Columnset is changed.","     *","     * @method _afterColumnsetChange","     * @param e {Event} Custom event for the attribute change.","     * @protected","     */","    _afterColumnsetChange: function (e) {","        this._uiSetColumnset(e.newVal);","    },","","    /*","    * @method _setRecordset","    * @description Converts Array to Y.Recordset.","    * @param records {Array | Recordset}","    * @return {Recordset}","    * @private","    */","    _setRecordset: function(rs) {","        if(YLang.isArray(rs)) {","            rs = new Y.Recordset({records:rs});","        }","","        rs.addTarget(this);","        return rs;","    },","    ","    /*","    * Updates the UI if Recordset is changed.","    *","    * @method _afterRecordsetChange","    * @param e {Event} Custom event for the attribute change.","    * @protected","    */","    _afterRecordsetChange: function (e) {","        this._uiSetRecordset(e.newVal);","    },","","    /*","    * Updates the UI if Recordset records are changed.","    *","    * @method _afterRecordsChange","    * @param e {Event} Custom event for the attribute change.","    * @protected","    */","    _afterRecordsChange: function (e) {","        this._uiSetRecordset(this.get('recordset'));","    },","","    /*","     * Updates the UI if summary is changed.","     *","     * @method _afterSummaryChange","     * @param e {Event} Custom event for the attribute change.","     * @protected","     */","    _afterSummaryChange: function (e) {","        this._uiSetSummary(e.newVal);","    },","","    /*","     * Updates the UI if caption is changed.","     *","     * @method _afterCaptionChange","     * @param e {Event} Custom event for the attribute change.","     * @protected","     */","    _afterCaptionChange: function (e) {","        this._uiSetCaption(e.newVal);","    },","","    ////////////////////////////////////////////////////////////////////////////","    //","    // METHODS","    //","    ////////////////////////////////////////////////////////////////////////////","","    /*","    * Destructor.","    *","    * @method destructor","    * @private","    */","    destructor: function() {","         this.get(\"recordset\").removeTarget(this);","    },","    ","    ////////////////////////////////////////////////////////////////////////////","    //","    // RENDER","    //","    ////////////////////////////////////////////////////////////////////////////","","    /*","    * Renders UI.","    *","    * @method renderUI","    * @private","    */","    renderUI: function() {","        // TABLE","        this._addTableNode(this.get(\"contentBox\"));","","        // COLGROUP","        this._addColgroupNode(this._tableNode);","","        // THEAD","        this._addTheadNode(this._tableNode);","","        // Primary TBODY","        this._addTbodyNode(this._tableNode);","","        // Message TBODY","        this._addMessageNode(this._tableNode);","","        // CAPTION","        this._addCaptionNode(this._tableNode);","   },","","    /*","    * Creates and attaches TABLE element to given container.","    *","    * @method _addTableNode","    * @param containerNode {Node} Parent node.","    * @protected","    * @return {Node}","    */","    _addTableNode: function(containerNode) {","        if (!this._tableNode) {","            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));","        }","        return this._tableNode;","    },","","    /*","    * Creates and attaches COLGROUP element to given TABLE.","    *","    * @method _addColgroupNode","    * @param tableNode {Node} Parent node.","    * @protected","    * @return {Node}","    */","    _addColgroupNode: function(tableNode) {","        // Add COLs to DOCUMENT FRAGMENT","        var len = this.get(\"columnset\").keys.length,","            i = 0,","            allCols = [\"<colgroup>\"];","","        for(; i<len; ++i) {","            allCols.push(TEMPLATE_COL);","        }","","        allCols.push(\"</colgroup>\");","","        // Create COLGROUP","        this._colgroupNode = tableNode.insertBefore(Ycreate(allCols.join(\"\")), tableNode.get(\"firstChild\"));","","        return this._colgroupNode;","    },","","    /*","    * Creates and attaches THEAD element to given container.","    *","    * @method _addTheadNode","    * @param tableNode {Node} Parent node.","    * @protected","    * @return {Node}","    */","    _addTheadNode: function(tableNode) {","        if(tableNode) {","            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());","            return this._theadNode;","        }","    },","","    /*","    * Creates and attaches TBODY element to given container.","    *","    * @method _addTbodyNode","    * @param tableNode {Node} Parent node.","    * @protected","    * @return {Node}","    */","    _addTbodyNode: function(tableNode) {","        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));","        return this._tbodyNode;","    },","","    /*","    * Creates and attaches message display element to given container.","    *","    * @method _addMessageNode","    * @param tableNode {Node} Parent node.","    * @protected","    * @return {Node}","    */","    _addMessageNode: function(tableNode) {","        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);","        return this._msgNode;","    },","","    /*","    * Creates and attaches CAPTION element to given container.","    *","    * @method _addCaptionNode","    * @param tableNode {Node} Parent node.","    * @protected","    * @return {Node}","    */","    _addCaptionNode: function(tableNode) {","        this._captionNode = Y.Node.create('<caption></caption>');","    },","","    ////////////////////////////////////////////////////////////////////////////","    //","    // BIND","    //","    ////////////////////////////////////////////////////////////////////////////","","    /*","    * Binds events.","    *","    * @method bindUI","    * @private","    */","    bindUI: function() {","        this.after({","            columnsetChange: this._afterColumnsetChange,","            summaryChange  : this._afterSummaryChange,","            captionChange  : this._afterCaptionChange,","            recordsetChange: this._afterRecordsChange,","            \"recordset:tableChange\": this._afterRecordsChange","        });","    },","    ","    delegate: function(type) {","        //TODO: is this necessary?","        if(type===\"dblclick\") {","            this.get(\"boundingBox\").delegate.apply(this.get(\"boundingBox\"), arguments);","        }","        else {","            this.get(\"contentBox\").delegate.apply(this.get(\"contentBox\"), arguments);","        }","    },","    ","","    ////////////////////////////////////////////////////////////////////////////","    //","    // SYNC","    //","    ////////////////////////////////////////////////////////////////////////////","","    /*","    * Syncs UI to intial state.","    *","    * @method syncUI","    * @private","    */","    syncUI: function() {","        // THEAD ROWS","        this._uiSetColumnset(this.get(\"columnset\"));","        // DATA ROWS","        this._uiSetRecordset(this.get(\"recordset\"));","        // SUMMARY","        this._uiSetSummary(this.get(\"summary\"));","        // CAPTION","        this._uiSetCaption(this.get(\"caption\"));","    },","","    /*","     * Updates summary.","     *","     * @method _uiSetSummary","     * @param val {String} New summary.","     * @protected","     */","    _uiSetSummary: function(val) {","        val = YisValue(val) ? val : \"\";","        this._tableNode.set(\"summary\", val);","    },","","    /*","     * Updates caption.","     *","     * @method _uiSetCaption","     * @param val {String} New caption.","     * @protected","     */","    _uiSetCaption: function(val) {","        var caption = this._captionNode,","            inDoc   = caption.inDoc(),","            method  = val ? (!inDoc && 'prepend') : (inDoc && 'removeChild');","","        caption.setContent(val || '');","","        if (method) {","            // prepend of remove necessary","            this._tableNode[method](caption);","        }","    },","","","    ////////////////////////////////////////////////////////////////////////////","    //","    // THEAD/COLUMNSET FUNCTIONALITY","    //","    ////////////////////////////////////////////////////////////////////////////","    /*","     * Updates THEAD.","     *","     * @method _uiSetColumnset","     * @param cs {Columnset} New Columnset.","     * @protected","     */","    _uiSetColumnset: function(cs) {","        var tree = cs.tree,","            thead = this._theadNode,","            i = 0,","            len = tree.length,","            parent = thead.get(\"parentNode\"),","            nextSibling = thead.next();","            ","        // Move THEAD off DOM","        thead.remove();","        ","        thead.get(\"children\").remove(true);","","        // Iterate tree of columns to add THEAD rows","        for(; i<len; ++i) {","            this._addTheadTrNode({","                thead:   thead,","                columns: tree[i],","                id     : '' // to avoid {id} leftovers from the trTemplate","            }, (i === 0), (i === len - 1));","        }","","        // Column helpers needs _theadNode to exist","        //this._createColumnHelpers();","","        ","        // Re-attach THEAD to DOM","        parent.insert(thead, nextSibling);","","     },","     ","    /*","    * Creates and attaches header row element.","    *","    * @method _addTheadTrNode","    * @param o {Object} {thead, columns}.","    * @param isFirst {Boolean} Is first row.","    * @param isFirst {Boolean} Is last row.","    * @protected","    */","     _addTheadTrNode: function(o, isFirst, isLast) {","        o.tr = this._createTheadTrNode(o, isFirst, isLast);","        this._attachTheadTrNode(o);","     },","     ","","    /*","    * Creates header row element.","    *","    * @method _createTheadTrNode","    * @param o {Object} {thead, columns}.","    * @param isFirst {Boolean} Is first row.","    * @param isLast {Boolean} Is last row.","    * @protected","    * @return {Node}","    */","    _createTheadTrNode: function(o, isFirst, isLast) {","        //TODO: custom classnames","        var tr = Ycreate(fromTemplate(this.get(\"trTemplate\"), o)),","            i = 0,","            columns = o.columns,","            len = columns.length,","            column;","","         // Set FIRST/LAST class","        if(isFirst) {","            tr.addClass(CLASS_FIRST);","        }","        if(isLast) {","            tr.addClass(CLASS_LAST);","        }","","        for(; i<len; ++i) {","            column = columns[i];","            this._addTheadThNode({value:column.get(\"label\"), column: column, tr:tr});","        }","","        return tr;","    },","","    /*","    * Attaches header row element.","    *","    * @method _attachTheadTrNode","    * @param o {Object} {thead, columns, tr}.","    * @protected","    */","    _attachTheadTrNode: function(o) {","        o.thead.appendChild(o.tr);","    },","","    /*","    * Creates and attaches header cell element.","    *","    * @method _addTheadThNode","    * @param o {Object} {value, column, tr}.","    * @protected","    */","    _addTheadThNode: function(o) {","        o.th = this._createTheadThNode(o);","        this._attachTheadThNode(o);","        //TODO: assign all node pointers: thNode, thLinerNode, thLabelNode","        o.column.thNode = o.th;","    },","","    /*","    * Creates header cell element.","    *","    * @method _createTheadThNode","    * @param o {Object} {value, column, tr}.","    * @protected","    * @return {Node}","    */","    _createTheadThNode: function(o) {","        var column = o.column;","        ","        // Populate template object","        o.id = column.get(\"id\");//TODO: validate 1 column ID per document","        o.colspan = column.colSpan;","        o.rowspan = column.rowSpan;","        o.abbr = column.get(\"abbr\");","        o.classnames = column.get(\"classnames\");","        o.value = fromTemplate(this.get(\"thValueTemplate\"), o);","","        /*TODO","        // Clear minWidth on hidden Columns","        if(column.get(\"hidden\")) {","            //this._clearMinWidth(column);","        }","        */","        ","        return Ycreate(fromTemplate(this.thTemplate, o));","    },","","    /*","    * Attaches header cell element.","    *","    * @method _attachTheadThNode","    * @param o {Object} {value, column, tr}.","    * @protected","    */","    _attachTheadThNode: function(o) {","        o.tr.appendChild(o.th);","    },","","    ////////////////////////////////////////////////////////////////////////////","    //","    // TBODY/RECORDSET FUNCTIONALITY","    //","    ////////////////////////////////////////////////////////////////////////////","    /*","     * Updates TBODY.","     *","     * @method _uiSetRecordset","     * @param rs {Recordset} New Recordset.","     * @protected","     */","    _uiSetRecordset: function(rs) {","        var self = this,","            oldTbody = this._tbodyNode,","            parent = oldTbody.get(\"parentNode\"),","            nextSibling = oldTbody.next(),","            columns = this.get('columnset').keys,","            cellValueTemplate = this.get('tdValueTemplate'),","            o = {},","            newTbody, i, len, column, formatter;","","        // Replace TBODY with a new one","        //TODO: split _addTbodyNode into create/attach","        oldTbody.remove();","        oldTbody = null;","        newTbody = this._addTbodyNode(this._tableNode);","        newTbody.remove();","        this._tbodyNode = newTbody;","        o.tbody = newTbody;","","        o.rowTemplate = this.get('trTemplate');","        o.columns = [];","","        // Build up column data to avoid passing through Attribute APIs inside","        // render loops for rows and cells","        for (i = columns.length - 1; i >= 0; --i) {","            column = columns[i];","            o.columns[i] = {","                column        : column,","                fields        : column.get('field'),","                classnames    : column.get('classnames'),","                emptyCellValue: column.get('emptyCellValue')","            }","","            formatter = column.get('formatter');","","            if (YLang.isFunction(formatter)) {","                // function formatters need to run before checking if the value","                // needs defaulting from column.emptyCellValue","                formatter = Y.bind(this._functionFormatter, this, formatter);","            } else {","                if (!YLang.isString(formatter)) {","                    formatter = cellValueTemplate;","                }","","                // string formatters need the value defaulted before processing","                formatter = Y.bind(this._templateFormatter, this, formatter);","            }","","            o.columns[i].formatter = formatter;","        }","","","        // Iterate Recordset to use existing TR when possible or add new TR","        // TODO i = this.get(\"state.offsetIndex\")","        // TODO len =this.get(\"state.pageLength\")","        for (i = 0, len = rs.size(); i < len; ++i) {","            o.record = rs.item(i);","            o.data   = o.record.get(\"data\");","            o.rowindex = i;","            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex","        }","        ","        // TBODY to DOM","        parent.insert(this._tbodyNode, nextSibling);","    },","","    _functionFormatter: function (formatter, o) {","        var value = formatter.call(this, o);","","        return (value !== undefined) ? value : o.emptyCellValue;","    },","","    _templateFormatter: function (template, o) {","        if (o.value === undefined) {","            o.value = o.emptyCellValue;","        }","","        return fromTemplate(template, o);","    },","","    /*","    * Creates and attaches data row element.","    *","    * @method _addTbodyTrNode","    * @param o {Object} {tbody, record}","    * @protected","    */","    _addTbodyTrNode: function(o) {","        var row = o.tbody.one(\"#\" + o.record.get(\"id\"));","","        o.tr = row || this._createTbodyTrNode(o);","","        this._attachTbodyTrNode(o);","    },","","    /*","    * Creates data row element.","    *","    * @method _createTbodyTrNode","    * @param o {Object} {tbody, record}","    * @protected","    * @return {Node}","    */","    _createTbodyTrNode: function(o) {","        var columns = o.columns,","            i, len, columnInfo;","","        o.tr = Ycreate(fromTemplate(o.rowTemplate, { id: o.record.get('id') }));","        ","        for (i = 0, len = columns.length; i < len; ++i) {","            columnInfo      = columns[i];","            o.column        = columnInfo.column;","            o.field         = columnInfo.fields;","            o.classnames    = columnInfo.classnames;","            o.formatter     = columnInfo.formatter;","            o.emptyCellValue= columnInfo.emptyCellValue;","","            this._addTbodyTdNode(o);","        }","        ","        return o.tr;","    },","","    /*","    * Attaches data row element.","    *","    * @method _attachTbodyTrNode","    * @param o {Object} {tbody, record, tr}.","    * @protected","    */","    _attachTbodyTrNode: function(o) {","        var tbody = o.tbody,","            tr = o.tr,","            index = o.rowindex,","            nextSibling = tbody.get(\"children\").item(index) || null,","            isOdd = (index % 2);","            ","        if(isOdd) {","            tr.replaceClass(CLASS_EVEN, CLASS_ODD);","        } else {","            tr.replaceClass(CLASS_ODD, CLASS_EVEN);","        }","        ","        tbody.insertBefore(tr, nextSibling);","    },","","    /*","    * Creates and attaches data cell element.","    *","    * @method _addTbodyTdNode","    * @param o {Object} {record, column, tr}.","    * @protected","    */","    _addTbodyTdNode: function(o) {","        o.td = this._createTbodyTdNode(o);","        this._attachTbodyTdNode(o);","        delete o.td;","    },","    ","    /*","    Creates a TD Node from the tdTemplate property using the input object as","    template {placeholder} values.  The created Node is also assigned to the","    `td` property on the input object.","","    If the input object already has a `td` property, it is returned an no new","    Node is created.","","    @method createCell","    @param {Object} data Template values","    @return {Node}","    **/","    createCell: function (data) {","        return data && (data.td ||","            (data.td = Ycreate(fromTemplate(this.tdTemplate, data))));","    },","","    /*","    * Creates data cell element.","    *","    * @method _createTbodyTdNode","    * @param o {Object} {record, column, tr}.","    * @protected","    * @return {Node}","    */","    _createTbodyTdNode: function(o) {","        o.headers = o.column.headers;","        o.value   = this.formatDataCell(o);","","        return o.td || this.createCell(o);","    },","    ","    /*","    * Attaches data cell element.","    *","    * @method _attachTbodyTdNode","    * @param o {Object} {record, column, tr, headers, classnames, value}.","    * @protected","    */","    _attachTbodyTdNode: function(o) {","        o.tr.appendChild(o.td);","    },","","    /*","     * Returns markup to insert into data cell element.","     *","     * @method formatDataCell","     * @param @param o {Object} {record, column, tr, headers, classnames}.","     */","    formatDataCell: function (o) {","        o.value = o.data[o.field];","","        return o.formatter.call(this, o);","    },","","    _initRecordset: function () {","        return new Y.Recordset({ records: [] });","    }","});","","Y.namespace(\"DataTable\").Base = DTBase;","","","}, '3.7.3' ,{requires:['recordset-base','widget','substitute','event-mouseenter']});"];
_yuitest_coverage["/build/datatable-base-deprecated/datatable-base-deprecated.js"].lines = {"1":0,"6":0,"56":0,"57":0,"65":0,"222":0,"236":0,"247":0,"258":0,"269":0,"280":0,"382":0,"397":0,"408":0,"412":0,"423":0,"424":0,"432":0,"467":0,"481":0,"538":0,"551":0,"552":0,"559":0,"562":0,"563":0,"567":0,"568":0,"570":0,"573":0,"576":0,"579":0,"580":0,"583":0,"584":0,"588":0,"589":0,"590":0,"592":0,"594":0,"597":0,"598":0,"600":0,"604":0,"607":0,"611":0,"613":0,"617":0,"621":0,"622":0,"623":0,"624":0,"626":0,"627":0,"652":0,"657":0,"658":0,"659":0,"660":0,"662":0,"663":0,"665":0,"666":0,"668":0,"669":0,"671":0,"672":0,"674":0,"675":0,"677":0,"678":0,"680":0,"681":0,"683":0,"684":0,"698":0,"700":0,"701":0,"706":0,"708":0,"709":0,"713":0,"717":0,"718":0,"728":0,"729":0,"735":0,"736":0,"738":0,"742":0,"743":0,"745":0,"746":0,"747":0,"748":0,"751":0,"752":0,"753":0,"754":0,"758":0,"759":0,"766":0,"767":0,"768":0,"771":0,"772":0,"773":0,"774":0,"781":0,"784":0,"793":0,"797":0,"798":0,"799":0,"800":0,"803":0,"804":0,"805":0,"806":0,"807":0,"816":0,"866":0,"867":0,"875":0,"989":0,"1043":0,"1054":0,"1065":0,"1066":0,"1069":0,"1070":0,"1081":0,"1092":0,"1103":0,"1114":0,"1130":0,"1147":0,"1150":0,"1153":0,"1156":0,"1159":0,"1162":0,"1174":0,"1175":0,"1177":0,"1190":0,"1194":0,"1195":0,"1198":0,"1201":0,"1203":0,"1215":0,"1216":0,"1217":0,"1230":0,"1231":0,"1243":0,"1244":0,"1256":0,"1272":0,"1283":0,"1284":0,"1287":0,"1306":0,"1308":0,"1310":0,"1312":0,"1323":0,"1324":0,"1335":0,"1339":0,"1341":0,"1343":0,"1361":0,"1369":0,"1371":0,"1374":0,"1375":0,"1387":0,"1401":0,"1402":0,"1418":0,"1425":0,"1426":0,"1428":0,"1429":0,"1432":0,"1433":0,"1434":0,"1437":0,"1448":0,"1459":0,"1460":0,"1462":0,"1474":0,"1477":0,"1478":0,"1479":0,"1480":0,"1481":0,"1482":0,"1491":0,"1502":0,"1518":0,"1529":0,"1530":0,"1531":0,"1532":0,"1533":0,"1534":0,"1536":0,"1537":0,"1541":0,"1542":0,"1543":0,"1550":0,"1552":0,"1555":0,"1557":0,"1558":0,"1562":0,"1565":0,"1572":0,"1573":0,"1574":0,"1575":0,"1576":0,"1580":0,"1584":0,"1586":0,"1590":0,"1591":0,"1594":0,"1605":0,"1607":0,"1609":0,"1621":0,"1624":0,"1626":0,"1627":0,"1628":0,"1629":0,"1630":0,"1631":0,"1632":0,"1634":0,"1637":0,"1648":0,"1654":0,"1655":0,"1657":0,"1660":0,"1671":0,"1672":0,"1673":0,"1689":0,"1702":0,"1703":0,"1705":0,"1716":0,"1726":0,"1728":0,"1732":0,"1736":0};
_yuitest_coverage["/build/datatable-base-deprecated/datatable-base-deprecated.js"].functions = {"Column:56":0,"_defaultId:235":0,"_defaultKey:246":0,"_defaultField:257":0,"_defaultLabel:268":0,"_afterAbbrChange:279":0,"_getClassnames:381":0,"syncUI:396":0,"_uiSetAbbr:407":0,"Columnset:423":0,"_setDefinitions:480":0,"parseColumns:551":0,"initializer:535":0,"_cascadePropertiesToChildren:650":0,"countTerminalChildNodes:700":0,"_setColSpans:696":0,"countMaxRowDepth:735":0,"parseDomTreeForRowSpan:728":0,"_setRowSpans:726":0,"recurseAncestorsForHeaders:797":0,"_setHeaders:792":0,"DTBase:866":0,"_setColumnset:1042":0,"_afterColumnsetChange:1053":0,"_setRecordset:1064":0,"_afterRecordsetChange:1080":0,"_afterRecordsChange:1091":0,"_afterSummaryChange:1102":0,"_afterCaptionChange:1113":0,"destructor:1129":0,"renderUI:1145":0,"_addTableNode:1173":0,"_addColgroupNode:1188":0,"_addTheadNode:1214":0,"_addTbodyNode:1229":0,"_addMessageNode:1242":0,"_addCaptionNode:1255":0,"bindUI:1271":0,"delegate:1281":0,"syncUI:1304":0,"_uiSetSummary:1322":0,"_uiSetCaption:1334":0,"_uiSetColumnset:1360":0,"_addTheadTrNode:1400":0,"_createTheadTrNode:1416":0,"_attachTheadTrNode:1447":0,"_addTheadThNode:1458":0,"_createTheadThNode:1473":0,"_attachTheadThNode:1501":0,"_uiSetRecordset:1517":0,"_functionFormatter:1583":0,"_templateFormatter:1589":0,"_addTbodyTrNode:1604":0,"_createTbodyTrNode:1620":0,"_attachTbodyTrNode:1647":0,"_addTbodyTdNode:1670":0,"createCell:1688":0,"_createTbodyTdNode:1701":0,"_attachTbodyTdNode:1715":0,"formatDataCell:1725":0,"_initRecordset:1731":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/datatable-base-deprecated/datatable-base-deprecated.js"].coveredLines = 264;
_yuitest_coverage["/build/datatable-base-deprecated/datatable-base-deprecated.js"].coveredFunctions = 62;
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1);
YUI.add('datatable-base-deprecated', function(Y) {

// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
_yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 6);
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
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 56);
function Column(config) {
    _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "Column", 56);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 57);
Column.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 65);
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
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 222);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_defaultId", 235);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 236);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_defaultKey", 246);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 247);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_defaultField", 257);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 258);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_defaultLabel", 268);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 269);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_afterAbbrChange", 279);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 280);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_getClassnames", 381);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 382);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "syncUI", 396);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 397);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_uiSetAbbr", 407);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 408);
this.thNode.set("abbr", val);
    }
});

_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 412);
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
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 423);
function Columnset(config) {
    _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "Columnset", 423);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 424);
Columnset.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 432);
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
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 467);
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
            _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_setDefinitions", 480);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 481);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "initializer", 535);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 538);
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
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 551);
function parseColumns(depth, currentDefinitions, parent) {
            _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "parseColumns", 551);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 552);
var i=0,
                len = currentDefinitions.length,
                currentDefinition,
                column,
                currentChildren;

            // One level down
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 559);
depth++;

            // Create corresponding dom node if not already there for this depth
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 562);
if(!tree[depth]) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 563);
tree[depth] = [];
            }

            // Parse each node at this depth for attributes and any children
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 567);
for(; i<len; ++i) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 568);
currentDefinition = currentDefinitions[i];

                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 570);
currentDefinition = YLang.isString(currentDefinition) ? {key:currentDefinition} : currentDefinition;

                // Instantiate a new Column for each node
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 573);
column = new Y.Column(currentDefinition);

                // Cross-reference Column ID back to the original object literal definition
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 576);
currentDefinition.yuiColumnId = column.get("id");

                // Add the new Column to the hash
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 579);
idHash[column.get("id")] = column;
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 580);
keyHash[column.get("key")] = column;

                // Assign its parent as an attribute, if applicable
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 583);
if(parent) {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 584);
column.parent = parent;
                }

                // The Column has descendants
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 588);
if(YLang.isArray(currentDefinition.children)) {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 589);
currentChildren = currentDefinition.children;
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 590);
column._set("children", currentChildren);

                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 592);
self._setColSpans(column, currentDefinition);

                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 594);
self._cascadePropertiesToChildren(column, currentChildren);

                    // The children themselves must also be parsed for Column instances
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 597);
if(!tree[depth+1]) {
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 598);
tree[depth+1] = [];
                    }
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 600);
parseColumns(depth, currentChildren, column);
                }
                // This Column does not have any children
                else {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 604);
column.keyIndex = keys.length;
                    // Default is already 1
                    //column.colSpan = 1;
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 607);
keys.push(column);
                }

                // Add the Column to the top-down dom tree
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 611);
tree[depth].push(column);
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 613);
depth--;
        }

        // Parse out Column instances from the array of object literals
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 617);
parseColumns(-1, definitions);


        // Save to the Columnset instance
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 621);
this.tree = tree;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 622);
this.idHash = idHash;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 623);
this.keyHash = keyHash;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 624);
this.keys = keys;

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 626);
this._setRowSpans();
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 627);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_cascadePropertiesToChildren", 650);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 652);
var i = 0,
            len = currentChildren.length,
            child;

        // Cascade certain properties to children if not defined on their own
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 657);
for(; i<len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 658);
child = currentChildren[i];
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 659);
if(column.get("className") && (child.className === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 660);
child.className = column.get("className");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 662);
if(column.get("editor") && (child.editor === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 663);
child.editor = column.get("editor");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 665);
if(column.get("formatter") && (child.formatter === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 666);
child.formatter = column.get("formatter");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 668);
if(column.get("resizeable") && (child.resizeable === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 669);
child.resizeable = column.get("resizeable");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 671);
if(column.get("sortable") && (child.sortable === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 672);
child.sortable = column.get("sortable");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 674);
if(column.get("hidden")) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 675);
child.hidden = true;
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 677);
if(column.get("width") && (child.width === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 678);
child.width = column.get("width");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 680);
if(column.get("minWidth") && (child.minWidth === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 681);
child.minWidth = column.get("minWidth");
            }
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 683);
if(column.get("maxAutoWidth") && (child.maxAutoWidth === undefined)) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 684);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_setColSpans", 696);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 698);
var terminalChildNodes = 0;

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 700);
function countTerminalChildNodes(ancestor) {
            _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "countTerminalChildNodes", 700);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 701);
var descendants = ancestor.children,
                i = 0,
                len = descendants.length;

            // Drill down each branch and count terminal nodes
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 706);
for(; i<len; ++i) {
                // Keep drilling down
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 708);
if(YLang.isArray(descendants[i].children)) {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 709);
countTerminalChildNodes(descendants[i]);
                }
                // Reached branch terminus
                else {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 713);
terminalChildNodes++;
                }
            }
        }
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 717);
countTerminalChildNodes(definition);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 718);
column.colSpan = terminalChildNodes;
    },

    /*
    * @method _setRowSpans
    * @description Calculates and sets rowSpan attribute on all Columns.
    * @private
    */
    _setRowSpans: function() {
        // Determine ROWSPAN value for each Column in the DOM tree
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_setRowSpans", 726);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 728);
function parseDomTreeForRowSpan(tree) {
            _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "parseDomTreeForRowSpan", 728);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 729);
var maxRowDepth = 1,
                currentRow,
                currentColumn,
                m,p;

            // Calculate the max depth of descendants for this row
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 735);
function countMaxRowDepth(row, tmpRowDepth) {
                _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "countMaxRowDepth", 735);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 736);
tmpRowDepth = tmpRowDepth || 1;

                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 738);
var i = 0,
                    len = row.length,
                    col;

                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 742);
for(; i<len; ++i) {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 743);
col = row[i];
                    // Column has children, so keep counting
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 745);
if(YLang.isArray(col.children)) {
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 746);
tmpRowDepth++;
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 747);
countMaxRowDepth(col.children, tmpRowDepth);
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 748);
tmpRowDepth--;
                    }
                    // Column has children, so keep counting
                    else {_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 751);
if(col.get && YLang.isArray(col.get("children"))) {
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 752);
tmpRowDepth++;
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 753);
countMaxRowDepth(col.get("children"), tmpRowDepth);
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 754);
tmpRowDepth--;
                    }
                    // No children, is it the max depth?
                    else {
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 758);
if(tmpRowDepth > maxRowDepth) {
                            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 759);
maxRowDepth = tmpRowDepth;
                        }
                    }}
                }
            }

            // Count max row depth for each row
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 766);
for(m=0; m<tree.length; m++) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 767);
currentRow = tree[m];
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 768);
countMaxRowDepth(currentRow);

                // Assign the right ROWSPAN values to each Column in the row
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 771);
for(p=0; p<currentRow.length; p++) {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 772);
currentColumn = currentRow[p];
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 773);
if(!YLang.isArray(currentColumn.get("children"))) {
                        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 774);
currentColumn.rowSpan = maxRowDepth;
                    }
                    // Default is already 1
                    // else currentColumn.rowSpan =1;
                }

                // Reset counter for next row
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 781);
maxRowDepth = 1;
            }
        }
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 784);
parseDomTreeForRowSpan(this.tree);
    },

    /*
    * @method _setHeaders
    * @description Calculates and sets headers attribute on all Columns.
    * @private
    */
    _setHeaders: function() {
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_setHeaders", 792);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 793);
var headers, column,
            allKeys = this.keys,
            i=0, len = allKeys.length;

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 797);
function recurseAncestorsForHeaders(headers, column) {
            _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "recurseAncestorsForHeaders", 797);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 798);
headers.push(column.get("id"));
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 799);
if(column.parent) {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 800);
recurseAncestorsForHeaders(headers, column.parent);
            }
        }
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 803);
for(; i<len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 804);
headers = [];
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 805);
column = allKeys[i];
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 806);
recurseAncestorsForHeaders(headers, column);
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 807);
column.headers = headers.reverse().join(" ");
        }
    },

    //TODO
    getColumn: function() {
    }
});

_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 816);
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
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 866);
function DTBase(config) {
    _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "DTBase", 866);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 867);
DTBase.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 875);
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
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 989);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_setColumnset", 1042);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1043);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_afterColumnsetChange", 1053);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1054);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_setRecordset", 1064);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1065);
if(YLang.isArray(rs)) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1066);
rs = new Y.Recordset({records:rs});
        }

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1069);
rs.addTarget(this);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1070);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_afterRecordsetChange", 1080);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1081);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_afterRecordsChange", 1091);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1092);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_afterSummaryChange", 1102);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1103);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_afterCaptionChange", 1113);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1114);
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
         _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "destructor", 1129);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1130);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "renderUI", 1145);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1147);
this._addTableNode(this.get("contentBox"));

        // COLGROUP
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1150);
this._addColgroupNode(this._tableNode);

        // THEAD
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1153);
this._addTheadNode(this._tableNode);

        // Primary TBODY
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1156);
this._addTbodyNode(this._tableNode);

        // Message TBODY
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1159);
this._addMessageNode(this._tableNode);

        // CAPTION
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1162);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTableNode", 1173);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1174);
if (!this._tableNode) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1175);
this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1177);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addColgroupNode", 1188);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1190);
var len = this.get("columnset").keys.length,
            i = 0,
            allCols = ["<colgroup>"];

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1194);
for(; i<len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1195);
allCols.push(TEMPLATE_COL);
        }

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1198);
allCols.push("</colgroup>");

        // Create COLGROUP
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1201);
this._colgroupNode = tableNode.insertBefore(Ycreate(allCols.join("")), tableNode.get("firstChild"));

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1203);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTheadNode", 1214);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1215);
if(tableNode) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1216);
this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1217);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTbodyNode", 1229);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1230);
this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1231);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addMessageNode", 1242);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1243);
this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1244);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addCaptionNode", 1255);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1256);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "bindUI", 1271);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1272);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "delegate", 1281);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1283);
if(type==="dblclick") {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1284);
this.get("boundingBox").delegate.apply(this.get("boundingBox"), arguments);
        }
        else {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1287);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "syncUI", 1304);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1306);
this._uiSetColumnset(this.get("columnset"));
        // DATA ROWS
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1308);
this._uiSetRecordset(this.get("recordset"));
        // SUMMARY
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1310);
this._uiSetSummary(this.get("summary"));
        // CAPTION
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1312);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_uiSetSummary", 1322);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1323);
val = YisValue(val) ? val : "";
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1324);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_uiSetCaption", 1334);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1335);
var caption = this._captionNode,
            inDoc   = caption.inDoc(),
            method  = val ? (!inDoc && 'prepend') : (inDoc && 'removeChild');

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1339);
caption.setContent(val || '');

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1341);
if (method) {
            // prepend of remove necessary
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1343);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_uiSetColumnset", 1360);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1361);
var tree = cs.tree,
            thead = this._theadNode,
            i = 0,
            len = tree.length,
            parent = thead.get("parentNode"),
            nextSibling = thead.next();
            
        // Move THEAD off DOM
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1369);
thead.remove();
        
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1371);
thead.get("children").remove(true);

        // Iterate tree of columns to add THEAD rows
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1374);
for(; i<len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1375);
this._addTheadTrNode({
                thead:   thead,
                columns: tree[i],
                id     : '' // to avoid {id} leftovers from the trTemplate
            }, (i === 0), (i === len - 1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        // Re-attach THEAD to DOM
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1387);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTheadTrNode", 1400);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1401);
o.tr = this._createTheadTrNode(o, isFirst, isLast);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1402);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_createTheadTrNode", 1416);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1418);
var tr = Ycreate(fromTemplate(this.get("trTemplate"), o)),
            i = 0,
            columns = o.columns,
            len = columns.length,
            column;

         // Set FIRST/LAST class
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1425);
if(isFirst) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1426);
tr.addClass(CLASS_FIRST);
        }
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1428);
if(isLast) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1429);
tr.addClass(CLASS_LAST);
        }

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1432);
for(; i<len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1433);
column = columns[i];
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1434);
this._addTheadThNode({value:column.get("label"), column: column, tr:tr});
        }

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1437);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_attachTheadTrNode", 1447);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1448);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTheadThNode", 1458);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1459);
o.th = this._createTheadThNode(o);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1460);
this._attachTheadThNode(o);
        //TODO: assign all node pointers: thNode, thLinerNode, thLabelNode
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1462);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_createTheadThNode", 1473);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1474);
var column = o.column;
        
        // Populate template object
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1477);
o.id = column.get("id");//TODO: validate 1 column ID per document
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1478);
o.colspan = column.colSpan;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1479);
o.rowspan = column.rowSpan;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1480);
o.abbr = column.get("abbr");
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1481);
o.classnames = column.get("classnames");
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1482);
o.value = fromTemplate(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1491);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_attachTheadThNode", 1501);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1502);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_uiSetRecordset", 1517);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1518);
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
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1529);
oldTbody.remove();
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1530);
oldTbody = null;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1531);
newTbody = this._addTbodyNode(this._tableNode);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1532);
newTbody.remove();
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1533);
this._tbodyNode = newTbody;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1534);
o.tbody = newTbody;

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1536);
o.rowTemplate = this.get('trTemplate');
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1537);
o.columns = [];

        // Build up column data to avoid passing through Attribute APIs inside
        // render loops for rows and cells
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1541);
for (i = columns.length - 1; i >= 0; --i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1542);
column = columns[i];
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1543);
o.columns[i] = {
                column        : column,
                fields        : column.get('field'),
                classnames    : column.get('classnames'),
                emptyCellValue: column.get('emptyCellValue')
            }

            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1550);
formatter = column.get('formatter');

            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1552);
if (YLang.isFunction(formatter)) {
                // function formatters need to run before checking if the value
                // needs defaulting from column.emptyCellValue
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1555);
formatter = Y.bind(this._functionFormatter, this, formatter);
            } else {
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1557);
if (!YLang.isString(formatter)) {
                    _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1558);
formatter = cellValueTemplate;
                }

                // string formatters need the value defaulted before processing
                _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1562);
formatter = Y.bind(this._templateFormatter, this, formatter);
            }

            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1565);
o.columns[i].formatter = formatter;
        }


        // Iterate Recordset to use existing TR when possible or add new TR
        // TODO i = this.get("state.offsetIndex")
        // TODO len =this.get("state.pageLength")
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1572);
for (i = 0, len = rs.size(); i < len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1573);
o.record = rs.item(i);
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1574);
o.data   = o.record.get("data");
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1575);
o.rowindex = i;
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1576);
this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
        
        // TBODY to DOM
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1580);
parent.insert(this._tbodyNode, nextSibling);
    },

    _functionFormatter: function (formatter, o) {
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_functionFormatter", 1583);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1584);
var value = formatter.call(this, o);

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1586);
return (value !== undefined) ? value : o.emptyCellValue;
    },

    _templateFormatter: function (template, o) {
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_templateFormatter", 1589);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1590);
if (o.value === undefined) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1591);
o.value = o.emptyCellValue;
        }

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1594);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTbodyTrNode", 1604);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1605);
var row = o.tbody.one("#" + o.record.get("id"));

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1607);
o.tr = row || this._createTbodyTrNode(o);

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1609);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_createTbodyTrNode", 1620);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1621);
var columns = o.columns,
            i, len, columnInfo;

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1624);
o.tr = Ycreate(fromTemplate(o.rowTemplate, { id: o.record.get('id') }));
        
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1626);
for (i = 0, len = columns.length; i < len; ++i) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1627);
columnInfo      = columns[i];
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1628);
o.column        = columnInfo.column;
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1629);
o.field         = columnInfo.fields;
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1630);
o.classnames    = columnInfo.classnames;
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1631);
o.formatter     = columnInfo.formatter;
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1632);
o.emptyCellValue= columnInfo.emptyCellValue;

            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1634);
this._addTbodyTdNode(o);
        }
        
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1637);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_attachTbodyTrNode", 1647);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1648);
var tbody = o.tbody,
            tr = o.tr,
            index = o.rowindex,
            nextSibling = tbody.get("children").item(index) || null,
            isOdd = (index % 2);
            
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1654);
if(isOdd) {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1655);
tr.replaceClass(CLASS_EVEN, CLASS_ODD);
        } else {
            _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1657);
tr.replaceClass(CLASS_ODD, CLASS_EVEN);
        }
        
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1660);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_addTbodyTdNode", 1670);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1671);
o.td = this._createTbodyTdNode(o);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1672);
this._attachTbodyTdNode(o);
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1673);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "createCell", 1688);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1689);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_createTbodyTdNode", 1701);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1702);
o.headers = o.column.headers;
        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1703);
o.value   = this.formatDataCell(o);

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1705);
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
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_attachTbodyTdNode", 1715);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1716);
o.tr.appendChild(o.td);
    },

    /*
     * Returns markup to insert into data cell element.
     *
     * @method formatDataCell
     * @param @param o {Object} {record, column, tr, headers, classnames}.
     */
    formatDataCell: function (o) {
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "formatDataCell", 1725);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1726);
o.value = o.data[o.field];

        _yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1728);
return o.formatter.call(this, o);
    },

    _initRecordset: function () {
        _yuitest_coverfunc("/build/datatable-base-deprecated/datatable-base-deprecated.js", "_initRecordset", 1731);
_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1732);
return new Y.Recordset({ records: [] });
    }
});

_yuitest_coverline("/build/datatable-base-deprecated/datatable-base-deprecated.js", 1736);
Y.namespace("DataTable").Base = DTBase;


}, '3.7.3' ,{requires:['recordset-base','widget','substitute','event-mouseenter']});
