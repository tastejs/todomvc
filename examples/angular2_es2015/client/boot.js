'use strict';
import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import {bootstrap, BrowserDomAdapter} from 'angular2/platform/browser';
import {TodoLocalStore} from './app/services/store';
import {TodoApp} from './app/components/todo';

bootstrap(TodoApp, [TodoLocalStore, BrowserDomAdapter]);
