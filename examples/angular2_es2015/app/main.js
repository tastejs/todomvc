import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'node-uuid';
import 'localStorage';

import { bootstrap } from '@angular/platform-browser-dynamic';
import { routeProvider } from './components/todo.routes';

import { TodoStoreService } from './services/todo-store.service';
import { AppComponent } from './components/app/app.component';

bootstrap(AppComponent, [
  TodoStoreService,
  routeProvider
]);
