define(['gnd'], function(Gnd){

  var TodoSchema = new Gnd.Schema({
    description: {type: String},
    completed: Boolean
  });

  return Gnd.Model.extend('todos', TodoSchema);
});
