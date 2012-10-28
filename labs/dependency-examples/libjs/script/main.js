include.cfg({
	appcompo: '/script/compos/{name}.js'
}).js({
	lib: 'compo',
	framework: ['arr', 'utils', 'routes'],
	'': '/script/model.js'
}).wait().js({
	compo: 'binding',
	appcompo: 'todoApp',
}).ready(function() {

	new Compo('#layout').render(tasksDB).insert(document.body);

});