import { mount } from "svelte";
import App from "./App.svelte";

const app = mount(App, {
    target: document.querySelector(".todoapp"),
});

export default app;
