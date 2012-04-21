(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
    var importRegEx = /((?:xaml!)?[a-z]+(\.[a-z]+[a-z0-9]*)*)/mgi;

    define(function () {

        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (obj) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == obj) {
                        return i;
                    }
                }
                return -1;
            }
        }

        /**
         * IE8 FIXES
         * @param domNode
         */
        var localNameFromDomNode = function(domNode){
            if(domNode.localName) return domNode.localName;

            var st = domNode.tagName.split(":");
            return st[st.length-1];
        };

        return {
            version: '0.1.0',

            createXhr: function () {
                var xhr, i, progId;
                if (typeof XMLHttpRequest !== "undefined") {
                    return new XMLHttpRequest();
                } else {
                    for (i = 0; i < 3; i++) {
                        progId = progIds[i];
                        try {
                            xhr = new ActiveXObject(progId);
                        } catch (e) {
                        }

                        if (xhr) {
                            progIds = [progId];  // so faster next time
                            break;
                        }
                    }
                }

                if (!xhr) {
                    throw new Error("createXhr(): XMLHttpRequest not available");
                }

                return xhr;
            },

            get: function (url, callback) {
                var xhr;
                try {
                    xhr = this.createXhr();

                    xhr.open('GET', url, true);

                    xhr.onreadystatechange = function (evt) {
                        //Do not explicitly handle errors, those should be
                        //visible via console output in the browser.
                        if (xhr.readyState === 4) {
                            callback(null, xhr);
                        }
                    };
                    xhr.send(null);

                } catch (e) {
                    callback(e);
                }

            },

            getDependency: function(namespace, localName, namespaceMap, xamlClasses, rewriteMap) {
                var fqClassName = [namespaceMap[namespace] || namespace, localName].join(".");

                for (var i = 0; i < rewriteMap.length; i++) {
                    var entry = rewriteMap[i];
                    if (entry.$from && entry.$to) {
                        if (entry.$from.test(fqClassName)) {
                            fqClassName = fqClassName.replace(entry.$from, entry.$to);

                            break;
                        }
                    }
                }

                // TODO fix
                if (xamlClasses.indexOf(fqClassName) != -1) {
                    fqClassName = "xaml!" + fqClassName;
                }

                return fqClassName.replace(/\./g, "/");
            },

            findDependencies: function (xaml, namespaceMap, xamlClasses, rewriteMap, imports) {

                var self = this;
                var ret = [];

                function findDependencies(domNode) {

                    var localName = localNameFromDomNode(domNode);

                    var dep = self.getDependency(domNode.namespaceURI, localName, namespaceMap, xamlClasses, rewriteMap);
                    // console.log(dep);
                    if (dep == "js/core/Imports") {
                        for (var t = 0; t < domNode.childNodes.length; t++) {
                            var importNode = domNode.childNodes[t];
                            if (importNode.nodeType == 3) {
                                // text node
                                var m;
                                var textContent = importNode.textContent ? importNode.textContent : importNode.text;
                                while ((m = importRegEx.exec(textContent+" ")) != null) {
                                    var importClass =  m[0].replace(/\./g, "/");
                                    if(importClass !== "undefined"){
                                        if (ret.indexOf(importClass) == -1) {
                                            ret.push(importClass);
                                        }

                                        if (imports) {
                                            imports.push(importClass);
                                        }
                                    }


                                }
                            }
                        }
                    }

                    if (ret.indexOf(dep) == -1) {
                        ret.push(dep);
                    }

                    for (var i = 0; i < domNode.childNodes.length; i++) {
                        var childNode = domNode.childNodes[i];

                        // element
                        if (childNode.nodeType == 1) {
                            findDependencies(childNode);
                        }
                    }

                }

                if (xaml) {
                    findDependencies(xaml);
                }

                return ret;
            },

            findScripts: function(xaml, namespaceMap, xamlClasses, rewriteMap) {
                var ret = [];

                for (var i = 0; i < xaml.childNodes.length; i++) {
                    var node = xaml.childNodes[i];
                    if (node.nodeType == 1) {
                        if ("js/core/Script" == this.getDependency(node.namespaceURI, localNameFromDomNode(node), namespaceMap, xamlClasses, rewriteMap)) {
                            ret.push(node);
                        }
                    }
                }

                return ret;
            },

            getDeclarationFromScripts: function(scripts) {
                var ret = {};

                if (scripts) {
                    for (var s = 0; s < scripts.length; s++) {
                        var script = scripts[s];
                        for (var fn in script) {
                            if (script.hasOwnProperty(fn)) {
                                ret[fn] = script[fn];
                            }
                        }
                    }
                }

                return ret;
            },

            load: function (name, req, onLoad, config) {
//                if (config.isBuild && !config.inlineText) {
//                    onLoad();
//                    return;
//                }
                var self = this;
                var url = req.toUrl(name.replace(/\./g, "/") + ".xml");
                this.get(url, function (err, xhr) {
                    if (!err) {
                        if (xhr.responseXML) {
                            // require all dependencies
                            var imports = [];

                            var dependencies = self.findDependencies(xhr.responseXML.documentElement,
                                config.namespaceMap, config.xamlClasses, config.rewriteMap, imports);
                            for (var i = 0; i < imports.length; i++) {
                                // console.log(imports[i]);
                            }
                            var scripts = self.findScripts(xhr.responseXML.documentElement,
                                config.namespaceMap, config.xamlClasses, config.rewriteMap);

                            if (scripts.length > 0) {
                                // at least one script

                                dependencies.splice(1, 0, "js/core/Script");
                            }

                            if(imports.length > 0){
                                dependencies = dependencies.concat(imports);
                            }
                            for(i = 0 ; i < dependencies.length; i++){
                               // console.log("AFTER: "+dependencies[i]);
                            }

                            // first item should be the dependency of the document element
                            req(dependencies, function() {
                                // dependencies are loaded
                                var baseClass = arguments[0],
                                    Script = arguments[1];

                                var args = [];
                                for(var i = 1; i < arguments.length; i++){
                                    args.push(arguments[i]);
                                }

                                var scriptObjects = [];
                                var importedClasses = args.slice(args.length - imports.length);

                                if (scripts.length > 0) {
                                    for (var s = 0; s < scripts.length; s++) {
                                        try {

                                            var scriptInstance = new Script(null, scripts[s]);
                                            scriptObjects.push(scriptInstance.evaluate(importedClasses));
                                        } catch (e) {
                                            throw "Script cannot be loaded";
                                        }
                                    }
                                }

                                var xamlFactory = baseClass.inherit(
                                    self.getDeclarationFromScripts(scriptObjects)
                                );

                                xamlFactory.prototype._$descriptor = xhr.responseXML.documentElement;

                                if (config.applicationDomain) {
                                    config.applicationDomain.defineXamlClass(name, dependencies, xamlFactory);
                                    onLoad(xamlFactory);
                                }

                            });

                        } else {
                            throw name + " wasn't a valid xml document";
                        }
                    } else {
                        throw err;
                    }
                });
            }
        };

    });
})();