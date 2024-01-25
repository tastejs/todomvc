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
exports.TodoList = void 0;
const lit_1 = require("lit");
const custom_element_js_1 = require("lit/decorators/custom-element.js");
const property_js_1 = require("lit/decorators/property.js");
const repeat_js_1 = require("lit/directives/repeat.js");
const todo_css_js_1 = require("./todo.css.js");
require("./todo-item.js");
const events_js_1 = require("./events.js");
const utils_js_1 = require("./utils.js");
let TodoList = (() => {
    var _TodoList_instances, _TodoList_onToggleAllChange;
    let _classDecorators = [(0, custom_element_js_1.customElement)("todo-list")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = lit_1.LitElement;
    let _instanceExtraInitializers = [];
    let _todoList_decorators;
    let _todoList_initializers = [];
    var TodoList = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            _TodoList_instances.add(this);
            this.todoList = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _todoList_initializers, void 0));
        }
        render() {
            var _a, _b, _c, _d, _e, _f;
            return (0, lit_1.html) `
            ${((_b = (_a = this.todoList) === null || _a === void 0 ? void 0 : _a.all.length) !== null && _b !== void 0 ? _b : 0) > 0
                ? (0, lit_1.html) `
                      <input @change=${__classPrivateFieldGet(this, _TodoList_instances, "m", _TodoList_onToggleAllChange)} id="toggle-all" type="checkbox" class="toggle-all" .checked=${(_d = (_c = this.todoList) === null || _c === void 0 ? void 0 : _c.allCompleted) !== null && _d !== void 0 ? _d : false} />
                      <label for="toggle-all"> Mark all as complete </label>
                  `
                : lit_1.nothing}
            <ul class="todo-list">
                ${(0, repeat_js_1.repeat)((_f = (_e = this.todoList) === null || _e === void 0 ? void 0 : _e.filtered()) !== null && _f !== void 0 ? _f : [], (todo) => todo.id, (todo) => (0, lit_1.html) `<todo-item .todoId=${todo.id} .text=${todo.text} .completed=${todo.completed}></todo-item>`)}
            </ul>
        `;
        }
    };
    _TodoList_instances = new WeakSet();
    _TodoList_onToggleAllChange = function _TodoList_onToggleAllChange() {
        this.dispatchEvent(new events_js_1.ToggleAllTodoEvent());
    };
    __setFunctionName(_classThis, "TodoList");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _todoList_decorators = [(0, utils_js_1.updateOnEvent)("change"), (0, property_js_1.property)({ attribute: false })];
        __esDecorate(null, null, _todoList_decorators, { kind: "field", name: "todoList", static: false, private: false, access: { has: obj => "todoList" in obj, get: obj => obj.todoList, set: (obj, value) => { obj.todoList = value; } }, metadata: _metadata }, _todoList_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TodoList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = [
        todo_css_js_1.todoStyles,
        (0, lit_1.css) `
            :host {
                display: block;
            }
            :focus {
                box-shadow: none !important;
            }
            .todo-list {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            .toggle-all {
                width: 1px;
                height: 1px;
                border: none; /* Mobile Safari */
                opacity: 0;
                position: absolute;
                right: 100%;
                bottom: 100%;
            }

            .toggle-all + label {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 65px;
                font-size: 0;
                position: absolute;
                top: -65px;
                left: -0;
            }

            .toggle-all + label:before {
                content: "❯";
                display: inline-block;
                font-size: 22px;
                color: #949494;
                padding: 10px 27px 10px 27px;
                transform: rotate(90deg);
            }

            .toggle-all:checked + label:before {
                color: #484848;
            }

            todo-item {
                border-bottom: 1px solid #ededed;
            }
            todo-item:last-child {
                border-bottom: none;
            }
        `,
    ];
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoList = _classThis;
})();
exports.TodoList = TodoList;
