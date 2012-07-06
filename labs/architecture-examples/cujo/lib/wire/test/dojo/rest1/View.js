define([], function() {

	var me = function() {
	};
	
	me.prototype.ready = function() {
		var self = this;
		this.store.query({}).forEach(function(person) {
			if(!self.list) {
				self.container.innerHTML = self.template;
				self.list = self.container.firstChild;
			}

			self.list.innerHTML += self.itemTemplate.replace(/\$\{name\}/, person.name);
		});
	};

	return me;
});