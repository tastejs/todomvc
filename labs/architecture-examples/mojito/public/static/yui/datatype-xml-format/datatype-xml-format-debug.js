/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatype-xml-format', function (Y, NAME) {

/**
 * The Number Utility provides type-conversion and string-formatting
 * convenience methods for Numbers.
 *
 * @module datatype-xml
 * @submodule datatype-xml-format
 */

/**
 * XML provides a set of utility functions to operate against XML documents.
 *
 * @class XML
 * @static
 */
var LANG = Y.Lang;

Y.mix(Y.namespace("XML"), {
    /**
     * Converts data to type XMLDocument.
     *
     * @method format
     * @param data {XMLDoc} Data to convert.
     * @return {String} String.
     */
    format: function(data) {
        try {
            if(!LANG.isUndefined(data.getXml)) {
                return data.getXml();
            }

            if(!LANG.isUndefined(XMLSerializer)) {
                return (new XMLSerializer()).serializeToString(data);
            }
        }
        catch(e) {
            if(data && data.xml) {
                return data.xml;
            }
            else {
                Y.log("Could not format data from type XML", "warn", "xml");
                return (LANG.isValue(data) && data.toString) ? data.toString() : "";
            }
        }
    }
});

Y.namespace("DataType");
Y.DataType.XML = Y.XML;


}, '3.7.3');
