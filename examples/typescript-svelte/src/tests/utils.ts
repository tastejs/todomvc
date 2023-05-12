import type { SvelteComponent } from 'svelte';

export function bindListeners<T>(
  component: SvelteComponent,
  listeners: Partial<Record<keyof T, (event: CustomEvent<T[keyof T]>) => void>>
): void {
  Object.entries(listeners).forEach(([eventName, callback]) => {
    component.$on(eventName, callback as ((event: CustomEvent) => void));
  });
}
