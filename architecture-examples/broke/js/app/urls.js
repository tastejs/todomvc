(function(context, undefined){
	var
		patterns= broke.conf.urls.defaults.patterns
	;
	
	todo.urls= patterns('todo.views',
		[ '^/task/create/', 'create' ]
        ,[ '^/task/update/([a-zA-Z0-9_-]+)/', 'update' ]
        ,[ '^/task/delete/([a-zA-Z0-9_-]+)/', 'delete' ]
        ,[ '^/task/complete/([a-zA-Z0-9_-]+)/', 'complete' ]
        ,[ '^/task/clear_completed/', 'clear_completed' ]
        ,[ '^/task/mark_all_as_complete/', 'mark_all_as_complete' ]
	);
})(this);