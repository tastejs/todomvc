/**
 * Some smoke tests
 */
describe('Todos.Controllers.main', function(){

  var controller = Todos.Controllers.get('main');
  var title = "Another title...";

  it('should have a view for entering new entry', function(){
    expect(controller.inputView).to.be.a('object');
    expect(
      $(controller.inputView.get('element')).attr('placeholder')
    ).to.equal(controller.inputView.get('placeholder'));
  });

  it('should create new entry on newline', function(){
    controller.inputView.set('value', title);
    controller.inputView.insertNewline();
    expect(controller.get('lastObject').title).to.equal(title);
    controller.removeObject(controller.get('lastObject'));
  });


  it('should reflect the same number of items as in store', function(){
    controller.inputView.set('value', title);
    controller.inputView.insertNewline();
    var visibles = controller.todosView.get('childViews')[0].get('childViews').length;
    expect(controller.get('content').length).to.equal(visibles);
    controller.removeObject(controller.get('lastObject'));
  });

  it('should allow removing entries', function(done){
    controller.inputView.set('value', title);
    controller.inputView.insertNewline();
    setTimeout(function(){
      controller.allDoneCheckbox.set('value', true);
    }, 100);
    setTimeout(function(){
      controller.clearCompletedButton.triggerAction();
    }, 200);
    setTimeout(function(){
      expect(controller.get('content').length).to.equal(0);
    }, 300);
    done();
  });

});
