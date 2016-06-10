(function () {
	/* global CLASS */
	'use strict';
	CLASS({
		package: 'com.todomvc',
		name: 'Todo',
		properties: [
			'id',
			{ name: 'completed', model_: 'BooleanProperty' },
			{ name: 'text', preSet: function (_, text) { return text.trim(); } }
		],
		templates: [
			function toDetailHTML() {/*
				<li id="%%id">
					<div class="view">
						$$completed{className: 'toggle'}
						$$text{mode: 'read-only', tagName: 'label'}
						<button class="destroy" id="<%= this.on('click', function () { this.parent.dao.remove(this.data); }) %>"></button>
					</div>
					$$text{className: 'edit'}
				</li>
				<%
					var toEdit    = function () { DOM.setClass(this.$, 'editing'); this.textView.focus(); }.bind(this);
					var toDisplay = function () { DOM.setClass(this.$, 'editing', false); }.bind(this);
					this.on('dblclick', toEdit, this.id);
					this.on('blur', toDisplay, this.textView.id);
					this.textView.subscribe(this.textView.ESCAPE, toDisplay);
					this.setClass('completed', function () { return this.data.completed; }.bind(this), this.id);
				%>
			*/}
		]
	});
})();
