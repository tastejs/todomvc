/// <reference path="../node_modules/angular2/platform/browser.d.ts" />
/// <reference path="../node_modules/angular2/core.d.ts" />

import { bootstrap } from 'angular2/platform/browser';
import { provide, enableProdMode } from 'angular2/core';

import { App } from './app';
import { createStore } from 'redux';
import { TodoReducer } from './todoReducer';
import { TodoActions } from './todoActions';

const appStore = createStore(TodoReducer);

enableProdMode();

bootstrap(App, [
    provide('AppStore', { useValue: appStore }),
    TodoActions
])
.catch(err => console.error(err));
