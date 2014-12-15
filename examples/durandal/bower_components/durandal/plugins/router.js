define(['../system', '../viewModel', '../app'], function (system, viewModel, app) {

    //NOTE: Sammy.js is not required by the core of Durandal.
    //However, this plugin leverages it to enable navigation.

    var routesByPath = {},
        allRoutes = ko.observableArray([]),
        visibleRoutes = ko.observableArray([]),
        ready = ko.observable(false),
        isNavigating = ko.observable(false),
        sammy,
        router,
        previousRoute,
        previousModule,
        cancelling = false,
        activeItem = viewModel.activator(),
        activeRoute = ko.observable(),
        navigationDefaultRoute,
        queue = [],
        skipRouteUrl;

    var tryActivateRouter = function () {
        tryActivateRouter = system.noop;
        ready(true);
        router.dfd.resolve();
        delete router.dfd;
    };

    activeItem.settings.areSameItem = function (currentItem, newItem, activationData) {
        return false;
    };

    function redirect(url) {
        isNavigating(false);
        system.log('Redirecting');
        router.navigateTo(url);
    }

    function cancelNavigation() {
        cancelling = true;
        system.log('Cancelling Navigation');

        if (previousRoute) {
            sammy.setLocation(previousRoute);
        }

        cancelling = false;
        isNavigating(false);

        var routeAttempted = sammy.last_location[1].split('#/')[1];

        if (previousRoute || !routeAttempted) {
            tryActivateRouter();
        } else if (routeAttempted != navigationDefaultRoute) {
            window.location.replace("#/" + navigationDefaultRoute);
        } else {
            tryActivateRouter();
        }
    }

    function completeNavigation(routeInfo, params, module) {
        activeRoute(routeInfo);
        router.onNavigationComplete(routeInfo, params, module);
        previousModule = module;
        previousRoute = sammy.last_location[1].replace('/', '');
        tryActivateRouter();
    }

    function activateRoute(routeInfo, params, module) {
        system.log('Activating Route', routeInfo, module, params);

        activeItem.activateItem(module, params).then(function (succeeded) {
            if (succeeded) {
                completeNavigation(routeInfo, params, module);
            } else {
                cancelNavigation();
            }
        });
    }

    function shouldStopNavigation() {
        return cancelling || (sammy.last_location[1].replace('/', '') == previousRoute);
    }

    function handleGuardedRoute(routeInfo, params, instance) {
        var resultOrPromise = router.guardRoute(routeInfo, params, instance);
        if (resultOrPromise) {
            if (resultOrPromise.then) {
                resultOrPromise.then(function(result) {
                    if (result) {
                        if (typeof result == 'string') {
                            redirect(result);
                        } else {
                            activateRoute(routeInfo, params, instance);
                        }
                    } else {
                        cancelNavigation();
                    }
                });
            } else {
                if (typeof resultOrPromise == 'string') {
                    redirect(resultOrPromise);
                } else {
                    activateRoute(routeInfo, params, instance);
                }
            }
        } else {
            cancelNavigation();
        }
    }

    function dequeueRoute() {
        if (isNavigating()) {
            return;
        }

        var next = queue.shift();
        queue = [];

        if (!next) {
            return;
        }

        isNavigating(true);

        system.acquire(next.routeInfo.moduleId).then(function(module) {
            next.params.routeInfo = next.routeInfo;
            next.params.router = router;

            var instance = router.getActivatableInstance(next.routeInfo, next.params, module);

            if (router.guardRoute) {
                handleGuardedRoute(next.routeInfo, next.params, instance);
            } else {
                activateRoute(next.routeInfo, next.params, instance);
            }
        });
    }

    function queueRoute(routeInfo, params) {
        queue.unshift({
            routeInfo: routeInfo,
            params: params
        });

        dequeueRoute();
    }

    function ensureRoute(route, params) {
        var routeInfo = routesByPath[route];

        if (shouldStopNavigation()) {
            return;
        }

        if (!routeInfo) {
            if (!router.autoConvertRouteToModuleId) {
                router.handleInvalidRoute(route, params);
                return;
            }

            routeInfo = {
                moduleId: router.autoConvertRouteToModuleId(route, params),
                name: router.convertRouteToName(route)
            };
        }

        queueRoute(routeInfo, params);
    }

    function handleDefaultRoute() {
        ensureRoute(navigationDefaultRoute, this.params || {});
    }

    function handleMappedRoute() {
        ensureRoute(this.app.last_route.path.toString(), this.params || {});
    }

    function handleWildCardRoute() {
        var params = this.params || {}, route;

        if (router.autoConvertRouteToModuleId) {
            var fragment = this.path.split('#/');

            if (fragment.length == 2) {
                var parts = fragment[1].split('/');
                route = parts[0];
                params.splat = parts.splice(1);
                ensureRoute(route, params);
                return;
            }
        }

        router.handleInvalidRoute(this.app.last_location[1], params);
    }

    function configureRoute(routeInfo) {
        router.prepareRouteInfo(routeInfo);

        routesByPath[routeInfo.url.toString()] = routeInfo;
        allRoutes.push(routeInfo);

        if (routeInfo.visible) {
            routeInfo.isActive = ko.computed(function () {
                return ready() && activeItem() && activeItem().__moduleId__ == routeInfo.moduleId;
            });

            visibleRoutes.push(routeInfo);
        }

        return routeInfo;
    }

    return router = {
        ready: ready,
        allRoutes: allRoutes,
        visibleRoutes: visibleRoutes,
        isNavigating: isNavigating,
        activeItem: activeItem,
        activeRoute: activeRoute,
        afterCompose: function () {
            setTimeout(function () {
                isNavigating(false);
                dequeueRoute();
            }, 10);
        },
        getActivatableInstance: function (routeInfo, params, module) {
            if (typeof module == 'function') {
                return new module();
            } else {
                return module;
            }
        },
        useConvention: function (rootPath) {
            rootPath = rootPath == null ? 'viewmodels' : rootPath;
            if (rootPath) {
                rootPath += '/';
            }
            router.convertRouteToModuleId = function (url) {
                return rootPath + router.stripParameter(url);
            };
        },
        stripParameter: function (val) {
            var colonIndex = val.indexOf(':');
            var length = colonIndex > 0 ? colonIndex - 1 : val.length;
            return val.substring(0, length);
        },
        handleInvalidRoute: function (route, params) {
            system.log('No Route Found', route, params);
        },
        onNavigationComplete: function (routeInfo, params, module) {
            if (app.title) {
                document.title = routeInfo.caption + " | " + app.title;
            } else {
                document.title = routeInfo.caption;
            }
        },
        navigateBack: function () {
            window.history.back();
        },
        navigateTo: function (url, option) {
            option = option || 'trigger';

            switch (option.toLowerCase()) {
                case 'skip':
                    skipRouteUrl = url;
                    sammy.setLocation(url);
                    break;
                case 'replace':
                    window.location.replace(url);
                    break;
                default:
                    if (sammy.lookupRoute('get', url)) {
                        sammy.setLocation(url);
                    } else {
                        window.location.href = url;
                    }
                    break;
            }
        },
        replaceLocation: function (url) {
            this.navigateTo(url, 'replace');
        },
        convertRouteToName: function (route) {
            var value = router.stripParameter(route);
            return value.substring(0, 1).toUpperCase() + value.substring(1);
        },
        convertRouteToModuleId: function (route) {
            return router.stripParameter(route);
        },
        prepareRouteInfo: function (info) {
            if (!(info.url instanceof RegExp)) {
                info.name = info.name || router.convertRouteToName(info.url);
                info.moduleId = info.moduleId || router.convertRouteToModuleId(info.url);
                info.hash = info.hash || '#/' + info.url;
            }

            info.caption = info.caption || info.name;
            info.settings = info.settings || {};
        },
        mapAuto: function (path) {
            path = path || 'viewmodels';
            path += '/';

            router.autoConvertRouteToModuleId = function (url, params) {
                return path + router.stripParameter(url);
            };
        },
        mapNav: function (urlOrConfig, moduleId, name) {
            if (typeof urlOrConfig == "string") {
                return this.mapRoute(urlOrConfig, moduleId, name, true);
            }

            urlOrConfig.visible = true;
            return configureRoute(urlOrConfig);
        },
        mapRoute: function (urlOrConfig, moduleId, name, visible) {
            if (typeof urlOrConfig == "string") {
                return configureRoute({
                    url: urlOrConfig,
                    moduleId: moduleId,
                    name: name,
                    visible: visible
                });
            } else {
                return configureRoute(urlOrConfig);
            }
        },
        map: function (routeOrRouteArray) {
            if (!system.isArray(routeOrRouteArray)) {
                return configureRoute(routeOrRouteArray);
            }

            var configured = [];
            for (var i = 0; i < routeOrRouteArray.length; i++) {
                configured.push(configureRoute(routeOrRouteArray[i]));
            }
            return configured;
        },
        activate: function (defaultRoute) {
            return system.defer(function (dfd) {
                var processedRoute;

                router.dfd = dfd;
                navigationDefaultRoute = defaultRoute;

                sammy = Sammy(function (route) {
                    var unwrapped = allRoutes();

                    for (var i = 0; i < unwrapped.length; i++) {
                        var current = unwrapped[i];
                        route.get(current.url, handleMappedRoute);
                        processedRoute = this.routes.get[i];
                        routesByPath[processedRoute.path.toString()] = current;
                    }

                    route.get('#/', handleDefaultRoute);
                    route.get(/\#\/(.*)/, handleWildCardRoute);
                });

                sammy._checkFormSubmission = function () {
                    return false;
                };

                sammy.before(null, function(context) {
                    if (!skipRouteUrl) {
                        return true;
                    } else if (context.path === "/" + skipRouteUrl) {
                        skipRouteUrl = null;
                        return false;
                    } else {
                        throw new Error("Expected to skip url '" + skipRouteUrl + "', but found url '" + context.path + "'");
                    }
                });

                sammy.log = function () {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args.unshift('Sammy');
                    system.log.apply(system, args);
                };

                sammy.run('#/');
            }).promise();
        }
    };
});