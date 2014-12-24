define((function () {
	'use strict';

	var list = ['./allNode'];
	if (typeof window !== 'undefined') {
		list.push('./allBrowser');
	}
	return list;
})(), 1);
