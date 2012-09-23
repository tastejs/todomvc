var ENTER_KEY = 13;

$(function() {
  Backbone.history.start();
	// Kick things off by creating the **App**.
	var view = new Thorax.Views['app']();
  $('body').append(view.el);
});
