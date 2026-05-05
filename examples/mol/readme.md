# TodoMVC: $mol

> $mol is a reactive web framework with zero-config MAM build system, virtual DOM, lazy rendering, and automatic dependency tracking.

See [mol.hyoo.ru](https://mol.hyoo.ru/) for more information.

## Implementation

This implementation uses [$mol](https://github.com/hyoo-ru/mam) — a reactive web framework where UI is declared in `.view.tree` files and logic is written in TypeScript.

### Key components used

- `$mol_scroll` — root scrollable container
- `$mol_list` — virtual list with lazy rendering
- `$mol_string` — text input with submit support
- `$mol_check` — checkbox (toggle all)
- `$mol_link` — routing links with `$mol_state_arg`
- `$mol_button_minor` — clear completed button
- `$mol_state_local` — localStorage persistence

### State management

State is managed reactively via `$mol_mem` (memoized reactive properties). Todo items are persisted in `localStorage` using `$mol_state_local`. Routing (All / Active / Completed) uses `$mol_state_arg` which maps URL hash parameters to reactive state.

### Architecture

The entire app is a single component (`$todomvc`) with a nested `$todomvc_task_row` for each todo item. The `.view.tree` file declares the component structure, `.view.ts` adds reactive logic, and `.css` provides styling matching the TodoMVC spec.

## Building and running

$mol uses [MAM](https://github.com/hyoo-ru/mam) — a zero-config build system that resolves dependencies by filesystem path. Docker provides an isolated MAM workspace out of the box.

```bash
docker compose up --build
# Open http://localhost:9080/todomvc/-/test.html
```

### Local development (MAM workspace)

If you already have a MAM workspace:

```bash
cp -r todomvc/ /path/to/mam/todomvc/
cd /path/to/mam
npm start
# Open http://localhost:9080/todomvc/-/test.html
```
