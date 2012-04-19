var rAppid;

/** ECMA SCRIPT COMPLIANT**/
if(!String.prototype.trim){
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

(function (exports, inherit, requirejs, define, underscore, XMLHttpRequest, flow, document) {

    if (!requirejs) {
        throw "require.js is needed";
    }

    if (!define) {
        throw "define is needed";
    }

    if (!underscore) {
        throw "underscore is needed"
    }

    if (!flow) {
        throw "flow.js is needed";
    }

    /***
     * marks a function to be executed asycn
     * @return {*}
     */
    Function.prototype.async = function () {
        this._async = true;
        return this;
    };

    var Base = inherit.Base.inherit({
        ctor: function () {
            if (!this.className) {
                this.className = this.constructor.name;
            }
        },
        runsInBrowser: function () {
            return typeof window !== "undefined";
        }
    });

    // global requirejs setup
    requirejs.config({
        paths: {
            "xaml": "js/plugins/xaml",
            "json": "js/plugins/json"
        }
    });

    var xamlApplication = /^(xaml!)?(.+?)(\.xml)?$/;

    var Rewrite = function (from, to) {
            this.$from = from;
            this.$to = to;
        },
        defaultNamespaceMap = {
            "http://www.w3.org/1999/xhtml": "js.html"
        },
        defaultRewriteMap = [
            new Rewrite(/^js.html.(input)$/, "js.html.Input"),
            new Rewrite(/^js.html.(select)$/, "js.html.Select"),
            new Rewrite(/^js.html.(textarea)$/, "js.html.TextArea"),
            new Rewrite(/^js.html.(option)$/, "js.html.Option"),
            new Rewrite(/^js.html.(.+)$/, "js.html.DomElement"),
            new Rewrite(/^js.conf.(.+)$/, "js.core.Component")
        ];

    var _rAppid = {

        createApplicationContext: function(requirejsContext, applicationDomain, mainClass, config, callback) {

            config = config || {};

            var internalCreateApplicationContext = function (config) {

                config.xamlClasses = config.xamlClasses || [];
                config.namespaceMap = config.namespaceMap || defaultNamespaceMap;
                config.rewriteMap = config.rewriteMap || defaultRewriteMap;

                define("flow", function () {
                    return flow;
                });

                define("flow.js", function () {
                    return flow;
                });

                define("inherit", function () {
                    return inherit;
                });

                define("underscore", function() {
                    return underscore;
                });

                // define js.core.Base
                define("js/core/Base", [], function () {
                    return Base;
                });

                underscore.extend(config, {
                    paths: {
                        "xaml": "js/plugins/xaml",
                        "json": "js/plugins/json"
                    }
                });

                applicationDomain = applicationDomain || new ApplicationDomain(config.namespaceMap, config.rewriteMap);

                // and add it to config object, so it can used from xaml.js
                config.applicationDomain = applicationDomain;

                requirejsContext.config(config);


                if (mainClass) {
                    var parts = xamlApplication.exec(mainClass);
                    if (parts) {
                        // mainClass is xaml
                        mainClass = "xaml!" + parts[2];
                    } else {
                        // mainClass is javascript factory
                        mainClass = mainClass.replace(/\./g, "/");
                    }

                    var applicationContext = new ApplicationContext(applicationDomain, requirejsContext, config);
                    //applicationContext.document = document;
                    applicationContext._ = underscore;

                    define("rAppid", function () {
                        return applicationContext;
                    });


                    requirejsContext(["require"], function(){
                        requirejsContext(["./js/core/Imports"], function () {
                            requirejsContext([mainClass], function (applicationFactory) {
                                applicationContext.$applicationFactory = applicationFactory;
                                callback(null, applicationContext);
                            });
                        });
                    });

                } else {
                    callback("MainClass missing");
                }

            };

            if (Object.prototype.toString.call(config) == '[object String]') {
                requirejs(["json!" + config], function (config) {
                    internalCreateApplicationContext(config);
                });
            } else {
                internalCreateApplicationContext(config);
            }

        },

        bootStrap: function (mainClass, config, callback) {
            _rAppid.createApplicationContext(requirejs, null, mainClass, config, function(err, applicationContext){
                if (err || !applicationContext) {
                    callback(err || "ApplicationContext missing");
                } else {
                    applicationContext.createApplicationInstance(document, callback);
                }
            })
        },

        rewriteMapEntry: Rewrite,

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

            // TODO: don't use requirejs for this, use a rAppid instance and config these
            if (requirejs.config.applicationUrl) {
                url = requirejs.config.applicationUrl + "/" + url;
            }

            // create new xhr
            var xhr = s.xhr();
            xhr.open(s.type, s.url, s.async);

            try {
                for (var header in s.headers) {
                    if (s.headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, s.headers[header]);
                    }
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
        require: requirejs,
        document: document
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

    var ApplicationDomain = _rAppid.ApplicationDomain = inherit.Base.inherit({
        ctor: function(namespaceMap, rewriteMap, parentDomain) {
            this.$namespaceMap = namespaceMap || {};
            this.$rewriteMap = rewriteMap || defaultRewriteMap;
            this.$ns = {};
            this.$parentDomain = parentDomain;
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

            var ret;
            try {
                ret = construct(classDefinition, args);
                ret.className = className;
            } catch (e) {
                console.log("Cannot create instance of '" + fqClassName + "'");
            }

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

    var SystemManager = _rAppid.SystemManager = inherit.Base.inherit({
        ctor: function (applicationDomain, requirejsContext, applicationContext, document) {
            this.$applicationDomain = applicationDomain;
            this.$requirejsContext = requirejsContext;
            this.$applicationContext = applicationContext;
            this.$applicationFactory = null;
            this.$document = document;
        }
    });

    var ApplicationContext = _rAppid.ApplicationContext = SystemManager.inherit({

        ctor: function(applicationDomain, requirejsContext, config) {
            this.callBase(applicationDomain, requirejsContext);
            this.$config = config;
            this.$applicationContext = this;
        },

        createApplicationInstance: function(document, callback) {
            // create instance
            var applicationFactory = this.$applicationFactory;

            var systemManager = new SystemManager(this.$applicationDomain, this.$requirejsContext, this, document);

            this.$requirejsContext(["js/core/Application"], function(Application) {

                var application = new applicationFactory(null, false, systemManager, null, null);

                if (application instanceof Application) {

                    systemManager.$application = application;

                    application._initialize("auto");

                    // return rAppid instance
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

        },

        ajax: function(url, options, callback) {

            if (!(/^http.*$/.test(url)) && this.$config.applicationUrl) {
                url = this.$config.applicationUrl + '/' + url;
            }

            _rAppid.ajax(url, options, callback);
        },

        defineClass: function (fqName, dependencies, generateFactory) {
            this.$applicationDomain.defineClass(fqName, dependencies, generateFactory);
        },

        defineXamlClass: function (fqClassName, dependencies, factory) {
            this.$applicationDomain.defineXamlClass(fqClassName, dependencies, factory);
        },

        getDefinition: function (fqClassName) {
            this.$applicationDomain.getDefinition(fqClassName);
        },

        makeRequireName: function (module) {
            if (underscore.indexOf(this.$config.xamlClasses, module)) {
                module = "xaml!" + module;
            }

            return module;
        }


    });


    rAppid = exports.rAppid = _rAppid;

})(typeof exports === "undefined" ? this : exports,
   typeof inherit === "undefined" ? require('inherit.js').inherit : inherit,
    typeof requirejs === "undefined" ? require('requirejs') : requirejs,
    typeof requirejs === "undefined" ? require('requirejs').define : define,
    typeof this._ === "undefined" ? require('underscore') : this._,
    typeof window === "undefined" ? require('xmlhttprequest').XMLHttpRequest : window.XMLHttpRequest,
    typeof flow === "undefined" ? require('flow.js').flow : flow,
    typeof document === "undefined" ? (new (require('xmldom').DOMParser)()) : document);
