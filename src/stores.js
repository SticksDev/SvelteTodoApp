// Create a store with an initial value.
import { writable } from 'svelte/store';

// Create the todoStore. with writeable(). add addTodo() and removeTodo() methods.
export function createTodoStore() {
	const { subscribe, set, update } = writable([{ id: 1, text: 'Learn Svelte', done: false }]);

	return {
		subscribe,
		addTodo: (text) => {
			update((todos) => {
				const nextId = todos.length + 1;
				return [...todos, { id: nextId, text, done: false }];
			});
		},
		removeTodo: (id) => {
			update((todos) => {
				return todos.filter((todo) => todo.id !== id);
			});
		},
		reset: () => {
			set([]);
		},
		clearCompleted: () => {
			update((todos) => {
				return todos.filter((todo) => !todo.done);
			});
		},
		toggleDone: (id) => {
			update((todos) => {
				return todos.map((todo) => {
					if (todo.id === id) {
						return { ...todo, done: !todo.done };
					}
					return todo;
				});
			});
		}
	};
}
