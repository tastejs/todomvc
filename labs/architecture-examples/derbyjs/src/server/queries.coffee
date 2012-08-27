module.exports = (store) ->
	store.query.expose 'todos', 'forGroup', (group) ->
		@where('group').equals(group)
