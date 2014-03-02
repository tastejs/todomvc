var STORAGE_ID = 'todos-riverjs';

exports.get = function(){
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
};

exports.put = function(){
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};
