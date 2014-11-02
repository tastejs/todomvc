var app = module.exports = require('derby').createApp('todomvc', __filename);
app.loadViews(__dirname);
app.loadStyles(__dirname + '/node_modules/todomvc-common/base.css');

// Major parts of the application should be broken up into independent
// components. Components can also be distributed as individual npm modules
app.component(require('./components/todos'));

// Routes render on client as well as server
app.get('/:mode(active|completed)?', function(page, model, params, next) {
  var todosQuery = model.query('todos', {});
  todosQuery.subscribe(function(err) {
    if (err) return next(err);
    page.render();
  });
});
