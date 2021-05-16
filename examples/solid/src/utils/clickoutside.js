import { createEffect, onCleanup } from 'solid-js';

const events = ['mousedown', 'touchstart'];

export function onClickOutside(ref, handler) {
	function listener(ev) {
		if(!ref || ref.contains(ev.target)) return;
		handler(ev);
	}

	createEffect(() => {
		ref; // trigger
		events.forEach(event => document.addEventListener(event, listener, { passive: true }));
	})

	onCleanup(() => {
		ref; // trigger
		events.forEach(event => document.removeEventListener(event, listener, { passive: true }))
	})
}
