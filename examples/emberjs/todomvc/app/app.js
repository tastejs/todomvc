/**
 * This file is used to boot the application.
 *
 * We can also use it to import / setup other "initializing"
 * things that wouldn't depend on user state.
 */
import 'todomvc-common/base.css';
import 'todomvc-common/base.js';
import 'todomvc-app-css/index.css';

import Application from '@ember/application';

import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';
import config from 'todomvc/config/environment';

export default class App extends Application {
	modulePrefix = config.modulePrefix;
	podModulePrefix = config.podModulePrefix;
	Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
