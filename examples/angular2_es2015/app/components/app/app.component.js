import { Component, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import template from './app.template.html';

@Component({
  selector: 'todo-app',
  directives: [ROUTER_DIRECTIVES],
  template: template
})
export class AppComponent {}
