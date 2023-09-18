import template from "./todo-app.template.js";
import { useRouter } from "../../hooks/useRouter.js";

import globalStyles from "../../styles/global.constructable.js";
import appStyles from "../../styles/app.constructable.js";
import mainStyles from "../../styles/main.constructable.js";
class TodoApp extends HTMLElement {
    #isReady = false;
    #data = [];
    constructor() {
        super();

        const node = document.importNode(template.content, true);
        this.topbar = node.querySelector("todo-topbar");
        this.list = node.querySelector("todo-list");
        this.bottombar = node.querySelector("todo-bottombar");

        this.shadow = this.attachShadow({ mode: "open" });
        this.htmlDirection = document.dir || "ltr";
        this.setAttribute("dir", this.htmlDirection);
        this.shadow.adoptedStyleSheets = [globalStyles, appStyles, mainStyles];
        this.shadow.append(node);

        this.addItem = this.addItem.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.toggleItems = this.toggleItems.bind(this);
        this.clearCompletedItems = this.clearCompletedItems.bind(this);
        this.routeChange = this.routeChange.bind(this);

        this.router = useRouter();
    }

    get isReady() {
        return this.#isReady;
    }

    getInstance() {
        return this;
    }

    addItem(event) {
        const { detail: item } = event;

        this.#data.push(item);
        this.list.addItem(item);

        this.update("add-item", item.id);
    }

    toggleItem(event) {
        this.#data.forEach((entry) => {
            if (entry.id === event.detail.id)
                entry.completed = event.detail.completed;
        });

        this.update("toggle-item", event.detail.id);
    }

    removeItem(event) {
        this.#data.forEach((entry, index) => {
            if (entry.id === event.detail.id)
                this.#data.splice(index, 1);
        });

        this.update("remove-item", event.detail.id);
    }

    updateItem(event) {
        this.#data.forEach((entry) => {
            if (entry.id === event.detail.id)
                entry.title = event.detail.title;
        });

        this.update("update-item", event.detail.id);
    }

    toggleItems(event) {
        this.list.toggleItems(event.detail.completed);
    }

    clearCompletedItems() {
        this.list.removeCompletedItems();
    }

    update(type = "", id = "") {
        const totalItems = this.#data.length;
        const activeItems = this.#data.filter((entry) => !entry.completed).length;
        const completedItems = totalItems - activeItems;

        this.list.setAttribute("total-items", totalItems);
        this.list.updateElements(type, id);

        this.topbar.setAttribute("total-items", totalItems);
        this.topbar.setAttribute("active-items", activeItems);
        this.topbar.setAttribute("completed-items", completedItems);

        this.bottombar.setAttribute("total-items", totalItems);
        this.bottombar.setAttribute("active-items", activeItems);
    }

    addListeners() {
        this.topbar.addEventListener("toggle-all", this.toggleItems);
        this.topbar.addEventListener("add-item", this.addItem);

        this.list.listNode.addEventListener("toggle-item", this.toggleItem);
        this.list.listNode.addEventListener("remove-item", this.removeItem);
        this.list.listNode.addEventListener("update-item", this.updateItem);

        this.bottombar.addEventListener("clear-completed-items", this.clearCompletedItems);
    }

    removeListeners() {
        this.topbar.removeEventListener("toggle-all", this.toggleItems);
        this.topbar.removeEventListener("add-item", this.addItem);

        this.list.listNode.removeEventListener("toggle-item", this.toggleItem);
        this.list.listNode.removeEventListener("remove-item", this.removeItem);
        this.list.listNode.removeEventListener("update-item", this.updateItem);

        this.bottombar.removeEventListener("clear-completed-items", this.clearCompletedItems);
    }

    routeChange(route) {
        const routeName = route.split("/")[1] || "all";
        this.list.updateRoute(routeName);
        this.bottombar.updateRoute(routeName);
        this.topbar.updateRoute(routeName);
    }

    connectedCallback() {
        this.update("connected");
        this.addListeners();
        this.router.initRouter(this.routeChange);
        this.#isReady = true;
    }

    disconnectedCallback() {
        this.removeListeners();
        this.#isReady = false;
    }
}

customElements.define("todo-app", TodoApp);

export default TodoApp;
