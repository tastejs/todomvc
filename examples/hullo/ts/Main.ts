import { html } from "@hullo/dom";
import { Task } from "./Task";
import { map } from "@hullo/core/operators/map";
import { filters } from "./filters";
import { List } from "./List";
import { Observable } from "@hullo/core/observable";

export function Main(props: {
	tasks$: Observable<Task[]>;
	selectedTasks$: Observable<Task[]>;

	onToggleAll: () => any;
	onToggle: (idx: number) => any;
	onRename: (idx: number, label: string) => any;
	onRemove: (idx: number) => any;
}) {
	return html.section(
		{
			attrs: {
				class: "main",
				hidden: props.tasks$.pipe(
					map(tasks => (tasks.length === 0 ? "hidden" : undefined))
				)
			}
		},
		[
			html.input({
				attrs: {
					id: "toggle-all",
					class: "toggle-all",
					type: "checkbox"
				},
				props: {
					checked: props.tasks$.pipe(
						map(tasks => filters.active(tasks).length > 0)
					)
				},
				events: {
					async input(event) {
						event.preventDefault();
						await props.onToggleAll();
					}
				}
			}),
			html.label({
				attrs: { for: "toggle-all" },
				props: { innerText: "Mark all as complete" }
			}),
			List({
				list$: props.selectedTasks$,
				async onToggle(idx) {
					await props.onToggle(idx);
				},
				async onRename(idx, label) {
					await props.onRename(idx, label);
				},
				async onRemove(idx) {
					await props.onRemove(idx);
				}
			})
		]
	);
}
