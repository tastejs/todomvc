<script>
    let { numActive, currentFilter, numCompleted, onRemoveCompletedItems, hidden = false } = $props();
</script>

<footer class="footer" {hidden}>
    <span class="todo-count">
        <strong>{numActive}</strong>
        {numActive === 1 ? "item" : "items"} left
    </span>

    <ul class="filters">
        <li><a class:selected={currentFilter === "all"} href="#/">All</a></li>
        <li><a class:selected={currentFilter === "active"} href="#/active">Active</a></li>
        <li><a class:selected={currentFilter === "completed"} href="#/completed">Completed</a></li>
    </ul>

    <button class="clear-completed" onclick={onRemoveCompletedItems} hidden={numCompleted === 0}>
        Clear completed
    </button>
</footer>
