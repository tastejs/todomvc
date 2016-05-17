// Subscriptions
TodosList.subscribe(['push','edit'], () => {
	let filter = Skeleton.storage.fetch('filter') || 'all';
	if(filter) {
		window.filterTodos(filter);
	}
});

TodosList.subscribe(['push','remove','edit','removeAll'], () => {
	updateSize();
	Skeleton.storage.save({ 
		models: TodosList.models() 
	});
});

TodosList.subscribe('pushAll', updateSize);