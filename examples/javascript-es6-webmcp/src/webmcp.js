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
