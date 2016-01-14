import { TodosStore } from './Todo';

export class TodosStorageService {
    private localStorageKey = 'todomvc-ng2-rx';

    save(todosStore: TodosStore): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(todosStore));
    }

    load(): TodosStore {
        return JSON.parse(localStorage.getItem(this.localStorageKey) || '{ "todos": [] }')
    }
}
