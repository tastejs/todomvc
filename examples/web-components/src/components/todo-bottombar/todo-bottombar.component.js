import template from "./todo-bottombar.template.js";

import globalStyles from "../../../styles/global.constructable.js";
import bottombarStyles from "../../../styles/bottombar.constructable.js";

class TodoBottombar extends HTMLElement {
    static get observedAttributes() {
        return ["total-items", "active-items"];
    }

    constructor() {
        super();

        const node = document.importNode(template.content, true);
        this.element = node.querySelector(".bottombar");
        this.clearCompletedButton = node.querySelector(".clear-completed-button");
        this.todoStatus = node.querySelector(".todo-status");
        this.filterLinks = node.querySelectorAll(".filter-link");

        this.shadow = this.attachShadow({ mode: "open" });
        this.htmlDirection = document.dir || "ltr";
        this.setAttribute("dir", this.htmlDirection);
        this.shadow.adoptedStyleSheets = [globalStyles, bottombarStyles];
        this.shadow.append(node);

        this.clearCompletedItems = this.clearCompletedItems.bind(this);
    }

    updateDisplay() {
        if (parseInt(this["total-items"]) !== 0)
            this.element.style.display = "block";
        else
            this.element.style.display = "none";

        this.todoStatus.textContent = `${this["active-items"]} ${this["active-items"] === "1" ? "item" : "items"} left!`;
    }

    updateRoute(route) {
        this.filterLinks.forEach((link) => {
            if (link.dataset.route === route)
                link.classList.add("selected");
            else
                link.classList.remove("selected");
        });
    }

    clearCompletedItems() {
        this.dispatchEvent(new CustomEvent("clear-completed-items"));
    }

    addListeners() {
        this.clearCompletedButton.addEventListener("click", this.clearCompletedItems);
    }

    removeListeners() {
        this.clearCompletedButton.removeEventListener("click", this.clearCompletedItems);
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        this[property] = newValue;

        if (this.isConnected)
            this.updateDisplay();
    }

    connectedCallback() {
        this.updateDisplay();
        this.addListeners();
    }

    disconnectedCallback() {
        this.removeListeners();
    }
}

customElements.define("todo-bottombar", TodoBottombar);

export default TodoBottombar;
