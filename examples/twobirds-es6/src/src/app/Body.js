app.Body = class Body extends Tb{

	constructor(){
		super();

		let that = this; // ...minification

		that.handlers = {
			init: that.init
		};

		that.template = $(`
			<section class="todoapp">
				<app-header class="header"></app-header>
				<app-content class="main"></app-content>
			</section>
			<app-footer class="info"></app-footer>
			<script src="node_modules/todomvc-common/base.js"></script>
			<link rel="stylesheet" href="node_modules/todomvc-common/base.css">
		`);

	}

	init(){
		
		let that = this; // ...minification

		$(that.target)
			.append(that.template)
			.clean();
	}

};