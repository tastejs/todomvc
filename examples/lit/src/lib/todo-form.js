"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoForm = void 0;
const lit_1 = require("lit");
const custom_element_js_1 = require("lit/decorators/custom-element.js");
const property_js_1 = require("lit/decorators/property.js");
const query_js_1 = require("lit/decorators/query.js");
const todo_css_js_1 = require("./todo.css.js");
const events_js_1 = require("./events.js");
const utils_js_1 = require("./utils.js");
let TodoForm = (() => {
    var _TodoForm_instances, _TodoForm_onChange, _TodoForm_onKeydown;
    let _classDecorators = [(0, custom_element_js_1.customElement)("todo-form")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = lit_1.LitElement;
    let _instanceExtraInitializers = [];
    let _todoList_decorators;
    let _todoList_initializers = [];
    let _newTodoInput_decorators;
    let _newTodoInput_initializers = [];
    var TodoForm = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            _TodoForm_instances.add(this);
            this.todoList = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _todoList_initializers, void 0));
            this.newTodoInput = __runInitializers(this, _newTodoInput_initializers, void 0);
        }
        render() {
            return (0, lit_1.html) `<input @change=${__classPrivateFieldGet(this, _TodoForm_instances, "m", _TodoForm_onChange)} @keydown=${__classPrivateFieldGet(this, _TodoForm_instances, "m", _TodoForm_onKeydown)} class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" />`;
        }
    };
    _TodoForm_instances = new WeakSet();
    _TodoForm_onChange = function _TodoForm_onChange() {
        const { value } = this.newTodoInput;
        if (value.length > 0)
            this.dispatchEvent(new events_js_1.AddTodoEvent(value));
        this.newTodoInput.value = "";
    };
    _TodoForm_onKeydown = function _TodoForm_onKeydown(e) {
        if (e.key === "Enter")
            __classPrivateFieldGet(this, _TodoForm_instances, "m", _TodoForm_onChange).call(this);
    };
    __setFunctionName(_classThis, "TodoForm");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _todoList_decorators = [(0, utils_js_1.updateOnEvent)("change"), (0, property_js_1.property)({ attribute: false })];
        _newTodoInput_decorators = [(0, query_js_1.query)("input", true)];
        __esDecorate(null, null, _todoList_decorators, { kind: "field", name: "todoList", static: false, private: false, access: { has: obj => "todoList" in obj, get: obj => obj.todoList, set: (obj, value) => { obj.todoList = value; } }, metadata: _metadata }, _todoList_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _newTodoInput_decorators, { kind: "field", name: "newTodoInput", static: false, private: false, access: { has: obj => "newTodoInput" in obj, get: obj => obj.newTodoInput, set: (obj, value) => { obj.newTodoInput = value; } }, metadata: _metadata }, _newTodoInput_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TodoForm = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = [
        todo_css_js_1.todoStyles,
        (0, lit_1.css) `
            :host {
                display: block;
            }
            input::-webkit-input-placeholder {
                font-style: italic;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.4);
            }
            input::-moz-placeholder {
                font-style: italic;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.4);
            }
            input::input-placeholder {
                font-style: italic;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.4);
            }
        `,
    ];
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoForm = _classThis;
})();
exports.TodoForm = TodoForm;
