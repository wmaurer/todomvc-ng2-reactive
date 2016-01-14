import { Component, Input, Output, OnChanges, ViewChild, SimpleChange, ChangeDetectionStrategy } from 'angular2/core';
import { Observable, Observer } from 'rxjs/Rx';
import { makeObservableFunction, observeCurrentValueFor, setFocus } from '../component-utils';

import { Todo } from '../Todo';
import { TodoItemIntent, TodoItemViewModel, todoItemDataFlow } from './todo-item.data-flow';

@Component({
    selector: 'todo-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: require('./todo-item.html')
})
export class TodoItemComponent {
    @Input('todo') private todo: Todo;
    @Output('delete') private delete$: Observable<{ id: string }>;
    @Output('edit') private edit$: Observable<{id: string, title: string}>;
    @Output('toggle') private toggle$: Observable<{ id: string }>;
    @ViewChild('inputEditTitle') private inputEditTitleElementRef: any;

    private viewModel: TodoItemViewModel;
    private changesObserver: Observer<{ [key: string]: SimpleChange }>;
    private changes$ = Observable.create(observer => this.changesObserver = observer);

    constructor() {
        // setup up intent
        const intent: TodoItemIntent = {
            startEdit$: makeObservableFunction<{}>(this, 'todoDblClick').share(),
            stopEdit$: Observable.merge(
                makeObservableFunction<string>(this, 'editOnBlur').map(x => x.target.value).share(),
                makeObservableFunction<string>(this, 'editOnKeyEnter').map(x => x.target.value).share()
            ),
            cancelEdit$: makeObservableFunction<{}>(this, 'editOnKeyEsc').share(),
            delete$: makeObservableFunction<{}>(this, 'todoDeleteClick').share(),
            toggleTodo$: makeObservableFunction<{}>(this, 'toggleCompletion').share()
        };

        // set up sources
        const todoInput$ = observeCurrentValueFor<Todo>(this.changes$, 'todo').publishReplay(1);
        todoInput$.connect();

        // setup the core data flow
        const responses = todoItemDataFlow(intent, todoInput$);

        // forward responses to parent component
        this.delete$ = responses.delete$;
        this.edit$ = responses.edit$;
        this.toggle$ = responses.toggle$;

        // subscribe to sink
        responses.viewModel$
            .subscribe(viewModel => {
                this.viewModel = viewModel;
                setFocus(this.inputEditTitleElementRef);
            });
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        this.changesObserver.next(changes);
    }
}
