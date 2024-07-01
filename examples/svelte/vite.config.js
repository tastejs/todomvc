import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
	plugins: [
		svelte(),
		viteStaticCopy({
			targets: [
			  {
				src: 'node_modules/todomvc-common/base.js',
				dest: '.',
			  },
			],
		}),
	],
	base: "examples/svelte/dist/"
});
