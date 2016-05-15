v (function() {

let models = Skeleton.storage.fetch('models');
if(models) {
	TodosList.pushAll(models);
}
let visibilityFilter = Skeleton.storage.fetch('filter') || 'all';
window.filterTodos(visibilityFilter);

})();