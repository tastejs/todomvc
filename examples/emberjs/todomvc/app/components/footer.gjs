import { on } from '@ember/modifier';

import { service } from 'ember-primitives/helpers';

import Filters from './filters';

function itemLabel(count) {
	if (count === 0 || count > 1) {
		return 'items';
	}

	return 'item';
}

<template>
	{{#let (service "repo") as |repo|}}
		<footer class="footer">
			<span class="todo-count">
				<strong>{{repo.remaining.length}}</strong>
				{{itemLabel repo.remaining.length}}
				left
			</span>

			<Filters />

			{{#if repo.completed.length}}
				<button class="clear-completed" type="button" {{on "click" repo.clearCompleted}}>
					Clear completed
				</button>
			{{/if}}
		</footer>
	{{/let}}
</template>
