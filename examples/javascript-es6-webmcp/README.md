TodoMVC: JavaScript Es6 with Webpack and WebMCP

## Description

This application uses JavaScript with ES6 language features to implement a todo application.

It is a copy of the [JavaScript ES6 example](../javascript-es6) that also exposes the app to AI
agents in the browser through WebMCP. See [WebMCP](#webmcp) below.

JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it..

[JavaScript - developer.mozilla.org](http://developer.mozilla.org/en-US/docs/JavaScript)

In addition, this application also relies on [Webpack](https://webpack.js.org/) to generate a build. At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph from one or more entry points and then combines every module your project needs into one or more bundles, which are static assets to serve your content from.

## Implementation Details

This implementation uses an explicit MVC pattern, with a clear file structure to reflect the architecture. The storage solution uses an in-memory data object that implements a simple array to hold the todos.

## Build Steps

To build the static files, this application utilizes webpack. It minifies and optimizes output files and copies all necessary files to a `dist` folder.

```
npm run build
```

## Requirements

The only requirement is an installation of Node, to be able to install dependencies and run scripts to serve a local server.

```
* Node (min version: 18.13.0)
* NPM (min version: 8.19.3)
```

## Local preview

```
terminal:
1. npm install
2. npm run dev

browser:
1. http://localhost:7001/
```

## WebMCP

This example exposes the app to AI agents in the browser through
[WebMCP](https://developer.chrome.com/docs/ai/webmcp). An agent can add, list,
complete, rename and delete to-dos, switch the filter and clear finished ones.
Every tool calls the same code as the UI, so the page updates while the agent works.

Without WebMCP (`'modelContext' in document` is false) no tools are registered and the app
works like the original, with one difference: a new to-do is added by pressing Enter only,
not when the input loses focus, as the [app spec](../../app-spec.md#new-todo) describes. Submitting
the form is the single path that adds a to-do, for people and agents alike.

| Tool | Kind | What it does |
| --- | --- | --- |
| `add_todo` | declarative (`<form toolname>`) | Adds one to-do |
| `list_todos` | `registerTool()`, read-only | Lists to-dos as JSON with `id`, `title`, `completed` |
| `toggle_todo` | `registerTool()` | Marks a to-do done or not done, by id |
| `edit_todo` | `registerTool()` | Renames a to-do, by id |
| `delete_todo` | `registerTool()`, consequential | Deletes a to-do, by id |
| `set_filter` | `registerTool()` | Shows `all`, `active` or `completed` |
| `clear_completed` | `registerTool()`, consequential | Deletes every completed to-do; only registered while there are some |

The declarative tool is in `src/index.html` (submit handler in `src/view.js`);
the imperative tools are in `src/webmcp.js`.

### Try it

1. In Chrome, open `chrome://flags/#enable-webmcp-testing`, set it to **Enabled**
   and relaunch.
2. Serve the app on localhost:

    ```
    npm install
    npm run dev
    ```

3. Install the example agent extension,
   [GoogleChromeLabs/webmcp-extension](https://github.com/GoogleChromeLabs/webmcp-extension),
   and set it up as its README describes.
4. Open the app, open the extension and try these prompts in order:

    - "Add milk, eggs and bread"
    - "I bought the milk"
    - "What's still left to do?"
    - "Clean up the finished ones"

    `clear_completed` only exists once something is completed, so the last prompt
    works after the second one.
