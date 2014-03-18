var STORAGE_ID = 'todos-riverjs';

exports.get = function(){
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
};

exports.save = function(todos){
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};
