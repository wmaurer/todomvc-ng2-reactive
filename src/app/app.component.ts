import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { TodosComponent } from './todos/todos.component';

import '../../node_modules/todomvc-app-css/index.css';

@Component({
    selector: 'todo-app',
    directives: [ROUTER_DIRECTIVES],
    template: `<router-outlet></router-outlet>`
})
@RouteConfig([
    { path: '/', name:'Todos', component: TodosComponent, useAsDefault: true },
    { path: '/:filter', name:'TodosFiltered', component: TodosComponent }
])
export class AppComponent {}
