/*
 * Based on dotnetwise's https://github.com/DotNetWise/VS2012-Javascript-Intellisense
 */
(function () {
    var LOG = true,
        requireDefine = window.define;

    function log() {
        if (LOG) {
            var msg = Array.prototype.slice.call(arguments)
                .map(function (m) {
                    return typeof m === 'string' ? m : JSON.stringify(m);
                })
                .join(' ');
            intellisense.logMessage(msg);
        }
    }

    window.define = function (name, deps, callback) {
        //log('`define` is called with name ', name, deps);

        if (typeof name !== 'string') {
            callback = deps;
            deps = name;
            //log('`defined` fake name ', name);
        }

        window.require(deps, function () {
            try {
                var result = callback.apply(null, arguments);
                if (typeof result === 'function') {
                    result();
                }
            } catch (e) {
                //log('callback error ', e);
            }
        });
    }

    window.requirejs.onError = function (e) {
        var modules = e.requireModules && e.requireModules.join(',');
        log(e.requireType, modules, e.toString());
    };

    intellisense.annotate(window, {
        define: function () {
            /// <signature>
            ///     <summary>Defines a named module, with optional dependencies, whose value is determined by executing a callback.</summary>
            ///     <param name="name" type="String">The name of the module</param>
            ///     <param name="deps" type="Array" elementType="String" optional="true">An array of modules that this module depends on</param>
            ///     <param name="callback" type="Function">The callback that will be called when your module is asked to produce a value</param>
            /// </signature>
            /// <signature>
            ///     <summary>Defines an anonymous module, with no dependencies, whose value is determined by executing a callback.</summary>
            ///     <param name="callback" type="Function">The callback that will be called when your module is asked to produce a value</param>
            /// </signature>
            /// <signature>
            ///     <summary>Defines an anonymous module, with no dependencies, whose value is an object literal.</summary>
            ///     <param name="value" type="Object">The object literal that represents the value of this module</param>
            /// </signature>
        },
        require: function () {
            /// <signature>
            ///     <summary>Defines a callback function that will be triggered after a set of dependency modules have been evaluated</summary>
            ///     <param name="deps" type="Array" elementType="String"></param>
            ///     <param name="callback" type="Function"></param>
            /// </signature>
        }
    });

    // so Intellisense will use the previously defined annotations
    intellisense.redirectDefinition(window.define, requireDefine);

    //export this so we can 'auto create' classes for triggering VS2012 Intellisense
    //Usage: WAssert(window.intellisense && function() { /*doSomething in VS2012 to help intellisense*/ }) this way will ensure this code won't get into the .min file. You need to uncomment WAssert and String.format from NamespacesAndEnumSupport.js
    var reservedKeywords = {};
    ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally',
	 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try',
	 'typeof', 'var', 'void', 'while', 'with', 'class', 'enum', 'export', 'extends', 'import', 'super',
	 'implements', 'interface', 'let', 'package', 'private', 'protected', 'public', 'static', 'yield'
    ].forEach(function (keyword) {
        reservedKeywords[keyword] = 1;
    });
    window.intellisense && intellisense.addEventListener('statementcompletion', function (e) {
        e.items.forEach(function (item) {
            var value = item.value,
				parentObject = item.parentObject,
				kind = item.kind;
            if (value && typeof value.__glyph === "string") {
                item.glyph = value.__glyph.index(":") >= 0 ? value.__glyph : "vs:" + value.__glyph;
            }
            else if (typeof value === "number") {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupValueType';
            } else if (typeof value === "string") {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupType';
            } else if (typeof value === "boolean") {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupUnion';
            } else if (value instanceof RegExp) {
                item.kind = "field";
                item.glyph = 'vs:GlyphAssembly';
            }
            else if (value && (value._isNamespace || value.__namespace)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupNamespace';
            }
            else if (value && (value._isClass || value.__class)) {
                item.kind = "method";
                item.glyph = 'vs:GlyphGroupClass';
            }
            else if (value && (value._isConst || value.__const)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupConst';
            }
            else if (value && (value._isDelegate || value.__delegate)) {
                item.kind = "method";
                item.glyph = 'vs:GlyphGroupDelegate';
            }
            else if (value && (value._isInterface || value.__interface)) {
                //item.value && item.value.__interface && intellisense.logMessage(item.name + " is interface " + item.kind + ", scope: " + item.scope);
                item.glyph = 'vs:GlyphGroupInterface';
            }
            else if ((value && (value._isEvent || value.__event || (value instanceof window.Event) === true))
				|| item.name.indexOf("on") === 0) {
                //TODO: better handling events
                item.kind = "method";
                item.glyph = 'vs:GlyphGroupEvent';
            }
            else if (value && (value._isEnum || value.__enum)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupEnum';
            }
            else if (value && (value._isMap || value.__map)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupMap';
            }
            else if (value && (value._isObservableComputed || value.__observableComputed || value._isComputed || value.__computed)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupOperator';
            }
            else if (value && (value._isObservableArray || value.__observableArray)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphGroupTemplate';
            }
            else if (value && (value._isObservable || value.__observable)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphXmlItem';
            }
            else if (value && (value.prototype && value.prototype.nodeType || value.nodeType)) {
                item.kind = "field";
                item.glyph = 'vs:GlyphXmlItem';
            }
            else if (value === window.document || item.name === "document") {
                item.kind = "field";
                item.glyph = 'vs:GlyphLibrary';
            }
            else if (value === window) {
                item.kind = "field";
                item.glyph = 'vs:GlyphXmlNamespace';
            }
            else if (item.name === "constructor" && typeof item.value === "function" || item.name[0].toUpperCase() == item.name[0] && item.name !== "Math" && item.__class !== false) {
                item.glyph = 'vs:GlyphGroupClass';
                item.kind = "method";
            }
            else if (item.__module || item._isModule || item.name === "prototype" || parentObject && item.value == parentObject.prototype && parentObject.prototype) {
                item.glyph = 'vs:GlyphGroupModule';
            }
            else if (parentObject && !parentObject.hasOwnProperty(item.name) && item.value === Object.prototype[item.name]) {

                item.kind = "field";
                //intellisense.logMessage("On Object prototype: " + item.name + ": " + parentObject.hasOwnProperty(item.name).toString() + typeof value);
                if (typeof value === "function") {
                    item.glyph = "vs:GlyphReference";
                    item.kind = "method";
                }
                else item.glyph = "vs:GlyphGroupTypedef";
            }
            else if (parentObject && !parentObject.hasOwnProperty(item.name)) {

                item.kind = "field";
                //intellisense.logMessage((item.value === Object.getPrototypeOf(parentObject)[item.name]).toString()+" -- On prototype: " + item.name + ": " + parentObject.hasOwnProperty(item.name).toString() + typeof value);
                if (typeof value === "function") {
                    item.kind = "method";
                    var __proto__ = Object.getPrototypeOf(parentObject);
                    if (item.value === __proto__[item.name] && __proto__.hasOwnProperty(item.name))
                        item.glyph = "vs:GlyphGroupDelegate";
                    else item.glyph = "vs:GlyphExtensionMethod";
                }
                else item.glyph = "vs:GlyphGroupTypedef";
            }
            else if (typeof value === "function") {
                item.kind = "method";
                item.glyph = 'vs:GlyphGroupMethod';
            } else if (value === null) {
                item.kind = "field";
                item.glyph = 'vs:GlyphJSharpDocument';
            } else if (typeof value === "undefined") {
                if (!reservedKeywords[item.name]) {
                    if (!parentObject)
                        if (item.name === "null")
                            item.glyph = "vs:GlyphJSharpDocument";
                        else if (item.name === "true" || item.name === "false")
                            item.glyph = "vs:GlyphGroupUnion";
                        else item.glyph = 'vs:GlyphMaybeReference';
                    else item.glyph = 'vs:GlyphMaybeReference';
                }
            }
            else if (parentObject && (parentObject._isNamespace || parentObject.__namespace)) {
                //The item is a member of a namespace. 

                //All constructor functions that are part of a namespace 
                //are considered classes. 
                //A constructor function starts with
                //an uppercase letter by convention.  
                if (typeof value == 'function' && (item.name[0].toUpperCase() == item.name[0]) && !titem.__class !== false) {
                    item.glyph = 'vs:GlyphGroupClass';
                }
            }

        });
        e.items = e.items.filter(function (item) {
            if (item.value && item.value.__hidden)
                return false;
            var parentObject = item.parentObject;
            var hidden = parentObject
				? (parentObject.__enum || parentObject._isEnum)
					? item.kind != "field"
					: false
				: false;
            if (parentObject && (parentObject.__namespace || parentObject._isNamespace)) {
                //intellisense.logMessage("Hiding: " + item.name);
                hidden = Object.prototype.hasOwnProperty(item.name) && !parentObject.hasOwnProperty(item.name);
            }
            return !hidden;
        });
    });

    window.intellisense && intellisense.addEventListener('statementcompletionhint', function (e) {
        if (e.completionvalue) {
            //intellisense.logMessage("statementcompletionhint");
            if (e.completionvalue._isNamespace || e.completionvalue.__namespace) {
                e.symbolHelp.symbolDisplayType = 'Namespace';
            }
            if (e.completionvalue._isInterface || e.completionvalue.__interface) {
                //item.value && item.value.__interface && intellisense.logMessage(item.name + " Interface");
                e.symbolHelp.symbolDisplayType = 'Interface';
            }
            if (e.completionvalue._isClass || e.completionvalue.__class) {
                e.symbolHelp.symbolDisplayType = 'Class';
            }
            if (e.completionvalue._isMap || e.completionvalue.__map) {
                e.symbolHelp.symbolDisplayType = 'Map';
            }
            if (e.completionvalue._isEnum || e.completionvalue.__enum) {
                e.symbolHelp.symbolDisplayType = 'Enum';
            }
        }
    });
})();

//  vs:GlyphArrow					Describes arrow symbols.
//  vs:GlyphAssembly					Describes symbols for assemblies.
//  vs:GlyphBscFile					Describes symbols for BSC files.
//  vs:GlyphCallersGraph				Describes symbols for callers graphs.
//  vs:GlyphCallGraph					Describes symbols for call graphs.
//  vs:GlyphClosedFolder				Describes symbols for closed folders.
//  vs:GlyphCoolProject				Describes symbols for C# projects.
//  vs:GlyphCppProject				Describes symbols for C++ projects.
//  vs:GlyphCSharpExpansion			Describes symbols for C# expansions.
//  vs:GlyphCSharpFile				Describes symbols for C# files.
//  vs:GlyphDialogId					Describes symbols for dialog identifiers.
//  vs:GlyphExtensionMethod			Describes symbols for extension methods.
//  vs:GlyphExtensionMethodFriend		Describes symbols for friend extension methods.
//  vs:GlyphExtensionMethodInternal		Describes symbols for internal extension methods.
//  vs:GlyphExtensionMethodPrivate		Describes symbols for private extension methods.
//  vs:GlyphExtensionMethodProtected		Describes symbols for protected extension methods.
//  vs:GlyphExtensionMethodShortcut		Describes symbols for extension method shortcuts.
//  vs:GlyphForwardType				Describes symbols for forwarded types.
//  vs:GlyphGroupClass				Describes symbols for classes.
//  vs:GlyphGroupConstant				Describes symbols for constants.
//  vs:GlyphGroupDelegate				Describes symbols for delegates.
//  vs:GlyphGroupEnum				Describes symbols for enumerations.
//  vs:GlyphGroupEnumMember			Describes symbols for enumeration members.
//  vs:GlyphGroupError				Describes symbols for errors.
//  vs:GlyphGroupEvent				Describes symbols for events.
//  vs:GlyphGroupException				Describes symbols for exceptions.
//  vs:GlyphGroupField				Describes symbols for fields.
//  vs:GlyphGroupInterface				Describes symbols for interfaces.
//  vs:GlyphGroupIntrinsic				Describes intrinsic symbols.
//  vs:GlyphGroupJSharpClass			Describes symbols for J# classes.
//  vs:GlyphGroupJSharpField			Describes symbols for J# fields.
//  vs:GlyphGroupJSharpInterface			Describes symbols for J# interfaces.
//  vs:GlyphGroupJSharpMethod			Describes symbols for J# methods.
//  vs:GlyphGroupJSharpNamespace		Describes symbols for J# namespaces.
//  vs:GlyphGroupMacro				Describes symbols for macros.
//  vs:GlyphGroupMap				Describes symbols for maps.
//  vs:GlyphGroupMapItem				Describes symbols for map items.
//  vs:GlyphGroupMethod				Describes symbols for methods.
//  vs:GlyphGroupModule				Describes symbols for modules.
//  vs:GlyphGroupNamespace			Describes symbols for namespaces.
//  vs:GlyphGroupOperator				Describes symbols for operators.
//  vs:GlyphGroupOverload				Describes symbols for overloads.
//  vs:GlyphGroupProperty				Describes symbols for properties.
//  vs:GlyphGroupStruct				Describes symbols for structures.
//  vs:GlyphGroupTemplate				Describes symbols for templates.
//  vs:GlyphGroupType				Describes symbols for types.
//  vs:GlyphGroupTypedef				Describes symbols for typedefs.
//  vs:GlyphGroupUnion				Describes symbols for unions.
//  vs:GlyphGroupUnknown				Describes symbols for unknown types.
//  vs:GlyphGroupValueType			Describes symbols for value types.
//  vs:GlyphGroupVariable				Describes symbols for variables.
//  vs:GlyphInformation				Describes symbols for information.
//  vs:GlyphJSharpDocument			Describes symbols for J# documents.
//  vs:GlyphJSharpProject				Describes symbols for J# projects.
//  vs:GlyphKeyword					Describes symbols for keywords.
//  vs:GlyphLibrary					Describes symbols for libraries.
//  vs:GlyphMaybeCall				Describes symbols for something that may be a call.
//  vs:GlyphMaybeCaller				Describes symbols for something that may be a caller.
//  vs:GlyphMaybeReference			Describes symbols for something that may be a reference.
//  vs:GlyphOpenFolder				Describes symbols for open folders.
//  vs:GlyphRecursion					Describes symbols for recursion.
//  vs:GlyphReference					Describes symbols for references.
//  vs:GlyphVBProject					Describes symbols for VB projects.
//  vs:GlyphWarning					Describes symbols for build warnings.
//  vs:GlyphXmlAttribute				Describes symbols for XML attributes.
//  vs:GlyphXmlAttributeCheck			Describes symbols with a check mark for XML attributes.
//  vs:GlyphXmlAttributeQuestion			Describes symbols with a question mark for XML attributes.
//  vs:GlyphXmlChild					Describes symbols for child XML elements.
//  vs:GlyphXmlChildCheck				Describes symbols with a check mark for XML child elements.
//  vs:GlyphXmlChildQuestion			Describes symbols with a question mark for XML child elements.
//  vs:GlyphXmlDescendant				Describes symbols for descendant XML elements.
//  vs:GlyphXmlDescendantCheck		Describes symbols with a check mark for XML descendant elements.
//  vs:GlyphXmlDescendantQuestion		Describes symbols with a question mark for XML descendant elements.
//  vs:GlyphXmlItem					Describes symbols for XML items.
//  vs:GlyphXmlNamespace				Describes symbols for XML namespaces.



//call and apply methods 
(function () {
    function each(obj, callback, args) {
        var value, i = 0, length = obj.length, isArray = obj && obj.push == Array.prototype.push;
        if (args) if (isArray) for (; i < length; i++) {
            value = callback.apply(obj[i], args);
            if (false === value) break;
        } else for (i in obj) {
            value = callback.apply(obj[i], args);
            if (false === value) break;
        } else if (isArray) for (; i < length; i++) {
            value = callback.call(obj[i], i, obj[i]);
            if (false === value) break;
        } else for (i in obj) {
            value = callback.call(obj[i], i, obj[i]);
            if (false === value) break;
        }
        return obj;
    }
    function isNullOrWhiteSpace(str) {
        if (typeof str === "string") {
            var isNullOrWhiteSpace = false;
            if (str == null || str === "undefined") isNullOrWhiteSpace = true;
            if (str.replace(/\s/g, "").length < 1) isNullOrWhiteSpace = true;
            return isNullOrWhiteSpace;
        }
        if (typeof str === "undefined") {
            return true;
        }
    }

    /*
	xml2json v 1.1
	copyright 2005-2007 Thomas Frank
 
	This program is free software under the terms of the 
	GNU General Public License version 2 as published by the Free 
	Software Foundation. It is distributed without any warranty.
	*/
    var xml2json = {
        parser: function (xmlcode, ignoretags, debug) {
            if (!ignoretags) {
                ignoretags = "";
            }
            xmlcode = xmlcode.replace(/\s*\/>/g, "/>");
            xmlcode = xmlcode.replace(/<\?[^>]*>/g, "").replace(/<\![^>]*>/g, "");
            if (!ignoretags.sort) {
                ignoretags = ignoretags.split(",");
            }
            var x = this.no_fast_endings(xmlcode);
            x = this.attris_to_tags(x);
            x = escape(x);
            x = x.split("%3C").join("<").split("%3E").join(">").split("%3D").join("=").split("%22").join('"');
            for (var i = 0; i < ignoretags.length; i++) {
                x = x.replace(new RegExp("<" + ignoretags[i] + ">", "g"), "*$**" + ignoretags[i] + "**$*");
                x = x.replace(new RegExp("</" + ignoretags[i] + ">", "g"), "*$***" + ignoretags[i] + "**$*");
            }
            x = "<JSONTAGWRAPPER>" + x + "</JSONTAGWRAPPER>";
            this.xmlobject = {};
            var y = this.xml_to_object(x).JSONTAGWRAPPER;
            if (debug) {
                y = this.show_json_structure(y, debug);
            }
            return y;
        },
        xml_to_object: function (xmlcode) {
            var x = xmlcode.replace(/<\//g, "§");
            x = x.split("<");
            var y = [];
            var level = 0;
            var opentags = [];
            for (var i = 1; i < x.length; i++) {
                var tagname = x[i].split(">")[0];
                opentags.push(tagname);
                level++;
                y.push(level + "<" + x[i].split("§")[0]);
                while (x[i].indexOf("§" + opentags[opentags.length - 1] + ">") >= 0) {
                    level--;
                    opentags.pop();
                }
            }
            var oldniva = -1;
            var objname = "this.xmlobject";
            for (var i = 0; i < y.length; i++) {
                var preeval = "";
                var niva = y[i].split("<")[0];
                var tagnamn = y[i].split("<")[1].split(">")[0];
                var rest = y[i].split(">")[1];
                if (niva <= oldniva) {
                    var tabort = oldniva - niva + 1;
                    for (var j = 0; j < tabort; j++) {
                        objname = objname.substring(0, objname.lastIndexOf("."));
                    }
                }
                objname += "." + tagnamn;
                var pobject = objname.substring(0, objname.lastIndexOf("."));
                if (eval("typeof " + pobject) != "object") {
                    preeval += pobject + "={value:" + pobject + "};\n";
                }
                var objlast = objname.substring(objname.lastIndexOf(".") + 1);
                var already = false;
                for (k in eval(pobject)) {
                    if (k == objlast) {
                        already = true;
                    }
                }
                var onlywhites = true;
                for (var s = 0; s < rest.length; s += 3) {
                    if (rest.charAt(s) != "%") {
                        onlywhites = false;
                    }
                }
                if (rest != "" && !onlywhites) {
                    if (rest / 1 != rest) {
                        rest = "'" + rest.replace(/\'/g, "\\'") + "'";
                        rest = rest.replace(/\*\$\*\*\*/g, "</");
                        rest = rest.replace(/\*\$\*\*/g, "<");
                        rest = rest.replace(/\*\*\$\*/g, ">");
                    }
                } else {
                    rest = "{}";
                }
                if (rest.charAt(0) == "'") {
                    rest = "unescape(" + rest + ")";
                }
                if (already && !eval(objname + ".sort")) {
                    preeval += objname + "=[" + objname + "];\n";
                }
                var before = "=";
                after = "";
                if (already) {
                    before = ".push(";
                    after = ")";
                }
                var toeval = preeval + objname + before + rest + after;
                eval(toeval);
                if (eval(objname + ".sort")) {
                    objname += "[" + eval(objname + ".length-1") + "]";
                }
                oldniva = niva;
            }
            return this.xmlobject;
        },
        show_json_structure: function (obj, debug, l) {
            var x = "";
            if (obj.sort) {
                x += "[\n";
            } else {
                x += "{\n";
            }
            for (var i in obj) {
                if (!obj.sort) {
                    x += i + ":";
                }
                if (typeof obj[i] == "object") {
                    x += this.show_json_structure(obj[i], false, 1);
                } else {
                    if (typeof obj[i] == "function") {
                        var v = obj[i] + "";
                        x += v;
                    } else if (typeof obj[i] != "string") {
                        x += obj[i] + ",\n";
                    } else {
                        x += "'" + obj[i].replace(/\'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r") + "',\n";
                    }
                }
            }
            if (obj.sort) {
                x += "],\n";
            } else {
                x += "},\n";
            }
            if (!l) {
                x = x.substring(0, x.lastIndexOf(","));
                x = x.replace(new RegExp(",\n}", "g"), "\n}");
                x = x.replace(new RegExp(",\n]", "g"), "\n]");
                var y = x.split("\n");
                x = "";
                var lvl = 0;
                for (var i = 0; i < y.length; i++) {
                    if (y[i].indexOf("}") >= 0 || y[i].indexOf("]") >= 0) {
                        lvl--;
                    }
                    tabs = "";
                    for (var j = 0; j < lvl; j++) {
                        tabs += "	";
                    }
                    x += tabs + y[i] + "\n";
                    if (y[i].indexOf("{") >= 0 || y[i].indexOf("[") >= 0) {
                        lvl++;
                    }
                }
                if (debug == "html") {
                    x = x.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    x = x.replace(/\n/g, "<BR>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                }
                if (debug == "compact") {
                    x = x.replace(/\n/g, "").replace(/\t/g, "");
                }
            }
            return x;
        },
        no_fast_endings: function (x) {
            x = x.split("/>");
            for (var i = 1; i < x.length; i++) {
                var t = x[i - 1].substring(x[i - 1].lastIndexOf("<") + 1).split(" ")[0];
                x[i] = "></" + t + ">" + x[i];
            }
            x = x.join("");
            return x;
        },
        attris_to_tags: function (x) {
            var d = " =\"'".split("");
            x = x.split(">");
            for (var i = 0; i < x.length; i++) {
                var temp = x[i].split("<");
                for (var r = 0; r < 4; r++) {
                    temp[0] = temp[0].replace(new RegExp(d[r], "g"), "_jsonconvtemp" + r + "_");
                }
                if (!isNullOrWhiteSpace(temp[0]) && !isNullOrWhiteSpace(temp[1])) temp[0] = "<__value>" + temp[0] + "</__value>";
                if (temp[1]) {
                    temp[1] = temp[1].replace(/'/g, '"');
                    temp[1] = temp[1].split('"');
                    for (var j = 1; j < temp[1].length; j += 2) {
                        for (var r = 0; r < 4; r++) {
                            temp[1][j] = temp[1][j].replace(new RegExp(d[r], "g"), "_jsonconvtemp" + r + "_");
                        }
                    }
                    temp[1] = temp[1].join('"');
                }
                x[i] = temp.join("<");
            }
            x = x.join(">");
            x = x.replace(/ ([^=]*)=([^ |>]*)/g, "><$1>$2</$1");
            x = x.replace(/>"/g, ">").replace(/"</g, "<");
            for (var r = 0; r < 4; r++) {
                x = x.replace(new RegExp("_jsonconvtemp" + r + "_", "g"), d[r]);
            }
            return x;
        }
    };

    var MAX_DESCRIPTION_LEN = 1000;
    //
    //  Extension events. 
    //  Copy plain comments into description property if available.
    //  Do not copy if VS doc comments are there.
    //
    window.intellisense && intellisense.addEventListener('statementcompletionhint', function (event) {
        if (event.symbolHelp.description) return;
        var itemValue = event.completionItem.value;
        if (typeof itemValue === "function") {
            var functionHelp = event.symbolHelp.functionHelp;
            if (!canApplyComments(functionHelp)) return;
            var comments = intellisense.getFunctionComments(itemValue);
            comments.above = comments.above || event.completionItem.comments;
            applyComments(functionHelp, comments);
        } else {
            var comments = event.completionItem.comments;
            if (isDocComment(comments)) return;
            setDescription(event.symbolHelp, comments);
        }
    });
    function toJSONWithFuncs(obj) {
        Object.prototype.toJSON = function () {
            var sobj = {}, i;
            for (i in this)
                if (this.hasOwnProperty(i))
                    sobj[i] = typeof this[i] == 'function' ?
					  this[i].toString() : this[i];

            return sobj;
        };

        var str = JSON.stringify(obj, null, " ");

        delete Object.prototype.toJSON;

        return str;
    }
    intellisense.xml2json = xml2json;
    intellisense.cloneXMLDoc = function (functionHelp, target) {
        /// <summary>Clones XMLDoc from target to the functionHelp. <br/>This method can only be called from `signaturehelp` event of intellisense <br/>i.e. intellisense.addEventListener('signaturehelp', function (event) {  intellisense.cloneXMLDoc(event.functionHelp, someOtherFunction) }</summary>
        /// <param name="functionHelp" type="FunctionHelp">See http://msdn.microsoft.com/en-us/library/vstudio/hh874692.aspx#FunctionHelp </param>
        /// <param name="target" type="Function">Any other function which has XMLDoc comments to copy from</param>
        if (typeof target === "function") {
            var f = intellisense.getFunctionComments(target);
            var xmldoc = f.xmldoc = xml2json.parser((f.inside || "").replace(/\<br\s*\/\>/gi, " "));
            if (!xmldoc.signature)
                xmldoc.signature = [xmldoc];
            //event.functionHelp.signatures[0].params[0].description == "abcd"; // first parameter's description
            var signatures = functionHelp.signatures;
            signatures.splice(0, signatures.length);
            each(xmldoc.signature, function (index, signature) {
                var description = signature && signature.summary && signature.summary.__value || "";
                var s = {
                    description: description.replace(/\ /g, '<br/>'),
                    params: []
                };
                if (signature.param) {
                    if (typeof signature.param.push !== "function")
                        signature.param = [signature.param];
                    each(signature.param, function (index, param) {
                        param.description = (param.__value || "").replace(/\ /g, '<br/>');
                        each(["integer", "domElement", "mayBeNull", "elementInteger", "elementDomElement", "elementMayBeNull", "parameterArray", "optional"], function (index, attr) {
                            if (typeof param[attr] === "string")
                                param[attr] = param[attr] == "true" || param[attr] == "1" || param[attr] == true;
                        });

                        delete param.__value;
                        s.params.push(param);
                    });
                }
                signatures.push(s);
            });
            return signatures;
        }
    }
    intellisense.inheritXMLDoc = function (functionHelp, sourceMethod1, sourceMethod2, sourceMethodEtc) {
        /// <summary>Clones first non-null XMLDoc from provided sourceMethods to the functionHelp <br/>This method can only be called from `signaturehelp` event of intellisense <br/>i.e. intellisense.addEventListener('signaturehelp', function (event) {  intellisense.cloneXMLDoc(event.functionHelp, someOtherFunction) }</summary>
        /// <param name="functionHelp" type="FunctionHelp">See http://msdn.microsoft.com/en-us/library/vstudio/hh874692.aspx#FunctionHelp </param>
        /// <param name="sourceMethod1" type="Function">Any other function which has XMLDoc comments to copy from</param>
        /// <param name="sourceMethod2" type="Function">Any other function which has XMLDoc comments to copy from</param>
        /// <param name="sourceMethodEtc" type="Function">Any other function which has XMLDoc comments to copy from</param>

        var signatures = functionHelp.signatures;
        var signature = signatures[0];
        var baseMethodIndex = 0;
        while (signatures.length == 1 && !signature.description && ++baseMethodIndex < arguments.length) {
            intellisense.cloneXMLDoc(functionHelp, arguments[baseMethodIndex]);
            signature = signatures[0];
        }
    }
    intellisense.addEventListener('signaturehelp', function (event) {
        var functionHelp = event.functionHelp;
        var functionName = event && event.functionHelp && event.functionHelp.functionName;
        if (event.parentObject && typeof event.parentObject === "function"
			&& (functionName === "call" || functionName === "apply")) {
            //call and apply helpers
            var f = intellisense.getFunctionComments(event.parentObject);
            event["_$functionComments"] = f;
            var xmldoc = f.xmldoc = xml2json.parser((f.inside || "").replace(/\<br\s*\/\>/gi, " "));
            if (!xmldoc.signature)
                xmldoc.signature = [xmldoc];
            //event.functionHelp.signatures[0].params[0].description == "abcd"; // first parameter's description
            var signatures = functionHelp.signatures;
            if (functionName === "call") {
                signatures.splice(0, signatures.length);
                each(xmldoc.signature, function (index, signature) {
                    var description = signature && signature.summary && signature.summary.__value || "";
                    var s = {
                        description: [description.replace(/\ /g, '<br/>'), "", ".call executes the function with on the provided `this` context and with the provided parameters"].join("<br/>"),
                        params: []
                    };
                    s.params.push({
                        "name": "this",
                        "type": "",
                        "description": "Specify who is `this` when calling this method <br/>i.e. this to forward the current this",
                        "locid": "",
                        "elementType": "",
                        "optional": false
                    });
                    if (signature.param) {
                        if (typeof signature.param.push !== "function")
                            signature.param = [signature.param];
                        each(signature.param, function (index, param) {
                            param.description = (param.__value || "").replace(/\ /g, '<br/>');
                            each(["integer", "domElement", "mayBeNull", "elementInteger", "elementDomElement", "elementMayBeNull", "parameterArray", "optional"], function (index, attr) {
                                if (typeof param[attr] === "string")
                                    param[attr] = param[attr] == "true" || param[attr] == "1" || param[attr] == true;
                            });

                            delete param.__value;
                            s.params.push(param);
                        });
                    }
                    signatures.push(s);
                });
            }
            else {
                var description = xmldoc && xmldoc.signature && xmldoc.signature[0] && xmldoc.signature[0].summary && xmldoc.signature[0].summary.__value;
                signatures[0].description = [description, "", ".apply executes the function with on the provided `this` context and with the provided array of parameters as arguments"].join("<br/>");
                signatures[0].params[0].name = "this";
                signatures[0].params[0].description = "Specify who is `this` when calling this method <br/>i.e. this to forward the current this";
                signatures[0].params[1].name = "arguments";
                signatures[0].params[1].description = "Specify an Array with the arguments to be sent as parameters <br/>i.e. arguments to forward the current parameters";
            }
            //intellisense.logMessage("var a = " + toJSONWithFuncs(event, null, " "));

            return;
        }
        if (!canApplyComments(event.functionHelp)) return;
        applyComments(event.functionHelp, event.functionComments);
    });
    //
    //  Helpers
    //
    function applyComments(functionHelp, comments) {
        var signatures = functionHelp.signatures;
        var signature = signatures[0];
        // Do not apply if VS doc comments were applied
        if (!canApplyComments(functionHelp)) return;
        // Do not apply VS doc comments
        if (isDocComment(comments.inside)) return;
        if (comments.above && !isDocComment(comments.above)) {
            setDescription(signature, comments.above);
        }
        // Populate parameters descriptions
        signature.params.forEach(function (param, index) {
            var paramComment = comments.paramComments[index];
            if (!paramComment.comment) return;
            if (paramComment.name != param.name) return false;
            setDescription(param, paramComment.comment);
        });
    }
    function canApplyComments(functionHelp) {
        var signatures = functionHelp.signatures;
        var signature = signatures[0];
        if (signatures.length > 1) return false;
        if (signature.description) return false;
        if (!signature.params.every(function (param) { return !param.description; })) return false;
        return true;
    }
    function isDocComment(comment) {
        // Simple heuristic to detect xml doc comments.
        return !!(comment && comment.charAt(0) === '<');
    }
    function setDescription(o, text) {
        // Trim description if needed
        text = (text && text.length > MAX_DESCRIPTION_LEN) ? text.substring(0, MAX_DESCRIPTION_LEN) + '...' : text;
        // Encode characters to accomodate markup as well as new lines
        text = text.replace(/&(?!#?\w+;)/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/(\r\n|\n|\r)/gm, "<br/>");
        o.description = text;
    }
})();