define(['js/models/Todo', 'js/models/Todos'], function(Todo, Todos){
  var app = {
    show: function(){
      Todos.set('mode', 'active');
      $('.selected').removeClass('selected');
      $('a[href$="#/active"]').addClass('selected');
    }
  };
  return app;
});