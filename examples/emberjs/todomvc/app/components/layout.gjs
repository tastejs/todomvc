import { service } from 'ember-primitives/helpers';

import Create from './create';
import Footer from './footer';

function hasTodos(todos) {
	return todos.length > 0;
}

<template>
	<section class="todoapp">
		<header class="header">
			<h1>todos</h1>

			<Create />
		</header>

		{{yield}}

		{{#let (service "repo") as |repo|}}
			{{#if (hasTodos repo.all)}}
				<Footer />
			{{/if}}
		{{/let}}
	</section>
</template>
