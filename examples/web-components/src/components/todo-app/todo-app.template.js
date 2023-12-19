const template = document.createElement("template");

template.id = "todo-app-template";
template.innerHTML = `
    <section class="app">
        <todo-topbar></todo-topbar>
        <main class="main">
            <todo-list></todo-list>
        </main>
        <todo-bottombar></todo-bottombar>
    </section>
`;

export default template;
