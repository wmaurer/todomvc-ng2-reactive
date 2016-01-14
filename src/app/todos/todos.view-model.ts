import { TodosStore, Todo } from '../Todo';

export interface TodosViewModel {
    todos: Todo[];
    allTodosCompleted: boolean;
    numTodos: number;
    numTodosActive: number;
    numTodosCompleted: number;
    newTodoTitle: string;
}

export function createViewModel(todosStore: TodosStore, filter: string) {
    const numTodos = todosStore.todos.length;
    const numTodosCompleted = todosStore.todos.filter(x => x.completed).length;
    return {
        numTodos,
        numTodosCompleted,
        allTodosCompleted: numTodosCompleted > 0 && numTodosCompleted === numTodos,
        todos: todosStore.todos.filter(todo => includeTodoBasedOnFilter(todo, filter)),
        numTodosActive: numTodos - numTodosCompleted,
        newTodoTitle: ''
    }
}

function includeTodoBasedOnFilter(todo: Todo, filter: string) {
    switch (filter) {
        case 'active':
            return !todo.completed;
        case 'completed':
            return todo.completed;
        default:
            return true;
    }
}
