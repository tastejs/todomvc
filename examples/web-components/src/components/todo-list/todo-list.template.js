const template = document.createElement("template");

template.id = "todo-list-template";
template.innerHTML = `
    <ul class="todo-list" style="display:none"></ul>
`;

export default template;
