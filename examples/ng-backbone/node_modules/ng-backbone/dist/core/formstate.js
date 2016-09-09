"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var model_1 = require("./model");
var exception_1 = require("./exception");
var formvalidators_1 = require("./formvalidators");
var utils_1 = require("./utils");
var VALIDITY_STATE = [
    "badInput", "customError", "stepMismatch", "tooLong",
    "valueMissing", "rangeOverflow", "rangeUnderflow",
    "typeMismatch", "patternMismatch", "valueMissing"], SILENT = { silent: true };
var FormState = (function (_super) {
    __extends(FormState, _super);
    function FormState() {
        _super.apply(this, arguments);
    }
    FormState.prototype.initialize = function (options) {
        this.formValidators = new formvalidators_1.FormValidators();
        // Inject custom formValidators
        if (options && "formValidators" in options) {
            this._assignFormValidators(options.formValidators);
        }
    };
    /**
     *
     */
    FormState.prototype._assignFormValidators = function (formValidators) {
        if (typeof formValidators !== "function") {
            Object.assign(this.formValidators, formValidators);
            return;
        }
        this.formValidators = new formValidators();
        if (!(this.formValidators instanceof formvalidators_1.FormValidators)) {
            throw new exception_1.Exception("Specified option formValidators has invalid type");
        }
    };
    /**
     * Update `valid` and `validationMessage` according to the current model state
     */
    FormState.prototype.checkValidity = function () {
        var _this = this;
        var invalid = VALIDITY_STATE.some(function (key) {
            return _this.attributes[key];
        });
        if (!invalid) {
            this.set("validationMessage", "", SILENT);
        }
        this.set("valid", !invalid);
    };
    /**
     * Run validators from the list data-ng-validate="foo, bar, baz"
     */
    FormState.prototype.testCustomValidators = function (el) {
        var _this = this;
        if (!el.dataset["ngValidate"]) {
            return Promise.resolve();
        }
        var value = el.value, validators = el.dataset["ngValidate"].trim().split(",");
        if (!validators) {
            return Promise.resolve();
        }
        var all = validators.map(function (validator) {
            return _this.formValidators[validator.trim()](value);
        });
        return Promise.all(all)
            .then(function () {
            el.setCustomValidity("");
        })
            .catch(function (err) {
            if (err instanceof Error) {
                throw new exception_1.Exception(err.message);
            }
            _this.set("customError", true, SILENT);
            _this.set("validationMessage", err, SILENT);
            el.setCustomValidity(err);
        });
    };
    FormState.prototype.
    /**
     * Handle change/input events on the input
     */
    onInputChange = function (el) {
        this.get("dirty") || this.set("dirty", true);
        this.setState(el);
    };
    FormState.prototype.setState = function (el) {
        var _this = this;
        if ("validity" in el) {
            this.set("value", el.value, SILENT);
            VALIDITY_STATE.forEach(function (method) {
                var ValidityState = el.validity;
                _this.set(method, ValidityState[method], SILENT);
            });
            this.set("validationMessage", el.validationMessage, SILENT);
            return this.testCustomValidators(el)
                .then(function () {
                _this.checkValidity();
            });
        }
        else {
            this.set("value", el.checked, SILENT);
            this.checkValidity();
            return Promise.resolve();
        }
    };
    /**
     * Handle focus event on the input
     */
    FormState.prototype.onInputFocus = function () {
        this.set("touched", true);
    };
    __decorate([
        utils_1.Debounce(100), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FormState.prototype, "onInputChange", null);
    return FormState;
}(model_1.Model));
exports.FormState = FormState;
var GroupState = (function (_super) {
    __extends(GroupState, _super);
    function GroupState() {
        _super.apply(this, arguments);
    }
    GroupState.prototype.defaults = function () {
        return {
            "valid": true,
            "dirty": false,
            "validationMessage": "",
            "validationMessages": []
        };
    };
    return GroupState;
}(FormState));
exports.GroupState = GroupState;
var ControlState = (function (_super) {
    __extends(ControlState, _super);
    function ControlState() {
        _super.apply(this, arguments);
    }
    ControlState.prototype.defaults = function () {
        return {
            "value": "",
            "touched": false,
            "dirty": false,
            // ValidityState
            "valid": true,
            "badInput": false,
            "customError": false,
            "stepMismatch": false,
            "tooLong": false,
            "valueMissing": false,
            "rangeOverflow": false,
            "rangeUnderflow": false,
            "typeMismatch": false,
            "patternMismatch": false,
            "validationMessage": ""
        };
    };
    return ControlState;
}(FormState));
exports.ControlState = ControlState;
