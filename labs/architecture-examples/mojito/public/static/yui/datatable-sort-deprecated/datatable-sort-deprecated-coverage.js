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
_yuitest_coverage["/build/datatable-sort-deprecated/datatable-sort-deprecated.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/datatable-sort-deprecated/datatable-sort-deprecated.js",
    code: []
};
_yuitest_coverage["/build/datatable-sort-deprecated/datatable-sort-deprecated.js"].code=["YUI.add('datatable-sort-deprecated', function(Y) {","","// API Doc comments disabled to avoid deprecated class leakage into","// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the","// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.","/**","Plugs DataTable with sorting functionality.","","DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module","is designed to work with `datatable-base-deprecated` (effectively the 3.4.1","version of DataTable) and will be removed from the library in a future version.","","See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the","latest version.","","For complete API docs for the classes in this and other deprecated","DataTable-related modules, refer to the static API doc files in the 3.4.1","download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip","","@module datatable-deprecated","@submodule datatable-sort-deprecated","@deprecated","**/","","/*"," * Adds column sorting to DataTable."," * @class DataTableSort"," * @extends Plugin.Base"," */","var YgetClassName = Y.ClassNameManager.getClassName,","","    DATATABLE = \"datatable\",","    COLUMN = \"column\",","    ASC = \"asc\",","    DESC = \"desc\",","","    //TODO: Don't use hrefs - use tab/arrow/enter","    TEMPLATE = '<a class=\"{link_class}\" title=\"{link_title}\" href=\"{link_href}\">{value}</a>';","","","function DataTableSort() {","    DataTableSort.superclass.constructor.apply(this, arguments);","}","","/////////////////////////////////////////////////////////////////////////////","//","// STATIC PROPERTIES","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(DataTableSort, {","    /*","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"sort\"","     */","    NS: \"sort\",","","    /*","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataTableSort\"","     */","    NAME: \"dataTableSort\",","","/////////////////////////////////////////////////////////////////////////////","//","// ATTRIBUTES","//","/////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /*","        * @attribute trigger","        * @description Defines the trigger that causes a column to be sorted:","        * {event, selector}, where \"event\" is an event type and \"selector\" is","        * is a node query selector.","        * @type Object","        * @default {event:\"click\", selector:\"th\"}","        * @writeOnce \"initOnly\"","        */","        trigger: {","            value: {event:\"click\", selector:\"th\"},","            writeOnce: \"initOnly\"","        },","        ","        /*","        * @attribute lastSortedBy","        * @description Describes last known sort state: {key,dir}, where","        * \"key\" is column key and \"dir\" is either \"asc\" or \"desc\".","        * @type Object","        */","        lastSortedBy: {","            setter: \"_setLastSortedBy\",","            lazyAdd: false","        },","        ","        /*","        * @attribute template","        * @description Tokenized markup template for TH sort element.","        * @type String","        * @default '<a class=\"{link_class}\" title=\"{link_title}\" href=\"{link_href}\">{value}</a>'","        */","        template: {","            value: TEMPLATE","        },","","        /*","         * Strings used in the UI elements.","         *","         * The strings used are defaulted from the datatable-sort language pack","         * for the language identified in the YUI \"lang\" configuration (which","         * defaults to \"en\").","         *","         * Configurable strings are \"sortBy\" and \"reverseSortBy\", which are","         * assigned to the sort link's title attribute.","         *","         * @attribute strings","         * @type {Object}","         */","        strings: {","            valueFn: function () { return Y.Intl.get('datatable-sort-deprecated'); }","        }","    }","});","","/////////////////////////////////////////////////////////////////////////////","//","// PROTOTYPE","//","/////////////////////////////////////////////////////////////////////////////","Y.extend(DataTableSort, Y.Plugin.Base, {","","    /////////////////////////////////////////////////////////////////////////////","    //","    // METHODS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * Initializer.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        var dt = this.get(\"host\"),","            trigger = this.get(\"trigger\");","            ","        dt.get(\"recordset\").plug(Y.Plugin.RecordsetSort, {dt: dt});","        dt.get(\"recordset\").sort.addTarget(dt);","        ","        // Wrap link around TH value","        this.doBefore(\"_createTheadThNode\", this._beforeCreateTheadThNode);","        ","        // Add class","        this.doBefore(\"_attachTheadThNode\", this._beforeAttachTheadThNode);","        this.doBefore(\"_attachTbodyTdNode\", this._beforeAttachTbodyTdNode);","","        // Attach trigger handlers","        dt.delegate(trigger.event, Y.bind(this._onEventSortColumn,this), trigger.selector);","","        // Attach UI hooks","        dt.after(\"recordsetSort:sort\", function() {","            this._uiSetRecordset(this.get(\"recordset\"));","        });","        this.on(\"lastSortedByChange\", function(e) {","            this._uiSetLastSortedBy(e.prevVal, e.newVal, dt);","        });","","        //TODO","        //dt.after(\"recordset:mutation\", function() {//reset lastSortedBy});","        ","        //TODO","        //add Column sortFn ATTR","        ","        // Update UI after the fact (render-then-plug case)","        if(dt.get(\"rendered\")) {","            dt._uiSetColumnset(dt.get(\"columnset\"));","            this._uiSetLastSortedBy(null, this.get(\"lastSortedBy\"), dt);","        }","    },","","    /*","    * @method _setLastSortedBy","    * @description Normalizes lastSortedBy","    * @param val {String | Object} {key, dir} or \"key\"","    * @return {key, dir, notdir}","    * @private","    */","    _setLastSortedBy: function(val) {","        if (Y.Lang.isString(val)) {","            val = { key: val, dir: \"desc\" };","        }","","        if (val) {","            return (val.dir === \"desc\") ?","                { key: val.key, dir: \"desc\", notdir: \"asc\" } :","                { key: val.key, dir: \"asc\",  notdir:\"desc\" };","        } else {","            return null;","        }","    },","","    /*","     * Updates sort UI.","     *","     * @method _uiSetLastSortedBy","     * @param val {Object} New lastSortedBy object {key,dir}.","     * @param dt {Y.DataTable.Base} Host.","     * @protected","     */","    _uiSetLastSortedBy: function(prevVal, newVal, dt) {","        var strings    = this.get('strings'),","            columnset  = dt.get(\"columnset\"),","            prevKey    = prevVal && prevVal.key,","            newKey     = newVal && newVal.key,","            prevClass  = prevVal && dt.getClassName(prevVal.dir),","            newClass   = newVal && dt.getClassName(newVal.dir),","            prevColumn = columnset.keyHash[prevKey],","            newColumn  = columnset.keyHash[newKey],","            tbodyNode  = dt._tbodyNode,","            fromTemplate = Y.Lang.sub,","            th, sortArrow, sortLabel;","","        // Clear previous UI","        if (prevColumn && prevClass) {","            th = prevColumn.thNode;","            sortArrow = th.one('a');","","            if (sortArrow) {","                sortArrow.set('title', fromTemplate(strings.sortBy, {","                    column: prevColumn.get('label')","                }));","            }","","            th.removeClass(prevClass);","            tbodyNode.all(\".\" + YgetClassName(COLUMN, prevColumn.get(\"id\")))","                .removeClass(prevClass);","        }","","        // Add new sort UI","        if (newColumn && newClass) {","            th = newColumn.thNode;","            sortArrow = th.one('a');","","            if (sortArrow) {","                sortLabel = (newVal.dir === ASC) ? \"reverseSortBy\" : \"sortBy\";","","                sortArrow.set('title', fromTemplate(strings[sortLabel], {","                    column: newColumn.get('label')","                }));","            }","","            th.addClass(newClass);","","            tbodyNode.all(\".\" + YgetClassName(COLUMN, newColumn.get(\"id\")))","                .addClass(newClass);","        }","    },","","    /*","    * Before header cell element is created, inserts link markup around {value}.","    *","    * @method _beforeCreateTheadThNode","    * @param o {Object} {value, column, tr}.","    * @protected","    */","    _beforeCreateTheadThNode: function(o) {","        var sortedBy, sortLabel;","","        if (o.column.get(\"sortable\")) {","            sortedBy = this.get('lastSortedBy');","","            sortLabel = (sortedBy && sortedBy.dir === ASC &&","                         sortedBy.key === o.column.get('key')) ?","                            \"reverseSortBy\" : \"sortBy\";","","            o.value = Y.Lang.sub(this.get(\"template\"), {","                link_class: o.link_class || \"\",","                link_title: Y.Lang.sub(this.get('strings.' + sortLabel), {","                                column: o.column.get('label')","                            }),","                link_href: \"#\",","                value: o.value","            });","        }","    },","","    /*","    * Before header cell element is attached, sets applicable class names.","    *","    * @method _beforeAttachTheadThNode","    * @param o {Object} {value, column, tr}.","    * @protected","    */","    _beforeAttachTheadThNode: function(o) {","        var lastSortedBy = this.get(\"lastSortedBy\"),","            key = lastSortedBy && lastSortedBy.key,","            dir = lastSortedBy && lastSortedBy.dir,","            notdir = lastSortedBy && lastSortedBy.notdir;","","        // This Column is sortable","        if(o.column.get(\"sortable\")) {","            o.th.addClass(YgetClassName(DATATABLE, \"sortable\"));","        }","        // This Column is currently sorted","        if(key && (key === o.column.get(\"key\"))) {","            o.th.replaceClass(YgetClassName(DATATABLE, notdir), YgetClassName(DATATABLE, dir));","        }","    },","","    /*","    * Before header cell element is attached, sets applicable class names.","    *","    * @method _beforeAttachTbodyTdNode","    * @param o {Object} {record, column, tr, headers, classnames, value}.","    * @protected","    */","    _beforeAttachTbodyTdNode: function(o) {","        var lastSortedBy = this.get(\"lastSortedBy\"),","            key = lastSortedBy && lastSortedBy.key,","            dir = lastSortedBy && lastSortedBy.dir,","            notdir = lastSortedBy && lastSortedBy.notdir;","","        // This Column is sortable","        if(o.column.get(\"sortable\")) {","            o.td.addClass(YgetClassName(DATATABLE, \"sortable\"));","        }","        // This Column is currently sorted","        if(key && (key === o.column.get(\"key\"))) {","            o.td.replaceClass(YgetClassName(DATATABLE, notdir), YgetClassName(DATATABLE, dir));","        }","    },","    /*","    * In response to the \"trigger\" event, sorts the underlying Recordset and","    * updates the lastSortedBy attribute.","    *","    * @method _onEventSortColumn","    * @param o {Object} {value, column, tr}.","    * @protected","    */","    _onEventSortColumn: function(e) {","        e.halt();","        //TODO: normalize e.currentTarget to TH","        var table  = this.get(\"host\"),","            column = table.get(\"columnset\").idHash[e.currentTarget.get(\"id\")],","            key, field, lastSort, desc, sorter;","","        if (column.get(\"sortable\")) {","            key       = column.get(\"key\");","            field     = column.get(\"field\");","            lastSort  = this.get(\"lastSortedBy\") || {};","            desc      = (lastSort.key === key && lastSort.dir === ASC);","            sorter    = column.get(\"sortFn\");","","            table.get(\"recordset\").sort.sort(field, desc, sorter);","","            this.set(\"lastSortedBy\", {","                key: key,","                dir: (desc) ? DESC : ASC","            });","        }","    }","});","","Y.namespace(\"Plugin\").DataTableSort = DataTableSort;","","","","","","}, '3.7.3' ,{requires:['datatable-base-deprecated','plugin','recordset-sort'], lang:['en']});"];
_yuitest_coverage["/build/datatable-sort-deprecated/datatable-sort-deprecated.js"].lines = {"1":0,"30":0,"41":0,"42":0,"50":0,"129":0,"139":0,"154":0,"157":0,"158":0,"161":0,"164":0,"165":0,"168":0,"171":0,"172":0,"174":0,"175":0,"185":0,"186":0,"187":0,"199":0,"200":0,"203":0,"204":0,"208":0,"221":0,"234":0,"235":0,"236":0,"238":0,"239":0,"244":0,"245":0,"250":0,"251":0,"252":0,"254":0,"255":0,"257":0,"262":0,"264":0,"277":0,"279":0,"280":0,"282":0,"286":0,"305":0,"311":0,"312":0,"315":0,"316":0,"328":0,"334":0,"335":0,"338":0,"339":0,"351":0,"353":0,"357":0,"358":0,"359":0,"360":0,"361":0,"362":0,"364":0,"366":0,"374":0};
_yuitest_coverage["/build/datatable-sort-deprecated/datatable-sort-deprecated.js"].functions = {"DataTableSort:41":0,"valueFn:129":0,"(anonymous 2):171":0,"(anonymous 3):174":0,"initializer:153":0,"_setLastSortedBy:198":0,"_uiSetLastSortedBy:220":0,"_beforeCreateTheadThNode:276":0,"_beforeAttachTheadThNode:304":0,"_beforeAttachTbodyTdNode:327":0,"_onEventSortColumn:350":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/datatable-sort-deprecated/datatable-sort-deprecated.js"].coveredLines = 68;
_yuitest_coverage["/build/datatable-sort-deprecated/datatable-sort-deprecated.js"].coveredFunctions = 12;
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 1);
YUI.add('datatable-sort-deprecated', function(Y) {

// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/**
Plugs DataTable with sorting functionality.

DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module
is designed to work with `datatable-base-deprecated` (effectively the 3.4.1
version of DataTable) and will be removed from the library in a future version.

See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the
latest version.

For complete API docs for the classes in this and other deprecated
DataTable-related modules, refer to the static API doc files in the 3.4.1
download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip

@module datatable-deprecated
@submodule datatable-sort-deprecated
@deprecated
**/

/*
 * Adds column sorting to DataTable.
 * @class DataTableSort
 * @extends Plugin.Base
 */
_yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 30);
var YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column",
    ASC = "asc",
    DESC = "desc",

    //TODO: Don't use hrefs - use tab/arrow/enter
    TEMPLATE = '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>';


_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 41);
function DataTableSort() {
    _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "DataTableSort", 41);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 42);
DataTableSort.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 50);
Y.mix(DataTableSort, {
    /*
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "sort"
     */
    NS: "sort",

    /*
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTableSort"
     */
    NAME: "dataTableSort",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /*
        * @attribute trigger
        * @description Defines the trigger that causes a column to be sorted:
        * {event, selector}, where "event" is an event type and "selector" is
        * is a node query selector.
        * @type Object
        * @default {event:"click", selector:"th"}
        * @writeOnce "initOnly"
        */
        trigger: {
            value: {event:"click", selector:"th"},
            writeOnce: "initOnly"
        },
        
        /*
        * @attribute lastSortedBy
        * @description Describes last known sort state: {key,dir}, where
        * "key" is column key and "dir" is either "asc" or "desc".
        * @type Object
        */
        lastSortedBy: {
            setter: "_setLastSortedBy",
            lazyAdd: false
        },
        
        /*
        * @attribute template
        * @description Tokenized markup template for TH sort element.
        * @type String
        * @default '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>'
        */
        template: {
            value: TEMPLATE
        },

        /*
         * Strings used in the UI elements.
         *
         * The strings used are defaulted from the datatable-sort language pack
         * for the language identified in the YUI "lang" configuration (which
         * defaults to "en").
         *
         * Configurable strings are "sortBy" and "reverseSortBy", which are
         * assigned to the sort link's title attribute.
         *
         * @attribute strings
         * @type {Object}
         */
        strings: {
            valueFn: function () { _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "valueFn", 129);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 129);
return Y.Intl.get('datatable-sort-deprecated'); }
        }
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 139);
Y.extend(DataTableSort, Y.Plugin.Base, {

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
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "initializer", 153);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 154);
var dt = this.get("host"),
            trigger = this.get("trigger");
            
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 157);
dt.get("recordset").plug(Y.Plugin.RecordsetSort, {dt: dt});
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 158);
dt.get("recordset").sort.addTarget(dt);
        
        // Wrap link around TH value
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 161);
this.doBefore("_createTheadThNode", this._beforeCreateTheadThNode);
        
        // Add class
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 164);
this.doBefore("_attachTheadThNode", this._beforeAttachTheadThNode);
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 165);
this.doBefore("_attachTbodyTdNode", this._beforeAttachTbodyTdNode);

        // Attach trigger handlers
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 168);
dt.delegate(trigger.event, Y.bind(this._onEventSortColumn,this), trigger.selector);

        // Attach UI hooks
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 171);
dt.after("recordsetSort:sort", function() {
            _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "(anonymous 2)", 171);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 172);
this._uiSetRecordset(this.get("recordset"));
        });
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 174);
this.on("lastSortedByChange", function(e) {
            _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "(anonymous 3)", 174);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 175);
this._uiSetLastSortedBy(e.prevVal, e.newVal, dt);
        });

        //TODO
        //dt.after("recordset:mutation", function() {//reset lastSortedBy});
        
        //TODO
        //add Column sortFn ATTR
        
        // Update UI after the fact (render-then-plug case)
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 185);
if(dt.get("rendered")) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 186);
dt._uiSetColumnset(dt.get("columnset"));
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 187);
this._uiSetLastSortedBy(null, this.get("lastSortedBy"), dt);
        }
    },

    /*
    * @method _setLastSortedBy
    * @description Normalizes lastSortedBy
    * @param val {String | Object} {key, dir} or "key"
    * @return {key, dir, notdir}
    * @private
    */
    _setLastSortedBy: function(val) {
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "_setLastSortedBy", 198);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 199);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 200);
val = { key: val, dir: "desc" };
        }

        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 203);
if (val) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 204);
return (val.dir === "desc") ?
                { key: val.key, dir: "desc", notdir: "asc" } :
                { key: val.key, dir: "asc",  notdir:"desc" };
        } else {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 208);
return null;
        }
    },

    /*
     * Updates sort UI.
     *
     * @method _uiSetLastSortedBy
     * @param val {Object} New lastSortedBy object {key,dir}.
     * @param dt {Y.DataTable.Base} Host.
     * @protected
     */
    _uiSetLastSortedBy: function(prevVal, newVal, dt) {
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "_uiSetLastSortedBy", 220);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 221);
var strings    = this.get('strings'),
            columnset  = dt.get("columnset"),
            prevKey    = prevVal && prevVal.key,
            newKey     = newVal && newVal.key,
            prevClass  = prevVal && dt.getClassName(prevVal.dir),
            newClass   = newVal && dt.getClassName(newVal.dir),
            prevColumn = columnset.keyHash[prevKey],
            newColumn  = columnset.keyHash[newKey],
            tbodyNode  = dt._tbodyNode,
            fromTemplate = Y.Lang.sub,
            th, sortArrow, sortLabel;

        // Clear previous UI
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 234);
if (prevColumn && prevClass) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 235);
th = prevColumn.thNode;
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 236);
sortArrow = th.one('a');

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 238);
if (sortArrow) {
                _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 239);
sortArrow.set('title', fromTemplate(strings.sortBy, {
                    column: prevColumn.get('label')
                }));
            }

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 244);
th.removeClass(prevClass);
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 245);
tbodyNode.all("." + YgetClassName(COLUMN, prevColumn.get("id")))
                .removeClass(prevClass);
        }

        // Add new sort UI
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 250);
if (newColumn && newClass) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 251);
th = newColumn.thNode;
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 252);
sortArrow = th.one('a');

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 254);
if (sortArrow) {
                _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 255);
sortLabel = (newVal.dir === ASC) ? "reverseSortBy" : "sortBy";

                _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 257);
sortArrow.set('title', fromTemplate(strings[sortLabel], {
                    column: newColumn.get('label')
                }));
            }

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 262);
th.addClass(newClass);

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 264);
tbodyNode.all("." + YgetClassName(COLUMN, newColumn.get("id")))
                .addClass(newClass);
        }
    },

    /*
    * Before header cell element is created, inserts link markup around {value}.
    *
    * @method _beforeCreateTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _beforeCreateTheadThNode: function(o) {
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "_beforeCreateTheadThNode", 276);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 277);
var sortedBy, sortLabel;

        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 279);
if (o.column.get("sortable")) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 280);
sortedBy = this.get('lastSortedBy');

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 282);
sortLabel = (sortedBy && sortedBy.dir === ASC &&
                         sortedBy.key === o.column.get('key')) ?
                            "reverseSortBy" : "sortBy";

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 286);
o.value = Y.Lang.sub(this.get("template"), {
                link_class: o.link_class || "",
                link_title: Y.Lang.sub(this.get('strings.' + sortLabel), {
                                column: o.column.get('label')
                            }),
                link_href: "#",
                value: o.value
            });
        }
    },

    /*
    * Before header cell element is attached, sets applicable class names.
    *
    * @method _beforeAttachTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _beforeAttachTheadThNode: function(o) {
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "_beforeAttachTheadThNode", 304);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 305);
var lastSortedBy = this.get("lastSortedBy"),
            key = lastSortedBy && lastSortedBy.key,
            dir = lastSortedBy && lastSortedBy.dir,
            notdir = lastSortedBy && lastSortedBy.notdir;

        // This Column is sortable
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 311);
if(o.column.get("sortable")) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 312);
o.th.addClass(YgetClassName(DATATABLE, "sortable"));
        }
        // This Column is currently sorted
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 315);
if(key && (key === o.column.get("key"))) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 316);
o.th.replaceClass(YgetClassName(DATATABLE, notdir), YgetClassName(DATATABLE, dir));
        }
    },

    /*
    * Before header cell element is attached, sets applicable class names.
    *
    * @method _beforeAttachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _beforeAttachTbodyTdNode: function(o) {
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "_beforeAttachTbodyTdNode", 327);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 328);
var lastSortedBy = this.get("lastSortedBy"),
            key = lastSortedBy && lastSortedBy.key,
            dir = lastSortedBy && lastSortedBy.dir,
            notdir = lastSortedBy && lastSortedBy.notdir;

        // This Column is sortable
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 334);
if(o.column.get("sortable")) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 335);
o.td.addClass(YgetClassName(DATATABLE, "sortable"));
        }
        // This Column is currently sorted
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 338);
if(key && (key === o.column.get("key"))) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 339);
o.td.replaceClass(YgetClassName(DATATABLE, notdir), YgetClassName(DATATABLE, dir));
        }
    },
    /*
    * In response to the "trigger" event, sorts the underlying Recordset and
    * updates the lastSortedBy attribute.
    *
    * @method _onEventSortColumn
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _onEventSortColumn: function(e) {
        _yuitest_coverfunc("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", "_onEventSortColumn", 350);
_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 351);
e.halt();
        //TODO: normalize e.currentTarget to TH
        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 353);
var table  = this.get("host"),
            column = table.get("columnset").idHash[e.currentTarget.get("id")],
            key, field, lastSort, desc, sorter;

        _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 357);
if (column.get("sortable")) {
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 358);
key       = column.get("key");
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 359);
field     = column.get("field");
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 360);
lastSort  = this.get("lastSortedBy") || {};
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 361);
desc      = (lastSort.key === key && lastSort.dir === ASC);
            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 362);
sorter    = column.get("sortFn");

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 364);
table.get("recordset").sort.sort(field, desc, sorter);

            _yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 366);
this.set("lastSortedBy", {
                key: key,
                dir: (desc) ? DESC : ASC
            });
        }
    }
});

_yuitest_coverline("/build/datatable-sort-deprecated/datatable-sort-deprecated.js", 374);
Y.namespace("Plugin").DataTableSort = DataTableSort;





}, '3.7.3' ,{requires:['datatable-base-deprecated','plugin','recordset-sort'], lang:['en']});
