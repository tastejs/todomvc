define(['gnd', 'models/todo'], function(Gnd, Todo){
  
  var TodoListSchema = new Gnd.Schema({
    todos: new Gnd.CollectionSchemaType(Todo)
  });

  return Gnd.Model.extend('todolists', TodoListSchema);
});

