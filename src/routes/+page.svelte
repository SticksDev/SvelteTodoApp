<script>
	// Setup animations
	import { fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';

	// Setup the todo variable
	let todo = '';
	let error = '';

	// Load store
	import { createTodoStore } from '../stores.js';
	const todoStore = createTodoStore();

	// Create a new todo
	function createTodo() {
		console.log('createTodo: ', todo);

		if (error !== '') {
			error = '';
		}

		if (todo === '') {
			error = 'You need to enter a todo!';
			return;
		}

		// Add the todo to the store
		todoStore.addTodo(todo);

		// Reset the todo
		todo = '';
		error = '';

		// re focus the input
		document.getElementById('todo_input')?.focus();
	}

	// subscribe to the store and keep a local array of the todos for array operations
	/**
	 * @type {{ id: number; text: string; done: boolean; }[]}
	 */
	let todos = [];
	const unsubscribe = todoStore.subscribe((value) => {
		todos = [...value];
	});

	// unsubscribe from the store when the component is destroyed
	onDestroy(() => {
		unsubscribe();
	});
</script>

<main class="bg-zinc-800 text-white min-h-screen">
	<!-- div to center text on the middle of the screen -->
	<div class="flex flex-col justify-center items-center h-full">
		<h1 class="text-4xl font-bold mt-4">My Very Sick Todo App</h1>
		<p class="text-xl text-gray-400">(but he never does anything <b>useful</b>)</p>
		<!-- form to creat a new todo -->
		<form class="flex flex-col justify-center items-center mt-8" on:submit={createTodo}>
			<input
				class="w-96 p-2 rounded-md border-2 border-gray-400 focus:border-gray-600 focus:outline-none text-black"
				type="text"
				placeholder="What do you need to do?"
				bind:value={todo}
				id="todo_input"
			/>
			{#if error}
				<p class="text-red-400">{error}</p>
			{/if}
			<button
				class="w-96 p-2 mt-2 rounded-md bg-zinc-600 hover:bg-zinc-700 focus:outline-none duration-200"
				type="submit">Create Todo</button
			>
		</form>
		<!-- div to display the todos -->
		<div class="flex flex-col justify-center items-center mt-8">
			{#each [...$todoStore] as todo (todo.id)}
				<div
					class="w-96 p-2 rounded-md border-2 border-gray-400 justify-between items-center flex mt-2"
					transition:fade
				>
					<p class="text-xl">{todo.text}</p>
					<div class="flex space-x-2">
						<button
							class="p-2 rounded-md bg-zinc-600 hover:bg-zinc-700 focus:outline-none duration-200"
							type="button"
							on:click={() => todoStore.toggleDone(todo.id)}
						>
							{#if todo.done}
								<svg
									class="w-6 h-6 text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							{:else}
								<svg
									class="w-6 h-6 text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							{/if}
						</button>
						<!-- delete button -->
						<button
							class="p-2 rounded-md bg-zinc-600 hover:bg-zinc-700 focus:outline-none duration-200"
							type="button"
							on:click={() => todoStore.removeTodo(todo.id)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-6 h-6 fill-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 448 512"
								><path
									d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
								/></svg
							>
						</button>
					</div>
				</div>
			{/each}
		</div>
		<button
			class="w-96 p-2 mt-2 rounded-md bg-zinc-600 hover:bg-zinc-700 focus:outline-none duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-600"
			type="button"
			disabled={todos.length === 0}
			on:click={() => {
				todoStore.reset();
			}}>Clear Todos</button
		>
		<button
			class="w-96 p-2 mt-2 rounded-md bg-zinc-600 hover:bg-zinc-700 focus:outline-none duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-600"
			type="button"
			disabled={todos.filter((todo) => todo.done).length === 0}
			on:click={() => {
				todoStore.clearCompleted();
			}}>Clear Completed Todos</button
		>
	</div>
</main>
