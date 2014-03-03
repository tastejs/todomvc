exports = module.exports = function(str,scope,element){

  var eom = this.eom;

  window.onhashchange = function(){
    var menu = window.location.hash.replace(/\#\//,'') || 'all';
    var domlist = element.querySelectorAll('a');
    clear(domlist);
    logic[menu].call(domlist);
    console.log(scope);
    console.log(eom);
  }


  function clear(domlist){
    for (var i = 0, len = domlist.length; i < len; i++) {
      domlist[i].className = '';
    }
  }

  var logic = {};

  logic.all = function(){
    this[0].className = 'selected';
  }

  logic.active = function(){
    this[1].className = 'selected';
  }

  logic.completed = function(){
    this[2].className = 'selected';
  }
}
