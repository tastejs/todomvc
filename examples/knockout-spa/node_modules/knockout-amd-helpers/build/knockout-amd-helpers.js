// knockout-amd-helpers 0.7.4 | (c) 2015 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
define(["knockout"], function(ko) {

//helper functions to support the binding and template engine (whole lib is wrapped in an IIFE)
var require = window.requirejs || window.require || window.curl,
    unwrap = ko.utils.unwrapObservable,
    //call a constructor function with a variable number of arguments
    construct = function(Constructor, args) {
        var instance,
            Wrapper = function() {
                return Constructor.apply(this, args || []);
            };

        Wrapper.prototype = Constructor.prototype;
        instance = new Wrapper();
        instance.constructor = Constructor;

        return instance;
    },
    addTrailingSlash = function(path) {
        return path && path.replace(/\/?$/, "/");
    },
    isAnonymous = function(node) {
        var el = ko.virtualElements.firstChild(node);

        while (el) {
            if (el.nodeType === 1 || el.nodeType === 8) {
                return true;
            }

            el = ko.virtualElements.nextSibling(el);
        }

        return false;
    };

//an AMD helper binding that allows declarative module loading/binding
ko.bindingHandlers.module = {
    init: function(element, valueAccessor, allBindingsAccessor, data, context) {
        var extendedContext, disposeModule,
            options = unwrap(valueAccessor()),
            templateBinding = {},
            initializer = ko.bindingHandlers.module.initializer,
            disposeMethod = ko.bindingHandlers.module.disposeMethod;

        //build up a proper template binding object
        templateBinding.templateEngine = options && options.templateEngine;

        //allow binding template to a string on module (can override in binding)
        templateBinding.templateProperty = ko.bindingHandlers.module.templateProperty;

        //afterRender could be different for each module, create a wrapper
        templateBinding.afterRender = function(nodes, data) {
            var handler,
                options = unwrap(valueAccessor());

            if (options && options.afterRender) {
                handler = typeof options.afterRender === "string" ? data && data[options.afterRender] : options.afterRender;

                if (typeof handler === "function") {
                    handler.apply(this, arguments);
                }
            }
        };

        //if this is not an anonymous template, then build a function to properly return the template name
        if (!isAnonymous(element)) {
            templateBinding.name = function() {
                var template = unwrap(valueAccessor());
                return ((template && typeof template === "object") ? unwrap(template.template || template.name) : template) || "";
            };
        }

        //set the data to an observable, that we will fill when the module is ready
        templateBinding.data = ko.observable();
        templateBinding["if"] = templateBinding.data;

        //actually apply the template binding that we built. extend the context to include a $module property
        ko.applyBindingsToNode(element, { template: templateBinding }, extendedContext = context.extend({ $module: null }));

        //disposal function to use when a module is swapped or element is removed
        disposeModule = function() {
            //avoid any dependencies
            ko.computed(function() {
                var currentData = templateBinding.data();
                if (currentData) {
                    if (typeof currentData[disposeMethod] === "function") {
                        currentData[disposeMethod].call(currentData);
                        currentData = null;
                    }

                    templateBinding.data(null);
                }
            }).dispose();
        };

        //now that we have bound our element using the template binding, pull the module and populate the observable.
        ko.computed({
            read: function() {
                //module name could be in an observable
                var initialArgs,
                    moduleName = unwrap(valueAccessor());

                //observable could return an object that contains a name property
                if (moduleName && typeof moduleName === "object") {

                    //initializer/dispose function name can be overridden
                    initializer = moduleName.initializer || initializer;
                    disposeMethod = moduleName.disposeMethod || disposeMethod;
                    templateBinding.templateProperty = ko.unwrap(moduleName.templateProperty) || templateBinding.templateProperty;

                    //get the current copy of data to pass into module
                    initialArgs = [].concat(unwrap(moduleName.data));

                    //name property could be observable
                    moduleName = unwrap(moduleName.name);
                }

                //if there is a current module and it has a dispose callback, execute it and clear the data
                disposeModule();

                //at this point, if we have a module name, then require it dynamically
                if (moduleName) {
                    require([addTrailingSlash(ko.bindingHandlers.module.baseDir) + moduleName], function(mod) {
                        //if it is a constructor function then create a new instance
                        if (typeof mod === "function") {
                            mod = construct(mod, initialArgs);
                        }
                        else {
                            //if it has an appropriate initializer function, then call it
                            if (mod && mod[initializer]) {
                                //if the function has a return value, then use it as the data
                                mod = mod[initializer].apply(mod, initialArgs || []) || mod;
                            }
                        }

                        //update the data that we are binding against
                        extendedContext.$module = mod;
                        templateBinding.data(mod);
                    });
                }
            },
            disposeWhenNodeIsRemoved: element
        });

        //optionally call module disposal when removing an element
        ko.utils.domNodeDisposal.addDisposeCallback(element, disposeModule);

        return { controlsDescendantBindings: true };
    },
    baseDir: "",

    initializer: "initialize",

    disposeMethod: "dispose",

    templateProperty: ""
};

//support KO 2.0 that did not export ko.virtualElements
if (ko.virtualElements) {
    ko.virtualElements.allowedBindings.module = true;
}


//an AMD template engine that uses the text plugin to pull templates
(function(ko, require) {
    //get a new native template engine to start with
    var engine = new ko.nativeTemplateEngine(),
        sources = {};

    engine.defaultPath = "templates";
    engine.defaultSuffix = ".tmpl.html";
    engine.defaultRequireTextPluginName = "text";

    //create a template source that loads its template using the require.js text plugin
    ko.templateSources.requireTemplate = function(key) {
        this.key = key;
        this.template = ko.observable(" "); //content has to be non-falsey to start with
        this.requested = false;
        this.retrieved = false;
    };

    ko.templateSources.requireTemplate.prototype.text = function(value) {
        //when the template is retrieved, check if we need to load it
        if (!this.requested && this.key) {
            require([engine.defaultRequireTextPluginName + "!" + addTrailingSlash(engine.defaultPath) + this.key + engine.defaultSuffix], function(templateContent) {
                this.retrieved = true;
                this.template(templateContent);
            }.bind(this));

            this.requested = true;
        }

        //if template is currently empty, then clear it
        if (!this.key) {
            this.template("");
        }

        //always return the current template
        if (arguments.length === 0) {
            return this.template();
        }
    };

    //our engine needs to understand when to create a "requireTemplate" template source
    engine.makeTemplateSource = function(template, doc) {
        var el;

        //if a name is specified
        if (typeof template === "string") {
            //if there is an element with this id and it is a script tag, then use it
            el = (doc || document).getElementById(template);

            if (el && el.tagName.toLowerCase() === "script") {
                return new ko.templateSources.domElement(el);
            }

            //otherwise pull the template in using the AMD loader's text plugin
            if (!(template in sources)) {
                sources[template] = new ko.templateSources.requireTemplate(template);
            }

            //keep a single template source instance for each key, so everyone depends on the same observable
            return sources[template];
        }
        //if there is no name (foreach/with) use the elements as the template, as normal
        else if (template && (template.nodeType === 1 || template.nodeType === 8)) {
            return new ko.templateSources.anonymousTemplate(template);
        }
    };

    //override renderTemplate to properly handle afterRender prior to template being available
    engine.renderTemplate = function(template, bindingContext, options, templateDocument) {
        var templateSource,
            existingAfterRender = options && options.afterRender,
            localTemplate = options && options.templateProperty && bindingContext.$module && bindingContext.$module[options.templateProperty];

        //restore the original afterRender, if necessary
        if (existingAfterRender) {
            existingAfterRender = options.afterRender = options.afterRender.original || options.afterRender;
        }

        //if a module is being loaded, and that module has the template property (of type `string` or `function`) - use that as the source of the template.
        if (localTemplate && (typeof localTemplate === "function" || typeof localTemplate === "string")) {
            templateSource = {
                text: function() {
                    return typeof localTemplate === "function" ? localTemplate.call(bindingContext.$module) : localTemplate;
                }
            };
        }
        else {
            templateSource = engine.makeTemplateSource(template, templateDocument);
        }

        //wrap the existing afterRender, so it is not called until template is actually retrieved
        if (typeof existingAfterRender === "function" && templateSource instanceof ko.templateSources.requireTemplate && !templateSource.retrieved) {
            options.afterRender = function() {
                if (templateSource.retrieved) {
                    existingAfterRender.apply(this, arguments);
                }
            };

            //keep track of the original, so we don't double-wrap the function when template name changes
            options.afterRender.original = existingAfterRender;
        }

        return engine.renderTemplateSource(templateSource, bindingContext, options, templateDocument);
    };

    //expose the template engine at least to be able to customize the path/suffix/plugin at run-time
    ko.amdTemplateEngine = engine;

    //make this new template engine our default engine
    ko.setTemplateEngine(engine);

})(ko, require);


});