import template from "./todo-topbar.template.js";
import { useKeyListener } from "../../hooks/useKeyListener.js";
import { nanoid } from "../../utils/nanoid.js";

import globalStyles from "../../styles/global.constructable.js";
import topbarStyles from "../../styles/topbar.constructable.js";

class TodoTopbar extends HTMLElement {
    static get observedAttributes() {
        return ["total-items", "active-items", "completed-items"];
    }

    #route = undefined;

    constructor() {
        super();

        const node = document.importNode(template.content, true);
        this.todoInput = node.querySelector("#new-todo");
        this.toggleInput = node.querySelector("#toggle-all");
        this.toggleContainer = node.querySelector(".toggle-all-container");

        this.shadow = this.attachShadow({ mode: "open" });
        this.htmlDirection = document.dir || "ltr";
        this.setAttribute("dir", this.htmlDirection);
        this.shadow.adoptedStyleSheets = [globalStyles, topbarStyles];
        this.shadow.append(node);

        this.keysListeners = [];

        this.toggleAll = this.toggleAll.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    toggleAll(event) {
        this.dispatchEvent(
            new CustomEvent("toggle-all", {
                detail: { completed: event.target.checked },
            })
        );
    }

    addItem(event) {
        if (!event.target.value.length)
            return;

        this.dispatchEvent(
            new CustomEvent("add-item", {
                detail: {
                    id: nanoid(),
                    title: event.target.value,
                    completed: false,
                },
            })
        );

        event.target.value = "";
    }

    updateDisplay() {
        if (!parseInt(this["total-items"])) {
            this.toggleContainer.style.display = "none";
            return;
        }

        this.toggleContainer.style.display = "block";

        switch (this.#route) {
            case "active":
                this.toggleInput.checked = false;
                this.toggleInput.disabled = !parseInt(this["active-items"]);
                break;
            case "completed":
                this.toggleInput.checked = parseInt(this["completed-items"]);
                this.toggleInput.disabled = !parseInt(this["completed-items"]);
                break;
            default:
                this.toggleInput.checked = this["total-items"] === this["completed-items"];
                this.toggleInput.disabled = false;
        }
    }

    updateRoute(route) {
        this.#route = route;
        this.updateDisplay();
    }

    addListeners() {
        this.toggleInput.addEventListener("change", this.toggleAll);
        this.keysListeners.forEach((listener) => listener.connect());
    }

    removeListeners() {
        this.toggleInput.removeEventListener("change", this.toggleAll);
        this.keysListeners.forEach((listener) => listener.disconnect());
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        this[property] = newValue;

        if (this.isConnected)
            this.updateDisplay();
    }

    connectedCallback() {
        this.keysListeners.push(
            useKeyListener({
                target: this.todoInput,
                event: "keyup",
                callbacks: {
                    ["Enter"]: this.addItem,
                },
            })
        );

        this.updateDisplay();
        this.addListeners();
        this.todoInput.focus();
    }

    disconnectedCallback() {
        this.removeListeners();
        this.keysListeners = [];
    }
}

customElements.define("todo-topbar", TodoTopbar);

export default TodoTopbar;
