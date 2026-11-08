/**
 * WebMCP tools for TodoMVC.
 *
 * Exposes the app to an AI agent in the browser through document.modelContext.
 * Every tool calls the same controller methods the UI calls, so the page
 * re-renders exactly as if the user had clicked.
 *
 * Without WebMCP (no `modelContext` on document) nothing here runs and the
 * app behaves exactly as before.
 *
 * Docs: https://developer.chrome.com/docs/ai/webmcp/imperative-api
 */

export const supportsWebMCP = () => "modelContext" in document;

// One controller for every tool, so a hot reload can unregister them all.
let tools;

export function initWebMCP(todo) {
    if (!supportsWebMCP())
        return;

    tools?.abort();
    tools = new AbortController();
    const { signal } = tools;

    register(listTodos(todo), signal);
    register(toggleTodo(todo), signal);
    register(editTodo(todo), signal);
    register(deleteTodo(todo), signal);
}

async function register(tool, signal) {
    try {
        await document.modelContext.registerTool(tool, { signal });
    } catch (error) {
        console.warn(`WebMCP: could not register ${tool.name}`, error);
    }
}

// The store answers through callbacks; tools want promises.
const readTodos = (model) => new Promise((resolve) => model.read(resolve));

const findTodo = async (model, id) => {
    // Models sometimes send "3" for 3; anything else that isn't a whole number is no id.
    const wanted = typeof id === "string" && /^\d+$/.test(id) ? Number(id) : id;
    if (!Number.isInteger(wanted))
        return undefined;

    const [todo] = await new Promise((resolve) => model.read(wanted, resolve));
    return todo;
};

const unknownId = (id) =>
    `There is no to-do with id ${JSON.stringify(id)}. Call list_todos to get the current ids.`;

const ID = {
    type: "integer",
    description: "The id of the to-do, as returned by list_todos.",
};

const listTodos = ({ model }) => ({
    name: "list_todos",
    description: "List every to-do as JSON with its id, title and completed state. " +
        "Call this first: the other tools take an id from this list.",
    inputSchema: { type: "object", properties: {} },
    annotations: {
        readOnlyHint: true,
        untrustedContentHint: true, // titles are text the user typed
    },
    async execute() {
        const todos = await readTodos(model);
        return JSON.stringify(todos.map(({ id, title, completed }) => ({ id, title, completed })));
    },
});

const toggleTodo = ({ model, controller }) => ({
    name: "toggle_todo",
    description: "Mark a to-do as completed or not completed. Take its id from list_todos.",
    inputSchema: {
        type: "object",
        properties: {
            id: ID,
            completed: {
                type: "boolean",
                description: "true marks it done, false marks it not done.",
            },
        },
        required: ["id", "completed"],
    },
    async execute({ id, completed }) {
        const todo = await findTodo(model, id);
        if (!todo)
            return unknownId(id);

        if (typeof completed !== "boolean")
            return "Say whether the to-do is done: set \"completed\" to true or false.";

        controller.toggleComplete(todo.id, completed);
        return `To-do ${todo.id} is now ${completed ? "completed" : "not completed"}.`;
    },
});

const editTodo = ({ model, controller }) => ({
    name: "edit_todo",
    description: "Change the title of a to-do. Take its id from list_todos.",
    inputSchema: {
        type: "object",
        properties: {
            id: ID,
            title: { type: "string", description: "The new text of the to-do." },
        },
        required: ["id", "title"],
    },
    async execute({ id, title }) {
        const todo = await findTodo(model, id);
        if (!todo)
            return unknownId(id);

        if (typeof title !== "string" || title.trim() === "")
            return "The title can't be empty. To remove the to-do instead, call delete_todo.";

        controller.editItemSave(todo.id, title);
        return `To-do ${todo.id} has been renamed.`;
    },
});

const deleteTodo = ({ model, controller }) => ({
    name: "delete_todo",
    description: "Delete a to-do for good. Take its id from list_todos. " +
        "To mark a to-do as done, use toggle_todo instead.",
    inputSchema: {
        type: "object",
        properties: { id: ID },
        required: ["id"],
    },
    annotations: {
        consequentialHint: true, // there is no undo
    },
    async execute({ id }) {
        const todo = await findTodo(model, id);
        if (!todo)
            return unknownId(id);

        controller.removeItem(todo.id);
        return `To-do ${todo.id} has been deleted.`;
    },
});
