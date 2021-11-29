/* eslint-disable unicorn/no-process-exit */
'use strict';
let updateNotifier = require('.');

const options = JSON.parse(process.argv[2]);

updateNotifier = new updateNotifier.UpdateNotifier(options);

(async () => {
	// Exit process when offline
	setTimeout(process.exit, 1000 * 30);

	const update = await updateNotifier.fetchInfo();

	// Only update the last update check time on success
	updateNotifier.config.set('lastUpdateCheck', Date.now());

	if (update.type && update.type !== 'latest') {
		updateNotifier.config.set('update', update);
	}

	// Call process exit explicitly to terminate the child process,
	// otherwise the child process will run forever, according to the Node.js docs
	process.exit();
})().catch(error => {
	console.error(error);
	process.exit(1);
});
