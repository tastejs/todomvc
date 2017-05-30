"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var helper_1 = require("./view/helper");
var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        // constructor options getting available across the prototype
        this.options = {};
        // template errors/warnings
        this.errors = [];
        // is this view ever mounted
        this.didComponentMount = false;
        this.__ngbHelper = new helper_1.ViewHelper(this);
        Object.assign(this.options, options);
        if (options.parent) {
            this.parent = options.parent;
        }
        // If we want to listen to log events
        options.logger && this.__ngbHelper.subscribeLogger(options.logger);
        this.__ngbHelper.initializeOptions(options);
        this.models.size && this.__ngbHelper.bindModels();
        this.collections && this.__ngbHelper.bindCollections();
        // Call earlier cached this.initialize
        this.__ngbInitialize && this.__ngbInitialize(options);
    }
    /**
     * Abstract method: implement it when you want to plug in straight before el.innerHTML populated
     */
    View.prototype.componentWillMount = function () {
    };
    /**
     * Abstract method: implement it when you want to plug in straight after el.innerHTML populated
     */
    View.prototype.componentDidMount = function () {
    };
    /**
     * Abstract method: implement it when you want to control manually if the template requires re-sync
     */
    View.prototype.shouldComponentUpdate = function (nextScope) {
        return true;
    };
    /**
     * Abstract method: implement it when you need preparation before an template sync occurs
     */
    View.prototype.componentWillUpdate = function (nextScope) {
    };
    /**
     * Abstract method: implement it when you need operate on the DOM after template sync
     */
    View.prototype.componentDidUpdate = function (prevScope) {
    };
    /**
     * Render first and then sync the template
     */
    View.prototype.render = function (source) {
        var _this = this;
        var ms = performance.now(), focusEl, scope = {};
        // When template is not ready yet - e.g. loading via XHR
        if (!this.template) {
            return;
        }
        this.models && Object.assign(scope, helper_1.ViewHelper.modelsToScope(this.models));
        this.collections && Object.assign(scope, helper_1.ViewHelper.collectionsToScope(this.collections));
        try {
            if (this.shouldComponentUpdate(scope)) {
                this.trigger("component-will-update", scope);
                this.componentWillUpdate(scope);
                focusEl = this.el.querySelector(":focus");
                this.errors = this.template.sync(scope).report()["errors"];
                focusEl && focusEl.focus();
                this.options.logger && this.errors.forEach(function (msg) {
                    _this.trigger("log:template", msg);
                });
                this.options.logger &&
                    this.trigger("log:sync", "synced template on in " + (performance.now() - ms) + " ms", scope, source);
                if (!this.didComponentMount) {
                    this.__ngbHelper.onComponentDidMount();
                }
                this.componentDidUpdate(scope);
                this.trigger("component-did-update", scope);
            }
        }
        catch (err) {
            console.error(err.message);
        }
        return this;
    };
    /**
    * Enhance listenTo to process maps
    * @example:
    * this.listenToMap( eventEmitter, {
    *     "cleanup-list": this.onCleanpList,
    *     "update-list": this.syncCollection
    *   });
    * @param {Backbone.Events} other
    * @param {NgBackbone.DataMap} event
    *
    * @returns {Backbone.NativeView}
    */
    View.prototype.listenToMap = function (eventEmitter, event) {
        Object.keys(event).forEach(function (key) {
            Backbone.NativeView.prototype.listenTo.call(this, eventEmitter, key, event[key]);
        }, this);
        return this;
    };
    /**
     * Remove all the nested view on parent removal
     */
    View.prototype.remove = function () {
        this.views.forEachView(function (view) { return view.remove(); });
        return Backbone.NativeView.prototype.remove.call(this);
    };
    return View;
}(Backbone.NativeView));
exports.View = View;
