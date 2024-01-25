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
exports.TodoItem = void 0;
const lit_1 = require("lit");
const custom_element_js_1 = require("lit/decorators/custom-element.js");
const property_js_1 = require("lit/decorators/property.js");
const state_js_1 = require("lit/decorators/state.js");
const class_map_js_1 = require("lit/directives/class-map.js");
const todo_css_js_1 = require("./todo.css.js");
const events_js_1 = require("./events.js");
let TodoItem = (() => {
    var _TodoItem_instances, _TodoItem_toggleTodo, _TodoItem_deleteTodo, _TodoItem_beginEdit, _TodoItem_finishEdit, _TodoItem_captureEscape, _TodoItem_abortEdit;
    let _classDecorators = [(0, custom_element_js_1.customElement)("todo-item")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = lit_1.LitElement;
    let _instanceExtraInitializers = [];
    let _todoId_decorators;
    let _todoId_initializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _completed_decorators;
    let _completed_initializers = [];
    let _isEditing_decorators;
    let _isEditing_initializers = [];
    var TodoItem = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            _TodoItem_instances.add(this);
            this.todoId = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _todoId_initializers, ""));
            this.text = __runInitializers(this, _text_initializers, "");
            this.completed = __runInitializers(this, _completed_initializers, false);
            this.isEditing = __runInitializers(this, _isEditing_initializers, false);
        }
        render() {
            var _a, _b, _c;
            const itemClassList = {
                todo: true,
                completed: (_a = this.completed) !== null && _a !== void 0 ? _a : false,
                editing: this.isEditing,
            };
            return (0, lit_1.html) `
            <li class="${(0, class_map_js_1.classMap)(itemClassList)}">
                <div class="view">
                    <input class="toggle" type="checkbox" .checked=${(_b = this.completed) !== null && _b !== void 0 ? _b : false} @change=${__classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_toggleTodo)} />
                    <label @dblclick=${__classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_beginEdit)}> ${this.text} </label>
                    <button @click=${__classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_deleteTodo)} class="destroy"></button>
                </div>
                <input class="edit" type="text" @change=${__classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_finishEdit)} @keyup=${__classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_captureEscape)} @blur=${__classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_abortEdit)} .value=${(_c = this.text) !== null && _c !== void 0 ? _c : ""} />
            </li>
        `;
        }
    };
    _TodoItem_instances = new WeakSet();
    _TodoItem_toggleTodo = function _TodoItem_toggleTodo() {
        this.dispatchEvent(new events_js_1.EditTodoEvent({ id: this.todoId, completed: !this.completed }));
    };
    _TodoItem_deleteTodo = function _TodoItem_deleteTodo() {
        this.dispatchEvent(new events_js_1.DeleteTodoEvent(this.todoId));
    };
    _TodoItem_beginEdit = function _TodoItem_beginEdit() {
        this.isEditing = true;
    };
    _TodoItem_finishEdit = function _TodoItem_finishEdit(e) {
        const el = e.target;
        const text = el.value;
        this.dispatchEvent(new events_js_1.EditTodoEvent({ id: this.todoId, text }));
        this.isEditing = false;
    };
    _TodoItem_captureEscape = function _TodoItem_captureEscape(e) {
        if (e.key === "escape")
            __classPrivateFieldGet(this, _TodoItem_instances, "m", _TodoItem_abortEdit).call(this, e);
    };
    _TodoItem_abortEdit = function _TodoItem_abortEdit(e) {
        var _a;
        const input = e.target;
        input.value = (_a = this.text) !== null && _a !== void 0 ? _a : "";
    };
    __setFunctionName(_classThis, "TodoItem");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _todoId_decorators = [(0, property_js_1.property)()];
        _text_decorators = [(0, property_js_1.property)()];
        _completed_decorators = [(0, property_js_1.property)({ type: Boolean })];
        _isEditing_decorators = [(0, state_js_1.state)()];
        __esDecorate(null, null, _todoId_decorators, { kind: "field", name: "todoId", static: false, private: false, access: { has: obj => "todoId" in obj, get: obj => obj.todoId, set: (obj, value) => { obj.todoId = value; } }, metadata: _metadata }, _todoId_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: obj => "completed" in obj, get: obj => obj.completed, set: (obj, value) => { obj.completed = value; } }, metadata: _metadata }, _completed_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isEditing_decorators, { kind: "field", name: "isEditing", static: false, private: false, access: { has: obj => "isEditing" in obj, get: obj => obj.isEditing, set: (obj, value) => { obj.isEditing = value; } }, metadata: _metadata }, _isEditing_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TodoItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = [
        todo_css_js_1.todoStyles,
        (0, lit_1.css) `
            :host {
                display: block;
            }
            li {
                position: relative;
                font-size: 24px;
            }

            .editing {
                border-bottom: none;
                padding: 0;
            }

            .editing .edit {
                display: block;
                width: calc(100% - 43px);
                padding: 12px 16px;
                margin: 0 0 0 43px;
            }

            .editing .view {
                display: none;
            }

            .toggle {
                text-align: center;
                width: 40px;
                /* auto, since non-WebKit browsers doesn't support input styling */
                height: auto;
                position: absolute;
                top: 0;
                bottom: 0;
                margin: auto 0;
                border: none; /* Mobile Safari */
                -webkit-appearance: none;
                appearance: none;
            }

            .toggle {
                opacity: 0;
            }

            .toggle + label {
                /*
                    Firefox requires '#' to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
                    IE and Edge requires *everything* to be escaped to render, so we do that instead of just the '#' - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
                */
                background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: center left;
            }

            .toggle:checked + label {
                background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E");
            }

            label {
                word-break: break-all;
                padding: 15px 15px 15px 60px;
                display: block;
                line-height: 1.2;
                transition: color 0.4s;
                font-weight: 400;
                color: #484848;
            }

            .completed label {
                color: #949494;
                text-decoration: line-through;
            }

            .destroy {
                display: none;
                position: absolute;
                top: 0;
                right: 10px;
                bottom: 0;
                width: 40px;
                height: 40px;
                margin: auto 0;
                font-size: 30px;
                color: #949494;
                transition: color 0.2s ease-out;
            }
            .destroy:hover,
            .destroy:focus {
                color: #c18585;
            }

            .destroy:after {
                content: "×";
                display: block;
                height: 100%;
                line-height: 1.1;
            }

            li:hover .destroy {
                display: block;
            }

            .edit {
                display: none;
            }

            :host(:last-child) .editing {
                margin-bottom: -1px;
            }
        `,
    ];
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoItem = _classThis;
})();
exports.TodoItem = TodoItem;
