define(['js/models/Todo', 'js/models/Todos'], function(Todo, Todos){
  var app = {
    show: function(){
      Todos.set('mode', 'completed');
      $('.selected').removeClass('selected');
      $('a[href$="#/completed"]').addClass('selected');
    }
  };
  return app;
});