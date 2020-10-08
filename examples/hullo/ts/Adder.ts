import { Channel } from "@hullo/core/channel";
import { Atom } from "@hullo/core/atom";
import { map } from "@hullo/core/operators/map";
import { html } from "@hullo/dom/html";

export function Adder(props: { onAdd: (text: string) => any }) {
	const newTaskLabel$ = new Atom("");

	const onInput$ = new Channel<Event>();
	onInput$
		.pipe(map(event => (event.target as HTMLInputElement).value))
		.subscribe(newTaskLabel$);

	return html.header({ attrs: { class: "header" } }, [
		html.h1({ props: { innerText: "todos" } }),
		html.input({
			attrs: {
				class: "new-todo",
				autofocus: "autofocus",
				autocomplete: "off",
				placeholder: "What needs to be done?"
			},
			props: { value: newTaskLabel$ },
			events: {
				input: onInput$,
				async keydown(event) {
					if (event instanceof KeyboardEvent && event.keyCode === 13) {
						await props.onAdd(newTaskLabel$.unwrap());
						await newTaskLabel$.next("");
					}
				}
			}
		})
	]);
}
