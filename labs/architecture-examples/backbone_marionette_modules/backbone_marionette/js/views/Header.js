
var Header = Backbone.Marionette.ItemView.extend({
  template : "#template-header",
  ui : {
    input : '#new-todo'
  },
  events : {
    'keypress #new-todo':		'onInputKeypress'
  },
  onInputKeypress : function(evt) {
    var ENTER_KEY = 13;
    var todoText = this.ui.input.val().trim();

    if ( evt.which === ENTER_KEY && todoText ) {
      todoList.create({
        title : todoText
      });
      this.ui.input.val('');
    }
  }
});
