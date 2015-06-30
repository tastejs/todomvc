import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('addTodos',
  function(app, ...titles) {
    app.testHelpers.visit('/');

    titles.forEach(title => {
      app.testHelpers.fillIn('.new-todo', title);
      app.testHelpers.triggerEvent('.new-todo', 'submit');
    });
  }
);
