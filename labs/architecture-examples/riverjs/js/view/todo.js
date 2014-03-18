/*
 * module dependence
 */

var route = require('util.route')
  , ctrl = require('controller.todos');

exports = module.exports = todo;

function todo(str,scope,element){
  var checkbox = element.querySelector('[type=checkbox]');
  var editinput = element.querySelector('.edit');
  var label = element.querySelector('label');

  route
  .when('#/',function(){
    element.style.display = 'block';
  })
  .when('#/active',function(){
    var sta = status(scope);
    if(sta == 'active'){
      element.style.display = 'block';
    }else if(sta == 'completed'){
      element.style.display = 'none';
    }
  })
  .when('#/completed',function(){
    var sta = status(scope);
    if(sta == 'active'){
      element.style.display = 'none';
    }else if(sta == 'completed'){
      element.style.display = 'block';
    }
  });

  route.nav();

  //on status change
  scope.onchange('status',function(newvalue,oldvalue){
    route.nav();
  });

  //db click on label show writeView
  label.ondblclick = function(){
    writeView(element);
  };

  //blur on input.edit show readView
  editinput.addEventListener('blur',function(){
    readView(element,scope);
  })

  //when user stroke enter or esc key show readView
  editinput.onkeydown = function(event){
    var enter = event.keyCode === 13 || false;
    var esc = event.keyCode === 27 || false;
    if(enter|| esc){
      readView(element,scope);
    }
  }
}

function status(scope){
  return scope.todo.status;
}

function writeView(element){
  var t = element.className;
  element.className = t + ' editing';
  element.querySelector('.edit').focus();
}

function readView(element,scope){
  var t = element.className;
  element.className = t.replace(/\sediting/,'');
  ctrl.save(scope.todos);
}
