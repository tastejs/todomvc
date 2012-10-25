(function(ns, Model) {

ns.Todo = Model.extend({
  idAttribute: 'cid'
});

})(Lavaca.resolve('app.models', true), Lavaca.mvc.Model);