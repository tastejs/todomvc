/**
 * Some integration tests
 */
describe('Todos.Models.store', function(){

  var title = 'Testing title...';
  var store = Todos.Models.get('store');

  it('should allow creating and removing items', function(){
    var count = store.findAll().length;
    var todo = Todos.Models.get('store').createFromTitle(title);
    expect(store.findAll().length).to.equal(count + 1);
    expect(todo).to.have.property('title', title);
    expect(todo).to.have.property('isDone', false);
    store.remove(todo);
    expect(store.findAll().length).to.equal(count);
  });

  it('should allow finding and changing items', function(){
    var todo = store.createFromTitle(title);
    expect(store.find(todo).id).to.equal(todo.id);
    expect(store.find(todo).title).to.equal(todo.title);
    expect(store.find(todo).isDone).to.equal(false);
    todo.set('isDone', true);
    expect(store.find(todo).id).to.equal(todo.id);
    expect(store.find(todo).isDone).to.equal(true);
    Todos.Models.get('store').remove(todo);
  });

});
