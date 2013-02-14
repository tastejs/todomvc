/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
var Lang = Y.Lang,

    okNodeType = {
        1 : true,
        9 : true,
        11: true
    },

    SchemaXML;

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
        var xmldoc = data, // unnecessary variables
            data_out = { results: [], meta: {} };

        if (xmldoc && okNodeType[xmldoc.nodeType] && schema) {
            // Parse results data
            data_out = SchemaXML._parseResults(schema, xmldoc, data_out);

            // Parse meta data
            data_out = SchemaXML._parseMeta(schema.metaFields, xmldoc, data_out);
        } else {
            Y.log("XML data could not be schema-parsed: " + Y.dump(data) + " " + Y.dump(data), "error", "dataschema-xml");
            data_out.error = new Error("XML schema parse failure");
        }

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
        var locator = field.locator || field.key || field,
            xmldoc = context.ownerDocument || context,
            result, res, value = null;

        try {
            result = SchemaXML._getXPathResult(locator, context, xmldoc);
            while ((res = result.iterateNext())) {
                value = res.textContent || res.value || res.text || res.innerHTML || res.innerText || null;
            }

            // FIXME: Why defer to a method that is mixed into this object?
            // DSchema.Base is mixed into DSchema.XML (et al), so
            // DSchema.XML.parse(...) will work.  This supports the use case
            // where DSchema.Base.parse is changed, and that change is then
            // seen by all DSchema.* implementations, but does not support the
            // case where redefining DSchema.XML.parse changes behavior. In
            // fact, DSchema.XML.parse is never even called.
            return Y.DataSchema.Base.parse.call(this, value, field);
        } catch (e) {
            Y.log('SchemaXML._getLocationValue failed: ' + e.message);
        }

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
        if (! Lang.isUndefined(xmldoc.evaluate)) {
            return xmldoc.evaluate(locator, context, xmldoc.createNSResolver(context.ownerDocument ? context.ownerDocument.documentElement : context.documentElement), 0, null);
          
        }
        // IE mode
        else {
            var values=[], locatorArray = locator.split(/\b\/\b/), i=0, l=locatorArray.length, location, subloc, m, isNth;
            
            // XPath is supported
            try {
                // this fixes the IE 5.5+ issue where childnode selectors begin at 0 instead of 1
                try {
                   xmldoc.setProperty("SelectionLanguage", "XPath");
                } catch (e) {}
                
                values = context.selectNodes(locator);
            }
            // Fallback for DOM nodes and fragments
            catch (e) {
                // Iterate over each locator piece
                for (; i<l && context; i++) {
                    location = locatorArray[i];

                    // grab nth child []
                    if ((location.indexOf("[") > -1) && (location.indexOf("]") > -1)) {
                        subloc = location.slice(location.indexOf("[")+1, location.indexOf("]"));
                        //XPath is 1-based while DOM is 0-based
                        subloc--;
                        context = context.children[subloc];
                        isNth = true;
                    }
                    // grab attribute value @
                    else if (location.indexOf("@") > -1) {
                        subloc = location.substr(location.indexOf("@"));
                        context = subloc ? context.getAttribute(subloc.replace('@', '')) : context;
                    }
                    // grab that last instance of tagName
                    else if (-1 < location.indexOf("//")) {
                        subloc = context.getElementsByTagName(location.substr(2));
                        context = subloc.length ? subloc[subloc.length - 1] : null;
                    }
                    // find the last matching location in children
                    else if (l != i + 1) {
                        for (m=context.childNodes.length-1; 0 <= m; m-=1) {
                            if (location === context.childNodes[m].tagName) {
                                context = context.childNodes[m];
                                m = -1;
                            }
                        }
                    }
                }
                
                if (context) {
                    // attribute
                    if (Lang.isString(context)) {
                        values[0] = {value: context};
                    }
                    // nth child
                    else if (isNth) {
                        values[0] = {value: context.innerHTML};
                    }
                    // all children
                    else {
                        values = Y.Array(context.childNodes, 0, true);
                    }
                }
            }

            // returning a mock-standard object for IE
            return {
                index: 0,
                
                iterateNext: function() {
                    if (this.index >= this.values.length) {return undefined;}
                    var result = this.values[this.index];
                    this.index += 1;
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
        var key = field.key || field,
            parsed;

        if (field.schema) {
            parsed = { results: [], meta: {} };
            parsed = SchemaXML._parseResults(field.schema, context, parsed);

            result[key] = parsed.results;
        } else {
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
        if(Lang.isObject(metaFields)) {
            var key,
                xmldoc = xmldoc_in.ownerDocument || xmldoc_in;

            for(key in metaFields) {
                if (metaFields.hasOwnProperty(key)) {
                    data_out.meta[key] = SchemaXML._getLocationValue(metaFields[key], xmldoc);
                }
            }
        }
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
        var result = {}, j;

        // Find each field value
        for (j=fields.length-1; 0 <= j; j--) {
            SchemaXML._parseField(fields[j], result, context);
        }

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
        if (schema.resultListLocator && Lang.isArray(schema.resultFields)) {
            var xmldoc = context.ownerDocument || context,
                fields = schema.resultFields,
                results = [],
                node, nodeList, i=0;

            if (schema.resultListLocator.match(/^[:\-\w]+$/)) {
                nodeList = context.getElementsByTagName(schema.resultListLocator);
                
                // loop through each result node
                for (i = nodeList.length - 1; i >= 0; --i) {
                    results[i] = SchemaXML._parseResult(fields, nodeList[i]);
                }
            } else {
                nodeList = SchemaXML._getXPathResult(schema.resultListLocator, context, xmldoc);

                // loop through the nodelist
                while ((node = nodeList.iterateNext())) {
                    results[i] = SchemaXML._parseResult(fields, node);
                    i += 1;
                }
            }

            if (results.length) {
                data_out.results = results;
            } else {
                data_out.error = new Error("XML schema result nodes retrieval failure");
            }
        }
        return data_out;
    }
};

Y.DataSchema.XML = Y.mix(SchemaXML, Y.DataSchema.Base);


}, '3.7.3', {"requires": ["dataschema-base"]});
