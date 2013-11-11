/**
 * Durandal 2.0.1 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
/**
 * Layers the widget sugar on top of the composition system.
 * @module widget
 * @requires system
 * @requires composition
 * @requires jquery
 * @requires knockout
 */
define(['durandal/system', 'durandal/composition', 'jquery', 'knockout'], function(system, composition, $, ko) {
    var kindModuleMaps = {},
        kindViewMaps = {},
        bindableSettings = ['model', 'view', 'kind'],
        widgetDataKey = 'durandal-widget-data';

    function extractParts(element, settings){
        var data = ko.utils.domData.get(element, widgetDataKey);

        if(!data){
            data = {
                parts:composition.cloneNodes(ko.virtualElements.childNodes(element))
            };

            ko.virtualElements.emptyNode(element);
            ko.utils.domData.set(element, widgetDataKey, data);
        }

        settings.parts = data.parts;
    }

    /**
     * @class WidgetModule
     * @static
     */
    var widget = {
        getSettings: function(valueAccessor) {
            var settings = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (system.isString(settings)) {
                return { kind: settings };
            }

            for (var attrName in settings) {
                if (ko.utils.arrayIndexOf(bindableSettings, attrName) != -1) {
                    settings[attrName] = ko.utils.unwrapObservable(settings[attrName]);
                } else {
                    settings[attrName] = settings[attrName];
                }
            }

            return settings;
        },
        /**
         * Creates a ko binding handler for the specified kind.
         * @method registerKind
         * @param {string} kind The kind to create a custom binding handler for.
         */
        registerKind: function(kind) {
            ko.bindingHandlers[kind] = {
                init: function() {
                    return { controlsDescendantBindings: true };
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var settings = widget.getSettings(valueAccessor);
                    settings.kind = kind;
                    extractParts(element, settings);
                    widget.create(element, settings, bindingContext, true);
                }
            };

            ko.virtualElements.allowedBindings[kind] = true;
            composition.composeBindings.push(kind + ':');
        },
        /**
         * Maps views and module to the kind identifier if a non-standard pattern is desired.
         * @method mapKind
         * @param {string} kind The kind name.
         * @param {string} [viewId] The unconventional view id to map the kind to.
         * @param {string} [moduleId] The unconventional module id to map the kind to.
         */
        mapKind: function(kind, viewId, moduleId) {
            if (viewId) {
                kindViewMaps[kind] = viewId;
            }

            if (moduleId) {
                kindModuleMaps[kind] = moduleId;
            }
        },
        /**
         * Maps a kind name to it's module id. First it looks up a custom mapped kind, then falls back to `convertKindToModulePath`.
         * @method mapKindToModuleId
         * @param {string} kind The kind name.
         * @return {string} The module id.
         */
        mapKindToModuleId: function(kind) {
            return kindModuleMaps[kind] || widget.convertKindToModulePath(kind);
        },
        /**
         * Converts a kind name to it's module path. Used to conventionally map kinds who aren't explicitly mapped through `mapKind`.
         * @method convertKindToModulePath
         * @param {string} kind The kind name.
         * @return {string} The module path.
         */
        convertKindToModulePath: function(kind) {
            return 'widgets/' + kind + '/viewmodel';
        },
        /**
         * Maps a kind name to it's view id. First it looks up a custom mapped kind, then falls back to `convertKindToViewPath`.
         * @method mapKindToViewId
         * @param {string} kind The kind name.
         * @return {string} The view id.
         */
        mapKindToViewId: function(kind) {
            return kindViewMaps[kind] || widget.convertKindToViewPath(kind);
        },
        /**
         * Converts a kind name to it's view id. Used to conventionally map kinds who aren't explicitly mapped through `mapKind`.
         * @method convertKindToViewPath
         * @param {string} kind The kind name.
         * @return {string} The view id.
         */
        convertKindToViewPath: function(kind) {
            return 'widgets/' + kind + '/view';
        },
        createCompositionSettings: function(element, settings) {
            if (!settings.model) {
                settings.model = this.mapKindToModuleId(settings.kind);
            }

            if (!settings.view) {
                settings.view = this.mapKindToViewId(settings.kind);
            }

            settings.preserveContext = true;
            settings.activate = true;
            settings.activationData = settings;
            settings.mode = 'templated';

            return settings;
        },
        /**
         * Creates a widget.
         * @method create
         * @param {DOMElement} element The DOMElement or knockout virtual element that serves as the target element for the widget.
         * @param {object} settings The widget settings.
         * @param {object} [bindingContext] The current binding context.
         */
        create: function(element, settings, bindingContext, fromBinding) {
            if(!fromBinding){
                settings = widget.getSettings(function() { return settings; }, element);
            }

            var compositionSettings = widget.createCompositionSettings(element, settings);

            composition.compose(element, compositionSettings, bindingContext);
        },
        /**
         * Installs the widget module by adding the widget binding handler and optionally registering kinds.
         * @method install
         * @param {object} config The module config. Add a `kinds` array with the names of widgets to automatically register. You can also specify a `bindingName` if you wish to use another name for the widget binding, such as "control" for example.
         */
        install:function(config){
            config.bindingName = config.bindingName || 'widget';

            if(config.kinds){
                var toRegister = config.kinds;

                for(var i = 0; i < toRegister.length; i++){
                    widget.registerKind(toRegister[i]);
                }
            }

            ko.bindingHandlers[config.bindingName] = {
                init: function() {
                    return { controlsDescendantBindings: true };
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var settings = widget.getSettings(valueAccessor);
                    extractParts(element, settings);
                    widget.create(element, settings, bindingContext, true);
                }
            };

            composition.composeBindings.push(config.bindingName + ':');
            ko.virtualElements.allowedBindings[config.bindingName] = true;
        }
    };

    return widget;
});
