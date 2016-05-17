(function() {
	TodosList.pushAll(Skeleton.storage.fetch('models') || []);
	let filter = Skeleton.storage.fetch('filter') || 'all';
	router.visit(`/${filter}`);
})();