<script>
    import { createEventDispatcher } from 'svelte';

    export let numActive;
    export let currentFilter;
    export let numCompleted;

    const dispatch = createEventDispatcher();

    function removeCompletedItems(e) {
        dispatch('removeCompletedItems');
    }
</script>

<footer class="footer">
    <span class="todo-count">
        <strong>{numActive}</strong>
        {numActive === 1 ? "item" : "items"} left
    </span>

    <ul class="filters">
        <li><a class={currentFilter === "all" ? "selected" : ""} href="#/">All</a></li>
        <li><a class={currentFilter === "active" ? "selected" : ""} href="#/active">Active</a></li>
        <li><a class={currentFilter === "completed" ? "selected" : ""} href="#/completed">Completed</a></li>
    </ul>

    {#if numCompleted}
        <button class="clear-completed" on:click={removeCompletedItems}> Clear completed </button>
    {/if}
</footer>
