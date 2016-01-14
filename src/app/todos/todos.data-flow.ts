import { Observable, ConnectableObservable } from 'rxjs/Rx';
import cuid = require('cuid');

import { TodosViewModel, createViewModel } from './todos.view-model';
import { Todo, TodosStore } from '../Todo';

export interface TodosSources {
    routeParams$: Observable<string>;
    initialState$: Observable<TodosStore>;
}

export interface TodosIntent {
    addTodo$: Observable<{ title: string }>;
    deleteTodo$: Observable<{ id: string }>;
    editTodo$: Observable<{ id: string, title: string }>;
    toggleTodo$: Observable<{ id: string }>;
    removeCompleted$: Observable<{}>;
    toggleAll$: Observable<{}>;
}

export interface TodoViewModel extends Todo {
    editing: boolean;
}

function todosReducers(intent: TodosIntent): Observable<(todosStore: TodosStore) => TodosStore> {
    const addTodoReducer$ = intent.addTodo$
        .map(({ title }) => title.trim())
        .filter(title => !!title)
        .map(title => (todosStore: TodosStore) => ({
            todos: [
                ...todosStore.todos,
                { id: cuid(), title, completed: false }
            ]
        }));

    const deleteTodoReducer$ = intent.deleteTodo$
        .map(({ id }) => (todosStore: TodosStore) => ({
            todos: todosStore.todos.filter(todo => todo.id !== id)
        }));

    const editTodoReducer$ = intent.editTodo$
        .map(({ id, title }) => (todosStore: TodosStore) => ({
            todos: todosStore.todos.map(todo => todo.id !== id ? todo : Object.assign({}, todo, { title }))
        }));

    const toggleTodoReducer$ = intent.toggleTodo$
        .map(({ id }) => (todosStore: TodosStore) => ({
            todos: todosStore.todos.map(todo => todo.id !== id ? todo : Object.assign({}, todo, { completed: !todo.completed }))
        }));

    const removeCompletedReducer$ = intent.removeCompleted$
        .map(() => (todosStore: TodosStore) => ({
            todos: todosStore.todos.filter(todo => !todo.completed)
        }));

    const toggleAllReducer$ = intent.toggleAll$
        .map(() => (todosStore: TodosStore) => {
            const allCompleted = todosStore.todos.reduce((x, y) => x && y.completed, true);
            return {
                todos: todosStore.todos.map(todo => Object.assign({}, todo, { completed: !allCompleted }))
            };
        });

    return Observable.merge(addTodoReducer$, deleteTodoReducer$, editTodoReducer$, toggleTodoReducer$, removeCompletedReducer$, toggleAllReducer$);
}

export function todosDataFlow(sources: TodosSources, intent: TodosIntent) {
    const reducers$ = todosReducers(intent);

    const todosStore$ =
        sources.initialState$
            .concat<TodosStore>(reducers$)
            .scan<TodosStore>((todosStore: TodosStore, reducer: any) => ({
                todos: reducer(todosStore).todos
            })).publishReplay(1);
    todosStore$.connect();

    const viewModel$ = todosStore$
        .withLatestFrom(sources.routeParams$, (todosStore: TodosStore, routeParams: string) => ({ todosStore, routeParams }))
        .map<TodosViewModel>(x => createViewModel(x.todosStore, x.routeParams));

    return {
        todosStore$,
        viewModel$
    };
}
