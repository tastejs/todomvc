define(
'models/store',
['DS', 'LS'],
function (DS, LS) {
	return DS.Store.create({
		revision: 11,
		adapter: DS.LSAdapter.create({
			namespace: 'todos-emberjs'
		})
	});
});
