/**
 * Durandal 2.0.1 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
/**
 * The composition module encapsulates all functionality related to visual composition.
 * @module composition
 * @requires system
 * @requires viewLocator
 * @requires binder
 * @requires viewEngine
 * @requires activator
 * @requires jquery
 * @requires knockout
 */
define(['durandal/system', 'durandal/viewLocator', 'durandal/binder', 'durandal/viewEngine', 'durandal/activator', 'jquery', 'knockout'], function (system, viewLocator, binder, viewEngine, activator, $, ko) {
    var dummyModel = {},
        activeViewAttributeName = 'data-active-view',
        composition,
        compositionCompleteCallbacks = [],
        compositionCount = 0,
        compositionDataKey = 'durandal-composition-data',
        partAttributeName = 'data-part',
        bindableSettings = ['model', 'view', 'transition', 'area', 'strategy', 'activationData'],
        visibilityKey = "durandal-visibility-data",
        composeBindings = ['compose:'];

    function getHostState(parent) {
        var elements = [];
        var state = {
            childElements: elements,
            activeView: null
        };

        var child = ko.virtualElements.firstChild(parent);

        while (child) {
            if (child.nodeType == 1) {
                elements.push(child);
                if (child.getAttribute(activeViewAttributeName)) {
                    state.activeView = child;
                }
            }

            child = ko.virtualElements.nextSibling(child);
        }

        if(!state.activeView){
            state.activeView = elements[0];
        }

        return state;
    }

    function endComposition() {
        compositionCount--;

        if (compositionCount === 0) {
            setTimeout(function(){
                var i = compositionCompleteCallbacks.length;

                while(i--) {
                    try{
                        compositionCompleteCallbacks[i]();
                    }catch(e){
                        system.error(e);
                    }
                }

                compositionCompleteCallbacks = [];
            }, 1);
        }
    }

    function cleanUp(context){
        delete context.activeView;
        delete context.viewElements;
    }

    function tryActivate(context, successCallback, skipActivation) {
        if(skipActivation){
            successCallback();
        } else if (context.activate && context.model && context.model.activate) {
            var result;

            try{
                if(system.isArray(context.activationData)) {
                    result = context.model.activate.apply(context.model, context.activationData);
                } else {
                    result = context.model.activate(context.activationData);
                }

                if(result && result.then) {
                    result.then(successCallback, function(reason) {
                        system.error(reason);
                        successCallback();
                    });
                } else if(result || result === undefined) {
                    successCallback();
                } else {
                    endComposition();
                    cleanUp(context);
                }
            }
            catch(e){
                system.error(e);
            }
        } else {
            successCallback();
        }
    }

    function triggerAttach() {
        var context = this;

        if (context.activeView) {
            context.activeView.removeAttribute(activeViewAttributeName);
        }

        if (context.child) {
            try{
                if (context.model && context.model.attached) {
                    if (context.composingNewView || context.alwaysTriggerAttach) {
                        context.model.attached(context.child, context.parent, context);
                    }
                }

                if (context.attached) {
                    context.attached(context.child, context.parent, context);
                }

                context.child.setAttribute(activeViewAttributeName, true);

                if (context.composingNewView && context.model && context.model.detached) {
                    ko.utils.domNodeDisposal.addDisposeCallback(context.child, function () {
                        try{
                            context.model.detached(context.child, context.parent, context);
                        }catch(e2){
                            system.error(e2);
                        }
                    });
                }
            }catch(e){
                system.error(e);
            }
        }

        context.triggerAttach = system.noop;
    }

    function shouldTransition(context) {
        if (system.isString(context.transition)) {
            if (context.activeView) {
                if (context.activeView == context.child) {
                    return false;
                }

                if (!context.child) {
                    return true;
                }

                if (context.skipTransitionOnSameViewId) {
                    var currentViewId = context.activeView.getAttribute('data-view');
                    var newViewId = context.child.getAttribute('data-view');
                    return currentViewId != newViewId;
                }
            }

            return true;
        }

        return false;
    }

    function cloneNodes(nodesArray) {
        for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
            var clonedNode = nodesArray[i].cloneNode(true);
            newNodesArray.push(clonedNode);
        }
        return newNodesArray;
    }

    function replaceParts(context){
        var parts = cloneNodes(context.parts);
        var replacementParts = composition.getParts(parts, null, true);
        var standardParts = composition.getParts(context.child);

        for (var partId in replacementParts) {
            $(standardParts[partId]).replaceWith(replacementParts[partId]);
        }
    }

    function removePreviousView(context){
        var children = ko.virtualElements.childNodes(context.parent), i, len;

        if(!system.isArray(children)){
            var arrayChildren = [];
            for(i = 0, len = children.length; i < len; i++){
                arrayChildren[i] = children[i];
            }
            children = arrayChildren;
        }

        for(i = 1,len = children.length; i < len; i++){
            ko.removeNode(children[i]);
        }
    }

    function hide(view) {
        ko.utils.domData.set(view, visibilityKey, view.style.display);
        view.style.display = "none";
    }

    function show(view) {
        view.style.display = ko.utils.domData.get(view, visibilityKey);
    }

    function hasComposition(element){
        var dataBind = element.getAttribute('data-bind');
        if(!dataBind){
            return false;
        }

        for(var i = 0, length = composeBindings.length; i < length; i++){
            if(dataBind.indexOf(composeBindings[i]) > -1){
                return true;
            }
        }

        return false;
    }

    /**
     * @class CompositionTransaction
     * @static
     */
    var compositionTransaction = {
        /**
         * Registers a callback which will be invoked when the current composition transaction has completed. The transaction includes all parent and children compositions.
         * @method complete
         * @param {function} callback The callback to be invoked when composition is complete.
         */
        complete: function (callback) {
            compositionCompleteCallbacks.push(callback);
        }
    };

    /**
     * @class CompositionModule
     * @static
     */
    composition = {
        /**
         * An array of all the binding handler names (includeing :) that trigger a composition.
         * @property {string} composeBindings
         * @default ['compose:']
         */
        composeBindings:composeBindings,
        /**
         * Converts a transition name to its moduleId.
         * @method convertTransitionToModuleId
         * @param {string} name The name of the transtion.
         * @return {string} The moduleId.
         */
        convertTransitionToModuleId: function (name) {
            return 'transitions/' + name;
        },
        /**
         * The name of the transition to use in all compositions.
         * @property {string} defaultTransitionName
         * @default null
         */
        defaultTransitionName: null,
        /**
         * Represents the currently executing composition transaction.
         * @property {CompositionTransaction} current
         */
        current: compositionTransaction,
        /**
         * Registers a binding handler that will be invoked when the current composition transaction is complete.
         * @method addBindingHandler
         * @param {string} name The name of the binding handler.
         * @param {object} [config] The binding handler instance. If none is provided, the name will be used to look up an existing handler which will then be converted to a composition handler.
         * @param {function} [initOptionsFactory] If the registered binding needs to return options from its init call back to knockout, this function will server as a factory for those options. It will receive the same parameters that the init function does.
         */
        addBindingHandler:function(name, config, initOptionsFactory){
            var key,
                dataKey = 'composition-handler-' + name,
                handler;

            config = config || ko.bindingHandlers[name];
            initOptionsFactory = initOptionsFactory || function(){ return undefined;  };

            handler = ko.bindingHandlers[name] = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    if(compositionCount > 0){
                        var data = {
                            trigger:ko.observable(null)
                        };

                        composition.current.complete(function(){
                            if(config.init){
                                config.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                            }

                            if(config.update){
                                ko.utils.domData.set(element, dataKey, config);
                                data.trigger('trigger');
                            }
                        });

                        ko.utils.domData.set(element, dataKey, data);
                    }else{
                        ko.utils.domData.set(element, dataKey, config);

                        if(config.init){
                            config.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                        }
                    }

                    return initOptionsFactory(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var data = ko.utils.domData.get(element, dataKey);

                    if(data.update){
                        return data.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                    }

                    if(data.trigger){
                        data.trigger();
                    }
                }
            };

            for (key in config) {
                if (key !== "init" && key !== "update") {
                    handler[key] = config[key];
                }
            }
        },
        /**
         * Gets an object keyed with all the elements that are replacable parts, found within the supplied elements. The key will be the part name and the value will be the element itself.
         * @method getParts
         * @param {DOMElement\DOMElement[]} elements The element(s) to search for parts.
         * @return {object} An object keyed by part.
         */
        getParts: function(elements, parts, isReplacementSearch) {
            parts = parts || {};

            if (!elements) {
                return parts;
            }

            if (elements.length === undefined) {
                elements = [elements];
            }

            for (var i = 0, length = elements.length; i < length; i++) {
                var element = elements[i];

                if (element.getAttribute) {
                    if(!isReplacementSearch && hasComposition(element)){
                        continue;
                    }

                    var id = element.getAttribute(partAttributeName);
                    if (id) {
                        parts[id] = element;
                    }

                    if(!isReplacementSearch && element.hasChildNodes()){
                        composition.getParts(element.childNodes, parts);
                    }
                }
            }

            return parts;
        },
        cloneNodes:cloneNodes,
        finalize: function (context) {
            if(context.transition === undefined) {
                context.transition = this.defaultTransitionName;
            }

            if(!context.child && !context.activeView){
                if (!context.cacheViews) {
                    ko.virtualElements.emptyNode(context.parent);
                }

                context.triggerAttach();
                endComposition();
                cleanUp(context);
            }else if (shouldTransition(context)) {
                var transitionModuleId = this.convertTransitionToModuleId(context.transition);

                system.acquire(transitionModuleId).then(function (transition) {
                    context.transition = transition;

                    transition(context).then(function () {
                        if (!context.cacheViews) {
                            if(!context.child){
                                ko.virtualElements.emptyNode(context.parent);
                            }else{
                                removePreviousView(context);
                            }
                        }else if(context.activeView){
                            var instruction = binder.getBindingInstruction(context.activeView);
                            if(instruction && instruction.cacheViews != undefined && !instruction.cacheViews){
                                ko.removeNode(context.activeView);
                            }
                        }

                        context.triggerAttach();
                        endComposition();
                        cleanUp(context);
                    });
                }).fail(function(err){
                    system.error('Failed to load transition (' + transitionModuleId + '). Details: ' + err.message);
                });
            } else {
                if (context.child != context.activeView) {
                    if (context.cacheViews && context.activeView) {
                        var instruction = binder.getBindingInstruction(context.activeView);
                        if(!instruction || (instruction.cacheViews != undefined && !instruction.cacheViews)){
                            ko.removeNode(context.activeView);
                        }else{
                            hide(context.activeView);
                        }
                    }

                    if (!context.child) {
                        if (!context.cacheViews) {
                            ko.virtualElements.emptyNode(context.parent);
                        }
                    } else {
                        if (!context.cacheViews) {
                            removePreviousView(context);
                        }

                        show(context.child);
                    }
                }

                context.triggerAttach();
                endComposition();
                cleanUp(context);
            }
        },
        bindAndShow: function (child, context, skipActivation) {
            context.child = child;

            if (context.cacheViews) {
                context.composingNewView = (ko.utils.arrayIndexOf(context.viewElements, child) == -1);
            } else {
                context.composingNewView = true;
            }

            tryActivate(context, function () {
                if (context.binding) {
                    context.binding(context.child, context.parent, context);
                }

                if (context.preserveContext && context.bindingContext) {
                    if (context.composingNewView) {
                        if(context.parts){
                            replaceParts(context);
                        }

                        hide(child);
                        ko.virtualElements.prepend(context.parent, child);

                        binder.bindContext(context.bindingContext, child, context.model);
                    }
                } else if (child) {
                    var modelToBind = context.model || dummyModel;
                    var currentModel = ko.dataFor(child);

                    if (currentModel != modelToBind) {
                        if (!context.composingNewView) {
                            ko.removeNode(child);
                            viewEngine.createView(child.getAttribute('data-view')).then(function(recreatedView) {
                                composition.bindAndShow(recreatedView, context, true);
                            });
                            return;
                        }

                        if(context.parts){
                            replaceParts(context);
                        }

                        hide(child);
                        ko.virtualElements.prepend(context.parent, child);

                        binder.bind(modelToBind, child);
                    }
                }

                composition.finalize(context);
            }, skipActivation);
        },
        /**
         * Eecutes the default view location strategy.
         * @method defaultStrategy
         * @param {object} context The composition context containing the model and possibly existing viewElements.
         * @return {promise} A promise for the view.
         */
        defaultStrategy: function (context) {
            return viewLocator.locateViewForObject(context.model, context.area, context.viewElements);
        },
        getSettings: function (valueAccessor, element) {
            var value = valueAccessor(),
                settings = ko.utils.unwrapObservable(value) || {},
                activatorPresent = activator.isActivator(value),
                moduleId;

            if (system.isString(settings)) {
                if (viewEngine.isViewUrl(settings)) {
                    settings = {
                        view: settings
                    };
                } else {
                    settings = {
                        model: settings,
                        activate: true
                    };
                }

                return settings;
            }

            moduleId = system.getModuleId(settings);
            if (moduleId) {
                settings = {
                    model: settings,
                    activate: true
                };

                return settings;
            }

            if(!activatorPresent && settings.model) {
                activatorPresent = activator.isActivator(settings.model);
            }

            for (var attrName in settings) {
                if (ko.utils.arrayIndexOf(bindableSettings, attrName) != -1) {
                    settings[attrName] = ko.utils.unwrapObservable(settings[attrName]);
                } else {
                    settings[attrName] = settings[attrName];
                }
            }

            if (activatorPresent) {
                settings.activate = false;
            } else if (settings.activate === undefined) {
                settings.activate = true;
            }

            return settings;
        },
        executeStrategy: function (context) {
            context.strategy(context).then(function (child) {
                composition.bindAndShow(child, context);
            });
        },
        inject: function (context) {
            if (!context.model) {
                this.bindAndShow(null, context);
                return;
            }

            if (context.view) {
                viewLocator.locateView(context.view, context.area, context.viewElements).then(function (child) {
                    composition.bindAndShow(child, context);
                });
                return;
            }

            if (!context.strategy) {
                context.strategy = this.defaultStrategy;
            }

            if (system.isString(context.strategy)) {
                system.acquire(context.strategy).then(function (strategy) {
                    context.strategy = strategy;
                    composition.executeStrategy(context);
                }).fail(function(err){
                    system.error('Failed to load view strategy (' + context.strategy + '). Details: ' + err.message);
                });
            } else {
                this.executeStrategy(context);
            }
        },
        /**
         * Initiates a composition.
         * @method compose
         * @param {DOMElement} element The DOMElement or knockout virtual element that serves as the parent for the composition.
         * @param {object} settings The composition settings.
         * @param {object} [bindingContext] The current binding context.
         */
        compose: function (element, settings, bindingContext, fromBinding) {
            compositionCount++;

            if(!fromBinding){
                settings = composition.getSettings(function() { return settings; }, element);
            }

            if (settings.compositionComplete) {
                compositionCompleteCallbacks.push(function () {
                    settings.compositionComplete(settings.child, settings.parent, settings);
                });
            }

            compositionCompleteCallbacks.push(function () {
                if(settings.composingNewView && settings.model && settings.model.compositionComplete){
                    settings.model.compositionComplete(settings.child, settings.parent, settings);
                }
            });

            var hostState = getHostState(element);

            settings.activeView = hostState.activeView;
            settings.parent = element;
            settings.triggerAttach = triggerAttach;
            settings.bindingContext = bindingContext;

            if (settings.cacheViews && !settings.viewElements) {
                settings.viewElements = hostState.childElements;
            }

            if (!settings.model) {
                if (!settings.view) {
                    this.bindAndShow(null, settings);
                } else {
                    settings.area = settings.area || 'partial';
                    settings.preserveContext = true;

                    viewLocator.locateView(settings.view, settings.area, settings.viewElements).then(function (child) {
                        composition.bindAndShow(child, settings);
                    });
                }
            } else if (system.isString(settings.model)) {
                system.acquire(settings.model).then(function (module) {
                    settings.model = system.resolveObject(module);
                    composition.inject(settings);
                }).fail(function(err){
                    system.error('Failed to load composed module (' + settings.model + '). Details: ' + err.message);
                });
            } else {
                composition.inject(settings);
            }
        }
    };

    ko.bindingHandlers.compose = {
        init: function() {
            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var settings = composition.getSettings(valueAccessor, element);
            if(settings.mode){
                var data = ko.utils.domData.get(element, compositionDataKey);
                if(!data){
                    var childNodes = ko.virtualElements.childNodes(element);
                    data = {};

                    if(settings.mode === 'inline'){
                        data.view = viewEngine.ensureSingleElement(childNodes);
                    }else if(settings.mode === 'templated'){
                        data.parts = cloneNodes(childNodes);
                    }

                    ko.virtualElements.emptyNode(element);
                    ko.utils.domData.set(element, compositionDataKey, data);
                }

                if(settings.mode === 'inline'){
                    settings.view = data.view.cloneNode(true);
                }else if(settings.mode === 'templated'){
                    settings.parts = data.parts;
                }

                settings.preserveContext = true;
            }

            composition.compose(element, settings, bindingContext, true);
        }
    };

    ko.virtualElements.allowedBindings.compose = true;

    return composition;
});
