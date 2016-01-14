import { Input, Component, ViewChild, ChangeDetectionStrategy } from 'angular2/core';
import { RouteParams, RouterLink } from 'angular2/router';
import { Observable } from 'rxjs/Rx';

import { makeObservableFunction } from '../component-utils';

import { TodosIntent, todosDataFlow } from './todos.data-flow';
import { TodosViewModel } from './todos.view-model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodosStore, Todo } from '../Todo';
import { TodosStorageService } from '../todos-storage.service'

@Component({
    selector: 'todos',
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [TodoItemComponent, RouterLink],
    template: require('./todos.html')
})
export class TodosComponent {
    @ViewChild('newTodo') inputNewTodoElementRef: any;

    private viewModel: TodosViewModel;

    constructor(private routeParams: RouteParams, private todosStorageService: TodosStorageService) {
        // setup up intent
        const intent: TodosIntent = {
            addTodo$: makeObservableFunction<{ title: string }>(this, 'add').map(event => ({ title: event.target.value })),
            deleteTodo$: makeObservableFunction<{ id: string }>(this, 'delete'),
            editTodo$: makeObservableFunction<{ id: string, title: string }>(this, 'edit'),
            toggleTodo$: makeObservableFunction<{ id: string }>(this, 'toggle'),
            removeCompleted$: makeObservableFunction<{}>(this, 'removeCompleted'),
            toggleAll$: makeObservableFunction<{}>(this, 'toggleAll')
        };

        // set up sources
        var sources = {
            routeParams$: Observable.of<string>(routeParams.get('filter')),
            initialState$: Observable.of<TodosStore>(todosStorageService.load())
        };

        // setup the core data flow
        const { todosStore$, viewModel$ } = todosDataFlow(sources, intent);

        // subscribe to sinks
        viewModel$.subscribe(viewModel => this.viewModel = viewModel);
        todosStore$.subscribe(todosStore => todosStorageService.save(todosStore));
    }

    add2(event2) {
        console.log(event2)
    }
}
