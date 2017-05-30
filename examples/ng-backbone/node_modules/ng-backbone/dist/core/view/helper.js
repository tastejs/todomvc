"use strict";
var ngtemplate_1 = require("../../ngtemplate");
var utils_1 = require("../utils");
var map_1 = require("./map");
var ViewHelper = (function () {
    function ViewHelper(view) {
        var _this = this;
        this.view = view;
        this.view.listenTo(this.view, "component-did-update", function () {
            _this.view.__ngbComponent.views.size && _this.initSubViews(_this.view.__ngbComponent.views);
        });
        this.view.views = new map_1.ViewMap();
    }
    /**
     * Translate { getFoo(), getBar() } into { foo: "value", bar: "value" }
     */
    ViewHelper.getterToScope = function (data) {
        var re = /^get[A-Z]/;
        var key, getters = {};
        for (key in data) {
            if (re.test(key) && typeof data[key] === "function") {
                var prop = key.substr(3);
                prop = prop.substr(0, 1).toLowerCase() + prop.substr(1);
                getters[prop] = data[key]();
            }
        }
        return getters;
    };
    /**
     * Subscribe logger handlers from options
     */
    ViewHelper.prototype.subscribeLogger = function (logger) {
        var _this = this;
        Object.keys(logger).forEach(function (events) {
            _this.view.listenTo(_this.view, events, logger[events]);
        });
    };
    /**
     * collections/models passed in options, take them
     */
    ViewHelper.prototype.initializeOptions = function (options) {
        // When @Component isn't defined
        if (!("__ngbComponent" in this.view)) {
            this.resetComponentDto();
        }
        this.asyncInitializeTemplate(this.view.options);
        this.view.models = utils_1.mapFrom(this.view.__ngbComponent.models);
        this.view.collections = utils_1.mapFrom(this.view.__ngbComponent.collections);
        if ("collections" in options) {
            utils_1.mapAssign(this.view.collections, options.collections);
        }
        if ("models" in options) {
            utils_1.mapAssign(this.view.models, options.models);
        }
        if ("this.views" in options) {
            utils_1.mapAssign(this.view.__ngbComponent.views, options.views);
        }
    };
    /**
     * Bind specified models to the template
     */
    ViewHelper.prototype.bindModels = function () {
        var _this = this;
        this.view.models.forEach(function (model) {
            _this.view.stopListening(model);
            _this.view.options.logger && _this.view.trigger("log:listen", "subscribes for `change`", model);
            _this.view.listenTo(model, "change", _this.debounceRender.bind(_this));
        });
    };
    /**
     * Bind specified collections to the template
     */
    ViewHelper.prototype.bindCollections = function () {
        var _this = this;
        this.view.collections.forEach(function (collection) {
            _this.view.stopListening(collection);
            _this.view.options.logger &&
                _this.view.trigger("log:listen", "subscribes for `change destroy sync sort add remove`", collection);
            _this.view.listenTo(collection, "change destroy sync sort add remove", _this.debounceRender.bind(_this));
        });
    };
    /**
     * Slightly debounced for repeating calls like collection.sync/sort
     */
    ViewHelper.prototype.debounceRender = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(function () {
            _this.debounceTimer = null;
            _this.view.render.apply(_this.view, args);
        }, 50);
    };
    /**
     * Converts { foo: Collection, bar: Collection } into
     * { foo: [{},{}], bar: [{},{}] }
     */
    ViewHelper.collectionsToScope = function (collections) {
        var scope = {};
        collections.forEach(function (collection, key) {
            scope[key] = [];
            collection.forEach(function (model) {
                var data = model.toJSON();
                if (model.id) {
                    data.id = model.id;
                }
                scope[key].push(data);
            });
            var getters = ViewHelper.getterToScope(collection);
            getters && Object.assign(scope[key], getters);
        });
        return scope;
    };
    /**
     * Converts model map into JSON
     */
    ViewHelper.modelsToScope = function (models) {
        var scope = {};
        models.forEach(function (model, key) {
            // "groupName.controlName" -> { groupName: { controlName: val } }
            if (key.indexOf(".") !== -1) {
                var ref = key.split(".");
                scope[ref[0]] = scope[ref[0]] || {};
                scope[ref[0]][ref[1]] = model.toJSON();
                return;
            }
            scope[key] = model.toJSON();
        });
        return scope;
    };
    ViewHelper.prototype.resetComponentDto = function () {
        this.view.__ngbComponent = {
            models: {},
            collections: {},
            views: utils_1.mapFrom({}),
            template: null,
            templateUrl: null
        };
    };
    ViewHelper.prototype.asyncInitializeTemplate = function (options) {
        var _this = this;
        var template = this.view.__ngbComponent.template, templateUrl = this.view.__ngbComponent.templateUrl;
        // shared template
        if ("template" in options && this.view.options.template) {
            template = this.view.options.template;
        }
        if ("templateUrl" in options && this.view.options.templateUrl) {
            templateUrl = this.view.options.templateUrl;
        }
        if (!templateUrl) {
            this.initializeTemplate(template);
            return;
        }
        Backbone.ajax({
            url: templateUrl,
            error: function (err) {
                throw new Error("Cannot reach " + templateUrl);
            },
            success: function (tpl) {
                _this.initializeTemplate(tpl);
                _this.view.render();
            }
        });
    };
    ViewHelper.prototype.onComponentDidMount = function () {
        this.view.didComponentMount = true;
        this.view.componentDidMount();
        this.view.trigger("component-did-mount");
        var autofocus = this.view.el.querySelector("[autofocus]");
        autofocus && autofocus.focus();
    };
    ViewHelper.prototype.initializeTemplate = function (template) {
        var _this = this;
        // process Component's payload
        this.view.template = new ngtemplate_1.NgTemplate(this.view.el, template, {
            willMount: function () {
                _this.view.trigger("component-will-mount");
                _this.view.componentWillMount();
            }
        });
    };
    /**
     * When after parent DOM update any bound node disappear, let's ditch the orphan views
     */
    ViewHelper.prototype.cleanupOrphanSubViews = function () {
        this.view.views.forEachView(function (view, inx, key, map) {
            if (!view.el.parentNode) {
                var views = map.get(key);
                view.remove();
                delete views[inx];
                map.set(key, views
                    .filter(function (value) { return typeof value !== "undefined"; }));
            }
        });
    };
    /**
    * Initialize subview
    */
    ViewHelper.prototype.initSubViews = function (viewCtorMap) {
        var _this = this;
        this.cleanupOrphanSubViews();
        viewCtorMap.forEach(function (Ctor, key) {
            var dto, views;
            if (typeof Ctor === "function") {
                // populate views by specified Constructor
                views = _this.createSubViews(Ctor);
            }
            else {
                // populate views by pair Constructor/Options
                dto = Ctor;
                views = _this.createSubViews(dto[0], dto[1]);
            }
            if (!views.length) {
                return;
            }
            if (_this.view.views.has(key)) {
                _this.view.views.set(key, _this.view.views.getAll(key).concat(views));
                return;
            }
            _this.view.views.set(key, views);
        });
    };
    /**
     * Factory: create a subview per element found by the selector
     */
    ViewHelper.prototype.createSubViews = function (ViewCtor, payload) {
        var _this = this;
        if (payload === void 0) { payload = {}; }
        var views = [], els = this.findMatchingElements(ViewCtor.prototype["el"]);
        els.forEach(function (el) {
            var options = payload;
            if (_this.view.views.hasElement(el)) {
                return null;
            }
            // when options is a function
            if (typeof payload === "function") {
                options = payload.call(_this.view, _this.view, el);
            }
            views.push(new ViewCtor(Object.assign(options, { el: el, parent: _this.view })));
        });
        return views;
    };
    /**
     * Find all matching elements into DOM
     */
    ViewHelper.prototype.findMatchingElements = function (selector) {
        if (typeof selector !== "string") {
            throw new SyntaxError("Invalid options.el type, must be a string");
        }
        return Array.from(this.view.el.querySelectorAll(selector));
    };
    return ViewHelper;
}());
exports.ViewHelper = ViewHelper;
