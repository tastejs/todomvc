import { Observable } from "@hullo/core/observable";
import { Atom } from "@hullo/core/atom";
import { deepMap } from "@hullo/core/operators/deepMap";
import { map } from "@hullo/core/operators/map";
import { combineLatest } from "@hullo/core/combineLatest";
import { html } from "@hullo/dom/html";

import { Task } from "./Task";

export function List(props: {
	list$: Observable<Task[]>;
	onToggle: (idx: number) => any;
	onRename: (idx: number, label: string) => any;
	onRemove: (idx: number) => any;
}) {
	const edited$ = new Atom<number>(-1);

	return html.ul(
		{
			attrs: {
				class: "todo-list"
			}
		},
		props.list$.pipe(
			deepMap((task$, i) => {
				const tmpLabel$ = new Atom(task$.unwrap().label);
				task$.pipe(map(task => task.label)).subscribe(tmpLabel$);
				let editInput: HTMLInputElement | null = null;
				return html.li(
					{
						attrs: {
							class: combineLatest<[Task, number]>([task$, edited$]).pipe(
								map(([task, edited]) =>
									[
										"todo",
										task.completed ? "completed" : "active",
										i === edited ? "editing" : "viewing"
									]
										.join(" ")
										.trim()
								)
							)
						}
					},
					[
						html.div({ attrs: { class: "view" } }, [
							html.input({
								attrs: {
									class: "toggle",
									type: "checkbox"
								},
								props: {
									checked: task$.pipe(map(task => task.completed))
								},
								events: {
									async click(_event) {
										await props.onToggle(i);
									}
								}
							}),
							html.label({
								props: {
									innerText: task$.pipe(map(task => task.label))
								},
								events: {
									async dblclick() {
										await edited$.next(i);
										if (editInput) {
											editInput.focus();
										}
									}
								}
							}),
							html.button({
								attrs: { class: "destroy" },
								events: {
									async click(event) {
										event.preventDefault();
										await props.onRemove(i);
									}
								}
							})
						]),
						html.input({
							ref(e) {
								editInput = e as HTMLInputElement;
							},
							deref() {
								editInput = null;
							},
							attrs: { class: "edit", type: "text" },
							props: {
								value: tmpLabel$
							},
							events: {
								async input(event) {
									await tmpLabel$.next(
										(event.target as HTMLInputElement).value
									);
								},
								async blur() {
									await props.onRename(i, tmpLabel$.unwrap());
									await edited$.next(-1);
								},
								async keydown(event) {
									if (event instanceof KeyboardEvent && event.keyCode === 13) {
										await props.onRename(i, tmpLabel$.unwrap());
										await edited$.next(-1);
									}
									if (event instanceof KeyboardEvent && event.keyCode === 27) {
										await edited$.next(-1);
										await tmpLabel$.next(task$.unwrap().label);
									}
								}
							}
						})
					]
				);
			})
		)
	);
}
