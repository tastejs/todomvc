var ENTER_KEY = 13;

$(function() {
  // Kick things off by creating the **App**.
  var view = new Thorax.Views['app']({
    collection: window.app.Todos
  });
  view.appendTo('body');
});
