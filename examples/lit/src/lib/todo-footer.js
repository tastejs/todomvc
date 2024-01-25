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
exports.TodoFooter = void 0;
const lit_1 = require("lit");
const custom_element_js_1 = require("lit/decorators/custom-element.js");
const property_js_1 = require("lit/decorators/property.js");
const class_map_js_1 = require("lit/directives/class-map.js");
const todo_css_js_1 = require("./todo.css.js");
const utils_js_1 = require("./utils.js");
const events_js_1 = require("./events.js");
let TodoFooter = (() => {
    var _TodoFooter_instances, _TodoFooter_onClearCompletedClick;
    let _classDecorators = [(0, custom_element_js_1.customElement)("todo-footer")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = lit_1.LitElement;
    let _instanceExtraInitializers = [];
    let _todoList_decorators;
    let _todoList_initializers = [];
    var TodoFooter = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            _TodoFooter_instances.add(this);
            this.todoList = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _todoList_initializers, void 0));
        }
        render() {
            var _a, _b, _c, _d, _e, _f;
            if (this.todoList === undefined || this.todoList.all.length === 0)
                return lit_1.nothing;
            const allFilter = filterLink({
                text: "All",
                filter: "all",
                selectedFilter: (_a = this.todoList) === null || _a === void 0 ? void 0 : _a.filter,
            });
            const activeFilter = filterLink({
                text: "Active",
                filter: "active",
                selectedFilter: (_b = this.todoList) === null || _b === void 0 ? void 0 : _b.filter,
            });
            const completedFilter = filterLink({
                text: "Completed",
                filter: "completed",
                selectedFilter: (_c = this.todoList) === null || _c === void 0 ? void 0 : _c.filter,
            });
            return (0, lit_1.html) `
            <span class="todo-count">
                <strong>${(_d = this.todoList) === null || _d === void 0 ? void 0 : _d.active.length}</strong>
                items left
            </span>
            <ul class="filters">
                <li>${allFilter}</li>
                <li>${activeFilter}</li>
                <li>${completedFilter}</li>
            </ul>
            ${((_f = (_e = this.todoList) === null || _e === void 0 ? void 0 : _e.completed.length) !== null && _f !== void 0 ? _f : 0) > 0 ? (0, lit_1.html) `<button @click=${__classPrivateFieldGet(this, _TodoFooter_instances, "m", _TodoFooter_onClearCompletedClick)} class="clear-completed">Clear Completed</button>` : lit_1.nothing}
        `;
        }
    };
    _TodoFooter_instances = new WeakSet();
    _TodoFooter_onClearCompletedClick = function _TodoFooter_onClearCompletedClick() {
        this.dispatchEvent(new events_js_1.ClearCompletedEvent());
    };
    __setFunctionName(_classThis, "TodoFooter");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _todoList_decorators = [(0, utils_js_1.updateOnEvent)("change"), (0, property_js_1.property)({ attribute: false })];
        __esDecorate(null, null, _todoList_decorators, { kind: "field", name: "todoList", static: false, private: false, access: { has: obj => "todoList" in obj, get: obj => obj.todoList, set: (obj, value) => { obj.todoList = value; } }, metadata: _metadata }, _todoList_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TodoFooter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = [
        todo_css_js_1.todoStyles,
        (0, lit_1.css) `
            :host {
                display: block;
                padding: 10px 15px;
                height: 20px;
                text-align: center;
                font-size: 15px;
                border-top: 1px solid #e6e6e6;
            }
            :host:before {
                content: "";
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 50px;
                overflow: hidden;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
            }

            .todo-count {
                float: left;
                text-align: left;
            }
            .todo-count strong {
                font-weight: 300;
            }

            .filters {
                margin: 0;
                padding: 0;
                list-style: none;
                position: absolute;
                right: 0;
                left: 0;
            }

            li {
                display: inline;
            }
            li a {
                color: inherit;
                margin: 3px;
                padding: 3px 7px;
                text-decoration: none;
                border: 1px solid transparent;
                border-radius: 3px;
            }

            a:hover {
                border-color: #db7676;
            }

            a.selected {
                border-color: #ce4646;
            }
            .clear-completed,
            :host .clear-completed:active {
                float: right;
                position: relative;
                line-height: 19px;
                text-decoration: none;
                cursor: pointer;
            }

            .clear-completed:hover {
                text-decoration: underline;
            }
        `,
    ];
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoFooter = _classThis;
})();
exports.TodoFooter = TodoFooter;
function filterLink({ text, filter, selectedFilter }) {
    return (0, lit_1.html) `<a class="${(0, class_map_js_1.classMap)({ selected: filter === selectedFilter })}" href="#/${filter}">${text}</a>`;
}
