<script>
    let { numActive, currentFilter, numCompleted, onRemoveCompletedItems } = $props();
</script>

<footer class="footer">
    <span class="todo-count">
        <strong>{numActive}</strong>
        {numActive === 1 ? "item" : "items"} left
    </span>

    <ul class="filters">
        <li><a class:selected={currentFilter === "all"} href="#/">All</a></li>
        <li><a class:selected={currentFilter === "active"} href="#/active">Active</a></li>
        <li><a class:selected={currentFilter === "completed"} href="#/completed">Completed</a></li>
    </ul>

    {#if numCompleted}
        <button class="clear-completed" onclick={onRemoveCompletedItems}> Clear completed </button>
    {/if}
</footer>
