/*
 * Copyright (c) Microsoft.  All rights reserved.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal  in the Software without restriction, including without limitation the rights  to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY,  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 * datajs.js
 */

(function (window, undefined) {

    var datajs = window.datajs || {};
    var odata = window.OData || {};

    // AMD support
    if (typeof define === 'function' && define.amd) {        
        define('datajs', datajs);
        define('OData', odata);
    } else {
        window.datajs = datajs;
        window.OData = odata; 
    }


    var activeXObject = function (progId) {
        /// <summary>Creates a new ActiveXObject from the given progId.</summary>
        /// <param name="progId" type="String" mayBeNull="false" optional="false">
        ///    ProgId string of the desired ActiveXObject.
        /// </param>
        /// <remarks>
        ///    This function throws whatever exception might occur during the creation
        ///    of the ActiveXObject.
        /// </remarks>
        /// <returns type="Object">
        ///     The ActiveXObject instance. Null if ActiveX is not supported by the 
        ///     browser.
        /// </returns>    
        if (window.ActiveXObject) {
            return new window.ActiveXObject(progId);
        }
        return null;
    };

    var assigned = function (value) {
        /// <summary>Checks whether the specified value is different from null and undefined.</summary>
        /// <param name="value" mayBeNull="true" optional="true">Value to check.</param>
        /// <returns type="Boolean">true if the value is assigned; false otherwise.</returns>
        return value !== null && value !== undefined;
    };

    var contains = function (arr, item) {
        /// <summary>Checks whether the specified item is in the array.</summary>
        /// <param name="arr" type="Array" optional="false" mayBeNull="false">Array to check in.</param>
        /// <param name="item">Item to look for.</param>
        /// <returns type="Boolean">true if the item is contained, false otherwise.</returns>

        var i, len;
        for (i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return true;
            }
        }

        return false;
    };

    var defined = function (a, b) {
        /// <summary>Given two values, picks the first one that is not undefined.</summary>
        /// <param name="a">First value.</param>
        /// <param name="b">Second value.</param>
        /// <returns>a if it's a defined value; else b.</returns>
        return (a !== undefined) ? a : b;
    };

    var delay = function (callback) {
        /// <summary>Delays the invocation of the specified function until execution unwinds.</summary>
        /// <param name="callback" type="Function">Callback function.</param>
        if (arguments.length === 1) {
            window.setTimeout(callback, 0);
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        window.setTimeout(function () {
            callback.apply(this, args);
        }, 0);
    };


    var extend = function (target, values) {
        /// <summary>Extends the target with the specified values.</summary>
        /// <param name="target" type="Object">Object to add properties to.</param>
        /// <param name="values" type="Object">Object with properties to add into target.</param>
        /// <returns type="Object">The target object.</returns>

        for (var name in values) {
            target[name] = values[name];
        }

        return target;
    };

    var find = function (arr, callback) {
        /// <summary>Returns the first item in the array that makes the callback function true.</summary>
        /// <param name="arr" type="Array" optional="false" mayBeNull="true">Array to check in.</param>
        /// <param name="callback" type="Function">Callback function to invoke once per item in the array.</param>
        /// <returns>The first item that makes the callback return true; null otherwise or if the array is null.</returns>

        if (arr) {
            var i, len;
            for (i = 0, len = arr.length; i < len; i++) {
                if (callback(arr[i])) {
                    return arr[i];
                }
            }
        }
        return null;
    };

    var isArray = function (value) {
        /// <summary>Checks whether the specified value is an array object.</summary>
        /// <param name="value">Value to check.</param>
        /// <returns type="Boolean">true if the value is an array object; false otherwise.</returns>

        return Object.prototype.toString.call(value) === "[object Array]";
    };

    var isDate = function (value) {
        /// <summary>Checks whether the specified value is a Date object.</summary>
        /// <param name="value">Value to check.</param>
        /// <returns type="Boolean">true if the value is a Date object; false otherwise.</returns>

        return Object.prototype.toString.call(value) === "[object Date]";
    };

    var isObject = function (value) {
        /// <summary>Tests whether a value is an object.</summary>
        /// <param name="value">Value to test.</param>
        /// <remarks>
        ///     Per javascript rules, null and array values are objects and will cause this function to return true.
        /// </remarks>
        /// <returns type="Boolean">True is the value is an object; false otherwise.</returns>

        return typeof value === "object";
    };

    var parseInt10 = function (value) {
        /// <summary>Parses a value in base 10.</summary>
        /// <param name="value" type="String">String value to parse.</param>
        /// <returns type="Number">The parsed value, NaN if not a valid value.</returns>

        return parseInt(value, 10);
    };

    var renameProperty = function (obj, oldName, newName) {
        /// <summary>Renames a property in an object.</summary>
        /// <param name="obj" type="Object">Object in which the property will be renamed.</param>
        /// <param name="oldName" type="String">Name of the property that will be renamed.</param>
        /// <param name="newName" type="String">New name of the property.</param>
        /// <remarks>
        ///    This function will not do anything if the object doesn't own a property with the specified old name.
        /// </remarks>

        if (obj.hasOwnProperty(oldName)) {
            obj[newName] = obj[oldName];
            delete obj[oldName];
        }
    };

    var throwErrorCallback = function (error) {
        /// <summary>Default error handler.</summary>
        /// <param name="error" type="Object">Error to handle.</param>
        throw error;
    };

    var trimString = function (str) {
        /// <summary>Removes leading and trailing whitespaces from a string.</summary>
        /// <param name="str" type="String" optional="false" mayBeNull="false">String to trim</param>
        /// <returns type="String">The string with no leading or trailing whitespace.</returns>

        if (str.trim) {
            return str.trim();
        }

        return str.replace(/^\s+|\s+$/g, '');
    };

    var undefinedDefault = function (value, defaultValue) {
        /// <summary>Returns a default value in place of undefined.</summary>
        /// <param name="value" mayBeNull="true" optional="true">Value to check.</param>
        /// <param name="defaultValue">Value to return if value is undefined.</param>
        /// <returns>value if it's defined; defaultValue otherwise.</returns>
        /// <remarks>
        /// This should only be used for cases where falsy values are valid;
        /// otherwise the pattern should be 'x = (value) ? value : defaultValue;'.
        /// </remarks>
        return (value !== undefined) ? value : defaultValue;
    };

    // Regular expression that splits a uri into its components:
    // 0 - is the matched string.
    // 1 - is the scheme.
    // 2 - is the authority.
    // 3 - is the path.
    // 4 - is the query.
    // 5 - is the fragment.
    var uriRegEx = /^([^:\/?#]+:)?(\/\/[^\/?#]*)?([^?#:]+)?(\?[^#]*)?(#.*)?/;
    var uriPartNames = ["scheme", "authority", "path", "query", "fragment"];

    var getURIInfo = function (uri) {
        /// <summary>Gets information about the components of the specified URI.</summary>
        /// <param name="uri" type="String">URI to get information from.</param>
        /// <returns type="Object">
        /// An object with an isAbsolute flag and part names (scheme, authority, etc.) if available.
        /// </returns>

        var result = { isAbsolute: false };

        if (uri) {
            var matches = uriRegEx.exec(uri);
            if (matches) {
                var i, len;
                for (i = 0, len = uriPartNames.length; i < len; i++) {
                    if (matches[i + 1]) {
                        result[uriPartNames[i]] = matches[i + 1];
                    }
                }
            }
            if (result.scheme) {
                result.isAbsolute = true;
            }
        }

        return result;
    };

    var getURIFromInfo = function (uriInfo) {
        /// <summary>Builds a URI string from its components.</summary>
        /// <param name="uriInfo" type="Object"> An object with uri parts (scheme, authority, etc.).</param>
        /// <returns type="String">URI string.</returns>

        return "".concat(
            uriInfo.scheme || "",
            uriInfo.authority || "",
            uriInfo.path || "",
            uriInfo.query || "",
            uriInfo.fragment || "");
    };

    // Regular expression that splits a uri authority into its subcomponents:
    // 0 - is the matched string.
    // 1 - is the userinfo subcomponent.
    // 2 - is the host subcomponent.
    // 3 - is the port component.
    var uriAuthorityRegEx = /^\/{0,2}(?:([^@]*)@)?([^:]+)(?::{1}(\d+))?/;

    // Regular expression that matches percentage enconded octects (i.e %20 or %3A);
    var pctEncodingRegEx = /%[0-9A-F]{2}/ig;

    var normalizeURICase = function (uri) {
        /// <summary>Normalizes the casing of a URI.</summary>
        /// <param name="uri" type="String">URI to normalize, absolute or relative.</param>
        /// <returns type="String">The URI normalized to lower case.</returns>

        var uriInfo = getURIInfo(uri);
        var scheme = uriInfo.scheme;
        var authority = uriInfo.authority;

        if (scheme) {
            uriInfo.scheme = scheme.toLowerCase();
            if (authority) {
                var matches = uriAuthorityRegEx.exec(authority);
                if (matches) {
                    uriInfo.authority = "//" +
                    (matches[1] ? matches[1] + "@" : "") +
                    (matches[2].toLowerCase()) +
                    (matches[3] ? ":" + matches[3] : "");
                }
            }
        }

        uri = getURIFromInfo(uriInfo);

        return uri.replace(pctEncodingRegEx, function (str) {
            return str.toLowerCase();
        });
    };

    var normalizeURI = function (uri, base) {
        /// <summary>Normalizes a possibly relative URI with a base URI.</summary>
        /// <param name="uri" type="String">URI to normalize, absolute or relative.</param>
        /// <param name="base" type="String" mayBeNull="true">Base URI to compose with.</param>
        /// <returns type="String">The composed URI if relative; the original one if absolute.</returns>

        if (!base) {
            return uri;
        }

        var uriInfo = getURIInfo(uri);
        if (uriInfo.isAbsolute) {
            return uri;
        }

        var baseInfo = getURIInfo(base);
        var normInfo = {};
        var path;

        if (uriInfo.authority) {
            normInfo.authority = uriInfo.authority;
            path = uriInfo.path;
            normInfo.query = uriInfo.query;
        } else {
            if (!uriInfo.path) {
                path = baseInfo.path;
                normInfo.query = uriInfo.query || baseInfo.query;
            } else {
                if (uriInfo.path.charAt(0) === '/') {
                    path = uriInfo.path;
                } else {
                    path = mergeUriPathWithBase(uriInfo.path, baseInfo.path);
                }
                normInfo.query = uriInfo.query;
            }
            normInfo.authority = baseInfo.authority;
        }

        normInfo.path = removeDotsFromPath(path);

        normInfo.scheme = baseInfo.scheme;
        normInfo.fragment = uriInfo.fragment;

        return getURIFromInfo(normInfo);
    };

    var mergeUriPathWithBase = function (uriPath, basePath) {
        /// <summary>Merges the path of a relative URI and a base URI.</summary>
        /// <param name="uriPath" type="String>Relative URI path.</param>
        /// <param name="basePath" type="String">Base URI path.</param>
        /// <returns type="String">A string with the merged path.</returns>

        var path = "/";
        var end;

        if (basePath) {
            end = basePath.lastIndexOf("/");
            path = basePath.substring(0, end);

            if (path.charAt(path.length - 1) !== "/") {
                path = path + "/";
            }
        }

        return path + uriPath;
    };

    var removeDotsFromPath = function (path) {
        /// <summary>Removes the special folders . and .. from a URI's path.</summary>
        /// <param name="path" type="string">URI path component.</param>
        /// <returns type="String">Path without any . and .. folders.</returns>

        var result = "";
        var segment = "";
        var end;

        while (path) {
            if (path.indexOf("..") === 0 || path.indexOf(".") === 0) {
                path = path.replace(/^\.\.?\/?/g, "");
            } else if (path.indexOf("/..") === 0) {
                path = path.replace(/^\/\..\/?/g, "/");
                end = result.lastIndexOf("/");
                if (end === -1) {
                    result = "";
                } else {
                    result = result.substring(0, end);
                }
            } else if (path.indexOf("/.") === 0) {
                path = path.replace(/^\/\.\/?/g, "/");
            } else {
                segment = path;
                end = path.indexOf("/", 1);
                if (end !== -1) {
                    segment = path.substring(0, end);
                }
                result = result + segment;
                path = path.replace(segment, "");
            }
        }
        return result;
    };



    // URI prefixes to generate smaller code.
    var http = "http://";
    var w3org = http + "www.w3.org/";               // http://www.w3.org/

    var xhtmlNS = w3org + "1999/xhtml";             // http://www.w3.org/1999/xhtml
    var xmlnsNS = w3org + "2000/xmlns/";            // http://www.w3.org/2000/xmlns/
    var xmlNS = w3org + "XML/1998/namespace";       // http://www.w3.org/XML/1998/namespace

    var mozillaParserErroNS = http + "www.mozilla.org/newlayout/xml/parsererror.xml";

    var hasLeadingOrTrailingWhitespace = function (text) {
        /// <summary>Checks whether the specified string has leading or trailing spaces.</summary>
        /// <param name="text" type="String">String to check.</param>
        /// <returns type="Boolean">true if text has any leading or trailing whitespace; false otherwise.</returns>

        var re = /(^\s)|(\s$)/;
        return re.test(text);
    };

    var isWhitespace = function (text) {
        /// <summary>Determines whether the specified text is empty or whitespace.</summary>
        /// <param name="text" type="String">Value to inspect.</param>
        /// <returns type="Boolean">true if the text value is empty or all whitespace; false otherwise.</returns>

        var ws = /^\s*$/;
        return text === null || ws.test(text);
    };

    var isWhitespacePreserveContext = function (domElement) {
        /// <summary>Determines whether the specified element has xml:space='preserve' applied.</summary>
        /// <param name="domElement">Element to inspect.</param>
        /// <returns type="Boolean">Whether xml:space='preserve' is in effect.</returns>

        while (domElement !== null && domElement.nodeType === 1) {
            var val = xmlAttributeValue(domElement, "space", xmlNS);
            if (val === "preserve") {
                return true;
            } else if (val === "default") {
                break;
            } else {
                domElement = domElement.parentNode;
            }
        }

        return false;
    };

    var isXmlNSDeclaration = function (domAttribute) {
        /// <summary>Determines whether the attribute is a XML namespace declaration.</summary>
        /// <param name="domAttribute">Element to inspect.</param>
        /// <returns type="Boolean">
        ///    True if the attribute is a namespace declaration (its name is 'xmlns' or starts with 'xmlns:'; false otherwise.
        /// </returns>

        var nodeName = domAttribute.nodeName;
        return nodeName == "xmlns" || nodeName.indexOf("xmlns:") == 0;
    };

    var safeSetProperty = function (obj, name, value) {
        /// <summary>Safely set as property in an object by invoking obj.setProperty.</summary>
        /// <param name="obj">Object that exposes a setProperty method.</param>
        /// <param name="name" type="String" mayBeNull="false">Property name.</param>
        /// <param name="value">Property value.</param>

        try {
            obj.setProperty(name, value);
        } catch (_) { }
    };

    var msXmlDom3 = function () {
        /// <summary>Creates an configures new MSXML 3.0 ActiveX object.</summary>
        /// <remakrs>
        ///    This function throws any exception that occurs during the creation
        ///    of the MSXML 3.0 ActiveX object.
        /// <returns type="Object">New MSXML 3.0 ActiveX object.</returns>

        var msxml3 = activeXObject("Msxml2.DOMDocument.3.0");
        if (msxml3) {
            safeSetProperty(msxml3, "ProhibitDTD", true);
            safeSetProperty(msxml3, "MaxElementDepth", 256);
            safeSetProperty(msxml3, "AllowDocumentFunction", false);
            safeSetProperty(msxml3, "AllowXsltScript", false);
        }
        return msxml3;
    };

    var msXmlDom = function () {
        /// <summary>Creates an configures new MSXML 6.0 or MSXML 3.0 ActiveX object.</summary>
        /// <remakrs>
        ///    This function will try to create a new MSXML 6.0 ActiveX object. If it fails then
        ///    it will fallback to create a new MSXML 3.0 ActiveX object. Any exception that 
        ///    happens during the creation of the MSXML 6.0 will be handled by the function while 
        ///    the ones that happend during the creation of the MSXML 3.0 will be thrown.
        /// <returns type="Object">New MSXML 3.0 ActiveX object.</returns>

        try {
            var msxml = activeXObject("Msxml2.DOMDocument.6.0");
            if (msxml) {
                msxml.async = true;
            }
            return msxml;
        } catch (_) {
            return msXmlDom3();
        }
    };

    var msXmlParse = function (text) {
        /// <summary>Parses an XML string using the MSXML DOM.</summary>
        /// <remakrs>
        ///    This function throws any exception that occurs during the creation
        ///    of the MSXML ActiveX object.  It also will throw an exception 
        ///    in case of a parsing error.
        /// <returns type="Object">New MSXML DOMDocument node representing the parsed XML string.</returns>

        var dom = msXmlDom();
        if (!dom) {
            return null;
        }

        dom.loadXML(text);
        var parseError = dom.parseError;
        if (parseError.errorCode !== 0) {
            xmlThrowParserError(parseError.reason, parseError.srcText, text);
        }
        return dom;
    };

    var xmlThrowParserError = function (exceptionOrReason, srcText, errorXmlText) {
        /// <summary>Throws a new exception containing XML parsing error information.</summary>
        /// <param name="exceptionOrReason">
        ///    String indicatin the reason of the parsing failure or 
        ///    Object detailing the parsing error.
        /// </param>
        /// <param name="srcText" type="String">
        ///    String indicating the part of the XML string that caused the parsing error.
        /// </param>
        /// <param name="errorXmlText" type="String">XML string for wich the parsing failed.</param> 

        if (typeof exceptionOrReason === "string") {
            exceptionOrReason = { message: exceptionOrReason };
        };
        throw extend(exceptionOrReason, { srcText: srcText || "", errorXmlText: errorXmlText || "" });
    };

    var xmlParse = function (text) {
        /// <summary>Returns an XML DOM document from the specified text.</summary>
        /// <param name="text" type="String">Document text.</param>
        /// <returns>XML DOM document.</returns>
        /// <remarks>This function will throw an exception in case of a parse error.</remarks>

        var domParser = window.DOMParser && new window.DOMParser();
        var dom;

        if (!domParser) {
            dom = msXmlParse(text);
            if (!dom) {
                xmlThrowParserError("XML DOM parser not supported");
            }
            return dom;
        }

        try {
            dom = domParser.parseFromString(text, "text/xml");
        } catch (e) {
            xmlThrowParserError(e, "", text);
        }

        var element = dom.documentElement;
        var nsURI = element.namespaceURI;
        var localName = xmlLocalName(element);

        // Firefox reports errors by returing the DOM for an xml document describing the problem.
        if (localName === "parsererror" && nsURI === mozillaParserErroNS) {
            var srcTextElement = xmlFirstChildElement(element, mozillaParserErroNS, "sourcetext");
            var srcText = srcTextElement ? xmlNodeValue(srcTextElement) : "";
            xmlThrowParserError(xmlInnerText(element) || "", srcText, text);
        }

        // Chrome (and maybe other webkit based browsers) report errors by injecting a header with an error message.
        // The error may be localized, so instead we simply check for a header as the
        // top element or descendant child of the document.
        if (localName === "h3" && nsURI === xhtmlNS || xmlFirstDescendantElement(element, xhtmlNS, "h3")) {
            var reason = "";
            var siblings = [];
            var cursor = element.firstChild;
            while (cursor) {
                if (cursor.nodeType === 1) {
                    reason += xmlInnerText(cursor) || "";
                }
                siblings.push(cursor.nextSibling);
                cursor = cursor.firstChild || siblings.shift();
            }
            reason += xmlInnerText(element) || "";
            xmlThrowParserError(reason, "", text);
        }

        return dom;
    };

    var xmlQualifiedName = function (prefix, name) {
        /// <summary>Builds a XML qualified name string in the form of "prefix:name".</summary>
        /// <param name="prefix" type="String" maybeNull="true">Prefix string.</param>
        /// <param name="name" type="String">Name string to qualify with the prefix.</param>
        /// <returns type="String">Qualified name.</returns>

        return prefix ? prefix + ":" + name : name;
    };

    var xmlAppendText = function (domNode, textNode) {
        /// <summary>Appends a text node into the specified DOM element node.</summary>
        /// <param name="domNode">DOM node for the element.</param>
        /// <param name="text" type="String" mayBeNull="false">Text to append as a child of element.</param>
        if (hasLeadingOrTrailingWhitespace(textNode.data)) {
            var attr = xmlAttributeNode(domNode, xmlNS, "space");
            if (!attr) {
                attr = xmlNewAttribute(domNode.ownerDocument, xmlNS, xmlQualifiedName("xml", "space"));
                xmlAppendChild(domNode, attr);
            }
            attr.value = "preserve";
        }
        domNode.appendChild(textNode);
        return domNode;
    };

    var xmlAttributes = function (element, onAttributeCallback) {
        /// <summary>Iterates through the XML element's attributes and invokes the callback function for each one.</summary>
        /// <param name="element">Wrapped element to iterate over.</param>
        /// <param name="onAttributeCallback" type="Function">Callback function to invoke with wrapped attribute nodes.</param>

        var attributes = element.attributes;
        var i, len;
        for (i = 0, len = attributes.length; i < len; i++) {
            onAttributeCallback(attributes.item(i));
        }
    };

    var xmlAttributeValue = function (domNode, localName, nsURI) {
        /// <summary>Returns the value of a DOM element's attribute.</summary>
        /// <param name="domNode">DOM node for the owning element.</param>
        /// <param name="localName" type="String">Local name of the attribute.</param>
        /// <param name="nsURI" type="String">Namespace URI of the attribute.</param>
        /// <returns type="String" maybeNull="true">The attribute value, null if not found.</returns>

        var attribute = xmlAttributeNode(domNode, localName, nsURI);
        return attribute ? xmlNodeValue(attribute) : null;
    };

    var xmlAttributeNode = function (domNode, localName, nsURI) {
        /// <summary>Gets an attribute node from a DOM element.</summary>
        /// <param name="domNode">DOM node for the owning element.</param>
        /// <param name="localName" type="String">Local name of the attribute.</param>
        /// <param name="nsURI" type="String">Namespace URI of the attribute.</param>
        /// <returns>The attribute node, null if not found.</returns>

        var attributes = domNode.attributes;
        if (attributes.getNamedItemNS) {
            return attributes.getNamedItemNS(nsURI || null, localName);
        }

        return attributes.getQualifiedItem(localName, nsURI) || null;
    };

    var xmlBaseURI = function (domNode, baseURI) {
        /// <summary>Gets the value of the xml:base attribute on the specified element.</summary>
        /// <param name="domNode">Element to get xml:base attribute value from.</param>
        /// <param name="baseURI" mayBeNull="true" optional="true">Base URI used to normalize the value of the xml:base attribute.</param> 
        /// <returns type="String">Value of the xml:base attribute if found; the baseURI or null otherwise.</returns>

        var base = xmlAttributeNode(domNode, "base", xmlNS);
        return (base ? normalizeURI(base.value, baseURI) : baseURI) || null;
    };


    var xmlChildElements = function (domNode, onElementCallback) {
        /// <summary>Iterates through the XML element's child DOM elements and invokes the callback function for each one.</summary>
        /// <param name="element">DOM Node containing the DOM elements to iterate over.</param>
        /// <param name="onElementCallback" type="Function">Callback function to invoke for each child DOM element.</param>

        xmlTraverse(domNode, /*recursive*/false, function (child) {
            if (child.nodeType === 1) {
                onElementCallback(child);
            }
            // continue traversing.
            return true;
        });
    };

    var xmlFindElementByPath = function (root, namespaceURI, path) {
        /// <summary>Gets the descendant element under root that corresponds to the specified path and namespace URI.</summary>
        /// <param name="root">DOM element node from which to get the descendant element.</param>
        /// <param name="namespaceURI" type="String">The namespace URI of the element to match.</param>
        /// <param name="path" type="String">Path to the desired descendant element.</param>
        /// <returns>The element specified by path and namespace URI.</returns>
        /// <remarks>
        ///     All the elements in the path are matched against namespaceURI. 
        ///     The function will stop searching on the first element that doesn't match the namespace and the path.
        /// </remarks>

        var parts = path.split("/");
        var i, len;
        for (i = 0, len = parts.length; i < len; i++) {
            root = root && xmlFirstChildElement(root, namespaceURI, parts[i]);
        }
        return root || null;
    };

    var xmlFindNodeByPath = function (root, namespaceURI, path) {
        /// <summary>Gets the DOM element or DOM attribute node under root that corresponds to the specified path and namespace URI.</summary>
        /// <param name="root">DOM element node from which to get the descendant node.</param>
        /// <param name="namespaceURI" type="String">The namespace URI of the node to match.</param>
        /// <param name="path" type="String">Path to the desired descendant node.</param>
        /// <returns>The node specified by path and namespace URI.</returns>
        /// <remarks>
        ///     This function will traverse the path and match each node associated to a path segement against the namespace URI.
        ///     The traversal stops when the whole path has been exahusted or a node that doesn't belogong the specified namespace is encountered.
        ///
        ///     The last segment of the path may be decorated with a starting @ character to indicate that the desired node is a DOM attribute.
        /// </remarks>

        var lastSegmentStart = path.lastIndexOf("/");
        var nodePath = path.substring(lastSegmentStart + 1);
        var parentPath = path.substring(0, lastSegmentStart);

        var node = parentPath ? xmlFindElementByPath(root, namespaceURI, parentPath) : root;
        if (node) {
            if (nodePath.charAt(0) === "@") {
                return xmlAttributeNode(node, nodePath.substring(1), namespaceURI);
            }
            return xmlFirstChildElement(node, namespaceURI, nodePath);
        }
        return null;
    };

    var xmlFirstChildElement = function (domNode, namespaceURI, localName) {
        /// <summary>Returns the first child DOM element under the specified DOM node that matches the specified namespace URI and local name.</summary>
        /// <param name="domNode">DOM node from which the child DOM element is going to be retrieved.</param>
        /// <param name="namespaceURI" type="String" optional="true">The namespace URI of the element to match.</param>
        /// <param name="localName" type="String" optional="true">Name of the element to match.</param> 
        /// <returns>The node's first child DOM element that matches the specified namespace URI and local name; null otherwise.</returns>

        return xmlFirstElementMaybeRecursive(domNode, namespaceURI, localName, /*recursive*/false);
    };

    var xmlFirstDescendantElement = function (domNode, namespaceURI, localName) {
        /// <summary>Returns the first descendant DOM element under the specified DOM node that matches the specified namespace URI and local name.</summary>
        /// <param name="domNode">DOM node from which the descendant DOM element is going to be retrieved.</param>
        /// <param name="namespaceURI" type="String" optional="true">The namespace URI of the element to match.</param>
        /// <param name="localName" type="String" optional="true">Name of the element to match.</param> 
        /// <returns>The node's first descendant DOM element that matches the specified namespace URI and local name; null otherwise.</returns>

        if (domNode.getElementsByTagNameNS) {
            var result = domNode.getElementsByTagNameNS(namespaceURI, localName);
            return result.length > 0 ? result[0] : null;
        }
        return xmlFirstElementMaybeRecursive(domNode, namespaceURI, localName, /*recursive*/true);
    };

    var xmlFirstElementMaybeRecursive = function (domNode, namespaceURI, localName, recursive) {
        /// <summary>Returns the first descendant DOM element under the specified DOM node that matches the specified namespace URI and local name.</summary>
        /// <param name="domNode">DOM node from which the descendant DOM element is going to be retrieved.</param>
        /// <param name="namespaceURI" type="String" optional="true">The namespace URI of the element to match.</param>
        /// <param name="localName" type="String" optional="true">Name of the element to match.</param> 
        /// <param name="recursive" type="Boolean">
        ///     True if the search should include all the descendants of the DOM node. 
        ///     False if the search should be scoped only to the direct children of the DOM node.
        /// </param>
        /// <returns>The node's first descendant DOM element that matches the specified namespace URI and local name; null otherwise.</returns>

        var firstElement = null;
        xmlTraverse(domNode, recursive, function (child) {
            if (child.nodeType === 1) {
                var isExpectedNamespace = !namespaceURI || xmlNamespaceURI(child) === namespaceURI;
                var isExpectedNodeName = !localName || xmlLocalName(child) === localName;

                if (isExpectedNamespace && isExpectedNodeName) {
                    firstElement = child;
                }
            }
            return firstElement === null;
        });
        return firstElement;
    };

    var xmlInnerText = function (xmlElement) {
        /// <summary>Gets the concatenated value of all immediate child text and CDATA nodes for the specified element.</summary>
        /// <param name="domElement">Element to get values for.</param>
        /// <returns type="String">Text for all direct children.</returns>

        var result = null;
        var root = (xmlElement.nodeType === 9 && xmlElement.documentElement) ? xmlElement.documentElement : xmlElement;
        var whitespaceAlreadyRemoved = root.ownerDocument.preserveWhiteSpace === false;
        var whitespacePreserveContext;

        xmlTraverse(root, false, function (child) {
            if (child.nodeType === 3 || child.nodeType === 4) {
                // isElementContentWhitespace indicates that this is 'ignorable whitespace',
                // but it's not defined by all browsers, and does not honor xml:space='preserve'
                // in some implementations.
                //
                // If we can't tell either way, we walk up the tree to figure out whether
                // xml:space is set to preserve; otherwise we discard pure-whitespace.
                //
                // For example <a>  <b>1</b></a>. The space between <a> and <b> is usually 'ignorable'.
                var text = xmlNodeValue(child);
                var shouldInclude = whitespaceAlreadyRemoved || !isWhitespace(text);
                if (!shouldInclude) {
                    // Walk up the tree to figure out whether we are in xml:space='preserve' context
                    // for the cursor (needs to happen only once).
                    if (whitespacePreserveContext === undefined) {
                        whitespacePreserveContext = isWhitespacePreserveContext(root);
                    }

                    shouldInclude = whitespacePreserveContext;
                }

                if (shouldInclude) {
                    if (!result) {
                        result = text;
                    } else {
                        result += text;
                    }
                }
            }
            // Continue traversing?
            return true;
        });
        return result;
    };

    var xmlLocalName = function (domNode) {
        /// <summary>Returns the localName of a XML node.</summary>
        /// <param name="domNode">DOM node to get the value from.</param>
        /// <returns type="String">localName of domNode.</returns>

        return domNode.localName || domNode.baseName;
    };

    var xmlNamespaceURI = function (domNode) {
        /// <summary>Returns the namespace URI of a XML node.</summary>
        /// <param name="node">DOM node to get the value from.</param>
        /// <returns type="String">Namespace URI of domNode.</returns>

        return domNode.namespaceURI || null;
    };

    var xmlNodeValue = function (domNode) {
        /// <summary>Returns the value or the inner text of a XML node.</summary>
        /// <param name="node">DOM node to get the value from.</param>
        /// <returns>Value of the domNode or the inner text if domNode represents a DOM element node.</returns>
        
        if (domNode.nodeType === 1) {
            return xmlInnerText(domNode);
        }
        return domNode.nodeValue;
    };

    var xmlTraverse = function (domNode, recursive, onChildCallback) {
        /// <summary>Walks through the descendants of the domNode and invokes a callback for each node.</summary>
        /// <param name="domNode">DOM node whose descendants are going to be traversed.</param>
        /// <param name="recursive" type="Boolean">
        ///    True if the traversal should include all the descenants of the DOM node.
        ///    False if the traversal should be scoped only to the direct children of the DOM node.
        /// </param>
        /// <returns type="String">Namespace URI of node.</returns>

        var subtrees = [];
        var child = domNode.firstChild;
        var proceed = true;
        while (child && proceed) {
            proceed = onChildCallback(child);
            if (proceed) {
                if (recursive && child.firstChild) {
                    subtrees.push(child.firstChild);
                }
                child = child.nextSibling || subtrees.shift();
            }
        }
    };

    var xmlSiblingElement = function (domNode, namespaceURI, localName) {
        /// <summary>Returns the next sibling DOM element of the specified DOM node.</summary>
        /// <param name="domNode">DOM node from which the next sibling is going to be retrieved.</param>
        /// <param name="namespaceURI" type="String" optional="true">The namespace URI of the element to match.</param>
        /// <param name="localName" type="String" optional="true">Name of the element to match.</param> 
        /// <returns>The node's next sibling DOM element, null if there is none.</returns>

        var sibling = domNode.nextSibling;
        while (sibling) {
            if (sibling.nodeType === 1) {
                var isExpectedNamespace = !namespaceURI || xmlNamespaceURI(sibling) === namespaceURI;
                var isExpectedNodeName = !localName || xmlLocalName(sibling) === localName;

                if (isExpectedNamespace && isExpectedNodeName) {
                    return sibling;
                }
            }
            sibling = sibling.nextSibling;
        }
        return null;
    };

    var xmlDom = function () {
        /// <summary>Creates a new empty DOM document node.</summary>
        /// <returns>New DOM document node.</returns>
        /// <remarks>
        ///    This function will first try to create a native DOM document using 
        ///    the browsers createDocument function.  If the browser doesn't 
        ///    support this but supports ActiveXObject, then an attempt to create 
        ///    an MSXML 6.0 DOM will be made. If this attempt fails too, then an attempt
        ///    for creating an MXSML 3.0 DOM will be made.  If this last attemp fails or 
        ///    the browser doesn't support ActiveXObject then an exception will be thrown.
        /// </remarks>

        var implementation = window.document.implementation;
        return (implementation && implementation.createDocument) ?
           implementation.createDocument(null, null, null) :
           msXmlDom();
    };

    var xmlAppendChildren = function (parent, children) {
        /// <summary>Appends a collection of child nodes or string values to a parent DOM node.</summary>
        /// <param name="parent">DOM node to which the children will be appended.</param>
        /// <param name="children" type="Array">Array containing DOM nodes or string values that will be appended to the parent.</param>
        /// <returns>The parent with the appended children or string values.</returns>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended to the parent.
        /// </remarks>

        if (!isArray(children)) {
            return xmlAppendChild(parent, children);
        }

        var i, len;
        for (i = 0, len = children.length; i < len; i++) {
            children[i] && xmlAppendChild(parent, children[i]);
        }
        return parent;
    };

    var xmlAppendChild = function (parent, child) {
        /// <summary>Appends a child node or a string value to a parent DOM node.</summary>
        /// <param name="parent">DOM node to which the child will be appended.</param>
        /// <param name="child">Child DOM node or string value to append to the parent.</param>
        /// <returns>The parent with the appended child or string value.</returns>
        /// <remarks>
        ///    If child is a string value, then a new DOM text node is going to be created 
        ///    for it and then appended to the parent.
        /// </remarks>

        if (child) {
            if (typeof child === "string") {
                return xmlAppendText(parent, xmlNewText(parent.ownerDocument, child));
            }
            if (child.nodeType === 2) {
                parent.setAttributeNodeNS ? parent.setAttributeNodeNS(child) : parent.setAttributeNode(child);
            } else {
                parent.appendChild(child);
            }
        }
        return parent;
    };

    // ##### BEGIN: MODIFIED BY SAP
    // polyfill for document.createAttributeNS which was removed from Chrome 34
    // but will be added back in, see:
    // http://datajs.codeplex.com/workitem/1272
    // https://code.google.com/p/chromium/issues/detail?id=347506
    // https://codereview.chromium.org/243333003
    var _createAttributeNS = function(namespaceURI, qualifiedName) {
        var dummy = document.createElement('dummy');
        dummy.setAttributeNS(namespaceURI, qualifiedName, '');
        var attr = dummy.attributes[0];
        dummy.removeAttributeNode(attr);
        return attr;
    };
    // ##### END: MODIFIED BY SAP

    var xmlNewAttribute = function (dom, namespaceURI, qualifiedName, value) {
        /// <summary>Creates a new DOM attribute node.</summary>
        /// <param name="dom">DOM document used to create the attribute.</param>
        /// <param name="prefix" type="String">Namespace prefix.</param>
        /// <param name="namespaceURI" type="String">Namespace URI.</param>
        /// <returns>DOM attribute node for the namespace declaration.</returns>

        // ##### BEGIN: MODIFIED BY SAP
        // added usage of _createAttributeNS as fallback (see function above)
        var attribute =
            dom.createAttributeNS && dom.createAttributeNS(namespaceURI, qualifiedName) ||
            "createNode" in dom && dom.createNode(2, qualifiedName, namespaceURI || undefined) ||
            _createAttributeNS(namespaceURI, qualifiedName);
        // ##### END: MODIFIED BY SAP

        attribute.value = value || "";
        return attribute;
    };

    var xmlNewElement = function (dom, nampespaceURI, qualifiedName, children) {
        /// <summary>Creates a new DOM element node.</summary>
        /// <param name="dom">DOM document used to create the DOM element.</param>
        /// <param name="namespaceURI" type="String">Namespace URI of the new DOM element.</param>
        /// <param name="qualifiedName" type="String">Qualified name in the form of "prefix:name" of the new DOM element.</param>
        /// <param name="children" type="Array" optional="true">
        ///     Collection of child DOM nodes or string values that are going to be appended to the new DOM element.
        /// </param>
        /// <returns>New DOM element.</returns>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended to the new DOM element.
        /// </remarks>

        var element =
            dom.createElementNS && dom.createElementNS(nampespaceURI, qualifiedName) ||
            dom.createNode(1, qualifiedName, nampespaceURI || undefined);

        return xmlAppendChildren(element, children || []);
    };

    var xmlNewNSDeclaration = function (dom, namespaceURI, prefix) {
        /// <summary>Creates a namespace declaration attribute.</summary>
        /// <param name="dom">DOM document used to create the attribute.</param>
        /// <param name="namespaceURI" type="String">Namespace URI.</param>
        /// <param name="prefix" type="String">Namespace prefix.</param>
        /// <returns>DOM attribute node for the namespace declaration.</returns>

        return xmlNewAttribute(dom, xmlnsNS, xmlQualifiedName("xmlns", prefix), namespaceURI);
    };

    var xmlNewFragment = function (dom, text) {
        /// <summary>Creates a new DOM document fragment node for the specified xml text.</summary>
        /// <param name="dom">DOM document from which the fragment node is going to be created.</param>
        /// <param name="text" type="String" mayBeNull="false">XML text to be represented by the XmlFragment.</param>
        /// <returns>New DOM document fragment object.</returns>

        var value = "<c>" + text + "</c>";
        var tempDom = xmlParse(value);
        var tempRoot = tempDom.documentElement;
        var imported = ("importNode" in dom) ? dom.importNode(tempRoot, true) : tempRoot;
        var fragment = dom.createDocumentFragment();

        var importedChild = imported.firstChild;
        while (importedChild) {
            fragment.appendChild(importedChild);
            importedChild = importedChild.nextSibling;
        }
        return fragment;
    };

    var xmlNewText = function (dom, text) {
        /// <summary>Creates new DOM text node.</summary>
        /// <param name="dom">DOM document used to create the text node.</param>
        /// <param name="text" type="String">Text value for the DOM text node.</param>
        /// <returns>DOM text node.</returns>

        return dom.createTextNode(text);
    };

    var xmlNewNodeByPath = function (dom, root, namespaceURI, prefix, path) {
        /// <summary>Creates a new DOM element or DOM attribute node as specified by path and appends it to the DOM tree pointed by root.</summary>
        /// <param name="dom">DOM document used to create the new node.</param>
        /// <param name="root">DOM element node used as root of the subtree on which the new nodes are going to be created.</param>
        /// <param name="namespaceURI" type="String">Namespace URI of the new DOM element or attribute.</param>
        /// <param name="namespacePrefix" type="String">Prefix used to qualify the name of the new DOM element or attribute.</param>
        /// <param name="Path" type="String">Path string describing the location of the new DOM element or attribute from the root element.</param>
        /// <returns>DOM element or attribute node for the last segment of the path.</returns>
        /// <remarks>
        ///     This function will traverse the path and will create a new DOM element with the specified namespace URI and prefix 
        ///     for each segment that doesn't have a matching element under root.
        ///
        ///     The last segment of the path may be decorated with a starting @ character. In this case a new DOM attribute node 
        ///     will be created.
        /// </remarks>

        var name = "";
        var parts = path.split("/");
        var xmlFindNode = xmlFirstChildElement;
        var xmlNewNode = xmlNewElement;
        var xmlNode = root;

        var i, len;
        for (i = 0, len = parts.length; i < len; i++) {
            name = parts[i];
            if (name.charAt(0) === "@") {
                name = name.substring(1);
                xmlFindNode = xmlAttributeNode;
                xmlNewNode = xmlNewAttribute;
            }

            var childNode = xmlFindNode(xmlNode, namespaceURI, name);
            if (!childNode) {
                childNode = xmlNewNode(dom, namespaceURI, xmlQualifiedName(prefix, name));
                xmlAppendChild(xmlNode, childNode);
            }
            xmlNode = childNode;
        }
        return xmlNode;
    };

    var xmlSerialize = function (domNode) {
        /// <summary>
        /// Returns the text representation of the document to which the specified node belongs.
        /// </summary>
        /// <param name="root">Wrapped element in the document to serialize.</param>
        /// <returns type="String">Serialized document.</returns>

        var xmlSerializer = window.XMLSerializer;
        if (xmlSerializer) {
            var serializer = new xmlSerializer();
            return serializer.serializeToString(domNode);
        }

        if (domNode.xml) {
            return domNode.xml;
        }

        throw { message: "XML serialization unsupported" };
    };

    var xmlSerializeDescendants = function (domNode) {
        /// <summary>Returns the XML representation of the all the descendants of the node.</summary>
        /// <param name="domNode" optional="false" mayBeNull="false">Node to serialize.</param>
        /// <returns type="String">The XML representation of all the descendants of the node.</returns>

        var children = domNode.childNodes;
        var i, len = children.length;
        if (len === 0) {
            return "";
        }

        // Some implementations of the XMLSerializer don't deal very well with fragments that
        // don't have a DOMElement as their first child. The work around is to wrap all the 
        // nodes in a dummy root node named "c", serialize it and then just extract the text between 
        // the <c> and the </c> substrings.

        var dom = domNode.ownerDocument;
        var fragment = dom.createDocumentFragment();
        var fragmentRoot = dom.createElement("c");

        fragment.appendChild(fragmentRoot);
        // Move the children to the fragment tree.
        for (i = 0; i < len; i++) {
            fragmentRoot.appendChild(children[i]);
        }

        var xml = xmlSerialize(fragment);
        xml = xml.substr(3, xml.length - 7);

        // Move the children back to the original dom tree.
        for (i = 0; i < len; i++) {
            domNode.appendChild(fragmentRoot.childNodes[i]);
        }

        return xml;
    };

    var xmlSerializeNode = function (domNode) {
        /// <summary>Returns the XML representation of the node and all its descendants.</summary>
        /// <param name="domNode" optional="false" mayBeNull="false">Node to serialize.</param>
        /// <returns type="String">The XML representation of the node and all its descendants.</returns>

        var xml = domNode.xml;
        if (xml !== undefined) {
            return xml;
        }

        if (window.XMLSerializer) {
            var serializer = new window.XMLSerializer();
            return serializer.serializeToString(domNode);
        }

        throw { message: "XML serialization unsupported" };
    };




    var forwardCall = function (thisValue, name, returnValue) {
        /// <summary>Creates a new function to forward a call.</summary>
        /// <param name="thisValue" type="Object">Value to use as the 'this' object.</param>
        /// <param name="name" type="String">Name of function to forward to.</param>
        /// <param name="returnValue" type="Object">Return value for the forward call (helps keep identity when chaining calls).</param>
        /// <returns type="Function">A new function that will forward a call.</returns>

        return function () {
            thisValue[name].apply(thisValue, arguments);
            return returnValue;
        };
    };

    var DjsDeferred = function () {
        /// <summary>Initializes a new DjsDeferred object.</summary>
        /// <remarks>
        /// Compability Note A - Ordering of callbacks through chained 'then' invocations
        ///
        /// The Wiki entry at http://wiki.commonjs.org/wiki/Promises/A
        /// implies that .then() returns a distinct object.
        ////
        /// For compatibility with http://api.jquery.com/category/deferred-object/
        /// we return this same object. This affects ordering, as
        /// the jQuery version will fire callbacks in registration
        /// order regardless of whether they occur on the result
        /// or the original object.
        ///
        /// Compability Note B - Fulfillment value
        /// 
        /// The Wiki entry at http://wiki.commonjs.org/wiki/Promises/A
        /// implies that the result of a success callback is the
        /// fulfillment value of the object and is received by
        /// other success callbacks that are chained.
        ///
        /// For compatibility with http://api.jquery.com/category/deferred-object/
        /// we disregard this value instead.
        /// </remarks>

        this._arguments = undefined;
        this._done = undefined;
        this._fail = undefined;
        this._resolved = false;
        this._rejected = false;
    };

    DjsDeferred.prototype = {
        then: function (fulfilledHandler, errorHandler /*, progressHandler */) {
            /// <summary>Adds success and error callbacks for this deferred object.</summary>
            /// <param name="fulfilledHandler" type="Function" mayBeNull="true" optional="true">Success callback.</param>
            /// <param name="errorHandler" type="Function" mayBeNull="true" optional="true">Error callback.</param>
            /// <remarks>See Compatibility Note A.</remarks>

            if (fulfilledHandler) {
                if (!this._done) {
                    this._done = [fulfilledHandler];
                } else {
                    this._done.push(fulfilledHandler);
                }
            }

            if (errorHandler) {
                if (!this._fail) {
                    this._fail = [errorHandler];
                } else {
                    this._fail.push(errorHandler);
                }
            }

            //// See Compatibility Note A in the DjsDeferred constructor.
            //// if (!this._next) {
            ////    this._next = createDeferred();
            //// } 
            //// return this._next.promise();

            if (this._resolved) {
                this.resolve.apply(this, this._arguments);
            } else if (this._rejected) {
                this.reject.apply(this, this._arguments);
            }

            return this;
        },

        resolve: function (/* args */) {
            /// <summary>Invokes success callbacks for this deferred object.</summary>
            /// <remarks>All arguments are forwarded to success callbacks.</remarks>


            if (this._done) {
                var i, len;
                for (i = 0, len = this._done.length; i < len; i++) {
                    //// See Compability Note B - Fulfillment value.
                    //// var nextValue = 
                    this._done[i].apply(null, arguments);
                }

                //// See Compatibility Note A in the DjsDeferred constructor.
                //// this._next.resolve(nextValue);
                //// delete this._next;

                this._done = undefined;
                this._resolved = false;
                this._arguments = undefined;
            } else {
                this._resolved = true;
                this._arguments = arguments;
            }
        },

        reject: function (/* args */) {
            /// <summary>Invokes error callbacks for this deferred object.</summary>
            /// <remarks>All arguments are forwarded to error callbacks.</remarks>
            if (this._fail) {
                var i, len;
                for (i = 0, len = this._fail.length; i < len; i++) {
                    this._fail[i].apply(null, arguments);
                }

                this._fail = undefined;
                this._rejected = false;
                this._arguments = undefined;
            } else {
                this._rejected = true;
                this._arguments = arguments;
            }
        },

        promise: function () {
            /// <summary>Returns a version of this object that has only the read-only methods available.</summary>
            /// <returns>An object with only the promise object.</returns>

            var result = {};
            result.then = forwardCall(this, "then", result);
            return result;
        }
    };

    var createDeferred = function () {
        /// <summary>Creates a deferred object.</summary>
        /// <returns type="DjsDeferred">
        /// A new deferred object. If jQuery is installed, then a jQuery
        /// Deferred object is returned, which provides a superset of features.
        /// </returns>

        if (window.jQuery && window.jQuery.Deferred) {
            return new window.jQuery.Deferred();
        } else {
            return new DjsDeferred();
        }
    };


    

    var dataItemTypeName = function (value, metadata) {
        /// <summary>Gets the type name of a data item value that belongs to a feed, an entry, a complex type property, or a collection property.</summary>
        /// <param name="value">Value of the data item from which the type name is going to be retrieved.</param>
        /// <param name="metadata" type="object" optional="true">Object containing metadata about the data tiem.</param>
        /// <remarks>
        ///    This function will first try to get the type name from the data item's value itself if it is an object with a __metadata property; otherwise 
        ///    it will try to recover it from the metadata.  If both attempts fail, it will return null.
        /// </remarks>
        /// <returns type="String">Data item type name; null if the type name cannot be found within the value or the metadata</returns>

        var valueTypeName = ((value && value.__metadata) || {}).type;
        return valueTypeName || (metadata ? metadata.type : null);
    };

    var EDM = "Edm.";
    var EDM_BINARY = EDM + "Binary";
    var EDM_BOOLEAN = EDM + "Boolean";
    var EDM_BYTE = EDM + "Byte";
    var EDM_DATETIME = EDM + "DateTime";
    var EDM_DATETIMEOFFSET = EDM + "DateTimeOffset";
    var EDM_DECIMAL = EDM + "Decimal";
    var EDM_DOUBLE = EDM + "Double";
    var EDM_GUID = EDM + "Guid";
    var EDM_INT16 = EDM + "Int16";
    var EDM_INT32 = EDM + "Int32";
    var EDM_INT64 = EDM + "Int64";
    var EDM_SBYTE = EDM + "SByte";
    var EDM_SINGLE = EDM + "Single";
    var EDM_STRING = EDM + "String";
    var EDM_TIME = EDM + "Time";

    var EDM_GEOGRAPHY = EDM + "Geography";
    var EDM_GEOGRAPHY_POINT = EDM_GEOGRAPHY + "Point";
    var EDM_GEOGRAPHY_LINESTRING = EDM_GEOGRAPHY + "LineString";
    var EDM_GEOGRAPHY_POLYGON = EDM_GEOGRAPHY + "Polygon";
    var EDM_GEOGRAPHY_COLLECTION = EDM_GEOGRAPHY + "Collection";
    var EDM_GEOGRAPHY_MULTIPOLYGON = EDM_GEOGRAPHY + "MultiPolygon";
    var EDM_GEOGRAPHY_MULTILINESTRING = EDM_GEOGRAPHY + "MultiLineString";
    var EDM_GEOGRAPHY_MULTIPOINT = EDM_GEOGRAPHY + "MultiPoint";

    var EDM_GEOMETRY = EDM + "Geometry";
    var EDM_GEOMETRY_POINT = EDM_GEOMETRY + "Point";
    var EDM_GEOMETRY_LINESTRING = EDM_GEOMETRY + "LineString";
    var EDM_GEOMETRY_POLYGON = EDM_GEOMETRY + "Polygon";
    var EDM_GEOMETRY_COLLECTION = EDM_GEOMETRY + "Collection";
    var EDM_GEOMETRY_MULTIPOLYGON = EDM_GEOMETRY + "MultiPolygon";
    var EDM_GEOMETRY_MULTILINESTRING = EDM_GEOMETRY + "MultiLineString";
    var EDM_GEOMETRY_MULTIPOINT = EDM_GEOMETRY + "MultiPoint";

    var GEOJSON_POINT = "Point";
    var GEOJSON_LINESTRING = "LineString";
    var GEOJSON_POLYGON = "Polygon";
    var GEOJSON_MULTIPOINT = "MultiPoint";
    var GEOJSON_MULTILINESTRING = "MultiLineString";
    var GEOJSON_MULTIPOLYGON = "MultiPolygon";
    var GEOJSON_GEOMETRYCOLLECTION = "GeometryCollection";

    var primitiveEdmTypes = [
        EDM_STRING,
        EDM_INT32,
        EDM_INT64,
        EDM_BOOLEAN,
        EDM_DOUBLE,
        EDM_SINGLE,
        EDM_DATETIME,
        EDM_DATETIMEOFFSET,
        EDM_TIME,
        EDM_DECIMAL,
        EDM_GUID,
        EDM_BYTE,
        EDM_INT16,
        EDM_SBYTE,
        EDM_BINARY
    ];

    var geometryEdmTypes = [
        EDM_GEOMETRY,
        EDM_GEOMETRY_POINT,
        EDM_GEOMETRY_LINESTRING,
        EDM_GEOMETRY_POLYGON,
        EDM_GEOMETRY_COLLECTION,
        EDM_GEOMETRY_MULTIPOLYGON,
        EDM_GEOMETRY_MULTILINESTRING,
        EDM_GEOMETRY_MULTIPOINT
    ];

    var geographyEdmTypes = [
        EDM_GEOGRAPHY,
        EDM_GEOGRAPHY_POINT,
        EDM_GEOGRAPHY_LINESTRING,
        EDM_GEOGRAPHY_POLYGON,
        EDM_GEOGRAPHY_COLLECTION,
        EDM_GEOGRAPHY_MULTIPOLYGON,
        EDM_GEOGRAPHY_MULTILINESTRING,
        EDM_GEOGRAPHY_MULTIPOINT
    ];

    var forEachSchema = function (metadata, callback) {
        /// <summary>Invokes a function once per schema in metadata.</summary>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <param name="callback" type="Function">Callback function to invoke once per schema.</param>
        /// <returns>
        /// The first truthy value to be returned from the callback; null or the last falsy value otherwise.
        /// </returns>

        if (!metadata) {
            return null;
        }

        if (isArray(metadata)) {
            var i, len, result;
            for (i = 0, len = metadata.length; i < len; i++) {
                result = forEachSchema(metadata[i], callback);
                if (result) {
                    return result;
                }
            }

            return null;
        } else {
            if (metadata.dataServices) {
                return forEachSchema(metadata.dataServices.schema, callback);
            }

            return callback(metadata);
        }
    };

    var formatMilliseconds = function (ms, ns) {
        /// <summary>Formats a millisecond and a nanosecond value into a single string.</summary>
        /// <param name="ms" type="Number" mayBeNull="false">Number of milliseconds to format.</param>
        /// <param name="ns" type="Number" mayBeNull="false">Number of nanoseconds to format.</param>
        /// <returns type="String">Formatted text.</returns>
        /// <remarks>If the value is already as string it's returned as-is.</remarks>

        // Avoid generating milliseconds if not necessary.
        if (ms === 0) {
            ms = "";
        } else {
            ms = "." + formatNumberWidth(ms.toString(), 3);
        }
        if (ns > 0) {
            if (ms === "") {
                ms = ".000";
            }
            ms += formatNumberWidth(ns.toString(), 4);
        }
        return ms;
    };

    // ##### BEGIN: MODIFIED BY SAP
    var formatDateTimeOffsetJSON = function (value) {
    	return "\/Date("+value.getTime()+")\/";
    };
    // ##### END: MODIFIED BY SAP
    
    var formatDateTimeOffset = function (value) {
        /// <summary>Formats a DateTime or DateTimeOffset value a string.</summary>
        /// <param name="value" type="Date" mayBeNull="false">Value to format.</param>
        /// <returns type="String">Formatted text.</returns>
        /// <remarks>If the value is already as string it's returned as-is.</remarks>

        if (typeof value === "string") {
            return value;
        }

        var hasOffset = isDateTimeOffset(value);
        var offset = getCanonicalTimezone(value.__offset);
        if (hasOffset && offset !== "Z") {
            // We're about to change the value, so make a copy.
            value = new Date(value.valueOf());

            var timezone = parseTimezone(offset);
            var hours = value.getUTCHours() + (timezone.d * timezone.h);
            var minutes = value.getMinutes() + (timezone.d * timezone.m);

            value.setUTCHours(hours, minutes);
        } else if (!hasOffset) {
            // Don't suffix a 'Z' for Edm.DateTime values.
            offset = "";
        }

        var year = value.getUTCFullYear();
        var month = value.getUTCMonth() + 1;
        var sign = "";
        if (year <= 0) {
            year = -(year - 1);
            sign = "-";
        }

        var ms = formatMilliseconds(value.getUTCMilliseconds(), value.__ns);

        return sign +
            formatNumberWidth(year, 4) + "-" +
            formatNumberWidth(month, 2) + "-" +
            formatNumberWidth(value.getUTCDate(), 2) + "T" +
            formatNumberWidth(value.getUTCHours(), 2) + ":" +
            formatNumberWidth(value.getUTCMinutes(), 2) + ":" +
            formatNumberWidth(value.getUTCSeconds(), 2) +
            ms + offset;
    };

    var formatDuration = function (value) {
        /// <summary>Converts a duration to a string in xsd:duration format.</summary>
        /// <param name="value" type="Object">Object with ms and __edmType properties.</param>
        /// <returns type="String">String representation of the time object in xsd:duration format.</returns>

        var ms = value.ms;

        var sign = "";
        if (ms < 0) {
            sign = "-";
            ms = -ms;
        }

        var days = Math.floor(ms / 86400000);
        ms -= 86400000 * days;
        var hours = Math.floor(ms / 3600000);
        ms -= 3600000 * hours;
        var minutes = Math.floor(ms / 60000);
        ms -= 60000 * minutes;
        var seconds = Math.floor(ms / 1000);
        ms -= seconds * 1000;

        return sign + "P" +
               formatNumberWidth(days, 2) + "DT" +
               formatNumberWidth(hours, 2) + "H" +
               formatNumberWidth(minutes, 2) + "M" +
               formatNumberWidth(seconds, 2) +
               formatMilliseconds(ms, value.ns) + "S";
    };

    var formatNumberWidth = function (value, width, append) {
        /// <summary>Formats the specified value to the given width.</summary>
        /// <param name="value" type="Number">Number to format (non-negative).</param>
        /// <param name="width" type="Number">Minimum width for number.</param>
        /// <param name="append" type="Boolean">Flag indicating if the value is padded at the beginning (false) or at the end (true).</param>
        /// <returns type="String">Text representation.</returns>
        var result = value.toString(10);
        while (result.length < width) {
            if (append) {
                result += "0";
            } else {
                result = "0" + result;
            }
        }

        return result;
    };

    var getCanonicalTimezone = function (timezone) {
        /// <summary>Gets the canonical timezone representation.</summary>
        /// <param name="timezone" type="String">Timezone representation.</param>
        /// <returns type="String">An 'Z' string if the timezone is absent or 0; the timezone otherwise.</returns>

        return (!timezone || timezone === "Z" || timezone === "+00:00" || timezone === "-00:00") ? "Z" : timezone;
    };

    var getCollectionType = function (typeName) {
        /// <summary>Gets the type of a collection type name.</summary>
        /// <param name="typeName" type="String">Type name of the collection.</param>
        /// <returns type="String">Type of the collection; null if the type name is not a collection type.</returns>

        if (typeof typeName === "string") {
            var end = typeName.indexOf(")", 10);
            if (typeName.indexOf("Collection(") === 0 && end > 0) {
                return typeName.substring(11, end);
            }
        }
        return null;
    };

    var invokeRequest = function (request, success, error, handler, httpClient, context) {
        /// <summary>Sends a request containing OData payload to a server.</summary>
        /// <param name="request">Object that represents the request to be sent..</param>
        /// <param name="success">Callback for a successful read operation.</param>
        /// <param name="error">Callback for handling errors.</param>
        /// <param name="handler">Handler for data serialization.</param>
        /// <param name="httpClient">HTTP client layer.</param>
        /// <param name="context">Context used for processing the request</param>

        return httpClient.request(request, function (response) {
            try {
                if (response.headers) {
                    normalizeHeaders(response.headers);
                }

                if (response.data === undefined && response.statusCode !== 204) {
                    handler.read(response, context);
                }
            } catch (err) {
                if (err.request === undefined) {
                    err.request = request;
                }
                if (err.response === undefined) {
                    err.response = response;
                }
                error(err);
                return;
            }
            // ##### BEGIN: MODIFIED BY SAP
            // errors in success handler for sync requests result in error handler calls. So here we fix this. 
            try {
            	success(response.data, response);				
			} catch (err) {
				err.bIsSuccessHandlerError = true;
				throw err;
			}
			// ##### END: MODIFIED BY SAP
        }, error);
    };

    var isBatch = function (value) {
        /// <summary>Tests whether a value is a batch object in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <returns type="Boolean">True is the value is a batch object; false otherwise.</returns>

        return isComplex(value) && isArray(value.__batchRequests);
    };

    // Regular expression used for testing and parsing for a collection type.
    var collectionTypeRE = /Collection\((.*)\)/;

    var isCollection = function (value, typeName) {
        /// <summary>Tests whether a value is a collection value in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <param name="typeName" type="Sting">Type name of the value. This is used to disambiguate from a collection property value.</param>
        /// <returns type="Boolean">True is the value is a feed value; false otherwise.</returns>

        var colData = value && value.results || value;
        return !!colData &&
            (isCollectionType(typeName)) ||
            (!typeName && isArray(colData) && !isComplex(colData[0]));
    };

    var isCollectionType = function (typeName) {
        /// <summary>Checks whether the specified type name is a collection type.</summary>
        /// <param name="typeName" type="String">Name of type to check.</param>
        /// <returns type="Boolean">True if the type is the name of a collection type; false otherwise.</returns>
        return collectionTypeRE.test(typeName);
    };

    var isComplex = function (value) {
        /// <summary>Tests whether a value is a complex type value in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <returns type="Boolean">True is the value is a complex type value; false otherwise.</returns>

        return !!value &&
            isObject(value) &&
            !isArray(value) &&
            !isDate(value);
    };

    var isDateTimeOffset = function (value) {
        /// <summary>Checks whether a Date object is DateTimeOffset value</summary>
        /// <param name="value" type="Date" mayBeNull="false">Value to check.</param>
        /// <returns type="Boolean">true if the value is a DateTimeOffset, false otherwise.</returns>
        return (value.__edmType === "Edm.DateTimeOffset" || (!value.__edmType && value.__offset));
    };

    var isDeferred = function (value) {
        /// <summary>Tests whether a value is a deferred navigation property in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <returns type="Boolean">True is the value is a deferred navigation property; false otherwise.</returns>

        if (!value && !isComplex(value)) {
            return false;
        }
        var metadata = value.__metadata || {};
        var deferred = value.__deferred || {};
        return !metadata.type && !!deferred.uri;
    };

    var isEntry = function (value) {
        /// <summary>Tests whether a value is an entry object in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <returns type="Boolean">True is the value is an entry object; false otherwise.</returns>

        return isComplex(value) && value.__metadata && "uri" in value.__metadata;
    };

    var isFeed = function (value, typeName) {
        /// <summary>Tests whether a value is a feed value in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <param name="typeName" type="Sting">Type name of the value. This is used to disambiguate from a collection property value.</param>
        /// <returns type="Boolean">True is the value is a feed value; false otherwise.</returns>

        var feedData = value && value.results || value;
        return isArray(feedData) && (
            (!isCollectionType(typeName)) &&
            (isComplex(feedData[0]))
        );
    };

    var isGeographyEdmType = function (typeName) {
        /// <summary>Checks whether the specified type name is a geography EDM type.</summary>
        /// <param name="typeName" type="String">Name of type to check.</param>
        /// <returns type="Boolean">True if the type is a geography EDM type; false otherwise.</returns>

        return contains(geographyEdmTypes, typeName);
    };

    var isGeometryEdmType = function (typeName) {
        /// <summary>Checks whether the specified type name is a geometry EDM type.</summary>
        /// <param name="typeName" type="String">Name of type to check.</param>
        /// <returns type="Boolean">True if the type is a geometry EDM type; false otherwise.</returns>

        return contains(geometryEdmTypes, typeName);
    };

    var isNamedStream = function (value) {
        /// <summary>Tests whether a value is a named stream value in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <returns type="Boolean">True is the value is a named stream; false otherwise.</returns>

        if (!value && !isComplex(value)) {
            return false;
        }
        var metadata = value.__metadata;
        var mediaResource = value.__mediaresource;
        return !metadata && !!mediaResource && !!mediaResource.media_src;
    };

    var isPrimitive = function (value) {
        /// <summary>Tests whether a value is a primitive type value in the library's internal representation.</summary>
        /// <param name="value">Value to test.</param>
        /// <remarks>
        ///    Date objects are considered primitive types by the library. 
        /// </remarks>
        /// <returns type="Boolean">True is the value is a primitive type value.</returns>

        return isDate(value) ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean";
    };

    var isPrimitiveEdmType = function (typeName) {
        /// <summary>Checks whether the specified type name is a primitive EDM type.</summary>
        /// <param name="typeName" type="String">Name of type to check.</param>
        /// <returns type="Boolean">True if the type is a primitive EDM type; false otherwise.</returns>

        return contains(primitiveEdmTypes, typeName);
    };

    var navigationPropertyKind = function (value, propertyModel) {
        /// <summary>Gets the kind of a navigation property value.</summary>
        /// <param name="value">Value of the navigation property.</param>
        /// <param name="propertyModel" type="Object" optional="true">
        ///     Object that describes the navigation property in an OData conceptual schema.
        /// </param>
        /// <remarks>
        ///     The returned string is as follows
        /// </remarks>
        /// <returns type="String">String value describing the kind of the navigation property; null if the kind cannot be determined.</returns>

        if (isDeferred(value)) {
            return "deferred";
        }
        if (isEntry(value)) {
            return "entry";
        }
        if (isFeed(value)) {
            return "feed";
        }
        if (propertyModel && propertyModel.relationship) {
            if (value === null || value === undefined || !isFeed(value)) {
                return "entry";
            }
            return "feed";
        }
        return null;
    };

    var lookupProperty = function (properties, name) {
        /// <summary>Looks up a property by name.</summary>
        /// <param name="properties" type="Array" mayBeNull="true">Array of property objects as per EDM metadata.</param>
        /// <param name="name" type="String">Name to look for.</param>
        /// <returns type="Object">The property object; null if not found.</returns>

        return find(properties, function (property) {
            return property.name === name;
        });
    };

    var lookupInMetadata = function (name, metadata, kind) {
        /// <summary>Looks up a type object by name.</summary>
        /// <param name="name" type="String">Name, possibly null or empty.</param>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <param name="kind" type="String">Kind of object to look for as per EDM metadata.</param>
        /// <returns>An type description if the name is found; null otherwise.</returns>

        return (name) ? forEachSchema(metadata, function (schema) {
            return lookupInSchema(name, schema, kind);
        }) : null;
    };

    var lookupEntitySet = function (entitySets, name) {
        /// <summary>Looks up a entity set by name.</summary>
        /// <param name="properties" type="Array" mayBeNull="true">Array of entity set objects as per EDM metadata.</param>
        /// <param name="name" type="String">Name to look for.</param>
        /// <returns type="Object">The entity set object; null if not found.</returns>

        return find(entitySets, function (entitySet) {
            return entitySet.name === name;
        });
    };

    var lookupComplexType = function (name, metadata) {
        /// <summary>Looks up a complex type object by name.</summary>
        /// <param name="name" type="String">Name, possibly null or empty.</param>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <returns>A complex type description if the name is found; null otherwise.</returns>

        return lookupInMetadata(name, metadata, "complexType");
    };

    var lookupEntityType = function (name, metadata) {
        /// <summary>Looks up an entity type object by name.</summary>
        /// <param name="name" type="String">Name, possibly null or empty.</param>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <returns>An entity type description if the name is found; null otherwise.</returns>

        return lookupInMetadata(name, metadata, "entityType");
    };

    var lookupDefaultEntityContainer = function (metadata) {
        /// <summary>Looks up an</summary>
        /// <param name="name" type="String">Name, possibly null or empty.</param>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <returns>An entity container description if the name is found; null otherwise.</returns>

        return forEachSchema(metadata, function (schema) {
            return find(schema.entityContainer, function (container) {
                return parseBool(container.isDefaultEntityContainer);
            });
        });
    };

    var lookupEntityContainer = function (name, metadata) {
        /// <summary>Looks up an entity container object by name.</summary>
        /// <param name="name" type="String">Name, possibly null or empty.</param>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <returns>An entity container description if the name is found; null otherwise.</returns>

        return lookupInMetadata(name, metadata, "entityContainer");
    };

    var lookupFunctionImport = function (functionImports, name) {
        /// <summary>Looks up a function import by name.</summary>
        /// <param name="properties" type="Array" mayBeNull="true">Array of function import objects as per EDM metadata.</param>
        /// <param name="name" type="String">Name to look for.</param>
        /// <returns type="Object">The entity set object; null if not found.</returns>

        return find(functionImports, function (functionImport) {
            return functionImport.name === name;
        });
    };

    var lookupNavigationPropertyType = function (navigationProperty, metadata) {
        /// <summary>Looks up the target entity type for a navigation property.</summary>
        /// <param name="navigationProperty" type="Object"></param>
        /// <param name="metadata" type="Object"></param>
        /// <returns type="String">The entity type name for the specified property, null if not found.</returns>

        var result = null;
        if (navigationProperty) {
            var rel = navigationProperty.relationship;
            var association = forEachSchema(metadata, function (schema) {
                // The name should be the namespace qualified name in 'ns'.'type' format.
                var nameOnly = removeNamespace(schema["namespace"], rel);
                var associations = schema.association;
                if (nameOnly && associations) {
                    var i, len;
                    for (i = 0, len = associations.length; i < len; i++) {
                        if (associations[i].name === nameOnly) {
                            return associations[i];
                        }
                    }
                }
            });

            if (association) {
                var end = association.end[0];
                if (end.role !== navigationProperty.toRole) {
                    end = association.end[1];
                    // For metadata to be valid, end.role === navigationProperty.toRole now.
                }
                result = end.type;
            }
        }
        return result;
    };

    var removeNamespace = function (ns, fullName) {
        /// <summary>Given an expected namespace prefix, removes it from a full name.</summary>
        /// <param name="ns" type="String">Expected namespace.</param>
        /// <param name="fullName" type="String">Full name in 'ns'.'name' form.</param>
        /// <returns type="String">The local name, null if it isn't found in the expected namespace.</returns>

        if (fullName.indexOf(ns) === 0 && fullName.charAt(ns.length) === ".") {
            return fullName.substr(ns.length + 1);
        }

        return null;
    };

    var lookupInSchema = function (name, schema, kind) {
        /// <summary>Looks up a schema object by name.</summary>
        /// <param name="name" type="String">Name (assigned).</param>
        /// <param name="schema">Schema object as per EDM metadata.</param>
        /// <param name="kind" type="String">Kind of object to look for as per EDM metadata.</param>
        /// <returns>An entity type description if the name is found; null otherwise.</returns>

        if (name && schema) {
            // The name should be the namespace qualified name in 'ns'.'type' format.
            var nameOnly = removeNamespace(schema["namespace"], name);
            if (nameOnly) {
                return find(schema[kind], function (item) {
                    return item.name === nameOnly;
                });
            }
        }
        return null;
    };

    var maxVersion = function (left, right) {
        /// <summary>Compares to version strings and returns the higher one.</summary>
        /// <param name="left" type="String">Version string in the form "major.minor.rev"</param>
        /// <param name="right" type="String">Version string in the form "major.minor.rev"</param>
        /// <returns type="String">The higher version string.</returns>

        if (left === right) {
            return left;
        }

        var leftParts = left.split(".");
        var rightParts = right.split(".");

        var len = (leftParts.length >= rightParts.length)
            ? leftParts.length
            : rightParts.length;

        for (var i = 0; i < len; i++) {
            var leftVersion = leftParts[i] && parseInt10(leftParts[i]);
            var rightVersion = rightParts[i] && parseInt10(rightParts[i]);
            if (leftVersion > rightVersion) {
                return left;
            }
            if (leftVersion < rightVersion) {
                return right;
            }
        }
    };

    var normalHeaders = {
        "accept": "Accept",
        "content-type": "Content-Type",
        "dataserviceversion": "DataServiceVersion",
        "maxdataserviceversion": "MaxDataServiceVersion"
    };

    var normalizeHeaders = function (headers) {
        /// <summary>Normalizes headers so they can be found with consistent casing.</summary>
        /// <param name="headers" type="Object">Dictionary of name/value pairs.</param>

        for (var name in headers) {
            var lowerName = name.toLowerCase();
            var normalName = normalHeaders[lowerName];
            if (normalName && name !== normalName) {
                var val = headers[name];
                delete headers[name];
                headers[normalName] = val;
            }
        }
    };

    var parseBool = function (propertyValue) {
        /// <summary>Parses a string into a boolean value.</summary>
        /// <param name="propertyValue">Value to parse.</param>
        /// <returns type="Boolean">true if the property value is 'true'; false otherwise.</returns>

        if (typeof propertyValue === "boolean") {
            return propertyValue;
        }

        return typeof propertyValue === "string" && propertyValue.toLowerCase() === "true";
    };


    // The captured indices for this expression are:
    // 0     - complete input
    // 1,2,3 - year with optional minus sign, month, day
    // 4,5,6 - hours, minutes, seconds
    // 7     - optional milliseconds
    // 8     - everything else (presumably offset information)

	// ##### BEGIN: MODIFIED BY SAP
    var parseDateTimeRE = /^(-?\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d+))?(.*)$/;
	// ##### END: MODIFIED BY SAP

    var parseDateTimeMaybeOffset = function (value, withOffset, nullOnError) {
        /// <summary>Parses a string into a DateTime value.</summary>
        /// <param name="value" type="String">Value to parse.</param>
        /// <param name="withOffset" type="Boolean">Whether offset is expected.</param>
        /// <returns type="Date">The parsed value.</returns>

        // We cannot parse this in cases of failure to match or if offset information is specified.
        var parts = parseDateTimeRE.exec(value);
        var offset = (parts) ? getCanonicalTimezone(parts[8]) : null;

        if (!parts || (!withOffset && offset !== "Z")) {
            if (nullOnError) {
                return null;
            }
            throw { message: "Invalid date/time value" };
        }

        // Pre-parse years, account for year '0' being invalid in dateTime.
        var year = parseInt10(parts[1]);
        if (year <= 0) {
            year++;
        }

        // Pre-parse optional milliseconds, fill in default. Fail if value is too precise.
        var ms = parts[7];
        var ns = 0;
        if (!ms) {
            ms = 0;
        } else {
            if (ms.length > 7) {
                if (nullOnError) {
                    return null;
                }
                throw { message: "Cannot parse date/time value to given precision." };
            }

            ns = formatNumberWidth(ms.substring(3), 4, true);
            ms = formatNumberWidth(ms.substring(0, 3), 3, true);

            ms = parseInt10(ms);
            ns = parseInt10(ns);
        }

        // Pre-parse other time components and offset them if necessary.
        var hours = parseInt10(parts[4]);
        var minutes = parseInt10(parts[5]);
    	// ##### BEGIN: MODIFIED BY SAP
        var seconds = parseInt10(parts[6]) || 0;
    	// ##### END: MODIFIED BY SAP
        if (offset !== "Z") {
            // The offset is reversed to get back the UTC date, which is
            // what the API will eventually have.
            var timezone = parseTimezone(offset);
            var direction = -(timezone.d);
            hours += timezone.h * direction;
            minutes += timezone.m * direction;
        }

        // Set the date and time separately with setFullYear, so years 0-99 aren't biased like in Date.UTC.
        var result = new Date();
        result.setUTCFullYear(
            year,                       // Year.
            parseInt10(parts[2]) - 1,   // Month (zero-based for Date.UTC and setFullYear).
            parseInt10(parts[3])        // Date.
            );
        result.setUTCHours(hours, minutes, seconds, ms);

        if (isNaN(result.valueOf())) {
            if (nullOnError) {
                return null;
            }
            throw { message: "Invalid date/time value" };
        }

        if (withOffset) {
            result.__edmType = "Edm.DateTimeOffset";
            result.__offset = offset;
        }

        if (ns) {
            result.__ns = ns;
        }

        return result;
    };

    var parseDateTime = function (propertyValue, nullOnError) {
        /// <summary>Parses a string into a DateTime value.</summary>
        /// <param name="propertyValue" type="String">Value to parse.</param>
        /// <returns type="Date">The parsed value.</returns>

        return parseDateTimeMaybeOffset(propertyValue, false, nullOnError);
    };

    var parseDateTimeOffset = function (propertyValue, nullOnError) {
        /// <summary>Parses a string into a DateTimeOffset value.</summary>
        /// <param name="propertyValue" type="String">Value to parse.</param>
        /// <returns type="Date">The parsed value.</returns>
        /// <remarks>
        /// The resulting object is annotated with an __edmType property and
        /// an __offset property reflecting the original intended offset of
        /// the value. The time is adjusted for UTC time, as the current
        /// timezone-aware Date APIs will only work with the local timezone.
        /// </remarks>

        return parseDateTimeMaybeOffset(propertyValue, true, nullOnError);
    };

    // The captured indices for this expression are:
    // 0       - complete input
    // 1       - direction
    // 2,3,4   - years, months, days
    // 5,6,7,8 - hours, minutes, seconds, miliseconds

    var parseTimeRE = /^([+-])?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.(\d+))?S)?)?/;

    var isEdmDurationValue = function (value) {
        parseTimeRE.test(value);
    }

    var parseDuration = function (duration) {
        /// <summary>Parses a string in xsd:duration format.</summary>
        /// <param name="duration" type="String">Duration value.</param>
        /// <remarks>
        /// This method will throw an exception if the input string has a year or a month component. 
        /// </remarks>
        /// <returns type="Object">Object representing the time</returns>

        var parts = parseTimeRE.exec(duration);

        if (parts === null) {
            throw { message: "Invalid duration value." };
        }

        var years = parts[2] || "0";
        var months = parts[3] || "0";
        var days = parseInt10(parts[4] || 0);
        var hours = parseInt10(parts[5] || 0);
        var minutes = parseInt10(parts[6] || 0);
        var seconds = parseFloat(parts[7] || 0);

        if (years !== "0" || months !== "0") {
            throw { message: "Unsupported duration value." };
        }

        var ms = parts[8];
        var ns = 0;
        if (!ms) {
            ms = 0;
        } else {
            if (ms.length > 7) {
                throw { message: "Cannot parse duration value to given precision." };
            }

            ns = formatNumberWidth(ms.substring(3), 4, true);
            ms = formatNumberWidth(ms.substring(0, 3), 3, true);

            ms = parseInt10(ms);
            ns = parseInt10(ns);
        }

        ms += seconds * 1000 + minutes * 60000 + hours * 3600000 + days * 86400000;

        if (parts[1] === "-") {
            ms = -ms;
        }

        var result = { ms: ms, __edmType: "Edm.Time" };

        if (ns) {
            result.ns = ns;
        }
        return result;
    };

    var parseTimezone = function (timezone) {
        /// <summary>Parses a timezone description in (+|-)nn:nn format.</summary>
        /// <param name="timezone" type="String">Timezone offset.</param>
        /// <returns type="Object">
        /// An object with a (d)irection property of 1 for + and -1 for -,
        /// offset (h)ours and offset (m)inutes.
        /// </returns>

        var direction = timezone.substring(0, 1);
        direction = (direction === "+") ? 1 : -1;

        var offsetHours = parseInt10(timezone.substring(1));
        var offsetMinutes = parseInt10(timezone.substring(timezone.indexOf(":") + 1));
        return { d: direction, h: offsetHours, m: offsetMinutes };
    };

    var prepareRequest = function (request, handler, context) {
        /// <summary>Prepares a request object so that it can be sent through the network.</summary>
        /// <param name="request">Object that represents the request to be sent.</param>
        /// <param name="handler">Handler for data serialization</param>
        /// <param name="context">Context used for preparing the request</param>

        // Default to GET if no method has been specified.    
        if (!request.method) {
            request.method = "GET";
        }

        if (!request.headers) {
            request.headers = {};
        } else {
            normalizeHeaders(request.headers);
        }

        if (request.headers.Accept === undefined) {
            request.headers.Accept = handler.accept;
        }

        if (assigned(request.data) && request.body === undefined) {
            handler.write(request, context);
        }

        if (!assigned(request.headers.MaxDataServiceVersion)) {
            request.headers.MaxDataServiceVersion = handler.maxDataServiceVersion || "1.0";
        }
        
        // ##### BEGIN: MODIFIED BY SAP
        if (request.async === undefined) {
        	request.async = true;
        }
        // ##### END: MODIFIED BY SAP
    };

    var traverseInternal = function (item, owner, callback) {
        /// <summary>Traverses a tree of objects invoking callback for every value.</summary>
        /// <param name="item" type="Object">Object or array to traverse.</param>
        /// <param name="callback" type="Function">
        /// Callback function with key and value, similar to JSON.parse reviver.
        /// </param>
        /// <returns type="Object">The object with traversed properties.</returns>
        /// <remarks>Unlike the JSON reviver, this won't delete null members.</remarks>

        if (item && typeof item === "object") {
            for (var name in item) {
                var value = item[name];
                var result = traverseInternal(value, name, callback);
                result = callback(name, result, owner);
                if (result !== value) {
                    if (value === undefined) {
                        delete item[name];
                    } else {
                        item[name] = result;
                    }
                }
            }
        }

        return item;
    };

    var traverse = function (item, callback) {
        /// <summary>Traverses a tree of objects invoking callback for every value.</summary>
        /// <param name="item" type="Object">Object or array to traverse.</param>
        /// <param name="callback" type="Function">
        /// Callback function with key and value, similar to JSON.parse reviver.
        /// </param>
        /// <returns type="Object">The traversed object.</returns>
        /// <remarks>Unlike the JSON reviver, this won't delete null members.</remarks>

        return callback("", traverseInternal(item, "", callback));
    };


    var ticks = 0;

    var canUseJSONP = function (request) {
        /// <summary>
        /// Checks whether the specified request can be satisfied with a JSONP request.
        /// </summary>
        /// <param name="request">Request object to check.</param>
        /// <returns type="Boolean">true if the request can be satisfied; false otherwise.</returns>

        // Requests that 'degrade' without changing their meaning by going through JSONP
        // are considered usable.
        //
        // We allow data to come in a different format, as the servers SHOULD honor the Accept
        // request but may in practice return content with a different MIME type.
        if (request.method && request.method !== "GET") {
            return false;
        }

        return true;
    };

    var createIFrame = function (url) {
        /// <summary>Creates an IFRAME tag for loading the JSONP script</summary>
        /// <param name="url" type="String">The source URL of the script</param>
        /// <returns type="HTMLElement">The IFRAME tag</returns>
        var iframe = window.document.createElement("IFRAME");
        iframe.style.display = "none";

        var attributeEncodedUrl = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/\</g, "&lt;");
        var html = "<html><head><script type=\"text/javascript\" src=\"" + attributeEncodedUrl + "\"><\/script><\/head><body><\/body><\/html>";

        var body = window.document.getElementsByTagName("BODY")[0];
        body.appendChild(iframe);

        writeHtmlToIFrame(iframe, html);
        return iframe;
    };

    var createXmlHttpRequest = function () {
        /// <summary>Creates a XmlHttpRequest object.</summary>
        /// <returns type="XmlHttpRequest">XmlHttpRequest object.</returns>
        if (window.XMLHttpRequest) {
            return new window.XMLHttpRequest();
        }
        var exception;
        if (window.ActiveXObject) {
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (_) {
                try {
                    return new window.ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch (e) {
                    exception = e;
                }
            }
        } else {
            exception = { message: "XMLHttpRequest not supported" };
        }
        throw exception;
    };

    var isAbsoluteUrl = function (url) {
        /// <summary>Checks whether the specified URL is an absolute URL.</summary>
        /// <param name="url" type="String">URL to check.</param>
        /// <returns type="Boolean">true if the url is an absolute URL; false otherwise.</returns>

        return url.indexOf("http://") === 0 ||
            url.indexOf("https://") === 0 ||
            url.indexOf("file://") === 0;
    };

    var isLocalUrl = function (url) {
        /// <summary>Checks whether the specified URL is local to the current context.</summary>
        /// <param name="url" type="String">URL to check.</param>
        /// <returns type="Boolean">true if the url is a local URL; false otherwise.</returns>

        if (!isAbsoluteUrl(url)) {
            return true;
        }

        // URL-embedded username and password will not be recognized as same-origin URLs.
        var location = window.location;
        var locationDomain = location.protocol + "//" + location.host + "/";
        return (url.indexOf(locationDomain) === 0);
    };

    var removeCallback = function (name, tick) {
        /// <summary>Removes a callback used for a JSONP request.</summary>
        /// <param name="name" type="String">Function name to remove.</param>
        /// <param name="tick" type="Number">Tick count used on the callback.</param>
        try {
            delete window[name];
        } catch (err) {
            window[name] = undefined;
            if (tick === ticks - 1) {
                ticks -= 1;
            }
        }
    };

    var removeIFrame = function (iframe) {
        /// <summary>Removes an iframe.</summary>
        /// <param name="iframe" type="Object">The iframe to remove.</param>
        /// <returns type="Object">Null value to be assigned to iframe reference.</returns>
        if (iframe) {
            writeHtmlToIFrame(iframe, "");
            iframe.parentNode.removeChild(iframe);
        }

        return null;
    };

    var readResponseHeaders = function (xhr, headers) {
        /// <summary>Reads response headers into array.</summary>
        /// <param name="xhr" type="XMLHttpRequest">HTTP request with response available.</param>
        /// <param name="headers" type="Array">Target array to fill with name/value pairs.</param>

        // ##### BEGIN: MODIFIED BY SAP
    	// for CORS issues
        var responseHeaders = xhr.getAllResponseHeaders();
        if (!responseHeaders){
            var contentType = xhr.getResponseHeader("Content-Type");
            var contentLength = xhr.getResponseHeader("Content-Length");
            if (contentType)
            	headers["Content-Type"] = contentType;
            if (contentLength)
            	headers["Content-Length"] = contentLength;
        } else {
        // ##### END: MODIFIED BY SAP
        	responseHeaders = responseHeaders.split(/\r?\n/);
        	var i, len;
        	for (i = 0, len = responseHeaders.length; i < len; i++) {
        		if (responseHeaders[i]) {
        			// ##### BEGIN: MODIFIED BY SAP

        			// expression matches "field-name: field-value"
        			// removes trailing/leading whitespace(s) from the field-value.
        			// result array: 0 = header, 1 = field-name, 2 = field-value
        			var header = responseHeaders[i].match(/([^:]*):\s*((?:\s*\S+)+)?\s*/);
        			headers[header[1]] = header[2];

        			// ##### END: MODIFIED BY SAP
        		}
        	}
        }

    };

    var writeHtmlToIFrame = function (iframe, html) {
        /// <summary>Writes HTML to an IFRAME document.</summary>
        /// <param name="iframe" type="HTMLElement">The IFRAME element to write to.</param>
        /// <param name="html" type="String">The HTML to write.</param>
        var frameDocument = (iframe.contentWindow) ? iframe.contentWindow.document : iframe.contentDocument.document;
        frameDocument.open();
        frameDocument.write(html);
        frameDocument.close();
    };

    odata.defaultHttpClient = {
        callbackParameterName: "$callback",

        formatQueryString: "$format=json",

        enableJsonpCallback: false,

        request: function (request, success, error) {
            /// <summary>Performs a network request.</summary>
            /// <param name="request" type="Object">Request description.</request>
            /// <param name="success" type="Function">Success callback with the response object.</param>
            /// <param name="error" type="Function">Error callback with an error object.</param>
            /// <returns type="Object">Object with an 'abort' method for the operation.</returns>

            var result = {};
            var xhr = null;
            var done = false;
            var iframe;

            result.abort = function () {
                iframe = removeIFrame(iframe);
                if (done) {
                    return;
                }

                done = true;
                if (xhr) {
                    xhr.abort();
                    xhr = null;
                }

                error({ message: "Request aborted" });
            };

            var handleTimeout = function () {
                iframe = removeIFrame(iframe);
                if (!done) {
                    done = true;
                    xhr = null;
                    error({ message: "Request timed out" });
                }
            };

            var name;
            var url = request.requestUri;
            var enableJsonpCallback = defined(request.enableJsonpCallback, this.enableJsonpCallback);
            var callbackParameterName = defined(request.callbackParameterName, this.callbackParameterName);
            var formatQueryString = defined(request.formatQueryString, this.formatQueryString);
            if (!enableJsonpCallback || isLocalUrl(url)) {

                xhr = createXmlHttpRequest();
                // ##### BEGIN: MODIFIED BY SAP
                var requestCallback = function () {
                // ##### END: MODIFIED BY SAP
                    if (done || xhr === null || xhr.readyState !== 4) {
                        return;
                    }

                    // Workaround for XHR behavior on IE.
                    var statusText = xhr.statusText;
                    var statusCode = xhr.status;
                    if (statusCode === 1223) {
                        statusCode = 204;
                        statusText = "No Content";
                    }

                    var headers = [];
                    readResponseHeaders(xhr, headers);

                    var response = { requestUri: url, statusCode: statusCode, statusText: statusText, headers: headers, body: xhr.responseText };

                    done = true;
                    xhr = null;
                    if (statusCode >= 200 && statusCode <= 299) {
                        success(response);
                    } else {
                    		// ##### BEGIN: MODIFIED BY SAP
                    		// normalize response headers here which is also done in the success function call above
                      	normalizeHeaders(response.headers);
                      	// ##### END: MODIFIED BY SAP
                        error({ message: "HTTP request failed", request: request, response: response });
                    }
                };

                // ##### BEGIN: MODIFIED BY SAP
                if (request.user && request.password) {
                	xhr.open(request.method || "GET", url, request.async, request.user, request.password);
                } else {
                	xhr.open(request.method || "GET", url, request.async);
                }
                // do it after open call because IE 10 may throw InvalidStateError exception.
                if (request.withCredentials) {
                	xhr.withCredentials = true;
                }
                // ##### END: MODIFIED BY SAP

                // Set the name/value pairs.
                if (request.headers) {
                    for (name in request.headers) {
                        xhr.setRequestHeader(name, request.headers[name]);
                    }
                }

                // Set the timeout if available.
                if (request.timeoutMS) {
                    xhr.timeout = request.timeoutMS;
                    xhr.ontimeout = handleTimeout;
                }
                
                // ##### BEGIN: MODIFIED BY SAP
                if (request.async || (!request.async && request.async !== false)) {
                    xhr.onreadystatechange = requestCallback;
                } 
                // modified by SAP: typeof request.body !== 'undefined' ? request.body : null. Check added to make it work in IE 11.
                xhr.send(typeof request.body !== 'undefined' ? request.body : null);
                if (!request.async) {
                	requestCallback();
                }
                // ##### END: MODIFIED BY SAP
            } else {
                if (!canUseJSONP(request)) {
                    throw { message: "Request is not local and cannot be done through JSONP." };
                }

                var tick = ticks;
                ticks += 1;
                var tickText = tick.toString();
                var succeeded = false;
                var timeoutId;
                name = "handleJSONP_" + tickText;
                window[name] = function (data) {
                    iframe = removeIFrame(iframe);
                    if (!done) {
                        succeeded = true;
                        window.clearTimeout(timeoutId);
                        removeCallback(name, tick);

                        // Workaround for IE8 and below where trying to access data.constructor after the IFRAME has been removed
                        // throws an "unknown exception"
                        if (window.ActiveXObject && !window.DOMParser) {
                            data = window.JSON.parse(window.JSON.stringify(data));
                        }

                        // Call the success callback in the context of the parent window, instead of the IFRAME
                        delay(success, { body: data, statusCode: 200, headers: { "Content-Type": "application/json"} });
                    }
                };

                // Default to two minutes before timing out, 1000 ms * 60 * 2 = 120000.
                var timeoutMS = (request.timeoutMS) ? request.timeoutMS : 120000;
                timeoutId = window.setTimeout(handleTimeout, timeoutMS);

                var queryStringParams = callbackParameterName + "=parent." + name;
                if (this.formatQueryString) {
                    queryStringParams += "&" + formatQueryString;
                }

                var qIndex = url.indexOf("?");
                if (qIndex === -1) {
                    url = url + "?" + queryStringParams;
                } else if (qIndex === url.length - 1) {
                    url = url + queryStringParams;
                } else {
                    url = url + "&" + queryStringParams;
                }

                iframe = createIFrame(url);
            }

            return result;
        }
    };



    var MAX_DATA_SERVICE_VERSION = "3.0";

    var contentType = function (str) {
        /// <summary>Parses a string into an object with media type and properties.</summary>
        /// <param name="str" type="String">String with media type to parse.</param>
        /// <returns>null if the string is empty; an object with 'mediaType' and a 'properties' dictionary otherwise.</returns>

        if (!str) {
            return null;
        }

        var contentTypeParts = str.split(";");
        var properties = {};

        var i, len;
        for (i = 1, len = contentTypeParts.length; i < len; i++) {
            var contentTypeParams = contentTypeParts[i].split("=");
            properties[trimString(contentTypeParams[0])] = contentTypeParams[1];
        }

        return { mediaType: trimString(contentTypeParts[0]), properties: properties };
    };

    var contentTypeToString = function (contentType) {
        /// <summary>Serializes an object with media type and properties dictionary into a string.</summary>
        /// <param name="contentType">Object with media type and properties dictionary to serialize.</param>
        /// <returns>String representation of the media type object; undefined if contentType is null or undefined.</returns>

        if (!contentType) {
            return undefined;
        }

        var result = contentType.mediaType;
        var property;
        for (property in contentType.properties) {
            result += ";" + property + "=" + contentType.properties[property];
        }
        return result;
    };

    var createReadWriteContext = function (contentType, dataServiceVersion, context, handler) {
        /// <summary>Creates an object that is going to be used as the context for the handler's parser and serializer.</summary>
        /// <param name="contentType">Object with media type and properties dictionary.</param>
        /// <param name="dataServiceVersion" type="String">String indicating the version of the protocol to use.</param>
        /// <param name="context">Operation context.</param>
        /// <param name="handler">Handler object that is processing a resquest or response.</param>
        /// <returns>Context object.</returns>

    	// ##### BEGIN: MODIFIED BY SAP
        // this was not working in 1.1.0 so this fix is from 1.1.1.beta2
    	
//        var rwContext = {
//                contentType: contentType,
//                dataServiceVersion: dataServiceVersion,
//                handler: handler
//            };
//
//        return extend(rwContext, context);

        var rwContext = {};
        extend(rwContext, context);
        extend(rwContext, {
            contentType: contentType,
            dataServiceVersion: dataServiceVersion,
            handler: handler
        });

        return rwContext;
        //##### END: MODIFIED BY SAP
        
    };

    var fixRequestHeader = function (request, name, value) {
        /// <summary>Sets a request header's value. If the header has already a value other than undefined, null or empty string, then this method does nothing.</summary>
        /// <param name="request">Request object on which the header will be set.</param>
        /// <param name="name" type="String">Header name.</param>
        /// <param name="value" type="String">Header value.</param>
        if (!request) {
            return;
        }

        var headers = request.headers;
        if (!headers[name]) {
            headers[name] = value;
        }
    };

    var fixDataServiceVersionHeader = function (request, version) {
        /// <summary>Sets the DataServiceVersion header of the request if its value is not yet defined or of a lower version.</summary>
        /// <param name="request">Request object on which the header will be set.</param>
        /// <param name="version" type="String">Version value.</param>
        /// <remarks>
        /// If the request has already a version value higher than the one supplied the this function does nothing.
        /// </remarks>

        if (request) {
            var headers = request.headers;
            var dsv = headers["DataServiceVersion"];
            headers["DataServiceVersion"] = dsv ? maxVersion(dsv, version) : version;
        }
    };

    var getRequestOrResponseHeader = function (requestOrResponse, name) {
        /// <summary>Gets the value of a request or response header.</summary>
        /// <param name="requestOrResponse">Object representing a request or a response.</param>
        /// <param name="name" type="String">Name of the header to retrieve.</param>
        /// <returns type="String">String value of the header; undefined if the header cannot be found.</returns>

        var headers = requestOrResponse.headers;
        return (headers && headers[name]) || undefined;
    };

    var getContentType = function (requestOrResponse) {
        /// <summary>Gets the value of the Content-Type header from a request or response.</summary>
        /// <param name="requestOrResponse">Object representing a request or a response.</param>
        /// <returns type="Object">Object with 'mediaType' and a 'properties' dictionary; null in case that the header is not found or doesn't have a value.</returns>

        return contentType(getRequestOrResponseHeader(requestOrResponse, "Content-Type"));
    };

    var versionRE = /^\s?(\d+\.\d+);?.*$/;
    var getDataServiceVersion = function (requestOrResponse) {
        /// <summary>Gets the value of the DataServiceVersion header from a request or response.</summary>
        /// <param name="requestOrResponse">Object representing a request or a response.</param>
        /// <returns type="String">Data service version; undefined if the header cannot be found.</returns>

        var value = getRequestOrResponseHeader(requestOrResponse, "DataServiceVersion");
        if (value) {
            var matches = versionRE.exec(value);
            if (matches && matches.length) {
                return matches[1];
            }
        }

        // Fall through and return undefined.
    };

    var handlerAccepts = function (handler, cType) {
        /// <summary>Checks that a handler can process a particular mime type.</summary>
        /// <param name="handler">Handler object that is processing a resquest or response.</param>
        /// <param name="cType">Object with 'mediaType' and a 'properties' dictionary.</param>
        /// <returns type="Boolean">True if the handler can process the mime type; false otherwise.</returns>

        // The following check isn't as strict because if cType.mediaType = application/; it will match an accept value of "application/xml";
        // however in practice we don't not expect to see such "suffixed" mimeTypes for the handlers.
        return handler.accept.indexOf(cType.mediaType) >= 0;
    };

    var handlerRead = function (handler, parseCallback, response, context) {
        /// <summary>Invokes the parser associated with a handler for reading the payload of a HTTP response.</summary>
        /// <param name="handler">Handler object that is processing the response.</param>
        /// <param name="parseCallback" type="Function">Parser function that will process the response payload.</param>
        /// <param name="response">HTTP response whose payload is going to be processed.</param>
        /// <param name="context">Object used as the context for processing the response.</param>
        /// <returns type="Boolean">True if the handler processed the response payload and the response.data property was set; false otherwise.</returns>

        if (!response || !response.headers) {
            return false;
        }

        var cType = getContentType(response);
        var version = getDataServiceVersion(response) || "";
        var body = response.body;

        // ##### BEGIN: MODIFIED BY SAP
        // added !body
        // in XML case if e.g. delete op body is "" and no content type do nothing...check if this is fixed in future versions...
        if (!assigned(body) || !body) {
        //##### END: MODIFIED BY SAP
            return false;
        }

        if (handlerAccepts(handler, cType)) {
            var readContext = createReadWriteContext(cType, version, context, handler);
            readContext.response = response;
            response.data = parseCallback(handler, body, readContext);
            return response.data !== undefined;
        }

        return false;
    };

    var handlerWrite = function (handler, serializeCallback, request, context) {
        /// <summary>Invokes the serializer associated with a handler for generating the payload of a HTTP request.</summary>
        /// <param name="handler">Handler object that is processing the request.</param>
        /// <param name="serializeCallback" type="Function">Serializer function that will generate the request payload.</param>
        /// <param name="response">HTTP request whose payload is going to be generated.</param>
        /// <param name="context">Object used as the context for serializing the request.</param>
        /// <returns type="Boolean">True if the handler serialized the request payload and the request.body property was set; false otherwise.</returns>
        if (!request || !request.headers) {
            return false;
        }

        var cType = getContentType(request);
        var version = getDataServiceVersion(request);

        if (!cType || handlerAccepts(handler, cType)) {
            var writeContext = createReadWriteContext(cType, version, context, handler);
            writeContext.request = request;

            request.body = serializeCallback(handler, request.data, writeContext);

            if (request.body !== undefined) {
                fixDataServiceVersionHeader(request, writeContext.dataServiceVersion || "1.0");

                fixRequestHeader(request, "Content-Type", contentTypeToString(writeContext.contentType));
                fixRequestHeader(request, "MaxDataServiceVersion", handler.maxDataServiceVersion);
                return true;
            }
        }

        return false;
    };

    var handler = function (parseCallback, serializeCallback, accept, maxDataServiceVersion) {
        /// <summary>Creates a handler object for processing HTTP requests and responses.</summary>
        /// <param name="parseCallback" type="Function">Parser function that will process the response payload.</param>
        /// <param name="serializeCallback" type="Function">Serializer function that will generate the request payload.</param>
        /// <param name="accept" type="String">String containing a comma separated list of the mime types that this handler can work with.</param>
        /// <param name="maxDataServiceVersion" type="String">String indicating the highest version of the protocol that this handler can work with.</param>
        /// <returns type="Object">Handler object.</returns>

        return {
            accept: accept,
            maxDataServiceVersion: maxDataServiceVersion,

            read: function (response, context) {
                return handlerRead(this, parseCallback, response, context);
            },

            write: function (request, context) {
                return handlerWrite(this, serializeCallback, request, context);
            }
        };
    };

    var textParse = function (handler, body /*, context */) {
        return body;
    };

    var textSerialize = function (handler, data /*, context */) {
        if (assigned(data)) {
            return data.toString();
        } else {
            return undefined;
        }
    };

    odata.textHandler = handler(textParse, textSerialize, "text/plain", MAX_DATA_SERVICE_VERSION);


    var gmlOpenGis = http + "www.opengis.net";           // http://www.opengis.net 
    var gmlXmlNs = gmlOpenGis + "/gml";                 // http://www.opengis.net/gml 
    var gmlSrsPrefix = gmlOpenGis + "/def/crs/EPSG/0/"; // http://www.opengis.net/def/crs/EPSG/0/

    var gmlPrefix = "gml";

    var gmlCreateGeoJSONOBject = function (type, member, data) {
        /// <summary>Creates a GeoJSON object with the specified type, member and value.</summary>
        /// <param name="type" type="String">GeoJSON object type.</param>
        /// <param name="member" type="String">Name for the data member in the GeoJSON object.</param>
        /// <param name="data">Data to be contained by the GeoJSON object.</param> 
        /// <returns type="Object">GeoJSON object.</returns>

        var result = { type: type };
        result[member] = data;
        return result;
    };

    var gmlSwapLatLong = function (coordinates) {
        /// <summary>Swaps the longitude and latitude in the coordinates array.</summary>
        /// <param name="coordinates" type="Array">Array of doubles descrbing a set of coordinates.</param>
        /// <returns type="Array">Array of doubles with the latitude and longitude components swapped.</returns>

        if (isArray(coordinates) && coordinates.length >= 2) {
            var tmp = coordinates[0];
            coordinates[0] = coordinates[1];
            coordinates[1] = tmp;
        }
        return coordinates;
    };

    var gmlReadODataMultiItem = function (domElement, type, member, members, valueReader, isGeography) {
        /// <summary>
        ///    Reads a GML DOM element that represents a composite structure like a multi-point or a 
        ///    multi-geometry returnig its GeoJSON representation.
        /// </summary>
        /// <param name="domElement">GML DOM element.</param>
        /// <param name="type" type="String">GeoJSON object type.</param>
        /// <param name="member" type="String">Name for the child element representing a single item in the composite structure.</param>
        /// <param name="members" type="String">Name for the child element representing a collection of items in the composite structure.</param>
        /// <param name="valueReader" type="Function">Callback function invoked to get the coordinates of each item in the comoposite structure.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">GeoJSON object.</returns>

        var coordinates = gmlReadODataMultiItemValue(domElement, member, members, valueReader, isGeography);
        return gmlCreateGeoJSONOBject(type, "coordinates", coordinates);
    };

    var gmlReadODataMultiItemValue = function (domElement, member, members, valueReader, isGeography) {
        /// <summary>
        ///    Reads the value of a GML DOM element that represents a composite structure like a multi-point or a 
        ///    multi-geometry returnig its items.
        /// </summary>
        /// <param name="domElement">GML DOM element.</param>
        /// <param name="type" type="String">GeoJSON object type.</param>
        /// <param name="member" type="String">Name for the child element representing a single item in the composite structure.</param>
        /// <param name="members" type="String">Name for the child element representing a collection of items in the composite structure.</param>
        /// <param name="valueReader" type="Function">Callback function invoked to get the transformed value of each item in the comoposite structure.</param>  
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array containing the transformed value of each item in the multi-item.</returns>

        var items = [];

        xmlChildElements(domElement, function (child) {
            if (xmlNamespaceURI(child) !== gmlXmlNs) {
                return;
            }

            var localName = xmlLocalName(child);

            if (localName === member) {
                var valueElement = xmlFirstChildElement(child, gmlXmlNs);
                if (valueElement) {
                    var value = valueReader(valueElement, isGeography);
                    if (value) {
                        items.push(value);
                    }
                }
                return;
            }

            if (localName === members) {
                xmlChildElements(child, function (valueElement) {
                    if (xmlNamespaceURI(valueElement) !== gmlXmlNs) {
                        return;
                    }

                    var value = valueReader(valueElement, isGeography);
                    if (value) {
                        items.push(value);
                    }
                });
            }
        });
        return items;
    };

    var gmlReadODataCollection = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a multi-geometry returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">MultiGeometry object in GeoJSON format.</returns>

        var geometries = gmlReadODataMultiItemValue(domElement, "geometryMember", "geometryMembers", gmlReadODataSpatialValue, isGeography);
        return gmlCreateGeoJSONOBject(GEOJSON_GEOMETRYCOLLECTION, "geometries", geometries);
    };

    var gmlReadODataLineString = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a line string returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">LineString object in GeoJSON format.</returns>

        return gmlCreateGeoJSONOBject(GEOJSON_LINESTRING, "coordinates", gmlReadODataLineValue(domElement, isGeography));
    };

    var gmlReadODataMultiLineString = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a multi-line string returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">MultiLineString object in GeoJSON format.</returns>

        return gmlReadODataMultiItem(domElement, GEOJSON_MULTILINESTRING, "curveMember", "curveMembers", gmlReadODataLineValue, isGeography);
    };

    var gmlReadODataMultiPoint = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a multi-point returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">MultiPoint object in GeoJSON format.</returns>

        return gmlReadODataMultiItem(domElement, GEOJSON_MULTIPOINT, "pointMember", "pointMembers", gmlReadODataPointValue, isGeography);
    };

    var gmlReadODataMultiPolygon = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a multi-polygon returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">MultiPolygon object in GeoJSON format.</returns>

        return gmlReadODataMultiItem(domElement, GEOJSON_MULTIPOLYGON, "surfaceMember", "surfaceMembers", gmlReadODataPolygonValue, isGeography);
    };

    var gmlReadODataPoint = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a point returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">Point object in GeoJSON format.</returns>

        return gmlCreateGeoJSONOBject(GEOJSON_POINT, "coordinates", gmlReadODataPointValue(domElement, isGeography));
    };

    var gmlReadODataPolygon = function (domElement, isGeography) {
        /// <summary>Reads a GML DOM element representing a polygon returning its GeoJSON representation.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Object">Polygon object in GeoJSON format.</returns>

        return gmlCreateGeoJSONOBject(GEOJSON_POLYGON, "coordinates", gmlReadODataPolygonValue(domElement, isGeography));
    };

    var gmlReadODataLineValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element representing a line returning its set of coordinates.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array containing an array of doubles for each coordinate of the line.</returns>

        var coordinates = [];

        xmlChildElements(domElement, function (child) {
            var nsURI = xmlNamespaceURI(child);

            if (nsURI !== gmlXmlNs) {
                return;
            }

            var localName = xmlLocalName(child);

            if (localName === "posList") {
                coordinates = gmlReadODataPosListValue(child, isGeography);
                return;
            }
            if (localName === "pointProperty") {
                coordinates.push(gmlReadODataPointWrapperValue(child, isGeography));
                return;
            }
            if (localName === "pos") {
                coordinates.push(gmlReadODataPosValue(child, isGeography));
                return;
            }
        });

        return coordinates;
    };

    var gmlReadODataPointValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element representing a point returning its coordinates.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array of doubles containing the point coordinates.</returns>

        var pos = xmlFirstChildElement(domElement, gmlXmlNs, "pos");
        return pos ? gmlReadODataPosValue(pos, isGeography) : [];
    };

    var gmlReadODataPointWrapperValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element wrapping an element representing a point returning its coordinates.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array of doubles containing the point coordinates.</returns>

        var point = xmlFirstChildElement(domElement, gmlXmlNs, "Point");
        return point ? gmlReadODataPointValue(point, isGeography) : [];
    };

    var gmlReadODataPolygonValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element representing a polygon returning its set of coordinates.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array containing an array of array of doubles for each ring of the polygon.</returns>

        var coordinates = [];
        var exteriorFound = false;
        xmlChildElements(domElement, function (child) {
            if (xmlNamespaceURI(child) !== gmlXmlNs) {
                return;
            }

            // Only the exterior and the interior rings are interesting
            var localName = xmlLocalName(child);
            if (localName === "exterior") {
                exteriorFound = true;
                coordinates.unshift(gmlReadODataPolygonRingValue(child, isGeography));
                return;
            }
            if (localName === "interior") {
                coordinates.push(gmlReadODataPolygonRingValue(child, isGeography));
                return;
            }
        });

        if (!exteriorFound && coordinates.length > 0) {
            // Push an empty exterior ring.
            coordinates.unshift([[]]);
        }

        return coordinates;
    };

    var gmlReadODataPolygonRingValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element representing a linear ring in a GML Polygon element.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array containing an array of doubles for each coordinate of the linear ring.</returns>

        var value = [];
        xmlChildElements(domElement, function (child) {
            if (xmlNamespaceURI(child) !== gmlXmlNs || xmlLocalName(child) !== "LinearRing") {
                return;
            }
            value = gmlReadODataLineValue(child, isGeography);
        });
        return value;
    };

    var gmlReadODataPosListValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element representing a list of positions retruning its set of coordinates.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        ///
        ///    The positions described by the list are assumed to be 2D, so 
        ///    an exception will be thrown if the list has an odd number elements.
        /// </remarks>
        /// <returns type="Array">Array containing an array of doubles for each coordinate in the list.</returns>

        var coordinates = gmlReadODataPosValue(domElement, false);
        var len = coordinates.length;

        if (len % 2 !== 0) {
            throw { message: "GML posList element has an uneven number of numeric values" };
        }

        var value = [];
        for (var i = 0; i < len; i += 2) {
            var pos = coordinates.slice(i, i + 2);
            value.push(isGeography ? gmlSwapLatLong(pos) : pos);
        }
        return value;
    };

    var gmlReadODataPosValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML element describing a position or a set of coordinates in an OData spatial property value.</summary>
        /// <param name="property">DOM element for the GML element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns type="Array">Array of doubles containing the coordinates.</returns>

        var value = [];
        var delims = " \t\r\n";
        var text = xmlInnerText(domElement);

        if (text) {
            var len = text.length;
            var start = 0;
            var end = 0;

            while (end <= len) {
                if (delims.indexOf(text.charAt(end)) !== -1) {
                    var coord = text.substring(start, end);
                    if (coord) {
                        value.push(parseFloat(coord));
                    }
                    start = end + 1;
                }
                end++;
            }
        }

        return isGeography ? gmlSwapLatLong(value) : value;
    };

    var gmlReadODataSpatialValue = function (domElement, isGeography) {
        /// <summary>Reads the value of a GML DOM element a spatial value in an OData XML document.</summary>
        /// <param name="domElement">DOM element.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each position coordinates in the resulting GeoJSON object.
        /// </remarks>
        /// <returns type="Array">Array containing an array of doubles for each coordinate of the polygon.</returns>

        var localName = xmlLocalName(domElement);
        var reader;

        switch (localName) {
            case "Point":
                reader = gmlReadODataPoint;
                break;
            case "Polygon":
                reader = gmlReadODataPolygon;
                break;
            case "LineString":
                reader = gmlReadODataLineString;
                break;
            case "MultiPoint":
                reader = gmlReadODataMultiPoint;
                break;
            case "MultiCurve":
                reader = gmlReadODataMultiLineString;
                break;
            case "MultiSurface":
                reader = gmlReadODataMultiPolygon;
                break;
            case "MultiGeometry":
                reader = gmlReadODataCollection;
                break;
            default:
                throw { message: "Unsupported element: " + localName, element: domElement };
        }

        var value = reader(domElement, isGeography);
        // Read the CRS
        // WCF Data Services qualifies the srsName attribute withing the GML namespace; however
        // other end points might no do this as per the standard.

        var srsName = xmlAttributeValue(domElement, "srsName", gmlXmlNs) ||
                      xmlAttributeValue(domElement, "srsName");

        if (srsName) {
            if (srsName.indexOf(gmlSrsPrefix) !== 0) {
                throw { message: "Unsupported srs name: " + srsName, element: domElement };
            }

            var crsId = srsName.substring(gmlSrsPrefix.length);
            if (crsId) {
                value.crs = {
                    type: "name",
                    properties: {
                        name: "EPSG:" + crsId
                    }
                };
            }
        }
        return value;
    };

    var gmlNewODataSpatialValue = function (dom, value, type, isGeography) {
        /// <summary>Creates a new GML DOM element for the value of an OData spatial property or GeoJSON object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">Spatial property value in GeoJSON format.</param>
        /// <param name="type" type="String">String indicating the GeoJSON type of the value to serialize.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the spatial value. </returns>

        var gmlWriter;

        switch (type) {
            case GEOJSON_POINT:
                gmlWriter = gmlNewODataPoint;
                break;
            case GEOJSON_LINESTRING:
                gmlWriter = gmlNewODataLineString;
                break;
            case GEOJSON_POLYGON:
                gmlWriter = gmlNewODataPolygon;
                break;
            case GEOJSON_MULTIPOINT:
                gmlWriter = gmlNewODataMultiPoint;
                break;
            case GEOJSON_MULTILINESTRING:
                gmlWriter = gmlNewODataMultiLineString;
                break;
            case GEOJSON_MULTIPOLYGON:
                gmlWriter = gmlNewODataMultiPolygon;
                break;
            case GEOJSON_GEOMETRYCOLLECTION:
                gmlWriter = gmlNewODataGeometryCollection;
                break;
            default:
                return null;
        }

        var gml = gmlWriter(dom, value, isGeography);

        // Set the srsName attribute if applicable.
        var crs = value.crs;
        if (crs) {
            if (crs.type === "name") {
                var properties = crs.properties;
                var name = properties && properties.name;
                if (name && name.indexOf("ESPG:") === 0 && name.length > 5) {
                    var crsId = name.substring(5);
                    var srsName = xmlNewAttribute(dom, null, "srsName", gmlPrefix + crsId);
                    xmlAppendChild(gml, srsName);
                }
            }
        }

        return gml;
    };

    var gmlNewODataElement = function (dom, name, children) {
        /// <summary>Creates a new DOM element in the GML namespace.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Local name of the GML element to create.</param>
        /// <param name="children" type="Array">Array containing DOM nodes or string values that will be added as children of the new DOM element.</param>
        /// <returns>New DOM element in the GML namespace.</returns>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended as a child of the new DOM Element.
        /// </remarks>

        return xmlNewElement(dom, gmlXmlNs, xmlQualifiedName(gmlPrefix, name), children);
    };

    var gmlNewODataPosElement = function (dom, coordinates, isGeography) {
        /// <summary>Creates a new GML pos DOM element.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="coordinates" type="Array">Array of doubles describing the coordinates of the pos element.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the coordinates use a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first coordinate is the Longitude and 
        ///    will be serialized as the second component of the <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New pos DOM element in the GML namespace.</returns>

        var posValue = isArray(coordinates) ? coordinates : [];

        // If using a geographic reference system, then the first coordinate is the longitude and it has to
        // swapped with the latitude.
        posValue = isGeography ? gmlSwapLatLong(posValue) : posValue;

        return gmlNewODataElement(dom, "pos", posValue.join(" "));
    };

    var gmlNewODataLineElement = function (dom, name, coordinates, isGeography) {
        /// <summary>Creates a new GML DOM element representing a line.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Name of the element to create.</param>
        /// <param name="coordinates" type="Array">Array of array of doubles describing the coordinates of the line element.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the coordinates use a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace.</returns>

        var element = gmlNewODataElement(dom, name);
        if (isArray(coordinates)) {
            var i, len;
            for (i = 0, len = coordinates.length; i < len; i++) {
                xmlAppendChild(element, gmlNewODataPosElement(dom, coordinates[i], isGeography));
            }

            if (len === 0) {
                xmlAppendChild(element, gmlNewODataElement(dom, "posList"));
            }
        }
        return element;
    };

    var gmlNewODataPointElement = function (dom, coordinates, isGeography) {
        /// <summary>Creates a new GML Point DOM element.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON Point object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON Point.</returns>

        return gmlNewODataElement(dom, "Point", gmlNewODataPosElement(dom, coordinates, isGeography));
    };

    var gmlNewODataLineStringElement = function (dom, coordinates, isGeography) {
        /// <summary>Creates a new GML LineString DOM element.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="coordinates" type="Array">Array of array of doubles describing the coordinates of the line element.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON LineString.</returns>

        return gmlNewODataLineElement(dom, "LineString", coordinates, isGeography);
    };

    var gmlNewODataPolygonRingElement = function (dom, name, coordinates, isGeography) {
        /// <summary>Creates a new GML DOM element representing a polygon ring.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Name of the element to create.</param>
        /// <param name="coordinates" type="Array">Array of array of doubles describing the coordinates of the polygon ring.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the coordinates use a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace.</returns>

        var ringElement = gmlNewODataElement(dom, name);
        if (isArray(coordinates) && coordinates.length > 0) {
            var linearRing = gmlNewODataLineElement(dom, "LinearRing", coordinates, isGeography);
            xmlAppendChild(ringElement, linearRing);
        }
        return ringElement;
    };

    var gmlNewODataPolygonElement = function (dom, coordinates, isGeography) {
        /// <summary>Creates a new GML Polygon DOM element for a GeoJSON Polygon object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="coordinates" type="Array">Array of array of array of doubles describing the coordinates of the polygon.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace.</returns>

        var len = coordinates && coordinates.length;
        var element = gmlNewODataElement(dom, "Polygon");

        if (isArray(coordinates) && len > 0) {
            xmlAppendChild(element, gmlNewODataPolygonRingElement(dom, "exterior", coordinates[0], isGeography));

            var i;
            for (i = 1; i < len; i++) {
                xmlAppendChild(element, gmlNewODataPolygonRingElement(dom, "interior", coordinates[i], isGeography));
            }
        }
        return element;
    };

    var gmlNewODataPoint = function (dom, value, isGeography) {
        /// <summary>Creates a new GML Point DOM element for a GeoJSON Point object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON Point object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON Point.</returns>

        return gmlNewODataPointElement(dom, value.coordinates, isGeography);
    };

    var gmlNewODataLineString = function (dom, value, isGeography) {
        /// <summary>Creates a new GML LineString DOM element for a GeoJSON LineString object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON LineString object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON LineString.</returns>

        return gmlNewODataLineStringElement(dom, value.coordinates, isGeography);
    };

    var gmlNewODataPolygon = function (dom, value, isGeography) {
        /// <summary>Creates a new GML Polygon DOM element for a GeoJSON Polygon object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON Polygon object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON Polygon.</returns>

        return gmlNewODataPolygonElement(dom, value.coordinates, isGeography);
    };

    var gmlNewODataMultiItem = function (dom, name, members, items, itemWriter, isGeography) {
        /// <summary>Creates a new GML DOM element for a composite structure like a multi-point or a multi-geometry.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Name of the element to create.</param>
        /// <param name="items" type="Array">Array of items in the composite structure.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the multi-item uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each of the items is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace.</returns>

        var len = items && items.length;
        var element = gmlNewODataElement(dom, name);

        if (isArray(items) && len > 0) {
            var membersElement = gmlNewODataElement(dom, members);
            var i;
            for (i = 0; i < len; i++) {
                xmlAppendChild(membersElement, itemWriter(dom, items[i], isGeography));
            }
            xmlAppendChild(element, membersElement);
        }
        return element;
    };

    var gmlNewODataMultiPoint = function (dom, value, isGeography) {
        /// <summary>Creates a new GML MultiPoint DOM element for a GeoJSON MultiPoint object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON MultiPoint object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON MultiPoint.</returns>

        return gmlNewODataMultiItem(dom, "MultiPoint", "pointMembers", value.coordinates, gmlNewODataPointElement, isGeography);
    };

    var gmlNewODataMultiLineString = function (dom, value, isGeography) {
        /// <summary>Creates a new GML MultiCurve DOM element for a GeoJSON MultiLineString object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON MultiLineString object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON MultiLineString.</returns>

        return gmlNewODataMultiItem(dom, "MultiCurve", "curveMembers", value.coordinates, gmlNewODataLineStringElement, isGeography);
    };

    var gmlNewODataMultiPolygon = function (dom, value, isGeography) {
        /// <summary>Creates a new GML MultiSurface DOM element for a GeoJSON MultiPolygon object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON MultiPolygon object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON MultiPolygon.</returns>

        return gmlNewODataMultiItem(dom, "MultiSurface", "surfaceMembers", value.coordinates, gmlNewODataPolygonElement, isGeography);
    };

    var gmlNewODataGeometryCollectionItem = function (dom, value, isGeography) {
        /// <summary>Creates a new GML element for an item in a geometry collection object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="item" type="Object">GeoJSON object in the geometry collection.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace.</returns>

        return gmlNewODataSpatialValue(dom, value, value.type, isGeography);
    };

    var gmlNewODataGeometryCollection = function (dom, value, isGeography) {
        /// <summary>Creates a new GML MultiGeometry DOM element for a GeoJSON GeometryCollection object.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="value" type="Object">GeoJSON GeometryCollection object.</param>
        /// <param name="isGeography" type="Boolean">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in the GeoJSON value is the Longitude and 
        ///    will be serialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the GeoJSON GeometryCollection.</returns>

        return gmlNewODataMultiItem(dom, "MultiGeometry", "geometryMembers", value.geometries, gmlNewODataGeometryCollectionItem, isGeography);
    };



    var xmlMediaType = "application/xml";

    var ado = http + "schemas.microsoft.com/ado/";      // http://schemas.microsoft.com/ado/
    var adoDs = ado + "2007/08/dataservices";           // http://schemas.microsoft.com/ado/2007/08/dataservices

    var edmxNs = ado + "2007/06/edmx";                  // http://schemas.microsoft.com/ado/2007/06/edmx
    var edmNs1 = ado + "2006/04/edm";                   // http://schemas.microsoft.com/ado/2006/04/edm
    var edmNs1_1 = ado + "2007/05/edm";                 // http://schemas.microsoft.com/ado/2007/05/edm
    var edmNs1_2 = ado + "2008/01/edm";                 // http://schemas.microsoft.com/ado/2008/01/edm

    // There are two valid namespaces for Edm 2.0
    var edmNs2a = ado + "2008/09/edm";                  // http://schemas.microsoft.com/ado/2008/09/edm
    var edmNs2b = ado + "2009/08/edm";                  // http://schemas.microsoft.com/ado/2009/08/edm

    var edmNs3 = ado + "2009/11/edm";                   // http://schemas.microsoft.com/ado/2009/11/edm
    // ##### BEGIN: MODIFIED BY SAP
	var edmNs4 = http + "docs.oasis-open.org/odata/ns/edm";  // http://docs.oasis-open.org/odata/ns/edm
	// ##### END: MODIFIED BY SAP
    var odataXmlNs = adoDs;                             // http://schemas.microsoft.com/ado/2007/08/dataservices
    var odataMetaXmlNs = adoDs + "/metadata";           // http://schemas.microsoft.com/ado/2007/08/dataservices/metadata
    var odataRelatedPrefix = adoDs + "/related/";       // http://schemas.microsoft.com/ado/2007/08/dataservices/related
    var odataScheme = adoDs + "/scheme";                // http://schemas.microsoft.com/ado/2007/08/dataservices/scheme

    var odataPrefix = "d";
    var odataMetaPrefix = "m";

    var createAttributeExtension = function (domNode, useNamespaceURI) {
        /// <summary>Creates an extension object for the specified attribute.</summary>
        /// <param name="domNode">DOM node for the attribute.</param>
        /// <param name="useNamespaceURI" type="Boolean">Flag indicating if the namespaceURI property should be added to the extension object instead of the namespace property.</param>
        /// <remarks>
        ///    The useNamespaceURI flag is used to prevent a breaking change from older versions of datajs in which extension 
        ///    objects created for Atom extension attributes have the namespaceURI property instead of the namespace one.
        ///    
        ///    This flag and the namespaceURI property should be deprecated in future major versions of the library.
        /// </remarks>
        /// <returns type="Object">The new extension object.</returns>

        var extension = { name: xmlLocalName(domNode), value: domNode.value };
        extension[useNamespaceURI ? "namespaceURI" : "namespace"] = xmlNamespaceURI(domNode);

        return extension;
    };

    var createElementExtension = function (domNode, useNamespaceURI) {
        /// <summary>Creates an extension object for the specified element.</summary>
        /// <param name="domNode">DOM node for the element.</param>
        /// <param name="useNamespaceURI" type="Boolean">Flag indicating if the namespaceURI property should be added to the extension object instead of the namespace property.</param>
        /// <remarks>
        ///    The useNamespaceURI flag is used to prevent a breaking change from older versions of datajs in which extension 
        ///    objects created for Atom extension attributes have the namespaceURI property instead of the namespace one.
        ///    
        ///    This flag and the namespaceURI property should be deprecated in future major versions of the library.
        /// </remarks>
        /// <returns type="Object">The new extension object.</returns>


        var attributeExtensions = [];
        var childrenExtensions = [];

        var i, len;
        var attributes = domNode.attributes;
        for (i = 0, len = attributes.length; i < len; i++) {
            var attr = attributes[i];
            if (xmlNamespaceURI(attr) !== xmlnsNS) {
                attributeExtensions.push(createAttributeExtension(attr, useNamespaceURI));
            }
        }

        var child = domNode.firstChild;
        while (child != null) {
            if (child.nodeType === 1) {
                childrenExtensions.push(createElementExtension(child, useNamespaceURI));
            }
            child = child.nextSibling;
        };

        var extension = {
            name: xmlLocalName(domNode),
            value: xmlInnerText(domNode),
            attributes: attributeExtensions,
            children: childrenExtensions
        };

        extension[useNamespaceURI ? "namespaceURI" : "namespace"] = xmlNamespaceURI(domNode);
        return extension;
    };

    var isCollectionItemElement = function (domElement) {
        /// <summary>Checks whether the domElement is a collection item.</summary>
        /// <param name="domElement">DOM element possibliy represnting a collection item.</param>
        /// <returns type="Boolean">True if the domeElement belongs to the OData metadata namespace and its local name is "element"; false otherwise.</returns>

        return xmlNamespaceURI(domElement) === odataXmlNs && xmlLocalName(domElement) === "element";
    };

    var makePropertyMetadata = function (type, extensions) {
        /// <summary>Creates an object containing property metadata.</summary>
        /// <param type="String" name="type">Property type name.</param>
        /// <param type="Array" name="extensions">Array of attribute extension objects.</param>
        /// <returns type="Object">Property metadata object cotaining type and extensions fields.</returns>

        return { type: type, extensions: extensions };
    };

    var odataInferTypeFromPropertyXmlDom = function (domElement) {
        /// <summary>Infers type of a property based on its xml DOM tree.</summary>
        /// <param name="domElement">DOM element for the property.</param>
        /// <returns type="String">Inferred type name; null if the type cannot be determined.</returns>

        if (xmlFirstChildElement(domElement, gmlXmlNs)) {
            return EDM_GEOMETRY;
        }

        var firstChild = xmlFirstChildElement(domElement, odataXmlNs);
        if (!firstChild) {
            return EDM_STRING;
        }

        if (isCollectionItemElement(firstChild)) {
            var sibling = xmlSiblingElement(firstChild, odataXmlNs);
            if (sibling && isCollectionItemElement(sibling)) {
                // More than one <element> tag have been found, it can be safely assumed that this is a collection property.
                return "Collection()";
            }
        }

        return null;
    };

    var xmlReadODataPropertyAttributes = function (domElement) {
        /// <summary>Reads the attributes of a property DOM element in an OData XML document.</summary>
        /// <param name="domElement">DOM element for the property.</param>
        /// <returns type="Object">Object containing the property type, if it is null, and its attribute extensions.</returns>

        var type = null;
        var isNull = false;
        var extensions = [];

        xmlAttributes(domElement, function (attribute) {
            var nsURI = xmlNamespaceURI(attribute);
            var localName = xmlLocalName(attribute);
            var value = xmlNodeValue(attribute);

            if (nsURI === odataMetaXmlNs) {
                if (localName === "null") {
                    isNull = (value.toLowerCase() === "true");
                    return;
                }

                if (localName === "type") {
                    type = value;
                    return;
                }
            }

            if (nsURI !== xmlNS && nsURI !== xmlnsNS) {
                extensions.push(createAttributeExtension(attribute, true));
                return;
            }
        });

        return { type: (!type && isNull ? EDM_STRING : type), isNull: isNull, extensions: extensions };
    };

    var xmlReadODataProperty = function (domElement) {
        /// <summary>Reads a property DOM element in an OData XML document.</summary>
        /// <param name="domElement">DOM element for the property.</param>
        /// <returns type="Object">Object with name, value, and metadata for the property.</returns>

        if (xmlNamespaceURI(domElement) !== odataXmlNs) {
            // domElement is not a proprety element because it is not in the odata xml namespace.
            return null;
        };

        var propertyName = xmlLocalName(domElement);
        var propertyAttributes = xmlReadODataPropertyAttributes(domElement);

        var propertyIsNull = propertyAttributes.isNull;
        var propertyType = propertyAttributes.type;

        var propertyMetadata = makePropertyMetadata(propertyType, propertyAttributes.extensions);
        var propertyValue = propertyIsNull ? null : xmlReadODataPropertyValue(domElement, propertyType, propertyMetadata);

        return { name: propertyName, value: propertyValue, metadata: propertyMetadata };
    };

    var xmlReadODataPropertyValue = function (domElement, propertyType, propertyMetadata) {
        /// <summary>Reads the value of a property in an OData XML document.</summary>
        /// <param name="domElement">DOM element for the property.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="propertyMetadata" type="Object">Object that will store metadata about the property.</param>
        /// <returns>Property value.</returns>

        if (!propertyType) {
            propertyType = odataInferTypeFromPropertyXmlDom(domElement);
            propertyMetadata.type = propertyType;
        }

        var isGeograhpyType = isGeographyEdmType(propertyType);
        if (isGeograhpyType || isGeometryEdmType(propertyType)) {
            return xmlReadODataSpatialPropertyValue(domElement, propertyType, isGeograhpyType);
        }

        if (isPrimitiveEdmType(propertyType)) {
            return xmlReadODataEdmPropertyValue(domElement, propertyType);
        }

        if (isCollectionType(propertyType)) {
            return xmlReadODataCollectionPropertyValue(domElement, propertyType, propertyMetadata);
        }

        return xmlReadODataComplexPropertyValue(domElement, propertyType, propertyMetadata);
    };

    var xmlReadODataSpatialPropertyValue = function (domElement, propertyType, isGeography) {
        /// <summary>Reads the value of an spatial property in an OData XML document.</summary>
        /// <param name="property">DOM element for the spatial property.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="isGeography" type="Boolean" Optional="True">Flag indicating if the value uses a geographic reference system or not.<param>
        /// <remarks>
        ///    When using a geographic reference system, the first component of all the coordinates in each <pos> element in the GML DOM tree is the Latitude and 
        ///    will be deserialized as the second component of each <pos> element in the GML DOM tree.
        /// </remarks>
        /// <returns>Spatial property value in GeoJSON format.</returns>

        var gmlRoot = xmlFirstChildElement(domElement, gmlXmlNs);

        var value = gmlReadODataSpatialValue(gmlRoot, isGeography);
        value.__metadata = { type: propertyType };
        return value;
    };

    var xmlReadODataEdmPropertyValue = function (domNode, propertyType) {
        /// <summary>Reads the value of an EDM property in an OData XML document.</summary>
        /// <param name="donNode">DOM node for the EDM property.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <returns>EDM property value.</returns>

        var propertyValue = xmlNodeValue(domNode) || "";

        switch (propertyType) {
            case EDM_BOOLEAN:
                return parseBool(propertyValue);
            case EDM_BINARY:
            case EDM_DECIMAL:
            case EDM_GUID:
            case EDM_INT64:
            case EDM_STRING:
                return propertyValue;
            case EDM_BYTE:
            case EDM_INT16:
            case EDM_INT32:
            case EDM_SBYTE:
                return parseInt10(propertyValue);
            case EDM_DOUBLE:
            case EDM_SINGLE:
                return parseFloat(propertyValue);
            case EDM_TIME:
                return parseDuration(propertyValue);
            case EDM_DATETIME:
                return parseDateTime(propertyValue);
            case EDM_DATETIMEOFFSET:
                return parseDateTimeOffset(propertyValue);
        };

        return propertyValue;
    };

    var xmlReadODataComplexPropertyValue = function (domElement, propertyType, propertyMetadata) {
        /// <summary>Reads the value of a complex type property in an OData XML document.</summary>
        /// <param name="property">DOM element for the complex type property.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="propertyMetadata" type="Object">Object that will store metadata about the property.</param>
        /// <returns type="Object">Complex type property value.</returns>

        var propertyValue = { __metadata: { type: propertyType} };
        xmlChildElements(domElement, function (child) {
            var childProperty = xmlReadODataProperty(child);
            var childPropertyName = childProperty.name;

            propertyMetadata.properties = propertyMetadata.properties || {};
            propertyMetadata.properties[childPropertyName] = childProperty.metadata;
            propertyValue[childPropertyName] = childProperty.value;
        });

        return propertyValue;
    }

    var xmlReadODataCollectionPropertyValue = function (domElement, propertyType, propertyMetadata) {
        /// <summary>Reads the value of a collection property in an OData XML document.</summary>
        /// <param name="property">DOM element for the collection property.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="propertyMetadata" type="Object">Object that will store metadata about the property.</param>
        /// <returns type="Object">Collection property value.</returns>

        var items = [];
        var itemsMetadata = propertyMetadata.elements = [];
        var collectionType = getCollectionType(propertyType);

        xmlChildElements(domElement, function (child) {
            if (isCollectionItemElement(child)) {
                var itemAttributes = xmlReadODataPropertyAttributes(child);
                var itemExtensions = itemAttributes.extensions;
                var itemType = itemAttributes.type || collectionType;
                var itemMetadata = makePropertyMetadata(itemType, itemExtensions);

                var item = xmlReadODataPropertyValue(child, itemType, itemMetadata);

                items.push(item);
                itemsMetadata.push(itemMetadata);
            }
        });

        return { __metadata: { type: propertyType === "Collection()" ? null : propertyType }, results: items };
    };

    var readODataXmlDocument = function (xmlRoot, baseURI) {
        /// <summary>Reads an OData link(s) producing an object model in return.</summary>
        /// <param name="xmlRoot">Top-level element to read.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the XML payload.</param>
        /// <returns type="Object">The object model representing the specified element.</returns>

        if (xmlNamespaceURI(xmlRoot) === odataXmlNs) {
            baseURI = xmlBaseURI(xmlRoot, baseURI);
            var localName = xmlLocalName(xmlRoot);

            if (localName === "links") {
                return readLinks(xmlRoot, baseURI);
            }
            if (localName === "uri") {
                return readUri(xmlRoot, baseURI);
            }
        }
        return undefined;
    };

    var readLinks = function (linksElement, baseURI) {
        /// <summary>Deserializes an OData XML links element.</summary>
        /// <param name="linksElement">XML links element.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the XML payload.</param>
        /// <returns type="Object">A new object representing the links collection.</returns>

        var uris = [];

        xmlChildElements(linksElement, function (child) {
            if (xmlLocalName(child) === "uri" && xmlNamespaceURI(child) === odataXmlNs) {
                uris.push(readUri(child, baseURI));
            }
        });

        return { results: uris };
    };

    var readUri = function (uriElement, baseURI) {
        /// <summary>Deserializes an OData XML uri element.</summary>
        /// <param name="uriElement">XML uri element.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the XML payload.</param>
        /// <returns type="Object">A new object representing the uri.</returns>

        var uri = xmlInnerText(uriElement) || "";
        return { uri: normalizeURI(uri, baseURI) };
    };

    var xmlODataInferSpatialValueGeoJsonType = function (value, edmType) {
        /// <summary>Infers the GeoJSON type from the spatial property value and the edm type name.</summary>
        /// <param name="value" type="Object">Spatial property value in GeoJSON format.</param>
        /// <param name="edmType" type="String" mayBeNull="true" optional="true">Spatial property edm type.<param>
        /// <remarks>
        ///   If the edmType parameter is null, undefined, "Edm.Geometry" or "Edm.Geography", then the function returns 
        ///   the GeoJSON type indicated by the value's type property.
        ///
        ///   If the edmType parameter is specified or is not one of the base spatial types, then it is used to 
        ///   determine the GeoJSON type and the value's type property is ignored.
        /// </remarks>
        /// <returns>New DOM element in the GML namespace for the spatial value. </returns>

        if (edmType === EDM_GEOMETRY || edmType === EDM_GEOGRAPHY) {
            return value && value.type;
        }

        if (edmType === EDM_GEOMETRY_POINT || edmType === EDM_GEOGRAPHY_POINT) {
            return GEOJSON_POINT;
        }

        if (edmType === EDM_GEOMETRY_LINESTRING || edmType === EDM_GEOGRAPHY_LINESTRING) {
            return GEOJSON_LINESTRING;
        }

        if (edmType === EDM_GEOMETRY_POLYGON || edmType === EDM_GEOGRAPHY_POLYGON) {
            return GEOJSON_POLYGON;
        }

        if (edmType === EDM_GEOMETRY_COLLECTION || edmType === EDM_GEOGRAPHY_COLLECTION) {
            return GEOJSON_GEOMETRYCOLLECTION;
        }

        if (edmType === EDM_GEOMETRY_MULTIPOLYGON || edmType === EDM_GEOGRAPHY_MULTIPOLYGON) {
            return GEOJSON_MULTIPOLYGON;
        }

        if (edmType === EDM_GEOMETRY_MULTILINESTRING || edmType === EDM_GEOGRAPHY_MULTILINESTRING) {
            return GEOJSON_MULTILINESTRING;
        }

        if (edmType === EDM_GEOMETRY_MULTIPOINT || edmType === EDM_GEOGRAPHY_MULTIPOINT) {
            return GEOJSON_MULTIPOINT;
        }

        return null;
    };

    var xmlNewODataMetaElement = function (dom, name, children) {
        /// <summary>Creates a new DOM element in the OData metadata namespace.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Local name of the OData metadata element to create.</param>
        /// <param name="children" type="Array">Array containing DOM nodes or string values that will be added as children of the new DOM element.</param>
        /// <returns>New DOM element in the OData metadata namespace.</returns>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended as a child of the new DOM Element.
        /// </remarks>

        return xmlNewElement(dom, odataMetaXmlNs, xmlQualifiedName(odataMetaPrefix, name), children);
    };

    var xmlNewODataMetaAttribute = function (dom, name, value) {
        /// <summary>Creates a new DOM attribute in the odata namespace.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Local name of the OData attribute to create.</param>
        /// <param name="value">Attribute value.</param>
        /// <returns>New DOM attribute in the odata namespace.</returns>

        return xmlNewAttribute(dom, odataMetaXmlNs, xmlQualifiedName(odataMetaPrefix, name), value);
    };

    var xmlNewODataElement = function (dom, name, children) {
        /// <summary>Creates a new DOM element in the OData namespace.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Local name of the OData element to create.</param>
        /// <param name="children" type="Array">Array containing DOM nodes or string values that will be added as children of the new DOM element.</param>
        /// <returns>New DOM element in the OData namespace.</returns>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended as a child of the new DOM Element.
        /// </remarks>

        return xmlNewElement(dom, odataXmlNs, xmlQualifiedName(odataPrefix, name), children);
    };

    var xmlNewODataPrimitiveValue = function (value, typeName) {
        /// <summary>Returns the string representation of primitive value for an OData XML document.</summary>
        /// <param name="value">Primivite value to format.</param>
        /// <param name="typeName" type="String" optional="true">Type name of the primitive value.</param>
        /// <returns type="String">Formatted primitive value.</returns>

        if (typeName === EDM_DATETIME || typeName === EDM_DATETIMEOFFSET || isDate(value)) {
            return formatDateTimeOffset(value);
        }
        if (typeName === EDM_TIME) {
            return formatDuration(value);
        }
        return value.toString();
    };

    var xmlNewODataElementInfo = function (domElement, dataServiceVersion) {
        /// <summary>Creates an object that represents a new DOM element for an OData XML document and the data service version it requires.</summary>
        /// <param name="domElement">New DOM element for an OData XML document.</param>
        /// <param name="dataServiceVersion" type="String">Required data service version by the new DOM element.</param>
        /// <returns type="Object">Object containing new DOM element and its required data service version.</returns>

        return { element: domElement, dsv: dataServiceVersion };
    };

    var xmlNewODataProperty = function (dom, name, typeName, children) {
        /// <summary>Creates a new DOM element for an entry property in an OData XML document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="typeName" type="String" optional="true">Property type name.</param>
        /// <param name="children" type="Array">Array containing DOM nodes or string values that will be added as children of the new DOM element.</param>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended as a child of the new DOM Element.
        /// </remarks>
        /// <returns>New DOM element in the OData namespace for the entry property.</returns>

        var typeAttribute = typeName ? xmlNewODataMetaAttribute(dom, "type", typeName) : null;
        var property = xmlNewODataElement(dom, name, typeAttribute);
        return xmlAppendChildren(property, children);
    };

    var xmlNewODataEdmProperty = function (dom, name, value, typeName) {
        /// <summary>Creates a new DOM element for an EDM property in an OData XML document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="value">Property value.</param>
        /// <param name="typeName" type="String" optional="true">Property type name.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the OData namespace for the EDM property and the 
        ///     required data service version for this property.
        /// </returns>

        var propertyValue = xmlNewODataPrimitiveValue(value, typeName);
        var property = xmlNewODataProperty(dom, name, typeName, propertyValue);
        return xmlNewODataElementInfo(property, /*dataServiceVersion*/"1.0");
    };

    var xmlNewODataNullProperty = function (dom, name, typeName, model) {
        /// <summary>Creates a new DOM element for a null property in an OData XML document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="typeName" type="String" optional="true">Property type name.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <remarks>
        ///     If no typeName is specified, then it will be assumed that this is a primitive type property.
        /// </remarks>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the OData namespace for the null property and the 
        ///     required data service version for this property.
        /// </returns>

        var nullAttribute = xmlNewODataMetaAttribute(dom, "null", "true");
        var property = xmlNewODataProperty(dom, name, typeName, nullAttribute);
        var dataServiceVersion = lookupComplexType(typeName, model) ? "2.0" : "1.0";

        return xmlNewODataElementInfo(property, dataServiceVersion);
    };

    var xmlNewODataCollectionProperty = function (dom, name, value, typeName, collectionMetadata, collectionModel, model) {
        /// <summary>Creates a new DOM element for a collection property in an OData XML document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="value">Property value either as an array or an object representing a collection in the library's internal representation.</param>
        /// <param name="typeName" type="String" optional="true">Property type name.</param>
        /// <param name="collectionMetadata" type="Object" optional="true">Object containing metadata about the collection property.</param>
        /// <param name="collectionModel" type="Object" optional="true">Object describing the collection property in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the OData namespace for the collection property and the 
        ///     required data service version for this property.
        /// </returns>

        var itemTypeName = getCollectionType(typeName);
        var items = isArray(value) ? value : value.results;
        var itemMetadata = typeName ? { type: itemTypeName} : {};
        itemMetadata.properties = collectionMetadata.properties;

        var xmlProperty = xmlNewODataProperty(dom, name, itemTypeName ? typeName : null);

        var i, len;
        for (i = 0, len = items.length; i < len; i++) {
            var itemValue = items[i];
            var item = xmlNewODataDataElement(dom, "element", itemValue, itemMetadata, collectionModel, model);

            xmlAppendChild(xmlProperty, item.element);
        }
        return xmlNewODataElementInfo(xmlProperty, /*dataServiceVersion*/"3.0");
    };

    var xmlNewODataComplexProperty = function (dom, name, value, typeName, propertyMetadata, propertyModel, model) {
        /// <summary>Creates a new DOM element for a complex type property in an OData XML document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="value">Property value as an object in the library's internal representation.</param>
        /// <param name="typeName" type="String" optional="true">Property type name.</param>
        /// <param name="propertyMetadata" type="Object" optional="true">Object containing metadata about the complex type property.</param>
        /// <param name="propertyModel" type="Object" optional="true">Object describing the complex type property in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the OData namespace for the complex type property and the 
        ///     required data service version for this property.
        /// </returns>

        var xmlProperty = xmlNewODataProperty(dom, name, typeName);
        var complexTypePropertiesMetadata = propertyMetadata.properties || {};
        var complexTypeModel = lookupComplexType(typeName, model) || {};

        var dataServiceVersion = "1.0";

        for (var key in value) {
            if (key !== "__metadata") {
                var memberValue = value[key];
                var memberModel = lookupProperty(complexTypeModel.property, key);
                var memberMetadata = complexTypePropertiesMetadata[key] || {};
                var member = xmlNewODataDataElement(dom, key, memberValue, memberMetadata, memberModel, model);

                dataServiceVersion = maxVersion(dataServiceVersion, member.dsv);
                xmlAppendChild(xmlProperty, member.element);
            }
        };
        return xmlNewODataElementInfo(xmlProperty, dataServiceVersion);
    };

    var xmlNewODataSpatialProperty = function (dom, name, value, typeName, isGeography) {
        /// <summary>Creates a new DOM element for an EDM spatial property in an OData XML document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="value" type="Object">GeoJSON object containing the property value.</param>
        /// <param name="typeName" type="String" optional="true">Property type name.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the OData namespace for the EDM property and the 
        ///     required data service version for this property.
        /// </returns>

        var geoJsonType = xmlODataInferSpatialValueGeoJsonType(value, typeName);

        var gmlRoot = gmlNewODataSpatialValue(dom, value, geoJsonType, isGeography);
        var xmlProperty = xmlNewODataProperty(dom, name, typeName, gmlRoot);

        return xmlNewODataElementInfo(xmlProperty, "3.0");
    };

    var xmlNewODataDataElement = function (dom, name, value, dataItemMetadata, dataItemModel, model) {
        /// <summary>Creates a new DOM element for a data item in an entry, complex property, or collection property.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Data item name.</param>
        /// <param name="value" optional="true" mayBeNull="true">Value of the data item, if any.</param>
        /// <param name="dataItemMetadata" type="Object" optional="true">Object containing metadata about the data item.</param>
        /// <param name="dataItemModel" type="Object" optional="true">Object describing the data item in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the appropriate namespace for the data item and the 
        ///     required data service version for it.
        /// </returns>
        var typeName = dataItemTypeName(value, dataItemMetadata, dataItemModel);
    	// ##### BEGIN: MODIFIED BY SAP
        // the above method doesn't work in all cases (e.g. POST) when dataItemMetadata is empty.
        // The 3rd parameter is always ignored in dataItemTypeName function
        // so if there is no typename we try to find it with the third parameter dataItemModel
        if (!typeName) {
        	typeName = dataItemTypeName(value, dataItemModel);	
        }
        // ##### END: MODIFIED BY SAP
        
        if (isPrimitive(value)) {
        	// ##### BEGIN: MODIFIED BY SAP
        	// removed // typeName || EDM_STRING
        	// if no type found at all don't add any default type so that no embedded type is sent which should also work
            return xmlNewODataEdmProperty(dom, name, value, typeName);
            // ##### END: MODIFIED BY SAP
        }

        var isGeography = isGeographyEdmType(typeName);
        if (isGeography || isGeometryEdmType(typeName)) {
            return xmlNewODataSpatialProperty(dom, name, value, typeName, isGeography);
        }

        if (isCollection(value, typeName)) {
            return xmlNewODataCollectionProperty(dom, name, value, typeName, dataItemMetadata, dataItemModel, model);
        }

        if (isNamedStream(value)) {
            return null;
        }

        // This may be a navigation property.   
        var navPropKind = navigationPropertyKind(value, dataItemModel);
        if (navPropKind !== null) {
            return null;
        }

        if (value === null) {
            return xmlNewODataNullProperty(dom, name, typeName);
        }

        return xmlNewODataComplexProperty(dom, name, value, typeName, dataItemMetadata, dataItemModel, model);
    };

    var odataNewLinkDocument = function (data) {
        /// <summary>Writes the specified data into an OData XML document.</summary>
        /// <param name="data">Data to write.</param>
        /// <returns>The root of the DOM tree built.</returns>

        if (data && isObject(data)) {
            var dom = xmlDom();
            return xmlAppendChild(dom, xmlNewODataElement(dom, "uri", data.uri));
        }
        // Allow for undefined to be returned.
    };

    var xmlParser = function (handler, text) {
        /// <summary>Parses an OData XML document.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="text" type="String">Document text.</param>
        /// <returns>An object representation of the document; undefined if not applicable.</returns>

        if (text) {
            var doc = xmlParse(text);
            var root = xmlFirstChildElement(doc);
            if (root) {
                return readODataXmlDocument(root);
            }
        }

        // Allow for undefined to be returned.
    };

    var xmlSerializer = function (handler, data, context) {
        /// <summary>Serializes an OData XML object into a document.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="data" type="Object">Representation of feed or entry.</param>
        /// <param name="context" type="Object">Object with parsing context.</param>
        /// <returns>A text representation of the data object; undefined if not applicable.</returns>

        var cType = context.contentType = context.contentType || contentType(xmlMediaType);
        if (cType && cType.mediaType === xmlMediaType) {
            return xmlSerialize(odataNewLinkDocument(data));
        }
        return undefined;
    };

    odata.xmlHandler = handler(xmlParser, xmlSerializer, xmlMediaType, MAX_DATA_SERVICE_VERSION);



    var atomPrefix = "a";

    var atomXmlNs = w3org + "2005/Atom";                    // http://www.w3.org/2005/Atom
    var appXmlNs = w3org + "2007/app";                      // http://www.w3.org/2007/app

    var odataEditMediaPrefix = adoDs + "/edit-media/";        // http://schemas.microsoft.com/ado/2007/08/dataservices/edit-media
    var odataMediaResourcePrefix = adoDs + "/mediaresource/"; // http://schemas.microsoft.com/ado/2007/08/dataservices/mediaresource
    var odataRelatedLinksPrefix = adoDs + "/relatedlinks/";   // http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks

    var atomAcceptTypes = ["application/atom+xml", "application/atomsvc+xml", "application/xml"];
    var atomMediaType = atomAcceptTypes[0];

    // These are the namespaces that are not considered ATOM extension namespaces.
    var nonExtensionNamepaces = [atomXmlNs, appXmlNs, xmlNS, xmlnsNS];

    // These are entity property mapping paths that have well-known paths.
    var knownCustomizationPaths = {
        SyndicationAuthorEmail: "author/email",
        SyndicationAuthorName: "author/name",
        SyndicationAuthorUri: "author/uri",
        SyndicationContributorEmail: "contributor/email",
        SyndicationContributorName: "contributor/name",
        SyndicationContributorUri: "contributor/uri",
        SyndicationPublished: "published",
        SyndicationRights: "rights",
        SyndicationSummary: "summary",
        SyndicationTitle: "title",
        SyndicationUpdated: "updated"
    };

    var expandedFeedCustomizationPath = function (path) {
        /// <summary>Returns an expanded customization path if it's well-known.</summary>
        /// <param name="path" type="String">Path to expand.</param>
        /// <returns type="String">Expanded path or just 'path' otherwise.</returns>

        return knownCustomizationPaths[path] || path;
    };

    var isExtensionNs = function (nsURI) {
        /// <summary>Checks whether the specified namespace is an extension namespace to ATOM.</summary>
        /// <param type="String" name="nsURI">Namespace to check.</param>
        /// <returns type="Boolean">true if nsURI is an extension namespace to ATOM; false otherwise.</returns>

        return !(contains(nonExtensionNamepaces, nsURI));
    };

    var atomFeedCustomization = function (customizationModel, entityType, model, propertyName, suffix) {
        /// <summary>Creates an object describing a feed customization that was delcared in an OData conceptual schema.</summary>
        /// <param name="customizationModel" type="Object">Object describing the customization delcared in the conceptual schema.</param>
        /// <param name="entityType" type="Object">Object describing the entity type that owns the customization in an OData conceputal schema.</param>
        /// <param name="model" type="Object">Object describing an OData conceptual schema.</param>
        /// <param name="propertyName" type="String" optional="true">Name of the property to which this customization applies.</param>
        /// <param name="suffix" type="String" optional="true">Suffix to feed customization properties in the conceptual schema.</param>
        /// <returns type="Object">Object that describes an applicable feed customization.</returns>

        suffix = suffix || "";
        var targetPath = customizationModel["FC_TargetPath" + suffix];
        if (!targetPath) {
            return null;
        }

        var sourcePath = customizationModel["FC_SourcePath" + suffix];
        var targetXmlPath = expandedFeedCustomizationPath(targetPath);

        var propertyPath = propertyName ? propertyName + (sourcePath ? "/" + sourcePath : "") : sourcePath;
        var propertyType = propertyPath && lookupPropertyType(model, entityType, propertyPath);
        var nsURI = customizationModel["FC_NsUri" + suffix] || null;
        var nsPrefix = customizationModel["FC_NsPrefix" + suffix] || null;
        var keepinContent = customizationModel["FC_KeepInContent" + suffix] || "";

        if (targetPath !== targetXmlPath) {
            nsURI = atomXmlNs;
            nsPrefix = atomPrefix;
        }

        return {
            contentKind: customizationModel["FC_ContentKind" + suffix],
            keepInContent: keepinContent.toLowerCase() === "true",
            nsPrefix: nsPrefix,
            nsURI: nsURI,
            propertyPath: propertyPath,
            propertyType: propertyType,
            entryPath: targetXmlPath
        };
    };

    var atomApplyAllFeedCustomizations = function (entityType, model, callback) {
        /// <summary>Gets all the feed customizations that have to be applied to an entry as per the enity type declared in an OData conceptual schema.</summary>
        /// <param name="entityType" type="Object">Object describing an entity type in a conceptual schema.</param>
        /// <param name="model" type="Object">Object describing an OData conceptual schema.</param>
        /// <param name="callback" type="Function">Callback function to be invoked for each feed customization that needs to be applied.</param>

        var customizations = [];
        while (entityType) {
            var sourcePath = entityType.FC_SourcePath;
            var customization = atomFeedCustomization(entityType, entityType, model);
            if (customization) {
                callback(customization);
            }

            var properties = entityType.property || [];
            var i, len;
            for (i = 0, len = properties.length; i < len; i++) {
                var property = properties[i];
                var suffixCounter = 0;
                var suffix = "";

                while (customization = atomFeedCustomization(property, entityType, model, property.name, suffix)) {
                    callback(customization);
                    suffixCounter++;
                    suffix = "_" + suffixCounter;
                };
            }
            entityType = lookupEntityType(entityType.baseType, model);
        }
        return customizations;
    };

    var atomReadExtensionAttributes = function (domElement) {
        /// <summary>Reads ATOM extension attributes (any attribute not in the Atom namespace) from a DOM element.</summary>
        /// <param name="domElement">DOM element with zero or more extension attributes.</param>
        /// <returns type="Array">An array of extension attribute representations.</returns>

        var extensions = [];
        xmlAttributes(domElement, function (attribute) {
            var nsURI = xmlNamespaceURI(attribute);
            if (isExtensionNs(nsURI)) {
                extensions.push(createAttributeExtension(attribute, true));
            }
        });
        return extensions;
    };

    var atomReadExtensionElement = function (domElement) {
        /// <summary>Reads an ATOM extension element (an element not in the ATOM namespaces).</summary>
        /// <param name="domElement">DOM element not part of the atom namespace.</param>
        /// <returns type="Object">Object representing the extension element.</returns>

        return createElementExtension(domElement, /*addNamespaceURI*/true);
    };

    var atomReadDocument = function (domElement, baseURI, model) {
        /// <summary>Reads an ATOM entry, feed or service document, producing an object model in return.</summary>
        /// <param name="domElement">Top-level ATOM DOM element to read.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the ATOM document.</param>
        /// <param name="model" type="Object">Object that describes the conceptual schema.</param>
        /// <returns type="Object">The object model representing the specified element, undefined if the top-level element is not part of the ATOM specification.</returns>

        var nsURI = xmlNamespaceURI(domElement);
        var localName = xmlLocalName(domElement);

        // Handle service documents. 
        if (nsURI === appXmlNs && localName === "service") {
            return atomReadServiceDocument(domElement, baseURI);
        }

        // Handle feed and entry elements.
        if (nsURI === atomXmlNs) {
            if (localName === "feed") {
                return atomReadFeed(domElement, baseURI, model);
            }
            if (localName === "entry") {
                return atomReadEntry(domElement, baseURI, model);
            }
        }

        // Allow undefined to be returned.
    };

    var atomReadAdvertisedActionOrFunction = function (domElement, baseURI) {
        /// <summary>Reads the DOM element for an action or a function in an OData Atom document.</summary>
        /// <param name="domElement">DOM element to read.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing the action or function target url.</param>
        /// <returns type="Object">Object with title, target, and metadata fields.</returns>

        var extensions = [];
        var result = { extensions: extensions };
        xmlAttributes(domElement, function (attribute) {
            var localName = xmlLocalName(attribute);
            var nsURI = xmlNamespaceURI(attribute);
            var value = xmlNodeValue(attribute);

            if (nsURI === null) {
                if (localName === "title" || localName === "metadata") {
                    result[localName] = value;
                    return;
                }
                if (localName === "target") {
                    result.target = normalizeURI(value, xmlBaseURI(domElement, baseURI));
                    return;
                }
            }

            if (isExtensionNs(nsURI)) {
                extensions.push(createAttributeExtension(attribute, true));
            }
        });
        return result;
    };

    var atomReadAdvertisedAction = function (domElement, baseURI, parentMetadata) {
        /// <summary>Reads the DOM element for an action in an OData Atom document.</summary>
        /// <param name="domElement">DOM element to read.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing the action or target url.</param>
        /// <param name="parentMetadata" type="Object">Object to update with the action metadata.</param>

        var actions = parentMetadata.actions = parentMetadata.actions || [];
        actions.push(atomReadAdvertisedActionOrFunction(domElement, baseURI));
    };

    var atomReadAdvertisedFunction = function (domElement, baseURI, parentMetadata) {
        /// <summary>Reads the DOM element for an action in an OData Atom document.</summary>
        /// <param name="domElement">DOM element to read.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing the action or target url.</param>
        /// <param name="parentMetadata" type="Object">Object to update with the action metadata.</param>

        var functions = parentMetadata.functions = parentMetadata.functions || [];
        functions.push(atomReadAdvertisedActionOrFunction(domElement, baseURI));
    };

    var atomReadFeed = function (domElement, baseURI, model) {
        /// <summary>Reads a DOM element for an ATOM feed, producing an object model in return.</summary>
        /// <param name="domElement">ATOM feed DOM element.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the ATOM feed.</param>
        /// <param name="model">Metadata that describes the conceptual schema.</param>
        /// <returns type="Object">A new object representing the feed.</returns>

        var extensions = atomReadExtensionAttributes(domElement);
        var feedMetadata = { feed_extensions: extensions };
        var results = [];

        var feed = { __metadata: feedMetadata, results: results };

        baseURI = xmlBaseURI(domElement, baseURI);

        xmlChildElements(domElement, function (child) {
            var nsURI = xmlNamespaceURI(child);
            var localName = xmlLocalName(child);

            if (nsURI === odataMetaXmlNs) {
                if (localName === "count") {
                    feed.__count = parseInt(xmlInnerText(child));
                    return;
                }
                if (localName === "action") {
                    atomReadAdvertisedAction(child, baseURI, feedMetadata);
                    return;
                }
                if (localName === "function") {
                    atomReadAdvertisedFunction(child, baseURI, feedMetadata);
                    return;
                }
            }

            if (isExtensionNs(nsURI)) {
                extensions.push(createElementExtension(child));
                return;
            };

            // The element should belong to the ATOM namespace.

            if (localName === "entry") {
                results.push(atomReadEntry(child, baseURI, model));
                return;
            }
            if (localName === "link") {
                atomReadFeedLink(child, feed, baseURI);
                return;
            }
            if (localName === "id") {
                feedMetadata.uri = normalizeURI(xmlInnerText(child), baseURI);
                feedMetadata.uri_extensions = atomReadExtensionAttributes(child);
                return;
            }
            if (localName === "title") {
                feedMetadata.title = xmlInnerText(child) || "";
                feedMetadata.title_extensions = atomReadExtensionAttributes(child);
                return;
            }
        });

        return feed;
    };

    var atomReadFeedLink = function (domElement, feed, baseURI) {
        /// <summary>Reads an ATOM link DOM element for a feed.</summary>
        /// <param name="domElement">ATOM link DOM element.</param>
        /// <param name="feed">Feed object to be annotated with the link data.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>

        var link = atomReadLink(domElement, baseURI);
        var href = link.href;
        var rel = link.rel;
        var extensions = link.extensions;
        var metadata = feed.__metadata;

        if (rel === "next") {
            feed.__next = href;
            metadata.next_extensions = extensions;
            return;
        }
        if (rel === "self") {
            metadata.self = href;
            metadata.self_extensions = extensions;
            return;
        }
    };

    var atomReadLink = function (domElement, baseURI) {
        /// <summary>Reads an ATOM link DOM element.</summary>
        /// <param name="linkElement">DOM element to read.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing the link href.</param>
        /// <returns type="Object">A link element representation.</returns>

        baseURI = xmlBaseURI(domElement, baseURI);

        var extensions = [];
        var link = { extensions: extensions, baseURI: baseURI };

        xmlAttributes(domElement, function (attribute) {
            var nsURI = xmlNamespaceURI(attribute);
            var localName = xmlLocalName(attribute);
            var value = attribute.value;

            if (localName === "href") {
                link.href = normalizeURI(value, baseURI);
                return;
            }
            if (localName === "type" || localName === "rel") {
                link[localName] = value;
                return;
            }

            if (isExtensionNs(nsURI)) {
                extensions.push(createAttributeExtension(attribute, true));
            }
        });

        if (!link.href) {
            throw { error: "href attribute missing on link element", element: domElement };
        }

        return link;
    };

    var atomGetObjectValueByPath = function (path, item) {
        /// <summary>Gets a slashed path value from the specified item.</summary>
        /// <param name="path" type="String">Property path to read ('/'-separated).</param>
        /// <param name="item" type="Object">Object to get value from.</param>
        /// <returns>The property value, possibly undefined if any path segment is missing.</returns>

        // Fast path.
        if (path.indexOf('/') === -1) {
            return item[path];
        } else {
            var parts = path.split('/');
            var i, len;
            for (i = 0, len = parts.length; i < len; i++) {
                // Avoid traversing a null object.
                if (item === null) {
                    return undefined;
                }

                item = item[parts[i]];
                if (item === undefined) {
                    return item;
                }
            }

            return item;
        }
    };

    var atomSetEntryValueByPath = function (path, target, value, propertyType) {
        /// <summary>Sets a slashed path value on the specified target.</summary>
        /// <param name="path" type="String">Property path to set ('/'-separated).</param>
        /// <param name="target" type="Object">Object to set value on.</param>
        /// <param name="value">Value to set.</param>
        /// <param name="propertyType" type="String" optional="true">Property type to set in metadata.</param>

        var propertyName;
        if (path.indexOf('/') === -1) {
            target[path] = value;
            propertyName = path;
        } else {
            var parts = path.split('/');
            var i, len;
            for (i = 0, len = (parts.length - 1); i < len; i++) {
                // We construct each step of the way if the property is missing;
                // if it's already initialized to null, we stop further processing.
                var next = target[parts[i]];
                if (next === undefined) {
                    next = {};
                    target[parts[i]] = next;
                } else if (next === null) {
                    return;
                }
                target = next;
            }
            propertyName = parts[i];
            target[propertyName] = value;
        }

        if (propertyType) {
            var metadata = target.__metadata = target.__metadata || {};
            var properties = metadata.properties = metadata.properties || {};
            var property = properties[propertyName] = properties[propertyName] || {};
            property.type = propertyType;
        }
    };

    var atomApplyCustomizationToEntryObject = function (customization, domElement, entry) {
        /// <summary>Applies a specific feed customization item to an object.</summary>
        /// <param name="customization">Object with customization description.</param>
        /// <param name="sourcePath">Property path to set ('source' in the description).</param>
        /// <param name="entryElement">XML element for the entry that corresponds to the object being read.</param>
        /// <param name="entryObject">Object being read.</param>
        /// <param name="propertyType" type="String">Name of property type to set.</param>
        /// <param name="suffix" type="String">Suffix to feed customization properties.</param>

        var propertyPath = customization.propertyPath;
        // If keepInConent equals true or the property value is null we do nothing as this overrides any other customization.
        if (customization.keepInContent || atomGetObjectValueByPath(propertyPath, entry) === null) {
            return;
        }

        var xmlNode = xmlFindNodeByPath(domElement, customization.nsURI, customization.entryPath);

        // If the XML tree does not contain the necessary elements to read the value,
        // then it shouldn't be considered null, but rather ignored at all. This prevents
        // the customization from generating the object path down to the property.
        if (!xmlNode) {
            return;
        }

        var propertyType = customization.propertyType;
        var propertyValue;

        if (customization.contentKind === "xhtml") {
            // Treat per XHTML in http://tools.ietf.org/html/rfc4287#section-3.1.1, including the DIV
            // in the content.
            propertyValue = xmlSerializeDescendants(xmlNode);
        } else {
            propertyValue = xmlReadODataEdmPropertyValue(xmlNode, propertyType || "Edm.String");
        }
        // Set the value on the entry.
        atomSetEntryValueByPath(propertyPath, entry, propertyValue, propertyType);
    };

    var lookupPropertyType = function (metadata, owningType, path) {
        /// <summary>Looks up the type of a property given its path in an entity type.</summary>
        /// <param name="metadata">Metadata in which to search for base and complex types.</param>
        /// <param name="owningType">Type to which property belongs.</param>
        /// <param name="path" type="String" mayBeNull="false">Property path to look at.</param>
        /// <returns type="String">The name of the property type; possibly null.</returns>

        var parts = path.split("/");
        var i, len;
        while (owningType) {
            // Keep track of the type being traversed, necessary for complex types.
            var traversedType = owningType;

            for (i = 0, len = parts.length; i < len; i++) {
                // Traverse down the structure as necessary.
                var properties = traversedType.property;
                if (!properties) {
                    break;
                }

                // Find the property by scanning the property list (might be worth pre-processing).
                var propertyFound = lookupProperty(properties, parts[i]);
                if (!propertyFound) {
                    break;
                }

                var propertyType = propertyFound.type;

                // We could in theory still be missing types, but that would
                // be caused by a malformed path.
                if (!propertyType || isPrimitiveEdmType(propertyType)) {
                    return propertyType || null;
                }

                traversedType = lookupComplexType(propertyType, metadata);
                if (!traversedType) {
                    return null;
                }
            }

            // Traverse up the inheritance chain.
            owningType = lookupEntityType(owningType.baseType, metadata);
        }

        return null;
    };

    var atomReadEntry = function (domElement, baseURI, model) {
        /// <summary>Reads a DOM element for an ATOM entry, producing an object model in return.</summary>
        /// <param name="domElement">ATOM entry DOM element.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the ATOM entry.</param>
        /// <param name="model">Metadata that describes the conceptual schema.</param>
        /// <returns type="Object">A new object representing the entry.</returns>

        var entryMetadata = {};
        var entry = { __metadata: entryMetadata };

        var etag = xmlAttributeValue(domElement, "etag", odataMetaXmlNs);
        if (etag) {
            entryMetadata.etag = etag;
        }

        baseURI = xmlBaseURI(domElement, baseURI);

        xmlChildElements(domElement, function (child) {
            var nsURI = xmlNamespaceURI(child);
            var localName = xmlLocalName(child);

            if (nsURI === atomXmlNs) {
                if (localName === "id") {
                    atomReadEntryId(child, entryMetadata, baseURI);
                    return;
                }
                if (localName === "category") {
                    atomReadEntryType(child, entryMetadata);
                    return;
                }
                if (localName === "content") {
                    atomReadEntryContent(child, entry, entryMetadata, baseURI);
                    return;
                }
                if (localName === "link") {
                    atomReadEntryLink(child, entry, entryMetadata, baseURI, model);
                    return;
                }
                return;
            }

            if (nsURI === odataMetaXmlNs) {
                if (localName === "properties") {
                    atomReadEntryStructuralObject(child, entry, entryMetadata);
                    return;
                }
                if (localName === "action") {
                    atomReadAdvertisedAction(child, baseURI, entryMetadata);
                    return;
                }
                if (localName === "function") {
                    atomReadAdvertisedFunction(child, baseURI, entryMetadata);
                    return;
                }
            }
        });

        // Apply feed customizations if applicable
        var entityType = lookupEntityType(entryMetadata.type, model);
        atomApplyAllFeedCustomizations(entityType, model, function (customization) {
            atomApplyCustomizationToEntryObject(customization, domElement, entry);
        });

        return entry;
    };

    var atomReadEntryId = function (domElement, entryMetadata, baseURI) {
        /// <summary>Reads an ATOM entry id DOM element.</summary>
        /// <param name="domElement">ATOM id DOM element.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the id information.</param>

        entryMetadata.uri = normalizeURI(xmlInnerText(domElement), xmlBaseURI(domElement, baseURI));
        entryMetadata.uri_extensions = atomReadExtensionAttributes(domElement);
    };

    var atomReadEntryType = function (domElement, entryMetadata) {
        /// <summary>Reads type information from an ATOM category DOM element.</summary>
        /// <param name="domElement">ATOM category DOM element.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the type information.</param>

        if (xmlAttributeValue(domElement, "scheme") === odataScheme) {
            if (entryMetadata.type) {
                throw { message: "Invalid AtomPub document: multiple category elements defining the entry type were encounterd withing an entry", element: domElement };
            }

            var typeExtensions = [];
            xmlAttributes(domElement, function (attribute) {
                var nsURI = xmlNamespaceURI(attribute);
                var localName = xmlLocalName(attribute);

                if (!nsURI) {
                    if (localName !== "scheme" && localName !== "term") {
                        typeExtensions.push(createAttributeExtension(attribute, true));
                    }
                    return;
                }

                if (isExtensionNs(nsURI)) {
                    typeExtensions.push(createAttributeExtension(attribute, true));
                }
            });

            entryMetadata.type = xmlAttributeValue(domElement, "term");
            entryMetadata.type_extensions = typeExtensions;
        }
    };

    var atomReadEntryContent = function (domElement, entry, entryMetadata, baseURI) {
        /// <summary>Reads an ATOM content DOM element.</summary>
        /// <param name="domElement">ATOM content DOM element.</param>
        /// <param name="entry">Entry object to update with information.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the content information.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the Atom entry content.</param>

        var src = xmlAttributeValue(domElement, "src");
        var type = xmlAttributeValue(domElement, "type");

        if (src) {
            if (!type) {
                throw {
                    message: "Invalid AtomPub document: content element must specify the type attribute if the src attribute is also specified",
                    element: domElement
                };
            }

            entryMetadata.media_src = normalizeURI(src, xmlBaseURI(domElement, baseURI));
            entryMetadata.content_type = type;
        }

        xmlChildElements(domElement, function (child) {
            if (src) {
                throw { message: "Invalid AtomPub document: content element must not have child elements if the src attribute is specified", element: domElement };
            }

            if (xmlNamespaceURI(child) === odataMetaXmlNs && xmlLocalName(child) === "properties") {
                atomReadEntryStructuralObject(child, entry, entryMetadata);
            }
        });
    };

    var atomReadEntryLink = function (domElement, entry, entryMetadata, baseURI, model) {
        /// <summary>Reads a link element on an entry.</summary>
        /// <param name="atomEntryLink">'link' element on the entry.</param>
        /// <param name="entry" type="Object">Entry object to update with the link data.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the link metadata.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing the link href.</param>
        /// <param name="model" type="Object">Metadata that describes the conceptual schema.</param>

        var link = atomReadLink(domElement, baseURI);

        var rel = link.rel;
        var href = link.href;
        var extensions = link.extensions;

        if (rel === "self") {
            entryMetadata.self = href;
            entryMetadata.self_link_extensions = extensions;
            return;
        }

        if (rel === "edit") {
            entryMetadata.edit = href;
            entryMetadata.edit_link_extensions = extensions;
            return;
        }

        if (rel === "edit-media") {
            entryMetadata.edit_media = link.href;
            entryMetadata.edit_media_extensions = extensions;
            atomReadLinkMediaEtag(link, entryMetadata);
            return;
        }

        // This might be a named stream edit link
        if (rel.indexOf(odataEditMediaPrefix) === 0) {
            atomReadNamedStreamEditLink(link, entry, entryMetadata);
            return;
        }

        // This might be a named stram media resource (read) link
        if (rel.indexOf(odataMediaResourcePrefix) === 0) {
            atomReadNamedStreamSelfLink(link, entry, entryMetadata);
            return;
        }

        // This might be a navigation property
        if (rel.indexOf(odataRelatedPrefix) === 0) {
            atomReadNavPropLink(domElement, link, entry, entryMetadata, model);
            return;
        }

        if (rel.indexOf(odataRelatedLinksPrefix) === 0) {
            atomReadNavPropRelatedLink(link, entryMetadata);
            return;
        }
    };

    var atomReadNavPropRelatedLink = function (link, entryMetadata) {
        /// <summary>Reads a link represnting the links related to a navigation property in an OData Atom document.</summary>
        /// <param name="link" type="Object">Object representing the parsed link DOM element.</param>
        /// <param name="entryMetadata" type="Object">Entry metadata object to update with the related links information.</param>

        var propertyName = link.rel.substring(odataRelatedLinksPrefix.length);

        // Set the extra property information on the entry object metadata. 
        entryMetadata.properties = entryMetadata.properties || {};
        var propertyMetadata = entryMetadata.properties[propertyName] = entryMetadata.properties[propertyName] || {};

        propertyMetadata.associationuri = link.href;
        propertyMetadata.associationuri_extensions = link.extensions;
    };

    var atomReadNavPropLink = function (domElement, link, entry, entryMetadata, model) {
        /// <summary>Reads a link representing a navigation property in an OData Atom document.</summary>
        /// <param name="domElement">DOM element for a navigation property in an OData Atom document.</summary>
        /// <param name="link" type="Object">Object representing the parsed link DOM element.</param>
        /// <param name="entry" type="Object">Entry object to update with the navigation property.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the navigation property metadata.</param>
        /// <param name="model" type="Object">Metadata that describes the conceptual schema.</param>

        // Get any inline data.
        var inlineData;
        var inlineElement = xmlFirstChildElement(domElement, odataMetaXmlNs, "inline");
        if (inlineElement) {
            var inlineDocRoot = xmlFirstChildElement(inlineElement);
            var inlineBaseURI = xmlBaseURI(inlineElement, link.baseURI);
            inlineData = inlineDocRoot ? atomReadDocument(inlineDocRoot, inlineBaseURI, model) : null;
        } else {
            // If the link has no inline content, we consider it deferred.
            inlineData = { __deferred: { uri: link.href} };
        }

        var propertyName = link.rel.substring(odataRelatedPrefix.length);

        // Set the property value on the entry object.
        entry[propertyName] = inlineData;

        // Set the extra property information on the entry object metadata. 
        entryMetadata.properties = entryMetadata.properties || {};
        var propertyMetadata = entryMetadata.properties[propertyName] = entryMetadata.properties[propertyName] || {};

        propertyMetadata.extensions = link.extensions;
    };

    var atomReadNamedStreamEditLink = function (link, entry, entryMetadata) {
        /// <summary>Reads a link representing the edit-media url of a named stream in an OData Atom document.</summary>
        /// <param name="link" type="Object">Object representing the parsed link DOM element.</param>
        /// <param name="entry" type="Object">Entry object to update with the named stream data.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the named stream metadata.</param>

        var propertyName = link.rel.substring(odataEditMediaPrefix.length);

        var namedStreamMediaResource = atomGetEntryNamedStreamMediaResource(propertyName, entry, entryMetadata);
        var mediaResource = namedStreamMediaResource.value;
        var mediaResourceMetadata = namedStreamMediaResource.metadata;

        var editMedia = link.href;

        mediaResource.edit_media = editMedia;
        mediaResource.content_type = link.type;
        mediaResourceMetadata.edit_media_extensions = link.extensions;

        // If there is only the edit link, make it the media self link as well.
        mediaResource.media_src = mediaResource.media_src || editMedia;
        mediaResourceMetadata.media_src_extensions = mediaResourceMetadata.media_src_extensions || [];

        atomReadLinkMediaEtag(link, mediaResource);
    };

    var atomReadNamedStreamSelfLink = function (link, entry, entryMetadata) {
        /// <summary>Reads a link representing the self url of a named stream in an OData Atom document.</summary>
        /// <param name="link" type="Object">Object representing the parsed link DOM element.</param>
        /// <param name="entry" type="Object">Entry object to update with the named stream data.</param>
        /// <param name="entryMetadata">Entry metadata object to update with the named stream metadata.</param>

        var propertyName = link.rel.substring(odataMediaResourcePrefix.length);

        var namedStreamMediaResource = atomGetEntryNamedStreamMediaResource(propertyName, entry, entryMetadata);
        var mediaResource = namedStreamMediaResource.value;
        var mediaResourceMetadata = namedStreamMediaResource.metadata;

        mediaResource.media_src = link.href;
        mediaResourceMetadata.media_src_extensions = link.extensions;
        mediaResource.content_type = link.type;
    };

    var atomGetEntryNamedStreamMediaResource = function (name, entry, entryMetadata) {
        /// <summary>Gets the media resource object and metadata object for a named stream in an entry object.</summary>
        /// <param name="link" type="Object">Object representing the parsed link DOM element.</param>
        /// <param name="entry" type="Object">Entry object from which the media resource object will be obtained.</param>
        /// <param name="entryMetadata" type="Object">Entry metadata object from which the media resource metadata object will be obtained.</param>
        /// <remarks>
        ///    If the entry doest' have a media resource for the named stream indicated by the name argument, then this function will create a new
        ///    one along with its metadata object.
        /// <remarks>
        /// <returns type="Object"> Object containing the value and metadata of the named stream's media resource. <returns>

        entryMetadata.properties = entryMetadata.properties || {};

        var mediaResourceMetadata = entryMetadata.properties[name];
        var mediaResource = entry[name] && entry[name].__mediaresource;

        if (!mediaResource) {
            mediaResource = {};
            entry[name] = { __mediaresource: mediaResource };
            entryMetadata.properties[name] = mediaResourceMetadata = {};
        }
        return { value: mediaResource, metadata: mediaResourceMetadata };
    };

    var atomReadLinkMediaEtag = function (link, mediaResource) {
        /// <summary>Gets the media etag from the link extensions and updates the media resource object with it.</summary>
        /// <param name="link" type="Object">Object representing the parsed link DOM element.</param>
        /// <param name="mediaResource" type="Object">Object containing media information for an OData Atom entry.</param>
        /// <remarks>
        ///    The function will remove the extension object for the etag if it finds it in the link extensions and will set
        ///    its value under the media_etag property of the mediaResource object. 
        /// <remarks>
        /// <returns type="Object"> Object containing the value and metadata of the named stream's media resource. <returns>

        var extensions = link.extensions;
        var i, len;
        for (i = 0, len = extensions.length; i < len; i++) {
            if (extensions[i].namespaceURI === odataMetaXmlNs && extensions[i].name === "etag") {
                mediaResource.media_etag = extensions[i].value;
                extensions.splice(i, 1);
                return;
            }
        }
    };

    var atomReadEntryStructuralObject = function (domElement, parent, parentMetadata) {
        /// <summary>Reads an atom entry's property as a structural object and sets its value in the parent and the metadata in the parentMetadata objects.</summary>
        /// <param name="propertiesElement">XML element for the 'properties' node.</param>
        /// <param name="parent">
        ///     Object that will contain the property value. It can be either an antom entry or 
        ///     an atom complex property object.
        /// </param>
        /// <param name="parentMetadata">Object that will contain the property metadata. It can be either an atom entry metadata or a complex property metadata object</param>

        xmlChildElements(domElement, function (child) {
            var property = xmlReadODataProperty(child);
            if (property) {
                var propertyName = property.name;
                var propertiesMetadata = parentMetadata.properties = parentMetadata.properties || {};
                propertiesMetadata[propertyName] = property.metadata;
                parent[propertyName] = property.value;
            }
        });
    };

    var atomReadServiceDocument = function (domElement, baseURI) {
        /// <summary>Reads an AtomPub service document</summary>
        /// <param name="atomServiceDoc">DOM element for the root of an AtomPub service document</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the AtomPub service document.</param>
        /// <returns type="Object">An object that contains the properties of the service document</returns>

        var workspaces = [];
        var extensions = [];

        baseURI = xmlBaseURI(domElement, baseURI);
        // Find all the workspace elements.
        xmlChildElements(domElement, function (child) {
            if (xmlNamespaceURI(child) === appXmlNs && xmlLocalName(child) === "workspace") {
                workspaces.push(atomReadServiceDocumentWorkspace(child, baseURI));
                return;
            }
            extensions.push(createElementExtension(child));
        });

        // AtomPub (RFC 5023 Section 8.3.1) says a service document MUST contain one or 
        // more workspaces. Throw if we don't find any. 
        if (workspaces.length === 0) {
            throw { message: "Invalid AtomPub service document: No workspace element found.", element: domElement };
        }

        return { workspaces: workspaces, extensions: extensions };
    };

    var atomReadServiceDocumentWorkspace = function (domElement, baseURI) {
        /// <summary>Reads a single workspace element from an AtomPub service document</summary>
        /// <param name="domElement">DOM element that represents a workspace of an AtomPub service document</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the AtomPub service document workspace.</param>
        /// <returns type="Object">An object that contains the properties of the workspace</returns>

        var collections = [];
        var extensions = [];
        var title = undefined;

        baseURI = xmlBaseURI(domElement, baseURI);

        xmlChildElements(domElement, function (child) {
            var nsURI = xmlNamespaceURI(child);
            var localName = xmlLocalName(child);

            if (nsURI === atomXmlNs) {
                if (localName === "title") {
                    if (title !== undefined) {
                        throw { message: "Invalid AtomPub service document: workspace has more than one child title element", element: child };
                    }

                    title = xmlInnerText(child);
                    return;
                }
            }

            if (nsURI === appXmlNs) {
                if (localName === "collection") {
                    collections.push(atomReadServiceDocumentCollection(child, baseURI));
                }
                return;
            }
            extensions.push(atomReadExtensionElement(child));
        });

        return { title: title || "", collections: collections, extensions: extensions };
    };

    var atomReadServiceDocumentCollection = function (domElement, baseURI) {
        /// <summary>Reads a service document collection element into an object.</summary>
        /// <param name="domElement">DOM element that represents a collection of an AtomPub service document.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the AtomPub service document collection.</param>
        /// <returns type="Object">An object that contains the properties of the collection.</returns>


        var href = xmlAttributeValue(domElement, "href");

        if (!href) {
            throw { message: "Invalid AtomPub service document: collection has no href attribute", element: domElement };
        }

        baseURI = xmlBaseURI(domElement, baseURI);
        href = normalizeURI(href, xmlBaseURI(domElement, baseURI));
        var extensions = [];
        var title = undefined;

        xmlChildElements(domElement, function (child) {
            var nsURI = xmlNamespaceURI(child);
            var localName = xmlLocalName(child);

            if (nsURI === atomXmlNs) {
                if (localName === "title") {
                    if (title !== undefined) {
                        throw { message: "Invalid AtomPub service document: collection has more than one child title element", element: child };
                    }
                    title = xmlInnerText(child);
                }
                return;
            }

            if (nsURI !== appXmlNs) {
                extensions.push(atomReadExtensionElement(domElement));
            }
        });

        // AtomPub (RFC 5023 Section 8.3.3) says the collection element MUST contain 
        // a title element. It's likely to be problematic if the service doc doesn't 
        // have one so here we throw. 
        if (!title) {
            throw { message: "Invalid AtomPub service document: collection has no title element", element: domElement };
        }

        return { title: title, href: href, extensions: extensions };
    };

    var atomNewElement = function (dom, name, children) {
        /// <summary>Creates a new DOM element in the Atom namespace.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Local name of the Atom element to create.</param>
        /// <param name="children" type="Array">Array containing DOM nodes or string values that will be added as children of the new DOM element.</param>
        /// <returns>New DOM element in the Atom namespace.</returns>
        /// <remarks>
        ///    If a value in the children collection is a string, then a new DOM text node is going to be created 
        ///    for it and then appended as a child of the new DOM Element.
        /// </remarks>

        return xmlNewElement(dom, atomXmlNs, xmlQualifiedName(atomPrefix, name), children);
    };

    var atomNewAttribute = function (dom, name, value) {
        /// <summary>Creates a new DOM attribute for an Atom element in the default namespace.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Local name of the OData attribute to create.</param>
        /// <param name="value">Attribute value.</param>
        /// <returns>New DOM attribute in the default namespace.</returns>

        return xmlNewAttribute(dom, null, name, value);
    };

    var atomCanRemoveProperty = function (propertyElement) {
        /// <summary>Checks whether the property represented by domElement can be removed from the atom document DOM tree.</summary>
        /// <param name="propertyElement">DOM element for the property to test.</param>
        /// <remarks>
        ///     The property can only be removed if it doens't have any children and only has namespace or type declaration attributes.
        /// </remarks>
        /// <returns type="Boolean">True is the property can be removed; false otherwise.</returns>

        if (propertyElement.childNodes.length > 0) {
            return false;
        }

        var isEmpty = true;
        var attributes = propertyElement.attributes;
        var i, len;
        for (i = 0, len = attributes.length; i < len && isEmpty; i++) {
            var attribute = attributes[i];

            isEmpty = isEmpty && isXmlNSDeclaration(attribute) ||
                 (xmlNamespaceURI(attribute) == odataMetaXmlNs && xmlLocalName(attribute) === "type");
        }
        return isEmpty;
    };

    var atomNewODataNavigationProperty = function (dom, name, kind, value, model) {
        /// <summary>Creates a new Atom link DOM element for a navigation property in an OData Atom document.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="kind" type="String">Navigation property kind. Expected values are "deferred", "entry", or "feed".</param>
        /// <param name="value" optional="true" mayBeNull="true">Value of the navigation property, if any.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new Atom link DOM element for the navigation property and the 
        ///     required data service version for this property.
        /// </returns>

        var linkType = null;
        var linkContent = null;
        var linkContentBodyData = null;
        var href = "";

        if (kind !== "deferred") {
            linkType = atomNewAttribute(dom, "type", "application/atom+xml;type=" + kind);
            linkContent = xmlNewODataMetaElement(dom, "inline");

            if (value) {
                href = value.__metadata && value.__metadata.uri || "";
                linkContentBodyData =
                    atomNewODataFeed(dom, value, model) ||
                    atomNewODataEntry(dom, value, model);
                xmlAppendChild(linkContent, linkContentBodyData.element);
            }
        } else {
            href = value.__deferred.uri;
        };

        var navProp = atomNewElement(dom, "link", [
            atomNewAttribute(dom, "href", href),
            atomNewAttribute(dom, "rel", normalizeURI(name, odataRelatedPrefix)),
            linkType,
            linkContent
        ]);

        return xmlNewODataElementInfo(navProp, linkContentBodyData ? linkContentBodyData.dsv : "1.0");
    };

    var atomNewODataEntryDataItem = function (dom, name, value, dataItemMetadata, dataItemModel, model) {
        /// <summary>Creates a new DOM element for a data item in an entry, complex property, or collection property.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="name" type="String">Data item name.</param>
        /// <param name="value" optional="true" mayBeNull="true">Value of the data item, if any.</param>
        /// <param name="dataItemMetadata" type="Object" optional="true">Object containing metadata about the data item.</param>
        /// <param name="dataItemModel" type="Object" optional="true">Object describing the data item in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element in the appropriate namespace for the data item and the 
        ///     required data service version for it.
        /// </returns>

        if (isNamedStream(value)) {
            return null;
        }

        var dataElement = xmlNewODataDataElement(dom, name, value, dataItemMetadata, dataItemModel, model);
        if (!dataElement) {
            // This may be a navigation property. 
            var navPropKind = navigationPropertyKind(value, dataItemModel);

            dataElement = atomNewODataNavigationProperty(dom, name, navPropKind, value, model);
        }
        return dataElement;
    };

    var atomEntryCustomization = function (dom, entry, entryProperties, customization) {
        /// <summary>Applies a feed customization by transforming an Atom entry DOM element as needed.</summary>
        /// <param name="dom">DOM document used for creating any new DOM nodes required by the customization.</param>
        /// <param name="entry">DOM element for the Atom entry to which the customization is going to be applied.</param>
        /// <param name="entryProperties">DOM element containing the properties of the Atom entry.</param>
        /// <param name="customization" type="Object">Object describing an applicable feed customization.</param>
        /// <remarks>
        ///     Look into the atomfeedCustomization function for a description of the customization object.
        /// </remarks>
        /// <returns type="String">Data service version required by the applied customization</returns>

        var atomProperty = xmlFindElementByPath(entryProperties, odataXmlNs, customization.propertyPath);
        var atomPropertyNullAttribute = atomProperty && xmlAttributeNode(atomProperty, "null", odataMetaXmlNs);
        var atomPropertyValue;
        var dataServiceVersion = "1.0";

        if (atomPropertyNullAttribute && atomPropertyNullAttribute.value === "true") {
            return dataServiceVersion;
        }

        if (atomProperty) {
            atomPropertyValue = xmlInnerText(atomProperty) || "";
            if (!customization.keepInContent) {
                dataServiceVersion = "2.0";
                var parent = atomProperty.parentNode;
                var candidate = parent;

                parent.removeChild(atomProperty);
                while (candidate !== entryProperties && atomCanRemoveProperty(candidate)) {
                    parent = candidate.parentNode;
                    parent.removeChild(candidate);
                    candidate = parent;
                }
            }
        }

        var targetNode = xmlNewNodeByPath(dom, entry,
            customization.nsURI, customization.nsPrefix, customization.entryPath);

        if (targetNode.nodeType === 2) {
            targetNode.value = atomPropertyValue;
            return dataServiceVersion;
        }

        var contentKind = customization.contentKind;
        xmlAppendChildren(targetNode, [
                contentKind && xmlNewAttribute(dom, null, "type", contentKind),
                contentKind === "xhtml" ? xmlNewFragment(dom, atomPropertyValue) : atomPropertyValue
        ]);

        return dataServiceVersion;
    };

    var atomNewODataEntry = function (dom, data, model) {
        /// <summary>Creates a new DOM element for an Atom entry.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="data" type="Object">Entry object in the library's internal representation.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element for the Atom entry and the required data service version for it.
        /// </returns>

        var payloadMetadata = data.__metadata || {};
        var propertiesMetadata = payloadMetadata.properties || {};

        var etag = payloadMetadata.etag;
        var uri = payloadMetadata.uri;
        var typeName = payloadMetadata.type;
        var entityType = lookupEntityType(typeName, model);

        var properties = xmlNewODataMetaElement(dom, "properties");
        var entry = atomNewElement(dom, "entry", [
            atomNewElement(dom, "author",
                atomNewElement(dom, "name")
            ),
            etag && xmlNewODataMetaAttribute(dom, "etag", etag),
            uri && atomNewElement(dom, "id", uri),
            typeName && atomNewElement(dom, "category", [
                atomNewAttribute(dom, "term", typeName),
                atomNewAttribute(dom, "scheme", odataScheme)
            ]),
        // TODO: MLE support goes here.
            atomNewElement(dom, "content", [
                atomNewAttribute(dom, "type", "application/xml"),
                properties
            ])
        ]);

        var dataServiceVersion = "1.0";
        for (var name in data) {
            if (name !== "__metadata") {
                var entryDataItemMetadata = propertiesMetadata[name] || {};
                var entryDataItemModel = entityType && (
                    lookupProperty(entityType.property, name)
                     || lookupProperty(entityType.navigationProperty, name));

                var entryDataItem = atomNewODataEntryDataItem(dom, name, data[name], entryDataItemMetadata, entryDataItemModel, model);
                if (entryDataItem) {
                    var entryElement = entryDataItem.element;
                    var entryElementParent = (xmlNamespaceURI(entryElement) === atomXmlNs) ? entry : properties;

                    xmlAppendChild(entryElementParent, entryElement);
                    dataServiceVersion = maxVersion(dataServiceVersion, entryDataItem.dsv);
                }
            }
        };

        atomApplyAllFeedCustomizations(entityType, model, function (customization) {
            var customizationDsv = atomEntryCustomization(dom, entry, properties, customization);
            dataServiceVersion = maxVersion(dataServiceVersion, customizationDsv);
        });

        return xmlNewODataElementInfo(entry, dataServiceVersion);
    };

    var atomNewODataFeed = function (dom, data, model) {
        /// <summary>Creates a new DOM element for an Atom feed.</summary>
        /// <param name="dom">DOM document used for creating the new DOM Element.</param>
        /// <param name="data" type="Object">Feed object in the library's internal representation.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM element for the Atom feed and the required data service version for it.
        /// </returns>

        var entries = isArray(data) ? data : data.results;

        if (!entries) {
            return null;
        }

        var dataServiceVersion = "1.0";
        var atomFeed = atomNewElement(dom, "feed");

        var i, len;
        for (i = 0, len = entries.length; i < len; i++) {
            var atomEntryData = atomNewODataEntry(dom, entries[i], model);
            xmlAppendChild(atomFeed, atomEntryData.element);
            dataServiceVersion = maxVersion(dataServiceVersion, atomEntryData.dsv);
        }
        return xmlNewODataElementInfo(atomFeed, dataServiceVersion);
    };

    var atomNewODataDocument = function (data, model) {
        /// <summary>Creates a new OData Atom document.</summary>
        /// <param name="data" type="Object">Feed or entry object in the libary's internal representaion.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns type="Object">
        ///     Object containing the new DOM document for the Atom document and the required data service version for it.
        /// </returns>

        if (data) {
            var atomRootWriter = isFeed(data) && atomNewODataFeed ||
                isObject(data) && atomNewODataEntry;

            if (atomRootWriter) {
                var dom = xmlDom();
                var atomRootData = atomRootWriter(dom, data, model);

                if (atomRootData) {
                    var atomRootElement = atomRootData.element;
                    xmlAppendChildren(atomRootElement, [
                        xmlNewNSDeclaration(dom, odataMetaXmlNs, odataMetaPrefix),
                        xmlNewNSDeclaration(dom, odataXmlNs, odataPrefix)
                    ]);
                    return xmlNewODataElementInfo(xmlAppendChild(dom, atomRootElement), atomRootData.dsv);
                }
            }
        }
        return null;
    };

    var atomParser = function (handler, text, context) {
        /// <summary>Parses an ATOM document (feed, entry or service document).</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="text" type="String">Document text.</param>
        /// <param name="context" type="Object">Object with parsing context.</param>
        /// <returns>An object representation of the document; undefined if not applicable.</returns>

        if (text) {
            var atomDoc = xmlParse(text);
            var atomRoot = xmlFirstChildElement(atomDoc);
            if (atomRoot) {
                return atomReadDocument(atomRoot, null, context.metadata);
            }
        }
    };

    var atomSerializer = function (handler, data, context) {
        /// <summary>Serializes an ATOM object into a document (feed or entry).</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="data" type="Object">Representation of feed or entry.</param>
        /// <param name="context" type="Object">Object with parsing context.</param>
        /// <returns>An text representation of the data object; undefined if not applicable.</returns>

        var cType = context.contentType = context.contentType || contentType(atomMediaType);
        if (cType && cType.mediaType === atomMediaType) {
            var atomDoc = atomNewODataDocument(data, context.metadata);
            if (atomDoc) {
                context.dataServiceVersion = maxVersion(context.dataServiceVersion || "1.0", atomDoc.dsv);
                return xmlSerialize(atomDoc.element);
            }
        }
        // Allow undefined to be returned.
    };

    odata.atomHandler = handler(atomParser, atomSerializer, atomAcceptTypes.join(","), MAX_DATA_SERVICE_VERSION);



    var schemaElement = function (attributes, elements, text, ns) {
        /// <summary>Creates an object that describes an element in an schema.</summary>
        /// <param name="attributes" type="Array">List containing the names of the attributes allowed for this element.</param>
        /// <param name="elements" type="Array">List containing the names of the child elements allowed for this element.</param>
        /// <param name="text" type="Boolean">Flag indicating if the element's text value is of interest or not.</param>
        /// <param name="ns" type="String">Namespace to which the element belongs to.</param>
        /// <remarks>
        ///    If a child element name ends with * then it is understood by the schema that that child element can appear 0 or more times.
        /// </remarks>
        /// <returns type="Object">Object with attributes, elements, text, and ns fields.</returns>

        return {
            attributes: attributes,
            elements: elements,
            text: text || false,
            ns: ns
        };
    };

    // It's assumed that all elements may have Documentation children and Annotation elements.
    // See http://msdn.microsoft.com/en-us/library/bb399292.aspx for a CSDL reference.
    var schema = {
        elements: {
            Annotations: schemaElement(
            /*attributes*/["Target", "Qualifier"],
            /*elements*/["Annotation*","TypeAnnotation*", "ValueAnnotation*"] // ##### MODIFIED BY SAP
            ),
            // ##### BEGIN: MODIFIED BY SAP
            Annotation: schemaElement(
            /*attributes*/["Term"],
            /*elements*/["Record", "Collection"]
            ),
            // ##### END: MODIFIED BY SAP
            Association: schemaElement(
            /*attributes*/["Name"],
            /*elements*/["End*", "ReferentialConstraint", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            AssociationSet: schemaElement(
            /*attributes*/["Name", "Association"],
            /*elements*/["End*", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            Binary: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Bool: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Collection: schemaElement(
            /*attributes*/null,
            /*elements*/["String*", "Int*", "Float*", "Decimal*", "Bool*", "DateTime*", "DateTimeOffset*", "Guid*", "Binary*", "Time*", "Collection*", "Record*"]
            ),
            CollectionType: schemaElement(
            /*attributes*/["ElementType", "Nullable", "DefaultValue", "MaxLength", "FixedLength", "Precision", "Scale", "Unicode", "Collation", "SRID"]
            /*elements*/["CollectionType", "ReferenceType", "RowType", "TypeRef"]
            ),
            ComplexType: schemaElement(
            /*attributes*/["Name", "BaseType", "Abstract"],
            /*elements*/["Property*", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            DateTime: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            DateTimeOffset: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Decimal: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            DefiningExpression: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Dependent: schemaElement(
            /*attributes*/["Role"],
            /*elements*/["PropertyRef*"]
            ),
            Documentation: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            End: schemaElement(
            /*attributes*/["Type", "Role", "Multiplicity", "EntitySet"],
            /*elements*/["OnDelete"]
            ),
            EntityContainer: schemaElement(
            /*attributes*/["Name", "Extends"],
            /*elements*/["EntitySet*", "AssociationSet*", "FunctionImport*", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            EntitySet: schemaElement(
            /*attributes*/["Name", "EntityType"],
            /*elements*/["TypeAnnotation*", "ValueAnnotation*"]
            ),
            EntityType: schemaElement(
            /*attributes*/["Name", "BaseType", "Abstract", "OpenType"],
            /*elements*/["Key", "Property*", "NavigationProperty*", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            EnumType: schemaElement(
            /*attributes*/["Name", "UnderlyingType", "IsFlags"],
            /*elements*/["Member*"]
            ),
            Float: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Function: schemaElement(
            /*attributes*/["Name", "ReturnType"],
            /*elements*/["Parameter*", "DefiningExpression", "ReturnType", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            FunctionImport: schemaElement(
            /*attributes*/["Name", "ReturnType", "EntitySet", "IsSideEffecting", "IsComposable", "IsBindable", "EntitySetPath"],
            /*elements*/["Parameter*", "ReturnType", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            Guid: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Int: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Key: schemaElement(
            /*attributes*/null,
            /*elements*/["PropertyRef*"]
            ),
            LabeledElement: schemaElement(
            /*attributes*/["Name"],
            /*elements*/["Path", "String", "Int", "Float", "Decimal", "Bool", "DateTime", "DateTimeOffset", "Guid", "Binary", "Time", "Collection", "Record", "LabeledElement", "Null"]
            ),
            Member: schemaElement(
            /*attributes*/["Name", "Value"]
            ),
            NavigationProperty: schemaElement(
            /*attributes*/["Name", "Relationship", "ToRole", "FromRole", "ContainsTarget"],
            /*elements*/["TypeAnnotation*", "ValueAnnotation*"]
            ),
            Null: schemaElement(
            /*attributes*/null,
            /*elements*/null
            ),
            OnDelete: schemaElement(
            /*attributes*/["Action"]
            ),
            Path: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Parameter: schemaElement(
            /*attributes*/["Name", "Type", "Mode", "Nullable", "DefaultValue", "MaxLength", "FixedLength", "Precision", "Scale", "Unicode", "Collation", "ConcurrencyMode", "SRID"],
            /*elements*/["CollectionType", "ReferenceType", "RowType", "TypeRef", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            Principal: schemaElement(
            /*attributes*/["Role"],
            /*elements*/["PropertyRef*"]
            ),
            Property: schemaElement(
            /*attributes*/["Name", "Type", "Nullable", "DefaultValue", "MaxLength", "FixedLength", "Precision", "Scale", "Unicode", "Collation", "ConcurrencyMode", "CollectionKind", "SRID"],
            /*elements*/["CollectionType", "ReferenceType", "RowType", "TypeAnnotation*", "ValueAnnotation*"]
            ),
            PropertyRef: schemaElement(
            /*attributes*/["Name"]
            ),
            PropertyValue: schemaElement(
            /*attributes*/["PropertyPath", "Property", "Path", "String", "Int", "Float", "Decimal", "Bool", "DateTime", "DateTimeOffset", "Guid", "Binary", "Time"], // ##### MODIFIED BY SAP
            /*Elements*/["Path", "String", "Int", "Float", "Decimal", "Bool", "DateTime", "DateTimeOffset", "Guid", "Binary", "Time", "Collection", "Record", "LabeledElement", "Null"] 
            ),
            // ##### BEGIN: MODIFIED BY SAP
            Record: schemaElement(
            /*attributes*/["Type"],
            /*Elements*/["PropertyValue*"] 
            ),
            // ##### END: MODIFIED BY SAP
            ReferenceType: schemaElement(
            /*attributes*/["Type"]
            ),
            ReferentialConstraint: schemaElement(
            /*attributes*/null,
            /*elements*/["Principal", "Dependent"]
            ),
            ReturnType: schemaElement(
            /*attributes*/["ReturnType", "Type", "EntitySet"],
            /*elements*/["CollectionType", "ReferenceType", "RowType"]
            ),
            RowType: schemaElement(
            /*elements*/["Property*"]
            ),
            String: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            Schema: schemaElement(
            /*attributes*/["Namespace", "Alias"],
            /*elements*/["Using*", "EntityContainer*", "EntityType*", "Association*", "ComplexType*", "Function*", "ValueTerm*", "Annotations*"]
            ),
            Time: schemaElement(
            /*attributes*/null,
            /*elements*/null,
            /*text*/true
            ),
            TypeAnnotation: schemaElement(
            /*attributes*/["Term", "Qualifier"],
            /*elements*/["PropertyValue*"]
            ),
            TypeRef: schemaElement(
            /*attributes*/["Type", "Nullable", "DefaultValue", "MaxLength", "FixedLength", "Precision", "Scale", "Unicode", "Collation", "SRID"]
            ),
            Using: schemaElement(
            /*attributes*/["Namespace", "Alias"]
            ),
            ValueAnnotation: schemaElement(
            /*attributes*/["Term", "Qualifier", "Path", "String", "Int", "Float", "Decimal", "Bool", "DateTime", "DateTimeOffset", "Guid", "Binary", "Time"],
            /*Elements*/["Path", "String", "Int", "Float", "Decimal", "Bool", "DateTime", "DateTimeOffset", "Guid", "Binary", "Time", "Collection", "Record", "LabeledElement", "Null"]
            ),
            ValueTerm: schemaElement(
            /*attributes*/["Name", "Type"],
            /*elements*/["TypeAnnotation*", "ValueAnnotation*"]
            ),

            // See http://msdn.microsoft.com/en-us/library/dd541238(v=prot.10) for an EDMX reference.
            Edmx: schemaElement(
            /*attributes*/["Version"],
            /*elements*/["DataServices", "Reference*", "AnnotationsReference*"],
            /*text*/false,
            /*ns*/edmxNs
            ),
            DataServices: schemaElement(
            /*attributes*/null,
            /*elements*/["Schema*"],
            /*text*/false,
            /*ns*/edmxNs
            )
        }
    };

    // See http://msdn.microsoft.com/en-us/library/ee373839.aspx for a feed customization reference.
    var customizationAttributes = ["m:FC_ContentKind", "m:FC_KeepInContent", "m:FC_NsPrefix", "m:FC_NsUri", "m:FC_SourcePath", "m:FC_TargetPath"];
    schema.elements.Property.attributes = schema.elements.Property.attributes.concat(customizationAttributes);
    schema.elements.EntityType.attributes = schema.elements.EntityType.attributes.concat(customizationAttributes);

    // See http://msdn.microsoft.com/en-us/library/dd541284(PROT.10).aspx for an EDMX reference.
    schema.elements.Edmx = { attributes: ["Version"], elements: ["DataServices"], ns: edmxNs };
    schema.elements.DataServices = { elements: ["Schema*"], ns: edmxNs };

    // See http://msdn.microsoft.com/en-us/library/dd541233(v=PROT.10) for Conceptual Schema Definition Language Document for Data Services.
    schema.elements.EntityContainer.attributes.push("m:IsDefaultEntityContainer");
    schema.elements.Property.attributes.push("m:MimeType");
    schema.elements.FunctionImport.attributes.push("m:HttpMethod");
    schema.elements.FunctionImport.attributes.push("m:IsAlwaysBindable");
    schema.elements.EntityType.attributes.push("m:HasStream");
    schema.elements.DataServices.attributes = ["m:DataServiceVersion", "m:MaxDataServiceVersion"];

    var scriptCase = function (text) {
        /// <summary>Converts a Pascal-case identifier into a camel-case identifier.</summary>
        /// <param name="text" type="String">Text to convert.</param>
        /// <returns type="String">Converted text.</returns>
        /// <remarks>If the text starts with multiple uppercase characters, it is left as-is.</remarks>

        if (!text) {
            return text;
        }

        if (text.length > 1) {
            var firstTwo = text.substr(0, 2);
            if (firstTwo === firstTwo.toUpperCase()) {
                return text;
            }

            return text.charAt(0).toLowerCase() + text.substr(1);
        }

        return text.charAt(0).toLowerCase();
    };

    var getChildSchema = function (parentSchema, candidateName) {
        /// <summary>Gets the schema node for the specified element.</summary>
        /// <param name="parentSchema" type="Object">Schema of the parent XML node of 'element'.</param>
        /// <param name="candidateName">XML element name to consider.</param>
        /// <returns type="Object">The schema that describes the specified element; null if not found.</returns>

        if (candidateName === "Documentation") {
            return { isArray: true, propertyName: "documentation" };
        }

        var elements = parentSchema.elements;
        if (!elements) {
            return null;
        }

        var i, len;
        for (i = 0, len = elements.length; i < len; i++) {
            var elementName = elements[i];
            var multipleElements = false;
            if (elementName.charAt(elementName.length - 1) === "*") {
                multipleElements = true;
                elementName = elementName.substr(0, elementName.length - 1);
            }

            if (candidateName === elementName) {
                var propertyName = scriptCase(elementName);
                return { isArray: multipleElements, propertyName: propertyName };
            }
        }

        return null;
    };

    // This regular expression is used to detect a feed customization element
    // after we've normalized it into the 'm' prefix. It starts with m:FC_,
    // followed by other characters, and ends with _ and a number.
    // The captures are 0 - whole string, 1 - name as it appears in internal table.
    var isFeedCustomizationNameRE = /^(m:FC_.*)_[0-9]+$/;

    var isEdmNamespace = function (nsURI) {
        /// <summary>Checks whether the specifies namespace URI is one of the known CSDL namespace URIs.</summary>
        /// <param name="nsURI" type="String">Namespace URI to check.</param>
        /// <returns type="Boolean">true if nsURI is a known CSDL namespace; false otherwise.</returns>

        return nsURI === edmNs1
            || nsURI === edmNs1_1
            || nsURI === edmNs1_2
            || nsURI === edmNs2a
            || nsURI === edmNs2b
            || nsURI === edmNs3
            // ##### BEGIN: MODIFIED BY SAP
            || nsURI === edmNs4
            // ##### END: MODIFIED BY SAP
    };

    var parseConceptualModelElement = function (element) {
        /// <summary>Parses a CSDL document.</summary>
        /// <param name="element">DOM element to parse.</param>
        /// <returns type="Object">An object describing the parsed element.</returns>

        var localName = xmlLocalName(element);
        var nsURI = xmlNamespaceURI(element);
        var elementSchema = schema.elements[localName];
        if (!elementSchema) {
            return null;
        }

        if (elementSchema.ns) {
            if (nsURI !== elementSchema.ns) {
                return null;
            }
        } else if (!isEdmNamespace(nsURI)) {
            return null;
        }

        var item = {};
        var extensions = [];
        var attributes = elementSchema.attributes || [];
        xmlAttributes(element, function (attribute) {

            var localName = xmlLocalName(attribute);
            var nsURI = xmlNamespaceURI(attribute);
            var value = attribute.value;

            // Don't do anything with xmlns attributes.
            if (nsURI === xmlnsNS) {
                return;
            }

            // Currently, only m: for metadata is supported as a prefix in the internal schema table,
            // un-prefixed element names imply one a CSDL element.
            var schemaName = null;
            var handled = false;
            if (isEdmNamespace(nsURI) || nsURI === null) {
                schemaName = "";
            } else if (nsURI === odataMetaXmlNs) {
                schemaName = "m:";
            }

            if (schemaName !== null) {
                schemaName += localName;

                // Feed customizations for complex types have additional
                // attributes with a suffixed counter starting at '1', so
                // take that into account when doing the lookup.
                var match = isFeedCustomizationNameRE.exec(schemaName);
                if (match) {
                    schemaName = match[1];
                }

                if (contains(attributes, schemaName)) {
                    handled = true;
                    item[scriptCase(localName)] = value;
                }
            }

            if (!handled) {
                extensions.push(createAttributeExtension(attribute));
            }
        });

        xmlChildElements(element, function (child) {
            var localName = xmlLocalName(child);
            var childSchema = getChildSchema(elementSchema, localName);
            if (childSchema) {
                if (childSchema.isArray) {
                    var arr = item[childSchema.propertyName];
                    if (!arr) {
                        arr = [];
                        item[childSchema.propertyName] = arr;
                    }
                    arr.push(parseConceptualModelElement(child));
                } else {
                    item[childSchema.propertyName] = parseConceptualModelElement(child);
                }
            } else {
                extensions.push(createElementExtension(child));
            }
        });

        if (elementSchema.text) {
            item.text = xmlInnerText(element);
        }

        if (extensions.length) {
            item.extensions = extensions;
        }

        return item;
    };

    var metadataParser = function (handler, text) {
        /// <summary>Parses a metadata document.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="text" type="String">Metadata text.</param>
        /// <returns>An object representation of the conceptual model.</returns>

        var doc = xmlParse(text);
        var root = xmlFirstChildElement(doc);
        return parseConceptualModelElement(root) || undefined;
    };

    odata.metadataHandler = handler(metadataParser, null, xmlMediaType, MAX_DATA_SERVICE_VERSION);



    var PAYLOADTYPE_OBJECT = "o";
    var PAYLOADTYPE_FEED = "f";
    var PAYLOADTYPE_PRIMITIVE = "p";
    var PAYLOADTYPE_COLLECTION = "c";
    var PAYLOADTYPE_SVCDOC = "s";
    var PAYLOADTYPE_LINKS = "l";

    var odataNs = "odata";
    var odataAnnotationPrefix = odataNs + ".";

    var bindAnnotation = "@" + odataAnnotationPrefix + "bind";
    var metadataAnnotation = odataAnnotationPrefix + "metadata";
    var navUrlAnnotation = odataAnnotationPrefix + "navigationLinkUrl";
    var typeAnnotation = odataAnnotationPrefix + "type";

    var jsonLightNameMap = {
        readLink: "self",
        editLink: "edit",
        nextLink: "__next",
        mediaReadLink: "media_src",
        mediaEditLink: "edit_media",
        mediaContentType: "content_type",
        mediaETag: "media_etag",
        count: "__count",
        media_src: "mediaReadLink",
        edit_media: "mediaEditLink",
        content_type: "mediaContentType",
        media_etag: "mediaETag",
        url: "uri"
    };

    var jsonLightAnnotationInfo = function (annotation) {
        /// <summary>Gets the name and target of an annotation in a JSON light payload.</summary>
        /// <param name="annotation" type="String">JSON light payload annotation.</param>
        /// <returns type="Object">Object containing the annotation name and the target property name.</param>

        if (annotation.indexOf(".") > 0) {
            var targetEnd = annotation.indexOf("@");
            var target = targetEnd > -1 ? annotation.substring(0, targetEnd) : null;
            var name = annotation.substring(targetEnd + 1);

            return {
                target: target,
                name: name,
                isOData: name.indexOf(odataAnnotationPrefix) === 0
            };
        }
        return null;
    };

    var jsonLightDataItemType = function (name, value, container, dataItemModel, model) {
        /// <summary>Gets the type name of a JSON light data item that belongs to a feed, an entry, a complex type property, or a collection property.</summary>
        /// <param name="name" type="String">Name of the data item for which the type name is going to be retrieved.</param>
        /// <param name="value">Value of the data item.</param>
        /// <param name="container" type="Object">JSON light object that owns the data item.</param>
        /// <param name="dataItemModel" type="Object" optional="true">Object describing the data item in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <remarks>
        ///    This function will first try to get the type name from the data item's value itself if it is a JSON light object; otherwise 
        ///    it will try to get it from the odata.type annotation applied to the data item in the container. Then, it will fallback to the data item model. 
        ///    If all attempts fail, it will return null.
        /// </remarks>
        /// <returns type="String">Data item type name; null if the type name cannot be found.</returns>

        return (isComplex(value) && value[typeAnnotation]) ||
            (container && container[name + "@" + typeAnnotation]) ||
            (dataItemModel && dataItemModel.type) ||
            (lookupNavigationPropertyType(dataItemModel, model)) ||
            null;
    };

    var jsonLightDataItemModel = function (name, containerModel) {
        /// <summary>Gets an object describing a data item in an OData conceptual schema.</summary>
        /// <param name="name" type="String">Name of the data item for which the model is going to be retrieved.</param>
        /// <param name="containerModel" type="Object">Object describing the owner of the data item in an OData conceptual schema.</param>
        /// <returns type="Object">Object describing the data item; null if it cannot be found.</returns>

        if (containerModel) {
            return lookupProperty(containerModel.property, name) ||
                lookupProperty(containerModel.navigationProperty, name);
        }
        return null;
    };

    var jsonLightIsEntry = function (data) {
        /// <summary>Determines whether data represents a JSON light entry object.</summary>
        /// <param name="data" type="Object">JSON light object to test.</param>
        /// <returns type="Boolean">True if the data is JSON light entry object; false otherwise.</returns>

        return isComplex(data) && data.hasOwnProperty(odataAnnotationPrefix + "id");
    };

    var jsonLightIsNavigationProperty = function (name, data, dataItemModel) {
        /// <summary>Determines whether a data item in a JSON light object is a navigation property.</summary>
        /// <param name="name" type="String">Name of the data item to test.</param>
        /// <param name="data" type="Object">JSON light object that owns the data item.</param>
        /// <param name="dataItemModel" type="Object">Object describing the data item in an OData conceptual schema.</param>
        /// <returns type="Boolean">True if the data item is a navigation property; false otherwise.</returns>

        if (!!data[name + "@" + navUrlAnnotation] || (dataItemModel && dataItemModel.relationship)) {
            return true;
        }

        // Sniff the property value.
        var value = isArray(data[name]) ? data[name][0] : data[name];
        return jsonLightIsEntry(value);
    };

    var jsonLightIsPrimitiveType = function (typeName) {
        /// <summary>Determines whether a type name is a primitive type in a JSON light payload.</summary>
        /// <param name="typeName" type="String">Type name to test.</param>
        /// <returns type="Boolean">True if the type name an EDM primitive type or an OData spatial type; false otherwise.</returns>

        return isPrimitiveEdmType(typeName) || isGeographyEdmType(typeName) || isGeometryEdmType(typeName);
    };

    var jsonLightReadDataAnnotations = function (data, obj, baseURI, dataModel, model) {
        /// <summary>Converts annotations found in a JSON light payload object to either properties or metadata.</summary>
        /// <param name="data" type="Object">JSON light payload object containing the annotations to convert.</param>
        /// <param name="obj" type="Object">Object that will store the converted annotations.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="dataModel" type="Object">Object describing the JSON light payload in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <returns>JSON light payload object with its annotations converted to either properties or metadata.</param>

        for (var name in data) {
            if (name.indexOf(".") > 0 && name.charAt(0) !== "#") {
                var annotationInfo = jsonLightAnnotationInfo(name);
                if (annotationInfo) {
                    var annotationName = annotationInfo.name;
                    var target = annotationInfo.target;
                    var targetModel = null;
                    var targetType = null;

                    if (target) {
                        targetModel = jsonLightDataItemModel(target, dataModel);
                        targetType = jsonLightDataItemType(target, data[target], data, targetModel, model);
                    }

                    if (annotationInfo.isOData) {
                        jsonLightApplyPayloadODataAnnotation(annotationName, target, targetType, data[name], data, obj, baseURI);
                    } else {
                        obj[name] = data[name];
                    }
                }
            }
        }
        return obj;
    };
    5
    var jsonLightApplyPayloadODataAnnotation = function (name, target, targetType, value, data, obj, baseURI) {
        /// <summary>
        ///   Processes a JSON Light payload OData annotation producing either a property, payload metadata, or property metadata on its owner object. 
        /// </summary>
        /// <param name="name" type="String">Annotation name.</param>
        /// <param name="target" type="String">Name of the property that is being targeted by the annotation.</param>
        /// <param name="targetType" type="String">Type name of the target property.</param>
        /// <param name="data" type="Object">JSON light object containing the annotation.</param>
        /// <param name="obj" type="Object">Object that will hold properties produced by the annotation.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>

        var annotation = name.substring(odataAnnotationPrefix.length);

        switch (annotation) {
            case "navigationLinkUrl":
                jsonLightApplyNavigationUrlAnnotation(annotation, target, targetType, value, data, obj, baseURI);
                return;
            case "nextLink":
            case "count":
                jsonLightApplyFeedAnnotation(annotation, target, value, obj, baseURI);
                return;
            case "mediaReadLink":
            case "mediaEditLink":
            case "mediaContentType":
            case "mediaETag":
                jsonLightApplyMediaAnnotation(annotation, target, targetType, value, obj, baseURI);
                return;
            default:
                jsonLightApplyMetadataAnnotation(annotation, target, value, obj, baseURI);
                return;
        }
    };

    var jsonLightApplyMetadataAnnotation = function (name, target, value, obj, baseURI) {
        /// <summary>
        ///    Converts a JSON light annotation that applies to entry metadata only (i.e. odata.editLink or odata.readLink) and its value 
        ///    into their library's internal representation and saves it back to data.
        /// </summary>
        /// <param name="name" type="String">Annotation name.</param>
        /// <param name="target" type="String">Name of the property on which the annotation should be applied.</param>
        /// <param name="value" type="Object">Annotation value.</param>
        /// <param name="obj" type="Object">Object that will hold properties produced by the annotation.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>

        var metadata = obj.__metadata = obj.__metadata || {};
        var mappedName = jsonLightNameMap[name] || name;

        if (name === "editLink") {
            metadata.uri = normalizeURI(value, baseURI);
            metadata[mappedName] = metadata.uri;
            return;
        }

        if (name === "readLink" || name === "associationLinkUrl") {
            value = normalizeURI(value, baseURI);
        }

        if (target) {
            var propertiesMetadata = metadata.properties = metadata.properties || {};
            var propertyMetadata = propertiesMetadata[target] = propertiesMetadata[target] || {};

            if (name === "type") {
                propertyMetadata[mappedName] = propertyMetadata[mappedName] || value;
                return;
            }
            propertyMetadata[mappedName] = value;
            return;
        }
        metadata[mappedName] = value;
    };

    var jsonLightApplyFeedAnnotation = function (name, target, value, obj, baseURI) {
        /// <summary>
        ///    Converts a JSON light annotation that applies to feeds only (i.e. odata.count or odata.nextlink) and its value 
        ///    into their library's internal representation and saves it back to data.
        /// </summary>
        /// <param name="name" type="String">Annotation name.</param>
        /// <param name="target" type="String">Name of the property on which the annotation should be applied.</param>
        /// <param name="value" type="Object">Annotation value.</param>
        /// <param name="obj" type="Object">Object that will hold properties produced by the annotation.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>

        var mappedName = jsonLightNameMap[name];
        var feed = target ? obj[target] : obj;
        feed[mappedName] = (name === "nextLink") ? normalizeURI(value, baseURI) : value;
    };

    var jsonLightApplyMediaAnnotation = function (name, target, targetType, value, obj, baseURI) {
        /// <summary>
        ///    Converts a JSON light media annotation in and its value into their library's internal representation 
        ///    and saves it back to data or metadata.
        /// </summary>
        /// <param name="name" type="String">Annotation name.</param>
        /// <param name="target" type="String">Name of the property on which the annotation should be applied.</param>
        /// <param name="targetType" type="String">Type name of the target property.</param>
        /// <param name="value" type="Object">Annotation value.</param>
        /// <param name="obj" type="Object">Object that will hold properties produced by the annotation.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>

        var metadata = obj.__metadata = obj.__metadata || {};
        var mappedName = jsonLightNameMap[name];

        if (name === "mediaReadLink" || name === "mediaEditLink") {
            value = normalizeURI(value, baseURI);
        }

        if (target) {
            var propertiesMetadata = metadata.properties = metadata.properties || {};
            var propertyMetadata = propertiesMetadata[target] = propertiesMetadata[target] || {};
            propertyMetadata.type = propertyMetadata.type || targetType;

            obj.__metadata = metadata;
            obj[target] = obj[target] || { __mediaresource: {} };
            obj[target].__mediaresource[mappedName] = value;
            return;
        }

        metadata[mappedName] = value;
    };

    var jsonLightApplyNavigationUrlAnnotation = function (name, target, targetType, value, data, obj, baseURI) {
        /// <summary>
        ///    Converts a JSON light navigation property annotation and its value into their library's internal representation 
        ///    and saves it back to data o metadata.
        /// </summary>
        /// <param name="name" type="String">Annotation name.</param>
        /// <param name="target" type="String">Name of the property on which the annotation should be applied.</param>
        /// <param name="targetType" type="String">Type name of the target property.</param>
        /// <param name="value" type="Object">Annotation value.</param>
        /// <param name="data" type="Object">JSON light object containing the annotation.</param>
        /// <param name="obj" type="Object">Object that will hold properties produced by the annotation.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>

        var metadata = obj.__metadata = obj.__metadata || {};
        var propertiesMetadata = metadata.properties = metadata.properties || {};
        var propertyMetadata = propertiesMetadata[target] = propertiesMetadata[target] || {};
        var uri = normalizeURI(value, baseURI);

        if (data.hasOwnProperty(target)) {
            // The navigation property is inlined in the payload, 
            // so the navigation link url should be pushed to the object's 
            // property metadata instead.
            propertyMetadata.navigationLinkUrl = uri;
            return;
        }
        obj[target] = { __deferred: { uri: uri} };
        propertyMetadata.type = propertyMetadata.type || targetType;
    };


    var jsonLightReadDataItemValue = function (value, typeName, dataItemMetadata, baseURI, dataItemModel, model, recognizeDates) {
        /// <summary>Converts the value of a data item in a JSON light object to its library representation.</summary>
        /// <param name="value">Data item value to convert.</param>
        /// <param name="typeName" type="String">Type name of the data item.</param>
        /// <param name="dataItemMetadata" type="Object">Object containing metadata about the data item.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="dataItemModel" type="Object" optional="true">Object describing the data item in an OData conceptual schema.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns>Data item value in its library representation.</param>

        if (typeof value === "string") {
            return jsonLightReadStringPropertyValue(value, typeName, recognizeDates);
        }

        if (!jsonLightIsPrimitiveType(typeName)) {
            if (isArray(value)) {
                return jsonLightReadCollectionPropertyValue(value, typeName, dataItemMetadata, baseURI, model, recognizeDates);
            }

            if (isComplex(value)) {
                return jsonLightReadComplexPropertyValue(value, typeName, dataItemMetadata, baseURI, model, recognizeDates);
            }
        }
        return value;
    };

    var jsonLightReadStringPropertyValue = function (value, propertyType, recognizeDates) {
        /// <summary>Convertes the value of a string property in a JSON light object to its library representation.</summary>
        /// <param name="value" type="String">String value to convert.</param>
        /// <param name="propertyType" type="String">Type name of the property.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns>String property value in its library representation.</returns>

        switch (propertyType) {
            case EDM_TIME:
                return parseDuration(value);
            case EDM_DATETIME:
                return parseDateTime(value, /*nullOnError*/false);
            case EDM_DATETIMEOFFSET:
                return parseDateTimeOffset(value, /*nullOnError*/false);
        }

        if (recognizeDates) {
            return parseDateTime(value, /*nullOnError*/true)
                || parseDateTimeOffset(value, /*nullOnError*/true)
                || value;
        }
        return value;
    };

    var jsonLightReadCollectionPropertyValue = function (value, propertyType, propertyMetadata, baseURI, model, recognizeDates) {
        /// <summary>Converts the value of a collection property in a JSON light object into its library representation.</summary>
        /// <param name="value" type="Array">Collection property value to convert.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="propertyMetadata" type="Object">Object containing metadata about the collection property.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Collection property value in its library representation.</returns>

        var collectionType = getCollectionType(propertyType);
        var itemsMetadata = [];
        var items = [];

        var i, len;
        for (i = 0, len = value.length; i < len; i++) {
            var itemType = jsonLightDataItemType(null, value[i]) || collectionType;
            var itemMetadata = { type: itemType };
            var item = jsonLightReadDataItemValue(value[i], itemType, itemMetadata, baseURI, null, model, recognizeDates);

            if (!jsonLightIsPrimitiveType(itemType) && !isPrimitive(value[i])) {
                itemsMetadata.push(itemMetadata);
            }
            items.push(item);
        }

        if (itemsMetadata.length > 0) {
            propertyMetadata.elements = itemsMetadata;
        }

        return { __metadata: { type: propertyType }, results: items };
    };

    var jsonLightReadComplexPropertyValue = function (value, propertyType, propertyMetadata, baseURI, model, recognizeDates) {
        /// <summary>Converts the value of a comples property in a JSON light object into its library representation.</summary>
        /// <param name="value" type="Object">Complex property value to convert.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="propertyMetadata" type="Object">Object containing metadata about the complx type property.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Complex property value in its library representation.</returns>

        var complexValue = jsonLightReadObject(value, propertyType, baseURI, model, recognizeDates);
        var complexMetadata = complexValue.__metadata;
        var complexPropertiesMetadata = complexMetadata.properties;

        if (complexPropertiesMetadata) {
            propertyMetadata.properties = complexPropertiesMetadata;
            delete complexMetadata.properties;
        }
        return complexValue;
    };

    var jsonLightReadNavigationPropertyValue = function (value, propertyType, baseURI, model, recognizeDates) {
        /// <summary>Converts the value of a navigation property in a JSON light object into its library representation.</summary>
        /// <param name="value">Navigation property property value to convert.</param>
        /// <param name="propertyType" type="String">Property type name.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Collection property value in its library representation.</returns>

        if (isArray(value)) {
            return jsonLightReadFeed(value, propertyType, baseURI, model, recognizeDates);
        }

        if (isComplex(value)) {
            return jsonLightReadObject(value, propertyType, baseURI, model, recognizeDates);
        }
        return null;
    };

    var jsonLightReadObject = function (data, typeName, baseURI, model, recognizeDates) {
        /// <summary>Converts a JSON light entry or complex type object into its library representation.</summary>
        /// <param name="data" type="Object">JSON light entry or complex type object to convert.</param>
        /// <param name="typeName" type="String">Type name of the entry or complex type.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Entry or complex type object.</param>

        var actualType = data[typeAnnotation] || typeName;
        var dataModel = lookupEntityType(actualType, model) || lookupComplexType(actualType, model);

        var metadata = { type: actualType };
        var obj = { __metadata: metadata };
        var propertiesMetadata = {};

        for (var name in data) {
            if (name.indexOf("#") === 0) {
                // This is an advertised function or action.
                jsonLightReadAdvertisedFunctionOrAction(name.substring(1), data[name], obj, baseURI, model);
            } else {
                // Is name NOT an annotation?
                if (name.indexOf(".") === -1) {
                    if (!metadata.properties) {
                        metadata.properties = propertiesMetadata;
                    }

                    var propertyValue = data[name];
                    var propertyModel = jsonLightDataItemModel(name, dataModel);
                    var isNavigationProperty = jsonLightIsNavigationProperty(name, data, propertyModel);
                    var propertyType = jsonLightDataItemType(name, propertyValue, data, propertyModel, model);
                    var propertyMetadata = propertiesMetadata[name] = propertiesMetadata[name] || { type: propertyType };

                    obj[name] = isNavigationProperty ?
                    jsonLightReadNavigationPropertyValue(propertyValue, propertyType, baseURI, model, recognizeDates) :
                    jsonLightReadDataItemValue(propertyValue, propertyType, propertyMetadata, baseURI, propertyModel, model, recognizeDates);
                }
            }
        }

        return jsonLightReadDataAnnotations(data, obj, baseURI, dataModel, model);
    };

    var jsonLightReadAdvertisedFunctionOrAction = function (name, value, obj, baseURI, model) {
        /// <summary>Converts a JSON light advertised action or function object into its library representation.</summary>
        /// <param name="name" type="String">Advertised action or function name.</param>
        /// <param name="value">Advertised action or function value.</param>
        /// <param name="obj" type="Object">Object that will the converted value of the advertised action or function.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing the action's or function's relative URIs.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <remarks>
        ///     Actions and functions have the same representation in json light, so to disambiguate them the function uses
        ///     the model object.  If available, the function will look for the functionImport object that describes the 
        ///     the action or the function.  If for whatever reason the functionImport can't be retrieved from the model (like 
        ///     there is no model available or there is no functionImport within the model), then the value is going to be treated 
        ///     as an advertised action and stored under obj.__metadata.actions.
        /// </remarks>

        if (!name || !isArray(value) && !isComplex(value)) {
            return;
        }

        var isFunction = false;
        var nsEnd = name.lastIndexOf(".");
        var simpleName = name.substring(nsEnd + 1);
        var containerName = (nsEnd > -1) ? name.substring(0, nsEnd) : "";

        var container = (simpleName === name || containerName.indexOf(".") === -1) ?
            lookupDefaultEntityContainer(model) :
            lookupEntityContainer(containerName, model);

        if (container) {
            var functionImport = lookupFunctionImport(container.functionImport, simpleName);
            if (functionImport && !!functionImport.isSideEffecting) {
                isFunction = !parseBool(functionImport.isSideEffecting);
            }
        };

        var metadata = obj.__metadata;
        var targetName = isFunction ? "functions" : "actions"
        var metadataURI = normalizeURI(name, baseURI);
        var items = (isArray(value)) ? value : [value];

        var i, len;
        for (i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item) {
                var targetCollection = metadata[targetName] = metadata[targetName] || [];
                var actionOrFunction = { metadata: metadataURI, title: item.title, target: normalizeURI(item.target, baseURI) };
                targetCollection.push(actionOrFunction);
            }
        }
    };

    var jsonLightReadFeed = function (data, typeName, baseURI, model, recognizeDates) {
        /// <summary>Converts a JSON light feed or top level collection property object into its library representation.</summary>
        /// <param name="data" type="Object">JSON light feed object to convert.</param>
        /// <param name="typeName" type="String">Type name of the feed or collection items.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Feed or top level collection object.</param>

        var items = isArray(data) ? data : data.value;
        var entries = [];

        var i, len;
        for (i = 0, len = items.length; i < len; i++) {
            entries.push(jsonLightReadObject(items[i], typeName, baseURI, model, recognizeDates));
        }

        var feed = { results: entries };

        if (isComplex(data)) {
            for (var name in data) {
                if (name.indexOf("#") === 0) {
                    // This is an advertised function or action.
                    feed.__metadata = feed.__metadata || {};
                    jsonLightReadAdvertisedFunctionOrAction(name.substring(1), data[name], feed, baseURI, model);
                }
            }
            feed = jsonLightReadDataAnnotations(data, feed, baseURI);
        }
        return feed;
    };

    var jsonLightReadTopPrimitiveProperty = function (data, typeName, baseURI, recognizeDates) {
        /// <summary>Converts a JSON light top level primitive property object into its library representation.</summary>
        /// <param name="data" type="Object">JSON light feed object to convert.</param>
        /// <param name="typeName" type="String">Type name of the primitive property.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Top level primitive property object.</param>

        var metadata = { type: typeName };
        var value = jsonLightReadDataItemValue(data.value, typeName, metadata, baseURI, null, null, recognizeDates);
        return jsonLightReadDataAnnotations(data, { __metadata: metadata, value: value }, baseURI);
    };

    var jsonLightReadTopCollectionProperty = function (data, typeName, baseURI, model, recognizeDates) {
        /// <summary>Converts a JSON light top level collection property object into its library representation.</summary>
        /// <param name="data" type="Object">JSON light feed object to convert.</param>
        /// <param name="typeName" type="String">Type name of the collection property.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <param name="model" type="Object" optional="true">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <returns type="Object">Top level collection property object.</param>

        var propertyMetadata = {};
        var value = jsonLightReadCollectionPropertyValue(data.value, typeName, propertyMetadata, baseURI, model, recognizeDates);
        extend(value.__metadata, propertyMetadata);
        return jsonLightReadDataAnnotations(data, value, baseURI);
    };

    var jsonLightReadLinksDocument = function (data, baseURI) {
        /// <summary>Converts a JSON light links collection object to its library representation.</summary>
        /// <param name="data" type="Object">JSON light link object to convert.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <returns type="Object">Links collection object.</param>

        var items = data.value;
        if (!isArray(items)) {
            return jsonLightReadLink(data, baseURI);
        }

        var results = [];
        var i, len;
        for (i = 0, len = items.length; i < len; i++) {
            results.push(jsonLightReadLink(items[i], baseURI));
        }

        var links = { results: results };
        return jsonLightReadDataAnnotations(data, links, baseURI);
    };

    var jsonLightReadLink = function (data, baseURI) {
        /// <summary>Converts a JSON light link object to its library representation.</summary>
        /// <param name="data" type="Object">JSON light link object to convert.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <returns type="Object">Link object.</param>

        var link = { uri: normalizeURI(data.url, baseURI) };

        link = jsonLightReadDataAnnotations(data, link, baseURI);
        var metadata = link.__metadata || {};
        var metadataProperties = metadata.properties || {};

        jsonLightRemoveTypePropertyMetadata(metadataProperties.url);
        renameProperty(metadataProperties, "url", "uri");

        return link;
    };

    var jsonLightRemoveTypePropertyMetadata = function (propertyMetadata) {
        /// <summary>Removes the type property from a property metadata object.</summary>
        /// <param name="propertyMetadata" type="Object">Property metadata object.</param>

        if (propertyMetadata) {
            delete propertyMetadata.type;
        }
    };

    var jsonLightReadSvcDocument = function (data, baseURI) {
        /// <summary>Converts a JSON light service document object to its library representation.</summary>
        /// <param name="data" type="Object">JSON light service document object to convert.</param>
        /// <param name="baseURI" type="String">Base URI for normalizing relative URIs found in the payload.</param>
        /// <returns type="Object">Link object.</param>

        var items = data.value;
        var collections = [];
        var workspace = jsonLightReadDataAnnotations(data, { collections: collections }, baseURI);

        var metadata = workspace.__metadata || {};
        var metadataProperties = metadata.properties || {};

        jsonLightRemoveTypePropertyMetadata(metadataProperties.value);
        renameProperty(metadataProperties, "value", "collections");

        var i, len;
        for (i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var collection = { title: item.name, href: normalizeURI(item.url, baseURI) };

            collection = jsonLightReadDataAnnotations(item, collection, baseURI);
            metadata = collection.__metadata || {};
            metadataProperties = metadata.properties || {};

            jsonLightRemoveTypePropertyMetadata(metadataProperties.name);
            jsonLightRemoveTypePropertyMetadata(metadataProperties.url);

            renameProperty(metadataProperties, "name", "title");
            renameProperty(metadataProperties, "url", "href");

            collections.push(collection);
        }

        return { workspaces: [workspace] };
    };

    var jsonLightMakePayloadInfo = function (kind, type) {
        /// <summary>Creates an object containing information for the json light payload.</summary>
        /// <param name="kind" type="String">JSON light payload kind, one of the PAYLOADTYPE_XXX constant values.</param>
        /// <param name="typeName" type="String">Type name of the JSON light payload.</param>
        /// <returns type="Object">Object with kind and type fields.</returns>

        /// <field name="kind" type="String">Kind of the JSON light payload. One of the PAYLOADTYPE_XXX constant values.</field>
        /// <field name="type" type="String">Data type of the JSON light payload.</field>

        return { kind: kind, type: type || null };
    };

    var jsonLightPayloadInfo = function (data, model, inferFeedAsComplexType) {
        /// <summary>Infers the information describing the JSON light payload from its metadata annotation, structure, and data model.</summary>
        /// <param name="data" type="Object">Json light response payload object.</param>
        /// <param name="model" type="Object">Object describing an OData conceptual schema.</param>
        /// <param name="inferFeedAsComplexType" type="Boolean">True if a JSON light payload that looks like a feed should be treated as a complex type property instead.</param>
        /// <remarks>
        ///     If the arguments passed to the function don't convey enough information about the payload to determine without doubt that the payload is a feed then it 
        ///     will try to use the payload object structure instead.  If the payload looks like a feed (has value property that is an array or non-primitive values) then 
        ///     the function will report its kind as PAYLOADTYPE_FEED unless the inferFeedAsComplexType flag is set to true. This flag comes from the user request 
        ///     and allows the user to control how the library behaves with an ambigous JSON light payload. 
        /// </remarks>
        /// <returns type="Object">
        ///     Object with kind and type fields. Null if there is no metadata annotation or the payload info cannot be obtained.. 
        /// </returns>

        var metadataUri = data[metadataAnnotation];
        if (!metadataUri || typeof metadataUri !== "string") {
            return null;
        }

        var fragmentStart = metadataUri.lastIndexOf("#");
        if (fragmentStart === -1) {
            return jsonLightMakePayloadInfo(PAYLOADTYPE_SVCDOC);
        }

        var elementStart = metadataUri.indexOf("@Element", fragmentStart);
        var fragmentEnd = elementStart - 1;

        if (fragmentEnd < 0) {
            fragmentEnd = metadataUri.indexOf("?", fragmentStart);
            if (fragmentEnd === -1) {
                fragmentEnd = metadataUri.length;
            }
        }

        var fragment = metadataUri.substring(fragmentStart + 1, fragmentEnd);
        if (fragment.indexOf("/$links/") > 0) {
            return jsonLightMakePayloadInfo(PAYLOADTYPE_LINKS);
        }

        var fragmentParts = fragment.split("/");
        if (fragmentParts.length >= 0) {
            var qualifiedName = fragmentParts[0];
            var typeCast = fragmentParts[1];

            if (jsonLightIsPrimitiveType(qualifiedName)) {
                return jsonLightMakePayloadInfo(PAYLOADTYPE_PRIMITIVE, qualifiedName);
            }

            if (isCollectionType(qualifiedName)) {
                return jsonLightMakePayloadInfo(PAYLOADTYPE_COLLECTION, qualifiedName);
            }

            var entityType = typeCast;
            if (!typeCast) {
                var nsEnd = qualifiedName.lastIndexOf(".");
                var simpleName = qualifiedName.substring(nsEnd + 1);
                var container = (simpleName === qualifiedName) ?
                    lookupDefaultEntityContainer(model) :
                    lookupEntityContainer(qualifiedName.substring(0, nsEnd), model);

                if (container) {
                    var entitySet = lookupEntitySet(container.entitySet, simpleName);
                    entityType = !!entitySet ? entitySet.entityType : null
                }
            }

            if (elementStart > 0) {
                return jsonLightMakePayloadInfo(PAYLOADTYPE_OBJECT, entityType);
            }

            if (entityType) {
                return jsonLightMakePayloadInfo(PAYLOADTYPE_FEED, entityType);
            }

            if (isArray(data.value) && !lookupComplexType(qualifiedName, model)) {
                var item = data.value[0];
                if (!isPrimitive(item)) {
                    if (jsonLightIsEntry(item) || !inferFeedAsComplexType) {
                        return jsonLightMakePayloadInfo(PAYLOADTYPE_FEED, null);
                    }
                }
            }

            return jsonLightMakePayloadInfo(PAYLOADTYPE_OBJECT, qualifiedName);
        }

        return null;
    };

    var jsonLightReadPayload = function (data, model, recognizeDates, inferFeedAsComplexType) {
        /// <summary>Converts a JSON light response payload object into its library's internal representation.</summary>
        /// <param name="data" type="Object">Json light response payload object.</param>
        /// <param name="model" type="Object">Object describing an OData conceptual schema.</param>
        /// <param name="recognizeDates" type="Boolean" optional="true">Flag indicating whether datetime literal strings should be converted to JavaScript Date objects.</param>
        /// <param name="inferFeedAsComplexType" type="Boolean">True if a JSON light payload that looks like a feed should be reported as a complex type property instead.</param>
        /// <returns type="Object">Object in the library's representation.</returns>

        if (!isComplex(data)) {
            return data;
        }

        var baseURI = data[metadataAnnotation];
        var payloadInfo = jsonLightPayloadInfo(data, model, inferFeedAsComplexType);
        var typeName = null;
        if (payloadInfo) {
            delete data[metadataAnnotation];

            typeName = payloadInfo.type;
            switch (payloadInfo.kind) {
                case PAYLOADTYPE_FEED:
                    return jsonLightReadFeed(data, typeName, baseURI, model, recognizeDates);
                case PAYLOADTYPE_COLLECTION:
                    return jsonLightReadTopCollectionProperty(data, typeName, baseURI, model, recognizeDates);
                case PAYLOADTYPE_PRIMITIVE:
                    return jsonLightReadTopPrimitiveProperty(data, typeName, baseURI, recognizeDates);
                case PAYLOADTYPE_SVCDOC:
                    return jsonLightReadSvcDocument(data, baseURI);
                case PAYLOADTYPE_LINKS:
                    return jsonLightReadLinksDocument(data, baseURI);
            }
        }
        return jsonLightReadObject(data, typeName, baseURI, model, recognizeDates);
    };

    var jsonLightSerializableMetadata = ["type", "etag", "media_src", "edit_media", "content_type", "media_etag"];

    var formatJsonLight = function (obj, context) {
        /// <summary>Converts an object in the library's internal representation to its json light representation.</summary>
        /// <param name="obj" type="Object">Object the library's internal representation.</param>
        /// <param name="context" type="Object">Object with the serialization context.</param>
        /// <returns type="Object">Object in its json light representation.</returns>

        // Regular expression used to test that the uri is for a $links document.
        var linksUriRE = /\/\$links\//;
        var data = {};
        var metadata = obj.__metadata;

        var islinks = context && linksUriRE.test(context.request.requestUri);
        formatJsonLightData(obj, (metadata && metadata.properties), data, islinks);
        return data;
    };

    var formatJsonLightMetadata = function (metadata, data) {
        /// <summary>Formats an object's metadata into the appropriate json light annotations and saves them to data.</summary>
        /// <param name="obj" type="Object">Object whose metadata is going to be formatted as annotations.</param>
        /// <param name="data" type="Object">Object on which the annotations are going to be stored.</param>

        if (metadata) {
            var i, len;
            for (i = 0, len = jsonLightSerializableMetadata.length; i < len; i++) {
                // There is only a subset of metadata values that are interesting during update requests.
                var name = jsonLightSerializableMetadata[i];
                var qName = odataAnnotationPrefix + (jsonLightNameMap[name] || name);
                formatJsonLightAnnotation(qName, null, metadata[name], data);
            }
        }
    };

    var formatJsonLightData = function (obj, pMetadata, data, isLinks) {
        /// <summary>Formats an object's data into the appropriate json light values and saves them to data.</summary>
        /// <param name="obj" type="Object">Object whose data is going to be formatted.</param>
        /// <param name="pMetadata" type="Object">Object that contains metadata for the properties that are being formatted.</param>
        /// <param name="data" type="Object">Object on which the formatted values are going to be stored.</param>
        /// <param name="isLinks" type="Boolean">True if a links document is being formatted.  False otherwise.</param>

        for (var key in obj) {
            var value = obj[key];
            if (key === "__metadata") {
                // key is the object metadata.
                formatJsonLightMetadata(value, data);
            } else if (key.indexOf(".") === -1) {
                // key is an regular property or array element.
                if (isLinks && key === "uri") {
                    formatJsonLightEntityLink(value, data);
                } else {
                    formatJsonLightProperty(key, value, pMetadata, data, isLinks);
                }
            } else {
                data[key] = value;
            }
        }
    };

    var formatJsonLightProperty = function (name, value, pMetadata, data) {
        /// <summary>Formats an object's value identified by name to its json light representation and saves it to data.</summary>
        /// <param name="name" type="String">Property name.</param>
        /// <param name="value">Property value.</param>
        /// <param name="pMetadata" type="Object">Object that contains metadata for the property that is being formatted.</param>
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>

        // Get property type from property metadata
        var propertyMetadata = pMetadata && pMetadata[name] || { properties: undefined, type: undefined };
        var typeName = dataItemTypeName(value, propertyMetadata);

        if (isPrimitive(value) || !value) {
            // It is a primitive value then.
            formatJsonLightAnnotation(typeAnnotation, name, typeName, data);
            data[name] = value;
            return;
        }

        if (isFeed(value, typeName) || isEntry(value)) {
            formatJsonLightInlineProperty(name, value, data);
            return;
        }

        if (!typeName && isDeferred(value)) {
            // It is really a deferred property.
            formatJsonLightDeferredProperty(name, value, data);
            return;
        }

        if (isCollection(value, typeName)) {
            // The thing is a collection, format it as one.
            if (getCollectionType(typeName)) {
                formatJsonLightAnnotation(typeAnnotation, name, typeName, data);
            }
            formatJsonLightCollectionProperty(name, value, data);
            return;
        }


        // Format the complex property value in a new object in data[name].
        data[name] = {};
        formatJsonLightAnnotation(typeAnnotation, null, typeName, data[name]);
        formatJsonLightData(value, propertyMetadata.properties, data[name]);
    };

    var formatJsonLightEntityLink = function (value, data) {
        /// <summary>Formats an entity link in a $links document and saves it into data.</summary>
        /// <param name="value" type="String">Entity link value.</summary>
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>
        data.url = value;
    };

    var formatJsonLightDeferredProperty = function (name, value, data) {
        /// <summary>Formats the object value's identified by name as an odata.navigalinkurl annotation and saves it to data.</summary>
        /// <param name="name" type="String">Name of the deferred property to be formatted.</param>
        /// <param name="value" type="Object">Deferred property value to be formatted.</param>
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>

        formatJsonLightAnnotation(navUrlAnnotation, name, value.__deferred.uri, data);
    };

    var formatJsonLightCollectionProperty = function (name, value, data) {
        /// <summary>Formats a collection property in obj identified by name as a json light collection property and saves it to data.</summary>
        /// <param name="name" type="String">Name of the collection property to be formatted.</param>
        /// <param name="value" type="Object">Collection property value to be formatted.</param>
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>

        data[name] = [];
        var items = isArray(value) ? value : value.results;
        formatJsonLightData(items, null, data[name]);
    };

    var formatJsonLightInlineProperty = function (name, value, data) {
        /// <summary>Formats an inline feed or entry property in obj identified by name as a json light value and saves it to data.</summary>
        /// <param name="name" type="String">Name of the inline feed or entry property to be formatted.</param>
        /// <param name="value" type="Object or Array">Value of the inline feed or entry property.</param>
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>

        if (isFeed(value)) {
            data[name] = [];
            // Format each of the inline feed entries 
            var entries = isArray(value) ? value : value.results;
            var i, len;
            for (i = 0, len = entries.length; i < len; i++) {
                formatJsonLightInlineEntry(name, entries[i], true, data);
            }
            return;
        }
        formatJsonLightInlineEntry(name, value, false, data);
    };

    var formatJsonLightInlineEntry = function (name, value, inFeed, data) {
        /// <summary>Formats an inline entry value in the property identified by name as a json light value and saves it to data.</summary>
        /// <param name="name" type="String">Name of the inline feed or entry property that owns the entry formatted.</param>
        /// <param name="value" type="Object">Inline entry value to be formatted.</param>
        /// <param name="inFeed" type="Boolean">True if the entry is in an inline feed; false otherwise.
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>

        // This might be a bind instead of a deep insert.
        var uri = value.__metadata && value.__metadata.uri;
        if (uri) {
            formatJsonLightBinding(name, uri, inFeed, data);
            return;
        }

        var entry = formatJsonLight(value);
        if (inFeed) {
            data[name].push(entry);
            return;
        }
        data[name] = entry;
    };

    var formatJsonLightBinding = function (name, uri, inFeed, data) {
        /// <summary>Formats an entry binding in the inline property in obj identified by name as an odata.bind annotation and saves it to data.</summary>
        /// <param name="name" type="String">Name of the inline property that has the binding to be formated.</param>
        /// <param name="uri" type="String">Uri to the bound entry.</param>
        /// <param name="inFeed" type="Boolean">True if the binding is in an inline feed; false otherwise.
        /// <param name="data" type="Object">Object on which the formatted value is going to be stored.</param>

        var bindingName = name + bindAnnotation;
        if (inFeed) {
            // The binding is inside an inline feed, so merge it with whatever other bindings already exist in data.
            data[bindingName] = data[bindingName] || [];
            data[bindingName].push(uri);
            return;
        }
        // The binding is on an inline entry; it can be safely overwritten.
        data[bindingName] = uri;
    };

    var formatJsonLightAnnotation = function (qName, target, value, data) {
        /// <summary>Formats a value as a json light annotation and stores it in data</summary>
        /// <param name="qName" type="String">Qualified name of the annotation.</param>
        /// <param name="target" type="String">Name of the property that the metadata value targets.</param>
        /// <param name="value">Annotation value.</param>
        /// <param name="data" type="Object">Object on which the annotation is going to be stored.</param>

        if (value !== undefined) {
            target ? data[target + "@" + qName] = value : data[qName] = value;
        }
    };



    var jsonMediaType = "application/json";
    var jsonContentType = contentType(jsonMediaType);

    var jsonReadAdvertisedActionsOrFunctions = function (value) {
        /// <summary>Reads and object containing action or function metadata and maps them into a single array of objects.</summary>
        /// <param name="value" type="Object">Object containing action or function metadata.</param>
        /// <returns type="Array">Array of objects containing metadata for the actions or functions specified in value.</returns>

        var result = [];
        for (name in value) {
            var i, len;
            for (i = 0, len = value[name].length; i < len; i++) {
                result.push(extend({ metadata: name }, value[name][i]));
            }
        }
        return result;
    };

    var jsonApplyMetadata = function (value, metadata, dateParser, recognizeDates) {
        /// <summary>Applies metadata coming from both the payload and the metadata object to the value.</summary>
        /// <param name="value" type="Object">Data on which the metada is going to be applied.</param>
        /// <param name="metadata">Metadata store; one of edmx, schema, or an array of any of them.</param>
        /// <param name="dateParser" type="function">Function used for parsing datetime values.</param>
        /// <param name="recognizeDates" type="Boolean">
        ///     True if strings formatted as datetime values should be treated as datetime values. False otherwise.
        /// </param>
        /// <returns type="Object">Transformed data.</returns>

        if (value && typeof value === "object") {
            var dataTypeName;
            var valueMetadata = value.__metadata;

            if (valueMetadata) {
                if (valueMetadata.actions) {
                    valueMetadata.actions = jsonReadAdvertisedActionsOrFunctions(valueMetadata.actions);
                }
                if (valueMetadata.functions) {
                    valueMetadata.functions = jsonReadAdvertisedActionsOrFunctions(valueMetadata.functions);
                }
                dataTypeName = valueMetadata && valueMetadata.type;
            }

            var dataType = lookupEntityType(dataTypeName, metadata) || lookupComplexType(dataTypeName, metadata);

            if (dataType) {
                var properties = dataType.property;
                if (properties) {
                    var i, len;
                    for (i = 0, len = properties.length; i < len; i++) {
                        var property = properties[i];
                        var propertyName = property.name;
                        var propertyValue = value[propertyName];

                        if (property.type === "Edm.DateTime" || property.type === "Edm.DateTimeOffset") {
                            if (propertyValue) {
                                propertyValue = dateParser(propertyValue);
                                if (!propertyValue) {
                                    throw { message: "Invalid date/time value" };
                                }
                                value[propertyName] = propertyValue;
                            }
                        } else if (property.type === "Edm.Time") {
                        	// ##### BEGIN: MODIFIED BY SAP
                        	if (propertyValue) {
                       		// ##### END: MODIFIED BY SAP
                        		value[propertyName] = parseDuration(propertyValue);
                            // ##### BEGIN: MODIFIED BY SAP
                        	}
                        	// ##### END: MODIFIED BY SAP
                        }
                    }
                }
            } else if (recognizeDates) {
                for (var name in value) {
                    propertyValue = value[name];
                    if (typeof propertyValue === "string") {
                        value[name] = dateParser(propertyValue) || propertyValue;
                    }
                }
            }
        }
        return value;
    };

    var isJsonLight = function (contentType) {
        /// <summary>Tests where the content type indicates a json light payload.</summary>
        /// <param name="contentType">Object with media type and properties dictionary.</param>
        /// <returns type="Boolean">True is the content type indicates a json light payload. False otherwise.</returns>

        if (contentType) {
            var odata = contentType.properties.odata;
            return odata === "nometadata" || odata === "minimalmetadata" || odata === "fullmetadata";
        }
        return false;
    };

    var normalizeServiceDocument = function (data, baseURI) {
        /// <summary>Normalizes a JSON service document to look like an ATOM service document.</summary>
        /// <param name="data" type="Object">Object representation of service documents as deserialized.</param>
        /// <param name="baseURI" type="String">Base URI to resolve relative URIs.</param>
        /// <returns type="Object">An object representation of the service document.</returns>
        var workspace = { collections: [] };

        var i, len;
        for (i = 0, len = data.EntitySets.length; i < len; i++) {
            var title = data.EntitySets[i];
            var collection = {
                title: title,
                href: normalizeURI(title, baseURI)
            };

            workspace.collections.push(collection);
        }

        return { workspaces: [workspace] };
    };

    // The regular expression corresponds to something like this:
    // /Date(123+60)/
    //
    // This first number is date ticks, the + may be a - and is optional,
    // with the second number indicating a timezone offset in minutes.
    // 
    // On the wire, the leading and trailing forward slashes are
    // escaped without being required to so the chance of collisions is reduced;
    // however, by the time we see the objects, the characters already
    // look like regular forward slashes.
    var jsonDateRE = /^\/Date\((-?\d+)(\+|-)?(\d+)?\)\/$/;

    var minutesToOffset = function (minutes) {
        /// <summary>Formats the given minutes into (+/-)hh:mm format.</summary>
        /// <param name="minutes" type="Number">Number of minutes to format.</param>
        /// <returns type="String">The minutes in (+/-)hh:mm format.</returns>

        var sign;
        if (minutes < 0) {
            sign = "-";
            minutes = -minutes;
        } else {
            sign = "+";
        }

        var hours = Math.floor(minutes / 60);
        minutes = minutes - (60 * hours);

        return sign + formatNumberWidth(hours, 2) + ":" + formatNumberWidth(minutes, 2);
    };

    var parseJsonDateString = function (value) {
        /// <summary>Parses the JSON Date representation into a Date object.</summary>
        /// <param name="value" type="String">String value.</param>
        /// <returns type="Date">A Date object if the value matches one; falsy otherwise.</returns>

        var arr = value && jsonDateRE.exec(value);
        if (arr) {
            // 0 - complete results; 1 - ticks; 2 - sign; 3 - minutes
            var result = new Date(parseInt10(arr[1]));
            if (arr[2]) {
                var mins = parseInt10(arr[3]);
                if (arr[2] === "-") {
                    mins = -mins;
                }

                // The offset is reversed to get back the UTC date, which is
                // what the API will eventually have.
                var current = result.getUTCMinutes();
                result.setUTCMinutes(current - mins);
                result.__edmType = "Edm.DateTimeOffset";
                result.__offset = minutesToOffset(mins);
            }
            if (!isNaN(result.valueOf())) {
                return result;
            }
        }

        // Allow undefined to be returned.
    };

    // Some JSON implementations cannot produce the character sequence \/
    // which is needed to format DateTime and DateTimeOffset into the 
    // JSON string representation defined by the OData protocol.
    // See the history of this file for a candidate implementation of
    // a 'formatJsonDateString' function.

    var jsonParser = function (handler, text, context) {
        /// <summary>Parses a JSON OData payload.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="text">Payload text (this parser also handles pre-parsed objects).</param>
        /// <param name="context" type="Object">Object with parsing context.</param>
        /// <returns>An object representation of the OData payload.</returns>

        var recognizeDates = defined(context.recognizeDates, handler.recognizeDates);
        var inferJsonLightFeedAsObject = defined(context.inferJsonLightFeedAsObject, handler.inferJsonLightFeedAsObject);
        var model = context.metadata;
        var dataServiceVersion = context.dataServiceVersion;
        var dateParser = parseJsonDateString;
        var json = (typeof text === "string") ? window.JSON.parse(text) : text;

        if ((maxVersion("3.0", dataServiceVersion) === dataServiceVersion)) {
            if (isJsonLight(context.contentType)) {
                return jsonLightReadPayload(json, model, recognizeDates, inferJsonLightFeedAsObject);
            }
            dateParser = parseDateTime;
        }

        json = traverse(json.d, function (key, value) {
            return jsonApplyMetadata(value, model, dateParser, recognizeDates);
        });

        json = jsonUpdateDataFromVersion(json, context.dataServiceVersion);
        return jsonNormalizeData(json, context.response.requestUri);
    };

    var jsonToString = function (data) {
        /// <summary>Converts the data into a JSON string.</summary>
        /// <param name="data">Data to serialize.</param>
        /// <returns type="String">The JSON string representation of data.</returns>

        var result = undefined;
        // Save the current date.toJSON function
        var dateToJSON = Date.prototype.toJSON;
        try {
            // Set our own date.toJSON function
            Date.prototype.toJSON = function () {
                // ##### BEGIN: MODIFIED BY SAP
                //return formatDateTimeOffset(this);
            	return formatDateTimeOffsetJSON(this);
                //##### END: MODIFIED BY SAP
            };
            result = window.JSON.stringify(data, jsonReplacer);
            //##### BEGIN: MODIFIED BY SAP
            result = result.replace(/\/Date\(([0-9.+-]+)\)\//g, "\\/Date($1)\\/");
            //##### END: MODIFIED BY SAP
        } finally {
            // Restore the original toJSON function
            Date.prototype.toJSON = dateToJSON;
        }
        return result;
    };

    var jsonSerializer = function (handler, data, context) {
        /// <summary>Serializes the data by returning its string representation.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="data">Data to serialize.</param>
        /// <param name="context" type="Object">Object with serialization context.</param>
        /// <returns type="String">The string representation of data.</returns>

        var dataServiceVersion = context.dataServiceVersion || "1.0";
        var useJsonLight = defined(context.useJsonLight, handler.useJsonLight);
        var cType = context.contentType = context.contentType || jsonContentType;

        if (cType && cType.mediaType === jsonContentType.mediaType) {
            var json = data;
            if (useJsonLight || isJsonLight(cType)) {
                context.dataServiceVersion = maxVersion(dataServiceVersion, "3.0");
                json = formatJsonLight(data, context);
                return jsonToString(json);
            }
            if (maxVersion("3.0", dataServiceVersion) === dataServiceVersion) {
                cType.properties.odata = "verbose";
                context.contentType = cType;
            }
            return jsonToString(json);
        }
        return undefined;
    };

    var jsonReplacer = function (_, value) {
        /// <summary>JSON replacer function for converting a value to its JSON representation.</summary>
        /// <param value type="Object">Value to convert.</param>
        /// <returns type="String">JSON representation of the input value.</returns>
        /// <remarks>
        ///   This method is used during JSON serialization and invoked only by the JSON.stringify function. 
        ///   It should never be called directly.
        /// </remarks>

        if (value && value.__edmType === "Edm.Time") {
            return formatDuration(value);
        } else {
            return value;
        }
    };

    var jsonNormalizeData = function (data, baseURI) {
        /// <summary>
        /// Normalizes the specified data into an intermediate representation.
        /// like the latest supported version.
        /// </summary>
        /// <param name="data" optional="false">Data to update.</param>
        /// <param name="baseURI" optional="false">URI to use as the base for normalizing references.</param>

        var isSvcDoc = isComplex(data) && !data.__metadata && isArray(data.EntitySets);
        return isSvcDoc ? normalizeServiceDocument(data, baseURI) : data;
    };

    var jsonUpdateDataFromVersion = function (data, dataVersion) {
        /// <summary>
        /// Updates the specified data in the specified version to look
        /// like the latest supported version.
        /// </summary>
        /// <param name="data" optional="false">Data to update.</param>
        /// <param name="dataVersion" optional="true" type="String">Version the data is in (possibly unknown).</param>

        // Strip the trailing comma if there.
        if (dataVersion && dataVersion.lastIndexOf(";") === dataVersion.length - 1) {
            dataVersion = dataVersion.substr(0, dataVersion.length - 1);
        }

        if (!dataVersion || dataVersion === "1.0") {
            if (isArray(data)) {
                data = { results: data };
            }
        }

        return data;
    };

    var jsonHandler = handler(jsonParser, jsonSerializer, jsonMediaType, MAX_DATA_SERVICE_VERSION);
    jsonHandler.recognizeDates = false;
    jsonHandler.useJsonLight = false;
    jsonHandler.inferJsonLightFeedAsObject = false;

    odata.jsonHandler = jsonHandler;




    var batchMediaType = "multipart/mixed";
    var responseStatusRegex = /^HTTP\/1\.\d (\d{3}) (.*)$/i;
    var responseHeaderRegex = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;

    var hex16 = function () {
        /// <summary>
        /// Calculates a random 16 bit number and returns it in hexadecimal format.
        /// </summary>
        /// <returns type="String">A 16-bit number in hex format.</returns>

        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substr(1);
    };

    var createBoundary = function (prefix) {
        /// <summary>
        /// Creates a string that can be used as a multipart request boundary.
        /// </summary>
        /// <param name="prefix" type="String" optional="true">String to use as the start of the boundary string</param>
        /// <returns type="String">Boundary string of the format: <prefix><hex16>-<hex16>-<hex16></returns>

        return prefix + hex16() + "-" + hex16() + "-" + hex16();
    };

    var partHandler = function (context) {
        /// <summary>
        /// Gets the handler for data serialization of individual requests / responses in a batch.
        /// </summary>
        /// <param name="context">Context used for data serialization.</param>
        /// <returns>Handler object.</returns>

        return context.handler.partHandler;
    };

    var currentBoundary = function (context) {
        /// <summary>
        /// Gets the current boundary used for parsing the body of a multipart response.
        /// </summary>
        /// <param name="context">Context used for parsing a multipart response.</param>
        /// <returns type="String">Boundary string.</returns>

        var boundaries = context.boundaries;
        return boundaries[boundaries.length - 1];
    };

    var batchParser = function (handler, text, context) {
        /// <summary>Parses a batch response.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="text" type="String">Batch text.</param>
        /// <param name="context" type="Object">Object with parsing context.</param>
        /// <returns>An object representation of the batch.</returns>

        var boundary = context.contentType.properties["boundary"];
        return { __batchResponses: readBatch(text, { boundaries: [boundary], handlerContext: context }) };
    };

    var batchSerializer = function (handler, data, context) {
        /// <summary>Serializes a batch object representation into text.</summary>
        /// <param name="handler">This handler.</param>
        /// <param name="data" type="Object">Representation of a batch.</param>
        /// <param name="context" type="Object">Object with parsing context.</param>
        /// <returns>An text representation of the batch object; undefined if not applicable.</returns>

        var cType = context.contentType = context.contentType || contentType(batchMediaType);
        if (cType.mediaType === batchMediaType) {
            return writeBatch(data, context);
        }
    };

    var readBatch = function (text, context) {
        /// <summary>
        /// Parses a multipart/mixed response body from from the position defined by the context. 
        /// </summary>
        /// <param name="text" type="String" optional="false">Body of the multipart/mixed response.</param>
        /// <param name="context">Context used for parsing.</param>
        /// <returns>Array of objects representing the individual responses.</returns>

        var delimiter = "--" + currentBoundary(context);

        // Move beyond the delimiter and read the complete batch
        readTo(text, context, delimiter);

        // Ignore the incoming line
        readLine(text, context);

        // Read the batch parts
        var responses = [];
        var partEnd;

        while (partEnd !== "--" && context.position < text.length) {
            var partHeaders = readHeaders(text, context);
            var partContentType = contentType(partHeaders["Content-Type"]);

            if (partContentType && partContentType.mediaType === batchMediaType) {
                context.boundaries.push(partContentType.properties["boundary"]);
                try {
                    var changeResponses = readBatch(text, context);
                } catch (e) {
                    e.response = readResponse(text, context, delimiter);
                    changeResponses = [e];
                }
                responses.push({ __changeResponses: changeResponses });
                context.boundaries.pop();
                readTo(text, context, "--" + currentBoundary(context));
            } else {
                if (!partContentType || partContentType.mediaType !== "application/http") {
                    throw { message: "invalid MIME part type " };
                }
                // Skip empty line
                readLine(text, context);
                // Read the response
                var response = readResponse(text, context, delimiter);
                try {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        partHandler(context.handlerContext).read(response, context.handlerContext);
                    } else {
                        // Keep track of failed responses and continue processing the batch.
                        response = { message: "HTTP request failed", response: response };
                    }
                } catch (e) {
                    response = e;
                }

                responses.push(response);
            }

            partEnd = text.substr(context.position, 2);

            // Ignore the incoming line.
            readLine(text, context);
        }
        return responses;
    };

    var readHeaders = function (text, context) {
        /// <summary>
        /// Parses the http headers in the text from the position defined by the context.  
        /// </summary>
        /// <param name="text" type="String" optional="false">Text containing an http response's headers</param>
        /// <param name="context">Context used for parsing.</param>
        /// <returns>Object containing the headers as key value pairs.</returns>
        /// <remarks>
        /// This function doesn't support split headers and it will stop reading when it hits two consecutive line breaks.
        /// </remarks>

        var headers = {};
        var parts;
        var line;
        var pos;

        do {
            pos = context.position;
            line = readLine(text, context);
            parts = responseHeaderRegex.exec(line);
            if (parts !== null) {
                headers[parts[1]] = parts[2];
            } else {
                // Whatever was found is not a header, so reset the context position.
                context.position = pos;
            }
        } while (line && parts);

        normalizeHeaders(headers);

        return headers;
    };

    var readResponse = function (text, context, delimiter) {
        /// <summary>
        /// Parses an HTTP response. 
        /// </summary>
        /// <param name="text" type="String" optional="false">Text representing the http response.</param>
        /// <param name="context" optional="false">Context used for parsing.</param>
        /// <param name="delimiter" type="String" optional="false">String used as delimiter of the multipart response parts.</param>
        /// <returns>Object representing the http response.</returns>

        // Read the status line. 
        var pos = context.position;
        var match = responseStatusRegex.exec(readLine(text, context));

        var statusCode;
        var statusText;
        var headers;

        if (match) {
            statusCode = match[1];
            statusText = match[2];
            headers = readHeaders(text, context);
            readLine(text, context);
        } else {
            context.position = pos;
        }

        return {
            statusCode: statusCode,
            statusText: statusText,
            headers: headers,
            body: readTo(text, context, "\r\n" + delimiter)
        };
    };

    var readLine = function (text, context) {
        /// <summary>
        /// Returns a substring from the position defined by the context up to the next line break (CRLF).
        /// </summary>
        /// <param name="text" type="String" optional="false">Input string.</param>
        /// <param name="context" optional="false">Context used for reading the input string.</param>
        /// <returns type="String">Substring to the first ocurrence of a line break or null if none can be found. </returns>

        return readTo(text, context, "\r\n");
    };

    var readTo = function (text, context, str) {
        /// <summary>
        /// Returns a substring from the position given by the context up to value defined by the str parameter and increments the position in the context.
        /// </summary>
        /// <param name="text" type="String" optional="false">Input string.</param>
        /// <param name="context" type="Object" optional="false">Context used for reading the input string.</param>
        /// <param name="str" type="String" optional="true">Substring to read up to.</param>
        /// <returns type="String">Substring to the first ocurrence of str or the end of the input string if str is not specified. Null if the marker is not found.</returns>

        var start = context.position || 0;
        var end = text.length;
        if (str) {
            end = text.indexOf(str, start);
            if (end === -1) {
                return null;
            }
            context.position = end + str.length;
        } else {
            context.position = end;
        }

        return text.substring(start, end);
    };

    var writeBatch = function (data, context) {
        /// <summary>
        /// Serializes a batch request object to a string.
        /// </summary>
        /// <param name="data" optional="false">Batch request object in payload representation format</param>
        /// <param name="context" optional="false">Context used for the serialization</param>
        /// <returns type="String">String representing the batch request</returns>

        if (!isBatch(data)) {
            throw { message: "Data is not a batch object." };
        }

        var batchBoundary = createBoundary("batch_");
        var batchParts = data.__batchRequests;
        var batch = "";
        var i, len;
        for (i = 0, len = batchParts.length; i < len; i++) {
            batch += writeBatchPartDelimiter(batchBoundary, false) +
                     writeBatchPart(batchParts[i], context);
        }
        batch += writeBatchPartDelimiter(batchBoundary, true);

        // Register the boundary with the request content type.
        var contentTypeProperties = context.contentType.properties;
        contentTypeProperties.boundary = batchBoundary;

        return batch;
    };

    var writeBatchPartDelimiter = function (boundary, close) {
        /// <summary>
        /// Creates the delimiter that indicates that start or end of an individual request.
        /// </summary>
        /// <param name="boundary" type="String" optional="false">Boundary string used to indicate the start of the request</param>
        /// <param name="close" type="Boolean">Flag indicating that a close delimiter string should be generated</param>
        /// <returns type="String">Delimiter string</returns>

        var result = "\r\n--" + boundary;
        if (close) {
            result += "--";
        }

        return result + "\r\n";
    };

    var writeBatchPart = function (part, context, nested) {
        /// <summary>
        /// Serializes a part of a batch request to a string. A part can be either a GET request or 
        /// a change set grouping several CUD (create, update, delete) requests.
        /// </summary>
        /// <param name="part" optional="false">Request or change set object in payload representation format</param>
        /// <param name="context" optional="false">Object containing context information used for the serialization</param>
        /// <param name="nested" type="boolean" optional="true">Flag indicating that the part is nested inside a change set</param>
        /// <returns type="String">String representing the serialized part</returns>
        /// <remarks>
        /// A change set is an array of request objects and they cannot be nested inside other change sets.
        /// </remarks>

        var changeSet = part.__changeRequests;
        var result;
        if (isArray(changeSet)) {
            if (nested) {
                throw { message: "Not Supported: change set nested in other change set" };
            }

            var changeSetBoundary = createBoundary("changeset_");
            result = "Content-Type: " + batchMediaType + "; boundary=" + changeSetBoundary + "\r\n";
            var i, len;
            for (i = 0, len = changeSet.length; i < len; i++) {
                result += writeBatchPartDelimiter(changeSetBoundary, false) +
                     writeBatchPart(changeSet[i], context, true);
            }

            result += writeBatchPartDelimiter(changeSetBoundary, true);
        } else {
            result = "Content-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\n";
            var partContext = extend({}, context);
            partContext.handler = handler;
            partContext.request = part;
            partContext.contentType = null;

            prepareRequest(part, partHandler(context), partContext);
            result += writeRequest(part);
        }

        return result;
    };

    var writeRequest = function (request) {
        /// <summary>
        /// Serializes a request object to a string.
        /// </summary>
        /// <param name="request" optional="false">Request object to serialize</param>
        /// <returns type="String">String representing the serialized request</returns>

        var result = (request.method ? request.method : "GET") + " " + request.requestUri + " HTTP/1.1\r\n";
        for (var name in request.headers) {
            if (request.headers[name]) {
                result = result + name + ": " + request.headers[name] + "\r\n";
            }
        }
        // ##### BEGIN: MODIFIED BY SAP
        
        // code added to add the content-length for each batch part...may be removed for later gateway versions
        if (request.body) {
        	
        	function utf8Len(ch) {
        		if (ch <= 0x7F) return 1;
        		if (ch <= 0x7FF) return 2;
        		if (ch <= 0xFFFF) return 3;
        		if (ch <= 0x1FFFFF) return 4;
        		if (ch <= 0x3FFFFFF) return 5;
        		if (ch <= 0x7FFFFFFF) return 6;
        		throw new Error("Illegal argument: " + ch);
        	}

        	function utf8ByteCount(str) {
        		var count = 0;
        		for (var i = 0; i < str.length; i++) {
        			var ch = str.charCodeAt(i);
        			count += utf8Len(ch);
        		}
        		return count;
        	}
            result += "Content-Length: " + utf8ByteCount(request.body) + "\r\n";
        } 
        // ##### END: MODIFIED BY SAP

        result += "\r\n";

        if (request.body) {
            result += request.body;
        }

        return result;
    };

    odata.batchHandler = handler(batchParser, batchSerializer, batchMediaType, MAX_DATA_SERVICE_VERSION);



    var handlers = [odata.jsonHandler, odata.atomHandler, odata.xmlHandler, odata.textHandler];

    var dispatchHandler = function (handlerMethod, requestOrResponse, context) {
        /// <summary>Dispatches an operation to handlers.</summary>
        /// <param name="handlerMethod" type="String">Name of handler method to invoke.</param>
        /// <param name="requestOrResponse" type="Object">request/response argument for delegated call.</param>
        /// <param name="context" type="Object">context argument for delegated call.</param>

        var i, len;
        for (i = 0, len = handlers.length; i < len && !handlers[i][handlerMethod](requestOrResponse, context); i++) {
        }

        if (i === len) {
            throw { message: "no handler for data" };
        }
    };

    odata.defaultSuccess = function (data) {
        /// <summary>Default success handler for OData.</summary>
        /// <param name="data">Data to process.</param>

        window.alert(window.JSON.stringify(data));
    };

    odata.defaultError = throwErrorCallback;

    odata.defaultHandler = {
        read: function (response, context) {
            /// <summary>Reads the body of the specified response by delegating to JSON and ATOM handlers.</summary>
            /// <param name="response">Response object.</param>
            /// <param name="context">Operation context.</param>

        	// ##### BEGIN: MODIFIED BY SAP
        	// added response.body check and removed assigned(response.body) call...for the case that if body is empty string...don't process any response body data
            if (response && response.body && response.headers["Content-Type"]) {
            // ##### END: MODIFIED BY SAP
                dispatchHandler("read", response, context);
            }
        },

        write: function (request, context) {
            /// <summary>Write the body of the specified request by delegating to JSON and ATOM handlers.</summary>
            /// <param name="request">Reques tobject.</param>
            /// <param name="context">Operation context.</param>

            dispatchHandler("write", request, context);
        },

        maxDataServiceVersion: MAX_DATA_SERVICE_VERSION,
        accept: "application/atomsvc+xml;q=0.8, application/json;odata=fullmetadata;q=0.7, application/json;q=0.5, */*;q=0.1"
    };

    odata.defaultMetadata = [];

    odata.read = function (urlOrRequest, success, error, handler, httpClient, metadata) {
        /// <summary>Reads data from the specified URL.</summary>
        /// <param name="urlOrRequest">URL to read data from.</param>
        /// <param name="success" type="Function" optional="true">Callback for a successful read operation.</param>
        /// <param name="error" type="Function" optional="true">Callback for handling errors.</param>
        /// <param name="handler" type="Object" optional="true">Handler for data serialization.</param>
        /// <param name="httpClient" type="Object" optional="true">HTTP client layer.</param>
        /// <param name="metadata" type="Object" optional="true">Conceptual metadata for this request.</param>

        var request;
        if (urlOrRequest instanceof String || typeof urlOrRequest === "string") {
            request = { requestUri: urlOrRequest };
        } else {
            request = urlOrRequest;
        }

        return odata.request(request, success, error, handler, httpClient, metadata);
    };

    odata.request = function (request, success, error, handler, httpClient, metadata) {
        /// <summary>Sends a request containing OData payload to a server.</summary>
        /// <param name="request" type="Object">Object that represents the request to be sent.</param>
        /// <param name="success" type="Function" optional="true">Callback for a successful read operation.</param>
        /// <param name="error" type="Function" optional="true">Callback for handling errors.</param>
        /// <param name="handler" type="Object" optional="true">Handler for data serialization.</param>
        /// <param name="httpClient" type="Object" optional="true">HTTP client layer.</param>
        /// <param name="metadata" type="Object" optional="true">Conceptual metadata for this request.</param>

        success = success || odata.defaultSuccess;
        error = error || odata.defaultError;
        handler = handler || odata.defaultHandler;
        httpClient = httpClient || odata.defaultHttpClient;
        metadata = metadata || odata.defaultMetadata;

        // Augment the request with additional defaults.
        request.recognizeDates = defined(request.recognizeDates, odata.jsonHandler.recognizeDates);
        request.callbackParameterName = defined(request.callbackParameterName, odata.defaultHttpClient.callbackParameterName);
        request.formatQueryString = defined(request.formatQueryString, odata.defaultHttpClient.formatQueryString);
        request.enableJsonpCallback = defined(request.enableJsonpCallback, odata.defaultHttpClient.enableJsonpCallback);
        request.useJsonLight = defined(request.useJsonLight, odata.jsonHandler.enableJsonpCallback);
        request.inferJsonLightFeedAsObject = defined(request.inferJsonLightFeedAsObject, odata.jsonHandler.inferJsonLightFeedAsObject);

        // Create the base context for read/write operations, also specifying complete settings.
        var context = {
            metadata: metadata,
            recognizeDates: request.recognizeDates,
            callbackParameterName: request.callbackParameterName,
            formatQueryString: request.formatQueryString,
            enableJsonpCallback: request.enableJsonpCallback,
            useJsonLight: request.useJsonLight,
            inferJsonLightFeedAsObject: request.inferJsonLightFeedAsObject
        };

        try {
            prepareRequest(request, handler, context);
            return invokeRequest(request, success, error, handler, httpClient, context);
        } catch (err) {
        	// ##### BEGIN: MODIFIED BY SAP
            // errors in success handler for sync requests are catched here and result in error handler calls. 
        	// So here we fix this and throw that error further.
        	if (err.bIsSuccessHandlerError) {
        		throw err;
        	} else {
        		error(err);        		
        	}
        	// ##### END: MODIFIED BY SAP
        }
    };

    // Configure the batch handler to use the default handler for the batch parts.
    odata.batchHandler.partHandler = odata.defaultHandler;



    var localStorage = null;

    var domStoreDateToJSON = function () {
        /// <summary>Converts a Date object into an object representation friendly to JSON serialization.</summary>
        /// <returns type="Object">Object that represents the Date.</returns>
        /// <remarks>
        ///   This method is used to override the Date.toJSON method and is called only by
        ///   JSON.stringify.  It should never be called directly.
        /// </remarks>

        var newValue = { v: this.valueOf(), t: "[object Date]" };
        // Date objects might have extra properties on them so we save them.
        for (var name in this) {
            newValue[name] = this[name];
        }
        return newValue;
    };

    var domStoreJSONToDate = function (_, value) {
        /// <summary>JSON reviver function for converting an object representing a Date in a JSON stream to a Date object</summary>
        /// <param value="Object">Object to convert.</param>
        /// <returns type="Date">Date object.</returns>
        /// <remarks>
        ///   This method is used during JSON parsing and invoked only by the reviver function. 
        ///   It should never be called directly.
        /// </remarks>

        if (value && value.t === "[object Date]") {
            var newValue = new Date(value.v);
            for (var name in value) {
                if (name !== "t" && name !== "v") {
                    newValue[name] = value[name];
                }
            }
            value = newValue;
        }
        return value;
    };

    var qualifyDomStoreKey = function (store, key) {
        /// <summary>Qualifies the key with the name of the store.</summary>
        /// <param name="store" type="Object">Store object whose name will be used for qualifying the key.</param>
        /// <param name="key" type="String">Key string.</param>
        /// <returns type="String">Fully qualified key string.</returns>

        return store.name + "#!#" + key;
    };

    var unqualifyDomStoreKey = function (store, key) {
        /// <summary>Gets the key part of a fully qualified key string.</summary>
        /// <param name="store" type="Object">Store object whose name will be used for qualifying the key.</param>
        /// <param name="key" type="String">Fully qualified key string.</param>
        /// <returns type="String">Key part string</returns>

        return key.replace(store.name + "#!#", "");
    };

    var DomStore = function (name) {
        /// <summary>Constructor for store objects that use DOM storage as the underlying mechanism.</summary>
        /// <param name="name" type="String">Store name.</param>
        this.name = name;
    };

    DomStore.create = function (name) {
        /// <summary>Creates a store object that uses DOM Storage as its underlying mechanism.</summary>
        /// <param name="name" type="String">Store name.</param>
        /// <returns type="Object">Store object.</returns>

        if (DomStore.isSupported()) {
            localStorage = localStorage || window.localStorage;
            return new DomStore(name);
        }

        throw { message: "Web Storage not supported by the browser" };
    };

    DomStore.isSupported = function () {
        /// <summary>Checks whether the underlying mechanism for this kind of store objects is supported by the browser.</summary>
        /// <returns type="Boolean">True if the mechanism is supported by the browser; otherwise false.</summary>
        return !!window.localStorage;
    };

    DomStore.prototype.add = function (key, value, success, error) {
        /// <summary>Adds a new value identified by a key to the store.</summary>
        /// <param name="key" type="String">Key string.</param>
        /// <param name="value">Value that is going to be added to the store.</param>
        /// <param name="success" type="Function" optional="no">Callback for a successful add operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        /// <remarks>
        ///    This method errors out if the store already contains the specified key.
        /// </remarks>

        error = error || this.defaultError;
        var store = this;
        this.contains(key, function (contained) {
            if (!contained) {
                store.addOrUpdate(key, value, success, error);
            } else {
                delay(error, { message: "key already exists", key: key });
            }
        }, error);
    };

    DomStore.prototype.addOrUpdate = function (key, value, success, error) {
        /// <summary>Adds or updates a value identified by a key to the store.</summary>
        /// <param name="key" type="String">Key string.</param>
        /// <param name="value">Value that is going to be added or updated to the store.</param>
        /// <param name="success" type="Function" optional="no">Callback for a successful add or update operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        /// <remarks>
        ///   This method will overwrite the key's current value if it already exists in the store; otherwise it simply adds the new key and value.
        /// </remarks>

        error = error || this.defaultError;

        if (key instanceof Array) {
            error({ message: "Array of keys not supported" });
        } else {
            var fullKey = qualifyDomStoreKey(this, key);
            var oldDateToJSON = Date.prototype.toJSON;
            try {
                var storedValue = value;
                if (storedValue !== undefined) {
                    // Dehydrate using json
                    Date.prototype.toJSON = domStoreDateToJSON;
                    storedValue = window.JSON.stringify(value);
                }
                // Save the json string.
                localStorage.setItem(fullKey, storedValue);
                delay(success, key, value);
            }
            catch (e) {
                if (e.code === 22 || e.number === 0x8007000E) {
                    delay(error, { name: "QUOTA_EXCEEDED_ERR", error: e });
                } else {
                    delay(error, e);
                }
            }
            finally {
                Date.prototype.toJSON = oldDateToJSON;
            }
        }
    };

    DomStore.prototype.clear = function (success, error) {
        /// <summary>Removes all the data associated with this store object.</summary>
        /// <param name="success" type="Function" optional="no">Callback for a successful clear operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        /// <remarks>
        ///    In case of an error, this method will not restore any keys that might have been deleted at that point.
        /// </remarks>

        error = error || this.defaultError;
        try {
            var i = 0, len = localStorage.length;
            while (len > 0 && i < len) {
                var fullKey = localStorage.key(i);
                var key = unqualifyDomStoreKey(this, fullKey);
                if (fullKey !== key) {
                    localStorage.removeItem(fullKey);
                    len = localStorage.length;
                } else {
                    i++;
                }
            };
            delay(success);
        }
        catch (e) {
            delay(error, e);
        }
    };

    DomStore.prototype.close = function () {
        /// <summary>This function does nothing in DomStore as it does not have a connection model</summary>
    };

    DomStore.prototype.contains = function (key, success, error) {
        /// <summary>Checks whether a key exists in the store.</summary>
        /// <param name="key" type="String">Key string.</param>
        /// <param name="success" type="Function" optional="no">Callback indicating whether the store contains the key or not.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        error = error || this.defaultError;
        try {
            var fullKey = qualifyDomStoreKey(this, key);
            var value = localStorage.getItem(fullKey);
            delay(success, value !== null);
        } catch (e) {
            delay(error, e);
        }
    };

    DomStore.prototype.defaultError = throwErrorCallback;

    DomStore.prototype.getAllKeys = function (success, error) {
        /// <summary>Gets all the keys that exist in the store.</summary>
        /// <param name="success" type="Function" optional="no">Callback for a successful get operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>

        error = error || this.defaultError;

        var results = [];
        var i, len;

        try {
            for (i = 0, len = localStorage.length; i < len; i++) {
                var fullKey = localStorage.key(i);
                var key = unqualifyDomStoreKey(this, fullKey);
                if (fullKey !== key) {
                    results.push(key);
                }
            }
            delay(success, results);
        }
        catch (e) {
            delay(error, e);
        }
    };

    /// <summary>Identifies the underlying mechanism used by the store.</summary>
    DomStore.prototype.mechanism = "dom";

    DomStore.prototype.read = function (key, success, error) {
        /// <summary>Reads the value associated to a key in the store.</summary>
        /// <param name="key" type="String">Key string.</param>
        /// <param name="success" type="Function" optional="no">Callback for a successful reads operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        error = error || this.defaultError;

        if (key instanceof Array) {
            error({ message: "Array of keys not supported" });
        } else {
            try {
                var fullKey = qualifyDomStoreKey(this, key);
                var value = localStorage.getItem(fullKey);
                if (value !== null && value !== "undefined") {
                    // Hydrate using json
                    value = window.JSON.parse(value, domStoreJSONToDate);
                }
                else {
                    value = undefined;
                }
                delay(success, key, value);
            } catch (e) {
                delay(error, e);
            }
        }
    };

    DomStore.prototype.remove = function (key, success, error) {
        /// <summary>Removes a key and its value from the store.</summary>
        /// <param name="key" type="String">Key string.</param>
        /// <param name="success" type="Function" optional="no">Callback for a successful remove operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        error = error || this.defaultError;

        if (key instanceof Array) {
            error({ message: "Batches not supported" });
        } else {
            try {
                var fullKey = qualifyDomStoreKey(this, key);
                localStorage.removeItem(fullKey);
                delay(success);
            } catch (e) {
                delay(error, e);
            }
        }
    };

    DomStore.prototype.update = function (key, value, success, error) {
        /// <summary>Updates the value associated to a key in the store.</summary>
        /// <param name="key" type="String">Key string.</param>
        /// <param name="value">New value.</param>
        /// <param name="success" type="Function" optional="no">Callback for a successful update operation.</param>
        /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
        /// <remarks>
        ///    This method errors out if the specified key is not found in the store.
        /// </remarks>

        error = error || this.defaultError;
        var store = this;
        this.contains(key, function (contained) {
            if (contained) {
                store.addOrUpdate(key, value, success, error);
            } else {
                delay(error, { message: "key not found", key: key });
            }
        }, error);
    };



    var indexedDB = window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.indexedDB;
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || {};

    var IDBT_READ_ONLY = IDBTransaction.READ_ONLY || "readonly";
    var IDBT_READ_WRITE = IDBTransaction.READ_WRITE || "readwrite";

    var getError = function (error, defaultError) {
        /// <summary>Returns either a specific error handler or the default error handler</summary>
        /// <param name="error" type="Function">The specific error handler</param>
        /// <param name="defaultError" type="Function">The default error handler</param>
        /// <returns type="Function">The error callback</returns>

        return function (e) {
            var errorFunc = error || defaultError;
            if (!errorFunc) {
                return;
            }

            // Old api quota exceeded error support.
            if (Object.prototype.toString.call(e) === "[object IDBDatabaseException]") {
                if (e.code === 11 /* IndexedDb disk quota exceeded */) {
                    errorFunc({ name: "QuotaExceededError", error: e });
                    return;
                }
                errorFunc(e);
                return;
            }

            var errName;
            try {
                var errObj = e.target.error || e;
                errName = errObj.name;
            } catch (ex) {
                errName = (e.type === "blocked") ? "IndexedDBBlocked" : "UnknownError";
            }
            errorFunc({ name: errName, error: e });
        };
    };

    var openStoreDb = function (store, success, error) {
        /// <summary>Opens the store object's indexed db database.</summary>
        /// <param name="store" type="IndexedDBStore">The store object</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>

        var storeName = store.name;
        var dbName = "_datajs_" + storeName;

        var request = indexedDB.open(dbName);
        request.onblocked = error;
        request.onerror = error;

        request.onupgradeneeded = function () {
            var db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };

        request.onsuccess = function (event) {
            var db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                // Should we use the old style api to define the database schema?
                if ("setVersion" in db) {
                    var versionRequest = db.setVersion("1.0");
                    versionRequest.onsuccess = function () {
                        var transaction = versionRequest.transaction;
                        transaction.oncomplete = function () {
                            success(db);
                        };
                        db.createObjectStore(storeName, null, false);
                    };
                    versionRequest.onerror = error;
                    versionRequest.onblocked = error;
                    return;
                }

                // The database doesn't have the expected store.
                // Fabricate an error object for the event for the schema mismatch 
                // and error out.
                event.target.error = { name: "DBSchemaMismatch" };
                error(event);
                return;
            }

            db.onversionchange = function (event) {
                event.target.close();
            }
            success(db);
        };
    };

    var openTransaction = function (store, mode, success, error) {
        /// <summary>Opens a new transaction to the store</summary>
        /// <param name="store" type="IndexedDBStore">The store object</param>
        /// <param name="mode" type="Short">The read/write mode of the transaction (constants from IDBTransaction)</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>

        var storeName = store.name;
        var storeDb = store.db;
        var errorCallback = getError(error, store.defaultError);

        if (storeDb) {
            success(storeDb.transaction(storeName, mode));
            return;
        }

        openStoreDb(store, function (db) {
            store.db = db;
            success(db.transaction(storeName, mode));
        }, errorCallback);
    };

    var IndexedDBStore = function (name) {
        /// <summary>Creates a new IndexedDBStore.</summary>
        /// <param name="name" type="String">The name of the store.</param>
        /// <returns type="Object">The new IndexedDBStore.</returns>
        this.name = name;
    };

    IndexedDBStore.create = function (name) {
        /// <summary>Creates a new IndexedDBStore.</summary>
        /// <param name="name" type="String">The name of the store.</param>
        /// <returns type="Object">The new IndexedDBStore.</returns>
        if (IndexedDBStore.isSupported()) {
            return new IndexedDBStore(name);
        }

        throw { message: "IndexedDB is not supported on this browser" };
    };

    IndexedDBStore.isSupported = function () {
        /// <summary>Returns whether IndexedDB is supported.</summary>
        /// <returns type="Boolean">True if IndexedDB is supported, false otherwise.</returns>
        return !!indexedDB;
    };

    IndexedDBStore.prototype.add = function (key, value, success, error) {
        /// <summary>Adds a key/value pair to the store</summary>
        /// <param name="key" type="String">The key</param>
        /// <param name="value" type="Object">The value</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        var keys = [];
        var values = [];

        if (key instanceof Array) {
            keys = key;
            values = value;
        } else {
            keys = [key];
            values = [value];
        }

        openTransaction(this, IDBT_READ_WRITE, function (transaction) {
            transaction.onabort = getError(error, defaultError, key, "add");
            transaction.oncomplete = function () {
                if (key instanceof Array) {
                    success(keys, values);
                } else {
                    success(key, value);
                }
            };

            for (var i = 0; i < keys.length && i < values.length; i++) {
                transaction.objectStore(name).add({ v: values[i] }, keys[i]);
            }
        }, error);
    };

    IndexedDBStore.prototype.addOrUpdate = function (key, value, success, error) {
        /// <summary>Adds or updates a key/value pair in the store</summary>
        /// <param name="key" type="String">The key</param>
        /// <param name="value" type="Object">The value</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        var keys = [];
        var values = [];

        if (key instanceof Array) {
            keys = key;
            values = value;
        } else {
            keys = [key];
            values = [value];
        }

        openTransaction(this, IDBT_READ_WRITE, function (transaction) {
            transaction.onabort = getError(error, defaultError);
            transaction.oncomplete = function () {
                if (key instanceof Array) {
                    success(keys, values);
                } else {
                    success(key, value);
                }
            };

            for (var i = 0; i < keys.length && i < values.length; i++) {
                var record = { v: values[i] };
                transaction.objectStore(name).put(record, keys[i]);
            }
        }, error);
    };

    IndexedDBStore.prototype.clear = function (success, error) {
        /// <summary>Clears the store</summary>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        openTransaction(this, IDBT_READ_WRITE, function (transaction) {
            transaction.onerror = getError(error, defaultError);
            transaction.oncomplete = function () {
                success();
            };

            transaction.objectStore(name).clear();
        }, error);
    };

    IndexedDBStore.prototype.close = function () {
        /// <summary>Closes the connection to the database</summary>
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    };

    IndexedDBStore.prototype.contains = function (key, success, error) {
        /// <summary>Returns whether the store contains a key</summary>
        /// <param name="key" type="String">The key</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        openTransaction(this, IDBT_READ_ONLY, function (transaction) {
            var objectStore = transaction.objectStore(name);
            var request = objectStore["get"](key);

            transaction.oncomplete = function () {
                success(!!request.result);
            };
            transaction.onerror = getError(error, defaultError);
        }, error);
    };

    IndexedDBStore.prototype.defaultError = throwErrorCallback;

    IndexedDBStore.prototype.getAllKeys = function (success, error) {
        /// <summary>Gets all the keys from the store</summary>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        openTransaction(this, IDBT_READ_WRITE, function (transaction) {
            var results = [];

            transaction.oncomplete = function () {
                success(results);
            };

            var request = transaction.objectStore(name).openCursor();

            request.onerror = getError(error, defaultError);
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.key);
                    // Some tools have issues because continue is a javascript reserved word. 
                    cursor["continue"].call(cursor);
                }
            };
        }, error);
    };

    /// <summary>Identifies the underlying mechanism used by the store.</summary>
    IndexedDBStore.prototype.mechanism = "indexeddb";

    IndexedDBStore.prototype.read = function (key, success, error) {
        /// <summary>Reads the value for the specified key</summary>
        /// <param name="key" type="String">The key</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        /// <remarks>If the key does not exist, the success handler will be called with value = undefined</remarks>
        var name = this.name;
        var defaultError = this.defaultError;
        var keys = (key instanceof Array) ? key : [key];

        openTransaction(this, IDBT_READ_ONLY, function (transaction) {
            var values = [];

            transaction.onerror = getError(error, defaultError, key, "read");
            transaction.oncomplete = function () {
                if (key instanceof Array) {
                    success(keys, values);
                } else {
                    success(keys[0], values[0]);
                }
            };

            for (var i = 0; i < keys.length; i++) {
                // Some tools have issues because get is a javascript reserved word. 
                var objectStore = transaction.objectStore(name);
                var request = objectStore["get"].call(objectStore, keys[i]);
                request.onsuccess = function (event) {
                    var record = event.target.result;
                    values.push(record ? record.v : undefined);
                };
            }
        }, error);
    };

    IndexedDBStore.prototype.remove = function (key, success, error) {
        /// <summary>Removes the specified key from the store</summary>
        /// <param name="key" type="String">The key</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        var keys = (key instanceof Array) ? key : [key];

        openTransaction(this, IDBT_READ_WRITE, function (transaction) {
            transaction.onerror = getError(error, defaultError);
            transaction.oncomplete = function () {
                success();
            };

            for (var i = 0; i < keys.length; i++) {
                // Some tools have issues because continue is a javascript reserved word. 
                var objectStore = transaction.objectStore(name);
                objectStore["delete"].call(objectStore, keys[i]);
            }
        }, error);
    };

    IndexedDBStore.prototype.update = function (key, value, success, error) {
        /// <summary>Updates a key/value pair in the store</summary>
        /// <param name="key" type="String">The key</param>
        /// <param name="value" type="Object">The value</param>
        /// <param name="success" type="Function">The success callback</param>
        /// <param name="error" type="Function">The error callback</param>
        var name = this.name;
        var defaultError = this.defaultError;
        var keys = [];
        var values = [];

        if (key instanceof Array) {
            keys = key;
            values = value;
        } else {
            keys = [key];
            values = [value];
        }

        openTransaction(this, IDBT_READ_WRITE, function (transaction) {
            transaction.onabort = getError(error, defaultError);
            transaction.oncomplete = function () {
                if (key instanceof Array) {
                    success(keys, values);
                } else {
                    success(key, value);
                }
            };

            for (var i = 0; i < keys.length && i < values.length; i++) {
                var request = transaction.objectStore(name).openCursor(IDBKeyRange.only(keys[i]));
                var record = { v: values[i] };
                request.pair = { key: keys[i], value: record };
                request.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        cursor.update(event.target.pair.value);
                    } else {
                        transaction.abort();
                    }
                };
            }
        }, error);
    };



    var MemoryStore = function (name) {
        /// <summary>Constructor for store objects that use a sorted array as the underlying mechanism.</summary>
        /// <param name="name" type="String">Store name.</param>

        var holes = [];
        var items = [];
        var keys = {};

        this.name = name;

        var getErrorCallback = function (error) {
            return error || this.defaultError;
        };

        var validateKeyInput = function (key, error) {
            /// <summary>Validates that the specified key is not undefined, not null, and not an array</summary>
            /// <param name="key">Key value.</param>
            /// <param name="error" type="Function">Error callback.</param>
            /// <returns type="Boolean">True if the key is valid. False if the key is invalid and the error callback has been queued for execution.</returns>

            var messageString;

            if (key instanceof Array) {
                messageString = "Array of keys not supported";
            }

            if (key === undefined || key === null) {
                messageString = "Invalid key";
            }

            if (messageString) {
                delay(error, { message: messageString });
                return false;
            }
            return true;
        };

        this.add = function (key, value, success, error) {
            /// <summary>Adds a new value identified by a key to the store.</summary>
            /// <param name="key" type="String">Key string.</param>
            /// <param name="value">Value that is going to be added to the store.</param>
            /// <param name="success" type="Function" optional="no">Callback for a successful add operation.</param>
            /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
            /// <remarks>
            ///    This method errors out if the store already contains the specified key.
            /// </remarks>

            error = getErrorCallback(error);

            if (validateKeyInput(key, error)) {
                if (!keys.hasOwnProperty(key)) {
                    this.addOrUpdate(key, value, success, error);
                } else {
                    error({ message: "key already exists", key: key });
                }
            }
        };

        this.addOrUpdate = function (key, value, success, error) {
            /// <summary>Adds or updates a value identified by a key to the store.</summary>
            /// <param name="key" type="String">Key string.</param>
            /// <param name="value">Value that is going to be added or updated to the store.</param>
            /// <param name="success" type="Function" optional="no">Callback for a successful add or update operation.</param>
            /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
            /// <remarks>
            ///   This method will overwrite the key's current value if it already exists in the store; otherwise it simply adds the new key and value.
            /// </remarks>

            error = getErrorCallback(error);

            if (validateKeyInput(key, error)) {
                var index = keys[key];
                if (index === undefined) {
                    if (holes.length > 0) {
                        index = holes.splice(0, 1);
                    } else {
                        index = items.length;
                    }
                }
                items[index] = value;
                keys[key] = index;
                delay(success, key, value);
            }
        };

        this.clear = function (success) {
            /// <summary>Removes all the data associated with this store object.</summary>
            /// <param name="success" type="Function" optional="no">Callback for a successful clear operation.</param>

            items = [];
            keys = {};
            holes = [];

            delay(success);
        };

        this.contains = function (key, success) {
            /// <summary>Checks whether a key exists in the store.</summary>
            /// <param name="key" type="String">Key string.</param>
            /// <param name="success" type="Function" optional="no">Callback indicating whether the store contains the key or not.</param>

            var contained = keys.hasOwnProperty(key);
            delay(success, contained);
        };

        this.getAllKeys = function (success) {
            /// <summary>Gets all the keys that exist in the store.</summary>
            /// <param name="success" type="Function" optional="no">Callback for a successful get operation.</param>

            var results = [];
            for (var name in keys) {
                results.push(name);
            }
            delay(success, results);
        };

        this.read = function (key, success, error) {
            /// <summary>Reads the value associated to a key in the store.</summary>
            /// <param name="key" type="String">Key string.</param>
            /// <param name="success" type="Function" optional="no">Callback for a successful reads operation.</param>
            /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
            error = getErrorCallback(error);

            if (validateKeyInput(key, error)) {
                var index = keys[key];
                delay(success, key, items[index]);
            }
        };

        this.remove = function (key, success, error) {
            /// <summary>Removes a key and its value from the store.</summary>
            /// <param name="key" type="String">Key string.</param>
            /// <param name="success" type="Function" optional="no">Callback for a successful remove operation.</param>
            /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
            error = getErrorCallback(error);

            if (validateKeyInput(key, error)) {
                var index = keys[key];
                if (index !== undefined) {
                    if (index === items.length - 1) {
                        items.pop();
                    } else {
                        items[index] = undefined;
                        holes.push(index);
                    }
                    delete keys[key];

                    // The last item was removed, no need to keep track of any holes in the array.
                    if (items.length === 0) {
                        holes = [];
                    }
                }

                delay(success);
            }
        };

        this.update = function (key, value, success, error) {
            /// <summary>Updates the value associated to a key in the store.</summary>
            /// <param name="key" type="String">Key string.</param>
            /// <param name="value">New value.</param>
            /// <param name="success" type="Function" optional="no">Callback for a successful update operation.</param>
            /// <param name="error" type="Function" optional="yes">Callback for handling errors. If not specified then store.defaultError is invoked.</param>
            /// <remarks>
            ///    This method errors out if the specified key is not found in the store.
            /// </remarks>

            error = getErrorCallback(error);
            if (validateKeyInput(key, error)) {
                if (keys.hasOwnProperty(key)) {
                    this.addOrUpdate(key, value, success, error);
                } else {
                    error({ message: "key not found", key: key });
                }
            }
        };
    };

    MemoryStore.create = function (name) {
        /// <summary>Creates a store object that uses memory storage as its underlying mechanism.</summary>
        /// <param name="name" type="String">Store name.</param>
        /// <returns type="Object">Store object.</returns>
        return new MemoryStore(name);
    };

    MemoryStore.isSupported = function () {
        /// <summary>Checks whether the underlying mechanism for this kind of store objects is supported by the browser.</summary>
        /// <returns type="Boolean">True if the mechanism is supported by the browser; otherwise false.</returns>
        return true;
    };

    MemoryStore.prototype.close = function () {
        /// <summary>This function does nothing in MemoryStore as it does not have a connection model.</summary>
    };

    MemoryStore.prototype.defaultError = throwErrorCallback;

    /// <summary>Identifies the underlying mechanism used by the store.</summary>
    MemoryStore.prototype.mechanism = "memory";



    var mechanisms = {
        indexeddb: IndexedDBStore,
        dom: DomStore,
        memory: MemoryStore
    };

    datajs.defaultStoreMechanism = "best";

    datajs.createStore = function (name, mechanism) {
        /// <summary>Creates a new store object.</summary>
        /// <param name="name" type="String">Store name.</param>
        /// <param name="mechanism" type="String" optional="true">A specific mechanism to use (defaults to best, can be "best", "dom", "indexeddb", "webdb").</param>
        /// <returns type="Object">Store object.</returns>

        if (!mechanism) {
            mechanism = datajs.defaultStoreMechanism;
        }

        if (mechanism === "best") {
            mechanism = (DomStore.isSupported()) ? "dom" : "memory";
        }

        var factory = mechanisms[mechanism];
        if (factory) {
            return factory.create(name);
        }

        throw { message: "Failed to create store", name: name, mechanism: mechanism };
    };




    var appendQueryOption = function (uri, queryOption) {
        /// <summary>Appends the specified escaped query option to the specified URI.</summary>
        /// <param name="uri" type="String">URI to append option to.</param>
        /// <param name="queryOption" type="String">Escaped query option to append.</param>
        var separator = (uri.indexOf("?") >= 0) ? "&" : "?";
        return uri + separator + queryOption;
    };

    var appendSegment = function (uri, segment) {
        /// <summary>Appends the specified segment to the given URI.</summary>
        /// <param name="uri" type="String">URI to append a segment to.</param>
        /// <param name="segment" type="String">Segment to append.</param>
        /// <returns type="String">The original URI with a new segment appended.</returns>

        var index = uri.indexOf("?");
        var queryPortion = "";
        if (index >= 0) {
            queryPortion = uri.substr(index);
            uri = uri.substr(0, index);
        }

        if (uri[uri.length - 1] !== "/") {
            uri += "/";
        }
        return uri + segment + queryPortion;
    };

    var buildODataRequest = function (uri, options) {
        /// <summary>Builds a request object to GET the specified URI.</summary>
        /// <param name="uri" type="String">URI for request.</param>
        /// <param name="options" type="Object">Additional options.</param>

        // ##### BEGIN: MODIFIED BY SAP
        /*
        return {
            method: "GET",
            requestUri: uri,
            user: options.user,
            password: options.password,
            enableJsonpCallback: options.enableJsonpCallback,
            callbackParameterName: options.callbackParameterName,
            formatQueryString: options.formatQueryString
        };
        */
        return {
            method: "GET",
            requestUri: uri,
            user: options.user,
            password: options.password,
            withCredentials: options.withCredentials,
            enableJsonpCallback: options.enableJsonpCallback,
            callbackParameterName: options.callbackParameterName,
            formatQueryString: options.formatQueryString
        };
        // ##### END: MODIFIED BY SAP
    };

    var findQueryOptionStart = function (uri, name) {
        /// <summary>Finds the index where the value of a query option starts.</summary>
        /// <param name="uri" type="String">URI to search in.</param>
        /// <param name="name" type="String">Name to look for.</param>
        /// <returns type="Number">The index where the query option starts.</returns>

        var result = -1;
        var queryIndex = uri.indexOf("?");
        if (queryIndex !== -1) {
            var start = uri.indexOf("?" + name + "=", queryIndex);
            if (start === -1) {
                start = uri.indexOf("&" + name + "=", queryIndex);
            }
            if (start !== -1) {
                result = start + name.length + 2;
            }
        }
        return result;
    };

    var queryForData = function (uri, options, success, error) {
        /// <summary>Gets data from an OData service.</summary>
        /// <param name="uri" type="String">URI to the OData service.</param>
        /// <param name="options" type="Object">Object with additional well-known request options.</param>
        /// <param name="success" type="Function">Success callback.</param>
        /// <param name="error" type="Function">Error callback.</param>
        /// <returns type="Object">Object with an abort method.</returns>

        var request = queryForDataInternal(uri, options, [], success, error);
        return request;
    };

    var queryForDataInternal = function (uri, options, data, success, error) {
        /// <summary>Gets data from an OData service taking into consideration server side paging.</summary>
        /// <param name="uri" type="String">URI to the OData service.</param>
        /// <param name="options" type="Object">Object with additional well-known request options.</param>
        /// <param name="data" type="Array">Array that stores the data provided by the OData service.</param>
        /// <param name="success" type="Function">Success callback.</param>
        /// <param name="error" type="Function">Error callback.</param>
        /// <returns type="Object">Object with an abort method.</returns>

        var request = buildODataRequest(uri, options);
        var currentRequest = odata.request(request, function (newData) {
            var next = newData.__next;
            var results = newData.results;

            data = data.concat(results);

            if (next) {
                currentRequest = queryForDataInternal(next, options, data, success, error);
            } else {
                success(data);
            }
        }, error, undefined, options.httpClient, options.metadata);

        return {
            abort: function () {
                currentRequest.abort();
            }
        };
    };

    var ODataCacheSource = function (options) {
        /// <summary>Creates a data cache source object for requesting data from an OData service.</summary>
        /// <param name="options">Options for the cache data source.</param>
        /// <returns type="ODataCacheSource">A new data cache source instance.</returns>

        var that = this;
        var uri = options.source;
        
        that.identifier = normalizeURICase(encodeURI(decodeURI(uri)));
        that.options = options;

        that.count = function (success, error) {
            /// <summary>Gets the number of items in the collection.</summary>
            /// <param name="success" type="Function">Success callback with the item count.</param>
            /// <param name="error" type="Function">Error callback.</param>
            /// <returns type="Object">Request object with an abort method./<param>

            var options = that.options;
            return odata.request(
                buildODataRequest(appendSegment(uri, "$count"), options),
                function (data) {
                    var count = parseInt10(data.toString());
                    if (isNaN(count)) {
                        error({ message: "Count is NaN", count: count });
                    } else {
                        success(count);
                    }
                }, error, undefined, options.httpClient, options.metadata);
        };

        that.read = function (index, count, success, error) {
            /// <summary>Gets a number of consecutive items from the collection.</summary>
            /// <param name="index" type="Number">Zero-based index of the items to retrieve.</param>
            /// <param name="count" type="Number">Number of items to retrieve.</param>
            /// <param name="success" type="Function">Success callback with the requested items.</param>
            /// <param name="error" type="Function">Error callback.</param>
            /// <returns type="Object">Request object with an abort method./<param>

            var queryOptions = "$skip=" + index + "&$top=" + count;
            return queryForData(appendQueryOption(uri, queryOptions), that.options, success, error);
        };

        return that;
    };



    var appendPage = function (operation, page) {
        /// <summary>Appends a page's data to the operation data.</summary>
        /// <param name="operation" type="Object">Operation with (i)ndex, (c)ount and (d)ata.</param>
        /// <param name="page" type="Object">Page with (i)ndex, (c)ount and (d)ata.</param>

        var intersection = intersectRanges(operation, page);
        if (intersection) {
            var start = intersection.i - page.i;
            var end = start + (operation.c - operation.d.length);
            operation.d = operation.d.concat(page.d.slice(start, end));
        }
    };

    var intersectRanges = function (x, y) {
        /// <summary>Returns the {(i)ndex, (c)ount} range for the intersection of x and y.</summary>
        /// <param name="x" type="Object">Range with (i)ndex and (c)ount members.</param>
        /// <param name="y" type="Object">Range with (i)ndex and (c)ount members.</param>
        /// <returns type="Object">The intersection (i)ndex and (c)ount; undefined if there is no intersection.</returns>

        var xLast = x.i + x.c;
        var yLast = y.i + y.c;
        var resultIndex = (x.i > y.i) ? x.i : y.i;
        var resultLast = (xLast < yLast) ? xLast : yLast;
        var result;
        if (resultLast >= resultIndex) {
            result = { i: resultIndex, c: resultLast - resultIndex };
        }

        return result;
    };

    var checkZeroGreater = function (val, name) {
        /// <summary>Checks whether val is a defined number with value zero or greater.</summary>
        /// <param name="val" type="Number">Value to check.</param>
        /// <param name="name" type="String">Parameter name to use in exception.</param>

        if (val === undefined || typeof val !== "number") {
            throw { message: "'" + name + "' must be a number." };
        }

        if (isNaN(val) || val < 0 || !isFinite(val)) {
            throw { message: "'" + name + "' must be greater than or equal to zero." };
        }
    };

    var checkUndefinedGreaterThanZero = function (val, name) {
        /// <summary>Checks whether val is undefined or a number with value greater than zero.</summary>
        /// <param name="val" type="Number">Value to check.</param>
        /// <param name="name" type="String">Parameter name to use in exception.</param>

        if (val !== undefined) {
            if (typeof val !== "number") {
                throw { message: "'" + name + "' must be a number." };
            }

            if (isNaN(val) || val <= 0 || !isFinite(val)) {
                throw { message: "'" + name + "' must be greater than zero." };
            }
        }
    };

    var checkUndefinedOrNumber = function (val, name) {
        /// <summary>Checks whether val is undefined or a number</summary>
        /// <param name="val" type="Number">Value to check.</param>
        /// <param name="name" type="String">Parameter name to use in exception.</param>
        if (val !== undefined && (typeof val !== "number" || isNaN(val) || !isFinite(val))) {
            throw { message: "'" + name + "' must be a number." };
        }
    };

    var removeFromArray = function (arr, item) {
        /// <summary>Performs a linear search on the specified array and removes the first instance of 'item'.</summary>
        /// <param name="arr" type="Array">Array to search.</param>
        /// <param name="item">Item being sought.</param>
        /// <returns type="Boolean">Whether the item was removed.</returns>

        var i, len;
        for (i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
                return true;
            }
        }

        return false;
    };

    var estimateSize = function (obj) {
        /// <summary>Estimates the size of an object in bytes.</summary>
        /// <param name="obj" type="Object">Object to determine the size of.</param>
        /// <returns type="Integer">Estimated size of the object in bytes.</returns>
        var size = 0;
        var type = typeof obj;

        if (type === "object" && obj) {
            for (var name in obj) {
                size += name.length * 2 + estimateSize(obj[name]);
            }
        } else if (type === "string") {
            size = obj.length * 2;
        } else {
            size = 8;
        }
        return size;
    };

    var snapToPageBoundaries = function (lowIndex, highIndex, pageSize) {
        /// <summary>Snaps low and high indices into page sizes and returns a range.</summary>
        /// <param name="lowIndex" type="Number">Low index to snap to a lower value.</param>
        /// <param name="highIndex" type="Number">High index to snap to a higher value.</param>
        /// <param name="pageSize" type="Number">Page size to snap to.</param>
        /// <returns type="Object">A range with (i)ndex and (c)ount of elements.</returns>

        lowIndex = Math.floor(lowIndex / pageSize) * pageSize;
        highIndex = Math.ceil((highIndex + 1) / pageSize) * pageSize;
        return { i: lowIndex, c: highIndex - lowIndex };
    };

    // The DataCache is implemented using state machines.  The following constants are used to properly 
    // identify and label the states that these machines transition to.

    // DataCache state constants

    var CACHE_STATE_DESTROY = "destroy";
    var CACHE_STATE_IDLE = "idle";
    var CACHE_STATE_INIT = "init";
    var CACHE_STATE_READ = "read";
    var CACHE_STATE_PREFETCH = "prefetch";
    var CACHE_STATE_WRITE = "write";

    // DataCacheOperation state machine states.  
    // Transitions on operations also depend on the cache current of the cache.

    var OPERATION_STATE_CANCEL = "cancel";
    var OPERATION_STATE_END = "end";
    var OPERATION_STATE_ERROR = "error";
    var OPERATION_STATE_START = "start";
    var OPERATION_STATE_WAIT = "wait";

    // Destroy state machine states

    var DESTROY_STATE_CLEAR = "clear";

    // Read / Prefetch state machine states 

    var READ_STATE_DONE = "done";
    var READ_STATE_LOCAL = "local";
    var READ_STATE_SAVE = "save";
    var READ_STATE_SOURCE = "source";

    var DataCacheOperation = function (stateMachine, promise, isCancelable, index, count, data, pending) {
        /// <summary>Creates a new operation object.</summary>
        /// <param name="stateMachine" type="Function">State machine that describes the specific behavior of the operation.</param>
        /// <param name="promise" type ="DjsDeferred">Promise for requested values.</param>
        /// <param name="isCancelable" type ="Boolean">Whether this operation can be canceled or not.</param>
        /// <param name="index" type="Number">Index of first item requested.</param>
        /// <param name="count" type="Number">Count of items requested.</param>
        /// <param name="data" type="Array">Array with the items requested by the operation.</param>
        /// <param name="pending" type="Number">Total number of pending prefetch records.</param>
        /// <returns type="DataCacheOperation">A new data cache operation instance.</returns>

        /// <field name="p" type="DjsDeferred">Promise for requested values.</field>
        /// <field name="i" type="Number">Index of first item requested.</field>
        /// <field name="c" type="Number">Count of items requested.</field>
        /// <field name="d" type="Array">Array with the items requested by the operation.</field>
        /// <field name="s" type="Array">Current state of the operation.</field>
        /// <field name="canceled" type="Boolean">Whether the operation has been canceled.</field>
        /// <field name="pending" type="Number">Total number of pending prefetch records.</field>
        /// <field name="oncomplete" type="Function">Callback executed when the operation reaches the end state.</field>

        var stateData;
        var cacheState;
        var that = this;

        that.p = promise;
        that.i = index;
        that.c = count;
        that.d = data;
        that.s = OPERATION_STATE_START;

        that.canceled = false;
        that.pending = pending;
        that.oncomplete = null;

        that.cancel = function () {
            /// <summary>Transitions this operation to the cancel state and sets the canceled flag to true.</summary>
            /// <remarks>The function is a no-op if the operation is non-cancelable.</summary>

            if (!isCancelable) {
                return;
            }

            var state = that.s;
            if (state !== OPERATION_STATE_ERROR && state !== OPERATION_STATE_END && state !== OPERATION_STATE_CANCEL) {
                that.canceled = true;
                transition(OPERATION_STATE_CANCEL, stateData);
            }
        };

        that.complete = function () {
            /// <summary>Transitions this operation to the end state.</summary>

            transition(OPERATION_STATE_END, stateData);
        };

        that.error = function (err) {
            /// <summary>Transitions this operation to the error state.</summary>
            if (!that.canceled) {
                transition(OPERATION_STATE_ERROR, err);
            }
        };

        that.run = function (state) {
            /// <summary>Executes the operation's current state in the context of a new cache state.</summary>
            /// <param name="state" type="Object">New cache state.</param> 

            cacheState = state;
            that.transition(that.s, stateData);
        };

        that.wait = function (data) {
            /// <summary>Transitions this operation to the wait state.</summary>

            transition(OPERATION_STATE_WAIT, data);
        };

        var operationStateMachine = function (opTargetState, cacheState, data) {
            /// <summary>State machine that describes all operations common behavior.</summary>
            /// <param name="opTargetState" type="Object">Operation state to transition to.</param>
            /// <param name="cacheState" type="Object">Current cache state.</param>
            /// <param name="data" type="Object" optional="true">Additional data passed to the state.</param> 

            switch (opTargetState) {
                case OPERATION_STATE_START:
                    // Initial state of the operation. The operation will remain in this state until the cache has been fully initialized.
                    if (cacheState !== CACHE_STATE_INIT) {
                        stateMachine(that, opTargetState, cacheState, data);
                    }
                    break;

                case OPERATION_STATE_WAIT:
                    // Wait state indicating that the operation is active but waiting for an asynchronous operation to complete. 
                    stateMachine(that, opTargetState, cacheState, data);
                    break;

                case OPERATION_STATE_CANCEL:
                    // Cancel state.
                    stateMachine(that, opTargetState, cacheState, data);
                    that.fireCanceled();
                    transition(OPERATION_STATE_END);
                    break;

                case OPERATION_STATE_ERROR:
                    // Error state. Data is expected to be an object detailing the error condition.  
                    stateMachine(that, opTargetState, cacheState, data);
                    that.canceled = true;
                    that.fireRejected(data);
                    transition(OPERATION_STATE_END);
                    break;

                case OPERATION_STATE_END:
                    // Final state of the operation.
                    if (that.oncomplete) {
                        that.oncomplete(that);
                    }
                    if (!that.canceled) {
                        that.fireResolved();
                    }
                    stateMachine(that, opTargetState, cacheState, data);
                    break;

                default:
                    // Any other state is passed down to the state machine describing the operation's specific behavior.
                        stateMachine(that, opTargetState, cacheState, data);
                    break;
            }
        };

        var transition = function (state, data) {
            /// <summary>Transitions this operation to a new state.</summary>
            /// <param name="state" type="Object">State to transition the operation to.</param>
            /// <param name="data" type="Object" optional="true">Additional data passed to the state.</param> 

            that.s = state;
            stateData = data;
            operationStateMachine(state, cacheState, data);
        };

        that.transition = transition;

        return that;
    };

    DataCacheOperation.prototype.fireResolved = function () {
        /// <summary>Fires a resolved notification as necessary.</summary>

        // Fire the resolve just once.
        var p = this.p;
        if (p) {
            this.p = null;
            p.resolve(this.d);
        }
    };

    DataCacheOperation.prototype.fireRejected = function (reason) {
        /// <summary>Fires a rejected notification as necessary.</summary>

        // Fire the rejection just once.
        var p = this.p;
        if (p) {
            this.p = null;
            p.reject(reason);
        }
    };

    DataCacheOperation.prototype.fireCanceled = function () {
        /// <summary>Fires a canceled notification as necessary.</summary>

        this.fireRejected({ canceled: true, message: "Operation canceled" });
    };


    var DataCache = function (options) {
        /// <summary>Creates a data cache for a collection that is efficiently loaded on-demand.</summary>
        /// <param name="options">
        /// Options for the data cache, including name, source, pageSize,
        /// prefetchSize, cacheSize, storage mechanism, and initial prefetch and local-data handler.
        /// </param>
        /// <returns type="DataCache">A new data cache instance.</returns>

        var state = CACHE_STATE_INIT;
        var stats = { counts: 0, netReads: 0, prefetches: 0, cacheReads: 0 };

        var clearOperations = [];
        var readOperations = [];
        var prefetchOperations = [];

        var actualCacheSize = 0;                                             // Actual cache size in bytes.
        var allDataLocal = false;                                            // Whether all data is local.
        var cacheSize = undefinedDefault(options.cacheSize, 1048576);        // Requested cache size in bytes, default 1 MB.
        var collectionCount = 0;                                             // Number of elements in the server collection.
        var highestSavedPage = 0;                                            // Highest index of all the saved pages.
        var highestSavedPageSize = 0;                                        // Item count of the saved page with the highest index.
        var overflowed = cacheSize === 0;                                    // If the cache has overflowed (actualCacheSize > cacheSize or cacheSize == 0);
        var pageSize = undefinedDefault(options.pageSize, 50);               // Number of elements to store per page.
        var prefetchSize = undefinedDefault(options.prefetchSize, pageSize); // Number of elements to prefetch from the source when the cache is idling.
        var version = "1.0";
        var cacheFailure;

        var pendingOperations = 0;

        var source = options.source;
        if (typeof source === "string") {
            // Create a new cache source.
            source = new ODataCacheSource(options);
        }
        source.options = options;

        // Create a cache local store.
        var store = datajs.createStore(options.name, options.mechanism);

        var that = this;

        that.onidle = options.idle;
        that.stats = stats;

        that.count = function () {
            /// <summary>Counts the number of items in the collection.</summary>
            /// <returns type="Object">A promise with the number of items.</returns>

            if (cacheFailure) {
                throw cacheFailure;
            }

            var deferred = createDeferred();
            var canceled = false;

            if (allDataLocal) {
                delay(function () {
                    deferred.resolve(collectionCount);
                });

                return deferred.promise();
            }

            // TODO: Consider returning the local data count instead once allDataLocal flag is set to true.
            var request = source.count(function (count) {
                request = null;
                stats.counts++;
                deferred.resolve(count);
            }, function (err) {
                request = null;
                deferred.reject(extend(err, { canceled: canceled }));
            });

            return extend(deferred.promise(), {
                cancel: function () {
                    /// <summary>Aborts the count operation.</summary>
                    if (request) {
                        canceled = true;
                        request.abort();
                        request = null;
                    }
                }
            });
        };

        that.clear = function () {
            /// <summary>Cancels all running operations and clears all local data associated with this cache.</summary>
            /// <remarks>
            /// New read requests made while a clear operation is in progress will not be canceled. 
            /// Instead they will be queued for execution once the operation is completed.
            /// </remarks>
            /// <returns type="Object">A promise that has no value and can't be canceled.</returns>

            if (cacheFailure) {
                throw cacheFailure;
            }

            if (clearOperations.length === 0) {
                var deferred = createDeferred();
                var op = new DataCacheOperation(destroyStateMachine, deferred, false);
                queueAndStart(op, clearOperations);
                return deferred.promise();
            }
            return clearOperations[0].p;
        };

        that.filterForward = function (index, count, predicate) {
            /// <summary>Filters the cache data based a predicate.</summary>
            /// <param name="index" type="Number">The index of the item to start filtering forward from.</param>
            /// <param name="count" type="Number">Maximum number of items to include in the result.</param>
            /// <param name="predicate" type="Function">Callback function returning a boolean that determines whether an item should be included in the result or not.</param>
            /// <remarks>
            /// Specifying a negative count value will yield all the items in the cache that satisfy the predicate.
            /// </remarks>
            /// <returns type="DjsDeferred">A promise for an array of results.</returns>
            return filter(index, count, predicate, false);
        };

        that.filterBack = function (index, count, predicate) {
            /// <summary>Filters the cache data based a predicate.</summary>
            /// <param name="index" type="Number">The index of the item to start filtering backward from.</param>
            /// <param name="count" type="Number">Maximum number of items to include in the result.</param>
            /// <param name="predicate" type="Function">Callback function returning a boolean that determines whether an item should be included in the result or not.</param>
            /// <remarks>
            /// Specifying a negative count value will yield all the items in the cache that satisfy the predicate.
            /// </remarks>
            /// <returns type="DjsDeferred">A promise for an array of results.</returns>
            return filter(index, count, predicate, true);
        };

        that.readRange = function (index, count) {
            /// <summary>Reads a range of adjacent records.</summary>
            /// <param name="index" type="Number">Zero-based index of record range to read.</param>
            /// <param name="count" type="Number">Number of records in the range.</param>
            /// <remarks>
            /// New read requests made while a clear operation is in progress will not be canceled. 
            /// Instead they will be queued for execution once the operation is completed.
            /// </remarks>
            /// <returns type="DjsDeferred">
            /// A promise for an array of records; less records may be returned if the
            /// end of the collection is found.
            /// </returns>

            checkZeroGreater(index, "index");
            checkZeroGreater(count, "count");

            if (cacheFailure) {
                throw cacheFailure;
            }

            var deferred = createDeferred();

            // Merging read operations would be a nice optimization here.
            var op = new DataCacheOperation(readStateMachine, deferred, true, index, count, [], 0);
            queueAndStart(op, readOperations);

            return extend(deferred.promise(), {
                cancel: function () {
                    /// <summary>Aborts the readRange operation.</summary>
                    op.cancel();
                }
            });
        };

        that.ToObservable = that.toObservable = function () {
            /// <summary>Creates an Observable object that enumerates all the cache contents.</summary>
            /// <returns>A new Observable object that enumerates all the cache contents.</returns>
            if (!window.Rx || !window.Rx.Observable) {
                throw { message: "Rx library not available - include rx.js" };
            }

            if (cacheFailure) {
                throw cacheFailure;
            }

            return window.Rx.Observable.CreateWithDisposable(function (obs) {
                var disposed = false;
                var index = 0;

                var errorCallback = function (error) {
                    if (!disposed) {
                        obs.OnError(error);
                    }
                };

                var successCallback = function (data) {
                    if (!disposed) {
                        var i, len;
                        for (i = 0, len = data.length; i < len; i++) {
                            // The wrapper automatically checks for Dispose
                            // on the observer, so we don't need to check it here.
                            obs.OnNext(data[i]);
                        }

                        if (data.length < pageSize) {
                            obs.OnCompleted();
                        } else {
                            index += pageSize;
                            that.readRange(index, pageSize).then(successCallback, errorCallback);
                        }
                    }
                };

                that.readRange(index, pageSize).then(successCallback, errorCallback);

                return { Dispose: function () { disposed = true; } };
            });
        };

        var cacheFailureCallback = function (message) {
            /// <summary>Creates a function that handles a callback by setting the cache into failure mode.</summary>
            /// <param name="message" type="String">Message text.</param>
            /// <returns type="Function">Function to use as error callback.</returns>
            /// <remarks>
            /// This function will specifically handle problems with critical store resources 
            /// during cache initialization.
            /// </remarks>

            return function (error) {
                cacheFailure = { message: message, error: error };

                // Destroy any pending clear or read operations.
                // At this point there should be no prefetch operations.
                // Count operations will go through but are benign because they
                // won't interact with the store.
                var i, len;
                for (i = 0, len = readOperations.length; i < len; i++) {
                    readOperations[i].fireRejected(cacheFailure);
                }
                for (i = 0, len = clearOperations.length; i < len; i++) {
                    clearOperations[i].fireRejected(cacheFailure);
                }

                // Null out the operation arrays.
                readOperations = clearOperations = null;
            };
        };

        var changeState = function (newState) {
            /// <summary>Updates the cache's state and signals all pending operations of the change.</summary>
            /// <param name="newState" type="Object">New cache state.</param>
            /// <remarks>This method is a no-op if the cache's current state and the new state are the same.</remarks>

            if (newState !== state) {
                state = newState;
                var operations = clearOperations.concat(readOperations, prefetchOperations);
                var i, len;
                for (i = 0, len = operations.length; i < len; i++) {
                    operations[i].run(state);
                }
            }
        };

        var clearStore = function () {
            /// <summary>Removes all the data stored in the cache.</summary>
            /// <returns type="DjsDeferred">A promise with no value.</returns>

            var deferred = new DjsDeferred();
            store.clear(function () {

                // Reset the cache settings.
                actualCacheSize = 0;
                allDataLocal = false;
                collectionCount = 0;
                highestSavedPage = 0;
                highestSavedPageSize = 0;
                overflowed = cacheSize === 0;

                // version is not reset, in case there is other state in eg V1.1 that is still around.

                // Reset the cache stats.
                stats = { counts: 0, netReads: 0, prefetches: 0, cacheReads: 0 };
                that.stats = stats;

                store.close();
                deferred.resolve();
            }, function (err) {
                deferred.reject(err);
            });
            return deferred;
        };

        var dequeueOperation = function (operation) {
            /// <summary>Removes an operation from the caches queues and changes the cache state to idle.</summary>
            /// <param name="operation" type="DataCacheOperation">Operation to dequeue.</param>
            /// <remarks>This method is used as a handler for the operation's oncomplete event.</remarks>

            var removed = removeFromArray(clearOperations, operation);
            if (!removed) {
                removed = removeFromArray(readOperations, operation);
                if (!removed) {
                    removeFromArray(prefetchOperations, operation);
                }
            }

            pendingOperations--;
            changeState(CACHE_STATE_IDLE);
        };

        var fetchPage = function (start) {
            /// <summary>Requests data from the cache source.</summary>
            /// <param name="start" type="Number">Zero-based index of items to request.</param>
            /// <returns type="DjsDeferred">A promise for a page object with (i)ndex, (c)ount, (d)ata.</returns>


            var deferred = new DjsDeferred();
            var canceled = false;

            var request = source.read(start, pageSize, function (data) {
                var page = { i: start, c: data.length, d: data };
                deferred.resolve(page);
            }, function (err) {
                deferred.reject(err);
            });

            return extend(deferred, {
                cancel: function () {
                    if (request) {
                        request.abort();
                        canceled = true;
                        request = null;
                    }
                }
            });
        };

        var filter = function (index, count, predicate, backwards) {
            /// <summary>Filters the cache data based a predicate.</summary>
            /// <param name="index" type="Number">The index of the item to start filtering from.</param>
            /// <param name="count" type="Number">Maximum number of items to include in the result.</param>
            /// <param name="predicate" type="Function">Callback function returning a boolean that determines whether an item should be included in the result or not.</param>
            /// <param name="backwards" type="Boolean">True if the filtering should move backward from the specified index, falsey otherwise.</param>
            /// <remarks>
            /// Specifying a negative count value will yield all the items in the cache that satisfy the predicate.
            /// </remarks>
            /// <returns type="DjsDeferred">A promise for an array of results.</returns>
            index = parseInt10(index);
            count = parseInt10(count);

            if (isNaN(index)) {
                throw { message: "'index' must be a valid number.", index: index };
            }
            if (isNaN(count)) {
                throw { message: "'count' must be a valid number.", count: count };
            }

            if (cacheFailure) {
                throw cacheFailure;
            }

            index = Math.max(index, 0);

            var deferred = createDeferred();
            var arr = [];
            var canceled = false;
            var pendingReadRange = null;

            var readMore = function (readIndex, readCount) {
                if (!canceled) {
                    if (count >= 0 && arr.length >= count) {
                        deferred.resolve(arr);
                    } else {
                        pendingReadRange = that.readRange(readIndex, readCount).then(function (data) {
                            for (var i = 0, length = data.length; i < length && (count < 0 || arr.length < count); i++) {
                                var dataIndex = backwards ? length - i - 1 : i;
                                var item = data[dataIndex];
                                if (predicate(item)) {
                                    var element = {
                                        index: readIndex + dataIndex,
                                        item: item
                                    };

                                    backwards ? arr.unshift(element) : arr.push(element);
                                }
                            }

                            // Have we reached the end of the collection?
                            if ((!backwards && data.length < readCount) || (backwards && readIndex <= 0)) {
                                deferred.resolve(arr);
                            } else {
                                var nextIndex = backwards ? Math.max(readIndex - pageSize, 0) : readIndex + readCount;
                                readMore(nextIndex, pageSize);
                            }
                        }, function (err) {
                            deferred.reject(err);
                        });
                    }
                }
            };

            // Initially, we read from the given starting index to the next/previous page boundary
            var initialPage = snapToPageBoundaries(index, index, pageSize);
            var initialIndex = backwards ? initialPage.i : index;
            var initialCount = backwards ? index - initialPage.i + 1 : initialPage.i + initialPage.c - index;
            readMore(initialIndex, initialCount);

            return extend(deferred.promise(), {
                cancel: function () {
                    /// <summary>Aborts the filter operation</summary>
                    if (pendingReadRange) {
                        pendingReadRange.cancel();
                    }
                    canceled = true;
                }
            });
        };

        var fireOnIdle = function () {
            /// <summary>Fires an onidle event if any functions are assigned.</summary>

            if (that.onidle && pendingOperations === 0) {
                that.onidle();
            }
        };

        var prefetch = function (start) {
            /// <summary>Creates and starts a new prefetch operation.</summary>
            /// <param name="start" type="Number">Zero-based index of the items to prefetch.</param>
            /// <remarks>
            /// This method is a no-op if any of the following conditions is true:
            ///     1.- prefetchSize is 0
            ///     2.- All data has been read and stored locally in the cache.
            ///     3.- There is already an all data prefetch operation queued. 
            ///     4.- The cache has run out of available space (overflowed).
            /// <remarks>

            if (allDataLocal || prefetchSize === 0 || overflowed) {
                return;
            }


            if (prefetchOperations.length === 0 || (prefetchOperations[0] && prefetchOperations[0].c !== -1)) {
                // Merging prefetch operations would be a nice optimization here. 
                var op = new DataCacheOperation(prefetchStateMachine, null, true, start, prefetchSize, null, prefetchSize);
                queueAndStart(op, prefetchOperations);
            }
        };

        var queueAndStart = function (op, queue) {
            /// <summary>Queues an operation and runs it.</summary>
            /// <param name="op" type="DataCacheOperation">Operation to queue.</param>
            /// <param name="queue" type="Array">Array that will store the operation.</param>

            op.oncomplete = dequeueOperation;
            queue.push(op);
            pendingOperations++;
            op.run(state);
        };

        var readPage = function (key) {
            /// <summary>Requests a page from the cache local store.</summary>
            /// <param name="key" type="Number">Zero-based index of the reuqested page.</param>
            /// <returns type="DjsDeferred">A promise for a found flag and page object with (i)ndex, (c)ount, (d)ata, and (t)icks.</returns>


            var canceled = false;
            var deferred = extend(new DjsDeferred(), {
                cancel: function () {
                    /// <summary>Aborts the readPage operation.</summary>
                    canceled = true;
                }
            });

            var error = storeFailureCallback(deferred, "Read page from store failure");

            store.contains(key, function (contained) {
                if (canceled) {
                    return;
                }
                if (contained) {
                    store.read(key, function (_, data) {
                        if (!canceled) {
                            deferred.resolve(data !== undefined, data);
                        }
                    }, error);
                    return;
                }
                deferred.resolve(false);
            }, error);
            return deferred;
        };

        var savePage = function (key, page) {
            /// <summary>Saves a page to the cache local store.</summary>
            /// <param name="key" type="Number">Zero-based index of the requested page.</param>
            /// <param name="page" type="Object">Object with (i)ndex, (c)ount, (d)ata, and (t)icks.</param>
            /// <returns type="DjsDeferred">A promise with no value.</returns>


            var canceled = false;

            var deferred = extend(new DjsDeferred(), {
                cancel: function () {
                    /// <summary>Aborts the readPage operation.</summary>
                    canceled = true;
                }
            });

            var error = storeFailureCallback(deferred, "Save page to store failure");

            var resolve = function () {
                deferred.resolve(true);
            };

            if (page.c > 0) {
                var pageBytes = estimateSize(page);
                overflowed = cacheSize >= 0 && cacheSize < actualCacheSize + pageBytes;

                if (!overflowed) {
                    store.addOrUpdate(key, page, function () {
                        updateSettings(page, pageBytes);
                        saveSettings(resolve, error);
                    }, error);
                } else {
                    resolve();
                }
            } else {
                updateSettings(page, 0);
                saveSettings(resolve, error);
            }
            return deferred;
        };

        var saveSettings = function (success, error) {
            /// <summary>Saves the cache's current settings to the local store.</summary>
            /// <param name="success" type="Function">Success callback.</param>
            /// <param name="error" type="Function">Errror callback.</param>

            var settings = {
                actualCacheSize: actualCacheSize,
                allDataLocal: allDataLocal,
                cacheSize: cacheSize,
                collectionCount: collectionCount,
                highestSavedPage: highestSavedPage,
                highestSavedPageSize: highestSavedPageSize,
                pageSize: pageSize,
                sourceId: source.identifier,
                version: version
            };

            store.addOrUpdate("__settings", settings, success, error);
        };

        var storeFailureCallback = function (deferred/*, message*/) {
            /// <summary>Creates a function that handles a store error.</summary>
            /// <param name="deferred" type="DjsDeferred">Deferred object to resolve.</param>
            /// <param name="message" type="String">Message text.</param>
            /// <returns type="Function">Function to use as error callback.</returns>
            /// <remarks>
            /// This function will specifically handle problems when interacting with the store. 
            /// </remarks>

            return function (/*error*/) {
                // var console = window.console;
                // if (console && console.log) {
                //    console.log(message);
                //    console.dir(error);
                // }
                deferred.resolve(false);
            };
        };

        var updateSettings = function (page, pageBytes) {
            /// <summary>Updates the cache's settings based on a page object.</summary>
            /// <param name="page" type="Object">Object with (i)ndex, (c)ount, (d)ata.</param>
            /// <param name="pageBytes" type="Number">Size of the page in bytes.</param>

            var pageCount = page.c;
            var pageIndex = page.i;

            // Detect the collection size.
            if (pageCount === 0) {
                if (highestSavedPage === pageIndex - pageSize) {
                    collectionCount = highestSavedPage + highestSavedPageSize;
                }
            } else {
                highestSavedPage = Math.max(highestSavedPage, pageIndex);
                if (highestSavedPage === pageIndex) {
                    highestSavedPageSize = pageCount;
                }
                actualCacheSize += pageBytes;
                if (pageCount < pageSize && !collectionCount) {
                    collectionCount = pageIndex + pageCount;
                }
            }

            // Detect the end of the collection.
            if (!allDataLocal && collectionCount === highestSavedPage + highestSavedPageSize) {
                allDataLocal = true;
            }
        };

        var cancelStateMachine = function (operation, opTargetState, cacheState, data) {
            /// <summary>State machine describing the behavior for cancelling a read or prefetch operation.</summary>
            /// <param name="operation" type="DataCacheOperation">Operation being run.</param>
            /// <param name="opTargetState" type="Object">Operation state to transition to.</param>
            /// <param name="cacheState" type="Object">Current cache state.</param>
            /// <param name="data" type="Object" optional="true">Additional data passed to the state.</param> 
            /// <remarks>
            /// This state machine contains behavior common to read and prefetch operations.
            /// </remarks>

            var canceled = operation.canceled && opTargetState !== OPERATION_STATE_END;
            if (canceled) {
                if (opTargetState === OPERATION_STATE_CANCEL) {
                    // Cancel state.
                    // Data is expected to be any pending request made to the cache.
                    if (data && data.cancel) {
                        data.cancel();
                    }
                }
            }
            return canceled;
        };

        var destroyStateMachine = function (operation, opTargetState, cacheState) {
            /// <summary>State machine describing the behavior of a clear operation.</summary>
            /// <param name="operation" type="DataCacheOperation">Operation being run.</param>
            /// <param name="opTargetState" type="Object">Operation state to transition to.</param>
            /// <param name="cacheState" type="Object">Current cache state.</param>
            /// <remarks>
            /// Clear operations have the highest priority and can't be interrupted by other operations; however, 
            /// they will preempt any other operation currently executing.
            /// </remarks>

            var transition = operation.transition;

            // Signal the cache that a clear operation is running.
            if (cacheState !== CACHE_STATE_DESTROY) {
                changeState(CACHE_STATE_DESTROY);
                return true;
            }

            switch (opTargetState) {
                case OPERATION_STATE_START:
                    // Initial state of the operation.
                    transition(DESTROY_STATE_CLEAR);
                    break;

                case OPERATION_STATE_END:
                    // State that signals the operation is done.
                    fireOnIdle();
                    break;

                case DESTROY_STATE_CLEAR:
                    // State that clears all the local data of the cache.
                    clearStore().then(function () {
                        // Terminate the operation once the local store has been cleared.
                        operation.complete();
                    });
                    // Wait until the clear request completes.
                    operation.wait();
                    break;

                default:
                    return false;
            }
            return true;
        };

        var prefetchStateMachine = function (operation, opTargetState, cacheState, data) {
            /// <summary>State machine describing the behavior of a prefetch operation.</summary>
            /// <param name="operation" type="DataCacheOperation">Operation being run.</param>
            /// <param name="opTargetState" type="Object">Operation state to transition to.</param>
            /// <param name="cacheState" type="Object">Current cache state.</param>
            /// <param name="data" type="Object" optional="true">Additional data passed to the state.</param> 
            /// <remarks>
            /// Prefetch operations have the lowest priority and will be interrupted by operations of 
            /// other kinds. A preempted prefetch operation will resume its execution only when the state 
            /// of the cache returns to idle.
            /// 
            /// If a clear operation starts executing then all the prefetch operations are canceled, 
            /// even if they haven't started executing yet.
            /// </remarks>

            // Handle cancelation
            if (!cancelStateMachine(operation, opTargetState, cacheState, data)) {

                var transition = operation.transition;

                // Handle preemption 
                if (cacheState !== CACHE_STATE_PREFETCH) {
                    if (cacheState === CACHE_STATE_DESTROY) {
                        if (opTargetState !== OPERATION_STATE_CANCEL) {
                            operation.cancel();
                        }
                    } else if (cacheState === CACHE_STATE_IDLE) {
                        // Signal the cache that a prefetch operation is running.
                        changeState(CACHE_STATE_PREFETCH);
                    }
                    return true;
                }

                switch (opTargetState) {
                    case OPERATION_STATE_START:
                        // Initial state of the operation.
                        if (prefetchOperations[0] === operation) {
                            transition(READ_STATE_LOCAL, operation.i);
                        }
                        break;

                    case READ_STATE_DONE:
                        // State that determines if the operation can be resolved or has to
                        // continue processing.
                        // Data is expected to be the read page.
                        var pending = operation.pending;

                        if (pending > 0) {
                            pending -= Math.min(pending, data.c);
                        }

                        // Are we done, or has all the data been stored?
                        if (allDataLocal || pending === 0 || data.c < pageSize || overflowed) {
                            operation.complete();
                        } else {
                            // Continue processing the operation.
                            operation.pending = pending;
                            transition(READ_STATE_LOCAL, data.i + pageSize);
                        }
                        break;

                    default:
                        return readSaveStateMachine(operation, opTargetState, cacheState, data, true);
                }
            }
            return true;
        };

        var readStateMachine = function (operation, opTargetState, cacheState, data) {
            /// <summary>State machine describing the behavior of a read operation.</summary>
            /// <param name="operation" type="DataCacheOperation">Operation being run.</param>
            /// <param name="opTargetState" type="Object">Operation state to transition to.</param>
            /// <param name="cacheState" type="Object">Current cache state.</param>
            /// <param name="data" type="Object" optional="true">Additional data passed to the state.</param> 
            /// <remarks>
            /// Read operations have a higher priority than prefetch operations, but lower than 
            /// clear operations. They will preempt any prefetch operation currently running 
            /// but will be interrupted by a clear operation.
            /// 
            /// If a clear operation starts executing then all the currently running 
            /// read operations are canceled. Read operations that haven't started yet will 
            /// wait in the start state until the destory operation finishes. 
            /// </remarks>

            // Handle cancelation
            if (!cancelStateMachine(operation, opTargetState, cacheState, data)) {

                var transition = operation.transition;

                // Handle preemption
                if (cacheState !== CACHE_STATE_READ && opTargetState !== OPERATION_STATE_START) {
                    if (cacheState === CACHE_STATE_DESTROY) {
                        if (opTargetState !== OPERATION_STATE_START) {
                            operation.cancel();
                        }
                    } else if (cacheState !== CACHE_STATE_WRITE) {
                        // Signal the cache that a read operation is running.
                        changeState(CACHE_STATE_READ);
                    }

                    return true;
                }

                switch (opTargetState) {
                    case OPERATION_STATE_START:
                        // Initial state of the operation.
                        // Wait until the cache is idle or prefetching.
                        if (cacheState === CACHE_STATE_IDLE || cacheState === CACHE_STATE_PREFETCH) {
                            // Signal the cache that a read operation is running.
                            changeState(CACHE_STATE_READ);
                            if (operation.c > 0) {
                                // Snap the requested range to a page boundary.
                                var range = snapToPageBoundaries(operation.i, operation.c, pageSize);
                                transition(READ_STATE_LOCAL, range.i);
                            } else {
                                transition(READ_STATE_DONE, operation);
                            }
                        }
                        break;

                    case READ_STATE_DONE:
                        // State that determines if the operation can be resolved or has to
                        // continue processing.
                        // Data is expected to be the read page.
                        appendPage(operation, data);
                        var len = operation.d.length;
                        // Are we done?
                        if (operation.c === len || data.c < pageSize) {
                            // Update the stats, request for a prefetch operation.
                            stats.cacheReads++;
                            prefetch(data.i + data.c);
                            // Terminate the operation.
                            operation.complete();
                        } else {
                            // Continue processing the operation.
                            transition(READ_STATE_LOCAL, data.i + pageSize);
                        }
                        break;

                    default:
                        return readSaveStateMachine(operation, opTargetState, cacheState, data, false);
                }
            }

            return true;
        };

        var readSaveStateMachine = function (operation, opTargetState, cacheState, data, isPrefetch) {
            /// <summary>State machine describing the behavior for reading and saving data into the cache.</summary>
            /// <param name="operation" type="DataCacheOperation">Operation being run.</param>
            /// <param name="opTargetState" type="Object">Operation state to transition to.</param>
            /// <param name="cacheState" type="Object">Current cache state.</param>
            /// <param name="data" type="Object" optional="true">Additional data passed to the state.</param> 
            /// <param name="isPrefetch" type="Boolean">Flag indicating whether a read (false) or prefetch (true) operation is running.
            /// <remarks>
            /// This state machine contains behavior common to read and prefetch operations.
            /// </remarks>

            var error = operation.error;
            var transition = operation.transition;
            var wait = operation.wait;
            var request;

            switch (opTargetState) {
                case OPERATION_STATE_END:
                    // State that signals the operation is done.
                    fireOnIdle();
                    break;

                case READ_STATE_LOCAL:
                    // State that requests for a page from the local store.
                    // Data is expected to be the index of the page to request.
                    request = readPage(data).then(function (found, page) {
                        // Signal the cache that a read operation is running.
                        if (!operation.canceled) {
                            if (found) {
                                // The page is in the local store, check if the operation can be resolved.
                                transition(READ_STATE_DONE, page);
                            } else {
                                // The page is not in the local store, request it from the source.
                                transition(READ_STATE_SOURCE, data);
                            }
                        }
                    });
                    break;

                case READ_STATE_SOURCE:
                    // State that requests for a page from the cache source.
                    // Data is expected to be the index of the page to request.
                    request = fetchPage(data).then(function (page) {
                        // Signal the cache that a read operation is running.
                        if (!operation.canceled) {
                            // Update the stats and save the page to the local store.
                            if (isPrefetch) {
                                stats.prefetches++;
                            } else {
                                stats.netReads++;
                            }
                            transition(READ_STATE_SAVE, page);
                        }
                    }, error);
                    break;

                case READ_STATE_SAVE:
                    // State that saves a  page to the local store.
                    // Data is expected to be the page to save.
                    // Write access to the store is exclusive.
                    if (cacheState !== CACHE_STATE_WRITE) {
                        changeState(CACHE_STATE_WRITE);
                        request = savePage(data.i, data).then(function (saved) {
                            if (!operation.canceled) {
                                if (!saved && isPrefetch) {
                                    operation.pending = 0;
                                }
                                // Check if the operation can be resolved.
                                transition(READ_STATE_DONE, data);
                            }
                            changeState(CACHE_STATE_IDLE);
                        });
                    }
                    break;

                default:
                    // Unknown state that can't be handled by this state machine.
                    return false;
            }

            if (request) {
                // The operation might have been canceled between stack frames do to the async calls.  
                if (operation.canceled) {
                    request.cancel();
                } else if (operation.s === opTargetState) {
                    // Wait for the request to complete.
                    wait(request);
                }
            }

            return true;
        };

        // Initialize the cache.
        store.read("__settings", function (_, settings) {
            if (assigned(settings)) {
                var settingsVersion = settings.version;
                if (!settingsVersion || settingsVersion.indexOf("1.") !== 0) {
                    cacheFailureCallback("Unsupported cache store version " + settingsVersion)();
                    return;
                }

                if (pageSize !== settings.pageSize || source.identifier !== settings.sourceId) {
                    // The shape or the source of the data was changed so invalidate the store.
                    clearStore().then(function () {
                        // Signal the cache is fully initialized.
                        changeState(CACHE_STATE_IDLE);
                    }, cacheFailureCallback("Unable to clear store during initialization"));
                } else {
                    // Restore the saved settings.
                    actualCacheSize = settings.actualCacheSize;
                    allDataLocal = settings.allDataLocal;
                    cacheSize = settings.cacheSize;
                    collectionCount = settings.collectionCount;
                    highestSavedPage = settings.highestSavedPage;
                    highestSavedPageSize = settings.highestSavedPageSize;
                    version = settingsVersion;

                    // Signal the cache is fully initialized.
                    changeState(CACHE_STATE_IDLE);
                }
            } else {
                // This is a brand new cache.
                saveSettings(function () {
                    // Signal the cache is fully initialized.
                    changeState(CACHE_STATE_IDLE);
                }, cacheFailureCallback("Unable to write settings during initialization."));
            }
        }, cacheFailureCallback("Unable to read settings from store."));

        return that;
    };

    datajs.createDataCache = function (options) {
        /// <summary>Creates a data cache for a collection that is efficiently loaded on-demand.</summary>
        /// <param name="options">
        /// Options for the data cache, including name, source, pageSize,
        /// prefetchSize, cacheSize, storage mechanism, and initial prefetch and local-data handler.
        /// </param>
        /// <returns type="DataCache">A new data cache instance.</returns>
        checkUndefinedGreaterThanZero(options.pageSize, "pageSize");
        checkUndefinedOrNumber(options.cacheSize, "cacheSize");
        checkUndefinedOrNumber(options.prefetchSize, "prefetchSize");

        if (!assigned(options.name)) {
            throw { message: "Undefined or null name", options: options };
        }

        if (!assigned(options.source)) {
            throw { message: "Undefined source", options: options };
        }

        return new DataCache(options);
    };



// ##### BEGIN: MODIFIED BY SAP
})(window);
// ##### END: MODIFIED BY SAP
