define(function(){
	var Todo = dermis.model({
		setEditable: function(){
			this.set('editable', true);
		},
		save: function(){
			this.set('editable', false);
			var title = this.get('title').trim();
			if(title.length === 0) this.destroy();
		},
		destroy: function(){
			this.collection.remove(this);
		},
		serialize: function(){
			return {
				title: this.get('title'),
				completed: this.get('completed')
			};
		}
	});
	return Todo;
});