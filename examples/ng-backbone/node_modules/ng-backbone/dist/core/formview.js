"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var view_1 = require("./view");
var formstate_1 = require("./formstate");
var utils_1 = require("./utils");
var ControlUpdateStates = (function () {
    function ControlUpdateStates() {
        this.valid = [];
        this.dirty = [];
    }
    return ControlUpdateStates;
}());
var FormView = (function (_super) {
    __extends(FormView, _super);
    function FormView() {
        _super.apply(this, arguments);
        this._groupBound = false;
    }
    FormView.prototype.render = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        view_1.View.prototype.render.apply(this, args);
        this._groupBound || this.bindGroups();
        return this;
    };
    /**
     * Bind form and inputs
     */
    FormView.prototype.bindGroups = function () {
        var _this = this;
        this._groupBound = true;
        this._findGroups().forEach(function (groupEl) {
            var groupName = groupEl.dataset["ngGroup"];
            _this._bindGroup(groupEl, groupName);
            // this form is already bound
            if (!groupName) {
                return;
            }
            _this._findGroupElements(groupEl)
                .forEach(function (inputEl) {
                _this._bindGroupElement(groupName, inputEl.name);
                _this._subscribeGroupElement(groupName, inputEl);
            });
            // set initial state (.eg. requried contols - are invalid already)
            _this.updateGroupValidatity(groupName);
            _this.render();
        });
    };
    /**
     * Return array of form elements (either with all the forms found in the view
     * or with only form which is this.el)
     */
    FormView.prototype._findGroups = function () {
        if (this.el.dataset["ngGroup"]) {
            return [this.el];
        }
        return Array.from(this.el.querySelectorAll("[data-ng-group]"));
    };
    /**
     * Bind a given form to State model ( myform.group = state model )
     */
    FormView.prototype._bindGroup = function (el, groupName) {
        if (this.models.has(groupName)) {
            return;
        }
        var model = new formstate_1.GroupState({ formValidators: this.formValidators });
        this.models.set(FormView.getKey(groupName, "group"), model);
        this.stopListening(model);
        this.options.logger && this.trigger("log:listen", "subscribes for `change`", model);
        this.listenTo(model, "change", this.render);
    };
    FormView.getKey = function (groupName, controlName) {
        return groupName + "." + controlName;
    };
    /**
     * Bind a given input to State model ( myform.myInput = state model )
     */
    FormView.prototype._bindGroupElement = function (groupName, controlName) {
        var _this = this;
        var key = FormView.getKey(groupName, controlName);
        if (this.models.has(key)) {
            return;
        }
        var model = new formstate_1.ControlState({ formValidators: this.formValidators });
        this.models.set(key, model);
        this.stopListening(model);
        this.options.logger && this.trigger("log:listen", "subscribes for `change`", model);
        this.listenTo(model, "change", function () {
            _this._onControlModelChange(groupName, model);
        });
    };
    /**
     * Find all the inputs in the given form
     */
    FormView.prototype._findGroupElements = function (groupEl) {
        return Array.from(groupEl.querySelectorAll("[name]"))
            .filter(function (el) {
            return el instanceof HTMLInputElement
                || el instanceof HTMLSelectElement
                || el instanceof HTMLTextAreaElement;
        });
    };
    /**
     * Subscribe handlers for input events
     */
    FormView.prototype._subscribeGroupElement = function (groupName, inputEl) {
        var controlName = inputEl.name, inputModel, key = FormView.getKey(groupName, controlName), 
        // find input elements within this.el
        sel = "[name=\"" + controlName + "\"]";
        if (!this.el.dataset["ngGroup"]) {
            // find input elements per form
            sel = "[data-ng-group=\"" + groupName + "\"] " + sel;
        }
        inputModel = this.models.get(key);
        var onChange = function () {
            inputModel.onInputChange(inputEl);
        };
        // Populate state object on autocomplete
        setTimeout(function () {
            inputModel.setState(inputEl);
        }, 100);
        this.delegate("change", sel, onChange);
        this.delegate("input", sel, onChange);
        this.delegate("focus", sel, function () {
            inputModel.get("touched") || inputModel.onInputFocus();
        });
    };
    FormView.prototype._onControlModelChange = function (groupName, model) {
        this.updateGroupValidatity(groupName);
        this.render(model);
    };
    /**
     * helpere to test states control/group on input
     */
    FormView.prototype.testInput = function (pointer, value) {
        var _this = this;
        var groupName, controlName;
        _a = pointer.split("."), groupName = _a[0], controlName = _a[1];
        var el = this.el.querySelector("[data-ng-group=\"" + groupName + "\"] [name=\"" + controlName + "\"]");
        if (!el) {
            throw new Error("Pointer " + pointer + " is invalid");
        }
        el.value = value;
        var model = this.models.get(pointer);
        return model.setState(el)
            .then(function () {
            _this.updateGroupValidatity(groupName);
        });
        var _a;
    };
    FormView.prototype.updateGroupValidatity = function (groupName) {
        var groupModel = this.models.get(FormView.getKey(groupName, "group")), states = new ControlUpdateStates(), validationMessage = "", validationMessages = [], curValid, curDirty;
        FormView.filterModels(this.models, groupName)
            .forEach(function (model, controlName) {
            if (model.get("validationMessage")) {
                validationMessage = model.get("validationMessage");
                validationMessages.push({
                    control: controlName,
                    message: validationMessage
                });
            }
            states.valid.push(model.get("valid"));
            states.dirty.push(model.get("dirty"));
        });
        curValid = !states.valid.some(function (toogle) { return toogle === false; });
        curDirty = states.dirty.some(function (toogle) { return toogle; });
        groupModel.set("valid", curValid);
        groupModel.set("dirty", curDirty);
        groupModel.set("validationMessage", validationMessage);
        groupModel.set("validationMessages", validationMessages);
    };
    FormView.filterModels = function (models, groupName) {
        var filtered = utils_1.mapFrom({});
        models.forEach(function (model, key) {
            if (key !== groupName + ".group" && key.startsWith(groupName + ".")) {
                filtered.set(key, model);
            }
        });
        return filtered;
    };
    /**
     * Get form data of a specified form
     */
    FormView.prototype.getData = function (groupName) {
        var data = {};
        FormView.filterModels(this.models, groupName)
            .forEach(function (model, key) {
            var tmp, controlName;
            _a = key.split("."), tmp = _a[0], controlName = _a[1];
            if (controlName === "group") {
                return;
            }
            data[controlName] = model.get("value");
            var _a;
        });
        return data;
    };
    FormView.prototype.reset = function (groupName) {
        FormView.filterModels(this.models, groupName)
            .forEach(function (model, key) {
            var tmp, controlName;
            _a = key.split("."), tmp = _a[0], controlName = _a[1];
            model.get("dirty") && model.set("dirty", true);
            var _a;
        });
    };
    return FormView;
}(view_1.View));
exports.FormView = FormView;
