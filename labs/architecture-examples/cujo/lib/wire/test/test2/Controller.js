define(['dojo'], function() {

	var Controller = function() {
	};
	
	Controller.prototype.ready = function() {
		if(this.widget) {
			var self = this;
			dojo.connect(this.widget, 'onChange', function(value) {
				console.log(self.name + ": " + value);
			});
		}
	};
	
	Controller.prototype.destroy = function() {
		console.log(this.name + " destroyed");
	};

	return Controller;
});