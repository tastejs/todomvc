var pages = {};

function route (){
  var addr = location.hash;
  if(pages[addr] && typeof pages[addr] == 'function')
    pages[addr]();
}

window.addEventListener('hashchange',function(){ route() }); 

exports.nav = function(){
  route();
}

exports.when = function(id,fn){
  pages[id] = fn;
  return this;
}
