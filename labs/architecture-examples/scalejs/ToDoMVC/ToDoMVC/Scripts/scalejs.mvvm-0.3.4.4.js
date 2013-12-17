
// knockout-classBindingProvider 0.5.0 | (c) 2013 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
;(function (factory) {
    //AMD
    if (typeof define === "function" && define.amd) {
        define('scalejs.mvvm/classBindingProvider',["knockout", "exports"], factory);
        //normal script tag
    } else {
        factory(ko);
    }
}(function (ko, exports, undefined) {
    var objectMap = function (source, mapping) {
        var target, prop;

        if (!source) {
            return source;
        }

        target = {};
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                target[prop] = mapping(source[prop], prop, source);
            }
        }
        return target;
    };

    var makeValueAccessor = function (value) {
        return function () {
            return value;
        };
    };

    // Make Knockout think that we're using observable view models by adding a "_subscribable" function to all binding contexts.
    // This makes Knockout watch any observables accessed in the getBindingAccessors function.
    // Hopefully this hack will be unnecessary in later versions.
    if (ko.version >= "3.0.0") {
        (function () {
            // Create and retrieve a binding context object
            var dummyDiv = document.createElement('div');
            ko.applyBindings(null, dummyDiv);
            var context = ko.contextFor(dummyDiv);

            // Add a dummy _subscribable, with a dummy _addNode, to the binding context prototype
            var isMinified = !ko.storedBindingContextForNode,
                subscribableName = isMinified ? 'A' : '_subscribable',
                addNodeName = isMinified ? 'wb' : '_addNode',
                dummySubscribable = function () { };
            dummySubscribable[addNodeName] = dummySubscribable;
            context.constructor.prototype[subscribableName] = dummySubscribable;

            ko.cleanNode(dummyDiv);
        })();
    }

    //a bindingProvider that uses something different than data-bind attributes
    //  bindings - an object that contains the binding classes
    //  options - is an object that can include "attribute", "virtualAttribute", bindingRouter, and "fallback" options
    var classBindingsProvider = function (bindings, options) {
        var existingProvider = new ko.bindingProvider();

        options = options || {};

        //override the attribute
        this.attribute = options.attribute || "data-class";

        //override the virtual attribute
        this.virtualAttribute = "ko " + (options.virtualAttribute || "class") + ":";

        //fallback to the existing binding provider, if bindings are not found
        this.fallback = options.fallback;

        //this object holds the binding classes
        this.bindings = bindings || {};

        //returns a binding class, given the class name and the bindings object
        this.bindingRouter = options.bindingRouter || function (className, bindings) {
            var i, j, classPath, bindingObject;

            //if the class name matches a property directly, then return it
            if (bindings[className]) {
                return bindings[className];
            }

            //search for sub-properites that might contain the bindings
            classPath = className.split(".");
            bindingObject = bindings;

            for (i = 0, j = classPath.length; i < j; i++) {
                bindingObject = bindingObject[classPath[i]];
            }

            return bindingObject;
        };

        //allow bindings to be registered after instantiation
        this.registerBindings = function (newBindings) {
            ko.utils.extend(this.bindings, newBindings);
        };

        //determine if an element has any bindings
        this.nodeHasBindings = function (node) {
            var result, value;

            if (node.nodeType === 1) {
                result = node.getAttribute(this.attribute);
            }
            else if (node.nodeType === 8) {
                value = "" + node.nodeValue || node.text;
                result = value.indexOf(this.virtualAttribute) > -1;
            }

            if (!result && this.fallback) {
                result = existingProvider.nodeHasBindings(node);
            }

            return result;
        };

        //return the bindings given a node and the bindingContext
        this.getBindingsFunction = function (getAccessors) {
            return function (node, bindingContext) {
                var i, j, bindingAccessor, binding,
                    result = {},
                    value, index,
                    classes = "";

                if (node.nodeType === 1) {
                    classes = node.getAttribute(this.attribute);
                }
                else if (node.nodeType === 8) {
                    value = "" + node.nodeValue || node.text;
                    index = value.indexOf(this.virtualAttribute);

                    if (index > -1) {
                        classes = value.substring(index + this.virtualAttribute.length);
                    }
                }

                if (classes) {
                    classes = classes.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "").replace(/(\s|\u00A0){2,}/g, " ").split(' ');
                    //evaluate each class, build a single object to return
                    for (i = 0, j = classes.length; i < j; i++) {
                        bindingAccessor = this.bindingRouter(classes[i], this.bindings);
                        if (bindingAccessor) {
                            binding = typeof bindingAccessor == "function" ? bindingAccessor.call(bindingContext.$data, bindingContext, classes) : bindingAccessor;
                            if (getAccessors)
                                binding = objectMap(binding, makeValueAccessor);
                            ko.utils.extend(result, binding);
                        } else {
                            if (options.log) {
                                options.log('No binding function provided for data class "' +
                                            classes[i] + '" in element ',
                                            node,
                                            '\nMake sure data class is spelled correctly ' +
                                            'and that it\'s binding function is registered.');
                            }
                        }
                    }
                }
                else if (this.fallback) {
                    result = existingProvider[getAccessors ? 'getBindingAccessors' : 'getBindings'](node, bindingContext);
                }

                if (options.log) {
                    for (bindingName in result) {
                        if (result.hasOwnProperty(bindingName) &&
                                bindingName !== "_ko_property_writers" &&
                                    bindingName !== 'valueUpdate' &&
                                        bindingName !== 'optionsText' &&
                                            !ko.bindingHandlers[bindingName]) {
                            if (binding) {
                                options.log('Unknown binding handler "' + bindingName + '" found in element',
                                            node,
                                            ' defined in data-class "' + classes + '" as',
                                            binding,
                                            '\nMake sure that binding handler\'s name is spelled correctly ' +
                                            'and that it\'s properly registered. ' +
                                            '\nThe binding will be ignored.');
                            } else {
                                options.log('Unknown binding handler "' + bindingName + '" in',
                                            node,
                                            '\nMake sure that it\'s name spelled correctly and that it\'s ' +
                                            'properly registered. ' +
                                            '\nThe binding will be ignored.');
                            }
                        }
                    }
                }

                return result;
            };
        };

        this.getBindings = this.getBindingsFunction(false);
        this.getBindingAccessors = this.getBindingsFunction(true);
    };

    if (!exports) {
        ko.classBindingProvider = classBindingsProvider;
    }

    return classBindingsProvider;
}));
/*global define,document*/
define('scalejs.mvvm/htmlTemplateSource',[
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    

    var toArray = core.array.toArray,
        has = core.object.has,
        templateEngine = new ko.nativeTemplateEngine(),
        templates = {
            data: {}
        };

    function registerTemplates(templatesHtml) {
        // iterate through all templates (e.g. children of root in templatesHtml)
        // for every child get its templateId and templateHtml 
        // and add it to 'templates'            
        var div = document.createElement('div');
        div.innerHTML = templatesHtml;
        toArray(div.childNodes).forEach(function (childNode) {
            if (childNode.nodeType === 1 && has(childNode, 'id')) {
                templates[childNode.id] = childNode.innerHTML;
            }
        });
    }

    function makeTemplateSource(templateId) {
        function data(key, value) {
            if (!has(templates.data, templateId)) {
                templates.data[templateId] = {};
            }

            // if called with only key then return the associated value
            if (arguments.length === 1) {
                return templates.data[templateId][key];
            }

            // if called with key and value then store the value
            templates.data[templateId][key] = value;
        }

        function text(value) {
            // if no value return the template content since that's what KO wants
            if (arguments.length === 0) {
                return templates[templateId];
            }

            throw new Error('An attempt to override template "' + templateId + '" with content "' + value + '" ' +
                            'Template overriding is not supported.');
        }

        return {
            data: data,
            text: text
        };
    }

    templateEngine.makeTemplateSource = makeTemplateSource;

    ko.setTemplateEngine(templateEngine);

    return {
        registerTemplates: registerTemplates
    };
});

/*global define,document,setTimeout*/
/*jslint nomen: true*/
/// <reference path="../Scripts/knockout-2.2.1.debug.js" />
define('scalejs.mvvm/selectableArray',[
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    /// <param name="ko" value="window.ko"/>
    

    var isObservable = ko.isObservable,
        unwrap = ko.utils.unwrapObservable,
        observable = ko.observable,
        computed = ko.computed,
        has = core.object.has,
        array = core.array;

    return function selectableArray(items, opts) {
        /*selectable(items, {
            selectedItem: selectedTile,
            selectionPolicy: 'single',
            isSelectedPath: 'isSelected'
        });*/
        opts = opts || {};

        var selectedItem = opts.selectedItem || observable(),
            selectionPolicy = opts.selectionPolicy || 'single',
            result;

        function ensureIsSelectedExists(item) {
            // if item has isSelected property which is observable and selectedPath is not set
            // then nothing to do
            if (isObservable(item.isSelected) && (!has(opts.isSelectedPath) || opts.isSelectedPath === 'isSelected')) {
                return;
            }

            if (isObservable(item.isSelected)) {
                throw new Error('item has observable `isSelected` property but `isSelectedPath` specified as "' +
                                opts.isSelectedPath + '". `selectable` uses `isSelected` property of an item ' +
                                'to determine whether it\'s selected. Either don\'t specify `isSelectedPath` or ' +
                                'rename `isSelected` property to something else.');
            }

            if (item.hasOwnProperty('isSelected')) {
                throw new Error('item has non-observable `isSelected` property. `selectable` uses `isSelected` ' +
                                'property of an item to determine whether it\'s selected. Either make `isSelected` ' +
                                'observable or rename it.');
            }

            item.isSelected = observable();

            // subscribe isSelectedPath property to isSelected
            if (has(opts.isSelectedPath) &&
                    opts.isSelectedPath !== 'isSelected' &&
                        !isObservable(item[opts.isSelectedPath])) {
                throw new Error('item\'s property "' + opts.isSelectedPath + '" specified by `isSelectedPath` ' +
                                ' isn\'t observable. Either make it observable or specify different property in ' +
                                ' `isSelectedPath`');
            }

            if (has(opts.isSelectedPath)) {
                item.isSelected = item[opts.isSelectedPath];
            }

            item.isSelected.subscribe(function (newValue) {
                if (newValue) {
                    selectedItem(item);
                } else {
                    if (selectedItem() === item) {
                        selectedItem(undefined);
                    }
                }
            });
        }

        // subscribe to isSelected property of every item if isSelectedPath is specified
        if (isObservable(items)) {
            result = computed(function () {
                var unwrapped = unwrap(items);
                unwrapped.forEach(ensureIsSelectedExists);
                return array.copy(unwrapped);
            });
        } else {
            items.forEach(ensureIsSelectedExists);
            result = array.copy(items);
        }

        selectedItem.subscribe(function (newItem) {
            unwrap(result).forEach(function (item) {
                item.isSelected(item === newItem);
            });

            if (selectionPolicy === 'deselect' && newItem) {
                setTimeout(function () { selectedItem(undefined); }, 0);
            }
        });

        result.selectedItem = selectedItem;

        return result;
    };
});

/*global define*/
define('scalejs.mvvm/ko.utils',[
    'scalejs!core',
    'knockout'
], function (
    core,
    ko
) {
    

    function cloneNodes(nodesArray, shouldCleanNodes) {
        return core.array.toArray(nodesArray).map(function (node) {
            var clonedNode = node.cloneNode(true);
            return shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode;
        });
    }

    return {
        cloneNodes: cloneNodes
    };
});

/*global define,document*/
/*jslint nomen: true*/
define('scalejs.mvvm/mvvm',[
    'knockout',
    'knockout.mapping',
    'scalejs!core',
    'scalejs.mvvm/classBindingProvider',
    './htmlTemplateSource',
    './selectableArray',
    './ko.utils'
], function (
    ko,
    mapping,
    core,
    ClassBindingProvider,
    htmlTemplateSource,
    selectableArray,
    koUtils
) {
    

    var merge = core.object.merge,
        toArray = core.array.toArray,
        classBindingProvider = new ClassBindingProvider({}, {
            log: core.log.warn,
            fallback: true
        }),
        root = ko.observable();

    ko.bindingProvider.instance = classBindingProvider;

    function observable(initialValue) {
        return ko.observable(initialValue);
    }

    function observableArray(initialValue) {
        return ko.observableArray(initialValue);
    }

    function computed(func) {
        return ko.computed(func);
    }

    function toJson(viewModel) {
        // Extracts underlying value from observables
        return mapping.toJSON(viewModel);
    }

    function toObject(viewModel) {
        return JSON.parse(toJson(viewModel));
    }

    function registerBindings() {
        toArray(arguments).forEach(classBindingProvider.registerBindings.bind(classBindingProvider));
    }

    function toViewModel(data, viewModel, mappings) {
        var knockoutStyleMappings = Object.keys(mappings).reduce(function (o, k) {
            return merge(o, {
                k: k,
                create: function (options) { return mappings[k](options.data); }
            });
        }, {});

        return mapping.fromJS(data, knockoutStyleMappings, viewModel);
    }

    function registerTemplates() {
        toArray(arguments).forEach(htmlTemplateSource.registerTemplates);
    }

    function dataBinding(name, data) {
        var binding = {};

        binding[name] = data;

        return binding;
    }

    function template(name, data) {
        return dataBinding('template', {
            name: name,
            data: data
        });
    }

    function dataClass(name, data) {
        return {
            dataClass: name,
            viewmodel: data
        };
    }

    function init() {
        var body = document.getElementsByTagName('body')[0];

        body.innerHTML = '<!-- ko class: scalejs-shell --><!-- /ko -->';
        registerBindings({
            'scalejs-shell': function (context) {
                return {
                    render: context.$data.root
                };
            }
        });

        ko.applyBindings({ root: root });
    }

    return {
        core: {
            mvvm: {
                toJson: toJson,
                registerBindings: registerBindings,
                registerTemplates: registerTemplates,
                dataClass: dataClass,
                template: template,
                dataBinding: dataBinding,
                selectableArray: selectableArray,
                ko: {
                    utils: koUtils
                }
            }
        },
        sandbox: {
            mvvm: {
                observable: observable,
                observableArray: observableArray,
                computed: computed,
                registerBindings: registerBindings,
                registerTemplates: registerTemplates,
                toJson: toJson,
                toViewModel: toViewModel,
                toObject: toObject,
                dataClass: dataClass,
                template: template,
                dataBinding: dataBinding,
                selectableArray: selectableArray,
                root: root
            }
        },
        init: init
    };
});

/*global define*/
define('scalejs.bindings/change',[
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    

    var is = core.type.is,
        has = core.object.has;

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, viewModel) {
        if (!has(viewModel)) {
            return;
        }

        var unwrap = ko.utils.unwrapObservable,
            value = valueAccessor(),
            properties = unwrap(value),
            property,
            handler,
            //currentValue,
            changeHandler;

        function bindPropertyChangeHandler(h, currentValue) {
            return function (newValue) {
                if (newValue !== currentValue) {
                    currentValue = newValue;
                    h.call(viewModel, newValue, element);
                }
            };
        }

        function subscribeChangeHandler(property, changeHandler) {
            ko.computed({
                read: function () {
                    var val = unwrap(viewModel[property]);
                    changeHandler(val);
                },
                disposeWhenNodeIsRemoved: element
            });
        }

        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                handler = properties[property];
                if (is(handler.initial, 'function')) {
                    handler.initial.apply(viewModel, [unwrap(viewModel[property]), element]);
                }
                if (is(handler.update, 'function')) {
                    changeHandler = bindPropertyChangeHandler(handler.update, unwrap(viewModel[property]));
                }
                if (is(handler, 'function')) {
                    changeHandler = bindPropertyChangeHandler(handler, unwrap(viewModel[property]));
                }
                if (changeHandler) {
                    subscribeChangeHandler(property, changeHandler);
                }
            }
        }
    }
    /*jslint unparam: false*/

    return {
        init: init
    };
});

/*global define,setTimeout,window*/
/// <reference path="../Scripts/_references.js" />
define('scalejs.bindings/render',[
    'scalejs!core',
    'knockout',
    'scalejs.functional'
], function (
    core,
    ko
) {
    /// <param name="ko" value="window.ko" />
    

    var is = core.type.is,
        has = core.object.has,
        unwrap = ko.utils.unwrapObservable,
        complete = core.functional.builders.complete,
        $DO = core.functional.builder.$DO;

    function init() {
        return { 'controlsDescendantBindings': true };
    }

    /*jslint unparam: true*/
    function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = unwrap(valueAccessor()),
            bindingAccessor,
            binding,
            oldBinding,
            inTransitions = [],
            outTransitions = [],
            context,
            render;

        function applyBindings(completed) {
            if (binding) {
                ko.applyBindingsToNode(element, binding, viewModel);
            } else {
                ko.utils.emptyDomNode(element);
            }

            window.requestAnimationFrame(completed);
            //setTimeout(completed, 10);
        }

        oldBinding = ko.utils.domData.get(element, 'binding');

        if (value) {
            if (is(value.dataClass, 'string')) {
                // if dataClass is specified then get the binding from the bindingRouter
                bindingAccessor = ko.bindingProvider.instance.bindingRouter(value.dataClass);
                if (!bindingAccessor) {
                    throw new Error('Don\'t know how to render binding "' + value.dataClass +
                                    '" - no such binding registered. ' +
                                    'Either register the bindng or correct its name.');
                }

                if (bindingAccessor) {
                    binding = is(bindingAccessor, 'function')
                            ? bindingAccessor.call(value.viewmodel || viewModel, bindingContext)
                            : bindingAccessor;
                }

            } else {
                // otherwise whole object is the binding
                binding = is(value, 'function') ? value.call(viewModel, bindingContext) : value;
            }
        }

        if (has(oldBinding, 'transitions', 'outTransitions')) {
            outTransitions = oldBinding.transitions.outTransitions.map(function (t) { return $DO(t); });
        }

        if (has(binding, 'transitions', 'inTransitions')) {
            inTransitions = binding.transitions.inTransitions.map(function (t) { return $DO(t); });
        }

        render = complete.apply(null, outTransitions.concat($DO(applyBindings)).concat(inTransitions));

        context = {
            getElement: function () {
                return element;
            }
        };

        render.call(context);

        ko.utils.domData.set(element, 'binding', binding);
    }
    /*jslint unparam: false*/

    return {
        init: init,
        update: update
    };
});

/*global define*/
define('scalejs.mvvm',[
    'scalejs!core',
    'knockout',
    'scalejs.mvvm/mvvm',
    './scalejs.bindings/change',
    './scalejs.bindings/render'
], function (
    core,
    ko,
    mvvm,
    changeBinding,
    renderBinding
) {
    

    ko.bindingHandlers.change = changeBinding;
    ko.bindingHandlers.render = renderBinding;

    ko.virtualElements.allowedBindings.change = true;
    ko.virtualElements.allowedBindings.render = true;

    mvvm.init();

    core.registerExtension(mvvm);
});

