define(['./viewLocator', './viewModelBinder', './viewEngine', './system', './viewModel'],
    function (viewLocator, viewModelBinder, viewEngine, system, viewModel) {

    var dummyModel = {},
        activeViewAttributeName = 'data-active-view';

    function shouldPerformActivation(settings) {
        return settings.model && settings.model.activate
            && ((composition.activateDuringComposition && settings.activate == undefined) || settings.activate);
    }

    function tryActivate(settings, successCallback) {
        if (shouldPerformActivation(settings)) {
            viewModel.activator().activateItem(settings.model).then(function (success) {
                if (success) {
                    successCallback();
                }
            });
        } else {
            successCallback();
        }
    }

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

        return state;
    }

    function afterContentSwitch(parent, newChild, settings) {
        if (settings.activeView) {
            settings.activeView.removeAttribute(activeViewAttributeName);
        }

        if (newChild) {
            if (settings.model && settings.model.viewAttached) {
                if (settings.composingNewView || settings.alwaysAttachView) {
                    settings.model.viewAttached(newChild);
                }
            }

            newChild.setAttribute(activeViewAttributeName, true);
        }

        if (settings.afterCompose) {
            settings.afterCompose(parent, newChild, settings);
        }
    }

    function shouldTransition(newChild, settings) {
        if (typeof settings.transition == 'string') {
            if (settings.activeView) {
                if (settings.activeView == newChild) {
                    return false;
                }

                if (!newChild) {
                    return true;
                }

                if (settings.skipTransitionOnSameViewId) {
                    var currentViewId = settings.activeView.getAttribute('data-view');
                    var newViewId = newChild.getAttribute('data-view');
                    return currentViewId != newViewId;
                }
            }

            return true;
        }

        return false;
    }

    var composition = {
        activateDuringComposition: false,
        convertTransitionToModuleId: function (name) {
            return 'durandal/transitions/' + name;
        },
        switchContent: function (parent, newChild, settings) {
            settings.transition = settings.transition || this.defaultTransitionName;

            if (shouldTransition(newChild, settings)) {
                var transitionModuleId = this.convertTransitionToModuleId(settings.transition);
                system.acquire(transitionModuleId).then(function (transition) {
                    settings.transition = transition;
                    transition(parent, newChild, settings).then(function () {
                        afterContentSwitch(parent, newChild, settings);
                    });
                });
            } else {
                if (newChild != settings.activeView) {
                    if (settings.cacheViews && settings.activeView) {
                        $(settings.activeView).css('display', 'none');
                    }

                    if (!newChild) {
                        if (!settings.cacheViews) {
                            ko.virtualElements.emptyNode(parent);
                        }
                    } else {
                        if (settings.cacheViews) {
                            if (settings.composingNewView) {
                                settings.viewElements.push(newChild);
                                ko.virtualElements.prepend(parent, newChild);
                            } else {
                                $(newChild).css('display', '');
                            }
                        } else {
                            ko.virtualElements.emptyNode(parent);
                            ko.virtualElements.prepend(parent, newChild);
                        }
                    }
                }

                afterContentSwitch(parent, newChild, settings);
            }
        },
        bindAndShow: function (element, view, settings) {
            if (settings.cacheViews) {
                settings.composingNewView = (ko.utils.arrayIndexOf(settings.viewElements, view) == -1);
            } else {
                settings.composingNewView = true;
            }

            tryActivate(settings, function () {
                if (settings.beforeBind) {
                    settings.beforeBind(element, view, settings);
                }

                if (settings.preserveContext && settings.bindingContext) {
                    if (settings.composingNewView) {
                        viewModelBinder.bindContext(settings.bindingContext, view, settings.model);
                    }
                } else if (view) {
                    var modelToBind = settings.model || dummyModel;
                    var currentModel = ko.dataFor(view);

                    if (currentModel != modelToBind) {
                        if (!settings.composingNewView) {
                            $(view).remove();
                            viewEngine.createView(view.getAttribute('data-view')).then(function(recreatedView) {
                                composition.bindAndShow(element, recreatedView, settings);
                            });
                            return;
                        }
                        viewModelBinder.bind(modelToBind, view);
                    }
                }

                composition.switchContent(element, view, settings);
            });
        },
        defaultStrategy: function (settings) {
            return viewLocator.locateViewForObject(settings.model, settings.viewElements);
        },
        getSettings: function (valueAccessor, element) {
            var value = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (typeof value == 'string') {
                return value;
            }

            var moduleId = system.getModuleId(value);
            if (moduleId) {
                return {
                    model: value
                };
            }

            for (var attrName in value) {
                value[attrName] = ko.utils.unwrapObservable(value[attrName]);
            }

            return value;
        },
        executeStrategy: function (element, settings) {
            settings.strategy(settings).then(function (view) {
                composition.bindAndShow(element, view, settings);
            });
        },
        inject: function (element, settings) {
            if (!settings.model) {
                this.bindAndShow(element, null, settings);
                return;
            }

            if (settings.view) {
                viewLocator.locateView(settings.view, settings.area, settings.viewElements).then(function (view) {
                    composition.bindAndShow(element, view, settings);
                });
                return;
            }

            if (settings.view !== undefined && !settings.view) {
                return;
            }

            if (!settings.strategy) {
                settings.strategy = this.defaultStrategy;
            }

            if (typeof settings.strategy == 'string') {
                system.acquire(settings.strategy).then(function (strategy) {
                    settings.strategy = strategy;
                    composition.executeStrategy(element, settings);
                });
            } else {
                this.executeStrategy(element, settings);
            }
        },
        compose: function (element, settings, bindingContext) {
            if (typeof settings == 'string') {
                if (viewEngine.isViewUrl(settings)) {
                    settings = {
                        view: settings
                    };
                } else {
                    settings = {
                        model: settings
                    };
                }
            }

            var moduleId = system.getModuleId(settings);
            if (moduleId) {
                settings = {
                    model: settings
                };
            }

            var hostState = getHostState(element);

            settings.bindingContext = bindingContext;
            settings.activeView = hostState.activeView;

            if (settings.cacheViews && !settings.viewElements) {
                settings.viewElements = hostState.childElements;
            }

            if (!settings.model) {
                if (!settings.view) {
                    this.bindAndShow(element, null, settings);
                } else {
                    settings.area = settings.area || 'partial';
                    settings.preserveContext = true;

                    viewLocator.locateView(settings.view, settings.area, settings.viewElements).then(function (view) {
                        composition.bindAndShow(element, view, settings);
                    });
                }
            } else if (typeof settings.model == 'string') {
                system.acquire(settings.model).then(function (module) {
                    if (typeof (module) == 'function') {
                        settings.model = new module(element, settings);
                    } else {
                        settings.model = module;
                    }

                    composition.inject(element, settings);
                });
            } else {
                composition.inject(element, settings);
            }
        }
    };

    ko.bindingHandlers.compose = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var settings = composition.getSettings(valueAccessor);
            composition.compose(element, settings, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.compose = true;

    return composition;
});