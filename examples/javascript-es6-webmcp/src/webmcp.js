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
}
