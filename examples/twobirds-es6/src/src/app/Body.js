app.Body = class Body extends Tb{

	constructor(){
		super();

		let that = this; // ...minification

		that.handlers = {
			init: that.init
		};

		// simple routing
		window.onhashchange = function(){
			let hash = window.location.hash,
				filter = hash.split('/')[1] || hash;

			console.log(filter);

			$('a.a-'+filter).trigger('click');

		};

	}

	get template(){ return `
		<section class="todoapp">
			<app-header class="header"></app-header>
			<app-content class="main"></app-content>
		</section>
		<app-footer class="info"></app-footer>
		<script src="node_modules/todomvc-common/base.js"></script>
		<link rel="stylesheet" href="node_modules/todomvc-common/base.css">`;
	}

	init(){
		
		let that = this; // ...minification

		$(that.target)
			.append( $(that.template.trim()) )
			.clean();
	}

};