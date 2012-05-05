var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.ModuleLoader", ["js.core.UIComponent", "js.ui.ContentPlaceHolder",
        "require", "js.core.Module"],
        function (UIComponent, ContentPlaceHolder, require, Module) {
            var ModuleLoader = UIComponent.inherit({

                ctor: function (attributes) {
                    this.callBase();

                    this.$modules = {};
                },

                addChild: function (child) {
                    this.callBase();

                    if (child && child.className == "js.conf.Module") {
                        this.addModule(child.$);
                    }
                },

                addModule: function (module) {
                    rAppid._.defaults(module, {
                        name: null,
                        moduleClass: null,
                        route: null,
                        cacheInstance: true
                    });

                    if (!module.name && !module.route) {
                        throw "module cannot be added: route or at least name is required";
                    }

                    if (!module.moduleClass) {
                        throw "no moduleClass defined for module";
                    }

                    if (module.name) {
                        if (this.modules.hasOwnProperty(module.name)) {
                            throw "module with name '" + module.name + "' already registered"
                        }

                        this.modules[module.name] = module;
                    }

                    if (module.route) {
                        if (!this.$.router) {
                            throw "defining modules with routes requires a router instance to be set"
                        }

                        var self = this;
                        this.$.router.route(module.name, module.route, function () {
                            // route triggered

                            // load module
                            if (module.name) {
                                self.loadModuleByName(module.name, null);
                            } else {
                                self.loadModule(module.moduleClass, null);
                            }

                        });

                    }

                },

                loadModuleByName: function (moduleName, callback) {
                    if (this.modules.hasOwnProperty(moduleName)) {

                        var module = this.modules[moduleName];

                        if (module.cacheInstance && module.moduleInstance) {
                            // TODO: load instance from cache
                        } else {
                            this.loadModule(module.moduleClass, callback);
                        }

                    } else {
                        throw "Module '" + moduleName + "' not found";
                    }
                },

                loadModule: function (moduleFqClassName, callback) {

                    var eventResult = this.trigger("loadModule", {
                        moduleClass: moduleFqClassName
                    });

                    var internalCallback = function (err) {
                        // TODO Dispatch events

                        if (callback) {
                            callback(err);
                        }
                    };

                    var self = this;
                    if (!eventResult.isDefaultPrevented) {
                        // load module

                        require.require([moduleFqClassName], function (moduleBaseClass) {
                            var moduleInstance = new moduleBaseClass(null, moduleBaseClass.prototype._$descriptor, self.$applicationDomain, null, null);

                            if (moduleInstance instanceof Module) {

                                moduleInstance._initialize("auto");

                                internalCallback(null);
                                // TODO: show and start module
                            } else {
                                internalCallback("Module '" + moduleFqClassName + "' isn't an instance of js.core.Module");
                            }

                        });

                        // TODO cache model instances

                        // Trigger events

                    }
                },

                removeChild: function (child) {
                    this.callBase();

                    var index = this.$modules.indexOf(child);
                    if (index != -1) {
                        // TODO: remove route from router

                    }
                },

                render: function () {
                    // render the ContentPlaceHolder
                    this.callBase();
                },
                getContentPlaceHolders: function () {
                    return ModuleLoader.findContentPlaceHolders(this);
                }
            });

            ModuleLoader.findContentPlaceHolders = function (component) {
                var ret = [];

                for (var i = 0; i < component.$children.length; i++) {
                    var child = component.$children[i];
                    if (child instanceof ContentPlaceHolder) {
                        ret.push(child);
                    } else {
                        ret.concat(ModuleLoader.findContentPlaceHolders(child));
                    }
                }

                return ret;

            };

            return ModuleLoader;
        });
});