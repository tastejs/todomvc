"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const app_component_1 = require("./app.component");
exports.routes = [
    { path: 'all', component: app_component_1.AppComponent },
    { path: 'active', component: app_component_1.AppComponent },
    { path: 'completed', component: app_component_1.AppComponent },
    { path: '', redirectTo: '/all', pathMatch: 'full' },
];
