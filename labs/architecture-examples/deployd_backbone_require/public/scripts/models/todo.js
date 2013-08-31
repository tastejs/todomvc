define(function () {
  //If "a" has used exports, then we have a real
  //object reference here. However, we cannot use
  //any of a's properties until after b returns a value.
  return Backbone.Model.extend({
  	// Default attributes for the todo
  	// and ensure that each todo created has `title` and `completed` keys.
  	defaults: {
  		title: '',
  		completed: false
  	},

  	// Toggle the `completed` state of this todo item.
  	toggle: function () {
  		this.save({
  			completed: !this.get('completed')
  		});
  	}
  });
});
