const template = document.createElement("template");

template.id = "todo-topbar-template";
template.innerHTML = `
    <header class="topbar">
        <div class="new-todo-display">
            <label for="new-todo" class="visually-hidden">Enter a new todo.</label>
            <input id="new-todo" class="new-todo-input" placeholder="What needs to be done?" autofocus />
        </div>
        <div class="toggle-all-container" style="display:none">
            <input id="toggle-all" class="toggle-all-input" type="checkbox" />
            <label for="toggle-all" class="toggle-all-label">Mark all todos as complete.</label>
        </div>
    </header>
`;

export default template;
