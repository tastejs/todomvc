define(['./system', './composition'], function (system, composition) {

    var widgetPartAttribute = 'data-part',
        widgetPartSelector = '[' + widgetPartAttribute + ']';

    var kindModuleMaps = {},
        kindViewMaps = {},
        bindableSettings = ['model','view','kind'];

    var widget = {
        getParts: function(elements) {
            var parts = {};

            if (!system.isArray(elements)) {
                elements = [elements];
            }

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if (element.getAttribute) {
                    var id = element.getAttribute(widgetPartAttribute);
                    if (id) {
                        parts[id] = element;
                    }

                    var childParts = $(widgetPartSelector, element);

                    for (var j = 0; j < childParts.length; j++) {
                        var part = childParts.get(j);
                        parts[part.getAttribute(widgetPartAttribute)] = part;
                    }
                }
            }

            return parts;
        },
        getSettings: function(valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (typeof value == 'string') {
                return value;
            } else {
                for (var attrName in value) {
                    if (ko.utils.arrayIndexOf(bindableSettings, attrName) != -1) {
                        value[attrName] = ko.utils.unwrapObservable(value[attrName]);
                    } else {
                        value[attrName] = value[attrName];
                    }
                }
            }

            return value;
        },
        registerKind: function(kind) {
            ko.bindingHandlers[kind] = {
                init: function() {
                    return { controlsDescendantBindings: true };
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var settings = widget.getSettings(valueAccessor);
                    settings.kind = kind;
                    widget.create(element, settings, bindingContext);
                }
            };

            ko.virtualElements.allowedBindings[kind] = true;
        },
        mapKind: function(kind, viewId, moduleId) {
            if (viewId) {
                kindViewMaps[kind] = viewId;
            }

            if (moduleId) {
                kindModuleMaps[kind] = moduleId;
            }
        },
        convertKindToModuleId: function(kind) {
            return kindModuleMaps[kind] || 'durandal/widgets/' + kind + '/controller';
        },
        convertKindToViewId: function (kind) {
            return kindViewMaps[kind] || 'durandal/widgets/' + kind + '/view';
        },
        beforeBind: function(element, view, settings) {
            var replacementParts = widget.getParts(element);
            var standardParts = widget.getParts(view);

            for (var partId in replacementParts) {
                $(standardParts[partId]).replaceWith(replacementParts[partId]);
            }
        },
        createCompositionSettings: function(settings) {
            if (!settings.model) {
                settings.model = this.convertKindToModuleId(settings.kind);
            }

            if (!settings.view) {
                settings.view = this.convertKindToViewId(settings.kind);
            }

            settings.preserveContext = true;
            settings.beforeBind = this.beforeBind;

            return settings;
        },
        create: function (element, settings, bindingContext) {
            if (typeof settings == 'string') {
                settings = {
                    kind: settings
                };
            }

            var compositionSettings = widget.createCompositionSettings(settings);
            composition.compose(element, compositionSettings, bindingContext);
        }
    };

    ko.bindingHandlers.widget = {
        init: function() {
            return { controlsDescendantBindings: true };
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var settings = widget.getSettings(valueAccessor);
            widget.create(element, settings, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.widget = true;

    return widget;
});