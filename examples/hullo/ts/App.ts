import { createHashHistory } from "history";
import { route } from "@hullo/browser/route";
import { ofHistory } from "@hullo/browser/ofHistory";
import { Atom } from "@hullo/core/atom";
import { combineLatest } from "@hullo/core/combineLatest";
import { map } from "@hullo/core/operators/map";
import { state } from "@hullo/core/operators/state";
import { html } from "@hullo/dom/html";
import { Task } from "./Task";
import { filters } from "./filters";
import { Adder } from "./Adder";
import { Main } from "./Main";
import { Footer } from "./Footer";

export function App() {
	const tasks$ = containTasks();

	const selectedFilter$ = streamSelectedFilter();

	const selectedTasks$ = combineLatest<[Task[], keyof typeof filters]>([
		tasks$,
		selectedFilter$
	]).pipe(map(([tasks, selectedFilter]) => filters[selectedFilter](tasks)));

	return html.section(
		{
			attrs: { class: "todoapp" }
		},
		[
			Adder({
				async onAdd(label) {
					await tasks$.update(tasks =>
						tasks.concat([
							{
								label,
								completed: selectedFilter$.unwrap() === "completed"
							}
						])
					);
				}
			}),
			Main({
				tasks$,
				selectedTasks$,
				async onToggle(idx: number) {
					await tasks$.update(tasks =>
						tasks.map((task, i) =>
							i === idx ? { ...task, completed: !task.completed } : task
						)
					);
				},
				async onRemove(idx: number) {
					await tasks$.update(tasks => tasks.filter((_tasks, i) => i !== idx));
				},
				async onRename(idx: number, label: string) {
					await tasks$.update(tasks =>
						tasks.map((task, i) => (i === idx ? { ...task, label } : task))
					);
				},
				async onToggleAll() {
					const tasks = tasks$.unwrap();
					const completed = filters.active(tasks).length > 0;
					await tasks$.update(tasks =>
						tasks.map(({ label }) => ({ label, completed }))
					);
				}
			}),
			Footer({
				tasks$,
				selectedFilter$,
				async clearCompleted() {
					await tasks$.update(tasks => tasks.filter(task => !task.completed));
				}
			})
		]
	);
}

function containTasks() {
	const tasksSerialized = window.localStorage.getItem("todos-hullo");
	const tasks$ = new Atom<Task[]>(
		tasksSerialized ? JSON.parse(tasksSerialized) : []
	);
	tasks$.subscribe({
		next(tasks) {
			window.localStorage.setItem("todos-hullo", JSON.stringify(tasks));
		}
	});
	return tasks$;
}

function streamSelectedFilter() {
	return ofHistory(createHashHistory())
		.pipe(
			route([
				{
					when: /^\/([a-z]*)$/,
					have([filter]) {
						return (filter in filters ? filter : "all") as keyof typeof filters;
					}
				}
			])
		)
		.pipe(state<keyof typeof filters>("all"));
}
