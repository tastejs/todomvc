import template from "./todo-item.template.js";
import { useDoubleClick } from "../../hooks/useDoubleClick.js";
import { useKeyListener } from "../../hooks/useKeyListener.js";

import globalStyles from "../../styles/global.constructable.js";
import itemStyles from "../../styles/todo-item.constructable.js";

class TodoItem extends HTMLElement {
    static get observedAttributes() {
        return ["id", "title", "completed"];
    }

    constructor() {
        super();

        this.id = "";
        this.title = "Todo Item";
        this.completed = "false";

        const node = document.importNode(template.content, true);
        this.item = node.querySelector(".todo-item");
        this.toggleLabel = node.querySelector(".toggle-todo-label");
        this.toggleInput = node.querySelector(".toggle-todo-input");
        this.todoText = node.querySelector(".todo-item-text");
        this.todoButton = node.querySelector(".remove-todo-button");
        this.editLabel = node.querySelector(".edit-todo-label");
        this.editInput = node.querySelector(".edit-todo-input");

        this.shadow = this.attachShadow({ mode: "open" });
        this.htmlDirection = document.dir || "ltr";
        this.setAttribute("dir", this.htmlDirection);
        this.shadow.adoptedStyleSheets = [globalStyles, itemStyles];
        this.shadow.append(node);

        this.keysListeners = [];

        this.updateItem = this.updateItem.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.stopEdit = this.stopEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    update(...args) {
        args.forEach((argument) => {
            switch (argument) {
                case "id":
                    if (this.id !== undefined)
                        this.item.id = `todo-item-${this.id}`;
                    break;
                case "title":
                    if (this.title !== undefined) {
                        this.todoText.textContent = this.title;
                        this.editInput.value = this.title;
                    }
                    break;
                case "completed":
                    this.toggleInput.checked = this.completed === "true" ? true : false;
                    break;
            }
        });
    }

    startEdit() {
        this.item.classList.add("editing");
        this.editInput.value = this.title;
        this.editInput.focus();
    }

    stopEdit() {
        this.item.classList.remove("editing");
    }

    cancelEdit() {
        this.editInput.blur();
    }

    toggleItem() {
        // The todo-list checks the "completed" attribute to filter based on route
        // (therefore the completed state needs to already be updated before the check)
        this.setAttribute("completed", this.toggleInput.checked);

        this.dispatchEvent(
            new CustomEvent("toggle-item", {
                detail: { id: this.id, completed: this.toggleInput.checked },
                bubbles: true,
            })
        );
    }

    removeItem() {
        // The todo-list keeps a reference to all elements and updates the list on removal.
        // (therefore the removal has to happen after the list is updated)
        this.dispatchEvent(
            new CustomEvent("remove-item", {
                detail: { id: this.id },
                bubbles: true,
            })
        );
        this.remove();
    }

    updateItem(event) {
        if (event.target.value !== this.title) {
            if (!event.target.value.length) {
                this.removeItem();
            } else {
                this.setAttribute("title", event.target.value);
                this.dispatchEvent(
                    new CustomEvent("update-item", {
                        detail: { id: this.id, title: event.target.value },
                        bubbles: true,
                    })
                );
            }
        }

        this.cancelEdit();
    }

    addListeners() {
        this.toggleInput.addEventListener("change", this.toggleItem);
        this.todoText.addEventListener("click", useDoubleClick(this.startEdit, 500));
        this.editInput.addEventListener("blur", this.stopEdit);
        this.todoButton.addEventListener("click", this.removeItem);

        this.keysListeners.forEach((listener) => listener.connect());
    }

    removeListeners() {
        this.toggleInput.removeEventListener("change", this.toggleItem);
        this.todoText.removeEventListener("click", this.startEdit);
        this.editInput.removeEventListener("blur", this.stopEdit);
        this.todoButton.removeEventListener("click", this.removeItem);

        this.keysListeners.forEach((listener) => listener.disconnect());
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        this[property] = newValue;

        if (this.isConnected)
            this.update(property);
    }

    connectedCallback() {
        this.update("id", "title", "completed");

        this.keysListeners.push(
            useKeyListener({
                target: this.editInput,
                event: "keyup",
                callbacks: {
                    ["Enter"]: this.updateItem,
                    ["Escape"]: this.cancelEdit,
                },
            }),
            useKeyListener({
                target: this.todoText,
                event: "keyup",
                callbacks: {
                    [" "]: this.startEdit, // this feels weird
                },
            })
        );

        this.addListeners();
    }

    disconnectedCallback() {
        this.removeListeners();
        this.keysListeners = [];
    }
}

customElements.define("todo-item", TodoItem);

export default TodoItem;
