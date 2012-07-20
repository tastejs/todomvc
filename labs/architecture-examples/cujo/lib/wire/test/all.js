(function(g) {

	var hash = '';
	try {
		hash = g.location.hash;
	} catch(e) {}

	doh.registerUrl('_fake', '../../_doh-fake.html' + hash);

	// Core
	doh.registerUrl('basic-types1', '../../basic-types1.html' + hash);
	doh.registerUrl('nested1', '../../nested1.html' + hash);
	doh.registerUrl('nested2', '../../nested2.html' + hash);
	doh.registerUrl('module-factory', '../../module.html' + hash);
	doh.registerUrl('create-constructor', '../../create-constructor.html' + hash);
	doh.registerUrl('prototype-factory', '../../prototype1.html' + hash);
	// create with raw constructors/functions
	doh.registerUrl('plain-constructors', '../../required-modules.html' + hash);

	// wire resolver
	doh.registerUrl('wire-resolver', '../../wire-resolver1.html' + hash);
	doh.registerUrl('wire-factory', '../../wire-factory1.html' + hash);

	// resolver errors
	doh.registerUrl('ref-missing1', '../../ref-missing1.html' + hash);
	doh.registerUrl('ref-missing2', '../../ref-missing2.html' + hash);

	// Facets

	// Base
	doh.registerUrl('init-facet', '../../init.html' + hash);
	doh.registerUrl('ready-facet', '../../ready.html' + hash);
	doh.registerUrl('destroy-facet', '../../destroy.html' + hash);

	// Factories

	// literal
	doh.registerUrl('literal-factory', '../../literal.html' + hash);

	// wire/dom
	doh.registerUrl('dom-resolver', '../../dom.html' + hash);

	// wire/dom/render
	doh.registerUrl('dom-render', '../../dom-render.html' + hash);

	// wire/aop
	doh.registerUrl('decorate1', '../../wire/aop/decorate1.html' + hash);
	doh.registerUrl('introduce1', '../../wire/aop/introduce1.html' + hash);
	doh.registerUrl('aop-weaving', '../../wire/aop/weave1.html' + hash);

	// wire/on
	doh.registerUrl('wire/on', '../../on.html' + hash);

	// wire/connect
	doh.registerUrl('wire/connect', '../../connect.html' + hash);

	// wire/sizzle
	doh.registerUrl('sizzle', '../../sizzle.html' + hash);

	// Dojo
//	doh.registerUrl('wire/dojo/dom', '../../dojo/dom.html' + hash);
//	doh.registerUrl('wire/dojo/dom-insert', '../../dojo/dom-insert.html' + hash);
	doh.registerUrl('wire/dojo/on', '../../dojo/on.html' + hash);
//	doh.registerUrl('wire/dojo/pubsub', '../../dojo/pubsub1.html' + hash);

	// jQuery
	doh.registerUrl('wire/jquery/dom', '../../jquery/dom.html' + hash);
	doh.registerUrl('wire/jquery/dom-insert', '../../jquery/dom-insert.html' + hash);
	doh.registerUrl('wire/jquery/on', '../../jquery/on.html' + hash);

	// Go
	doh.run();

})(this);
