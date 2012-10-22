define(function(){
	var Todo = dermis.model({
		editable: function(){
			this.set('editable', true);
		},
		uneditable: function(){
			this.set('editable', false);
			var title = this.get('title').trim();
			if(title.length === 0) this.destroy();
		},
		destroy: function(){
			this.set('active', false);
		}
	});
	return Todo;
});