var rAppid;

/** ECMA SCRIPT COMPLIANT**/
if(!String.prototype.trim){
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

(function (exports, inherit, require, define, underscore, XMLHttpRequest, flow) {

    if (!require) {
        throw "require.js is needed";
    }

    if (!define) {
        throw "define is needed";
    }

    if (!underscore) {
        // TODO include own implementation
        throw "underscore is needed"
    }

    if (!flow) {
        throw "flow.js is needed";
    }

    define("flowjs", function() {
        return flow;
    });

    require.config({
        paths: {
            "xaml": "js/plugins/xaml",
            "json": "js/plugins/json"
        }
    });

    var Base = inherit.Base.inherit({
        ctor: function () {
            if (!this.className) {
                this.className = this.constructor.name;
            }
        }
    });


    // define js.core.Base
    define("js/core/Base", [], function() {
        return Base;
    });

    define("rAppid", function() {
        return _rAppid;
    });

    function SystemManager(applicationDomain, application) {
        this.applicationDomain = applicationDomain;
        this.application = application;
    }

    var xamlApplication = /^(xaml!)?(.+?)(\.xml)?$/;
    var defaultNamespaceMap = {
        "http://www.w3.org/1999/xhtml": "js.html"
    };

    var currentApplicationDomain = null;

    var _rAppid = {
        defineClass: function(fqName, dependencies, generateFactory){
            if (currentApplicationDomain) {
                currentApplicationDomain.defineClass(fqName, dependencies, generateFactory);
            } else {
                throw "CurrentApplicationDomain not available! Application not bootstrapped?";
            }
        },

        defineXamlClass: function(fqClassName, dependencies, factory) {
            if (currentApplicationDomain) {
                currentApplicationDomain.defineXamlClass(fqClassName, dependencies, factory);
            } else {
                throw "CurrentApplicationDomain not available! Application not bootstrapped?";
            }
        },

        getDefinition: function(fqClassName) {
            if (currentApplicationDomain) {
                currentApplicationDomain.getDefinition(fqClassName);
            } else {
                throw "CurrentApplicationDomain not available! Application not bootstrapped?";
            }
        },

        bootStrap: function (mainClass, config, callback) {
            config = config || {};
            
            var internalBootstrap = function(config) {

                var xamlClasses = config.xamlClasses || [];
                var namespaceMap = config.namespaceMap || defaultNamespaceMap;
                var rewriteMap = config.rewriteMap;

                var applicationDomain = currentApplicationDomain = new ApplicationDomain(namespaceMap, rewriteMap);

                require.config({
                    xamlClasses: xamlClasses,
                    namespaceMap: namespaceMap,
                    rewriteMap: applicationDomain.$rewriteMap,
                    applicationDomain: applicationDomain
                });

                if (mainClass) {
                    var parts = xamlApplication.exec(mainClass);
                    if (parts) {
                        // mainClass is xaml
                        mainClass = "xaml!" + parts[2];
                    } else {
                        // mainClass is javascript factory
                        mainClass = mainClass.replace(/\./g, "/");
                    }

                    require(["./js/core/Imports"], function () {
                        require(["./js/core/Application", mainClass], function (Application, mainClassFactory) {
                            // create instance
                            var application = new mainClassFactory(null, false, applicationDomain, null, null);

                            if (application instanceof Application) {

                                var systemManager = new SystemManager(applicationDomain, application);
                                rAppid.systemManager = systemManager;

                                application.$config = config;
                                application._initialize("auto");

                                // return system manager
                                if (callback) {
                                    callback(null, systemManager, application);
                                }

                            } else {
                                var errMessage = "mainClass isn't an instance of js.core.Application";
                                if (callback) {
                                    callback(errMessage);
                                } else {
                                    throw(errMessage);
                                }
                            }
                        });
                    });
                }
            };
            
            if (Object.prototype.toString.call(config) == '[object String]') {
                require(["json!" + config], function(config) {
                    internalBootstrap(config);
                });
            } else {
                internalBootstrap(config);
            }

        },

        createQueryString: function(parameter) {
            var ret = [];

            for (var key in parameter) {
                if (parameter.hasOwnProperty(key)) {
                    ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(parameter[key]));
                }
            }

            return ret.join("&");
        },

        ajax: function(url, options, callback) {

            var s = {
                url: url
            };

            rAppid._.extend(s, options, _rAppid.ajaxSettings);

            if (s.data && !rAppid._.isString(s.data)) {
                throw "data must be a string";
            }

            s.hasContent = !/^(?:GET|HEAD)$/.test(s.type);
            
            if (s.queryParameter) {
                // append query parameter to url
                s.url += /\?/.test(s.url) ? "&" : "?" + this.createQueryString(s.queryParameter);
            }

            if (s.data && s.hasContent && s.contentType !== false) {
                xhr.setRequestHeader("Content-Type", s.contentType);
            }

            // create new xhr
            var xhr = s.xhr();
            xhr.open(s.type, s.url, s.async);

            try {
                for (var header in s.headers) {
                    xhr.setRequestHeader(header, s.headers[header]);
                }
            } catch (e) {} // FF3

            xhr.send();

            var xhrCallback = function(_, isAbort) {

                var wrappedXhr;

                if (xhrCallback && (isAbort || xhr.readyState === 4)) {
                    xhrCallback = undefined;

                    if (isAbort) {
                        // Abort it manually if needed
                        if (xhr.readyState !== 4) {
                            xhr.abort();
                        }
                    } else {
                        wrappedXhr = new rAppidXhr(xhr);
                    }

                    if (callback) {
                        callback(isAbort, wrappedXhr)
                    }
                }
            };

            if (!s.async || xhr.readyState === 4) {
                xhrCallback();
            } else {
                xhr.onreadystatechange = xhrCallback
            }

            return xhr;
        },

        // export underscore
        _: underscore,
        // export inherit
        inherit: inherit,
        require: require
    };

    var rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg; // IE leaves an \r character at EOL

    var rAppidXhr = Base.inherit({
        ctor: function(xhr) {
            this.xhr = xhr;
            this.status = xhr.status;
            this.$nativeResponseHeaders = xhr.getAllResponseHeaders();
            this.responses = {};

            var xml = xhr.responseXML;

            // Construct response list
            if (xml && xml.documentElement) {
                this.responses.xml = xml;
            }
            this.responses.text = xhr.responseText;

            try {
                this.statusText = xhr.statusText;
            } catch (e) {
                this.statusText = "";
            }
        },
        getResponseHeader: function(key) {
            var match;
            if (!this.$responseHeaders) {
                this.$responseHeaders = {};
                while (( match = rheaders.exec(this.$nativeResponseHeaders) )) {
                    this.$responseHeaders[match[1].toLowerCase()] = match[2];
                }
            }
            return this.$responseHeaders[key.toLowerCase()];
        }

    });

    _rAppid.ajaxSettings = {
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        async: true,
        // TODO: add ie7 support for local file requests via ActiveX
        xhr: function() {
            return new XMLHttpRequest();
        },
        headers: {
        }
    };


    var Rewrite = _rAppid.rewriteMapEntry = function (from, to) {
        this.$from = from;
        this.$to = to;
    };

    _rAppid.defaultRewriteMap = [
        new Rewrite(/^js.html.(input)$/, "js.html.Input"),
        new Rewrite(/^js.html.(select)$/, "js.html.Select"),
        new Rewrite(/^js.html.(textarea)$/, "js.html.TextArea"),
        new Rewrite(/^js.html.(option)$/, "js.html.Option"),
        new Rewrite(/^js.html.(.+)$/, "js.html.DomElement"),
        new Rewrite(/^js.conf.(.+)$/, "js.core.Component")
    ];

    var ApplicationDomain = inherit.Base.inherit({
        ctor: function(namespaceMap, rewriteMap) {
            this.$namespaceMap = namespaceMap || {};
            this.$rewriteMap = rewriteMap || rAppid.defaultRewriteMap;
            this.$ns = {};
        },
        /**
         *
         * loads all dependencies and defines a class under the given fqClassname
         *
         * @param fqClassName full qualified classname (e.g. js.ui.myComponent)
         * @param dependencies as hash or array
         * @param generateFactor a function that return the factory function invoked after all dependencies are loaded
         */
        defineClass: function (fqClassName, dependencies, generateFactor) {
            // create the namespace and install the class
            if (!fqClassName || fqClassName == "") {
                throw "Full qualified class name '" + fqClassName + "' in wrong format. Use dot notation.";
            }

            var self = this;
            var realDependencies = [];

            if (dependencies) {
                for (var i = 0; i < dependencies.length; i++) {
                    realDependencies.push(dependencies[i].replace(/\./g, "/"));
                }
            }

            define(fqClassName.replace(/\./g, "/"), realDependencies, function () {

                var factory = generateFactor.apply(this, arguments);
                factory.prototype.constructor.name = fqClassName;

                if (!self.installClass(self.$ns, fqClassName.split("."), factory)) {
                    throw "Class '" + fqClassName + "' could not be installed";
                }

                return factory;
            });

        },

        /**
         * registers an XAML component
         *
         * differs from normal class registration because, dependencies are loaded
         * and class has to be installed immedently
         *
         * @param fqClassName
         * @param dependencies
         * @param factory
         */
        defineXamlClass: function (fqClassName, dependencies, factory) {
            // create the namespace and install the class
            if (!fqClassName || fqClassName == "") {
                throw "Full qualified class name '" + fqClassName + "' in wrong format. Use dot notation.";
            }

            var normalizeRegex = /\//g;

            fqClassName = fqClassName.replace(normalizeRegex, ".");
            factory.prototype.constructor.name = fqClassName;

            if (!this.installClass(this.$ns, fqClassName.split("."), factory)) {
                throw "Class '" + fqClassName + "' could not be installed";
            }

            define(fqClassName.replace(/\./g, "/"), dependencies, function () {
                return factory;
            });

        },

        getDefinition: function (fqClassName) {

            function getDefinition (currentNamespace, classPath) {

                if (classPath.length > 0) {
                    var part = classPath.shift();
                    if (currentNamespace.hasOwnProperty(part)) {
                        var value = currentNamespace[part];

                        if (value instanceof Function) {
                            if (classPath.length == 0) {
                                return value;
                            } else {
                                throw "unterminated classpath";
                            }
                        } else {
                            return getDefinition.call(this, currentNamespace[part], classPath);
                        }
                    }
                }

                return null;
            }

            return getDefinition.call(this, this.$ns, fqClassName.split("."));
        },
        hasDefinition: function (fqClassName) {
            return this.getDefinition(fqClassName) ? true : false;
        },

        createInstance: function (fqClassName, args, className) {
            className = className || fqClassName;
            args = args || [];

            var classDefinition = this.getDefinition(fqClassName);

            function construct(constructor, args) {
                function F() {
                    return constructor.apply(this, args);
                }

                F.prototype = constructor.prototype;
                return new F();
            }


            var ret = construct(classDefinition, args);
            ret.className = className;

            return ret;
        },
        getFqClassName: function (namespace, className, useRewriteMap) {
            if (useRewriteMap == undefined || useRewriteMap == null) {
                useRewriteMap = true;
            }

            var fqClassName = [this.$namespaceMap[namespace] || namespace, className].join(".");

            if (useRewriteMap) {
                for (var i = 0; i < this.$rewriteMap.length; i++) {
                    var entry = this.$rewriteMap[i];
                    if (entry instanceof rAppid.rewriteMapEntry) {
                        if (entry.$from.test(fqClassName)) {
                            return fqClassName.replace(entry.$from, entry.$to);
                        }
                    }
                }
            }

            return fqClassName;
        },

        installClass: function (currentNamespace, path, value) {

            if (path.length == 0) {
                return false;
            }

            var part = path.shift();

            if (!currentNamespace.hasOwnProperty(part)) {
                if (path.length == 0) {
                    // create class
                    currentNamespace[part] = value;
                    return true;
                } else {
                    // create namespace
                    currentNamespace[part] = {};
                }
            }

            // step into namespace
            return this.installClass(currentNamespace[part], path, value);
        }
    });

    rAppid = exports.rAppid = _rAppid;

})(typeof exports === "undefined" ? this : exports,
   typeof inherit === "undefined" ? global.inherit : inherit,
    requirejs,
    requirejs.define ? requirejs.define : define,
    typeof this._ === "undefined" ? global.underscore : this._,
    typeof window !== "undefined" ? window.XMLHttpRequest : global.XMLHttpRequest,
    typeof flow === "undefined" ? global.flow : flow);
