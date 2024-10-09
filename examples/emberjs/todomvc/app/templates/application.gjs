import title from 'ember-page-title/helpers/page-title';
import Route from 'ember-route-template';
import Attribution from 'todomvc/components/attribution';
import Layout from 'todomvc/components/layout';

export default Route(
	<template>
		{{title "TodoMVC"}}

		<Layout>
			{{outlet}}
		</Layout>

		<Attribution />
	</template>,
);
