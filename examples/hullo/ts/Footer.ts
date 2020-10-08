import { html } from "@hullo/dom/html";
import { Observable } from "@hullo/core/observable";
import { map } from "@hullo/core/operators/map";
import { filters } from "./filters";
import { Task } from "./Task";

export function Footer(props: {
	tasks$: Observable<Task[]>;
	selectedFilter$: Observable<"all" | "active" | "completed">;
	clearCompleted: () => any;
}) {
	return html.footer(
		{
			attrs: {
				class: "footer",
				hidden: props.tasks$.pipe(
					map(tasks => (tasks.length === 0 ? "hidden" : undefined))
				)
			}
		},
		[
			html.span(
				{ attrs: { class: "todo-count" } },
				props.tasks$.pipe(
					map(tasks => [
						html.strong({
							props: {
								innerText: props.tasks$.pipe(
									map(tasks => filters.active(tasks).length.toString())
								)
							}
						}),
						` ${filters.active(tasks).length === 1 ? "item" : "items"} left`
					])
				)
			),

			html.ul({ attrs: { class: "filters" } }, [
				html.li({}, [
					html.a({
						attrs: {
							href: "/#all",
							class: props.selectedFilter$.pipe(
								map(filter => (filter === "all" ? "selected" : ""))
							)
						},
						props: { innerText: "All" }
					})
				]),

				html.li({}, [
					html.a({
						attrs: {
							href: "/#active",
							class: props.selectedFilter$.pipe(
								map(filter => (filter === "active" ? "selected" : ""))
							)
						},
						props: { innerText: "Active" }
					})
				]),

				html.li({}, [
					html.a({
						attrs: {
							href: "/#completed",
							class: props.selectedFilter$.pipe(
								map(filter => (filter === "completed" ? "selected" : ""))
							)
						},
						props: { innerText: "Completed" }
					})
				])
			]),

			html.button({
				attrs: {
					class: "clear-completed",
					hidden: props.tasks$.pipe(
						map(tasks =>
							filters.completed(tasks).length > 0 ? undefined : "hidden"
						)
					)
				},
				props: { innerText: "Clear completed" },
				events: {
					async click() {
						await props.clearCompleted();
					}
				}
			})
		]
	);
}
