define(['js/models/Todo', 'js/models/Todos'], function(Todo, Todos){
  var app = {
    show: function(){
      Todos.set('mode', 'all');
      $('.selected').removeClass('selected');
      $('a[href$="#/"]').addClass('selected');
    }
  };
  return app;
});