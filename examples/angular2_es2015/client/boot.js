'use strict';
import 'es6-shim';
import 'reflect-metadata';
import 'zone.js/lib/browser/zone-microtask';
import {bootstrap} from 'angular2/platform/browser';
import {TodoLocalStore} from './app/services/store';
import {TodoApp} from './app/components/todo';

bootstrap(TodoApp, [TodoLocalStore]);
