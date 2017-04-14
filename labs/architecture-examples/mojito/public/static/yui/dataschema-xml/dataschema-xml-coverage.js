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
_yuitest_coverage["build/dataschema-xml/dataschema-xml.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dataschema-xml/dataschema-xml.js",
    code: []
};
_yuitest_coverage["build/dataschema-xml/dataschema-xml.js"].code=["YUI.add('dataschema-xml', function (Y, NAME) {","","/**","Provides a DataSchema implementation which can be used to work with XML data.","","@module dataschema","@submodule dataschema-xml","**/","","/**","Provides a DataSchema implementation which can be used to work with XML data.","","See the `apply` method for usage.","","@class DataSchema.XML","@extends DataSchema.Base","@static","**/","var Lang = Y.Lang,","","    okNodeType = {","        1 : true,","        9 : true,","        11: true","    },","","    SchemaXML;","","SchemaXML = {","","    ////////////////////////////////////////////////////////////////////////////","    //","    // DataSchema.XML static methods","    //","    ////////////////////////////////////////////////////////////////////////////","    /**","    Applies a schema to an XML data tree, returning a normalized object with","    results in the `results` property. Additional information can be parsed out","    of the XML for inclusion in the `meta` property of the response object.  If","    an error is encountered during processing, an `error` property will be","    added.","","    Field data in the nodes captured by the XPath in _schema.resultListLocator_","    is extracted with the field identifiers described in _schema.resultFields_.","    Field identifiers are objects with the following properties:","","      * `key`    : <strong>(required)</strong> The desired property name to use","            store the retrieved value in the result object.  If `locator` is","            not specified, `key` is also used as the XPath locator (String)","      * `locator`: The XPath locator to the node or attribute within each","            result node found by _schema.resultListLocator_ containing the","            desired field data (String)","      * `parser` : A function or the name of a function on `Y.Parsers` used","            to convert the input value into a normalized type.  Parser","            functions are passed the value as input and are expected to","            return a value.","      * `schema` : Used to retrieve nested field data into an array for","            assignment as the result field value.  This object follows the same","            conventions as _schema_.","","    If no value parsing or nested parsing is needed, you can use XPath locators","    (strings) instead of field identifiers (objects) -- see example below.","","    `response.results` will contain an array of objects with key:value pairs.","    The keys are the field identifier `key`s, and the values are the data","    values extracted from the nodes or attributes found by the field `locator`","    (or `key` fallback).","    ","    To extract additional information from the XML, include an array of","    XPath locators in _schema.metaFields_.  The collected values will be","    stored in `response.meta` with the XPath locator as keys.","","    @example","        var schema = {","                resultListLocator: '//produce/item',","                resultFields: [","                    {","                        locator: 'name',","                        key: 'name'","                    },","                    {","                        locator: 'color',","                        key: 'color',","                        parser: function (val) { return val.toUpperCase(); }","                    }","                ]","            };","","        // Assumes data like","        // <inventory>","        //   <produce>","        //     <item><name>Banana</name><color>yellow</color></item>","        //     <item><name>Orange</name><color>orange</color></item>","        //     <item><name>Eggplant</name><color>purple</color></item>","        //   </produce>","        // </inventory>","","        var response = Y.DataSchema.JSON.apply(schema, data);","","        // response.results[0] is { name: \"Banana\", color: \"YELLOW\" }","     ","    @method apply","    @param {Object} schema Schema to apply.  Supported configuration","        properties are:","      @param {String} [schema.resultListLocator] XPath locator for the","          XML nodes that contain the data to flatten into `response.results`","      @param {Array} [schema.resultFields] Field identifiers to","          locate/assign values in the response records. See above for","          details.","      @param {Array} [schema.metaFields] XPath locators to extract extra","          non-record related information from the XML data","    @param {XMLDoc} data XML data to parse","    @return {Object} An Object with properties `results` and `meta`","    @static","    **/","    apply: function(schema, data) {","        var xmldoc = data, // unnecessary variables","            data_out = { results: [], meta: {} };","","        if (xmldoc && okNodeType[xmldoc.nodeType] && schema) {","            // Parse results data","            data_out = SchemaXML._parseResults(schema, xmldoc, data_out);","","            // Parse meta data","            data_out = SchemaXML._parseMeta(schema.metaFields, xmldoc, data_out);","        } else {","            data_out.error = new Error(\"XML schema parse failure\");","        }","","        return data_out;","    },","","    /**","     * Get an XPath-specified value for a given field from an XML node or document.","     *","     * @method _getLocationValue","     * @param field {String | Object} Field definition.","     * @param context {Object} XML node or document to search within.","     * @return {Object} Data value or null.","     * @static","     * @protected","     */","    _getLocationValue: function(field, context) {","        var locator = field.locator || field.key || field,","            xmldoc = context.ownerDocument || context,","            result, res, value = null;","","        try {","            result = SchemaXML._getXPathResult(locator, context, xmldoc);","            while ((res = result.iterateNext())) {","                value = res.textContent || res.value || res.text || res.innerHTML || res.innerText || null;","            }","","            // FIXME: Why defer to a method that is mixed into this object?","            // DSchema.Base is mixed into DSchema.XML (et al), so","            // DSchema.XML.parse(...) will work.  This supports the use case","            // where DSchema.Base.parse is changed, and that change is then","            // seen by all DSchema.* implementations, but does not support the","            // case where redefining DSchema.XML.parse changes behavior. In","            // fact, DSchema.XML.parse is never even called.","            return Y.DataSchema.Base.parse.call(this, value, field);","        } catch (e) {","        }","","        return null;","    },","","    /**","     * Fetches the XPath-specified result for a given location in an XML node","     * or document.","     * ","     * @method _getXPathResult","     * @param locator {String} The XPath location.","     * @param context {Object} XML node or document to search within.","     * @param xmldoc {Object} XML document to resolve namespace.","     * @return {Object} Data collection or null.","     * @static","     * @protected","     */","    _getXPathResult: function(locator, context, xmldoc) {","        // Standards mode","        if (! Lang.isUndefined(xmldoc.evaluate)) {","            return xmldoc.evaluate(locator, context, xmldoc.createNSResolver(context.ownerDocument ? context.ownerDocument.documentElement : context.documentElement), 0, null);","          ","        }","        // IE mode","        else {","            var values=[], locatorArray = locator.split(/\\b\\/\\b/), i=0, l=locatorArray.length, location, subloc, m, isNth;","            ","            // XPath is supported","            try {","                // this fixes the IE 5.5+ issue where childnode selectors begin at 0 instead of 1","                try {","                   xmldoc.setProperty(\"SelectionLanguage\", \"XPath\");","                } catch (e) {}","                ","                values = context.selectNodes(locator);","            }","            // Fallback for DOM nodes and fragments","            catch (e) {","                // Iterate over each locator piece","                for (; i<l && context; i++) {","                    location = locatorArray[i];","","                    // grab nth child []","                    if ((location.indexOf(\"[\") > -1) && (location.indexOf(\"]\") > -1)) {","                        subloc = location.slice(location.indexOf(\"[\")+1, location.indexOf(\"]\"));","                        //XPath is 1-based while DOM is 0-based","                        subloc--;","                        context = context.children[subloc];","                        isNth = true;","                    }","                    // grab attribute value @","                    else if (location.indexOf(\"@\") > -1) {","                        subloc = location.substr(location.indexOf(\"@\"));","                        context = subloc ? context.getAttribute(subloc.replace('@', '')) : context;","                    }","                    // grab that last instance of tagName","                    else if (-1 < location.indexOf(\"//\")) {","                        subloc = context.getElementsByTagName(location.substr(2));","                        context = subloc.length ? subloc[subloc.length - 1] : null;","                    }","                    // find the last matching location in children","                    else if (l != i + 1) {","                        for (m=context.childNodes.length-1; 0 <= m; m-=1) {","                            if (location === context.childNodes[m].tagName) {","                                context = context.childNodes[m];","                                m = -1;","                            }","                        }","                    }","                }","                ","                if (context) {","                    // attribute","                    if (Lang.isString(context)) {","                        values[0] = {value: context};","                    }","                    // nth child","                    else if (isNth) {","                        values[0] = {value: context.innerHTML};","                    }","                    // all children","                    else {","                        values = Y.Array(context.childNodes, 0, true);","                    }","                }","            }","","            // returning a mock-standard object for IE","            return {","                index: 0,","                ","                iterateNext: function() {","                    if (this.index >= this.values.length) {return undefined;}","                    var result = this.values[this.index];","                    this.index += 1;","                    return result;","                },","","                values: values","            };","        }","    },","","    /**","     * Schema-parsed result field.","     *","     * @method _parseField","     * @param field {String | Object} Required. Field definition.","     * @param result {Object} Required. Schema parsed data object.","     * @param context {Object} Required. XML node or document to search within.","     * @static","     * @protected","     */","    _parseField: function(field, result, context) {","        var key = field.key || field,","            parsed;","","        if (field.schema) {","            parsed = { results: [], meta: {} };","            parsed = SchemaXML._parseResults(field.schema, context, parsed);","","            result[key] = parsed.results;","        } else {","            result[key] = SchemaXML._getLocationValue(field, context);","        }","    },","","    /**","     * Parses results data according to schema","     *","     * @method _parseMeta","     * @param xmldoc_in {Object} XML document parse.","     * @param data_out {Object} In-progress schema-parsed data to update.","     * @return {Object} Schema-parsed data.","     * @static","     * @protected","     */","    _parseMeta: function(metaFields, xmldoc_in, data_out) {","        if(Lang.isObject(metaFields)) {","            var key,","                xmldoc = xmldoc_in.ownerDocument || xmldoc_in;","","            for(key in metaFields) {","                if (metaFields.hasOwnProperty(key)) {","                    data_out.meta[key] = SchemaXML._getLocationValue(metaFields[key], xmldoc);","                }","            }","        }","        return data_out;","    },","","    /**","     * Schema-parsed result to add to results list.","     *","     * @method _parseResult","     * @param fields {Array} Required. A collection of field definition.","     * @param context {Object} Required. XML node or document to search within.","     * @return {Object} Schema-parsed data.","     * @static","     * @protected","     */","    _parseResult: function(fields, context) {","        var result = {}, j;","","        // Find each field value","        for (j=fields.length-1; 0 <= j; j--) {","            SchemaXML._parseField(fields[j], result, context);","        }","","        return result;","    },","","    /**","     * Schema-parsed list of results from full data","     *","     * @method _parseResults","     * @param schema {Object} Schema to parse against.","     * @param context {Object} XML node or document to parse.","     * @param data_out {Object} In-progress schema-parsed data to update.","     * @return {Object} Schema-parsed data.","     * @static","     * @protected","     */","    _parseResults: function(schema, context, data_out) {","        if (schema.resultListLocator && Lang.isArray(schema.resultFields)) {","            var xmldoc = context.ownerDocument || context,","                fields = schema.resultFields,","                results = [],","                node, nodeList, i=0;","","            if (schema.resultListLocator.match(/^[:\\-\\w]+$/)) {","                nodeList = context.getElementsByTagName(schema.resultListLocator);","                ","                // loop through each result node","                for (i = nodeList.length - 1; i >= 0; --i) {","                    results[i] = SchemaXML._parseResult(fields, nodeList[i]);","                }","            } else {","                nodeList = SchemaXML._getXPathResult(schema.resultListLocator, context, xmldoc);","","                // loop through the nodelist","                while ((node = nodeList.iterateNext())) {","                    results[i] = SchemaXML._parseResult(fields, node);","                    i += 1;","                }","            }","","            if (results.length) {","                data_out.results = results;","            } else {","                data_out.error = new Error(\"XML schema result nodes retrieval failure\");","            }","        }","        return data_out;","    }","};","","Y.DataSchema.XML = Y.mix(SchemaXML, Y.DataSchema.Base);","","","}, '3.7.3', {\"requires\": [\"dataschema-base\"]});"];
_yuitest_coverage["build/dataschema-xml/dataschema-xml.js"].lines = {"1":0,"19":0,"29":0,"117":0,"120":0,"122":0,"125":0,"127":0,"130":0,"144":0,"148":0,"149":0,"150":0,"151":0,"161":0,"165":0,"182":0,"183":0,"188":0,"191":0,"193":0,"194":0,"197":0,"202":0,"203":0,"206":0,"207":0,"209":0,"210":0,"211":0,"214":0,"215":0,"216":0,"219":0,"220":0,"221":0,"224":0,"225":0,"226":0,"227":0,"228":0,"234":0,"236":0,"237":0,"240":0,"241":0,"245":0,"251":0,"255":0,"256":0,"257":0,"258":0,"277":0,"280":0,"281":0,"282":0,"284":0,"286":0,"301":0,"302":0,"305":0,"306":0,"307":0,"311":0,"325":0,"328":0,"329":0,"332":0,"347":0,"348":0,"353":0,"354":0,"357":0,"358":0,"361":0,"364":0,"365":0,"366":0,"370":0,"371":0,"373":0,"376":0,"380":0};
_yuitest_coverage["build/dataschema-xml/dataschema-xml.js"].functions = {"apply:116":0,"_getLocationValue:143":0,"iterateNext:254":0,"_getXPathResult:180":0,"_parseField:276":0,"_parseMeta:300":0,"_parseResult:324":0,"_parseResults:346":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dataschema-xml/dataschema-xml.js"].coveredLines = 83;
_yuitest_coverage["build/dataschema-xml/dataschema-xml.js"].coveredFunctions = 9;
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 1);
YUI.add('dataschema-xml', function (Y, NAME) {

/**
Provides a DataSchema implementation which can be used to work with XML data.

@module dataschema
@submodule dataschema-xml
**/

/**
Provides a DataSchema implementation which can be used to work with XML data.

See the `apply` method for usage.

@class DataSchema.XML
@extends DataSchema.Base
@static
**/
_yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 19);
var Lang = Y.Lang,

    okNodeType = {
        1 : true,
        9 : true,
        11: true
    },

    SchemaXML;

_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 29);
SchemaXML = {

    ////////////////////////////////////////////////////////////////////////////
    //
    // DataSchema.XML static methods
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
    Applies a schema to an XML data tree, returning a normalized object with
    results in the `results` property. Additional information can be parsed out
    of the XML for inclusion in the `meta` property of the response object.  If
    an error is encountered during processing, an `error` property will be
    added.

    Field data in the nodes captured by the XPath in _schema.resultListLocator_
    is extracted with the field identifiers described in _schema.resultFields_.
    Field identifiers are objects with the following properties:

      * `key`    : <strong>(required)</strong> The desired property name to use
            store the retrieved value in the result object.  If `locator` is
            not specified, `key` is also used as the XPath locator (String)
      * `locator`: The XPath locator to the node or attribute within each
            result node found by _schema.resultListLocator_ containing the
            desired field data (String)
      * `parser` : A function or the name of a function on `Y.Parsers` used
            to convert the input value into a normalized type.  Parser
            functions are passed the value as input and are expected to
            return a value.
      * `schema` : Used to retrieve nested field data into an array for
            assignment as the result field value.  This object follows the same
            conventions as _schema_.

    If no value parsing or nested parsing is needed, you can use XPath locators
    (strings) instead of field identifiers (objects) -- see example below.

    `response.results` will contain an array of objects with key:value pairs.
    The keys are the field identifier `key`s, and the values are the data
    values extracted from the nodes or attributes found by the field `locator`
    (or `key` fallback).
    
    To extract additional information from the XML, include an array of
    XPath locators in _schema.metaFields_.  The collected values will be
    stored in `response.meta` with the XPath locator as keys.

    @example
        var schema = {
                resultListLocator: '//produce/item',
                resultFields: [
                    {
                        locator: 'name',
                        key: 'name'
                    },
                    {
                        locator: 'color',
                        key: 'color',
                        parser: function (val) { return val.toUpperCase(); }
                    }
                ]
            };

        // Assumes data like
        // <inventory>
        //   <produce>
        //     <item><name>Banana</name><color>yellow</color></item>
        //     <item><name>Orange</name><color>orange</color></item>
        //     <item><name>Eggplant</name><color>purple</color></item>
        //   </produce>
        // </inventory>

        var response = Y.DataSchema.JSON.apply(schema, data);

        // response.results[0] is { name: "Banana", color: "YELLOW" }
     
    @method apply
    @param {Object} schema Schema to apply.  Supported configuration
        properties are:
      @param {String} [schema.resultListLocator] XPath locator for the
          XML nodes that contain the data to flatten into `response.results`
      @param {Array} [schema.resultFields] Field identifiers to
          locate/assign values in the response records. See above for
          details.
      @param {Array} [schema.metaFields] XPath locators to extract extra
          non-record related information from the XML data
    @param {XMLDoc} data XML data to parse
    @return {Object} An Object with properties `results` and `meta`
    @static
    **/
    apply: function(schema, data) {
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "apply", 116);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 117);
var xmldoc = data, // unnecessary variables
            data_out = { results: [], meta: {} };

        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 120);
if (xmldoc && okNodeType[xmldoc.nodeType] && schema) {
            // Parse results data
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 122);
data_out = SchemaXML._parseResults(schema, xmldoc, data_out);

            // Parse meta data
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 125);
data_out = SchemaXML._parseMeta(schema.metaFields, xmldoc, data_out);
        } else {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 127);
data_out.error = new Error("XML schema parse failure");
        }

        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 130);
return data_out;
    },

    /**
     * Get an XPath-specified value for a given field from an XML node or document.
     *
     * @method _getLocationValue
     * @param field {String | Object} Field definition.
     * @param context {Object} XML node or document to search within.
     * @return {Object} Data value or null.
     * @static
     * @protected
     */
    _getLocationValue: function(field, context) {
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "_getLocationValue", 143);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 144);
var locator = field.locator || field.key || field,
            xmldoc = context.ownerDocument || context,
            result, res, value = null;

        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 148);
try {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 149);
result = SchemaXML._getXPathResult(locator, context, xmldoc);
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 150);
while ((res = result.iterateNext())) {
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 151);
value = res.textContent || res.value || res.text || res.innerHTML || res.innerText || null;
            }

            // FIXME: Why defer to a method that is mixed into this object?
            // DSchema.Base is mixed into DSchema.XML (et al), so
            // DSchema.XML.parse(...) will work.  This supports the use case
            // where DSchema.Base.parse is changed, and that change is then
            // seen by all DSchema.* implementations, but does not support the
            // case where redefining DSchema.XML.parse changes behavior. In
            // fact, DSchema.XML.parse is never even called.
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 161);
return Y.DataSchema.Base.parse.call(this, value, field);
        } catch (e) {
        }

        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 165);
return null;
    },

    /**
     * Fetches the XPath-specified result for a given location in an XML node
     * or document.
     * 
     * @method _getXPathResult
     * @param locator {String} The XPath location.
     * @param context {Object} XML node or document to search within.
     * @param xmldoc {Object} XML document to resolve namespace.
     * @return {Object} Data collection or null.
     * @static
     * @protected
     */
    _getXPathResult: function(locator, context, xmldoc) {
        // Standards mode
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "_getXPathResult", 180);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 182);
if (! Lang.isUndefined(xmldoc.evaluate)) {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 183);
return xmldoc.evaluate(locator, context, xmldoc.createNSResolver(context.ownerDocument ? context.ownerDocument.documentElement : context.documentElement), 0, null);
          
        }
        // IE mode
        else {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 188);
var values=[], locatorArray = locator.split(/\b\/\b/), i=0, l=locatorArray.length, location, subloc, m, isNth;
            
            // XPath is supported
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 191);
try {
                // this fixes the IE 5.5+ issue where childnode selectors begin at 0 instead of 1
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 193);
try {
                   _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 194);
xmldoc.setProperty("SelectionLanguage", "XPath");
                } catch (e) {}
                
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 197);
values = context.selectNodes(locator);
            }
            // Fallback for DOM nodes and fragments
            catch (e) {
                // Iterate over each locator piece
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 202);
for (; i<l && context; i++) {
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 203);
location = locatorArray[i];

                    // grab nth child []
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 206);
if ((location.indexOf("[") > -1) && (location.indexOf("]") > -1)) {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 207);
subloc = location.slice(location.indexOf("[")+1, location.indexOf("]"));
                        //XPath is 1-based while DOM is 0-based
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 209);
subloc--;
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 210);
context = context.children[subloc];
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 211);
isNth = true;
                    }
                    // grab attribute value @
                    else {_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 214);
if (location.indexOf("@") > -1) {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 215);
subloc = location.substr(location.indexOf("@"));
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 216);
context = subloc ? context.getAttribute(subloc.replace('@', '')) : context;
                    }
                    // grab that last instance of tagName
                    else {_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 219);
if (-1 < location.indexOf("//")) {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 220);
subloc = context.getElementsByTagName(location.substr(2));
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 221);
context = subloc.length ? subloc[subloc.length - 1] : null;
                    }
                    // find the last matching location in children
                    else {_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 224);
if (l != i + 1) {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 225);
for (m=context.childNodes.length-1; 0 <= m; m-=1) {
                            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 226);
if (location === context.childNodes[m].tagName) {
                                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 227);
context = context.childNodes[m];
                                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 228);
m = -1;
                            }
                        }
                    }}}}
                }
                
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 234);
if (context) {
                    // attribute
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 236);
if (Lang.isString(context)) {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 237);
values[0] = {value: context};
                    }
                    // nth child
                    else {_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 240);
if (isNth) {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 241);
values[0] = {value: context.innerHTML};
                    }
                    // all children
                    else {
                        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 245);
values = Y.Array(context.childNodes, 0, true);
                    }}
                }
            }

            // returning a mock-standard object for IE
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 251);
return {
                index: 0,
                
                iterateNext: function() {
                    _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "iterateNext", 254);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 255);
if (this.index >= this.values.length) {return undefined;}
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 256);
var result = this.values[this.index];
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 257);
this.index += 1;
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 258);
return result;
                },

                values: values
            };
        }
    },

    /**
     * Schema-parsed result field.
     *
     * @method _parseField
     * @param field {String | Object} Required. Field definition.
     * @param result {Object} Required. Schema parsed data object.
     * @param context {Object} Required. XML node or document to search within.
     * @static
     * @protected
     */
    _parseField: function(field, result, context) {
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "_parseField", 276);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 277);
var key = field.key || field,
            parsed;

        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 280);
if (field.schema) {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 281);
parsed = { results: [], meta: {} };
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 282);
parsed = SchemaXML._parseResults(field.schema, context, parsed);

            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 284);
result[key] = parsed.results;
        } else {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 286);
result[key] = SchemaXML._getLocationValue(field, context);
        }
    },

    /**
     * Parses results data according to schema
     *
     * @method _parseMeta
     * @param xmldoc_in {Object} XML document parse.
     * @param data_out {Object} In-progress schema-parsed data to update.
     * @return {Object} Schema-parsed data.
     * @static
     * @protected
     */
    _parseMeta: function(metaFields, xmldoc_in, data_out) {
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "_parseMeta", 300);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 301);
if(Lang.isObject(metaFields)) {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 302);
var key,
                xmldoc = xmldoc_in.ownerDocument || xmldoc_in;

            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 305);
for(key in metaFields) {
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 306);
if (metaFields.hasOwnProperty(key)) {
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 307);
data_out.meta[key] = SchemaXML._getLocationValue(metaFields[key], xmldoc);
                }
            }
        }
        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 311);
return data_out;
    },

    /**
     * Schema-parsed result to add to results list.
     *
     * @method _parseResult
     * @param fields {Array} Required. A collection of field definition.
     * @param context {Object} Required. XML node or document to search within.
     * @return {Object} Schema-parsed data.
     * @static
     * @protected
     */
    _parseResult: function(fields, context) {
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "_parseResult", 324);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 325);
var result = {}, j;

        // Find each field value
        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 328);
for (j=fields.length-1; 0 <= j; j--) {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 329);
SchemaXML._parseField(fields[j], result, context);
        }

        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 332);
return result;
    },

    /**
     * Schema-parsed list of results from full data
     *
     * @method _parseResults
     * @param schema {Object} Schema to parse against.
     * @param context {Object} XML node or document to parse.
     * @param data_out {Object} In-progress schema-parsed data to update.
     * @return {Object} Schema-parsed data.
     * @static
     * @protected
     */
    _parseResults: function(schema, context, data_out) {
        _yuitest_coverfunc("build/dataschema-xml/dataschema-xml.js", "_parseResults", 346);
_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 347);
if (schema.resultListLocator && Lang.isArray(schema.resultFields)) {
            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 348);
var xmldoc = context.ownerDocument || context,
                fields = schema.resultFields,
                results = [],
                node, nodeList, i=0;

            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 353);
if (schema.resultListLocator.match(/^[:\-\w]+$/)) {
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 354);
nodeList = context.getElementsByTagName(schema.resultListLocator);
                
                // loop through each result node
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 357);
for (i = nodeList.length - 1; i >= 0; --i) {
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 358);
results[i] = SchemaXML._parseResult(fields, nodeList[i]);
                }
            } else {
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 361);
nodeList = SchemaXML._getXPathResult(schema.resultListLocator, context, xmldoc);

                // loop through the nodelist
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 364);
while ((node = nodeList.iterateNext())) {
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 365);
results[i] = SchemaXML._parseResult(fields, node);
                    _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 366);
i += 1;
                }
            }

            _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 370);
if (results.length) {
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 371);
data_out.results = results;
            } else {
                _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 373);
data_out.error = new Error("XML schema result nodes retrieval failure");
            }
        }
        _yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 376);
return data_out;
    }
};

_yuitest_coverline("build/dataschema-xml/dataschema-xml.js", 380);
Y.DataSchema.XML = Y.mix(SchemaXML, Y.DataSchema.Base);


}, '3.7.3', {"requires": ["dataschema-base"]});
