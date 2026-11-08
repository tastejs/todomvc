import View from "./view";
import Controller from "./controller";
import Model from "./model";
import Store from "./store";
import Template from "./template";

import "todomvc-app-css/index.css";
import "todomvc-common/base.css";
import "./app.css";

let todo;
const onHashChange = () => {
    todo.controller.setView(document.location.hash);
};

const onLoad = () => {
    todo = new Todo("javascript-es6-webpack");
    onHashChange();
};

function Todo(name) {
    this.storage = new Store(name);
    this.model = new Model(this.storage);
    this.template = new Template();
    this.view = new View(this.template);
    this.controller = new Controller(this.model, this.view);
}

/* HOT MODULE SPECIFIC */
if (module.hot) {
    module.hot.accept(function (err) {});
    if (document.readyState === "complete")
        onLoad();
}

window.addEventListener("load", onLoad);
window.addEventListener("hashchange", onHashChange);
