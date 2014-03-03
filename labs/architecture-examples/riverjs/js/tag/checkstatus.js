exports = module.exports = function(str,scope,element,repeatscope){

  var cbx = element.querySelector('[type=checkbox]');

  if(repeatscope.status === 'active'){
    element.className =  ''; 
    cbx.checked = false;
  }else{
    element.className =  'completed'; 
    cbx.checked = true;
  }


  cbx.onclick = function(event){
    repeatscope.status = element.className ? 'active' : 'completed';
    element.className = element.className ? '' : 'completed';
  }
}
