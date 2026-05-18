import './assets/main.css'
import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'
import 'todomvc-common/base.js'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('.todoapp');
