import App from './components/App.svelte';

import '/node_modules/todomvc-app-css/index.css';
import '/node_modules/todomvc-common/base.css';

const app = new App({
	target: document.body,
});

export default app;