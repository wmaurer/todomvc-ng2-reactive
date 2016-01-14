import { Observable } from 'rxjs/Rx';

import { Todo } from '../Todo';

export interface TodoItemIntent {
    startEdit$: Observable<{}>;
    stopEdit$: Observable<string>;
    cancelEdit$: Observable<{}>;
    delete$: Observable<{}>;
    toggleTodo$: Observable<{}>;
}

export interface TodoItemViewModel extends Todo {
    editing: boolean;
}

export function todoItemDataFlow(intent: TodoItemIntent, todoProperty$: Observable<Todo>){
    const editing$ = Observable.merge<boolean, boolean>(
        intent.startEdit$.map(() => true),
        intent.stopEdit$.map(() => false),
        intent.cancelEdit$.map(() => false)
    ).startWith(false);

    const viewModel$ = todoProperty$
        .combineLatest(editing$, (todoProperty, editing) => Object.assign({}, todoProperty, { editing }));

    const delete$ = intent.delete$
        .withLatestFrom(todoProperty$, (_, todo: Todo) => todo)
        .map(x => ({ id: x.id }));

    const edit$ = intent.stopEdit$
        .withLatestFrom(todoProperty$, (title: string, todo: Todo) => ({ title, todo }))
        .filter(x => x.title !== x.todo.title)
        .map(x => ({ id: x.todo.id, title: x.title }));

    const toggle$ = intent.toggleTodo$
        .withLatestFrom(todoProperty$, (_, todo: Todo) => todo)
        .map(todo => ({ id: todo.id }));

    return {
        viewModel$,
        delete$,
        edit$,
        toggle$
    };
}
